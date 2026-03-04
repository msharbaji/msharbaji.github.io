---
title: "إدارة GitHub على نطاق المؤسسة باستخدام Terraform"
date: "2024-03-18"
description: "الجزء الثالث من قصة الانتقال. كيف بنينا منصة خدمة ذاتية لإدارة 400+ مستودع و 27 فريق وسياسات الأمان عبر مؤسسة GitHub باستخدام Terraform."
tags: ["GitHub", "Terraform", "DevOps", "Security", "IaC"]
series: "cicd-migration"
seriesOrder: 3
---

في [الجزء الأول](/blog/embracing-change-bitbucket-to-github)، تكلمنا عن أسباب ابتعادنا عن Estafette و BitBucket. في [الجزء الثاني](/blog/choosing-github-comprehensive-comparison)، عرضنا كيف فاز GitHub في التقييم. هالمقال الأخير يغطي اللي جاء بعدها - بناء نظام لإدارة GitHub نفسه.

## مشكلة الإدارة اليدوية

نقل 400+ مستودع و 27 فريق لـ GitHub كانت بس البداية. التحدي الحقيقي كان الحوكمة. بدون ضوابط، النتيجة تكون:

- مستودعات تُنشأ بإعدادات غير متسقة
- قواعد حماية الفروع تختلف من فريق لفريق
- secrets متناثرة عبر المستودعات بدون سجل تدقيق
- ما فيه طريقة موحدة لمنح وصول الـ cloud من CI/CD
- سياسات أمان موجودة في التوثيق بس مو في الكود

كنا نحتاج نظام حيث كل إعداد GitHub مُوثق بـ version، قابل للمراجعة، ويُطبق تلقائياً. Infrastructure as Code لـ GitHub نفسه.

## GHSSM: إدارة أمان وإعدادات GitHub

بنينا **GHSSM** - منصة مبنية على Terraform تدير مؤسسة GitHub بالكامل. كل فريق، مستودع، قاعدة حماية فرع، secret، وسياسة وصول cloud معرّفة في كود وتُطبق عبر pull requests.

البنية على طبقتين:

### إعدادات المؤسسة

الإعدادات على مستوى المؤسسة تدير الأشياء اللي تنطبق على كل الفرق:

- **سياسات المؤسسة** - مين يقدر ينشئ مستودعات، الصلاحيات الافتراضية، إعدادات الأمان
- **Workload Identity Federation pools** - وصول cloud بدون مفاتيح لـ GitHub Actions
- **Organization secrets** - secrets مشتركة مثل بيانات الـ registry وتوكنات الفحص
- **Organization rulesets** - حماية الفرع الافتراضية المطبقة على كل المستودعات

### إعدادات الفرق

كل فريق من الـ 27 عنده دليل Terraform خاص. إعدادات الفريق تحدد:

- **المستودعات** - كل مستودع يملكه الفريق بإعدادات موحدة
- **التحكم بالوصول** - أي فرق ومستخدمين يقدرون يعملون push أو pull أو admin لكل مستودع
- **حماية الفروع** - الموافقات المطلوبة، إلغاء المراجعات القديمة، تجاوز البوتات
- **Secrets والمتغيرات** - إعدادات CI/CD الخاصة بالفريق
- **وصول الـ Cloud** - حسابات خدمة GCP وصلاحيات IAM لكل مستودع

## كيف يُنشأ مستودع جديد

قبل GHSSM، إنشاء مستودع جديد كان يعني تذكرة دعم، انتظار مهندس منصات، والأمل إن الإعدادات تطابق باقي مستودعاتك. الحين، أي مهندس يقدر يفتح pull request:

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

تعريف الـ module الواحد هذا ينشئ المستودع مع:

- Labels مواضيع صحيحة لسهولة الاكتشاف
- بيانات اللغة والـ ecosystem لفحص الـ dependencies
- حماية فرع بموافقتين مطلوبتين
- إلغاء تلقائي للمراجعات القديمة
- تجاوز بوت Renovate لتحديثات الـ dependencies التلقائية
- وصول الفريق محصور على الفريق المالك
- علامة PCI compliance للمستودعات الحساسة للدفع

الـ pull request يشغّل Terraform plan. المراجعون يشوفون بالضبط إيش راح يتغير. بعد الدمج، Terraform يطبق الإعدادات تلقائياً.

## وصول Cloud بدون مفاتيح مع Workload Identity Federation

من أكبر مكاسب الأمان كان التخلص من مفاتيح حسابات الخدمة طويلة العمر. قبل GHSSM، الفرق كانت تخزن مفاتيح JSON لحسابات خدمة GCP كـ GitHub secrets. هالمفاتيح ما تنتهي صلاحيتها، ممكن تتسرب، وصعب تدويرها.

استبدلناها بـ **Workload Identity Federation (WIF)** - آلية حيث GitHub Actions يتصادق مباشرة مع GCP باستخدام توكنات قصيرة العمر. ما فيه مفاتيح مخزنة بأي مكان.

GHSSM يدير سلسلة WIF بالكامل:

1. **WIF pools** لكل بيئة (production, staging, development, techops)
2. **حسابات خدمة** لكل مستودع بصلاحيات IAM محددة
3. **Attribute mappings** تحدد أي مستودع وفرع يقدر يستخدم أي هوية

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

هذا يعني مستودع `payment-service` يقدر يتصادق مع GCP ويحصل على `compute.admin` على مشروع `payment-prod` - بس من هالمستودع بالذات. ما فيه مستودع ثاني يقدر يستخدم هالهوية.

## إدارة الـ Secrets

GHSSM يتعامل مع الـ secrets على مستويين:

**Organization secrets** تُدار مركزياً وتُخزن في GCP Secret Manager. تشمل بيانات الـ registry وتوكنات الفحص وتوكنات البوتات. مُقيدة بالرؤية - بعضها متاح لكل المستودعات الداخلية، وبعضها لمستودعات محددة فقط.

**Team secrets** معرّفة لكل مستودع في إعدادات Terraform الخاصة بالفريق. لما فريق يحتاج secret جديد لـ CI/CD pipeline، يضيفه في الإعدادات ويفتح pull request.

المبدأ الأساسي: ما فيه secret يُنشأ يدوياً من واجهة GitHub. كل secret عنده سجل كود يوضح مين أضافه، متى، وليش.

## إعدادات الأمان الافتراضية

GHSSM يفرض إعدادات الأمان على مستوى المؤسسة:

- **Dependabot alerts** مفعّلة على كل المستودعات الجديدة
- **Dependabot security updates** مفعّلة تلقائياً
- **Secret scanning** مع push protection مفعّل - commits اللي فيها secrets بالغلط تنحجب قبل ما توصل المستودع
- **Dependency graph** مفعّل لرؤية سلسلة التوريد
- **إنشاء مستودعات عامة** معطّل - الأعضاء ما يقدرون بالغلط يخلون مستودع public

هذي مو اقتراحات مكتوبة في wiki. هذي Terraform resources تُطبق وتُفرض. لو أحد غيّر إعداد يدوياً من الواجهة، أول تشغيل لـ Terraform يصحح الانحراف.

## أتمتة الـ Workflows

مستودع GHSSM نفسه يستخدم GitHub Actions للنشر:

- **Org-settings workflow** يشتغل عند تغييرات على إعدادات المؤسسة
- **Per-team workflows** (27 منها) تشتغل بس عند تغييرات على دليل الفريق المعني
- **Reusable workflow** يتعامل مع منطق Terraform plan/apply، يرفع artifacts الخطة، ويعلق على PRs بملخص التغييرات

عند فتح pull request، الـ workflow يشغّل `terraform plan` وينشر النتيجة كتعليق على الـ PR. المراجعون يشوفون بالضبط إيش الموارد اللي راح تُنشأ أو تُعدل أو تُحذف. بعد الدمج على main، يشغّل `terraform apply`.

هالفصل يعني إن تغيير على مستودعات فريق واحد ما يشغّل plans لفرق ثانية - والـ feedback loops تبقى سريعة.

## النتائج

بعد تطبيق GHSSM على كل 27 فريق و 400+ مستودع:

- **صفر إنشاء مستودعات يدوي** - كل المستودعات تُنشأ عبر pull requests بإعدادات موحدة
- **وصول cloud بدون مفاتيح** - تم التخلص من كل مفاتيح حسابات الخدمة طويلة العمر عبر WIF
- **حماية فروع متسقة** - كل مستودع عنده مراجعات مطلوبة، بدون استثناءات
- **secrets قابلة للتدقيق** - كل إضافة secret متتبعة عبر سجل git
- **خدمة ذاتية للفرق** - المهندسون ينشئون مستودعات ويعدلون الوصول بدون انتظار فريق المنصات
- **كشف الانحراف** - تغييرات الواجهة اليدوية تُصحح تلقائياً في التشغيل التالي

## الدروس المستفادة

**ابدأ بالإعدادات على مستوى المؤسسة.** مغري تقفز مباشرة لإعدادات الفرق. لكن ضبط سياسات المؤسسة أولاً يعني إن الفرق ترث إعدادات أمان افتراضية بدون جهد إضافي.

**خلّ واجهة الـ module بسيطة.** الـ repository module عندنا يقبل هيكل إعدادات مسطح. الفرق ما تحتاج تفهم تفاصيل Terraform الداخلية - بس يعبون اسم المستودع والمواضيع وقواعد الوصول.

**افصل state المؤسسة عن الفرق.** وجود Terraform workspace مخصص لكل فريق يعني إن الفرق ما تقدر بالغلط تكسر إعدادات بعض. وكمان يخلي ناتج الـ plan قابل للقراءة.

**استخدم WIF من اليوم الأول.** الانتقال من مفاتيح حسابات الخدمة لـ WIF بعد ما تبدأ صعب. بناؤه في المنصة من البداية يعني إن الفرق ما اضطرت تتعامل مع تدوير المفاتيح أبداً.

## الخلاصة

إدارة مؤسسة GitHub على نطاق واسع مو بس عن اختيار المنصة الصح - بل عن معاملة إعدادات المنصة نفسها ككود. GHSSM أعطانا نظام حيث كل إعداد مُوثق بـ version، كل تغيير يُراجع، وكل سياسة تُفرض تلقائياً.

مزيج API الـ GitHub وإدارة state في Terraform و Workload Identity Federation أنشأ نموذج حوكمة يتوسع مع المؤسسة بدون ما يخلق عقبات. الفرق تتحرك بسرعة لأنها تقدر تخدم نفسها. الأمان يبقى متسق لأنه مُكوّد، مو مُوثق.

هنا تنتهي سلسلة انتقال CI/CD من ثلاثة أجزاء. من [تحديد قيود Estafette](/blog/embracing-change-bitbucket-to-github)، إلى [تقييم GitHub ضد GitLab](/blog/choosing-github-comprehensive-comparison)، إلى بناء البنية التحتية اللي تخلي كل شي قابل للإدارة على نطاق واسع - الرحلة أخذتنا من نظام CI/CD مستضاف ذاتياً لمنصة خدمة ذاتية محكومة بالكامل.
