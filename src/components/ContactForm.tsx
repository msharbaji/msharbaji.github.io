"use client";

import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const { t } = useLanguage();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const apiUrl =
        typeof process.env.NEXT_PUBLIC_CONTACT_API === "string" &&
        process.env.NEXT_PUBLIC_CONTACT_API
          ? process.env.NEXT_PUBLIC_CONTACT_API
          : "/api/contact";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClasses = cn(
    "w-full rounded-lg border border-border bg-surface px-4 py-3 font-body text-sm text-foreground",
    "outline-none transition-all duration-200 placeholder:text-muted/60",
    "focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted"
        >
          {t.contact.name}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          minLength={2}
          placeholder={t.contact.namePlaceholder}
          className={inputClasses}
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted"
        >
          {t.contact.email}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder={t.contact.emailPlaceholder}
          className={inputClasses}
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted"
        >
          {t.contact.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={2000}
          placeholder={t.contact.messagePlaceholder}
          className={inputClasses}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="group flex items-center gap-2 rounded-lg bg-accent-warm px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest text-background transition-all duration-200 hover:bg-accent-warm-hover disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent-warm focus:ring-offset-2 focus:ring-offset-background"
      >
        {status === "sending" ? t.contact.sending : t.contact.send}
        <svg
          className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </button>

      {status === "sent" && (
        <p className="rounded-lg border border-accent/20 bg-accent/5 p-4 text-sm text-accent">
          {t.contact.sent}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          {t.contact.error}
        </p>
      )}
    </form>
  );
}
