import { afterEach, describe, expect, it } from 'vitest';
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const sampleProject = join(root, 'tests', 'fixtures', 'sample-project');

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

describe('engagement benchmark CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('runs project engagement benchmark samples and stores a report', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-benchmark-cli-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const benchmarkDir = join(projectDir, 'reviews', 'engagement-benchmark');
    await mkdir(benchmarkDir, { recursive: true });
    await writeFile(
      join(benchmarkDir, 'chapter-001-benchmark.json'),
      `${JSON.stringify(
        {
          required_genres: ['mystery', 'romance'],
          required_routes: ['interest', 'suspense', 'beauty', 'next-click'],
          required_issue_codes: [
            'manuscript-earned-reward-not-evidenced',
            'manuscript-payoff-delight-not-evidenced',
          ],
          required_positive_quality_codes: [
            'payoff-delight',
            'genre-delight',
          ],
          minimum_samples_per_required_issue_code: 1,
          minimum_samples_per_required_positive_quality_code: 1,
          required_series_length: 3,
          required_positive_series_length: 3,
          minimum_holdout_samples: 1,
          minimum_usable_holdout_samples: 1,
          minimum_failing_holdout_samples: 1,
          minimum_usable_failing_holdout_samples: 1,
          samples: [
            {
              id: 'chapter-001-good',
              label: '1화 현재 원고 긍정 샘플',
              genre: 'mystery',
              routes: ['interest', 'suspense', 'genre-delight', 'next-click'],
              positive_quality_codes: ['payoff-delight', 'genre-delight'],
              chapter: 1,
              version: 1,
              calibration_split: 'calibration',
              expected_passed: true,
              forbidden_issue_codes: [
                'manuscript-payoff-delight-not-evidenced',
                'manuscript-ending-hook-closed',
              ],
              expected_min_score: 90,
            },
            {
              id: 'chapter-001-bad-summary',
              label: '보상과 말미 훅이 요약으로만 처리된 실패 샘플',
              genre: 'mystery',
              routes: ['interest'],
              chapter: 1,
              version: 1,
              calibration_split: 'holdout',
              manuscript: [
                '퇴근 후 주인공은 이상한 앱 알림을 받았고 사건이 중요하다고 생각했다.',
                '그는 나중에 현장으로 갔으며, 앱 알림이 실제 사건과 관련 있다는 사실을 알게 되었다.',
                '피해자 휴대폰에는 여러 정보가 있었고 과거 사건과도 관련이 있었다.',
                '모든 내용은 다음 화에서 더 설명될 예정이다.',
              ].join('\n'),
              expected_passed: false,
              expected_issue_codes: ['manuscript-earned-reward-not-evidenced'],
              expected_max_score: 84,
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-engagement-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-engagement-benchmark.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toMatchObject({
      projectId: 'sample-project',
      samplesLoaded: 2,
      requiredGenres: ['mystery', 'romance'],
      requiredRoutes: ['interest', 'suspense', 'beauty', 'next-click'],
      requiredIssueCodes: [
        'manuscript-earned-reward-not-evidenced',
        'manuscript-payoff-delight-not-evidenced',
      ],
      requiredPositiveQualityCodes: [
        'payoff-delight',
        'genre-delight',
      ],
      minimumSamplesPerRequiredIssueCode: 1,
      minimumSamplesPerRequiredPositiveQualityCode: 1,
      requiredSeriesLength: 3,
      requiredPositiveSeriesLength: 3,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
      benchmark: {
        total: 2,
        passed: 2,
        failed: 0,
        falsePositiveCount: 0,
        falseNegativeCount: 0,
        missingIssueCount: 0,
        forbiddenIssueCount: 0,
        positiveQualityConflictCount: 0,
        scoreOutOfRangeCount: 0,
        genreCoverage: {
          mystery: 2,
        },
        genrePolarityCoverage: {
          mystery: {
            positive: 1,
            negative: 1,
          },
        },
        missingRequiredGenres: ['romance'],
        missingRequiredPositiveGenres: ['romance'],
        missingRequiredNegativeGenres: ['romance'],
        missingRequiredSeriesGenres: ['mystery', 'romance'],
        missingRequiredPositiveSeriesGenres: ['mystery', 'romance'],
        missingRequiredRoutes: ['beauty'],
        positiveQualityCoverage: {
          'payoff-delight': 1,
          'genre-delight': 1,
        },
        usablePositiveQualityCoverage: {
          'payoff-delight': 1,
          'genre-delight': 1,
        },
        missingRequiredPositiveQualityCodes: [],
        underSampledRequiredPositiveQualityCodes: [],
        underSampledUsableRequiredPositiveQualityCodes: [],
        issueCodeCoverage: {
          'manuscript-earned-reward-not-evidenced': 1,
        },
        usableIssueCodeCoverage: {
          'manuscript-earned-reward-not-evidenced': 1,
        },
        missingRequiredIssueCodes: ['manuscript-payoff-delight-not-evidenced'],
        underSampledRequiredIssueCodes: [],
        underSampledUsableRequiredIssueCodes: [],
        splitCoverage: {
          calibrationSamples: 1,
          validationSamples: 0,
          holdoutSamples: 1,
          unassignedSamples: 0,
          usableCalibrationSamples: 1,
          usableValidationSamples: 0,
          usableHoldoutSamples: 1,
          usableUnassignedSamples: 0,
          failingHoldoutSamples: 1,
          usableFailingHoldoutSamples: 1,
        },
        underSampledHoldoutSamples: false,
        underSampledUsableHoldoutSamples: false,
        underSampledFailingHoldoutSamples: false,
        underSampledUsableFailingHoldoutSamples: false,
        splitLeakageCount: 0,
        splitLeakages: [],
        readyForGateTuning: false,
      },
    });
    expect(output.benchmark.sampleResults[0]).toMatchObject({
      id: 'chapter-001-good',
      calibrationSplit: 'calibration',
      manuscriptSource: 'chapter',
      manuscriptPath: 'chapters/chapter_001.md',
      chapterSourceGrounded: true,
      actualPassed: true,
      scoreExpectationPassed: true,
    });
    expect(output.benchmark.sampleResults[1]).toMatchObject({
      id: 'chapter-001-bad-summary',
      calibrationSplit: 'holdout',
      manuscriptSource: 'inline',
      chapterSourceGrounded: false,
      actualPassed: false,
      missingExpectedIssueCodes: [],
    });

    const outputPath = join(projectDir, 'reviews', 'engagement-benchmark-report.json');
    expect(existsSync(outputPath)).toBe(true);
    const persisted = await readJson(outputPath);
    expect(persisted.benchmark.missingRequiredGenres).toEqual(['romance']);
    expect(persisted.benchmark.missingRequiredPositiveGenres).toEqual(['romance']);
    expect(persisted.benchmark.missingRequiredNegativeGenres).toEqual(['romance']);
    expect(persisted.benchmark.missingRequiredSeriesGenres).toEqual(['mystery', 'romance']);
    expect(persisted.benchmark.missingRequiredPositiveSeriesGenres).toEqual(['mystery', 'romance']);
    expect(persisted.benchmark.missingRequiredIssueCodes).toEqual([
      'manuscript-payoff-delight-not-evidenced',
    ]);
    expect(persisted.benchmark.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('romance'),
        expect.stringContaining('known-good'),
        expect.stringContaining('known-bad'),
        expect.stringContaining('consecutive chapter'),
        expect.stringContaining('beauty'),
        expect.stringContaining('missing expected engagement issue codes'),
      ])
    );
  });

  it('accepts required coverage from CLI arguments', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-benchmark-cli-required-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const benchmarkDir = join(projectDir, 'reviews', 'engagement-benchmark');
    await mkdir(benchmarkDir, { recursive: true });
    await writeFile(
      join(benchmarkDir, 'chapter-001-benchmark.json'),
      `${JSON.stringify(
        {
          samples: [
            {
              id: 'chapter-001-good',
              genre: 'mystery',
              routes: ['interest', 'suspense', 'next-click'],
              chapter: 1,
              expected_passed: true,
              expected_min_score: 90,
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-engagement-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-engagement-benchmark.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--required-genres',
        'mystery,thriller',
        '--required-routes',
        'interest,suspense,beauty',
        '--required-issue-codes',
        'manuscript-payoff-delight-not-evidenced,manuscript-genre-delight-not-evidenced',
        '--required-positive-quality-codes',
        'payoff-delight,next-click-compulsion,choice-cost-lock',
        '--min-issue-code-samples',
        '2',
        '--min-positive-quality-code-samples',
        '2',
        '--required-series-length',
        '2',
        '--required-positive-series-length',
        '2',
        '--min-holdout-samples',
        '2',
        '--min-usable-holdout-samples',
        '2',
        '--min-failing-holdout-samples',
        '1',
        '--min-usable-failing-holdout-samples',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.requiredGenres).toEqual(['mystery', 'thriller']);
    expect(output.requiredRoutes).toEqual(['interest', 'suspense', 'beauty']);
    expect(output.requiredIssueCodes).toEqual([
      'manuscript-payoff-delight-not-evidenced',
      'manuscript-genre-delight-not-evidenced',
    ]);
    expect(output.requiredPositiveQualityCodes).toEqual([
      'payoff-delight',
      'next-click-compulsion',
      'choice-cost-lock',
    ]);
    expect(output.minimumSamplesPerRequiredIssueCode).toBe(2);
    expect(output.minimumSamplesPerRequiredPositiveQualityCode).toBe(2);
    expect(output.requiredSeriesLength).toBe(2);
    expect(output.requiredPositiveSeriesLength).toBe(2);
    expect(output.minimumHoldoutSampleCount).toBe(2);
    expect(output.minimumUsableHoldoutSampleCount).toBe(2);
    expect(output.minimumFailingHoldoutSampleCount).toBe(1);
    expect(output.minimumUsableFailingHoldoutSampleCount).toBe(1);
    expect(output.benchmark.missingRequiredGenres).toEqual(['thriller']);
    expect(output.benchmark.missingRequiredPositiveGenres).toEqual(['thriller']);
    expect(output.benchmark.missingRequiredNegativeGenres).toEqual(['mystery', 'thriller']);
    expect(output.benchmark.missingRequiredSeriesGenres).toEqual(['mystery', 'thriller']);
    expect(output.benchmark.missingRequiredPositiveSeriesGenres).toEqual(['mystery', 'thriller']);
    expect(output.benchmark.missingRequiredRoutes).toEqual(['beauty']);
    expect(output.benchmark.missingRequiredIssueCodes).toEqual([
      'manuscript-payoff-delight-not-evidenced',
      'manuscript-genre-delight-not-evidenced',
    ]);
    expect(output.benchmark.missingRequiredPositiveQualityCodes).toEqual([
      'payoff-delight',
      'next-click-compulsion',
      'choice-cost-lock',
    ]);
    expect(output.benchmark.splitLeakageCount).toBe(0);
  });
});
