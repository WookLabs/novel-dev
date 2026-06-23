#!/usr/bin/env node

/**
 * Evaluate engagement, compute the unified chapter gate, and persist Ralph state.
 */

import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { recordEngagementFromProject } from './engagement-project.js';
import {
  evaluateChapterGate,
  type ChapterGateDecision,
  type ProseCraftGateResult,
  type QualityScore,
  type ReaderResponseGateResult,
} from '../retry/quality-gate.js';
import { analyzeChapter } from '../pipeline/quality-oracle.js';
import {
  evaluateProseTaste,
  type ProseTasteGateResult,
  type ProseTasteMode,
  type ProseTasteProfile,
} from '../quality/prose-taste-gate.js';
import {
  applyChapterGateState,
  loadRalphGateState,
  type RalphGateState,
} from '../state/ralph-gate.js';
import { assertValidRalphState } from '../state/ralph-state-validation.js';
import {
  buildSourceEvidenceManifest,
  compareSourceEvidence,
  extractSourceEvidenceManifest,
  type SourceEvidenceComparison,
} from './source-evidence.js';

interface CliArgs {
  projectDir: string;
  projectId?: string;
  chapterNumber: number;
  version: number;
  qualityScore: number;
  threshold?: number;
  attemptNumber?: number;
  maxRetries: number;
  json: boolean;
}

interface ApplyChapterGateCliResult {
  projectId: string;
  chapterNumber: number;
  version: number;
  engagement: Awaited<ReturnType<typeof recordEngagementFromProject>>;
  proseCraft: ProseCraftGateResult;
  readerResponse?: ReaderResponseGateResult;
  gate: ChapterGateDecision;
  state: {
    currentChapter?: number;
    completedChapters: number[];
    failedChapters: number[];
    retryCount: number;
    ralphActive?: boolean;
    requiresUserIntervention: boolean;
  };
}

interface ReportSourceEvidenceConfig {
  label: string;
  failureType: string;
  sourceRelativePaths: string[];
  primarySourceRelativePaths?: string[];
  allowMissingSourceEvidence?: boolean;
  checkSourceModifiedAfterReport?: boolean;
}

interface ReportFreshnessGateIssue {
  label: string;
  failureType: string;
  reportPath: string;
  reportRelativePath: string;
  sourcePaths: string[];
  status: SourceEvidenceComparison['status'] | 'newer-source';
  changedPaths: string[];
  currentDigest?: string;
  recordedDigest?: string;
  reportModifiedAt?: string;
  newestSourceModifiedAt?: string;
  newestSourcePath?: string;
}

interface StyleGuideWithTasteProfile {
  prose_taste_profile?: {
    preferred_mode?: ProseTasteMode;
    disliked_phrases?: string[];
    minimum_score?: number;
    max_sensory_density_per_1000?: number;
    max_embodied_reaction_density_per_1000?: number;
    max_body_reaction_subject_density_per_1000?: number;
    max_body_reaction_subject_run?: number;
    max_cliche_emotion_image_density_per_1000?: number;
    max_cliche_emotion_image_run?: number;
    max_symbolic_abstraction_density_per_1000?: number;
    max_symbolic_abstraction_run?: number;
    max_metaphor_density_per_1000?: number;
    max_sensory_wallpaper_run?: number;
    max_emotion_label_density_per_1000?: number;
    max_emotion_label_run?: number;
    max_hedged_perception_density_per_1000?: number;
    max_abstract_noun_density_per_1000?: number;
    max_cognitive_filter_density_per_1000?: number;
    max_therapy_speak_density_per_1000?: number;
    max_therapy_speak_run?: number;
    max_backstory_exposition_density_per_1000?: number;
    max_backstory_exposition_run?: number;
    max_relationship_montage_summary_density_per_1000?: number;
    max_relationship_montage_summary_run?: number;
    max_time_skip_summary_density_per_1000?: number;
    max_time_skip_summary_run?: number;
    max_contrastive_reframe_density_per_1000?: number;
    max_contrastive_reframe_run?: number;
    max_lore_term_density_per_1000?: number;
    max_lore_term_run?: number;
    max_system_stat_block_density_per_1000?: number;
    max_system_stat_block_run?: number;
    max_declared_resolve_density_per_1000?: number;
    max_declared_resolve_run?: number;
    max_revelation_summary_density_per_1000?: number;
    max_revelation_summary_run?: number;
    max_procedural_checklist_density_per_1000?: number;
    max_procedural_checklist_run?: number;
    max_action_choreography_density_per_1000?: number;
    max_action_choreography_run?: number;
    max_nominalized_explanation_density_per_1000?: number;
    max_translationese_formula_density_per_1000?: number;
    max_connective_starter_density_per_1000?: number;
    max_filler_adverb_density_per_1000?: number;
    max_filler_adverb_run?: number;
    max_simultaneous_action_density_per_1000?: number;
    max_simultaneous_action_run?: number;
    max_status_quo_action_density_per_1000?: number;
    max_status_quo_action_run?: number;
    max_gaze_choreography_density_per_1000?: number;
    max_gaze_choreography_run?: number;
    min_causal_turn_density_per_1000?: number;
    max_comma_density_per_1000?: number;
    max_reporting_tail_density_per_1000?: number;
    max_emphasis_punctuation_density_per_1000?: number;
    max_emphasis_punctuation_run?: number;
    max_static_description_density_per_1000?: number;
    max_generic_teaser_density_per_1000?: number;
    max_thin_cliffhanger_ending_count?: number;
    max_pov_mind_jump_density_per_1000?: number;
    max_pov_mind_jump_run?: number;
    max_expository_dialogue_ratio?: number;
    max_dialogue_turn_length?: number;
    max_average_dialogue_turn_length?: number;
    max_dialogue_grounding_gap_run?: number;
    max_dialogue_question_ratio?: number;
    max_dialogue_question_run?: number;
    max_dialogue_vocative_ratio?: number;
    max_dialogue_vocative_run?: number;
    max_dialogue_lexical_echo_ratio?: number;
    max_dialogue_lexical_echo_run?: number;
    max_dialogue_paraphrase_confirmation_ratio?: number;
    max_dialogue_paraphrase_confirmation_run?: number;
    max_rote_dialogue_reply_ratio?: number;
    max_rote_dialogue_reply_run?: number;
    max_neutral_dialogue_tag_ratio?: number;
    max_neutral_dialogue_tag_run?: number;
    max_silence_stall_density_per_1000?: number;
    max_silence_stall_run?: number;
    max_melodramatic_caption_density_per_1000?: number;
    max_melodramatic_caption_run?: number;
    max_stock_reaction_beat_density_per_1000?: number;
    max_stock_reaction_beat_run?: number;
    max_prop_fidget_beat_density_per_1000?: number;
    max_prop_fidget_beat_run?: number;
    max_facial_expression_beat_density_per_1000?: number;
    max_facial_expression_beat_run?: number;
    max_vague_atmosphere_modifier_density_per_1000?: number;
    max_vague_atmosphere_modifier_run?: number;
    max_evaluative_modifier_density_per_1000?: number;
    max_evaluative_modifier_run?: number;
    max_rhetorical_question_density_per_1000?: number;
    max_rhetorical_question_run?: number;
    max_subtext_explanation_density_per_1000?: number;
    max_subtext_explanation_run?: number;
    max_ambiguous_reference_density_per_1000?: number;
    max_ambiguous_reference_run?: number;
    max_scene_transition_grounding_gap_density_per_1000?: number;
    max_scene_transition_grounding_gap_run?: number;
    max_topic_marker_starter_density_per_1000?: number;
    max_topic_marker_starter_run?: number;
    min_sentence_length_variation_coefficient?: number;
    max_uniform_sentence_length_run?: number;
    max_uniform_paragraph_beat_run?: number;
    max_same_ending_run?: number;
    max_dominant_sentence_ending_share?: number;
    max_dominant_dialogue_ending_share?: number;
    max_dominant_dialogue_starter_share?: number;
    min_viewpoint_anchor_density_per_1000?: number;
    min_immersive_rhythm_anchor_density_per_1000?: number;
    max_immersive_rhythm_flatline_run?: number;
    max_short_sentence_run?: number;
    max_repeated_subject_run?: number;
    max_repeated_connective_starter_run?: number;
  };
}

const USAGE = `Usage:
  node dist/cli/apply-chapter-gate.js --project <PATH> --chapter <N> --quality-score <N> [--threshold <N>] [--version <N>] [--project-id <ID>] [--attempt <N>] [--max-retries <N>] [--json]

Runs the executable chapter gate: engagement evaluation -> unified gate -> meta/ralph-state.json update.`;

const PROSE_TASTE_REPORT_EVIDENCE: ReportSourceEvidenceConfig = {
  label: 'prose taste benchmark',
  failureType: 'prose-taste',
  sourceRelativePaths: [
    path.join('reviews', 'prose-taste-benchmark'),
    path.join('meta', 'style-guide.json'),
    path.join('chapters'),
  ],
  primarySourceRelativePaths: [path.join('reviews', 'prose-taste-benchmark')],
};

const READER_RESPONSE_REPORT_EVIDENCE: ReportSourceEvidenceConfig = {
  label: 'reader response calibration',
  failureType: 'reader-response',
  sourceRelativePaths: [
    path.join('reviews', 'reader-response'),
    path.join('meta', 'quality-trend.json'),
  ],
  primarySourceRelativePaths: [path.join('reviews', 'reader-response')],
};

const ENGAGEMENT_BENCHMARK_REPORT_EVIDENCE: ReportSourceEvidenceConfig = {
  label: 'engagement benchmark',
  failureType: 'engagement-benchmark',
  sourceRelativePaths: [
    path.join('reviews', 'engagement-benchmark'),
    path.join('meta', 'design-strategy.json'),
    path.join('plot'),
    path.join('chapters'),
    path.join('characters'),
  ],
  primarySourceRelativePaths: [path.join('reviews', 'engagement-benchmark')],
};

const CHARACTER_RELATIONSHIP_REPORT_EVIDENCE: ReportSourceEvidenceConfig = {
  label: 'character relationship benchmark',
  failureType: 'character-relationship',
  sourceRelativePaths: [path.join('reviews', 'character-relationship-benchmark')],
};

const SERIES_RETENTION_REPORT_EVIDENCE: ReportSourceEvidenceConfig = {
  label: 'series retention benchmark',
  failureType: 'series-retention',
  sourceRelativePaths: [path.join('reviews', 'series-retention-benchmark')],
};

const CONSISTENCY_REPORT_EVIDENCE: ReportSourceEvidenceConfig = {
  label: 'long-form consistency',
  failureType: 'consistency-report',
  sourceRelativePaths: [
    path.join('chapters'),
    path.join('world'),
    path.join('characters'),
    path.join('plot'),
    path.join('context', 'summaries'),
  ],
  allowMissingSourceEvidence: true,
  checkSourceModifiedAfterReport: true,
};

export async function applyChapterGateFromProject(
  args: CliArgs
): Promise<ApplyChapterGateCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const statePath = path.join(projectDir, 'meta', 'ralph-state.json');
  const beforeState = await loadRalphGateState(projectDir);
  if (!beforeState) {
    throw new Error(`Ralph state file not found: ${statePath}`);
  }
  assertValidRalphState(beforeState, statePath);
  assertChapterGateSequence(args.chapterNumber, beforeState);
  assertAttemptMatchesState(args.attemptNumber, beforeState);
  const attemptNumber = args.attemptNumber ?? inferAttemptNumber(beforeState);
  const trendPath = path.join(projectDir, 'meta', 'quality-trend.json');
  const trendSnapshot = await snapshotFile(trendPath);

  let engagement: Awaited<ReturnType<typeof recordEngagementFromProject>>;
  let proseCraft: ProseCraftGateResult;
  let readerResponse: ReaderResponseGateResult | undefined;
  let gate: ChapterGateDecision;
  let updatedState: RalphGateState;

  try {
    engagement = await recordEngagementFromProject({
      projectDir,
      projectId: args.projectId,
      chapterNumber: args.chapterNumber,
      version: args.version,
    });
    proseCraft = mergeProseCraftGates(
      await evaluateProseCraftFromProject(projectDir, args.chapterNumber),
      await evaluateProseTasteBenchmarkGateFromProject(projectDir, args.chapterNumber)
    );
    readerResponse = mergeReaderResponseGates(
      await evaluateEngagementBenchmarkGateFromProject(projectDir, args.chapterNumber),
      await evaluateReaderResponseGateFromProject(projectDir, args.chapterNumber),
      await evaluateCharacterRelationshipGateFromProject(projectDir, args.chapterNumber),
      await evaluateSeriesRetentionGateFromProject(projectDir, args.chapterNumber),
      await evaluateConsistencyReportGateFromProject(projectDir, args.chapterNumber)
    );

    gate = evaluateChapterGate({
      chapterNumber: args.chapterNumber,
      attemptNumber,
      maxRetries: args.maxRetries,
      threshold: args.threshold ?? defaultThreshold(),
      lastScore: makeQualityScore(args.qualityScore),
      engagement: {
        passed: engagement.passed,
        score: engagement.score,
        alertLevel: engagement.alertLevel as 'none' | 'warning' | 'critical',
        regressionDetected: engagement.regressionDetected,
        issues: engagement.issues as Array<{ code?: string; severity?: string; message: string }>,
        revisionDirectives: engagement.revisionDirectives as Array<{
          code?: string;
          priority?: string;
          target?: string;
          action: string;
          expected?: string;
          actual?: string;
        }>,
        recurringEngagementDirectives: engagement.recurringEngagementDirectives as Array<{
          code?: string;
          priority?: string;
          target?: string;
          action: string;
          expected?: string;
          actual?: string;
          count: number;
          firstChapter: number;
          latestChapter: number;
        }>,
      },
      proseCraft,
      readerResponse,
      requireEngagement: true,
      requireProseCraft: true,
    });

    updatedState = await applyChapterGateState({
      projectDir,
      chapterNumber: args.chapterNumber,
      decision: gate,
    });
  } catch (error) {
    await restoreFileSnapshot(trendPath, trendSnapshot);
    throw error;
  }

  return {
    projectId: engagement.projectId,
    chapterNumber: args.chapterNumber,
    version: args.version,
    engagement,
    proseCraft,
    readerResponse,
    gate,
    state: {
      currentChapter: updatedState.current_chapter,
      completedChapters: updatedState.completed_chapters ?? [],
      failedChapters: updatedState.failed_chapters ?? [],
      retryCount: updatedState.retry_count ?? 0,
      ralphActive: updatedState.ralph_active,
      requiresUserIntervention: updatedState.requires_user_intervention === true,
    },
  };
}

interface ReaderResponseCalibrationReport {
  calibration?: {
    calibrationScore?: number;
    sampleResults?: ReaderResponseCalibrationSampleResult[];
  };
}

interface ReaderResponseCalibrationSampleResult {
  id: string;
  label?: string;
  chapter?: number;
  readerCompositeScore: number;
  failureType?: string;
  respondentCount: number;
  reliability: string;
  humanReaderEvidence?: string;
  humanReaderEvidenceIssues?: string[];
  responseDataQuality?: string;
  responseDataQualityIssues?: string[];
  evidenceQuality?: string;
  actionabilityScore?: number;
  evidenceIssues?: string[];
  panelConsensus?: string;
  panelConsensusIssues?: string[];
  readerScoreMarginOfError?: number;
  readerScoreConfidence?: string;
  readerScoreConfidenceIssues?: string[];
  cohortRepresentativeness?: string;
  cohortRepresentativenessIssues?: string[];
  panelProtocolQuality?: string;
  panelProtocolQualityIssues?: string[];
  durableEngagementEvidence?: string;
  durableEngagementEvidenceIssues?: string[];
  continuationBehaviorEvidence?: string;
  continuationBehaviorEvidenceIssues?: string[];
  nextChapterCtaImpressionCount?: number;
  nextChapterClickCount?: number;
  nextChapterOpenCount?: number;
  nextChapterReadStartCount?: number;
  nextChapterClickThroughRatio?: number;
  nextChapterOpenRatio?: number;
  nextChapterReadStartRatio?: number;
  resonanceEvidence?: string;
  resonanceEvidenceIssues?: string[];
  delayedMemoryEvidence?: string;
  delayedMemoryEvidenceIssues?: string[];
  annotationReliability?: string;
  annotationReliabilityIssues?: string[];
  revisionOutcomeEvidence?: string;
  revisionOutcomeIssues?: string[];
  revisionPairId?: string;
  revisionBaselineReaderScore?: number;
  revisionCurrentReaderScore?: number;
  revisionLift?: number;
  revisionPreferenceWinRate?: number;
  revisionPreferenceRespondentCount?: number;
  revisionGuardrailRegressionCount?: number;
  dropOffLocalizationEvidence?: string;
  dropOffLocalizationEvidenceIssues?: string[];
  dropOffAnnotations?: ReaderResponseGateDropOffAnnotation[];
  frictionAnnotations?: ReaderResponseGateFrictionAnnotation[];
  frictionAnnotationCoverage?: string;
  frictionAnnotationCoverageIssues?: string[];
  frictionAnnotationRepresentativeness?: string;
  frictionAnnotationRepresentativenessIssues?: string[];
  dimensionIssues?: Array<{
    dimension: string;
    score: number;
    threshold: number;
    message: string;
  }>;
}

interface ReaderResponseGateDropOffAnnotation {
  location?: string;
  eventType?: string;
  lastCompletedLocation?: string;
  triggerQuote?: string;
  reason: string;
  readerCount?: number;
  readerSegment?: string;
  suggestedRevision?: string;
}

interface ReaderResponseGateFrictionAnnotation {
  location?: string;
  quote?: string;
  dimension?: string;
  reason: string;
  severity?: string;
  rewriteSuggestion?: string;
  readerCount?: number;
  readerSegment?: string;
}

interface EngagementBenchmarkReport {
  benchmark?: EngagementBenchmarkGatePayload;
}

interface EngagementBenchmarkGatePayload {
  readyForGateTuning?: boolean;
  falsePositiveCount?: number;
  falseNegativeCount?: number;
  missingIssueCount?: number;
  forbiddenIssueCount?: number;
  positiveQualityConflictCount?: number;
  scoreOutOfRangeCount?: number;
  recommendations?: string[];
  sampleResults?: EngagementBenchmarkGateSampleResult[];
}

interface EngagementBenchmarkGateSampleResult {
  id?: string;
  label?: string;
  chapter?: number;
  version?: number;
  manuscriptSource?: 'inline' | 'manuscript_path' | 'chapter';
  manuscriptPath?: string;
  chapterSourceGrounded?: boolean;
  expectedPassed?: boolean;
  actualPassed?: boolean;
  score?: number;
  passed?: boolean;
  failureType?: string;
  failureTypes?: string[];
  issueCodes?: string[];
  expectedIssueCodes?: string[];
  missingExpectedIssueCodes?: string[];
  forbiddenIssueCodesSeen?: string[];
  positiveQualityConflictIssueCodes?: string[];
  positiveQualityCodes?: string[];
  scoreExpectationPassed?: boolean;
}

interface CharacterRelationshipBenchmarkReport {
  benchmark?: {
    sampleResults?: CharacterRelationshipGateSampleResult[];
  };
}

interface CharacterRelationshipGateSampleResult {
  id: string;
  label?: string;
  chapter?: number;
  relationshipType?: string;
  focus?: CharacterRelationshipGateFocus;
  automatedScore?: number;
  automatedPassed?: boolean;
  expectedInvesting?: boolean;
  readerInvestmentScore: number;
  readerPassed?: boolean;
  wouldContinueScore?: number;
  responseCount?: number;
  commentedResponseCount?: number;
  evidenceSufficient?: boolean;
  weakDimensions?: string[];
  dimensionResults?: CharacterRelationshipGateDimensionResult[];
  failureTypes?: string[];
  failureType?: string;
  recommendations?: string[];
  readerEvidence?: CharacterRelationshipGateReaderEvidence[];
}

interface CharacterRelationshipGateFocus {
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

interface CharacterRelationshipGateDimensionResult {
  dimension: string;
  score: number;
  responseCount?: number;
  passed?: boolean;
}

interface CharacterRelationshipGateReaderEvidence {
  readerId?: string;
  comment?: string;
  carePoints?: string[];
  disbeliefPoints?: string[];
  rewriteSuggestion?: string;
}

interface SeriesRetentionBenchmarkReport {
  benchmark?: {
    sampleResults?: SeriesRetentionGateSampleResult[];
  };
}

interface SeriesRetentionGateSampleResult {
  id: string;
  label?: string;
  sequenceLength?: number;
  readerRetentionScore: number;
  firstChapterRetentionScore?: number;
  lastChapterRetentionScore?: number;
  retentionDrop?: number;
  funnelEvidence?: string;
  funnelDropChapterCount?: number;
  weakFunnelEvidenceChapterCount?: number;
  hookProgressEvidence?: string;
  hookStallChapterCount?: number;
  weakHookProgressEvidenceChapterCount?: number;
  minimumContinuationRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  minimumHookProgressRate?: number;
  maximumHookStallRatio?: number;
  readerPassed?: boolean;
  repeatedRewardSignatureRun?: number;
  repeatedEmotionalSignatureRun?: number;
  dominantEmotionalSignatureFamily?: string;
  dominantEmotionalSignatureFamilyShare?: number;
  responseCount?: number;
  commentedResponseCount?: number;
  evidenceSufficient?: boolean;
  weakDimensions?: string[];
  chapterResults?: SeriesRetentionGateChapterResult[];
  failureTypes?: string[];
  failureType?: string;
}

interface SeriesRetentionGateChapterResult {
  chapter: number;
  title?: string;
  rewardSignature?: string;
  emotionalSignature?: string;
  emotionalSignatureFamily?: string;
  readerRetentionScore: number;
  readerPassed?: boolean;
  funnelEvidence?: string;
  funnelPassed?: boolean;
  startedReadCount?: number;
  completedReadCount?: number;
  continuedReadCount?: number;
  dropOffCount?: number;
  skimmedReadCount?: number;
  completionRate?: number;
  continuationRate?: number;
  dropOffRatio?: number;
  skimmedReadRatio?: number;
  hookProgressEvidence?: string;
  hookProgressPassed?: boolean;
  hookOpenThreadCount?: number;
  hookAdvancedThreadCount?: number;
  hookResolvedThreadCount?: number;
  hookRecontextualizedThreadCount?: number;
  hookNewThreadCount?: number;
  hookStalledThreadCount?: number;
  hookProgressEventCount?: number;
  hookProgressRate?: number;
  hookStallRatio?: number;
  responseCount?: number;
  commentedResponseCount?: number;
  evidenceSufficient?: boolean;
  weakDimensions?: string[];
}

interface ProseTasteBenchmarkReport {
  benchmark?: ProseTasteBenchmarkGatePayload;
}

interface ProseTasteBenchmarkGatePayload {
  readyForStyleTuning?: boolean;
  falsePositiveCount?: number;
  falseNegativeCount?: number;
  missingIssueCount?: number;
  scoreOutOfRangeCount?: number;
  recommendations?: string[];
  sampleResults?: ProseTasteBenchmarkGateSampleResult[];
}

interface ProseTasteBenchmarkGateSampleResult {
  id?: string;
  label?: string;
  chapter?: number;
  version?: number;
  contentSource?: 'inline' | 'content_path' | 'chapter';
  contentPath?: string;
  chapterSourceGrounded?: boolean;
  expectedPassed?: boolean;
  actualPassed?: boolean;
  score?: number;
  passed?: boolean;
  styleTuningUsable?: boolean;
  failureType?: string;
  issueCodes?: string[];
  missingExpectedIssueCodes?: string[];
  scoreExpectationPassed?: boolean;
  styleFrictionAnnotationCoverage?: string;
  styleFrictionAnnotationIssues?: string[];
  styleFrictionAnnotations?: ProseTasteBenchmarkFrictionAnnotation[];
  gate?: {
    score?: number;
    issues?: ProseTasteBenchmarkGateIssue[];
  };
}

interface ProseTasteBenchmarkFrictionAnnotation {
  location?: string;
  reason?: string;
  issueCode?: string;
  severity?: string;
  readerSegment?: string;
  rewriteSuggestion?: string;
  targetText?: string;
}

interface ProseTasteBenchmarkGateIssue {
  code?: string;
  severity?: string;
  message?: string;
  suggestion?: string;
  paragraphNumber?: number;
  sentenceNumber?: number;
  lineNumber?: number;
  targetText?: string;
  evidence?: string;
}

type ConsistencyGateDomain = 'character' | 'timeline' | 'setting' | 'factual' | 'plot_logic';

interface ConsistencyReport {
  checked_at?: string;
  chapter_range?: {
    start?: number;
    end?: number;
  };
  chapters_analyzed?: number[];
  domain_coverage?: Partial<Record<ConsistencyGateDomain, boolean>>;
  total_issues?: number;
  issues?: ConsistencyReportIssue[];
}

interface ConsistencyReportIssue {
  id?: string;
  type?: string;
  severity?: string;
  description?: string;
  location?: {
    chapter?: number;
    scene?: number;
    context?: string;
  };
  references?: Array<{
    file?: string;
    field?: string;
    expected?: string;
    found?: string;
  }>;
  suggestion?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const parsed: Partial<CliArgs> = {
    version: 1,
    maxRetries: 3,
    json: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--project' && argv[i + 1]) {
      parsed.projectDir = argv[++i];
    } else if (arg === '--project-id' && argv[i + 1]) {
      parsed.projectId = argv[++i];
    } else if (arg === '--chapter' && argv[i + 1]) {
      parsed.chapterNumber = parsePositiveInteger(argv[++i], '--chapter');
    } else if (arg === '--version' && argv[i + 1]) {
      parsed.version = parsePositiveInteger(argv[++i], '--version');
    } else if (arg === '--quality-score' && argv[i + 1]) {
      parsed.qualityScore = parseScore(argv[++i], '--quality-score');
    } else if (arg === '--threshold' && argv[i + 1]) {
      parsed.threshold = parseThreshold(argv[++i], '--threshold');
    } else if (arg === '--attempt' && argv[i + 1]) {
      parsed.attemptNumber = parsePositiveInteger(argv[++i], '--attempt');
    } else if (arg === '--max-retries' && argv[i + 1]) {
      parsed.maxRetries = parseRetryLimit(argv[++i], '--max-retries');
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--help' || arg === '-h') {
      throw new UsageRequested();
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  if (!parsed.projectDir) {
    throw new Error('Missing required --project <PATH>');
  }
  if (!parsed.chapterNumber) {
    throw new Error('Missing required --chapter <N>');
  }
  if (typeof parsed.qualityScore !== 'number') {
    throw new Error('Missing required --quality-score <N>');
  }

  return parsed as CliArgs;
}

function parsePositiveInteger(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
}

function parseScore(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`${label} must be a number from 0 to 100`);
  }
  return parsed;
}

function parseThreshold(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 70 || parsed > 100) {
    throw new Error(`${label} must be an integer from 70 to 100`);
  }
  return parsed;
}

function parseRetryLimit(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 3) {
    throw new Error(`${label} must be an integer from 1 to 3`);
  }
  return parsed;
}

function inferAttemptNumber(state: RalphGateState | null): number {
  return (state?.retry_count ?? 0) + 1;
}

function assertAttemptMatchesState(
  attemptNumber: number | undefined,
  state: RalphGateState
): void {
  if (attemptNumber === undefined) return;

  const expectedAttempt = inferAttemptNumber(state);
  if (attemptNumber !== expectedAttempt) {
    throw new Error(
      `--attempt must match Ralph retry_count + 1 (expected ${expectedAttempt}, got ${attemptNumber})`
    );
  }
}

function defaultThreshold(): number {
  return 95;
}

function padChapterNumber(chapterNumber: number): string {
  return chapterNumber.toString().padStart(3, '0');
}

function assertChapterGateSequence(
  chapterNumber: number,
  state: RalphGateState | null
): void {
  if (!state) return;

  const currentChapter = state.current_chapter;
  if (
    typeof currentChapter === 'number'
    && Number.isInteger(currentChapter)
    && chapterNumber > currentChapter
  ) {
    throw new Error(
      `Cannot gate chapter ${chapterNumber} while current_chapter is ${currentChapter}. ` +
      'Complete earlier chapters before advancing the Ralph Loop gate.'
    );
  }

  const failedChapters = state.failed_chapters ?? [];
  const chapterIsOpenFailure = failedChapters.includes(chapterNumber);
  const chapterNeedsUserIntervention =
    state.requires_user_intervention === true &&
    state.last_gate?.chapter === chapterNumber;

  if (
    typeof currentChapter === 'number'
    && Number.isInteger(currentChapter)
    && chapterNumber < currentChapter
    && !chapterIsOpenFailure
    && !chapterNeedsUserIntervention
  ) {
    throw new Error(
      `Cannot gate chapter ${chapterNumber} because Ralph has already advanced to chapter ${currentChapter}. ` +
      'Use the revision workflow to reopen completed chapters.'
    );
  }

  const earlierFailedChapters = (state.failed_chapters ?? [])
    .filter(chapter => chapter < chapterNumber);
  if (earlierFailedChapters.length > 0) {
    throw new Error(
      `Cannot gate chapter ${chapterNumber} while earlier failed chapters remain open: ` +
      earlierFailedChapters.join(', ')
    );
  }
}

function makeQualityScore(score: number): QualityScore {
  return {
    total: score,
    breakdown: [
      {
        category: 'validator_consensus',
        score,
        feedback: 'External validator consensus score supplied to apply-chapter-gate CLI.',
      },
    ],
  };
}

async function evaluateProseCraftFromProject(
  projectDir: string,
  chapterNumber: number
): Promise<ProseCraftGateResult> {
  const manuscript = await readChapterManuscript(projectDir, chapterNumber);
  if (!manuscript) {
    return {
      passed: false,
      verdict: 'MISSING',
      score: 0,
      issues: [
        `원고 본문 파일 누락: chapters/chapter_${padChapterNumber(chapterNumber)}.md`,
      ],
      revisionDirectives: [],
    };
  }

  const sceneCount = await readChapterSceneCount(projectDir, chapterNumber);
  const result = analyzeChapter(manuscript, sceneCount);
  const proseTasteProfile = await readProseTasteProfile(projectDir);
  const proseTaste = proseTasteProfile
    ? evaluateProseTaste(manuscript, {
      profile: proseTasteProfile,
    })
    : undefined;
  const baseProseCraftScore = summarizeProseCraftScore(result.assessment);
  const score = proseTaste
    ? summarizeProseCraftScoreWithTaste(baseProseCraftScore, proseTaste)
    : baseProseCraftScore;
  const passed = result.verdict === 'PASS' && (proseTaste?.passed ?? true);

  return {
    passed,
    verdict: passed ? 'PASS' : 'REVISE',
    score,
    issues: summarizeProseCraftIssues(result, proseTaste),
    revisionDirectives: [
      ...result.directives.map(directive => ({
        type: directive.type,
        priority: directive.priority,
        issue: directive.issue,
        instruction: directive.instruction,
        currentText: directive.currentText,
      })),
      ...(proseTaste?.issues ?? [])
        .filter(issue => issue.severity !== 'low')
        .slice(0, 3)
        .map(issue => ({
          type: 'style-alignment',
          priority: proseTasteIssuePriority(issue.severity),
          issue: `문체 취향 게이트 실패${formatProseTasteIssueLocation(issue)}: ${issue.message}`,
          instruction: issue.suggestion,
          currentText: issue.targetText ?? issue.evidence,
        })),
    ],
  };
}

function mergeProseCraftGates(
  ...gates: Array<ProseCraftGateResult | undefined>
): ProseCraftGateResult {
  const present = gates.filter((gate): gate is ProseCraftGateResult => gate !== undefined);
  if (present.length === 0) {
    return {
      passed: true,
      verdict: 'PASS',
      score: 100,
      issues: [],
      revisionDirectives: [],
    };
  }
  if (present.length === 1) {
    return present[0];
  }

  const failed = present.filter(gate => !gate.passed);
  const score = Math.min(...present.map(gate => gate.score));
  const issues = present.flatMap(gate => gate.issues ?? []);
  const revisionDirectives = present.flatMap(gate => gate.revisionDirectives ?? []);

  return {
    passed: failed.length === 0,
    verdict: failed.some(gate => gate.verdict === 'MISSING')
      ? 'MISSING'
      : failed.length > 0
        ? 'REVISE'
        : 'PASS',
    score,
    issues: issues.length > 0 ? issues : undefined,
    revisionDirectives: revisionDirectives.length > 0 ? revisionDirectives : undefined,
  };
}

async function evaluateReportSourceEvidenceFreshness(
  projectDir: string,
  reportPath: string,
  report: unknown,
  config: ReportSourceEvidenceConfig
): Promise<ReportFreshnessGateIssue | undefined> {
  if (!report) {
    return undefined;
  }

  const absoluteSourcePaths = config.sourceRelativePaths.map(relativePath =>
    path.join(projectDir, relativePath)
  );
  const currentEvidence = await buildSourceEvidenceManifest(projectDir, absoluteSourcePaths);
  const comparison = compareSourceEvidence(
    extractSourceEvidenceManifest(report),
    currentEvidence
  );

  if (comparison.status === 'matched' || comparison.status === 'no-sources') {
    return undefined;
  }

  if (comparison.status === 'not-recorded' && config.checkSourceModifiedAfterReport) {
    const reportStat = await fs.stat(reportPath);
    const newestSource = currentEvidence.files
      .map(file => ({
        path: file.path,
        modifiedAt: new Date(file.modifiedAt),
      }))
      .filter(file => Number.isFinite(file.modifiedAt.getTime()))
      .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())[0];

    if (newestSource && newestSource.modifiedAt.getTime() > reportStat.mtimeMs + 1) {
      return {
        label: config.label,
        failureType: config.failureType,
        reportPath,
        reportRelativePath: normalizeProjectRelativePath(projectDir, reportPath),
        sourcePaths: config.sourceRelativePaths.map(relativePath => normalizePathSeparators(relativePath)),
        status: 'newer-source',
        changedPaths: [newestSource.path],
        currentDigest: comparison.currentDigest,
        recordedDigest: comparison.recordedDigest,
        reportModifiedAt: reportStat.mtime.toISOString(),
        newestSourceModifiedAt: newestSource.modifiedAt.toISOString(),
        newestSourcePath: newestSource.path,
      };
    }

    if (config.allowMissingSourceEvidence) {
      return undefined;
    }
  }

  if (comparison.status === 'not-recorded' && config.primarySourceRelativePaths) {
    const primaryEvidence = await buildSourceEvidenceManifest(
      projectDir,
      config.primarySourceRelativePaths.map(relativePath => path.join(projectDir, relativePath))
    );
    if (primaryEvidence.fileCount === 0) {
      return undefined;
    }
  }

  return {
    label: config.label,
    failureType: config.failureType,
    reportPath,
    reportRelativePath: normalizeProjectRelativePath(projectDir, reportPath),
    sourcePaths: config.sourceRelativePaths.map(relativePath => normalizePathSeparators(relativePath)),
    status: comparison.status,
    changedPaths: comparison.changedPaths,
    currentDigest: comparison.currentDigest,
    recordedDigest: comparison.recordedDigest,
  };
}

function buildStaleReportProseCraftGate(
  issue: ReportFreshnessGateIssue
): ProseCraftGateResult {
  const message = summarizeReportFreshnessIssue(issue);
  return {
    passed: false,
    verdict: 'MISSING',
    score: 0,
    issues: [message],
    revisionDirectives: [
      {
        type: 'stale-report',
        priority: 1,
        issue: message,
        instruction: `Regenerate ${issue.reportRelativePath} from current ${issue.label} sources before approving this chapter.`,
      },
    ],
  };
}

function buildStaleReportReaderResponseGate(
  issue: ReportFreshnessGateIssue,
  dimension: string
): ReaderResponseGateResult {
  const message = summarizeReportFreshnessIssue(issue);
  return {
    passed: false,
    score: 0,
    failureType: `stale-report:${issue.failureType}`,
    sampleId: issue.reportRelativePath,
    reliability: 'stale/source-evidence',
    issues: [message],
    revisionDirectives: [
      {
        dimension,
        action: `Regenerate ${issue.reportRelativePath} from current ${issue.label} sources before approving this chapter.`,
        expected: 'report sourceEvidence matches current source files',
        actual: summarizeReportFreshnessStatus(issue),
      },
    ],
  };
}

function summarizeReportFreshnessIssue(issue: ReportFreshnessGateIssue): string {
  const changed = issue.changedPaths.length > 0
    ? ` changed paths: ${issue.changedPaths.join(', ')}`
    : ` source paths: ${issue.sourcePaths.join(', ')}`;
  return `${issue.label} report is stale or untraceable (${issue.status}) at ${issue.reportRelativePath};${changed}.`;
}

function summarizeReportFreshnessStatus(issue: ReportFreshnessGateIssue): string {
  const digests = [
    issue.recordedDigest ? `recorded=${issue.recordedDigest}` : undefined,
    issue.currentDigest ? `current=${issue.currentDigest}` : undefined,
  ].filter((value): value is string => value !== undefined);
  const mtime = issue.status === 'newer-source'
    ? [
        issue.reportModifiedAt ? `reportModifiedAt=${issue.reportModifiedAt}` : undefined,
        issue.newestSourceModifiedAt ? `newestSourceModifiedAt=${issue.newestSourceModifiedAt}` : undefined,
        issue.newestSourcePath ? `newestSourcePath=${issue.newestSourcePath}` : undefined,
      ].filter((value): value is string => value !== undefined).join(', ')
    : undefined;
  return [
    `sourceEvidence=${issue.status}`,
    issue.changedPaths.length > 0 ? `changed=${issue.changedPaths.join(', ')}` : undefined,
    mtime,
    digests.length > 0 ? digests.join(', ') : undefined,
  ].filter((value): value is string => value !== undefined).join('; ');
}

function normalizeProjectRelativePath(projectDir: string, filePath: string): string {
  return normalizePathSeparators(path.relative(projectDir, filePath));
}

function normalizePathSeparators(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

async function evaluateProseTasteBenchmarkGateFromProject(
  projectDir: string,
  chapterNumber: number
): Promise<ProseCraftGateResult | undefined> {
  const reportPath = path.join(projectDir, 'reviews', 'prose-taste-benchmark-report.json');
  const report = await readOptionalJson(reportPath) as ProseTasteBenchmarkReport | undefined;
  const benchmark = report?.benchmark;
  const sampleResults = benchmark?.sampleResults ?? [];
  if (!benchmark || sampleResults.length === 0) {
    return undefined;
  }

  const hasChapterScopedSamples = sampleResults.some(result =>
    Number.isInteger(result.chapter)
  );
  const gateSamples = hasChapterScopedSamples
    ? sampleResults.filter(result => result.chapter === chapterNumber)
    : sampleResults;
  if (gateSamples.length === 0) {
    return undefined;
  }

  const freshnessIssue = await evaluateReportSourceEvidenceFreshness(
    projectDir,
    reportPath,
    report,
    PROSE_TASTE_REPORT_EVIDENCE
  );
  if (freshnessIssue) {
    return buildStaleReportProseCraftGate(freshnessIssue);
  }

  const blockingResults = gateSamples.filter(result =>
    shouldBlockOnProseTasteBenchmarkResult(result, hasChapterScopedSamples)
  );
  const passed = blockingResults.length === 0;
  if (passed) {
    return {
      passed: true,
      verdict: 'PASS',
      score: 100,
      issues: summarizeProseTasteBenchmarkWarnings(gateSamples, benchmark, hasChapterScopedSamples),
      revisionDirectives: [],
    };
  }

  return {
    passed: false,
    verdict: 'REVISE',
    score: summarizeProseTasteBenchmarkGateScore(blockingResults, hasChapterScopedSamples),
    issues: summarizeProseTasteBenchmarkIssues(blockingResults, chapterNumber, hasChapterScopedSamples),
    revisionDirectives: summarizeProseTasteBenchmarkDirectives(blockingResults),
  };
}

function shouldBlockOnProseTasteBenchmarkResult(
  result: ProseTasteBenchmarkGateSampleResult,
  chapterScoped: boolean
): boolean {
  if (chapterScoped && !isChapterGroundedProseTasteBenchmarkResult(result)) {
    return false;
  }

  if (chapterScoped && result.expectedPassed === false) {
    return true;
  }

  if (result.failureType === 'false-positive' || result.failureType === 'missing-issue') {
    return true;
  }

  return result.expectedPassed === false && result.failureType === 'score-out-of-range';
}

function summarizeProseTasteBenchmarkGateScore(
  results: ProseTasteBenchmarkGateSampleResult[],
  chapterScoped: boolean
): number {
  if (results.some(result => result.failureType === 'false-positive')) return 55;
  if (results.some(result => result.failureType === 'missing-issue')) return 60;
  if (chapterScoped && results.some(result => result.expectedPassed === false)) return 62;
  if (results.some(result => result.failureType === 'score-out-of-range')) return 68;
  return 75;
}

function summarizeProseTasteBenchmarkWarnings(
  results: ProseTasteBenchmarkGateSampleResult[],
  benchmark: ProseTasteBenchmarkGatePayload,
  chapterScoped: boolean
): string[] | undefined {
  const warnings: string[] = [];
  if (chapterScoped) {
    const ungroundedSamples = results.filter(result =>
      !isChapterGroundedProseTasteBenchmarkResult(result)
    );
    if (ungroundedSamples.length > 0) {
      warnings.push(
        `문체 취향 벤치마크 샘플 ${ungroundedSamples.map(sample => sample.id ?? 'unknown').join(', ')}은 chapter가 지정됐지만 실제 회차 원고에서 읽힌 근거가 아니라 hard block 대신 경고로 남깁니다. chapterSourceGrounded=true가 되도록 chapters/chapter_NNN.md에서 리포트를 재생성하세요.`
      );
    }
    return warnings.length > 0 ? warnings : undefined;
  }

  if (benchmark.readyForStyleTuning === false) {
    const counts = [
      benchmark.falseNegativeCount ? `false negatives ${benchmark.falseNegativeCount}` : undefined,
      benchmark.scoreOutOfRangeCount ? `score out of range ${benchmark.scoreOutOfRangeCount}` : undefined,
    ].filter((part): part is string => part !== undefined);
    if (counts.length > 0) {
      warnings.push(
        `문체 취향 벤치마크는 아직 style tuning 근거가 약합니다: ${counts.join(', ')}.`
      );
    }
  }

  const weakSamples = results.filter(result =>
    result.styleTuningUsable === false &&
    result.expectedPassed === false &&
    result.failureType !== 'false-positive' &&
    result.failureType !== 'missing-issue'
  );
  if (weakSamples.length > 0) {
    warnings.push(
      `문체 취향 벤치마크 샘플 ${weakSamples.map(sample => sample.id ?? 'unknown').join(', ')}은 마찰 주석이나 holdout 근거가 약해 차단 대신 경고로 남깁니다.`
    );
  }

  return warnings.length > 0 ? warnings : undefined;
}

function isChapterGroundedProseTasteBenchmarkResult(
  result: ProseTasteBenchmarkGateSampleResult
): boolean {
  if (!Number.isInteger(result.chapter)) {
    return true;
  }
  if (result.chapterSourceGrounded === true || result.contentSource === 'chapter') {
    return true;
  }
  if (
    typeof result.contentPath === 'string' &&
    isChapterManuscriptPath(result.contentPath, result.chapter)
  ) {
    return true;
  }

  return result.contentSource === undefined &&
    result.contentPath === undefined &&
    result.chapterSourceGrounded === undefined;
}

function isChapterManuscriptPath(contentPath: string, chapterNumber: number | undefined): boolean {
  if (!Number.isInteger(chapterNumber)) {
    return false;
  }
  const padded = String(chapterNumber).padStart(3, '0');
  const normalized = contentPath.replace(/\\/g, '/').toLowerCase();
  return normalized === `chapters/chapter_${padded}.md` ||
    normalized === `chapters/ch${padded}.md`;
}

function summarizeProseTasteBenchmarkIssues(
  results: ProseTasteBenchmarkGateSampleResult[],
  chapterNumber: number,
  chapterScoped: boolean
): string[] {
  const issues: string[] = [];
  for (const result of results.slice(0, 5)) {
    const id = result.id ?? 'unknown';
    const scope = chapterScoped
      ? `chapter ${chapterNumber}`
      : 'project-level style calibration';
    const score = result.score ?? result.gate?.score;
    const failure = result.failureType ? ` failure type: ${result.failureType}.` : '';
    const scoreText = score !== undefined ? ` score ${score}.` : '';
    if (result.expectedPassed === false) {
      issues.push(
        `문체 취향 벤치마크 샘플 ${id} (${scope})이 독자 비선호 문체로 표시되어 완료를 차단합니다.${scoreText}${failure}`
      );
    } else {
      issues.push(
        `문체 취향 벤치마크 샘플 ${id} (${scope})에서 자동 문체 판정 오차가 남았습니다.${scoreText}${failure}`
      );
    }

    const missingCodes = result.missingExpectedIssueCodes ?? [];
    if (missingCodes.length > 0) {
      issues.push(`문체 취향 벤치마크 missing issue codes: ${missingCodes.join(', ')}`);
    }

    const issueCodes = result.issueCodes ?? [];
    if (issueCodes.length > 0) {
      issues.push(`문체 취향 벤치마크 detected issue codes: ${issueCodes.join(', ')}`);
    }

    for (const annotation of (result.styleFrictionAnnotations ?? []).slice(0, 3)) {
      issues.push(formatProseTasteBenchmarkFrictionIssue(annotation));
    }

    for (const gateIssue of (result.gate?.issues ?? []).slice(0, 3)) {
      issues.push(formatProseTasteBenchmarkGateIssue(gateIssue));
    }
  }

  return uniqueNonEmptyStrings(issues).slice(0, 10);
}

function summarizeProseTasteBenchmarkDirectives(
  results: ProseTasteBenchmarkGateSampleResult[]
): NonNullable<ProseCraftGateResult['revisionDirectives']> {
  const directives: NonNullable<ProseCraftGateResult['revisionDirectives']> = [];

  for (const result of results) {
    for (const annotation of (result.styleFrictionAnnotations ?? [])
      .filter(isActionableProseTasteBenchmarkFrictionAnnotation)
      .slice(0, 3)) {
      directives.push({
        type: 'style-benchmark',
        priority: proseTasteBenchmarkPriority(annotation.severity),
        issue: formatProseTasteBenchmarkFrictionIssue(annotation),
        instruction: annotation.rewriteSuggestion,
        currentText: annotation.targetText,
      });
    }

    if (directives.length === 0) {
      const issueCodes = uniqueNonEmptyStrings([
        ...(result.missingExpectedIssueCodes ?? []),
        ...(result.issueCodes ?? []),
      ]);
      directives.push({
        type: 'style-benchmark',
        priority: result.failureType === 'false-positive' ? 1 : 2,
        issue: `문체 취향 벤치마크 샘플 ${result.id ?? 'unknown'} 실패${result.failureType ? `: ${result.failureType}` : ''}`,
        instruction: issueCodes.length > 0
          ? `Revise the prose so these style frictions are visibly removed or correctly detected: ${issueCodes.join(', ')}.`
          : 'Revise the prose against the reader-labeled disliked style sample and rerun the prose taste benchmark.',
      });
    }
  }

  return directives.slice(0, 5);
}

function isActionableProseTasteBenchmarkFrictionAnnotation(
  annotation: ProseTasteBenchmarkFrictionAnnotation
): boolean {
  return typeof annotation.location === 'string' &&
    annotation.location.trim().length > 0 &&
    typeof annotation.reason === 'string' &&
    annotation.reason.trim().length > 0 &&
    typeof annotation.rewriteSuggestion === 'string' &&
    annotation.rewriteSuggestion.trim().length > 0;
}

function formatProseTasteBenchmarkFrictionIssue(
  annotation: ProseTasteBenchmarkFrictionAnnotation
): string {
  const location = annotation.location ? `${annotation.location}: ` : '';
  const code = annotation.issueCode ? ` [${annotation.issueCode}]` : '';
  const severity = annotation.severity ? ` (${annotation.severity})` : '';
  const segment = annotation.readerSegment ? ` [${annotation.readerSegment}]` : '';
  return `문체 취향 벤치마크 마찰 ${location}${annotation.reason ?? 'reader friction'}${code}${severity}${segment}`;
}

function formatProseTasteBenchmarkGateIssue(
  issue: ProseTasteBenchmarkGateIssue
): string {
  const locationParts: string[] = [];
  if (issue.paragraphNumber !== undefined) locationParts.push(`문단 ${issue.paragraphNumber}`);
  if (issue.sentenceNumber !== undefined) locationParts.push(`문장 ${issue.sentenceNumber}`);
  if (issue.lineNumber !== undefined) locationParts.push(`줄 ${issue.lineNumber}`);
  const location = locationParts.length > 0 ? ` (${locationParts.join(', ')})` : '';
  const code = issue.code ? ` [${issue.code}]` : '';
  const severity = issue.severity ? ` (${issue.severity})` : '';
  return `문체 취향 벤치마크 게이트 issue${location}${code}: ${issue.message ?? issue.evidence ?? 'style issue'}${severity}`;
}

function proseTasteBenchmarkPriority(severity?: string): number {
  switch (severity) {
    case 'critical':
    case 'high':
      return 1;
    case 'medium':
      return 3;
    case 'low':
      return 5;
    default:
      return 2;
  }
}

const SERIES_RETENTION_BLOCKING_FAILURE_TYPES = new Set([
  'automated-false-positive',
  'weak-reader-retention',
  'reader-retention-drop',
  'reader-funnel-drop',
  'reader-hook-stall',
  'repetitive-reward-pattern',
  'repetitive-emotional-pattern',
  'narrow-emotional-palette',
]);

const CHARACTER_RELATIONSHIP_BLOCKING_FAILURE_TYPES = new Set([
  'automated-false-positive',
  'reader-label-mismatch',
  'weak-reader-investment',
  'weak-dimension',
]);

const CONSISTENCY_GATE_DOMAINS: ConsistencyGateDomain[] = [
  'character',
  'timeline',
  'setting',
  'factual',
  'plot_logic',
];

const CONSISTENCY_GATE_BLOCKING_SEVERITIES = new Set(['critical', 'major', 'minor']);

function mergeReaderResponseGates(
  ...gates: Array<ReaderResponseGateResult | undefined>
): ReaderResponseGateResult | undefined {
  const present = gates.filter((gate): gate is ReaderResponseGateResult => gate !== undefined);
  if (present.length === 0) {
    return undefined;
  }
  if (present.length === 1) {
    return present[0];
  }

  const failed = present.filter(gate => !gate.passed);
  const primary = (failed.length > 0 ? failed : present)
    .slice()
    .sort((a, b) => a.score - b.score)[0];
  const calibrationScores = present
    .map(gate => gate.calibrationScore)
    .filter((score): score is number => score !== undefined);
  const respondentCounts = present
    .map(gate => gate.respondentCount)
    .filter((count): count is number => count !== undefined);
  const issues = present.flatMap(gate => gate.issues ?? []);
  const revisionDirectives = present.flatMap(gate => gate.revisionDirectives ?? []);
  const failureTypes = uniqueNonEmptyStrings(present.map(gate => gate.failureType));
  const sampleIds = uniqueNonEmptyStrings(present.map(gate => gate.sampleId));
  const reliabilities = uniqueNonEmptyStrings(present.map(gate => gate.reliability));

  return {
    passed: failed.length === 0,
    score: primary.score,
    calibrationScore: calibrationScores.length > 0 ? Math.min(...calibrationScores) : undefined,
    failureType: failureTypes.length > 0 ? failureTypes.join('+') : undefined,
    sampleId: sampleIds.length > 0 ? sampleIds.join(',') : undefined,
    respondentCount: respondentCounts.length > 0 ? Math.max(...respondentCounts) : undefined,
    reliability: reliabilities.length > 0 ? reliabilities.join(', ') : undefined,
    issues: issues.length > 0 ? issues : undefined,
    revisionDirectives: revisionDirectives.length > 0 ? revisionDirectives : undefined,
  };
}

async function evaluateEngagementBenchmarkGateFromProject(
  projectDir: string,
  chapterNumber: number
): Promise<ReaderResponseGateResult | undefined> {
  const reportPath = path.join(projectDir, 'reviews', 'engagement-benchmark-report.json');
  const report = await readOptionalJson(reportPath) as EngagementBenchmarkReport | undefined;
  const benchmark = report?.benchmark;
  const chapterResults = (benchmark?.sampleResults ?? [])
    .filter(result => result.chapter === chapterNumber);
  if (!benchmark || chapterResults.length === 0) {
    return undefined;
  }

  const freshnessIssue = await evaluateReportSourceEvidenceFreshness(
    projectDir,
    reportPath,
    report,
    ENGAGEMENT_BENCHMARK_REPORT_EVIDENCE
  );
  if (freshnessIssue) {
    return buildStaleReportReaderResponseGate(freshnessIssue, 'engagement-benchmark-source-evidence');
  }

  const blockingResults = chapterResults.filter(shouldBlockOnEngagementBenchmarkResult);
  const passed = blockingResults.length === 0;
  const consideredResults = blockingResults.length > 0 ? blockingResults : chapterResults;
  const worst = consideredResults
    .slice()
    .sort((a, b) => engagementBenchmarkGateScore(a) - engagementBenchmarkGateScore(b))[0];

  return {
    passed,
    score: passed ? 100 : engagementBenchmarkGateScore(worst),
    failureType: passed
      ? undefined
      : `engagement-benchmark:${summarizeEngagementBenchmarkFailureTypes(blockingResults).join('+')}`,
    sampleId: uniqueNonEmptyStrings(consideredResults.map(result => result.id)).join(',') || undefined,
    reliability: summarizeEngagementBenchmarkReliability(chapterResults, benchmark),
    issues: passed
      ? summarizeEngagementBenchmarkWarnings(chapterResults, benchmark)
      : summarizeEngagementBenchmarkIssues(blockingResults, chapterNumber),
    revisionDirectives: passed
      ? undefined
      : summarizeEngagementBenchmarkDirectives(blockingResults),
  };
}

function shouldBlockOnEngagementBenchmarkResult(
  result: EngagementBenchmarkGateSampleResult
): boolean {
  if (!isChapterGroundedEngagementBenchmarkResult(result)) {
    return false;
  }

  if (result.expectedPassed === false) {
    return true;
  }

  const failureTypes = engagementBenchmarkFailureTypes(result);
  return failureTypes.includes('false-positive') ||
    failureTypes.includes('missing-issue') ||
    failureTypes.includes('forbidden-issue') ||
    failureTypes.includes('positive-quality-conflict');
}

function engagementBenchmarkGateScore(
  result: EngagementBenchmarkGateSampleResult
): number {
  const failureTypes = engagementBenchmarkFailureTypes(result);
  if (failureTypes.includes('false-positive')) return 55;
  if (failureTypes.includes('positive-quality-conflict')) return 58;
  if (failureTypes.includes('missing-issue')) return 60;
  if (failureTypes.includes('forbidden-issue')) return 62;
  if (result.expectedPassed === false) return 62;
  if (failureTypes.includes('score-out-of-range')) return 68;
  return 75;
}

function isChapterGroundedEngagementBenchmarkResult(
  result: EngagementBenchmarkGateSampleResult
): boolean {
  if (!Number.isInteger(result.chapter)) {
    return true;
  }
  if (result.chapterSourceGrounded === true || result.manuscriptSource === 'chapter') {
    return true;
  }
  if (
    result.manuscriptSource === 'manuscript_path' &&
    typeof result.manuscriptPath === 'string' &&
    isChapterManuscriptPath(result.manuscriptPath, result.chapter)
  ) {
    return true;
  }

  return result.manuscriptSource === undefined &&
    result.manuscriptPath === undefined &&
    result.chapterSourceGrounded === undefined;
}

function summarizeEngagementBenchmarkReliability(
  results: EngagementBenchmarkGateSampleResult[],
  benchmark: EngagementBenchmarkGatePayload
): string {
  const labels = [
    benchmark.readyForGateTuning === false ? 'not-ready' : 'ready',
    results.some(result => !isChapterGroundedEngagementBenchmarkResult(result))
      ? 'has-ungrounded-fixtures'
      : 'chapter-grounded',
    'engagement-benchmark',
  ];
  return labels.join('/');
}

function summarizeEngagementBenchmarkFailureTypes(
  results: EngagementBenchmarkGateSampleResult[]
): string[] {
  return uniqueNonEmptyStrings(
    results.flatMap(result => engagementBenchmarkFailureTypes(result))
  );
}

function engagementBenchmarkFailureTypes(
  result: EngagementBenchmarkGateSampleResult
): string[] {
  return uniqueNonEmptyStrings([
    ...(result.failureTypes ?? []),
    result.failureType,
    result.expectedPassed === false ? 'known-bad-current-chapter' : undefined,
  ]);
}

function summarizeEngagementBenchmarkWarnings(
  results: EngagementBenchmarkGateSampleResult[],
  benchmark: EngagementBenchmarkGatePayload
): string[] | undefined {
  const warnings: string[] = [];
  const ungroundedSamples = results.filter(result =>
    !isChapterGroundedEngagementBenchmarkResult(result)
  );
  if (ungroundedSamples.length > 0) {
    warnings.push(
      `회차 재미 벤치마크 샘플 ${ungroundedSamples.map(sample => sample.id ?? 'unknown').join(', ')}은 chapter가 지정됐지만 현재 회차 원고에서 읽힌 근거가 아니라 hard block 대신 경고로 남깁니다. manuscriptSource=chapter 또는 chapterSourceGrounded=true가 되도록 리포트를 재생성하세요.`
    );
  }

  if (benchmark.readyForGateTuning === false) {
    const counts = [
      benchmark.falseNegativeCount ? `false negatives ${benchmark.falseNegativeCount}` : undefined,
      benchmark.scoreOutOfRangeCount ? `score out of range ${benchmark.scoreOutOfRangeCount}` : undefined,
    ].filter((part): part is string => part !== undefined);
    if (counts.length > 0) {
      warnings.push(
        `회차 재미 벤치마크는 아직 gate tuning 근거가 약합니다: ${counts.join(', ')}.`
      );
    }
  }

  return warnings.length > 0 ? warnings : undefined;
}

function summarizeEngagementBenchmarkIssues(
  results: EngagementBenchmarkGateSampleResult[],
  chapterNumber: number
): string[] {
  const issues: string[] = [];

  for (const result of results.slice(0, 5)) {
    const id = result.id ?? 'unknown';
    const scoreText = result.score !== undefined ? ` score ${result.score}.` : '';
    const failureTypes = engagementBenchmarkFailureTypes(result);
    const failureText = failureTypes.length > 0
      ? ` failure types: ${failureTypes.join(', ')}.`
      : '';
    if (result.expectedPassed === false) {
      issues.push(
        `회차 재미 벤치마크 샘플 ${id} (chapter ${chapterNumber})이 known-bad current chapter로 표시되어 완료를 차단합니다.${scoreText}${failureText}`
      );
    } else {
      issues.push(
        `회차 재미 벤치마크 샘플 ${id} (chapter ${chapterNumber})에서 자동 재미 판정과 labeled 고점 근거가 충돌합니다.${scoreText}${failureText}`
      );
    }

    const positiveConflicts = result.positiveQualityConflictIssueCodes ?? [];
    if (positiveConflicts.length > 0) {
      issues.push(`회차 재미 벤치마크 positive high-point conflicts: ${positiveConflicts.join(', ')}`);
    }

    const forbiddenCodes = result.forbiddenIssueCodesSeen ?? [];
    if (forbiddenCodes.length > 0) {
      issues.push(`회차 재미 벤치마크 forbidden issue codes: ${forbiddenCodes.join(', ')}`);
    }

    const missingCodes = result.missingExpectedIssueCodes ?? [];
    if (missingCodes.length > 0) {
      issues.push(`회차 재미 벤치마크 missing issue codes: ${missingCodes.join(', ')}`);
    }

    const issueCodes = result.issueCodes ?? [];
    if (issueCodes.length > 0) {
      issues.push(`회차 재미 벤치마크 detected issue codes: ${issueCodes.join(', ')}`);
    }
  }

  return uniqueNonEmptyStrings(issues).slice(0, 10);
}

function summarizeEngagementBenchmarkDirectives(
  results: EngagementBenchmarkGateSampleResult[]
): NonNullable<ReaderResponseGateResult['revisionDirectives']> {
  return results.slice(0, 5).map(result => {
    const issueCodes = uniqueNonEmptyStrings([
      ...(result.positiveQualityConflictIssueCodes ?? []),
      ...(result.forbiddenIssueCodesSeen ?? []),
      ...(result.missingExpectedIssueCodes ?? []),
      ...(result.expectedPassed === false ? result.issueCodes ?? [] : []),
    ]);
    return {
      dimension: 'engagement-benchmark',
      action: issueCodes.length > 0
        ? `Revise the current chapter so these engagement benchmark blockers are visibly resolved or correctly detected: ${issueCodes.join(', ')}.`
        : 'Revise the current chapter against the labeled engagement benchmark sample and rerun the engagement benchmark before Ralph Loop can continue.',
      expected: result.expectedPassed === false
        ? 'current chapter no longer matches a known-bad engagement benchmark sample'
        : 'positive high-point labels align with manuscript evidence and no forbidden/missing issue conflict remains',
      actual: summarizeEngagementBenchmarkActual(result),
    };
  });
}

function summarizeEngagementBenchmarkActual(
  result: EngagementBenchmarkGateSampleResult
): string {
  return [
    `sample=${result.id ?? 'unknown'}`,
    `score=${result.score ?? 'unknown'}`,
    `failures=${engagementBenchmarkFailureTypes(result).join(', ') || 'unknown'}`,
  ].join('; ');
}

async function evaluateReaderResponseGateFromProject(
  projectDir: string,
  chapterNumber: number
): Promise<ReaderResponseGateResult | undefined> {
  const reportPath = path.join(projectDir, 'reviews', 'reader-response-calibration.json');
  const report = await readOptionalJson(reportPath) as ReaderResponseCalibrationReport | undefined;
  const chapterResults = (report?.calibration?.sampleResults ?? [])
    .filter(result => result.chapter === chapterNumber);
  if (chapterResults.length === 0) {
    return undefined;
  }

  const freshnessIssue = await evaluateReportSourceEvidenceFreshness(
    projectDir,
    reportPath,
    report,
    READER_RESPONSE_REPORT_EVIDENCE
  );
  if (freshnessIssue) {
    return buildStaleReportReaderResponseGate(freshnessIssue, 'reader-response-source-evidence');
  }

  const usableResults = chapterResults.filter(isUsableReaderResponseGateSample);
  const actualContinuationBehaviorFailures = chapterResults
    .filter(shouldBlockOnReaderResponseContinuationBehavior);
  const gateEligibleResults = uniqueReaderResponseResults([
    ...usableResults,
    ...actualContinuationBehaviorFailures,
  ]);
  if (gateEligibleResults.length === 0) {
    return {
      passed: true,
      score: averageReaderResponseScore(chapterResults),
      calibrationScore: report?.calibration?.calibrationScore,
      sampleId: chapterResults[0].id,
      respondentCount: Math.max(...chapterResults.map(result => result.respondentCount)),
      reliability: 'weak',
      issues: [
        summarizeReaderResponseWeakEvidence(chapterResults),
      ],
    };
  }

  const blockingResults = uniqueReaderResponseResults([
    ...usableResults.filter(result => shouldBlockOnReaderResponse(result)),
    ...actualContinuationBehaviorFailures,
  ]);
  const worst = (blockingResults.length > 0 ? blockingResults : gateEligibleResults)
    .slice()
    .sort((a, b) => a.readerCompositeScore - b.readerCompositeScore)[0];
  const passed = blockingResults.length === 0;

  return {
    passed,
    score: worst.readerCompositeScore,
    calibrationScore: report?.calibration?.calibrationScore,
    failureType: summarizeReaderResponseFailureType(worst, passed),
    sampleId: worst.id,
    respondentCount: worst.respondentCount,
    reliability: summarizeReaderResponseReliability(worst),
    issues: summarizeReaderResponseIssues(worst, passed),
    revisionDirectives: summarizeReaderResponseDirectives(worst),
  };
}

async function evaluateCharacterRelationshipGateFromProject(
  projectDir: string,
  chapterNumber: number
): Promise<ReaderResponseGateResult | undefined> {
  const reportPath = path.join(projectDir, 'reviews', 'character-relationship-benchmark-report.json');
  const report = await readOptionalJson(reportPath) as CharacterRelationshipBenchmarkReport | undefined;
  const chapterResults = (report?.benchmark?.sampleResults ?? [])
    .filter(result => result.chapter === chapterNumber);
  if (chapterResults.length === 0) {
    return undefined;
  }

  const freshnessIssue = await evaluateReportSourceEvidenceFreshness(
    projectDir,
    reportPath,
    report,
    CHARACTER_RELATIONSHIP_REPORT_EVIDENCE
  );
  if (freshnessIssue) {
    return buildStaleReportReaderResponseGate(freshnessIssue, 'character-relationship-source-evidence');
  }

  const usableResults = chapterResults.filter(result => result.evidenceSufficient === true);
  if (usableResults.length === 0) {
    return {
      passed: true,
      score: averageCharacterRelationshipScore(chapterResults),
      sampleId: chapterResults[0].id,
      respondentCount: maxCharacterRelationshipRespondents(chapterResults),
      reliability: 'weak/character-relationship',
      issues: [
        summarizeCharacterRelationshipWeakEvidence(chapterResults),
      ],
    };
  }

  const blockingResults = usableResults.filter(shouldBlockOnCharacterRelationship);
  const worst = (blockingResults.length > 0 ? blockingResults : usableResults)
    .slice()
    .sort((a, b) => a.readerInvestmentScore - b.readerInvestmentScore)[0];
  const passed = blockingResults.length === 0;

  return {
    passed,
    score: worst.readerInvestmentScore,
    failureType: passed ? undefined : summarizeCharacterRelationshipFailureType(worst),
    sampleId: worst.id,
    respondentCount: worst.responseCount,
    reliability: 'usable/character-relationship',
    issues: summarizeCharacterRelationshipIssues(worst, passed),
    revisionDirectives: summarizeCharacterRelationshipDirectives(worst),
  };
}

function shouldBlockOnCharacterRelationship(
  result: CharacterRelationshipGateSampleResult
): boolean {
  if (result.evidenceSufficient !== true) {
    return false;
  }

  return characterRelationshipBlockingTypes(result).length > 0;
}

function summarizeCharacterRelationshipFailureType(
  result: CharacterRelationshipGateSampleResult
): string | undefined {
  const blockingTypes = characterRelationshipBlockingTypes(result);
  if (blockingTypes.length === 0) {
    return undefined;
  }
  return `character-relationship:${blockingTypes.join(',')}`;
}

function characterRelationshipBlockingTypes(
  result: CharacterRelationshipGateSampleResult
): string[] {
  const blockingTypes = characterRelationshipFailureTypes(result)
    .filter(type => {
      if (type === 'reader-label-mismatch') {
        return result.readerPassed === false;
      }
      return CHARACTER_RELATIONSHIP_BLOCKING_FAILURE_TYPES.has(type);
    });

  if (result.expectedInvesting === false && result.readerPassed === false) {
    blockingTypes.push('known-flat-current-chapter');
  }

  return uniqueNonEmptyStrings(blockingTypes);
}

function characterRelationshipFailureTypes(
  result: CharacterRelationshipGateSampleResult
): string[] {
  return uniqueNonEmptyStrings([
    ...(result.failureTypes ?? []),
    result.failureType,
  ]);
}

function summarizeCharacterRelationshipWeakEvidence(
  results: CharacterRelationshipGateSampleResult[]
): string {
  const sampleIds = results.map(result => result.id).join(', ');
  const failureTypes = uniqueNonEmptyStrings(
    results.flatMap(result => characterRelationshipFailureTypes(result))
  );
  return [
    `인물/관계 투자도 샘플(${sampleIds})은 현재 회차를 가리키지만 evidenceSufficient=true가 아니어서 완료 차단 근거로 쓰지 않습니다.`,
    failureTypes.length > 0 ? `reported failure types: ${failureTypes.join(', ')}` : undefined,
  ]
    .filter((part): part is string => part !== undefined)
    .join(' ');
}

function summarizeCharacterRelationshipIssues(
  result: CharacterRelationshipGateSampleResult,
  passed: boolean
): string[] {
  const issues: string[] = [];
  if (!passed) {
    const automated = result.automatedScore !== undefined
      ? ` automated score ${result.automatedScore}.`
      : '';
    issues.push(
      `인물/관계 투자도 샘플 ${result.id}에서 자동 드라마 판정과 독자 투자도가 충돌했습니다: reader investment ${result.readerInvestmentScore}점.${automated}`
    );
  }

  const failureTypes = characterRelationshipFailureTypes(result);
  if (failureTypes.length > 0) {
    issues.push(`character relationship failure types: ${failureTypes.join(', ')}`);
  }

  const focusSummary = summarizeCharacterRelationshipFocus(result.focus);
  if (focusSummary) {
    issues.push(focusSummary);
  }

  const weakDimensions = uniqueNonEmptyStrings(result.weakDimensions ?? []);
  if (weakDimensions.length > 0) {
    issues.push(`weak character relationship dimensions: ${weakDimensions.join(', ')}`);
  }

  for (const evidence of (result.readerEvidence ?? []).slice(0, 3)) {
    issues.push(formatCharacterRelationshipReaderEvidence(evidence));
  }

  issues.push(...(result.recommendations ?? []).slice(0, 2));

  return uniqueNonEmptyStrings(issues).slice(0, 10);
}

function summarizeCharacterRelationshipFocus(
  focus: CharacterRelationshipGateFocus | undefined
): string | undefined {
  if (!focus) {
    return undefined;
  }

  const actors = uniqueNonEmptyStrings([
    focus.characterName ?? focus.characterId,
    focus.counterpartName ?? focus.counterpartId,
  ]);
  const parts = [
    actors.length > 0 ? `actors: ${actors.join(' / ')}` : undefined,
    focus.relationshipType ? `type: ${focus.relationshipType}` : undefined,
    focus.scenePromise ? `promise: ${focus.scenePromise}` : undefined,
    focus.relationshipTurn ? `turn: ${focus.relationshipTurn}` : undefined,
    focus.consequence ? `consequence: ${focus.consequence}` : undefined,
  ].filter((part): part is string => part !== undefined);

  return parts.length > 0 ? `character relationship focus: ${parts.join('; ')}` : undefined;
}

function formatCharacterRelationshipReaderEvidence(
  evidence: CharacterRelationshipGateReaderEvidence
): string {
  const reader = evidence.readerId ? `[${evidence.readerId}] ` : '';
  const parts = [
    evidence.comment,
    evidence.carePoints && evidence.carePoints.length > 0
      ? `care: ${evidence.carePoints.join(', ')}`
      : undefined,
    evidence.disbeliefPoints && evidence.disbeliefPoints.length > 0
      ? `disbelief: ${evidence.disbeliefPoints.join(', ')}`
      : undefined,
    evidence.rewriteSuggestion ? `rewrite: ${evidence.rewriteSuggestion}` : undefined,
  ].filter((part): part is string => part !== undefined && part.trim().length > 0);

  return `character relationship reader evidence ${reader}${parts.join(' ')}`;
}

function summarizeCharacterRelationshipDirectives(
  result: CharacterRelationshipGateSampleResult
): ReaderResponseGateResult['revisionDirectives'] {
  const directives: NonNullable<ReaderResponseGateResult['revisionDirectives']> = [];
  const blockingTypes = characterRelationshipBlockingTypes(result);

  if (blockingTypes.length > 0) {
    directives.push({
      dimension: 'character-relationship',
      action: buildCharacterRelationshipCoreAction(result),
      expected: 'target readers care about the character outcome and want the next relationship scene',
      actual: `${result.readerInvestmentScore}점; ${blockingTypes.join(', ')}`,
    });
  }

  for (const dimension of uniqueNonEmptyStrings(result.weakDimensions ?? []).slice(0, 3)) {
    directives.push({
      dimension,
      action: characterRelationshipDimensionAction(dimension),
      expected: `reader ${dimension} clears the character/relationship investment threshold`,
      actual: summarizeCharacterRelationshipDimensionActual(result, dimension),
    });
  }

  return directives.slice(0, 5);
}

function buildCharacterRelationshipCoreAction(
  result: CharacterRelationshipGateSampleResult
): string {
  const focus = result.focus;
  const turn = focus?.relationshipTurn ? ` Current turn: ${focus.relationshipTurn}` : '';
  const consequence = focus?.consequence ? ` Current consequence: ${focus.consequence}` : '';
  const evidence = (result.readerEvidence ?? [])
    .find(item => item.rewriteSuggestion?.trim())?.rewriteSuggestion;
  const rewrite = evidence ? ` Reader rewrite cue: ${evidence}` : '';
  return `Rewrite the character/relationship turn so agency, vulnerable cost, reciprocal pressure, subtext, and changed consequence are visible in scene action.${turn}${consequence}${rewrite}`;
}

function summarizeCharacterRelationshipDimensionActual(
  result: CharacterRelationshipGateSampleResult,
  dimension: string
): string {
  const dimensionScore = result.dimensionResults
    ?.find(entry => entry.dimension === dimension)
    ?.score;
  return dimensionScore !== undefined
    ? `${dimensionScore}점 / reader investment ${result.readerInvestmentScore}점`
    : `${result.readerInvestmentScore}점`;
}

function characterRelationshipDimensionAction(dimension: string): string {
  switch (dimension) {
    case 'protagonist_agency':
      return 'Give the protagonist a visible pressured choice, a rejected safe option, and an action only this character would take.';
    case 'distinctive_signature':
      return 'Replace generic competence with a memorable tactic, flaw, voice, object, or social reaction that makes the character identifiable.';
    case 'vulnerability_cost':
      return 'Attach a personal loss, exposed secret, social penalty, or emotional risk to the relationship turn.';
    case 'character_attachment':
      return 'Tie the scene outcome to a concrete desire, wound, obligation, or person readers can want protected.';
    case 'relationship_tension':
      return 'Add conflicting goals, mistrust, refusal, silence, or a loaded demand before the relationship softens or changes.';
    case 'reciprocal_pressure':
      return 'Make the counterpart impose a condition, price, secret, threat, or competing need instead of simply helping or forgiving.';
    case 'subtext_inference':
      return 'Remove explained feelings and stage the hidden mind through evasions, contradictions, gestures, and selective omissions.';
    case 'turn_consequence':
      return 'Show the relationship turn changing behavior, closing an option, opening a risk, or forcing the next action immediately.';
    case 'next_scene_interest':
      return 'End with a relationship obligation, challenge, reveal, or unresolved condition that makes the next scene desirable.';
    default:
      return 'Revise the relationship scene against target-reader care points, disbelief points, and rewrite suggestions before completion.';
  }
}

function averageCharacterRelationshipScore(
  results: CharacterRelationshipGateSampleResult[]
): number {
  const scores = results
    .map(result => result.readerInvestmentScore)
    .filter(score => Number.isFinite(score));
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function maxCharacterRelationshipRespondents(
  results: CharacterRelationshipGateSampleResult[]
): number | undefined {
  const counts = results
    .map(result => result.responseCount)
    .filter((count): count is number => count !== undefined);
  return counts.length > 0 ? Math.max(...counts) : undefined;
}

async function evaluateSeriesRetentionGateFromProject(
  projectDir: string,
  chapterNumber: number
): Promise<ReaderResponseGateResult | undefined> {
  const reportPath = path.join(projectDir, 'reviews', 'series-retention-benchmark-report.json');
  const report = await readOptionalJson(reportPath) as SeriesRetentionBenchmarkReport | undefined;
  const chapterResults = (report?.benchmark?.sampleResults ?? [])
    .map(result => ({
      result,
      chapterResult: findSeriesRetentionChapterResult(result, chapterNumber),
    }))
    .filter((entry): entry is {
      result: SeriesRetentionGateSampleResult;
      chapterResult: SeriesRetentionGateChapterResult;
    } => (
      entry.chapterResult !== undefined &&
      latestSeriesRetentionChapter(entry.result) === chapterNumber
    ));

  if (chapterResults.length === 0) {
    return undefined;
  }

  const freshnessIssue = await evaluateReportSourceEvidenceFreshness(
    projectDir,
    reportPath,
    report,
    SERIES_RETENTION_REPORT_EVIDENCE
  );
  if (freshnessIssue) {
    return buildStaleReportReaderResponseGate(freshnessIssue, 'series-retention-source-evidence');
  }

  const usableResults = chapterResults.filter(entry => (
    entry.result.evidenceSufficient === true &&
    entry.chapterResult.evidenceSufficient === true
  ));
  if (usableResults.length === 0) {
    return {
      passed: true,
      score: averageSeriesRetentionScore(chapterResults.map(entry => entry.result)),
      sampleId: chapterResults[0].result.id,
      respondentCount: maxSeriesRetentionRespondents(chapterResults.map(entry => entry.result)),
      reliability: 'weak/series-retention',
      issues: [
        summarizeSeriesRetentionWeakEvidence(chapterResults.map(entry => entry.result)),
      ],
    };
  }

  const blockingResults = usableResults.filter(entry => shouldBlockOnSeriesRetention(entry.result));
  const worst = (blockingResults.length > 0 ? blockingResults : usableResults)
    .slice()
    .sort((a, b) => a.result.readerRetentionScore - b.result.readerRetentionScore)[0];
  const passed = blockingResults.length === 0;

  return {
    passed,
    score: worst.result.readerRetentionScore,
    failureType: passed ? undefined : summarizeSeriesRetentionFailureType(worst.result),
    sampleId: worst.result.id,
    respondentCount: worst.result.responseCount,
    reliability: 'usable/series-retention',
    issues: summarizeSeriesRetentionIssues(worst.result, worst.chapterResult, passed),
    revisionDirectives: summarizeSeriesRetentionDirectives(worst.result, worst.chapterResult),
  };
}

async function evaluateConsistencyReportGateFromProject(
  projectDir: string,
  chapterNumber: number
): Promise<ReaderResponseGateResult | undefined> {
  const reportPath = path.join(projectDir, 'reviews', 'consistency-report.json');
  const report = await readOptionalJson(reportPath) as ConsistencyReport | undefined;
  if (!report) {
    return undefined;
  }

  const freshnessIssue = await evaluateReportSourceEvidenceFreshness(
    projectDir,
    reportPath,
    report,
    CONSISTENCY_REPORT_EVIDENCE
  );
  if (freshnessIssue) {
    return buildStaleReportReaderResponseGate(freshnessIssue, 'long-form-consistency-source-evidence');
  }

  const coverageIssues = summarizeConsistencyCoverageIssues(report, chapterNumber);
  const missingDomains = missingConsistencyDomains(report);
  const relevantIssues = (report.issues ?? []).filter(issue =>
    isConsistencyIssueRelevantToChapter(issue, chapterNumber)
  );
  const blockingIssues = relevantIssues.filter(issue =>
    CONSISTENCY_GATE_BLOCKING_SEVERITIES.has(issue.severity ?? '')
  );
  const failureTypes = summarizeConsistencyFailureTypes(
    coverageIssues,
    missingDomains,
    blockingIssues
  );
  const passed = failureTypes.length === 0;
  const issues = [
    ...coverageIssues,
    ...(
      missingDomains.length > 0
        ? [`consistency-report missing domain coverage: ${missingDomains.join(', ')}`]
        : []
    ),
    ...summarizeConsistencyIssues(blockingIssues.length > 0 ? blockingIssues : relevantIssues),
  ];
  const directives = [
    ...summarizeConsistencyCoverageDirectives(coverageIssues, missingDomains, chapterNumber),
    ...summarizeConsistencyDirectives(blockingIssues),
  ];

  if (passed && issues.length === 0) {
    return {
      passed: true,
      score: 100,
      sampleId: 'consistency-report',
      reliability: 'verified/long-form-consistency',
    };
  }

  return {
    passed,
    score: summarizeConsistencyGateScore(coverageIssues, blockingIssues, missingDomains),
    failureType: passed ? undefined : failureTypes.join(','),
    sampleId: 'consistency-report',
    reliability: 'verified/long-form-consistency',
    issues,
    revisionDirectives: directives.length > 0 ? directives : undefined,
  };
}

function findSeriesRetentionChapterResult(
  result: SeriesRetentionGateSampleResult,
  chapterNumber: number
): SeriesRetentionGateChapterResult | undefined {
  return (result.chapterResults ?? []).find(chapter => chapter.chapter === chapterNumber);
}

function latestSeriesRetentionChapter(result: SeriesRetentionGateSampleResult): number | undefined {
  const chapters = (result.chapterResults ?? []).map(chapter => chapter.chapter);
  return chapters.length > 0 ? Math.max(...chapters) : undefined;
}

function shouldBlockOnSeriesRetention(result: SeriesRetentionGateSampleResult): boolean {
  if (result.readerPassed !== false) {
    return false;
  }

  const failureTypes = seriesRetentionFailureTypes(result);
  if (
    failureTypes.includes('short-sequence') ||
    failureTypes.includes('insufficient-reader-evidence')
  ) {
    return false;
  }

  return failureTypes.some(type => SERIES_RETENTION_BLOCKING_FAILURE_TYPES.has(type));
}

function summarizeSeriesRetentionFailureType(
  result: SeriesRetentionGateSampleResult
): string | undefined {
  const blockingTypes = seriesRetentionFailureTypes(result)
    .filter(type => SERIES_RETENTION_BLOCKING_FAILURE_TYPES.has(type));
  if (blockingTypes.length === 0) {
    return undefined;
  }
  return `series-retention:${blockingTypes.join(',')}`;
}

function summarizeSeriesRetentionWeakEvidence(
  results: SeriesRetentionGateSampleResult[]
): string {
  const sampleIds = results.map(result => result.id).join(', ');
  const failureTypes = uniqueNonEmptyStrings(results.flatMap(result => seriesRetentionFailureTypes(result)));
  return [
    `장기 연재 유지력 샘플(${sampleIds})은 현재 회차까지 포함하지만 evidenceSufficient=true가 아니어서 완료 차단 근거로 쓰지 않습니다.`,
    failureTypes.length > 0 ? `reported failure types: ${failureTypes.join(', ')}` : undefined,
  ]
    .filter((part): part is string => part !== undefined)
    .join(' ');
}

function summarizeSeriesRetentionIssues(
  result: SeriesRetentionGateSampleResult,
  chapterResult: SeriesRetentionGateChapterResult,
  passed: boolean
): string[] {
  const issues: string[] = [];
  if (!passed) {
    issues.push(
      `장기 연재 유지력 샘플 ${result.id}에서 최신 회차 독자 유지가 자동 완료 판정과 충돌했습니다: sequence ${result.readerRetentionScore}점, chapter ${chapterResult.readerRetentionScore}점`
    );
  }
  const failureTypes = seriesRetentionFailureTypes(result);
  if (failureTypes.length > 0) {
    issues.push(`series retention failure types: ${failureTypes.join(', ')}`);
  }
  if (result.retentionDrop !== undefined) {
    issues.push(`series retention drop: ${result.retentionDrop} points`);
  }
  if (result.funnelDropChapterCount !== undefined) {
    issues.push(`series funnel drop chapters: ${result.funnelDropChapterCount}`);
  }
  if (result.hookStallChapterCount !== undefined) {
    issues.push(`series hook stall chapters: ${result.hookStallChapterCount}`);
  }
  if (chapterResult.continuationRate !== undefined) {
    issues.push(`latest chapter continuation rate: ${chapterResult.continuationRate}`);
  }
  if (chapterResult.dropOffRatio !== undefined || chapterResult.skimmedReadRatio !== undefined) {
    issues.push(
      `latest chapter drop/skim ratios: ${stringifyMaybeNumber(chapterResult.dropOffRatio)} / ${stringifyMaybeNumber(chapterResult.skimmedReadRatio)}`
    );
  }
  if (chapterResult.hookProgressRate !== undefined || chapterResult.hookStallRatio !== undefined) {
    issues.push(
      `latest chapter hook progress/stall ratios: ${stringifyMaybeNumber(chapterResult.hookProgressRate)} / ${stringifyMaybeNumber(chapterResult.hookStallRatio)}`
    );
  }
  if (result.repeatedRewardSignatureRun !== undefined) {
    issues.push(`repeated reward signature run: ${result.repeatedRewardSignatureRun}`);
  }
  if (result.repeatedEmotionalSignatureRun !== undefined) {
    issues.push(`repeated emotional signature run: ${result.repeatedEmotionalSignatureRun}`);
  }
  if (result.dominantEmotionalSignatureFamilyShare !== undefined) {
    const family = result.dominantEmotionalSignatureFamily ?? 'unknown';
    issues.push(
      `dominant emotional signature family: ${family} (${result.dominantEmotionalSignatureFamilyShare})`
    );
  }
  const weakDimensions = uniqueNonEmptyStrings([
    ...(result.weakDimensions ?? []),
    ...(chapterResult.weakDimensions ?? []),
  ]);
  if (weakDimensions.length > 0) {
    issues.push(`weak series retention dimensions: ${weakDimensions.join(', ')}`);
  }
  return issues;
}

function summarizeSeriesRetentionDirectives(
  result: SeriesRetentionGateSampleResult,
  chapterResult: SeriesRetentionGateChapterResult
): ReaderResponseGateResult['revisionDirectives'] {
  const directives: NonNullable<ReaderResponseGateResult['revisionDirectives']> = [];
  const latestChapter = chapterResult.chapter;
  const sequenceStart = Math.max(1, latestChapter - Math.max((result.sequenceLength ?? 3) - 1, 0));
  const failureTypes = seriesRetentionFailureTypes(result);

  if (failureTypes.some(type => (
    type === 'automated-false-positive' ||
    type === 'weak-reader-retention' ||
    type === 'reader-retention-drop' ||
    type === 'reader-funnel-drop' ||
    type === 'reader-hook-stall' ||
    type === 'repetitive-emotional-pattern' ||
    type === 'narrow-emotional-palette'
  ))) {
    directives.push({
      dimension: 'series-retention',
      action: `Rewrite chapters ${sequenceStart}-${latestChapter} so the latest chapter changes story state, narrows the active hook hypothesis, or raises a concrete cost before Ralph Loop can continue.`,
      expected: 'target-reader retention and chapter-to-next-chapter continuation remain stable across the sampled sequence',
      actual: `${result.readerRetentionScore} sequence / ${chapterResult.readerRetentionScore} latest chapter`,
    });
  }

  if (failureTypes.includes('narrow-emotional-palette')) {
    directives.push({
      dimension: 'series-retention-emotional-flow',
      action: 'Revise the sampled sequence so chapter endings do not cluster around one dominant affect family; alternate pressure with relief, intimacy, triumph, grief, anger, or reflective calm where the plot earns it.',
      expected: 'long-series endings have varied emotional flow rather than one repeated affective climate',
      actual: [
        `family=${result.dominantEmotionalSignatureFamily ?? 'unknown'}`,
        `share=${stringifyMaybeNumber(result.dominantEmotionalSignatureFamilyShare)}`,
      ].join(', '),
    });
  }

  if (failureTypes.includes('reader-hook-stall')) {
    directives.push({
      dimension: 'series-retention-hook-progress',
      action: 'Revise the latest chapter so at least one active question thread advances, resolves, or recontextualizes before adding any new cliffhanger.',
      expected: 'active hook threads visibly progress and stalled-thread ratio stays within the configured maximum',
      actual: [
        `progress=${stringifyMaybeNumber(chapterResult.hookProgressRate)}`,
        `stall=${stringifyMaybeNumber(chapterResult.hookStallRatio)}`,
      ].join(', '),
    });
  }

  if (failureTypes.includes('reader-funnel-drop')) {
    directives.push({
      dimension: 'series-retention-funnel',
      action: 'Revise the latest chapter so started readers complete it and choose the next installment: reduce skim/drop-off points, make the next concrete question visible, and vary the reward shape before the close.',
      expected: 'started-to-continued reader funnel stays above the configured continuation threshold',
      actual: [
        `continuation=${stringifyMaybeNumber(chapterResult.continuationRate)}`,
        `dropOff=${stringifyMaybeNumber(chapterResult.dropOffRatio)}`,
        `skimmed=${stringifyMaybeNumber(chapterResult.skimmedReadRatio)}`,
      ].join(', '),
    });
  }

  if (failureTypes.includes('repetitive-reward-pattern')) {
    directives.push({
      dimension: 'reward-variety',
      action: 'Break the repeated reward signature with a different promise/payoff mode, relationship consequence, clue type, or irreversible choice.',
      expected: 'reward signature run stays within the configured maximum',
      actual: String(result.repeatedRewardSignatureRun ?? 'unknown'),
    });
  }

  if (failureTypes.includes('repetitive-emotional-pattern')) {
    directives.push({
      dimension: 'emotional-arc-variety',
      action: 'Break the repeated emotional ending rhythm with a different affective movement such as relief, dread, intimacy, awe, grief, comic release, resolve, or costly hope.',
      expected: 'emotional signature run stays within the configured maximum',
      actual: String(result.repeatedEmotionalSignatureRun ?? 'unknown'),
    });
  }

  for (const dimension of uniqueNonEmptyStrings([
    ...(result.weakDimensions ?? []),
    ...(chapterResult.weakDimensions ?? []),
  ]).slice(0, 3)) {
    directives.push({
      dimension,
      action: seriesRetentionDimensionAction(dimension),
      expected: `reader ${dimension} clears the long-series retention threshold`,
      actual: String(chapterResult.readerRetentionScore),
    });
  }

  return directives;
}

function seriesRetentionDimensionAction(dimension: string): string {
  switch (dimension) {
    case 'next_click':
      return 'Make the next chapter desire concrete: unanswered consequence, pressured choice, reveal, or threat must be visible before the close.';
    case 'fatigue_resistance':
      return 'Remove repeated setup/payoff beats and add a new complication, relationship pressure, or viewpoint of the problem.';
    case 'hook_progress':
      return 'Advance the active hook with a new clue, narrowed hypothesis, changed risk, or next verification action instead of restating the question.';
    case 'reward_variety':
      return 'Change the reward mode rather than repeating the same alert, chase, reveal, confession, or reversal shape.';
    case 'payoff_satisfaction':
      return 'Pay off at least one promised beat with visible consequence before opening the next loop.';
    case 'novelty':
      return 'Add a fresh image, tactic, setting use, social move, or contradiction that could not appear in the previous chapter.';
    case 'emotional_reset':
      return 'Shift the emotional rhythm with a recovery, loss, intimacy, humiliation, relief, or new fear after the plot beat lands.';
    case 'confidence_in_payoff':
      return 'Show evidence that the long hook is converging, not stretching: mark what readers learned and what narrows next.';
    default:
      return 'Revise the current sequence against target-reader retention comments and rerun the series retention benchmark.';
  }
}

function seriesRetentionFailureTypes(result: SeriesRetentionGateSampleResult): string[] {
  return uniqueNonEmptyStrings([
    ...(result.failureTypes ?? []),
    result.failureType,
  ]);
}

function averageSeriesRetentionScore(results: SeriesRetentionGateSampleResult[]): number {
  if (results.length === 0) return 0;
  return Math.round(
    results.reduce((sum, result) => sum + result.readerRetentionScore, 0) / results.length
  );
}

function maxSeriesRetentionRespondents(
  results: SeriesRetentionGateSampleResult[]
): number | undefined {
  const counts = results
    .map(result => result.responseCount)
    .filter((count): count is number => count !== undefined);
  return counts.length > 0 ? Math.max(...counts) : undefined;
}

function summarizeConsistencyCoverageIssues(
  report: ConsistencyReport,
  chapterNumber: number
): string[] {
  const issues: string[] = [];
  const range = report.chapter_range;
  const rangeStart = range?.start;
  const rangeEnd = range?.end;
  const hasValidRange =
    Number.isInteger(rangeStart) &&
    Number.isInteger(rangeEnd) &&
    (rangeStart as number) >= 1 &&
    (rangeEnd as number) >= (rangeStart as number);

  if (!hasValidRange) {
    issues.push('consistency-report chapter_range is missing or invalid for the current gate.');
  } else if ((rangeEnd as number) < chapterNumber) {
    issues.push(
      `consistency-report is stale for chapter ${chapterNumber}: only covers chapters ${rangeStart}-${rangeEnd}.`
    );
  } else if ((rangeStart as number) > chapterNumber) {
    issues.push(
      `consistency-report does not cover chapter ${chapterNumber}: starts at chapter ${rangeStart}.`
    );
  }

  const analyzed = normalizedConsistencyChaptersAnalyzed(report);
  if (
    analyzed.length > 0 &&
    !analyzed.includes(chapterNumber) &&
    !issues.some(issue => issue.includes('stale'))
  ) {
    issues.push(
      `consistency-report chapters_analyzed does not include chapter ${chapterNumber}.`
    );
  }

  return issues;
}

function normalizedConsistencyChaptersAnalyzed(report: ConsistencyReport): number[] {
  return (report.chapters_analyzed ?? [])
    .filter(chapter => Number.isInteger(chapter) && chapter > 0);
}

function missingConsistencyDomains(report: ConsistencyReport): ConsistencyGateDomain[] {
  return CONSISTENCY_GATE_DOMAINS.filter(domain => report.domain_coverage?.[domain] !== true);
}

function isConsistencyIssueRelevantToChapter(
  issue: ConsistencyReportIssue,
  chapterNumber: number
): boolean {
  const issueChapter = issue.location?.chapter;
  return !Number.isInteger(issueChapter) || (issueChapter as number) <= chapterNumber;
}

function summarizeConsistencyFailureTypes(
  coverageIssues: string[],
  missingDomains: ConsistencyGateDomain[],
  blockingIssues: ConsistencyReportIssue[]
): string[] {
  const types: string[] = [];
  if (coverageIssues.some(issue => issue.includes('stale'))) {
    types.push('consistency-report-stale-range');
  }
  if (coverageIssues.some(issue => issue.includes('does not cover') || issue.includes('chapters_analyzed'))) {
    types.push('consistency-report-missing-current-chapter');
  }
  if (coverageIssues.some(issue => issue.includes('missing or invalid'))) {
    types.push('consistency-report-invalid-range');
  }
  if (missingDomains.length > 0) {
    types.push('consistency-report-domain-coverage');
  }
  const severities = uniqueNonEmptyStrings(blockingIssues.map(issue => issue.severity));
  if (severities.includes('critical')) {
    types.push('consistency-report-critical');
  }
  if (severities.includes('major')) {
    types.push('consistency-report-major');
  }
  if (severities.includes('minor')) {
    types.push('consistency-report-minor');
  }
  return types;
}

function summarizeConsistencyGateScore(
  coverageIssues: string[],
  blockingIssues: ConsistencyReportIssue[],
  missingDomains: ConsistencyGateDomain[]
): number {
  const severities = new Set(blockingIssues.map(issue => issue.severity));
  if (severities.has('critical')) return 40;
  if (coverageIssues.some(issue => issue.includes('stale'))) return 55;
  if (severities.has('major')) return 60;
  if (coverageIssues.length > 0 || missingDomains.length > 0) return 65;
  if (severities.has('minor')) return 75;
  return 100;
}

function summarizeConsistencyIssues(issues: ConsistencyReportIssue[]): string[] {
  return issues.slice(0, 5).map(issue => {
    const location = formatConsistencyIssueLocation(issue);
    const severity = issue.severity ? ` (${issue.severity})` : '';
    const type = issue.type ? `${issue.type}: ` : '';
    return `long-form consistency ${location}${type}${issue.description ?? 'unresolved issue'}${severity}`;
  });
}

function summarizeConsistencyCoverageDirectives(
  coverageIssues: string[],
  missingDomains: ConsistencyGateDomain[],
  chapterNumber: number
): NonNullable<ReaderResponseGateResult['revisionDirectives']> {
  const directives: NonNullable<ReaderResponseGateResult['revisionDirectives']> = [];
  if (coverageIssues.length > 0) {
    directives.push({
      dimension: 'long-form-consistency',
      action: `Rerun consistency-verifier over chapter ${chapterNumber} and all prior canonical sources before approving this chapter.`,
      expected: `consistency-report covers chapter ${chapterNumber}`,
      actual: coverageIssues.join(' '),
    });
  }
  if (missingDomains.length > 0) {
    directives.push({
      dimension: 'long-form-consistency-domain-coverage',
      action: `Rerun consistency-verifier with coverage for: ${missingDomains.join(', ')}.`,
      expected: 'character, timeline, setting, factual, and plot_logic coverage are all true',
      actual: `missing ${missingDomains.join(', ')}`,
    });
  }
  return directives;
}

function summarizeConsistencyDirectives(
  issues: ConsistencyReportIssue[]
): NonNullable<ReaderResponseGateResult['revisionDirectives']> {
  return issues.slice(0, 5).map(issue => ({
    dimension: `long-form-consistency:${issue.type ?? issue.severity ?? 'issue'}`,
    action: buildConsistencyIssueAction(issue),
    expected: summarizeConsistencyExpected(issue),
    actual: summarizeConsistencyActual(issue),
  }));
}

function buildConsistencyIssueAction(issue: ConsistencyReportIssue): string {
  const location = formatConsistencyIssueLocation(issue);
  const suggestion = issue.suggestion ? ` Fix: ${issue.suggestion}` : '';
  return `Resolve ${issue.severity ?? 'unresolved'} consistency issue ${location}${issue.description ?? ''}.${suggestion}`;
}

function summarizeConsistencyExpected(issue: ConsistencyReportIssue): string {
  const reference = issue.references?.find(ref => ref.expected);
  return reference?.expected ?? 'current chapter remains consistent with established canon';
}

function summarizeConsistencyActual(issue: ConsistencyReportIssue): string {
  const reference = issue.references?.find(ref => ref.found);
  return reference?.found ?? issue.description ?? 'unresolved consistency issue';
}

function formatConsistencyIssueLocation(issue: ConsistencyReportIssue): string {
  const parts: string[] = [];
  if (Number.isInteger(issue.location?.chapter)) {
    parts.push(`chapter ${issue.location?.chapter}`);
  }
  if (Number.isInteger(issue.location?.scene)) {
    parts.push(`scene ${issue.location?.scene}`);
  }
  if (issue.location?.context) {
    parts.push(issue.location.context);
  }
  return parts.length > 0 ? `[${parts.join(', ')}] ` : '';
}

function uniqueNonEmptyStrings(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => (
    typeof value === 'string' && value.length > 0
  )))];
}

function uniqueReaderResponseResults(
  results: ReaderResponseCalibrationSampleResult[]
): ReaderResponseCalibrationSampleResult[] {
  const seen = new Set<string>();
  return results.filter(result => {
    const key = result.id;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function stringifyMaybeNumber(value: number | undefined): string {
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : 'unknown';
}

function summarizeReaderResponseWeakEvidence(
  results: ReaderResponseCalibrationSampleResult[]
): string {
  const hasUsableRespondents = results.some(result => result.reliability === 'usable');
  if (!hasUsableRespondents) {
    return '독자 반응 샘플은 있으나 respondent_count가 부족해 완료 차단 근거로 쓰지 않습니다.';
  }

  const weakest = results
    .slice()
    .sort((a, b) => (a.actionabilityScore ?? 0) - (b.actionabilityScore ?? 0))[0];
  const trustIssues = results.flatMap(result => summarizeReaderResponseTrustIssues(result)).slice(0, 4);
  if (trustIssues.length > 0) {
    return `독자 반응 샘플은 있으나 ${trustIssues.join(', ')}라 완료 차단 근거로 쓰지 않습니다.`;
  }

  const evidenceIssues = (weakest.evidenceIssues ?? []).slice(0, 2).join(' ');
  return `독자 반응 샘플은 있으나 evidenceQuality=${weakest.evidenceQuality ?? 'unknown'}라 완료 차단 근거로 쓰지 않습니다.${evidenceIssues ? ` ${evidenceIssues}` : ''}`;
}

function summarizeReaderResponseReliability(
  result: ReaderResponseCalibrationSampleResult
): string {
  if (result.evidenceQuality === undefined) return result.reliability;
  return `${result.reliability}/${result.evidenceQuality}`;
}

function isUsableReaderResponseGateSample(
  result: ReaderResponseCalibrationSampleResult
): boolean {
  return isTrustworthyReaderResponseGateSample(result) &&
    (result.evidenceQuality === undefined || result.evidenceQuality === 'usable') &&
    (result.annotationReliability === undefined || result.annotationReliability === 'usable') &&
    (result.frictionAnnotationCoverage === undefined ||
      result.frictionAnnotationCoverage === 'none' ||
      result.frictionAnnotationCoverage === 'covered') &&
    (result.frictionAnnotationRepresentativeness === undefined ||
      result.frictionAnnotationRepresentativeness === 'balanced') &&
    (result.durableEngagementEvidence === undefined || result.durableEngagementEvidence === 'usable') &&
    (result.continuationBehaviorEvidence === undefined || result.continuationBehaviorEvidence === 'usable') &&
    (result.resonanceEvidence === undefined || result.resonanceEvidence === 'usable');
}

function isTrustworthyReaderResponseGateSample(
  result: ReaderResponseCalibrationSampleResult
): boolean {
  return result.reliability === 'usable' &&
    (result.humanReaderEvidence === undefined || result.humanReaderEvidence === 'usable') &&
    (result.responseDataQuality === undefined || result.responseDataQuality === 'usable') &&
    (result.panelConsensus === undefined || result.panelConsensus === 'clear') &&
    (result.readerScoreConfidence === undefined || result.readerScoreConfidence === 'precise') &&
    (result.cohortRepresentativeness === undefined || result.cohortRepresentativeness === 'balanced') &&
    (result.panelProtocolQuality === undefined || result.panelProtocolQuality === 'strong');
}

function summarizeReaderResponseTrustIssues(
  result: ReaderResponseCalibrationSampleResult
): string[] {
  const issues: string[] = [];
  if (result.humanReaderEvidence !== undefined && result.humanReaderEvidence !== 'usable') {
    issues.push(`humanReaderEvidence=${result.humanReaderEvidence}`);
  }
  if (result.responseDataQuality !== undefined && result.responseDataQuality !== 'usable') {
    issues.push(`responseDataQuality=${result.responseDataQuality}`);
  }
  if (result.evidenceQuality !== undefined && result.evidenceQuality !== 'usable') {
    issues.push(`evidenceQuality=${result.evidenceQuality}`);
  }
  if (result.panelConsensus !== undefined && result.panelConsensus !== 'clear') {
    issues.push(`panelConsensus=${result.panelConsensus}`);
  }
  if (result.readerScoreConfidence !== undefined && result.readerScoreConfidence !== 'precise') {
    issues.push(
      `readerScoreConfidence=${result.readerScoreConfidence}${result.readerScoreMarginOfError !== undefined
        ? `, marginOfError=${result.readerScoreMarginOfError}`
        : ''}`
    );
  }
  if (result.cohortRepresentativeness !== undefined && result.cohortRepresentativeness !== 'balanced') {
    issues.push(`cohortRepresentativeness=${result.cohortRepresentativeness}`);
  }
  if (result.panelProtocolQuality !== undefined && result.panelProtocolQuality !== 'strong') {
    issues.push(`panelProtocolQuality=${result.panelProtocolQuality}`);
  }
  if (result.annotationReliability !== undefined && result.annotationReliability !== 'usable') {
    issues.push(`annotationReliability=${result.annotationReliability}`);
  }
  if (result.durableEngagementEvidence !== undefined && result.durableEngagementEvidence !== 'usable') {
    issues.push(`durableEngagementEvidence=${result.durableEngagementEvidence}`);
  }
  if (
    result.continuationBehaviorEvidence !== undefined &&
    result.continuationBehaviorEvidence !== 'usable'
  ) {
    issues.push(`continuationBehaviorEvidence=${result.continuationBehaviorEvidence}`);
  }
  if (result.resonanceEvidence !== undefined && result.resonanceEvidence !== 'usable') {
    issues.push(`resonanceEvidence=${result.resonanceEvidence}`);
  }
  if (result.delayedMemoryEvidence !== undefined && result.delayedMemoryEvidence !== 'usable') {
    issues.push(`delayedMemoryEvidence=${result.delayedMemoryEvidence}`);
  }
  if (
    result.revisionOutcomeEvidence !== undefined &&
    result.revisionOutcomeEvidence !== 'none' &&
    result.revisionOutcomeEvidence !== 'improved'
  ) {
    issues.push(`revisionOutcomeEvidence=${result.revisionOutcomeEvidence}`);
  }
  if (
    result.frictionAnnotationCoverage !== undefined &&
    result.frictionAnnotationCoverage !== 'none' &&
    result.frictionAnnotationCoverage !== 'covered'
  ) {
    issues.push(`frictionAnnotationCoverage=${result.frictionAnnotationCoverage}`);
  }
  if (
    result.frictionAnnotationRepresentativeness !== undefined &&
    result.frictionAnnotationRepresentativeness !== 'balanced'
  ) {
    issues.push(`frictionAnnotationRepresentativeness=${result.frictionAnnotationRepresentativeness}`);
  }
  issues.push(...(result.evidenceIssues ?? []).slice(0, 2));
  issues.push(...(result.frictionAnnotationCoverageIssues ?? []).slice(0, 1));
  issues.push(...(result.frictionAnnotationRepresentativenessIssues ?? []).slice(0, 1));
  issues.push(...(result.humanReaderEvidenceIssues ?? []).slice(0, 1));
  issues.push(...(result.responseDataQualityIssues ?? []).slice(0, 1));
  issues.push(...(result.panelConsensusIssues ?? []).slice(0, 1));
  issues.push(...(result.readerScoreConfidenceIssues ?? []).slice(0, 1));
  issues.push(...(result.cohortRepresentativenessIssues ?? []).slice(0, 1));
  issues.push(...(result.panelProtocolQualityIssues ?? []).slice(0, 1));
  issues.push(...(result.annotationReliabilityIssues ?? []).slice(0, 1));
  issues.push(...(result.durableEngagementEvidenceIssues ?? []).slice(0, 1));
  issues.push(...(result.continuationBehaviorEvidenceIssues ?? []).slice(0, 1));
  issues.push(...(result.resonanceEvidenceIssues ?? []).slice(0, 1));
  issues.push(...(result.delayedMemoryEvidenceIssues ?? []).slice(0, 1));
  issues.push(...(result.revisionOutcomeIssues ?? []).slice(0, 2));
  return issues;
}

function shouldBlockOnReaderResponse(
  result: ReaderResponseCalibrationSampleResult
): boolean {
  if (shouldBlockOnReaderResponseContinuationBehavior(result)) {
    return true;
  }

  if (result.failureType === 'auto-false-positive' || result.failureType === 'auto-overestimate') {
    return true;
  }

  if (result.revisionOutcomeEvidence === 'regressed') {
    return true;
  }

  return (result.dimensionIssues ?? []).some(issue => (
    issue.dimension === 'next-click' && issue.score < issue.threshold
  ));
}

function shouldBlockOnReaderResponseContinuationBehavior(
  result: ReaderResponseCalibrationSampleResult
): boolean {
  return isTrustworthyReaderResponseGateSample(result) &&
    result.continuationBehaviorEvidence === 'weak' &&
    hasActualContinuationBehaviorCounts(result);
}

function hasActualContinuationBehaviorCounts(
  result: ReaderResponseCalibrationSampleResult
): boolean {
  return typeof result.nextChapterCtaImpressionCount === 'number' ||
    typeof result.nextChapterClickCount === 'number' ||
    typeof result.nextChapterOpenCount === 'number' ||
    typeof result.nextChapterReadStartCount === 'number';
}

function summarizeReaderResponseFailureType(
  result: ReaderResponseCalibrationSampleResult,
  passed: boolean
): string | undefined {
  if (passed) {
    return undefined;
  }

  if (result.revisionOutcomeEvidence === 'regressed') {
    return uniqueNonEmptyStrings([result.failureType, 'revision-regression']).join('+');
  }

  if (shouldBlockOnReaderResponseContinuationBehavior(result)) {
    return uniqueNonEmptyStrings([result.failureType, 'continuation-behavior-drop']).join('+');
  }

  return result.failureType;
}

function summarizeReaderResponseIssues(
  result: ReaderResponseCalibrationSampleResult,
  passed: boolean
): string[] {
  const issues: string[] = [];
  if (!passed) {
    issues.push(
      `독자 패널 샘플 ${result.id}에서 자동 점수와 독자 반응이 어긋났습니다: ${result.readerCompositeScore}점`
    );
  }
  if (result.failureType) {
    issues.push(`reader-response failure type: ${result.failureType}`);
  }
  if (result.revisionOutcomeEvidence && result.revisionOutcomeEvidence !== 'none') {
    issues.push(
      `revisionOutcomeEvidence=${result.revisionOutcomeEvidence}; ${summarizeReaderRevisionOutcomeActual(result)}`
    );
  }
  if (result.continuationBehaviorEvidence && result.continuationBehaviorEvidence !== 'usable') {
    issues.push(
      `continuationBehaviorEvidence=${result.continuationBehaviorEvidence}; ${summarizeActualContinuationBehavior(result)}`
    );
  }
  issues.push(...(result.revisionOutcomeIssues ?? []).slice(0, 3));
  issues.push(...(result.continuationBehaviorEvidenceIssues ?? []).slice(0, 3));
  for (const issue of result.dimensionIssues ?? []) {
    issues.push(`${issue.dimension}: ${issue.score}/${issue.threshold} - ${issue.message}`);
  }
  for (const annotation of (result.frictionAnnotations ?? []).slice(0, 3)) {
    const location = annotation.location ? `${annotation.location}: ` : '';
    const dimension = annotation.dimension ? `${annotation.dimension}: ` : '';
    const severity = annotation.severity ? ` (${annotation.severity})` : '';
    const segment = annotation.readerSegment ? ` [${annotation.readerSegment}]` : '';
    issues.push(`reader friction ${location}${dimension}${annotation.reason}${severity}${segment}`);
  }
  for (const annotation of (result.dropOffAnnotations ?? []).slice(0, 3)) {
    const location = annotation.location ? `${annotation.location}: ` : '';
    const eventType = annotation.eventType ? `${annotation.eventType}: ` : '';
    const segment = annotation.readerSegment ? ` [${annotation.readerSegment}]` : '';
    issues.push(`reader drop-off ${location}${eventType}${annotation.reason}${segment}`);
  }
  issues.push(...(result.dropOffLocalizationEvidenceIssues ?? []).slice(0, 3));
  return issues;
}

function summarizeReaderResponseDirectives(
  result: ReaderResponseCalibrationSampleResult
): ReaderResponseGateResult['revisionDirectives'] {
  const revisionOutcomeDirectives = result.revisionOutcomeEvidence === 'regressed'
    ? [{
      dimension: 'revision-outcome',
      action: buildReaderRevisionOutcomeAction(result),
      expected: 'the revised manuscript beats its baseline reader score or blind before/after preference without guardrail regressions',
      actual: summarizeReaderRevisionOutcomeActual(result),
    }]
    : [];

  const actualContinuationBehaviorDirectives = shouldBlockOnReaderResponseContinuationBehavior(result)
    ? [{
      dimension: 'actual-continuation-behavior',
      action: 'Rewrite the chapter ending and next-chapter bridge so the final beat creates an immediate concrete reason to click, open, and start the next chapter; then rerun the reader behavior check.',
      expected: 'actual next-chapter click, open, and read-start ratios meet calibrated thresholds',
      actual: summarizeActualContinuationBehavior(result),
    }]
    : [];

  const annotationDirectives = (result.frictionAnnotations ?? [])
    .filter(isActionableReaderFrictionAnnotation)
    .slice(0, 3)
    .map(annotation => ({
      dimension: annotation.dimension ?? 'reader-friction',
      action: buildReaderFrictionAction(annotation),
      expected: 'reader annotated friction is resolved at the cited location',
      actual: annotation.reason,
    }));

  const dropOffDirectives = (result.dropOffAnnotations ?? [])
    .filter(isActionableReaderDropOffAnnotation)
    .slice(0, 3)
    .map(annotation => ({
      dimension: annotation.eventType ? `drop-off:${annotation.eventType}` : 'drop-off-localization',
      action: buildReaderDropOffAction(annotation),
      expected: 'reader drop-off or skimming trigger is resolved at the cited location',
      actual: annotation.reason,
    }));

  const dimensionDirectives = (result.dimensionIssues ?? [])
    .slice(0, 5)
    .map(issue => ({
      dimension: issue.dimension,
      action: readerResponseDimensionAction(issue.dimension),
      expected: `reader ${issue.dimension} >= ${issue.threshold}`,
      actual: String(issue.score),
    }));

  return [
    ...revisionOutcomeDirectives,
    ...actualContinuationBehaviorDirectives,
    ...dropOffDirectives,
    ...annotationDirectives,
    ...dimensionDirectives,
  ].slice(0, 5);
}

function summarizeActualContinuationBehavior(result: ReaderResponseCalibrationSampleResult): string {
  const parts = [
    `impressions=${stringifyMaybeNumber(result.nextChapterCtaImpressionCount)}`,
    `clicks=${stringifyMaybeNumber(result.nextChapterClickCount)}`,
    `opens=${stringifyMaybeNumber(result.nextChapterOpenCount)}`,
    `readStarts=${stringifyMaybeNumber(result.nextChapterReadStartCount)}`,
    `clickThrough=${formatRatioPercent(result.nextChapterClickThroughRatio)}`,
    `open=${formatRatioPercent(result.nextChapterOpenRatio)}`,
    `readStart=${formatRatioPercent(result.nextChapterReadStartRatio)}`,
  ];
  return parts.join('; ');
}

function formatRatioPercent(value: number | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'unknown';
  }
  return `${Math.round(value * 1000) / 10}%`;
}

function buildReaderRevisionOutcomeAction(result: ReaderResponseCalibrationSampleResult): string {
  const pair = result.revisionPairId ? ` ${result.revisionPairId}` : '';
  return `Stop approving revision${pair}; compare the revised draft against its baseline, restore stronger baseline choices where readers preferred them, and rewrite only the changes that caused lower reader score, lower blind preference, or guardrail regression before rerunning the reader panel.`;
}

function summarizeReaderRevisionOutcomeActual(result: ReaderResponseCalibrationSampleResult): string {
  const parts = [
    result.revisionPairId ? `pair=${result.revisionPairId}` : undefined,
    result.revisionBaselineReaderScore !== undefined
      ? `baseline=${result.revisionBaselineReaderScore}`
      : undefined,
    result.revisionCurrentReaderScore !== undefined
      ? `revised=${result.revisionCurrentReaderScore}`
      : undefined,
    result.revisionLift !== undefined ? `lift=${result.revisionLift}` : undefined,
    result.revisionPreferenceWinRate !== undefined
      ? `preferenceWinRate=${result.revisionPreferenceWinRate}`
      : undefined,
    result.revisionPreferenceRespondentCount !== undefined
      ? `preferenceRespondents=${result.revisionPreferenceRespondentCount}`
      : undefined,
    result.revisionGuardrailRegressionCount !== undefined
      ? `guardrailRegressions=${result.revisionGuardrailRegressionCount}`
      : undefined,
  ].filter((part): part is string => part !== undefined);

  return parts.length > 0 ? parts.join('; ') : 'revision outcome regressed against baseline';
}

function isActionableReaderFrictionAnnotation(
  annotation: ReaderResponseGateFrictionAnnotation
): boolean {
  return typeof annotation.reason === 'string' &&
    annotation.reason.trim().length > 0 &&
    typeof annotation.location === 'string' &&
    annotation.location.trim().length > 0 &&
    typeof annotation.rewriteSuggestion === 'string' &&
    annotation.rewriteSuggestion.trim().length > 0;
}

function buildReaderFrictionAction(annotation: ReaderResponseGateFrictionAnnotation): string {
  const location = annotation.location ? `${annotation.location}: ` : '';
  const quote = annotation.quote ? ` Reader quote: ${annotation.quote}` : '';
  const readerCount = annotation.readerCount !== undefined ? ` (${annotation.readerCount} readers)` : '';
  const readerSegment = annotation.readerSegment ? ` [segment: ${annotation.readerSegment}]` : '';
  const suggestion = annotation.rewriteSuggestion ? ` Rewrite: ${annotation.rewriteSuggestion}` : '';
  return `${location}${annotation.reason}${readerCount}${readerSegment}.${quote}${suggestion}`;
}

function isActionableReaderDropOffAnnotation(
  annotation: ReaderResponseGateDropOffAnnotation
): boolean {
  return typeof annotation.reason === 'string' &&
    annotation.reason.trim().length > 0 &&
    typeof annotation.location === 'string' &&
    annotation.location.trim().length > 0 &&
    typeof annotation.suggestedRevision === 'string' &&
    annotation.suggestedRevision.trim().length > 0;
}

function buildReaderDropOffAction(annotation: ReaderResponseGateDropOffAnnotation): string {
  const location = annotation.location ? `${annotation.location}: ` : '';
  const eventType = annotation.eventType ? `[${annotation.eventType}] ` : '';
  const readerCount = annotation.readerCount !== undefined ? ` (${annotation.readerCount} readers)` : '';
  const readerSegment = annotation.readerSegment ? ` [segment: ${annotation.readerSegment}]` : '';
  const lastCompleted = annotation.lastCompletedLocation
    ? ` Last completed: ${annotation.lastCompletedLocation}.`
    : '';
  const trigger = annotation.triggerQuote ? ` Trigger: ${annotation.triggerQuote}` : '';
  const suggestion = annotation.suggestedRevision ? ` Rewrite: ${annotation.suggestedRevision}` : '';
  return `${location}${eventType}${annotation.reason}${readerCount}${readerSegment}.${lastCompleted}${trigger}${suggestion}`;
}

function readerResponseDimensionAction(dimension: string): string {
  switch (dimension) {
    case 'next-click':
      return 'Rewrite the final open loop so readers want the next chapter: add a concrete unanswered consequence, choice, reveal, or threat.';
    case 'attention':
      return 'Remove explanatory slack and make the scene objective, obstacle, and changed state visible on page.';
    case 'emotional-engagement':
      return 'Put a concrete desire, relationship, or failure cost before the plot mechanism pays off.';
    case 'mental-imagery':
      return 'Strengthen visible objects, spatial blocking, and concrete action readers can picture.';
    case 'transportation':
      return 'Remove meta-design language and keep the reader inside scene-native cause and consequence.';
    case 'resonance':
      return 'Add a lasting emotional aftertaste: a consequence, image, reflective question, or character cost that remains after the scene ends.';
    case 'bookmark-intent':
      return 'Make the chapter worth saving: leave a concrete promise, consequence, or reward route readers want to return to.';
    case 'return-intent':
      return 'Close on a delayed-payoff obligation: a narrowed question, scheduled confrontation, irreversible choice, or next-scene action.';
    case 'purchase-intent':
      return 'Raise the continuation value with a consequential reveal, emotional turn, or genre reward strong enough to justify paid unlock attention.';
    case 'binge-intent':
      return 'Link the closing beat to an immediate next action or shorter uncertainty loop so readers want another chapter now.';
    case 'interest':
      return 'Sharpen the central question with a specific clue, contradiction, or impossible choice.';
    case 'suspense':
      return 'Escalate credible risk, narrow time, or remove a safe option before resolving the scene.';
    default:
      return 'Revise the chapter against reader-panel comments and recalibrate before final completion.';
  }
}

function averageReaderResponseScore(
  results: ReaderResponseCalibrationSampleResult[]
): number {
  if (results.length === 0) return 0;
  return Math.round(
    results.reduce((sum, result) => sum + result.readerCompositeScore, 0) / results.length
  );
}

async function readProseTasteProfile(
  projectDir: string
): Promise<ProseTasteProfile | undefined> {
  const styleGuidePath = path.join(projectDir, 'meta', 'style-guide.json');

  try {
    const styleGuide = JSON.parse(await fs.readFile(styleGuidePath, 'utf8')) as StyleGuideWithTasteProfile;
    const profile = styleGuide.prose_taste_profile;
    if (!profile) return undefined;

    return {
      preferredMode: profile.preferred_mode,
      dislikedPhrases: profile.disliked_phrases,
      minimumScore: profile.minimum_score,
      maxSensoryDensityPer1000: profile.max_sensory_density_per_1000,
      maxEmbodiedReactionDensityPer1000: profile.max_embodied_reaction_density_per_1000,
      maxBodyReactionSubjectDensityPer1000:
        profile.max_body_reaction_subject_density_per_1000,
      maxBodyReactionSubjectRun: profile.max_body_reaction_subject_run,
      maxClicheEmotionImageDensityPer1000:
        profile.max_cliche_emotion_image_density_per_1000,
      maxClicheEmotionImageRun: profile.max_cliche_emotion_image_run,
      maxSymbolicAbstractionDensityPer1000:
        profile.max_symbolic_abstraction_density_per_1000,
      maxSymbolicAbstractionRun: profile.max_symbolic_abstraction_run,
      maxMetaphorDensityPer1000: profile.max_metaphor_density_per_1000,
      maxSensoryWallpaperRun: profile.max_sensory_wallpaper_run,
      maxEmotionLabelDensityPer1000: profile.max_emotion_label_density_per_1000,
      maxEmotionLabelRun: profile.max_emotion_label_run,
      maxHedgedPerceptionDensityPer1000: profile.max_hedged_perception_density_per_1000,
      maxAbstractNounDensityPer1000: profile.max_abstract_noun_density_per_1000,
      maxCognitiveFilterDensityPer1000: profile.max_cognitive_filter_density_per_1000,
      maxTherapySpeakDensityPer1000: profile.max_therapy_speak_density_per_1000,
      maxTherapySpeakRun: profile.max_therapy_speak_run,
      maxBackstoryExpositionDensityPer1000:
        profile.max_backstory_exposition_density_per_1000,
      maxBackstoryExpositionRun: profile.max_backstory_exposition_run,
      maxRelationshipMontageSummaryDensityPer1000:
        profile.max_relationship_montage_summary_density_per_1000,
      maxRelationshipMontageSummaryRun:
        profile.max_relationship_montage_summary_run,
      maxTimeSkipSummaryDensityPer1000:
        profile.max_time_skip_summary_density_per_1000,
      maxTimeSkipSummaryRun: profile.max_time_skip_summary_run,
      maxContrastiveReframeDensityPer1000:
        profile.max_contrastive_reframe_density_per_1000,
      maxContrastiveReframeRun: profile.max_contrastive_reframe_run,
      maxLoreTermDensityPer1000: profile.max_lore_term_density_per_1000,
      maxLoreTermRun: profile.max_lore_term_run,
      maxSystemStatBlockDensityPer1000:
        profile.max_system_stat_block_density_per_1000,
      maxSystemStatBlockRun: profile.max_system_stat_block_run,
      maxDeclaredResolveDensityPer1000:
        profile.max_declared_resolve_density_per_1000,
      maxDeclaredResolveRun: profile.max_declared_resolve_run,
      maxRevelationSummaryDensityPer1000:
        profile.max_revelation_summary_density_per_1000,
      maxRevelationSummaryRun: profile.max_revelation_summary_run,
      maxProceduralChecklistDensityPer1000:
        profile.max_procedural_checklist_density_per_1000,
      maxProceduralChecklistRun: profile.max_procedural_checklist_run,
      maxActionChoreographyDensityPer1000:
        profile.max_action_choreography_density_per_1000,
      maxActionChoreographyRun: profile.max_action_choreography_run,
      maxNominalizedExplanationDensityPer1000: profile.max_nominalized_explanation_density_per_1000,
      maxTranslationeseFormulaDensityPer1000: profile.max_translationese_formula_density_per_1000,
      maxConnectiveStarterDensityPer1000: profile.max_connective_starter_density_per_1000,
      maxFillerAdverbDensityPer1000: profile.max_filler_adverb_density_per_1000,
      maxFillerAdverbRun: profile.max_filler_adverb_run,
      maxSimultaneousActionDensityPer1000:
        profile.max_simultaneous_action_density_per_1000,
      maxSimultaneousActionRun: profile.max_simultaneous_action_run,
      maxStatusQuoActionDensityPer1000: profile.max_status_quo_action_density_per_1000,
      maxStatusQuoActionRun: profile.max_status_quo_action_run,
      maxGazeChoreographyDensityPer1000: profile.max_gaze_choreography_density_per_1000,
      maxGazeChoreographyRun: profile.max_gaze_choreography_run,
      minCausalTurnDensityPer1000: profile.min_causal_turn_density_per_1000,
      maxCommaDensityPer1000: profile.max_comma_density_per_1000,
      maxReportingTailDensityPer1000: profile.max_reporting_tail_density_per_1000,
      maxEmphasisPunctuationDensityPer1000: profile.max_emphasis_punctuation_density_per_1000,
      maxEmphasisPunctuationRun: profile.max_emphasis_punctuation_run,
      maxStaticDescriptionDensityPer1000: profile.max_static_description_density_per_1000,
      maxGenericTeaserDensityPer1000: profile.max_generic_teaser_density_per_1000,
      maxThinCliffhangerEndingCount: profile.max_thin_cliffhanger_ending_count,
      maxPovMindJumpDensityPer1000: profile.max_pov_mind_jump_density_per_1000,
      maxPovMindJumpRun: profile.max_pov_mind_jump_run,
      maxExpositoryDialogueRatio: profile.max_expository_dialogue_ratio,
      maxDialogueTurnLength: profile.max_dialogue_turn_length,
      maxAverageDialogueTurnLength: profile.max_average_dialogue_turn_length,
      maxDialogueGroundingGapRun: profile.max_dialogue_grounding_gap_run,
      maxDialogueQuestionRatio: profile.max_dialogue_question_ratio,
      maxDialogueQuestionRun: profile.max_dialogue_question_run,
      maxDialogueVocativeRatio: profile.max_dialogue_vocative_ratio,
      maxDialogueVocativeRun: profile.max_dialogue_vocative_run,
      maxDialogueLexicalEchoRatio: profile.max_dialogue_lexical_echo_ratio,
      maxDialogueLexicalEchoRun: profile.max_dialogue_lexical_echo_run,
      maxDialogueParaphraseConfirmationRatio:
        profile.max_dialogue_paraphrase_confirmation_ratio,
      maxDialogueParaphraseConfirmationRun:
        profile.max_dialogue_paraphrase_confirmation_run,
      maxRoteDialogueReplyRatio: profile.max_rote_dialogue_reply_ratio,
      maxRoteDialogueReplyRun: profile.max_rote_dialogue_reply_run,
      maxNeutralDialogueTagRatio: profile.max_neutral_dialogue_tag_ratio,
      maxNeutralDialogueTagRun: profile.max_neutral_dialogue_tag_run,
      maxSilenceStallDensityPer1000: profile.max_silence_stall_density_per_1000,
      maxSilenceStallRun: profile.max_silence_stall_run,
      maxMelodramaticCaptionDensityPer1000: profile.max_melodramatic_caption_density_per_1000,
      maxMelodramaticCaptionRun: profile.max_melodramatic_caption_run,
      maxStockReactionBeatDensityPer1000: profile.max_stock_reaction_beat_density_per_1000,
      maxStockReactionBeatRun: profile.max_stock_reaction_beat_run,
      maxPropFidgetBeatDensityPer1000: profile.max_prop_fidget_beat_density_per_1000,
      maxPropFidgetBeatRun: profile.max_prop_fidget_beat_run,
      maxFacialExpressionBeatDensityPer1000: profile.max_facial_expression_beat_density_per_1000,
      maxFacialExpressionBeatRun: profile.max_facial_expression_beat_run,
      maxVagueAtmosphereModifierDensityPer1000: profile.max_vague_atmosphere_modifier_density_per_1000,
      maxVagueAtmosphereModifierRun: profile.max_vague_atmosphere_modifier_run,
      maxEvaluativeModifierDensityPer1000: profile.max_evaluative_modifier_density_per_1000,
      maxEvaluativeModifierRun: profile.max_evaluative_modifier_run,
      maxRhetoricalQuestionDensityPer1000: profile.max_rhetorical_question_density_per_1000,
      maxRhetoricalQuestionRun: profile.max_rhetorical_question_run,
      maxSubtextExplanationDensityPer1000: profile.max_subtext_explanation_density_per_1000,
      maxSubtextExplanationRun: profile.max_subtext_explanation_run,
      maxAmbiguousReferenceDensityPer1000: profile.max_ambiguous_reference_density_per_1000,
      maxAmbiguousReferenceRun: profile.max_ambiguous_reference_run,
      maxSceneTransitionGroundingGapDensityPer1000:
        profile.max_scene_transition_grounding_gap_density_per_1000,
      maxSceneTransitionGroundingGapRun: profile.max_scene_transition_grounding_gap_run,
      maxTopicMarkerStarterDensityPer1000: profile.max_topic_marker_starter_density_per_1000,
      maxTopicMarkerStarterRun: profile.max_topic_marker_starter_run,
      minSentenceLengthVariationCoefficient:
        profile.min_sentence_length_variation_coefficient,
      maxUniformSentenceLengthRun: profile.max_uniform_sentence_length_run,
      maxUniformParagraphBeatRun: profile.max_uniform_paragraph_beat_run,
      maxSameEndingRun: profile.max_same_ending_run,
      maxDominantSentenceEndingShare: profile.max_dominant_sentence_ending_share,
      maxDominantDialogueEndingShare: profile.max_dominant_dialogue_ending_share,
      maxDominantDialogueStarterShare: profile.max_dominant_dialogue_starter_share,
      minViewpointAnchorDensityPer1000: profile.min_viewpoint_anchor_density_per_1000,
      minImmersiveRhythmAnchorDensityPer1000:
        profile.min_immersive_rhythm_anchor_density_per_1000,
      maxImmersiveRhythmFlatlineRun: profile.max_immersive_rhythm_flatline_run,
      maxShortSentenceRun: profile.max_short_sentence_run,
      maxRepeatedSubjectRun: profile.max_repeated_subject_run,
      maxRepeatedConnectiveStarterRun: profile.max_repeated_connective_starter_run,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

async function readOptionalJson(filePath: string): Promise<any | undefined> {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

async function readChapterManuscript(
  projectDir: string,
  chapterNumber: number
): Promise<string | undefined> {
  const padded = padChapterNumber(chapterNumber);
  const candidates = [
    path.join(projectDir, 'chapters', `chapter_${padded}.md`),
    path.join(projectDir, 'chapters', `ch${padded}.md`),
  ];

  for (const candidate of candidates) {
    try {
      const content = await fs.readFile(candidate, 'utf8');
      if (content.trim()) {
        return content;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return undefined;
}

async function readChapterSceneCount(
  projectDir: string,
  chapterNumber: number
): Promise<number> {
  const chapterPath = path.join(
    projectDir,
    'chapters',
    `chapter_${padChapterNumber(chapterNumber)}.json`
  );

  try {
    const chapter = JSON.parse(await fs.readFile(chapterPath, 'utf8')) as {
      scenes?: unknown[];
    };
    return Math.max(1, chapter.scenes?.length ?? 1);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return 1;
    }
    throw error;
  }
}

function summarizeProseCraftScore(
  assessment: ReturnType<typeof analyzeChapter>['assessment']
): number {
  const scores = [
    assessment.proseQuality.score,
    assessment.sensoryGrounding.score,
    assessment.rhythmVariation.score,
    assessment.characterVoice.score,
    assessment.transitionQuality.score,
  ];

  if (assessment.honorificConsistency) {
    scores.push(assessment.honorificConsistency.score);
  }

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function summarizeProseCraftScoreWithTaste(
  baseScore: number,
  proseTaste: ProseTasteGateResult
): number {
  const blendedScore = Math.round(baseScore * 0.85 + proseTaste.score * 0.15);

  if (!proseTaste.passed) {
    return Math.min(blendedScore, proseTaste.score + 6);
  }

  return blendedScore;
}

function summarizeProseCraftIssues(
  result: ReturnType<typeof analyzeChapter>,
  proseTaste?: ProseTasteGateResult
): string[] {
  const issues = [
    ...result.assessment.proseQuality.issues,
    ...result.assessment.rhythmVariation.repetitionInstances,
  ];

  if (result.assessment.sensoryGrounding.score < 70) {
    issues.push(`감각 묘사 부족: ${result.assessment.sensoryGrounding.score}점`);
  }

  if (result.assessment.bannedExpressions) {
    issues.push(`금지/AI체 표현 ${result.assessment.bannedExpressions.count}건`);
  }

  for (const issue of proseTaste?.issues ?? []) {
    issues.push(`문체 취향 게이트 실패${formatProseTasteIssueLocation(issue)}: ${issue.message}`);
  }

  if (issues.length === 0 && (result.verdict === 'REVISE' || proseTaste?.passed === false)) {
    issues.push(result.readerExperience);
  }

  return issues;
}

function formatProseTasteIssueLocation(
  issue: NonNullable<ProseTasteGateResult['issues']>[number]
): string {
  const parts: string[] = [];
  if (issue.paragraphNumber !== undefined) parts.push(`문단 ${issue.paragraphNumber}`);
  if (issue.sentenceNumber !== undefined) parts.push(`문장 ${issue.sentenceNumber}`);
  if (issue.lineNumber !== undefined) parts.push(`줄 ${issue.lineNumber}`);
  return parts.length > 0 ? ` (${parts.join(', ')})` : '';
}

function proseTasteIssuePriority(severity: string): number {
  switch (severity) {
    case 'critical':
      return 1;
    case 'high':
      return 2;
    case 'medium':
      return 4;
    default:
      return 6;
  }
}

interface FileSnapshot {
  existed: boolean;
  content?: string;
}

async function snapshotFile(filePath: string): Promise<FileSnapshot> {
  try {
    return {
      existed: true,
      content: await fs.readFile(filePath, 'utf8'),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { existed: false };
    }
    throw error;
  }
}

async function restoreFileSnapshot(
  filePath: string,
  snapshot: FileSnapshot
): Promise<void> {
  if (!snapshot.existed) {
    await fs.rm(filePath, { force: true });
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, snapshot.content ?? '', 'utf8');
}

function renderText(result: ApplyChapterGateCliResult): string {
  return [
    `Chapter ${result.chapterNumber} gate: ${result.gate.status} (${result.gate.score}/100)`,
    `Engagement: ${result.engagement.score}/100 ${result.engagement.passed ? 'PASS' : 'REVISE'}`,
    `Ralph state: current=${result.state.currentChapter ?? '-'}, retries=${result.state.retryCount}`,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await applyChapterGateFromProject(args);

    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(renderText(result));
    }
  } catch (error) {
    if (error instanceof UsageRequested) {
      console.log(USAGE);
      return;
    }

    console.error((error as Error).message);
    console.error(USAGE);
    process.exitCode = 1;
  }
}

const isMain = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isMain) {
  void main();
}
