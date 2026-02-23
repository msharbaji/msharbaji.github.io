"use client";

import { experience } from "@/lib/resume-data";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimateIn from "./AnimateIn";

export default function ExperienceSection() {
  const { locale, t } = useLanguage();

  return (
    <section className="py-10 sm:py-16">
      <AnimateIn>
        <h2 className="font-display text-sm font-600 uppercase tracking-[0.2em] text-accent">
          {t.sections.experience}
        </h2>
      </AnimateIn>

      <div className="relative mt-10">
        <div className="absolute start-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/40 via-border to-transparent sm:start-[9px]" />

        <div className="space-y-10">
          {experience.map((job, i) => (
            <AnimateIn key={i} delay={i * 0.05}>
              <div className="relative ps-8 sm:ps-10">
                <div className="absolute start-0 top-1.5 size-[15px] rounded-full border-2 border-accent/50 bg-background sm:size-[19px] sm:top-1" />
                <div className="absolute start-[5px] top-[11px] size-[5px] rounded-full bg-accent sm:start-[6.5px] sm:top-[10px] sm:size-[6px]" />

                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="font-display text-base font-600 text-foreground sm:text-lg">
                      {job.role[locale]}
                    </h3>
                    <p className="text-sm font-medium text-accent">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2 text-start sm:text-end">
                    <time className="font-mono text-[11px] tracking-wider text-muted">
                      {job.period}
                    </time>
                    <span className="text-border">·</span>
                    <span className="font-mono text-[11px] tracking-wider text-muted/50">
                      {job.location[locale]}
                    </span>
                  </div>
                </div>

                <ul className="mt-3 space-y-2">
                  {job.bullets[locale].map((bullet, j) => (
                    <li key={j} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-2 flex size-1 shrink-0 rounded-full bg-muted/30" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
