/**
 * Regression tests for scripts/validate-agents.mjs
 *
 * Spawns the validator as a subprocess with a controlled temp agents/ directory
 * so we can test failure conditions without touching real agent files.
 */

import { describe, it, expect } from 'vitest';
import { execFileSync, spawnSync } from 'child_process';
import { mkdtempSync, mkdirSync, writeFileSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __filename_local = fileURLToPath(import.meta.url);
const __dirname_local = dirname(__filename_local);
const REPO_ROOT = join(__dirname_local, '..', '..');
const VALIDATOR = join(REPO_ROOT, 'scripts', 'validate-agents.mjs');
const REAL_AGENTS = join(REPO_ROOT, 'agents');

/** Minimal valid frontmatter for an agent file. */
function agentMd(name: string, model = 'sonnet'): string {
  return `---\nname: ${name}\ndescription: "A ${name} agent used for testing purposes in the novel pipeline."\nmodel: ${model}\ncolor: blue\n---\n\n# ${name}\n`;
}

/**
 * Build a temp project root that mirrors the real agents/ directory,
 * but with specific files omitted or replaced.
 *
 * Returns the temp dir path.
 */
function buildTempProject(overrides: {
  omit?: string[];
  extra?: Record<string, string>;
} = {}): string {
  const tmpRoot = mkdtempSync(join(tmpdir(), 'validate-agents-'));
  const agentsDir = join(tmpRoot, 'agents');
  mkdirSync(agentsDir);

  // Copy all real agent files
  const realFiles = (() => {
    const { readdirSync } = require('fs');
    return (readdirSync(REAL_AGENTS) as string[]).filter((f: string) => f.endsWith('.md'));
  })();

  for (const f of realFiles) {
    if (overrides.omit?.includes(f)) continue;
    const { readFileSync } = require('fs');
    writeFileSync(join(agentsDir, f), readFileSync(join(REAL_AGENTS, f)));
  }

  // Add any extra files
  if (overrides.extra) {
    for (const [name, content] of Object.entries(overrides.extra)) {
      writeFileSync(join(agentsDir, name), content);
    }
  }

  // Copy the validator script (it resolves agents/ relative to __dirname)
  // We need a scripts/ dir next to agents/ for __dirname resolution to work.
  const scriptsDir = join(tmpRoot, 'scripts');
  mkdirSync(scriptsDir);
  const { readFileSync } = require('fs');
  const validatorSrc = readFileSync(VALIDATOR, 'utf-8');
  // Patch the validator so agentsDir resolves to our temp agents/ dir
  const patched = validatorSrc.replace(
    "const agentsDir = join(__dirname, '..', 'agents');",
    `const agentsDir = ${JSON.stringify(agentsDir)};`
  );
  writeFileSync(join(scriptsDir, 'validate-agents.mjs'), patched);

  return tmpRoot;
}

/** Run the patched validator from tmpRoot, return { exitCode, stdout, stderr }. */
function runValidator(tmpRoot: string) {
  const result = spawnSync(
    process.execPath,
    [join(tmpRoot, 'scripts', 'validate-agents.mjs')],
    { encoding: 'utf-8' }
  );
  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('validate-agents.mjs', () => {
  it('passes with all 22 agents present (real agents dir)', () => {
    const result = spawnSync(process.execPath, [VALIDATOR], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('22 agents validated successfully');
  });

  it('fails when extras.md is missing', () => {
    const tmp = buildTempProject({ omit: ['extras.md'] });
    const { exitCode, stderr } = runValidator(tmp);
    expect(exitCode).not.toBe(0);
    expect(stderr).toContain('extras.md');
  });

  it('fails when chapter-merger.md is missing', () => {
    const tmp = buildTempProject({ omit: ['chapter-merger.md'] });
    const { exitCode, stderr } = runValidator(tmp);
    expect(exitCode).not.toBe(0);
    expect(stderr).toContain('chapter-merger.md');
  });

  it('fails when both extras.md and chapter-merger.md are missing', () => {
    const tmp = buildTempProject({ omit: ['extras.md', 'chapter-merger.md'] });
    const { exitCode, stderr } = runValidator(tmp);
    expect(exitCode).not.toBe(0);
    expect(stderr).toContain('extras.md');
    expect(stderr).toContain('chapter-merger.md');
  });

  it('fails when an unauthorized agent file is present', () => {
    const tmp = buildTempProject({
      extra: { 'mystery-agent.md': agentMd('mystery-agent') },
    });
    const { exitCode, stderr } = runValidator(tmp);
    expect(exitCode).not.toBe(0);
    expect(stderr).toContain('mystery-agent.md');
  });
});
