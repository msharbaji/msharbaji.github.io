"use client";

import { CourseTopic } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import ArrowIcon from "@/components/ArrowIcon";

const tagStyles: Record<string, string> = {
  theory: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "hands-on": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  project: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  career: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const tagI18nKeys: Record<
  string,
  "tagTheory" | "tagHandsOn" | "tagProject" | "tagCareer"
> = {
  theory: "tagTheory",
  "hands-on": "tagHandsOn",
  project: "tagProject",
  career: "tagCareer",
};

export default function TopicCard({
  topic,
  courseSlug,
}: {
  topic: CourseTopic;
  courseSlug: string;
}) {
  const { locale, t } = useLanguage();
  const num = String(topic.number).padStart(2, "0");

  return (
    <a
      href={`/slides/${courseSlug}/${locale === "ar" ? "ar/" : ""}${topic.file}`}
      className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 text-foreground no-underline transition-all duration-200 hover:border-accent/50 hover:bg-card/80 sm:gap-4 sm:p-4"
    >
      {/* Lesson number */}
      <span className="hidden w-6 shrink-0 text-center font-mono text-xs font-medium text-muted/50 sm:block">
        {num}
      </span>

      {/* Icon */}
      <span className="shrink-0 text-xl sm:text-2xl">{topic.icon}</span>

      {/* Title + description */}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground sm:text-[15px]">
          {topic.title[locale]}
        </span>
        <span className="mt-0.5 hidden text-[13px] leading-snug text-muted sm:block">
          {topic.description[locale]}
        </span>
      </span>

      {/* Tag */}
      <span
        className={`hidden shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider md:inline-block ${tagStyles[topic.tag]}`}
      >
        {t.courses[tagI18nKeys[topic.tag]]}
      </span>

      {/* Arrow */}
      <ArrowIcon className="size-4 shrink-0 text-muted/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
    </a>
  );
}
