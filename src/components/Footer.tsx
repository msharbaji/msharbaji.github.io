"use client";

import Link from "next/link";
import { socials } from "@/lib/resume-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.projects, href: "/projects" },
    { label: t.nav.courses, href: "/courses" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.contact, href: "/contact" },
  ];

  const socialLinks = [
    { label: t.footer.github, href: socials.github, external: true },
    { label: t.footer.linkedin, href: socials.linkedin, external: true },
    { label: t.footer.email, href: `mailto:${socials.email}`, external: false },
  ];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Divider + bottom row */}
        <div className="mt-6 flex flex-col items-center gap-4 border-t border-border/60 pt-6 sm:flex-row sm:justify-between">
          <p className="font-mono text-xs tracking-wider text-muted">
            &copy; {new Date().getFullYear()} Mohamad Alsharbaji
          </p>
          <div className="flex gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background focus:rounded-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
