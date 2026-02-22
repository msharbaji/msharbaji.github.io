"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogPost } from "@/lib/types";

export default function BlogCard({
  post,
}: {
  post: Omit<BlogPost, "content">;
}) {
  const { t } = useLanguage();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:bg-card/80"
    >
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-wider text-muted">
        <time>{post.date}</time>
        <span className="h-px w-3 bg-border" />
        <span>{post.readingTime} {t.blog.minRead}</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-600 leading-snug text-foreground transition-colors group-hover:text-accent">
        {post.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {post.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-accent/70"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
