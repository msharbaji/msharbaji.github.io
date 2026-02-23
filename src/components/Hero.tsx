"use client";

import Image from "next/image";
import { socials } from "@/lib/resume-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { locale, t } = useLanguage();

  return (
    <section className="relative py-14 sm:py-20 lg:py-24">
      {/* Gradient orbs — contained to prevent viewport overflow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-accent/[0.06] blur-[120px]" />
        <div className="absolute top-20 left-0 h-72 w-72 rounded-full bg-accent/[0.04] blur-[100px]" />
      </div>

      <div className="relative grid items-center gap-10 sm:gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
        {/* Text content */}
        <div>
          {/* Name — Primary */}
          <h1 className="animate-slide-up stagger-1 font-display text-4xl font-800 leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
            {locale === "en" ? (
              <>
                Mohamad{" "}
                <span className="bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
                  Alsharbaji
                </span>
              </>
            ) : (
              <>
                محمد{" "}
                <span className="bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
                  الشربجي
                </span>
              </>
            )}
          </h1>

          {/* Name — Secondary language */}
          <p
            className="animate-slide-up stagger-1 mt-2 text-xl font-600 text-foreground/40 sm:text-2xl"
            dir={locale === "en" ? "rtl" : "ltr"}
            lang={locale === "en" ? "ar" : "en"}
            style={{ fontFamily: locale === "en" ? "var(--font-arabic)" : "var(--font-display)" }}
          >
            {t.hero.arabicName}
          </p>

          {/* Role with decorative line */}
          <div className="animate-slide-up stagger-2 mt-6 flex items-center gap-4">
            <div className="h-px w-10 bg-gradient-to-r from-accent/60 to-transparent sm:w-12" />
            <p className="font-display text-base font-500 text-foreground/80 sm:text-lg lg:text-xl">
              {t.hero.role}
            </p>
          </div>

          {/* Description */}
          <p className="animate-slide-up stagger-3 mt-5 max-w-lg text-sm leading-relaxed text-muted sm:mt-6 sm:text-base">
            {t.hero.description}
          </p>

          {/* Social links */}
          <div className="animate-slide-up stagger-4 mt-8 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-foreground/80 transition-all duration-200 hover:border-accent/40 hover:bg-surface-hover hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background sm:gap-2.5 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <svg className="size-3.5 sm:size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {t.hero.github}
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-foreground/80 transition-all duration-200 hover:border-accent/40 hover:bg-surface-hover hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background sm:gap-2.5 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <svg className="size-3.5 sm:size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {t.hero.linkedin}
            </a>
            <a
              href={`mailto:${socials.email}`}
              className="group flex items-center gap-2 rounded-lg border border-accent-warm bg-accent-warm px-3.5 py-2.5 text-xs font-medium text-background transition-all duration-200 hover:border-accent-warm-hover hover:bg-accent-warm-hover focus:outline-none focus:ring-2 focus:ring-accent-warm focus:ring-offset-2 focus:ring-offset-background sm:gap-2.5 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <svg
                className="size-3.5 sm:size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              {t.hero.emailMe}
            </a>
          </div>
        </div>

        {/* Profile photo */}
        <div className="animate-scale-in stagger-3 flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-accent/20 via-accent/10 to-transparent blur-2xl" />
            <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-accent/50 via-accent/15 to-transparent" />
            <Image
              src="/images/profile.jpg"
              alt="Mohamad Alsharbaji"
              width={280}
              height={280}
              priority
              className="relative size-40 rounded-full object-cover sm:size-52 lg:size-64"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
