/**
 * Character Relationship Benchmark
 *
 * Compares automated character/relationship drama scores with target-reader
 * response samples. This catches scenes that look structurally valid but do
 * not make readers care about the character outcome or relationship turn.
 *
 * @module quality/character-relationship-benchmark
 */

import { createHash } from 'node:crypto';

export type CharacterRelationshipDimension =
  | 'protagonist_agency'
  | 'distinctive_signature'
  | 'vulnerability_cost'
  | 'character_attachment'
  | 'relationship_tension'
  | 'reciprocal_pressure'
  | 'subtext_inference'
  | 'turn_consequence'
  | 'next_scene_interest';

export type CharacterRelationshipRatingScale = 'likert-7' | 'percent-100';

export type CharacterRelationshipCalibrationSplit =
  | 'calibration'
  | 'validation'
  | 'holdout';

export type CharacterRelationshipFocusEvidenceStatus =
  | 'missing'
  | 'weak'
  | 'usable';

export type CharacterRelationshipFailureType =
  | 'automated-false-positive'
  | 'automated-false-negative'
  | 'reader-label-mismatch'
  | 'weak-focus-evidence'
  | 'weak-reader-investment'
  | 'weak-dimension'
  | 'insufficient-reader-evidence';

export interface CharacterRelationshipFocus {
  characterId?: string;
  characterName?: string;
  relationshipId?: string;
  relationshipType?: string;
  counterpartId?: string;
  counterpartName?: string;
  scenePromise?: string;
  characterAppealMoment?: string;
  relationshipTurn?: string;
  intendedChange?: string;
  consequence?: string;
}

export interface CharacterRelationshipReaderResponse {
  readerId?: string;
  targetReaderFit?: boolean;
  ratingScale?: CharacterRelationshipRatingScale;
  ratings: Partial<Record<CharacterRelationshipDimension, number>>;
  wouldFollowCharacter?: boolean;
  wouldFollowRelationship?: boolean;
  wouldContinueScore?: number;
  comment?: string;
  carePoints?: string[];
  disbeliefPoints?: string[];
  rewriteSuggestion?: string;
}

export interface CharacterRelationshipBenchmarkReaderEvidence {
  readerId?: string;
  comment?: string;
  carePoints?: string[];
  disbeliefPoints?: string[];
  rewriteSuggestion?: string;
}

export interface CharacterRelationshipBenchmarkSample {
  id: string;
  label?: string;
  genre?: string;
  targetReader?: string;
  chapter?: number;
  focus?: CharacterRelationshipFocus;
  automatedScore?: number;
  expectedInvesting?: boolean;
  calibrationSplit?: CharacterRelationshipCalibrationSplit;
  ratingScale?: CharacterRelationshipRatingScale;
  readerResponses: CharacterRelationshipReaderResponse[];
}

export interface CharacterRelationshipBenchmarkOptions {
  readerInvestmentThreshold?: number;
  automatedInvestmentThreshold?: number;
  minimumDimensionScore?: number;
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  requiredGenres?: string[];
  requiredTargetReaders?: string[];
  requiredRelationshipTypes?: string[];
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumSamplesPerRelationshipType?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  requireHoldoutForGateTuning?: boolean;
  requireFocusEvidenceForGateTuning?: boolean;
}

export interface CharacterRelationshipBenchmarkDimensionResult {
  dimension: CharacterRelationshipDimension;
  score: number;
  responseCount: number;
  passed: boolean;
}

export interface CharacterRelationshipBenchmarkSampleResult {
  id: string;
  label?: string;
  genre?: string;
  targetReader?: string;
  chapter?: number;
  focus?: CharacterRelationshipFocus;
  relationshipType?: string;
  calibrationSplit?: CharacterRelationshipCalibrationSplit;
  evidenceFingerprint: string;
  focusEvidence: CharacterRelationshipFocusEvidenceStatus;
  focusEvidenceIssues: string[];
  focusEvidenceFieldCount: number;
  automatedScore?: number;
  automatedPassed?: boolean;
  expectedInvesting?: boolean;
  readerInvestmentScore: number;
  readerPassed: boolean;
  wouldContinueScore?: number;
  responseCount: number;
  commentedResponseCount: number;
  evidenceSufficient: boolean;
  weakDimensions: CharacterRelationshipDimension[];
  dimensionResults: CharacterRelationshipBenchmarkDimensionResult[];
  passed: boolean;
  failureTypes: CharacterRelationshipFailureType[];
  failureType?: CharacterRelationshipFailureType;
  recommendations: string[];
  readerEvidence: CharacterRelationshipBenchmarkReaderEvidence[];
}

export interface CharacterRelationshipBenchmarkCoverage {
  total: number;
  positive: number;
  negative: number;
}

export interface CharacterRelationshipBenchmarkSplitCoverage {
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

export interface CharacterRelationshipBenchmarkSplitLeakage {
  fingerprint: string;
  sampleIds: string[];
  calibrationSplits: CharacterRelationshipCalibrationSplit[];
}

export interface CharacterRelationshipBenchmarkResult {
  total: number;
  passed: number;
  failed: number;
  accuracy: number;
  automatedFalsePositiveCount: number;
  automatedFalseNegativeCount: number;
  readerLabelMismatchCount: number;
  weakFocusEvidenceCount: number;
  focusEvidenceCount: number;
  weakReaderInvestmentCount: number;
  weakDimensionCount: number;
  insufficientEvidenceCount: number;
  genreCoverage: Record<string, CharacterRelationshipBenchmarkCoverage>;
  targetReaderCoverage: Record<string, CharacterRelationshipBenchmarkCoverage>;
  relationshipTypeCoverage: Record<string, CharacterRelationshipBenchmarkCoverage>;
  splitCoverage: CharacterRelationshipBenchmarkSplitCoverage;
  missingRequiredGenres: string[];
  underSampledRequiredGenres: string[];
  missingRequiredPositiveGenres: string[];
  missingRequiredNegativeGenres: string[];
  missingRequiredTargetReaders: string[];
  underSampledRequiredTargetReaders: string[];
  missingRequiredPositiveTargetReaders: string[];
  missingRequiredNegativeTargetReaders: string[];
  missingRequiredRelationshipTypes: string[];
  underSampledRequiredRelationshipTypes: string[];
  missingRequiredPositiveRelationshipTypes: string[];
  missingRequiredNegativeRelationshipTypes: string[];
  underSampledHoldoutSamples: boolean;
  underSampledUsableHoldoutSamples: boolean;
  underSampledFailingHoldoutSamples: boolean;
  underSampledUsableFailingHoldoutSamples: boolean;
  splitLeakageCount: number;
  splitLeakages: CharacterRelationshipBenchmarkSplitLeakage[];
  readyForGateTuning: boolean;
  recommendations: string[];
  sampleResults: CharacterRelationshipBenchmarkSampleResult[];
}

const DEFAULT_READER_INVESTMENT_THRESHOLD = 72;
const DEFAULT_AUTOMATED_INVESTMENT_THRESHOLD = 85;
const DEFAULT_MINIMUM_DIMENSION_SCORE = 60;
const DEFAULT_MINIMUM_PANEL_SIZE = 3;
const DEFAULT_MINIMUM_COMMENTED_RESPONSES = 2;
const DEFAULT_MINIMUM_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_FAILING_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_FAILING_HOLDOUT_SAMPLE_COUNT = 1;
const REQUIRED_FOCUS_EVIDENCE_FIELDS: Array<keyof CharacterRelationshipFocus> = [
  'scenePromise',
  'characterAppealMoment',
  'relationshipTurn',
  'intendedChange',
  'consequence',
];

const DIMENSION_WEIGHTS: Record<CharacterRelationshipDimension, number> = {
  protagonist_agency: 0.12,
  distinctive_signature: 0.1,
  vulnerability_cost: 0.12,
  character_attachment: 0.15,
  relationship_tension: 0.11,
  reciprocal_pressure: 0.11,
  subtext_inference: 0.1,
  turn_consequence: 0.11,
  next_scene_interest: 0.08,
};

const DIMENSIONS = Object.keys(DIMENSION_WEIGHTS) as CharacterRelationshipDimension[];

export function evaluateCharacterRelationshipBenchmark(
  samples: CharacterRelationshipBenchmarkSample[],
  options: CharacterRelationshipBenchmarkOptions = {}
): CharacterRelationshipBenchmarkResult {
  const normalizedOptions = normalizeOptions(options);
  const sampleResults = samples.map(sample =>
    evaluateCharacterRelationshipSample(sample, normalizedOptions)
  );
  const passed = sampleResults.filter(result => result.passed).length;
  const genreCoverage = countCoverage(sampleResults, result => result.genre);
  const targetReaderCoverage = countCoverage(sampleResults, result => result.targetReader);
  const relationshipTypeCoverage = countCoverage(
    sampleResults,
    result => result.relationshipType
  );
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
  const missingRequiredRelationshipTypes = missingRequiredKeys(
    normalizedOptions.requiredRelationshipTypes,
    relationshipTypeCoverage
  );
  const underSampledRequiredRelationshipTypes = underSampledRequiredKeys(
    normalizedOptions.requiredRelationshipTypes,
    relationshipTypeCoverage,
    normalizedOptions.minimumSamplesPerRelationshipType
  );
  const missingRequiredPositiveRelationshipTypes = missingRequiredPolarity(
    normalizedOptions.requiredRelationshipTypes,
    relationshipTypeCoverage,
    'positive'
  );
  const missingRequiredNegativeRelationshipTypes = missingRequiredPolarity(
    normalizedOptions.requiredRelationshipTypes,
    relationshipTypeCoverage,
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

  const result: CharacterRelationshipBenchmarkResult = {
    total: sampleResults.length,
    passed,
    failed: sampleResults.length - passed,
    accuracy: sampleResults.length === 0 ? 1 : passed / sampleResults.length,
    automatedFalsePositiveCount: countFailureType(sampleResults, 'automated-false-positive'),
    automatedFalseNegativeCount: countFailureType(sampleResults, 'automated-false-negative'),
    readerLabelMismatchCount: countFailureType(sampleResults, 'reader-label-mismatch'),
    weakFocusEvidenceCount: countFailureType(sampleResults, 'weak-focus-evidence'),
    focusEvidenceCount: sampleResults.filter(result => result.focusEvidence === 'usable').length,
    weakReaderInvestmentCount: countFailureType(sampleResults, 'weak-reader-investment'),
    weakDimensionCount: countFailureType(sampleResults, 'weak-dimension'),
    insufficientEvidenceCount: countFailureType(sampleResults, 'insufficient-reader-evidence'),
    genreCoverage,
    targetReaderCoverage,
    relationshipTypeCoverage,
    splitCoverage,
    missingRequiredGenres,
    underSampledRequiredGenres,
    missingRequiredPositiveGenres,
    missingRequiredNegativeGenres,
    missingRequiredTargetReaders,
    underSampledRequiredTargetReaders,
    missingRequiredPositiveTargetReaders,
    missingRequiredNegativeTargetReaders,
    missingRequiredRelationshipTypes,
    underSampledRequiredRelationshipTypes,
    missingRequiredPositiveRelationshipTypes,
    missingRequiredNegativeRelationshipTypes,
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
    CharacterRelationshipBenchmarkOptions,
    | 'readerInvestmentThreshold'
    | 'automatedInvestmentThreshold'
    | 'minimumDimensionScore'
    | 'minimumPanelSize'
    | 'minimumCommentedResponses'
    | 'minimumSamplesPerGenre'
    | 'minimumSamplesPerTargetReader'
    | 'minimumSamplesPerRelationshipType'
    | 'minimumHoldoutSampleCount'
    | 'minimumUsableHoldoutSampleCount'
    | 'minimumFailingHoldoutSampleCount'
    | 'minimumUsableFailingHoldoutSampleCount'
    | 'requireFocusEvidenceForGateTuning'
  >
> & {
  requiredGenres: string[];
  requiredTargetReaders: string[];
  requiredRelationshipTypes: string[];
  requireHoldoutForGateTuning: boolean;
};

function normalizeOptions(options: CharacterRelationshipBenchmarkOptions): NormalizedOptions {
  return {
    readerInvestmentThreshold:
      options.readerInvestmentThreshold ?? DEFAULT_READER_INVESTMENT_THRESHOLD,
    automatedInvestmentThreshold:
      options.automatedInvestmentThreshold ?? DEFAULT_AUTOMATED_INVESTMENT_THRESHOLD,
    minimumDimensionScore: options.minimumDimensionScore ?? DEFAULT_MINIMUM_DIMENSION_SCORE,
    minimumPanelSize: options.minimumPanelSize ?? DEFAULT_MINIMUM_PANEL_SIZE,
    minimumCommentedResponses:
      options.minimumCommentedResponses ?? DEFAULT_MINIMUM_COMMENTED_RESPONSES,
    requiredGenres: uniqueStrings(options.requiredGenres ?? []),
    requiredTargetReaders: uniqueStrings(options.requiredTargetReaders ?? []),
    requiredRelationshipTypes: uniqueStrings(options.requiredRelationshipTypes ?? []),
    minimumSamplesPerGenre: options.minimumSamplesPerGenre ?? 1,
    minimumSamplesPerTargetReader: options.minimumSamplesPerTargetReader ?? 1,
    minimumSamplesPerRelationshipType: options.minimumSamplesPerRelationshipType ?? 1,
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
    requireFocusEvidenceForGateTuning: options.requireFocusEvidenceForGateTuning ?? true,
  };
}

function evaluateCharacterRelationshipSample(
  sample: CharacterRelationshipBenchmarkSample,
  options: NormalizedOptions
): CharacterRelationshipBenchmarkSampleResult {
  const responseCount = sample.readerResponses.length;
  const commentedResponseCount = sample.readerResponses.filter(response =>
    hasActionableComment(response)
  ).length;
  const dimensionResults = scoreDimensions(sample, options);
  const weightedDimensionScore = weightedAverageDimensions(dimensionResults);
  const wouldContinueScore = averageWouldContinueScore(sample);
  const readerInvestmentScore =
    wouldContinueScore === undefined
      ? weightedDimensionScore
      : weightedDimensionScore * 0.82 + wouldContinueScore * 0.18;
  const readerPassed =
    readerInvestmentScore >= options.readerInvestmentThreshold &&
    (wouldContinueScore === undefined || wouldContinueScore >= 65);
  const automatedPassed =
    sample.automatedScore === undefined
      ? undefined
      : sample.automatedScore >= options.automatedInvestmentThreshold;
  const focusEvidence = evaluateFocusEvidence(sample.focus);
  const evidenceSufficient =
    responseCount >= options.minimumPanelSize &&
    commentedResponseCount >= options.minimumCommentedResponses &&
    (
      !options.requireFocusEvidenceForGateTuning ||
      focusEvidence.status === 'usable'
    );
  const weakDimensions = dimensionResults
    .filter(result => !result.passed)
    .map(result => result.dimension);
  const failureTypes = determineFailureTypes({
    sample,
    readerPassed,
    automatedPassed,
    readerInvestmentScore,
    readerEvidenceSufficient:
      responseCount >= options.minimumPanelSize &&
      commentedResponseCount >= options.minimumCommentedResponses,
    focusEvidenceStatus: focusEvidence.status,
    weakDimensions,
    options,
  });
  const recommendations = buildSampleRecommendations(
    sample,
    failureTypes,
    weakDimensions,
    readerInvestmentScore
  );

  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre,
    targetReader: sample.targetReader,
    chapter: sample.chapter,
    focus: sample.focus,
    relationshipType: sample.focus?.relationshipType ?? sample.focus?.relationshipId,
    calibrationSplit: sample.calibrationSplit,
    evidenceFingerprint: fingerprintSampleEvidence(sample),
    focusEvidence: focusEvidence.status,
    focusEvidenceIssues: focusEvidence.issues,
    focusEvidenceFieldCount: focusEvidence.fieldCount,
    automatedScore: sample.automatedScore,
    automatedPassed,
    expectedInvesting: sample.expectedInvesting,
    readerInvestmentScore: roundScore(readerInvestmentScore),
    readerPassed,
    wouldContinueScore:
      wouldContinueScore === undefined ? undefined : roundScore(wouldContinueScore),
    responseCount,
    commentedResponseCount,
    evidenceSufficient,
    weakDimensions,
    dimensionResults,
    passed: failureTypes.length === 0,
    failureTypes,
    failureType: failureTypes[0],
    recommendations,
    readerEvidence: summarizeReaderEvidence(sample.readerResponses),
  };
}

function scoreDimensions(
  sample: CharacterRelationshipBenchmarkSample,
  options: NormalizedOptions
): CharacterRelationshipBenchmarkDimensionResult[] {
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
  dimensionResults: CharacterRelationshipBenchmarkDimensionResult[]
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
  sample: CharacterRelationshipBenchmarkSample
): number | undefined {
  const scores = sample.readerResponses
    .flatMap(response => {
      const scale = response.ratingScale ?? sample.ratingScale ?? 'likert-7';
      const normalizedScore = normalizeRating(response.wouldContinueScore, scale);
      const followCharacterScore =
        typeof response.wouldFollowCharacter === 'boolean'
          ? response.wouldFollowCharacter ? 100 : 0
          : undefined;
      const followRelationshipScore =
        typeof response.wouldFollowRelationship === 'boolean'
          ? response.wouldFollowRelationship ? 100 : 0
          : undefined;
      return [normalizedScore, followCharacterScore, followRelationshipScore];
    })
    .filter((score): score is number => score !== undefined);

  return scores.length === 0 ? undefined : average(scores);
}

interface FocusEvidenceEvaluation {
  status: CharacterRelationshipFocusEvidenceStatus;
  issues: string[];
  fieldCount: number;
}

function evaluateFocusEvidence(
  focus: CharacterRelationshipFocus | undefined
): FocusEvidenceEvaluation {
  if (!focus) {
    return {
      status: 'missing',
      issues: ['missing-focus'],
      fieldCount: 0,
    };
  }

  const issues: string[] = [];
  let fieldCount = 0;

  for (const field of REQUIRED_FOCUS_EVIDENCE_FIELDS) {
    if (hasMeaningfulText(focus[field])) {
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

function determineFailureTypes(input: {
  sample: CharacterRelationshipBenchmarkSample;
  readerPassed: boolean;
  automatedPassed?: boolean;
  readerInvestmentScore: number;
  readerEvidenceSufficient: boolean;
  focusEvidenceStatus: CharacterRelationshipFocusEvidenceStatus;
  weakDimensions: CharacterRelationshipDimension[];
  options: NormalizedOptions;
}): CharacterRelationshipFailureType[] {
  const failureTypes: CharacterRelationshipFailureType[] = [];
  const {
    sample,
    readerPassed,
    automatedPassed,
    readerInvestmentScore,
    readerEvidenceSufficient,
    focusEvidenceStatus,
    weakDimensions,
    options,
  } = input;

  if (automatedPassed === true && !readerPassed) {
    failureTypes.push('automated-false-positive');
  }
  if (automatedPassed === false && readerPassed) {
    failureTypes.push('automated-false-negative');
  }
  if (sample.expectedInvesting !== undefined && sample.expectedInvesting !== readerPassed) {
    failureTypes.push('reader-label-mismatch');
  }
  if (options.requireFocusEvidenceForGateTuning && focusEvidenceStatus !== 'usable') {
    failureTypes.push('weak-focus-evidence');
  }
  if (readerInvestmentScore < options.readerInvestmentThreshold) {
    failureTypes.push('weak-reader-investment');
  }
  if (weakDimensions.length > 0) {
    failureTypes.push('weak-dimension');
  }
  if (!readerEvidenceSufficient) {
    failureTypes.push('insufficient-reader-evidence');
  }

  return uniqueFailureTypes(failureTypes);
}

function buildSampleRecommendations(
  sample: CharacterRelationshipBenchmarkSample,
  failureTypes: CharacterRelationshipFailureType[],
  weakDimensions: CharacterRelationshipDimension[],
  readerInvestmentScore: number
): string[] {
  const recommendations: string[] = [];
  if (failureTypes.includes('automated-false-positive')) {
    recommendations.push(
      'Do not raise character/relationship drama thresholds from this sample until the scene is rewritten and retested with target readers.'
    );
  }
  if (failureTypes.includes('automated-false-negative')) {
    recommendations.push(
      'Inspect whether the automated drama evaluator is penalizing a reader-approved relationship trope, restraint, or genre convention.'
    );
  }
  if (failureTypes.includes('weak-reader-investment')) {
    recommendations.push(
      `Reader character/relationship investment is ${roundScore(readerInvestmentScore)}; strengthen agency, vulnerable cost, reciprocal pressure, and consequence before using this scene as a high-point model.`
    );
  }
  if (failureTypes.includes('weak-focus-evidence')) {
    recommendations.push(
      'Add actionable focus evidence: scene promise, character appeal moment, relationship turn, intended change, and consequence before using this sample for drama gate tuning.'
    );
  }
  if (weakDimensions.length > 0) {
    recommendations.push(
      `Retest weak character/relationship dimensions: ${weakDimensions.join(', ')}.`
    );
  }
  if (failureTypes.includes('insufficient-reader-evidence')) {
    recommendations.push(
      'Add more target-reader responses with care points, disbelief points, or rewrite suggestions before using this sample as calibration evidence.'
    );
  }
  if (sample.expectedInvesting !== undefined && failureTypes.includes('reader-label-mismatch')) {
    recommendations.push(
      'Review the human label for this drama sample or split it into clearer known-investing and known-flat variants.'
    );
  }
  return recommendations;
}

function buildRecommendations(
  result: CharacterRelationshipBenchmarkResult,
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
      'Tighten character/relationship checks for scenes that automated scoring accepts but target readers do not care about.'
    );
  }
  if (result.automatedFalseNegativeCount > 0) {
    recommendations.push(
      'Inspect reader-approved character or relationship scenes that automated scoring rejects before raising drama gate thresholds.'
    );
  }
  if (result.readerLabelMismatchCount > 0) {
    recommendations.push(
      'Audit drama sample labels whose observed reader investment contradicts the expected investing flag.'
    );
  }
  if (result.weakFocusEvidenceCount > 0) {
    recommendations.push(
      'Add focus evidence to character/relationship samples so reader investment can be traced to a scene promise, character appeal moment, relationship turn, intended change, and consequence.'
    );
  }
  if (result.weakDimensionCount > 0) {
    recommendations.push(
      'Revise samples with weak agency, signature behavior, vulnerability cost, attachment, tension, reciprocal pressure, subtext, consequence, or next-scene interest.'
    );
  }
  if (result.insufficientEvidenceCount > 0) {
    recommendations.push(
      'Collect more commented target-reader character/relationship responses before using this benchmark for gate tuning.'
    );
  }
  if (result.missingRequiredGenres.length > 0) {
    recommendations.push(
      `Add character/relationship benchmark samples for missing required genres: ${result.missingRequiredGenres.join(', ')}.`
    );
  }
  if (result.underSampledRequiredGenres.length > 0) {
    recommendations.push(
      `Add more character/relationship benchmark samples for under-sampled genres: ${result.underSampledRequiredGenres.join(', ')}.`
    );
  }
  if (result.missingRequiredPositiveGenres.length > 0) {
    recommendations.push(
      `Add known-investing drama samples for genres: ${result.missingRequiredPositiveGenres.join(', ')}.`
    );
  }
  if (result.missingRequiredNegativeGenres.length > 0) {
    recommendations.push(
      `Add known-flat drama samples for genres: ${result.missingRequiredNegativeGenres.join(', ')}.`
    );
  }
  if (result.missingRequiredTargetReaders.length > 0) {
    recommendations.push(
      `Add character/relationship benchmark samples for target readers: ${result.missingRequiredTargetReaders.join(', ')}.`
    );
  }
  if (result.underSampledRequiredTargetReaders.length > 0) {
    recommendations.push(
      `Add more character/relationship benchmark samples for under-sampled target readers: ${result.underSampledRequiredTargetReaders.join(', ')}.`
    );
  }
  if (result.missingRequiredPositiveTargetReaders.length > 0) {
    recommendations.push(
      `Add known-investing drama samples for target readers: ${result.missingRequiredPositiveTargetReaders.join(', ')}.`
    );
  }
  if (result.missingRequiredNegativeTargetReaders.length > 0) {
    recommendations.push(
      `Add known-flat drama samples for target readers: ${result.missingRequiredNegativeTargetReaders.join(', ')}.`
    );
  }
  if (result.missingRequiredRelationshipTypes.length > 0) {
    recommendations.push(
      `Add character/relationship benchmark samples for relationship types: ${result.missingRequiredRelationshipTypes.join(', ')}.`
    );
  }
  if (result.underSampledRequiredRelationshipTypes.length > 0) {
    recommendations.push(
      `Add more character/relationship benchmark samples for under-sampled relationship types: ${result.underSampledRequiredRelationshipTypes.join(', ')}.`
    );
  }
  if (result.missingRequiredPositiveRelationshipTypes.length > 0) {
    recommendations.push(
      `Add known-investing samples for relationship types: ${result.missingRequiredPositiveRelationshipTypes.join(', ')}.`
    );
  }
  if (result.missingRequiredNegativeRelationshipTypes.length > 0) {
    recommendations.push(
      `Add known-flat samples for relationship types: ${result.missingRequiredNegativeRelationshipTypes.join(', ')}.`
    );
  }
  if (result.underSampledHoldoutSamples) {
    recommendations.push(
      `Reserve at least ${options.minimumHoldoutSampleCount} character/relationship holdout sample(s) before tuning drama gates.`
    );
  }
  if (result.underSampledUsableHoldoutSamples) {
    recommendations.push(
      `Accumulate at least ${options.minimumUsableHoldoutSampleCount} evidence-sufficient character/relationship holdout sample(s) before using this benchmark for gate tuning.`
    );
  }
  if (result.underSampledFailingHoldoutSamples) {
    recommendations.push(
      `Reserve at least ${options.minimumFailingHoldoutSampleCount} known-flat character/relationship holdout sample(s) to catch weak-drama false positives.`
    );
  }
  if (result.underSampledUsableFailingHoldoutSamples) {
    recommendations.push(
      `Accumulate at least ${options.minimumUsableFailingHoldoutSampleCount} evidence-sufficient known-flat character/relationship holdout sample(s) before using this benchmark for gate tuning.`
    );
  }
  if (result.splitLeakageCount > 0) {
    recommendations.push(
      'Move duplicated character/relationship evidence out of holdout or calibration splits; the same drama focus cannot validate gate tuning independently.'
    );
  }
  if (result.splitCoverage.unassignedSamples > 0) {
    recommendations.push(
      'Set calibrationSplit/calibration_split on every character/relationship sample so tuning, validation, and holdout evidence cannot be mixed.'
    );
  }
  return recommendations;
}

function countSplitCoverage(
  sampleResults: CharacterRelationshipBenchmarkSampleResult[]
): CharacterRelationshipBenchmarkSplitCoverage {
  return sampleResults.reduce<CharacterRelationshipBenchmarkSplitCoverage>(
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
        if (isKnownFlatDramaSample(result)) {
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
  sampleResults: CharacterRelationshipBenchmarkSampleResult[]
): CharacterRelationshipBenchmarkSplitLeakage[] {
  const byFingerprint = new Map<string, CharacterRelationshipBenchmarkSampleResult[]>();

  for (const result of sampleResults) {
    if (!result.calibrationSplit) continue;
    const group = byFingerprint.get(result.evidenceFingerprint) ?? [];
    group.push(result);
    byFingerprint.set(result.evidenceFingerprint, group);
  }

  const leakages: CharacterRelationshipBenchmarkSplitLeakage[] = [];
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
  sampleResults: CharacterRelationshipBenchmarkSampleResult[]
): CharacterRelationshipCalibrationSplit[] {
  return Array.from(
    new Set(
      sampleResults
        .map(result => result.calibrationSplit)
        .filter((split): split is CharacterRelationshipCalibrationSplit => split !== undefined)
    )
  ).sort();
}

function isKnownFlatDramaSample(
  result: CharacterRelationshipBenchmarkSampleResult
): boolean {
  return !(result.expectedInvesting ?? result.readerPassed);
}

function isReadyForGateTuning(
  result: CharacterRelationshipBenchmarkResult
): boolean {
  return (
    result.insufficientEvidenceCount === 0 &&
    result.readerLabelMismatchCount === 0 &&
    result.weakFocusEvidenceCount === 0 &&
    result.missingRequiredGenres.length === 0 &&
    result.underSampledRequiredGenres.length === 0 &&
    result.missingRequiredPositiveGenres.length === 0 &&
    result.missingRequiredNegativeGenres.length === 0 &&
    result.missingRequiredTargetReaders.length === 0 &&
    result.underSampledRequiredTargetReaders.length === 0 &&
    result.missingRequiredPositiveTargetReaders.length === 0 &&
    result.missingRequiredNegativeTargetReaders.length === 0 &&
    result.missingRequiredRelationshipTypes.length === 0 &&
    result.underSampledRequiredRelationshipTypes.length === 0 &&
    result.missingRequiredPositiveRelationshipTypes.length === 0 &&
    result.missingRequiredNegativeRelationshipTypes.length === 0 &&
    !result.underSampledHoldoutSamples &&
    !result.underSampledUsableHoldoutSamples &&
    !result.underSampledFailingHoldoutSamples &&
    !result.underSampledUsableFailingHoldoutSamples &&
    result.splitLeakageCount === 0
  );
}

function countCoverage(
  sampleResults: CharacterRelationshipBenchmarkSampleResult[],
  keySelector: (sample: CharacterRelationshipBenchmarkSampleResult) => string | undefined
): Record<string, CharacterRelationshipBenchmarkCoverage> {
  return sampleResults.reduce<Record<string, CharacterRelationshipBenchmarkCoverage>>(
    (coverage, sample) => {
      const key = keySelector(sample);
      if (!key) return coverage;
      coverage[key] ??= { total: 0, positive: 0, negative: 0 };
      coverage[key].total += 1;
      if (sample.expectedInvesting ?? sample.readerPassed) {
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
  coverage: Record<string, CharacterRelationshipBenchmarkCoverage>
): string[] {
  return requiredKeys.filter(key => coverage[key] === undefined);
}

function underSampledRequiredKeys(
  requiredKeys: string[],
  coverage: Record<string, CharacterRelationshipBenchmarkCoverage>,
  minimumSamples: number
): string[] {
  if (minimumSamples <= 1) return [];
  return requiredKeys.filter(key => (coverage[key]?.total ?? 0) < minimumSamples);
}

function missingRequiredPolarity(
  requiredKeys: string[],
  coverage: Record<string, CharacterRelationshipBenchmarkCoverage>,
  polarity: 'positive' | 'negative'
): string[] {
  return requiredKeys.filter(key => (coverage[key]?.[polarity] ?? 0) === 0);
}

function countFailureType(
  sampleResults: CharacterRelationshipBenchmarkSampleResult[],
  failureType: CharacterRelationshipFailureType
): number {
  return sampleResults.filter(result => result.failureTypes.includes(failureType)).length;
}

function normalizeRating(
  value: number | undefined,
  scale: CharacterRelationshipRatingScale
): number | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  if (scale === 'percent-100') {
    return clamp(value, 0, 100);
  }
  return clamp(((value - 1) / 6) * 100, 0, 100);
}

function hasActionableComment(response: CharacterRelationshipReaderResponse): boolean {
  return (
    (response.comment?.trim().length ?? 0) >= 8 ||
    (response.rewriteSuggestion?.trim().length ?? 0) >= 8 ||
    (response.carePoints?.some(point => point.trim().length > 0) ?? false) ||
    (response.disbeliefPoints?.some(point => point.trim().length > 0) ?? false)
  );
}

function summarizeReaderEvidence(
  responses: CharacterRelationshipReaderResponse[]
): CharacterRelationshipBenchmarkReaderEvidence[] {
  return responses
    .map(response => ({
      readerId: normalizeEvidenceText(response.readerId),
      comment: normalizeEvidenceText(response.comment),
      carePoints: normalizeEvidenceList(response.carePoints),
      disbeliefPoints: normalizeEvidenceList(response.disbeliefPoints),
      rewriteSuggestion: normalizeEvidenceText(response.rewriteSuggestion),
    }))
    .filter(evidence =>
      evidence.readerId !== undefined ||
      evidence.comment !== undefined ||
      evidence.carePoints !== undefined ||
      evidence.disbeliefPoints !== undefined ||
      evidence.rewriteSuggestion !== undefined
    )
    .slice(0, 5);
}

function normalizeEvidenceText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function hasMeaningfulText(value: string | undefined): boolean {
  return (value?.trim().length ?? 0) >= 8;
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function normalizeEvidenceList(values: string[] | undefined): string[] | undefined {
  const normalized = uniqueStrings(values ?? []);
  return normalized.length > 0 ? normalized : undefined;
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

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(Boolean))];
}

function positiveIntegerOrDefault(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? value
    : fallback;
}

function uniqueFailureTypes(
  values: CharacterRelationshipFailureType[]
): CharacterRelationshipFailureType[] {
  return [...new Set(values)];
}

function fingerprintSampleEvidence(sample: CharacterRelationshipBenchmarkSample): string {
  const payload = stableJsonStringify({
    genre: sample.genre,
    targetReader: sample.targetReader,
    chapter: sample.chapter,
    focus: sample.focus,
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
