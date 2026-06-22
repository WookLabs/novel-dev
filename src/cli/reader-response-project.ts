import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  evaluateReaderResponseCalibration,
  type AutomatedReaderQualityScores,
  type ReaderResponseCalibrationOptions,
  type ReaderResponseCalibrationResult,
  type ReaderResponseCalibrationSample,
  type ReaderResponseCalibrationSplit,
  type ReaderResponseChapterRangeRequirement,
  type ReaderResponseDelayedMemoryAnnotation,
  type ReaderResponseDimension,
  type ReaderResponseDropOffAnnotation,
  type ReaderResponseDropOffEventType,
  type ReaderResponseDurableEngagementAction,
  type ReaderResponseDurableEngagementAnnotation,
  type ReaderResponseFrictionAnnotation,
  type ReaderResponseFrictionSeverity,
  type ReaderResponseAnnotationReliabilityMetric,
  type ReaderResponseAdvocacyAnnotation,
  type ReaderResponseLineQuoteAnnotation,
  type ReaderResponseLineQuoteFunction,
  type ReaderResponseNarrativeForecastAnnotation,
  type ReaderResponsePayoffFairnessAnnotation,
  type ReaderResponseRatingScale,
  type ReaderResponseRespondentSource,
  type ReaderResponseResonanceAnnotation,
  type ReaderResponseSceneRecallAnnotation,
  type ReaderResponseScores,
  type ReaderResponseTensionTraceAnnotation,
} from '../quality/reader-response-calibration.js';
import {
  buildSourceEvidenceManifest,
  type SourceEvidenceManifest,
} from './source-evidence.js';

export interface CalibrateReaderResponseProjectArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  minimumRespondentCount?: number;
  minimumSampleCountForTuning?: number;
  requiredGenres?: string[];
  requiredTargetReaderSegments?: string[];
  minimumRespondentsPerRequiredTargetSegment?: number;
  requireTargetReaderSegmentQuotasForTuning?: boolean;
  requiredRecruitmentChannels?: string[];
  minimumRespondentsPerRequiredRecruitmentChannel?: number;
  maximumDominantRecruitmentChannelRatio?: number;
  requireRecruitmentChannelDiversityForTuning?: boolean;
  maximumSamplesPerRespondent?: number;
  minimumOrderBalanceRatio?: number;
  minimumSamplesPerGenre?: number;
  minimumUsableSamplesPerGenre?: number;
  requiredSeriesLength?: number;
  requiredUsableSeriesLength?: number;
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
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumStartedReadCount?: number;
  minimumPanelCompletionRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  requireRetentionEvidenceForTuning?: boolean;
  minimumDropOffAnnotationCount?: number;
  minimumActionableDropOffAnnotationCount?: number;
  requireDropOffLocalizationEvidenceForTuning?: boolean;
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
  minimumComparativePreferenceWinRate?: number;
  minimumComparativePreferenceRespondentCount?: number;
  requireComparativePreferenceForTuning?: boolean;
  minimumRevisionLift?: number;
  minimumRevisionPreferenceWinRate?: number;
  minimumRevisionPreferenceRespondentCount?: number;
  requireRevisionOutcomeEvidenceForTuning?: boolean;
  requiredChapterRanges?: ReaderResponseChapterRangeRequirement[];
}

export interface CalibrateReaderResponseCliResult {
  projectId: string;
  projectDir: string;
  inputDir: string;
  outputPath: string;
  samplesLoaded: number;
  requiredGenres: string[];
  requiredTargetReaderSegments: string[];
  minimumRespondentsPerRequiredTargetSegment?: number;
  requireTargetReaderSegmentQuotasForTuning?: boolean;
  requiredRecruitmentChannels: string[];
  minimumRespondentsPerRequiredRecruitmentChannel?: number;
  maximumDominantRecruitmentChannelRatio?: number;
  requireRecruitmentChannelDiversityForTuning?: boolean;
  maximumSamplesPerRespondent?: number;
  minimumOrderBalanceRatio?: number;
  minimumSamplesPerGenre?: number;
  minimumUsableSamplesPerGenre?: number;
  requiredSeriesLength?: number;
  requiredUsableSeriesLength?: number;
  minimumHumanRespondentRatio?: number;
  requireHumanReaderEvidenceForTuning?: boolean;
  minimumMedianReadTimeSeconds?: number;
  maximumSpeedingResponseRatio?: number;
  maximumStraightLiningResponseRatio?: number;
  maximumDuplicateResponseRatio?: number;
  maximumBotSuspectedResponseRatio?: number;
  maximumLowQualityOpenEndedRatio?: number;
  maximumInconsistentResponseRatio?: number;
  maximumQualityFlaggedResponseRatio?: number;
  requireResponseDataQualityForTuning?: boolean;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumStartedReadCount?: number;
  minimumPanelCompletionRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  requireRetentionEvidenceForTuning?: boolean;
  minimumDropOffAnnotationCount?: number;
  minimumActionableDropOffAnnotationCount?: number;
  requireDropOffLocalizationEvidenceForTuning?: boolean;
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
  minimumComparativePreferenceWinRate?: number;
  minimumComparativePreferenceRespondentCount?: number;
  requireComparativePreferenceForTuning?: boolean;
  minimumRevisionLift?: number;
  minimumRevisionPreferenceWinRate?: number;
  minimumRevisionPreferenceRespondentCount?: number;
  requireRevisionOutcomeEvidenceForTuning?: boolean;
  requiredChapterRanges: ReaderResponseChapterRangeRequirement[];
  sourceEvidence: SourceEvidenceManifest;
  calibration: ReaderResponseCalibrationResult;
}

interface RawReaderResponseFile {
  required_genres?: string[];
  required_target_reader_segments?: string[];
  minimum_respondents_per_required_target_segment?: number;
  require_target_reader_segment_quotas?: boolean;
  required_recruitment_channels?: string[];
  minimum_respondents_per_required_recruitment_channel?: number;
  maximum_dominant_recruitment_channel_ratio?: number;
  require_recruitment_channel_diversity?: boolean;
  maximum_samples_per_respondent?: number;
  minimum_order_balance_ratio?: number;
  minimum_samples_per_genre?: number;
  minimum_usable_samples_per_genre?: number;
  required_series_length?: number;
  required_usable_series_length?: number;
  minimum_human_respondent_ratio?: number;
  require_human_reader_evidence?: boolean;
  minimum_median_read_time_seconds?: number;
  maximum_median_reading_words_per_minute?: number;
  maximum_minimum_reading_words_per_minute?: number;
  maximum_median_reading_characters_per_minute?: number;
  maximum_minimum_reading_characters_per_minute?: number;
  require_length_normalized_read_time?: boolean;
  maximum_speeding_response_ratio?: number;
  maximum_straight_lining_response_ratio?: number;
  maximum_duplicate_response_ratio?: number;
  maximum_bot_suspected_response_ratio?: number;
  maximum_low_quality_open_ended_ratio?: number;
  maximum_inconsistent_response_ratio?: number;
  maximum_quality_flagged_response_ratio?: number;
  require_response_data_quality?: boolean;
  minimum_holdout_samples?: number;
  minimum_usable_holdout_samples?: number;
  minimum_started_read_count?: number;
  minimum_panel_completion_rate?: number;
  maximum_drop_off_ratio?: number;
  maximum_skimmed_read_ratio?: number;
  require_retention_evidence?: boolean;
  minimum_drop_off_annotations?: number;
  minimum_actionable_drop_off_annotations?: number;
  require_drop_off_localization_evidence?: boolean;
  minimum_annotation_coder_count?: number;
  minimum_annotation_double_coded_count?: number;
  minimum_annotation_agreement_rate?: number;
  require_annotation_reliability_evidence?: boolean;
  minimum_unprompted_scene_recall_ratio?: number;
  minimum_distinctive_scene_recall_ratio?: number;
  minimum_scene_recall_annotations?: number;
  require_scene_recall_evidence?: boolean;
  minimum_tension_trace_ratio?: number;
  minimum_tension_peak_ratio?: number;
  minimum_tension_question_ratio?: number;
  minimum_tension_trace_annotations?: number;
  require_tension_trace_evidence?: boolean;
  minimum_forecast_prediction_ratio?: number;
  minimum_forecast_diversity_count?: number;
  minimum_forecast_revision_ratio?: number;
  minimum_forecast_mismatch_ratio?: number;
  minimum_narrative_forecast_annotations?: number;
  require_narrative_forecast_evidence?: boolean;
  minimum_quote_recall_ratio?: number;
  minimum_favorite_line_ratio?: number;
  minimum_shareable_line_ratio?: number;
  minimum_line_quote_annotations?: number;
  require_line_quote_evidence?: boolean;
  minimum_payoff_setup_recall_ratio?: number;
  minimum_payoff_trigger_recognition_ratio?: number;
  minimum_payoff_earned_ratio?: number;
  minimum_payoff_recontextualization_ratio?: number;
  minimum_payoff_emotional_satisfaction_ratio?: number;
  minimum_payoff_fairness_annotations?: number;
  require_payoff_fairness_evidence?: boolean;
  minimum_organic_recommendation_ratio?: number;
  minimum_discussion_prompt_ratio?: number;
  minimum_advocacy_annotations?: number;
  require_advocacy_evidence?: boolean;
  minimum_bookmark_ratio?: number;
  minimum_return_intent_ratio?: number;
  minimum_paid_continuation_intent_ratio?: number;
  minimum_durable_engagement_annotations?: number;
  require_durable_engagement_evidence?: boolean;
  minimum_continuation_behavior_impressions?: number;
  minimum_next_chapter_click_through_ratio?: number;
  minimum_next_chapter_open_ratio?: number;
  minimum_next_chapter_read_start_ratio?: number;
  require_continuation_behavior_evidence?: boolean;
  minimum_lingering_emotion_ratio?: number;
  minimum_reflective_meaning_ratio?: number;
  minimum_resonance_annotations?: number;
  require_resonance_evidence?: boolean;
  minimum_delayed_follow_up_respondent_ratio?: number;
  minimum_delayed_follow_up_hours?: number;
  minimum_delayed_scene_recall_ratio?: number;
  minimum_delayed_character_recall_ratio?: number;
  minimum_delayed_continuation_intent_ratio?: number;
  minimum_delayed_memory_annotations?: number;
  require_delayed_memory_evidence?: boolean;
  minimum_comparative_preference_win_rate?: number;
  minimum_comparative_preference_respondents?: number;
  require_comparative_preference?: boolean;
  minimum_revision_lift?: number;
  minimum_revision_preference_win_rate?: number;
  minimum_revision_preference_respondents?: number;
  require_revision_outcome_evidence?: boolean;
  required_chapter_ranges?: RawReaderResponseChapterRangeRequirement[];
  samples?: RawReaderResponseSample[];
}

interface RawReaderResponseChapterRangeRequirement {
  id?: string;
  label?: string;
  min_chapter?: number;
  max_chapter?: number;
  required_genres?: string[];
  minimum_samples?: number;
  minimum_usable_samples?: number;
}

interface ReaderResponseInput {
  samples: RawReaderResponseSample[];
  requiredGenres: string[];
  requiredTargetReaderSegments: string[];
  minimumRespondentsPerRequiredTargetSegment?: number;
  requireTargetReaderSegmentQuotasForTuning?: boolean;
  requiredRecruitmentChannels: string[];
  minimumRespondentsPerRequiredRecruitmentChannel?: number;
  maximumDominantRecruitmentChannelRatio?: number;
  requireRecruitmentChannelDiversityForTuning?: boolean;
  maximumSamplesPerRespondent?: number;
  minimumOrderBalanceRatio?: number;
  minimumSamplesPerGenre?: number;
  minimumUsableSamplesPerGenre?: number;
  requiredSeriesLength?: number;
  requiredUsableSeriesLength?: number;
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
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumStartedReadCount?: number;
  minimumPanelCompletionRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  requireRetentionEvidenceForTuning?: boolean;
  minimumDropOffAnnotationCount?: number;
  minimumActionableDropOffAnnotationCount?: number;
  requireDropOffLocalizationEvidenceForTuning?: boolean;
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
  minimumComparativePreferenceWinRate?: number;
  minimumComparativePreferenceRespondentCount?: number;
  requireComparativePreferenceForTuning?: boolean;
  minimumRevisionLift?: number;
  minimumRevisionPreferenceWinRate?: number;
  minimumRevisionPreferenceRespondentCount?: number;
  requireRevisionOutcomeEvidenceForTuning?: boolean;
  requiredChapterRanges: ReaderResponseChapterRangeRequirement[];
}

interface RawReaderResponseSample {
  id: string;
  label?: string;
  genre?: string;
  chapter?: number;
  version?: number;
  calibration_split?: string;
  automated?: {
    engagement_score?: number;
    gate_passed?: boolean;
    prose_taste_score?: number;
    issue_codes?: string[];
  };
  reader: {
    next_click?: number;
    attention?: number;
    emotional_engagement?: number;
    mental_imagery?: number;
    transportation?: number;
    character_attachment?: number;
    relationship_investment?: number;
    novelty?: number;
    surprise?: number;
    resonance?: number;
    scene_recall?: number;
    recommendation_intent?: number;
    bookmark_intent?: number;
    return_intent?: number;
    purchase_intent?: number;
    binge_intent?: number;
    interest?: number;
    suspense?: number;
    beauty?: number;
    amusement?: number;
    overall_liking?: number;
  };
  respondent_count?: number;
  rating_scale?: {
    min: number;
    max: number;
  };
  evidence?: {
    respondent_source?: string;
    human_respondent_count?: number;
    synthetic_respondent_count?: number;
    author_estimate_count?: number;
    manuscript_word_count?: number;
    manuscript_character_count?: number;
    median_read_time_seconds?: number;
    minimum_read_time_seconds?: number;
    speeding_response_count?: number;
    straight_lining_response_count?: number;
    duplicate_response_count?: number;
    bot_suspected_response_count?: number;
    low_quality_open_ended_response_count?: number;
    inconsistent_response_count?: number;
    quality_flagged_response_count?: number;
    target_reader_count?: number;
    target_reader_segment_count?: number;
    target_reader_segment_counts?: Record<string, number>;
    dominant_reader_segment_ratio?: number;
    started_read_count?: number;
    completed_read_count?: number;
    drop_off_count?: number;
    skimmed_read_count?: number;
    qualitative_comment_count?: number;
    friction_point_count?: number;
    actionable_friction_point_count?: number;
    rewrite_suggestion_count?: number;
    friction_annotations?: RawReaderResponseFrictionAnnotation[];
    drop_off_annotations?: RawReaderResponseDropOffAnnotation[];
    annotation_coder_count?: number;
    annotation_double_coded_count?: number;
    annotation_agreement_rate?: number;
    annotation_reliability_metric?: string;
    annotation_codebook_version?: string;
    annotation_adjudicated?: boolean;
    annotation_coder_blinded?: boolean;
    unprompted_scene_recall_count?: number;
    distinctive_scene_recall_count?: number;
    scene_recall_annotations?: RawReaderResponseSceneRecallAnnotation[];
    tension_trace_point_count?: number;
    tension_peak_count?: number;
    tension_question_count?: number;
    tension_trace_annotations?: RawReaderResponseTensionTraceAnnotation[];
    forecast_prediction_count?: number;
    forecast_diversity_count?: number;
    forecast_revision_count?: number;
    forecast_mismatch_count?: number;
    forecast_inflection_count?: number;
    narrative_forecast_annotations?: RawReaderResponseNarrativeForecastAnnotation[];
    quote_recall_count?: number;
    favorite_line_count?: number;
    shareable_line_count?: number;
    line_quote_annotations?: RawReaderResponseLineQuoteAnnotation[];
    payoff_setup_recall_count?: number;
    payoff_trigger_recognition_count?: number;
    payoff_earned_count?: number;
    payoff_recontextualization_count?: number;
    payoff_emotional_satisfaction_count?: number;
    payoff_fairness_annotations?: RawReaderResponsePayoffFairnessAnnotation[];
    organic_recommendation_count?: number;
    discussion_prompt_count?: number;
    advocacy_annotations?: RawReaderResponseAdvocacyAnnotation[];
    bookmark_count?: number;
    follow_or_library_add_count?: number;
    return_next_day_count?: number;
    binge_read_intent_count?: number;
    paid_continuation_intent_count?: number;
    durable_engagement_annotations?: RawReaderResponseDurableEngagementAnnotation[];
    next_chapter_cta_impression_count?: number;
    next_chapter_click_count?: number;
    next_chapter_open_count?: number;
    next_chapter_read_start_count?: number;
    lingering_emotion_count?: number;
    reflective_comment_count?: number;
    personal_memory_or_meaning_count?: number;
    resonance_annotations?: RawReaderResponseResonanceAnnotation[];
    delayed_follow_up_respondent_count?: number;
    delayed_follow_up_hours?: number;
    delayed_scene_recall_count?: number;
    delayed_character_recall_count?: number;
    delayed_next_click_intent_count?: number;
    delayed_return_intent_count?: number;
    delayed_paid_continuation_intent_count?: number;
    delayed_memory_annotations?: RawReaderResponseDelayedMemoryAnnotation[];
    reader_score_standard_deviation?: number;
    high_response_count?: number;
    neutral_response_count?: number;
    low_response_count?: number;
    blind_reading?: boolean;
    author_identity_masked?: boolean;
    prior_exposure_screened?: boolean;
    unexcluded_prior_exposure_count?: number;
    spoiler_exposure_screened?: boolean;
    unexcluded_spoiler_exposure_count?: number;
    neutral_question_wording?: boolean;
    response_option_order_randomized?: boolean;
    sample_order_randomized?: boolean;
    manuscript_order_counterbalanced?: boolean;
    max_samples_per_respondent?: number;
    order_balance_ratio?: number;
    question_wording_disclosed?: boolean;
    recruitment_method_disclosed?: boolean;
    recruitment_channel_counts?: Record<string, number>;
    population_definition_disclosed?: boolean;
    sampling_frame_disclosed?: boolean;
    fieldwork_dates_disclosed?: boolean;
    survey_mode_disclosed?: boolean;
    incentive_disclosed?: boolean;
    attention_check_pass_count?: number;
    excluded_response_count?: number;
    comparative_reference_label?: string;
    comparative_preference_win_rate?: number;
    comparative_preference_current_count?: number;
    comparative_preference_reference_count?: number;
    comparative_preference_tie_count?: number;
    comparative_preference_respondent_count?: number;
    comparative_blind_pairwise?: boolean;
    comparative_same_reader_cohort?: boolean;
    comparative_question_wording_disclosed?: boolean;
    revision_pair_id?: string;
    revision_baseline_reader_score?: number;
    revision_current_reader_score?: number;
    revision_preference_revised_count?: number;
    revision_preference_baseline_count?: number;
    revision_preference_tie_count?: number;
    revision_preference_respondent_count?: number;
    revision_blind_comparison?: boolean;
    revision_same_reader_cohort?: boolean;
    revision_question_wording_disclosed?: boolean;
    revision_guardrail_regression_count?: number;
  };
}

interface RawReaderResponseFrictionAnnotation {
  location?: string;
  quote?: string;
  dimension?: string;
  reason?: string;
  severity?: string;
  rewrite_suggestion?: string;
  reader_count?: number;
  reader_segment?: string;
}

interface RawReaderResponseDropOffAnnotation {
  location?: string;
  event_type?: string;
  last_completed_location?: string;
  trigger_quote?: string;
  reason?: string;
  reader_count?: number;
  reader_segment?: string;
  suggested_revision?: string;
}

interface RawReaderResponseSceneRecallAnnotation {
  location?: string;
  remembered_moment?: string;
  distinctive_detail?: string;
  reader_count?: number;
  reader_segment?: string;
}

interface RawReaderResponseTensionTraceAnnotation {
  location?: string;
  experienced_tension?: string;
  suspense_level?: number;
  curiosity_level?: number;
  surprise_level?: number;
  narrative_question?: string;
  stake_or_risk?: string;
  reader_count?: number;
  reader_segment?: string;
  reason?: string;
}

interface RawReaderResponseNarrativeForecastAnnotation {
  location?: string;
  initial_prediction?: string;
  revised_prediction?: string;
  actual_outcome?: string;
  prediction_mismatch?: boolean;
  prediction_shift?: string;
  surprise_or_tension_reason?: string;
  reader_count?: number;
  reader_segment?: string;
}

interface RawReaderResponseLineQuoteAnnotation {
  location?: string;
  quoted_line?: string;
  appeal_reason?: string;
  share_reason?: string;
  line_function?: string;
  reader_count?: number;
  reader_segment?: string;
}

interface RawReaderResponsePayoffFairnessAnnotation {
  location?: string;
  payoff_moment?: string;
  remembered_setup?: string;
  trigger_or_reveal?: string;
  changed_interpretation?: string;
  earned_reason?: string;
  arbitrary_or_cheat_reason?: string;
  emotional_payoff_reason?: string;
  reader_count?: number;
  reader_segment?: string;
}

interface RawReaderResponseAdvocacyAnnotation {
  location?: string;
  share_trigger?: string;
  recommended_audience?: string;
  discussion_prompt?: string;
  reader_count?: number;
  reader_segment?: string;
}

interface RawReaderResponseDurableEngagementAnnotation {
  location?: string;
  commitment_trigger?: string;
  intended_action?: string;
  reader_count?: number;
  reader_segment?: string;
  reason?: string;
}

interface RawReaderResponseResonanceAnnotation {
  location?: string;
  lingering_emotion?: string;
  reflective_question?: string;
  remembered_image?: string;
  personal_meaning?: string;
  reader_count?: number;
  reader_segment?: string;
}

interface RawReaderResponseDelayedMemoryAnnotation {
  location?: string;
  delayed_remembered_moment?: string;
  delayed_character_or_relationship?: string;
  delayed_next_question?: string;
  return_or_purchase_reason?: string;
  reader_count?: number;
  reader_segment?: string;
}

interface QualityTrendData {
  snapshots?: QualityTrendSnapshot[];
}

interface QualityTrendSnapshot {
  chapter_number?: number;
  chapterNumber?: number;
  version?: number;
  superseded?: boolean;
  overall_score?: number;
  overallScore?: number;
  verdict?: string;
  dimensions?: Record<string, number>;
  issues?: Array<{ code?: string }>;
}

export async function calibrateReaderResponseFromProject(
  args: CalibrateReaderResponseProjectArgs
): Promise<CalibrateReaderResponseCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const inputDir = path.resolve(args.inputDir ?? path.join(projectDir, 'reviews', 'reader-response'));
  const outputPath = path.resolve(args.outputPath ?? path.join(projectDir, 'reviews', 'reader-response-calibration.json'));
  const project = await readOptionalJson(path.join(projectDir, 'meta', 'project.json'));
  const projectId = args.projectId ?? project?.project_id ?? project?.id ?? path.basename(projectDir);
  const trend = await readOptionalJson(path.join(projectDir, 'meta', 'quality-trend.json')) as QualityTrendData | undefined;
  const readerInput = await readReaderResponseSamples(inputDir);
  const samples = readerInput.samples.map(sample => normalizeSample(sample, trend));
  const requiredGenres = uniqueStrings([
    ...readerInput.requiredGenres,
    ...(args.requiredGenres ?? []),
  ]);
  const requiredTargetReaderSegments = uniqueStrings([
    ...readerInput.requiredTargetReaderSegments,
    ...(args.requiredTargetReaderSegments ?? []),
  ]);
  const requiredRecruitmentChannels = uniqueStrings([
    ...readerInput.requiredRecruitmentChannels,
    ...(args.requiredRecruitmentChannels ?? []),
  ]);
  const minimumRespondentsPerRequiredTargetSegment = maxPositiveInteger(
    readerInput.minimumRespondentsPerRequiredTargetSegment,
    args.minimumRespondentsPerRequiredTargetSegment
  );
  const requireTargetReaderSegmentQuotasForTuning =
    args.requireTargetReaderSegmentQuotasForTuning ??
    readerInput.requireTargetReaderSegmentQuotasForTuning;
  const minimumRespondentsPerRequiredRecruitmentChannel = maxPositiveInteger(
    readerInput.minimumRespondentsPerRequiredRecruitmentChannel,
    args.minimumRespondentsPerRequiredRecruitmentChannel
  );
  const maximumDominantRecruitmentChannelRatio = minUnitRatio(
    readerInput.maximumDominantRecruitmentChannelRatio,
    args.maximumDominantRecruitmentChannelRatio
  );
  const requireRecruitmentChannelDiversityForTuning =
    args.requireRecruitmentChannelDiversityForTuning ??
    readerInput.requireRecruitmentChannelDiversityForTuning;
  const maximumSamplesPerRespondent = minPositiveInteger(
    readerInput.maximumSamplesPerRespondent,
    args.maximumSamplesPerRespondent
  );
  const minimumOrderBalanceRatio = maxUnitRatio(
    readerInput.minimumOrderBalanceRatio,
    args.minimumOrderBalanceRatio
  );
  const minimumSamplesPerGenre = maxPositiveInteger(
    readerInput.minimumSamplesPerGenre,
    args.minimumSamplesPerGenre
  );
  const minimumUsableSamplesPerGenre = maxPositiveInteger(
    readerInput.minimumUsableSamplesPerGenre,
    args.minimumUsableSamplesPerGenre
  );
  const requiredSeriesLength = maxPositiveInteger(
    readerInput.requiredSeriesLength,
    args.requiredSeriesLength
  );
  const requiredUsableSeriesLength = maxPositiveInteger(
    readerInput.requiredUsableSeriesLength,
    args.requiredUsableSeriesLength
  );
  const minimumHumanRespondentRatio = maxUnitRatio(
    readerInput.minimumHumanRespondentRatio,
    args.minimumHumanRespondentRatio
  );
  const requireHumanReaderEvidenceForTuning =
    args.requireHumanReaderEvidenceForTuning ??
    readerInput.requireHumanReaderEvidenceForTuning;
  const minimumMedianReadTimeSeconds = maxNonNegativeNumber(
    readerInput.minimumMedianReadTimeSeconds,
    args.minimumMedianReadTimeSeconds
  );
  const maximumMedianReadingWordsPerMinute = minPositiveNumber(
    readerInput.maximumMedianReadingWordsPerMinute,
    args.maximumMedianReadingWordsPerMinute
  );
  const maximumMinimumReadingWordsPerMinute = minPositiveNumber(
    readerInput.maximumMinimumReadingWordsPerMinute,
    args.maximumMinimumReadingWordsPerMinute
  );
  const maximumMedianReadingCharactersPerMinute = minPositiveNumber(
    readerInput.maximumMedianReadingCharactersPerMinute,
    args.maximumMedianReadingCharactersPerMinute
  );
  const maximumMinimumReadingCharactersPerMinute = minPositiveNumber(
    readerInput.maximumMinimumReadingCharactersPerMinute,
    args.maximumMinimumReadingCharactersPerMinute
  );
  const requireLengthNormalizedReadTimeForTuning =
    args.requireLengthNormalizedReadTimeForTuning ??
    readerInput.requireLengthNormalizedReadTimeForTuning;
  const maximumSpeedingResponseRatio = minUnitRatio(
    readerInput.maximumSpeedingResponseRatio,
    args.maximumSpeedingResponseRatio
  );
  const maximumStraightLiningResponseRatio = minUnitRatio(
    readerInput.maximumStraightLiningResponseRatio,
    args.maximumStraightLiningResponseRatio
  );
  const maximumDuplicateResponseRatio = minUnitRatio(
    readerInput.maximumDuplicateResponseRatio,
    args.maximumDuplicateResponseRatio
  );
  const maximumBotSuspectedResponseRatio = minUnitRatio(
    readerInput.maximumBotSuspectedResponseRatio,
    args.maximumBotSuspectedResponseRatio
  );
  const maximumLowQualityOpenEndedRatio = minUnitRatio(
    readerInput.maximumLowQualityOpenEndedRatio,
    args.maximumLowQualityOpenEndedRatio
  );
  const maximumInconsistentResponseRatio = minUnitRatio(
    readerInput.maximumInconsistentResponseRatio,
    args.maximumInconsistentResponseRatio
  );
  const maximumQualityFlaggedResponseRatio = minUnitRatio(
    readerInput.maximumQualityFlaggedResponseRatio,
    args.maximumQualityFlaggedResponseRatio
  );
  const requireResponseDataQualityForTuning =
    args.requireResponseDataQualityForTuning ??
    readerInput.requireResponseDataQualityForTuning;
  const minimumHoldoutSampleCount = maxPositiveInteger(
    readerInput.minimumHoldoutSampleCount,
    args.minimumHoldoutSampleCount
  );
  const minimumUsableHoldoutSampleCount = maxPositiveInteger(
    readerInput.minimumUsableHoldoutSampleCount,
    args.minimumUsableHoldoutSampleCount
  );
  const minimumStartedReadCount = maxPositiveInteger(
    readerInput.minimumStartedReadCount,
    args.minimumStartedReadCount
  );
  const minimumPanelCompletionRate = maxUnitRatio(
    readerInput.minimumPanelCompletionRate,
    args.minimumPanelCompletionRate
  );
  const maximumDropOffRatio = minUnitRatio(
    readerInput.maximumDropOffRatio,
    args.maximumDropOffRatio
  );
  const maximumSkimmedReadRatio = minUnitRatio(
    readerInput.maximumSkimmedReadRatio,
    args.maximumSkimmedReadRatio
  );
  const requireRetentionEvidenceForTuning =
    args.requireRetentionEvidenceForTuning ??
    readerInput.requireRetentionEvidenceForTuning;
  const minimumDropOffAnnotationCount = maxPositiveInteger(
    readerInput.minimumDropOffAnnotationCount,
    args.minimumDropOffAnnotationCount
  );
  const minimumActionableDropOffAnnotationCount = maxPositiveInteger(
    readerInput.minimumActionableDropOffAnnotationCount,
    args.minimumActionableDropOffAnnotationCount
  );
  const requireDropOffLocalizationEvidenceForTuning =
    args.requireDropOffLocalizationEvidenceForTuning ??
    readerInput.requireDropOffLocalizationEvidenceForTuning;
  const minimumAnnotationCoderCount = maxPositiveInteger(
    readerInput.minimumAnnotationCoderCount,
    args.minimumAnnotationCoderCount
  );
  const minimumAnnotationDoubleCodedCount = maxPositiveInteger(
    readerInput.minimumAnnotationDoubleCodedCount,
    args.minimumAnnotationDoubleCodedCount
  );
  const minimumAnnotationAgreementRate = maxUnitRatio(
    readerInput.minimumAnnotationAgreementRate,
    args.minimumAnnotationAgreementRate
  );
  const requireAnnotationReliabilityForTuning =
    args.requireAnnotationReliabilityForTuning ??
    readerInput.requireAnnotationReliabilityForTuning;
  const minimumUnpromptedSceneRecallRatio = maxUnitRatio(
    readerInput.minimumUnpromptedSceneRecallRatio,
    args.minimumUnpromptedSceneRecallRatio
  );
  const minimumDistinctiveSceneRecallRatio = maxUnitRatio(
    readerInput.minimumDistinctiveSceneRecallRatio,
    args.minimumDistinctiveSceneRecallRatio
  );
  const minimumSceneRecallAnnotationCount = maxPositiveInteger(
    readerInput.minimumSceneRecallAnnotationCount,
    args.minimumSceneRecallAnnotationCount
  );
  const requireSceneRecallEvidenceForTuning =
    args.requireSceneRecallEvidenceForTuning ??
    readerInput.requireSceneRecallEvidenceForTuning;
  const minimumTensionTraceRatio = maxUnitRatio(
    readerInput.minimumTensionTraceRatio,
    args.minimumTensionTraceRatio
  );
  const minimumTensionPeakRatio = maxUnitRatio(
    readerInput.minimumTensionPeakRatio,
    args.minimumTensionPeakRatio
  );
  const minimumTensionQuestionRatio = maxUnitRatio(
    readerInput.minimumTensionQuestionRatio,
    args.minimumTensionQuestionRatio
  );
  const minimumTensionTraceAnnotationCount = maxPositiveInteger(
    readerInput.minimumTensionTraceAnnotationCount,
    args.minimumTensionTraceAnnotationCount
  );
  const requireTensionTraceEvidenceForTuning =
    args.requireTensionTraceEvidenceForTuning ??
    readerInput.requireTensionTraceEvidenceForTuning;
  const minimumForecastPredictionRatio = maxUnitRatio(
    readerInput.minimumForecastPredictionRatio,
    args.minimumForecastPredictionRatio
  );
  const minimumForecastDiversityCount = maxPositiveInteger(
    readerInput.minimumForecastDiversityCount,
    args.minimumForecastDiversityCount
  );
  const minimumForecastRevisionRatio = maxUnitRatio(
    readerInput.minimumForecastRevisionRatio,
    args.minimumForecastRevisionRatio
  );
  const minimumForecastMismatchRatio = maxUnitRatio(
    readerInput.minimumForecastMismatchRatio,
    args.minimumForecastMismatchRatio
  );
  const minimumNarrativeForecastAnnotationCount = maxPositiveInteger(
    readerInput.minimumNarrativeForecastAnnotationCount,
    args.minimumNarrativeForecastAnnotationCount
  );
  const requireNarrativeForecastEvidenceForTuning =
    args.requireNarrativeForecastEvidenceForTuning ??
    readerInput.requireNarrativeForecastEvidenceForTuning;
  const minimumQuoteRecallRatio = maxUnitRatio(
    readerInput.minimumQuoteRecallRatio,
    args.minimumQuoteRecallRatio
  );
  const minimumFavoriteLineRatio = maxUnitRatio(
    readerInput.minimumFavoriteLineRatio,
    args.minimumFavoriteLineRatio
  );
  const minimumShareableLineRatio = maxUnitRatio(
    readerInput.minimumShareableLineRatio,
    args.minimumShareableLineRatio
  );
  const minimumLineQuoteAnnotationCount = maxPositiveInteger(
    readerInput.minimumLineQuoteAnnotationCount,
    args.minimumLineQuoteAnnotationCount
  );
  const requireLineQuoteEvidenceForTuning =
    args.requireLineQuoteEvidenceForTuning ??
    readerInput.requireLineQuoteEvidenceForTuning;
  const minimumPayoffSetupRecallRatio = maxUnitRatio(
    readerInput.minimumPayoffSetupRecallRatio,
    args.minimumPayoffSetupRecallRatio
  );
  const minimumPayoffTriggerRecognitionRatio = maxUnitRatio(
    readerInput.minimumPayoffTriggerRecognitionRatio,
    args.minimumPayoffTriggerRecognitionRatio
  );
  const minimumPayoffEarnedRatio = maxUnitRatio(
    readerInput.minimumPayoffEarnedRatio,
    args.minimumPayoffEarnedRatio
  );
  const minimumPayoffRecontextualizationRatio = maxUnitRatio(
    readerInput.minimumPayoffRecontextualizationRatio,
    args.minimumPayoffRecontextualizationRatio
  );
  const minimumPayoffEmotionalSatisfactionRatio = maxUnitRatio(
    readerInput.minimumPayoffEmotionalSatisfactionRatio,
    args.minimumPayoffEmotionalSatisfactionRatio
  );
  const minimumPayoffFairnessAnnotationCount = maxPositiveInteger(
    readerInput.minimumPayoffFairnessAnnotationCount,
    args.minimumPayoffFairnessAnnotationCount
  );
  const requirePayoffFairnessEvidenceForTuning =
    args.requirePayoffFairnessEvidenceForTuning ??
    readerInput.requirePayoffFairnessEvidenceForTuning;
  const minimumOrganicRecommendationRatio = maxUnitRatio(
    readerInput.minimumOrganicRecommendationRatio,
    args.minimumOrganicRecommendationRatio
  );
  const minimumDiscussionPromptRatio = maxUnitRatio(
    readerInput.minimumDiscussionPromptRatio,
    args.minimumDiscussionPromptRatio
  );
  const minimumAdvocacyAnnotationCount = maxPositiveInteger(
    readerInput.minimumAdvocacyAnnotationCount,
    args.minimumAdvocacyAnnotationCount
  );
  const requireAdvocacyEvidenceForTuning =
    args.requireAdvocacyEvidenceForTuning ??
    readerInput.requireAdvocacyEvidenceForTuning;
  const minimumBookmarkRatio = maxUnitRatio(
    readerInput.minimumBookmarkRatio,
    args.minimumBookmarkRatio
  );
  const minimumReturnIntentRatio = maxUnitRatio(
    readerInput.minimumReturnIntentRatio,
    args.minimumReturnIntentRatio
  );
  const minimumPaidContinuationIntentRatio = maxUnitRatio(
    readerInput.minimumPaidContinuationIntentRatio,
    args.minimumPaidContinuationIntentRatio
  );
  const minimumDurableEngagementAnnotationCount = maxPositiveInteger(
    readerInput.minimumDurableEngagementAnnotationCount,
    args.minimumDurableEngagementAnnotationCount
  );
  const requireDurableEngagementEvidenceForTuning =
    args.requireDurableEngagementEvidenceForTuning ??
    readerInput.requireDurableEngagementEvidenceForTuning;
  const minimumContinuationBehaviorImpressionCount = maxPositiveInteger(
    readerInput.minimumContinuationBehaviorImpressionCount,
    args.minimumContinuationBehaviorImpressionCount
  );
  const minimumNextChapterClickThroughRatio = maxUnitRatio(
    readerInput.minimumNextChapterClickThroughRatio,
    args.minimumNextChapterClickThroughRatio
  );
  const minimumNextChapterOpenRatio = maxUnitRatio(
    readerInput.minimumNextChapterOpenRatio,
    args.minimumNextChapterOpenRatio
  );
  const minimumNextChapterReadStartRatio = maxUnitRatio(
    readerInput.minimumNextChapterReadStartRatio,
    args.minimumNextChapterReadStartRatio
  );
  const requireContinuationBehaviorEvidenceForTuning =
    args.requireContinuationBehaviorEvidenceForTuning ??
    readerInput.requireContinuationBehaviorEvidenceForTuning;
  const minimumLingeringEmotionRatio = maxUnitRatio(
    readerInput.minimumLingeringEmotionRatio,
    args.minimumLingeringEmotionRatio
  );
  const minimumReflectiveMeaningRatio = maxUnitRatio(
    readerInput.minimumReflectiveMeaningRatio,
    args.minimumReflectiveMeaningRatio
  );
  const minimumResonanceAnnotationCount = maxPositiveInteger(
    readerInput.minimumResonanceAnnotationCount,
    args.minimumResonanceAnnotationCount
  );
  const requireResonanceEvidenceForTuning =
    args.requireResonanceEvidenceForTuning ??
    readerInput.requireResonanceEvidenceForTuning;
  const minimumDelayedFollowUpRespondentRatio = maxUnitRatio(
    readerInput.minimumDelayedFollowUpRespondentRatio,
    args.minimumDelayedFollowUpRespondentRatio
  );
  const minimumDelayedFollowUpHours = maxNonNegativeNumber(
    readerInput.minimumDelayedFollowUpHours,
    args.minimumDelayedFollowUpHours
  );
  const minimumDelayedSceneRecallRatio = maxUnitRatio(
    readerInput.minimumDelayedSceneRecallRatio,
    args.minimumDelayedSceneRecallRatio
  );
  const minimumDelayedCharacterRecallRatio = maxUnitRatio(
    readerInput.minimumDelayedCharacterRecallRatio,
    args.minimumDelayedCharacterRecallRatio
  );
  const minimumDelayedContinuationIntentRatio = maxUnitRatio(
    readerInput.minimumDelayedContinuationIntentRatio,
    args.minimumDelayedContinuationIntentRatio
  );
  const minimumDelayedMemoryAnnotationCount = maxPositiveInteger(
    readerInput.minimumDelayedMemoryAnnotationCount,
    args.minimumDelayedMemoryAnnotationCount
  );
  const requireDelayedMemoryEvidenceForTuning =
    args.requireDelayedMemoryEvidenceForTuning ??
    readerInput.requireDelayedMemoryEvidenceForTuning;
  const minimumComparativePreferenceWinRate = maxUnitRatio(
    readerInput.minimumComparativePreferenceWinRate,
    args.minimumComparativePreferenceWinRate
  );
  const minimumComparativePreferenceRespondentCount = maxPositiveInteger(
    readerInput.minimumComparativePreferenceRespondentCount,
    args.minimumComparativePreferenceRespondentCount
  );
  const requireComparativePreferenceForTuning =
    args.requireComparativePreferenceForTuning ??
    readerInput.requireComparativePreferenceForTuning;
  const minimumRevisionLift = maxNonNegativeNumber(
    readerInput.minimumRevisionLift,
    args.minimumRevisionLift
  );
  const minimumRevisionPreferenceWinRate = maxUnitRatio(
    readerInput.minimumRevisionPreferenceWinRate,
    args.minimumRevisionPreferenceWinRate
  );
  const minimumRevisionPreferenceRespondentCount = maxPositiveInteger(
    readerInput.minimumRevisionPreferenceRespondentCount,
    args.minimumRevisionPreferenceRespondentCount
  );
  const requireRevisionOutcomeEvidenceForTuning =
    args.requireRevisionOutcomeEvidenceForTuning ??
    readerInput.requireRevisionOutcomeEvidenceForTuning;
  const requiredChapterRanges = [
    ...readerInput.requiredChapterRanges,
    ...(args.requiredChapterRanges ?? []),
  ];
  const options: ReaderResponseCalibrationOptions = {
    minimumRespondentCount: args.minimumRespondentCount,
    minimumSampleCountForTuning: args.minimumSampleCountForTuning,
    requiredGenres,
    requiredTargetReaderSegments,
    minimumRespondentsPerRequiredTargetSegment,
    requireTargetReaderSegmentQuotasForTuning,
    requiredRecruitmentChannels,
    minimumRespondentsPerRequiredRecruitmentChannel,
    maximumDominantRecruitmentChannelRatio,
    requireRecruitmentChannelDiversityForTuning,
    maximumSamplesPerRespondent,
    minimumOrderBalanceRatio,
    minimumSamplesPerGenre,
    minimumUsableSamplesPerGenre,
    minimumSeriesLength: requiredSeriesLength,
    minimumUsableSeriesLength: requiredUsableSeriesLength,
    minimumHumanRespondentRatio,
    requireHumanReaderEvidenceForTuning,
    minimumMedianReadTimeSeconds,
    maximumMedianReadingWordsPerMinute,
    maximumMinimumReadingWordsPerMinute,
    maximumMedianReadingCharactersPerMinute,
    maximumMinimumReadingCharactersPerMinute,
    requireLengthNormalizedReadTimeForTuning,
    maximumSpeedingResponseRatio,
    maximumStraightLiningResponseRatio,
    maximumDuplicateResponseRatio,
    maximumBotSuspectedResponseRatio,
    maximumLowQualityOpenEndedRatio,
    maximumInconsistentResponseRatio,
    maximumQualityFlaggedResponseRatio,
    requireResponseDataQualityForTuning,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumStartedReadCount,
    minimumPanelCompletionRate,
    maximumDropOffRatio,
    maximumSkimmedReadRatio,
    requireRetentionEvidenceForTuning,
    minimumDropOffAnnotationCount,
    minimumActionableDropOffAnnotationCount,
    requireDropOffLocalizationEvidenceForTuning,
    minimumAnnotationCoderCount,
    minimumAnnotationDoubleCodedCount,
    minimumAnnotationAgreementRate,
    requireAnnotationReliabilityForTuning,
    minimumUnpromptedSceneRecallRatio,
    minimumDistinctiveSceneRecallRatio,
    minimumSceneRecallAnnotationCount,
    requireSceneRecallEvidenceForTuning,
    minimumTensionTraceRatio,
    minimumTensionPeakRatio,
    minimumTensionQuestionRatio,
    minimumTensionTraceAnnotationCount,
    requireTensionTraceEvidenceForTuning,
    minimumForecastPredictionRatio,
    minimumForecastDiversityCount,
    minimumForecastRevisionRatio,
    minimumForecastMismatchRatio,
    minimumNarrativeForecastAnnotationCount,
    requireNarrativeForecastEvidenceForTuning,
    minimumQuoteRecallRatio,
    minimumFavoriteLineRatio,
    minimumShareableLineRatio,
    minimumLineQuoteAnnotationCount,
    requireLineQuoteEvidenceForTuning,
    minimumPayoffSetupRecallRatio,
    minimumPayoffTriggerRecognitionRatio,
    minimumPayoffEarnedRatio,
    minimumPayoffRecontextualizationRatio,
    minimumPayoffEmotionalSatisfactionRatio,
    minimumPayoffFairnessAnnotationCount,
    requirePayoffFairnessEvidenceForTuning,
    minimumOrganicRecommendationRatio,
    minimumDiscussionPromptRatio,
    minimumAdvocacyAnnotationCount,
    requireAdvocacyEvidenceForTuning,
    minimumBookmarkRatio,
    minimumReturnIntentRatio,
    minimumPaidContinuationIntentRatio,
    minimumDurableEngagementAnnotationCount,
    requireDurableEngagementEvidenceForTuning,
    minimumContinuationBehaviorImpressionCount,
    minimumNextChapterClickThroughRatio,
    minimumNextChapterOpenRatio,
    minimumNextChapterReadStartRatio,
    requireContinuationBehaviorEvidenceForTuning,
    minimumLingeringEmotionRatio,
    minimumReflectiveMeaningRatio,
    minimumResonanceAnnotationCount,
    requireResonanceEvidenceForTuning,
    minimumDelayedFollowUpRespondentRatio,
    minimumDelayedFollowUpHours,
    minimumDelayedSceneRecallRatio,
    minimumDelayedCharacterRecallRatio,
    minimumDelayedContinuationIntentRatio,
    minimumDelayedMemoryAnnotationCount,
    requireDelayedMemoryEvidenceForTuning,
    minimumComparativePreferenceWinRate,
    minimumComparativePreferenceRespondentCount,
    requireComparativePreferenceForTuning,
    minimumRevisionLift,
    minimumRevisionPreferenceWinRate,
    minimumRevisionPreferenceRespondentCount,
    requireRevisionOutcomeEvidenceForTuning,
    requiredChapterRanges,
  };
  const calibration = evaluateReaderResponseCalibration(samples, options);
  const sourceEvidence = await buildSourceEvidenceManifest(projectDir, [
    inputDir,
    path.join(projectDir, 'meta', 'quality-trend.json'),
  ]);

  const result: CalibrateReaderResponseCliResult = {
    projectId,
    projectDir,
    inputDir,
    outputPath,
    samplesLoaded: samples.length,
    requiredGenres,
    requiredTargetReaderSegments,
    minimumRespondentsPerRequiredTargetSegment,
    requireTargetReaderSegmentQuotasForTuning,
    requiredRecruitmentChannels,
    minimumRespondentsPerRequiredRecruitmentChannel,
    maximumDominantRecruitmentChannelRatio,
    requireRecruitmentChannelDiversityForTuning,
    maximumSamplesPerRespondent,
    minimumOrderBalanceRatio,
    minimumSamplesPerGenre,
    minimumUsableSamplesPerGenre,
    requiredSeriesLength,
    requiredUsableSeriesLength,
    minimumHumanRespondentRatio,
    requireHumanReaderEvidenceForTuning,
    minimumMedianReadTimeSeconds,
    maximumSpeedingResponseRatio,
    maximumStraightLiningResponseRatio,
    maximumDuplicateResponseRatio,
    maximumBotSuspectedResponseRatio,
    maximumLowQualityOpenEndedRatio,
    maximumInconsistentResponseRatio,
    maximumQualityFlaggedResponseRatio,
    requireResponseDataQualityForTuning,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumStartedReadCount,
    minimumPanelCompletionRate,
    maximumDropOffRatio,
    maximumSkimmedReadRatio,
    requireRetentionEvidenceForTuning,
    minimumDropOffAnnotationCount,
    minimumActionableDropOffAnnotationCount,
    requireDropOffLocalizationEvidenceForTuning,
    minimumAnnotationCoderCount,
    minimumAnnotationDoubleCodedCount,
    minimumAnnotationAgreementRate,
    requireAnnotationReliabilityForTuning,
    minimumUnpromptedSceneRecallRatio,
    minimumDistinctiveSceneRecallRatio,
    minimumSceneRecallAnnotationCount,
    requireSceneRecallEvidenceForTuning,
    minimumTensionTraceRatio,
    minimumTensionPeakRatio,
    minimumTensionQuestionRatio,
    minimumTensionTraceAnnotationCount,
    requireTensionTraceEvidenceForTuning,
    minimumForecastPredictionRatio,
    minimumForecastDiversityCount,
    minimumForecastRevisionRatio,
    minimumForecastMismatchRatio,
    minimumNarrativeForecastAnnotationCount,
    requireNarrativeForecastEvidenceForTuning,
    minimumQuoteRecallRatio,
    minimumFavoriteLineRatio,
    minimumShareableLineRatio,
    minimumLineQuoteAnnotationCount,
    requireLineQuoteEvidenceForTuning,
    minimumPayoffSetupRecallRatio,
    minimumPayoffTriggerRecognitionRatio,
    minimumPayoffEarnedRatio,
    minimumPayoffRecontextualizationRatio,
    minimumPayoffEmotionalSatisfactionRatio,
    minimumPayoffFairnessAnnotationCount,
    requirePayoffFairnessEvidenceForTuning,
    minimumOrganicRecommendationRatio,
    minimumDiscussionPromptRatio,
    minimumAdvocacyAnnotationCount,
    requireAdvocacyEvidenceForTuning,
    minimumBookmarkRatio,
    minimumReturnIntentRatio,
    minimumPaidContinuationIntentRatio,
    minimumDurableEngagementAnnotationCount,
    requireDurableEngagementEvidenceForTuning,
    minimumContinuationBehaviorImpressionCount,
    minimumNextChapterClickThroughRatio,
    minimumNextChapterOpenRatio,
    minimumNextChapterReadStartRatio,
    requireContinuationBehaviorEvidenceForTuning,
    minimumLingeringEmotionRatio,
    minimumReflectiveMeaningRatio,
    minimumResonanceAnnotationCount,
    requireResonanceEvidenceForTuning,
    minimumDelayedFollowUpRespondentRatio,
    minimumDelayedFollowUpHours,
    minimumDelayedSceneRecallRatio,
    minimumDelayedCharacterRecallRatio,
    minimumDelayedContinuationIntentRatio,
    minimumDelayedMemoryAnnotationCount,
    requireDelayedMemoryEvidenceForTuning,
    minimumComparativePreferenceWinRate,
    minimumComparativePreferenceRespondentCount,
    requireComparativePreferenceForTuning,
    minimumRevisionLift,
    minimumRevisionPreferenceWinRate,
    minimumRevisionPreferenceRespondentCount,
    requireRevisionOutcomeEvidenceForTuning,
    requiredChapterRanges,
    sourceEvidence,
    calibration,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return result;
}

async function readReaderResponseSamples(inputDir: string): Promise<ReaderResponseInput> {
  const files = await readJsonFiles(inputDir);
  if (files.length === 0) {
    throw new Error(`No reader response JSON files found in ${inputDir}`);
  }

  const input: ReaderResponseInput = {
    samples: [],
    requiredGenres: [],
    requiredTargetReaderSegments: [],
    requiredRecruitmentChannels: [],
    requiredChapterRanges: [],
  };
  for (const filePath of files) {
    const parsed = await readJson(filePath) as RawReaderResponseFile | RawReaderResponseSample;
    if (Array.isArray((parsed as RawReaderResponseFile).samples)) {
      const file = parsed as RawReaderResponseFile;
      input.samples.push(...(file.samples ?? []));
      input.requiredGenres.push(...(file.required_genres ?? []));
      input.requiredTargetReaderSegments.push(...(file.required_target_reader_segments ?? []));
      input.requiredRecruitmentChannels.push(...(file.required_recruitment_channels ?? []));
      input.minimumRespondentsPerRequiredTargetSegment = maxPositiveInteger(
        input.minimumRespondentsPerRequiredTargetSegment,
        file.minimum_respondents_per_required_target_segment
      );
      input.requireTargetReaderSegmentQuotasForTuning =
        file.require_target_reader_segment_quotas ??
        input.requireTargetReaderSegmentQuotasForTuning;
      input.minimumRespondentsPerRequiredRecruitmentChannel = maxPositiveInteger(
        input.minimumRespondentsPerRequiredRecruitmentChannel,
        file.minimum_respondents_per_required_recruitment_channel
      );
      input.maximumDominantRecruitmentChannelRatio = minUnitRatio(
        input.maximumDominantRecruitmentChannelRatio,
        file.maximum_dominant_recruitment_channel_ratio
      );
      input.requireRecruitmentChannelDiversityForTuning =
        file.require_recruitment_channel_diversity ??
        input.requireRecruitmentChannelDiversityForTuning;
      input.maximumSamplesPerRespondent = minPositiveInteger(
        input.maximumSamplesPerRespondent,
        file.maximum_samples_per_respondent
      );
      input.minimumOrderBalanceRatio = maxUnitRatio(
        input.minimumOrderBalanceRatio,
        file.minimum_order_balance_ratio
      );
      input.minimumSamplesPerGenre = maxPositiveInteger(
        input.minimumSamplesPerGenre,
        file.minimum_samples_per_genre
      );
      input.minimumUsableSamplesPerGenre = maxPositiveInteger(
        input.minimumUsableSamplesPerGenre,
        file.minimum_usable_samples_per_genre
      );
      input.requiredSeriesLength = maxPositiveInteger(
        input.requiredSeriesLength,
        file.required_series_length
      );
      input.requiredUsableSeriesLength = maxPositiveInteger(
        input.requiredUsableSeriesLength,
        file.required_usable_series_length
      );
      input.minimumHumanRespondentRatio = maxUnitRatio(
        input.minimumHumanRespondentRatio,
        file.minimum_human_respondent_ratio
      );
      input.requireHumanReaderEvidenceForTuning =
        file.require_human_reader_evidence ??
        input.requireHumanReaderEvidenceForTuning;
      input.minimumMedianReadTimeSeconds = maxNonNegativeNumber(
        input.minimumMedianReadTimeSeconds,
        file.minimum_median_read_time_seconds
      );
      input.maximumMedianReadingWordsPerMinute = minPositiveNumber(
        input.maximumMedianReadingWordsPerMinute,
        file.maximum_median_reading_words_per_minute
      );
      input.maximumMinimumReadingWordsPerMinute = minPositiveNumber(
        input.maximumMinimumReadingWordsPerMinute,
        file.maximum_minimum_reading_words_per_minute
      );
      input.maximumMedianReadingCharactersPerMinute = minPositiveNumber(
        input.maximumMedianReadingCharactersPerMinute,
        file.maximum_median_reading_characters_per_minute
      );
      input.maximumMinimumReadingCharactersPerMinute = minPositiveNumber(
        input.maximumMinimumReadingCharactersPerMinute,
        file.maximum_minimum_reading_characters_per_minute
      );
      input.requireLengthNormalizedReadTimeForTuning =
        file.require_length_normalized_read_time ??
        input.requireLengthNormalizedReadTimeForTuning;
      input.maximumSpeedingResponseRatio = minUnitRatio(
        input.maximumSpeedingResponseRatio,
        file.maximum_speeding_response_ratio
      );
      input.maximumStraightLiningResponseRatio = minUnitRatio(
        input.maximumStraightLiningResponseRatio,
        file.maximum_straight_lining_response_ratio
      );
      input.maximumDuplicateResponseRatio = minUnitRatio(
        input.maximumDuplicateResponseRatio,
        file.maximum_duplicate_response_ratio
      );
      input.maximumBotSuspectedResponseRatio = minUnitRatio(
        input.maximumBotSuspectedResponseRatio,
        file.maximum_bot_suspected_response_ratio
      );
      input.maximumLowQualityOpenEndedRatio = minUnitRatio(
        input.maximumLowQualityOpenEndedRatio,
        file.maximum_low_quality_open_ended_ratio
      );
      input.maximumInconsistentResponseRatio = minUnitRatio(
        input.maximumInconsistentResponseRatio,
        file.maximum_inconsistent_response_ratio
      );
      input.maximumQualityFlaggedResponseRatio = minUnitRatio(
        input.maximumQualityFlaggedResponseRatio,
        file.maximum_quality_flagged_response_ratio
      );
      input.requireResponseDataQualityForTuning =
        file.require_response_data_quality ??
        input.requireResponseDataQualityForTuning;
      input.minimumHoldoutSampleCount = maxPositiveInteger(
        input.minimumHoldoutSampleCount,
        file.minimum_holdout_samples
      );
      input.minimumUsableHoldoutSampleCount = maxPositiveInteger(
        input.minimumUsableHoldoutSampleCount,
        file.minimum_usable_holdout_samples
      );
      input.minimumStartedReadCount = maxPositiveInteger(
        input.minimumStartedReadCount,
        file.minimum_started_read_count
      );
      input.minimumPanelCompletionRate = maxUnitRatio(
        input.minimumPanelCompletionRate,
        file.minimum_panel_completion_rate
      );
      input.maximumDropOffRatio = minUnitRatio(
        input.maximumDropOffRatio,
        file.maximum_drop_off_ratio
      );
      input.maximumSkimmedReadRatio = minUnitRatio(
        input.maximumSkimmedReadRatio,
        file.maximum_skimmed_read_ratio
      );
      input.requireRetentionEvidenceForTuning =
        file.require_retention_evidence ??
        input.requireRetentionEvidenceForTuning;
      input.minimumDropOffAnnotationCount = maxPositiveInteger(
        input.minimumDropOffAnnotationCount,
        file.minimum_drop_off_annotations
      );
      input.minimumActionableDropOffAnnotationCount = maxPositiveInteger(
        input.minimumActionableDropOffAnnotationCount,
        file.minimum_actionable_drop_off_annotations
      );
      input.requireDropOffLocalizationEvidenceForTuning =
        file.require_drop_off_localization_evidence ??
        input.requireDropOffLocalizationEvidenceForTuning;
      input.minimumAnnotationCoderCount = maxPositiveInteger(
        input.minimumAnnotationCoderCount,
        file.minimum_annotation_coder_count
      );
      input.minimumAnnotationDoubleCodedCount = maxPositiveInteger(
        input.minimumAnnotationDoubleCodedCount,
        file.minimum_annotation_double_coded_count
      );
      input.minimumAnnotationAgreementRate = maxUnitRatio(
        input.minimumAnnotationAgreementRate,
        file.minimum_annotation_agreement_rate
      );
      input.requireAnnotationReliabilityForTuning =
        file.require_annotation_reliability_evidence ??
        input.requireAnnotationReliabilityForTuning;
      input.minimumUnpromptedSceneRecallRatio = maxUnitRatio(
        input.minimumUnpromptedSceneRecallRatio,
        file.minimum_unprompted_scene_recall_ratio
      );
      input.minimumDistinctiveSceneRecallRatio = maxUnitRatio(
        input.minimumDistinctiveSceneRecallRatio,
        file.minimum_distinctive_scene_recall_ratio
      );
      input.minimumSceneRecallAnnotationCount = maxPositiveInteger(
        input.minimumSceneRecallAnnotationCount,
        file.minimum_scene_recall_annotations
      );
      input.requireSceneRecallEvidenceForTuning =
        file.require_scene_recall_evidence ??
        input.requireSceneRecallEvidenceForTuning;
      input.minimumTensionTraceRatio = maxUnitRatio(
        input.minimumTensionTraceRatio,
        file.minimum_tension_trace_ratio
      );
      input.minimumTensionPeakRatio = maxUnitRatio(
        input.minimumTensionPeakRatio,
        file.minimum_tension_peak_ratio
      );
      input.minimumTensionQuestionRatio = maxUnitRatio(
        input.minimumTensionQuestionRatio,
        file.minimum_tension_question_ratio
      );
      input.minimumTensionTraceAnnotationCount = maxPositiveInteger(
        input.minimumTensionTraceAnnotationCount,
        file.minimum_tension_trace_annotations
      );
      input.requireTensionTraceEvidenceForTuning =
        file.require_tension_trace_evidence ??
        input.requireTensionTraceEvidenceForTuning;
      input.minimumForecastPredictionRatio = maxUnitRatio(
        input.minimumForecastPredictionRatio,
        file.minimum_forecast_prediction_ratio
      );
      input.minimumForecastDiversityCount = maxPositiveInteger(
        input.minimumForecastDiversityCount,
        file.minimum_forecast_diversity_count
      );
      input.minimumForecastRevisionRatio = maxUnitRatio(
        input.minimumForecastRevisionRatio,
        file.minimum_forecast_revision_ratio
      );
      input.minimumForecastMismatchRatio = maxUnitRatio(
        input.minimumForecastMismatchRatio,
        file.minimum_forecast_mismatch_ratio
      );
      input.minimumNarrativeForecastAnnotationCount = maxPositiveInteger(
        input.minimumNarrativeForecastAnnotationCount,
        file.minimum_narrative_forecast_annotations
      );
      input.requireNarrativeForecastEvidenceForTuning =
        file.require_narrative_forecast_evidence ??
        input.requireNarrativeForecastEvidenceForTuning;
      input.minimumQuoteRecallRatio = maxUnitRatio(
        input.minimumQuoteRecallRatio,
        file.minimum_quote_recall_ratio
      );
      input.minimumFavoriteLineRatio = maxUnitRatio(
        input.minimumFavoriteLineRatio,
        file.minimum_favorite_line_ratio
      );
      input.minimumShareableLineRatio = maxUnitRatio(
        input.minimumShareableLineRatio,
        file.minimum_shareable_line_ratio
      );
      input.minimumLineQuoteAnnotationCount = maxPositiveInteger(
        input.minimumLineQuoteAnnotationCount,
        file.minimum_line_quote_annotations
      );
      input.requireLineQuoteEvidenceForTuning =
        file.require_line_quote_evidence ??
        input.requireLineQuoteEvidenceForTuning;
      input.minimumPayoffSetupRecallRatio = maxUnitRatio(
        input.minimumPayoffSetupRecallRatio,
        file.minimum_payoff_setup_recall_ratio
      );
      input.minimumPayoffTriggerRecognitionRatio = maxUnitRatio(
        input.minimumPayoffTriggerRecognitionRatio,
        file.minimum_payoff_trigger_recognition_ratio
      );
      input.minimumPayoffEarnedRatio = maxUnitRatio(
        input.minimumPayoffEarnedRatio,
        file.minimum_payoff_earned_ratio
      );
      input.minimumPayoffRecontextualizationRatio = maxUnitRatio(
        input.minimumPayoffRecontextualizationRatio,
        file.minimum_payoff_recontextualization_ratio
      );
      input.minimumPayoffEmotionalSatisfactionRatio = maxUnitRatio(
        input.minimumPayoffEmotionalSatisfactionRatio,
        file.minimum_payoff_emotional_satisfaction_ratio
      );
      input.minimumPayoffFairnessAnnotationCount = maxPositiveInteger(
        input.minimumPayoffFairnessAnnotationCount,
        file.minimum_payoff_fairness_annotations
      );
      input.requirePayoffFairnessEvidenceForTuning =
        file.require_payoff_fairness_evidence ??
        input.requirePayoffFairnessEvidenceForTuning;
      input.minimumOrganicRecommendationRatio = maxUnitRatio(
        input.minimumOrganicRecommendationRatio,
        file.minimum_organic_recommendation_ratio
      );
      input.minimumDiscussionPromptRatio = maxUnitRatio(
        input.minimumDiscussionPromptRatio,
        file.minimum_discussion_prompt_ratio
      );
      input.minimumAdvocacyAnnotationCount = maxPositiveInteger(
        input.minimumAdvocacyAnnotationCount,
        file.minimum_advocacy_annotations
      );
      input.requireAdvocacyEvidenceForTuning =
        file.require_advocacy_evidence ??
        input.requireAdvocacyEvidenceForTuning;
      input.minimumBookmarkRatio = maxUnitRatio(
        input.minimumBookmarkRatio,
        file.minimum_bookmark_ratio
      );
      input.minimumReturnIntentRatio = maxUnitRatio(
        input.minimumReturnIntentRatio,
        file.minimum_return_intent_ratio
      );
      input.minimumPaidContinuationIntentRatio = maxUnitRatio(
        input.minimumPaidContinuationIntentRatio,
        file.minimum_paid_continuation_intent_ratio
      );
      input.minimumDurableEngagementAnnotationCount = maxPositiveInteger(
        input.minimumDurableEngagementAnnotationCount,
        file.minimum_durable_engagement_annotations
      );
      input.requireDurableEngagementEvidenceForTuning =
        file.require_durable_engagement_evidence ??
        input.requireDurableEngagementEvidenceForTuning;
      input.minimumContinuationBehaviorImpressionCount = maxPositiveInteger(
        input.minimumContinuationBehaviorImpressionCount,
        file.minimum_continuation_behavior_impressions
      );
      input.minimumNextChapterClickThroughRatio = maxUnitRatio(
        input.minimumNextChapterClickThroughRatio,
        file.minimum_next_chapter_click_through_ratio
      );
      input.minimumNextChapterOpenRatio = maxUnitRatio(
        input.minimumNextChapterOpenRatio,
        file.minimum_next_chapter_open_ratio
      );
      input.minimumNextChapterReadStartRatio = maxUnitRatio(
        input.minimumNextChapterReadStartRatio,
        file.minimum_next_chapter_read_start_ratio
      );
      input.requireContinuationBehaviorEvidenceForTuning =
        file.require_continuation_behavior_evidence ??
        input.requireContinuationBehaviorEvidenceForTuning;
      input.minimumLingeringEmotionRatio = maxUnitRatio(
        input.minimumLingeringEmotionRatio,
        file.minimum_lingering_emotion_ratio
      );
      input.minimumReflectiveMeaningRatio = maxUnitRatio(
        input.minimumReflectiveMeaningRatio,
        file.minimum_reflective_meaning_ratio
      );
      input.minimumResonanceAnnotationCount = maxPositiveInteger(
        input.minimumResonanceAnnotationCount,
        file.minimum_resonance_annotations
      );
      input.requireResonanceEvidenceForTuning =
        file.require_resonance_evidence ??
        input.requireResonanceEvidenceForTuning;
      input.minimumDelayedFollowUpRespondentRatio = maxUnitRatio(
        input.minimumDelayedFollowUpRespondentRatio,
        file.minimum_delayed_follow_up_respondent_ratio
      );
      input.minimumDelayedFollowUpHours = maxNonNegativeNumber(
        input.minimumDelayedFollowUpHours,
        file.minimum_delayed_follow_up_hours
      );
      input.minimumDelayedSceneRecallRatio = maxUnitRatio(
        input.minimumDelayedSceneRecallRatio,
        file.minimum_delayed_scene_recall_ratio
      );
      input.minimumDelayedCharacterRecallRatio = maxUnitRatio(
        input.minimumDelayedCharacterRecallRatio,
        file.minimum_delayed_character_recall_ratio
      );
      input.minimumDelayedContinuationIntentRatio = maxUnitRatio(
        input.minimumDelayedContinuationIntentRatio,
        file.minimum_delayed_continuation_intent_ratio
      );
      input.minimumDelayedMemoryAnnotationCount = maxPositiveInteger(
        input.minimumDelayedMemoryAnnotationCount,
        file.minimum_delayed_memory_annotations
      );
      input.requireDelayedMemoryEvidenceForTuning =
        file.require_delayed_memory_evidence ??
        input.requireDelayedMemoryEvidenceForTuning;
      input.minimumComparativePreferenceWinRate = maxUnitRatio(
        input.minimumComparativePreferenceWinRate,
        file.minimum_comparative_preference_win_rate
      );
      input.minimumComparativePreferenceRespondentCount = maxPositiveInteger(
        input.minimumComparativePreferenceRespondentCount,
        file.minimum_comparative_preference_respondents
      );
      input.requireComparativePreferenceForTuning =
        input.requireComparativePreferenceForTuning ||
        file.require_comparative_preference === true;
      input.minimumRevisionLift = maxNonNegativeNumber(
        input.minimumRevisionLift,
        file.minimum_revision_lift
      );
      input.minimumRevisionPreferenceWinRate = maxUnitRatio(
        input.minimumRevisionPreferenceWinRate,
        file.minimum_revision_preference_win_rate
      );
      input.minimumRevisionPreferenceRespondentCount = maxPositiveInteger(
        input.minimumRevisionPreferenceRespondentCount,
        file.minimum_revision_preference_respondents
      );
      input.requireRevisionOutcomeEvidenceForTuning =
        input.requireRevisionOutcomeEvidenceForTuning ||
        file.require_revision_outcome_evidence === true;
      input.requiredChapterRanges.push(...normalizeChapterRangeRequirements(file.required_chapter_ranges ?? []));
    } else {
      input.samples.push(parsed as RawReaderResponseSample);
    }
  }

  input.requiredGenres = uniqueStrings(input.requiredGenres);
  input.requiredTargetReaderSegments = uniqueStrings(input.requiredTargetReaderSegments);
  input.requiredRecruitmentChannels = uniqueStrings(input.requiredRecruitmentChannels);

  if (input.samples.length === 0) {
    throw new Error(`Reader response files in ${inputDir} did not contain any samples`);
  }
  return input;
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

function normalizeSample(
  sample: RawReaderResponseSample,
  trend: QualityTrendData | undefined
): ReaderResponseCalibrationSample {
  const automated = normalizeAutomatedScores(sample, trend);

  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre,
    chapter: sample.chapter,
    calibrationSplit: normalizeCalibrationSplit(sample.calibration_split),
    automated,
    reader: normalizeReaderScores(sample.reader),
    respondentCount: sample.respondent_count,
    ratingScale: normalizeRatingScale(sample.rating_scale),
    evidence: normalizeEvidence(sample.evidence, sample.rating_scale),
  };
}

function normalizeCalibrationSplit(value: string | undefined): ReaderResponseCalibrationSplit | undefined {
  switch (value) {
    case 'calibration':
    case 'validation':
    case 'holdout':
      return value;
    default:
      return undefined;
  }
}

function normalizeAutomatedScores(
  sample: RawReaderResponseSample,
  trend: QualityTrendData | undefined
): AutomatedReaderQualityScores {
  const trendSnapshot = sample.chapter
    ? findLatestTrendSnapshot(trend, sample.chapter, sample.version)
    : undefined;
  const engagementScore =
    sample.automated?.engagement_score ??
    trendSnapshot?.dimensions?.engagement ??
    trendSnapshot?.overall_score ??
    trendSnapshot?.overallScore;

  if (typeof engagementScore !== 'number') {
    throw new Error(
      `Reader response sample ${sample.id} needs automated.engagement_score or a matching quality-trend snapshot`
    );
  }

  return {
    engagementScore,
    gatePassed: sample.automated?.gate_passed ?? trendSnapshot?.verdict === 'PASS',
    proseTasteScore: sample.automated?.prose_taste_score,
    issueCodes: sample.automated?.issue_codes ?? trendSnapshot?.issues?.map(issue => issue.code ?? ''),
  };
}

function findLatestTrendSnapshot(
  trend: QualityTrendData | undefined,
  chapter: number,
  version?: number
): QualityTrendSnapshot | undefined {
  const snapshots = (trend?.snapshots ?? [])
    .filter(snapshot => !snapshot.superseded)
    .filter(snapshot => (snapshot.chapter_number ?? snapshot.chapterNumber) === chapter)
    .filter(snapshot => version === undefined || snapshot.version === version)
    .sort((a, b) => (b.version ?? 0) - (a.version ?? 0));
  return snapshots[0];
}

function normalizeReaderScores(reader: RawReaderResponseSample['reader']): ReaderResponseScores {
  return {
    nextClick: reader.next_click,
    attention: reader.attention,
    emotionalEngagement: reader.emotional_engagement,
    mentalImagery: reader.mental_imagery,
    transportation: reader.transportation,
    characterAttachment: reader.character_attachment,
    relationshipInvestment: reader.relationship_investment,
    novelty: reader.novelty,
    surprise: reader.surprise,
    resonance: reader.resonance,
    sceneRecall: reader.scene_recall,
    recommendationIntent: reader.recommendation_intent,
    bookmarkIntent: reader.bookmark_intent,
    returnIntent: reader.return_intent,
    purchaseIntent: reader.purchase_intent,
    bingeIntent: reader.binge_intent,
    interest: reader.interest,
    suspense: reader.suspense,
    beauty: reader.beauty,
    amusement: reader.amusement,
    overallLiking: reader.overall_liking,
  };
}

function normalizeRatingScale(
  ratingScale: RawReaderResponseSample['rating_scale']
): ReaderResponseRatingScale | undefined {
  if (!ratingScale) return undefined;
  return {
    min: ratingScale.min,
    max: ratingScale.max,
  };
}

function normalizeEvidence(
  evidence: RawReaderResponseSample['evidence'],
  ratingScale: RawReaderResponseSample['rating_scale']
): ReaderResponseCalibrationSample['evidence'] {
  if (!evidence) return undefined;
  return {
    respondentSource: normalizeRespondentSource(evidence.respondent_source),
    humanRespondentCount: normalizeNonNegativeInteger(evidence.human_respondent_count),
    syntheticRespondentCount: normalizeNonNegativeInteger(evidence.synthetic_respondent_count),
    authorEstimateCount: normalizeNonNegativeInteger(evidence.author_estimate_count),
    manuscriptWordCount: normalizePositiveInteger(evidence.manuscript_word_count),
    manuscriptCharacterCount: normalizePositiveInteger(evidence.manuscript_character_count),
    medianReadTimeSeconds: normalizeNonNegativeNumber(evidence.median_read_time_seconds),
    minimumReadTimeSeconds: normalizeNonNegativeNumber(evidence.minimum_read_time_seconds),
    speedingResponseCount: normalizeNonNegativeInteger(evidence.speeding_response_count),
    straightLiningResponseCount: normalizeNonNegativeInteger(evidence.straight_lining_response_count),
    duplicateResponseCount: normalizeNonNegativeInteger(evidence.duplicate_response_count),
    botSuspectedResponseCount: normalizeNonNegativeInteger(evidence.bot_suspected_response_count),
    lowQualityOpenEndedResponseCount: normalizeNonNegativeInteger(
      evidence.low_quality_open_ended_response_count
    ),
    inconsistentResponseCount: normalizeNonNegativeInteger(evidence.inconsistent_response_count),
    qualityFlaggedResponseCount: normalizeNonNegativeInteger(evidence.quality_flagged_response_count),
    targetReaderCount: evidence.target_reader_count,
    targetReaderSegmentCount: evidence.target_reader_segment_count,
    targetReaderSegmentCounts: normalizeTargetReaderSegmentCounts(evidence.target_reader_segment_counts),
    dominantReaderSegmentRatio: evidence.dominant_reader_segment_ratio,
    startedReadCount: normalizeNonNegativeInteger(evidence.started_read_count),
    completedReadCount: evidence.completed_read_count,
    dropOffCount: normalizeNonNegativeInteger(evidence.drop_off_count),
    skimmedReadCount: normalizeNonNegativeInteger(evidence.skimmed_read_count),
    qualitativeCommentCount: evidence.qualitative_comment_count,
    frictionPointCount: evidence.friction_point_count,
    actionableFrictionPointCount: evidence.actionable_friction_point_count,
    rewriteSuggestionCount: evidence.rewrite_suggestion_count,
    frictionAnnotations: normalizeFrictionAnnotations(evidence.friction_annotations),
    dropOffAnnotations: normalizeDropOffAnnotations(evidence.drop_off_annotations),
    annotationCoderCount: normalizeNonNegativeInteger(evidence.annotation_coder_count),
    annotationDoubleCodedCount: normalizeNonNegativeInteger(evidence.annotation_double_coded_count),
    annotationAgreementRate: normalizeUnitRatio(evidence.annotation_agreement_rate),
    annotationReliabilityMetric: normalizeAnnotationReliabilityMetric(
      evidence.annotation_reliability_metric
    ),
    annotationCodebookVersion: normalizeOptionalText(evidence.annotation_codebook_version),
    annotationAdjudicated: evidence.annotation_adjudicated,
    annotationCoderBlinded: evidence.annotation_coder_blinded,
    unpromptedSceneRecallCount: normalizeNonNegativeInteger(evidence.unprompted_scene_recall_count),
    distinctiveSceneRecallCount: normalizeNonNegativeInteger(evidence.distinctive_scene_recall_count),
    sceneRecallAnnotations: normalizeSceneRecallAnnotations(evidence.scene_recall_annotations),
    tensionTracePointCount: normalizeNonNegativeInteger(evidence.tension_trace_point_count),
    tensionPeakCount: normalizeNonNegativeInteger(evidence.tension_peak_count),
    tensionQuestionCount: normalizeNonNegativeInteger(evidence.tension_question_count),
    tensionTraceAnnotations: normalizeTensionTraceAnnotations(evidence.tension_trace_annotations),
    forecastPredictionCount: normalizeNonNegativeInteger(evidence.forecast_prediction_count),
    forecastDiversityCount: normalizeNonNegativeInteger(evidence.forecast_diversity_count),
    forecastRevisionCount: normalizeNonNegativeInteger(evidence.forecast_revision_count),
    forecastMismatchCount: normalizeNonNegativeInteger(evidence.forecast_mismatch_count),
    forecastInflectionCount: normalizeNonNegativeInteger(evidence.forecast_inflection_count),
    narrativeForecastAnnotations: normalizeNarrativeForecastAnnotations(
      evidence.narrative_forecast_annotations
    ),
    quoteRecallCount: normalizeNonNegativeInteger(evidence.quote_recall_count),
    favoriteLineCount: normalizeNonNegativeInteger(evidence.favorite_line_count),
    shareableLineCount: normalizeNonNegativeInteger(evidence.shareable_line_count),
    lineQuoteAnnotations: normalizeLineQuoteAnnotations(evidence.line_quote_annotations),
    payoffSetupRecallCount: normalizeNonNegativeInteger(evidence.payoff_setup_recall_count),
    payoffTriggerRecognitionCount: normalizeNonNegativeInteger(evidence.payoff_trigger_recognition_count),
    payoffEarnedCount: normalizeNonNegativeInteger(evidence.payoff_earned_count),
    payoffRecontextualizationCount: normalizeNonNegativeInteger(evidence.payoff_recontextualization_count),
    payoffEmotionalSatisfactionCount: normalizeNonNegativeInteger(evidence.payoff_emotional_satisfaction_count),
    payoffFairnessAnnotations: normalizePayoffFairnessAnnotations(evidence.payoff_fairness_annotations),
    organicRecommendationCount: normalizeNonNegativeInteger(evidence.organic_recommendation_count),
    discussionPromptCount: normalizeNonNegativeInteger(evidence.discussion_prompt_count),
    advocacyAnnotations: normalizeAdvocacyAnnotations(evidence.advocacy_annotations),
    bookmarkCount: normalizeNonNegativeInteger(evidence.bookmark_count),
    followOrLibraryAddCount: normalizeNonNegativeInteger(evidence.follow_or_library_add_count),
    returnNextDayCount: normalizeNonNegativeInteger(evidence.return_next_day_count),
    bingeReadIntentCount: normalizeNonNegativeInteger(evidence.binge_read_intent_count),
    paidContinuationIntentCount: normalizeNonNegativeInteger(evidence.paid_continuation_intent_count),
    durableEngagementAnnotations: normalizeDurableEngagementAnnotations(
      evidence.durable_engagement_annotations
    ),
    nextChapterCtaImpressionCount: normalizeNonNegativeInteger(
      evidence.next_chapter_cta_impression_count
    ),
    nextChapterClickCount: normalizeNonNegativeInteger(evidence.next_chapter_click_count),
    nextChapterOpenCount: normalizeNonNegativeInteger(evidence.next_chapter_open_count),
    nextChapterReadStartCount: normalizeNonNegativeInteger(evidence.next_chapter_read_start_count),
    lingeringEmotionCount: normalizeNonNegativeInteger(evidence.lingering_emotion_count),
    reflectiveCommentCount: normalizeNonNegativeInteger(evidence.reflective_comment_count),
    personalMemoryOrMeaningCount: normalizeNonNegativeInteger(evidence.personal_memory_or_meaning_count),
    resonanceAnnotations: normalizeResonanceAnnotations(evidence.resonance_annotations),
    delayedFollowUpRespondentCount: normalizeNonNegativeInteger(
      evidence.delayed_follow_up_respondent_count
    ),
    delayedFollowUpHours: normalizeNonNegativeNumber(evidence.delayed_follow_up_hours),
    delayedSceneRecallCount: normalizeNonNegativeInteger(evidence.delayed_scene_recall_count),
    delayedCharacterRecallCount: normalizeNonNegativeInteger(evidence.delayed_character_recall_count),
    delayedNextClickIntentCount: normalizeNonNegativeInteger(evidence.delayed_next_click_intent_count),
    delayedReturnIntentCount: normalizeNonNegativeInteger(evidence.delayed_return_intent_count),
    delayedPaidContinuationIntentCount: normalizeNonNegativeInteger(
      evidence.delayed_paid_continuation_intent_count
    ),
    delayedMemoryAnnotations: normalizeDelayedMemoryAnnotations(evidence.delayed_memory_annotations),
    readerScoreStandardDeviation: normalizeRatingSpread(
      evidence.reader_score_standard_deviation,
      ratingScale
    ),
    highResponseCount: evidence.high_response_count,
    neutralResponseCount: evidence.neutral_response_count,
    lowResponseCount: evidence.low_response_count,
    blindReading: evidence.blind_reading,
    authorIdentityMasked: evidence.author_identity_masked,
    priorExposureScreened: evidence.prior_exposure_screened,
    unexcludedPriorExposureCount: normalizeNonNegativeInteger(evidence.unexcluded_prior_exposure_count),
    spoilerExposureScreened: evidence.spoiler_exposure_screened,
    unexcludedSpoilerExposureCount: normalizeNonNegativeInteger(evidence.unexcluded_spoiler_exposure_count),
    neutralQuestionWording: evidence.neutral_question_wording,
    responseOptionOrderRandomized: evidence.response_option_order_randomized,
    sampleOrderRandomized: evidence.sample_order_randomized,
    manuscriptOrderCounterbalanced: evidence.manuscript_order_counterbalanced,
    maxSamplesPerRespondent: normalizePositiveInteger(evidence.max_samples_per_respondent),
    orderBalanceRatio: normalizeUnitRatio(evidence.order_balance_ratio),
    questionWordingDisclosed: evidence.question_wording_disclosed,
    recruitmentMethodDisclosed: evidence.recruitment_method_disclosed,
    recruitmentChannelCounts: normalizeNamedCountMap(evidence.recruitment_channel_counts),
    populationDefinitionDisclosed: evidence.population_definition_disclosed,
    samplingFrameDisclosed: evidence.sampling_frame_disclosed,
    fieldworkDatesDisclosed: evidence.fieldwork_dates_disclosed,
    surveyModeDisclosed: evidence.survey_mode_disclosed,
    incentiveDisclosed: evidence.incentive_disclosed,
    attentionCheckPassCount: evidence.attention_check_pass_count,
    excludedResponseCount: evidence.excluded_response_count,
    comparativeReferenceLabel: normalizeOptionalText(evidence.comparative_reference_label),
    comparativePreferenceWinRate: normalizeUnitRatio(evidence.comparative_preference_win_rate),
    comparativePreferenceCurrentCount: normalizeNonNegativeInteger(evidence.comparative_preference_current_count),
    comparativePreferenceReferenceCount: normalizeNonNegativeInteger(evidence.comparative_preference_reference_count),
    comparativePreferenceTieCount: normalizeNonNegativeInteger(evidence.comparative_preference_tie_count),
    comparativePreferenceRespondentCount: normalizeNonNegativeInteger(evidence.comparative_preference_respondent_count),
    comparativeBlindPairwise: evidence.comparative_blind_pairwise,
    comparativeSameReaderCohort: evidence.comparative_same_reader_cohort,
    comparativeQuestionWordingDisclosed: evidence.comparative_question_wording_disclosed,
    revisionPairId: normalizeOptionalText(evidence.revision_pair_id),
    revisionBaselineReaderScore: normalizeOptionalScore(evidence.revision_baseline_reader_score),
    revisionCurrentReaderScore: normalizeOptionalScore(evidence.revision_current_reader_score),
    revisionPreferenceRevisedCount: normalizeNonNegativeInteger(evidence.revision_preference_revised_count),
    revisionPreferenceBaselineCount: normalizeNonNegativeInteger(evidence.revision_preference_baseline_count),
    revisionPreferenceTieCount: normalizeNonNegativeInteger(evidence.revision_preference_tie_count),
    revisionPreferenceRespondentCount: normalizeNonNegativeInteger(evidence.revision_preference_respondent_count),
    revisionBlindComparison: evidence.revision_blind_comparison,
    revisionSameReaderCohort: evidence.revision_same_reader_cohort,
    revisionQuestionWordingDisclosed: evidence.revision_question_wording_disclosed,
    revisionGuardrailRegressionCount: normalizeNonNegativeInteger(evidence.revision_guardrail_regression_count),
  };
}

function normalizeFrictionAnnotations(
  annotations: RawReaderResponseFrictionAnnotation[] | undefined
): ReaderResponseFrictionAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      quote: normalizeOptionalText(annotation.quote),
      dimension: normalizeReaderResponseDimension(annotation.dimension),
      reason: normalizeOptionalText(annotation.reason) ?? '',
      severity: normalizeFrictionSeverity(annotation.severity),
      rewriteSuggestion: normalizeOptionalText(annotation.rewrite_suggestion),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
    }))
    .filter(annotation => annotation.reason.length > 0);
}

function normalizeDropOffAnnotations(
  annotations: RawReaderResponseDropOffAnnotation[] | undefined
): ReaderResponseDropOffAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .flatMap(annotation => {
      const eventType = normalizeDropOffEventType(annotation.event_type);
      const reason = normalizeOptionalText(annotation.reason) ?? '';
      if (!eventType || reason.length === 0) return [];
      return [{
        location: normalizeOptionalText(annotation.location),
        eventType,
        lastCompletedLocation: normalizeOptionalText(annotation.last_completed_location),
        triggerQuote: normalizeOptionalText(annotation.trigger_quote),
        reason,
        readerCount: normalizeNonNegativeInteger(annotation.reader_count),
        readerSegment: normalizeOptionalText(annotation.reader_segment),
        suggestedRevision: normalizeOptionalText(annotation.suggested_revision),
      }];
    });
}

function normalizeSceneRecallAnnotations(
  annotations: RawReaderResponseSceneRecallAnnotation[] | undefined
): ReaderResponseSceneRecallAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      rememberedMoment: normalizeOptionalText(annotation.remembered_moment) ?? '',
      distinctiveDetail: normalizeOptionalText(annotation.distinctive_detail),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
    }))
    .filter(annotation => annotation.rememberedMoment.length > 0);
}

function normalizeTensionTraceAnnotations(
  annotations: RawReaderResponseTensionTraceAnnotation[] | undefined
): ReaderResponseTensionTraceAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      experiencedTension: normalizeOptionalText(annotation.experienced_tension) ?? '',
      suspenseLevel: normalizeOptionalScore(annotation.suspense_level),
      curiosityLevel: normalizeOptionalScore(annotation.curiosity_level),
      surpriseLevel: normalizeOptionalScore(annotation.surprise_level),
      narrativeQuestion: normalizeOptionalText(annotation.narrative_question),
      stakeOrRisk: normalizeOptionalText(annotation.stake_or_risk),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
      reason: normalizeOptionalText(annotation.reason),
    }))
    .filter(annotation => annotation.experiencedTension.length > 0);
}

function normalizeNarrativeForecastAnnotations(
  annotations: RawReaderResponseNarrativeForecastAnnotation[] | undefined
): ReaderResponseNarrativeForecastAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      initialPrediction: normalizeOptionalText(annotation.initial_prediction) ?? '',
      revisedPrediction: normalizeOptionalText(annotation.revised_prediction),
      actualOutcome: normalizeOptionalText(annotation.actual_outcome),
      predictionMismatch: annotation.prediction_mismatch,
      predictionShift: normalizeOptionalText(annotation.prediction_shift),
      surpriseOrTensionReason: normalizeOptionalText(annotation.surprise_or_tension_reason),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
    }))
    .filter(annotation => annotation.initialPrediction.length > 0);
}

function normalizeLineQuoteAnnotations(
  annotations: RawReaderResponseLineQuoteAnnotation[] | undefined
): ReaderResponseLineQuoteAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      quotedLine: normalizeOptionalText(annotation.quoted_line) ?? '',
      appealReason: normalizeOptionalText(annotation.appeal_reason),
      shareReason: normalizeOptionalText(annotation.share_reason),
      lineFunction: normalizeLineQuoteFunction(annotation.line_function),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
    }))
    .filter(annotation => annotation.quotedLine.length > 0);
}

function normalizePayoffFairnessAnnotations(
  annotations: RawReaderResponsePayoffFairnessAnnotation[] | undefined
): ReaderResponsePayoffFairnessAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      payoffMoment: normalizeOptionalText(annotation.payoff_moment) ?? '',
      rememberedSetup: normalizeOptionalText(annotation.remembered_setup),
      triggerOrReveal: normalizeOptionalText(annotation.trigger_or_reveal),
      changedInterpretation: normalizeOptionalText(annotation.changed_interpretation),
      earnedReason: normalizeOptionalText(annotation.earned_reason),
      arbitraryOrCheatReason: normalizeOptionalText(annotation.arbitrary_or_cheat_reason),
      emotionalPayoffReason: normalizeOptionalText(annotation.emotional_payoff_reason),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
    }))
    .filter(annotation => annotation.payoffMoment.length > 0);
}

function normalizeAdvocacyAnnotations(
  annotations: RawReaderResponseAdvocacyAnnotation[] | undefined
): ReaderResponseAdvocacyAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      shareTrigger: normalizeOptionalText(annotation.share_trigger) ?? '',
      recommendedAudience: normalizeOptionalText(annotation.recommended_audience),
      discussionPrompt: normalizeOptionalText(annotation.discussion_prompt),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
    }))
    .filter(annotation => annotation.shareTrigger.length > 0);
}

function normalizeDurableEngagementAnnotations(
  annotations: RawReaderResponseDurableEngagementAnnotation[] | undefined
): ReaderResponseDurableEngagementAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      commitmentTrigger: normalizeOptionalText(annotation.commitment_trigger) ?? '',
      intendedAction: normalizeDurableEngagementAction(annotation.intended_action),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
      reason: normalizeOptionalText(annotation.reason),
    }))
    .filter(annotation => annotation.commitmentTrigger.length > 0);
}

function normalizeResonanceAnnotations(
  annotations: RawReaderResponseResonanceAnnotation[] | undefined
): ReaderResponseResonanceAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      lingeringEmotion: normalizeOptionalText(annotation.lingering_emotion) ?? '',
      reflectiveQuestion: normalizeOptionalText(annotation.reflective_question),
      rememberedImage: normalizeOptionalText(annotation.remembered_image),
      personalMeaning: normalizeOptionalText(annotation.personal_meaning),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
    }))
    .filter(annotation => annotation.lingeringEmotion.length > 0);
}

function normalizeDelayedMemoryAnnotations(
  annotations: RawReaderResponseDelayedMemoryAnnotation[] | undefined
): ReaderResponseDelayedMemoryAnnotation[] | undefined {
  if (!Array.isArray(annotations)) return undefined;

  return annotations
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      delayedRememberedMoment: normalizeOptionalText(annotation.delayed_remembered_moment) ?? '',
      delayedCharacterOrRelationship: normalizeOptionalText(annotation.delayed_character_or_relationship),
      delayedNextQuestion: normalizeOptionalText(annotation.delayed_next_question),
      returnOrPurchaseReason: normalizeOptionalText(annotation.return_or_purchase_reason),
      readerCount: normalizeNonNegativeInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
    }))
    .filter(annotation => annotation.delayedRememberedMoment.length > 0);
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}

function normalizeAnnotationReliabilityMetric(
  value: string | undefined
): ReaderResponseAnnotationReliabilityMetric | undefined {
  switch (value) {
    case 'percent-agreement':
    case 'cohen-kappa':
    case 'fleiss-kappa':
    case 'krippendorff-alpha':
    case 'icc':
    case 'other':
      return value;
    default:
      return undefined;
  }
}

function normalizeReaderResponseDimension(value: string | undefined): ReaderResponseDimension | undefined {
  switch (value) {
    case 'next-click':
    case 'attention':
    case 'emotional-engagement':
    case 'mental-imagery':
    case 'transportation':
    case 'character-attachment':
    case 'relationship-investment':
    case 'novelty':
    case 'surprise':
    case 'resonance':
    case 'scene-recall':
    case 'recommendation-intent':
    case 'bookmark-intent':
    case 'return-intent':
    case 'purchase-intent':
    case 'binge-intent':
    case 'interest':
    case 'suspense':
    case 'beauty':
    case 'amusement':
    case 'overall-liking':
      return value;
    default:
      return undefined;
  }
}

function normalizeRespondentSource(value: string | undefined): ReaderResponseRespondentSource | undefined {
  switch (value) {
    case 'human-target-reader':
    case 'human-general-reader':
    case 'mixed-human-synthetic':
    case 'synthetic-ai':
    case 'author-estimate':
    case 'unknown':
      return value;
    default:
      return undefined;
  }
}

function normalizeDurableEngagementAction(
  value: string | undefined
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

function normalizeDropOffEventType(value: string | undefined): ReaderResponseDropOffEventType | undefined {
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

function normalizeLineQuoteFunction(value: string | undefined): ReaderResponseLineQuoteFunction | undefined {
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

function normalizeFrictionSeverity(value: string | undefined): ReaderResponseFrictionSeverity | undefined {
  switch (value) {
    case 'minor':
    case 'major':
    case 'critical':
      return value;
    default:
      return undefined;
  }
}

function normalizeNonNegativeInteger(value: number | undefined): number | undefined {
  return Number.isInteger(value) && (value ?? -1) >= 0 ? value : undefined;
}

function normalizeTargetReaderSegmentCounts(
  segmentCounts: Record<string, number> | undefined
): Record<string, number> | undefined {
  return normalizeNamedCountMap(segmentCounts);
}

function normalizeNamedCountMap(
  counts: Record<string, number> | undefined
): Record<string, number> | undefined {
  if (!counts) return undefined;
  const normalized: Record<string, number> = {};
  for (const [rawSegment, rawCount] of Object.entries(counts)) {
    const segment = normalizeOptionalText(rawSegment);
    const count = normalizeNonNegativeInteger(rawCount);
    if (segment !== undefined && count !== undefined) {
      normalized[segment] = count;
    }
  }
  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function normalizeNonNegativeNumber(value: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function normalizeOptionalScore(value: number | undefined): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.max(0, Math.min(100, value));
}

function normalizeRatingSpread(
  value: number | undefined,
  ratingScale: RawReaderResponseSample['rating_scale']
): number | undefined {
  if (value === undefined) return undefined;
  if (!ratingScale || ratingScale.max <= ratingScale.min) return value;
  return (value / (ratingScale.max - ratingScale.min)) * 100;
}

function normalizeChapterRangeRequirements(
  ranges: RawReaderResponseChapterRangeRequirement[]
): ReaderResponseChapterRangeRequirement[] {
  return ranges
    .filter(range => range.id && Number.isInteger(range.min_chapter) && (range.min_chapter ?? 0) > 0)
    .map(range => ({
      id: range.id?.trim() ?? '',
      label: range.label?.trim() || undefined,
      minChapter: range.min_chapter ?? 1,
      maxChapter: range.max_chapter,
      requiredGenres: uniqueStrings(range.required_genres ?? []),
      minimumSamples: maxPositiveInteger(range.minimum_samples),
      minimumUsableSamples: maxPositiveInteger(range.minimum_usable_samples),
    }))
    .filter(range => range.id.length > 0);
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(value => value.length > 0))];
}

function maxPositiveInteger(...values: Array<number | undefined>): number | undefined {
  const validValues = values.filter(
    (value): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0
  );
  return validValues.length === 0 ? undefined : Math.max(...validValues);
}

function minPositiveInteger(...values: Array<number | undefined>): number | undefined {
  const validValues = values.filter(
    (value): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0
  );
  return validValues.length === 0 ? undefined : Math.min(...validValues);
}

function normalizePositiveInteger(value: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : undefined;
}

function maxNonNegativeNumber(...values: Array<number | undefined>): number | undefined {
  const validValues = values.filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0
  );
  return validValues.length === 0 ? undefined : Math.max(...validValues);
}

function minPositiveNumber(...values: Array<number | undefined>): number | undefined {
  const validValues = values.filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0
  );
  return validValues.length === 0 ? undefined : Math.min(...validValues);
}

function maxUnitRatio(...values: Array<number | undefined>): number | undefined {
  const validValues = values
    .map(normalizeUnitRatio)
    .filter((value): value is number => value !== undefined);
  return validValues.length === 0 ? undefined : Math.max(...validValues);
}

function minUnitRatio(...values: Array<number | undefined>): number | undefined {
  const validValues = values
    .map(normalizeUnitRatio)
    .filter((value): value is number => value !== undefined);
  return validValues.length === 0 ? undefined : Math.min(...validValues);
}

function normalizeUnitRatio(value: number | undefined): number | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  if (value > 1 && value <= 100) return Math.max(0, Math.min(1, value / 100));
  return Math.max(0, Math.min(1, value));
}

async function readJson(filePath: string): Promise<unknown> {
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
