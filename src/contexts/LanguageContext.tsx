"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { type Locale, type Translations, getTranslations } from "@/lib/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Reads stored locale from localStorage, or detects from browser. Only safe to call in browser. */
function getStoredLocale(): Locale {
  const stored = localStorage.getItem("locale");
  if (stored === "ar" || stored === "en") return stored;
  // Auto-detect from browser language on first visit
  const browserLang = navigator.language || "";
  return browserLang.startsWith("ar") ? "ar" : "en";
}

/**
 * Provides language/locale context for the app with RTL support.
 * Uses "en" for initial render to avoid server/client hydration mismatch,
 * then syncs from localStorage in useEffect.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const hasHydrated = useRef(false);

  // Sync from localStorage on mount (after hydration) to avoid server/client mismatch.
  // Deferred to next tick to satisfy react-hooks/set-state-in-effect (avoids sync setState in effect).
  useEffect(() => {
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      const stored = getStoredLocale();
      if (stored !== "en") {
        const id = setTimeout(() => setLocaleState(stored), 0);
        return () => clearTimeout(id);
      }
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  // Update <html> attributes whenever locale changes
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";

    if (locale === "ar") {
      html.classList.add("font-arabic");
    } else {
      html.classList.remove("font-arabic");
    }
  }, [locale]);

  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = getTranslations(locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
