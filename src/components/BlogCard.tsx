"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogPost } from "@/lib/types";

export default function BlogCard({
  post,
  compact = false,
}: {
  post: Omit<BlogPost, "content">;
  compact?: boolean;
}) {
  const { locale, t } = useLanguage();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card-hover group flex h-full flex-col"
    >
      {post.seriesOrder != null && (
        <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-accent">
          {t.blog.part} {post.seriesOrder}
        </span>
      )}
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-wider text-muted">
        <time dateTime={post.date}>{post.date}</time>
        <span className="h-px w-3 bg-border" />
        <span>{post.readingTime} {t.blog.minRead}</span>
      </div>
      <h3 className={`mt-3 font-display font-700 leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent ${
        compact ? "text-base" : "text-xl sm:text-[1.35rem]"
      }`}>
        {post.title[locale]}
      </h3>
      <p className={`mt-2 flex-1 text-sm leading-relaxed text-muted ${
        compact ? "line-clamp-2" : "line-clamp-3"
      }`}>
        {post.description[locale]}
      </p>
      {!compact && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-accent/70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
