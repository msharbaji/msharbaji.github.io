import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { BlogPost } from "./types";
import { sanitize } from "./sanitize";
import type { Locale } from "./i18n";

const postsDirectory = path.join(process.cwd(), "src/content/blog");

function getReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Read a markdown file for a given slug and locale.
 * Supports two structures:
 *   - Folder-per-post: src/content/blog/{slug}/en.md, ar.md
 *   - Flat file (legacy): src/content/blog/{slug}.md (treated as English)
 *
 * Falls back to English if the requested locale file doesn't exist.
 */
function readPostFile(
  slug: string,
  locale: Locale
): { data: Record<string, unknown>; rawContent: string } | null {
  // Try folder-per-post first: {slug}/{locale}.md
  const folderPath = path.join(postsDirectory, slug, `${locale}.md`);
  if (fs.existsSync(folderPath)) {
    const file = fs.readFileSync(folderPath, "utf8");
    const { data, content } = matter(file);
    return { data, rawContent: content };
  }

  // If requesting Arabic, fall back to English folder file
  if (locale === "ar") {
    const enFolderPath = path.join(postsDirectory, slug, "en.md");
    if (fs.existsSync(enFolderPath)) {
      const file = fs.readFileSync(enFolderPath, "utf8");
      const { data, content } = matter(file);
      return { data, rawContent: content };
    }
  }

  // Legacy flat file: {slug}.md (treated as English)
  const flatPath = path.join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(flatPath)) {
    const file = fs.readFileSync(flatPath, "utf8");
    const { data, content } = matter(file);
    return { data, rawContent: content };
  }

  return null;
}

/** Discover all post slugs from the content directory. */
function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  const slugs: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Folder-per-post: check if en.md exists
      const enFile = path.join(postsDirectory, entry.name, "en.md");
      if (fs.existsSync(enFile)) {
        slugs.push(entry.name);
      }
    } else if (entry.name.endsWith(".md")) {
      // Legacy flat file
      slugs.push(entry.name.replace(/\.md$/, ""));
    }
  }

  return slugs;
}

export function getAllPosts(): Omit<BlogPost, "content">[] {
  const slugs = getAllSlugs();

  const posts = slugs.map((slug) => {
    const en = readPostFile(slug, "en");
    const ar = readPostFile(slug, "ar");
    if (!en) return null;

    return {
      slug,
      title: {
        en: (en.data.title as string) || slug,
        ar: ar ? (ar.data.title as string) || (en.data.title as string) || slug : (en.data.title as string) || slug,
      },
      date: (en.data.date as string) || "",
      description: {
        en: (en.data.description as string) || "",
        ar: ar ? (ar.data.description as string) || (en.data.description as string) || "" : (en.data.description as string) || "",
      },
      tags: (en.data.tags as string[]) || [],
      readingTime: getReadingTime(en.rawContent),
    };
  }).filter(Boolean) as Omit<BlogPost, "content">[];

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const en = readPostFile(slug, "en");
  if (!en) return null;

  const ar = readPostFile(slug, "ar");

  const enProcessed = await remark().use(html).process(en.rawContent);
  const arProcessed = ar
    ? await remark().use(html).process(ar.rawContent)
    : null;

  return {
    slug,
    title: {
      en: (en.data.title as string) || slug,
      ar: ar ? (ar.data.title as string) || (en.data.title as string) || slug : (en.data.title as string) || slug,
    },
    date: (en.data.date as string) || "",
    description: {
      en: (en.data.description as string) || "",
      ar: ar ? (ar.data.description as string) || (en.data.description as string) || "" : (en.data.description as string) || "",
    },
    tags: (en.data.tags as string[]) || [],
    content: {
      en: sanitize(enProcessed.toString()),
      ar: arProcessed ? sanitize(arProcessed.toString()) : sanitize(enProcessed.toString()),
    },
    readingTime: getReadingTime(en.rawContent),
  };
}
