"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: "backToBlog" | "backToProjects" | "backToCourses";
}) {
  const { t } = useLanguage();
  const labelMap = {
    backToBlog: t.blog.backToBlog,
    backToCourses: t.courses.backToCourses,
    backToProjects: t.projects.backToProjects,
  } as const;
  const text = labelMap[label];

  return (
    <Link
      href={href}
      className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
    >
      <svg
        className="size-3 rtl:rotate-180"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
        />
      </svg>
      {text}
    </Link>
  );
}
