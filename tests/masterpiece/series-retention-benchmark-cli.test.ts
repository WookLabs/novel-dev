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

describe('series retention benchmark CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('runs project series retention samples and stores a report', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'series-retention-cli-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const benchmarkDir = join(projectDir, 'reviews', 'series-retention-benchmark');
    await mkdir(benchmarkDir, { recursive: true });
    await writeFile(
      join(benchmarkDir, 'series-retention-benchmark.json'),
      `${JSON.stringify(
        {
          required_genres: ['mystery', 'romance'],
          required_target_readers: ['webnovel-core', 'romance-core'],
          minimum_panel_size: 3,
          minimum_commented_responses: 2,
          minimum_sequence_length: 3,
          maximum_retention_drop: 12,
          maximum_repeated_reward_signature_run: 2,
          maximum_repeated_emotional_signature_run: 2,
          maximum_dominant_emotional_signature_family_share: 0.67,
          require_hook_progress_evidence: true,
          minimum_hook_progress_event_count: 1,
          minimum_hook_progress_rate: 0.5,
          maximum_hook_stall_ratio: 0.5,
          minimum_samples_per_genre: 2,
          minimum_samples_per_target_reader: 2,
          minimum_holdout_samples: 1,
          minimum_usable_holdout_samples: 1,
          minimum_failing_holdout_samples: 1,
          minimum_usable_failing_holdout_samples: 1,
          samples: [
            {
              id: 'reader-retained-sequence',
              genre: 'mystery',
              target_reader: 'webnovel-core',
              expected_retained: true,
              calibration_split: 'calibration',
              rating_scale: 'likert-7',
              chapters: [
                retainedRawChapter(7, 91, 'first-alert-rescue'),
                retainedRawChapter(8, 90, 'cold-case-clue'),
                retainedRawChapter(9, 92, 'partner-risk-choice'),
              ],
            },
            {
              id: 'auto-high-reader-fatigued-sequence',
              genre: 'mystery',
              target_reader: 'webnovel-core',
              expected_retained: false,
              calibration_split: 'holdout',
              rating_scale: 'likert-7',
              chapters: [
                fatiguedRawChapter(10, 88, 5),
                fatiguedRawChapter(11, 90, 4),
                fatiguedRawChapter(12, 89, 3),
              ],
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-series-retention-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-series-retention-benchmark.ts')],
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
      minimumSequenceLength: 3,
      maximumRetentionDrop: 12,
      maximumRepeatedRewardSignatureRun: 2,
      maximumRepeatedEmotionalSignatureRun: 2,
      maximumDominantEmotionalSignatureFamilyShare: 0.67,
      requireHookProgressEvidence: true,
      minimumHookProgressEventCount: 1,
      minimumHookProgressRate: 0.5,
      maximumHookStallRatio: 0.5,
      minimumSamplesPerGenre: 2,
      minimumSamplesPerTargetReader: 2,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
      benchmark: {
        total: 2,
        passed: 1,
        failed: 1,
        automatedFalsePositiveCount: 1,
        automatedFalseNegativeCount: 0,
        weakReaderRetentionCount: 1,
        retentionDropCount: 1,
        funnelDropCount: 1,
        weakFunnelEvidenceCount: 0,
        hookStallCount: 1,
        weakHookProgressEvidenceCount: 0,
        repetitiveRewardPatternCount: 1,
        repetitiveEmotionalPatternCount: 1,
        narrowEmotionalPaletteCount: 1,
        insufficientEvidenceCount: 0,
        shortSequenceCount: 0,
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
          holdoutSamples: 1,
          usableHoldoutSamples: 1,
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
      id: 'auto-high-reader-fatigued-sequence',
      readerPassed: false,
      automatedPassed: true,
      calibrationSplit: 'holdout',
      repeatedRewardSignatureRun: 3,
      repeatedEmotionalSignatureRun: 3,
      dominantEmotionalSignatureFamily: 'dread',
      dominantEmotionalSignatureFamilyShare: 1,
      chapterResults: [
        expect.objectContaining({
          emotionalSignature: 'alarm-dread-deferral',
          emotionalSignatureFamily: 'dread',
        }),
        expect.objectContaining({
          emotionalSignatureFamily: 'dread',
        }),
        expect.objectContaining({
          emotionalSignatureFamily: 'dread',
        }),
      ],
      failureTypes: expect.arrayContaining([
        'automated-false-positive',
        'reader-retention-drop',
        'reader-funnel-drop',
        'reader-hook-stall',
        'repetitive-reward-pattern',
        'repetitive-emotional-pattern',
        'narrow-emotional-palette',
      ]),
    });

    const outputPath = join(projectDir, 'reviews', 'series-retention-benchmark-report.json');
    expect(existsSync(outputPath)).toBe(true);
    const persisted = await readJson(outputPath);
    expect(persisted.benchmark.automatedFalsePositiveCount).toBe(1);
    expect(persisted.benchmark.sampleResults[1].chapterResults[0]).toMatchObject({
      emotionalSignatureFamily: 'dread',
    });
    expect(persisted.benchmark.sampleResults[0].evidenceFingerprint).toMatch(
      /^sha256:[a-f0-9]{64}$/
    );
    expect(persisted.benchmark.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('automated scoring accepts'),
        expect.stringContaining('known-drop series samples'),
        expect.stringContaining('romance-core'),
      ])
    );
  });

  it('accepts required coverage and sequence thresholds from CLI arguments', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'series-retention-cli-required-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const benchmarkDir = join(projectDir, 'reviews', 'series-retention-benchmark');
    await mkdir(benchmarkDir, { recursive: true });
    await writeFile(
      join(benchmarkDir, 'series-retention-benchmark.json'),
      `${JSON.stringify(
        {
          samples: [
            {
              id: 'reader-retained-sequence',
              genre: 'mystery',
              target_reader: 'webnovel-core',
              expected_retained: true,
              calibration_split: 'calibration',
              rating_scale: 'likert-7',
              chapters: [
                retainedRawChapter(1, 91, 'setup-choice'),
                retainedRawChapter(2, 90, 'clue-payoff'),
                retainedRawChapter(3, 92, 'relationship-cost'),
              ],
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-series-retention-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-series-retention-benchmark.ts')],
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
        '--minimum-sequence-length',
        '3',
        '--maximum-retention-drop',
        '12',
        '--maximum-repeated-reward-signature-run',
        '2',
        '--maximum-repeated-emotional-signature-run',
        '2',
        '--maximum-dominant-emotional-signature-family-share',
        '0.67',
        '--require-hook-progress-evidence',
        '--minimum-hook-progress-event-count',
        '1',
        '--minimum-hook-progress-rate',
        '0.5',
        '--maximum-hook-stall-ratio',
        '0.5',
        '--minimum-samples-per-genre',
        '2',
        '--minimum-samples-per-target-reader',
        '2',
        '--min-holdout-samples',
        '1',
        '--min-usable-holdout-samples',
        '1',
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
    expect(output.minimumSequenceLength).toBe(3);
    expect(output.maximumRetentionDrop).toBe(12);
    expect(output.maximumRepeatedRewardSignatureRun).toBe(2);
    expect(output.maximumRepeatedEmotionalSignatureRun).toBe(2);
    expect(output.maximumDominantEmotionalSignatureFamilyShare).toBe(0.67);
    expect(output.requireHookProgressEvidence).toBe(true);
    expect(output.minimumHookProgressEventCount).toBe(1);
    expect(output.minimumHookProgressRate).toBe(0.5);
    expect(output.maximumHookStallRatio).toBe(0.5);
    expect(output.minimumSamplesPerGenre).toBe(2);
    expect(output.minimumSamplesPerTargetReader).toBe(2);
    expect(output.minimumHoldoutSampleCount).toBe(1);
    expect(output.minimumUsableHoldoutSampleCount).toBe(1);
    expect(output.minimumFailingHoldoutSampleCount).toBe(1);
    expect(output.minimumUsableFailingHoldoutSampleCount).toBe(1);
    expect(output.benchmark.missingRequiredGenres).toEqual(['thriller']);
    expect(output.benchmark.underSampledRequiredGenres).toEqual(['mystery', 'thriller']);
    expect(output.benchmark.missingRequiredTargetReaders).toEqual(['thriller-core']);
    expect(output.benchmark.underSampledRequiredTargetReaders).toEqual([
      'webnovel-core',
      'thriller-core',
    ]);
    expect(output.benchmark.splitCoverage).toMatchObject({
      calibrationSamples: 1,
      holdoutSamples: 0,
      usableHoldoutSamples: 0,
      failingHoldoutSamples: 0,
      usableFailingHoldoutSamples: 0,
    });
    expect(output.benchmark.underSampledHoldoutSamples).toBe(true);
    expect(output.benchmark.underSampledUsableHoldoutSamples).toBe(true);
    expect(output.benchmark.underSampledFailingHoldoutSamples).toBe(true);
    expect(output.benchmark.underSampledUsableFailingHoldoutSamples).toBe(true);
    expect(output.benchmark.readyForGateTuning).toBe(false);
  });
});

function retainedRawChapter(chapter: number, automatedScore: number, rewardSignature: string) {
  const funnel = retainedRawFunnel(chapter);
  return {
    chapter,
    automated_score: automatedScore,
    reward_signature: rewardSignature,
    emotional_signature: retainedRawEmotionalSignature(chapter),
    emotional_signature_family: retainedRawEmotionalSignatureFamily(chapter),
    hook_thread: '익명 발신자의 정체',
    ...funnel,
    ...retainedRawHookProgress(),
    reader_responses: [
      retainedRawResponse('reader-1'),
      retainedRawResponse('reader-2'),
      retainedRawResponse('reader-3'),
    ],
  };
}

function retainedRawResponse(readerId: string) {
  return {
    reader_id: readerId,
    target_reader_fit: true,
    ratings: {
      next_click: 7,
      fatigue_resistance: 6,
      hook_progress: 6,
      reward_variety: 6,
      payoff_satisfaction: 6,
      novelty: 6,
      emotional_reset: 6,
      confidence_in_payoff: 6,
    },
    would_continue: true,
    would_continue_score: 7,
    comment: '장기 훅이 한 칸 전진하고 보상 모양도 달라져 다음 화를 계속 보고 싶다.',
    freshness_points: ['새 단서', '다른 보상 형태'],
    rewrite_suggestion: '다음 검증 행동을 더 짧게 선언하면 클릭감이 강해진다.',
  };
}

function fatiguedRawChapter(chapter: number, automatedScore: number, score: number) {
  const funnel = fatiguedRawFunnel(chapter);
  return {
    chapter,
    automated_score: automatedScore,
    reward_signature: 'alert-investigation-phone-check',
    emotional_signature: 'alarm-dread-deferral',
    emotional_signature_family: 'dread',
    hook_thread: '익명 발신자의 정체',
    ...funnel,
    ...stalledRawHookProgress(),
    reader_responses: [
      fatiguedRawResponse('reader-4', score),
      fatiguedRawResponse('reader-5', score),
      fatiguedRawResponse('reader-6', score),
    ],
  };
}

function retainedRawEmotionalSignature(chapter: number): string {
  const signatures: Record<number, string> = {
    1: 'discovery-pressure-to-choice',
    2: 'clue-curiosity-to-trust',
    3: 'relationship-cost-to-resolve',
    7: 'alarm-dread-to-resolve',
    8: 'cold-clue-curiosity',
    9: 'relationship-cost-resolve',
  };
  return signatures[chapter] ?? `retained-emotional-${chapter}`;
}

function retainedRawEmotionalSignatureFamily(chapter: number): string {
  const families: Record<number, string> = {
    1: 'curiosity',
    2: 'curiosity',
    3: 'relief',
    7: 'dread',
    8: 'curiosity',
    9: 'relief',
  };
  return families[chapter] ?? 'relief';
}

function retainedRawHookProgress() {
  return {
    hook_open_thread_count: 2,
    hook_advanced_thread_count: 1,
    hook_resolved_thread_count: 0,
    hook_recontextualized_thread_count: 1,
    hook_new_thread_count: 1,
    hook_stalled_thread_count: 0,
  };
}

function stalledRawHookProgress() {
  return {
    hook_open_thread_count: 2,
    hook_advanced_thread_count: 0,
    hook_resolved_thread_count: 0,
    hook_recontextualized_thread_count: 0,
    hook_new_thread_count: 1,
    hook_stalled_thread_count: 2,
  };
}

function retainedRawFunnel(chapter: number) {
  const byChapter: Record<number, {
    started_read_count: number;
    completed_read_count: number;
    continued_read_count: number;
    drop_off_count: number;
    skimmed_read_count: number;
  }> = {
    1: { started_read_count: 100, completed_read_count: 94, continued_read_count: 84, drop_off_count: 4, skimmed_read_count: 6 },
    2: { started_read_count: 84, completed_read_count: 80, continued_read_count: 72, drop_off_count: 3, skimmed_read_count: 4 },
    3: { started_read_count: 72, completed_read_count: 70, continued_read_count: 63, drop_off_count: 1, skimmed_read_count: 3 },
    7: { started_read_count: 100, completed_read_count: 94, continued_read_count: 84, drop_off_count: 4, skimmed_read_count: 6 },
    8: { started_read_count: 84, completed_read_count: 80, continued_read_count: 72, drop_off_count: 3, skimmed_read_count: 4 },
    9: { started_read_count: 72, completed_read_count: 70, continued_read_count: 63, drop_off_count: 1, skimmed_read_count: 3 },
  };
  return byChapter[chapter] ?? byChapter[1];
}

function fatiguedRawFunnel(chapter: number) {
  const byChapter: Record<number, {
    started_read_count: number;
    completed_read_count: number;
    continued_read_count: number;
    drop_off_count: number;
    skimmed_read_count: number;
  }> = {
    10: { started_read_count: 100, completed_read_count: 85, continued_read_count: 65, drop_off_count: 10, skimmed_read_count: 15 },
    11: { started_read_count: 65, completed_read_count: 48, continued_read_count: 30, drop_off_count: 13, skimmed_read_count: 18 },
    12: { started_read_count: 30, completed_read_count: 20, continued_read_count: 10, drop_off_count: 9, skimmed_read_count: 8 },
  };
  return byChapter[chapter] ?? byChapter[10];
}

function fatiguedRawResponse(readerId: string, score: number) {
  return {
    reader_id: readerId,
    target_reader_fit: true,
    ratings: {
      next_click: score,
      fatigue_resistance: Math.max(1, score - 1),
      hook_progress: Math.max(1, score - 1),
      reward_variety: Math.max(1, score - 2),
      payoff_satisfaction: score,
      novelty: Math.max(1, score - 2),
      emotional_reset: Math.max(1, score - 1),
      confidence_in_payoff: score,
    },
    would_continue: score >= 5,
    would_continue_score: score,
    comment: '알림을 받고 확인한 뒤 비슷한 말미 의문으로 끝나서 반복 피로가 생긴다.',
    fatigue_points: ['같은 시작', '같은 조사 보상', '같은 말미 질문'],
    rewrite_suggestion: '보상 형태를 관계 대가나 확정 단서로 바꾸어야 한다.',
  };
}
