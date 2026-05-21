/**
 * Tests for scripts/quality-gate.mjs
 *
 * Acceptance Criteria (spec-then-TDD):
 * MUST 1: bad-short-prose.md fails strict mode and writes a report to reviews/quality/chapter_XXX_quality.json
 * MUST 2: bad-short-prose.md passes warn mode (exit 0) but the report contains nonzero warning count
 * MUST 3: A clean fixture with no meta leaks and sufficient length passes strict mode (exit 0)
 * MUST 4: When strict mode fails and a previous final chapter file exists, that file is not overwritten;
 *          output is saved as chapter_XXX.draft.md
 * SHOULD: Exit code and report path are printed to stdout so orchestrators can act on them
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { spawnSync, execSync } from 'child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __filename_local = fileURLToPath(import.meta.url);
const __dirname_local = dirname(__filename_local);
const REPO_ROOT = join(__dirname_local, '..', '..');
const GATE = join(REPO_ROOT, 'scripts', 'quality-gate.mjs');
const BAD_PROSE = join(REPO_ROOT, 'tests', 'fixtures', 'bad-short-prose.md');
const CLEAN_PROSE = join(REPO_ROOT, 'tests', 'fixtures', 'clean-prose.md');
const DIST_ORACLE = join(REPO_ROOT, 'dist', 'pipeline', 'quality-oracle.js');

// ─── Ensure dist/ is built ───────────────────────────────────────────────────

beforeAll(() => {
  if (!existsSync(DIST_ORACLE)) {
    execSync('npm run build', { cwd: REPO_ROOT, stdio: 'inherit' });
  }
}, 60_000);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Create a temp project directory with minimal structure */
function makeTempProject(): string {
  const dir = mkdtempSync(join(tmpdir(), 'quality-gate-test-'));
  mkdirSync(join(dir, 'chapters'), { recursive: true });
  mkdirSync(join(dir, 'reviews', 'quality'), { recursive: true });
  return dir;
}

/**
 * Run quality-gate.mjs as subprocess.
 * Returns { status, stdout, stderr }
 */
function runGate(args: string[]): { status: number; stdout: string; stderr: string } {
  const result = spawnSync('node', [GATE, ...args], {
    encoding: 'utf-8',
    timeout: 30_000,
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

// ─── MUST 1: bad-short-prose.md fails strict mode and writes report ──────────

describe('MUST 1: strict mode fails on bad-short-prose', () => {
  it('exits with code 1 and writes a JSON report to reviews/quality/', () => {
    const project = makeTempProject();
    // Copy bad prose as the input
    const inputPath = join(project, 'chapters', 'chapter_001.md');
    copyFileSync(BAD_PROSE, inputPath);

    const result = runGate([
      '--input', inputPath,
      '--project', project,
      '--chapter', '1',
      '--mode', 'strict',
    ]);

    // MUST exit 1 in strict mode when analysis finds issues
    expect(result.status, `stderr: ${result.stderr}`).toBe(1);

    // MUST write a report
    const reportPath = join(project, 'reviews', 'quality', 'chapter_001_quality.json');
    expect(existsSync(reportPath), `report not found at ${reportPath}`).toBe(true);

    // MUST contain well-formed JSON with expected fields
    const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
    expect(report).toHaveProperty('verdict');
    expect(report).toHaveProperty('directives');
    expect(report).toHaveProperty('score');
    expect(report).toHaveProperty('mode', 'strict');
    expect(report).toHaveProperty('generatedAt');
    expect(report.failures).toBeGreaterThan(0);
  });

  it('prints report path on stdout when strict mode fails (SHOULD)', () => {
    const project = makeTempProject();
    const inputPath = join(project, 'chapters', 'chapter_001.md');
    copyFileSync(BAD_PROSE, inputPath);

    const result = runGate([
      '--input', inputPath,
      '--project', project,
      '--chapter', '1',
      '--mode', 'strict',
    ]);

    // Report path should appear in stdout or stderr
    const combined = result.stdout + result.stderr;
    expect(combined).toContain('chapter_001_quality.json');
  });
});

// ─── MUST 2: bad-short-prose.md passes warn mode (exit 0) but report has warnings

describe('MUST 2: warn mode exits 0 but report has nonzero warning count', () => {
  it('exits 0 in warn mode and report contains warnings > 0', () => {
    const project = makeTempProject();
    const inputPath = join(project, 'chapters', 'chapter_001.md');
    copyFileSync(BAD_PROSE, inputPath);

    const result = runGate([
      '--input', inputPath,
      '--project', project,
      '--chapter', '1',
      '--mode', 'warn',
    ]);

    // MUST exit 0 in warn mode
    expect(result.status, `stderr: ${result.stderr}`).toBe(0);

    // MUST still write a report
    const reportPath = join(project, 'reviews', 'quality', 'chapter_001_quality.json');
    expect(existsSync(reportPath)).toBe(true);

    const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
    expect(report.mode).toBe('warn');
    // Warn mode: warnings > 0 (same conditions as strict, but no exit 1)
    expect(report.warnings, 'warn mode report should have nonzero warning count').toBeGreaterThan(0);
    // failures should be 0 in warn mode (no hard fails recorded)
    expect(report.failures).toBe(0);
  });
});

// ─── MUST 3: clean fixture passes strict mode ─────────────────────────────────

describe('MUST 3: clean prose passes strict mode (exit 0)', () => {
  it('exits 0 with clean prose and report verdict PASS', () => {
    const project = makeTempProject();
    const inputPath = join(project, 'chapters', 'chapter_005.md');
    copyFileSync(CLEAN_PROSE, inputPath);

    const result = runGate([
      '--input', inputPath,
      '--project', project,
      '--chapter', '5',
      '--mode', 'strict',
    ]);

    expect(result.status, `stdout: ${result.stdout}\nstderr: ${result.stderr}`).toBe(0);

    const reportPath = join(project, 'reviews', 'quality', 'chapter_005_quality.json');
    expect(existsSync(reportPath)).toBe(true);

    const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
    expect(report.verdict).toBe('PASS');
    expect(report.failures).toBe(0);
  });
});

// ─── MUST 4: strict fail does not overwrite existing final file ───────────────

describe('MUST 4: strict fail with existing final file — no overwrite', () => {
  it('saves draft as chapter_001.draft.md and preserves existing final file', () => {
    const project = makeTempProject();
    const inputPath = join(project, 'chapters', 'chapter_001_draft_input.md');
    const finalPath = join(project, 'chapters', 'chapter_001.md');

    // Write the "new" (bad) draft to input
    copyFileSync(BAD_PROSE, inputPath);

    // Write an existing "final" file that should NOT be overwritten
    const originalFinalContent = '# Original Final Chapter\n\n이것은 기존 최종본입니다.\n';
    writeFileSync(finalPath, originalFinalContent, 'utf-8');

    const result = runGate([
      '--input', inputPath,
      '--project', project,
      '--chapter', '1',
      '--mode', 'strict',
      '--final-path', finalPath,
    ]);

    // MUST exit 1 (strict fail)
    expect(result.status, `stderr: ${result.stderr}`).toBe(1);

    // MUST preserve existing final file
    const finalContent = readFileSync(finalPath, 'utf-8');
    expect(finalContent).toBe(originalFinalContent);

    // MUST save the draft as <final-path>.draft.md
    const draftPath = finalPath + '.draft.md';
    expect(existsSync(draftPath), `draft not found at ${draftPath}`).toBe(true);

    // The output should mention the draft save location
    const combined = result.stdout + result.stderr;
    expect(combined).toContain('draft');
  });
});

// ─── SHOULD: off mode exits 0 immediately ─────────────────────────────────────

describe('SHOULD: off mode exits 0 without analysis', () => {
  it('exits 0 in off mode even for bad prose', () => {
    const project = makeTempProject();
    const inputPath = join(project, 'chapters', 'chapter_001.md');
    copyFileSync(BAD_PROSE, inputPath);

    const result = runGate([
      '--input', inputPath,
      '--project', project,
      '--chapter', '1',
      '--mode', 'off',
    ]);

    expect(result.status).toBe(0);
  });
});
