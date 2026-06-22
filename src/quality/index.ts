/**
 * Quality Module
 *
 * Multi-stage revision pipeline for progressive prose improvement.
 *
 * The 4-stage approach:
 * 1. Draft: Fix structural issues (scenes, beats, transitions)
 * 2. Tone: Align emotional arc (mood, subtext, voice)
 * 3. Style: Polish prose craft (filter words, rhythm, texture)
 * 4. Final: Proofread (grammar, honorifics, punctuation)
 *
 * @module quality
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  RevisionStageName,
  StageEvaluator,
  RevisionStage,
  StageResult,
  MultiStageResult,
  MultiStageOptions,
} from './types.js';

export {
  DRAFT_DIRECTIVE_TYPES,
  TONE_DIRECTIVE_TYPES,
  STYLE_DIRECTIVE_TYPES,
  FINAL_DIRECTIVE_TYPES,
} from './types.js';

// ============================================================================
// Stage Evaluator Exports
// ============================================================================

export {
  DraftStageEvaluator,
  ToneStageEvaluator,
  StyleStageEvaluator,
  FinalStageEvaluator,
  STAGE_EVALUATORS,
} from './stage-evaluators.js';

// ============================================================================
// Revision Stage Exports
// ============================================================================

export {
  REVISION_STAGES,
  runMultiStageRevision,
} from './revision-stages.js';

// ============================================================================
// Prose Taste Gate Exports
// ============================================================================

export {
  evaluateProseTaste,
  analyzeProseTasteMetrics,
} from './prose-taste-gate.js';

export type {
  ProseTasteGateOptions,
  ProseTasteGateResult,
  ProseTasteIssue,
  ProseTasteIssueCode,
  ProseTasteIssueSeverity,
  ProseTasteMetrics,
  ProseTasteMode,
  ProseTasteProfile,
} from './prose-taste-gate.js';

export {
  evaluateProseTasteBenchmark,
} from './prose-taste-benchmark.js';

export type {
  ProseTasteBenchmarkOptions,
  ProseTasteBenchmarkResult,
  ProseTasteBenchmarkSample,
  ProseTasteBenchmarkSampleResult,
  ProseTasteBenchmarkSplitLeakage,
  ProseTasteFrictionAnnotation,
  ProseTasteFrictionAnnotationCoverage,
  ProseTasteFrictionSeverity,
  ProseTasteReaderSegmentRepresentativeness,
  ProseTasteStyleHighlightAnnotation,
  ProseTasteStyleHighlightAnnotationCoverage,
  ProseTasteStyleHighlightQuality,
} from './prose-taste-benchmark.js';

// ============================================================================
// Reader Response Calibration Exports
// ============================================================================

export {
  evaluateReaderResponseCalibration,
} from './reader-response-calibration.js';

export type {
  AutomatedReaderQualityScores,
  ReaderResponseAdvocacyAnnotation,
  ReaderResponseAdvocacyEvidenceStatus,
  ReaderResponseBlindSpot,
  ReaderResponseCalibrationFailureType,
  ReaderResponseCalibrationOptions,
  ReaderResponseCalibrationResult,
  ReaderResponseCalibrationSample,
  ReaderResponseCalibrationSampleResult,
  ReaderResponseChapterRangeCoverage,
  ReaderResponseChapterRangeRequirement,
  ReaderResponseComparativePreferenceStatus,
  ReaderResponseContinuationBehaviorEvidenceStatus,
  ReaderResponseCohortRepresentativeness,
  ReaderResponseDimension,
  ReaderResponseDimensionIssue,
  ReaderResponseDropOffAnnotation,
  ReaderResponseDropOffEventType,
  ReaderResponseDropOffLocalizationEvidenceStatus,
  ReaderResponseDurableEngagementAction,
  ReaderResponseDurableEngagementAnnotation,
  ReaderResponseDurableEngagementEvidenceStatus,
  ReaderResponseFrictionAnnotation,
  ReaderResponseFrictionAnnotationCoverage,
  ReaderResponseFrictionAnnotationRepresentativeness,
  ReaderResponseFrictionSeverity,
  ReaderResponseGenreCoverage,
  ReaderResponsePanelConsensus,
  ReaderResponseRatingScale,
  ReaderResponseResonanceAnnotation,
  ReaderResponseResonanceEvidenceStatus,
  ReaderResponseSceneRecallAnnotation,
  ReaderResponseSceneRecallEvidenceStatus,
  ReaderResponseScoreConfidence,
  ReaderResponseScores,
} from './reader-response-calibration.js';

// ============================================================================
// Engagement Contract Exports
// ============================================================================

export {
  evaluateEngagementContract,
} from './engagement-contract.js';

export {
  evaluateEngagementBenchmark,
} from './engagement-benchmark.js';

export {
  evaluatePremiseAppealBenchmark,
} from './premise-appeal-benchmark.js';

export {
  evaluateCharacterRelationshipBenchmark,
} from './character-relationship-benchmark.js';

export {
  evaluateSeriesRetentionBenchmark,
  SERIES_RETENTION_EMOTIONAL_SIGNATURE_FAMILIES,
} from './series-retention-benchmark.js';

export {
  evaluateMasterpieceReadiness,
} from './masterpiece-readiness.js';

export type {
  EngagementContractInput,
  EngagementContractEvaluation,
  EngagementContractIssue,
  EngagementContractBreakdown,
  EngagementRevisionDirective,
  EngagementRevisionDirectivePriority,
  EngagementRevisionDirectiveTarget,
  EngagementIssueCode,
  EngagementIssueSeverity,
  ReaderPromiseContract,
  FunSpec,
  ChapterGuide,
  TensionCurvePeak,
  DesignWithReaderPromise,
  PlotWithFunSpec,
  ChapterReaderExperienceForEvaluation,
  ChapterSceneForEvaluation,
  ChapterWithReaderExperience,
} from './engagement-contract.js';

export type {
  EngagementBenchmarkCalibrationSplit,
  EngagementBenchmarkFailureType,
  EngagementBenchmarkOptions,
  EngagementPositiveQualityCode,
  EngagementBenchmarkResult,
  EngagementBenchmarkRoute,
  EngagementBenchmarkSample,
  EngagementBenchmarkSampleResult,
  EngagementBenchmarkSeriesCoverage,
  EngagementBenchmarkSplitCoverage,
  EngagementBenchmarkSplitLeakage,
} from './engagement-benchmark.js';

export type {
  PremiseAppealBenchmarkCoverage,
  PremiseAppealBenchmarkDimensionResult,
  PremiseAppealBenchmarkOptions,
  PremiseAppealBenchmarkResult,
  PremiseAppealBenchmarkSample,
  PremiseAppealBenchmarkSampleResult,
  PremiseAppealBenchmarkSplitCoverage,
  PremiseAppealBenchmarkSplitLeakage,
  PremiseAppealCalibrationSplit,
  PremiseAppealDimension,
  PremiseAppealFailureType,
  PremiseAppealPromise,
  PremiseAppealRatingScale,
  PremiseAppealReaderResponse,
} from './premise-appeal-benchmark.js';

export type {
  CharacterRelationshipBenchmarkCoverage,
  CharacterRelationshipBenchmarkDimensionResult,
  CharacterRelationshipBenchmarkOptions,
  CharacterRelationshipBenchmarkResult,
  CharacterRelationshipBenchmarkSample,
  CharacterRelationshipBenchmarkSampleResult,
  CharacterRelationshipBenchmarkSplitCoverage,
  CharacterRelationshipBenchmarkSplitLeakage,
  CharacterRelationshipCalibrationSplit,
  CharacterRelationshipDimension,
  CharacterRelationshipFailureType,
  CharacterRelationshipFocus,
  CharacterRelationshipRatingScale,
  CharacterRelationshipReaderResponse,
} from './character-relationship-benchmark.js';

export type {
  SeriesRetentionBenchmarkCoverage,
  SeriesRetentionBenchmarkOptions,
  SeriesRetentionBenchmarkResult,
  SeriesRetentionBenchmarkSample,
  SeriesRetentionBenchmarkSampleResult,
  SeriesRetentionBenchmarkSplitCoverage,
  SeriesRetentionBenchmarkSplitLeakage,
  SeriesRetentionCalibrationSplit,
  SeriesRetentionChapterResult,
  SeriesRetentionChapterSample,
  SeriesRetentionDimension,
  SeriesRetentionDimensionResult,
  SeriesRetentionEmotionalSignatureFamily,
  SeriesRetentionFailureType,
  SeriesRetentionRatingScale,
  SeriesRetentionReaderResponse,
} from './series-retention-benchmark.js';

export type {
  MasterpieceReadinessAreaConfig,
  MasterpieceReadinessAreaId,
  MasterpieceReadinessAreaInput,
  MasterpieceReadinessAreaResult,
  MasterpieceReadinessGap,
  MasterpieceReadinessOptions,
  MasterpieceReadinessResult,
  MasterpieceReadinessStatus,
} from './masterpiece-readiness.js';
