import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  evaluateCharacterRelationshipBenchmark,
  type CharacterRelationshipBenchmarkOptions,
  type CharacterRelationshipBenchmarkResult,
  type CharacterRelationshipBenchmarkSample,
  type CharacterRelationshipCalibrationSplit,
  type CharacterRelationshipDimension,
  type CharacterRelationshipFocus,
  type CharacterRelationshipRatingScale,
  type CharacterRelationshipReaderResponse,
} from '../quality/character-relationship-benchmark.js';
import {
  buildSourceEvidenceManifest,
  type SourceEvidenceManifest,
} from './source-evidence.js';

export interface RunCharacterRelationshipBenchmarkProjectArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  requiredGenres?: string[];
  requiredTargetReaders?: string[];
  requiredRelationshipTypes?: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumSamplesPerRelationshipType?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  requireFocusEvidenceForGateTuning?: boolean;
}

export interface RunCharacterRelationshipBenchmarkCliResult {
  projectId: string;
  projectDir: string;
  inputDir: string;
  outputPath: string;
  samplesLoaded: number;
  requiredGenres: string[];
  requiredTargetReaders: string[];
  requiredRelationshipTypes: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumSamplesPerRelationshipType?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  requireFocusEvidenceForGateTuning?: boolean;
  sourceEvidence: SourceEvidenceManifest;
  benchmark: CharacterRelationshipBenchmarkResult;
}

interface RawCharacterRelationshipBenchmarkFile {
  required_genres?: string[];
  required_target_readers?: string[];
  required_relationship_types?: string[];
  minimum_panel_size?: number;
  minimum_commented_responses?: number;
  minimum_samples_per_genre?: number;
  minimum_samples_per_target_reader?: number;
  minimum_samples_per_relationship_type?: number;
  minimum_holdout_samples?: number;
  minimum_usable_holdout_samples?: number;
  minimum_failing_holdout_samples?: number;
  minimum_usable_failing_holdout_samples?: number;
  require_focus_evidence?: boolean;
  samples?: RawCharacterRelationshipBenchmarkSample[];
}

interface RawCharacterRelationshipBenchmarkSample {
  id: string;
  label?: string;
  genre?: string;
  target_reader?: string;
  chapter?: number;
  focus?: RawCharacterRelationshipFocus;
  automated_score?: number;
  expected_investing?: boolean;
  calibration_split?: string;
  rating_scale?: CharacterRelationshipRatingScale;
  reader_responses: RawCharacterRelationshipReaderResponse[];
}

interface RawCharacterRelationshipFocus {
  character_id?: string;
  character_name?: string;
  relationship_id?: string;
  relationship_type?: string;
  counterpart_id?: string;
  counterpart_name?: string;
  scene_promise?: string;
  character_appeal_moment?: string;
  relationship_turn?: string;
  intended_change?: string;
  consequence?: string;
}

interface RawCharacterRelationshipReaderResponse {
  reader_id?: string;
  target_reader_fit?: boolean;
  rating_scale?: CharacterRelationshipRatingScale;
  ratings: Partial<Record<CharacterRelationshipDimension, number>>;
  would_follow_character?: boolean;
  would_follow_relationship?: boolean;
  would_continue_score?: number;
  comment?: string;
  care_points?: string[];
  disbelief_points?: string[];
  rewrite_suggestion?: string;
}

interface LoadedRawCharacterRelationshipBenchmarkSample {
  sample: RawCharacterRelationshipBenchmarkSample;
}

export async function runCharacterRelationshipBenchmarkFromProject(
  args: RunCharacterRelationshipBenchmarkProjectArgs
): Promise<RunCharacterRelationshipBenchmarkCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const inputDir = path.resolve(
    args.inputDir ?? path.join(projectDir, 'reviews', 'character-relationship-benchmark')
  );
  const outputPath = path.resolve(
    args.outputPath ??
      path.join(projectDir, 'reviews', 'character-relationship-benchmark-report.json')
  );
  const project = await readOptionalJson(path.join(projectDir, 'meta', 'project.json'));
  const projectId = args.projectId ?? project?.project_id ?? project?.id ?? path.basename(projectDir);
  const raw = await readCharacterRelationshipBenchmarkSamples(inputDir);
  const samples = raw.samples.map(loaded => normalizeSample(loaded.sample));
  const requiredGenres = uniqueStrings([
    ...raw.requiredGenres,
    ...(args.requiredGenres ?? []),
  ]);
  const requiredTargetReaders = uniqueStrings([
    ...raw.requiredTargetReaders,
    ...(args.requiredTargetReaders ?? []),
  ]);
  const requiredRelationshipTypes = uniqueStrings([
    ...raw.requiredRelationshipTypes,
    ...(args.requiredRelationshipTypes ?? []),
  ]);
  const minimumPanelSize = maxPositiveInteger([
    raw.minimumPanelSize,
    args.minimumPanelSize,
  ]);
  const minimumCommentedResponses = maxPositiveInteger([
    raw.minimumCommentedResponses,
    args.minimumCommentedResponses,
  ]);
  const minimumSamplesPerGenre = maxPositiveInteger([
    raw.minimumSamplesPerGenre,
    args.minimumSamplesPerGenre,
  ]);
  const minimumSamplesPerTargetReader = maxPositiveInteger([
    raw.minimumSamplesPerTargetReader,
    args.minimumSamplesPerTargetReader,
  ]);
  const minimumSamplesPerRelationshipType = maxPositiveInteger([
    raw.minimumSamplesPerRelationshipType,
    args.minimumSamplesPerRelationshipType,
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
  const requireFocusEvidenceForGateTuning =
    args.requireFocusEvidenceForGateTuning ?? raw.requireFocusEvidenceForGateTuning ?? true;
  const options: CharacterRelationshipBenchmarkOptions = {
    requiredGenres,
    requiredTargetReaders,
    requiredRelationshipTypes,
    minimumPanelSize,
    minimumCommentedResponses,
    minimumSamplesPerGenre,
    minimumSamplesPerTargetReader,
    minimumSamplesPerRelationshipType,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumFailingHoldoutSampleCount,
    minimumUsableFailingHoldoutSampleCount,
    requireFocusEvidenceForGateTuning,
  };
  const benchmark = evaluateCharacterRelationshipBenchmark(samples, options);
  const sourceEvidence = await buildSourceEvidenceManifest(projectDir, [
    inputDir,
  ]);
  const result: RunCharacterRelationshipBenchmarkCliResult = {
    projectId,
    projectDir,
    inputDir,
    outputPath,
    samplesLoaded: samples.length,
    requiredGenres,
    requiredTargetReaders,
    requiredRelationshipTypes,
    minimumPanelSize,
    minimumCommentedResponses,
    minimumSamplesPerGenre,
    minimumSamplesPerTargetReader,
    minimumSamplesPerRelationshipType,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumFailingHoldoutSampleCount,
    minimumUsableFailingHoldoutSampleCount,
    requireFocusEvidenceForGateTuning,
    sourceEvidence,
    benchmark,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return result;
}

async function readCharacterRelationshipBenchmarkSamples(
  inputDir: string
): Promise<{
  samples: LoadedRawCharacterRelationshipBenchmarkSample[];
  requiredGenres: string[];
  requiredTargetReaders: string[];
  requiredRelationshipTypes: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumSamplesPerRelationshipType?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  requireFocusEvidenceForGateTuning?: boolean;
}> {
  const files = await readJsonFiles(inputDir);
  if (files.length === 0) {
    throw new Error(`No character relationship benchmark JSON files found in ${inputDir}`);
  }

  const samples: LoadedRawCharacterRelationshipBenchmarkSample[] = [];
  const requiredGenres: string[] = [];
  const requiredTargetReaders: string[] = [];
  const requiredRelationshipTypes: string[] = [];
  const minimumPanelSizes: Array<number | undefined> = [];
  const minimumCommentedResponses: Array<number | undefined> = [];
  const minimumSamplesPerGenre: Array<number | undefined> = [];
  const minimumSamplesPerTargetReader: Array<number | undefined> = [];
  const minimumSamplesPerRelationshipType: Array<number | undefined> = [];
  const minimumHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumUsableHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumFailingHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumUsableFailingHoldoutSampleCounts: Array<number | undefined> = [];
  const requireFocusEvidenceValues: Array<boolean | undefined> = [];

  for (const filePath of files) {
    const parsed = await readJson(filePath) as
      | RawCharacterRelationshipBenchmarkFile
      | RawCharacterRelationshipBenchmarkSample;
    if (Array.isArray((parsed as RawCharacterRelationshipBenchmarkFile).samples)) {
      const suite = parsed as RawCharacterRelationshipBenchmarkFile;
      samples.push(...(suite.samples ?? []).map(sample => ({ sample })));
      requiredGenres.push(...(suite.required_genres ?? []));
      requiredTargetReaders.push(...(suite.required_target_readers ?? []));
      requiredRelationshipTypes.push(...(suite.required_relationship_types ?? []));
      minimumPanelSizes.push(suite.minimum_panel_size);
      minimumCommentedResponses.push(suite.minimum_commented_responses);
      minimumSamplesPerGenre.push(suite.minimum_samples_per_genre);
      minimumSamplesPerTargetReader.push(suite.minimum_samples_per_target_reader);
      minimumSamplesPerRelationshipType.push(suite.minimum_samples_per_relationship_type);
      minimumHoldoutSampleCounts.push(suite.minimum_holdout_samples);
      minimumUsableHoldoutSampleCounts.push(suite.minimum_usable_holdout_samples);
      minimumFailingHoldoutSampleCounts.push(suite.minimum_failing_holdout_samples);
      minimumUsableFailingHoldoutSampleCounts.push(
        suite.minimum_usable_failing_holdout_samples
      );
      requireFocusEvidenceValues.push(suite.require_focus_evidence);
    } else {
      samples.push({ sample: parsed as RawCharacterRelationshipBenchmarkSample });
    }
  }

  if (samples.length === 0) {
    throw new Error(
      `Character relationship benchmark files in ${inputDir} did not contain any samples`
    );
  }

  return {
    samples,
    requiredGenres: uniqueStrings(requiredGenres),
    requiredTargetReaders: uniqueStrings(requiredTargetReaders),
    requiredRelationshipTypes: uniqueStrings(requiredRelationshipTypes),
    minimumPanelSize: maxPositiveInteger(minimumPanelSizes),
    minimumCommentedResponses: maxPositiveInteger(minimumCommentedResponses),
    minimumSamplesPerGenre: maxPositiveInteger(minimumSamplesPerGenre),
    minimumSamplesPerTargetReader: maxPositiveInteger(minimumSamplesPerTargetReader),
    minimumSamplesPerRelationshipType: maxPositiveInteger(minimumSamplesPerRelationshipType),
    minimumHoldoutSampleCount: maxPositiveInteger(minimumHoldoutSampleCounts),
    minimumUsableHoldoutSampleCount: maxPositiveInteger(minimumUsableHoldoutSampleCounts),
    minimumFailingHoldoutSampleCount: maxPositiveInteger(minimumFailingHoldoutSampleCounts),
    minimumUsableFailingHoldoutSampleCount: maxPositiveInteger(
      minimumUsableFailingHoldoutSampleCounts
    ),
    requireFocusEvidenceForGateTuning: lastDefinedBoolean(requireFocusEvidenceValues),
  };
}

function normalizeSample(
  sample: RawCharacterRelationshipBenchmarkSample
): CharacterRelationshipBenchmarkSample {
  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre,
    targetReader: sample.target_reader,
    chapter: sample.chapter,
    focus: normalizeFocus(sample.focus),
    automatedScore: sample.automated_score,
    expectedInvesting: sample.expected_investing,
    calibrationSplit: normalizeCalibrationSplit(sample),
    ratingScale: sample.rating_scale,
    readerResponses: sample.reader_responses.map(normalizeReaderResponse),
  };
}

function normalizeCalibrationSplit(
  sample: RawCharacterRelationshipBenchmarkSample
): CharacterRelationshipCalibrationSplit | undefined {
  if (sample.calibration_split === undefined) {
    return undefined;
  }
  if (
    sample.calibration_split === 'calibration' ||
    sample.calibration_split === 'validation' ||
    sample.calibration_split === 'holdout'
  ) {
    return sample.calibration_split;
  }
  throw new Error(
    `Invalid calibration_split for character/relationship benchmark sample ${sample.id}: ${sample.calibration_split}`
  );
}

function normalizeFocus(
  focus: RawCharacterRelationshipFocus | undefined
): CharacterRelationshipFocus | undefined {
  if (!focus) return undefined;
  return {
    characterId: focus.character_id,
    characterName: focus.character_name,
    relationshipId: focus.relationship_id,
    relationshipType: focus.relationship_type,
    counterpartId: focus.counterpart_id,
    counterpartName: focus.counterpart_name,
    scenePromise: focus.scene_promise,
    characterAppealMoment: focus.character_appeal_moment,
    relationshipTurn: focus.relationship_turn,
    intendedChange: focus.intended_change,
    consequence: focus.consequence,
  };
}

function normalizeReaderResponse(
  response: RawCharacterRelationshipReaderResponse
): CharacterRelationshipReaderResponse {
  return {
    readerId: response.reader_id,
    targetReaderFit: response.target_reader_fit,
    ratingScale: response.rating_scale,
    ratings: response.ratings,
    wouldFollowCharacter: response.would_follow_character,
    wouldFollowRelationship: response.would_follow_relationship,
    wouldContinueScore: response.would_continue_score,
    comment: response.comment,
    carePoints: response.care_points,
    disbeliefPoints: response.disbelief_points,
    rewriteSuggestion: response.rewrite_suggestion,
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

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(Boolean))];
}

function maxPositiveInteger(values: Array<number | undefined>): number | undefined {
  const integers = values.filter(
    (value): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0
  );
  return integers.length > 0 ? Math.max(...integers) : undefined;
}

function lastDefinedBoolean(values: Array<boolean | undefined>): boolean | undefined {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (typeof values[index] === 'boolean') {
      return values[index];
    }
  }
  return undefined;
}
