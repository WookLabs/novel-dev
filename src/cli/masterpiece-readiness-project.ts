import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  evaluateMasterpieceReadiness,
  type MasterpieceReadinessAreaId,
  type MasterpieceReadinessAreaInput,
  type MasterpieceReadinessFreshness,
  type MasterpieceReadinessResult,
} from '../quality/masterpiece-readiness.js';
import {
  buildSourceEvidenceManifest,
  compareSourceEvidence,
  extractSourceEvidenceManifest,
} from './source-evidence.js';

export interface RunMasterpieceReadinessProjectArgs {
  projectDir: string;
  projectId?: string;
  outputPath?: string;
  minimumOverallScore?: number;
}

export interface RunMasterpieceReadinessCliResult {
  projectId: string;
  projectDir: string;
  outputPath: string;
  reports: MasterpieceReadinessReportSource[];
  readiness: MasterpieceReadinessResult;
}

export interface MasterpieceReadinessReportSource {
  area: MasterpieceReadinessAreaId;
  path: string;
  present: boolean;
  freshness?: MasterpieceReadinessFreshness;
}

const DEFAULT_REPORT_PATHS: Array<{
  area: MasterpieceReadinessAreaId;
  relativePath: string;
  sourceGroups: ReadinessSourceGroupConfig[];
}> = [
  {
    area: 'premise-appeal',
    relativePath: path.join('reviews', 'premise-appeal-benchmark-report.json'),
    sourceGroups: [
      buildSourceGroup('benchmark-samples', 'Premise appeal benchmark samples', [
        path.join('reviews', 'premise-appeal-benchmark'),
      ]),
      buildSourceGroup('design-strategy', 'Design strategy', [
        path.join('meta', 'design-strategy.json'),
      ], false),
    ],
  },
  {
    area: 'engagement',
    relativePath: path.join('reviews', 'engagement-benchmark-report.json'),
    sourceGroups: [
      buildSourceGroup('benchmark-samples', 'Engagement benchmark samples', [
        path.join('reviews', 'engagement-benchmark'),
      ]),
      buildSourceGroup('chapters', 'Chapter metadata and manuscripts', [
        path.join('chapters'),
      ]),
      buildSourceGroup('plot', 'Plot sources', [
        path.join('plot'),
      ], false),
      buildSourceGroup('characters', 'Character sources', [
        path.join('characters'),
      ], false),
      buildSourceGroup('design-strategy', 'Design strategy', [
        path.join('meta', 'design-strategy.json'),
      ], false),
    ],
  },
  {
    area: 'series-retention',
    relativePath: path.join('reviews', 'series-retention-benchmark-report.json'),
    sourceGroups: [
      buildSourceGroup('benchmark-samples', 'Series retention benchmark samples', [
        path.join('reviews', 'series-retention-benchmark'),
      ]),
    ],
  },
  {
    area: 'character-relationship',
    relativePath: path.join('reviews', 'character-relationship-benchmark-report.json'),
    sourceGroups: [
      buildSourceGroup('benchmark-samples', 'Character relationship benchmark samples', [
        path.join('reviews', 'character-relationship-benchmark'),
      ]),
    ],
  },
  {
    area: 'long-form-consistency',
    relativePath: path.join('reviews', 'consistency-report.json'),
    sourceGroups: [
      buildSourceGroup('chapters', 'Chapter metadata and manuscripts', [
        path.join('chapters'),
      ]),
      buildSourceGroup('world', 'Worldbuilding sources', [
        path.join('world'),
      ]),
      buildSourceGroup('characters', 'Character sources', [
        path.join('characters'),
      ]),
      buildSourceGroup('plot', 'Plot sources', [
        path.join('plot'),
      ]),
      buildSourceGroup('summaries', 'Chapter summaries', [
        path.join('context', 'summaries'),
      ], false),
    ],
  },
  {
    area: 'prose-taste',
    relativePath: path.join('reviews', 'prose-taste-benchmark-report.json'),
    sourceGroups: [
      buildSourceGroup('benchmark-samples', 'Prose taste benchmark samples', [
        path.join('reviews', 'prose-taste-benchmark'),
      ]),
      buildSourceGroup('style-guide', 'Style guide', [
        path.join('meta', 'style-guide.json'),
      ]),
      buildSourceGroup('chapters', 'Chapter metadata and manuscripts', [
        path.join('chapters'),
      ], false),
    ],
  },
  {
    area: 'reader-response',
    relativePath: path.join('reviews', 'reader-response-calibration.json'),
    sourceGroups: [
      buildSourceGroup('reader-panel', 'Reader response panel samples', [
        path.join('reviews', 'reader-response'),
      ]),
      buildSourceGroup('quality-trend', 'Quality trend evidence', [
        path.join('meta', 'quality-trend.json'),
      ], false),
    ],
  },
];

interface ReadinessSourceGroupConfig {
  id: string;
  label: string;
  relativePaths: string[];
  required: boolean;
}

interface AbsoluteReadinessSourceGroup {
  id: string;
  label: string;
  paths: string[];
  required: boolean;
}

function buildSourceGroup(
  id: string,
  label: string,
  relativePaths: string[],
  required = true
): ReadinessSourceGroupConfig {
  return {
    id,
    label,
    relativePaths,
    required,
  };
}

export async function runMasterpieceReadinessFromProject(
  args: RunMasterpieceReadinessProjectArgs
): Promise<RunMasterpieceReadinessCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const outputPath = path.resolve(args.outputPath ?? path.join(projectDir, 'reviews', 'masterpiece-readiness-report.json'));
  const project = await readOptionalJson(path.join(projectDir, 'meta', 'project.json'));
  const projectId = args.projectId ?? project?.project_id ?? project?.id ?? path.basename(projectDir);
  const inputs: MasterpieceReadinessAreaInput[] = [];
  const reports: MasterpieceReadinessReportSource[] = [];

  for (const reportPath of DEFAULT_REPORT_PATHS) {
    const absolutePath = path.join(projectDir, reportPath.relativePath);
    const report = await readOptionalJson(absolutePath);
    const freshness = await evaluateReportFreshness(
      projectDir,
      absolutePath,
      report,
      reportPath.sourceGroups.map(sourceGroup => ({
        id: sourceGroup.id,
        label: sourceGroup.label,
        required: sourceGroup.required,
        paths: sourceGroup.relativePaths.map(relativePath => path.join(projectDir, relativePath)),
      }))
    );
    inputs.push({
      id: reportPath.area,
      path: absolutePath,
      report,
      freshness,
    });
    reports.push({
      area: reportPath.area,
      path: absolutePath,
      present: report !== undefined,
      freshness,
    });
  }

  const readiness = hydrateActionPlanCommands(
    evaluateMasterpieceReadiness(inputs, {
      minimumOverallScore: args.minimumOverallScore,
    }),
    projectDir
  );
  const result: RunMasterpieceReadinessCliResult = {
    projectId,
    projectDir,
    outputPath,
    reports,
    readiness,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return result;
}

function hydrateActionPlanCommands(
  readiness: MasterpieceReadinessResult,
  projectDir: string
): MasterpieceReadinessResult {
  const projectArg = quoteCliArg(projectDir);
  const hydrateCommands = (commands: string[]): string[] => (
    commands.map(command => command.replace(/<project>/g, projectArg))
  );
  return {
    ...readiness,
    actionPlan: readiness.actionPlan.map(item => ({
      ...item,
      commands: hydrateCommands(item.commands),
    })),
    areaResults: readiness.areaResults.map(area => ({
      ...area,
      actionPlan: area.actionPlan.map(item => ({
        ...item,
        commands: hydrateCommands(item.commands),
      })),
    })),
  };
}

function quoteCliArg(value: string): string {
  if (!/[\s"]/u.test(value)) {
    return value;
  }
  return `"${value.replace(/"/g, '\\"')}"`;
}

async function readJson(filePath: string): Promise<any> {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

async function readOptionalJson(filePath: string): Promise<any | undefined> {
  try {
    return await readJson(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

async function evaluateReportFreshness(
  projectDir: string,
  reportPath: string,
  report: unknown,
  sourceGroups: AbsoluteReadinessSourceGroup[]
): Promise<MasterpieceReadinessFreshness | undefined> {
  const reportStat = await statOptional(reportPath);
  if (!reportStat) {
    return undefined;
  }

  const sourcePaths = sourceGroups.flatMap(sourceGroup => sourceGroup.paths);
  const sourceGroupCoverage = await Promise.all(
    sourceGroups.map(async sourceGroup => {
      const files = (await Promise.all(sourceGroup.paths.map(sourcePath => collectExistingFiles(sourcePath))))
        .flat()
        .sort();
      return {
        id: sourceGroup.id,
        label: sourceGroup.label,
        required: sourceGroup.required,
        pathCount: files.length,
        paths: files.map(filePath => normalizeProjectRelativePath(projectDir, filePath)),
      };
    })
  );
  const sourceFiles = (await Promise.all(sourcePaths.map(sourcePath => collectExistingFiles(sourcePath))))
    .flat();
  const sourceStats = await Promise.all(
    sourceFiles.map(async sourcePath => ({
      path: sourcePath,
      stat: await statOptional(sourcePath),
    }))
  );
  const existingSourceStats = sourceStats
    .filter((entry): entry is { path: string; stat: Awaited<ReturnType<typeof statOptional>> & {} } =>
      entry.stat !== undefined
    )
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  const newestSource = existingSourceStats[0];
  const currentSourceEvidence = await buildSourceEvidenceManifest(projectDir, sourcePaths);
  const sourceEvidenceComparison = compareSourceEvidence(
    extractSourceEvidenceManifest(report),
    currentSourceEvidence
  );
  const sourceEvidenceStale = (
    sourceEvidenceComparison.status === 'mismatch'
    || sourceEvidenceComparison.status === 'not-recorded'
  );

  return {
    stale: (newestSource ? newestSource.stat.mtimeMs > reportStat.mtimeMs + 1 : false)
      || sourceEvidenceStale,
    reportModifiedAt: reportStat.mtime.toISOString(),
    newestSourceModifiedAt: newestSource?.stat.mtime.toISOString(),
    newestSourcePath: newestSource?.path,
    sourcePathCount: existingSourceStats.length,
    sourceGroups: sourceGroupCoverage,
    sourceDigest: sourceEvidenceComparison.currentDigest,
    recordedSourceDigest: sourceEvidenceComparison.recordedDigest,
    sourceEvidenceStatus: sourceEvidenceComparison.status,
    changedSourcePaths: sourceEvidenceComparison.changedPaths,
  };
}

function normalizeProjectRelativePath(projectDir: string, filePath: string): string {
  return path.relative(projectDir, filePath).split(path.sep).join('/');
}

async function collectExistingFiles(targetPath: string): Promise<string[]> {
  const stat = await statOptional(targetPath);
  if (!stat) {
    return [];
  }
  if (stat.isFile()) {
    return [targetPath];
  }
  if (!stat.isDirectory()) {
    return [];
  }

  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry =>
    collectExistingFiles(path.join(targetPath, entry.name))
  ));
  return nested.flat();
}

async function statOptional(filePath: string): Promise<import('node:fs').Stats | undefined> {
  try {
    return await fs.stat(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}
