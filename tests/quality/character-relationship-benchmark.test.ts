import { describe, expect, it } from 'vitest';

import {
  evaluateCharacterRelationshipBenchmark,
  type CharacterRelationshipBenchmarkSample,
} from '../../src/index.js';

const strongFocus = {
  characterId: 'protagonist',
  characterName: '주인공',
  relationshipId: 'protagonist_partner',
  relationshipType: 'ally',
  counterpartId: 'partner',
  counterpartName: '파트너',
  scenePromise: '주인공이 숨긴 단서를 공개해 파트너의 조건부 신뢰를 얻는다.',
  characterAppealMoment: '주인공은 안전한 침묵 대신 위험한 단서 공개를 택한다.',
  relationshipTurn: '파트너는 협력을 제안하지만 감시 조건을 붙인다.',
  intendedChange: '둘은 함께 움직이되 서로의 거짓말을 확인한다.',
  consequence: '주인공 가족 실종 파일이 노출될 위험이 생긴다.',
};

const weakFocus = {
  characterId: 'protagonist',
  characterName: '주인공',
  relationshipId: 'protagonist_partner',
  relationshipType: 'ally',
  counterpartId: 'partner',
  counterpartName: '파트너',
  scenePromise: '주인공과 파트너가 서로를 이해하고 협력하게 된다.',
  characterAppealMoment: '주인공은 사건 해결 의지를 보인다.',
  relationshipTurn: '파트너가 주인공을 믿기로 한다.',
  intendedChange: '둘은 함께 수사한다.',
  consequence: '다음 사건으로 넘어간다.',
};

describe('evaluateCharacterRelationshipBenchmark', () => {
  it('catches automated character relationship false positives with weak reader investment', () => {
    const samples: CharacterRelationshipBenchmarkSample[] = [
      {
        id: 'reader-invested-relationship',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        chapter: 4,
        focus: strongFocus,
        automatedScore: 92,
        expectedInvesting: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
      {
        id: 'auto-high-reader-flat-relationship',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        chapter: 4,
        focus: weakFocus,
        automatedScore: 88,
        expectedInvesting: false,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        readerResponses: [
          lowResponse('reader-4'),
          lowResponse('reader-5'),
          lowResponse('reader-6'),
        ],
      },
    ];

    const result = evaluateCharacterRelationshipBenchmark(samples, {
      requiredGenres: ['mystery'],
      requiredTargetReaders: ['webnovel-core'],
      requiredRelationshipTypes: ['ally'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
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
      relationshipTypeCoverage: {
        ally: {
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
      id: 'reader-invested-relationship',
      passed: true,
      readerPassed: true,
      automatedPassed: true,
      calibrationSplit: 'calibration',
      weakDimensions: [],
    });
    expect(result.sampleResults[1]).toMatchObject({
      id: 'auto-high-reader-flat-relationship',
      passed: false,
      readerPassed: false,
      automatedPassed: true,
      focus: weakFocus,
      relationshipType: 'ally',
      calibrationSplit: 'holdout',
    });
    expect(result.sampleResults[1].readerEvidence[0]).toMatchObject({
      readerId: 'reader-4',
      comment: expect.stringContaining('왜 마음이 바뀌었는지'),
      disbeliefPoints: expect.arrayContaining(['상대의 조건 없음']),
      rewriteSuggestion: expect.stringContaining('파트너가 조건을 걸고'),
    });
    expect(result.sampleResults[1].failureTypes).toEqual(
      expect.arrayContaining([
        'automated-false-positive',
        'weak-reader-investment',
        'weak-dimension',
      ])
    );
    expect(result.sampleResults[1].weakDimensions).toEqual(
      expect.arrayContaining(['vulnerability_cost', 'reciprocal_pressure'])
    );
  });

  it('rejects split leakage when the same drama focus appears in calibration and holdout', () => {
    const result = evaluateCharacterRelationshipBenchmark([
      {
        id: 'drama-calibration',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        chapter: 4,
        focus: strongFocus,
        automatedScore: 92,
        expectedInvesting: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
      {
        id: 'drama-holdout-duplicate',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        chapter: 4,
        focus: strongFocus,
        automatedScore: 92,
        expectedInvesting: true,
        calibrationSplit: 'holdout',
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-4'),
          highResponse('reader-5'),
          highResponse('reader-6'),
        ],
      },
      {
        id: 'drama-known-flat-holdout',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        chapter: 4,
        focus: weakFocus,
        automatedScore: 88,
        expectedInvesting: false,
        calibrationSplit: 'holdout',
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
      requiredRelationshipTypes: ['ally'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
      minimumHoldoutSampleCount: 1,
      minimumUsableHoldoutSampleCount: 1,
      minimumFailingHoldoutSampleCount: 1,
      minimumUsableFailingHoldoutSampleCount: 1,
    });

    expect(result.splitLeakageCount).toBe(1);
    expect(result.splitLeakages[0]).toMatchObject({
      sampleIds: ['drama-calibration', 'drama-holdout-duplicate'],
      calibrationSplits: ['calibration', 'holdout'],
    });
    expect(result.splitLeakages[0].fingerprint).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(result.sampleResults[0].evidenceFingerprint).toBe(
      result.sampleResults[1].evidenceFingerprint
    );
    expect(result.underSampledHoldoutSamples).toBe(false);
    expect(result.underSampledUsableFailingHoldoutSamples).toBe(false);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations.join('\n')).toContain('same drama focus');
  });

  it('keeps gate tuning disabled when investing samples lack actionable focus evidence', () => {
    const result = evaluateCharacterRelationshipBenchmark([
      {
        id: 'investing-but-unlocated-focus',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        automatedScore: 92,
        expectedInvesting: true,
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
    });

    expect(result.weakFocusEvidenceCount).toBe(1);
    expect(result.focusEvidenceCount).toBe(0);
    expect(result.insufficientEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      id: 'investing-but-unlocated-focus',
      focusEvidence: 'missing',
      focusEvidenceFieldCount: 0,
      focusEvidenceIssues: ['missing-focus'],
      evidenceSufficient: false,
      failureTypes: ['weak-focus-evidence'],
    });
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('focus evidence'),
      ])
    );
  });

  it('keeps gate tuning disabled when character relationship evidence is calibration-only', () => {
    const result = evaluateCharacterRelationshipBenchmark([
      {
        id: 'reader-invested-relationship',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        focus: strongFocus,
        automatedScore: 91,
        expectedInvesting: true,
        calibrationSplit: 'calibration',
        ratingScale: 'likert-7',
        readerResponses: [
          highResponse('reader-1'),
          highResponse('reader-2'),
          highResponse('reader-3'),
        ],
      },
      {
        id: 'flat-calibration-relationship',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        focus: weakFocus,
        automatedScore: 87,
        expectedInvesting: false,
        calibrationSplit: 'calibration',
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
      requiredRelationshipTypes: ['ally'],
      minimumPanelSize: 3,
      minimumCommentedResponses: 2,
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
        expect.stringContaining('character/relationship holdout'),
        expect.stringContaining('known-flat character/relationship holdout'),
      ])
    );
  });

  it('reports missing polarity and relationship type coverage', () => {
    const result = evaluateCharacterRelationshipBenchmark([
      {
        id: 'mystery-positive-only',
        genre: 'mystery',
        targetReader: 'webnovel-core',
        focus: strongFocus,
        automatedScore: 91,
        expectedInvesting: true,
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
      requiredRelationshipTypes: ['ally', 'romance'],
      minimumSamplesPerGenre: 2,
      minimumSamplesPerTargetReader: 2,
      minimumSamplesPerRelationshipType: 2,
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
    expect(result.missingRequiredRelationshipTypes).toEqual(['romance']);
    expect(result.underSampledRequiredRelationshipTypes).toEqual(['ally', 'romance']);
    expect(result.missingRequiredPositiveRelationshipTypes).toEqual(['romance']);
    expect(result.missingRequiredNegativeRelationshipTypes).toEqual(['ally', 'romance']);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('known-flat drama samples'),
        expect.stringContaining('romance-core'),
        expect.stringContaining('relationship types'),
      ])
    );
  });
});

function highResponse(readerId: string) {
  return {
    readerId,
    targetReaderFit: true,
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
    wouldFollowCharacter: true,
    wouldFollowRelationship: true,
    wouldContinueScore: 7,
    comment: '주인공이 손해를 감수해 단서를 공개하고 파트너도 조건을 걸어 다음 협력이 궁금하다.',
    carePoints: ['단서 공개의 대가', '조건부 동맹'],
    rewriteSuggestion: '파트너가 제시하는 조건을 한 문장 더 날카롭게 만들면 좋다.',
  };
}

function lowResponse(readerId: string) {
  return {
    readerId,
    targetReaderFit: true,
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
    wouldFollowCharacter: false,
    wouldFollowRelationship: false,
    wouldContinueScore: 3,
    comment: '믿기로 했다는 결과만 있고 왜 마음이 바뀌었는지나 대가가 약하다.',
    disbeliefPoints: ['상대의 조건 없음', '주인공만의 매력이 흐림'],
    rewriteSuggestion: '파트너가 조건을 걸고 주인공이 잃을 정보를 내놓아야 한다.',
  };
}
