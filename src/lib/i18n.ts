export type Locale = "en" | "ar";

export type Bilingual<T = string> = Record<Locale, T>;

const translations = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      courses: "Courseware",
      blog: "Blog",
      contact: "Contact",
    },
    hero: {
      name: "Mohamad",
      lastName: "Alsharbaji",
      arabicName: "محمد الشربجي",
      role: "Platform Engineer",
      description:
        "10+ years building reliable platforms, scaling Kubernetes clusters, and driving operational excellence across large-scale distributed systems. Based in the Netherlands.",
      github: "GitHub",
      linkedin: "LinkedIn",
      emailMe: "Email Me",
    },
    sections: {
      about: "About",
      experience: "Experience",
      educationCerts: "Education & Certifications",
      skills: "Technical Skills",
      languages: "Languages",
      projects: "Projects",
    },
    home: {
      viewAll: "View all",
      letsWork: "Let\u2019s work together",
      letsWorkDescription:
        "Interested in working together or have a question? Feel free to reach out.",
      getInTouch: "Get in touch",
      yearsExperience: "Years Experience",
      companies: "Companies",
      certifications: "Certifications",
      countries: "Countries",
      readPost: "Read post",
    },
    projects: {
      title: "Projects",
      description:
        "A selection of platform engineering work and notable contributions.",
      source: "Source",
      live: "Live",
      backToProjects: "Back to projects",
      techStack: "Tech Stack",
      readMore: "Read more",
    },
    courses: {
      title: "Open Courseware",
      description:
        "Free, open-source courses created and maintained by Mohamad Alsharbaji.",
      backToCourses: "Back to courses",
      openLesson: "Open lesson",
      startLearning: "Start learning",
      exploreCurriculum: "Explore curriculum",
      topics: "Topics",
      phase1: "Foundations",
      phase2: "Applied Prompt Engineering",
      phase3: "AI Agents",
      bonus: "Bonus",
      phase1Desc: "Core concepts & first API calls",
      phase2Desc: "RAG, tools, evaluation & projects",
      phase3Desc: "Architecture, frameworks & building agents",
      bonusDesc: "Career growth & staying current",
      createdBy: "Created by",
      freeAndOpen: "Free & Open Source",
      whatYouLearn: "What you'll learn",
      allPhases: "All Topics",
      phases: "Phases",
      concepts: "Concepts",
      lessons: "Lessons",
      learnPoint1:
        "Understand how LLMs work under the hood — tokens, context windows, and model selection",
      learnPoint2:
        "Master prompt engineering techniques from zero-shot to chain-of-thought and meta-prompting",
      learnPoint3:
        "Build production applications with RAG, tool use, and structured output",
      learnPoint4:
        "Design and implement autonomous AI agents with memory, planning, and multi-agent orchestration",
      tagTheory: "Theory",
      tagHandsOn: "Hands-On",
      tagProject: "Project",
      tagCareer: "Career",
    },
    blog: {
      title: "Blog",
      description:
        "Thoughts on platform engineering, cloud infrastructure, and DevOps.",
      noPosts: "No posts yet. Stay tuned.",
      backToBlog: "Back to blog",
      minRead: "min read",
      part: "Part",
      parts: "parts",
      seriesCicdMigration: "CI/CD Migration Series",
      onThisPage: "On this page",
      backToTop: "Back to top",
    },
    contact: {
      title: "Contact",
      description:
        "Have a question or want to work together? Send me a message or reach out directly.",
      directContact: "Direct Contact",
      basedIn:
        'Based in <span class="text-foreground">the Netherlands</span>. Open to remote opportunities and collaborations across Europe and globally.',
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      message: "Message",
      messagePlaceholder: "Your message...",
      send: "Send Message",
      sending: "Sending...",
      sent: "Message sent successfully. I'll get back to you soon.",
      error:
        "Something went wrong. Please try again or email me directly.",
    },
    footer: {
      github: "GitHub",
      linkedin: "LinkedIn",
      email: "Email",
    },
    language: {
      toggle: "عربي",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      projects: "المشاريع",
      courses: "المواد التعليمية",
      blog: "المدونة",
      contact: "تواصل",
    },
    hero: {
      name: "محمد",
      lastName: "الشربجي",
      arabicName: "Mohamad Alsharbaji",
      role: "Platform Engineer",
      description:
        "أكثر من 10 سنوات في بناء منصات موثوقة، وإدارة Kubernetes Clusters، وتحقيق التميز التشغيلي عبر Large-Scale Distributed Systems. مقيم في هولندا.",
      github: "GitHub",
      linkedin: "LinkedIn",
      emailMe: "راسلني",
    },
    sections: {
      about: "نبذة عني",
      experience: "الخبرات",
      educationCerts: "التعليم والشهادات",
      skills: "المهارات التقنية",
      languages: "اللغات",
      projects: "المشاريع",
    },
    home: {
      viewAll: "عرض الكل",
      letsWork: "لنعمل معاً",
      letsWorkDescription:
        "مهتم بالتعاون أو لديك سؤال؟ لا تتردد في التواصل.",
      getInTouch: "تواصل معي",
      yearsExperience: "سنوات خبرة",
      companies: "شركات",
      certifications: "شهادات",
      countries: "دول",
      readPost: "اقرأ المقال",
    },
    projects: {
      title: "المشاريع",
      description:
        "مجموعة مختارة من أعمال هندسة المنصات والمساهمات البارزة.",
      source: "المصدر",
      live: "مباشر",
      backToProjects: "العودة للمشاريع",
      techStack: "التقنيات المستخدمة",
      readMore: "اقرأ المزيد",
    },
    courses: {
      title: "تعليم مفتوح",
      description:
        "دورات مجانية ومفتوحة المصدر من إعداد محمد الشربجي.",
      backToCourses: "العودة للدورات",
      openLesson: "افتح الدرس",
      startLearning: "ابدأ التعلم",
      exploreCurriculum: "استعرض المنهج",
      topics: "المواضيع",
      phase1: "الأساسيات",
      phase2: "هندسة البرومبت التطبيقية",
      phase3: "وكلاء الذكاء الاصطناعي",
      bonus: "إضافي",
      phase1Desc: "المفاهيم الأساسية وأول تجربة مع الـ API",
      phase2Desc: "RAG والأدوات والتقييم ومشاريع عملية",
      phase3Desc: "بنية الـ agents وأطر العمل وبناء agents من الصفر",
      bonusDesc: "المسار المهني ومواكبة آخر التطورات",
      createdBy: "من إعداد",
      freeAndOpen: "مجاني ومفتوح المصدر",
      whatYouLearn: "ماذا ستتعلم",
      allPhases: "جميع المواضيع",
      phases: "المراحل",
      concepts: "المفاهيم",
      lessons: "الدروس",
      learnPoint1:
        "فهم آلية عمل نماذج اللغة الكبيرة — الرموز ونوافذ السياق واختيار النموذج",
      learnPoint2:
        "إتقان تقنيات هندسة البرومبت من zero-shot إلى chain-of-thought والـ meta-prompting",
      learnPoint3:
        "بناء تطبيقات إنتاجية باستخدام RAG واستخدام الأدوات والمخرجات المنظمة",
      learnPoint4:
        "تصميم وتنفيذ وكلاء ذكاء اصطناعي مستقلين مع الذاكرة والتخطيط وتنسيق الوكلاء المتعددين",
      tagTheory: "نظري",
      tagHandsOn: "تطبيقي",
      tagProject: "مشروع",
      tagCareer: "مهني",
    },
    blog: {
      title: "المدونة",
      description:
        "أفكار حول هندسة المنصات، والبنية التحتية السحابية، وDevOps.",
      noPosts: "لا توجد مقالات بعد. ترقبوا الجديد.",
      backToBlog: "العودة للمدونة",
      minRead: "دقائق قراءة",
      part: "الجزء",
      parts: "أجزاء",
      seriesCicdMigration: "سلسلة انتقال CI/CD",
      onThisPage: "في هذه الصفحة",
      backToTop: "العودة للأعلى",
    },
    contact: {
      title: "تواصل",
      description:
        "لديك سؤال أو ترغب في التعاون؟ أرسل لي رسالة أو تواصل معي مباشرة.",
      directContact: "التواصل المباشر",
      basedIn:
        'مقيم في <span class="text-foreground">هولندا</span>. منفتح على فرص العمل عن بُعد والتعاون عبر أوروبا والعالم.',
      name: "الاسم",
      namePlaceholder: "اسمك",
      email: "البريد الإلكتروني",
      emailPlaceholder: "you@example.com",
      message: "الرسالة",
      messagePlaceholder: "رسالتك...",
      send: "إرسال الرسالة",
      sending: "جاري الإرسال...",
      sent: "تم إرسال الرسالة بنجاح. سأتواصل معك قريباً.",
      error:
        "حدث خطأ ما. يرجى المحاولة مرة أخرى أو مراسلتي مباشرة.",
    },
    footer: {
      github: "GitHub",
      linkedin: "LinkedIn",
      email: "البريد",
    },
    language: {
      toggle: "EN",
    },
  },
};

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type Translations = DeepStringify<typeof translations.en>;

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}
