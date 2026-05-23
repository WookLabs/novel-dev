#!/usr/bin/env node
/**
 * Quality Gate — Deterministic post-write quality check
 *
 * Runs the Quality Oracle on a written chapter, applies hard-fail conditions,
 * writes a JSON report, and acts on failure.
 *
 * Usage:
 *   node scripts/quality-gate.mjs \
 *     --input <chapter.md> \
 *     --project <project-dir> \
 *     --chapter <N> \
 *     --mode strict|warn|off \
 *     [--target-chars <N>] \
 *     [--final-path <path>]
 *
 * Exit codes:
 *   0 — clean pass (strict) or any result in warn/off mode
 *   1 — strict mode hard failure
 *
 * Requires `npm run build` to have been run first (reads from dist/).
 * If dist/pipeline/quality-oracle.js is missing, error with instructions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const DIST_ORACLE = path.join(PLUGIN_ROOT, 'dist', 'pipeline', 'quality-oracle.js');

// ─── CLI Argument Parsing ────────────────────────────────────────────────────

function parseArgs(argv) {
  const result = {
    input: null,
    project: null,
    chapter: null,
    mode: 'strict',
    targetChars: null,
    finalPath: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--input' && argv[i + 1]) {
      result.input = argv[++i];
    } else if (arg === '--project' && argv[i + 1]) {
      result.project = argv[++i];
    } else if (arg === '--chapter' && argv[i + 1]) {
      result.chapter = parseInt(argv[++i], 10);
    } else if (arg === '--mode' && argv[i + 1]) {
      result.mode = argv[++i];
    } else if (arg === '--target-chars' && argv[i + 1]) {
      result.targetChars = parseInt(argv[++i], 10);
    } else if (arg === '--final-path' && argv[i + 1]) {
      result.finalPath = argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return result;
}

function printHelp() {
  process.stdout.write(`
quality-gate.mjs — Deterministic prose quality check

Usage:
  node scripts/quality-gate.mjs --input <chapter.md> --project <dir> --chapter <N>

Options:
  --input <path>        Path to the chapter file (required)
  --project <path>      Project directory (required)
  --chapter <N>         Chapter number for report filename (required)
  --mode strict|warn|off  Failure mode (default: strict)
  --target-chars <N>    If provided, checks that length >= 80% of N
  --final-path <path>   On strict failure, preserve this file; save input as <path>.draft.md
  --help, -h            Show this help

Requirements:
  Run \`npm run build\` first — this script imports from dist/pipeline/quality-oracle.js
`);
}

function padChapter(n) {
  return String(n).padStart(3, '0');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // Off mode: exit immediately
  if (args.mode === 'off') {
    // Optionally write a minimal report indicating off mode
    if (args.project && args.chapter != null) {
      const reportDir = path.join(args.project, 'reviews', 'quality');
      fs.mkdirSync(reportDir, { recursive: true });
      const pad = padChapter(args.chapter);
      const reportPath = path.join(reportDir, `chapter_${pad}_quality.json`);
      const report = {
        verdict: 'SKIP',
        directives: [],
        score: null,
        mode: 'off',
        warnings: 0,
        failures: 0,
        generatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    }
    process.exit(0);
  }

  // Validate required args
  if (!args.input) {
    process.stderr.write('[quality-gate] ERROR: --input <chapter.md> is required\n');
    process.exit(1);
  }
  if (!args.project) {
    process.stderr.write('[quality-gate] ERROR: --project <dir> is required\n');
    process.exit(1);
  }
  if (args.chapter == null || isNaN(args.chapter)) {
    process.stderr.write('[quality-gate] ERROR: --chapter <N> is required\n');
    process.exit(1);
  }

  // Check dist/ exists
  if (!fs.existsSync(DIST_ORACLE)) {
    process.stderr.write(
      `[quality-gate] ERROR: dist/ not built — run \`npm run build\` first\n` +
      `  Expected: ${DIST_ORACLE}\n`
    );
    process.exit(1);
  }

  // Read input file
  if (!fs.existsSync(args.input)) {
    process.stderr.write(`[quality-gate] ERROR: input file not found: ${args.input}\n`);
    process.exit(1);
  }

  const content = fs.readFileSync(args.input, 'utf-8');

  // Import quality oracle from dist
  const { analyzeChapter } = await import(DIST_ORACLE);

  // Determine sceneCount from chapter JSON (if available)
  let sceneCount = 1;
  try {
    const pad = padChapter(args.chapter);
    const chapterJsonPath = path.join(args.project, 'chapters', `chapter_${pad}.json`);
    const plotJson = JSON.parse(fs.readFileSync(chapterJsonPath, 'utf8'));
    sceneCount = plotJson.scenes?.length ?? 1;
  } catch {
    // chapter JSON missing or malformed; default sceneCount = 1
  }

  // Run analysis
  const oracleOpts = {};
  const result = analyzeChapter(content, sceneCount, oracleOpts);

  const { verdict, directives, assessment } = result;

  // Calculate aggregate score (average of available numeric scores)
  const scores = [
    assessment.proseQuality?.score,
    assessment.sensoryGrounding?.score,
    assessment.rhythmVariation?.score,
  ].filter(s => typeof s === 'number');
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  // ─── Hard-fail Conditions ────────────────────────────────────────────────
  // These same conditions apply in both strict and warn mode (warn just doesn't exit 1)

  const failureReasons = [];

  // 1. verdict === "REVISE"
  if (verdict === 'REVISE') {
    failureReasons.push('oracle verdict is REVISE');
  }

  // 2. Any directive with type "plot-meta-leak" AND severity "high"
  const highMetaLeaks = directives.filter(
    d => d.type === 'plot-meta-leak' && d.severity === 'high'
  );
  if (highMetaLeaks.length > 0) {
    failureReasons.push(`${highMetaLeaks.length} high-severity plot-meta-leak directive(s)`);
  }

  // 3. Any directive with type "consecutive-short-sentences" AND severity "high"
  const highShortSentences = directives.filter(
    d => d.type === 'consecutive-short-sentences' && d.severity === 'high'
  );
  if (highShortSentences.length > 0) {
    failureReasons.push(`${highShortSentences.length} high-severity consecutive-short-sentences directive(s)`);
  }

  // 4. Length check (if --target-chars provided)
  if (args.targetChars != null) {
    const charLen = [...content].length;
    const minChars = Math.floor(args.targetChars * 0.8);
    if (charLen < minChars) {
      failureReasons.push(`output length ${charLen} < 80% of target ${args.targetChars} (min: ${minChars})`);
    }
  }

  const hasFailures = failureReasons.length > 0;

  // ─── Write Report ────────────────────────────────────────────────────────

  const reportDir = path.join(args.project, 'reviews', 'quality');
  fs.mkdirSync(reportDir, { recursive: true });

  const pad = padChapter(args.chapter);
  const reportPath = path.join(reportDir, `chapter_${pad}_quality.json`);

  const report = {
    verdict,
    directives,
    score: avgScore,
    mode: args.mode,
    warnings: args.mode === 'warn' ? failureReasons.length : 0,
    failures: args.mode === 'strict' && hasFailures ? failureReasons.length : 0,
    failureReasons: args.mode === 'strict' && hasFailures ? failureReasons : [],
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  // ─── Act on Results ───────────────────────────────────────────────────────

  if (args.mode === 'warn') {
    if (hasFailures) {
      process.stdout.write(`WARN: ${failureReasons.length} quality issue(s) found. Report: ${reportPath}\n`);
      process.stdout.write(`WARN reasons: ${failureReasons.join('; ')}\n`);
    } else {
      process.stdout.write(`[quality-gate] PASS (warn mode). Report: ${reportPath}\n`);
    }
    process.exit(0);
  }

  // strict mode
  if (hasFailures) {
    // Handle --final-path: save input as draft, preserve existing final
    let draftPath = null;
    if (args.finalPath) {
      draftPath = args.finalPath + '.draft.md';
      // Copy the input to the draft path
      fs.copyFileSync(args.input, draftPath);
      // Do NOT overwrite the final path — it stays as-is

      process.stdout.write(
        `STRICT FAIL: report at ${reportPath}; draft saved at ${draftPath}; ` +
        `previous final preserved at ${args.finalPath}\n`
      );
    } else {
      process.stdout.write(`STRICT FAIL: report at ${reportPath}\n`);
    }

    process.stderr.write(`[quality-gate] STRICT FAIL: ${failureReasons.join('; ')}\n`);
    process.exit(1);
  }

  // Clean pass
  process.stdout.write(`[quality-gate] PASS. Report: ${reportPath}\n`);
  process.exit(0);
}

main().catch(e => {
  process.stderr.write(`[quality-gate] FATAL: ${e.message}\n`);
  process.exit(1);
});
