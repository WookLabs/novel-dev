/**
 * Reader Response Calibration
 *
 * Compares automated engagement scores against reader-panel response data.
 * This is intentionally separate from the manuscript evaluators: it measures
 * whether the system's gates are overconfident or too harsh against actual
 * reader reactions.
 *
 * @module quality/reader-response-calibration
 */

export type ReaderResponseDimension =
  | 'next-click'
  | 'attention'
  | 'emotional-engagement'
  | 'mental-imagery'
  | 'transportation'
  | 'character-attachment'
  | 'relationship-investment'
  | 'novelty'
  | 'surprise'
  | 'resonance'
  | 'scene-recall'
  | 'recommendation-intent'
  | 'bookmark-intent'
  | 'return-intent'
  | 'purchase-intent'
  | 'binge-intent'
  | 'interest'
  | 'suspense'
  | 'beauty'
  | 'amusement'
  | 'overall-liking';

export type ReaderResponseCalibrationFailureType =
  | 'auto-false-positive'
  | 'auto-false-negative'
  | 'auto-overestimate'
  | 'auto-underestimate';

export type ReaderResponsePanelConsensus =
  | 'unknown'
  | 'clear'
  | 'mixed'
  | 'polarized';

export type ReaderResponseCohortRepresentativeness =
  | 'unknown'
  | 'balanced'
  | 'narrow';

export type ReaderResponseScoreConfidence =
  | 'unknown'
  | 'precise'
  | 'wide';

export type ReaderResponseFrictionAnnotationCoverage =
  | 'none'
  | 'covered'
  | 'partial'
  | 'missing';

export type ReaderResponseFrictionAnnotationRepresentativeness =
  | 'unknown'
  | 'balanced'
  | 'narrow';

export type ReaderResponsePanelProtocolQuality =
  | 'unknown'
  | 'strong'
  | 'weak';

export type ReaderResponseAnnotationReliabilityStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseAnnotationReliabilityMetric =
  | 'percent-agreement'
  | 'cohen-kappa'
  | 'fleiss-kappa'
  | 'krippendorff-alpha'
  | 'icc'
  | 'other';

export type ReaderResponseComparativePreferenceStatus =
  | 'none'
  | 'strong'
  | 'weak';

export type ReaderResponseRevisionOutcomeStatus =
  | 'none'
  | 'improved'
  | 'weak'
  | 'regressed';

export type ReaderResponseSceneRecallEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseAdvocacyEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseDurableEngagementEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseContinuationBehaviorEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseResonanceEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseDelayedMemoryEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseRetentionEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseDropOffLocalizationEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseTensionTraceEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseNarrativeForecastEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseLineQuoteEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponsePayoffFairnessEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseRespondentSource =
  | 'human-target-reader'
  | 'human-general-reader'
  | 'mixed-human-synthetic'
  | 'synthetic-ai'
  | 'author-estimate'
  | 'unknown';

export type ReaderResponseHumanReaderEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseDataQualityEvidenceStatus =
  | 'none'
  | 'weak'
  | 'usable';

export type ReaderResponseDurableEngagementAction =
  | 'bookmark'
  | 'follow'
  | 'return'
  | 'purchase'
  | 'binge';

export type ReaderResponseLineQuoteFunction =
  | 'voice'
  | 'theme'
  | 'emotion'
  | 'character'
  | 'plot'
  | 'world'
  | 'humor'
  | 'image'
  | 'other';

export type ReaderResponseCalibrationSplit =
  | 'calibration'
  | 'validation'
  | 'holdout';

export interface ReaderResponseScores {
  nextClick?: number;
  attention?: number;
  emotionalEngagement?: number;
  mentalImagery?: number;
  transportation?: number;
  characterAttachment?: number;
  relationshipInvestment?: number;
  novelty?: number;
  surprise?: number;
  resonance?: number;
  sceneRecall?: number;
  recommendationIntent?: number;
  bookmarkIntent?: number;
  returnIntent?: number;
  purchaseIntent?: number;
  bingeIntent?: number;
  interest?: number;
  suspense?: number;
  beauty?: number;
  amusement?: number;
  overallLiking?: number;
}

export interface AutomatedReaderQualityScores {
  engagementScore: number;
  gatePassed?: boolean;
  proseTasteScore?: number;
  issueCodes?: string[];
}

export interface ReaderResponseRatingScale {
  min: number;
  max: number;
}

export interface ReaderResponseCalibrationSample {
  id: string;
  label?: string;
  genre?: string;
  chapter?: number;
  calibrationSplit?: ReaderResponseCalibrationSplit;
  automated: AutomatedReaderQualityScores;
  reader: ReaderResponseScores;
  respondentCount?: number;
  ratingScale?: ReaderResponseRatingScale;
  evidence?: ReaderResponseSampleEvidence;
}

export interface ReaderResponseSampleEvidence {
  respondentSource?: ReaderResponseRespondentSource;
  humanRespondentCount?: number;
  syntheticRespondentCount?: number;
  authorEstimateCount?: number;
  manuscriptWordCount?: number;
  manuscriptCharacterCount?: number;
  medianReadTimeSeconds?: number;
  minimumReadTimeSeconds?: number;
  speedingResponseCount?: number;
  straightLiningResponseCount?: number;
  duplicateResponseCount?: number;
  botSuspectedResponseCount?: number;
  lowQualityOpenEndedResponseCount?: number;
  inconsistentResponseCount?: number;
  qualityFlaggedResponseCount?: number;
  targetReaderCount?: number;
  targetReaderSegmentCount?: number;
  targetReaderSegmentCounts?: Record<string, number>;
  dominantReaderSegmentRatio?: number;
  startedReadCount?: number;
  completedReadCount?: number;
  dropOffCount?: number;
  skimmedReadCount?: number;
  qualitativeCommentCount?: number;
  frictionPointCount?: number;
  actionableFrictionPointCount?: number;
  rewriteSuggestionCount?: number;
  frictionAnnotations?: ReaderResponseFrictionAnnotation[];
  dropOffAnnotations?: ReaderResponseDropOffAnnotation[];
  annotationCoderCount?: number;
  annotationDoubleCodedCount?: number;
  annotationAgreementRate?: number;
  annotationReliabilityMetric?: ReaderResponseAnnotationReliabilityMetric;
  annotationCodebookVersion?: string;
  annotationAdjudicated?: boolean;
  annotationCoderBlinded?: boolean;
  unpromptedSceneRecallCount?: number;
  distinctiveSceneRecallCount?: number;
  sceneRecallAnnotations?: ReaderResponseSceneRecallAnnotation[];
  tensionTracePointCount?: number;
  tensionPeakCount?: number;
  tensionQuestionCount?: number;
  tensionTraceAnnotations?: ReaderResponseTensionTraceAnnotation[];
  forecastPredictionCount?: number;
  forecastDiversityCount?: number;
  forecastRevisionCount?: number;
  forecastMismatchCount?: number;
  forecastInflectionCount?: number;
  narrativeForecastAnnotations?: ReaderResponseNarrativeForecastAnnotation[];
  quoteRecallCount?: number;
  favoriteLineCount?: number;
  shareableLineCount?: number;
  lineQuoteAnnotations?: ReaderResponseLineQuoteAnnotation[];
  payoffSetupRecallCount?: number;
  payoffTriggerRecognitionCount?: number;
  payoffEarnedCount?: number;
  payoffRecontextualizationCount?: number;
  payoffEmotionalSatisfactionCount?: number;
  payoffFairnessAnnotations?: ReaderResponsePayoffFairnessAnnotation[];
  organicRecommendationCount?: number;
  discussionPromptCount?: number;
  advocacyAnnotations?: ReaderResponseAdvocacyAnnotation[];
  bookmarkCount?: number;
  followOrLibraryAddCount?: number;
  returnNextDayCount?: number;
  bingeReadIntentCount?: number;
  paidContinuationIntentCount?: number;
  durableEngagementAnnotations?: ReaderResponseDurableEngagementAnnotation[];
  nextChapterCtaImpressionCount?: number;
  nextChapterClickCount?: number;
  nextChapterOpenCount?: number;
  nextChapterReadStartCount?: number;
  lingeringEmotionCount?: number;
  reflectiveCommentCount?: number;
  personalMemoryOrMeaningCount?: number;
  resonanceAnnotations?: ReaderResponseResonanceAnnotation[];
  delayedFollowUpRespondentCount?: number;
  delayedFollowUpHours?: number;
  delayedSceneRecallCount?: number;
  delayedCharacterRecallCount?: number;
  delayedNextClickIntentCount?: number;
  delayedReturnIntentCount?: number;
  delayedPaidContinuationIntentCount?: number;
  delayedMemoryAnnotations?: ReaderResponseDelayedMemoryAnnotation[];
  readerScoreStandardDeviation?: number;
  highResponseCount?: number;
  neutralResponseCount?: number;
  lowResponseCount?: number;
  blindReading?: boolean;
  authorIdentityMasked?: boolean;
  priorExposureScreened?: boolean;
  unexcludedPriorExposureCount?: number;
  spoilerExposureScreened?: boolean;
  unexcludedSpoilerExposureCount?: number;
  neutralQuestionWording?: boolean;
  responseOptionOrderRandomized?: boolean;
  sampleOrderRandomized?: boolean;
  manuscriptOrderCounterbalanced?: boolean;
  maxSamplesPerRespondent?: number;
  orderBalanceRatio?: number;
  questionWordingDisclosed?: boolean;
  recruitmentMethodDisclosed?: boolean;
  recruitmentChannelCounts?: Record<string, number>;
  populationDefinitionDisclosed?: boolean;
  samplingFrameDisclosed?: boolean;
  fieldworkDatesDisclosed?: boolean;
  surveyModeDisclosed?: boolean;
  incentiveDisclosed?: boolean;
  attentionCheckPassCount?: number;
  excludedResponseCount?: number;
  comparativeReferenceLabel?: string;
  comparativePreferenceWinRate?: number;
  comparativePreferenceCurrentCount?: number;
  comparativePreferenceReferenceCount?: number;
  comparativePreferenceTieCount?: number;
  comparativePreferenceRespondentCount?: number;
  comparativeBlindPairwise?: boolean;
  comparativeSameReaderCohort?: boolean;
  comparativeQuestionWordingDisclosed?: boolean;
  revisionPairId?: string;
  revisionBaselineReaderScore?: number;
  revisionCurrentReaderScore?: number;
  revisionPreferenceRevisedCount?: number;
  revisionPreferenceBaselineCount?: number;
  revisionPreferenceTieCount?: number;
  revisionPreferenceRespondentCount?: number;
  revisionBlindComparison?: boolean;
  revisionSameReaderCohort?: boolean;
  revisionQuestionWordingDisclosed?: boolean;
  revisionGuardrailRegressionCount?: number;
}

export type ReaderResponseFrictionSeverity = 'minor' | 'major' | 'critical';

export type ReaderResponseDropOffEventType =
  | 'drop-off'
  | 'skim'
  | 'slowdown'
  | 'mind-wandering';

export interface ReaderResponseFrictionAnnotation {
  location?: string;
  quote?: string;
  dimension?: ReaderResponseDimension;
  reason: string;
  severity?: ReaderResponseFrictionSeverity;
  rewriteSuggestion?: string;
  readerCount?: number;
  readerSegment?: string;
}

export interface ReaderResponseDropOffAnnotation {
  location?: string;
  eventType: ReaderResponseDropOffEventType;
  lastCompletedLocation?: string;
  triggerQuote?: string;
  reason: string;
  readerCount?: number;
  readerSegment?: string;
  suggestedRevision?: string;
}

export interface ReaderResponseSceneRecallAnnotation {
  location?: string;
  rememberedMoment: string;
  distinctiveDetail?: string;
  readerCount?: number;
  readerSegment?: string;
}

export interface ReaderResponseTensionTraceAnnotation {
  location?: string;
  experiencedTension: string;
  suspenseLevel?: number;
  curiosityLevel?: number;
  surpriseLevel?: number;
  narrativeQuestion?: string;
  stakeOrRisk?: string;
  readerCount?: number;
  readerSegment?: string;
  reason?: string;
}

export interface ReaderResponseNarrativeForecastAnnotation {
  location?: string;
  initialPrediction: string;
  revisedPrediction?: string;
  actualOutcome?: string;
  predictionMismatch?: boolean;
  predictionShift?: string;
  surpriseOrTensionReason?: string;
  readerCount?: number;
  readerSegment?: string;
}

export interface ReaderResponseLineQuoteAnnotation {
  location?: string;
  quotedLine: string;
  appealReason?: string;
  shareReason?: string;
  lineFunction?: ReaderResponseLineQuoteFunction;
  readerCount?: number;
  readerSegment?: string;
}

export interface ReaderResponsePayoffFairnessAnnotation {
  location?: string;
  payoffMoment: string;
  rememberedSetup?: string;
  triggerOrReveal?: string;
  changedInterpretation?: string;
  earnedReason?: string;
  arbitraryOrCheatReason?: string;
  emotionalPayoffReason?: string;
  readerCount?: number;
  readerSegment?: string;
}

export interface ReaderResponseAdvocacyAnnotation {
  location?: string;
  shareTrigger: string;
  recommendedAudience?: string;
  discussionPrompt?: string;
  readerCount?: number;
  readerSegment?: string;
}

export interface ReaderResponseDurableEngagementAnnotation {
  location?: string;
  commitmentTrigger: string;
  intendedAction?: ReaderResponseDurableEngagementAction;
  readerCount?: number;
  readerSegment?: string;
  reason?: string;
}

export interface ReaderResponseResonanceAnnotation {
  location?: string;
  lingeringEmotion: string;
  reflectiveQuestion?: string;
  rememberedImage?: string;
  personalMeaning?: string;
  readerCount?: number;
  readerSegment?: string;
}

export interface ReaderResponseDelayedMemoryAnnotation {
  location?: string;
  delayedRememberedMoment: string;
  delayedCharacterOrRelationship?: string;
  delayedNextQuestion?: string;
  returnOrPurchaseReason?: string;
  readerCount?: number;
  readerSegment?: string;
}

export interface ReaderResponseCalibrationOptions {
  highAutomatedThreshold?: number;
  lowAutomatedThreshold?: number;
  lowReaderThreshold?: number;
  highReaderThreshold?: number;
  severeGapThreshold?: number;
  weakDimensionThreshold?: number;
  minimumRespondentCount?: number;
  minimumSampleCountForTuning?: number;
  minimumTargetReaderRatio?: number;
  minimumHumanRespondentRatio?: number;
  requireHumanReaderEvidenceForTuning?: boolean;
  minimumMedianReadTimeSeconds?: number;
  maximumMedianReadingWordsPerMinute?: number;
  maximumMinimumReadingWordsPerMinute?: number;
  maximumMedianReadingCharactersPerMinute?: number;
  maximumMinimumReadingCharactersPerMinute?: number;
  requireLengthNormalizedReadTimeForTuning?: boolean;
  maximumSpeedingResponseRatio?: number;
  maximumStraightLiningResponseRatio?: number;
  maximumDuplicateResponseRatio?: number;
  maximumBotSuspectedResponseRatio?: number;
  maximumLowQualityOpenEndedRatio?: number;
  maximumInconsistentResponseRatio?: number;
  maximumQualityFlaggedResponseRatio?: number;
  requireResponseDataQualityForTuning?: boolean;
  minimumStartedReadCount?: number;
  minimumPanelCompletionRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  requireRetentionEvidenceForTuning?: boolean;
  minimumDropOffAnnotationCount?: number;
  minimumActionableDropOffAnnotationCount?: number;
  requireDropOffLocalizationEvidenceForTuning?: boolean;
  minimumCompletedReadRatio?: number;
  minimumQualitativeCommentRatio?: number;
  minimumFrictionPointCount?: number;
  minimumActionableFrictionPointCount?: number;
  minimumRewriteSuggestionCount?: number;
  minimumStructuredFrictionAnnotationCount?: number;
  requireStructuredFrictionAnnotationsForTuning?: boolean;
  requireFrictionAnnotationsForWeakDimensionsForTuning?: boolean;
  minimumFrictionAnnotationSegmentCount?: number;
  maximumDominantFrictionAnnotationSegmentRatio?: number;
  requireFrictionAnnotationRepresentativenessForTuning?: boolean;
  minimumAnnotationCoderCount?: number;
  minimumAnnotationDoubleCodedCount?: number;
  minimumAnnotationAgreementRate?: number;
  requireAnnotationReliabilityForTuning?: boolean;
  minimumUnpromptedSceneRecallRatio?: number;
  minimumDistinctiveSceneRecallRatio?: number;
  minimumSceneRecallAnnotationCount?: number;
  requireSceneRecallEvidenceForTuning?: boolean;
  minimumTensionTraceRatio?: number;
  minimumTensionPeakRatio?: number;
  minimumTensionQuestionRatio?: number;
  minimumTensionTraceAnnotationCount?: number;
  requireTensionTraceEvidenceForTuning?: boolean;
  minimumForecastPredictionRatio?: number;
  minimumForecastDiversityCount?: number;
  minimumForecastRevisionRatio?: number;
  minimumForecastMismatchRatio?: number;
  minimumNarrativeForecastAnnotationCount?: number;
  requireNarrativeForecastEvidenceForTuning?: boolean;
  minimumQuoteRecallRatio?: number;
  minimumFavoriteLineRatio?: number;
  minimumShareableLineRatio?: number;
  minimumLineQuoteAnnotationCount?: number;
  requireLineQuoteEvidenceForTuning?: boolean;
  minimumPayoffSetupRecallRatio?: number;
  minimumPayoffTriggerRecognitionRatio?: number;
  minimumPayoffEarnedRatio?: number;
  minimumPayoffRecontextualizationRatio?: number;
  minimumPayoffEmotionalSatisfactionRatio?: number;
  minimumPayoffFairnessAnnotationCount?: number;
  requirePayoffFairnessEvidenceForTuning?: boolean;
  minimumOrganicRecommendationRatio?: number;
  minimumDiscussionPromptRatio?: number;
  minimumAdvocacyAnnotationCount?: number;
  requireAdvocacyEvidenceForTuning?: boolean;
  minimumBookmarkRatio?: number;
  minimumReturnIntentRatio?: number;
  minimumPaidContinuationIntentRatio?: number;
  minimumDurableEngagementAnnotationCount?: number;
  requireDurableEngagementEvidenceForTuning?: boolean;
  minimumContinuationBehaviorImpressionCount?: number;
  minimumNextChapterClickThroughRatio?: number;
  minimumNextChapterOpenRatio?: number;
  minimumNextChapterReadStartRatio?: number;
  requireContinuationBehaviorEvidenceForTuning?: boolean;
  minimumLingeringEmotionRatio?: number;
  minimumReflectiveMeaningRatio?: number;
  minimumResonanceAnnotationCount?: number;
  requireResonanceEvidenceForTuning?: boolean;
  minimumDelayedFollowUpRespondentRatio?: number;
  minimumDelayedFollowUpHours?: number;
  minimumDelayedSceneRecallRatio?: number;
  minimumDelayedCharacterRecallRatio?: number;
  minimumDelayedContinuationIntentRatio?: number;
  minimumDelayedMemoryAnnotationCount?: number;
  requireDelayedMemoryEvidenceForTuning?: boolean;
  maximumReaderScoreStandardDeviation?: number;
  maximumReaderScoreMarginOfError?: number;
  minimumConsensusMajorityRatio?: number;
  minimumPolarizedGroupRatio?: number;
  requirePanelConsensusForTuning?: boolean;
  requireReaderScoreConfidenceForTuning?: boolean;
  minimumTargetReaderSegmentCount?: number;
  requiredTargetReaderSegments?: string[];
  minimumRespondentsPerRequiredTargetSegment?: number;
  requireTargetReaderSegmentQuotasForTuning?: boolean;
  maximumDominantReaderSegmentRatio?: number;
  requireCohortRepresentativenessForTuning?: boolean;
  requiredRecruitmentChannels?: string[];
  minimumRespondentsPerRequiredRecruitmentChannel?: number;
  maximumDominantRecruitmentChannelRatio?: number;
  requireRecruitmentChannelDiversityForTuning?: boolean;
  minimumAttentionCheckPassRatio?: number;
  maximumSamplesPerRespondent?: number;
  minimumOrderBalanceRatio?: number;
  requirePanelProtocolForTuning?: boolean;
  minimumComparativePreferenceWinRate?: number;
  minimumComparativePreferenceRespondentCount?: number;
  requireComparativePreferenceForTuning?: boolean;
  minimumRevisionLift?: number;
  minimumRevisionPreferenceWinRate?: number;
  minimumRevisionPreferenceRespondentCount?: number;
  maximumRevisionGuardrailRegressionCount?: number;
  requireRevisionOutcomeEvidenceForTuning?: boolean;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  requireHoldoutForTuning?: boolean;
  requiredGenres?: string[];
  minimumSamplesPerGenre?: number;
  minimumUsableSamplesPerGenre?: number;
  minimumSeriesLength?: number;
  minimumUsableSeriesLength?: number;
  requiredChapterRanges?: ReaderResponseChapterRangeRequirement[];
  weights?: Partial<Record<ReaderResponseDimension, number>>;
}

export interface ReaderResponseChapterRangeRequirement {
  id: string;
  label?: string;
  minChapter: number;
  maxChapter?: number;
  requiredGenres?: string[];
  minimumSamples?: number;
  minimumUsableSamples?: number;
}

export interface ReaderResponseDimensionIssue {
  dimension: ReaderResponseDimension;
  score: number;
  threshold: number;
  message: string;
}

export interface ReaderResponseCalibrationSampleResult {
  id: string;
  label?: string;
  genre?: string;
  chapter?: number;
  calibrationSplit?: ReaderResponseCalibrationSplit;
  automatedScore: number;
  readerCompositeScore: number;
  scoreGap: number;
  respondentCount: number;
  reliability: 'none' | 'weak' | 'usable';
  humanReaderEvidence: ReaderResponseHumanReaderEvidenceStatus;
  humanReaderEvidenceIssues: string[];
  respondentSource: ReaderResponseRespondentSource;
  humanRespondentCount: number;
  syntheticRespondentCount: number;
  authorEstimateCount: number;
  humanRespondentRatio: number;
  responseDataQuality: ReaderResponseDataQualityEvidenceStatus;
  responseDataQualityIssues: string[];
  manuscriptWordCount?: number;
  manuscriptCharacterCount?: number;
  medianReadingWordsPerMinute?: number;
  minimumReadingWordsPerMinute?: number;
  medianReadingCharactersPerMinute?: number;
  minimumReadingCharactersPerMinute?: number;
  medianReadTimeSeconds?: number;
  minimumReadTimeSeconds?: number;
  speedingResponseCount: number;
  straightLiningResponseCount: number;
  duplicateResponseCount: number;
  botSuspectedResponseCount: number;
  lowQualityOpenEndedResponseCount: number;
  inconsistentResponseCount: number;
  qualityFlaggedResponseCount: number;
  qualityFlaggedResponseRatio: number;
  evidenceQuality: 'none' | 'weak' | 'usable';
  actionabilityScore: number;
  evidenceIssues: string[];
  frictionAnnotations: ReaderResponseFrictionAnnotation[];
  retentionEvidence: ReaderResponseRetentionEvidenceStatus;
  retentionEvidenceIssues: string[];
  startedReadCount: number;
  completedReadCount: number;
  dropOffCount: number;
  skimmedReadCount: number;
  panelCompletionRate?: number;
  dropOffRatio?: number;
  skimmedReadRatio?: number;
  dropOffLocalizationEvidence: ReaderResponseDropOffLocalizationEvidenceStatus;
  dropOffLocalizationEvidenceIssues: string[];
  dropOffAnnotations: ReaderResponseDropOffAnnotation[];
  dropOffAnnotationCount: number;
  actionableDropOffAnnotationCount: number;
  sceneRecallEvidence: ReaderResponseSceneRecallEvidenceStatus;
  sceneRecallEvidenceIssues: string[];
  sceneRecallAnnotations: ReaderResponseSceneRecallAnnotation[];
  unpromptedSceneRecallCount: number;
  distinctiveSceneRecallCount: number;
  tensionTraceEvidence: ReaderResponseTensionTraceEvidenceStatus;
  tensionTraceEvidenceIssues: string[];
  tensionTraceAnnotations: ReaderResponseTensionTraceAnnotation[];
  tensionTracePointCount: number;
  tensionPeakCount: number;
  tensionQuestionCount: number;
  narrativeForecastEvidence: ReaderResponseNarrativeForecastEvidenceStatus;
  narrativeForecastEvidenceIssues: string[];
  narrativeForecastAnnotations: ReaderResponseNarrativeForecastAnnotation[];
  forecastPredictionCount: number;
  forecastDiversityCount: number;
  forecastRevisionCount: number;
  forecastMismatchCount: number;
  forecastInflectionCount: number;
  lineQuoteEvidence: ReaderResponseLineQuoteEvidenceStatus;
  lineQuoteEvidenceIssues: string[];
  lineQuoteAnnotations: ReaderResponseLineQuoteAnnotation[];
  quoteRecallCount: number;
  favoriteLineCount: number;
  shareableLineCount: number;
  payoffFairnessEvidence: ReaderResponsePayoffFairnessEvidenceStatus;
  payoffFairnessEvidenceIssues: string[];
  payoffFairnessAnnotations: ReaderResponsePayoffFairnessAnnotation[];
  payoffSetupRecallCount: number;
  payoffTriggerRecognitionCount: number;
  payoffEarnedCount: number;
  payoffRecontextualizationCount: number;
  payoffEmotionalSatisfactionCount: number;
  advocacyEvidence: ReaderResponseAdvocacyEvidenceStatus;
  advocacyEvidenceIssues: string[];
  advocacyAnnotations: ReaderResponseAdvocacyAnnotation[];
  organicRecommendationCount: number;
  discussionPromptCount: number;
  durableEngagementEvidence: ReaderResponseDurableEngagementEvidenceStatus;
  durableEngagementEvidenceIssues: string[];
  durableEngagementAnnotations: ReaderResponseDurableEngagementAnnotation[];
  bookmarkCount: number;
  followOrLibraryAddCount: number;
  returnNextDayCount: number;
  bingeReadIntentCount: number;
  paidContinuationIntentCount: number;
  continuationBehaviorEvidence: ReaderResponseContinuationBehaviorEvidenceStatus;
  continuationBehaviorEvidenceIssues: string[];
  nextChapterCtaImpressionCount: number;
  nextChapterClickCount: number;
  nextChapterOpenCount: number;
  nextChapterReadStartCount: number;
  nextChapterClickThroughRatio?: number;
  nextChapterOpenRatio?: number;
  nextChapterReadStartRatio?: number;
  resonanceEvidence: ReaderResponseResonanceEvidenceStatus;
  resonanceEvidenceIssues: string[];
  resonanceAnnotations: ReaderResponseResonanceAnnotation[];
  lingeringEmotionCount: number;
  reflectiveMeaningCount: number;
  delayedMemoryEvidence: ReaderResponseDelayedMemoryEvidenceStatus;
  delayedMemoryEvidenceIssues: string[];
  delayedMemoryAnnotations: ReaderResponseDelayedMemoryAnnotation[];
  delayedFollowUpRespondentCount: number;
  delayedFollowUpHours?: number;
  delayedSceneRecallCount: number;
  delayedCharacterRecallCount: number;
  delayedContinuationIntentCount: number;
  delayedNextClickIntentCount: number;
  delayedReturnIntentCount: number;
  delayedPaidContinuationIntentCount: number;
  frictionAnnotationCoverage: ReaderResponseFrictionAnnotationCoverage;
  frictionAnnotationCoverageIssues: string[];
  frictionAnnotationRepresentativeness: ReaderResponseFrictionAnnotationRepresentativeness;
  frictionAnnotationRepresentativenessIssues: string[];
  annotationReliability: ReaderResponseAnnotationReliabilityStatus;
  annotationReliabilityIssues: string[];
  annotationCoderCount: number;
  annotationDoubleCodedCount: number;
  annotationAgreementRate?: number;
  annotationReliabilityMetric?: ReaderResponseAnnotationReliabilityMetric;
  annotationCodebookVersion?: string;
  annotationAdjudicated?: boolean;
  annotationCoderBlinded?: boolean;
  panelConsensus: ReaderResponsePanelConsensus;
  panelConsensusIssues: string[];
  readerScoreStandardError?: number;
  readerScoreMarginOfError?: number;
  readerScoreConfidenceInterval?: {
    lower: number;
    upper: number;
  };
  readerScoreConfidence: ReaderResponseScoreConfidence;
  readerScoreConfidenceIssues: string[];
  cohortRepresentativeness: ReaderResponseCohortRepresentativeness;
  cohortRepresentativenessIssues: string[];
  targetReaderSegmentCounts: Record<string, number>;
  panelProtocolQuality: ReaderResponsePanelProtocolQuality;
  panelProtocolIssues: string[];
  recruitmentChannelCounts: Record<string, number>;
  comparativePreferenceStatus: ReaderResponseComparativePreferenceStatus;
  comparativePreferenceWinRate?: number;
  comparativePreferenceMargin?: number;
  comparativePreferenceRespondentCount?: number;
  comparativePreferenceIssues: string[];
  revisionOutcomeEvidence: ReaderResponseRevisionOutcomeStatus;
  revisionOutcomeIssues: string[];
  revisionPairId?: string;
  revisionBaselineReaderScore?: number;
  revisionCurrentReaderScore?: number;
  revisionLift?: number;
  revisionPreferenceWinRate?: number;
  revisionPreferenceRespondentCount?: number;
  revisionPreferenceRevisedCount: number;
  revisionPreferenceBaselineCount: number;
  revisionPreferenceTieCount: number;
  revisionGuardrailRegressionCount: number;
  failureType?: ReaderResponseCalibrationFailureType;
  dimensionIssues: ReaderResponseDimensionIssue[];
}

export interface ReaderResponseBlindSpot {
  dimension: ReaderResponseDimension;
  affectedSamples: number;
  averageScore: number;
  message: string;
}

export type ReaderResponseGateTuningSuggestionCode =
  | 'collect-more-reader-evidence'
  | 'tighten-automated-high-pass'
  | 'loosen-reader-loved-low-score-route'
  | 'increase-reader-dimension-sensitivity'
  | 'hold-current-gates';

export type ReaderResponseGateTuningAction =
  | 'collect-more-evidence'
  | 'tighten'
  | 'loosen'
  | 'increase-sensitivity'
  | 'hold';

export interface ReaderResponseGateTuningSuggestion {
  code: ReaderResponseGateTuningSuggestionCode;
  action: ReaderResponseGateTuningAction;
  target: string;
  currentValue?: number;
  suggestedValue?: number;
  evidenceSampleIds: string[];
  evidenceSummary: string;
  rationale: string;
  safety: string;
}

export type ReaderResponseEvidenceCollectionPriority =
  | 'critical'
  | 'major'
  | 'minor';

export interface ReaderResponseEvidenceCollectionTask {
  id: string;
  priority: ReaderResponseEvidenceCollectionPriority;
  target: string;
  currentValue?: number | string;
  requiredValue?: number | string;
  sampleIds: string[];
  action: string;
  rationale: string;
}

export interface ReaderResponseGenreCoverage {
  totalSamples: number;
  usableSamples: number;
  chapters: number[];
  longestConsecutiveRun: number;
  usableChapters: number[];
  usableLongestConsecutiveRun: number;
}

export interface ReaderResponseChapterRangeCoverage {
  id: string;
  label?: string;
  minChapter: number;
  maxChapter?: number;
  requiredGenres: string[];
  minimumSamples: number;
  minimumUsableSamples: number;
  totalSamples: number;
  usableSamples: number;
  genres: string[];
  usableGenres: string[];
  missingRequiredGenres: string[];
  missingRequiredUsableGenres: string[];
}

export interface ReaderResponseSplitCoverage {
  calibrationSamples: number;
  validationSamples: number;
  holdoutSamples: number;
  unassignedSamples: number;
  usableCalibrationSamples: number;
  usableValidationSamples: number;
  usableHoldoutSamples: number;
  usableUnassignedSamples: number;
}

export interface ReaderResponseCalibrationResult {
  total: number;
  calibrationScore: number;
  meanAbsoluteError: number;
  meanSignedGap: number;
  correlation?: number;
  falsePositiveCount: number;
  falseNegativeCount: number;
  overestimateCount: number;
  underestimateCount: number;
  lowReliabilityCount: number;
  lowHumanReaderEvidenceCount: number;
  humanReaderEvidenceCount: number;
  lowResponseDataQualityCount: number;
  responseDataQualityEvidenceCount: number;
  lowActionabilityCount: number;
  lowAnnotationReliabilityCount: number;
  annotationReliabilityEvidenceCount: number;
  lowRetentionEvidenceCount: number;
  retentionEvidenceCount: number;
  lowDropOffLocalizationEvidenceCount: number;
  dropOffLocalizationEvidenceCount: number;
  lowSceneRecallEvidenceCount: number;
  sceneRecallEvidenceCount: number;
  lowTensionTraceEvidenceCount: number;
  tensionTraceEvidenceCount: number;
  lowNarrativeForecastEvidenceCount: number;
  narrativeForecastEvidenceCount: number;
  lowLineQuoteEvidenceCount: number;
  lineQuoteEvidenceCount: number;
  lowPayoffFairnessEvidenceCount: number;
  payoffFairnessEvidenceCount: number;
  lowAdvocacyEvidenceCount: number;
  advocacyEvidenceCount: number;
  lowDurableEngagementEvidenceCount: number;
  durableEngagementEvidenceCount: number;
  lowContinuationBehaviorEvidenceCount: number;
  continuationBehaviorEvidenceCount: number;
  lowResonanceEvidenceCount: number;
  resonanceEvidenceCount: number;
  lowDelayedMemoryEvidenceCount: number;
  delayedMemoryEvidenceCount: number;
  lowConsensusCount: number;
  lowConfidenceCount: number;
  lowRepresentativenessCount: number;
  lowProtocolQualityCount: number;
  missingComparativePreferenceCount: number;
  weakComparativePreferenceCount: number;
  comparativePreferenceEvidenceCount: number;
  comparativePreferenceAverageWinRate?: number;
  revisionOutcomeEvidenceCount: number;
  revisionImprovementCount: number;
  revisionRegressionCount: number;
  lowRevisionOutcomeEvidenceCount: number;
  splitCoverage: ReaderResponseSplitCoverage;
  underSampledHoldoutSamples: boolean;
  underSampledUsableHoldoutSamples: boolean;
  genreCoverage: Record<string, ReaderResponseGenreCoverage>;
  missingRequiredGenres: string[];
  underSampledRequiredGenres: string[];
  underSampledUsableRequiredGenres: string[];
  missingRequiredSeriesGenres: string[];
  missingRequiredUsableSeriesGenres: string[];
  chapterRangeCoverage: ReaderResponseChapterRangeCoverage[];
  underSampledRequiredChapterRanges: string[];
  underSampledUsableRequiredChapterRanges: string[];
  missingRequiredChapterRangeGenres: string[];
  missingRequiredUsableChapterRangeGenres: string[];
  readyForGateTuning: boolean;
  blindSpots: ReaderResponseBlindSpot[];
  gateTuningSuggestions: ReaderResponseGateTuningSuggestion[];
  evidenceCollectionPlan: ReaderResponseEvidenceCollectionTask[];
  recommendations: string[];
  sampleResults: ReaderResponseCalibrationSampleResult[];
}

type ResolvedReaderResponseCalibrationOptions =
  Required<Omit<
    ReaderResponseCalibrationOptions,
    'weights' | 'requiredGenres' | 'requiredTargetReaderSegments' | 'requiredRecruitmentChannels' | 'requiredChapterRanges'
  >> & {
    requiredGenres: string[];
    requiredTargetReaderSegments: string[];
    requiredRecruitmentChannels: string[];
    requiredChapterRanges: ReaderResponseChapterRangeRequirement[];
  };

const DEFAULT_OPTIONS: ResolvedReaderResponseCalibrationOptions = {
  highAutomatedThreshold: 90,
  lowAutomatedThreshold: 75,
  lowReaderThreshold: 75,
  highReaderThreshold: 85,
  severeGapThreshold: 15,
  weakDimensionThreshold: 70,
  minimumRespondentCount: 3,
  minimumSampleCountForTuning: 5,
  minimumTargetReaderRatio: 0.6,
  minimumHumanRespondentRatio: 0.8,
  requireHumanReaderEvidenceForTuning: true,
  minimumMedianReadTimeSeconds: 60,
  maximumMedianReadingWordsPerMinute: 650,
  maximumMinimumReadingWordsPerMinute: 1200,
  maximumMedianReadingCharactersPerMinute: 1600,
  maximumMinimumReadingCharactersPerMinute: 3000,
  requireLengthNormalizedReadTimeForTuning: true,
  maximumSpeedingResponseRatio: 0.1,
  maximumStraightLiningResponseRatio: 0.1,
  maximumDuplicateResponseRatio: 0,
  maximumBotSuspectedResponseRatio: 0,
  maximumLowQualityOpenEndedRatio: 0.15,
  maximumInconsistentResponseRatio: 0.15,
  maximumQualityFlaggedResponseRatio: 0.2,
  requireResponseDataQualityForTuning: true,
  minimumStartedReadCount: 3,
  minimumPanelCompletionRate: 0.8,
  maximumDropOffRatio: 0.2,
  maximumSkimmedReadRatio: 0.2,
  requireRetentionEvidenceForTuning: true,
  minimumDropOffAnnotationCount: 1,
  minimumActionableDropOffAnnotationCount: 1,
  requireDropOffLocalizationEvidenceForTuning: true,
  minimumCompletedReadRatio: 0.8,
  minimumQualitativeCommentRatio: 0.5,
  minimumFrictionPointCount: 1,
  minimumActionableFrictionPointCount: 1,
  minimumRewriteSuggestionCount: 1,
  minimumStructuredFrictionAnnotationCount: 1,
  requireStructuredFrictionAnnotationsForTuning: true,
  requireFrictionAnnotationsForWeakDimensionsForTuning: true,
  minimumFrictionAnnotationSegmentCount: 2,
  maximumDominantFrictionAnnotationSegmentRatio: 0.7,
  requireFrictionAnnotationRepresentativenessForTuning: true,
  minimumAnnotationCoderCount: 2,
  minimumAnnotationDoubleCodedCount: 2,
  minimumAnnotationAgreementRate: 0.8,
  requireAnnotationReliabilityForTuning: true,
  minimumUnpromptedSceneRecallRatio: 0.4,
  minimumDistinctiveSceneRecallRatio: 0.25,
  minimumSceneRecallAnnotationCount: 1,
  requireSceneRecallEvidenceForTuning: true,
  minimumTensionTraceRatio: 0.4,
  minimumTensionPeakRatio: 0.25,
  minimumTensionQuestionRatio: 0.25,
  minimumTensionTraceAnnotationCount: 1,
  requireTensionTraceEvidenceForTuning: true,
  minimumForecastPredictionRatio: 0.4,
  minimumForecastDiversityCount: 2,
  minimumForecastRevisionRatio: 0.2,
  minimumForecastMismatchRatio: 0.2,
  minimumNarrativeForecastAnnotationCount: 1,
  requireNarrativeForecastEvidenceForTuning: true,
  minimumQuoteRecallRatio: 0.25,
  minimumFavoriteLineRatio: 0.2,
  minimumShareableLineRatio: 0.15,
  minimumLineQuoteAnnotationCount: 1,
  requireLineQuoteEvidenceForTuning: true,
  minimumPayoffSetupRecallRatio: 0.3,
  minimumPayoffTriggerRecognitionRatio: 0.25,
  minimumPayoffEarnedRatio: 0.35,
  minimumPayoffRecontextualizationRatio: 0.2,
  minimumPayoffEmotionalSatisfactionRatio: 0.3,
  minimumPayoffFairnessAnnotationCount: 1,
  requirePayoffFairnessEvidenceForTuning: true,
  minimumOrganicRecommendationRatio: 0.3,
  minimumDiscussionPromptRatio: 0.25,
  minimumAdvocacyAnnotationCount: 1,
  requireAdvocacyEvidenceForTuning: true,
  minimumBookmarkRatio: 0.3,
  minimumReturnIntentRatio: 0.3,
  minimumPaidContinuationIntentRatio: 0.15,
  minimumDurableEngagementAnnotationCount: 1,
  requireDurableEngagementEvidenceForTuning: true,
  minimumContinuationBehaviorImpressionCount: 3,
  minimumNextChapterClickThroughRatio: 0.3,
  minimumNextChapterOpenRatio: 0.25,
  minimumNextChapterReadStartRatio: 0.2,
  requireContinuationBehaviorEvidenceForTuning: true,
  minimumLingeringEmotionRatio: 0.3,
  minimumReflectiveMeaningRatio: 0.2,
  minimumResonanceAnnotationCount: 1,
  requireResonanceEvidenceForTuning: true,
  minimumDelayedFollowUpRespondentRatio: 0.5,
  minimumDelayedFollowUpHours: 20,
  minimumDelayedSceneRecallRatio: 0.25,
  minimumDelayedCharacterRecallRatio: 0.2,
  minimumDelayedContinuationIntentRatio: 0.25,
  minimumDelayedMemoryAnnotationCount: 1,
  requireDelayedMemoryEvidenceForTuning: true,
  maximumReaderScoreStandardDeviation: 22,
  maximumReaderScoreMarginOfError: 10,
  minimumConsensusMajorityRatio: 0.6,
  minimumPolarizedGroupRatio: 0.25,
  requirePanelConsensusForTuning: true,
  requireReaderScoreConfidenceForTuning: true,
  minimumTargetReaderSegmentCount: 2,
  requiredTargetReaderSegments: [],
  minimumRespondentsPerRequiredTargetSegment: 1,
  requireTargetReaderSegmentQuotasForTuning: true,
  maximumDominantReaderSegmentRatio: 0.7,
  requireCohortRepresentativenessForTuning: true,
  requiredRecruitmentChannels: [],
  minimumRespondentsPerRequiredRecruitmentChannel: 1,
  maximumDominantRecruitmentChannelRatio: 0.85,
  requireRecruitmentChannelDiversityForTuning: true,
  minimumAttentionCheckPassRatio: 0.8,
  maximumSamplesPerRespondent: 3,
  minimumOrderBalanceRatio: 0.8,
  requirePanelProtocolForTuning: true,
  minimumComparativePreferenceWinRate: 0.55,
  minimumComparativePreferenceRespondentCount: 3,
  requireComparativePreferenceForTuning: false,
  minimumRevisionLift: 5,
  minimumRevisionPreferenceWinRate: 0.55,
  minimumRevisionPreferenceRespondentCount: 3,
  maximumRevisionGuardrailRegressionCount: 0,
  requireRevisionOutcomeEvidenceForTuning: false,
  minimumHoldoutSampleCount: 1,
  minimumUsableHoldoutSampleCount: 1,
  requireHoldoutForTuning: true,
  requiredGenres: [],
  minimumSamplesPerGenre: 0,
  minimumUsableSamplesPerGenre: 0,
  minimumSeriesLength: 0,
  minimumUsableSeriesLength: 0,
  requiredChapterRanges: [],
};

const DEFAULT_WEIGHTS: Record<ReaderResponseDimension, number> = {
  'next-click': 0.24,
  attention: 0.12,
  'emotional-engagement': 0.14,
  'mental-imagery': 0.10,
  transportation: 0.14,
  'character-attachment': 0.10,
  'relationship-investment': 0.08,
  novelty: 0.08,
  surprise: 0.08,
  resonance: 0.10,
  'scene-recall': 0.10,
  'recommendation-intent': 0.10,
  'bookmark-intent': 0.10,
  'return-intent': 0.12,
  'purchase-intent': 0.08,
  'binge-intent': 0.10,
  interest: 0.10,
  suspense: 0.08,
  beauty: 0.04,
  amusement: 0.04,
  'overall-liking': 0.10,
};

export function evaluateReaderResponseCalibration(
  samples: ReaderResponseCalibrationSample[],
  options: ReaderResponseCalibrationOptions = {}
): ReaderResponseCalibrationResult {
  const optionOverrides = Object.fromEntries(
    Object.entries(options).filter(([, value]) => value !== undefined)
  ) as ReaderResponseCalibrationOptions;
  const resolvedOptions: ResolvedReaderResponseCalibrationOptions = {
    ...DEFAULT_OPTIONS,
    ...optionOverrides,
    requiredGenres: uniqueStrings(options.requiredGenres ?? DEFAULT_OPTIONS.requiredGenres),
    requiredTargetReaderSegments: uniqueStrings(
      options.requiredTargetReaderSegments ?? DEFAULT_OPTIONS.requiredTargetReaderSegments
    ),
    requiredRecruitmentChannels: uniqueStrings(
      options.requiredRecruitmentChannels ?? DEFAULT_OPTIONS.requiredRecruitmentChannels
    ),
    requiredChapterRanges: normalizeChapterRangeRequirements(
      options.requiredChapterRanges ?? DEFAULT_OPTIONS.requiredChapterRanges
    ),
  };
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };
  const sampleResults = samples.map(sample => evaluateSample(sample, resolvedOptions, weights));
  const gaps = sampleResults.map(result => result.scoreGap);
  const absoluteGaps = gaps.map(gap => Math.abs(gap));
  const falsePositiveCount = sampleResults.filter(result => result.failureType === 'auto-false-positive').length;
  const falseNegativeCount = sampleResults.filter(result => result.failureType === 'auto-false-negative').length;
  const overestimateCount = sampleResults.filter(result => result.failureType === 'auto-overestimate').length;
  const underestimateCount = sampleResults.filter(result => result.failureType === 'auto-underestimate').length;
  const lowReliabilityCount = sampleResults.filter(result => result.reliability !== 'usable').length;
  const lowHumanReaderEvidenceCount = sampleResults
    .filter(result => result.humanReaderEvidence !== 'usable').length;
  const humanReaderEvidenceCount = sampleResults
    .filter(result => result.humanReaderEvidence !== 'none').length;
  const lowResponseDataQualityCount = sampleResults
    .filter(result => result.responseDataQuality !== 'usable').length;
  const responseDataQualityEvidenceCount = sampleResults
    .filter(result => result.responseDataQuality !== 'none').length;
  const lowActionabilityCount = sampleResults.filter(result => result.evidenceQuality !== 'usable').length;
  const lowAnnotationReliabilityCount = sampleResults
    .filter(result => result.annotationReliability !== 'usable').length;
  const annotationReliabilityEvidenceCount = sampleResults
    .filter(result => result.annotationReliability !== 'none').length;
  const lowRetentionEvidenceCount = sampleResults
    .filter(result => result.retentionEvidence !== 'usable').length;
  const retentionEvidenceCount = sampleResults
    .filter(result => result.retentionEvidence !== 'none').length;
  const lowDropOffLocalizationEvidenceCount = sampleResults
    .filter(result => result.dropOffLocalizationEvidence !== 'usable').length;
  const dropOffLocalizationEvidenceCount = sampleResults
    .filter(result => result.dropOffLocalizationEvidence !== 'none').length;
  const lowSceneRecallEvidenceCount = sampleResults
    .filter(result => result.sceneRecallEvidence !== 'usable').length;
  const sceneRecallEvidenceCount = sampleResults
    .filter(result => result.sceneRecallEvidence !== 'none').length;
  const lowTensionTraceEvidenceCount = sampleResults
    .filter(result => result.tensionTraceEvidence !== 'usable').length;
  const tensionTraceEvidenceCount = sampleResults
    .filter(result => result.tensionTraceEvidence !== 'none').length;
  const lowNarrativeForecastEvidenceCount = sampleResults
    .filter(result => result.narrativeForecastEvidence !== 'usable').length;
  const narrativeForecastEvidenceCount = sampleResults
    .filter(result => result.narrativeForecastEvidence !== 'none').length;
  const lowLineQuoteEvidenceCount = sampleResults
    .filter(result => result.lineQuoteEvidence !== 'usable').length;
  const lineQuoteEvidenceCount = sampleResults
    .filter(result => result.lineQuoteEvidence !== 'none').length;
  const lowPayoffFairnessEvidenceCount = sampleResults
    .filter(result => result.payoffFairnessEvidence !== 'usable').length;
  const payoffFairnessEvidenceCount = sampleResults
    .filter(result => result.payoffFairnessEvidence !== 'none').length;
  const lowAdvocacyEvidenceCount = sampleResults
    .filter(result => result.advocacyEvidence !== 'usable').length;
  const advocacyEvidenceCount = sampleResults
    .filter(result => result.advocacyEvidence !== 'none').length;
  const lowDurableEngagementEvidenceCount = sampleResults
    .filter(result => result.durableEngagementEvidence !== 'usable').length;
  const durableEngagementEvidenceCount = sampleResults
    .filter(result => result.durableEngagementEvidence !== 'none').length;
  const lowContinuationBehaviorEvidenceCount = sampleResults
    .filter(result => result.continuationBehaviorEvidence !== 'usable').length;
  const continuationBehaviorEvidenceCount = sampleResults
    .filter(result => result.continuationBehaviorEvidence !== 'none').length;
  const lowResonanceEvidenceCount = sampleResults
    .filter(result => result.resonanceEvidence !== 'usable').length;
  const resonanceEvidenceCount = sampleResults
    .filter(result => result.resonanceEvidence !== 'none').length;
  const lowDelayedMemoryEvidenceCount = sampleResults
    .filter(result => result.delayedMemoryEvidence !== 'usable').length;
  const delayedMemoryEvidenceCount = sampleResults
    .filter(result => result.delayedMemoryEvidence !== 'none').length;
  const lowConsensusCount = sampleResults.filter(result => result.panelConsensus !== 'clear').length;
  const lowConfidenceCount = sampleResults
    .filter(result => result.readerScoreConfidence !== 'precise').length;
  const lowRepresentativenessCount = sampleResults
    .filter(result => result.cohortRepresentativeness !== 'balanced').length;
  const lowProtocolQualityCount = sampleResults
    .filter(result => result.panelProtocolQuality !== 'strong').length;
  const missingComparativePreferenceCount = sampleResults
    .filter(result => result.comparativePreferenceStatus === 'none').length;
  const weakComparativePreferenceCount = sampleResults
    .filter(result => result.comparativePreferenceStatus === 'weak').length;
  const comparativePreferenceEvidenceCount = sampleResults
    .filter(result => result.comparativePreferenceStatus !== 'none').length;
  const comparativePreferenceWinRates = sampleResults
    .map(result => result.comparativePreferenceWinRate)
    .filter((value): value is number => value !== undefined);
  const comparativePreferenceAverageWinRate = comparativePreferenceWinRates.length > 0
    ? roundScore(average(comparativePreferenceWinRates))
    : undefined;
  const comparativePreferenceBlockerCount = resolvedOptions.requireComparativePreferenceForTuning
    ? sampleResults.filter(result => result.comparativePreferenceStatus !== 'strong').length
    : weakComparativePreferenceCount;
  const revisionOutcomeEvidenceCount = sampleResults
    .filter(result => result.revisionOutcomeEvidence !== 'none').length;
  const revisionImprovementCount = sampleResults
    .filter(result => result.revisionOutcomeEvidence === 'improved').length;
  const revisionRegressionCount = sampleResults
    .filter(result => result.revisionOutcomeEvidence === 'regressed').length;
  const lowRevisionOutcomeEvidenceCount = sampleResults
    .filter(result => result.revisionOutcomeEvidence !== 'improved' && (
      resolvedOptions.requireRevisionOutcomeEvidenceForTuning ||
      result.revisionOutcomeEvidence !== 'none'
    )).length;
  const meanAbsoluteError = average(absoluteGaps);
  const meanSignedGap = average(gaps);
  const genreCoverage = countGenreCoverage(sampleResults, resolvedOptions);
  const missingRequiredGenres = resolvedOptions.requiredGenres
    .filter(genre => genreCoverage[genre] === undefined);
  const underSampledRequiredGenres = resolvedOptions.requiredGenres
    .filter(genre => (genreCoverage[genre]?.totalSamples ?? 0) < resolvedOptions.minimumSamplesPerGenre);
  const underSampledUsableRequiredGenres = resolvedOptions.requiredGenres
    .filter(genre => (genreCoverage[genre]?.usableSamples ?? 0) < resolvedOptions.minimumUsableSamplesPerGenre);
  const missingRequiredSeriesGenres = resolvedOptions.minimumSeriesLength === 0
    ? []
    : resolvedOptions.requiredGenres.filter(
        genre => (genreCoverage[genre]?.longestConsecutiveRun ?? 0) < resolvedOptions.minimumSeriesLength
      );
  const missingRequiredUsableSeriesGenres = resolvedOptions.minimumUsableSeriesLength === 0
    ? []
    : resolvedOptions.requiredGenres.filter(
        genre => (genreCoverage[genre]?.usableLongestConsecutiveRun ?? 0) < resolvedOptions.minimumUsableSeriesLength
      );
  const chapterRangeCoverage = countChapterRangeCoverage(
    sampleResults,
    resolvedOptions.requiredChapterRanges,
    resolvedOptions
  );
  const underSampledRequiredChapterRanges = chapterRangeCoverage
    .filter(coverage => coverage.totalSamples < coverage.minimumSamples)
    .map(coverage => coverage.id);
  const underSampledUsableRequiredChapterRanges = chapterRangeCoverage
    .filter(coverage => coverage.usableSamples < coverage.minimumUsableSamples)
    .map(coverage => coverage.id);
  const missingRequiredChapterRangeGenres = chapterRangeCoverage
    .flatMap(coverage => coverage.missingRequiredGenres.map(genre => `${coverage.id}:${genre}`));
  const missingRequiredUsableChapterRangeGenres = chapterRangeCoverage
    .flatMap(coverage => coverage.missingRequiredUsableGenres.map(genre => `${coverage.id}:${genre}`));
  const splitCoverage = countSplitCoverage(sampleResults, resolvedOptions);
  const underSampledHoldoutSamples = resolvedOptions.requireHoldoutForTuning &&
    splitCoverage.holdoutSamples < resolvedOptions.minimumHoldoutSampleCount;
  const underSampledUsableHoldoutSamples = resolvedOptions.requireHoldoutForTuning &&
    splitCoverage.usableHoldoutSamples < resolvedOptions.minimumUsableHoldoutSampleCount;
  const calibrationScore = calculateCalibrationScore(
    meanAbsoluteError,
    falsePositiveCount,
    falseNegativeCount,
    overestimateCount,
    underestimateCount,
    lowReliabilityCount,
    lowHumanReaderEvidenceCount,
    lowResponseDataQualityCount,
    lowActionabilityCount,
    lowAnnotationReliabilityCount,
    lowRetentionEvidenceCount,
    lowDropOffLocalizationEvidenceCount,
    lowConsensusCount,
    lowConfidenceCount,
    lowRepresentativenessCount,
    lowProtocolQualityCount,
    comparativePreferenceBlockerCount,
    lowRevisionOutcomeEvidenceCount,
    revisionRegressionCount,
    lowSceneRecallEvidenceCount,
    lowTensionTraceEvidenceCount,
    lowNarrativeForecastEvidenceCount,
    lowLineQuoteEvidenceCount,
    lowPayoffFairnessEvidenceCount,
    lowAdvocacyEvidenceCount,
    lowDurableEngagementEvidenceCount,
    lowContinuationBehaviorEvidenceCount,
    lowResonanceEvidenceCount,
    lowDelayedMemoryEvidenceCount,
    underSampledHoldoutSamples,
    underSampledUsableHoldoutSamples
  );
  const blindSpots = summarizeBlindSpots(sampleResults, resolvedOptions.weakDimensionThreshold);
  const readyForGateTuning = samples.length >= resolvedOptions.minimumSampleCountForTuning &&
    lowReliabilityCount === 0 &&
    (!resolvedOptions.requireHumanReaderEvidenceForTuning || lowHumanReaderEvidenceCount === 0) &&
    (!resolvedOptions.requireResponseDataQualityForTuning || lowResponseDataQualityCount === 0) &&
    lowActionabilityCount === 0 &&
    (!resolvedOptions.requireAnnotationReliabilityForTuning || lowAnnotationReliabilityCount === 0) &&
    (!resolvedOptions.requireRetentionEvidenceForTuning || lowRetentionEvidenceCount === 0) &&
    (!resolvedOptions.requireDropOffLocalizationEvidenceForTuning || lowDropOffLocalizationEvidenceCount === 0) &&
    (!resolvedOptions.requireSceneRecallEvidenceForTuning || lowSceneRecallEvidenceCount === 0) &&
    (!resolvedOptions.requireTensionTraceEvidenceForTuning || lowTensionTraceEvidenceCount === 0) &&
    (!resolvedOptions.requireNarrativeForecastEvidenceForTuning || lowNarrativeForecastEvidenceCount === 0) &&
    (!resolvedOptions.requireLineQuoteEvidenceForTuning || lowLineQuoteEvidenceCount === 0) &&
    (!resolvedOptions.requirePayoffFairnessEvidenceForTuning || lowPayoffFairnessEvidenceCount === 0) &&
    (!resolvedOptions.requireAdvocacyEvidenceForTuning || lowAdvocacyEvidenceCount === 0) &&
    (!resolvedOptions.requireDurableEngagementEvidenceForTuning || lowDurableEngagementEvidenceCount === 0) &&
    (!resolvedOptions.requireContinuationBehaviorEvidenceForTuning || lowContinuationBehaviorEvidenceCount === 0) &&
    (!resolvedOptions.requireResonanceEvidenceForTuning || lowResonanceEvidenceCount === 0) &&
    (!resolvedOptions.requireDelayedMemoryEvidenceForTuning || lowDelayedMemoryEvidenceCount === 0) &&
    (!resolvedOptions.requirePanelConsensusForTuning || lowConsensusCount === 0) &&
    (!resolvedOptions.requireReaderScoreConfidenceForTuning || lowConfidenceCount === 0) &&
    (!resolvedOptions.requireCohortRepresentativenessForTuning || lowRepresentativenessCount === 0) &&
    (!resolvedOptions.requirePanelProtocolForTuning || lowProtocolQualityCount === 0) &&
    (!resolvedOptions.requireComparativePreferenceForTuning || comparativePreferenceBlockerCount === 0) &&
    (!resolvedOptions.requireRevisionOutcomeEvidenceForTuning || lowRevisionOutcomeEvidenceCount === 0) &&
    revisionRegressionCount === 0 &&
    !underSampledHoldoutSamples &&
    !underSampledUsableHoldoutSamples &&
    missingRequiredGenres.length === 0 &&
    underSampledRequiredGenres.length === 0 &&
    underSampledUsableRequiredGenres.length === 0 &&
    missingRequiredSeriesGenres.length === 0 &&
    missingRequiredUsableSeriesGenres.length === 0 &&
    underSampledRequiredChapterRanges.length === 0 &&
    underSampledUsableRequiredChapterRanges.length === 0 &&
    missingRequiredChapterRangeGenres.length === 0 &&
    missingRequiredUsableChapterRangeGenres.length === 0;
  const gateTuningSuggestions = buildGateTuningSuggestions(
    sampleResults,
    blindSpots,
    readyForGateTuning,
    resolvedOptions,
    weights
  );
  const evidenceCollectionPlan = buildEvidenceCollectionPlan(sampleResults, resolvedOptions, {
    splitCoverage,
    missingRequiredGenres,
    underSampledRequiredGenres,
    underSampledUsableRequiredGenres,
    missingRequiredSeriesGenres,
    missingRequiredUsableSeriesGenres,
    chapterRangeCoverage,
    underSampledRequiredChapterRanges,
    underSampledUsableRequiredChapterRanges,
    missingRequiredChapterRangeGenres,
    missingRequiredUsableChapterRangeGenres,
    underSampledHoldoutSamples,
    underSampledUsableHoldoutSamples,
  });

  return {
    total: samples.length,
    calibrationScore,
    meanAbsoluteError,
    meanSignedGap,
    correlation: calculateCorrelation(
      sampleResults.map(result => result.automatedScore),
      sampleResults.map(result => result.readerCompositeScore)
    ),
    falsePositiveCount,
    falseNegativeCount,
    overestimateCount,
    underestimateCount,
    lowReliabilityCount,
    lowHumanReaderEvidenceCount,
    humanReaderEvidenceCount,
    lowResponseDataQualityCount,
    responseDataQualityEvidenceCount,
    lowActionabilityCount,
    lowAnnotationReliabilityCount,
    annotationReliabilityEvidenceCount,
    lowRetentionEvidenceCount,
    retentionEvidenceCount,
    lowDropOffLocalizationEvidenceCount,
    dropOffLocalizationEvidenceCount,
    lowSceneRecallEvidenceCount,
    sceneRecallEvidenceCount,
    lowTensionTraceEvidenceCount,
    tensionTraceEvidenceCount,
    lowNarrativeForecastEvidenceCount,
    narrativeForecastEvidenceCount,
    lowLineQuoteEvidenceCount,
    lineQuoteEvidenceCount,
    lowPayoffFairnessEvidenceCount,
    payoffFairnessEvidenceCount,
    lowAdvocacyEvidenceCount,
    advocacyEvidenceCount,
    lowDurableEngagementEvidenceCount,
    durableEngagementEvidenceCount,
    lowContinuationBehaviorEvidenceCount,
    continuationBehaviorEvidenceCount,
    lowResonanceEvidenceCount,
    resonanceEvidenceCount,
    lowDelayedMemoryEvidenceCount,
    delayedMemoryEvidenceCount,
    lowConsensusCount,
    lowConfidenceCount,
    lowRepresentativenessCount,
    lowProtocolQualityCount,
    missingComparativePreferenceCount,
    weakComparativePreferenceCount,
    comparativePreferenceEvidenceCount,
    comparativePreferenceAverageWinRate,
    revisionOutcomeEvidenceCount,
    revisionImprovementCount,
    revisionRegressionCount,
    lowRevisionOutcomeEvidenceCount,
    splitCoverage,
    underSampledHoldoutSamples,
    underSampledUsableHoldoutSamples,
    genreCoverage,
    missingRequiredGenres,
    underSampledRequiredGenres,
    underSampledUsableRequiredGenres,
    missingRequiredSeriesGenres,
    missingRequiredUsableSeriesGenres,
    chapterRangeCoverage,
    underSampledRequiredChapterRanges,
    underSampledUsableRequiredChapterRanges,
    missingRequiredChapterRangeGenres,
    missingRequiredUsableChapterRangeGenres,
    readyForGateTuning,
    blindSpots,
    gateTuningSuggestions,
    evidenceCollectionPlan,
    recommendations: buildRecommendations(
      sampleResults,
      blindSpots,
      readyForGateTuning,
      resolvedOptions
    ),
    sampleResults,
  };
}

function evaluateSample(
  sample: ReaderResponseCalibrationSample,
  options: ResolvedReaderResponseCalibrationOptions,
  weights: Record<ReaderResponseDimension, number>
): ReaderResponseCalibrationSampleResult {
  const ratingScale = sample.ratingScale ?? { min: 0, max: 100 };
  const normalizedReader = normalizeReaderScores(sample.reader, ratingScale);
  const readerCompositeScore = calculateReaderComposite(normalizedReader, weights);
  const automatedScore = clampScore(sample.automated.engagementScore);
  const scoreGap = roundScore(automatedScore - readerCompositeScore);
  const respondentCount = sample.respondentCount ?? 0;
  const reliability = determineReliability(respondentCount, options.minimumRespondentCount);
  const dimensionIssues = detectDimensionIssues(normalizedReader, options.weakDimensionThreshold);
  const failureType = determineFailureType(
    automatedScore,
    readerCompositeScore,
    scoreGap,
    options
  );
  const frictionAnnotations = normalizeFrictionAnnotations(sample.evidence?.frictionAnnotations);
  const sceneRecallAnnotations = normalizeSceneRecallAnnotations(sample.evidence?.sceneRecallAnnotations);
  const advocacyAnnotations = normalizeAdvocacyAnnotations(sample.evidence?.advocacyAnnotations);
  const durableEngagementAnnotations = normalizeDurableEngagementAnnotations(
    sample.evidence?.durableEngagementAnnotations
  );
  const resonanceAnnotations = normalizeResonanceAnnotations(sample.evidence?.resonanceAnnotations);
  const delayedMemoryAnnotations = normalizeDelayedMemoryAnnotations(sample.evidence?.delayedMemoryAnnotations);
  const tensionTraceAnnotations = normalizeTensionTraceAnnotations(sample.evidence?.tensionTraceAnnotations);
  const narrativeForecastAnnotations = normalizeNarrativeForecastAnnotations(
    sample.evidence?.narrativeForecastAnnotations
  );
  const lineQuoteAnnotations = normalizeLineQuoteAnnotations(sample.evidence?.lineQuoteAnnotations);
  const payoffFairnessAnnotations = normalizePayoffFairnessAnnotations(
    sample.evidence?.payoffFairnessAnnotations
  );
  const dropOffAnnotations = normalizeDropOffAnnotations(sample.evidence?.dropOffAnnotations);
  const retentionEvidence = evaluateRetentionEvidence(
    sample.evidence,
    respondentCount,
    options
  );
  const dropOffLocalizationEvidence = evaluateDropOffLocalizationEvidence(
    retentionEvidence,
    dropOffAnnotations,
    options
  );
  const humanReaderEvidence = evaluateHumanReaderEvidence(
    sample.evidence,
    respondentCount,
    options
  );
  const responseDataQuality = evaluateResponseDataQuality(
    sample.evidence,
    respondentCount,
    options
  );
  const sceneRecallEvidence = evaluateSceneRecallEvidence(
    sample.evidence,
    respondentCount,
    sceneRecallAnnotations,
    options
  );
  const tensionTraceEvidence = evaluateTensionTraceEvidence(
    sample.evidence,
    respondentCount,
    tensionTraceAnnotations,
    options
  );
  const narrativeForecastEvidence = evaluateNarrativeForecastEvidence(
    sample.evidence,
    respondentCount,
    narrativeForecastAnnotations,
    options
  );
  const lineQuoteEvidence = evaluateLineQuoteEvidence(
    sample.evidence,
    respondentCount,
    lineQuoteAnnotations,
    options
  );
  const payoffFairnessEvidence = evaluatePayoffFairnessEvidence(
    sample.evidence,
    respondentCount,
    payoffFairnessAnnotations,
    options
  );
  const advocacyEvidence = evaluateAdvocacyEvidence(
    sample.evidence,
    respondentCount,
    advocacyAnnotations,
    options
  );
  const durableEngagementEvidence = evaluateDurableEngagementEvidence(
    sample.evidence,
    respondentCount,
    durableEngagementAnnotations,
    options
  );
  const continuationBehaviorEvidence = evaluateContinuationBehaviorEvidence(
    sample.evidence,
    options
  );
  const resonanceEvidence = evaluateResonanceEvidence(
    sample.evidence,
    respondentCount,
    resonanceAnnotations,
    options
  );
  const delayedMemoryEvidence = evaluateDelayedMemoryEvidence(
    sample.evidence,
    respondentCount,
    delayedMemoryAnnotations,
    options
  );
  const revisionOutcome = evaluateRevisionOutcomeEvidence(
    sample.evidence,
    respondentCount,
    readerCompositeScore,
    options
  );
  const frictionAnnotationCoverage = evaluateFrictionAnnotationCoverage(
    frictionAnnotations,
    dimensionIssues
  );
  const frictionAnnotationRepresentativeness = evaluateFrictionAnnotationRepresentativeness(
    frictionAnnotations,
    sample.evidence,
    options
  );
  const annotationReliability = evaluateAnnotationReliabilityEvidence(
    sample.evidence,
    options
  );
  const evidence = evaluateSampleEvidence(
    sample.evidence,
    respondentCount,
    options,
    dimensionIssues,
    frictionAnnotations,
    frictionAnnotationCoverage,
    frictionAnnotationRepresentativeness,
    annotationReliability,
    humanReaderEvidence,
    responseDataQuality,
    retentionEvidence,
    dropOffLocalizationEvidence,
    sceneRecallEvidence,
    tensionTraceEvidence,
    narrativeForecastEvidence,
    lineQuoteEvidence,
    payoffFairnessEvidence,
    advocacyEvidence,
    durableEngagementEvidence,
    continuationBehaviorEvidence,
    resonanceEvidence,
    delayedMemoryEvidence,
    revisionOutcome
  );
  const panelConsensus = evaluatePanelConsensus(sample.evidence, respondentCount, options);
  const scoreConfidence = evaluateReaderScoreConfidence(
    sample.evidence,
    respondentCount,
    readerCompositeScore,
    options
  );
  const cohortRepresentativeness = evaluateCohortRepresentativeness(
    sample.evidence,
    respondentCount,
    options
  );
  const panelProtocol = evaluatePanelProtocolQuality(
    sample.evidence,
    respondentCount,
    options
  );
  const comparativePreference = evaluateComparativePreference(
    sample.evidence,
    respondentCount,
    options
  );

  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre?.trim() || undefined,
    chapter: sample.chapter,
    calibrationSplit: sample.calibrationSplit,
    automatedScore,
    readerCompositeScore,
    scoreGap,
    respondentCount,
    reliability,
    humanReaderEvidence: humanReaderEvidence.status,
    humanReaderEvidenceIssues: humanReaderEvidence.issues,
    respondentSource: humanReaderEvidence.respondentSource,
    humanRespondentCount: humanReaderEvidence.humanRespondentCount,
    syntheticRespondentCount: humanReaderEvidence.syntheticRespondentCount,
    authorEstimateCount: humanReaderEvidence.authorEstimateCount,
    humanRespondentRatio: humanReaderEvidence.humanRespondentRatio,
    responseDataQuality: responseDataQuality.status,
    responseDataQualityIssues: responseDataQuality.issues,
    manuscriptWordCount: responseDataQuality.manuscriptWordCount,
    manuscriptCharacterCount: responseDataQuality.manuscriptCharacterCount,
    medianReadingWordsPerMinute: responseDataQuality.medianReadingWordsPerMinute,
    minimumReadingWordsPerMinute: responseDataQuality.minimumReadingWordsPerMinute,
    medianReadingCharactersPerMinute: responseDataQuality.medianReadingCharactersPerMinute,
    minimumReadingCharactersPerMinute: responseDataQuality.minimumReadingCharactersPerMinute,
    medianReadTimeSeconds: responseDataQuality.medianReadTimeSeconds,
    minimumReadTimeSeconds: responseDataQuality.minimumReadTimeSeconds,
    speedingResponseCount: responseDataQuality.speedingResponseCount,
    straightLiningResponseCount: responseDataQuality.straightLiningResponseCount,
    duplicateResponseCount: responseDataQuality.duplicateResponseCount,
    botSuspectedResponseCount: responseDataQuality.botSuspectedResponseCount,
    lowQualityOpenEndedResponseCount: responseDataQuality.lowQualityOpenEndedResponseCount,
    inconsistentResponseCount: responseDataQuality.inconsistentResponseCount,
    qualityFlaggedResponseCount: responseDataQuality.qualityFlaggedResponseCount,
    qualityFlaggedResponseRatio: responseDataQuality.qualityFlaggedResponseRatio,
    evidenceQuality: evidence.quality,
    actionabilityScore: evidence.score,
    evidenceIssues: evidence.issues,
    frictionAnnotations,
    retentionEvidence: retentionEvidence.status,
    retentionEvidenceIssues: retentionEvidence.issues,
    startedReadCount: retentionEvidence.startedReadCount,
    completedReadCount: retentionEvidence.completedReadCount,
    dropOffCount: retentionEvidence.dropOffCount,
    skimmedReadCount: retentionEvidence.skimmedReadCount,
    panelCompletionRate: retentionEvidence.completionRate,
    dropOffRatio: retentionEvidence.dropOffRatio,
    skimmedReadRatio: retentionEvidence.skimmedReadRatio,
    dropOffLocalizationEvidence: dropOffLocalizationEvidence.status,
    dropOffLocalizationEvidenceIssues: dropOffLocalizationEvidence.issues,
    dropOffAnnotations,
    dropOffAnnotationCount: dropOffLocalizationEvidence.annotationCount,
    actionableDropOffAnnotationCount: dropOffLocalizationEvidence.actionableAnnotationCount,
    sceneRecallEvidence: sceneRecallEvidence.status,
    sceneRecallEvidenceIssues: sceneRecallEvidence.issues,
    sceneRecallAnnotations,
    unpromptedSceneRecallCount: sceneRecallEvidence.unpromptedCount,
    distinctiveSceneRecallCount: sceneRecallEvidence.distinctiveCount,
    tensionTraceEvidence: tensionTraceEvidence.status,
    tensionTraceEvidenceIssues: tensionTraceEvidence.issues,
    tensionTraceAnnotations,
    tensionTracePointCount: tensionTraceEvidence.tracePointCount,
    tensionPeakCount: tensionTraceEvidence.peakCount,
    tensionQuestionCount: tensionTraceEvidence.questionCount,
    narrativeForecastEvidence: narrativeForecastEvidence.status,
    narrativeForecastEvidenceIssues: narrativeForecastEvidence.issues,
    narrativeForecastAnnotations,
    forecastPredictionCount: narrativeForecastEvidence.predictionCount,
    forecastDiversityCount: narrativeForecastEvidence.diversityCount,
    forecastRevisionCount: narrativeForecastEvidence.revisionCount,
    forecastMismatchCount: narrativeForecastEvidence.mismatchCount,
    forecastInflectionCount: narrativeForecastEvidence.inflectionCount,
    lineQuoteEvidence: lineQuoteEvidence.status,
    lineQuoteEvidenceIssues: lineQuoteEvidence.issues,
    lineQuoteAnnotations,
    quoteRecallCount: lineQuoteEvidence.quoteRecallCount,
    favoriteLineCount: lineQuoteEvidence.favoriteLineCount,
    shareableLineCount: lineQuoteEvidence.shareableLineCount,
    payoffFairnessEvidence: payoffFairnessEvidence.status,
    payoffFairnessEvidenceIssues: payoffFairnessEvidence.issues,
    payoffFairnessAnnotations,
    payoffSetupRecallCount: payoffFairnessEvidence.setupRecallCount,
    payoffTriggerRecognitionCount: payoffFairnessEvidence.triggerRecognitionCount,
    payoffEarnedCount: payoffFairnessEvidence.earnedCount,
    payoffRecontextualizationCount: payoffFairnessEvidence.recontextualizationCount,
    payoffEmotionalSatisfactionCount: payoffFairnessEvidence.emotionalSatisfactionCount,
    advocacyEvidence: advocacyEvidence.status,
    advocacyEvidenceIssues: advocacyEvidence.issues,
    advocacyAnnotations,
    organicRecommendationCount: advocacyEvidence.organicRecommendationCount,
    discussionPromptCount: advocacyEvidence.discussionPromptCount,
    durableEngagementEvidence: durableEngagementEvidence.status,
    durableEngagementEvidenceIssues: durableEngagementEvidence.issues,
    durableEngagementAnnotations,
    bookmarkCount: durableEngagementEvidence.bookmarkCount,
    followOrLibraryAddCount: durableEngagementEvidence.followOrLibraryAddCount,
    returnNextDayCount: durableEngagementEvidence.returnNextDayCount,
    bingeReadIntentCount: durableEngagementEvidence.bingeReadIntentCount,
    paidContinuationIntentCount: durableEngagementEvidence.paidContinuationIntentCount,
    continuationBehaviorEvidence: continuationBehaviorEvidence.status,
    continuationBehaviorEvidenceIssues: continuationBehaviorEvidence.issues,
    nextChapterCtaImpressionCount: continuationBehaviorEvidence.impressionCount,
    nextChapterClickCount: continuationBehaviorEvidence.clickCount,
    nextChapterOpenCount: continuationBehaviorEvidence.openCount,
    nextChapterReadStartCount: continuationBehaviorEvidence.readStartCount,
    nextChapterClickThroughRatio: continuationBehaviorEvidence.clickThroughRatio,
    nextChapterOpenRatio: continuationBehaviorEvidence.openRatio,
    nextChapterReadStartRatio: continuationBehaviorEvidence.readStartRatio,
    resonanceEvidence: resonanceEvidence.status,
    resonanceEvidenceIssues: resonanceEvidence.issues,
    resonanceAnnotations,
    lingeringEmotionCount: resonanceEvidence.lingeringEmotionCount,
    reflectiveMeaningCount: resonanceEvidence.reflectiveMeaningCount,
    delayedMemoryEvidence: delayedMemoryEvidence.status,
    delayedMemoryEvidenceIssues: delayedMemoryEvidence.issues,
    delayedMemoryAnnotations,
    delayedFollowUpRespondentCount: delayedMemoryEvidence.followUpRespondentCount,
    delayedFollowUpHours: delayedMemoryEvidence.followUpHours,
    delayedSceneRecallCount: delayedMemoryEvidence.sceneRecallCount,
    delayedCharacterRecallCount: delayedMemoryEvidence.characterRecallCount,
    delayedContinuationIntentCount: delayedMemoryEvidence.continuationIntentCount,
    delayedNextClickIntentCount: delayedMemoryEvidence.nextClickIntentCount,
    delayedReturnIntentCount: delayedMemoryEvidence.returnIntentCount,
    delayedPaidContinuationIntentCount: delayedMemoryEvidence.paidContinuationIntentCount,
    frictionAnnotationCoverage: frictionAnnotationCoverage.coverage,
    frictionAnnotationCoverageIssues: frictionAnnotationCoverage.issues,
    frictionAnnotationRepresentativeness: frictionAnnotationRepresentativeness.representativeness,
    frictionAnnotationRepresentativenessIssues: frictionAnnotationRepresentativeness.issues,
    annotationReliability: annotationReliability.status,
    annotationReliabilityIssues: annotationReliability.issues,
    annotationCoderCount: annotationReliability.coderCount,
    annotationDoubleCodedCount: annotationReliability.doubleCodedCount,
    annotationAgreementRate: annotationReliability.agreementRate,
    annotationReliabilityMetric: annotationReliability.metric,
    annotationCodebookVersion: annotationReliability.codebookVersion,
    annotationAdjudicated: annotationReliability.adjudicated,
    annotationCoderBlinded: annotationReliability.coderBlinded,
    panelConsensus: panelConsensus.consensus,
    panelConsensusIssues: panelConsensus.issues,
    readerScoreStandardError: scoreConfidence.standardError,
    readerScoreMarginOfError: scoreConfidence.marginOfError,
    readerScoreConfidenceInterval: scoreConfidence.interval,
    readerScoreConfidence: scoreConfidence.confidence,
    readerScoreConfidenceIssues: scoreConfidence.issues,
    cohortRepresentativeness: cohortRepresentativeness.representativeness,
    cohortRepresentativenessIssues: cohortRepresentativeness.issues,
    targetReaderSegmentCounts: cohortRepresentativeness.targetReaderSegmentCounts,
    panelProtocolQuality: panelProtocol.quality,
    panelProtocolIssues: panelProtocol.issues,
    recruitmentChannelCounts: panelProtocol.recruitmentChannelCounts,
    comparativePreferenceStatus: comparativePreference.status,
    comparativePreferenceWinRate: comparativePreference.winRate,
    comparativePreferenceMargin: comparativePreference.margin,
    comparativePreferenceRespondentCount: comparativePreference.respondentCount,
    comparativePreferenceIssues: comparativePreference.issues,
    revisionOutcomeEvidence: revisionOutcome.status,
    revisionOutcomeIssues: revisionOutcome.issues,
    revisionPairId: revisionOutcome.pairId,
    revisionBaselineReaderScore: revisionOutcome.baselineScore,
    revisionCurrentReaderScore: revisionOutcome.currentScore,
    revisionLift: revisionOutcome.lift,
    revisionPreferenceWinRate: revisionOutcome.preferenceWinRate,
    revisionPreferenceRespondentCount: revisionOutcome.preferenceRespondentCount,
    revisionPreferenceRevisedCount: revisionOutcome.preferenceRevisedCount,
    revisionPreferenceBaselineCount: revisionOutcome.preferenceBaselineCount,
    revisionPreferenceTieCount: revisionOutcome.preferenceTieCount,
    revisionGuardrailRegressionCount: revisionOutcome.guardrailRegressionCount,
    failureType,
    dimensionIssues,
  };
}

function evaluateRetentionEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseRetentionEvidenceStatus;
  score: number;
  issues: string[];
  startedReadCount: number;
  completedReadCount: number;
  dropOffCount: number;
  skimmedReadCount: number;
  completionRate?: number;
  dropOffRatio?: number;
  skimmedReadRatio?: number;
} {
  if (!evidence) {
    return {
      status: 'none',
      score: 0,
      issues: ['Reader sample lacks start/completion/drop-off/skimming retention evidence.'],
      startedReadCount: 0,
      completedReadCount: 0,
      dropOffCount: 0,
      skimmedReadCount: 0,
    };
  }

  const startedReadCount = normalizeNonNegativeInteger(evidence.startedReadCount);
  const completedReadCount = normalizeNonNegativeInteger(evidence.completedReadCount) ?? 0;
  const explicitDropOffCount = normalizeNonNegativeInteger(evidence.dropOffCount);
  const dropOffCount = explicitDropOffCount ??
    (startedReadCount !== undefined
      ? Math.max(0, startedReadCount - completedReadCount)
      : 0);
  const skimmedReadCount = normalizeNonNegativeInteger(evidence.skimmedReadCount) ?? 0;
  const hasRetentionEvidence =
    startedReadCount !== undefined ||
    explicitDropOffCount !== undefined ||
    evidence.skimmedReadCount !== undefined;

  if (!hasRetentionEvidence) {
    return {
      status: 'none',
      score: 0,
      issues: ['Reader sample lacks started_read_count, drop_off_count, or skimmed_read_count; completed-reader averages may hide abandonment.'],
      startedReadCount: 0,
      completedReadCount,
      dropOffCount,
      skimmedReadCount,
    };
  }

  const retentionDenominator = startedReadCount ?? (completedReadCount + dropOffCount);
  const completionRate = retentionDenominator > 0
    ? completedReadCount / retentionDenominator
    : undefined;
  const dropOffRatio = retentionDenominator > 0
    ? dropOffCount / retentionDenominator
    : undefined;
  const skimmedReadRatio = retentionDenominator > 0
    ? skimmedReadCount / retentionDenominator
    : respondentCount > 0
      ? skimmedReadCount / respondentCount
      : undefined;
  const issues: string[] = [];

  if (retentionDenominator < options.minimumStartedReadCount) {
    issues.push(
      `started reader count ${retentionDenominator} is below ${options.minimumStartedReadCount}.`
    );
  }
  if (startedReadCount !== undefined && completedReadCount > startedReadCount) {
    issues.push(
      `completed read count ${completedReadCount} exceeds started read count ${startedReadCount}.`
    );
  }
  if (startedReadCount !== undefined && dropOffCount > startedReadCount) {
    issues.push(
      `drop-off count ${dropOffCount} exceeds started read count ${startedReadCount}.`
    );
  }
  if (
    startedReadCount !== undefined &&
    explicitDropOffCount !== undefined &&
    completedReadCount + explicitDropOffCount > startedReadCount
  ) {
    issues.push(
      `completed plus drop-off counts ${completedReadCount + explicitDropOffCount} exceed started read count ${startedReadCount}.`
    );
  }
  if (completionRate === undefined) {
    issues.push('reader retention completion rate could not be calculated.');
  } else if (completionRate < options.minimumPanelCompletionRate) {
    issues.push(
      `panel completion rate ${roundScore(completionRate * 100)}% is below ${roundScore(options.minimumPanelCompletionRate * 100)}%.`
    );
  }
  if (dropOffRatio !== undefined && dropOffRatio > options.maximumDropOffRatio) {
    issues.push(
      `reader drop-off ratio ${roundScore(dropOffRatio * 100)}% exceeds ${roundScore(options.maximumDropOffRatio * 100)}%.`
    );
  }
  if (skimmedReadRatio !== undefined && skimmedReadRatio > options.maximumSkimmedReadRatio) {
    issues.push(
      `skimmed-read ratio ${roundScore(skimmedReadRatio * 100)}% exceeds ${roundScore(options.maximumSkimmedReadRatio * 100)}%.`
    );
  }

  const scoreParts = [
    calculateThresholdProgress(retentionDenominator, options.minimumStartedReadCount) * 25,
    completionRate === undefined
      ? 0
      : calculateThresholdProgress(completionRate, options.minimumPanelCompletionRate) * 35,
    dropOffRatio === undefined
      ? 20
      : calculateInverseThresholdProgress(dropOffRatio, options.maximumDropOffRatio) * 20,
    skimmedReadRatio === undefined
      ? 20
      : calculateInverseThresholdProgress(skimmedReadRatio, options.maximumSkimmedReadRatio) * 20,
  ];
  const score = roundScore(Math.max(0, Math.min(100, scoreParts.reduce((sum, value) => sum + value, 0))));

  return {
    status: issues.length === 0 ? 'usable' : 'weak',
    score,
    issues,
    startedReadCount: retentionDenominator,
    completedReadCount,
    dropOffCount,
    skimmedReadCount,
    completionRate: completionRate === undefined ? undefined : roundScore(completionRate),
    dropOffRatio: dropOffRatio === undefined ? undefined : roundScore(dropOffRatio),
    skimmedReadRatio: skimmedReadRatio === undefined ? undefined : roundScore(skimmedReadRatio),
  };
}

function evaluateDropOffLocalizationEvidence(
  retentionEvidence: {
    status: ReaderResponseRetentionEvidenceStatus;
    dropOffCount: number;
    skimmedReadCount: number;
  },
  annotations: ReaderResponseDropOffAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseDropOffLocalizationEvidenceStatus;
  score: number;
  issues: string[];
  annotationCount: number;
  actionableAnnotationCount: number;
} {
  if (!options.requireDropOffLocalizationEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      annotationCount: annotations.length,
      actionableAnnotationCount: annotations.filter(isActionableDropOffAnnotation).length,
    };
  }

  if (retentionEvidence.status === 'none') {
    return {
      status: 'none',
      score: 0,
      issues: ['Reader sample lacks retention evidence, so drop-off and skimming locations cannot be localized.'],
      annotationCount: annotations.length,
      actionableAnnotationCount: annotations.filter(isActionableDropOffAnnotation).length,
    };
  }

  const observedDropOffEvents = retentionEvidence.dropOffCount + retentionEvidence.skimmedReadCount;
  const actionableAnnotations = annotations.filter(isActionableDropOffAnnotation);
  if (observedDropOffEvents === 0) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      annotationCount: annotations.length,
      actionableAnnotationCount: actionableAnnotations.length,
    };
  }

  const issues: string[] = [];
  if (annotations.length === 0) {
    issues.push(
      'Reader drop-off or skimming was observed, but drop_off_annotations do not localize where readers stopped, skimmed, or lost focus.'
    );
  }
  if (annotations.length < options.minimumDropOffAnnotationCount) {
    issues.push(
      `drop-off localization annotations ${annotations.length} are below ${options.minimumDropOffAnnotationCount}.`
    );
  }
  if (actionableAnnotations.length < options.minimumActionableDropOffAnnotationCount) {
    issues.push(
      `actionable drop-off localization annotations ${actionableAnnotations.length} are below ${options.minimumActionableDropOffAnnotationCount}.`
    );
  }
  if (
    retentionEvidence.dropOffCount > 0 &&
    !annotations.some(annotation => annotation.eventType === 'drop-off')
  ) {
    issues.push('drop_off_annotations must include at least one drop-off event when drop_off_count is above zero.');
  }
  if (
    retentionEvidence.skimmedReadCount > 0 &&
    !annotations.some(annotation => annotation.eventType === 'skim')
  ) {
    issues.push('drop_off_annotations must include at least one skim event when skimmed_read_count is above zero.');
  }

  const expectedEventTypes = [
    retentionEvidence.dropOffCount > 0 ? 'drop-off' : undefined,
    retentionEvidence.skimmedReadCount > 0 ? 'skim' : undefined,
  ].filter((value): value is ReaderResponseDropOffEventType => value !== undefined);
  const coveredEventTypes = expectedEventTypes
    .filter(eventType => annotations.some(annotation => annotation.eventType === eventType)).length;
  const coveredReaderCount = annotations
    .reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
  const scoreParts = [
    calculateThresholdProgress(annotations.length, options.minimumDropOffAnnotationCount) * 25,
    calculateThresholdProgress(
      actionableAnnotations.length,
      options.minimumActionableDropOffAnnotationCount
    ) * 35,
    expectedEventTypes.length > 0
      ? calculateThresholdProgress(coveredEventTypes, expectedEventTypes.length) * 25
      : 25,
    calculateThresholdProgress(coveredReaderCount, observedDropOffEvents) * 15,
  ];
  const score = roundScore(clampScore(scoreParts.reduce((sum, value) => sum + value, 0)));

  return {
    status: issues.length === 0 ? 'usable' : 'weak',
    score,
    issues,
    annotationCount: annotations.length,
    actionableAnnotationCount: actionableAnnotations.length,
  };
}

function evaluateHumanReaderEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseHumanReaderEvidenceStatus;
  score: number;
  issues: string[];
  respondentSource: ReaderResponseRespondentSource;
  humanRespondentCount: number;
  syntheticRespondentCount: number;
  authorEstimateCount: number;
  humanRespondentRatio: number;
} {
  if (!evidence) {
    return {
      status: options.requireHumanReaderEvidenceForTuning ? 'none' : 'usable',
      score: options.requireHumanReaderEvidenceForTuning ? 0 : 100,
      issues: options.requireHumanReaderEvidenceForTuning
        ? ['Reader sample lacks respondent_source and human respondent provenance.']
        : [],
      respondentSource: 'unknown',
      humanRespondentCount: 0,
      syntheticRespondentCount: 0,
      authorEstimateCount: 0,
      humanRespondentRatio: 0,
    };
  }

  const respondentSource = normalizeRespondentSource(evidence.respondentSource);
  const explicitHumanRespondentCount = normalizeNonNegativeInteger(evidence.humanRespondentCount);
  const syntheticRespondentCount =
    normalizeNonNegativeInteger(evidence.syntheticRespondentCount) ??
    (respondentSource === 'synthetic-ai' ? respondentCount : 0);
  const authorEstimateCount =
    normalizeNonNegativeInteger(evidence.authorEstimateCount) ??
    (respondentSource === 'author-estimate' ? respondentCount : 0);
  const inferredHumanCount = respondentSource === 'human-target-reader' ||
    respondentSource === 'human-general-reader'
    ? respondentCount
    : 0;
  const humanRespondentCount = explicitHumanRespondentCount ?? inferredHumanCount;
  const denominator = respondentCount > 0
    ? respondentCount
    : humanRespondentCount + syntheticRespondentCount + authorEstimateCount;
  const humanRespondentRatio = calculateRatio(humanRespondentCount, denominator);

  if (!options.requireHumanReaderEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      respondentSource,
      humanRespondentCount,
      syntheticRespondentCount,
      authorEstimateCount,
      humanRespondentRatio: roundScore(humanRespondentRatio),
    };
  }

  const issues: string[] = [];

  if (respondentSource === 'unknown') {
    issues.push('respondent_source is missing or unknown; cannot treat the sample as actual reader-panel evidence.');
  }
  if (respondentSource === 'synthetic-ai') {
    issues.push('respondent_source is synthetic-ai; synthetic responses cannot retune hard reader-response thresholds.');
  }
  if (respondentSource === 'author-estimate') {
    issues.push('respondent_source is author-estimate; author or system guesses cannot retune hard reader-response thresholds.');
  }
  if (respondentSource === 'mixed-human-synthetic' && explicitHumanRespondentCount === undefined) {
    issues.push('mixed-human-synthetic samples must record human_respondent_count.');
  }
  if (denominator <= 0) {
    issues.push('reader sample has no respondent denominator for human provenance.');
  }
  if (humanRespondentCount <= 0) {
    issues.push('human respondent count is zero or missing.');
  }
  if (humanRespondentRatio < options.minimumHumanRespondentRatio) {
    issues.push(
      `human respondent coverage ${roundScore(humanRespondentRatio * 100)}% is below ${roundScore(options.minimumHumanRespondentRatio * 100)}%.`
    );
  }
  if (humanRespondentCount > respondentCount && respondentCount > 0) {
    issues.push(
      `human respondent count ${humanRespondentCount} exceeds respondent count ${respondentCount}.`
    );
  }

  const score = roundScore(
    (respondentSource === 'unknown' ? 0 : 25) +
    (respondentSource === 'synthetic-ai' || respondentSource === 'author-estimate' ? 0 : 25) +
    (calculateThresholdProgress(humanRespondentRatio, options.minimumHumanRespondentRatio) * 35) +
    (humanRespondentCount > 0 ? 15 : 0)
  );

  return {
    status: issues.length === 0 ? 'usable' : humanRespondentCount > 0 ? 'weak' : 'none',
    score,
    issues,
    respondentSource,
    humanRespondentCount,
    syntheticRespondentCount,
    authorEstimateCount,
    humanRespondentRatio: roundScore(humanRespondentRatio),
  };
}

function evaluateResponseDataQuality(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseDataQualityEvidenceStatus;
  score: number;
  issues: string[];
  manuscriptWordCount?: number;
  manuscriptCharacterCount?: number;
  medianReadingWordsPerMinute?: number;
  minimumReadingWordsPerMinute?: number;
  medianReadingCharactersPerMinute?: number;
  minimumReadingCharactersPerMinute?: number;
  medianReadTimeSeconds?: number;
  minimumReadTimeSeconds?: number;
  speedingResponseCount: number;
  straightLiningResponseCount: number;
  duplicateResponseCount: number;
  botSuspectedResponseCount: number;
  lowQualityOpenEndedResponseCount: number;
  inconsistentResponseCount: number;
  qualityFlaggedResponseCount: number;
  qualityFlaggedResponseRatio: number;
} {
  if (!evidence) {
    return {
      status: options.requireResponseDataQualityForTuning ? 'none' : 'usable',
      score: options.requireResponseDataQualityForTuning ? 0 : 100,
      issues: options.requireResponseDataQualityForTuning
        ? ['Reader sample lacks response data-quality evidence.']
        : [],
      speedingResponseCount: 0,
      straightLiningResponseCount: 0,
      duplicateResponseCount: 0,
      botSuspectedResponseCount: 0,
      lowQualityOpenEndedResponseCount: 0,
      inconsistentResponseCount: 0,
      qualityFlaggedResponseCount: 0,
      qualityFlaggedResponseRatio: 0,
    };
  }

  const medianReadTimeSeconds = normalizeNonNegativeNumber(evidence.medianReadTimeSeconds);
  const minimumReadTimeSeconds = normalizeNonNegativeNumber(evidence.minimumReadTimeSeconds);
  const manuscriptWordCount = normalizePositiveInteger(evidence.manuscriptWordCount);
  const manuscriptCharacterCount = normalizePositiveInteger(evidence.manuscriptCharacterCount);
  const medianReadingWordsPerMinute = calculateReadingWordsPerMinute(
    manuscriptWordCount,
    medianReadTimeSeconds
  );
  const minimumReadingWordsPerMinute = calculateReadingWordsPerMinute(
    manuscriptWordCount,
    minimumReadTimeSeconds
  );
  const medianReadingCharactersPerMinute = calculateReadingCharactersPerMinute(
    manuscriptCharacterCount,
    medianReadTimeSeconds
  );
  const minimumReadingCharactersPerMinute = calculateReadingCharactersPerMinute(
    manuscriptCharacterCount,
    minimumReadTimeSeconds
  );
  const speedingResponseCount = normalizeNonNegativeInteger(evidence.speedingResponseCount) ?? 0;
  const straightLiningResponseCount = normalizeNonNegativeInteger(evidence.straightLiningResponseCount) ?? 0;
  const duplicateResponseCount = normalizeNonNegativeInteger(evidence.duplicateResponseCount) ?? 0;
  const botSuspectedResponseCount = normalizeNonNegativeInteger(evidence.botSuspectedResponseCount) ?? 0;
  const lowQualityOpenEndedResponseCount =
    normalizeNonNegativeInteger(evidence.lowQualityOpenEndedResponseCount) ?? 0;
  const inconsistentResponseCount = normalizeNonNegativeInteger(evidence.inconsistentResponseCount) ?? 0;
  const inferredFlaggedResponseCount = Math.max(
    speedingResponseCount,
    straightLiningResponseCount,
    duplicateResponseCount,
    botSuspectedResponseCount,
    lowQualityOpenEndedResponseCount,
    inconsistentResponseCount
  );
  const qualityFlaggedResponseCount =
    normalizeNonNegativeInteger(evidence.qualityFlaggedResponseCount) ?? inferredFlaggedResponseCount;
  const qualityFlaggedResponseRatio = calculateRatio(qualityFlaggedResponseCount, respondentCount);
  const hasTimingEvidence =
    evidence.speedingResponseCount !== undefined ||
    evidence.medianReadTimeSeconds !== undefined ||
    evidence.minimumReadTimeSeconds !== undefined;
  const hasPatternOrFraudEvidence =
    evidence.straightLiningResponseCount !== undefined ||
    evidence.duplicateResponseCount !== undefined ||
    evidence.botSuspectedResponseCount !== undefined ||
    evidence.lowQualityOpenEndedResponseCount !== undefined ||
    evidence.inconsistentResponseCount !== undefined ||
    evidence.qualityFlaggedResponseCount !== undefined;
  const hasAnyDataQualityEvidence = hasTimingEvidence || hasPatternOrFraudEvidence;

  if (!hasAnyDataQualityEvidence) {
    return {
      status: options.requireResponseDataQualityForTuning ? 'none' : 'usable',
      score: options.requireResponseDataQualityForTuning ? 0 : 100,
      issues: options.requireResponseDataQualityForTuning
        ? ['Reader sample lacks timing, straight-lining, duplicate, bot, inconsistency, or open-ended quality flags.']
        : [],
      medianReadTimeSeconds,
      minimumReadTimeSeconds,
      manuscriptWordCount,
      manuscriptCharacterCount,
      medianReadingWordsPerMinute,
      minimumReadingWordsPerMinute,
      medianReadingCharactersPerMinute,
      minimumReadingCharactersPerMinute,
      speedingResponseCount,
      straightLiningResponseCount,
      duplicateResponseCount,
      botSuspectedResponseCount,
      lowQualityOpenEndedResponseCount,
      inconsistentResponseCount,
      qualityFlaggedResponseCount,
      qualityFlaggedResponseRatio: roundScore(qualityFlaggedResponseRatio),
    };
  }

  if (!options.requireResponseDataQualityForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      medianReadTimeSeconds,
      minimumReadTimeSeconds,
      manuscriptWordCount,
      manuscriptCharacterCount,
      medianReadingWordsPerMinute,
      minimumReadingWordsPerMinute,
      medianReadingCharactersPerMinute,
      minimumReadingCharactersPerMinute,
      speedingResponseCount,
      straightLiningResponseCount,
      duplicateResponseCount,
      botSuspectedResponseCount,
      lowQualityOpenEndedResponseCount,
      inconsistentResponseCount,
      qualityFlaggedResponseCount,
      qualityFlaggedResponseRatio: roundScore(qualityFlaggedResponseRatio),
    };
  }

  const issues: string[] = [];
  if (!hasTimingEvidence) {
    issues.push('Reader sample lacks timing or speeding-response evidence.');
  }
  if (!hasPatternOrFraudEvidence) {
    issues.push('Reader sample lacks straight-lining, duplicate, bot, inconsistency, low-quality open-ended, or total quality-flag evidence.');
  }
  if (
    options.requireLengthNormalizedReadTimeForTuning &&
    manuscriptWordCount === undefined &&
    manuscriptCharacterCount === undefined
  ) {
    issues.push('Reader sample lacks manuscript word or character count for length-normalized reading-speed evidence.');
  }
  if (
    medianReadTimeSeconds !== undefined &&
    medianReadTimeSeconds < options.minimumMedianReadTimeSeconds
  ) {
    issues.push(
      `median read time ${roundScore(medianReadTimeSeconds)}s is below ${roundScore(options.minimumMedianReadTimeSeconds)}s.`
    );
  }
  if (
    minimumReadTimeSeconds !== undefined &&
    minimumReadTimeSeconds < options.minimumMedianReadTimeSeconds * 0.25
  ) {
    issues.push(
      `minimum read time ${roundScore(minimumReadTimeSeconds)}s is too low for credible manuscript reading.`
    );
  }
  if (
    medianReadingWordsPerMinute !== undefined &&
    medianReadingWordsPerMinute > options.maximumMedianReadingWordsPerMinute
  ) {
    issues.push(
      `median reading speed ${roundScore(medianReadingWordsPerMinute)} wpm exceeds ${roundScore(options.maximumMedianReadingWordsPerMinute)} wpm.`
    );
  }
  if (
    minimumReadingWordsPerMinute !== undefined &&
    minimumReadingWordsPerMinute > options.maximumMinimumReadingWordsPerMinute
  ) {
    issues.push(
      `minimum read-time speed ${roundScore(minimumReadingWordsPerMinute)} wpm exceeds ${roundScore(options.maximumMinimumReadingWordsPerMinute)} wpm.`
    );
  }
  if (
    medianReadingCharactersPerMinute !== undefined &&
    medianReadingCharactersPerMinute > options.maximumMedianReadingCharactersPerMinute
  ) {
    issues.push(
      `median reading speed ${roundScore(medianReadingCharactersPerMinute)} cpm exceeds ${roundScore(options.maximumMedianReadingCharactersPerMinute)} cpm.`
    );
  }
  if (
    minimumReadingCharactersPerMinute !== undefined &&
    minimumReadingCharactersPerMinute > options.maximumMinimumReadingCharactersPerMinute
  ) {
    issues.push(
      `minimum read-time speed ${roundScore(minimumReadingCharactersPerMinute)} cpm exceeds ${roundScore(options.maximumMinimumReadingCharactersPerMinute)} cpm.`
    );
  }

  addRatioIssue(
    issues,
    'speeding response',
    speedingResponseCount,
    respondentCount,
    options.maximumSpeedingResponseRatio
  );
  addRatioIssue(
    issues,
    'straight-lining response',
    straightLiningResponseCount,
    respondentCount,
    options.maximumStraightLiningResponseRatio
  );
  addRatioIssue(
    issues,
    'duplicate response',
    duplicateResponseCount,
    respondentCount,
    options.maximumDuplicateResponseRatio
  );
  addRatioIssue(
    issues,
    'bot-suspected response',
    botSuspectedResponseCount,
    respondentCount,
    options.maximumBotSuspectedResponseRatio
  );
  addRatioIssue(
    issues,
    'low-quality open-ended response',
    lowQualityOpenEndedResponseCount,
    respondentCount,
    options.maximumLowQualityOpenEndedRatio
  );
  addRatioIssue(
    issues,
    'inconsistent response',
    inconsistentResponseCount,
    respondentCount,
    options.maximumInconsistentResponseRatio
  );
  addRatioIssue(
    issues,
    'quality-flagged response',
    qualityFlaggedResponseCount,
    respondentCount,
    options.maximumQualityFlaggedResponseRatio
  );

  if (respondentCount > 0 && qualityFlaggedResponseCount > respondentCount) {
    issues.push(
      `quality flagged response count ${qualityFlaggedResponseCount} exceeds respondent count ${respondentCount}.`
    );
  }

  const timingScore = !hasTimingEvidence
    ? 0
    : medianReadTimeSeconds === undefined
      ? 18
      : calculateThresholdProgress(medianReadTimeSeconds, options.minimumMedianReadTimeSeconds) * 25;
  const patternScore = hasPatternOrFraudEvidence ? 20 : 0;
  const scoreParts = [
    timingScore,
    calculateInverseThresholdProgress(
      calculateRatio(speedingResponseCount, respondentCount),
      options.maximumSpeedingResponseRatio
    ) * 12,
    calculateInverseThresholdProgress(
      calculateRatio(straightLiningResponseCount, respondentCount),
      options.maximumStraightLiningResponseRatio
    ) * 12,
    calculateInverseThresholdProgress(
      calculateRatio(duplicateResponseCount + botSuspectedResponseCount, respondentCount),
      Math.max(options.maximumDuplicateResponseRatio + options.maximumBotSuspectedResponseRatio, 0.01)
    ) * 14,
    calculateInverseThresholdProgress(
      calculateRatio(lowQualityOpenEndedResponseCount + inconsistentResponseCount, respondentCount),
      Math.max(options.maximumLowQualityOpenEndedRatio + options.maximumInconsistentResponseRatio, 0.01)
    ) * 12,
    calculateInverseThresholdProgress(
      qualityFlaggedResponseRatio,
      options.maximumQualityFlaggedResponseRatio
    ) * 5,
    patternScore,
  ];
  const score = roundScore(clampScore(scoreParts.reduce((sum, value) => sum + value, 0)));

  return {
    status: issues.length === 0 ? 'usable' : 'weak',
    score,
    issues,
    manuscriptWordCount,
    manuscriptCharacterCount,
    medianReadingWordsPerMinute,
    minimumReadingWordsPerMinute,
    medianReadingCharactersPerMinute,
    minimumReadingCharactersPerMinute,
    medianReadTimeSeconds,
    minimumReadTimeSeconds,
    speedingResponseCount,
    straightLiningResponseCount,
    duplicateResponseCount,
    botSuspectedResponseCount,
    lowQualityOpenEndedResponseCount,
    inconsistentResponseCount,
    qualityFlaggedResponseCount,
    qualityFlaggedResponseRatio: roundScore(qualityFlaggedResponseRatio),
  };
}

function evaluateSampleEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  options: ResolvedReaderResponseCalibrationOptions,
  dimensionIssues: ReaderResponseDimensionIssue[],
  frictionAnnotations: ReaderResponseFrictionAnnotation[],
  frictionAnnotationCoverage: {
    coverage: ReaderResponseFrictionAnnotationCoverage;
    issues: string[];
  },
  frictionAnnotationRepresentativeness: {
    representativeness: ReaderResponseFrictionAnnotationRepresentativeness;
    issues: string[];
  },
  annotationReliability: {
    status: ReaderResponseAnnotationReliabilityStatus;
    score: number;
    issues: string[];
  },
  humanReaderEvidence: {
    status: ReaderResponseHumanReaderEvidenceStatus;
    score: number;
    issues: string[];
  },
  responseDataQuality: {
    status: ReaderResponseDataQualityEvidenceStatus;
    score: number;
    issues: string[];
  },
  retentionEvidence: {
    status: ReaderResponseRetentionEvidenceStatus;
    score: number;
    issues: string[];
    startedReadCount: number;
    completedReadCount: number;
    dropOffCount: number;
    skimmedReadCount: number;
    completionRate?: number;
    dropOffRatio?: number;
    skimmedReadRatio?: number;
  },
  dropOffLocalizationEvidence: {
    status: ReaderResponseDropOffLocalizationEvidenceStatus;
    score: number;
    issues: string[];
  },
  sceneRecallEvidence: {
    status: ReaderResponseSceneRecallEvidenceStatus;
    score: number;
    issues: string[];
    unpromptedCount: number;
    distinctiveCount: number;
  },
  tensionTraceEvidence: {
    status: ReaderResponseTensionTraceEvidenceStatus;
    score: number;
    issues: string[];
    tracePointCount: number;
    peakCount: number;
    questionCount: number;
  },
  narrativeForecastEvidence: {
    status: ReaderResponseNarrativeForecastEvidenceStatus;
    score: number;
    issues: string[];
    predictionCount: number;
    diversityCount: number;
    revisionCount: number;
    mismatchCount: number;
    inflectionCount: number;
  },
  lineQuoteEvidence: {
    status: ReaderResponseLineQuoteEvidenceStatus;
    score: number;
    issues: string[];
    quoteRecallCount: number;
    favoriteLineCount: number;
    shareableLineCount: number;
  },
  payoffFairnessEvidence: {
    status: ReaderResponsePayoffFairnessEvidenceStatus;
    score: number;
    issues: string[];
    setupRecallCount: number;
    triggerRecognitionCount: number;
    earnedCount: number;
    recontextualizationCount: number;
    emotionalSatisfactionCount: number;
  },
  advocacyEvidence: {
    status: ReaderResponseAdvocacyEvidenceStatus;
    score: number;
    issues: string[];
    organicRecommendationCount: number;
    discussionPromptCount: number;
  },
  durableEngagementEvidence: {
    status: ReaderResponseDurableEngagementEvidenceStatus;
    score: number;
    issues: string[];
    bookmarkCount: number;
    followOrLibraryAddCount: number;
    returnNextDayCount: number;
    bingeReadIntentCount: number;
    paidContinuationIntentCount: number;
  },
  continuationBehaviorEvidence: {
    status: ReaderResponseContinuationBehaviorEvidenceStatus;
    score: number;
    issues: string[];
    impressionCount: number;
    clickCount: number;
    openCount: number;
    readStartCount: number;
    clickThroughRatio?: number;
    openRatio?: number;
    readStartRatio?: number;
  },
  resonanceEvidence: {
    status: ReaderResponseResonanceEvidenceStatus;
    score: number;
    issues: string[];
    lingeringEmotionCount: number;
    reflectiveMeaningCount: number;
  },
  delayedMemoryEvidence: {
    status: ReaderResponseDelayedMemoryEvidenceStatus;
    score: number;
    issues: string[];
    followUpRespondentCount: number;
    followUpHours?: number;
    sceneRecallCount: number;
    characterRecallCount: number;
    continuationIntentCount: number;
    nextClickIntentCount: number;
    returnIntentCount: number;
    paidContinuationIntentCount: number;
  },
  revisionOutcome: {
    status: ReaderResponseRevisionOutcomeStatus;
    issues: string[];
  }
): { quality: ReaderResponseCalibrationSampleResult['evidenceQuality']; score: number; issues: string[] } {
  if (!evidence) {
    return {
      quality: 'none',
      score: 0,
      issues: ['Reader sample lacks target-reader, completion, comment, and friction-point evidence.'],
    };
  }

  const targetReaderRatio = calculateRatio(evidence.targetReaderCount, respondentCount);
  const completedReadRatio = calculateRatio(evidence.completedReadCount, respondentCount);
  const qualitativeCommentRatio = calculateRatio(evidence.qualitativeCommentCount, respondentCount);
  const structuredFrictionAnnotationCount = frictionAnnotations.length;
  const actionableStructuredFrictionAnnotationCount = frictionAnnotations
    .filter(isActionableFrictionAnnotation).length;
  const structuredRewriteSuggestionCount = frictionAnnotations
    .filter(annotation => annotation.rewriteSuggestion !== undefined).length;
  const frictionPointCount = Math.max(evidence.frictionPointCount ?? 0, structuredFrictionAnnotationCount);
  const actionableFrictionPointCount = Math.max(
    evidence.actionableFrictionPointCount ?? 0,
    actionableStructuredFrictionAnnotationCount
  );
  const rewriteSuggestionCount = Math.max(
    evidence.rewriteSuggestionCount ?? 0,
    structuredRewriteSuggestionCount
  );
  const scoreParts = [
    calculateThresholdProgress(targetReaderRatio, options.minimumTargetReaderRatio) * 10,
    options.requireHumanReaderEvidenceForTuning
      ? humanReaderEvidence.score * 0.08
      : 8,
    options.requireResponseDataQualityForTuning
      ? responseDataQuality.score * 0.08
      : 8,
    calculateThresholdProgress(completedReadRatio, options.minimumCompletedReadRatio) * 8,
    calculateThresholdProgress(qualitativeCommentRatio, options.minimumQualitativeCommentRatio) * 8,
    calculateThresholdProgress(frictionPointCount, options.minimumFrictionPointCount) * 8,
    calculateThresholdProgress(actionableFrictionPointCount, options.minimumActionableFrictionPointCount) * 5,
    calculateThresholdProgress(rewriteSuggestionCount, options.minimumRewriteSuggestionCount) * 5,
    options.requireRetentionEvidenceForTuning
      ? retentionEvidence.score * 0.08
      : 8,
    options.requireDropOffLocalizationEvidenceForTuning
      ? dropOffLocalizationEvidence.score * 0.06
      : 6,
    options.requireSceneRecallEvidenceForTuning
      ? sceneRecallEvidence.score * 0.10
      : 10,
    options.requireTensionTraceEvidenceForTuning
      ? tensionTraceEvidence.score * 0.08
      : 8,
    options.requireNarrativeForecastEvidenceForTuning
      ? narrativeForecastEvidence.score * 0.08
      : 8,
    options.requireLineQuoteEvidenceForTuning
      ? lineQuoteEvidence.score * 0.08
      : 8,
    options.requirePayoffFairnessEvidenceForTuning
      ? payoffFairnessEvidence.score * 0.08
      : 8,
    options.requireAdvocacyEvidenceForTuning
      ? advocacyEvidence.score * 0.10
      : 10,
    options.requireDurableEngagementEvidenceForTuning
      ? durableEngagementEvidence.score * 0.10
      : 10,
    options.requireContinuationBehaviorEvidenceForTuning
      ? continuationBehaviorEvidence.score * 0.10
      : 10,
    options.requireResonanceEvidenceForTuning
      ? resonanceEvidence.score * 0.10
      : 10,
    options.requireDelayedMemoryEvidenceForTuning
      ? delayedMemoryEvidence.score * 0.10
      : 10,
    options.requireRevisionOutcomeEvidenceForTuning
      ? (revisionOutcome.status === 'improved' ? 5 : 0)
      : 5,
    options.requireAnnotationReliabilityForTuning
      ? annotationReliability.score * 0.08
      : 8,
  ];
  const score = roundScore(clampScore(scoreParts.reduce((sum, value) => sum + value, 0)));
  const issues: string[] = [];

  if (targetReaderRatio < options.minimumTargetReaderRatio) {
    issues.push(
      `target reader coverage ${roundScore(targetReaderRatio * 100)}% is below ${roundScore(options.minimumTargetReaderRatio * 100)}%.`
    );
  }
  if (
    options.requireHumanReaderEvidenceForTuning &&
    humanReaderEvidence.status !== 'usable'
  ) {
    issues.push(...humanReaderEvidence.issues);
  }
  if (
    options.requireResponseDataQualityForTuning &&
    responseDataQuality.status !== 'usable'
  ) {
    issues.push(...responseDataQuality.issues);
  }
  if (completedReadRatio < options.minimumCompletedReadRatio) {
    issues.push(
      `completed read coverage ${roundScore(completedReadRatio * 100)}% is below ${roundScore(options.minimumCompletedReadRatio * 100)}%.`
    );
  }
  if (qualitativeCommentRatio < options.minimumQualitativeCommentRatio) {
    issues.push(
      `qualitative comment coverage ${roundScore(qualitativeCommentRatio * 100)}% is below ${roundScore(options.minimumQualitativeCommentRatio * 100)}%.`
    );
  }
  if (frictionPointCount < options.minimumFrictionPointCount) {
    issues.push(
      `friction point annotations ${frictionPointCount} are below ${options.minimumFrictionPointCount}.`
    );
  }
  if (actionableFrictionPointCount < options.minimumActionableFrictionPointCount) {
    issues.push(
      `actionable friction annotations ${actionableFrictionPointCount} are below ${options.minimumActionableFrictionPointCount}.`
    );
  }
  if (rewriteSuggestionCount < options.minimumRewriteSuggestionCount) {
    issues.push(
      `rewrite suggestions ${rewriteSuggestionCount} are below ${options.minimumRewriteSuggestionCount}.`
    );
  }
  if (
    options.requireStructuredFrictionAnnotationsForTuning &&
    structuredFrictionAnnotationCount < options.minimumStructuredFrictionAnnotationCount
  ) {
    issues.push(
      `structured friction annotations ${structuredFrictionAnnotationCount} are below ${options.minimumStructuredFrictionAnnotationCount}.`
    );
  }
  if (
    options.requireStructuredFrictionAnnotationsForTuning &&
    actionableStructuredFrictionAnnotationCount < options.minimumStructuredFrictionAnnotationCount
  ) {
    issues.push(
      `actionable structured friction annotations ${actionableStructuredFrictionAnnotationCount} are below ${options.minimumStructuredFrictionAnnotationCount}.`
    );
  }
  if (
    options.requireFrictionAnnotationsForWeakDimensionsForTuning &&
    dimensionIssues.length > 0 &&
    frictionAnnotationCoverage.coverage !== 'covered'
  ) {
    issues.push(...frictionAnnotationCoverage.issues);
  }
  if (
    options.requireFrictionAnnotationRepresentativenessForTuning &&
    frictionAnnotationRepresentativeness.representativeness !== 'balanced'
  ) {
    issues.push(...frictionAnnotationRepresentativeness.issues);
  }
  if (
    options.requireAnnotationReliabilityForTuning &&
    annotationReliability.status !== 'usable'
  ) {
    issues.push(...annotationReliability.issues);
  }
  if (
    options.requireRetentionEvidenceForTuning &&
    retentionEvidence.status !== 'usable'
  ) {
    issues.push(...retentionEvidence.issues);
  }
  if (
    options.requireDropOffLocalizationEvidenceForTuning &&
    dropOffLocalizationEvidence.status !== 'usable'
  ) {
    issues.push(...dropOffLocalizationEvidence.issues);
  }
  if (
    options.requireSceneRecallEvidenceForTuning &&
    sceneRecallEvidence.status !== 'usable'
  ) {
    issues.push(...sceneRecallEvidence.issues);
  }
  if (
    options.requireTensionTraceEvidenceForTuning &&
    tensionTraceEvidence.status !== 'usable'
  ) {
    issues.push(...tensionTraceEvidence.issues);
  }
  if (
    options.requireNarrativeForecastEvidenceForTuning &&
    narrativeForecastEvidence.status !== 'usable'
  ) {
    issues.push(...narrativeForecastEvidence.issues);
  }
  if (
    options.requireLineQuoteEvidenceForTuning &&
    lineQuoteEvidence.status !== 'usable'
  ) {
    issues.push(...lineQuoteEvidence.issues);
  }
  if (
    options.requirePayoffFairnessEvidenceForTuning &&
    payoffFairnessEvidence.status !== 'usable'
  ) {
    issues.push(...payoffFairnessEvidence.issues);
  }
  if (
    options.requireAdvocacyEvidenceForTuning &&
    advocacyEvidence.status !== 'usable'
  ) {
    issues.push(...advocacyEvidence.issues);
  }
  if (
    options.requireDurableEngagementEvidenceForTuning &&
    durableEngagementEvidence.status !== 'usable'
  ) {
    issues.push(...durableEngagementEvidence.issues);
  }
  if (
    options.requireContinuationBehaviorEvidenceForTuning &&
    continuationBehaviorEvidence.status !== 'usable'
  ) {
    issues.push(...continuationBehaviorEvidence.issues);
  }
  if (
    options.requireResonanceEvidenceForTuning &&
    resonanceEvidence.status !== 'usable'
  ) {
    issues.push(...resonanceEvidence.issues);
  }
  if (
    options.requireDelayedMemoryEvidenceForTuning &&
    delayedMemoryEvidence.status !== 'usable'
  ) {
    issues.push(...delayedMemoryEvidence.issues);
  }
  if (
    options.requireRevisionOutcomeEvidenceForTuning &&
    revisionOutcome.status !== 'improved'
  ) {
    issues.push(...revisionOutcome.issues);
  }

  return {
    quality: score >= 85 && issues.length === 0 ? 'usable' : 'weak',
    score,
    issues,
  };
}

function evaluatePanelConsensus(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  options: ResolvedReaderResponseCalibrationOptions
): { consensus: ReaderResponsePanelConsensus; issues: string[] } {
  if (!evidence) {
    return {
      consensus: 'unknown',
      issues: ['Reader sample lacks panel consensus evidence.'],
    };
  }

  const issues: string[] = [];
  const standardDeviation = evidence.readerScoreStandardDeviation;
  if (
    standardDeviation !== undefined &&
    standardDeviation > options.maximumReaderScoreStandardDeviation
  ) {
    issues.push(
      `reader score standard deviation ${roundScore(standardDeviation)} exceeds ${options.maximumReaderScoreStandardDeviation}.`
    );
  }

  const highResponseRatio = calculateRatio(evidence.highResponseCount, respondentCount);
  const neutralResponseRatio = calculateRatio(evidence.neutralResponseCount, respondentCount);
  const lowResponseRatio = calculateRatio(evidence.lowResponseCount, respondentCount);
  const hasDistribution = [
    evidence.highResponseCount,
    evidence.neutralResponseCount,
    evidence.lowResponseCount,
  ].some(value => value !== undefined);

  if (hasDistribution) {
    const knownDistributionCount =
      (evidence.highResponseCount ?? 0) +
      (evidence.neutralResponseCount ?? 0) +
      (evidence.lowResponseCount ?? 0);
    if (knownDistributionCount < respondentCount) {
      issues.push(
        `panel distribution covers ${knownDistributionCount}/${respondentCount} respondents.`
      );
    }

    const strongestGroupRatio = Math.max(highResponseRatio, neutralResponseRatio, lowResponseRatio);
    if (strongestGroupRatio < options.minimumConsensusMajorityRatio) {
      issues.push(
        `no reader response group reaches ${roundScore(options.minimumConsensusMajorityRatio * 100)}% consensus.`
      );
    }

    if (
      highResponseRatio >= options.minimumPolarizedGroupRatio &&
      lowResponseRatio >= options.minimumPolarizedGroupRatio
    ) {
      issues.push(
        `reader response is polarized: high=${roundScore(highResponseRatio * 100)}%, low=${roundScore(lowResponseRatio * 100)}%.`
      );
    }
  }

  const hasConsensusEvidence = standardDeviation !== undefined || hasDistribution;
  if (!hasConsensusEvidence) {
    return {
      consensus: 'unknown',
      issues: ['Reader sample lacks score dispersion or response distribution evidence.'],
    };
  }

  const polarized = issues.some(issue => issue.includes('polarized'));
  return {
    consensus: polarized ? 'polarized' : issues.length > 0 ? 'mixed' : 'clear',
    issues,
  };
}

function evaluateReaderScoreConfidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  readerCompositeScore: number,
  options: ResolvedReaderResponseCalibrationOptions
): {
  confidence: ReaderResponseScoreConfidence;
  standardError?: number;
  marginOfError?: number;
  interval?: { lower: number; upper: number };
  issues: string[];
} {
  if (!evidence || evidence.readerScoreStandardDeviation === undefined) {
    return {
      confidence: 'unknown',
      issues: ['Reader sample lacks score standard deviation for confidence interval calculation.'],
    };
  }

  if (respondentCount < 2) {
    return {
      confidence: 'unknown',
      issues: ['Reader score confidence needs at least 2 respondents.'],
    };
  }

  const standardDeviation = evidence.readerScoreStandardDeviation;
  if (!Number.isFinite(standardDeviation) || standardDeviation < 0) {
    return {
      confidence: 'unknown',
      issues: ['Reader score standard deviation is invalid.'],
    };
  }

  const standardError = standardDeviation / Math.sqrt(respondentCount);
  const marginOfError = 1.96 * standardError;
  const interval = {
    lower: roundScore(clampScore(readerCompositeScore - marginOfError)),
    upper: roundScore(clampScore(readerCompositeScore + marginOfError)),
  };
  const issues: string[] = [];

  if (marginOfError > options.maximumReaderScoreMarginOfError) {
    issues.push(
      `95% reader score margin of error ${roundScore(marginOfError)} exceeds ${options.maximumReaderScoreMarginOfError}.`
    );
  }

  return {
    confidence: issues.length === 0 ? 'precise' : 'wide',
    standardError: roundScore(standardError),
    marginOfError: roundScore(marginOfError),
    interval,
    issues,
  };
}

function evaluateCohortRepresentativeness(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  options: ResolvedReaderResponseCalibrationOptions
): {
  representativeness: ReaderResponseCohortRepresentativeness;
  issues: string[];
  targetReaderSegmentCounts: Record<string, number>;
} {
  const targetReaderSegmentCounts = normalizeTargetReaderSegmentCounts(evidence?.targetReaderSegmentCounts);
  if (!evidence) {
    return {
      representativeness: 'unknown',
      issues: ['Reader sample lacks target-reader cohort evidence.'],
      targetReaderSegmentCounts,
    };
  }

  const issues: string[] = [];
  const targetReaderSegmentCount = evidence.targetReaderSegmentCount;
  const quotaSegmentCount = Object.keys(targetReaderSegmentCounts).length;
  const quotaRespondentTotal = sumValues(Object.values(targetReaderSegmentCounts));
  const quotaDominantReaderSegmentRatio = quotaRespondentTotal > 0
    ? Math.max(...Object.values(targetReaderSegmentCounts)) / quotaRespondentTotal
    : undefined;
  const observedTargetReaderSegmentCount = targetReaderSegmentCount ?? (
    quotaSegmentCount > 0 ? quotaSegmentCount : undefined
  );
  const dominantReaderSegmentRatio = evidence.dominantReaderSegmentRatio ?? quotaDominantReaderSegmentRatio;

  if (observedTargetReaderSegmentCount === undefined && dominantReaderSegmentRatio === undefined) {
    return {
      representativeness: 'unknown',
      issues: ['Reader sample lacks target-reader segment count, quota counts, or dominant segment ratio evidence.'],
      targetReaderSegmentCounts,
    };
  }

  if (
    observedTargetReaderSegmentCount !== undefined &&
    observedTargetReaderSegmentCount < options.minimumTargetReaderSegmentCount
  ) {
    issues.push(
      `target reader segment count ${observedTargetReaderSegmentCount} is below ${options.minimumTargetReaderSegmentCount}.`
    );
  }

  if (
    dominantReaderSegmentRatio !== undefined &&
    dominantReaderSegmentRatio > options.maximumDominantReaderSegmentRatio
  ) {
    issues.push(
      `dominant reader segment ratio ${roundScore(dominantReaderSegmentRatio * 100)}% exceeds ${roundScore(options.maximumDominantReaderSegmentRatio * 100)}%.`
    );
  }

  if (
    targetReaderSegmentCount !== undefined &&
    evidence.targetReaderCount !== undefined &&
    targetReaderSegmentCount > evidence.targetReaderCount
  ) {
    issues.push(
      `target reader segment count ${targetReaderSegmentCount} exceeds target reader count ${evidence.targetReaderCount}.`
    );
  }

  if (dominantReaderSegmentRatio !== undefined && respondentCount <= 0) {
    issues.push('Dominant reader segment ratio is present but respondent count is missing.');
  }

  if (quotaSegmentCount > 0 && targetReaderSegmentCount !== undefined && quotaSegmentCount > targetReaderSegmentCount) {
    issues.push(
      `target reader segment quota count ${quotaSegmentCount} exceeds declared target reader segment count ${targetReaderSegmentCount}.`
    );
  }

  if (quotaRespondentTotal > 0 && respondentCount > 0 && quotaRespondentTotal > respondentCount) {
    issues.push(
      `target reader segment quota respondents ${quotaRespondentTotal} exceed respondent count ${respondentCount}.`
    );
  }

  if (
    quotaRespondentTotal > 0 &&
    evidence.targetReaderCount !== undefined &&
    quotaRespondentTotal > evidence.targetReaderCount
  ) {
    issues.push(
      `target reader segment quota respondents ${quotaRespondentTotal} exceed target reader count ${evidence.targetReaderCount}.`
    );
  }

  if (
    options.requireTargetReaderSegmentQuotasForTuning &&
    options.requiredTargetReaderSegments.length > 0
  ) {
    if (quotaSegmentCount === 0) {
      issues.push(
        `Reader sample lacks target_reader_segment_counts for required target-reader segments: ${options.requiredTargetReaderSegments.join(', ')}.`
      );
    }

    for (const segment of options.requiredTargetReaderSegments) {
      const segmentRespondents = targetReaderSegmentCounts[segment] ?? 0;
      if (segmentRespondents < options.minimumRespondentsPerRequiredTargetSegment) {
        issues.push(
          `required target-reader segment "${segment}" has ${segmentRespondents} respondent(s), below ${options.minimumRespondentsPerRequiredTargetSegment}.`
        );
      }
    }
  }

  return {
    representativeness: issues.length === 0 ? 'balanced' : 'narrow',
    issues,
    targetReaderSegmentCounts,
  };
}

function evaluatePanelProtocolQuality(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  options: ResolvedReaderResponseCalibrationOptions
): {
  quality: ReaderResponsePanelProtocolQuality;
  issues: string[];
  recruitmentChannelCounts: Record<string, number>;
} {
  if (!evidence) {
    return {
      quality: 'unknown',
      issues: ['Reader sample lacks survey protocol evidence.'],
      recruitmentChannelCounts: {},
    };
  }

  const recruitmentChannelCounts = normalizeNamedCountMap(evidence.recruitmentChannelCounts);
  const recruitmentChannelTotal = sumValues(Object.values(recruitmentChannelCounts));
  const recruitmentChannelCount = Object.keys(recruitmentChannelCounts).length;

  const protocolFields = [
    evidence.blindReading,
    evidence.authorIdentityMasked,
    evidence.priorExposureScreened,
    evidence.unexcludedPriorExposureCount,
    evidence.spoilerExposureScreened,
    evidence.unexcludedSpoilerExposureCount,
    evidence.neutralQuestionWording,
    evidence.responseOptionOrderRandomized,
    evidence.sampleOrderRandomized,
    evidence.manuscriptOrderCounterbalanced,
    evidence.maxSamplesPerRespondent,
    evidence.orderBalanceRatio,
    evidence.questionWordingDisclosed,
    evidence.recruitmentMethodDisclosed,
    evidence.recruitmentChannelCounts,
    evidence.populationDefinitionDisclosed,
    evidence.samplingFrameDisclosed,
    evidence.fieldworkDatesDisclosed,
    evidence.surveyModeDisclosed,
    evidence.incentiveDisclosed,
    evidence.attentionCheckPassCount,
    evidence.excludedResponseCount,
  ];
  const hasAnyProtocolEvidence = protocolFields.some(value => value !== undefined);
  if (!hasAnyProtocolEvidence) {
    return {
      quality: 'unknown',
      issues: [
        'Reader sample lacks blind-reading, questionnaire, manuscript-order, recruitment, and attention-check protocol evidence.',
      ],
      recruitmentChannelCounts,
    };
  }

  const issues: string[] = [];
  const maxSamplesPerRespondent = normalizePositiveInteger(evidence.maxSamplesPerRespondent);
  const orderBalanceRatio = normalizeUnitRatio(evidence.orderBalanceRatio);
  const unexcludedPriorExposureCount = normalizeNonNegativeInteger(evidence.unexcludedPriorExposureCount);
  const unexcludedSpoilerExposureCount = normalizeNonNegativeInteger(evidence.unexcludedSpoilerExposureCount);
  const repeatedManuscriptExposure = maxSamplesPerRespondent === undefined || maxSamplesPerRespondent > 1;

  if (evidence.blindReading !== true) {
    issues.push('Reader panel protocol does not confirm blind manuscript/source presentation.');
  }
  if (evidence.authorIdentityMasked !== true) {
    issues.push('Reader panel protocol does not confirm author identity masking.');
  }
  if (evidence.priorExposureScreened !== true) {
    issues.push('Reader panel protocol does not confirm prior exposure screening for the manuscript or earlier versions.');
  }
  if (unexcludedPriorExposureCount === undefined) {
    issues.push('Reader panel protocol lacks unexcluded prior exposure response count.');
  } else if (unexcludedPriorExposureCount > 0) {
    issues.push(
      `${unexcludedPriorExposureCount} response(s) with prior manuscript or version exposure remained in the sample.`
    );
  }
  if (evidence.spoilerExposureScreened !== true) {
    issues.push('Reader panel protocol does not confirm spoiler exposure screening.');
  }
  if (unexcludedSpoilerExposureCount === undefined) {
    issues.push('Reader panel protocol lacks unexcluded spoiler exposure response count.');
  } else if (unexcludedSpoilerExposureCount > 0) {
    issues.push(
      `${unexcludedSpoilerExposureCount} response(s) with spoiler or synopsis exposure remained in the sample.`
    );
  }
  if (evidence.neutralQuestionWording !== true) {
    issues.push('Reader panel protocol does not confirm neutral, non-leading question wording.');
  }
  if (evidence.responseOptionOrderRandomized !== true) {
    issues.push('Reader panel protocol does not confirm randomized or counterbalanced response-option order.');
  }
  if (maxSamplesPerRespondent === undefined) {
    issues.push('Reader panel protocol lacks max_samples_per_respondent for manuscript exposure control.');
  } else if (maxSamplesPerRespondent > options.maximumSamplesPerRespondent) {
    issues.push(
      `max samples per respondent ${maxSamplesPerRespondent} exceeds ${options.maximumSamplesPerRespondent}.`
    );
  }
  if (repeatedManuscriptExposure && evidence.sampleOrderRandomized !== true) {
    issues.push('Reader panel protocol does not confirm randomized manuscript/sample presentation order.');
  }
  if (repeatedManuscriptExposure && evidence.manuscriptOrderCounterbalanced !== true) {
    issues.push('Reader panel protocol does not confirm counterbalanced manuscript or variant order.');
  }
  if (repeatedManuscriptExposure) {
    if (orderBalanceRatio === undefined) {
      issues.push('Reader panel protocol lacks manuscript order balance ratio.');
    } else if (orderBalanceRatio < options.minimumOrderBalanceRatio) {
      issues.push(
        `manuscript order balance ratio ${roundScore(orderBalanceRatio * 100)}% is below ${roundScore(options.minimumOrderBalanceRatio * 100)}%.`
      );
    }
  }
  if (evidence.questionWordingDisclosed !== true) {
    issues.push('Reader panel protocol does not disclose exact question wording and response options.');
  }
  if (evidence.recruitmentMethodDisclosed !== true) {
    issues.push('Reader panel protocol does not disclose recruitment method and target-reader screening rules.');
  }
  if (
    options.requireRecruitmentChannelDiversityForTuning &&
    options.requiredRecruitmentChannels.length > 0 &&
    recruitmentChannelCount === 0
  ) {
    issues.push(
      `Reader panel protocol lacks recruitment_channel_counts for required recruitment channels: ${options.requiredRecruitmentChannels.join(', ')}.`
    );
  }
  if (recruitmentChannelCount > 0) {
    if (recruitmentChannelTotal !== respondentCount) {
      issues.push(
        `recruitment_channel_counts total ${recruitmentChannelTotal} must equal respondent count ${respondentCount}.`
      );
    }
    const dominantRecruitmentChannelRatio = recruitmentChannelTotal > 0
      ? Math.max(...Object.values(recruitmentChannelCounts)) / recruitmentChannelTotal
      : 0;
    if (dominantRecruitmentChannelRatio > options.maximumDominantRecruitmentChannelRatio) {
      issues.push(
        `dominant recruitment channel ratio ${roundScore(dominantRecruitmentChannelRatio * 100)}% exceeds ${roundScore(options.maximumDominantRecruitmentChannelRatio * 100)}%.`
      );
    }
  }
  if (
    options.requireRecruitmentChannelDiversityForTuning &&
    options.requiredRecruitmentChannels.length > 0
  ) {
    for (const channel of options.requiredRecruitmentChannels) {
      const channelRespondents = recruitmentChannelCounts[channel] ?? 0;
      if (channelRespondents < options.minimumRespondentsPerRequiredRecruitmentChannel) {
        issues.push(
          `required recruitment channel "${channel}" has ${channelRespondents} respondent(s), below ${options.minimumRespondentsPerRequiredRecruitmentChannel}.`
        );
      }
    }
  }
  if (evidence.populationDefinitionDisclosed !== true) {
    issues.push('Reader panel protocol does not define the target reader population being sampled.');
  }
  if (evidence.samplingFrameDisclosed !== true) {
    issues.push('Reader panel protocol does not disclose the sampling frame or panel source coverage.');
  }
  if (evidence.fieldworkDatesDisclosed !== true) {
    issues.push('Reader panel protocol does not disclose fieldwork dates for the response sample.');
  }
  if (evidence.surveyModeDisclosed !== true) {
    issues.push('Reader panel protocol does not disclose survey mode or reading environment.');
  }
  if (evidence.incentiveDisclosed !== true) {
    issues.push('Reader panel protocol does not disclose reader incentives or compensation conditions.');
  }

  if (evidence.attentionCheckPassCount === undefined) {
    issues.push('Reader panel protocol lacks attention-check pass count.');
  } else {
    const attentionCheckPassRatio = calculateRatio(evidence.attentionCheckPassCount, respondentCount);
    if (attentionCheckPassRatio < options.minimumAttentionCheckPassRatio) {
      issues.push(
        `attention-check pass coverage ${roundScore(attentionCheckPassRatio * 100)}% is below ${roundScore(options.minimumAttentionCheckPassRatio * 100)}%.`
      );
    }
  }

  if (evidence.excludedResponseCount === undefined) {
    issues.push('Reader panel protocol lacks excluded response count.');
  }

  return {
    quality: issues.length === 0 ? 'strong' : 'weak',
    issues,
    recruitmentChannelCounts,
  };
}

function evaluateComparativePreference(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseComparativePreferenceStatus;
  winRate?: number;
  margin?: number;
  respondentCount?: number;
  issues: string[];
} {
  if (!evidence) {
    return {
      status: 'none',
      issues: options.requireComparativePreferenceForTuning
        ? ['Reader sample lacks blind comparative preference evidence against a target-market reference.']
        : [],
    };
  }

  const currentCount = normalizeNonNegativeInteger(evidence.comparativePreferenceCurrentCount);
  const referenceCount = normalizeNonNegativeInteger(evidence.comparativePreferenceReferenceCount);
  const tieCount = normalizeNonNegativeInteger(evidence.comparativePreferenceTieCount) ?? 0;
  const hasCounts = currentCount !== undefined || referenceCount !== undefined ||
    evidence.comparativePreferenceTieCount !== undefined;
  const countedRespondents = hasCounts
    ? (currentCount ?? 0) + (referenceCount ?? 0) + tieCount
    : undefined;
  const comparativeRespondentCount = normalizePositiveInteger(
    evidence.comparativePreferenceRespondentCount
  ) ?? countedRespondents ?? respondentCount;
  const explicitWinRate = normalizePreferenceRate(evidence.comparativePreferenceWinRate);
  const countedWinRate = countedRespondents && countedRespondents > 0
    ? ((currentCount ?? 0) + (tieCount * 0.5)) / countedRespondents
    : undefined;
  const winRate = explicitWinRate ?? countedWinRate;

  if (winRate === undefined && !hasCounts) {
    return {
      status: 'none',
      respondentCount: comparativeRespondentCount,
      issues: options.requireComparativePreferenceForTuning
        ? ['Reader sample lacks comparative preference win rate or pairwise current/reference counts.']
        : [],
    };
  }

  const issues: string[] = [];
  if (comparativeRespondentCount < options.minimumComparativePreferenceRespondentCount) {
    issues.push(
      `comparative preference respondents ${comparativeRespondentCount} are below ${options.minimumComparativePreferenceRespondentCount}.`
    );
  }
  if (winRate === undefined) {
    issues.push('comparative preference win rate could not be calculated.');
  } else if (winRate < options.minimumComparativePreferenceWinRate) {
    issues.push(
      `comparative preference win rate ${roundScore(winRate * 100)}% is below ${roundScore(options.minimumComparativePreferenceWinRate * 100)}%.`
    );
  }
  if (evidence.comparativeBlindPairwise !== true) {
    issues.push('comparative preference evidence does not confirm blind pairwise presentation.');
  }
  if (evidence.comparativeSameReaderCohort !== true) {
    issues.push('comparative preference evidence does not confirm the same target-reader cohort rated both works.');
  }
  if (evidence.comparativeQuestionWordingDisclosed !== true) {
    issues.push('comparative preference evidence lacks disclosed pairwise question wording.');
  }

  const margin = winRate === undefined ? undefined : roundScore(winRate - 0.5);
  return {
    status: issues.length === 0 ? 'strong' : 'weak',
    winRate: winRate === undefined ? undefined : roundScore(winRate),
    margin,
    respondentCount: comparativeRespondentCount,
    issues,
  };
}

function evaluateRevisionOutcomeEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  readerCompositeScore: number,
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseRevisionOutcomeStatus;
  issues: string[];
  pairId?: string;
  baselineScore?: number;
  currentScore?: number;
  lift?: number;
  preferenceWinRate?: number;
  preferenceRespondentCount?: number;
  preferenceRevisedCount: number;
  preferenceBaselineCount: number;
  preferenceTieCount: number;
  guardrailRegressionCount: number;
} {
  if (!evidence) {
    return {
      status: 'none',
      issues: options.requireRevisionOutcomeEvidenceForTuning
        ? ['Reader sample lacks revision outcome evidence comparing the revised draft against its baseline.']
        : [],
      preferenceRevisedCount: 0,
      preferenceBaselineCount: 0,
      preferenceTieCount: 0,
      guardrailRegressionCount: 0,
    };
  }

  const baselineScore = normalizeOptionalScore(evidence.revisionBaselineReaderScore);
  const currentScore = normalizeOptionalScore(evidence.revisionCurrentReaderScore) ?? readerCompositeScore;
  const lift = baselineScore === undefined ? undefined : roundScore(currentScore - baselineScore);
  const revisedCount = normalizeNonNegativeInteger(evidence.revisionPreferenceRevisedCount);
  const baselinePreferenceCount = normalizeNonNegativeInteger(evidence.revisionPreferenceBaselineCount);
  const tieCount = normalizeNonNegativeInteger(evidence.revisionPreferenceTieCount) ?? 0;
  const hasPreferenceCounts = revisedCount !== undefined ||
    baselinePreferenceCount !== undefined ||
    evidence.revisionPreferenceTieCount !== undefined;
  const countedRespondents = hasPreferenceCounts
    ? (revisedCount ?? 0) + (baselinePreferenceCount ?? 0) + tieCount
    : undefined;
  const preferenceRespondentCount = normalizePositiveInteger(
    evidence.revisionPreferenceRespondentCount
  ) ?? countedRespondents ?? respondentCount;
  const preferenceWinRate = countedRespondents && countedRespondents > 0
    ? ((revisedCount ?? 0) + (tieCount * 0.5)) / countedRespondents
    : undefined;
  const guardrailRegressionCount = normalizeNonNegativeInteger(
    evidence.revisionGuardrailRegressionCount
  ) ?? 0;
  const hasScoreEvidence = baselineScore !== undefined ||
    evidence.revisionCurrentReaderScore !== undefined;
  const hasProtocolEvidence = evidence.revisionBlindComparison !== undefined ||
    evidence.revisionSameReaderCohort !== undefined ||
    evidence.revisionQuestionWordingDisclosed !== undefined;
  const hasOutcomeEvidence = hasScoreEvidence ||
    hasPreferenceCounts ||
    evidence.revisionGuardrailRegressionCount !== undefined ||
    hasProtocolEvidence ||
    evidence.revisionPairId !== undefined;

  if (!hasOutcomeEvidence) {
    return {
      status: 'none',
      issues: options.requireRevisionOutcomeEvidenceForTuning
        ? ['Reader sample lacks revision outcome evidence comparing the revised draft against its baseline.']
        : [],
      preferenceRevisedCount: 0,
      preferenceBaselineCount: 0,
      preferenceTieCount: 0,
      guardrailRegressionCount,
    };
  }

  const issues: string[] = [];
  if (baselineScore === undefined && !hasPreferenceCounts) {
    issues.push('revision outcome evidence lacks a baseline reader score or revised/baseline preference counts.');
  }
  if (lift !== undefined && lift < options.minimumRevisionLift) {
    issues.push(
      `revision reader-score lift ${roundScore(lift)} is below ${roundScore(options.minimumRevisionLift)}.`
    );
  }
  if (hasPreferenceCounts) {
    if (preferenceRespondentCount < options.minimumRevisionPreferenceRespondentCount) {
      issues.push(
        `revision preference respondents ${preferenceRespondentCount} are below ${options.minimumRevisionPreferenceRespondentCount}.`
      );
    }
    if (preferenceWinRate === undefined) {
      issues.push('revision preference win rate could not be calculated.');
    } else if (preferenceWinRate < options.minimumRevisionPreferenceWinRate) {
      issues.push(
        `revision preference win rate ${roundScore(preferenceWinRate * 100)}% is below ${roundScore(options.minimumRevisionPreferenceWinRate * 100)}%.`
      );
    }
  }
  if (evidence.revisionBlindComparison !== true) {
    issues.push('revision outcome evidence does not confirm blind baseline/revised comparison.');
  }
  if (evidence.revisionSameReaderCohort !== true) {
    issues.push('revision outcome evidence does not confirm the same or matched target-reader cohort.');
  }
  if (evidence.revisionQuestionWordingDisclosed !== true) {
    issues.push('revision outcome evidence lacks disclosed before/after question wording.');
  }
  if (guardrailRegressionCount > options.maximumRevisionGuardrailRegressionCount) {
    issues.push(
      `revision guardrail regressions ${guardrailRegressionCount} exceed ${options.maximumRevisionGuardrailRegressionCount}.`
    );
  }

  const scoreRegressed = lift !== undefined && lift < 0;
  const preferenceRegressed = preferenceWinRate !== undefined &&
    preferenceRespondentCount >= options.minimumRevisionPreferenceRespondentCount &&
    preferenceWinRate < 0.5;
  const guardrailRegressed = guardrailRegressionCount > options.maximumRevisionGuardrailRegressionCount;
  const hasStrongLift = lift !== undefined && lift >= options.minimumRevisionLift;
  const hasStrongPreference = preferenceWinRate !== undefined &&
    preferenceRespondentCount >= options.minimumRevisionPreferenceRespondentCount &&
    preferenceWinRate >= options.minimumRevisionPreferenceWinRate;

  return {
    status: scoreRegressed || preferenceRegressed || guardrailRegressed
      ? 'regressed'
      : issues.length === 0 && (hasStrongLift || hasStrongPreference)
        ? 'improved'
        : 'weak',
    issues,
    pairId: normalizeOptionalText(evidence.revisionPairId),
    baselineScore,
    currentScore,
    lift,
    preferenceWinRate: preferenceWinRate === undefined ? undefined : roundScore(preferenceWinRate),
    preferenceRespondentCount,
    preferenceRevisedCount: revisedCount ?? 0,
    preferenceBaselineCount: baselinePreferenceCount ?? 0,
    preferenceTieCount: tieCount,
    guardrailRegressionCount,
  };
}

function normalizeFrictionAnnotations(
  annotations: ReaderResponseFrictionAnnotation[] | undefined
): ReaderResponseFrictionAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      quote: normalizeOptionalText(annotation.quote),
      dimension: normalizeFrictionDimension(annotation.dimension),
      reason: annotation.reason.trim(),
      severity: normalizeFrictionSeverity(annotation.severity),
      rewriteSuggestion: normalizeOptionalText(annotation.rewriteSuggestion),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
    }))
    .filter(annotation => annotation.reason.length > 0);
}

function normalizeDropOffAnnotations(
  annotations: ReaderResponseDropOffAnnotation[] | undefined
): ReaderResponseDropOffAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .flatMap(annotation => {
      const eventType = normalizeDropOffEventType(annotation.eventType);
      const reason = (annotation.reason ?? '').trim();
      if (!eventType || reason.length === 0) return [];
      return [{
        location: normalizeOptionalText(annotation.location),
        eventType,
        lastCompletedLocation: normalizeOptionalText(annotation.lastCompletedLocation),
        triggerQuote: normalizeOptionalText(annotation.triggerQuote),
        reason,
        readerCount: normalizeNonNegativeInteger(annotation.readerCount),
        readerSegment: normalizeOptionalText(annotation.readerSegment),
        suggestedRevision: normalizeOptionalText(annotation.suggestedRevision),
      }];
    });
}

function normalizeSceneRecallAnnotations(
  annotations: ReaderResponseSceneRecallAnnotation[] | undefined
): ReaderResponseSceneRecallAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      rememberedMoment: annotation.rememberedMoment.trim(),
      distinctiveDetail: normalizeOptionalText(annotation.distinctiveDetail),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
    }))
    .filter(annotation => annotation.rememberedMoment.length > 0);
}

function normalizeTensionTraceAnnotations(
  annotations: ReaderResponseTensionTraceAnnotation[] | undefined
): ReaderResponseTensionTraceAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      experiencedTension: (annotation.experiencedTension ?? '').trim(),
      suspenseLevel: normalizeOptionalScore(annotation.suspenseLevel),
      curiosityLevel: normalizeOptionalScore(annotation.curiosityLevel),
      surpriseLevel: normalizeOptionalScore(annotation.surpriseLevel),
      narrativeQuestion: normalizeOptionalText(annotation.narrativeQuestion),
      stakeOrRisk: normalizeOptionalText(annotation.stakeOrRisk),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
      reason: normalizeOptionalText(annotation.reason),
    }))
    .filter(annotation => annotation.experiencedTension.length > 0);
}

function normalizeNarrativeForecastAnnotations(
  annotations: ReaderResponseNarrativeForecastAnnotation[] | undefined
): ReaderResponseNarrativeForecastAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      initialPrediction: normalizeOptionalText(annotation.initialPrediction) ?? '',
      revisedPrediction: normalizeOptionalText(annotation.revisedPrediction),
      actualOutcome: normalizeOptionalText(annotation.actualOutcome),
      predictionMismatch: annotation.predictionMismatch,
      predictionShift: normalizeOptionalText(annotation.predictionShift),
      surpriseOrTensionReason: normalizeOptionalText(annotation.surpriseOrTensionReason),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
    }))
    .filter(annotation => annotation.initialPrediction.length > 0);
}

function normalizeLineQuoteAnnotations(
  annotations: ReaderResponseLineQuoteAnnotation[] | undefined
): ReaderResponseLineQuoteAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      quotedLine: normalizeOptionalText(annotation.quotedLine) ?? '',
      appealReason: normalizeOptionalText(annotation.appealReason),
      shareReason: normalizeOptionalText(annotation.shareReason),
      lineFunction: normalizeLineQuoteFunction(annotation.lineFunction),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
    }))
    .filter(annotation => annotation.quotedLine.length > 0);
}

function normalizePayoffFairnessAnnotations(
  annotations: ReaderResponsePayoffFairnessAnnotation[] | undefined
): ReaderResponsePayoffFairnessAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      payoffMoment: normalizeOptionalText(annotation.payoffMoment) ?? '',
      rememberedSetup: normalizeOptionalText(annotation.rememberedSetup),
      triggerOrReveal: normalizeOptionalText(annotation.triggerOrReveal),
      changedInterpretation: normalizeOptionalText(annotation.changedInterpretation),
      earnedReason: normalizeOptionalText(annotation.earnedReason),
      arbitraryOrCheatReason: normalizeOptionalText(annotation.arbitraryOrCheatReason),
      emotionalPayoffReason: normalizeOptionalText(annotation.emotionalPayoffReason),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
    }))
    .filter(annotation => annotation.payoffMoment.length > 0);
}

function normalizeAdvocacyAnnotations(
  annotations: ReaderResponseAdvocacyAnnotation[] | undefined
): ReaderResponseAdvocacyAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      shareTrigger: (annotation.shareTrigger ?? '').trim(),
      recommendedAudience: normalizeOptionalText(annotation.recommendedAudience),
      discussionPrompt: normalizeOptionalText(annotation.discussionPrompt),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
    }))
    .filter(annotation => annotation.shareTrigger.length > 0);
}

function normalizeDurableEngagementAnnotations(
  annotations: ReaderResponseDurableEngagementAnnotation[] | undefined
): ReaderResponseDurableEngagementAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      commitmentTrigger: (annotation.commitmentTrigger ?? '').trim(),
      intendedAction: normalizeDurableEngagementAction(annotation.intendedAction),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
      reason: normalizeOptionalText(annotation.reason),
    }))
    .filter(annotation => annotation.commitmentTrigger.length > 0);
}

function normalizeResonanceAnnotations(
  annotations: ReaderResponseResonanceAnnotation[] | undefined
): ReaderResponseResonanceAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      lingeringEmotion: (annotation.lingeringEmotion ?? '').trim(),
      reflectiveQuestion: normalizeOptionalText(annotation.reflectiveQuestion),
      rememberedImage: normalizeOptionalText(annotation.rememberedImage),
      personalMeaning: normalizeOptionalText(annotation.personalMeaning),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
    }))
    .filter(annotation => annotation.lingeringEmotion.length > 0);
}

function normalizeDelayedMemoryAnnotations(
  annotations: ReaderResponseDelayedMemoryAnnotation[] | undefined
): ReaderResponseDelayedMemoryAnnotation[] {
  if (!Array.isArray(annotations)) return [];

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      delayedRememberedMoment: (annotation.delayedRememberedMoment ?? '').trim(),
      delayedCharacterOrRelationship: normalizeOptionalText(annotation.delayedCharacterOrRelationship),
      delayedNextQuestion: normalizeOptionalText(annotation.delayedNextQuestion),
      returnOrPurchaseReason: normalizeOptionalText(annotation.returnOrPurchaseReason),
      readerCount: normalizeNonNegativeInteger(annotation.readerCount),
      readerSegment: normalizeOptionalText(annotation.readerSegment),
    }))
    .filter(annotation => annotation.delayedRememberedMoment.length > 0);
}

function evaluateSceneRecallEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  annotations: ReaderResponseSceneRecallAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseSceneRecallEvidenceStatus;
  score: number;
  issues: string[];
  unpromptedCount: number;
  distinctiveCount: number;
} {
  if (!evidence) {
    return {
      status: options.requireSceneRecallEvidenceForTuning ? 'none' : 'usable',
      score: options.requireSceneRecallEvidenceForTuning ? 0 : 100,
      issues: options.requireSceneRecallEvidenceForTuning
        ? ['Reader sample lacks unprompted scene-recall evidence.']
        : [],
      unpromptedCount: 0,
      distinctiveCount: 0,
    };
  }

  const annotationRecallCount = countAnnotationReaders(annotations);
  const annotationDistinctiveCount = countAnnotationReaders(
    annotations.filter(isDistinctiveSceneRecallAnnotation)
  );
  const unpromptedCount = Math.max(evidence.unpromptedSceneRecallCount ?? 0, annotationRecallCount);
  const distinctiveCount = Math.max(evidence.distinctiveSceneRecallCount ?? 0, annotationDistinctiveCount);
  const unpromptedRatio = calculateRatio(unpromptedCount, respondentCount);
  const distinctiveRatio = calculateRatio(distinctiveCount, respondentCount);
  const hasAnySceneRecallEvidence =
    evidence.unpromptedSceneRecallCount !== undefined ||
    evidence.distinctiveSceneRecallCount !== undefined ||
    annotations.length > 0;

  if (!hasAnySceneRecallEvidence && !options.requireSceneRecallEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      unpromptedCount: 0,
      distinctiveCount: 0,
    };
  }

  const issues: string[] = [];
  if (!hasAnySceneRecallEvidence) {
    issues.push('Reader sample lacks unprompted scene-recall counts or scene_recall_annotations.');
  }
  if (unpromptedRatio < options.minimumUnpromptedSceneRecallRatio) {
    issues.push(
      `unprompted scene recall coverage ${roundScore(unpromptedRatio * 100)}% is below ${roundScore(options.minimumUnpromptedSceneRecallRatio * 100)}%.`
    );
  }
  if (distinctiveRatio < options.minimumDistinctiveSceneRecallRatio) {
    issues.push(
      `distinctive scene recall coverage ${roundScore(distinctiveRatio * 100)}% is below ${roundScore(options.minimumDistinctiveSceneRecallRatio * 100)}%.`
    );
  }
  if (annotations.length < options.minimumSceneRecallAnnotationCount) {
    issues.push(
      `scene_recall_annotations ${annotations.length} are below ${options.minimumSceneRecallAnnotationCount}.`
    );
  }

  const score = roundScore(
    (calculateThresholdProgress(unpromptedRatio, options.minimumUnpromptedSceneRecallRatio) * 45) +
    (calculateThresholdProgress(distinctiveRatio, options.minimumDistinctiveSceneRecallRatio) * 45) +
    (calculateThresholdProgress(annotations.length, options.minimumSceneRecallAnnotationCount) * 10)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnySceneRecallEvidence ? 'weak' : 'none',
    score,
    issues,
    unpromptedCount,
    distinctiveCount,
  };
}

function countAnnotationReaders(annotations: ReaderResponseSceneRecallAnnotation[]): number {
  return annotations.reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
}

function isDistinctiveSceneRecallAnnotation(annotation: ReaderResponseSceneRecallAnnotation): boolean {
  return annotation.location !== undefined &&
    annotation.distinctiveDetail !== undefined &&
    annotation.rememberedMoment.length > 0;
}

function evaluateTensionTraceEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  annotations: ReaderResponseTensionTraceAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseTensionTraceEvidenceStatus;
  score: number;
  issues: string[];
  tracePointCount: number;
  peakCount: number;
  questionCount: number;
} {
  if (!evidence) {
    return {
      status: options.requireTensionTraceEvidenceForTuning ? 'none' : 'usable',
      score: options.requireTensionTraceEvidenceForTuning ? 0 : 100,
      issues: options.requireTensionTraceEvidenceForTuning
        ? ['Reader sample lacks scene-level tension trace evidence.']
        : [],
      tracePointCount: 0,
      peakCount: 0,
      questionCount: 0,
    };
  }

  const annotationTracePointCount = countTensionTraceAnnotationReaders(annotations);
  const annotationPeakCount = countTensionTraceAnnotationReaders(
    annotations.filter(isTensionPeakAnnotation)
  );
  const annotationQuestionCount = countTensionTraceAnnotationReaders(
    annotations.filter(isTensionQuestionAnnotation)
  );
  const tracePointCount = Math.max(evidence.tensionTracePointCount ?? 0, annotationTracePointCount);
  const peakCount = Math.max(evidence.tensionPeakCount ?? 0, annotationPeakCount);
  const questionCount = Math.max(evidence.tensionQuestionCount ?? 0, annotationQuestionCount);
  const traceRatio = calculateRatio(tracePointCount, respondentCount);
  const peakRatio = calculateRatio(peakCount, respondentCount);
  const questionRatio = calculateRatio(questionCount, respondentCount);
  const hasAnyTensionTraceEvidence =
    evidence.tensionTracePointCount !== undefined ||
    evidence.tensionPeakCount !== undefined ||
    evidence.tensionQuestionCount !== undefined ||
    annotations.length > 0;

  if (!hasAnyTensionTraceEvidence && !options.requireTensionTraceEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      tracePointCount: 0,
      peakCount: 0,
      questionCount: 0,
    };
  }

  const issues: string[] = [];
  if (!hasAnyTensionTraceEvidence) {
    issues.push('Reader sample lacks tension trace counts or tension_trace_annotations.');
  }
  if (traceRatio < options.minimumTensionTraceRatio) {
    issues.push(
      `tension trace coverage ${roundScore(traceRatio * 100)}% is below ${roundScore(options.minimumTensionTraceRatio * 100)}%.`
    );
  }
  if (peakRatio < options.minimumTensionPeakRatio) {
    issues.push(
      `tension peak coverage ${roundScore(peakRatio * 100)}% is below ${roundScore(options.minimumTensionPeakRatio * 100)}%.`
    );
  }
  if (questionRatio < options.minimumTensionQuestionRatio) {
    issues.push(
      `tension question coverage ${roundScore(questionRatio * 100)}% is below ${roundScore(options.minimumTensionQuestionRatio * 100)}%.`
    );
  }
  if (annotations.length < options.minimumTensionTraceAnnotationCount) {
    issues.push(
      `tension_trace_annotations ${annotations.length} are below ${options.minimumTensionTraceAnnotationCount}.`
    );
  }

  const score = roundScore(
    (calculateThresholdProgress(traceRatio, options.minimumTensionTraceRatio) * 35) +
    (calculateThresholdProgress(peakRatio, options.minimumTensionPeakRatio) * 30) +
    (calculateThresholdProgress(questionRatio, options.minimumTensionQuestionRatio) * 25) +
    (calculateThresholdProgress(annotations.length, options.minimumTensionTraceAnnotationCount) * 10)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnyTensionTraceEvidence ? 'weak' : 'none',
    score,
    issues,
    tracePointCount,
    peakCount,
    questionCount,
  };
}

function countTensionTraceAnnotationReaders(annotations: ReaderResponseTensionTraceAnnotation[]): number {
  return annotations.reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
}

function isTensionPeakAnnotation(annotation: ReaderResponseTensionTraceAnnotation): boolean {
  return (annotation.suspenseLevel ?? 0) >= 75 ||
    (annotation.curiosityLevel ?? 0) >= 75 ||
    (annotation.surpriseLevel ?? 0) >= 75;
}

function isTensionQuestionAnnotation(annotation: ReaderResponseTensionTraceAnnotation): boolean {
  return annotation.narrativeQuestion !== undefined || annotation.stakeOrRisk !== undefined;
}

function evaluateNarrativeForecastEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  annotations: ReaderResponseNarrativeForecastAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseNarrativeForecastEvidenceStatus;
  score: number;
  issues: string[];
  predictionCount: number;
  diversityCount: number;
  revisionCount: number;
  mismatchCount: number;
  inflectionCount: number;
} {
  if (!evidence) {
    return {
      status: options.requireNarrativeForecastEvidenceForTuning ? 'none' : 'usable',
      score: options.requireNarrativeForecastEvidenceForTuning ? 0 : 100,
      issues: options.requireNarrativeForecastEvidenceForTuning
        ? ['Reader sample lacks narrative forecast evidence.']
        : [],
      predictionCount: 0,
      diversityCount: 0,
      revisionCount: 0,
      mismatchCount: 0,
      inflectionCount: 0,
    };
  }

  const annotationPredictionCount = countNarrativeForecastAnnotationReaders(annotations);
  const annotationRevisionCount = countNarrativeForecastAnnotationReaders(
    annotations.filter(isForecastRevisionAnnotation)
  );
  const annotationMismatchCount = countNarrativeForecastAnnotationReaders(
    annotations.filter(isForecastMismatchAnnotation)
  );
  const annotationInflectionCount = countNarrativeForecastAnnotationReaders(
    annotations.filter(isForecastInflectionAnnotation)
  );
  const annotationDiversityCount = new Set(
    annotations.map(annotation => annotation.initialPrediction.trim().toLowerCase())
  ).size;
  const predictionCount = Math.max(evidence.forecastPredictionCount ?? 0, annotationPredictionCount);
  const diversityCount = Math.max(evidence.forecastDiversityCount ?? 0, annotationDiversityCount);
  const revisionCount = Math.max(evidence.forecastRevisionCount ?? 0, annotationRevisionCount);
  const mismatchCount = Math.max(evidence.forecastMismatchCount ?? 0, annotationMismatchCount);
  const inflectionCount = Math.max(evidence.forecastInflectionCount ?? 0, annotationInflectionCount);
  const predictionRatio = calculateRatio(predictionCount, respondentCount);
  const revisionRatio = calculateRatio(revisionCount, respondentCount);
  const mismatchRatio = calculateRatio(mismatchCount, respondentCount);
  const hasAnyForecastEvidence =
    evidence.forecastPredictionCount !== undefined ||
    evidence.forecastDiversityCount !== undefined ||
    evidence.forecastRevisionCount !== undefined ||
    evidence.forecastMismatchCount !== undefined ||
    evidence.forecastInflectionCount !== undefined ||
    annotations.length > 0;

  if (!hasAnyForecastEvidence && !options.requireNarrativeForecastEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      predictionCount: 0,
      diversityCount: 0,
      revisionCount: 0,
      mismatchCount: 0,
      inflectionCount: 0,
    };
  }

  const issues: string[] = [];
  if (!hasAnyForecastEvidence) {
    issues.push('Reader sample lacks narrative forecast counts or narrative_forecast_annotations.');
  }
  if (predictionRatio < options.minimumForecastPredictionRatio) {
    issues.push(
      `narrative forecast prediction coverage ${roundScore(predictionRatio * 100)}% is below ${roundScore(options.minimumForecastPredictionRatio * 100)}%.`
    );
  }
  if (diversityCount < options.minimumForecastDiversityCount) {
    issues.push(
      `narrative forecast diversity ${diversityCount} is below ${options.minimumForecastDiversityCount}.`
    );
  }
  if (revisionRatio < options.minimumForecastRevisionRatio) {
    issues.push(
      `narrative forecast revision coverage ${roundScore(revisionRatio * 100)}% is below ${roundScore(options.minimumForecastRevisionRatio * 100)}%.`
    );
  }
  if (mismatchRatio < options.minimumForecastMismatchRatio) {
    issues.push(
      `narrative forecast mismatch coverage ${roundScore(mismatchRatio * 100)}% is below ${roundScore(options.minimumForecastMismatchRatio * 100)}%.`
    );
  }
  if (annotations.length < options.minimumNarrativeForecastAnnotationCount) {
    issues.push(
      `narrative_forecast_annotations ${annotations.length} are below ${options.minimumNarrativeForecastAnnotationCount}.`
    );
  }

  const score = roundScore(
    (calculateThresholdProgress(predictionRatio, options.minimumForecastPredictionRatio) * 25) +
    (calculateThresholdProgress(diversityCount, options.minimumForecastDiversityCount) * 20) +
    (calculateThresholdProgress(revisionRatio, options.minimumForecastRevisionRatio) * 25) +
    (calculateThresholdProgress(mismatchRatio, options.minimumForecastMismatchRatio) * 20) +
    (calculateThresholdProgress(annotations.length, options.minimumNarrativeForecastAnnotationCount) * 10)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnyForecastEvidence ? 'weak' : 'none',
    score,
    issues,
    predictionCount,
    diversityCount,
    revisionCount,
    mismatchCount,
    inflectionCount,
  };
}

function countNarrativeForecastAnnotationReaders(
  annotations: ReaderResponseNarrativeForecastAnnotation[]
): number {
  return annotations.reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
}

function isForecastRevisionAnnotation(annotation: ReaderResponseNarrativeForecastAnnotation): boolean {
  return annotation.revisedPrediction !== undefined || annotation.predictionShift !== undefined;
}

function isForecastMismatchAnnotation(annotation: ReaderResponseNarrativeForecastAnnotation): boolean {
  if (annotation.predictionMismatch !== undefined) {
    return annotation.predictionMismatch;
  }
  return annotation.actualOutcome !== undefined && annotation.surpriseOrTensionReason !== undefined;
}

function isForecastInflectionAnnotation(annotation: ReaderResponseNarrativeForecastAnnotation): boolean {
  return annotation.predictionShift !== undefined || annotation.surpriseOrTensionReason !== undefined;
}

function evaluateLineQuoteEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  annotations: ReaderResponseLineQuoteAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseLineQuoteEvidenceStatus;
  score: number;
  issues: string[];
  quoteRecallCount: number;
  favoriteLineCount: number;
  shareableLineCount: number;
} {
  if (!evidence) {
    return {
      status: options.requireLineQuoteEvidenceForTuning ? 'none' : 'usable',
      score: options.requireLineQuoteEvidenceForTuning ? 0 : 100,
      issues: options.requireLineQuoteEvidenceForTuning
        ? ['Reader sample lacks memorable line quote evidence.']
        : [],
      quoteRecallCount: 0,
      favoriteLineCount: 0,
      shareableLineCount: 0,
    };
  }

  const annotationQuoteRecallCount = countLineQuoteAnnotationReaders(annotations);
  const annotationFavoriteLineCount = countLineQuoteAnnotationReaders(
    annotations.filter(isFavoriteLineQuoteAnnotation)
  );
  const annotationShareableLineCount = countLineQuoteAnnotationReaders(
    annotations.filter(isShareableLineQuoteAnnotation)
  );
  const quoteRecallCount = Math.max(evidence.quoteRecallCount ?? 0, annotationQuoteRecallCount);
  const favoriteLineCount = Math.max(evidence.favoriteLineCount ?? 0, annotationFavoriteLineCount);
  const shareableLineCount = Math.max(evidence.shareableLineCount ?? 0, annotationShareableLineCount);
  const quoteRecallRatio = calculateRatio(quoteRecallCount, respondentCount);
  const favoriteLineRatio = calculateRatio(favoriteLineCount, respondentCount);
  const shareableLineRatio = calculateRatio(shareableLineCount, respondentCount);
  const hasAnyLineQuoteEvidence =
    evidence.quoteRecallCount !== undefined ||
    evidence.favoriteLineCount !== undefined ||
    evidence.shareableLineCount !== undefined ||
    annotations.length > 0;

  if (!hasAnyLineQuoteEvidence && !options.requireLineQuoteEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      quoteRecallCount: 0,
      favoriteLineCount: 0,
      shareableLineCount: 0,
    };
  }

  const issues: string[] = [];
  if (!hasAnyLineQuoteEvidence) {
    issues.push('Reader sample lacks quote recall counts or line_quote_annotations.');
  }
  if (quoteRecallRatio < options.minimumQuoteRecallRatio) {
    issues.push(
      `quote recall coverage ${roundScore(quoteRecallRatio * 100)}% is below ${roundScore(options.minimumQuoteRecallRatio * 100)}%.`
    );
  }
  if (favoriteLineRatio < options.minimumFavoriteLineRatio) {
    issues.push(
      `favorite line coverage ${roundScore(favoriteLineRatio * 100)}% is below ${roundScore(options.minimumFavoriteLineRatio * 100)}%.`
    );
  }
  if (shareableLineRatio < options.minimumShareableLineRatio) {
    issues.push(
      `shareable line coverage ${roundScore(shareableLineRatio * 100)}% is below ${roundScore(options.minimumShareableLineRatio * 100)}%.`
    );
  }
  if (annotations.length < options.minimumLineQuoteAnnotationCount) {
    issues.push(
      `line_quote_annotations ${annotations.length} are below ${options.minimumLineQuoteAnnotationCount}.`
    );
  }

  const score = roundScore(
    (calculateThresholdProgress(quoteRecallRatio, options.minimumQuoteRecallRatio) * 35) +
    (calculateThresholdProgress(favoriteLineRatio, options.minimumFavoriteLineRatio) * 30) +
    (calculateThresholdProgress(shareableLineRatio, options.minimumShareableLineRatio) * 25) +
    (calculateThresholdProgress(annotations.length, options.minimumLineQuoteAnnotationCount) * 10)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnyLineQuoteEvidence ? 'weak' : 'none',
    score,
    issues,
    quoteRecallCount,
    favoriteLineCount,
    shareableLineCount,
  };
}

function countLineQuoteAnnotationReaders(annotations: ReaderResponseLineQuoteAnnotation[]): number {
  return annotations.reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
}

function isFavoriteLineQuoteAnnotation(annotation: ReaderResponseLineQuoteAnnotation): boolean {
  return annotation.appealReason !== undefined || annotation.lineFunction !== undefined;
}

function isShareableLineQuoteAnnotation(annotation: ReaderResponseLineQuoteAnnotation): boolean {
  return annotation.shareReason !== undefined;
}

function evaluatePayoffFairnessEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  annotations: ReaderResponsePayoffFairnessAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponsePayoffFairnessEvidenceStatus;
  score: number;
  issues: string[];
  setupRecallCount: number;
  triggerRecognitionCount: number;
  earnedCount: number;
  recontextualizationCount: number;
  emotionalSatisfactionCount: number;
} {
  if (!evidence) {
    return {
      status: options.requirePayoffFairnessEvidenceForTuning ? 'none' : 'usable',
      score: options.requirePayoffFairnessEvidenceForTuning ? 0 : 100,
      issues: options.requirePayoffFairnessEvidenceForTuning
        ? ['Reader sample lacks payoff fairness evidence.']
        : [],
      setupRecallCount: 0,
      triggerRecognitionCount: 0,
      earnedCount: 0,
      recontextualizationCount: 0,
      emotionalSatisfactionCount: 0,
    };
  }

  const annotationSetupRecallCount = countPayoffFairnessAnnotationReaders(
    annotations.filter(annotation => annotation.rememberedSetup !== undefined)
  );
  const annotationTriggerRecognitionCount = countPayoffFairnessAnnotationReaders(
    annotations.filter(annotation => annotation.triggerOrReveal !== undefined)
  );
  const annotationEarnedCount = countPayoffFairnessAnnotationReaders(
    annotations.filter(isEarnedPayoffAnnotation)
  );
  const annotationRecontextualizationCount = countPayoffFairnessAnnotationReaders(
    annotations.filter(annotation => annotation.changedInterpretation !== undefined)
  );
  const annotationEmotionalSatisfactionCount = countPayoffFairnessAnnotationReaders(
    annotations.filter(annotation => annotation.emotionalPayoffReason !== undefined)
  );
  const setupRecallCount = Math.max(evidence.payoffSetupRecallCount ?? 0, annotationSetupRecallCount);
  const triggerRecognitionCount = Math.max(
    evidence.payoffTriggerRecognitionCount ?? 0,
    annotationTriggerRecognitionCount
  );
  const earnedCount = Math.max(evidence.payoffEarnedCount ?? 0, annotationEarnedCount);
  const recontextualizationCount = Math.max(
    evidence.payoffRecontextualizationCount ?? 0,
    annotationRecontextualizationCount
  );
  const emotionalSatisfactionCount = Math.max(
    evidence.payoffEmotionalSatisfactionCount ?? 0,
    annotationEmotionalSatisfactionCount
  );
  const setupRecallRatio = calculateRatio(setupRecallCount, respondentCount);
  const triggerRecognitionRatio = calculateRatio(triggerRecognitionCount, respondentCount);
  const earnedRatio = calculateRatio(earnedCount, respondentCount);
  const recontextualizationRatio = calculateRatio(recontextualizationCount, respondentCount);
  const emotionalSatisfactionRatio = calculateRatio(emotionalSatisfactionCount, respondentCount);
  const hasAnyPayoffFairnessEvidence =
    evidence.payoffSetupRecallCount !== undefined ||
    evidence.payoffTriggerRecognitionCount !== undefined ||
    evidence.payoffEarnedCount !== undefined ||
    evidence.payoffRecontextualizationCount !== undefined ||
    evidence.payoffEmotionalSatisfactionCount !== undefined ||
    annotations.length > 0;

  if (!hasAnyPayoffFairnessEvidence && !options.requirePayoffFairnessEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      setupRecallCount: 0,
      triggerRecognitionCount: 0,
      earnedCount: 0,
      recontextualizationCount: 0,
      emotionalSatisfactionCount: 0,
    };
  }

  const issues: string[] = [];
  if (!hasAnyPayoffFairnessEvidence) {
    issues.push('Reader sample lacks payoff fairness counts or payoff_fairness_annotations.');
  }
  if (setupRecallRatio < options.minimumPayoffSetupRecallRatio) {
    issues.push(
      `payoff setup recall coverage ${roundScore(setupRecallRatio * 100)}% is below ${roundScore(options.minimumPayoffSetupRecallRatio * 100)}%.`
    );
  }
  if (triggerRecognitionRatio < options.minimumPayoffTriggerRecognitionRatio) {
    issues.push(
      `payoff trigger recognition coverage ${roundScore(triggerRecognitionRatio * 100)}% is below ${roundScore(options.minimumPayoffTriggerRecognitionRatio * 100)}%.`
    );
  }
  if (earnedRatio < options.minimumPayoffEarnedRatio) {
    issues.push(
      `earned payoff coverage ${roundScore(earnedRatio * 100)}% is below ${roundScore(options.minimumPayoffEarnedRatio * 100)}%.`
    );
  }
  if (recontextualizationRatio < options.minimumPayoffRecontextualizationRatio) {
    issues.push(
      `payoff recontextualization coverage ${roundScore(recontextualizationRatio * 100)}% is below ${roundScore(options.minimumPayoffRecontextualizationRatio * 100)}%.`
    );
  }
  if (emotionalSatisfactionRatio < options.minimumPayoffEmotionalSatisfactionRatio) {
    issues.push(
      `payoff emotional satisfaction coverage ${roundScore(emotionalSatisfactionRatio * 100)}% is below ${roundScore(options.minimumPayoffEmotionalSatisfactionRatio * 100)}%.`
    );
  }
  if (annotations.length < options.minimumPayoffFairnessAnnotationCount) {
    issues.push(
      `payoff_fairness_annotations ${annotations.length} are below ${options.minimumPayoffFairnessAnnotationCount}.`
    );
  }

  const score = roundScore(
    (calculateThresholdProgress(setupRecallRatio, options.minimumPayoffSetupRecallRatio) * 20) +
    (calculateThresholdProgress(triggerRecognitionRatio, options.minimumPayoffTriggerRecognitionRatio) * 15) +
    (calculateThresholdProgress(earnedRatio, options.minimumPayoffEarnedRatio) * 25) +
    (calculateThresholdProgress(recontextualizationRatio, options.minimumPayoffRecontextualizationRatio) * 15) +
    (calculateThresholdProgress(emotionalSatisfactionRatio, options.minimumPayoffEmotionalSatisfactionRatio) * 15) +
    (calculateThresholdProgress(annotations.length, options.minimumPayoffFairnessAnnotationCount) * 10)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnyPayoffFairnessEvidence ? 'weak' : 'none',
    score,
    issues,
    setupRecallCount,
    triggerRecognitionCount,
    earnedCount,
    recontextualizationCount,
    emotionalSatisfactionCount,
  };
}

function countPayoffFairnessAnnotationReaders(
  annotations: ReaderResponsePayoffFairnessAnnotation[]
): number {
  return annotations.reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
}

function isEarnedPayoffAnnotation(annotation: ReaderResponsePayoffFairnessAnnotation): boolean {
  return annotation.earnedReason !== undefined && annotation.arbitraryOrCheatReason === undefined;
}

function evaluateAdvocacyEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  annotations: ReaderResponseAdvocacyAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseAdvocacyEvidenceStatus;
  score: number;
  issues: string[];
  organicRecommendationCount: number;
  discussionPromptCount: number;
} {
  if (!evidence) {
    return {
      status: options.requireAdvocacyEvidenceForTuning ? 'none' : 'usable',
      score: options.requireAdvocacyEvidenceForTuning ? 0 : 100,
      issues: options.requireAdvocacyEvidenceForTuning
        ? ['Reader sample lacks recommendation or discussion advocacy evidence.']
        : [],
      organicRecommendationCount: 0,
      discussionPromptCount: 0,
    };
  }

  const annotationRecommendationCount = countAdvocacyAnnotationReaders(annotations);
  const annotationDiscussionCount = countAdvocacyAnnotationReaders(
    annotations.filter(annotation => annotation.discussionPrompt !== undefined)
  );
  const organicRecommendationCount = Math.max(
    evidence.organicRecommendationCount ?? 0,
    annotationRecommendationCount
  );
  const discussionPromptCount = Math.max(
    evidence.discussionPromptCount ?? 0,
    annotationDiscussionCount
  );
  const organicRecommendationRatio = calculateRatio(organicRecommendationCount, respondentCount);
  const discussionPromptRatio = calculateRatio(discussionPromptCount, respondentCount);
  const hasAnyAdvocacyEvidence =
    evidence.organicRecommendationCount !== undefined ||
    evidence.discussionPromptCount !== undefined ||
    annotations.length > 0;

  if (!hasAnyAdvocacyEvidence && !options.requireAdvocacyEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      organicRecommendationCount: 0,
      discussionPromptCount: 0,
    };
  }

  const issues: string[] = [];
  if (!hasAnyAdvocacyEvidence) {
    issues.push('Reader sample lacks organic recommendation counts or advocacy_annotations.');
  }
  if (organicRecommendationRatio < options.minimumOrganicRecommendationRatio) {
    issues.push(
      `organic recommendation coverage ${roundScore(organicRecommendationRatio * 100)}% is below ${roundScore(options.minimumOrganicRecommendationRatio * 100)}%.`
    );
  }
  if (discussionPromptRatio < options.minimumDiscussionPromptRatio) {
    issues.push(
      `discussion prompt coverage ${roundScore(discussionPromptRatio * 100)}% is below ${roundScore(options.minimumDiscussionPromptRatio * 100)}%.`
    );
  }
  if (annotations.length < options.minimumAdvocacyAnnotationCount) {
    issues.push(
      `advocacy_annotations ${annotations.length} are below ${options.minimumAdvocacyAnnotationCount}.`
    );
  }

  const score = roundScore(
    (calculateThresholdProgress(organicRecommendationRatio, options.minimumOrganicRecommendationRatio) * 45) +
    (calculateThresholdProgress(discussionPromptRatio, options.minimumDiscussionPromptRatio) * 35) +
    (calculateThresholdProgress(annotations.length, options.minimumAdvocacyAnnotationCount) * 20)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnyAdvocacyEvidence ? 'weak' : 'none',
    score,
    issues,
    organicRecommendationCount,
    discussionPromptCount,
  };
}

function countAdvocacyAnnotationReaders(annotations: ReaderResponseAdvocacyAnnotation[]): number {
  return annotations.reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
}

function evaluateDurableEngagementEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  annotations: ReaderResponseDurableEngagementAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseDurableEngagementEvidenceStatus;
  score: number;
  issues: string[];
  bookmarkCount: number;
  followOrLibraryAddCount: number;
  returnNextDayCount: number;
  bingeReadIntentCount: number;
  paidContinuationIntentCount: number;
} {
  if (!evidence) {
    return {
      status: options.requireDurableEngagementEvidenceForTuning ? 'none' : 'usable',
      score: options.requireDurableEngagementEvidenceForTuning ? 0 : 100,
      issues: options.requireDurableEngagementEvidenceForTuning
        ? ['Reader sample lacks durable engagement evidence such as bookmark, follow, return, binge, or paid-continuation intent.']
        : [],
      bookmarkCount: 0,
      followOrLibraryAddCount: 0,
      returnNextDayCount: 0,
      bingeReadIntentCount: 0,
      paidContinuationIntentCount: 0,
    };
  }

  const annotationBookmarkCount = countDurableEngagementAnnotationReaders(annotations, ['bookmark']);
  const annotationFollowCount = countDurableEngagementAnnotationReaders(annotations, ['follow']);
  const annotationReturnCount = countDurableEngagementAnnotationReaders(annotations, ['return']);
  const annotationBingeCount = countDurableEngagementAnnotationReaders(annotations, ['binge']);
  const annotationPaidCount = countDurableEngagementAnnotationReaders(annotations, ['purchase']);
  const bookmarkCount = Math.max(evidence.bookmarkCount ?? 0, annotationBookmarkCount);
  const followOrLibraryAddCount = Math.max(evidence.followOrLibraryAddCount ?? 0, annotationFollowCount);
  const returnNextDayCount = Math.max(evidence.returnNextDayCount ?? 0, annotationReturnCount);
  const bingeReadIntentCount = Math.max(evidence.bingeReadIntentCount ?? 0, annotationBingeCount);
  const paidContinuationIntentCount = Math.max(evidence.paidContinuationIntentCount ?? 0, annotationPaidCount);
  const bookmarkEvidenceCount = Math.max(
    (evidence.bookmarkCount ?? 0) + (evidence.followOrLibraryAddCount ?? 0),
    annotationBookmarkCount + annotationFollowCount
  );
  const returnEvidenceCount = Math.max(
    (evidence.returnNextDayCount ?? 0) + (evidence.bingeReadIntentCount ?? 0),
    annotationReturnCount + annotationBingeCount
  );
  const paidEvidenceCount = Math.max(
    evidence.paidContinuationIntentCount ?? 0,
    annotationPaidCount
  );
  const bookmarkRatio = calculateRatio(bookmarkEvidenceCount, respondentCount);
  const returnRatio = calculateRatio(returnEvidenceCount, respondentCount);
  const paidRatio = calculateRatio(paidEvidenceCount, respondentCount);
  const hasAnyDurableEngagementEvidence =
    evidence.bookmarkCount !== undefined ||
    evidence.followOrLibraryAddCount !== undefined ||
    evidence.returnNextDayCount !== undefined ||
    evidence.bingeReadIntentCount !== undefined ||
    evidence.paidContinuationIntentCount !== undefined ||
    annotations.length > 0;

  if (!hasAnyDurableEngagementEvidence && !options.requireDurableEngagementEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      bookmarkCount: 0,
      followOrLibraryAddCount: 0,
      returnNextDayCount: 0,
      bingeReadIntentCount: 0,
      paidContinuationIntentCount: 0,
    };
  }

  const retentionPathPass = bookmarkRatio >= options.minimumBookmarkRatio &&
    returnRatio >= options.minimumReturnIntentRatio;
  const paidPathPass = paidRatio >= options.minimumPaidContinuationIntentRatio;
  const issues: string[] = [];

  if (!hasAnyDurableEngagementEvidence) {
    issues.push('Reader sample lacks bookmark/follow/return/purchase counts or durable_engagement_annotations.');
  }
  if (!retentionPathPass && !paidPathPass) {
    if (bookmarkRatio < options.minimumBookmarkRatio) {
      issues.push(
        `bookmark or follow coverage ${roundScore(bookmarkRatio * 100)}% is below ${roundScore(options.minimumBookmarkRatio * 100)}%.`
      );
    }
    if (returnRatio < options.minimumReturnIntentRatio) {
      issues.push(
        `return or binge intent coverage ${roundScore(returnRatio * 100)}% is below ${roundScore(options.minimumReturnIntentRatio * 100)}%.`
      );
    }
    if (paidRatio < options.minimumPaidContinuationIntentRatio) {
      issues.push(
        `paid continuation intent coverage ${roundScore(paidRatio * 100)}% is below ${roundScore(options.minimumPaidContinuationIntentRatio * 100)}%.`
      );
    }
  }
  if (annotations.length < options.minimumDurableEngagementAnnotationCount) {
    issues.push(
      `durable_engagement_annotations ${annotations.length} are below ${options.minimumDurableEngagementAnnotationCount}.`
    );
  }

  const retentionPathScore =
    (calculateThresholdProgress(bookmarkRatio, options.minimumBookmarkRatio) * 40) +
    (calculateThresholdProgress(returnRatio, options.minimumReturnIntentRatio) * 40);
  const paidPathScore = calculateThresholdProgress(paidRatio, options.minimumPaidContinuationIntentRatio) * 80;
  const score = roundScore(
    Math.max(retentionPathScore, paidPathScore) +
    (calculateThresholdProgress(annotations.length, options.minimumDurableEngagementAnnotationCount) * 20)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnyDurableEngagementEvidence ? 'weak' : 'none',
    score,
    issues,
    bookmarkCount,
    followOrLibraryAddCount,
    returnNextDayCount,
    bingeReadIntentCount,
    paidContinuationIntentCount,
  };
}

function countDurableEngagementAnnotationReaders(
  annotations: ReaderResponseDurableEngagementAnnotation[],
  actions: ReaderResponseDurableEngagementAction[]
): number {
  const actionSet = new Set(actions);
  return annotations
    .filter(annotation => annotation.intendedAction !== undefined && actionSet.has(annotation.intendedAction))
    .reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
}

function evaluateContinuationBehaviorEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseContinuationBehaviorEvidenceStatus;
  score: number;
  issues: string[];
  impressionCount: number;
  clickCount: number;
  openCount: number;
  readStartCount: number;
  clickThroughRatio?: number;
  openRatio?: number;
  readStartRatio?: number;
} {
  if (!evidence) {
    return {
      status: options.requireContinuationBehaviorEvidenceForTuning ? 'none' : 'usable',
      score: options.requireContinuationBehaviorEvidenceForTuning ? 0 : 100,
      issues: options.requireContinuationBehaviorEvidenceForTuning
        ? ['Reader sample lacks actual next-chapter continuation behavior evidence.']
        : [],
      impressionCount: 0,
      clickCount: 0,
      openCount: 0,
      readStartCount: 0,
    };
  }

  const impressionCount = evidence.nextChapterCtaImpressionCount ?? 0;
  const clickCount = evidence.nextChapterClickCount ?? 0;
  const openCount = evidence.nextChapterOpenCount ?? 0;
  const readStartCount = evidence.nextChapterReadStartCount ?? 0;
  const clickThroughRatio = impressionCount > 0 ? clickCount / impressionCount : undefined;
  const openRatio = impressionCount > 0 ? openCount / impressionCount : undefined;
  const readStartRatio = impressionCount > 0 ? readStartCount / impressionCount : undefined;
  const hasAnyContinuationBehaviorEvidence =
    evidence.nextChapterCtaImpressionCount !== undefined ||
    evidence.nextChapterClickCount !== undefined ||
    evidence.nextChapterOpenCount !== undefined ||
    evidence.nextChapterReadStartCount !== undefined;

  if (!hasAnyContinuationBehaviorEvidence && !options.requireContinuationBehaviorEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      impressionCount: 0,
      clickCount: 0,
      openCount: 0,
      readStartCount: 0,
    };
  }

  const issues: string[] = [];
  if (!hasAnyContinuationBehaviorEvidence) {
    issues.push('Reader sample lacks next_chapter_cta_impression_count and next-chapter click/open/read-start behavior counts.');
  }
  if (impressionCount < options.minimumContinuationBehaviorImpressionCount) {
    issues.push(
      `next chapter CTA impressions ${impressionCount} are below ${options.minimumContinuationBehaviorImpressionCount}.`
    );
  }
  if ((clickThroughRatio ?? 0) < options.minimumNextChapterClickThroughRatio) {
    issues.push(
      `next chapter click-through ${roundScore((clickThroughRatio ?? 0) * 100)}% is below ${roundScore(options.minimumNextChapterClickThroughRatio * 100)}%.`
    );
  }
  if (
    (openRatio ?? 0) < options.minimumNextChapterOpenRatio &&
    (readStartRatio ?? 0) < options.minimumNextChapterReadStartRatio
  ) {
    issues.push(
      `next chapter open/read-start behavior is below thresholds: open ${roundScore((openRatio ?? 0) * 100)}% < ${roundScore(options.minimumNextChapterOpenRatio * 100)}%, read-start ${roundScore((readStartRatio ?? 0) * 100)}% < ${roundScore(options.minimumNextChapterReadStartRatio * 100)}%.`
    );
  }

  const score = roundScore(
    (calculateThresholdProgress(impressionCount, options.minimumContinuationBehaviorImpressionCount) * 25) +
    (calculateThresholdProgress(clickThroughRatio ?? 0, options.minimumNextChapterClickThroughRatio) * 35) +
    (calculateThresholdProgress(openRatio ?? 0, options.minimumNextChapterOpenRatio) * 25) +
    (calculateThresholdProgress(readStartRatio ?? 0, options.minimumNextChapterReadStartRatio) * 15)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnyContinuationBehaviorEvidence ? 'weak' : 'none',
    score,
    issues,
    impressionCount,
    clickCount,
    openCount,
    readStartCount,
    clickThroughRatio,
    openRatio,
    readStartRatio,
  };
}

function evaluateResonanceEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  annotations: ReaderResponseResonanceAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseResonanceEvidenceStatus;
  score: number;
  issues: string[];
  lingeringEmotionCount: number;
  reflectiveMeaningCount: number;
} {
  if (!evidence) {
    return {
      status: options.requireResonanceEvidenceForTuning ? 'none' : 'usable',
      score: options.requireResonanceEvidenceForTuning ? 0 : 100,
      issues: options.requireResonanceEvidenceForTuning
        ? ['Reader sample lacks post-reading emotional resonance evidence.']
        : [],
      lingeringEmotionCount: 0,
      reflectiveMeaningCount: 0,
    };
  }

  const annotationLingeringEmotionCount = countResonanceAnnotationReaders(annotations);
  const annotationReflectiveMeaningCount = countResonanceAnnotationReaders(
    annotations.filter(isReflectiveResonanceAnnotation)
  );
  const lingeringEmotionCount = Math.max(
    evidence.lingeringEmotionCount ?? 0,
    annotationLingeringEmotionCount
  );
  const reflectiveMeaningCount = Math.max(
    (evidence.reflectiveCommentCount ?? 0) + (evidence.personalMemoryOrMeaningCount ?? 0),
    annotationReflectiveMeaningCount
  );
  const lingeringEmotionRatio = calculateRatio(lingeringEmotionCount, respondentCount);
  const reflectiveMeaningRatio = calculateRatio(reflectiveMeaningCount, respondentCount);
  const hasAnyResonanceEvidence =
    evidence.lingeringEmotionCount !== undefined ||
    evidence.reflectiveCommentCount !== undefined ||
    evidence.personalMemoryOrMeaningCount !== undefined ||
    annotations.length > 0;

  if (!hasAnyResonanceEvidence && !options.requireResonanceEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      lingeringEmotionCount: 0,
      reflectiveMeaningCount: 0,
    };
  }

  const issues: string[] = [];
  if (!hasAnyResonanceEvidence) {
    issues.push('Reader sample lacks lingering emotion, reflective meaning counts, or resonance_annotations.');
  }
  if (lingeringEmotionRatio < options.minimumLingeringEmotionRatio) {
    issues.push(
      `lingering emotion coverage ${roundScore(lingeringEmotionRatio * 100)}% is below ${roundScore(options.minimumLingeringEmotionRatio * 100)}%.`
    );
  }
  if (reflectiveMeaningRatio < options.minimumReflectiveMeaningRatio) {
    issues.push(
      `reflective meaning coverage ${roundScore(reflectiveMeaningRatio * 100)}% is below ${roundScore(options.minimumReflectiveMeaningRatio * 100)}%.`
    );
  }
  if (annotations.length < options.minimumResonanceAnnotationCount) {
    issues.push(
      `resonance_annotations ${annotations.length} are below ${options.minimumResonanceAnnotationCount}.`
    );
  }

  const score = roundScore(
    (calculateThresholdProgress(lingeringEmotionRatio, options.minimumLingeringEmotionRatio) * 40) +
    (calculateThresholdProgress(reflectiveMeaningRatio, options.minimumReflectiveMeaningRatio) * 40) +
    (calculateThresholdProgress(annotations.length, options.minimumResonanceAnnotationCount) * 20)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnyResonanceEvidence ? 'weak' : 'none',
    score,
    issues,
    lingeringEmotionCount,
    reflectiveMeaningCount,
  };
}

function countResonanceAnnotationReaders(annotations: ReaderResponseResonanceAnnotation[]): number {
  return annotations.reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
}

function isReflectiveResonanceAnnotation(annotation: ReaderResponseResonanceAnnotation): boolean {
  return annotation.reflectiveQuestion !== undefined ||
    annotation.personalMeaning !== undefined ||
    annotation.rememberedImage !== undefined;
}

function evaluateDelayedMemoryEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  respondentCount: number,
  annotations: ReaderResponseDelayedMemoryAnnotation[],
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseDelayedMemoryEvidenceStatus;
  score: number;
  issues: string[];
  followUpRespondentCount: number;
  followUpHours?: number;
  sceneRecallCount: number;
  characterRecallCount: number;
  continuationIntentCount: number;
  nextClickIntentCount: number;
  returnIntentCount: number;
  paidContinuationIntentCount: number;
} {
  if (!evidence) {
    return {
      status: options.requireDelayedMemoryEvidenceForTuning ? 'none' : 'usable',
      score: options.requireDelayedMemoryEvidenceForTuning ? 0 : 100,
      issues: options.requireDelayedMemoryEvidenceForTuning
        ? ['Reader sample lacks delayed memory follow-up evidence.']
        : [],
      followUpRespondentCount: 0,
      sceneRecallCount: 0,
      characterRecallCount: 0,
      continuationIntentCount: 0,
      nextClickIntentCount: 0,
      returnIntentCount: 0,
      paidContinuationIntentCount: 0,
    };
  }

  const annotationSceneRecallCount = countDelayedMemoryAnnotationReaders(annotations);
  const annotationCharacterRecallCount = countDelayedMemoryAnnotationReaders(
    annotations.filter(annotation => annotation.delayedCharacterOrRelationship !== undefined)
  );
  const annotationContinuationIntentCount = countDelayedMemoryAnnotationReaders(
    annotations.filter(annotation => (
      annotation.delayedNextQuestion !== undefined ||
      annotation.returnOrPurchaseReason !== undefined
    ))
  );
  const followUpRespondentCount = evidence.delayedFollowUpRespondentCount ?? 0;
  const followUpHours = normalizeNonNegativeNumber(evidence.delayedFollowUpHours);
  const sceneRecallCount = Math.max(evidence.delayedSceneRecallCount ?? 0, annotationSceneRecallCount);
  const characterRecallCount = Math.max(evidence.delayedCharacterRecallCount ?? 0, annotationCharacterRecallCount);
  const nextClickIntentCount = evidence.delayedNextClickIntentCount ?? 0;
  const returnIntentCount = evidence.delayedReturnIntentCount ?? 0;
  const paidContinuationIntentCount = evidence.delayedPaidContinuationIntentCount ?? 0;
  const continuationIntentCount = Math.max(
    nextClickIntentCount,
    returnIntentCount,
    paidContinuationIntentCount,
    annotationContinuationIntentCount
  );
  const followUpRatio = calculateRatio(followUpRespondentCount, respondentCount);
  const sceneRecallRatio = calculateRatio(sceneRecallCount, respondentCount);
  const characterRecallRatio = calculateRatio(characterRecallCount, respondentCount);
  const continuationIntentRatio = calculateRatio(continuationIntentCount, respondentCount);
  const hasAnyDelayedMemoryEvidence =
    evidence.delayedFollowUpRespondentCount !== undefined ||
    evidence.delayedFollowUpHours !== undefined ||
    evidence.delayedSceneRecallCount !== undefined ||
    evidence.delayedCharacterRecallCount !== undefined ||
    evidence.delayedNextClickIntentCount !== undefined ||
    evidence.delayedReturnIntentCount !== undefined ||
    evidence.delayedPaidContinuationIntentCount !== undefined ||
    annotations.length > 0;

  if (!hasAnyDelayedMemoryEvidence && !options.requireDelayedMemoryEvidenceForTuning) {
    return {
      status: 'usable',
      score: 100,
      issues: [],
      followUpRespondentCount: 0,
      followUpHours,
      sceneRecallCount: 0,
      characterRecallCount: 0,
      continuationIntentCount: 0,
      nextClickIntentCount: 0,
      returnIntentCount: 0,
      paidContinuationIntentCount: 0,
    };
  }

  const issues: string[] = [];
  if (!hasAnyDelayedMemoryEvidence) {
    issues.push('Reader sample lacks delayed follow-up counts or delayed_memory_annotations.');
  }
  if (followUpRatio < options.minimumDelayedFollowUpRespondentRatio) {
    issues.push(
      `delayed follow-up coverage ${roundScore(followUpRatio * 100)}% is below ${roundScore(options.minimumDelayedFollowUpRespondentRatio * 100)}%.`
    );
  }
  if (followUpHours === undefined || followUpHours < options.minimumDelayedFollowUpHours) {
    issues.push(
      `delayed follow-up interval ${followUpHours ?? 0}h is below ${options.minimumDelayedFollowUpHours}h.`
    );
  }
  if (sceneRecallRatio < options.minimumDelayedSceneRecallRatio) {
    issues.push(
      `delayed scene recall coverage ${roundScore(sceneRecallRatio * 100)}% is below ${roundScore(options.minimumDelayedSceneRecallRatio * 100)}%.`
    );
  }
  if (characterRecallRatio < options.minimumDelayedCharacterRecallRatio) {
    issues.push(
      `delayed character or relationship recall coverage ${roundScore(characterRecallRatio * 100)}% is below ${roundScore(options.minimumDelayedCharacterRecallRatio * 100)}%.`
    );
  }
  if (continuationIntentRatio < options.minimumDelayedContinuationIntentRatio) {
    issues.push(
      `delayed continuation intent coverage ${roundScore(continuationIntentRatio * 100)}% is below ${roundScore(options.minimumDelayedContinuationIntentRatio * 100)}%.`
    );
  }
  if (annotations.length < options.minimumDelayedMemoryAnnotationCount) {
    issues.push(
      `delayed_memory_annotations ${annotations.length} are below ${options.minimumDelayedMemoryAnnotationCount}.`
    );
  }

  const score = roundScore(
    (calculateThresholdProgress(followUpRatio, options.minimumDelayedFollowUpRespondentRatio) * 25) +
    (calculateThresholdProgress(followUpHours ?? 0, options.minimumDelayedFollowUpHours) * 10) +
    (calculateThresholdProgress(sceneRecallRatio, options.minimumDelayedSceneRecallRatio) * 20) +
    (calculateThresholdProgress(characterRecallRatio, options.minimumDelayedCharacterRecallRatio) * 15) +
    (calculateThresholdProgress(continuationIntentRatio, options.minimumDelayedContinuationIntentRatio) * 20) +
    (calculateThresholdProgress(annotations.length, options.minimumDelayedMemoryAnnotationCount) * 10)
  );

  return {
    status: issues.length === 0 ? 'usable' : hasAnyDelayedMemoryEvidence ? 'weak' : 'none',
    score,
    issues,
    followUpRespondentCount,
    followUpHours,
    sceneRecallCount,
    characterRecallCount,
    continuationIntentCount,
    nextClickIntentCount,
    returnIntentCount,
    paidContinuationIntentCount,
  };
}

function countDelayedMemoryAnnotationReaders(annotations: ReaderResponseDelayedMemoryAnnotation[]): number {
  return annotations.reduce((sum, annotation) => sum + Math.max(1, annotation.readerCount ?? 1), 0);
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}

function normalizeTargetReaderSegmentCounts(
  segmentCounts: Record<string, number> | undefined
): Record<string, number> {
  return normalizeNamedCountMap(segmentCounts);
}

function normalizeNamedCountMap(
  counts: Record<string, number> | undefined
): Record<string, number> {
  if (!counts) return {};
  const normalized: Record<string, number> = {};
  for (const [rawSegment, rawCount] of Object.entries(counts)) {
    const segment = normalizeOptionalText(rawSegment);
    const count = normalizeNonNegativeInteger(rawCount);
    if (segment !== undefined && count !== undefined) {
      normalized[segment] = count;
    }
  }
  return normalized;
}

function normalizeOptionalScore(value: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? clampScore(value) : undefined;
}

function normalizeFrictionDimension(
  value: ReaderResponseDimension | undefined
): ReaderResponseDimension | undefined {
  return value && DEFAULT_WEIGHTS[value] !== undefined ? value : undefined;
}

function normalizeFrictionSeverity(
  value: ReaderResponseFrictionSeverity | undefined
): ReaderResponseFrictionSeverity | undefined {
  return value === 'minor' || value === 'major' || value === 'critical' ? value : undefined;
}

function normalizeDropOffEventType(
  value: ReaderResponseDropOffEventType | undefined
): ReaderResponseDropOffEventType | undefined {
  switch (value) {
    case 'drop-off':
    case 'skim':
    case 'slowdown':
    case 'mind-wandering':
      return value;
    default:
      return undefined;
  }
}

function normalizeDurableEngagementAction(
  value: ReaderResponseDurableEngagementAction | undefined
): ReaderResponseDurableEngagementAction | undefined {
  switch (value) {
    case 'bookmark':
    case 'follow':
    case 'return':
    case 'purchase':
    case 'binge':
      return value;
    default:
      return undefined;
  }
}

function normalizeLineQuoteFunction(
  value: ReaderResponseLineQuoteFunction | undefined
): ReaderResponseLineQuoteFunction | undefined {
  switch (value) {
    case 'voice':
    case 'theme':
    case 'emotion':
    case 'character':
    case 'plot':
    case 'world':
    case 'humor':
    case 'image':
    case 'other':
      return value;
    default:
      return undefined;
  }
}

function normalizeRespondentSource(
  value: ReaderResponseRespondentSource | undefined
): ReaderResponseRespondentSource {
  switch (value) {
    case 'human-target-reader':
    case 'human-general-reader':
    case 'mixed-human-synthetic':
    case 'synthetic-ai':
    case 'author-estimate':
      return value;
    default:
      return 'unknown';
  }
}

function normalizeNonNegativeInteger(value: number | undefined): number | undefined {
  return Number.isInteger(value) && (value ?? -1) >= 0 ? value : undefined;
}

function normalizeNonNegativeNumber(value: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function normalizePreferenceRate(value: number | undefined): number | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  if (value > 1 && value <= 100) return Math.max(0, Math.min(1, value / 100));
  return Math.max(0, Math.min(1, value));
}

function isActionableFrictionAnnotation(annotation: ReaderResponseFrictionAnnotation): boolean {
  return annotation.location !== undefined &&
    annotation.reason.length > 0 &&
    annotation.rewriteSuggestion !== undefined;
}

function isActionableDropOffAnnotation(annotation: ReaderResponseDropOffAnnotation): boolean {
  return annotation.location !== undefined &&
    annotation.reason.length > 0 &&
    annotation.suggestedRevision !== undefined;
}

function evaluateFrictionAnnotationCoverage(
  annotations: ReaderResponseFrictionAnnotation[],
  dimensionIssues: ReaderResponseDimensionIssue[]
): {
  coverage: ReaderResponseFrictionAnnotationCoverage;
  issues: string[];
} {
  const weakDimensions = uniqueStrings(dimensionIssues.map(issue => issue.dimension)) as ReaderResponseDimension[];
  if (weakDimensions.length === 0) {
    return {
      coverage: 'none',
      issues: [],
    };
  }

  const coveredDimensions = new Set(
    annotations
      .filter(isActionableFrictionAnnotation)
      .map(annotation => annotation.dimension)
      .filter((dimension): dimension is ReaderResponseDimension => dimension !== undefined)
  );
  const missingDimensions = weakDimensions.filter(dimension => !coveredDimensions.has(dimension));

  if (missingDimensions.length === 0) {
    return {
      coverage: 'covered',
      issues: [],
    };
  }

  return {
    coverage: coveredDimensions.size === 0 ? 'missing' : 'partial',
    issues: [
      `friction annotations do not cover weak reader dimensions: ${missingDimensions.join(', ')}.`,
    ],
  };
}

function evaluateFrictionAnnotationRepresentativeness(
  annotations: ReaderResponseFrictionAnnotation[],
  evidence: ReaderResponseSampleEvidence | undefined,
  options: ResolvedReaderResponseCalibrationOptions
): {
  representativeness: ReaderResponseFrictionAnnotationRepresentativeness;
  issues: string[];
} {
  const actionableAnnotations = annotations.filter(isActionableFrictionAnnotation);
  if (actionableAnnotations.length === 0) {
    return {
      representativeness: 'unknown',
      issues: ['actionable friction annotations lack reader-segment evidence.'],
    };
  }

  const segmentWeights = new Map<string, number>();
  for (const annotation of actionableAnnotations) {
    if (!annotation.readerSegment) continue;
    segmentWeights.set(
      annotation.readerSegment,
      (segmentWeights.get(annotation.readerSegment) ?? 0) + Math.max(1, annotation.readerCount ?? 1)
    );
  }

  if (segmentWeights.size === 0) {
    return {
      representativeness: 'unknown',
      issues: ['friction annotations lack reader_segment values.'],
    };
  }

  const knownPanelSegments = normalizePositiveInteger(evidence?.targetReaderSegmentCount);
  const requiredSegments = Math.min(
    options.minimumFrictionAnnotationSegmentCount,
    knownPanelSegments ?? options.minimumFrictionAnnotationSegmentCount
  );
  const totalWeight = Array.from(segmentWeights.values()).reduce((sum, weight) => sum + weight, 0);
  const dominantRatio = totalWeight > 0
    ? Math.max(...segmentWeights.values()) / totalWeight
    : 1;
  const issues: string[] = [];

  if (segmentWeights.size < requiredSegments) {
    issues.push(
      `friction annotations cover ${segmentWeights.size} reader segment(s), below ${requiredSegments}.`
    );
  }
  if (dominantRatio > options.maximumDominantFrictionAnnotationSegmentRatio) {
    issues.push(
      `dominant friction annotation segment ratio ${roundScore(dominantRatio * 100)}% exceeds ${roundScore(options.maximumDominantFrictionAnnotationSegmentRatio * 100)}%.`
    );
  }

  return {
    representativeness: issues.length > 0 ? 'narrow' : 'balanced',
    issues,
  };
}

function evaluateAnnotationReliabilityEvidence(
  evidence: ReaderResponseSampleEvidence | undefined,
  options: ResolvedReaderResponseCalibrationOptions
): {
  status: ReaderResponseAnnotationReliabilityStatus;
  score: number;
  issues: string[];
  coderCount: number;
  doubleCodedCount: number;
  agreementRate?: number;
  metric?: ReaderResponseAnnotationReliabilityMetric;
  codebookVersion?: string;
  adjudicated?: boolean;
  coderBlinded?: boolean;
} {
  if (!evidence) {
    return {
      status: 'none',
      score: 0,
      issues: ['Reader sample lacks annotation coding reliability evidence.'],
      coderCount: 0,
      doubleCodedCount: 0,
    };
  }

  const coderCount = normalizePositiveInteger(evidence.annotationCoderCount) ?? 0;
  const doubleCodedCount = normalizePositiveInteger(evidence.annotationDoubleCodedCount) ?? 0;
  const agreementRate = normalizePreferenceRate(evidence.annotationAgreementRate);
  const metric = evidence.annotationReliabilityMetric;
  const codebookVersion = evidence.annotationCodebookVersion?.trim() || undefined;
  const adjudicated = evidence.annotationAdjudicated;
  const coderBlinded = evidence.annotationCoderBlinded;
  const hasAnyEvidence = coderCount > 0 ||
    doubleCodedCount > 0 ||
    agreementRate !== undefined ||
    metric !== undefined ||
    codebookVersion !== undefined ||
    adjudicated !== undefined ||
    coderBlinded !== undefined;

  if (!hasAnyEvidence) {
    return {
      status: 'none',
      score: 0,
      issues: ['Reader sample lacks annotation coding reliability evidence.'],
      coderCount: 0,
      doubleCodedCount: 0,
    };
  }

  const issues: string[] = [];
  if (coderCount < options.minimumAnnotationCoderCount) {
    issues.push(
      `annotation coder count ${coderCount} is below ${options.minimumAnnotationCoderCount}.`
    );
  }
  if (doubleCodedCount < options.minimumAnnotationDoubleCodedCount) {
    issues.push(
      `double-coded annotation count ${doubleCodedCount} is below ${options.minimumAnnotationDoubleCodedCount}.`
    );
  }
  if (agreementRate === undefined) {
    issues.push('annotation reliability evidence lacks agreement rate.');
  } else if (agreementRate < options.minimumAnnotationAgreementRate) {
    issues.push(
      `annotation agreement rate ${roundScore(agreementRate * 100)}% is below ${roundScore(options.minimumAnnotationAgreementRate * 100)}%.`
    );
  }
  if (!metric) {
    issues.push('annotation reliability evidence lacks a reliability metric.');
  }
  if (!codebookVersion) {
    issues.push('annotation reliability evidence lacks annotation codebook version.');
  }
  if (adjudicated !== true) {
    issues.push('annotation reliability evidence lacks adjudicated disagreement resolution.');
  }
  if (coderBlinded !== true) {
    issues.push('annotation reliability evidence lacks coder blinding.');
  }

  const scoreParts = [
    calculateThresholdProgress(coderCount, options.minimumAnnotationCoderCount) * 20,
    calculateThresholdProgress(doubleCodedCount, options.minimumAnnotationDoubleCodedCount) * 20,
    agreementRate !== undefined
      ? calculateThresholdProgress(agreementRate, options.minimumAnnotationAgreementRate) * 25
      : 0,
    metric ? 10 : 0,
    codebookVersion ? 10 : 0,
    adjudicated === true ? 8 : 0,
    coderBlinded === true ? 7 : 0,
  ];
  const score = roundScore(clampScore(scoreParts.reduce((sum, value) => sum + value, 0)));

  return {
    status: issues.length === 0 ? 'usable' : 'weak',
    score,
    issues,
    coderCount,
    doubleCodedCount,
    agreementRate,
    metric,
    codebookVersion,
    adjudicated,
    coderBlinded,
  };
}

function calculateRatio(value: number | undefined, denominator: number): number {
  if (!value || denominator <= 0) return 0;
  return Math.max(0, Math.min(1, value / denominator));
}

function calculateReadingWordsPerMinute(
  wordCount: number | undefined,
  readTimeSeconds: number | undefined
): number | undefined {
  if (
    wordCount === undefined ||
    wordCount <= 0 ||
    readTimeSeconds === undefined ||
    readTimeSeconds <= 0
  ) {
    return undefined;
  }
  return roundScore((wordCount / readTimeSeconds) * 60);
}

function calculateReadingCharactersPerMinute(
  characterCount: number | undefined,
  readTimeSeconds: number | undefined
): number | undefined {
  if (
    characterCount === undefined ||
    characterCount <= 0 ||
    readTimeSeconds === undefined ||
    readTimeSeconds <= 0
  ) {
    return undefined;
  }
  return roundScore((characterCount / readTimeSeconds) * 60);
}

function calculateThresholdProgress(value: number, threshold: number): number {
  if (threshold <= 0) return 1;
  return Math.max(0, Math.min(1, value / threshold));
}

function calculateInverseThresholdProgress(value: number, maximum: number): number {
  if (maximum <= 0) return value <= 0 ? 1 : 0;
  return Math.max(0, Math.min(1, 1 - (value / maximum)));
}

function addRatioIssue(
  issues: string[],
  label: string,
  count: number,
  denominator: number,
  maximumRatio: number
): void {
  const ratio = calculateRatio(count, denominator);
  if (ratio > maximumRatio) {
    issues.push(
      `${label} ratio ${roundScore(ratio * 100)}% exceeds ${roundScore(maximumRatio * 100)}%.`
    );
  }
}

function normalizeReaderScores(
  scores: ReaderResponseScores,
  scale: ReaderResponseRatingScale
): Record<ReaderResponseDimension, number | undefined> {
  return {
    'next-click': normalizeRating(scores.nextClick, scale),
    attention: normalizeRating(scores.attention, scale),
    'emotional-engagement': normalizeRating(scores.emotionalEngagement, scale),
    'mental-imagery': normalizeRating(scores.mentalImagery, scale),
    transportation: normalizeRating(scores.transportation, scale),
    'character-attachment': normalizeRating(scores.characterAttachment, scale),
    'relationship-investment': normalizeRating(scores.relationshipInvestment, scale),
    novelty: normalizeRating(scores.novelty, scale),
    surprise: normalizeRating(scores.surprise, scale),
    resonance: normalizeRating(scores.resonance, scale),
    'scene-recall': normalizeRating(scores.sceneRecall, scale),
    'recommendation-intent': normalizeRating(scores.recommendationIntent, scale),
    'bookmark-intent': normalizeRating(scores.bookmarkIntent, scale),
    'return-intent': normalizeRating(scores.returnIntent, scale),
    'purchase-intent': normalizeRating(scores.purchaseIntent, scale),
    'binge-intent': normalizeRating(scores.bingeIntent, scale),
    interest: normalizeRating(scores.interest, scale),
    suspense: normalizeRating(scores.suspense, scale),
    beauty: normalizeRating(scores.beauty, scale),
    amusement: normalizeRating(scores.amusement, scale),
    'overall-liking': normalizeRating(scores.overallLiking, scale),
  };
}

function normalizeRating(
  value: number | undefined,
  scale: ReaderResponseRatingScale
): number | undefined {
  if (value === undefined) return undefined;
  if (scale.max <= scale.min) return clampScore(value);
  const normalized = ((value - scale.min) / (scale.max - scale.min)) * 100;
  return clampScore(normalized);
}

function calculateReaderComposite(
  scores: Record<ReaderResponseDimension, number | undefined>,
  weights: Record<ReaderResponseDimension, number>
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [dimension, score] of Object.entries(scores) as Array<[ReaderResponseDimension, number | undefined]>) {
    if (score === undefined) continue;
    const weight = weights[dimension];
    weightedSum += score * weight;
    totalWeight += weight;
  }

  return totalWeight === 0 ? 0 : roundScore(weightedSum / totalWeight);
}

function determineReliability(
  respondentCount: number,
  minimumRespondentCount: number
): ReaderResponseCalibrationSampleResult['reliability'] {
  if (respondentCount <= 0) return 'none';
  if (respondentCount < minimumRespondentCount) return 'weak';
  return 'usable';
}

function detectDimensionIssues(
  scores: Record<ReaderResponseDimension, number | undefined>,
  threshold: number
): ReaderResponseDimensionIssue[] {
  return (Object.entries(scores) as Array<[ReaderResponseDimension, number | undefined]>)
    .filter(([, score]) => score !== undefined && score < threshold)
    .map(([dimension, score]) => ({
      dimension,
      score: roundScore(score ?? 0),
      threshold,
      message: buildDimensionMessage(dimension),
    }));
}

function determineFailureType(
  automatedScore: number,
  readerCompositeScore: number,
  scoreGap: number,
  options: ResolvedReaderResponseCalibrationOptions
): ReaderResponseCalibrationFailureType | undefined {
  const automatedHigh = automatedScore >= options.highAutomatedThreshold;
  const automatedLow = automatedScore < options.lowAutomatedThreshold;
  const readerLow = readerCompositeScore < options.lowReaderThreshold;
  const readerHigh = readerCompositeScore >= options.highReaderThreshold;

  if (automatedHigh && readerLow) return 'auto-false-positive';
  if (automatedLow && readerHigh) return 'auto-false-negative';
  if (scoreGap >= options.severeGapThreshold) return 'auto-overestimate';
  if (scoreGap <= -options.severeGapThreshold) return 'auto-underestimate';
  return undefined;
}

function summarizeBlindSpots(
  sampleResults: ReaderResponseCalibrationSampleResult[],
  threshold: number
): ReaderResponseBlindSpot[] {
  const dimensionScores = new Map<ReaderResponseDimension, number[]>();

  for (const result of sampleResults) {
    for (const issue of result.dimensionIssues) {
      const scores = dimensionScores.get(issue.dimension) ?? [];
      scores.push(issue.score);
      dimensionScores.set(issue.dimension, scores);
    }
  }

  return Array.from(dimensionScores.entries())
    .map(([dimension, scores]) => ({
      dimension,
      affectedSamples: scores.length,
      averageScore: roundScore(average(scores)),
      message: `${dimension} reader response averaged below ${threshold}.`,
    }))
    .sort((a, b) => b.affectedSamples - a.affectedSamples || a.averageScore - b.averageScore);
}

function buildRecommendations(
  sampleResults: ReaderResponseCalibrationSampleResult[],
  blindSpots: ReaderResponseBlindSpot[],
  readyForGateTuning: boolean,
  options: ResolvedReaderResponseCalibrationOptions
): string[] {
  const recommendations = new Set<string>();

  if (!readyForGateTuning) {
    recommendations.add(
      `Collect at least ${options.minimumSampleCountForTuning} usable reader-panel samples before retuning hard gate thresholds.`
    );
  }

  if (sampleResults.some(result => result.evidenceQuality !== 'usable')) {
    recommendations.add(
      'Collect target-reader fit, started/completed/drop-off/skimming retention counts, qualitative comments, scene-level friction points, tension traces, narrative forecast updates, payoff fairness reconstruction, actionable friction annotations, and rewrite suggestions before retuning automated thresholds.'
    );
  }

  if (
    options.requireHumanReaderEvidenceForTuning &&
    sampleResults.some(result => result.humanReaderEvidence !== 'usable')
  ) {
    recommendations.add(
      'Record respondent_source and human_respondent_count so synthetic AI responses, author estimates, or unknown provenance cannot retune hard reader-response thresholds.'
    );
  }

  if (
    options.requireResponseDataQualityForTuning &&
    sampleResults.some(result => result.responseDataQuality !== 'usable')
  ) {
    recommendations.add(
      'Record response data-quality evidence such as manuscript_word_count, manuscript_character_count, median_read_time_seconds, minimum_read_time_seconds, speeding_response_count, straight_lining_response_count, duplicate_response_count, bot_suspected_response_count, low_quality_open_ended_response_count, inconsistent_response_count, and quality_flagged_response_count before retuning thresholds.'
    );
  }

  if (
    options.requireRetentionEvidenceForTuning &&
    sampleResults.some(result => result.retentionEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect retention evidence such as started_read_count, completed_read_count, drop_off_count, and skimmed_read_count before trusting reader averages for hard gate tuning.'
    );
  }

  if (
    options.requireDropOffLocalizationEvidenceForTuning &&
    sampleResults.some(result => result.dropOffLocalizationEvidence !== 'usable')
  ) {
    recommendations.add(
      'When readers drop off, skim, slow down, or report mind-wandering, record drop_off_annotations with event_type, location, reason, reader_count, reader_segment, and suggested_revision so retention loss becomes scene-level revision evidence.'
    );
  }

  if (
    options.requireStructuredFrictionAnnotationsForTuning &&
    sampleResults.some(result => result.frictionAnnotations.length < options.minimumStructuredFrictionAnnotationCount)
  ) {
    recommendations.add(
      'Record structured friction_annotations with location, reason, affected response dimension, and rewrite_suggestion so reader-panel scores become revision directives instead of vague ratings.'
    );
  }

  if (
    options.requireFrictionAnnotationsForWeakDimensionsForTuning &&
    sampleResults.some(result => (
      result.frictionAnnotationCoverage === 'missing' ||
      result.frictionAnnotationCoverage === 'partial'
    ))
  ) {
    recommendations.add(
      'Align friction_annotations.dimension with every weak reader-response dimension before using the sample for gate tuning.'
    );
  }

  if (
    options.requireFrictionAnnotationRepresentativenessForTuning &&
    sampleResults.some(result => result.frictionAnnotationRepresentativeness !== 'balanced')
  ) {
    recommendations.add(
      'Record reader_segment on actionable friction_annotations and keep annotation evidence spread across target-reader cohorts before retuning gate thresholds.'
    );
  }

  if (
    options.requireAnnotationReliabilityForTuning &&
    sampleResults.some(result => result.annotationReliability !== 'usable')
  ) {
    recommendations.add(
      'Record annotation coding reliability evidence before retuning thresholds: coder count, double-coded sample count, agreement metric/rate, codebook version, adjudication, and coder blinding.'
    );
  }

  if (
    options.requireSceneRecallEvidenceForTuning &&
    sampleResults.some(result => result.sceneRecallEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect unprompted scene-recall evidence and scene_recall_annotations with location, remembered_moment, distinctive_detail, reader_count, and reader_segment before retuning hard thresholds.'
    );
  }

  if (
    options.requireTensionTraceEvidenceForTuning &&
    sampleResults.some(result => result.tensionTraceEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect scene-level tension_trace_annotations with experienced_tension, suspense/curiosity/surprise levels, narrative_question or stake_or_risk, reader_count, and reader_segment before retuning hard thresholds.'
    );
  }

  if (
    options.requireNarrativeForecastEvidenceForTuning &&
    sampleResults.some(result => result.narrativeForecastEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect narrative_forecast_annotations with initial_prediction, revised_prediction or prediction_shift, actual_outcome or prediction_mismatch, surprise_or_tension_reason, reader_count, and reader_segment before retuning hard thresholds.'
    );
  }

  if (
    options.requireLineQuoteEvidenceForTuning &&
    sampleResults.some(result => result.lineQuoteEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect line quote evidence such as quote_recall_count, favorite_line_count, shareable_line_count, and line_quote_annotations with quoted_line, appeal_reason, share_reason, reader_count, and reader_segment before retuning hard thresholds.'
    );
  }

  if (
    options.requirePayoffFairnessEvidenceForTuning &&
    sampleResults.some(result => result.payoffFairnessEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect payoff_fairness_annotations with payoff_moment, remembered_setup, trigger_or_reveal, changed_interpretation, earned_reason, emotional_payoff_reason, reader_count, and reader_segment before retuning hard thresholds.'
    );
  }

  if (
    options.requireAdvocacyEvidenceForTuning &&
    sampleResults.some(result => result.advocacyEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect reader advocacy evidence such as organic recommendation counts and advocacy_annotations with share_trigger, discussion_prompt, reader_count, and reader_segment before retuning hard thresholds.'
    );
  }

  if (
    options.requireDurableEngagementEvidenceForTuning &&
    sampleResults.some(result => result.durableEngagementEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect durable engagement evidence such as bookmark, follow, return, binge, paid-continuation counts and durable_engagement_annotations with commitment_trigger, intended_action, reader_count, and reader_segment before retuning hard thresholds.'
    );
  }

  if (
    options.requireContinuationBehaviorEvidenceForTuning &&
    sampleResults.some(result => result.continuationBehaviorEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect actual continuation behavior evidence such as next_chapter_cta_impression_count, next_chapter_click_count, next_chapter_open_count, and next_chapter_read_start_count before treating next-click intent as gate-tuning evidence.'
    );
  }

  if (
    options.requireResonanceEvidenceForTuning &&
    sampleResults.some(result => result.resonanceEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect post-reading resonance evidence such as lingering emotion counts, reflective meaning counts, and resonance_annotations with lingering_emotion, reflective_question, remembered_image, personal_meaning, reader_count, and reader_segment before retuning hard thresholds.'
    );
  }

  if (
    options.requireDelayedMemoryEvidenceForTuning &&
    sampleResults.some(result => result.delayedMemoryEvidence !== 'usable')
  ) {
    recommendations.add(
      'Collect delayed follow-up memory evidence such as delayed scene recall, character/relationship recall, continuation intent, follow-up interval, and delayed_memory_annotations before retuning hard thresholds.'
    );
  }

  if (options.requirePanelConsensusForTuning && sampleResults.some(result => result.panelConsensus !== 'clear')) {
    recommendations.add(
      'Collect panel consensus evidence such as score standard deviation and high/neutral/low response counts before retuning automated thresholds.'
    );
  }

  if (sampleResults.some(result => result.panelConsensus === 'polarized')) {
    recommendations.add(
      'Segment polarized reader-panel samples by target-reader cohort before using their average score for hard gate tuning.'
    );
  }

  if (
    options.requireReaderScoreConfidenceForTuning &&
    sampleResults.some(result => result.readerScoreConfidence !== 'precise')
  ) {
    recommendations.add(
      'Collect enough reader responses and score dispersion evidence to reduce the 95% confidence margin before retuning automated thresholds.'
    );
  }

  if (sampleResults.some(result => result.readerScoreConfidence === 'wide')) {
    recommendations.add(
      'Increase reader-panel sample size or split noisy cohorts before using average reader scores for hard gate tuning.'
    );
  }

  if (
    options.requireCohortRepresentativenessForTuning &&
    sampleResults.some(result => result.cohortRepresentativeness !== 'balanced')
  ) {
    recommendations.add(
      'Collect target-reader cohort evidence such as segment count, required segment quota counts, and dominant segment ratio before retuning automated thresholds.'
    );
  }

  if (sampleResults.some(result => result.cohortRepresentativeness === 'narrow')) {
    recommendations.add(
      'Broaden narrow reader panels and fill required target-reader quota cells so one cohort cannot dominate the calibration signal.'
    );
  }

  if (
    options.requirePanelProtocolForTuning &&
    sampleResults.some(result => result.panelProtocolQuality !== 'strong')
  ) {
    recommendations.add(
      'Record reader-panel protocol evidence: blind manuscript presentation, author identity masking, prior-exposure screening, unexcluded prior-exposure count, spoiler-exposure screening, unexcluded spoiler-exposure count, neutral question wording, randomized or counterbalanced response options, randomized/counterbalanced manuscript order, maximum samples per respondent, manuscript order balance ratio, exact question wording, recruitment method, target population, sampling frame, fieldwork dates, survey mode, incentives, attention-check pass count, and excluded response count before retuning thresholds.'
    );
  }

  if (
    options.requireComparativePreferenceForTuning &&
    sampleResults.some(result => result.comparativePreferenceStatus === 'none')
  ) {
    recommendations.add(
      'Run blind pairwise reader preference tests against target-market reference chapters before retuning hard thresholds.'
    );
  }

  if (sampleResults.some(result => result.comparativePreferenceStatus === 'weak')) {
    recommendations.add(
      'Investigate samples with weak comparative preference; absolute reader scores can look healthy while the draft loses against a stronger reference chapter.'
    );
  }

  if (
    options.requireComparativePreferenceForTuning &&
    sampleResults.some(result => result.comparativePreferenceStatus !== 'strong')
  ) {
    recommendations.add(
      `Require at least ${roundScore(options.minimumComparativePreferenceWinRate * 100)}% blind pairwise win rate with disclosed prompt wording and matched reader cohorts before gate tuning.`
    );
  }

  if (
    options.requireRevisionOutcomeEvidenceForTuning &&
    sampleResults.some(result => result.revisionOutcomeEvidence !== 'improved')
  ) {
    recommendations.add(
      'Validate revision outcome evidence before retuning thresholds: record baseline/revised reader scores or blind before/after preference counts with matched reader cohorts.'
    );
  }

  if (sampleResults.some(result => result.revisionOutcomeEvidence === 'regressed')) {
    recommendations.add(
      'Investigate revised drafts that regressed against their baseline before using the related feedback pattern as a rewrite rule.'
    );
  }

  if (options.requireHoldoutForTuning) {
    const splitCoverage = countSplitCoverage(sampleResults, options);
    if (splitCoverage.holdoutSamples < options.minimumHoldoutSampleCount) {
      recommendations.add(
        `Reserve at least ${options.minimumHoldoutSampleCount} reader-panel holdout sample(s) before retuning hard thresholds; calibration-only evidence can overfit the gate.`
      );
    }
    if (splitCoverage.usableHoldoutSamples < options.minimumUsableHoldoutSampleCount) {
      recommendations.add(
        `Collect at least ${options.minimumUsableHoldoutSampleCount} usable holdout reader-panel sample(s) before applying threshold changes.`
      );
    }
    if (splitCoverage.unassignedSamples > 0) {
      recommendations.add(
        'Set calibration_split to calibration, validation, or holdout on reader-panel samples so threshold tuning is checked against reserved evidence.'
      );
    }
  }

  if (options.requiredGenres.length > 0) {
    const genreCoverage = countGenreCoverage(sampleResults, options);
    const missingRequiredGenres = options.requiredGenres
      .filter(genre => genreCoverage[genre] === undefined);
    const underSampledRequiredGenres = options.requiredGenres
      .filter(genre => (genreCoverage[genre]?.totalSamples ?? 0) < options.minimumSamplesPerGenre);
    const underSampledUsableRequiredGenres = options.requiredGenres
      .filter(genre => (genreCoverage[genre]?.usableSamples ?? 0) < options.minimumUsableSamplesPerGenre);
    const missingRequiredSeriesGenres = options.minimumSeriesLength === 0
      ? []
      : options.requiredGenres.filter(
          genre => (genreCoverage[genre]?.longestConsecutiveRun ?? 0) < options.minimumSeriesLength
        );
    const missingRequiredUsableSeriesGenres = options.minimumUsableSeriesLength === 0
      ? []
      : options.requiredGenres.filter(
          genre => (genreCoverage[genre]?.usableLongestConsecutiveRun ?? 0) < options.minimumUsableSeriesLength
        );

    if (missingRequiredGenres.length > 0) {
      recommendations.add(`Collect reader-panel samples for required genres: ${missingRequiredGenres.join(', ')}.`);
    }
    if (underSampledRequiredGenres.length > 0) {
      recommendations.add(
        `Collect at least ${options.minimumSamplesPerGenre} reader-panel samples for required genres: ${underSampledRequiredGenres.join(', ')}.`
      );
    }
    if (underSampledUsableRequiredGenres.length > 0) {
      recommendations.add(
        `Collect at least ${options.minimumUsableSamplesPerGenre} usable reader-panel samples for required genres: ${underSampledUsableRequiredGenres.join(', ')}.`
      );
    }
    if (missingRequiredSeriesGenres.length > 0) {
      recommendations.add(
        `Collect consecutive chapter reader-panel samples for required genres: ${missingRequiredSeriesGenres.join(', ')}.`
      );
    }
    if (missingRequiredUsableSeriesGenres.length > 0) {
      recommendations.add(
        `Collect usable consecutive chapter reader-panel samples for required genres: ${missingRequiredUsableSeriesGenres.join(', ')}.`
      );
    }
  }

  if (options.requiredChapterRanges.length > 0) {
    const chapterRangeCoverage = countChapterRangeCoverage(
      sampleResults,
      options.requiredChapterRanges,
      options
    );
    const underSampledRequiredChapterRanges = chapterRangeCoverage
      .filter(coverage => coverage.totalSamples < coverage.minimumSamples);
    const underSampledUsableRequiredChapterRanges = chapterRangeCoverage
      .filter(coverage => coverage.usableSamples < coverage.minimumUsableSamples);
    const missingRequiredChapterRangeGenres = chapterRangeCoverage
      .flatMap(coverage => coverage.missingRequiredGenres.map(genre => `${coverage.id}:${genre}`));
    const missingRequiredUsableChapterRangeGenres = chapterRangeCoverage
      .flatMap(coverage => coverage.missingRequiredUsableGenres.map(genre => `${coverage.id}:${genre}`));

    if (underSampledRequiredChapterRanges.length > 0) {
      recommendations.add(
        `Collect more reader-panel samples for required chapter ranges: ${underSampledRequiredChapterRanges
          .map(coverage => `${coverage.id}(${coverage.totalSamples}/${coverage.minimumSamples})`)
          .join(', ')}.`
      );
    }
    if (underSampledUsableRequiredChapterRanges.length > 0) {
      recommendations.add(
        `Collect more usable reader-panel samples for required chapter ranges: ${underSampledUsableRequiredChapterRanges
          .map(coverage => `${coverage.id}(${coverage.usableSamples}/${coverage.minimumUsableSamples})`)
          .join(', ')}.`
      );
    }
    if (missingRequiredChapterRangeGenres.length > 0) {
      recommendations.add(
        `Collect reader-panel samples for required chapter-range genres: ${missingRequiredChapterRangeGenres.join(', ')}.`
      );
    }
    if (missingRequiredUsableChapterRangeGenres.length > 0) {
      recommendations.add(
        `Collect usable reader-panel samples for required chapter-range genres: ${missingRequiredUsableChapterRangeGenres.join(', ')}.`
      );
    }
  }

  if (sampleResults.some(result => result.failureType === 'auto-false-positive')) {
    recommendations.add(
      'Treat automated engagement >= high threshold as provisional when reader next-click or absorption is low.'
    );
  }

  if (sampleResults.some(result => result.failureType === 'auto-false-negative')) {
    recommendations.add(
      'Inspect underscored samples that readers still loved; the gate may be penalizing a valid genre or style route.'
    );
  }

  for (const blindSpot of blindSpots) {
    recommendations.add(buildBlindSpotRecommendation(blindSpot.dimension));
  }

  return Array.from(recommendations);
}

interface ReaderResponseEvidenceCollectionPlanContext {
  splitCoverage: ReaderResponseSplitCoverage;
  missingRequiredGenres: string[];
  underSampledRequiredGenres: string[];
  underSampledUsableRequiredGenres: string[];
  missingRequiredSeriesGenres: string[];
  missingRequiredUsableSeriesGenres: string[];
  chapterRangeCoverage: ReaderResponseChapterRangeCoverage[];
  underSampledRequiredChapterRanges: string[];
  underSampledUsableRequiredChapterRanges: string[];
  missingRequiredChapterRangeGenres: string[];
  missingRequiredUsableChapterRangeGenres: string[];
  underSampledHoldoutSamples: boolean;
  underSampledUsableHoldoutSamples: boolean;
}

function buildEvidenceCollectionPlan(
  sampleResults: ReaderResponseCalibrationSampleResult[],
  options: ResolvedReaderResponseCalibrationOptions,
  context: ReaderResponseEvidenceCollectionPlanContext
): ReaderResponseEvidenceCollectionTask[] {
  const tasks: ReaderResponseEvidenceCollectionTask[] = [];
  const addTask = (task: ReaderResponseEvidenceCollectionTask): void => {
    tasks.push({
      ...task,
      sampleIds: task.sampleIds.slice(0, 12),
    });
  };
  const sampleIds = (
    predicate: (result: ReaderResponseCalibrationSampleResult) => boolean
  ): string[] => sampleResults.filter(predicate).map(result => result.id);
  const usableSampleCount = sampleResults.filter(result => isUsableReaderPanelSample(result, options)).length;
  const suggestedUsableSampleCount = Math.max(
    options.minimumSampleCountForTuning,
    options.requiredGenres.length * options.minimumUsableSamplesPerGenre,
    ...options.requiredChapterRanges.map(range => range.minimumUsableSamples ?? 1),
    options.requireHoldoutForTuning ? options.minimumUsableHoldoutSampleCount : 0
  );

  if (
    sampleResults.length < options.minimumSampleCountForTuning ||
    usableSampleCount < options.minimumSampleCountForTuning
  ) {
    addTask({
      id: 'collect-usable-reader-panel-samples',
      priority: 'critical',
      target: 'reader-panel-sample-count',
      currentValue: `${usableSampleCount}/${sampleResults.length} usable`,
      requiredValue: suggestedUsableSampleCount,
      sampleIds: sampleIds(result => !isUsableReaderPanelSample(result, options)),
      action: `Collect or repair reader-panel samples until at least ${suggestedUsableSampleCount} samples are usable for gate tuning.`,
      rationale: 'Hard gate retuning should not be based on too few usable reader-panel observations.',
    });
  }

  if (
    options.requireHumanReaderEvidenceForTuning &&
    sampleResults.some(result => result.humanReaderEvidence !== 'usable')
  ) {
    addTask({
      id: 'record-human-reader-provenance',
      priority: 'critical',
      target: 'human-reader-provenance',
      currentValue: `${sampleResults.filter(result => result.humanReaderEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: `all tuning samples with human respondent ratio >= ${roundScore(options.minimumHumanRespondentRatio * 100)}%`,
      sampleIds: sampleIds(result => result.humanReaderEvidence !== 'usable'),
      action: 'Record respondent_source, human_respondent_count, synthetic_respondent_count, and author_estimate_count; replace synthetic or unknown-provenance samples with target-reader panel responses.',
      rationale: 'Synthetic or author-estimated reactions cannot prove that the system produces prose real readers want to continue.',
    });
  }

  if (
    options.requireResponseDataQualityForTuning &&
    sampleResults.some(result => result.responseDataQuality !== 'usable')
  ) {
    addTask({
      id: 'record-response-data-quality',
      priority: 'critical',
      target: 'response-data-quality',
      currentValue: `${sampleResults.filter(result => result.responseDataQuality === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'word or character manuscript length, timing, speeding, straight-lining, duplicate, bot, open-ended, consistency, and quality-flag evidence',
      sampleIds: sampleIds(result => result.responseDataQuality !== 'usable'),
      action: 'Capture manuscript_word_count or manuscript_character_count, median_read_time_seconds, minimum_read_time_seconds, speeding_response_count, straight_lining_response_count, duplicate_response_count, bot_suspected_response_count, low_quality_open_ended_response_count, inconsistent_response_count, and quality_flagged_response_count.',
      rationale: 'Human reader provenance is not enough when low-effort, duplicate, or automated responses can distort the panel average.',
    });
  }

  if (sampleResults.some(result => result.evidenceQuality !== 'usable')) {
    addTask({
      id: 'collect-actionable-friction-evidence',
      priority: 'major',
      target: 'reader-friction-actionability',
      currentValue: `${sampleResults.filter(result => result.evidenceQuality === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'target-reader fit, qualitative comments, friction points, actionable annotations, and rewrite suggestions',
      sampleIds: sampleIds(result => result.evidenceQuality !== 'usable'),
      action: 'Add target_reader_count, qualitative_comment_count, friction_point_count, actionable_friction_point_count, rewrite_suggestion_count, and friction_annotations with location, reason, dimension, reader_segment, and rewrite_suggestion.',
      rationale: 'A low score only improves the manuscript when it identifies where readers disengaged and how the revision should change the scene.',
    });
  }

  if (
    options.requireAnnotationReliabilityForTuning &&
    sampleResults.some(result => result.annotationReliability !== 'usable')
  ) {
    addTask({
      id: 'record-annotation-reliability',
      priority: 'critical',
      target: 'annotation-coding-reliability',
      currentValue: `${sampleResults.filter(result => result.annotationReliability === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: `${options.minimumAnnotationCoderCount}+ coders, ${options.minimumAnnotationDoubleCodedCount}+ double-coded responses, agreement >= ${roundScore(options.minimumAnnotationAgreementRate * 100)}%, metric, codebook, adjudication, and coder blinding`,
      sampleIds: sampleIds(result => result.annotationReliability !== 'usable'),
      action: 'Record annotation_coder_count, annotation_double_coded_count, annotation_reliability_metric, annotation_agreement_rate, annotation_codebook_version, annotation_adjudicated, and annotation_coder_blinded for reader friction annotations.',
      rationale: 'Free-response friction annotations should not become hard rewrite rules unless independent coding shows that the issue labels are reproducible.',
    });
  }

  if (
    options.requireRetentionEvidenceForTuning &&
    sampleResults.some(result => result.retentionEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-retention-funnel-evidence',
      priority: 'major',
      target: 'reader-retention-funnel',
      currentValue: `${sampleResults.filter(result => result.retentionEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: `started readers >= ${options.minimumStartedReadCount}, completion >= ${roundScore(options.minimumPanelCompletionRate * 100)}%, drop-off <= ${roundScore(options.maximumDropOffRatio * 100)}%, skimmed <= ${roundScore(options.maximumSkimmedReadRatio * 100)}%`,
      sampleIds: sampleIds(result => result.retentionEvidence !== 'usable'),
      action: 'Record started_read_count, completed_read_count, drop_off_count, and skimmed_read_count for every reader-panel sample.',
      rationale: 'Completed-reader averages can look healthy while the opening, middle, or ending already lost the target audience.',
    });
  }

  if (
    options.requireDropOffLocalizationEvidenceForTuning &&
    sampleResults.some(result => result.dropOffLocalizationEvidence !== 'usable')
  ) {
    addTask({
      id: 'localize-reader-drop-off-events',
      priority: 'major',
      target: 'drop-off-localization',
      currentValue: `${sampleResults.filter(result => result.dropOffLocalizationEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: `${options.minimumDropOffAnnotationCount}+ drop_off_annotations and ${options.minimumActionableDropOffAnnotationCount}+ actionable annotations when drop-off or skimming occurs`,
      sampleIds: sampleIds(result => result.dropOffLocalizationEvidence !== 'usable'),
      action: 'Record drop_off_annotations with event_type, location, last_completed_location or trigger_quote, reason, reader_count, reader_segment, and suggested_revision for every sample that has drop_off_count or skimmed_read_count above zero.',
      rationale: 'Retention counts say that readers left; localized event annotations say which sentence, beat, or scene made them leave and how the draft should be revised.',
    });
  }

  if (
    options.requireContinuationBehaviorEvidenceForTuning &&
    sampleResults.some(result => result.continuationBehaviorEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-next-chapter-continuation-behavior',
      priority: 'major',
      target: 'actual-continuation-behavior',
      currentValue: `${sampleResults.filter(result => result.continuationBehaviorEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: `CTA impressions >= ${options.minimumContinuationBehaviorImpressionCount}, click-through >= ${roundScore(options.minimumNextChapterClickThroughRatio * 100)}%, and next chapter open/read-start behavior`,
      sampleIds: sampleIds(result => result.continuationBehaviorEvidence !== 'usable'),
      action: 'Record next_chapter_cta_impression_count, next_chapter_click_count, next_chapter_open_count, and next_chapter_read_start_count for reader-panel chapter samples.',
      rationale: 'Next-click survey intent can overstate actual continuation; hard gate tuning should prefer chapters that make readers click or open the next chapter when given the chance.',
    });
  }

  if (
    options.requireSceneRecallEvidenceForTuning &&
    sampleResults.some(result => result.sceneRecallEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-scene-recall-evidence',
      priority: 'major',
      target: 'scene-recall',
      currentValue: `${sampleResults.filter(result => result.sceneRecallEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'unprompted scene recall, distinctive scene recall, and scene_recall_annotations',
      sampleIds: sampleIds(result => result.sceneRecallEvidence !== 'usable'),
      action: 'Capture unprompted_scene_recall_count, distinctive_scene_recall_count, and scene_recall_annotations with remembered_moment, distinctive_detail, reader_count, and reader_segment.',
      rationale: 'Great chapters leave concrete moments readers can recall without being led by the questionnaire.',
    });
  }

  if (
    options.requireTensionTraceEvidenceForTuning &&
    sampleResults.some(result => result.tensionTraceEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-tension-trace-evidence',
      priority: 'major',
      target: 'scene-tension-trace',
      currentValue: `${sampleResults.filter(result => result.tensionTraceEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'tension trace points, peaks, reader questions, and tension_trace_annotations',
      sampleIds: sampleIds(result => result.tensionTraceEvidence !== 'usable'),
      action: 'Record tension_trace_point_count, tension_peak_count, tension_question_count, and tension_trace_annotations with experienced_tension, narrative_question or stake_or_risk, reader_count, and reader_segment.',
      rationale: 'A page-turner needs evidence of where curiosity, threat, and surprise rose or fell inside the scene sequence.',
    });
  }

  if (
    options.requireNarrativeForecastEvidenceForTuning &&
    sampleResults.some(result => result.narrativeForecastEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-narrative-forecast-evidence',
      priority: 'major',
      target: 'narrative-forecast',
      currentValue: `${sampleResults.filter(result => result.narrativeForecastEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'reader predictions, prediction shifts, mismatches, and narrative_forecast_annotations',
      sampleIds: sampleIds(result => result.narrativeForecastEvidence !== 'usable'),
      action: 'Record forecast_prediction_count, forecast_diversity_count, forecast_revision_count, forecast_mismatch_count, forecast_inflection_count, and narrative_forecast_annotations.',
      rationale: 'Reader prediction data shows whether twists feel fair, surprising, and causally prepared instead of arbitrary.',
    });
  }

  if (
    options.requireLineQuoteEvidenceForTuning &&
    sampleResults.some(result => result.lineQuoteEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-line-quote-evidence',
      priority: 'major',
      target: 'memorable-line-quote',
      currentValue: `${sampleResults.filter(result => result.lineQuoteEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'quote recall, favorite line, shareable line, and line_quote_annotations',
      sampleIds: sampleIds(result => result.lineQuoteEvidence !== 'usable'),
      action: 'Record quote_recall_count, favorite_line_count, shareable_line_count, and line_quote_annotations with quoted_line, appeal_reason, share_reason, line_function, reader_count, and reader_segment.',
      rationale: 'Memorable prose needs sentence-level evidence that readers can recall, value, and want to quote or share, not only a high overall liking score.',
    });
  }

  if (
    options.requirePayoffFairnessEvidenceForTuning &&
    sampleResults.some(result => result.payoffFairnessEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-payoff-fairness-evidence',
      priority: 'major',
      target: 'payoff-fairness',
      currentValue: `${sampleResults.filter(result => result.payoffFairnessEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'setup recall, trigger recognition, earned payoff, recontextualization, emotional satisfaction, and payoff_fairness_annotations',
      sampleIds: sampleIds(result => result.payoffFairnessEvidence !== 'usable'),
      action: 'Capture payoff_setup_recall_count, payoff_trigger_recognition_count, payoff_earned_count, payoff_recontextualization_count, payoff_emotional_satisfaction_count, and payoff_fairness_annotations.',
      rationale: 'Strong chapters need payoffs that readers can reconstruct from planted setup and still feel emotionally rewarded by.',
    });
  }

  if (
    options.requireAdvocacyEvidenceForTuning &&
    sampleResults.some(result => result.advocacyEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-advocacy-evidence',
      priority: 'major',
      target: 'reader-advocacy',
      currentValue: `${sampleResults.filter(result => result.advocacyEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'organic recommendation, discussion prompt, and advocacy_annotations',
      sampleIds: sampleIds(result => result.advocacyEvidence !== 'usable'),
      action: 'Record organic_recommendation_count, discussion_prompt_count, and advocacy_annotations with share_trigger, discussion_prompt, reader_count, and reader_segment.',
      rationale: 'A merely acceptable chapter is different from one readers want to recommend, quote, or debate.',
    });
  }

  if (
    options.requireDurableEngagementEvidenceForTuning &&
    sampleResults.some(result => result.durableEngagementEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-durable-engagement-evidence',
      priority: 'major',
      target: 'durable-engagement',
      currentValue: `${sampleResults.filter(result => result.durableEngagementEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'bookmark, follow, return, binge, paid-continuation counts, and durable_engagement_annotations',
      sampleIds: sampleIds(result => result.durableEngagementEvidence !== 'usable'),
      action: 'Record bookmark_count, follow_or_library_add_count, return_next_day_count, binge_read_intent_count, paid_continuation_intent_count, and durable_engagement_annotations.',
      rationale: 'Long-form success depends on delayed return and commitment signals, not only immediate liking.',
    });
  }

  if (
    options.requireResonanceEvidenceForTuning &&
    sampleResults.some(result => result.resonanceEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-resonance-evidence',
      priority: 'major',
      target: 'post-reading-resonance',
      currentValue: `${sampleResults.filter(result => result.resonanceEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: 'lingering emotion, reflective meaning, and resonance_annotations',
      sampleIds: sampleIds(result => result.resonanceEvidence !== 'usable'),
      action: 'Record lingering_emotion_count, reflective_comment_count, personal_memory_or_meaning_count, and resonance_annotations with remembered_image, personal_meaning, reader_count, and reader_segment.',
      rationale: 'Memorable fiction leaves an aftertaste; the system should not confuse polished surface with lasting resonance.',
    });
  }

  if (
    options.requireDelayedMemoryEvidenceForTuning &&
    sampleResults.some(result => result.delayedMemoryEvidence !== 'usable')
  ) {
    addTask({
      id: 'collect-delayed-memory-evidence',
      priority: 'major',
      target: 'delayed-memory-follow-up',
      currentValue: `${sampleResults.filter(result => result.delayedMemoryEvidence === 'usable').length}/${sampleResults.length} usable`,
      requiredValue: `follow-up coverage >= ${roundScore(options.minimumDelayedFollowUpRespondentRatio * 100)}%, interval >= ${options.minimumDelayedFollowUpHours}h, delayed scene/character recall, continuation intent, and delayed_memory_annotations`,
      sampleIds: sampleIds(result => result.delayedMemoryEvidence !== 'usable'),
      action: 'Run a delayed follow-up and record delayed_follow_up_respondent_count, delayed_follow_up_hours, delayed_scene_recall_count, delayed_character_recall_count, delayed_next_click_intent_count, delayed_return_intent_count, delayed_paid_continuation_intent_count, and delayed_memory_annotations.',
      rationale: 'Immediate liking can fade; hard gate tuning should prefer chapters whose images, characters, and next-click pressure survive a delayed check.',
    });
  }

  if (
    options.requirePanelConsensusForTuning &&
    sampleResults.some(result => result.panelConsensus !== 'clear')
  ) {
    addTask({
      id: 'collect-panel-consensus-evidence',
      priority: 'major',
      target: 'panel-consensus',
      currentValue: `${sampleResults.filter(result => result.panelConsensus === 'clear').length}/${sampleResults.length} clear`,
      requiredValue: `majority response ratio >= ${roundScore(options.minimumConsensusMajorityRatio * 100)}% without unresolved polarization`,
      sampleIds: sampleIds(result => result.panelConsensus !== 'clear'),
      action: 'Record reader_score_standard_deviation, high_response_count, neutral_response_count, and low_response_count; segment polarized samples before averaging them.',
      rationale: 'Averages can hide divided reader reactions that need different revisions or cohort-specific interpretation.',
    });
  }

  if (
    options.requireReaderScoreConfidenceForTuning &&
    sampleResults.some(result => result.readerScoreConfidence !== 'precise')
  ) {
    addTask({
      id: 'increase-reader-score-confidence',
      priority: 'major',
      target: 'reader-score-confidence',
      currentValue: `${sampleResults.filter(result => result.readerScoreConfidence === 'precise').length}/${sampleResults.length} precise`,
      requiredValue: `95% margin of error <= ${options.maximumReaderScoreMarginOfError}`,
      sampleIds: sampleIds(result => result.readerScoreConfidence !== 'precise'),
      action: 'Increase respondent counts or split noisy cohorts until reader score dispersion yields a precise confidence interval.',
      rationale: 'Gate thresholds should not move when the reader score estimate is too noisy to distinguish a win from a miss.',
    });
  }

  if (
    options.requireCohortRepresentativenessForTuning &&
    sampleResults.some(result => result.cohortRepresentativeness !== 'balanced')
  ) {
    addTask({
      id: 'balance-target-reader-cohorts',
      priority: 'major',
      target: 'target-reader-representativeness',
      currentValue: `${sampleResults.filter(result => result.cohortRepresentativeness === 'balanced').length}/${sampleResults.length} balanced`,
      requiredValue: `segments >= ${options.minimumTargetReaderSegmentCount}, dominant segment <= ${roundScore(options.maximumDominantReaderSegmentRatio * 100)}%${options.requiredTargetReaderSegments.length > 0 ? `, required quota cells: ${options.requiredTargetReaderSegments.join(', ')}` : ''}`,
      sampleIds: sampleIds(result => result.cohortRepresentativeness !== 'balanced'),
      action: 'Recruit enough target-reader segments and record target_reader_segment_count, target_reader_segment_counts, and dominant_reader_segment_ratio for every sample.',
      rationale: 'One narrow cohort or an unfilled quota cell should not be allowed to define whether a broad novel system is ready for masterpiece-level drafting.',
    });
  }

  if (
    options.requirePanelProtocolForTuning &&
    sampleResults.some(result => result.panelProtocolQuality !== 'strong')
  ) {
    addTask({
      id: 'strengthen-reader-panel-protocol',
      priority: 'critical',
      target: 'reader-panel-protocol',
      currentValue: `${sampleResults.filter(result => result.panelProtocolQuality === 'strong').length}/${sampleResults.length} strong`,
      requiredValue: `blind reading, author identity masking, prior-exposure screening, spoiler-exposure screening, neutral wording, randomized/counterbalanced options, disclosed wording, recruitment, population, sampling frame, fieldwork dates, survey mode, incentives, attention checks, exclusions${options.requiredRecruitmentChannels.length > 0 ? `, required recruitment channels: ${options.requiredRecruitmentChannels.join(', ')}` : ''}`,
      sampleIds: sampleIds(result => result.panelProtocolQuality !== 'strong'),
      action: 'Record blind_reading, author_identity_masked, prior_exposure_screened, unexcluded_prior_exposure_count, spoiler_exposure_screened, unexcluded_spoiler_exposure_count, neutral_question_wording, response_option_order_randomized, sample_order_randomized, manuscript_order_counterbalanced, max_samples_per_respondent, order_balance_ratio, question_wording_disclosed, recruitment_method_disclosed, recruitment_channel_counts, population_definition_disclosed, sampling_frame_disclosed, fieldwork_dates_disclosed, survey_mode_disclosed, incentive_disclosed, attention_check_pass_count, and excluded_response_count.',
      rationale: 'Reader-panel findings are only actionable when the collection protocol reduces cueing, prior familiarity, spoiler contamination, order effects, opaque sample sourcing, and low-quality participation.',
    });
  }

  const comparativeBlockers = sampleResults.filter(result => (
    result.comparativePreferenceStatus === 'weak' ||
    (options.requireComparativePreferenceForTuning && result.comparativePreferenceStatus !== 'strong')
  ));
  if (comparativeBlockers.length > 0) {
    addTask({
      id: 'run-blind-comparative-preference-test',
      priority: options.requireComparativePreferenceForTuning ? 'critical' : 'major',
      target: 'comparative-preference',
      currentValue: `${sampleResults.filter(result => result.comparativePreferenceStatus === 'strong').length}/${sampleResults.length} strong`,
      requiredValue: `blind pairwise win rate >= ${roundScore(options.minimumComparativePreferenceWinRate * 100)}% with ${options.minimumComparativePreferenceRespondentCount}+ respondents`,
      sampleIds: comparativeBlockers.map(result => result.id),
      action: 'Run blind pairwise preference tests against target-market reference chapters with matched cohorts and disclosed question wording.',
      rationale: 'Absolute scores can look good even when readers prefer a stronger reference chapter.',
    });
  }

  const revisionRegressionSamples = sampleResults
    .filter(result => result.revisionOutcomeEvidence === 'regressed');
  if (revisionRegressionSamples.length > 0) {
    addTask({
      id: 'rerun-regressed-revision-panel',
      priority: 'critical',
      target: 'revision-outcome-regression',
      currentValue: `${revisionRegressionSamples.length} regression sample(s)`,
      requiredValue: 'zero revision regressions before using the feedback pattern as a rewrite rule',
      sampleIds: revisionRegressionSamples.map(result => result.id),
      action: 'Rerun baseline-vs-revised reader tests, inspect revision_pair_id evidence, roll back harmful edits, and retest against the same reader cohort.',
      rationale: 'A revision directive that lowers reader response must not be promoted into the writing workflow.',
    });
  }

  if (
    options.requireRevisionOutcomeEvidenceForTuning &&
    sampleResults.some(result => result.revisionOutcomeEvidence !== 'improved')
  ) {
    addTask({
      id: 'collect-revision-outcome-evidence',
      priority: 'critical',
      target: 'revision-outcome',
      currentValue: `${sampleResults.filter(result => result.revisionOutcomeEvidence === 'improved').length}/${sampleResults.length} improved`,
      requiredValue: `lift >= ${options.minimumRevisionLift} or blind preference >= ${roundScore(options.minimumRevisionPreferenceWinRate * 100)}% with ${options.minimumRevisionPreferenceRespondentCount}+ respondents`,
      sampleIds: sampleIds(result => result.revisionOutcomeEvidence !== 'improved'),
      action: 'Record revision_pair_id, baseline/revised reader scores or blind before/after preference counts, same-cohort status, disclosed wording, and guardrail regressions.',
      rationale: 'Reader-response directives should earn their place by improving the draft against a preserved baseline.',
    });
  }

  if (
    context.underSampledHoldoutSamples ||
    context.underSampledUsableHoldoutSamples ||
    context.splitCoverage.unassignedSamples > 0
  ) {
    addTask({
      id: 'reserve-reader-panel-holdout',
      priority: context.underSampledHoldoutSamples || context.underSampledUsableHoldoutSamples ? 'critical' : 'minor',
      target: 'holdout-coverage',
      currentValue: `holdout ${context.splitCoverage.holdoutSamples}/${options.minimumHoldoutSampleCount}, usable holdout ${context.splitCoverage.usableHoldoutSamples}/${options.minimumUsableHoldoutSampleCount}, unassigned ${context.splitCoverage.unassignedSamples}`,
      requiredValue: 'calibration/validation/holdout split with enough usable holdout samples',
      sampleIds: sampleIds(result => result.calibrationSplit === undefined),
      action: 'Set calibration_split on every sample and reserve enough usable holdout reader-panel samples before applying threshold changes.',
      rationale: 'Gate tuning needs evidence not used to choose the threshold, otherwise the system can overfit its own calibration set.',
    });
  }

  if (
    context.missingRequiredGenres.length > 0 ||
    context.underSampledRequiredGenres.length > 0 ||
    context.underSampledUsableRequiredGenres.length > 0
  ) {
    addTask({
      id: 'collect-required-genre-coverage',
      priority: 'critical',
      target: 'genre-coverage',
      currentValue: summarizeCoverageGaps([
        ['missing', context.missingRequiredGenres],
        ['under-sampled', context.underSampledRequiredGenres],
        ['usable under-sampled', context.underSampledUsableRequiredGenres],
      ]),
      requiredValue: `${options.minimumSamplesPerGenre} total and ${options.minimumUsableSamplesPerGenre} usable sample(s) per required genre`,
      sampleIds: sampleIds(result => result.genre !== undefined && (
        context.underSampledRequiredGenres.includes(result.genre) ||
        context.underSampledUsableRequiredGenres.includes(result.genre)
      )),
      action: 'Collect reader-panel samples for every required genre and repair weak samples until each genre has enough usable evidence.',
      rationale: 'A novel-writing system cannot claim broad readiness from only the genres already represented in the panel.',
    });
  }

  if (
    context.missingRequiredSeriesGenres.length > 0 ||
    context.missingRequiredUsableSeriesGenres.length > 0
  ) {
    addTask({
      id: 'collect-consecutive-series-coverage',
      priority: 'major',
      target: 'series-coverage',
      currentValue: summarizeCoverageGaps([
        ['missing consecutive', context.missingRequiredSeriesGenres],
        ['missing usable consecutive', context.missingRequiredUsableSeriesGenres],
      ]),
      requiredValue: `${options.minimumSeriesLength} consecutive and ${options.minimumUsableSeriesLength} usable consecutive chapter sample(s) per required genre`,
      sampleIds: sampleIds(result => result.genre !== undefined && (
        context.missingRequiredSeriesGenres.includes(result.genre) ||
        context.missingRequiredUsableSeriesGenres.includes(result.genre)
      )),
      action: 'Collect consecutive chapter reader-panel samples for required genres instead of relying on isolated chapter reactions.',
      rationale: 'Long-form fiction has compounding setup, payoff, and fatigue patterns that one-off samples cannot prove.',
    });
  }

  if (
    context.underSampledRequiredChapterRanges.length > 0 ||
    context.underSampledUsableRequiredChapterRanges.length > 0 ||
    context.missingRequiredChapterRangeGenres.length > 0 ||
    context.missingRequiredUsableChapterRangeGenres.length > 0
  ) {
    addTask({
      id: 'collect-required-chapter-range-coverage',
      priority: 'critical',
      target: 'chapter-range-coverage',
      currentValue: summarizeCoverageGaps([
        ['under-sampled ranges', context.underSampledRequiredChapterRanges],
        ['usable under-sampled ranges', context.underSampledUsableRequiredChapterRanges],
        ['missing range genres', context.missingRequiredChapterRangeGenres],
        ['missing usable range genres', context.missingRequiredUsableChapterRangeGenres],
      ]),
      requiredValue: context.chapterRangeCoverage
        .map(coverage => `${coverage.id}:${coverage.minimumSamples}/${coverage.minimumUsableSamples}`)
        .join(', '),
      sampleIds: sampleIds(result => context.chapterRangeCoverage.some(coverage => isInChapterRange(result.chapter, coverage))),
      action: 'Collect and repair reader-panel samples for required opening, middle, ending, or custom chapter ranges and their required genres.',
      rationale: 'Opening-only evidence should not tune standards for middle escalation, late payoffs, or finale retention.',
    });
  }

  return tasks.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.id.localeCompare(b.id));
}

function summarizeCoverageGaps(entries: Array<[string, string[]]>): string {
  const parts = entries
    .filter(([, values]) => values.length > 0)
    .map(([label, values]) => `${label}: ${values.join(', ')}`);
  return parts.length > 0 ? parts.join('; ') : 'none';
}

function priorityRank(priority: ReaderResponseEvidenceCollectionPriority): number {
  if (priority === 'critical') return 0;
  if (priority === 'major') return 1;
  return 2;
}

function buildGateTuningSuggestions(
  sampleResults: ReaderResponseCalibrationSampleResult[],
  blindSpots: ReaderResponseBlindSpot[],
  readyForGateTuning: boolean,
  options: ResolvedReaderResponseCalibrationOptions,
  weights: Record<ReaderResponseDimension, number>
): ReaderResponseGateTuningSuggestion[] {
  if (!readyForGateTuning) {
    const blockerSamples = sampleResults
      .filter(result => !isUsableReaderPanelSample(result, options))
      .slice(0, 8)
      .map(result => result.id);

    return [
      {
        code: 'collect-more-reader-evidence',
        action: 'collect-more-evidence',
        target: 'reader-panel-evidence',
        currentValue: sampleResults.filter(result => isUsableReaderPanelSample(result, options)).length,
        suggestedValue: Math.max(
          options.minimumSampleCountForTuning,
          options.requiredGenres.length * options.minimumUsableSamplesPerGenre,
          ...options.requiredChapterRanges.map(range => range.minimumUsableSamples ?? 1)
        ),
        evidenceSampleIds: blockerSamples,
        evidenceSummary: summarizeTuningBlockers(sampleResults, options),
        rationale: 'Reader-panel data is not yet reliable, actionable, representative, protocol-controlled, or broad enough for hard gate retuning.',
        safety: 'Do not change automated thresholds from these samples; use them only as revision evidence until coverage and reliability gates pass.',
      },
    ];
  }

  const usableSamples = sampleResults.filter(result => isUsableReaderPanelSample(result, options));
  const tuningEvidenceSamples = selectGateTuningEvidenceSamples(usableSamples, options);
  const suggestions: ReaderResponseGateTuningSuggestion[] = [];
  const falsePositiveSamples = tuningEvidenceSamples.filter(result => result.failureType === 'auto-false-positive');
  const falseNegativeSamples = tuningEvidenceSamples.filter(result => result.failureType === 'auto-false-negative');
  const overestimatedSamples = tuningEvidenceSamples.filter(result => result.failureType === 'auto-overestimate');
  const underestimatedSamples = tuningEvidenceSamples.filter(result => result.failureType === 'auto-underestimate');
  const evidenceScope = options.requireHoldoutForTuning ? 'usable holdout' : 'usable';

  if (falsePositiveSamples.length > 0) {
    const averageGap = average(falsePositiveSamples.map(result => result.scoreGap));
    suggestions.push({
      code: 'tighten-automated-high-pass',
      action: 'tighten',
      target: 'automated-high-pass-threshold',
      currentValue: options.highAutomatedThreshold,
      suggestedValue: Math.min(98, options.highAutomatedThreshold + tuningStep(averageGap)),
      evidenceSampleIds: falsePositiveSamples.map(result => result.id),
      evidenceSummary: `${falsePositiveSamples.length} ${evidenceScope} sample(s) had automated high-pass scores while reader composite stayed below ${options.lowReaderThreshold}.`,
      rationale: 'The system is overconfident on samples that target readers do not want to continue.',
      safety: 'Tighten only after preserving the evidence sample IDs and re-running benchmark/reader-panel checks; do not apply if the false positives are genre-specific outliers or absent from holdout samples.',
    });
  } else if (overestimatedSamples.length > 0) {
    const averageGap = average(overestimatedSamples.map(result => result.scoreGap));
    suggestions.push({
      code: 'tighten-automated-high-pass',
      action: 'tighten',
      target: 'automated-overestimate-guard',
      currentValue: options.severeGapThreshold,
      suggestedValue: Math.max(8, options.severeGapThreshold - tuningStep(averageGap)),
      evidenceSampleIds: overestimatedSamples.map(result => result.id),
      evidenceSummary: `${overestimatedSamples.length} ${evidenceScope} sample(s) overestimated reader response by at least ${options.severeGapThreshold} points.`,
      rationale: 'The system should surface large reader-response gaps earlier, even when the automated score is not a formal false positive.',
      safety: 'Use as a warning guard before changing pass/fail thresholds; confirm the samples are not polarized, narrow-cohort, or calibration-only cases.',
    });
  }

  if (falseNegativeSamples.length > 0) {
    const averageGap = average(falseNegativeSamples.map(result => Math.abs(result.scoreGap)));
    suggestions.push({
      code: 'loosen-reader-loved-low-score-route',
      action: 'loosen',
      target: 'reader-loved-low-score-review',
      currentValue: options.lowAutomatedThreshold,
      suggestedValue: Math.max(55, options.lowAutomatedThreshold - tuningStep(averageGap)),
      evidenceSampleIds: falseNegativeSamples.map(result => result.id),
      evidenceSummary: `${falseNegativeSamples.length} ${evidenceScope} sample(s) scored below automated low threshold while reader composite reached at least ${options.highReaderThreshold}.`,
      rationale: 'The system may be penalizing a valid genre, pacing, or style route that actual readers strongly liked.',
      safety: 'Route these cases to human review or genre-specific calibration first; do not globally loosen the gate without matching known-bad and holdout-confirmed samples.',
    });
  } else if (underestimatedSamples.length > 0) {
    const averageGap = average(underestimatedSamples.map(result => Math.abs(result.scoreGap)));
    suggestions.push({
      code: 'loosen-reader-loved-low-score-route',
      action: 'loosen',
      target: 'automated-underestimate-guard',
      currentValue: options.severeGapThreshold,
      suggestedValue: Math.max(8, options.severeGapThreshold - tuningStep(averageGap)),
      evidenceSampleIds: underestimatedSamples.map(result => result.id),
      evidenceSummary: `${underestimatedSamples.length} ${evidenceScope} sample(s) underestimated reader response by at least ${options.severeGapThreshold} points.`,
      rationale: 'The system should flag reader-loved exceptions instead of treating every automated penalty as equally reliable.',
      safety: 'Keep these samples in a reviewed exception set until matching negative samples and holdout evidence prove the route is generally safe.',
    });
  }

  for (const blindSpot of blindSpots.slice(0, 3)) {
    const evidenceSampleIds = tuningEvidenceSamples
      .filter(result => result.dimensionIssues.some(issue => issue.dimension === blindSpot.dimension))
      .map(result => result.id);
    if (evidenceSampleIds.length === 0) continue;

    const currentWeight = weights[blindSpot.dimension];
    suggestions.push({
      code: 'increase-reader-dimension-sensitivity',
      action: 'increase-sensitivity',
      target: `reader-dimension:${blindSpot.dimension}`,
      currentValue: roundScore(currentWeight),
      suggestedValue: roundScore(currentWeight * 1.15),
      evidenceSampleIds,
      evidenceSummary: `${evidenceSampleIds.length} ${evidenceScope} sample(s) showed weak ${blindSpot.dimension}; average reader score ${blindSpot.averageScore}.`,
      rationale: buildBlindSpotRecommendation(blindSpot.dimension),
      safety: 'Increase sensitivity only for the affected dimension and re-check false positives/false negatives after the change.',
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      code: 'hold-current-gates',
      action: 'hold',
      target: 'automated-gate-thresholds',
      evidenceSampleIds: tuningEvidenceSamples.map(result => result.id).slice(0, 12),
      evidenceSummary: `${tuningEvidenceSamples.length} ${evidenceScope} sample(s) show no severe reader/automation disagreement.`,
      rationale: 'Reader-panel evidence is usable and does not indicate a current threshold drift.',
      safety: 'Keep collecting genre and chapter-range coverage before declaring the thresholds stable across the whole series.',
    });
  }

  return suggestions;
}

function summarizeTuningBlockers(
  sampleResults: ReaderResponseCalibrationSampleResult[],
  options: ResolvedReaderResponseCalibrationOptions
): string {
  const splitCoverage = countSplitCoverage(sampleResults, options);
  const blockerEntries: Array<[string, number]> = [
    ['low reliability', sampleResults.filter(result => result.reliability !== 'usable').length],
    [
      'low human reader evidence',
      options.requireHumanReaderEvidenceForTuning
        ? sampleResults.filter(result => result.humanReaderEvidence !== 'usable').length
        : 0,
    ],
    [
      'low response data quality',
      options.requireResponseDataQualityForTuning
        ? sampleResults.filter(result => result.responseDataQuality !== 'usable').length
        : 0,
    ],
    ['low actionability', sampleResults.filter(result => result.evidenceQuality !== 'usable').length],
    [
      'low annotation reliability',
      options.requireAnnotationReliabilityForTuning
        ? sampleResults.filter(result => result.annotationReliability !== 'usable').length
        : 0,
    ],
    ['low retention evidence', sampleResults.filter(result => result.retentionEvidence !== 'usable').length],
    [
      'low drop-off localization',
      options.requireDropOffLocalizationEvidenceForTuning
        ? sampleResults.filter(result => result.dropOffLocalizationEvidence !== 'usable').length
        : 0,
    ],
    ['low scene recall', sampleResults.filter(result => result.sceneRecallEvidence !== 'usable').length],
    ['low tension trace', sampleResults.filter(result => result.tensionTraceEvidence !== 'usable').length],
    ['low narrative forecast', sampleResults.filter(result => result.narrativeForecastEvidence !== 'usable').length],
    ['low line quote', sampleResults.filter(result => result.lineQuoteEvidence !== 'usable').length],
    ['low payoff fairness', sampleResults.filter(result => result.payoffFairnessEvidence !== 'usable').length],
    ['low advocacy', sampleResults.filter(result => result.advocacyEvidence !== 'usable').length],
    ['low durable engagement', sampleResults.filter(result => result.durableEngagementEvidence !== 'usable').length],
    [
      'low continuation behavior',
      options.requireContinuationBehaviorEvidenceForTuning
        ? sampleResults.filter(result => result.continuationBehaviorEvidence !== 'usable').length
        : 0,
    ],
    ['low resonance evidence', sampleResults.filter(result => result.resonanceEvidence !== 'usable').length],
    [
      'low delayed memory',
      options.requireDelayedMemoryEvidenceForTuning
        ? sampleResults.filter(result => result.delayedMemoryEvidence !== 'usable').length
        : 0,
    ],
    ['low consensus', sampleResults.filter(result => result.panelConsensus !== 'clear').length],
    ['wide confidence', sampleResults.filter(result => result.readerScoreConfidence !== 'precise').length],
    ['narrow representativeness', sampleResults.filter(result => result.cohortRepresentativeness !== 'balanced').length],
    ['weak protocol', sampleResults.filter(result => result.panelProtocolQuality !== 'strong').length],
    [
      'missing comparative preference',
      options.requireComparativePreferenceForTuning
        ? sampleResults.filter(result => result.comparativePreferenceStatus === 'none').length
        : 0,
    ],
    [
      'weak comparative preference',
      sampleResults.filter(result => result.comparativePreferenceStatus === 'weak').length,
    ],
    [
      'weak revision outcome',
      options.requireRevisionOutcomeEvidenceForTuning
        ? sampleResults.filter(result => result.revisionOutcomeEvidence !== 'improved').length
        : sampleResults.filter(result => result.revisionOutcomeEvidence === 'weak').length,
    ],
    [
      'revision regression',
      sampleResults.filter(result => result.revisionOutcomeEvidence === 'regressed').length,
    ],
    [
      'missing holdout',
      options.requireHoldoutForTuning &&
        splitCoverage.holdoutSamples < options.minimumHoldoutSampleCount
        ? 1
        : 0,
    ],
    [
      'low usable holdout',
      options.requireHoldoutForTuning &&
        splitCoverage.usableHoldoutSamples < options.minimumUsableHoldoutSampleCount
        ? 1
        : 0,
    ],
  ];
  const blockers = blockerEntries
    .filter(([, count]) => count > 0)
    .map(([label, count]) => `${label}: ${count}`);

  return blockers.length > 0
    ? blockers.join(', ')
    : 'Coverage requirements are not yet satisfied.';
}

function selectGateTuningEvidenceSamples(
  usableSamples: ReaderResponseCalibrationSampleResult[],
  options: ResolvedReaderResponseCalibrationOptions
): ReaderResponseCalibrationSampleResult[] {
  if (!options.requireHoldoutForTuning) return usableSamples;
  return usableSamples.filter(result => result.calibrationSplit === 'holdout');
}

function tuningStep(averageGap: number): number {
  if (!Number.isFinite(averageGap) || averageGap <= 0) return 2;
  return Math.max(2, Math.min(6, Math.ceil(averageGap / 5)));
}

function countGenreCoverage(
  sampleResults: ReaderResponseCalibrationSampleResult[],
  options: ResolvedReaderResponseCalibrationOptions
): Record<string, ReaderResponseGenreCoverage> {
  const byGenre = new Map<string, {
    totalSamples: number;
    usableSamples: number;
    chapters: Set<number>;
    usableChapters: Set<number>;
  }>();

  for (const result of sampleResults) {
    if (!result.genre) continue;
    const coverage = byGenre.get(result.genre) ?? {
      totalSamples: 0,
      usableSamples: 0,
      chapters: new Set<number>(),
      usableChapters: new Set<number>(),
    };
    const usable = isUsableReaderPanelSample(result, options);
    coverage.totalSamples += 1;
    if (usable) coverage.usableSamples += 1;
    if (Number.isInteger(result.chapter) && (result.chapter ?? 0) > 0) {
      coverage.chapters.add(result.chapter as number);
      if (usable) coverage.usableChapters.add(result.chapter as number);
    }
    byGenre.set(result.genre, coverage);
  }

  const coverage: Record<string, ReaderResponseGenreCoverage> = {};
  for (const [genre, genreCoverage] of byGenre.entries()) {
    const chapters = sortedChapters(genreCoverage.chapters);
    const usableChapters = sortedChapters(genreCoverage.usableChapters);
    coverage[genre] = {
      totalSamples: genreCoverage.totalSamples,
      usableSamples: genreCoverage.usableSamples,
      chapters,
      longestConsecutiveRun: longestConsecutiveRun(chapters),
      usableChapters,
      usableLongestConsecutiveRun: longestConsecutiveRun(usableChapters),
    };
  }

  return coverage;
}

function countChapterRangeCoverage(
  sampleResults: ReaderResponseCalibrationSampleResult[],
  requirements: ReaderResponseChapterRangeRequirement[],
  options: ResolvedReaderResponseCalibrationOptions
): ReaderResponseChapterRangeCoverage[] {
  return requirements.map(requirement => {
    const samplesInRange = sampleResults.filter(result => isInChapterRange(result.chapter, requirement));
    const usableSamplesInRange = samplesInRange.filter(result => isUsableReaderPanelSample(result, options));
    const genres = uniqueStrings(samplesInRange.map(result => result.genre ?? ''));
    const usableGenres = uniqueStrings(usableSamplesInRange.map(result => result.genre ?? ''));
    const requiredGenres = uniqueStrings(requirement.requiredGenres ?? []);

    return {
      id: requirement.id,
      label: requirement.label,
      minChapter: requirement.minChapter,
      maxChapter: requirement.maxChapter,
      requiredGenres,
      minimumSamples: requirement.minimumSamples ?? 1,
      minimumUsableSamples: requirement.minimumUsableSamples ?? 1,
      totalSamples: samplesInRange.length,
      usableSamples: usableSamplesInRange.length,
      genres,
      usableGenres,
      missingRequiredGenres: requiredGenres.filter(genre => !genres.includes(genre)),
      missingRequiredUsableGenres: requiredGenres.filter(genre => !usableGenres.includes(genre)),
    };
  });
}

function countSplitCoverage(
  sampleResults: ReaderResponseCalibrationSampleResult[],
  options: ResolvedReaderResponseCalibrationOptions
): ReaderResponseSplitCoverage {
  const coverage: ReaderResponseSplitCoverage = {
    calibrationSamples: 0,
    validationSamples: 0,
    holdoutSamples: 0,
    unassignedSamples: 0,
    usableCalibrationSamples: 0,
    usableValidationSamples: 0,
    usableHoldoutSamples: 0,
    usableUnassignedSamples: 0,
  };

  for (const result of sampleResults) {
    const usable = isUsableReaderPanelSample(result, options);
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
        break;
      default:
        coverage.unassignedSamples += 1;
        if (usable) coverage.usableUnassignedSamples += 1;
        break;
    }
  }

  return coverage;
}

function isInChapterRange(
  chapter: number | undefined,
  requirement: ReaderResponseChapterRangeRequirement
): boolean {
  if (!Number.isInteger(chapter) || (chapter ?? 0) < requirement.minChapter) return false;
  if (requirement.maxChapter !== undefined && (chapter ?? 0) > requirement.maxChapter) return false;
  return true;
}

function isUsableReaderPanelSample(
  result: ReaderResponseCalibrationSampleResult,
  options: ResolvedReaderResponseCalibrationOptions
): boolean {
  return result.reliability === 'usable' &&
    result.humanReaderEvidence === 'usable' &&
    result.responseDataQuality === 'usable' &&
    result.evidenceQuality === 'usable' &&
    (!options.requireAnnotationReliabilityForTuning || result.annotationReliability === 'usable') &&
    result.retentionEvidence === 'usable' &&
    (!options.requireDropOffLocalizationEvidenceForTuning ||
      result.dropOffLocalizationEvidence === 'usable') &&
    result.sceneRecallEvidence === 'usable' &&
    result.tensionTraceEvidence === 'usable' &&
    result.narrativeForecastEvidence === 'usable' &&
    result.lineQuoteEvidence === 'usable' &&
    result.payoffFairnessEvidence === 'usable' &&
    result.advocacyEvidence === 'usable' &&
    result.durableEngagementEvidence === 'usable' &&
    (!options.requireContinuationBehaviorEvidenceForTuning ||
      result.continuationBehaviorEvidence === 'usable') &&
    result.resonanceEvidence === 'usable' &&
    (!options.requireDelayedMemoryEvidenceForTuning || result.delayedMemoryEvidence === 'usable') &&
    result.panelConsensus === 'clear' &&
    result.readerScoreConfidence === 'precise' &&
    result.cohortRepresentativeness === 'balanced' &&
    result.panelProtocolQuality === 'strong';
}

function sortedChapters(chapters: Set<number>): number[] {
  return [...chapters].sort((a, b) => a - b);
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

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(value => value.length > 0))];
}

function sumValues(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

function normalizeChapterRangeRequirements(
  requirements: ReaderResponseChapterRangeRequirement[]
): ReaderResponseChapterRangeRequirement[] {
  const normalized: ReaderResponseChapterRangeRequirement[] = [];
  const seen = new Set<string>();

  for (const requirement of requirements) {
    const id = requirement.id.trim();
    if (id.length === 0 || seen.has(id)) continue;
    if (!Number.isInteger(requirement.minChapter) || requirement.minChapter < 1) continue;
    if (
      requirement.maxChapter !== undefined &&
      (!Number.isInteger(requirement.maxChapter) || requirement.maxChapter < requirement.minChapter)
    ) {
      continue;
    }

    seen.add(id);
    normalized.push({
      id,
      label: requirement.label?.trim() || undefined,
      minChapter: requirement.minChapter,
      maxChapter: requirement.maxChapter,
      requiredGenres: uniqueStrings(requirement.requiredGenres ?? []),
      minimumSamples: normalizePositiveInteger(requirement.minimumSamples) ?? 1,
      minimumUsableSamples: normalizePositiveInteger(requirement.minimumUsableSamples) ?? 1,
    });
  }

  return normalized;
}

function normalizePositiveInteger(value: number | undefined): number | undefined {
  return Number.isInteger(value) && (value ?? 0) > 0 ? value : undefined;
}

function normalizeUnitRatio(value: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
    ? value
    : undefined;
}

function buildDimensionMessage(dimension: ReaderResponseDimension): string {
  switch (dimension) {
    case 'next-click':
      return 'Readers are not sufficiently motivated to continue to the next chapter.';
    case 'attention':
      return 'Readers report weak focus or frequent drift while reading.';
    case 'emotional-engagement':
      return 'Readers understand events but are not emotionally pulled into them.';
    case 'mental-imagery':
      return 'Readers are not forming a vivid enough story-world image.';
    case 'transportation':
      return 'Readers are not feeling carried into the story world.';
    case 'character-attachment':
      return 'Readers are not attached enough to the protagonist or central character whose outcome should matter.';
    case 'relationship-investment':
      return 'Readers are not sufficiently invested in the relationship turn or interpersonal stakes.';
    case 'novelty':
      return 'Readers find the premise, scene route, or payoff too familiar despite automated quality signals.';
    case 'surprise':
      return 'Readers do not feel enough earned surprise, reversal, or fresh discovery.';
    case 'resonance':
      return 'Readers do not carry a strong aftertaste, meaning, or memorable emotional echo after the scene.';
    case 'scene-recall':
      return 'Readers cannot recall a concrete, distinctive scene moment after reading.';
    case 'recommendation-intent':
      return 'Readers liked the chapter privately but are not moved to recommend, share, or discuss it with another reader.';
    case 'bookmark-intent':
      return 'Readers are not ready to bookmark, save, or add the work to their library after the chapter.';
    case 'return-intent':
      return 'Readers are not confident they would return to the story after a delay.';
    case 'purchase-intent':
      return 'Readers are not willing to spend paid currency, subscription attention, or premium unlocks to continue.';
    case 'binge-intent':
      return 'Readers do not feel a strong pull to keep reading multiple chapters in the same sitting.';
    case 'interest':
      return 'Readers do not find the situation or question interesting enough.';
    case 'suspense':
      return 'Readers do not feel enough unresolved pressure or risk.';
    case 'beauty':
      return 'Readers do not value the prose or aesthetic surface enough.';
    case 'amusement':
      return 'Readers do not find the intended lighter pleasure route rewarding.';
    case 'overall-liking':
      return 'Readers give low overall story liking despite automated quality signals.';
  }
}

function buildBlindSpotRecommendation(dimension: ReaderResponseDimension): string {
  switch (dimension) {
    case 'next-click':
      return 'Strengthen the final open loop with a concrete unanswered question, consequence, or choice that changes the next chapter.';
    case 'attention':
      return 'Reduce explanatory slack and make every scene carry an immediate objective, obstacle, and changed state.';
    case 'emotional-engagement':
      return 'Put a concrete desire, relationship, or failure cost on page before the plot mechanism pays off.';
    case 'mental-imagery':
      return 'Anchor the scene with visible objects, spatial blocking, and action the reader can picture.';
    case 'transportation':
      return 'Remove meta-design language and keep the reader inside scene-native cause, sensation, and consequence.';
    case 'character-attachment':
      return 'Give the character a signature choice, visible cost, vulnerable limit, or socially legible reaction that makes readers care about their outcome.';
    case 'relationship-investment':
      return 'Make the relationship turn carry mutual pressure, risk, changed trust or distance, and a consequence that alters later behavior.';
    case 'novelty':
      return 'Replace familiar premise handling with a genre-native but less expected rule, obstacle, image, or payoff route.';
    case 'surprise':
      return 'Seed a fair but non-obvious reversal so discovery changes the reader question instead of merely confirming it.';
    case 'resonance':
      return 'Give the scene a lasting emotional or thematic aftertaste through consequence, image, character cost, or changed self-understanding.';
    case 'scene-recall':
      return 'Build at least one recallable scene anchor: a concrete image, choice, reversal, or consequence readers can name without prompting.';
    case 'recommendation-intent':
      return 'Give readers a talkable hook: a recommendable scene, dilemma, reversal, or character choice they can pitch to a specific friend or reader cohort.';
    case 'bookmark-intent':
      return 'Add a concrete promise readers want to save for later: an unresolved consequence, visible reward route, or character problem that feels worth returning to.';
    case 'return-intent':
      return 'Make the chapter close with a delayed-payoff reason to come back: a narrowed question, scheduled confrontation, irreversible choice, or next-scene obligation.';
    case 'purchase-intent':
      return 'Raise the value of continuation with a premium-feeling payoff promise, not just a withheld answer: readers should expect a consequential reveal, emotional turn, or genre reward.';
    case 'binge-intent':
      return 'Create a read-on chain by linking the closing beat to an immediate next action, shorter uncertainty loop, or escalating sequence momentum.';
    case 'interest':
      return 'Sharpen the central question with a specific clue, contradiction, or impossible choice.';
    case 'suspense':
      return 'Delay the outcome while escalating credible risk, narrowing time, or removing a safe option.';
    case 'beauty':
      return 'Calibrate prose rhythm and image quality against the target style profile instead of only fixing defects.';
    case 'amusement':
      return 'Add a genre-appropriate pleasure beat such as wit, social irony, banter, or playful reversal.';
    case 'overall-liking':
      return 'Compare high-scoring but disliked samples against reader comments before raising final-pass confidence.';
  }
}

function calculateCalibrationScore(
  meanAbsoluteError: number,
  falsePositiveCount: number,
  falseNegativeCount: number,
  overestimateCount: number,
  underestimateCount: number,
  lowReliabilityCount: number,
  lowHumanReaderEvidenceCount: number,
  lowResponseDataQualityCount: number,
  lowActionabilityCount: number,
  lowAnnotationReliabilityCount: number,
  lowRetentionEvidenceCount: number,
  lowDropOffLocalizationEvidenceCount: number,
  lowConsensusCount: number,
  lowConfidenceCount: number,
  lowRepresentativenessCount: number,
  lowProtocolQualityCount: number,
  comparativePreferenceBlockerCount: number,
  lowRevisionOutcomeEvidenceCount: number,
  revisionRegressionCount: number,
  lowSceneRecallEvidenceCount: number,
  lowTensionTraceEvidenceCount: number,
  lowNarrativeForecastEvidenceCount: number,
  lowLineQuoteEvidenceCount: number,
  lowPayoffFairnessEvidenceCount: number,
  lowAdvocacyEvidenceCount: number,
  lowDurableEngagementEvidenceCount: number,
  lowContinuationBehaviorEvidenceCount: number,
  lowResonanceEvidenceCount: number,
  lowDelayedMemoryEvidenceCount: number,
  underSampledHoldoutSamples: boolean,
  underSampledUsableHoldoutSamples: boolean
): number {
  const penalty = (meanAbsoluteError * 0.8) +
    (falsePositiveCount * 12) +
    (falseNegativeCount * 10) +
    (overestimateCount * 5) +
    (underestimateCount * 4) +
    (lowReliabilityCount * 2) +
    (lowHumanReaderEvidenceCount * 3) +
    (lowResponseDataQualityCount * 2) +
    (lowActionabilityCount * 3) +
    (lowAnnotationReliabilityCount * 3) +
    (lowRetentionEvidenceCount * 2) +
    (lowDropOffLocalizationEvidenceCount * 2) +
    (lowConsensusCount * 2) +
    (lowConfidenceCount * 2) +
    (lowRepresentativenessCount * 2) +
    (lowProtocolQualityCount * 2) +
    (comparativePreferenceBlockerCount * 3) +
    (lowRevisionOutcomeEvidenceCount * 2) +
    (revisionRegressionCount * 6) +
    (lowSceneRecallEvidenceCount * 2) +
    (lowTensionTraceEvidenceCount * 2) +
    (lowNarrativeForecastEvidenceCount * 2) +
    (lowLineQuoteEvidenceCount * 2) +
    (lowPayoffFairnessEvidenceCount * 2) +
    (lowAdvocacyEvidenceCount * 2) +
    (lowDurableEngagementEvidenceCount * 2) +
    (lowContinuationBehaviorEvidenceCount * 2) +
    (lowResonanceEvidenceCount * 2) +
    (lowDelayedMemoryEvidenceCount * 2) +
    (underSampledHoldoutSamples ? 2 : 0) +
    (underSampledUsableHoldoutSamples ? 3 : 0);
  return roundScore(clampScore(100 - penalty));
}

function calculateCorrelation(xs: number[], ys: number[]): number | undefined {
  if (xs.length !== ys.length || xs.length < 2) return undefined;

  const meanX = average(xs);
  const meanY = average(ys);
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let index = 0; index < xs.length; index += 1) {
    const dx = xs[index] - meanX;
    const dy = ys[index] - meanY;
    numerator += dx * dy;
    denominatorX += dx * dx;
    denominatorY += dy * dy;
  }

  const denominator = Math.sqrt(denominatorX * denominatorY);
  if (denominator === 0) return undefined;
  return roundScore(numerator / denominator);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, score));
}

function roundScore(score: number): number {
  return Math.round(score * 100) / 100;
}
