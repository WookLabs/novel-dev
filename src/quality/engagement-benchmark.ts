/**
 * Engagement Benchmark
 *
 * Runs labeled chapter/manuscript samples through the engagement contract
 * evaluator so calibration work can measure reader-facing false positives and
 * false negatives by genre and engagement route.
 *
 * @module quality/engagement-benchmark
 */

import {
  evaluateEngagementContract,
  type EngagementContractEvaluation,
  type EngagementContractInput,
  type EngagementIssueCode,
} from './engagement-contract.js';
import { createHash } from 'node:crypto';

export type EngagementBenchmarkRoute =
  | 'interest'
  | 'suspense'
  | 'beauty'
  | 'amusement'
  | 'genre-delight'
  | 'next-click';

export type EngagementPositiveQualityCode =
  | 'signature-scene-image'
  | 'character-appeal-signature'
  | 'protagonist-agency'
  | 'choice-cost-tradeoff'
  | 'choice-cost-lock'
  | 'tactical-adaptation'
  | 'payoff-delight'
  | 'genre-delight'
  | 'next-click-compulsion'
  | 'narrative-transportation'
  | 'dialogue-subtext-turn'
  | 'causal-chain';

export type EngagementBenchmarkFailureType =
  | 'false-positive'
  | 'false-negative'
  | 'missing-issue'
  | 'forbidden-issue'
  | 'positive-quality-conflict'
  | 'score-out-of-range';

export type EngagementBenchmarkCalibrationSplit =
  | 'calibration'
  | 'validation'
  | 'holdout';

const DEFAULT_MINIMUM_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_FAILING_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_FAILING_HOLDOUT_SAMPLE_COUNT = 1;

const POSITIVE_QUALITY_CONFLICT_ISSUES: Record<
  EngagementPositiveQualityCode,
  EngagementIssueCode[]
> = {
  'signature-scene-image': ['manuscript-signature-scene-image-not-evidenced'],
  'character-appeal-signature': [
    'manuscript-character-appeal-signature-not-evidenced',
  ],
  'protagonist-agency': [
    'manuscript-protagonist-agency-not-evidenced',
    'manuscript-convenient-resolution-not-evidenced',
  ],
  'choice-cost-tradeoff': ['manuscript-choice-tradeoff-not-evidenced'],
  'choice-cost-lock': ['manuscript-choice-cost-lock-not-evidenced'],
  'tactical-adaptation': ['manuscript-tactical-adaptation-not-evidenced'],
  'payoff-delight': ['manuscript-payoff-delight-not-evidenced'],
  'genre-delight': ['manuscript-genre-delight-not-evidenced'],
  'next-click-compulsion': [
    'manuscript-ending-hook-not-staged',
    'manuscript-ending-hook-closed',
    'manuscript-ending-hook-question-too-broad',
    'manuscript-ending-hook-reaction-not-evidenced',
    'manuscript-ending-hook-setup-not-evidenced',
  ],
  'narrative-transportation': [
    'manuscript-narrative-transportation-not-evidenced',
    'manuscript-stakes-subject-not-personalized',
    'manuscript-summary-prose',
    'manuscript-scene-density-not-evidenced',
  ],
  'dialogue-subtext-turn': [
    'manuscript-dialogue-subtext-not-evidenced',
    'manuscript-dialogue-turn-not-evidenced',
    'manuscript-dialogue-state-carryover-not-evidenced',
  ],
  'causal-chain': [
    'manuscript-causal-chain-not-evidenced',
    'manuscript-convenient-resolution-not-evidenced',
  ],
};

export interface EngagementBenchmarkSample {
  id: string;
  label?: string;
  genre?: string;
  routes?: EngagementBenchmarkRoute[];
  positiveQualityCodes?: EngagementPositiveQualityCode[];
  chapter?: number;
  manuscriptSource?: 'inline' | 'manuscript_path' | 'chapter';
  manuscriptPath?: string;
  chapterSourceGrounded?: boolean;
  calibrationSplit?: EngagementBenchmarkCalibrationSplit;
  input: EngagementContractInput;
  expectedPassed: boolean;
  expectedIssueCodes?: EngagementIssueCode[];
  forbiddenIssueCodes?: EngagementIssueCode[];
  expectedMinScore?: number;
  expectedMaxScore?: number;
}

export interface EngagementBenchmarkOptions {
  requiredGenres?: string[];
  requiredRoutes?: EngagementBenchmarkRoute[];
  requiredIssueCodes?: EngagementIssueCode[];
  requiredPositiveQualityCodes?: EngagementPositiveQualityCode[];
  minimumSamplesPerRequiredIssueCode?: number;
  minimumSamplesPerRequiredPositiveQualityCode?: number;
  minimumSeriesLength?: number;
  minimumPositiveSeriesLength?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  requireHoldoutForGateTuning?: boolean;
}

export interface EngagementBenchmarkSampleResult {
  id: string;
  label?: string;
  genre?: string;
  routes: EngagementBenchmarkRoute[];
  positiveQualityCodes: EngagementPositiveQualityCode[];
  chapter?: number;
  manuscriptSource?: 'inline' | 'manuscript_path' | 'chapter';
  manuscriptPath?: string;
  chapterSourceGrounded?: boolean;
  calibrationSplit?: EngagementBenchmarkCalibrationSplit;
  evidenceFingerprint: string;
  expectedPassed: boolean;
  actualPassed: boolean;
  score: number;
  issueCodes: EngagementIssueCode[];
  expectedIssueCodes: EngagementIssueCode[];
  missingExpectedIssueCodes: EngagementIssueCode[];
  forbiddenIssueCodesSeen: EngagementIssueCode[];
  positiveQualityConflictIssueCodes: EngagementIssueCode[];
  scoreExpectationPassed: boolean;
  passed: boolean;
  failureTypes: EngagementBenchmarkFailureType[];
  failureType?: EngagementBenchmarkFailureType;
  evaluation: EngagementContractEvaluation;
}

export interface EngagementBenchmarkSeriesCoverage {
  chapters: number[];
  longestConsecutiveRun: number;
  positiveChapters: number[];
  positiveLongestConsecutiveRun: number;
}

export interface EngagementBenchmarkSplitCoverage {
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

export interface EngagementBenchmarkSplitLeakage {
  fingerprint: string;
  sampleIds: string[];
  calibrationSplits: EngagementBenchmarkCalibrationSplit[];
}

export interface EngagementBenchmarkResult {
  total: number;
  passed: number;
  failed: number;
  accuracy: number;
  falsePositiveCount: number;
  falseNegativeCount: number;
  missingIssueCount: number;
  forbiddenIssueCount: number;
  positiveQualityConflictCount: number;
  scoreOutOfRangeCount: number;
  genreCoverage: Record<string, number>;
  genrePolarityCoverage: Record<string, { positive: number; negative: number }>;
  seriesCoverage: Record<string, EngagementBenchmarkSeriesCoverage>;
  routeCoverage: Record<EngagementBenchmarkRoute, number>;
  positiveQualityCoverage: Record<string, number>;
  usablePositiveQualityCoverage: Record<string, number>;
  issueCodeCoverage: Record<string, number>;
  usableIssueCodeCoverage: Record<string, number>;
  missingRequiredGenres: string[];
  missingRequiredPositiveGenres: string[];
  missingRequiredNegativeGenres: string[];
  missingRequiredSeriesGenres: string[];
  missingRequiredPositiveSeriesGenres: string[];
  missingRequiredRoutes: EngagementBenchmarkRoute[];
  missingRequiredPositiveQualityCodes: EngagementPositiveQualityCode[];
  underSampledRequiredPositiveQualityCodes: EngagementPositiveQualityCode[];
  underSampledUsableRequiredPositiveQualityCodes: EngagementPositiveQualityCode[];
  missingRequiredIssueCodes: EngagementIssueCode[];
  underSampledRequiredIssueCodes: EngagementIssueCode[];
  underSampledUsableRequiredIssueCodes: EngagementIssueCode[];
  splitCoverage: EngagementBenchmarkSplitCoverage;
  underSampledHoldoutSamples: boolean;
  underSampledUsableHoldoutSamples: boolean;
  underSampledFailingHoldoutSamples: boolean;
  underSampledUsableFailingHoldoutSamples: boolean;
  splitLeakageCount: number;
  splitLeakages: EngagementBenchmarkSplitLeakage[];
  readyForGateTuning: boolean;
  recommendations: string[];
  sampleResults: EngagementBenchmarkSampleResult[];
}

interface ResolvedEngagementBenchmarkOptions {
  requiredGenres: string[];
  requiredRoutes: EngagementBenchmarkRoute[];
  requiredIssueCodes: EngagementIssueCode[];
  requiredPositiveQualityCodes: EngagementPositiveQualityCode[];
  minimumSamplesPerRequiredIssueCode: number;
  minimumSamplesPerRequiredPositiveQualityCode: number;
  minimumSeriesLength: number;
  minimumPositiveSeriesLength: number;
  minimumHoldoutSampleCount: number;
  minimumUsableHoldoutSampleCount: number;
  minimumFailingHoldoutSampleCount: number;
  minimumUsableFailingHoldoutSampleCount: number;
  requireHoldoutForGateTuning: boolean;
}

export function evaluateEngagementBenchmark(
  samples: EngagementBenchmarkSample[],
  options: EngagementBenchmarkOptions = {}
): EngagementBenchmarkResult {
  const resolvedOptions = resolveBenchmarkOptions(options);
  const sampleResults = samples.map(evaluateBenchmarkSample);
  const passed = sampleResults.filter(result => result.passed).length;
  const genreCoverage = countGenreCoverage(samples);
  const genrePolarityCoverage = countGenrePolarityCoverage(samples);
  const seriesCoverage = countSeriesCoverage(samples);
  const routeCoverage = countRouteCoverage(samples);
  const positiveQualityCoverage = countPositiveQualityCoverage(sampleResults);
  const usablePositiveQualityCoverage = countUsablePositiveQualityCoverage(sampleResults);
  const issueCodeCoverage = countIssueCodeCoverage(sampleResults);
  const usableIssueCodeCoverage = countUsableIssueCodeCoverage(sampleResults);
  const splitCoverage = countSplitCoverage(sampleResults);
  const splitLeakages = detectSplitLeakages(sampleResults);
  const missingRequiredGenres = resolvedOptions.requiredGenres
    .filter(genre => genreCoverage[genre] === undefined);
  const missingRequiredPositiveGenres = resolvedOptions.requiredGenres
    .filter(genre => (genrePolarityCoverage[genre]?.positive ?? 0) === 0);
  const missingRequiredNegativeGenres = resolvedOptions.requiredGenres
    .filter(genre => (genrePolarityCoverage[genre]?.negative ?? 0) === 0);
  const missingRequiredSeriesGenres = resolvedOptions.minimumSeriesLength === 0
    ? []
    : resolvedOptions.requiredGenres.filter(
        genre => (seriesCoverage[genre]?.longestConsecutiveRun ?? 0) < resolvedOptions.minimumSeriesLength
      );
  const missingRequiredPositiveSeriesGenres = resolvedOptions.minimumPositiveSeriesLength === 0
    ? []
    : resolvedOptions.requiredGenres.filter(
        genre => (
          seriesCoverage[genre]?.positiveLongestConsecutiveRun ?? 0
        ) < resolvedOptions.minimumPositiveSeriesLength
      );
  const missingRequiredRoutes = resolvedOptions.requiredRoutes
    .filter(route => routeCoverage[route] === 0);
  const missingRequiredPositiveQualityCodes = resolvedOptions.requiredPositiveQualityCodes
    .filter(code => (positiveQualityCoverage[code] ?? 0) === 0);
  const underSampledRequiredPositiveQualityCodes = resolvedOptions.requiredPositiveQualityCodes
    .filter(code => {
      const count = positiveQualityCoverage[code] ?? 0;
      return count > 0 && count < resolvedOptions.minimumSamplesPerRequiredPositiveQualityCode;
    });
  const underSampledUsableRequiredPositiveQualityCodes = resolvedOptions.requiredPositiveQualityCodes
    .filter(code => {
      const count = positiveQualityCoverage[code] ?? 0;
      const usableCount = usablePositiveQualityCoverage[code] ?? 0;
      return count > 0 && usableCount < resolvedOptions.minimumSamplesPerRequiredPositiveQualityCode;
    });
  const missingRequiredIssueCodes = resolvedOptions.requiredIssueCodes
    .filter(code => (issueCodeCoverage[code] ?? 0) === 0);
  const underSampledRequiredIssueCodes = resolvedOptions.requiredIssueCodes
    .filter(code => {
      const count = issueCodeCoverage[code] ?? 0;
      return count > 0 && count < resolvedOptions.minimumSamplesPerRequiredIssueCode;
    });
  const underSampledUsableRequiredIssueCodes = resolvedOptions.requiredIssueCodes
    .filter(code => {
      const count = issueCodeCoverage[code] ?? 0;
      const usableCount = usableIssueCodeCoverage[code] ?? 0;
      return count > 0 && usableCount < resolvedOptions.minimumSamplesPerRequiredIssueCode;
    });
  const underSampledHoldoutSamples = resolvedOptions.requireHoldoutForGateTuning
    && splitCoverage.holdoutSamples < resolvedOptions.minimumHoldoutSampleCount;
  const underSampledUsableHoldoutSamples = resolvedOptions.requireHoldoutForGateTuning
    && splitCoverage.usableHoldoutSamples < resolvedOptions.minimumUsableHoldoutSampleCount;
  const underSampledFailingHoldoutSamples = resolvedOptions.requireHoldoutForGateTuning
    && splitCoverage.failingHoldoutSamples < resolvedOptions.minimumFailingHoldoutSampleCount;
  const underSampledUsableFailingHoldoutSamples = resolvedOptions.requireHoldoutForGateTuning
    && splitCoverage.usableFailingHoldoutSamples < resolvedOptions.minimumUsableFailingHoldoutSampleCount;
  const failed = sampleResults.length - passed;

  const result: EngagementBenchmarkResult = {
    total: sampleResults.length,
    passed,
    failed,
    accuracy: sampleResults.length === 0 ? 1 : passed / sampleResults.length,
    falsePositiveCount: countFailureType(sampleResults, 'false-positive'),
    falseNegativeCount: countFailureType(sampleResults, 'false-negative'),
    missingIssueCount: countFailureType(sampleResults, 'missing-issue'),
    forbiddenIssueCount: countFailureType(sampleResults, 'forbidden-issue'),
    positiveQualityConflictCount: countFailureType(sampleResults, 'positive-quality-conflict'),
    scoreOutOfRangeCount: countFailureType(sampleResults, 'score-out-of-range'),
    genreCoverage,
    genrePolarityCoverage,
    seriesCoverage,
    routeCoverage,
    positiveQualityCoverage,
    usablePositiveQualityCoverage,
    issueCodeCoverage,
    usableIssueCodeCoverage,
    missingRequiredGenres,
    missingRequiredPositiveGenres,
    missingRequiredNegativeGenres,
    missingRequiredSeriesGenres,
    missingRequiredPositiveSeriesGenres,
    missingRequiredRoutes,
    missingRequiredPositiveQualityCodes,
    underSampledRequiredPositiveQualityCodes,
    underSampledUsableRequiredPositiveQualityCodes,
    missingRequiredIssueCodes,
    underSampledRequiredIssueCodes,
    underSampledUsableRequiredIssueCodes,
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
  result.recommendations = buildRecommendations(result, resolvedOptions);
  return result;
}

function evaluateBenchmarkSample(
  sample: EngagementBenchmarkSample
): EngagementBenchmarkSampleResult {
  const evaluation = evaluateEngagementContract(sample.input);
  const issueCodes = evaluation.issues.map(issue => issue.code);
  const missingExpectedIssueCodes = (sample.expectedIssueCodes ?? [])
    .filter(code => !issueCodes.includes(code));
  const forbiddenIssueCodesSeen = (sample.forbiddenIssueCodes ?? [])
    .filter(code => issueCodes.includes(code));
  const positiveQualityConflictIssueCodes = sample.expectedPassed
    ? findPositiveQualityConflictIssueCodes(sample.positiveQualityCodes ?? [], issueCodes)
    : [];
  const scoreExpectationPassed = scoreWithinExpectedRange(
    evaluation.score,
    sample.expectedMinScore,
    sample.expectedMaxScore
  );
  const failureTypes = determineFailureTypes(
    sample,
    evaluation,
    missingExpectedIssueCodes,
    forbiddenIssueCodesSeen,
    positiveQualityConflictIssueCodes,
    scoreExpectationPassed
  );

  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre,
    routes: sample.routes ?? [],
    positiveQualityCodes: sample.positiveQualityCodes ?? [],
    chapter: sample.chapter,
    manuscriptSource: sample.manuscriptSource,
    manuscriptPath: sample.manuscriptPath,
    chapterSourceGrounded: sample.chapterSourceGrounded,
    calibrationSplit: sample.calibrationSplit,
    evidenceFingerprint: fingerprintSampleEvidence(sample),
    expectedPassed: sample.expectedPassed,
    actualPassed: evaluation.passed,
    score: evaluation.score,
    issueCodes,
    expectedIssueCodes: sample.expectedIssueCodes ?? [],
    missingExpectedIssueCodes,
    forbiddenIssueCodesSeen,
    positiveQualityConflictIssueCodes,
    scoreExpectationPassed,
    passed: failureTypes.length === 0,
    failureTypes,
    failureType: failureTypes[0],
    evaluation,
  };
}

function determineFailureTypes(
  sample: EngagementBenchmarkSample,
  evaluation: EngagementContractEvaluation,
  missingExpectedIssueCodes: EngagementIssueCode[],
  forbiddenIssueCodesSeen: EngagementIssueCode[],
  positiveQualityConflictIssueCodes: EngagementIssueCode[],
  scoreExpectationPassed: boolean
): EngagementBenchmarkFailureType[] {
  const failureTypes: EngagementBenchmarkFailureType[] = [];

  if (evaluation.passed !== sample.expectedPassed) {
    failureTypes.push(evaluation.passed ? 'false-positive' : 'false-negative');
  }

  if (missingExpectedIssueCodes.length > 0) {
    failureTypes.push('missing-issue');
  }

  if (forbiddenIssueCodesSeen.length > 0) {
    failureTypes.push('forbidden-issue');
  }

  if (positiveQualityConflictIssueCodes.length > 0) {
    failureTypes.push('positive-quality-conflict');
  }

  if (!scoreExpectationPassed) {
    failureTypes.push('score-out-of-range');
  }

  return failureTypes;
}

function findPositiveQualityConflictIssueCodes(
  positiveQualityCodes: EngagementPositiveQualityCode[],
  issueCodes: EngagementIssueCode[]
): EngagementIssueCode[] {
  const issueSet = new Set(issueCodes);
  const conflicts = new Set<EngagementIssueCode>();

  for (const qualityCode of positiveQualityCodes) {
    for (const issueCode of POSITIVE_QUALITY_CONFLICT_ISSUES[qualityCode] ?? []) {
      if (issueSet.has(issueCode)) {
        conflicts.add(issueCode);
      }
    }
  }

  return [...conflicts];
}

function scoreWithinExpectedRange(
  score: number,
  expectedMinScore?: number,
  expectedMaxScore?: number
): boolean {
  if (expectedMinScore !== undefined && score < expectedMinScore) return false;
  if (expectedMaxScore !== undefined && score > expectedMaxScore) return false;
  return true;
}

function countFailureType(
  sampleResults: EngagementBenchmarkSampleResult[],
  failureType: EngagementBenchmarkFailureType
): number {
  return sampleResults
    .filter(result => result.failureTypes.includes(failureType))
    .length;
}

function countGenreCoverage(
  samples: EngagementBenchmarkSample[]
): Record<string, number> {
  return samples.reduce<Record<string, number>>((coverage, sample) => {
    if (!sample.genre) return coverage;
    coverage[sample.genre] = (coverage[sample.genre] ?? 0) + 1;
    return coverage;
  }, {});
}

function countGenrePolarityCoverage(
  samples: EngagementBenchmarkSample[]
): Record<string, { positive: number; negative: number }> {
  return samples.reduce<Record<string, { positive: number; negative: number }>>(
    (coverage, sample) => {
      if (!sample.genre) return coverage;

      coverage[sample.genre] ??= { positive: 0, negative: 0 };

      if (sample.expectedPassed) {
        coverage[sample.genre].positive += 1;
      } else {
        coverage[sample.genre].negative += 1;
      }

      return coverage;
    },
    {}
  );
}

function countSeriesCoverage(
  samples: EngagementBenchmarkSample[]
): Record<string, EngagementBenchmarkSeriesCoverage> {
  const chaptersByGenre = new Map<string, Set<number>>();
  const positiveChaptersByGenre = new Map<string, Set<number>>();

  for (const sample of samples) {
    if (!sample.genre || !Number.isInteger(sample.chapter) || (sample.chapter ?? 0) < 1) {
      continue;
    }

    addChapter(chaptersByGenre, sample.genre, sample.chapter);

    if (sample.expectedPassed) {
      addChapter(positiveChaptersByGenre, sample.genre, sample.chapter);
    }
  }

  const genres = new Set([
    ...chaptersByGenre.keys(),
    ...positiveChaptersByGenre.keys(),
  ]);
  const coverage: Record<string, EngagementBenchmarkSeriesCoverage> = {};

  for (const genre of genres) {
    const chapters = sortedChapters(chaptersByGenre.get(genre));
    const positiveChapters = sortedChapters(positiveChaptersByGenre.get(genre));
    coverage[genre] = {
      chapters,
      longestConsecutiveRun: longestConsecutiveRun(chapters),
      positiveChapters,
      positiveLongestConsecutiveRun: longestConsecutiveRun(positiveChapters),
    };
  }

  return coverage;
}

function addChapter(
  map: Map<string, Set<number>>,
  genre: string,
  chapter: number | undefined
): void {
  if (!Number.isInteger(chapter) || (chapter ?? 0) < 1) return;
  const chapters = map.get(genre) ?? new Set<number>();
  chapters.add(chapter as number);
  map.set(genre, chapters);
}

function sortedChapters(chapters: Set<number> | undefined): number[] {
  return [...(chapters ?? [])].sort((a, b) => a - b);
}

function longestConsecutiveRun(chapters: number[]): number {
  let longest = 0;
  let current = 0;
  let previous: number | undefined;

  for (const chapter of chapters) {
    current = previous !== undefined && chapter === previous + 1
      ? current + 1
      : 1;
    longest = Math.max(longest, current);
    previous = chapter;
  }

  return longest;
}

function countRouteCoverage(
  samples: EngagementBenchmarkSample[]
): Record<EngagementBenchmarkRoute, number> {
  const coverage: Record<EngagementBenchmarkRoute, number> = {
    interest: 0,
    suspense: 0,
    beauty: 0,
    amusement: 0,
    'genre-delight': 0,
    'next-click': 0,
  };

  for (const sample of samples) {
    for (const route of sample.routes ?? []) {
      coverage[route] += 1;
    }
  }

  return coverage;
}

function countIssueCodeCoverage(
  sampleResults: EngagementBenchmarkSampleResult[]
): Record<string, number> {
  return sampleResults.reduce<Record<string, number>>((coverage, result) => {
    for (const code of expectedIssueCodesForResult(result)) {
      coverage[code] = (coverage[code] ?? 0) + 1;
    }

    return coverage;
  }, {});
}

function countPositiveQualityCoverage(
  sampleResults: EngagementBenchmarkSampleResult[]
): Record<string, number> {
  return sampleResults.reduce<Record<string, number>>((coverage, result) => {
    if (!result.expectedPassed) return coverage;

    for (const code of positiveQualityCodesForResult(result)) {
      coverage[code] = (coverage[code] ?? 0) + 1;
    }

    return coverage;
  }, {});
}

function countUsablePositiveQualityCoverage(
  sampleResults: EngagementBenchmarkSampleResult[]
): Record<string, number> {
  return sampleResults.reduce<Record<string, number>>((coverage, result) => {
    if (!result.expectedPassed || !result.passed) return coverage;

    for (const code of positiveQualityCodesForResult(result)) {
      coverage[code] = (coverage[code] ?? 0) + 1;
    }

    return coverage;
  }, {});
}

function positiveQualityCodesForResult(
  result: EngagementBenchmarkSampleResult
): EngagementPositiveQualityCode[] {
  return [...new Set(result.positiveQualityCodes)];
}

function countUsableIssueCodeCoverage(
  sampleResults: EngagementBenchmarkSampleResult[]
): Record<string, number> {
  return sampleResults.reduce<Record<string, number>>((coverage, result) => {
    if (!result.passed) return coverage;

    for (const code of expectedIssueCodesForResult(result)) {
      coverage[code] = (coverage[code] ?? 0) + 1;
    }

    return coverage;
  }, {});
}

function expectedIssueCodesForResult(
  result: EngagementBenchmarkSampleResult
): EngagementIssueCode[] {
  return [...new Set(result.expectedIssueCodes)];
}

function countSplitCoverage(
  sampleResults: EngagementBenchmarkSampleResult[]
): EngagementBenchmarkSplitCoverage {
  return sampleResults.reduce<EngagementBenchmarkSplitCoverage>(
    (coverage, result) => {
      if (result.calibrationSplit === 'calibration') {
        coverage.calibrationSamples += 1;
        if (result.passed) coverage.usableCalibrationSamples += 1;
      } else if (result.calibrationSplit === 'validation') {
        coverage.validationSamples += 1;
        if (result.passed) coverage.usableValidationSamples += 1;
      } else if (result.calibrationSplit === 'holdout') {
        coverage.holdoutSamples += 1;
        if (result.passed) coverage.usableHoldoutSamples += 1;
        if (!result.expectedPassed) {
          coverage.failingHoldoutSamples += 1;
          if (result.passed) coverage.usableFailingHoldoutSamples += 1;
        }
      } else {
        coverage.unassignedSamples += 1;
        if (result.passed) coverage.usableUnassignedSamples += 1;
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
  sampleResults: EngagementBenchmarkSampleResult[]
): EngagementBenchmarkSplitLeakage[] {
  const byFingerprint = new Map<string, EngagementBenchmarkSampleResult[]>();
  for (const result of sampleResults) {
    if (!result.calibrationSplit) continue;
    const group = byFingerprint.get(result.evidenceFingerprint) ?? [];
    group.push(result);
    byFingerprint.set(result.evidenceFingerprint, group);
  }

  const leakages: EngagementBenchmarkSplitLeakage[] = [];
  for (const [fingerprint, results] of byFingerprint) {
    const splits = uniqueSplits(results);
    if (splits.length < 2) continue;
    leakages.push({
      fingerprint,
      sampleIds: results.map(result => result.id),
      calibrationSplits: splits,
    });
  }

  return leakages;
}

function uniqueSplits(
  sampleResults: EngagementBenchmarkSampleResult[]
): EngagementBenchmarkCalibrationSplit[] {
  return [...new Set(
    sampleResults
      .map(result => result.calibrationSplit)
      .filter((split): split is EngagementBenchmarkCalibrationSplit => split !== undefined)
  )].sort();
}

function fingerprintSampleEvidence(sample: EngagementBenchmarkSample): string {
  const manuscript = normalizeFingerprintText(sample.input.manuscript);
  const chapter = stableJsonStringify(sample.input.chapter ?? null);
  const plot = stableJsonStringify(sample.input.plot ?? null);
  const design = stableJsonStringify(sample.input.design ?? null);
  return `sha256:${createHash('sha256')
    .update([manuscript, chapter, plot, design].join('\n---\n'))
    .digest('hex')}`;
}

function normalizeFingerprintText(value: unknown): string {
  return typeof value === 'string'
    ? value.replace(/\s+/g, ' ').trim()
    : '';
}

function stableJsonStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableJsonStringify).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableJsonStringify(entry)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function isReadyForGateTuning(result: EngagementBenchmarkResult): boolean {
  return result.failed === 0
    && result.missingRequiredGenres.length === 0
    && result.missingRequiredPositiveGenres.length === 0
    && result.missingRequiredNegativeGenres.length === 0
    && result.missingRequiredSeriesGenres.length === 0
    && result.missingRequiredPositiveSeriesGenres.length === 0
    && result.missingRequiredRoutes.length === 0
    && result.missingRequiredPositiveQualityCodes.length === 0
    && result.underSampledRequiredPositiveQualityCodes.length === 0
    && result.underSampledUsableRequiredPositiveQualityCodes.length === 0
    && result.missingRequiredIssueCodes.length === 0
    && result.underSampledRequiredIssueCodes.length === 0
    && result.underSampledUsableRequiredIssueCodes.length === 0
    && !result.underSampledHoldoutSamples
    && !result.underSampledUsableHoldoutSamples
    && !result.underSampledFailingHoldoutSamples
    && !result.underSampledUsableFailingHoldoutSamples
    && result.splitLeakageCount === 0;
}

function resolveBenchmarkOptions(
  options: EngagementBenchmarkOptions
): ResolvedEngagementBenchmarkOptions {
  return {
    requiredGenres: options.requiredGenres ?? [],
    requiredRoutes: options.requiredRoutes ?? [],
    requiredIssueCodes: options.requiredIssueCodes ?? [],
    requiredPositiveQualityCodes: options.requiredPositiveQualityCodes ?? [],
    minimumSamplesPerRequiredIssueCode: positiveIntegerOrDefault(
      options.minimumSamplesPerRequiredIssueCode,
      1
    ),
    minimumSamplesPerRequiredPositiveQualityCode: positiveIntegerOrDefault(
      options.minimumSamplesPerRequiredPositiveQualityCode,
      1
    ),
    minimumSeriesLength: Math.max(0, options.minimumSeriesLength ?? 0),
    minimumPositiveSeriesLength: Math.max(0, options.minimumPositiveSeriesLength ?? 0),
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

function positiveIntegerOrDefault(
  value: number | undefined,
  fallback: number
): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? value
    : fallback;
}

function buildRecommendations(
  result: EngagementBenchmarkResult,
  options: ResolvedEngagementBenchmarkOptions
): string[] {
  const recommendations: string[] = [];

  if (result.falsePositiveCount > 0) {
    recommendations.push(
      'Tighten engagement contract checks for bad samples that still pass; prioritize manuscript evidence and unresolved next-click hooks.'
    );
  }

  if (result.falseNegativeCount > 0) {
    recommendations.push(
      'Inspect good samples that fail and tune genre-specific thresholds or forbidden issue expectations before raising completion gates.'
    );
  }

  if (result.missingIssueCount > 0) {
    recommendations.push(
      'Add or retune issue detectors for expected engagement failures that are not being surfaced.'
    );
  }

  if (result.forbiddenIssueCount > 0) {
    recommendations.push(
      'Reduce over-triggered issue detectors that flag known-good samples with forbidden issue codes.'
    );
  }

  if (result.positiveQualityConflictCount > 0) {
    recommendations.push(
      'Fix mislabeled high-point samples whose positive quality labels conflict with detected manuscript issues before trusting positive coverage.'
    );
  }

  if (result.scoreOutOfRangeCount > 0) {
    recommendations.push(
      'Recalibrate score bands so sample scores match the benchmarked pass/fail severity.'
    );
  }

  if (result.missingRequiredGenres.length > 0) {
    recommendations.push(
      `Add benchmark samples for missing required genres: ${result.missingRequiredGenres.join(', ')}.`
    );
  }

  if (result.missingRequiredPositiveGenres.length > 0) {
    recommendations.push(
      `Add known-good benchmark samples for required genres: ${result.missingRequiredPositiveGenres.join(', ')}.`
    );
  }

  if (result.missingRequiredNegativeGenres.length > 0) {
    recommendations.push(
      `Add known-bad benchmark samples for required genres: ${result.missingRequiredNegativeGenres.join(', ')}.`
    );
  }

  if (result.missingRequiredSeriesGenres.length > 0) {
    recommendations.push(
      `Add consecutive chapter benchmark samples for required genres: ${result.missingRequiredSeriesGenres.join(', ')}.`
    );
  }

  if (result.missingRequiredPositiveSeriesGenres.length > 0) {
    recommendations.push(
      `Add known-good consecutive chapter benchmark samples for required genres: ${result.missingRequiredPositiveSeriesGenres.join(', ')}.`
    );
  }

  if (result.missingRequiredRoutes.length > 0) {
    recommendations.push(
      `Add benchmark samples for missing engagement routes: ${result.missingRequiredRoutes.join(', ')}.`
    );
  }

  if (result.missingRequiredPositiveQualityCodes.length > 0) {
    recommendations.push(
      `Add known-good benchmark samples for missing positive high-point quality codes: ${result.missingRequiredPositiveQualityCodes.join(', ')}.`
    );
  }

  if (result.underSampledRequiredPositiveQualityCodes.length > 0) {
    recommendations.push(
      `Add more known-good samples for positive high-point quality codes: ${result.underSampledRequiredPositiveQualityCodes.join(', ')}.`
    );
  }

  if (result.underSampledUsableRequiredPositiveQualityCodes.length > 0) {
    recommendations.push(
      `Fix or replace known-good samples whose positive high-point quality codes are not passing reliably: ${result.underSampledUsableRequiredPositiveQualityCodes.join(', ')}.`
    );
  }

  if (result.missingRequiredIssueCodes.length > 0) {
    recommendations.push(
      `Add known-bad benchmark samples for missing expected engagement issue codes: ${result.missingRequiredIssueCodes.join(', ')}.`
    );
  }

  if (result.underSampledRequiredIssueCodes.length > 0) {
    recommendations.push(
      `Add more labeled samples for required engagement issue codes: ${result.underSampledRequiredIssueCodes.join(', ')}.`
    );
  }

  if (result.underSampledUsableRequiredIssueCodes.length > 0) {
    recommendations.push(
      `Fix or replace samples whose expected engagement issue codes are not being detected reliably: ${result.underSampledUsableRequiredIssueCodes.join(', ')}.`
    );
  }

  if (result.underSampledHoldoutSamples) {
    recommendations.push(
      `Reserve at least ${options.minimumHoldoutSampleCount} engagement benchmark holdout sample(s) before tuning completion gates.`
    );
  }

  if (result.underSampledUsableHoldoutSamples) {
    recommendations.push(
      `Accumulate at least ${options.minimumUsableHoldoutSampleCount} passing holdout sample(s) so engagement gate tuning is measured on untouched evidence.`
    );
  }

  if (result.underSampledFailingHoldoutSamples) {
    recommendations.push(
      `Reserve at least ${options.minimumFailingHoldoutSampleCount} known-bad holdout sample(s) to catch fun false positives.`
    );
  }

  if (result.underSampledUsableFailingHoldoutSamples) {
    recommendations.push(
      `Accumulate at least ${options.minimumUsableFailingHoldoutSampleCount} usable known-bad holdout sample(s) before using the benchmark for gate tuning.`
    );
  }

  if (result.splitLeakageCount > 0) {
    recommendations.push(
      'Move duplicated engagement evidence out of holdout or calibration splits; the same manuscript/chapter input cannot validate gate tuning independently.'
    );
  }

  if (result.splitCoverage.unassignedSamples > 0) {
    recommendations.push(
      'Set calibrationSplit/calibration_split on every engagement benchmark sample so tuning, validation, and holdout evidence cannot be mixed.'
    );
  }

  return recommendations;
}
