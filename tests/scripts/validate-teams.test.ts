/**
 * Regression tests for scripts/validate-teams.mjs
 *
 * Spawns the validator as a subprocess with a controlled temp directory
 * so we can test failure conditions without touching real team/agent files.
 *
 * Each test follows the spec-then-tdd RED→GREEN cycle.
 */

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __filename_local = fileURLToPath(import.meta.url);
const __dirname_local = dirname(__filename_local);
const REPO_ROOT = join(__dirname_local, '..', '..');
const VALIDATOR = join(REPO_ROOT, 'scripts', 'validate-teams.mjs');
const REAL_TEAMS = join(REPO_ROOT, 'teams');
const REAL_AGENTS = join(REPO_ROOT, 'agents');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal valid team JSON with controllable agents and steps. */
function makeTeam(overrides: Partial<{
  name: string;
  members: object[];
  steps: object[];
}>): string {
  const members = overrides.members ?? [
    { agent: 'novelist', role: 'lead', responsibility: 'Write the chapter' },
    { agent: 'proofreader', role: 'support', responsibility: 'Proofread', model: 'haiku' },
  ];
  const steps = overrides.steps ?? [
    { name: 'draft', agents: ['novelist'], execution: 'sequential', output: 'Draft chapter' },
    { name: 'proofread', agents: ['proofreader'], execution: 'sequential', depends_on: ['draft'], output: 'Proofread chapter' },
  ];
  return JSON.stringify({
    $schema: '../schemas/team.schema.json',
    schema_version: '1.0',
    name: overrides.name ?? 'test-team',
    display_name: 'Test Team',
    description: 'A test team for automated validation.',
    category: 'writing',
    agents: members,
    workflow: { type: 'sequential', steps },
    coordination: { mode: 'orchestrated', lead: 'novelist', communication: 'task-based' },
    quality_gates: { enabled: false },
  }, null, 2);
}

/**
 * Build a temporary project dir with:
 *   agents/<name>.md stubs for all real agents
 *   teams/<teamName>.team.json with provided content
 *   scripts/validate-teams.mjs patched to use temp dirs
 */
function buildTempProject(teams: Record<string, string>): string {
  const tmpRoot = mkdtempSync(join(tmpdir(), 'validate-teams-'));

  // -- agents dir: stub all real agent .md files --
  const agentsDir = join(tmpRoot, 'agents');
  mkdirSync(agentsDir);
  const realAgentFiles = (require('fs').readdirSync(REAL_AGENTS) as string[]).filter(
    (f: string) => f.endsWith('.md') && f !== 'AGENTS.md'
  );
  for (const f of realAgentFiles) {
    writeFileSync(join(agentsDir, f), `---\nname: ${f.replace('.md', '')}\n---\n`);
  }

  // -- teams dir --
  const teamsDir = join(tmpRoot, 'teams');
  mkdirSync(teamsDir);
  for (const [name, content] of Object.entries(teams)) {
    writeFileSync(join(teamsDir, name), content);
  }

  // -- patched validator --
  const scriptsDir = join(tmpRoot, 'scripts');
  mkdirSync(scriptsDir);
  const validatorSrc = readFileSync(VALIDATOR, 'utf-8');
  // Replace the two dir-resolution lines so they point to temp dirs
  const patched = validatorSrc
    .replace(
      /const agentsDir\s*=\s*join\(__dirname,\s*'\.\.'\s*,\s*'agents'\s*\);/,
      `const agentsDir = ${JSON.stringify(agentsDir)};`
    )
    .replace(
      /const teamsDir\s*=\s*join\(__dirname,\s*'\.\.'\s*,\s*'teams'\s*\);/,
      `const teamsDir = ${JSON.stringify(teamsDir)};`
    );
  writeFileSync(join(scriptsDir, 'validate-teams.mjs'), patched);

  return tmpRoot;
}

function runValidator(tmpRoot: string) {
  const result = spawnSync(
    process.execPath,
    [join(tmpRoot, 'scripts', 'validate-teams.mjs')],
    { encoding: 'utf-8' }
  );
  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    combined: (result.stdout ?? '') + (result.stderr ?? ''),
  };
}

// ---------------------------------------------------------------------------
// CRITERION 1: Non-existent agent reference → exit nonzero
// ---------------------------------------------------------------------------
describe('validate-teams.mjs — agent reference checks', () => {
  it('MUST: fails when a member references a non-existent agent', () => {
    const tmp = buildTempProject({
      'bad-agent.team.json': makeTeam({
        members: [
          { agent: 'ghost-agent', role: 'lead', responsibility: 'Does not exist' },
          { agent: 'proofreader', role: 'support', responsibility: 'Proofread', model: 'haiku' },
        ],
      }),
    });
    const { exitCode, combined } = runValidator(tmp);
    expect(exitCode).not.toBe(0);
    expect(combined).toContain('ghost-agent');
  });

  it('MUST: fails when a workflow step references a non-existent agent', () => {
    const tmp = buildTempProject({
      'bad-step-agent.team.json': makeTeam({
        steps: [
          { name: 'draft', agents: ['phantom'], execution: 'sequential', output: 'Draft' },
        ],
      }),
    });
    const { exitCode, combined } = runValidator(tmp);
    expect(exitCode).not.toBe(0);
    expect(combined).toContain('phantom');
  });
});

// ---------------------------------------------------------------------------
// CRITERION 2: depends_on pointing to non-existent step → exit nonzero
// ---------------------------------------------------------------------------
describe('validate-teams.mjs — depends_on checks', () => {
  it('MUST: fails when a workflow step depends_on a non-existent step name', () => {
    const tmp = buildTempProject({
      'bad-depends.team.json': makeTeam({
        steps: [
          { name: 'draft', agents: ['novelist'], execution: 'sequential', output: 'Draft' },
          {
            name: 'proofread',
            agents: ['proofreader'],
            execution: 'sequential',
            depends_on: ['nonexistent-step'],
            output: 'Proofread',
          },
        ],
      }),
    });
    const { exitCode, combined } = runValidator(tmp);
    expect(exitCode).not.toBe(0);
    expect(combined).toContain('nonexistent-step');
  });
});

// ---------------------------------------------------------------------------
// CRITERION 3: characters/* without resolve:from_scene_cast → exit nonzero
// ---------------------------------------------------------------------------
describe('validate-teams.mjs — characters/* placeholder checks', () => {
  it('MUST: fails when characters/* member is missing resolve:from_scene_cast', () => {
    const tmp = buildTempProject({
      'bad-chars.team.json': makeTeam({
        members: [
          { agent: 'novelist', role: 'lead', responsibility: 'Write' },
          { agent: 'characters/*', role: 'worker', responsibility: 'Character voices' },
          // No resolve field — should fail
        ],
      }),
    });
    const { exitCode, combined } = runValidator(tmp);
    expect(exitCode).not.toBe(0);
    expect(combined).toContain('characters/*');
    expect(combined).toContain('from_scene_cast');
  });

  it('passes when characters/* member has resolve:from_scene_cast', () => {
    const tmp = buildTempProject({
      'good-chars.team.json': makeTeam({
        members: [
          { agent: 'novelist', role: 'lead', responsibility: 'Write' },
          { agent: 'characters/*', role: 'worker', responsibility: 'Character voices', resolve: 'from_scene_cast' },
          { agent: 'proofreader', role: 'support', responsibility: 'Proofread', model: 'haiku' },
        ],
      }),
    });
    const { exitCode } = runValidator(tmp);
    expect(exitCode).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// CRITERION 4: All four current writing-team*.team.json files pass
// ---------------------------------------------------------------------------
describe('validate-teams.mjs — real writing-team files', () => {
  it('MUST: all four writing-team*.team.json files pass validation', () => {
    // Run against the real teams/ directory — no patching needed
    const result = spawnSync(process.execPath, [VALIDATOR], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// CRITERION 5: orchestrator_action allowlist check
// ---------------------------------------------------------------------------
describe('validate-teams.mjs — orchestrator_action allowlist', () => {
  it('MUST: fails when a step uses an unknown orchestrator_action', () => {
    const tmp = buildTempProject({
      'bad-action.team.json': makeTeam({
        steps: [
          {
            name: 'magic-step',
            agents: [],
            execution: 'sequential',
            type: 'orchestrator_action',
            action: 'not-a-real-action',
            output: 'Magical output',
          },
        ],
      }),
    });
    const { exitCode, combined } = runValidator(tmp);
    expect(exitCode).not.toBe(0);
    expect(combined).toContain('not-a-real-action');
  });

  it('passes when a step uses a known orchestrator_action (codex-writer)', () => {
    const tmp = buildTempProject({
      'good-action.team.json': makeTeam({
        steps: [
          {
            name: 'codex-write',
            agents: [],
            execution: 'sequential',
            type: 'orchestrator_action',
            action: 'codex-writer',
            output: 'Draft chapter',
          },
          {
            name: 'proofread',
            agents: ['proofreader'],
            execution: 'sequential',
            depends_on: ['codex-write'],
            output: 'Proofread chapter',
          },
        ],
      }),
    });
    const { exitCode } = runValidator(tmp);
    expect(exitCode).toBe(0);
  });

  it('passes when a step uses orchestrator_action (adult-rewriter)', () => {
    const tmp = buildTempProject({
      'adult-rewriter-action.team.json': makeTeam({
        steps: [
          {
            name: 'draft',
            agents: ['novelist'],
            execution: 'sequential',
            output: 'Draft chapter',
          },
          {
            name: 'adult-rewrite',
            agents: [],
            execution: 'sequential',
            depends_on: ['draft'],
            type: 'orchestrator_action',
            action: 'adult-rewriter',
            skip_if: 'no_adult_markers',
            output: 'Adult-rewritten chapter',
          },
          {
            name: 'proofread',
            agents: ['proofreader'],
            execution: 'sequential',
            depends_on: ['adult-rewrite'],
            output: 'Proofread chapter',
          },
        ],
      }),
    });
    const { exitCode } = runValidator(tmp);
    expect(exitCode).toBe(0);
  });

  it('passes when a step uses orchestrator_action (chapter-polisher-full)', () => {
    const tmp = buildTempProject({
      'polisher-action.team.json': makeTeam({
        steps: [
          {
            name: 'draft',
            agents: ['novelist'],
            execution: 'sequential',
            output: 'Draft chapter',
          },
          {
            name: 'polish',
            agents: [],
            execution: 'sequential',
            depends_on: ['draft'],
            type: 'orchestrator_action',
            action: 'chapter-polisher-full',
            output: 'Polished chapter',
          },
          {
            name: 'proofread',
            agents: ['proofreader'],
            execution: 'sequential',
            depends_on: ['polish'],
            output: 'Proofread chapter',
          },
        ],
      }),
    });
    const { exitCode } = runValidator(tmp);
    expect(exitCode).toBe(0);
  });

  it('passes when a step uses orchestrator_action (quality-gate)', () => {
    const tmp = buildTempProject({
      'quality-gate-action.team.json': makeTeam({
        steps: [
          {
            name: 'draft',
            agents: ['novelist'],
            execution: 'sequential',
            output: 'Draft chapter',
          },
          {
            name: 'quality-gate-draft',
            agents: [],
            execution: 'sequential',
            depends_on: ['draft'],
            type: 'orchestrator_action',
            action: 'quality-gate',
            output: 'Quality gate result',
          },
          {
            name: 'proofread',
            agents: ['proofreader'],
            execution: 'sequential',
            depends_on: ['quality-gate-draft'],
            output: 'Proofread chapter',
          },
        ],
      }),
    });
    const { exitCode } = runValidator(tmp);
    expect(exitCode).toBe(0);
  });
});
