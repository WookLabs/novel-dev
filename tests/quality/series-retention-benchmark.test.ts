import { describe, expect, it } from 'vitest';

import {
  evaluateSeriesRetentionBenchmark,
  type SeriesRetentionBenchmarkSample,
  type SeriesRetentionEmotionalSignatureFamily,
} from '../../src/index.js';

describe('evaluateSeriesRetentionBenchmark', () => {
  it('catches automated series retention false positives with reader fatigue and repeated rewards', () => {
    const samples: SeriesRetentionBenchmarkSample[] = [
      {
        id: 'reader-retained-sequence',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        chapters: [
          retainedChapter(7, 91, 'first-alert-rescue'),
          retainedChapter(8, 90, 'cold-case-clue'),
          retainedChapter(9, 92, 'partner-risk-choice'),
        ],
      },
      {
        id: 'auto-high-reader-fatigued-sequence',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: false,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: [
          fatiguedChapter(10, 88, 5),
          fatiguedChapter(11, 90, 4),
          fatiguedChapter(12, 89, 3),
        ],
      },
    ];

    const result = evaluateSeriesRetentionBenchmark(samples, {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRetentionDrop: 12,
      maximumRepeatedRewardSignatureRun: 2,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
    });

    expect(result).toMatchObject({
      total: 2,
      passed: 1,
      failed: 1,
      automatedFalsePositiveCount: 1,
      automatedFalseNegativeCount: 0,
      readerLabelMismatchCount: 0,
      weakReaderRetentionCount: 1,
      retentionDropCount: 1,
      hookStallCount: 1,
      weakHookProgressEvidenceCount: 0,
      repetitiveRewardPatternCount: 1,
      repetitiveEmotionalPatternCount: 1,
      insufficientEvidenceCount: 0,
      shortSequenceCount: 0,
      genreCoverage: {
        mystery: {
          total: 2,
          positive: 1,
          negative: 1,
        },
      },
      targetReaderCoverage: {
        'webnovel-core': {
          total: 2,
          positive: 1,
          negative: 1,
        },
      },
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
      readyForGateTuning: true,
    });
    expect(result.sampleResults[0]).toMatchObject({
      id: 'reader-retained-sequence',
      passed: true,
      readerPassed: true,
      automatedPassed: true,
      sequenceLength: 3,
      calibrationSplit: 'calibration',
      funnelEvidence: 'usable',
      hookProgressEvidence: 'usable',
      repeatedRewardSignatureRun: 1,
      weakDimensions: [],
    });
    expect(result.sampleResults[1]).toMatchObject({
      id: 'auto-high-reader-fatigued-sequence',
      passed: false,
      readerPassed: false,
      automatedPassed: true,
      sequenceLength: 3,
      calibrationSplit: 'holdout',
      funnelEvidence: 'usable',
      hookProgressEvidence: 'usable',
      funnelDropChapterCount: 2,
      hookStallChapterCount: 3,
      repeatedRewardSignatureRun: 3,
      repeatedEmotionalSignatureRun: 3,
    });
    expect(result.sampleResults[1].failureTypes).toEqual(
      expect.arrayContaining([
        'automated-false-positive',
        'weak-reader-retention',
        'weak-dimension',
        'reader-retention-drop',
        'reader-funnel-drop',
        'reader-hook-stall',
        'repetitive-reward-pattern',
        'repetitive-emotional-pattern',
      ])
    );
    expect(result.sampleResults[1].retentionDrop).toBeGreaterThan(12);
    expect(result.sampleResults[1].weakDimensions).toEqual(
      expect.arrayContaining(['fatigue_resistance', 'reward_variety', 'novelty'])
    );
  });

  it('catches repeated emotional arcs even when reward signatures vary', () => {
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'emotional-variety-control',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        chapters: [
          retainedChapter(1, 91, 'setup-choice'),
          retainedChapter(2, 90, 'clue-payoff'),
          retainedChapter(3, 92, 'relationship-cost'),
        ],
      },
      {
        id: 'varied-reward-same-emotional-ending',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: false,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: [
          emotionalLoopChapter(4, 91, 'coded-note-discovery'),
          emotionalLoopChapter(5, 92, 'ally-pressure-choice'),
          emotionalLoopChapter(6, 90, 'location-rule-break'),
        ],
      },
    ], {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRetentionDrop: 12,
      maximumRepeatedRewardSignatureRun: 2,
      maximumRepeatedEmotionalSignatureRun: 2,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
    });

    expect(result).toMatchObject({
      total: 2,
      failed: 1,
      automatedFalsePositiveCount: 1,
      repetitiveRewardPatternCount: 0,
      repetitiveEmotionalPatternCount: 1,
      readyForGateTuning: true,
    });
    const emotionalLoop = result.sampleResults.find(
      sample => sample.id === 'varied-reward-same-emotional-ending'
    );
    expect(emotionalLoop).toMatchObject({
      readerPassed: false,
      automatedPassed: true,
      repeatedRewardSignatureRun: 1,
      repeatedEmotionalSignatureRun: 3,
      weakDimensions: [],
      failureTypes: expect.arrayContaining([
        'automated-false-positive',
        'repetitive-emotional-pattern',
      ]),
    });
    expect(emotionalLoop?.failureTypes).not.toContain('repetitive-reward-pattern');
    expect(emotionalLoop?.recommendations.join('\n')).toContain('Emotional signature repeats');
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('emotional-arc diversity'),
      ])
    );
  });

  it('normalizes equivalent emotional signatures before repeated affect checks', () => {
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'synonym-emotional-loop',
        genre: 'thriller',
        targetReader: 'webnovel-core',
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: [
          equivalentEmotionLoopChapter(
            11,
            91,
            'elevator-threat',
            'dread-shock-deferral'
          ),
          equivalentEmotionLoopChapter(
            12,
            92,
            'witness-pressure-choice',
            'fear-surprise-delay'
          ),
          equivalentEmotionLoopChapter(
            13,
            90,
            'evidence-route-lock',
            'anxiety-stunned-postponement'
          ),
        ],
      },
    ], {
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRepeatedRewardSignatureRun: 2,
      maximumRepeatedEmotionalSignatureRun: 2,
    });

    expect(result).toMatchObject({
      total: 1,
      passed: 0,
      failed: 1,
      repetitiveRewardPatternCount: 0,
      repetitiveEmotionalPatternCount: 1,
    });
    expect(result.sampleResults[0]).toMatchObject({
      id: 'synonym-emotional-loop',
      readerPassed: false,
      automatedPassed: true,
      repeatedRewardSignatureRun: 1,
      repeatedEmotionalSignatureRun: 3,
      failureTypes: expect.arrayContaining(['repetitive-emotional-pattern']),
    });
    expect(result.sampleResults[0].failureTypes).not.toContain('reader-label-mismatch');
  });

  it('uses explicit emotional signature families for localized affect labels', () => {
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'localized-emotional-family-loop',
        genre: 'thriller',
        targetReader: 'webnovel-core',
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: [
          explicitEmotionFamilyChapter(21, 91, 'elevator-threat', '불안한 보류', 'dread'),
          explicitEmotionFamilyChapter(22, 92, 'witness-pressure-choice', '충격 후 지연', 'dread'),
          explicitEmotionFamilyChapter(23, 90, 'evidence-route-lock', '공포의 미해결', 'dread'),
        ],
      },
    ], {
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRepeatedRewardSignatureRun: 2,
      maximumRepeatedEmotionalSignatureRun: 2,
    });

    expect(result).toMatchObject({
      total: 1,
      failed: 1,
      repetitiveRewardPatternCount: 0,
      repetitiveEmotionalPatternCount: 1,
    });
    expect(result.sampleResults[0]).toMatchObject({
      id: 'localized-emotional-family-loop',
      repeatedRewardSignatureRun: 1,
      repeatedEmotionalSignatureRun: 3,
      failureTypes: expect.arrayContaining(['repetitive-emotional-pattern']),
    });
    expect(result.sampleResults[0].chapterResults[0]).toMatchObject({
      emotionalSignature: '불안한 보류',
      emotionalSignatureFamily: 'dread',
    });
  });

  it('catches concentrated emotional palettes without requiring consecutive repeated endings', () => {
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'dread-dominant-nonconsecutive-palette',
        genre: 'thriller',
        targetReader: 'webnovel-core',
        expectedRetained: false,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: [
          explicitEmotionFamilyChapter(31, 91, 'elevator-threat', '불안한 보류', 'dread'),
          explicitEmotionFamilyChapter(32, 92, 'ally-cost-choice', '단서 호기심', 'curiosity'),
          explicitEmotionFamilyChapter(33, 90, 'evidence-route-lock', '공포가 남은 선택', 'dread'),
          explicitEmotionFamilyChapter(34, 91, 'witness-risk-choice', '불안한 확인', 'dread'),
        ],
      },
    ], {
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRepeatedRewardSignatureRun: 2,
      maximumRepeatedEmotionalSignatureRun: 2,
      maximumDominantEmotionalSignatureFamilyShare: 0.67,
    });

    expect(result).toMatchObject({
      total: 1,
      failed: 1,
      automatedFalsePositiveCount: 1,
      repetitiveRewardPatternCount: 0,
      repetitiveEmotionalPatternCount: 0,
      narrowEmotionalPaletteCount: 1,
    });
    expect(result.sampleResults[0]).toMatchObject({
      id: 'dread-dominant-nonconsecutive-palette',
      readerPassed: false,
      automatedPassed: true,
      repeatedRewardSignatureRun: 1,
      repeatedEmotionalSignatureRun: 2,
      dominantEmotionalSignatureFamily: 'dread',
      dominantEmotionalSignatureFamilyShare: 0.75,
      failureTypes: expect.arrayContaining([
        'automated-false-positive',
        'narrow-emotional-palette',
      ]),
    });
    expect(result.sampleResults[0].failureTypes).not.toContain('repetitive-emotional-pattern');
    expect(result.sampleResults[0].recommendations.join('\n')).toContain(
      'Dominant emotional family dread covers 75%'
    );
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('emotional palette concentration holdouts'),
      ])
    );
  });

  it('rejects split leakage when the same chapter sequence appears in calibration and holdout', () => {
    const retainedSequence = [
      retainedChapter(7, 91, 'first-alert-rescue'),
      retainedChapter(8, 90, 'cold-case-clue'),
      retainedChapter(9, 92, 'partner-risk-choice'),
    ];
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'series-calibration',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        chapters: retainedSequence,
      },
      {
        id: 'series-holdout-duplicate',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: true,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: retainedSequence,
      },
      {
        id: 'series-known-drop-holdout',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: false,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: [
          fatiguedChapter(10, 88, 5),
          fatiguedChapter(11, 90, 4),
          fatiguedChapter(12, 89, 3),
        ],
      },
    ], {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRetentionDrop: 12,
      maximumRepeatedRewardSignatureRun: 2,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
    });

    expect(result.splitLeakageCount).toBe(1);
    expect(result.splitLeakages[0]).toMatchObject({
      sampleIds: ['series-calibration', 'series-holdout-duplicate'],
      calibrationSplits: ['calibration', 'holdout'],
    });
    expect(result.splitLeakages[0].fingerprint).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(result.sampleResults[0].evidenceFingerprint).toBe(
      result.sampleResults[1].evidenceFingerprint
    );
    expect(result.underSampledHoldoutSamples).toBe(false);
    expect(result.underSampledUsableFailingHoldoutSamples).toBe(false);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations.join('\n')).toContain('same chapter sequence');
  });

  it('keeps gate tuning disabled when series retention evidence is calibration-only', () => {
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'reader-retained-sequence',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        chapters: [
          retainedChapter(7, 91, 'first-alert-rescue'),
          retainedChapter(8, 90, 'cold-case-clue'),
          retainedChapter(9, 92, 'partner-risk-choice'),
        ],
      },
      {
        id: 'calibration-only-fatigued-sequence',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: false,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        chapters: [
          fatiguedChapter(10, 88, 5),
          fatiguedChapter(11, 90, 4),
          fatiguedChapter(12, 89, 3),
        ],
      },
    ], {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRetentionDrop: 12,
      maximumRepeatedRewardSignatureRun: 2,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
    });

    expect(result.splitCoverage).toMatchObject({
      calibrationSamples: 2,
      holdoutSamples: 0,
      usableHoldoutSamples: 0,
      failingHoldoutSamples: 0,
      usableFailingHoldoutSamples: 0,
    });
    expect(result.underSampledHoldoutSamples).toBe(true);
    expect(result.underSampledUsableHoldoutSamples).toBe(true);
    expect(result.underSampledFailingHoldoutSamples).toBe(true);
    expect(result.underSampledUsableFailingHoldoutSamples).toBe(true);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('series retention holdout'),
        expect.stringContaining('known-drop series holdout'),
      ])
    );
  });

  it('catches survivor-biased sequences when remaining reader scores are high but the funnel drops', () => {
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'fantasy-retained-control',
        genre: 'fantasy',
        targetReader: 'webnovel-core',
        expectedRetained: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        chapters: [
          retainedChapter(1, 91, 'artifact-choice'),
          retainedChapter(2, 90, 'rule-cost'),
          retainedChapter(3, 92, 'ally-risk'),
        ],
      },
      {
        id: 'high-score-low-funnel-sequence',
        genre: 'fantasy',
        targetReader: 'webnovel-core',
        expectedRetained: false,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: [
          survivorBiasedChapter(1, 90, 120, 110, 58, 8, 12),
          survivorBiasedChapter(2, 91, 58, 52, 24, 5, 13),
          survivorBiasedChapter(3, 90, 24, 20, 9, 3, 6),
        ],
      },
    ], {
      requiredGenres: ['fantasy'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRetentionDrop: 12,
      maximumRepeatedRewardSignatureRun: 2,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
    });

    expect(result).toMatchObject({
      total: 2,
      passed: 1,
      failed: 1,
      automatedFalsePositiveCount: 1,
      weakReaderRetentionCount: 0,
      weakDimensionCount: 0,
      funnelDropCount: 1,
      weakFunnelEvidenceCount: 0,
      insufficientEvidenceCount: 0,
      readyForGateTuning: true,
    });
    const survivorBiasedResult = result.sampleResults.find(
      sample => sample.id === 'high-score-low-funnel-sequence'
    );
    expect(survivorBiasedResult).toMatchObject({
      id: 'high-score-low-funnel-sequence',
      readerRetentionScore: expect.any(Number),
      readerPassed: false,
      automatedPassed: true,
      funnelEvidence: 'usable',
      weakFunnelEvidenceChapterCount: 0,
      funnelDropChapterCount: 3,
      minimumContinuationRate: 0.375,
      maximumSkimmedReadRatio: 0.25,
      failureTypes: expect.arrayContaining([
        'automated-false-positive',
        'reader-funnel-drop',
      ]),
    });
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('chapter-level reader funnels'),
      ])
    );
  });

  it('catches high-scoring sequences whose open hook threads stall', () => {
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'hook-progress-control',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        chapters: [
          retainedChapter(1, 91, 'setup-choice'),
          retainedChapter(2, 90, 'clue-payoff'),
          retainedChapter(3, 92, 'relationship-cost'),
        ],
      },
      {
        id: 'high-score-stalled-hook-sequence',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: false,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: [
          stalledHookChapter(4, 91, 'mystery-new-question'),
          stalledHookChapter(5, 92, 'mystery-new-question'),
          stalledHookChapter(6, 90, 'mystery-new-question'),
        ],
      },
    ], {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRetentionDrop: 12,
      maximumRepeatedRewardSignatureRun: 4,
      requireHookProgressEvidence: true,
      minimumHookProgressEventCount: 1,
      minimumHookProgressRate: 0.5,
      maximumHookStallRatio: 0.5,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
    });

    expect(result).toMatchObject({
      total: 2,
      automatedFalsePositiveCount: 1,
      hookStallCount: 1,
      weakHookProgressEvidenceCount: 0,
      insufficientEvidenceCount: 0,
      readyForGateTuning: true,
    });
    const stalled = result.sampleResults.find(
      sample => sample.id === 'high-score-stalled-hook-sequence'
    );
    expect(stalled).toMatchObject({
      readerPassed: false,
      automatedPassed: true,
      hookProgressEvidence: 'usable',
      weakHookProgressEvidenceChapterCount: 0,
      hookStallChapterCount: 3,
      minimumHookProgressRate: 0,
      maximumHookStallRatio: 1,
      failureTypes: expect.arrayContaining([
        'automated-false-positive',
        'reader-hook-stall',
      ]),
    });
    expect(stalled?.recommendations.join('\n')).toContain('stalled hook progress');
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('active question threads stall'),
      ])
    );
  });

  it('keeps gate tuning disabled when required hook progress evidence is missing', () => {
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'missing-hook-ledger-control',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        chapters: [
          withoutHookProgress(retainedChapter(1, 91, 'setup-choice')),
          withoutHookProgress(retainedChapter(2, 90, 'clue-payoff')),
          withoutHookProgress(retainedChapter(3, 92, 'relationship-cost')),
        ],
      },
      {
        id: 'missing-hook-ledger-holdout',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: false,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        chapters: [
          withoutHookProgress(fatiguedChapter(10, 88, 5)),
          withoutHookProgress(fatiguedChapter(11, 90, 4)),
          withoutHookProgress(fatiguedChapter(12, 89, 3)),
        ],
      },
    ], {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumSequenceLength: 3,
      maximumRetentionDrop: 12,
      maximumRepeatedRewardSignatureRun: 2,
      requireHookProgressEvidence: true,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
    });

    expect(result).toMatchObject({
      weakHookProgressEvidenceCount: 2,
      hookStallCount: 0,
      readyForGateTuning: false,
    });
    expect(result.sampleResults[0]).toMatchObject({
      hookProgressEvidence: 'none',
      weakHookProgressEvidenceChapterCount: 3,
      failureTypes: expect.arrayContaining(['weak-hook-progress-evidence']),
    });
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('per-chapter hook progress ledger counts'),
      ])
    );
  });

  it('reports missing polarity and target-reader coverage', () => {
    const result = evaluateSeriesRetentionBenchmark([
      {
        id: 'mystery-positive-only',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        expectedRetained: true,
        ratingScale: 'likert-7',
        chapters: [
          retainedChapter(1, 91, 'setup-choice'),
          retainedChapter(2, 90, 'clue-payoff'),
          retainedChapter(3, 92, 'relationship-cost'),
        ],
      },
    ], {
      requiredGenres: ['mystery', 'romance'],
      requiredTargetReaders: ['webnovel-core', 'romance-core'],
      minimumSamplesPerGenre: 2,
      minimumSamplesPerTargetReader: 2,
    });

    expect(result.missingRequiredGenres).toEqual(['romance']);
    expect(result.underSampledRequiredGenres).toEqual(['mystery', 'romance']);
    expect(result.missingRequiredPositiveGenres).toEqual(['romance']);
    expect(result.missingRequiredNegativeGenres).toEqual(['mystery', 'romance']);
    expect(result.missingRequiredTargetReaders).toEqual(['romance-core']);
    expect(result.underSampledRequiredTargetReaders).toEqual([
      'webnovel-core',
      'romance-core',
    ]);
    expect(result.missingRequiredPositiveTargetReaders).toEqual(['romance-core']);
    expect(result.missingRequiredNegativeTargetReaders).toEqual([
      'webnovel-core',
      'romance-core',
    ]);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('known-drop series samples'),
        expect.stringContaining('romance-core'),
      ])
    );
  });
});

function retainedChapter(chapter: number, automatedScore: number, rewardSignature: string) {
  const funnel = retainedFunnel(chapter);
  return {
    chapter,
    automatedScore,
    rewardSignature,
    emotionalSignature: retainedEmotionalSignature(chapter),
    hookThread: '익명 발신자의 정체',
    ...funnel,
    ...retainedHookProgress(),
    readerResponses: [
      retainedResponse('reader-1'),
      retainedResponse('reader-2'),
      retainedResponse('reader-3'),
    ],
  };
}

function retainedResponse(readerId: string) {
  return {
    readerId,
    targetReaderFit: true,
    ratings: {
      next_click: 7,
      fatigue_resistance: 6,
      hook_progress: 6,
      reward_variety: 6,
      payoff_satisfaction: 6,
      novelty: 6,
      emotional_reset: 6,
      confidence_in_payoff: 6,
    },
    wouldContinue: true,
    wouldContinueScore: 7,
    comment: '장기 훅이 한 칸 전진하고 보상 모양도 달라져 다음 화를 계속 보고 싶다.',
    freshnessPoints: ['새 단서', '다른 보상 형태'],
    rewriteSuggestion: '다음 검증 행동을 더 짧게 선언하면 클릭감이 강해진다.',
  };
}

function fatiguedChapter(chapter: number, automatedScore: number, score: number) {
  const funnel = fatiguedFunnel(chapter);
  return {
    chapter,
    automatedScore,
    rewardSignature: 'alert-investigation-phone-check',
    emotionalSignature: 'alarm-dread-deferral',
    hookThread: '익명 발신자의 정체',
    ...funnel,
    ...stalledHookProgress(),
    readerResponses: [
      fatiguedResponse('reader-4', score),
      fatiguedResponse('reader-5', score),
      fatiguedResponse('reader-6', score),
    ],
  };
}

function survivorBiasedChapter(
  chapter: number,
  automatedScore: number,
  startedReadCount: number,
  completedReadCount: number,
  continuedReadCount: number,
  dropOffCount: number,
  skimmedReadCount: number
) {
  return {
    chapter,
    automatedScore,
    rewardSignature: `high-score-funnel-drop-${chapter}`,
    emotionalSignature: `funnel-drop-pressure-${chapter}`,
    hookThread: '왕관 문양의 봉인',
    startedReadCount,
    completedReadCount,
    continuedReadCount,
    dropOffCount,
    skimmedReadCount,
    ...retainedHookProgress(),
    readerResponses: [
      retainedResponse('survivor-1'),
      retainedResponse('survivor-2'),
      retainedResponse('survivor-3'),
    ],
  };
}

function stalledHookChapter(chapter: number, automatedScore: number, rewardSignature: string) {
  const base = retainedChapter(chapter, automatedScore, rewardSignature);
  return {
    ...base,
    ...stalledHookProgress(),
  };
}

function emotionalLoopChapter(chapter: number, automatedScore: number, rewardSignature: string) {
  const base = retainedChapter(chapter, automatedScore, rewardSignature);
  return {
    ...base,
    emotionalSignature: 'dread-shock-deferral',
  };
}

function equivalentEmotionLoopChapter(
  chapter: number,
  automatedScore: number,
  rewardSignature: string,
  emotionalSignature: string
) {
  const base = retainedChapter(chapter, automatedScore, rewardSignature);
  return {
    ...base,
    emotionalSignature,
  };
}

function explicitEmotionFamilyChapter(
  chapter: number,
  automatedScore: number,
  rewardSignature: string,
  emotionalSignature: string,
  emotionalSignatureFamily: SeriesRetentionEmotionalSignatureFamily
) {
  const base = retainedChapter(chapter, automatedScore, rewardSignature);
  return {
    ...base,
    emotionalSignature,
    emotionalSignatureFamily,
  };
}

function retainedEmotionalSignature(chapter: number): string {
  const signatures: Record<number, string> = {
    1: 'discovery-pressure-to-choice',
    2: 'clue-curiosity-to-trust',
    3: 'relationship-cost-to-resolve',
    7: 'alarm-dread-to-resolve',
    8: 'cold-clue-curiosity',
    9: 'relationship-cost-resolve',
  };
  return signatures[chapter] ?? `retained-emotional-${chapter}`;
}

function withoutHookProgress<T extends {
  hookOpenThreadCount?: number;
  hookAdvancedThreadCount?: number;
  hookResolvedThreadCount?: number;
  hookRecontextualizedThreadCount?: number;
  hookNewThreadCount?: number;
  hookStalledThreadCount?: number;
}>(chapter: T) {
  const {
    hookOpenThreadCount,
    hookAdvancedThreadCount,
    hookResolvedThreadCount,
    hookRecontextualizedThreadCount,
    hookNewThreadCount,
    hookStalledThreadCount,
    ...withoutLedger
  } = chapter;
  void hookOpenThreadCount;
  void hookAdvancedThreadCount;
  void hookResolvedThreadCount;
  void hookRecontextualizedThreadCount;
  void hookNewThreadCount;
  void hookStalledThreadCount;
  return withoutLedger;
}

function retainedHookProgress() {
  return {
    hookOpenThreadCount: 2,
    hookAdvancedThreadCount: 1,
    hookResolvedThreadCount: 0,
    hookRecontextualizedThreadCount: 1,
    hookNewThreadCount: 1,
    hookStalledThreadCount: 0,
  };
}

function stalledHookProgress() {
  return {
    hookOpenThreadCount: 2,
    hookAdvancedThreadCount: 0,
    hookResolvedThreadCount: 0,
    hookRecontextualizedThreadCount: 0,
    hookNewThreadCount: 1,
    hookStalledThreadCount: 2,
  };
}

function retainedFunnel(chapter: number) {
  const byChapter: Record<number, {
    startedReadCount: number;
    completedReadCount: number;
    continuedReadCount: number;
    dropOffCount: number;
    skimmedReadCount: number;
  }> = {
    1: { startedReadCount: 100, completedReadCount: 94, continuedReadCount: 84, dropOffCount: 4, skimmedReadCount: 6 },
    2: { startedReadCount: 84, completedReadCount: 80, continuedReadCount: 72, dropOffCount: 3, skimmedReadCount: 4 },
    3: { startedReadCount: 72, completedReadCount: 70, continuedReadCount: 63, dropOffCount: 1, skimmedReadCount: 3 },
    7: { startedReadCount: 100, completedReadCount: 94, continuedReadCount: 84, dropOffCount: 4, skimmedReadCount: 6 },
    8: { startedReadCount: 84, completedReadCount: 80, continuedReadCount: 72, dropOffCount: 3, skimmedReadCount: 4 },
    9: { startedReadCount: 72, completedReadCount: 70, continuedReadCount: 63, dropOffCount: 1, skimmedReadCount: 3 },
  };
  return byChapter[chapter] ?? byChapter[1];
}

function fatiguedFunnel(chapter: number) {
  const byChapter: Record<number, {
    startedReadCount: number;
    completedReadCount: number;
    continuedReadCount: number;
    dropOffCount: number;
    skimmedReadCount: number;
  }> = {
    10: { startedReadCount: 100, completedReadCount: 85, continuedReadCount: 65, dropOffCount: 10, skimmedReadCount: 15 },
    11: { startedReadCount: 65, completedReadCount: 48, continuedReadCount: 30, dropOffCount: 13, skimmedReadCount: 18 },
    12: { startedReadCount: 30, completedReadCount: 20, continuedReadCount: 10, dropOffCount: 9, skimmedReadCount: 8 },
  };
  return byChapter[chapter] ?? byChapter[10];
}

function fatiguedResponse(readerId: string, score: number) {
  return {
    readerId,
    targetReaderFit: true,
    ratings: {
      next_click: score,
      fatigue_resistance: Math.max(1, score - 1),
      hook_progress: Math.max(1, score - 1),
      reward_variety: Math.max(1, score - 2),
      payoff_satisfaction: score,
      novelty: Math.max(1, score - 2),
      emotional_reset: Math.max(1, score - 1),
      confidence_in_payoff: score,
    },
    wouldContinue: score >= 5,
    wouldContinueScore: score,
    comment: '알림을 받고 확인한 뒤 비슷한 말미 의문으로 끝나서 반복 피로가 생긴다.',
    fatiguePoints: ['같은 시작', '같은 조사 보상', '같은 말미 질문'],
    rewriteSuggestion: '보상 형태를 관계 대가나 확정 단서로 바꾸어야 한다.',
  };
}
