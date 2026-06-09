#!/usr/bin/env node
/**
 * render-chapter-comparison.mjs
 *
 * Render N chapter variants + reference baselines side-by-side into one
 * markdown document for human review.
 *
 * Usage:
 *   node scripts/render-chapter-comparison.mjs \
 *     --project novels/novel_1 \
 *     --chapter 1 \
 *     --out novels/novel_1/chapters/chapter_001_comparison.md
 *
 * Optionally pass --include claude,codex,collab,2pass,3pass (default: all of these).
 */

import fs from 'fs';
import path from 'path';

const args = parseArgs(process.argv.slice(2));

if (!args.project || !args.chapter) {
  console.error('Usage: render-chapter-comparison.mjs --project <dir> --chapter <N> [--out <path>] [--include <list>]');
  process.exit(2);
}

const projectPath = path.resolve(args.project);
const chapterNum = String(args.chapter).padStart(3, '0');
const chaptersDir = path.join(projectPath, 'chapters');
const reviewsDir = path.join(projectPath, 'reviews', 'quality');

// Variant catalog — order is the display order in the output document
const VARIANTS = [
  {
    key: 'claude',
    label: 'V0 — chapter_001.md (Claude baseline, original single-agent novelist)',
    chapterPath: path.join(chaptersDir, `chapter_${chapterNum}.md.experiment-baseline`),
    fallbackPath: path.join(chaptersDir, `chapter_${chapterNum}.md`),
    reportPath: null,
  },
  {
    key: 'codex',
    label: 'V_codex — chapter_001.opus.md (Codex GPT-5.4 reference)',
    chapterPath: path.join(chaptersDir, `chapter_${chapterNum}.opus.md`),
    reportPath: null,
  },
  {
    key: 'collab',
    label: 'V1 — writing-team-collab (single-pass Opus team)',
    chapterPath: path.join(chaptersDir, `chapter_${chapterNum}.variant-collab.md`),
    reportPath: path.join(reviewsDir, `chapter_${chapterNum}_variant-collab_quality.json`),
  },
  {
    key: '2pass',
    label: 'V2 — writing-team-collab-2pass (Opus draft → oracle → prose-surgeon)',
    chapterPath: path.join(chaptersDir, `chapter_${chapterNum}.variant-2pass.md`),
    reportPath: path.join(reviewsDir, `chapter_${chapterNum}_variant-2pass_quality.json`),
  },
  {
    key: '3pass',
    label: 'V3 — writing-team-collab-3pass (Opus draft → oracle → surgeon → polish)',
    chapterPath: path.join(chaptersDir, `chapter_${chapterNum}.variant-3pass.md`),
    reportPath: path.join(reviewsDir, `chapter_${chapterNum}_variant-3pass_quality.json`),
  },
  {
    key: 'flavor-A',
    label: 'Flavor A — 단정칼날 🔪 (짧고 날카롭게, 비유 씬당 1개, 차가운 자조)',
    chapterPath: path.join(chaptersDir, `chapter_${chapterNum}.variant-flavor-A.md`),
    reportPath: path.join(reviewsDir, `chapter_${chapterNum}_variant-flavor-A_quality.json`),
  },
  {
    key: 'flavor-B',
    label: 'Flavor B — 감각만연 🌊 (오감 밀도 2배, 촉각 우선, 음향기기 메타포)',
    chapterPath: path.join(chaptersDir, `chapter_${chapterNum}.variant-flavor-B.md`),
    reportPath: path.join(reviewsDir, `chapter_${chapterNum}_variant-flavor-B_quality.json`),
  },
  {
    key: 'flavor-C',
    label: 'Flavor C — 독자귓속말 💬 (의식의 흐름, 자조 유머, 독자 거리 제로)',
    chapterPath: path.join(chaptersDir, `chapter_${chapterNum}.variant-flavor-C.md`),
    reportPath: path.join(reviewsDir, `chapter_${chapterNum}_variant-flavor-C_quality.json`),
  },
];

const includeKeys = args.include
  ? args.include.split(',').map(s => s.trim())
  : VARIANTS.map(v => v.key);

const outPath = args.out
  ? path.resolve(args.out)
  : path.join(chaptersDir, `chapter_${chapterNum}_comparison.md`);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}

function readIfExists(p) {
  if (!p) return null;
  try {
    return fs.readFileSync(p, 'utf-8');
  } catch {
    return null;
  }
}

function countChars(text) {
  return [...text].length;
}

function countSentences(text) {
  // Korean-aware: split on . ? ! 。 followed by whitespace/newline or EOF
  const matches = text.match(/[^.!?。\n]+[.!?。]/gu);
  return matches ? matches.length : text.split(/\n\n+/).filter(Boolean).length;
}

function avgSentenceLength(text, sentenceCount) {
  if (sentenceCount === 0) return 0;
  return Math.round((countChars(text) / sentenceCount) * 10) / 10;
}

function countScenes(text) {
  // Heuristic: scene break markers (### or --- or ⸺ between paragraphs)
  const hashCount = (text.match(/^### /gm) || []).length;
  const hrCount = (text.match(/^(---|⸺|\* \* \*)$/gm) || []).length;
  return Math.max(hashCount, hrCount, 1);
}

function renderVariantSection(v) {
  const body =
    readIfExists(v.chapterPath) ??
    readIfExists(v.fallbackPath ?? '');
  if (body === null) {
    return [
      `## ${v.label}`,
      ``,
      `*File not found: \`${path.relative(projectPath, v.chapterPath)}\`*`,
      ``,
      `---`,
      ``,
    ].join('\n');
  }

  const chars = countChars(body);
  const sentences = countSentences(body);
  const avg = avgSentenceLength(body, sentences);
  const scenes = countScenes(body);

  let report = null;
  if (v.reportPath) {
    const raw = readIfExists(v.reportPath);
    if (raw) {
      try {
        report = JSON.parse(raw);
      } catch {
        report = { _parse_error: true };
      }
    }
  }

  const meta = [];
  meta.push(`- **Char count**: ${chars}`);
  meta.push(`- **Sentence count**: ${sentences}`);
  meta.push(`- **Avg sentence length**: ${avg} chars`);
  meta.push(`- **Estimated scenes**: ${scenes}`);
  if (report && !report._parse_error) {
    if (report.self_verdict) meta.push(`- **Self verdict**: ${report.self_verdict}`);
    if (report.notes) meta.push(`- **Notes**: ${report.notes.trim()}`);
    if (Array.isArray(report.draft_directives) && report.draft_directives.length > 0) {
      const counts = report.draft_directives.reduce((acc, d) => {
        const sev = d.severity || 'unknown';
        acc[sev] = (acc[sev] || 0) + 1;
        return acc;
      }, {});
      const counted = Object.entries(counts).map(([s, n]) => `${s}=${n}`).join(', ');
      meta.push(`- **Directives**: ${report.draft_directives.length} total (${counted})`);
    }
    if (Array.isArray(report.self_directives) && report.self_directives.length > 0) {
      meta.push(`- **Self-directives**: ${report.self_directives.length} flagged`);
    }
    if (report.polish_changes) meta.push(`- **Polish pass**: ${report.polish_changes.trim()}`);
  }

  return [
    `## ${v.label}`,
    ``,
    `**Path**: \`${path.relative(projectPath, v.chapterPath)}\``,
    ``,
    ...meta,
    ``,
    `<details><summary>Click to expand prose body</summary>`,
    ``,
    body,
    ``,
    `</details>`,
    ``,
    `---`,
    ``,
  ].join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

const variantsToRender = VARIANTS.filter(v => includeKeys.includes(v.key));

if (variantsToRender.length === 0) {
  console.error(`No variants matched --include "${args.include}". Available keys: ${VARIANTS.map(v => v.key).join(', ')}`);
  process.exit(2);
}

const now = new Date().toISOString();
const plotPath = path.join(chaptersDir, `chapter_${chapterNum}.json`);
const plotJson = readIfExists(plotPath);
let plotMeta = '';
if (plotJson) {
  try {
    const plot = JSON.parse(plotJson);
    const sceneCount = plot.scenes?.length ?? 0;
    const charCast = plot.meta?.characters ?? plot.scene_cast ?? [];
    plotMeta = `Plot source: \`${path.relative(projectPath, plotPath)}\` (${sceneCount} scenes, cast: ${charCast.join(', ') || 'unknown'})`;
  } catch {
    plotMeta = `Plot source: \`${path.relative(projectPath, plotPath)}\` (parse error)`;
  }
}

const out = [
  `# Chapter ${parseInt(chapterNum, 10)} — variant comparison`,
  ``,
  `Generated: ${now}`,
  plotMeta ? plotMeta : '',
  ``,
  `Compare the prose across variants. Reference baseline is V_codex (Codex GPT-5.4) — the user's quality bar.`,
  `Use the feedback template at \`feedback/2026-05-23-chapter-1-variants.md\` to capture impressions.`,
  ``,
  `---`,
  ``,
  variantsToRender.map(renderVariantSection).join('\n'),
].filter(Boolean).join('\n');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, 'utf-8');

console.log(`✓ Rendered ${variantsToRender.length} variants to ${outPath}`);
console.log(`  Variants included: ${variantsToRender.map(v => v.key).join(', ')}`);
