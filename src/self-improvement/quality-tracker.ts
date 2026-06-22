/**
 * Quality Trend Tracker
 *
 * Records per-chapter quality snapshots, persists them with versioning,
 * and renders markdown trend visualizations.
 *
 * Features:
 * - Idempotent snapshot recording (same chapter+version = skip)
 * - Automatic superseding of old versions when chapters are rewritten
 * - Trend table with arrow indicators for score trajectory
 * - Safe persistence via withStateBackup()
 *
 * @module self-improvement/quality-tracker
 */

import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import type {
  EngagementIssueSnapshot,
  EngagementRevisionDirectiveSnapshot,
  QualitySnapshot,
  RecurringEngagementDirective,
  TrendAnalysis,
  TrendData,
} from './types.js';
import type { EngagementContractEvaluation } from '../quality/engagement-contract.js';
import { withStateBackup } from '../state/backup.js';
import { detectRegression } from './regression-detector.js';
import { createLogger } from '../utils/logger.js';
const logger = createLogger('quality-tracker');

// ============================================================================
// Constants
// ============================================================================

/** Trend arrow threshold: score difference >= this shows an arrow */
const TREND_THRESHOLD = 3;

// ============================================================================
// Trend Data Lifecycle
// ============================================================================

/**
 * Create an empty TrendData structure for a new project.
 *
 * @param projectId - Project identifier
 * @returns Empty TrendData with zeroed metadata
 */
export function createEmptyTrendData(projectId: string): TrendData {
  return {
    projectId,
    snapshots: [],
    metadata: {
      totalSnapshots: 0,
      lastUpdated: new Date().toISOString(),
      autoExemplarsAdded: 0,
      regressionAlertsFired: 0,
    },
  };
}

/**
 * Load trend data from the project directory.
 *
 * @param projectDir - Project root directory
 * @param projectId - Project identifier (used for empty default)
 * @returns TrendData loaded from disk, or empty default if file missing
 */
export async function loadTrendData(
  projectDir: string,
  projectId: string
): Promise<TrendData> {
  const filePath = path.join(projectDir, 'meta', 'quality-trend.json');

  if (!existsSync(filePath)) {
    return createEmptyTrendData(projectId);
  }

  const content = await fs.readFile(filePath, 'utf-8');
  let parsed: TrendData;
  try {
    parsed = JSON.parse(content) as TrendData;
  } catch {
    logger.warn('quality-trend.json 파싱 실패, 빈 데이터로 초기화');
    return createEmptyTrendData(projectId);
  }

  // Basic structure validation
  if (!parsed.projectId || !Array.isArray(parsed.snapshots) || !parsed.metadata) {
    return createEmptyTrendData(projectId);
  }

  return parsed;
}

/**
 * Save trend data to the project directory with backup protection.
 *
 * Uses withStateBackup() to ensure data integrity on write failure.
 *
 * @param projectDir - Project root directory
 * @param trendData - TrendData to persist
 */
export async function saveTrendData(
  projectDir: string,
  trendData: TrendData
): Promise<void> {
  const filePath = path.join(projectDir, 'meta', 'quality-trend.json');
  const metaDir = path.join(projectDir, 'meta');

  // Ensure meta directory exists
  if (!existsSync(metaDir)) {
    await fs.mkdir(metaDir, { recursive: true });
  }

  // Update metadata before saving
  const latestSnapshots = getLatestSnapshots(trendData);
  const updated: TrendData = {
    ...trendData,
    metadata: {
      ...trendData.metadata,
      totalSnapshots: latestSnapshots.length,
      lastUpdated: new Date().toISOString(),
    },
  };

  await withStateBackup(filePath, async () => {
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');
  });
}

// ============================================================================
// Snapshot Recording
// ============================================================================

export interface CreateEngagementSnapshotInput {
  chapterNumber: number;
  version: number;
  evaluation: EngagementContractEvaluation;
}

export interface RecordEngagementEvaluationInput extends CreateEngagementSnapshotInput {
  projectDir: string;
  projectId: string;
}

export interface RecordEngagementEvaluationResult {
  snapshot: QualitySnapshot;
  trendData: TrendData;
  regression: TrendAnalysis;
  recurringEngagementDirectives: RecurringEngagementDirective[];
}

/**
 * Convert an engagement contract evaluation into a quality trend snapshot.
 *
 * This makes reader pull a first-class tracked dimension for long-serial health.
 */
export function createEngagementSnapshot(
  input: CreateEngagementSnapshotInput
): QualitySnapshot {
  const score = clampScore(input.evaluation.score);

  return {
    chapterNumber: input.chapterNumber,
    timestamp: new Date().toISOString(),
    version: input.version,
    overallScore: score,
    dimensions: {
      engagement: score,
    },
    verdict: input.evaluation.passed ? 'PASS' : 'REVISE',
    engagementIssues: (input.evaluation.issues ?? []).map(toEngagementIssueSnapshot),
    engagementRevisionDirectives: (input.evaluation.revisionDirectives ?? [])
      .map(toEngagementRevisionDirectiveSnapshot),
  };
}

/**
 * Load trend data, record an engagement evaluation, persist it, and return
 * regression analysis for the latest active chapter snapshots.
 */
export async function recordEngagementEvaluation(
  input: RecordEngagementEvaluationInput
): Promise<RecordEngagementEvaluationResult> {
  const trendData = await loadTrendData(input.projectDir, input.projectId);
  const existingSnapshot = trendData.snapshots.find(
    snapshot =>
      snapshot.chapterNumber === input.chapterNumber &&
      snapshot.version === input.version
  );
  const snapshot = existingSnapshot ?? createEngagementSnapshot(input);
  const isNewSnapshot = existingSnapshot === undefined;

  const recorded = recordSnapshot(trendData, snapshot);
  let recalculated = recalculateTrends(recorded);
  const regression = detectRegression(getLatestSnapshots(recalculated));

  if (isNewSnapshot && regression.regressionDetected) {
    recalculated = {
      ...recalculated,
      metadata: {
        ...recalculated.metadata,
        regressionAlertsFired: recalculated.metadata.regressionAlertsFired + 1,
      },
    };
  }

  await saveTrendData(input.projectDir, recalculated);

  const persisted = await loadTrendData(input.projectDir, input.projectId);
  const persistedRegression = detectRegression(getLatestSnapshots(persisted));
  const recurringEngagementDirectives =
    summarizeRecurringEngagementDirectives(persisted);

  return {
    snapshot,
    trendData: persisted,
    regression: persistedRegression,
    recurringEngagementDirectives,
  };
}

/**
 * Record a quality snapshot for a chapter.
 *
 * Idempotent: if a snapshot with the same chapterNumber + version already
 * exists, the call is a no-op.
 *
 * If a snapshot for the same chapterNumber with a LOWER version exists,
 * that older snapshot is marked as superseded.
 *
 * @param trendData - Current trend data (not mutated)
 * @param snapshot - New snapshot to record
 * @returns Updated TrendData (new object)
 */
export function recordSnapshot(
  trendData: TrendData,
  snapshot: QualitySnapshot
): TrendData {
  // Check for existing snapshot with same chapter + version (idempotent)
  const exists = trendData.snapshots.some(
    s => s.chapterNumber === snapshot.chapterNumber && s.version === snapshot.version
  );
  if (exists) {
    return trendData;
  }

  // Mark older versions of the same chapter as superseded
  const updatedSnapshots = trendData.snapshots.map(s => {
    if (s.chapterNumber === snapshot.chapterNumber && s.version < snapshot.version) {
      return { ...s, superseded: true };
    }
    return s;
  });

  // Append the new snapshot
  updatedSnapshots.push(snapshot);

  return {
    ...trendData,
    snapshots: updatedSnapshots,
  };
}

// ============================================================================
// Snapshot Queries
// ============================================================================

/**
 * Get the latest (non-superseded, highest-version) snapshots.
 *
 * For each chapter, returns only the highest-version snapshot
 * that is not marked as superseded.
 *
 * @param trendData - Trend data to query
 * @returns Latest snapshots sorted by chapterNumber ascending
 */
export function getLatestSnapshots(trendData: TrendData): QualitySnapshot[] {
  // Filter out superseded snapshots
  const active = trendData.snapshots.filter(s => !s.superseded);

  // Group by chapterNumber, keep highest version
  const byChapter = new Map<number, QualitySnapshot>();
  for (const snapshot of active) {
    const existing = byChapter.get(snapshot.chapterNumber);
    if (!existing || snapshot.version > existing.version) {
      byChapter.set(snapshot.chapterNumber, snapshot);
    }
  }

  // Sort by chapterNumber ascending
  return Array.from(byChapter.values()).sort(
    (a, b) => a.chapterNumber - b.chapterNumber
  );
}

export function summarizeRecurringEngagementDirectives(
  trendData: TrendData
): RecurringEngagementDirective[] {
  const recurring = new Map<string, RecurringEngagementDirective>();

  for (const snapshot of getLatestSnapshots(trendData)) {
    const seenInSnapshot = new Set<string>();
    for (const directive of snapshot.engagementRevisionDirectives ?? []) {
      const key = directive.code ?? directive.action;
      if (!key || seenInSnapshot.has(key)) continue;
      seenInSnapshot.add(key);

      const existing = recurring.get(key);
      if (!existing) {
        recurring.set(key, {
          ...directive,
          count: 1,
          firstChapter: snapshot.chapterNumber,
          latestChapter: snapshot.chapterNumber,
        });
        continue;
      }

      recurring.set(key, {
        ...existing,
        ...directive,
        count: existing.count + 1,
        firstChapter: existing.firstChapter,
        latestChapter: snapshot.chapterNumber,
      });
    }
  }

  return Array.from(recurring.values())
    .filter(directive => directive.count >= 2)
    .sort((left, right) => {
      const countDelta = right.count - left.count;
      if (countDelta !== 0) return countDelta;
      return left.firstChapter - right.firstChapter;
    });
}

// ============================================================================
// Trend Visualization
// ============================================================================

/**
 * Render a markdown table showing quality trends across chapters.
 *
 * Columns: Chapter, Score, Verdict, Engagement, Prose, Sensory, Rhythm, Voice, Trend
 * Trend: ^ (improved >= 3), v (declined >= 3), - (stable)
 *
 * @param trendData - Trend data to visualize
 * @returns Markdown table string
 */
export function renderTrendTable(trendData: TrendData): string {
  const snapshots = getLatestSnapshots(trendData);

  const lines: string[] = [];

  // Header
  lines.push('| Chapter | Score | Verdict | Engagement | Prose | Sensory | Rhythm | Voice | Trend |');
  lines.push('|---------|-------|---------|------------|-------|---------|--------|-------|-------|');

  if (snapshots.length === 0) {
    // Summary row for empty data
    lines.push('');
    lines.push('Average: - | Best: - | Worst: -');
    return lines.join('\n');
  }

  // Data rows
  for (let i = 0; i < snapshots.length; i++) {
    const snap = snapshots[i];
    const dims = snap.dimensions;

    // Trend indicator
    let trend = '';
    if (i === 0) {
      trend = '';
    } else {
      const diff = snap.overallScore - snapshots[i - 1].overallScore;
      if (diff >= TREND_THRESHOLD) {
        trend = '^';
      } else if (diff <= -TREND_THRESHOLD) {
        trend = 'v';
      } else {
        trend = '-';
      }
    }

    const prose = dims.proseQuality !== undefined ? dims.proseQuality.toFixed(0) : '-';
    const engagement = dims.engagement !== undefined ? dims.engagement.toFixed(0) : '-';
    const sensory = dims.sensoryGrounding !== undefined ? dims.sensoryGrounding.toFixed(0) : '-';
    const rhythm = dims.rhythmVariation !== undefined ? dims.rhythmVariation.toFixed(0) : '-';
    const voice = dims.characterVoice !== undefined ? dims.characterVoice.toFixed(0) : '-';

    lines.push(
      `| ${snap.chapterNumber} | ${snap.overallScore.toFixed(1)} | ${snap.verdict} | ${engagement} | ${prose} | ${sensory} | ${rhythm} | ${voice} | ${trend} |`
    );
  }

  // Summary row
  const scores = snapshots.map(s => s.overallScore);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const best = Math.max(...scores);
  const worst = Math.min(...scores);

  lines.push('');
  lines.push(`Average: ${avg.toFixed(1)} | Best: ${best.toFixed(1)} | Worst: ${worst.toFixed(1)}`);

  return lines.join('\n');
}

// ============================================================================
// Trend Recalculation
// ============================================================================

/**
 * Recalculate trend metadata from snapshots.
 *
 * Useful after manual edits or data migration.
 *
 * @param trendData - Trend data to recalculate
 * @returns Updated TrendData with recalculated metadata
 */
export function recalculateTrends(trendData: TrendData): TrendData {
  const latestSnapshots = getLatestSnapshots(trendData);

  return {
    ...trendData,
    metadata: {
      ...trendData.metadata,
      totalSnapshots: latestSnapshots.length,
      lastUpdated: new Date().toISOString(),
    },
  };
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

function toEngagementIssueSnapshot(issue: {
  code?: string;
  severity?: string;
  message: string;
  expected?: string;
  actual?: string;
}): EngagementIssueSnapshot {
  return {
    code: issue.code,
    severity: issue.severity,
    message: issue.message,
    expected: issue.expected,
    actual: issue.actual,
  };
}

function toEngagementRevisionDirectiveSnapshot(directive: {
  code?: string;
  priority?: string;
  target?: string;
  action: string;
  expected?: string;
  actual?: string;
}): EngagementRevisionDirectiveSnapshot {
  return {
    code: directive.code,
    priority: directive.priority,
    target: directive.target,
    action: directive.action,
    expected: directive.expected,
    actual: directive.actual,
  };
}
