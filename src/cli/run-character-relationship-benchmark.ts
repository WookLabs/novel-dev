#!/usr/bin/env node

/**
 * Run labeled character/relationship investment benchmark samples for a project.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
export {
  runCharacterRelationshipBenchmarkFromProject,
  type RunCharacterRelationshipBenchmarkCliResult,
} from './character-relationship-benchmark-project.js';
import {
  runCharacterRelationshipBenchmarkFromProject,
  type RunCharacterRelationshipBenchmarkCliResult,
} from './character-relationship-benchmark-project.js';

interface CliArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  requiredGenres?: string[];
  requiredTargetReaders?: string[];
  requiredRelationshipTypes?: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumSamplesPerRelationshipType?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  requireFocusEvidenceForGateTuning?: boolean;
  json: boolean;
}

const USAGE = `Usage:
  node dist/cli/run-character-relationship-benchmark.js --project <PATH> [--input-dir <PATH>] [--output <PATH>] [--project-id <ID>] [--required-genres mystery,romance] [--required-target-readers webnovel-core] [--required-relationship-types romance,rivalry] [--minimum-panel-size 3] [--minimum-commented-responses 2] [--minimum-samples-per-genre 2] [--minimum-samples-per-target-reader 2] [--minimum-samples-per-relationship-type 2] [--min-holdout-samples 1] [--min-usable-holdout-samples 1] [--min-failing-holdout-samples 1] [--min-usable-failing-holdout-samples 1] [--require-focus-evidence|--no-require-focus-evidence] [--json]

Reads labeled character/relationship investment samples from reviews/character-relationship-benchmark/ and writes reviews/character-relationship-benchmark-report.json.`;

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
    } else if (arg === '--required-relationship-types' && argv[i + 1]) {
      parsed.requiredRelationshipTypes = parseList(argv[++i]);
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
    } else if (arg === '--minimum-samples-per-relationship-type' && argv[i + 1]) {
      parsed.minimumSamplesPerRelationshipType = parsePositiveInteger(
        argv[++i],
        '--minimum-samples-per-relationship-type'
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
    } else if (arg === '--require-focus-evidence') {
      parsed.requireFocusEvidenceForGateTuning = true;
    } else if (arg === '--no-require-focus-evidence') {
      parsed.requireFocusEvidenceForGateTuning = false;
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

function renderText(result: RunCharacterRelationshipBenchmarkCliResult): string {
  const benchmark = result.benchmark;
  const split = benchmark.splitCoverage;
  return [
    `Character/relationship benchmark: ${benchmark.passed}/${benchmark.total} samples passed (${Math.round(benchmark.accuracy * 100)}%)`,
    `Failures: auto false positives=${benchmark.automatedFalsePositiveCount}, auto false negatives=${benchmark.automatedFalseNegativeCount}, reader label mismatches=${benchmark.readerLabelMismatchCount}, weak focus=${benchmark.weakFocusEvidenceCount}, weak investment=${benchmark.weakReaderInvestmentCount}, weak dimensions=${benchmark.weakDimensionCount}, insufficient evidence=${benchmark.insufficientEvidenceCount}`,
    `Coverage gaps: genres=${benchmark.missingRequiredGenres.join(', ') || 'none'}, target readers=${benchmark.missingRequiredTargetReaders.join(', ') || 'none'}, relationship types=${benchmark.missingRequiredRelationshipTypes.join(', ') || 'none'}`,
    `Polarity gaps: genre positive=${benchmark.missingRequiredPositiveGenres.join(', ') || 'none'}, genre negative=${benchmark.missingRequiredNegativeGenres.join(', ') || 'none'}, target positive=${benchmark.missingRequiredPositiveTargetReaders.join(', ') || 'none'}, target negative=${benchmark.missingRequiredNegativeTargetReaders.join(', ') || 'none'}, relationship positive=${benchmark.missingRequiredPositiveRelationshipTypes.join(', ') || 'none'}, relationship negative=${benchmark.missingRequiredNegativeRelationshipTypes.join(', ') || 'none'}`,
    `Holdout: samples=${split.holdoutSamples}, evidence-sufficient=${split.usableHoldoutSamples}, known-flat=${split.failingHoldoutSamples}, evidence-sufficient known-flat=${split.usableFailingHoldoutSamples}, ready=${benchmark.readyForGateTuning ? 'yes' : 'no'}`,
    `Focus evidence: usable=${benchmark.focusEvidenceCount}, weak=${benchmark.weakFocusEvidenceCount}, required=${result.requireFocusEvidenceForGateTuning === false ? 'no' : 'yes'}`,
    `Split leakage: ${benchmark.splitLeakageCount}`,
    `Stored: ${result.outputPath}`,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await runCharacterRelationshipBenchmarkFromProject(args);

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
