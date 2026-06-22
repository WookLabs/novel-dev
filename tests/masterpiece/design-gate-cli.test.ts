import { afterEach, describe, expect, it } from 'vitest';
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSourceEvidenceManifest } from '../../src/cli/source-evidence.js';

const root = process.cwd();

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

async function writeJson(path: string, data: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

describe('design gate CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('passes design approval when premise appeal readiness evidence is clean and current', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'design-gate-cli-pass-'));
    tempDirs.push(workDir);
    const projectDir = await createDesignProject(workDir);
    await writePremiseAppealReport(projectDir, readyPremiseBenchmark());

    const cliPath = await bundleDesignGateCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--fail-on-blocked',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toMatchObject({
      projectId: 'sample-project',
      status: 'PASS',
      passed: true,
      sourceEvidence: {
        status: 'matched',
        benchmarkSampleSourceFileCount: 1,
      },
      issues: [],
    });

    const outputPath = join(projectDir, 'reviews', 'design-gate-report.json');
    expect(existsSync(outputPath)).toBe(true);
    const persisted = await readJson(outputPath);
    expect(persisted.passed).toBe(true);
    expect(persisted.recommendedCommands).toEqual(
      expect.arrayContaining([
        expect.stringContaining('run-premise-appeal-benchmark.js'),
        expect.stringContaining('apply-design-gate.js'),
      ])
    );
  });

  it('blocks design approval when the premise appeal report is not ready for writing', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'design-gate-cli-block-'));
    tempDirs.push(workDir);
    const projectDir = await createDesignProject(workDir);
    await writePremiseAppealReport(projectDir, {
      ...readyPremiseBenchmark(),
      readyForGateTuning: false,
      weakPromiseEvidenceCount: 1,
      promiseEvidenceCount: 0,
      automatedFalsePositiveCount: 1,
      behavioralIntentFalsePositiveCount: 1,
      splitLeakageCount: 1,
      underSampledUsableHoldoutSamples: true,
      underSampledUsableFailingHoldoutSamples: true,
      insufficientEvidenceCount: 1,
      weakBehavioralProtocolCount: 1,
    });

    const cliPath = await bundleDesignGateCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--fail-on-blocked',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(2);
    const output = JSON.parse(result.stdout);
    expect(output.status).toBe('BLOCKED');
    expect(output.passed).toBe(false);
    expect(output.issues.map((issue: any) => issue.code)).toEqual(
      expect.arrayContaining([
        'premise-appeal-not-ready',
        'weak-promise-evidence',
        'premise-promise-evidence-missing',
        'premise-appeal-false-positive',
        'premise-behavioral-intent-weak',
        'premise-appeal-split-leakage',
        'premise-appeal-holdout-weak',
        'premise-appeal-reader-evidence-weak',
      ])
    );
  });

  it('blocks design approval when premise benchmark source evidence is stale', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'design-gate-cli-stale-'));
    tempDirs.push(workDir);
    const projectDir = await createDesignProject(workDir);
    await writePremiseAppealReport(projectDir, readyPremiseBenchmark());
    await writeFile(
      join(projectDir, 'reviews', 'premise-appeal-benchmark', 'source.json'),
      `${JSON.stringify({ changed: true }, null, 2)}\n`,
      'utf8'
    );

    const cliPath = await bundleDesignGateCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--fail-on-blocked',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(2);
    const output = JSON.parse(result.stdout);
    expect(output.status).toBe('BLOCKED');
    expect(output.sourceEvidence.status).toBe('mismatch');
    expect(output.sourceEvidence.changedPaths).toContain(
      'reviews/premise-appeal-benchmark/source.json'
    );
    expect(output.issues.map((issue: any) => issue.code)).toContain(
      'premise-appeal-report-stale'
    );
  });
});

async function createDesignProject(workDir: string): Promise<string> {
  const projectDir = join(workDir, 'sample-project');
  await mkdir(join(projectDir, 'meta'), { recursive: true });
  await mkdir(join(projectDir, 'reviews', 'premise-appeal-benchmark'), { recursive: true });
  await writeJson(join(projectDir, 'meta', 'project.json'), {
    project_id: 'sample-project',
  });
  await writeJson(join(projectDir, 'meta', 'design-strategy.json'), {
    reader_promise_contract: {
      core_hook: '살인을 예고하는 앱이 주인공에게만 첫 알림을 보낸다.',
      irresistible_question: '앱은 왜 아직 벌어지지 않은 살인을 알고 있는가?',
      protagonist_appeal: '주인공은 공포보다 패턴을 먼저 읽고 현장으로 뛰어든다.',
      novelty_angle: '예고 앱, 과거 사건 번호, 가족 실종 파일이 같은 규칙으로 연결된다.',
      emotional_payoff: '사람을 구하려는 선택이 가족 실종의 진실과 맞물린다.',
      binge_reason: '새 알림마다 다음 수신자와 과거 사건 번호가 바뀐다.',
      long_series_engine: '예고 앱의 개발자와 가족 실종이 장기 미스터리로 수렴한다.',
    },
  });
  await writeJson(join(projectDir, 'reviews', 'premise-appeal-benchmark', 'source.json'), {
    samples: [
      {
        id: 'reader-approved-premise',
      },
    ],
  });
  return projectDir;
}

async function writePremiseAppealReport(
  projectDir: string,
  benchmark: Record<string, unknown>
): Promise<void> {
  const benchmarkDir = join(projectDir, 'reviews', 'premise-appeal-benchmark');
  const sourceEvidence = await buildSourceEvidenceManifest(projectDir, [
    benchmarkDir,
    join(projectDir, 'meta', 'design-strategy.json'),
  ]);
  await writeJson(join(projectDir, 'reviews', 'premise-appeal-benchmark-report.json'), {
    projectId: 'sample-project',
    projectDir,
    inputDir: benchmarkDir,
    outputPath: join(projectDir, 'reviews', 'premise-appeal-benchmark-report.json'),
    samplesLoaded: 2,
    sourceEvidence,
    benchmark,
  });
}

function readyPremiseBenchmark(): Record<string, unknown> {
  return {
    total: 2,
    passed: 2,
    failed: 0,
    accuracy: 1,
    readyForGateTuning: true,
    weakPromiseEvidenceCount: 0,
    promiseEvidenceCount: 2,
    automatedFalsePositiveCount: 0,
    behavioralIntentFalsePositiveCount: 0,
    splitLeakageCount: 0,
    underSampledHoldoutSamples: false,
    underSampledUsableHoldoutSamples: false,
    underSampledFailingHoldoutSamples: false,
    underSampledUsableFailingHoldoutSamples: false,
    insufficientEvidenceCount: 0,
    lowBehavioralIntentEvidenceCount: 0,
    weakBehavioralProtocolCount: 0,
    weakBehavioralAllocationCount: 0,
  };
}

async function bundleDesignGateCli(workDir: string): Promise<string> {
  const cliPath = join(workDir, 'apply-design-gate.mjs');
  await build({
    entryPoints: [join(root, 'src', 'cli', 'apply-design-gate.ts')],
    outfile: cliPath,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    logLevel: 'silent',
  });
  return cliPath;
}
