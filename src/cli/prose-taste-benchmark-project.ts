import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  evaluateProseTasteBenchmark,
  type ProseTasteBenchmarkContentSource,
  type ProseTasteCalibrationSplit,
  type ProseTasteBenchmarkOptions,
  type ProseTasteBenchmarkResult,
  type ProseTasteBenchmarkSample,
  type ProseTasteFrictionAnnotation,
  type ProseTasteFrictionSeverity,
  type ProseTasteStyleHighlightAnnotation,
  type ProseTasteStyleHighlightQuality,
} from '../quality/prose-taste-benchmark.js';
import {
  type ProseTasteIssueCode,
  type ProseTasteMode,
  type ProseTasteProfile,
} from '../quality/prose-taste-gate.js';
import {
  buildSourceEvidenceManifest,
  type SourceEvidenceManifest,
} from './source-evidence.js';

export interface RunProseTasteBenchmarkProjectArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  profile?: ProseTasteProfile;
  threshold?: number;
  requiredReaderSegments?: string[];
  minimumReaderSegmentCount?: number;
  minimumSamplesPerReaderSegment?: number;
  minimumFailingSamplesPerReaderSegment?: number;
  maximumDominantReaderSegmentRatio?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
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

export interface RunProseTasteBenchmarkCliResult {
  projectId: string;
  projectDir: string;
  inputDir: string;
  outputPath: string;
  samplesLoaded: number;
  defaultProfile?: ProseTasteProfile;
  threshold?: number;
  sourceEvidence: SourceEvidenceManifest;
  benchmark: ProseTasteBenchmarkResult;
}

interface RawProseTasteBenchmarkFile {
  default_profile?: RawProseTasteProfile;
  threshold?: number;
  required_reader_segments?: string[];
  minimum_reader_segment_count?: number;
  minimum_samples_per_reader_segment?: number;
  minimum_failing_samples_per_reader_segment?: number;
  maximum_dominant_reader_segment_ratio?: number;
  minimum_holdout_samples?: number;
  minimum_usable_holdout_samples?: number;
  minimum_failing_holdout_samples?: number;
  minimum_usable_failing_holdout_samples?: number;
  minimum_friction_annotations?: number;
  minimum_actionable_friction_annotations?: number;
  require_friction_annotations?: boolean;
  minimum_style_highlight_annotations?: number;
  minimum_actionable_style_highlight_annotations?: number;
  require_style_highlight_annotations?: boolean;
  minimum_style_highlight_quality_count?: number;
  require_style_highlight_quality_diversity?: boolean;
  minimum_style_fingerprint_samples_per_polarity?: number;
  minimum_style_fingerprint_distance?: number;
  minimum_style_fingerprint_signal_count?: number;
  require_style_fingerprint_separation?: boolean;
  minimum_authorial_style_continuity_samples?: number;
  maximum_authorial_style_drift?: number;
  require_authorial_style_continuity?: boolean;
  samples?: RawProseTasteBenchmarkSample[];
}

interface RawProseTasteBenchmarkSample {
  id: string;
  label?: string;
  reader_segment?: string;
  calibration_split?: string;
  chapter?: number;
  version?: number;
  content?: string;
  content_path?: string;
  expected_passed: boolean;
  profile?: RawProseTasteProfile;
  threshold?: number;
  expected_issue_codes?: ProseTasteIssueCode[];
  expected_min_score?: number;
  expected_max_score?: number;
  style_friction_annotations?: RawProseTasteFrictionAnnotation[];
  style_highlight_annotations?: RawProseTasteStyleHighlightAnnotation[];
}

interface RawProseTasteFrictionAnnotation {
  location?: string;
  reason?: string;
  issue_code?: ProseTasteIssueCode;
  severity?: ProseTasteFrictionSeverity;
  reader_count?: number;
  reader_segment?: string;
  rewrite_suggestion?: string;
  target_text?: string;
}

interface RawProseTasteStyleHighlightAnnotation {
  location?: string;
  reason?: string;
  quality?: ProseTasteStyleHighlightQuality;
  reader_count?: number;
  reader_segment?: string;
  target_text?: string;
  transfer_guidance?: string;
}

interface RawProseTasteProfile {
  preferred_mode?: ProseTasteMode;
  preferredMode?: ProseTasteMode;
  disliked_phrases?: string[];
  dislikedPhrases?: string[];
  minimum_score?: number;
  minimumScore?: number;
  max_sensory_density_per_1000?: number;
  maxSensoryDensityPer1000?: number;
  max_embodied_reaction_density_per_1000?: number;
  maxEmbodiedReactionDensityPer1000?: number;
  max_body_reaction_subject_density_per_1000?: number;
  maxBodyReactionSubjectDensityPer1000?: number;
  max_body_reaction_subject_run?: number;
  maxBodyReactionSubjectRun?: number;
  max_cliche_emotion_image_density_per_1000?: number;
  maxClicheEmotionImageDensityPer1000?: number;
  max_cliche_emotion_image_run?: number;
  maxClicheEmotionImageRun?: number;
  max_symbolic_abstraction_density_per_1000?: number;
  maxSymbolicAbstractionDensityPer1000?: number;
  max_symbolic_abstraction_run?: number;
  maxSymbolicAbstractionRun?: number;
  max_metaphor_density_per_1000?: number;
  maxMetaphorDensityPer1000?: number;
  max_sensory_wallpaper_run?: number;
  maxSensoryWallpaperRun?: number;
  max_emotion_label_density_per_1000?: number;
  maxEmotionLabelDensityPer1000?: number;
  max_emotion_label_run?: number;
  maxEmotionLabelRun?: number;
  max_hedged_perception_density_per_1000?: number;
  maxHedgedPerceptionDensityPer1000?: number;
  max_abstract_noun_density_per_1000?: number;
  maxAbstractNounDensityPer1000?: number;
  max_cognitive_filter_density_per_1000?: number;
  maxCognitiveFilterDensityPer1000?: number;
  max_therapy_speak_density_per_1000?: number;
  maxTherapySpeakDensityPer1000?: number;
  max_therapy_speak_run?: number;
  maxTherapySpeakRun?: number;
  max_backstory_exposition_density_per_1000?: number;
  maxBackstoryExpositionDensityPer1000?: number;
  max_backstory_exposition_run?: number;
  maxBackstoryExpositionRun?: number;
  max_relationship_montage_summary_density_per_1000?: number;
  maxRelationshipMontageSummaryDensityPer1000?: number;
  max_relationship_montage_summary_run?: number;
  maxRelationshipMontageSummaryRun?: number;
  max_time_skip_summary_density_per_1000?: number;
  maxTimeSkipSummaryDensityPer1000?: number;
  max_time_skip_summary_run?: number;
  maxTimeSkipSummaryRun?: number;
  max_contrastive_reframe_density_per_1000?: number;
  maxContrastiveReframeDensityPer1000?: number;
  max_contrastive_reframe_run?: number;
  maxContrastiveReframeRun?: number;
  max_lore_term_density_per_1000?: number;
  maxLoreTermDensityPer1000?: number;
  max_lore_term_run?: number;
  maxLoreTermRun?: number;
  max_system_stat_block_density_per_1000?: number;
  maxSystemStatBlockDensityPer1000?: number;
  max_system_stat_block_run?: number;
  maxSystemStatBlockRun?: number;
  max_declared_resolve_density_per_1000?: number;
  maxDeclaredResolveDensityPer1000?: number;
  max_declared_resolve_run?: number;
  maxDeclaredResolveRun?: number;
  max_revelation_summary_density_per_1000?: number;
  maxRevelationSummaryDensityPer1000?: number;
  max_revelation_summary_run?: number;
  maxRevelationSummaryRun?: number;
  max_procedural_checklist_density_per_1000?: number;
  maxProceduralChecklistDensityPer1000?: number;
  max_procedural_checklist_run?: number;
  maxProceduralChecklistRun?: number;
  max_action_choreography_density_per_1000?: number;
  maxActionChoreographyDensityPer1000?: number;
  max_action_choreography_run?: number;
  maxActionChoreographyRun?: number;
  max_nominalized_explanation_density_per_1000?: number;
  maxNominalizedExplanationDensityPer1000?: number;
  max_translationese_formula_density_per_1000?: number;
  maxTranslationeseFormulaDensityPer1000?: number;
  max_connective_starter_density_per_1000?: number;
  maxConnectiveStarterDensityPer1000?: number;
  max_filler_adverb_density_per_1000?: number;
  maxFillerAdverbDensityPer1000?: number;
  max_filler_adverb_run?: number;
  maxFillerAdverbRun?: number;
  max_simultaneous_action_density_per_1000?: number;
  maxSimultaneousActionDensityPer1000?: number;
  max_simultaneous_action_run?: number;
  maxSimultaneousActionRun?: number;
  max_status_quo_action_density_per_1000?: number;
  maxStatusQuoActionDensityPer1000?: number;
  max_status_quo_action_run?: number;
  maxStatusQuoActionRun?: number;
  max_gaze_choreography_density_per_1000?: number;
  maxGazeChoreographyDensityPer1000?: number;
  max_gaze_choreography_run?: number;
  maxGazeChoreographyRun?: number;
  min_causal_turn_density_per_1000?: number;
  minCausalTurnDensityPer1000?: number;
  max_comma_density_per_1000?: number;
  maxCommaDensityPer1000?: number;
  max_reporting_tail_density_per_1000?: number;
  maxReportingTailDensityPer1000?: number;
  max_emphasis_punctuation_density_per_1000?: number;
  maxEmphasisPunctuationDensityPer1000?: number;
  max_emphasis_punctuation_run?: number;
  maxEmphasisPunctuationRun?: number;
  max_static_description_density_per_1000?: number;
  maxStaticDescriptionDensityPer1000?: number;
  max_generic_teaser_density_per_1000?: number;
  maxGenericTeaserDensityPer1000?: number;
  max_thin_cliffhanger_ending_count?: number;
  maxThinCliffhangerEndingCount?: number;
  max_pov_mind_jump_density_per_1000?: number;
  maxPovMindJumpDensityPer1000?: number;
  max_pov_mind_jump_run?: number;
  maxPovMindJumpRun?: number;
  max_expository_dialogue_ratio?: number;
  maxExpositoryDialogueRatio?: number;
  max_dialogue_turn_length?: number;
  maxDialogueTurnLength?: number;
  max_average_dialogue_turn_length?: number;
  maxAverageDialogueTurnLength?: number;
  max_dialogue_grounding_gap_run?: number;
  maxDialogueGroundingGapRun?: number;
  max_dialogue_question_ratio?: number;
  maxDialogueQuestionRatio?: number;
  max_dialogue_question_run?: number;
  maxDialogueQuestionRun?: number;
  max_dialogue_vocative_ratio?: number;
  maxDialogueVocativeRatio?: number;
  max_dialogue_vocative_run?: number;
  maxDialogueVocativeRun?: number;
  max_dialogue_lexical_echo_ratio?: number;
  maxDialogueLexicalEchoRatio?: number;
  max_dialogue_lexical_echo_run?: number;
  maxDialogueLexicalEchoRun?: number;
  max_dialogue_paraphrase_confirmation_ratio?: number;
  maxDialogueParaphraseConfirmationRatio?: number;
  max_dialogue_paraphrase_confirmation_run?: number;
  maxDialogueParaphraseConfirmationRun?: number;
  max_rote_dialogue_reply_ratio?: number;
  maxRoteDialogueReplyRatio?: number;
  max_rote_dialogue_reply_run?: number;
  maxRoteDialogueReplyRun?: number;
  max_neutral_dialogue_tag_ratio?: number;
  maxNeutralDialogueTagRatio?: number;
  max_neutral_dialogue_tag_run?: number;
  maxNeutralDialogueTagRun?: number;
  max_silence_stall_density_per_1000?: number;
  maxSilenceStallDensityPer1000?: number;
  max_silence_stall_run?: number;
  maxSilenceStallRun?: number;
  max_melodramatic_caption_density_per_1000?: number;
  maxMelodramaticCaptionDensityPer1000?: number;
  max_melodramatic_caption_run?: number;
  maxMelodramaticCaptionRun?: number;
  max_stock_reaction_beat_density_per_1000?: number;
  maxStockReactionBeatDensityPer1000?: number;
  max_stock_reaction_beat_run?: number;
  maxStockReactionBeatRun?: number;
  max_prop_fidget_beat_density_per_1000?: number;
  maxPropFidgetBeatDensityPer1000?: number;
  max_prop_fidget_beat_run?: number;
  maxPropFidgetBeatRun?: number;
  max_facial_expression_beat_density_per_1000?: number;
  maxFacialExpressionBeatDensityPer1000?: number;
  max_facial_expression_beat_run?: number;
  maxFacialExpressionBeatRun?: number;
  max_vague_atmosphere_modifier_density_per_1000?: number;
  maxVagueAtmosphereModifierDensityPer1000?: number;
  max_vague_atmosphere_modifier_run?: number;
  maxVagueAtmosphereModifierRun?: number;
  max_evaluative_modifier_density_per_1000?: number;
  maxEvaluativeModifierDensityPer1000?: number;
  max_evaluative_modifier_run?: number;
  maxEvaluativeModifierRun?: number;
  max_rhetorical_question_density_per_1000?: number;
  maxRhetoricalQuestionDensityPer1000?: number;
  max_rhetorical_question_run?: number;
  maxRhetoricalQuestionRun?: number;
  max_subtext_explanation_density_per_1000?: number;
  maxSubtextExplanationDensityPer1000?: number;
  max_subtext_explanation_run?: number;
  maxSubtextExplanationRun?: number;
  max_ambiguous_reference_density_per_1000?: number;
  maxAmbiguousReferenceDensityPer1000?: number;
  max_ambiguous_reference_run?: number;
  maxAmbiguousReferenceRun?: number;
  max_scene_transition_grounding_gap_density_per_1000?: number;
  maxSceneTransitionGroundingGapDensityPer1000?: number;
  max_scene_transition_grounding_gap_run?: number;
  maxSceneTransitionGroundingGapRun?: number;
  max_topic_marker_starter_density_per_1000?: number;
  maxTopicMarkerStarterDensityPer1000?: number;
  max_topic_marker_starter_run?: number;
  maxTopicMarkerStarterRun?: number;
  min_sentence_length_variation_coefficient?: number;
  minSentenceLengthVariationCoefficient?: number;
  max_uniform_sentence_length_run?: number;
  maxUniformSentenceLengthRun?: number;
  max_uniform_paragraph_beat_run?: number;
  maxUniformParagraphBeatRun?: number;
  max_same_ending_run?: number;
  maxSameEndingRun?: number;
  max_dominant_sentence_ending_share?: number;
  maxDominantSentenceEndingShare?: number;
  max_dominant_dialogue_ending_share?: number;
  maxDominantDialogueEndingShare?: number;
  max_dominant_dialogue_starter_share?: number;
  maxDominantDialogueStarterShare?: number;
  min_viewpoint_anchor_density_per_1000?: number;
  minViewpointAnchorDensityPer1000?: number;
  min_immersive_rhythm_anchor_density_per_1000?: number;
  minImmersiveRhythmAnchorDensityPer1000?: number;
  max_immersive_rhythm_flatline_run?: number;
  maxImmersiveRhythmFlatlineRun?: number;
  max_short_sentence_run?: number;
  maxShortSentenceRun?: number;
  max_repeated_subject_run?: number;
  maxRepeatedSubjectRun?: number;
  max_repeated_connective_starter_run?: number;
  maxRepeatedConnectiveStarterRun?: number;
}

interface LoadedRawProseTasteBenchmarkSample {
  sample: RawProseTasteBenchmarkSample;
  defaultProfile?: RawProseTasteProfile;
  threshold?: number;
}

interface LoadedProseTasteBenchmarkInput {
  samples: LoadedRawProseTasteBenchmarkSample[];
  options: ProseTasteBenchmarkOptions;
}

interface ResolvedProseTasteSampleContent {
  content: string;
  contentSource: ProseTasteBenchmarkContentSource;
  contentPath?: string;
  chapterSourceGrounded?: boolean;
}

export async function runProseTasteBenchmarkFromProject(
  args: RunProseTasteBenchmarkProjectArgs
): Promise<RunProseTasteBenchmarkCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const inputDir = path.resolve(args.inputDir ?? path.join(projectDir, 'reviews', 'prose-taste-benchmark'));
  const outputPath = path.resolve(args.outputPath ?? path.join(projectDir, 'reviews', 'prose-taste-benchmark-report.json'));
  const project = await readOptionalJson(path.join(projectDir, 'meta', 'project.json'));
  const styleGuide = await readOptionalJson(path.join(projectDir, 'meta', 'style-guide.json'));
  const projectId = args.projectId ?? project?.project_id ?? project?.id ?? path.basename(projectDir);
  const projectProfile = normalizeProfile(styleGuide?.prose_taste_profile);
  const defaultProfile = mergeProfiles(projectProfile, args.profile);
  const loadedInput = await readProseTasteBenchmarkSamples(inputDir);
  const samples = await Promise.all(
    loadedInput.samples.map(loaded =>
      normalizeSample(projectDir, loaded, defaultProfile, args.threshold)
    )
  );
  const benchmarkOptions = mergeBenchmarkOptions(loadedInput.options, {
    profile: defaultProfile,
    threshold: args.threshold,
    requiredReaderSegments: args.requiredReaderSegments,
    minimumReaderSegmentCount: args.minimumReaderSegmentCount,
    minimumSamplesPerReaderSegment: args.minimumSamplesPerReaderSegment,
    minimumFailingSamplesPerReaderSegment: args.minimumFailingSamplesPerReaderSegment,
    maximumDominantReaderSegmentRatio: args.maximumDominantReaderSegmentRatio,
    minimumHoldoutSampleCount: args.minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount: args.minimumUsableHoldoutSampleCount,
    minimumFailingHoldoutSampleCount: args.minimumFailingHoldoutSampleCount,
    minimumUsableFailingHoldoutSampleCount: args.minimumUsableFailingHoldoutSampleCount,
    minimumFrictionAnnotationCount: args.minimumFrictionAnnotationCount,
    minimumActionableFrictionAnnotationCount: args.minimumActionableFrictionAnnotationCount,
    requireFrictionAnnotationsForStyleTuning: args.requireFrictionAnnotationsForStyleTuning,
    minimumStyleHighlightAnnotationCount: args.minimumStyleHighlightAnnotationCount,
    minimumActionableStyleHighlightAnnotationCount:
      args.minimumActionableStyleHighlightAnnotationCount,
    requireStyleHighlightAnnotationsForStyleTuning:
      args.requireStyleHighlightAnnotationsForStyleTuning,
    minimumStyleHighlightQualityCount: args.minimumStyleHighlightQualityCount,
    requireStyleHighlightQualityDiversity: args.requireStyleHighlightQualityDiversity,
    minimumStyleFingerprintSamplesPerPolarity:
      args.minimumStyleFingerprintSamplesPerPolarity,
    minimumStyleFingerprintDistance: args.minimumStyleFingerprintDistance,
    minimumStyleFingerprintSignalCount: args.minimumStyleFingerprintSignalCount,
    requireStyleFingerprintSeparation: args.requireStyleFingerprintSeparation,
    minimumAuthorialStyleContinuitySamples: args.minimumAuthorialStyleContinuitySamples,
    maximumAuthorialStyleDrift: args.maximumAuthorialStyleDrift,
    requireAuthorialStyleContinuity: args.requireAuthorialStyleContinuity,
  });
  const benchmark = evaluateProseTasteBenchmark(samples, {
    ...benchmarkOptions,
  });
  const sourceEvidence = await buildSourceEvidenceManifest(projectDir, [
    inputDir,
    path.join(projectDir, 'meta', 'style-guide.json'),
    path.join(projectDir, 'chapters'),
    ...samples
      .map(sample => sample.contentPath)
      .filter((contentPath): contentPath is string => contentPath !== undefined)
      .map(contentPath => path.resolve(projectDir, contentPath)),
  ]);
  const result: RunProseTasteBenchmarkCliResult = {
    projectId,
    projectDir,
    inputDir,
    outputPath,
    samplesLoaded: samples.length,
    defaultProfile,
    threshold: args.threshold,
    sourceEvidence,
    benchmark,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return result;
}

async function readProseTasteBenchmarkSamples(
  inputDir: string
): Promise<LoadedProseTasteBenchmarkInput> {
  const files = await readJsonFiles(inputDir);
  if (files.length === 0) {
    throw new Error(`No prose taste benchmark JSON files found in ${inputDir}`);
  }

  const samples: LoadedRawProseTasteBenchmarkSample[] = [];
  const requiredReaderSegments: string[] = [];
  const minimumReaderSegmentCounts: number[] = [];
  const minimumSamplesPerReaderSegment: number[] = [];
  const minimumFailingSamplesPerReaderSegment: number[] = [];
  const maximumDominantReaderSegmentRatios: number[] = [];
  const minimumHoldoutSampleCounts: number[] = [];
  const minimumUsableHoldoutSampleCounts: number[] = [];
  const minimumFailingHoldoutSampleCounts: number[] = [];
  const minimumUsableFailingHoldoutSampleCounts: number[] = [];
  const minimumFrictionAnnotationCounts: number[] = [];
  const minimumActionableFrictionAnnotationCounts: number[] = [];
  const minimumStyleHighlightAnnotationCounts: number[] = [];
  const minimumActionableStyleHighlightAnnotationCounts: number[] = [];
  const minimumStyleHighlightQualityCounts: number[] = [];
  const minimumStyleFingerprintSamplesPerPolarityCounts: number[] = [];
  const minimumStyleFingerprintDistances: number[] = [];
  const minimumStyleFingerprintSignalCounts: number[] = [];
  const minimumAuthorialStyleContinuitySampleCounts: number[] = [];
  const maximumAuthorialStyleDrifts: number[] = [];
  let requireFrictionAnnotationsForStyleTuning: boolean | undefined;
  let requireStyleHighlightAnnotationsForStyleTuning: boolean | undefined;
  let requireStyleHighlightQualityDiversity: boolean | undefined;
  let requireStyleFingerprintSeparation: boolean | undefined;
  let requireAuthorialStyleContinuity: boolean | undefined;
  for (const filePath of files) {
    const parsed = await readJson(filePath) as RawProseTasteBenchmarkFile | RawProseTasteBenchmarkSample;
    if (Array.isArray((parsed as RawProseTasteBenchmarkFile).samples)) {
      const suite = parsed as RawProseTasteBenchmarkFile;
      requiredReaderSegments.push(...(suite.required_reader_segments ?? []));
      pushNumber(minimumReaderSegmentCounts, suite.minimum_reader_segment_count);
      pushNumber(minimumSamplesPerReaderSegment, suite.minimum_samples_per_reader_segment);
      pushNumber(minimumFailingSamplesPerReaderSegment, suite.minimum_failing_samples_per_reader_segment);
      pushNumber(maximumDominantReaderSegmentRatios, suite.maximum_dominant_reader_segment_ratio);
      pushNumber(minimumHoldoutSampleCounts, suite.minimum_holdout_samples);
      pushNumber(minimumUsableHoldoutSampleCounts, suite.minimum_usable_holdout_samples);
      pushNumber(minimumFailingHoldoutSampleCounts, suite.minimum_failing_holdout_samples);
      pushNumber(
        minimumUsableFailingHoldoutSampleCounts,
        suite.minimum_usable_failing_holdout_samples
      );
      pushNumber(minimumFrictionAnnotationCounts, suite.minimum_friction_annotations);
      pushNumber(
        minimumActionableFrictionAnnotationCounts,
        suite.minimum_actionable_friction_annotations
      );
      pushNumber(
        minimumStyleHighlightAnnotationCounts,
        suite.minimum_style_highlight_annotations
      );
      pushNumber(
        minimumActionableStyleHighlightAnnotationCounts,
        suite.minimum_actionable_style_highlight_annotations
      );
      pushNumber(
        minimumStyleHighlightQualityCounts,
        suite.minimum_style_highlight_quality_count
      );
      pushNumber(
        minimumStyleFingerprintSamplesPerPolarityCounts,
        suite.minimum_style_fingerprint_samples_per_polarity
      );
      pushNumber(minimumStyleFingerprintDistances, suite.minimum_style_fingerprint_distance);
      pushNumber(
        minimumStyleFingerprintSignalCounts,
        suite.minimum_style_fingerprint_signal_count
      );
      pushNumber(
        minimumAuthorialStyleContinuitySampleCounts,
        suite.minimum_authorial_style_continuity_samples
      );
      pushNumber(maximumAuthorialStyleDrifts, suite.maximum_authorial_style_drift);
      if (suite.require_friction_annotations !== undefined) {
        requireFrictionAnnotationsForStyleTuning =
          requireFrictionAnnotationsForStyleTuning === undefined
            ? suite.require_friction_annotations
            : requireFrictionAnnotationsForStyleTuning || suite.require_friction_annotations;
      }
      if (suite.require_style_highlight_annotations !== undefined) {
        requireStyleHighlightAnnotationsForStyleTuning =
          requireStyleHighlightAnnotationsForStyleTuning === undefined
            ? suite.require_style_highlight_annotations
            : requireStyleHighlightAnnotationsForStyleTuning ||
              suite.require_style_highlight_annotations;
      }
      if (suite.require_style_highlight_quality_diversity !== undefined) {
        requireStyleHighlightQualityDiversity =
          requireStyleHighlightQualityDiversity === undefined
            ? suite.require_style_highlight_quality_diversity
            : requireStyleHighlightQualityDiversity ||
              suite.require_style_highlight_quality_diversity;
      }
      if (suite.require_style_fingerprint_separation !== undefined) {
        requireStyleFingerprintSeparation =
          requireStyleFingerprintSeparation === undefined
            ? suite.require_style_fingerprint_separation
            : requireStyleFingerprintSeparation ||
              suite.require_style_fingerprint_separation;
      }
      if (suite.require_authorial_style_continuity !== undefined) {
        requireAuthorialStyleContinuity =
          requireAuthorialStyleContinuity === undefined
            ? suite.require_authorial_style_continuity
            : requireAuthorialStyleContinuity ||
              suite.require_authorial_style_continuity;
      }
      samples.push(
        ...(suite.samples ?? []).map(sample => ({
          sample,
          defaultProfile: suite.default_profile,
          threshold: suite.threshold,
        }))
      );
    } else {
      samples.push({ sample: parsed as RawProseTasteBenchmarkSample });
    }
  }

  if (samples.length === 0) {
    throw new Error(`Prose taste benchmark files in ${inputDir} did not contain any samples`);
  }
  return {
    samples,
    options: {
      requiredReaderSegments: uniqueStrings(requiredReaderSegments),
      minimumReaderSegmentCount: maxNumber(minimumReaderSegmentCounts),
      minimumSamplesPerReaderSegment: maxNumber(minimumSamplesPerReaderSegment),
      minimumFailingSamplesPerReaderSegment: maxNumber(minimumFailingSamplesPerReaderSegment),
      maximumDominantReaderSegmentRatio: minNumber(maximumDominantReaderSegmentRatios),
      minimumHoldoutSampleCount: maxNumber(minimumHoldoutSampleCounts),
      minimumUsableHoldoutSampleCount: maxNumber(minimumUsableHoldoutSampleCounts),
      minimumFailingHoldoutSampleCount: maxNumber(minimumFailingHoldoutSampleCounts),
      minimumUsableFailingHoldoutSampleCount: maxNumber(
        minimumUsableFailingHoldoutSampleCounts
      ),
      minimumFrictionAnnotationCount: maxNumber(minimumFrictionAnnotationCounts),
      minimumActionableFrictionAnnotationCount: maxNumber(
        minimumActionableFrictionAnnotationCounts
      ),
      requireFrictionAnnotationsForStyleTuning,
      minimumStyleHighlightAnnotationCount: maxNumber(minimumStyleHighlightAnnotationCounts),
      minimumActionableStyleHighlightAnnotationCount: maxNumber(
        minimumActionableStyleHighlightAnnotationCounts
      ),
      requireStyleHighlightAnnotationsForStyleTuning,
      minimumStyleHighlightQualityCount: maxNumber(minimumStyleHighlightQualityCounts),
      requireStyleHighlightQualityDiversity,
      minimumStyleFingerprintSamplesPerPolarity: maxNumber(
        minimumStyleFingerprintSamplesPerPolarityCounts
      ),
      minimumStyleFingerprintDistance: maxNumber(minimumStyleFingerprintDistances),
      minimumStyleFingerprintSignalCount: maxNumber(minimumStyleFingerprintSignalCounts),
      requireStyleFingerprintSeparation,
      minimumAuthorialStyleContinuitySamples: maxNumber(
        minimumAuthorialStyleContinuitySampleCounts
      ),
      maximumAuthorialStyleDrift: minNumber(maximumAuthorialStyleDrifts),
      requireAuthorialStyleContinuity,
    },
  };
}

async function normalizeSample(
  projectDir: string,
  loaded: LoadedRawProseTasteBenchmarkSample,
  defaultProfile: ProseTasteProfile | undefined,
  defaultThreshold: number | undefined
): Promise<ProseTasteBenchmarkSample> {
  const sample = loaded.sample;
  const content = await resolveSampleContent(projectDir, sample);
  const profile = mergeProfiles(
    defaultProfile,
    normalizeProfile(loaded.defaultProfile),
    normalizeProfile(sample.profile)
  );

  return {
    id: sample.id,
    label: sample.label,
    readerSegment: normalizeOptionalText(sample.reader_segment),
    calibrationSplit: normalizeCalibrationSplit(sample.calibration_split),
    chapter: sample.chapter,
    version: sample.version,
    contentSource: content.contentSource,
    contentPath: content.contentPath,
    chapterSourceGrounded: content.chapterSourceGrounded,
    content: content.content,
    expectedPassed: sample.expected_passed,
    profile,
    threshold: sample.threshold ?? loaded.threshold ?? defaultThreshold,
    expectedIssueCodes: sample.expected_issue_codes,
    expectedMinScore: sample.expected_min_score,
    expectedMaxScore: sample.expected_max_score,
    styleFrictionAnnotations: normalizeStyleFrictionAnnotations(sample.style_friction_annotations),
    styleHighlightAnnotations: normalizeStyleHighlightAnnotations(sample.style_highlight_annotations),
  };
}

function mergeBenchmarkOptions(
  ...options: Array<ProseTasteBenchmarkOptions | undefined>
): ProseTasteBenchmarkOptions {
  const merged: ProseTasteBenchmarkOptions = {};
  const requiredReaderSegments: string[] = [];

  for (const option of options) {
    if (!option) continue;
    if (option.profile !== undefined) merged.profile = option.profile;
    if (option.threshold !== undefined) merged.threshold = option.threshold;
    requiredReaderSegments.push(...(option.requiredReaderSegments ?? []));
    if (option.minimumReaderSegmentCount !== undefined) {
      merged.minimumReaderSegmentCount = Math.max(
        merged.minimumReaderSegmentCount ?? 0,
        option.minimumReaderSegmentCount
      );
    }
    if (option.minimumSamplesPerReaderSegment !== undefined) {
      merged.minimumSamplesPerReaderSegment = Math.max(
        merged.minimumSamplesPerReaderSegment ?? 0,
        option.minimumSamplesPerReaderSegment
      );
    }
    if (option.minimumFailingSamplesPerReaderSegment !== undefined) {
      merged.minimumFailingSamplesPerReaderSegment = Math.max(
        merged.minimumFailingSamplesPerReaderSegment ?? 0,
        option.minimumFailingSamplesPerReaderSegment
      );
    }
    if (option.maximumDominantReaderSegmentRatio !== undefined) {
      merged.maximumDominantReaderSegmentRatio = Math.min(
        merged.maximumDominantReaderSegmentRatio ?? 1,
        option.maximumDominantReaderSegmentRatio
      );
    }
    if (option.minimumHoldoutSampleCount !== undefined) {
      merged.minimumHoldoutSampleCount = Math.max(
        merged.minimumHoldoutSampleCount ?? 0,
        option.minimumHoldoutSampleCount
      );
    }
    if (option.minimumUsableHoldoutSampleCount !== undefined) {
      merged.minimumUsableHoldoutSampleCount = Math.max(
        merged.minimumUsableHoldoutSampleCount ?? 0,
        option.minimumUsableHoldoutSampleCount
      );
    }
    if (option.minimumFailingHoldoutSampleCount !== undefined) {
      merged.minimumFailingHoldoutSampleCount = Math.max(
        merged.minimumFailingHoldoutSampleCount ?? 0,
        option.minimumFailingHoldoutSampleCount
      );
    }
    if (option.minimumUsableFailingHoldoutSampleCount !== undefined) {
      merged.minimumUsableFailingHoldoutSampleCount = Math.max(
        merged.minimumUsableFailingHoldoutSampleCount ?? 0,
        option.minimumUsableFailingHoldoutSampleCount
      );
    }
    if (option.minimumFrictionAnnotationCount !== undefined) {
      merged.minimumFrictionAnnotationCount = Math.max(
        merged.minimumFrictionAnnotationCount ?? 0,
        option.minimumFrictionAnnotationCount
      );
    }
    if (option.minimumActionableFrictionAnnotationCount !== undefined) {
      merged.minimumActionableFrictionAnnotationCount = Math.max(
        merged.minimumActionableFrictionAnnotationCount ?? 0,
        option.minimumActionableFrictionAnnotationCount
      );
    }
    if (option.requireFrictionAnnotationsForStyleTuning !== undefined) {
      merged.requireFrictionAnnotationsForStyleTuning =
        merged.requireFrictionAnnotationsForStyleTuning === undefined
          ? option.requireFrictionAnnotationsForStyleTuning
          : merged.requireFrictionAnnotationsForStyleTuning ||
            option.requireFrictionAnnotationsForStyleTuning;
    }
    if (option.minimumStyleHighlightAnnotationCount !== undefined) {
      merged.minimumStyleHighlightAnnotationCount = Math.max(
        merged.minimumStyleHighlightAnnotationCount ?? 0,
        option.minimumStyleHighlightAnnotationCount
      );
    }
    if (option.minimumActionableStyleHighlightAnnotationCount !== undefined) {
      merged.minimumActionableStyleHighlightAnnotationCount = Math.max(
        merged.minimumActionableStyleHighlightAnnotationCount ?? 0,
        option.minimumActionableStyleHighlightAnnotationCount
      );
    }
    if (option.requireStyleHighlightAnnotationsForStyleTuning !== undefined) {
      merged.requireStyleHighlightAnnotationsForStyleTuning =
        merged.requireStyleHighlightAnnotationsForStyleTuning === undefined
          ? option.requireStyleHighlightAnnotationsForStyleTuning
          : merged.requireStyleHighlightAnnotationsForStyleTuning ||
            option.requireStyleHighlightAnnotationsForStyleTuning;
    }
    if (option.minimumStyleHighlightQualityCount !== undefined) {
      merged.minimumStyleHighlightQualityCount = Math.max(
        merged.minimumStyleHighlightQualityCount ?? 0,
        option.minimumStyleHighlightQualityCount
      );
    }
    if (option.requireStyleHighlightQualityDiversity !== undefined) {
      merged.requireStyleHighlightQualityDiversity =
        merged.requireStyleHighlightQualityDiversity === undefined
          ? option.requireStyleHighlightQualityDiversity
          : merged.requireStyleHighlightQualityDiversity ||
            option.requireStyleHighlightQualityDiversity;
    }
    if (option.minimumStyleFingerprintSamplesPerPolarity !== undefined) {
      merged.minimumStyleFingerprintSamplesPerPolarity = Math.max(
        merged.minimumStyleFingerprintSamplesPerPolarity ?? 0,
        option.minimumStyleFingerprintSamplesPerPolarity
      );
    }
    if (option.minimumStyleFingerprintDistance !== undefined) {
      merged.minimumStyleFingerprintDistance = Math.max(
        merged.minimumStyleFingerprintDistance ?? 0,
        option.minimumStyleFingerprintDistance
      );
    }
    if (option.minimumStyleFingerprintSignalCount !== undefined) {
      merged.minimumStyleFingerprintSignalCount = Math.max(
        merged.minimumStyleFingerprintSignalCount ?? 0,
        option.minimumStyleFingerprintSignalCount
      );
    }
    if (option.requireStyleFingerprintSeparation !== undefined) {
      merged.requireStyleFingerprintSeparation =
        merged.requireStyleFingerprintSeparation === undefined
          ? option.requireStyleFingerprintSeparation
          : merged.requireStyleFingerprintSeparation ||
            option.requireStyleFingerprintSeparation;
    }
    if (option.minimumAuthorialStyleContinuitySamples !== undefined) {
      merged.minimumAuthorialStyleContinuitySamples = Math.max(
        merged.minimumAuthorialStyleContinuitySamples ?? 0,
        option.minimumAuthorialStyleContinuitySamples
      );
    }
    if (option.maximumAuthorialStyleDrift !== undefined) {
      merged.maximumAuthorialStyleDrift = Math.min(
        merged.maximumAuthorialStyleDrift ?? Number.POSITIVE_INFINITY,
        option.maximumAuthorialStyleDrift
      );
    }
    if (option.requireAuthorialStyleContinuity !== undefined) {
      merged.requireAuthorialStyleContinuity =
        merged.requireAuthorialStyleContinuity === undefined
          ? option.requireAuthorialStyleContinuity
          : merged.requireAuthorialStyleContinuity ||
            option.requireAuthorialStyleContinuity;
    }
  }

  const uniqueRequiredSegments = uniqueStrings(requiredReaderSegments);
  if (uniqueRequiredSegments.length > 0) {
    merged.requiredReaderSegments = uniqueRequiredSegments;
  }
  return merged;
}

function normalizeCalibrationSplit(value: string | undefined): ProseTasteCalibrationSplit | undefined {
  const normalized = normalizeOptionalText(value);
  if (!normalized) return undefined;
  if (
    normalized === 'calibration' ||
    normalized === 'validation' ||
    normalized === 'holdout'
  ) {
    return normalized;
  }
  throw new Error(`Unknown prose taste calibration_split: ${value}`);
}

async function resolveSampleContent(
  projectDir: string,
  sample: RawProseTasteBenchmarkSample
): Promise<ResolvedProseTasteSampleContent> {
  if (sample.content !== undefined) {
    return {
      content: sample.content,
      contentSource: 'inline',
      chapterSourceGrounded: sample.chapter === undefined ? undefined : false,
    };
  }

  if (sample.content_path) {
    const contentPath = path.isAbsolute(sample.content_path)
      ? sample.content_path
      : path.join(projectDir, sample.content_path);
    const normalizedContentPath = normalizeProjectRelativePath(projectDir, contentPath);
    return {
      content: await fs.readFile(contentPath, 'utf8'),
      contentSource: 'content_path',
      contentPath: normalizedContentPath,
      chapterSourceGrounded: sample.chapter === undefined
        ? undefined
        : isChapterManuscriptPath(normalizedContentPath, sample.chapter),
    };
  }

  if (sample.chapter !== undefined) {
    const manuscript = await readChapterManuscript(projectDir, sample.chapter);
    return {
      content: manuscript.content,
      contentSource: 'chapter',
      contentPath: manuscript.contentPath,
      chapterSourceGrounded: true,
    };
  }

  throw new Error(
    `Prose taste benchmark sample ${sample.id} needs content, content_path, or chapter`
  );
}

async function readChapterManuscript(
  projectDir: string,
  chapterNumber: number
): Promise<{ content: string; contentPath: string }> {
  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
    throw new Error(`Prose taste benchmark chapter reference must be a positive integer`);
  }

  const padded = String(chapterNumber).padStart(3, '0');
  const candidates = [
    path.join(projectDir, 'chapters', `chapter_${padded}.md`),
    path.join(projectDir, 'chapters', `ch${padded}.md`),
  ];
  for (const candidate of candidates) {
    const manuscript = await readOptionalText(candidate);
    if (manuscript !== undefined) {
      return {
        content: manuscript,
        contentPath: normalizeProjectRelativePath(projectDir, candidate),
      };
    }
  }

  throw new Error(`No manuscript markdown found for chapter ${chapterNumber}`);
}

function isChapterManuscriptPath(contentPath: string, chapterNumber: number): boolean {
  const padded = String(chapterNumber).padStart(3, '0');
  const normalized = contentPath.replace(/\\/g, '/').toLowerCase();
  return normalized === `chapters/chapter_${padded}.md` ||
    normalized === `chapters/ch${padded}.md`;
}

function normalizeProjectRelativePath(projectDir: string, filePath: string): string {
  return path.relative(projectDir, path.resolve(filePath)).split(path.sep).join('/');
}

function normalizeProfile(raw: RawProseTasteProfile | undefined): ProseTasteProfile | undefined {
  if (!raw) return undefined;

  const profile: ProseTasteProfile = {};
  if ((raw.preferred_mode ?? raw.preferredMode) !== undefined) {
    profile.preferredMode = raw.preferred_mode ?? raw.preferredMode;
  }
  if ((raw.disliked_phrases ?? raw.dislikedPhrases) !== undefined) {
    profile.dislikedPhrases = raw.disliked_phrases ?? raw.dislikedPhrases;
  }
  if ((raw.minimum_score ?? raw.minimumScore) !== undefined) {
    profile.minimumScore = raw.minimum_score ?? raw.minimumScore;
  }
  if ((raw.max_sensory_density_per_1000 ?? raw.maxSensoryDensityPer1000) !== undefined) {
    profile.maxSensoryDensityPer1000 =
      raw.max_sensory_density_per_1000 ?? raw.maxSensoryDensityPer1000;
  }
  if (
    (raw.max_embodied_reaction_density_per_1000 ?? raw.maxEmbodiedReactionDensityPer1000) !==
    undefined
  ) {
    profile.maxEmbodiedReactionDensityPer1000 =
      raw.max_embodied_reaction_density_per_1000 ?? raw.maxEmbodiedReactionDensityPer1000;
  }
  if (
    (raw.max_body_reaction_subject_density_per_1000 ??
      raw.maxBodyReactionSubjectDensityPer1000) !== undefined
  ) {
    profile.maxBodyReactionSubjectDensityPer1000 =
      raw.max_body_reaction_subject_density_per_1000 ??
      raw.maxBodyReactionSubjectDensityPer1000;
  }
  if ((raw.max_body_reaction_subject_run ?? raw.maxBodyReactionSubjectRun) !== undefined) {
    profile.maxBodyReactionSubjectRun =
      raw.max_body_reaction_subject_run ?? raw.maxBodyReactionSubjectRun;
  }
  if (
    (raw.max_cliche_emotion_image_density_per_1000 ??
      raw.maxClicheEmotionImageDensityPer1000) !== undefined
  ) {
    profile.maxClicheEmotionImageDensityPer1000 =
      raw.max_cliche_emotion_image_density_per_1000 ??
      raw.maxClicheEmotionImageDensityPer1000;
  }
  if ((raw.max_cliche_emotion_image_run ?? raw.maxClicheEmotionImageRun) !== undefined) {
    profile.maxClicheEmotionImageRun =
      raw.max_cliche_emotion_image_run ?? raw.maxClicheEmotionImageRun;
  }
  if (
    (raw.max_symbolic_abstraction_density_per_1000 ??
      raw.maxSymbolicAbstractionDensityPer1000) !== undefined
  ) {
    profile.maxSymbolicAbstractionDensityPer1000 =
      raw.max_symbolic_abstraction_density_per_1000 ??
      raw.maxSymbolicAbstractionDensityPer1000;
  }
  if ((raw.max_symbolic_abstraction_run ?? raw.maxSymbolicAbstractionRun) !== undefined) {
    profile.maxSymbolicAbstractionRun =
      raw.max_symbolic_abstraction_run ?? raw.maxSymbolicAbstractionRun;
  }
  if ((raw.max_metaphor_density_per_1000 ?? raw.maxMetaphorDensityPer1000) !== undefined) {
    profile.maxMetaphorDensityPer1000 =
      raw.max_metaphor_density_per_1000 ?? raw.maxMetaphorDensityPer1000;
  }
  if ((raw.max_sensory_wallpaper_run ?? raw.maxSensoryWallpaperRun) !== undefined) {
    profile.maxSensoryWallpaperRun =
      raw.max_sensory_wallpaper_run ?? raw.maxSensoryWallpaperRun;
  }
  if ((raw.max_emotion_label_density_per_1000 ?? raw.maxEmotionLabelDensityPer1000) !== undefined) {
    profile.maxEmotionLabelDensityPer1000 =
      raw.max_emotion_label_density_per_1000 ?? raw.maxEmotionLabelDensityPer1000;
  }
  if ((raw.max_emotion_label_run ?? raw.maxEmotionLabelRun) !== undefined) {
    profile.maxEmotionLabelRun = raw.max_emotion_label_run ?? raw.maxEmotionLabelRun;
  }
  if (
    (raw.max_hedged_perception_density_per_1000 ?? raw.maxHedgedPerceptionDensityPer1000) !==
    undefined
  ) {
    profile.maxHedgedPerceptionDensityPer1000 =
      raw.max_hedged_perception_density_per_1000 ?? raw.maxHedgedPerceptionDensityPer1000;
  }
  if ((raw.max_abstract_noun_density_per_1000 ?? raw.maxAbstractNounDensityPer1000) !== undefined) {
    profile.maxAbstractNounDensityPer1000 =
      raw.max_abstract_noun_density_per_1000 ?? raw.maxAbstractNounDensityPer1000;
  }
  if (
    (raw.max_cognitive_filter_density_per_1000 ?? raw.maxCognitiveFilterDensityPer1000) !==
    undefined
  ) {
    profile.maxCognitiveFilterDensityPer1000 =
      raw.max_cognitive_filter_density_per_1000 ?? raw.maxCognitiveFilterDensityPer1000;
  }
  if (
    (raw.max_therapy_speak_density_per_1000 ?? raw.maxTherapySpeakDensityPer1000) !==
    undefined
  ) {
    profile.maxTherapySpeakDensityPer1000 =
      raw.max_therapy_speak_density_per_1000 ?? raw.maxTherapySpeakDensityPer1000;
  }
  if ((raw.max_therapy_speak_run ?? raw.maxTherapySpeakRun) !== undefined) {
    profile.maxTherapySpeakRun = raw.max_therapy_speak_run ?? raw.maxTherapySpeakRun;
  }
  if (
    (raw.max_backstory_exposition_density_per_1000 ??
      raw.maxBackstoryExpositionDensityPer1000) !== undefined
  ) {
    profile.maxBackstoryExpositionDensityPer1000 =
      raw.max_backstory_exposition_density_per_1000 ??
      raw.maxBackstoryExpositionDensityPer1000;
  }
  if (
    (raw.max_backstory_exposition_run ?? raw.maxBackstoryExpositionRun) !== undefined
  ) {
    profile.maxBackstoryExpositionRun =
      raw.max_backstory_exposition_run ?? raw.maxBackstoryExpositionRun;
  }
  if (
    (raw.max_relationship_montage_summary_density_per_1000 ??
      raw.maxRelationshipMontageSummaryDensityPer1000) !== undefined
  ) {
    profile.maxRelationshipMontageSummaryDensityPer1000 =
      raw.max_relationship_montage_summary_density_per_1000 ??
      raw.maxRelationshipMontageSummaryDensityPer1000;
  }
  if (
    (raw.max_relationship_montage_summary_run ??
      raw.maxRelationshipMontageSummaryRun) !== undefined
  ) {
    profile.maxRelationshipMontageSummaryRun =
      raw.max_relationship_montage_summary_run ??
      raw.maxRelationshipMontageSummaryRun;
  }
  if (
    (raw.max_time_skip_summary_density_per_1000 ??
      raw.maxTimeSkipSummaryDensityPer1000) !== undefined
  ) {
    profile.maxTimeSkipSummaryDensityPer1000 =
      raw.max_time_skip_summary_density_per_1000 ??
      raw.maxTimeSkipSummaryDensityPer1000;
  }
  if (
    (raw.max_time_skip_summary_run ??
      raw.maxTimeSkipSummaryRun) !== undefined
  ) {
    profile.maxTimeSkipSummaryRun =
      raw.max_time_skip_summary_run ?? raw.maxTimeSkipSummaryRun;
  }
  if (
    (raw.max_contrastive_reframe_density_per_1000 ??
      raw.maxContrastiveReframeDensityPer1000) !== undefined
  ) {
    profile.maxContrastiveReframeDensityPer1000 =
      raw.max_contrastive_reframe_density_per_1000 ??
      raw.maxContrastiveReframeDensityPer1000;
  }
  if (
    (raw.max_contrastive_reframe_run ??
      raw.maxContrastiveReframeRun) !== undefined
  ) {
    profile.maxContrastiveReframeRun =
      raw.max_contrastive_reframe_run ?? raw.maxContrastiveReframeRun;
  }
  if (
    (raw.max_lore_term_density_per_1000 ?? raw.maxLoreTermDensityPer1000) !==
    undefined
  ) {
    profile.maxLoreTermDensityPer1000 =
      raw.max_lore_term_density_per_1000 ?? raw.maxLoreTermDensityPer1000;
  }
  if ((raw.max_lore_term_run ?? raw.maxLoreTermRun) !== undefined) {
    profile.maxLoreTermRun = raw.max_lore_term_run ?? raw.maxLoreTermRun;
  }
  if (
    (raw.max_system_stat_block_density_per_1000 ??
      raw.maxSystemStatBlockDensityPer1000) !== undefined
  ) {
    profile.maxSystemStatBlockDensityPer1000 =
      raw.max_system_stat_block_density_per_1000 ??
      raw.maxSystemStatBlockDensityPer1000;
  }
  if ((raw.max_system_stat_block_run ?? raw.maxSystemStatBlockRun) !== undefined) {
    profile.maxSystemStatBlockRun =
      raw.max_system_stat_block_run ?? raw.maxSystemStatBlockRun;
  }
  if (
    (raw.max_declared_resolve_density_per_1000 ??
      raw.maxDeclaredResolveDensityPer1000) !== undefined
  ) {
    profile.maxDeclaredResolveDensityPer1000 =
      raw.max_declared_resolve_density_per_1000 ??
      raw.maxDeclaredResolveDensityPer1000;
  }
  if ((raw.max_declared_resolve_run ?? raw.maxDeclaredResolveRun) !== undefined) {
    profile.maxDeclaredResolveRun =
      raw.max_declared_resolve_run ?? raw.maxDeclaredResolveRun;
  }
  if (
    (raw.max_revelation_summary_density_per_1000 ??
      raw.maxRevelationSummaryDensityPer1000) !== undefined
  ) {
    profile.maxRevelationSummaryDensityPer1000 =
      raw.max_revelation_summary_density_per_1000 ??
      raw.maxRevelationSummaryDensityPer1000;
  }
  if ((raw.max_revelation_summary_run ?? raw.maxRevelationSummaryRun) !== undefined) {
    profile.maxRevelationSummaryRun =
      raw.max_revelation_summary_run ?? raw.maxRevelationSummaryRun;
  }
  if (
    (raw.max_procedural_checklist_density_per_1000 ??
      raw.maxProceduralChecklistDensityPer1000) !== undefined
  ) {
    profile.maxProceduralChecklistDensityPer1000 =
      raw.max_procedural_checklist_density_per_1000 ??
      raw.maxProceduralChecklistDensityPer1000;
  }
  if ((raw.max_procedural_checklist_run ?? raw.maxProceduralChecklistRun) !== undefined) {
    profile.maxProceduralChecklistRun =
      raw.max_procedural_checklist_run ?? raw.maxProceduralChecklistRun;
  }
  if (
    (raw.max_action_choreography_density_per_1000 ??
      raw.maxActionChoreographyDensityPer1000) !== undefined
  ) {
    profile.maxActionChoreographyDensityPer1000 =
      raw.max_action_choreography_density_per_1000 ??
      raw.maxActionChoreographyDensityPer1000;
  }
  if ((raw.max_action_choreography_run ?? raw.maxActionChoreographyRun) !== undefined) {
    profile.maxActionChoreographyRun =
      raw.max_action_choreography_run ?? raw.maxActionChoreographyRun;
  }
  if (
    (raw.max_nominalized_explanation_density_per_1000 ??
      raw.maxNominalizedExplanationDensityPer1000) !== undefined
  ) {
    profile.maxNominalizedExplanationDensityPer1000 =
      raw.max_nominalized_explanation_density_per_1000 ??
      raw.maxNominalizedExplanationDensityPer1000;
  }
  if (
    (raw.max_translationese_formula_density_per_1000 ??
      raw.maxTranslationeseFormulaDensityPer1000) !== undefined
  ) {
    profile.maxTranslationeseFormulaDensityPer1000 =
      raw.max_translationese_formula_density_per_1000 ??
      raw.maxTranslationeseFormulaDensityPer1000;
  }
  if (
    (raw.max_connective_starter_density_per_1000 ??
      raw.maxConnectiveStarterDensityPer1000) !== undefined
  ) {
    profile.maxConnectiveStarterDensityPer1000 =
      raw.max_connective_starter_density_per_1000 ??
      raw.maxConnectiveStarterDensityPer1000;
  }
  if (
    (raw.max_filler_adverb_density_per_1000 ?? raw.maxFillerAdverbDensityPer1000) !==
    undefined
  ) {
    profile.maxFillerAdverbDensityPer1000 =
      raw.max_filler_adverb_density_per_1000 ?? raw.maxFillerAdverbDensityPer1000;
  }
  if ((raw.max_filler_adverb_run ?? raw.maxFillerAdverbRun) !== undefined) {
    profile.maxFillerAdverbRun = raw.max_filler_adverb_run ?? raw.maxFillerAdverbRun;
  }
  if (
    (raw.max_simultaneous_action_density_per_1000 ??
      raw.maxSimultaneousActionDensityPer1000) !== undefined
  ) {
    profile.maxSimultaneousActionDensityPer1000 =
      raw.max_simultaneous_action_density_per_1000 ??
      raw.maxSimultaneousActionDensityPer1000;
  }
  if ((raw.max_simultaneous_action_run ?? raw.maxSimultaneousActionRun) !== undefined) {
    profile.maxSimultaneousActionRun =
      raw.max_simultaneous_action_run ?? raw.maxSimultaneousActionRun;
  }
  if (
    (raw.max_status_quo_action_density_per_1000 ?? raw.maxStatusQuoActionDensityPer1000) !==
    undefined
  ) {
    profile.maxStatusQuoActionDensityPer1000 =
      raw.max_status_quo_action_density_per_1000 ?? raw.maxStatusQuoActionDensityPer1000;
  }
  if ((raw.max_status_quo_action_run ?? raw.maxStatusQuoActionRun) !== undefined) {
    profile.maxStatusQuoActionRun =
      raw.max_status_quo_action_run ?? raw.maxStatusQuoActionRun;
  }
  if (
    (raw.max_gaze_choreography_density_per_1000 ??
      raw.maxGazeChoreographyDensityPer1000) !== undefined
  ) {
    profile.maxGazeChoreographyDensityPer1000 =
      raw.max_gaze_choreography_density_per_1000 ??
      raw.maxGazeChoreographyDensityPer1000;
  }
  if ((raw.max_gaze_choreography_run ?? raw.maxGazeChoreographyRun) !== undefined) {
    profile.maxGazeChoreographyRun =
      raw.max_gaze_choreography_run ?? raw.maxGazeChoreographyRun;
  }
  if (
    (raw.min_causal_turn_density_per_1000 ?? raw.minCausalTurnDensityPer1000) !== undefined
  ) {
    profile.minCausalTurnDensityPer1000 =
      raw.min_causal_turn_density_per_1000 ?? raw.minCausalTurnDensityPer1000;
  }
  if ((raw.max_comma_density_per_1000 ?? raw.maxCommaDensityPer1000) !== undefined) {
    profile.maxCommaDensityPer1000 =
      raw.max_comma_density_per_1000 ?? raw.maxCommaDensityPer1000;
  }
  if (
    (raw.max_reporting_tail_density_per_1000 ?? raw.maxReportingTailDensityPer1000) !==
    undefined
  ) {
    profile.maxReportingTailDensityPer1000 =
      raw.max_reporting_tail_density_per_1000 ?? raw.maxReportingTailDensityPer1000;
  }
  if (
    (raw.max_emphasis_punctuation_density_per_1000 ??
      raw.maxEmphasisPunctuationDensityPer1000) !== undefined
  ) {
    profile.maxEmphasisPunctuationDensityPer1000 =
      raw.max_emphasis_punctuation_density_per_1000 ??
      raw.maxEmphasisPunctuationDensityPer1000;
  }
  if ((raw.max_emphasis_punctuation_run ?? raw.maxEmphasisPunctuationRun) !== undefined) {
    profile.maxEmphasisPunctuationRun =
      raw.max_emphasis_punctuation_run ?? raw.maxEmphasisPunctuationRun;
  }
  if (
    (raw.max_static_description_density_per_1000 ?? raw.maxStaticDescriptionDensityPer1000) !==
    undefined
  ) {
    profile.maxStaticDescriptionDensityPer1000 =
      raw.max_static_description_density_per_1000 ?? raw.maxStaticDescriptionDensityPer1000;
  }
  if (
    (raw.max_generic_teaser_density_per_1000 ?? raw.maxGenericTeaserDensityPer1000) !==
    undefined
  ) {
    profile.maxGenericTeaserDensityPer1000 =
      raw.max_generic_teaser_density_per_1000 ?? raw.maxGenericTeaserDensityPer1000;
  }
  if (
    (raw.max_thin_cliffhanger_ending_count ?? raw.maxThinCliffhangerEndingCount) !== undefined
  ) {
    profile.maxThinCliffhangerEndingCount =
      raw.max_thin_cliffhanger_ending_count ?? raw.maxThinCliffhangerEndingCount;
  }
  if (
    (raw.max_pov_mind_jump_density_per_1000 ?? raw.maxPovMindJumpDensityPer1000) !==
    undefined
  ) {
    profile.maxPovMindJumpDensityPer1000 =
      raw.max_pov_mind_jump_density_per_1000 ?? raw.maxPovMindJumpDensityPer1000;
  }
  if ((raw.max_pov_mind_jump_run ?? raw.maxPovMindJumpRun) !== undefined) {
    profile.maxPovMindJumpRun = raw.max_pov_mind_jump_run ?? raw.maxPovMindJumpRun;
  }
  if ((raw.max_expository_dialogue_ratio ?? raw.maxExpositoryDialogueRatio) !== undefined) {
    profile.maxExpositoryDialogueRatio =
      raw.max_expository_dialogue_ratio ?? raw.maxExpositoryDialogueRatio;
  }
  if ((raw.max_dialogue_turn_length ?? raw.maxDialogueTurnLength) !== undefined) {
    profile.maxDialogueTurnLength = raw.max_dialogue_turn_length ?? raw.maxDialogueTurnLength;
  }
  if ((raw.max_average_dialogue_turn_length ?? raw.maxAverageDialogueTurnLength) !== undefined) {
    profile.maxAverageDialogueTurnLength =
      raw.max_average_dialogue_turn_length ?? raw.maxAverageDialogueTurnLength;
  }
  if ((raw.max_dialogue_grounding_gap_run ?? raw.maxDialogueGroundingGapRun) !== undefined) {
    profile.maxDialogueGroundingGapRun =
      raw.max_dialogue_grounding_gap_run ?? raw.maxDialogueGroundingGapRun;
  }
  if ((raw.max_dialogue_question_ratio ?? raw.maxDialogueQuestionRatio) !== undefined) {
    profile.maxDialogueQuestionRatio =
      raw.max_dialogue_question_ratio ?? raw.maxDialogueQuestionRatio;
  }
  if ((raw.max_dialogue_question_run ?? raw.maxDialogueQuestionRun) !== undefined) {
    profile.maxDialogueQuestionRun =
      raw.max_dialogue_question_run ?? raw.maxDialogueQuestionRun;
  }
  if ((raw.max_dialogue_vocative_ratio ?? raw.maxDialogueVocativeRatio) !== undefined) {
    profile.maxDialogueVocativeRatio =
      raw.max_dialogue_vocative_ratio ?? raw.maxDialogueVocativeRatio;
  }
  if ((raw.max_dialogue_vocative_run ?? raw.maxDialogueVocativeRun) !== undefined) {
    profile.maxDialogueVocativeRun =
      raw.max_dialogue_vocative_run ?? raw.maxDialogueVocativeRun;
  }
  if ((raw.max_dialogue_lexical_echo_ratio ?? raw.maxDialogueLexicalEchoRatio) !== undefined) {
    profile.maxDialogueLexicalEchoRatio =
      raw.max_dialogue_lexical_echo_ratio ?? raw.maxDialogueLexicalEchoRatio;
  }
  if ((raw.max_dialogue_lexical_echo_run ?? raw.maxDialogueLexicalEchoRun) !== undefined) {
    profile.maxDialogueLexicalEchoRun =
      raw.max_dialogue_lexical_echo_run ?? raw.maxDialogueLexicalEchoRun;
  }
  if (
    (raw.max_dialogue_paraphrase_confirmation_ratio ??
      raw.maxDialogueParaphraseConfirmationRatio) !== undefined
  ) {
    profile.maxDialogueParaphraseConfirmationRatio =
      raw.max_dialogue_paraphrase_confirmation_ratio ??
      raw.maxDialogueParaphraseConfirmationRatio;
  }
  if (
    (raw.max_dialogue_paraphrase_confirmation_run ??
      raw.maxDialogueParaphraseConfirmationRun) !== undefined
  ) {
    profile.maxDialogueParaphraseConfirmationRun =
      raw.max_dialogue_paraphrase_confirmation_run ??
      raw.maxDialogueParaphraseConfirmationRun;
  }
  if ((raw.max_rote_dialogue_reply_ratio ?? raw.maxRoteDialogueReplyRatio) !== undefined) {
    profile.maxRoteDialogueReplyRatio =
      raw.max_rote_dialogue_reply_ratio ?? raw.maxRoteDialogueReplyRatio;
  }
  if ((raw.max_rote_dialogue_reply_run ?? raw.maxRoteDialogueReplyRun) !== undefined) {
    profile.maxRoteDialogueReplyRun =
      raw.max_rote_dialogue_reply_run ?? raw.maxRoteDialogueReplyRun;
  }
  if ((raw.max_neutral_dialogue_tag_ratio ?? raw.maxNeutralDialogueTagRatio) !== undefined) {
    profile.maxNeutralDialogueTagRatio =
      raw.max_neutral_dialogue_tag_ratio ?? raw.maxNeutralDialogueTagRatio;
  }
  if ((raw.max_neutral_dialogue_tag_run ?? raw.maxNeutralDialogueTagRun) !== undefined) {
    profile.maxNeutralDialogueTagRun =
      raw.max_neutral_dialogue_tag_run ?? raw.maxNeutralDialogueTagRun;
  }
  if (
    (raw.max_silence_stall_density_per_1000 ?? raw.maxSilenceStallDensityPer1000) !==
    undefined
  ) {
    profile.maxSilenceStallDensityPer1000 =
      raw.max_silence_stall_density_per_1000 ?? raw.maxSilenceStallDensityPer1000;
  }
  if ((raw.max_silence_stall_run ?? raw.maxSilenceStallRun) !== undefined) {
    profile.maxSilenceStallRun =
      raw.max_silence_stall_run ?? raw.maxSilenceStallRun;
  }
  if (
    (raw.max_melodramatic_caption_density_per_1000 ??
      raw.maxMelodramaticCaptionDensityPer1000) !== undefined
  ) {
    profile.maxMelodramaticCaptionDensityPer1000 =
      raw.max_melodramatic_caption_density_per_1000 ??
      raw.maxMelodramaticCaptionDensityPer1000;
  }
  if (
    (raw.max_melodramatic_caption_run ?? raw.maxMelodramaticCaptionRun) !== undefined
  ) {
    profile.maxMelodramaticCaptionRun =
      raw.max_melodramatic_caption_run ?? raw.maxMelodramaticCaptionRun;
  }
  if (
    (raw.max_stock_reaction_beat_density_per_1000 ??
      raw.maxStockReactionBeatDensityPer1000) !== undefined
  ) {
    profile.maxStockReactionBeatDensityPer1000 =
      raw.max_stock_reaction_beat_density_per_1000 ??
      raw.maxStockReactionBeatDensityPer1000;
  }
  if ((raw.max_stock_reaction_beat_run ?? raw.maxStockReactionBeatRun) !== undefined) {
    profile.maxStockReactionBeatRun =
      raw.max_stock_reaction_beat_run ?? raw.maxStockReactionBeatRun;
  }
  if (
    (raw.max_prop_fidget_beat_density_per_1000 ??
      raw.maxPropFidgetBeatDensityPer1000) !== undefined
  ) {
    profile.maxPropFidgetBeatDensityPer1000 =
      raw.max_prop_fidget_beat_density_per_1000 ??
      raw.maxPropFidgetBeatDensityPer1000;
  }
  if ((raw.max_prop_fidget_beat_run ?? raw.maxPropFidgetBeatRun) !== undefined) {
    profile.maxPropFidgetBeatRun =
      raw.max_prop_fidget_beat_run ?? raw.maxPropFidgetBeatRun;
  }
  if (
    (raw.max_facial_expression_beat_density_per_1000 ??
      raw.maxFacialExpressionBeatDensityPer1000) !== undefined
  ) {
    profile.maxFacialExpressionBeatDensityPer1000 =
      raw.max_facial_expression_beat_density_per_1000 ??
      raw.maxFacialExpressionBeatDensityPer1000;
  }
  if (
    (raw.max_facial_expression_beat_run ?? raw.maxFacialExpressionBeatRun) !== undefined
  ) {
    profile.maxFacialExpressionBeatRun =
      raw.max_facial_expression_beat_run ?? raw.maxFacialExpressionBeatRun;
  }
  if (
    (raw.max_vague_atmosphere_modifier_density_per_1000 ??
      raw.maxVagueAtmosphereModifierDensityPer1000) !== undefined
  ) {
    profile.maxVagueAtmosphereModifierDensityPer1000 =
      raw.max_vague_atmosphere_modifier_density_per_1000 ??
      raw.maxVagueAtmosphereModifierDensityPer1000;
  }
  if (
    (raw.max_vague_atmosphere_modifier_run ?? raw.maxVagueAtmosphereModifierRun) !== undefined
  ) {
    profile.maxVagueAtmosphereModifierRun =
      raw.max_vague_atmosphere_modifier_run ?? raw.maxVagueAtmosphereModifierRun;
  }
  if (
    (raw.max_evaluative_modifier_density_per_1000 ??
      raw.maxEvaluativeModifierDensityPer1000) !== undefined
  ) {
    profile.maxEvaluativeModifierDensityPer1000 =
      raw.max_evaluative_modifier_density_per_1000 ??
      raw.maxEvaluativeModifierDensityPer1000;
  }
  if ((raw.max_evaluative_modifier_run ?? raw.maxEvaluativeModifierRun) !== undefined) {
    profile.maxEvaluativeModifierRun =
      raw.max_evaluative_modifier_run ?? raw.maxEvaluativeModifierRun;
  }
  if (
    (raw.max_rhetorical_question_density_per_1000 ??
      raw.maxRhetoricalQuestionDensityPer1000) !== undefined
  ) {
    profile.maxRhetoricalQuestionDensityPer1000 =
      raw.max_rhetorical_question_density_per_1000 ??
      raw.maxRhetoricalQuestionDensityPer1000;
  }
  if ((raw.max_rhetorical_question_run ?? raw.maxRhetoricalQuestionRun) !== undefined) {
    profile.maxRhetoricalQuestionRun =
      raw.max_rhetorical_question_run ?? raw.maxRhetoricalQuestionRun;
  }
  if (
    (raw.max_subtext_explanation_density_per_1000 ??
      raw.maxSubtextExplanationDensityPer1000) !== undefined
  ) {
    profile.maxSubtextExplanationDensityPer1000 =
      raw.max_subtext_explanation_density_per_1000 ??
      raw.maxSubtextExplanationDensityPer1000;
  }
  if ((raw.max_subtext_explanation_run ?? raw.maxSubtextExplanationRun) !== undefined) {
    profile.maxSubtextExplanationRun =
      raw.max_subtext_explanation_run ?? raw.maxSubtextExplanationRun;
  }
  if (
    (raw.max_ambiguous_reference_density_per_1000 ??
      raw.maxAmbiguousReferenceDensityPer1000) !== undefined
  ) {
    profile.maxAmbiguousReferenceDensityPer1000 =
      raw.max_ambiguous_reference_density_per_1000 ??
      raw.maxAmbiguousReferenceDensityPer1000;
  }
  if ((raw.max_ambiguous_reference_run ?? raw.maxAmbiguousReferenceRun) !== undefined) {
    profile.maxAmbiguousReferenceRun =
      raw.max_ambiguous_reference_run ?? raw.maxAmbiguousReferenceRun;
  }
  if (
    (raw.max_scene_transition_grounding_gap_density_per_1000 ??
      raw.maxSceneTransitionGroundingGapDensityPer1000) !== undefined
  ) {
    profile.maxSceneTransitionGroundingGapDensityPer1000 =
      raw.max_scene_transition_grounding_gap_density_per_1000 ??
      raw.maxSceneTransitionGroundingGapDensityPer1000;
  }
  if (
    (raw.max_scene_transition_grounding_gap_run ??
      raw.maxSceneTransitionGroundingGapRun) !== undefined
  ) {
    profile.maxSceneTransitionGroundingGapRun =
      raw.max_scene_transition_grounding_gap_run ?? raw.maxSceneTransitionGroundingGapRun;
  }
  if (
    (raw.max_topic_marker_starter_density_per_1000 ??
      raw.maxTopicMarkerStarterDensityPer1000) !== undefined
  ) {
    profile.maxTopicMarkerStarterDensityPer1000 =
      raw.max_topic_marker_starter_density_per_1000 ??
      raw.maxTopicMarkerStarterDensityPer1000;
  }
  if ((raw.max_topic_marker_starter_run ?? raw.maxTopicMarkerStarterRun) !== undefined) {
    profile.maxTopicMarkerStarterRun =
      raw.max_topic_marker_starter_run ?? raw.maxTopicMarkerStarterRun;
  }
  if (
    (raw.min_sentence_length_variation_coefficient ??
      raw.minSentenceLengthVariationCoefficient) !== undefined
  ) {
    profile.minSentenceLengthVariationCoefficient =
      raw.min_sentence_length_variation_coefficient ??
      raw.minSentenceLengthVariationCoefficient;
  }
  if ((raw.max_uniform_sentence_length_run ?? raw.maxUniformSentenceLengthRun) !== undefined) {
    profile.maxUniformSentenceLengthRun =
      raw.max_uniform_sentence_length_run ?? raw.maxUniformSentenceLengthRun;
  }
  if ((raw.max_uniform_paragraph_beat_run ?? raw.maxUniformParagraphBeatRun) !== undefined) {
    profile.maxUniformParagraphBeatRun =
      raw.max_uniform_paragraph_beat_run ?? raw.maxUniformParagraphBeatRun;
  }
  if ((raw.max_same_ending_run ?? raw.maxSameEndingRun) !== undefined) {
    profile.maxSameEndingRun = raw.max_same_ending_run ?? raw.maxSameEndingRun;
  }
  if (
    (raw.max_dominant_sentence_ending_share ??
      raw.maxDominantSentenceEndingShare) !== undefined
  ) {
    profile.maxDominantSentenceEndingShare =
      raw.max_dominant_sentence_ending_share ?? raw.maxDominantSentenceEndingShare;
  }
  if (
    (raw.max_dominant_dialogue_ending_share ??
      raw.maxDominantDialogueEndingShare) !== undefined
  ) {
    profile.maxDominantDialogueEndingShare =
      raw.max_dominant_dialogue_ending_share ?? raw.maxDominantDialogueEndingShare;
  }
  if (
    (raw.max_dominant_dialogue_starter_share ??
      raw.maxDominantDialogueStarterShare) !== undefined
  ) {
    profile.maxDominantDialogueStarterShare =
      raw.max_dominant_dialogue_starter_share ?? raw.maxDominantDialogueStarterShare;
  }
  if (
    (raw.min_viewpoint_anchor_density_per_1000 ?? raw.minViewpointAnchorDensityPer1000) !==
    undefined
  ) {
    profile.minViewpointAnchorDensityPer1000 =
      raw.min_viewpoint_anchor_density_per_1000 ?? raw.minViewpointAnchorDensityPer1000;
  }
  if (
    (raw.min_immersive_rhythm_anchor_density_per_1000 ??
      raw.minImmersiveRhythmAnchorDensityPer1000) !== undefined
  ) {
    profile.minImmersiveRhythmAnchorDensityPer1000 =
      raw.min_immersive_rhythm_anchor_density_per_1000 ??
      raw.minImmersiveRhythmAnchorDensityPer1000;
  }
  if (
    (raw.max_immersive_rhythm_flatline_run ?? raw.maxImmersiveRhythmFlatlineRun) !==
    undefined
  ) {
    profile.maxImmersiveRhythmFlatlineRun =
      raw.max_immersive_rhythm_flatline_run ?? raw.maxImmersiveRhythmFlatlineRun;
  }
  if ((raw.max_short_sentence_run ?? raw.maxShortSentenceRun) !== undefined) {
    profile.maxShortSentenceRun = raw.max_short_sentence_run ?? raw.maxShortSentenceRun;
  }
  if ((raw.max_repeated_subject_run ?? raw.maxRepeatedSubjectRun) !== undefined) {
    profile.maxRepeatedSubjectRun = raw.max_repeated_subject_run ?? raw.maxRepeatedSubjectRun;
  }
  if (
    (raw.max_repeated_connective_starter_run ?? raw.maxRepeatedConnectiveStarterRun) !==
    undefined
  ) {
    profile.maxRepeatedConnectiveStarterRun =
      raw.max_repeated_connective_starter_run ?? raw.maxRepeatedConnectiveStarterRun;
  }

  return Object.keys(profile).length > 0 ? profile : undefined;
}

function normalizeStyleFrictionAnnotations(
  raw: RawProseTasteFrictionAnnotation[] | undefined
): ProseTasteFrictionAnnotation[] | undefined {
  if (!raw) return undefined;
  const annotations = raw
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      reason: normalizeOptionalText(annotation.reason),
      issueCode: annotation.issue_code,
      severity: annotation.severity,
      readerCount: normalizePositiveInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
      rewriteSuggestion: normalizeOptionalText(annotation.rewrite_suggestion),
      targetText: normalizeOptionalText(annotation.target_text),
    }))
    .filter(annotation =>
      annotation.location !== undefined ||
      annotation.reason !== undefined ||
      annotation.issueCode !== undefined ||
      annotation.rewriteSuggestion !== undefined ||
      annotation.targetText !== undefined
    );
  return annotations.length > 0 ? annotations : undefined;
}

function normalizeStyleHighlightAnnotations(
  raw: RawProseTasteStyleHighlightAnnotation[] | undefined
): ProseTasteStyleHighlightAnnotation[] | undefined {
  if (!raw) return undefined;
  const annotations = raw
    .map(annotation => ({
      location: normalizeOptionalText(annotation.location),
      reason: normalizeOptionalText(annotation.reason),
      quality: annotation.quality,
      readerCount: normalizePositiveInteger(annotation.reader_count),
      readerSegment: normalizeOptionalText(annotation.reader_segment),
      targetText: normalizeOptionalText(annotation.target_text),
      transferGuidance: normalizeOptionalText(annotation.transfer_guidance),
    }))
    .filter(annotation =>
      annotation.location !== undefined ||
      annotation.reason !== undefined ||
      annotation.quality !== undefined ||
      annotation.transferGuidance !== undefined ||
      annotation.targetText !== undefined
    );
  return annotations.length > 0 ? annotations : undefined;
}

function mergeProfiles(
  ...profiles: Array<ProseTasteProfile | undefined>
): ProseTasteProfile | undefined {
  const merged: ProseTasteProfile = {};
  const dislikedPhrases: string[] = [];
  let hasProfile = false;

  for (const profile of profiles) {
    if (!profile) continue;
    hasProfile = true;

    if (profile.preferredMode !== undefined) merged.preferredMode = profile.preferredMode;
    if (profile.minimumScore !== undefined) merged.minimumScore = profile.minimumScore;
    if (profile.maxSensoryDensityPer1000 !== undefined) {
      merged.maxSensoryDensityPer1000 = profile.maxSensoryDensityPer1000;
    }
    if (profile.maxEmbodiedReactionDensityPer1000 !== undefined) {
      merged.maxEmbodiedReactionDensityPer1000 = profile.maxEmbodiedReactionDensityPer1000;
    }
    if (profile.maxBodyReactionSubjectDensityPer1000 !== undefined) {
      merged.maxBodyReactionSubjectDensityPer1000 =
        profile.maxBodyReactionSubjectDensityPer1000;
    }
    if (profile.maxBodyReactionSubjectRun !== undefined) {
      merged.maxBodyReactionSubjectRun = profile.maxBodyReactionSubjectRun;
    }
    if (profile.maxClicheEmotionImageDensityPer1000 !== undefined) {
      merged.maxClicheEmotionImageDensityPer1000 =
        profile.maxClicheEmotionImageDensityPer1000;
    }
    if (profile.maxClicheEmotionImageRun !== undefined) {
      merged.maxClicheEmotionImageRun = profile.maxClicheEmotionImageRun;
    }
    if (profile.maxSymbolicAbstractionDensityPer1000 !== undefined) {
      merged.maxSymbolicAbstractionDensityPer1000 =
        profile.maxSymbolicAbstractionDensityPer1000;
    }
    if (profile.maxSymbolicAbstractionRun !== undefined) {
      merged.maxSymbolicAbstractionRun = profile.maxSymbolicAbstractionRun;
    }
    if (profile.maxMetaphorDensityPer1000 !== undefined) {
      merged.maxMetaphorDensityPer1000 = profile.maxMetaphorDensityPer1000;
    }
    if (profile.maxSensoryWallpaperRun !== undefined) {
      merged.maxSensoryWallpaperRun = profile.maxSensoryWallpaperRun;
    }
    if (profile.maxEmotionLabelDensityPer1000 !== undefined) {
      merged.maxEmotionLabelDensityPer1000 = profile.maxEmotionLabelDensityPer1000;
    }
    if (profile.maxEmotionLabelRun !== undefined) {
      merged.maxEmotionLabelRun = profile.maxEmotionLabelRun;
    }
    if (profile.maxHedgedPerceptionDensityPer1000 !== undefined) {
      merged.maxHedgedPerceptionDensityPer1000 = profile.maxHedgedPerceptionDensityPer1000;
    }
    if (profile.maxAbstractNounDensityPer1000 !== undefined) {
      merged.maxAbstractNounDensityPer1000 = profile.maxAbstractNounDensityPer1000;
    }
    if (profile.maxCognitiveFilterDensityPer1000 !== undefined) {
      merged.maxCognitiveFilterDensityPer1000 = profile.maxCognitiveFilterDensityPer1000;
    }
    if (profile.maxTherapySpeakDensityPer1000 !== undefined) {
      merged.maxTherapySpeakDensityPer1000 = profile.maxTherapySpeakDensityPer1000;
    }
    if (profile.maxTherapySpeakRun !== undefined) {
      merged.maxTherapySpeakRun = profile.maxTherapySpeakRun;
    }
    if (profile.maxBackstoryExpositionDensityPer1000 !== undefined) {
      merged.maxBackstoryExpositionDensityPer1000 =
        profile.maxBackstoryExpositionDensityPer1000;
    }
    if (profile.maxBackstoryExpositionRun !== undefined) {
      merged.maxBackstoryExpositionRun = profile.maxBackstoryExpositionRun;
    }
    if (profile.maxRelationshipMontageSummaryDensityPer1000 !== undefined) {
      merged.maxRelationshipMontageSummaryDensityPer1000 =
        profile.maxRelationshipMontageSummaryDensityPer1000;
    }
    if (profile.maxRelationshipMontageSummaryRun !== undefined) {
      merged.maxRelationshipMontageSummaryRun =
        profile.maxRelationshipMontageSummaryRun;
    }
    if (profile.maxTimeSkipSummaryDensityPer1000 !== undefined) {
      merged.maxTimeSkipSummaryDensityPer1000 =
        profile.maxTimeSkipSummaryDensityPer1000;
    }
    if (profile.maxTimeSkipSummaryRun !== undefined) {
      merged.maxTimeSkipSummaryRun = profile.maxTimeSkipSummaryRun;
    }
    if (profile.maxContrastiveReframeDensityPer1000 !== undefined) {
      merged.maxContrastiveReframeDensityPer1000 =
        profile.maxContrastiveReframeDensityPer1000;
    }
    if (profile.maxContrastiveReframeRun !== undefined) {
      merged.maxContrastiveReframeRun = profile.maxContrastiveReframeRun;
    }
    if (profile.maxNominalizedExplanationDensityPer1000 !== undefined) {
      merged.maxNominalizedExplanationDensityPer1000 =
        profile.maxNominalizedExplanationDensityPer1000;
    }
    if (profile.maxTranslationeseFormulaDensityPer1000 !== undefined) {
      merged.maxTranslationeseFormulaDensityPer1000 = profile.maxTranslationeseFormulaDensityPer1000;
    }
    if (profile.maxConnectiveStarterDensityPer1000 !== undefined) {
      merged.maxConnectiveStarterDensityPer1000 = profile.maxConnectiveStarterDensityPer1000;
    }
    if (profile.maxFillerAdverbDensityPer1000 !== undefined) {
      merged.maxFillerAdverbDensityPer1000 = profile.maxFillerAdverbDensityPer1000;
    }
    if (profile.maxFillerAdverbRun !== undefined) {
      merged.maxFillerAdverbRun = profile.maxFillerAdverbRun;
    }
    if (profile.maxSimultaneousActionDensityPer1000 !== undefined) {
      merged.maxSimultaneousActionDensityPer1000 =
        profile.maxSimultaneousActionDensityPer1000;
    }
    if (profile.maxSimultaneousActionRun !== undefined) {
      merged.maxSimultaneousActionRun = profile.maxSimultaneousActionRun;
    }
    if (profile.maxStatusQuoActionDensityPer1000 !== undefined) {
      merged.maxStatusQuoActionDensityPer1000 = profile.maxStatusQuoActionDensityPer1000;
    }
    if (profile.maxStatusQuoActionRun !== undefined) {
      merged.maxStatusQuoActionRun = profile.maxStatusQuoActionRun;
    }
    if (profile.minCausalTurnDensityPer1000 !== undefined) {
      merged.minCausalTurnDensityPer1000 = profile.minCausalTurnDensityPer1000;
    }
    if (profile.maxCommaDensityPer1000 !== undefined) {
      merged.maxCommaDensityPer1000 = profile.maxCommaDensityPer1000;
    }
    if (profile.maxReportingTailDensityPer1000 !== undefined) {
      merged.maxReportingTailDensityPer1000 = profile.maxReportingTailDensityPer1000;
    }
    if (profile.maxStaticDescriptionDensityPer1000 !== undefined) {
      merged.maxStaticDescriptionDensityPer1000 = profile.maxStaticDescriptionDensityPer1000;
    }
    if (profile.maxGenericTeaserDensityPer1000 !== undefined) {
      merged.maxGenericTeaserDensityPer1000 = profile.maxGenericTeaserDensityPer1000;
    }
    if (profile.maxThinCliffhangerEndingCount !== undefined) {
      merged.maxThinCliffhangerEndingCount = profile.maxThinCliffhangerEndingCount;
    }
    if (profile.maxPovMindJumpDensityPer1000 !== undefined) {
      merged.maxPovMindJumpDensityPer1000 = profile.maxPovMindJumpDensityPer1000;
    }
    if (profile.maxPovMindJumpRun !== undefined) {
      merged.maxPovMindJumpRun = profile.maxPovMindJumpRun;
    }
    if (profile.maxExpositoryDialogueRatio !== undefined) {
      merged.maxExpositoryDialogueRatio = profile.maxExpositoryDialogueRatio;
    }
    if (profile.maxDialogueTurnLength !== undefined) {
      merged.maxDialogueTurnLength = profile.maxDialogueTurnLength;
    }
    if (profile.maxAverageDialogueTurnLength !== undefined) {
      merged.maxAverageDialogueTurnLength = profile.maxAverageDialogueTurnLength;
    }
    if (profile.maxDialogueGroundingGapRun !== undefined) {
      merged.maxDialogueGroundingGapRun = profile.maxDialogueGroundingGapRun;
    }
    if (profile.maxDialogueQuestionRatio !== undefined) {
      merged.maxDialogueQuestionRatio = profile.maxDialogueQuestionRatio;
    }
    if (profile.maxDialogueQuestionRun !== undefined) {
      merged.maxDialogueQuestionRun = profile.maxDialogueQuestionRun;
    }
    if (profile.maxDialogueVocativeRatio !== undefined) {
      merged.maxDialogueVocativeRatio = profile.maxDialogueVocativeRatio;
    }
    if (profile.maxDialogueVocativeRun !== undefined) {
      merged.maxDialogueVocativeRun = profile.maxDialogueVocativeRun;
    }
    if (profile.maxDialogueLexicalEchoRatio !== undefined) {
      merged.maxDialogueLexicalEchoRatio = profile.maxDialogueLexicalEchoRatio;
    }
    if (profile.maxDialogueLexicalEchoRun !== undefined) {
      merged.maxDialogueLexicalEchoRun = profile.maxDialogueLexicalEchoRun;
    }
    if (profile.maxDialogueParaphraseConfirmationRatio !== undefined) {
      merged.maxDialogueParaphraseConfirmationRatio =
        profile.maxDialogueParaphraseConfirmationRatio;
    }
    if (profile.maxDialogueParaphraseConfirmationRun !== undefined) {
      merged.maxDialogueParaphraseConfirmationRun =
        profile.maxDialogueParaphraseConfirmationRun;
    }
    if (profile.maxRoteDialogueReplyRatio !== undefined) {
      merged.maxRoteDialogueReplyRatio = profile.maxRoteDialogueReplyRatio;
    }
    if (profile.maxRoteDialogueReplyRun !== undefined) {
      merged.maxRoteDialogueReplyRun = profile.maxRoteDialogueReplyRun;
    }
    if (profile.maxNeutralDialogueTagRatio !== undefined) {
      merged.maxNeutralDialogueTagRatio = profile.maxNeutralDialogueTagRatio;
    }
    if (profile.maxNeutralDialogueTagRun !== undefined) {
      merged.maxNeutralDialogueTagRun = profile.maxNeutralDialogueTagRun;
    }
    if (profile.maxSilenceStallDensityPer1000 !== undefined) {
      merged.maxSilenceStallDensityPer1000 = profile.maxSilenceStallDensityPer1000;
    }
    if (profile.maxSilenceStallRun !== undefined) {
      merged.maxSilenceStallRun = profile.maxSilenceStallRun;
    }
    if (profile.maxMelodramaticCaptionDensityPer1000 !== undefined) {
      merged.maxMelodramaticCaptionDensityPer1000 =
        profile.maxMelodramaticCaptionDensityPer1000;
    }
    if (profile.maxMelodramaticCaptionRun !== undefined) {
      merged.maxMelodramaticCaptionRun = profile.maxMelodramaticCaptionRun;
    }
    if (profile.maxStockReactionBeatDensityPer1000 !== undefined) {
      merged.maxStockReactionBeatDensityPer1000 = profile.maxStockReactionBeatDensityPer1000;
    }
    if (profile.maxStockReactionBeatRun !== undefined) {
      merged.maxStockReactionBeatRun = profile.maxStockReactionBeatRun;
    }
    if (profile.maxFacialExpressionBeatDensityPer1000 !== undefined) {
      merged.maxFacialExpressionBeatDensityPer1000 =
        profile.maxFacialExpressionBeatDensityPer1000;
    }
    if (profile.maxFacialExpressionBeatRun !== undefined) {
      merged.maxFacialExpressionBeatRun = profile.maxFacialExpressionBeatRun;
    }
    if (profile.maxPropFidgetBeatDensityPer1000 !== undefined) {
      merged.maxPropFidgetBeatDensityPer1000 =
        profile.maxPropFidgetBeatDensityPer1000;
    }
    if (profile.maxPropFidgetBeatRun !== undefined) {
      merged.maxPropFidgetBeatRun = profile.maxPropFidgetBeatRun;
    }
    if (profile.maxLoreTermDensityPer1000 !== undefined) {
      merged.maxLoreTermDensityPer1000 = profile.maxLoreTermDensityPer1000;
    }
    if (profile.maxLoreTermRun !== undefined) {
      merged.maxLoreTermRun = profile.maxLoreTermRun;
    }
    if (profile.maxSystemStatBlockDensityPer1000 !== undefined) {
      merged.maxSystemStatBlockDensityPer1000 =
        profile.maxSystemStatBlockDensityPer1000;
    }
    if (profile.maxSystemStatBlockRun !== undefined) {
      merged.maxSystemStatBlockRun = profile.maxSystemStatBlockRun;
    }
    if (profile.maxDeclaredResolveDensityPer1000 !== undefined) {
      merged.maxDeclaredResolveDensityPer1000 =
        profile.maxDeclaredResolveDensityPer1000;
    }
    if (profile.maxDeclaredResolveRun !== undefined) {
      merged.maxDeclaredResolveRun = profile.maxDeclaredResolveRun;
    }
    if (profile.maxRevelationSummaryDensityPer1000 !== undefined) {
      merged.maxRevelationSummaryDensityPer1000 =
        profile.maxRevelationSummaryDensityPer1000;
    }
    if (profile.maxRevelationSummaryRun !== undefined) {
      merged.maxRevelationSummaryRun = profile.maxRevelationSummaryRun;
    }
    if (profile.maxProceduralChecklistDensityPer1000 !== undefined) {
      merged.maxProceduralChecklistDensityPer1000 =
        profile.maxProceduralChecklistDensityPer1000;
    }
    if (profile.maxProceduralChecklistRun !== undefined) {
      merged.maxProceduralChecklistRun = profile.maxProceduralChecklistRun;
    }
    if (profile.maxActionChoreographyDensityPer1000 !== undefined) {
      merged.maxActionChoreographyDensityPer1000 =
        profile.maxActionChoreographyDensityPer1000;
    }
    if (profile.maxActionChoreographyRun !== undefined) {
      merged.maxActionChoreographyRun = profile.maxActionChoreographyRun;
    }
    if (profile.maxVagueAtmosphereModifierDensityPer1000 !== undefined) {
      merged.maxVagueAtmosphereModifierDensityPer1000 =
        profile.maxVagueAtmosphereModifierDensityPer1000;
    }
    if (profile.maxVagueAtmosphereModifierRun !== undefined) {
      merged.maxVagueAtmosphereModifierRun = profile.maxVagueAtmosphereModifierRun;
    }
    if (profile.maxEvaluativeModifierDensityPer1000 !== undefined) {
      merged.maxEvaluativeModifierDensityPer1000 =
        profile.maxEvaluativeModifierDensityPer1000;
    }
    if (profile.maxEvaluativeModifierRun !== undefined) {
      merged.maxEvaluativeModifierRun = profile.maxEvaluativeModifierRun;
    }
    if (profile.maxRhetoricalQuestionDensityPer1000 !== undefined) {
      merged.maxRhetoricalQuestionDensityPer1000 =
        profile.maxRhetoricalQuestionDensityPer1000;
    }
    if (profile.maxRhetoricalQuestionRun !== undefined) {
      merged.maxRhetoricalQuestionRun = profile.maxRhetoricalQuestionRun;
    }
    if (profile.maxSubtextExplanationDensityPer1000 !== undefined) {
      merged.maxSubtextExplanationDensityPer1000 =
        profile.maxSubtextExplanationDensityPer1000;
    }
    if (profile.maxSubtextExplanationRun !== undefined) {
      merged.maxSubtextExplanationRun = profile.maxSubtextExplanationRun;
    }
    if (profile.maxAmbiguousReferenceDensityPer1000 !== undefined) {
      merged.maxAmbiguousReferenceDensityPer1000 =
        profile.maxAmbiguousReferenceDensityPer1000;
    }
    if (profile.maxAmbiguousReferenceRun !== undefined) {
      merged.maxAmbiguousReferenceRun = profile.maxAmbiguousReferenceRun;
    }
    if (profile.maxSceneTransitionGroundingGapDensityPer1000 !== undefined) {
      merged.maxSceneTransitionGroundingGapDensityPer1000 =
        profile.maxSceneTransitionGroundingGapDensityPer1000;
    }
    if (profile.maxSceneTransitionGroundingGapRun !== undefined) {
      merged.maxSceneTransitionGroundingGapRun = profile.maxSceneTransitionGroundingGapRun;
    }
    if (profile.maxTopicMarkerStarterDensityPer1000 !== undefined) {
      merged.maxTopicMarkerStarterDensityPer1000 =
        profile.maxTopicMarkerStarterDensityPer1000;
    }
    if (profile.maxTopicMarkerStarterRun !== undefined) {
      merged.maxTopicMarkerStarterRun = profile.maxTopicMarkerStarterRun;
    }
    if (profile.minSentenceLengthVariationCoefficient !== undefined) {
      merged.minSentenceLengthVariationCoefficient =
        profile.minSentenceLengthVariationCoefficient;
    }
    if (profile.maxUniformSentenceLengthRun !== undefined) {
      merged.maxUniformSentenceLengthRun = profile.maxUniformSentenceLengthRun;
    }
    if (profile.maxUniformParagraphBeatRun !== undefined) {
      merged.maxUniformParagraphBeatRun = profile.maxUniformParagraphBeatRun;
    }
    if (profile.maxSameEndingRun !== undefined) {
      merged.maxSameEndingRun = profile.maxSameEndingRun;
    }
    if (profile.maxDominantSentenceEndingShare !== undefined) {
      merged.maxDominantSentenceEndingShare = profile.maxDominantSentenceEndingShare;
    }
    if (profile.maxDominantDialogueEndingShare !== undefined) {
      merged.maxDominantDialogueEndingShare = profile.maxDominantDialogueEndingShare;
    }
    if (profile.maxDominantDialogueStarterShare !== undefined) {
      merged.maxDominantDialogueStarterShare = profile.maxDominantDialogueStarterShare;
    }
    if (profile.minViewpointAnchorDensityPer1000 !== undefined) {
      merged.minViewpointAnchorDensityPer1000 = profile.minViewpointAnchorDensityPer1000;
    }
    if (profile.minImmersiveRhythmAnchorDensityPer1000 !== undefined) {
      merged.minImmersiveRhythmAnchorDensityPer1000 =
        profile.minImmersiveRhythmAnchorDensityPer1000;
    }
    if (profile.maxImmersiveRhythmFlatlineRun !== undefined) {
      merged.maxImmersiveRhythmFlatlineRun = profile.maxImmersiveRhythmFlatlineRun;
    }
    if (profile.maxShortSentenceRun !== undefined) {
      merged.maxShortSentenceRun = profile.maxShortSentenceRun;
    }
    if (profile.maxRepeatedSubjectRun !== undefined) {
      merged.maxRepeatedSubjectRun = profile.maxRepeatedSubjectRun;
    }
    if (profile.maxRepeatedConnectiveStarterRun !== undefined) {
      merged.maxRepeatedConnectiveStarterRun = profile.maxRepeatedConnectiveStarterRun;
    }
    dislikedPhrases.push(...(profile.dislikedPhrases ?? []));
  }

  const uniqueDisliked = uniqueStrings(dislikedPhrases);
  if (uniqueDisliked.length > 0) {
    merged.dislikedPhrases = uniqueDisliked;
    hasProfile = true;
  }

  return hasProfile ? merged : undefined;
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

async function readOptionalText(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
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

function pushNumber(values: number[], value: number | undefined): void {
  if (typeof value === 'number' && Number.isFinite(value)) {
    values.push(value);
  }
}

function maxNumber(values: number[]): number | undefined {
  return values.length > 0 ? Math.max(...values) : undefined;
}

function minNumber(values: number[]): number | undefined {
  return values.length > 0 ? Math.min(...values) : undefined;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map(value => value.trim()).filter(Boolean)));
}
