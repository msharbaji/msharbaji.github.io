"use client";

import { Course } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import BackLink from "@/components/BackLink";
import TopicCard from "@/components/TopicCard";
import AnimateIn from "@/components/AnimateIn";

const phases = [
  { num: 1, key: "phase1" as const, descKey: "phase1Desc" as const, color: "bg-accent" },
  { num: 2, key: "phase2" as const, descKey: "phase2Desc" as const, color: "bg-blue-500" },
  { num: 3, key: "phase3" as const, descKey: "phase3Desc" as const, color: "bg-emerald-500" },
  { num: 4, key: "bonus" as const, descKey: "bonusDesc" as const, color: "bg-cyan-500" },
];

export default function CourseDetail({ course }: { course: Course }) {
  const { locale, t } = useLanguage();

  return (
    <article className="py-20">
      <BackLink href="/courses" label="backToCourses" />

      <AnimateIn>
        <header className="mb-12">
          <h1 className="font-display text-3xl font-700 tracking-tight sm:text-4xl">
            {course.title[locale]}
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            {course.description[locale]}
          </p>
          <div className="mt-6 flex gap-6">
            <div>
              <span className="block font-display text-lg font-700 text-foreground">
                {course.topics.length}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted">
                {t.courses.topics}
              </span>
            </div>
            <div>
              <span className="block font-display text-lg font-700 text-foreground">
                3
              </span>
              <span className="text-xs uppercase tracking-wider text-muted">
                Phases
              </span>
            </div>
            <div>
              <span className="block font-display text-lg font-700 text-foreground">
                100+
              </span>
              <span className="text-xs uppercase tracking-wider text-muted">
                Concepts
              </span>
            </div>
          </div>
        </header>
      </AnimateIn>

      <div className="section-divider mb-12" />

      {phases.map((phase) => {
        const topics = course.topics.filter((t) => t.phase === phase.num);
        if (topics.length === 0) return null;

        return (
          <AnimateIn key={phase.num}>
            <section className="mb-10">
              <div className="mb-5 flex items-center gap-3 border-b border-border pb-3">
                <span
                  className={`rounded-md px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white ${phase.color}`}
                >
                  {phase.num <= 3 ? `Phase ${phase.num}` : t.courses.bonus}
                </span>
                <span className="font-display text-lg font-700 text-foreground">
                  {t.courses[phase.key]}
                </span>
                <span className="ms-auto hidden text-sm text-muted sm:block">
                  {t.courses[phase.descKey]}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {topics.map((topic) => (
                  <TopicCard
                    key={topic.number}
                    topic={topic}
                    courseSlug={course.slug}
                  />
                ))}
              </div>
            </section>
          </AnimateIn>
        );
      })}
    </article>
  );
}
