"use client";

import BlogCard from "@/components/BlogCard";
import AnimateIn from "@/components/AnimateIn";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BlogPost } from "@/lib/types";

const seriesI18nKeys: Record<string, "seriesCicdMigration"> = {
  "cicd-migration": "seriesCicdMigration",
};

export default function BlogContent({
  posts,
}: {
  posts: Omit<BlogPost, "content">[];
}) {
  const { t } = useLanguage();

  // Group series posts together, keep standalone posts separate
  const seriesMap = new Map<string, Omit<BlogPost, "content">[]>();
  const standalonePosts: Omit<BlogPost, "content">[] = [];

  for (const post of posts) {
    if (post.series) {
      const existing = seriesMap.get(post.series) || [];
      existing.push(post);
      seriesMap.set(post.series, existing);
    } else {
      standalonePosts.push(post);
    }
  }

  // Sort series posts by seriesOrder
  for (const [, seriesPosts] of seriesMap) {
    seriesPosts.sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
  }

  return (
    <div className="py-20">
      <AnimateIn>
        <h1 className="font-display text-4xl font-700 tracking-tight sm:text-5xl">
          {t.blog.title}
        </h1>
      </AnimateIn>
      <AnimateIn delay={0.1}>
        <p className="mt-4 max-w-xl text-muted">
          {t.blog.description}
        </p>
      </AnimateIn>

      <div className="mt-12">
        {posts.length === 0 ? (
          <AnimateIn delay={0.2}>
            <p className="text-muted">{t.blog.noPosts}</p>
          </AnimateIn>
        ) : (
          <div className="space-y-12">
            {/* Series groups */}
            {Array.from(seriesMap.entries()).map(([seriesKey, seriesPosts]) => {
              const i18nKey = seriesI18nKeys[seriesKey];
              const seriesName = i18nKey ? t.blog[i18nKey] : seriesKey;

              return (
                <AnimateIn key={seriesKey} delay={0.2}>
                  <div className="rounded-2xl border border-accent/15 bg-accent/[0.02] p-4 sm:p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-accent/10">
                        <svg className="size-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </span>
                      <div>
                        <h2 className="font-display text-base font-700 tracking-wide text-foreground">
                          {seriesName}
                        </h2>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                          {seriesPosts.length} {t.blog.parts}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {seriesPosts.map((post, i) => (
                        <AnimateIn key={post.slug} delay={0.2 + i * 0.08}>
                          <BlogCard post={post} compact />
                        </AnimateIn>
                      ))}
                    </div>
                  </div>
                </AnimateIn>
              );
            })}

            {/* Standalone posts */}
            {standalonePosts.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                {standalonePosts.map((post, i) => (
                  <AnimateIn key={post.slug} delay={0.2 + i * 0.1}>
                    <BlogCard post={post} />
                  </AnimateIn>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
