"use client";

import { Project } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import BackLink from "@/components/BackLink";
import { sanitize } from "@/lib/sanitize";

export default function ProjectDetail({ project }: { project: Project }) {
  const { locale, t } = useLanguage();

  return (
    <article className="py-20">
      <BackLink href="/projects" label="backToProjects" />

      <header className="mb-12">
        <h1 className="font-display text-3xl font-700 tracking-tight sm:text-4xl">
          {project.title[locale]}
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          {project.description[locale]}
        </p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded border border-border bg-surface px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
        {(project.github || project.live) && (
          <div className="mt-6 flex gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-accent-hover"
              >
                {t.projects.source}
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-accent-hover"
              >
                {t.projects.live}
              </a>
            )}
          </div>
        )}
      </header>

      <div className="section-divider mb-12" />

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitize(project.content[locale]) }}
      />
    </article>
  );
}
