export const INVALID_RALPH_STATE = 'INVALID_RALPH_STATE';

const VALID_RALPH_MODES = new Set([
  'writing',
  'revising',
  'evaluating',
  'validating',
  'write-all',
  'idle',
]);
const NOVEL_ID_PATTERN = /^novel_\d{8}_\d{6}$/;
const RETRY_STRATEGIES = new Set(['revise', 'revise_with_feedback', 'partial_rewrite']);
const GATE_STATUSES = new Set(['PASS', 'RETRY', 'USER_INTERVENTION']);
const ACTIVE_VALIDATORS = new Set(['critic', 'beta-reader', 'genre-validator']);

export function assertValidRalphState(state: unknown, statePath = 'Ralph state'): void {
  const errors: string[] = [];

  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    errors.push('state_object');
  } else {
    const value = state as Record<string, unknown>;
    validateScalarFields(value, errors);
    validateChapterLists(value, errors);
    validateLastSafeChapterProgress(value, errors);
    validateLastGate(value, errors);

    if (
      value.can_resume === true &&
      value.mode === 'write-all' &&
      !isRecoverableWriteAllState(value)
    ) {
      errors.push('recoverable_write_all_fields');
    }
  }

  if (errors.length > 0) {
    const error = new Error(`Invalid Ralph state schema at ${statePath}: ${errors.join(', ')}`);
    (error as Error & { code?: string }).code = INVALID_RALPH_STATE;
    throw error;
  }
}

export function isRecoverableWriteAllState(state: Record<string, unknown>): boolean {
  return (
    typeof state.project_id === 'string' &&
    state.project_id.length > 0 &&
    Number.isInteger(state.current_act) &&
    Number(state.current_act) >= 1 &&
    Number.isInteger(state.current_chapter) &&
    Number(state.current_chapter) >= 1 &&
    Number.isInteger(state.last_safe_chapter) &&
    Number(state.last_safe_chapter) >= 0
  );
}

function validateScalarFields(state: Record<string, unknown>, errors: string[]): void {
  if (state.schema_version !== undefined && state.schema_version !== '2.0') {
    errors.push('schema_version');
  }
  if (typeof state.novel_id !== 'string' || !NOVEL_ID_PATTERN.test(state.novel_id)) {
    errors.push('novel_id');
  }
  if (typeof state.mode !== 'string' || !VALID_RALPH_MODES.has(state.mode)) {
    errors.push('mode');
  }
  requireIntegerAtLeast(state.current_chapter, 1, 'current_chapter', errors);
  requireIntegerAtLeast(state.last_safe_chapter, 0, 'last_safe_chapter', errors);
  optionalIntegerAtLeast(state.current_act, 1, 'current_act', errors);
  optionalIntegerAtLeast(state.total_acts, 1, 'total_acts', errors);
  optionalIntegerAtLeast(state.total_chapters, 1, 'total_chapters', errors);
  optionalIntegerAtLeast(state.iteration, 1, 'iteration', errors);
  optionalIntegerAtLeast(state.max_iterations, 1, 'max_iterations', errors);

  if (
    state.quality_retries !== undefined &&
    (!Number.isInteger(state.quality_retries) ||
      Number(state.quality_retries) < 0 ||
      Number(state.quality_retries) > 3)
  ) {
    errors.push('quality_retries');
  }
  if (
    state.retry_count !== undefined &&
    (!Number.isInteger(state.retry_count) ||
      Number(state.retry_count) < 0 ||
      Number(state.retry_count) > 3)
  ) {
    errors.push('retry_count');
  }
  if (
    state.quality_threshold !== undefined &&
    (!Number.isInteger(state.quality_threshold) ||
      Number(state.quality_threshold) < 95 ||
      Number(state.quality_threshold) > 100)
  ) {
    errors.push('quality_threshold');
  }
  if (state.ralph_active !== undefined && typeof state.ralph_active !== 'boolean') {
    errors.push('ralph_active');
  }
  if (state.can_resume !== undefined && typeof state.can_resume !== 'boolean') {
    errors.push('can_resume');
  }
  if (
    state.validators !== undefined &&
    (!Array.isArray(state.validators) ||
      state.validators.some(
        validator => typeof validator !== 'string' || !ACTIVE_VALIDATORS.has(validator)
      ))
  ) {
    errors.push('validators');
  }
}

function validateChapterLists(state: Record<string, unknown>, errors: string[]): void {
  validateChapterList(state.completed_chapters, 'completed_chapters', errors);
  validateChapterList(state.failed_chapters, 'failed_chapters', errors);
  validateChapterStatusListsDoNotOverlap(state, errors);
}

function validateChapterList(value: unknown, field: string, errors: string[]): void {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.some(chapter => !Number.isInteger(chapter) || chapter < 1)) {
    errors.push(field);
    return;
  }
  if (new Set(value).size !== value.length) {
    errors.push(`${field}.unique`);
  }
}

function validateChapterStatusListsDoNotOverlap(
  state: Record<string, unknown>,
  errors: string[]
): void {
  if (!isValidChapterList(state.completed_chapters) || !isValidChapterList(state.failed_chapters)) {
    return;
  }

  const failed = new Set(state.failed_chapters);
  if (state.completed_chapters.some(chapter => failed.has(chapter))) {
    errors.push('chapter_status_overlap');
  }
}

function isValidChapterList(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(chapter => Number.isInteger(chapter) && chapter >= 1);
}

function validateLastSafeChapterProgress(
  state: Record<string, unknown>,
  errors: string[]
): void {
  if (
    !Number.isInteger(state.current_chapter) ||
    !Number.isInteger(state.last_safe_chapter) ||
    Number(state.last_safe_chapter) < 0
  ) {
    return;
  }

  const currentChapter = Number(state.current_chapter);
  const lastSafeChapter = Number(state.last_safe_chapter);

  if (lastSafeChapter > currentChapter) {
    errors.push('last_safe_chapter.current_chapter');
  }

  if (lastSafeChapter === 0 || !isValidChapterList(state.completed_chapters)) {
    return;
  }

  const completed = new Set(state.completed_chapters);
  for (let chapter = 1; chapter <= lastSafeChapter; chapter += 1) {
    if (!completed.has(chapter)) {
      errors.push('last_safe_chapter.completed_chapters');
      return;
    }
  }
}

function validateLastGate(state: Record<string, unknown>, errors: string[]): void {
  const gate = state.last_gate;
  if (gate === undefined) return;
  if (!gate || typeof gate !== 'object' || Array.isArray(gate)) {
    errors.push('last_gate');
    return;
  }

  const value = gate as Record<string, unknown>;
  requireIntegerAtLeast(value.chapter, 1, 'last_gate.chapter', errors);
  if (typeof value.status !== 'string' || !GATE_STATUSES.has(value.status)) {
    errors.push('last_gate.status');
    return;
  }
  if (typeof value.passed !== 'boolean') errors.push('last_gate.passed');
  if (typeof value.should_retry !== 'boolean') errors.push('last_gate.should_retry');
  if (typeof value.strategy !== 'string') errors.push('last_gate.strategy');
  if (!Array.isArray(value.blocking_reasons)) errors.push('last_gate.blocking_reasons');
  if (
    value.score !== undefined &&
    value.score !== null &&
    (typeof value.score !== 'number' ||
      !Number.isFinite(value.score) ||
      value.score < 0 ||
      value.score > 100)
  ) {
    errors.push('last_gate.score');
  }

  if (value.status === 'PASS') {
    if (value.passed !== true) errors.push('last_gate.pass.passed');
    if (value.should_retry !== false) errors.push('last_gate.pass.should_retry');
    if (value.strategy !== 'none') errors.push('last_gate.pass.strategy');
    if (Array.isArray(value.blocking_reasons) && value.blocking_reasons.length > 0) {
      errors.push('last_gate.pass.blocking_reasons');
    }
    if (
      Number.isInteger(value.chapter) &&
      isValidChapterList(state.completed_chapters) &&
      !state.completed_chapters.includes(Number(value.chapter))
    ) {
      errors.push('last_gate.pass.completed_chapters');
    }
  }

  if (value.status === 'RETRY') {
    if (value.passed !== false) errors.push('last_gate.retry.passed');
    if (value.should_retry !== true) errors.push('last_gate.retry.should_retry');
    if (typeof value.strategy !== 'string' || !RETRY_STRATEGIES.has(value.strategy)) {
      errors.push('last_gate.retry.strategy');
    }
    validateFailedLastGateChapter(state, value, errors);
  }

  if (value.status === 'USER_INTERVENTION') {
    if (value.passed !== false) errors.push('last_gate.user_intervention.passed');
    if (value.should_retry !== false) errors.push('last_gate.user_intervention.should_retry');
    if (value.strategy !== 'user_intervention') {
      errors.push('last_gate.user_intervention.strategy');
    }
    validateFailedLastGateChapter(state, value, errors);
  }
}

function validateFailedLastGateChapter(
  state: Record<string, unknown>,
  gate: Record<string, unknown>,
  errors: string[]
): void {
  if (
    Number.isInteger(gate.chapter) &&
    isValidChapterList(state.failed_chapters) &&
    !state.failed_chapters.includes(Number(gate.chapter))
  ) {
    errors.push('last_gate.failure.failed_chapters');
  }
}

function requireIntegerAtLeast(
  value: unknown,
  minimum: number,
  field: string,
  errors: string[]
): void {
  if (!Number.isInteger(value) || Number(value) < minimum) {
    errors.push(field);
  }
}

function optionalIntegerAtLeast(
  value: unknown,
  minimum: number,
  field: string,
  errors: string[]
): void {
  if (value !== undefined && (!Number.isInteger(value) || Number(value) < minimum)) {
    errors.push(field);
  }
}
