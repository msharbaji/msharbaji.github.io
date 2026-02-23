"use client";

import { skills, languages } from "@/lib/resume-data";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimateIn from "./AnimateIn";

export default function SkillsSection() {
  const { locale, t } = useLanguage();

  return (
    <section className="py-10 sm:py-16">
      <AnimateIn>
        <h2 className="font-display text-sm font-600 uppercase tracking-[0.2em] text-accent">
          {t.sections.skills}
        </h2>
      </AnimateIn>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {skills.map((group, i) => (
          <AnimateIn key={group.category.en} delay={i * 0.05}>
            <div className="h-full rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_0_40px_-12px] hover:shadow-accent/15">
              <h3 className="inline-flex items-center rounded-md bg-accent/10 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-accent">
                {group.category[locale]}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-surface px-3 py-1.5 font-mono text-[11px] text-foreground/70 transition-all duration-200 hover:bg-accent/10 hover:text-accent"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Languages */}
      <AnimateIn delay={0.3}>
        <div className="mt-10">
          <span className="mb-3 block font-mono text-[11px] font-medium uppercase tracking-widest text-muted">
            {t.sections.languages}
          </span>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 [&>*:not(:first-child)]:border-s [&>*:not(:first-child)]:border-border [&>*:not(:first-child)]:ps-5">
            {languages.map((lang) => (
              <div key={lang.name.en} className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="font-display text-sm font-600 text-foreground">
                  {lang.name[locale]}
                </span>
                <span className="font-mono text-[11px] tracking-wider text-muted">
                  ({lang.level[locale]})
                </span>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
