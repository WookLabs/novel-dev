import { afterEach, describe, expect, it } from 'vitest';
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const sampleProject = join(root, 'tests', 'fixtures', 'sample-project');

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

describe('character relationship benchmark CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('runs project character relationship samples and stores a report', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'character-relationship-cli-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const benchmarkDir = join(projectDir, 'reviews', 'character-relationship-benchmark');
    await mkdir(benchmarkDir, { recursive: true });
    await writeFile(
      join(benchmarkDir, 'character-relationship-benchmark.json'),
      `${JSON.stringify(
        {
          required_genres: ['mystery', 'romance'],
          required_target_readers: ['webnovel-core', 'romance-core'],
          required_relationship_types: ['ally', 'romance'],
          minimum_panel_size: 3,
          minimum_commented_responses: 2,
          minimum_samples_per_genre: 2,
          minimum_samples_per_target_reader: 2,
          minimum_samples_per_relationship_type: 2,
          minimum_holdout_samples: 1,
          minimum_usable_holdout_samples: 1,
          minimum_failing_holdout_samples: 1,
          minimum_usable_failing_holdout_samples: 1,
          require_focus_evidence: true,
          samples: [
            {
              id: 'reader-invested-relationship',
              genre: 'mystery',
              target_reader: 'webnovel-core',
              chapter: 4,
              focus: rawStrongFocus(),
              automated_score: 92,
              expected_investing: true,
              calibration_split: 'calibration',
              rating_scale: 'likert-7',
              reader_responses: [
                highRawResponse('reader-1'),
                highRawResponse('reader-2'),
                highRawResponse('reader-3'),
              ],
            },
            {
              id: 'auto-high-reader-flat-relationship',
              genre: 'mystery',
              target_reader: 'webnovel-core',
              chapter: 4,
              focus: rawWeakFocus(),
              automated_score: 88,
              expected_investing: false,
              calibration_split: 'holdout',
              rating_scale: 'likert-7',
              reader_responses: [
                lowRawResponse('reader-4'),
                lowRawResponse('reader-5'),
                lowRawResponse('reader-6'),
              ],
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-character-relationship-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-character-relationship-benchmark.ts')],
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
      samplesLoaded: 2,
      requiredGenres: ['mystery', 'romance'],
      requiredTargetReaders: ['webnovel-core', 'romance-core'],
      requiredRelationshipTypes: ['ally', 'romance'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSamplesPerGenre: 2,
      minimumSamplesPerTargetReader: 2,
      minimumSamplesPerRelationshipType: 2,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
      requireFocusEvidenceForGateTuning: true,
      benchmark: {
        total: 2,
        passed: 1,
        failed: 1,
        automatedFalsePositiveCount: 1,
        automatedFalseNegativeCount: 0,
        weakFocusEvidenceCount: 0,
        focusEvidenceCount: 2,
        insufficientEvidenceCount: 0,
        missingRequiredGenres: ['romance'],
        underSampledRequiredGenres: ['romance'],
        missingRequiredPositiveGenres: ['romance'],
        missingRequiredNegativeGenres: ['romance'],
        missingRequiredTargetReaders: ['romance-core'],
        underSampledRequiredTargetReaders: ['romance-core'],
        missingRequiredPositiveTargetReaders: ['romance-core'],
        missingRequiredNegativeTargetReaders: ['romance-core'],
        missingRequiredRelationshipTypes: ['romance'],
        underSampledRequiredRelationshipTypes: ['romance'],
        missingRequiredPositiveRelationshipTypes: ['romance'],
        missingRequiredNegativeRelationshipTypes: ['romance'],
        splitCoverage: {
          calibrationSamples: 1,
          validationSamples: 0,
          holdoutSamples: 1,
          unassignedSamples: 0,
          usableCalibrationSamples: 1,
          usableValidationSamples: 0,
          usableHoldoutSamples: 1,
          usableUnassignedSamples: 0,
          failingHoldoutSamples: 1,
          usableFailingHoldoutSamples: 1,
        },
        underSampledHoldoutSamples: false,
        underSampledUsableHoldoutSamples: false,
        underSampledFailingHoldoutSamples: false,
        underSampledUsableFailingHoldoutSamples: false,
        splitLeakageCount: 0,
        splitLeakages: [],
        readyForGateTuning: false,
      },
    });
    expect(output.benchmark.sampleResults[1]).toMatchObject({
      id: 'auto-high-reader-flat-relationship',
      readerPassed: false,
      automatedPassed: true,
      relationshipType: 'ally',
      focusEvidence: 'usable',
      focusEvidenceFieldCount: 5,
      calibrationSplit: 'holdout',
      failureTypes: expect.arrayContaining(['automated-false-positive']),
    });

    const outputPath = join(
      projectDir,
      'reviews',
      'character-relationship-benchmark-report.json'
    );
    expect(existsSync(outputPath)).toBe(true);
    const persisted = await readJson(outputPath);
    expect(persisted.benchmark.automatedFalsePositiveCount).toBe(1);
    expect(persisted.benchmark.sampleResults[0].evidenceFingerprint).toMatch(
      /^sha256:[a-f0-9]{64}$/
    );
    expect(persisted.benchmark.sampleResults[1].focus).toMatchObject({
      relationshipType: 'ally',
      relationshipTurn: '파트너가 주인공을 믿기로 한다.',
      consequence: '다음 사건으로 넘어간다.',
    });
    expect(persisted.benchmark.sampleResults[1].readerEvidence[0]).toMatchObject({
      readerId: 'reader-4',
      disbeliefPoints: expect.arrayContaining(['상대의 조건 없음']),
      rewriteSuggestion: expect.stringContaining('주인공이 잃을 정보를'),
    });
    expect(persisted.benchmark.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('automated scoring accepts'),
        expect.stringContaining('romance-core'),
        expect.stringContaining('relationship types'),
      ])
    );
  });

  it('accepts required coverage from CLI arguments', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'character-relationship-cli-required-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const benchmarkDir = join(projectDir, 'reviews', 'character-relationship-benchmark');
    await mkdir(benchmarkDir, { recursive: true });
    await writeFile(
      join(benchmarkDir, 'character-relationship-benchmark.json'),
      `${JSON.stringify(
        {
          samples: [
            {
              id: 'reader-invested-relationship',
              genre: 'mystery',
              target_reader: 'webnovel-core',
              focus: rawStrongFocus(),
              automated_score: 92,
              expected_investing: true,
              calibration_split: 'calibration',
              rating_scale: 'likert-7',
              reader_responses: [
                highRawResponse('reader-1'),
                highRawResponse('reader-2'),
                highRawResponse('reader-3'),
              ],
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-character-relationship-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-character-relationship-benchmark.ts')],
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
        '--required-genres',
        'mystery,thriller',
        '--required-target-readers',
        'webnovel-core,thriller-core',
        '--required-relationship-types',
        'ally,rivalry',
        '--minimum-panel-size',
        '3',
        '--minimum-commented-responses',
        '2',
        '--minimum-samples-per-genre',
        '2',
        '--minimum-samples-per-target-reader',
        '2',
        '--minimum-samples-per-relationship-type',
        '2',
        '--min-holdout-samples',
        '1',
        '--min-usable-holdout-samples',
        '1',
        '--min-failing-holdout-samples',
        '1',
        '--min-usable-failing-holdout-samples',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.requiredGenres).toEqual(['mystery', 'thriller']);
    expect(output.requiredTargetReaders).toEqual(['webnovel-core', 'thriller-core']);
    expect(output.requiredRelationshipTypes).toEqual(['ally', 'rivalry']);
    expect(output.minimumPanelSize).toBe(3);
    expect(output.minimumCommentedResponses).toBe(2);
    expect(output.minimumSamplesPerGenre).toBe(2);
    expect(output.minimumSamplesPerTargetReader).toBe(2);
    expect(output.minimumSamplesPerRelationshipType).toBe(2);
    expect(output.minimumHoldoutSampleCount).toBe(1);
    expect(output.minimumUsableHoldoutSampleCount).toBe(1);
    expect(output.minimumFailingHoldoutSampleCount).toBe(1);
    expect(output.minimumUsableFailingHoldoutSampleCount).toBe(1);
    expect(output.benchmark.missingRequiredGenres).toEqual(['thriller']);
    expect(output.benchmark.underSampledRequiredGenres).toEqual(['mystery', 'thriller']);
    expect(output.benchmark.missingRequiredTargetReaders).toEqual(['thriller-core']);
    expect(output.benchmark.underSampledRequiredTargetReaders).toEqual([
      'webnovel-core',
      'thriller-core',
    ]);
    expect(output.benchmark.missingRequiredRelationshipTypes).toEqual(['rivalry']);
    expect(output.benchmark.underSampledRequiredRelationshipTypes).toEqual([
      'ally',
      'rivalry',
    ]);
    expect(output.benchmark.underSampledHoldoutSamples).toBe(true);
    expect(output.benchmark.underSampledUsableHoldoutSamples).toBe(true);
    expect(output.benchmark.underSampledFailingHoldoutSamples).toBe(true);
    expect(output.benchmark.underSampledUsableFailingHoldoutSamples).toBe(true);
    expect(output.benchmark.readyForGateTuning).toBe(false);
  });
});

function rawStrongFocus() {
  return {
    character_id: 'protagonist',
    character_name: '주인공',
    relationship_id: 'protagonist_partner',
    relationship_type: 'ally',
    counterpart_id: 'partner',
    counterpart_name: '파트너',
    scene_promise: '주인공이 숨긴 단서를 공개해 파트너의 조건부 신뢰를 얻는다.',
    character_appeal_moment: '주인공은 안전한 침묵 대신 위험한 단서 공개를 택한다.',
    relationship_turn: '파트너는 협력을 제안하지만 감시 조건을 붙인다.',
    intended_change: '둘은 함께 움직이되 서로의 거짓말을 확인한다.',
    consequence: '주인공 가족 실종 파일이 노출될 위험이 생긴다.',
  };
}

function rawWeakFocus() {
  return {
    character_id: 'protagonist',
    character_name: '주인공',
    relationship_id: 'protagonist_partner',
    relationship_type: 'ally',
    counterpart_id: 'partner',
    counterpart_name: '파트너',
    scene_promise: '주인공과 파트너가 서로를 이해하고 협력하게 된다.',
    character_appeal_moment: '주인공은 사건 해결 의지를 보인다.',
    relationship_turn: '파트너가 주인공을 믿기로 한다.',
    intended_change: '둘은 함께 수사한다.',
    consequence: '다음 사건으로 넘어간다.',
  };
}

function highRawResponse(readerId: string) {
  return {
    reader_id: readerId,
    target_reader_fit: true,
    ratings: {
      protagonist_agency: 7,
      distinctive_signature: 6,
      vulnerability_cost: 6,
      character_attachment: 6,
      relationship_tension: 6,
      reciprocal_pressure: 6,
      subtext_inference: 6,
      turn_consequence: 7,
      next_scene_interest: 7,
    },
    would_follow_character: true,
    would_follow_relationship: true,
    would_continue_score: 7,
    comment: '주인공이 손해를 감수해 단서를 공개하고 파트너도 조건을 걸어 다음 협력이 궁금하다.',
    care_points: ['단서 공개의 대가', '조건부 동맹'],
    rewrite_suggestion: '파트너가 제시하는 조건을 한 문장 더 날카롭게 만들면 좋다.',
  };
}

function lowRawResponse(readerId: string) {
  return {
    reader_id: readerId,
    target_reader_fit: true,
    ratings: {
      protagonist_agency: 4,
      distinctive_signature: 3,
      vulnerability_cost: 2,
      character_attachment: 3,
      relationship_tension: 3,
      reciprocal_pressure: 2,
      subtext_inference: 3,
      turn_consequence: 3,
      next_scene_interest: 3,
    },
    would_follow_character: false,
    would_follow_relationship: false,
    would_continue_score: 3,
    comment: '믿기로 했다는 결과만 있고 왜 마음이 바뀌었는지나 대가가 약하다.',
    disbelief_points: ['상대의 조건 없음', '주인공만의 매력이 흐림'],
    rewrite_suggestion: '파트너가 조건을 걸고 주인공이 잃을 정보를 내놓아야 한다.',
  };
}
