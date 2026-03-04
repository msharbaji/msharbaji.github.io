---
title: "Managing GitHub at Enterprise Scale with Terraform"
date: "2024-03-18"
description: "Part 3 of our migration story. How we built a self-service platform to manage 400+ repositories, 27 teams, and security policies across our GitHub organization using Terraform."
tags: ["GitHub", "Terraform", "DevOps", "Security", "IaC"]
series: "cicd-migration"
seriesOrder: 3
---

In [Part 1](/blog/embracing-change-bitbucket-to-github), we covered why we left Estafette and BitBucket. In [Part 2](/blog/choosing-github-comprehensive-comparison), we showed how GitHub won the evaluation. This final post covers what came next - building a system to manage GitHub itself.

## The Problem with Manual Administration

Migrating 400+ repositories and 27 teams to GitHub was just the beginning. The real challenge was governance. Without guardrails, you end up with:

- Repositories created with inconsistent settings
- Branch protection rules that vary team by team
- Secrets scattered across repos with no audit trail
- No standardized way to grant cloud access from CI/CD
- Security policies that exist in documentation but not in code

We needed a system where every GitHub setting is versioned, reviewable, and applied automatically. Infrastructure as Code for GitHub itself.

## GHSSM: GitHub Security and Settings Management

We built **GHSSM** - a Terraform-based platform that manages our entire GitHub organization. Every team, repository, branch protection rule, secret, and cloud access policy is defined in code and applied through pull requests.

The architecture has two layers:

### Organization Settings

The org-level configuration manages things that apply across teams:

- **Organization policies** - who can create repos, default permissions, security defaults
- **Workload Identity Federation pools** - keyless cloud access for GitHub Actions
- **Organization secrets** - shared secrets like registry credentials and scanning tokens
- **Organization rulesets** - default branch protection applied to all repos

### Team Settings

Each of our 27 teams has a dedicated Terraform directory. A team's configuration defines:

- **Repositories** - every repo the team owns, with standardized settings
- **Access control** - which teams and users can push, pull, or admin each repo
- **Branch protection** - required approvals, stale review dismissal, bot bypass rules
- **Secrets and variables** - team-specific CI/CD configuration
- **Cloud access** - GCP service accounts and IAM bindings per repository

## How a Repository Gets Created

Before GHSSM, creating a new repository meant filing a ticket, waiting for a platform engineer, and hoping the settings matched your other repos. Now, any engineer can open a pull request:

```hcl
module "payment-service" {
  source     = "app.terraform.io/xivart/ghssm/travix//modules/repository"
  github_org = "xivart"
  name       = "payment-service"
  pci        = true

  settings = {
    topics     = ["nemesis", "payment"]
    languages  = ["java"]
    ecosystems = ["maven"]
  }

  branch_protection = {
    required_approving_review_count       = 2
    dismiss_stale_reviews                 = true
    renovate_bot_as_pull_request_bypasser = true
  }

  access = {
    teams = [
      { slug = "nemesis", role = "push" }
    ]
  }
}
```

This single module definition creates the repository with:

- Correct topic labels for discoverability
- Language and ecosystem metadata for dependency scanning
- Branch protection with 2 required approvals
- Stale review auto-dismissal
- Renovate bot bypass for automated dependency updates
- Team access scoped to the owning team
- PCI compliance flag for payment-sensitive repos

The pull request triggers a Terraform plan. Reviewers see exactly what will change. On merge, Terraform applies the configuration automatically.

## Keyless Cloud Access with Workload Identity Federation

One of the biggest security wins was eliminating long-lived service account keys. Before GHSSM, teams stored GCP service account JSON keys as GitHub secrets. These keys don't expire, can be leaked, and are hard to rotate.

We replaced them with **Workload Identity Federation (WIF)** - a mechanism where GitHub Actions authenticates directly with GCP using short-lived tokens. No keys stored anywhere.

GHSSM manages the entire WIF chain:

1. **WIF pools** per environment (production, staging, development, techops)
2. **Service accounts** per repository with scoped IAM roles
3. **Attribute mappings** that restrict which repo and branch can assume which identity

```hcl
module "payment_sa" {
  source     = "app.terraform.io/xivart/ghssm/travix//modules/service-account"
  repository = "payment-service"
  github_org = "xivart"
  project_id = "production-sa-container"

  sa_wif_mapping = [
    format(
      "%s/attribute.repository/xivart/payment-service",
      module.production_pool.principal_set_prefix
    )
  ]

  project_iam_roles = [
    { project_id = "payment-prod", role = "roles/compute.admin" }
  ]
}
```

This means the `payment-service` repository can authenticate to GCP and get `compute.admin` on the `payment-prod` project - but only from that specific repo. No other repo can assume this identity.

## Secrets Management

GHSSM handles secrets at two levels:

**Organization secrets** are managed centrally and stored in GCP Secret Manager. These include registry credentials, scanning tokens, and bot access tokens. They're scoped by visibility - some are available to all internal repos, others only to specific repositories.

**Team secrets** are defined per-repository in the team's Terraform configuration. When a team needs a new secret for their CI/CD pipeline, they add it to their config and open a pull request.

The key principle: no secret is created manually through the GitHub UI. Every secret has a code trail showing who added it, when, and why.

## Security Defaults

GHSSM enforces security settings across the organization:

- **Dependabot alerts** enabled on all new repositories
- **Dependabot security updates** enabled automatically
- **Secret scanning** with push protection enabled - accidental secret commits get blocked before they reach the repo
- **Dependency graph** enabled for supply chain visibility
- **Public repo creation** disabled - members cannot accidentally make a repo public

These aren't suggestions written in a wiki. They're Terraform resources that get applied and enforced. If someone changes a setting manually through the UI, the next Terraform run corrects the drift.

## Workflow Automation

The GHSSM repo itself uses GitHub Actions for deployment:

- **Org-settings workflow** triggers on changes to organization-level config
- **Per-team workflows** (27 of them) trigger only on changes to that team's directory
- **Reusable workflow** handles the Terraform plan/apply logic, uploads plan artifacts, and comments on PRs with a summary of changes

On pull request, the workflow runs `terraform plan` and posts the output as a PR comment. Reviewers can see exactly what resources will be created, modified, or destroyed. On merge to main, it runs `terraform apply`.

This separation means a change to one team's repositories doesn't trigger plans for other teams - keeping feedback loops fast.

## Results

After rolling out GHSSM across all 27 teams and 400+ repositories:

- **Zero manual repository creation** - all repos created through pull requests with standardized settings
- **Keyless cloud access** - eliminated all long-lived service account keys via WIF
- **Consistent branch protection** - every repo has required reviews, no exceptions
- **Auditable secrets** - every secret addition traced through git history
- **Self-service for teams** - engineers create repos and configure access without waiting for platform team
- **Drift detection** - manual UI changes get corrected automatically on the next apply

## Lessons Learned

**Start with org-level defaults.** It's tempting to jump straight into per-team configs. But getting the organization-wide policies right first means teams inherit secure defaults without extra work.

**Keep the module interface simple.** Our repository module accepts a flat configuration structure. Teams don't need to understand Terraform internals - they just fill in their repo name, topics, and access rules.

**Separate org and team state.** Having a dedicated Terraform workspace per team means teams can't accidentally break each other's configuration. It also keeps plan output readable.

**Use WIF from day one.** Migrating from service account keys to WIF after the fact is painful. Building it into the platform from the start meant teams never had to deal with key rotation.

## Conclusion

Managing a GitHub organization at scale isn't just about having the right platform - it's about treating the platform configuration itself as code. GHSSM gave us a system where every setting is versioned, every change is reviewed, and every policy is enforced automatically.

The combination of GitHub's API, Terraform's state management, and Workload Identity Federation created a governance model that scales with the organization without creating bottlenecks. Teams move fast because they can self-serve. Security stays consistent because it's codified, not documented.

This concludes our three-part CI/CD migration series. From [identifying the limitations of Estafette](/blog/embracing-change-bitbucket-to-github), to [evaluating GitHub against GitLab](/blog/choosing-github-comprehensive-comparison), to building the infrastructure that makes it all manageable at scale - the journey took us from a self-hosted CI/CD system to a fully governed, self-service platform.
