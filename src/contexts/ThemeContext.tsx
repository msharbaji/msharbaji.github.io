"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ---------- External store for theme preference ---------- */
const themeListeners = new Set<() => void>();
let currentTheme: Theme = "system";

function emitThemeChange() {
  themeListeners.forEach((l) => l());
}

function subscribeTheme(cb: () => void) {
  themeListeners.add(cb);
  return () => { themeListeners.delete(cb); };
}

function getThemeSnapshot(): Theme {
  return currentTheme;
}

function getThemeServerSnapshot(): Theme {
  return "system";
}

// Initialize from localStorage on module load (client only)
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("theme");
  currentTheme = stored === "light" || stored === "dark" ? stored : "system";
}

/* ---------- External store for system preference ---------- */
function subscribeSystemTheme(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getSystemSnapshot(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getSystemServerSnapshot(): ResolvedTheme {
  return "dark";
}

/* ---------- DOM helpers ---------- */
function applyTheme(resolved: ResolvedTheme) {
  const html = document.documentElement;
  if (resolved === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}

/**
 * Provides theme context for the app with system/light/dark support.
 * Uses useSyncExternalStore for both the user preference and the system
 * color-scheme, avoiding direct setState in effects.
 * The inline script in layout.tsx sets .dark on <html> before paint to prevent flash.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const systemTheme = useSyncExternalStore(subscribeSystemTheme, getSystemSnapshot, getSystemServerSnapshot);

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  // Sync .dark class on <html> whenever resolvedTheme changes.
  // This is a proper effect — syncing React state to the DOM (external system).
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    currentTheme = newTheme;
    localStorage.setItem("theme", newTheme);
    emitThemeChange();
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
