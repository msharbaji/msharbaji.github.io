"use client";

import ProjectCard from "@/components/ProjectCard";
import AnimateIn from "@/components/AnimateIn";
import { projects } from "@/lib/projects-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProjectsPage() {
  const { t } = useLanguage();

  return (
    <div className="py-20">
      <AnimateIn>
        <h1 className="font-display text-4xl font-700 tracking-tight sm:text-5xl">
          {t.projects.title}
        </h1>
      </AnimateIn>
      <AnimateIn delay={0.1}>
        <p className="mt-4 max-w-xl text-muted">
          {t.projects.description}
        </p>
      </AnimateIn>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <AnimateIn key={project.slug} delay={i * 0.08}>
            <ProjectCard project={project} />
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
