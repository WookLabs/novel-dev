import { describe, expect, it } from 'vitest';

import {
  evaluatePremiseAppealBenchmark,
  type PremiseAppealBenchmarkSample,
} from '../../src/index.js';

const strongPremise = {
  target_reader: 'webnovel-core',
  core_hook: '살인을 예고하는 앱이 주인공에게만 첫 알림을 보낸다.',
  irresistible_question: '앱은 왜 아직 벌어지지 않은 살인을 알고, 왜 첫 수신자로 주인공을 골랐는가?',
  protagonist_appeal: '주인공은 공포보다 패턴을 먼저 읽고 위험을 감수해 현장으로 뛰어든다.',
  novelty_angle: '앱 예고, 과거 미제 사건 번호, 가족 실종 파일이 같은 규칙으로 연결된다.',
  emotional_payoff: '사람을 구하려는 선택이 가족 실종의 진실과 맞물리는 긴장감.',
  binge_reason: '새 알림마다 다음 수신자와 과거 사건 번호가 바뀐다.',
  long_series_engine: '예고 앱의 개발자, 과거 미제 사건, 가족 실종이 하나의 장기 미스터리로 수렴한다.',
};

const weakPremise = {
  target_reader: 'webnovel-core',
  core_hook: '살인을 예고하는 앱이 등장한다.',
  irresistible_question: '앱의 정체는 무엇인가?',
  protagonist_appeal: '주인공은 사건을 해결하려 한다.',
  novelty_angle: '앱과 살인 예고를 결합한다.',
  emotional_payoff: '긴장감과 반전을 제공한다.',
  binge_reason: '다음 사건이 이어진다.',
  long_series_engine: '앱의 비밀을 추적한다.',
};

describe('evaluatePremiseAppealBenchmark', () => {
  it('catches automated premise false positives with weak target-reader appeal', () => {
    const samples: PremiseAppealBenchmarkSample[] = [
      {
        id: 'strong-reader-approved',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: strongPremise,
        calibrationSplit: 'calibration',
        automatedScore: 92,
        expectedAppealing: true,
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
      {
        id: 'auto-high-reader-weak',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: weakPremise,
        calibrationSplit: 'holdout',
        automatedScore: 88,
        expectedAppealing: false,
        ratingScale: 'likert-7',
        readerResponses: [
          lowResponse('reader-4'),
          lowResponse('reader-5'),
          lowResponse('reader-6'),
        ],
      },
    ];

    const result = evaluatePremiseAppealBenchmark(samples, {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
    });

    expect(result).toMatchObject({
      total: 2,
      passed: 1,
      failed: 1,
      automatedFalsePositiveCount: 1,
      automatedFalseNegativeCount: 0,
      readerLabelMismatchCount: 0,
      insufficientEvidenceCount: 0,
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
      id: 'strong-reader-approved',
      passed: true,
      readerPassed: true,
      automatedPassed: true,
      weakDimensions: [],
      calibrationSplit: 'calibration',
    });
    expect(result.sampleResults[1]).toMatchObject({
      id: 'auto-high-reader-weak',
      passed: false,
      readerPassed: false,
      automatedPassed: true,
      calibrationSplit: 'holdout',
    });
    expect(result.sampleResults[1].failureTypes).toEqual(
      expect.arrayContaining([
        'automated-false-positive',
        'weak-reader-appeal',
        'weak-dimension',
      ])
    );
    expect(result.sampleResults[1].weakDimensions).toEqual(
      expect.arrayContaining(['curiosity_gap', 'protagonist_investment'])
    );
  });

  it('rejects split leakage when the same premise evidence appears in calibration and holdout', () => {
    const result = evaluatePremiseAppealBenchmark([
      {
        id: 'premise-calibration',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: strongPremise,
        calibrationSplit: 'calibration',
        automatedScore: 92,
        expectedAppealing: true,
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
      {
        id: 'premise-holdout-duplicate',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: strongPremise,
        calibrationSplit: 'holdout',
        automatedScore: 92,
        expectedAppealing: true,
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-4'),
          highResponse('reader-5'),
          highResponse('reader-6'),
        ],
      },
      {
        id: 'premise-known-bad-holdout',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: weakPremise,
        calibrationSplit: 'holdout',
        automatedScore: 88,
        expectedAppealing: false,
        ratingScale: 'likert-7',
        readerResponses: [
          lowResponse('reader-7'),
          lowResponse('reader-8'),
          lowResponse('reader-9'),
        ],
      },
    ], {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
    });

    expect(result.splitLeakageCount).toBe(1);
    expect(result.splitLeakages[0]).toMatchObject({
      sampleIds: ['premise-calibration', 'premise-holdout-duplicate'],
      calibrationSplits: ['calibration', 'holdout'],
    });
    expect(result.splitLeakages[0].fingerprint).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(result.sampleResults[0].evidenceFingerprint).toBe(
      result.sampleResults[1].evidenceFingerprint
    );
    expect(result.underSampledHoldoutSamples).toBe(false);
    expect(result.underSampledUsableFailingHoldoutSamples).toBe(false);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations.join('\n')).toContain('same reader-promise premise');
  });

  it('keeps gate tuning disabled when premise evidence is calibration-only', () => {
    const samples: PremiseAppealBenchmarkSample[] = [
      {
        id: 'strong-reader-approved',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: strongPremise,
        calibrationSplit: 'calibration',
        automatedScore: 92,
        expectedAppealing: true,
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
      {
        id: 'auto-high-reader-weak',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: weakPremise,
        calibrationSplit: 'calibration',
        automatedScore: 88,
        expectedAppealing: false,
        ratingScale: 'likert-7',
        readerResponses: [
          lowResponse('reader-4'),
          lowResponse('reader-5'),
          lowResponse('reader-6'),
        ],
      },
    ];

    const result = evaluatePremiseAppealBenchmark(samples, {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
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
        expect.stringContaining('premise appeal holdout'),
        expect.stringContaining('known-bad premise holdout'),
      ])
    );
  });

  it('reports missing polarity and target-reader coverage', () => {
    const result = evaluatePremiseAppealBenchmark([
      {
        id: 'mystery-positive-only',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: strongPremise,
        automatedScore: 91,
        expectedAppealing: true,
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
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
        expect.stringContaining('romance'),
        expect.stringContaining('under-sampled genres'),
        expect.stringContaining('known-bad premise appeal samples'),
        expect.stringContaining('romance-core'),
      ])
    );
  });

  it('catches premises that readers rate highly but do not click or save', () => {
    const result = evaluatePremiseAppealBenchmark([
      {
        id: 'survey-loved-listing-ignored',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: strongPremise,
        automatedScore: 93,
        expectedAppealing: true,
        ratingScale: 'likert-7',
        behavioralEvidence: {
          platform: 'blind-listing-panel',
          impressionCount: 500,
          clickCount: 8,
          firstChapterOpenCount: 4,
          libraryAddCount: 1,
          followCount: 0,
        },
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
    ]);

    expect(result.behavioralIntentFalsePositiveCount).toBe(1);
    expect(result.sampleResults[0]).toMatchObject({
      behavioralIntentEvidence: 'usable',
      behavioralIntentPassed: false,
      behavioralImpressionCount: 500,
      behavioralClickThroughRate: 0.016,
      behavioralFirstChapterOpenRate: 0.008,
      behavioralSaveOrFollowRate: 0.002,
      failureTypes: expect.arrayContaining(['behavioral-intent-false-positive']),
    });
    expect(result.recommendations.join('\n')).toContain('listing-level click');
    expect(result.readyForGateTuning).toBe(false);
  });

  it('keeps gate tuning disabled when behavioral intent evidence is required but missing', () => {
    const result = evaluatePremiseAppealBenchmark([
      {
        id: 'survey-only-positive',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: strongPremise,
        calibrationSplit: 'calibration',
        automatedScore: 92,
        expectedAppealing: true,
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
      {
        id: 'survey-only-known-bad',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: weakPremise,
        calibrationSplit: 'holdout',
        automatedScore: 88,
        expectedAppealing: false,
        ratingScale: 'likert-7',
        readerResponses: [
          lowResponse('reader-4'),
          lowResponse('reader-5'),
          lowResponse('reader-6'),
        ],
      },
    ], {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      requireBehavioralIntentEvidenceForGateTuning: true,
    });

    expect(result.lowBehavioralIntentEvidenceCount).toBe(2);
    expect(result.behavioralIntentEvidenceCount).toBe(0);
    expect(result.splitCoverage.usableCalibrationSamples).toBe(0);
    expect(result.splitCoverage.usableHoldoutSamples).toBe(0);
    expect(result.underSampledUsableHoldoutSamples).toBe(true);
    expect(result.underSampledUsableFailingHoldoutSamples).toBe(true);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations.join('\n')).toContain('behavioral premise evidence');
  });

  it('keeps gate tuning disabled when appealing samples lack actionable promise evidence', () => {
    const result = evaluatePremiseAppealBenchmark([
      {
        id: 'reader-approved-without-promise',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        automatedScore: 92,
        expectedAppealing: true,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
    ], {
      requireHoldoutForGateTuning: false,
      requirePromiseEvidenceForGateTuning: true,
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
    });

    expect(result).toMatchObject({
      total: 1,
      passed: 0,
      failed: 1,
      weakPromiseEvidenceCount: 1,
      promiseEvidenceCount: 0,
      weakReaderAppealCount: 0,
      weakDimensionCount: 0,
      insufficientEvidenceCount: 0,
      readyForGateTuning: false,
    });
    expect(result.splitCoverage).toMatchObject({
      holdoutSamples: 1,
      usableHoldoutSamples: 0,
    });
    expect(result.sampleResults[0]).toMatchObject({
      id: 'reader-approved-without-promise',
      promiseEvidence: 'missing',
      promiseEvidenceIssues: ['missing-premise'],
      promiseEvidenceFieldCount: 0,
      evidenceSufficient: false,
      failureTypes: ['weak-promise-evidence'],
    });
    expect(result.recommendations.join('\n')).toContain('premise promise evidence');
  });

  it('keeps gate tuning disabled when behavioral evidence lacks a trustworthy protocol', () => {
    const result = evaluatePremiseAppealBenchmark([
      {
        id: 'behavioral-protocol-weak-positive',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: strongPremise,
        calibrationSplit: 'calibration',
        automatedScore: 92,
        expectedAppealing: true,
        ratingScale: 'likert-7',
        behavioralEvidence: {
          platform: 'listing-panel',
          impressionCount: 500,
          clickCount: 45,
          firstChapterOpenCount: 34,
          libraryAddCount: 12,
          followCount: 8,
        },
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
      {
        id: 'behavioral-protocol-weak-known-bad',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: weakPremise,
        calibrationSplit: 'holdout',
        automatedScore: 40,
        expectedAppealing: false,
        ratingScale: 'likert-7',
        behavioralEvidence: {
          platform: 'listing-panel',
          impressionCount: 500,
          clickCount: 5,
          firstChapterOpenCount: 3,
          libraryAddCount: 0,
          followCount: 0,
        },
        readerResponses: [
          lowResponse('reader-4'),
          lowResponse('reader-5'),
          lowResponse('reader-6'),
        ],
      },
    ], {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      requireBehavioralIntentEvidenceForGateTuning: true,
      requireBehavioralProtocolForGateTuning: true,
    });

    expect(result.weakBehavioralProtocolCount).toBe(2);
    expect(result.behavioralProtocolEvidenceCount).toBe(2);
    expect(result.lowBehavioralIntentEvidenceCount).toBe(0);
    expect(result.splitCoverage.usableCalibrationSamples).toBe(0);
    expect(result.splitCoverage.usableHoldoutSamples).toBe(0);
    expect(result.underSampledUsableHoldoutSamples).toBe(true);
    expect(result.underSampledUsableFailingHoldoutSamples).toBe(true);
    expect(result.sampleResults[0]).toMatchObject({
      behavioralIntentEvidence: 'usable',
      behavioralProtocolQuality: 'weak',
      behavioralProtocolIssues: expect.arrayContaining([
        'missing-variant-label',
        'missing-acquisition-source',
        'not-blind-listing-test',
        'missing-observation-window-hours',
      ]),
      failureTypes: expect.arrayContaining(['weak-behavioral-protocol-evidence']),
    });
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations.join('\n')).toContain('behavioral premise evidence protocols');
  });

  it('keeps gate tuning disabled when behavioral allocation shows sample-ratio mismatch', () => {
    const result = evaluatePremiseAppealBenchmark([
      {
        id: 'behavioral-allocation-srm-positive',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: strongPremise,
        calibrationSplit: 'calibration',
        automatedScore: 92,
        expectedAppealing: true,
        ratingScale: 'likert-7',
        behavioralEvidence: {
          platform: 'blind-listing-panel',
          variantLabel: 'mystery-hook-a',
          acquisitionSource: 'target-reader-listing-test',
          observationWindowHours: 48,
          blindListingTest: true,
          impressionCount: 500,
          clickCount: 45,
          firstChapterOpenCount: 34,
          libraryAddCount: 12,
          followCount: 8,
          expectedVariantAllocationRatio: 0.5,
          observedVariantAllocationRatio: 0.64,
          sampleRatioMismatchPValue: 0.00001,
        },
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
      {
        id: 'behavioral-allocation-clean-known-bad',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        premise: weakPremise,
        calibrationSplit: 'holdout',
        automatedScore: 40,
        expectedAppealing: false,
        ratingScale: 'likert-7',
        behavioralEvidence: {
          platform: 'blind-listing-panel',
          variantLabel: 'generic-mystery-holdout',
          acquisitionSource: 'target-reader-listing-test',
          observationWindowHours: 48,
          blindListingTest: true,
          impressionCount: 500,
          clickCount: 5,
          firstChapterOpenCount: 3,
          libraryAddCount: 0,
          followCount: 0,
          expectedVariantAllocationRatio: 0.5,
          observedVariantAllocationRatio: 0.49,
          sampleRatioMismatchPValue: 0.71,
        },
        readerResponses: [
          lowResponse('reader-4'),
          lowResponse('reader-5'),
          lowResponse('reader-6'),
        ],
      },
    ], {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      requireBehavioralIntentEvidenceForGateTuning: true,
      requireBehavioralProtocolForGateTuning: true,
      requireBehavioralAllocationIntegrityForGateTuning: true,
      minimumSampleRatioMismatchPValue: 0.001,
    });

    expect(result.weakBehavioralAllocationCount).toBe(1);
    expect(result.behavioralAllocationEvidenceCount).toBe(2);
    expect(result.weakBehavioralProtocolCount).toBe(0);
    expect(result.lowBehavioralIntentEvidenceCount).toBe(0);
    expect(result.splitCoverage.usableCalibrationSamples).toBe(0);
    expect(result.sampleResults[0]).toMatchObject({
      behavioralIntentEvidence: 'usable',
      behavioralProtocolQuality: 'strong',
      behavioralAllocationIntegrity: 'weak',
      behavioralExpectedVariantAllocationRatio: 0.5,
      behavioralObservedVariantAllocationRatio: 0.64,
      behavioralSampleRatioMismatchPValue: 0.00001,
      behavioralAllocationIssues: expect.arrayContaining([
        'sample-ratio-mismatch-detected',
      ]),
      failureTypes: expect.arrayContaining([
        'weak-behavioral-allocation-evidence',
      ]),
    });
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations.join('\n')).toContain('sample-ratio mismatch');
  });
});

function highResponse(readerId: string) {
  return {
    readerId,
    targetReaderFit: true,
    ratings: {
      curiosity_gap: 7,
      novelty: 6,
      protagonist_investment: 6,
      emotional_pull: 6,
      clarity: 6,
      target_fit: 7,
      next_chapter_anticipation: 7,
    },
    wouldRead: true,
    comment: '왜 주인공에게만 예고가 오는지 궁금하고 첫 화를 눌러보고 싶다.',
    attractiveElements: ['정보 격차', '주인공의 개인적 대가'],
    rewriteSuggestion: '첫 장면에서 규칙을 행동으로 증명하면 더 좋다.',
  };
}

function lowResponse(readerId: string) {
  return {
    readerId,
    targetReaderFit: true,
    ratings: {
      curiosity_gap: 3,
      novelty: 3,
      protagonist_investment: 2,
      emotional_pull: 3,
      clarity: 5,
      target_fit: 4,
      next_chapter_anticipation: 3,
    },
    wouldRead: false,
    comment: '앱 설정은 알겠지만 주인공을 따라가야 할 이유가 약하다.',
    confusionPoints: ['주인공의 개인적 대가가 약함'],
    rewriteSuggestion: '첫 알림을 가족 실종이나 숨긴 죄책감과 직접 묶어야 한다.',
  };
}
