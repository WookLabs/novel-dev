import { afterEach, describe, expect, it } from 'vitest';
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { chmod, cp, mkdir, mkdtemp, readFile, rm, utimes, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const sampleProject = join(root, 'tests', 'fixtures', 'sample-project');
const testNovelId = 'novel_20260618_233000';

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

async function writeJson(path: string, data: unknown): Promise<void> {
  await writeFile(path, JSON.stringify(data, null, 2));
}

function staleSourceEvidence(...relativePaths: string[]): unknown {
  return {
    schemaVersion: 'novel-dev.source-evidence.v1',
    algorithm: 'sha256',
    generatedAt: '2026-06-21T00:00:00.000Z',
    digest: 'stale-digest',
    fileCount: relativePaths.length,
    files: relativePaths.map(relativePath => ({
      path: relativePath,
      sha256: 'stale-sha',
      sizeBytes: 1,
      modifiedAt: '2026-06-21T00:00:00.000Z',
    })),
  };
}

async function seedRalphState(projectDir: string): Promise<void> {
  await mkdir(join(projectDir, 'meta'), { recursive: true });
  await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
    $schema: '../../../schemas/ralph-state.schema.json',
    schema_version: '2.0',
    novel_id: testNovelId,
    ralph_active: true,
    mode: 'write-all',
    project_id: 'sample-project',
    current_act: 1,
    current_chapter: 1,
    last_safe_chapter: 0,
    total_chapters: 12,
    total_acts: 3,
    quality_retries: 0,
    completed_chapters: [],
    failed_chapters: [],
    retry_count: 0,
    iteration: 1,
    max_iterations: 100,
    can_resume: true,
  });
}

async function seedRalphStateAtChapterThree(projectDir: string): Promise<void> {
  await seedRalphState(projectDir);
  const statePath = join(projectDir, 'meta', 'ralph-state.json');
  const state = await readJson(statePath);
  await writeJson(statePath, {
    ...state,
    current_chapter: 3,
    last_safe_chapter: 2,
    total_chapters: 3,
    completed_chapters: [1, 2],
    failed_chapters: [],
    retry_count: 0,
    quality_retries: 0,
  });
}

async function prepareThirdChapter(projectDir: string): Promise<void> {
  const chapter = await readJson(join(projectDir, 'chapters', 'chapter_002.json'));
  await writeJson(join(projectDir, 'chapters', 'chapter_003.json'), {
    ...chapter,
    chapter_number: 3,
    chapter_title: '세 번째 예고',
  });
  const manuscript = await readFile(join(projectDir, 'chapters', 'chapter_002.md'), 'utf8');
  await writeFile(
    join(projectDir, 'chapters', 'chapter_003.md'),
    manuscript.replace('두 번째 예고', '세 번째 예고'),
    'utf8'
  );

  const plotPath = join(projectDir, 'plot', 'plot-strategy.json');
  const plot = await readJson(plotPath);
  plot.chapter_allocation.total_chapters = 3;
  plot.chapter_allocation.act_breakdown[0].chapters = '1-3';
  plot.tension_curve.key_peaks.push({
    ...plot.tension_curve.key_peaks[1],
    chapter: 3,
    event: '세 번째 예고가 같은 보상 패턴으로 반복되며 독자 유지가 급락한다.',
  });
  plot.subplot_integration[0].chapters = '1-3';
  plot.subplot_integration[0].intersection_with_main = [1, 2, 3];
  plot.per_chapter_guide.push({
    ...plot.per_chapter_guide[1],
    chapter: 3,
    arc_beats: '주인공이 세 번째 예고를 추적하지만 이전 회차와 같은 방식의 알림-추적-위기 보상이 반복된다.',
    hooks: '세 번째 예고가 같은 규칙만 되풀이될 가능성',
    fun_spec: {
      ...plot.per_chapter_guide[1].fun_spec,
      reader_reward: '세 번째 알림 로그가 다시 앱 로고와 과거 미제 사건 번호를 반복한다는 확인',
      page_turn_question: '예고 앱은 왜 같은 패턴을 반복하며 주인공 주변만 겨냥하는가?',
      must_click_ending: '세 번째 예고 대상의 위치가 주인공 근처로 좁혀지고 과거 사건 번호가 다시 반복된다.',
    },
  });
  await writeJson(plotPath, plot);
}

async function bundleCli(workDir: string): Promise<string> {
  const cliPath = join(workDir, 'apply-chapter-gate.mjs');
  await build({
    entryPoints: [join(root, 'src', 'cli', 'apply-chapter-gate.ts')],
    outfile: cliPath,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    logLevel: 'silent',
  });
  return cliPath;
}

describe('chapter gate CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('records engagement, passes the unified gate, and advances Ralph state', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-pass-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    const cliPath = await bundleCli(workDir);

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '92',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.gate).toMatchObject({
      status: 'PASS',
      passed: true,
      score: 92,
    });
    expect(output.engagement).toMatchObject({
      passed: true,
      chapterNumber: 1,
    });

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([1]);
    expect(state.failed_chapters).toEqual([]);
    expect(state.current_chapter).toBe(2);
    expect(state.last_gate).toMatchObject({
      chapter: 1,
      status: 'PASS',
      passed: true,
      score: 92,
    });
  });

  it('blocks completion when existing reader panel calibration rejects the automated pass', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-reader-panel-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'reader-response-calibration.json'), {
      projectId: 'sample-project',
      calibration: {
        calibrationScore: 70,
        sampleResults: [
          {
            id: 'chapter-001-panel',
            chapter: 1,
            automatedScore: 94,
            readerCompositeScore: 62,
            scoreGap: 32,
            respondentCount: 8,
            reliability: 'usable',
            failureType: 'auto-false-positive',
            dropOffLocalizationEvidence: 'usable',
            dropOffLocalizationEvidenceIssues: [],
            dropOffAnnotations: [
              {
                location: 'scene-01 paragraph-04',
                eventType: 'drop-off',
                lastCompletedLocation: 'scene-01 paragraph-03',
                triggerQuote: 'Rule explanation replaced visible consequence.',
                reason: 'Readers dropped before the final hook because the app rule explanation delayed the next concrete threat.',
                readerCount: 2,
                readerSegment: 'platform-native',
                suggestedRevision: 'Cut the rule explanation and show the failed choice creating the next threat on page.',
              },
            ],
            frictionAnnotations: [
              {
                location: 'ending beat',
                dimension: 'next-click',
                reason: 'Readers saw a cliffhanger label but no immediate consequence that forced the next click.',
                severity: 'critical',
                rewriteSuggestion: 'Make the final clue close one hypothesis and force the protagonist into a visible next action.',
                readerCount: 5,
              },
            ],
            dimensionIssues: [
              {
                dimension: 'next-click',
                score: 42,
                threshold: 70,
                message: 'Readers are not sufficiently motivated to continue to the next chapter.',
              },
            ],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.engagement.passed).toBe(true);
    expect(output.proseCraft.passed).toBe(true);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 62,
      failureType: 'auto-false-positive',
      sampleId: 'chapter-001-panel',
    });
    expect(output.gate.status).toBe('RETRY');
    expect(output.readerResponse.issues.join('\n')).toContain('ending beat');
    expect(output.readerResponse.issues.join('\n')).toContain('scene-01 paragraph-04');
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'drop-off:drop-off',
          action: expect.stringContaining('scene-01 paragraph-04'),
          actual: expect.stringContaining('dropped before'),
        }),
        expect.objectContaining({
          dimension: 'next-click',
          action: expect.stringContaining('ending beat'),
          actual: expect.stringContaining('cliffhanger label'),
        }),
      ])
    );
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '독자 패널 반응 실패: 62점 (auto-false-positive)',
      ])
    );
    expect(output.gate.retryPrompt).toContain('Reader Response Revision Directives');
    expect(output.gate.retryPrompt).toContain('ending beat');
    expect(output.gate.retryPrompt).toContain('scene-01 paragraph-04');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('blocks completion when actual next-chapter behavior contradicts continuation intent', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-reader-panel-continuation-drop-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'reader-response-calibration.json'), {
      projectId: 'sample-project',
      calibration: {
        calibrationScore: 84,
        sampleResults: [
          {
            id: 'chapter-001-continuation-behavior',
            chapter: 1,
            automatedScore: 94,
            readerCompositeScore: 86,
            scoreGap: 8,
            respondentCount: 8,
            reliability: 'usable',
            humanReaderEvidence: 'usable',
            responseDataQuality: 'usable',
            evidenceQuality: 'weak',
            panelConsensus: 'clear',
            readerScoreConfidence: 'precise',
            cohortRepresentativeness: 'balanced',
            panelProtocolQuality: 'strong',
            annotationReliability: 'usable',
            durableEngagementEvidence: 'usable',
            resonanceEvidence: 'usable',
            continuationBehaviorEvidence: 'weak',
            continuationBehaviorEvidenceIssues: [
              'next chapter click-through 12.5% is below 30%.',
              'next chapter open/read-start behavior is below thresholds: open 12.5% < 25%, read-start 0% < 15%.',
            ],
            nextChapterCtaImpressionCount: 8,
            nextChapterClickCount: 1,
            nextChapterOpenCount: 1,
            nextChapterReadStartCount: 0,
            nextChapterClickThroughRatio: 0.125,
            nextChapterOpenRatio: 0.125,
            nextChapterReadStartRatio: 0,
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 86,
      failureType: 'continuation-behavior-drop',
      sampleId: 'chapter-001-continuation-behavior',
    });
    expect(output.readerResponse.issues.join('\n')).toContain('continuationBehaviorEvidence=weak');
    expect(output.readerResponse.issues.join('\n')).toContain('next chapter click-through 12.5%');
    expect(output.readerResponse.issues.join('\n')).toContain('clickThrough=12.5%');
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'actual-continuation-behavior',
          action: expect.stringContaining('click, open, and start the next chapter'),
          actual: expect.stringContaining('readStart=0%'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '독자 패널 반응 실패: 86점 (continuation-behavior-drop)',
      ])
    );
    expect(output.gate.retryPrompt).toContain('Reader Response Revision Directives');
    expect(output.gate.retryPrompt).toContain('actual-continuation-behavior');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('blocks completion when reader panel calibration source evidence is stale', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-reader-panel-stale-source-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews', 'reader-response'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'reader-response', 'chapter-001-panel.json'), {
      id: 'chapter-001-panel-source',
      chapter: 1,
      readerCompositeScore: 91,
    });
    await writeJson(join(projectDir, 'reviews', 'reader-response-calibration.json'), {
      projectId: 'sample-project',
      sourceEvidence: staleSourceEvidence('reviews/reader-response/chapter-001-panel.json'),
      calibration: {
        calibrationScore: 91,
        sampleResults: [
          {
            id: 'chapter-001-panel',
            chapter: 1,
            automatedScore: 94,
            readerCompositeScore: 91,
            scoreGap: 3,
            respondentCount: 8,
            reliability: 'usable',
            evidenceQuality: 'usable',
            actionabilityScore: 100,
            panelConsensus: 'clear',
            readerScoreConfidence: 'clear',
            cohortRepresentativeness: 'balanced',
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 0,
      failureType: 'stale-report:reader-response',
      sampleId: 'reviews/reader-response-calibration.json',
      reliability: 'stale/source-evidence',
    });
    expect(output.readerResponse.issues.join('\n')).toContain('reader response calibration report is stale');
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'reader-response-source-evidence',
          expected: 'report sourceEvidence matches current source files',
          actual: expect.stringContaining('sourceEvidence=mismatch'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '평가 리포트 freshness 실패: 0점 (stale-report:reader-response)',
      ])
    );
    expect(output.gate.retryPrompt).toContain('Evaluation Report Freshness Directives');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('blocks completion when reader panel revision outcome regresses against baseline', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-reader-panel-revision-regression-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'reader-response-calibration.json'), {
      projectId: 'sample-project',
      calibration: {
        calibrationScore: 84,
        sampleResults: [
          {
            id: 'chapter-001-revision-panel',
            chapter: 1,
            automatedScore: 94,
            readerCompositeScore: 88,
            scoreGap: 6,
            respondentCount: 8,
            reliability: 'usable',
            evidenceQuality: 'usable',
            actionabilityScore: 100,
            panelConsensus: 'clear',
            readerScoreConfidence: 'precise',
            cohortRepresentativeness: 'balanced',
            revisionOutcomeEvidence: 'regressed',
            revisionOutcomeIssues: [
              'revision reader-score lift -8 is below 5.',
              'revision guardrail regressions 1 exceed 0.',
            ],
            revisionPairId: 'chapter-001-v1-to-v2',
            revisionBaselineReaderScore: 92,
            revisionCurrentReaderScore: 84,
            revisionLift: -8,
            revisionPreferenceWinRate: 0.31,
            revisionPreferenceRespondentCount: 8,
            revisionGuardrailRegressionCount: 1,
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.engagement.passed).toBe(true);
    expect(output.proseCraft.passed).toBe(true);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 88,
      failureType: 'revision-regression',
      sampleId: 'chapter-001-revision-panel',
      reliability: 'usable/usable',
    });
    expect(output.readerResponse.issues.join('\n')).toContain('revisionOutcomeEvidence=regressed');
    expect(output.readerResponse.issues.join('\n')).toContain('guardrail regressions 1 exceed 0');
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'revision-outcome',
          actual: expect.stringContaining('guardrailRegressions=1'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '독자 패널 반응 실패: 88점 (revision-regression)',
      ])
    );
    expect(output.gate.retryPrompt).toContain('Reader Response Revision Directives');
    expect(output.gate.retryPrompt).toContain('chapter-001-v1-to-v2');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('does not hard-block completion from reader panel scores without actionable evidence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-reader-panel-weak-evidence-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'reader-response-calibration.json'), {
      projectId: 'sample-project',
      calibration: {
        calibrationScore: 61,
        sampleResults: [
          {
            id: 'chapter-001-score-only-panel',
            chapter: 1,
            automatedScore: 94,
            readerCompositeScore: 62,
            scoreGap: 32,
            respondentCount: 8,
            reliability: 'usable',
            evidenceQuality: 'none',
            actionabilityScore: 0,
            evidenceIssues: [
              'Reader sample lacks target-reader, completion, comment, and friction-point evidence.',
            ],
            failureType: 'auto-false-positive',
            dimensionIssues: [
              {
                dimension: 'next-click',
                score: 42,
                threshold: 70,
                message: 'Readers are not sufficiently motivated to continue to the next chapter.',
              },
            ],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toMatchObject({
      passed: true,
      score: 62,
      sampleId: 'chapter-001-score-only-panel',
      reliability: 'weak',
    });
    expect(output.readerResponse.issues.join('\n')).toContain('evidenceQuality=none');
    expect(output.gate.status).toBe('PASS');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([1]);
    expect(state.failed_chapters).toEqual([]);
  });

  it('does not hard-block completion from reader panel scores with wide confidence intervals', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-reader-panel-wide-confidence-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'reader-response-calibration.json'), {
      projectId: 'sample-project',
      calibration: {
        calibrationScore: 65,
        sampleResults: [
          {
            id: 'chapter-001-wide-confidence-panel',
            chapter: 1,
            automatedScore: 94,
            readerCompositeScore: 62,
            scoreGap: 32,
            respondentCount: 4,
            reliability: 'usable',
            evidenceQuality: 'usable',
            panelConsensus: 'clear',
            readerScoreMarginOfError: 17.64,
            readerScoreConfidence: 'wide',
            readerScoreConfidenceIssues: [
              '95% reader score margin of error 17.64 exceeds 10.',
            ],
            cohortRepresentativeness: 'balanced',
            actionabilityScore: 100,
            failureType: 'auto-false-positive',
            dimensionIssues: [
              {
                dimension: 'next-click',
                score: 42,
                threshold: 70,
                message: 'Readers are not sufficiently motivated to continue to the next chapter.',
              },
            ],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toMatchObject({
      passed: true,
      score: 62,
      sampleId: 'chapter-001-wide-confidence-panel',
      reliability: 'weak',
    });
    expect(output.readerResponse.issues.join('\n')).toContain('readerScoreConfidence=wide');
    expect(output.readerResponse.issues.join('\n')).toContain('marginOfError=17.64');
    expect(output.gate.status).toBe('PASS');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([1]);
    expect(state.failed_chapters).toEqual([]);
  });

  it('blocks completion when current character relationship evidence shows weak reader investment', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-character-relationship-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'character-relationship-benchmark-report.json'), {
      projectId: 'sample-project',
      benchmark: {
        sampleResults: [
          {
            id: 'chapter-001-flat-relationship',
            label: '현재 회차 조건 없는 신뢰 전환',
            chapter: 1,
            relationshipType: 'ally',
            automatedScore: 90,
            automatedPassed: true,
            expectedInvesting: false,
            readerInvestmentScore: 38,
            readerPassed: false,
            wouldContinueScore: 30,
            responseCount: 3,
            commentedResponseCount: 3,
            evidenceSufficient: true,
            weakDimensions: [
              'vulnerability_cost',
              'reciprocal_pressure',
              'character_attachment',
            ],
            dimensionResults: [
              {
                dimension: 'vulnerability_cost',
                score: 24,
                responseCount: 3,
                passed: false,
              },
              {
                dimension: 'reciprocal_pressure',
                score: 22,
                responseCount: 3,
                passed: false,
              },
              {
                dimension: 'character_attachment',
                score: 35,
                responseCount: 3,
                passed: false,
              },
            ],
            failureTypes: [
              'automated-false-positive',
              'weak-reader-investment',
              'weak-dimension',
            ],
            failureType: 'automated-false-positive',
            recommendations: [
              'Reader character/relationship investment is 38; strengthen agency, vulnerable cost, reciprocal pressure, and consequence before using this scene as a high-point model.',
            ],
            focus: {
              characterName: '이서진',
              relationshipType: 'ally',
              counterpartName: '조력자',
              scenePromise: '이서진과 조력자가 서로를 이해하고 협력하게 된다.',
              relationshipTurn: '조력자가 아무 조건 없이 믿기로 한다.',
              intendedChange: '둘은 함께 수사한다.',
              consequence: '다음 사건으로 넘어간다.',
            },
            readerEvidence: [
              {
                readerId: 'reader-1',
                comment: '믿기로 했다는 결과만 있고 왜 마음이 바뀌었는지 약하다.',
                disbeliefPoints: ['상대의 조건 없음'],
                rewriteSuggestion: '파트너가 조건을 걸고 주인공이 잃을 정보를 내놓아야 한다.',
              },
            ],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.engagement.passed).toBe(true);
    expect(output.proseCraft.passed).toBe(true);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 38,
      sampleId: 'chapter-001-flat-relationship',
      respondentCount: 3,
      reliability: 'usable/character-relationship',
    });
    expect(output.readerResponse.failureType).toContain('character-relationship');
    expect(output.readerResponse.failureType).toContain('automated-false-positive');
    expect(output.readerResponse.issues.join('\n')).toContain('상대의 조건 없음');
    expect(output.readerResponse.issues.join('\n')).toContain('reciprocal_pressure');
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'character-relationship',
          action: expect.stringContaining('파트너가 조건을 걸고'),
        }),
        expect.objectContaining({
          dimension: 'reciprocal_pressure',
          action: expect.stringContaining('counterpart'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining('인물/관계 독자 투자 실패: 38점'),
      ])
    );
    expect(output.gate.retryPrompt).toContain('Reader Response / Character Relationship Revision Directives');
    expect(output.gate.retryPrompt).toContain('조력자가 아무 조건 없이 믿기로 한다.');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('blocks Ralph Loop when a current series retention report shows target-reader fatigue', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-series-retention-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await prepareThirdChapter(projectDir);
    await seedRalphStateAtChapterThree(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'series-retention-benchmark-report.json'), {
      projectId: 'sample-project',
      benchmark: {
        sampleResults: [
          {
            id: 'chapter-001-003-retention-drop',
            label: 'current arc loses readers despite high automated scores',
            sequenceLength: 3,
            readerRetentionScore: 52,
            firstChapterRetentionScore: 78,
            lastChapterRetentionScore: 41,
            retentionDrop: 37,
            hookProgressEvidence: 'usable',
            hookStallChapterCount: 1,
            weakHookProgressEvidenceChapterCount: 0,
            readerPassed: false,
            repeatedRewardSignatureRun: 3,
            repeatedEmotionalSignatureRun: 3,
            responseCount: 9,
            commentedResponseCount: 9,
            evidenceSufficient: true,
            weakDimensions: ['fatigue_resistance', 'reward_variety'],
            failureTypes: [
              'automated-false-positive',
              'weak-reader-retention',
              'reader-retention-drop',
              'reader-funnel-drop',
              'reader-hook-stall',
              'repetitive-reward-pattern',
              'repetitive-emotional-pattern',
            ],
            chapterResults: [
              {
                chapter: 1,
                readerRetentionScore: 78,
                responseCount: 9,
                commentedResponseCount: 9,
                evidenceSufficient: true,
              },
              {
                chapter: 2,
                readerRetentionScore: 54,
                responseCount: 9,
                commentedResponseCount: 9,
                evidenceSufficient: true,
              },
              {
                chapter: 3,
                emotionalSignature: 'alarm-dread-deferral',
                readerRetentionScore: 41,
                funnelEvidence: 'usable',
                funnelPassed: false,
                startedReadCount: 30,
                completedReadCount: 20,
                continuedReadCount: 10,
                dropOffCount: 8,
                skimmedReadCount: 7,
                completionRate: 0.667,
                continuationRate: 0.333,
                dropOffRatio: 0.267,
                skimmedReadRatio: 0.233,
                hookProgressEvidence: 'usable',
                hookProgressPassed: false,
                hookOpenThreadCount: 2,
                hookAdvancedThreadCount: 0,
                hookResolvedThreadCount: 0,
                hookRecontextualizedThreadCount: 0,
                hookNewThreadCount: 1,
                hookStalledThreadCount: 2,
                hookProgressEventCount: 0,
                hookProgressRate: 0,
                hookStallRatio: 1,
                responseCount: 9,
                commentedResponseCount: 9,
                evidenceSufficient: true,
                weakDimensions: ['fatigue_resistance', 'reward_variety'],
              },
            ],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '3',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 52,
      failureType: 'series-retention:automated-false-positive,weak-reader-retention,reader-retention-drop,reader-funnel-drop,reader-hook-stall,repetitive-reward-pattern,repetitive-emotional-pattern',
      sampleId: 'chapter-001-003-retention-drop',
      respondentCount: 9,
      reliability: 'usable/series-retention',
    });
    expect(output.readerResponse.issues.join('\n')).toContain('series retention drop: 37');
    expect(output.readerResponse.issues.join('\n')).toContain('latest chapter continuation rate: 0.333');
    expect(output.readerResponse.issues.join('\n')).toContain('latest chapter hook progress/stall ratios: 0 / 1');
    expect(output.readerResponse.issues.join('\n')).toContain('repeated emotional signature run: 3');
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'series-retention-funnel',
          actual: expect.stringContaining('continuation=0.333'),
        }),
        expect.objectContaining({
          dimension: 'series-retention-hook-progress',
          actual: expect.stringContaining('stall=1'),
        }),
        expect.objectContaining({
          dimension: 'emotional-arc-variety',
          actual: '3',
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '독자 패널 반응 실패: 52점 (series-retention:automated-false-positive,weak-reader-retention,reader-retention-drop,reader-funnel-drop,reader-hook-stall,repetitive-reward-pattern,repetitive-emotional-pattern)',
      ])
    );
    expect(output.gate.retryPrompt).toContain('series-retention');
    expect(output.gate.retryPrompt).toContain('reward-variety');
    expect(output.gate.retryPrompt).toContain('emotional-arc-variety');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([1, 2]);
    expect(state.failed_chapters).toEqual([3]);
    expect(state.current_chapter).toBe(3);
  });

  it('ignores series retention failures that are not anchored to the current latest chapter', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-series-retention-future-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'series-retention-benchmark-report.json'), {
      projectId: 'sample-project',
      benchmark: {
        sampleResults: [
          {
            id: 'chapter-001-002-future-failure',
            sequenceLength: 2,
            readerRetentionScore: 44,
            firstChapterRetentionScore: 75,
            lastChapterRetentionScore: 44,
            retentionDrop: 31,
            readerPassed: false,
            repeatedRewardSignatureRun: 2,
            responseCount: 7,
            commentedResponseCount: 7,
            evidenceSufficient: true,
            failureTypes: ['automated-false-positive', 'reader-retention-drop'],
            chapterResults: [
              {
                chapter: 1,
                readerRetentionScore: 75,
                responseCount: 7,
                commentedResponseCount: 7,
                evidenceSufficient: true,
              },
              {
                chapter: 2,
                readerRetentionScore: 44,
                responseCount: 7,
                commentedResponseCount: 7,
                evidenceSufficient: true,
              },
            ],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toBeUndefined();
    expect(output.gate.status).toBe('PASS');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([1]);
    expect(state.failed_chapters).toEqual([]);
    expect(state.current_chapter).toBe(2);
  });

  it('blocks completion when the current consistency report has an unresolved contradiction', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-consistency-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'consistency-report.json'), {
      checked_at: '2026-06-21T00:00:00.000Z',
      chapter_range: {
        start: 1,
        end: 1,
      },
      chapters_analyzed: [1],
      domain_coverage: {
        character: true,
        timeline: true,
        setting: true,
        factual: true,
        plot_logic: true,
      },
      total_issues: 1,
      issues: [
        {
          id: 'timeline-001',
          type: 'timeline_conflict',
          severity: 'critical',
          description: 'The victim is reported dead before the alert that should trigger the rescue choice.',
          location: {
            chapter: 1,
            scene: 2,
            context: 'rescue deadline',
          },
          references: [
            {
              file: 'chapters/chapter_001.json',
              field: 'scenes[1].beat',
              expected: 'alert precedes death window',
              found: 'death is already confirmed before alert arrives',
            },
          ],
          suggestion: 'Move the death confirmation after the protagonist chooses to enter the scene.',
        },
      ],
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 40,
      failureType: 'consistency-report-critical',
      sampleId: 'consistency-report',
      reliability: 'verified/long-form-consistency',
    });
    expect(output.readerResponse.issues.join('\n')).toContain('timeline_conflict');
    expect(output.readerResponse.issues.join('\n')).toContain('rescue deadline');
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'long-form-consistency:timeline_conflict',
          action: expect.stringContaining('Move the death confirmation'),
          expected: 'alert precedes death window',
          actual: 'death is already confirmed before alert arrives',
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '장편 일관성 검증 실패: 40점 (consistency-report-critical)',
      ])
    );
    expect(output.gate.retryPrompt).toContain('Long-Form Consistency Revision Directives');
    expect(output.gate.retryPrompt).toContain('timeline_conflict');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('blocks completion when the consistency report is stale for the chapter being gated', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-consistency-stale-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await prepareThirdChapter(projectDir);
    await seedRalphStateAtChapterThree(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'consistency-report.json'), {
      checked_at: '2026-06-21T00:00:00.000Z',
      chapter_range: {
        start: 1,
        end: 2,
      },
      chapters_analyzed: [1, 2],
      domain_coverage: {
        character: true,
        timeline: true,
        setting: true,
        factual: true,
        plot_logic: true,
      },
      total_issues: 0,
      issues: [],
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '3',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 55,
      failureType: 'consistency-report-stale-range',
      sampleId: 'consistency-report',
      reliability: 'verified/long-form-consistency',
    });
    expect(output.readerResponse.issues.join('\n')).toContain('only covers chapters 1-2');
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'long-form-consistency',
          action: expect.stringContaining('chapter 3'),
          expected: 'consistency-report covers chapter 3',
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '장편 일관성 검증 실패: 55점 (consistency-report-stale-range)',
      ])
    );

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([1, 2]);
    expect(state.failed_chapters).toEqual([3]);
    expect(state.current_chapter).toBe(3);
  });

  it('blocks completion when consistency report source files changed after the report', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-consistency-source-stale-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'consistency-report.json'), {
      checked_at: '2026-06-21T00:00:00.000Z',
      chapter_range: {
        start: 1,
        end: 1,
      },
      chapters_analyzed: [1],
      domain_coverage: {
        character: true,
        timeline: true,
        setting: true,
        factual: true,
        plot_logic: true,
      },
      total_issues: 0,
      issues: [],
    });

    const changedSourcePath = join(projectDir, 'characters', 'current-canon.json');
    await writeJson(changedSourcePath, {
      character_id: 'lee-seojin',
      updated_after_consistency_report: true,
      note: 'This canonical character file changed after consistency verification.',
    });
    const future = new Date(Date.now() + 10_000);
    await utimes(changedSourcePath, future, future);

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 0,
      failureType: 'stale-report:consistency-report',
      sampleId: 'reviews/consistency-report.json',
      reliability: 'stale/source-evidence',
    });
    expect(output.readerResponse.issues.join('\n')).toContain('long-form consistency report is stale');
    expect(output.readerResponse.issues.join('\n')).toContain('characters/current-canon.json');
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'long-form-consistency-source-evidence',
          expected: 'report sourceEvidence matches current source files',
          actual: expect.stringContaining('sourceEvidence=newer-source'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '평가 리포트 freshness 실패: 0점 (stale-report:consistency-report)',
      ])
    );
    expect(output.gate.retryPrompt).toContain('Evaluation Report Freshness Directives');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('blocks completion when manuscript prose craft fails despite high score and engagement pass', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-craft-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await writeFile(
      join(projectDir, 'chapters', 'chapter_001.md'),
      [
        '# 첫 번째 알림',
        '',
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 이서진은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 한다는 사실을 보았다. 하지만 제한 시간 안에 피해자의 학생증 사진이 뜬 휴대폰을 단서로 피해자를 구해야 했고 화면의 사망 예고가 실제 죽음으로 바뀌기 직전이라는 사실이 보였다. 앱이 아직 일어나지 않은 살인을 예보하고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명이 보였다. 이서진이 공포보다 패턴을 먼저 읽고, 타인의 죽음을 막기 위해 위험한 현장으로 향한다는 사실이 보였다. 주인공 이서진이 경찰 신고보다 현장 도착 시간을 먼저 계산해 사무실 복도 끝에서 엘리베이터 버튼을 누르고 지하보도 입구까지 계단을 내려가며 뛰쳐나간다는 사실이 보였고, 그 대가로 공식 신고 기록과 사무실 알리바이 경로가 사라지고 안전한 제보자 선택지가 닫혔다는 사실이 보였다. 그래서 알리바이 빈칸과 사라진 신고 기록은 이후 경찰 의심을 부를 압박으로 남았다는 사실이 보였다. 제한 시간 안에 피해자를 찾으려 하지만 누군가 조명을 꺼뜨리고 통제선 문을 잠갔다는 사실이 보였다. 통제선 앞 문턱에서 이서진이 철문 손잡이를 당겼지만 안쪽 차단물이 길을 막았다는 사실이 보였다. 이서진이 정면 진입 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다는 사실이 보였다. 현장 도착이 늦은 대가로 피해자는 이미 쓰러졌고 실패가 상황을 되돌릴 수 없게 바꿨다는 사실이 보였다. 이서진이 피해자의 휴대폰 로그를 다시 확인하고 현장 기록의 빈칸과 대조하자, 두 기록이 같은 초 단위로 맞물렸고 손바닥의 땀과 목덜미를 조이는 감각이 보였다. 앱의 첫 규칙은 피해자의 사망 시각과 함께 굳어져 있었다. 그 규칙은 다음 행동을 피해자의 화면 아래 켜진 새 예고 배지를 눌러 확인하는 쪽으로 좁혔다는 사실이 보였다. 왜 예고 앱이 이서진을 첫 번째 수신자로 선택했는지, 앱이 실제 살인을 어떻게 알았는지는 앱 로고와 이서진 가족 실종 사건의 연결 뒤에 남아 있었다. 두 기록이 겹치자 이서진이 피해자의 화면 아래 켜진 새 예고 배지를 눌렀고, 그러자 피해자의 휴대폰에서 새 예고가 뜨며 이서진의 이름과 과거 미제 사건 번호가 현재 사건 기록에 함께 연결되자 이서진은 화면을 쥐고 숨을 삼켰다는 사실이 보였다.',
      ].join('\n'),
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining('원고 문장 품질 실패:'),
      ])
    );
    expect(output.gate.retryPrompt).toContain('Prose Craft Revision Directives');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
    expect(state.retry_count).toBe(1);
  });

  it('blocks completion when style-guide prose taste profile rejects the manuscript style', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-taste-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      disliked_phrases: ['감각이 왔다'],
      minimum_score: 88,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      '손끝에서 감각이 왔다.\n\n장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,'
    );
    await writeFile(
      manuscriptPath,
      modifiedManuscript,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('문체 취향 게이트 실패'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          issue: expect.stringContaining('문체 취향 게이트 실패'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('문체 취향 게이트 실패');
  });

  it('blocks completion when style-guide prose taste profile rejects relationship montage summaries', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-relationship-montage-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_relationship_montage_summary_density_per_1000: 1,
      max_relationship_montage_summary_run: 1,
      max_abstract_noun_density_per_1000: 100,
      max_cognitive_filter_density_per_1000: 100,
      max_hedged_perception_density_per_1000: 100,
      max_emotion_label_density_per_1000: 100,
      max_emotion_label_run: 20,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      `시간이 흘렀고 두 사람의 거리는 점점 가까워졌다.
며칠 사이 서연은 민준을 조금씩 믿게 되었다.
그동안 민준의 마음도 서서히 달라졌다.
두 사람 사이의 오해는 어느새 풀려 있었다.
그렇게 관계는 이전보다 깊어졌다.
결국 서로에게 특별한 존재가 되었다.

장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,`
    );
    await writeFile(
      manuscriptPath,
      modifiedManuscript,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('관계·감정 변화 요약'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          issue: expect.stringContaining('관계·감정 변화 요약'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when style-guide prose taste profile rejects time skip summary chains', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-time-skip-summary-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_time_skip_summary_density_per_1000: 1,
      max_time_skip_summary_run: 1,
      max_abstract_noun_density_per_1000: 100,
      max_cognitive_filter_density_per_1000: 100,
      max_hedged_perception_density_per_1000: 100,
      max_emotion_label_density_per_1000: 100,
      max_emotion_label_run: 20,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      `며칠이 지났다.
준비는 끝났다.
계획은 완성됐다.
사람들은 각자 움직였다.
상황은 빠르게 달라졌다.
필요한 것은 모두 갖춰졌다.
남은 것은 결전뿐이었다.

장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,`
    );
    await writeFile(
      manuscriptPath,
      modifiedManuscript,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('시간 경과 뒤 준비·조사·상황 변화를 요약'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          issue: expect.stringContaining('시간 경과 뒤 준비·조사·상황 변화를 요약'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when style-guide prose taste profile rejects contrastive reframe cadence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-contrastive-reframe-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_contrastive_reframe_density_per_1000: 1,
      max_contrastive_reframe_run: 1,
      max_abstract_noun_density_per_1000: 100,
      max_cognitive_filter_density_per_1000: 100,
      max_hedged_perception_density_per_1000: 100,
      max_emotion_label_density_per_1000: 100,
      max_emotion_label_run: 20,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_symbolic_abstraction_density_per_1000: 100,
      max_symbolic_abstraction_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      `그건 승리가 아니었다.
유예였다.
그건 선택이 아니었다.
대가였다.
문제는 두려움이 아니었다.
익숙함이었다.
남은 것은 희망이 아니었다.
경고였다.

장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,`
    );
    await writeFile(
      manuscriptPath,
      modifiedManuscript,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('대비 단정'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          issue: expect.stringContaining('대비 단정'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when style-guide prose taste profile rejects lore name overload', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-lore-name-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_lore_term_density_per_1000: 6,
      max_lore_term_run: 2,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      `아르카디온 왕국은 칠성 교단과 백은 마탑의 계약으로 세워졌다고 전해졌다.
흑요석 제국군은 에테르 코어와 루멘 룬을 관리하는 황실 프로토콜에 속해 있었다.
청염 길드는 제3게이트 던전과 성역 결계를 아카데미 랭크 시스템으로 분류했다.
노바 재단은 성물 의식과 성검 예언을 원로원 프로젝트의 법칙으로 기록했다.
서연은 그 모든 이름을 한 번에 듣고도 컵을 잡지 못했다.

장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,`
    );
    await writeFile(
      manuscriptPath,
      modifiedManuscript,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('세계관 고유명사/설정어'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('세계관');
  });

  it('blocks completion when style-guide prose taste profile rejects status window stat dumps', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-system-stat-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_system_stat_block_density_per_1000: 3,
      max_system_stat_block_run: 2,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      `상태창이 떠올랐다.
레벨 12.
힘 34.
민첩 28.
체력 40.
스킬 화염구 Lv. 3.
보상 경험치 500.
퀘스트가 갱신됐다.
스탯 포인트 3을 획득했다.
등급은 B로 상승했다.

장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,`
    );
    await writeFile(
      manuscriptPath,
      modifiedManuscript,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/상태창|스탯|시스템 수치|UI 로그/),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toMatch(/상태창|스탯|시스템 수치|UI 로그/);
  });

  it('blocks completion when style-guide prose taste profile rejects declared resolve loops', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-declared-resolve-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_declared_resolve_density_per_1000: 3,
      max_declared_resolve_run: 2,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      `서연은 더 이상 물러설 수 없다고 결심했다.
그녀는 반드시 진실을 밝혀야 한다고 다짐했다.
이제는 두려움을 피하지 않기로 했다.
민준도 끝까지 버티기로 마음먹었다.
두 사람은 포기할 수 없다는 각오를 다시 세웠다.
그러나 봉투도, 전화도, 문도 아직 움직이지 않았다.

장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,`
    );
    await writeFile(manuscriptPath, modifiedManuscript, 'utf8');

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('결심/각오/해야 함'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('결심');
  });

  it('blocks completion when style-guide prose taste profile rejects revelation summary leaps', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-revelation-summary-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_revelation_summary_density_per_1000: 3,
      max_revelation_summary_run: 2,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      `서연은 그제야 모든 것을 깨달았다.
흩어져 있던 단서들이 하나로 이어졌다.
진실은 처음부터 민준을 가리키고 있었다.
모든 의문이 풀렸고 답은 명확했다.
이제 남은 것은 진실을 밝히는 일뿐이었다.

장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,`
    );
    await writeFile(manuscriptPath, modifiedManuscript, 'utf8');

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('단서/진실/답'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('단서');
  });

  it('blocks completion when style-guide prose taste profile rejects procedural checklist cadence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-procedural-checklist-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_procedural_checklist_density_per_1000: 4,
      max_procedural_checklist_run: 3,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      `서연은 파일을 확인했다.
통화 기록을 검토했다.
사진 뒷면의 번호를 대조했다.
로그 파일을 다시 열었다.
CCTV 시간을 정리했다.
민준은 자료를 분류했다.
모든 기록은 조사 목록에 추가됐다.

장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,`
    );
    await writeFile(manuscriptPath, modifiedManuscript, 'utf8');

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('체크리스트'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toMatch(/체크리스트|조사/);
  });

  it('blocks completion when style-guide prose taste profile rejects action choreography logs', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-action-choreography-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_action_choreography_density_per_1000: 5,
      max_action_choreography_run: 3,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    const modifiedManuscript = originalManuscript.replace(
      '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,',
      `서연은 검을 휘둘렀다.
상대는 몸을 낮춰 피했다.
민준은 주먹을 날렸다.
괴물은 방패로 막았다.
서연은 다시 칼을 찔렀다.
상대는 뒤로 물러섰다.
민준은 발차기를 넣었다.

장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 할 시간,`
    );
    await writeFile(manuscriptPath, modifiedManuscript, 'utf8');

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/전투|동작 로그/),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toMatch(/전투|액션|동작 로그/);
  });

  it('blocks completion when style-guide prose taste profile rejects thin cliffhanger endings', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-thin-cliffhanger-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_thin_cliffhanger_ending_count: 0,
      max_generic_teaser_density_per_1000: 100,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연은 봉투를 접어 컵 아래에 밀어 넣었다. 민준은 대답하지 않고 복도 쪽 불빛을 봤다.

그러나 두 사람은 아직 몰랐다. 진짜 비밀은 이제 시작이었다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('얇은 클리프행어'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          instruction: expect.stringContaining('새 물증'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('얇은 클리프행어');
  });

  it('blocks completion when style-guide prose taste profile rejects monologue dialogue dumps', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-dialogue-turn-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      max_dialogue_turn_length: 120,
      max_average_dialogue_turn_length: 90,
      minimum_score: 95,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

민준은 녹음기를 껐다.

"내가 어젯밤 네 이름을 본 건 우연이 아니야. 현관 앞에 떨어진 봉투가 먼저 있었고, 봉투 안쪽에는 네가 지운 주소와 같은 붉은 선이 있었어. 그래서 나는 신고 대신 여기로 왔어. 네가 문을 열기 전에 그 사람이 다시 전화를 걸 거라는 걸 알았고, 네가 한 번이라도 망설이면 복도 끝 카메라가 꺼진 틈으로 우리 둘 다 사라질 거야. 지금은 믿어 달라는 말보다 네가 컵 아래 숨긴 사진을 먼저 봐야 해. 그리고 네가 아니라고 부정해도 어제 통화 끝에 들린 엘리베이터 안내음은 이 건물에서만 나는 소리였어."

서연은 봉투를 접었다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          issue: expect.stringContaining('대사 한 턴'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('대사 한 턴');
  });

  it('blocks completion when style-guide prose taste profile rejects talking-head dialogue runs', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-dialogue-grounding-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      max_dialogue_grounding_gap_run: 4,
      minimum_score: 95,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

민준은 방 불을 끄고 문 앞에 섰다.

"계단 쪽 불은 꺼져 있었어?"
"네가 말한 봉투는 없었어."
"그럼 누가 먼저 올라왔다는 건데?"
"엘리베이터 기록은 비어 있었어."
"기록을 지운 사람이 안에 있겠네."
"아직 확정하면 안 돼."
"서연이 먼저 도착했다면?"

전화 진동이 탁자 위에서 멎었다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          issue: expect.stringContaining('장면 접지'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('장면 접지');
  });

  it('blocks completion when the current prose taste benchmark shows a style false positive', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-prose-benchmark-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });

    await writeJson(join(projectDir, 'reviews', 'prose-taste-benchmark-report.json'), {
      benchmark: {
        readyForStyleTuning: false,
        falsePositiveCount: 1,
        falseNegativeCount: 0,
        missingIssueCount: 0,
        scoreOutOfRangeCount: 0,
        sampleResults: [
          {
            id: 'chapter-001-style-false-positive',
            label: '현재 회차 기능 보고체 false positive',
            chapter: 1,
            version: 1,
            expectedPassed: false,
            actualPassed: true,
            passed: false,
            styleTuningUsable: false,
            failureType: 'false-positive',
            score: 92,
            issueCodes: [],
            missingExpectedIssueCodes: ['functional-ai-report'],
            styleFrictionAnnotationCoverage: 'covered',
            styleFrictionAnnotations: [
              {
                location: '문단 1',
                targetText: '감각이 왔다. 반응이 잡혔다. 변화가 있었다.',
                reason: '독자가 장면보다 기능 보고 문장을 먼저 본다고 표시했다.',
                issueCode: 'functional-ai-report',
                severity: 'high',
                readerSegment: 'style-sensitive',
                rewriteSuggestion: '기능 보고 요약어를 지우고 인물이 실제로 본 사물, 선택, 반응으로 장면을 다시 쓴다.',
              },
            ],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.engagement.passed).toBe(true);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
      score: 55,
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('문체 취향 벤치마크'),
        expect.stringContaining('functional-ai-report'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-benchmark',
          issue: expect.stringContaining('functional-ai-report'),
          instruction: expect.stringContaining('실제로 본 사물'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '원고 문장 품질 실패: REVISE 55점',
      ])
    );
    expect(output.gate.retryPrompt).toContain('Prose Craft Revision Directives');
    expect(output.gate.retryPrompt).toContain('문체 취향 벤치마크');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('does not hard-block on chapter-scoped prose taste samples that are not grounded in the chapter manuscript', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-prose-benchmark-ungrounded-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });

    await writeJson(join(projectDir, 'reviews', 'prose-taste-benchmark-report.json'), {
      benchmark: {
        readyForStyleTuning: false,
        falsePositiveCount: 1,
        falseNegativeCount: 0,
        missingIssueCount: 0,
        scoreOutOfRangeCount: 0,
        sampleResults: [
          {
            id: 'chapter-001-fixture-style-false-positive',
            label: 'chapter 라벨만 붙은 별도 문체 fixture',
            chapter: 1,
            version: 1,
            contentSource: 'inline',
            chapterSourceGrounded: false,
            expectedPassed: false,
            actualPassed: true,
            passed: false,
            styleTuningUsable: false,
            failureType: 'false-positive',
            score: 92,
            issueCodes: [],
            missingExpectedIssueCodes: ['functional-ai-report'],
            styleFrictionAnnotationCoverage: 'covered',
            styleFrictionAnnotations: [
              {
                location: 'fixture 문단 1',
                targetText: '감각이 왔다. 반응이 잡혔다. 변화가 있었다.',
                reason: '독자가 fixture 문장을 기능 보고체로 표시했다.',
                issueCode: 'functional-ai-report',
                severity: 'high',
                readerSegment: 'style-sensitive',
                rewriteSuggestion: 'fixture를 고치되 현재 회차 원고 실패 근거로 쓰지는 않는다.',
              },
            ],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.engagement.passed).toBe(true);
    expect(output.proseCraft).toMatchObject({
      passed: true,
      verdict: 'PASS',
    });
    expect(output.proseCraft.score).toBeGreaterThanOrEqual(90);
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('hard block 대신 경고'),
        expect.stringContaining('chapterSourceGrounded=true'),
      ])
    );
    expect(output.gate.status).toBe('PASS');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([1]);
    expect(state.failed_chapters).toEqual([]);
  });

  it('blocks completion when prose taste benchmark source evidence is stale', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-prose-benchmark-stale-source-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews', 'prose-taste-benchmark'), { recursive: true });
    await writeJson(join(projectDir, 'reviews', 'prose-taste-benchmark', 'chapter-001-style.json'), {
      id: 'chapter-001-style-source',
      chapter: 1,
      expected_passed: true,
      content_path: 'chapters/chapter_001.md',
    });

    await writeJson(join(projectDir, 'reviews', 'prose-taste-benchmark-report.json'), {
      sourceEvidence: staleSourceEvidence('reviews/prose-taste-benchmark/chapter-001-style.json'),
      benchmark: {
        readyForStyleTuning: true,
        falsePositiveCount: 0,
        falseNegativeCount: 0,
        missingIssueCount: 0,
        scoreOutOfRangeCount: 0,
        sampleResults: [
          {
            id: 'chapter-001-style-pass',
            label: '현재 회차 문체 통과 샘플',
            chapter: 1,
            version: 1,
            expectedPassed: true,
            actualPassed: true,
            passed: true,
            styleTuningUsable: true,
            score: 94,
            issueCodes: [],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'MISSING',
      score: 0,
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('prose taste benchmark report is stale'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'stale-report',
          instruction: expect.stringContaining('reviews/prose-taste-benchmark-report.json'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        '원고 문장 품질 실패: MISSING 0점',
      ])
    );

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('ignores prose taste benchmark samples scoped only to future chapters', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-prose-benchmark-future-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });

    await writeJson(join(projectDir, 'reviews', 'prose-taste-benchmark-report.json'), {
      benchmark: {
        readyForStyleTuning: false,
        falsePositiveCount: 1,
        sampleResults: [
          {
            id: 'chapter-002-style-false-positive',
            chapter: 2,
            version: 1,
            expectedPassed: false,
            actualPassed: true,
            passed: false,
            styleTuningUsable: false,
            failureType: 'false-positive',
            score: 92,
            missingExpectedIssueCodes: ['functional-ai-report'],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '92',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft.passed).toBe(true);
    expect(output.gate.status).toBe('PASS');
  });

  it('blocks completion when the current engagement benchmark has a positive high-point conflict', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-engagement-benchmark-conflict-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });

    await writeJson(join(projectDir, 'reviews', 'engagement-benchmark-report.json'), {
      benchmark: {
        readyForGateTuning: false,
        falsePositiveCount: 0,
        falseNegativeCount: 1,
        missingIssueCount: 0,
        forbiddenIssueCount: 0,
        positiveQualityConflictCount: 1,
        scoreOutOfRangeCount: 0,
        sampleResults: [
          {
            id: 'chapter-001-high-point-conflict',
            label: '현재 회차 보상 쾌감 오표기',
            chapter: 1,
            version: 1,
            manuscriptSource: 'chapter',
            manuscriptPath: 'chapters/chapter_001.md',
            chapterSourceGrounded: true,
            positiveQualityCodes: ['payoff-delight'],
            expectedPassed: true,
            actualPassed: false,
            passed: false,
            failureTypes: ['false-negative', 'positive-quality-conflict'],
            failureType: 'false-negative',
            score: 78,
            issueCodes: ['manuscript-payoff-delight-not-evidenced'],
            positiveQualityConflictIssueCodes: ['manuscript-payoff-delight-not-evidenced'],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.engagement.passed).toBe(true);
    expect(output.readerResponse).toMatchObject({
      passed: false,
      score: 58,
      failureType: expect.stringContaining('engagement-benchmark'),
      reliability: 'not-ready/chapter-grounded/engagement-benchmark',
    });
    expect(output.readerResponse.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('positive high-point conflicts'),
        expect.stringContaining('manuscript-payoff-delight-not-evidenced'),
      ])
    );
    expect(output.readerResponse.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'engagement-benchmark',
          action: expect.stringContaining('manuscript-payoff-delight-not-evidenced'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining('회차 재미 벤치마크 실패: 58점'),
      ])
    );
    expect(output.gate.retryPrompt).toContain('Reader Response Revision Directives');
    expect(output.gate.retryPrompt).toContain('engagement-benchmark');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
  });

  it('does not hard-block on engagement benchmark fixtures that are not grounded in the chapter manuscript', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-engagement-benchmark-ungrounded-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await mkdir(join(projectDir, 'reviews'), { recursive: true });

    await writeJson(join(projectDir, 'reviews', 'engagement-benchmark-report.json'), {
      benchmark: {
        readyForGateTuning: false,
        falsePositiveCount: 1,
        sampleResults: [
          {
            id: 'chapter-001-inline-fixture-false-positive',
            chapter: 1,
            manuscriptSource: 'inline',
            chapterSourceGrounded: false,
            expectedPassed: false,
            actualPassed: true,
            passed: false,
            failureTypes: ['false-positive'],
            failureType: 'false-positive',
            score: 94,
            missingExpectedIssueCodes: ['manuscript-payoff-delight-not-evidenced'],
          },
        ],
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '92',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.readerResponse).toMatchObject({
      passed: true,
      reliability: 'not-ready/has-ungrounded-fixtures/engagement-benchmark',
    });
    expect(output.readerResponse.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('hard block 대신 경고'),
      ])
    );
    expect(output.gate.status).toBe('PASS');
  });

  it('blocks completion when style-guide prose fluency profile rejects repeated subject rhythm', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-fluency-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_repeated_subject_run: 2,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

도현은 젖은 봉투를 탁자 위에 조심스럽게 내려놓고 상대의 숨소리를 기다렸다. 도현은 손등에 묻은 물기를 닦지 않은 채 닫힌 창문 쪽을 보았다. 도현은 대답 대신 봉투 모서리를 밀어 올리며 물러설 수 없는 선택을 확인했다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('문체 취향 게이트 실패'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('Prose Craft Revision Directives');
  });

  it('blocks completion when style-guide prose taste profile rejects same ending cadence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-same-ending-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_same_ending_run: 3,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연이 접은 봉투를 컵 아래에 밀어놓았다.
오래된 녹음기 옆으로 젖은 사진을 하나 더 내려놓았다.
민준이 지운 주소 위에 붉은 선을 천천히 그어놓았다.
창가의 가방 안에는 번호가 다른 열쇠를 숨겨놓았다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('같은 어미 리듬'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('같은 어미 리듬');
  });

  it('blocks completion when style-guide prose taste profile rejects dominant ending cadence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-dominant-ending-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_dominant_sentence_ending_share: 0.72,
      max_same_ending_run: 4,
      min_sentence_length_variation_coefficient: 0,
      max_uniform_sentence_length_run: 20,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    await writeFile(
      manuscriptPath,
      `# 종결 리듬 샘플

서연은 봉투의 접힌 선을 다시 눌러 접었다.
민준은 녹음기 옆에 흘린 잉크를 손끝에 묻었다.
도현은 녹음기 안쪽의 번호를 확인했다.
혜린은 젖은 사진을 봉투 아래에 넣었다.
서연은 지도 가장자리의 얼룩을 손바닥으로 덮었다.
민준의 손목시계 초침은 문 앞에서 멈춘다.
도현은 컵 받침 밑의 열쇠를 조용히 들었다.
혜린은 복도 쪽으로 새어 나오는 빛을 가방으로 막았다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('종결 계열'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('종결 계열');
  });

  it('blocks completion when style-guide prose taste profile rejects dialogue ending cadence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-dialogue-ending-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_dominant_dialogue_ending_share: 0.82,
      max_dialogue_grounding_gap_run: 8,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    await writeFile(
      manuscriptPath,
      `# 대화 말끝 리듬 샘플

민준은 녹음기를 끄고 봉투를 탁자 중앙에 밀었다.
"그 번호는 오늘 밤 또 바뀔 거야."
서연은 봉투 가장자리에 묻은 잉크를 엄지로 문질렀다.
"경비 기록도 곧 사라질 거야."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"네가 문을 열면 그쪽이 먼저 알 거야."
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"그래도 나는 서버실로 갈 거야."
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"그 사람은 여기로 다시 올 거야."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('대화문 말끝'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('대화문 말끝');
  });

  it('blocks completion when style-guide prose taste profile rejects dialogue starter cadence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-dialogue-starter-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_dominant_dialogue_starter_share: 0.62,
      max_dialogue_grounding_gap_run: 8,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    await writeFile(
      manuscriptPath,
      `# 대화 말머리 리듬 샘플

민준은 녹음기를 끄고 봉투를 탁자 중앙에 밀었다.
"아니, 그 번호는 오늘 밤 다시 바뀌어."
서연은 봉투 가장자리에 묻은 잉크를 엄지로 문질렀다.
"아니, 경비 기록부터 확인해야 해."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"아니, 문을 열면 그쪽이 먼저 알아."
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"그래도 서버실 열쇠는 여기 있어."
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"아니, 그 사람은 엘리베이터로 올라오지 않았어."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('대화문 말머리'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('대화문 말머리');
  });

  it('blocks completion when style-guide prose taste profile rejects dialogue question cascade', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-dialogue-question-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_dialogue_question_ratio: 0.66,
      max_dialogue_question_run: 4,
      max_dialogue_grounding_gap_run: 8,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      max_rhetorical_question_density_per_1000: 100,
      max_rhetorical_question_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    await writeFile(
      manuscriptPath,
      `# 대화 의문 연쇄 샘플

민준은 녹음기를 끄고 봉투를 탁자 중앙에 밀었다.
"네가 먼저 문자를 받았어?"
서연은 봉투 가장자리에 묻은 잉크를 엄지로 문질렀다.
"그걸 왜 지금 말해?"
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"그럼 봉투는 누가 놓고 갔어?"
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"엘리베이터 기록은 확인했어?"
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"그 사람이 아직 위층에 있어?"
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('의문형 대사'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('의문형 대사');
  });

  it('blocks completion when style-guide prose taste profile rejects dialogue vocative cadence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-dialogue-vocative-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_dialogue_vocative_ratio: 0.5,
      max_dialogue_vocative_run: 3,
      max_dialogue_grounding_gap_run: 8,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      max_rhetorical_question_density_per_1000: 100,
      max_rhetorical_question_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    await writeFile(
      manuscriptPath,
      `# 대화 호명 박자 샘플

민준은 녹음기를 끄고 봉투를 탁자 중앙에 밀었다.
"서연아, 그 봉투는 네가 먼저 봤지."
서연은 봉투 가장자리에 묻은 잉크를 엄지로 문질렀다.
"민준 씨, 지금 이름 부를 때가 아니에요."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"서연아, 경비 기록부터 확인해."
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"민준 씨, 문밖에 누가 있어요."
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"서연아, 그 사진을 컵 아래에 숨겨."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('호명/호칭'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('호명/호칭');
  });

  it('blocks completion when style-guide prose taste profile rejects dialogue lexical echo chains', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-dialogue-echo-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_dialogue_lexical_echo_ratio: 0.56,
      max_dialogue_lexical_echo_run: 4,
      max_dialogue_grounding_gap_run: 8,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      max_rhetorical_question_density_per_1000: 100,
      max_rhetorical_question_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    await writeFile(
      manuscriptPath,
      `# 대화 핵심어 echo 샘플

민준은 녹음기를 끄고 탁자 중앙에 종이를 밀었다.
"봉투 안쪽의 얼룩부터 봐."
서연은 종이 가장자리에 묻은 잉크를 엄지로 문질렀다.
"그 봉투 때문에 문이 잠겼어."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"봉투를 들고 나가면 경비가 움직여."
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"봉투는 네 손에 있던 게 아니었어."
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"봉투를 찢으면 번호가 사라져."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('핵심어'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('핵심어');
  });

  it('blocks completion when style-guide prose taste profile rejects dialogue paraphrase confirmation chains', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-dialogue-paraphrase-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_dialogue_paraphrase_confirmation_ratio: 0.46,
      max_dialogue_paraphrase_confirmation_run: 3,
      max_dialogue_grounding_gap_run: 8,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      max_rhetorical_question_density_per_1000: 100,
      max_rhetorical_question_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    await writeFile(
      manuscriptPath,
      `# 대화 재진술 확인 샘플

민준은 녹음기를 끄고 탁자 중앙에 종이를 밀었다.
"그러니까 네 말은 알림이 피해자보다 먼저 왔다는 거야."
서연은 화면 밝기를 낮추고 시간 표시를 가렸다.
"즉, 경비 로그가 조작됐다는 뜻이네."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"다시 말해서 신고 시간은 가짜라는 거지."
민준은 컵 받침 아래의 출입 카드를 반쯤 빼냈다.
"결국 서버실 안에 내부자가 있었다는 말이야."
서연은 카드 뒷면의 흠집을 보고 잠금장치를 걸었다.
"그 말은 네가 처음부터 알고 있었다는 거네."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 지금은 카드를 먼저 빼."
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('상대 말이나 사건 정보를 다시 풀어 확인'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('정보를 다시 정리');
  });

  it('blocks completion when style-guide prose taste profile rejects filler adverb cadence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-filler-adverb-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_filler_adverb_density_per_1000: 1,
      max_filler_adverb_run: 2,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연은 천천히 문 앞에 섰다.
민준은 조용히 컵을 내려놓았다.
서연은 가만히 봉투를 바라보았다.
민준은 살짝 고개를 돌렸다.
서연은 잠시 대답을 미뤘다.
민준은 그대로 손잡이를 잡고 있었다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('완충 부사'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          instruction: expect.stringContaining('부사'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when style-guide prose taste profile rejects simultaneous action cadence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-simultaneous-action-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_simultaneous_action_density_per_1000: 1,
      max_simultaneous_action_run: 2,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연은 문손잡이를 움켜쥐며 복도 안쪽을 살폈다.
민준은 컵 받침을 밀면서 봉투의 붉은 선을 가렸다.
도현은 휴대폰 화면을 켜 놓은 채 계단 아래를 내려다보았다.
서연은 숨을 고르며 손등에 묻은 잉크를 닦았다.
민준은 녹음기를 끄면서 파일 이름을 확인했다.
도현은 난간에 몸을 붙인 채 닫힌 문틈을 세었다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('~며/~면서/~한 채'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          instruction: expect.stringContaining('중요한 행동은 주절'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when style-guide prose taste profile rejects status quo action loops', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-status-quo-action-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_status_quo_action_density_per_1000: 1,
      max_status_quo_action_run: 2,
      min_causal_turn_density_per_1000: 1,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연은 문 앞에 멈춰 섰다.
민준은 컵을 내려놓았다.
서연은 봉투를 만졌다.
민준은 고개를 돌렸다.
서연은 복도 끝을 바라보았다.
민준은 손잡이를 잡았다.
서연은 대답을 기다렸다.
빗소리만 창문을 두드렸다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('장면 상태가 그대로'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          instruction: expect.stringContaining('장면 전후 상태'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when style-guide prose taste profile rejects POV mind-hop paragraphs', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-pov-mind-hop-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_pov_mind_jump_density_per_1000: 1,
      max_pov_mind_jump_run: 1,
      max_topic_marker_starter_density_per_1000: 100,
      max_topic_marker_starter_run: 20,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 20,
      min_causal_turn_density_per_1000: 0,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연은 봉투의 붉은 선이 자기 이름으로 이어진다고 생각했다. 민준은 그녀가 아직 거짓말을 믿고 있다고 확신했다. 서연은 컵 받침 아래 숫자가 함정이라는 걸 느꼈다.

민준은 문밖 발소리가 동료의 신호라고 믿었다. 도현은 두 사람이 아직 자기 계획을 모른다고 생각했다. 민준은 신고 기록을 숨겨야 한다고 결심했다.

서연은 계단 쪽 불빛을 보고 도망칠 수 없다고 깨달았다. 도현은 그 표정이 이미 무너졌다고 느꼈다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('서로 다른 인물의 생각/감정/판단'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          instruction: expect.stringContaining('POV 중심 인물'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when prose taste profile rejects detached camera description', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-pov-distance-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_static_description_density_per_1000: 1,
      min_viewpoint_anchor_density_per_1000: 30,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

복도에는 낡은 액자가 걸려 있었다. 천장에는 꺼진 조명이 남아 있었다. 바닥에는 젖은 발자국이 이어져 있었다. 문 옆에는 우산 두 개가 세워져 있었다.

방 안에는 낮은 책상이 놓여 있었다. 창문은 닫혀 있었다. 벽에는 오래된 달력이 걸려 있었다. 서랍 위에는 빈 컵이 있었다. 구석에는 접힌 담요가 쌓여 있었다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('외부 카메라'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
    expect(output.gate.retryPrompt).toContain('Prose Craft Revision Directives');
  });

  it('blocks completion when prose taste profile rejects nominalized translationese connective drift', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-translationese-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_nominalized_explanation_density_per_1000: 4,
      max_translationese_formula_density_per_1000: 3,
      max_connective_starter_density_per_1000: 5,
      max_repeated_connective_starter_run: 2,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

그것은 우연이 아니었다. 그가 발견한 것은 오래된 기록의 반복이었다. 남은 것은 닫힌 문뿐이었다. 문제인 것은 아무도 그 문을 열 수 없다는 것이었다. 이 문제는 경찰에 의해 확인되었고 그 기록에 대하여 아무도 답하지 않았다. 그녀는 이 상황에 있어서 가장 위험한 선택지를 가지고 있었다.

그리고 서연은 문 앞에 섰다. 그리고 봉투를 접었다. 그리고 복도 불빛이 꺼졌다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('명사화 설명'),
        expect.stringContaining('번역투 공식 표현'),
        expect.stringContaining('접속 부사'),
      ])
    );
    expect(output.proseCraft.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'style-alignment',
          issue: expect.stringContaining('문체 취향 게이트 실패'),
        }),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when prose taste profile rejects therapy-speak self-analysis', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-therapy-speak-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_abstract_noun_density_per_1000: 100,
      max_cognitive_filter_density_per_1000: 100,
      max_therapy_speak_density_per_1000: 2,
      max_therapy_speak_run: 2,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연은 민준에게 화가 난 것이 아니라 자신의 불안정 애착과 인정욕구가 반응한 것이라고 깨달았다. 그 집착은 어린 시절의 결핍감 때문에 생긴 방어기제였다는 사실을 알 수 있었다. 그녀는 자존감이 낮아서 상대에게 의존하려 했고, 그래서 관계 불안이 모든 선택의 원인이었다고 이해했다.

결국 그 트라우마는 자기혐오와 회피 성향을 증명했고, 서연은 그 심리적 상처가 지금의 침묵을 만든 문제였다고 정리했다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('상담 기록'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when prose taste profile rejects facial expression crutch chains', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-facial-crutch-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_facial_expression_beat_density_per_1000: 2,
      max_facial_expression_beat_run: 2,
      max_stock_reaction_beat_density_per_1000: 100,
      max_vague_atmosphere_modifier_density_per_1000: 100,
      max_evaluative_modifier_density_per_1000: 100,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연의 얼굴이 굳었다.
민준의 표정이 일그러졌다.
서연은 미간을 찌푸렸다.
민준의 입꼬리가 내려갔다.
서연의 낯빛이 창백해졌다.
민준은 표정을 감추었다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('표정 beat'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when prose taste profile rejects prop fidget loops', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-prop-fidget-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_prop_fidget_beat_density_per_1000: 2,
      max_prop_fidget_beat_run: 2,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 10,
      min_causal_turn_density_per_1000: 0,
      max_stock_reaction_beat_density_per_1000: 100,
      max_facial_expression_beat_density_per_1000: 100,
      max_vague_atmosphere_modifier_density_per_1000: 100,
      max_evaluative_modifier_density_per_1000: 100,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연은 컵을 만졌다.
민준은 봉투를 접었다.
서연은 휴대폰을 만졌다.
민준은 펜을 굴렸다.
서연은 열쇠를 쥐었다.
민준은 카드를 문질렀다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('소품 조작 beat'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('blocks completion when prose taste profile rejects backstory info dumps', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-backstory-dump-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const styleGuidePath = join(projectDir, 'meta', 'style-guide.json');
    const styleGuide = await readJson(styleGuidePath);
    styleGuide.prose_taste_profile = {
      preferred_mode: 'balanced',
      minimum_score: 95,
      max_backstory_exposition_density_per_1000: 2,
      max_backstory_exposition_run: 2,
      max_abstract_noun_density_per_1000: 100,
      max_cognitive_filter_density_per_1000: 100,
      max_therapy_speak_density_per_1000: 100,
      max_therapy_speak_run: 10,
      max_status_quo_action_density_per_1000: 100,
      max_status_quo_action_run: 10,
      min_causal_turn_density_per_1000: 0,
      max_vague_atmosphere_modifier_density_per_1000: 100,
      max_evaluative_modifier_density_per_1000: 100,
    };
    await writeJson(styleGuidePath, styleGuide);

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const originalManuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      `${originalManuscript}

서연은 어린 시절부터 늘 문 앞에서 기다리는 아이였다.
그때부터 그녀는 누구도 쉽게 믿지 못하는 사람이 되었다.
몇 년 전의 사고는 가족의 모든 관계를 바꾸어 놓았다.
그날 이후 서연은 작은 소리에도 과거의 복도를 떠올렸다.
예전의 약속은 아직도 그녀의 선택을 설명하는 이유였다.
오래전 남은 비밀은 두 사람 사이의 침묵을 만들었다.
`,
      'utf8'
    );

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.proseCraft).toMatchObject({
      passed: false,
      verdict: 'REVISE',
    });
    expect(output.proseCraft.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining('배경설명 덩어리'),
      ])
    );
    expect(output.gate.status).toBe('RETRY');
  });

  it('keeps Ralph on the chapter when engagement fails despite a high quality score', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const chapterPath = join(projectDir, 'chapters', 'chapter_001.json');
    const chapter = await readJson(chapterPath);
    chapter.reader_experience.must_click_ending = '긴장 없이 사건이 정리되어 다음 화를 누를 이유가 약하다';
    chapter.reader_experience.cliffhanger_strength = 3;
    await writeJson(chapterPath, chapter);

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.gate.status).toBe('RETRY');
    expect(output.engagement.passed).toBe(false);
    expect(output.engagement.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          priority: 'critical',
          target: expect.any(String),
          action: expect.any(String),
        }),
      ])
    );
    expect(output.gate.retryPrompt).toContain('Engagement Revision Directives');
    expect(output.gate.retryPrompt).toContain('[critical]');
    expect(output.gate.blockingReasons.some((reason: string) => (
      reason.startsWith('독자 몰입 계약 실패:')
    ))).toBe(true);

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
    expect(state.retry_count).toBe(1);
    expect(state.last_gate).toMatchObject({
      chapter: 1,
      status: 'RETRY',
      should_retry: true,
      score: 95,
    });
  });

  it('requires structural intervention when the same engagement directive repeats 3 times', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-recurring-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
      $schema: '../../../schemas/ralph-state.schema.json',
      schema_version: '2.0',
      novel_id: testNovelId,
      ralph_active: true,
      mode: 'write-all',
      project_id: 'sample-project',
      current_act: 1,
      current_chapter: 3,
      last_safe_chapter: 2,
      total_chapters: 12,
      total_acts: 3,
      quality_retries: 0,
      completed_chapters: [1, 2],
      failed_chapters: [],
      retry_count: 0,
      iteration: 1,
      max_iterations: 100,
      can_resume: true,
      last_gate: {
        chapter: 2,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 92,
        blocking_reasons: [],
        retry_prompt: '',
        decided_at: '2026-06-19T00:00:00.000Z',
      },
    });

    const plotPath = join(projectDir, 'plot', 'plot-strategy.json');
    const plot = await readJson(plotPath);
    plot.chapter_allocation.total_chapters = 3;
    plot.chapter_allocation.act_breakdown[0].chapters = '1-3';
    plot.per_chapter_guide.push({
      ...plot.per_chapter_guide[1],
      chapter: 3,
    });
    plot.tension_curve.key_peaks.push({
      ...plot.tension_curve.key_peaks[1],
      chapter: 3,
    });
    await writeJson(plotPath, plot);

    const chapterTwoPath = join(projectDir, 'chapters', 'chapter_002.json');
    const chapterThree = await readJson(chapterTwoPath);
    chapterThree.chapter_number = 3;
    chapterThree.chapter_title = '세 번째 예고';
    await writeJson(join(projectDir, 'chapters', 'chapter_003.json'), chapterThree);

    for (const chapterNumber of [1, 2, 3]) {
      const chapterPath = join(
        projectDir,
        'chapters',
        `chapter_${String(chapterNumber).padStart(3, '0')}.json`
      );
      const chapter = await readJson(chapterPath);
      chapter.scenes[chapter.scenes.length - 1].beat =
        '제한 시간 직후 붉은 증거 봉투가 젖은 복도 바닥에서 발견되자, 새 단서가 용의자 가설을 좁히고 주인공은 다음 검증 행동으로 경찰 서버 접속을 선택한다.';
      await writeJson(chapterPath, chapter);
    }

    const recordCliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: recordCliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    for (const chapterNumber of [1, 2]) {
      const seedResult = spawnSync(
        process.execPath,
        [
          recordCliPath,
          '--project',
          projectDir,
          '--chapter',
          String(chapterNumber),
          '--version',
          '1',
          '--json',
        ],
        { encoding: 'utf8' }
      );
      expect(seedResult.status, seedResult.stderr).toBe(0);
    }

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '3',
        '--version',
        '1',
        '--quality-score',
        '95',
        '--threshold',
        '85',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    const recurringDirective = output.engagement.recurringEngagementDirectives[0];

    expect(output.gate.status).toBe('USER_INTERVENTION');
    expect(output.gate.shouldRetry).toBe(false);
    expect(output.gate.blockingReasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining(`반복 독자 몰입 실패: ${recurringDirective.code} 3회`),
      ])
    );
    expect(output.gate.retryPrompt).toContain('구조적 재검토');
    expect(output.engagement.recurringEngagementDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: recurringDirective.code,
          count: 3,
          firstChapter: 1,
          latestChapter: 3,
        }),
      ])
    );

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.ralph_active).toBe(false);
    expect(state.requires_user_intervention).toBe(true);
    expect(state.current_chapter).toBe(3);
    expect(state.failed_chapters).toEqual([3]);
    expect(state.retry_count).toBe(0);
    expect(state.last_gate).toMatchObject({
      chapter: 3,
      status: 'USER_INTERVENTION',
      should_retry: false,
      strategy: 'user_intervention',
    });
  });

  it('uses the third retry before requiring user intervention', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-third-retry-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
      $schema: '../../../schemas/ralph-state.schema.json',
      schema_version: '2.0',
      novel_id: testNovelId,
      ralph_active: true,
      mode: 'write-all',
      project_id: 'sample-project',
      current_act: 1,
      current_chapter: 1,
      last_safe_chapter: 0,
      total_chapters: 12,
      total_acts: 3,
      quality_retries: 0,
      completed_chapters: [],
      failed_chapters: [1],
      retry_count: 2,
      iteration: 1,
      max_iterations: 100,
      can_resume: true,
    });

    const chapterPath = join(projectDir, 'chapters', 'chapter_001.json');
    const chapter = await readJson(chapterPath);
    chapter.reader_experience.must_click_ending = '다음 화를 누를 만한 미해결 질문이 없다';
    chapter.reader_experience.cliffhanger_strength = 2;
    await writeJson(chapterPath, chapter);

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '3',
        '--quality-score',
        '95',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.gate).toMatchObject({
      status: 'RETRY',
      shouldRetry: true,
      strategy: 'partial_rewrite',
    });

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.failed_chapters).toEqual([1]);
    expect(state.current_chapter).toBe(1);
    expect(state.retry_count).toBe(3);
    expect(state.ralph_active).toBe(true);
    expect(state).not.toHaveProperty('requires_user_intervention');
  });

  it('refuses to gate a future chapter while earlier chapters are incomplete', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-sequence-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    const cliPath = await bundleCli(workDir);

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '2',
        '--version',
        '1',
        '--quality-score',
        '92',
        '--threshold',
        '85',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Cannot gate chapter 2 while current_chapter is 1');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([]);
    expect(state.current_chapter).toBe(1);
    expect(state).not.toHaveProperty('last_gate');
    expect(existsSync(join(projectDir, 'meta', 'quality-trend.json'))).toBe(false);
  });

  it('refuses to record engagement when Ralph state is missing', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-no-state-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await rm(join(projectDir, 'meta', 'ralph-state.json'), { force: true });
    const cliPath = await bundleCli(workDir);

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '92',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Ralph state file not found');
    expect(existsSync(join(projectDir, 'meta', 'quality-trend.json'))).toBe(false);
  });

  it('validates Ralph state before reading chapter engagement inputs', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-invalid-state-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);

    const statePath = join(projectDir, 'meta', 'ralph-state.json');
    const state = await readJson(statePath);
    delete state.novel_id;
    await writeJson(statePath, state);
    await rm(join(projectDir, 'chapters', 'chapter_001.json'), { force: true });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '92',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Invalid Ralph state schema');
    expect(result.stderr).not.toContain('chapter_001.json');
    expect(existsSync(join(projectDir, 'meta', 'quality-trend.json'))).toBe(false);
  });

  it('rejects unsafe quality thresholds before reading chapter engagement inputs', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-low-threshold-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await rm(join(projectDir, 'chapters', 'chapter_001.json'), { force: true });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '92',
        '--threshold',
        '40',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--threshold must be an integer from 70 to 100');
    expect(result.stderr).not.toContain('chapter_001.json');
    expect(existsSync(join(projectDir, 'meta', 'quality-trend.json'))).toBe(false);
  });

  it('rejects retry limits above the Ralph Loop cap before reading chapter engagement inputs', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-max-retries-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await rm(join(projectDir, 'chapters', 'chapter_001.json'), { force: true });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '72',
        '--threshold',
        '90',
        '--max-retries',
        '100',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--max-retries must be an integer from 1 to 3');
    expect(result.stderr).not.toContain('chapter_001.json');
    expect(existsSync(join(projectDir, 'meta', 'quality-trend.json'))).toBe(false);
  });

  it('rejects explicit attempts that do not match Ralph retry state before reading inputs', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-stale-attempt-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
      $schema: '../../../schemas/ralph-state.schema.json',
      schema_version: '2.0',
      novel_id: testNovelId,
      ralph_active: true,
      mode: 'write-all',
      project_id: 'sample-project',
      current_act: 1,
      current_chapter: 1,
      last_safe_chapter: 0,
      total_chapters: 12,
      total_acts: 3,
      quality_retries: 0,
      completed_chapters: [],
      failed_chapters: [1],
      retry_count: 3,
      iteration: 1,
      max_iterations: 100,
      can_resume: true,
    });
    await rm(join(projectDir, 'chapters', 'chapter_001.json'), { force: true });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '4',
        '--quality-score',
        '72',
        '--threshold',
        '90',
        '--attempt',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      '--attempt must match Ralph retry_count + 1 (expected 4, got 1)'
    );
    expect(result.stderr).not.toContain('chapter_001.json');
    expect(existsSync(join(projectDir, 'meta', 'quality-trend.json'))).toBe(false);
  });

  it('rolls back engagement trend when Ralph state write fails', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-state-write-fail-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    const statePath = join(projectDir, 'meta', 'ralph-state.json');
    await chmod(statePath, 0o444);
    const cliPath = await bundleCli(workDir);

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--quality-score',
        '92',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );
    await chmod(statePath, 0o666);

    expect(result.status).toBe(1);
    expect(existsSync(join(projectDir, 'meta', 'quality-trend.json'))).toBe(false);

    const state = await readJson(statePath);
    expect(state.completed_chapters).toEqual([]);
    expect(state.failed_chapters).toEqual([]);
    expect(state.current_chapter).toBe(1);
    expect(state).not.toHaveProperty('last_gate');
  });

  it('refuses stale gate results for already completed earlier chapters', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-stale-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
      $schema: '../../../schemas/ralph-state.schema.json',
      schema_version: '2.0',
      novel_id: testNovelId,
      ralph_active: true,
      mode: 'write-all',
      project_id: 'sample-project',
      current_act: 1,
      current_chapter: 2,
      last_safe_chapter: 1,
      total_chapters: 12,
      total_acts: 3,
      quality_retries: 0,
      completed_chapters: [1],
      failed_chapters: [],
      retry_count: 0,
      iteration: 1,
      max_iterations: 100,
      can_resume: true,
      last_gate: {
        chapter: 1,
        status: 'PASS',
        passed: true,
        should_retry: false,
        strategy: 'none',
        score: 92,
        blocking_reasons: [],
        retry_prompt: '',
        decided_at: '2026-06-19T00:00:00.000Z',
      },
    });
    const cliPath = await bundleCli(workDir);

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '2',
        '--quality-score',
        '72',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'Cannot gate chapter 1 because Ralph has already advanced to chapter 2'
    );

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.completed_chapters).toEqual([1]);
    expect(state.failed_chapters).toEqual([]);
    expect(state.current_chapter).toBe(2);
    expect(state.last_gate).toMatchObject({
      chapter: 1,
      status: 'PASS',
      passed: true,
    });
    expect(existsSync(join(projectDir, 'meta', 'quality-trend.json'))).toBe(false);
  });

  it('reactivates Ralph after a user-intervention chapter passes on resume', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'chapter-gate-cli-resume-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await seedRalphState(projectDir);
    await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
      $schema: '../../../schemas/ralph-state.schema.json',
      schema_version: '2.0',
      novel_id: testNovelId,
      ralph_active: false,
      mode: 'write-all',
      project_id: 'sample-project',
      current_act: 1,
      current_chapter: 1,
      last_safe_chapter: 0,
      total_chapters: 12,
      total_acts: 3,
      quality_retries: 0,
      completed_chapters: [],
      failed_chapters: [1],
      retry_count: 3,
      iteration: 1,
      max_iterations: 100,
      can_resume: true,
      requires_user_intervention: true,
      pause_reason: '독자 몰입 계약 실패: 수동 수정 필요',
      last_gate: {
        chapter: 1,
        status: 'USER_INTERVENTION',
        passed: false,
        should_retry: false,
        strategy: 'user_intervention',
        score: 95,
        blocking_reasons: ['독자 몰입 계약 실패: 수동 수정 필요'],
        retry_prompt: '수동 수정 후 재검증',
        decided_at: '2026-06-19T00:00:00.000Z',
      },
    });

    const cliPath = await bundleCli(workDir);
    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '2',
        '--quality-score',
        '96',
        '--threshold',
        '90',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.gate.status).toBe('PASS');
    expect(output.state.ralphActive).toBe(true);
    expect(output.state.requiresUserIntervention).toBe(false);

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state.ralph_active).toBe(true);
    expect(state.completed_chapters).toEqual([1]);
    expect(state.failed_chapters).toEqual([]);
    expect(state.current_chapter).toBe(2);
    expect(state.retry_count).toBe(0);
    expect(state).not.toHaveProperty('requires_user_intervention');
    expect(state).not.toHaveProperty('pause_reason');
  });
});
