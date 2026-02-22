"use client";

import ContactForm from "@/components/ContactForm";
import { socials } from "@/lib/resume-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="py-20">
      <h1 className="animate-slide-up stagger-1 font-display text-4xl font-700 tracking-tight sm:text-5xl">
        {t.contact.title}
      </h1>
      <p className="animate-slide-up stagger-2 mt-4 max-w-xl text-muted">
        {t.contact.description}
      </p>

      <div className="animate-slide-up stagger-3 mt-12 grid gap-16 md:grid-cols-2">
        <ContactForm />

        <div className="space-y-8">
          <div>
            <h2 className="font-display text-sm font-600 uppercase tracking-[0.2em] text-accent">
              {t.contact.directContact}
            </h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  label: t.contact.email,
                  value: socials.email,
                  href: `mailto:${socials.email}`,
                  key: "Email",
                },
                {
                  label: "LinkedIn",
                  value: "msharbaji93",
                  href: socials.linkedin,
                  key: "LinkedIn",
                },
                {
                  label: "GitHub",
                  value: "msharbaji",
                  href: socials.github,
                  key: "GitHub",
                },
              ].map((item) => (
                <div key={item.key}>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    {item.label}
                  </p>
                  <a
                    href={item.href}
                    target={item.key !== "Email" ? "_blank" : undefined}
                    rel={
                      item.key !== "Email"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="mt-1 block text-sm text-foreground transition-colors hover:text-accent"
                  >
                    {item.value}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p
              className="text-sm leading-relaxed text-muted"
              dangerouslySetInnerHTML={{ __html: t.contact.basedIn }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
