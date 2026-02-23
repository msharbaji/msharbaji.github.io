"use client";

import AnimateIn from "@/components/AnimateIn";
import Link from "next/link";
import { courses } from "@/lib/courses-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CoursesPage() {
  const { locale, t } = useLanguage();

  return (
    <div className="py-20">
      <AnimateIn>
        <h1 className="font-display text-4xl font-700 tracking-tight sm:text-5xl">
          {t.courses.title}
        </h1>
      </AnimateIn>
      <AnimateIn delay={0.1}>
        <p className="mt-4 max-w-xl text-muted">{t.courses.description}</p>
      </AnimateIn>

      <div className="mt-12 grid gap-6">
        {courses.map((course, i) => (
          <AnimateIn key={course.slug} delay={i * 0.1}>
            <Link
              href={`/courses/${course.slug}`}
              className="group block rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-700 tracking-tight text-foreground sm:text-2xl">
                    {course.title[locale]}
                  </h2>
                  <p className="mt-2 text-sm text-muted sm:text-base">
                    {course.description[locale]}
                  </p>
                </div>
                <svg
                  className="hidden size-5 shrink-0 text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-1 sm:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
              <div className="mt-5 flex gap-6 border-t border-border/60 pt-5">
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
            </Link>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
