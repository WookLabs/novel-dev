import { afterEach, describe, expect, it } from 'vitest';
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  buildSourceEvidenceManifest,
  type SourceEvidenceManifest,
} from '../../src/cli/source-evidence.js';

const root = process.cwd();

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

function expectedProjectCommand(projectDir: string, script: string): string {
  return `node dist/cli/${script}.js --project ${quoteCliArg(projectDir)} --json`;
}

function quoteCliArg(value: string): string {
  if (!/[\s"]/u.test(value)) {
    return value;
  }
  return `"${value.replace(/"/g, '\\"')}"`;
}

describe('masterpiece readiness CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('aggregates existing benchmark reports into one readiness report', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'meta'), { recursive: true });
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeFile(
      join(projectDir, 'meta', 'project.json'),
      `${JSON.stringify({ project_id: 'sample-project' }, null, 2)}\n`,
      'utf8'
    );
    await writeReadinessSourceFixtures(projectDir);
    await writeReadyReportSet(projectDir);

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toMatchObject({
      projectId: 'sample-project',
      readiness: {
        overallScore: 100,
        minimumOverallScore: 98,
        passed: true,
        status: 'ready',
        missingRequiredAreas: [],
        atRiskAreas: [],
        needsEvidenceAreas: [],
      },
    });
    expect(output.reports).toHaveLength(7);
    expect(output.reports.every((report: any) => report.present === true)).toBe(true);
    expect(output.readiness.areaResults.map((area: any) => area.id)).toEqual([
      'premise-appeal',
      'engagement',
      'series-retention',
      'character-relationship',
      'long-form-consistency',
      'prose-taste',
      'reader-response',
    ]);

    const outputPath = join(projectDir, 'reviews', 'masterpiece-readiness-report.json');
    expect(existsSync(outputPath)).toBe(true);
    const persisted = await readJson(outputPath);
    expect(persisted.readiness.passed).toBe(true);
    expect(persisted.readiness.overallScore).toBe(100);
    expect(persisted.readiness.actionPlan).toEqual([]);
  });

  it('surfaces reader response evidence collection tasks in the readiness action plan', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-action-plan-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeReadinessSourceFixtures(projectDir);
    await writeReadyReportSet(projectDir);
    await writeReportWithEvidence(projectDir, 'reader-response-calibration.json', {
      calibration: {
        total: 4,
        failed: 0,
        accuracy: 1,
        readyForGateTuning: false,
        lowHumanReaderEvidenceCount: 2,
        evidenceCollectionPlan: [
          {
            id: 'record-human-reader-provenance',
            priority: 'critical',
            target: 'human-reader-provenance',
            currentValue: '2/4 usable',
            requiredValue: 'all tuning samples with human respondent ratio >= 80%',
            sampleIds: ['panel-1', 'panel-2'],
            action: 'Recruit verified target readers and record respondent provenance.',
            rationale: 'Synthetic or unknown reader provenance cannot prove 98+ readiness.',
          },
        ],
        recommendations: ['Collect verified human reader panel evidence.'],
      },
    });

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    const expectedCommand = expectedProjectCommand(projectDir, 'calibrate-reader-response');
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('needs-evidence');
    expect(output.readiness.actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          id: 'record-human-reader-provenance',
          priority: 'critical',
          sampleIds: ['panel-1', 'panel-2'],
          commands: [expectedCommand],
        }),
      ])
    );
    expect(output.readiness.areaResults.find((area: any) => area.id === 'reader-response').actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'record-human-reader-provenance',
        }),
      ])
    );

    const textResult = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
      ],
      { encoding: 'utf8' }
    );

    expect(textResult.status, textResult.stderr).toBe(0);
    expect(textResult.stdout).toContain('Action plan:');
    expect(textResult.stdout).toContain(`command: ${expectedCommand}`);

    const persisted = await readJson(join(projectDir, 'reviews', 'masterpiece-readiness-report.json'));
    expect(persisted.readiness.actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commands: [expectedCommand],
        }),
      ])
    );
  });

  it('rejects ready-looking reports when source evidence inputs are empty', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-no-sources-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'meta'), { recursive: true });
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeFile(
      join(projectDir, 'meta', 'project.json'),
      `${JSON.stringify({ project_id: 'sample-project' }, null, 2)}\n`,
      'utf8'
    );

    await writeReadyReportSet(projectDir, { includeSourceEvidence: false });

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('at-risk');
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toEqual(
      expect.arrayContaining(['no-source-evidence'])
    );
    expect(output.readiness.atRiskAreas).toEqual([
      'premise-appeal',
      'engagement',
      'series-retention',
      'character-relationship',
      'long-form-consistency',
      'prose-taste',
      'reader-response',
    ]);
  });

  it('rejects ready-looking reports when a required source evidence group is missing', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-missing-source-group-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'meta'), { recursive: true });
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeFile(
      join(projectDir, 'meta', 'project.json'),
      `${JSON.stringify({ project_id: 'sample-project' }, null, 2)}\n`,
      'utf8'
    );
    await writeReadinessSourceFixtures(projectDir, { omit: ['premise-benchmark'] });
    await writeReadyReportSet(projectDir);

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('at-risk');
    expect(output.readiness.atRiskAreas).toEqual(['premise-appeal']);
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toContain(
      'missing-source-group-benchmark-samples'
    );
    expect(output.readiness.gaps.map((gap: any) => gap.code)).not.toContain('no-source-evidence');
    expect(output.reports.find((report: any) => report.area === 'premise-appeal')).toMatchObject({
      freshness: {
        sourceEvidenceStatus: 'matched',
        sourcePathCount: 1,
        sourceGroups: expect.arrayContaining([
          expect.objectContaining({
            id: 'benchmark-samples',
            pathCount: 0,
            required: true,
          }),
          expect.objectContaining({
            id: 'design-strategy',
            pathCount: 1,
            required: false,
          }),
        ]),
      },
    });
  });

  it('rejects consistency reports that claim chapter ids missing from source evidence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-chapter-source-mismatch-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'meta'), { recursive: true });
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeFile(
      join(projectDir, 'meta', 'project.json'),
      `${JSON.stringify({ project_id: 'sample-project' }, null, 2)}\n`,
      'utf8'
    );
    await writeReadinessSourceFixtures(projectDir, { omit: ['chapter-002', 'chapter-003'] });
    await writeReadyReportSet(projectDir);

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('at-risk');
    expect(output.readiness.atRiskAreas).toEqual(['long-form-consistency']);
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toContain(
      'consistency-source-chapter-id-mismatch'
    );
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toContain(
      'consistency-source-manuscript-id-mismatch'
    );
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toContain(
      'consistency-source-metadata-id-mismatch'
    );
    expect(output.readiness.gaps.map((gap: any) => gap.code)).not.toContain(
      'consistency-source-chapter-mismatch'
    );
    expect(output.readiness.gaps.map((gap: any) => gap.code)).not.toContain(
      'missing-source-group-chapters'
    );
    expect(output.reports.find((report: any) => report.area === 'long-form-consistency')).toMatchObject({
      freshness: {
        sourceEvidenceStatus: 'matched',
        sourceGroups: expect.arrayContaining([
          expect.objectContaining({
            id: 'chapters',
            pathCount: 2,
            paths: expect.arrayContaining([
              'chapters/chapter_001.json',
              'chapters/chapter_001.md',
            ]),
          }),
        ]),
      },
    });
  });

  it('rejects consistency reports when source chapter ids differ from claimed ids', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-wrong-chapter-source-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'meta'), { recursive: true });
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeFile(
      join(projectDir, 'meta', 'project.json'),
      `${JSON.stringify({ project_id: 'sample-project' }, null, 2)}\n`,
      'utf8'
    );
    await writeReadinessSourceFixtures(projectDir, {
      omit: ['chapter-001-json', 'chapter-001-md', 'chapter-002', 'chapter-003'],
    });
    await writeJsonFile(join(projectDir, 'chapters', 'chapter_004.json'), { chapter: 4 });
    await writeTextFile(join(projectDir, 'chapters', 'chapter_004.md'), 'The fourth scene belongs to a different run.\n');
    await writeJsonFile(join(projectDir, 'chapters', 'chapter_005.json'), { chapter: 5 });
    await writeTextFile(join(projectDir, 'chapters', 'chapter_005.md'), 'The fifth scene belongs to a different run.\n');
    await writeJsonFile(join(projectDir, 'chapters', 'chapter_006.json'), { chapter: 6 });
    await writeTextFile(join(projectDir, 'chapters', 'chapter_006.md'), 'The sixth scene belongs to a different run.\n');
    await writeReadyReportSet(projectDir);

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('at-risk');
    expect(output.readiness.atRiskAreas).toEqual(['long-form-consistency']);
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toContain(
      'consistency-source-chapter-id-mismatch'
    );
    expect(output.readiness.gaps.map((gap: any) => gap.code)).not.toContain(
      'consistency-source-chapter-mismatch'
    );
    expect(output.reports.find((report: any) => report.area === 'long-form-consistency')).toMatchObject({
      freshness: {
        sourceEvidenceStatus: 'matched',
        sourceGroups: expect.arrayContaining([
          expect.objectContaining({
            id: 'chapters',
            pathCount: 6,
            paths: expect.arrayContaining([
              'chapters/chapter_004.json',
              'chapters/chapter_004.md',
              'chapters/chapter_005.json',
              'chapters/chapter_005.md',
              'chapters/chapter_006.json',
              'chapters/chapter_006.md',
            ]),
          }),
        ]),
      },
    });
  });

  it('rejects consistency reports when chapter metadata exists without manuscripts', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-manuscript-source-mismatch-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'meta'), { recursive: true });
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeFile(
      join(projectDir, 'meta', 'project.json'),
      `${JSON.stringify({ project_id: 'sample-project' }, null, 2)}\n`,
      'utf8'
    );
    await writeReadinessSourceFixtures(projectDir, {
      omit: ['chapter-001-md', 'chapter-002-md', 'chapter-003-md'],
    });
    await writeReadyReportSet(projectDir);

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('at-risk');
    expect(output.readiness.atRiskAreas).toEqual(['long-form-consistency']);
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toContain(
      'consistency-source-manuscript-id-mismatch'
    );
    expect(output.readiness.gaps.map((gap: any) => gap.code)).not.toContain(
      'consistency-source-manuscript-mismatch'
    );
    expect(output.reports.find((report: any) => report.area === 'long-form-consistency')).toMatchObject({
      freshness: {
        sourceEvidenceStatus: 'matched',
        sourceGroups: expect.arrayContaining([
          expect.objectContaining({
            id: 'chapters',
            pathCount: 3,
            paths: expect.arrayContaining([
              'chapters/chapter_001.json',
              'chapters/chapter_002.json',
              'chapters/chapter_003.json',
            ]),
          }),
        ]),
      },
    });
  });

  it('reports missing benchmark evidence instead of silently passing', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-missing-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeReadinessSourceFixtures(projectDir);
    await writeReportWithEvidence(projectDir, 'engagement-benchmark-report.json', {
      benchmark: {
        total: 1,
        failed: 0,
        accuracy: 1,
        readyForGateTuning: false,
        missingRequiredRoutes: ['beauty'],
        recommendations: ['Collect beauty-route holdout samples.'],
      },
    });

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('missing');
    expect(output.readiness.missingRequiredAreas).toEqual([
      'premise-appeal',
      'series-retention',
      'character-relationship',
      'long-form-consistency',
      'prose-taste',
      'reader-response',
    ]);
    expect(output.readiness.needsEvidenceAreas).toEqual(['engagement']);
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toEqual(
      expect.arrayContaining(['missing-report', 'missing-required-routes'])
    );
  });

  it('rejects stale benchmark reports older than their source evidence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-stale-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'meta'), { recursive: true });
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeFile(
      join(projectDir, 'meta', 'project.json'),
      `${JSON.stringify({ project_id: 'sample-project' }, null, 2)}\n`,
      'utf8'
    );
    await writeReadinessSourceFixtures(projectDir);
    await writeReadyReportSet(projectDir);

    const oldTime = new Date('2026-01-01T00:00:00.000Z');
    const newTime = new Date('2026-01-02T00:00:00.000Z');
    const proseReportPath = join(projectDir, 'reviews', 'prose-taste-benchmark-report.json');
    await utimes(proseReportPath, oldTime, oldTime);
    const sourcePath = join(projectDir, 'reviews', 'prose-taste-benchmark', 'style-samples.json');
    await writeFile(
      sourcePath,
      `${JSON.stringify({ samples: [{ id: 'new-style-sample' }] }, null, 2)}\n`,
      'utf8'
    );
    await utimes(sourcePath, newTime, newTime);

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('at-risk');
    expect(output.readiness.atRiskAreas).toEqual(['prose-taste']);
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toContain('stale-report');
    expect(output.reports.find((report: any) => report.area === 'prose-taste')).toMatchObject({
      present: true,
      freshness: {
        stale: true,
        sourcePathCount: expect.any(Number),
      },
    });
    expect(
      output.reports.find((report: any) => report.area === 'prose-taste').freshness.changedSourcePaths
    ).toContain('reviews/prose-taste-benchmark/style-samples.json');
  });

  it('rejects benchmark reports whose recorded source evidence digest no longer matches', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-source-digest-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'meta'), { recursive: true });
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeFile(
      join(projectDir, 'meta', 'project.json'),
      `${JSON.stringify({ project_id: 'sample-project' }, null, 2)}\n`,
      'utf8'
    );
    await writeReadinessSourceFixtures(projectDir);
    await writeReadyReportSet(projectDir);

    const sourcePath = join(projectDir, 'reviews', 'prose-taste-benchmark', 'style-samples.json');
    await utimes(sourcePath, new Date('2026-01-01T00:00:00.000Z'), new Date('2026-01-01T00:00:00.000Z'));
    await writeReport(projectDir, 'prose-taste-benchmark-report.json', {
      ...(buildReadyBenchmark('readyForStyleTuning') as any),
      sourceEvidence: {
        schemaVersion: 'novel-dev.source-evidence.v1',
        algorithm: 'sha256',
        generatedAt: '2026-01-01T00:00:00.000Z',
        digest: '0'.repeat(64),
        fileCount: 0,
        files: [],
      },
    });
    await utimes(
      join(projectDir, 'reviews', 'prose-taste-benchmark-report.json'),
      new Date('2026-01-02T00:00:00.000Z'),
      new Date('2026-01-02T00:00:00.000Z')
    );

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('at-risk');
    expect(output.readiness.atRiskAreas).toEqual(['prose-taste']);
    expect(output.readiness.gaps.map((gap: any) => gap.code)).toContain('stale-report');
    expect(output.reports.find((report: any) => report.area === 'prose-taste')).toMatchObject({
      present: true,
      freshness: {
        stale: true,
        sourcePathCount: expect.any(Number),
        sourceEvidenceStatus: 'mismatch',
        recordedSourceDigest: '0'.repeat(64),
      },
    });
    expect(
      output.reports.find((report: any) => report.area === 'prose-taste').freshness.changedSourcePaths
    ).toContain('reviews/prose-taste-benchmark/style-samples.json');
  });

  it('can fail CI when readiness evidence is incomplete', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'masterpiece-readiness-cli-fail-gate-'));
    tempDirs.push(workDir);
    const projectDir = join(workDir, 'sample-project');
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeReadinessSourceFixtures(projectDir);
    await writeReportWithEvidence(projectDir, 'engagement-benchmark-report.json', {
      benchmark: {
        total: 1,
        failed: 0,
        accuracy: 1,
        readyForGateTuning: false,
        missingRequiredRoutes: ['beauty'],
        recommendations: ['Collect beauty-route holdout samples.'],
      },
    });

    const cliPath = join(workDir, 'run-masterpiece-readiness.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-masterpiece-readiness.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--fail-on-not-ready',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('Masterpiece readiness gate failed');
    const output = JSON.parse(result.stdout);
    expect(output.readiness.passed).toBe(false);
    expect(output.readiness.status).toBe('missing');
  });
});

async function writeReport(projectDir: string, fileName: string, report: unknown): Promise<void> {
  await writeFile(
    join(projectDir, 'reviews', fileName),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  );
}

const REPORT_SOURCE_RELATIVE_PATHS: Record<string, string[]> = {
  'premise-appeal-benchmark-report.json': [
    join('reviews', 'premise-appeal-benchmark'),
    join('meta', 'design-strategy.json'),
  ],
  'engagement-benchmark-report.json': [
    join('reviews', 'engagement-benchmark'),
    join('meta', 'design-strategy.json'),
    join('plot'),
    join('chapters'),
    join('characters'),
  ],
  'series-retention-benchmark-report.json': [
    join('reviews', 'series-retention-benchmark'),
  ],
  'character-relationship-benchmark-report.json': [
    join('reviews', 'character-relationship-benchmark'),
  ],
  'consistency-report.json': [
    join('chapters'),
    join('world'),
    join('characters'),
    join('plot'),
    join('context', 'summaries'),
  ],
  'prose-taste-benchmark-report.json': [
    join('reviews', 'prose-taste-benchmark'),
    join('meta', 'style-guide.json'),
    join('chapters'),
  ],
  'reader-response-calibration.json': [
    join('reviews', 'reader-response'),
    join('meta', 'quality-trend.json'),
  ],
};

async function writeReportWithEvidence(projectDir: string, fileName: string, report: unknown): Promise<void> {
  const sourceRelativePaths = REPORT_SOURCE_RELATIVE_PATHS[fileName];
  if (!sourceRelativePaths) {
    throw new Error(`Unknown readiness report fixture: ${fileName}`);
  }

  const sourceEvidence = await buildSourceEvidenceManifest(
    projectDir,
    sourceRelativePaths.map(relativePath => join(projectDir, relativePath))
  );
  await writeReport(projectDir, fileName, attachSourceEvidence(report, sourceEvidence));
}

function attachSourceEvidence(report: unknown, sourceEvidence: SourceEvidenceManifest): unknown {
  if (!report || typeof report !== 'object' || Array.isArray(report)) {
    throw new Error('Readiness fixture report must be an object');
  }
  return {
    ...(report as Record<string, unknown>),
    sourceEvidence,
  };
}

async function writeReadyReportSet(
  projectDir: string,
  options: { includeSourceEvidence?: boolean } = {}
): Promise<void> {
  const write = options.includeSourceEvidence === false ? writeReport : writeReportWithEvidence;
  await write(projectDir, 'premise-appeal-benchmark-report.json', buildReadyBenchmark());
  await write(projectDir, 'engagement-benchmark-report.json', buildReadyBenchmark());
  await write(projectDir, 'series-retention-benchmark-report.json', buildReadyBenchmark());
  await write(projectDir, 'character-relationship-benchmark-report.json', buildReadyBenchmark());
  await write(projectDir, 'consistency-report.json', buildReadyConsistencyReport());
  await write(projectDir, 'prose-taste-benchmark-report.json', buildReadyBenchmark('readyForStyleTuning'));
  await write(projectDir, 'reader-response-calibration.json', {
    calibration: {
      total: 4,
      failed: 0,
      accuracy: 1,
      readyForGateTuning: true,
      recommendations: [],
    },
  });
}

async function writeReadinessSourceFixtures(
  projectDir: string,
  options: { omit?: string[] } = {}
): Promise<void> {
  const omitted = new Set(options.omit ?? []);
  await writeJsonFile(join(projectDir, 'meta', 'design-strategy.json'), {
    reader_promise_contract: {
      core_hook: 'A court musician must expose a conspiracy before the coronation night ends.',
    },
  });
  await writeJsonFile(join(projectDir, 'meta', 'style-guide.json'), {
    prose_profile: 'balanced',
    taboo_words: ['expository'],
  });
  await writeJsonFile(join(projectDir, 'meta', 'quality-trend.json'), {
    chapters: [{ chapter: 1, score: 94 }],
  });
  if (!omitted.has('premise-benchmark')) {
    await writeJsonFile(join(projectDir, 'reviews', 'premise-appeal-benchmark', 'samples.json'), {
      samples: [{ id: 'premise-good', split: 'holdout' }],
    });
  }
  if (!omitted.has('engagement-benchmark')) {
    await writeJsonFile(join(projectDir, 'reviews', 'engagement-benchmark', 'samples.json'), {
      samples: [{ id: 'engagement-good', chapter: 1, split: 'holdout' }],
    });
  }
  if (!omitted.has('series-retention-benchmark')) {
    await writeJsonFile(join(projectDir, 'reviews', 'series-retention-benchmark', 'samples.json'), {
      samples: [{ id: 'retention-good', sequence: [1, 2, 3], split: 'holdout' }],
    });
  }
  if (!omitted.has('character-relationship-benchmark')) {
    await writeJsonFile(join(projectDir, 'reviews', 'character-relationship-benchmark', 'samples.json'), {
      samples: [{ id: 'relationship-good', relationship_type: 'rivalry', split: 'holdout' }],
    });
  }
  if (!omitted.has('prose-taste-benchmark')) {
    await writeJsonFile(join(projectDir, 'reviews', 'prose-taste-benchmark', 'style-samples.json'), {
      samples: [{ id: 'style-good', split: 'holdout' }],
    });
  }
  if (!omitted.has('reader-response')) {
    await writeJsonFile(join(projectDir, 'reviews', 'reader-response', 'panel.json'), {
      samples: [{ id: 'panel-good', readerCount: 12 }],
    });
  }
  if (!omitted.has('chapter-001-json')) {
    await writeJsonFile(join(projectDir, 'chapters', 'chapter_001.json'), { chapter: 1 });
  }
  if (!omitted.has('chapter-001-md')) {
    await writeTextFile(join(projectDir, 'chapters', 'chapter_001.md'), 'The first scene opens in the court silence.\n');
  }
  if (!omitted.has('chapter-002')) {
    if (!omitted.has('chapter-002-json')) {
      await writeJsonFile(join(projectDir, 'chapters', 'chapter_002.json'), { chapter: 2 });
    }
    if (!omitted.has('chapter-002-md')) {
      await writeTextFile(join(projectDir, 'chapters', 'chapter_002.md'), 'The second scene reveals the cost of the promise.\n');
    }
  }
  if (!omitted.has('chapter-003')) {
    if (!omitted.has('chapter-003-json')) {
      await writeJsonFile(join(projectDir, 'chapters', 'chapter_003.json'), { chapter: 3 });
    }
    if (!omitted.has('chapter-003-md')) {
      await writeTextFile(join(projectDir, 'chapters', 'chapter_003.md'), 'The third scene makes the choice irreversible.\n');
    }
  }
  await writeJsonFile(join(projectDir, 'world', 'world.json'), { setting: 'late Joseon-inspired court' });
  await writeJsonFile(join(projectDir, 'characters', 'index.json'), { characters: ['yun'] });
  await writeJsonFile(join(projectDir, 'plot', 'structure.json'), { acts: [{ id: 'act-1' }] });
  await writeJsonFile(join(projectDir, 'context', 'summaries', 'chapter_001.json'), {
    summary: 'The protagonist hears the forbidden melody.',
  });
}

async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await writeTextFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeTextFile(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf8');
}

function buildReadyBenchmark(readyKey = 'readyForGateTuning'): unknown {
  return {
    benchmark: {
      total: 4,
      failed: 0,
      accuracy: 1,
      [readyKey]: true,
      recommendations: [],
    },
  };
}

function buildReadyConsistencyReport(): unknown {
  return {
    checked_at: '2026-06-21T00:00:00.000Z',
    chapter_range: { start: 1, end: 3 },
    chapters_analyzed: [1, 2, 3],
    total_issues: 0,
    issues: [],
    domain_coverage: {
      character: true,
      timeline: true,
      setting: true,
      factual: true,
      plot_logic: true,
    },
    summary: {
      character_issues: 0,
      timeline_issues: 0,
      world_issues: 0,
      factual_issues: 0,
      plot_logic_issues: 0,
    },
  };
}
