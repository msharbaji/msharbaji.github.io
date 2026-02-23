#!/usr/bin/env node
/**
 * Batch-update all prompt-engineering slide HTML files:
 * 1. Progress label: "N / OLD" → "N / 23"
 * 2. Bottom nav info: "Topic N of OLD" → "Topic N of 23"
 * 3. Progress bar fill width → correct percentage
 * 4. Phase badge in topbar
 *
 * Run: node scripts/update-slides-nav.mjs
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

const TOTAL = 23;

// Ordered list: [topicNumber, filename, phase]
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

let updated = 0;
let skipped = 0;

for (const [num, file, phase] of TOPIC_ORDER) {
  const filepath = join(SLIDES_DIR, file);
  if (!existsSync(filepath)) {
    console.log(`⏭  SKIP (not found): ${file}`);
    skipped++;
    continue;
  }

  let html = readFileSync(filepath, "utf-8");
  const pct = Math.round((num / TOTAL) * 100);

  // 1. Progress label in topbar: "N / OLD" → "N / 23"
  html = html.replace(
    /(<span class="progress-label">)\s*\d+\s*\/\s*\d+\s*(<\/span>)/,
    `$1${num} / ${TOTAL}$2`
  );

  // 2. Progress bar fill width
  html = html.replace(
    /(<div class="progress-fill"[^>]*style="[^"]*?)width:\s*\d+%/,
    `$1width: ${pct}%`
  );
  // Also handle width in the class-level CSS if it's inline on the element
  // Some files set width directly in the style attribute
  html = html.replace(
    /class="progress-fill"><\/div>/,
    `class="progress-fill" style="width: ${pct}%"></div>`
  );
  // Clean up double style attributes if both patterns matched
  html = html.replace(
    /class="progress-fill"\s+style="[^"]*"\s+style="[^"]*"/,
    `class="progress-fill" style="width: ${pct}%"`
  );

  // 3. Bottom nav info: "Topic N of OLD" → "Topic N of 23"
  html = html.replace(
    /Topic\s+\d+\s+of\s+\d+/g,
    `Topic ${num} of ${TOTAL}`
  );

  // 4. Phase badge — ensure correct phase
  const phaseLabels = { 1: "PHASE 1", 2: "PHASE 2", 3: "PHASE 3", 4: "BONUS" };
  html = html.replace(
    /(<span class="topbar-badge">)(PHASE \d|BONUS)(<\/span>)/,
    `$1${phaseLabels[phase]}$3`
  );

  writeFileSync(filepath, html, "utf-8");
  console.log(`✅ ${file} → Topic ${num}/${TOTAL}, ${pct}%, Phase ${phase}`);
  updated++;
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped.`);
