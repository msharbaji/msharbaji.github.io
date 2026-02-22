"use client";

import BlogCard from "@/components/BlogCard";
import AnimateIn from "@/components/AnimateIn";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BlogPost } from "@/lib/types";

export default function BlogContent({
  posts,
}: {
  posts: Omit<BlogPost, "content">[];
}) {
  const { t } = useLanguage();

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
          <div className="grid gap-5 sm:grid-cols-2">
            {posts.map((post, i) => (
              <AnimateIn key={post.slug} delay={i * 0.1}>
                <BlogCard post={post} />
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
