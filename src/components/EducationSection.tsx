"use client";

import { education, certifications } from "@/lib/resume-data";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimateIn from "./AnimateIn";

export default function EducationSection() {
  const { locale, t } = useLanguage();

  return (
    <section className="py-10 sm:py-16">
      <AnimateIn>
        <h2 className="font-display text-sm font-600 uppercase tracking-[0.2em] text-accent">
          {t.sections.educationCerts}
        </h2>
      </AnimateIn>

      {/* Education */}
      <div className="mt-10 space-y-6">
        {education.map((edu, i) => (
          <AnimateIn key={i} delay={0.05}>
            <div>
              <h3 className="font-display text-base font-600 text-foreground sm:text-lg">
                {edu.degree[locale]}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">{edu.school[locale]}</p>
              <p className="mt-1.5 font-mono text-[11px] tracking-wider text-muted">
                <time>{edu.period}</time> &middot; {edu.note[locale]}
              </p>
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Certifications */}
      <AnimateIn delay={0.1}>
        <div className="mt-8 flex flex-wrap gap-3">
          {certifications.map((cert, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-surface/50 px-4 py-2.5 transition-colors hover:border-accent/30"
            >
              <svg
                className="size-4 shrink-0 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-foreground">{cert.name[locale]}</p>
                <p className="font-mono text-[10px] tracking-wider text-muted"><time>{cert.date}</time></p>
              </div>
            </div>
          ))}
        </div>
      </AnimateIn>
    </section>
  );
}
