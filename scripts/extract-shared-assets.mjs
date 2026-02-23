#!/usr/bin/env node
/**
 * Extract inline <style> and shared JS from all prompt-engineering slide HTML
 * files and replace them with <link>/<script src> tags to shared assets.
 *
 * Idempotent — safe to run multiple times.
 *
 * Run: node scripts/extract-shared-assets.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const SLIDES_DIR = join(
  import.meta.dirname,
  "..",
  "public",
  "slides",
  "prompt-engineering"
);

const TOPIC_ORDER = [
  [1, "topic-01-how-llms-work.html", 1],
  [2, "topic-model-selection.html", 1],
  [3, "topic-02-prompt-structure-basics.html", 1],
  [4, "topic-03-prompting-techniques.html", 1],
  [5, "topic-04-advanced-prompting.html", 1],
  [6, "topic-05-prompt-iteration.html", 1],
  [7, "topic-06-api-hands-on.html", 1],
  [8, "topic-07-rag-concepts.html", 2],
  [9, "topic-08-tool-use.html", 2],
  [10, "topic-09-prompt-chains.html", 2],
  [11, "topic-structured-output.html", 2],
  [12, "topic-10-evaluation.html", 2],
  [13, "topic-safety-guardrails.html", 2],
  [14, "topic-11-mini-project.html", 2],
  [15, "topic-12-what-are-agents.html", 3],
  [16, "topic-13-agent-architecture.html", 3],
  [17, "topic-memory-context.html", 3],
  [18, "topic-14-agent-frameworks.html", 3],
  [19, "topic-15-build-simple-agent.html", 3],
  [20, "topic-16-multi-agent.html", 3],
  [21, "topic-17-agent-project.html", 3],
  [22, "topic-19-job-landscape.html", 4],
  [23, "topic-20-staying-current.html", 4],
];

// Theme toggle button HTML
const THEME_TOGGLE =
  '  <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme"></button>';

let updated = 0;
let skipped = 0;

function processFile(filepath, isArabic) {
  if (!existsSync(filepath)) {
    return false;
  }

  let html = readFileSync(filepath, "utf-8");
  const cssPath = isArabic ? "../slides.css" : "slides.css";
  const rtlPath = isArabic ? "../slides-rtl.css" : null;
  const jsPath = isArabic ? "../slides.js" : "slides.js";

  // ── 1. Remove <style>…</style> block (if still present) ──
  html = html.replace(/<style>[\s\S]*?<\/style>\s*/i, "");

  // ── 2. Remove any previously inserted shared assets (idempotency) ──
  // Remove theme init script
  html = html.replace(
    /<script>\(function\(\)\{var d=document\.documentElement[\s\S]*?\}\)\(\)<\/script>\s*/g,
    ""
  );
  // Remove preconnect + fonts links
  html = html.replace(
    /<link rel="preconnect"[^>]*>\s*/g,
    ""
  );
  html = html.replace(
    /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/g,
    ""
  );
  // Remove slides.css / slides-rtl.css links
  html = html.replace(
    /<link rel="stylesheet" href="[.\/]*slides(?:-rtl)?\.css">\s*/g,
    ""
  );
  // Remove slides.js script tags
  html = html.replace(
    /<script src="[.\/]*slides\.js"><\/script>\s*/g,
    ""
  );
  // Remove theme toggle button (if already there)
  html = html.replace(
    /\s*<button class="theme-toggle"[^>]*>.*?<\/button>\s*/g,
    ""
  );

  // ── 3. Remove shared JS functions from inline <script> ──
  // Use a robust approach: find each <script>…</script> and clean it

  html = html.replace(/<script>([\s\S]*?)<\/script>/g, (match, content) => {
    let cleaned = content;

    // Remove checkAnswer function (with or without comment header)
    cleaned = cleaned.replace(
      /(?:\/\/\s*──\s*Quiz\s*──\s*\n)?function checkAnswer\b[\s\S]*?\n\}\s*(?=\n|$)/,
      ""
    );

    // Remove copyCode function (with or without comment header)
    cleaned = cleaned.replace(
      /(?:\/\/\s*──\s*Copy\s*Code?\s*──\s*\n)?function copyCode\b[\s\S]*?\n\}\s*(?=\n|$)/,
      ""
    );

    // If only whitespace remains, remove the whole script tag
    if (cleaned.trim() === "") return "";

    return `<script>${cleaned}</script>`;
  });

  // Clean up multiple blank lines
  html = html.replace(/\n{3,}/g, "\n\n");

  // ── 4. Build head content ──
  const fontsUrl = isArabic
    ? "https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
    : "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";

  let headInsert = "";
  headInsert += `<script>(function(){var d=document.documentElement,t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches))d.classList.add("dark")})()</script>\n`;
  headInsert += `<link rel="preconnect" href="https://fonts.googleapis.com">\n`;
  headInsert += `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n`;
  headInsert += `<link rel="stylesheet" href="${fontsUrl}">\n`;
  headInsert += `<link rel="stylesheet" href="${cssPath}">`;
  if (rtlPath) {
    headInsert += `\n<link rel="stylesheet" href="${rtlPath}">`;
  }

  // Insert before </head>
  html = html.replace("</head>", headInsert + "\n</head>");

  // ── 5. Add slides.js before </body> (after any inline scripts) ──
  const slideScriptTag = `<script src="${jsPath}"></script>`;
  // Insert just before </body>
  html = html.replace("</body>", slideScriptTag + "\n</body>");

  // ── 6. Add theme toggle to topbar ──
  // The topbar ends with progress-bar-container then closing </div>
  // Match: </span>\n  </div>\n</div> at end of topbar
  // More robust: find the progress-label span end, then the two closing divs
  if (!html.includes("theme-toggle")) {
    html = html.replace(
      /(<span class="progress-label">[^<]*<\/span>\s*<\/div>)(\s*<\/div>)/,
      "$1\n" + THEME_TOGGLE + "$2"
    );
  }

  // ── 7. Convert inline onmouseover/onmouseout on topbar back link to CSS ──
  html = html.replace(
    /<a\s+href="([^"]*)"\s+class="topbar-title"\s+style="text-decoration:none;color:inherit;transition:color 0\.2s;"\s+onmouseover="[^"]*"\s+onmouseout="[^"]*">/g,
    '<a href="$1" class="topbar-title topbar-back">'
  );

  // ── 8. Arabic: add data attributes for localised quiz/copy text ──
  if (isArabic) {
    // Only add if not already present
    if (!html.includes("data-correct-text")) {
      html = html.replace(
        /<button class="quiz-option"/g,
        '<button class="quiz-option" data-correct-text="✅ صحيح!" data-wrong-text="❌ ليس تماماً — انظر الإجابة الصحيحة المظللة أعلاه."'
      );
    }
    if (!html.includes("data-copied-text")) {
      html = html.replace(
        /onclick="copyCode\(this\)">نسخ<\/button>/g,
        'onclick="copyCode(this)" data-copied-text="تم النسخ!">نسخ</button>'
      );
    }
  }

  writeFileSync(filepath, html, "utf-8");
  return true;
}

// Process English files
console.log("Processing English slides...\n");
for (const [, file] of TOPIC_ORDER) {
  const filepath = join(SLIDES_DIR, file);
  if (processFile(filepath, false)) {
    console.log(`  ✅ ${file}`);
    updated++;
  } else {
    console.log(`  ⏭  SKIP (not found): ${file}`);
    skipped++;
  }
}

// Process Arabic files
console.log("\nProcessing Arabic slides...\n");
for (const [, file] of TOPIC_ORDER) {
  const filepath = join(SLIDES_DIR, "ar", file);
  if (processFile(filepath, true)) {
    console.log(`  ✅ ar/${file}`);
    updated++;
  } else {
    console.log(`  ⏭  SKIP (not found): ar/${file}`);
    skipped++;
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped.`);
