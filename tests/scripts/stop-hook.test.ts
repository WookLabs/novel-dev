import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const stopHookPath = join(root, 'hooks', 'stop.py');

async function writeJson(path: string, data: unknown): Promise<void> {
  await writeFile(path, JSON.stringify(data, null, 2));
}

async function createNovelRoot(state: Record<string, unknown>): Promise<{
  rootDir: string;
  projectDir: string;
  transcriptPath: string;
}> {
  const rootDir = await mkdtemp(join(tmpdir(), 'stop-hook-'));
  const projectDir = join(rootDir, 'novels', 'sample-project');
  await mkdir(join(projectDir, 'meta'), { recursive: true });
  await writeJson(join(projectDir, 'meta', 'project.json'), {
    id: 'sample-project',
    title: 'Sample',
    genre: 'mystery',
  });
  await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
    ralph_active: true,
    mode: 'write-all',
    current_act: 1,
    current_chapter: 1,
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

function runStopHook(rootDir: string, transcriptPath: string) {
  const result = spawnSync(
    'python',
    [stopHookPath],
    {
      cwd: root,
      input: JSON.stringify({ directory: rootDir, transcript_path: transcriptPath }),
      encoding: 'utf8',
    }
  );

  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
}

describe('stop hook chapter gate enforcement', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('blocks act completion promises when the latest chapter gate failed', async () => {
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

    const output = runStopHook(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('chapter gate');
    expect(output.reason).toContain('RETRY');
  });

  it('blocks novel completion promises while user intervention is required', async () => {
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

    const output = runStopHook(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('user intervention');
    expect(output.reason).toContain('critical');
  });

  it('blocks generic task completion promises while Ralph Loop is active', async () => {
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
    await writeAssistantTranscript(fixture.transcriptPath, '<promise>TASK_COMPLETE</promise>');

    const output = runStopHook(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('Generic completion promise');
    expect(output.reason).toContain('ACT_1_DONE');
    expect(output.reason).toContain('NOVEL_DONE');
  });

  it('allows act completion promises when the latest gate passed and there are no failed chapters', async () => {
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

    const output = runStopHook(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('approve');
  });

  it('blocks act completion promises until every chapter in the act is complete', async () => {
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

    const output = runStopHook(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('act 1 incomplete');
    expect(output.reason).toContain('2, 3, 4');
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

    const output = runStopHook(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('approve');
  });

  it('blocks novel completion promises until every chapter is complete', async () => {
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

    const output = runStopHook(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('novel incomplete');
    expect(output.reason).toContain('5, 6, 7');
  });

  it('blocks stale act completion promises that do not match the current act', async () => {
    const fixture = await createNovelRoot({
      current_act: 2,
      current_chapter: 5,
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

    const output = runStopHook(fixture.rootDir, fixture.transcriptPath);

    expect(output.decision).toBe('block');
    expect(output.reason).toContain('current act');
    expect(output.reason).toContain('2');
  });
});
