---
title: "GitOps for RDS: Replacing Manual Database Credentials with Code-Driven User Management"
date: "2026-03-03"
description: "How we eliminated shared database passwords and manual credential management by building a GitOps workflow where every database user, privilege, and schema change is a versioned SQL migration -applied automatically via Kubernetes Jobs with zero static credentials."
tags: ["GitOps", "AWS", "Kubernetes", "Database", "Security", "Go", "DevOps"]
---

Managing database users by hand doesn't scale. We learned this the hard way -shared passwords in Slack threads, `CREATE USER` statements run from someone's laptop, and no record of who granted what to whom.

This post covers how we replaced that with a GitOps workflow where every database user, privilege, and schema change is a versioned SQL migration, applied automatically via Kubernetes Jobs with zero static credentials.

## The Problem: Manual Credentials and Shared Passwords

Our setup was typical for a small team moving fast. Someone needed database access, so an engineer would SSH into a bastion host (or connect via a GUI client), run a `CREATE USER` statement, and share the password over Slack or a shared doc.

This worked until it didn't. Here's what went wrong:

**Shared credentials across applications.** The same username/password pair ended up in multiple services. An application that only needed read access was using the same credentials as one that needed write access. When we rotated one password, three services went down because nobody remembered they all shared it.

**No audit trail.** When a production incident required understanding who had access to what, we had no source of truth. The database's `mysql.user` table showed the *current* state, but not *why* a user existed, *when* it was created, or *who* requested it. Reviewing access meant pinging engineers in Slack.

**Environment drift.** Development, staging, and production had different users with different privileges. Nobody was quite sure if staging matched production, because changes were applied by hand and sometimes forgotten. A migration that worked in staging would fail in production because the user it depended on didn't exist.

**Password hygiene.** Passwords lived in environment variables baked into deployment configs, sometimes checked into private repos, sometimes copy-pasted into AWS Parameter Store with no rotation policy. Some passwords hadn't been changed in over a year.

**No rollback path.** When a `GRANT` statement gave too-broad privileges, the fix was another manual session. There was no way to revert a change atomically, and no record of what the previous state was.

## The Goal: Database Changes as Code

We wanted the same workflow we use for application code:

1. A developer proposes a schema or user change as a pull request.
2. The team reviews the SQL diff.
3. On merge, the change is applied automatically to the target environment.
4. Every change is versioned, reversible, and auditable in Git history.
5. No human ever types a password or connects to the database directly.

## The Solution: db-migrate

We built a Go CLI tool that applies SQL migrations to RDS MySQL databases. It runs as a Kubernetes Job in EKS, authenticates to AWS Secrets Manager via IRSA (no static credentials), and applies versioned migration files that define users, privileges, and schema changes.

### Architecture

The tool is split across three repos to separate concerns:

```
       ┌────────────────────────────┐
       │        migrate-tool        │
       │     Go CLI + base image    │
       └─────────────┬──────────────┘
                     │
          registry:migrate-tool:stable
                     │
           ┌─────────┴──────────┐
           ▼                    ▼
  ┌────────────────────┐ ┌────────────────────┐
  │ service-a-schema   │ │ service-b-schema   │
  │                    │ │                    │
  │  • sql/            │ │  • sql/            │
  │  • Dockerfile      │ │  • Dockerfile      │
  │  • CI pipeline     │ │  • CI pipeline     │
  └────────────────────┘ └────────────────────┘
```

**The migration tool repo** is the shared base. It contains the Go binary, the container image, and all the migration logic -goose wrapper, AWS Secrets Manager integration, SQL validation. It knows *how* to run migrations but has no SQL files of its own.

**Schema repos** (one per database) contain the actual SQL migration files. Each repo's Dockerfile layers its `sql/` directory onto the base image:

```dockerfile
FROM <registry>/migrate-tool:stable
COPY sql /app/sql
```

This separation means:

- SQL changes go through PR review in the schema repo, independent of the tool itself.
- The base image is built and tested once. Schema repos inherit bug fixes and features on rebuild.
- Each database has its own migration history, its own CI pipeline, and its own Git log as the audit trail.

### No Static Credentials: IRSA All the Way Down

The key design decision was eliminating static credentials entirely. The tool never sees a password in an environment variable or a config file. Instead:

1. The Kubernetes Job runs with a dedicated service account annotated with an IAM role.
2. IRSA (IAM Roles for Service Accounts) injects temporary AWS credentials into the pod via a projected service account token.
3. The tool uses those credentials to call AWS Secrets Manager and retrieve the database password at runtime.
4. The password exists only in memory for the duration of the migration.

```go
func (sm *SecretsManager) GetDBPassword(secretName string) (string, error) {
    result, err := sm.client.GetSecretValue(context.TODO(),
        &secretsmanager.GetSecretValueInput{
            SecretId: &secretName,
        },
    )
    if err != nil {
        return "", fmt.Errorf("failed to get secret: %w", err)
    }

    var secret map[string]string
    json.Unmarshal([]byte(*result.SecretString), &secret)

    return secret["password"], nil
}
```

The secret path follows a naming convention (e.g., `/<env>/rds/<database>/credentials`). The IAM role is scoped to only access secrets matching that path pattern. No human needs to know the password. No application config contains it. Rotation happens in Secrets Manager without touching any deployment.

### SQL Migrations as the Source of Truth

Every database user, every `GRANT`, every schema change is a numbered SQL file in the schema repo:

```
sql/
├── 001_create_database.sql
├── 002_create_app_users.sql
├── 003_grant_read_access.sql
├── 004_grant_write_access.sql
├── 005_add_monitoring_user.sql
```

Each file uses [goose](https://github.com/pressly/goose) annotations with both Up and Down sections, so every change is reversible:

```sql
-- +goose Up
-- +goose ENVSUB ON

CREATE USER IF NOT EXISTS '${APP_USER_PREFIX}reader'@'%'
    IDENTIFIED BY 'changeme';

GRANT SELECT ON ${DATABASE}.* TO '${APP_USER_PREFIX}reader'@'%';

FLUSH PRIVILEGES;

-- +goose Down
-- +goose ENVSUB ON

REVOKE ALL PRIVILEGES ON ${DATABASE}.* FROM '${APP_USER_PREFIX}reader'@'%';

DROP USER IF EXISTS '${APP_USER_PREFIX}reader'@'%';
```

The `${APP_USER_PREFIX}` and `${DATABASE}` placeholders are resolved at runtime based on the target environment. In development, `${APP_USER_PREFIX}` becomes `dev_`; in production, `prod_`. Same SQL file, environment-specific results:

```go
func (c *Config) SetGooseEnvVars() error {
    prefix := envPrefix(c.Environment) + "_" // "dev_", "staging_", "prod_"
    for _, kv := range [][2]string{
        {"APP_USER_PREFIX", prefix},
        {"DATABASE", c.DBName},
        {"ENVIRONMENT", c.Environment},
    } {
        os.Setenv(kv[0], kv[1])
    }
    return nil
}
```

This means the same migration creates `dev_reader` in development and `prod_reader` in production. No copy-pasting SQL between environments. No forgetting to run a statement in staging.

### Embedding Goose as a Library

We use [pressly/goose](https://github.com/pressly/goose) as an embedded Go library rather than a standalone binary. The `NewProvider` pattern gives us a type-safe, in-process migration engine:

```go
func NewClient(dsn, sqlDir string, opts ...Option) (*Client, error) {
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        return nil, fmt.Errorf("failed to open database: %w", err)
    }

    if err := db.Ping(); err != nil {
        db.Close()
        return nil, fmt.Errorf("failed to ping database: %w", err)
    }

    provider, err := gooselib.NewProvider(
        gooselib.DialectMySQL, db, os.DirFS(sqlDir),
        gooselib.WithVerbose(true),
    )
    if err != nil {
        db.Close()
        return nil, fmt.Errorf("failed to create goose provider: %w", err)
    }

    return &Client{db: db, provider: provider}, nil
}
```

Migrations are applied with `provider.Up(ctx)`, rolled back with `provider.Down(ctx)`, and status is queried with `provider.Status(ctx)`. The entire tool compiles to a single static binary, running in a ~20MB Alpine container.

### The Container

The Dockerfile is minimal -Alpine, CA certificates (for TLS connections to RDS and AWS APIs), and the binary:

```dockerfile
FROM alpine:3.21

LABEL description="Database Migration CLI via Goose"

RUN apk add --no-cache ca-certificates

COPY db-migrate /usr/bin/db-migrate

WORKDIR /app

ENTRYPOINT ["/usr/bin/db-migrate"]
```

## The GitOps Workflow

Here's the end-to-end flow when someone needs a new database user.

### 1. Open a PR in the Schema Repo

A developer adds a new migration file:

```sql
-- sql/006_add_analytics_reader.sql

-- +goose Up
-- +goose ENVSUB ON

CREATE USER IF NOT EXISTS '${APP_USER_PREFIX}analytics_reader'@'%'
    IDENTIFIED BY 'changeme';

GRANT SELECT ON ${DATABASE}.reports TO '${APP_USER_PREFIX}analytics_reader'@'%';
GRANT SELECT ON ${DATABASE}.trades TO '${APP_USER_PREFIX}analytics_reader'@'%';

FLUSH PRIVILEGES;

-- +goose Down
-- +goose ENVSUB ON

REVOKE ALL PRIVILEGES ON ${DATABASE}.* FROM '${APP_USER_PREFIX}analytics_reader'@'%';
DROP USER IF EXISTS '${APP_USER_PREFIX}analytics_reader'@'%';
```

### 2. CI Validates the SQL

The `validate-sql` tool runs in CI to enforce file naming and annotation conventions:

```go
migrationPattern := regexp.MustCompile(`^\d{3}_[a-z0-9_]+\.sql$`)
```

Files must match `NNN_snake_case.sql`, contain a `-- +goose Up` annotation, and include at least one SQL keyword. This catches common mistakes before review.

### 3. Team Reviews the Diff

The PR shows exactly what access is being granted, to which user, on which tables. Reviewers can verify the principle of least privilege is followed. The Git history becomes the audit log: who requested the change, who approved it, when it was merged.

### 4. Merge Triggers Migration

On merge to main, the CI pipeline:

1. Builds the layered container image (base + SQL).
2. Pushes it to the container registry.
3. Triggers a Kubernetes Job in the target cluster.
4. The Job runs the migration tool against the target environment.
5. The pod authenticates to Secrets Manager via IRSA, retrieves the DB password, and applies pending migrations.

### 5. Rollback if Needed

If something goes wrong, rolling back is a single command:

```bash
db-migrate rollback production --database myservice
```

This executes the `-- +goose Down` section of the last applied migration, cleanly reverting the change. No guessing what the previous state was -it's defined in the SQL file.

## How Authentication Actually Works

Creating database users via GitOps is only half the problem. The other half is: how do applications and engineers actually *authenticate* to the database once those users exist? We built a layered approach that eliminates static passwords for both sides.

### The Two Authentication Paths

```
         ┌────────────────────────────────┐
         │           RDS MySQL            │
         │                                │
         │  Password Auth   IAM Token Auth│
         │  (migration)     (runtime)     │
         └───────┬──────────────┬─────────┘
                 │              │
                 v              v
         Secrets Manager  RDS IAM Auth
        (password at rest)(15-min tokens)
                 │              │
                 v              v
         ┌──────────────┐┌──────────────┐
         │ db-migrate   ││ Apps + Engs  │
         │ K8s Job      ││ IRSA + SSO   │
         │ IRSA         ││ No passwords │
         └──────────────┘└──────────────┘
```

**The migration tool** uses password-based auth. It retrieves the database master password from Secrets Manager via IRSA and connects with standard MySQL credentials. This is a deliberate choice -the migration tool needs `CREATE USER` and `GRANT` privileges that require a highly-privileged database user, and it only runs for seconds during a K8s Job.

**Applications and engineers** use RDS IAM authentication. Instead of a stored password, they generate short-lived SigV4-signed tokens that expire after 15 minutes. No password is ever stored, transmitted, or rotated.

### Application Authentication: IAM Auth Libraries

We built thin wrapper libraries for Node.js and Python that handle IAM token generation and automatic refresh. The key insight is injecting the token at connection time, not at configuration time, so the token is always fresh.

**Node.js (Sequelize):**

```typescript
import { createSequelize } from 'rds-iam-auth';

// IAM auth -- no password anywhere
const sequelize = createSequelize({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  region: process.env.AWS_REGION,
  iamAuth: true,
});
```

Under the hood, the library uses the AWS SDK's RDS Signer to generate a fresh token on every connection via a Sequelize `beforeConnect` hook:

```typescript
sequelize.addHook('beforeConnect', async (config) => {
  config.password = await generateAuthToken({
    hostname: host,
    port: port,
    username: user,
    region: region,
  });
});
```

**Python (SQLAlchemy):**

```python
from rds_iam_auth import create_async_engine

# Same pattern -- IAM auth, no password
engine = create_async_engine({
    "host": os.environ["DB_HOST"],
    "user": os.environ["DB_USER"],
    "database": os.environ["DB_NAME"],
    "region": os.environ["AWS_REGION"],
    "iam_auth": True,
})
```

The Python library uses `boto3.client('rds').generate_db_auth_token()` and attaches a SQLAlchemy event listener to refresh the token before each connection.

Both libraries follow the same design principles:

- **Config-first API** with discriminated union types -the type system enforces that you provide either `iamAuth: true` (no password needed) or a `password` field (fallback mode), never both.
- **Fallback to password auth** for local development where IAM auth isn't available.
- **Same environment variables** across both languages (`DB_HOST`, `DB_USER`, `DB_NAME`, `DB_IAM_AUTH`, etc.) so switching between Node.js and Python services doesn't require reconfiguring the deployment.

### Engineer Authentication: CLI Token Generator

Engineers need ad-hoc database access for debugging, but we didn't want them storing passwords locally. We built a CLI tool that generates temporary IAM auth tokens:

```bash
$ mytools db token --env production --database orders
```

The CLI:

1. Reads database connection details from a local config file (`~/.mytools.yaml`) or CLI flags.
2. Authenticates to AWS via SSO (the engineer's existing browser session).
3. Calls `rds.GenerateDBAuthToken()` to create a 15-minute signed token.
4. Copies the token to the clipboard and prints a ready-to-run connection command:

```
mariadb -h db-host.cluster-xxx.rds.amazonaws.com:3306 \
  -u prod_engineer --ssl -p"<TOKEN>"
```

No password is ever stored on the engineer's laptop. The token expires in 15 minutes. Access is controlled by IAM policies tied to the engineer's SSO role, so revoking access means revoking their AWS role -no database-level password rotation needed.

### Password Generation for Initial Setup

When the migration tool creates a new database user (via `CREATE USER ... IDENTIFIED BY`), it needs an initial password. We built a small CLI for this:

```bash
# Generate a 32-character password with symbols
$ mkpassword --length 32 --symbols
# Output: xK9#mP2$vL7@nQ4&...

# Generate and encrypt with KMS before storing
$ mkpassword --length 32 --symbols --kms my-rds-key
# Output: base64-encoded ciphertext
```

The generated password goes into Secrets Manager (manually or via Terraform), where it's only ever accessed by the migration tool via IRSA. Engineers and applications never see it -they use IAM tokens instead.

### Why Two Auth Methods?

A natural question: if IAM auth is better, why does the migration tool still use password auth?

The migration tool needs `CREATE USER`, `GRANT`, and `ALTER` privileges -essentially admin-level access. RDS IAM authentication maps to a specific database user, and that user still needs to be created with those privileges somehow. The admin password stored in Secrets Manager is the bootstrap credential. It's used only by the migration tool, only during K8s Jobs, and only for seconds at a time.

Everything else -application connections, engineer access, monitoring -uses IAM tokens. The password is an implementation detail that no human or application ever touches directly.

## CI/CD Pipeline

### Image Build and Promotion

The base image uses a two-tag strategy to prevent untested changes from reaching schema repos:

```
  push to main ───► :dev tag (automatic)
                       │
  manual promote ──────┴───► :stable tag
```

Every push to `main` builds and tags the image as `:dev`. When validated, a manual `workflow_dispatch` promotes `:dev` to `:stable` using `docker buildx imagetools create` (a manifest-only operation -no rebuild). Schema repos pin to `:stable`.

### CLI Commands

The CLI is built with [cobra](https://github.com/spf13/cobra):

```bash
# Apply all pending migrations
db-migrate migrate development
db-migrate migrate staging --database payments

# Roll back the last applied migration
db-migrate rollback staging --database payments

# Check which migrations have been applied
db-migrate status production

# Show current database version
db-migrate version production

# Validate configuration and DB connectivity
db-migrate validate production --database orders
```

## Lessons Learned

### CGO and Alpine Don't Mix

Our first CI build produced a binary that segfaulted on Alpine. Go's `net` package uses CGO by default for DNS resolution on Linux, and the CGO-linked binary expected glibc. Alpine uses musl.

**Fix:** Build with `CGO_ENABLED=0` to force Go's pure-Go DNS resolver. This is a common gotcha when deploying Go binaries to Alpine-based containers and worth remembering for any Go project targeting minimal container images.

### Environment Naming Inconsistencies Will Bite You

If your infrastructure uses different naming conventions in different places (e.g., `staging` for RDS endpoints but `stg` for database user prefixes), a single shared prefix map won't work. We hit a subtle bug where the tool connected to the right database but created users with the wrong prefix because infrastructure naming and application naming had diverged over time.

The fix was maintaining explicit, separate prefix maps:

```go
var infraPrefixes = map[string]string{
    "development": "dev",
    "staging":     "staging",
    "production":  "prod",
}

var appPrefixes = map[string]string{
    "development": "dev",
    "staging":     "stg",
    "production":  "prod",
}
```

The lesson: don't assume naming conventions are consistent across your stack. Make the mapping explicit and test it.

### Start with Least Privilege in Your SQL

It's tempting to write `GRANT ALL` in development and tighten later. Don't. Write your migrations with the exact privileges each user needs from day one. The GitOps workflow makes it easy to add privileges later via a new migration, but revoking overly-broad grants retroactively is messy and error-prone.

### The Audit Trail is the Real Win

We built this tool to solve a credential management problem. But the biggest payoff turned out to be the audit trail. When a security review asks "who has access to the production database and why?", the answer is `git log sql/`. Every user, every privilege, every change -with the PR discussion that justified it.

## Before and After

| | Before | After |
|---|---|---|
| **User creation** | Manual SQL from a laptop | PR-reviewed migration file |
| **App authentication** | Shared password in env vars | IAM auth tokens (15-min, auto-refreshed) |
| **Engineer access** | Password from Slack or a shared doc | CLI-generated IAM token (15-min, SSO-based) |
| **Password management** | Shared across services, rarely rotated | One admin password in Secrets Manager, accessed only by the migration tool |
| **Access review** | Ping engineers, check mysql.user | `git log sql/` |
| **Environment parity** | Hope staging matches production | Same SQL, different env prefixes |
| **Rollback** | Write another manual SQL statement | `db-migrate rollback <env>` |
| **Audit trail** | None | Full Git history with PR reviews |
| **Credential rotation** | Update every service that shares the password | No rotation needed -apps use ephemeral IAM tokens |

## Key Takeaways

The core insight is simple: **database users and privileges are infrastructure, and infrastructure belongs in code.** By treating every `CREATE USER` and `GRANT` as a versioned, reviewable, reversible migration, we eliminated shared passwords and gained a complete audit trail.

But the migration tool is only one piece. The bigger win was rethinking how everything authenticates to the database:

- **Applications** use IAM auth tokens that expire in 15 minutes -no password to store, leak, or rotate.
- **Engineers** generate temporary tokens via a CLI backed by their AWS SSO session -no password on their laptop.
- **The migration tool** is the only thing that touches the admin password, and it gets it from Secrets Manager at runtime via IRSA.

The result is that nobody shares a password in Slack anymore. Nobody SSHs into a bastion to run SQL. Nobody stores database credentials in environment variables. Every user change is a pull request, every connection is a temporary token, and the full access history lives in Git.

If you're managing database credentials manually today, the path forward doesn't require a massive overhaul. Start with one database, one schema repo, and one Kubernetes Job. The tooling is straightforward -the hard part is the cultural shift from "just run the SQL" to "open a PR."
