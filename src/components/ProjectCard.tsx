"use client";

import Link from "next/link";
import { Project } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProjectCard({ project }: { project: Project }) {
  const { locale, t } = useLanguage();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_0_40px_-12px] hover:shadow-accent/15"
    >
      <h3 className="font-display text-base font-600 text-foreground transition-colors group-hover:text-accent">
        {project.title[locale]}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
        {project.description[locale]}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors group-hover:border-border-hover"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-1.5 pt-2 font-mono text-[11px] uppercase tracking-widest text-muted/40 transition-colors group-hover:text-accent">
        <span className="border-t border-border pt-3 group-hover:border-accent/20">
          {t.projects.readMore}
        </span>
        <svg
          className="size-3 translate-y-1.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
