#!/usr/bin/env node

/**
 * Run labeled long-series retention benchmark samples for a project.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
export {
  runSeriesRetentionBenchmarkFromProject,
  type RunSeriesRetentionBenchmarkCliResult,
} from './series-retention-benchmark-project.js';
import {
  runSeriesRetentionBenchmarkFromProject,
  type RunSeriesRetentionBenchmarkCliResult,
} from './series-retention-benchmark-project.js';

interface CliArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  readerRetentionThreshold?: number;
  automatedRetentionThreshold?: number;
  minimumDimensionScore?: number;
  requiredGenres?: string[];
  requiredTargetReaders?: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumStartedReadCount?: number;
  minimumCompletionRate?: number;
  minimumContinuationRate?: number;
  maximumDropOffRatio?: number;
  maximumSkimmedReadRatio?: number;
  requireFunnelEvidence?: boolean;
  requireHookProgressEvidence?: boolean;
  minimumHookProgressEventCount?: number;
  minimumHookProgressRate?: number;
  maximumHookStallRatio?: number;
  minimumSequenceLength?: number;
  maximumRetentionDrop?: number;
  maximumRepeatedRewardSignatureRun?: number;
  maximumRepeatedEmotionalSignatureRun?: number;
  maximumDominantEmotionalSignatureFamilyShare?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  json: boolean;
}

const USAGE = `Usage:
  node dist/cli/run-series-retention-benchmark.js --project <PATH> [--input-dir <PATH>] [--output <PATH>] [--project-id <ID>] [--required-genres mystery,romance] [--required-target-readers webnovel-core] [--reader-retention-threshold 72] [--automated-retention-threshold 85] [--minimum-dimension-score 60] [--minimum-panel-size 3] [--minimum-commented-responses 2] [--minimum-started-read-count 20] [--minimum-completion-rate 0.72] [--minimum-continuation-rate 0.55] [--maximum-drop-off-ratio 0.25] [--maximum-skimmed-read-ratio 0.2] [--no-require-funnel-evidence] [--require-hook-progress-evidence] [--no-require-hook-progress-evidence] [--minimum-hook-progress-event-count 1] [--minimum-hook-progress-rate 0.5] [--maximum-hook-stall-ratio 0.5] [--minimum-sequence-length 3] [--maximum-retention-drop 12] [--maximum-repeated-reward-signature-run 2] [--maximum-repeated-emotional-signature-run 2] [--maximum-dominant-emotional-signature-family-share 0.67] [--minimum-samples-per-genre 2] [--minimum-samples-per-target-reader 2] [--min-holdout-samples 1] [--min-usable-holdout-samples 1] [--min-failing-holdout-samples 1] [--min-usable-failing-holdout-samples 1] [--json]

Reads labeled long-series retention samples from reviews/series-retention-benchmark/ and writes reviews/series-retention-benchmark-report.json.`;

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
    } else if (arg === '--required-genres' && argv[i + 1]) {
      parsed.requiredGenres = parseList(argv[++i]);
    } else if (arg === '--required-target-readers' && argv[i + 1]) {
      parsed.requiredTargetReaders = parseList(argv[++i]);
    } else if (arg === '--reader-retention-threshold' && argv[i + 1]) {
      parsed.readerRetentionThreshold = parseScore(argv[++i], '--reader-retention-threshold');
    } else if (arg === '--automated-retention-threshold' && argv[i + 1]) {
      parsed.automatedRetentionThreshold = parseScore(
        argv[++i],
        '--automated-retention-threshold'
      );
    } else if (arg === '--minimum-dimension-score' && argv[i + 1]) {
      parsed.minimumDimensionScore = parseScore(argv[++i], '--minimum-dimension-score');
    } else if (arg === '--minimum-panel-size' && argv[i + 1]) {
      parsed.minimumPanelSize = parsePositiveInteger(argv[++i], '--minimum-panel-size');
    } else if (arg === '--minimum-commented-responses' && argv[i + 1]) {
      parsed.minimumCommentedResponses = parsePositiveInteger(
        argv[++i],
        '--minimum-commented-responses'
      );
    } else if (arg === '--minimum-started-read-count' && argv[i + 1]) {
      parsed.minimumStartedReadCount = parsePositiveInteger(
        argv[++i],
        '--minimum-started-read-count'
      );
    } else if (arg === '--minimum-completion-rate' && argv[i + 1]) {
      parsed.minimumCompletionRate = parseRatio(argv[++i], '--minimum-completion-rate');
    } else if (arg === '--minimum-continuation-rate' && argv[i + 1]) {
      parsed.minimumContinuationRate = parseRatio(argv[++i], '--minimum-continuation-rate');
    } else if (arg === '--maximum-drop-off-ratio' && argv[i + 1]) {
      parsed.maximumDropOffRatio = parseRatio(argv[++i], '--maximum-drop-off-ratio');
    } else if (arg === '--maximum-skimmed-read-ratio' && argv[i + 1]) {
      parsed.maximumSkimmedReadRatio = parseRatio(argv[++i], '--maximum-skimmed-read-ratio');
    } else if (arg === '--require-funnel-evidence') {
      parsed.requireFunnelEvidence = true;
    } else if (arg === '--no-require-funnel-evidence') {
      parsed.requireFunnelEvidence = false;
    } else if (arg === '--require-hook-progress-evidence') {
      parsed.requireHookProgressEvidence = true;
    } else if (arg === '--no-require-hook-progress-evidence') {
      parsed.requireHookProgressEvidence = false;
    } else if (arg === '--minimum-hook-progress-event-count' && argv[i + 1]) {
      parsed.minimumHookProgressEventCount = parsePositiveInteger(
        argv[++i],
        '--minimum-hook-progress-event-count'
      );
    } else if (arg === '--minimum-hook-progress-rate' && argv[i + 1]) {
      parsed.minimumHookProgressRate = parseRatio(argv[++i], '--minimum-hook-progress-rate');
    } else if (arg === '--maximum-hook-stall-ratio' && argv[i + 1]) {
      parsed.maximumHookStallRatio = parseRatio(argv[++i], '--maximum-hook-stall-ratio');
    } else if (arg === '--minimum-sequence-length' && argv[i + 1]) {
      parsed.minimumSequenceLength = parsePositiveInteger(
        argv[++i],
        '--minimum-sequence-length'
      );
    } else if (arg === '--maximum-retention-drop' && argv[i + 1]) {
      parsed.maximumRetentionDrop = parseScore(argv[++i], '--maximum-retention-drop');
    } else if (arg === '--maximum-repeated-reward-signature-run' && argv[i + 1]) {
      parsed.maximumRepeatedRewardSignatureRun = parsePositiveInteger(
        argv[++i],
        '--maximum-repeated-reward-signature-run'
      );
    } else if (arg === '--maximum-repeated-emotional-signature-run' && argv[i + 1]) {
      parsed.maximumRepeatedEmotionalSignatureRun = parsePositiveInteger(
        argv[++i],
        '--maximum-repeated-emotional-signature-run'
      );
    } else if (
      arg === '--maximum-dominant-emotional-signature-family-share' &&
      argv[i + 1]
    ) {
      parsed.maximumDominantEmotionalSignatureFamilyShare = parseRatio(
        argv[++i],
        '--maximum-dominant-emotional-signature-family-share'
      );
    } else if (arg === '--minimum-samples-per-genre' && argv[i + 1]) {
      parsed.minimumSamplesPerGenre = parsePositiveInteger(
        argv[++i],
        '--minimum-samples-per-genre'
      );
    } else if (arg === '--minimum-samples-per-target-reader' && argv[i + 1]) {
      parsed.minimumSamplesPerTargetReader = parsePositiveInteger(
        argv[++i],
        '--minimum-samples-per-target-reader'
      );
    } else if (arg === '--min-holdout-samples' && argv[i + 1]) {
      parsed.minimumHoldoutSampleCount = parsePositiveInteger(
        argv[++i],
        '--min-holdout-samples'
      );
    } else if (arg === '--min-usable-holdout-samples' && argv[i + 1]) {
      parsed.minimumUsableHoldoutSampleCount = parsePositiveInteger(
        argv[++i],
        '--min-usable-holdout-samples'
      );
    } else if (arg === '--min-failing-holdout-samples' && argv[i + 1]) {
      parsed.minimumFailingHoldoutSampleCount = parsePositiveInteger(
        argv[++i],
        '--min-failing-holdout-samples'
      );
    } else if (arg === '--min-usable-failing-holdout-samples' && argv[i + 1]) {
      parsed.minimumUsableFailingHoldoutSampleCount = parsePositiveInteger(
        argv[++i],
        '--min-usable-failing-holdout-samples'
      );
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
    .filter(Boolean);
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

function renderText(result: RunSeriesRetentionBenchmarkCliResult): string {
  const benchmark = result.benchmark;
  const split = benchmark.splitCoverage;
  return [
    `Series retention benchmark: ${benchmark.passed}/${benchmark.total} samples passed (${Math.round(benchmark.accuracy * 100)}%)`,
    `Failures: auto false positives=${benchmark.automatedFalsePositiveCount}, auto false negatives=${benchmark.automatedFalseNegativeCount}, reader label mismatches=${benchmark.readerLabelMismatchCount}, weak retention=${benchmark.weakReaderRetentionCount}, weak dimensions=${benchmark.weakDimensionCount}, retention drops=${benchmark.retentionDropCount}, funnel drops=${benchmark.funnelDropCount}, weak funnel evidence=${benchmark.weakFunnelEvidenceCount}, hook stalls=${benchmark.hookStallCount}, weak hook progress evidence=${benchmark.weakHookProgressEvidenceCount}, repeated rewards=${benchmark.repetitiveRewardPatternCount}, repeated emotional arcs=${benchmark.repetitiveEmotionalPatternCount}, narrow emotional palettes=${benchmark.narrowEmotionalPaletteCount}, insufficient evidence=${benchmark.insufficientEvidenceCount}, short sequences=${benchmark.shortSequenceCount}`,
    `Coverage gaps: genres=${benchmark.missingRequiredGenres.join(', ') || 'none'}, target readers=${benchmark.missingRequiredTargetReaders.join(', ') || 'none'}`,
    `Polarity gaps: genre positive=${benchmark.missingRequiredPositiveGenres.join(', ') || 'none'}, genre negative=${benchmark.missingRequiredNegativeGenres.join(', ') || 'none'}, target positive=${benchmark.missingRequiredPositiveTargetReaders.join(', ') || 'none'}, target negative=${benchmark.missingRequiredNegativeTargetReaders.join(', ') || 'none'}`,
    `Holdout: samples=${split.holdoutSamples}, evidence-sufficient=${split.usableHoldoutSamples}, known-drop=${split.failingHoldoutSamples}, evidence-sufficient known-drop=${split.usableFailingHoldoutSamples}, ready=${benchmark.readyForGateTuning ? 'yes' : 'no'}`,
    `Split leakage: ${benchmark.splitLeakageCount}`,
    `Stored: ${result.outputPath}`,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await runSeriesRetentionBenchmarkFromProject(args);

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
