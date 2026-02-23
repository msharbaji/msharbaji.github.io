#!/usr/bin/env node
/**
 * Generate a 1200×630 Open Graph image for the site.
 * Uses sharp (bundled with Next.js) + SVG overlay for text rendering.
 *
 * Usage: node scripts/generate-og-image.mjs
 */

import sharp from "sharp";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;

// Colors matching the site's dark theme
const BG = "#0f1117";
const ACCENT = "#2dd4bf";
const TEXT_WHITE = "#e4e7f1";
const TEXT_DIM = "#8b8fa3";
const ACCENT_BAR = "#2dd4bf";

// Read the profile photo and convert to a circular PNG
const profilePath = resolve(ROOT, "public/images/profile.jpg");
const profileBuf = readFileSync(profilePath);

const PHOTO_SIZE = 220;
const PHOTO_X = 120;
const PHOTO_Y = Math.round((HEIGHT - PHOTO_SIZE) / 2) - 20;

// Create circular mask
const circleMask = Buffer.from(
  `<svg width="${PHOTO_SIZE}" height="${PHOTO_SIZE}">
    <circle cx="${PHOTO_SIZE / 2}" cy="${PHOTO_SIZE / 2}" r="${PHOTO_SIZE / 2}" fill="white"/>
  </svg>`
);

const circularPhoto = await sharp(profileBuf)
  .resize(PHOTO_SIZE, PHOTO_SIZE, { fit: "cover" })
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer();

// Add a subtle ring around the photo
const ringSize = PHOTO_SIZE + 8;
const ring = Buffer.from(
  `<svg width="${ringSize}" height="${ringSize}">
    <circle cx="${ringSize / 2}" cy="${ringSize / 2}" r="${ringSize / 2}" fill="none" stroke="${ACCENT}" stroke-width="3" opacity="0.6"/>
  </svg>`
);

// Text area starts after the photo
const TEXT_X = PHOTO_X + PHOTO_SIZE + 60;

// SVG text overlay
const textSvg = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .name { font: bold 52px 'Helvetica Neue', 'Arial', sans-serif; fill: ${TEXT_WHITE}; }
      .title { font: 600 32px 'Helvetica Neue', 'Arial', sans-serif; fill: ${ACCENT}; }
      .skills { font: 400 20px 'Helvetica Neue', 'Arial', sans-serif; fill: ${TEXT_DIM}; }
      .url { font: 500 22px 'Courier New', monospace; fill: ${ACCENT}; opacity: 0.9; }
    </style>

    <!-- Name -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 60}" class="name">Mohamad Alsharbaji</text>

    <!-- Title -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 108}" class="title">Platform Engineer</text>

    <!-- Skills line 1 -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 160}" class="skills">Kubernetes · Cloud Platforms · Distributed Systems</text>

    <!-- Skills line 2 -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 190}" class="skills">Infrastructure as Code · CI/CD · Observability</text>

    <!-- URL -->
    <text x="${TEXT_X}" y="${PHOTO_Y + 240}" class="url">malsharbaji.com</text>

    <!-- Bottom accent bar -->
    <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="${ACCENT_BAR}" opacity="0.8"/>

    <!-- Subtle top-left decorative dots -->
    <circle cx="40" cy="40" r="3" fill="${ACCENT}" opacity="0.3"/>
    <circle cx="60" cy="40" r="3" fill="${ACCENT}" opacity="0.2"/>
    <circle cx="40" cy="60" r="3" fill="${ACCENT}" opacity="0.2"/>
  </svg>`
);

// Compose the final image
const output = resolve(ROOT, "public/images/og-image.png");

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: BG,
  },
})
  .png()
  .composite([
    // Ring behind photo
    {
      input: await sharp(ring).png().toBuffer(),
      left: PHOTO_X - 4,
      top: PHOTO_Y - 4,
    },
    // Circular photo
    {
      input: circularPhoto,
      left: PHOTO_X,
      top: PHOTO_Y,
    },
    // Text overlay
    {
      input: textSvg,
      left: 0,
      top: 0,
    },
  ])
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(output);

console.log(`✓ OG image generated: ${output} (${WIDTH}×${HEIGHT})`);
