export type Locale = "en" | "ar";

export type Bilingual<T = string> = Record<Locale, T>;

const translations = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
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
    blog: {
      title: "Blog",
      description:
        "Thoughts on platform engineering, cloud infrastructure, and DevOps.",
      noPosts: "No posts yet. Stay tuned.",
      backToBlog: "Back to blog",
      minRead: "min read",
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
    blog: {
      title: "المدونة",
      description:
        "أفكار حول هندسة المنصات، والبنية التحتية السحابية، وDevOps.",
      noPosts: "لا توجد مقالات بعد. ترقبوا الجديد.",
      backToBlog: "العودة للمدونة",
      minRead: "دقائق قراءة",
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
