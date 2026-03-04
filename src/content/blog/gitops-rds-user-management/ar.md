---
title: "GitOps للـ RDS: استبدال الـ Manual Credentials بإدارة مستخدمين مبنية على الكود"
date: "2026-03-03"
description: "كيف تخلّصنا من الـ shared passwords والـ manual credential management -ببناء GitOps workflow يحوّل كل database user وكل privilege إلى versioned SQL migration يُطبَّق تلقائياً عبر Kubernetes Jobs بدون أي static credentials."
tags: ["GitOps", "AWS", "Kubernetes", "Database", "Security", "Go", "DevOps"]
---

إدارة database users يدوياً لا تتوسّع. اكتشفنا ذلك بالطريقة الصعبة -shared passwords في Slack threads، أوامر `CREATE USER` تُنفَّذ من حاسوب أحد المهندسين، ولا يوجد أي record يوضّح من منح ماذا لمن.

في هذا المقال نوضّح كيف استبدلنا كل ذلك بـ GitOps workflow -كل database user، كل privilege، كل schema change أصبح versioned SQL migration، يُطبَّق تلقائياً عبر Kubernetes Jobs بدون أي static credentials.

## المشكلة: Manual Credentials وShared Passwords

كان وضعنا نموذجياً لفريق صغير يتحرك بسرعة. عندما يحتاج أحدهم database access، يدخل مهندس على bastion host (أو يتصل عبر GUI client)، ينفّذ `CREATE USER`، ويرسل الـ password عبر Slack أو shared doc.

نجح هذا النهج لفترة… ثم بدأت المشاكل:

**Shared credentials بين التطبيقات.** نفس الـ username/password انتهى في أكثر من service. تطبيق يحتاج read access فقط كان يستخدم نفس الـ credentials التي يحتاجها تطبيق آخر لـ write access. عندما أجرينا rotate لـ password واحدة، توقفت ثلاث services لأن لا أحد تذكّر أنها جميعاً تتشارك نفس الـ credentials.

**لا يوجد audit trail.** عندما تطلّبت حادثة إنتاج فهم من يملك وصولاً لماذا، لم يكن لدينا source of truth. جدول `mysql.user` يوضّح الحالة *الحالية*، لكن ليس *لماذا* المستخدم موجود، *متى* أُنشئ، أو *من* طلبه. مراجعة الوصول كانت تعني سؤال المهندسين في Slack.

**Environment drift.** بيئات Development وstaging وproduction كان لديها مستخدمون مختلفون بصلاحيات مختلفة. لم يكن أحد متأكداً إذا كانت staging تطابق production، لأن التغييرات كانت تُطبَّق يدوياً وأحياناً تُنسى. Migration يعمل في staging يفشل في production لأن المستخدم الذي يعتمد عليه لم يكن موجوداً.

**Password management.** الـ passwords كانت في environment variables مدفونة في deployment configs، أحياناً محفوظة في private repos، أحياناً منسوخة في AWS Parameter Store بدون rotation policy. بعض الـ passwords لم تتغيّر منذ أكثر من سنة.

**لا يوجد rollback path.** عندما يمنح `GRANT` statement صلاحيات أوسع من اللازم، كان الحل manual session أخرى. لا توجد طريقة لعمل revert بشكل atomic، ولا يوجد record يوضّح الحالة السابقة.

## الهدف: Database Changes as Code

أردنا نفس سير العمل الذي نستخدمه للكود:

1. المطوّر يقترح تغيير schema أو مستخدم عبر pull request.
2. الفريق يراجع الـ SQL diff.
3. عند الدمج، يُطبَّق التغيير تلقائياً على البيئة المستهدفة.
4. كل تغيير مرقّم، قابل للتراجع، وقابل للتدقيق في تاريخ Git.
5. لا أحد يكتب كلمة مرور أو يتصل بقاعدة البيانات مباشرة.

## الحل: db-migrate

بنينا Go CLI tool تُطبّق SQL migrations على RDS MySQL databases. تعمل كـ Kubernetes Job في EKS، تتصادق مع AWS Secrets Manager عبر IRSA (بدون static credentials)، وتُطبّق versioned migration files تعرّف الـ users والـ privileges والـ schema changes.

### البنية

الأداة مقسّمة على ثلاث repos لفصل المسؤوليات:

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

**ريبو أداة الـ Migration** هو القاعدة المشتركة. يحتوي على Go binary، صورة الـ container، وكامل منطق الـ migration -غلاف goose، تكامل AWS Secrets Manager، والتحقق من SQL. يعرف *كيف* يشغّل migrations لكن لا يملك ملفات SQL خاصة به.

**ريبوهات الـ Schema** (واحد لكل قاعدة بيانات) تحتوي على ملفات SQL migration الفعلية. كل ريبو Dockerfile يضيف مجلد `sql/` فوق الصورة الأساسية:

```dockerfile
FROM <registry>/migrate-tool:stable
COPY sql /app/sql
```

هذا الفصل يعني:

- تغييرات SQL تمر بمراجعة PR في ريبو الـ schema، مستقلة عن الأداة نفسها.
- الصورة الأساسية تُبنى وتُختبر مرة واحدة. ريبوهات الـ schema ترث الإصلاحات والميزات عند إعادة البناء.
- كل قاعدة بيانات لديها تاريخ migration خاص، CI pipeline خاص، وسجل Git كـ audit trail.

### بدون Static Credentials: IRSA All the Way Down

القرار التصميمي الأساسي كان إلغاء الـ static credentials بالكامل. الأداة لا ترى password في environment variable أو config file أبداً. بدلاً من ذلك:

1. الـ Kubernetes Job يعمل بـ service account مربوط بـ IAM role.
2. IRSA (IAM Roles for Service Accounts) يحقن AWS credentials مؤقتة في الـ pod عبر projected service account token.
3. الأداة تستخدم هذه الـ credentials للاتصال بـ AWS Secrets Manager واسترجاع كلمة مرور قاعدة البيانات وقت التشغيل.
4. كلمة المرور تبقى في الذاكرة فقط طوال مدة الـ migration.

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

مسار الـ secret يتبع naming convention (مثلاً `/<env>/rds/<database>/credentials`). الـ IAM role مقيّد للوصول فقط للـ secrets التي تطابق هذا الـ pattern. لا أحد يحتاج معرفة الـ password. لا يوجد application config يحتويها. الـ rotation يتم في Secrets Manager بدون المساس بأي deployment.

### SQL Migrations كـ Source of Truth

كل database user، كل `GRANT`، كل schema change هو ملف SQL مرقّم في ريبو الـ schema:

```
sql/
├── 001_create_database.sql
├── 002_create_app_users.sql
├── 003_grant_read_access.sql
├── 004_grant_write_access.sql
├── 005_add_monitoring_user.sql
```

كل ملف يستخدم annotations خاصة بـ [goose](https://github.com/pressly/goose) مع قسمين Up وDown، فكل تغيير قابل للتراجع:

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

الـ placeholders مثل `${APP_USER_PREFIX}` و`${DATABASE}` تُحلّ وقت التشغيل حسب البيئة المستهدفة. في development يصبح `${APP_USER_PREFIX}` هو `dev_`؛ وفي production يصبح `prod_`. نفس ملف SQL، نتائج مختلفة حسب البيئة:

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

أي أن نفس الـ migration ينشئ `dev_reader` في development و`prod_reader` في production. لا نسخ ولصق SQL بين البيئات. لا نسيان تنفيذ أمر في staging.

### Embedding Goose كـ Library

نستخدم [pressly/goose](https://github.com/pressly/goose) كـ embedded Go library بدلاً من standalone binary. نمط `NewProvider` يوفّر type-safe migration engine يعمل in-process:

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

تُطبَّق الـ migrations بـ `provider.Up(ctx)`، وتُرجَع بـ `provider.Down(ctx)`، ويُستعلَم الـ status بـ `provider.Status(ctx)`. الأداة كاملة تُترجَم إلى single static binary، يعمل في Alpine container بحجم ~20MB.

### الـ Container

الـ Dockerfile بسيط -Alpine، شهادات CA (لاتصالات TLS مع RDS وواجهات AWS)، والـ binary:

```dockerfile
FROM alpine:3.21

LABEL description="Database Migration CLI via Goose"

RUN apk add --no-cache ca-certificates

COPY db-migrate /usr/bin/db-migrate

WORKDIR /app

ENTRYPOINT ["/usr/bin/db-migrate"]
```

## سير عمل GitOps

هذا المسار الكامل عندما يحتاج أحدهم database user جديد.

### 1. فتح PR في ريبو الـ Schema

المطوّر يضيف ملف migration جديد:

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

### 2. CI يتحقق من الـ SQL

أداة `validate-sql` تعمل في CI لفرض اصطلاحات تسمية الملفات والـ annotations:

```go
migrationPattern := regexp.MustCompile(`^\d{3}_[a-z0-9_]+\.sql$`)
```

يجب أن تطابق الملفات `NNN_snake_case.sql`، وتحتوي على `-- +goose Up`، وتتضمن SQL keyword واحد على الأقل. هذا يكشف الأخطاء الشائعة قبل المراجعة.

### 3. الفريق يراجع الـ Diff

الـ PR يوضّح بالضبط ما هو الوصول الذي يُمنح، لأي مستخدم، على أي جداول. يستطيع المراجعون التأكد من اتّباع مبدأ least privilege. تاريخ Git يصبح الـ audit log: من طلب التغيير، من وافق عليه، ومتى دُمج.

### 4. الدمج يُشغّل الـ Migration

عند الدمج في main، الـ CI pipeline:

1. يبني صورة الـ container متعددة الطبقات (base + SQL).
2. يرفعها إلى الـ container registry.
3. يُشغّل Kubernetes Job في الـ cluster المستهدف.
4. الـ Job يشغّل أداة الـ migration على البيئة المستهدفة.
5. الـ pod يتصادق مع Secrets Manager عبر IRSA، يسترجع كلمة مرور DB، ويُطبّق الـ migrations المعلّقة.

### 5. التراجع إذا لزم الأمر

إذا حدث خطأ، التراجع أمر واحد:

```bash
db-migrate rollback production --database myservice
```

هذا ينفّذ قسم `-- +goose Down` من آخر migration مُطبَّق، ويُرجع التغيير بشكل نظيف. لا حاجة لتخمين الحالة السابقة -هي محددة في ملف SQL.

## كيف يعمل الـ Authentication فعلياً

إنشاء database users عبر GitOps نصف المشكلة فقط. النصف الآخر: كيف تتصادق التطبيقات والمهندسون مع قاعدة البيانات بعد إنشاء المستخدمين؟ بنينا layered approach يلغي الـ static passwords للطرفين.

### الـ Two Authentication Paths

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

**أداة الـ Migration** تستخدم password-based auth. تسترجع الـ database master password من Secrets Manager عبر IRSA وتتصل بـ MySQL credentials عادية. هذا قرار متعمّد -الأداة تحتاج `CREATE USER` و`GRANT` privileges التي تتطلب highly-privileged database user، وتعمل لثوانٍ فقط خلال K8s Job.

**التطبيقات والمهندسون** يستخدمون RDS IAM authentication. بدلاً من stored password، يولّدون short-lived SigV4-signed tokens تنتهي بعد 15 دقيقة. لا يوجد password يُخزَّن أو يُنقل أو يُدوَّر.

### Application Authentication: IAM Auth Libraries

بنينا thin wrapper libraries لـ Node.js وPython تتعامل مع IAM token generation والـ auto-refresh. الفكرة الأساسية هي inject الـ token وقت الاتصال وليس وقت الـ configuration، فيكون الـ token دائماً fresh.

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

داخلياً، تستخدم المكتبة AWS SDK's RDS Signer لتوليد fresh token مع كل اتصال عبر Sequelize `beforeConnect` hook:

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

مكتبة Python تستخدم `boto3.client('rds').generate_db_auth_token()` وتربط SQLAlchemy event listener لعمل refresh للـ token قبل كل اتصال.

المكتبتان تتّبعان نفس الـ design principles:

- **Config-first API** مع discriminated union types -الـ type system يفرض توفير إما `iamAuth: true` (لا حاجة لـ password) أو حقل `password` (fallback mode)، وليس الاثنين.
- **Fallback لـ password auth** للـ local development حيث IAM auth غير متاح.
- **نفس الـ environment variables** للغتين (`DB_HOST`، `DB_USER`، `DB_NAME`، `DB_IAM_AUTH`، إلخ) فالتنقل بين خدمات Node.js وPython لا يتطلب deployment reconfiguration.

### Engineer Authentication: CLI Token Generator

يحتاج المهندسون database access للـ debugging، لكن لم نُرد أن يخزّنوا passwords محلياً. بنينا CLI tool تولّد temporary IAM auth tokens:

```bash
$ mytools db token --env production --database orders
```

الـ CLI:

1. يقرأ تفاصيل الاتصال بقاعدة البيانات من ملف config محلي (`~/.mytools.yaml`) أو CLI flags.
2. يتصادق مع AWS عبر SSO (جلسة المتصفح الموجودة للمهندس).
3. يستدعي `rds.GenerateDBAuthToken()` لإنشاء token مُوقَّع لمدة 15 دقيقة.
4. ينسخ الـ token إلى الحافظة ويطبع أمر اتصال جاهزاً للتنفيذ:

```
mariadb -h db-host.cluster-xxx.rds.amazonaws.com:3306 \
  -u prod_engineer --ssl -p"<TOKEN>"
```

لا يوجد password مُخزَّن على حاسوب المهندس. الـ token ينتهي بعد 15 دقيقة. يُتحكَّم بالـ access عبر IAM policies مربوطة بـ SSO role الخاص بالمهندس، فإلغاء الوصول يعني إلغاء الـ AWS role -لا حاجة لـ database-level password rotation.

### Password Generation للـ Initial Setup

عندما تنشئ أداة الـ migration مستخدم database جديد (عبر `CREATE USER ... IDENTIFIED BY`)، تحتاج initial password. بنينا CLI صغيراً لهذا:

```bash
# Generate a 32-character password with symbols
$ mkpassword --length 32 --symbols
# Output: xK9#mP2$vL7@nQ4&...

# Generate and encrypt with KMS before storing
$ mkpassword --length 32 --symbols --kms my-rds-key
# Output: base64-encoded ciphertext
```

الـ generated password تُخزَّن في Secrets Manager (يدوياً أو عبر Terraform)، ولا يصل إليها سوى أداة الـ migration عبر IRSA. المهندسون والتطبيقات لا يرونها أبداً -يستخدمون IAM tokens بدلاً من ذلك.

### لماذا Two Auth Methods؟

سؤال طبيعي: إذا كان IAM auth أفضل، فلماذا لا تزال أداة الـ migration تستخدم password auth؟

أداة الـ migration تحتاج `CREATE USER` و`GRANT` و`ALTER` privileges -أي admin-level access. الـ RDS IAM authentication يُربط بـ specific database user، وهذا المستخدم لا يزال يحتاج أن يُنشأ بهذه الـ privileges بطريقة ما. الـ admin password المخزّنة في Secrets Manager هي الـ bootstrap credential. تُستخدم فقط من أداة الـ migration، فقط خلال K8s Jobs، ولثوانٍ فقط.

كل شيء آخر -application connections، engineer access، monitoring -يستخدم IAM tokens. الـ password هي implementation detail لا يلمسها أي إنسان أو تطبيق مباشرة.

## CI/CD Pipeline

### Image Build والـ Promotion

الـ base image تستخدم two-tag strategy لمنع التغييرات غير المختبرة من الوصول إلى schema repos:

```
  push to main ───► :dev tag (automatic)
                       │
  manual promote ──────┴───► :stable tag
```

كل push إلى `main` يبني ويعطي الـ image تاغ `:dev`. عند التحقق، يقوم manual `workflow_dispatch` بترقية `:dev` إلى `:stable` باستخدام `docker buildx imagetools create` (manifest-only operation -بدون rebuild). الـ schema repos تُثبَّت على `:stable`.

### أوامر CLI

الـ CLI مبني بـ [cobra](https://github.com/spf13/cobra):

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

### CGO وAlpine لا يتوافقان

أول CI build أنتج binary تسبّب في segfault على Alpine. حزمة `net` في Go تستخدم CGO بشكل default لـ DNS resolution على Linux، والـ CGO-linked binary كان يتوقع glibc. بينما Alpine يستخدم musl.

**الحل:** البناء بـ `CGO_ENABLED=0` لإجبار Go على استخدام pure-Go DNS resolver. هذه المشكلة شائعة عند نشر Go binaries في Alpine-based containers وتستحق التذكّر لأي Go project يستهدف minimal container images.

### Environment Naming Inconsistencies ستسبب مشاكل

إذا كانت الـ infrastructure تستخدم naming conventions مختلفة في أماكن مختلفة (مثلاً `staging` لـ RDS endpoints لكن `stg` لـ database user prefixes)، فإن shared prefix map واحدة لن تنجح. واجهنا subtle bug حيث اتصلت الأداة بالـ database الصحيحة لكن أنشأت users بـ prefix خاطئ لأن infrastructure naming وapplication naming تباعدا مع الوقت.

الحل كان explicit, separate prefix maps:

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

الدرس: لا تفترض أن الـ naming conventions متسقة عبر جميع layers الـ infrastructure. اجعل الـ mapping صريحاً واختبره.

### ابدأ بـ Least Privilege في SQL

من المغري كتابة `GRANT ALL` في development وتشديد الصلاحيات لاحقاً. لا تفعل ذلك. اكتب الـ migrations بالـ privileges الدقيقة التي يحتاجها كل مستخدم من اليوم الأول. سير عمل GitOps يسهّل إضافة privileges لاحقاً عبر migration جديد، لكن إلغاء broad grants بأثر رجعي فوضوي ومعرّض للأخطاء.

### الـ Audit Trail هو المكسب الحقيقي

بنينا هذه الأداة لحل مشكلة credential management. لكن أكبر مكسب تبيّن أنه الـ audit trail. عندما تسأل security review "من يملك access لـ production database ولماذا؟"، الجواب هو `git log sql/`. كل user، كل privilege، كل تغيير -مع الـ PR discussion الذي برّره.

## قبل وبعد

| | Before | After |
|---|---|---|
| **User creation** | SQL يدوي من حاسوب | ملف migration مراجَع عبر PR |
| **App authentication** | كلمة مرور مشتركة في env vars | IAM auth tokens (15 دقيقة، auto-refresh) |
| **Engineer access** | كلمة مرور من Slack أو مستند مشترك | IAM token عبر CLI (15 دقيقة، SSO-based) |
| **Password management** | مشتركة بين الخدمات، نادراً تُدوَّر | كلمة مرور admin واحدة في Secrets Manager، لا يصل إليها سوى أداة الـ migration |
| **Access review** | سؤال المهندسين، فحص mysql.user | `git log sql/` |
| **Environment parity** | نأمل أن staging تطابق production | نفس SQL، مع env prefixes مختلفة |
| **Rollback** | كتابة SQL يدوي آخر | `db-migrate rollback <env>` |
| **Audit trail** | لا يوجد | تاريخ Git كامل مع PR reviews |
| **Credential rotation** | تحديث كل خدمة تتشارك كلمة المرور | لا حاجة -التطبيقات تستخدم IAM tokens مؤقتة |

## Key Takeaways

الفكرة الجوهرية بسيطة: **الـ database users والـ privileges هم infrastructure، والـ infrastructure مكانها في الكود.** بمعاملة كل `CREATE USER` و`GRANT` كـ versioned, reviewable, reversible migration، تخلّصنا من الـ shared passwords وحصلنا على audit trail كامل.

لكن أداة الـ migration جزء واحد فقط. المكسب الأكبر كان إعادة التفكير في كيفية authenticate كل شيء مع الـ database:

- **التطبيقات** تستخدم IAM auth tokens تنتهي بعد 15 دقيقة -لا يوجد password يُخزَّن أو يُسرَّب أو يُدوَّر.
- **المهندسون** يولّدون temporary tokens عبر CLI مدعوم بـ AWS SSO session -لا يوجد password على حواسيبهم.
- **أداة الـ Migration** هي الشيء الوحيد الذي يلمس الـ admin password، وتأخذها من Secrets Manager وقت التشغيل عبر IRSA.

النتيجة أنه لا أحد يشارك password في Slack بعد الآن. لا أحد يدخل SSH على bastion لتنفيذ SQL. لا أحد يخزّن database credentials في environment variables. كل تغيير مستخدم هو pull request، كل اتصال هو temporary token، وكامل الـ access history يعيش في Git.

إذا كنت تدير database credentials يدوياً اليوم، فالطريق للأمام لا يتطلب massive overhaul. ابدأ بـ database واحدة، schema repo واحد، وKubernetes Job واحد. الأدوات بسيطة -الجزء الصعب هو الـ cultural shift من "نفّذ الـ SQL وانتهى" إلى "افتح PR".
