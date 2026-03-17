"use client";

import { useState } from "react";
import { Course } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import TopicCard from "@/components/TopicCard";
import AnimateIn from "@/components/AnimateIn";

export default function PhaseTabs({ course }: { course: Course }) {
  const [activePhase, setActivePhase] = useState(0);
  const { locale, t } = useLanguage();

  const filteredTopics =
    activePhase === 0
      ? course.topics
      : course.topics.filter((topic) => topic.phase === activePhase);

  const activeConfig = course.phases.find((p) => p.num === activePhase);

  return (
    <div>
      {/* Tab bar */}
      <div
        role="tablist"
        className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-surface p-1.5"
      >
        {/* "All Topics" tab */}
        <button
          role="tab"
          aria-selected={activePhase === 0}
          onClick={() => setActivePhase(0)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            activePhase === 0
              ? "bg-background text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          {t.courses.allPhases}
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
              activePhase === 0
                ? "bg-accent/10 text-accent"
                : "text-muted/60"
            }`}
          >
            {course.topics.length}
          </span>
        </button>

        {/* Course-specific phase tabs */}
        {course.phases.map((phase) => {
          const count = course.topics.filter(
            (t) => t.phase === phase.num
          ).length;
          if (count === 0) return null;

          const isActive = activePhase === phase.num;

          return (
            <button
              key={phase.num}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActivePhase(phase.num)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {phase.name[locale]}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted/60"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phase description */}
      {activePhase !== 0 && activeConfig?.description && (
        <p className="mt-4 text-sm text-muted">
          {activeConfig.description[locale]}
        </p>
      )}

      {/* Topic list — single column curriculum style */}
      <div role="tabpanel" className="mt-5 flex flex-col gap-2">
        {filteredTopics.map((topic, i) => (
          <AnimateIn key={topic.number} delay={i * 0.02}>
            <TopicCard topic={topic} courseSlug={course.slug} />
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
