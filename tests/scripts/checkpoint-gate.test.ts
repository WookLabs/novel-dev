import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs, readFileSync } from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

async function readState(projectDir: string) {
  const content = await fs.readFile(path.join(projectDir, 'meta', 'ralph-state.json'), 'utf-8');
  return JSON.parse(content);
}

describe('applyChapterGateDecision', () => {
  let projectDir: string;

  beforeEach(async () => {
    projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'checkpoint-gate-test-'));
  });

  afterEach(async () => {
    if (projectDir) {
      await fs.rm(projectDir, { recursive: true, force: true });
    }
  });

  it('should initialize write-all state that conforms to the Ralph state schema', async () => {
    const root = path.resolve('.');
    const checkpointPath = path.join(root, 'scripts', 'checkpoint.mjs');
    const script = `
      import { pathToFileURL } from 'url';
      const checkpoint = await import(pathToFileURL(${JSON.stringify(checkpointPath)}).href);
      await checkpoint.initWriteAllCheckpoint(${JSON.stringify(projectDir)}, {
        totalChapters: 12,
        totalActs: 3,
        projectId: 'novel_20260618_233000'
      });
    `;

    execFileSync(process.execPath, ['--input-type=module'], {
      input: script,
      cwd: root,
      encoding: 'utf-8',
    });

    const state = await readState(projectDir);
    const schemaErrors = validateRalphState(state);

    expect(schemaErrors).toEqual([]);
    expect(state).toMatchObject({
      schema_version: '2.0',
      novel_id: 'novel_20260618_233000',
      project_id: 'novel_20260618_233000',
      mode: 'write-all',
      last_safe_chapter: 0,
    });
  });

  it('should reject invalid Ralph state before saveCheckpoint writes a file', async () => {
    const root = path.resolve('.');
    const checkpointPath = path.join(root, 'scripts', 'checkpoint.mjs');
    const script = `
      import { pathToFileURL } from 'url';
      const checkpoint = await import(pathToFileURL(${JSON.stringify(checkpointPath)}).href);
      try {
        await checkpoint.saveCheckpoint(${JSON.stringify(projectDir)}, {
          schema_version: '2.0',
          novel_id: 'bad-id',
          mode: 'write-all',
          current_act: 0,
          current_chapter: 0,
          last_safe_chapter: -1,
          can_resume: true
        });
      } catch {
        process.exit(42);
      }
    `;

    expect(() => execFileSync(process.execPath, ['--input-type=module'], {
      input: script,
      cwd: root,
      encoding: 'utf-8',
    })).toThrow();

    await expect(
      fs.access(path.join(projectDir, 'meta', 'ralph-state.json'))
    ).rejects.toThrow();
  });

  it('should reject invalid Ralph state before writeState writes a file', async () => {
    const root = path.resolve('.');
    const stateUtilsPath = path.join(root, 'scripts', 'lib', 'state-utils.mjs');
    const script = `
      import { pathToFileURL } from 'url';
      const stateUtils = await import(pathToFileURL(${JSON.stringify(stateUtilsPath)}).href);
      try {
        stateUtils.writeState(${JSON.stringify(projectDir)}, {
          schema_version: '2.0',
          novel_id: 'bad-id',
          mode: 'write-all',
          current_act: 0,
          current_chapter: 0,
          last_safe_chapter: -1,
          can_resume: true
        });
      } catch {
        process.exit(42);
      }
    `;

    expect(() => execFileSync(process.execPath, ['--input-type=module'], {
      input: script,
      cwd: root,
      encoding: 'utf-8',
    })).toThrow();

    await expect(
      fs.access(path.join(projectDir, 'meta', 'ralph-state.json'))
    ).rejects.toThrow();
  });

  it('should mark chapter complete and persist the gate verdict when all gates pass', async () => {
    await runGateDecision(projectDir, {
      status: 'PASS',
      passed: true,
      shouldRetry: false,
      strategy: 'none',
      blockingReasons: [],
      retryPrompt: '',
      score: 92,
    });

    const state = await readState(projectDir);

    expect(state.completed_chapters).toEqual([1]);
    expect(state.failed_chapters).toEqual([]);
    expect(state.current_chapter).toBe(2);
    expect(state.retry_count).toBe(0);
    expect(state.last_quality_score).toBe(92);
    expect(state.last_gate).toMatchObject({
      chapter: 1,
      status: 'PASS',
      passed: true,
      strategy: 'none',
      score: 92,
      blocking_reasons: [],
    });
  });

  it('should keep the chapter open and increment retries when the gate requests retry', async () => {
    await runGateDecision(projectDir, {
      status: 'RETRY',
      passed: false,
      shouldRetry: true,
      strategy: 'revise',
      blockingReasons: ['독자 몰입 계약 실패: 68점'],
      retryPrompt: '독자 몰입 계약을 복구하세요.',
      score: 95,
    });

    const state = await readState(projectDir);

    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
    expect(state.retry_count).toBe(1);
    expect(state.ralph_active).toBe(true);
    expect(state.last_failure_reason).toContain('독자 몰입 계약 실패');
    expect(state.last_gate).toMatchObject({
      chapter: 1,
      status: 'RETRY',
      should_retry: true,
      strategy: 'revise',
      blocking_reasons: ['독자 몰입 계약 실패: 68점'],
    });
  });

  it('should pause Ralph Loop when the gate requires user intervention', async () => {
    await runGateDecision(projectDir, {
      status: 'USER_INTERVENTION',
      passed: false,
      shouldRetry: false,
      strategy: 'user_intervention',
      blockingReasons: ['독자 몰입 회귀 감지: critical'],
      retryPrompt: '수동 개입이 필요합니다.',
      score: 91,
    });

    const state = await readState(projectDir);

    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
    expect(state.ralph_active).toBe(false);
    expect(state.can_resume).toBe(true);
    expect(state.requires_user_intervention).toBe(true);
    expect(state.pause_reason).toContain('독자 몰입 회귀 감지');
    expect(state.last_gate.status).toBe('USER_INTERVENTION');
  });

  it('should normalize a contradictory PASS verdict with passed=false before persisting', async () => {
    await runGateDecision(projectDir, {
      status: 'PASS',
      passed: false,
      shouldRetry: true,
      strategy: 'revise',
      blockingReasons: ['게이트 판정 불일치: PASS status with passed=false'],
      retryPrompt: '게이트 판정을 다시 계산하세요.',
      score: 92,
    });

    const state = await readState(projectDir);

    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
    expect(state.retry_count).toBe(1);
    expect(state.last_gate).toMatchObject({
      chapter: 1,
      status: 'RETRY',
      passed: false,
      should_retry: true,
    });
  });

  it('should normalize a contradictory PASS verdict that still asks for retry', async () => {
    await runGateDecision(projectDir, {
      status: 'PASS',
      passed: true,
      shouldRetry: true,
      strategy: 'revise',
      blockingReasons: ['게이트 판정 불일치: PASS status with shouldRetry=true'],
      retryPrompt: '게이트 판정을 다시 계산하세요.',
      score: 94,
    });

    const state = await readState(projectDir);

    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
    expect(state.retry_count).toBe(1);
    expect(state.last_gate).toMatchObject({
      chapter: 1,
      status: 'RETRY',
      passed: false,
      should_retry: true,
    });
  });
});

async function runGateDecision(projectDir: string, decision: object) {
  const root = path.resolve('.');
  const checkpointPath = path.join(root, 'scripts', 'checkpoint.mjs');
  const script = `
    import { pathToFileURL } from 'url';
    const checkpoint = await import(pathToFileURL(${JSON.stringify(checkpointPath)}).href);
    await checkpoint.initWriteAllCheckpoint(${JSON.stringify(projectDir)}, {
      totalChapters: 12,
      totalActs: 3,
      projectId: 'novel_20260618_233000'
    });
    await checkpoint.applyChapterGateDecision(${JSON.stringify(projectDir)}, 1, ${JSON.stringify(decision)});
  `;

  execFileSync(process.execPath, ['--input-type=module'], {
    input: script,
    cwd: root,
    encoding: 'utf-8',
  });
}

function validateRalphState(state: unknown): string[] {
  const root = path.resolve('.');
  const schema = JSON.parse(
    readFileSync(path.join(root, 'schemas', 'ralph-state.schema.json'), 'utf-8')
  );
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  if (validate(state)) {
    return [];
  }

  return (validate.errors ?? []).map(error => `${error.instancePath || '/'} ${error.message}`);
}
