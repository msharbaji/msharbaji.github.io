"use client";

import Hero from "@/components/Hero";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectCard from "@/components/ProjectCard";
import AnimateIn from "@/components/AnimateIn";
import Link from "next/link";
import { summary } from "@/lib/resume-data";
import { projects } from "@/lib/projects-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { locale, t } = useLanguage();
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Summary */}
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
      </section>

      <div className="section-divider" />
      <ExperienceSection />

      <div className="section-divider" />
      <EducationSection />

      <div className="section-divider" />
      <SkillsSection />

      {/* Featured Projects */}
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
              <svg
                className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </AnimateIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, i) => (
            <AnimateIn key={project.slug} delay={i * 0.1}>
              <ProjectCard project={project} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <div className="section-divider" />
      <AnimateIn>
        <section className="relative py-16 text-center sm:py-24">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-accent/[0.04] blur-[80px]" />
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
              className="group mt-8 inline-flex items-center gap-2.5 rounded-lg border border-accent bg-accent px-7 py-3.5 font-mono text-xs font-medium uppercase tracking-widest text-background transition-all duration-200 hover:border-accent-hover hover:bg-accent-hover hover:shadow-[0_0_30px_-5px] hover:shadow-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              {t.home.getInTouch}
              <svg
                className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
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
