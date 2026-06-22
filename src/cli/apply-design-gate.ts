#!/usr/bin/env node

/**
 * Apply the pre-writing design gate from existing premise appeal benchmark evidence.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildSourceEvidenceManifest,
  compareSourceEvidence,
  extractSourceEvidenceManifest,
  type SourceEvidenceComparison,
} from './source-evidence.js';

export interface ApplyDesignGateProjectArgs {
  projectDir: string;
  projectId?: string;
  reportPath?: string;
  outputPath?: string;
}

export interface ApplyDesignGateCliResult {
  projectId: string;
  projectDir: string;
  reportPath: string;
  outputPath: string;
  status: 'PASS' | 'BLOCKED';
  passed: boolean;
  sourceEvidence: DesignGateSourceEvidence;
  issues: DesignGateIssue[];
  recommendedCommands: string[];
}

export interface DesignGateIssue {
  code:
    | 'premise-appeal-report-missing'
    | 'premise-appeal-report-malformed'
    | 'premise-appeal-source-missing'
    | 'premise-appeal-report-stale'
    | 'premise-appeal-source-unrecorded'
    | 'premise-appeal-not-ready'
    | 'weak-promise-evidence'
    | 'premise-promise-evidence-missing'
    | 'premise-appeal-false-positive'
    | 'premise-behavioral-intent-weak'
    | 'premise-appeal-split-leakage'
    | 'premise-appeal-holdout-weak'
    | 'premise-appeal-reader-evidence-weak';
  severity: 'critical' | 'major';
  message: string;
  evidence?: Record<string, unknown>;
}

export interface DesignGateSourceEvidence {
  status: SourceEvidenceComparison['status'] | 'missing-report';
  currentDigest?: string;
  recordedDigest?: string;
  changedPaths: string[];
  sourceFileCount: number;
  benchmarkSampleSourceFileCount: number;
}

interface CliArgs extends ApplyDesignGateProjectArgs {
  failOnBlocked: boolean;
  json: boolean;
}

interface PremiseAppealReport {
  projectId?: string;
  project_id?: string;
  inputDir?: string;
  benchmark?: unknown;
}

interface PremiseAppealBenchmarkPayload {
  readyForGateTuning?: boolean;
  weakPromiseEvidenceCount?: number;
  promiseEvidenceCount?: number;
  automatedFalsePositiveCount?: number;
  behavioralIntentFalsePositiveCount?: number;
  splitLeakageCount?: number;
  underSampledHoldoutSamples?: unknown;
  underSampledUsableHoldoutSamples?: unknown;
  underSampledFailingHoldoutSamples?: unknown;
  underSampledUsableFailingHoldoutSamples?: unknown;
  insufficientEvidenceCount?: number;
  lowBehavioralIntentEvidenceCount?: number;
  weakBehavioralProtocolCount?: number;
  weakBehavioralAllocationCount?: number;
}

const USAGE = `Usage:
  node dist/cli/apply-design-gate.js --project <PATH> [--report <PATH>] [--output <PATH>] [--fail-on-blocked] [--json]

Reads reviews/premise-appeal-benchmark-report.json and writes reviews/design-gate-report.json.`;

export async function applyDesignGateFromProject(
  args: ApplyDesignGateProjectArgs
): Promise<ApplyDesignGateCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const reportPath = path.resolve(
    args.reportPath ?? path.join(projectDir, 'reviews', 'premise-appeal-benchmark-report.json')
  );
  const outputPath = path.resolve(
    args.outputPath ?? path.join(projectDir, 'reviews', 'design-gate-report.json')
  );
  const project = await readOptionalJson(path.join(projectDir, 'meta', 'project.json'));
  const report = await readOptionalJson(reportPath) as PremiseAppealReport | undefined;
  const projectId =
    args.projectId ??
    report?.projectId ??
    report?.project_id ??
    project?.project_id ??
    project?.id ??
    path.basename(projectDir);

  const inputDir = resolveReportInputDir(projectDir, report);
  const designStrategyPath = path.join(projectDir, 'meta', 'design-strategy.json');
  const currentEvidence = await buildSourceEvidenceManifest(projectDir, [
    inputDir,
    designStrategyPath,
  ]);
  const sampleEvidence = await buildSourceEvidenceManifest(projectDir, [inputDir]);
  const sourceComparison = report
    ? compareSourceEvidence(extractSourceEvidenceManifest(report), currentEvidence)
    : undefined;
  const issues: DesignGateIssue[] = [];

  if (!report) {
    issues.push({
      code: 'premise-appeal-report-missing',
      severity: 'critical',
      message:
        'Premise appeal benchmark report is missing; run the benchmark before design approval.',
      evidence: { reportPath },
    });
  } else if (!isObject(report.benchmark)) {
    issues.push({
      code: 'premise-appeal-report-malformed',
      severity: 'critical',
      message: 'Premise appeal benchmark report has no benchmark payload.',
      evidence: { reportPath },
    });
  }

  if (sampleEvidence.fileCount < 1) {
    issues.push({
      code: 'premise-appeal-source-missing',
      severity: 'critical',
      message:
        'Premise appeal report cannot approve design without benchmark sample source files.',
      evidence: { inputDir },
    });
  }

  if (sourceComparison) {
    if (sourceComparison.status === 'mismatch') {
      issues.push({
        code: 'premise-appeal-report-stale',
        severity: 'critical',
        message:
          'Premise appeal benchmark report sourceEvidence no longer matches current source files.',
        evidence: {
          currentDigest: sourceComparison.currentDigest,
          recordedDigest: sourceComparison.recordedDigest,
          changedPaths: sourceComparison.changedPaths,
        },
      });
    } else if (sourceComparison.status === 'not-recorded') {
      issues.push({
        code: 'premise-appeal-source-unrecorded',
        severity: 'critical',
        message:
          'Premise appeal benchmark report has no recorded sourceEvidence digest.',
        evidence: { currentDigest: sourceComparison.currentDigest },
      });
    } else if (sourceComparison.status === 'no-sources') {
      issues.push({
        code: 'premise-appeal-source-missing',
        severity: 'critical',
        message:
          'Premise appeal benchmark report has no current source files to verify.',
        evidence: { currentDigest: sourceComparison.currentDigest },
      });
    }
  }

  if (isObject(report?.benchmark)) {
    issues.push(...evaluatePremiseAppealDesignIssues(
      report.benchmark as PremiseAppealBenchmarkPayload
    ));
  }

  const passed = issues.filter(issue => issue.severity === 'critical').length === 0;
  const result: ApplyDesignGateCliResult = {
    projectId,
    projectDir,
    reportPath,
    outputPath,
    status: passed ? 'PASS' : 'BLOCKED',
    passed,
    sourceEvidence: {
      status: sourceComparison?.status ?? 'missing-report',
      currentDigest: sourceComparison?.currentDigest ?? currentEvidence.digest,
      recordedDigest: sourceComparison?.recordedDigest,
      changedPaths: sourceComparison?.changedPaths ?? [],
      sourceFileCount: currentEvidence.fileCount,
      benchmarkSampleSourceFileCount: sampleEvidence.fileCount,
    },
    issues,
    recommendedCommands: buildRecommendedCommands(projectDir),
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return result;
}

function evaluatePremiseAppealDesignIssues(
  benchmark: PremiseAppealBenchmarkPayload
): DesignGateIssue[] {
  const issues: DesignGateIssue[] = [];
  const readyForGateTuning = benchmark.readyForGateTuning === true;
  const weakPromiseEvidenceCount = numberOrZero(benchmark.weakPromiseEvidenceCount);
  const promiseEvidenceCount = numberOrZero(benchmark.promiseEvidenceCount);
  const automatedFalsePositiveCount = numberOrZero(benchmark.automatedFalsePositiveCount);
  const behavioralIntentFalsePositiveCount = numberOrZero(
    benchmark.behavioralIntentFalsePositiveCount
  );
  const splitLeakageCount = numberOrZero(benchmark.splitLeakageCount);
  const insufficientEvidenceCount = numberOrZero(benchmark.insufficientEvidenceCount);
  const lowBehavioralIntentEvidenceCount = numberOrZero(
    benchmark.lowBehavioralIntentEvidenceCount
  );
  const weakBehavioralProtocolCount = numberOrZero(benchmark.weakBehavioralProtocolCount);
  const weakBehavioralAllocationCount = numberOrZero(
    benchmark.weakBehavioralAllocationCount
  );

  if (!readyForGateTuning) {
    issues.push({
      code: 'premise-appeal-not-ready',
      severity: 'critical',
      message:
        'Premise appeal benchmark is not ready for design gate tuning.',
      evidence: { readyForGateTuning: benchmark.readyForGateTuning },
    });
  }

  if (weakPromiseEvidenceCount > 0) {
    issues.push({
      code: 'weak-promise-evidence',
      severity: 'critical',
      message:
        'Premise appeal samples include weak promise evidence; rewrite core hook, question, protagonist appeal, novelty, payoff, binge reason, and long-series engine.',
      evidence: { weakPromiseEvidenceCount },
    });
  }

  if (promiseEvidenceCount < 1) {
    issues.push({
      code: 'premise-promise-evidence-missing',
      severity: 'critical',
      message:
        'No usable premise promise evidence is available for pre-writing design approval.',
      evidence: { promiseEvidenceCount },
    });
  }

  if (automatedFalsePositiveCount > 0) {
    issues.push({
      code: 'premise-appeal-false-positive',
      severity: 'critical',
      message:
        'Automated premise appeal accepted at least one premise that target-reader evidence rejected.',
      evidence: { automatedFalsePositiveCount },
    });
  }

  if (behavioralIntentFalsePositiveCount > 0) {
    issues.push({
      code: 'premise-behavioral-intent-weak',
      severity: 'critical',
      message:
        'A premise looked appealing in automated/survey evidence but failed click/open/save/follow behavioral intent.',
      evidence: { behavioralIntentFalsePositiveCount },
    });
  }

  if (splitLeakageCount > 0) {
    issues.push({
      code: 'premise-appeal-split-leakage',
      severity: 'critical',
      message:
        'Premise evidence leaks across calibration, validation, or holdout splits.',
      evidence: { splitLeakageCount },
    });
  }

  if (
    hasCoverageGap(benchmark.underSampledHoldoutSamples) ||
    hasCoverageGap(benchmark.underSampledUsableHoldoutSamples) ||
    hasCoverageGap(benchmark.underSampledFailingHoldoutSamples) ||
    hasCoverageGap(benchmark.underSampledUsableFailingHoldoutSamples)
  ) {
    issues.push({
      code: 'premise-appeal-holdout-weak',
      severity: 'critical',
      message:
        'Premise appeal benchmark lacks enough independent usable holdout and known-bad holdout evidence.',
      evidence: {
        underSampledHoldoutSamples: benchmark.underSampledHoldoutSamples,
        underSampledUsableHoldoutSamples: benchmark.underSampledUsableHoldoutSamples,
        underSampledFailingHoldoutSamples: benchmark.underSampledFailingHoldoutSamples,
        underSampledUsableFailingHoldoutSamples:
          benchmark.underSampledUsableFailingHoldoutSamples,
      },
    });
  }

  if (
    insufficientEvidenceCount > 0 ||
    lowBehavioralIntentEvidenceCount > 0 ||
    weakBehavioralProtocolCount > 0 ||
    weakBehavioralAllocationCount > 0
  ) {
    issues.push({
      code: 'premise-appeal-reader-evidence-weak',
      severity: 'critical',
      message:
        'Premise appeal benchmark still has weak reader, behavioral, protocol, or allocation evidence.',
      evidence: {
        insufficientEvidenceCount,
        lowBehavioralIntentEvidenceCount,
        weakBehavioralProtocolCount,
        weakBehavioralAllocationCount,
      },
    });
  }

  return issues;
}

function buildRecommendedCommands(projectDir: string): string[] {
  const projectArg = quoteCliArg(projectDir);
  return [
    `node dist/cli/run-premise-appeal-benchmark.js --project ${projectArg} --json`,
    `node dist/cli/apply-design-gate.js --project ${projectArg} --fail-on-blocked --json`,
  ];
}

function resolveReportInputDir(projectDir: string, report?: PremiseAppealReport): string {
  const inputDir = typeof report?.inputDir === 'string' && report.inputDir.trim().length > 0
    ? report.inputDir
    : path.join(projectDir, 'reviews', 'premise-appeal-benchmark');
  return path.isAbsolute(inputDir) ? inputDir : path.join(projectDir, inputDir);
}

function hasCoverageGap(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value === true;
}

function numberOrZero(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function quoteCliArg(value: string): string {
  if (!/[\s"]/u.test(value)) {
    return value;
  }
  return `"${value.replace(/"/g, '\\"')}"`;
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

function parseArgs(argv: string[]): CliArgs {
  const parsed: Partial<CliArgs> = {
    failOnBlocked: false,
    json: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--project' && argv[i + 1]) {
      parsed.projectDir = argv[++i];
    } else if (arg === '--project-id' && argv[i + 1]) {
      parsed.projectId = argv[++i];
    } else if (arg === '--report' && argv[i + 1]) {
      parsed.reportPath = argv[++i];
    } else if (arg === '--output' && argv[i + 1]) {
      parsed.outputPath = argv[++i];
    } else if (arg === '--fail-on-blocked') {
      parsed.failOnBlocked = true;
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

function renderText(result: ApplyDesignGateCliResult): string {
  const issueLines = result.issues.map(issue =>
    `- [${issue.severity}] ${issue.code}: ${issue.message}`
  );
  return [
    `Design gate: ${result.status}`,
    `Premise source evidence: ${result.sourceEvidence.status}, samples=${result.sourceEvidence.benchmarkSampleSourceFileCount}, changed=${result.sourceEvidence.changedPaths.length}`,
    ...issueLines,
    `Stored: ${result.outputPath}`,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await applyDesignGateFromProject(args);

    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(renderText(result));
    }

    if (args.failOnBlocked && !result.passed) {
      console.error(`Design gate blocked: ${result.issues.map(issue => issue.code).join(', ')}`);
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
