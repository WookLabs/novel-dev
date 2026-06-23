/**
 * Prose Taste Benchmark
 *
 * Runs labeled good/bad prose samples through the prose taste gate so future
 * calibration work can measure false positives and false negatives explicitly.
 *
 * @module quality/prose-taste-benchmark
 */

import { createHash } from 'node:crypto';
import {
  evaluateProseTaste,
  type ProseTasteGateResult,
  type ProseTasteGateOptions,
  type ProseTasteIssueCode,
  type ProseTasteMetrics,
  type ProseTasteProfile,
} from './prose-taste-gate.js';

export type ProseTasteReaderSegmentRepresentativeness = 'unknown' | 'balanced' | 'narrow';
export type ProseTasteCalibrationSplit = 'calibration' | 'validation' | 'holdout';
export type ProseTasteFrictionAnnotationCoverage = 'not-required' | 'none' | 'partial' | 'covered';
export type ProseTasteFrictionSeverity = 'low' | 'medium' | 'high';
export type ProseTasteStyleHighlightAnnotationCoverage = 'not-required' | 'none' | 'partial' | 'covered';
export type ProseTasteStyleHighlightQuality =
  | 'clarity'
  | 'rhythm'
  | 'sensory-grounding'
  | 'voice'
  | 'emotional-precision'
  | 'subtext'
  | 'image'
  | 'sentence-flow'
  | 'narrative-momentum';
export type ProseTasteStyleFingerprintStatus = 'not-enough-samples' | 'weak' | 'separated';
export type ProseTasteStyleFingerprintDirection = 'preferred-higher' | 'disliked-higher';
export type ProseTasteBenchmarkContentSource = 'inline' | 'content_path' | 'chapter';
export type ProseTasteAuthorialStyleDriftStatus = 'not-enough-samples' | 'stable' | 'drifted';

export interface ProseTasteBenchmarkOptions extends ProseTasteGateOptions {
  requiredReaderSegments?: string[];
  minimumReaderSegmentCount?: number;
  minimumSamplesPerReaderSegment?: number;
  minimumFailingSamplesPerReaderSegment?: number;
  maximumDominantReaderSegmentRatio?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  requireHoldoutForStyleTuning?: boolean;
  minimumFrictionAnnotationCount?: number;
  minimumActionableFrictionAnnotationCount?: number;
  requireFrictionAnnotationsForStyleTuning?: boolean;
  minimumStyleHighlightAnnotationCount?: number;
  minimumActionableStyleHighlightAnnotationCount?: number;
  requireStyleHighlightAnnotationsForStyleTuning?: boolean;
  minimumStyleHighlightQualityCount?: number;
  requireStyleHighlightQualityDiversity?: boolean;
  minimumStyleFingerprintSamplesPerPolarity?: number;
  minimumStyleFingerprintDistance?: number;
  minimumStyleFingerprintSignalCount?: number;
  requireStyleFingerprintSeparation?: boolean;
  minimumAuthorialStyleContinuitySamples?: number;
  maximumAuthorialStyleDrift?: number;
  requireAuthorialStyleContinuity?: boolean;
}

export interface ProseTasteFrictionAnnotation {
  location?: string;
  reason?: string;
  issueCode?: ProseTasteIssueCode;
  severity?: ProseTasteFrictionSeverity;
  readerCount?: number;
  readerSegment?: string;
  rewriteSuggestion?: string;
  targetText?: string;
}

export interface ProseTasteStyleHighlightAnnotation {
  location?: string;
  reason?: string;
  quality?: ProseTasteStyleHighlightQuality;
  readerCount?: number;
  readerSegment?: string;
  targetText?: string;
  transferGuidance?: string;
}

export interface ProseTasteBenchmarkSample {
  id: string;
  label?: string;
  readerSegment?: string;
  calibrationSplit?: ProseTasteCalibrationSplit;
  chapter?: number;
  version?: number;
  contentSource?: ProseTasteBenchmarkContentSource;
  contentPath?: string;
  chapterSourceGrounded?: boolean;
  content: string;
  expectedPassed: boolean;
  profile?: ProseTasteProfile;
  threshold?: number;
  expectedIssueCodes?: ProseTasteIssueCode[];
  expectedMinScore?: number;
  expectedMaxScore?: number;
  styleFrictionAnnotations?: ProseTasteFrictionAnnotation[];
  styleHighlightAnnotations?: ProseTasteStyleHighlightAnnotation[];
}

export interface ProseTasteBenchmarkSampleResult {
  id: string;
  label?: string;
  readerSegment?: string;
  calibrationSplit?: ProseTasteCalibrationSplit;
  chapter?: number;
  version?: number;
  contentSource?: ProseTasteBenchmarkContentSource;
  contentPath?: string;
  chapterSourceGrounded?: boolean;
  evidenceFingerprint: string;
  expectedPassed: boolean;
  actualPassed: boolean;
  score: number;
  issueCodes: ProseTasteIssueCode[];
  missingExpectedIssueCodes: ProseTasteIssueCode[];
  scoreExpectationPassed: boolean;
  passed: boolean;
  styleTuningUsable: boolean;
  failureType?: 'false-positive' | 'false-negative' | 'missing-issue' | 'score-out-of-range';
  gate: ProseTasteGateResult;
  styleFrictionAnnotations: ProseTasteFrictionAnnotation[];
  styleFrictionAnnotationCount: number;
  actionableStyleFrictionAnnotationCount: number;
  styleFrictionAnnotationIssueCodes: ProseTasteIssueCode[];
  styleFrictionAnnotationCoverage: ProseTasteFrictionAnnotationCoverage;
  styleFrictionAnnotationIssues: string[];
  styleHighlightAnnotations: ProseTasteStyleHighlightAnnotation[];
  styleHighlightAnnotationCount: number;
  actionableStyleHighlightAnnotationCount: number;
  styleHighlightAnnotationQualities: ProseTasteStyleHighlightQuality[];
  styleHighlightAnnotationCoverage: ProseTasteStyleHighlightAnnotationCoverage;
  styleHighlightAnnotationIssues: string[];
}

export interface ProseTasteStyleFingerprintSignal {
  metric: keyof ProseTasteMetrics;
  preferredAverage: number;
  dislikedAverage: number;
  delta: number;
  strength: number;
  direction: ProseTasteStyleFingerprintDirection;
}

export interface ProseTasteStyleFingerprint {
  status: ProseTasteStyleFingerprintStatus;
  preferredSampleCount: number;
  dislikedSampleCount: number;
  distance: number;
  signalCount: number;
  signals: ProseTasteStyleFingerprintSignal[];
}

export interface ProseTasteAuthorialStyleDriftPair {
  fromSampleId: string;
  toSampleId: string;
  fromChapter?: number;
  toChapter?: number;
  distance: number;
  strongestMetric?: keyof ProseTasteMetrics;
  strongestMetricDelta?: number;
}

export interface ProseTasteAuthorialStyleDrift {
  status: ProseTasteAuthorialStyleDriftStatus;
  continuitySampleCount: number;
  pairCount: number;
  maxDistance: number;
  averageDistance: number;
  driftPairs: ProseTasteAuthorialStyleDriftPair[];
}

export interface ProseTasteSplitCoverage {
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

export interface ProseTasteBenchmarkSplitLeakage {
  fingerprint: string;
  sampleIds: string[];
  calibrationSplits: ProseTasteCalibrationSplit[];
}

export interface ProseTasteBenchmarkResult {
  total: number;
  passed: number;
  failed: number;
  accuracy: number;
  falsePositiveCount: number;
  falseNegativeCount: number;
  missingIssueCount: number;
  scoreOutOfRangeCount: number;
  missingStyleFrictionAnnotationCount: number;
  weakStyleFrictionAnnotationCount: number;
  styleFrictionAnnotationCount: number;
  actionableStyleFrictionAnnotationCount: number;
  missingStyleHighlightAnnotationCount: number;
  weakStyleHighlightAnnotationCount: number;
  styleHighlightAnnotationCount: number;
  actionableStyleHighlightAnnotationCount: number;
  styleHighlightQualityCount: number;
  styleHighlightQualities: ProseTasteStyleHighlightQuality[];
  weakStyleHighlightQualityDiversityCount: number;
  weakStyleFingerprintCount: number;
  styleFingerprintStatus: ProseTasteStyleFingerprintStatus;
  styleFingerprintDistance: number;
  styleFingerprintSignalCount: number;
  styleFingerprint: ProseTasteStyleFingerprint;
  weakAuthorialStyleDriftCount: number;
  authorialStyleDriftStatus: ProseTasteAuthorialStyleDriftStatus;
  authorialStyleDriftMaxDistance: number;
  authorialStyleDriftPairCount: number;
  authorialStyleDrift: ProseTasteAuthorialStyleDrift;
  readerSegments: string[];
  missingRequiredReaderSegments: string[];
  underSampledReaderSegments: string[];
  underSampledFailingReaderSegments: string[];
  dominantReaderSegmentRatio?: number;
  readerSegmentRepresentativeness: ProseTasteReaderSegmentRepresentativeness;
  splitCoverage: ProseTasteSplitCoverage;
  underSampledHoldoutSamples: boolean;
  underSampledUsableHoldoutSamples: boolean;
  underSampledFailingHoldoutSamples: boolean;
  underSampledUsableFailingHoldoutSamples: boolean;
  splitLeakageCount: number;
  splitLeakages: ProseTasteBenchmarkSplitLeakage[];
  readyForStyleTuning: boolean;
  recommendations: string[];
  sampleResults: ProseTasteBenchmarkSampleResult[];
}

const DEFAULT_MINIMUM_READER_SEGMENT_COUNT = 2;
const DEFAULT_MINIMUM_SAMPLES_PER_READER_SEGMENT = 1;
const DEFAULT_MINIMUM_FAILING_SAMPLES_PER_READER_SEGMENT = 1;
const DEFAULT_MAXIMUM_DOMINANT_READER_SEGMENT_RATIO = 0.7;
const DEFAULT_MINIMUM_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_FAILING_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_USABLE_FAILING_HOLDOUT_SAMPLE_COUNT = 1;
const DEFAULT_MINIMUM_FRICTION_ANNOTATION_COUNT = 1;
const DEFAULT_MINIMUM_ACTIONABLE_FRICTION_ANNOTATION_COUNT = 1;
const DEFAULT_MINIMUM_STYLE_HIGHLIGHT_ANNOTATION_COUNT = 1;
const DEFAULT_MINIMUM_ACTIONABLE_STYLE_HIGHLIGHT_ANNOTATION_COUNT = 1;
const DEFAULT_MINIMUM_STYLE_HIGHLIGHT_QUALITY_COUNT = 2;
const DEFAULT_MINIMUM_STYLE_FINGERPRINT_SAMPLES_PER_POLARITY = 1;
const DEFAULT_MINIMUM_STYLE_FINGERPRINT_DISTANCE = 1;
const DEFAULT_MINIMUM_STYLE_FINGERPRINT_SIGNAL_COUNT = 1;
const DEFAULT_MINIMUM_AUTHORIAL_STYLE_CONTINUITY_SAMPLES = 3;
const DEFAULT_MAXIMUM_AUTHORIAL_STYLE_DRIFT = 6;

const STYLE_FINGERPRINT_METRICS: Array<keyof ProseTasteMetrics> = [
  'functionalReportCount',
  'embodiedReactionDensityPer1000',
  'bodyReactionSubjectDensityPer1000',
  'longestBodyReactionSubjectRun',
  'clicheEmotionImageDensityPer1000',
  'longestClicheEmotionImageRun',
  'symbolicAbstractionDensityPer1000',
  'longestSymbolicAbstractionRun',
  'sensoryDensityPer1000',
  'longestSensoryWallpaperRun',
  'metaphorDensityPer1000',
  'emotionLabelDensityPer1000',
  'longestEmotionLabelRun',
  'hedgedPerceptionDensityPer1000',
  'abstractNounDensityPer1000',
  'cognitiveFilterDensityPer1000',
  'therapySpeakDensityPer1000',
  'longestTherapySpeakRun',
  'backstoryExpositionDensityPer1000',
  'longestBackstoryExpositionRun',
  'relationshipMontageSummaryDensityPer1000',
  'longestRelationshipMontageSummaryRun',
  'timeSkipSummaryDensityPer1000',
  'longestTimeSkipSummaryRun',
  'contrastiveReframeDensityPer1000',
  'longestContrastiveReframeRun',
  'loreTermDensityPer1000',
  'loreTermOverloadSentenceCount',
  'longestLoreTermRun',
  'systemStatBlockDensityPer1000',
  'longestSystemStatBlockRun',
  'declaredResolveDensityPer1000',
  'longestDeclaredResolveRun',
  'revelationSummaryDensityPer1000',
  'longestRevelationSummaryRun',
  'proceduralChecklistDensityPer1000',
  'longestProceduralChecklistRun',
  'actionChoreographyDensityPer1000',
  'longestActionChoreographyRun',
  'nominalizedExplanationDensityPer1000',
  'translationeseFormulaDensityPer1000',
  'connectiveStarterDensityPer1000',
  'fillerAdverbDensityPer1000',
  'longestFillerAdverbRun',
  'simultaneousActionDensityPer1000',
  'longestSimultaneousActionRun',
  'statusQuoActionDensityPer1000',
  'longestStatusQuoActionRun',
  'propFidgetBeatDensityPer1000',
  'longestPropFidgetBeatRun',
  'gazeChoreographyDensityPer1000',
  'longestGazeChoreographyRun',
  'causalTurnDensityPer1000',
  'commaDensityPer1000',
  'reportingTailDensityPer1000',
  'emphasisPunctuationDensityPer1000',
  'longestEmphasisPunctuationRun',
  'staticDescriptionDensityPer1000',
  'genericTeaserDensityPer1000',
  'thinCliffhangerEndingCount',
  'endingCliffhangerSignalCount',
  'endingConcreteTriggerCount',
  'povMindJumpParagraphDensityPer1000',
  'povMindJumpParagraphCount',
  'longestPovMindJumpRun',
  'expositoryDialogueRatio',
  'longestDialogueTurnLength',
  'averageDialogueTurnLength',
  'longestDialogueGroundingGapRun',
  'dialogueQuestionTurnCount',
  'dialogueQuestionRatio',
  'longestDialogueQuestionRun',
  'dialogueVocativeTurnCount',
  'dialogueVocativeRatio',
  'longestDialogueVocativeRun',
  'dialogueLexicalEchoTurnCount',
  'dialogueLexicalEchoRatio',
  'longestDialogueLexicalEchoRun',
  'dialogueParaphraseConfirmationTurnCount',
  'dialogueParaphraseConfirmationRatio',
  'longestDialogueParaphraseConfirmationRun',
  'roteDialogueReplyCount',
  'roteDialogueReplyRatio',
  'longestRoteDialogueReplyRun',
  'neutralDialogueTagCount',
  'neutralDialogueTagRatio',
  'longestNeutralDialogueTagRun',
  'silenceStallDensityPer1000',
  'longestSilenceStallRun',
  'melodramaticCaptionDensityPer1000',
  'longestMelodramaticCaptionRun',
  'stockReactionBeatDensityPer1000',
  'longestStockReactionBeatRun',
  'facialExpressionBeatDensityPer1000',
  'longestFacialExpressionBeatRun',
  'vagueAtmosphereModifierDensityPer1000',
  'longestVagueAtmosphereModifierRun',
  'evaluativeModifierDensityPer1000',
  'longestEvaluativeModifierRun',
  'rhetoricalQuestionDensityPer1000',
  'longestRhetoricalQuestionRun',
  'subtextExplanationDensityPer1000',
  'longestSubtextExplanationRun',
  'ambiguousReferenceDensityPer1000',
  'longestAmbiguousReferenceRun',
  'sceneTransitionGroundingGapDensityPer1000',
  'longestSceneTransitionGroundingGapRun',
  'topicMarkerStarterDensityPer1000',
  'longestTopicMarkerStarterRun',
  'sentenceLengthVariationCoefficient',
  'longestUniformSentenceLengthRun',
  'longestUniformParagraphBeatRun',
  'viewpointAnchorDensityPer1000',
  'listMarkerCount',
  'designJargonCount',
  'longestShortSentenceRun',
  'longestSameEndingRun',
  'dominantSentenceEndingShare',
  'dominantSentenceEndingCount',
  'sentenceEndingCadenceSampleSize',
  'dominantDialogueEndingShare',
  'dominantDialogueEndingCount',
  'dialogueEndingCadenceSampleSize',
  'dominantDialogueStarterShare',
  'dominantDialogueStarterCount',
  'dialogueStarterCadenceSampleSize',
  'longestRepeatedSubjectRun',
  'longestRepeatedConnectiveStarterRun',
];

const AUTHORIAL_STYLE_DRIFT_METRICS: Array<keyof ProseTasteMetrics> = [
  'sensoryDensityPer1000',
  'longestSensoryWallpaperRun',
  'bodyReactionSubjectDensityPer1000',
  'clicheEmotionImageDensityPer1000',
  'symbolicAbstractionDensityPer1000',
  'metaphorDensityPer1000',
  'emotionLabelDensityPer1000',
  'longestEmotionLabelRun',
  'hedgedPerceptionDensityPer1000',
  'abstractNounDensityPer1000',
  'cognitiveFilterDensityPer1000',
  'therapySpeakDensityPer1000',
  'longestTherapySpeakRun',
  'backstoryExpositionDensityPer1000',
  'longestBackstoryExpositionRun',
  'relationshipMontageSummaryDensityPer1000',
  'longestRelationshipMontageSummaryRun',
  'timeSkipSummaryDensityPer1000',
  'longestTimeSkipSummaryRun',
  'contrastiveReframeDensityPer1000',
  'longestContrastiveReframeRun',
  'loreTermDensityPer1000',
  'loreTermOverloadSentenceCount',
  'longestLoreTermRun',
  'systemStatBlockDensityPer1000',
  'longestSystemStatBlockRun',
  'declaredResolveDensityPer1000',
  'longestDeclaredResolveRun',
  'revelationSummaryDensityPer1000',
  'longestRevelationSummaryRun',
  'proceduralChecklistDensityPer1000',
  'longestProceduralChecklistRun',
  'actionChoreographyDensityPer1000',
  'longestActionChoreographyRun',
  'nominalizedExplanationDensityPer1000',
  'translationeseFormulaDensityPer1000',
  'connectiveStarterDensityPer1000',
  'fillerAdverbDensityPer1000',
  'simultaneousActionDensityPer1000',
  'statusQuoActionDensityPer1000',
  'propFidgetBeatDensityPer1000',
  'gazeChoreographyDensityPer1000',
  'causalTurnDensityPer1000',
  'commaDensityPer1000',
  'reportingTailDensityPer1000',
  'emphasisPunctuationDensityPer1000',
  'staticDescriptionDensityPer1000',
  'genericTeaserDensityPer1000',
  'thinCliffhangerEndingCount',
  'endingCliffhangerSignalCount',
  'endingConcreteTriggerCount',
  'povMindJumpParagraphDensityPer1000',
  'povMindJumpParagraphCount',
  'longestPovMindJumpRun',
  'expositoryDialogueRatio',
  'longestDialogueTurnLength',
  'averageDialogueTurnLength',
  'longestDialogueGroundingGapRun',
  'dialogueQuestionTurnCount',
  'dialogueQuestionRatio',
  'longestDialogueQuestionRun',
  'dialogueVocativeTurnCount',
  'dialogueVocativeRatio',
  'longestDialogueVocativeRun',
  'dialogueLexicalEchoTurnCount',
  'dialogueLexicalEchoRatio',
  'longestDialogueLexicalEchoRun',
  'dialogueParaphraseConfirmationTurnCount',
  'dialogueParaphraseConfirmationRatio',
  'longestDialogueParaphraseConfirmationRun',
  'roteDialogueReplyRatio',
  'neutralDialogueTagRatio',
  'silenceStallDensityPer1000',
  'melodramaticCaptionDensityPer1000',
  'stockReactionBeatDensityPer1000',
  'facialExpressionBeatDensityPer1000',
  'vagueAtmosphereModifierDensityPer1000',
  'evaluativeModifierDensityPer1000',
  'rhetoricalQuestionDensityPer1000',
  'subtextExplanationDensityPer1000',
  'ambiguousReferenceDensityPer1000',
  'topicMarkerStarterDensityPer1000',
  'sentenceLengthVariationCoefficient',
  'longestUniformParagraphBeatRun',
  'viewpointAnchorDensityPer1000',
  'longestShortSentenceRun',
  'longestSameEndingRun',
  'dominantSentenceEndingShare',
  'dominantSentenceEndingCount',
  'sentenceEndingCadenceSampleSize',
  'dominantDialogueEndingShare',
  'dominantDialogueEndingCount',
  'dialogueEndingCadenceSampleSize',
  'dominantDialogueStarterShare',
  'dominantDialogueStarterCount',
  'dialogueStarterCadenceSampleSize',
  'longestRepeatedSubjectRun',
  'longestRepeatedConnectiveStarterRun',
];

interface ResolvedProseTasteBenchmarkOptions extends ProseTasteBenchmarkOptions {
  minimumHoldoutSampleCount: number;
  minimumUsableHoldoutSampleCount: number;
  minimumFailingHoldoutSampleCount: number;
  minimumUsableFailingHoldoutSampleCount: number;
  requireHoldoutForStyleTuning: boolean;
  minimumFrictionAnnotationCount: number;
  minimumActionableFrictionAnnotationCount: number;
  requireFrictionAnnotationsForStyleTuning: boolean;
  minimumStyleHighlightAnnotationCount: number;
  minimumActionableStyleHighlightAnnotationCount: number;
  requireStyleHighlightAnnotationsForStyleTuning: boolean;
  minimumStyleHighlightQualityCount: number;
  requireStyleHighlightQualityDiversity: boolean;
  minimumStyleFingerprintSamplesPerPolarity: number;
  minimumStyleFingerprintDistance: number;
  minimumStyleFingerprintSignalCount: number;
  requireStyleFingerprintSeparation: boolean;
  minimumAuthorialStyleContinuitySamples: number;
  maximumAuthorialStyleDrift: number;
  requireAuthorialStyleContinuity: boolean;
}

export function evaluateProseTasteBenchmark(
  samples: ProseTasteBenchmarkSample[],
  defaults: ProseTasteBenchmarkOptions = {}
): ProseTasteBenchmarkResult {
  const resolvedOptions = resolveBenchmarkOptions(defaults);
  const sampleResults = samples.map(sample => evaluateBenchmarkSample(sample, resolvedOptions));
  const passed = sampleResults.filter(result => result.passed).length;
  const falsePositiveCount = sampleResults.filter(result => result.failureType === 'false-positive').length;
  const falseNegativeCount = sampleResults.filter(result => result.failureType === 'false-negative').length;
  const missingIssueCount = sampleResults.filter(result => result.failureType === 'missing-issue').length;
  const scoreOutOfRangeCount = sampleResults.filter(result => result.failureType === 'score-out-of-range').length;
  const missingStyleFrictionAnnotationCount = sampleResults
    .filter(result => result.styleFrictionAnnotationCoverage === 'none').length;
  const weakStyleFrictionAnnotationCount = sampleResults
    .filter(result => result.styleFrictionAnnotationCoverage === 'partial').length;
  const styleFrictionAnnotationCount = sampleResults
    .reduce((sum, result) => sum + result.styleFrictionAnnotationCount, 0);
  const actionableStyleFrictionAnnotationCount = sampleResults
    .reduce((sum, result) => sum + result.actionableStyleFrictionAnnotationCount, 0);
  const missingStyleHighlightAnnotationCount = sampleResults
    .filter(result => result.styleHighlightAnnotationCoverage === 'none').length;
  const weakStyleHighlightAnnotationCount = sampleResults
    .filter(result => result.styleHighlightAnnotationCoverage === 'partial').length;
  const styleHighlightAnnotationCount = sampleResults
    .reduce((sum, result) => sum + result.styleHighlightAnnotationCount, 0);
  const actionableStyleHighlightAnnotationCount = sampleResults
    .reduce((sum, result) => sum + result.actionableStyleHighlightAnnotationCount, 0);
  const styleHighlightQualities = collectUsableStyleHighlightQualities(sampleResults);
  const styleHighlightQualityCount = styleHighlightQualities.length;
  const styleFrictionAnnotationBlockerCount =
    resolvedOptions.requireFrictionAnnotationsForStyleTuning
      ? sampleResults.filter(result =>
          !result.expectedPassed &&
          result.styleFrictionAnnotationCoverage !== 'covered'
        ).length
      : 0;
  const weakStyleHighlightQualityDiversityCount =
    resolvedOptions.requireStyleHighlightQualityDiversity &&
    styleHighlightQualityCount < resolvedOptions.minimumStyleHighlightQualityCount
      ? 1
      : 0;
  const styleHighlightAnnotationBlockerCount =
    resolvedOptions.requireStyleHighlightAnnotationsForStyleTuning
      ? sampleResults.filter(result =>
          result.expectedPassed &&
          result.styleHighlightAnnotationCoverage !== 'covered'
        ).length
      : 0;
  const segmentCoverage = evaluateReaderSegmentCoverage(sampleResults, resolvedOptions);
  const splitCoverage = evaluateSplitCoverage(sampleResults);
  const splitLeakages = detectSplitLeakages(sampleResults);
  const styleFingerprint = evaluateStyleFingerprint(sampleResults, resolvedOptions);
  const weakStyleFingerprintCount = styleFingerprint.status === 'separated' ? 0 : 1;
  const authorialStyleDrift = evaluateAuthorialStyleDrift(sampleResults, resolvedOptions);
  const weakAuthorialStyleDriftCount =
    resolvedOptions.requireAuthorialStyleContinuity &&
    authorialStyleDrift.status !== 'stable'
      ? 1
      : 0;
  const underSampledHoldoutSamples = resolvedOptions.requireHoldoutForStyleTuning &&
    splitCoverage.holdoutSamples < resolvedOptions.minimumHoldoutSampleCount;
  const underSampledUsableHoldoutSamples = resolvedOptions.requireHoldoutForStyleTuning &&
    splitCoverage.usableHoldoutSamples < resolvedOptions.minimumUsableHoldoutSampleCount;
  const underSampledFailingHoldoutSamples = resolvedOptions.requireHoldoutForStyleTuning &&
    splitCoverage.failingHoldoutSamples < resolvedOptions.minimumFailingHoldoutSampleCount;
  const underSampledUsableFailingHoldoutSamples = resolvedOptions.requireHoldoutForStyleTuning &&
    splitCoverage.usableFailingHoldoutSamples < resolvedOptions.minimumUsableFailingHoldoutSampleCount;
  const failed = sampleResults.length - passed;

  return {
    total: sampleResults.length,
    passed,
    failed,
    accuracy: sampleResults.length === 0 ? 1 : passed / sampleResults.length,
    falsePositiveCount,
    falseNegativeCount,
    missingIssueCount,
    scoreOutOfRangeCount,
    missingStyleFrictionAnnotationCount,
    weakStyleFrictionAnnotationCount,
    styleFrictionAnnotationCount,
    actionableStyleFrictionAnnotationCount,
    missingStyleHighlightAnnotationCount,
    weakStyleHighlightAnnotationCount,
    styleHighlightAnnotationCount,
    actionableStyleHighlightAnnotationCount,
    styleHighlightQualityCount,
    styleHighlightQualities,
    weakStyleHighlightQualityDiversityCount,
    weakStyleFingerprintCount,
    styleFingerprintStatus: styleFingerprint.status,
    styleFingerprintDistance: styleFingerprint.distance,
    styleFingerprintSignalCount: styleFingerprint.signalCount,
    styleFingerprint,
    weakAuthorialStyleDriftCount,
    authorialStyleDriftStatus: authorialStyleDrift.status,
    authorialStyleDriftMaxDistance: authorialStyleDrift.maxDistance,
    authorialStyleDriftPairCount: authorialStyleDrift.pairCount,
    authorialStyleDrift,
    readerSegments: segmentCoverage.readerSegments,
    missingRequiredReaderSegments: segmentCoverage.missingRequiredReaderSegments,
    underSampledReaderSegments: segmentCoverage.underSampledReaderSegments,
    underSampledFailingReaderSegments: segmentCoverage.underSampledFailingReaderSegments,
    dominantReaderSegmentRatio: segmentCoverage.dominantReaderSegmentRatio,
    readerSegmentRepresentativeness: segmentCoverage.representativeness,
    splitCoverage,
    underSampledHoldoutSamples,
    underSampledUsableHoldoutSamples,
    underSampledFailingHoldoutSamples,
    underSampledUsableFailingHoldoutSamples,
    splitLeakageCount: splitLeakages.length,
    splitLeakages,
    readyForStyleTuning: failed === 0 &&
      segmentCoverage.representativeness === 'balanced' &&
      segmentCoverage.missingRequiredReaderSegments.length === 0 &&
      segmentCoverage.underSampledReaderSegments.length === 0 &&
      segmentCoverage.underSampledFailingReaderSegments.length === 0 &&
      !underSampledHoldoutSamples &&
      !underSampledUsableHoldoutSamples &&
      !underSampledFailingHoldoutSamples &&
      !underSampledUsableFailingHoldoutSamples &&
      splitLeakages.length === 0 &&
      styleFrictionAnnotationBlockerCount === 0 &&
      styleHighlightAnnotationBlockerCount === 0 &&
      weakStyleHighlightQualityDiversityCount === 0 &&
      (!resolvedOptions.requireStyleFingerprintSeparation ||
        styleFingerprint.status === 'separated') &&
      (!resolvedOptions.requireAuthorialStyleContinuity ||
        authorialStyleDrift.status === 'stable'),
    recommendations: buildRecommendations(
      segmentCoverage,
      splitCoverage,
      styleFingerprint,
      authorialStyleDrift,
      {
        missingStyleFrictionAnnotationCount,
        weakStyleFrictionAnnotationCount,
        styleFrictionAnnotationBlockerCount,
        missingStyleHighlightAnnotationCount,
        weakStyleHighlightAnnotationCount,
        styleHighlightAnnotationBlockerCount,
        styleHighlightQualityCount,
        weakStyleHighlightQualityDiversityCount,
        splitLeakageCount: splitLeakages.length,
      },
      resolvedOptions
    ),
    sampleResults,
  };
}

function evaluateBenchmarkSample(
  sample: ProseTasteBenchmarkSample,
  defaults: ResolvedProseTasteBenchmarkOptions
): ProseTasteBenchmarkSampleResult {
  const gate = evaluateProseTaste(sample.content, {
    profile: sample.profile ?? defaults.profile,
    threshold: sample.threshold ?? defaults.threshold,
  });
  const issueCodes = gate.issues.map(issue => issue.code);
  const missingExpectedIssueCodes = (sample.expectedIssueCodes ?? [])
    .filter(code => !issueCodes.includes(code));
  const scoreExpectationPassed = scoreWithinExpectedRange(
    gate.score,
    sample.expectedMinScore,
    sample.expectedMaxScore
  );
  const passExpectationPassed = gate.passed === sample.expectedPassed;
  const passed = passExpectationPassed &&
    missingExpectedIssueCodes.length === 0 &&
    scoreExpectationPassed;
  const frictionAnnotations = evaluateStyleFrictionAnnotations(sample, defaults);
  const highlightAnnotations = evaluateStyleHighlightAnnotations(sample, defaults);
  const frictionEvidenceUsable =
    !defaults.requireFrictionAnnotationsForStyleTuning ||
    sample.expectedPassed ||
    frictionAnnotations.coverage === 'covered';
  const highlightEvidenceUsable =
    !defaults.requireStyleHighlightAnnotationsForStyleTuning ||
    !sample.expectedPassed ||
    highlightAnnotations.coverage === 'covered';
  const styleTuningUsable = passed && frictionEvidenceUsable && highlightEvidenceUsable;
  const failureType = determineFailureType(
    sample,
    gate,
    missingExpectedIssueCodes,
    scoreExpectationPassed
  );

  return {
    id: sample.id,
    label: sample.label,
    readerSegment: normalizeOptionalText(sample.readerSegment),
    calibrationSplit: sample.calibrationSplit,
    chapter: sample.chapter,
    version: sample.version,
    contentSource: sample.contentSource,
    contentPath: sample.contentPath,
    chapterSourceGrounded: sample.chapterSourceGrounded,
    evidenceFingerprint: fingerprintSampleEvidence(sample),
    expectedPassed: sample.expectedPassed,
    actualPassed: gate.passed,
    score: gate.score,
    issueCodes,
    missingExpectedIssueCodes,
    scoreExpectationPassed,
    passed,
    styleTuningUsable,
    failureType,
    gate,
    styleFrictionAnnotations: frictionAnnotations.annotations,
    styleFrictionAnnotationCount: frictionAnnotations.count,
    actionableStyleFrictionAnnotationCount: frictionAnnotations.actionableCount,
    styleFrictionAnnotationIssueCodes: frictionAnnotations.issueCodes,
    styleFrictionAnnotationCoverage: frictionAnnotations.coverage,
    styleFrictionAnnotationIssues: frictionAnnotations.issues,
    styleHighlightAnnotations: highlightAnnotations.annotations,
    styleHighlightAnnotationCount: highlightAnnotations.count,
    actionableStyleHighlightAnnotationCount: highlightAnnotations.actionableCount,
    styleHighlightAnnotationQualities: highlightAnnotations.qualities,
    styleHighlightAnnotationCoverage: highlightAnnotations.coverage,
    styleHighlightAnnotationIssues: highlightAnnotations.issues,
  };
}

function evaluateStyleFrictionAnnotations(
  sample: ProseTasteBenchmarkSample,
  options: ResolvedProseTasteBenchmarkOptions
): {
  annotations: ProseTasteFrictionAnnotation[];
  count: number;
  actionableCount: number;
  issueCodes: ProseTasteIssueCode[];
  coverage: ProseTasteFrictionAnnotationCoverage;
  issues: string[];
} {
  if (sample.expectedPassed) {
    return {
      annotations: [],
      count: 0,
      actionableCount: 0,
      issueCodes: [],
      coverage: 'not-required',
      issues: [],
    };
  }

  const annotations = (sample.styleFrictionAnnotations ?? [])
    .map(annotation => normalizeStyleFrictionAnnotation(annotation, sample.readerSegment))
    .filter(annotation =>
      annotation.location !== undefined ||
      annotation.reason !== undefined ||
      annotation.issueCode !== undefined ||
      annotation.rewriteSuggestion !== undefined ||
      annotation.targetText !== undefined
    );
  const actionableAnnotations = annotations.filter(isActionableStyleFrictionAnnotation);
  const issueCodes = uniqueIssueCodes(
    actionableAnnotations
      .map(annotation => annotation.issueCode)
      .filter((code): code is ProseTasteIssueCode => code !== undefined)
  );
  const issues: string[] = [];

  if (annotations.length < options.minimumFrictionAnnotationCount) {
    issues.push(
      `needs at least ${options.minimumFrictionAnnotationCount} style friction annotation(s)`
    );
  }

  if (actionableAnnotations.length < options.minimumActionableFrictionAnnotationCount) {
    issues.push(
      `needs at least ${options.minimumActionableFrictionAnnotationCount} actionable style friction annotation(s) with location, reason, reader segment, and rewrite suggestion`
    );
  }

  const expectedIssueCodes = uniqueIssueCodes(sample.expectedIssueCodes ?? []);
  const missingIssueCodes = expectedIssueCodes
    .filter(code => !issueCodes.includes(code));
  if (missingIssueCodes.length > 0) {
    issues.push(
      `style friction annotations do not cover expected issue code(s): ${missingIssueCodes.join(', ')}`
    );
  }

  let coverage: ProseTasteFrictionAnnotationCoverage = 'covered';
  if (annotations.length === 0) {
    coverage = 'none';
  } else if (issues.length > 0) {
    coverage = 'partial';
  }

  return {
    annotations,
    count: annotations.length,
    actionableCount: actionableAnnotations.length,
    issueCodes,
    coverage,
    issues,
  };
}

function evaluateStyleHighlightAnnotations(
  sample: ProseTasteBenchmarkSample,
  options: ResolvedProseTasteBenchmarkOptions
): {
  annotations: ProseTasteStyleHighlightAnnotation[];
  count: number;
  actionableCount: number;
  qualities: ProseTasteStyleHighlightQuality[];
  coverage: ProseTasteStyleHighlightAnnotationCoverage;
  issues: string[];
} {
  if (!sample.expectedPassed) {
    return {
      annotations: [],
      count: 0,
      actionableCount: 0,
      qualities: [],
      coverage: 'not-required',
      issues: [],
    };
  }

  const annotations = (sample.styleHighlightAnnotations ?? [])
    .map(annotation => normalizeStyleHighlightAnnotation(annotation, sample.readerSegment))
    .filter(annotation =>
      annotation.location !== undefined ||
      annotation.reason !== undefined ||
      annotation.quality !== undefined ||
      annotation.transferGuidance !== undefined ||
      annotation.targetText !== undefined
    );
  const actionableAnnotations = annotations.filter(isActionableStyleHighlightAnnotation);
  const qualities = uniqueStyleHighlightQualities(
    actionableAnnotations
      .map(annotation => annotation.quality)
      .filter((quality): quality is ProseTasteStyleHighlightQuality => quality !== undefined)
  );
  const issues: string[] = [];

  if (annotations.length < options.minimumStyleHighlightAnnotationCount) {
    issues.push(
      `needs at least ${options.minimumStyleHighlightAnnotationCount} positive style highlight annotation(s)`
    );
  }

  if (actionableAnnotations.length < options.minimumActionableStyleHighlightAnnotationCount) {
    issues.push(
      `needs at least ${options.minimumActionableStyleHighlightAnnotationCount} actionable positive style highlight annotation(s) with location, reason, reader segment, quality, and transfer guidance`
    );
  }

  let coverage: ProseTasteStyleHighlightAnnotationCoverage = 'covered';
  if (annotations.length === 0) {
    coverage = 'none';
  } else if (issues.length > 0) {
    coverage = 'partial';
  }

  return {
    annotations,
    count: annotations.length,
    actionableCount: actionableAnnotations.length,
    qualities,
    coverage,
    issues,
  };
}

function normalizeStyleFrictionAnnotation(
  annotation: ProseTasteFrictionAnnotation,
  fallbackReaderSegment?: string
): ProseTasteFrictionAnnotation {
  return {
    location: normalizeOptionalText(annotation.location),
    reason: normalizeOptionalText(annotation.reason),
    issueCode: annotation.issueCode,
    severity: annotation.severity,
    readerCount: normalizePositiveInteger(annotation.readerCount),
    readerSegment: normalizeOptionalText(annotation.readerSegment) ?? normalizeOptionalText(fallbackReaderSegment),
    rewriteSuggestion: normalizeOptionalText(annotation.rewriteSuggestion),
    targetText: normalizeOptionalText(annotation.targetText),
  };
}

function isActionableStyleFrictionAnnotation(annotation: ProseTasteFrictionAnnotation): boolean {
  return annotation.location !== undefined &&
    annotation.reason !== undefined &&
    annotation.readerSegment !== undefined &&
    annotation.rewriteSuggestion !== undefined;
}

function normalizeStyleHighlightAnnotation(
  annotation: ProseTasteStyleHighlightAnnotation,
  fallbackReaderSegment?: string
): ProseTasteStyleHighlightAnnotation {
  return {
    location: normalizeOptionalText(annotation.location),
    reason: normalizeOptionalText(annotation.reason),
    quality: annotation.quality,
    readerCount: normalizePositiveInteger(annotation.readerCount),
    readerSegment: normalizeOptionalText(annotation.readerSegment) ?? normalizeOptionalText(fallbackReaderSegment),
    targetText: normalizeOptionalText(annotation.targetText),
    transferGuidance: normalizeOptionalText(annotation.transferGuidance),
  };
}

function isActionableStyleHighlightAnnotation(annotation: ProseTasteStyleHighlightAnnotation): boolean {
  return annotation.location !== undefined &&
    annotation.reason !== undefined &&
    annotation.readerSegment !== undefined &&
    annotation.quality !== undefined &&
    annotation.transferGuidance !== undefined;
}

function resolveBenchmarkOptions(
  options: ProseTasteBenchmarkOptions
): ResolvedProseTasteBenchmarkOptions {
  return {
    ...options,
    minimumHoldoutSampleCount:
      options.minimumHoldoutSampleCount ?? DEFAULT_MINIMUM_HOLDOUT_SAMPLE_COUNT,
    minimumUsableHoldoutSampleCount:
      options.minimumUsableHoldoutSampleCount ?? DEFAULT_MINIMUM_USABLE_HOLDOUT_SAMPLE_COUNT,
    minimumFailingHoldoutSampleCount:
      options.minimumFailingHoldoutSampleCount ?? DEFAULT_MINIMUM_FAILING_HOLDOUT_SAMPLE_COUNT,
    minimumUsableFailingHoldoutSampleCount:
      options.minimumUsableFailingHoldoutSampleCount ??
      DEFAULT_MINIMUM_USABLE_FAILING_HOLDOUT_SAMPLE_COUNT,
    requireHoldoutForStyleTuning: options.requireHoldoutForStyleTuning ?? true,
    minimumFrictionAnnotationCount:
      options.minimumFrictionAnnotationCount ?? DEFAULT_MINIMUM_FRICTION_ANNOTATION_COUNT,
    minimumActionableFrictionAnnotationCount:
      options.minimumActionableFrictionAnnotationCount ??
      DEFAULT_MINIMUM_ACTIONABLE_FRICTION_ANNOTATION_COUNT,
    requireFrictionAnnotationsForStyleTuning:
      options.requireFrictionAnnotationsForStyleTuning ?? true,
    minimumStyleHighlightAnnotationCount:
      options.minimumStyleHighlightAnnotationCount ??
      DEFAULT_MINIMUM_STYLE_HIGHLIGHT_ANNOTATION_COUNT,
    minimumActionableStyleHighlightAnnotationCount:
      options.minimumActionableStyleHighlightAnnotationCount ??
      DEFAULT_MINIMUM_ACTIONABLE_STYLE_HIGHLIGHT_ANNOTATION_COUNT,
    requireStyleHighlightAnnotationsForStyleTuning:
      options.requireStyleHighlightAnnotationsForStyleTuning ?? true,
    minimumStyleHighlightQualityCount:
      options.minimumStyleHighlightQualityCount ??
      DEFAULT_MINIMUM_STYLE_HIGHLIGHT_QUALITY_COUNT,
    requireStyleHighlightQualityDiversity:
      options.requireStyleHighlightQualityDiversity ?? false,
    minimumStyleFingerprintSamplesPerPolarity:
      options.minimumStyleFingerprintSamplesPerPolarity ??
      DEFAULT_MINIMUM_STYLE_FINGERPRINT_SAMPLES_PER_POLARITY,
    minimumStyleFingerprintDistance:
      options.minimumStyleFingerprintDistance ?? DEFAULT_MINIMUM_STYLE_FINGERPRINT_DISTANCE,
    minimumStyleFingerprintSignalCount:
      options.minimumStyleFingerprintSignalCount ??
      DEFAULT_MINIMUM_STYLE_FINGERPRINT_SIGNAL_COUNT,
    requireStyleFingerprintSeparation:
      options.requireStyleFingerprintSeparation ?? true,
    minimumAuthorialStyleContinuitySamples:
      options.minimumAuthorialStyleContinuitySamples ??
      DEFAULT_MINIMUM_AUTHORIAL_STYLE_CONTINUITY_SAMPLES,
    maximumAuthorialStyleDrift:
      options.maximumAuthorialStyleDrift ?? DEFAULT_MAXIMUM_AUTHORIAL_STYLE_DRIFT,
    requireAuthorialStyleContinuity:
      options.requireAuthorialStyleContinuity ?? false,
  };
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

function determineFailureType(
  sample: ProseTasteBenchmarkSample,
  gate: ProseTasteGateResult,
  missingExpectedIssueCodes: ProseTasteIssueCode[],
  scoreExpectationPassed: boolean
): ProseTasteBenchmarkSampleResult['failureType'] {
  if (gate.passed !== sample.expectedPassed) {
    return gate.passed ? 'false-positive' : 'false-negative';
  }

  if (missingExpectedIssueCodes.length > 0) {
    return 'missing-issue';
  }

  if (!scoreExpectationPassed) {
    return 'score-out-of-range';
  }

  return undefined;
}

function evaluateReaderSegmentCoverage(
  sampleResults: ProseTasteBenchmarkSampleResult[],
  options: ProseTasteBenchmarkOptions
): {
  readerSegments: string[];
  missingRequiredReaderSegments: string[];
  underSampledReaderSegments: string[];
  underSampledFailingReaderSegments: string[];
  dominantReaderSegmentRatio?: number;
  representativeness: ProseTasteReaderSegmentRepresentativeness;
} {
  const segmentCounts = new Map<string, number>();
  const failingSegmentCounts = new Map<string, number>();

  for (const result of sampleResults) {
    const segment = normalizeOptionalText(result.readerSegment);
    if (!segment) continue;
    segmentCounts.set(segment, (segmentCounts.get(segment) ?? 0) + 1);
    if (!result.expectedPassed) {
      failingSegmentCounts.set(segment, (failingSegmentCounts.get(segment) ?? 0) + 1);
    }
  }

  const readerSegments = Array.from(segmentCounts.keys()).sort();
  const requiredReaderSegments = uniqueStrings(options.requiredReaderSegments ?? []);
  const coverageTargets = requiredReaderSegments.length > 0 ? requiredReaderSegments : readerSegments;
  const minimumSegmentCount =
    options.minimumReaderSegmentCount ?? DEFAULT_MINIMUM_READER_SEGMENT_COUNT;
  const minimumSamplesPerReaderSegment =
    options.minimumSamplesPerReaderSegment ?? DEFAULT_MINIMUM_SAMPLES_PER_READER_SEGMENT;
  const minimumFailingSamplesPerReaderSegment =
    options.minimumFailingSamplesPerReaderSegment ??
    DEFAULT_MINIMUM_FAILING_SAMPLES_PER_READER_SEGMENT;
  const maximumDominantReaderSegmentRatio =
    options.maximumDominantReaderSegmentRatio ?? DEFAULT_MAXIMUM_DOMINANT_READER_SEGMENT_RATIO;

  const missingRequiredReaderSegments = requiredReaderSegments
    .filter(segment => !segmentCounts.has(segment));
  const underSampledReaderSegments = coverageTargets
    .filter(segment => (segmentCounts.get(segment) ?? 0) < minimumSamplesPerReaderSegment);
  const underSampledFailingReaderSegments = coverageTargets
    .filter(segment => (failingSegmentCounts.get(segment) ?? 0) < minimumFailingSamplesPerReaderSegment);
  const totalSegmentedSamples = Array.from(segmentCounts.values())
    .reduce((sum, count) => sum + count, 0);
  const dominantReaderSegmentRatio = totalSegmentedSamples === 0
    ? undefined
    : Math.max(...Array.from(segmentCounts.values())) / totalSegmentedSamples;

  let representativeness: ProseTasteReaderSegmentRepresentativeness = 'balanced';
  if (readerSegments.length === 0) {
    representativeness = 'unknown';
  } else if (
    readerSegments.length < minimumSegmentCount ||
    missingRequiredReaderSegments.length > 0 ||
    underSampledReaderSegments.length > 0 ||
    underSampledFailingReaderSegments.length > 0 ||
    (dominantReaderSegmentRatio !== undefined &&
      dominantReaderSegmentRatio > maximumDominantReaderSegmentRatio)
  ) {
    representativeness = 'narrow';
  }

  return {
    readerSegments,
    missingRequiredReaderSegments,
    underSampledReaderSegments,
    underSampledFailingReaderSegments,
    dominantReaderSegmentRatio,
    representativeness,
  };
}

function evaluateSplitCoverage(
  sampleResults: ProseTasteBenchmarkSampleResult[]
): ProseTasteSplitCoverage {
  const coverage: ProseTasteSplitCoverage = {
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
  };

  for (const result of sampleResults) {
    const usable = result.styleTuningUsable;
    switch (result.calibrationSplit) {
      case 'calibration':
        coverage.calibrationSamples += 1;
        if (usable) coverage.usableCalibrationSamples += 1;
        break;
      case 'validation':
        coverage.validationSamples += 1;
        if (usable) coverage.usableValidationSamples += 1;
        break;
      case 'holdout':
        coverage.holdoutSamples += 1;
        if (usable) coverage.usableHoldoutSamples += 1;
        if (!result.expectedPassed) {
          coverage.failingHoldoutSamples += 1;
          if (usable) coverage.usableFailingHoldoutSamples += 1;
        }
        break;
      default:
        coverage.unassignedSamples += 1;
        if (usable) coverage.usableUnassignedSamples += 1;
        break;
    }
  }

  return coverage;
}

function detectSplitLeakages(
  sampleResults: ProseTasteBenchmarkSampleResult[]
): ProseTasteBenchmarkSplitLeakage[] {
  const byFingerprint = new Map<string, ProseTasteBenchmarkSampleResult[]>();

  for (const result of sampleResults) {
    if (!result.calibrationSplit) continue;
    const group = byFingerprint.get(result.evidenceFingerprint) ?? [];
    group.push(result);
    byFingerprint.set(result.evidenceFingerprint, group);
  }

  const leakages: ProseTasteBenchmarkSplitLeakage[] = [];
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
  sampleResults: ProseTasteBenchmarkSampleResult[]
): ProseTasteCalibrationSplit[] {
  return Array.from(
    new Set(
      sampleResults
        .map(result => result.calibrationSplit)
        .filter((split): split is ProseTasteCalibrationSplit => split !== undefined)
    )
  ).sort();
}

function evaluateStyleFingerprint(
  sampleResults: ProseTasteBenchmarkSampleResult[],
  options: ResolvedProseTasteBenchmarkOptions
): ProseTasteStyleFingerprint {
  const preferredSamples = sampleResults.filter(result =>
    result.expectedPassed && result.styleTuningUsable
  );
  const dislikedSamples = sampleResults.filter(result =>
    !result.expectedPassed && result.styleTuningUsable
  );

  if (
    preferredSamples.length < options.minimumStyleFingerprintSamplesPerPolarity ||
    dislikedSamples.length < options.minimumStyleFingerprintSamplesPerPolarity
  ) {
    return {
      status: 'not-enough-samples',
      preferredSampleCount: preferredSamples.length,
      dislikedSampleCount: dislikedSamples.length,
      distance: 0,
      signalCount: 0,
      signals: [],
    };
  }

  const metricDistances = STYLE_FINGERPRINT_METRICS.map(metric =>
    Math.abs(averageMetric(dislikedSamples, metric) - averageMetric(preferredSamples, metric))
  );
  const activeMetricDistances = metricDistances.filter(distance => distance > 0);
  const distance = roundScore(
    activeMetricDistances.length === 0
      ? 0
      : activeMetricDistances.reduce((sum, value) => sum + value, 0) /
        activeMetricDistances.length
  );
  const signals = STYLE_FINGERPRINT_METRICS
    .map(metric => {
      const preferredAverage = averageMetric(preferredSamples, metric);
      const dislikedAverage = averageMetric(dislikedSamples, metric);
      const delta = roundScore(dislikedAverage - preferredAverage);
      const strength = roundScore(Math.abs(delta));
      const direction: ProseTasteStyleFingerprintDirection =
        delta >= 0 ? 'disliked-higher' : 'preferred-higher';
      return {
        metric,
        preferredAverage,
        dislikedAverage,
        delta,
        strength,
        direction,
      };
    })
    .filter(signal => signal.strength >= options.minimumStyleFingerprintDistance)
    .sort((a, b) => b.strength - a.strength || a.metric.localeCompare(b.metric));
  const signalCount = signals.length;
  const status: ProseTasteStyleFingerprintStatus =
    distance >= options.minimumStyleFingerprintDistance &&
    signalCount >= options.minimumStyleFingerprintSignalCount
      ? 'separated'
      : 'weak';

  return {
    status,
    preferredSampleCount: preferredSamples.length,
    dislikedSampleCount: dislikedSamples.length,
    distance,
    signalCount,
    signals: signals.slice(0, 12),
  };
}

function evaluateAuthorialStyleDrift(
  sampleResults: ProseTasteBenchmarkSampleResult[],
  options: ResolvedProseTasteBenchmarkOptions
): ProseTasteAuthorialStyleDrift {
  const continuitySamples = sampleResults
    .filter(result =>
      result.expectedPassed &&
      result.styleTuningUsable &&
      result.chapter !== undefined
    )
    .sort((a, b) =>
      (a.chapter ?? 0) - (b.chapter ?? 0) ||
      (a.version ?? 0) - (b.version ?? 0) ||
      a.id.localeCompare(b.id)
    );

  if (continuitySamples.length < options.minimumAuthorialStyleContinuitySamples) {
    return {
      status: 'not-enough-samples',
      continuitySampleCount: continuitySamples.length,
      pairCount: 0,
      maxDistance: 0,
      averageDistance: 0,
      driftPairs: [],
    };
  }

  const pairs: ProseTasteAuthorialStyleDriftPair[] = [];
  for (let index = 1; index < continuitySamples.length; index++) {
    pairs.push(calculateAuthorialStyleDriftPair(
      continuitySamples[index - 1],
      continuitySamples[index]
    ));
  }

  const maxDistance = roundScore(Math.max(...pairs.map(pair => pair.distance)));
  const averageDistance = roundScore(
    pairs.reduce((sum, pair) => sum + pair.distance, 0) / pairs.length
  );
  const driftPairs = pairs
    .filter(pair => pair.distance > options.maximumAuthorialStyleDrift)
    .sort((a, b) => b.distance - a.distance || a.fromSampleId.localeCompare(b.fromSampleId));

  return {
    status: driftPairs.length === 0 ? 'stable' : 'drifted',
    continuitySampleCount: continuitySamples.length,
    pairCount: pairs.length,
    maxDistance,
    averageDistance,
    driftPairs: driftPairs.slice(0, 12),
  };
}

function calculateAuthorialStyleDriftPair(
  from: ProseTasteBenchmarkSampleResult,
  to: ProseTasteBenchmarkSampleResult
): ProseTasteAuthorialStyleDriftPair {
  const metricDeltas = AUTHORIAL_STYLE_DRIFT_METRICS
    .map(metric => {
      const delta = roundScore(to.gate.metrics[metric] - from.gate.metrics[metric]);
      return {
        metric,
        delta,
        strength: Math.abs(delta),
      };
    })
    .filter(item => item.strength > 0);
  const distance = roundScore(
    metricDeltas.length === 0
      ? 0
      : metricDeltas.reduce((sum, item) => sum + item.strength, 0) /
        metricDeltas.length
  );
  const strongest = metricDeltas
    .sort((a, b) => b.strength - a.strength || a.metric.localeCompare(b.metric))[0];

  return {
    fromSampleId: from.id,
    toSampleId: to.id,
    fromChapter: from.chapter,
    toChapter: to.chapter,
    distance,
    strongestMetric: strongest?.metric,
    strongestMetricDelta: strongest ? roundScore(strongest.delta) : undefined,
  };
}

function averageMetric(
  sampleResults: ProseTasteBenchmarkSampleResult[],
  metric: keyof ProseTasteMetrics
): number {
  if (sampleResults.length === 0) return 0;
  return roundScore(
    sampleResults.reduce((sum, result) => sum + result.gate.metrics[metric], 0) /
      sampleResults.length
  );
}

function buildRecommendations(
  coverage: ReturnType<typeof evaluateReaderSegmentCoverage>,
  splitCoverage: ProseTasteSplitCoverage,
  styleFingerprint: ProseTasteStyleFingerprint,
  authorialStyleDrift: ProseTasteAuthorialStyleDrift,
  friction: {
    missingStyleFrictionAnnotationCount: number;
    weakStyleFrictionAnnotationCount: number;
    styleFrictionAnnotationBlockerCount: number;
    missingStyleHighlightAnnotationCount: number;
    weakStyleHighlightAnnotationCount: number;
    styleHighlightAnnotationBlockerCount: number;
    styleHighlightQualityCount: number;
    weakStyleHighlightQualityDiversityCount: number;
    splitLeakageCount: number;
  },
  options: ResolvedProseTasteBenchmarkOptions
): string[] {
  const recommendations = new Set<string>();

  if (coverage.representativeness === 'unknown') {
    recommendations.add(
      'Record reader_segment on prose taste benchmark samples before using the set to tune style gates.'
    );
  }

  if (coverage.missingRequiredReaderSegments.length > 0) {
    recommendations.add(
      `Collect prose taste samples for required reader segments: ${coverage.missingRequiredReaderSegments.join(', ')}.`
    );
  }

  if (coverage.underSampledReaderSegments.length > 0) {
    recommendations.add(
      `Collect more prose taste samples for reader segments: ${coverage.underSampledReaderSegments.join(', ')}.`
    );
  }

  if (coverage.underSampledFailingReaderSegments.length > 0) {
    recommendations.add(
      `Collect disliked or irritating prose samples for reader segments: ${coverage.underSampledFailingReaderSegments.join(', ')}.`
    );
  }

  if (coverage.representativeness === 'narrow') {
    recommendations.add(
      'Balance prose taste benchmark samples across reader segments so one taste cohort cannot dominate style gate tuning.'
    );
  }

  if (friction.missingStyleFrictionAnnotationCount > 0) {
    recommendations.add(
      'Record style_friction_annotations on disliked prose samples so style gate tuning is grounded in reader-located prose friction.'
    );
  }

  if (friction.weakStyleFrictionAnnotationCount > 0) {
    recommendations.add(
      'Make prose taste annotations actionable: include location, reason, reader segment, rewrite suggestion, and expected issue code coverage.'
    );
  }

  if (
    options.requireFrictionAnnotationsForStyleTuning &&
    friction.styleFrictionAnnotationBlockerCount > 0
  ) {
    recommendations.add(
      'Do not tune prose style gates until every disliked prose calibration sample has covered style friction annotations.'
    );
  }

  if (friction.missingStyleHighlightAnnotationCount > 0) {
    recommendations.add(
      'Record style_highlight_annotations on preferred prose samples so style gate tuning preserves reader-located prose strengths, not only disliked habits.'
    );
  }

  if (friction.weakStyleHighlightAnnotationCount > 0) {
    recommendations.add(
      'Make preferred prose highlights actionable: include location, reason, reader segment, quality, and transfer guidance.'
    );
  }

  if (
    options.requireStyleHighlightAnnotationsForStyleTuning &&
    friction.styleHighlightAnnotationBlockerCount > 0
  ) {
    recommendations.add(
      'Do not tune prose style gates until every preferred prose calibration sample has covered positive style highlight annotations.'
    );
  }

  if (
    options.requireStyleHighlightQualityDiversity &&
    friction.weakStyleHighlightQualityDiversityCount > 0
  ) {
    recommendations.add(
      `Collect preferred prose highlights across at least ${options.minimumStyleHighlightQualityCount} distinct qualities; a single positive style signal can overfit the gate toward bland but merely clean prose.`
    );
  }

  if (options.requireStyleFingerprintSeparation) {
    if (styleFingerprint.status === 'not-enough-samples') {
      recommendations.add(
        `Collect at least ${options.minimumStyleFingerprintSamplesPerPolarity} usable preferred and disliked prose sample(s) each before tuning style gates.`
      );
    } else if (styleFingerprint.status === 'weak') {
      recommendations.add(
        'Do not tune prose style gates until preferred and disliked samples separate on measurable style fingerprint signals; otherwise the gate may only memorize labels or phrases.'
      );
    }
  }

  if (options.requireAuthorialStyleContinuity) {
    if (authorialStyleDrift.status === 'not-enough-samples') {
      recommendations.add(
        `Collect at least ${options.minimumAuthorialStyleContinuitySamples} usable chapter-grounded preferred prose sample(s) with chapter numbers before trusting authorial style continuity.`
      );
    } else if (authorialStyleDrift.status === 'drifted') {
      recommendations.add(
        `Review authorial style drift across chapter samples; max drift ${authorialStyleDrift.maxDistance} exceeds ${options.maximumAuthorialStyleDrift}. Preserve the same narrative voice while allowing scene-level variation.`
      );
    }
  }

  if (options.requireHoldoutForStyleTuning) {
    if (splitCoverage.holdoutSamples < options.minimumHoldoutSampleCount) {
      recommendations.add(
        `Reserve at least ${options.minimumHoldoutSampleCount} prose taste holdout sample(s) before tuning style gates; calibration-only style evidence can overfit to familiar disliked phrasing.`
      );
    }
    if (splitCoverage.usableHoldoutSamples < options.minimumUsableHoldoutSampleCount) {
      recommendations.add(
        `Collect at least ${options.minimumUsableHoldoutSampleCount} usable prose taste holdout sample(s) before applying style gate changes.`
      );
    }
    if (splitCoverage.failingHoldoutSamples < options.minimumFailingHoldoutSampleCount) {
      recommendations.add(
        `Reserve at least ${options.minimumFailingHoldoutSampleCount} disliked or irritating prose holdout sample(s) before trusting style gate tuning.`
      );
    }
    if (
      splitCoverage.usableFailingHoldoutSamples <
      options.minimumUsableFailingHoldoutSampleCount
    ) {
      recommendations.add(
        `Collect at least ${options.minimumUsableFailingHoldoutSampleCount} usable disliked-prose holdout sample(s) so style gates prove they still catch the prose habits users find irritating.`
      );
    }
    if (splitCoverage.unassignedSamples > 0) {
      recommendations.add(
        'Set calibration_split to calibration, validation, or holdout on prose taste samples so style tuning is checked against reserved evidence.'
      );
    }
  }

  if (friction.splitLeakageCount > 0) {
    recommendations.add(
      'Move duplicated prose taste evidence out of holdout or calibration splits; the same manuscript text cannot validate style gate tuning independently.'
    );
  }

  return Array.from(recommendations);
}

function fingerprintSampleEvidence(sample: ProseTasteBenchmarkSample): string {
  const payload = normalizeFingerprintText(sample.content);
  return `sha256:${createHash('sha256').update(payload).digest('hex')}`;
}

function normalizeFingerprintText(value: string): string {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function normalizePositiveInteger(value: number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (!Number.isInteger(value) || value < 1) return undefined;
  return value;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map(value => value.trim()).filter(Boolean)));
}

function uniqueIssueCodes(values: ProseTasteIssueCode[]): ProseTasteIssueCode[] {
  return Array.from(new Set(values));
}

function collectUsableStyleHighlightQualities(
  sampleResults: ProseTasteBenchmarkSampleResult[]
): ProseTasteStyleHighlightQuality[] {
  return uniqueStyleHighlightQualities(
    sampleResults
      .filter(result =>
        result.expectedPassed &&
        result.passed &&
        result.styleHighlightAnnotationCoverage === 'covered'
      )
      .flatMap(result => result.styleHighlightAnnotationQualities)
  );
}

function uniqueStyleHighlightQualities(
  values: ProseTasteStyleHighlightQuality[]
): ProseTasteStyleHighlightQuality[] {
  return Array.from(new Set(values));
}

function roundScore(value: number): number {
  return Math.round(value * 100) / 100;
}
