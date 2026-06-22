#!/usr/bin/env node

/**
 * Run labeled engagement benchmark samples for a project.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
export {
  runEngagementBenchmarkFromProject,
  type RunEngagementBenchmarkCliResult,
} from './engagement-benchmark-project.js';
import {
  runEngagementBenchmarkFromProject,
  type RunEngagementBenchmarkCliResult,
} from './engagement-benchmark-project.js';
import type {
  EngagementBenchmarkRoute,
  EngagementPositiveQualityCode,
  EngagementIssueCode,
} from '../quality/index.js';

interface CliArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  requiredGenres?: string[];
  requiredRoutes?: EngagementBenchmarkRoute[];
  requiredIssueCodes?: EngagementIssueCode[];
  requiredPositiveQualityCodes?: EngagementPositiveQualityCode[];
  minimumSamplesPerRequiredIssueCode?: number;
  minimumSamplesPerRequiredPositiveQualityCode?: number;
  requiredSeriesLength?: number;
  requiredPositiveSeriesLength?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  json: boolean;
}

const ALLOWED_ROUTES: EngagementBenchmarkRoute[] = [
  'interest',
  'suspense',
  'beauty',
  'amusement',
  'genre-delight',
  'next-click',
];

const ALLOWED_POSITIVE_QUALITY_CODES: EngagementPositiveQualityCode[] = [
  'signature-scene-image',
  'character-appeal-signature',
  'protagonist-agency',
  'choice-cost-tradeoff',
  'choice-cost-lock',
  'tactical-adaptation',
  'payoff-delight',
  'genre-delight',
  'next-click-compulsion',
  'narrative-transportation',
  'dialogue-subtext-turn',
  'causal-chain',
];

const USAGE = `Usage:
  node dist/cli/run-engagement-benchmark.js --project <PATH> [--input-dir <PATH>] [--output <PATH>] [--project-id <ID>] [--required-genres mystery,romance] [--required-routes interest,suspense,next-click] [--required-issue-codes manuscript-payoff-delight-not-evidenced] [--required-positive-quality-codes payoff-delight,next-click-compulsion] [--min-issue-code-samples 2] [--min-positive-quality-code-samples 2] [--required-series-length 3] [--required-positive-series-length 3] [--min-holdout-samples 2] [--min-usable-holdout-samples 2] [--min-failing-holdout-samples 1] [--min-usable-failing-holdout-samples 1] [--json]

Reads labeled benchmark samples from reviews/engagement-benchmark/ and writes reviews/engagement-benchmark-report.json.`;

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
    } else if (arg === '--required-routes' && argv[i + 1]) {
      parsed.requiredRoutes = parseRoutes(argv[++i]);
    } else if (arg === '--required-issue-codes' && argv[i + 1]) {
      parsed.requiredIssueCodes = parseIssueCodes(argv[++i]);
    } else if (arg === '--required-positive-quality-codes' && argv[i + 1]) {
      parsed.requiredPositiveQualityCodes = parsePositiveQualityCodes(argv[++i]);
    } else if (arg === '--min-issue-code-samples' && argv[i + 1]) {
      parsed.minimumSamplesPerRequiredIssueCode = parsePositiveInteger(argv[++i], '--min-issue-code-samples');
    } else if (arg === '--min-positive-quality-code-samples' && argv[i + 1]) {
      parsed.minimumSamplesPerRequiredPositiveQualityCode = parsePositiveInteger(argv[++i], '--min-positive-quality-code-samples');
    } else if (arg === '--required-series-length' && argv[i + 1]) {
      parsed.requiredSeriesLength = parsePositiveInteger(argv[++i], '--required-series-length');
    } else if (arg === '--required-positive-series-length' && argv[i + 1]) {
      parsed.requiredPositiveSeriesLength = parsePositiveInteger(argv[++i], '--required-positive-series-length');
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

  return parsed as CliArgs;
}

function parseList(value: string): string[] {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function parseRoutes(value: string): EngagementBenchmarkRoute[] {
  return parseList(value).map(route => {
    if (!ALLOWED_ROUTES.includes(route as EngagementBenchmarkRoute)) {
      throw new Error(`Unknown engagement route: ${route}`);
    }
    return route as EngagementBenchmarkRoute;
  });
}

function parseIssueCodes(value: string): EngagementIssueCode[] {
  return parseList(value) as EngagementIssueCode[];
}

function parsePositiveQualityCodes(value: string): EngagementPositiveQualityCode[] {
  return parseList(value).map(code => {
    if (!ALLOWED_POSITIVE_QUALITY_CODES.includes(code as EngagementPositiveQualityCode)) {
      throw new Error(`Unknown positive quality code: ${code}`);
    }
    return code as EngagementPositiveQualityCode;
  });
}

function parsePositiveInteger(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
}

function renderText(result: RunEngagementBenchmarkCliResult): string {
  const benchmark = result.benchmark;
  const split = benchmark.splitCoverage;
  return [
    `Engagement benchmark: ${benchmark.passed}/${benchmark.total} samples passed (${Math.round(benchmark.accuracy * 100)}%)`,
    `Failures: false positives=${benchmark.falsePositiveCount}, false negatives=${benchmark.falseNegativeCount}, missing issues=${benchmark.missingIssueCount}, forbidden issues=${benchmark.forbiddenIssueCount}, positive quality conflicts=${benchmark.positiveQualityConflictCount}`,
    `Coverage gaps: genres=${benchmark.missingRequiredGenres.join(', ') || 'none'}, routes=${benchmark.missingRequiredRoutes.join(', ') || 'none'}`,
    `Issue-code gaps: missing=${benchmark.missingRequiredIssueCodes.join(', ') || 'none'}, under-sampled=${benchmark.underSampledRequiredIssueCodes.join(', ') || 'none'}, usable under-sampled=${benchmark.underSampledUsableRequiredIssueCodes.join(', ') || 'none'}`,
    `Positive quality gaps: missing=${benchmark.missingRequiredPositiveQualityCodes.join(', ') || 'none'}, under-sampled=${benchmark.underSampledRequiredPositiveQualityCodes.join(', ') || 'none'}, usable under-sampled=${benchmark.underSampledUsableRequiredPositiveQualityCodes.join(', ') || 'none'}`,
    `Polarity gaps: positive=${benchmark.missingRequiredPositiveGenres.join(', ') || 'none'}, negative=${benchmark.missingRequiredNegativeGenres.join(', ') || 'none'}`,
    `Series gaps: any=${benchmark.missingRequiredSeriesGenres.join(', ') || 'none'}, positive=${benchmark.missingRequiredPositiveSeriesGenres.join(', ') || 'none'}`,
    `Split leakage: ${benchmark.splitLeakageCount}`,
    `Holdout: samples=${split.holdoutSamples}, usable=${split.usableHoldoutSamples}, known-bad=${split.failingHoldoutSamples}, usable known-bad=${split.usableFailingHoldoutSamples}, ready=${benchmark.readyForGateTuning ? 'yes' : 'no'}`,
    `Stored: ${result.outputPath}`,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await runEngagementBenchmarkFromProject(args);

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
