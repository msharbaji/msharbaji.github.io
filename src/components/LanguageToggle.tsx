"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs font-medium tracking-wider text-foreground/80 transition-colors hover:border-accent/40 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      {t.language.toggle}
    </button>
  );
}
