/**
 * Masterpiece Readiness
 *
 * Aggregates project benchmark reports into one readiness view. Individual
 * benchmarks still own their scoring; this layer only answers whether the
 * evidence set is broad enough to trust the system for high-stakes drafting.
 *
 * @module quality/masterpiece-readiness
 */

export type MasterpieceReadinessAreaId =
  | 'premise-appeal'
  | 'engagement'
  | 'series-retention'
  | 'character-relationship'
  | 'long-form-consistency'
  | 'prose-taste'
  | 'reader-response';

export type MasterpieceReadinessStatus =
  | 'ready'
  | 'needs-evidence'
  | 'at-risk'
  | 'missing';

export interface MasterpieceReadinessOptions {
  minimumOverallScore?: number;
  areas?: MasterpieceReadinessAreaConfig[];
}

export interface MasterpieceReadinessAreaConfig {
  id: MasterpieceReadinessAreaId;
  label?: string;
  weight?: number;
  required?: boolean;
}

export interface MasterpieceReadinessAreaInput {
  id: MasterpieceReadinessAreaId;
  report?: unknown;
  path?: string;
  freshness?: MasterpieceReadinessFreshness;
}

export interface MasterpieceReadinessFreshness {
  stale: boolean;
  reportModifiedAt?: string;
  newestSourceModifiedAt?: string;
  newestSourcePath?: string;
  sourcePathCount: number;
  sourceGroups?: MasterpieceReadinessSourceGroup[];
  sourceDigest?: string;
  recordedSourceDigest?: string;
  sourceEvidenceStatus?: 'no-sources' | 'not-recorded' | 'matched' | 'mismatch';
  changedSourcePaths?: string[];
}

export interface MasterpieceReadinessSourceGroup {
  id: string;
  label: string;
  pathCount: number;
  required: boolean;
  paths?: string[];
}

export interface MasterpieceReadinessGap {
  area: MasterpieceReadinessAreaId;
  code: string;
  severity: 'critical' | 'major' | 'minor';
  message: string;
}

export type MasterpieceReadinessActionPriority =
  | 'critical'
  | 'major'
  | 'minor';

export interface MasterpieceReadinessActionItem {
  area: MasterpieceReadinessAreaId;
  id: string;
  priority: MasterpieceReadinessActionPriority;
  target: string;
  currentValue?: number | string;
  requiredValue?: number | string;
  sampleIds: string[];
  commands: string[];
  action: string;
  rationale: string;
}

export interface MasterpieceReadinessAreaResult {
  id: MasterpieceReadinessAreaId;
  label: string;
  path?: string;
  status: MasterpieceReadinessStatus;
  score: number;
  weight: number;
  required: boolean;
  present: boolean;
  readyForTuning: boolean;
  totalSamples?: number;
  failedSamples?: number;
  accuracy?: number;
  freshness?: MasterpieceReadinessFreshness;
  gaps: MasterpieceReadinessGap[];
  actionPlan: MasterpieceReadinessActionItem[];
  recommendations: string[];
}

export interface MasterpieceReadinessResult {
  overallScore: number;
  minimumOverallScore: number;
  passed: boolean;
  status: MasterpieceReadinessStatus;
  missingRequiredAreas: MasterpieceReadinessAreaId[];
  atRiskAreas: MasterpieceReadinessAreaId[];
  needsEvidenceAreas: MasterpieceReadinessAreaId[];
  criticalGapCount: number;
  majorGapCount: number;
  minorGapCount: number;
  gaps: MasterpieceReadinessGap[];
  actionPlan: MasterpieceReadinessActionItem[];
  recommendations: string[];
  areaResults: MasterpieceReadinessAreaResult[];
}

interface NormalizedBenchmarkPayload {
  total?: number;
  failed?: number;
  accuracy?: number;
  calibrationScore?: number;
  meanAbsoluteError?: number;
  meanSignedGap?: number;
  readyForGateTuning?: boolean;
  readyForStyleTuning?: boolean;
  recommendations?: string[];
  [key: string]: unknown;
}

const DEFAULT_MINIMUM_OVERALL_SCORE = 98;
const MINIMUM_AREA_SCORE_FOR_READINESS = DEFAULT_MINIMUM_OVERALL_SCORE;
const MAXIMUM_READER_RESPONSE_MEAN_ABSOLUTE_ERROR = 2.5;
const MINIMUM_CONSISTENCY_CHAPTERS_FOR_READINESS = 3;
const CHAPTER_SOURCE_PATH_PATTERN = /(?:^|\/)chapter[_-]?0*(\d+)\.(json|md)$/i;
const REQUIRED_CONSISTENCY_DOMAINS = [
  'character',
  'timeline',
  'setting',
  'factual',
  'plot_logic',
] as const;

const DEFAULT_AREAS: MasterpieceReadinessAreaConfig[] = [
  { id: 'premise-appeal', label: 'Premise appeal', weight: 15, required: true },
  { id: 'engagement', label: 'Chapter engagement', weight: 18, required: true },
  { id: 'series-retention', label: 'Long-series retention', weight: 16, required: true },
  { id: 'character-relationship', label: 'Character/relationship investment', weight: 16, required: true },
  { id: 'long-form-consistency', label: 'Long-form consistency', weight: 14, required: true },
  { id: 'prose-taste', label: 'Prose taste calibration', weight: 17, required: true },
  { id: 'reader-response', label: 'Reader response calibration', weight: 18, required: true },
];

const FAILURE_COUNT_FIELDS = [
  'falsePositiveCount',
  'falseNegativeCount',
  'automatedFalsePositiveCount',
  'automatedFalseNegativeCount',
  'behavioralIntentFalsePositiveCount',
  'readerLabelMismatchCount',
  'missingIssueCount',
  'forbiddenIssueCount',
  'positiveQualityConflictCount',
  'scoreOutOfRangeCount',
  'splitLeakageCount',
  'retentionDropCount',
  'funnelDropCount',
  'hookStallCount',
  'repetitiveRewardPatternCount',
  'repetitiveEmotionalPatternCount',
  'revisionRegressionCount',
  'criticalConsistencyIssueCount',
  'majorConsistencyIssueCount',
];

const CALIBRATION_DRIFT_COUNT_FIELDS = [
  'overestimateCount',
  'underestimateCount',
];

const WEAK_EVIDENCE_COUNT_FIELDS = [
  'insufficientEvidenceCount',
  'weakReaderAppealCount',
  'lowBehavioralIntentEvidenceCount',
  'weakBehavioralProtocolCount',
  'weakBehavioralAllocationCount',
  'weakPromiseEvidenceCount',
  'weakFocusEvidenceCount',
  'weakReaderInvestmentCount',
  'weakReaderRetentionCount',
  'weakDimensionCount',
  'weakFunnelEvidenceCount',
  'weakHookProgressEvidenceCount',
  'weakStyleFrictionAnnotationCount',
  'missingStyleFrictionAnnotationCount',
  'weakStyleHighlightAnnotationCount',
  'missingStyleHighlightAnnotationCount',
  'weakStyleHighlightQualityDiversityCount',
  'weakStyleFingerprintCount',
  'weakAuthorialStyleDriftCount',
  'lowReliabilityCount',
  'lowAnnotationReliabilityCount',
  'lowActionabilityCount',
  'lowHumanReaderEvidenceCount',
  'lowResponseDataQualityCount',
  'lowRevisionOutcomeEvidenceCount',
  'lowEvidenceQualityCount',
  'lowRetentionEvidenceCount',
  'lowDropOffLocalizationEvidenceCount',
  'lowSceneRecallEvidenceCount',
  'lowTensionTraceEvidenceCount',
  'lowNarrativeForecastEvidenceCount',
  'lowLineQuoteEvidenceCount',
  'lowPayoffFairnessEvidenceCount',
  'lowAdvocacyEvidenceCount',
  'lowDurableEngagementEvidenceCount',
  'lowContinuationBehaviorEvidenceCount',
  'lowResonanceEvidenceCount',
  'lowDelayedMemoryEvidenceCount',
  'lowConsensusCount',
  'lowConfidenceCount',
  'lowRepresentativenessCount',
  'lowProtocolQualityCount',
  'missingComparativePreferenceCount',
  'narrowCohortCount',
  'weakPanelProtocolCount',
  'weakComparativePreferenceCount',
  'minorConsistencyIssueCount',
];

export function evaluateMasterpieceReadiness(
  inputs: MasterpieceReadinessAreaInput[],
  options: MasterpieceReadinessOptions = {}
): MasterpieceReadinessResult {
  const minimumOverallScore = options.minimumOverallScore ?? DEFAULT_MINIMUM_OVERALL_SCORE;
  const areaConfigs = normalizeAreaConfigs(options.areas);
  const inputByArea = new Map(inputs.map(input => [input.id, input]));
  const areaResults = areaConfigs.map(config => evaluateArea(config, inputByArea.get(config.id)));
  const totalWeight = areaResults.reduce((sum, result) => sum + result.weight, 0) || 1;
  const overallScore = roundScore(
    areaResults.reduce((sum, result) => sum + result.score * result.weight, 0) / totalWeight
  );
  const gaps = areaResults.flatMap(result => result.gaps);
  const actionPlan = sortActionPlan(areaResults.flatMap(result => result.actionPlan));
  const criticalGapCount = gaps.filter(gap => gap.severity === 'critical').length;
  const majorGapCount = gaps.filter(gap => gap.severity === 'major').length;
  const minorGapCount = gaps.filter(gap => gap.severity === 'minor').length;
  const missingRequiredAreas = areaResults
    .filter(result => result.required && result.status === 'missing')
    .map(result => result.id);
  const atRiskAreas = areaResults
    .filter(result => result.status === 'at-risk')
    .map(result => result.id);
  const needsEvidenceAreas = areaResults
    .filter(result => result.status === 'needs-evidence')
    .map(result => result.id);
  const passed =
    overallScore >= minimumOverallScore &&
    criticalGapCount === 0 &&
    missingRequiredAreas.length === 0 &&
    atRiskAreas.length === 0 &&
    needsEvidenceAreas.length === 0;

  return {
    overallScore,
    minimumOverallScore,
    passed,
    status: passed ? 'ready' : deriveOverallStatus(missingRequiredAreas, atRiskAreas, needsEvidenceAreas),
    missingRequiredAreas,
    atRiskAreas,
    needsEvidenceAreas,
    criticalGapCount,
    majorGapCount,
    minorGapCount,
    gaps,
    actionPlan,
    recommendations: buildOverallRecommendations(areaResults, gaps, minimumOverallScore),
    areaResults,
  };
}

function normalizeAreaConfigs(
  configs: MasterpieceReadinessAreaConfig[] | undefined
): MasterpieceReadinessAreaConfig[] {
  if (!configs || configs.length === 0) {
    return DEFAULT_AREAS;
  }

  const defaults = new Map(DEFAULT_AREAS.map(config => [config.id, config]));
  const seen = new Set<MasterpieceReadinessAreaId>();
  return configs.map(config => {
    if (seen.has(config.id)) {
      throw new Error(`Duplicate masterpiece readiness area: ${config.id}`);
    }
    seen.add(config.id);
    const fallback = defaults.get(config.id);
    return {
      id: config.id,
      label: config.label ?? fallback?.label ?? config.id,
      weight: normalizeWeight(config.weight ?? fallback?.weight),
      required: config.required ?? fallback?.required ?? true,
    };
  });
}

function evaluateArea(
  config: MasterpieceReadinessAreaConfig,
  input: MasterpieceReadinessAreaInput | undefined
): MasterpieceReadinessAreaResult {
  const label = config.label ?? config.id;
  const weight = normalizeWeight(config.weight);
  const required = config.required ?? true;

  if (!input?.report) {
    const gap = buildGap(
      config.id,
      'missing-report',
      required ? 'critical' : 'major',
      `${label} report is missing. Run the matching benchmark/calibration CLI before trusting masterpiece readiness.`
    );
    return {
      id: config.id,
      label,
      path: input?.path,
      status: 'missing',
      score: 0,
      weight,
      required,
      present: false,
      readyForTuning: false,
      gaps: [gap],
      actionPlan: [buildGapActionItem(config.id, gap)],
      recommendations: [gap.message],
    };
  }

  const payload = normalizeBenchmarkPayload(input.report, config.id);
  const gaps = collectAreaGaps(config.id, label, payload, input.freshness);
  const actionPlan = buildAreaActionPlan(config.id, payload, gaps);
  const readyForTuning = payload.readyForGateTuning === true || payload.readyForStyleTuning === true;
  const score = scoreArea(payload, gaps, readyForTuning);
  const status = deriveAreaStatus(payload, gaps, readyForTuning);

  return {
    id: config.id,
    label,
    path: input.path,
    status,
    score,
    weight,
    required,
    present: true,
    readyForTuning,
    totalSamples: numberValue(payload.total),
    failedSamples: numberValue(payload.failed),
    accuracy: numberValue(payload.accuracy),
    freshness: input.freshness,
    gaps,
    actionPlan,
    recommendations: normalizeRecommendations(payload.recommendations, gaps),
  };
}

function normalizeBenchmarkPayload(
  report: unknown,
  area: MasterpieceReadinessAreaId
): NormalizedBenchmarkPayload {
  if (!isRecord(report)) {
    return {};
  }

  const nested = report.benchmark ?? report.calibration;
  if (isRecord(nested)) {
    return normalizeNestedBenchmarkPayload(nested);
  }

  if (area === 'long-form-consistency') {
    return normalizeConsistencyReportPayload(report);
  }

  return report as NormalizedBenchmarkPayload;
}

function normalizeNestedBenchmarkPayload(nested: Record<string, unknown>): NormalizedBenchmarkPayload {
  const payload = { ...nested } as NormalizedBenchmarkPayload;
  const calibrationScore = numberValue(payload.calibrationScore);
  if (numberValue(payload.accuracy) === undefined && calibrationScore !== undefined) {
    payload.accuracy = clampScore(calibrationScore) / 100;
  }
  return payload;
}

function normalizeConsistencyReportPayload(report: Record<string, unknown>): NormalizedBenchmarkPayload {
  const issues = extractConsistencyIssues(report);
  const totalIssues = numberValue(report.total_issues)
    ?? numberValue(report.totalIssues)
    ?? issues.length;
  const explicitCriticalIssues = numberValue(report.critical_issues)
    ?? numberValue(report.criticalIssues);
  const criticalIssueCount = explicitCriticalIssues ?? issues.filter(issue => issue.severity === 'critical').length;
  const knownMajorIssueCount = issues.filter(issue => issue.severity === 'major').length;
  const knownMinorIssueCount = issues.filter(issue => issue.severity === 'minor').length;
  const unknownIssueCount = Math.max(0, totalIssues - criticalIssueCount - knownMajorIssueCount - knownMinorIssueCount);
  const majorIssueCount = knownMajorIssueCount + unknownIssueCount;
  const minorIssueCount = knownMinorIssueCount;
  const chapterCount = inferConsistencyChapterCount(report);
  const claimedConsistencyChapterIds = inferConsistencyChapterIds(report);
  const missingRequiredConsistencyDomains = getMissingConsistencyDomains(report);
  const underSampledConsistencyChapters = chapterCount < MINIMUM_CONSISTENCY_CHAPTERS_FOR_READINESS;
  const blockingIssueCount = criticalIssueCount + majorIssueCount + minorIssueCount;
  const readyForGateTuning = (
    chapterCount >= MINIMUM_CONSISTENCY_CHAPTERS_FOR_READINESS
    && missingRequiredConsistencyDomains.length === 0
    && blockingIssueCount === 0
  );
  const weightedIssuePenalty = (
    criticalIssueCount * 1
    + majorIssueCount * 0.5
    + minorIssueCount * 0.1
  );

  return {
    total: chapterCount,
    failed: undefined,
    accuracy: chapterCount > 0
      ? Math.max(0, 1 - (weightedIssuePenalty / Math.max(chapterCount, 1)))
      : 0,
    readyForGateTuning,
    criticalConsistencyIssueCount: criticalIssueCount,
    majorConsistencyIssueCount: majorIssueCount,
    minorConsistencyIssueCount: minorIssueCount,
    claimedConsistencyChapterIds,
    missingRequiredConsistencyDomains,
    underSampledConsistencyChapters,
    recommendations: normalizeConsistencyRecommendations(report, {
      criticalIssueCount,
      majorIssueCount,
      minorIssueCount,
      chapterCount,
      missingRequiredConsistencyDomains,
    }),
  };
}

function extractConsistencyIssues(report: Record<string, unknown>): Array<{ severity: 'critical' | 'major' | 'minor' }> {
  const rawIssues = Array.isArray(report.issues)
    ? report.issues
    : isRecord(report.consistency_report) && Array.isArray(report.consistency_report.issues)
      ? report.consistency_report.issues
      : [];

  return rawIssues
    .filter(isRecord)
    .map(issue => ({
      severity: normalizeConsistencySeverity(issue.severity),
    }));
}

function normalizeConsistencySeverity(severity: unknown): 'critical' | 'major' | 'minor' {
  if (severity === 'critical') return 'critical';
  if (severity === 'major' || severity === 'moderate' || severity === 'important') return 'major';
  return 'minor';
}

function inferConsistencyChapterCount(report: Record<string, unknown>): number {
  const chapterCount = numberValue(report.chapter_count) ?? numberValue(report.chapterCount);
  if (chapterCount !== undefined) {
    return Math.max(0, Math.floor(chapterCount));
  }

  const chaptersAnalyzed = report.chapters_analyzed ?? report.chaptersAnalyzed;
  if (Array.isArray(chaptersAnalyzed)) {
    return new Set(chaptersAnalyzed.filter(item => typeof item === 'number' || typeof item === 'string')).size;
  }

  const range = report.chapter_range ?? report.chapterRange;
  if (isRecord(range)) {
    const start = numberValue(range.start);
    const end = numberValue(range.end);
    if (start !== undefined && end !== undefined && end >= start) {
      return Math.floor(end - start + 1);
    }
  }

  return 0;
}

function inferConsistencyChapterIds(report: Record<string, unknown>): string[] | undefined {
  const chaptersAnalyzed = report.chapters_analyzed ?? report.chaptersAnalyzed;
  if (Array.isArray(chaptersAnalyzed)) {
    const chapterIds = chaptersAnalyzed
      .map(normalizeChapterId)
      .filter((chapterId): chapterId is string => chapterId !== undefined);
    return Array.from(new Set(chapterIds));
  }

  const range = report.chapter_range ?? report.chapterRange;
  if (isRecord(range)) {
    const start = numberValue(range.start);
    const end = numberValue(range.end);
    if (start !== undefined && end !== undefined && end >= start) {
      const startId = Math.floor(start);
      const endId = Math.floor(end);
      const chapterIds: string[] = [];
      for (let chapterId = startId; chapterId <= endId; chapterId += 1) {
        chapterIds.push(String(chapterId));
      }
      return chapterIds;
    }
  }

  return undefined;
}

function getMissingConsistencyDomains(report: Record<string, unknown>): string[] {
  const covered = new Set<string>();
  collectConsistencyDomains(report.domain_coverage, covered);
  collectConsistencyDomains(report.domainCoverage, covered);

  if (isRecord(report.consistency_report)) {
    collectConsistencyDomains({
      character: report.consistency_report.character_consistency,
      timeline: report.consistency_report.timeline_consistency,
      setting: report.consistency_report.setting_consistency,
      factual: report.consistency_report.factual_consistency,
      plot_logic: report.consistency_report.plot_logic,
    }, covered);
  }

  if (isRecord(report.summary)) {
    collectConsistencyDomains({
      character: report.summary.character_issues,
      timeline: report.summary.timeline_issues,
      setting: report.summary.world_issues,
      factual: report.summary.factual_issues,
      plot_logic: report.summary.plot_logic_issues ?? report.summary.foreshadowing_issues,
    }, covered);
  }

  return REQUIRED_CONSISTENCY_DOMAINS.filter(domain => !covered.has(domain));
}

function collectConsistencyDomains(value: unknown, covered: Set<string>): void {
  if (!isRecord(value)) return;
  for (const [rawDomain, rawStatus] of Object.entries(value)) {
    if (!isConsistencyDomainCovered(rawStatus)) continue;
    const domain = normalizeConsistencyDomain(rawDomain);
    if (domain) covered.add(domain);
  }
}

function normalizeConsistencyDomain(domain: string): typeof REQUIRED_CONSISTENCY_DOMAINS[number] | undefined {
  const normalized = domain.replace(/-/g, '_').toLowerCase();
  if (normalized.includes('character')) return 'character';
  if (normalized.includes('timeline') || normalized.includes('time')) return 'timeline';
  if (normalized.includes('setting') || normalized.includes('world')) return 'setting';
  if (normalized.includes('factual') || normalized.includes('fact')) return 'factual';
  if (normalized.includes('plot') || normalized.includes('causal') || normalized.includes('foreshadow')) return 'plot_logic';
  return undefined;
}

function isConsistencyDomainCovered(status: unknown): boolean {
  if (status === true) return true;
  if (typeof status === 'number') return Number.isFinite(status) && status >= 0;
  if (isRecord(status)) return true;
  if (typeof status === 'string') {
    return ['checked', 'pass', 'passed', 'clear', 'no_issues', 'no-issues'].includes(status.toLowerCase());
  }
  return false;
}

function normalizeConsistencyRecommendations(
  report: Record<string, unknown>,
  summary: {
    criticalIssueCount: number;
    majorIssueCount: number;
    minorIssueCount: number;
    chapterCount: number;
    missingRequiredConsistencyDomains: string[];
  }
): string[] {
  const recommendations = new Set<string>();
  const actionableFixes = report.actionable_fixes ?? report.actionableFixes;
  if (Array.isArray(actionableFixes)) {
    actionableFixes
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .forEach(item => recommendations.add(item));
  }
  if (summary.criticalIssueCount + summary.majorIssueCount > 0) {
    recommendations.add('Resolve critical and major consistency issues before claiming masterpiece readiness.');
  }
  if (summary.minorIssueCount > 0) {
    recommendations.add('Clean up minor continuity issues before using the report as 98+ readiness evidence.');
  }
  if (summary.chapterCount < MINIMUM_CONSISTENCY_CHAPTERS_FOR_READINESS) {
    recommendations.add(`Run consistency verification across at least ${MINIMUM_CONSISTENCY_CHAPTERS_FOR_READINESS} chapters.`);
  }
  if (summary.missingRequiredConsistencyDomains.length > 0) {
    recommendations.add(`Cover all five consistency domains: ${summary.missingRequiredConsistencyDomains.join(', ')} missing.`);
  }
  return Array.from(recommendations);
}

function collectAreaGaps(
  area: MasterpieceReadinessAreaId,
  label: string,
  payload: NormalizedBenchmarkPayload,
  freshness: MasterpieceReadinessFreshness | undefined
): MasterpieceReadinessGap[] {
  const gaps: MasterpieceReadinessGap[] = [];
  if (freshness && (freshness.sourcePathCount < 1 || freshness.sourceEvidenceStatus === 'no-sources')) {
    gaps.push(buildGap(
      area,
      'no-source-evidence',
      'critical',
      `${label} has no source evidence files. Add benchmark/calibration source samples and regenerate the report before claiming 98+ readiness.`
    ));
  }

  for (const sourceGroup of freshness?.sourceGroups ?? []) {
    if (sourceGroup.required && sourceGroup.pathCount < 1) {
      gaps.push(buildGap(
        area,
        `missing-source-group-${toKebab(sourceGroup.id)}`,
        'critical',
        `${label} is missing required source evidence group "${sourceGroup.label}". Add files for this group and regenerate the report before claiming 98+ readiness.`
      ));
    }
  }

  if (area === 'long-form-consistency') {
    const claimedChapters = numberValue(payload.total);
    const claimedChapterIds = stringArrayValue(payload.claimedConsistencyChapterIds);
    const chapterGroup = freshness?.sourceGroups?.find(sourceGroup => sourceGroup.id === 'chapters');
    const sourceChapterCoverage = collectChapterSourceCoverage(chapterGroup);
    if (claimedChapterIds.length > 0 && sourceChapterCoverage !== undefined) {
      const missingChapterIds = missingChapterIdsFrom(claimedChapterIds, sourceChapterCoverage.chapterIds);
      if (missingChapterIds.length > 0) {
        gaps.push(buildGap(
          area,
          'consistency-source-chapter-id-mismatch',
          'critical',
          `${label} claims analyzed chapter id(s) ${claimedChapterIds.join(', ')}, but chapter source evidence is missing ${missingChapterIds.join(', ')}. Regenerate consistency evidence from the claimed chapter files before claiming 98+ readiness.`
        ));
      }

      const missingManuscriptIds = missingChapterIdsFrom(claimedChapterIds, sourceChapterCoverage.manuscriptIds);
      if (missingManuscriptIds.length > 0) {
        gaps.push(buildGap(
          area,
          'consistency-source-manuscript-id-mismatch',
          'critical',
          `${label} claims analyzed chapter id(s) ${claimedChapterIds.join(', ')}, but chapter manuscript evidence is missing ${missingManuscriptIds.join(', ')}. Add chapter_NNN.md manuscripts for the claimed chapters and regenerate consistency evidence before claiming 98+ readiness.`
        ));
      }

      const missingMetadataIds = missingChapterIdsFrom(claimedChapterIds, sourceChapterCoverage.metadataIds);
      if (missingMetadataIds.length > 0) {
        gaps.push(buildGap(
          area,
          'consistency-source-metadata-id-mismatch',
          'critical',
          `${label} claims analyzed chapter id(s) ${claimedChapterIds.join(', ')}, but chapter metadata evidence is missing ${missingMetadataIds.join(', ')}. Add chapter_NNN.json metadata for the claimed chapters and regenerate consistency evidence before claiming 98+ readiness.`
        ));
      }
    } else {
      if (
        claimedChapters !== undefined
        && sourceChapterCoverage !== undefined
        && claimedChapters > sourceChapterCoverage.chapterCount
      ) {
        gaps.push(buildGap(
          area,
          'consistency-source-chapter-mismatch',
          'critical',
          `${label} claims ${claimedChapters} analyzed chapter(s), but chapter source evidence only contains ${sourceChapterCoverage.chapterCount} chapter(s). Regenerate consistency evidence from actual chapter files before claiming 98+ readiness.`
        ));
      }
      if (
        claimedChapters !== undefined
        && sourceChapterCoverage !== undefined
        && claimedChapters <= sourceChapterCoverage.chapterCount
        && claimedChapters > sourceChapterCoverage.manuscriptCount
      ) {
        gaps.push(buildGap(
          area,
          'consistency-source-manuscript-mismatch',
          'critical',
          `${label} claims ${claimedChapters} analyzed chapter(s), but chapter source evidence only contains ${sourceChapterCoverage.manuscriptCount} chapter manuscript file(s). Add chapter_NNN.md manuscripts and regenerate consistency evidence before claiming 98+ readiness.`
        ));
      }
      if (
        claimedChapters !== undefined
        && sourceChapterCoverage !== undefined
        && claimedChapters <= sourceChapterCoverage.chapterCount
        && claimedChapters > sourceChapterCoverage.metadataCount
      ) {
        gaps.push(buildGap(
          area,
          'consistency-source-metadata-mismatch',
          'critical',
          `${label} claims ${claimedChapters} analyzed chapter(s), but chapter source evidence only contains ${sourceChapterCoverage.metadataCount} chapter metadata file(s). Add chapter_NNN.json metadata and regenerate consistency evidence before claiming 98+ readiness.`
        ));
      }
    }
  }

  if (freshness?.stale) {
    const source = freshness.changedSourcePaths?.length
      ? ` Changed source: ${freshness.changedSourcePaths.join(', ')}.`
      : freshness.newestSourcePath
        ? ` Newest source: ${freshness.newestSourcePath}.`
        : '';
    const reason = freshness.sourceEvidenceStatus === 'mismatch'
      ? 'does not match its recorded source evidence digest'
      : freshness.sourceEvidenceStatus === 'not-recorded'
        ? 'does not record source evidence provenance'
        : 'is older than its source evidence';
    gaps.push(buildGap(
      area,
      'stale-report',
      'critical',
      `${label} report ${reason}.${source}`
    ));
  }

  const total = numberValue(payload.total);
  if (total === undefined || total < 1) {
    gaps.push(buildGap(area, 'no-samples', 'critical', `${label} has no benchmark samples.`));
  }

  const failed = numberValue(payload.failed);
  if (failed !== undefined && failed > 0) {
    gaps.push(buildGap(area, 'failed-samples', 'critical', `${label} has ${failed} failing sample(s).`));
  }

  const calibrationScore = numberValue(payload.calibrationScore);
  if (calibrationScore !== undefined && calibrationScore < MINIMUM_AREA_SCORE_FOR_READINESS) {
    gaps.push(buildGap(
      area,
      'low-calibration-score',
      'major',
      `${label} calibration score is ${roundScore(calibrationScore)}, below ${MINIMUM_AREA_SCORE_FOR_READINESS} required for 98+ readiness.`
    ));
  }

  const meanAbsoluteError = numberValue(payload.meanAbsoluteError);
  if (meanAbsoluteError !== undefined && meanAbsoluteError > MAXIMUM_READER_RESPONSE_MEAN_ABSOLUTE_ERROR) {
    gaps.push(buildGap(
      area,
      'high-mean-absolute-error',
      'major',
      `${label} mean absolute error is ${roundScore(meanAbsoluteError)}, above ${MAXIMUM_READER_RESPONSE_MEAN_ABSOLUTE_ERROR} allowed for 98+ readiness.`
    ));
  }

  const accuracy = numberValue(payload.accuracy);
  if (
    accuracy !== undefined
    && calibrationScore === undefined
    && accuracy < MINIMUM_AREA_SCORE_FOR_READINESS / 100
  ) {
    gaps.push(buildGap(
      area,
      'low-readiness-accuracy',
      'major',
      `${label} accuracy is ${roundScore(accuracy * 100)}, below ${MINIMUM_AREA_SCORE_FOR_READINESS} required for 98+ readiness.`
    ));
  }

  for (const field of FAILURE_COUNT_FIELDS) {
    const count = numberValue(payload[field]);
    if (count !== undefined && count > 0) {
      gaps.push(buildGap(area, toKebab(field), 'critical', `${label} reports ${count} ${humanizeField(field)}.`));
    }
  }

  for (const field of CALIBRATION_DRIFT_COUNT_FIELDS) {
    const count = numberValue(payload[field]);
    if (count !== undefined && count > 0) {
      gaps.push(buildGap(area, toKebab(field), 'major', `${label} reports ${count} ${humanizeField(field)}.`));
    }
  }

  for (const field of WEAK_EVIDENCE_COUNT_FIELDS) {
    const count = numberValue(payload[field]);
    if (count !== undefined && count > 0) {
      gaps.push(buildGap(area, toKebab(field), 'major', `${label} has ${count} ${humanizeField(field)}.`));
    }
  }

  for (const [field, value] of Object.entries(payload)) {
    if (field.startsWith('missingRequired') && Array.isArray(value) && value.length > 0) {
      gaps.push(buildGap(
        area,
        toKebab(field),
        'major',
        `${label} is missing required coverage for ${humanizeField(field)}: ${value.join(', ')}.`
      ));
    }
    if (field.startsWith('underSampled')) {
      if (value === true) {
        gaps.push(buildGap(area, toKebab(field), 'major', `${label} has under-sampled evidence: ${humanizeField(field)}.`));
      } else if (Array.isArray(value) && value.length > 0) {
        gaps.push(buildGap(
          area,
          toKebab(field),
          'major',
          `${label} has under-sampled evidence for ${humanizeField(field)}: ${value.join(', ')}.`
        ));
      }
    }
  }

  if (payload.readyForGateTuning === false || payload.readyForStyleTuning === false) {
    gaps.push(buildGap(
      area,
      'not-ready-for-tuning',
      'major',
      `${label} is not ready for gate/style threshold tuning.`
    ));
  }

  return dedupeGaps(gaps);
}

function collectChapterSourceCoverage(
  chapterGroup: MasterpieceReadinessSourceGroup | undefined
): {
  chapterIds: Set<string>;
  manuscriptIds: Set<string>;
  metadataIds: Set<string>;
  chapterCount: number;
  manuscriptCount: number;
  metadataCount: number;
} | undefined {
  if (!chapterGroup?.paths) {
    return undefined;
  }

  const chapterIds = new Set<string>();
  const manuscriptIds = new Set<string>();
  const metadataIds = new Set<string>();
  for (const sourcePath of chapterGroup.paths) {
    const normalizedPath = sourcePath.replace(/\\/g, '/');
    const match = normalizedPath.match(CHAPTER_SOURCE_PATH_PATTERN);
    if (match) {
      const chapterId = String(Number(match[1]));
      chapterIds.add(chapterId);
      if (match[2].toLowerCase() === 'md') {
        manuscriptIds.add(chapterId);
      } else {
        metadataIds.add(chapterId);
      }
    }
  }
  return {
    chapterIds,
    manuscriptIds,
    metadataIds,
    chapterCount: chapterIds.size,
    manuscriptCount: manuscriptIds.size,
    metadataCount: metadataIds.size,
  };
}

function missingChapterIdsFrom(claimedChapterIds: string[], sourceChapterIds: Set<string>): string[] {
  return claimedChapterIds.filter(chapterId => !sourceChapterIds.has(chapterId));
}

function scoreArea(
  payload: NormalizedBenchmarkPayload,
  gaps: MasterpieceReadinessGap[],
  readyForTuning: boolean
): number {
  if ((numberValue(payload.total) ?? 0) < 1) {
    return 0;
  }

  let score = readyForTuning ? 100 : 84;
  const accuracy = numberValue(payload.accuracy);
  if (accuracy !== undefined) {
    score = Math.min(score, Math.round(accuracy * 100));
  }

  for (const gap of gaps) {
    if (gap.severity === 'critical') score -= 12;
    if (gap.severity === 'major') score -= 5;
    if (gap.severity === 'minor') score -= 2;
  }

  return clampScore(score);
}

function deriveAreaStatus(
  payload: NormalizedBenchmarkPayload,
  gaps: MasterpieceReadinessGap[],
  readyForTuning: boolean
): MasterpieceReadinessStatus {
  if ((numberValue(payload.total) ?? 0) < 1) {
    return 'missing';
  }
  if (gaps.some(gap => gap.severity === 'critical')) {
    return 'at-risk';
  }
  if (!readyForTuning || gaps.some(gap => gap.severity === 'major')) {
    return 'needs-evidence';
  }
  return 'ready';
}

function deriveOverallStatus(
  missingRequiredAreas: MasterpieceReadinessAreaId[],
  atRiskAreas: MasterpieceReadinessAreaId[],
  needsEvidenceAreas: MasterpieceReadinessAreaId[]
): MasterpieceReadinessStatus {
  if (missingRequiredAreas.length > 0) return 'missing';
  if (atRiskAreas.length > 0) return 'at-risk';
  if (needsEvidenceAreas.length > 0) return 'needs-evidence';
  return 'ready';
}

function buildOverallRecommendations(
  areaResults: MasterpieceReadinessAreaResult[],
  gaps: MasterpieceReadinessGap[],
  minimumOverallScore: number
): string[] {
  const recommendations = new Set<string>();
  const missing = areaResults.filter(result => result.status === 'missing').map(result => result.label);
  const atRisk = areaResults.filter(result => result.status === 'at-risk').map(result => result.label);
  const needsEvidence = areaResults.filter(result => result.status === 'needs-evidence').map(result => result.label);

  if (missing.length > 0) {
    recommendations.add(`Run missing benchmark/calibration reports: ${missing.join(', ')}.`);
  }
  if (atRisk.length > 0) {
    recommendations.add(`Fix failing or contradictory benchmark samples before trusting automated gates: ${atRisk.join(', ')}.`);
  }
  if (needsEvidence.length > 0) {
    recommendations.add(`Collect broader holdout, polarity, reader-panel, and annotation evidence for: ${needsEvidence.join(', ')}.`);
  }
  if (gaps.length > 0) {
    recommendations.add(`Resolve ${gaps.length} readiness gap(s) before claiming a ${minimumOverallScore}+ masterpiece-ready system.`);
  }

  return Array.from(recommendations);
}

function normalizeRecommendations(
  recommendations: unknown,
  gaps: MasterpieceReadinessGap[]
): string[] {
  const normalized = Array.isArray(recommendations)
    ? recommendations.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  return normalized.length > 0 ? normalized : gaps.map(gap => gap.message);
}

function buildAreaActionPlan(
  area: MasterpieceReadinessAreaId,
  payload: NormalizedBenchmarkPayload,
  gaps: MasterpieceReadinessGap[]
): MasterpieceReadinessActionItem[] {
  const structured = normalizeEvidenceCollectionPlan(area, payload.evidenceCollectionPlan);
  const fallback = gaps.map(gap => buildGapActionItem(area, gap));
  return sortActionPlan([...structured, ...fallback]);
}

function normalizeEvidenceCollectionPlan(
  area: MasterpieceReadinessAreaId,
  value: unknown
): MasterpieceReadinessActionItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item, index): MasterpieceReadinessActionItem => ({
      area,
      id: stringValue(item.id) ?? `evidence-task-${index + 1}`,
      priority: normalizeActionPriority(item.priority),
      target: stringValue(item.target) ?? `${area}-evidence`,
      currentValue: stringOrNumberValue(item.currentValue),
      requiredValue: stringOrNumberValue(item.requiredValue),
      sampleIds: stringArrayValue(item.sampleIds).slice(0, 12),
      commands: normalizeActionCommands(area, item.commands),
      action: stringValue(item.action) ?? 'Collect the missing evidence for this readiness area.',
      rationale: stringValue(item.rationale) ?? 'This evidence gap prevents the area from supporting 98+ readiness.',
    }));
}

function buildGapActionItem(
  area: MasterpieceReadinessAreaId,
  gap: MasterpieceReadinessGap
): MasterpieceReadinessActionItem {
  return {
    area,
    id: `resolve-${gap.code}`,
    priority: gap.severity,
    target: `readiness-gap:${gap.code}`,
    sampleIds: [],
    commands: buildDefaultActionCommands(area),
    action: gap.message,
    rationale: 'This readiness gap must be resolved before the system can support a 98+ masterpiece-ready claim.',
  };
}

function normalizeActionCommands(
  area: MasterpieceReadinessAreaId,
  value: unknown
): string[] {
  const commands = stringArrayValue(value)
    .map(command => command.trim())
    .filter(command => command.length > 0);
  return commands.length > 0 ? commands : buildDefaultActionCommands(area);
}

function buildDefaultActionCommands(area: MasterpieceReadinessAreaId): string[] {
  switch (area) {
    case 'premise-appeal':
      return ['node dist/cli/run-premise-appeal-benchmark.js --project <project> --json'];
    case 'engagement':
      return ['node dist/cli/run-engagement-benchmark.js --project <project> --json'];
    case 'series-retention':
      return ['node dist/cli/run-series-retention-benchmark.js --project <project> --json'];
    case 'character-relationship':
      return ['node dist/cli/run-character-relationship-benchmark.js --project <project> --json'];
    case 'long-form-consistency':
      return [
        '/verify-chapter <chapter>',
        'regenerate reviews/consistency-report.json with consistency-verifier over chapters/world/characters/plot',
      ];
    case 'prose-taste':
      return ['node dist/cli/run-prose-taste-benchmark.js --project <project> --json'];
    case 'reader-response':
      return ['node dist/cli/calibrate-reader-response.js --project <project> --json'];
  }
}

function sortActionPlan(
  actionPlan: MasterpieceReadinessActionItem[]
): MasterpieceReadinessActionItem[] {
  return actionPlan.sort((a, b) => (
    actionPriorityRank(a.priority) - actionPriorityRank(b.priority) ||
    a.area.localeCompare(b.area) ||
    a.id.localeCompare(b.id)
  ));
}

function actionPriorityRank(priority: MasterpieceReadinessActionPriority): number {
  if (priority === 'critical') return 0;
  if (priority === 'major') return 1;
  return 2;
}

function normalizeActionPriority(priority: unknown): MasterpieceReadinessActionPriority {
  if (priority === 'critical' || priority === 'major' || priority === 'minor') {
    return priority;
  }
  return 'major';
}

function dedupeGaps(gaps: MasterpieceReadinessGap[]): MasterpieceReadinessGap[] {
  const seen = new Set<string>();
  return gaps.filter(gap => {
    const key = `${gap.area}:${gap.code}:${gap.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildGap(
  area: MasterpieceReadinessAreaId,
  code: string,
  severity: MasterpieceReadinessGap['severity'],
  message: string
): MasterpieceReadinessGap {
  return {
    area,
    code,
    severity,
    message,
  };
}

function normalizeWeight(weight: number | undefined): number {
  if (typeof weight !== 'number' || !Number.isFinite(weight) || weight <= 0) {
    return 1;
  }
  return weight;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function stringArrayValue(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function stringOrNumberValue(value: unknown): string | number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return stringValue(value);
}

function normalizeChapterId(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(Math.max(0, Math.floor(value)));
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      return String(Number(trimmed));
    }
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function humanizeField(field: string): string {
  return toKebab(field).replace(/-/g, ' ');
}

function toKebab(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, roundScore(value)));
}

function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}
