/**
 * Quality Tracker Tests
 *
 * Tests for the quality trend tracking system:
 * - recordSnapshot: idempotency, versioning, superseding
 * - recordEngagementEvaluation: load-record-save-detect engagement workflow
 * - getLatestSnapshots: filtering, sorting, empty handling
 * - loadTrendData / saveTrendData: file I/O, round-trip, backup
 * - renderTrendTable: markdown output, engagement column, trend arrows, summary row
 * - recalculateTrends: metadata recalculation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import type { QualitySnapshot, TrendData } from '../../src/self-improvement/types.js';
import {
  recordSnapshot,
  createEngagementSnapshot,
  recordEngagementEvaluation,
  loadTrendData,
  saveTrendData,
  getLatestSnapshots,
  renderTrendTable,
  recalculateTrends,
} from '../../src/self-improvement/quality-tracker.js';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Factory function to create a QualitySnapshot with sensible defaults.
 */
function makeSnapshot(
  chapter: number,
  score: number,
  dims?: Partial<Record<string, number>>,
  overrides?: Partial<QualitySnapshot>
): QualitySnapshot {
  return {
    chapterNumber: chapter,
    timestamp: new Date().toISOString(),
    version: overrides?.version ?? 1,
    overallScore: score,
    dimensions: {
      proseQuality: dims?.proseQuality ?? score,
      sensoryGrounding: dims?.sensoryGrounding ?? score - 5,
      rhythmVariation: dims?.rhythmVariation ?? score - 2,
      characterVoice: dims?.characterVoice ?? score - 3,
      ...dims,
    },
    verdict: score >= 70 ? 'PASS' : 'REVISE',
    ...overrides,
  };
}

/**
 * Create an empty TrendData for testing.
 */
function emptyTrend(projectId: string = 'test-project'): TrendData {
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

// ============================================================================
// recordSnapshot Tests
// ============================================================================

describe('recordSnapshot', () => {
  it('should record a new snapshot for a new chapter', () => {
    const trend = emptyTrend();
    const snap = makeSnapshot(1, 80);

    const result = recordSnapshot(trend, snap);

    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0].chapterNumber).toBe(1);
    expect(result.snapshots[0].overallScore).toBe(80);
  });

  it('should be idempotent: same chapterNumber+version is not duplicated', () => {
    const trend = emptyTrend();
    const snap = makeSnapshot(1, 80, undefined, { version: 1 });

    const after1 = recordSnapshot(trend, snap);
    const after2 = recordSnapshot(after1, snap);

    expect(after2.snapshots).toHaveLength(1);
  });

  it('should mark older versions as superseded when new version is recorded', () => {
    const trend = emptyTrend();
    const v1 = makeSnapshot(1, 70, undefined, { version: 1 });
    const v2 = makeSnapshot(1, 85, undefined, { version: 2 });

    const after1 = recordSnapshot(trend, v1);
    const after2 = recordSnapshot(after1, v2);

    expect(after2.snapshots).toHaveLength(2);
    // v1 should be superseded
    const oldSnap = after2.snapshots.find(s => s.version === 1);
    expect(oldSnap?.superseded).toBe(true);
    // v2 should not be superseded
    const newSnap = after2.snapshots.find(s => s.version === 2);
    expect(newSnap?.superseded).toBeUndefined();
  });

  it('should have correct timestamp format (ISO 8601)', () => {
    const trend = emptyTrend();
    const snap = makeSnapshot(1, 80);

    const result = recordSnapshot(trend, snap);

    const ts = result.snapshots[0].timestamp;
    // ISO 8601 pattern: YYYY-MM-DDTHH:MM:SS.sssZ
    expect(() => new Date(ts)).not.toThrow();
    expect(new Date(ts).toISOString()).toBeTruthy();
  });
});

describe('createEngagementSnapshot', () => {
  it('should convert engagement contract evaluation into a trend snapshot', () => {
    const snapshot = createEngagementSnapshot({
      chapterNumber: 7,
      version: 2,
      evaluation: {
        passed: true,
        score: 91,
        breakdown: {
          promiseAlignment: 100,
          funSpecAlignment: 90,
          cliffhangerStrength: 80,
        },
        issues: [],
      },
    });

    expect(snapshot.chapterNumber).toBe(7);
    expect(snapshot.version).toBe(2);
    expect(snapshot.overallScore).toBe(91);
    expect(snapshot.dimensions.engagement).toBe(91);
    expect(snapshot.verdict).toBe('PASS');
    expect(new Date(snapshot.timestamp).toISOString()).toBe(snapshot.timestamp);
    expect(snapshot.engagementIssues).toEqual([]);
    expect(snapshot.engagementRevisionDirectives).toEqual([]);
  });

  it('should store engagement issues and revision directives on failed snapshots', () => {
    const snapshot = createEngagementSnapshot({
      chapterNumber: 8,
      version: 1,
      evaluation: {
        passed: false,
        score: 64,
        breakdown: {
          promiseAlignment: 45,
          funSpecAlignment: 60,
          cliffhangerStrength: 40,
        },
        issues: [
          {
            code: 'missing-core-hook',
            severity: 'critical',
            message: 'Missing core hook',
          },
        ],
        revisionDirectives: [
          {
            code: 'missing-core-hook',
            priority: 'critical',
            target: 'reader_experience',
            action: 'Rewrite promise_fulfillment so it carries the design core_hook.',
            expected: '살인을 예고하는 앱',
            actual: '이상한 메시지',
          },
        ],
      },
    });

    expect(snapshot.overallScore).toBe(64);
    expect(snapshot.dimensions.engagement).toBe(64);
    expect(snapshot.verdict).toBe('REVISE');
    expect(snapshot.engagementIssues).toEqual([
      expect.objectContaining({
        code: 'missing-core-hook',
        severity: 'critical',
        message: 'Missing core hook',
      }),
    ]);
    expect(snapshot.engagementRevisionDirectives).toEqual([
      expect.objectContaining({
        code: 'missing-core-hook',
        priority: 'critical',
        target: 'reader_experience',
        action: 'Rewrite promise_fulfillment so it carries the design core_hook.',
      }),
    ]);
  });
});

describe('recordEngagementEvaluation', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'engagement-record-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should record, persist, and analyze an engagement evaluation in one workflow', async () => {
    const result = await recordEngagementEvaluation({
      projectDir: tempDir,
      projectId: 'serial-a',
      chapterNumber: 1,
      version: 1,
      evaluation: {
        passed: true,
        score: 93,
        breakdown: {
          promiseAlignment: 95,
          funSpecAlignment: 90,
          cliffhangerStrength: 94,
        },
        issues: [],
      },
    });

    expect(result.snapshot.chapterNumber).toBe(1);
    expect(result.snapshot.dimensions.engagement).toBe(93);
    expect(result.trendData.projectId).toBe('serial-a');
    expect(result.trendData.metadata.totalSnapshots).toBe(1);
    expect(result.regression.alertLevel).toBe('none');

    const trendPath = path.join(tempDir, 'meta', 'quality-trend.json');
    expect(existsSync(trendPath)).toBe(true);

    const loaded = await loadTrendData(tempDir, 'serial-a');
    expect(loaded.snapshots).toHaveLength(1);
    expect(loaded.snapshots[0]).toMatchObject({
      chapterNumber: 1,
      version: 1,
      overallScore: 93,
      dimensions: {
        engagement: 93,
      },
      verdict: 'PASS',
    });
  });

  it('should supersede older chapter versions when recording a revised engagement evaluation', async () => {
    await recordEngagementEvaluation({
      projectDir: tempDir,
      projectId: 'serial-a',
      chapterNumber: 3,
      version: 1,
      evaluation: {
        passed: false,
        score: 61,
        breakdown: {
          promiseAlignment: 55,
          funSpecAlignment: 60,
          cliffhangerStrength: 65,
        },
        issues: [
          {
            code: 'reader-reward-drift',
            severity: 'major',
            message: 'Reader reward drifted from the promise contract',
          },
        ],
      },
    });

    const result = await recordEngagementEvaluation({
      projectDir: tempDir,
      projectId: 'serial-a',
      chapterNumber: 3,
      version: 2,
      evaluation: {
        passed: true,
        score: 88,
        breakdown: {
          promiseAlignment: 90,
          funSpecAlignment: 86,
          cliffhangerStrength: 88,
        },
        issues: [],
      },
    });

    expect(result.trendData.snapshots).toHaveLength(2);
    expect(result.trendData.snapshots.find(s => s.version === 1)?.superseded).toBe(true);
    expect(getLatestSnapshots(result.trendData)).toHaveLength(1);
    expect(getLatestSnapshots(result.trendData)[0].overallScore).toBe(88);
  });

  it('should increment regression alert metadata only once for a new declining engagement record', async () => {
    const scores = [92, 88, 84, 80, 60];
    let latestResult: Awaited<ReturnType<typeof recordEngagementEvaluation>> | undefined;

    for (let i = 0; i < scores.length; i++) {
      latestResult = await recordEngagementEvaluation({
        projectDir: tempDir,
        projectId: 'serial-a',
        chapterNumber: i + 1,
        version: 1,
        evaluation: {
          passed: scores[i] >= 70,
          score: scores[i],
          breakdown: {
            promiseAlignment: scores[i],
            funSpecAlignment: scores[i],
            cliffhangerStrength: scores[i],
          },
          issues: scores[i] >= 70
            ? []
            : [
                {
                  code: 'weak-must-click-ending',
                  severity: 'critical',
                  message: 'Ending no longer compels the next click',
                },
              ],
        },
      });
    }

    expect(latestResult?.regression.regressionDetected).toBe(true);
    expect(latestResult?.trendData.metadata.regressionAlertsFired).toBe(1);

    const repeated = await recordEngagementEvaluation({
      projectDir: tempDir,
      projectId: 'serial-a',
      chapterNumber: 5,
      version: 1,
      evaluation: {
        passed: false,
        score: 60,
        breakdown: {
          promiseAlignment: 60,
          funSpecAlignment: 60,
          cliffhangerStrength: 60,
        },
        issues: [
          {
            code: 'weak-must-click-ending',
            severity: 'critical',
            message: 'Ending no longer compels the next click',
          },
        ],
      },
    });

    expect(repeated.trendData.metadata.regressionAlertsFired).toBe(1);
  });

  it('should report recurring engagement revision directives across active snapshots', async () => {
    await recordEngagementEvaluation({
      projectDir: tempDir,
      projectId: 'serial-a',
      chapterNumber: 1,
      version: 1,
      evaluation: {
        passed: false,
        score: 62,
        breakdown: {
          promiseAlignment: 70,
          funSpecAlignment: 60,
          cliffhangerStrength: 50,
        },
        issues: [
          {
            code: 'must-click-ending-not-staged',
            severity: 'critical',
            message: 'Final scene misses the must-click ending.',
          },
        ],
        revisionDirectives: [
          {
            code: 'must-click-ending-not-staged',
            priority: 'critical',
            target: 'final_scene',
            action: 'Rewrite the final scene to stage must_click_ending.',
          },
        ],
      },
    });

    const result = await recordEngagementEvaluation({
      projectDir: tempDir,
      projectId: 'serial-a',
      chapterNumber: 2,
      version: 1,
      evaluation: {
        passed: false,
        score: 64,
        breakdown: {
          promiseAlignment: 72,
          funSpecAlignment: 62,
          cliffhangerStrength: 50,
        },
        issues: [
          {
            code: 'must-click-ending-not-staged',
            severity: 'critical',
            message: 'Final scene misses the must-click ending again.',
          },
        ],
        revisionDirectives: [
          {
            code: 'must-click-ending-not-staged',
            priority: 'critical',
            target: 'final_scene',
            action: 'Rewrite the final scene to stage must_click_ending.',
          },
        ],
      },
    });

    expect(result.recurringEngagementDirectives).toEqual([
      expect.objectContaining({
        code: 'must-click-ending-not-staged',
        count: 2,
        firstChapter: 1,
        latestChapter: 2,
        priority: 'critical',
        target: 'final_scene',
      }),
    ]);
  });
});

// ============================================================================
// getLatestSnapshots Tests
// ============================================================================

describe('getLatestSnapshots', () => {
  it('should return only non-superseded highest-version snapshots', () => {
    let trend = emptyTrend();
    trend = recordSnapshot(trend, makeSnapshot(1, 70, undefined, { version: 1 }));
    trend = recordSnapshot(trend, makeSnapshot(1, 85, undefined, { version: 2 }));
    trend = recordSnapshot(trend, makeSnapshot(2, 78, undefined, { version: 1 }));

    const latest = getLatestSnapshots(trend);

    expect(latest).toHaveLength(2);
    expect(latest[0].chapterNumber).toBe(1);
    expect(latest[0].version).toBe(2);
    expect(latest[0].overallScore).toBe(85);
    expect(latest[1].chapterNumber).toBe(2);
  });

  it('should return sorted by chapterNumber ascending', () => {
    let trend = emptyTrend();
    // Add chapters out of order
    trend = recordSnapshot(trend, makeSnapshot(3, 75));
    trend = recordSnapshot(trend, makeSnapshot(1, 80));
    trend = recordSnapshot(trend, makeSnapshot(2, 82));

    const latest = getLatestSnapshots(trend);

    expect(latest.map(s => s.chapterNumber)).toEqual([1, 2, 3]);
  });

  it('should return empty array for empty trendData', () => {
    const trend = emptyTrend();

    const latest = getLatestSnapshots(trend);

    expect(latest).toHaveLength(0);
  });
});

// ============================================================================
// loadTrendData / saveTrendData Tests
// ============================================================================

describe('loadTrendData / saveTrendData', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quality-tracker-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should round-trip save and load correctly', async () => {
    let trend = emptyTrend('my-novel');
    trend = recordSnapshot(trend, makeSnapshot(1, 80));
    trend = recordSnapshot(trend, makeSnapshot(2, 85));

    await saveTrendData(tempDir, trend);
    const loaded = await loadTrendData(tempDir, 'my-novel');

    expect(loaded.projectId).toBe('my-novel');
    expect(loaded.snapshots).toHaveLength(2);
    expect(loaded.metadata.totalSnapshots).toBe(2);
  });

  it('should return empty TrendData when file does not exist', async () => {
    const loaded = await loadTrendData(tempDir, 'nonexistent');

    expect(loaded.projectId).toBe('nonexistent');
    expect(loaded.snapshots).toHaveLength(0);
    expect(loaded.metadata.totalSnapshots).toBe(0);
  });

  it('should create backup file during save (withStateBackup integration)', async () => {
    let trend = emptyTrend('backup-test');
    trend = recordSnapshot(trend, makeSnapshot(1, 80));

    // First save creates the file
    await saveTrendData(tempDir, trend);

    // Second save should create a backup
    trend = recordSnapshot(trend, makeSnapshot(2, 85));
    await saveTrendData(tempDir, trend);

    const backupPath = path.join(tempDir, 'meta', 'quality-trend.backup.json');
    expect(existsSync(backupPath)).toBe(true);
  });
});

// ============================================================================
// renderTrendTable Tests
// ============================================================================

describe('renderTrendTable', () => {
  it('should return minimal table with header only for empty data', () => {
    const trend = emptyTrend();
    const table = renderTrendTable(trend);

    expect(table).toContain('| Chapter |');
    expect(table).toContain('Engagement');
    expect(table).toContain('|---------|');
    expect(table).toContain('Average: -');
  });

  it('should show single chapter with score and no trend indicator', () => {
    let trend = emptyTrend();
    trend = recordSnapshot(trend, makeSnapshot(1, 80, {
      proseQuality: 82,
      sensoryGrounding: 78,
      rhythmVariation: 80,
      characterVoice: 76,
    }));

    const table = renderTrendTable(trend);

    expect(table).toContain('| 1 |');
    expect(table).toContain('80.0');
    expect(table).toContain('PASS');
    // First chapter has no trend indicator -- the trend column should be empty
    const dataRow = table.split('\n').find(line => line.includes('| 1 |'));
    expect(dataRow).toBeDefined();
    // Should end with empty trend cell: "| |"
    expect(dataRow!).toMatch(/\|\s*\|$/);
  });

  it('should include engagement score when tracked', () => {
    let trend = emptyTrend();
    trend = recordSnapshot(trend, makeSnapshot(1, 88, {
      engagement: 91,
    }));

    const table = renderTrendTable(trend);

    expect(table).toContain('| Chapter | Score | Verdict | Engagement |');
    expect(table).toContain('| 1 | 88.0 | PASS | 91 |');
  });

  it('should show correct trend arrows for multiple chapters', () => {
    let trend = emptyTrend();
    trend = recordSnapshot(trend, makeSnapshot(1, 80));
    trend = recordSnapshot(trend, makeSnapshot(2, 85)); // +5 -> ^
    trend = recordSnapshot(trend, makeSnapshot(3, 84)); // -1 -> -
    trend = recordSnapshot(trend, makeSnapshot(4, 70)); // -14 -> v

    const table = renderTrendTable(trend);
    const lines = table.split('\n');

    // Find data rows
    const ch2Row = lines.find(l => l.includes('| 2 |'));
    const ch3Row = lines.find(l => l.includes('| 3 |'));
    const ch4Row = lines.find(l => l.includes('| 4 |'));

    expect(ch2Row).toContain('^');
    expect(ch3Row).toContain('-');
    expect(ch4Row).toContain('v');
  });

  it('should show correct summary row with average, best, worst', () => {
    let trend = emptyTrend();
    trend = recordSnapshot(trend, makeSnapshot(1, 70));
    trend = recordSnapshot(trend, makeSnapshot(2, 80));
    trend = recordSnapshot(trend, makeSnapshot(3, 90));

    const table = renderTrendTable(trend);

    // Average: (70+80+90)/3 = 80.0
    expect(table).toContain('Average: 80.0');
    expect(table).toContain('Best: 90.0');
    expect(table).toContain('Worst: 70.0');
  });

  it('should output valid markdown (starts with |, has separator row)', () => {
    let trend = emptyTrend();
    trend = recordSnapshot(trend, makeSnapshot(1, 80));

    const table = renderTrendTable(trend);
    const lines = table.split('\n').filter(l => l.trim());

    // First line should start with |
    expect(lines[0]).toMatch(/^\|/);
    // Second line should be separator with ---
    expect(lines[1]).toMatch(/^\|[-|]+\|$/);
  });
});

// ============================================================================
// recalculateTrends Tests
// ============================================================================

describe('recalculateTrends', () => {
  it('should recalculate totalSnapshots correctly after manual edits', () => {
    let trend = emptyTrend();
    trend = recordSnapshot(trend, makeSnapshot(1, 70, undefined, { version: 1 }));
    trend = recordSnapshot(trend, makeSnapshot(1, 85, undefined, { version: 2 }));
    trend = recordSnapshot(trend, makeSnapshot(2, 78));

    // Manually set incorrect metadata
    trend.metadata.totalSnapshots = 999;

    const recalculated = recalculateTrends(trend);

    // Should be 2 (ch1 v2 + ch2 v1), not 3 (excludes superseded)
    expect(recalculated.metadata.totalSnapshots).toBe(2);
  });
});
