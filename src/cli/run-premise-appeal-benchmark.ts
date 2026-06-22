#!/usr/bin/env node

/**
 * Run labeled premise appeal benchmark samples for a project.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
export {
  runPremiseAppealBenchmarkFromProject,
  type RunPremiseAppealBenchmarkCliResult,
} from './premise-appeal-benchmark-project.js';
import {
  runPremiseAppealBenchmarkFromProject,
  type RunPremiseAppealBenchmarkCliResult,
} from './premise-appeal-benchmark-project.js';

interface CliArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  requiredGenres?: string[];
  requiredTargetReaders?: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  minimumBehavioralImpressionCount?: number;
  minimumClickThroughRate?: number;
  minimumFirstChapterOpenRate?: number;
  minimumSaveOrFollowRate?: number;
  minimumBehavioralObservationWindowHours?: number;
  minimumSampleRatioMismatchPValue?: number;
  requirePromiseEvidenceForGateTuning?: boolean;
  requireBehavioralIntentEvidenceForGateTuning?: boolean;
  requireBehavioralProtocolForGateTuning?: boolean;
  requireBehavioralAllocationIntegrityForGateTuning?: boolean;
  json: boolean;
}

const USAGE = `Usage:
  node dist/cli/run-premise-appeal-benchmark.js --project <PATH> [--input-dir <PATH>] [--output <PATH>] [--project-id <ID>] [--required-genres mystery,romance] [--required-target-readers webnovel-core] [--minimum-panel-size 3] [--minimum-commented-responses 2] [--minimum-samples-per-genre 2] [--minimum-samples-per-target-reader 2] [--min-holdout-samples 2] [--min-usable-holdout-samples 2] [--min-failing-holdout-samples 1] [--min-usable-failing-holdout-samples 1] [--require-promise-evidence] [--no-require-promise-evidence] [--require-behavioral-intent-evidence] [--no-require-behavioral-intent-evidence] [--require-behavioral-protocol] [--no-require-behavioral-protocol] [--require-behavioral-allocation-integrity] [--no-require-behavioral-allocation-integrity] [--min-behavioral-impressions 100] [--min-click-through-rate 0.04] [--min-first-chapter-open-rate 0.025] [--min-save-or-follow-rate 0.008] [--min-behavioral-observation-hours 24] [--min-srm-p-value 0.001] [--json]

Reads labeled premise appeal samples from reviews/premise-appeal-benchmark/ and writes reviews/premise-appeal-benchmark-report.json.`;

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
    } else if (arg === '--minimum-panel-size' && argv[i + 1]) {
      parsed.minimumPanelSize = parsePositiveInteger(argv[++i], '--minimum-panel-size');
    } else if (arg === '--minimum-commented-responses' && argv[i + 1]) {
      parsed.minimumCommentedResponses = parsePositiveInteger(
        argv[++i],
        '--minimum-commented-responses'
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
      parsed.minimumHoldoutSampleCount = parsePositiveInteger(argv[++i], '--min-holdout-samples');
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
    } else if (arg === '--min-behavioral-impressions' && argv[i + 1]) {
      parsed.minimumBehavioralImpressionCount = parsePositiveInteger(
        argv[++i],
        '--min-behavioral-impressions'
      );
    } else if (arg === '--min-click-through-rate' && argv[i + 1]) {
      parsed.minimumClickThroughRate = parseRatio(argv[++i], '--min-click-through-rate');
    } else if (arg === '--min-first-chapter-open-rate' && argv[i + 1]) {
      parsed.minimumFirstChapterOpenRate = parseRatio(
        argv[++i],
        '--min-first-chapter-open-rate'
      );
    } else if (arg === '--min-save-or-follow-rate' && argv[i + 1]) {
      parsed.minimumSaveOrFollowRate = parseRatio(argv[++i], '--min-save-or-follow-rate');
    } else if (arg === '--min-behavioral-observation-hours' && argv[i + 1]) {
      parsed.minimumBehavioralObservationWindowHours = parsePositiveInteger(
        argv[++i],
        '--min-behavioral-observation-hours'
      );
    } else if (arg === '--min-srm-p-value' && argv[i + 1]) {
      parsed.minimumSampleRatioMismatchPValue = parseRatio(argv[++i], '--min-srm-p-value');
    } else if (arg === '--require-promise-evidence') {
      parsed.requirePromiseEvidenceForGateTuning = true;
    } else if (arg === '--no-require-promise-evidence') {
      parsed.requirePromiseEvidenceForGateTuning = false;
    } else if (arg === '--require-behavioral-intent-evidence') {
      parsed.requireBehavioralIntentEvidenceForGateTuning = true;
    } else if (arg === '--no-require-behavioral-intent-evidence') {
      parsed.requireBehavioralIntentEvidenceForGateTuning = false;
    } else if (arg === '--require-behavioral-protocol') {
      parsed.requireBehavioralProtocolForGateTuning = true;
    } else if (arg === '--no-require-behavioral-protocol') {
      parsed.requireBehavioralProtocolForGateTuning = false;
    } else if (arg === '--require-behavioral-allocation-integrity') {
      parsed.requireBehavioralAllocationIntegrityForGateTuning = true;
    } else if (arg === '--no-require-behavioral-allocation-integrity') {
      parsed.requireBehavioralAllocationIntegrityForGateTuning = false;
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

function parseRatio(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new Error(`${label} must be a number between 0 and 1`);
  }
  return parsed;
}

function renderText(result: RunPremiseAppealBenchmarkCliResult): string {
  const benchmark = result.benchmark;
  const split = benchmark.splitCoverage;
  return [
    `Premise appeal benchmark: ${benchmark.passed}/${benchmark.total} samples passed (${Math.round(benchmark.accuracy * 100)}%)`,
    `Failures: auto false positives=${benchmark.automatedFalsePositiveCount}, auto false negatives=${benchmark.automatedFalseNegativeCount}, reader label mismatches=${benchmark.readerLabelMismatchCount}, behavioral false positives=${benchmark.behavioralIntentFalsePositiveCount}, weak promise evidence=${benchmark.weakPromiseEvidenceCount}, weak appeal=${benchmark.weakReaderAppealCount}, weak dimensions=${benchmark.weakDimensionCount}, insufficient reader evidence=${benchmark.insufficientEvidenceCount}, low behavioral evidence=${benchmark.lowBehavioralIntentEvidenceCount}, weak behavioral protocol=${benchmark.weakBehavioralProtocolCount}, weak behavioral allocation=${benchmark.weakBehavioralAllocationCount}`,
    `Evidence: usable promise=${benchmark.promiseEvidenceCount}, behavioral intent=${benchmark.behavioralIntentEvidenceCount}, behavioral protocol=${benchmark.behavioralProtocolEvidenceCount}, behavioral allocation=${benchmark.behavioralAllocationEvidenceCount}`,
    `Coverage gaps: genres=${benchmark.missingRequiredGenres.join(', ') || 'none'}, target readers=${benchmark.missingRequiredTargetReaders.join(', ') || 'none'}`,
    `Polarity gaps: genre positive=${benchmark.missingRequiredPositiveGenres.join(', ') || 'none'}, genre negative=${benchmark.missingRequiredNegativeGenres.join(', ') || 'none'}, target positive=${benchmark.missingRequiredPositiveTargetReaders.join(', ') || 'none'}, target negative=${benchmark.missingRequiredNegativeTargetReaders.join(', ') || 'none'}`,
    `Holdout: samples=${split.holdoutSamples}, evidence-sufficient=${split.usableHoldoutSamples}, known-bad=${split.failingHoldoutSamples}, evidence-sufficient known-bad=${split.usableFailingHoldoutSamples}, ready=${benchmark.readyForGateTuning ? 'yes' : 'no'}`,
    `Split leakage: ${benchmark.splitLeakageCount}`,
    `Stored: ${result.outputPath}`,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await runPremiseAppealBenchmarkFromProject(args);

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
