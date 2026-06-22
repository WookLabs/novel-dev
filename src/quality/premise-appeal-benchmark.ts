/**
 * Premise Appeal Benchmark
 *
 * Compares automated premise scores with target-reader response samples.
 * This catches concepts that look specific in metadata but do not create
 * curiosity, protagonist investment, or willingness to read.
 *
 * @module quality/premise-appeal-benchmark
 */

import { createHash } from 'node:crypto';

export type PremiseAppealDimension =
  | 'curiosity_gap'
  | 'novelty'
  | 'protagonist_investment'
  | 'emotional_pull'
  | 'clarity'
  | 'target_fit'
  | 'next_chapter_anticipation';

export type PremiseAppealRatingScale = 'likert-7' | 'percent-100';

export type PremiseAppealFailureType =
  | 'automated-false-positive'
  | 'automated-false-negative'
  | 'reader-label-mismatch'
  | 'weak-promise-evidence'
  | 'behavioral-intent-false-positive'
  | 'weak-reader-appeal'
  | 'weak-dimension'
  | 'insufficient-reader-evidence'
  | 'weak-behavioral-intent-evidence'
  | 'weak-behavioral-protocol-evidence'
  | 'weak-behavioral-allocation-evidence';

export type PremiseAppealCalibrationSplit =
  | 'calibration'
  | 'validation'
  | 'holdout';

export type PremiseAppealBehavioralIntentEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type PremiseAppealBehavioralProtocolQuality =
  | 'unknown'
  | 'weak'
  | 'strong';

export type PremiseAppealBehavioralAllocationIntegrity =
  | 'unknown'
  | 'weak'
  | 'strong';

export type PremiseAppealPromiseEvidenceStatus =
  | 'missing'
  | 'weak'
  | 'usable';

const DEFAULT_MINIMUM_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_FAILING_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_FAILING_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_BEHAVIORAL_IMPRESSION_COUNT = 100;
const DEFAULT_MINIMUM_CLICK_THROUGH_RATE = 0.04;
const DEFAULT_MINIMUM_FIRST_CHAPTER_OPEN_RATE = 0.025;
const DEFAULT_MINIMUM_SAVE_OR_FOLLOW_RATE = 0.008;
const DEFAULT_MINIMUM_BEHAVIORAL_OBSERVATION_WINDOW_HOURS = 24;
const DEFAULT_MINIMUM_SAMPLE_RATIO_MISMATCH_P_VALUE = 0.001;

export interface PremiseAppealPromise {
  target_reader?: string;
  core_hook?: string;
  irresistible_question?: string;
  protagonist_appeal?: string;
  novelty_angle?: string;
  emotional_payoff?: string;
  binge_reason?: string;
  long_series_engine?: string;
  first_five_chapter_retention_plan?: string[];
}

export interface PremiseAppealReaderResponse {
  readerId?: string;
  targetReaderFit?: boolean;
  ratingScale?: PremiseAppealRatingScale;
  ratings: Partial<Record<PremiseAppealDimension, number>>;
  wouldRead?: boolean;
  wouldReadScore?: number;
  comment?: string;
  confusionPoints?: string[];
  attractiveElements?: string[];
  rewriteSuggestion?: string;
}

export interface PremiseAppealBehavioralIntentEvidence {
  platform?: string;
  variantLabel?: string;
  acquisitionSource?: string;
  observationWindowHours?: number;
  blindListingTest?: boolean;
  impressionCount?: number;
  clickCount?: number;
  firstChapterOpenCount?: number;
  sampleReadStartCount?: number;
  libraryAddCount?: number;
  followCount?: number;
  paidPreviewClickCount?: number;
  benchmarkClickThroughRate?: number;
  benchmarkFirstChapterOpenRate?: number;
  benchmarkSaveOrFollowRate?: number;
  expectedVariantAllocationRatio?: number;
  observedVariantAllocationRatio?: number;
  sampleRatioMismatchPValue?: number;
}

export interface PremiseAppealBenchmarkSample {
  id: string;
  label?: string;
  genre?: string;
  targetReader?: string;
  premise?: PremiseAppealPromise;
  calibrationSplit?: PremiseAppealCalibrationSplit;
  automatedScore?: number;
  expectedAppealing?: boolean;
  ratingScale?: PremiseAppealRatingScale;
  behavioralEvidence?: PremiseAppealBehavioralIntentEvidence;
  readerResponses: PremiseAppealReaderResponse[];
}

export interface PremiseAppealBenchmarkOptions {
  readerAppealThreshold?: number;
  automatedAppealThreshold?: number;
  minimumDimensionScore?: number;
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  requiredGenres?: string[];
  requiredTargetReaders?: string[];
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  requireHoldoutForGateTuning?: boolean;
  requirePromiseEvidenceForGateTuning?: boolean;
  minimumBehavioralImpressionCount?: number;
  minimumClickThroughRate?: number;
  minimumFirstChapterOpenRate?: number;
  minimumSaveOrFollowRate?: number;
  minimumBehavioralObservationWindowHours?: number;
  minimumSampleRatioMismatchPValue?: number;
  requireBehavioralIntentEvidenceForGateTuning?: boolean;
  requireBehavioralProtocolForGateTuning?: boolean;
  requireBehavioralAllocationIntegrityForGateTuning?: boolean;
}

export interface PremiseAppealBenchmarkDimensionResult {
  dimension: PremiseAppealDimension;
  score: number;
  responseCount: number;
  passed: boolean;
}

export interface PremiseAppealBenchmarkSampleResult {
  id: string;
  label?: string;
  genre?: string;
  targetReader?: string;
  calibrationSplit?: PremiseAppealCalibrationSplit;
  evidenceFingerprint: string;
  promiseEvidence: PremiseAppealPromiseEvidenceStatus;
  promiseEvidenceIssues: string[];
  promiseEvidenceFieldCount: number;
  automatedScore?: number;
  automatedPassed?: boolean;
  expectedAppealing?: boolean;
  readerAppealScore: number;
  readerPassed: boolean;
  wouldReadScore?: number;
  behavioralIntentEvidence: PremiseAppealBehavioralIntentEvidenceStatus;
  behavioralIntentEvidenceIssues: string[];
  behavioralIntentScore?: number;
  behavioralIntentPassed?: boolean;
  behavioralProtocolQuality: PremiseAppealBehavioralProtocolQuality;
  behavioralProtocolIssues: string[];
  behavioralAllocationIntegrity: PremiseAppealBehavioralAllocationIntegrity;
  behavioralAllocationIssues: string[];
  behavioralExpectedVariantAllocationRatio?: number;
  behavioralObservedVariantAllocationRatio?: number;
  behavioralSampleRatioMismatchPValue?: number;
  behavioralImpressionCount?: number;
  behavioralClickThroughRate?: number;
  behavioralFirstChapterOpenRate?: number;
  behavioralSaveOrFollowRate?: number;
  responseCount: number;
  commentedResponseCount: number;
  evidenceSufficient: boolean;
  weakDimensions: PremiseAppealDimension[];
  dimensionResults: PremiseAppealBenchmarkDimensionResult[];
  passed: boolean;
  failureTypes: PremiseAppealFailureType[];
  failureType?: PremiseAppealFailureType;
  recommendations: string[];
}

export interface PremiseAppealBenchmarkCoverage {
  total: number;
  positive: number;
  negative: number;
}

export interface PremiseAppealBenchmarkSplitCoverage {
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

export interface PremiseAppealBenchmarkSplitLeakage {
  fingerprint: string;
  sampleIds: string[];
  calibrationSplits: PremiseAppealCalibrationSplit[];
}

export interface PremiseAppealBenchmarkResult {
  total: number;
  passed: number;
  failed: number;
  accuracy: number;
  automatedFalsePositiveCount: number;
  automatedFalseNegativeCount: number;
  readerLabelMismatchCount: number;
  behavioralIntentFalsePositiveCount: number;
  weakPromiseEvidenceCount: number;
  promiseEvidenceCount: number;
  weakReaderAppealCount: number;
  weakDimensionCount: number;
  insufficientEvidenceCount: number;
  lowBehavioralIntentEvidenceCount: number;
  behavioralIntentEvidenceCount: number;
  weakBehavioralProtocolCount: number;
  behavioralProtocolEvidenceCount: number;
  weakBehavioralAllocationCount: number;
  behavioralAllocationEvidenceCount: number;
  genreCoverage: Record<string, PremiseAppealBenchmarkCoverage>;
  targetReaderCoverage: Record<string, PremiseAppealBenchmarkCoverage>;
  missingRequiredGenres: string[];
  underSampledRequiredGenres: string[];
  missingRequiredPositiveGenres: string[];
  missingRequiredNegativeGenres: string[];
  missingRequiredTargetReaders: string[];
  underSampledRequiredTargetReaders: string[];
  missingRequiredPositiveTargetReaders: string[];
  missingRequiredNegativeTargetReaders: string[];
  splitCoverage: PremiseAppealBenchmarkSplitCoverage;
  underSampledHoldoutSamples: boolean;
  underSampledUsableHoldoutSamples: boolean;
  underSampledFailingHoldoutSamples: boolean;
  underSampledUsableFailingHoldoutSamples: boolean;
  splitLeakageCount: number;
  splitLeakages: PremiseAppealBenchmarkSplitLeakage[];
  readyForGateTuning: boolean;
  recommendations: string[];
  sampleResults: PremiseAppealBenchmarkSampleResult[];
}

const DEFAULT_READER_APPEAL_THRESHOLD = 72;
const DEFAULT_AUTOMATED_APPEAL_THRESHOLD = 85;
const DEFAULT_MINIMUM_DIMENSION_SCORE = 60;
const DEFAULT_MINIMUM_PANEL_SIZE = 3;
const DEFAULT_MINIMUM_COMMENTED_RESPONSES = 2;

const DIMENSION_WEIGHTS: Record<PremiseAppealDimension, number> = {
  curiosity_gap: 0.22,
  novelty: 0.15,
  protagonist_investment: 0.15,
  emotional_pull: 0.14,
  clarity: 0.1,
  target_fit: 0.09,
  next_chapter_anticipation: 0.15,
};

const DIMENSIONS = Object.keys(DIMENSION_WEIGHTS) as PremiseAppealDimension[];
const REQUIRED_PROMISE_EVIDENCE_FIELDS: Array<keyof PremiseAppealPromise> = [
  'core_hook',
  'irresistible_question',
  'protagonist_appeal',
  'novelty_angle',
  'emotional_payoff',
  'binge_reason',
  'long_series_engine',
];

export function evaluatePremiseAppealBenchmark(
  samples: PremiseAppealBenchmarkSample[],
  options: PremiseAppealBenchmarkOptions = {}
): PremiseAppealBenchmarkResult {
  const normalizedOptions = normalizeOptions(options);
  const sampleResults = samples.map(sample =>
    evaluatePremiseAppealSample(sample, normalizedOptions)
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
  const underSampledHoldoutSamples = normalizedOptions.requireHoldoutForGateTuning
    && splitCoverage.holdoutSamples < normalizedOptions.minimumHoldoutSampleCount;
  const underSampledUsableHoldoutSamples = normalizedOptions.requireHoldoutForGateTuning
    && splitCoverage.usableHoldoutSamples < normalizedOptions.minimumUsableHoldoutSampleCount;
  const underSampledFailingHoldoutSamples = normalizedOptions.requireHoldoutForGateTuning
    && splitCoverage.failingHoldoutSamples < normalizedOptions.minimumFailingHoldoutSampleCount;
  const underSampledUsableFailingHoldoutSamples =
    normalizedOptions.requireHoldoutForGateTuning
    && splitCoverage.usableFailingHoldoutSamples <
      normalizedOptions.minimumUsableFailingHoldoutSampleCount;

  const result: PremiseAppealBenchmarkResult = {
    total: sampleResults.length,
    passed,
    failed: sampleResults.length - passed,
    accuracy: sampleResults.length === 0 ? 1 : passed / sampleResults.length,
    automatedFalsePositiveCount: countFailureType(sampleResults, 'automated-false-positive'),
    automatedFalseNegativeCount: countFailureType(sampleResults, 'automated-false-negative'),
    readerLabelMismatchCount: countFailureType(sampleResults, 'reader-label-mismatch'),
    behavioralIntentFalsePositiveCount: countFailureType(
      sampleResults,
      'behavioral-intent-false-positive'
    ),
    weakPromiseEvidenceCount: countFailureType(sampleResults, 'weak-promise-evidence'),
    promiseEvidenceCount: sampleResults.filter(result => result.promiseEvidence === 'usable').length,
    weakReaderAppealCount: countFailureType(sampleResults, 'weak-reader-appeal'),
    weakDimensionCount: countFailureType(sampleResults, 'weak-dimension'),
    insufficientEvidenceCount: countFailureType(sampleResults, 'insufficient-reader-evidence'),
    lowBehavioralIntentEvidenceCount: countFailureType(
      sampleResults,
      'weak-behavioral-intent-evidence'
    ),
    behavioralIntentEvidenceCount: sampleResults
      .filter(result => result.behavioralIntentEvidence !== 'none').length,
    weakBehavioralProtocolCount: countFailureType(
      sampleResults,
      'weak-behavioral-protocol-evidence'
    ),
    behavioralProtocolEvidenceCount: sampleResults
      .filter(result => result.behavioralProtocolQuality !== 'unknown').length,
    weakBehavioralAllocationCount: countFailureType(
      sampleResults,
      'weak-behavioral-allocation-evidence'
    ),
    behavioralAllocationEvidenceCount: sampleResults
      .filter(result => result.behavioralAllocationIntegrity !== 'unknown').length,
    genreCoverage,
    targetReaderCoverage,
    missingRequiredGenres,
    underSampledRequiredGenres,
    missingRequiredPositiveGenres,
    missingRequiredNegativeGenres,
    missingRequiredTargetReaders,
    underSampledRequiredTargetReaders,
    missingRequiredPositiveTargetReaders,
    missingRequiredNegativeTargetReaders,
    splitCoverage,
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
    PremiseAppealBenchmarkOptions,
    | 'readerAppealThreshold'
    | 'automatedAppealThreshold'
    | 'minimumDimensionScore'
    | 'minimumPanelSize'
    | 'minimumCommentedResponses'
    | 'minimumSamplesPerGenre'
    | 'minimumSamplesPerTargetReader'
    | 'minimumHoldoutSampleCount'
    | 'minimumUsableHoldoutSampleCount'
    | 'minimumFailingHoldoutSampleCount'
    | 'minimumUsableFailingHoldoutSampleCount'
    | 'minimumBehavioralImpressionCount'
    | 'minimumClickThroughRate'
    | 'minimumFirstChapterOpenRate'
    | 'minimumSaveOrFollowRate'
    | 'minimumBehavioralObservationWindowHours'
    | 'minimumSampleRatioMismatchPValue'
  >
> & {
  requiredGenres: string[];
  requiredTargetReaders: string[];
  requireHoldoutForGateTuning: boolean;
  requirePromiseEvidenceForGateTuning: boolean;
  requireBehavioralIntentEvidenceForGateTuning: boolean;
  requireBehavioralProtocolForGateTuning: boolean;
  requireBehavioralAllocationIntegrityForGateTuning: boolean;
};

function normalizeOptions(options: PremiseAppealBenchmarkOptions): NormalizedOptions {
  return {
    readerAppealThreshold: options.readerAppealThreshold ?? DEFAULT_READER_APPEAL_THRESHOLD,
    automatedAppealThreshold:
      options.automatedAppealThreshold ?? DEFAULT_AUTOMATED_APPEAL_THRESHOLD,
    minimumDimensionScore: options.minimumDimensionScore ?? DEFAULT_MINIMUM_DIMENSION_SCORE,
    minimumPanelSize: options.minimumPanelSize ?? DEFAULT_MINIMUM_PANEL_SIZE,
    minimumCommentedResponses:
      options.minimumCommentedResponses ?? DEFAULT_MINIMUM_COMMENTED_RESPONSES,
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
    requirePromiseEvidenceForGateTuning:
      options.requirePromiseEvidenceForGateTuning ?? true,
    minimumBehavioralImpressionCount: positiveIntegerOrDefault(
      options.minimumBehavioralImpressionCount,
      DEFAULT_MINIMUM_BEHAVIORAL_IMPRESSION_COUNT
    ),
    minimumClickThroughRate:
      options.minimumClickThroughRate ?? DEFAULT_MINIMUM_CLICK_THROUGH_RATE,
    minimumFirstChapterOpenRate:
      options.minimumFirstChapterOpenRate ?? DEFAULT_MINIMUM_FIRST_CHAPTER_OPEN_RATE,
    minimumSaveOrFollowRate:
      options.minimumSaveOrFollowRate ?? DEFAULT_MINIMUM_SAVE_OR_FOLLOW_RATE,
    minimumBehavioralObservationWindowHours:
      options.minimumBehavioralObservationWindowHours ??
      DEFAULT_MINIMUM_BEHAVIORAL_OBSERVATION_WINDOW_HOURS,
    minimumSampleRatioMismatchPValue: ratioOrDefault(
      options.minimumSampleRatioMismatchPValue,
      DEFAULT_MINIMUM_SAMPLE_RATIO_MISMATCH_P_VALUE
    ),
    requireBehavioralIntentEvidenceForGateTuning:
      options.requireBehavioralIntentEvidenceForGateTuning ?? false,
    requireBehavioralProtocolForGateTuning:
      options.requireBehavioralProtocolForGateTuning ?? false,
    requireBehavioralAllocationIntegrityForGateTuning:
      options.requireBehavioralAllocationIntegrityForGateTuning ?? false,
  };
}

function evaluatePremiseAppealSample(
  sample: PremiseAppealBenchmarkSample,
  options: NormalizedOptions
): PremiseAppealBenchmarkSampleResult {
  const responseCount = sample.readerResponses.length;
  const commentedResponseCount = sample.readerResponses.filter(response =>
    hasActionableComment(response)
  ).length;
  const dimensionResults = scoreDimensions(sample, options);
  const weightedDimensionScore = weightedAverageDimensions(dimensionResults);
  const wouldReadScore = averageWouldReadScore(sample);
  const readerAppealScore =
    wouldReadScore === undefined
      ? weightedDimensionScore
      : weightedDimensionScore * 0.85 + wouldReadScore * 0.15;
  const readerPassed =
    readerAppealScore >= options.readerAppealThreshold &&
    (wouldReadScore === undefined || wouldReadScore >= 65);
  const automatedPassed =
    sample.automatedScore === undefined
      ? undefined
      : sample.automatedScore >= options.automatedAppealThreshold;
  const promiseEvidence = evaluatePromiseEvidence(sample.premise);
  const behavioralIntent = evaluateBehavioralIntentEvidence(sample, options);
  const behavioralProtocol = evaluateBehavioralProtocolQuality(sample, options);
  const behavioralAllocation = evaluateBehavioralAllocationIntegrity(sample, options);
  const readerEvidenceSufficient =
    responseCount >= options.minimumPanelSize &&
    commentedResponseCount >= options.minimumCommentedResponses;
  const evidenceSufficient =
    readerEvidenceSufficient &&
    (
      !options.requirePromiseEvidenceForGateTuning ||
      promiseEvidence.status === 'usable'
    ) &&
    (
      !options.requireBehavioralIntentEvidenceForGateTuning ||
      behavioralIntent.status === 'usable'
    ) &&
    (
      !options.requireBehavioralProtocolForGateTuning ||
      behavioralProtocol.quality === 'strong'
    ) &&
    (
      !options.requireBehavioralAllocationIntegrityForGateTuning ||
      behavioralAllocation.integrity === 'strong'
    );
  const weakDimensions = dimensionResults
    .filter(result => !result.passed)
    .map(result => result.dimension);
  const failureTypes = determineFailureTypes({
    sample,
    readerPassed,
    automatedPassed,
    readerAppealScore,
    behavioralIntentPassed: behavioralIntent.passed,
    behavioralIntentEvidence: behavioralIntent.status,
    behavioralProtocolQuality: behavioralProtocol.quality,
    behavioralAllocationIntegrity: behavioralAllocation.integrity,
    promiseEvidenceStatus: promiseEvidence.status,
    evidenceSufficient: readerEvidenceSufficient,
    weakDimensions,
    options,
  });
  const recommendations = buildSampleRecommendations(
    sample,
    failureTypes,
    weakDimensions,
    readerAppealScore
  );

  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre,
    targetReader: sample.targetReader ?? sample.premise?.target_reader,
    calibrationSplit: sample.calibrationSplit,
    evidenceFingerprint: fingerprintSampleEvidence(sample),
    promiseEvidence: promiseEvidence.status,
    promiseEvidenceIssues: promiseEvidence.issues,
    promiseEvidenceFieldCount: promiseEvidence.fieldCount,
    automatedScore: sample.automatedScore,
    automatedPassed,
    expectedAppealing: sample.expectedAppealing,
    readerAppealScore: roundScore(readerAppealScore),
    readerPassed,
    wouldReadScore: wouldReadScore === undefined ? undefined : roundScore(wouldReadScore),
    behavioralIntentEvidence: behavioralIntent.status,
    behavioralIntentEvidenceIssues: behavioralIntent.issues,
    behavioralIntentScore: behavioralIntent.score,
    behavioralIntentPassed: behavioralIntent.passed,
    behavioralProtocolQuality: behavioralProtocol.quality,
    behavioralProtocolIssues: behavioralProtocol.issues,
    behavioralAllocationIntegrity: behavioralAllocation.integrity,
    behavioralAllocationIssues: behavioralAllocation.issues,
    behavioralExpectedVariantAllocationRatio:
      behavioralAllocation.expectedVariantAllocationRatio,
    behavioralObservedVariantAllocationRatio:
      behavioralAllocation.observedVariantAllocationRatio,
    behavioralSampleRatioMismatchPValue:
      behavioralAllocation.sampleRatioMismatchPValue,
    behavioralImpressionCount: behavioralIntent.impressionCount,
    behavioralClickThroughRate: behavioralIntent.clickThroughRate,
    behavioralFirstChapterOpenRate: behavioralIntent.firstChapterOpenRate,
    behavioralSaveOrFollowRate: behavioralIntent.saveOrFollowRate,
    responseCount,
    commentedResponseCount,
    evidenceSufficient,
    weakDimensions,
    dimensionResults,
    passed: failureTypes.length === 0,
    failureTypes,
    failureType: failureTypes[0],
    recommendations,
  };
}

function scoreDimensions(
  sample: PremiseAppealBenchmarkSample,
  options: NormalizedOptions
): PremiseAppealBenchmarkDimensionResult[] {
  return DIMENSIONS.map(dimension => {
    const scores = sample.readerResponses
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
  dimensionResults: PremiseAppealBenchmarkDimensionResult[]
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

function averageWouldReadScore(
  sample: PremiseAppealBenchmarkSample
): number | undefined {
  const scores = sample.readerResponses
    .map(response => {
      if (typeof response.wouldRead === 'boolean') {
        return response.wouldRead ? 100 : 0;
      }
      return normalizeRating(
        response.wouldReadScore,
        response.ratingScale ?? sample.ratingScale ?? 'likert-7'
      );
    })
    .filter((score): score is number => score !== undefined);

  return scores.length === 0 ? undefined : average(scores);
}

interface PromiseEvidenceEvaluation {
  status: PremiseAppealPromiseEvidenceStatus;
  issues: string[];
  fieldCount: number;
}

function evaluatePromiseEvidence(
  premise: PremiseAppealPromise | undefined
): PromiseEvidenceEvaluation {
  if (!premise) {
    return {
      status: 'missing',
      issues: ['missing-premise'],
      fieldCount: 0,
    };
  }

  const issues: string[] = [];
  let fieldCount = 0;

  for (const field of REQUIRED_PROMISE_EVIDENCE_FIELDS) {
    if (hasMeaningfulText(premise[field] as string | undefined)) {
      fieldCount += 1;
    } else {
      issues.push(`missing-${toKebabCase(field)}`);
    }
  }

  return {
    status: issues.length === 0 ? 'usable' : 'weak',
    issues,
    fieldCount,
  };
}

interface BehavioralIntentEvaluation {
  status: PremiseAppealBehavioralIntentEvidenceStatus;
  issues: string[];
  score?: number;
  passed?: boolean;
  impressionCount?: number;
  clickThroughRate?: number;
  firstChapterOpenRate?: number;
  saveOrFollowRate?: number;
}

interface BehavioralProtocolEvaluation {
  quality: PremiseAppealBehavioralProtocolQuality;
  issues: string[];
}

interface BehavioralAllocationEvaluation {
  integrity: PremiseAppealBehavioralAllocationIntegrity;
  issues: string[];
  expectedVariantAllocationRatio?: number;
  observedVariantAllocationRatio?: number;
  sampleRatioMismatchPValue?: number;
}

function evaluateBehavioralIntentEvidence(
  sample: PremiseAppealBenchmarkSample,
  options: NormalizedOptions
): BehavioralIntentEvaluation {
  const evidence = sample.behavioralEvidence;
  if (!evidence) {
    return {
      status: 'none',
      issues: ['missing-behavioral-evidence'],
    };
  }

  const impressionCount = nonNegativeNumber(evidence.impressionCount);
  const clickCount = nonNegativeNumber(evidence.clickCount);
  const firstChapterOpenCount = nonNegativeNumber(evidence.firstChapterOpenCount);
  const saveOrFollowCount = sumDefinedNumbers([
    evidence.libraryAddCount,
    evidence.followCount,
  ]);
  const issues: string[] = [];

  if (impressionCount === undefined || impressionCount <= 0) {
    return {
      status: 'none',
      issues: ['missing-behavioral-impressions'],
    };
  }

  if (impressionCount < options.minimumBehavioralImpressionCount) {
    issues.push('low-behavioral-impressions');
  }
  if (clickCount === undefined) {
    issues.push('missing-click-count');
  }
  if (firstChapterOpenCount === undefined) {
    issues.push('missing-first-chapter-open-count');
  }
  if (saveOrFollowCount === undefined) {
    issues.push('missing-save-or-follow-count');
  }

  const clickThroughRate = clickCount === undefined
    ? undefined
    : clickCount / impressionCount;
  const firstChapterOpenRate = firstChapterOpenCount === undefined
    ? undefined
    : firstChapterOpenCount / impressionCount;
  const saveOrFollowRate = saveOrFollowCount === undefined
    ? undefined
    : saveOrFollowCount / impressionCount;
  const status: PremiseAppealBehavioralIntentEvidenceStatus =
    issues.length === 0 ? 'usable' : 'weak';

  const clickThreshold = positiveRatioOrDefault(
    evidence.benchmarkClickThroughRate,
    options.minimumClickThroughRate
  );
  const openThreshold = positiveRatioOrDefault(
    evidence.benchmarkFirstChapterOpenRate,
    options.minimumFirstChapterOpenRate
  );
  const saveThreshold = positiveRatioOrDefault(
    evidence.benchmarkSaveOrFollowRate,
    options.minimumSaveOrFollowRate
  );

  const score =
    clickThroughRate === undefined ||
    firstChapterOpenRate === undefined ||
    saveOrFollowRate === undefined
      ? undefined
      : roundScore(
        rateScore(clickThroughRate, clickThreshold) * 0.45 +
        rateScore(firstChapterOpenRate, openThreshold) * 0.35 +
        rateScore(saveOrFollowRate, saveThreshold) * 0.2
      );
  const passed =
    status === 'usable' && score !== undefined
      ? clickThroughRate! >= clickThreshold &&
        firstChapterOpenRate! >= openThreshold &&
        saveOrFollowRate! >= saveThreshold
      : undefined;

  return {
    status,
    issues,
    score,
    passed,
    impressionCount,
    clickThroughRate: clickThroughRate === undefined ? undefined : roundRatio(clickThroughRate),
    firstChapterOpenRate:
      firstChapterOpenRate === undefined ? undefined : roundRatio(firstChapterOpenRate),
    saveOrFollowRate: saveOrFollowRate === undefined ? undefined : roundRatio(saveOrFollowRate),
  };
}

function evaluateBehavioralProtocolQuality(
  sample: PremiseAppealBenchmarkSample,
  options: NormalizedOptions
): BehavioralProtocolEvaluation {
  const evidence = sample.behavioralEvidence;
  if (!evidence) {
    return {
      quality: 'unknown',
      issues: ['missing-behavioral-evidence'],
    };
  }

  const issues: string[] = [];
  if (!hasText(evidence.platform)) {
    issues.push('missing-platform');
  }
  if (!hasText(evidence.variantLabel)) {
    issues.push('missing-variant-label');
  }
  if (!hasText(evidence.acquisitionSource)) {
    issues.push('missing-acquisition-source');
  }
  if (evidence.blindListingTest !== true) {
    issues.push('not-blind-listing-test');
  }
  if (evidence.observationWindowHours === undefined) {
    issues.push('missing-observation-window-hours');
  } else if (
    !Number.isFinite(evidence.observationWindowHours) ||
    evidence.observationWindowHours < options.minimumBehavioralObservationWindowHours
  ) {
    issues.push('short-observation-window');
  }

  return {
    quality: issues.length === 0 ? 'strong' : 'weak',
    issues,
  };
}

function evaluateBehavioralAllocationIntegrity(
  sample: PremiseAppealBenchmarkSample,
  options: NormalizedOptions
): BehavioralAllocationEvaluation {
  const evidence = sample.behavioralEvidence;
  if (!evidence) {
    return {
      integrity: 'unknown',
      issues: ['missing-behavioral-evidence'],
    };
  }

  const expectedVariantAllocationRatio = finiteRatio(
    evidence.expectedVariantAllocationRatio
  );
  const observedVariantAllocationRatio = finiteRatio(
    evidence.observedVariantAllocationRatio
  );
  const sampleRatioMismatchPValue = finiteRatio(
    evidence.sampleRatioMismatchPValue
  );
  const hasAllocationEvidence =
    expectedVariantAllocationRatio !== undefined ||
    observedVariantAllocationRatio !== undefined ||
    sampleRatioMismatchPValue !== undefined;

  if (!hasAllocationEvidence) {
    return {
      integrity: 'unknown',
      issues: ['missing-allocation-integrity-evidence'],
    };
  }

  const issues: string[] = [];
  if (expectedVariantAllocationRatio === undefined) {
    issues.push('missing-expected-variant-allocation-ratio');
  }
  if (observedVariantAllocationRatio === undefined) {
    issues.push('missing-observed-variant-allocation-ratio');
  }
  if (sampleRatioMismatchPValue === undefined) {
    issues.push('missing-sample-ratio-mismatch-p-value');
  } else if (sampleRatioMismatchPValue < options.minimumSampleRatioMismatchPValue) {
    issues.push('sample-ratio-mismatch-detected');
  }

  return {
    integrity: issues.length === 0 ? 'strong' : 'weak',
    issues,
    expectedVariantAllocationRatio:
      expectedVariantAllocationRatio === undefined
        ? undefined
        : roundRatio(expectedVariantAllocationRatio),
    observedVariantAllocationRatio:
      observedVariantAllocationRatio === undefined
        ? undefined
        : roundRatio(observedVariantAllocationRatio),
    sampleRatioMismatchPValue:
      sampleRatioMismatchPValue === undefined
        ? undefined
        : roundProbability(sampleRatioMismatchPValue),
  };
}

function determineFailureTypes(input: {
  sample: PremiseAppealBenchmarkSample;
  readerPassed: boolean;
  automatedPassed?: boolean;
  readerAppealScore: number;
  behavioralIntentPassed?: boolean;
  behavioralIntentEvidence: PremiseAppealBehavioralIntentEvidenceStatus;
  behavioralProtocolQuality: PremiseAppealBehavioralProtocolQuality;
  behavioralAllocationIntegrity: PremiseAppealBehavioralAllocationIntegrity;
  promiseEvidenceStatus: PremiseAppealPromiseEvidenceStatus;
  evidenceSufficient: boolean;
  weakDimensions: PremiseAppealDimension[];
  options: NormalizedOptions;
}): PremiseAppealFailureType[] {
  const failureTypes: PremiseAppealFailureType[] = [];
  const {
    sample,
    readerPassed,
    automatedPassed,
    readerAppealScore,
    behavioralIntentPassed,
    behavioralIntentEvidence,
    behavioralProtocolQuality,
    behavioralAllocationIntegrity,
    promiseEvidenceStatus,
    evidenceSufficient,
    weakDimensions,
    options,
  } = input;

  if (automatedPassed === true && !readerPassed) {
    failureTypes.push('automated-false-positive');
  }
  if (automatedPassed === false && readerPassed) {
    failureTypes.push('automated-false-negative');
  }
  if (sample.expectedAppealing !== undefined && sample.expectedAppealing !== readerPassed) {
    failureTypes.push('reader-label-mismatch');
  }
  if (
    behavioralIntentPassed === false &&
    (automatedPassed === true || readerPassed || sample.expectedAppealing === true)
  ) {
    failureTypes.push('behavioral-intent-false-positive');
  }
  if (options.requirePromiseEvidenceForGateTuning && promiseEvidenceStatus !== 'usable') {
    failureTypes.push('weak-promise-evidence');
  }
  if (readerAppealScore < options.readerAppealThreshold) {
    failureTypes.push('weak-reader-appeal');
  }
  if (weakDimensions.length > 0) {
    failureTypes.push('weak-dimension');
  }
  if (!evidenceSufficient) {
    failureTypes.push('insufficient-reader-evidence');
  }
  if (
    options.requireBehavioralIntentEvidenceForGateTuning &&
    behavioralIntentEvidence !== 'usable'
  ) {
    failureTypes.push('weak-behavioral-intent-evidence');
  }
  if (
    options.requireBehavioralProtocolForGateTuning &&
    behavioralProtocolQuality !== 'strong'
  ) {
    failureTypes.push('weak-behavioral-protocol-evidence');
  }
  if (
    options.requireBehavioralAllocationIntegrityForGateTuning &&
    behavioralAllocationIntegrity !== 'strong'
  ) {
    failureTypes.push('weak-behavioral-allocation-evidence');
  }

  return uniqueFailureTypes(failureTypes);
}

function buildSampleRecommendations(
  sample: PremiseAppealBenchmarkSample,
  failureTypes: PremiseAppealFailureType[],
  weakDimensions: PremiseAppealDimension[],
  readerAppealScore: number
): string[] {
  const recommendations: string[] = [];
  if (failureTypes.includes('automated-false-positive')) {
    recommendations.push(
      'Do not raise the design gate threshold from this sample until the premise promise is rewritten and retested with target readers.'
    );
  }
  if (failureTypes.includes('automated-false-negative')) {
    recommendations.push(
      'Inspect whether the automated premise evaluator is penalizing a reader-approved genre convention or phrasing style.'
    );
  }
  if (failureTypes.includes('weak-reader-appeal')) {
    recommendations.push(
      `Reader premise appeal is ${roundScore(readerAppealScore)}; strengthen the information gap, protagonist stake, and emotional payoff before writing chapters.`
    );
  }
  if (failureTypes.includes('weak-promise-evidence')) {
    recommendations.push(
      'Add actionable premise promise evidence: core hook, irresistible question, protagonist appeal, novelty angle, emotional payoff, binge reason, and long-series engine before using this sample for design gate tuning.'
    );
  }
  if (failureTypes.includes('behavioral-intent-false-positive')) {
    recommendations.push(
      'Retest the title, one-line hook, blurb, and listing package; readers rated the premise as promising but behavioral click/open/save signals did not confirm acquisition appeal.'
    );
  }
  if (weakDimensions.length > 0) {
    recommendations.push(
      `Retest weak premise dimensions: ${weakDimensions.join(', ')}.`
    );
  }
  if (failureTypes.includes('insufficient-reader-evidence')) {
    recommendations.push(
      'Add more target-reader responses with comments, confusion points, or rewrite suggestions before treating this sample as calibration evidence.'
    );
  }
  if (failureTypes.includes('weak-behavioral-intent-evidence')) {
    recommendations.push(
      'Add listing-level behavioral evidence with enough impressions plus click, first-chapter-open, and save/follow counts before treating this sample as gate-tuning evidence.'
    );
  }
  if (failureTypes.includes('weak-behavioral-protocol-evidence')) {
    recommendations.push(
      'Record a trustworthy behavioral test protocol: platform, variant label, acquisition source, blind listing status, and observation window before treating click/open/save rates as 98+ evidence.'
    );
  }
  if (failureTypes.includes('weak-behavioral-allocation-evidence')) {
    recommendations.push(
      'Verify behavioral allocation integrity with expected and observed variant allocation ratios plus an SRM p-value before treating listing behavior as 98+ evidence.'
    );
  }
  if (sample.expectedAppealing !== undefined && failureTypes.includes('reader-label-mismatch')) {
    recommendations.push(
      'Review the human label for this premise sample or split it into clearer known-good and known-bad variants.'
    );
  }
  return recommendations;
}

function buildRecommendations(
  result: PremiseAppealBenchmarkResult,
  options: NormalizedOptions
): string[] {
  const recommendations: string[] = [];
  if (result.automatedFalsePositiveCount > 0) {
    recommendations.push(
      'Tighten reader-promise design checks for premises that automated scoring accepts but target readers do not want to read.'
    );
  }
  if (result.automatedFalseNegativeCount > 0) {
    recommendations.push(
      'Inspect reader-approved premises that automated scoring rejects before raising premise gate thresholds.'
    );
  }
  if (result.readerLabelMismatchCount > 0) {
    recommendations.push(
      'Audit premise sample labels whose observed reader appeal contradicts the expected appealing flag.'
    );
  }
  if (result.behavioralIntentFalsePositiveCount > 0) {
    recommendations.push(
      'Do not promote premises whose survey appeal is high but listing-level click, first-open, or save/follow behavior stays below the project benchmark.'
    );
  }
  if (result.weakPromiseEvidenceCount > 0) {
    recommendations.push(
      'Add premise promise evidence so reader appeal can be traced to a concrete hook, question, protagonist appeal, novelty angle, emotional payoff, binge reason, and long-series engine.'
    );
  }
  if (result.weakDimensionCount > 0) {
    recommendations.push(
      'Revise premise samples with weak curiosity, novelty, protagonist investment, emotional pull, clarity, target fit, or anticipation dimensions.'
    );
  }
  if (result.insufficientEvidenceCount > 0) {
    recommendations.push(
      'Collect more commented target-reader premise responses before using this benchmark for gate tuning.'
    );
  }
  if (result.lowBehavioralIntentEvidenceCount > 0) {
    recommendations.push(
      'Collect listing-level behavioral premise evidence with impressions, clicks, first-chapter opens, and save/follow counts before using this benchmark for gate tuning.'
    );
  }
  if (result.weakBehavioralProtocolCount > 0) {
    recommendations.push(
      'Strengthen behavioral premise evidence protocols with blind listing tests, platform/source disclosure, variant labels, and adequate observation windows.'
    );
  }
  if (result.weakBehavioralAllocationCount > 0) {
    recommendations.push(
      'Check behavioral premise evidence for sample-ratio mismatch before using listing A/B data to tune 98+ premise gates.'
    );
  }
  if (result.missingRequiredGenres.length > 0) {
    recommendations.push(
      `Add premise appeal samples for missing required genres: ${result.missingRequiredGenres.join(', ')}.`
    );
  }
  if (result.underSampledRequiredGenres.length > 0) {
    recommendations.push(
      `Add more premise appeal samples for under-sampled genres: ${result.underSampledRequiredGenres.join(', ')}.`
    );
  }
  if (result.missingRequiredPositiveGenres.length > 0) {
    recommendations.push(
      `Add known-good premise appeal samples for genres: ${result.missingRequiredPositiveGenres.join(', ')}.`
    );
  }
  if (result.missingRequiredNegativeGenres.length > 0) {
    recommendations.push(
      `Add known-bad premise appeal samples for genres: ${result.missingRequiredNegativeGenres.join(', ')}.`
    );
  }
  if (result.missingRequiredTargetReaders.length > 0) {
    recommendations.push(
      `Add premise appeal samples for target readers: ${result.missingRequiredTargetReaders.join(', ')}.`
    );
  }
  if (result.underSampledRequiredTargetReaders.length > 0) {
    recommendations.push(
      `Add more premise appeal samples for under-sampled target readers: ${result.underSampledRequiredTargetReaders.join(', ')}.`
    );
  }
  if (result.missingRequiredPositiveTargetReaders.length > 0) {
    recommendations.push(
      `Add known-good premise appeal samples for target readers: ${result.missingRequiredPositiveTargetReaders.join(', ')}.`
    );
  }
  if (result.missingRequiredNegativeTargetReaders.length > 0) {
    recommendations.push(
      `Add known-bad premise appeal samples for target readers: ${result.missingRequiredNegativeTargetReaders.join(', ')}.`
    );
  }
  if (result.underSampledHoldoutSamples) {
    recommendations.push(
      `Reserve at least ${options.minimumHoldoutSampleCount} premise appeal holdout sample(s) before tuning design gates.`
    );
  }
  if (result.underSampledUsableHoldoutSamples) {
    recommendations.push(
      `Accumulate at least ${options.minimumUsableHoldoutSampleCount} evidence-sufficient premise holdout sample(s) before using this benchmark for gate tuning.`
    );
  }
  if (result.underSampledFailingHoldoutSamples) {
    recommendations.push(
      `Reserve at least ${options.minimumFailingHoldoutSampleCount} known-bad premise holdout sample(s) to catch weak-concept false positives.`
    );
  }
  if (result.underSampledUsableFailingHoldoutSamples) {
    recommendations.push(
      `Accumulate at least ${options.minimumUsableFailingHoldoutSampleCount} evidence-sufficient known-bad premise holdout sample(s) before using this benchmark for gate tuning.`
    );
  }
  if (result.splitLeakageCount > 0) {
    recommendations.push(
      'Move duplicated premise evidence out of holdout or calibration splits; the same reader-promise premise cannot validate design gate tuning independently.'
    );
  }
  if (result.splitCoverage.unassignedSamples > 0) {
    recommendations.push(
      'Set calibrationSplit/calibration_split on every premise appeal sample so tuning, validation, and holdout evidence cannot be mixed.'
    );
  }
  return recommendations;
}

function countSplitCoverage(
  sampleResults: PremiseAppealBenchmarkSampleResult[]
): PremiseAppealBenchmarkSplitCoverage {
  return sampleResults.reduce<PremiseAppealBenchmarkSplitCoverage>(
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
        if (isKnownBadPremiseSample(result)) {
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
  sampleResults: PremiseAppealBenchmarkSampleResult[]
): PremiseAppealBenchmarkSplitLeakage[] {
  const byFingerprint = new Map<string, PremiseAppealBenchmarkSampleResult[]>();

  for (const result of sampleResults) {
    if (!result.calibrationSplit) continue;
    const group = byFingerprint.get(result.evidenceFingerprint) ?? [];
    group.push(result);
    byFingerprint.set(result.evidenceFingerprint, group);
  }

  const leakages: PremiseAppealBenchmarkSplitLeakage[] = [];
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
  sampleResults: PremiseAppealBenchmarkSampleResult[]
): PremiseAppealCalibrationSplit[] {
  return Array.from(
    new Set(
      sampleResults
        .map(result => result.calibrationSplit)
        .filter((split): split is PremiseAppealCalibrationSplit => split !== undefined)
    )
  ).sort();
}

function isKnownBadPremiseSample(
  result: PremiseAppealBenchmarkSampleResult
): boolean {
  return !(result.expectedAppealing ?? result.readerPassed);
}

function isReadyForGateTuning(result: PremiseAppealBenchmarkResult): boolean {
  return result.insufficientEvidenceCount === 0
    && result.readerLabelMismatchCount === 0
    && result.behavioralIntentFalsePositiveCount === 0
    && result.weakPromiseEvidenceCount === 0
    && result.lowBehavioralIntentEvidenceCount === 0
    && result.weakBehavioralProtocolCount === 0
    && result.weakBehavioralAllocationCount === 0
    && result.missingRequiredGenres.length === 0
    && result.underSampledRequiredGenres.length === 0
    && result.missingRequiredPositiveGenres.length === 0
    && result.missingRequiredNegativeGenres.length === 0
    && result.missingRequiredTargetReaders.length === 0
    && result.underSampledRequiredTargetReaders.length === 0
    && result.missingRequiredPositiveTargetReaders.length === 0
    && result.missingRequiredNegativeTargetReaders.length === 0
    && !result.underSampledHoldoutSamples
    && !result.underSampledUsableHoldoutSamples
    && !result.underSampledFailingHoldoutSamples
    && !result.underSampledUsableFailingHoldoutSamples
    && result.splitLeakageCount === 0;
}

function countCoverage(
  sampleResults: PremiseAppealBenchmarkSampleResult[],
  keySelector: (sample: PremiseAppealBenchmarkSampleResult) => string | undefined
): Record<string, PremiseAppealBenchmarkCoverage> {
  return sampleResults.reduce<Record<string, PremiseAppealBenchmarkCoverage>>(
    (coverage, sample) => {
      const key = keySelector(sample);
      if (!key) return coverage;
      coverage[key] ??= { total: 0, positive: 0, negative: 0 };
      coverage[key].total += 1;
      if (sample.expectedAppealing ?? sample.readerPassed) {
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
  coverage: Record<string, PremiseAppealBenchmarkCoverage>
): string[] {
  return requiredKeys.filter(key => coverage[key] === undefined);
}

function underSampledRequiredKeys(
  requiredKeys: string[],
  coverage: Record<string, PremiseAppealBenchmarkCoverage>,
  minimumSamples: number
): string[] {
  if (minimumSamples <= 1) return [];
  return requiredKeys.filter(key => (coverage[key]?.total ?? 0) < minimumSamples);
}

function missingRequiredPolarity(
  requiredKeys: string[],
  coverage: Record<string, PremiseAppealBenchmarkCoverage>,
  polarity: 'positive' | 'negative'
): string[] {
  return requiredKeys.filter(key => (coverage[key]?.[polarity] ?? 0) === 0);
}

function countFailureType(
  sampleResults: PremiseAppealBenchmarkSampleResult[],
  failureType: PremiseAppealFailureType
): number {
  return sampleResults.filter(result => result.failureTypes.includes(failureType)).length;
}

function normalizeRating(
  value: number | undefined,
  scale: PremiseAppealRatingScale
): number | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  if (scale === 'percent-100') {
    return clamp(value, 0, 100);
  }
  return clamp(((value - 1) / 6) * 100, 0, 100);
}

function hasActionableComment(response: PremiseAppealReaderResponse): boolean {
  return (
    (response.comment?.trim().length ?? 0) >= 8 ||
    (response.rewriteSuggestion?.trim().length ?? 0) >= 8 ||
    (response.confusionPoints?.some(point => point.trim().length > 0) ?? false) ||
    (response.attractiveElements?.some(point => point.trim().length > 0) ?? false)
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
  return Math.round(value * 10000) / 10000;
}

function roundProbability(value: number): number {
  return Math.round(value * 1000000) / 1000000;
}

function nonNegativeNumber(value: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : undefined;
}

function sumDefinedNumbers(values: Array<number | undefined>): number | undefined {
  const defined = values.map(nonNegativeNumber).filter((value): value is number => value !== undefined);
  return defined.length === 0 ? undefined : defined.reduce((sum, value) => sum + value, 0);
}

function positiveRatioOrDefault(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 1
    ? value
    : fallback;
}

function ratioOrDefault(value: number | undefined, fallback: number): number {
  return finiteRatio(value) ?? fallback;
}

function finiteRatio(value: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
    ? value
    : undefined;
}

function rateScore(rate: number, threshold: number): number {
  if (threshold <= 0) return 100;
  return clamp((rate / threshold) * 100, 0, 100);
}

function hasText(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasMeaningfulText(value: string | undefined): boolean {
  return (value?.trim().length ?? 0) >= 8;
}

function toKebabCase(value: string): string {
  return value
    .replace(/_/g, '-')
    .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(Boolean))];
}

function positiveIntegerOrDefault(
  value: number | undefined,
  fallback: number
): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? value
    : fallback;
}

function uniqueFailureTypes(
  values: PremiseAppealFailureType[]
): PremiseAppealFailureType[] {
  return [...new Set(values)];
}

function fingerprintSampleEvidence(sample: PremiseAppealBenchmarkSample): string {
  const payload = stableJsonStringify({
    genre: sample.genre,
    targetReader: sample.targetReader,
    premise: sample.premise,
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
