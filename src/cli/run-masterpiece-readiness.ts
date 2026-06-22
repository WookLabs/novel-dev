#!/usr/bin/env node

/**
 * Aggregate project benchmark reports into one masterpiece readiness report.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
export {
  runMasterpieceReadinessFromProject,
  type RunMasterpieceReadinessCliResult,
} from './masterpiece-readiness-project.js';
import {
  runMasterpieceReadinessFromProject,
  type RunMasterpieceReadinessCliResult,
} from './masterpiece-readiness-project.js';

interface CliArgs {
  projectDir: string;
  projectId?: string;
  outputPath?: string;
  minimumOverallScore?: number;
  failOnNotReady: boolean;
  json: boolean;
}

const USAGE = `Usage:
  node dist/cli/run-masterpiece-readiness.js --project <PATH> [--output <PATH>] [--project-id <ID>] [--minimum-overall-score 98] [--fail-on-not-ready] [--json]

Reads existing benchmark/calibration reports from reviews/ and writes reviews/masterpiece-readiness-report.json.`;

function parseArgs(argv: string[]): CliArgs {
  const parsed: Partial<CliArgs> = {
    failOnNotReady: false,
    json: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--project' && argv[i + 1]) {
      parsed.projectDir = argv[++i];
    } else if (arg === '--project-id' && argv[i + 1]) {
      parsed.projectId = argv[++i];
    } else if (arg === '--output' && argv[i + 1]) {
      parsed.outputPath = argv[++i];
    } else if (arg === '--minimum-overall-score' && argv[i + 1]) {
      parsed.minimumOverallScore = parseScore(argv[++i], '--minimum-overall-score');
    } else if (arg === '--fail-on-not-ready') {
      parsed.failOnNotReady = true;
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

function parseScore(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`${label} must be a number from 0 to 100`);
  }
  return parsed;
}

function renderText(result: RunMasterpieceReadinessCliResult): string {
  const readiness = result.readiness;
  const areaLines = readiness.areaResults.map(area =>
    `- ${area.label}: ${area.score}/100, ${area.status}, gaps=${area.gaps.length}`
  );
  const actionPlan = readiness.actionPlan ?? [];
  return [
    `Masterpiece readiness: ${readiness.overallScore}/100 (${readiness.status})`,
    `Passed ${readiness.minimumOverallScore}+ gate: ${readiness.passed ? 'yes' : 'no'}`,
    `Gaps: critical=${readiness.criticalGapCount}, major=${readiness.majorGapCount}, minor=${readiness.minorGapCount}`,
    ...areaLines,
    `Action plan: ${actionPlan.length} task(s)`,
    ...actionPlan.slice(0, 7).map(renderActionTask),
    `Stored: ${result.outputPath}`,
  ].join('\n');
}

function renderActionTask(task: RunMasterpieceReadinessCliResult['readiness']['actionPlan'][number]): string {
  const commandLines = (task.commands ?? [])
    .slice(0, 2)
    .map(command => `    command: ${command}`);
  return [
    `  - [${task.priority}] ${task.area}/${task.id}: ${task.action}`,
    ...commandLines,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await runMasterpieceReadinessFromProject(args);

    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(renderText(result));
    }

    if (args.failOnNotReady && !result.readiness.passed) {
      console.error(
        `Masterpiece readiness gate failed: ${result.readiness.overallScore}/${result.readiness.minimumOverallScore}, status=${result.readiness.status}`
      );
      process.exitCode = 2;
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
