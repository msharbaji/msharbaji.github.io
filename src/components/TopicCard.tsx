"use client";

import { CourseTopic } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import ArrowIcon from "@/components/ArrowIcon";

const tagStyles: Record<string, string> = {
  theory:
    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "hands-on":
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  project:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  career:
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const tagLabels: Record<string, string> = {
  theory: "Theory",
  "hands-on": "Hands-On",
  project: "Project",
  career: "Career",
};

export default function TopicCard({
  topic,
  courseSlug,
}: {
  topic: CourseTopic;
  courseSlug: string;
}) {
  const { locale } = useLanguage();
  const num = String(topic.number).padStart(2, "0");

  return (
    <a
      href={`/slides/${courseSlug}/${locale === "ar" ? "ar/" : ""}${topic.file}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 text-foreground no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-surface/80 sm:gap-5 sm:p-5"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background font-mono text-sm font-bold text-muted transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-background">
        {num}
      </span>
      <span className="shrink-0 text-2xl">{topic.icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground sm:text-[15px]">
          {topic.title[locale]}
        </span>
        <span className="hidden text-[13px] text-muted sm:block">
          {topic.description[locale]}
        </span>
      </span>
      <span
        className={`hidden shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider sm:inline-block ${tagStyles[topic.tag]}`}
      >
        {tagLabels[topic.tag]}
      </span>
      <ArrowIcon className="size-4 shrink-0 text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
    </a>
  );
}
