#!/usr/bin/env node

/**
 * Apply the pre-writing prose style gate from prose taste benchmark evidence.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildSourceEvidenceManifest,
  compareSourceEvidence,
  extractSourceEvidenceManifest,
  type SourceEvidenceComparison,
  type SourceEvidenceManifest,
} from './source-evidence.js';

export interface ApplyStyleGateProjectArgs {
  projectDir: string;
  projectId?: string;
  reportPath?: string;
  outputPath?: string;
}

export interface ApplyStyleGateCliResult {
  projectId: string;
  projectDir: string;
  reportPath: string;
  outputPath: string;
  status: 'PASS' | 'BLOCKED';
  passed: boolean;
  sourceEvidence: StyleGateSourceEvidence;
  issues: StyleGateIssue[];
  recommendedCommands: string[];
}

export interface StyleGateIssue {
  code:
    | 'prose-taste-report-missing'
    | 'prose-taste-report-malformed'
    | 'prose-taste-source-missing'
    | 'prose-taste-report-stale'
    | 'prose-taste-source-unrecorded'
    | 'prose-taste-not-ready'
    | 'prose-taste-failing-samples'
    | 'prose-taste-false-classification'
    | 'prose-taste-missing-issue'
    | 'prose-taste-score-out-of-range'
    | 'style-friction-evidence-weak'
    | 'style-highlight-evidence-weak'
    | 'style-highlight-diversity-weak'
    | 'style-fingerprint-weak'
    | 'authorial-style-drift'
    | 'prose-taste-reader-segment-weak'
    | 'prose-taste-split-leakage'
    | 'prose-taste-holdout-weak';
  severity: 'critical' | 'major';
  message: string;
  evidence?: Record<string, unknown>;
}

export interface StyleGateSourceEvidence {
  status: SourceEvidenceComparison['status'] | 'missing-report';
  currentDigest?: string;
  recordedDigest?: string;
  changedPaths: string[];
  sourceFileCount: number;
  benchmarkSampleSourceFileCount: number;
}

interface CliArgs extends ApplyStyleGateProjectArgs {
  failOnBlocked: boolean;
  json: boolean;
}

interface ProseTasteReport {
  projectId?: string;
  project_id?: string;
  inputDir?: string;
  benchmark?: unknown;
}

interface ProseTasteBenchmarkPayload {
  total?: number;
  failed?: number;
  falsePositiveCount?: number;
  falseNegativeCount?: number;
  missingIssueCount?: number;
  scoreOutOfRangeCount?: number;
  missingStyleFrictionAnnotationCount?: number;
  weakStyleFrictionAnnotationCount?: number;
  missingStyleHighlightAnnotationCount?: number;
  weakStyleHighlightAnnotationCount?: number;
  weakStyleHighlightQualityDiversityCount?: number;
  weakStyleFingerprintCount?: number;
  styleFingerprintStatus?: string;
  weakAuthorialStyleDriftCount?: number;
  authorialStyleDriftStatus?: string;
  missingRequiredReaderSegments?: unknown;
  underSampledReaderSegments?: unknown;
  underSampledFailingReaderSegments?: unknown;
  readerSegmentRepresentativeness?: string;
  splitLeakageCount?: number;
  underSampledHoldoutSamples?: unknown;
  underSampledUsableHoldoutSamples?: unknown;
  underSampledFailingHoldoutSamples?: unknown;
  underSampledUsableFailingHoldoutSamples?: unknown;
  readyForStyleTuning?: boolean;
}

const USAGE = `Usage:
  node dist/cli/apply-style-gate.js --project <PATH> [--report <PATH>] [--output <PATH>] [--fail-on-blocked] [--json]

Reads reviews/prose-taste-benchmark-report.json and writes reviews/style-gate-report.json.`;

export async function applyStyleGateFromProject(
  args: ApplyStyleGateProjectArgs
): Promise<ApplyStyleGateCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const reportPath = path.resolve(
    args.reportPath ?? path.join(projectDir, 'reviews', 'prose-taste-benchmark-report.json')
  );
  const outputPath = path.resolve(
    args.outputPath ?? path.join(projectDir, 'reviews', 'style-gate-report.json')
  );
  const project = await readOptionalJson(path.join(projectDir, 'meta', 'project.json'));
  const report = await readOptionalJson(reportPath) as ProseTasteReport | undefined;
  const projectId =
    args.projectId ??
    report?.projectId ??
    report?.project_id ??
    project?.project_id ??
    project?.id ??
    path.basename(projectDir);

  const inputDir = resolveReportInputDir(projectDir, report);
  const sampleEvidence = await buildSourceEvidenceManifest(projectDir, [inputDir]);
  const recordedEvidence = extractSourceEvidenceManifest(report);
  const currentEvidence = await buildSourceEvidenceManifest(
    projectDir,
    resolveCurrentSourcePaths(projectDir, inputDir, recordedEvidence)
  );
  const sourceComparison = report
    ? compareSourceEvidence(recordedEvidence, currentEvidence)
    : undefined;
  const issues: StyleGateIssue[] = [];

  if (!report) {
    issues.push({
      code: 'prose-taste-report-missing',
      severity: 'critical',
      message:
        'Prose taste benchmark report is missing; run the style benchmark before drafting.',
      evidence: { reportPath },
    });
  } else if (!isObject(report.benchmark)) {
    issues.push({
      code: 'prose-taste-report-malformed',
      severity: 'critical',
      message: 'Prose taste benchmark report has no benchmark payload.',
      evidence: { reportPath },
    });
  }

  if (sampleEvidence.fileCount < 1) {
    issues.push({
      code: 'prose-taste-source-missing',
      severity: 'critical',
      message:
        'Style gate cannot approve writing without prose taste benchmark sample source files.',
      evidence: { inputDir },
    });
  }

  if (sourceComparison) {
    if (sourceComparison.status === 'mismatch') {
      issues.push({
        code: 'prose-taste-report-stale',
        severity: 'critical',
        message:
          'Prose taste benchmark report sourceEvidence no longer matches current source files.',
        evidence: {
          currentDigest: sourceComparison.currentDigest,
          recordedDigest: sourceComparison.recordedDigest,
          changedPaths: sourceComparison.changedPaths,
        },
      });
    } else if (sourceComparison.status === 'not-recorded') {
      issues.push({
        code: 'prose-taste-source-unrecorded',
        severity: 'critical',
        message:
          'Prose taste benchmark report has no recorded sourceEvidence digest.',
        evidence: { currentDigest: sourceComparison.currentDigest },
      });
    } else if (sourceComparison.status === 'no-sources') {
      issues.push({
        code: 'prose-taste-source-missing',
        severity: 'critical',
        message:
          'Prose taste benchmark report has no current source files to verify.',
        evidence: { currentDigest: sourceComparison.currentDigest },
      });
    }
  }

  if (isObject(report?.benchmark)) {
    issues.push(...evaluateStyleGateIssues(report.benchmark as ProseTasteBenchmarkPayload));
  }

  const passed = issues.filter(issue => issue.severity === 'critical').length === 0;
  const result: ApplyStyleGateCliResult = {
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

function evaluateStyleGateIssues(
  benchmark: ProseTasteBenchmarkPayload
): StyleGateIssue[] {
  const issues: StyleGateIssue[] = [];
  const readyForStyleTuning = benchmark.readyForStyleTuning === true;
  const total = numberOrZero(benchmark.total);
  const failed = numberOrZero(benchmark.failed);
  const falsePositiveCount = numberOrZero(benchmark.falsePositiveCount);
  const falseNegativeCount = numberOrZero(benchmark.falseNegativeCount);
  const missingIssueCount = numberOrZero(benchmark.missingIssueCount);
  const scoreOutOfRangeCount = numberOrZero(benchmark.scoreOutOfRangeCount);
  const missingStyleFrictionAnnotationCount = numberOrZero(
    benchmark.missingStyleFrictionAnnotationCount
  );
  const weakStyleFrictionAnnotationCount = numberOrZero(
    benchmark.weakStyleFrictionAnnotationCount
  );
  const missingStyleHighlightAnnotationCount = numberOrZero(
    benchmark.missingStyleHighlightAnnotationCount
  );
  const weakStyleHighlightAnnotationCount = numberOrZero(
    benchmark.weakStyleHighlightAnnotationCount
  );
  const weakStyleHighlightQualityDiversityCount = numberOrZero(
    benchmark.weakStyleHighlightQualityDiversityCount
  );
  const weakStyleFingerprintCount = numberOrZero(benchmark.weakStyleFingerprintCount);
  const weakAuthorialStyleDriftCount = numberOrZero(
    benchmark.weakAuthorialStyleDriftCount
  );
  const splitLeakageCount = numberOrZero(benchmark.splitLeakageCount);

  if (!readyForStyleTuning) {
    issues.push({
      code: 'prose-taste-not-ready',
      severity: 'critical',
      message:
        'Prose taste benchmark is not ready for style gate tuning.',
      evidence: { readyForStyleTuning: benchmark.readyForStyleTuning },
    });
  }

  if (total < 1) {
    issues.push({
      code: 'prose-taste-source-missing',
      severity: 'critical',
      message: 'No prose taste benchmark samples are available for style approval.',
      evidence: { total },
    });
  }

  if (failed > 0) {
    issues.push({
      code: 'prose-taste-failing-samples',
      severity: 'critical',
      message:
        'Prose taste benchmark still has failing labeled samples.',
      evidence: { failed },
    });
  }

  if (falsePositiveCount > 0 || falseNegativeCount > 0) {
    issues.push({
      code: 'prose-taste-false-classification',
      severity: 'critical',
      message:
        'Prose taste gate misclassifies at least one preferred or disliked prose sample.',
      evidence: { falsePositiveCount, falseNegativeCount },
    });
  }

  if (missingIssueCount > 0) {
    issues.push({
      code: 'prose-taste-missing-issue',
      severity: 'critical',
      message:
        'Prose taste gate misses expected issue codes for disliked prose samples.',
      evidence: { missingIssueCount },
    });
  }

  if (scoreOutOfRangeCount > 0) {
    issues.push({
      code: 'prose-taste-score-out-of-range',
      severity: 'critical',
      message:
        'Prose taste scores fall outside expected reader-labeled ranges.',
      evidence: { scoreOutOfRangeCount },
    });
  }

  if (missingStyleFrictionAnnotationCount > 0 || weakStyleFrictionAnnotationCount > 0) {
    issues.push({
      code: 'style-friction-evidence-weak',
      severity: 'critical',
      message:
        'Disliked prose samples lack actionable style friction annotations.',
      evidence: { missingStyleFrictionAnnotationCount, weakStyleFrictionAnnotationCount },
    });
  }

  if (missingStyleHighlightAnnotationCount > 0 || weakStyleHighlightAnnotationCount > 0) {
    issues.push({
      code: 'style-highlight-evidence-weak',
      severity: 'critical',
      message:
        'Preferred prose samples lack actionable positive style highlight annotations.',
      evidence: { missingStyleHighlightAnnotationCount, weakStyleHighlightAnnotationCount },
    });
  }

  if (weakStyleHighlightQualityDiversityCount > 0) {
    issues.push({
      code: 'style-highlight-diversity-weak',
      severity: 'critical',
      message:
        'Preferred prose evidence does not cover enough distinct style qualities.',
      evidence: { weakStyleHighlightQualityDiversityCount },
    });
  }

  if (
    weakStyleFingerprintCount > 0 ||
    (
      typeof benchmark.styleFingerprintStatus === 'string' &&
      benchmark.styleFingerprintStatus !== 'separated'
    )
  ) {
    issues.push({
      code: 'style-fingerprint-weak',
      severity: 'critical',
      message:
        'Preferred and disliked prose samples are not separated by a usable style fingerprint.',
      evidence: {
        weakStyleFingerprintCount,
        styleFingerprintStatus: benchmark.styleFingerprintStatus,
      },
    });
  }

  if (
    weakAuthorialStyleDriftCount > 0 ||
    benchmark.authorialStyleDriftStatus === 'drifted'
  ) {
    issues.push({
      code: 'authorial-style-drift',
      severity: 'critical',
      message:
        'Preferred chapter-grounded prose samples show authorial style drift.',
      evidence: {
        weakAuthorialStyleDriftCount,
        authorialStyleDriftStatus: benchmark.authorialStyleDriftStatus,
      },
    });
  }

  if (
    hasCoverageGap(benchmark.missingRequiredReaderSegments) ||
    hasCoverageGap(benchmark.underSampledReaderSegments) ||
    hasCoverageGap(benchmark.underSampledFailingReaderSegments) ||
    benchmark.readerSegmentRepresentativeness === 'narrow'
  ) {
    issues.push({
      code: 'prose-taste-reader-segment-weak',
      severity: 'critical',
      message:
        'Prose taste samples do not cover required reader/style sensitivity segments.',
      evidence: {
        missingRequiredReaderSegments: benchmark.missingRequiredReaderSegments,
        underSampledReaderSegments: benchmark.underSampledReaderSegments,
        underSampledFailingReaderSegments: benchmark.underSampledFailingReaderSegments,
        readerSegmentRepresentativeness: benchmark.readerSegmentRepresentativeness,
      },
    });
  }

  if (splitLeakageCount > 0) {
    issues.push({
      code: 'prose-taste-split-leakage',
      severity: 'critical',
      message:
        'Prose taste evidence leaks across calibration, validation, or holdout splits.',
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
      code: 'prose-taste-holdout-weak',
      severity: 'critical',
      message:
        'Prose taste benchmark lacks enough independent usable holdout and disliked-prose holdout evidence.',
      evidence: {
        underSampledHoldoutSamples: benchmark.underSampledHoldoutSamples,
        underSampledUsableHoldoutSamples: benchmark.underSampledUsableHoldoutSamples,
        underSampledFailingHoldoutSamples: benchmark.underSampledFailingHoldoutSamples,
        underSampledUsableFailingHoldoutSamples:
          benchmark.underSampledUsableFailingHoldoutSamples,
      },
    });
  }

  return issues;
}

function buildRecommendedCommands(projectDir: string): string[] {
  const projectArg = quoteCliArg(projectDir);
  return [
    `node dist/cli/run-prose-taste-benchmark.js --project ${projectArg} --json`,
    `node dist/cli/apply-style-gate.js --project ${projectArg} --fail-on-blocked --json`,
  ];
}

function resolveReportInputDir(projectDir: string, report?: ProseTasteReport): string {
  const inputDir = typeof report?.inputDir === 'string' && report.inputDir.trim().length > 0
    ? report.inputDir
    : path.join(projectDir, 'reviews', 'prose-taste-benchmark');
  return path.isAbsolute(inputDir) ? inputDir : path.join(projectDir, inputDir);
}

function resolveCurrentSourcePaths(
  projectDir: string,
  inputDir: string,
  recordedEvidence: SourceEvidenceManifest | undefined
): string[] {
  const paths = new Set([
    inputDir,
    path.join(projectDir, 'meta', 'style-guide.json'),
    path.join(projectDir, 'chapters'),
  ]);

  for (const file of recordedEvidence?.files ?? []) {
    paths.add(path.join(projectDir, file.path));
  }

  return Array.from(paths);
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

function renderText(result: ApplyStyleGateCliResult): string {
  const issueLines = result.issues.map(issue =>
    `- [${issue.severity}] ${issue.code}: ${issue.message}`
  );
  return [
    `Style gate: ${result.status}`,
    `Prose taste source evidence: ${result.sourceEvidence.status}, samples=${result.sourceEvidence.benchmarkSampleSourceFileCount}, changed=${result.sourceEvidence.changedPaths.length}`,
    ...issueLines,
    `Stored: ${result.outputPath}`,
  ].join('\n');
}

class UsageRequested extends Error {}

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await applyStyleGateFromProject(args);

    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(renderText(result));
    }

    if (args.failOnBlocked && !result.passed) {
      console.error(`Style gate blocked: ${result.issues.map(issue => issue.code).join(', ')}`);
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
