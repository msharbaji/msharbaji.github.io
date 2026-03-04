"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useEffect,
  useCallback,
  useMemo,
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

// External store for locale — avoids setState-in-effect lint issue
let localeListeners: Array<() => void> = [];

function subscribeLocale(cb: () => void) {
  localeListeners.push(cb);
  return () => {
    localeListeners = localeListeners.filter((l) => l !== cb);
  };
}

function notifyLocaleListeners() {
  localeListeners.forEach((l) => l());
}

/**
 * Provides language/locale context for the app with RTL support.
 * Uses useSyncExternalStore to read locale from localStorage without
 * triggering cascading renders via setState-in-effect.
 * The inline <script> in layout.tsx sets dir/lang/font-arabic on <html> before paint
 * to prevent CLS.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getStoredLocale,
    () => "en" as Locale
  );

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem("locale", newLocale);
    notifyLocaleListeners();
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

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: getTranslations(locale),
    dir: (locale === "ar" ? "rtl" : "ltr") as "ltr" | "rtl",
  }), [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>
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
