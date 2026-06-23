import { describe, expect, it } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { assertValidRalphState as assertValidTypescriptRalphState } from '../../src/state/ralph-state-validation.js';

const root = process.cwd();

function compileRalphStateSchema() {
  const schema = JSON.parse(
    readFileSync(join(root, 'schemas', 'ralph-state.schema.json'), 'utf-8')
  );
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv.compile(schema);
}

function baseState(overrides: Record<string, unknown> = {}) {
  return {
    schema_version: '2.0',
    novel_id: 'novel_20260618_233000',
    mode: 'writing',
    current_chapter: 1,
    last_safe_chapter: 0,
    ...overrides,
  };
}

async function loadScriptRalphStateValidator() {
  const module = await import(
    pathToFileURL(join(root, 'scripts', 'lib', 'ralph-state-validation.mjs')).href
  );
  return module.assertValidRalphState as (state: unknown, path?: string) => void;
}

describe('ralph-state schema', () => {
  it('rejects contradictory PASS gate verdicts with passed=false', () => {
    const validate = compileRalphStateSchema();

    const valid = validate(
      baseState({
        last_gate: {
          chapter: 1,
          status: 'PASS',
          passed: false,
          should_retry: true,
          strategy: 'revise',
          score: 92,
          blocking_reasons: ['게이트 판정 불일치'],
          decided_at: '2026-06-18T14:30:00.000Z',
        },
      })
    );

    expect(valid).toBe(false);
  });

  it('rejects PASS gate verdicts that still request retry', () => {
    const validate = compileRalphStateSchema();

    const valid = validate(
      baseState({
        last_gate: {
          chapter: 1,
          status: 'PASS',
          passed: true,
          should_retry: true,
          strategy: 'revise',
          score: 92,
          blocking_reasons: ['게이트 판정 불일치'],
          decided_at: '2026-06-18T14:30:00.000Z',
        },
      })
    );

    expect(valid).toBe(false);
  });

  it('rejects retry gate verdicts without should_retry=true', () => {
    const validate = compileRalphStateSchema();

    const valid = validate(
      baseState({
        last_gate: {
          chapter: 1,
          status: 'RETRY',
          passed: false,
          should_retry: false,
          strategy: 'revise',
          score: 76,
          blocking_reasons: ['독자 몰입 계약 실패'],
          decided_at: '2026-06-18T14:35:00.000Z',
        },
      })
    );

    expect(valid).toBe(false);
  });

  it('accepts consistent PASS and retry gate verdicts', () => {
    const validate = compileRalphStateSchema();

    expect(
      validate(
        baseState({
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
        })
      )
    ).toBe(true);

    expect(
      validate(
        baseState({
          last_gate: {
            chapter: 1,
            status: 'RETRY',
            passed: false,
            should_retry: true,
            strategy: 'revise',
            score: 76,
            blocking_reasons: ['독자 몰입 계약 실패'],
            decided_at: '2026-06-18T14:35:00.000Z',
          },
        })
      )
    ).toBe(true);
  });

  it('keeps runtime validators aligned with schema for gate score bounds', async () => {
    const validate = compileRalphStateSchema();
    const state = baseState({
      last_gate: {
        chapter: 1,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 101,
        blocking_reasons: [],
        decided_at: '2026-06-18T14:30:00.000Z',
      },
    });

    expect(validate(state)).toBe(false);
    expect(() => assertValidTypescriptRalphState(state)).toThrow(/score/);

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(/score/);
  });

  it('keeps runtime validators aligned with schema for quality threshold bounds', async () => {
    const validate = compileRalphStateSchema();
    const state = baseState({
      quality_threshold: 101,
    });

    expect(validate(state)).toBe(false);
    expect(() => assertValidTypescriptRalphState(state)).toThrow(/quality_threshold/);

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(/quality_threshold/);
  });

  it('rejects quality thresholds below the 95 point masterpiece bar', async () => {
    const validate = compileRalphStateSchema();
    const belowMasterpiece = baseState({
      quality_threshold: 94,
    });
    const atMasterpiece = baseState({
      quality_threshold: 95,
    });

    expect(validate(belowMasterpiece)).toBe(false);
    expect(() => assertValidTypescriptRalphState(belowMasterpiece)).toThrow(/quality_threshold/);

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(belowMasterpiece)).toThrow(/quality_threshold/);

    expect(validate(atMasterpiece)).toBe(true);
    expect(() => assertValidTypescriptRalphState(atMasterpiece)).not.toThrow();
    expect(() => assertValidScriptRalphState(atMasterpiece)).not.toThrow();
  });

  it('keeps runtime validators aligned with schema for retry count bounds', async () => {
    const validate = compileRalphStateSchema();
    const state = baseState({
      retry_count: 4,
    });

    expect(validate(state)).toBe(false);
    expect(() => assertValidTypescriptRalphState(state)).toThrow(/retry_count/);

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(/retry_count/);
  });

  it('keeps runtime validators aligned with schema for chapter list bounds', async () => {
    const validate = compileRalphStateSchema();
    const state = baseState({
      completed_chapters: [0],
      failed_chapters: [1],
    });

    expect(validate(state)).toBe(false);
    expect(() => assertValidTypescriptRalphState(state)).toThrow(/completed_chapters/);

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(/completed_chapters/);
  });

  it('keeps runtime validators aligned with schema for duplicate chapter list entries', async () => {
    const validate = compileRalphStateSchema();
    const state = baseState({
      completed_chapters: [1, 1],
      failed_chapters: [],
    });

    expect(validate(state)).toBe(false);
    expect(() => assertValidTypescriptRalphState(state)).toThrow(/completed_chapters/);

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(/completed_chapters/);
  });

  it('rejects chapters that are both completed and failed at runtime', async () => {
    const state = baseState({
      completed_chapters: [1, 2],
      failed_chapters: [2],
    });

    expect(() => assertValidTypescriptRalphState(state)).toThrow(/chapter_status_overlap/);

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(/chapter_status_overlap/);
  });

  it('rejects PASS last gates that are missing from completed chapters at runtime', async () => {
    const state = baseState({
      completed_chapters: [],
      failed_chapters: [],
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

    expect(() => assertValidTypescriptRalphState(state)).toThrow(
      /last_gate\.pass\.completed_chapters/
    );

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(
      /last_gate\.pass\.completed_chapters/
    );
  });

  it('rejects failed last gates that are missing from failed chapters at runtime', async () => {
    const retryState = baseState({
      completed_chapters: [],
      failed_chapters: [],
      last_gate: {
        chapter: 1,
        status: 'RETRY',
        passed: false,
        should_retry: true,
        strategy: 'revise',
        score: 76,
        blocking_reasons: ['독자 몰입 계약 실패'],
        decided_at: '2026-06-18T14:35:00.000Z',
      },
    });
    const interventionState = baseState({
      completed_chapters: [],
      failed_chapters: [],
      last_gate: {
        chapter: 1,
        status: 'USER_INTERVENTION',
        passed: false,
        should_retry: false,
        strategy: 'user_intervention',
        score: 61,
        blocking_reasons: ['재시도 한도 초과'],
        decided_at: '2026-06-18T14:40:00.000Z',
      },
    });

    expect(() => assertValidTypescriptRalphState(retryState)).toThrow(
      /last_gate\.failure\.failed_chapters/
    );
    expect(() => assertValidTypescriptRalphState(interventionState)).toThrow(
      /last_gate\.failure\.failed_chapters/
    );

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(retryState)).toThrow(
      /last_gate\.failure\.failed_chapters/
    );
    expect(() => assertValidScriptRalphState(interventionState)).toThrow(
      /last_gate\.failure\.failed_chapters/
    );
  });

  it('rejects last_safe_chapter values beyond the current chapter at runtime', async () => {
    const state = baseState({
      current_chapter: 2,
      last_safe_chapter: 3,
      completed_chapters: [1, 2, 3],
      failed_chapters: [],
    });

    expect(() => assertValidTypescriptRalphState(state)).toThrow(
      /last_safe_chapter\.current_chapter/
    );

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(
      /last_safe_chapter\.current_chapter/
    );
  });

  it('rejects last_safe_chapter values not backed by completed chapter gates at runtime', async () => {
    const state = baseState({
      current_chapter: 3,
      last_safe_chapter: 2,
      completed_chapters: [1],
      failed_chapters: [],
    });

    expect(() => assertValidTypescriptRalphState(state)).toThrow(
      /last_safe_chapter\.completed_chapters/
    );

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(
      /last_safe_chapter\.completed_chapters/
    );
  });

  it('keeps runtime validators aligned with schema for resumable write-all state fields', async () => {
    const validate = compileRalphStateSchema();
    const state = baseState({
      mode: 'write-all',
      can_resume: true,
      current_act: 1,
    });

    expect(validate(state)).toBe(false);
    expect(() => assertValidTypescriptRalphState(state)).toThrow(/recoverable_write_all_fields/);

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(/recoverable_write_all_fields/);
  });

  it('keeps runtime validators aligned with schema for validator names', async () => {
    const validate = compileRalphStateSchema();
    const state = baseState({
      validators: ['critic', 'unknown-validator'],
    });

    expect(validate(state)).toBe(false);
    expect(() => assertValidTypescriptRalphState(state)).toThrow(/validators/);

    const assertValidScriptRalphState = await loadScriptRalphStateValidator();
    expect(() => assertValidScriptRalphState(state)).toThrow(/validators/);
  });
});
