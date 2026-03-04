"use client";

import Hero from "@/components/Hero";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectCard from "@/components/ProjectCard";
import ArrowIcon from "@/components/ArrowIcon";
import AnimateIn from "@/components/AnimateIn";
import Link from "next/link";
import { summary, languages } from "@/lib/resume-data";
import { projects } from "@/lib/projects-data";
import { courses } from "@/lib/courses-data";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BlogPost } from "@/lib/types";

const stats = [
  { value: "10+", key: "yearsExperience" as const },
  { value: "8", key: "companies" as const },
  { value: "2", key: "certifications" as const },
  { value: "4", key: "countries" as const },
];

export default function HomeContent({
  latestPost,
}: {
  latestPost: Omit<BlogPost, "content"> | null;
}) {
  const { locale, t } = useLanguage();
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <Hero />

      {/* About + Stats */}
      <section className="py-10 sm:py-16">
        <AnimateIn>
          <h2 className="font-display text-sm font-600 uppercase tracking-[0.2em] text-accent">
            {t.sections.about}
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:mt-6 sm:text-base">
            {summary[locale]}
          </p>
        </AnimateIn>

        {/* Languages */}
        <AnimateIn delay={0.15}>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted/60">
              {t.sections.languages}
            </span>
            {languages.map((lang) => (
              <span
                key={lang.name.en}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-foreground/80"
              >
                {lang.name[locale]}
                <span className="flex gap-0.5" aria-label={lang.level[locale]}>
                  {[1, 2, 3].map((dot) => (
                    <span
                      key={dot}
                      className={`size-1 rounded-full ${
                        (lang.level.en === "Native" && dot <= 3) ||
                        (lang.level.en === "Professional working proficiency" && dot <= 2) ||
                        (lang.level.en === "Beginner" && dot <= 1)
                          ? "bg-accent"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </span>
              </span>
            ))}
          </div>
        </AnimateIn>

        {/* Stats row */}
        <AnimateIn delay={0.2}>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="flex flex-col items-center bg-card py-5 sm:py-6"
              >
                <span className="font-display text-2xl font-800 tracking-tight text-accent sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-[11px] uppercase tracking-wider text-muted">
                  {t.home[stat.key]}
                </span>
              </div>
            ))}
          </div>
        </AnimateIn>
      </section>

      <div className="section-divider" />
      <ExperienceSection />

      <div className="section-divider" />
      <EducationSection />

      <div className="section-divider" />
      <SkillsSection />

      <div className="section-divider" />
      <section className="py-10 sm:py-16">
        <AnimateIn>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-sm font-600 uppercase tracking-[0.2em] text-accent">
              {t.sections.projects}
            </h2>
            <Link
              href="/projects"
              className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background focus:rounded-md"
            >
              {t.home.viewAll}
              <ArrowIcon className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </AnimateIn>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, i) => (
            <AnimateIn key={project.slug} delay={i * 0.1}>
              <ProjectCard project={project} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {latestPost && (
        <>
          <div className="section-divider" />
          <section className="py-10 sm:py-16">
            <AnimateIn>
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-sm font-600 uppercase tracking-[0.2em] text-accent">
                  {t.blog.title}
                </h2>
                <Link
                  href="/blog"
                  className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background focus:rounded-md"
                >
                  {t.home.viewAll}
                  <ArrowIcon className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <Link
                href={`/blog/${latestPost.slug}`}
                className="card-hover group mt-8 block"
              >
                <div className="flex items-center gap-3 text-xs text-muted">
                  <time dateTime={latestPost.date}>
                    {new Date(latestPost.date).toLocaleDateString(
                      locale === "ar" ? "ar-SA" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                  <span className="text-border">·</span>
                  <span>
                    {latestPost.readingTime} {t.blog.minRead}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-700 tracking-tight text-foreground sm:text-xl">
                  {latestPost.title[locale]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {latestPost.description[locale]}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {latestPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors group-hover:border-border-hover"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1.5 pt-2 font-mono text-[11px] uppercase tracking-widest text-muted/40 transition-colors group-hover:text-accent">
                  <span className="border-t border-border pt-3 group-hover:border-accent/20">
                    {t.home.readPost}
                  </span>
                  <ArrowIcon className="size-3 translate-y-1.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </div>
              </Link>
            </AnimateIn>
          </section>
        </>
      )}

      <div className="section-divider" />
      <section className="py-10 sm:py-16">
        <AnimateIn>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-sm font-600 uppercase tracking-[0.2em] text-accent">
              {t.courses.title}
            </h2>
            <Link
              href="/courses"
              className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background focus:rounded-md"
            >
              {t.home.viewAll}
              <ArrowIcon className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <Link
            href={`/courses/${courses[0].slug}`}
            className="group mt-8 block rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_0_40px_-12px] hover:shadow-accent/15 sm:p-8"
          >
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              {t.courses.freeAndOpen}
            </span>
            <h3 className="mt-3 font-display text-lg font-700 tracking-tight text-foreground sm:text-xl">
              {courses[0].title[locale]}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {courses[0].description[locale]}
            </p>
            <div className="mt-4 flex gap-6 text-xs uppercase tracking-wider text-muted">
              <span>
                <span className="font-bold text-foreground">{courses[0].topics.length}</span>{" "}
                {t.courses.lessons}
              </span>
              <span>
                <span className="font-bold text-foreground">{new Set(courses[0].topics.map((t) => t.phase)).size}</span>{" "}
                {t.courses.phases}
              </span>
            </div>
          </Link>
        </AnimateIn>
      </section>

      <div className="section-divider" />
      <AnimateIn>
        <section className="relative rounded-2xl border border-accent-warm/10 bg-accent-warm/[0.03] py-16 text-center sm:py-24">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-accent-warm/[0.04] blur-[80px]" />
          </div>
          <div className="relative">
            <h2 className="font-display text-2xl font-700 tracking-tight sm:text-4xl">
              {t.home.letsWork}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              {t.home.letsWorkDescription}
            </p>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2.5 rounded-lg border border-accent-warm bg-accent-warm px-7 py-3.5 font-mono text-xs font-medium uppercase tracking-widest text-background transition-all duration-200 hover:border-accent-warm-hover hover:bg-accent-warm-hover hover:shadow-[0_0_30px_-5px] hover:shadow-accent-warm/30 focus:outline-none focus:ring-2 focus:ring-accent-warm focus:ring-offset-2 focus:ring-offset-background"
            >
              {t.home.getInTouch}
              <svg
                className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </Link>
          </div>
        </section>
      </AnimateIn>
    </>
  );
}
