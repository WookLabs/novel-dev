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

describe('style gate CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('passes style approval when prose taste evidence is clean and current', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'style-gate-cli-pass-'));
    tempDirs.push(workDir);
    const projectDir = await createStyleProject(workDir);
    await writeProseTasteReport(projectDir, readyProseTasteBenchmark());

    const cliPath = await bundleStyleGateCli(workDir);
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

    const outputPath = join(projectDir, 'reviews', 'style-gate-report.json');
    expect(existsSync(outputPath)).toBe(true);
    const persisted = await readJson(outputPath);
    expect(persisted.passed).toBe(true);
    expect(persisted.recommendedCommands).toEqual(
      expect.arrayContaining([
        expect.stringContaining('run-prose-taste-benchmark.js'),
        expect.stringContaining('apply-style-gate.js'),
      ])
    );
  });

  it('blocks style approval when prose taste evidence is not ready for drafting', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'style-gate-cli-block-'));
    tempDirs.push(workDir);
    const projectDir = await createStyleProject(workDir);
    await writeProseTasteReport(projectDir, {
      ...readyProseTasteBenchmark(),
      readyForStyleTuning: false,
      failed: 2,
      falsePositiveCount: 1,
      missingIssueCount: 1,
      scoreOutOfRangeCount: 1,
      missingStyleFrictionAnnotationCount: 1,
      weakStyleHighlightAnnotationCount: 1,
      weakStyleHighlightQualityDiversityCount: 1,
      weakStyleFingerprintCount: 1,
      styleFingerprintStatus: 'weak',
      weakAuthorialStyleDriftCount: 1,
      authorialStyleDriftStatus: 'drifted',
      missingRequiredReaderSegments: ['style-sensitive'],
      splitLeakageCount: 1,
      underSampledUsableHoldoutSamples: true,
    });

    const cliPath = await bundleStyleGateCli(workDir);
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
        'prose-taste-not-ready',
        'prose-taste-failing-samples',
        'prose-taste-false-classification',
        'prose-taste-missing-issue',
        'prose-taste-score-out-of-range',
        'style-friction-evidence-weak',
        'style-highlight-evidence-weak',
        'style-highlight-diversity-weak',
        'style-fingerprint-weak',
        'authorial-style-drift',
        'prose-taste-reader-segment-weak',
        'prose-taste-split-leakage',
        'prose-taste-holdout-weak',
      ])
    );
  });

  it('blocks style approval when prose taste benchmark source evidence is stale', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'style-gate-cli-stale-'));
    tempDirs.push(workDir);
    const projectDir = await createStyleProject(workDir);
    await writeProseTasteReport(projectDir, readyProseTasteBenchmark());
    await writeFile(
      join(projectDir, 'reviews', 'prose-taste-benchmark', 'source.json'),
      `${JSON.stringify({ changed: true }, null, 2)}\n`,
      'utf8'
    );

    const cliPath = await bundleStyleGateCli(workDir);
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
      'reviews/prose-taste-benchmark/source.json'
    );
    expect(output.issues.map((issue: any) => issue.code)).toContain(
      'prose-taste-report-stale'
    );
  });
});

async function createStyleProject(workDir: string): Promise<string> {
  const projectDir = join(workDir, 'sample-project');
  await mkdir(join(projectDir, 'meta'), { recursive: true });
  await mkdir(join(projectDir, 'reviews', 'prose-taste-benchmark'), { recursive: true });
  await writeJson(join(projectDir, 'meta', 'project.json'), {
    project_id: 'sample-project',
  });
  await writeJson(join(projectDir, 'meta', 'style-guide.json'), {
    prose_taste_profile: {
      preferred_mode: 'balanced',
      disliked_phrases: ['감각이 왔다', '반응이 잡혔다'],
      minimum_score: 88,
    },
  });
  await writeJson(join(projectDir, 'reviews', 'prose-taste-benchmark', 'source.json'), {
    samples: [
      {
        id: 'reader-approved-style',
      },
    ],
  });
  return projectDir;
}

async function writeProseTasteReport(
  projectDir: string,
  benchmark: Record<string, unknown>
): Promise<void> {
  const benchmarkDir = join(projectDir, 'reviews', 'prose-taste-benchmark');
  const sourceEvidence = await buildSourceEvidenceManifest(projectDir, [
    benchmarkDir,
    join(projectDir, 'meta', 'style-guide.json'),
    join(projectDir, 'chapters'),
  ]);
  await writeJson(join(projectDir, 'reviews', 'prose-taste-benchmark-report.json'), {
    projectId: 'sample-project',
    projectDir,
    inputDir: benchmarkDir,
    outputPath: join(projectDir, 'reviews', 'prose-taste-benchmark-report.json'),
    samplesLoaded: 4,
    sourceEvidence,
    benchmark,
  });
}

function readyProseTasteBenchmark(): Record<string, unknown> {
  return {
    total: 4,
    passed: 4,
    failed: 0,
    accuracy: 1,
    readyForStyleTuning: true,
    falsePositiveCount: 0,
    falseNegativeCount: 0,
    missingIssueCount: 0,
    scoreOutOfRangeCount: 0,
    missingStyleFrictionAnnotationCount: 0,
    weakStyleFrictionAnnotationCount: 0,
    missingStyleHighlightAnnotationCount: 0,
    weakStyleHighlightAnnotationCount: 0,
    weakStyleHighlightQualityDiversityCount: 0,
    weakStyleFingerprintCount: 0,
    styleFingerprintStatus: 'separated',
    weakAuthorialStyleDriftCount: 0,
    authorialStyleDriftStatus: 'stable',
    missingRequiredReaderSegments: [],
    underSampledReaderSegments: [],
    underSampledFailingReaderSegments: [],
    readerSegmentRepresentativeness: 'balanced',
    splitLeakageCount: 0,
    underSampledHoldoutSamples: false,
    underSampledUsableHoldoutSamples: false,
    underSampledFailingHoldoutSamples: false,
    underSampledUsableFailingHoldoutSamples: false,
  };
}

async function bundleStyleGateCli(workDir: string): Promise<string> {
  const cliPath = join(workDir, 'apply-style-gate.mjs');
  await build({
    entryPoints: [join(root, 'src', 'cli', 'apply-style-gate.ts')],
    outfile: cliPath,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    logLevel: 'silent',
  });
  return cliPath;
}
