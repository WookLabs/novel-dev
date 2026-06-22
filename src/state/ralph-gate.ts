import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { ChapterGateDecision } from '../retry/quality-gate.js';
import { acquireLock } from './lock.js';
import { withStateBackup } from './backup.js';
import { assertValidRalphState } from './ralph-state-validation.js';

export interface ApplyChapterGateStateOptions {
  projectDir: string;
  chapterNumber: number;
  decision: ChapterGateDecision;
}

export interface RalphGateState {
  ralph_active?: boolean;
  can_resume?: boolean;
  current_chapter?: number;
  completed_chapters?: number[];
  failed_chapters?: number[];
  retry_count?: number;
  last_quality_score?: number | null;
  last_failure_reason?: string;
  requires_user_intervention?: boolean;
  pause_reason?: string;
  last_gate?: {
    chapter: number;
    status: string;
    passed: boolean;
    should_retry: boolean;
    strategy: string;
    score: number | null;
    blocking_reasons: string[];
    retry_prompt: string;
    decided_at: string;
  };
  last_checkpoint?: string;
  last_updated?: string;
  [key: string]: unknown;
}

/**
 * Persist a unified chapter gate decision into meta/ralph-state.json.
 */
export async function applyChapterGateState(
  options: ApplyChapterGateStateOptions
): Promise<RalphGateState> {
  const statePath = getRalphStatePath(options.projectDir);

  if (!existsSync(statePath)) {
    throw new Error(`Ralph state file not found: ${statePath}`);
  }

  const release = await acquireLock(statePath);
  try {
    return await withStateBackup(statePath, async () => {
      const state = JSON.parse(await fs.readFile(statePath, 'utf8')) as RalphGateState;
      const updated = applyChapterGateDecisionToState(
        state,
        options.chapterNumber,
        options.decision
      );
      assertValidRalphState(updated, statePath);
      await fs.writeFile(statePath, JSON.stringify(updated, null, 2));
      return updated;
    });
  } finally {
    await release();
  }
}

export async function loadRalphGateState(projectDir: string): Promise<RalphGateState | null> {
  const statePath = getRalphStatePath(projectDir);

  try {
    return JSON.parse(await fs.readFile(statePath, 'utf8')) as RalphGateState;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export function applyChapterGateDecisionToState(
  state: RalphGateState,
  chapterNumber: number,
  decision: ChapterGateDecision
): RalphGateState {
  const now = new Date().toISOString();
  const normalizedDecision = normalizeChapterGateDecision(decision);
  const updated: RalphGateState = {
    ...state,
    completed_chapters: [...(state.completed_chapters ?? [])],
    failed_chapters: [...(state.failed_chapters ?? [])],
    last_quality_score: normalizedDecision.score,
    last_checkpoint: now,
    last_updated: now,
    can_resume: true,
    last_gate: {
      chapter: chapterNumber,
      status: normalizedDecision.status,
      passed: normalizedDecision.passed,
      should_retry: normalizedDecision.shouldRetry,
      strategy: normalizedDecision.strategy,
      score: normalizedDecision.score,
      blocking_reasons: normalizedDecision.blockingReasons,
      retry_prompt: normalizedDecision.retryPrompt,
      decided_at: now,
    },
  };

  const gatePassed =
    normalizedDecision.status === 'PASS' &&
    normalizedDecision.passed === true &&
    normalizedDecision.shouldRetry === false &&
    normalizedDecision.blockingReasons.length === 0;

  if (gatePassed) {
    updated.completed_chapters = addSortedUnique(updated.completed_chapters, chapterNumber);
    updated.failed_chapters = removeNumber(updated.failed_chapters, chapterNumber);
    if ((updated.current_chapter ?? chapterNumber) <= chapterNumber) {
      updated.current_chapter = chapterNumber + 1;
    }
    updated.retry_count = 0;
    delete updated.last_failure_reason;
    if (state.requires_user_intervention === true) {
      updated.ralph_active = true;
    }
    delete updated.requires_user_intervention;
    delete updated.pause_reason;
    return updated;
  }

  const failureReason =
    normalizedDecision.blockingReasons.join('; ') ||
    `Chapter gate failed: ${normalizedDecision.status}`;

  updated.failed_chapters = addSortedUnique(updated.failed_chapters, chapterNumber);
  updated.completed_chapters = removeNumber(updated.completed_chapters, chapterNumber);
  if (!updated.current_chapter || updated.current_chapter > chapterNumber) {
    updated.current_chapter = chapterNumber;
  }
  updated.last_failure_reason = failureReason;

  if (normalizedDecision.shouldRetry) {
    updated.retry_count = (updated.retry_count ?? 0) + 1;
  } else {
    updated.requires_user_intervention = true;
    updated.pause_reason = failureReason;
    updated.ralph_active = false;
    updated.can_resume = true;
  }

  return updated;
}

function normalizeChapterGateDecision(decision: ChapterGateDecision): ChapterGateDecision {
  const blockingReasons = [...decision.blockingReasons];
  const isSuccessfulPass =
    decision.status === 'PASS' &&
    decision.passed === true &&
    decision.shouldRetry === false &&
    decision.strategy === 'none' &&
    blockingReasons.length === 0;

  if (isSuccessfulPass) {
    return {
      ...decision,
      blockingReasons,
    };
  }

  const shouldRetry = decision.shouldRetry === true;
  const status = shouldRetry ? 'RETRY' : 'USER_INTERVENTION';
  const strategy = shouldRetry
    ? decision.strategy === 'none' || decision.strategy === 'user_intervention'
      ? 'revise'
      : decision.strategy
    : 'user_intervention';

  return {
    ...decision,
    status,
    passed: false,
    shouldRetry,
    strategy,
    blockingReasons:
      blockingReasons.length > 0
        ? blockingReasons
        : [
            `Chapter gate decision inconsistent: status=${decision.status}, passed=${decision.passed}, shouldRetry=${decision.shouldRetry}`,
          ],
  };
}

function getRalphStatePath(projectDir: string): string {
  return path.join(path.resolve(projectDir), 'meta', 'ralph-state.json');
}

function addSortedUnique(values: number[] = [], value: number): number[] {
  return [...new Set([...values, value])].sort((a, b) => a - b);
}

function removeNumber(values: number[] = [], value: number): number[] {
  return values.filter(item => item !== value);
}
