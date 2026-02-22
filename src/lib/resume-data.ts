import { Experience, Education, Certification, SkillGroup, Bilingual } from "./types";

export const summary: Bilingual = {
  en: "Platform Engineer with over 10 years of experience in software development, cloud platforms, site reliability engineering and Linux-based systems. Extensive hands-on expertise with Linux system administration, production troubleshooting, performance tuning, networking, and automation across large-scale distributed systems. Proficient in AWS, GCP, AliCloud, Kubernetes, and designing scalable CI/CD pipelines. Strong background in infrastructure as code (Terraform, Helm), microservices architectures, and improving developer productivity. Experienced in backend development using Golang and Python, with exposure to frontend frameworks such as Vue. Passionate about building reliable platforms, driving operational excellence, and exploring MLOps for scalable machine learning deployments.",
  ar: "Platform Engineer بخبرة تزيد عن 10 سنوات في تطوير البرمجيات، Cloud Platforms، Site Reliability Engineering والأنظمة المبنية على Linux. خبرة عملية واسعة في إدارة أنظمة Linux، واستكشاف مشاكل Production، وPerformance Tuning، والشبكات، والأتمتة عبر الأنظمة الموزعة الكبيرة. متمكن من AWS وGCP وAliCloud وKubernetes وتصميم CI/CD Pipelines قابلة للتوسع. خلفية قوية في Infrastructure as Code عبر Terraform وHelm، وبنيات Microservices، وتحسين إنتاجية المطورين. خبرة في تطوير Backend باستخدام Golang وPython. شغوف ببناء منصات موثوقة وتحقيق التميز التشغيلي واستكشاف MLOps.",
};

export const experience: Experience[] = [
  {
    company: "Coinmerce.io",
    role: { en: "Senior Platform Engineer", ar: "Senior Platform Engineer" },
    period: "Aug 2025 - Present",
    location: { en: "Amsterdam, Netherlands", ar: "أمستردام، هولندا" },
    bullets: {
      en: [
        "Designed and deployed EKS clusters from scratch using reusable Terraform modules",
        "Implemented advanced networking with Cilium CNI for observability and security",
        "Optimized cluster efficiency and cost by introducing Karpenter for autoscaling",
        "Migrated InfluxDB database from InfluxDB Cloud to AWS Managed InfluxDB ensuring continuity and data integrity",
      ],
      ar: [
        "تصميم ونشر EKS Clusters من الصفر باستخدام Terraform Modules قابلة لإعادة الاستخدام",
        "تطبيق شبكات متقدمة باستخدام Cilium CNI لتعزيز Observability والأمان",
        "تحسين كفاءة الـ Clusters والتكلفة من خلال إدخال Karpenter للـ Autoscaling",
        "ترحيل قاعدة بيانات InfluxDB من InfluxDB Cloud إلى AWS Managed InfluxDB مع ضمان الاستمرارية وسلامة البيانات",
      ],
    },
  },
  {
    company: "Trip.com",
    role: { en: "Staff Platform Engineer", ar: "Staff Platform Engineer" },
    period: "Jan 2024 - June 2025",
    location: { en: "Amsterdam, Netherlands", ar: "أمستردام، هولندا" },
    bullets: {
      en: [
        "Led design and development of a custom kube-manager system based on the Cluster API for multi-cluster management across hybrid cloud environments (AWS, Alibaba, GCP)",
        "Led migration of Terraform backend state from cloud storage to PostgreSQL, enabling a hybrid cloud-agnostic solution for infrastructure state management",
        "Developed the Meta-Syncer Controller, a Kubernetes-native solution for long-term analysis and synchronization of Kubernetes resources",
      ],
      ar: [
        "قيادة تصميم وتطوير نظام kube-manager مبني على Cluster API لإدارة Multi-Cluster عبر بيئات Hybrid Cloud (AWS، Alibaba، GCP)",
        "قيادة ترحيل Terraform Backend State من Cloud Storage إلى PostgreSQL، لتمكين حل Cloud-Agnostic لإدارة Infrastructure State",
        "تطوير Meta-Syncer Controller، حل Kubernetes-Native للتحليل طويل المدى ومزامنة Kubernetes Resources",
      ],
    },
  },
  {
    company: "Travix",
    role: { en: "Staff System Engineer", ar: "Staff System Engineer" },
    period: "Feb 2019 - Jan 2024",
    location: { en: "Amsterdam, Netherlands", ar: "أمستردام، هولندا" },
    bullets: {
      en: [
        "Led migration from self-hosted CI/CD platform (estafette.io) to GitHub Actions",
        "Deployed Backstage as internal developer portal with custom plugins for service catalog management and CI/CD workflows",
        "Configured logging and monitoring using ELK stack, Fluentd, Prometheus and Grafana",
        "Drove adoption of ArgoCD and migrated 100+ apps, reducing release time by ~80%",
        "Maintained self-hosted open-source CI/CD platform Estafette",
        "Participated in on-call schedule to resolve production incidents",
      ],
      ar: [
        "قيادة الترحيل من منصة CI/CD المستضافة ذاتياً (estafette.io) إلى GitHub Actions",
        "نشر Backstage كبوابة Developer Portal داخلية مع Custom Plugins لإدارة Service Catalog وCI/CD Workflows",
        "إعداد Logging وMonitoring باستخدام ELK Stack وFluentd وPrometheus وGrafana",
        "قيادة اعتماد ArgoCD وترحيل أكثر من 100 تطبيق، مما قلل وقت الـ Release بنسبة ~80%",
        "صيانة منصة CI/CD مفتوحة المصدر المستضافة ذاتياً Estafette",
        "المشاركة في جدول On-Call لحل Production Incidents",
      ],
    },
  },
  {
    company: "Newswav",
    role: { en: "Senior DevOps Engineer", ar: "Senior DevOps Engineer" },
    period: "Nov 2018 - Feb 2019",
    location: { en: "Kuala Lumpur, Malaysia", ar: "كوالالمبور، ماليزيا" },
    bullets: {
      en: [
        "Deployed microservices to GCP using GKE for a startup, enhancing scalability and deployment efficiency",
      ],
      ar: [
        "نشر Microservices على GCP باستخدام GKE لشركة ناشئة، مما عزز الـ Scalability وكفاءة الـ Deployment",
      ],
    },
  },
  {
    company: "Strateq Global Services",
    role: { en: "DevOps Engineer", ar: "DevOps Engineer" },
    period: "Sep 2017 - Nov 2018",
    location: { en: "Kuala Lumpur, Malaysia", ar: "كوالالمبور، ماليزيا" },
    bullets: {
      en: [
        "Created and maintained fully automated CI/CD pipelines using AWS services",
        "Developed Petronas ChatBot using AWS services",
        "Designed SMART Service Desk using Laravel, Android, and React with AWS-based CI/CD",
        "Developed Face Registration POC integrated with Hikvision cameras and AWS",
      ],
      ar: [
        "إنشاء وصيانة CI/CD Pipelines مؤتمتة بالكامل باستخدام خدمات AWS",
        "تطوير Petronas ChatBot باستخدام خدمات AWS",
        "تصميم SMART Service Desk باستخدام Laravel وAndroid وReact مع CI/CD مبني على AWS",
        "تطوير Face Registration POC مدمج مع كاميرات Hikvision وAWS",
      ],
    },
  },
  {
    company: "Apliman",
    role: { en: "Full Stack Engineer", ar: "Full Stack Engineer" },
    period: "Jun 2016 - Aug 2017",
    location: { en: "Beirut, Lebanon", ar: "بيروت، لبنان" },
    bullets: {
      en: [
        "Built enterprise web applications using Java J2EE, Spring, and Hibernate with REST and SOAP APIs",
        "Developed responsive frontend interfaces using ReactJs for client-facing portals",
      ],
      ar: [
        "بناء تطبيقات ويب مؤسسية باستخدام Java J2EE وSpring وHibernate مع REST وSOAP APIs",
        "تطوير واجهات Frontend متجاوبة باستخدام ReactJs لبوابات العملاء",
      ],
    },
  },
  {
    company: "Tarwij",
    role: { en: "Software Developer", ar: "Software Developer" },
    period: "Jun 2015 - Jun 2016",
    location: { en: "Damascus, Syria", ar: "دمشق، سوريا" },
    bullets: {
      en: [
        "Built Android applications and backend services using Java, Spring, and Hibernate",
        "Developed web interfaces with ReactJs and Bootstrap for internal tools",
      ],
      ar: [
        "بناء تطبيقات Android وخدمات Backend باستخدام Java وSpring وHibernate",
        "تطوير واجهات ويب باستخدام ReactJs وBootstrap للأدوات الداخلية",
      ],
    },
  },
  {
    company: "Freelancer",
    role: { en: "Full Stack Developer", ar: "Full Stack Developer" },
    period: "Jan 2014 - Jun 2015",
    location: { en: "Damascus, Syria", ar: "دمشق، سوريا" },
    bullets: {
      en: [
        "Built web applications for local businesses using Laravel, Spring, and MySQL on the backend with React, Angular, and Bootstrap on the frontend",
      ],
      ar: [
        "بناء تطبيقات ويب للشركات المحلية باستخدام Laravel وSpring وMySQL على الـ Backend مع React وAngular وBootstrap على الـ Frontend",
      ],
    },
  },
];

export const education: Education[] = [
  {
    degree: {
      en: "BSc Informatics Engineering (Software Engineering)",
      ar: "بكالوريوس هندسة المعلوماتية (هندسة البرمجيات)",
    },
    school: {
      en: "Yarmouk Private University",
      ar: "جامعة اليرموك الخاصة",
    },
    period: "2010 - 2015",
    note: {
      en: "Excellent (AGPA: 3.50/4.0)",
      ar: "ممتاز (المعدل: 3.50/4.0)",
    },
  },
];

export const certifications: Certification[] = [
  {
    name: {
      en: "Certified Kubernetes Administrator (CKA)",
      ar: "Certified Kubernetes Administrator (CKA)",
    },
    date: "Jan 2020",
  },
  {
    name: {
      en: "AWS Certified Developer - Associate",
      ar: "AWS Certified Developer - Associate",
    },
    date: "Mar 2018",
  },
];

export const skills: SkillGroup[] = [
  {
    category: { en: "Cloud Platforms", ar: "Cloud Platforms" },
    items: ["AWS", "GCP", "Azure", "Hybrid Cloud"],
  },
  {
    category: { en: "Containers & Orchestration", ar: "Containers & Orchestration" },
    items: ["Docker", "Kubernetes", "Istio", "Karmada"],
  },
  {
    category: { en: "Infrastructure as Code", ar: "Infrastructure as Code" },
    items: ["Terraform", "CloudFormation", "AWS CDK", "Crossplane"],
  },
  {
    category: { en: "CI/CD & GitOps", ar: "CI/CD & GitOps" },
    items: ["GitHub Actions", "GitLab CI", "ArgoCD", "Helm", "GoCD", "Jenkins"],
  },
  {
    category: { en: "Observability", ar: "Observability" },
    items: [
      "Prometheus",
      "Grafana",
      "ELK Stack",
      "Jaeger",
      "OpenTelemetry",
      "Datadog",
      "Loki",
      "Tempo",
      "Mimir",
    ],
  },
  {
    category: { en: "Languages & Frameworks", ar: "Languages & Frameworks" },
    items: ["Golang", "Python", "Node.js"],
  },
  {
    category: { en: "Databases", ar: "Databases" },
    items: ["PostgreSQL", "MySQL", "DynamoDB", "MongoDB", "Cassandra", "InfluxDB"],
  },
  {
    category: { en: "Streaming", ar: "Streaming" },
    items: ["Kafka", "Apache Flink"],
  },
];

export const languages = [
  {
    name: { en: "English", ar: "الإنجليزية" },
    level: { en: "Professional working proficiency", ar: "كفاءة مهنية عملية" },
  },
  {
    name: { en: "Arabic", ar: "العربية" },
    level: { en: "Native", ar: "لغة أم" },
  },
  {
    name: { en: "Dutch", ar: "الهولندية" },
    level: { en: "Beginner", ar: "مبتدئ" },
  },
];

export const socials = {
  github: "https://github.com/msharbaji",
  linkedin: "https://linkedin.com/in/msharbaji93",
  stackoverflow: "https://stackoverflow.com/users/mohamad_alsharbaji",
  email: "msharbaji@gmail.com",
};
