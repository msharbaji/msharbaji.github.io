---
title: "Embracing Change: From BitBucket to GitHub for Our CI/CD Needs"
date: "2024-01-15"
description: "The story of why and how we migrated from BitBucket and our self-hosted CI/CD system Estafette to GitHub, and the limitations that drove the decision."
tags: ["CI/CD", "GitHub", "DevOps", "Migration"]
series: "cicd-migration"
seriesOrder: 1
---

Welcome to the first part of our migration story. This is where we share how we transitioned from BitBucket to GitHub for our CI/CD needs.

## Why Fix What Ain't Broken?

What prompts a team to consider a change when everything seems to be working fine? For us, it came down to two issues: the constraints of our self-hosted CI/CD system, and how we organized users, teams, and repository ownership in BitBucket.

In tech, as in life, evolution is inevitable. Our journey wasn't sparked by dissatisfaction but by the pursuit of improvement, efficiency, and the ecosystem advantages that GitHub brings to the table.

## Our Self-Hosted CI/CD System

What exactly was this self-hosted system, and what limitations drove the quest for a better solution?

### Estafette: The Heartbeat of Our CI/CD

[Estafette](https://estafette.io) is an open-source, cloud-native CI/CD system that kept our code flowing smoothly from development to deployment. Created by Travix in 2017, Estafette leverages Kubernetes to run build jobs concurrently without the restrictions found in tools like GoCD.

![Estafette CI/CD Architecture](/blog/estafette-architecture.png)

The goals of Estafette were to:

- Manage builds and deployments through a single clear manifest file
- Put control over build dependencies into the manifest
- Handle builds and deployments through CLI, Slack, and a web interface
- Provide insights into build times, deployment times, failure rates, and more
- Enable development teams to create their own extensions
- Support concurrent builds using Kubernetes jobs
- Stay resilient in the face of job execution failures
- Test its components by providing different tracks (dev, beta, stable/latest)
- Upgrade without downtime

## Limitations That Led Us Away from Estafette

Estafette served Travix exceptionally well -better than many alternatives at the time. But over the years, we identified four key areas for improvement: **Maintainability**, **Security**, **User Interface**, and **Missing Features**.

### Maintainability

- **Extended onboarding for new engineers** -New engineers, particularly those involved in tooling, faced a prolonged ramp-up period to understand the system
- **Slow bug-fix turnaround** -Rectifying bugs was time-consuming, and the testing process lacked a straightforward approach for validating changes
- **Complex feature implementation** -Introducing new features often involved significant complexity
- **Troublesome instance and database maintenance** -The upkeep of instances and databases posed ongoing operational challenges

### Security

- **Encryption dependency on a master key stored in a K8s Secret** -This introduced a single point of failure for secrets management
- **Scattered secrets across pipelines with no audit trails** -Secrets were distributed without clear tracking or management of security events
- **Complex secrets rotation** -No streamlined process existed for rotating secrets, making the task error-prone
- **Lack of cluster access control** -Any repository could access any cluster, raising concerns about unauthorized access
- **No workload identity implementation** -Adding this required a major refactor of the security infrastructure
- **Unprotected secrets by environment or branch** -Secrets lacked scoping, potentially exposing sensitive information in non-production contexts

### User Interface

- **Difficulties displaying logs during job execution** -Real-time log presentation was unreliable
- **Release options overridden by outdated branches** -Stale branches could compromise release option availability
- **No filtering for pipelines** -The absence of filters by branch name, tags, or author made navigation inefficient
- **No selective stage reruns** -Failed stages couldn't be individually rerun, requiring full pipeline re-execution

### Missing Features

- **No dependency caching** -The absence of caching impacted build performance
- **Limited rebuild options** -Rebuilds were only available for failures, not for success scenarios
- **No true stage-level parallelization** -This hindered optimal resource utilization
- **No pipeline templating or autocompletion/linting** -Teams had to write manifests without tooling support
- **No Windows runners** -This limited platform compatibility
- **No API/CLI tools and limited artifact access** -Integration and analysis of pipeline artifacts were restricted

While these challenges could have been addressed individually, our small team was occupied with multiple projects aimed at enhancing overall team productivity. As a company, Travix was eager to focus on its core business. We strategically decided to transition to a managed service -enabling us to continue innovating without the added operational complexity.

## Why We Moved Away from BitBucket

Our decision wasn't solely about CI/CD challenges. We also faced problems in how we organized teams and users in BitBucket, including managing repository ownership. Getting these fundamentals right is crucial for smooth collaboration and efficient development.

After evaluating our challenges and exploring alternatives like GitLab and GitHub, we recognized the benefits of consolidating repositories and CI/CD into a single ecosystem. That's why we chose to move to GitHub -simplifying our development process and reducing operational overhead.

## Conclusion

A big thanks to Estafette for an incredible 8 years of service, evolving alongside Travix and helping us deliver quality results. As we bid farewell to Estafette, we acknowledge its invaluable contribution to our journey.

Despite its commendable service, our exploration of its limitations -spanning maintainability, security, user interface, and missing features -made it clear that a managed solution was the right next step. Our small team needed to stay focused on productivity-enhancing projects rather than maintaining CI/CD infrastructure.

In the next post, [Choosing GitHub: A Comprehensive Comparison](/blog/choosing-github-comprehensive-comparison), we walk through the alternative solutions we evaluated and demonstrate how GitHub not only addresses our challenges effectively but also proves to be more cost-efficient than our previous setup.
