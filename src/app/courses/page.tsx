"use client";

import AnimateIn from "@/components/AnimateIn";
import ArrowIcon from "@/components/ArrowIcon";
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
          <AnimateIn key={course.slug} delay={0.15 + i * 0.1}>
            <Link
              href={`/courses/${course.slug}`}
              className="group block rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_0_40px_-12px] hover:shadow-accent/15 sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                      {t.courses.freeAndOpen}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-700 tracking-tight text-foreground sm:text-2xl">
                    {course.title[locale]}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                    {course.description[locale]}
                  </p>
                </div>
                <ArrowIcon className="hidden size-5 shrink-0 text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-1 sm:block" />
              </div>

              {/* Stats row */}
              <div className="mt-5 flex items-center gap-6 border-t border-border/60 pt-5 text-xs uppercase tracking-wider text-muted">
                <span>
                  <span className="font-display text-base font-700 text-foreground">
                    {course.topics.length}
                  </span>{" "}
                  {t.courses.lessons}
                </span>
                <span>
                  <span className="font-display text-base font-700 text-foreground">
                    {new Set(course.topics.map((t) => t.phase)).size}
                  </span>{" "}
                  {t.courses.phases}
                </span>
              </div>
            </Link>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
