#!/usr/bin/env node

/**
 * Calibrate automated engagement scores against reader-panel response data.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
export {
  calibrateReaderResponseFromProject,
  type CalibrateReaderResponseCliResult,
  type CalibrateReaderResponseProjectArgs,
} from './reader-response-project.js';
import {
  calibrateReaderResponseFromProject,
  type CalibrateReaderResponseCliResult,
  type CalibrateReaderResponseProjectArgs,
} from './reader-response-project.js';

type CliArgs = CalibrateReaderResponseProjectArgs & {
  projectDir: string;
  json: boolean;
};

const USAGE = `Usage:
  node dist/cli/calibrate-reader-response.js --project <PATH> [--input-dir <PATH>] [--output <PATH>] [--project-id <ID>] [--min-respondents <N>] [--min-samples <N>] [--require-human-reader-evidence|--no-require-human-reader-evidence] [--min-human-respondent-ratio <0-1|0-100>] [--require-response-data-quality|--no-require-response-data-quality] [--min-median-read-time-seconds <N>] [--max-median-reading-wpm <N>] [--max-minimum-reading-wpm <N>] [--max-median-reading-cpm <N>] [--max-minimum-reading-cpm <N>] [--require-length-normalized-read-time|--no-require-length-normalized-read-time] [--max-speeding-response-ratio <0-1|0-100>] [--max-straight-lining-response-ratio <0-1|0-100>] [--max-duplicate-response-ratio <0-1|0-100>] [--max-bot-suspected-response-ratio <0-1|0-100>] [--max-low-quality-open-ended-ratio <0-1|0-100>] [--max-inconsistent-response-ratio <0-1|0-100>] [--max-quality-flagged-response-ratio <0-1|0-100>] [--min-holdout-samples <N>] [--min-usable-holdout-samples <N>] [--require-retention-evidence|--no-require-retention-evidence] [--min-started-readers <N>] [--min-completion-rate <0-1|0-100>] [--max-drop-off-ratio <0-1|0-100>] [--max-skimmed-ratio <0-1|0-100>] [--require-drop-off-localization-evidence|--no-require-drop-off-localization-evidence] [--min-drop-off-annotations <N>] [--min-actionable-drop-off-annotations <N>] [--require-annotation-reliability|--no-require-annotation-reliability] [--min-annotation-coders <N>] [--min-annotation-double-coded <N>] [--min-annotation-agreement <0-1|0-100>] [--require-scene-recall-evidence|--no-require-scene-recall-evidence] [--min-unprompted-scene-recall-ratio <0-1|0-100>] [--min-distinctive-scene-recall-ratio <0-1|0-100>] [--min-scene-recall-annotations <N>] [--require-tension-trace-evidence|--no-require-tension-trace-evidence] [--min-tension-trace-ratio <0-1|0-100>] [--min-tension-peak-ratio <0-1|0-100>] [--min-tension-question-ratio <0-1|0-100>] [--min-tension-trace-annotations <N>] [--require-narrative-forecast-evidence|--no-require-narrative-forecast-evidence] [--min-forecast-prediction-ratio <0-1|0-100>] [--min-forecast-diversity-count <N>] [--min-forecast-revision-ratio <0-1|0-100>] [--min-forecast-mismatch-ratio <0-1|0-100>] [--min-narrative-forecast-annotations <N>] [--require-line-quote-evidence|--no-require-line-quote-evidence] [--min-quote-recall-ratio <0-1|0-100>] [--min-favorite-line-ratio <0-1|0-100>] [--min-shareable-line-ratio <0-1|0-100>] [--min-line-quote-annotations <N>] [--require-payoff-fairness-evidence|--no-require-payoff-fairness-evidence] [--min-payoff-setup-recall-ratio <0-1|0-100>] [--min-payoff-trigger-recognition-ratio <0-1|0-100>] [--min-payoff-earned-ratio <0-1|0-100>] [--min-payoff-recontextualization-ratio <0-1|0-100>] [--min-payoff-emotional-satisfaction-ratio <0-1|0-100>] [--min-payoff-fairness-annotations <N>] [--require-advocacy-evidence|--no-require-advocacy-evidence] [--min-organic-recommendation-ratio <0-1|0-100>] [--min-discussion-prompt-ratio <0-1|0-100>] [--min-advocacy-annotations <N>] [--require-durable-engagement-evidence|--no-require-durable-engagement-evidence] [--min-bookmark-ratio <0-1|0-100>] [--min-return-intent-ratio <0-1|0-100>] [--min-paid-continuation-intent-ratio <0-1|0-100>] [--min-durable-engagement-annotations <N>] [--require-continuation-behavior-evidence|--no-require-continuation-behavior-evidence] [--min-continuation-behavior-impressions <N>] [--min-next-chapter-click-through-ratio <0-1|0-100>] [--min-next-chapter-open-ratio <0-1|0-100>] [--min-next-chapter-read-start-ratio <0-1|0-100>] [--require-resonance-evidence|--no-require-resonance-evidence] [--min-lingering-emotion-ratio <0-1|0-100>] [--min-reflective-meaning-ratio <0-1|0-100>] [--min-resonance-annotations <N>] [--require-delayed-memory-evidence|--no-require-delayed-memory-evidence] [--min-delayed-follow-up-ratio <0-1|0-100>] [--min-delayed-follow-up-hours <N>] [--min-delayed-scene-recall-ratio <0-1|0-100>] [--min-delayed-character-recall-ratio <0-1|0-100>] [--min-delayed-continuation-intent-ratio <0-1|0-100>] [--min-delayed-memory-annotations <N>] [--require-comparative-preference] [--min-comparative-win-rate <0-1|0-100>] [--min-comparative-respondents <N>] [--require-revision-outcome-evidence|--no-require-revision-outcome-evidence] [--min-revision-lift <N>] [--min-revision-preference-win-rate <0-1|0-100>] [--min-revision-preference-respondents <N>] [--max-samples-per-respondent <N>] [--min-order-balance-ratio <0-1|0-100>] [--required-genres genre1,genre2] [--min-samples-per-genre <N>] [--min-usable-samples-per-genre <N>] [--required-series-length <N>] [--required-usable-series-length <N>] [--required-chapter-range id:min-max:minSamples:minUsableSamples:genre1,genre2] [--json]

Reads reader response JSON files from reviews/reader-response/, compares them against meta/quality-trend.json, and writes reviews/reader-response-calibration.json.
Target-reader quota options: --required-target-reader-segments, --min-respondents-per-required-target-segment, --require-target-reader-segment-quotas, --no-require-target-reader-segment-quotas.
Recruitment-channel options: --required-recruitment-channels, --min-respondents-per-required-recruitment-channel, --max-dominant-recruitment-channel-ratio, --require-recruitment-channel-diversity, --no-require-recruitment-channel-diversity.
Manuscript-order options: --max-samples-per-respondent, --min-order-balance-ratio.`;

function parseArgs(argv: string[]): CliArgs {
  const parsed: Partial<CliArgs> = {
    json: false,
  };

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
    } else if (arg === '--min-respondents' && argv[i + 1]) {
      parsed.minimumRespondentCount = parsePositiveInteger(argv[++i], '--min-respondents');
    } else if (arg === '--min-samples' && argv[i + 1]) {
      parsed.minimumSampleCountForTuning = parsePositiveInteger(argv[++i], '--min-samples');
    } else if (arg === '--require-human-reader-evidence') {
      parsed.requireHumanReaderEvidenceForTuning = true;
    } else if (arg === '--no-require-human-reader-evidence') {
      parsed.requireHumanReaderEvidenceForTuning = false;
    } else if (arg === '--min-human-respondent-ratio' && argv[i + 1]) {
      parsed.minimumHumanRespondentRatio = parseUnitRatio(argv[++i], '--min-human-respondent-ratio');
    } else if (arg === '--require-response-data-quality') {
      parsed.requireResponseDataQualityForTuning = true;
    } else if (arg === '--no-require-response-data-quality') {
      parsed.requireResponseDataQualityForTuning = false;
    } else if (arg === '--min-median-read-time-seconds' && argv[i + 1]) {
      parsed.minimumMedianReadTimeSeconds = parseNonNegativeNumber(argv[++i], '--min-median-read-time-seconds');
    } else if (arg === '--max-median-reading-wpm' && argv[i + 1]) {
      parsed.maximumMedianReadingWordsPerMinute = parseNonNegativeNumber(argv[++i], '--max-median-reading-wpm');
    } else if (arg === '--max-minimum-reading-wpm' && argv[i + 1]) {
      parsed.maximumMinimumReadingWordsPerMinute = parseNonNegativeNumber(argv[++i], '--max-minimum-reading-wpm');
    } else if (arg === '--max-median-reading-cpm' && argv[i + 1]) {
      parsed.maximumMedianReadingCharactersPerMinute = parseNonNegativeNumber(argv[++i], '--max-median-reading-cpm');
    } else if (arg === '--max-minimum-reading-cpm' && argv[i + 1]) {
      parsed.maximumMinimumReadingCharactersPerMinute = parseNonNegativeNumber(argv[++i], '--max-minimum-reading-cpm');
    } else if (arg === '--require-length-normalized-read-time') {
      parsed.requireLengthNormalizedReadTimeForTuning = true;
    } else if (arg === '--no-require-length-normalized-read-time') {
      parsed.requireLengthNormalizedReadTimeForTuning = false;
    } else if (arg === '--max-speeding-response-ratio' && argv[i + 1]) {
      parsed.maximumSpeedingResponseRatio = parseUnitRatio(argv[++i], '--max-speeding-response-ratio');
    } else if (arg === '--max-straight-lining-response-ratio' && argv[i + 1]) {
      parsed.maximumStraightLiningResponseRatio = parseUnitRatio(argv[++i], '--max-straight-lining-response-ratio');
    } else if (arg === '--max-duplicate-response-ratio' && argv[i + 1]) {
      parsed.maximumDuplicateResponseRatio = parseUnitRatio(argv[++i], '--max-duplicate-response-ratio');
    } else if (arg === '--max-bot-suspected-response-ratio' && argv[i + 1]) {
      parsed.maximumBotSuspectedResponseRatio = parseUnitRatio(argv[++i], '--max-bot-suspected-response-ratio');
    } else if (arg === '--max-low-quality-open-ended-ratio' && argv[i + 1]) {
      parsed.maximumLowQualityOpenEndedRatio = parseUnitRatio(argv[++i], '--max-low-quality-open-ended-ratio');
    } else if (arg === '--max-inconsistent-response-ratio' && argv[i + 1]) {
      parsed.maximumInconsistentResponseRatio = parseUnitRatio(argv[++i], '--max-inconsistent-response-ratio');
    } else if (arg === '--max-quality-flagged-response-ratio' && argv[i + 1]) {
      parsed.maximumQualityFlaggedResponseRatio = parseUnitRatio(argv[++i], '--max-quality-flagged-response-ratio');
    } else if (arg === '--min-holdout-samples' && argv[i + 1]) {
      parsed.minimumHoldoutSampleCount = parsePositiveInteger(argv[++i], '--min-holdout-samples');
    } else if (arg === '--min-usable-holdout-samples' && argv[i + 1]) {
      parsed.minimumUsableHoldoutSampleCount = parsePositiveInteger(argv[++i], '--min-usable-holdout-samples');
    } else if (arg === '--require-retention-evidence') {
      parsed.requireRetentionEvidenceForTuning = true;
    } else if (arg === '--no-require-retention-evidence') {
      parsed.requireRetentionEvidenceForTuning = false;
    } else if (arg === '--min-started-readers' && argv[i + 1]) {
      parsed.minimumStartedReadCount = parsePositiveInteger(argv[++i], '--min-started-readers');
    } else if (arg === '--min-completion-rate' && argv[i + 1]) {
      parsed.minimumPanelCompletionRate = parseUnitRatio(argv[++i], '--min-completion-rate');
    } else if (arg === '--max-drop-off-ratio' && argv[i + 1]) {
      parsed.maximumDropOffRatio = parseUnitRatio(argv[++i], '--max-drop-off-ratio');
    } else if (arg === '--max-skimmed-ratio' && argv[i + 1]) {
      parsed.maximumSkimmedReadRatio = parseUnitRatio(argv[++i], '--max-skimmed-ratio');
    } else if (arg === '--require-drop-off-localization-evidence') {
      parsed.requireDropOffLocalizationEvidenceForTuning = true;
    } else if (arg === '--no-require-drop-off-localization-evidence') {
      parsed.requireDropOffLocalizationEvidenceForTuning = false;
    } else if (arg === '--min-drop-off-annotations' && argv[i + 1]) {
      parsed.minimumDropOffAnnotationCount = parsePositiveInteger(argv[++i], '--min-drop-off-annotations');
    } else if (arg === '--min-actionable-drop-off-annotations' && argv[i + 1]) {
      parsed.minimumActionableDropOffAnnotationCount = parsePositiveInteger(
        argv[++i],
        '--min-actionable-drop-off-annotations'
      );
    } else if (arg === '--require-annotation-reliability') {
      parsed.requireAnnotationReliabilityForTuning = true;
    } else if (arg === '--no-require-annotation-reliability') {
      parsed.requireAnnotationReliabilityForTuning = false;
    } else if (arg === '--min-annotation-coders' && argv[i + 1]) {
      parsed.minimumAnnotationCoderCount = parsePositiveInteger(argv[++i], '--min-annotation-coders');
    } else if (arg === '--min-annotation-double-coded' && argv[i + 1]) {
      parsed.minimumAnnotationDoubleCodedCount = parsePositiveInteger(argv[++i], '--min-annotation-double-coded');
    } else if (arg === '--min-annotation-agreement' && argv[i + 1]) {
      parsed.minimumAnnotationAgreementRate = parseUnitRatio(argv[++i], '--min-annotation-agreement');
    } else if (arg === '--require-scene-recall-evidence') {
      parsed.requireSceneRecallEvidenceForTuning = true;
    } else if (arg === '--no-require-scene-recall-evidence') {
      parsed.requireSceneRecallEvidenceForTuning = false;
    } else if (arg === '--min-unprompted-scene-recall-ratio' && argv[i + 1]) {
      parsed.minimumUnpromptedSceneRecallRatio = parseUnitRatio(argv[++i], '--min-unprompted-scene-recall-ratio');
    } else if (arg === '--min-distinctive-scene-recall-ratio' && argv[i + 1]) {
      parsed.minimumDistinctiveSceneRecallRatio = parseUnitRatio(argv[++i], '--min-distinctive-scene-recall-ratio');
    } else if (arg === '--min-scene-recall-annotations' && argv[i + 1]) {
      parsed.minimumSceneRecallAnnotationCount = parsePositiveInteger(argv[++i], '--min-scene-recall-annotations');
    } else if (arg === '--require-tension-trace-evidence') {
      parsed.requireTensionTraceEvidenceForTuning = true;
    } else if (arg === '--no-require-tension-trace-evidence') {
      parsed.requireTensionTraceEvidenceForTuning = false;
    } else if (arg === '--min-tension-trace-ratio' && argv[i + 1]) {
      parsed.minimumTensionTraceRatio = parseUnitRatio(argv[++i], '--min-tension-trace-ratio');
    } else if (arg === '--min-tension-peak-ratio' && argv[i + 1]) {
      parsed.minimumTensionPeakRatio = parseUnitRatio(argv[++i], '--min-tension-peak-ratio');
    } else if (arg === '--min-tension-question-ratio' && argv[i + 1]) {
      parsed.minimumTensionQuestionRatio = parseUnitRatio(argv[++i], '--min-tension-question-ratio');
    } else if (arg === '--min-tension-trace-annotations' && argv[i + 1]) {
      parsed.minimumTensionTraceAnnotationCount = parsePositiveInteger(argv[++i], '--min-tension-trace-annotations');
    } else if (arg === '--require-narrative-forecast-evidence') {
      parsed.requireNarrativeForecastEvidenceForTuning = true;
    } else if (arg === '--no-require-narrative-forecast-evidence') {
      parsed.requireNarrativeForecastEvidenceForTuning = false;
    } else if (arg === '--min-forecast-prediction-ratio' && argv[i + 1]) {
      parsed.minimumForecastPredictionRatio = parseUnitRatio(argv[++i], '--min-forecast-prediction-ratio');
    } else if (arg === '--min-forecast-diversity-count' && argv[i + 1]) {
      parsed.minimumForecastDiversityCount = parsePositiveInteger(argv[++i], '--min-forecast-diversity-count');
    } else if (arg === '--min-forecast-revision-ratio' && argv[i + 1]) {
      parsed.minimumForecastRevisionRatio = parseUnitRatio(argv[++i], '--min-forecast-revision-ratio');
    } else if (arg === '--min-forecast-mismatch-ratio' && argv[i + 1]) {
      parsed.minimumForecastMismatchRatio = parseUnitRatio(argv[++i], '--min-forecast-mismatch-ratio');
    } else if (arg === '--min-narrative-forecast-annotations' && argv[i + 1]) {
      parsed.minimumNarrativeForecastAnnotationCount = parsePositiveInteger(argv[++i], '--min-narrative-forecast-annotations');
    } else if (arg === '--require-line-quote-evidence') {
      parsed.requireLineQuoteEvidenceForTuning = true;
    } else if (arg === '--no-require-line-quote-evidence') {
      parsed.requireLineQuoteEvidenceForTuning = false;
    } else if (arg === '--min-quote-recall-ratio' && argv[i + 1]) {
      parsed.minimumQuoteRecallRatio = parseUnitRatio(argv[++i], '--min-quote-recall-ratio');
    } else if (arg === '--min-favorite-line-ratio' && argv[i + 1]) {
      parsed.minimumFavoriteLineRatio = parseUnitRatio(argv[++i], '--min-favorite-line-ratio');
    } else if (arg === '--min-shareable-line-ratio' && argv[i + 1]) {
      parsed.minimumShareableLineRatio = parseUnitRatio(argv[++i], '--min-shareable-line-ratio');
    } else if (arg === '--min-line-quote-annotations' && argv[i + 1]) {
      parsed.minimumLineQuoteAnnotationCount = parsePositiveInteger(argv[++i], '--min-line-quote-annotations');
    } else if (arg === '--require-payoff-fairness-evidence') {
      parsed.requirePayoffFairnessEvidenceForTuning = true;
    } else if (arg === '--no-require-payoff-fairness-evidence') {
      parsed.requirePayoffFairnessEvidenceForTuning = false;
    } else if (arg === '--min-payoff-setup-recall-ratio' && argv[i + 1]) {
      parsed.minimumPayoffSetupRecallRatio = parseUnitRatio(argv[++i], '--min-payoff-setup-recall-ratio');
    } else if (arg === '--min-payoff-trigger-recognition-ratio' && argv[i + 1]) {
      parsed.minimumPayoffTriggerRecognitionRatio = parseUnitRatio(argv[++i], '--min-payoff-trigger-recognition-ratio');
    } else if (arg === '--min-payoff-earned-ratio' && argv[i + 1]) {
      parsed.minimumPayoffEarnedRatio = parseUnitRatio(argv[++i], '--min-payoff-earned-ratio');
    } else if (arg === '--min-payoff-recontextualization-ratio' && argv[i + 1]) {
      parsed.minimumPayoffRecontextualizationRatio = parseUnitRatio(argv[++i], '--min-payoff-recontextualization-ratio');
    } else if (arg === '--min-payoff-emotional-satisfaction-ratio' && argv[i + 1]) {
      parsed.minimumPayoffEmotionalSatisfactionRatio = parseUnitRatio(argv[++i], '--min-payoff-emotional-satisfaction-ratio');
    } else if (arg === '--min-payoff-fairness-annotations' && argv[i + 1]) {
      parsed.minimumPayoffFairnessAnnotationCount = parsePositiveInteger(argv[++i], '--min-payoff-fairness-annotations');
    } else if (arg === '--require-advocacy-evidence') {
      parsed.requireAdvocacyEvidenceForTuning = true;
    } else if (arg === '--no-require-advocacy-evidence') {
      parsed.requireAdvocacyEvidenceForTuning = false;
    } else if (arg === '--min-organic-recommendation-ratio' && argv[i + 1]) {
      parsed.minimumOrganicRecommendationRatio = parseUnitRatio(argv[++i], '--min-organic-recommendation-ratio');
    } else if (arg === '--min-discussion-prompt-ratio' && argv[i + 1]) {
      parsed.minimumDiscussionPromptRatio = parseUnitRatio(argv[++i], '--min-discussion-prompt-ratio');
    } else if (arg === '--min-advocacy-annotations' && argv[i + 1]) {
      parsed.minimumAdvocacyAnnotationCount = parsePositiveInteger(argv[++i], '--min-advocacy-annotations');
    } else if (arg === '--require-durable-engagement-evidence') {
      parsed.requireDurableEngagementEvidenceForTuning = true;
    } else if (arg === '--no-require-durable-engagement-evidence') {
      parsed.requireDurableEngagementEvidenceForTuning = false;
    } else if (arg === '--min-bookmark-ratio' && argv[i + 1]) {
      parsed.minimumBookmarkRatio = parseUnitRatio(argv[++i], '--min-bookmark-ratio');
    } else if (arg === '--min-return-intent-ratio' && argv[i + 1]) {
      parsed.minimumReturnIntentRatio = parseUnitRatio(argv[++i], '--min-return-intent-ratio');
    } else if (arg === '--min-paid-continuation-intent-ratio' && argv[i + 1]) {
      parsed.minimumPaidContinuationIntentRatio = parseUnitRatio(argv[++i], '--min-paid-continuation-intent-ratio');
    } else if (arg === '--min-durable-engagement-annotations' && argv[i + 1]) {
      parsed.minimumDurableEngagementAnnotationCount = parsePositiveInteger(argv[++i], '--min-durable-engagement-annotations');
    } else if (arg === '--require-continuation-behavior-evidence') {
      parsed.requireContinuationBehaviorEvidenceForTuning = true;
    } else if (arg === '--no-require-continuation-behavior-evidence') {
      parsed.requireContinuationBehaviorEvidenceForTuning = false;
    } else if (arg === '--min-continuation-behavior-impressions' && argv[i + 1]) {
      parsed.minimumContinuationBehaviorImpressionCount = parsePositiveInteger(
        argv[++i],
        '--min-continuation-behavior-impressions'
      );
    } else if (arg === '--min-next-chapter-click-through-ratio' && argv[i + 1]) {
      parsed.minimumNextChapterClickThroughRatio = parseUnitRatio(
        argv[++i],
        '--min-next-chapter-click-through-ratio'
      );
    } else if (arg === '--min-next-chapter-open-ratio' && argv[i + 1]) {
      parsed.minimumNextChapterOpenRatio = parseUnitRatio(argv[++i], '--min-next-chapter-open-ratio');
    } else if (arg === '--min-next-chapter-read-start-ratio' && argv[i + 1]) {
      parsed.minimumNextChapterReadStartRatio = parseUnitRatio(
        argv[++i],
        '--min-next-chapter-read-start-ratio'
      );
    } else if (arg === '--require-resonance-evidence') {
      parsed.requireResonanceEvidenceForTuning = true;
    } else if (arg === '--no-require-resonance-evidence') {
      parsed.requireResonanceEvidenceForTuning = false;
    } else if (arg === '--min-lingering-emotion-ratio' && argv[i + 1]) {
      parsed.minimumLingeringEmotionRatio = parseUnitRatio(argv[++i], '--min-lingering-emotion-ratio');
    } else if (arg === '--min-reflective-meaning-ratio' && argv[i + 1]) {
      parsed.minimumReflectiveMeaningRatio = parseUnitRatio(argv[++i], '--min-reflective-meaning-ratio');
    } else if (arg === '--min-resonance-annotations' && argv[i + 1]) {
      parsed.minimumResonanceAnnotationCount = parsePositiveInteger(argv[++i], '--min-resonance-annotations');
    } else if (arg === '--require-delayed-memory-evidence') {
      parsed.requireDelayedMemoryEvidenceForTuning = true;
    } else if (arg === '--no-require-delayed-memory-evidence') {
      parsed.requireDelayedMemoryEvidenceForTuning = false;
    } else if (arg === '--min-delayed-follow-up-ratio' && argv[i + 1]) {
      parsed.minimumDelayedFollowUpRespondentRatio = parseUnitRatio(argv[++i], '--min-delayed-follow-up-ratio');
    } else if (arg === '--min-delayed-follow-up-hours' && argv[i + 1]) {
      parsed.minimumDelayedFollowUpHours = parseNonNegativeNumber(argv[++i], '--min-delayed-follow-up-hours');
    } else if (arg === '--min-delayed-scene-recall-ratio' && argv[i + 1]) {
      parsed.minimumDelayedSceneRecallRatio = parseUnitRatio(argv[++i], '--min-delayed-scene-recall-ratio');
    } else if (arg === '--min-delayed-character-recall-ratio' && argv[i + 1]) {
      parsed.minimumDelayedCharacterRecallRatio = parseUnitRatio(argv[++i], '--min-delayed-character-recall-ratio');
    } else if (arg === '--min-delayed-continuation-intent-ratio' && argv[i + 1]) {
      parsed.minimumDelayedContinuationIntentRatio = parseUnitRatio(argv[++i], '--min-delayed-continuation-intent-ratio');
    } else if (arg === '--min-delayed-memory-annotations' && argv[i + 1]) {
      parsed.minimumDelayedMemoryAnnotationCount = parsePositiveInteger(argv[++i], '--min-delayed-memory-annotations');
    } else if (arg === '--require-comparative-preference') {
      parsed.requireComparativePreferenceForTuning = true;
    } else if (arg === '--min-comparative-win-rate' && argv[i + 1]) {
      parsed.minimumComparativePreferenceWinRate = parseUnitRatio(argv[++i], '--min-comparative-win-rate');
    } else if (arg === '--min-comparative-respondents' && argv[i + 1]) {
      parsed.minimumComparativePreferenceRespondentCount = parsePositiveInteger(argv[++i], '--min-comparative-respondents');
    } else if (arg === '--require-revision-outcome-evidence') {
      parsed.requireRevisionOutcomeEvidenceForTuning = true;
    } else if (arg === '--no-require-revision-outcome-evidence') {
      parsed.requireRevisionOutcomeEvidenceForTuning = false;
    } else if (arg === '--min-revision-lift' && argv[i + 1]) {
      parsed.minimumRevisionLift = parseNonNegativeNumber(argv[++i], '--min-revision-lift');
    } else if (arg === '--min-revision-preference-win-rate' && argv[i + 1]) {
      parsed.minimumRevisionPreferenceWinRate = parseUnitRatio(argv[++i], '--min-revision-preference-win-rate');
    } else if (arg === '--min-revision-preference-respondents' && argv[i + 1]) {
      parsed.minimumRevisionPreferenceRespondentCount = parsePositiveInteger(argv[++i], '--min-revision-preference-respondents');
    } else if (arg === '--required-genres' && argv[i + 1]) {
      parsed.requiredGenres = parseList(argv[++i]);
    } else if (arg === '--required-target-reader-segments' && argv[i + 1]) {
      parsed.requiredTargetReaderSegments = parseList(argv[++i]);
    } else if (arg === '--min-respondents-per-required-target-segment' && argv[i + 1]) {
      parsed.minimumRespondentsPerRequiredTargetSegment = parsePositiveInteger(
        argv[++i],
        '--min-respondents-per-required-target-segment'
      );
    } else if (arg === '--require-target-reader-segment-quotas') {
      parsed.requireTargetReaderSegmentQuotasForTuning = true;
    } else if (arg === '--no-require-target-reader-segment-quotas') {
      parsed.requireTargetReaderSegmentQuotasForTuning = false;
    } else if (arg === '--required-recruitment-channels' && argv[i + 1]) {
      parsed.requiredRecruitmentChannels = parseList(argv[++i]);
    } else if (arg === '--min-respondents-per-required-recruitment-channel' && argv[i + 1]) {
      parsed.minimumRespondentsPerRequiredRecruitmentChannel = parsePositiveInteger(
        argv[++i],
        '--min-respondents-per-required-recruitment-channel'
      );
    } else if (arg === '--max-dominant-recruitment-channel-ratio' && argv[i + 1]) {
      parsed.maximumDominantRecruitmentChannelRatio = parseUnitRatio(
        argv[++i],
        '--max-dominant-recruitment-channel-ratio'
      );
    } else if (arg === '--require-recruitment-channel-diversity') {
      parsed.requireRecruitmentChannelDiversityForTuning = true;
    } else if (arg === '--no-require-recruitment-channel-diversity') {
      parsed.requireRecruitmentChannelDiversityForTuning = false;
    } else if (arg === '--max-samples-per-respondent' && argv[i + 1]) {
      parsed.maximumSamplesPerRespondent = parsePositiveInteger(argv[++i], '--max-samples-per-respondent');
    } else if (arg === '--min-order-balance-ratio' && argv[i + 1]) {
      parsed.minimumOrderBalanceRatio = parseUnitRatio(argv[++i], '--min-order-balance-ratio');
    } else if (arg === '--min-samples-per-genre' && argv[i + 1]) {
      parsed.minimumSamplesPerGenre = parsePositiveInteger(argv[++i], '--min-samples-per-genre');
    } else if (arg === '--min-usable-samples-per-genre' && argv[i + 1]) {
      parsed.minimumUsableSamplesPerGenre = parsePositiveInteger(argv[++i], '--min-usable-samples-per-genre');
    } else if (arg === '--required-series-length' && argv[i + 1]) {
      parsed.requiredSeriesLength = parsePositiveInteger(argv[++i], '--required-series-length');
    } else if (arg === '--required-usable-series-length' && argv[i + 1]) {
      parsed.requiredUsableSeriesLength = parsePositiveInteger(argv[++i], '--required-usable-series-length');
    } else if (arg === '--required-chapter-range' && argv[i + 1]) {
      parsed.requiredChapterRanges = [
        ...(parsed.requiredChapterRanges ?? []),
        parseChapterRange(argv[++i]),
      ];
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

  return parsed as CliArgs;
}

function parseList(value: string): string[] {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

function parseChapterRange(value: string): NonNullable<CliArgs['requiredChapterRanges']>[number] {
  const [id, chapterRange, minimumSamples, minimumUsableSamples, genres] = value.split(':');
  if (!id || !chapterRange) {
    throw new Error('--required-chapter-range must use id:min-max:minSamples:minUsableSamples:genres');
  }

  const [minChapter, maxChapter] = chapterRange.split('-');
  const parsedMinChapter = parsePositiveInteger(minChapter, '--required-chapter-range min chapter');
  const parsedMaxChapter = maxChapter && maxChapter !== '*'
    ? parsePositiveInteger(maxChapter, '--required-chapter-range max chapter')
    : undefined;

  if (parsedMaxChapter !== undefined && parsedMaxChapter < parsedMinChapter) {
    throw new Error('--required-chapter-range max chapter must be greater than or equal to min chapter');
  }

  return {
    id,
    minChapter: parsedMinChapter,
    maxChapter: parsedMaxChapter,
    minimumSamples: minimumSamples
      ? parsePositiveInteger(minimumSamples, '--required-chapter-range minimum samples')
      : undefined,
    minimumUsableSamples: minimumUsableSamples
      ? parsePositiveInteger(minimumUsableSamples, '--required-chapter-range minimum usable samples')
      : undefined,
    requiredGenres: genres ? parseList(genres) : undefined,
  };
}

function parsePositiveInteger(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
}

function parseNonNegativeNumber(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} must be a non-negative number`);
  }
  return parsed;
}

function parseUnitRatio(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} must be a ratio between 0 and 1, or a percentage between 0 and 100`);
  }
  if (parsed <= 1) return parsed;
  if (parsed <= 100) return parsed / 100;
  throw new Error(`${label} must be a ratio between 0 and 1, or a percentage between 0 and 100`);
}

function renderText(result: CalibrateReaderResponseCliResult): string {
  const calibration = result.calibration;
  const evidenceCollectionPlan = calibration.evidenceCollectionPlan ?? [];
  return [
    `Reader response calibration: ${calibration.calibrationScore}/100`,
    `Samples: ${result.samplesLoaded}, MAE=${calibration.meanAbsoluteError}, false positives=${calibration.falsePositiveCount}, false negatives=${calibration.falseNegativeCount}`,
    `Holdout: total=${calibration.splitCoverage.holdoutSamples}, usable=${calibration.splitCoverage.usableHoldoutSamples}, under-sampled=${calibration.underSampledHoldoutSamples ? 'yes' : 'no'}, usable under-sampled=${calibration.underSampledUsableHoldoutSamples ? 'yes' : 'no'}`,
    `Human reader evidence: present=${calibration.humanReaderEvidenceCount}, weak/missing=${calibration.lowHumanReaderEvidenceCount}`,
    `Response data quality: present=${calibration.responseDataQualityEvidenceCount}, weak/missing=${calibration.lowResponseDataQualityCount}`,
    `Retention evidence: present=${calibration.retentionEvidenceCount}, weak/missing=${calibration.lowRetentionEvidenceCount}`,
    `Drop-off localization: present=${calibration.dropOffLocalizationEvidenceCount}, weak/missing=${calibration.lowDropOffLocalizationEvidenceCount}`,
    `Annotation reliability: present=${calibration.annotationReliabilityEvidenceCount}, weak/missing=${calibration.lowAnnotationReliabilityCount}`,
    `Scene recall evidence: present=${calibration.sceneRecallEvidenceCount}, weak/missing=${calibration.lowSceneRecallEvidenceCount}`,
    `Tension trace evidence: present=${calibration.tensionTraceEvidenceCount}, weak/missing=${calibration.lowTensionTraceEvidenceCount}`,
    `Narrative forecast evidence: present=${calibration.narrativeForecastEvidenceCount}, weak/missing=${calibration.lowNarrativeForecastEvidenceCount}`,
    `Payoff fairness evidence: present=${calibration.payoffFairnessEvidenceCount}, weak/missing=${calibration.lowPayoffFairnessEvidenceCount}`,
    `Advocacy evidence: present=${calibration.advocacyEvidenceCount}, weak/missing=${calibration.lowAdvocacyEvidenceCount}`,
    `Durable engagement evidence: present=${calibration.durableEngagementEvidenceCount}, weak/missing=${calibration.lowDurableEngagementEvidenceCount}`,
    `Continuation behavior evidence: present=${calibration.continuationBehaviorEvidenceCount}, weak/missing=${calibration.lowContinuationBehaviorEvidenceCount}`,
    `Resonance evidence: present=${calibration.resonanceEvidenceCount}, weak/missing=${calibration.lowResonanceEvidenceCount}`,
    `Delayed memory evidence: present=${calibration.delayedMemoryEvidenceCount}, weak/missing=${calibration.lowDelayedMemoryEvidenceCount}`,
    `Comparative preference: evidence=${calibration.comparativePreferenceEvidenceCount}, weak=${calibration.weakComparativePreferenceCount}, missing=${calibration.missingComparativePreferenceCount}, avg win rate=${calibration.comparativePreferenceAverageWinRate ?? 'n/a'}`,
    `Revision outcome: evidence=${calibration.revisionOutcomeEvidenceCount}, improved=${calibration.revisionImprovementCount}, weak/regressed=${calibration.lowRevisionOutcomeEvidenceCount}, regressions=${calibration.revisionRegressionCount}`,
    `Coverage gaps: missing genres=${formatList(calibration.missingRequiredGenres)}, undersampled=${formatList(calibration.underSampledRequiredGenres)}, usable undersampled=${formatList(calibration.underSampledUsableRequiredGenres)}`,
    `Series gaps: consecutive=${formatList(calibration.missingRequiredSeriesGenres)}, usable consecutive=${formatList(calibration.missingRequiredUsableSeriesGenres)}`,
    `Chapter range gaps: samples=${formatList(calibration.underSampledRequiredChapterRanges)}, usable=${formatList(calibration.underSampledUsableRequiredChapterRanges)}, genres=${formatList(calibration.missingRequiredChapterRangeGenres)}, usable genres=${formatList(calibration.missingRequiredUsableChapterRangeGenres)}`,
    `Gate tuning ready: ${calibration.readyForGateTuning ? 'yes' : 'no'}`,
    `Gate tuning suggestions: ${formatList(calibration.gateTuningSuggestions.map(suggestion => suggestion.code))}`,
    `Evidence collection plan: ${evidenceCollectionPlan.length} task(s)`,
    ...evidenceCollectionPlan.slice(0, 5).map(task => (
      `  - [${task.priority}] ${task.id}: ${task.action}`
    )),
    `Stored: ${result.outputPath}`,
  ].join('\n');
}

function formatList(values: string[]): string {
  return values.length === 0 ? 'none' : values.join(', ');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await calibrateReaderResponseFromProject(args);

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
