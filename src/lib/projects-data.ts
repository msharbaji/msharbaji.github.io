import { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "kube-manager",
    title: {
      en: "Kube-Manager (Cluster API)",
      ar: "Kube-Manager (Cluster API)",
    },
    description: {
      en: "Custom multi-cluster management system built on Cluster API for hybrid cloud environments spanning AWS, Alibaba Cloud, and GCP.",
      ar: "نظام مخصص لإدارة Multi-Cluster مبني على Cluster API لبيئات Hybrid Cloud عبر AWS وAlibaba Cloud وGCP.",
    },
    content: {
      en: `<h2>Overview</h2>
<p>Kube-Manager is a custom multi-cluster management system built on top of the <strong>Cluster API</strong> project. It provides a unified control plane for provisioning, managing, and operating Kubernetes clusters across hybrid cloud environments spanning <strong>AWS</strong>, <strong>Alibaba Cloud</strong>, and <strong>GCP</strong>.</p>

<h2>Problem</h2>
<p>Managing Kubernetes clusters across multiple cloud providers introduces significant complexity: different APIs, authentication models, networking configurations, and lifecycle management approaches. Teams needed a consistent way to provision and manage clusters regardless of the underlying infrastructure.</p>

<h2>Solution</h2>
<p>Built a Kubernetes-native management layer using Cluster API as the foundation, with custom providers and controllers to handle the specifics of each cloud platform:</p>
<ul>
<li>Custom Cluster API providers for AWS, Alibaba Cloud, and GCP with unified configuration interfaces</li>
<li>Automated cluster lifecycle management including provisioning, scaling, upgrades, and decommissioning</li>
<li>Centralized policy enforcement for security baselines and compliance requirements across all clusters</li>
<li>Integration with Terraform modules for infrastructure provisioning outside of Kubernetes</li>
</ul>

<h2>Technical Details</h2>
<ul>
<li><strong>Language:</strong> Golang</li>
<li><strong>Framework:</strong> Cluster API, controller-runtime</li>
<li><strong>Infrastructure:</strong> Terraform modules for VPC, IAM, and networking across providers</li>
<li><strong>Deployment:</strong> Runs as a set of controllers in a dedicated management cluster</li>
</ul>`,
      ar: `<h2>نظرة عامة</h2>
<p>Kube-Manager هو نظام مخصص لإدارة Multi-Cluster مبني على مشروع <strong>Cluster API</strong>. يوفر Control Plane موحد لتوفير وإدارة وتشغيل Kubernetes Clusters عبر بيئات Hybrid Cloud التي تشمل <strong>AWS</strong> و<strong>Alibaba Cloud</strong> و<strong>GCP</strong>.</p>

<h2>المشكلة</h2>
<p>إدارة Kubernetes Clusters عبر عدة Cloud Providers تُدخل تعقيداً كبيراً: APIs مختلفة، ونماذج Authentication، وإعدادات الشبكات، وأساليب Lifecycle Management متباينة. احتاجت الفرق إلى طريقة موحدة لتوفير وإدارة Clusters بغض النظر عن البنية التحتية الأساسية.</p>

<h2>الحل</h2>
<p>بناء طبقة إدارة Kubernetes-Native باستخدام Cluster API كأساس، مع Custom Providers وControllers للتعامل مع خصوصيات كل Cloud Platform:</p>
<ul>
<li>Custom Cluster API Providers لـ AWS وAlibaba Cloud وGCP مع واجهات إعداد موحدة</li>
<li>إدارة Lifecycle مؤتمتة للـ Clusters تشمل Provisioning وScaling وUpgrades وDecommissioning</li>
<li>تطبيق سياسات مركزية لمعايير الأمان ومتطلبات الامتثال عبر جميع الـ Clusters</li>
<li>التكامل مع Terraform Modules لتوفير البنية التحتية خارج Kubernetes</li>
</ul>

<h2>التفاصيل التقنية</h2>
<ul>
<li><strong>اللغة:</strong> Golang</li>
<li><strong>الإطار:</strong> Cluster API، controller-runtime</li>
<li><strong>البنية التحتية:</strong> Terraform Modules لـ VPC وIAM والشبكات عبر المزودين</li>
<li><strong>النشر:</strong> يعمل كمجموعة من Controllers في Management Cluster مخصص</li>
</ul>`,
    },
    tech: ["Kubernetes", "Cluster API", "Golang", "Terraform", "AWS", "GCP"],
  },
  {
    slug: "meta-syncer-controller",
    title: {
      en: "Meta-Syncer Controller",
      ar: "Meta-Syncer Controller",
    },
    description: {
      en: "Kubernetes-native controller for long-term analysis and synchronization of Kubernetes resources across clusters.",
      ar: "Controller أصلي لـ Kubernetes للتحليل طويل المدى ومزامنة Kubernetes Resources عبر الـ Clusters.",
    },
    content: {
      en: `<h2>Overview</h2>
<p>Meta-Syncer is a Kubernetes-native controller designed for <strong>long-term analysis and synchronization</strong> of Kubernetes resources. It enables enhanced visibility and operational insights across multiple clusters by continuously tracking resource state and metadata changes.</p>

<h2>Problem</h2>
<p>In large multi-cluster environments, understanding resource drift, tracking configuration changes over time, and maintaining consistency across clusters becomes increasingly difficult. Standard Kubernetes tooling provides point-in-time views but lacks historical context and cross-cluster analysis capabilities.</p>

<h2>Solution</h2>
<ul>
<li>Built a custom controller using <strong>controller-runtime</strong> that watches Kubernetes resources and records their state changes over time</li>
<li>Implemented synchronization logic to detect and report drift between clusters</li>
<li>Developed a metadata aggregation layer that provides operational insights such as resource age distribution, update frequency, and configuration patterns</li>
<li>Integrated with Prometheus for metrics and alerting on resource anomalies</li>
</ul>

<h2>Technical Details</h2>
<ul>
<li><strong>Language:</strong> Golang</li>
<li><strong>Framework:</strong> controller-runtime, client-go</li>
<li><strong>Storage:</strong> PostgreSQL for historical state, Redis for caching</li>
<li><strong>Observability:</strong> Prometheus metrics, structured logging</li>
</ul>`,
      ar: `<h2>نظرة عامة</h2>
<p>Meta-Syncer هو Controller أصلي لـ Kubernetes مصمم لـ<strong>التحليل طويل المدى ومزامنة</strong> Kubernetes Resources. يتيح رؤية محسنة وOperational Insights عبر عدة Clusters من خلال تتبع حالة الموارد وتغييرات الـ Metadata بشكل مستمر.</p>

<h2>المشكلة</h2>
<p>في بيئات Multi-Cluster الكبيرة، يصبح فهم Resource Drift وتتبع تغييرات الإعداد عبر الزمن والحفاظ على الاتساق عبر الـ Clusters أمراً صعباً بشكل متزايد. أدوات Kubernetes القياسية توفر عرضاً لحظياً لكنها تفتقر إلى السياق التاريخي وقدرات التحليل عبر الـ Clusters.</p>

<h2>الحل</h2>
<ul>
<li>بناء Controller مخصص باستخدام <strong>controller-runtime</strong> يراقب Kubernetes Resources ويسجل تغييرات حالتها عبر الزمن</li>
<li>تطبيق منطق المزامنة لاكتشاف والإبلاغ عن الـ Drift بين الـ Clusters</li>
<li>تطوير طبقة تجميع Metadata توفر Operational Insights مثل توزيع أعمار الموارد وتكرار التحديثات وأنماط الإعداد</li>
<li>التكامل مع Prometheus لـ Metrics والتنبيهات على حالات الشذوذ في الموارد</li>
</ul>

<h2>التفاصيل التقنية</h2>
<ul>
<li><strong>اللغة:</strong> Golang</li>
<li><strong>الإطار:</strong> controller-runtime، client-go</li>
<li><strong>التخزين:</strong> PostgreSQL للحالة التاريخية، Redis للـ Caching</li>
<li><strong>المراقبة:</strong> Prometheus Metrics، Structured Logging</li>
</ul>`,
    },
    tech: ["Kubernetes", "Golang", "Controller Runtime"],
  },
  {
    slug: "backstage-developer-portal",
    title: {
      en: "Backstage Developer Portal",
      ar: "Backstage Developer Portal",
    },
    description: {
      en: "Internal developer portal with custom plugins for service catalog management, documentation, and CI/CD workflow automation.",
      ar: "Developer Portal داخلي مع Custom Plugins لإدارة Service Catalog والتوثيق وأتمتة CI/CD Workflows.",
    },
    content: {
      en: `<h2>Overview</h2>
<p>Deployed and customized <strong>Backstage</strong> as the internal developer portal for the engineering organization. The portal serves as the single entry point for service discovery, documentation, CI/CD workflows, and infrastructure management.</p>

<h2>Problem</h2>
<p>With hundreds of microservices, teams struggled with service discovery: finding who owns what, where documentation lives, and how to interact with other services. Knowledge was fragmented across wikis, Slack channels, and tribal memory.</p>

<h2>Solution</h2>
<ul>
<li>Deployed Backstage with a <strong>custom service catalog</strong> plugin that automatically discovers and registers services from GitHub repositories</li>
<li>Built custom plugins for CI/CD workflow management, enabling engineers to trigger and monitor pipelines directly from the portal</li>
<li>Integrated TechDocs for automatic documentation generation from Markdown files in each repository</li>
<li>Created a unified search experience across services, documentation, and infrastructure resources</li>
</ul>

<h2>Impact</h2>
<ul>
<li>Reduced onboarding time for new engineers from weeks to days</li>
<li>Improved service discovery and reduced duplicate service creation</li>
<li>Centralized documentation increased knowledge sharing across teams</li>
</ul>

<h2>Technical Details</h2>
<ul>
<li><strong>Platform:</strong> Backstage (Spotify)</li>
<li><strong>Plugins:</strong> TypeScript, React</li>
<li><strong>Backend:</strong> Node.js</li>
<li><strong>Integration:</strong> GitHub API, GitHub Actions, ArgoCD</li>
</ul>`,
      ar: `<h2>نظرة عامة</h2>
<p>نشر وتخصيص <strong>Backstage</strong> كـ Developer Portal داخلي للمؤسسة الهندسية. يعمل البوابة كنقطة دخول واحدة لـ Service Discovery والتوثيق وCI/CD Workflows وإدارة البنية التحتية.</p>

<h2>المشكلة</h2>
<p>مع مئات الـ Microservices، واجهت الفرق صعوبة في Service Discovery: إيجاد من يملك ماذا، وأين يوجد التوثيق، وكيفية التفاعل مع الخدمات الأخرى. كانت المعرفة مبعثرة عبر الـ Wikis وقنوات Slack.</p>

<h2>الحل</h2>
<ul>
<li>نشر Backstage مع <strong>Custom Service Catalog</strong> Plugin يكتشف ويسجل الخدمات تلقائياً من GitHub Repositories</li>
<li>بناء Custom Plugins لإدارة CI/CD Workflows، مما يمكّن المهندسين من تشغيل ومراقبة الـ Pipelines مباشرة من البوابة</li>
<li>تكامل TechDocs لتوليد التوثيق التلقائي من ملفات Markdown في كل Repository</li>
<li>إنشاء تجربة بحث موحدة عبر الخدمات والتوثيق وموارد البنية التحتية</li>
</ul>

<h2>الأثر</h2>
<ul>
<li>تقليل وقت Onboarding للمهندسين الجدد من أسابيع إلى أيام</li>
<li>تحسين Service Discovery وتقليل إنشاء الخدمات المكررة</li>
<li>مركزية التوثيق عززت مشاركة المعرفة بين الفرق</li>
</ul>

<h2>التفاصيل التقنية</h2>
<ul>
<li><strong>المنصة:</strong> Backstage (Spotify)</li>
<li><strong>الإضافات:</strong> TypeScript، React</li>
<li><strong>Backend:</strong> Node.js</li>
<li><strong>التكامل:</strong> GitHub API، GitHub Actions، ArgoCD</li>
</ul>`,
    },
    tech: ["Backstage", "TypeScript", "React", "Node.js"],
  },
  {
    slug: "argocd-migration",
    title: {
      en: "ArgoCD Migration",
      ar: "ArgoCD Migration",
    },
    description: {
      en: "Led migration of 100+ applications from classic Helm deployments to ArgoCD-based GitOps workflows, reducing release time by ~80%.",
      ar: "قيادة ترحيل أكثر من 100 تطبيق من Helm Deployments التقليدية إلى GitOps Workflows المبنية على ArgoCD، مما قلل وقت الـ Release بنسبة ~80%.",
    },
    content: {
      en: `<h2>Overview</h2>
<p>Led the migration of over <strong>100 applications</strong> from traditional Helm-based deployment workflows to a fully GitOps-driven approach using <strong>ArgoCD</strong>. This transformation reduced average release time by approximately 80% and dramatically improved deployment reliability.</p>

<h2>Problem</h2>
<p>The existing deployment process relied on manual Helm commands or CI-triggered deployments that were slow, error-prone, and difficult to audit. Rollbacks required manual intervention, and there was no single source of truth for what was running in production.</p>

<h2>Solution</h2>
<ul>
<li>Designed a GitOps repository structure with environment-specific overlays using Helm values files</li>
<li>Configured ArgoCD Application resources with automated sync policies and health checks</li>
<li>Implemented a progressive rollout strategy: migrating applications in batches to minimize risk</li>
<li>Built self-service templates so teams could onboard their applications to ArgoCD independently</li>
<li>Created monitoring dashboards to track sync status, drift detection, and deployment frequency</li>
</ul>

<h2>Impact</h2>
<ul>
<li>Release time reduced from ~45 minutes to under 10 minutes on average</li>
<li>Deployment frequency increased by 3x across the organization</li>
<li>Failed deployments decreased significantly due to automated drift detection and rollback</li>
<li>Git became the single source of truth for all application configurations</li>
</ul>

<h2>Technical Details</h2>
<ul>
<li><strong>GitOps Tool:</strong> ArgoCD</li>
<li><strong>Package Manager:</strong> Helm</li>
<li><strong>CI:</strong> GitHub Actions</li>
<li><strong>Orchestration:</strong> Kubernetes</li>
</ul>`,
      ar: `<h2>نظرة عامة</h2>
<p>قيادة ترحيل أكثر من <strong>100 تطبيق</strong> من Deployment Workflows التقليدية المبنية على Helm إلى نهج GitOps كامل باستخدام <strong>ArgoCD</strong>. قلل هذا التحول وقت الـ Release المتوسط بنسبة تقارب 80% وحسّن موثوقية الـ Deployment بشكل كبير.</p>

<h2>المشكلة</h2>
<p>اعتمدت عملية الـ Deployment الحالية على أوامر Helm اليدوية أو CI-Triggered Deployments التي كانت بطيئة وعرضة للأخطاء وصعبة التدقيق. كانت عمليات الـ Rollback تتطلب تدخلاً يدوياً، ولم يكن هناك مصدر وحيد للحقيقة لما يعمل في Production.</p>

<h2>الحل</h2>
<ul>
<li>تصميم هيكل GitOps Repository مع Environment-Specific Overlays باستخدام Helm Values Files</li>
<li>إعداد ArgoCD Application Resources مع Automated Sync Policies وHealth Checks</li>
<li>تطبيق استراتيجية Progressive Rollout: ترحيل التطبيقات على دفعات لتقليل المخاطر</li>
<li>بناء Self-Service Templates ليتمكن الفرق من إضافة تطبيقاتهم إلى ArgoCD بشكل مستقل</li>
<li>إنشاء Monitoring Dashboards لتتبع حالة Sync واكتشاف Drift وتكرار الـ Deployment</li>
</ul>

<h2>الأثر</h2>
<ul>
<li>تقليل وقت الـ Release من ~45 دقيقة إلى أقل من 10 دقائق في المتوسط</li>
<li>زيادة تكرار الـ Deployment بمقدار 3 أضعاف عبر المؤسسة</li>
<li>انخفاض الـ Failed Deployments بشكل كبير بفضل Automated Drift Detection وRollback</li>
<li>أصبح Git المصدر الوحيد للحقيقة لجميع إعدادات التطبيقات</li>
</ul>

<h2>التفاصيل التقنية</h2>
<ul>
<li><strong>أداة GitOps:</strong> ArgoCD</li>
<li><strong>مدير الحزم:</strong> Helm</li>
<li><strong>CI:</strong> GitHub Actions</li>
<li><strong>التنسيق:</strong> Kubernetes</li>
</ul>`,
    },
    tech: ["ArgoCD", "Helm", "Kubernetes", "GitHub Actions"],
  },
  {
    slug: "eks-platform",
    title: {
      en: "EKS Platform (Coinmerce)",
      ar: "EKS Platform (Coinmerce)",
    },
    description: {
      en: "Production EKS clusters designed from scratch with reusable Terraform modules, Cilium CNI, and Karpenter for cost-optimized autoscaling.",
      ar: "Production EKS Clusters مصممة من الصفر باستخدام Terraform Modules قابلة لإعادة الاستخدام وCilium CNI وKarpenter للـ Autoscaling المحسن التكلفة.",
    },
    content: {
      en: `<h2>Overview</h2>
<p>Designed and deployed <strong>production EKS clusters</strong> from scratch for Coinmerce, a cryptocurrency exchange platform. The infrastructure uses reusable Terraform modules, <strong>Cilium CNI</strong> for advanced networking and observability, and <strong>Karpenter</strong> for cost-optimized autoscaling.</p>

<h2>Problem</h2>
<p>The platform needed a reliable, secure, and cost-efficient Kubernetes infrastructure on AWS that could handle variable workloads typical of a crypto exchange: traffic spikes during market volatility with low baseline usage during quiet periods.</p>

<h2>Solution</h2>
<ul>
<li>Designed reusable Terraform modules for EKS cluster provisioning including VPC, subnets, security groups, and IAM roles</li>
<li>Replaced the default AWS VPC CNI with <strong>Cilium</strong> for better network visibility, security policies, and eBPF-powered observability</li>
<li>Implemented <strong>Karpenter</strong> for intelligent node provisioning: automatically selecting optimal instance types based on workload requirements</li>
<li>Set up comprehensive monitoring with Prometheus, Grafana, and Cilium Hubble for network flow visualization</li>
</ul>

<h2>Impact</h2>
<ul>
<li>Reduced infrastructure costs through right-sized node provisioning with Karpenter</li>
<li>Improved network security posture with Cilium network policies replacing traditional security groups for pod-level traffic control</li>
<li>Enabled rapid cluster reproduction for disaster recovery and multi-environment setups</li>
</ul>

<h2>Technical Details</h2>
<ul>
<li><strong>Cloud:</strong> AWS (EKS)</li>
<li><strong>IaC:</strong> Terraform with reusable modules</li>
<li><strong>CNI:</strong> Cilium (eBPF)</li>
<li><strong>Autoscaling:</strong> Karpenter</li>
<li><strong>Observability:</strong> Prometheus, Grafana, Hubble</li>
</ul>`,
      ar: `<h2>نظرة عامة</h2>
<p>تصميم ونشر <strong>Production EKS Clusters</strong> من الصفر لـ Coinmerce، منصة تداول عملات رقمية. تستخدم البنية التحتية Terraform Modules قابلة لإعادة الاستخدام و<strong>Cilium CNI</strong> للشبكات المتقدمة والمراقبة و<strong>Karpenter</strong> للـ Autoscaling المحسن التكلفة.</p>

<h2>المشكلة</h2>
<p>احتاجت المنصة إلى بنية Kubernetes تحتية موثوقة وآمنة وفعالة من حيث التكلفة على AWS يمكنها التعامل مع أحمال العمل المتغيرة النموذجية لمنصة تداول العملات الرقمية: ارتفاعات في حركة المرور أثناء تقلبات السوق مع استخدام منخفض في الفترات الهادئة.</p>

<h2>الحل</h2>
<ul>
<li>تصميم Terraform Modules قابلة لإعادة الاستخدام لتوفير EKS Clusters تشمل VPC وSubnets وSecurity Groups وIAM Roles</li>
<li>استبدال AWS VPC CNI الافتراضي بـ <strong>Cilium</strong> لرؤية أفضل للشبكة وSecurity Policies وObservability المدعومة بـ eBPF</li>
<li>تطبيق <strong>Karpenter</strong> لتوفير ذكي للـ Nodes: اختيار أنواع Instances المثلى تلقائياً بناءً على متطلبات العمل</li>
<li>إعداد مراقبة شاملة باستخدام Prometheus وGrafana وCilium Hubble لعرض Network Flow</li>
</ul>

<h2>الأثر</h2>
<ul>
<li>تقليل تكاليف البنية التحتية من خلال التوفير المناسب للـ Nodes باستخدام Karpenter</li>
<li>تحسين وضع أمان الشبكة باستخدام Cilium Network Policies بدلاً من Security Groups التقليدية للتحكم في حركة المرور على مستوى الـ Pod</li>
<li>تمكين إعادة إنتاج Clusters بسرعة لـ Disaster Recovery وإعدادات Multi-Environment</li>
</ul>

<h2>التفاصيل التقنية</h2>
<ul>
<li><strong>السحابة:</strong> AWS (EKS)</li>
<li><strong>IaC:</strong> Terraform مع Modules قابلة لإعادة الاستخدام</li>
<li><strong>CNI:</strong> Cilium (eBPF)</li>
<li><strong>Autoscaling:</strong> Karpenter</li>
<li><strong>المراقبة:</strong> Prometheus، Grafana، Hubble</li>
</ul>`,
    },
    tech: ["AWS EKS", "Terraform", "Cilium", "Karpenter"],
  },
  {
    slug: "terraform-state-migration",
    title: {
      en: "Terraform State Migration",
      ar: "Terraform State Migration",
    },
    description: {
      en: "Migrated Terraform backend state from cloud storage to PostgreSQL, creating a cloud-agnostic solution for infrastructure state management.",
      ar: "ترحيل Terraform Backend State من Cloud Storage إلى PostgreSQL، لإنشاء حل Cloud-Agnostic لإدارة Infrastructure State.",
    },
    content: {
      en: `<h2>Overview</h2>
<p>Led the migration of <strong>Terraform backend state</strong> from cloud-specific storage solutions (S3, GCS) to a centralized <strong>PostgreSQL</strong> database, creating a cloud-agnostic approach to infrastructure state management across a hybrid cloud environment.</p>

<h2>Problem</h2>
<p>With infrastructure spread across AWS, GCP, and Alibaba Cloud, Terraform state was fragmented across different cloud storage backends: S3 buckets for AWS resources, GCS buckets for GCP resources. This created operational complexity: different access patterns, inconsistent locking mechanisms, and no unified view of infrastructure state.</p>

<h2>Solution</h2>
<ul>
<li>Designed a centralized PostgreSQL-based backend that serves as a single state store across all cloud providers</li>
<li>Developed a migration tool to safely move existing state files from S3 and GCS to PostgreSQL with zero downtime</li>
<li>Implemented state locking using PostgreSQL advisory locks for consistent concurrent access</li>
<li>Set up automated backups and point-in-time recovery for the state database</li>
</ul>

<h2>Impact</h2>
<ul>
<li>Unified state management across all cloud providers into a single backend</li>
<li>Simplified access control: one set of database credentials instead of IAM roles per cloud</li>
<li>Improved auditability with database-level logging of all state changes</li>
<li>Enabled easier disaster recovery with standard PostgreSQL backup and restore</li>
</ul>

<h2>Technical Details</h2>
<ul>
<li><strong>IaC:</strong> Terraform</li>
<li><strong>Backend:</strong> PostgreSQL (pg backend)</li>
<li><strong>Previous:</strong> S3, GCS</li>
<li><strong>Cloud Providers:</strong> AWS, GCP, Alibaba Cloud</li>
</ul>`,
      ar: `<h2>نظرة عامة</h2>
<p>قيادة ترحيل <strong>Terraform Backend State</strong> من حلول التخزين السحابية (S3، GCS) إلى قاعدة بيانات <strong>PostgreSQL</strong> مركزية، لإنشاء نهج Cloud-Agnostic لإدارة Infrastructure State عبر بيئة Hybrid Cloud.</p>

<h2>المشكلة</h2>
<p>مع انتشار البنية التحتية عبر AWS وGCP وAlibaba Cloud، كانت Terraform State مجزأة عبر Cloud Storage Backends مختلفة: S3 Buckets لموارد AWS وGCS Buckets لموارد GCP. أدى هذا إلى تعقيد تشغيلي: أنماط وصول مختلفة، وآليات Locking غير متسقة، وعدم وجود رؤية موحدة لحالة البنية التحتية.</p>

<h2>الحل</h2>
<ul>
<li>تصميم Backend مركزي مبني على PostgreSQL يعمل كمخزن State واحد عبر جميع Cloud Providers</li>
<li>تطوير أداة ترحيل لنقل State Files الحالية بأمان من S3 وGCS إلى PostgreSQL بدون توقف</li>
<li>تطبيق State Locking باستخدام PostgreSQL Advisory Locks لضمان الوصول المتزامن المتسق</li>
<li>إعداد نسخ احتياطية آلية وPoint-in-Time Recovery لقاعدة بيانات State</li>
</ul>

<h2>الأثر</h2>
<ul>
<li>توحيد إدارة State عبر جميع Cloud Providers في Backend واحد</li>
<li>تبسيط التحكم في الوصول: مجموعة واحدة من Database Credentials بدلاً من IAM Roles لكل سحابة</li>
<li>تحسين قابلية التدقيق مع تسجيل جميع تغييرات State على مستوى قاعدة البيانات</li>
<li>تمكين Disaster Recovery أسهل مع PostgreSQL Backup and Restore القياسي</li>
</ul>

<h2>التفاصيل التقنية</h2>
<ul>
<li><strong>IaC:</strong> Terraform</li>
<li><strong>Backend:</strong> PostgreSQL (pg backend)</li>
<li><strong>السابق:</strong> S3، GCS</li>
<li><strong>مزودو السحابة:</strong> AWS، GCP، Alibaba Cloud</li>
</ul>`,
    },
    tech: ["Terraform", "PostgreSQL", "AWS", "GCP"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
