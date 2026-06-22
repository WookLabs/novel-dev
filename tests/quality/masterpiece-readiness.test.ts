import { describe, expect, it } from 'vitest';
import { evaluateMasterpieceReadiness } from '../../src/quality/masterpiece-readiness.js';
import type {
  MasterpieceReadinessAreaId,
  MasterpieceReadinessAreaInput,
} from '../../src/quality/masterpiece-readiness.js';

const AREAS: MasterpieceReadinessAreaId[] = [
  'premise-appeal',
  'engagement',
  'series-retention',
  'character-relationship',
  'long-form-consistency',
  'prose-taste',
  'reader-response',
];

describe('evaluateMasterpieceReadiness', () => {
  it('passes only when every required evidence area is ready', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result).toMatchObject({
      overallScore: 100,
      minimumOverallScore: 98,
      passed: true,
      status: 'ready',
      missingRequiredAreas: [],
      atRiskAreas: [],
      needsEvidenceAreas: [],
      criticalGapCount: 0,
      majorGapCount: 0,
    });
    expect(result.areaResults).toHaveLength(7);
    expect(result.areaResults.every(area => area.status === 'ready')).toBe(true);
    expect(result.actionPlan).toEqual([]);
  });

  it('does not let weighted average hide an area below 98 accuracy', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const premise = inputs.find(input => input.id === 'premise-appeal');
    if (!premise) throw new Error('Missing premise-appeal fixture');
    premise.report = {
      benchmark: {
        total: 4,
        failed: 0,
        accuracy: 0.97,
        readyForGateTuning: true,
        recommendations: [],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.overallScore).toBeGreaterThanOrEqual(98);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('needs-evidence');
    expect(result.needsEvidenceAreas).toEqual(['premise-appeal']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'premise-appeal',
          code: 'low-readiness-accuracy',
          severity: 'major',
        }),
      ])
    );
  });

  it('treats weak premise behavioral intent as a 98+ readiness blocker', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const premise = inputs.find(input => input.id === 'premise-appeal');
    if (!premise) throw new Error('Missing premise-appeal fixture');
    premise.report = {
      benchmark: {
        total: 4,
        failed: 1,
        accuracy: 0.99,
        readyForGateTuning: false,
        behavioralIntentFalsePositiveCount: 1,
        lowBehavioralIntentEvidenceCount: 2,
        weakBehavioralProtocolCount: 1,
        weakBehavioralAllocationCount: 1,
        recommendations: ['Collect listing-level behavioral premise evidence.'],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('at-risk');
    expect(result.atRiskAreas).toEqual(['premise-appeal']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'premise-appeal',
          code: 'behavioral-intent-false-positive-count',
          severity: 'critical',
        }),
        expect.objectContaining({
          area: 'premise-appeal',
          code: 'low-behavioral-intent-evidence-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'premise-appeal',
          code: 'weak-behavioral-protocol-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'premise-appeal',
          code: 'weak-behavioral-allocation-count',
          severity: 'major',
        }),
      ])
    );
  });

  it('separates missing reports, failing samples, and weak evidence gaps', () => {
    const result = evaluateMasterpieceReadiness([
      buildReadyInput('premise-appeal'),
      {
        id: 'engagement',
        report: {
          benchmark: {
            total: 2,
            failed: 1,
            accuracy: 0.5,
            falsePositiveCount: 1,
            positiveQualityConflictCount: 1,
            splitLeakageCount: 1,
            readyForGateTuning: false,
            recommendations: ['Fix the false positive sample.'],
          },
        },
      },
      {
        id: 'series-retention',
        report: {
          benchmark: {
            total: 2,
            failed: 0,
            accuracy: 1,
            readyForGateTuning: false,
            missingRequiredGenres: ['romance'],
            underSampledUsableHoldoutSamples: true,
            weakHookProgressEvidenceCount: 1,
          },
        },
      },
      buildReadyInput('character-relationship'),
      buildReadyInput('long-form-consistency'),
      {
        id: 'prose-taste',
        report: {
          benchmark: {
            total: 2,
            failed: 0,
            accuracy: 1,
            readyForStyleTuning: false,
            weakStyleFrictionAnnotationCount: 1,
            missingStyleHighlightAnnotationCount: 1,
            weakStyleFingerprintCount: 1,
            weakAuthorialStyleDriftCount: 1,
          },
        },
      },
      {
        id: 'reader-response',
      },
    ]);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('missing');
    expect(result.missingRequiredAreas).toEqual(['reader-response']);
    expect(result.atRiskAreas).toEqual(['engagement']);
    expect(result.needsEvidenceAreas).toEqual(['series-retention', 'prose-taste']);
    expect(result.criticalGapCount).toBeGreaterThanOrEqual(3);
    expect(result.majorGapCount).toBeGreaterThanOrEqual(4);
    expect(result.gaps.map(gap => gap.code)).toEqual(
      expect.arrayContaining([
        'missing-report',
        'failed-samples',
        'false-positive-count',
        'positive-quality-conflict-count',
        'split-leakage-count',
        'missing-required-genres',
        'under-sampled-usable-holdout-samples',
        'weak-hook-progress-evidence-count',
        'weak-style-friction-annotation-count',
        'missing-style-highlight-annotation-count',
        'weak-style-fingerprint-count',
        'weak-authorial-style-drift-count',
      ])
    );
    expect(result.recommendations.join('\n')).toContain('Run missing benchmark');
    expect(result.recommendations.join('\n')).toContain('Fix failing');
    expect(result.recommendations.join('\n')).toContain('Collect broader');
    expect(result.actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          id: 'resolve-missing-report',
          commands: ['node dist/cli/calibrate-reader-response.js --project <project> --json'],
        }),
      ])
    );
  });

  it('treats stalled series hook ledgers as a 98+ readiness blocker', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const seriesRetention = inputs.find(input => input.id === 'series-retention');
    if (!seriesRetention) throw new Error('Missing series-retention fixture');
    seriesRetention.report = {
      benchmark: {
        total: 4,
        failed: 1,
        accuracy: 0.99,
        readyForGateTuning: true,
        hookStallCount: 1,
        recommendations: ['Revise sequences whose active question threads stall.'],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('at-risk');
    expect(result.atRiskAreas).toEqual(['series-retention']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'series-retention',
          code: 'hook-stall-count',
          severity: 'critical',
        }),
      ])
    );
  });

  it('treats repetitive series emotional arcs as a 98+ readiness blocker', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const seriesRetention = inputs.find(input => input.id === 'series-retention');
    if (!seriesRetention) throw new Error('Missing series-retention fixture');
    seriesRetention.report = {
      benchmark: {
        total: 4,
        failed: 1,
        accuracy: 0.99,
        readyForGateTuning: true,
        repetitiveEmotionalPatternCount: 1,
        recommendations: ['Vary emotional signatures across consecutive chapters.'],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('at-risk');
    expect(result.atRiskAreas).toEqual(['series-retention']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'series-retention',
          code: 'repetitive-emotional-pattern-count',
          severity: 'critical',
        }),
      ])
    );
  });

  it('surfaces weak character relationship focus evidence in 98+ readiness', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const characterRelationship = inputs.find(input => input.id === 'character-relationship');
    if (!characterRelationship) throw new Error('Missing character-relationship fixture');
    characterRelationship.report = {
      benchmark: {
        total: 4,
        failed: 0,
        accuracy: 1,
        readyForGateTuning: false,
        weakFocusEvidenceCount: 2,
        recommendations: ['Add focus evidence to character relationship samples.'],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('needs-evidence');
    expect(result.needsEvidenceAreas).toEqual(['character-relationship']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'character-relationship',
          code: 'weak-focus-evidence-count',
          severity: 'major',
        }),
      ])
    );
    expect(result.actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'character-relationship',
          id: 'resolve-weak-focus-evidence-count',
          commands: ['node dist/cli/run-character-relationship-benchmark.js --project <project> --json'],
        }),
      ])
    );
  });

  it('surfaces weak premise promise evidence in 98+ readiness', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const premise = inputs.find(input => input.id === 'premise-appeal');
    if (!premise) throw new Error('Missing premise-appeal fixture');
    premise.report = {
      benchmark: {
        total: 4,
        failed: 0,
        accuracy: 1,
        readyForGateTuning: false,
        weakPromiseEvidenceCount: 2,
        recommendations: ['Add premise promise evidence to premise appeal samples.'],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('needs-evidence');
    expect(result.needsEvidenceAreas).toEqual(['premise-appeal']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'premise-appeal',
          code: 'weak-promise-evidence-count',
          severity: 'major',
        }),
      ])
    );
    expect(result.actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'premise-appeal',
          id: 'resolve-weak-promise-evidence-count',
          commands: ['node dist/cli/run-premise-appeal-benchmark.js --project <project> --json'],
        }),
      ])
    );
  });

  it('treats long-form consistency as required 5-domain evidence', () => {
    const result = evaluateMasterpieceReadiness([
      ...AREAS
        .filter(area => area !== 'long-form-consistency')
        .map(area => buildReadyInput(area)),
      {
        id: 'long-form-consistency',
        report: {
          checked_at: '2026-06-21T00:00:00.000Z',
          chapter_range: { start: 1, end: 2 },
          total_issues: 3,
          issues: [
            {
              type: 'timeline_conflict',
              severity: 'critical',
              description: 'Chapter 2 contradicts the established day sequence.',
              location: { chapter: 2 },
            },
            {
              type: 'world_contradiction',
              severity: 'major',
              description: 'Magic rule changes without setup.',
              location: { chapter: 2 },
            },
            {
              type: 'dialogue_inconsistency',
              severity: 'minor',
              description: 'A name spelling drifts.',
              location: { chapter: 1 },
            },
          ],
          domain_coverage: {
            character: true,
            timeline: true,
            setting: true,
          },
        },
      },
    ]);

    expect(result.passed).toBe(false);
    expect(result.atRiskAreas).toEqual(['long-form-consistency']);
    expect(result.gaps.map(gap => gap.code)).toEqual(
      expect.arrayContaining([
        'critical-consistency-issue-count',
        'major-consistency-issue-count',
        'minor-consistency-issue-count',
        'missing-required-consistency-domains',
        'under-sampled-consistency-chapters',
      ])
    );
    expect(result.areaResults.find(area => area.id === 'long-form-consistency')).toMatchObject({
      status: 'at-risk',
      totalSamples: 2,
      readyForTuning: false,
    });
  });

  it('rejects ready-looking reports with no source evidence files', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const proseTaste = inputs.find(input => input.id === 'prose-taste');
    if (!proseTaste) throw new Error('Missing prose-taste fixture');
    proseTaste.freshness = {
      stale: false,
      sourcePathCount: 0,
      sourceEvidenceStatus: 'no-sources',
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('at-risk');
    expect(result.atRiskAreas).toEqual(['prose-taste']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'prose-taste',
          code: 'no-source-evidence',
          severity: 'critical',
        }),
      ])
    );
  });

  it('treats missing human reader provenance as weak reader response evidence', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const readerResponse = inputs.find(input => input.id === 'reader-response');
    if (!readerResponse) throw new Error('Missing reader-response fixture');
    readerResponse.report = {
      calibration: {
        total: 4,
        failed: 0,
        accuracy: 1,
        readyForGateTuning: false,
        lowHumanReaderEvidenceCount: 2,
        lowResponseDataQualityCount: 2,
        lowRevisionOutcomeEvidenceCount: 1,
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
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('needs-evidence');
    expect(result.needsEvidenceAreas).toEqual(['reader-response']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-human-reader-evidence-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-response-data-quality-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-revision-outcome-evidence-count',
          severity: 'major',
        }),
      ])
    );
    expect(result.areaResults.find(area => area.id === 'reader-response')?.actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          id: 'record-human-reader-provenance',
          priority: 'critical',
          sampleIds: ['panel-1', 'panel-2'],
          commands: ['node dist/cli/calibrate-reader-response.js --project <project> --json'],
        }),
      ])
    );
    expect(result.actionPlan[0]).toMatchObject({
      area: 'reader-response',
      id: 'record-human-reader-provenance',
      priority: 'critical',
    });
  });

  it('treats weak annotation reliability and delayed memory as reader response evidence gaps', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const readerResponse = inputs.find(input => input.id === 'reader-response');
    if (!readerResponse) throw new Error('Missing reader-response fixture');
    readerResponse.report = {
      calibration: {
        total: 4,
        failed: 0,
        accuracy: 1,
        readyForGateTuning: false,
        lowAnnotationReliabilityCount: 2,
        lowDelayedMemoryEvidenceCount: 3,
        lowLineQuoteEvidenceCount: 1,
        evidenceCollectionPlan: [
          {
            id: 'record-annotation-reliability',
            priority: 'major',
            target: 'annotation-coding-reliability',
            currentValue: '2/4 usable',
            requiredValue: 'all tuning samples with usable annotation coding reliability',
            sampleIds: ['panel-1', 'panel-2'],
            action: 'Record double coding, agreement metric, codebook version, adjudication, and coder blinding.',
            rationale: 'Reader comments cannot drive hard rewrite gates unless the annotation coding is reproducible.',
          },
          {
            id: 'collect-delayed-memory-evidence',
            priority: 'major',
            target: 'delayed-memory-follow-up',
            currentValue: '1/4 usable',
            requiredValue: 'all tuning samples with delayed memory follow-up evidence',
            sampleIds: ['panel-2', 'panel-3', 'panel-4'],
            action: 'Run delayed follow-up surveys and record scene recall, character recall, continuation intent, and delayed memory annotations.',
            rationale: 'Immediate liking can overstate long-form pull if readers cannot remember or want the story later.',
          },
          {
            id: 'collect-line-quote-evidence',
            priority: 'major',
            target: 'memorable-line-quote',
            currentValue: '3/4 usable',
            requiredValue: 'all tuning samples with quote recall and line quote annotations',
            sampleIds: ['panel-4'],
            action: 'Record quote recall, favorite line, shareable line, and line quote annotations.',
            rationale: 'Reader-response tuning should know whether the prose has memorable lines, not only low friction.',
          },
        ],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('needs-evidence');
    expect(result.needsEvidenceAreas).toEqual(['reader-response']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-annotation-reliability-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-delayed-memory-evidence-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-line-quote-evidence-count',
          severity: 'major',
        }),
      ])
    );
    expect(result.actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          id: 'record-annotation-reliability',
          commands: ['node dist/cli/calibrate-reader-response.js --project <project> --json'],
        }),
        expect.objectContaining({
          area: 'reader-response',
          id: 'collect-delayed-memory-evidence',
          commands: ['node dist/cli/calibrate-reader-response.js --project <project> --json'],
        }),
        expect.objectContaining({
          area: 'reader-response',
          id: 'collect-line-quote-evidence',
          commands: ['node dist/cli/calibrate-reader-response.js --project <project> --json'],
        }),
      ])
    );
  });

  it('surfaces reader response calibration drift and exact evidence blocker fields', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const readerResponse = inputs.find(input => input.id === 'reader-response');
    if (!readerResponse) throw new Error('Missing reader-response fixture');
    readerResponse.report = {
      calibration: {
        total: 4,
        failed: 0,
        accuracy: 1,
        readyForGateTuning: false,
        overestimateCount: 1,
        underestimateCount: 1,
        lowActionabilityCount: 2,
        lowRepresentativenessCount: 2,
        lowProtocolQualityCount: 1,
        missingComparativePreferenceCount: 3,
        evidenceCollectionPlan: [
          {
            id: 'collect-actionable-friction-evidence',
            priority: 'major',
            target: 'reader-friction-actionability',
            currentValue: '2/4 usable',
            requiredValue: 'usable actionable friction evidence',
            sampleIds: ['panel-1', 'panel-2'],
            action: 'Collect location-specific reader friction annotations with rewrite suggestions.',
            rationale: 'Low reader scores must identify where and how readers disengaged.',
          },
          {
            id: 'balance-target-reader-cohorts',
            priority: 'major',
            target: 'target-reader-representativeness',
            currentValue: '2/4 balanced',
            requiredValue: 'balanced target-reader cohorts',
            sampleIds: ['panel-2', 'panel-3'],
            action: 'Recruit broader target-reader cohorts.',
            rationale: 'A narrow cohort should not define the global tuning target.',
          },
          {
            id: 'strengthen-reader-panel-protocol',
            priority: 'critical',
            target: 'reader-panel-protocol',
            currentValue: '3/4 strong',
            requiredValue: 'strong protocol evidence',
            sampleIds: ['panel-4'],
            action: 'Record blind reading, neutral wording, disclosed recruitment, attention checks, and exclusions.',
            rationale: 'Reader-panel findings need protocol controls before hard threshold tuning.',
          },
          {
            id: 'run-blind-comparative-preference-test',
            priority: 'critical',
            target: 'comparative-preference',
            currentValue: '1/4 strong',
            requiredValue: 'blind reference-chapter preference evidence',
            sampleIds: ['panel-1', 'panel-2', 'panel-3'],
            action: 'Run blind pairwise preference tests against reference chapters.',
            rationale: 'Absolute reader scores can look strong while readers still prefer a market reference chapter.',
          },
        ],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('needs-evidence');
    expect(result.needsEvidenceAreas).toEqual(['reader-response']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          code: 'overestimate-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'underestimate-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-actionability-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-representativeness-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-protocol-quality-count',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'missing-comparative-preference-count',
          severity: 'major',
        }),
      ])
    );
    expect(result.actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          id: 'collect-actionable-friction-evidence',
        }),
        expect.objectContaining({
          area: 'reader-response',
          id: 'balance-target-reader-cohorts',
        }),
        expect.objectContaining({
          area: 'reader-response',
          id: 'strengthen-reader-panel-protocol',
        }),
        expect.objectContaining({
          area: 'reader-response',
          id: 'run-blind-comparative-preference-test',
        }),
      ])
    );
  });

  it('treats low reader calibration score and high reader score error as evidence gaps', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const readerResponse = inputs.find(input => input.id === 'reader-response');
    if (!readerResponse) throw new Error('Missing reader-response fixture');
    readerResponse.report = {
      calibration: {
        total: 4,
        failed: 0,
        calibrationScore: 92,
        meanAbsoluteError: 7,
        readyForGateTuning: true,
        recommendations: [],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);
    const readerArea = result.areaResults.find(area => area.id === 'reader-response');

    expect(result.passed).toBe(false);
    expect(result.status).toBe('needs-evidence');
    expect(result.needsEvidenceAreas).toEqual(['reader-response']);
    expect(readerArea?.accuracy).toBe(0.92);
    expect(readerArea?.score).toBeLessThan(98);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          code: 'low-calibration-score',
          severity: 'major',
        }),
        expect.objectContaining({
          area: 'reader-response',
          code: 'high-mean-absolute-error',
          severity: 'major',
        }),
      ])
    );
    expect(result.actionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          id: 'resolve-low-calibration-score',
          commands: ['node dist/cli/calibrate-reader-response.js --project <project> --json'],
        }),
        expect.objectContaining({
          area: 'reader-response',
          id: 'resolve-high-mean-absolute-error',
          commands: ['node dist/cli/calibrate-reader-response.js --project <project> --json'],
        }),
      ])
    );
  });

  it('treats revision regression as a critical reader response risk', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const readerResponse = inputs.find(input => input.id === 'reader-response');
    if (!readerResponse) throw new Error('Missing reader-response fixture');
    readerResponse.report = {
      calibration: {
        total: 4,
        failed: 0,
        accuracy: 1,
        readyForGateTuning: false,
        revisionRegressionCount: 1,
        recommendations: ['Investigate revised drafts that regressed against baseline.'],
      },
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('at-risk');
    expect(result.atRiskAreas).toEqual(['reader-response']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'reader-response',
          code: 'revision-regression-count',
          severity: 'critical',
        }),
      ])
    );
  });

  it('rejects consistency reports that claim chapter ids missing from source evidence', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const consistency = inputs.find(input => input.id === 'long-form-consistency');
    if (!consistency) throw new Error('Missing long-form-consistency fixture');
    consistency.freshness = {
      stale: false,
      sourcePathCount: 2,
      sourceEvidenceStatus: 'matched',
      sourceGroups: [
        {
          id: 'chapters',
          label: 'Chapter metadata and manuscripts',
          required: true,
          pathCount: 2,
          paths: [
            'chapters/chapter_001.json',
            'chapters/chapter_001.md',
          ],
        },
      ],
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('at-risk');
    expect(result.atRiskAreas).toEqual(['long-form-consistency']);
    expect(result.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'long-form-consistency',
          code: 'consistency-source-chapter-id-mismatch',
          severity: 'critical',
        }),
      ])
    );
    expect(result.gaps.map(gap => gap.code)).not.toContain('consistency-source-chapter-mismatch');
  });

  it('rejects consistency reports when chapter source ids exist without manuscripts', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const consistency = inputs.find(input => input.id === 'long-form-consistency');
    if (!consistency) throw new Error('Missing long-form-consistency fixture');
    consistency.freshness = {
      stale: false,
      sourcePathCount: 4,
      sourceEvidenceStatus: 'matched',
      sourceGroups: [
        {
          id: 'chapters',
          label: 'Chapter metadata and manuscripts',
          required: true,
          pathCount: 4,
          paths: [
            'chapters/chapter_001.json',
            'chapters/chapter_001.md',
            'chapters/chapter_002.json',
            'chapters/chapter_003.json',
          ],
        },
      ],
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('at-risk');
    expect(result.atRiskAreas).toEqual(['long-form-consistency']);
    expect(result.gaps.map(gap => gap.code)).toContain('consistency-source-manuscript-id-mismatch');
    expect(result.gaps.map(gap => gap.code)).not.toContain('consistency-source-manuscript-mismatch');
  });

  it('rejects consistency reports when source chapter ids differ from claimed chapter ids', () => {
    const inputs = AREAS.map(area => buildReadyInput(area));
    const consistency = inputs.find(input => input.id === 'long-form-consistency');
    if (!consistency) throw new Error('Missing long-form-consistency fixture');
    consistency.freshness = {
      stale: false,
      sourcePathCount: 6,
      sourceEvidenceStatus: 'matched',
      sourceGroups: [
        {
          id: 'chapters',
          label: 'Chapter metadata and manuscripts',
          required: true,
          pathCount: 6,
          paths: [
            'chapters/chapter_004.json',
            'chapters/chapter_004.md',
            'chapters/chapter_005.json',
            'chapters/chapter_005.md',
            'chapters/chapter_006.json',
            'chapters/chapter_006.md',
          ],
        },
      ],
    };

    const result = evaluateMasterpieceReadiness(inputs);

    expect(result.passed).toBe(false);
    expect(result.status).toBe('at-risk');
    expect(result.atRiskAreas).toEqual(['long-form-consistency']);
    expect(result.gaps.map(gap => gap.code)).toContain('consistency-source-chapter-id-mismatch');
    expect(result.gaps.map(gap => gap.code)).not.toContain('consistency-source-chapter-mismatch');
  });
});

function buildReadyInput(area: MasterpieceReadinessAreaId): MasterpieceReadinessAreaInput {
  if (area === 'long-form-consistency') {
    return {
      id: area,
      report: buildReadyConsistencyReport(),
    };
  }

  const key = area === 'reader-response' ? 'calibration' : 'benchmark';
  const readyKey = area === 'prose-taste' ? 'readyForStyleTuning' : 'readyForGateTuning';
  return {
    id: area,
    report: {
      [key]: {
        total: 4,
        failed: 0,
        accuracy: 1,
        [readyKey]: true,
        recommendations: [],
      },
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
