"use client";

import Link from "next/link";
import { Project } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import ArrowIcon from "@/components/ArrowIcon";

export default function ProjectCard({ project }: { project: Project }) {
  const { locale, t } = useLanguage();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-hover group flex h-full flex-col"
    >
      <h3 className="font-display text-base font-700 text-foreground transition-colors group-hover:text-accent">
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
        <ArrowIcon className="size-3 translate-y-1.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
      </div>
    </Link>
  );
}
