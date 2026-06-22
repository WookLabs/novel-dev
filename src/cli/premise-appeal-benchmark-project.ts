import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  evaluatePremiseAppealBenchmark,
  type PremiseAppealBenchmarkOptions,
  type PremiseAppealBenchmarkResult,
  type PremiseAppealBenchmarkSample,
  type PremiseAppealBehavioralIntentEvidence,
  type PremiseAppealCalibrationSplit,
  type PremiseAppealDimension,
  type PremiseAppealPromise,
  type PremiseAppealRatingScale,
  type PremiseAppealReaderResponse,
} from '../quality/premise-appeal-benchmark.js';
import {
  buildSourceEvidenceManifest,
  type SourceEvidenceManifest,
} from './source-evidence.js';

export interface RunPremiseAppealBenchmarkProjectArgs {
  projectDir: string;
  projectId?: string;
  inputDir?: string;
  outputPath?: string;
  requiredGenres?: string[];
  requiredTargetReaders?: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  minimumBehavioralImpressionCount?: number;
  minimumClickThroughRate?: number;
  minimumFirstChapterOpenRate?: number;
  minimumSaveOrFollowRate?: number;
  minimumBehavioralObservationWindowHours?: number;
  minimumSampleRatioMismatchPValue?: number;
  requirePromiseEvidenceForGateTuning?: boolean;
  requireBehavioralIntentEvidenceForGateTuning?: boolean;
  requireBehavioralProtocolForGateTuning?: boolean;
  requireBehavioralAllocationIntegrityForGateTuning?: boolean;
}

export interface RunPremiseAppealBenchmarkCliResult {
  projectId: string;
  projectDir: string;
  inputDir: string;
  outputPath: string;
  samplesLoaded: number;
  requiredGenres: string[];
  requiredTargetReaders: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  minimumBehavioralImpressionCount?: number;
  minimumClickThroughRate?: number;
  minimumFirstChapterOpenRate?: number;
  minimumSaveOrFollowRate?: number;
  minimumBehavioralObservationWindowHours?: number;
  minimumSampleRatioMismatchPValue?: number;
  requirePromiseEvidenceForGateTuning?: boolean;
  requireBehavioralIntentEvidenceForGateTuning?: boolean;
  requireBehavioralProtocolForGateTuning?: boolean;
  requireBehavioralAllocationIntegrityForGateTuning?: boolean;
  sourceEvidence: SourceEvidenceManifest;
  benchmark: PremiseAppealBenchmarkResult;
}

interface RawPremiseAppealBenchmarkFile {
  required_genres?: string[];
  required_target_readers?: string[];
  minimum_panel_size?: number;
  minimum_commented_responses?: number;
  minimum_samples_per_genre?: number;
  minimum_samples_per_target_reader?: number;
  minimum_holdout_samples?: number;
  minimum_usable_holdout_samples?: number;
  minimum_failing_holdout_samples?: number;
  minimum_usable_failing_holdout_samples?: number;
  minimum_behavioral_impressions?: number;
  minimum_click_through_rate?: number;
  minimum_first_chapter_open_rate?: number;
  minimum_save_or_follow_rate?: number;
  minimum_behavioral_observation_window_hours?: number;
  minimum_sample_ratio_mismatch_p_value?: number;
  require_promise_evidence?: boolean;
  require_behavioral_intent_evidence?: boolean;
  require_behavioral_protocol?: boolean;
  require_behavioral_allocation_integrity?: boolean;
  samples?: RawPremiseAppealBenchmarkSample[];
}

interface RawPremiseAppealBenchmarkSample {
  id: string;
  label?: string;
  genre?: string;
  target_reader?: string;
  premise?: PremiseAppealPromise;
  calibration_split?: string;
  automated_score?: number;
  expected_appealing?: boolean;
  rating_scale?: PremiseAppealRatingScale;
  behavioral_evidence?: RawPremiseBehavioralIntentEvidence;
  reader_responses: RawPremiseReaderResponse[];
}

interface RawPremiseBehavioralIntentEvidence {
  platform?: string;
  variant_label?: string;
  acquisition_source?: string;
  observation_window_hours?: number;
  blind_listing_test?: boolean;
  impression_count?: number;
  click_count?: number;
  first_chapter_open_count?: number;
  sample_read_start_count?: number;
  library_add_count?: number;
  follow_count?: number;
  paid_preview_click_count?: number;
  benchmark_click_through_rate?: number;
  benchmark_first_chapter_open_rate?: number;
  benchmark_save_or_follow_rate?: number;
  expected_variant_allocation_ratio?: number;
  observed_variant_allocation_ratio?: number;
  sample_ratio_mismatch_p_value?: number;
}

interface RawPremiseReaderResponse {
  reader_id?: string;
  target_reader_fit?: boolean;
  rating_scale?: PremiseAppealRatingScale;
  ratings: Partial<Record<PremiseAppealDimension, number>>;
  would_read?: boolean;
  would_read_score?: number;
  comment?: string;
  confusion_points?: string[];
  attractive_elements?: string[];
  rewrite_suggestion?: string;
}

interface LoadedRawPremiseAppealBenchmarkSample {
  sample: RawPremiseAppealBenchmarkSample;
  defaultMinimumPanelSize?: number;
  defaultMinimumCommentedResponses?: number;
  defaultMinimumSamplesPerGenre?: number;
  defaultMinimumSamplesPerTargetReader?: number;
}

export async function runPremiseAppealBenchmarkFromProject(
  args: RunPremiseAppealBenchmarkProjectArgs
): Promise<RunPremiseAppealBenchmarkCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const inputDir = path.resolve(
    args.inputDir ?? path.join(projectDir, 'reviews', 'premise-appeal-benchmark')
  );
  const outputPath = path.resolve(
    args.outputPath ?? path.join(projectDir, 'reviews', 'premise-appeal-benchmark-report.json')
  );
  const project = await readOptionalJson(path.join(projectDir, 'meta', 'project.json'));
  const design = await readJson(path.join(projectDir, 'meta', 'design-strategy.json'));
  const projectId = args.projectId ?? project?.project_id ?? project?.id ?? path.basename(projectDir);
  const raw = await readPremiseAppealBenchmarkSamples(inputDir);
  const samples = raw.samples.map(loaded => normalizeSample(design, loaded.sample));
  const requiredGenres = uniqueStrings([
    ...raw.requiredGenres,
    ...(args.requiredGenres ?? []),
  ]);
  const requiredTargetReaders = uniqueStrings([
    ...raw.requiredTargetReaders,
    ...(args.requiredTargetReaders ?? []),
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
  const minimumBehavioralImpressionCount = maxPositiveInteger([
    raw.minimumBehavioralImpressionCount,
    args.minimumBehavioralImpressionCount,
  ]);
  const minimumClickThroughRate = maxFiniteRatio([
    raw.minimumClickThroughRate,
    args.minimumClickThroughRate,
  ]);
  const minimumFirstChapterOpenRate = maxFiniteRatio([
    raw.minimumFirstChapterOpenRate,
    args.minimumFirstChapterOpenRate,
  ]);
  const minimumSaveOrFollowRate = maxFiniteRatio([
    raw.minimumSaveOrFollowRate,
    args.minimumSaveOrFollowRate,
  ]);
  const minimumBehavioralObservationWindowHours = maxPositiveInteger([
    raw.minimumBehavioralObservationWindowHours,
    args.minimumBehavioralObservationWindowHours,
  ]);
  const minimumSampleRatioMismatchPValue = maxFiniteRatio([
    raw.minimumSampleRatioMismatchPValue,
    args.minimumSampleRatioMismatchPValue,
  ]);
  const requirePromiseEvidenceForGateTuning =
    args.requirePromiseEvidenceForGateTuning ??
    raw.requirePromiseEvidenceForGateTuning;
  const requireBehavioralIntentEvidenceForGateTuning =
    args.requireBehavioralIntentEvidenceForGateTuning ??
    raw.requireBehavioralIntentEvidenceForGateTuning;
  const requireBehavioralProtocolForGateTuning =
    args.requireBehavioralProtocolForGateTuning ??
    raw.requireBehavioralProtocolForGateTuning;
  const requireBehavioralAllocationIntegrityForGateTuning =
    args.requireBehavioralAllocationIntegrityForGateTuning ??
    raw.requireBehavioralAllocationIntegrityForGateTuning;
  const options: PremiseAppealBenchmarkOptions = {
    requiredGenres,
    requiredTargetReaders,
    minimumPanelSize,
    minimumCommentedResponses,
    minimumSamplesPerGenre,
    minimumSamplesPerTargetReader,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumFailingHoldoutSampleCount,
    minimumUsableFailingHoldoutSampleCount,
    minimumBehavioralImpressionCount,
    minimumClickThroughRate,
    minimumFirstChapterOpenRate,
    minimumSaveOrFollowRate,
    minimumBehavioralObservationWindowHours,
    minimumSampleRatioMismatchPValue,
    requirePromiseEvidenceForGateTuning,
    requireBehavioralIntentEvidenceForGateTuning,
    requireBehavioralProtocolForGateTuning,
    requireBehavioralAllocationIntegrityForGateTuning,
  };
  const benchmark = evaluatePremiseAppealBenchmark(samples, options);
  const sourceEvidence = await buildSourceEvidenceManifest(projectDir, [
    inputDir,
    path.join(projectDir, 'meta', 'design-strategy.json'),
  ]);
  const result: RunPremiseAppealBenchmarkCliResult = {
    projectId,
    projectDir,
    inputDir,
    outputPath,
    samplesLoaded: samples.length,
    requiredGenres,
    requiredTargetReaders,
    minimumPanelSize,
    minimumCommentedResponses,
    minimumSamplesPerGenre,
    minimumSamplesPerTargetReader,
    minimumHoldoutSampleCount,
    minimumUsableHoldoutSampleCount,
    minimumFailingHoldoutSampleCount,
    minimumUsableFailingHoldoutSampleCount,
    minimumBehavioralImpressionCount,
    minimumClickThroughRate,
    minimumFirstChapterOpenRate,
    minimumSaveOrFollowRate,
    minimumBehavioralObservationWindowHours,
    minimumSampleRatioMismatchPValue,
    requirePromiseEvidenceForGateTuning:
      requirePromiseEvidenceForGateTuning ?? true,
    requireBehavioralIntentEvidenceForGateTuning,
    requireBehavioralProtocolForGateTuning,
    requireBehavioralAllocationIntegrityForGateTuning,
    sourceEvidence,
    benchmark,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return result;
}

async function readPremiseAppealBenchmarkSamples(
  inputDir: string
): Promise<{
  samples: LoadedRawPremiseAppealBenchmarkSample[];
  requiredGenres: string[];
  requiredTargetReaders: string[];
  minimumPanelSize?: number;
  minimumCommentedResponses?: number;
  minimumSamplesPerGenre?: number;
  minimumSamplesPerTargetReader?: number;
  minimumHoldoutSampleCount?: number;
  minimumUsableHoldoutSampleCount?: number;
  minimumFailingHoldoutSampleCount?: number;
  minimumUsableFailingHoldoutSampleCount?: number;
  minimumBehavioralImpressionCount?: number;
  minimumClickThroughRate?: number;
  minimumFirstChapterOpenRate?: number;
  minimumSaveOrFollowRate?: number;
  minimumBehavioralObservationWindowHours?: number;
  minimumSampleRatioMismatchPValue?: number;
  requirePromiseEvidenceForGateTuning?: boolean;
  requireBehavioralIntentEvidenceForGateTuning?: boolean;
  requireBehavioralProtocolForGateTuning?: boolean;
  requireBehavioralAllocationIntegrityForGateTuning?: boolean;
}> {
  const files = await readJsonFiles(inputDir);
  if (files.length === 0) {
    throw new Error(`No premise appeal benchmark JSON files found in ${inputDir}`);
  }

  const samples: LoadedRawPremiseAppealBenchmarkSample[] = [];
  const requiredGenres: string[] = [];
  const requiredTargetReaders: string[] = [];
  const minimumPanelSizes: Array<number | undefined> = [];
  const minimumCommentedResponses: Array<number | undefined> = [];
  const minimumSamplesPerGenre: Array<number | undefined> = [];
  const minimumSamplesPerTargetReader: Array<number | undefined> = [];
  const minimumHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumUsableHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumFailingHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumUsableFailingHoldoutSampleCounts: Array<number | undefined> = [];
  const minimumBehavioralImpressionCounts: Array<number | undefined> = [];
  const minimumClickThroughRates: Array<number | undefined> = [];
  const minimumFirstChapterOpenRates: Array<number | undefined> = [];
  const minimumSaveOrFollowRates: Array<number | undefined> = [];
  const minimumBehavioralObservationWindowHours: Array<number | undefined> = [];
  const minimumSampleRatioMismatchPValues: Array<number | undefined> = [];
  const requirePromiseEvidenceFlags: boolean[] = [];
  const requireBehavioralIntentEvidenceFlags: boolean[] = [];
  const requireBehavioralProtocolFlags: boolean[] = [];
  const requireBehavioralAllocationIntegrityFlags: boolean[] = [];

  for (const filePath of files) {
    const parsed = await readJson(filePath) as
      | RawPremiseAppealBenchmarkFile
      | RawPremiseAppealBenchmarkSample;
    if (Array.isArray((parsed as RawPremiseAppealBenchmarkFile).samples)) {
      const suite = parsed as RawPremiseAppealBenchmarkFile;
      samples.push(
        ...(suite.samples ?? []).map(sample => ({
          sample,
          defaultMinimumPanelSize: suite.minimum_panel_size,
          defaultMinimumCommentedResponses: suite.minimum_commented_responses,
          defaultMinimumSamplesPerGenre: suite.minimum_samples_per_genre,
          defaultMinimumSamplesPerTargetReader: suite.minimum_samples_per_target_reader,
        }))
      );
      requiredGenres.push(...(suite.required_genres ?? []));
      requiredTargetReaders.push(...(suite.required_target_readers ?? []));
      minimumPanelSizes.push(suite.minimum_panel_size);
      minimumCommentedResponses.push(suite.minimum_commented_responses);
      minimumSamplesPerGenre.push(suite.minimum_samples_per_genre);
      minimumSamplesPerTargetReader.push(suite.minimum_samples_per_target_reader);
      minimumHoldoutSampleCounts.push(suite.minimum_holdout_samples);
      minimumUsableHoldoutSampleCounts.push(suite.minimum_usable_holdout_samples);
      minimumFailingHoldoutSampleCounts.push(suite.minimum_failing_holdout_samples);
      minimumUsableFailingHoldoutSampleCounts.push(
        suite.minimum_usable_failing_holdout_samples
      );
      minimumBehavioralImpressionCounts.push(suite.minimum_behavioral_impressions);
      minimumClickThroughRates.push(suite.minimum_click_through_rate);
      minimumFirstChapterOpenRates.push(suite.minimum_first_chapter_open_rate);
      minimumSaveOrFollowRates.push(suite.minimum_save_or_follow_rate);
      minimumBehavioralObservationWindowHours.push(
        suite.minimum_behavioral_observation_window_hours
      );
      minimumSampleRatioMismatchPValues.push(
        suite.minimum_sample_ratio_mismatch_p_value
      );
      if (typeof suite.require_promise_evidence === 'boolean') {
        requirePromiseEvidenceFlags.push(suite.require_promise_evidence);
      }
      if (typeof suite.require_behavioral_intent_evidence === 'boolean') {
        requireBehavioralIntentEvidenceFlags.push(suite.require_behavioral_intent_evidence);
      }
      if (typeof suite.require_behavioral_protocol === 'boolean') {
        requireBehavioralProtocolFlags.push(suite.require_behavioral_protocol);
      }
      if (typeof suite.require_behavioral_allocation_integrity === 'boolean') {
        requireBehavioralAllocationIntegrityFlags.push(
          suite.require_behavioral_allocation_integrity
        );
      }
    } else {
      samples.push({ sample: parsed as RawPremiseAppealBenchmarkSample });
    }
  }

  if (samples.length === 0) {
    throw new Error(`Premise appeal benchmark files in ${inputDir} did not contain any samples`);
  }

  return {
    samples,
    requiredGenres: uniqueStrings(requiredGenres),
    requiredTargetReaders: uniqueStrings(requiredTargetReaders),
    minimumPanelSize: maxPositiveInteger(minimumPanelSizes),
    minimumCommentedResponses: maxPositiveInteger(minimumCommentedResponses),
    minimumSamplesPerGenre: maxPositiveInteger(minimumSamplesPerGenre),
    minimumSamplesPerTargetReader: maxPositiveInteger(minimumSamplesPerTargetReader),
    minimumHoldoutSampleCount: maxPositiveInteger(minimumHoldoutSampleCounts),
    minimumUsableHoldoutSampleCount: maxPositiveInteger(minimumUsableHoldoutSampleCounts),
    minimumFailingHoldoutSampleCount: maxPositiveInteger(minimumFailingHoldoutSampleCounts),
    minimumUsableFailingHoldoutSampleCount: maxPositiveInteger(
      minimumUsableFailingHoldoutSampleCounts
    ),
    minimumBehavioralImpressionCount: maxPositiveInteger(
      minimumBehavioralImpressionCounts
    ),
    minimumClickThroughRate: maxFiniteRatio(minimumClickThroughRates),
    minimumFirstChapterOpenRate: maxFiniteRatio(minimumFirstChapterOpenRates),
    minimumSaveOrFollowRate: maxFiniteRatio(minimumSaveOrFollowRates),
    minimumBehavioralObservationWindowHours: maxPositiveInteger(
      minimumBehavioralObservationWindowHours
    ),
    minimumSampleRatioMismatchPValue: maxFiniteRatio(
      minimumSampleRatioMismatchPValues
    ),
    requirePromiseEvidenceForGateTuning:
      requirePromiseEvidenceFlags.length === 0
        ? undefined
        : requirePromiseEvidenceFlags.some(Boolean),
    requireBehavioralIntentEvidenceForGateTuning:
      requireBehavioralIntentEvidenceFlags.length === 0
        ? undefined
        : requireBehavioralIntentEvidenceFlags.some(Boolean),
    requireBehavioralProtocolForGateTuning:
      requireBehavioralProtocolFlags.length === 0
        ? undefined
        : requireBehavioralProtocolFlags.some(Boolean),
    requireBehavioralAllocationIntegrityForGateTuning:
      requireBehavioralAllocationIntegrityFlags.length === 0
        ? undefined
        : requireBehavioralAllocationIntegrityFlags.some(Boolean),
  };
}

function normalizeSample(
  design: any,
  sample: RawPremiseAppealBenchmarkSample
): PremiseAppealBenchmarkSample {
  const designPremise = normalizePremise(design?.reader_promise_contract);
  const samplePremise = normalizePremise(sample.premise);
  const premise = samplePremise ?? designPremise;
  const targetReader = sample.target_reader ?? premise?.target_reader;

  return {
    id: sample.id,
    label: sample.label,
    genre: sample.genre,
    targetReader,
    premise,
    calibrationSplit: normalizeCalibrationSplit(sample),
    automatedScore: sample.automated_score,
    expectedAppealing: sample.expected_appealing,
    ratingScale: sample.rating_scale,
    behavioralEvidence: normalizeBehavioralEvidence(sample.behavioral_evidence),
    readerResponses: sample.reader_responses.map(normalizeReaderResponse),
  };
}

function normalizeBehavioralEvidence(
  evidence: RawPremiseBehavioralIntentEvidence | undefined
): PremiseAppealBehavioralIntentEvidence | undefined {
  if (!evidence) return undefined;
  return {
    platform: evidence.platform,
    variantLabel: evidence.variant_label,
    acquisitionSource: evidence.acquisition_source,
    observationWindowHours: evidence.observation_window_hours,
    blindListingTest: evidence.blind_listing_test,
    impressionCount: evidence.impression_count,
    clickCount: evidence.click_count,
    firstChapterOpenCount: evidence.first_chapter_open_count,
    sampleReadStartCount: evidence.sample_read_start_count,
    libraryAddCount: evidence.library_add_count,
    followCount: evidence.follow_count,
    paidPreviewClickCount: evidence.paid_preview_click_count,
    benchmarkClickThroughRate: evidence.benchmark_click_through_rate,
    benchmarkFirstChapterOpenRate: evidence.benchmark_first_chapter_open_rate,
    benchmarkSaveOrFollowRate: evidence.benchmark_save_or_follow_rate,
    expectedVariantAllocationRatio: evidence.expected_variant_allocation_ratio,
    observedVariantAllocationRatio: evidence.observed_variant_allocation_ratio,
    sampleRatioMismatchPValue: evidence.sample_ratio_mismatch_p_value,
  };
}

function normalizeCalibrationSplit(
  sample: RawPremiseAppealBenchmarkSample
): PremiseAppealCalibrationSplit | undefined {
  if (sample.calibration_split === undefined) return undefined;
  if (
    sample.calibration_split === 'calibration'
    || sample.calibration_split === 'validation'
    || sample.calibration_split === 'holdout'
  ) {
    return sample.calibration_split;
  }

  throw new Error(
    `Premise appeal benchmark sample ${sample.id} has invalid calibration_split: ${sample.calibration_split}`
  );
}

function normalizePremise(value: any): PremiseAppealPromise | undefined {
  if (!value || typeof value !== 'object') return undefined;
  return value as PremiseAppealPromise;
}

function normalizeReaderResponse(
  response: RawPremiseReaderResponse
): PremiseAppealReaderResponse {
  return {
    readerId: response.reader_id,
    targetReaderFit: response.target_reader_fit,
    ratingScale: response.rating_scale,
    ratings: response.ratings,
    wouldRead: response.would_read,
    wouldReadScore: response.would_read_score,
    comment: response.comment,
    confusionPoints: response.confusion_points,
    attractiveElements: response.attractive_elements,
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

function maxFiniteRatio(values: Array<number | undefined>): number | undefined {
  const ratios = values.filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
  );
  return ratios.length > 0 ? Math.max(...ratios) : undefined;
}
