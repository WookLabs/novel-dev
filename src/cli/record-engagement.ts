#!/usr/bin/env node

/**
 * Record engagement contract evaluation for a project chapter.
 *
 * This CLI bridges prompt-level writing workflows to the executable
 * self-improvement loop: evaluate -> record -> persist -> detect regression.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
export {
  recordEngagementFromProject,
  type RecordEngagementCliResult,
} from './engagement-project.js';
import {
  recordEngagementFromProject,
  type RecordEngagementCliResult,
} from './engagement-project.js';

interface CliArgs {
  projectDir: string;
  projectId?: string;
  chapterNumber: number;
  version: number;
  json: boolean;
}

const USAGE = `Usage:
  node dist/cli/record-engagement.js --project <PATH> --chapter <N> [--version <N>] [--project-id <ID>] [--json]

Records a chapter's reader_experience engagement contract into meta/quality-trend.json.`;

function parseArgs(argv: string[]): CliArgs {
  const parsed: Partial<CliArgs> = {
    version: 1,
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

  return parsed as CliArgs;
}

function parsePositiveInteger(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
}

function renderText(result: RecordEngagementCliResult): string {
  const verdict = result.passed ? 'PASS' : 'REVISE';
  const regression = result.regressionDetected
    ? `regression ${result.alertLevel}`
    : 'regression none';

  return [
    `Chapter ${result.chapterNumber} engagement: ${result.score}/100 ${verdict}`,
    `Trend: ${result.totalSnapshots} snapshots, ${regression}`,
    `Stored: ${result.trendPath}`,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await recordEngagementFromProject(args);

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
