"use client";

import { socials } from "@/lib/resume-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 lg:px-8 sm:flex-row sm:justify-between">
        <p className="font-mono text-xs tracking-wider text-muted">
          &copy; {new Date().getFullYear()} Mohamad Alsharbaji
        </p>
        <div className="flex gap-6">
          {[
            { label: t.footer.github, href: socials.github, key: "GitHub" },
            { label: t.footer.linkedin, href: socials.linkedin, key: "LinkedIn" },
            { label: t.footer.email, href: `mailto:${socials.email}`, key: "Email" },
          ].map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.key !== "Email" ? "_blank" : undefined}
              rel={link.key !== "Email" ? "noopener noreferrer" : undefined}
              className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background focus:rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
