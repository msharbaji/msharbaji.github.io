#!/usr/bin/env node
/**
 * Generate a 1200×630 Open Graph image for the site.
 * Renders at 2× then downscales for sharp text and photo.
 * Uses sharp (bundled with Next.js) + SVG overlay for text.
 *
 * Usage: node scripts/generate-og-image.mjs
 */

import sharp from "sharp";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Render at 2× for crisp downscale
const SCALE = 2;
const WIDTH = 1200 * SCALE;
const HEIGHT = 630 * SCALE;

// Colors matching the site's dark theme
const BG = "#0f1117";
const ACCENT = "#2dd4bf";
const TEXT_WHITE = "#e4e7f1";
const TEXT_DIM = "#8b8fa3";

// Read the profile photo
const profilePath = resolve(ROOT, "public/images/profile.jpg");
const profileBuf = readFileSync(profilePath);

const PHOTO_SIZE = 280 * SCALE;
const PHOTO_X = 120 * SCALE;
const PHOTO_Y = Math.round((HEIGHT - PHOTO_SIZE) / 2) - 20 * SCALE;

// Create circular mask
const circleMask = Buffer.from(
  `<svg width="${PHOTO_SIZE}" height="${PHOTO_SIZE}">
    <circle cx="${PHOTO_SIZE / 2}" cy="${PHOTO_SIZE / 2}" r="${PHOTO_SIZE / 2}" fill="white"/>
  </svg>`
);

const circularPhoto = await sharp(profileBuf)
  .resize(PHOTO_SIZE, PHOTO_SIZE, { fit: "cover", kernel: "lanczos3" })
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer();

// Ring around the photo
const ringSize = PHOTO_SIZE + 10 * SCALE;
const ring = Buffer.from(
  `<svg width="${ringSize}" height="${ringSize}">
    <circle cx="${ringSize / 2}" cy="${ringSize / 2}" r="${ringSize / 2 - 2 * SCALE}" fill="none" stroke="${ACCENT}" stroke-width="${4 * SCALE}" opacity="0.6"/>
  </svg>`
);

// Text area starts after the photo
const TEXT_X = PHOTO_X + PHOTO_SIZE + 70 * SCALE;

// SVG text overlay at 2×
const textSvg = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .name { font: bold ${56 * SCALE}px 'Helvetica Neue', 'Arial', sans-serif; fill: ${TEXT_WHITE}; }
      .title { font: 600 ${34 * SCALE}px 'Helvetica Neue', 'Arial', sans-serif; fill: ${ACCENT}; }
      .skills { font: 400 ${21 * SCALE}px 'Helvetica Neue', 'Arial', sans-serif; fill: ${TEXT_DIM}; }
      .url { font: 500 ${23 * SCALE}px 'Courier New', monospace; fill: ${ACCENT}; opacity: 0.9; }
    </style>

    <!-- Name -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 70 * SCALE}" class="name">Mohamad Alsharbaji</text>

    <!-- Title -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 122 * SCALE}" class="title">Platform Engineer</text>

    <!-- Skills line 1 -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 178 * SCALE}" class="skills">Kubernetes · Cloud Platforms · Distributed Systems</text>

    <!-- Skills line 2 -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 210 * SCALE}" class="skills">Infrastructure as Code · CI/CD · Observability</text>

    <!-- URL -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 262 * SCALE}" class="url">malsharbaji.com</text>

    <!-- Bottom accent bar -->
    <rect x="0" y="${HEIGHT - 8 * SCALE}" width="${WIDTH}" height="${8 * SCALE}" fill="${ACCENT}" opacity="0.8"/>

    <!-- Subtle top-left decorative dots -->
    <circle cx="${40 * SCALE}" cy="${40 * SCALE}" r="${4 * SCALE}" fill="${ACCENT}" opacity="0.3"/>
    <circle cx="${62 * SCALE}" cy="${40 * SCALE}" r="${4 * SCALE}" fill="${ACCENT}" opacity="0.2"/>
    <circle cx="${40 * SCALE}" cy="${62 * SCALE}" r="${4 * SCALE}" fill="${ACCENT}" opacity="0.2"/>
  </svg>`
);

// Compose at 2×, then downscale to 1200×630
const output = resolve(ROOT, "public/images/og-image.png");

const highRes = await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: BG,
  },
})
  .png()
  .composite([
    {
      input: await sharp(ring).png().toBuffer(),
      left: PHOTO_X - 5 * SCALE,
      top: PHOTO_Y - 5 * SCALE,
    },
    {
      input: circularPhoto,
      left: PHOTO_X,
      top: PHOTO_Y,
    },
    {
      input: textSvg,
      left: 0,
      top: 0,
    },
  ])
  .toBuffer();

await sharp(highRes)
  .resize(1200, 630, { kernel: "lanczos3" })
  .png({ compressionLevel: 6 })
  .toFile(output);

const stats = readFileSync(output);
console.log(
  `✓ OG image generated: ${output} (1200×630, ${Math.round(stats.length / 1024)}KB)`
);
