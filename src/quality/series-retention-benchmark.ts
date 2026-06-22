/**
 * Series Retention Benchmark
 *
 * Compares automated long-series engagement scores with target-reader response
 * sequences. This catches arcs that look mechanically suspenseful but lose
 * readers through fatigue, repeated reward/emotional patterns, or stalled hook progress.
 *
 * @module quality/series-retention-benchmark
 */

import { createHash } from 'node:crypto';

export type SeriesRetentionDimension =
  | 'next_click'
  | 'fatigue_resistance'
  | 'hook_progress'
  | 'reward_variety'
  | 'payoff_satisfaction'
  | 'novelty'
  | 'emotional_reset'
  | 'confidence_in_payoff';

export type SeriesRetentionRatingScale = 'likert-7' | 'percent-100';

export const SERIES_RETENTION_EMOTIONAL_SIGNATURE_FAMILIES = [
  'dread',
  'shock',
  'curiosity',
  'relief',
  'grief',
  'intimacy',
  'triumph',
  'anger',
] as const;

export type SeriesRetentionEmotionalSignatureFamily =
  (typeof SERIES_RETENTION_EMOTIONAL_SIGNATURE_FAMILIES)[number];

export type SeriesRetentionCalibrationSplit =
  | 'calibration'
  | 'validation'
  | 'holdout';

export type SeriesRetentionFunnelEvidence = 'none' | 'weak' | 'usable';

export type SeriesRetentionHookProgressEvidence = 'none' | 'weak' | 'usable';

export type SeriesRetentionFailureType =
  | 'automated-false-positive'
  | 'automated-false-negative'
  | 'reader-label-mismatch'
  | 'weak-reader-retention'
  | 'weak-dimension'
  | 'reader-retention-drop'
  | 'reader-funnel-drop'
  | 'weak-funnel-evidence'
  | 'reader-hook-stall'
  | 'weak-hook-progress-evidence'
  | 'repetitive-reward-pattern'
  | 'repetitive-emotional-pattern'
  | 'narrow-emotional-palette'
  | 'insufficient-reader-evidence'
  | 'short-sequence';

export interface SeriesRetentionReaderResponse {
  readerId?: string;
  targetReaderFit?: boolean;
  ratingScale?: SeriesRetentionRatingScale;
  ratings: Partial<Record<SeriesRetentionDimension, number>>;
  wouldContinue?: boolean;
  wouldContinueScore?: number;
  comment?: string;
  fatiguePoints?: string[];
  freshnessPoints?: string[];
  rewriteSuggestion?: string;
}

export interface SeriesRetentionChapterSample {
  chapter: number;
  title?: string;
  automatedScore?: number;
  rewardSignature?: string;
  emotionalSignature?: string;
  emotionalSignatureFamily?: SeriesRetentionEmotionalSignatureFamily;
  hookThread?: string;
  startedReadCount?: number;
  completedReadCount?: number;
  continuedReadCount?: number;
  dropOffCount?: number;
  skimmedReadCount?: number;
  hookOpenThreadCount?: number;
  hookAdvancedThreadCount?: number;
  hookResolvedThreadCount?: number;
  hookRecontextualizedThreadCount?: number;
  hookNewThreadCount?: number;
  hookStalledThreadCount?: number;
  readerResponses: SeriesRetentionReaderResponse[];
}

export interface SeriesRetentionBenchmarkSample {
  id: string;
  label?: string;
  genre?: string;
  targetReader?: string;
  expectedRetained?: boolean;
  calibrationSplit?: SeriesRetentionCalibrationSplit;
  ratingScale?: SeriesRetentionRatingScale;
  chapters: SeriesRetentionChapterSample[];
}

export interface SeriesRetentionBenchmarkOptions {
  readerRetentionThreshold?: number;
  automatedRetentionThreshold?: number;
  minimumDimensionScore?: number;
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
  requiredGenres?: string[];
  requiredTargetReaders?: string[];
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  requireHoldoutForGateTuning?: boolean;
}

export interface SeriesRetentionDimensionResult {
  dimension: SeriesRetentionDimension;
  score: number;
  responseCount: number;
  passed: boolean;
}

export interface SeriesRetentionChapterResult {
  chapter: number;
  title?: string;
  automatedScore?: number;
  automatedPassed?: boolean;
  rewardSignature?: string;
  emotionalSignature?: string;
  emotionalSignatureFamily?: SeriesRetentionEmotionalSignatureFamily;
  hookThread?: string;
  readerRetentionScore: number;
  readerPassed: boolean;
  wouldContinueScore?: number;
  funnelEvidence: SeriesRetentionFunnelEvidence;
  funnelPassed: boolean;
  hookProgressEvidence: SeriesRetentionHookProgressEvidence;
  hookProgressPassed: boolean;
  startedReadCount?: number;
  completedReadCount?: number;
  continuedReadCount?: number;
  dropOffCount?: number;
  skimmedReadCount?: number;
  hookOpenThreadCount?: number;
  hookAdvancedThreadCount?: number;
  hookResolvedThreadCount?: number;
  hookRecontextualizedThreadCount?: number;
  hookNewThreadCount?: number;
  hookStalledThreadCount?: number;
  completionRate?: number;
  continuationRate?: number;
  dropOffRatio?: number;
  skimmedReadRatio?: number;
  hookProgressEventCount?: number;
  hookProgressRate?: number;
  hookStallRatio?: number;
  responseCount: number;
  commentedResponseCount: number;
  evidenceSufficient: boolean;
  weakDimensions: SeriesRetentionDimension[];
  dimensionResults: SeriesRetentionDimensionResult[];
}

export interface SeriesRetentionBenchmarkSampleResult {
  id: string;
  label?: string;
  genre?: string;
  targetReader?: string;
  expectedRetained?: boolean;
  calibrationSplit?: SeriesRetentionCalibrationSplit;
  evidenceFingerprint: string;
  sequenceLength: number;
  automatedRetentionScore?: number;
  automatedPassed?: boolean;
  readerRetentionScore: number;
  firstChapterRetentionScore: number;
  lastChapterRetentionScore: number;
  retentionDrop: number;
  funnelEvidence: SeriesRetentionFunnelEvidence;
  weakFunnelEvidenceChapterCount: number;
  funnelDropChapterCount: number;
  hookProgressEvidence: SeriesRetentionHookProgressEvidence;
  weakHookProgressEvidenceChapterCount: number;
  hookStallChapterCount: number;
  minimumContinuationRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  minimumHookProgressRate?: number;
  maximumHookStallRatio?: number;
  readerPassed: boolean;
  repeatedRewardSignatureRun: number;
  repeatedEmotionalSignatureRun: number;
  dominantEmotionalSignatureFamily?: SeriesRetentionEmotionalSignatureFamily;
  dominantEmotionalSignatureFamilyShare?: number;
  responseCount: number;
  commentedResponseCount: number;
  evidenceSufficient: boolean;
  weakDimensions: SeriesRetentionDimension[];
  chapterResults: SeriesRetentionChapterResult[];
  passed: boolean;
  failureTypes: SeriesRetentionFailureType[];
  failureType?: SeriesRetentionFailureType;
  recommendations: string[];
}

export interface SeriesRetentionBenchmarkCoverage {
  total: number;
  positive: number;
  negative: number;
}

export interface SeriesRetentionBenchmarkSplitCoverage {
  calibrationSamples: number;
  validationSamples: number;
  holdoutSamples: number;
  unassignedSamples: number;
  usableCalibrationSamples: number;
  usableValidationSamples: number;
  usableHoldoutSamples: number;
  usableUnassignedSamples: number;
  failingHoldoutSamples: number;
  usableFailingHoldoutSamples: number;
}

export interface SeriesRetentionBenchmarkSplitLeakage {
  fingerprint: string;
  sampleIds: string[];
  calibrationSplits: SeriesRetentionCalibrationSplit[];
}

export interface SeriesRetentionBenchmarkResult {
  total: number;
  passed: number;
  failed: number;
  accuracy: number;
  automatedFalsePositiveCount: number;
  automatedFalseNegativeCount: number;
  readerLabelMismatchCount: number;
  weakReaderRetentionCount: number;
  weakDimensionCount: number;
  retentionDropCount: number;
  funnelDropCount: number;
  weakFunnelEvidenceCount: number;
  hookStallCount: number;
  weakHookProgressEvidenceCount: number;
  repetitiveRewardPatternCount: number;
  repetitiveEmotionalPatternCount: number;
  narrowEmotionalPaletteCount: number;
  insufficientEvidenceCount: number;
  shortSequenceCount: number;
  genreCoverage: Record<string, SeriesRetentionBenchmarkCoverage>;
  targetReaderCoverage: Record<string, SeriesRetentionBenchmarkCoverage>;
  splitCoverage: SeriesRetentionBenchmarkSplitCoverage;
  missingRequiredGenres: string[];
  underSampledRequiredGenres: string[];
  missingRequiredPositiveGenres: string[];
  missingRequiredNegativeGenres: string[];
  missingRequiredTargetReaders: string[];
  underSampledRequiredTargetReaders: string[];
  missingRequiredPositiveTargetReaders: string[];
  missingRequiredNegativeTargetReaders: string[];
  underSampledHoldoutSamples: boolean;
  underSampledUsableHoldoutSamples: boolean;
  underSampledFailingHoldoutSamples: boolean;
  underSampledUsableFailingHoldoutSamples: boolean;
  splitLeakageCount: number;
  splitLeakages: SeriesRetentionBenchmarkSplitLeakage[];
  readyForGateTuning: boolean;
  recommendations: string[];
  sampleResults: SeriesRetentionBenchmarkSampleResult[];
}

const DEFAULT_READER_RETENTION_THRESHOLD = 72;
const DEFAULT_AUTOMATED_RETENTION_THRESHOLD = 85;
const DEFAULT_MINIMUM_DIMENSION_SCORE = 60;
const DEFAULT_MINIMUM_PANEL_SIZE = 3;
const DEFAULT_MINIMUM_COMMENTED_RESPONSES = 2;
const DEFAULT_MINIMUM_STARTED_READ_COUNT = 20;
const DEFAULT_MINIMUM_COMPLETION_RATE = 0.72;
const DEFAULT_MINIMUM_CONTINUATION_RATE = 0.55;
const DEFAULT_MAXIMUM_DROP_OFF_RATIO = 0.25;
const DEFAULT_MAXIMUM_SKIMMED_READ_RATIO = 0.2;
const DEFAULT_MINIMUM_HOOK_PROGRESS_EVENT_COUNT = 1;
const DEFAULT_MINIMUM_HOOK_PROGRESS_RATE = 0.5;
const DEFAULT_MAXIMUM_HOOK_STALL_RATIO = 0.5;
const DEFAULT_MINIMUM_SEQUENCE_LENGTH = 3;
const DEFAULT_MAXIMUM_RETENTION_DROP = 12;
const DEFAULT_MAXIMUM_REPEATED_REWARD_SIGNATURE_RUN = 2;
const DEFAULT_MAXIMUM_REPEATED_EMOTIONAL_SIGNATURE_RUN = 2;
const DEFAULT_MAXIMUM_DOMINANT_EMOTIONAL_SIGNATURE_FAMILY_SHARE = 0.67;
const DEFAULT_MINIMUM_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_FAILING_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_FAILING_HOLDOUT_SAMPLE_COUNT = 1;

const DIMENSION_WEIGHTS: Record<SeriesRetentionDimension, number> = {
  next_click: 0.22,
  fatigue_resistance: 0.16,
  hook_progress: 0.16,
  reward_variety: 0.12,
  payoff_satisfaction: 0.12,
  novelty: 0.09,
  emotional_reset: 0.07,
  confidence_in_payoff: 0.06,
};

const DIMENSIONS = Object.keys(DIMENSION_WEIGHTS) as SeriesRetentionDimension[];

const EMOTIONAL_SIGNATURE_FAMILIES: ReadonlyArray<{
  family: SeriesRetentionEmotionalSignatureFamily;
  terms: readonly string[];
}> = [
  {
    family: 'dread',
    terms: [
      'alarm',
      'anxiety',
      'anxious',
      'dread',
      'fear',
      'fearful',
      'panic',
      'suspense',
      'terror',
      'threat',
      'unease',
      'uneasy',
      'worry',
    ],
  },
  {
    family: 'shock',
    terms: [
      'astonishment',
      'disbelief',
      'reversal',
      'shock',
      'stunned',
      'surprise',
      'twist',
    ],
  },
  {
    family: 'curiosity',
    terms: [
      'clue',
      'curiosity',
      'curious',
      'doubt',
      'intrigue',
      'mystery',
      'question',
      'suspicion',
    ],
  },
  {
    family: 'relief',
    terms: [
      'calm',
      'closure',
      'comfort',
      'hope',
      'relief',
      'resolve',
      'resolved',
      'safety',
    ],
  },
  {
    family: 'grief',
    terms: [
      'despair',
      'grief',
      'guilt',
      'hurt',
      'loss',
      'regret',
      'sadness',
      'shame',
    ],
  },
  {
    family: 'intimacy',
    terms: [
      'affection',
      'intimacy',
      'longing',
      'romance',
      'tenderness',
      'trust',
      'vulnerability',
      'yearning',
    ],
  },
  {
    family: 'triumph',
    terms: [
      'awe',
      'delight',
      'joy',
      'revelation',
      'triumph',
      'victory',
      'wonder',
    ],
  },
  {
    family: 'anger',
    terms: [
      'anger',
      'defiance',
      'rage',
      'resentment',
    ],
  },
];

export function evaluateSeriesRetentionBenchmark(
  samples: SeriesRetentionBenchmarkSample[],
  options: SeriesRetentionBenchmarkOptions = {}
): SeriesRetentionBenchmarkResult {
  const normalizedOptions = normalizeOptions(options);
  const sampleResults = samples.map(sample =>
    evaluateSeriesRetentionSample(sample, normalizedOptions)
  );
  const passed = sampleResults.filter(result => result.passed).length;
  const genreCoverage = countCoverage(sampleResults, result => result.genre);
  const targetReaderCoverage = countCoverage(sampleResults, result => result.targetReader);
  const splitCoverage = countSplitCoverage(sampleResults);
  const splitLeakages = detectSplitLeakages(sampleResults);
  const missingRequiredGenres = missingRequiredKeys(
    normalizedOptions.requiredGenres,
    genreCoverage
  );
  const underSampledRequiredGenres = underSampledRequiredKeys(
    normalizedOptions.requiredGenres,
    genreCoverage,
    normalizedOptions.minimumSamplesPerGenre
  );
  const missingRequiredPositiveGenres = missingRequiredPolarity(
    normalizedOptions.requiredGenres,
    genreCoverage,
    'positive'
  );
  const missingRequiredNegativeGenres = missingRequiredPolarity(
    normalizedOptions.requiredGenres,
    genreCoverage,
    'negative'
  );
  const missingRequiredTargetReaders = missingRequiredKeys(
    normalizedOptions.requiredTargetReaders,
    targetReaderCoverage
  );
  const underSampledRequiredTargetReaders = underSampledRequiredKeys(
    normalizedOptions.requiredTargetReaders,
    targetReaderCoverage,
    normalizedOptions.minimumSamplesPerTargetReader
  );
  const missingRequiredPositiveTargetReaders = missingRequiredPolarity(
    normalizedOptions.requiredTargetReaders,
    targetReaderCoverage,
    'positive'
  );
  const missingRequiredNegativeTargetReaders = missingRequiredPolarity(
    normalizedOptions.requiredTargetReaders,
    targetReaderCoverage,
    'negative'
  );
  const underSampledHoldoutSamples =
    normalizedOptions.requireHoldoutForGateTuning &&
    splitCoverage.holdoutSamples < normalizedOptions.minimumHoldoutSampleCount;
  const underSampledUsableHoldoutSamples =
    normalizedOptions.requireHoldoutForGateTuning &&
    splitCoverage.usableHoldoutSamples < normalizedOptions.minimumUsableHoldoutSampleCount;
  const underSampledFailingHoldoutSamples =
    normalizedOptions.requireHoldoutForGateTuning &&
    splitCoverage.failingHoldoutSamples < normalizedOptions.minimumFailingHoldoutSampleCount;
  const underSampledUsableFailingHoldoutSamples =
    normalizedOptions.requireHoldoutForGateTuning &&
    splitCoverage.usableFailingHoldoutSamples <
      normalizedOptions.minimumUsableFailingHoldoutSampleCount;

  const result: SeriesRetentionBenchmarkResult = {
    total: sampleResults.length,
    passed,
    failed: sampleResults.length - passed,
    accuracy: sampleResults.length === 0 ? 1 : passed / sampleResults.length,
    automatedFalsePositiveCount: countFailureType(sampleResults, 'automated-false-positive'),
    automatedFalseNegativeCount: countFailureType(sampleResults, 'automated-false-negative'),
    readerLabelMismatchCount: countFailureType(sampleResults, 'reader-label-mismatch'),
    weakReaderRetentionCount: countFailureType(sampleResults, 'weak-reader-retention'),
    weakDimensionCount: countFailureType(sampleResults, 'weak-dimension'),
    retentionDropCount: countFailureType(sampleResults, 'reader-retention-drop'),
    funnelDropCount: countFailureType(sampleResults, 'reader-funnel-drop'),
    weakFunnelEvidenceCount: countFailureType(sampleResults, 'weak-funnel-evidence'),
    hookStallCount: countFailureType(sampleResults, 'reader-hook-stall'),
    weakHookProgressEvidenceCount: countFailureType(
      sampleResults,
      'weak-hook-progress-evidence'
    ),
    repetitiveRewardPatternCount: countFailureType(sampleResults, 'repetitive-reward-pattern'),
    repetitiveEmotionalPatternCount: countFailureType(
      sampleResults,
      'repetitive-emotional-pattern'
    ),
    narrowEmotionalPaletteCount: countFailureType(sampleResults, 'narrow-emotional-palette'),
    insufficientEvidenceCount: countFailureType(sampleResults, 'insufficient-reader-evidence'),
    shortSequenceCount: countFailureType(sampleResults, 'short-sequence'),
    genreCoverage,
    targetReaderCoverage,
    splitCoverage,
    missingRequiredGenres,
    underSampledRequiredGenres,
    missingRequiredPositiveGenres,
    missingRequiredNegativeGenres,
    missingRequiredTargetReaders,
    underSampledRequiredTargetReaders,
    missingRequiredPositiveTargetReaders,
    missingRequiredNegativeTargetReaders,
    underSampledHoldoutSamples,
    underSampledUsableHoldoutSamples,
    underSampledFailingHoldoutSamples,
    underSampledUsableFailingHoldoutSamples,
    splitLeakageCount: splitLeakages.length,
    splitLeakages,
    readyForGateTuning: false,
    recommendations: [],
    sampleResults,
  };

  result.readyForGateTuning = isReadyForGateTuning(result);
  result.recommendations = buildRecommendations(result, normalizedOptions);
  return result;
}

type NormalizedOptions = Required<
  Pick<
    SeriesRetentionBenchmarkOptions,
    | 'readerRetentionThreshold'
    | 'automatedRetentionThreshold'
    | 'minimumDimensionScore'
    | 'minimumPanelSize'
    | 'minimumCommentedResponses'
    | 'minimumStartedReadCount'
    | 'minimumCompletionRate'
    | 'minimumContinuationRate'
    | 'maximumDropOffRatio'
    | 'maximumSkimmedReadRatio'
    | 'requireFunnelEvidence'
    | 'requireHookProgressEvidence'
    | 'minimumHookProgressEventCount'
    | 'minimumHookProgressRate'
    | 'maximumHookStallRatio'
    | 'minimumSequenceLength'
    | 'maximumRetentionDrop'
    | 'maximumRepeatedRewardSignatureRun'
    | 'maximumRepeatedEmotionalSignatureRun'
    | 'maximumDominantEmotionalSignatureFamilyShare'
    | 'minimumSamplesPerGenre'
    | 'minimumSamplesPerTargetReader'
    | 'minimumHoldoutSampleCount'
    | 'minimumUsableHoldoutSampleCount'
    | 'minimumFailingHoldoutSampleCount'
    | 'minimumUsableFailingHoldoutSampleCount'
  >
> & {
  requiredGenres: string[];
  requiredTargetReaders: string[];
  requireHoldoutForGateTuning: boolean;
};

function normalizeOptions(options: SeriesRetentionBenchmarkOptions): NormalizedOptions {
  return {
    readerRetentionThreshold:
      options.readerRetentionThreshold ?? DEFAULT_READER_RETENTION_THRESHOLD,
    automatedRetentionThreshold:
      options.automatedRetentionThreshold ?? DEFAULT_AUTOMATED_RETENTION_THRESHOLD,
    minimumDimensionScore: options.minimumDimensionScore ?? DEFAULT_MINIMUM_DIMENSION_SCORE,
    minimumPanelSize: options.minimumPanelSize ?? DEFAULT_MINIMUM_PANEL_SIZE,
    minimumCommentedResponses:
      options.minimumCommentedResponses ?? DEFAULT_MINIMUM_COMMENTED_RESPONSES,
    minimumStartedReadCount:
      options.minimumStartedReadCount ?? DEFAULT_MINIMUM_STARTED_READ_COUNT,
    minimumCompletionRate:
      options.minimumCompletionRate ?? DEFAULT_MINIMUM_COMPLETION_RATE,
    minimumContinuationRate:
      options.minimumContinuationRate ?? DEFAULT_MINIMUM_CONTINUATION_RATE,
    maximumDropOffRatio:
      options.maximumDropOffRatio ?? DEFAULT_MAXIMUM_DROP_OFF_RATIO,
    maximumSkimmedReadRatio:
      options.maximumSkimmedReadRatio ?? DEFAULT_MAXIMUM_SKIMMED_READ_RATIO,
    requireFunnelEvidence: options.requireFunnelEvidence ?? true,
    requireHookProgressEvidence: options.requireHookProgressEvidence ?? false,
    minimumHookProgressEventCount: positiveIntegerOrDefault(
      options.minimumHookProgressEventCount,
      DEFAULT_MINIMUM_HOOK_PROGRESS_EVENT_COUNT
    ),
    minimumHookProgressRate:
      options.minimumHookProgressRate ?? DEFAULT_MINIMUM_HOOK_PROGRESS_RATE,
    maximumHookStallRatio:
      options.maximumHookStallRatio ?? DEFAULT_MAXIMUM_HOOK_STALL_RATIO,
    minimumSequenceLength: options.minimumSequenceLength ?? DEFAULT_MINIMUM_SEQUENCE_LENGTH,
    maximumRetentionDrop: options.maximumRetentionDrop ?? DEFAULT_MAXIMUM_RETENTION_DROP,
    maximumRepeatedRewardSignatureRun:
      options.maximumRepeatedRewardSignatureRun ??
      DEFAULT_MAXIMUM_REPEATED_REWARD_SIGNATURE_RUN,
    maximumRepeatedEmotionalSignatureRun:
      options.maximumRepeatedEmotionalSignatureRun ??
      DEFAULT_MAXIMUM_REPEATED_EMOTIONAL_SIGNATURE_RUN,
    maximumDominantEmotionalSignatureFamilyShare:
      options.maximumDominantEmotionalSignatureFamilyShare ??
      DEFAULT_MAXIMUM_DOMINANT_EMOTIONAL_SIGNATURE_FAMILY_SHARE,
    requiredGenres: uniqueStrings(options.requiredGenres ?? []),
    requiredTargetReaders: uniqueStrings(options.requiredTargetReaders ?? []),
    minimumSamplesPerGenre: options.minimumSamplesPerGenre ?? 1,
    minimumSamplesPerTargetReader: options.minimumSamplesPerTargetReader ?? 1,
    minimumHoldoutSampleCount: positiveIntegerOrDefault(
      options.minimumHoldoutSampleCount,
      DEFAULT_MINIMUM_HOLDOUT_SAMPLE_COUNT
    ),
    minimumUsableHoldoutSampleCount: positiveIntegerOrDefault(
      options.minimumUsableHoldoutSampleCount,
      DEFAULT_MINIMUM_USABLE_HOLDOUT_SAMPLE_COUNT
    ),
    minimumFailingHoldoutSampleCount: positiveIntegerOrDefault(
      options.minimumFailingHoldoutSampleCount,
      DEFAULT_MINIMUM_FAILING_HOLDOUT_SAMPLE_COUNT
    ),
    minimumUsableFailingHoldoutSampleCount: positiveIntegerOrDefault(
      options.minimumUsableFailingHoldoutSampleCount,
      DEFAULT_MINIMUM_USABLE_FAILING_HOLDOUT_SAMPLE_COUNT
    ),
    requireHoldoutForGateTuning: options.requireHoldoutForGateTuning ?? true,
  };
}

function evaluateSeriesRetentionSample(
  sample: SeriesRetentionBenchmarkSample,
  options: NormalizedOptions
): SeriesRetentionBenchmarkSampleResult {
  const chapters = [...sample.chapters].sort((a, b) => a.chapter - b.chapter);
  const chapterResults = chapters.map(chapter =>
    evaluateSeriesRetentionChapter(chapter, sample, options)
  );
  const automatedScores = chapterResults
    .map(result => result.automatedScore)
    .filter((score): score is number => score !== undefined);
  const automatedRetentionScore =
    automatedScores.length === 0 ? undefined : average(automatedScores);
  const automatedPassed =
    automatedRetentionScore === undefined
      ? undefined
      : automatedRetentionScore >= options.automatedRetentionThreshold;
  const retentionScores = chapterResults.map(result => result.readerRetentionScore);
  const readerRetentionScore = retentionScores.length === 0 ? 0 : average(retentionScores);
  const firstChapterRetentionScore = retentionScores[0] ?? 0;
  const lastChapterRetentionScore = retentionScores[retentionScores.length - 1] ?? 0;
  const retentionDrop = firstChapterRetentionScore - lastChapterRetentionScore;
  const funnelEvidence = aggregateFunnelEvidence(chapterResults);
  const hookProgressEvidence = aggregateHookProgressEvidence(chapterResults);
  const weakFunnelEvidenceChapterCount = chapterResults.filter(result =>
    isWeakFunnelEvidence(result.funnelEvidence, options)
  ).length;
  const funnelDropChapterCount = chapterResults.filter(result =>
    result.funnelEvidence === 'usable' && !result.funnelPassed
  ).length;
  const weakHookProgressEvidenceChapterCount = chapterResults.filter(result =>
    isWeakHookProgressEvidence(result.hookProgressEvidence, options)
  ).length;
  const hookStallChapterCount = chapterResults.filter(result =>
    result.hookProgressEvidence === 'usable' && !result.hookProgressPassed
  ).length;
  const continuationRates = chapterResults
    .map(result => result.continuationRate)
    .filter((rate): rate is number => rate !== undefined);
  const dropOffRatios = chapterResults
    .map(result => result.dropOffRatio)
    .filter((ratio): ratio is number => ratio !== undefined);
  const skimmedRatios = chapterResults
    .map(result => result.skimmedReadRatio)
    .filter((ratio): ratio is number => ratio !== undefined);
  const hookProgressRates = chapterResults
    .map(result => result.hookProgressRate)
    .filter((rate): rate is number => rate !== undefined);
  const hookStallRatios = chapterResults
    .map(result => result.hookStallRatio)
    .filter((ratio): ratio is number => ratio !== undefined);
  const repeatedRewardSignatureRun = longestRewardSignatureRun(chapters);
  const repeatedEmotionalSignatureRun = longestEmotionalSignatureRun(chapters);
  const emotionalPalette = dominantEmotionalSignatureFamilyShare(chapters);
  const responseCount = chapterResults.reduce((sum, result) => sum + result.responseCount, 0);
  const commentedResponseCount = chapterResults.reduce(
    (sum, result) => sum + result.commentedResponseCount,
    0
  );
  const evidenceSufficient =
    chapterResults.length > 0 && chapterResults.every(result => result.evidenceSufficient);
  const weakDimensions = aggregateWeakDimensions(chapterResults);
  const sequenceLength = chapters.length;
  const funnelPassed =
    weakFunnelEvidenceChapterCount === 0 &&
    funnelDropChapterCount === 0 &&
    (!options.requireFunnelEvidence || funnelEvidence === 'usable');
  const hookProgressPassed =
    weakHookProgressEvidenceChapterCount === 0 &&
    hookStallChapterCount === 0 &&
    (!options.requireHookProgressEvidence || hookProgressEvidence === 'usable');
  const readerPassed =
    sequenceLength >= options.minimumSequenceLength &&
    readerRetentionScore >= options.readerRetentionThreshold &&
    retentionDrop <= options.maximumRetentionDrop &&
    funnelPassed &&
    hookProgressPassed &&
    repeatedRewardSignatureRun <= options.maximumRepeatedRewardSignatureRun &&
    repeatedEmotionalSignatureRun <= options.maximumRepeatedEmotionalSignatureRun &&
    (emotionalPalette.dominantShare === undefined ||
      emotionalPalette.dominantShare <=
        options.maximumDominantEmotionalSignatureFamilyShare);
  const failureTypes = determineFailureTypes({
    sample,
    sequenceLength,
    readerPassed,
    automatedPassed,
    readerRetentionScore,
    retentionDrop,
    repeatedRewardSignatureRun,
    repeatedEmotionalSignatureRun,
    dominantEmotionalSignatureFamilyShare: emotionalPalette.dominantShare,
    evidenceSufficient,
    weakDimensions,
    weakFunnelEvidenceChapterCount,
    funnelDropChapterCount,
    weakHookProgressEvidenceChapterCount,
    hookStallChapterCount,
    options,
  });
  const recommendations = buildSampleRecommendations(
    sample,
    failureTypes,
    weakDimensions,
    readerRetentionScore,
    retentionDrop,
    weakFunnelEvidenceChapterCount,
    funnelDropChapterCount,
    weakHookProgressEvidenceChapterCount,
    hookStallChapterCount,
    repeatedRewardSignatureRun,
    repeatedEmotionalSignatureRun,
    emotionalPalette.dominantFamily,
    emotionalPalette.dominantShare
  );

  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre,
    targetReader: sample.targetReader,
    expectedRetained: sample.expectedRetained,
    calibrationSplit: sample.calibrationSplit,
    evidenceFingerprint: fingerprintSampleEvidence(sample),
    sequenceLength,
    automatedRetentionScore:
      automatedRetentionScore === undefined ? undefined : roundScore(automatedRetentionScore),
    automatedPassed,
    readerRetentionScore: roundScore(readerRetentionScore),
    firstChapterRetentionScore: roundScore(firstChapterRetentionScore),
    lastChapterRetentionScore: roundScore(lastChapterRetentionScore),
    retentionDrop: roundScore(retentionDrop),
    funnelEvidence,
    weakFunnelEvidenceChapterCount,
    funnelDropChapterCount,
    hookProgressEvidence,
    weakHookProgressEvidenceChapterCount,
    hookStallChapterCount,
    minimumContinuationRate:
      continuationRates.length === 0 ? undefined : roundRatio(Math.min(...continuationRates)),
    maximumDropOffRatio:
      dropOffRatios.length === 0 ? undefined : roundRatio(Math.max(...dropOffRatios)),
    maximumSkimmedReadRatio:
      skimmedRatios.length === 0 ? undefined : roundRatio(Math.max(...skimmedRatios)),
    minimumHookProgressRate:
      hookProgressRates.length === 0 ? undefined : roundRatio(Math.min(...hookProgressRates)),
    maximumHookStallRatio:
      hookStallRatios.length === 0 ? undefined : roundRatio(Math.max(...hookStallRatios)),
    readerPassed,
    repeatedRewardSignatureRun,
    repeatedEmotionalSignatureRun,
    dominantEmotionalSignatureFamily: emotionalPalette.dominantFamily,
    dominantEmotionalSignatureFamilyShare: emotionalPalette.dominantShare,
    responseCount,
    commentedResponseCount,
    evidenceSufficient,
    weakDimensions,
    chapterResults,
    passed: failureTypes.length === 0,
    failureTypes,
    failureType: failureTypes[0],
    recommendations,
  };
}

function evaluateSeriesRetentionChapter(
  chapter: SeriesRetentionChapterSample,
  sample: SeriesRetentionBenchmarkSample,
  options: NormalizedOptions
): SeriesRetentionChapterResult {
  const responseCount = chapter.readerResponses.length;
  const commentedResponseCount = chapter.readerResponses.filter(response =>
    hasActionableComment(response)
  ).length;
  const dimensionResults = scoreDimensions(chapter, sample, options);
  const weightedDimensionScore = weightedAverageDimensions(dimensionResults);
  const wouldContinueScore = averageWouldContinueScore(chapter, sample);
  const funnel = evaluateChapterFunnel(chapter, options);
  const hookProgress = evaluateChapterHookProgress(chapter, options);
  const funnelEvidenceRequired =
    options.requireFunnelEvidence || funnel.evidence !== 'none';
  const hookProgressEvidenceRequired =
    options.requireHookProgressEvidence || hookProgress.evidence !== 'none';
  const readerRetentionScore =
    wouldContinueScore === undefined
      ? weightedDimensionScore
      : weightedDimensionScore * 0.82 + wouldContinueScore * 0.18;
  const readerPassed =
    readerRetentionScore >= options.readerRetentionThreshold &&
    (wouldContinueScore === undefined || wouldContinueScore >= 65) &&
    (!funnelEvidenceRequired || funnel.passed) &&
    (!hookProgressEvidenceRequired || hookProgress.passed);
  const automatedPassed =
    chapter.automatedScore === undefined
      ? undefined
      : chapter.automatedScore >= options.automatedRetentionThreshold;
  const evidenceSufficient =
    responseCount >= options.minimumPanelSize &&
    commentedResponseCount >= options.minimumCommentedResponses &&
    (!funnelEvidenceRequired || funnel.evidence === 'usable') &&
    (!hookProgressEvidenceRequired || hookProgress.evidence === 'usable');
  const weakDimensions = dimensionResults
    .filter(result => !result.passed)
    .map(result => result.dimension);

  return {
    chapter: chapter.chapter,
    title: chapter.title,
    automatedScore: chapter.automatedScore,
    automatedPassed,
    rewardSignature: chapter.rewardSignature,
    emotionalSignature: chapter.emotionalSignature,
    emotionalSignatureFamily: chapter.emotionalSignatureFamily,
    hookThread: chapter.hookThread,
    readerRetentionScore: roundScore(readerRetentionScore),
    readerPassed,
    wouldContinueScore:
      wouldContinueScore === undefined ? undefined : roundScore(wouldContinueScore),
    funnelEvidence: funnel.evidence,
    funnelPassed: funnel.passed,
    hookProgressEvidence: hookProgress.evidence,
    hookProgressPassed: hookProgress.passed,
    startedReadCount: chapter.startedReadCount,
    completedReadCount: chapter.completedReadCount,
    continuedReadCount: chapter.continuedReadCount,
    dropOffCount: chapter.dropOffCount,
    skimmedReadCount: chapter.skimmedReadCount,
    hookOpenThreadCount: chapter.hookOpenThreadCount,
    hookAdvancedThreadCount: chapter.hookAdvancedThreadCount,
    hookResolvedThreadCount: chapter.hookResolvedThreadCount,
    hookRecontextualizedThreadCount: chapter.hookRecontextualizedThreadCount,
    hookNewThreadCount: chapter.hookNewThreadCount,
    hookStalledThreadCount: chapter.hookStalledThreadCount,
    completionRate: funnel.completionRate,
    continuationRate: funnel.continuationRate,
    dropOffRatio: funnel.dropOffRatio,
    skimmedReadRatio: funnel.skimmedReadRatio,
    hookProgressEventCount: hookProgress.progressEventCount,
    hookProgressRate: hookProgress.progressRate,
    hookStallRatio: hookProgress.stallRatio,
    responseCount,
    commentedResponseCount,
    evidenceSufficient,
    weakDimensions,
    dimensionResults,
  };
}

function scoreDimensions(
  chapter: SeriesRetentionChapterSample,
  sample: SeriesRetentionBenchmarkSample,
  options: NormalizedOptions
): SeriesRetentionDimensionResult[] {
  return DIMENSIONS.map(dimension => {
    const scores = chapter.readerResponses
      .map(response =>
        normalizeRating(
          response.ratings[dimension],
          response.ratingScale ?? sample.ratingScale ?? 'likert-7'
        )
      )
      .filter((score): score is number => score !== undefined);
    const score = scores.length === 0 ? 0 : average(scores);
    return {
      dimension,
      score: roundScore(score),
      responseCount: scores.length,
      passed: scores.length > 0 && score >= options.minimumDimensionScore,
    };
  });
}

function weightedAverageDimensions(
  dimensionResults: SeriesRetentionDimensionResult[]
): number {
  let weightedSum = 0;
  let weightSum = 0;
  for (const result of dimensionResults) {
    if (result.responseCount === 0) continue;
    const weight = DIMENSION_WEIGHTS[result.dimension];
    weightedSum += result.score * weight;
    weightSum += weight;
  }
  return weightSum === 0 ? 0 : weightedSum / weightSum;
}

function averageWouldContinueScore(
  chapter: SeriesRetentionChapterSample,
  sample: SeriesRetentionBenchmarkSample
): number | undefined {
  const scores = chapter.readerResponses
    .flatMap(response => {
      const scale = response.ratingScale ?? sample.ratingScale ?? 'likert-7';
      const normalizedScore = normalizeRating(response.wouldContinueScore, scale);
      const wouldContinueScore =
        typeof response.wouldContinue === 'boolean'
          ? response.wouldContinue ? 100 : 0
          : undefined;
      return [normalizedScore, wouldContinueScore];
    })
    .filter((score): score is number => score !== undefined);

  return scores.length === 0 ? undefined : average(scores);
}

interface ChapterFunnelEvaluation {
  evidence: SeriesRetentionFunnelEvidence;
  passed: boolean;
  completionRate?: number;
  continuationRate?: number;
  dropOffRatio?: number;
  skimmedReadRatio?: number;
}

interface ChapterHookProgressEvaluation {
  evidence: SeriesRetentionHookProgressEvidence;
  passed: boolean;
  progressEventCount?: number;
  progressRate?: number;
  stallRatio?: number;
}

function evaluateChapterFunnel(
  chapter: SeriesRetentionChapterSample,
  options: NormalizedOptions
): ChapterFunnelEvaluation {
  const counts = [
    chapter.startedReadCount,
    chapter.completedReadCount,
    chapter.continuedReadCount,
    chapter.dropOffCount,
    chapter.skimmedReadCount,
  ];
  const hasAnyFunnelCount = counts.some(count => count !== undefined);
  if (!hasAnyFunnelCount) {
    return {
      evidence: 'none',
      passed: !options.requireFunnelEvidence,
    };
  }

  const started = chapter.startedReadCount;
  const completed = chapter.completedReadCount;
  const continued = chapter.continuedReadCount;
  const dropped = chapter.dropOffCount;
  const skimmed = chapter.skimmedReadCount;
  const allCountsPresent = [started, completed, continued, dropped, skimmed].every(isCount);
  if (!allCountsPresent || started === undefined || started <= 0) {
    return {
      evidence: 'weak',
      passed: false,
    };
  }

  const countsConsistent =
    completed! <= started &&
    continued! <= started &&
    continued! <= completed! &&
    dropped! <= started &&
    skimmed! <= started &&
    completed! + dropped! <= started;
  const completionRate = roundRatio(completed! / started);
  const continuationRate = roundRatio(continued! / started);
  const dropOffRatio = roundRatio(dropped! / started);
  const skimmedReadRatio = roundRatio(skimmed! / started);
  const evidence: SeriesRetentionFunnelEvidence =
    started >= options.minimumStartedReadCount && countsConsistent ? 'usable' : 'weak';
  const passed =
    evidence === 'usable' &&
    completionRate >= options.minimumCompletionRate &&
    continuationRate >= options.minimumContinuationRate &&
    dropOffRatio <= options.maximumDropOffRatio &&
    skimmedReadRatio <= options.maximumSkimmedReadRatio;

  return {
    evidence,
    passed,
    completionRate,
    continuationRate,
    dropOffRatio,
    skimmedReadRatio,
  };
}

function evaluateChapterHookProgress(
  chapter: SeriesRetentionChapterSample,
  options: NormalizedOptions
): ChapterHookProgressEvaluation {
  const counts = [
    chapter.hookOpenThreadCount,
    chapter.hookAdvancedThreadCount,
    chapter.hookResolvedThreadCount,
    chapter.hookRecontextualizedThreadCount,
    chapter.hookNewThreadCount,
    chapter.hookStalledThreadCount,
  ];
  const hasAnyHookProgressCount = counts.some(count => count !== undefined);
  if (!hasAnyHookProgressCount) {
    return {
      evidence: 'none',
      passed: !options.requireHookProgressEvidence,
    };
  }

  const open = chapter.hookOpenThreadCount;
  const advanced = chapter.hookAdvancedThreadCount;
  const resolved = chapter.hookResolvedThreadCount;
  const recontextualized = chapter.hookRecontextualizedThreadCount;
  const newThread = chapter.hookNewThreadCount;
  const stalled = chapter.hookStalledThreadCount;
  const allRequiredCountsPresent = [
    open,
    advanced,
    resolved,
    recontextualized,
    stalled,
  ].every(isCount);
  if (
    !allRequiredCountsPresent ||
    (newThread !== undefined && !isCount(newThread)) ||
    open === undefined ||
    open <= 0
  ) {
    return {
      evidence: 'weak',
      passed: false,
    };
  }

  const progressEventCount = advanced! + resolved! + recontextualized!;
  const countsConsistent =
    progressEventCount <= open + (newThread ?? 0) &&
    stalled! <= open &&
    progressEventCount + stalled! >= 1 &&
    progressEventCount + stalled! <= open + (newThread ?? 0);
  const progressRate = roundRatio(progressEventCount / open);
  const stallRatio = roundRatio(stalled! / open);
  const evidence: SeriesRetentionHookProgressEvidence =
    countsConsistent ? 'usable' : 'weak';
  const passed =
    evidence === 'usable' &&
    progressEventCount >= options.minimumHookProgressEventCount &&
    progressRate >= options.minimumHookProgressRate &&
    stallRatio <= options.maximumHookStallRatio;

  return {
    evidence,
    passed,
    progressEventCount,
    progressRate,
    stallRatio,
  };
}

function aggregateFunnelEvidence(
  chapterResults: SeriesRetentionChapterResult[]
): SeriesRetentionFunnelEvidence {
  if (chapterResults.length === 0) return 'none';
  if (chapterResults.every(result => result.funnelEvidence === 'none')) return 'none';
  if (chapterResults.every(result => result.funnelEvidence === 'usable')) return 'usable';
  return 'weak';
}

function aggregateHookProgressEvidence(
  chapterResults: SeriesRetentionChapterResult[]
): SeriesRetentionHookProgressEvidence {
  if (chapterResults.length === 0) return 'none';
  if (chapterResults.every(result => result.hookProgressEvidence === 'none')) return 'none';
  if (chapterResults.every(result => result.hookProgressEvidence === 'usable')) return 'usable';
  return 'weak';
}

function isWeakFunnelEvidence(
  evidence: SeriesRetentionFunnelEvidence,
  options: Pick<NormalizedOptions, 'requireFunnelEvidence'>
): boolean {
  return evidence === 'weak' || (options.requireFunnelEvidence && evidence === 'none');
}

function isWeakHookProgressEvidence(
  evidence: SeriesRetentionHookProgressEvidence,
  options: Pick<NormalizedOptions, 'requireHookProgressEvidence'>
): boolean {
  return evidence === 'weak' || (options.requireHookProgressEvidence && evidence === 'none');
}

function determineFailureTypes(input: {
  sample: SeriesRetentionBenchmarkSample;
  sequenceLength: number;
  readerPassed: boolean;
  automatedPassed?: boolean;
  readerRetentionScore: number;
  retentionDrop: number;
  repeatedRewardSignatureRun: number;
  repeatedEmotionalSignatureRun: number;
  dominantEmotionalSignatureFamilyShare?: number;
  evidenceSufficient: boolean;
  weakDimensions: SeriesRetentionDimension[];
  weakFunnelEvidenceChapterCount: number;
  funnelDropChapterCount: number;
  weakHookProgressEvidenceChapterCount: number;
  hookStallChapterCount: number;
  options: NormalizedOptions;
}): SeriesRetentionFailureType[] {
  const failureTypes: SeriesRetentionFailureType[] = [];
  const {
    sample,
    sequenceLength,
    readerPassed,
    automatedPassed,
    readerRetentionScore,
    retentionDrop,
    repeatedRewardSignatureRun,
    repeatedEmotionalSignatureRun,
    dominantEmotionalSignatureFamilyShare,
    evidenceSufficient,
    weakDimensions,
    weakFunnelEvidenceChapterCount,
    funnelDropChapterCount,
    weakHookProgressEvidenceChapterCount,
    hookStallChapterCount,
    options,
  } = input;

  if (sequenceLength < options.minimumSequenceLength) {
    failureTypes.push('short-sequence');
  }
  if (automatedPassed === true && !readerPassed) {
    failureTypes.push('automated-false-positive');
  }
  if (automatedPassed === false && readerPassed) {
    failureTypes.push('automated-false-negative');
  }
  if (sample.expectedRetained !== undefined && sample.expectedRetained !== readerPassed) {
    failureTypes.push('reader-label-mismatch');
  }
  if (readerRetentionScore < options.readerRetentionThreshold) {
    failureTypes.push('weak-reader-retention');
  }
  if (weakDimensions.length > 0) {
    failureTypes.push('weak-dimension');
  }
  if (retentionDrop > options.maximumRetentionDrop) {
    failureTypes.push('reader-retention-drop');
  }
  if (funnelDropChapterCount > 0) {
    failureTypes.push('reader-funnel-drop');
  }
  if (weakFunnelEvidenceChapterCount > 0) {
    failureTypes.push('weak-funnel-evidence');
  }
  if (hookStallChapterCount > 0) {
    failureTypes.push('reader-hook-stall');
  }
  if (weakHookProgressEvidenceChapterCount > 0) {
    failureTypes.push('weak-hook-progress-evidence');
  }
  if (repeatedRewardSignatureRun > options.maximumRepeatedRewardSignatureRun) {
    failureTypes.push('repetitive-reward-pattern');
  }
  if (repeatedEmotionalSignatureRun > options.maximumRepeatedEmotionalSignatureRun) {
    failureTypes.push('repetitive-emotional-pattern');
  }
  if (
    dominantEmotionalSignatureFamilyShare !== undefined &&
    dominantEmotionalSignatureFamilyShare >
      options.maximumDominantEmotionalSignatureFamilyShare
  ) {
    failureTypes.push('narrow-emotional-palette');
  }
  if (!evidenceSufficient) {
    failureTypes.push('insufficient-reader-evidence');
  }

  return uniqueFailureTypes(failureTypes);
}

function buildSampleRecommendations(
  sample: SeriesRetentionBenchmarkSample,
  failureTypes: SeriesRetentionFailureType[],
  weakDimensions: SeriesRetentionDimension[],
  readerRetentionScore: number,
  retentionDrop: number,
  weakFunnelEvidenceChapterCount: number,
  funnelDropChapterCount: number,
  weakHookProgressEvidenceChapterCount: number,
  hookStallChapterCount: number,
  repeatedRewardSignatureRun: number,
  repeatedEmotionalSignatureRun: number,
  dominantEmotionalSignatureFamily?: SeriesRetentionEmotionalSignatureFamily,
  dominantEmotionalSignatureFamilyShare?: number
): string[] {
  const recommendations: string[] = [];
  if (failureTypes.includes('automated-false-positive')) {
    recommendations.push(
      'Do not raise long-series engagement thresholds from this sequence until target readers retain interest across the full run.'
    );
  }
  if (failureTypes.includes('automated-false-negative')) {
    recommendations.push(
      'Inspect whether the automated long-series evaluator is penalizing a reader-approved slow-burn, quiet payoff, or genre-specific serial rhythm.'
    );
  }
  if (failureTypes.includes('weak-reader-retention')) {
    recommendations.push(
      `Reader retention is ${roundScore(readerRetentionScore)}; strengthen next-click desire, hook progress, reward variety, and payoff confidence before using this sequence as a high-retention model.`
    );
  }
  if (failureTypes.includes('reader-retention-drop')) {
    recommendations.push(
      `Reader retention drops ${roundScore(retentionDrop)} points across the sequence; add a fresh story state change, narrower question, or different reward mode before the final sampled chapter.`
    );
  }
  if (failureTypes.includes('reader-funnel-drop')) {
    recommendations.push(
      `${funnelDropChapterCount} chapter(s) show weak reader funnel continuation/completion despite response scores; inspect the exact chapter-to-next-chapter drop-off before treating survivor responses as retained interest.`
    );
  }
  if (failureTypes.includes('weak-funnel-evidence')) {
    recommendations.push(
      `Add started/completed/continued/drop-off/skimmed reader counts for ${weakFunnelEvidenceChapterCount} chapter(s); continuing-reader comments alone can hide early abandonment.`
    );
  }
  if (failureTypes.includes('reader-hook-stall')) {
    recommendations.push(
      `${hookStallChapterCount} chapter(s) show stalled hook progress; advance, resolve, or recontextualize active question threads instead of only adding a new cliffhanger.`
    );
  }
  if (failureTypes.includes('weak-hook-progress-evidence')) {
    recommendations.push(
      `Record hook progress ledger counts for ${weakHookProgressEvidenceChapterCount} chapter(s): open, advanced, resolved, recontextualized, new, and stalled thread counts.`
    );
  }
  if (failureTypes.includes('repetitive-reward-pattern')) {
    recommendations.push(
      `Reward signature repeats for ${repeatedRewardSignatureRun} consecutive chapters; vary the promise/payoff cycle instead of delivering the same alert, chase, reveal, confession, or reversal shape.`
    );
  }
  if (failureTypes.includes('repetitive-emotional-pattern')) {
    recommendations.push(
      `Emotional signature repeats for ${repeatedEmotionalSignatureRun} consecutive chapters; vary the affective arc with relief, dread, intimacy, awe, grief, comic release, or hard-won resolve instead of ending every chapter on the same emotional beat.`
    );
  }
  if (failureTypes.includes('narrow-emotional-palette')) {
    const family = dominantEmotionalSignatureFamily ?? 'one affect family';
    const share = dominantEmotionalSignatureFamilyShare === undefined
      ? 'too much'
      : `${Math.round(dominantEmotionalSignatureFamilyShare * 100)}%`;
    recommendations.push(
      `Dominant emotional family ${family} covers ${share} of sampled chapter endings; add contrasting relief, intimacy, triumph, grief, anger, or reflective calm so the sequence has real emotional flow instead of affective monotony.`
    );
  }
  if (weakDimensions.length > 0) {
    recommendations.push(`Retest weak series retention dimensions: ${weakDimensions.join(', ')}.`);
  }
  if (failureTypes.includes('insufficient-reader-evidence')) {
    recommendations.push(
      'Add target-reader responses with fatigue points, freshness points, rewrite suggestions, and reader funnel counts for every chapter in the sequence.'
    );
  }
  if (failureTypes.includes('short-sequence')) {
    recommendations.push(
      'Use at least three consecutive chapters before treating this as a long-series retention benchmark.'
    );
  }
  if (sample.expectedRetained !== undefined && failureTypes.includes('reader-label-mismatch')) {
    recommendations.push(
      'Review the human retained/not-retained label or split the sequence into clearer known-retained and known-drop variants.'
    );
  }
  return recommendations;
}

function buildRecommendations(
  result: SeriesRetentionBenchmarkResult,
  options: Pick<
    NormalizedOptions,
    | 'minimumHoldoutSampleCount'
    | 'minimumUsableHoldoutSampleCount'
    | 'minimumFailingHoldoutSampleCount'
    | 'minimumUsableFailingHoldoutSampleCount'
  >
): string[] {
  const recommendations: string[] = [];
  if (result.automatedFalsePositiveCount > 0) {
    recommendations.push(
      'Tighten long-series checks for sequences that automated scoring accepts but target readers do not continue through.'
    );
  }
  if (result.automatedFalseNegativeCount > 0) {
    recommendations.push(
      'Inspect reader-retained sequences that automated scoring rejects before raising long-series thresholds.'
    );
  }
  if (result.readerLabelMismatchCount > 0) {
    recommendations.push(
      'Audit sequence labels whose observed reader retention contradicts the expected retained flag.'
    );
  }
  if (result.weakReaderRetentionCount > 0) {
    recommendations.push(
      'Revise sequences with weak next-click, fatigue resistance, hook progress, reward variety, payoff satisfaction, novelty, emotional reset, or payoff confidence.'
    );
  }
  if (result.retentionDropCount > 0) {
    recommendations.push(
      'Retest sequences after adding mid-run state changes; a strong first chapter is not enough if later chapters shed intent to continue.'
    );
  }
  if (result.funnelDropCount > 0) {
    recommendations.push(
      'Inspect chapter-level reader funnels; high scores from remaining readers cannot substitute for started-to-continued retention.'
    );
  }
  if (result.weakFunnelEvidenceCount > 0) {
    recommendations.push(
      'Collect started/completed/continued/drop-off/skimmed reader counts for every chapter before using series retention samples for gate tuning.'
    );
  }
  if (result.hookStallCount > 0) {
    recommendations.push(
      'Revise sequences whose active question threads stall; each sampled chapter needs visible hook progress, resolution, or recontextualization.'
    );
  }
  if (result.weakHookProgressEvidenceCount > 0) {
    recommendations.push(
      'Collect per-chapter hook progress ledger counts before using series retention samples for gate tuning.'
    );
  }
  if (result.repetitiveRewardPatternCount > 0) {
    recommendations.push(
      'Add reward-shape diversity samples and require non-repeating payoff signatures across consecutive chapters.'
    );
  }
  if (result.repetitiveEmotionalPatternCount > 0) {
    recommendations.push(
      'Add emotional-arc diversity samples and require non-repeating affective signatures across consecutive chapters.'
    );
  }
  if (result.narrowEmotionalPaletteCount > 0) {
    recommendations.push(
      'Add emotional palette concentration holdouts; sequences should vary dominant affect families, not only avoid consecutive duplicate endings.'
    );
  }
  if (result.insufficientEvidenceCount > 0) {
    recommendations.push(
      'Collect more commented target-reader responses for every chapter before using this benchmark for gate tuning.'
    );
  }
  if (result.shortSequenceCount > 0) {
    recommendations.push(
      'Replace short samples with consecutive multi-chapter sequences before making long-series retention decisions.'
    );
  }
  if (result.missingRequiredGenres.length > 0) {
    recommendations.push(
      `Add series retention benchmark samples for missing required genres: ${result.missingRequiredGenres.join(', ')}.`
    );
  }
  if (result.underSampledRequiredGenres.length > 0) {
    recommendations.push(
      `Add more series retention benchmark samples for under-sampled genres: ${result.underSampledRequiredGenres.join(', ')}.`
    );
  }
  if (result.missingRequiredPositiveGenres.length > 0) {
    recommendations.push(
      `Add known-retained series samples for genres: ${result.missingRequiredPositiveGenres.join(', ')}.`
    );
  }
  if (result.missingRequiredNegativeGenres.length > 0) {
    recommendations.push(
      `Add known-drop series samples for genres: ${result.missingRequiredNegativeGenres.join(', ')}.`
    );
  }
  if (result.missingRequiredTargetReaders.length > 0) {
    recommendations.push(
      `Add series retention benchmark samples for target readers: ${result.missingRequiredTargetReaders.join(', ')}.`
    );
  }
  if (result.underSampledRequiredTargetReaders.length > 0) {
    recommendations.push(
      `Add more series retention benchmark samples for under-sampled target readers: ${result.underSampledRequiredTargetReaders.join(', ')}.`
    );
  }
  if (result.missingRequiredPositiveTargetReaders.length > 0) {
    recommendations.push(
      `Add known-retained series samples for target readers: ${result.missingRequiredPositiveTargetReaders.join(', ')}.`
    );
  }
  if (result.missingRequiredNegativeTargetReaders.length > 0) {
    recommendations.push(
      `Add known-drop series samples for target readers: ${result.missingRequiredNegativeTargetReaders.join(', ')}.`
    );
  }
  if (result.underSampledHoldoutSamples) {
    recommendations.push(
      `Reserve at least ${options.minimumHoldoutSampleCount} series retention holdout sample(s) before tuning long-series gates.`
    );
  }
  if (result.underSampledUsableHoldoutSamples) {
    recommendations.push(
      `Accumulate at least ${options.minimumUsableHoldoutSampleCount} evidence-sufficient series retention holdout sample(s) before using this benchmark for gate tuning.`
    );
  }
  if (result.underSampledFailingHoldoutSamples) {
    recommendations.push(
      `Reserve at least ${options.minimumFailingHoldoutSampleCount} known-drop series holdout sample(s) to catch weak-retention false positives.`
    );
  }
  if (result.underSampledUsableFailingHoldoutSamples) {
    recommendations.push(
      `Accumulate at least ${options.minimumUsableFailingHoldoutSampleCount} evidence-sufficient known-drop series holdout sample(s) before using this benchmark for gate tuning.`
    );
  }
  if (result.splitLeakageCount > 0) {
    recommendations.push(
      'Move duplicated series retention evidence out of holdout or calibration splits; the same chapter sequence cannot validate long-series gate tuning independently.'
    );
  }
  if (result.splitCoverage.unassignedSamples > 0) {
    recommendations.push(
      'Set calibrationSplit/calibration_split on every series retention sample so tuning, validation, and holdout evidence cannot be mixed.'
    );
  }
  return recommendations;
}

function countSplitCoverage(
  sampleResults: SeriesRetentionBenchmarkSampleResult[]
): SeriesRetentionBenchmarkSplitCoverage {
  return sampleResults.reduce<SeriesRetentionBenchmarkSplitCoverage>(
    (coverage, result) => {
      const usable = result.evidenceSufficient;
      if (result.calibrationSplit === 'calibration') {
        coverage.calibrationSamples += 1;
        if (usable) coverage.usableCalibrationSamples += 1;
      } else if (result.calibrationSplit === 'validation') {
        coverage.validationSamples += 1;
        if (usable) coverage.usableValidationSamples += 1;
      } else if (result.calibrationSplit === 'holdout') {
        coverage.holdoutSamples += 1;
        if (usable) coverage.usableHoldoutSamples += 1;
        if (isKnownDropSeriesSample(result)) {
          coverage.failingHoldoutSamples += 1;
          if (usable) coverage.usableFailingHoldoutSamples += 1;
        }
      } else {
        coverage.unassignedSamples += 1;
        if (usable) coverage.usableUnassignedSamples += 1;
      }

      return coverage;
    },
    {
      calibrationSamples: 0,
      validationSamples: 0,
      holdoutSamples: 0,
      unassignedSamples: 0,
      usableCalibrationSamples: 0,
      usableValidationSamples: 0,
      usableHoldoutSamples: 0,
      usableUnassignedSamples: 0,
      failingHoldoutSamples: 0,
      usableFailingHoldoutSamples: 0,
    }
  );
}

function detectSplitLeakages(
  sampleResults: SeriesRetentionBenchmarkSampleResult[]
): SeriesRetentionBenchmarkSplitLeakage[] {
  const byFingerprint = new Map<string, SeriesRetentionBenchmarkSampleResult[]>();

  for (const result of sampleResults) {
    if (!result.calibrationSplit) continue;
    const group = byFingerprint.get(result.evidenceFingerprint) ?? [];
    group.push(result);
    byFingerprint.set(result.evidenceFingerprint, group);
  }

  const leakages: SeriesRetentionBenchmarkSplitLeakage[] = [];
  for (const [fingerprint, results] of byFingerprint) {
    const splits = uniqueSplits(results);
    if (splits.length < 2) continue;
    leakages.push({
      fingerprint,
      sampleIds: results.map(result => result.id).sort(),
      calibrationSplits: splits,
    });
  }

  return leakages.sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));
}

function uniqueSplits(
  sampleResults: SeriesRetentionBenchmarkSampleResult[]
): SeriesRetentionCalibrationSplit[] {
  return Array.from(
    new Set(
      sampleResults
        .map(result => result.calibrationSplit)
        .filter((split): split is SeriesRetentionCalibrationSplit => split !== undefined)
    )
  ).sort();
}

function isKnownDropSeriesSample(result: SeriesRetentionBenchmarkSampleResult): boolean {
  return !(result.expectedRetained ?? result.readerPassed);
}

function isReadyForGateTuning(result: SeriesRetentionBenchmarkResult): boolean {
  return (
    result.readerLabelMismatchCount === 0 &&
    result.insufficientEvidenceCount === 0 &&
    result.weakFunnelEvidenceCount === 0 &&
    result.weakHookProgressEvidenceCount === 0 &&
    result.shortSequenceCount === 0 &&
    result.missingRequiredGenres.length === 0 &&
    result.underSampledRequiredGenres.length === 0 &&
    result.missingRequiredPositiveGenres.length === 0 &&
    result.missingRequiredNegativeGenres.length === 0 &&
    result.missingRequiredTargetReaders.length === 0 &&
    result.underSampledRequiredTargetReaders.length === 0 &&
    result.missingRequiredPositiveTargetReaders.length === 0 &&
    result.missingRequiredNegativeTargetReaders.length === 0 &&
    !result.underSampledHoldoutSamples &&
    !result.underSampledUsableHoldoutSamples &&
    !result.underSampledFailingHoldoutSamples &&
    !result.underSampledUsableFailingHoldoutSamples &&
    result.splitLeakageCount === 0
  );
}

function aggregateWeakDimensions(
  chapterResults: SeriesRetentionChapterResult[]
): SeriesRetentionDimension[] {
  return uniqueDimensions(chapterResults.flatMap(result => result.weakDimensions));
}

function longestRewardSignatureRun(chapters: SeriesRetentionChapterSample[]): number {
  return longestSignatureRun(chapters, chapter => chapter.rewardSignature);
}

function longestEmotionalSignatureRun(chapters: SeriesRetentionChapterSample[]): number {
  return longestSignatureRun(
    chapters,
    chapter =>
      normalizeEmotionalSignature(
        chapter.emotionalSignature,
        chapter.emotionalSignatureFamily
      ),
    normalizeSignature
  );
}

function dominantEmotionalSignatureFamilyShare(chapters: SeriesRetentionChapterSample[]): {
  dominantFamily?: SeriesRetentionEmotionalSignatureFamily;
  dominantShare?: number;
} {
  const familyCounts = new Map<SeriesRetentionEmotionalSignatureFamily, number>();
  let chaptersWithFamily = 0;

  for (const chapter of chapters) {
    const families = extractNormalizedEmotionalFamilies(
      normalizeEmotionalSignature(
        chapter.emotionalSignature,
        chapter.emotionalSignatureFamily
      )
    );
    if (families.length === 0) continue;

    chaptersWithFamily += 1;
    for (const family of families) {
      familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
    }
  }

  if (chaptersWithFamily === 0 || familyCounts.size === 0) {
    return {};
  }

  const [dominantFamily, dominantCount] = Array.from(familyCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];

  return {
    dominantFamily,
    dominantShare: roundRatio(dominantCount / chaptersWithFamily),
  };
}

function longestSignatureRun(
  chapters: SeriesRetentionChapterSample[],
  selectSignature: (chapter: SeriesRetentionChapterSample) => string | undefined,
  normalize: (signature: string | undefined) => string = normalizeSignature
): number {
  let longest = 0;
  let current = 0;
  let previous = '';

  for (const chapter of chapters) {
    const signature = normalize(selectSignature(chapter));
    if (!signature) {
      current = 0;
      previous = '';
      continue;
    }
    if (signature === previous) {
      current += 1;
    } else {
      current = 1;
      previous = signature;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function normalizeSignature(value: string | undefined): string {
  return value?.trim().toLowerCase().replace(/\s+/g, ' ') ?? '';
}

function normalizeEmotionalSignature(
  value: string | undefined,
  family?: SeriesRetentionEmotionalSignatureFamily
): string {
  if (family) {
    return `affect:${family}`;
  }

  const signature = normalizeSignature(value);
  if (!signature) return '';

  const tokens = new Set(signature.split(/[^a-z0-9]+/u).filter(Boolean));
  const families = EMOTIONAL_SIGNATURE_FAMILIES
    .filter(({ terms }) => terms.some(term => tokens.has(term)))
    .map(({ family }) => family);

  return families.length > 0 ? `affect:${families.join('+')}` : signature;
}

function extractNormalizedEmotionalFamilies(
  normalizedSignature: string
): SeriesRetentionEmotionalSignatureFamily[] {
  if (!normalizedSignature.startsWith('affect:')) {
    return [];
  }

  const families = normalizedSignature
    .slice('affect:'.length)
    .split('+')
    .filter((family): family is SeriesRetentionEmotionalSignatureFamily =>
      isEmotionalSignatureFamily(family)
    );
  return Array.from(new Set(families));
}

function isEmotionalSignatureFamily(
  value: string
): value is SeriesRetentionEmotionalSignatureFamily {
  return SERIES_RETENTION_EMOTIONAL_SIGNATURE_FAMILIES.includes(
    value as SeriesRetentionEmotionalSignatureFamily
  );
}

function countCoverage(
  sampleResults: SeriesRetentionBenchmarkSampleResult[],
  keySelector: (sample: SeriesRetentionBenchmarkSampleResult) => string | undefined
): Record<string, SeriesRetentionBenchmarkCoverage> {
  return sampleResults.reduce<Record<string, SeriesRetentionBenchmarkCoverage>>(
    (coverage, sample) => {
      const key = keySelector(sample);
      if (!key) return coverage;
      coverage[key] ??= { total: 0, positive: 0, negative: 0 };
      coverage[key].total += 1;
      if (sample.expectedRetained ?? sample.readerPassed) {
        coverage[key].positive += 1;
      } else {
        coverage[key].negative += 1;
      }
      return coverage;
    },
    {}
  );
}

function missingRequiredKeys(
  requiredKeys: string[],
  coverage: Record<string, SeriesRetentionBenchmarkCoverage>
): string[] {
  return requiredKeys.filter(key => coverage[key] === undefined);
}

function underSampledRequiredKeys(
  requiredKeys: string[],
  coverage: Record<string, SeriesRetentionBenchmarkCoverage>,
  minimumSamples: number
): string[] {
  if (minimumSamples <= 1) return [];
  return requiredKeys.filter(key => (coverage[key]?.total ?? 0) < minimumSamples);
}

function missingRequiredPolarity(
  requiredKeys: string[],
  coverage: Record<string, SeriesRetentionBenchmarkCoverage>,
  polarity: 'positive' | 'negative'
): string[] {
  return requiredKeys.filter(key => (coverage[key]?.[polarity] ?? 0) === 0);
}

function countFailureType(
  sampleResults: SeriesRetentionBenchmarkSampleResult[],
  failureType: SeriesRetentionFailureType
): number {
  return sampleResults.filter(result => result.failureTypes.includes(failureType)).length;
}

function normalizeRating(
  value: number | undefined,
  scale: SeriesRetentionRatingScale
): number | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  if (scale === 'percent-100') {
    return clamp(value, 0, 100);
  }
  return clamp(((value - 1) / 6) * 100, 0, 100);
}

function hasActionableComment(response: SeriesRetentionReaderResponse): boolean {
  return (
    (response.comment?.trim().length ?? 0) >= 8 ||
    (response.rewriteSuggestion?.trim().length ?? 0) >= 8 ||
    (response.fatiguePoints?.some(point => point.trim().length > 0) ?? false) ||
    (response.freshnessPoints?.some(point => point.trim().length > 0) ?? false)
  );
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

function roundRatio(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function isCount(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function positiveIntegerOrDefault(value: number | undefined, defaultValue: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? value
    : defaultValue;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(Boolean))];
}

function uniqueDimensions(values: SeriesRetentionDimension[]): SeriesRetentionDimension[] {
  return [...new Set(values)];
}

function uniqueFailureTypes(values: SeriesRetentionFailureType[]): SeriesRetentionFailureType[] {
  return [...new Set(values)];
}

function fingerprintSampleEvidence(sample: SeriesRetentionBenchmarkSample): string {
  const payload = stableJsonStringify({
    genre: sample.genre,
    targetReader: sample.targetReader,
    chapters: [...sample.chapters]
      .sort((a, b) => a.chapter - b.chapter)
      .map(chapter => ({
        chapter: chapter.chapter,
        title: chapter.title,
        automatedScore: chapter.automatedScore,
        rewardSignature: chapter.rewardSignature,
        emotionalSignature: chapter.emotionalSignature,
        emotionalSignatureFamily: chapter.emotionalSignatureFamily,
        hookThread: chapter.hookThread,
        hookOpenThreadCount: chapter.hookOpenThreadCount,
        hookAdvancedThreadCount: chapter.hookAdvancedThreadCount,
        hookResolvedThreadCount: chapter.hookResolvedThreadCount,
        hookRecontextualizedThreadCount: chapter.hookRecontextualizedThreadCount,
        hookNewThreadCount: chapter.hookNewThreadCount,
        hookStalledThreadCount: chapter.hookStalledThreadCount,
      })),
  });
  return `sha256:${createHash('sha256').update(payload).digest('hex')}`;
}

function stableJsonStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(item => stableJsonStringify(item)).join(',')}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, entryValue]) => entryValue !== undefined)
    .sort(([left], [right]) => left.localeCompare(right));
  return `{${entries
    .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableJsonStringify(entryValue)}`)
    .join(',')}}`;
}
