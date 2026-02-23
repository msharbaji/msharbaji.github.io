"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const navKeys = ["home", "projects", "courses", "blog", "contact"] as const;
const navHrefs = ["/", "/projects", "/courses", "/blog", "/contact"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = navKeys.map((key, i) => ({
    href: navHrefs[i],
    label: t.nav[key],
    isActive:
      navHrefs[i] === "/"
        ? pathname === "/"
        : pathname.startsWith(navHrefs[i]),
  }));

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 sm:gap-2.5">
          <Logo className="size-7 sm:size-8" />
          <span className="font-display text-sm font-700 tracking-tight text-foreground">
            <span className="sm:hidden">M. Alsharbaji</span>
            <span className="hidden sm:inline">Mohamad Alsharbaji</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-md px-3.5 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background",
                    link.isActive
                      ? "bg-surface text-foreground"
                      : "text-foreground/70 hover:bg-surface hover:text-foreground"
                  )}
                  aria-current={link.isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="ms-2 flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile: toggle + menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageToggle />
          <button
            className="flex size-10 items-center justify-center rounded-md transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="size-5 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-border/60 transition-all duration-300 md:hidden",
          menuOpen ? "max-h-64" : "max-h-0 border-t-0"
        )}
      >
        <ul className="px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background",
                  link.isActive
                    ? "bg-surface text-foreground"
                    : "text-foreground/70 hover:bg-surface hover:text-foreground"
                )}
                aria-current={link.isActive ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
