export const VALID_RALPH_MODES = new Set([
  'writing',
  'revising',
  'evaluating',
  'validating',
  'write-all',
  'idle',
]);

export const INVALID_RALPH_STATE = 'INVALID_RALPH_STATE';

const NOVEL_ID_PATTERN = /^novel_\d{8}_\d{6}$/;
const RETRY_STRATEGIES = new Set(['revise', 'revise_with_feedback', 'partial_rewrite']);
const GATE_STATUSES = new Set(['PASS', 'RETRY', 'USER_INTERVENTION']);
const ACTIVE_VALIDATORS = new Set(['critic', 'beta-reader', 'genre-validator']);

export function assertValidRalphState(state, path = 'Ralph state') {
  const errors = [];

  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    errors.push('state_object');
  } else {
    validateScalarFields(state, errors);
    validateChapterLists(state, errors);
    validateLastSafeChapterProgress(state, errors);
    validateLastGate(state, errors);

    if (state.can_resume === true && state.mode === 'write-all' && !isRecoverableWriteAllState(state)) {
      errors.push('recoverable_write_all_fields');
    }
  }

  if (errors.length > 0) {
    const error = new Error(`Invalid Ralph state schema at ${path}: ${errors.join(', ')}`);
    error.code = INVALID_RALPH_STATE;
    throw error;
  }
}

export function isRecoverableWriteAllState(state) {
  return (
    typeof state.project_id === 'string' &&
    state.project_id.length > 0 &&
    Number.isInteger(state.current_act) &&
    state.current_act >= 1 &&
    Number.isInteger(state.current_chapter) &&
    state.current_chapter >= 1 &&
    Number.isInteger(state.last_safe_chapter) &&
    state.last_safe_chapter >= 0
  );
}

function validateScalarFields(state, errors) {
  if (state.schema_version !== undefined && state.schema_version !== '2.0') {
    errors.push('schema_version');
  }
  if (typeof state.novel_id !== 'string' || !NOVEL_ID_PATTERN.test(state.novel_id)) {
    errors.push('novel_id');
  }
  if (!VALID_RALPH_MODES.has(state.mode)) {
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
    (!Number.isInteger(state.quality_retries) || state.quality_retries < 0 || state.quality_retries > 3)
  ) {
    errors.push('quality_retries');
  }
  if (
    state.retry_count !== undefined &&
    (!Number.isInteger(state.retry_count) || state.retry_count < 0 || state.retry_count > 3)
  ) {
    errors.push('retry_count');
  }
  if (
    state.quality_threshold !== undefined &&
    (!Number.isInteger(state.quality_threshold) ||
      state.quality_threshold < 95 ||
      state.quality_threshold > 100)
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
      state.validators.some(validator => typeof validator !== 'string' || !ACTIVE_VALIDATORS.has(validator)))
  ) {
    errors.push('validators');
  }
}

function validateChapterLists(state, errors) {
  validateChapterList(state.completed_chapters, 'completed_chapters', errors);
  validateChapterList(state.failed_chapters, 'failed_chapters', errors);
  validateChapterStatusListsDoNotOverlap(state, errors);
}

function validateChapterList(value, field, errors) {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.some(chapter => !Number.isInteger(chapter) || chapter < 1)) {
    errors.push(field);
    return;
  }
  if (new Set(value).size !== value.length) {
    errors.push(`${field}.unique`);
  }
}

function validateChapterStatusListsDoNotOverlap(state, errors) {
  if (!isValidChapterList(state.completed_chapters) || !isValidChapterList(state.failed_chapters)) {
    return;
  }

  const failed = new Set(state.failed_chapters);
  if (state.completed_chapters.some(chapter => failed.has(chapter))) {
    errors.push('chapter_status_overlap');
  }
}

function isValidChapterList(value) {
  return Array.isArray(value) && value.every(chapter => Number.isInteger(chapter) && chapter >= 1);
}

function validateLastSafeChapterProgress(state, errors) {
  if (
    !Number.isInteger(state.current_chapter) ||
    !Number.isInteger(state.last_safe_chapter) ||
    state.last_safe_chapter < 0
  ) {
    return;
  }

  if (state.last_safe_chapter > state.current_chapter) {
    errors.push('last_safe_chapter.current_chapter');
  }

  if (state.last_safe_chapter === 0 || !isValidChapterList(state.completed_chapters)) {
    return;
  }

  const completed = new Set(state.completed_chapters);
  for (let chapter = 1; chapter <= state.last_safe_chapter; chapter += 1) {
    if (!completed.has(chapter)) {
      errors.push('last_safe_chapter.completed_chapters');
      return;
    }
  }
}

function validateLastGate(state, errors) {
  const gate = state.last_gate;
  if (gate === undefined) return;
  if (!gate || typeof gate !== 'object' || Array.isArray(gate)) {
    errors.push('last_gate');
    return;
  }

  requireIntegerAtLeast(gate.chapter, 1, 'last_gate.chapter', errors);
  if (!GATE_STATUSES.has(gate.status)) {
    errors.push('last_gate.status');
    return;
  }
  if (typeof gate.passed !== 'boolean') errors.push('last_gate.passed');
  if (typeof gate.should_retry !== 'boolean') errors.push('last_gate.should_retry');
  if (typeof gate.strategy !== 'string') errors.push('last_gate.strategy');
  if (!Array.isArray(gate.blocking_reasons)) errors.push('last_gate.blocking_reasons');
  if (
    gate.score !== undefined &&
    gate.score !== null &&
    (typeof gate.score !== 'number' || !Number.isFinite(gate.score) || gate.score < 0 || gate.score > 100)
  ) {
    errors.push('last_gate.score');
  }

  if (gate.status === 'PASS') {
    if (gate.passed !== true) errors.push('last_gate.pass.passed');
    if (gate.should_retry !== false) errors.push('last_gate.pass.should_retry');
    if (gate.strategy !== 'none') errors.push('last_gate.pass.strategy');
    if (Array.isArray(gate.blocking_reasons) && gate.blocking_reasons.length > 0) {
      errors.push('last_gate.pass.blocking_reasons');
    }
    if (
      Number.isInteger(gate.chapter) &&
      isValidChapterList(state.completed_chapters) &&
      !state.completed_chapters.includes(gate.chapter)
    ) {
      errors.push('last_gate.pass.completed_chapters');
    }
  }

  if (gate.status === 'RETRY') {
    if (gate.passed !== false) errors.push('last_gate.retry.passed');
    if (gate.should_retry !== true) errors.push('last_gate.retry.should_retry');
    if (!RETRY_STRATEGIES.has(gate.strategy)) errors.push('last_gate.retry.strategy');
    validateFailedLastGateChapter(state, gate, errors);
  }

  if (gate.status === 'USER_INTERVENTION') {
    if (gate.passed !== false) errors.push('last_gate.user_intervention.passed');
    if (gate.should_retry !== false) errors.push('last_gate.user_intervention.should_retry');
    if (gate.strategy !== 'user_intervention') errors.push('last_gate.user_intervention.strategy');
    validateFailedLastGateChapter(state, gate, errors);
  }
}

function validateFailedLastGateChapter(state, gate, errors) {
  if (
    Number.isInteger(gate.chapter) &&
    isValidChapterList(state.failed_chapters) &&
    !state.failed_chapters.includes(gate.chapter)
  ) {
    errors.push('last_gate.failure.failed_chapters');
  }
}

function requireIntegerAtLeast(value, minimum, field, errors) {
  if (!Number.isInteger(value) || value < minimum) {
    errors.push(field);
  }
}

function optionalIntegerAtLeast(value, minimum, field, errors) {
  if (value !== undefined && (!Number.isInteger(value) || value < minimum)) {
    errors.push(field);
  }
}
