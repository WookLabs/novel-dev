import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const actCompletionPath = join(root, 'scripts', 'act-completion.mjs');

async function writeJson(path: string, data: unknown): Promise<void> {
  await writeFile(path, JSON.stringify(data, null, 2));
}

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

async function createNovelRoot(state: Record<string, unknown>): Promise<{
  rootDir: string;
  projectDir: string;
  transcriptPath: string;
}> {
  const rootDir = await mkdtemp(join(tmpdir(), 'act-completion-gate-'));
  const projectDir = join(rootDir, 'novels', 'sample-project');
  await mkdir(join(projectDir, 'meta'), { recursive: true });
  await writeJson(join(projectDir, 'meta', 'project.json'), {
    id: 'novel_20260618_233000',
    title: 'Sample',
    genre: 'mystery',
  });
  await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
    $schema: '../../../schemas/ralph-state.schema.json',
    schema_version: '2.0',
    novel_id: 'novel_20260618_233000',
    project_id: 'novel_20260618_233000',
    ralph_active: true,
    mode: 'write-all',
    current_act: 1,
    current_chapter: 1,
    last_safe_chapter: 0,
    quality_retries: 0,
    total_acts: 3,
    total_chapters: 12,
    iteration: 1,
    max_iterations: 100,
    failed_chapters: [],
    completed_chapters: [],
    ...state,
  });

  const transcriptPath = join(rootDir, 'transcript.jsonl');
  return { rootDir, projectDir, transcriptPath };
}

async function writePlotStructure(projectDir: string, acts: unknown[]): Promise<void> {
  await mkdir(join(projectDir, 'plot'), { recursive: true });
  await writeJson(join(projectDir, 'plot', 'structure.json'), {
    total_acts: acts.length,
    acts,
  });
}

async function writeAssistantTranscript(path: string, text: string): Promise<void> {
  await writeFile(path, `${JSON.stringify({ role: 'assistant', content: text })}\n`);
}

function runActCompletion(rootDir: string, transcriptPath: string) {
  const result = spawnSync(
    process.execPath,
    [actCompletionPath],
    {
      cwd: root,
      input: JSON.stringify({ directory: rootDir, transcript_path: transcriptPath }),
      encoding: 'utf8',
    }
  );

  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
}

describe('act completion hook chapter gate enforcement', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('does not mark an act complete when the latest chapter gate failed', async () => {
    const fixture = await createNovelRoot({
      failed_chapters: [1],
      last_gate: {
        chapter: 1,
        status: 'RETRY',
        passed: false,
        should_retry: true,
        strategy: 'revise',
        score: 95,
        blocking_reasons: ['독자 몰입 계약 실패: 68점'],
      },
    });
    tempDirs.push(fixture.rootDir);
    await writeAssistantTranscript(fixture.transcriptPath, '<promise>ACT_1_DONE</promise>');

    const output = runActCompletion(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('chapter gate');

    const state = await readJson(join(fixture.projectDir, 'meta', 'ralph-state.json'));
    expect(state.act_complete).not.toBe(true);
    expect(state.ralph_active).toBe(true);
    expect(state.failed_chapters).toEqual([1]);
  });

  it('does not mark a novel complete while user intervention is required', async () => {
    const fixture = await createNovelRoot({
      failed_chapters: [3],
      requires_user_intervention: true,
      pause_reason: '독자 몰입 회귀 감지: critical',
      last_gate: {
        chapter: 3,
        status: 'USER_INTERVENTION',
        passed: false,
        should_retry: false,
        strategy: 'user_intervention',
        score: 91,
        blocking_reasons: ['독자 몰입 회귀 감지: critical'],
      },
    });
    tempDirs.push(fixture.rootDir);
    await writeAssistantTranscript(fixture.transcriptPath, '<promise>NOVEL_DONE</promise>');

    const output = runActCompletion(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('user intervention');

    const state = await readJson(join(fixture.projectDir, 'meta', 'ralph-state.json'));
    expect(state.ralph_active).toBe(true);
    expect(state.act_complete).not.toBe(true);
    expect(state.requires_user_intervention).toBe(true);
  });

  it('marks an act complete when the latest gate passed and no failed chapters remain', async () => {
    const fixture = await createNovelRoot({
      current_chapter: 5,
      completed_chapters: [1, 2, 3, 4],
      last_gate: {
        chapter: 4,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 92,
        blocking_reasons: [],
      },
    });
    tempDirs.push(fixture.rootDir);
    await writeAssistantTranscript(fixture.transcriptPath, '<promise>ACT_1_DONE</promise>');

    const output = runActCompletion(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('approve');
    const state = await readJson(join(fixture.projectDir, 'meta', 'ralph-state.json'));
    expect(state.act_complete).toBe(true);
  });

  it('does not mark an act complete until every chapter in the act is complete', async () => {
    const fixture = await createNovelRoot({
      current_chapter: 2,
      completed_chapters: [1],
      last_gate: {
        chapter: 1,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 92,
        blocking_reasons: [],
      },
    });
    tempDirs.push(fixture.rootDir);
    await writeAssistantTranscript(fixture.transcriptPath, '<promise>ACT_1_DONE</promise>');

    const output = runActCompletion(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('act 1 incomplete');
    expect(output.reason).toContain('2, 3, 4');

    const state = await readJson(join(fixture.projectDir, 'meta', 'ralph-state.json'));
    expect(state.act_complete).not.toBe(true);
    expect(state.current_chapter).toBe(2);
  });

  it('uses plot structure act ranges instead of even chapter splitting', async () => {
    const fixture = await createNovelRoot({
      total_chapters: 50,
      total_acts: 3,
      current_chapter: 16,
      completed_chapters: Array.from({ length: 15 }, (_, index) => index + 1),
      last_gate: {
        chapter: 15,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 94,
        blocking_reasons: [],
      },
    });
    tempDirs.push(fixture.rootDir);
    await writePlotStructure(fixture.projectDir, [
      { act_number: 1, title: 'Setup', chapters: [1, 15] },
      { act_number: 2, title: 'Confrontation', chapters: [16, 40] },
      { act_number: 3, title: 'Resolution', chapters: [41, 50] },
    ]);
    await writeAssistantTranscript(fixture.transcriptPath, '<promise>ACT_1_DONE</promise>');

    const output = runActCompletion(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('approve');
    const state = await readJson(join(fixture.projectDir, 'meta', 'ralph-state.json'));
    expect(state.act_complete).toBe(true);
  });

  it('does not mark a novel complete until every chapter is complete', async () => {
    const fixture = await createNovelRoot({
      current_chapter: 5,
      completed_chapters: [1, 2, 3, 4],
      last_gate: {
        chapter: 4,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 93,
        blocking_reasons: [],
      },
    });
    tempDirs.push(fixture.rootDir);
    await writeAssistantTranscript(fixture.transcriptPath, '<promise>NOVEL_DONE</promise>');

    const output = runActCompletion(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('novel incomplete');
    expect(output.reason).toContain('5, 6, 7');

    const state = await readJson(join(fixture.projectDir, 'meta', 'ralph-state.json'));
    expect(state.ralph_active).toBe(true);
    expect(state.act_complete).not.toBe(true);
  });

  it('blocks stale act completion promises without advancing loop iteration', async () => {
    const fixture = await createNovelRoot({
      current_act: 2,
      current_chapter: 5,
      iteration: 7,
      completed_chapters: [1, 2, 3, 4],
      last_gate: {
        chapter: 4,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 94,
        blocking_reasons: [],
      },
    });
    tempDirs.push(fixture.rootDir);
    await writeAssistantTranscript(fixture.transcriptPath, '<promise>ACT_1_DONE</promise>');

    const output = runActCompletion(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('current act');
    expect(output.reason).toContain('2');

    const state = await readJson(join(fixture.projectDir, 'meta', 'ralph-state.json'));
    expect(state.act_complete).not.toBe(true);
    expect(state.current_act).toBe(2);
    expect(state.iteration).toBe(7);
  });

  it('pauses for user intervention instead of silently deactivating when max iterations are reached', async () => {
    const fixture = await createNovelRoot({
      current_chapter: 2,
      iteration: 3,
      max_iterations: 3,
      completed_chapters: [1],
      last_gate: {
        chapter: 1,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 92,
        blocking_reasons: [],
      },
    });
    tempDirs.push(fixture.rootDir);
    await writeAssistantTranscript(fixture.transcriptPath, '2화를 계속 집필 중입니다.');

    const output = runActCompletion(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('approve');
    expect(output.reason).toContain('MAX ITERATIONS');

    const state = await readJson(join(fixture.projectDir, 'meta', 'ralph-state.json'));
    expect(state.ralph_active).toBe(false);
    expect(state.requires_user_intervention).toBe(true);
    expect(state.can_resume).toBe(true);
    expect(state.pause_reason).toContain('max_iterations');
    expect(state.act_complete).not.toBe(true);
    expect(state.current_chapter).toBe(2);
    expect(state.completed_chapters).toEqual([1]);
  });
});
