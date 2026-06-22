import { afterEach, describe, expect, it } from 'vitest';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  applyChapterGateDecisionToState,
  applyChapterGateState,
  type RalphGateState,
} from '../../src/state/ralph-gate.js';
import type { ChapterGateDecision } from '../../src/retry/quality-gate.js';

function baseState(): RalphGateState {
  return {
    ralph_active: true,
    can_resume: true,
    current_chapter: 1,
    completed_chapters: [],
    failed_chapters: [],
    retry_count: 0,
  };
}

function decision(overrides: Partial<ChapterGateDecision>): ChapterGateDecision {
  return {
    status: 'PASS',
    passed: true,
    shouldRetry: false,
    strategy: 'none',
    score: 92,
    blockingReasons: [],
    retryPrompt: '',
    ...overrides,
  } as ChapterGateDecision;
}

describe('applyChapterGateDecisionToState', () => {
  it('normalizes contradictory PASS decisions before completing a chapter', () => {
    const updated = applyChapterGateDecisionToState(
      baseState(),
      1,
      decision({
        status: 'PASS',
        passed: false,
        shouldRetry: true,
        strategy: 'revise',
        blockingReasons: ['게이트 판정 불일치: PASS status with passed=false'],
        retryPrompt: '게이트 판정을 다시 계산하세요.',
      })
    );

    expect(updated.completed_chapters).toEqual([]);
    expect(updated.failed_chapters).toEqual([1]);
    expect(updated.current_chapter).toBe(1);
    expect(updated.retry_count).toBe(1);
    expect(updated.last_gate).toMatchObject({
      chapter: 1,
      status: 'RETRY',
      passed: false,
      should_retry: true,
    });
  });

  it('requires PASS decisions to disable retry before completing a chapter', () => {
    const updated = applyChapterGateDecisionToState(
      baseState(),
      1,
      decision({
        status: 'PASS',
        passed: true,
        shouldRetry: true,
        strategy: 'revise',
        blockingReasons: ['게이트 판정 불일치: PASS status with shouldRetry=true'],
        retryPrompt: '게이트 판정을 다시 계산하세요.',
      })
    );

    expect(updated.completed_chapters).toEqual([]);
    expect(updated.failed_chapters).toEqual([1]);
    expect(updated.current_chapter).toBe(1);
    expect(updated.retry_count).toBe(1);
    expect(updated.last_gate).toMatchObject({
      chapter: 1,
      status: 'RETRY',
      passed: false,
      should_retry: true,
    });
  });
});

describe('applyChapterGateState', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('rejects invalid Ralph state before writing the updated gate state', async () => {
    const projectDir = await mkdtemp(join(tmpdir(), 'ralph-gate-state-invalid-'));
    tempDirs.push(projectDir);
    await mkdir(join(projectDir, 'meta'), { recursive: true });
    const statePath = join(projectDir, 'meta', 'ralph-state.json');
    await writeFile(statePath, JSON.stringify({
      ralph_active: true,
      mode: 'write-all',
      current_chapter: 1,
      completed_chapters: [],
      failed_chapters: [],
      retry_count: 0,
      can_resume: true,
    }, null, 2));

    await expect(applyChapterGateState({
      projectDir,
      chapterNumber: 1,
      decision: decision({}),
    })).rejects.toThrow(/Invalid Ralph state schema/);

    const state = JSON.parse(await readFile(statePath, 'utf8'));
    expect(state).not.toHaveProperty('last_gate');
    expect(state.completed_chapters).toEqual([]);
    expect(state.current_chapter).toBe(1);
  });
});
