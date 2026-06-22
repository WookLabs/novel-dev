import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  evaluateSeriesRetentionBenchmark,
  type SeriesRetentionBenchmarkOptions,
  type SeriesRetentionBenchmarkResult,
  type SeriesRetentionBenchmarkSample,
  type SeriesRetentionCalibrationSplit,
  type SeriesRetentionChapterSample,
  type SeriesRetentionDimension,
  type SeriesRetentionEmotionalSignatureFamily,
  type SeriesRetentionRatingScale,
  type SeriesRetentionReaderResponse,
} from '../quality/series-retention-benchmark.js';
import {
  buildSourceEvidenceManifest,
  type SourceEvidenceManifest,
} from './source-evidence.js';

export interface RunSeriesRetentionBenchmarkProjectArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  readerRetentionThreshold?: number;
  automatedRetentionThreshold?: number;
  minimumDimensionScore?: number;
  requiredGenres?: string[];
  requiredTargetReaders?: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumStartedReadCount?: number;
  minimumCompletionRate?: number;
  minimumContinuationRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  requireFunnelEvidence?: boolean;
  requireHookProgressEvidence?: boolean;
  minimumHookProgressEventCount?: number;
  minimumHookProgressRate?: number;
  maximumHookStallRatio?: number;
  minimumSequenceLength?: number;
  maximumRetentionDrop?: number;
  maximumRepeatedRewardSignatureRun?: number;
  maximumRepeatedEmotionalSignatureRun?: number;
  maximumDominantEmotionalSignatureFamilyShare?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
}

export interface RunSeriesRetentionBenchmarkCliResult {
  projectId: string;
  projectDir: string;
  inputDir: string;
  outputPath: string;
  samplesLoaded: number;
  readerRetentionThreshold?: number;
  automatedRetentionThreshold?: number;
  minimumDimensionScore?: number;
  requiredGenres: string[];
  requiredTargetReaders: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumStartedReadCount?: number;
  minimumCompletionRate?: number;
  minimumContinuationRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  requireFunnelEvidence?: boolean;
  requireHookProgressEvidence?: boolean;
  minimumHookProgressEventCount?: number;
  minimumHookProgressRate?: number;
  maximumHookStallRatio?: number;
  minimumSequenceLength?: number;
  maximumRetentionDrop?: number;
  maximumRepeatedRewardSignatureRun?: number;
  maximumRepeatedEmotionalSignatureRun?: number;
  maximumDominantEmotionalSignatureFamilyShare?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  sourceEvidence: SourceEvidenceManifest;
  benchmark: SeriesRetentionBenchmarkResult;
}

interface RawSeriesRetentionBenchmarkFile {
  reader_retention_threshold?: number;
  automated_retention_threshold?: number;
  minimum_dimension_score?: number;
  required_genres?: string[];
  required_target_readers?: string[];
  minimum_panel_size?: number;
  minimum_commented_responses?: number;
  minimum_started_read_count?: number;
  minimum_completion_rate?: number;
  minimum_continuation_rate?: number;
  maximum_drop_off_ratio?: number;
  maximum_skimmed_read_ratio?: number;
  require_funnel_evidence?: boolean;
  require_hook_progress_evidence?: boolean;
  minimum_hook_progress_event_count?: number;
  minimum_hook_progress_rate?: number;
  maximum_hook_stall_ratio?: number;
  minimum_sequence_length?: number;
  maximum_retention_drop?: number;
  maximum_repeated_reward_signature_run?: number;
  maximum_repeated_emotional_signature_run?: number;
  maximum_dominant_emotional_signature_family_share?: number;
  minimum_samples_per_genre?: number;
  minimum_samples_per_target_reader?: number;
  minimum_holdout_samples?: number;
  minimum_usable_holdout_samples?: number;
  minimum_failing_holdout_samples?: number;
  minimum_usable_failing_holdout_samples?: number;
  samples?: RawSeriesRetentionBenchmarkSample[];
}

interface RawSeriesRetentionBenchmarkSample {
  id: string;
  label?: string;
  genre?: string;
  target_reader?: string;
  expected_retained?: boolean;
  calibration_split?: string;
  rating_scale?: SeriesRetentionRatingScale;
  chapters: RawSeriesRetentionChapterSample[];
}

interface RawSeriesRetentionChapterSample {
  chapter: number;
  title?: string;
  automated_score?: number;
  reward_signature?: string;
  emotional_signature?: string;
  emotional_signature_family?: string;
  hook_thread?: string;
  started_read_count?: number;
  completed_read_count?: number;
  continued_read_count?: number;
  drop_off_count?: number;
  skimmed_read_count?: number;
  hook_open_thread_count?: number;
  hook_advanced_thread_count?: number;
  hook_resolved_thread_count?: number;
  hook_recontextualized_thread_count?: number;
  hook_new_thread_count?: number;
  hook_stalled_thread_count?: number;
  reader_responses: RawSeriesRetentionReaderResponse[];
}

interface RawSeriesRetentionReaderResponse {
  reader_id?: string;
  target_reader_fit?: boolean;
  rating_scale?: SeriesRetentionRatingScale;
  ratings: Partial<Record<SeriesRetentionDimension, number>>;
  would_continue?: boolean;
  would_continue_score?: number;
  comment?: string;
  fatigue_points?: string[];
  freshness_points?: string[];
  rewrite_suggestion?: string;
}

interface LoadedRawSeriesRetentionBenchmarkSample {
  sample: RawSeriesRetentionBenchmarkSample;
}

export async function runSeriesRetentionBenchmarkFromProject(
  args: RunSeriesRetentionBenchmarkProjectArgs
): Promise<RunSeriesRetentionBenchmarkCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const inputDir = path.resolve(
    args.inputDir ?? path.join(projectDir, 'reviews', 'series-retention-benchmark')
  );
  const outputPath = path.resolve(
    args.outputPath ?? path.join(projectDir, 'reviews', 'series-retention-benchmark-report.json')
  );
  const project = await readOptionalJson(path.join(projectDir, 'meta', 'project.json'));
  const projectId = args.projectId ?? project?.project_id ?? project?.id ?? path.basename(projectDir);
  const raw = await readSeriesRetentionBenchmarkSamples(inputDir);
  const samples = raw.samples.map(loaded => normalizeSample(loaded.sample));
  const requiredGenres = uniqueStrings([
    ...raw.requiredGenres,
    ...(args.requiredGenres ?? []),
  ]);
  const requiredTargetReaders = uniqueStrings([
    ...raw.requiredTargetReaders,
    ...(args.requiredTargetReaders ?? []),
  ]);
  const readerRetentionThreshold = maxNonNegativeNumber([
    raw.readerRetentionThreshold,
    args.readerRetentionThreshold,
  ]);
  const automatedRetentionThreshold = maxNonNegativeNumber([
    raw.automatedRetentionThreshold,
    args.automatedRetentionThreshold,
  ]);
  const minimumDimensionScore = maxNonNegativeNumber([
    raw.minimumDimensionScore,
    args.minimumDimensionScore,
  ]);
  const minimumPanelSize = maxPositiveInteger([
    raw.minimumPanelSize,
    args.minimumPanelSize,
  ]);
  const minimumCommentedResponses = maxPositiveInteger([
    raw.minimumCommentedResponses,
    args.minimumCommentedResponses,
  ]);
  const minimumStartedReadCount = maxPositiveInteger([
    raw.minimumStartedReadCount,
    args.minimumStartedReadCount,
  ]);
  const minimumCompletionRate = maxRatio([
    raw.minimumCompletionRate,
    args.minimumCompletionRate,
  ]);
  const minimumContinuationRate = maxRatio([
    raw.minimumContinuationRate,
    args.minimumContinuationRate,
  ]);
  const maximumDropOffRatio = minRatio([
    raw.maximumDropOffRatio,
    args.maximumDropOffRatio,
  ]);
  const maximumSkimmedReadRatio = minRatio([
    raw.maximumSkimmedReadRatio,
    args.maximumSkimmedReadRatio,
  ]);
  const requireFunnelEvidence =
    args.requireFunnelEvidence ?? raw.requireFunnelEvidence;
  const requireHookProgressEvidence =
    args.requireHookProgressEvidence ?? raw.requireHookProgressEvidence;
  const minimumHookProgressEventCount = maxPositiveInteger([
    raw.minimumHookProgressEventCount,
    args.minimumHookProgressEventCount,
  ]);
  const minimumHookProgressRate = maxRatio([
    raw.minimumHookProgressRate,
    args.minimumHookProgressRate,
  ]);
  const maximumHookStallRatio = minRatio([
    raw.maximumHookStallRatio,
    args.maximumHookStallRatio,
  ]);
  const minimumSequenceLength = maxPositiveInteger([
    raw.minimumSequenceLength,
    args.minimumSequenceLength,
  ]);
  const maximumRetentionDrop = minNonNegativeNumber([
    raw.maximumRetentionDrop,
    args.maximumRetentionDrop,
  ]);
  const maximumRepeatedRewardSignatureRun = minPositiveInteger([
    raw.maximumRepeatedRewardSignatureRun,
    args.maximumRepeatedRewardSignatureRun,
  ]);
  const maximumRepeatedEmotionalSignatureRun = minPositiveInteger([
    raw.maximumRepeatedEmotionalSignatureRun,
    args.maximumRepeatedEmotionalSignatureRun,
  ]);
  const maximumDominantEmotionalSignatureFamilyShare = minRatio([
    raw.maximumDominantEmotionalSignatureFamilyShare,
    args.maximumDominantEmotionalSignatureFamilyShare,
  ]);
  const minimumSamplesPerGenre = maxPositiveInteger([
    raw.minimumSamplesPerGenre,
    args.minimumSamplesPerGenre,
  ]);
  const minimumSamplesPerTargetReader = maxPositiveInteger([
    raw.minimumSamplesPerTargetReader,
    args.minimumSamplesPerTargetReader,
  ]);
  const minimumHoldoutSampleCount = maxPositiveInteger([
    raw.minimumHoldoutSampleCount,
    args.minimumHoldoutSampleCount,
  ]);
  const minimumUsableHoldoutSampleCount = maxPositiveInteger([
    raw.minimumUsableHoldoutSampleCount,
    args.minimumUsableHoldoutSampleCount,
  ]);
  const minimumFailingHoldoutSampleCount = maxPositiveInteger([
    raw.minimumFailingHoldoutSampleCount,
    args.minimumFailingHoldoutSampleCount,
  ]);
  const minimumUsableFailingHoldoutSampleCount = maxPositiveInteger([
    raw.minimumUsableFailingHoldoutSampleCount,
    args.minimumUsableFailingHoldoutSampleCount,
  ]);
  const options: SeriesRetentionBenchmarkOptions = {
    readerRetentionThreshold,
    automatedRetentionThreshold,
    minimumDimensionScore,
    requiredGenres,
    requiredTargetReaders,
    minimumPanelSize,
    minimumCommentedResponses,
    minimumStartedReadCount,
    minimumCompletionRate,
    minimumContinuationRate,
    maximumDropOffRatio,
    maximumSkimmedReadRatio,
    requireFunnelEvidence,
    requireHookProgressEvidence,
    minimumHookProgressEventCount,
    minimumHookProgressRate,
    maximumHookStallRatio,
    minimumSequenceLength,
    maximumRetentionDrop,
    maximumRepeatedRewardSignatureRun,
    maximumRepeatedEmotionalSignatureRun,
    maximumDominantEmotionalSignatureFamilyShare,
    minimumSamplesPerGenre,
    minimumSamplesPerTargetReader,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumFailingHoldoutSampleCount,
    minimumUsableFailingHoldoutSampleCount,
  };
  const benchmark = evaluateSeriesRetentionBenchmark(samples, options);
  const sourceEvidence = await buildSourceEvidenceManifest(projectDir, [
    inputDir,
  ]);
  const result: RunSeriesRetentionBenchmarkCliResult = {
    projectId,
    projectDir,
    inputDir,
    outputPath,
    samplesLoaded: samples.length,
    readerRetentionThreshold,
    automatedRetentionThreshold,
    minimumDimensionScore,
    requiredGenres,
    requiredTargetReaders,
    minimumPanelSize,
    minimumCommentedResponses,
    minimumStartedReadCount,
    minimumCompletionRate,
    minimumContinuationRate,
    maximumDropOffRatio,
    maximumSkimmedReadRatio,
    requireFunnelEvidence,
    requireHookProgressEvidence,
    minimumHookProgressEventCount,
    minimumHookProgressRate,
    maximumHookStallRatio,
    minimumSequenceLength,
    maximumRetentionDrop,
    maximumRepeatedRewardSignatureRun,
    maximumRepeatedEmotionalSignatureRun,
    maximumDominantEmotionalSignatureFamilyShare,
    minimumSamplesPerGenre,
    minimumSamplesPerTargetReader,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumFailingHoldoutSampleCount,
    minimumUsableFailingHoldoutSampleCount,
    sourceEvidence,
    benchmark,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return result;
}

async function readSeriesRetentionBenchmarkSamples(
  inputDir: string
): Promise<{
  samples: LoadedRawSeriesRetentionBenchmarkSample[];
  readerRetentionThreshold?: number;
  automatedRetentionThreshold?: number;
  minimumDimensionScore?: number;
  requiredGenres: string[];
  requiredTargetReaders: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumStartedReadCount?: number;
  minimumCompletionRate?: number;
  minimumContinuationRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  requireFunnelEvidence?: boolean;
  requireHookProgressEvidence?: boolean;
  minimumHookProgressEventCount?: number;
  minimumHookProgressRate?: number;
  maximumHookStallRatio?: number;
  minimumSequenceLength?: number;
  maximumRetentionDrop?: number;
  maximumRepeatedRewardSignatureRun?: number;
  maximumRepeatedEmotionalSignatureRun?: number;
  maximumDominantEmotionalSignatureFamilyShare?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
}> {
  const files = await readJsonFiles(inputDir);
  if (files.length === 0) {
    throw new Error(`No series retention benchmark JSON files found in ${inputDir}`);
  }

  const samples: LoadedRawSeriesRetentionBenchmarkSample[] = [];
  const readerRetentionThresholds: Array<number | undefined> = [];
  const automatedRetentionThresholds: Array<number | undefined> = [];
  const minimumDimensionScores: Array<number | undefined> = [];
  const requiredGenres: string[] = [];
  const requiredTargetReaders: string[] = [];
  const minimumPanelSizes: Array<number | undefined> = [];
  const minimumCommentedResponses: Array<number | undefined> = [];
  const minimumStartedReadCounts: Array<number | undefined> = [];
  const minimumCompletionRates: Array<number | undefined> = [];
  const minimumContinuationRates: Array<number | undefined> = [];
  const maximumDropOffRatios: Array<number | undefined> = [];
  const maximumSkimmedReadRatios: Array<number | undefined> = [];
  const requireFunnelEvidenceValues: Array<boolean | undefined> = [];
  const requireHookProgressEvidenceValues: Array<boolean | undefined> = [];
  const minimumHookProgressEventCounts: Array<number | undefined> = [];
  const minimumHookProgressRates: Array<number | undefined> = [];
  const maximumHookStallRatios: Array<number | undefined> = [];
  const minimumSequenceLengths: Array<number | undefined> = [];
  const maximumRetentionDrops: Array<number | undefined> = [];
  const maximumRepeatedRewardSignatureRuns: Array<number | undefined> = [];
  const maximumRepeatedEmotionalSignatureRuns: Array<number | undefined> = [];
  const maximumDominantEmotionalSignatureFamilyShares: Array<number | undefined> = [];
  const minimumSamplesPerGenre: Array<number | undefined> = [];
  const minimumSamplesPerTargetReader: Array<number | undefined> = [];
  const minimumHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumUsableHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumFailingHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumUsableFailingHoldoutSampleCounts: Array<number | undefined> = [];

  for (const filePath of files) {
    const parsed = await readJson(filePath) as
      | RawSeriesRetentionBenchmarkFile
      | RawSeriesRetentionBenchmarkSample;
    if (Array.isArray((parsed as RawSeriesRetentionBenchmarkFile).samples)) {
      const suite = parsed as RawSeriesRetentionBenchmarkFile;
      samples.push(...(suite.samples ?? []).map(sample => ({ sample })));
      readerRetentionThresholds.push(suite.reader_retention_threshold);
      automatedRetentionThresholds.push(suite.automated_retention_threshold);
      minimumDimensionScores.push(suite.minimum_dimension_score);
      requiredGenres.push(...(suite.required_genres ?? []));
      requiredTargetReaders.push(...(suite.required_target_readers ?? []));
      minimumPanelSizes.push(suite.minimum_panel_size);
      minimumCommentedResponses.push(suite.minimum_commented_responses);
      minimumStartedReadCounts.push(suite.minimum_started_read_count);
      minimumCompletionRates.push(suite.minimum_completion_rate);
      minimumContinuationRates.push(suite.minimum_continuation_rate);
      maximumDropOffRatios.push(suite.maximum_drop_off_ratio);
      maximumSkimmedReadRatios.push(suite.maximum_skimmed_read_ratio);
      requireFunnelEvidenceValues.push(suite.require_funnel_evidence);
      requireHookProgressEvidenceValues.push(suite.require_hook_progress_evidence);
      minimumHookProgressEventCounts.push(suite.minimum_hook_progress_event_count);
      minimumHookProgressRates.push(suite.minimum_hook_progress_rate);
      maximumHookStallRatios.push(suite.maximum_hook_stall_ratio);
      minimumSequenceLengths.push(suite.minimum_sequence_length);
      maximumRetentionDrops.push(suite.maximum_retention_drop);
      maximumRepeatedRewardSignatureRuns.push(suite.maximum_repeated_reward_signature_run);
      maximumRepeatedEmotionalSignatureRuns.push(
        suite.maximum_repeated_emotional_signature_run
      );
      maximumDominantEmotionalSignatureFamilyShares.push(
        suite.maximum_dominant_emotional_signature_family_share
      );
      minimumSamplesPerGenre.push(suite.minimum_samples_per_genre);
      minimumSamplesPerTargetReader.push(suite.minimum_samples_per_target_reader);
      minimumHoldoutSampleCounts.push(suite.minimum_holdout_samples);
      minimumUsableHoldoutSampleCounts.push(suite.minimum_usable_holdout_samples);
      minimumFailingHoldoutSampleCounts.push(suite.minimum_failing_holdout_samples);
      minimumUsableFailingHoldoutSampleCounts.push(
        suite.minimum_usable_failing_holdout_samples
      );
    } else {
      samples.push({ sample: parsed as RawSeriesRetentionBenchmarkSample });
    }
  }

  if (samples.length === 0) {
    throw new Error(`Series retention benchmark files in ${inputDir} did not contain any samples`);
  }

  return {
    samples,
    readerRetentionThreshold: maxNonNegativeNumber(readerRetentionThresholds),
    automatedRetentionThreshold: maxNonNegativeNumber(automatedRetentionThresholds),
    minimumDimensionScore: maxNonNegativeNumber(minimumDimensionScores),
    requiredGenres: uniqueStrings(requiredGenres),
    requiredTargetReaders: uniqueStrings(requiredTargetReaders),
    minimumPanelSize: maxPositiveInteger(minimumPanelSizes),
    minimumCommentedResponses: maxPositiveInteger(minimumCommentedResponses),
    minimumStartedReadCount: maxPositiveInteger(minimumStartedReadCounts),
    minimumCompletionRate: maxRatio(minimumCompletionRates),
    minimumContinuationRate: maxRatio(minimumContinuationRates),
    maximumDropOffRatio: minRatio(maximumDropOffRatios),
    maximumSkimmedReadRatio: minRatio(maximumSkimmedReadRatios),
    requireFunnelEvidence: mergeBooleanRequirement(requireFunnelEvidenceValues),
    requireHookProgressEvidence: mergeBooleanRequirement(
      requireHookProgressEvidenceValues
    ),
    minimumHookProgressEventCount: maxPositiveInteger(
      minimumHookProgressEventCounts
    ),
    minimumHookProgressRate: maxRatio(minimumHookProgressRates),
    maximumHookStallRatio: minRatio(maximumHookStallRatios),
    minimumSequenceLength: maxPositiveInteger(minimumSequenceLengths),
    maximumRetentionDrop: minNonNegativeNumber(maximumRetentionDrops),
    maximumRepeatedRewardSignatureRun: minPositiveInteger(maximumRepeatedRewardSignatureRuns),
    maximumRepeatedEmotionalSignatureRun: minPositiveInteger(
      maximumRepeatedEmotionalSignatureRuns
    ),
    maximumDominantEmotionalSignatureFamilyShare: minRatio(
      maximumDominantEmotionalSignatureFamilyShares
    ),
    minimumSamplesPerGenre: maxPositiveInteger(minimumSamplesPerGenre),
    minimumSamplesPerTargetReader: maxPositiveInteger(minimumSamplesPerTargetReader),
    minimumHoldoutSampleCount: maxPositiveInteger(minimumHoldoutSampleCounts),
    minimumUsableHoldoutSampleCount: maxPositiveInteger(minimumUsableHoldoutSampleCounts),
    minimumFailingHoldoutSampleCount: maxPositiveInteger(minimumFailingHoldoutSampleCounts),
    minimumUsableFailingHoldoutSampleCount: maxPositiveInteger(
      minimumUsableFailingHoldoutSampleCounts
    ),
  };
}

function normalizeSample(
  sample: RawSeriesRetentionBenchmarkSample
): SeriesRetentionBenchmarkSample {
  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre,
    targetReader: sample.target_reader,
    expectedRetained: sample.expected_retained,
    calibrationSplit: normalizeCalibrationSplit(sample),
    ratingScale: sample.rating_scale,
    chapters: sample.chapters.map(normalizeChapter),
  };
}

function normalizeCalibrationSplit(
  sample: RawSeriesRetentionBenchmarkSample
): SeriesRetentionCalibrationSplit | undefined {
  if (sample.calibration_split === undefined) {
    return undefined;
  }
  if (
    sample.calibration_split === 'calibration' ||
    sample.calibration_split === 'validation' ||
    sample.calibration_split === 'holdout'
  ) {
    return sample.calibration_split;
  }
  throw new Error(
    `Invalid calibration_split for series retention benchmark sample ${sample.id}: ${sample.calibration_split}`
  );
}

function normalizeChapter(chapter: RawSeriesRetentionChapterSample): SeriesRetentionChapterSample {
  return {
    chapter: chapter.chapter,
    title: chapter.title,
    automatedScore: chapter.automated_score,
    rewardSignature: chapter.reward_signature,
    emotionalSignature: chapter.emotional_signature,
    emotionalSignatureFamily: normalizeEmotionalSignatureFamily(
      chapter.emotional_signature_family
    ),
    hookThread: chapter.hook_thread,
    startedReadCount: chapter.started_read_count,
    completedReadCount: chapter.completed_read_count,
    continuedReadCount: chapter.continued_read_count,
    dropOffCount: chapter.drop_off_count,
    skimmedReadCount: chapter.skimmed_read_count,
    hookOpenThreadCount: chapter.hook_open_thread_count,
    hookAdvancedThreadCount: chapter.hook_advanced_thread_count,
    hookResolvedThreadCount: chapter.hook_resolved_thread_count,
    hookRecontextualizedThreadCount: chapter.hook_recontextualized_thread_count,
    hookNewThreadCount: chapter.hook_new_thread_count,
    hookStalledThreadCount: chapter.hook_stalled_thread_count,
    readerResponses: chapter.reader_responses.map(normalizeReaderResponse),
  };
}

function normalizeEmotionalSignatureFamily(
  value: string | undefined
): SeriesRetentionEmotionalSignatureFamily | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (
    value === 'dread' ||
    value === 'shock' ||
    value === 'curiosity' ||
    value === 'relief' ||
    value === 'grief' ||
    value === 'intimacy' ||
    value === 'triumph' ||
    value === 'anger'
  ) {
    return value;
  }
  throw new Error(`Invalid emotional_signature_family: ${value}`);
}

function normalizeReaderResponse(
  response: RawSeriesRetentionReaderResponse
): SeriesRetentionReaderResponse {
  return {
    readerId: response.reader_id,
    targetReaderFit: response.target_reader_fit,
    ratingScale: response.rating_scale,
    ratings: response.ratings,
    wouldContinue: response.would_continue,
    wouldContinueScore: response.would_continue_score,
    comment: response.comment,
    fatiguePoints: response.fatigue_points,
    freshnessPoints: response.freshness_points,
    rewriteSuggestion: response.rewrite_suggestion,
  };
}

async function readJsonFiles(inputDir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(inputDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
      .map(entry => path.join(inputDir, entry.name))
      .sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function readJson(filePath: string): Promise<any> {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

async function readOptionalJson(filePath: string): Promise<any | undefined> {
  try {
    return await readJson(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(Boolean))];
}

function maxPositiveInteger(values: Array<number | undefined>): number | undefined {
  const integers = values.filter(
    (value): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0
  );
  return integers.length > 0 ? Math.max(...integers) : undefined;
}

function minPositiveInteger(values: Array<number | undefined>): number | undefined {
  const integers = values.filter(
    (value): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0
  );
  return integers.length > 0 ? Math.min(...integers) : undefined;
}

function maxNonNegativeNumber(values: Array<number | undefined>): number | undefined {
  const numbers = values.filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0
  );
  return numbers.length > 0 ? Math.max(...numbers) : undefined;
}

function minNonNegativeNumber(values: Array<number | undefined>): number | undefined {
  const numbers = values.filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0
  );
  return numbers.length > 0 ? Math.min(...numbers) : undefined;
}

function maxRatio(values: Array<number | undefined>): number | undefined {
  const ratios = values.filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
  );
  return ratios.length > 0 ? Math.max(...ratios) : undefined;
}

function minRatio(values: Array<number | undefined>): number | undefined {
  const ratios = values.filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
  );
  return ratios.length > 0 ? Math.min(...ratios) : undefined;
}

function mergeBooleanRequirement(values: Array<boolean | undefined>): boolean | undefined {
  const booleans = values.filter((value): value is boolean => typeof value === 'boolean');
  if (booleans.length === 0) return undefined;
  return booleans.some(Boolean);
}
