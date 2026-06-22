import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  evaluateEngagementBenchmark,
  type EngagementBenchmarkCalibrationSplit,
  type EngagementBenchmarkOptions,
  type EngagementPositiveQualityCode,
  type EngagementBenchmarkResult,
  type EngagementBenchmarkRoute,
  type EngagementBenchmarkSample,
} from '../quality/engagement-benchmark.js';
import {
  type CharacterReferenceForEvaluation,
  type ChapterWithReaderExperience,
  type EngagementIssueCode,
} from '../quality/engagement-contract.js';
import {
  buildSourceEvidenceManifest,
  type SourceEvidenceManifest,
} from './source-evidence.js';

export interface RunEngagementBenchmarkProjectArgs {
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
}

export interface RunEngagementBenchmarkCliResult {
  projectId: string;
  projectDir: string;
  inputDir: string;
  outputPath: string;
  samplesLoaded: number;
  requiredGenres: string[];
  requiredRoutes: EngagementBenchmarkRoute[];
  requiredIssueCodes: EngagementIssueCode[];
  requiredPositiveQualityCodes: EngagementPositiveQualityCode[];
  minimumSamplesPerRequiredIssueCode?: number;
  minimumSamplesPerRequiredPositiveQualityCode?: number;
  requiredSeriesLength?: number;
  requiredPositiveSeriesLength?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  sourceEvidence: SourceEvidenceManifest;
  benchmark: EngagementBenchmarkResult;
}

interface RawEngagementBenchmarkFile {
  required_genres?: string[];
  required_routes?: EngagementBenchmarkRoute[];
  required_issue_codes?: EngagementIssueCode[];
  required_positive_quality_codes?: EngagementPositiveQualityCode[];
  minimum_samples_per_required_issue_code?: number;
  minimum_samples_per_required_positive_quality_code?: number;
  required_series_length?: number;
  required_positive_series_length?: number;
  minimum_holdout_samples?: number;
  minimum_usable_holdout_samples?: number;
  minimum_failing_holdout_samples?: number;
  minimum_usable_failing_holdout_samples?: number;
  samples?: RawEngagementBenchmarkSample[];
}

interface RawEngagementBenchmarkSample {
  id: string;
  label?: string;
  genre?: string;
  routes?: EngagementBenchmarkRoute[];
  positive_quality_codes?: EngagementPositiveQualityCode[];
  chapter: number;
  version?: number;
  calibration_split?: string;
  manuscript?: string;
  manuscript_path?: string;
  expected_passed: boolean;
  expected_issue_codes?: EngagementIssueCode[];
  forbidden_issue_codes?: EngagementIssueCode[];
  expected_min_score?: number;
  expected_max_score?: number;
}

export async function runEngagementBenchmarkFromProject(
  args: RunEngagementBenchmarkProjectArgs
): Promise<RunEngagementBenchmarkCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const inputDir = path.resolve(args.inputDir ?? path.join(projectDir, 'reviews', 'engagement-benchmark'));
  const outputPath = path.resolve(args.outputPath ?? path.join(projectDir, 'reviews', 'engagement-benchmark-report.json'));
  const project = await readOptionalJson(path.join(projectDir, 'meta', 'project.json'));
  const projectId = args.projectId ?? project?.project_id ?? project?.id ?? path.basename(projectDir);
  const design = await readJson(path.join(projectDir, 'meta', 'design-strategy.json'));
  const plot = await readJson(path.join(projectDir, 'plot', 'plot-strategy.json'));
  const raw = await readEngagementBenchmarkSamples(inputDir);
  const samples = await Promise.all(
    raw.samples.map(sample => normalizeSample(projectDir, design, plot, sample))
  );
  const requiredGenres = uniqueStrings([
    ...raw.requiredGenres,
    ...(args.requiredGenres ?? []),
  ]);
  const requiredRoutes = uniqueRoutes([
    ...raw.requiredRoutes,
    ...(args.requiredRoutes ?? []),
  ]);
  const requiredIssueCodes = uniqueIssueCodes([
    ...raw.requiredIssueCodes,
    ...(args.requiredIssueCodes ?? []),
  ]);
  const requiredPositiveQualityCodes = uniquePositiveQualityCodes([
    ...raw.requiredPositiveQualityCodes,
    ...(args.requiredPositiveQualityCodes ?? []),
  ]);
  const minimumSamplesPerRequiredIssueCode = maxPositiveInteger([
    raw.minimumSamplesPerRequiredIssueCode,
    args.minimumSamplesPerRequiredIssueCode,
  ]);
  const minimumSamplesPerRequiredPositiveQualityCode = maxPositiveInteger([
    raw.minimumSamplesPerRequiredPositiveQualityCode,
    args.minimumSamplesPerRequiredPositiveQualityCode,
  ]);
  const requiredSeriesLength = maxPositiveInteger([
    raw.requiredSeriesLength,
    args.requiredSeriesLength,
  ]);
  const requiredPositiveSeriesLength = maxPositiveInteger([
    raw.requiredPositiveSeriesLength,
    args.requiredPositiveSeriesLength,
  ]);
  const minimumHoldoutSampleCount = maxPositiveInteger([
    raw.minimumHoldoutSampleCount,
    args.minimumHoldoutSampleCount,
  ]);
  const minimumUsableHoldoutSampleCount = maxPositiveInteger([
    raw.minimumUsableHoldoutSampleCount,
    args.minimumUsableHoldoutSampleCount,
  ]);
  const minimumFailingHoldoutSampleCount = maxPositiveInteger([
    raw.minimumFailingHoldoutSampleCount,
    args.minimumFailingHoldoutSampleCount,
  ]);
  const minimumUsableFailingHoldoutSampleCount = maxPositiveInteger([
    raw.minimumUsableFailingHoldoutSampleCount,
    args.minimumUsableFailingHoldoutSampleCount,
  ]);
  const options: EngagementBenchmarkOptions = {
    requiredGenres,
    requiredRoutes,
    requiredIssueCodes,
    requiredPositiveQualityCodes,
    minimumSamplesPerRequiredIssueCode,
    minimumSamplesPerRequiredPositiveQualityCode,
    minimumSeriesLength: requiredSeriesLength,
    minimumPositiveSeriesLength: requiredPositiveSeriesLength,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumFailingHoldoutSampleCount,
    minimumUsableFailingHoldoutSampleCount,
  };
  const benchmark = evaluateEngagementBenchmark(samples, options);
  const sourceEvidence = await buildSourceEvidenceManifest(projectDir, [
    inputDir,
    path.join(projectDir, 'meta', 'design-strategy.json'),
    path.join(projectDir, 'plot'),
    path.join(projectDir, 'chapters'),
    path.join(projectDir, 'characters'),
  ]);
  const result: RunEngagementBenchmarkCliResult = {
    projectId,
    projectDir,
    inputDir,
    outputPath,
    samplesLoaded: samples.length,
    requiredGenres,
    requiredRoutes,
    requiredIssueCodes,
    requiredPositiveQualityCodes,
    minimumSamplesPerRequiredIssueCode,
    minimumSamplesPerRequiredPositiveQualityCode,
    requiredSeriesLength,
    requiredPositiveSeriesLength,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumFailingHoldoutSampleCount,
    minimumUsableFailingHoldoutSampleCount,
    sourceEvidence,
    benchmark,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return result;
}

async function readEngagementBenchmarkSamples(
  inputDir: string
): Promise<{
  samples: RawEngagementBenchmarkSample[];
  requiredGenres: string[];
  requiredRoutes: EngagementBenchmarkRoute[];
  requiredIssueCodes: EngagementIssueCode[];
  requiredPositiveQualityCodes: EngagementPositiveQualityCode[];
  minimumSamplesPerRequiredIssueCode?: number;
  minimumSamplesPerRequiredPositiveQualityCode?: number;
  requiredSeriesLength?: number;
  requiredPositiveSeriesLength?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
}> {
  const files = await readJsonFiles(inputDir);
  if (files.length === 0) {
    throw new Error(`No engagement benchmark JSON files found in ${inputDir}`);
  }

  const samples: RawEngagementBenchmarkSample[] = [];
  const requiredGenres: string[] = [];
  const requiredRoutes: EngagementBenchmarkRoute[] = [];
  const requiredIssueCodes: EngagementIssueCode[] = [];
  const requiredPositiveQualityCodes: EngagementPositiveQualityCode[] = [];
  const minimumSamplesPerRequiredIssueCodeCounts: Array<number | undefined> = [];
  const minimumSamplesPerRequiredPositiveQualityCodeCounts: Array<number | undefined> = [];
  const requiredSeriesLengths: Array<number | undefined> = [];
  const requiredPositiveSeriesLengths: Array<number | undefined> = [];
  const minimumHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumUsableHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumFailingHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumUsableFailingHoldoutSampleCounts: Array<number | undefined> = [];

  for (const filePath of files) {
    const parsed = await readJson(filePath) as RawEngagementBenchmarkFile | RawEngagementBenchmarkSample;
    if (Array.isArray((parsed as RawEngagementBenchmarkFile).samples)) {
      const suite = parsed as RawEngagementBenchmarkFile;
      samples.push(...(suite.samples ?? []));
      requiredGenres.push(...(suite.required_genres ?? []));
      requiredRoutes.push(...(suite.required_routes ?? []));
      requiredIssueCodes.push(...(suite.required_issue_codes ?? []));
      requiredPositiveQualityCodes.push(...(suite.required_positive_quality_codes ?? []));
      minimumSamplesPerRequiredIssueCodeCounts.push(
        suite.minimum_samples_per_required_issue_code
      );
      minimumSamplesPerRequiredPositiveQualityCodeCounts.push(
        suite.minimum_samples_per_required_positive_quality_code
      );
      requiredSeriesLengths.push(suite.required_series_length);
      requiredPositiveSeriesLengths.push(suite.required_positive_series_length);
      minimumHoldoutSampleCounts.push(suite.minimum_holdout_samples);
      minimumUsableHoldoutSampleCounts.push(suite.minimum_usable_holdout_samples);
      minimumFailingHoldoutSampleCounts.push(suite.minimum_failing_holdout_samples);
      minimumUsableFailingHoldoutSampleCounts.push(suite.minimum_usable_failing_holdout_samples);
    } else {
      samples.push(parsed as RawEngagementBenchmarkSample);
    }
  }

  if (samples.length === 0) {
    throw new Error(`Engagement benchmark files in ${inputDir} did not contain any samples`);
  }

  return {
    samples,
    requiredGenres: uniqueStrings(requiredGenres),
    requiredRoutes: uniqueRoutes(requiredRoutes),
    requiredIssueCodes: uniqueIssueCodes(requiredIssueCodes),
    requiredPositiveQualityCodes: uniquePositiveQualityCodes(requiredPositiveQualityCodes),
    minimumSamplesPerRequiredIssueCode: maxPositiveInteger(
      minimumSamplesPerRequiredIssueCodeCounts
    ),
    minimumSamplesPerRequiredPositiveQualityCode: maxPositiveInteger(
      minimumSamplesPerRequiredPositiveQualityCodeCounts
    ),
    requiredSeriesLength: maxPositiveInteger(requiredSeriesLengths),
    requiredPositiveSeriesLength: maxPositiveInteger(requiredPositiveSeriesLengths),
    minimumHoldoutSampleCount: maxPositiveInteger(minimumHoldoutSampleCounts),
    minimumUsableHoldoutSampleCount: maxPositiveInteger(minimumUsableHoldoutSampleCounts),
    minimumFailingHoldoutSampleCount: maxPositiveInteger(minimumFailingHoldoutSampleCounts),
    minimumUsableFailingHoldoutSampleCount: maxPositiveInteger(minimumUsableFailingHoldoutSampleCounts),
  };
}

async function normalizeSample(
  projectDir: string,
  design: any,
  plot: any,
  sample: RawEngagementBenchmarkSample
): Promise<EngagementBenchmarkSample> {
  if (!Number.isInteger(sample.chapter) || sample.chapter < 1) {
    throw new Error(`Engagement benchmark sample ${sample.id} needs chapter >= 1`);
  }

  const [
    chapter,
    manuscriptInput,
    relationships,
    hooks,
    previousChapters,
    previousManuscripts,
  ] = await Promise.all([
    readJson(path.join(projectDir, 'chapters', `chapter_${padChapter(sample.chapter)}.json`)),
    readSampleManuscript(projectDir, sample),
    readOptionalJson(path.join(projectDir, 'characters', 'relationships.json')),
    readOptionalJson(path.join(projectDir, 'plot', 'hooks.json')),
    readPreviousChapters(projectDir, sample.chapter),
    readPreviousManuscripts(projectDir, sample.chapter),
  ]);
  const characters = await loadChapterCharacters(projectDir, chapter);

  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre,
    routes: sample.routes,
    positiveQualityCodes: sample.positive_quality_codes,
    chapter: sample.chapter,
    calibrationSplit: normalizeCalibrationSplit(sample),
    input: {
      design,
      plot,
      chapter,
      characters,
      relationships,
      hooks,
      manuscript: manuscriptInput.manuscript,
      previousChapters,
      previousManuscripts,
    },
    manuscriptSource: manuscriptInput.source,
    manuscriptPath: manuscriptInput.path,
    chapterSourceGrounded: manuscriptInput.chapterSourceGrounded,
    expectedPassed: sample.expected_passed,
    expectedIssueCodes: sample.expected_issue_codes,
    forbiddenIssueCodes: sample.forbidden_issue_codes,
    expectedMinScore: sample.expected_min_score,
    expectedMaxScore: sample.expected_max_score,
  };
}

function normalizeCalibrationSplit(
  sample: RawEngagementBenchmarkSample
): EngagementBenchmarkCalibrationSplit | undefined {
  if (sample.calibration_split === undefined) return undefined;
  if (
    sample.calibration_split === 'calibration'
    || sample.calibration_split === 'validation'
    || sample.calibration_split === 'holdout'
  ) {
    return sample.calibration_split;
  }

  throw new Error(
    `Engagement benchmark sample ${sample.id} has invalid calibration_split: ${sample.calibration_split}`
  );
}

async function readSampleManuscript(
  projectDir: string,
  sample: RawEngagementBenchmarkSample
): Promise<{
  manuscript?: string;
  source: 'inline' | 'manuscript_path' | 'chapter';
  path?: string;
  chapterSourceGrounded: boolean;
}> {
  if (sample.manuscript !== undefined) {
    return {
      manuscript: sample.manuscript,
      source: 'inline',
      chapterSourceGrounded: false,
    };
  }

  if (sample.manuscript_path) {
    const manuscriptPath = path.isAbsolute(sample.manuscript_path)
      ? sample.manuscript_path
      : path.join(projectDir, sample.manuscript_path);
    return {
      manuscript: await fs.readFile(manuscriptPath, 'utf8'),
      source: 'manuscript_path',
      path: normalizeProjectRelativePath(projectDir, manuscriptPath),
      chapterSourceGrounded: isChapterManuscriptPath(manuscriptPath, sample.chapter),
    };
  }

  return {
    manuscript: await readOptionalChapterManuscript(projectDir, sample.chapter),
    source: 'chapter',
    path: `chapters/chapter_${padChapter(sample.chapter)}.md`,
    chapterSourceGrounded: true,
  };
}

async function readJsonFiles(inputDir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(inputDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
      .map(entry => path.join(inputDir, entry.name))
      .sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function padChapter(chapterNumber: number): string {
  return String(chapterNumber).padStart(3, '0');
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

async function readOptionalChapterManuscript(
  projectDir: string,
  chapterNumber: number
): Promise<string | undefined> {
  const paddedChapter = padChapter(chapterNumber);
  return (
    (await readOptionalText(path.join(projectDir, 'chapters', `chapter_${paddedChapter}.md`))) ??
    (await readOptionalText(path.join(projectDir, 'chapters', `ch${paddedChapter}.md`)))
  );
}

function normalizeProjectRelativePath(projectDir: string, filePath: string): string {
  const relative = path.relative(projectDir, filePath);
  return (relative && !relative.startsWith('..') && !path.isAbsolute(relative)
    ? relative
    : filePath
  ).split(path.sep).join('/');
}

function isChapterManuscriptPath(filePath: string, chapterNumber: number): boolean {
  const normalized = normalizeProjectRelativePath('', filePath).toLowerCase();
  const padded = padChapter(chapterNumber);
  return normalized.endsWith(`chapters/chapter_${padded}.md`) ||
    normalized.endsWith(`chapters/ch${padded}.md`);
}

async function readPreviousChapters(
  projectDir: string,
  chapterNumber: number
): Promise<ChapterWithReaderExperience[]> {
  const previousNumbers = previousChapterNumbers(chapterNumber);
  const chapters = await Promise.all(
    previousNumbers.map(previousNumber =>
      readOptionalJson(
        path.join(projectDir, 'chapters', `chapter_${padChapter(previousNumber)}.json`)
      )
    )
  );
  return chapters.filter(
    (chapter): chapter is ChapterWithReaderExperience => chapter !== undefined
  );
}

async function readPreviousManuscripts(
  projectDir: string,
  chapterNumber: number
): Promise<string[]> {
  const previousNumbers = previousChapterNumbers(chapterNumber);
  const manuscripts = await Promise.all(
    previousNumbers.map(previousNumber =>
      readOptionalChapterManuscript(projectDir, previousNumber)
    )
  );
  return manuscripts.filter(
    (manuscript): manuscript is string => typeof manuscript === 'string' && manuscript.trim().length > 0
  );
}

function previousChapterNumbers(chapterNumber: number): number[] {
  return [chapterNumber - 2, chapterNumber - 1].filter(
    previousNumber => previousNumber >= 1
  );
}

async function readOptionalText(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

async function loadChapterCharacters(
  projectDir: string,
  chapter: any
): Promise<CharacterReferenceForEvaluation[]> {
  const sceneCharacterIds = Array.isArray(chapter?.scenes)
    ? chapter.scenes.flatMap((scene: any) =>
        Array.isArray(scene?.characters) ? scene.characters : []
      )
    : [];
  const characterIds = new Set<string>([
    ...(Array.isArray(chapter?.meta?.characters) ? chapter.meta.characters : []),
    ...(typeof chapter?.meta?.pov_character === 'string' ? [chapter.meta.pov_character] : []),
    ...sceneCharacterIds.filter(
      (characterId: unknown): characterId is string => typeof characterId === 'string'
    ),
  ]);
  if (characterIds.size === 0) {
    return [];
  }

  const index = await readOptionalJson(path.join(projectDir, 'characters', 'index.json'));
  const indexedCharacters = new Map<string, CharacterReferenceForEvaluation>();
  for (const entry of index?.characters ?? []) {
    if (entry?.id && entry?.name) {
      indexedCharacters.set(entry.id, {
        id: entry.id,
        name: entry.name,
        aliases: Array.isArray(entry.aliases) ? entry.aliases : undefined,
        role: entry.role,
        inner: normalizeCharacterInner(entry.inner),
      });
    }
  }

  const characters: CharacterReferenceForEvaluation[] = [];
  for (const characterId of characterIds) {
    const profile = await readOptionalJson(
      path.join(projectDir, 'characters', `${characterId}.json`)
    );
    const indexed = indexedCharacters.get(characterId);
    const name = profile?.name ?? indexed?.name;
    if (!name) {
      continue;
    }

    characters.push({
      id: characterId,
      name,
      aliases: [
        ...(Array.isArray(indexed?.aliases) ? indexed.aliases : []),
        ...(Array.isArray(profile?.aliases) ? profile.aliases : []),
      ],
      role: profile?.role ?? indexed?.role,
      inner: normalizeCharacterInner(profile?.inner) ?? indexed?.inner,
    });
  }

  return characters;
}

function normalizeCharacterInner(inner: any): CharacterReferenceForEvaluation['inner'] {
  if (!inner || typeof inner !== 'object') {
    return undefined;
  }

  const normalized = {
    want: typeof inner.want === 'string' ? inner.want : undefined,
    need: typeof inner.need === 'string' ? inner.need : undefined,
    fatal_flaw: typeof inner.fatal_flaw === 'string' ? inner.fatal_flaw : undefined,
  };

  return normalized.want || normalized.need || normalized.fatal_flaw ? normalized : undefined;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(value => value.trim().length > 0))];
}

function uniqueRoutes(
  values: EngagementBenchmarkRoute[]
): EngagementBenchmarkRoute[] {
  return [...new Set(values)];
}

function uniqueIssueCodes(
  values: EngagementIssueCode[]
): EngagementIssueCode[] {
  return [...new Set(values)];
}

function uniquePositiveQualityCodes(
  values: EngagementPositiveQualityCode[]
): EngagementPositiveQualityCode[] {
  return [...new Set(values)];
}

function maxPositiveInteger(values: Array<number | undefined>): number | undefined {
  const integers = values.filter(
    (value): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0
  );
  return integers.length > 0 ? Math.max(...integers) : undefined;
}
