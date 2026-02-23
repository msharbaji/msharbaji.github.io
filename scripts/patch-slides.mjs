#!/usr/bin/env node

/**
 * One-time script to theme-patch prompt-engineering slide HTML files.
 * Replaces purple accent with site teal, adds back-link and meta tags.
 *
 * Usage: node scripts/patch-slides.mjs
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const SLIDES_DIR = join(
  import.meta.dirname,
  "..",
  "public",
  "slides",
  "prompt-engineering",
);

const COURSE_URL = "/courses/prompt-engineering";

async function patchFile(filePath, fileName) {
  let html = await readFile(filePath, "utf-8");

  // ── 1. Color swap: purple → teal ──
  // CSS custom properties
  html = html.replaceAll("#7c6aef", "#2dd4bf");
  html = html.replaceAll("#9d8ff5", "#5eead4");

  // rgba with spaces
  html = html.replaceAll(
    /rgba\(124,\s*106,\s*239/g,
    "rgba(45, 212, 191",
  );

  // ── 2. Meta tags ──
  // Add noindex + favicon after <meta name="viewport" ...>
  const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
  if (html.includes(viewportMeta)) {
    html = html.replace(
      viewportMeta,
      `${viewportMeta}\n<meta name="robots" content="noindex">\n<link rel="icon" href="/favicon.ico">`,
    );
  }

  // Append site name to <title>
  html = html.replace(
    /<title>(.*?)<\/title>/,
    (_, title) => `<title>${title} | Mohamad Alsharbaji</title>`,
  );

  // ── 3. Topbar: add "← Back to Course" link ──
  // Replace the topbar-title text with a link back to the course page
  html = html.replace(
    /<span class="topbar-title">.*?<\/span>/,
    `<a href="${COURSE_URL}" class="topbar-title" style="text-decoration:none;color:inherit;transition:color 0.2s;" onmouseover="this.style.color='var(--accent-light)'" onmouseout="this.style.color='var(--text-dim)'">\u2190 Back to Course</a>`,
  );

  // ── 4. Index link in nav → course page ──
  // If there's a link to index.html, point it to the course page
  html = html.replaceAll('href="index.html"', `href="${COURSE_URL}"`);

  await writeFile(filePath, html, "utf-8");
  console.log(`  Patched: ${fileName}`);
}

async function main() {
  console.log("Patching slide files in:", SLIDES_DIR);
  console.log();

  const files = await readdir(SLIDES_DIR);
  const htmlFiles = files.filter(
    (f) => f.endsWith(".html") && f.startsWith("topic-"),
  );

  console.log(`Found ${htmlFiles.length} topic files to patch.\n`);

  for (const file of htmlFiles.sort()) {
    await patchFile(join(SLIDES_DIR, file), file);
  }

  // Also patch the index.html for color consistency
  const indexPath = join(SLIDES_DIR, "index.html");
  let indexHtml = await readFile(indexPath, "utf-8");
  indexHtml = indexHtml.replaceAll("#7c6aef", "#2dd4bf");
  indexHtml = indexHtml.replaceAll("#9d8ff5", "#5eead4");
  indexHtml = indexHtml.replaceAll(
    /rgba\(124,\s*106,\s*239/g,
    "rgba(45, 212, 191",
  );
  indexHtml = indexHtml.replace(
    /<title>(.*?)<\/title>/,
    (_, title) => `<title>${title} | Mohamad Alsharbaji</title>`,
  );
  // Redirect index to the Next.js course page via meta refresh
  indexHtml = indexHtml.replace(
    '<meta charset="UTF-8">',
    `<meta charset="UTF-8">\n<meta http-equiv="refresh" content="0;url=${COURSE_URL}">\n<meta name="robots" content="noindex">`,
  );
  await writeFile(indexPath, indexHtml, "utf-8");
  console.log("  Patched: index.html (with redirect)");

  console.log("\nDone! All files patched.");
}

main().catch(console.error);
