/**
 * Integration test: codex-writer --dry-run
 *
 * Verifies the full prompt-building pipeline without invoking Codex CLI.
 * Covers:
 *   U3 — character resolver is wired (output contains protagonist name, not "등장인물: none")
 *   U4 — writer-brief-builder is wired (output contains "## 작가용 브리프", no raw "## 플롯 json")
 *
 * Run: npm test -- codex-writer-dry-run
 */

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename_local = fileURLToPath(import.meta.url);
const __dirname_local = dirname(__filename_local);
const REPO_ROOT = join(__dirname_local, '..', '..');

const SCRIPT = join(REPO_ROOT, 'scripts', 'codex-writer.mjs');
const PROJECT = join(REPO_ROOT, 'novels', 'novel_1');
const projectExists = existsSync(PROJECT);

/**
 * Run codex-writer.mjs with --dry-run and return combined stdout+stderr.
 */
function runDryRun(): { output: string; status: number } {
  const result = spawnSync(
    'node',
    [SCRIPT, '--chapter', '1', '--project', PROJECT, '--mode', 'write', '--dry-run'],
    { encoding: 'utf-8', timeout: 30_000, cwd: REPO_ROOT }
  );
  return {
    output: (result.stdout ?? '') + (result.stderr ?? ''),
    status: result.status ?? 1,
  };
}

// ─── U3: Character resolver integration ──────────────────────────────────────

describe.skipIf(!projectExists)('codex-writer --dry-run: U3 character resolver', () => {
  it('exits with code 0 in dry-run mode', () => {
    const { status } = runDryRun();
    expect(status).toBe(0);
  });

  it('output contains protagonist name 서강윤 (verifies U3 character resolver is wired)', () => {
    const { output } = runDryRun();
    expect(output).toContain('서강윤');
  });

  it('output does NOT contain "등장인물: none" (verifies U3 fallback is not triggered)', () => {
    const { output } = runDryRun();
    expect(output).not.toContain('등장인물: none');
  });
});

// ─── U4: Writer brief builder integration ────────────────────────────────────

describe.skipIf(!projectExists)('codex-writer --dry-run: U4 writer brief builder', () => {
  it('output contains "## 작가용 브리프" section header (verifies U4 brief builder is wired)', () => {
    const { output } = runDryRun();
    expect(output).toContain('## 작가용 브리프');
  });

  it('output does NOT contain raw "## 플롯 json" header (verifies raw plot JSON is not leaked)', () => {
    const { output } = runDryRun();
    // The old pipeline embedded raw chapter JSON under a "## 플롯" block.
    // The new pipeline uses buildWriterBrief() which must not emit this header.
    expect(output).not.toMatch(/##\s*플롯\s*json/i);
    expect(output).not.toMatch(/```json[\s\S]*?"chapter_number"[\s\S]*?```/m);
  });

  it('output does NOT contain literal storyboard phrase 화면 페이드 outside brief metadata', () => {
    const { output } = runDryRun();
    // The brief builder replaces 화면 페이드 with a prose-safe instruction.
    // It may appear in the WARN log line about replacements, but must NOT appear
    // inside the user prompt body that the writer will see.
    const userPromptSection = output.split('=== USER PROMPT ===')[1] ?? '';
    expect(userPromptSection).not.toContain('화면 페이드');
  });
});
