"use client";

import { BlogPost } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import BackLink from "@/components/BackLink";

export default function BlogPostDetail({ post }: { post: BlogPost }) {
  const { locale, t } = useLanguage();

  return (
    <article className="py-20">
      <BackLink href="/blog" label="backToBlog" />

      <header className="mb-10">
        <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-muted">
          <time>{post.date}</time>
          <span className="h-px w-4 bg-border" />
          <span>
            {post.readingTime} {t.blog.minRead}
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-700 leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {post.title[locale]}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          {post.description[locale]}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-accent/10 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="section-divider mb-10" />

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content[locale] }}
      />
    </article>
  );
}
