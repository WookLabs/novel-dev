/**
 * Prose Taste Gate
 *
 * A style-quality gate for Korean fiction prose. This is intentionally not a
 * generic "AI detector"; it scores concrete habits that often make generated
 * prose feel artificial, over-written, or unpleasant to a specific reader.
 *
 * @module quality/prose-taste-gate
 */

export type ProseTasteMode = 'plain' | 'balanced' | 'lyrical' | 'webnovel-fast';

export type ProseTasteIssueCode =
  | 'functional-ai-report'
  | 'over-embodied-reaction'
  | 'body-reaction-subject-chain'
  | 'cliche-emotion-image-chain'
  | 'symbolic-abstraction-stack'
  | 'over-sensory-density'
  | 'sensory-wallpaper-run'
  | 'forced-metaphor-chain'
  | 'flat-emotion-label'
  | 'emotion-label-carousel'
  | 'hedged-perception-haze'
  | 'listified-inner-monologue'
  | 'monotone-short-sentence-run'
  | 'uniform-sentence-length-cadence'
  | 'same-ending-run'
  | 'dominant-ending-cadence-lock'
  | 'dialogue-ending-cadence-lock'
  | 'dialogue-starter-cadence-lock'
  | 'dialogue-question-cascade'
  | 'dialogue-vocative-cadence-lock'
  | 'dialogue-lexical-echo-chain'
  | 'dialogue-paraphrase-confirmation-chain'
  | 'abstract-exposition-drift'
  | 'cognitive-filtering-overload'
  | 'therapy-speak-self-analysis'
  | 'backstory-info-dump-block'
  | 'relationship-montage-summary'
  | 'time-skip-summary-chain'
  | 'contrastive-reframe-cadence'
  | 'lore-name-overload'
  | 'system-stat-block-dump'
  | 'declared-resolve-loop'
  | 'revelation-summary-leap'
  | 'procedural-checklist-cadence'
  | 'action-choreography-loop'
  | 'nominalized-explanation-chain'
  | 'translationese-formula-drift'
  | 'connective-crutch-rhythm'
  | 'filler-adverb-cadence'
  | 'simultaneous-action-cadence'
  | 'status-quo-action-loop'
  | 'prop-fidget-loop'
  | 'gaze-choreography-loop'
  | 'comma-rhythm-overload'
  | 'reporting-tail-summary'
  | 'offscreen-resolution-summary'
  | 'punctuation-emphasis-overload'
  | 'repeated-subject-rhythm'
  | 'detached-camera-description'
  | 'pov-mind-hop-chain'
  | 'expository-dialogue-dump'
  | 'monologue-dialogue-dump'
  | 'talking-head-dialogue-run'
  | 'rote-dialogue-response-chain'
  | 'mechanical-dialogue-tag-chain'
  | 'dialogue-silence-stall-chain'
  | 'melodramatic-emotion-caption-chain'
  | 'stock-reaction-beat-chain'
  | 'facial-expression-crutch-chain'
  | 'vague-atmosphere-modifier-chain'
  | 'evaluative-modifier-stack'
  | 'rhetorical-question-drift'
  | 'subtext-overexplanation-chain'
  | 'ambiguous-reference-chain'
  | 'generic-omniscient-teaser'
  | 'thin-cliffhanger-ending'
  | 'scene-transition-grounding-gap'
  | 'topic-marker-cadence-lock'
  | 'design-jargon-in-prose'
  | 'explicit-disliked-phrase';

export type ProseTasteIssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface ProseTasteProfile {
  /** Preferred prose mode. Defaults to balanced. */
  preferredMode?: ProseTasteMode;

  /** Phrases that should never survive in final prose for this project/user. */
  dislikedPhrases?: string[];

  /** Optional density overrides per 1000 Korean/Latin characters. */
  maxSensoryDensityPer1000?: number;
  maxEmbodiedReactionDensityPer1000?: number;
  maxBodyReactionSubjectDensityPer1000?: number;
  maxBodyReactionSubjectRun?: number;
  maxClicheEmotionImageDensityPer1000?: number;
  maxClicheEmotionImageRun?: number;
  maxSymbolicAbstractionDensityPer1000?: number;
  maxSymbolicAbstractionRun?: number;
  maxMetaphorDensityPer1000?: number;
  maxSensoryWallpaperRun?: number;
  maxEmotionLabelDensityPer1000?: number;
  maxEmotionLabelRun?: number;
  maxHedgedPerceptionDensityPer1000?: number;
  maxAbstractNounDensityPer1000?: number;
  maxCognitiveFilterDensityPer1000?: number;
  maxTherapySpeakDensityPer1000?: number;
  maxTherapySpeakRun?: number;
  maxBackstoryExpositionDensityPer1000?: number;
  maxBackstoryExpositionRun?: number;
  maxRelationshipMontageSummaryDensityPer1000?: number;
  maxRelationshipMontageSummaryRun?: number;
  maxTimeSkipSummaryDensityPer1000?: number;
  maxTimeSkipSummaryRun?: number;
  maxContrastiveReframeDensityPer1000?: number;
  maxContrastiveReframeRun?: number;
  maxLoreTermDensityPer1000?: number;
  maxLoreTermRun?: number;
  maxSystemStatBlockDensityPer1000?: number;
  maxSystemStatBlockRun?: number;
  maxDeclaredResolveDensityPer1000?: number;
  maxDeclaredResolveRun?: number;
  maxRevelationSummaryDensityPer1000?: number;
  maxRevelationSummaryRun?: number;
  maxProceduralChecklistDensityPer1000?: number;
  maxProceduralChecklistRun?: number;
  maxActionChoreographyDensityPer1000?: number;
  maxActionChoreographyRun?: number;
  maxNominalizedExplanationDensityPer1000?: number;
  maxTranslationeseFormulaDensityPer1000?: number;
  maxConnectiveStarterDensityPer1000?: number;
  maxFillerAdverbDensityPer1000?: number;
  maxFillerAdverbRun?: number;
  maxSimultaneousActionDensityPer1000?: number;
  maxSimultaneousActionRun?: number;
  maxStatusQuoActionDensityPer1000?: number;
  maxStatusQuoActionRun?: number;
  maxPropFidgetBeatDensityPer1000?: number;
  maxPropFidgetBeatRun?: number;
  maxGazeChoreographyDensityPer1000?: number;
  maxGazeChoreographyRun?: number;
  minCausalTurnDensityPer1000?: number;
  maxCommaDensityPer1000?: number;
  maxReportingTailDensityPer1000?: number;
  maxEmphasisPunctuationDensityPer1000?: number;
  maxEmphasisPunctuationRun?: number;
  maxStaticDescriptionDensityPer1000?: number;
  maxGenericTeaserDensityPer1000?: number;
  maxThinCliffhangerEndingCount?: number;
  maxPovMindJumpDensityPer1000?: number;
  maxPovMindJumpRun?: number;
  maxExpositoryDialogueRatio?: number;
  maxDialogueTurnLength?: number;
  maxAverageDialogueTurnLength?: number;
  maxDialogueGroundingGapRun?: number;
  maxDialogueQuestionRatio?: number;
  maxDialogueQuestionRun?: number;
  maxDialogueVocativeRatio?: number;
  maxDialogueVocativeRun?: number;
  maxDialogueLexicalEchoRatio?: number;
  maxDialogueLexicalEchoRun?: number;
  maxDialogueParaphraseConfirmationRatio?: number;
  maxDialogueParaphraseConfirmationRun?: number;
  maxRoteDialogueReplyRatio?: number;
  maxRoteDialogueReplyRun?: number;
  maxNeutralDialogueTagRatio?: number;
  maxNeutralDialogueTagRun?: number;
  maxSilenceStallDensityPer1000?: number;
  maxSilenceStallRun?: number;
  maxMelodramaticCaptionDensityPer1000?: number;
  maxMelodramaticCaptionRun?: number;
  maxStockReactionBeatDensityPer1000?: number;
  maxStockReactionBeatRun?: number;
  maxFacialExpressionBeatDensityPer1000?: number;
  maxFacialExpressionBeatRun?: number;
  maxVagueAtmosphereModifierDensityPer1000?: number;
  maxVagueAtmosphereModifierRun?: number;
  maxEvaluativeModifierDensityPer1000?: number;
  maxEvaluativeModifierRun?: number;
  maxRhetoricalQuestionDensityPer1000?: number;
  maxRhetoricalQuestionRun?: number;
  maxSubtextExplanationDensityPer1000?: number;
  maxSubtextExplanationRun?: number;
  maxAmbiguousReferenceDensityPer1000?: number;
  maxAmbiguousReferenceRun?: number;
  maxSceneTransitionGroundingGapDensityPer1000?: number;
  maxSceneTransitionGroundingGapRun?: number;
  maxTopicMarkerStarterDensityPer1000?: number;
  maxTopicMarkerStarterRun?: number;
  minSentenceLengthVariationCoefficient?: number;
  maxUniformSentenceLengthRun?: number;
  maxSameEndingRun?: number;
  maxDominantSentenceEndingShare?: number;
  maxDominantDialogueEndingShare?: number;
  maxDominantDialogueStarterShare?: number;
  minViewpointAnchorDensityPer1000?: number;
  maxShortSentenceRun?: number;
  maxRepeatedSubjectRun?: number;
  maxRepeatedConnectiveStarterRun?: number;

  /** Minimum acceptable taste score. Defaults to 88. */
  minimumScore?: number;
}

export interface ProseTasteGateOptions {
  profile?: ProseTasteProfile;
  threshold?: number;
}

export interface ProseTasteMetrics {
  characterCount: number;
  functionalReportCount: number;
  embodiedReactionDensityPer1000: number;
  bodyReactionSubjectDensityPer1000: number;
  longestBodyReactionSubjectRun: number;
  clicheEmotionImageDensityPer1000: number;
  longestClicheEmotionImageRun: number;
  symbolicAbstractionDensityPer1000: number;
  longestSymbolicAbstractionRun: number;
  sensoryDensityPer1000: number;
  longestSensoryWallpaperRun: number;
  metaphorDensityPer1000: number;
  emotionLabelDensityPer1000: number;
  longestEmotionLabelRun: number;
  hedgedPerceptionDensityPer1000: number;
  abstractNounDensityPer1000: number;
  cognitiveFilterDensityPer1000: number;
  therapySpeakDensityPer1000: number;
  longestTherapySpeakRun: number;
  backstoryExpositionDensityPer1000: number;
  longestBackstoryExpositionRun: number;
  relationshipMontageSummaryDensityPer1000: number;
  longestRelationshipMontageSummaryRun: number;
  timeSkipSummaryDensityPer1000: number;
  longestTimeSkipSummaryRun: number;
  contrastiveReframeDensityPer1000: number;
  longestContrastiveReframeRun: number;
  loreTermDensityPer1000: number;
  loreTermOverloadSentenceCount: number;
  longestLoreTermRun: number;
  systemStatBlockDensityPer1000: number;
  longestSystemStatBlockRun: number;
  declaredResolveDensityPer1000: number;
  longestDeclaredResolveRun: number;
  revelationSummaryDensityPer1000: number;
  longestRevelationSummaryRun: number;
  proceduralChecklistDensityPer1000: number;
  longestProceduralChecklistRun: number;
  actionChoreographyDensityPer1000: number;
  longestActionChoreographyRun: number;
  nominalizedExplanationDensityPer1000: number;
  translationeseFormulaDensityPer1000: number;
  connectiveStarterDensityPer1000: number;
  fillerAdverbDensityPer1000: number;
  longestFillerAdverbRun: number;
  simultaneousActionDensityPer1000: number;
  longestSimultaneousActionRun: number;
  statusQuoActionDensityPer1000: number;
  longestStatusQuoActionRun: number;
  propFidgetBeatDensityPer1000: number;
  longestPropFidgetBeatRun: number;
  gazeChoreographyDensityPer1000: number;
  longestGazeChoreographyRun: number;
  causalTurnDensityPer1000: number;
  commaDensityPer1000: number;
  reportingTailDensityPer1000: number;
  emphasisPunctuationDensityPer1000: number;
  longestEmphasisPunctuationRun: number;
  staticDescriptionDensityPer1000: number;
  genericTeaserDensityPer1000: number;
  thinCliffhangerEndingCount: number;
  endingCliffhangerSignalCount: number;
  endingConcreteTriggerCount: number;
  povMindJumpParagraphDensityPer1000: number;
  povMindJumpParagraphCount: number;
  longestPovMindJumpRun: number;
  dialogueCount: number;
  expositoryDialogueCount: number;
  expositoryDialogueRatio: number;
  longestDialogueTurnLength: number;
  averageDialogueTurnLength: number;
  longestDialogueGroundingGapRun: number;
  dialogueQuestionTurnCount: number;
  dialogueQuestionRatio: number;
  longestDialogueQuestionRun: number;
  dialogueVocativeTurnCount: number;
  dialogueVocativeRatio: number;
  longestDialogueVocativeRun: number;
  dialogueLexicalEchoTurnCount: number;
  dialogueLexicalEchoRatio: number;
  longestDialogueLexicalEchoRun: number;
  dialogueParaphraseConfirmationTurnCount: number;
  dialogueParaphraseConfirmationRatio: number;
  longestDialogueParaphraseConfirmationRun: number;
  roteDialogueReplyCount: number;
  roteDialogueReplyRatio: number;
  longestRoteDialogueReplyRun: number;
  neutralDialogueTagCount: number;
  neutralDialogueTagRatio: number;
  longestNeutralDialogueTagRun: number;
  silenceStallDensityPer1000: number;
  longestSilenceStallRun: number;
  melodramaticCaptionDensityPer1000: number;
  longestMelodramaticCaptionRun: number;
  stockReactionBeatDensityPer1000: number;
  longestStockReactionBeatRun: number;
  facialExpressionBeatDensityPer1000: number;
  longestFacialExpressionBeatRun: number;
  vagueAtmosphereModifierDensityPer1000: number;
  longestVagueAtmosphereModifierRun: number;
  evaluativeModifierDensityPer1000: number;
  longestEvaluativeModifierRun: number;
  rhetoricalQuestionDensityPer1000: number;
  longestRhetoricalQuestionRun: number;
  subtextExplanationDensityPer1000: number;
  longestSubtextExplanationRun: number;
  ambiguousReferenceDensityPer1000: number;
  longestAmbiguousReferenceRun: number;
  sceneTransitionGroundingGapDensityPer1000: number;
  longestSceneTransitionGroundingGapRun: number;
  topicMarkerStarterDensityPer1000: number;
  longestTopicMarkerStarterRun: number;
  sentenceLengthVariationCoefficient: number;
  longestUniformSentenceLengthRun: number;
  viewpointAnchorDensityPer1000: number;
  listMarkerCount: number;
  designJargonCount: number;
  longestShortSentenceRun: number;
  longestSameEndingRun: number;
  dominantSentenceEndingShare: number;
  dominantSentenceEndingCount: number;
  sentenceEndingCadenceSampleSize: number;
  dominantDialogueEndingShare: number;
  dominantDialogueEndingCount: number;
  dialogueEndingCadenceSampleSize: number;
  dominantDialogueStarterShare: number;
  dominantDialogueStarterCount: number;
  dialogueStarterCadenceSampleSize: number;
  longestRepeatedSubjectRun: number;
  longestRepeatedConnectiveStarterRun: number;
}

export interface ProseTasteIssue {
  code: ProseTasteIssueCode;
  severity: ProseTasteIssueSeverity;
  message: string;
  evidence: string;
  suggestion: string;
  penalty: number;
  position?: number;
  lineNumber?: number;
  paragraphNumber?: number;
  sentenceNumber?: number;
  targetText?: string;
  localizationConfidence?: 'exact' | 'evidence' | 'fallback';
}

export interface ProseTasteGateResult {
  score: number;
  passed: boolean;
  threshold: number;
  mode: ProseTasteMode;
  calibration: 'generic' | 'profiled';
  issues: ProseTasteIssue[];
  metrics: ProseTasteMetrics;
}

interface ModeThresholds {
  maxSensoryDensityPer1000: number;
  maxEmbodiedReactionDensityPer1000: number;
  maxBodyReactionSubjectDensityPer1000: number;
  maxBodyReactionSubjectRun: number;
  maxClicheEmotionImageDensityPer1000: number;
  maxClicheEmotionImageRun: number;
  maxSymbolicAbstractionDensityPer1000: number;
  maxSymbolicAbstractionRun: number;
  maxMetaphorDensityPer1000: number;
  maxSensoryWallpaperRun: number;
  maxEmotionLabelDensityPer1000: number;
  maxEmotionLabelRun: number;
  maxHedgedPerceptionDensityPer1000: number;
  maxAbstractNounDensityPer1000: number;
  maxCognitiveFilterDensityPer1000: number;
  maxTherapySpeakDensityPer1000: number;
  maxTherapySpeakRun: number;
  maxBackstoryExpositionDensityPer1000: number;
  maxBackstoryExpositionRun: number;
  maxRelationshipMontageSummaryDensityPer1000: number;
  maxRelationshipMontageSummaryRun: number;
  maxTimeSkipSummaryDensityPer1000: number;
  maxTimeSkipSummaryRun: number;
  maxContrastiveReframeDensityPer1000: number;
  maxContrastiveReframeRun: number;
  maxLoreTermDensityPer1000: number;
  maxLoreTermRun: number;
  maxSystemStatBlockDensityPer1000: number;
  maxSystemStatBlockRun: number;
  maxDeclaredResolveDensityPer1000: number;
  maxDeclaredResolveRun: number;
  maxRevelationSummaryDensityPer1000: number;
  maxRevelationSummaryRun: number;
  maxProceduralChecklistDensityPer1000: number;
  maxProceduralChecklistRun: number;
  maxActionChoreographyDensityPer1000: number;
  maxActionChoreographyRun: number;
  maxNominalizedExplanationDensityPer1000: number;
  maxTranslationeseFormulaDensityPer1000: number;
  maxConnectiveStarterDensityPer1000: number;
  maxFillerAdverbDensityPer1000: number;
  maxFillerAdverbRun: number;
  maxSimultaneousActionDensityPer1000: number;
  maxSimultaneousActionRun: number;
  maxStatusQuoActionDensityPer1000: number;
  maxStatusQuoActionRun: number;
  maxPropFidgetBeatDensityPer1000: number;
  maxPropFidgetBeatRun: number;
  maxGazeChoreographyDensityPer1000: number;
  maxGazeChoreographyRun: number;
  minCausalTurnDensityPer1000: number;
  maxCommaDensityPer1000: number;
  maxReportingTailDensityPer1000: number;
  maxEmphasisPunctuationDensityPer1000: number;
  maxEmphasisPunctuationRun: number;
  maxStaticDescriptionDensityPer1000: number;
  maxGenericTeaserDensityPer1000: number;
  maxThinCliffhangerEndingCount: number;
  maxPovMindJumpDensityPer1000: number;
  maxPovMindJumpRun: number;
  maxExpositoryDialogueRatio: number;
  maxDialogueTurnLength: number;
  maxAverageDialogueTurnLength: number;
  maxDialogueGroundingGapRun: number;
  maxDialogueQuestionRatio: number;
  maxDialogueQuestionRun: number;
  maxDialogueVocativeRatio: number;
  maxDialogueVocativeRun: number;
  maxDialogueLexicalEchoRatio: number;
  maxDialogueLexicalEchoRun: number;
  maxDialogueParaphraseConfirmationRatio: number;
  maxDialogueParaphraseConfirmationRun: number;
  maxRoteDialogueReplyRatio: number;
  maxRoteDialogueReplyRun: number;
  maxNeutralDialogueTagRatio: number;
  maxNeutralDialogueTagRun: number;
  maxSilenceStallDensityPer1000: number;
  maxSilenceStallRun: number;
  maxMelodramaticCaptionDensityPer1000: number;
  maxMelodramaticCaptionRun: number;
  maxStockReactionBeatDensityPer1000: number;
  maxStockReactionBeatRun: number;
  maxFacialExpressionBeatDensityPer1000: number;
  maxFacialExpressionBeatRun: number;
  maxVagueAtmosphereModifierDensityPer1000: number;
  maxVagueAtmosphereModifierRun: number;
  maxEvaluativeModifierDensityPer1000: number;
  maxEvaluativeModifierRun: number;
  maxRhetoricalQuestionDensityPer1000: number;
  maxRhetoricalQuestionRun: number;
  maxSubtextExplanationDensityPer1000: number;
  maxSubtextExplanationRun: number;
  maxAmbiguousReferenceDensityPer1000: number;
  maxAmbiguousReferenceRun: number;
  maxSceneTransitionGroundingGapDensityPer1000: number;
  maxSceneTransitionGroundingGapRun: number;
  maxTopicMarkerStarterDensityPer1000: number;
  maxTopicMarkerStarterRun: number;
  minSentenceLengthVariationCoefficient: number;
  maxUniformSentenceLengthRun: number;
  maxSameEndingRun: number;
  maxDominantSentenceEndingShare: number;
  maxDominantDialogueEndingShare: number;
  maxDominantDialogueStarterShare: number;
  minViewpointAnchorDensityPer1000: number;
  maxShortSentenceRun: number;
  maxRepeatedSubjectRun: number;
  maxRepeatedConnectiveStarterRun: number;
}

const DEFAULT_THRESHOLD = 88;

const MODE_THRESHOLDS: Record<ProseTasteMode, ModeThresholds> = {
  plain: {
    maxSensoryDensityPer1000: 16,
    maxEmbodiedReactionDensityPer1000: 6,
    maxBodyReactionSubjectDensityPer1000: 4,
    maxBodyReactionSubjectRun: 2,
    maxClicheEmotionImageDensityPer1000: 3,
    maxClicheEmotionImageRun: 2,
    maxSymbolicAbstractionDensityPer1000: 4,
    maxSymbolicAbstractionRun: 2,
    maxMetaphorDensityPer1000: 3,
    maxSensoryWallpaperRun: 3,
    maxEmotionLabelDensityPer1000: 4,
    maxEmotionLabelRun: 2,
    maxHedgedPerceptionDensityPer1000: 4,
    maxAbstractNounDensityPer1000: 8,
    maxCognitiveFilterDensityPer1000: 4,
    maxTherapySpeakDensityPer1000: 3,
    maxTherapySpeakRun: 2,
    maxBackstoryExpositionDensityPer1000: 4,
    maxBackstoryExpositionRun: 2,
    maxRelationshipMontageSummaryDensityPer1000: 3,
    maxRelationshipMontageSummaryRun: 2,
    maxTimeSkipSummaryDensityPer1000: 3,
    maxTimeSkipSummaryRun: 2,
    maxContrastiveReframeDensityPer1000: 3,
    maxContrastiveReframeRun: 2,
    maxLoreTermDensityPer1000: 8,
    maxLoreTermRun: 2,
    maxSystemStatBlockDensityPer1000: 3,
    maxSystemStatBlockRun: 2,
    maxDeclaredResolveDensityPer1000: 4,
    maxDeclaredResolveRun: 2,
    maxRevelationSummaryDensityPer1000: 3,
    maxRevelationSummaryRun: 2,
    maxProceduralChecklistDensityPer1000: 4,
    maxProceduralChecklistRun: 2,
    maxActionChoreographyDensityPer1000: 5,
    maxActionChoreographyRun: 3,
    maxNominalizedExplanationDensityPer1000: 5,
    maxTranslationeseFormulaDensityPer1000: 3,
    maxConnectiveStarterDensityPer1000: 4,
    maxFillerAdverbDensityPer1000: 4,
    maxFillerAdverbRun: 3,
    maxSimultaneousActionDensityPer1000: 5,
    maxSimultaneousActionRun: 2,
    maxStatusQuoActionDensityPer1000: 5,
    maxStatusQuoActionRun: 3,
    maxPropFidgetBeatDensityPer1000: 4,
    maxPropFidgetBeatRun: 2,
    maxGazeChoreographyDensityPer1000: 5,
    maxGazeChoreographyRun: 3,
    minCausalTurnDensityPer1000: 1,
    maxCommaDensityPer1000: 18,
    maxReportingTailDensityPer1000: 3,
    maxEmphasisPunctuationDensityPer1000: 4,
    maxEmphasisPunctuationRun: 2,
    maxStaticDescriptionDensityPer1000: 8,
    maxGenericTeaserDensityPer1000: 2,
    maxThinCliffhangerEndingCount: 0,
    maxPovMindJumpDensityPer1000: 1.2,
    maxPovMindJumpRun: 1,
    maxExpositoryDialogueRatio: 0.35,
    maxDialogueTurnLength: 140,
    maxAverageDialogueTurnLength: 90,
    maxDialogueGroundingGapRun: 5,
    maxDialogueQuestionRatio: 0.58,
    maxDialogueQuestionRun: 3,
    maxDialogueVocativeRatio: 0.42,
    maxDialogueVocativeRun: 2,
    maxDialogueLexicalEchoRatio: 0.48,
    maxDialogueLexicalEchoRun: 3,
    maxDialogueParaphraseConfirmationRatio: 0.38,
    maxDialogueParaphraseConfirmationRun: 2,
    maxRoteDialogueReplyRatio: 0.45,
    maxRoteDialogueReplyRun: 3,
    maxNeutralDialogueTagRatio: 0.55,
    maxNeutralDialogueTagRun: 4,
    maxSilenceStallDensityPer1000: 3,
    maxSilenceStallRun: 2,
    maxMelodramaticCaptionDensityPer1000: 3,
    maxMelodramaticCaptionRun: 2,
    maxStockReactionBeatDensityPer1000: 6,
    maxStockReactionBeatRun: 3,
    maxFacialExpressionBeatDensityPer1000: 5,
    maxFacialExpressionBeatRun: 2,
    maxVagueAtmosphereModifierDensityPer1000: 6,
    maxVagueAtmosphereModifierRun: 3,
    maxEvaluativeModifierDensityPer1000: 6,
    maxEvaluativeModifierRun: 3,
    maxRhetoricalQuestionDensityPer1000: 4,
    maxRhetoricalQuestionRun: 2,
    maxSubtextExplanationDensityPer1000: 4,
    maxSubtextExplanationRun: 2,
    maxAmbiguousReferenceDensityPer1000: 4,
    maxAmbiguousReferenceRun: 2,
    maxSceneTransitionGroundingGapDensityPer1000: 2,
    maxSceneTransitionGroundingGapRun: 1,
    maxTopicMarkerStarterDensityPer1000: 9,
    maxTopicMarkerStarterRun: 4,
    minSentenceLengthVariationCoefficient: 0.28,
    maxUniformSentenceLengthRun: 5,
    maxSameEndingRun: 4,
    maxDominantSentenceEndingShare: 0.68,
    maxDominantDialogueEndingShare: 0.84,
    maxDominantDialogueStarterShare: 0.58,
    minViewpointAnchorDensityPer1000: 2,
    maxShortSentenceRun: 5,
    maxRepeatedSubjectRun: 3,
    maxRepeatedConnectiveStarterRun: 2,
  },
  balanced: {
    maxSensoryDensityPer1000: 24,
    maxEmbodiedReactionDensityPer1000: 8,
    maxBodyReactionSubjectDensityPer1000: 6,
    maxBodyReactionSubjectRun: 2,
    maxClicheEmotionImageDensityPer1000: 4,
    maxClicheEmotionImageRun: 3,
    maxSymbolicAbstractionDensityPer1000: 5,
    maxSymbolicAbstractionRun: 3,
    maxMetaphorDensityPer1000: 6,
    maxSensoryWallpaperRun: 4,
    maxEmotionLabelDensityPer1000: 6,
    maxEmotionLabelRun: 3,
    maxHedgedPerceptionDensityPer1000: 6,
    maxAbstractNounDensityPer1000: 12,
    maxCognitiveFilterDensityPer1000: 6,
    maxTherapySpeakDensityPer1000: 4,
    maxTherapySpeakRun: 2,
    maxBackstoryExpositionDensityPer1000: 5,
    maxBackstoryExpositionRun: 3,
    maxRelationshipMontageSummaryDensityPer1000: 4,
    maxRelationshipMontageSummaryRun: 2,
    maxTimeSkipSummaryDensityPer1000: 4,
    maxTimeSkipSummaryRun: 2,
    maxContrastiveReframeDensityPer1000: 4,
    maxContrastiveReframeRun: 2,
    maxLoreTermDensityPer1000: 10,
    maxLoreTermRun: 3,
    maxSystemStatBlockDensityPer1000: 4,
    maxSystemStatBlockRun: 2,
    maxDeclaredResolveDensityPer1000: 5,
    maxDeclaredResolveRun: 3,
    maxRevelationSummaryDensityPer1000: 4,
    maxRevelationSummaryRun: 2,
    maxProceduralChecklistDensityPer1000: 5,
    maxProceduralChecklistRun: 3,
    maxActionChoreographyDensityPer1000: 6,
    maxActionChoreographyRun: 3,
    maxNominalizedExplanationDensityPer1000: 7,
    maxTranslationeseFormulaDensityPer1000: 4,
    maxConnectiveStarterDensityPer1000: 6,
    maxFillerAdverbDensityPer1000: 5,
    maxFillerAdverbRun: 4,
    maxSimultaneousActionDensityPer1000: 6,
    maxSimultaneousActionRun: 3,
    maxStatusQuoActionDensityPer1000: 6,
    maxStatusQuoActionRun: 4,
    maxPropFidgetBeatDensityPer1000: 5,
    maxPropFidgetBeatRun: 3,
    maxGazeChoreographyDensityPer1000: 6,
    maxGazeChoreographyRun: 3,
    minCausalTurnDensityPer1000: 1,
    maxCommaDensityPer1000: 26,
    maxReportingTailDensityPer1000: 4,
    maxEmphasisPunctuationDensityPer1000: 6,
    maxEmphasisPunctuationRun: 3,
    maxStaticDescriptionDensityPer1000: 10,
    maxGenericTeaserDensityPer1000: 2,
    maxThinCliffhangerEndingCount: 0,
    maxPovMindJumpDensityPer1000: 1.6,
    maxPovMindJumpRun: 1,
    maxExpositoryDialogueRatio: 0.4,
    maxDialogueTurnLength: 170,
    maxAverageDialogueTurnLength: 105,
    maxDialogueGroundingGapRun: 6,
    maxDialogueQuestionRatio: 0.66,
    maxDialogueQuestionRun: 4,
    maxDialogueVocativeRatio: 0.5,
    maxDialogueVocativeRun: 3,
    maxDialogueLexicalEchoRatio: 0.56,
    maxDialogueLexicalEchoRun: 4,
    maxDialogueParaphraseConfirmationRatio: 0.46,
    maxDialogueParaphraseConfirmationRun: 3,
    maxRoteDialogueReplyRatio: 0.5,
    maxRoteDialogueReplyRun: 3,
    maxNeutralDialogueTagRatio: 0.65,
    maxNeutralDialogueTagRun: 4,
    maxSilenceStallDensityPer1000: 4,
    maxSilenceStallRun: 3,
    maxMelodramaticCaptionDensityPer1000: 4,
    maxMelodramaticCaptionRun: 3,
    maxStockReactionBeatDensityPer1000: 8,
    maxStockReactionBeatRun: 3,
    maxFacialExpressionBeatDensityPer1000: 6,
    maxFacialExpressionBeatRun: 3,
    maxVagueAtmosphereModifierDensityPer1000: 8,
    maxVagueAtmosphereModifierRun: 3,
    maxEvaluativeModifierDensityPer1000: 8,
    maxEvaluativeModifierRun: 3,
    maxRhetoricalQuestionDensityPer1000: 6,
    maxRhetoricalQuestionRun: 3,
    maxSubtextExplanationDensityPer1000: 5,
    maxSubtextExplanationRun: 3,
    maxAmbiguousReferenceDensityPer1000: 5,
    maxAmbiguousReferenceRun: 3,
    maxSceneTransitionGroundingGapDensityPer1000: 3,
    maxSceneTransitionGroundingGapRun: 2,
    maxTopicMarkerStarterDensityPer1000: 12,
    maxTopicMarkerStarterRun: 4,
    minSentenceLengthVariationCoefficient: 0.24,
    maxUniformSentenceLengthRun: 6,
    maxSameEndingRun: 4,
    maxDominantSentenceEndingShare: 0.72,
    maxDominantDialogueEndingShare: 0.82,
    maxDominantDialogueStarterShare: 0.62,
    minViewpointAnchorDensityPer1000: 2.5,
    maxShortSentenceRun: 5,
    maxRepeatedSubjectRun: 4,
    maxRepeatedConnectiveStarterRun: 3,
  },
  lyrical: {
    maxSensoryDensityPer1000: 36,
    maxEmbodiedReactionDensityPer1000: 10,
    maxBodyReactionSubjectDensityPer1000: 8,
    maxBodyReactionSubjectRun: 3,
    maxClicheEmotionImageDensityPer1000: 5,
    maxClicheEmotionImageRun: 3,
    maxSymbolicAbstractionDensityPer1000: 8,
    maxSymbolicAbstractionRun: 4,
    maxMetaphorDensityPer1000: 10,
    maxSensoryWallpaperRun: 5,
    maxEmotionLabelDensityPer1000: 7,
    maxEmotionLabelRun: 4,
    maxHedgedPerceptionDensityPer1000: 8,
    maxAbstractNounDensityPer1000: 18,
    maxCognitiveFilterDensityPer1000: 7,
    maxTherapySpeakDensityPer1000: 6,
    maxTherapySpeakRun: 3,
    maxBackstoryExpositionDensityPer1000: 8,
    maxBackstoryExpositionRun: 4,
    maxRelationshipMontageSummaryDensityPer1000: 5,
    maxRelationshipMontageSummaryRun: 3,
    maxTimeSkipSummaryDensityPer1000: 5,
    maxTimeSkipSummaryRun: 3,
    maxContrastiveReframeDensityPer1000: 6,
    maxContrastiveReframeRun: 3,
    maxLoreTermDensityPer1000: 14,
    maxLoreTermRun: 4,
    maxSystemStatBlockDensityPer1000: 3,
    maxSystemStatBlockRun: 2,
    maxDeclaredResolveDensityPer1000: 7,
    maxDeclaredResolveRun: 4,
    maxRevelationSummaryDensityPer1000: 5,
    maxRevelationSummaryRun: 3,
    maxProceduralChecklistDensityPer1000: 6,
    maxProceduralChecklistRun: 3,
    maxActionChoreographyDensityPer1000: 7,
    maxActionChoreographyRun: 4,
    maxNominalizedExplanationDensityPer1000: 9,
    maxTranslationeseFormulaDensityPer1000: 4,
    maxConnectiveStarterDensityPer1000: 7,
    maxFillerAdverbDensityPer1000: 8,
    maxFillerAdverbRun: 5,
    maxSimultaneousActionDensityPer1000: 8,
    maxSimultaneousActionRun: 4,
    maxStatusQuoActionDensityPer1000: 8,
    maxStatusQuoActionRun: 5,
    maxPropFidgetBeatDensityPer1000: 7,
    maxPropFidgetBeatRun: 4,
    maxGazeChoreographyDensityPer1000: 8,
    maxGazeChoreographyRun: 4,
    minCausalTurnDensityPer1000: 0.8,
    maxCommaDensityPer1000: 38,
    maxReportingTailDensityPer1000: 5,
    maxEmphasisPunctuationDensityPer1000: 8,
    maxEmphasisPunctuationRun: 4,
    maxStaticDescriptionDensityPer1000: 12,
    maxGenericTeaserDensityPer1000: 4,
    maxThinCliffhangerEndingCount: 0,
    maxPovMindJumpDensityPer1000: 2.4,
    maxPovMindJumpRun: 2,
    maxExpositoryDialogueRatio: 0.45,
    maxDialogueTurnLength: 220,
    maxAverageDialogueTurnLength: 130,
    maxDialogueGroundingGapRun: 7,
    maxDialogueQuestionRatio: 0.7,
    maxDialogueQuestionRun: 4,
    maxDialogueVocativeRatio: 0.55,
    maxDialogueVocativeRun: 3,
    maxDialogueLexicalEchoRatio: 0.62,
    maxDialogueLexicalEchoRun: 4,
    maxDialogueParaphraseConfirmationRatio: 0.52,
    maxDialogueParaphraseConfirmationRun: 4,
    maxRoteDialogueReplyRatio: 0.55,
    maxRoteDialogueReplyRun: 4,
    maxNeutralDialogueTagRatio: 0.6,
    maxNeutralDialogueTagRun: 4,
    maxSilenceStallDensityPer1000: 5,
    maxSilenceStallRun: 4,
    maxMelodramaticCaptionDensityPer1000: 5,
    maxMelodramaticCaptionRun: 4,
    maxStockReactionBeatDensityPer1000: 10,
    maxStockReactionBeatRun: 4,
    maxFacialExpressionBeatDensityPer1000: 8,
    maxFacialExpressionBeatRun: 4,
    maxVagueAtmosphereModifierDensityPer1000: 14,
    maxVagueAtmosphereModifierRun: 4,
    maxEvaluativeModifierDensityPer1000: 14,
    maxEvaluativeModifierRun: 4,
    maxRhetoricalQuestionDensityPer1000: 8,
    maxRhetoricalQuestionRun: 4,
    maxSubtextExplanationDensityPer1000: 6,
    maxSubtextExplanationRun: 4,
    maxAmbiguousReferenceDensityPer1000: 7,
    maxAmbiguousReferenceRun: 4,
    maxSceneTransitionGroundingGapDensityPer1000: 4,
    maxSceneTransitionGroundingGapRun: 2,
    maxTopicMarkerStarterDensityPer1000: 14,
    maxTopicMarkerStarterRun: 5,
    minSentenceLengthVariationCoefficient: 0.2,
    maxUniformSentenceLengthRun: 7,
    maxSameEndingRun: 4,
    maxDominantSentenceEndingShare: 0.78,
    maxDominantDialogueEndingShare: 0.86,
    maxDominantDialogueStarterShare: 0.68,
    minViewpointAnchorDensityPer1000: 2,
    maxShortSentenceRun: 6,
    maxRepeatedSubjectRun: 5,
    maxRepeatedConnectiveStarterRun: 4,
  },
  'webnovel-fast': {
    maxSensoryDensityPer1000: 14,
    maxEmbodiedReactionDensityPer1000: 10,
    maxBodyReactionSubjectDensityPer1000: 8,
    maxBodyReactionSubjectRun: 3,
    maxClicheEmotionImageDensityPer1000: 4,
    maxClicheEmotionImageRun: 3,
    maxSymbolicAbstractionDensityPer1000: 5,
    maxSymbolicAbstractionRun: 3,
    maxMetaphorDensityPer1000: 3,
    maxSensoryWallpaperRun: 3,
    maxEmotionLabelDensityPer1000: 7,
    maxEmotionLabelRun: 4,
    maxHedgedPerceptionDensityPer1000: 5,
    maxAbstractNounDensityPer1000: 9,
    maxCognitiveFilterDensityPer1000: 7,
    maxTherapySpeakDensityPer1000: 4,
    maxTherapySpeakRun: 2,
    maxBackstoryExpositionDensityPer1000: 4,
    maxBackstoryExpositionRun: 2,
    maxRelationshipMontageSummaryDensityPer1000: 4,
    maxRelationshipMontageSummaryRun: 2,
    maxTimeSkipSummaryDensityPer1000: 6,
    maxTimeSkipSummaryRun: 3,
    maxContrastiveReframeDensityPer1000: 5,
    maxContrastiveReframeRun: 3,
    maxLoreTermDensityPer1000: 12,
    maxLoreTermRun: 3,
    maxSystemStatBlockDensityPer1000: 8,
    maxSystemStatBlockRun: 4,
    maxDeclaredResolveDensityPer1000: 6,
    maxDeclaredResolveRun: 3,
    maxRevelationSummaryDensityPer1000: 4,
    maxRevelationSummaryRun: 2,
    maxProceduralChecklistDensityPer1000: 6,
    maxProceduralChecklistRun: 3,
    maxActionChoreographyDensityPer1000: 8,
    maxActionChoreographyRun: 4,
    maxNominalizedExplanationDensityPer1000: 6,
    maxTranslationeseFormulaDensityPer1000: 4,
    maxConnectiveStarterDensityPer1000: 8,
    maxFillerAdverbDensityPer1000: 6,
    maxFillerAdverbRun: 4,
    maxSimultaneousActionDensityPer1000: 7,
    maxSimultaneousActionRun: 3,
    maxStatusQuoActionDensityPer1000: 5,
    maxStatusQuoActionRun: 3,
    maxPropFidgetBeatDensityPer1000: 7,
    maxPropFidgetBeatRun: 4,
    maxGazeChoreographyDensityPer1000: 7,
    maxGazeChoreographyRun: 4,
    minCausalTurnDensityPer1000: 1.2,
    maxCommaDensityPer1000: 18,
    maxReportingTailDensityPer1000: 4,
    maxEmphasisPunctuationDensityPer1000: 12,
    maxEmphasisPunctuationRun: 5,
    maxStaticDescriptionDensityPer1000: 8,
    maxGenericTeaserDensityPer1000: 4,
    maxThinCliffhangerEndingCount: 0,
    maxPovMindJumpDensityPer1000: 2.2,
    maxPovMindJumpRun: 2,
    maxExpositoryDialogueRatio: 0.45,
    maxDialogueTurnLength: 130,
    maxAverageDialogueTurnLength: 80,
    maxDialogueGroundingGapRun: 8,
    maxDialogueQuestionRatio: 0.72,
    maxDialogueQuestionRun: 5,
    maxDialogueVocativeRatio: 0.58,
    maxDialogueVocativeRun: 4,
    maxDialogueLexicalEchoRatio: 0.64,
    maxDialogueLexicalEchoRun: 5,
    maxDialogueParaphraseConfirmationRatio: 0.56,
    maxDialogueParaphraseConfirmationRun: 4,
    maxRoteDialogueReplyRatio: 0.6,
    maxRoteDialogueReplyRun: 4,
    maxNeutralDialogueTagRatio: 0.75,
    maxNeutralDialogueTagRun: 5,
    maxSilenceStallDensityPer1000: 4,
    maxSilenceStallRun: 3,
    maxMelodramaticCaptionDensityPer1000: 5,
    maxMelodramaticCaptionRun: 4,
    maxStockReactionBeatDensityPer1000: 10,
    maxStockReactionBeatRun: 4,
    maxFacialExpressionBeatDensityPer1000: 8,
    maxFacialExpressionBeatRun: 4,
    maxVagueAtmosphereModifierDensityPer1000: 7,
    maxVagueAtmosphereModifierRun: 3,
    maxEvaluativeModifierDensityPer1000: 8,
    maxEvaluativeModifierRun: 3,
    maxRhetoricalQuestionDensityPer1000: 7,
    maxRhetoricalQuestionRun: 4,
    maxSubtextExplanationDensityPer1000: 5,
    maxSubtextExplanationRun: 3,
    maxAmbiguousReferenceDensityPer1000: 6,
    maxAmbiguousReferenceRun: 3,
    maxSceneTransitionGroundingGapDensityPer1000: 5,
    maxSceneTransitionGroundingGapRun: 3,
    maxTopicMarkerStarterDensityPer1000: 16,
    maxTopicMarkerStarterRun: 5,
    minSentenceLengthVariationCoefficient: 0.2,
    maxUniformSentenceLengthRun: 6,
    maxSameEndingRun: 4,
    maxDominantSentenceEndingShare: 0.82,
    maxDominantDialogueEndingShare: 0.88,
    maxDominantDialogueStarterShare: 0.7,
    minViewpointAnchorDensityPer1000: 3,
    maxShortSentenceRun: 7,
    maxRepeatedSubjectRun: 5,
    maxRepeatedConnectiveStarterRun: 4,
  },
};

const FUNCTIONAL_REPORT_PATTERNS = [
  /감각이\s*(?:왔다|잡혔다|전해졌다)/gu,
  /반응이\s*(?:왔다|잡혔다|일어났다)/gu,
  /변화가\s*(?:있었다|느껴졌다|감지됐다)/gu,
  /기운이\s*(?:느껴졌다|감돌았다)/gu,
  /몸이\s*반응했다/gu,
  /신호가\s*(?:왔다|잡혔다)/gu,
];

const EMBODIED_REACTION_PATTERN =
  /(심장|가슴|숨|손끝|손목|목덜미|등골|피부|눈꺼풀|입술|목구멍)(?:이|가|을|를|에|은|는)?[^.!?\n]{0,18}(?:뛰|죄|떨|말랐|마르|차가|뜨거|얼어|저릿|뻣뻣|조여|막혔|내려앉|가라앉|닿|울렸|굳었)/gu;

const BODY_REACTION_SUBJECT_SENTENCE_PATTERN =
  /^["“”'‘’「」『』\s]*(?:심장|가슴|숨|호흡|손|손끝|손목|손가락|목덜미|등골|피부|눈꺼풀|입술|목구멍|턱|어깨|무릎|발끝|등)(?:이|가|은|는)\s+[^.!?\n]{0,36}(?:뛰|죄|떨|말랐|마르|차가|뜨거|얼어|저릿|저렸|뻣뻣|조여|막혔|내려앉|가라앉|울렸|굳었|풀렸|달아오|식었|끊겼|멎|흔들렸)/u;

const CLICHE_EMOTION_IMAGE_PATTERN =
  /(?:눈물(?:이|은|을|도)?[^.!?\n]{0,18}(?:흘렀|흐르|차올랐|고였|맺혔|떨어졌|번졌)|입가(?:에|에는)?[^.!?\n]{0,18}(?:미소|웃음)|쓴웃음|씁쓸한\s*미소|시간(?:이|은)?\s*(?:멈춘|멈췄|멎은)\s*듯|세상(?:이|은)?\s*(?:무너진|무너졌|끝난|끝났)\s*듯|머릿속(?:이|은)?\s*(?:새하얘졌|하얘졌|하얘졌다)|피(?:가|는)?\s*(?:얼어붙|식었)|숨(?:이|은)?\s*턱\s*막혔|심장(?:이|은)?\s*(?:철렁|쿵)\s*(?:내려앉|떨어졌)|가슴(?:이|은)?\s*(?:찢어질|무너질)\s*듯|칼날처럼\s*(?:날카로운|차가운)\s*(?:침묵|시선|말)|폭풍처럼\s*(?:몰아쳤|휘몰아쳤|덮쳤)|심연\s*같은\s*(?:어둠|침묵|눈동자)|운명의\s*장난|모든\s*것(?:이|은)?\s*끝났)/gu;

const SYMBOLIC_ABSTRACTION_PATTERN =
  /(운명|진실|의미|상징|기억|상처|상실|구원|죄책감|죄|희망|절망|공허|고독|외로움|침묵|어둠|빛|그림자|균열|파국|비극|폭풍|심연|악몽|환상|흔적|존재|관계|욕망|결핍|선택|대가|심판)(?:은|는|이|가|을|를|과|와|의|도|만|처럼|같은)?/gu;

const SYMBOLIC_CONCRETE_ANCHOR_PATTERN =
  /(문|문틈|손잡이|복도|계단|창문|창가|바닥|벽|탁자|책상|의자|컵|잔|봉투|종이|파일|사진|녹음기|휴대폰|화면|지도|가방|열쇠|서랍|주머니|칼|유리|불빛|발소리|빗소리|냄새|피|잉크|주소|번호|단서|알림|문자|전화|시계|카운트다운|로고|손|발|눈|입술|숨)(?:이|가|은|는|을|를|에|에서|으로)?/u;

const SENSORY_PATTERN =
  /(차가운|뜨거운|서늘한|비릿한|달콤한|쓴맛|쇠맛|향|냄새|소리|울림|빛|그림자|색|손끝|촉감|입안|혀끝|귓가|피부|온도|바람|축축|거칠|부드럽|끈적|희미한|번쩍)/gu;

const SENSORY_STORY_TURN_PATTERN =
  /(?:(?:단서|증거|번호|계정명|주소|문자|알림|기록|문서|사진|파일|지도|로고|피|잉크|상처|흉터|얼룩|자국|잠금|비밀번호|시간|날짜|이름|표식|흔적|화면|봉투|종이|영수증|녹음기|열쇠|칼|문틈|손잡이|서랍|휴대폰)[^.!?\n]{0,48}(?:드러났|드러냈|밝혀졌|확인했|확인했다|나타났|사라졌|바뀌었|꺼졌|켜졌|울렸|멎었|새어|묻었|번졌|떨어졌|찢었|열었|닫았|막았|잡았|놓았|밀었|당겼|꺼냈|숨겼)|(?:선택했|결심했|거절했|포기했|확인했|확인했다|찢었|열었|닫았|막았|도망|붙잡|내밀|빼앗|밀어냈|숨겼|꺼냈)[^.!?\n]{0,48}(?:단서|증거|번호|계정명|주소|문자|알림|기록|문서|사진|파일|지도|로고|피|잉크|상처|흉터|얼룩|자국|잠금|비밀번호|시간|날짜|이름|표식|흔적|화면|봉투|종이|영수증|녹음기|열쇠|칼|문틈|손잡이|서랍|휴대폰))/u;

const METAPHOR_PATTERN = /(?:처럼|듯이|듯한|같이|같은|마치|꼭)/gu;

const EMOTION_LABEL_PATTERN =
  /(슬펐다|행복했다|화가\s*났다|두려웠다|무서웠다|외로웠다|고통스러웠다|절망했다|기뻤다|분노했다|불안했다|당황했다|괴로웠다|후회했다)/gu;

const HEDGED_PERCEPTION_PATTERN =
  /(것\s*같(?:았|다|은|아|고)|듯(?:했|했다|한|싶|싶었|싶다)|느껴졌|느껴지|느낌이었다|기분이었다|모양이었다|어쩐지|왠지|묘하게|아마도|어쩌면|분명하지\s*않|희미하게|어렴풋이)/gu;

const ABSTRACT_NOUN_PATTERN =
  /(진실|운명|기억|감정|고통|상처|외로움|가능성|존재|의미|관계|침묵|공포|불안|절망|희망|후회|분노|선택|결심|의지|욕망|혼란|상실|구원|죄책감|위화감|압박감|긴장감|불길함|공허함)(?:은|는|이|가|을|를|과|와|의|도|만|처럼|같은)?/gu;

const COGNITIVE_FILTER_PATTERN =
  /(깨달았|깨닫|알\s*수\s*있었|알았다|알게\s*(?:되었|됐다)|생각했|생각했다|느꼈|느낄\s*수\s*있었|인식했|이해했|짐작했|확신했|떠올렸|기억했|보였다)/gu;

const THERAPY_SPEAK_TERM_PATTERN =
  /(트라우마|애착|불안정\s*애착|회피\s*애착|자존감|인정욕구|방어기제|방어\s*반응|결핍(?:감)?|내면의\s*상처|심리적\s*상처|죄책감|열등감|강박|의존|회피|집착|불안(?:감|장애)?|우울|분리불안|자기혐오|피해의식|통제욕|자기\s*방어|관계\s*불안|버림받을\s*두려움)/gu;

const THERAPY_SPEAK_ANALYSIS_PATTERN =
  /(깨달았|깨닫|알\s*수\s*있었|알았다|알게\s*(?:되었|됐다)|이해했|이해했다|분석했|분석했다|인정했|인정했다|진단했|진단했다|정리됐|정리되었|정리했다|설명됐|설명되었|설명했다|의미했|의미했다|때문이었|때문이었다|문제였|문제였다|원인이었|원인이었다|결과였|결과였다|증명했|증명했다|드러났|드러났다|보였다|보상받으려|회피하려|의존하려|집착했|집착하는|방어했|방어하는)/u;

const BACKSTORY_TIME_CUE_PATTERN =
  /(?:어릴\s*때|어렸을\s*때|어린\s*시절|학창\s*시절|그때부터|그날\s*이후|그\s*사건\s*이후|몇\s*년\s*전|십\s*년\s*전|\d+\s*년\s*전|오래전|과거(?:에는|의)?|예전(?:에는|의)?|이전(?:에는)?|한때|처음(?:으로)?|지난\s*\d+\s*년|그\s*시절|그날의|그때의)/u;

const BACKSTORY_EXPLANATION_PATTERN =
  /(?:이었다|였다|해\s*왔|되어\s*있었|알고\s*있었|믿어\s*왔|기억했|기억했다|떠올렸|회상했|되었다|됐다|시작됐|시작되었|끝났|남았|이어졌|때문이었|때문이었다|이유였|이유였다|결과였|결과였다|상처였|상처였다|비밀이었|비밀이었다|바꾸어\s*놓았|만들어\s*놓았|설명했|설명했다)/u;

const BACKSTORY_HISTORY_ABSTRACT_PATTERN =
  /(?:가족|부모|아버지|어머니|형제|친구|연인|관계|사고|사건|약속|상처|비밀|기억|과거|시절|인생|운명|트라우마|결핍|이력|내력|전쟁|왕국|가문|조직|학교|마을|도시|세계)(?:은|는|이|가|을|를|과|와|의|도|만)?/u;

const RELATIONSHIP_MONTAGE_TIME_CUE_PATTERN =
  /(시간(?:이|은)?\s*흘렀|며칠(?:이|은|만에|동안|사이|째)?|몇\s*(?:날|일|주|달)(?:이|은|만에|동안|사이|째)?|그동안|어느새|하루하루|날(?:이|은)?\s*지나|계절(?:이|은)?\s*바뀌|밤(?:이|은)?\s*지나|이후로|그\s*후로|사흘|나흘|일주일|한\s*달)/u;

const RELATIONSHIP_MONTAGE_SUMMARY_MARKER_PATTERN =
  /(점점|조금씩|서서히|어느새|결국|그렇게|차츰|나날이|어느\s*순간|자연스럽게|조용히|천천히|이제는)/u;

const RELATIONSHIP_DEVELOPMENT_SUBJECT_PATTERN =
  /(두\s*사람|둘|서로|관계|사이|거리|마음|감정|정|신뢰|오해|상처|유대|친밀|사랑|우정|애정|호감|믿음|의심|경계|분노|미움|그(?:들|녀|남)?(?:의)?\s*마음)/u;

const RELATIONSHIP_DEVELOPMENT_CHANGE_PATTERN =
  /(깊어졌|깊어지|가까워졌|가까워지|멀어졌|멀어지|변했|변하|달라졌|달라지|쌓였|쌓이|풀렸|풀리|풀려|회복됐|회복되|이해하게\s*되|알게\s*되|믿게\s*되|의지하게\s*되|익숙해졌|익숙해지|소중해졌|소중해지|특별(?:한)?\s*(?:존재|사람|의미)|커져\s*갔|자라났|사라졌|사라지|누그러졌|누그러지|허물어졌|허물어지|열리기\s*시작)/u;

const RELATIONSHIP_GROUNDED_ACTION_PATTERN =
  /(봉투|사진|녹음기|휴대폰|화면|문자|전화|번호|기록|열쇠|문|손잡이|컵|잔|서랍|주머니|피|상처|계약|편지|메시지|신고|고백|거절|사과|약속|조건|대가|선택|책임|증거|단서|잡았|놓았|밀었|당겼|꺼냈|건넸|받았|찢었|숨겼|확인했|드러났|밝혔|닫았|열었|막았|도망쳤|붙잡았|물러났|돌아섰|서명했|돌려줬)/u;

const TIME_SKIP_SUMMARY_TIME_CUE_PATTERN =
  /(?:시간(?:이|은)?\s*(?:흘렀|지났)|(?:며칠|몇\s*(?:분|시간|일|날|주|달)|사흘|나흘|일주일|한\s*달)(?:이|은|만에|동안|사이|째|\s*뒤|\s*후)?|다음\s*날|이튿날|그\s*후|이후|그동안|얼마\s*후|잠시\s*후|어느새|밤(?:이|은)?\s*지나|아침(?:이|은)?\s*되|계절(?:이|은)?\s*바뀌)/u;

const TIME_SKIP_SUMMARY_CHANGE_PATTERN =
  /(?:준비(?:는|가|를)?\s*(?:끝났|마쳤|완료됐|완료되었|갖춰졌)|계획(?:은|이|을)?\s*(?:완성됐|완성되었|정리됐|정리되었|세워졌)|조사(?:는|가|를)?\s*(?:끝났|마무리됐|정리됐|진행됐)|회의(?:는|가)?\s*(?:끝났|마무리됐)|훈련(?:은|이)?\s*(?:끝났|이어졌|계속됐|진행됐)|상황(?:은|이)?\s*(?:달라졌|정리됐|바뀌었|변했|흘러갔|진행됐)|일(?:은|이)?\s*(?:빠르게\s*)?(?:진행됐|정리됐|마무리됐|흘러갔)|모든\s*(?:준비|절차|일|것)(?:이|은)?\s*(?:끝났|갖춰졌|완료됐|정리됐)|필요한\s*(?:것|준비|절차)(?:은|이)?\s*(?:모두\s*)?(?:갖춰졌|끝났)|남은\s*것(?:은|이)?[^.!?\n]{0,20}(?:뿐|이었다)|각자\s*(?:움직였|흩어졌|준비했)|그렇게\s*[^.!?\n]{0,32}(?:지나갔|흘러갔|끝났다))/u;

const TIME_SKIP_SUMMARY_STATUS_PATTERN =
  /(?:준비|계획|조사|회의|훈련|상황|절차|일|모든\s*것|필요한\s*것|남은\s*것|각자|그렇게)/u;

const TIME_SKIP_SUMMARY_GROUNDED_PATTERN =
  /(?:(?:봉투|사진|녹음기|파일|기록|문자|전화|신고서|계약서|지도|열쇠|상처|피|문|통제선|주소|좌표|CCTV|영수증|카드|비밀번호|기한|카운트다운|계단|복도|현장)[^.!?\n]{0,56}(?:건넸|받았|찢었|숨겼|확인했|서명했|신고했|잠겼|열렸|닫혔|막혔|잃었|다쳤|빼앗겼|바뀌었|사라졌|나타났|남았|도착했)|(?:건넸|받았|찢었|숨겼|확인했|서명했|신고했|잠겼|열렸|닫혔|막혔|잃었|다쳤|빼앗겼|포기했|거절했|선택했|달아났|도착했)[^.!?\n]{0,56}(?:봉투|사진|녹음기|파일|기록|문자|전화|신고서|계약서|지도|열쇠|상처|피|문|통제선|주소|좌표|기한|카운트다운|계단|복도|현장))/u;

const CONTRASTIVE_REFRAME_INLINE_PATTERN =
  /(?:그것|그건|이건|이는|문제|핵심|진짜|진실|답|의미|목적|중요한\s*(?:것|건)|남은\s*(?:것|건)|필요한\s*(?:것|건)|두려운\s*(?:것|건)|무서운\s*(?:것|건)|승리|패배|끝|시작|경고|약속|명령|선택|대가)[^.!?\n]{0,42}(?:아니었다|아니었고|아니다|아니고|아닌|아니라)[^.!?\n]{1,58}(?:이었다|였다|다)/u;

const CONTRASTIVE_REFRAME_SETUP_PATTERN =
  /(?:그것|그건|이건|이는|문제|핵심|진짜|진실|답|의미|목적|중요한\s*(?:것|건)|남은\s*(?:것|건)|필요한\s*(?:것|건)|두려운\s*(?:것|건)|무서운\s*(?:것|건)|승리|패배|끝|시작|경고|약속|명령|선택|대가)?[^.!?\n]{0,48}(?:아니었다|아니었고|아니다|아니고|아닌|아니라)$/u;

const CONTRASTIVE_REFRAME_PAYOFF_PATTERN =
  /^(?:["“”'‘’「」『』\s]*(?:그것은|그건|이건|이는|결국|진짜는|핵심은|문제는|답은)?\s*)?(?:공포|두려움|분노|슬픔|절망|희망|침묵|빛|어둠|상처|균열|진실|답|증거|단서|표식|신호|통보|선언|판결|폭로|거짓말|함정|실수|실패|패배|승리|유예|시작|끝|복수|구원|처벌|기회|명령|경고|고백|거절|선택|대가|약속|위협|압박|질문|결론)(?:이었다|였다|다)\.?$/u;

const CONTRASTIVE_REFRAME_GROUNDED_PATTERN =
  /(?:봉투|사진|녹음기|파일|기록|문자|전화|신고서|계약서|지도|열쇠|상처|피|문|손잡이|통제선|주소|좌표|CCTV|영수증|카드|비밀번호|기한|카운트다운|계단|복도|현장|칼|총|서명|신고|건넸|받았|찢었|숨겼|확인했|잠겼|열렸|닫혔|막혔|잃었|다쳤|빼앗겼|포기했|거절했|선택했|달아났|도착했|돌아섰|밀었|당겼|꺼냈|내밀었)/u;

const LORE_TERM_PATTERN =
  /(?:[가-힣A-Za-z0-9]{2,18}\s*)?(?:왕국|제국|공국|연맹|동맹|교단|성단|마탑|학파|길드|가문|혈족|문파|종족|차원|게이트|던전|성역|결계|마법|마력|마나|스킬|랭크|코어|룬|성물|유물|예언|계약|의식|성검|왕좌|기사단|수호단|관리국|재단|협회|위원회|아카데미|프로토콜|엔진|시스템|연구소|프로젝트|식민지|행성|함대|제국군|황실|원로원|계급)(?=[은는이가을를과와의도만에서으로로,.\s]|$)/gu;

const LORE_EXPOSITION_PATTERN =
  /(?:라\s*불렸|라고\s*불렸|라는\s*(?:이름|뜻|규칙|전설|예언|계약|의식|시스템)|라\s*한다|라고\s*전해졌|전해졌|기록됐|기록되었|관장했|지배했|세워졌|봉인됐|계승했|관리했|금지했|창조했|기원했|분류됐|분류되었|속해\s*있었|소속됐|규정했|원리였|원리였다|체계였|체계였다|법칙이었|법칙이었다|등급이었다|등급으로)/u;

const LORE_GROUNDED_ACTION_PATTERN =
  /(?:문|문틈|손잡이|복도|계단|창문|바닥|벽|탁자|책상|의자|컵|잔|봉투|종이|파일|사진|녹음기|휴대폰|전화|문자|메시지|화면|알림|기록|지도|가방|열쇠|서랍|주머니|칼|유리|불빛|발소리|냄새|피|잉크|주소|번호|이름|단서|증거|카드|비밀번호|시계|상처|흉터|얼룩|잡았|놓았|밀었|당겼|열었|닫았|찢었|접었|꺼냈|내밀었|건넸|받았|숨겼|확인했|읽었|찍었|보냈|눌렀|멈췄|도망쳤|붙잡았|거절했|선택했|포기했|서명했)/u;

const SYSTEM_STAT_TERM_PATTERN =
  /(?:상태창|시스템|알림|스탯|능력치|레벨|Lv\.?|경험치|EXP|HP|MP|스킬|특성|칭호|등급|랭크|보상|퀘스트|미션|업적|포인트|힘|민첩|지능|체력|정신력|마력|방어력|공격력|숙련도|내구도)(?=[은는이가을를과와의도만에서으로로:：,\s.\]\[]|$)/giu;

const SYSTEM_STAT_NUMERIC_PATTERN =
  /(?:(?:레벨|Lv\.?|경험치|EXP|HP|MP|스탯|능력치|힘|민첩|지능|체력|정신력|마력|방어력|공격력|포인트|숙련도|내구도|등급|랭크|스킬|보상)[^.!?\n]{0,24}(?:Lv\.?\s*)?[+\-]?\d+(?:\.\d+)?%?|[+\-]?\d+(?:\.\d+)?%?[^.!?\n]{0,18}(?:레벨|Lv\.?|경험치|EXP|HP|MP|스탯|포인트|등급|랭크))/iu;

const SYSTEM_STAT_NOTIFICATION_PATTERN =
  /(?:상태창|시스템|알림|퀘스트|미션|보상|스킬|칭호|업적)[^.!?\n]{0,50}(?:떴|떠올랐|나타났|갱신|지급|획득|상승|하락|증가|감소|해금|부여|완료|생성|도착|적용|회복|소모|차감|올랐|내렸)/u;

const SYSTEM_STAT_UI_BRACKET_PATTERN =
  /\[(?:시스템|상태창|알림|퀘스트|미션|보상|스킬|칭호|업적)[^\]]{0,80}\]/u;

const SYSTEM_STAT_TURN_PATTERN =
  /(?:하지만|그러나|그러자|그제야|대신|때문|탓에|바람에|대가|위험|부작용|소모|깎|잃|줄었|줄어|늘었|떨어졌|떨어지|낮아졌|높아졌|닫혔|열렸|막혔|꺼졌|잠겼|갇혔|부서|무너|쓰러|피(?:가|를|는|도)?|상처|비명|목표|선택|포기|거절|추격|도망|인질|퇴로|시간|카운트다운|위치|문이|벽이|계단|경보|감췄|놓쳤|구했|조건)/u;

const DECLARED_RESOLVE_PATTERN =
  /(?:결심(?:했|했다|하[고겠]|을\s*(?:굳혔|세웠)|이\s*섰)|다짐(?:했|했다|하[고겠]|을\s*(?:되새겼|굳혔|세웠))|각오(?:했|했다|하[고겠]|를\s*(?:다졌|굳혔|세웠)|가\s*섰)|마음\s*먹(?:었|었다|고|기로)|정했|정했다|결정했|결정했다|포기하지\s*않기로\s*했|물러서지\s*않기로\s*했|도망치지\s*않기로\s*했|외면하지\s*않기로\s*했|피하지\s*않기로\s*했|버티기로\s*했|끝까지\s*(?:가|가기로|해내|해내기로|버티)|반드시[^.!?\n]{0,24}(?:해야|해내|찾아|막아|구해|밝혀|끝내)|(?:해야|해내야|찾아야|막아야|구해야|밝혀야|끝내야)\s*했|할\s*수밖에\s*없었|물러설\s*수\s*없(?:었|다는|다고)?|피할\s*수\s*없(?:었|다는|다고)?|멈출\s*수\s*없(?:었|다는|다고)?|도망칠\s*수\s*없(?:었|다는|다고)?|포기할\s*수\s*없(?:었|다는|다고)?|이제[^.!?\n]{0,24}(?:해야\s*할|끝낼|나아갈|맞서야\s*할)|더\s*이상[^.!?\n]{0,24}(?:물러설|피할|외면할|망설일)\s*수\s*없)/u;

const DECLARED_RESOLVE_GROUNDED_PATTERN =
  /(?:문|문틈|손잡이|복도|계단|창문|바닥|벽|탁자|책상|의자|컵|잔|봉투|종이|파일|사진|녹음기|휴대폰|전화|문자|메시지|화면|알림|기록|지도|가방|열쇠|서랍|주머니|칼|총|유리|불빛|발소리|냄새|피|잉크|주소|번호|이름|단서|증거|카드|비밀번호|시계|상처|흉터|얼룩|계약서|사직서|신고서|고소장|신분증|잡았|놓았|밀었|당겼|열었|닫았|찢었|접었|꺼냈|내밀었|건넸|받았|숨겼|확인했|읽었|찍었|보냈|눌렀|멈췄|도망쳤|붙잡았|거절했|선택했|포기했|서명했|신고했|전화했|문자를\s*보냈|주소를\s*찍었|번호를\s*눌렀|문을\s*열었|밖으로\s*나갔|계단을\s*내려갔|차에\s*올랐|현장으로\s*향했|대가|조건|위험|벌금|퇴학|해고|체포|추적|부상|폭로)/u;

const REVELATION_SUMMARY_PATTERN =
  /(?:(?:그제야|이제야|마침내|결국|순간|그\s*순간)[^.!?\n]{0,28}(?:깨달|알아차|이해|확신|눈치챘|드러났|밝혀졌|풀렸)|(?:모든|흩어진|남은|앞선|지난)[^.!?\n]{0,24}(?:단서|의문|조각|퍼즐|정황|증거)[^.!?\n]{0,32}(?:이어|맞물|가리키|설명|풀렸|분명|명확|드러났)|(?:단서|증거|기록|번호|로그|파일|알리바이|정황|퍼즐|조각)[^.!?\n]{0,36}(?:하나로\s*이어|맞물|가리키|설명|풀렸|완성|말해\s*주)|(?:진실|정체|배후|답|해답|범인|실체|결론|의미)[^.!?\n]{0,24}(?:분명|명확|드러났|밝혀졌|정해져|가리키고|하나였|단순했)|(?:의문|수수께끼|미스터리|오해)[^.!?\n]{0,20}(?:풀렸|사라졌|해소됐)|(?:답은|진실은|범인은|배후는|정체는)[^.!?\n]{0,28}(?:이었다|였다|명확했다|분명했다))/u;

const REVELATION_SUMMARY_GROUNDED_PATTERN =
  /(?:봉투|종이|파일|사진|녹음기|휴대폰|전화|문자|메시지|화면|알림|기록|로그|지도|열쇠|서랍|주머니|칼|총|유리|피|혈흔|지문|잉크|주소|번호|이름|카드|비밀번호|시계|알리바이|CCTV|카메라|영수증|계좌|도장|문양|로고|서명|신고서|신분증|쪽지|녹취|통화|좌표|위치|시간표|출입\s*기록|사망\s*시각|비교했|대조했|확인했|확인하자|읽었|꺼냈|펼쳤|찢었|접었|찍었|눌렀|적었|동그라미|밑줄|맞춰\s*봤|겹쳐\s*봤|되감았|재생했|검색했|스캔했|추적했|잠금|문을\s*열었|신고했|전화를\s*걸었|문자를\s*보냈|주소를\s*찍었|번호를\s*눌렀|현장으로\s*향했|체포|고발|폭로|대가|위험|조건)/u;

const PROCEDURAL_CHECKLIST_PATTERN =
  /(?:(?:파일|기록|로그|번호|사진|CCTV|카메라|영상|통화\s*기록|메시지|주소|좌표|알리바이|진술|증거|단서|보고서|목록|자료|데이터|검색\s*결과|화면|서류|계좌|영수증|신고서|녹취|출입\s*기록|사망\s*시각)[^.!?\n]{0,40}(?:확인(?:했|했다|하자|하고|하다가)|검토(?:했|했다)|대조(?:했|했다|하자)|검색(?:했|했다)|조회(?:했|했다)|분석(?:했|했다)|정리(?:했|했다|됐|되었)|분류(?:했|했다|됐|되었)|기록(?:했|했다|됐|되었)|추가(?:했|했다|됐|되었)|살폈|열었|열었다|읽었|읽었다|스캔(?:했|했다)|추적(?:했|했다)|비교(?:했|했다)|맞춰\s*(?:봤|보자)|되감았|되감았다)|(?:확인(?:했|했다|하자|하고|하다가)|검토(?:했|했다)|대조(?:했|했다|하자)|검색(?:했|했다)|조회(?:했|했다)|분석(?:했|했다)|정리(?:했|했다|됐|되었)|분류(?:했|했다|됐|되었)|기록(?:했|했다|됐|되었)|추가(?:했|했다|됐|되었)|살폈|열었|열었다|읽었|읽었다|스캔(?:했|했다)|추적(?:했|했다)|비교(?:했|했다)|맞춰\s*(?:봤|보자)|되감았|되감았다)[^.!?\n]{0,40}(?:파일|기록|로그|번호|사진|CCTV|카메라|영상|통화\s*기록|메시지|주소|좌표|알리바이|진술|증거|단서|보고서|목록|자료|데이터|검색\s*결과|화면|서류|계좌|영수증|신고서|녹취|출입\s*기록|사망\s*시각))/u;

const PROCEDURAL_CHECKLIST_TURN_PATTERN =
  /(?:하지만|그러나|그러자|그제야|대신|때문|탓에|바람에|비어\s*있|누락|빠져\s*있|불일치|맞지\s*않|틀렸|거짓|거짓말|무너졌|깨졌|바뀌었|달라졌|닫혔|열렸|사라졌|나타났|드러났|밝혀졌|발견|용의자|알리바이|범인|배후|함정|협박|위험|대가|신고|체포|도주|추적|전화를\s*걸|문자를\s*보냈|현장으로\s*향|순서를\s*바꾸|계획을\s*바꾸|이름을\s*적었|멈췄|멈추었|확인하자|대조하자|맞춰\s*보자)/u;

const ACTION_CHOREOGRAPHY_PATTERN =
  /(?:(?:검|칼|창|도끼|단검|권총|총|총구|방아쇠|탄환|화살|활|방패|주먹|팔꿈치|무릎|발차기|발끝|검기|마법|주문|칼날|날붙이|몽둥이|쇠파이프|적|상대|괴물|추격자)[^.!?\n]{0,42}(?:휘둘렀|휘둘렀다|베었|베었다|찔렀|찔렀다|내리쳤|내리쳤다|후려쳤|후려쳤다|때렸|때렸다|걷어찼|걷어찼다|날렸|날렸다|쏘았|쐈|쐈다|당겼|당겼다|막았|막았다|받아냈|받아냈다|피했|피했다|비켜섰|비켜섰다|굴렀|굴렀다|뛰어들었|뛰어들었다|달려들었|달려들었다|돌진했|돌진했다|물러섰|물러섰다|붙잡았|붙잡았다)|(?:휘둘렀|휘둘렀다|베었|베었다|찔렀|찔렀다|내리쳤|내리쳤다|후려쳤|후려쳤다|때렸|때렸다|걷어찼|걷어찼다|날렸|날렸다|쏘았|쐈|쐈다|당겼|당겼다|막았|막았다|받아냈|받아냈다|피했|피했다|비켜섰|비켜섰다|굴렀|굴렀다|뛰어들었|뛰어들었다|달려들었|달려들었다|돌진했|돌진했다|물러섰|물러섰다|붙잡았|붙잡았다)[^.!?\n]{0,42}(?:검|칼|창|도끼|단검|권총|총|총구|방아쇠|탄환|화살|활|방패|주먹|팔꿈치|무릎|발차기|발끝|검기|마법|주문|칼날|날붙이|몽둥이|쇠파이프|적|상대|괴물|추격자))/u;

const ACTION_CHOREOGRAPHY_TURN_PATTERN =
  /(?:하지만|그러나|그러자|그제야|대신|때문|탓에|바람에|비틀|넘어졌|넘어졌다|쓰러졌|쓰러졌다|무너졌|무너졌다|꺾였|꺾였다|부러졌|부러졌다|찢겼|찢겼다|갈라졌|갈라졌다|깨졌|깨졌다|막혔|막혔다|닫혔|닫혔다|열렸|열렸다|놓쳤|놓쳤다|떨어졌|떨어졌다|빼앗겼|빼앗았다|잃었|잃었다|얻었|얻었다|잡혔|잡혔다|붙잡혔|붙잡혔다|제압|도망|탈출|구했|구했다|구출|인질|퇴로|통로|계단|문이|벽이|유리|경보|폭발|불길|연기|피(?:가|를|는|도)?|혈흔|상처|부상|비명|무릎|갈비뼈|손목|어깨|다리|팔|숨이\s*(?:막|끊|차)|거리가\s*(?:좁|벌)|위치가\s*바뀌|전세|목표|시간|카운트다운|대가|위험)/u;

const NOMINALIZED_EXPLANATION_PATTERN =
  /(것(?:이었다|이다|뿐이었다|처럼|은|이|을|으로|도|만)|수\s*(?:있|없)(?:었)?다|상태였다|문제였다|의미였다|셈이었다)/gu;

const TRANSLATIONESE_FORMULA_PATTERN =
  /(?:에\s*(?:의해|의하여|관하여|대하여|있어서)|로\s*인(?:해|하여)|[을를]\s*가지고\s*(?:있|있었)|[을를]\s*위해(?:서)?|하지\s*않으면\s*안\s*(?:됐|되)|(?:요구|확인|이해|예상|판단|감지)되(?:었|었|는|고|었다)|되어지)/gu;

const CONNECTIVE_STARTER_PATTERN =
  /^["“”'‘’「」『』\s]*(그리고|하지만|그러나|그런데|그래서|그러자|그러면서|그\s*순간|그때|이제|결국|다시|곧|이어|마침내)(?:\s|,|\.|$)/u;

const FILLER_ADVERB_CADENCE_PATTERN =
  /(?:가만히|천천히|조용히|낮게|작게|살짝|잠시|한참|오래|그대로|다시|곧|문득|끝내|결국|그저|괜히|괜스레|어느새|아직도|이미|바로|느릿하게|희미하게|담담히|차분히|분명히|확실히|어색하게|조심스럽게|느리게|빠르게|급히|서둘러|고요히|멀거니|멍하니|말없이|소리\s*없이|아무\s*말\s*없이|아무렇지\s*않게)(?=\s|[,.!?]|$)/gu;

const SIMULTANEOUS_ACTION_CADENCE_PATTERN =
  /(?:[가-힣](?<![이라])(?:으?며|으?면서)|[가-힣]{1,12}(?:은|는|인|한|던|린|킨|진|긴|쥔|켠)\s*채)(?=\s|[,.!?。！？]|$)/gu;

const STATUS_QUO_ACTION_PATTERN =
  /(?:바라보았|바라봤|쳐다보았|쳐다봤|내려다보았|올려다보았|고개를\s*(?:돌렸|숙였|들었|끄덕였|저었)|시선을\s*(?:돌렸|내렸|피했|옮겼)|손(?:가락)?(?:을|이|은|는)?\s*(?:얹었|올렸|내렸|잡았|놓았|쥐었|폈|움켜쥐었)|손잡이(?:를|가)?\s*(?:잡았|놓았|돌렸)|문(?:\s*앞|가)?에\s*(?:섰|멈췄)|자리에\s*(?:앉았|섰)|컵(?:을|이)?\s*(?:내려놓았|놓았|잡았|밀었)|봉투(?:를|가)?\s*(?:바라보았|접었|만졌|눌렀)|대답을\s*기다렸|기다렸|멈춰\s*섰|서\s*있었|가만히\s*있었|그대로\s*있었)/u;

const PROP_FIDGET_BEAT_PATTERN =
  /(?:컵|잔|머그잔|봉투|종이|서류|사진|휴대폰|핸드폰|전화기|화면|녹음기|열쇠|가방|지갑|카드|펜|노트|의자|문고리|손잡이|서랍|시계|반지|담배|라이터)(?:을|를|은|는|이|가|에)?[^.!?\n]{0,28}(?:만졌|만지|쥐었|쥐|잡았|잡|놓았|놓|내려놓|밀었|밀|당겼|당기|돌렸|돌리|접었|접|펼쳤|펼치|눌렀|누르|두드렸|두드리|문질렀|문지르|굴렸|굴리|흔들었|흔들|집었|집어|매만졌|매만지)/u;

const PROP_FIDGET_GROUNDED_PATTERN =
  /(?:단서|증거|번호|주소|문자|메시지|알림|녹음|파일|피|잉크|얼룩|자국|금이|깨졌|쏟아졌|흘러|울렸|켜졌|꺼졌|잠겼|비밀번호|고백|거절|협박|조건|대가|내밀|건넸|빼앗|숨겼|발견|확인|드러났|나타났|사라졌|떨어졌|찢어졌|봉인이|잠금이|이름이|로고가)/u;

const GAZE_CHOREOGRAPHY_PATTERN =
  /(?:(?:시선|눈길|눈빛|눈동자)(?:이|가|은|는|을|를)?[^.!?\n]{0,28}(?:피했|피하|돌렸|돌리|내렸|내리|떨궜|떨어졌|옮겼|옮기|마주쳤|마주치|맞췄|맞추|고정됐|고정했|흔들렸|흔들리|머물렀|머물|얽혔|얽히|부딪혔|부딪히|붙잡았|붙잡)|눈(?:을|이|은|는)?[^.!?\n]{0,20}(?:깜빡|감았|감기|떴|뜨|마주쳤|마주치|피했|피하|흔들렸|흔들리|커졌|커지)|고개(?:를|가|는|은)?[^.!?\n]{0,18}(?:돌렸|돌리|숙였|숙이|들었|들어|끄덕였|끄덕이|저었|젓|기울였|기울이)|(?:바라보았|바라봤|쳐다보았|쳐다봤|올려다보았|올려다봤|내려다보았|내려다봤|마주보았|마주봤|응시했|응시하|노려보았|노려봤))/u;

const GAZE_GROUNDED_DETAIL_PATTERN =
  /(?:단서|증거|번호|계정명|주소|문자|알림|기록|문서|사진|파일|지도|로고|피|잉크|상처|흉터|얼룩|자국|잠금|비밀번호|시간|날짜|이름|표식|흔적|화면|봉투|종이|영수증|녹음기|열쇠|칼|문틈|손잡이|서랍|컵\s*받침|휴대폰)/u;

const CAUSAL_TURN_PATTERN =
  /(?:그래서|때문|탓에|바람에|그러자|그러면서|하지만|그러나|대신|결국|마침내|그제야|바뀌었|달라졌|드러났|밝혀졌|알아냈|확인했|발견했|깨달았|선택했|결심했|거절했|포기했|내밀었|빼앗|밀어냈|닫았|열었|도망|붙잡|막았|막혀|잃었|얻었|위험|단서|증거|대가|조건|요구|협박|거짓말|고백|폭로|실패|성공|무너졌|깨졌|끊겼|꺼졌|흘러나왔|나타났|사라졌|사건\s*번호|새\s*이름|새\s*주소)/u;

const COMMA_PATTERN = /,/gu;

const REPORTING_TAIL_PATTERN =
  /(?:(?:사실|점|내용|의미|상황|결론|흐름|분위기)(?:이|가|은|을|를|로)?\s*(?:보였|보인다|드러났|드러난다|확인됐|확인되었|확인된다|정리됐|정리되었|정리된다|남았|남는다|이어졌|이어진다)|(?:다는|라는)\s*(?:사실|점|내용|의미)(?:이|가|은|을|를)?\s*(?:보였|보인다|드러났|드러난다|확인됐|확인되었|확인된다|남았|남는다)|(?:보였고|보였다|드러났고|드러났다|확인됐고|확인됐다|정리됐고|정리됐다)(?:는)?\s*(?:사실|점|내용|의미))/gu;

const OFFSCREEN_RESOLUTION_SUMMARY_PATTERN =
  /(?:그\s*후|이후|나중에|잠시\s*뒤|얼마\s*뒤|몇\s*(?:분|시간|일|날)\s*뒤|며칠\s*뒤|다음\s*날|이튿날|밤이\s*지나고|아침이\s*되자|조사\s*끝에|확인\s*결과|기록을\s*대조한\s*끝에|결국|마침내)[^.!?。！？\n]{0,80}(?:밝혀졌|드러났|확인됐|확인되었|알게\s*(?:됐|되었)|해결됐|해결되었|정리됐|정리되었|판명됐|판명되었|잡혔|체포됐|체포되었|구했|구출됐|구출되었|되찾았|막았|성공했|끝났)/gu;

const EMPHASIS_PUNCTUATION_PATTERN = /(?:!+|[!?]{2,}|…+|\.{3,})/gu;

const STATIC_DESCRIPTION_PATTERN =
  /(?:(?:놓여|걸려|세워져|쌓여|널려|흩어져|펼쳐져|드리워져|이어져|닫혀|열려|켜져|꺼져|남아|정리되어|비어|차\s*있|가득해)\s*있었다|있었다|없었다|보였다)/gu;

const GENERIC_OMNISCIENT_TEASER_PATTERN =
  /(?:(?:그것|이것|그날|그때|그\s*순간|그\s*선택|그\s*한마디|그\s*침묵)(?:이|가|은|는)?[^.!?\n]{0,28}(?:모든\s*)?(?:시작|예고|전조)(?:이었|였다|이었다|에\s*불과했)|(?:아직|그때(?:까지)?|그는|그녀는|두\s*사람은)[^.!?\n]{0,28}(?:알지\s*못했|몰랐)[^.!?\n]{0,48}(?:시작|예고|운명|되돌릴\s*수\s*없|돌이킬\s*수\s*없|파국|비극)|(?:아직|그때(?:까지)?|그는|그녀는|두\s*사람은)[^.!?\n]{0,48}(?:시작|예고|운명|되돌릴\s*수\s*없|돌이킬\s*수\s*없|파국|비극)[^.!?\n]{0,32}(?:알지\s*못했|몰랐)|(?:알지\s*못했|몰랐)[.!?]\s*(?:그것|이것|그\s*선택|그\s*한마디|그\s*침묵)[^.!?\n]{0,32}(?:시작|예고|운명|파국|비극)|(?:운명|비극|파국|폭풍|균열)(?:은|는)?[^.!?\n]{0,24}(?:조용히|이미|천천히)?[^.!?\n]{0,24}(?:움직이고\s*있었|시작되고\s*있었|다가오고\s*있었|문을\s*열고\s*있었))/gu;

const THIN_CLIFFHANGER_SIGNAL_PATTERN =
  /(?:(?:아직|그때(?:까지)?|그는|그녀는|두\s*사람은)[^.!?。！？\n]{0,40}(?:알지\s*못했|몰랐)|(?:진짜|진정한|더\s*큰)\s*(?:문제|비밀|진실|위험|악몽)|(?:모든\s*것|그것|이것|그\s*선택|그\s*침묵)(?:은|는|이|가)?[^.!?。！？\n]{0,32}(?:시작|끝|예고|전조|신호)|(?:이제|지금부터)\s*(?:시작|진짜\s*시작)|(?:끝(?:이|은)?\s*아니|끝나지\s*않)|(?:다가올|새로운|돌이킬\s*수\s*없는)\s*(?:비극|파국|재앙|운명|위험)|(?:상상(?:도)?|짐작(?:도)?)[^.!?。！？\n]{0,24}(?:못했|못할)|(?:문제는|하지만|그러나|다만)[^.!?。！？\n]{0,48}(?:남아\s*있었|시작(?:됐|되었|이었다)|기다리고\s*있었|다가오고\s*있었)|\?)/gu;

const ENDING_CONCRETE_TRIGGER_PATTERN =
  /(?:문|문틈|손잡이|복도|계단|엘리베이터|창문|바닥|벽|탁자|책상|의자|컵|봉투|종이|파일|사진|녹음기|휴대폰|전화|문자|메시지|화면|알림|기록|지도|가방|열쇠|서랍|주머니|칼|총|유리|불빛|그림자|발소리|노크|빗소리|피|잉크|주소|번호|이름|단서|증거|카드|비밀번호|시계|카운트다운|경보|사이렌|상처|흉터|얼룩|\d)/u;

const ENDING_TRIGGER_ACTION_PATTERN =
  /(?:열렸|열었다|닫혔|닫았다|울렸|울었다|떨어졌|떨어졌다|깨졌|깨졌다|흘렀|흘렀다|멎었|멎었다|꺼졌|꺼졌다|켜졌|켜졌다|나타났|나타났다|사라졌|사라졌다|잡았|잡았다|놓았|놓았다|밀었|밀었다|당겼|당겼다|찢었|찢었다|접었|접었다|돌렸|돌렸다|눌렀|눌렀다|찍혔|찍혔다|흔들렸|흔들렸다|잠겼|잠겼다|풀렸|풀렸다|도착했|도착했다|멈췄|멈추었다|쓰러졌|쓰러졌다|피했|피했다|숨겼|숨겼다|꺼냈|꺼냈다|내밀었|내밀었다|가리켰|가리켰다|읽었|읽었다|보냈|보냈다|받았|받았다|들렸다|들었다|속삭였|속삭였다|말했다|밝혀졌|밝혀졌다|드러났|드러났다|확인됐|확인됐다)/u;

const POV_PRIVATE_STATE_PATTERN =
  /(?:^|[.!?。！？]\s*)([가-힣A-Za-z]{1,10}|그|그녀)(?:은|는|이|가)\s+[^.!?。！？\n]{0,64}(?:생각했|생각했다|느꼈|느꼈다|깨달았|깨달았다|알았다|알고\s*있었|원했|원했다|바랐|바랐다|두려워했|두려워했다|무서워했|무서워했다|후회했|후회했다|확신했|확신했다|믿었|믿었다|의심했|의심했다|짐작했|짐작했다|기대했|기대했다|불안했|불안했다|분노했|분노했다|당황했|당황했다|기뻐했|기뻐했다|슬퍼했|슬퍼했다|걱정했|걱정했다|싫어했|싫어했다|사랑했|사랑했다|미워했|미워했다|욕망했|욕망했다|결심했|결심했다)/gu;

const AMBIGUOUS_REFERENCE_START_PATTERN =
  /^["“”'‘’「」『』\s]*(?:그(?:는|가|를|에게|의)?|그녀(?:는|가|를|에게|의)?|그것(?:은|이|을|도|만)?|이것(?:은|이|을|도|만)?|저것(?:은|이|을|도|만)?|그\s*(?:말|일|사실|선택|침묵|표정|시선|기록|단서|번호|문제|상황|의미)(?:은|는|이|가|을|를|도|만)?)(?=\s|,|\.|$)/u;

const AMBIGUOUS_REFERENCE_TOKEN_PATTERN =
  /(?:그(?:는|가|를|에게|의)?|그녀(?:는|가|를|에게|의)?|그것(?:은|이|을|도|만)?|이것(?:은|이|을|도|만)?|저것(?:은|이|을|도|만)?|그\s*(?:말|일|사실|선택|침묵|표정|시선|기록|단서|번호|문제|상황|의미)(?:은|는|이|가|을|를|도|만)?)(?=\s|,|\.|$)/gu;

const EXPLICIT_REFERENCE_ANCHOR_PATTERN =
  /^["“”'‘’「」『』\s]*(?!그(?:는|가|를|에게|의)?(?:\s|,|\.|$)|그녀|그것|이것|저것)(?:[가-힣]{2,4}|주인공|조력자|동료|친구|연인|가족|형사|탐정|수사관|피해자|용의자|범인|관리자|상대|파트너)(?:은|는|이|가|을|를|에게|와|과|도|만)(?=\s|,|\.|$)/u;

const VIEWPOINT_ANCHOR_PATTERN =
  /(눈앞|시야|귓가|손끝|손바닥|목구멍|입안|등골|지금|여기|방금|왜|설마|젠장|빌어먹을|아니|그럴\s*리|하필|기어코|차라리|이미|아직|그제야|늦었다|들켰다|틀렸다|끝났다|놓칠\s*수\s*없|믿을\s*수\s*없|피하고\s*싶|하고\s*싶지\s*않|감추고\s*싶|해야\s*했|떠올랐|망설였|후회했|참았|삼켰|노려봤|이를\s*악물|숨을\s*삼켰)/gu;

const LIST_MARKER_PATTERN = /(?:하나|둘|셋|첫째|둘째|셋째|첫\s*번째|두\s*번째|세\s*번째)[,.]?/gu;

const DESIGN_JARGON_PATTERN =
  /(복선|클리프행어|페이지터너|장르적\s*쾌감|독자\s*약속|회차\s*보상|긴장\s*곡선|후킹|떡밥\s*회수|보상\s*쾌감)/gu;

const QUOTED_DIALOGUE_PATTERN =
  /"([^"\n]{1,600})"|“([^”\n]{1,600})”|「([^」\n]{1,600})」|『([^』\n]{1,600})』/gu;

const DIALOGUE_EXPOSITION_PATTERN =
  /(설명하자면|정리하면|요약하면|결론은|핵심은|다시\s*말해|말해\s*두|알아야\s*할\s*건|규칙은|원리는|시스템은|조건은|목적은|정체는|진실은|비밀은|조직은|가문은|세계는|차원은|능력은|예언은|계약은|의식은|실험은|사건\s*번호|미제\s*사건|예고\s*앱|첫\s*수신자|다음\s*표적|개발자|장기\s*미스터리|수렴|검증하는\s*데|작동한다는\s*뜻|연결됐다는\s*뜻)/u;

const ROTE_DIALOGUE_REPLY_PATTERN =
  /^(?:네|예|응|어|그래|그래요|알겠어|알겠어요|알겠습니다|좋아|좋아요|맞아|맞아요|그렇지|그렇죠|그렇군|그러네|괜찮아|괜찮아요|미안|미안해|미안해요|고마워|고마워요|아니|아니야|잠깐|왜|뭐|음|그럼|그럼요|확인했어|확인했습니다|됐어|됐습니다)$/u;

const NEUTRAL_DIALOGUE_TAG_PATTERN =
  /^\s*(?:라고|하고|라며|하며|냐고|다고|느냐고|고)?\s*(?:[가-힣A-Za-z0-9]{1,8}(?:은|는|이|가|도)?\s*)?(말했다|물었다|대답했다|답했다|덧붙였다|받았다)(?:[.!?。！？\s]|$)/u;

const DIALOGUE_GROUNDING_BEAT_PATTERN =
  /(?:(?:문|문틈|손잡이|복도|계단|엘리베이터|창문|창가|바닥|벽|천장|탁자|책상|의자|소파|컵|잔|봉투|종이|파일|사진|녹음기|휴대폰|화면|지도|가방|열쇠|서랍|주머니|칼|유리|불빛|그림자|발소리|빗소리|냄새|바람|물자국|피|잉크|주소|번호|단서)[^.!?\n]{0,40}(?:잡|놓|밀|당기|열|닫|접|펼|찢|꺼내|넣|돌리|가리|누르|숨기|떨어|흔들|젖|번지|꺼지|켜지|멎|울리|새어|묻|닿|비틀|내밀|받|감추|확인|뒤집|치우|앉|서|들어|나가|다가|물러|기대|막)|(?:잡|놓|밀|당기|열|닫|접|펼|찢|꺼내|넣|돌리|가리|누르|숨기|떨어|흔들|젖|번지|꺼지|켜지|멎|울리|새어|묻|닿|비틀|내밀|받|감추|확인|뒤집|치우|앉|서|들어|나가|다가|물러|기대|막)[^.!?\n]{0,40}(?:문|문틈|손잡이|복도|계단|엘리베이터|창문|창가|바닥|벽|천장|탁자|책상|의자|소파|컵|잔|봉투|종이|파일|사진|녹음기|휴대폰|화면|지도|가방|열쇠|서랍|주머니|칼|유리|불빛|그림자|발소리|빗소리|냄새|바람|물자국|피|잉크|주소|번호|단서)|(?:방|복도|계단|거리|병원|사무실|교실|식당|차 안|지하도|골목|강변|현관)(?:에|에서|으로)[^.!?\n]{0,36}(?:섰|앉|들어|나가|다가|물러|멈췄|기대|기다렸))/u;

const SILENCE_STALL_PATTERN =
  /(?:아무\s*말(?:도)?\s*(?:하지|못하)(?:지)?\s*않|대답(?:하지|할\s*수)\s*않|답하지\s*않|말(?:을)?\s*(?:잇지|꺼내지|하지|못하|삼키|아끼)(?:지)?\s*않|입(?:을)?\s*(?:열지|다물|닫)(?:지)?\s*않|침묵(?:했|했다|만\s*흘렀|이\s*(?:흘렀|이어졌|내려앉았)|으로\s*답했)|말문이\s*막혔)/u;

const MELODRAMATIC_EMOTION_CAPTION_PATTERN =
  /(?:믿을\s*수\s*없|말도\s*안\s*(?:됐|되|되는)|도저히\s*(?:이해|받아들일|믿을)\s*수\s*없|모든\s*것(?:이|은)?\s*(?:무너졌|무너진|끝났|끝난|사라졌|사라진)|세상(?:이|은)?\s*(?:멈췄|멈춘|무너졌|무너진|뒤집혔|뒤집힌|끝났|끝난)|시간(?:이|은)?\s*멈춘\s*듯|머릿속(?:이|은)?\s*(?:새하얘졌|하얘졌|비었)|눈앞(?:이|은)?\s*(?:캄캄해졌|하얘졌|무너졌|무너진)|돌이킬\s*수\s*없|되돌릴\s*수\s*없|끝났다는\s*생각|충격(?:이|은)?\s*(?:밀려왔|덮쳤|내려앉|휩쓸))/u;

const STOCK_REACTION_BEAT_PATTERN =
  /(?:숨을\s*(?:삼켰|죽였|고르|내쉬|참았)|침을\s*삼켰|입술을\s*(?:깨물|꾹\s*다물|다물|핥)|고개를\s*(?:끄덕|저었|숙였|돌렸)|시선을\s*(?:피했|내렸|떨궜|돌렸)|눈(?:을|이)?\s*(?:깜빡|감았|흔들렸|커졌)|눈썹을\s*찌푸|어깨(?:가|를)?\s*(?:굳었|움츠|떨렸)|손(?:이|을)?\s*(?:떨렸|쥐었|움켜쥐)|주먹을\s*(?:쥐|움켜쥐)|목소리(?:가|를)?\s*(?:떨렸|낮췄|높였)|말문이\s*막혔)/gu;

const FACIAL_EXPRESSION_BEAT_PATTERN =
  /(?:(?:얼굴|표정|낯빛|안색|눈빛|미간|입꼬리|입가|턱선|눈동자)(?:이|가|은|는|을|를|에|에는)?[^.!?\n]{0,28}(?:굳|굳어|굳었|굳히|일그러|일그러졌|일그러뜨|무너졌|흔들렸|떨렸|찌푸|찡그|구겨졌|뒤틀렸|흐려졌|어두워졌|창백해졌|차가워졌|굳은|흐린|차가운|서늘한|무표정|사라졌|내려갔|올라갔)|(?:굳은|흐린|차가운|서늘한|일그러진|무너진|창백한|무표정한)\s*(?:얼굴|표정|낯빛|안색|눈빛)|(?:표정을|얼굴을)\s*(?:감추|숨기|굳히|지우|수습)|(?:미간을|입꼬리를|입가를)\s*(?:찌푸|찡그|올리|내리|비틀|굳히))/gu;

const VAGUE_ATMOSPHERE_MODIFIER_PATTERN =
  /(?:(?:알\s*수\s*없는|설명할\s*수\s*없는|말로\s*할\s*수\s*없는|어딘가|무언가|어떤|묘한|미묘한|이상한|기묘한|낯선|막연한|희미한|선명한|깊은|묵직한|무거운|차가운|서늘한|아득한|공허한|불길한|불편한)\s*(?:기분|느낌|감각|공기|침묵|시선|기류|분위기|예감|불안|위화감|긴장|여운|온기|냉기|어둠|빛|그림자|표정|목소리|말|사이|거리)|(?:기분|느낌|감각|공기|침묵|기류|분위기|예감|위화감|긴장|여운)(?:이|가|은|는)?\s*(?:묘했|이상했|낯설었|불길했|무거웠|가라앉|흘렀|감돌았|남았|번졌))/gu;

const EVALUATIVE_MODIFIER_PATTERN =
  /(?:차갑|차가운|서늘|싸늘|낯설|이상|묘하|묘한|기묘|불길|불편|무겁|무거운|묵직|공허|아득|선명|희미|깊은|깊어|어둡|흐릿|강렬|잔혹|위험|불안|고요|쓸쓸|처참|끔찍|압도적|절망적|비극적|치명적|선연|스산|서글프|위태롭|위태로|거칠|날카롭)/gu;

const RHETORICAL_QUESTION_CUE_PATTERN =
  /(?:왜|어째서|어떻게|무엇을|무엇이|뭘|뭐가|누가|언제|어디서|정말|설마|혹시|도대체|하필)|(?:걸까|건가|것인가|일까|될까|아닐까|말인가|뜻일까|괜찮을까|해야\s*할까|야\s*할까|수\s*있을까)\?$/u;

const SUBTEXT_EXPLANATION_PATTERN =
  /(?:(?:그|그녀|그들|서연|민준|도현)?(?:의\s*)?(?:말|침묵|시선|표정|웃음|미소|한숨|대답|손짓|고개|발|행동|몸짓|눈빛)(?:은|는|이|가)?[^.!?\n]{0,50}(?:뜻했|의미했|말하고\s*있었|보여\s*주었|보여줬|알려\s*주었|알려줬|증명했|드러냈|뜻이었다|의미였다|대답이었다|거절이었다|허락이었다|경고였다|인정이었다|부정이었다)|(?:(?:그\s*)?(?:말|침묵|시선|표정|웃음|미소|한숨|대답|손짓|고개|행동|몸짓|눈빛)(?:은|는|이|가)?[^.!?\n]{0,50}(?:라는\s*(?:뜻|의미)|였다는\s*(?:뜻|의미)|이었다는\s*(?:뜻|의미))))/u;

const SCENE_BREAK_LINE_PATTERN = /^\s*(?:(?:[-*_]\s*){3,}|#{2,}|={3,})\s*$/u;

const SCENE_TRANSITION_GROUNDING_PATTERN =
  /^["“”'‘’「」『』\s]*(?:한편|그러나|그런데|반면|그때|그\s*순간|같은\s*시각|그\s*사이|그\s*무렵|그동안|잠시\s*후|얼마\s*후|몇\s*(?:분|시간|날|일)\s*뒤|며칠\s*뒤|이튿날|다음\s*날|그날\s*(?:밤|아침|저녁)?|밤이\s*지나|아침이\s*되|새벽이\s*오|곧|이후|마침내|결국|그제야|다시|방금|아까|이미|아직|그래서|그러자|때문에|탓에|바람에)(?=\s|,|\.|$)/u;

const SCENE_TRANSITION_CONTINUITY_PATTERN =
  /(?:그\s*(?:말|선택|알림|문자|전화|봉투|기록|단서|사건|침묵|표정|시선|장소|문|방|복도|밤)|방금|아까|같은\s*(?:시각|장소|방|복도|거리)|다시|돌아(?:와|왔|갔|섰)|따라(?:가|붙|왔)|향해|도착했|들어섰|나섰|나왔|지나자|열자|닫자|눈을\s*뜨자|문을\s*열자|현관을\s*나서자|복도에\s*서자)/u;

const TOPIC_MARKER_SENTENCE_START_PATTERN =
  /^["“”'‘’「」『』\s]*([가-힣A-Za-z0-9]{1,12})(?:은|는|이|가)\s/u;

const WAS_FRAGMENT_CHAIN_PATTERN = /(?:[가-힣A-Za-z0-9\s]{1,14}였다\.\s*){3,}/gu;

const SENTENCE_SPLIT_PATTERN = /(?<=[.!?])\s+|\n+/u;

export function evaluateProseTaste(
  content: string,
  options: ProseTasteGateOptions = {}
): ProseTasteGateResult {
  const profile = options.profile ?? {};
  const mode = profile.preferredMode ?? 'balanced';
  const thresholds = getThresholds(profile, mode);
  const threshold = options.threshold ?? profile.minimumScore ?? DEFAULT_THRESHOLD;
  const metrics = analyzeProseTasteMetrics(content);
  const issues: ProseTasteIssue[] = [];

  addExplicitDislikedPhraseIssues(content, profile, issues);
  addFunctionalReportIssue(content, metrics, issues);
  addDensityIssues(content, metrics, thresholds, issues);
  addSensoryWallpaperIssue(content, metrics, thresholds, issues);
  addBodyReactionSubjectIssue(content, metrics, thresholds, issues);
  addClicheEmotionImageIssue(content, metrics, thresholds, issues);
  addSymbolicAbstractionStackIssue(content, metrics, thresholds, issues);
  addEmotionLabelCarouselIssue(content, metrics, thresholds, issues);
  addFillerAdverbCadenceIssue(content, metrics, thresholds, issues);
  addSimultaneousActionCadenceIssue(content, metrics, thresholds, issues);
  addStatusQuoActionLoopIssue(content, metrics, thresholds, issues);
  addPropFidgetLoopIssue(content, metrics, thresholds, issues);
  addGazeChoreographyLoopIssue(content, metrics, thresholds, issues);
  addProcessingFluencyIssues(content, metrics, thresholds, issues);
  addReportingTailIssue(content, metrics, thresholds, issues);
  addOffscreenResolutionSummaryIssue(content, issues);
  addEmphasisPunctuationIssue(content, metrics, thresholds, issues);
  addGenericTeaserIssue(content, metrics, thresholds, issues);
  addThinCliffhangerEndingIssue(content, metrics, thresholds, issues);
  addPovDistanceIssue(content, metrics, thresholds, issues);
  addPovMindHopIssue(content, metrics, thresholds, issues);
  addDialogueExpositionIssue(content, metrics, thresholds, issues);
  addMonologueDialogueDumpIssue(content, metrics, thresholds, issues);
  addTalkingHeadDialogueRunIssue(content, metrics, thresholds, issues);
  addRoteDialogueReplyIssue(content, metrics, thresholds, issues);
  addMechanicalDialogueTagIssue(content, metrics, thresholds, issues);
  addDialogueSilenceStallIssue(content, metrics, thresholds, issues);
  addMelodramaticEmotionCaptionIssue(content, metrics, thresholds, issues);
  addStockReactionBeatIssue(content, metrics, thresholds, issues);
  addFacialExpressionCrutchIssue(content, metrics, thresholds, issues);
  addVagueAtmosphereModifierIssue(content, metrics, thresholds, issues);
  addEvaluativeModifierStackIssue(content, metrics, thresholds, issues);
  addRhetoricalQuestionDriftIssue(content, metrics, thresholds, issues);
  addSubtextOverexplanationIssue(content, metrics, thresholds, issues);
  addAmbiguousReferenceChainIssue(content, metrics, thresholds, issues);
  addSceneTransitionGroundingIssue(content, metrics, thresholds, issues);
  addTopicMarkerCadenceIssue(content, metrics, thresholds, issues);
  addTherapySpeakSelfAnalysisIssue(content, metrics, thresholds, issues);
  addBackstoryInfoDumpIssue(content, metrics, thresholds, issues);
  addRelationshipMontageSummaryIssue(content, metrics, thresholds, issues);
  addTimeSkipSummaryChainIssue(content, metrics, thresholds, issues);
  addContrastiveReframeCadenceIssue(content, metrics, thresholds, issues);
  addLoreNameOverloadIssue(content, metrics, thresholds, issues);
  addSystemStatBlockDumpIssue(content, metrics, thresholds, issues);
  addDeclaredResolveLoopIssue(content, metrics, thresholds, issues);
  addRevelationSummaryLeapIssue(content, metrics, thresholds, issues);
  addProceduralChecklistCadenceIssue(content, metrics, thresholds, issues);
  addActionChoreographyLoopIssue(content, metrics, thresholds, issues);
  addListifiedInnerMonologueIssue(content, metrics, issues);
  addShortSentenceRunIssue(content, metrics, thresholds, issues);
  addUniformSentenceLengthCadenceIssue(content, metrics, thresholds, issues);
  addSameEndingIssue(content, metrics, thresholds, issues);
  addDominantSentenceEndingIssue(content, metrics, thresholds, issues);
  addDominantDialogueEndingIssue(content, metrics, thresholds, issues);
  addDominantDialogueStarterIssue(content, metrics, thresholds, issues);
  addDialogueQuestionCascadeIssue(content, metrics, thresholds, issues);
  addDialogueVocativeCadenceIssue(content, metrics, thresholds, issues);
  addDialogueLexicalEchoIssue(content, metrics, thresholds, issues);
  addDialogueParaphraseConfirmationIssue(content, metrics, thresholds, issues);
  addDesignJargonIssue(content, metrics, issues);
  addWasFragmentIssue(content, issues);

  const rawScore = 100 - issues.reduce((total, issue) => total + issue.penalty, 0);
  const hasCriticalIssue = issues.some(issue => issue.severity === 'critical');
  const cappedScore = hasCriticalIssue ? Math.min(rawScore, 74) : rawScore;
  const score = Math.max(0, Math.min(100, Math.round(cappedScore)));
  const localizedIssues = issues.map(issue => localizeIssue(content, issue));

  return {
    score,
    passed: score >= threshold && !hasCriticalIssue,
    threshold,
    mode,
    calibration: hasTasteCalibration(profile) ? 'profiled' : 'generic',
    issues: localizedIssues.sort(compareIssues),
    metrics,
  };
}

export function analyzeProseTasteMetrics(content: string): ProseTasteMetrics {
  const characterCount = countTextUnits(content);
  const scale = Math.max(1, characterCount / 1000);
  const functionalReportCount = FUNCTIONAL_REPORT_PATTERNS.reduce(
    (total, pattern) => total + countRegexMatches(content, pattern),
    0
  );
  const embodiedReactionCount = countRegexMatches(content, EMBODIED_REACTION_PATTERN);
  const bodyReactionSubjectCount = countBodyReactionSubjectSentences(content);
  const clicheEmotionImageCount = countRegexMatches(content, CLICHE_EMOTION_IMAGE_PATTERN);
  const symbolicAbstractionCount = countSymbolicAbstractionStackSentences(content);
  const sensoryCount = countRegexMatches(content, SENSORY_PATTERN);
  const metaphorCount = countRegexMatches(content, METAPHOR_PATTERN);
  const emotionLabelCount = countRegexMatches(content, EMOTION_LABEL_PATTERN);
  const hedgedPerceptionCount = countRegexMatches(content, HEDGED_PERCEPTION_PATTERN);
  const abstractNounCount = countRegexMatches(content, ABSTRACT_NOUN_PATTERN);
  const cognitiveFilterCount = countRegexMatches(content, COGNITIVE_FILTER_PATTERN);
  const therapySpeakCount = countTherapySpeakSentences(content);
  const backstoryExpositionCount = countBackstoryExpositionSentences(content);
  const relationshipMontageSummaryCount = countRelationshipMontageSummarySentences(content);
  const timeSkipSummaryCount = countTimeSkipSummarySentences(content);
  const contrastiveReframeCount = countContrastiveReframeSentences(content);
  const loreTermCount = countLoreTerms(content);
  const loreTermOverloadSentences = findLoreTermOverloadSentences(content);
  const systemStatBlockCount = countSystemStatBlockSentences(content);
  const declaredResolveCount = countDeclaredResolveSentences(content);
  const revelationSummaryCount = countRevelationSummarySentences(content);
  const proceduralChecklistCount = countProceduralChecklistSentences(content);
  const actionChoreographyCount = countActionChoreographySentences(content);
  const nominalizedExplanationCount = countRegexMatches(content, NOMINALIZED_EXPLANATION_PATTERN);
  const translationeseFormulaCount = countRegexMatches(content, TRANSLATIONESE_FORMULA_PATTERN);
  const connectiveStarterCount = countConnectiveStarters(content);
  const fillerAdverbCount = countRegexMatches(content, FILLER_ADVERB_CADENCE_PATTERN);
  const simultaneousActionCount = countSimultaneousActionSentences(content);
  const statusQuoActionCount = countStatusQuoActionSentences(content);
  const propFidgetBeatCount = countPropFidgetBeatSentences(content);
  const gazeChoreographyCount = countGazeChoreographySentences(content);
  const causalTurnCount = countCausalTurnSentences(content);
  const commaCount = countRegexMatches(content, COMMA_PATTERN);
  const reportingTailCount = countRegexMatches(content, REPORTING_TAIL_PATTERN);
  const emphasisPunctuationCount = countRegexMatches(content, EMPHASIS_PUNCTUATION_PATTERN);
  const staticDescriptionCount = countRegexMatches(content, STATIC_DESCRIPTION_PATTERN);
  const genericTeaserCount = countRegexMatches(content, GENERIC_OMNISCIENT_TEASER_PATTERN);
  const thinCliffhangerEnding = findThinCliffhangerEnding(content);
  const povMindJumpParagraphs = findPovMindJumpParagraphs(content);
  const dialogueMatches = extractDialogueMatches(content);
  const dialogueTurnLengths = dialogueMatches.map(match => countTextUnits(match.text));
  const longestDialogueTurnLength =
    dialogueTurnLengths.length === 0 ? 0 : Math.max(...dialogueTurnLengths);
  const averageDialogueTurnLength =
    dialogueTurnLengths.length === 0
      ? 0
      : round1(
          dialogueTurnLengths.reduce((total, length) => total + length, 0) /
            dialogueTurnLengths.length
        );
  const longestDialogueGroundingGapRun = findLongestDialogueGroundingGapRun(content, dialogueMatches);
  const expositoryDialogueMatches = dialogueMatches.filter(match =>
    DIALOGUE_EXPOSITION_PATTERN.test(match.text)
  );
  const roteDialogueReplyMatches = dialogueMatches.filter(match =>
    isRoteDialogueReply(match.text)
  );
  const neutralDialogueTagMatches = dialogueMatches.filter(match =>
    hasNeutralDialogueTagAfter(content, match.endIndex)
  );
  const dialogueQuestionMatches = dialogueMatches.filter(match =>
    isDialogueQuestionTurn(match.text)
  );
  const dialogueVocativeMatches = dialogueMatches.filter(match =>
    hasDialogueVocativeOpening(match.text)
  );
  const dialogueLexicalEcho = analyzeDialogueLexicalEcho(dialogueMatches);
  const dialogueParaphraseConfirmationMatches = dialogueMatches.filter(match =>
    isDialogueParaphraseConfirmationTurn(match.text)
  );
  const silenceStallCount = countSilenceStallSentences(content);
  const melodramaticCaptionCount = countMelodramaticCaptionSentences(content);
  const stockReactionBeatCount = countRegexMatches(content, STOCK_REACTION_BEAT_PATTERN);
  const facialExpressionBeatCount = countFacialExpressionBeatSentences(content);
  const vagueAtmosphereModifierCount = countRegexMatches(content, VAGUE_ATMOSPHERE_MODIFIER_PATTERN);
  const evaluativeModifierCount = countRegexMatches(content, EVALUATIVE_MODIFIER_PATTERN);
  const rhetoricalQuestionCount = countRhetoricalQuestionSentences(content);
  const subtextExplanationCount = countSubtextExplanationSentences(content);
  const ambiguousReferenceCount = countAmbiguousReferenceSentences(content);
  const sceneTransitionGroundingGapCount = countSceneTransitionGroundingGaps(content);
  const topicMarkerStarterCount = countTopicMarkerStarterSentences(content);
  const narrationSentenceLengths = getNarrationSentenceLengths(content);
  const sentenceEndingCadence = analyzeSentenceEndingCadence(content);
  const dialogueEndingCadence = analyzeDialogueEndingCadence(content);
  const dialogueStarterCadence = analyzeDialogueStarterCadence(content);
  const viewpointAnchorCount = countRegexMatches(content, VIEWPOINT_ANCHOR_PATTERN);
  const listMarkerCount = countRegexMatches(content, LIST_MARKER_PATTERN);
  const designJargonCount = countRegexMatches(content, DESIGN_JARGON_PATTERN);

  return {
    characterCount,
    functionalReportCount,
    embodiedReactionDensityPer1000: round1(embodiedReactionCount / scale),
    bodyReactionSubjectDensityPer1000: round1(bodyReactionSubjectCount / scale),
    longestBodyReactionSubjectRun: findLongestBodyReactionSubjectRun(content),
    clicheEmotionImageDensityPer1000: round1(clicheEmotionImageCount / scale),
    longestClicheEmotionImageRun: findLongestClicheEmotionImageRun(content),
    symbolicAbstractionDensityPer1000: round1(symbolicAbstractionCount / scale),
    longestSymbolicAbstractionRun: findLongestSymbolicAbstractionRun(content),
    sensoryDensityPer1000: round1(sensoryCount / scale),
    longestSensoryWallpaperRun: findLongestSensoryWallpaperRun(content),
    metaphorDensityPer1000: round1(metaphorCount / scale),
    emotionLabelDensityPer1000: round1(emotionLabelCount / scale),
    longestEmotionLabelRun: findLongestEmotionLabelRun(content),
    hedgedPerceptionDensityPer1000: round1(hedgedPerceptionCount / scale),
    abstractNounDensityPer1000: round1(abstractNounCount / scale),
    cognitiveFilterDensityPer1000: round1(cognitiveFilterCount / scale),
    therapySpeakDensityPer1000: round1(therapySpeakCount / scale),
    longestTherapySpeakRun: findLongestTherapySpeakRun(content),
    backstoryExpositionDensityPer1000: round1(backstoryExpositionCount / scale),
    longestBackstoryExpositionRun: findLongestBackstoryExpositionRun(content),
    relationshipMontageSummaryDensityPer1000: round1(
      relationshipMontageSummaryCount / scale
    ),
    longestRelationshipMontageSummaryRun:
      findLongestRelationshipMontageSummaryRun(content),
    timeSkipSummaryDensityPer1000: round1(timeSkipSummaryCount / scale),
    longestTimeSkipSummaryRun: findLongestTimeSkipSummaryRun(content),
    contrastiveReframeDensityPer1000: round1(contrastiveReframeCount / scale),
    longestContrastiveReframeRun: findLongestContrastiveReframeRun(content),
    loreTermDensityPer1000: round1(loreTermCount / scale),
    loreTermOverloadSentenceCount: loreTermOverloadSentences.length,
    longestLoreTermRun: findLongestLoreTermRun(content),
    systemStatBlockDensityPer1000: round1(systemStatBlockCount / scale),
    longestSystemStatBlockRun: findLongestSystemStatBlockRun(content),
    declaredResolveDensityPer1000: round1(declaredResolveCount / scale),
    longestDeclaredResolveRun: findLongestDeclaredResolveRun(content),
    revelationSummaryDensityPer1000: round1(revelationSummaryCount / scale),
    longestRevelationSummaryRun: findLongestRevelationSummaryRun(content),
    proceduralChecklistDensityPer1000: round1(proceduralChecklistCount / scale),
    longestProceduralChecklistRun: findLongestProceduralChecklistRun(content),
    actionChoreographyDensityPer1000: round1(actionChoreographyCount / scale),
    longestActionChoreographyRun: findLongestActionChoreographyRun(content),
    nominalizedExplanationDensityPer1000: round1(nominalizedExplanationCount / scale),
    translationeseFormulaDensityPer1000: round1(translationeseFormulaCount / scale),
    connectiveStarterDensityPer1000: round1(connectiveStarterCount / scale),
    fillerAdverbDensityPer1000: round1(fillerAdverbCount / scale),
    longestFillerAdverbRun: findLongestFillerAdverbRun(content),
    simultaneousActionDensityPer1000: round1(simultaneousActionCount / scale),
    longestSimultaneousActionRun: findLongestSimultaneousActionRun(content),
    statusQuoActionDensityPer1000: round1(statusQuoActionCount / scale),
    longestStatusQuoActionRun: findLongestStatusQuoActionRun(content),
    propFidgetBeatDensityPer1000: round1(propFidgetBeatCount / scale),
    longestPropFidgetBeatRun: findLongestPropFidgetBeatRun(content),
    gazeChoreographyDensityPer1000: round1(gazeChoreographyCount / scale),
    longestGazeChoreographyRun: findLongestGazeChoreographyRun(content),
    causalTurnDensityPer1000: round1(causalTurnCount / scale),
    commaDensityPer1000: round1(commaCount / scale),
    reportingTailDensityPer1000: round1(reportingTailCount / scale),
    emphasisPunctuationDensityPer1000: round1(emphasisPunctuationCount / scale),
    longestEmphasisPunctuationRun: findLongestEmphasisPunctuationRun(content),
    staticDescriptionDensityPer1000: round1(staticDescriptionCount / scale),
    genericTeaserDensityPer1000: round1(genericTeaserCount / scale),
    thinCliffhangerEndingCount: thinCliffhangerEnding ? 1 : 0,
    endingCliffhangerSignalCount: countEndingCliffhangerSignals(content),
    endingConcreteTriggerCount: countEndingConcreteTriggers(content),
    povMindJumpParagraphDensityPer1000: round1(povMindJumpParagraphs.length / scale),
    povMindJumpParagraphCount: povMindJumpParagraphs.length,
    longestPovMindJumpRun: findLongestPovMindJumpRun(content),
    dialogueCount: dialogueMatches.length,
    expositoryDialogueCount: expositoryDialogueMatches.length,
    expositoryDialogueRatio: round2(
      dialogueMatches.length === 0 ? 0 : expositoryDialogueMatches.length / dialogueMatches.length
    ),
    longestDialogueTurnLength,
    averageDialogueTurnLength,
    longestDialogueGroundingGapRun,
    dialogueQuestionTurnCount: dialogueQuestionMatches.length,
    dialogueQuestionRatio: round2(
      dialogueMatches.length === 0 ? 0 : dialogueQuestionMatches.length / dialogueMatches.length
    ),
    longestDialogueQuestionRun: findLongestDialogueQuestionRun(dialogueMatches),
    dialogueVocativeTurnCount: dialogueVocativeMatches.length,
    dialogueVocativeRatio: round2(
      dialogueMatches.length === 0 ? 0 : dialogueVocativeMatches.length / dialogueMatches.length
    ),
    longestDialogueVocativeRun: findLongestDialogueVocativeRun(dialogueMatches),
    dialogueLexicalEchoTurnCount: dialogueLexicalEcho.echoTurnCount,
    dialogueLexicalEchoRatio: round2(
      dialogueMatches.length === 0 ? 0 : dialogueLexicalEcho.echoTurnCount / dialogueMatches.length
    ),
    longestDialogueLexicalEchoRun: dialogueLexicalEcho.longestRun,
    dialogueParaphraseConfirmationTurnCount: dialogueParaphraseConfirmationMatches.length,
    dialogueParaphraseConfirmationRatio: round2(
      dialogueMatches.length === 0
        ? 0
        : dialogueParaphraseConfirmationMatches.length / dialogueMatches.length
    ),
    longestDialogueParaphraseConfirmationRun:
      findLongestDialogueParaphraseConfirmationRun(dialogueMatches),
    roteDialogueReplyCount: roteDialogueReplyMatches.length,
    roteDialogueReplyRatio: round2(
      dialogueMatches.length === 0 ? 0 : roteDialogueReplyMatches.length / dialogueMatches.length
    ),
    longestRoteDialogueReplyRun: findLongestRoteDialogueReplyRun(dialogueMatches),
    neutralDialogueTagCount: neutralDialogueTagMatches.length,
    neutralDialogueTagRatio: round2(
      dialogueMatches.length === 0 ? 0 : neutralDialogueTagMatches.length / dialogueMatches.length
    ),
    longestNeutralDialogueTagRun: findLongestNeutralDialogueTagRun(content, dialogueMatches),
    silenceStallDensityPer1000: round1(silenceStallCount / scale),
    longestSilenceStallRun: findLongestSilenceStallRun(content),
    melodramaticCaptionDensityPer1000: round1(melodramaticCaptionCount / scale),
    longestMelodramaticCaptionRun: findLongestMelodramaticCaptionRun(content),
    stockReactionBeatDensityPer1000: round1(stockReactionBeatCount / scale),
    longestStockReactionBeatRun: findLongestStockReactionBeatRun(content),
    facialExpressionBeatDensityPer1000: round1(facialExpressionBeatCount / scale),
    longestFacialExpressionBeatRun: findLongestFacialExpressionBeatRun(content),
    vagueAtmosphereModifierDensityPer1000: round1(vagueAtmosphereModifierCount / scale),
    longestVagueAtmosphereModifierRun: findLongestVagueAtmosphereModifierRun(content),
    evaluativeModifierDensityPer1000: round1(evaluativeModifierCount / scale),
    longestEvaluativeModifierRun: findLongestEvaluativeModifierRun(content),
    rhetoricalQuestionDensityPer1000: round1(rhetoricalQuestionCount / scale),
    longestRhetoricalQuestionRun: findLongestRhetoricalQuestionRun(content),
    subtextExplanationDensityPer1000: round1(subtextExplanationCount / scale),
    longestSubtextExplanationRun: findLongestSubtextExplanationRun(content),
    ambiguousReferenceDensityPer1000: round1(ambiguousReferenceCount / scale),
    longestAmbiguousReferenceRun: findLongestAmbiguousReferenceRun(content),
    sceneTransitionGroundingGapDensityPer1000: round1(sceneTransitionGroundingGapCount / scale),
    longestSceneTransitionGroundingGapRun: findLongestSceneTransitionGroundingGapRun(content),
    topicMarkerStarterDensityPer1000: round1(topicMarkerStarterCount / scale),
    longestTopicMarkerStarterRun: findLongestTopicMarkerStarterRun(content),
    sentenceLengthVariationCoefficient:
      calculateSentenceLengthVariationCoefficient(narrationSentenceLengths),
    longestUniformSentenceLengthRun: findLongestUniformSentenceLengthRun(content),
    viewpointAnchorDensityPer1000: round1(viewpointAnchorCount / scale),
    listMarkerCount,
    designJargonCount,
    longestShortSentenceRun: findLongestShortSentenceRun(content),
    longestSameEndingRun: findLongestSameEndingRun(content),
    dominantSentenceEndingShare: sentenceEndingCadence.dominantShare,
    dominantSentenceEndingCount: sentenceEndingCadence.dominantCount,
    sentenceEndingCadenceSampleSize: sentenceEndingCadence.sampleSize,
    dominantDialogueEndingShare: dialogueEndingCadence.dominantShare,
    dominantDialogueEndingCount: dialogueEndingCadence.dominantCount,
    dialogueEndingCadenceSampleSize: dialogueEndingCadence.sampleSize,
    dominantDialogueStarterShare: dialogueStarterCadence.dominantShare,
    dominantDialogueStarterCount: dialogueStarterCadence.dominantCount,
    dialogueStarterCadenceSampleSize: dialogueStarterCadence.sampleSize,
    longestRepeatedSubjectRun: findLongestRepeatedSubjectRun(content),
    longestRepeatedConnectiveStarterRun: findLongestRepeatedConnectiveStarterRun(content),
  };
}

function getThresholds(profile: ProseTasteProfile, mode: ProseTasteMode): ModeThresholds {
  const base = MODE_THRESHOLDS[mode];

  return {
    maxSensoryDensityPer1000: profile.maxSensoryDensityPer1000 ?? base.maxSensoryDensityPer1000,
    maxEmbodiedReactionDensityPer1000:
      profile.maxEmbodiedReactionDensityPer1000 ?? base.maxEmbodiedReactionDensityPer1000,
    maxBodyReactionSubjectDensityPer1000:
      profile.maxBodyReactionSubjectDensityPer1000 ?? base.maxBodyReactionSubjectDensityPer1000,
    maxBodyReactionSubjectRun:
      profile.maxBodyReactionSubjectRun ?? base.maxBodyReactionSubjectRun,
    maxClicheEmotionImageDensityPer1000:
      profile.maxClicheEmotionImageDensityPer1000 ?? base.maxClicheEmotionImageDensityPer1000,
    maxClicheEmotionImageRun:
      profile.maxClicheEmotionImageRun ?? base.maxClicheEmotionImageRun,
    maxSymbolicAbstractionDensityPer1000:
      profile.maxSymbolicAbstractionDensityPer1000 ?? base.maxSymbolicAbstractionDensityPer1000,
    maxSymbolicAbstractionRun:
      profile.maxSymbolicAbstractionRun ?? base.maxSymbolicAbstractionRun,
    maxMetaphorDensityPer1000: profile.maxMetaphorDensityPer1000 ?? base.maxMetaphorDensityPer1000,
    maxSensoryWallpaperRun:
      profile.maxSensoryWallpaperRun ?? base.maxSensoryWallpaperRun,
    maxEmotionLabelDensityPer1000:
      profile.maxEmotionLabelDensityPer1000 ?? base.maxEmotionLabelDensityPer1000,
    maxEmotionLabelRun: profile.maxEmotionLabelRun ?? base.maxEmotionLabelRun,
    maxHedgedPerceptionDensityPer1000:
      profile.maxHedgedPerceptionDensityPer1000 ?? base.maxHedgedPerceptionDensityPer1000,
    maxAbstractNounDensityPer1000:
      profile.maxAbstractNounDensityPer1000 ?? base.maxAbstractNounDensityPer1000,
    maxCognitiveFilterDensityPer1000:
      profile.maxCognitiveFilterDensityPer1000 ?? base.maxCognitiveFilterDensityPer1000,
    maxTherapySpeakDensityPer1000:
      profile.maxTherapySpeakDensityPer1000 ?? base.maxTherapySpeakDensityPer1000,
    maxTherapySpeakRun: profile.maxTherapySpeakRun ?? base.maxTherapySpeakRun,
    maxBackstoryExpositionDensityPer1000:
      profile.maxBackstoryExpositionDensityPer1000 ?? base.maxBackstoryExpositionDensityPer1000,
    maxBackstoryExpositionRun:
      profile.maxBackstoryExpositionRun ?? base.maxBackstoryExpositionRun,
    maxRelationshipMontageSummaryDensityPer1000:
      profile.maxRelationshipMontageSummaryDensityPer1000 ??
      base.maxRelationshipMontageSummaryDensityPer1000,
    maxRelationshipMontageSummaryRun:
      profile.maxRelationshipMontageSummaryRun ??
      base.maxRelationshipMontageSummaryRun,
    maxTimeSkipSummaryDensityPer1000:
      profile.maxTimeSkipSummaryDensityPer1000 ??
      base.maxTimeSkipSummaryDensityPer1000,
    maxTimeSkipSummaryRun:
      profile.maxTimeSkipSummaryRun ?? base.maxTimeSkipSummaryRun,
    maxContrastiveReframeDensityPer1000:
      profile.maxContrastiveReframeDensityPer1000 ??
      base.maxContrastiveReframeDensityPer1000,
    maxContrastiveReframeRun:
      profile.maxContrastiveReframeRun ?? base.maxContrastiveReframeRun,
    maxLoreTermDensityPer1000:
      profile.maxLoreTermDensityPer1000 ?? base.maxLoreTermDensityPer1000,
    maxLoreTermRun: profile.maxLoreTermRun ?? base.maxLoreTermRun,
    maxSystemStatBlockDensityPer1000:
      profile.maxSystemStatBlockDensityPer1000 ??
      base.maxSystemStatBlockDensityPer1000,
    maxSystemStatBlockRun:
      profile.maxSystemStatBlockRun ?? base.maxSystemStatBlockRun,
    maxDeclaredResolveDensityPer1000:
      profile.maxDeclaredResolveDensityPer1000 ??
      base.maxDeclaredResolveDensityPer1000,
    maxDeclaredResolveRun:
      profile.maxDeclaredResolveRun ?? base.maxDeclaredResolveRun,
    maxRevelationSummaryDensityPer1000:
      profile.maxRevelationSummaryDensityPer1000 ??
      base.maxRevelationSummaryDensityPer1000,
    maxRevelationSummaryRun:
      profile.maxRevelationSummaryRun ?? base.maxRevelationSummaryRun,
    maxProceduralChecklistDensityPer1000:
      profile.maxProceduralChecklistDensityPer1000 ??
      base.maxProceduralChecklistDensityPer1000,
    maxProceduralChecklistRun:
      profile.maxProceduralChecklistRun ?? base.maxProceduralChecklistRun,
    maxActionChoreographyDensityPer1000:
      profile.maxActionChoreographyDensityPer1000 ??
      base.maxActionChoreographyDensityPer1000,
    maxActionChoreographyRun:
      profile.maxActionChoreographyRun ?? base.maxActionChoreographyRun,
    maxNominalizedExplanationDensityPer1000:
      profile.maxNominalizedExplanationDensityPer1000 ?? base.maxNominalizedExplanationDensityPer1000,
    maxTranslationeseFormulaDensityPer1000:
      profile.maxTranslationeseFormulaDensityPer1000 ?? base.maxTranslationeseFormulaDensityPer1000,
    maxConnectiveStarterDensityPer1000:
      profile.maxConnectiveStarterDensityPer1000 ?? base.maxConnectiveStarterDensityPer1000,
    maxFillerAdverbDensityPer1000:
      profile.maxFillerAdverbDensityPer1000 ?? base.maxFillerAdverbDensityPer1000,
    maxFillerAdverbRun: profile.maxFillerAdverbRun ?? base.maxFillerAdverbRun,
    maxSimultaneousActionDensityPer1000:
      profile.maxSimultaneousActionDensityPer1000 ??
      base.maxSimultaneousActionDensityPer1000,
    maxSimultaneousActionRun:
      profile.maxSimultaneousActionRun ?? base.maxSimultaneousActionRun,
    maxStatusQuoActionDensityPer1000:
      profile.maxStatusQuoActionDensityPer1000 ?? base.maxStatusQuoActionDensityPer1000,
    maxStatusQuoActionRun: profile.maxStatusQuoActionRun ?? base.maxStatusQuoActionRun,
    maxPropFidgetBeatDensityPer1000:
      profile.maxPropFidgetBeatDensityPer1000 ?? base.maxPropFidgetBeatDensityPer1000,
    maxPropFidgetBeatRun:
      profile.maxPropFidgetBeatRun ?? base.maxPropFidgetBeatRun,
    maxGazeChoreographyDensityPer1000:
      profile.maxGazeChoreographyDensityPer1000 ?? base.maxGazeChoreographyDensityPer1000,
    maxGazeChoreographyRun:
      profile.maxGazeChoreographyRun ?? base.maxGazeChoreographyRun,
    minCausalTurnDensityPer1000:
      profile.minCausalTurnDensityPer1000 ?? base.minCausalTurnDensityPer1000,
    maxCommaDensityPer1000: profile.maxCommaDensityPer1000 ?? base.maxCommaDensityPer1000,
    maxReportingTailDensityPer1000:
      profile.maxReportingTailDensityPer1000 ?? base.maxReportingTailDensityPer1000,
    maxEmphasisPunctuationDensityPer1000:
      profile.maxEmphasisPunctuationDensityPer1000 ?? base.maxEmphasisPunctuationDensityPer1000,
    maxEmphasisPunctuationRun:
      profile.maxEmphasisPunctuationRun ?? base.maxEmphasisPunctuationRun,
    maxStaticDescriptionDensityPer1000:
      profile.maxStaticDescriptionDensityPer1000 ?? base.maxStaticDescriptionDensityPer1000,
    maxGenericTeaserDensityPer1000:
      profile.maxGenericTeaserDensityPer1000 ?? base.maxGenericTeaserDensityPer1000,
    maxThinCliffhangerEndingCount:
      profile.maxThinCliffhangerEndingCount ?? base.maxThinCliffhangerEndingCount,
    maxPovMindJumpDensityPer1000:
      profile.maxPovMindJumpDensityPer1000 ?? base.maxPovMindJumpDensityPer1000,
    maxPovMindJumpRun:
      profile.maxPovMindJumpRun ?? base.maxPovMindJumpRun,
    maxExpositoryDialogueRatio:
      profile.maxExpositoryDialogueRatio ?? base.maxExpositoryDialogueRatio,
    maxDialogueTurnLength: profile.maxDialogueTurnLength ?? base.maxDialogueTurnLength,
    maxAverageDialogueTurnLength:
      profile.maxAverageDialogueTurnLength ?? base.maxAverageDialogueTurnLength,
    maxDialogueGroundingGapRun:
      profile.maxDialogueGroundingGapRun ?? base.maxDialogueGroundingGapRun,
    maxDialogueQuestionRatio:
      profile.maxDialogueQuestionRatio ?? base.maxDialogueQuestionRatio,
    maxDialogueQuestionRun:
      profile.maxDialogueQuestionRun ?? base.maxDialogueQuestionRun,
    maxDialogueVocativeRatio:
      profile.maxDialogueVocativeRatio ?? base.maxDialogueVocativeRatio,
    maxDialogueVocativeRun:
      profile.maxDialogueVocativeRun ?? base.maxDialogueVocativeRun,
    maxDialogueLexicalEchoRatio:
      profile.maxDialogueLexicalEchoRatio ?? base.maxDialogueLexicalEchoRatio,
    maxDialogueLexicalEchoRun:
      profile.maxDialogueLexicalEchoRun ?? base.maxDialogueLexicalEchoRun,
    maxDialogueParaphraseConfirmationRatio:
      profile.maxDialogueParaphraseConfirmationRatio ??
      base.maxDialogueParaphraseConfirmationRatio,
    maxDialogueParaphraseConfirmationRun:
      profile.maxDialogueParaphraseConfirmationRun ??
      base.maxDialogueParaphraseConfirmationRun,
    maxRoteDialogueReplyRatio:
      profile.maxRoteDialogueReplyRatio ?? base.maxRoteDialogueReplyRatio,
    maxRoteDialogueReplyRun: profile.maxRoteDialogueReplyRun ?? base.maxRoteDialogueReplyRun,
    maxNeutralDialogueTagRatio:
      profile.maxNeutralDialogueTagRatio ?? base.maxNeutralDialogueTagRatio,
    maxNeutralDialogueTagRun: profile.maxNeutralDialogueTagRun ?? base.maxNeutralDialogueTagRun,
    maxSilenceStallDensityPer1000:
      profile.maxSilenceStallDensityPer1000 ?? base.maxSilenceStallDensityPer1000,
    maxSilenceStallRun: profile.maxSilenceStallRun ?? base.maxSilenceStallRun,
    maxMelodramaticCaptionDensityPer1000:
      profile.maxMelodramaticCaptionDensityPer1000 ??
      base.maxMelodramaticCaptionDensityPer1000,
    maxMelodramaticCaptionRun:
      profile.maxMelodramaticCaptionRun ?? base.maxMelodramaticCaptionRun,
    maxStockReactionBeatDensityPer1000:
      profile.maxStockReactionBeatDensityPer1000 ?? base.maxStockReactionBeatDensityPer1000,
    maxStockReactionBeatRun: profile.maxStockReactionBeatRun ?? base.maxStockReactionBeatRun,
    maxFacialExpressionBeatDensityPer1000:
      profile.maxFacialExpressionBeatDensityPer1000 ??
      base.maxFacialExpressionBeatDensityPer1000,
    maxFacialExpressionBeatRun:
      profile.maxFacialExpressionBeatRun ?? base.maxFacialExpressionBeatRun,
    maxVagueAtmosphereModifierDensityPer1000:
      profile.maxVagueAtmosphereModifierDensityPer1000 ??
      base.maxVagueAtmosphereModifierDensityPer1000,
    maxVagueAtmosphereModifierRun:
      profile.maxVagueAtmosphereModifierRun ?? base.maxVagueAtmosphereModifierRun,
    maxEvaluativeModifierDensityPer1000:
      profile.maxEvaluativeModifierDensityPer1000 ??
      base.maxEvaluativeModifierDensityPer1000,
    maxEvaluativeModifierRun:
      profile.maxEvaluativeModifierRun ?? base.maxEvaluativeModifierRun,
    maxRhetoricalQuestionDensityPer1000:
      profile.maxRhetoricalQuestionDensityPer1000 ?? base.maxRhetoricalQuestionDensityPer1000,
    maxRhetoricalQuestionRun:
      profile.maxRhetoricalQuestionRun ?? base.maxRhetoricalQuestionRun,
    maxSubtextExplanationDensityPer1000:
      profile.maxSubtextExplanationDensityPer1000 ?? base.maxSubtextExplanationDensityPer1000,
    maxSubtextExplanationRun:
      profile.maxSubtextExplanationRun ?? base.maxSubtextExplanationRun,
    maxAmbiguousReferenceDensityPer1000:
      profile.maxAmbiguousReferenceDensityPer1000 ?? base.maxAmbiguousReferenceDensityPer1000,
    maxAmbiguousReferenceRun:
      profile.maxAmbiguousReferenceRun ?? base.maxAmbiguousReferenceRun,
    maxSceneTransitionGroundingGapDensityPer1000:
      profile.maxSceneTransitionGroundingGapDensityPer1000 ??
      base.maxSceneTransitionGroundingGapDensityPer1000,
    maxSceneTransitionGroundingGapRun:
      profile.maxSceneTransitionGroundingGapRun ?? base.maxSceneTransitionGroundingGapRun,
    maxTopicMarkerStarterDensityPer1000:
      profile.maxTopicMarkerStarterDensityPer1000 ?? base.maxTopicMarkerStarterDensityPer1000,
    maxTopicMarkerStarterRun:
      profile.maxTopicMarkerStarterRun ?? base.maxTopicMarkerStarterRun,
    minSentenceLengthVariationCoefficient:
      profile.minSentenceLengthVariationCoefficient ??
      base.minSentenceLengthVariationCoefficient,
    maxUniformSentenceLengthRun:
      profile.maxUniformSentenceLengthRun ?? base.maxUniformSentenceLengthRun,
    maxSameEndingRun: profile.maxSameEndingRun ?? base.maxSameEndingRun,
    maxDominantSentenceEndingShare:
      profile.maxDominantSentenceEndingShare ?? base.maxDominantSentenceEndingShare,
    maxDominantDialogueEndingShare:
      profile.maxDominantDialogueEndingShare ?? base.maxDominantDialogueEndingShare,
    maxDominantDialogueStarterShare:
      profile.maxDominantDialogueStarterShare ?? base.maxDominantDialogueStarterShare,
    minViewpointAnchorDensityPer1000:
      profile.minViewpointAnchorDensityPer1000 ?? base.minViewpointAnchorDensityPer1000,
    maxShortSentenceRun: profile.maxShortSentenceRun ?? base.maxShortSentenceRun,
    maxRepeatedSubjectRun: profile.maxRepeatedSubjectRun ?? base.maxRepeatedSubjectRun,
    maxRepeatedConnectiveStarterRun:
      profile.maxRepeatedConnectiveStarterRun ?? base.maxRepeatedConnectiveStarterRun,
  };
}

function addExplicitDislikedPhraseIssues(
  content: string,
  profile: ProseTasteProfile,
  issues: ProseTasteIssue[]
): void {
  for (const phrase of profile.dislikedPhrases ?? []) {
    const trimmed = phrase.trim();
    if (!trimmed) continue;

    const position = content.indexOf(trimmed);
    if (position === -1) continue;

    issues.push({
      code: 'explicit-disliked-phrase',
      severity: 'critical',
      message: `사용자 금지 문체/표현이 남아 있습니다: ${trimmed}`,
      evidence: sliceEvidence(content, position, trimmed.length),
      suggestion: '사용자가 싫어한다고 지정한 표현은 같은 의미라도 다른 문장 구조로 완전히 다시 쓰세요.',
      penalty: 30,
      position,
    });
  }
}

function addFunctionalReportIssue(
  content: string,
  metrics: ProseTasteMetrics,
  issues: ProseTasteIssue[]
): void {
  if (metrics.functionalReportCount === 0) return;

  const firstMatch = findFirstPatternMatch(content, FUNCTIONAL_REPORT_PATTERNS);
  issues.push({
    code: 'functional-ai-report',
    severity: metrics.functionalReportCount >= 3 ? 'critical' : 'high',
    message: '감각/반응을 장면으로 보여주지 않고 기능 보고처럼 처리합니다.',
    evidence: firstMatch ? sliceEvidence(content, firstMatch.index, firstMatch.text.length) : '',
    suggestion: '"감각이 왔다"처럼 기능을 보고하지 말고, 인물의 행동 변화와 장면 안 물성으로 바꾸세요.',
    penalty: Math.min(28, metrics.functionalReportCount * 9),
    position: firstMatch?.index,
  });
}

function addDensityIssues(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (
    metrics.embodiedReactionDensityPer1000 > thresholds.maxEmbodiedReactionDensityPer1000 &&
    countRegexMatches(content, EMBODIED_REACTION_PATTERN) >= 4
  ) {
    const match = findFirstRegexMatch(content, EMBODIED_REACTION_PATTERN);
    issues.push({
      code: 'over-embodied-reaction',
      severity: 'high',
      message: '심장/숨/손끝 같은 신체 반응이 반복되어 작위적인 감정 연출로 읽힙니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '반복 신체 반응을 줄이고, 선택/회피/침묵/시선 처리처럼 장면 행동으로 감정을 분산하세요.',
      penalty: densityPenalty(
        metrics.embodiedReactionDensityPer1000,
        thresholds.maxEmbodiedReactionDensityPer1000,
        2.2,
        24
      ),
      position: match?.index,
    });
  }

  if (
    metrics.sensoryDensityPer1000 > thresholds.maxSensoryDensityPer1000 &&
    countRegexMatches(content, SENSORY_PATTERN) >= 10
  ) {
    const match = findFirstRegexMatch(content, SENSORY_PATTERN);
    issues.push({
      code: 'over-sensory-density',
      severity: 'medium',
      message: '감각 묘사가 과밀해 서사가 장면 진행보다 문장 장식에 눌립니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '감각 묘사는 장면의 선택, 위험, 관계 변화에 직접 기여하는 것만 남기세요.',
      penalty: densityPenalty(metrics.sensoryDensityPer1000, thresholds.maxSensoryDensityPer1000, 1.4, 18),
      position: match?.index,
    });
  }

  if (
    metrics.metaphorDensityPer1000 > thresholds.maxMetaphorDensityPer1000 &&
    countRegexMatches(content, METAPHOR_PATTERN) >= 4
  ) {
    const match = findFirstRegexMatch(content, METAPHOR_PATTERN);
    issues.push({
      code: 'forced-metaphor-chain',
      severity: 'medium',
      message: '비유 표지가 반복되어 문장이 감정을 밀어붙이는 느낌을 줍니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '비유를 줄이고 구체적 행동, 선택 비용, 대화의 어긋남으로 긴장을 만드세요.',
      penalty: densityPenalty(metrics.metaphorDensityPer1000, thresholds.maxMetaphorDensityPer1000, 2, 20),
      position: match?.index,
    });
  }

  if (
    metrics.emotionLabelDensityPer1000 > thresholds.maxEmotionLabelDensityPer1000 &&
    countRegexMatches(content, EMOTION_LABEL_PATTERN) >= 3
  ) {
    const match = findFirstRegexMatch(content, EMOTION_LABEL_PATTERN);
    issues.push({
      code: 'flat-emotion-label',
      severity: 'medium',
      message: '감정을 라벨로 설명하는 문장이 많아 독자가 직접 느낄 여지가 줄어듭니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '감정명 대신 인물이 감추는 말, 늦어지는 반응, 잘못된 선택으로 감정을 드러내세요.',
      penalty: densityPenalty(metrics.emotionLabelDensityPer1000, thresholds.maxEmotionLabelDensityPer1000, 2, 18),
      position: match?.index,
    });
  }

  if (
    metrics.hedgedPerceptionDensityPer1000 > thresholds.maxHedgedPerceptionDensityPer1000 &&
    countRegexMatches(content, HEDGED_PERCEPTION_PATTERN) >= 4
  ) {
    const hedgedPerceptionCount = countRegexMatches(content, HEDGED_PERCEPTION_PATTERN);
    const isSevereHaze =
      hedgedPerceptionCount >= 6 ||
      metrics.hedgedPerceptionDensityPer1000 >= thresholds.maxHedgedPerceptionDensityPer1000 * 1.5;
    const match = findFirstRegexMatch(content, HEDGED_PERCEPTION_PATTERN);
    issues.push({
      code: 'hedged-perception-haze',
      severity: isSevereHaze ? 'critical' : 'high',
      message: '듯함/것 같음/느껴짐 같은 완충 표현이 반복되어 장면 판단이 흐려집니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '불확실한 완충 표현을 줄이고, 인물이 실제로 본 것, 한 선택, 틀린 판단의 결과를 문장에 직접 세우세요.',
      penalty: densityPenalty(
        metrics.hedgedPerceptionDensityPer1000,
        thresholds.maxHedgedPerceptionDensityPer1000,
        2.4,
        24
      ),
      position: match?.index,
    });
  }
}

function addEmotionLabelCarouselIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.longestEmotionLabelRun <= thresholds.maxEmotionLabelRun) {
    return;
  }

  const minRun = thresholds.maxEmotionLabelRun + 1;
  const evidenceMatch = findEmotionLabelCarouselEvidence(content, minRun);
  const isSevereRun = metrics.longestEmotionLabelRun >= thresholds.maxEmotionLabelRun + 2;

  issues.push({
    code: 'emotion-label-carousel',
    severity: isSevereRun ? 'high' : 'medium',
    message:
      `감정 라벨 문장이 ${metrics.longestEmotionLabelRun}문장 연속되어 ` +
      '감정 전환이 선택, 행동, 결과로 체감되지 않습니다.',
    evidence: evidenceMatch.text,
    suggestion:
      '연속된 감정명 일부를 지우고, 감정이 바뀐 이유가 되는 선택, 늦어진 반응, 잘못된 판단, 관계 비용, 즉각적 결과로 바꾸세요.',
    penalty: Math.min(
      20,
      Math.max(8, (metrics.longestEmotionLabelRun - thresholds.maxEmotionLabelRun) * 6)
    ),
    position: evidenceMatch.index,
  });
}

function addSensoryWallpaperIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.longestSensoryWallpaperRun <= thresholds.maxSensoryWallpaperRun) {
    return;
  }

  const overflow = metrics.longestSensoryWallpaperRun - thresholds.maxSensoryWallpaperRun;
  const severe =
    metrics.longestSensoryWallpaperRun >= thresholds.maxSensoryWallpaperRun + 2;

  issues.push({
    code: 'sensory-wallpaper-run',
    severity: severe ? 'high' : 'medium',
    message:
      `감각 묘사 문장이 ${metrics.longestSensoryWallpaperRun}문장 연속되지만 ` +
      '단서, 선택, 행동 결과로 이어지지 않아 장식 문단처럼 읽힙니다.',
    evidence: findSensoryWallpaperEvidence(
      content,
      thresholds.maxSensoryWallpaperRun + 1
    ),
    suggestion:
      '연속 감각 묘사 일부를 단서 확인, 인물의 선택, 위험 변화, 관계 반응, 즉각적 결과로 바꿔 감각이 장면 상태를 움직이게 하세요.',
    penalty: Math.min(20, Math.max(8, overflow * 5)),
  });
}

function addBodyReactionSubjectIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const bodyReactionSubjectCount = countBodyReactionSubjectSentences(content);
  const densityFailure =
    bodyReactionSubjectCount >= 3 &&
    metrics.bodyReactionSubjectDensityPer1000 >
      thresholds.maxBodyReactionSubjectDensityPer1000;
  const runFailure =
    metrics.longestBodyReactionSubjectRun > thresholds.maxBodyReactionSubjectRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestBodyReactionSubjectRun - thresholds.maxBodyReactionSubjectRun
  );
  const severe =
    metrics.longestBodyReactionSubjectRun >= thresholds.maxBodyReactionSubjectRun + 2 ||
    metrics.bodyReactionSubjectDensityPer1000 >=
      thresholds.maxBodyReactionSubjectDensityPer1000 * 1.7;

  issues.push({
    code: 'body-reaction-subject-chain',
    severity: severe ? 'high' : 'medium',
    message: `심장/숨/목구멍/손끝 같은 몸이 문장 주어가 되는 자동 반응이 과밀하거나 ${metrics.longestBodyReactionSubjectRun}문장 연속됩니다.`,
    evidence: findBodyReactionSubjectEvidence(
      content,
      thresholds.maxBodyReactionSubjectRun + 1
    ),
    suggestion: '자동 신체 반응 일부를 인물의 선택, 숨긴 정보, 말의 회피, 상대의 행동 변화, 장면 상태 변화로 바꾸세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.bodyReactionSubjectDensityPer1000 -
              thresholds.maxBodyReactionSubjectDensityPer1000
          ) * 2.2
        )
    ),
  });
}

function addClicheEmotionImageIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const clicheEmotionImageCount = countRegexMatches(content, CLICHE_EMOTION_IMAGE_PATTERN);
  const densityFailure =
    clicheEmotionImageCount >= 3 &&
    metrics.clicheEmotionImageDensityPer1000 >
      thresholds.maxClicheEmotionImageDensityPer1000;
  const runFailure =
    metrics.longestClicheEmotionImageRun > thresholds.maxClicheEmotionImageRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestClicheEmotionImageRun - thresholds.maxClicheEmotionImageRun
  );
  const severe =
    clicheEmotionImageCount >= 6 ||
    metrics.longestClicheEmotionImageRun >= thresholds.maxClicheEmotionImageRun + 2 ||
    metrics.clicheEmotionImageDensityPer1000 >=
      thresholds.maxClicheEmotionImageDensityPer1000 * 1.7;

  issues.push({
    code: 'cliche-emotion-image-chain',
    severity: severe ? 'high' : 'medium',
    message: `눈물/시간 멈춤/세상 붕괴/칼날 같은 침묵처럼 익숙한 감정 이미지가 과밀하거나 ${metrics.longestClicheEmotionImageRun}문장 연속됩니다.`,
    evidence: findClicheEmotionImageEvidence(
      content,
      thresholds.maxClicheEmotionImageRun + 1
    ),
    suggestion: '상투적 감정 이미지를 줄이고, 해당 인물만 가진 물건, 말버릇, 선택 비용, 상대 반응, 장면 결과로 감정을 구체화하세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.clicheEmotionImageDensityPer1000 -
              thresholds.maxClicheEmotionImageDensityPer1000
          ) * 2
        )
    ),
  });
}

function addSymbolicAbstractionStackIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const symbolicAbstractionCount = countSymbolicAbstractionStackSentences(content);
  const densityFailure =
    symbolicAbstractionCount >= 3 &&
    metrics.symbolicAbstractionDensityPer1000 >
      thresholds.maxSymbolicAbstractionDensityPer1000;
  const runFailure =
    metrics.longestSymbolicAbstractionRun > thresholds.maxSymbolicAbstractionRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestSymbolicAbstractionRun - thresholds.maxSymbolicAbstractionRun
  );
  const severe =
    symbolicAbstractionCount >= 6 ||
    metrics.longestSymbolicAbstractionRun >= thresholds.maxSymbolicAbstractionRun + 2 ||
    metrics.symbolicAbstractionDensityPer1000 >=
      thresholds.maxSymbolicAbstractionDensityPer1000 * 1.7;

  issues.push({
    code: 'symbolic-abstraction-stack',
    severity: severe ? 'high' : 'medium',
    message: `운명/진실/의미/상징/상실 같은 추상·상징어가 구체 사물, 행동, 상태 변화 없이 과밀하거나 ${metrics.longestSymbolicAbstractionRun}문장 연속됩니다.`,
    evidence: findSymbolicAbstractionEvidence(
      content,
      thresholds.maxSymbolicAbstractionRun + 1
    ),
    suggestion: '추상·상징어 일부를 인물이 만지는 사물, 화면/문서의 변화, 선택 비용, 상대 반응, 장면 결과로 바꾸세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.symbolicAbstractionDensityPer1000 -
              thresholds.maxSymbolicAbstractionDensityPer1000
          ) * 2
        )
    ),
  });
}

function addFillerAdverbCadenceIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const fillerAdverbCount = countRegexMatches(content, FILLER_ADVERB_CADENCE_PATTERN);
  const densityFailure =
    fillerAdverbCount >= 5 &&
    metrics.fillerAdverbDensityPer1000 > thresholds.maxFillerAdverbDensityPer1000;
  const runFailure =
    metrics.longestFillerAdverbRun > thresholds.maxFillerAdverbRun;

  if (!densityFailure && !runFailure) return;

  const match = findFirstRegexMatch(content, FILLER_ADVERB_CADENCE_PATTERN);
  const severe =
    metrics.longestFillerAdverbRun >= thresholds.maxFillerAdverbRun + 2 ||
    metrics.fillerAdverbDensityPer1000 >= thresholds.maxFillerAdverbDensityPer1000 * 1.8;

  issues.push({
    code: 'filler-adverb-cadence',
    severity: severe ? 'high' : 'medium',
    message: '천천히/조용히/가만히 같은 완충 부사가 반복되어 장면 행동보다 문장 박자가 앞섭니다.',
    evidence: findFillerAdverbEvidence(content, thresholds.maxFillerAdverbRun + 1),
    suggestion: '부사가 설명하던 속도와 태도를 동사, 물건의 변화, 선택 지연, 상대 반응으로 바꾸고 반복 부사는 덜어내세요.',
    penalty: Math.min(
      22,
      8 +
        Math.max(0, metrics.longestFillerAdverbRun - thresholds.maxFillerAdverbRun) * 3 +
        Math.ceil(Math.max(0, metrics.fillerAdverbDensityPer1000 - thresholds.maxFillerAdverbDensityPer1000) * 1.4)
    ),
    position: match?.index,
  });
}

function addSimultaneousActionCadenceIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const simultaneousActionCount = countSimultaneousActionSentences(content);
  const densityFailure =
    simultaneousActionCount >= 5 &&
    metrics.simultaneousActionDensityPer1000 >
      thresholds.maxSimultaneousActionDensityPer1000;
  const runFailure =
    metrics.longestSimultaneousActionRun > thresholds.maxSimultaneousActionRun;

  if (!densityFailure && !runFailure) return;

  const match = findFirstSimultaneousActionSentence(content);
  const runOverflow = Math.max(
    0,
    metrics.longestSimultaneousActionRun - thresholds.maxSimultaneousActionRun
  );
  const densityOverflow = Math.max(
    0,
    metrics.simultaneousActionDensityPer1000 -
      thresholds.maxSimultaneousActionDensityPer1000
  );
  const severe =
    runOverflow >= 2 ||
    metrics.simultaneousActionDensityPer1000 >=
      thresholds.maxSimultaneousActionDensityPer1000 * 1.8;

  issues.push({
    code: 'simultaneous-action-cadence',
    severity: severe ? 'high' : 'medium',
    message:
      `~며/~면서/~한 채 행동 묶음이 ${metrics.longestSimultaneousActionRun}문장 연속되거나 과밀해 ` +
      '순차적 원인·결과가 동시에 붙은 무대 지시문처럼 읽힙니다.',
    evidence: findSimultaneousActionEvidence(
      content,
      thresholds.maxSimultaneousActionRun + 1
    ),
    suggestion:
      '동시에 붙인 행동을 시간 순서, 원인/결과, 선택 비용, 상대 반응으로 분리하고 중요한 행동은 주절에 올리세요.',
    penalty: Math.min(
      22,
      8 + runOverflow * 4 + Math.ceil(densityOverflow * 1.5)
    ),
    position: match?.index,
  });
}

function addStatusQuoActionLoopIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const statusQuoActionCount = countStatusQuoActionSentences(content);
  const densityFailure =
    statusQuoActionCount >= 5 &&
    metrics.statusQuoActionDensityPer1000 > thresholds.maxStatusQuoActionDensityPer1000;
  const runFailure =
    metrics.longestStatusQuoActionRun > thresholds.maxStatusQuoActionRun;
  const lacksCausalTurn =
    metrics.causalTurnDensityPer1000 < thresholds.minCausalTurnDensityPer1000;

  if (!runFailure && !(densityFailure && lacksCausalTurn)) return;

  const match = findFirstStatusQuoActionSentence(content);
  const severe =
    metrics.longestStatusQuoActionRun >= thresholds.maxStatusQuoActionRun + 2 ||
    metrics.statusQuoActionDensityPer1000 >= thresholds.maxStatusQuoActionDensityPer1000 * 1.7;

  issues.push({
    code: 'status-quo-action-loop',
    severity: severe ? 'high' : 'medium',
    message: '행동처럼 보이는 문장이 반복되지만 새 단서·선택·장애·결과가 없어 장면 상태가 그대로입니다.',
    evidence: findStatusQuoActionEvidence(content, thresholds.maxStatusQuoActionRun + 1),
    suggestion: '반복 동작 중 일부를 실패, 거절, 조건 변화, 새 단서, 되돌릴 수 없는 선택으로 바꿔 장면 전후 상태를 달라지게 하세요.',
    penalty: Math.min(
      24,
      10 +
        Math.max(0, metrics.longestStatusQuoActionRun - thresholds.maxStatusQuoActionRun) * 3 +
        Math.ceil(
          Math.max(
            0,
            metrics.statusQuoActionDensityPer1000 - thresholds.maxStatusQuoActionDensityPer1000
          ) * 1.2
        )
    ),
    position: match?.index,
  });
}

function addPropFidgetLoopIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const propFidgetCount = countPropFidgetBeatSentences(content);
  const densityFailure =
    propFidgetCount >= 4 &&
    metrics.propFidgetBeatDensityPer1000 > thresholds.maxPropFidgetBeatDensityPer1000;
  const runFailure =
    metrics.longestPropFidgetBeatRun > thresholds.maxPropFidgetBeatRun;

  if (!densityFailure && !runFailure) return;

  const match = findFirstPropFidgetBeatSentence(content);
  const runOverflow = Math.max(
    0,
    metrics.longestPropFidgetBeatRun - thresholds.maxPropFidgetBeatRun
  );
  const densityOverflow = Math.max(
    0,
    metrics.propFidgetBeatDensityPer1000 -
      thresholds.maxPropFidgetBeatDensityPer1000
  );
  const severe =
    propFidgetCount >= 7 ||
    runOverflow >= 2 ||
    metrics.propFidgetBeatDensityPer1000 >=
      thresholds.maxPropFidgetBeatDensityPer1000 * 1.8;

  issues.push({
    code: 'prop-fidget-loop',
    severity: severe ? 'high' : 'medium',
    message:
      `컵, 봉투, 휴대폰, 펜 같은 소품 조작 beat가 ${metrics.longestPropFidgetBeatRun}문장 연속되거나 과밀해 ` +
      '장면 변화보다 손동작 filler가 먼저 보입니다.',
    evidence: findPropFidgetBeatEvidence(content, thresholds.maxPropFidgetBeatRun + 1),
    suggestion:
      '소품을 다시 만지는 문장을 늘리지 말고, 일부 beat를 새 단서 공개, 물건의 상태 변화, 건네기/숨기기/빼앗기, 관계 조건 변화, 되돌릴 수 없는 선택으로 바꾸세요.',
    penalty: Math.min(
      22,
      8 + runOverflow * 4 + Math.ceil(densityOverflow * 1.4)
    ),
    position: match?.index,
  });
}

function addGazeChoreographyLoopIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const gazeChoreographyCount = countGazeChoreographySentences(content);
  const densityFailure =
    gazeChoreographyCount >= 5 &&
    metrics.gazeChoreographyDensityPer1000 >
      thresholds.maxGazeChoreographyDensityPer1000;
  const runFailure =
    metrics.longestGazeChoreographyRun > thresholds.maxGazeChoreographyRun;

  if (!densityFailure && !runFailure) return;

  const match = findFirstGazeChoreographySentence(content);
  const runOverflow = Math.max(
    0,
    metrics.longestGazeChoreographyRun - thresholds.maxGazeChoreographyRun
  );
  const densityOverflow = Math.max(
    0,
    metrics.gazeChoreographyDensityPer1000 -
      thresholds.maxGazeChoreographyDensityPer1000
  );
  const severe =
    runOverflow >= 2 ||
    metrics.gazeChoreographyDensityPer1000 >=
      thresholds.maxGazeChoreographyDensityPer1000 * 1.8;

  issues.push({
    code: 'gaze-choreography-loop',
    severity: severe ? 'high' : 'medium',
    message:
      `시선/눈길/눈빛/고개/바라봄 beat가 ${metrics.longestGazeChoreographyRun}문장 연속되거나 과밀해 ` +
      '인물 선택과 장면 변화 대신 카메라 안무처럼 읽힙니다.',
    evidence: findGazeChoreographyEvidence(
      content,
      thresholds.maxGazeChoreographyRun + 1
    ),
    suggestion:
      '반복된 시선·고개 beat 일부를 지우고, 새 단서 확인, 선택 비용, 회피의 결과, 상대의 조건 변화처럼 장면 상태를 바꾸는 행동으로 바꾸세요.',
    penalty: Math.min(
      22,
      8 + runOverflow * 4 + Math.ceil(densityOverflow * 1.6)
    ),
    position: match?.index,
  });
}

function addListifiedInnerMonologueIssue(
  content: string,
  metrics: ProseTasteMetrics,
  issues: ProseTasteIssue[]
): void {
  if (metrics.listMarkerCount < 3) return;

  const match = findFirstRegexMatch(content, LIST_MARKER_PATTERN);
  issues.push({
    code: 'listified-inner-monologue',
    severity: 'medium',
    message: '내적 독백이 항목처럼 나열되어 서사 몰입이 깨집니다.',
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion: '사고의 목록을 문단 리듬 안에 녹이고, 판단이 바뀌는 계기를 장면 행동과 연결하세요.',
    penalty: Math.min(16, metrics.listMarkerCount * 4),
    position: match?.index,
  });
}

function addPovDistanceIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const staticDescriptionCount = countRegexMatches(content, STATIC_DESCRIPTION_PATTERN);
  if (
    staticDescriptionCount < 6 ||
    metrics.staticDescriptionDensityPer1000 <= thresholds.maxStaticDescriptionDensityPer1000 ||
    metrics.viewpointAnchorDensityPer1000 >= thresholds.minViewpointAnchorDensityPer1000
  ) {
    return;
  }

  const match = findFirstRegexMatch(content, STATIC_DESCRIPTION_PATTERN);
  const severe =
    metrics.staticDescriptionDensityPer1000 >= thresholds.maxStaticDescriptionDensityPer1000 * 1.8 &&
    metrics.viewpointAnchorDensityPer1000 === 0;

  issues.push({
    code: 'detached-camera-description',
    severity: severe ? 'high' : 'medium',
    message: '정적 배경/사물 존재 문장이 누적되지만 인물의 감각·판단·말투 앵커가 부족해 외부 카메라 보고처럼 읽힙니다.',
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion: '묘사를 POV 인물이 실제로 본 순서, 오해한 판단, 감춘 반응, 달라진 행동으로 묶으세요.',
    penalty: Math.min(
      24,
      densityPenalty(
        metrics.staticDescriptionDensityPer1000,
        thresholds.maxStaticDescriptionDensityPer1000,
        0.8,
        18
      ) +
        Math.ceil(
          Math.max(0, thresholds.minViewpointAnchorDensityPer1000 - metrics.viewpointAnchorDensityPer1000) * 2
        )
    ),
    position: match?.index,
  });
}

function addPovMindHopIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const densityFailure =
    metrics.povMindJumpParagraphCount >= 2 &&
    metrics.povMindJumpParagraphDensityPer1000 >
      thresholds.maxPovMindJumpDensityPer1000;
  const runFailure = metrics.longestPovMindJumpRun > thresholds.maxPovMindJumpRun;

  if (!densityFailure && !runFailure) return;

  const firstJump = findPovMindJumpParagraphs(content)[0];
  const overflow = Math.max(0, metrics.longestPovMindJumpRun - thresholds.maxPovMindJumpRun);
  const severe =
    metrics.povMindJumpParagraphCount >= 4 ||
    metrics.longestPovMindJumpRun >= thresholds.maxPovMindJumpRun + 2 ||
    metrics.povMindJumpParagraphDensityPer1000 >=
      thresholds.maxPovMindJumpDensityPer1000 * 1.8;

  issues.push({
    code: 'pov-mind-hop-chain',
    severity: severe ? 'high' : 'medium',
    message:
      `같은 문단 안에서 서로 다른 인물의 생각/감정/판단을 직접 열어 보이는 문단이 ` +
      `${metrics.povMindJumpParagraphCount}개이고 최장 ${metrics.longestPovMindJumpRun}문단 이어집니다.`,
    evidence:
      firstJump !== undefined
        ? `[내면 주체: ${firstJump.subjects.join(', ')}] ${firstJump.text}`
        : '',
    suggestion:
      '장면의 POV 중심 인물을 하나로 고정하고, 다른 인물의 속마음은 대사, 행동, 지연, 오해, 사물 조작, 이후 POV 전환 장면으로 드러내세요.',
    penalty: Math.min(
      24,
      10 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.povMindJumpParagraphDensityPer1000 -
              thresholds.maxPovMindJumpDensityPer1000
          ) * 1.8
        )
    ),
    position: firstJump?.index,
  });
}

function addDialogueExpositionIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const hasEnoughDialogueEvidence =
    metrics.dialogueCount >= 3 &&
    metrics.expositoryDialogueCount >= 2 &&
    metrics.expositoryDialogueRatio > thresholds.maxExpositoryDialogueRatio;
  const repeatedDump =
    metrics.expositoryDialogueCount >= 4 &&
    metrics.expositoryDialogueRatio > thresholds.maxExpositoryDialogueRatio;

  if (!hasEnoughDialogueEvidence && !repeatedDump) return;

  const match = findFirstExpositoryDialogueMatch(content);
  const severe =
    metrics.expositoryDialogueCount >= 4 ||
    metrics.expositoryDialogueRatio >= thresholds.maxExpositoryDialogueRatio + 0.3;

  issues.push({
    code: 'expository-dialogue-dump',
    severity: severe ? 'high' : 'medium',
    message: '대사가 인물의 충돌이나 숨긴 욕망보다 설정·사건 규칙을 설명하는 기능으로 쓰입니다.',
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion: '설명 대사를 줄이고, 인물이 숨기는 정보·거부하는 선택·상대의 오해가 충돌하는 말로 바꾸세요.',
    penalty: Math.min(
      24,
      10 +
        metrics.expositoryDialogueCount * 3 +
        Math.ceil(
          Math.max(0, metrics.expositoryDialogueRatio - thresholds.maxExpositoryDialogueRatio) * 12
        )
    ),
    position: match?.index,
  });
}

function addMonologueDialogueDumpIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const longestOverflow = metrics.longestDialogueTurnLength - thresholds.maxDialogueTurnLength;
  const averageOverflow =
    metrics.averageDialogueTurnLength - thresholds.maxAverageDialogueTurnLength;
  const longestFailure = longestOverflow > 0;
  const averageFailure = metrics.dialogueCount >= 3 && averageOverflow > 0;

  if (!longestFailure && !averageFailure) return;

  const match = findFirstLongDialogueTurnMatch(content, thresholds.maxDialogueTurnLength);
  const severe = longestOverflow >= 80 || averageOverflow >= 40;

  issues.push({
    code: 'monologue-dialogue-dump',
    severity: severe ? 'high' : 'medium',
    message: `대사 한 턴이 ${metrics.longestDialogueTurnLength}자로 길어져 장면의 왕복과 반응을 압도합니다.`,
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion:
      '긴 설명을 질문, 회피, 반박, 조건 제시, 행동 beat로 쪼개고 정보 일부는 상대 반응이나 물증 변화로 넘기세요.',
    penalty: Math.min(
      22,
      8 +
        Math.ceil(Math.max(0, longestOverflow) / 20) +
        Math.ceil(Math.max(0, averageOverflow) / 15)
    ),
    position: match?.index,
  });
}

function addTalkingHeadDialogueRunIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (
    metrics.dialogueCount < thresholds.maxDialogueGroundingGapRun + 1 ||
    metrics.longestDialogueGroundingGapRun <= thresholds.maxDialogueGroundingGapRun
  ) {
    return;
  }

  const overflow = Math.max(
    0,
    metrics.longestDialogueGroundingGapRun - thresholds.maxDialogueGroundingGapRun
  );
  const match = findFirstDialogueGroundingGapRunMatch(
    content,
    thresholds.maxDialogueGroundingGapRun + 1
  );

  issues.push({
    code: 'talking-head-dialogue-run',
    severity: overflow >= 3 ? 'high' : 'medium',
    message: `대사 ${metrics.longestDialogueGroundingGapRun}턴이 행동·공간·감각 beat 없이 이어져 장면 접지가 약합니다.`,
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion:
      '긴 대화 연쇄 중 2~3턴마다 선택, 회피, 사물 조작, 공간 반응, 감각 변화, 관계 상태 변화를 심어 누가 어디서 무엇을 하는지 붙잡으세요.',
    penalty: Math.min(20, 8 + overflow * 4),
    position: match?.index,
  });
}

function addRoteDialogueReplyIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const ratioFailure =
    metrics.dialogueCount >= 5 &&
    metrics.roteDialogueReplyCount >= 4 &&
    metrics.roteDialogueReplyRatio > thresholds.maxRoteDialogueReplyRatio;
  const runFailure =
    metrics.roteDialogueReplyCount >= thresholds.maxRoteDialogueReplyRun + 1 &&
    metrics.longestRoteDialogueReplyRun > thresholds.maxRoteDialogueReplyRun;

  if (!ratioFailure && !runFailure) return;

  const overflow = Math.max(0, metrics.longestRoteDialogueReplyRun - thresholds.maxRoteDialogueReplyRun);
  const match = findFirstRoteDialogueReplyMatch(content);
  const severe =
    overflow >= 2 ||
    metrics.roteDialogueReplyRatio >= thresholds.maxRoteDialogueReplyRatio + 0.25;

  issues.push({
    code: 'rote-dialogue-response-chain',
    severity: severe ? 'high' : 'medium',
    message: '짧은 확인/동의 대사가 연쇄되어 대화가 인물 욕망보다 기계적 응답처럼 이어집니다.',
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion: '네/그래/알겠어 같은 반응을 줄이고, 침묵, 회피, 반박, 조건 제시, 행동 비트로 대화의 힘과 관계 상태를 바꾸세요.',
    penalty: Math.min(
      22,
      8 +
        metrics.roteDialogueReplyCount * 2 +
        overflow * 4 +
        Math.ceil(
          Math.max(0, metrics.roteDialogueReplyRatio - thresholds.maxRoteDialogueReplyRatio) * 10
        )
    ),
    position: match?.index,
  });
}

function addMechanicalDialogueTagIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const ratioFailure =
    metrics.dialogueCount >= 5 &&
    metrics.neutralDialogueTagCount >= 4 &&
    metrics.neutralDialogueTagRatio > thresholds.maxNeutralDialogueTagRatio;
  const runFailure =
    metrics.neutralDialogueTagCount >= thresholds.maxNeutralDialogueTagRun + 1 &&
    metrics.longestNeutralDialogueTagRun > thresholds.maxNeutralDialogueTagRun;

  if (!ratioFailure && !runFailure) return;

  const overflow = Math.max(0, metrics.longestNeutralDialogueTagRun - thresholds.maxNeutralDialogueTagRun);
  const match = findFirstNeutralDialogueTagMatch(content);
  const severe =
    overflow >= 2 ||
    metrics.neutralDialogueTagRatio >= thresholds.maxNeutralDialogueTagRatio + 0.25;

  issues.push({
    code: 'mechanical-dialogue-tag-chain',
    severity: severe ? 'high' : 'medium',
    message: '대사 뒤 중립 태그가 반복되어 말의 힘보다 "말했다/물었다/대답했다" 리듬이 먼저 보입니다.',
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion: '화자가 분명한 턴의 태그를 덜고, 필요한 곳은 행동 비트, 침묵, 시선, 사물 조작으로 화자와 서브텍스트를 함께 드러내세요.',
    penalty: Math.min(
      22,
      8 +
        metrics.neutralDialogueTagCount * 2 +
        overflow * 4 +
        Math.ceil(
          Math.max(0, metrics.neutralDialogueTagRatio - thresholds.maxNeutralDialogueTagRatio) * 10
        )
    ),
    position: match?.index,
  });
}

function addDialogueSilenceStallIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const stallCount = countSilenceStallSentences(content);
  const densityFailure =
    metrics.silenceStallDensityPer1000 > thresholds.maxSilenceStallDensityPer1000 &&
    stallCount >= 3;
  const runFailure = metrics.longestSilenceStallRun > thresholds.maxSilenceStallRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(0, metrics.longestSilenceStallRun - thresholds.maxSilenceStallRun);
  const severe =
    stallCount >= 6 ||
    metrics.longestSilenceStallRun >= thresholds.maxSilenceStallRun + 2 ||
    metrics.silenceStallDensityPer1000 >= thresholds.maxSilenceStallDensityPer1000 * 1.7;

  issues.push({
    code: 'dialogue-silence-stall-chain',
    severity: severe ? 'high' : 'medium',
    message: `대답하지 않음/입을 열지 않음/침묵이 이어짐 같은 무응답 beat가 과밀하거나 ${metrics.longestSilenceStallRun}문장 연속되어 대화 턴을 소모합니다.`,
    evidence: findSilenceStallEvidence(content),
    suggestion: '침묵 자체는 남기되, 반복 무응답 일부를 조건 제시, 회피의 대가, 잘못된 추론, 물건 조작, 다음 선택 변화로 바꾸세요.',
    penalty: Math.min(
      22,
      10 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.silenceStallDensityPer1000 - thresholds.maxSilenceStallDensityPer1000
          ) * 1.6
        )
    ),
  });
}

function addMelodramaticEmotionCaptionIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const captionCount = countMelodramaticCaptionSentences(content);
  const densityFailure =
    metrics.melodramaticCaptionDensityPer1000 >
      thresholds.maxMelodramaticCaptionDensityPer1000 &&
    captionCount >= 3;
  const runFailure =
    metrics.longestMelodramaticCaptionRun > thresholds.maxMelodramaticCaptionRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestMelodramaticCaptionRun - thresholds.maxMelodramaticCaptionRun
  );
  const severe =
    captionCount >= 6 ||
    metrics.longestMelodramaticCaptionRun >= thresholds.maxMelodramaticCaptionRun + 2 ||
    metrics.melodramaticCaptionDensityPer1000 >=
      thresholds.maxMelodramaticCaptionDensityPer1000 * 1.7;

  issues.push({
    code: 'melodramatic-emotion-caption-chain',
    severity: severe ? 'high' : 'medium',
    message: `믿을 수 없었다, 말도 안 됐다, 모든 것이 무너졌다 같은 감정 결론 캡션이 과밀하거나 ${metrics.longestMelodramaticCaptionRun}문장 연속됩니다.`,
    evidence: findMelodramaticCaptionEvidence(content),
    suggestion: '감정 결론 문장을 줄이고, 인물이 실제로 잃는 것, 잘못 선택하는 행동, 손에 남는 물건, 관계 조건 변화로 충격을 장면 안에 증명하세요.',
    penalty: Math.min(
      22,
      10 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.melodramaticCaptionDensityPer1000 -
              thresholds.maxMelodramaticCaptionDensityPer1000
          ) * 1.6
        )
    ),
  });
}

function addStockReactionBeatIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const densityFailure =
    metrics.stockReactionBeatDensityPer1000 > thresholds.maxStockReactionBeatDensityPer1000 &&
    countRegexMatches(content, STOCK_REACTION_BEAT_PATTERN) >= 4;
  const runFailure = metrics.longestStockReactionBeatRun > thresholds.maxStockReactionBeatRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(0, metrics.longestStockReactionBeatRun - thresholds.maxStockReactionBeatRun);
  const severe =
    metrics.longestStockReactionBeatRun >= thresholds.maxStockReactionBeatRun + 2 ||
    metrics.stockReactionBeatDensityPer1000 >= thresholds.maxStockReactionBeatDensityPer1000 * 1.7;

  issues.push({
    code: 'stock-reaction-beat-chain',
    severity: severe ? 'high' : 'medium',
    message: `숨 삼킴, 입술 깨묾, 시선 회피 같은 상투적 반응 beat가 과밀하거나 ${metrics.longestStockReactionBeatRun}문장 연속됩니다.`,
    evidence: findStockReactionBeatEvidence(content),
    suggestion: '반응 beat 일부를 지우고 인물이 실제로 선택한 행동, 숨긴 정보, 상대 조건, 장면 상태 변화로 감정 압박을 보여주세요.',
    penalty: Math.min(
      24,
      10 +
        overflow * 6 +
        Math.ceil(
          Math.max(
            0,
            metrics.stockReactionBeatDensityPer1000 -
              thresholds.maxStockReactionBeatDensityPer1000
          ) * 2
        )
    ),
  });
}

function addFacialExpressionCrutchIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const facialBeatCount = countFacialExpressionBeatSentences(content);
  const densityFailure =
    metrics.facialExpressionBeatDensityPer1000 >
      thresholds.maxFacialExpressionBeatDensityPer1000 &&
    facialBeatCount >= 4;
  const runFailure =
    metrics.longestFacialExpressionBeatRun > thresholds.maxFacialExpressionBeatRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestFacialExpressionBeatRun - thresholds.maxFacialExpressionBeatRun
  );
  const severe =
    facialBeatCount >= 7 ||
    metrics.longestFacialExpressionBeatRun >= thresholds.maxFacialExpressionBeatRun + 2 ||
    metrics.facialExpressionBeatDensityPer1000 >=
      thresholds.maxFacialExpressionBeatDensityPer1000 * 1.7;

  issues.push({
    code: 'facial-expression-crutch-chain',
    severity: severe ? 'high' : 'medium',
    message: `얼굴, 표정, 미간, 입꼬리 같은 표정 beat가 과밀하거나 ${metrics.longestFacialExpressionBeatRun}문장 연속됩니다.`,
    evidence: findFacialExpressionBeatEvidence(content),
    suggestion: '표정 묘사를 다른 표정으로 바꾸지 말고, 인물이 만지는 물건, 숨기는 말, 달라진 선택, 상대의 조건 변화, 장면 결과로 감정을 맥락 안에 접지하세요.',
    penalty: Math.min(
      20,
      8 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.facialExpressionBeatDensityPer1000 -
              thresholds.maxFacialExpressionBeatDensityPer1000
          ) * 1.6
        )
    ),
  });
}

function addVagueAtmosphereModifierIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const vagueModifierCount = countRegexMatches(content, VAGUE_ATMOSPHERE_MODIFIER_PATTERN);
  const densityFailure =
    metrics.vagueAtmosphereModifierDensityPer1000 >
      thresholds.maxVagueAtmosphereModifierDensityPer1000 &&
    vagueModifierCount >= 5;
  const runFailure =
    metrics.longestVagueAtmosphereModifierRun > thresholds.maxVagueAtmosphereModifierRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestVagueAtmosphereModifierRun - thresholds.maxVagueAtmosphereModifierRun
  );
  const severe =
    vagueModifierCount >= 8 ||
    metrics.longestVagueAtmosphereModifierRun >= thresholds.maxVagueAtmosphereModifierRun + 2 ||
    metrics.vagueAtmosphereModifierDensityPer1000 >=
      thresholds.maxVagueAtmosphereModifierDensityPer1000 * 1.7;

  issues.push({
    code: 'vague-atmosphere-modifier-chain',
    severity: severe ? 'high' : 'medium',
    message: `묘한 공기, 알 수 없는 감각, 무거운 침묵 같은 모호한 분위기 수식이 과밀하거나 ${metrics.longestVagueAtmosphereModifierRun}문장 연속됩니다.`,
    evidence: findVagueAtmosphereModifierEvidence(content),
    suggestion: '분위기 형용사를 늘리지 말고, 독자가 볼 수 있는 물건, 들리는 소리, 감춰진 선택지, 관계 조건 변화로 장면의 불안을 구체화하세요.',
    penalty: Math.min(
      22,
      10 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.vagueAtmosphereModifierDensityPer1000 -
              thresholds.maxVagueAtmosphereModifierDensityPer1000
          ) * 1.2
        )
    ),
  });
}

function addEvaluativeModifierStackIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const stackSentenceCount = countEvaluativeModifierStackSentences(content);
  const densityFailure =
    metrics.evaluativeModifierDensityPer1000 >
      thresholds.maxEvaluativeModifierDensityPer1000 &&
    stackSentenceCount >= 3;
  const runFailure =
    metrics.longestEvaluativeModifierRun > thresholds.maxEvaluativeModifierRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestEvaluativeModifierRun - thresholds.maxEvaluativeModifierRun
  );
  const severe =
    stackSentenceCount >= 6 ||
    metrics.longestEvaluativeModifierRun >= thresholds.maxEvaluativeModifierRun + 2 ||
    metrics.evaluativeModifierDensityPer1000 >=
      thresholds.maxEvaluativeModifierDensityPer1000 * 1.7;

  issues.push({
    code: 'evaluative-modifier-stack',
    severity: severe ? 'high' : 'medium',
    message: `차갑다, 서늘하다, 불길하다 같은 평가 형용사가 장면 변화 없이 과밀하거나 ${metrics.longestEvaluativeModifierRun}문장 연속됩니다.`,
    evidence: findEvaluativeModifierEvidence(content),
    suggestion: '평가 형용사 일부를 지우고, 온도·빛·소리·물건 위치·인물 선택처럼 독자가 직접 확인할 수 있는 장면 변화로 압박을 증명하세요.',
    penalty: Math.min(
      22,
      9 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.evaluativeModifierDensityPer1000 -
              thresholds.maxEvaluativeModifierDensityPer1000
          ) * 1.2
        )
    ),
  });
}

function addRhetoricalQuestionDriftIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const questionCount = countRhetoricalQuestionSentences(content);
  const densityFailure =
    metrics.rhetoricalQuestionDensityPer1000 >
      thresholds.maxRhetoricalQuestionDensityPer1000 &&
    questionCount >= 4;
  const runFailure =
    metrics.longestRhetoricalQuestionRun > thresholds.maxRhetoricalQuestionRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestRhetoricalQuestionRun - thresholds.maxRhetoricalQuestionRun
  );
  const severe =
    questionCount >= 7 ||
    metrics.longestRhetoricalQuestionRun >= thresholds.maxRhetoricalQuestionRun + 2 ||
    metrics.rhetoricalQuestionDensityPer1000 >=
      thresholds.maxRhetoricalQuestionDensityPer1000 * 1.7;

  issues.push({
    code: 'rhetorical-question-drift',
    severity: severe ? 'high' : 'medium',
    message: `왜/어떻게/정말 같은 자문형 의문문이 과밀하거나 ${metrics.longestRhetoricalQuestionRun}문장 연속되어 장면 진행을 대신합니다.`,
    evidence: findRhetoricalQuestionEvidence(content),
    suggestion: '의문문 일부를 인물의 실제 확인 행동, 선택 비용, 새 단서, 상대 반응으로 바꿔 질문 뒤에 장면 변화가 남게 하세요.',
    penalty: Math.min(
      22,
      8 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.rhetoricalQuestionDensityPer1000 -
              thresholds.maxRhetoricalQuestionDensityPer1000
          ) * 1.4
        )
    ),
  });
}

function addSubtextOverexplanationIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const explanationCount = countSubtextExplanationSentences(content);
  const densityFailure =
    metrics.subtextExplanationDensityPer1000 >
      thresholds.maxSubtextExplanationDensityPer1000 &&
    explanationCount >= 3;
  const runFailure =
    metrics.longestSubtextExplanationRun > thresholds.maxSubtextExplanationRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestSubtextExplanationRun - thresholds.maxSubtextExplanationRun
  );
  const severe =
    explanationCount >= 6 ||
    metrics.longestSubtextExplanationRun >= thresholds.maxSubtextExplanationRun + 2 ||
    metrics.subtextExplanationDensityPer1000 >=
      thresholds.maxSubtextExplanationDensityPer1000 * 1.7;

  issues.push({
    code: 'subtext-overexplanation-chain',
    severity: severe ? 'high' : 'medium',
    message: `침묵/시선/표정의 뜻을 해설하는 문장이 과밀하거나 ${metrics.longestSubtextExplanationRun}문장 연속되어 독자의 추론 여지를 줄입니다.`,
    evidence: findSubtextExplanationEvidence(content),
    suggestion: '뜻/의미 해설을 줄이고, 다음 행동, 오해, 조건 변화, 상대의 늦은 반응으로 독자가 속뜻을 읽게 하세요.',
    penalty: Math.min(
      22,
      10 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.subtextExplanationDensityPer1000 -
              thresholds.maxSubtextExplanationDensityPer1000
          ) * 1.6
        )
    ),
  });
}

function addAmbiguousReferenceChainIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const referenceCount = countAmbiguousReferenceSentences(content);
  const densityFailure =
    metrics.ambiguousReferenceDensityPer1000 >
      thresholds.maxAmbiguousReferenceDensityPer1000 &&
    referenceCount >= 4;
  const runFailure =
    metrics.longestAmbiguousReferenceRun > thresholds.maxAmbiguousReferenceRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestAmbiguousReferenceRun - thresholds.maxAmbiguousReferenceRun
  );
  const severe =
    referenceCount >= 8 ||
    metrics.longestAmbiguousReferenceRun >= thresholds.maxAmbiguousReferenceRun + 2 ||
    metrics.ambiguousReferenceDensityPer1000 >=
      thresholds.maxAmbiguousReferenceDensityPer1000 * 1.7;

  issues.push({
    code: 'ambiguous-reference-chain',
    severity: severe ? 'high' : 'medium',
    message: `그는/그녀는/그것은 같은 지시어가 과밀하거나 ${metrics.longestAmbiguousReferenceRun}문장 연속되어 누가 무엇을 하는지 다시 추적하게 만듭니다.`,
    evidence: findAmbiguousReferenceEvidence(content),
    suggestion: '연속 지시어 일부를 인물 이름, 역할, 물건명, 구체 행동 주체로 바꾸고 새 문단 첫 문장에는 명확한 참조 대상을 세우세요.',
    penalty: Math.min(
      22,
      8 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.ambiguousReferenceDensityPer1000 -
              thresholds.maxAmbiguousReferenceDensityPer1000
          ) * 1.3
        )
    ),
  });
}

function addSceneTransitionGroundingIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const gapCount = countSceneTransitionGroundingGaps(content);
  const densityFailure =
    metrics.sceneTransitionGroundingGapDensityPer1000 >
      thresholds.maxSceneTransitionGroundingGapDensityPer1000 &&
    gapCount >= 2;
  const runFailure =
    metrics.longestSceneTransitionGroundingGapRun >
    thresholds.maxSceneTransitionGroundingGapRun;

  if (!densityFailure && !runFailure) return;

  const firstGap = findFirstSceneTransitionGroundingGap(content);
  const overflow = Math.max(
    0,
    metrics.longestSceneTransitionGroundingGapRun -
      thresholds.maxSceneTransitionGroundingGapRun
  );
  const severe =
    gapCount >= 4 ||
    metrics.longestSceneTransitionGroundingGapRun >=
      thresholds.maxSceneTransitionGroundingGapRun + 2 ||
    metrics.sceneTransitionGroundingGapDensityPer1000 >=
      thresholds.maxSceneTransitionGroundingGapDensityPer1000 * 1.8;

  issues.push({
    code: 'scene-transition-grounding-gap',
    severity: severe ? 'high' : 'medium',
    message: `장면 전환 표식 뒤 시간/공간/인과/시점 접지 없이 시작되는 전환이 ${gapCount}회 감지됩니다.`,
    evidence: firstGap?.evidence ?? '',
    suggestion:
      '전환 직후 첫 문장에 시간 경과, 이동 경로, 앞 장면의 원인-결과, POV 감각 잔류 중 하나를 심어 독자가 새 장면에 발을 디딜 수 있게 하세요.',
    penalty: Math.min(
      22,
      8 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.sceneTransitionGroundingGapDensityPer1000 -
              thresholds.maxSceneTransitionGroundingGapDensityPer1000
          ) * 1.4
        )
    ),
    position: firstGap?.index,
  });
}

function addTopicMarkerCadenceIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const topicMarkerStarterCount = countTopicMarkerStarterSentences(content);
  const densityFailure =
    metrics.topicMarkerStarterDensityPer1000 >
      thresholds.maxTopicMarkerStarterDensityPer1000 &&
    topicMarkerStarterCount >= 5;
  const runFailure =
    metrics.longestTopicMarkerStarterRun > thresholds.maxTopicMarkerStarterRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestTopicMarkerStarterRun - thresholds.maxTopicMarkerStarterRun
  );
  const severe =
    metrics.longestTopicMarkerStarterRun >= thresholds.maxTopicMarkerStarterRun + 3 ||
    metrics.topicMarkerStarterDensityPer1000 >=
      thresholds.maxTopicMarkerStarterDensityPer1000 * 1.8;

  issues.push({
    code: 'topic-marker-cadence-lock',
    severity: severe ? 'high' : 'medium',
    message: `은/는/이/가 주어·화제로 시작하는 서술문이 ${metrics.longestTopicMarkerStarterRun}문장 연속되어 기계적인 주어-술어 행진처럼 읽힙니다.`,
    evidence: findTopicMarkerCadenceEvidence(content, thresholds.maxTopicMarkerStarterRun + 1),
    suggestion:
      '일부 문장을 시간/장소/사물/행동 결과/종속절로 열거나 앞 문장에 묶어, 매 문장이 같은 주어 조사 박자로 출발하지 않게 바꾸세요.',
    penalty: Math.min(
      24,
      10 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.topicMarkerStarterDensityPer1000 -
              thresholds.maxTopicMarkerStarterDensityPer1000
          ) * 1.2
        )
    ),
  });
}

function addProcessingFluencyIssues(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (
    metrics.abstractNounDensityPer1000 > thresholds.maxAbstractNounDensityPer1000 &&
    countRegexMatches(content, ABSTRACT_NOUN_PATTERN) >= 6
  ) {
    const match = findFirstRegexMatch(content, ABSTRACT_NOUN_PATTERN);
    const severe =
      metrics.abstractNounDensityPer1000 >= thresholds.maxAbstractNounDensityPer1000 * 1.7;
    issues.push({
      code: 'abstract-exposition-drift',
      severity: severe ? 'high' : 'medium',
      message: '추상 명사가 겹쳐 장면이 인물 행동보다 설명 문단처럼 읽힙니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '진실/운명/감정 같은 추상어를 줄이고, 인물이 만지는 사물, 선택하는 행동, 바뀌는 관계 반응으로 옮기세요.',
      penalty: densityPenalty(
        metrics.abstractNounDensityPer1000,
        thresholds.maxAbstractNounDensityPer1000,
        1.5,
        20
      ),
      position: match?.index,
    });
  }

  if (
    metrics.cognitiveFilterDensityPer1000 > thresholds.maxCognitiveFilterDensityPer1000 &&
    countRegexMatches(content, COGNITIVE_FILTER_PATTERN) >= 4
  ) {
    const match = findFirstRegexMatch(content, COGNITIVE_FILTER_PATTERN);
    const severe =
      metrics.cognitiveFilterDensityPer1000 >= thresholds.maxCognitiveFilterDensityPer1000 * 1.8;
    issues.push({
      code: 'cognitive-filtering-overload',
      severity: severe ? 'high' : 'medium',
      message: '깨달았다/생각했다/알 수 있었다 같은 인식 필터가 장면을 직접 체험하지 못하게 합니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '인물이 알았다고 쓰기보다, 독자가 같은 결론에 도달할 단서와 행동 결과를 먼저 보여주세요.',
      penalty: densityPenalty(
        metrics.cognitiveFilterDensityPer1000,
        thresholds.maxCognitiveFilterDensityPer1000,
        1.8,
        22
      ),
      position: match?.index,
    });
  }

  if (
    metrics.nominalizedExplanationDensityPer1000 > thresholds.maxNominalizedExplanationDensityPer1000 &&
    countRegexMatches(content, NOMINALIZED_EXPLANATION_PATTERN) >= 4
  ) {
    const match = findFirstRegexMatch(content, NOMINALIZED_EXPLANATION_PATTERN);
    const severe =
      metrics.nominalizedExplanationDensityPer1000 >= thresholds.maxNominalizedExplanationDensityPer1000 * 1.8;
    issues.push({
      code: 'nominalized-explanation-chain',
      severity: severe ? 'high' : 'medium',
      message: '것/수 있었다/상태였다 같은 명사화 설명이 반복되어 장면 동사가 약해집니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '명사화된 판단을 줄이고, 누가 무엇을 보았고 어떤 행동을 바꿨는지 동사 중심 문장으로 다시 쓰세요.',
      penalty: densityPenalty(
        metrics.nominalizedExplanationDensityPer1000,
        thresholds.maxNominalizedExplanationDensityPer1000,
        1.8,
        22
      ),
      position: match?.index,
    });
  }

  if (
    metrics.translationeseFormulaDensityPer1000 > thresholds.maxTranslationeseFormulaDensityPer1000 &&
    countRegexMatches(content, TRANSLATIONESE_FORMULA_PATTERN) >= 3
  ) {
    const match = findFirstRegexMatch(content, TRANSLATIONESE_FORMULA_PATTERN);
    const severe =
      metrics.translationeseFormulaDensityPer1000 >= thresholds.maxTranslationeseFormulaDensityPer1000 * 1.8;
    issues.push({
      code: 'translationese-formula-drift',
      severity: severe ? 'high' : 'medium',
      message: '에 의해/에 대하여/가지고 있다/위해 같은 번역투 공식 표현이 반복됩니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '피동·후치사식 표현을 줄이고, 한국어 조사와 능동 동사로 원인과 행동 주체를 분명히 하세요.',
      penalty: densityPenalty(
        metrics.translationeseFormulaDensityPer1000,
        thresholds.maxTranslationeseFormulaDensityPer1000,
        2,
        22
      ),
      position: match?.index,
    });
  }

  if (
    (metrics.connectiveStarterDensityPer1000 > thresholds.maxConnectiveStarterDensityPer1000 &&
      countConnectiveStarters(content) >= 4) ||
    metrics.longestRepeatedConnectiveStarterRun > thresholds.maxRepeatedConnectiveStarterRun
  ) {
    const overflow = Math.max(
      0,
      metrics.longestRepeatedConnectiveStarterRun - thresholds.maxRepeatedConnectiveStarterRun
    );
    issues.push({
      code: 'connective-crutch-rhythm',
      severity: overflow >= 2 ? 'high' : 'medium',
      message: '그리고/하지만/그 순간 같은 접속 부사가 문장 시작을 대신해 문단 리듬이 기계적으로 이어집니다.',
      evidence: findConnectiveStarterEvidence(content),
      suggestion: '접속 부사를 덜고, 행동 결과·대상 반응·장소 변화가 다음 문장을 자연스럽게 끌고 가게 바꾸세요.',
      penalty: Math.min(
        22,
        densityPenalty(
          metrics.connectiveStarterDensityPer1000,
          thresholds.maxConnectiveStarterDensityPer1000,
          1.6,
          16
        ) + overflow * 3
      ),
    });
  }

  if (
    metrics.commaDensityPer1000 > thresholds.maxCommaDensityPer1000 &&
    countRegexMatches(content, COMMA_PATTERN) >= 8
  ) {
    const match = findFirstRegexMatch(content, COMMA_PATTERN);
    issues.push({
      code: 'comma-rhythm-overload',
      severity: 'medium',
      message: '쉼표가 과하게 반복되어 한국어 산문 리듬이 번역체/생성문처럼 끊깁니다.',
      evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
      suggestion: '쉼표로 늘어진 절을 문장으로 분리하거나, 필요한 곳만 남겨 호흡의 타격점을 분명히 하세요.',
      penalty: densityPenalty(metrics.commaDensityPer1000, thresholds.maxCommaDensityPer1000, 1.2, 18),
      position: match?.index,
    });
  }

  if (metrics.longestRepeatedSubjectRun > thresholds.maxRepeatedSubjectRun) {
    const overflow = metrics.longestRepeatedSubjectRun - thresholds.maxRepeatedSubjectRun;
    issues.push({
      code: 'repeated-subject-rhythm',
      severity: overflow >= 3 ? 'high' : 'medium',
      message: `같은 주어로 시작하는 문장이 ${metrics.longestRepeatedSubjectRun}문장 연속되어 문단 박자가 단조롭습니다.`,
      evidence: findRepeatedSubjectEvidence(content, thresholds.maxRepeatedSubjectRun + 1),
      suggestion: '주어 반복을 줄이고, 행동 결과·상대 반응·장소의 변화로 문장 시작점을 바꾸세요.',
      penalty: Math.min(22, 8 + overflow * 4),
    });
  }
}

function addReportingTailIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const reportingTailCount = countRegexMatches(content, REPORTING_TAIL_PATTERN);
  if (
    reportingTailCount < 3 ||
    metrics.reportingTailDensityPer1000 <= thresholds.maxReportingTailDensityPer1000
  ) {
    return;
  }

  const match = findFirstRegexMatch(content, REPORTING_TAIL_PATTERN);
  const severe =
    reportingTailCount >= 6 ||
    metrics.reportingTailDensityPer1000 >= thresholds.maxReportingTailDensityPer1000 * 1.8;

  issues.push({
    code: 'reporting-tail-summary',
    severity: severe ? 'critical' : 'high',
    message: '사실/의미/상황을 보였다·드러났다로 문장 끝에서 보고해 장면 체험이 요약문처럼 납작해집니다.',
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion: '사실이 보였다고 결론을 보고하지 말고, 독자가 그 결론에 도달할 물증, 상대 반응, 인물의 즉시 행동을 먼저 세우세요.',
    penalty: Math.min(
      24,
      12 +
        Math.ceil(
          (metrics.reportingTailDensityPer1000 - thresholds.maxReportingTailDensityPer1000) * 4
        )
    ),
    position: match?.index,
  });
}

function addTherapySpeakSelfAnalysisIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const therapySpeakCount = countTherapySpeakSentences(content);
  const densityFailure =
    therapySpeakCount >= 3 &&
    metrics.therapySpeakDensityPer1000 > thresholds.maxTherapySpeakDensityPer1000;
  const runFailure = metrics.longestTherapySpeakRun > thresholds.maxTherapySpeakRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(0, metrics.longestTherapySpeakRun - thresholds.maxTherapySpeakRun);
  const severe =
    therapySpeakCount >= 5 ||
    metrics.longestTherapySpeakRun >= thresholds.maxTherapySpeakRun + 2 ||
    metrics.therapySpeakDensityPer1000 >= thresholds.maxTherapySpeakDensityPer1000 * 1.7;
  const evidence = findTherapySpeakEvidence(content, thresholds.maxTherapySpeakRun + 1);
  const position = evidence ? content.indexOf(evidence) : undefined;

  issues.push({
    code: 'therapy-speak-self-analysis',
    severity: severe ? 'high' : 'medium',
    message:
      `트라우마/애착/자존감 같은 심리 용어로 자기 상태를 해설하는 문장이 ${metrics.longestTherapySpeakRun}문장 연속되어 ` +
      '장면이 상담 기록처럼 읽힙니다.',
    evidence,
    suggestion:
      '심리 용어와 깨달음 설명을 줄이고, 인물이 숨기는 말, 반복해서 피하는 행동, 잘못 고르는 선택, 관계 비용으로 내면을 드러내세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.therapySpeakDensityPer1000 - thresholds.maxTherapySpeakDensityPer1000
          ) * 1.8
        )
    ),
    position: position === -1 ? undefined : position,
  });
}

function addBackstoryInfoDumpIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const backstoryCount = countBackstoryExpositionSentences(content);
  const densityFailure =
    backstoryCount >= 4 &&
    metrics.backstoryExpositionDensityPer1000 >
      thresholds.maxBackstoryExpositionDensityPer1000;
  const runFailure =
    metrics.longestBackstoryExpositionRun > thresholds.maxBackstoryExpositionRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestBackstoryExpositionRun - thresholds.maxBackstoryExpositionRun
  );
  const severe =
    backstoryCount >= 6 ||
    metrics.longestBackstoryExpositionRun >= thresholds.maxBackstoryExpositionRun + 2 ||
    metrics.backstoryExpositionDensityPer1000 >=
      thresholds.maxBackstoryExpositionDensityPer1000 * 1.8;
  const evidence = findBackstoryExpositionEvidence(
    content,
    thresholds.maxBackstoryExpositionRun + 1
  );
  const position = evidence ? content.indexOf(evidence) : undefined;

  issues.push({
    code: 'backstory-info-dump-block',
    severity: severe ? 'high' : 'medium',
    message:
      `과거/어린 시절/몇 년 전 설명 문장이 ${metrics.longestBackstoryExpositionRun}문장 연속되어 ` +
      '현재 장면이 배경설명 덩어리처럼 멈춥니다.',
    evidence,
    suggestion:
      '필수 배경은 현재 장면의 질문, 단서, 선택, 충돌 뒤에 한두 문장으로 엮고, 긴 내력은 별도 플래시백 장면이나 단계적 단서로 쪼개세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.backstoryExpositionDensityPer1000 -
              thresholds.maxBackstoryExpositionDensityPer1000
          ) * 1.5
        )
    ),
    position: position === -1 ? undefined : position,
  });
}

function addRelationshipMontageSummaryIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const summaryCount = countRelationshipMontageSummarySentences(content);
  const densityFailure =
    summaryCount >= 3 &&
    metrics.relationshipMontageSummaryDensityPer1000 >
      thresholds.maxRelationshipMontageSummaryDensityPer1000;
  const runFailure =
    metrics.longestRelationshipMontageSummaryRun >
    thresholds.maxRelationshipMontageSummaryRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestRelationshipMontageSummaryRun -
      thresholds.maxRelationshipMontageSummaryRun
  );
  const severe =
    summaryCount >= 5 ||
    metrics.longestRelationshipMontageSummaryRun >=
      thresholds.maxRelationshipMontageSummaryRun + 2 ||
    metrics.relationshipMontageSummaryDensityPer1000 >=
      thresholds.maxRelationshipMontageSummaryDensityPer1000 * 1.8;
  const evidence = findRelationshipMontageSummaryEvidence(
    content,
    thresholds.maxRelationshipMontageSummaryRun + 1
  );
  const position = evidence ? content.indexOf(evidence) : undefined;

  issues.push({
    code: 'relationship-montage-summary',
    severity: severe ? 'high' : 'medium',
    message:
      `관계·감정 변화 요약 문장이 ${metrics.longestRelationshipMontageSummaryRun}문장 연속되어 ` +
      '독자가 가까워짐, 오해 해소, 신뢰 형성을 장면으로 보지 못합니다.',
    evidence,
    suggestion:
      '관계가 깊어졌다고 요약하지 말고, 오해를 푸는 대화, 거절/사과/고백, 함께 치른 비용, 조건이 바뀌는 선택, 다음 장면의 달라진 행동으로 나눠 보여주세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.relationshipMontageSummaryDensityPer1000 -
              thresholds.maxRelationshipMontageSummaryDensityPer1000
          ) * 1.6
        )
    ),
    position: position === -1 ? undefined : position,
  });
}

function addTimeSkipSummaryChainIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const summaryCount = countTimeSkipSummarySentences(content);
  const densityFailure =
    summaryCount >= 3 &&
    metrics.timeSkipSummaryDensityPer1000 >
      thresholds.maxTimeSkipSummaryDensityPer1000;
  const runFailure =
    metrics.longestTimeSkipSummaryRun > thresholds.maxTimeSkipSummaryRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestTimeSkipSummaryRun - thresholds.maxTimeSkipSummaryRun
  );
  const severe =
    summaryCount >= 6 ||
    metrics.longestTimeSkipSummaryRun >= thresholds.maxTimeSkipSummaryRun + 2 ||
    metrics.timeSkipSummaryDensityPer1000 >=
      thresholds.maxTimeSkipSummaryDensityPer1000 * 1.8;
  const evidence = findTimeSkipSummaryEvidence(
    content,
    thresholds.maxTimeSkipSummaryRun + 1
  );
  const position = evidence ? content.indexOf(evidence) : undefined;

  issues.push({
    code: 'time-skip-summary-chain',
    severity: severe ? 'high' : 'medium',
    message:
      `시간 경과 뒤 준비·조사·상황 변화를 요약하는 문장이 ${summaryCount}회 감지되고 ` +
      `최장 ${metrics.longestTimeSkipSummaryRun}문장 이어져 중요한 변화를 장면 없이 건너뜁니다.`,
    evidence,
    suggestion:
      '시간 점프 뒤 결과만 보고하지 말고, 무엇이 바뀌었는지 물증, 선택 비용, 실패 조건, 이동 경로, 다음 장면의 달라진 행동 중 하나로 장면화하세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.timeSkipSummaryDensityPer1000 -
              thresholds.maxTimeSkipSummaryDensityPer1000
          ) * 1.5
        )
    ),
    position: position === -1 ? undefined : position,
  });
}

function addContrastiveReframeCadenceIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const reframeCount = countContrastiveReframeSentences(content);
  const densityFailure =
    reframeCount >= 3 &&
    metrics.contrastiveReframeDensityPer1000 >
      thresholds.maxContrastiveReframeDensityPer1000;
  const runFailure =
    metrics.longestContrastiveReframeRun > thresholds.maxContrastiveReframeRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestContrastiveReframeRun - thresholds.maxContrastiveReframeRun
  );
  const severe =
    reframeCount >= 6 ||
    metrics.longestContrastiveReframeRun >= thresholds.maxContrastiveReframeRun + 2 ||
    metrics.contrastiveReframeDensityPer1000 >=
      thresholds.maxContrastiveReframeDensityPer1000 * 1.8;
  const evidence = findContrastiveReframeEvidence(
    content,
    thresholds.maxContrastiveReframeRun + 1
  );
  const position = evidence ? content.indexOf(evidence) : undefined;

  issues.push({
    code: 'contrastive-reframe-cadence',
    severity: severe ? 'high' : 'medium',
    message:
      `"X가 아니었다. Y였다"식 대비 단정 문장이 ${reframeCount}회 감지되고 ` +
      `최장 ${metrics.longestContrastiveReframeRun}문장 이어져 장면보다 명언/광고 문구처럼 읽힙니다.`,
    evidence,
    suggestion:
      '대비 단정은 한두 번만 남기고, 나머지는 직접적인 긍정문, 물증, 인물 행동, 대가, 상대 반응으로 바꿔 독자가 결론을 체감하게 하세요.',
    penalty: Math.min(
      22,
      8 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.contrastiveReframeDensityPer1000 -
              thresholds.maxContrastiveReframeDensityPer1000
          ) * 1.4
        )
    ),
    position: position === -1 ? undefined : position,
  });
}

function addLoreNameOverloadIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const densityFailure =
    metrics.loreTermOverloadSentenceCount >= 3 &&
    metrics.loreTermDensityPer1000 > thresholds.maxLoreTermDensityPer1000;
  const runFailure = metrics.longestLoreTermRun > thresholds.maxLoreTermRun;

  if (!densityFailure && !runFailure) return;

  const overloadSentences = findLoreTermOverloadSentences(content);
  const first = overloadSentences[0];
  const overflow = Math.max(0, metrics.longestLoreTermRun - thresholds.maxLoreTermRun);
  const severe =
    metrics.loreTermOverloadSentenceCount >= 5 ||
    metrics.longestLoreTermRun >= thresholds.maxLoreTermRun + 2 ||
    metrics.loreTermDensityPer1000 >= thresholds.maxLoreTermDensityPer1000 * 1.8;
  const evidence = findLoreTermOverloadEvidence(content, thresholds.maxLoreTermRun + 1);

  issues.push({
    code: 'lore-name-overload',
    severity: severe ? 'high' : 'medium',
    message:
      `세계관 고유명사/설정어가 ${metrics.loreTermOverloadSentenceCount}문장에 과밀하고 ` +
      `최장 ${metrics.longestLoreTermRun}문장 이어져 독자가 장면보다 설정 표를 먼저 처리하게 됩니다.`,
    evidence,
    suggestion:
      '새 왕국, 교단, 마탑, 스킬, 시스템 이름을 한 번에 설명하지 말고, 한 장면에는 필요한 새 개념 하나만 남기세요. 나머지는 인물이 만지는 물건, 익숙한 기준과의 비교, 선택 비용, 상대 반응, 다음 장면의 단서로 나눠 심으세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(0, metrics.loreTermDensityPer1000 - thresholds.maxLoreTermDensityPer1000) *
            1.3
        )
    ),
    position: first?.index,
  });
}

function addSystemStatBlockDumpIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const statBlockCount = countSystemStatBlockSentences(content);
  const densityFailure =
    metrics.systemStatBlockDensityPer1000 >
      thresholds.maxSystemStatBlockDensityPer1000 &&
    statBlockCount >= 4;
  const runFailure =
    metrics.longestSystemStatBlockRun > thresholds.maxSystemStatBlockRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestSystemStatBlockRun - thresholds.maxSystemStatBlockRun
  );
  const severe =
    statBlockCount >= 7 ||
    metrics.longestSystemStatBlockRun >= thresholds.maxSystemStatBlockRun + 2 ||
    metrics.systemStatBlockDensityPer1000 >=
      thresholds.maxSystemStatBlockDensityPer1000 * 1.8;

  issues.push({
    code: 'system-stat-block-dump',
    severity: severe ? 'high' : 'medium',
    message:
      `상태창/스탯/레벨/보상 같은 시스템 수치 문장이 ${statBlockCount}회 감지되고 ` +
      `최장 ${metrics.longestSystemStatBlockRun}문장 이어져 장면이 선택·대가보다 UI 로그처럼 읽힙니다.`,
    evidence: findSystemStatBlockEvidence(content),
    suggestion:
      '필요한 수치만 남기고, 일부 알림은 자원 소모, 실패 조건, 제한 시간, 신체/공간 변화, 관계 위험, 다음 선택의 비용으로 바꾸세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.systemStatBlockDensityPer1000 -
              thresholds.maxSystemStatBlockDensityPer1000
          ) * 1.3
        )
    ),
  });
}

function addDeclaredResolveLoopIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const resolveCount = countDeclaredResolveSentences(content);
  const densityFailure =
    metrics.declaredResolveDensityPer1000 >
      thresholds.maxDeclaredResolveDensityPer1000 &&
    resolveCount >= 4;
  const runFailure =
    metrics.longestDeclaredResolveRun > thresholds.maxDeclaredResolveRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestDeclaredResolveRun - thresholds.maxDeclaredResolveRun
  );
  const severe =
    resolveCount >= 7 ||
    metrics.longestDeclaredResolveRun >= thresholds.maxDeclaredResolveRun + 2 ||
    metrics.declaredResolveDensityPer1000 >=
      thresholds.maxDeclaredResolveDensityPer1000 * 1.8;

  issues.push({
    code: 'declared-resolve-loop',
    severity: severe ? 'high' : 'medium',
    message:
      `결심/각오/해야 함을 선언하는 문장이 ${resolveCount}회 감지되고 ` +
      `최장 ${metrics.longestDeclaredResolveRun}문장 이어져 선택이 행동과 결과로 보이지 않습니다.`,
    evidence: findDeclaredResolveEvidence(content),
    suggestion:
      '결심 문장을 반복하지 말고, 일부를 실제 선택, 되돌릴 수 없는 행동, 물증 조작, 대가 발생, 상대의 반응으로 바꾸세요.',
    penalty: Math.min(
      22,
      8 +
        overflow * 4 +
        Math.ceil(
          Math.max(
            0,
            metrics.declaredResolveDensityPer1000 -
              thresholds.maxDeclaredResolveDensityPer1000
          ) * 1.5
        )
    ),
  });
}

function addRevelationSummaryLeapIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const revelationCount = countRevelationSummarySentences(content);
  const densityFailure =
    metrics.revelationSummaryDensityPer1000 >
      thresholds.maxRevelationSummaryDensityPer1000 &&
    revelationCount >= 4;
  const runFailure =
    metrics.longestRevelationSummaryRun > thresholds.maxRevelationSummaryRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestRevelationSummaryRun - thresholds.maxRevelationSummaryRun
  );
  const severe =
    revelationCount >= 6 ||
    metrics.longestRevelationSummaryRun >= thresholds.maxRevelationSummaryRun + 2 ||
    metrics.revelationSummaryDensityPer1000 >=
      thresholds.maxRevelationSummaryDensityPer1000 * 1.8;

  issues.push({
    code: 'revelation-summary-leap',
    severity: severe ? 'high' : 'medium',
    message:
      `단서/진실/답이 풀렸다고 요약하는 문장이 ${revelationCount}회 감지되고 ` +
      `최장 ${metrics.longestRevelationSummaryRun}문장 이어져 reveal이 단서 검증 장면으로 보이지 않습니다.`,
    evidence: findRevelationSummaryEvidence(content),
    suggestion:
      '깨달음 요약을 반복하지 말고, 각 단서가 무엇을 가리키는지 물증 확인, 비교, 오판 수정, 다음 행동과 비용으로 장면화하세요.',
    penalty: Math.min(
      24,
      10 +
        overflow * 6 +
        Math.ceil(
          Math.max(
            0,
            metrics.revelationSummaryDensityPer1000 -
              thresholds.maxRevelationSummaryDensityPer1000
          ) * 1.5
        )
    ),
  });
}

function addProceduralChecklistCadenceIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const checklistCount = countProceduralChecklistSentences(content);
  const densityFailure =
    metrics.proceduralChecklistDensityPer1000 >
      thresholds.maxProceduralChecklistDensityPer1000 &&
    checklistCount >= 4;
  const runFailure =
    metrics.longestProceduralChecklistRun > thresholds.maxProceduralChecklistRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestProceduralChecklistRun - thresholds.maxProceduralChecklistRun
  );
  const severe =
    checklistCount >= 6 ||
    metrics.longestProceduralChecklistRun >=
      thresholds.maxProceduralChecklistRun + 2 ||
    metrics.proceduralChecklistDensityPer1000 >=
      thresholds.maxProceduralChecklistDensityPer1000 * 1.8;

  issues.push({
    code: 'procedural-checklist-cadence',
    severity: severe ? 'high' : 'medium',
    message:
      `확인/검토/대조/정리 같은 조사 동작이 ${checklistCount}회 감지되고 ` +
      `최장 ${metrics.longestProceduralChecklistRun}문장 이어져 수사가 장면 변화 없이 체크리스트처럼 읽힙니다.`,
    evidence: findProceduralChecklistEvidence(content),
    suggestion:
      '조사 동작 일부를 가설 변화, 단서 불일치, 용의자 재정렬, 상대의 거짓말, 위험/비용, 다음 행동으로 바꾸세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.proceduralChecklistDensityPer1000 -
              thresholds.maxProceduralChecklistDensityPer1000
          ) * 1.4
        )
    ),
  });
}

function addActionChoreographyLoopIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const actionCount = countActionChoreographySentences(content);
  const densityFailure =
    metrics.actionChoreographyDensityPer1000 >
      thresholds.maxActionChoreographyDensityPer1000 &&
    actionCount >= 4;
  const runFailure =
    metrics.longestActionChoreographyRun > thresholds.maxActionChoreographyRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestActionChoreographyRun - thresholds.maxActionChoreographyRun
  );
  const severe =
    actionCount >= 7 ||
    metrics.longestActionChoreographyRun >=
      thresholds.maxActionChoreographyRun + 2 ||
    metrics.actionChoreographyDensityPer1000 >=
      thresholds.maxActionChoreographyDensityPer1000 * 1.8;

  issues.push({
    code: 'action-choreography-loop',
    severity: severe ? 'high' : 'medium',
    message:
      `공격/회피/막기/휘두르기 같은 액션 beat가 ${actionCount}회 감지되고 ` +
      `최장 ${metrics.longestActionChoreographyRun}문장 이어져 전투가 부상·위치·목표 변화 없이 동작 로그처럼 읽힙니다.`,
    evidence: findActionChoreographyEvidence(content),
    suggestion:
      '일부 동작을 부상, 무기/공간 파손, 거리/위치 변화, 목표 확보/실패, 관계/감정 압박, 전세 reversal로 바꾸세요.',
    penalty: Math.min(
      24,
      9 +
        overflow * 5 +
        Math.ceil(
          Math.max(
            0,
            metrics.actionChoreographyDensityPer1000 -
              thresholds.maxActionChoreographyDensityPer1000
          ) * 1.3
        )
    ),
  });
}

function addOffscreenResolutionSummaryIssue(
  content: string,
  issues: ProseTasteIssue[]
): void {
  const resolutionSummaryCount = countRegexMatches(content, OFFSCREEN_RESOLUTION_SUMMARY_PATTERN);
  if (resolutionSummaryCount === 0) return;

  const match = findFirstRegexMatch(content, OFFSCREEN_RESOLUTION_SUMMARY_PATTERN);

  issues.push({
    code: 'offscreen-resolution-summary',
    severity: resolutionSummaryCount >= 2 ? 'critical' : 'high',
    message: '결정적 폭로·해결·체포·구출이 장면 밖 사후 요약으로 처리되어 고점이 납작해집니다.',
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion:
      '시간 점프 뒤 결과를 보고하지 말고, 단서 확인, 선택, 충돌, 실패 비용, 폭로 순간, 즉시 달라진 행동을 원고 안 장면으로 보여주세요.',
    penalty: Math.min(28, 14 + resolutionSummaryCount * 6),
    position: match?.index,
  });
}

function addEmphasisPunctuationIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const punctuationCount = countRegexMatches(content, EMPHASIS_PUNCTUATION_PATTERN);
  const densityFailure =
    punctuationCount >= 4 &&
    metrics.emphasisPunctuationDensityPer1000 > thresholds.maxEmphasisPunctuationDensityPer1000;
  const runFailure =
    metrics.longestEmphasisPunctuationRun > thresholds.maxEmphasisPunctuationRun;

  if (!densityFailure && !runFailure) return;

  const overflow = Math.max(
    0,
    metrics.longestEmphasisPunctuationRun - thresholds.maxEmphasisPunctuationRun
  );
  const severe =
    punctuationCount >= 8 ||
    metrics.longestEmphasisPunctuationRun >= thresholds.maxEmphasisPunctuationRun + 2 ||
    metrics.emphasisPunctuationDensityPer1000 >=
      thresholds.maxEmphasisPunctuationDensityPer1000 * 1.8;
  const match = findFirstRegexMatch(content, EMPHASIS_PUNCTUATION_PATTERN);

  issues.push({
    code: 'punctuation-emphasis-overload',
    severity: severe ? 'high' : 'medium',
    message: `느낌표/말줄임표 같은 강조 부호가 과밀하거나 ${metrics.longestEmphasisPunctuationRun}문장 연속되어 감정과 침묵을 문장부호가 대신합니다.`,
    evidence: runFailure
      ? findEmphasisPunctuationRunEvidence(content)
      : match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion: '강조 부호를 줄이고, 인물의 선택 변화, 대사 내용, 호흡이 끊기는 행동 비트, 상대 반응으로 같은 긴장과 망설임을 보이세요.',
    penalty: Math.min(
      22,
      8 +
        overflow * 3 +
        Math.ceil(
          Math.max(
            0,
            metrics.emphasisPunctuationDensityPer1000 -
              thresholds.maxEmphasisPunctuationDensityPer1000
          ) * 1.4
        )
    ),
    position: match?.index,
  });
}

function addGenericTeaserIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  const teaserCount = countRegexMatches(content, GENERIC_OMNISCIENT_TEASER_PATTERN);
  if (
    teaserCount < 2 ||
    metrics.genericTeaserDensityPer1000 <= thresholds.maxGenericTeaserDensityPer1000
  ) {
    return;
  }

  const match = findFirstRegexMatch(content, GENERIC_OMNISCIENT_TEASER_PATTERN);
  const severe =
    teaserCount >= 4 ||
    metrics.genericTeaserDensityPer1000 >= thresholds.maxGenericTeaserDensityPer1000 * 2;

  issues.push({
    code: 'generic-omniscient-teaser',
    severity: severe ? 'high' : 'medium',
    message: '구체 장면 근거 없이 운명/시작/예고를 선언하는 전지적 티저 문장이 반복됩니다.',
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion: '운명이나 시작을 선언하지 말고, 독자가 다음 위험을 추론할 수 있는 물증, 선택 비용, 인물 반응을 장면 안에 남기세요.',
    penalty: Math.min(
      22,
      8 +
        teaserCount * 4 +
        Math.ceil(
          Math.max(0, metrics.genericTeaserDensityPer1000 - thresholds.maxGenericTeaserDensityPer1000) *
            1.2
        )
    ),
    position: match?.index,
  });
}

function addThinCliffhangerEndingIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.thinCliffhangerEndingCount <= thresholds.maxThinCliffhangerEndingCount) return;

  const ending = findThinCliffhangerEnding(content);
  if (!ending) return;

  issues.push({
    code: 'thin-cliffhanger-ending',
    severity: metrics.endingCliffhangerSignalCount >= 2 ? 'high' : 'medium',
    message:
      '마지막 문단이 구체 사건 변화 없이 미해결 질문/예고문만 남겨 얇은 클리프행어처럼 끝납니다.',
    evidence: ending.text,
    suggestion:
      '마지막 문단에 새 물증, 보이는 위협, 인물의 선택 비용, 관계 변화, 되돌릴 수 없는 행동 중 하나를 실제 장면으로 남기거나, 예고문 대신 잔향 이미지로 닫으세요.',
    penalty: Math.min(22, 12 + metrics.endingCliffhangerSignalCount * 3),
    position: ending.index,
  });
}

function addShortSentenceRunIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.longestShortSentenceRun <= thresholds.maxShortSentenceRun) return;

  const overflow = metrics.longestShortSentenceRun - thresholds.maxShortSentenceRun;
  issues.push({
    code: 'monotone-short-sentence-run',
    severity: overflow >= 3 ? 'critical' : 'high',
    message: `짧은 서술문이 ${metrics.longestShortSentenceRun}문장 연속되어 끊어쓰기 AI 문체처럼 읽힙니다.`,
    evidence: findShortSentenceRunEvidence(content, thresholds.maxShortSentenceRun + 1),
    suggestion: '연속 단문 일부를 원인/대조/결과가 있는 중문이나 복문으로 묶고, 한두 개의 단문만 타격점에 남기세요.',
    penalty: Math.min(26, 12 + overflow * 4),
  });
}

function addUniformSentenceLengthCadenceIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (
    metrics.sentenceLengthVariationCoefficient >=
      thresholds.minSentenceLengthVariationCoefficient ||
    metrics.longestUniformSentenceLengthRun <= thresholds.maxUniformSentenceLengthRun
  ) {
    return;
  }

  const overflow = metrics.longestUniformSentenceLengthRun - thresholds.maxUniformSentenceLengthRun;
  const variationGap =
    thresholds.minSentenceLengthVariationCoefficient -
    metrics.sentenceLengthVariationCoefficient;
  issues.push({
    code: 'uniform-sentence-length-cadence',
    severity: overflow >= 3 || variationGap >= 0.1 ? 'high' : 'medium',
    message:
      `비슷한 길이의 서술문이 ${metrics.longestUniformSentenceLengthRun}문장 연속되고 ` +
      `문장 길이 변동 계수(${metrics.sentenceLengthVariationCoefficient})도 낮아 박자가 균일하게 잠깁니다.`,
    evidence: findUniformSentenceLengthEvidence(
      content,
      thresholds.maxUniformSentenceLengthRun + 1
    ),
    suggestion:
      '핵심 행동/대사 전후에는 짧은 결정문을 두고, 정보·감각·상대 반응은 긴 문장에 묶어 문단 내부 길이 대비를 만드세요.',
    penalty: Math.min(22, 10 + overflow * 3 + Math.ceil(variationGap * 20)),
  });
}

function addSameEndingIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.longestSameEndingRun <= thresholds.maxSameEndingRun) return;

  const overflow = metrics.longestSameEndingRun - thresholds.maxSameEndingRun;
  issues.push({
    code: 'same-ending-run',
    severity: 'high',
    message:
      `같은 어미 리듬이 ${metrics.longestSameEndingRun}문장 이어져 ` +
      `허용치 ${thresholds.maxSameEndingRun}문장을 넘습니다.`,
    evidence: findSameEndingEvidence(content, thresholds.maxSameEndingRun + 1),
    suggestion: '문장 길이, 종결어미, 종속절 위치를 바꿔 단문 나열감을 줄이세요.',
    penalty: Math.min(24, 8 + overflow * 4),
  });
}

function addDominantSentenceEndingIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.sentenceEndingCadenceSampleSize < 6) return;
  if (metrics.dominantSentenceEndingShare <= thresholds.maxDominantSentenceEndingShare) return;

  const cadence = analyzeSentenceEndingCadence(content);
  const shareText = `${Math.round(metrics.dominantSentenceEndingShare * 100)}%`;
  const thresholdText = `${Math.round(thresholds.maxDominantSentenceEndingShare * 100)}%`;
  const overflow = metrics.dominantSentenceEndingShare - thresholds.maxDominantSentenceEndingShare;
  const severe =
    metrics.dominantSentenceEndingShare >= thresholds.maxDominantSentenceEndingShare + 0.12 ||
    metrics.dominantSentenceEndingCount >= 8;

  issues.push({
    code: 'dominant-ending-cadence-lock',
    severity: severe ? 'high' : 'medium',
    message:
      `서술문 종결 계열 ${cadence.dominantEnding || 'unknown'}가 ` +
      `${metrics.dominantSentenceEndingCount}/${metrics.sentenceEndingCadenceSampleSize}문장(${shareText})을 차지해 ` +
      `허용치 ${thresholdText}를 넘습니다.`,
    evidence: findDominantSentenceEndingEvidence(content),
    suggestion:
      '연속 반복만 피하지 말고 문단 전체의 종결 팔레트를 넓히세요. 일부 문장은 명사절/대사/행동 결과/감각 단서/짧은 결정문으로 닫아 같은 과거 평서 리듬을 분산하세요.',
    penalty: Math.min(22, 14 + Math.ceil(overflow * 80)),
  });
}

function addDominantDialogueEndingIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.dialogueEndingCadenceSampleSize < 6) return;
  if (metrics.dominantDialogueEndingShare <= thresholds.maxDominantDialogueEndingShare) return;

  const cadence = analyzeDialogueEndingCadence(content);
  const shareText = `${Math.round(metrics.dominantDialogueEndingShare * 100)}%`;
  const thresholdText = `${Math.round(thresholds.maxDominantDialogueEndingShare * 100)}%`;
  const overflow = metrics.dominantDialogueEndingShare - thresholds.maxDominantDialogueEndingShare;
  const severe =
    metrics.dominantDialogueEndingShare >= thresholds.maxDominantDialogueEndingShare + 0.1 ||
    metrics.dominantDialogueEndingCount >= 8;

  issues.push({
    code: 'dialogue-ending-cadence-lock',
    severity: severe ? 'high' : 'medium',
    message:
      `대화문 말끝 ${cadence.dominantEnding || 'unknown'}가 ` +
      `${metrics.dominantDialogueEndingCount}/${metrics.dialogueEndingCadenceSampleSize}턴(${shareText})을 차지해 ` +
      `허용치 ${thresholdText}를 넘습니다.`,
    evidence: findDominantDialogueEndingEvidence(content),
    suggestion:
      '인물별 관계, 목적, 숨긴 감정, 존대 거리, 말버릇을 분리하세요. 같은 말끝 공식 일부를 질문 회피, 짧은 반박, 행동 비트, 침묵 뒤 조건 제시로 바꿔 화자 리듬을 나누세요.',
    penalty: Math.min(22, 14 + Math.ceil(overflow * 70)),
  });
}

function addDominantDialogueStarterIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.dialogueStarterCadenceSampleSize < 6) return;
  if (metrics.dominantDialogueStarterCount < 4) return;
  if (metrics.dominantDialogueStarterShare <= thresholds.maxDominantDialogueStarterShare) return;

  const cadence = analyzeDialogueStarterCadence(content);
  const shareText = `${Math.round(metrics.dominantDialogueStarterShare * 100)}%`;
  const thresholdText = `${Math.round(thresholds.maxDominantDialogueStarterShare * 100)}%`;
  const overflow =
    metrics.dominantDialogueStarterShare - thresholds.maxDominantDialogueStarterShare;
  const severe =
    metrics.dominantDialogueStarterShare >=
      thresholds.maxDominantDialogueStarterShare + 0.12 ||
    metrics.dominantDialogueStarterCount >= 7;

  issues.push({
    code: 'dialogue-starter-cadence-lock',
    severity: severe ? 'high' : 'medium',
    message:
      `대화문 말머리 ${cadence.dominantStarter || 'unknown'}가 ` +
      `${metrics.dominantDialogueStarterCount}/${metrics.dialogueStarterCadenceSampleSize}턴(${shareText})을 차지해 ` +
      `허용치 ${thresholdText}를 넘습니다.`,
    evidence: findDominantDialogueStarterEvidence(content),
    suggestion:
      '같은 담화표지로 턴을 열지 말고 즉답, 회피, 되묻기, 사물 조작, 행동 비트, 침묵 뒤 조건 제시처럼 인물별 전술과 입장 차이로 대화 진입점을 나누세요.',
    penalty: Math.min(20, 12 + Math.ceil(overflow * 60)),
  });
}

function addDialogueQuestionCascadeIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.dialogueCount < 6) return;

  const ratioFailure =
    metrics.dialogueQuestionTurnCount >= 5 &&
    metrics.dialogueQuestionRatio > thresholds.maxDialogueQuestionRatio;
  const runFailure =
    metrics.longestDialogueQuestionRun > thresholds.maxDialogueQuestionRun;

  if (!ratioFailure && !runFailure) return;

  const shareText = `${Math.round(metrics.dialogueQuestionRatio * 100)}%`;
  const thresholdText = `${Math.round(thresholds.maxDialogueQuestionRatio * 100)}%`;
  const runOverflow = Math.max(
    0,
    metrics.longestDialogueQuestionRun - thresholds.maxDialogueQuestionRun
  );
  const ratioOverflow = Math.max(
    0,
    metrics.dialogueQuestionRatio - thresholds.maxDialogueQuestionRatio
  );
  const severe =
    metrics.longestDialogueQuestionRun >= thresholds.maxDialogueQuestionRun + 2 ||
    metrics.dialogueQuestionRatio >= thresholds.maxDialogueQuestionRatio + 0.18;

  issues.push({
    code: 'dialogue-question-cascade',
    severity: severe ? 'high' : 'medium',
    message:
      `의문형 대사가 ${metrics.dialogueQuestionTurnCount}/${metrics.dialogueCount}턴(${shareText})이고 ` +
      `최장 ${metrics.longestDialogueQuestionRun}턴 이어져 허용치 ${thresholdText}/${thresholds.maxDialogueQuestionRun}턴을 넘습니다.`,
    evidence: findDialogueQuestionCascadeEvidence(
      content,
      thresholds.maxDialogueQuestionRun + 1
    ),
    suggestion:
      '질문 일부를 답변, 회피, 물증 제시, 조건/거래, 행동 선택, 관계 비용으로 바꿔 대화가 정보 요구만 반복하지 않고 장면 상태를 바꾸게 하세요.',
    penalty: Math.min(20, 10 + runOverflow * 3 + Math.ceil(ratioOverflow * 50)),
  });
}

function addDialogueVocativeCadenceIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.dialogueCount < 6) return;

  const ratioFailure =
    metrics.dialogueVocativeTurnCount >= 4 &&
    metrics.dialogueVocativeRatio > thresholds.maxDialogueVocativeRatio;
  const runFailure =
    metrics.longestDialogueVocativeRun > thresholds.maxDialogueVocativeRun;

  if (!ratioFailure && !runFailure) return;

  const shareText = `${Math.round(metrics.dialogueVocativeRatio * 100)}%`;
  const thresholdText = `${Math.round(thresholds.maxDialogueVocativeRatio * 100)}%`;
  const runOverflow = Math.max(
    0,
    metrics.longestDialogueVocativeRun - thresholds.maxDialogueVocativeRun
  );
  const ratioOverflow = Math.max(
    0,
    metrics.dialogueVocativeRatio - thresholds.maxDialogueVocativeRatio
  );
  const severe =
    metrics.longestDialogueVocativeRun >= thresholds.maxDialogueVocativeRun + 2 ||
    metrics.dialogueVocativeRatio >= thresholds.maxDialogueVocativeRatio + 0.18;

  issues.push({
    code: 'dialogue-vocative-cadence-lock',
    severity: severe ? 'high' : 'medium',
    message:
      `호명/호칭으로 시작하는 대사가 ${metrics.dialogueVocativeTurnCount}/${metrics.dialogueCount}턴(${shareText})이고 ` +
      `최장 ${metrics.longestDialogueVocativeRun}턴 이어져 허용치 ${thresholdText}/${thresholds.maxDialogueVocativeRun}턴을 넘습니다.`,
    evidence: findDialogueVocativeCadenceEvidence(
      content,
      thresholds.maxDialogueVocativeRun + 1
    ),
    suggestion:
      '이름·호칭 일부를 지우고 시선, 행동, 상대 반응, 물건의 위치로 수신자를 분명히 하세요. 호명은 장면 시작, 주의 환기, 압박 강화, 관계 거리 변화 순간에만 남기세요.',
    penalty: Math.min(20, 10 + runOverflow * 3 + Math.ceil(ratioOverflow * 50)),
  });
}

function addDialogueLexicalEchoIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.dialogueCount < 6) return;

  const ratioFailure =
    metrics.dialogueLexicalEchoTurnCount >= 4 &&
    metrics.dialogueLexicalEchoRatio > thresholds.maxDialogueLexicalEchoRatio;
  const runFailure =
    metrics.longestDialogueLexicalEchoRun > thresholds.maxDialogueLexicalEchoRun;

  if (!ratioFailure && !runFailure) return;

  const shareText = `${Math.round(metrics.dialogueLexicalEchoRatio * 100)}%`;
  const thresholdText = `${Math.round(thresholds.maxDialogueLexicalEchoRatio * 100)}%`;
  const runOverflow = Math.max(
    0,
    metrics.longestDialogueLexicalEchoRun - thresholds.maxDialogueLexicalEchoRun
  );
  const ratioOverflow = Math.max(
    0,
    metrics.dialogueLexicalEchoRatio - thresholds.maxDialogueLexicalEchoRatio
  );
  const severe =
    metrics.longestDialogueLexicalEchoRun >= thresholds.maxDialogueLexicalEchoRun + 2 ||
    metrics.dialogueLexicalEchoRatio >= thresholds.maxDialogueLexicalEchoRatio + 0.18;

  issues.push({
    code: 'dialogue-lexical-echo-chain',
    severity: severe ? 'high' : 'medium',
    message:
      `대화 턴 ${metrics.dialogueLexicalEchoTurnCount}/${metrics.dialogueCount}턴(${shareText})이 ` +
      `직전 대사의 핵심어를 되받고 최장 ${metrics.longestDialogueLexicalEchoRun}턴 이어져 ` +
      `허용치 ${thresholdText}/${thresholds.maxDialogueLexicalEchoRun}턴을 넘습니다.`,
    evidence: findDialogueLexicalEchoEvidence(
      content,
      thresholds.maxDialogueLexicalEchoRun + 1
    ),
    suggestion:
      '같은 핵심어 반복 일부를 인물별 목적, 회피, 대명사, 행동 비트, 새 단서, 관계 비용으로 바꾸세요. 대사가 같은 정보를 되풀이하지 않고 매 턴 장면 상태를 바꾸게 하세요.',
    penalty: Math.min(20, 10 + runOverflow * 3 + Math.ceil(ratioOverflow * 45)),
  });
}

function addDialogueParaphraseConfirmationIssue(
  content: string,
  metrics: ProseTasteMetrics,
  thresholds: ModeThresholds,
  issues: ProseTasteIssue[]
): void {
  if (metrics.dialogueCount < 6) return;

  const ratioFailure =
    metrics.dialogueParaphraseConfirmationTurnCount >= 4 &&
    metrics.dialogueParaphraseConfirmationRatio >
      thresholds.maxDialogueParaphraseConfirmationRatio;
  const runFailure =
    metrics.longestDialogueParaphraseConfirmationRun >
    thresholds.maxDialogueParaphraseConfirmationRun;

  if (!ratioFailure && !runFailure) return;

  const shareText = `${Math.round(metrics.dialogueParaphraseConfirmationRatio * 100)}%`;
  const thresholdText = `${Math.round(
    thresholds.maxDialogueParaphraseConfirmationRatio * 100
  )}%`;
  const runOverflow = Math.max(
    0,
    metrics.longestDialogueParaphraseConfirmationRun -
      thresholds.maxDialogueParaphraseConfirmationRun
  );
  const ratioOverflow = Math.max(
    0,
    metrics.dialogueParaphraseConfirmationRatio -
      thresholds.maxDialogueParaphraseConfirmationRatio
  );
  const severe =
    metrics.longestDialogueParaphraseConfirmationRun >=
      thresholds.maxDialogueParaphraseConfirmationRun + 2 ||
    metrics.dialogueParaphraseConfirmationRatio >=
      thresholds.maxDialogueParaphraseConfirmationRatio + 0.18;

  issues.push({
    code: 'dialogue-paraphrase-confirmation-chain',
    severity: severe ? 'high' : 'medium',
    message:
      `대화 턴 ${metrics.dialogueParaphraseConfirmationTurnCount}/${metrics.dialogueCount}턴(${shareText})이 ` +
      `상대 말이나 사건 정보를 다시 풀어 확인하고 최장 ${metrics.longestDialogueParaphraseConfirmationRun}턴 이어져 ` +
      `허용치 ${thresholdText}/${thresholds.maxDialogueParaphraseConfirmationRun}턴을 넘습니다.`,
    evidence: findDialogueParaphraseConfirmationEvidence(
      content,
      thresholds.maxDialogueParaphraseConfirmationRun + 1
    ),
    suggestion:
      '재진술 확인문 일부를 즉답, 오해, 회피, 조건 제시, 반박, 물증 조작, 관계 비용이 드러나는 말로 바꾸세요. 대사가 정보를 다시 정리하지 않고 인물의 목적 차이로 장면 상태를 바꾸게 하세요.',
    penalty: Math.min(20, 10 + runOverflow * 3 + Math.ceil(ratioOverflow * 45)),
  });
}

function addDesignJargonIssue(
  content: string,
  metrics: ProseTasteMetrics,
  issues: ProseTasteIssue[]
): void {
  if (metrics.designJargonCount === 0) return;

  const match = findFirstRegexMatch(content, DESIGN_JARGON_PATTERN);
  issues.push({
    code: 'design-jargon-in-prose',
    severity: 'critical',
    message: '설계/평가 용어가 원고 본문에 노출되었습니다.',
    evidence: match ? sliceEvidence(content, match.index, match.text.length) : '',
    suggestion: '복선, 훅, 보상 같은 설계어를 원고 밖으로 빼고 장면 속 단서/행동/결과로만 표현하세요.',
    penalty: Math.min(30, 16 + metrics.designJargonCount * 5),
    position: match?.index,
  });
}

function addWasFragmentIssue(content: string, issues: ProseTasteIssue[]): void {
  const match = findFirstRegexMatch(content, WAS_FRAGMENT_CHAIN_PATTERN);
  if (!match) return;

  issues.push({
    code: 'same-ending-run',
    severity: 'high',
    message: '"X였다. Y였다." 구조가 연속되어 보고서식 나열처럼 읽힙니다.',
    evidence: sliceEvidence(content, match.index, match.text.length),
    suggestion: '나열된 속성 중 원인/결과/대립을 골라 하나의 장면 동작 안에 묶으세요.',
    penalty: 18,
    position: match.index,
  });
}

function countTextUnits(content: string): number {
  return (content.match(/[가-힣A-Za-z0-9]/gu) ?? []).length;
}

function countRegexMatches(content: string, pattern: RegExp): number {
  return findRegexMatches(content, pattern).length;
}

function countTherapySpeakSentences(content: string): number {
  return splitSentences(content).filter(sentence =>
    isTherapySpeakSelfAnalysisSentence(sentence)
  ).length;
}

function findLongestTherapySpeakRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isTherapySpeakSelfAnalysisSentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findTherapySpeakEvidence(content: string, minRun: number): string {
  const current: string[] = [];
  let firstMatch = '';

  for (const sentence of splitSentences(content)) {
    if (isTherapySpeakSelfAnalysisSentence(sentence)) {
      if (!firstMatch) firstMatch = sentence;
      current.push(sentence);
      if (current.length >= minRun) {
        return current.slice(0, minRun).join(' ');
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch;
}

function isTherapySpeakSelfAnalysisSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || isDialogueDominantBlock(trimmed)) return false;

  const termCount = countRegexMatches(trimmed, THERAPY_SPEAK_TERM_PATTERN);
  if (termCount === 0) return false;

  return termCount >= 2 || THERAPY_SPEAK_ANALYSIS_PATTERN.test(trimmed);
}

function countBackstoryExpositionSentences(content: string): number {
  return splitSentences(content).filter(isBackstoryExpositionSentence).length;
}

function findLongestBackstoryExpositionRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isBackstoryExpositionSentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findBackstoryExpositionEvidence(content: string, minRun: number): string {
  const current: string[] = [];
  let firstMatch = '';

  for (const sentence of splitSentences(content)) {
    if (isBackstoryExpositionSentence(sentence)) {
      if (!firstMatch) firstMatch = sentence;
      current.push(sentence);
      if (current.length >= minRun) {
        return current.slice(0, minRun).join(' ');
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch;
}

function isBackstoryExpositionSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || isDialogueDominantBlock(trimmed)) return false;
  if (!BACKSTORY_TIME_CUE_PATTERN.test(trimmed)) return false;

  return (
    BACKSTORY_EXPLANATION_PATTERN.test(trimmed) ||
    BACKSTORY_HISTORY_ABSTRACT_PATTERN.test(trimmed) ||
    countTextUnits(trimmed) >= 24
  );
}

function countRelationshipMontageSummarySentences(content: string): number {
  return splitSentences(content).filter(isRelationshipMontageSummarySentence).length;
}

function findLongestRelationshipMontageSummaryRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isRelationshipMontageSummarySentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findRelationshipMontageSummaryEvidence(
  content: string,
  minRun: number
): string {
  const current: string[] = [];
  let firstMatch = '';

  for (const sentence of splitSentences(content)) {
    if (isRelationshipMontageSummarySentence(sentence)) {
      if (!firstMatch) firstMatch = sentence;
      current.push(sentence);
      if (current.length >= minRun) {
        return current.slice(0, minRun).join(' ');
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch;
}

function isRelationshipMontageSummarySentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 10 || isDialogueDominantBlock(trimmed)) {
    return false;
  }

  const hasGroundedAction = RELATIONSHIP_GROUNDED_ACTION_PATTERN.test(trimmed);
  const hasTimeCue = RELATIONSHIP_MONTAGE_TIME_CUE_PATTERN.test(trimmed);
  const hasSummaryMarker =
    RELATIONSHIP_MONTAGE_SUMMARY_MARKER_PATTERN.test(trimmed);
  const hasRelationshipSubject =
    RELATIONSHIP_DEVELOPMENT_SUBJECT_PATTERN.test(trimmed);
  const hasAbstractChange =
    RELATIONSHIP_DEVELOPMENT_CHANGE_PATTERN.test(trimmed);
  const summarySignals =
    Number(hasTimeCue) + Number(hasSummaryMarker) + Number(hasRelationshipSubject);

  if (hasGroundedAction && summarySignals < 3) return false;

  return hasAbstractChange && summarySignals >= 2;
}

function countTimeSkipSummarySentences(content: string): number {
  return splitSentences(content).filter(isTimeSkipSummarySentence).length;
}

function findLongestTimeSkipSummaryRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isTimeSkipSummarySentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findTimeSkipSummaryEvidence(content: string, minRun: number): string {
  const current: string[] = [];
  let firstMatch = '';

  for (const sentence of splitSentences(content)) {
    if (isTimeSkipSummarySentence(sentence)) {
      if (!firstMatch) firstMatch = sentence;
      current.push(sentence);
      if (current.length >= minRun) {
        return current.slice(0, minRun).join(' ');
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch;
}

function isTimeSkipSummarySentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 8 || isDialogueDominantBlock(trimmed)) {
    return false;
  }
  if (isRelationshipMontageSummarySentence(trimmed)) return false;

  const hasTimeCue = TIME_SKIP_SUMMARY_TIME_CUE_PATTERN.test(trimmed);
  const hasStatusSubject = TIME_SKIP_SUMMARY_STATUS_PATTERN.test(trimmed);
  const hasAbstractChange = TIME_SKIP_SUMMARY_CHANGE_PATTERN.test(trimmed);

  if (!hasAbstractChange) return false;
  if (!hasTimeCue && !hasStatusSubject) return false;
  if (TIME_SKIP_SUMMARY_GROUNDED_PATTERN.test(trimmed)) return false;

  return true;
}

function countContrastiveReframeSentences(content: string): number {
  return collectContrastiveReframeFlags(content).filter(Boolean).length;
}

function findLongestContrastiveReframeRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const isReframe of collectContrastiveReframeFlags(content)) {
    if (isReframe) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findContrastiveReframeEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const flags = collectContrastiveReframeFlags(content);
  const current: string[] = [];
  let firstMatch = '';

  for (let index = 0; index < sentences.length; index += 1) {
    if (flags[index]) {
      firstMatch ||= sentences[index];
      current.push(sentences[index]);
      if (current.length >= minRun) {
        return current.slice(0, minRun).join(' ');
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch;
}

function collectContrastiveReframeFlags(content: string): boolean[] {
  const sentences = splitSentences(content);
  const flags = sentences.map(sentence => isContrastiveReframeSentence(sentence));

  for (let index = 0; index < sentences.length - 1; index += 1) {
    if (
      isContrastiveReframeSetupSentence(sentences[index]) &&
      isContrastiveReframePayoffSentence(sentences[index + 1])
    ) {
      flags[index] = true;
      flags[index + 1] = true;
    }
  }

  return flags;
}

function isContrastiveReframeSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 8 || isDialogueDominantBlock(trimmed)) {
    return false;
  }
  if (!CONTRASTIVE_REFRAME_INLINE_PATTERN.test(trimmed)) return false;

  return !CONTRASTIVE_REFRAME_GROUNDED_PATTERN.test(trimmed);
}

function isContrastiveReframeSetupSentence(sentence: string): boolean {
  const trimmed = sentence.trim().replace(/[.!?。！？]+$/u, '');
  if (!trimmed || trimmed.length < 8 || isDialogueDominantBlock(trimmed)) {
    return false;
  }
  if (CONTRASTIVE_REFRAME_GROUNDED_PATTERN.test(trimmed)) return false;

  return CONTRASTIVE_REFRAME_SETUP_PATTERN.test(trimmed);
}

function isContrastiveReframePayoffSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || countTextUnits(trimmed) > 32 || isDialogueDominantBlock(trimmed)) {
    return false;
  }
  if (CONTRASTIVE_REFRAME_GROUNDED_PATTERN.test(trimmed)) return false;

  return CONTRASTIVE_REFRAME_PAYOFF_PATTERN.test(trimmed);
}

function countLoreTerms(content: string): number {
  return splitSentences(content).reduce(
    (total, sentence) => total + extractLoreTerms(sentence).length,
    0
  );
}

function findLoreTermOverloadSentences(
  content: string
): Array<{ text: string; index: number; terms: string[] }> {
  const sentences = splitSentences(content);
  const result: Array<{ text: string; index: number; terms: string[] }> = [];

  for (const sentence of sentences) {
    const terms = extractLoreTerms(sentence);
    if (!isLoreNameOverloadSentence(sentence, terms)) continue;

    const index = content.indexOf(sentence);
    result.push({
      text: sentence,
      index: index === -1 ? 0 : index,
      terms,
    });
  }

  return result;
}

function findLongestLoreTermRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isLoreNameOverloadSentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findLoreTermOverloadEvidence(content: string, minRun: number): string {
  const current: Array<{ text: string; terms: string[] }> = [];
  let first: { text: string; terms: string[] } | undefined;

  for (const sentence of splitSentences(content)) {
    const terms = extractLoreTerms(sentence);
    if (isLoreNameOverloadSentence(sentence, terms)) {
      const item = { text: sentence, terms };
      first ??= item;
      current.push(item);
      if (current.length >= minRun) {
        return formatLoreTermEvidence(current.slice(0, minRun));
      }
      continue;
    }

    current.length = 0;
  }

  return first ? formatLoreTermEvidence([first]) : splitSentences(content).slice(0, 3).join(' ');
}

function formatLoreTermEvidence(items: Array<{ text: string; terms: string[] }>): string {
  return items
    .map(item => `[설정어: ${item.terms.slice(0, 5).join(', ')}] ${item.text}`)
    .join(' ');
}

function isLoreNameOverloadSentence(sentence: string, terms = extractLoreTerms(sentence)): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || isDialogueDominantBlock(trimmed)) return false;
  if (terms.length < 2) return false;

  const hasExposition = LORE_EXPOSITION_PATTERN.test(trimmed);
  const hasGrounding = LORE_GROUNDED_ACTION_PATTERN.test(trimmed);
  if (terms.length >= 4) return true;
  if (terms.length >= 3 && (hasExposition || !hasGrounding)) return true;

  return terms.length >= 2 && hasExposition && !hasGrounding;
}

function extractLoreTerms(sentence: string): string[] {
  const matches = findRegexMatches(sentence, LORE_TERM_PATTERN)
    .map(match => normalizeLoreTerm(match.text))
    .filter(term => term.length > 0);
  return Array.from(new Set(matches));
}

function normalizeLoreTerm(term: string): string {
  return term
    .replace(/\s+/gu, ' ')
    .replace(/[은는이가을를과와의도만에서으로로,.\s]+$/gu, '')
    .trim();
}

function countSystemStatBlockSentences(content: string): number {
  return splitSentences(content).filter(sentence => isSystemStatBlockSentence(sentence)).length;
}

function findLongestSystemStatBlockRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isSystemStatBlockSentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findSystemStatBlockEvidence(content: string): string {
  const current: Array<{ text: string; terms: string[] }> = [];
  let firstMatch: { text: string; terms: string[] } | undefined;

  for (const sentence of splitSentences(content)) {
    const terms = extractSystemStatTerms(sentence);
    if (isSystemStatBlockSentence(sentence, terms)) {
      const item = { text: sentence, terms };
      firstMatch ??= item;
      current.push(item);
      if (current.length >= 3) {
        return formatSystemStatBlockEvidence(current.slice(0, 3));
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch ? formatSystemStatBlockEvidence([firstMatch]) : '';
}

function formatSystemStatBlockEvidence(
  items: Array<{ text: string; terms: string[] }>
): string {
  return items
    .map(item => `[시스템 수치: ${item.terms.slice(0, 5).join(', ')}] ${item.text}`)
    .join(' ');
}

function isSystemStatBlockSentence(
  sentence: string,
  terms = extractSystemStatTerms(sentence)
): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || isDialogueDominantBlock(trimmed)) return false;
  if (terms.length === 0) return false;

  const hasNumericStat = SYSTEM_STAT_NUMERIC_PATTERN.test(trimmed);
  const hasNotification = SYSTEM_STAT_NOTIFICATION_PATTERN.test(trimmed);
  const hasUiBracket = SYSTEM_STAT_UI_BRACKET_PATTERN.test(trimmed);
  const hasDenseList =
    terms.length >= 3 &&
    /(?:[+\-]?\d+(?:\.\d+)?%?|[:：,;/|]|Lv\.?)/iu.test(trimmed);
  const isSystemStatLine =
    hasUiBracket || hasNumericStat || hasNotification || hasDenseList;

  if (!isSystemStatLine) return false;

  return !SYSTEM_STAT_TURN_PATTERN.test(trimmed);
}

function extractSystemStatTerms(sentence: string): string[] {
  const matches = findRegexMatches(sentence, SYSTEM_STAT_TERM_PATTERN)
    .map(match => normalizeSystemStatTerm(match.text))
    .filter(term => term.length > 0);
  return Array.from(new Set(matches));
}

function normalizeSystemStatTerm(term: string): string {
  return term
    .replace(/\s+/gu, ' ')
    .replace(/[은는이가을를과와의도만에서으로로:：,.\]\[\s]+$/gu, '')
    .trim();
}

function countDeclaredResolveSentences(content: string): number {
  return splitSentences(content).filter(isDeclaredResolveSentence).length;
}

function findLongestDeclaredResolveRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isDeclaredResolveSentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findDeclaredResolveEvidence(content: string): string {
  const current: string[] = [];
  let firstMatch = '';

  for (const sentence of splitSentences(content)) {
    if (isDeclaredResolveSentence(sentence)) {
      firstMatch ||= sentence;
      current.push(sentence);
      if (current.length >= 3) {
        return current.slice(0, 3).join(' ');
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch;
}

function isDeclaredResolveSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 10 || isDialogueDominantBlock(trimmed)) {
    return false;
  }
  if (!DECLARED_RESOLVE_PATTERN.test(trimmed)) return false;

  const hasGrounding = DECLARED_RESOLVE_GROUNDED_PATTERN.test(trimmed);
  const hasActionBridge = /(?:그래서|그러자|대신|결국|그제야|바로|곧|문을|전화를|문자를|봉투를|사진을|파일을|서명|신고|거절|선택|포기)/u.test(
    trimmed
  );

  return !(hasGrounding && hasActionBridge);
}

function countRevelationSummarySentences(content: string): number {
  return splitSentences(content).filter(isRevelationSummarySentence).length;
}

function findLongestRevelationSummaryRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isRevelationSummarySentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findRevelationSummaryEvidence(content: string): string {
  const current: string[] = [];
  let firstMatch = '';

  for (const sentence of splitSentences(content)) {
    if (isRevelationSummarySentence(sentence)) {
      firstMatch ||= sentence;
      current.push(sentence);
      if (current.length >= 3) {
        return current.slice(0, 3).join(' ');
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch;
}

function isRevelationSummarySentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 10 || isDialogueDominantBlock(trimmed)) {
    return false;
  }
  if (!REVELATION_SUMMARY_PATTERN.test(trimmed)) return false;

  const hasGrounding = REVELATION_SUMMARY_GROUNDED_PATTERN.test(trimmed);
  const hasInvestigationBridge =
    /(?:그래서|그러자|대신|결국|그제야|바로|곧|확인|비교|대조|꺼내|펼쳐|적어|찍어|전화|신고|추적|주소|번호|로그|기록|사진|파일|증거|단서)/u.test(
      trimmed
    );

  return !(hasGrounding && hasInvestigationBridge);
}

function countProceduralChecklistSentences(content: string): number {
  return splitSentences(content).filter(isProceduralChecklistSentence).length;
}

function findLongestProceduralChecklistRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isProceduralChecklistSentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findProceduralChecklistEvidence(content: string): string {
  const current: string[] = [];
  let firstMatch = '';

  for (const sentence of splitSentences(content)) {
    if (isProceduralChecklistSentence(sentence)) {
      firstMatch ||= sentence;
      current.push(sentence);
      if (current.length >= 3) {
        return current.slice(0, 3).join(' ');
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch;
}

function isProceduralChecklistSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 10 || isDialogueDominantBlock(trimmed)) {
    return false;
  }
  if (!PROCEDURAL_CHECKLIST_PATTERN.test(trimmed)) return false;

  return !PROCEDURAL_CHECKLIST_TURN_PATTERN.test(trimmed);
}

function countActionChoreographySentences(content: string): number {
  return splitSentences(content).filter(isActionChoreographySentence).length;
}

function findLongestActionChoreographyRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const sentence of splitSentences(content)) {
    if (isActionChoreographySentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }

    current = 0;
  }

  return longest;
}

function findActionChoreographyEvidence(content: string): string {
  const current: string[] = [];
  let firstMatch = '';

  for (const sentence of splitSentences(content)) {
    if (isActionChoreographySentence(sentence)) {
      firstMatch ||= sentence;
      current.push(sentence);
      if (current.length >= 3) {
        return current.slice(0, 3).join(' ');
      }
      continue;
    }

    current.length = 0;
  }

  return firstMatch;
}

function isActionChoreographySentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 8 || isDialogueDominantBlock(trimmed)) {
    return false;
  }
  if (!ACTION_CHOREOGRAPHY_PATTERN.test(trimmed)) return false;

  return !ACTION_CHOREOGRAPHY_TURN_PATTERN.test(trimmed);
}

function extractDialogueMatches(content: string): Array<{ text: string; index: number; endIndex: number }> {
  const matches: Array<{ text: string; index: number; endIndex: number }> = [];
  let match: RegExpExecArray | null;
  const regex = new RegExp(QUOTED_DIALOGUE_PATTERN.source, QUOTED_DIALOGUE_PATTERN.flags);

  while ((match = regex.exec(content)) !== null) {
    const text = (match[1] ?? match[2] ?? match[3] ?? match[4] ?? '').trim();
    if (text.length > 0) {
      matches.push({ text, index: match.index, endIndex: match.index + match[0].length });
    }
    if (match[0].length === 0) regex.lastIndex += 1;
  }

  return matches;
}

function findFirstExpositoryDialogueMatch(
  content: string
): { text: string; index: number } | undefined {
  return extractDialogueMatches(content).find(match =>
    DIALOGUE_EXPOSITION_PATTERN.test(match.text)
  );
}

function findFirstLongDialogueTurnMatch(
  content: string,
  maxDialogueTurnLength: number
): { text: string; index: number } | undefined {
  return extractDialogueMatches(content).find(
    match => countTextUnits(match.text) > maxDialogueTurnLength
  );
}

function findLongestDialogueGroundingGapRun(
  content: string,
  dialogueMatches: Array<{ text: string; index: number; endIndex: number }> = extractDialogueMatches(content)
): number {
  return findDialogueGroundingGapRuns(content, dialogueMatches)
    .reduce((longest, run) => Math.max(longest, run.count), 0);
}

function findFirstDialogueGroundingGapRunMatch(
  content: string,
  minRun: number
): { text: string; index: number } | undefined {
  const run = findDialogueGroundingGapRuns(content)
    .find(item => item.count >= minRun);
  if (!run) return undefined;

  return {
    text: content.slice(run.startIndex, run.endIndex),
    index: run.startIndex,
  };
}

function findDialogueGroundingGapRuns(
  content: string,
  dialogueMatches: Array<{ text: string; index: number; endIndex: number }> = extractDialogueMatches(content)
): Array<{ count: number; startIndex: number; endIndex: number }> {
  const runs: Array<{ count: number; startIndex: number; endIndex: number }> = [];
  let currentCount = 0;
  let currentStartIndex = 0;

  for (let index = 0; index < dialogueMatches.length; index++) {
    const match = dialogueMatches[index];
    const previous = dialogueMatches[index - 1];
    const groundedGap = previous
      ? hasDialogueGroundingBeatBetween(content, previous.endIndex, match.index)
      : false;

    if (index === 0 || !groundedGap) {
      if (currentCount === 0) currentStartIndex = match.index;
      currentCount += 1;
    } else {
      if (currentCount > 0) {
        runs.push({
          count: currentCount,
          startIndex: currentStartIndex,
          endIndex: previous.endIndex,
        });
      }
      currentCount = 1;
      currentStartIndex = match.index;
    }
  }

  const last = dialogueMatches.at(-1);
  if (last && currentCount > 0) {
    runs.push({
      count: currentCount,
      startIndex: currentStartIndex,
      endIndex: last.endIndex,
    });
  }

  return runs;
}

function hasDialogueGroundingBeatBetween(
  content: string,
  previousDialogueEnd: number,
  currentDialogueStart: number
): boolean {
  const gap = content.slice(previousDialogueEnd, currentDialogueStart);
  if (gap.split(/\r?\n/u).some(line => SCENE_BREAK_LINE_PATTERN.test(line))) return true;

  const trimmed = gap.replace(/\s+/gu, ' ').trim();
  if (!trimmed) return false;

  const tag = trimmed.match(NEUTRAL_DIALOGUE_TAG_PATTERN);
  const withoutNeutralTag = tag
    ? trimmed.slice(tag[0].length).replace(/^[\s,.!?。！？]+/u, '').trim()
    : trimmed;
  if (countTextUnits(withoutNeutralTag) < 8) return false;
  if (DIALOGUE_GROUNDING_BEAT_PATTERN.test(withoutNeutralTag)) return true;
  if (CAUSAL_TURN_PATTERN.test(withoutNeutralTag)) return true;

  return countTextUnits(withoutNeutralTag) >= 32;
}

function findFirstRoteDialogueReplyMatch(
  content: string
): { text: string; index: number } | undefined {
  return extractDialogueMatches(content).find(match => isRoteDialogueReply(match.text));
}

function findFirstNeutralDialogueTagMatch(
  content: string
): { text: string; index: number } | undefined {
  for (const match of extractDialogueMatches(content)) {
    const tag = findNeutralDialogueTagAfter(content, match.endIndex);
    if (tag) {
      const text = content.slice(match.index, Math.min(content.length, tag.index + tag.text.length));
      return {
        text: text.trim(),
        index: match.index,
      };
    }
  }

  return undefined;
}

function findLongestRoteDialogueReplyRun(
  dialogueMatches: Array<{ text: string; index: number; endIndex: number }>
): number {
  let longest = 0;
  let current = 0;

  for (const match of dialogueMatches) {
    if (isRoteDialogueReply(match.text)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findLongestNeutralDialogueTagRun(
  content: string,
  dialogueMatches: Array<{ text: string; index: number; endIndex: number }>
): number {
  let longest = 0;
  let current = 0;

  for (const match of dialogueMatches) {
    if (hasNeutralDialogueTagAfter(content, match.endIndex)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function isDialogueQuestionTurn(dialogue: string): boolean {
  const normalized = dialogue.replace(/\s+/gu, ' ').trim();
  if (!normalized) return false;
  if (/[?？]\s*["'“”‘’」』)\]]*\s*$/u.test(normalized)) return true;

  const stripped = normalized
    .replace(/["'“”‘’「」『』()[\]]/gu, '')
    .replace(/[.!…]+$/u, '')
    .trim();

  return (
    /^(왜|뭐|무슨|어떻게|어디|언제|누가|누구|정말|설마|혹시|도대체)(?=[,\s]|$)/u.test(
      stripped
    ) &&
    /(니|냐|나|까|어|아|죠|요|습니까|나요|건데|라고|맞아|알아|봤어|했어)$/u.test(
      stripped
    )
  );
}

function findLongestDialogueQuestionRun(
  dialogueMatches: Array<{ text: string; index: number; endIndex: number }>
): number {
  let longest = 0;
  let current = 0;

  for (const match of dialogueMatches) {
    if (isDialogueQuestionTurn(match.text)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findDialogueQuestionCascadeEvidence(content: string, minimumRun = 4): string {
  const dialogueMatches = extractDialogueMatches(content);
  const current: Array<{ text: string; index: number; endIndex: number }> = [];

  for (const match of dialogueMatches) {
    if (isDialogueQuestionTurn(match.text)) {
      current.push(match);
      if (current.length >= minimumRun) {
        return current
          .slice(0, minimumRun)
          .map(item => `"${item.text}"`)
          .join(' ');
      }
    } else {
      current.length = 0;
    }
  }

  const questionTurns = dialogueMatches.filter(match => isDialogueQuestionTurn(match.text));
  return (questionTurns.length > 0 ? questionTurns : dialogueMatches)
    .slice(0, 6)
    .map(match => `"${match.text}"`)
    .join(' ');
}

function countSilenceStallSentences(content: string): number {
  return splitSentences(content).filter(isSilenceStallSentence).length;
}

function findLongestSilenceStallRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isSilenceStallSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findSilenceStallEvidence(content: string): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isSilenceStallSentence(sentence)) {
      current.push(sentence);
      if (current.length >= 3) return current.slice(0, 4).join(' ');
    } else if (current.length > 0) {
      break;
    }
  }

  const firstStall = sentences.find(isSilenceStallSentence);
  return firstStall ?? sentences.slice(0, 3).join(' ');
}

function isSilenceStallSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;

  return SILENCE_STALL_PATTERN.test(trimmed);
}

function countMelodramaticCaptionSentences(content: string): number {
  return splitSentences(content).filter(isMelodramaticCaptionSentence).length;
}

function findLongestMelodramaticCaptionRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isMelodramaticCaptionSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findMelodramaticCaptionEvidence(content: string): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isMelodramaticCaptionSentence(sentence)) {
      current.push(sentence);
      if (current.length >= 3) return current.slice(0, 4).join(' ');
    } else if (current.length > 0) {
      break;
    }
  }

  const firstCaption = sentences.find(isMelodramaticCaptionSentence);
  return firstCaption ?? sentences.slice(0, 3).join(' ');
}

function isMelodramaticCaptionSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;

  return MELODRAMATIC_EMOTION_CAPTION_PATTERN.test(trimmed);
}

function findLongestStockReactionBeatRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isStockReactionBeatSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findStockReactionBeatEvidence(content: string): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isStockReactionBeatSentence(sentence)) {
      current.push(sentence);
      if (current.length >= 3) return current.slice(0, 4).join(' ');
    } else if (current.length > 0) {
      break;
    }
  }

  const match = findFirstRegexMatch(content, STOCK_REACTION_BEAT_PATTERN);
  return match ? sliceEvidence(content, match.index, match.text.length) : sentences.slice(0, 3).join(' ');
}

function isStockReactionBeatSentence(sentence: string): boolean {
  return new RegExp(STOCK_REACTION_BEAT_PATTERN.source, 'u').test(sentence);
}

function countFacialExpressionBeatSentences(content: string): number {
  return splitSentences(content).filter(isFacialExpressionBeatSentence).length;
}

function findLongestFacialExpressionBeatRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isFacialExpressionBeatSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findFacialExpressionBeatEvidence(content: string): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isFacialExpressionBeatSentence(sentence)) {
      current.push(sentence);
      if (current.length >= 3) return current.slice(0, 4).join(' ');
    } else if (current.length > 0) {
      break;
    }
  }

  const firstFacialBeat = sentences.find(isFacialExpressionBeatSentence);
  return firstFacialBeat ?? sentences.slice(0, 3).join(' ');
}

function isFacialExpressionBeatSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || isDialogueDominantBlock(trimmed)) return false;

  return new RegExp(FACIAL_EXPRESSION_BEAT_PATTERN.source, 'u').test(trimmed);
}

function countBodyReactionSubjectSentences(content: string): number {
  return splitSentences(content).filter(isBodyReactionSubjectSentence).length;
}

function findLongestBodyReactionSubjectRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isBodyReactionSubjectSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findBodyReactionSubjectEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isBodyReactionSubjectSentence(sentence)) {
      current.push(sentence);
      if (current.length >= minRun) return current.slice(0, minRun).join(' ');
    } else {
      current.length = 0;
    }
  }

  const firstBodyReaction = sentences.find(isBodyReactionSubjectSentence);
  return firstBodyReaction ?? sentences.slice(0, minRun).join(' ');
}

function isBodyReactionSubjectSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;

  return BODY_REACTION_SUBJECT_SENTENCE_PATTERN.test(trimmed);
}

function findLongestClicheEmotionImageRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isClicheEmotionImageSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findClicheEmotionImageEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isClicheEmotionImageSentence(sentence)) {
      current.push(sentence);
      if (current.length >= minRun) return current.slice(0, minRun).join(' ');
    } else if (current.length > 0) {
      break;
    }
  }

  const match = findFirstRegexMatch(content, CLICHE_EMOTION_IMAGE_PATTERN);
  return match ? sliceEvidence(content, match.index, match.text.length) : sentences.slice(0, minRun).join(' ');
}

function isClicheEmotionImageSentence(sentence: string): boolean {
  return new RegExp(CLICHE_EMOTION_IMAGE_PATTERN.source, 'u').test(sentence);
}

function findLongestEmotionLabelRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isEmotionLabelSentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function findLongestSensoryWallpaperRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isSensoryWallpaperSentence(sentence)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function findSensoryWallpaperEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isSensoryWallpaperSentence(sentence)) {
      current.push(sentence);
      if (current.length >= minRun) return current.slice(0, minRun).join(' ');
    } else {
      current.length = 0;
    }
  }

  const firstSensoryWallpaper = sentences.find(isSensoryWallpaperSentence);
  return firstSensoryWallpaper ?? sentences.slice(0, minRun).join(' ');
}

function isSensoryWallpaperSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;
  if (!new RegExp(SENSORY_PATTERN.source, 'u').test(trimmed)) return false;
  if (hasCausalTurnMarker(trimmed)) return false;
  if (SENSORY_STORY_TURN_PATTERN.test(trimmed)) return false;

  const sensoryCount = countRegexMatches(trimmed, SENSORY_PATTERN);
  return sensoryCount >= 1;
}

function findEmotionLabelCarouselEvidence(
  content: string,
  minRun: number
): { text: string; index: number } {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isEmotionLabelSentence(sentence)) {
      current.push(sentence);
      if (current.length >= minRun) {
        const text = current.join(' ');
        const index = content.indexOf(current[0]);
        return { text, index: index === -1 ? 0 : index };
      }
    } else {
      current.length = 0;
    }
  }

  const firstEmotionLabel = sentences.find(isEmotionLabelSentence);
  if (firstEmotionLabel) {
    const index = content.indexOf(firstEmotionLabel);
    return { text: firstEmotionLabel, index: index === -1 ? 0 : index };
  }

  return { text: sentences.slice(0, minRun).join(' '), index: 0 };
}

function isEmotionLabelSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (/^["“”'‘’「」『』]/u.test(trimmed)) return false;
  if (hasCausalTurnMarker(trimmed)) return false;

  return new RegExp(EMOTION_LABEL_PATTERN.source, 'u').test(trimmed);
}

function countSymbolicAbstractionStackSentences(content: string): number {
  return splitSentences(content).filter(isSymbolicAbstractionStackSentence).length;
}

function findLongestSymbolicAbstractionRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isSymbolicAbstractionStackSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findSymbolicAbstractionEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isSymbolicAbstractionStackSentence(sentence)) {
      current.push(sentence);
      if (current.length >= minRun) return current.slice(0, minRun).join(' ');
    } else {
      current.length = 0;
    }
  }

  const firstSymbolic = sentences.find(isSymbolicAbstractionStackSentence);
  return firstSymbolic ?? sentences.slice(0, minRun).join(' ');
}

function isSymbolicAbstractionStackSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;

  const symbolicCount = countRegexMatches(trimmed, SYMBOLIC_ABSTRACTION_PATTERN);
  if (symbolicCount < 2) return false;

  const hasSymbolicPile =
    symbolicCount >= 3 ||
    (symbolicCount >= 2 &&
      (new RegExp(METAPHOR_PATTERN.source, 'u').test(trimmed) ||
        new RegExp(EVALUATIVE_MODIFIER_PATTERN.source, 'u').test(trimmed)));
  if (!hasSymbolicPile) return false;

  const hasConcreteAnchor = SYMBOLIC_CONCRETE_ANCHOR_PATTERN.test(trimmed);
  const hasStoryAction = CAUSAL_TURN_PATTERN.test(trimmed) || DIALOGUE_GROUNDING_BEAT_PATTERN.test(trimmed);
  const hasEmbodiedSpecificity =
    new RegExp(SENSORY_PATTERN.source, 'u').test(trimmed) ||
    new RegExp(BODY_REACTION_SUBJECT_SENTENCE_PATTERN.source, 'u').test(trimmed);

  return !(hasConcreteAnchor && (hasStoryAction || hasEmbodiedSpecificity));
}

function findLongestVagueAtmosphereModifierRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isVagueAtmosphereModifierSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findVagueAtmosphereModifierEvidence(content: string): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isVagueAtmosphereModifierSentence(sentence)) {
      current.push(sentence);
      if (current.length >= 3) return current.slice(0, 4).join(' ');
    } else if (current.length > 0) {
      break;
    }
  }

  const match = findFirstRegexMatch(content, VAGUE_ATMOSPHERE_MODIFIER_PATTERN);
  return match ? sliceEvidence(content, match.index, match.text.length) : sentences.slice(0, 3).join(' ');
}

function isVagueAtmosphereModifierSentence(sentence: string): boolean {
  return new RegExp(VAGUE_ATMOSPHERE_MODIFIER_PATTERN.source, 'u').test(sentence);
}

function countEvaluativeModifierStackSentences(content: string): number {
  return splitSentences(content).filter(isEvaluativeModifierStackSentence).length;
}

function findLongestEvaluativeModifierRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isEvaluativeModifierStackSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findEvaluativeModifierEvidence(content: string): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isEvaluativeModifierStackSentence(sentence)) {
      current.push(sentence);
      if (current.length >= 3) return current.slice(0, 4).join(' ');
    } else if (current.length > 0) {
      break;
    }
  }

  const firstStackedSentence = sentences.find(isEvaluativeModifierStackSentence);
  if (firstStackedSentence) return firstStackedSentence;

  const match = findFirstRegexMatch(content, EVALUATIVE_MODIFIER_PATTERN);
  return match ? sliceEvidence(content, match.index, match.text.length) : sentences.slice(0, 3).join(' ');
}

function isEvaluativeModifierStackSentence(sentence: string): boolean {
  const matches = sentence.match(new RegExp(EVALUATIVE_MODIFIER_PATTERN.source, 'gu')) ?? [];
  const uniqueStems = new Set(matches.map(normalizeEvaluativeModifier));
  return uniqueStems.size >= 2;
}

function normalizeEvaluativeModifier(value: string): string {
  return value.replace(/\s+/gu, '').slice(0, 3);
}

function countRhetoricalQuestionSentences(content: string): number {
  return splitSentences(content).filter(isRhetoricalQuestionSentence).length;
}

function findLongestRhetoricalQuestionRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isRhetoricalQuestionSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findRhetoricalQuestionEvidence(content: string): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isRhetoricalQuestionSentence(sentence)) {
      current.push(sentence);
      if (current.length >= 3) return current.slice(0, 4).join(' ');
    } else if (current.length > 0) {
      break;
    }
  }

  const firstQuestion = sentences.find(isRhetoricalQuestionSentence);
  return firstQuestion ?? sentences.slice(0, 3).join(' ');
}

function isRhetoricalQuestionSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed.includes('?')) return false;
  if (/["“”'‘’「」『』]/u.test(trimmed)) return false;

  return RHETORICAL_QUESTION_CUE_PATTERN.test(trimmed);
}

function countSubtextExplanationSentences(content: string): number {
  return splitSentences(content).filter(isSubtextExplanationSentence).length;
}

function findLongestSubtextExplanationRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isSubtextExplanationSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findSubtextExplanationEvidence(content: string): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isSubtextExplanationSentence(sentence)) {
      current.push(sentence);
      if (current.length >= 3) return current.slice(0, 4).join(' ');
    } else if (current.length > 0) {
      break;
    }
  }

  const firstExplanation = sentences.find(isSubtextExplanationSentence);
  return firstExplanation ?? sentences.slice(0, 3).join(' ');
}

function isSubtextExplanationSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;

  return SUBTEXT_EXPLANATION_PATTERN.test(trimmed);
}

function countAmbiguousReferenceSentences(content: string): number {
  return splitSentences(content).filter(isAmbiguousReferenceSentence).length;
}

function findLongestAmbiguousReferenceRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isAmbiguousReferenceSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findAmbiguousReferenceEvidence(content: string): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isAmbiguousReferenceSentence(sentence)) {
      current.push(sentence);
      if (current.length >= 3) return current.slice(0, 4).join(' ');
    } else {
      current.length = 0;
    }
  }

  const ambiguousSentences = sentences.filter(isAmbiguousReferenceSentence);
  return (ambiguousSentences.length > 0 ? ambiguousSentences : sentences)
    .slice(0, 4)
    .join(' ');
}

function isAmbiguousReferenceSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;

  if (AMBIGUOUS_REFERENCE_START_PATTERN.test(trimmed)) {
    return true;
  }

  if (EXPLICIT_REFERENCE_ANCHOR_PATTERN.test(trimmed)) {
    return false;
  }

  return countRegexMatches(trimmed, AMBIGUOUS_REFERENCE_TOKEN_PATTERN) >= 2;
}

interface ThinCliffhangerEnding {
  index: number;
  text: string;
}

function findThinCliffhangerEnding(content: string): ThinCliffhangerEnding | undefined {
  const ending = findLastNarrativeParagraph(content);
  if (!ending) return undefined;

  const text = normalizeWhitespace(ending.text);
  if (countTextUnits(text) < 12) return undefined;
  if (countThinCliffhangerSignals(text) === 0) return undefined;
  if (hasConcreteEndingTrigger(text)) return undefined;

  return {
    index: ending.index,
    text,
  };
}

function countEndingCliffhangerSignals(content: string): number {
  const ending = findLastNarrativeParagraph(content);
  return ending ? countThinCliffhangerSignals(ending.text) : 0;
}

function countEndingConcreteTriggers(content: string): number {
  const ending = findLastNarrativeParagraph(content);
  if (!ending) return 0;

  const concreteCount = countRegexMatches(ending.text, ENDING_CONCRETE_TRIGGER_PATTERN);
  const actionCount = countRegexMatches(ending.text, ENDING_TRIGGER_ACTION_PATTERN);
  return concreteCount > 0 && actionCount > 0 ? concreteCount + actionCount : 0;
}

function countThinCliffhangerSignals(text: string): number {
  return countRegexMatches(text, THIN_CLIFFHANGER_SIGNAL_PATTERN);
}

function hasConcreteEndingTrigger(text: string): boolean {
  const concreteCount = countRegexMatches(text, ENDING_CONCRETE_TRIGGER_PATTERN);
  const actionCount = countRegexMatches(text, ENDING_TRIGGER_ACTION_PATTERN);
  return concreteCount > 0 && actionCount > 0;
}

function findLastNarrativeParagraph(
  content: string
): { index: number; text: string } | undefined {
  const ranges = findParagraphRanges(content);

  for (let index = ranges.length - 1; index >= 0; index--) {
    const range = ranges[index];
    const text = content.slice(range.start, range.end).trim();
    if (!text || /^#{1,6}\s/u.test(text)) continue;
    if (/^(?:[-*_]\s*){3,}$/u.test(text)) continue;

    return {
      index: range.start,
      text,
    };
  }

  return undefined;
}

interface PovMindJumpParagraph {
  index: number;
  text: string;
  subjects: string[];
}

const POV_PRIVATE_STATE_SUBJECT_STOP_WORDS = new Set([
  '감정',
  '공기',
  '공포',
  '관계',
  '그것',
  '기록',
  '기분',
  '기억',
  '느낌',
  '단서',
  '문제',
  '분노',
  '불안',
  '사건',
  '사실',
  '상황',
  '생각',
  '선택',
  '세상',
  '시선',
  '시간',
  '알림',
  '운명',
  '의미',
  '이것',
  '저것',
  '증거',
  '진실',
  '침묵',
  '표정',
  '후회',
]);

function findPovMindJumpParagraphs(content: string): PovMindJumpParagraph[] {
  return findParagraphRanges(content)
    .map(range => {
      const text = content.slice(range.start, range.end).replace(/\s+/gu, ' ').trim();
      return {
        index: range.start,
        text,
        subjects: extractPovPrivateStateSubjects(text),
      };
    })
    .filter(paragraph => paragraph.subjects.length >= 2);
}

function findLongestPovMindJumpRun(content: string): number {
  let longest = 0;
  let current = 0;

  for (const range of findParagraphRanges(content)) {
    const text = content.slice(range.start, range.end);
    if (extractPovPrivateStateSubjects(text).length >= 2) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function extractPovPrivateStateSubjects(paragraph: string): string[] {
  const withoutDialogue = paragraph.replace(QUOTED_DIALOGUE_PATTERN, ' ');
  const subjects: string[] = [];
  POV_PRIVATE_STATE_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = POV_PRIVATE_STATE_PATTERN.exec(withoutDialogue)) !== null) {
    const subject = normalizePovPrivateStateSubject(match[1] ?? '');
    if (!subject || POV_PRIVATE_STATE_SUBJECT_STOP_WORDS.has(subject)) continue;
    if (!subjects.includes(subject)) subjects.push(subject);
  }

  const namedSubjects = subjects.filter(subject => subject !== '그' && subject !== '그녀');
  return namedSubjects.length > 0 ? namedSubjects : subjects;
}

function normalizePovPrivateStateSubject(subject: string): string {
  return subject.replace(/\s+/gu, '').trim();
}

interface SceneTransitionBlock {
  text: string;
  start: number;
  isSceneBreak: boolean;
}

interface SceneTransitionGroundingGap {
  index: number;
  evidence: string;
}

function countSceneTransitionGroundingGaps(content: string): number {
  return findSceneTransitionGroundingGaps(content).length;
}

function findLongestSceneTransitionGroundingGapRun(content: string): number {
  const blocks = splitSceneTransitionBlocks(content);
  let longest = 0;
  let current = 0;

  for (let index = 0; index < blocks.length; index++) {
    if (!blocks[index].isSceneBreak) continue;

    const previous = findAdjacentSceneBlock(blocks, index, -1);
    const next = findAdjacentSceneBlock(blocks, index, 1);
    if (previous && next && isSceneTransitionGroundingGap(next.text)) {
      current += 1;
    } else {
      current = 0;
    }

    longest = Math.max(longest, current);
  }

  return longest;
}

function findFirstSceneTransitionGroundingGap(
  content: string
): SceneTransitionGroundingGap | undefined {
  return findSceneTransitionGroundingGaps(content)[0];
}

function findSceneTransitionGroundingGaps(content: string): SceneTransitionGroundingGap[] {
  const blocks = splitSceneTransitionBlocks(content);
  const gaps: SceneTransitionGroundingGap[] = [];

  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (!block.isSceneBreak) continue;

    const previous = findAdjacentSceneBlock(blocks, index, -1);
    const next = findAdjacentSceneBlock(blocks, index, 1);
    if (!previous || !next || !isSceneTransitionGroundingGap(next.text)) continue;

    gaps.push({
      index: block.start,
      evidence: `${trimEvidenceBlock(previous.text)} / ${block.text.trim()} / ${trimEvidenceBlock(next.text)}`,
    });
  }

  return gaps;
}

function splitSceneTransitionBlocks(content: string): SceneTransitionBlock[] {
  const blocks: SceneTransitionBlock[] = [];
  const linePattern = /[^\r\n]*(?:\r?\n|$)/gu;
  let paragraphText = '';
  let paragraphStart = 0;
  let match: RegExpExecArray | null;

  const flushParagraph = () => {
    const text = paragraphText.replace(/\s+/gu, ' ').trim();
    if (text) {
      blocks.push({
        text,
        start: paragraphStart,
        isSceneBreak: false,
      });
    }
    paragraphText = '';
  };

  while ((match = linePattern.exec(content)) !== null) {
    if (match[0] === '') break;

    const rawLine = match[0];
    const lineStart = match.index;
    const line = rawLine.replace(/\r?\n$/u, '');
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (SCENE_BREAK_LINE_PATTERN.test(trimmed)) {
      flushParagraph();
      blocks.push({
        text: trimmed,
        start: lineStart,
        isSceneBreak: true,
      });
      continue;
    }

    if (!paragraphText) {
      paragraphStart = lineStart;
      paragraphText = trimmed;
    } else {
      paragraphText += ` ${trimmed}`;
    }
  }

  flushParagraph();
  return blocks;
}

function findAdjacentSceneBlock(
  blocks: SceneTransitionBlock[],
  startIndex: number,
  direction: -1 | 1
): SceneTransitionBlock | undefined {
  for (let index = startIndex + direction; index >= 0 && index < blocks.length; index += direction) {
    if (!blocks[index].isSceneBreak) return blocks[index];
  }

  return undefined;
}

function isSceneTransitionGroundingGap(text: string): boolean {
  const firstUnit = getSceneTransitionOpening(text);
  if (!firstUnit) return false;
  if (SCENE_TRANSITION_GROUNDING_PATTERN.test(firstUnit)) return false;
  if (SCENE_TRANSITION_CONTINUITY_PATTERN.test(firstUnit)) return false;
  if (isDialogueDominantBlock(firstUnit)) return false;

  return countTextUnits(firstUnit) >= 12;
}

function getSceneTransitionOpening(text: string): string {
  return text
    .replace(/\s+/gu, ' ')
    .split(/[.!?。！？](?=\s|$)/u)[0]
    .trim();
}

function isDialogueDominantBlock(text: string): boolean {
  const stripped = text.replace(QUOTED_DIALOGUE_PATTERN, '').replace(/\s+/gu, '');
  const dialogueLength = extractDialogueMatches(text).reduce((total, match) => total + match.text.length, 0);
  return dialogueLength > 0 && stripped.length < dialogueLength;
}

function trimEvidenceBlock(text: string): string {
  return text.replace(/\s+/gu, ' ').trim().slice(0, 90);
}

function isRoteDialogueReply(text: string): boolean {
  const normalized = text
    .replace(/\s+/gu, ' ')
    .replace(/[.?!…。]+$/gu, '')
    .trim();

  return ROTE_DIALOGUE_REPLY_PATTERN.test(normalized);
}

function hasNeutralDialogueTagAfter(content: string, endIndex: number): boolean {
  return findNeutralDialogueTagAfter(content, endIndex) !== undefined;
}

function findNeutralDialogueTagAfter(
  content: string,
  endIndex: number
): { text: string; index: number } | undefined {
  const lookahead = content.slice(endIndex, endIndex + 80);
  const match = lookahead.match(NEUTRAL_DIALOGUE_TAG_PATTERN);
  if (!match || match.index === undefined) return undefined;

  const text = match[0].trim();
  if (!text) return undefined;

  return {
    text,
    index: endIndex + match.index,
  };
}

function findFirstRegexMatch(content: string, pattern: RegExp): { text: string; index: number } | undefined {
  return findRegexMatches(content, pattern, 1)[0];
}

function findFirstPatternMatch(
  content: string,
  patterns: RegExp[]
): { text: string; index: number } | undefined {
  for (const pattern of patterns) {
    const match = findFirstRegexMatch(content, pattern);
    if (match) return match;
  }

  return undefined;
}

function findRegexMatches(
  content: string,
  pattern: RegExp,
  limit = Number.POSITIVE_INFINITY
): Array<{ text: string; index: number }> {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, flags);
  const matches: Array<{ text: string; index: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    matches.push({ text: match[0], index: match.index });
    if (matches.length >= limit) break;
    if (match[0].length === 0) regex.lastIndex += 1;
  }

  return matches;
}

function findLongestSameEndingRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;
  let previousEnding = '';

  for (const sentence of sentences) {
    const ending = classifyEnding(sentence);
    if (!ending) {
      current = 0;
      previousEnding = '';
      continue;
    }

    if (ending === previousEnding) {
      current += 1;
    } else {
      current = 1;
      previousEnding = ending;
    }

    longest = Math.max(longest, current);
  }

  return longest;
}

function findSameEndingEvidence(content: string, minimumRun = 5): string {
  const sentences = splitSentences(content);
  let current: string[] = [];
  let previousEnding = '';

  for (const sentence of sentences) {
    const ending = classifyEnding(sentence);
    if (!ending || ending !== previousEnding) {
      current = ending ? [sentence] : [];
      previousEnding = ending;
    } else {
      current.push(sentence);
    }

    if (current.length >= minimumRun) {
      return current.slice(0, minimumRun).join(' ');
    }
  }

  return sentences.slice(0, minimumRun).join(' ');
}

function analyzeSentenceEndingCadence(content: string): {
  dominantEnding: string;
  dominantShare: number;
  dominantCount: number;
  sampleSize: number;
} {
  const endings = splitSentences(content)
    .filter(isSentenceEndingCadenceEligible)
    .map(classifyEnding)
    .filter(Boolean);

  if (endings.length === 0) {
    return {
      dominantEnding: '',
      dominantShare: 0,
      dominantCount: 0,
      sampleSize: 0,
    };
  }

  const counts = new Map<string, number>();
  for (const ending of endings) {
    counts.set(ending, (counts.get(ending) ?? 0) + 1);
  }

  const [dominantEnding, dominantCount] = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];

  return {
    dominantEnding,
    dominantShare: round2(dominantCount / endings.length),
    dominantCount,
    sampleSize: endings.length,
  };
}

function findDominantSentenceEndingEvidence(content: string): string {
  const cadence = analyzeSentenceEndingCadence(content);
  const sentences = splitSentences(content).filter(sentence =>
    isSentenceEndingCadenceEligible(sentence)
  );
  const dominantSentences = sentences.filter(
    sentence => classifyEnding(sentence) === cadence.dominantEnding
  );

  return (dominantSentences.length > 0 ? dominantSentences : sentences)
    .slice(0, 6)
    .join(' ');
}

function isSentenceEndingCadenceEligible(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;
  if (!/[.!?]$/u.test(trimmed)) return false;

  return classifyEnding(trimmed).length > 0;
}

function analyzeDialogueEndingCadence(content: string): {
  dominantEnding: string;
  dominantShare: number;
  dominantCount: number;
  sampleSize: number;
} {
  const endings = extractDialogueMatches(content)
    .map(match => classifyDialogueEnding(match.text))
    .filter(Boolean);

  if (endings.length === 0) {
    return {
      dominantEnding: '',
      dominantShare: 0,
      dominantCount: 0,
      sampleSize: 0,
    };
  }

  const counts = new Map<string, number>();
  for (const ending of endings) {
    counts.set(ending, (counts.get(ending) ?? 0) + 1);
  }

  const [dominantEnding, dominantCount] = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];

  return {
    dominantEnding,
    dominantShare: round2(dominantCount / endings.length),
    dominantCount,
    sampleSize: endings.length,
  };
}

function findDominantDialogueEndingEvidence(content: string): string {
  const cadence = analyzeDialogueEndingCadence(content);
  const dialogueMatches = extractDialogueMatches(content);
  const dominantDialogue = dialogueMatches.filter(
    match => classifyDialogueEnding(match.text) === cadence.dominantEnding
  );

  return (dominantDialogue.length > 0 ? dominantDialogue : dialogueMatches)
    .slice(0, 6)
    .map(match => `"${match.text}"`)
    .join(' ');
}

function hasDialogueVocativeOpening(dialogue: string): boolean {
  return classifyDialogueVocativeOpening(dialogue).length > 0;
}

function classifyDialogueVocativeOpening(dialogue: string): string {
  const normalized = dialogue
    .replace(/\s+/gu, ' ')
    .replace(/^["'“”‘’「」『』(\[]+/gu, '')
    .trim();

  if (!normalized) return '';

  const bareName = normalized.match(
    /^([가-힣]{2,4})(?:아|야)(?=[,\s.!?…]|$)/u
  )?.[0];
  if (bareName) return bareName.replace(/[,\s.!?…]+$/u, '');

  const nameWithTitle = normalized.match(
    /^([가-힣]{2,4})\s*(?:씨|님|형|누나|언니|오빠|선배|후배|팀장|대표|작가|검사|형사|박사|교수|사장)(?:님)?(?=[,\s.!?…]|$)/u
  )?.[0];
  if (nameWithTitle) return nameWithTitle.replace(/[,\s.!?…]+$/u, '');

  const titleOnly = normalized.match(
    /^(?:선생님|팀장님|대표님|작가님|검사님|형사님|박사님|교수님|사장님|선배님|후배님)(?=[,\s.!?…]|$)/u
  )?.[0];

  return titleOnly?.replace(/[,\s.!?…]+$/u, '') ?? '';
}

function findLongestDialogueVocativeRun(
  dialogueMatches: Array<{ text: string; index: number; endIndex: number }>
): number {
  let longest = 0;
  let current = 0;

  for (const match of dialogueMatches) {
    if (hasDialogueVocativeOpening(match.text)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findDialogueVocativeCadenceEvidence(content: string, minimumRun = 4): string {
  const dialogueMatches = extractDialogueMatches(content);
  const current: Array<{ text: string; index: number; endIndex: number }> = [];

  for (const match of dialogueMatches) {
    if (hasDialogueVocativeOpening(match.text)) {
      current.push(match);
      if (current.length >= minimumRun) {
        return current
          .slice(0, minimumRun)
          .map(item => `"${item.text}"`)
          .join(' ');
      }
    } else {
      current.length = 0;
    }
  }

  const vocativeTurns = dialogueMatches.filter(match =>
    hasDialogueVocativeOpening(match.text)
  );
  return (vocativeTurns.length > 0 ? vocativeTurns : dialogueMatches)
    .slice(0, 6)
    .map(match => `"${match.text}"`)
    .join(' ');
}

const DIALOGUE_LEXICAL_ECHO_STOP_WORDS = new Set([
  '그',
  '이',
  '저',
  '거',
  '것',
  '그거',
  '이거',
  '저거',
  '그것',
  '이것',
  '저것',
  '여기',
  '거기',
  '저기',
  '지금',
  '오늘',
  '내일',
  '어제',
  '나',
  '너',
  '내',
  '네',
  '넌',
  '난',
  '우리',
  '당신',
  '정말',
  '진짜',
  '그냥',
  '혹시',
  '대체',
  '왜',
  '뭐',
  '무슨',
  '어떻게',
  '어디',
  '언제',
  '누구',
  '그래',
  '아니',
  '맞아',
  '좋아',
  '싫어',
  '알아',
  '몰라',
  '알겠어',
  '됐어',
  '있어',
  '없어',
  '해야',
  '했어',
  '했지',
  '하면',
  '해서',
  '하고',
  '다시',
  '아직',
  '이미',
  '먼저',
  '이제',
  '사실',
  '일단',
  '잠깐',
  '그럼',
  '그러면',
  '하지만',
  '근데',
  '그런데',
  '그래도',
  '그래서',
  '그러니까',
  '때문',
  '정도',
  '사람',
  '누군가',
  '무언가',
  'everything',
  'nothing',
  'something',
  'really',
  'just',
  'then',
  'there',
  'here',
]);

type DialogueMatch = { text: string; index: number; endIndex: number };

interface DialogueLexicalEchoAnalysis {
  echoTurnCount: number;
  longestRun: number;
}

function analyzeDialogueLexicalEcho(
  dialogueMatches: DialogueMatch[]
): DialogueLexicalEchoAnalysis {
  let echoTurnCount = 0;
  let longestRun = 0;
  let currentRun = 0;
  let previousTokens: Set<string> | undefined;

  for (const match of dialogueMatches) {
    const tokens = extractDialogueLexicalEchoTokens(match.text);
    const sharedTokens = previousTokens ? findSharedTokens(previousTokens, tokens) : [];

    if (sharedTokens.length > 0) {
      echoTurnCount += 1;
      currentRun = currentRun === 0 ? 2 : currentRun + 1;
      longestRun = Math.max(longestRun, currentRun);
    } else {
      currentRun = 0;
    }

    previousTokens = tokens;
  }

  return { echoTurnCount, longestRun };
}

function findDialogueLexicalEchoEvidence(content: string, minimumRun = 5): string {
  const dialogueMatches = extractDialogueMatches(content);
  const current: Array<{ match: DialogueMatch; sharedTokens: string[] }> = [];
  let previousMatch: DialogueMatch | undefined;
  let previousTokens: Set<string> | undefined;

  for (const match of dialogueMatches) {
    const tokens = extractDialogueLexicalEchoTokens(match.text);
    const sharedTokens = previousTokens ? findSharedTokens(previousTokens, tokens) : [];

    if (sharedTokens.length > 0 && previousMatch) {
      if (current.length === 0) {
        current.push({ match: previousMatch, sharedTokens: [] });
      }
      current.push({ match, sharedTokens });
      if (current.length >= minimumRun) {
        return current.slice(0, minimumRun).map(formatDialogueEchoEvidence).join(' ');
      }
    } else {
      current.length = 0;
    }

    previousMatch = match;
    previousTokens = tokens;
  }

  const echoEvidence = findDialogueLexicalEchoPairs(dialogueMatches)
    .slice(0, 6)
    .map(formatDialogueEchoEvidence);

  return (echoEvidence.length > 0 ? echoEvidence : dialogueMatches.slice(0, 6).map(match => `"${match.text}"`))
    .join(' ');
}

function findDialogueLexicalEchoPairs(
  dialogueMatches: DialogueMatch[]
): Array<{ match: DialogueMatch; sharedTokens: string[] }> {
  const result: Array<{ match: DialogueMatch; sharedTokens: string[] }> = [];
  let previousTokens: Set<string> | undefined;

  for (const match of dialogueMatches) {
    const tokens = extractDialogueLexicalEchoTokens(match.text);
    const sharedTokens = previousTokens ? findSharedTokens(previousTokens, tokens) : [];
    if (sharedTokens.length > 0) result.push({ match, sharedTokens });
    previousTokens = tokens;
  }

  return result;
}

function formatDialogueEchoEvidence(item: { match: DialogueMatch; sharedTokens: string[] }): string {
  const echoText =
    item.sharedTokens.length > 0 ? ` [echo: ${item.sharedTokens.slice(0, 3).join(', ')}]` : '';
  return `"${item.match.text}"${echoText}`;
}

function extractDialogueLexicalEchoTokens(dialogue: string): Set<string> {
  const tokens = new Set<string>();
  const normalized = dialogue
    .toLowerCase()
    .replace(/[“”‘’"'「」『』()[\]{}.,!?…:;\\/|<>~`*_+=\-]/gu, ' ');

  for (const match of normalized.matchAll(/[가-힣A-Za-z0-9]{2,}/gu)) {
    const token = normalizeDialogueLexicalEchoToken(match[0]);
    if (!token) continue;
    tokens.add(token);
  }

  return tokens;
}

function normalizeDialogueLexicalEchoToken(token: string): string {
  let normalized = token.toLowerCase().trim();
  if (!normalized) return '';

  if (/^[가-힣]+$/u.test(normalized)) {
    normalized = normalized.replace(
      /(에게서는|한테서는|으로부터|로부터|에게|한테|에서|으로|라는|이라고|라고|이랑|처럼|까지|부터|마다|밖에|조차|마저|라도|든지|이며|이고|이라|와|과|은|는|이|가|을|를|에|로|도|만|의|야|아)$/u,
      ''
    );
  }

  if (normalized.length < 2) return '';
  if (DIALOGUE_LEXICAL_ECHO_STOP_WORDS.has(normalized)) return '';
  if (/^\d+$/u.test(normalized)) return '';

  return normalized;
}

function findSharedTokens(left: Set<string>, right: Set<string>): string[] {
  const shared: string[] = [];
  for (const token of right) {
    if (left.has(token)) shared.push(token);
  }
  return shared;
}

const DIALOGUE_PARAPHRASE_CONFIRMATION_MARKER_PATTERN =
  /^(?:그러니까|그러면|그럼|즉|다시\s*말(?:해서|하면)|바꿔\s*말하면|말하자면|결국|요컨대|한마디로|정리하면|결론은|네\s*말은|그\s*말은|지금\s*말은)(?=[,\s.!?…]|$)/u;

const DIALOGUE_PARAPHRASE_CONFIRMATION_ENDING_PATTERN =
  /(?:라는|다는|였다는|이었다는|이란|란|였단|이었단)\s*(?:거(?:야|지|네|죠|군|군요|냐|니|구나|잖아)?|것(?:이야|이지|이네|인가)?|뜻(?:이야|이지|이네|인가)?|말(?:이야|이지|이네|인가)?|소리(?:야|지|네)?|얘기(?:야|지|네)?|셈(?:이야|이지|이네)?|건가|거냐|거네|거지)(?:[.!?…]+)?$/u;

const DIALOGUE_PARAPHRASE_DIRECT_SUBJECT_PATTERN =
  /^(?:네\s*말은|그\s*말은|지금\s*말은|방금\s*말은|그게\s*무슨\s*뜻이냐면)(?=[,\s.!?…]|$)/u;

function isDialogueParaphraseConfirmationTurn(dialogue: string): boolean {
  return classifyDialogueParaphraseConfirmation(dialogue).length > 0;
}

function classifyDialogueParaphraseConfirmation(dialogue: string): string {
  const normalized = dialogue
    .replace(/\s+/gu, ' ')
    .replace(/^["'“”‘’「」『』(\[]+/gu, '')
    .replace(/["'“”‘’」』)\]]+$/gu, '')
    .trim();

  if (!normalized) return '';

  const marker = normalized.match(DIALOGUE_PARAPHRASE_CONFIRMATION_MARKER_PATTERN)?.[0] ?? '';
  const hasConfirmationEnding = DIALOGUE_PARAPHRASE_CONFIRMATION_ENDING_PATTERN.test(normalized);
  const hasDirectSubject = DIALOGUE_PARAPHRASE_DIRECT_SUBJECT_PATTERN.test(normalized);

  if ((marker || hasDirectSubject) && hasConfirmationEnding) {
    return (marker || normalized.match(DIALOGUE_PARAPHRASE_DIRECT_SUBJECT_PATTERN)?.[0] || '재진술')
      .replace(/[,\s.!?…]+$/u, '')
      .trim();
  }

  return '';
}

function findLongestDialogueParaphraseConfirmationRun(
  dialogueMatches: DialogueMatch[]
): number {
  let longest = 0;
  let current = 0;

  for (const match of dialogueMatches) {
    if (isDialogueParaphraseConfirmationTurn(match.text)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findDialogueParaphraseConfirmationEvidence(
  content: string,
  minimumRun = 4
): string {
  const dialogueMatches = extractDialogueMatches(content);
  const current: DialogueMatch[] = [];

  for (const match of dialogueMatches) {
    if (isDialogueParaphraseConfirmationTurn(match.text)) {
      current.push(match);
      if (current.length >= minimumRun) {
        return current
          .slice(0, minimumRun)
          .map(formatDialogueParaphraseConfirmationEvidence)
          .join(' ');
      }
    } else {
      current.length = 0;
    }
  }

  const paraphraseTurns = dialogueMatches.filter(match =>
    isDialogueParaphraseConfirmationTurn(match.text)
  );
  return (paraphraseTurns.length > 0 ? paraphraseTurns : dialogueMatches)
    .slice(0, 6)
    .map(formatDialogueParaphraseConfirmationEvidence)
    .join(' ');
}

function formatDialogueParaphraseConfirmationEvidence(match: DialogueMatch): string {
  const marker = classifyDialogueParaphraseConfirmation(match.text);
  const markerText = marker ? ` [재진술: ${marker}]` : '';
  return `"${match.text}"${markerText}`;
}

function analyzeDialogueStarterCadence(content: string): {
  dominantStarter: string;
  dominantShare: number;
  dominantCount: number;
  sampleSize: number;
} {
  const dialogueMatches = extractDialogueMatches(content);

  if (dialogueMatches.length === 0) {
    return {
      dominantStarter: '',
      dominantShare: 0,
      dominantCount: 0,
      sampleSize: 0,
    };
  }

  const starters = dialogueMatches
    .map(match => classifyDialogueStarter(match.text))
    .filter(Boolean);

  if (starters.length === 0) {
    return {
      dominantStarter: '',
      dominantShare: 0,
      dominantCount: 0,
      sampleSize: dialogueMatches.length,
    };
  }

  const counts = new Map<string, number>();
  for (const starter of starters) {
    counts.set(starter, (counts.get(starter) ?? 0) + 1);
  }

  const [dominantStarter, dominantCount] = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];

  return {
    dominantStarter,
    dominantShare: round2(dominantCount / dialogueMatches.length),
    dominantCount,
    sampleSize: dialogueMatches.length,
  };
}

function findDominantDialogueStarterEvidence(content: string): string {
  const cadence = analyzeDialogueStarterCadence(content);
  const dialogueMatches = extractDialogueMatches(content);
  const dominantDialogue = dialogueMatches.filter(
    match => classifyDialogueStarter(match.text) === cadence.dominantStarter
  );

  return (dominantDialogue.length > 0 ? dominantDialogue : dialogueMatches)
    .slice(0, 6)
    .map(match => `"${match.text}"`)
    .join(' ');
}

function classifyDialogueStarter(dialogue: string): string {
  const normalized = dialogue
    .replace(/\s+/gu, ' ')
    .replace(/^["'“”‘’「」『』(\[]+/gu, '')
    .trim();

  return (
    normalized.match(
      /^(아니|그럼|그러면|그러니까|그래도|하지만|근데|그런데|그래서|잠깐|있잖아|그게|사실|솔직히|일단)(?=[,\s.!?…]|$)/u
    )?.[1] ?? ''
  );
}

function classifyDialogueEnding(dialogue: string): string {
  const normalized = dialogue
    .replace(/\s+/gu, ' ')
    .replace(/["'“”‘’「」『』)\]]+$/gu, '')
    .replace(/[.!?…]+$/u, '')
    .trim();
  const word = normalized.match(/([가-힣]{2,12})$/u)?.[1] ?? '';
  if (!word) return '';

  const formula = word.match(
    /(거야|거냐|거니|잖아|잖아요|입니다|입니까|습니다|습니까|없어|있어|맞아|좋아|싫어|알아|몰라|됐어|했어)$/u
  )?.[1];
  if (formula) return formula;

  return word.length >= 2 && word.length <= 4 ? word : '';
}

function findLongestShortSentenceRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isShortNarrationSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findLongestEmphasisPunctuationRun(content: string): number {
  const units = splitPunctuationCadenceUnits(content);
  let longest = 0;
  let current = 0;

  for (const unit of units) {
    if (hasEmphasisPunctuation(unit)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findEmphasisPunctuationRunEvidence(content: string): string {
  const units = splitPunctuationCadenceUnits(content);
  const current: string[] = [];

  for (const unit of units) {
    if (hasEmphasisPunctuation(unit)) {
      current.push(unit);
    } else {
      current.length = 0;
    }

    if (current.length >= 4) {
      return current.slice(0, 4).join(' ');
    }
  }

  const match = findFirstRegexMatch(content, EMPHASIS_PUNCTUATION_PATTERN);
  return match ? sliceEvidence(content, match.index, match.text.length) : units.slice(0, 4).join(' ');
}

function hasEmphasisPunctuation(text: string): boolean {
  return /(?:!|[?]{2,}|[!?]{2,}|…|\.{3,})/u.test(text);
}

function splitPunctuationCadenceUnits(content: string): string[] {
  return content
    .replace(/\s+/gu, ' ')
    .replace(/([.!?。！？…]+["”’」』)\]]*)(?=\s|$)/gu, '$1\n')
    .split(/\n+/u)
    .map(sentence => sentence.trim())
    .filter(Boolean);
}

function findLongestRepeatedSubjectRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;
  let previousSubject = '';

  for (const sentence of sentences) {
    const subject = extractSentenceStarterSubject(sentence);
    if (!subject) {
      current = 0;
      previousSubject = '';
      continue;
    }

    if (subject === previousSubject) {
      current += 1;
    } else {
      current = 1;
      previousSubject = subject;
    }

    longest = Math.max(longest, current);
  }

  return longest;
}

function countConnectiveStarters(content: string): number {
  return splitSentences(content)
    .filter(sentence => extractSentenceStarterConnective(sentence).length > 0)
    .length;
}

function findLongestFillerAdverbRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (hasFillerAdverbCadence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findFillerAdverbEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (hasFillerAdverbCadence(sentence)) {
      current.push(sentence);
    } else {
      current.length = 0;
    }

    if (current.length >= minRun) {
      return current.slice(0, minRun).join(' ');
    }
  }

  const adverbSentences = sentences.filter(hasFillerAdverbCadence);
  return (adverbSentences.length > 0 ? adverbSentences : sentences)
    .slice(0, Math.max(3, minRun))
    .join(' ');
}

function hasFillerAdverbCadence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;
  FILLER_ADVERB_CADENCE_PATTERN.lastIndex = 0;
  return FILLER_ADVERB_CADENCE_PATTERN.test(trimmed);
}

function countSimultaneousActionSentences(content: string): number {
  return splitSentences(content).filter(isSimultaneousActionSentence).length;
}

function findLongestSimultaneousActionRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isSimultaneousActionSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findSimultaneousActionEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isSimultaneousActionSentence(sentence)) {
      current.push(sentence);
    } else {
      current.length = 0;
    }

    if (current.length >= minRun) {
      return current.slice(0, minRun).join(' ');
    }
  }

  const actionSentences = sentences.filter(isSimultaneousActionSentence);
  return (actionSentences.length > 0 ? actionSentences : sentences)
    .slice(0, Math.max(3, minRun))
    .join(' ');
}

function findFirstSimultaneousActionSentence(
  content: string
): { index: number; text: string } | undefined {
  const sentences = splitSentences(content);
  for (const sentence of sentences) {
    if (!isSimultaneousActionSentence(sentence)) continue;

    const index = content.indexOf(sentence);
    return { index: index === -1 ? 0 : index, text: sentence };
  }

  return undefined;
}

function isSimultaneousActionSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;
  SIMULTANEOUS_ACTION_CADENCE_PATTERN.lastIndex = 0;
  return SIMULTANEOUS_ACTION_CADENCE_PATTERN.test(trimmed);
}

function countStatusQuoActionSentences(content: string): number {
  return splitSentences(content).filter(isStatusQuoActionSentence).length;
}

function countCausalTurnSentences(content: string): number {
  return splitSentences(content).filter(hasCausalTurnMarker).length;
}

function findLongestStatusQuoActionRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isStatusQuoActionSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findStatusQuoActionEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isStatusQuoActionSentence(sentence)) {
      current.push(sentence);
    } else {
      current.length = 0;
    }

    if (current.length >= minRun) {
      return current.slice(0, minRun).join(' ');
    }
  }

  const actionSentences = sentences.filter(isStatusQuoActionSentence);
  return (actionSentences.length > 0 ? actionSentences : sentences)
    .slice(0, Math.max(3, minRun))
    .join(' ');
}

function findFirstStatusQuoActionSentence(
  content: string
): { index: number; text: string } | undefined {
  const sentences = splitSentences(content);
  for (const sentence of sentences) {
    if (!isStatusQuoActionSentence(sentence)) continue;

    const index = content.indexOf(sentence);
    return { index: index === -1 ? 0 : index, text: sentence };
  }

  return undefined;
}

function isStatusQuoActionSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;
  if (hasCausalTurnMarker(trimmed)) return false;

  return STATUS_QUO_ACTION_PATTERN.test(trimmed);
}

function countPropFidgetBeatSentences(content: string): number {
  return splitSentences(content).filter(isPropFidgetBeatSentence).length;
}

function findLongestPropFidgetBeatRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isPropFidgetBeatSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findPropFidgetBeatEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isPropFidgetBeatSentence(sentence)) {
      current.push(sentence);
    } else {
      current.length = 0;
    }

    if (current.length >= minRun) {
      return current.slice(0, minRun).join(' ');
    }
  }

  const propSentences = sentences.filter(isPropFidgetBeatSentence);
  return (propSentences.length > 0 ? propSentences : sentences)
    .slice(0, Math.max(3, minRun))
    .join(' ');
}

function findFirstPropFidgetBeatSentence(
  content: string
): { index: number; text: string } | undefined {
  const sentences = splitSentences(content);
  for (const sentence of sentences) {
    if (!isPropFidgetBeatSentence(sentence)) continue;

    const index = content.indexOf(sentence);
    return { index: index === -1 ? 0 : index, text: sentence };
  }

  return undefined;
}

function isPropFidgetBeatSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;
  if (hasCausalTurnMarker(trimmed)) return false;
  if (PROP_FIDGET_GROUNDED_PATTERN.test(trimmed)) return false;

  return PROP_FIDGET_BEAT_PATTERN.test(trimmed);
}

function countGazeChoreographySentences(content: string): number {
  return splitSentences(content).filter(isGazeChoreographySentence).length;
}

function findLongestGazeChoreographyRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isGazeChoreographySentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findGazeChoreographyEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isGazeChoreographySentence(sentence)) {
      current.push(sentence);
    } else {
      current.length = 0;
    }

    if (current.length >= minRun) {
      return current.slice(0, minRun).join(' ');
    }
  }

  const gazeSentences = sentences.filter(isGazeChoreographySentence);
  return (gazeSentences.length > 0 ? gazeSentences : sentences)
    .slice(0, Math.max(3, minRun))
    .join(' ');
}

function findFirstGazeChoreographySentence(
  content: string
): { index: number; text: string } | undefined {
  const sentences = splitSentences(content);
  for (const sentence of sentences) {
    if (!isGazeChoreographySentence(sentence)) continue;

    const index = content.indexOf(sentence);
    return { index: index === -1 ? 0 : index, text: sentence };
  }

  return undefined;
}

function isGazeChoreographySentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;
  if (hasCausalTurnMarker(trimmed)) return false;
  if (GAZE_GROUNDED_DETAIL_PATTERN.test(trimmed)) return false;

  return GAZE_CHOREOGRAPHY_PATTERN.test(trimmed);
}

function hasCausalTurnMarker(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;

  return CAUSAL_TURN_PATTERN.test(trimmed);
}

function findLongestRepeatedConnectiveStarterRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;
  let previousConnective = '';

  for (const sentence of sentences) {
    const connective = extractSentenceStarterConnective(sentence);
    if (!connective) {
      current = 0;
      previousConnective = '';
      continue;
    }

    if (connective === previousConnective) {
      current += 1;
    } else {
      current = 1;
      previousConnective = connective;
    }

    longest = Math.max(longest, current);
  }

  return longest;
}

function findConnectiveStarterEvidence(content: string): string {
  const sentences = splitSentences(content);
  const connectiveSentences = sentences
    .filter(sentence => extractSentenceStarterConnective(sentence).length > 0);

  return (connectiveSentences.length > 0 ? connectiveSentences : sentences)
    .slice(0, 4)
    .join(' ');
}

function findRepeatedSubjectEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  let current: string[] = [];
  let previousSubject = '';

  for (const sentence of sentences) {
    const subject = extractSentenceStarterSubject(sentence);
    if (!subject || subject !== previousSubject) {
      current = subject ? [sentence] : [];
      previousSubject = subject;
    } else {
      current.push(sentence);
    }

    if (current.length >= minRun) {
      return current.slice(0, minRun).join(' ');
    }
  }

  return sentences.slice(0, minRun).join(' ');
}

function countTopicMarkerStarterSentences(content: string): number {
  return splitSentences(content).filter(isTopicMarkerStarterSentence).length;
}

function findLongestTopicMarkerStarterRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;

  for (const sentence of sentences) {
    if (isTopicMarkerStarterSentence(sentence)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

function findTopicMarkerCadenceEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isTopicMarkerStarterSentence(sentence)) {
      current.push(sentence);
    } else {
      current.length = 0;
    }

    if (current.length >= minRun) {
      return current.slice(0, minRun).join(' ');
    }
  }

  const firstTopicMarkerSentence = sentences.find(isTopicMarkerStarterSentence);
  return firstTopicMarkerSentence ?? sentences.slice(0, minRun).join(' ');
}

function isTopicMarkerStarterSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;

  const match = trimmed.match(TOPIC_MARKER_SENTENCE_START_PATTERN);
  const starter = match?.[1] ?? '';
  if (!starter) return false;

  if (/(?:에서|에게서|로서|으로서)$/u.test(starter)) return false;
  if (/^(?:오늘|내일|어제|지금|방금|아까|그날|다음날|이튿날|밤|아침|저녁)$/u.test(starter)) {
    return false;
  }

  return true;
}

function getNarrationSentenceLengths(content: string): number[] {
  return splitSentences(content)
    .filter(isMeasurableRhythmSentence)
    .map(sentence => countTextUnits(sentence));
}

function calculateSentenceLengthVariationCoefficient(lengths: number[]): number {
  if (lengths.length < 6) return 1;

  const mean = lengths.reduce((total, length) => total + length, 0) / lengths.length;
  if (mean === 0) return 1;

  const variance =
    lengths.reduce((total, length) => total + (length - mean) ** 2, 0) / lengths.length;
  return round2(Math.sqrt(variance) / mean);
}

function findLongestUniformSentenceLengthRun(content: string): number {
  const sentences = splitSentences(content);
  let longest = 0;
  let current = 0;
  let previousLength: number | undefined;

  for (const sentence of sentences) {
    if (!isMeasurableRhythmSentence(sentence)) {
      current = 0;
      previousLength = undefined;
      continue;
    }

    const length = countTextUnits(sentence);
    if (previousLength !== undefined && areSentenceLengthsUniform(previousLength, length)) {
      current += 1;
    } else {
      current = 1;
    }

    previousLength = length;
    longest = Math.max(longest, current);
  }

  return longest;
}

function findUniformSentenceLengthEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];
  let previousLength: number | undefined;

  for (const sentence of sentences) {
    if (!isMeasurableRhythmSentence(sentence)) {
      current.length = 0;
      previousLength = undefined;
      continue;
    }

    const length = countTextUnits(sentence);
    if (previousLength !== undefined && areSentenceLengthsUniform(previousLength, length)) {
      current.push(sentence);
    } else {
      current.length = 0;
      current.push(sentence);
    }

    previousLength = length;
    if (current.length >= minRun) {
      return current.slice(0, minRun).join(' ');
    }
  }

  return sentences.filter(isMeasurableRhythmSentence).slice(0, minRun).join(' ');
}

function areSentenceLengthsUniform(previousLength: number, currentLength: number): boolean {
  const tolerance = Math.max(3, Math.round(Math.min(previousLength, currentLength) * 0.12));
  return Math.abs(previousLength - currentLength) <= tolerance;
}

function isMeasurableRhythmSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;
  if (!/[.!?]$/u.test(trimmed)) return false;

  return countTextUnits(trimmed) > 18;
}

function extractSentenceStarterSubject(sentence: string): string {
  const match = sentence
    .trim()
    .match(/^["“”'‘’「」『』\s]*(그녀|그들|우리|나는|내가|나|그|[가-힣]{2,4})(?:은|는|이|가)\s/u);

  return match?.[1] ?? '';
}

function extractSentenceStarterConnective(sentence: string): string {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return '';

  const match = trimmed.match(CONNECTIVE_STARTER_PATTERN);
  return match?.[1]?.replace(/\s+/gu, ' ') ?? '';
}

function findShortSentenceRunEvidence(content: string, minRun: number): string {
  const sentences = splitSentences(content);
  const current: string[] = [];

  for (const sentence of sentences) {
    if (isShortNarrationSentence(sentence)) {
      current.push(sentence);
    } else {
      current.length = 0;
    }

    if (current.length >= minRun) {
      return current.slice(0, minRun).join(' ');
    }
  }

  return sentences.slice(0, minRun).join(' ');
}

function isShortNarrationSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (!trimmed || /["“”'‘’「」『』]/u.test(trimmed)) return false;

  const textUnits = countTextUnits(trimmed);
  if (textUnits === 0 || textUnits > 18) return false;

  return /[.!?]$/u.test(trimmed);
}

function splitSentences(content: string): string[] {
  return content
    .replace(/\s+/gu, ' ')
    .split(SENTENCE_SPLIT_PATTERN)
    .map(sentence => sentence.trim())
    .filter(Boolean);
}

function classifyEnding(sentence: string): string {
  const normalized = sentence.replace(/["'”’」』)\]]+$/gu, '').trim();

  if (/(이었다|였다)[.!?]?$/u.test(normalized)) return '였다';
  if (/(했다|하였다)[.!?]?$/u.test(normalized)) return '했다';
  if (/(었다|았다)[.!?]?$/u.test(normalized)) return '었다';
  if (/다[.!?]?$/u.test(normalized)) return '다';
  if (/요[.!?]?$/u.test(normalized)) return '요';

  return '';
}

function densityPenalty(actual: number, threshold: number, multiplier: number, max: number): number {
  return Math.min(max, Math.max(8, Math.ceil((actual - threshold) * multiplier)));
}

function sliceEvidence(content: string, position: number, length: number): string {
  const start = Math.max(0, position - 40);
  const end = Math.min(content.length, position + length + 80);
  return content.slice(start, end).replace(/\s+/gu, ' ').trim();
}

function localizeIssue(content: string, issue: ProseTasteIssue): ProseTasteIssue {
  const resolvedPosition = issue.position ?? findEvidencePosition(content, issue.evidence);
  if (resolvedPosition === undefined) {
    return {
      ...issue,
      targetText: issue.targetText ?? issue.evidence,
      localizationConfidence: issue.localizationConfidence ?? 'fallback',
    };
  }

  return {
    ...issue,
    position: resolvedPosition,
    lineNumber: countLinesBefore(content, resolvedPosition) + 1,
    paragraphNumber: findParagraphNumberAtPosition(content, resolvedPosition),
    sentenceNumber: findSentenceNumberAtPosition(content, resolvedPosition),
    targetText: issue.targetText ?? findIssueTargetText(content, issue, resolvedPosition),
    localizationConfidence: issue.position !== undefined ? 'exact' : 'evidence',
  };
}

function findEvidencePosition(content: string, evidence: string): number | undefined {
  const trimmed = evidence.trim();
  if (!trimmed) return undefined;

  const exactIndex = content.indexOf(trimmed);
  if (exactIndex !== -1) return exactIndex;

  const normalizedContent = buildNormalizedWhitespaceIndex(content);
  const normalizedEvidence = normalizeWhitespace(trimmed);
  const normalizedIndex = normalizedContent.text.indexOf(normalizedEvidence);
  if (normalizedIndex !== -1) {
    return normalizedContent.originalIndices[normalizedIndex];
  }

  const firstSentence = normalizeWhitespace(trimmed.split(/[.!?]/u)[0] ?? '').trim();
  if (firstSentence.length >= 8) {
    const firstSentenceIndex = normalizedContent.text.indexOf(firstSentence);
    if (firstSentenceIndex !== -1) {
      return normalizedContent.originalIndices[firstSentenceIndex];
    }
  }

  return undefined;
}

function buildNormalizedWhitespaceIndex(content: string): {
  text: string;
  originalIndices: number[];
} {
  let text = '';
  const originalIndices: number[] = [];
  let previousWasWhitespace = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    if (/\s/u.test(char)) {
      if (!previousWasWhitespace) {
        text += ' ';
        originalIndices.push(index);
      }
      previousWasWhitespace = true;
      continue;
    }

    text += char;
    originalIndices.push(index);
    previousWasWhitespace = false;
  }

  return {
    text: text.trim(),
    originalIndices: trimIndexMap(text, originalIndices),
  };
}

function trimIndexMap(text: string, originalIndices: number[]): number[] {
  const leadingWhitespace = text.length - text.trimStart().length;
  const trailingWhitespace = text.length - text.trimEnd().length;
  return originalIndices.slice(
    leadingWhitespace,
    trailingWhitespace > 0 ? originalIndices.length - trailingWhitespace : originalIndices.length
  );
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/gu, ' ').trim();
}

function countLinesBefore(content: string, position: number): number {
  return (content.slice(0, position).match(/\n/gu) ?? []).length;
}

function findParagraphNumberAtPosition(content: string, position: number): number {
  const paragraphRanges = findParagraphRanges(content);
  const foundIndex = paragraphRanges.findIndex(range => position >= range.start && position <= range.end);
  if (foundIndex !== -1) return foundIndex + 1;

  const precedingParagraphs = paragraphRanges.filter(range => range.start < position).length;
  return Math.max(1, precedingParagraphs);
}

function findParagraphRanges(content: string): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  const paragraphPattern = /\S(?:[\s\S]*?)(?=\n\s*\n|$)/gu;
  let match: RegExpExecArray | null;

  while ((match = paragraphPattern.exec(content)) !== null) {
    const rawText = match[0];
    const leadingWhitespace = rawText.length - rawText.trimStart().length;
    const trailingWhitespace = rawText.length - rawText.trimEnd().length;
    const start = match.index + leadingWhitespace;
    const end = match.index + rawText.length - trailingWhitespace;
    if (start < end) {
      ranges.push({ start, end });
    }
    if (match[0].length === 0) paragraphPattern.lastIndex += 1;
  }

  return ranges;
}

function findSentenceNumberAtPosition(content: string, position: number): number {
  const paragraphRanges = findParagraphRanges(content);
  const paragraph = paragraphRanges.find(range => position >= range.start && position <= range.end);
  const paragraphStart = paragraph?.start ?? 0;
  return (content.slice(paragraphStart, position).match(/[.!?](?=\s|$)/gu) ?? []).length + 1;
}

function findIssueTargetText(
  content: string,
  issue: ProseTasteIssue,
  position: number
): string {
  const sentence = findSentenceAtPosition(content, position);
  const normalizedEvidence = normalizeWhitespace(issue.evidence);

  if (issue.position === undefined && normalizedEvidence.length > (sentence?.length ?? 0) + 8) {
    return normalizedEvidence.slice(0, 500);
  }

  return sentence ?? normalizedEvidence;
}

function findSentenceAtPosition(content: string, position: number): string | undefined {
  const startBoundary = findLastSentenceBoundary(content.slice(0, position));
  const sentenceStart = startBoundary === -1 ? 0 : startBoundary + 1;
  const tail = content.slice(position);
  const endMatch = /[.!?](?=\s|$)/u.exec(tail);
  const sentenceEnd = endMatch ? position + endMatch.index + 1 : content.length;
  const sentence = content.slice(sentenceStart, sentenceEnd).replace(/\s+/gu, ' ').trim();
  return sentence.length > 0 ? sentence : undefined;
}

function findLastSentenceBoundary(text: string): number {
  const matches = Array.from(text.matchAll(/[.!?](?=\s|$)/gu));
  return matches.length > 0 ? matches[matches.length - 1].index ?? -1 : -1;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function hasTasteCalibration(profile: ProseTasteProfile): boolean {
  return Boolean(
    profile.dislikedPhrases?.length ||
      profile.maxSensoryDensityPer1000 !== undefined ||
      profile.maxEmbodiedReactionDensityPer1000 !== undefined ||
      profile.maxBodyReactionSubjectDensityPer1000 !== undefined ||
      profile.maxBodyReactionSubjectRun !== undefined ||
      profile.maxClicheEmotionImageDensityPer1000 !== undefined ||
      profile.maxClicheEmotionImageRun !== undefined ||
      profile.maxSymbolicAbstractionDensityPer1000 !== undefined ||
      profile.maxSymbolicAbstractionRun !== undefined ||
      profile.maxMetaphorDensityPer1000 !== undefined ||
      profile.maxSensoryWallpaperRun !== undefined ||
      profile.maxEmotionLabelDensityPer1000 !== undefined ||
      profile.maxEmotionLabelRun !== undefined ||
      profile.maxHedgedPerceptionDensityPer1000 !== undefined ||
      profile.maxAbstractNounDensityPer1000 !== undefined ||
      profile.maxCognitiveFilterDensityPer1000 !== undefined ||
      profile.maxTherapySpeakDensityPer1000 !== undefined ||
      profile.maxTherapySpeakRun !== undefined ||
      profile.maxBackstoryExpositionDensityPer1000 !== undefined ||
      profile.maxBackstoryExpositionRun !== undefined ||
      profile.maxRelationshipMontageSummaryDensityPer1000 !== undefined ||
      profile.maxRelationshipMontageSummaryRun !== undefined ||
      profile.maxTimeSkipSummaryDensityPer1000 !== undefined ||
      profile.maxTimeSkipSummaryRun !== undefined ||
      profile.maxContrastiveReframeDensityPer1000 !== undefined ||
      profile.maxContrastiveReframeRun !== undefined ||
      profile.maxLoreTermDensityPer1000 !== undefined ||
      profile.maxLoreTermRun !== undefined ||
      profile.maxSystemStatBlockDensityPer1000 !== undefined ||
      profile.maxSystemStatBlockRun !== undefined ||
      profile.maxDeclaredResolveDensityPer1000 !== undefined ||
      profile.maxDeclaredResolveRun !== undefined ||
      profile.maxRevelationSummaryDensityPer1000 !== undefined ||
      profile.maxRevelationSummaryRun !== undefined ||
      profile.maxProceduralChecklistDensityPer1000 !== undefined ||
      profile.maxProceduralChecklistRun !== undefined ||
      profile.maxActionChoreographyDensityPer1000 !== undefined ||
      profile.maxActionChoreographyRun !== undefined ||
      profile.maxNominalizedExplanationDensityPer1000 !== undefined ||
      profile.maxTranslationeseFormulaDensityPer1000 !== undefined ||
      profile.maxConnectiveStarterDensityPer1000 !== undefined ||
      profile.maxFillerAdverbDensityPer1000 !== undefined ||
      profile.maxFillerAdverbRun !== undefined ||
      profile.maxSimultaneousActionDensityPer1000 !== undefined ||
      profile.maxSimultaneousActionRun !== undefined ||
      profile.maxStatusQuoActionDensityPer1000 !== undefined ||
      profile.maxStatusQuoActionRun !== undefined ||
      profile.maxPropFidgetBeatDensityPer1000 !== undefined ||
      profile.maxPropFidgetBeatRun !== undefined ||
      profile.maxGazeChoreographyDensityPer1000 !== undefined ||
      profile.maxGazeChoreographyRun !== undefined ||
      profile.minCausalTurnDensityPer1000 !== undefined ||
      profile.maxCommaDensityPer1000 !== undefined ||
      profile.maxReportingTailDensityPer1000 !== undefined ||
      profile.maxEmphasisPunctuationDensityPer1000 !== undefined ||
      profile.maxEmphasisPunctuationRun !== undefined ||
      profile.maxStaticDescriptionDensityPer1000 !== undefined ||
      profile.maxGenericTeaserDensityPer1000 !== undefined ||
      profile.maxThinCliffhangerEndingCount !== undefined ||
      profile.maxPovMindJumpDensityPer1000 !== undefined ||
      profile.maxPovMindJumpRun !== undefined ||
      profile.maxExpositoryDialogueRatio !== undefined ||
      profile.maxDialogueTurnLength !== undefined ||
      profile.maxAverageDialogueTurnLength !== undefined ||
      profile.maxDialogueGroundingGapRun !== undefined ||
      profile.maxDialogueQuestionRatio !== undefined ||
      profile.maxDialogueQuestionRun !== undefined ||
      profile.maxDialogueVocativeRatio !== undefined ||
      profile.maxDialogueVocativeRun !== undefined ||
      profile.maxDialogueLexicalEchoRatio !== undefined ||
      profile.maxDialogueLexicalEchoRun !== undefined ||
      profile.maxDialogueParaphraseConfirmationRatio !== undefined ||
      profile.maxDialogueParaphraseConfirmationRun !== undefined ||
      profile.maxRoteDialogueReplyRatio !== undefined ||
      profile.maxRoteDialogueReplyRun !== undefined ||
      profile.maxNeutralDialogueTagRatio !== undefined ||
      profile.maxNeutralDialogueTagRun !== undefined ||
      profile.maxSilenceStallDensityPer1000 !== undefined ||
      profile.maxSilenceStallRun !== undefined ||
      profile.maxMelodramaticCaptionDensityPer1000 !== undefined ||
      profile.maxMelodramaticCaptionRun !== undefined ||
      profile.maxStockReactionBeatDensityPer1000 !== undefined ||
      profile.maxStockReactionBeatRun !== undefined ||
      profile.maxFacialExpressionBeatDensityPer1000 !== undefined ||
      profile.maxFacialExpressionBeatRun !== undefined ||
      profile.maxVagueAtmosphereModifierDensityPer1000 !== undefined ||
      profile.maxVagueAtmosphereModifierRun !== undefined ||
      profile.maxEvaluativeModifierDensityPer1000 !== undefined ||
      profile.maxEvaluativeModifierRun !== undefined ||
      profile.maxRhetoricalQuestionDensityPer1000 !== undefined ||
      profile.maxRhetoricalQuestionRun !== undefined ||
      profile.maxSubtextExplanationDensityPer1000 !== undefined ||
      profile.maxSubtextExplanationRun !== undefined ||
      profile.maxAmbiguousReferenceDensityPer1000 !== undefined ||
      profile.maxAmbiguousReferenceRun !== undefined ||
      profile.maxSceneTransitionGroundingGapDensityPer1000 !== undefined ||
      profile.maxSceneTransitionGroundingGapRun !== undefined ||
      profile.maxTopicMarkerStarterDensityPer1000 !== undefined ||
      profile.maxTopicMarkerStarterRun !== undefined ||
      profile.minSentenceLengthVariationCoefficient !== undefined ||
      profile.maxUniformSentenceLengthRun !== undefined ||
      profile.maxSameEndingRun !== undefined ||
      profile.maxDominantSentenceEndingShare !== undefined ||
      profile.maxDominantDialogueEndingShare !== undefined ||
      profile.maxDominantDialogueStarterShare !== undefined ||
      profile.minViewpointAnchorDensityPer1000 !== undefined ||
      profile.maxShortSentenceRun !== undefined ||
      profile.maxRepeatedSubjectRun !== undefined ||
      profile.maxRepeatedConnectiveStarterRun !== undefined ||
      profile.preferredMode !== undefined
  );
}

function compareIssues(a: ProseTasteIssue, b: ProseTasteIssue): number {
  const order: Record<ProseTasteIssueSeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const severityDiff = order[a.severity] - order[b.severity];
  if (severityDiff !== 0) return severityDiff;

  return (b.penalty - a.penalty) || ((a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER));
}
