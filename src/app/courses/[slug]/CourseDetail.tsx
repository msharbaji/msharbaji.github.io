"use client";

import { Course } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import BackLink from "@/components/BackLink";
import PhaseTabs from "@/components/PhaseTabs";
import AnimateIn from "@/components/AnimateIn";

export default function CourseDetail({ course }: { course: Course }) {
  const { locale, t } = useLanguage();
  const firstTopic = course.topics[0];
  const firstTopicHref = `/slides/${course.slug}/${locale === "ar" ? "ar/" : ""}${firstTopic.file}`;

  return (
    <article className="py-20">
      <BackLink href="/courses" label="backToCourses" />

      <AnimateIn>
        <header className="mb-10">
          {/* Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted">
              <svg
                className="size-3"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
              </svg>
              {t.courses.createdBy}{" "}
              <span className="font-semibold text-foreground">
                Mohamad Alsharbaji
              </span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
              {t.courses.freeAndOpen}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-700 tracking-tight sm:text-4xl">
            {course.title[locale]}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {course.description[locale]}
          </p>

          {/* Stats + CTA row */}
          <div className="mt-6 flex flex-wrap items-end gap-6">
            <div className="flex gap-6">
              <div>
                <span className="block font-display text-lg font-700 text-foreground">
                  {course.topics.length}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted">
                  {t.courses.lessons}
                </span>
              </div>
              <div>
                <span className="block font-display text-lg font-700 text-foreground">
                  {course.phases.length}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted">
                  {t.courses.phases}
                </span>
              </div>
            </div>
            <a
              href={firstTopicHref}
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-widest text-white transition-all duration-200 hover:bg-accent/90 hover:shadow-[0_0_24px_-6px] hover:shadow-accent/30"
            >
              {t.courses.startLearning}
              <svg
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
          </div>
        </header>
      </AnimateIn>

      {/* What you'll learn */}
      <AnimateIn delay={0.1}>
        <section className="mb-10 rounded-xl border border-accent/10 bg-accent/[0.03] p-5 sm:p-6">
          <h2 className="font-display text-base font-700 tracking-tight text-foreground">
            {t.courses.whatYouLearn}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {course.learnPoints[locale].map((point, i) => (
              <div key={i} className="flex gap-2.5">
                <svg
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm leading-snug text-muted">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      <div className="section-divider mb-10" />

      {/* Curriculum */}
      <AnimateIn delay={0.15}>
        <h2 className="mb-5 font-display text-base font-700 tracking-tight text-foreground">
          {t.courses.exploreCurriculum}
        </h2>
        <PhaseTabs course={course} />
      </AnimateIn>
    </article>
  );
}
