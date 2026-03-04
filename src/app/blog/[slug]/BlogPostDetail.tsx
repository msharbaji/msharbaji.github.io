"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { BlogPost, Bilingual } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import BackLink from "@/components/BackLink";

interface SeriesPost {
  slug: string;
  title: Bilingual;
  seriesOrder?: number;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[101] h-[3px] bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function TableOfContents({ items, activeId, label }: { items: TocItem[]; activeId: string; label: string }) {
  if (items.length === 0) return null;

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <nav className="hidden xl:block" aria-label={label}>
      <div className="sticky top-24">
        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
          {label}
        </p>
        <ul className="space-y-1 border-l border-border">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`block w-full text-left border-l-2 py-1 text-sm leading-snug transition-colors cursor-pointer ${
                  item.level === 3 ? "pl-6" : "pl-4"
                } ${
                  activeId === item.id
                    ? "border-accent text-accent font-medium"
                    : "border-transparent text-muted hover:text-foreground hover:border-border-hover"
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted shadow-lg transition-all hover:border-accent/30 hover:text-accent hover:shadow-accent/10 sm:bottom-8 sm:right-8"
      aria-label={label}
    >
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}

export default function BlogPostDetail({ post, seriesPosts = [] }: { post: BlogPost; seriesPosts?: SeriesPost[] }) {
  const { locale, t } = useLanguage();
  const proseRef = useRef<HTMLDivElement>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  // Extract TOC headings + set up IntersectionObserver after content renders
  const content = post.content[locale];
  const proseCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      (proseRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (!node) return;
      const headings = node.querySelectorAll("h2[id], h3[id]");
      const items: TocItem[] = [];
      headings.forEach((el) => {
        items.push({
          id: el.id,
          text: el.textContent || "",
          level: el.tagName === "H3" ? 3 : 2,
        });
      });
      setTocItems(items);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content]
  );

  // Track active heading with IntersectionObserver
  useEffect(() => {
    if (tocItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -75% 0px", threshold: 0 }
    );
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

  return (
    <>
      <ReadingProgress />

      <article className="py-20">
        <BackLink href="/blog" label="backToBlog" />

        {/* Header — wider box than the prose content below */}
        <header className="mx-auto mb-10 max-w-4xl rounded-2xl border border-border-hover bg-card p-6 shadow-[0_0_60px_-15px] shadow-accent/5 sm:p-10">
          <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-muted">
            <time dateTime={post.date}>{post.date}</time>
            <span className="h-px w-4 bg-border" />
            <span>
              {post.readingTime} {t.blog.minRead}
            </span>
            {post.seriesOrder != null && (
              <>
                <span className="h-px w-4 bg-border" />
                <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-accent">
                  {t.blog.part} {post.seriesOrder} / {seriesPosts.length}
                </span>
              </>
            )}
          </div>

          <h1 className="mt-6 font-display text-[1.75rem] font-800 leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {post.title[locale]}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {post.description[locale]}
          </p>

          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-accent/20 bg-accent/5 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
            <div className="flex size-9 items-center justify-center rounded-full bg-accent/10 font-display text-sm font-bold text-accent">
              M
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Mohamad Alsharbaji</p>
              <p className="text-xs text-muted">Platform Engineer</p>
            </div>
          </div>
        </header>

        {/* Series navigation */}
        {seriesPosts.length > 1 && (
          <div className="mx-auto mb-10 max-w-prose">
            <nav className="overflow-hidden rounded-xl border border-accent/15 bg-accent/[0.02] p-3 sm:p-4" aria-label="Series navigation">
              <div className="grid grid-cols-3 gap-1.5">
                {seriesPosts.map((sp) => (
                  <Link
                    key={sp.slug}
                    href={`/blog/${sp.slug}`}
                    aria-current={sp.slug === post.slug ? "page" : undefined}
                    className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-2 py-2 text-center transition-colors sm:px-3 sm:py-2.5 ${
                      sp.slug === post.slug
                        ? "bg-accent/15 text-accent"
                        : "bg-surface text-muted hover:bg-surface-hover hover:text-foreground"
                    }`}
                  >
                    <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-foreground/40">
                      {t.blog.part} {sp.seriesOrder}
                    </span>
                    <span className="w-full truncate text-[9px] sm:text-[10px]">
                      {sp.title[locale]}
                    </span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}

        <div className="mb-12" />

        {/* Content + TOC */}
        <div className="relative flex justify-center gap-12">
          {/* Article body */}
          <div
            ref={proseCallbackRef}
            className="prose min-w-0 max-w-prose"
            dangerouslySetInnerHTML={{ __html: post.content[locale] }}
          />

          {/* Desktop TOC sidebar */}
          <aside className="hidden w-56 shrink-0 xl:block">
            <TableOfContents items={tocItems} activeId={activeId} label={t.blog.onThisPage} />
          </aside>
        </div>
      </article>

      <BackToTop label={t.blog.backToTop} />
    </>
  );
}
