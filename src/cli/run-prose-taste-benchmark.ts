#!/usr/bin/env node

/**
 * Run labeled prose taste benchmark samples for a project.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
export {
  runProseTasteBenchmarkFromProject,
  type RunProseTasteBenchmarkCliResult,
} from './prose-taste-benchmark-project.js';
import {
  runProseTasteBenchmarkFromProject,
  type RunProseTasteBenchmarkCliResult,
} from './prose-taste-benchmark-project.js';
import type { ProseTasteMode, ProseTasteProfile } from '../quality/index.js';

interface CliArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  profile?: ProseTasteProfile;
  threshold?: number;
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
  json: boolean;
}

const ALLOWED_MODES: ProseTasteMode[] = ['plain', 'balanced', 'lyrical', 'webnovel-fast'];

const USAGE = `Usage:
  node dist/cli/run-prose-taste-benchmark.js --project <PATH> [--input-dir <PATH>] [--output <PATH>] [--project-id <ID>] [--mode plain|balanced|lyrical|webnovel-fast] [--threshold <0-100>] [--disliked-phrases phrase1,phrase2] [--max-body-reaction-subjects <0-100>] [--max-body-reaction-subject-run <1-20>] [--max-cliche-emotion-images <0-100>] [--max-cliche-emotion-image-run <1-20>] [--max-symbolic-abstractions <0-100>] [--max-symbolic-abstraction-run <1-20>] [--max-sensory-wallpaper-run <1-20>] [--max-emotion-label-run <1-20>] [--max-abstract-nouns <0-100>] [--max-cognitive-filters <0-100>] [--max-therapy-speak <0-100>] [--max-therapy-speak-run <1-20>] [--max-backstory-exposition <0-100>] [--max-backstory-run <1-20>] [--max-relationship-montage-summaries <0-100>] [--max-relationship-montage-run <1-20>] [--max-time-skip-summaries <0-100>] [--max-time-skip-summary-run <1-20>] [--max-contrastive-reframes <0-100>] [--max-contrastive-reframe-run <1-20>] [--max-lore-terms <0-100>] [--max-lore-term-run <1-20>] [--max-system-stat-blocks <0-100>] [--max-system-stat-block-run <1-20>] [--max-declared-resolves <0-100>] [--max-declared-resolve-run <1-20>] [--max-revelation-summaries <0-100>] [--max-revelation-summary-run <1-20>] [--max-procedural-checklists <0-100>] [--max-procedural-checklist-run <1-20>] [--max-action-choreography <0-100>] [--max-action-choreography-run <1-20>] [--max-filler-adverbs <0-100>] [--max-filler-adverb-run <1-20>] [--max-simultaneous-actions <0-100>] [--max-simultaneous-action-run <1-20>] [--max-status-quo-actions <0-100>] [--max-status-quo-action-run <1-20>] [--max-prop-fidget-beats <0-100>] [--max-prop-fidget-run <1-20>] [--max-gaze-choreography-beats <0-100>] [--max-gaze-choreography-run <1-20>] [--min-causal-turns <0-100>] [--max-commas <0-100>] [--max-reporting-tails <0-100>] [--max-emphasis-punctuation <0-100>] [--max-emphasis-punctuation-run <1-20>] [--max-static-descriptions <0-100>] [--max-generic-teasers <0-100>] [--max-thin-cliffhanger-endings <0-5>] [--max-pov-mind-jumps <0-100>] [--max-pov-mind-jump-run <1-20>] [--max-expository-dialogue-ratio <0-1>] [--max-dialogue-turn-length <20-600>] [--max-average-dialogue-turn-length <20-400>] [--max-dialogue-grounding-gap-run <2-20>] [--max-dialogue-question-ratio <0-1>] [--max-dialogue-question-run <1-20>] [--max-dialogue-vocative-ratio <0-1>] [--max-dialogue-vocative-run <1-20>] [--max-dialogue-lexical-echo-ratio <0-1>] [--max-dialogue-lexical-echo-run <1-20>] [--max-dialogue-paraphrase-confirmation-ratio <0-1>] [--max-dialogue-paraphrase-confirmation-run <1-20>] [--max-rote-dialogue-reply-ratio <0-1>] [--max-rote-dialogue-reply-run <1-20>] [--max-neutral-dialogue-tag-ratio <0-1>] [--max-neutral-dialogue-tag-run <1-20>] [--max-silence-stalls <0-100>] [--max-silence-stall-run <1-20>] [--max-melodramatic-captions <0-100>] [--max-melodramatic-caption-run <1-20>] [--max-stock-reaction-beats <0-100>] [--max-stock-reaction-beat-run <1-20>] [--max-facial-expression-beats <0-100>] [--max-facial-expression-run <1-20>] [--max-vague-atmosphere-modifiers <0-100>] [--max-vague-atmosphere-run <1-20>] [--max-evaluative-modifiers <0-100>] [--max-evaluative-modifier-run <1-20>] [--max-rhetorical-questions <0-100>] [--max-rhetorical-question-run <1-20>] [--max-subtext-explanations <0-100>] [--max-subtext-explanation-run <1-20>] [--max-ambiguous-references <0-100>] [--max-ambiguous-reference-run <1-20>] [--max-scene-transition-gaps <0-100>] [--max-scene-transition-gap-run <1-20>] [--max-topic-marker-starters <0-100>] [--max-topic-marker-run <1-20>] [--min-sentence-length-variation <0-1>] [--max-uniform-sentence-run <1-20>] [--max-same-ending-run <1-20>] [--max-dominant-ending-share <0-1>] [--max-dominant-dialogue-ending-share <0-1>] [--max-dominant-dialogue-starter-share <0-1>] [--min-viewpoint-anchors <0-100>] [--max-repeated-subject-run <1-20>] [--require-friction-annotations|--no-require-friction-annotations] [--require-style-highlight-annotations|--no-require-style-highlight-annotations] [--require-style-highlight-quality-diversity|--no-require-style-highlight-quality-diversity] [--require-style-fingerprint-separation|--no-require-style-fingerprint-separation] [--require-authorial-style-continuity|--no-require-authorial-style-continuity] [--min-friction-annotations <N>] [--min-actionable-friction-annotations <N>] [--min-style-highlight-annotations <N>] [--min-actionable-style-highlight-annotations <N>] [--min-style-highlight-quality-count <N>] [--min-style-fingerprint-samples-per-polarity <N>] [--min-style-fingerprint-distance <N>] [--min-style-fingerprint-signals <N>] [--min-authorial-style-continuity-samples <N>] [--max-authorial-style-drift <0-100>] [--min-holdout-samples <N>] [--min-usable-holdout-samples <N>] [--min-failing-holdout-samples <N>] [--min-usable-failing-holdout-samples <N>] [--json]

Reads labeled prose taste samples from reviews/prose-taste-benchmark/ and writes reviews/prose-taste-benchmark-report.json.`;

function parseArgs(argv: string[]): CliArgs {
  const parsed: Partial<CliArgs> = {
    json: false,
  };
  const profile: ProseTasteProfile = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--project' && argv[i + 1]) {
      parsed.projectDir = argv[++i];
    } else if (arg === '--project-id' && argv[i + 1]) {
      parsed.projectId = argv[++i];
    } else if (arg === '--input-dir' && argv[i + 1]) {
      parsed.inputDir = argv[++i];
    } else if (arg === '--output' && argv[i + 1]) {
      parsed.outputPath = argv[++i];
    } else if (arg === '--mode' && argv[i + 1]) {
      profile.preferredMode = parseMode(argv[++i]);
    } else if (arg === '--threshold' && argv[i + 1]) {
      parsed.threshold = parseScore(argv[++i], '--threshold');
    } else if (arg === '--disliked-phrases' && argv[i + 1]) {
      profile.dislikedPhrases = parseList(argv[++i]);
    } else if (arg === '--max-body-reaction-subjects' && argv[i + 1]) {
      profile.maxBodyReactionSubjectDensityPer1000 = parseScore(argv[++i], '--max-body-reaction-subjects');
    } else if (arg === '--max-body-reaction-subject-run' && argv[i + 1]) {
      profile.maxBodyReactionSubjectRun = parseIntegerInRange(argv[++i], '--max-body-reaction-subject-run', 1, 20);
    } else if (arg === '--max-cliche-emotion-images' && argv[i + 1]) {
      profile.maxClicheEmotionImageDensityPer1000 = parseScore(argv[++i], '--max-cliche-emotion-images');
    } else if (arg === '--max-cliche-emotion-image-run' && argv[i + 1]) {
      profile.maxClicheEmotionImageRun = parseIntegerInRange(argv[++i], '--max-cliche-emotion-image-run', 1, 20);
    } else if (arg === '--max-symbolic-abstractions' && argv[i + 1]) {
      profile.maxSymbolicAbstractionDensityPer1000 = parseScore(argv[++i], '--max-symbolic-abstractions');
    } else if (arg === '--max-symbolic-abstraction-run' && argv[i + 1]) {
      profile.maxSymbolicAbstractionRun = parseIntegerInRange(argv[++i], '--max-symbolic-abstraction-run', 1, 20);
    } else if (arg === '--max-sensory-wallpaper-run' && argv[i + 1]) {
      profile.maxSensoryWallpaperRun = parseIntegerInRange(argv[++i], '--max-sensory-wallpaper-run', 1, 20);
    } else if (arg === '--max-emotion-label-run' && argv[i + 1]) {
      profile.maxEmotionLabelRun = parseIntegerInRange(argv[++i], '--max-emotion-label-run', 1, 20);
    } else if (arg === '--max-abstract-nouns' && argv[i + 1]) {
      profile.maxAbstractNounDensityPer1000 = parseScore(argv[++i], '--max-abstract-nouns');
    } else if (arg === '--max-cognitive-filters' && argv[i + 1]) {
      profile.maxCognitiveFilterDensityPer1000 = parseScore(argv[++i], '--max-cognitive-filters');
    } else if (arg === '--max-therapy-speak' && argv[i + 1]) {
      profile.maxTherapySpeakDensityPer1000 = parseScore(argv[++i], '--max-therapy-speak');
    } else if (arg === '--max-therapy-speak-run' && argv[i + 1]) {
      profile.maxTherapySpeakRun = parseIntegerInRange(argv[++i], '--max-therapy-speak-run', 1, 20);
    } else if (arg === '--max-backstory-exposition' && argv[i + 1]) {
      profile.maxBackstoryExpositionDensityPer1000 = parseScore(argv[++i], '--max-backstory-exposition');
    } else if (arg === '--max-backstory-run' && argv[i + 1]) {
      profile.maxBackstoryExpositionRun = parseIntegerInRange(argv[++i], '--max-backstory-run', 1, 20);
    } else if (arg === '--max-relationship-montage-summaries' && argv[i + 1]) {
      profile.maxRelationshipMontageSummaryDensityPer1000 = parseScore(argv[++i], '--max-relationship-montage-summaries');
    } else if (arg === '--max-relationship-montage-run' && argv[i + 1]) {
      profile.maxRelationshipMontageSummaryRun = parseIntegerInRange(argv[++i], '--max-relationship-montage-run', 1, 20);
    } else if (arg === '--max-time-skip-summaries' && argv[i + 1]) {
      profile.maxTimeSkipSummaryDensityPer1000 = parseScore(argv[++i], '--max-time-skip-summaries');
    } else if (arg === '--max-time-skip-summary-run' && argv[i + 1]) {
      profile.maxTimeSkipSummaryRun = parseIntegerInRange(argv[++i], '--max-time-skip-summary-run', 1, 20);
    } else if (arg === '--max-contrastive-reframes' && argv[i + 1]) {
      profile.maxContrastiveReframeDensityPer1000 = parseScore(argv[++i], '--max-contrastive-reframes');
    } else if (arg === '--max-contrastive-reframe-run' && argv[i + 1]) {
      profile.maxContrastiveReframeRun = parseIntegerInRange(argv[++i], '--max-contrastive-reframe-run', 1, 20);
    } else if (arg === '--max-lore-terms' && argv[i + 1]) {
      profile.maxLoreTermDensityPer1000 = parseScore(argv[++i], '--max-lore-terms');
    } else if (arg === '--max-lore-term-run' && argv[i + 1]) {
      profile.maxLoreTermRun = parseIntegerInRange(argv[++i], '--max-lore-term-run', 1, 20);
    } else if (arg === '--max-system-stat-blocks' && argv[i + 1]) {
      profile.maxSystemStatBlockDensityPer1000 = parseScore(argv[++i], '--max-system-stat-blocks');
    } else if (arg === '--max-system-stat-block-run' && argv[i + 1]) {
      profile.maxSystemStatBlockRun = parseIntegerInRange(argv[++i], '--max-system-stat-block-run', 1, 20);
    } else if (arg === '--max-declared-resolves' && argv[i + 1]) {
      profile.maxDeclaredResolveDensityPer1000 = parseScore(argv[++i], '--max-declared-resolves');
    } else if (arg === '--max-declared-resolve-run' && argv[i + 1]) {
      profile.maxDeclaredResolveRun = parseIntegerInRange(argv[++i], '--max-declared-resolve-run', 1, 20);
    } else if (arg === '--max-revelation-summaries' && argv[i + 1]) {
      profile.maxRevelationSummaryDensityPer1000 = parseScore(argv[++i], '--max-revelation-summaries');
    } else if (arg === '--max-revelation-summary-run' && argv[i + 1]) {
      profile.maxRevelationSummaryRun = parseIntegerInRange(argv[++i], '--max-revelation-summary-run', 1, 20);
    } else if (arg === '--max-procedural-checklists' && argv[i + 1]) {
      profile.maxProceduralChecklistDensityPer1000 = parseScore(argv[++i], '--max-procedural-checklists');
    } else if (arg === '--max-procedural-checklist-run' && argv[i + 1]) {
      profile.maxProceduralChecklistRun = parseIntegerInRange(argv[++i], '--max-procedural-checklist-run', 1, 20);
    } else if (arg === '--max-action-choreography' && argv[i + 1]) {
      profile.maxActionChoreographyDensityPer1000 = parseScore(argv[++i], '--max-action-choreography');
    } else if (arg === '--max-action-choreography-run' && argv[i + 1]) {
      profile.maxActionChoreographyRun = parseIntegerInRange(argv[++i], '--max-action-choreography-run', 1, 20);
    } else if (arg === '--max-filler-adverbs' && argv[i + 1]) {
      profile.maxFillerAdverbDensityPer1000 = parseScore(argv[++i], '--max-filler-adverbs');
    } else if (arg === '--max-filler-adverb-run' && argv[i + 1]) {
      profile.maxFillerAdverbRun = parseIntegerInRange(argv[++i], '--max-filler-adverb-run', 1, 20);
    } else if (arg === '--max-simultaneous-actions' && argv[i + 1]) {
      profile.maxSimultaneousActionDensityPer1000 = parseScore(argv[++i], '--max-simultaneous-actions');
    } else if (arg === '--max-simultaneous-action-run' && argv[i + 1]) {
      profile.maxSimultaneousActionRun = parseIntegerInRange(argv[++i], '--max-simultaneous-action-run', 1, 20);
    } else if (arg === '--max-status-quo-actions' && argv[i + 1]) {
      profile.maxStatusQuoActionDensityPer1000 = parseScore(argv[++i], '--max-status-quo-actions');
    } else if (arg === '--max-status-quo-action-run' && argv[i + 1]) {
      profile.maxStatusQuoActionRun = parseIntegerInRange(argv[++i], '--max-status-quo-action-run', 1, 20);
    } else if (arg === '--max-prop-fidget-beats' && argv[i + 1]) {
      profile.maxPropFidgetBeatDensityPer1000 = parseScore(argv[++i], '--max-prop-fidget-beats');
    } else if (arg === '--max-prop-fidget-run' && argv[i + 1]) {
      profile.maxPropFidgetBeatRun = parseIntegerInRange(argv[++i], '--max-prop-fidget-run', 1, 20);
    } else if (arg === '--max-gaze-choreography-beats' && argv[i + 1]) {
      profile.maxGazeChoreographyDensityPer1000 = parseScore(argv[++i], '--max-gaze-choreography-beats');
    } else if (arg === '--max-gaze-choreography-run' && argv[i + 1]) {
      profile.maxGazeChoreographyRun = parseIntegerInRange(argv[++i], '--max-gaze-choreography-run', 1, 20);
    } else if (arg === '--min-causal-turns' && argv[i + 1]) {
      profile.minCausalTurnDensityPer1000 = parseScore(argv[++i], '--min-causal-turns');
    } else if (arg === '--max-commas' && argv[i + 1]) {
      profile.maxCommaDensityPer1000 = parseScore(argv[++i], '--max-commas');
    } else if (arg === '--max-reporting-tails' && argv[i + 1]) {
      profile.maxReportingTailDensityPer1000 = parseScore(argv[++i], '--max-reporting-tails');
    } else if (arg === '--max-emphasis-punctuation' && argv[i + 1]) {
      profile.maxEmphasisPunctuationDensityPer1000 = parseScore(argv[++i], '--max-emphasis-punctuation');
    } else if (arg === '--max-emphasis-punctuation-run' && argv[i + 1]) {
      profile.maxEmphasisPunctuationRun = parseIntegerInRange(argv[++i], '--max-emphasis-punctuation-run', 1, 20);
    } else if (arg === '--max-static-descriptions' && argv[i + 1]) {
      profile.maxStaticDescriptionDensityPer1000 = parseScore(argv[++i], '--max-static-descriptions');
    } else if (arg === '--max-generic-teasers' && argv[i + 1]) {
      profile.maxGenericTeaserDensityPer1000 = parseScore(argv[++i], '--max-generic-teasers');
    } else if (arg === '--max-thin-cliffhanger-endings' && argv[i + 1]) {
      profile.maxThinCliffhangerEndingCount = parseIntegerInRange(
        argv[++i],
        '--max-thin-cliffhanger-endings',
        0,
        5
      );
    } else if (arg === '--max-pov-mind-jumps' && argv[i + 1]) {
      profile.maxPovMindJumpDensityPer1000 = parseScore(argv[++i], '--max-pov-mind-jumps');
    } else if (arg === '--max-pov-mind-jump-run' && argv[i + 1]) {
      profile.maxPovMindJumpRun = parseIntegerInRange(argv[++i], '--max-pov-mind-jump-run', 1, 20);
    } else if (arg === '--max-expository-dialogue-ratio' && argv[i + 1]) {
      profile.maxExpositoryDialogueRatio = parseRatio(argv[++i], '--max-expository-dialogue-ratio');
    } else if (arg === '--max-dialogue-turn-length' && argv[i + 1]) {
      profile.maxDialogueTurnLength = parseIntegerInRange(argv[++i], '--max-dialogue-turn-length', 20, 600);
    } else if (arg === '--max-average-dialogue-turn-length' && argv[i + 1]) {
      profile.maxAverageDialogueTurnLength = parseIntegerInRange(
        argv[++i],
        '--max-average-dialogue-turn-length',
        20,
        400
      );
    } else if (arg === '--max-dialogue-grounding-gap-run' && argv[i + 1]) {
      profile.maxDialogueGroundingGapRun = parseIntegerInRange(
        argv[++i],
        '--max-dialogue-grounding-gap-run',
        2,
        20
      );
    } else if (arg === '--max-dialogue-question-ratio' && argv[i + 1]) {
      profile.maxDialogueQuestionRatio = parseRatio(argv[++i], '--max-dialogue-question-ratio');
    } else if (arg === '--max-dialogue-question-run' && argv[i + 1]) {
      profile.maxDialogueQuestionRun = parseIntegerInRange(argv[++i], '--max-dialogue-question-run', 1, 20);
    } else if (arg === '--max-dialogue-vocative-ratio' && argv[i + 1]) {
      profile.maxDialogueVocativeRatio = parseRatio(argv[++i], '--max-dialogue-vocative-ratio');
    } else if (arg === '--max-dialogue-vocative-run' && argv[i + 1]) {
      profile.maxDialogueVocativeRun = parseIntegerInRange(argv[++i], '--max-dialogue-vocative-run', 1, 20);
    } else if (arg === '--max-dialogue-lexical-echo-ratio' && argv[i + 1]) {
      profile.maxDialogueLexicalEchoRatio = parseRatio(argv[++i], '--max-dialogue-lexical-echo-ratio');
    } else if (arg === '--max-dialogue-lexical-echo-run' && argv[i + 1]) {
      profile.maxDialogueLexicalEchoRun = parseIntegerInRange(argv[++i], '--max-dialogue-lexical-echo-run', 1, 20);
    } else if (arg === '--max-dialogue-paraphrase-confirmation-ratio' && argv[i + 1]) {
      profile.maxDialogueParaphraseConfirmationRatio = parseRatio(
        argv[++i],
        '--max-dialogue-paraphrase-confirmation-ratio'
      );
    } else if (arg === '--max-dialogue-paraphrase-confirmation-run' && argv[i + 1]) {
      profile.maxDialogueParaphraseConfirmationRun = parseIntegerInRange(
        argv[++i],
        '--max-dialogue-paraphrase-confirmation-run',
        1,
        20
      );
    } else if (arg === '--max-rote-dialogue-reply-ratio' && argv[i + 1]) {
      profile.maxRoteDialogueReplyRatio = parseRatio(argv[++i], '--max-rote-dialogue-reply-ratio');
    } else if (arg === '--max-rote-dialogue-reply-run' && argv[i + 1]) {
      profile.maxRoteDialogueReplyRun = parseIntegerInRange(argv[++i], '--max-rote-dialogue-reply-run', 1, 20);
    } else if (arg === '--max-neutral-dialogue-tag-ratio' && argv[i + 1]) {
      profile.maxNeutralDialogueTagRatio = parseRatio(argv[++i], '--max-neutral-dialogue-tag-ratio');
    } else if (arg === '--max-neutral-dialogue-tag-run' && argv[i + 1]) {
      profile.maxNeutralDialogueTagRun = parseIntegerInRange(argv[++i], '--max-neutral-dialogue-tag-run', 1, 20);
    } else if (arg === '--max-silence-stalls' && argv[i + 1]) {
      profile.maxSilenceStallDensityPer1000 = parseScore(argv[++i], '--max-silence-stalls');
    } else if (arg === '--max-silence-stall-run' && argv[i + 1]) {
      profile.maxSilenceStallRun = parseIntegerInRange(argv[++i], '--max-silence-stall-run', 1, 20);
    } else if (arg === '--max-melodramatic-captions' && argv[i + 1]) {
      profile.maxMelodramaticCaptionDensityPer1000 = parseScore(argv[++i], '--max-melodramatic-captions');
    } else if (arg === '--max-melodramatic-caption-run' && argv[i + 1]) {
      profile.maxMelodramaticCaptionRun = parseIntegerInRange(argv[++i], '--max-melodramatic-caption-run', 1, 20);
    } else if (arg === '--max-stock-reaction-beats' && argv[i + 1]) {
      profile.maxStockReactionBeatDensityPer1000 = parseScore(argv[++i], '--max-stock-reaction-beats');
    } else if (arg === '--max-stock-reaction-beat-run' && argv[i + 1]) {
      profile.maxStockReactionBeatRun = parseIntegerInRange(argv[++i], '--max-stock-reaction-beat-run', 1, 20);
    } else if (arg === '--max-facial-expression-beats' && argv[i + 1]) {
      profile.maxFacialExpressionBeatDensityPer1000 = parseScore(argv[++i], '--max-facial-expression-beats');
    } else if (arg === '--max-facial-expression-run' && argv[i + 1]) {
      profile.maxFacialExpressionBeatRun = parseIntegerInRange(argv[++i], '--max-facial-expression-run', 1, 20);
    } else if (arg === '--max-vague-atmosphere-modifiers' && argv[i + 1]) {
      profile.maxVagueAtmosphereModifierDensityPer1000 = parseScore(argv[++i], '--max-vague-atmosphere-modifiers');
    } else if (arg === '--max-vague-atmosphere-run' && argv[i + 1]) {
      profile.maxVagueAtmosphereModifierRun = parseIntegerInRange(argv[++i], '--max-vague-atmosphere-run', 1, 20);
    } else if (arg === '--max-evaluative-modifiers' && argv[i + 1]) {
      profile.maxEvaluativeModifierDensityPer1000 = parseScore(argv[++i], '--max-evaluative-modifiers');
    } else if (arg === '--max-evaluative-modifier-run' && argv[i + 1]) {
      profile.maxEvaluativeModifierRun = parseIntegerInRange(argv[++i], '--max-evaluative-modifier-run', 1, 20);
    } else if (arg === '--max-rhetorical-questions' && argv[i + 1]) {
      profile.maxRhetoricalQuestionDensityPer1000 = parseScore(argv[++i], '--max-rhetorical-questions');
    } else if (arg === '--max-rhetorical-question-run' && argv[i + 1]) {
      profile.maxRhetoricalQuestionRun = parseIntegerInRange(argv[++i], '--max-rhetorical-question-run', 1, 20);
    } else if (arg === '--max-subtext-explanations' && argv[i + 1]) {
      profile.maxSubtextExplanationDensityPer1000 = parseScore(argv[++i], '--max-subtext-explanations');
    } else if (arg === '--max-subtext-explanation-run' && argv[i + 1]) {
      profile.maxSubtextExplanationRun = parseIntegerInRange(argv[++i], '--max-subtext-explanation-run', 1, 20);
    } else if (arg === '--max-ambiguous-references' && argv[i + 1]) {
      profile.maxAmbiguousReferenceDensityPer1000 = parseScore(argv[++i], '--max-ambiguous-references');
    } else if (arg === '--max-ambiguous-reference-run' && argv[i + 1]) {
      profile.maxAmbiguousReferenceRun = parseIntegerInRange(argv[++i], '--max-ambiguous-reference-run', 1, 20);
    } else if (arg === '--max-scene-transition-gaps' && argv[i + 1]) {
      profile.maxSceneTransitionGroundingGapDensityPer1000 = parseScore(argv[++i], '--max-scene-transition-gaps');
    } else if (arg === '--max-scene-transition-gap-run' && argv[i + 1]) {
      profile.maxSceneTransitionGroundingGapRun = parseIntegerInRange(argv[++i], '--max-scene-transition-gap-run', 1, 20);
    } else if (arg === '--max-topic-marker-starters' && argv[i + 1]) {
      profile.maxTopicMarkerStarterDensityPer1000 = parseScore(argv[++i], '--max-topic-marker-starters');
    } else if (arg === '--max-topic-marker-run' && argv[i + 1]) {
      profile.maxTopicMarkerStarterRun = parseIntegerInRange(argv[++i], '--max-topic-marker-run', 1, 20);
    } else if (arg === '--min-sentence-length-variation' && argv[i + 1]) {
      profile.minSentenceLengthVariationCoefficient = parseRatio(argv[++i], '--min-sentence-length-variation');
    } else if (arg === '--max-uniform-sentence-run' && argv[i + 1]) {
      profile.maxUniformSentenceLengthRun = parseIntegerInRange(argv[++i], '--max-uniform-sentence-run', 1, 20);
    } else if (arg === '--max-same-ending-run' && argv[i + 1]) {
      profile.maxSameEndingRun = parseIntegerInRange(argv[++i], '--max-same-ending-run', 1, 20);
    } else if (arg === '--max-dominant-ending-share' && argv[i + 1]) {
      profile.maxDominantSentenceEndingShare = parseRatio(argv[++i], '--max-dominant-ending-share');
    } else if (arg === '--max-dominant-dialogue-ending-share' && argv[i + 1]) {
      profile.maxDominantDialogueEndingShare = parseRatio(
        argv[++i],
        '--max-dominant-dialogue-ending-share'
      );
    } else if (arg === '--max-dominant-dialogue-starter-share' && argv[i + 1]) {
      profile.maxDominantDialogueStarterShare = parseRatio(
        argv[++i],
        '--max-dominant-dialogue-starter-share'
      );
    } else if (arg === '--min-viewpoint-anchors' && argv[i + 1]) {
      profile.minViewpointAnchorDensityPer1000 = parseScore(argv[++i], '--min-viewpoint-anchors');
    } else if (arg === '--max-repeated-subject-run' && argv[i + 1]) {
      profile.maxRepeatedSubjectRun = parseIntegerInRange(argv[++i], '--max-repeated-subject-run', 1, 20);
    } else if (arg === '--require-friction-annotations') {
      parsed.requireFrictionAnnotationsForStyleTuning = true;
    } else if (arg === '--no-require-friction-annotations') {
      parsed.requireFrictionAnnotationsForStyleTuning = false;
    } else if (arg === '--require-style-highlight-annotations') {
      parsed.requireStyleHighlightAnnotationsForStyleTuning = true;
    } else if (arg === '--no-require-style-highlight-annotations') {
      parsed.requireStyleHighlightAnnotationsForStyleTuning = false;
    } else if (arg === '--require-style-highlight-quality-diversity') {
      parsed.requireStyleHighlightQualityDiversity = true;
    } else if (arg === '--no-require-style-highlight-quality-diversity') {
      parsed.requireStyleHighlightQualityDiversity = false;
    } else if (arg === '--require-style-fingerprint-separation') {
      parsed.requireStyleFingerprintSeparation = true;
    } else if (arg === '--no-require-style-fingerprint-separation') {
      parsed.requireStyleFingerprintSeparation = false;
    } else if (arg === '--require-authorial-style-continuity') {
      parsed.requireAuthorialStyleContinuity = true;
    } else if (arg === '--no-require-authorial-style-continuity') {
      parsed.requireAuthorialStyleContinuity = false;
    } else if (arg === '--min-friction-annotations' && argv[i + 1]) {
      parsed.minimumFrictionAnnotationCount = parsePositiveInteger(argv[++i], '--min-friction-annotations');
    } else if (arg === '--min-actionable-friction-annotations' && argv[i + 1]) {
      parsed.minimumActionableFrictionAnnotationCount = parsePositiveInteger(argv[++i], '--min-actionable-friction-annotations');
    } else if (arg === '--min-style-highlight-annotations' && argv[i + 1]) {
      parsed.minimumStyleHighlightAnnotationCount = parsePositiveInteger(argv[++i], '--min-style-highlight-annotations');
    } else if (arg === '--min-actionable-style-highlight-annotations' && argv[i + 1]) {
      parsed.minimumActionableStyleHighlightAnnotationCount = parsePositiveInteger(argv[++i], '--min-actionable-style-highlight-annotations');
    } else if (arg === '--min-style-highlight-quality-count' && argv[i + 1]) {
      parsed.minimumStyleHighlightQualityCount = parsePositiveInteger(argv[++i], '--min-style-highlight-quality-count');
    } else if (arg === '--min-style-fingerprint-samples-per-polarity' && argv[i + 1]) {
      parsed.minimumStyleFingerprintSamplesPerPolarity = parsePositiveInteger(argv[++i], '--min-style-fingerprint-samples-per-polarity');
    } else if (arg === '--min-style-fingerprint-distance' && argv[i + 1]) {
      parsed.minimumStyleFingerprintDistance = parseScore(argv[++i], '--min-style-fingerprint-distance');
    } else if (arg === '--min-style-fingerprint-signals' && argv[i + 1]) {
      parsed.minimumStyleFingerprintSignalCount = parsePositiveInteger(argv[++i], '--min-style-fingerprint-signals');
    } else if (arg === '--min-authorial-style-continuity-samples' && argv[i + 1]) {
      parsed.minimumAuthorialStyleContinuitySamples = parsePositiveInteger(argv[++i], '--min-authorial-style-continuity-samples');
    } else if (arg === '--max-authorial-style-drift' && argv[i + 1]) {
      parsed.maximumAuthorialStyleDrift = parseScore(argv[++i], '--max-authorial-style-drift');
    } else if (arg === '--min-holdout-samples' && argv[i + 1]) {
      parsed.minimumHoldoutSampleCount = parsePositiveInteger(argv[++i], '--min-holdout-samples');
    } else if (arg === '--min-usable-holdout-samples' && argv[i + 1]) {
      parsed.minimumUsableHoldoutSampleCount = parsePositiveInteger(argv[++i], '--min-usable-holdout-samples');
    } else if (arg === '--min-failing-holdout-samples' && argv[i + 1]) {
      parsed.minimumFailingHoldoutSampleCount = parsePositiveInteger(argv[++i], '--min-failing-holdout-samples');
    } else if (arg === '--min-usable-failing-holdout-samples' && argv[i + 1]) {
      parsed.minimumUsableFailingHoldoutSampleCount = parsePositiveInteger(argv[++i], '--min-usable-failing-holdout-samples');
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

  if (Object.keys(profile).length > 0) {
    parsed.profile = profile;
  }

  return parsed as CliArgs;
}

function parseList(value: string): string[] {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function parseMode(value: string): ProseTasteMode {
  if (!ALLOWED_MODES.includes(value as ProseTasteMode)) {
    throw new Error(`Unknown prose taste mode: ${value}`);
  }
  return value as ProseTasteMode;
}

function parseScore(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`${label} must be a number between 0 and 100`);
  }
  return parsed;
}

function parseRatio(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new Error(`${label} must be a number between 0 and 1`);
  }
  return parsed;
}

function parseIntegerInRange(value: string, label: string, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${label} must be an integer between ${min} and ${max}`);
  }
  return parsed;
}

function parsePositiveInteger(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
}

function renderText(result: RunProseTasteBenchmarkCliResult): string {
  const benchmark = result.benchmark;
  return [
    `Prose taste benchmark: ${benchmark.passed}/${benchmark.total} samples passed (${Math.round(benchmark.accuracy * 100)}%)`,
    `Failures: false positives=${benchmark.falsePositiveCount}, false negatives=${benchmark.falseNegativeCount}, missing issues=${benchmark.missingIssueCount}, score out of range=${benchmark.scoreOutOfRangeCount}`,
    `Style friction annotations: total=${benchmark.styleFrictionAnnotationCount}, actionable=${benchmark.actionableStyleFrictionAnnotationCount}, missing=${benchmark.missingStyleFrictionAnnotationCount}, weak=${benchmark.weakStyleFrictionAnnotationCount}`,
    `Style highlight annotations: total=${benchmark.styleHighlightAnnotationCount}, actionable=${benchmark.actionableStyleHighlightAnnotationCount}, qualities=${benchmark.styleHighlightQualityCount}, weak quality diversity=${benchmark.weakStyleHighlightQualityDiversityCount}, missing=${benchmark.missingStyleHighlightAnnotationCount}, weak=${benchmark.weakStyleHighlightAnnotationCount}`,
    `Style fingerprint: status=${benchmark.styleFingerprintStatus}, distance=${benchmark.styleFingerprintDistance}, signals=${benchmark.styleFingerprintSignalCount}`,
    `Authorial style drift: status=${benchmark.authorialStyleDriftStatus}, max=${benchmark.authorialStyleDriftMaxDistance}, pairs=${benchmark.authorialStyleDriftPairCount}`,
    `Holdout: total=${benchmark.splitCoverage.holdoutSamples}, usable=${benchmark.splitCoverage.usableHoldoutSamples}, disliked=${benchmark.splitCoverage.failingHoldoutSamples}, usable disliked=${benchmark.splitCoverage.usableFailingHoldoutSamples}`,
    `Split leakage: ${benchmark.splitLeakageCount}`,
    `Stored: ${result.outputPath}`,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await runProseTasteBenchmarkFromProject(args);

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
