import { Course } from "./types";

export const courses: Course[] = [
  {
    slug: "prompt-engineering",
    title: {
      en: "Prompt Engineering & AI Agents",
      ar: "هندسة البرومبت وبناء وكلاء الذكاء الاصطناعي",
    },
    description: {
      en: "From zero to building production AI agents — 23 interactive lessons across 4 phases, covering prompt fundamentals, applied techniques, autonomous agent systems, and career guidance.",
      ar: "من الصفر إلى بناء AI agents جاهزة للإنتاج — 23 درس تفاعلي على 4 مراحل: أساسيات البرومبت، تقنيات تطبيقية، أنظمة agents مستقلة، وتوجيه مهني.",
    },
    topics: [
      // Phase 1: Foundations (Topics 1–7)
      {
        number: 1,
        file: "topic-01-how-llms-work.html",
        title: {
          en: "How LLMs Actually Work",
          ar: "كيف تعمل النماذج اللغوية الكبيرة",
        },
        description: {
          en: "Tokens, context windows, temperature, and the engine behind every AI tool",
          ar: "Tokens و context windows و temperature — إيش اللي يشغّل أدوات الـ AI من الداخل",
        },
        icon: "🧠",
        tag: "theory",
        phase: 1,
      },
      {
        number: 2,
        file: "topic-model-selection.html",
        title: {
          en: "Model Selection & Comparison",
          ar: "اختيار النماذج ومقارنتها",
        },
        description: {
          en: "Compare model families, benchmarks, and build a practical selection framework",
          ar: "قارن بين النماذج المختلفة، اقرأ الـ benchmarks، واختار النموذج المناسب لمشروعك",
        },
        icon: "⚖️",
        tag: "theory",
        phase: 1,
      },
      {
        number: 3,
        file: "topic-02-prompt-structure-basics.html",
        title: {
          en: "Prompt Structure Basics",
          ar: "أساسيات بناء البرومبت",
        },
        description: {
          en: "Roles, instructions, constraints, and the anatomy of a great prompt",
          ar: "الأدوار والتعليمات والقيود — كيف تبني برومبت فعّال خطوة بخطوة",
        },
        icon: "🏗️",
        tag: "theory",
        phase: 1,
      },
      {
        number: 4,
        file: "topic-03-prompting-techniques.html",
        title: {
          en: "Prompting Techniques",
          ar: "تقنيات صياغة البرومبت",
        },
        description: {
          en: "Zero-shot, few-shot, chain-of-thought, and more",
          ar: "أساليب Zero-shot وFew-shot وChain-of-Thought وغيرها",
        },
        icon: "🎯",
        tag: "theory",
        phase: 1,
      },
      {
        number: 5,
        file: "topic-04-advanced-prompting.html",
        title: {
          en: "Advanced Prompting",
          ar: "تقنيات البرومبت المتقدمة",
        },
        description: {
          en: "XML tags, structured output, prompt chaining, and meta-prompting",
          ar: "XML tags و structured output و prompt chaining و meta-prompting",
        },
        icon: "⚡",
        tag: "hands-on",
        phase: 1,
      },
      {
        number: 6,
        file: "topic-05-prompt-iteration.html",
        title: {
          en: "Prompt Iteration & Debugging",
          ar: "تطوير البرومبت واكتشاف الأخطاء",
        },
        description: {
          en: "Systematic process from first draft to production-ready",
          ar: "خطوات منهجية من أول مسودة لين يصير البرومبت جاهز للـ production",
        },
        icon: "🔄",
        tag: "hands-on",
        phase: 1,
      },
      {
        number: 7,
        file: "topic-06-api-hands-on.html",
        title: {
          en: "Hands-On: Building with LLM APIs",
          ar: "تطبيق عملي: البناء مع واجهات LLM البرمجية",
        },
        description: {
          en: "Streaming, error handling, and a complete CLI chat app",
          ar: "Streaming و error handling وبناء تطبيق chat كامل عبر CLI",
        },
        icon: "🛠️",
        tag: "project",
        phase: 1,
      },

      // Phase 2: Applied Prompt Engineering (Topics 8–14)
      {
        number: 8,
        file: "topic-07-rag-concepts.html",
        title: {
          en: "RAG: Retrieval-Augmented Generation",
          ar: "RAG: التوليد المعزّز بالاسترجاع",
        },
        description: {
          en: "Give your LLM access to external knowledge",
          ar: "خلّ النموذج يوصل لمصادر معرفة خارجية",
        },
        icon: "📚",
        tag: "theory",
        phase: 2,
      },
      {
        number: 9,
        file: "topic-08-tool-use.html",
        title: {
          en: "Tool Use & Function Calling",
          ar: "استخدام الأدوات واستدعاء الدوال",
        },
        description: {
          en: "Let your LLM take actions — calling APIs and accessing live data",
          ar: "خلّ النموذج ينفّذ أوامر فعلية — يستدعي APIs ويوصل لبيانات حيّة",
        },
        icon: "🔧",
        tag: "hands-on",
        phase: 2,
      },
      {
        number: 10,
        file: "topic-09-prompt-chains.html",
        title: {
          en: "Prompt Templates & Chaining",
          ar: "قوالب البرومبت وتسلسلها",
        },
        description: {
          en: "Reusable components and multi-step workflows",
          ar: "قوالب تقدر تعيد استخدامها و workflows بخطوات متعددة",
        },
        icon: "⛓️",
        tag: "hands-on",
        phase: 2,
      },
      {
        number: 11,
        file: "topic-structured-output.html",
        title: {
          en: "Structured Output & Parsing",
          ar: "المخرجات المنظمة والتحليل",
        },
        description: {
          en: "JSON mode, schema-driven generation, Pydantic models, and validation strategies",
          ar: "JSON mode و schema-driven generation و Pydantic models وطرق الـ validation",
        },
        icon: "📋",
        tag: "hands-on",
        phase: 2,
      },
      {
        number: 12,
        file: "topic-10-evaluation.html",
        title: {
          en: "Evaluating Prompt Quality",
          ar: "تقييم جودة البرومبت",
        },
        description: {
          en: "Measure, score, and systematically improve prompts",
          ar: "كيف تقيس جودة البرومبت وتحسّنه بشكل منهجي",
        },
        icon: "📊",
        tag: "hands-on",
        phase: 2,
      },
      {
        number: 13,
        file: "topic-safety-guardrails.html",
        title: {
          en: "Safety & Guardrails",
          ar: "الأمان والحواجز الوقائية",
        },
        description: {
          en: "Prompt injection defenses, content filtering, and guardrails frameworks",
          ar: "الحماية من prompt injection و content filtering و guardrails",
        },
        icon: "🛡️",
        tag: "theory",
        phase: 2,
      },
      {
        number: 14,
        file: "topic-11-mini-project.html",
        title: {
          en: "Project: AI-Powered Code Review Tool",
          ar: "مشروع: أداة مراجعة كود مدعومة بالذكاء الاصطناعي",
        },
        description: {
          en: "Build a complete prompt-powered application from scratch",
          ar: "ابنِ تطبيق كامل يشتغل بالبرومبت من الصفر",
        },
        icon: "🚀",
        tag: "project",
        phase: 2,
      },

      // Phase 3: AI Agents (Topics 15–21)
      {
        number: 15,
        file: "topic-12-what-are-agents.html",
        title: {
          en: "What Are AI Agents?",
          ar: "ما هي وكلاء الذكاء الاصطناعي؟",
        },
        description: {
          en: "The paradigm shift from chatbots to autonomous agents",
          ar: "الفرق بين chatbot عادي و AI agent مستقل",
        },
        icon: "🤖",
        tag: "theory",
        phase: 3,
      },
      {
        number: 16,
        file: "topic-13-agent-architecture.html",
        title: {
          en: "Agent Architecture",
          ar: "بنية الوكيل الذكي",
        },
        description: {
          en: "Planning, memory, tool use, and the reasoning loop",
          ar: "التخطيط والذاكرة واستخدام الأدوات و reasoning loop",
        },
        icon: "🏛️",
        tag: "theory",
        phase: 3,
      },
      {
        number: 17,
        file: "topic-memory-context.html",
        title: {
          en: "Memory & Context Management",
          ar: "إدارة الذاكرة والسياق",
        },
        description: {
          en: "Buffer, summary, and vector memory types plus context window strategies",
          ar: "أنواع الـ memory (buffer, summary, vector) وكيف تدير الـ context window",
        },
        icon: "🧩",
        tag: "theory",
        phase: 3,
      },
      {
        number: 18,
        file: "topic-14-agent-frameworks.html",
        title: {
          en: "Agent Frameworks",
          ar: "أطر عمل بناء الوكلاء",
        },
        description: {
          en: "LangChain, CrewAI, Claude Agent SDK — choose the right tool",
          ar: "LangChain وCrewAI وClaude Agent SDK — كيف تختار الأداة المناسبة",
        },
        icon: "📦",
        tag: "hands-on",
        phase: 3,
      },
      {
        number: 19,
        file: "topic-15-build-simple-agent.html",
        title: {
          en: "Building a Simple Agent from Scratch",
          ar: "بناء وكيل بسيط من الصفر",
        },
        description: {
          en: "No frameworks — build a complete agent in pure Python",
          ar: "بدون أي framework — ابنِ agent كامل بـ Python فقط",
        },
        icon: "🔨",
        tag: "project",
        phase: 3,
      },
      {
        number: 20,
        file: "topic-16-multi-agent.html",
        title: {
          en: "Multi-Agent Systems",
          ar: "أنظمة الوكلاء المتعددين",
        },
        description: {
          en: "Orchestrate multiple specialized agents for complex tasks",
          ar: "كيف تنسّق بين عدة agents متخصصين لإنجاز مهام معقدة",
        },
        icon: "👥",
        tag: "hands-on",
        phase: 3,
      },
      {
        number: 21,
        file: "topic-17-agent-project.html",
        title: {
          en: "Project: Full-Stack AI Agent",
          ar: "مشروع: وكيل ذكاء اصطناعي متكامل",
        },
        description: {
          en: "Build a production-ready research & writing agent",
          ar: "ابنِ agent للبحث والكتابة جاهز للـ production",
        },
        icon: "🎯",
        tag: "project",
        phase: 3,
      },

      // Phase 4: Bonus (Topics 22–23)
      {
        number: 22,
        file: "topic-19-job-landscape.html",
        title: {
          en: "The AI Job Landscape",
          ar: "خريطة وظائف الذكاء الاصطناعي",
        },
        description: {
          en: "Roles, skills, and how to position yourself in the AI industry",
          ar: "إيش الوظائف المتاحة وكيف تجهّز نفسك لسوق الـ AI",
        },
        icon: "🗺️",
        tag: "career",
        phase: 4,
      },
      {
        number: 23,
        file: "topic-20-staying-current.html",
        title: {
          en: "Staying Current in AI",
          ar: "البقاء على اطلاع بمستجدات الذكاء الاصطناعي",
        },
        description: {
          en: "Resources, communities, and strategies to keep learning",
          ar: "مصادر ومجتمعات ونصائح عشان تبقى محدّث بآخر التطورات",
        },
        icon: "📡",
        tag: "career",
        phase: 4,
      },
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
