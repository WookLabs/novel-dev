/**
 * Regression test: codex-writer JSON.parse error context (H6 fix)
 *
 * Pins the helpful "Failed to parse chapter JSON at <path>: ..." error message
 * introduced in the prior commit so that future refactors cannot silently
 * revert to a bare SyntaxError with no file-path context.
 *
 * Covers:
 *   U4 — malformed chapter JSON triggers helpful error (path + message)
 *   U4 — valid chapter JSON produces no parse error in stderr
 *
 * Run: npm test -- codex-writer-json-parse
 */

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __filename_local = fileURLToPath(import.meta.url);
const __dirname_local = dirname(__filename_local);
const REPO_ROOT = join(__dirname_local, '..', '..');

const SCRIPT = join(REPO_ROOT, 'scripts', 'codex-writer.mjs');
const PROJECT_NOVEL_1 = join(REPO_ROOT, 'novels', 'novel_1');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal temp project directory with a single chapter file.
 * meta/project.json and characters/ directory are created so other loaders
 * don't throw before we reach the chapter JSON parse step.
 */
function buildTempProject(chapterContent: string): string {
  const tmpRoot = mkdtempSync(join(tmpdir(), 'codex-writer-json-parse-'));

  mkdirSync(join(tmpRoot, 'chapters'));
  mkdirSync(join(tmpRoot, 'characters'));
  mkdirSync(join(tmpRoot, 'meta'));

  // Malformed (or valid) chapter JSON under the standard name
  writeFileSync(join(tmpRoot, 'chapters', 'chapter_001.json'), chapterContent, 'utf-8');

  // Minimal meta/project.json so the project loader doesn't throw for missing meta
  writeFileSync(
    join(tmpRoot, 'meta', 'project.json'),
    JSON.stringify({ id: 'test-project', title: 'Test Novel' }),
    'utf-8'
  );

  return tmpRoot;
}

function runDryRun(projectPath: string): { stdout: string; stderr: string; combined: string; status: number } {
  const result = spawnSync(
    'node',
    [SCRIPT, '--chapter', '1', '--project', projectPath, '--mode', 'write', '--dry-run'],
    { encoding: 'utf-8', timeout: 30_000, cwd: REPO_ROOT }
  );
  const stdout = result.stdout ?? '';
  const stderr = result.stderr ?? '';
  return {
    stdout,
    stderr,
    combined: stdout + stderr,
    status: result.status ?? 1,
  };
}

// ---------------------------------------------------------------------------
// Test 1: malformed chapter JSON triggers a helpful error
// ---------------------------------------------------------------------------

describe('codex-writer: malformed chapter JSON triggers helpful error', () => {
  it('exits non-zero when chapter JSON is malformed', () => {
    const tmp = buildTempProject('{not json}');
    const { status } = runDryRun(tmp);
    expect(status).not.toBe(0);
  });

  it('stderr contains "Failed to parse chapter JSON at" when JSON is malformed', () => {
    const tmp = buildTempProject('{not json}');
    const { combined } = runDryRun(tmp);
    expect(combined).toContain('Failed to parse chapter JSON at');
  });

  it('stderr contains the chapter file path when JSON is malformed', () => {
    const tmp = buildTempProject('{not json}');
    const { combined } = runDryRun(tmp);
    // The error message includes the absolute path to the malformed file
    expect(combined).toContain('chapter_001.json');
  });

  it('stderr contains both the path and the "Failed to parse" sentinel in a single run', () => {
    // Belt-and-suspenders: verifies both requirements in one subprocess call
    const tmp = buildTempProject('{not json}');
    const { combined, status } = runDryRun(tmp);
    expect(status).not.toBe(0);
    expect(combined).toContain('Failed to parse chapter JSON at');
    expect(combined).toContain('chapter_001.json');
  });
});

// ---------------------------------------------------------------------------
// Test 2: valid chapter JSON produces no parse error (gated on novel_1)
// ---------------------------------------------------------------------------

describe.skipIf(!existsSync(join(PROJECT_NOVEL_1, 'characters')))(
  'codex-writer --dry-run: valid chapter JSON has no parse error',
  () => {
    it('stderr does NOT contain "Failed to parse chapter JSON" for novels/novel_1 chapter 1', () => {
      const result = spawnSync(
        'node',
        [SCRIPT, '--chapter', '1', '--project', PROJECT_NOVEL_1, '--mode', 'write', '--dry-run'],
        { encoding: 'utf-8', timeout: 30_000, cwd: REPO_ROOT }
      );
      const combined = (result.stdout ?? '') + (result.stderr ?? '');
      expect(combined).not.toContain('Failed to parse chapter JSON');
    });
  }
);
