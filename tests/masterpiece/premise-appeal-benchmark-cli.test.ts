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

describe('premise appeal benchmark CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('runs project premise appeal samples and stores a report', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'premise-appeal-cli-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const benchmarkDir = join(projectDir, 'reviews', 'premise-appeal-benchmark');
    await mkdir(benchmarkDir, { recursive: true });
    await writeFile(
      join(benchmarkDir, 'premise-benchmark.json'),
      `${JSON.stringify(
        {
          required_genres: ['mystery', 'romance'],
          required_target_readers: ['webnovel-core', 'romance-core'],
          minimum_panel_size: 3,
          minimum_commented_responses: 2,
          minimum_samples_per_genre: 2,
          minimum_samples_per_target_reader: 2,
          minimum_holdout_samples: 1,
          minimum_usable_holdout_samples: 1,
          minimum_failing_holdout_samples: 1,
          minimum_usable_failing_holdout_samples: 1,
          require_promise_evidence: true,
          require_behavioral_intent_evidence: true,
          require_behavioral_protocol: true,
          require_behavioral_allocation_integrity: true,
          minimum_behavioral_impressions: 100,
          minimum_click_through_rate: 0.04,
          minimum_first_chapter_open_rate: 0.025,
          minimum_save_or_follow_rate: 0.008,
          minimum_behavioral_observation_window_hours: 24,
          minimum_sample_ratio_mismatch_p_value: 0.001,
          samples: [
            {
              id: 'reader-approved-premise',
              genre: 'mystery',
              target_reader: 'webnovel-core',
              premise: {
                target_reader: 'webnovel-core',
                core_hook: '살인을 예고하는 앱이 주인공에게만 첫 알림을 보낸다.',
                irresistible_question:
                  '앱은 왜 아직 벌어지지 않은 살인을 알고, 왜 첫 수신자로 주인공을 골랐는가?',
                protagonist_appeal:
                  '주인공은 공포보다 패턴을 먼저 읽고 위험을 감수해 현장으로 뛰어든다.',
                novelty_angle:
                  '앱 예고, 과거 미제 사건 번호, 가족 실종 파일이 같은 규칙으로 연결된다.',
                emotional_payoff: '사람을 구하려는 선택이 가족 실종의 진실과 맞물리는 긴장감.',
                binge_reason: '새 알림마다 다음 수신자와 과거 사건 번호가 바뀐다.',
                long_series_engine:
                  '예고 앱의 개발자, 과거 미제 사건, 가족 실종이 하나의 장기 미스터리로 수렴한다.',
              },
              automated_score: 92,
              expected_appealing: true,
              calibration_split: 'calibration',
              rating_scale: 'likert-7',
              behavioral_evidence: {
                platform: 'blind-listing-panel',
                variant_label: 'mystery-hook-a',
                acquisition_source: 'target-reader-listing-test',
                observation_window_hours: 48,
                blind_listing_test: true,
                impression_count: 240,
                click_count: 24,
                first_chapter_open_count: 18,
                library_add_count: 5,
                follow_count: 4,
                expected_variant_allocation_ratio: 0.5,
                observed_variant_allocation_ratio: 0.51,
                sample_ratio_mismatch_p_value: 0.62,
              },
              reader_responses: [
                highRawResponse('reader-1'),
                highRawResponse('reader-2'),
                highRawResponse('reader-3'),
              ],
            },
            {
              id: 'auto-high-reader-weak-premise',
              genre: 'mystery',
              target_reader: 'webnovel-core',
              premise: {
                target_reader: 'webnovel-core',
                core_hook: '살인을 예고하는 앱이 등장한다.',
                irresistible_question: '앱의 정체는 무엇인가?',
                protagonist_appeal: '주인공은 사건을 해결하려 한다.',
                novelty_angle: '앱과 살인 예고를 결합한다.',
                emotional_payoff: '긴장감과 반전을 제공한다.',
                binge_reason: '다음 사건이 이어진다.',
                long_series_engine: '앱의 비밀을 추적한다.',
              },
              automated_score: 88,
              expected_appealing: false,
              calibration_split: 'holdout',
              rating_scale: 'likert-7',
              behavioral_evidence: {
                platform: 'blind-listing-panel',
                variant_label: 'generic-mystery-holdout',
                acquisition_source: 'target-reader-listing-test',
                observation_window_hours: 48,
                blind_listing_test: true,
                impression_count: 230,
                click_count: 3,
                first_chapter_open_count: 1,
                library_add_count: 0,
                follow_count: 0,
                expected_variant_allocation_ratio: 0.5,
                observed_variant_allocation_ratio: 0.49,
                sample_ratio_mismatch_p_value: 0.71,
              },
              reader_responses: [
                lowRawResponse('reader-4'),
                lowRawResponse('reader-5'),
                lowRawResponse('reader-6'),
              ],
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-premise-appeal-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-premise-appeal-benchmark.ts')],
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
      requiredTargetReaders: ['webnovel-core', 'romance-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSamplesPerGenre: 2,
      minimumSamplesPerTargetReader: 2,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
      minimumBehavioralImpressionCount: 100,
      minimumClickThroughRate: 0.04,
      minimumFirstChapterOpenRate: 0.025,
      minimumSaveOrFollowRate: 0.008,
      minimumBehavioralObservationWindowHours: 24,
      minimumSampleRatioMismatchPValue: 0.001,
      requirePromiseEvidenceForGateTuning: true,
      requireBehavioralIntentEvidenceForGateTuning: true,
      requireBehavioralProtocolForGateTuning: true,
      requireBehavioralAllocationIntegrityForGateTuning: true,
      benchmark: {
        total: 2,
        passed: 1,
        failed: 1,
        automatedFalsePositiveCount: 1,
        automatedFalseNegativeCount: 0,
        behavioralIntentFalsePositiveCount: 1,
        weakPromiseEvidenceCount: 0,
        promiseEvidenceCount: 2,
        lowBehavioralIntentEvidenceCount: 0,
        behavioralIntentEvidenceCount: 2,
        weakBehavioralProtocolCount: 0,
        behavioralProtocolEvidenceCount: 2,
        weakBehavioralAllocationCount: 0,
        behavioralAllocationEvidenceCount: 2,
        insufficientEvidenceCount: 0,
        missingRequiredGenres: ['romance'],
        underSampledRequiredGenres: ['romance'],
        missingRequiredPositiveGenres: ['romance'],
        missingRequiredNegativeGenres: ['romance'],
        missingRequiredTargetReaders: ['romance-core'],
        underSampledRequiredTargetReaders: ['romance-core'],
        missingRequiredPositiveTargetReaders: ['romance-core'],
        missingRequiredNegativeTargetReaders: ['romance-core'],
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
    expect(output.benchmark.sampleResults[1]).toMatchObject({
      id: 'auto-high-reader-weak-premise',
      calibrationSplit: 'holdout',
      promiseEvidence: 'usable',
      promiseEvidenceFieldCount: 7,
      readerPassed: false,
      automatedPassed: true,
      failureTypes: expect.arrayContaining(['automated-false-positive']),
    });

    const outputPath = join(projectDir, 'reviews', 'premise-appeal-benchmark-report.json');
    expect(existsSync(outputPath)).toBe(true);
    const persisted = await readJson(outputPath);
    expect(persisted.benchmark.automatedFalsePositiveCount).toBe(1);
    expect(persisted.benchmark.sampleResults[0]).toMatchObject({
      promiseEvidence: 'usable',
      promiseEvidenceIssues: [],
      promiseEvidenceFieldCount: 7,
    });
    expect(persisted.benchmark.sampleResults[0].evidenceFingerprint).toMatch(
      /^sha256:[a-f0-9]{64}$/
    );
    expect(persisted.benchmark.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('automated scoring accepts'),
        expect.stringContaining('romance'),
        expect.stringContaining('romance-core'),
      ])
    );
  });

  it('accepts required coverage from CLI arguments', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'premise-appeal-cli-required-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const benchmarkDir = join(projectDir, 'reviews', 'premise-appeal-benchmark');
    await mkdir(benchmarkDir, { recursive: true });
    await writeFile(
      join(benchmarkDir, 'premise-benchmark.json'),
      `${JSON.stringify(
        {
          samples: [
            {
              id: 'reader-approved-premise',
              genre: 'mystery',
              target_reader: 'webnovel-core',
              automated_score: 92,
              expected_appealing: true,
              rating_scale: 'likert-7',
              reader_responses: [
                highRawResponse('reader-1'),
                highRawResponse('reader-2'),
                highRawResponse('reader-3'),
              ],
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-premise-appeal-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-premise-appeal-benchmark.ts')],
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
        '--required-target-readers',
        'webnovel-core,thriller-core',
        '--minimum-panel-size',
        '3',
        '--minimum-commented-responses',
        '2',
        '--minimum-samples-per-genre',
        '2',
        '--minimum-samples-per-target-reader',
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
    expect(output.requiredTargetReaders).toEqual(['webnovel-core', 'thriller-core']);
    expect(output.minimumPanelSize).toBe(3);
    expect(output.minimumCommentedResponses).toBe(2);
    expect(output.minimumSamplesPerGenre).toBe(2);
    expect(output.minimumSamplesPerTargetReader).toBe(2);
    expect(output.minimumHoldoutSampleCount).toBe(2);
    expect(output.minimumUsableHoldoutSampleCount).toBe(2);
    expect(output.minimumFailingHoldoutSampleCount).toBe(1);
    expect(output.minimumUsableFailingHoldoutSampleCount).toBe(1);
    expect(output.benchmark.missingRequiredGenres).toEqual(['thriller']);
    expect(output.benchmark.underSampledRequiredGenres).toEqual(['mystery', 'thriller']);
    expect(output.benchmark.missingRequiredTargetReaders).toEqual(['thriller-core']);
    expect(output.benchmark.underSampledRequiredTargetReaders).toEqual([
      'webnovel-core',
      'thriller-core',
    ]);
  });
});

function highRawResponse(readerId: string) {
  return {
    reader_id: readerId,
    target_reader_fit: true,
    ratings: {
      curiosity_gap: 7,
      novelty: 6,
      protagonist_investment: 6,
      emotional_pull: 6,
      clarity: 6,
      target_fit: 7,
      next_chapter_anticipation: 7,
    },
    would_read: true,
    comment: '왜 첫 수신자가 주인공인지 궁금하고 바로 첫 화를 확인하고 싶다.',
    attractive_elements: ['구체적인 정보 격차', '개인적 대가'],
    rewrite_suggestion: '앱 규칙은 첫 장면 행동으로 증명하면 더 좋다.',
  };
}

function lowRawResponse(readerId: string) {
  return {
    reader_id: readerId,
    target_reader_fit: true,
    ratings: {
      curiosity_gap: 3,
      novelty: 3,
      protagonist_investment: 2,
      emotional_pull: 3,
      clarity: 5,
      target_fit: 4,
      next_chapter_anticipation: 3,
    },
    would_read: false,
    comment: '설정은 이해되지만 주인공을 따라가야 할 이유가 약하다.',
    confusion_points: ['주인공 개인 대가가 흐림'],
    rewrite_suggestion: '첫 알림을 가족 실종이나 숨긴 죄책감과 묶어야 한다.',
  };
}
