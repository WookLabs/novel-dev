import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, utimes, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const sessionStartPath = join(root, 'scripts', 'session-start.mjs');

async function writeJson(path: string, data: unknown): Promise<void> {
  await writeFile(path, JSON.stringify(data, null, 2));
}

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

async function createRecoverableProject(state: Record<string, unknown>): Promise<string> {
  const rootDir = await mkdtemp(join(tmpdir(), 'session-start-recovery-'));
  const projectDir = join(rootDir, 'novels', 'sample-project');
  await mkdir(join(projectDir, 'meta'), { recursive: true });
  await mkdir(join(projectDir, 'chapters'), { recursive: true });
  await writeJson(join(projectDir, 'meta', 'project.json'), {
    id: 'sample-project',
    title: 'Sample',
    genre: 'mystery',
    status: 'writing',
    target_chapters: 12,
    created_at: '2026-01-21T09:00:00.000Z',
  });
  await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
    schema_version: '2.0',
    novel_id: 'novel_20260618_233000',
    project_id: 'sample-project',
    ralph_active: true,
    can_resume: true,
    mode: 'write-all',
    current_act: 1,
    current_chapter: 2,
    last_safe_chapter: 1,
    total_chapters: 12,
    total_acts: 3,
    completed_chapters: [1],
    failed_chapters: [],
    last_checkpoint: '2026-01-21T10:30:00.000Z',
    ...state,
  });
  return rootDir;
}

function projectDir(rootDir: string): string {
  return join(rootDir, 'novels', 'sample-project');
}

async function writeDesignGateReport(
  rootDir: string,
  overrides: Record<string, unknown> = {}
): Promise<void> {
  const reviewsDir = join(projectDir(rootDir), 'reviews');
  await mkdir(reviewsDir, { recursive: true });
  await writeJson(join(reviewsDir, 'design-gate-report.json'), {
    status: 'PASS',
    passed: true,
    issues: [],
    recommendedCommands: [
      `node dist/cli/run-premise-appeal-benchmark.js --project ${projectDir(rootDir)} --json`,
      `node dist/cli/apply-design-gate.js --project ${projectDir(rootDir)} --fail-on-blocked --json`,
    ],
    ...overrides,
  });
}

async function writeStyleGateReport(
  rootDir: string,
  overrides: Record<string, unknown> = {}
): Promise<void> {
  const reviewsDir = join(projectDir(rootDir), 'reviews');
  await mkdir(reviewsDir, { recursive: true });
  await writeJson(join(reviewsDir, 'style-gate-report.json'), {
    status: 'PASS',
    passed: true,
    issues: [],
    recommendedCommands: [
      `node dist/cli/run-prose-taste-benchmark.js --project ${projectDir(rootDir)} --json`,
      `node dist/cli/apply-style-gate.js --project ${projectDir(rootDir)} --fail-on-blocked --json`,
    ],
    ...overrides,
  });
}

async function writePriorManuscript(rootDir: string): Promise<string> {
  const manuscriptPath = join(projectDir(rootDir), 'chapters', 'chapter_001.md');
  await writeFile(
    manuscriptPath,
    '서진은 검은 인장을 발견하고 왕가 실종 사건과 금지된 숲의 소문이 이어진다는 단서를 얻었다.',
    'utf8'
  );
  return manuscriptPath;
}

async function writePriorSummary(rootDir: string): Promise<string> {
  const summariesDir = join(projectDir(rootDir), 'context', 'summaries');
  await mkdir(summariesDir, { recursive: true });
  const summaryPath = join(summariesDir, 'chapter_001_summary.md');
  await writeFile(summaryPath, substantiveSummary(), 'utf8');
  return summaryPath;
}

function substantiveSummary(): string {
  return [
    '# 1화 요약: 검은 인장',
    '',
    '서진은 아케디아 시장에서 검은 인장을 지닌 남자를 목격했고, 그 인장이 왕가 실종 사건과 연결된다는 소문을 들었다.',
    '그는 숲의 경계에서 인장이 남긴 재 냄새와 은빛 실을 확인했으며, 다음 회차에서는 단서를 따라 금지된 숲으로 들어가야 한다.',
  ].join('\n');
}

function runSessionStart(directory: string) {
  const result = spawnSync(
    process.execPath,
    [sessionStartPath],
    {
      cwd: root,
      input: JSON.stringify({ directory }),
      encoding: 'utf8',
    }
  );

  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
}

function runClearRecoveryState(directory: string) {
  const moduleUrl = pathToFileURL(join(root, 'scripts', 'session-recovery.mjs')).href;
  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { clearRecoveryState } from ${JSON.stringify(moduleUrl)}; await clearRecoveryState(${JSON.stringify(directory)});`,
    ],
    {
      cwd: root,
      encoding: 'utf8',
    }
  );

  expect(result.status, result.stderr).toBe(0);
}

function runCheckRecoveryState(directory: string) {
  const moduleUrl = pathToFileURL(join(root, 'scripts', 'session-recovery.mjs')).href;
  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { checkRecoveryState } from ${JSON.stringify(moduleUrl)}; const state = await checkRecoveryState(${JSON.stringify(directory)}); console.log(JSON.stringify(state));`,
    ],
    {
      cwd: root,
      encoding: 'utf8',
    }
  );

  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
}

describe('session-start recovery messaging', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('shows recovery options for a resumable session left ralph_active after an interruption', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    await writeDesignGateReport(rootDir);
    await writeStyleGateReport(rootDir);

    const output = runSessionStart(rootDir);

    expect(output.decision).toBe('approve');
    expect(output.message).toContain('이전 세션 복구 가능');
    expect(output.message).toContain('/write-all --resume');
    expect(output.message).toContain('1막 2화');
    expect(output.message).toContain('설계 게이트 | PASS');
    expect(output.message).toContain('문체 게이트 | PASS');
    expect(output.message).toContain('요약 메모리 | PASS');
    expect(output.message).toContain('새 세션에서 이어가려면 `/write-all --resume`을 사용하세요');
    expect(output.message).not.toContain('복구 전 설계 게이트 필요');
    expect(output.message).not.toContain('복구 전 문체 게이트 필요');

    const recovery = runCheckRecoveryState(projectDir(rootDir));
    expect(recovery.suggestion).toContain('/write-all --resume');
  });

  it('does not offer direct resume when design gate report is missing', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('이전 세션 복구 가능');
    expect(message).toContain('복구 전 설계 게이트 필요');
    expect(message).toContain('reviews/design-gate-report.json');
    expect(message).toContain('design-gate-report-missing');
    expect(message).toContain('run-premise-appeal-benchmark');
    expect(message).toContain('apply-design-gate');
    expect(message).toContain('복구 전 문체 게이트 필요');
    expect(message).toContain('reviews/style-gate-report.json');
    expect(message).toContain('style-gate-report-missing');
    expect(message).toContain('run-prose-taste-benchmark');
    expect(message).toContain('apply-style-gate');
    expect(message).toContain('설계/문체/요약 메모리 게이트가 모두 PASS가 된 뒤 `/write-all --resume`으로 재개하세요');
    expect(message).toContain('설계/문체/요약 메모리 게이트가 모두 PASS이면 `/write-all --resume`으로 재개');
    expect(message).not.toContain('`/write-all --resume` - 중단점에서 이어서 집필');
    expect(message).not.toContain('새 세션에서 이어가려면 `/write-all --resume`을 사용하세요');

    const recovery = runCheckRecoveryState(projectDir(rootDir));
    expect(recovery.suggestion).toContain('설계/문체/요약 메모리 게이트를 모두 PASS');
  });

  it('does not offer direct resume when design gate report is blocked', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    await writeStyleGateReport(rootDir);
    await writeDesignGateReport(rootDir, {
      status: 'BLOCKED',
      passed: false,
      issues: [{
        code: 'premise-appeal-not-ready',
        severity: 'critical',
        message: 'Premise appeal benchmark is not ready for design gate tuning.',
      }],
    });

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('복구 전 설계 게이트 필요');
    expect(message).toContain('BLOCKED (premise-appeal-not-ready)');
    expect(message).toContain('run-premise-appeal-benchmark');
    expect(message).toContain('apply-design-gate');
    expect(message).toContain('문체 게이트 | PASS');
    expect(message).not.toContain('복구 전 문체 게이트 필요');
    expect(message).toContain('설계/문체/요약 메모리 게이트가 모두 PASS가 된 뒤 `/write-all --resume`으로 재개하세요');
    expect(message).toContain('설계/문체/요약 메모리 게이트가 모두 PASS이면 `/write-all --resume`으로 재개');
    expect(message).not.toContain('`/write-all --resume` - 중단점에서 이어서 집필');
    expect(message).not.toContain('새 세션에서 이어가려면 `/write-all --resume`을 사용하세요');
  });

  it('does not offer direct resume when style gate report is missing', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    await writeDesignGateReport(rootDir);

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('설계 게이트 | PASS');
    expect(message).toContain('복구 전 문체 게이트 필요');
    expect(message).toContain('reviews/style-gate-report.json');
    expect(message).toContain('style-gate-report-missing');
    expect(message).toContain('run-prose-taste-benchmark');
    expect(message).toContain('apply-style-gate');
    expect(message).toContain('설계/문체/요약 메모리 게이트가 모두 PASS가 된 뒤 `/write-all --resume`으로 재개하세요');
    expect(message).not.toContain('`/write-all --resume` - 중단점에서 이어서 집필');
    expect(message).not.toContain('새 세션에서 이어가려면 `/write-all --resume`을 사용하세요');

    const recovery = runCheckRecoveryState(projectDir(rootDir));
    expect(recovery.suggestion).toContain('설계/문체/요약 메모리 게이트를 모두 PASS');
  });

  it('does not offer direct resume when style gate report is blocked', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    await writeDesignGateReport(rootDir);
    await writeStyleGateReport(rootDir, {
      status: 'BLOCKED',
      passed: false,
      issues: [{
        code: 'prose-taste-not-ready',
        severity: 'critical',
        message: 'Prose taste benchmark is not ready for style gate tuning.',
      }],
    });

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('설계 게이트 | PASS');
    expect(message).toContain('문체 게이트 | BLOCKED (prose-taste-not-ready)');
    expect(message).toContain('복구 전 문체 게이트 필요');
    expect(message).toContain('run-prose-taste-benchmark');
    expect(message).toContain('apply-style-gate');
    expect(message).toContain('설계/문체/요약 메모리 게이트가 모두 PASS가 된 뒤 `/write-all --resume`으로 재개하세요');
    expect(message).not.toContain('`/write-all --resume` - 중단점에서 이어서 집필');
    expect(message).not.toContain('새 세션에서 이어가려면 `/write-all --resume`을 사용하세요');
  });

  it('does not offer direct resume when prior summary memory is missing', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    await writeDesignGateReport(rootDir);
    await writeStyleGateReport(rootDir);
    await writePriorManuscript(rootDir);

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('설계 게이트 | PASS');
    expect(message).toContain('문체 게이트 | PASS');
    expect(message).toContain('요약 메모리 | BLOCKED (summary-memory-missing)');
    expect(message).toContain('복구 전 요약 메모리 게이트 필요');
    expect(message).toContain('chapter_001_summary.md');
    expect(message).toContain('/verify-chapter 1');
    expect(message).toContain('설계/문체/요약 메모리 게이트가 모두 PASS가 된 뒤 `/write-all --resume`으로 재개하세요');
    expect(message).not.toContain('`/write-all --resume` - 중단점에서 이어서 집필');
    expect(message).not.toContain('새 세션에서 이어가려면 `/write-all --resume`을 사용하세요');

    const recovery = runCheckRecoveryState(projectDir(rootDir));
    expect(recovery.suggestion).toContain('요약 메모리 게이트를 모두 PASS');
  });

  it('does not offer direct resume when prior summary memory is stale', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    await writeDesignGateReport(rootDir);
    await writeStyleGateReport(rootDir);
    const manuscriptPath = await writePriorManuscript(rootDir);
    const summaryPath = await writePriorSummary(rootDir);
    await utimes(summaryPath, new Date('2025-01-01T00:00:00Z'), new Date('2025-01-01T00:00:00Z'));
    await utimes(manuscriptPath, new Date('2025-01-02T00:00:00Z'), new Date('2025-01-02T00:00:00Z'));

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('요약 메모리 | BLOCKED (summary-memory-stale)');
    expect(message).toContain('복구 전 요약 메모리 게이트 필요');
    expect(message).not.toContain('`/write-all --resume` - 중단점에서 이어서 집필');
    expect(message).not.toContain('새 세션에서 이어가려면 `/write-all --resume`을 사용하세요');
  });

  it('offers direct resume when prior summary memory is fresh and substantive', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    await writeDesignGateReport(rootDir);
    await writeStyleGateReport(rootDir);
    const manuscriptPath = await writePriorManuscript(rootDir);
    const summaryPath = await writePriorSummary(rootDir);
    await utimes(manuscriptPath, new Date('2025-01-01T00:00:00Z'), new Date('2025-01-01T00:00:00Z'));
    await utimes(summaryPath, new Date('2025-01-02T00:00:00Z'), new Date('2025-01-02T00:00:00Z'));

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('요약 메모리 | PASS');
    expect(message).toContain('`/write-all --resume` - 중단점에서 이어서 집필');
    expect(message).toContain('새 세션에서 이어가려면 `/write-all --resume`을 사용하세요');

    const recovery = runCheckRecoveryState(projectDir(rootDir));
    expect(recovery.suggestion).toContain('/write-all --resume');
  });

  it('shows the pause reason for manual-intervention recovery states', async () => {
    const rootDir = await createRecoverableProject({
      ralph_active: false,
      requires_user_intervention: true,
      pause_reason: 'max_iterations reached before act completion',
    });
    tempDirs.push(rootDir);

    const output = runSessionStart(rootDir);

    expect(output.message).toContain('이전 세션 복구 가능');
    expect(output.message).toContain('max_iterations reached before act completion');
  });

  it('clears all active recovery flags when recovery state is reset', async () => {
    const rootDir = await createRecoverableProject({
      ralph_active: true,
      requires_user_intervention: true,
      pause_reason: 'manual review required',
      last_failure_reason: 'manual review required',
      last_gate: {
        chapter: 1,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 92,
        blocking_reasons: [],
        decided_at: '2026-06-18T14:30:00.000Z',
      },
    });
    tempDirs.push(rootDir);

    runClearRecoveryState(projectDir(rootDir));

    const state = await readJson(join(projectDir(rootDir), 'meta', 'ralph-state.json'));
    expect(state.ralph_active).toBe(false);
    expect(state.can_resume).toBe(false);
    expect(state.mode).toBe('idle');
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([]);
    expect(state).not.toHaveProperty('requires_user_intervention');
    expect(state).not.toHaveProperty('pause_reason');
    expect(state).not.toHaveProperty('last_failure_reason');
    expect(state).not.toHaveProperty('last_gate');
  });

  it('restores a valid Ralph backup before showing recovery when state is corrupted', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    await writeDesignGateReport(rootDir);
    await writeStyleGateReport(rootDir);
    const statePath = join(projectDir(rootDir), 'meta', 'ralph-state.json');
    const backupPath = join(projectDir(rootDir), 'meta', 'ralph-state.backup.json');
    const validState = await readFile(statePath, 'utf8');
    await writeFile(backupPath, validState);
    await writeFile(statePath, '{ broken ralph state');

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('Ralph 상태 백업에서 복원');
    expect(message).toContain('이전 세션 복구 가능');
    expect(message).toContain('/write-all --resume');

    const restoredState = await readJson(statePath);
    expect(restoredState.current_chapter).toBe(2);
    expect(restoredState.can_resume).toBe(true);
    expect(restoredState.mode).toBe('write-all');
  });

  it('restores a valid Ralph backup when the current state is JSON but schema-invalid', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    await writeDesignGateReport(rootDir);
    await writeStyleGateReport(rootDir);
    const statePath = join(projectDir(rootDir), 'meta', 'ralph-state.json');
    const backupPath = join(projectDir(rootDir), 'meta', 'ralph-state.backup.json');
    const validState = await readFile(statePath, 'utf8');
    await writeFile(backupPath, validState);
    await writeJson(statePath, {
      can_resume: true,
      mode: 'write-all',
      ralph_active: true,
    });

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('Ralph 상태 백업에서 복원');
    expect(message).toContain('이전 세션 복구 가능');
    expect(message).toContain('1막 2화');
    expect(message).not.toContain('undefined');

    const restoredState = await readJson(statePath);
    expect(restoredState.novel_id).toBe('novel_20260618_233000');
    expect(restoredState.current_chapter).toBe(2);
    expect(restoredState.last_safe_chapter).toBe(1);
  });

  it('warns without resume options when state and backup are JSON but schema-invalid', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    const statePath = join(projectDir(rootDir), 'meta', 'ralph-state.json');
    const backupPath = join(projectDir(rootDir), 'meta', 'ralph-state.backup.json');
    await writeJson(statePath, {
      can_resume: true,
      mode: 'write-all',
      ralph_active: true,
    });
    await writeJson(backupPath, {
      can_resume: true,
      mode: 'write-all',
      ralph_active: true,
    });

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('Ralph 상태 파일이 유효하지 않습니다');
    expect(message).not.toContain('/write-all --resume');
    expect(message).not.toContain('이전 세션 복구 가능');
    expect(message).not.toContain('undefined');
  });

  it('warns without resume options when Ralph state and backup are both corrupted', async () => {
    const rootDir = await createRecoverableProject({});
    tempDirs.push(rootDir);
    const statePath = join(projectDir(rootDir), 'meta', 'ralph-state.json');
    const backupPath = join(projectDir(rootDir), 'meta', 'ralph-state.backup.json');
    await writeFile(statePath, '{ broken ralph state');
    await writeFile(backupPath, '{ broken backup state');

    const output = runSessionStart(rootDir);
    const message = output.message ?? '';

    expect(output.decision).toBe('approve');
    expect(message).toContain('Ralph 상태 파일을 읽을 수 없습니다');
    expect(message).not.toContain('/write-all --resume');
    expect(message).not.toContain('이전 세션 복구 가능');
  });
});
