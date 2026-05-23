/**
 * codex-exec.mjs — Shared Codex CLI execution primitives
 *
 * Extracted from scripts/codex-writer.mjs (H2 refactor).
 * Contains only Node builtin I/O + subprocess logic — no business/story logic.
 *
 * Exports:
 *   PLUGIN_ROOT          — absolute path to the repo root
 *   DIST_ORACLE          — absolute path to dist/pipeline/quality-oracle.js
 *   padChapter(n)        — zero-pad a chapter number to 3 digits
 *   assertDistBuilt()    — fast-fail if dist/ build is missing
 *   checkPrerequisites() — verify codex CLI is installed
 *   runCodex(systemPrompt, userPrompt, model) — run Codex CLI subprocess
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Absolute path to the plugin/repo root (two levels up from scripts/lib/) */
export const PLUGIN_ROOT = path.resolve(__dirname, '..', '..');

/** Absolute path to the quality-oracle compiled output */
export const DIST_ORACLE = path.join(PLUGIN_ROOT, 'dist', 'pipeline', 'quality-oracle.js');

// ─── Pure helpers ────────────────────────────────────────────────────────────

/**
 * Zero-pad a chapter number to 3 digits.
 * @param {number} n
 * @returns {string}
 */
export function padChapter(n) {
  return String(n).padStart(3, '0');
}

// ─── Preflight checks ────────────────────────────────────────────────────────

/**
 * Fast-fail when dist/pipeline/quality-oracle.js is missing.
 * Call this before any mode that invokes the quality-gate (write/revise/polish).
 * Skip in dry-run mode — no gate is invoked.
 */
export function assertDistBuilt() {
  if (!fs.existsSync(DIST_ORACLE)) {
    console.error(`✗ quality-gate requires ${DIST_ORACLE}. Run \`npm run build\` first.`);
    process.exit(2);
  }
}

/**
 * Verify that the `codex` CLI is available on PATH.
 * Exits with code 1 if not found.
 */
export function checkPrerequisites() {
  try {
    execFileSync('codex', ['--version'], { stdio: 'pipe' });
  } catch {
    console.error('\x1b[31m[ERROR]\x1b[0m codex CLI를 찾을 수 없습니다.');
    console.error('\x1b[31m[ERROR]\x1b[0m OpenAI Codex CLI를 설치하세요: npm install -g @openai/codex');
    process.exit(1);
  }
}

// ─── Codex CLI subprocess ────────────────────────────────────────────────────

/**
 * Run the Codex CLI with the given system + user prompts.
 *
 * Uses argv-mode (no shell composition) to prevent shell injection via
 * --model values. The prompt is written to a tmp file and piped via stdin.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {string} model   e.g. 'gpt-5.4'
 * @returns {string}       the generated text (may be empty if codex wrote nothing)
 */
export function runCodex(systemPrompt, userPrompt, model) {
  // Write combined prompt to a temp file (avoids CLI arg length limits).
  // mkdtempSync ensures no collisions during parallel runs.
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-writer-'));

  const promptFile = path.join(tmpDir, 'prompt.md');
  const outputFile = path.join(tmpDir, 'output.md');
  const combinedPrompt = `# System Instructions\n\n${systemPrompt}\n\n# Task\n\n${userPrompt}`;
  fs.writeFileSync(promptFile, combinedPrompt, 'utf-8');

  try {
    // argv-mode: model value is passed as a discrete argument — never shell-interpolated
    const outputPath = outputFile.replace(/\\/g, '/');
    const promptContent = fs.readFileSync(promptFile, 'utf-8');
    console.error('\x1b[34m[codex-writer]\x1b[0m Codex CLI 실행: model=' + model);

    execFileSync('codex', ['exec', '--model', model, '-o', outputPath, '-'], {
      input: promptContent,
      encoding: 'utf-8',
      stdio: ['pipe', 'inherit', 'inherit'],
      timeout: 600000, // 10 minutes
      env: { ...process.env },
    });

    if (fs.existsSync(outputFile)) {
      return fs.readFileSync(outputFile, 'utf-8');
    }
    return '';
  } finally {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}
