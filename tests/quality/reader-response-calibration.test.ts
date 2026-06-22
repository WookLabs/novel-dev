import { describe, expect, it } from 'vitest';
import {
  evaluateReaderResponseCalibration,
  type ReaderResponseCalibrationSample,
} from '../../src/quality/reader-response-calibration.js';

describe('evaluateReaderResponseCalibration', () => {
  it('flags high automated engagement that readers do not want to continue', () => {
    const samples: ReaderResponseCalibrationSample[] = [
      {
        id: 'overconfident-chapter',
        genre: 'mystery',
        chapter: 1,
        automated: {
          engagementScore: 94,
          gatePassed: true,
          issueCodes: [],
        },
        reader: {
          nextClick: 42,
          attention: 61,
          emotionalEngagement: 58,
          mentalImagery: 55,
          transportation: 54,
          interest: 63,
          suspense: 50,
          beauty: 70,
          overallLiking: 60,
        },
        respondentCount: 8,
      },
    ];

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.falsePositiveCount).toBe(1);
    expect(result.sampleResults[0]).toMatchObject({
      failureType: 'auto-false-positive',
      reliability: 'usable',
    });
    expect(result.sampleResults[0].readerCompositeScore).toBeLessThan(75);
    expect(result.blindSpots.map(spot => spot.dimension)).toContain('next-click');
    expect(result.recommendations.join('\n')).toContain('automated engagement');
  });

  it('keeps aligned high automation and high reader response clean', () => {
    const result = evaluateReaderResponseCalibration([
      {
        id: 'aligned-high-response',
        automated: {
          engagementScore: 92,
          gatePassed: true,
        },
        reader: {
          nextClick: 91,
          attention: 88,
          emotionalEngagement: 90,
          mentalImagery: 84,
          transportation: 89,
          interest: 92,
          suspense: 86,
          overallLiking: 90,
        },
        respondentCount: 6,
      },
    ]);

    expect(result.falsePositiveCount).toBe(0);
    expect(result.falseNegativeCount).toBe(0);
    expect(result.overestimateCount).toBe(0);
    expect(result.underestimateCount).toBe(0);
    expect(result.sampleResults[0].failureType).toBeUndefined();
    expect(result.sampleResults[0].dimensionIssues).toHaveLength(0);
  });

  it('normalizes 7-point reader survey data', () => {
    const result = evaluateReaderResponseCalibration([
      {
        id: 'likert-panel',
        automated: {
          engagementScore: 88,
        },
        reader: {
          nextClick: 6,
          attention: 6,
          emotionalEngagement: 6,
          mentalImagery: 5,
          transportation: 6,
          interest: 6,
          suspense: 5,
          overallLiking: 6,
        },
        respondentCount: 5,
        ratingScale: {
          min: 1,
          max: 7,
        },
      },
    ]);

    expect(result.sampleResults[0].readerCompositeScore).toBeGreaterThan(75);
    expect(result.sampleResults[0].failureType).toBeUndefined();
  });

  it('surfaces character attachment and relationship investment blind spots', () => {
    const result = evaluateReaderResponseCalibration([
      {
        id: 'thin-relationship-pass',
        automated: {
          engagementScore: 91,
          gatePassed: true,
        },
        reader: {
          nextClick: 89,
          attention: 88,
          emotionalEngagement: 88,
          mentalImagery: 86,
          transportation: 87,
          characterAttachment: 45,
          relationshipInvestment: 42,
          interest: 88,
          overallLiking: 88,
        },
        respondentCount: 8,
        evidence: {
          targetReaderCount: 7,
          completedReadCount: 8,
          qualitativeCommentCount: 5,
          frictionPointCount: 2,
          actionableFrictionPointCount: 2,
          rewriteSuggestionCount: 2,
        },
      },
    ]);

    const dimensions = result.sampleResults[0].dimensionIssues.map(issue => issue.dimension);
    expect(dimensions).toContain('character-attachment');
    expect(dimensions).toContain('relationship-investment');
    expect(result.blindSpots.map(spot => spot.dimension)).toEqual([
      'relationship-investment',
      'character-attachment',
    ]);
    expect(result.sampleResults[0].failureType).toBeUndefined();
    expect(result.recommendations.join('\n')).toContain('relationship turn');
  });

  it('surfaces generic-but-polished creative response blind spots', () => {
    const result = evaluateReaderResponseCalibration([
      {
        id: 'polished-but-generic-pass',
        automated: {
          engagementScore: 93,
          gatePassed: true,
        },
        reader: {
          nextClick: 88,
          attention: 90,
          emotionalEngagement: 89,
          mentalImagery: 87,
          transportation: 88,
          characterAttachment: 86,
          relationshipInvestment: 84,
          novelty: 40,
          surprise: 43,
          resonance: 44,
          sceneRecall: 39,
          interest: 88,
          suspense: 86,
          beauty: 89,
          overallLiking: 87,
        },
        respondentCount: 9,
      },
    ]);

    const dimensions = result.sampleResults[0].dimensionIssues.map(issue => issue.dimension);
    expect(dimensions).toEqual(expect.arrayContaining([
      'novelty',
      'surprise',
      'resonance',
      'scene-recall',
    ]));
    expect(result.blindSpots.map(spot => spot.dimension)).toEqual([
      'scene-recall',
      'novelty',
      'surprise',
      'resonance',
    ]);
    expect(result.sampleResults[0].failureType).toBe('auto-overestimate');
    expect(result.recommendations.join('\n')).toContain('less expected rule');
    expect(result.recommendations.join('\n')).toContain('lasting emotional or thematic aftertaste');
    expect(result.recommendations.join('\n')).toContain('recallable scene anchor');
  });

  it('flags low automated scores for samples readers strongly liked', () => {
    const result = evaluateReaderResponseCalibration([
      {
        id: 'underscored-reader-favorite',
        genre: 'literary',
        automated: {
          engagementScore: 68,
          gatePassed: false,
          issueCodes: ['slow-opening'],
        },
        reader: {
          nextClick: 89,
          attention: 91,
          emotionalEngagement: 93,
          mentalImagery: 88,
          transportation: 90,
          interest: 87,
          beauty: 95,
          overallLiking: 92,
        },
        respondentCount: 9,
      },
    ]);

    expect(result.falseNegativeCount).toBe(1);
    expect(result.sampleResults[0].failureType).toBe('auto-false-negative');
    expect(result.recommendations.join('\n')).toContain('underscored samples');
  });

  it('keeps gate tuning disabled until enough usable reader samples exist', () => {
    const result = evaluateReaderResponseCalibration([
      {
        id: 'single-reader',
        automated: {
          engagementScore: 90,
        },
        reader: {
          nextClick: 86,
          attention: 84,
          emotionalEngagement: 85,
          mentalImagery: 83,
          transportation: 84,
        },
        respondentCount: 1,
      },
    ]);

    expect(result.readyForGateTuning).toBe(false);
    expect(result.lowReliabilityCount).toBe(1);
    expect(result.gateTuningSuggestions[0]).toMatchObject({
      code: 'collect-more-reader-evidence',
      action: 'collect-more-evidence',
      target: 'reader-panel-evidence',
    });
    expect(result.recommendations.join('\n')).toContain('Collect at least');
  });

  it('keeps gate tuning disabled when reader scores lack actionable evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `score-only-${index + 1}`,
      automated: {
        engagementScore: 90,
        gatePassed: true,
      },
      reader: {
        nextClick: 88,
        attention: 86,
        emotionalEngagement: 87,
        mentalImagery: 84,
        transportation: 86,
        overallLiking: 88,
      },
      respondentCount: 6,
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      reliability: 'usable',
      evidenceQuality: 'none',
      actionabilityScore: 0,
    });
    expect(result.recommendations.join('\n')).toContain('target-reader fit');
  });

  it('allows gate tuning when enough samples include actionable panel evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `actionable-${index + 1}`,
      calibrationSplit: 'holdout',
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 87,
        attention: 86,
        emotionalEngagement: 88,
        mentalImagery: 85,
        transportation: 87,
        recommendationIntent: 86,
        interest: 88,
        overallLiking: 88,
      },
      respondentCount: 8,
      evidence: {
        ...buildHumanReaderEvidence(8),
        targetReaderCount: 6,
        targetReaderSegmentCount: 2,
        dominantReaderSegmentRatio: 0.63,
        completedReadCount: 8,
        ...buildRetentionEvidence(8),
        qualitativeCommentCount: 5,
        frictionPointCount: 2,
        actionableFrictionPointCount: 2,
        rewriteSuggestionCount: 2,
        frictionAnnotations: buildStructuredFrictionAnnotations(),
        ...buildAnnotationReliabilityEvidence(),
        ...buildSceneRecallEvidence(),
        ...buildTensionTraceEvidence(),
        ...buildNarrativeForecastEvidence(),
        ...buildLineQuoteEvidence(),
        ...buildPayoffFairnessEvidence(),
        ...buildAdvocacyEvidence(),
        ...buildDurableEngagementEvidence(),
        ...buildContinuationBehaviorEvidence(),
        ...buildResonanceEvidence(),
        ...buildDelayedMemoryEvidence(),
        readerScoreStandardDeviation: 8,
        highResponseCount: 7,
        neutralResponseCount: 1,
        lowResponseCount: 0,
        ...buildStrongPanelProtocolEvidence(),
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowResponseDataQualityCount).toBe(0);
    expect(result.responseDataQualityEvidenceCount).toBe(5);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(0);
    expect(result.lowRepresentativenessCount).toBe(0);
    expect(result.lowProtocolQualityCount).toBe(0);
    expect(result.readyForGateTuning).toBe(true);
    expect(result.sampleResults.every(sample => sample.evidenceQuality === 'usable')).toBe(true);
    expect(result.sampleResults.every(sample => sample.panelConsensus === 'clear')).toBe(true);
    expect(result.sampleResults.every(sample => sample.readerScoreConfidence === 'precise')).toBe(true);
    expect(result.sampleResults.every(sample => sample.cohortRepresentativeness === 'balanced')).toBe(true);
    expect(result.sampleResults.every(sample => sample.panelProtocolQuality === 'strong')).toBe(true);
    expect(result.sampleResults.every(sample => sample.responseDataQuality === 'usable')).toBe(true);
    expect(result.sampleResults[0].readerScoreMarginOfError).toBeCloseTo(5.54, 2);
    expect(result.sampleResults[0].readerScoreConfidenceInterval).toMatchObject({
      lower: 81.38,
      upper: 92.46,
    });
    expect(result.gateTuningSuggestions[0]).toMatchObject({
      code: 'hold-current-gates',
      action: 'hold',
      target: 'automated-gate-thresholds',
    });
    expect(result.evidenceCollectionPlan).toEqual([]);
  });

  it('keeps gate tuning disabled when reader evidence comes from synthetic or unknown respondents', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`synthetic-reader-evidence-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          respondentSource: 'synthetic-ai',
          humanRespondentCount: 0,
          syntheticRespondentCount: 8,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowHumanReaderEvidenceCount).toBe(5);
    expect(result.humanReaderEvidenceCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      humanReaderEvidence: 'none',
      respondentSource: 'synthetic-ai',
      humanRespondentCount: 0,
      syntheticRespondentCount: 8,
      humanRespondentRatio: 0,
    });
    expect(result.sampleResults[0].humanReaderEvidenceIssues.join('\n')).toContain('synthetic-ai');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low human reader evidence: 5');
    expect(result.recommendations.join('\n')).toContain('respondent_source');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'record-human-reader-provenance',
          priority: 'critical',
          sampleIds: samples.map(sample => sample.id),
        }),
        expect.objectContaining({
          id: 'collect-usable-reader-panel-samples',
          priority: 'critical',
        }),
      ])
    );
  });

  it('keeps gate tuning disabled when reader panels have low response data quality', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`low-response-quality-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          medianReadTimeSeconds: 24,
          minimumReadTimeSeconds: 4,
          speedingResponseCount: 3,
          straightLiningResponseCount: 2,
          duplicateResponseCount: 1,
          botSuspectedResponseCount: 1,
          lowQualityOpenEndedResponseCount: 2,
          inconsistentResponseCount: 2,
          qualityFlaggedResponseCount: 4,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowResponseDataQualityCount).toBe(5);
    expect(result.responseDataQualityEvidenceCount).toBe(5);
    expect(result.lowActionabilityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      responseDataQuality: 'weak',
      medianReadTimeSeconds: 24,
      speedingResponseCount: 3,
      straightLiningResponseCount: 2,
      duplicateResponseCount: 1,
      botSuspectedResponseCount: 1,
      lowQualityOpenEndedResponseCount: 2,
      inconsistentResponseCount: 2,
      qualityFlaggedResponseCount: 4,
      qualityFlaggedResponseRatio: 0.5,
    });
    expect(result.sampleResults[0].responseDataQualityIssues.join('\n')).toContain('speeding response');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low response data quality: 5');
    expect(result.recommendations.join('\n')).toContain('response data-quality evidence');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'record-response-data-quality',
          priority: 'critical',
          sampleIds: samples.map(sample => sample.id),
        }),
      ])
    );
  });

  it('keeps gate tuning disabled when reading speed is implausible for the manuscript length', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`too-fast-reading-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          manuscriptWordCount: 4200,
          medianReadTimeSeconds: 180,
          minimumReadTimeSeconds: 90,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowResponseDataQualityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      responseDataQuality: 'weak',
      manuscriptWordCount: 4200,
      medianReadingWordsPerMinute: 1400,
      minimumReadingWordsPerMinute: 2800,
    });
    expect(result.sampleResults[0].responseDataQualityIssues.join('\n')).toContain(
      'median reading speed 1400 wpm exceeds 650 wpm.'
    );
    expect(result.sampleResults[0].responseDataQualityIssues.join('\n')).toContain(
      'minimum read-time speed 2800 wpm exceeds 1200 wpm.'
    );
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'record-response-data-quality',
          priority: 'critical',
          sampleIds: samples.map(sample => sample.id),
        }),
      ])
    );
  });

  it('uses character count to catch implausible Korean manuscript reading speed without word count', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`too-fast-korean-reading-${index + 1}`, 'mystery', index + 1);
      const { manuscriptWordCount, ...evidenceWithoutWordCount } = sample.evidence ?? {};
      void manuscriptWordCount;

      return {
        ...sample,
        evidence: {
          ...evidenceWithoutWordCount,
          manuscriptCharacterCount: 12000,
          medianReadTimeSeconds: 240,
          minimumReadTimeSeconds: 120,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowResponseDataQualityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      responseDataQuality: 'weak',
      manuscriptWordCount: undefined,
      manuscriptCharacterCount: 12000,
      medianReadingCharactersPerMinute: 3000,
      minimumReadingCharactersPerMinute: 6000,
    });
    expect(result.sampleResults[0].responseDataQualityIssues.join('\n')).toContain(
      'median reading speed 3000 cpm exceeds 1600 cpm.'
    );
    expect(result.sampleResults[0].responseDataQualityIssues.join('\n')).toContain(
      'minimum read-time speed 6000 cpm exceeds 3000 cpm.'
    );
  });

  it('keeps gate tuning disabled when reader friction annotations lack coding reliability', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`uncoded-friction-${index + 1}`, 'mystery', index + 1);
      const {
        annotationCoderCount,
        annotationDoubleCodedCount,
        annotationAgreementRate,
        annotationReliabilityMetric,
        annotationCodebookVersion,
        annotationAdjudicated,
        annotationCoderBlinded,
        ...evidence
      } = sample.evidence ?? {};

      void annotationCoderCount;
      void annotationDoubleCodedCount;
      void annotationAgreementRate;
      void annotationReliabilityMetric;
      void annotationCodebookVersion;
      void annotationAdjudicated;
      void annotationCoderBlinded;

      return {
        ...sample,
        evidence,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowAnnotationReliabilityCount).toBe(5);
    expect(result.annotationReliabilityEvidenceCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      annotationReliability: 'none',
      annotationCoderCount: 0,
      annotationDoubleCodedCount: 0,
    });
    expect(result.sampleResults[0].annotationReliabilityIssues.join('\n')).toContain(
      'annotation coding reliability'
    );
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low annotation reliability: 5');
    expect(result.recommendations.join('\n')).toContain('annotation coding reliability evidence');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'record-annotation-reliability',
          priority: 'critical',
          sampleIds: samples.map(sample => sample.id),
        }),
      ])
    );
  });

  it('tracks whether revision directives actually improved reader response', () => {
    const improvedSamples = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`revision-improved-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          revisionPairId: `chapter-${index + 1}-v1-v2`,
          revisionBaselineReaderScore: 76,
          revisionPreferenceRevisedCount: 6,
          revisionPreferenceBaselineCount: 1,
          revisionPreferenceTieCount: 1,
          revisionPreferenceRespondentCount: 8,
          revisionBlindComparison: true,
          revisionSameReaderCohort: true,
          revisionQuestionWordingDisclosed: true,
          revisionGuardrailRegressionCount: 0,
        },
      };
    });

    const improved = evaluateReaderResponseCalibration(improvedSamples, {
      requireRevisionOutcomeEvidenceForTuning: true,
    });

    expect(improved.revisionOutcomeEvidenceCount).toBe(5);
    expect(improved.revisionImprovementCount).toBe(5);
    expect(improved.revisionRegressionCount).toBe(0);
    expect(improved.lowRevisionOutcomeEvidenceCount).toBe(0);
    expect(improved.readyForGateTuning).toBe(true);
    expect(improved.sampleResults[0]).toMatchObject({
      revisionOutcomeEvidence: 'improved',
      revisionBaselineReaderScore: 76,
      revisionPreferenceWinRate: 0.81,
      revisionPreferenceRespondentCount: 8,
    });

    const regressedSamples = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`revision-regressed-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          revisionPairId: `chapter-${index + 1}-v2-v3`,
          revisionBaselineReaderScore: 91,
          revisionPreferenceRevisedCount: 1,
          revisionPreferenceBaselineCount: 6,
          revisionPreferenceTieCount: 1,
          revisionPreferenceRespondentCount: 8,
          revisionBlindComparison: true,
          revisionSameReaderCohort: true,
          revisionQuestionWordingDisclosed: true,
          revisionGuardrailRegressionCount: 1,
        },
      };
    });

    const regressed = evaluateReaderResponseCalibration(regressedSamples, {
      requireRevisionOutcomeEvidenceForTuning: true,
    });

    expect(regressed.revisionRegressionCount).toBe(5);
    expect(regressed.lowRevisionOutcomeEvidenceCount).toBe(5);
    expect(regressed.readyForGateTuning).toBe(false);
    expect(regressed.sampleResults[0].revisionOutcomeEvidence).toBe('regressed');
    expect(regressed.sampleResults[0].revisionOutcomeIssues.join('\n')).toContain('revision guardrail regressions');
    expect(regressed.gateTuningSuggestions[0].evidenceSummary).toContain('revision regression: 5');
    expect(regressed.recommendations.join('\n')).toContain('regressed against their baseline');
    expect(regressed.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'rerun-regressed-revision-panel',
          priority: 'critical',
          sampleIds: regressedSamples.map(sample => sample.id),
        }),
        expect.objectContaining({
          id: 'collect-revision-outcome-evidence',
          priority: 'critical',
        }),
      ])
    );
  });

  it('keeps gate tuning disabled when reader panels lack retention evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-retention-evidence-${index + 1}`, 'mystery', index + 1);
      const {
        startedReadCount: _startedReadCount,
        dropOffCount: _dropOffCount,
        skimmedReadCount: _skimmedReadCount,
        ...evidenceWithoutRetention
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutRetention,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowRetentionEvidenceCount).toBe(5);
    expect(result.retentionEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      retentionEvidence: 'none',
      startedReadCount: 0,
      completedReadCount: 8,
      dropOffCount: 0,
      skimmedReadCount: 0,
    });
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('completed-reader averages may hide abandonment');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low retention evidence: 5');
    expect(result.recommendations.join('\n')).toContain('started_read_count');
  });

  it('requires localized drop-off annotations when readers abandon or skim samples', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`missing-drop-off-localization-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...sample.evidence!,
          startedReadCount: 8,
          completedReadCount: 7,
          dropOffCount: 1,
          skimmedReadCount: 1,
          dropOffAnnotations: undefined,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowRetentionEvidenceCount).toBe(0);
    expect(result.lowDropOffLocalizationEvidenceCount).toBe(5);
    expect(result.dropOffLocalizationEvidenceCount).toBe(5);
    expect(result.lowActionabilityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      retentionEvidence: 'usable',
      dropOffLocalizationEvidence: 'weak',
      dropOffAnnotationCount: 0,
      actionableDropOffAnnotationCount: 0,
    });
    expect(result.sampleResults[0].dropOffLocalizationEvidenceIssues.join('\n')).toContain('drop_off_annotations');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low drop-off localization: 5');
    expect(result.recommendations.join('\n')).toContain('drop_off_annotations');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'localize-reader-drop-off-events',
          priority: 'major',
          sampleIds: samples.map(sample => sample.id),
        }),
      ])
    );
  });

  it('accepts actionable localized drop-off and skimming annotations', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`localized-drop-off-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...sample.evidence!,
          startedReadCount: 8,
          completedReadCount: 7,
          dropOffCount: 1,
          skimmedReadCount: 1,
          dropOffAnnotations: buildDropOffAnnotations(),
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowDropOffLocalizationEvidenceCount).toBe(0);
    expect(result.dropOffLocalizationEvidenceCount).toBe(5);
    expect(result.sampleResults[0]).toMatchObject({
      dropOffLocalizationEvidence: 'usable',
      dropOffAnnotationCount: 2,
      actionableDropOffAnnotationCount: 2,
    });
  });

  it('does not require drop-off annotations when no readers abandon or skim the sample', () => {
    const result = evaluateReaderResponseCalibration([
      buildActionableSample('no-drop-off-events', 'mystery', 1),
    ]);

    expect(result.sampleResults[0]).toMatchObject({
      dropOffLocalizationEvidence: 'usable',
      dropOffAnnotationCount: 0,
      actionableDropOffAnnotationCount: 0,
    });
    expect(result.lowDropOffLocalizationEvidenceCount).toBe(0);
  });

  it('keeps gate tuning disabled when usable reader panels are only calibration samples', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      ...buildActionableSample(`calibration-only-${index + 1}`, 'mystery', index + 1),
      calibrationSplit: 'calibration',
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(0);
    expect(result.lowRepresentativenessCount).toBe(0);
    expect(result.lowProtocolQualityCount).toBe(0);
    expect(result.splitCoverage).toMatchObject({
      calibrationSamples: 5,
      holdoutSamples: 0,
      usableCalibrationSamples: 5,
      usableHoldoutSamples: 0,
    });
    expect(result.underSampledHoldoutSamples).toBe(true);
    expect(result.underSampledUsableHoldoutSamples).toBe(true);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('missing holdout');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low usable holdout');
    expect(result.recommendations.join('\n')).toContain('holdout');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'reserve-reader-panel-holdout',
          priority: 'critical',
          sampleIds: [],
        }),
      ])
    );
  });

  it('requires structured reader friction before using scores for gate tuning', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `count-only-actionable-${index + 1}`,
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 87,
        attention: 86,
        emotionalEngagement: 88,
        mentalImagery: 85,
        transportation: 87,
        recommendationIntent: 86,
        interest: 88,
        overallLiking: 88,
      },
      respondentCount: 8,
      evidence: {
        ...buildHumanReaderEvidence(8),
        targetReaderCount: 6,
        targetReaderSegmentCount: 2,
        dominantReaderSegmentRatio: 0.63,
        completedReadCount: 8,
        qualitativeCommentCount: 5,
        frictionPointCount: 2,
        actionableFrictionPointCount: 2,
        rewriteSuggestionCount: 2,
        readerScoreStandardDeviation: 8,
        highResponseCount: 7,
        neutralResponseCount: 1,
        lowResponseCount: 0,
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('structured friction annotations');
    expect(result.recommendations.join('\n')).toContain('friction_annotations');
  });

  it('keeps gate tuning disabled when reader panels lack unprompted scene recall evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-scene-recall-${index + 1}`, 'mystery', index + 1);
      const {
        unpromptedSceneRecallCount: _unpromptedSceneRecallCount,
        distinctiveSceneRecallCount: _distinctiveSceneRecallCount,
        sceneRecallAnnotations: _sceneRecallAnnotations,
        ...evidenceWithoutRecall
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutRecall,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowSceneRecallEvidenceCount).toBe(5);
    expect(result.sceneRecallEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      sceneRecallEvidence: 'none',
      unpromptedSceneRecallCount: 0,
      distinctiveSceneRecallCount: 0,
    });
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('scene-recall');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low scene recall: 5');
    expect(result.recommendations.join('\n')).toContain('scene_recall_annotations');
  });

  it('keeps gate tuning disabled when reader panels lack recommendation advocacy evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-advocacy-${index + 1}`, 'mystery', index + 1);
      const {
        organicRecommendationCount: _organicRecommendationCount,
        discussionPromptCount: _discussionPromptCount,
        advocacyAnnotations: _advocacyAnnotations,
        ...evidenceWithoutAdvocacy
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutAdvocacy,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowAdvocacyEvidenceCount).toBe(5);
    expect(result.advocacyEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      advocacyEvidence: 'none',
      organicRecommendationCount: 0,
      discussionPromptCount: 0,
    });
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('advocacy');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low advocacy: 5');
    expect(result.recommendations.join('\n')).toContain('advocacy_annotations');
  });

  it('keeps gate tuning disabled when reader panels lack scene-level tension trace evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-tension-trace-${index + 1}`, 'mystery', index + 1);
      const {
        tensionTracePointCount: _tensionTracePointCount,
        tensionPeakCount: _tensionPeakCount,
        tensionQuestionCount: _tensionQuestionCount,
        tensionTraceAnnotations: _tensionTraceAnnotations,
        ...evidenceWithoutTensionTrace
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutTensionTrace,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowTensionTraceEvidenceCount).toBe(5);
    expect(result.tensionTraceEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      tensionTraceEvidence: 'none',
      tensionTracePointCount: 0,
      tensionPeakCount: 0,
      tensionQuestionCount: 0,
    });
    expect(result.sampleResults[0].tensionTraceEvidenceIssues.join('\n')).toContain('tension');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('tension trace');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low tension trace: 5');
    expect(result.recommendations.join('\n')).toContain('tension_trace_annotations');
  });

  it('keeps gate tuning disabled when reader panels lack narrative forecast evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-narrative-forecast-${index + 1}`, 'mystery', index + 1);
      const {
        forecastPredictionCount: _forecastPredictionCount,
        forecastDiversityCount: _forecastDiversityCount,
        forecastRevisionCount: _forecastRevisionCount,
        forecastMismatchCount: _forecastMismatchCount,
        forecastInflectionCount: _forecastInflectionCount,
        narrativeForecastAnnotations: _narrativeForecastAnnotations,
        ...evidenceWithoutNarrativeForecast
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutNarrativeForecast,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowNarrativeForecastEvidenceCount).toBe(5);
    expect(result.narrativeForecastEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      narrativeForecastEvidence: 'none',
      forecastPredictionCount: 0,
      forecastDiversityCount: 0,
      forecastRevisionCount: 0,
      forecastMismatchCount: 0,
      forecastInflectionCount: 0,
    });
    expect(result.sampleResults[0].narrativeForecastEvidenceIssues.join('\n')).toContain('narrative forecast');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('narrative forecast');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low narrative forecast: 5');
    expect(result.recommendations.join('\n')).toContain('narrative_forecast_annotations');
  });

  it('keeps gate tuning disabled when reader panels lack memorable line quote evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-line-quote-${index + 1}`, 'mystery', index + 1);
      const {
        quoteRecallCount: _quoteRecallCount,
        favoriteLineCount: _favoriteLineCount,
        shareableLineCount: _shareableLineCount,
        lineQuoteAnnotations: _lineQuoteAnnotations,
        ...evidenceWithoutLineQuote
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutLineQuote,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowLineQuoteEvidenceCount).toBe(5);
    expect(result.lineQuoteEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      lineQuoteEvidence: 'none',
      quoteRecallCount: 0,
      favoriteLineCount: 0,
      shareableLineCount: 0,
    });
    expect(result.sampleResults[0].lineQuoteEvidenceIssues.join('\n')).toContain('line');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('line');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low line quote: 5');
    expect(result.recommendations.join('\n')).toContain('line_quote_annotations');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'collect-line-quote-evidence',
          target: 'memorable-line-quote',
          sampleIds: samples.map(sample => sample.id),
        }),
      ])
    );
  });

  it('keeps gate tuning disabled when reader panels lack payoff fairness evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-payoff-fairness-${index + 1}`, 'mystery', index + 1);
      const {
        payoffSetupRecallCount: _payoffSetupRecallCount,
        payoffTriggerRecognitionCount: _payoffTriggerRecognitionCount,
        payoffEarnedCount: _payoffEarnedCount,
        payoffRecontextualizationCount: _payoffRecontextualizationCount,
        payoffEmotionalSatisfactionCount: _payoffEmotionalSatisfactionCount,
        payoffFairnessAnnotations: _payoffFairnessAnnotations,
        ...evidenceWithoutPayoffFairness
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutPayoffFairness,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowPayoffFairnessEvidenceCount).toBe(5);
    expect(result.payoffFairnessEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      payoffFairnessEvidence: 'none',
      payoffSetupRecallCount: 0,
      payoffTriggerRecognitionCount: 0,
      payoffEarnedCount: 0,
      payoffRecontextualizationCount: 0,
      payoffEmotionalSatisfactionCount: 0,
    });
    expect(result.sampleResults[0].payoffFairnessEvidenceIssues.join('\n')).toContain('payoff');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('payoff');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low payoff fairness: 5');
    expect(result.recommendations.join('\n')).toContain('payoff_fairness_annotations');
  });

  it('keeps gate tuning disabled when reader panels lack durable engagement evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-durable-engagement-${index + 1}`, 'mystery', index + 1);
      const {
        bookmarkCount: _bookmarkCount,
        followOrLibraryAddCount: _followOrLibraryAddCount,
        returnNextDayCount: _returnNextDayCount,
        bingeReadIntentCount: _bingeReadIntentCount,
        paidContinuationIntentCount: _paidContinuationIntentCount,
        durableEngagementAnnotations: _durableEngagementAnnotations,
        ...evidenceWithoutDurableEngagement
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutDurableEngagement,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowDurableEngagementEvidenceCount).toBe(5);
    expect(result.durableEngagementEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      durableEngagementEvidence: 'none',
      bookmarkCount: 0,
      followOrLibraryAddCount: 0,
      returnNextDayCount: 0,
      bingeReadIntentCount: 0,
      paidContinuationIntentCount: 0,
    });
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('durable');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low durable engagement: 5');
    expect(result.recommendations.join('\n')).toContain('durable_engagement_annotations');
  });

  it('keeps gate tuning disabled when actual continuation behavior evidence is missing', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-continuation-behavior-${index + 1}`, 'mystery', index + 1);
      const {
        nextChapterCtaImpressionCount: _nextChapterCtaImpressionCount,
        nextChapterClickCount: _nextChapterClickCount,
        nextChapterOpenCount: _nextChapterOpenCount,
        nextChapterReadStartCount: _nextChapterReadStartCount,
        ...evidenceWithoutContinuationBehavior
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutContinuationBehavior,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowContinuationBehaviorEvidenceCount).toBe(5);
    expect(result.continuationBehaviorEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      continuationBehaviorEvidence: 'none',
      nextChapterCtaImpressionCount: 0,
      nextChapterClickCount: 0,
      nextChapterOpenCount: 0,
      nextChapterReadStartCount: 0,
    });
    expect(result.sampleResults[0].continuationBehaviorEvidenceIssues.join('\n')).toContain('next-chapter');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('next_chapter_cta_impression_count');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low continuation behavior: 5');
    expect(result.recommendations.join('\n')).toContain('next_chapter_click_count');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'collect-next-chapter-continuation-behavior',
          priority: 'major',
          sampleIds: samples.map(sample => sample.id),
        }),
      ])
    );
  });

  it('marks actual continuation behavior evidence weak when clicks and opens do not clear thresholds', () => {
    const sample = buildActionableSample('weak-continuation-behavior', 'mystery', 1);
    const result = evaluateReaderResponseCalibration([
      {
        ...sample,
        evidence: {
          ...sample.evidence,
          nextChapterCtaImpressionCount: 8,
          nextChapterClickCount: 1,
          nextChapterOpenCount: 1,
          nextChapterReadStartCount: 0,
        },
      },
    ], {
      minimumSampleCountForTuning: 1,
      requireHoldoutForTuning: false,
      requiredGenres: [],
    });

    expect(result.lowContinuationBehaviorEvidenceCount).toBe(1);
    expect(result.continuationBehaviorEvidenceCount).toBe(1);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      continuationBehaviorEvidence: 'weak',
      nextChapterCtaImpressionCount: 8,
      nextChapterClickCount: 1,
      nextChapterOpenCount: 1,
      nextChapterReadStartCount: 0,
      nextChapterClickThroughRatio: 0.125,
      nextChapterOpenRatio: 0.125,
      nextChapterReadStartRatio: 0,
    });
    expect(result.sampleResults[0].continuationBehaviorEvidenceIssues.join('\n')).toContain('click-through');
  });

  it('keeps gate tuning disabled when reader panels lack post-reading resonance evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-resonance-${index + 1}`, 'mystery', index + 1);
      const {
        lingeringEmotionCount: _lingeringEmotionCount,
        reflectiveCommentCount: _reflectiveCommentCount,
        personalMemoryOrMeaningCount: _personalMemoryOrMeaningCount,
        resonanceAnnotations: _resonanceAnnotations,
        ...evidenceWithoutResonance
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutResonance,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowResonanceEvidenceCount).toBe(5);
    expect(result.resonanceEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      resonanceEvidence: 'none',
      lingeringEmotionCount: 0,
      reflectiveMeaningCount: 0,
    });
    expect(result.sampleResults[0].resonanceEvidenceIssues.join('\n')).toContain('resonance');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('resonance');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low resonance evidence: 5');
    expect(result.recommendations.join('\n')).toContain('resonance_annotations');
  });

  it('keeps gate tuning disabled when delayed memory follow-up evidence is missing', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`no-delayed-memory-${index + 1}`, 'mystery', index + 1);
      const {
        delayedFollowUpRespondentCount: _delayedFollowUpRespondentCount,
        delayedFollowUpHours: _delayedFollowUpHours,
        delayedSceneRecallCount: _delayedSceneRecallCount,
        delayedCharacterRecallCount: _delayedCharacterRecallCount,
        delayedNextClickIntentCount: _delayedNextClickIntentCount,
        delayedReturnIntentCount: _delayedReturnIntentCount,
        delayedPaidContinuationIntentCount: _delayedPaidContinuationIntentCount,
        delayedMemoryAnnotations: _delayedMemoryAnnotations,
        ...evidenceWithoutDelayedMemory
      } = sample.evidence ?? {};
      return {
        ...sample,
        evidence: evidenceWithoutDelayedMemory,
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.lowDelayedMemoryEvidenceCount).toBe(5);
    expect(result.delayedMemoryEvidenceCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      delayedMemoryEvidence: 'none',
      delayedFollowUpRespondentCount: 0,
      delayedSceneRecallCount: 0,
      delayedCharacterRecallCount: 0,
      delayedContinuationIntentCount: 0,
    });
    expect(result.sampleResults[0].delayedMemoryEvidenceIssues.join('\n')).toContain('delayed');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('delayed');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('low delayed memory: 5');
    expect(result.recommendations.join('\n')).toContain('delayed_memory_annotations');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'collect-delayed-memory-evidence',
          priority: 'major',
          sampleIds: samples.map(sample => sample.id),
        }),
      ])
    );
  });

  it('keeps evidence scores finite when optional minimum evidence thresholds are zero', () => {
    const samples: ReaderResponseCalibrationSample[] = [
      buildActionableSample('zero-minimum-thresholds', 'mystery', 1),
    ];

    const result = evaluateReaderResponseCalibration(samples, {
      minimumTargetReaderRatio: 0,
      minimumCompletedReadRatio: 0,
      minimumQualitativeCommentRatio: 0,
      minimumFrictionPointCount: 0,
      minimumActionableFrictionPointCount: 0,
      minimumRewriteSuggestionCount: 0,
      minimumUnpromptedSceneRecallRatio: 0,
      minimumDistinctiveSceneRecallRatio: 0,
      minimumSceneRecallAnnotationCount: 0,
      minimumOrganicRecommendationRatio: 0,
      minimumDiscussionPromptRatio: 0,
      minimumAdvocacyAnnotationCount: 0,
      minimumBookmarkRatio: 0,
      minimumReturnIntentRatio: 0,
      minimumPaidContinuationIntentRatio: 0,
      minimumDurableEngagementAnnotationCount: 0,
      minimumLingeringEmotionRatio: 0,
      minimumReflectiveMeaningRatio: 0,
      minimumResonanceAnnotationCount: 0,
      minimumDelayedFollowUpRespondentRatio: 0,
      minimumDelayedFollowUpHours: 0,
      minimumDelayedSceneRecallRatio: 0,
      minimumDelayedCharacterRecallRatio: 0,
      minimumDelayedContinuationIntentRatio: 0,
      minimumDelayedMemoryAnnotationCount: 0,
    });

    expect(Number.isFinite(result.calibrationScore)).toBe(true);
    expect(Number.isFinite(result.sampleResults[0].actionabilityScore)).toBe(true);
    expect(result.sampleResults[0]).toMatchObject({
      actionabilityScore: 100,
      sceneRecallEvidence: 'usable',
      advocacyEvidence: 'usable',
      durableEngagementEvidence: 'usable',
      resonanceEvidence: 'usable',
      delayedMemoryEvidence: 'usable',
    });
  });

  it('keeps gate tuning disabled when reader panel protocol can bias scores', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`biased-protocol-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          blindReading: false,
          neutralQuestionWording: false,
          responseOptionOrderRandomized: false,
          attentionCheckPassCount: 5,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(0);
    expect(result.lowRepresentativenessCount).toBe(0);
    expect(result.lowProtocolQualityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0].panelProtocolQuality).toBe('weak');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('blind manuscript');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('neutral');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('response-option order');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('attention-check pass coverage');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('weak protocol: 5');
    expect(result.recommendations.join('\n')).toContain('reader-panel protocol evidence');
  });

  it('keeps gate tuning disabled when prior exposure or spoiler contamination is not controlled', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`contaminated-protocol-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          authorIdentityMasked: false,
          priorExposureScreened: false,
          unexcludedPriorExposureCount: 1,
          spoilerExposureScreened: false,
          unexcludedSpoilerExposureCount: 1,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(0);
    expect(result.lowRepresentativenessCount).toBe(0);
    expect(result.lowProtocolQualityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0].panelProtocolQuality).toBe('weak');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('author identity');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('prior exposure');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('spoiler exposure');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('weak protocol: 5');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'strengthen-reader-panel-protocol',
          action: expect.stringContaining('unexcluded_spoiler_exposure_count'),
        }),
      ])
    );
  });

  it('keeps gate tuning disabled when repeated reader samples lack manuscript order control', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`order-biased-protocol-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          sampleOrderRandomized: false,
          manuscriptOrderCounterbalanced: false,
          maxSamplesPerRespondent: 6,
          orderBalanceRatio: 0.4,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples, {
      maximumSamplesPerRespondent: 3,
      minimumOrderBalanceRatio: 0.8,
    });

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(0);
    expect(result.lowRepresentativenessCount).toBe(0);
    expect(result.lowProtocolQualityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0].panelProtocolQuality).toBe('weak');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('max samples per respondent');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('presentation order');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('counterbalanced manuscript');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('order balance ratio');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('weak protocol: 5');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'strengthen-reader-panel-protocol',
          action: expect.stringContaining('order_balance_ratio'),
        }),
      ])
    );
  });

  it('requires reader panel transparency metadata before gate tuning', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`opaque-protocol-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          populationDefinitionDisclosed: false,
          samplingFrameDisclosed: false,
          fieldworkDatesDisclosed: false,
          surveyModeDisclosed: false,
          incentiveDisclosed: false,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(0);
    expect(result.lowRepresentativenessCount).toBe(0);
    expect(result.lowProtocolQualityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('target reader population');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('sampling frame');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('fieldwork dates');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('survey mode');
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain('incentives');
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'strengthen-reader-panel-protocol',
          action: expect.stringContaining('sampling_frame_disclosed'),
        }),
      ])
    );
  });

  it('derives actionable evidence counts from structured friction annotations', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `annotation-actionable-${index + 1}`,
      calibrationSplit: 'holdout',
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 87,
        attention: 86,
        emotionalEngagement: 88,
        mentalImagery: 85,
        transportation: 87,
        recommendationIntent: 86,
        interest: 88,
        overallLiking: 88,
      },
      respondentCount: 8,
      evidence: {
        ...buildHumanReaderEvidence(8),
        targetReaderCount: 6,
        targetReaderSegmentCount: 2,
        dominantReaderSegmentRatio: 0.63,
        completedReadCount: 8,
        ...buildRetentionEvidence(8),
        qualitativeCommentCount: 5,
        frictionAnnotations: buildStructuredFrictionAnnotations(),
        ...buildAnnotationReliabilityEvidence(),
        ...buildSceneRecallEvidence(),
        ...buildTensionTraceEvidence(),
        ...buildNarrativeForecastEvidence(),
        ...buildLineQuoteEvidence(),
        ...buildPayoffFairnessEvidence(),
        ...buildAdvocacyEvidence(),
        ...buildDurableEngagementEvidence(),
        ...buildContinuationBehaviorEvidence(),
        ...buildResonanceEvidence(),
        ...buildDelayedMemoryEvidence(),
        readerScoreStandardDeviation: 8,
        highResponseCount: 7,
        neutralResponseCount: 1,
        lowResponseCount: 0,
        ...buildStrongPanelProtocolEvidence(),
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(0);
    expect(result.readyForGateTuning).toBe(true);
    expect(result.sampleResults[0].evidenceQuality).toBe('usable');
    expect(result.sampleResults[0].frictionAnnotations).toHaveLength(2);
    expect(result.sampleResults[0].frictionAnnotations[0]).toMatchObject({
      location: 'scene-01 paragraph-04',
      dimension: 'mental-imagery',
      rewriteSuggestion: expect.stringContaining('visible blocking'),
      readerSegment: 'genre-core',
    });
  });

  it('keeps gate tuning disabled when friction annotations miss weak reader dimensions', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `miscovered-weak-dimension-${index + 1}`,
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 45,
        attention: 86,
        emotionalEngagement: 88,
        mentalImagery: 85,
        transportation: 87,
        recommendationIntent: 86,
        interest: 88,
        overallLiking: 88,
      },
      respondentCount: 8,
      evidence: {
        ...buildHumanReaderEvidence(8),
        targetReaderCount: 6,
        targetReaderSegmentCount: 2,
        dominantReaderSegmentRatio: 0.63,
        completedReadCount: 8,
        qualitativeCommentCount: 5,
        frictionAnnotations: buildMentalImageryOnlyFrictionAnnotations(),
        ...buildAnnotationReliabilityEvidence(),
        ...buildSceneRecallEvidence(),
        readerScoreStandardDeviation: 8,
        highResponseCount: 7,
        neutralResponseCount: 1,
        lowResponseCount: 0,
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      frictionAnnotationCoverage: 'partial',
    });
    expect(result.sampleResults[0].frictionAnnotationCoverageIssues.join('\n')).toContain('next-click');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('weak reader dimensions');
    expect(result.recommendations.join('\n')).toContain('every weak reader-response dimension');
  });

  it('allows weak reader dimensions when friction annotations cover the same dimensions', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `covered-weak-dimension-${index + 1}`,
      calibrationSplit: 'holdout',
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 45,
        attention: 86,
        emotionalEngagement: 88,
        mentalImagery: 85,
        transportation: 87,
        interest: 88,
        overallLiking: 88,
      },
      respondentCount: 8,
      evidence: {
        ...buildHumanReaderEvidence(8),
        targetReaderCount: 6,
        targetReaderSegmentCount: 2,
        dominantReaderSegmentRatio: 0.63,
        completedReadCount: 8,
        ...buildRetentionEvidence(8),
        qualitativeCommentCount: 5,
        frictionAnnotations: buildNextClickFrictionAnnotations(),
        ...buildAnnotationReliabilityEvidence(),
        ...buildSceneRecallEvidence(),
        ...buildTensionTraceEvidence(),
        ...buildNarrativeForecastEvidence(),
        ...buildLineQuoteEvidence(),
        ...buildPayoffFairnessEvidence(),
        ...buildAdvocacyEvidence(),
        ...buildDurableEngagementEvidence(),
        ...buildContinuationBehaviorEvidence(),
        ...buildResonanceEvidence(),
        ...buildDelayedMemoryEvidence(),
        readerScoreStandardDeviation: 8,
        highResponseCount: 7,
        neutralResponseCount: 1,
        lowResponseCount: 0,
        ...buildStrongPanelProtocolEvidence(),
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(0);
    expect(result.readyForGateTuning).toBe(true);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'usable',
      frictionAnnotationCoverage: 'covered',
    });
    expect(result.sampleResults[0].dimensionIssues.map(issue => issue.dimension)).toContain('next-click');
  });

  it('keeps gate tuning disabled when actionable friction annotations lack reader-segment spread', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `single-segment-annotation-${index + 1}`,
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 87,
        attention: 86,
        emotionalEngagement: 88,
        mentalImagery: 85,
        transportation: 87,
        interest: 88,
        overallLiking: 88,
      },
      respondentCount: 8,
      evidence: {
        targetReaderCount: 6,
        targetReaderSegmentCount: 2,
        dominantReaderSegmentRatio: 0.63,
        completedReadCount: 8,
        qualitativeCommentCount: 5,
        frictionAnnotations: buildSingleSegmentFrictionAnnotations(),
        ...buildAnnotationReliabilityEvidence(),
        ...buildSceneRecallEvidence(),
        readerScoreStandardDeviation: 8,
        highResponseCount: 7,
        neutralResponseCount: 1,
        lowResponseCount: 0,
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowActionabilityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
      frictionAnnotationRepresentativeness: 'narrow',
    });
    expect(result.sampleResults[0].frictionAnnotationRepresentativenessIssues.join('\n')).toContain('reader segment');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('friction annotations cover 1 reader segment');
    expect(result.recommendations.join('\n')).toContain('reader_segment');
  });

  it('keeps gate tuning disabled when reader panel response is polarized', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `polarized-${index + 1}`,
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 86,
        attention: 86,
        emotionalEngagement: 86,
        mentalImagery: 85,
        transportation: 86,
        recommendationIntent: 87,
        interest: 87,
        overallLiking: 86,
      },
      respondentCount: 10,
      evidence: {
        ...buildHumanReaderEvidence(10),
        targetReaderCount: 9,
        targetReaderSegmentCount: 2,
        dominantReaderSegmentRatio: 0.6,
        completedReadCount: 10,
        ...buildRetentionEvidence(10),
        qualitativeCommentCount: 6,
        frictionPointCount: 2,
        actionableFrictionPointCount: 2,
        rewriteSuggestionCount: 2,
        frictionAnnotations: buildStructuredFrictionAnnotations(),
        ...buildAnnotationReliabilityEvidence(),
        ...buildSceneRecallEvidence(),
        ...buildTensionTraceEvidence(),
        ...buildNarrativeForecastEvidence(),
        ...buildLineQuoteEvidence(),
        ...buildPayoffFairnessEvidence(),
        ...buildAdvocacyEvidence(),
        ...buildDurableEngagementEvidence(),
        ...buildContinuationBehaviorEvidence(),
        ...buildResonanceEvidence(),
        ...buildDelayedMemoryEvidence(),
        readerScoreStandardDeviation: 28,
        highResponseCount: 5,
        neutralResponseCount: 0,
        lowResponseCount: 5,
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(5);
    expect(result.lowConfidenceCount).toBe(5);
    expect(result.lowRepresentativenessCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'usable',
      panelConsensus: 'polarized',
      readerScoreConfidence: 'wide',
    });
    expect(result.sampleResults[0].panelConsensusIssues.join('\n')).toContain('polarized');
    expect(result.sampleResults[0].readerScoreConfidenceIssues.join('\n')).toContain('margin of error');
    expect(result.recommendations.join('\n')).toContain('Segment polarized reader-panel samples');
  });

  it('keeps gate tuning disabled when reader score confidence interval is too wide', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `wide-confidence-${index + 1}`,
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 87,
        attention: 86,
        emotionalEngagement: 88,
        mentalImagery: 85,
        transportation: 87,
        recommendationIntent: 86,
        interest: 88,
        overallLiking: 88,
      },
      respondentCount: 4,
      evidence: {
        ...buildHumanReaderEvidence(4),
        targetReaderCount: 4,
        targetReaderSegmentCount: 2,
        dominantReaderSegmentRatio: 0.5,
        completedReadCount: 4,
        ...buildRetentionEvidence(4),
        qualitativeCommentCount: 3,
        frictionPointCount: 2,
        actionableFrictionPointCount: 2,
        rewriteSuggestionCount: 2,
        frictionAnnotations: buildStructuredFrictionAnnotations(),
        ...buildAnnotationReliabilityEvidence(),
        ...buildSceneRecallEvidence(),
        ...buildTensionTraceEvidence(),
        ...buildNarrativeForecastEvidence(),
        ...buildLineQuoteEvidence(),
        ...buildPayoffFairnessEvidence(),
        ...buildAdvocacyEvidence(),
        ...buildDurableEngagementEvidence(),
        ...buildContinuationBehaviorEvidence(),
        ...buildResonanceEvidence(),
        ...buildDelayedMemoryEvidence(),
        readerScoreStandardDeviation: 18,
        highResponseCount: 4,
        neutralResponseCount: 0,
        lowResponseCount: 0,
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(5);
    expect(result.lowRepresentativenessCount).toBe(0);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'usable',
      panelConsensus: 'clear',
      readerScoreConfidence: 'wide',
      cohortRepresentativeness: 'balanced',
    });
    expect(result.sampleResults[0].readerScoreMarginOfError).toBeCloseTo(17.64, 2);
    expect(result.sampleResults[0].readerScoreConfidenceIssues.join('\n')).toContain('95% reader score margin of error');
    expect(result.recommendations.join('\n')).toContain('95% confidence margin');
  });

  it('keeps gate tuning disabled when reader panel is dominated by one target-reader cohort', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `narrow-cohort-${index + 1}`,
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 87,
        attention: 86,
        emotionalEngagement: 88,
        mentalImagery: 85,
        transportation: 87,
        recommendationIntent: 86,
        interest: 88,
        overallLiking: 88,
      },
      respondentCount: 8,
      evidence: {
        ...buildHumanReaderEvidence(8),
        targetReaderCount: 8,
        targetReaderSegmentCount: 1,
        dominantReaderSegmentRatio: 0.88,
        completedReadCount: 8,
        ...buildRetentionEvidence(8),
        qualitativeCommentCount: 5,
        frictionPointCount: 2,
        actionableFrictionPointCount: 2,
        rewriteSuggestionCount: 2,
        frictionAnnotations: buildStructuredFrictionAnnotations(),
        ...buildAnnotationReliabilityEvidence(),
        ...buildSceneRecallEvidence(),
        ...buildTensionTraceEvidence(),
        ...buildNarrativeForecastEvidence(),
        ...buildLineQuoteEvidence(),
        ...buildPayoffFairnessEvidence(),
        ...buildAdvocacyEvidence(),
        ...buildDurableEngagementEvidence(),
        ...buildContinuationBehaviorEvidence(),
        ...buildResonanceEvidence(),
        ...buildDelayedMemoryEvidence(),
        readerScoreStandardDeviation: 8,
        highResponseCount: 7,
        neutralResponseCount: 1,
        lowResponseCount: 0,
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(0);
    expect(result.lowRepresentativenessCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'usable',
      panelConsensus: 'clear',
      cohortRepresentativeness: 'narrow',
    });
    expect(result.sampleResults[0].cohortRepresentativenessIssues.join('\n')).toContain('dominant reader segment ratio');
    expect(result.recommendations.join('\n')).toContain('Broaden narrow reader panels');
  });

  it('keeps gate tuning disabled when required target-reader quota cells are missing', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`missing-quota-cell-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          targetReaderCount: 8,
          targetReaderSegmentCount: 3,
          targetReaderSegmentCounts: {
            'genre-core': 4,
            'platform-native': 4,
          },
          dominantReaderSegmentRatio: 0.5,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples, {
      requiredTargetReaderSegments: ['genre-core', 'platform-native', 'style-sensitive'],
      minimumRespondentsPerRequiredTargetSegment: 1,
    });

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(0);
    expect(result.lowRepresentativenessCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'usable',
      panelConsensus: 'clear',
      targetReaderSegmentCounts: {
        'genre-core': 4,
        'platform-native': 4,
      },
      cohortRepresentativeness: 'narrow',
    });
    expect(result.sampleResults[0].cohortRepresentativenessIssues.join('\n')).toContain(
      'required target-reader segment "style-sensitive"'
    );
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'balance-target-reader-cohorts',
          requiredValue: expect.stringContaining('style-sensitive'),
          action: expect.stringContaining('target_reader_segment_counts'),
        }),
      ])
    );
  });

  it('keeps gate tuning disabled when recruitment channel quotas are missing', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`single-source-panel-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          recruitmentChannelCounts: {
            'opt-in-panel': 8,
          },
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples, {
      requiredRecruitmentChannels: ['opt-in-panel', 'newsletter'],
      minimumRespondentsPerRequiredRecruitmentChannel: 1,
      maximumDominantRecruitmentChannelRatio: 0.75,
    });

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.lowConsensusCount).toBe(0);
    expect(result.lowConfidenceCount).toBe(0);
    expect(result.lowProtocolQualityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'usable',
      panelConsensus: 'clear',
      panelProtocolQuality: 'weak',
      recruitmentChannelCounts: {
        'opt-in-panel': 8,
      },
    });
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain(
      'dominant recruitment channel ratio'
    );
    expect(result.sampleResults[0].panelProtocolIssues.join('\n')).toContain(
      'required recruitment channel "newsletter"'
    );
    expect(result.evidenceCollectionPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'strengthen-reader-panel-protocol',
          requiredValue: expect.stringContaining('newsletter'),
          action: expect.stringContaining('recruitment_channel_counts'),
        }),
      ])
    );
  });

  it('keeps gate tuning disabled when friction counts lack revision-actionable evidence', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => ({
      id: `friction-only-${index + 1}`,
      automated: {
        engagementScore: 88,
        gatePassed: true,
      },
      reader: {
        nextClick: 87,
        attention: 86,
        emotionalEngagement: 88,
        mentalImagery: 85,
        transportation: 87,
        interest: 88,
        overallLiking: 88,
      },
      respondentCount: 8,
      evidence: {
        targetReaderCount: 6,
        completedReadCount: 8,
        qualitativeCommentCount: 5,
        frictionPointCount: 2,
      },
    }));

    const result = evaluateReaderResponseCalibration(samples);

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(5);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      evidenceQuality: 'weak',
    });
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('actionable friction annotations');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('rewrite suggestions');
    expect(result.sampleResults[0].evidenceIssues.join('\n')).toContain('structured friction annotations');
  });

  it('reports required genre and consecutive chapter coverage gaps', () => {
    const samples: ReaderResponseCalibrationSample[] = [1, 3, 5, 7, 9]
      .map((chapter, index) => buildActionableSample(`mystery-gap-${index + 1}`, 'mystery', chapter));

    const result = evaluateReaderResponseCalibration(samples, {
      requiredGenres: ['mystery', 'romance'],
      minimumSamplesPerGenre: 5,
      minimumUsableSamplesPerGenre: 5,
      minimumSeriesLength: 3,
      minimumUsableSeriesLength: 3,
    });

    expect(result.genreCoverage.mystery).toMatchObject({
      totalSamples: 5,
      usableSamples: 5,
      chapters: [1, 3, 5, 7, 9],
      longestConsecutiveRun: 1,
      usableChapters: [1, 3, 5, 7, 9],
      usableLongestConsecutiveRun: 1,
    });
    expect(result.missingRequiredGenres).toEqual(['romance']);
    expect(result.underSampledRequiredGenres).toEqual(['romance']);
    expect(result.underSampledUsableRequiredGenres).toEqual(['romance']);
    expect(result.missingRequiredSeriesGenres).toEqual(['mystery', 'romance']);
    expect(result.missingRequiredUsableSeriesGenres).toEqual(['mystery', 'romance']);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations.join('\n')).toContain('required genres');
    expect(result.recommendations.join('\n')).toContain('consecutive chapter');
  });

  it('reports required chapter-range coverage gaps', () => {
    const samples: ReaderResponseCalibrationSample[] = [
      buildActionableSample('opening-mystery-1', 'mystery', 1),
      buildActionableSample('opening-mystery-2', 'mystery', 2),
      buildActionableSample('mid-romance-1', 'romance', 20),
    ];

    const result = evaluateReaderResponseCalibration(samples, {
      minimumSampleCountForTuning: 3,
      requiredChapterRanges: [
        {
          id: 'opening',
          minChapter: 1,
          maxChapter: 3,
          requiredGenres: ['mystery', 'romance'],
          minimumSamples: 3,
          minimumUsableSamples: 3,
        },
        {
          id: 'mid-series',
          minChapter: 10,
          maxChapter: 30,
          requiredGenres: ['mystery'],
          minimumSamples: 2,
          minimumUsableSamples: 2,
        },
      ],
    });

    expect(result.chapterRangeCoverage[0]).toMatchObject({
      id: 'opening',
      totalSamples: 2,
      usableSamples: 2,
      genres: ['mystery'],
      usableGenres: ['mystery'],
      missingRequiredGenres: ['romance'],
      missingRequiredUsableGenres: ['romance'],
    });
    expect(result.chapterRangeCoverage[1]).toMatchObject({
      id: 'mid-series',
      totalSamples: 1,
      usableSamples: 1,
      genres: ['romance'],
      usableGenres: ['romance'],
      missingRequiredGenres: ['mystery'],
      missingRequiredUsableGenres: ['mystery'],
    });
    expect(result.underSampledRequiredChapterRanges).toEqual(['opening', 'mid-series']);
    expect(result.underSampledUsableRequiredChapterRanges).toEqual(['opening', 'mid-series']);
    expect(result.missingRequiredChapterRangeGenres).toEqual(['opening:romance', 'mid-series:mystery']);
    expect(result.missingRequiredUsableChapterRangeGenres).toEqual(['opening:romance', 'mid-series:mystery']);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations.join('\n')).toContain('required chapter ranges');
    expect(result.recommendations.join('\n')).toContain('chapter-range genres');
  });

  it('allows gate tuning when required panel genre and series coverage is satisfied', () => {
    const samples: ReaderResponseCalibrationSample[] = [
      buildActionableSample('mystery-series-1', 'mystery', 1),
      buildActionableSample('mystery-series-2', 'mystery', 2),
      buildActionableSample('mystery-series-3', 'mystery', 3),
      buildActionableSample('mystery-extra-1', 'mystery', 3),
      buildActionableSample('mystery-extra-2', 'mystery', 3),
    ];

    const result = evaluateReaderResponseCalibration(samples, {
      requiredGenres: ['mystery'],
      minimumSamplesPerGenre: 5,
      minimumUsableSamplesPerGenre: 5,
      minimumSeriesLength: 3,
      minimumUsableSeriesLength: 3,
      requiredChapterRanges: [
        {
          id: 'opening',
          minChapter: 1,
          maxChapter: 3,
          requiredGenres: ['mystery'],
          minimumSamples: 5,
          minimumUsableSamples: 5,
        },
      ],
    });

    expect(result.genreCoverage.mystery).toMatchObject({
      totalSamples: 5,
      usableSamples: 5,
      chapters: [1, 2, 3],
      longestConsecutiveRun: 3,
      usableChapters: [1, 2, 3],
      usableLongestConsecutiveRun: 3,
    });
    expect(result.missingRequiredGenres).toHaveLength(0);
    expect(result.underSampledRequiredGenres).toHaveLength(0);
    expect(result.underSampledUsableRequiredGenres).toHaveLength(0);
    expect(result.missingRequiredSeriesGenres).toHaveLength(0);
    expect(result.missingRequiredUsableSeriesGenres).toHaveLength(0);
    expect(result.chapterRangeCoverage[0]).toMatchObject({
      id: 'opening',
      totalSamples: 5,
      usableSamples: 5,
      genres: ['mystery'],
      usableGenres: ['mystery'],
      missingRequiredGenres: [],
      missingRequiredUsableGenres: [],
    });
    expect(result.underSampledRequiredChapterRanges).toHaveLength(0);
    expect(result.underSampledUsableRequiredChapterRanges).toHaveLength(0);
    expect(result.missingRequiredChapterRangeGenres).toHaveLength(0);
    expect(result.missingRequiredUsableChapterRangeGenres).toHaveLength(0);
    expect(result.readyForGateTuning).toBe(true);
  });

  it('keeps gate tuning disabled when absolute reader scores lose against a reference chapter', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`reference-lost-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          comparativeReferenceLabel: 'target-market reference opening',
          comparativePreferenceCurrentCount: 2,
          comparativePreferenceReferenceCount: 5,
          comparativePreferenceTieCount: 1,
          comparativePreferenceRespondentCount: 8,
          comparativeBlindPairwise: true,
          comparativeSameReaderCohort: true,
          comparativeQuestionWordingDisclosed: true,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples, {
      requireComparativePreferenceForTuning: true,
      minimumComparativePreferenceWinRate: 0.55,
      minimumComparativePreferenceRespondentCount: 8,
    });

    expect(result.lowReliabilityCount).toBe(0);
    expect(result.lowActionabilityCount).toBe(0);
    expect(result.weakComparativePreferenceCount).toBe(5);
    expect(result.missingComparativePreferenceCount).toBe(0);
    expect(result.comparativePreferenceEvidenceCount).toBe(5);
    expect(result.comparativePreferenceAverageWinRate).toBeCloseTo(0.31, 2);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.sampleResults[0]).toMatchObject({
      comparativePreferenceStatus: 'weak',
      comparativePreferenceWinRate: 0.31,
      comparativePreferenceRespondentCount: 8,
    });
    expect(result.sampleResults[0].comparativePreferenceIssues.join('\n')).toContain('comparative preference win rate');
    expect(result.gateTuningSuggestions[0].evidenceSummary).toContain('weak comparative preference');
    expect(result.recommendations.join('\n')).toContain('blind pairwise');
  });

  it('allows gate tuning when required comparative preference evidence beats the reference chapter', () => {
    const samples: ReaderResponseCalibrationSample[] = Array.from({ length: 5 }, (_, index) => {
      const sample = buildActionableSample(`reference-beat-${index + 1}`, 'mystery', index + 1);
      return {
        ...sample,
        evidence: {
          ...(sample.evidence ?? {}),
          comparativeReferenceLabel: 'target-market reference opening',
          comparativePreferenceCurrentCount: 6,
          comparativePreferenceReferenceCount: 1,
          comparativePreferenceTieCount: 1,
          comparativePreferenceRespondentCount: 8,
          comparativeBlindPairwise: true,
          comparativeSameReaderCohort: true,
          comparativeQuestionWordingDisclosed: true,
        },
      };
    });

    const result = evaluateReaderResponseCalibration(samples, {
      requireComparativePreferenceForTuning: true,
      minimumComparativePreferenceWinRate: 0.55,
      minimumComparativePreferenceRespondentCount: 8,
    });

    expect(result.weakComparativePreferenceCount).toBe(0);
    expect(result.missingComparativePreferenceCount).toBe(0);
    expect(result.comparativePreferenceAverageWinRate).toBeCloseTo(0.81, 2);
    expect(result.sampleResults.every(sample => sample.comparativePreferenceStatus === 'strong')).toBe(true);
    expect(result.readyForGateTuning).toBe(true);
  });

  it('suggests tightening high automated passes when usable reader panels expose false positives', () => {
    const samples = Array.from({ length: 5 }, (_, index) =>
      buildFalsePositiveActionableSample(`reader-rejected-high-pass-${index + 1}`)
    );

    const result = evaluateReaderResponseCalibration(samples);
    const tightenSuggestion = result.gateTuningSuggestions.find(
      suggestion => suggestion.code === 'tighten-automated-high-pass'
    );
    const dimensionSuggestion = result.gateTuningSuggestions.find(
      suggestion => suggestion.code === 'increase-reader-dimension-sensitivity'
    );

    expect(result.readyForGateTuning).toBe(true);
    expect(result.falsePositiveCount).toBe(5);
    expect(tightenSuggestion).toMatchObject({
      action: 'tighten',
      target: 'automated-high-pass-threshold',
      currentValue: 90,
      suggestedValue: expect.any(Number),
      evidenceSampleIds: samples.map(sample => sample.id),
    });
    expect(tightenSuggestion?.suggestedValue).toBeGreaterThan(90);
    expect(dimensionSuggestion).toMatchObject({
      action: 'increase-sensitivity',
      target: 'reader-dimension:next-click',
    });
  });

  it('suggests reviewing low automated routes when usable reader panels strongly like them', () => {
    const samples = Array.from({ length: 5 }, (_, index) =>
      buildFalseNegativeActionableSample(`reader-loved-low-score-${index + 1}`)
    );

    const result = evaluateReaderResponseCalibration(samples);
    const loosenSuggestion = result.gateTuningSuggestions.find(
      suggestion => suggestion.code === 'loosen-reader-loved-low-score-route'
    );

    expect(result.readyForGateTuning).toBe(true);
    expect(result.falseNegativeCount).toBe(5);
    expect(loosenSuggestion).toMatchObject({
      action: 'loosen',
      target: 'reader-loved-low-score-review',
      currentValue: 75,
      suggestedValue: expect.any(Number),
      evidenceSampleIds: samples.map(sample => sample.id),
    });
    expect(loosenSuggestion?.suggestedValue).toBeLessThan(75);
  });
});

function buildActionableSample(
  id: string,
  genre: string,
  chapter: number
): ReaderResponseCalibrationSample {
  return {
    id,
    genre,
    chapter,
    calibrationSplit: 'holdout',
    automated: {
      engagementScore: 88,
      gatePassed: true,
    },
    reader: {
      nextClick: 87,
      attention: 86,
      emotionalEngagement: 88,
      mentalImagery: 85,
      transportation: 87,
      sceneRecall: 86,
      recommendationIntent: 87,
      interest: 88,
      overallLiking: 88,
    },
    respondentCount: 8,
    evidence: {
      ...buildHumanReaderEvidence(8),
      targetReaderCount: 6,
      targetReaderSegmentCount: 2,
      dominantReaderSegmentRatio: 0.63,
      completedReadCount: 8,
      ...buildRetentionEvidence(8),
      qualitativeCommentCount: 5,
      frictionPointCount: 2,
      actionableFrictionPointCount: 2,
      rewriteSuggestionCount: 2,
      frictionAnnotations: buildStructuredFrictionAnnotations(),
      ...buildAnnotationReliabilityEvidence(),
      ...buildSceneRecallEvidence(),
      ...buildTensionTraceEvidence(),
      ...buildNarrativeForecastEvidence(),
      ...buildLineQuoteEvidence(),
      ...buildPayoffFairnessEvidence(),
      ...buildAdvocacyEvidence(),
      ...buildDurableEngagementEvidence(),
      ...buildContinuationBehaviorEvidence(),
      ...buildResonanceEvidence(),
      ...buildDelayedMemoryEvidence(),
      readerScoreStandardDeviation: 8,
      highResponseCount: 7,
      neutralResponseCount: 1,
      lowResponseCount: 0,
      ...buildStrongPanelProtocolEvidence(),
    },
  };
}

function buildFalsePositiveActionableSample(id: string): ReaderResponseCalibrationSample {
  return {
    id,
    calibrationSplit: 'holdout',
    automated: {
      engagementScore: 94,
      gatePassed: true,
    },
    reader: {
      nextClick: 52,
      attention: 78,
      emotionalEngagement: 72,
      mentalImagery: 76,
      transportation: 73,
      sceneRecall: 72,
      recommendationIntent: 72,
      interest: 78,
      suspense: 68,
      overallLiking: 70,
    },
    respondentCount: 8,
    evidence: {
      ...buildHumanReaderEvidence(8),
      targetReaderCount: 7,
      targetReaderSegmentCount: 2,
      dominantReaderSegmentRatio: 0.6,
      completedReadCount: 8,
      ...buildRetentionEvidence(8),
      qualitativeCommentCount: 5,
      frictionAnnotations: buildNextClickAndSuspenseFrictionAnnotations(),
      ...buildAnnotationReliabilityEvidence(),
      ...buildSceneRecallEvidence(),
      ...buildTensionTraceEvidence(),
      ...buildNarrativeForecastEvidence(),
      ...buildLineQuoteEvidence(),
      ...buildPayoffFairnessEvidence(),
      ...buildAdvocacyEvidence(),
      ...buildDurableEngagementEvidence(),
      ...buildContinuationBehaviorEvidence(),
      ...buildResonanceEvidence(),
      ...buildDelayedMemoryEvidence(),
      readerScoreStandardDeviation: 8,
      highResponseCount: 1,
      neutralResponseCount: 2,
      lowResponseCount: 5,
      ...buildStrongPanelProtocolEvidence(),
    },
  };
}

function buildFalseNegativeActionableSample(id: string): ReaderResponseCalibrationSample {
  return {
    id,
    calibrationSplit: 'holdout',
    automated: {
      engagementScore: 68,
      gatePassed: false,
      issueCodes: ['slow-opening'],
    },
    reader: {
      nextClick: 92,
      attention: 88,
      emotionalEngagement: 91,
      mentalImagery: 89,
      transportation: 90,
      sceneRecall: 90,
      recommendationIntent: 91,
      interest: 93,
      suspense: 87,
      beauty: 90,
      overallLiking: 92,
    },
    respondentCount: 8,
    evidence: {
      ...buildHumanReaderEvidence(8),
      targetReaderCount: 7,
      targetReaderSegmentCount: 2,
      dominantReaderSegmentRatio: 0.6,
      completedReadCount: 8,
      ...buildRetentionEvidence(8),
      qualitativeCommentCount: 5,
      frictionAnnotations: buildStructuredFrictionAnnotations(),
      ...buildAnnotationReliabilityEvidence(),
      ...buildSceneRecallEvidence(),
      ...buildTensionTraceEvidence(),
      ...buildNarrativeForecastEvidence(),
      ...buildLineQuoteEvidence(),
      ...buildPayoffFairnessEvidence(),
      ...buildAdvocacyEvidence(),
      ...buildDurableEngagementEvidence(),
      ...buildContinuationBehaviorEvidence(),
      ...buildResonanceEvidence(),
      ...buildDelayedMemoryEvidence(),
      readerScoreStandardDeviation: 8,
      highResponseCount: 7,
      neutralResponseCount: 1,
      lowResponseCount: 0,
      ...buildStrongPanelProtocolEvidence(),
    },
  };
}

function buildHumanReaderEvidence(respondentCount: number): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'respondentSource'
  | 'humanRespondentCount'
  | 'syntheticRespondentCount'
  | 'authorEstimateCount'
  | 'manuscriptWordCount'
  | 'manuscriptCharacterCount'
  | 'medianReadTimeSeconds'
  | 'minimumReadTimeSeconds'
  | 'speedingResponseCount'
  | 'straightLiningResponseCount'
  | 'duplicateResponseCount'
  | 'botSuspectedResponseCount'
  | 'lowQualityOpenEndedResponseCount'
  | 'inconsistentResponseCount'
  | 'qualityFlaggedResponseCount'
> {
  return {
    respondentSource: 'human-target-reader',
    humanRespondentCount: respondentCount,
    syntheticRespondentCount: 0,
    authorEstimateCount: 0,
    manuscriptWordCount: 2100,
    manuscriptCharacterCount: 7200,
    medianReadTimeSeconds: 420,
    minimumReadTimeSeconds: 180,
    speedingResponseCount: 0,
    straightLiningResponseCount: 0,
    duplicateResponseCount: 0,
    botSuspectedResponseCount: 0,
    lowQualityOpenEndedResponseCount: 0,
    inconsistentResponseCount: 0,
    qualityFlaggedResponseCount: 0,
  };
}

function buildStrongPanelProtocolEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'blindReading'
  | 'authorIdentityMasked'
  | 'priorExposureScreened'
  | 'unexcludedPriorExposureCount'
  | 'spoilerExposureScreened'
  | 'unexcludedSpoilerExposureCount'
  | 'neutralQuestionWording'
  | 'responseOptionOrderRandomized'
  | 'sampleOrderRandomized'
  | 'manuscriptOrderCounterbalanced'
  | 'maxSamplesPerRespondent'
  | 'orderBalanceRatio'
  | 'questionWordingDisclosed'
  | 'recruitmentMethodDisclosed'
  | 'populationDefinitionDisclosed'
  | 'samplingFrameDisclosed'
  | 'fieldworkDatesDisclosed'
  | 'surveyModeDisclosed'
  | 'incentiveDisclosed'
  | 'attentionCheckPassCount'
  | 'excludedResponseCount'
> {
  return {
    blindReading: true,
    authorIdentityMasked: true,
    priorExposureScreened: true,
    unexcludedPriorExposureCount: 0,
    spoilerExposureScreened: true,
    unexcludedSpoilerExposureCount: 0,
    neutralQuestionWording: true,
    responseOptionOrderRandomized: true,
    sampleOrderRandomized: true,
    manuscriptOrderCounterbalanced: true,
    maxSamplesPerRespondent: 2,
    orderBalanceRatio: 0.9,
    questionWordingDisclosed: true,
    recruitmentMethodDisclosed: true,
    populationDefinitionDisclosed: true,
    samplingFrameDisclosed: true,
    fieldworkDatesDisclosed: true,
    surveyModeDisclosed: true,
    incentiveDisclosed: true,
    attentionCheckPassCount: 8,
    excludedResponseCount: 0,
  };
}

function buildAnnotationReliabilityEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'annotationCoderCount'
  | 'annotationDoubleCodedCount'
  | 'annotationAgreementRate'
  | 'annotationReliabilityMetric'
  | 'annotationCodebookVersion'
  | 'annotationAdjudicated'
  | 'annotationCoderBlinded'
> {
  return {
    annotationCoderCount: 2,
    annotationDoubleCodedCount: 5,
    annotationAgreementRate: 0.84,
    annotationReliabilityMetric: 'krippendorff-alpha',
    annotationCodebookVersion: 'reader-friction-v1',
    annotationAdjudicated: true,
    annotationCoderBlinded: true,
  };
}

function buildRetentionEvidence(startedReadCount = 8): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  'startedReadCount' | 'dropOffCount' | 'skimmedReadCount'
> {
  return {
    startedReadCount,
    dropOffCount: 0,
    skimmedReadCount: 0,
  };
}

function buildDropOffAnnotations(): NonNullable<
  NonNullable<ReaderResponseCalibrationSample['evidence']>['dropOffAnnotations']
> {
  return [
    {
      location: 'scene-01 paragraph-04',
      eventType: 'drop-off',
      lastCompletedLocation: 'scene-01 paragraph-03',
      triggerQuote: 'Reader stopped when the app rules ran for two explanatory paragraphs.',
      reason: 'The chapter paused the immediate problem before the next concrete choice appeared.',
      readerCount: 1,
      readerSegment: 'platform-native',
      suggestedRevision: 'Move the app rule into the protagonist action and show the failure consequence in-scene.',
    },
    {
      location: 'scene-02 transition',
      eventType: 'skim',
      triggerQuote: 'Reader skimmed the travel transition before the next clue appeared.',
      reason: 'The transition repeated movement without a fresh question or pressure change.',
      readerCount: 1,
      readerSegment: 'genre-core',
      suggestedRevision: 'Attach the transition to a clue contradiction or countdown pressure in the first sentence.',
    },
  ];
}

function buildSceneRecallEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'unpromptedSceneRecallCount'
  | 'distinctiveSceneRecallCount'
  | 'sceneRecallAnnotations'
> {
  return {
    unpromptedSceneRecallCount: 4,
    distinctiveSceneRecallCount: 3,
    sceneRecallAnnotations: [
      {
        location: 'scene-02 reveal beat',
        rememberedMoment: 'Readers recalled the protagonist finding the altered timestamp on the wet photo.',
        distinctiveDetail: 'The wet photo edge, erased date, and changed suspect hypothesis made the beat chapter-specific.',
        readerCount: 2,
        readerSegment: 'genre-core',
      },
      {
        location: 'ending beat',
        rememberedMoment: 'Readers recalled the final notification naming the next target.',
        distinctiveDetail: 'The sound cue, screen text, and forced next choice stayed together in recall.',
        readerCount: 2,
        readerSegment: 'platform-native',
      },
    ],
  };
}

function buildTensionTraceEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'tensionTracePointCount'
  | 'tensionPeakCount'
  | 'tensionQuestionCount'
  | 'tensionTraceAnnotations'
> {
  return {
    tensionTracePointCount: 4,
    tensionPeakCount: 3,
    tensionQuestionCount: 3,
    tensionTraceAnnotations: [
      {
        location: 'scene-02 reveal beat',
        experiencedTension: 'Readers marked the timestamp reveal as the point where the safe interpretation collapsed.',
        suspenseLevel: 82,
        curiosityLevel: 88,
        surpriseLevel: 78,
        narrativeQuestion: 'Readers wanted to know whether the mentor changed the evidence or the narrator remembered it wrong.',
        stakeOrRisk: 'The wrong hypothesis could expose the next target before the protagonist can act.',
        readerCount: 2,
        readerSegment: 'genre-core',
        reason: 'The beat joined clue reinterpretation, risk, and an immediate next test.',
      },
      {
        location: 'ending beat',
        experiencedTension: 'Readers marked the final notification as a pressure spike that made the next chapter feel necessary.',
        suspenseLevel: 86,
        curiosityLevel: 84,
        surpriseLevel: 70,
        narrativeQuestion: 'Readers wanted to know why the next target was named now.',
        stakeOrRisk: 'The protagonist has to act before the named target is reached.',
        readerCount: 2,
        readerSegment: 'platform-native',
        reason: 'The closing question carried immediate risk instead of only announcing a mystery.',
      },
    ],
  };
}

function buildNarrativeForecastEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'forecastPredictionCount'
  | 'forecastDiversityCount'
  | 'forecastRevisionCount'
  | 'forecastMismatchCount'
  | 'forecastInflectionCount'
  | 'narrativeForecastAnnotations'
> {
  return {
    forecastPredictionCount: 4,
    forecastDiversityCount: 3,
    forecastRevisionCount: 3,
    forecastMismatchCount: 2,
    forecastInflectionCount: 3,
    narrativeForecastAnnotations: [
      {
        location: 'scene-02 reveal beat',
        initialPrediction: 'Readers predicted the mentor had altered the photo timestamp.',
        revisedPrediction: 'Readers shifted toward the narrator memory being contaminated after the wet edge and erased date appeared.',
        actualOutcome: 'The final clue tied the alteration to the next named target rather than the mentor.',
        predictionMismatch: true,
        predictionShift: 'The wet photo edge, erased date, and next target name moved suspicion to a new causal chain.',
        surpriseOrTensionReason: 'The mismatch was fair because it reweighted visible clues instead of discarding them.',
        readerCount: 2,
        readerSegment: 'genre-core',
      },
      {
        location: 'ending beat',
        initialPrediction: 'Readers predicted the next chapter would start with a confrontation.',
        revisedPrediction: 'Readers shifted toward an immediate rescue choice after the final notification named a next target.',
        actualOutcome: 'The chapter ended on a choice between proving the truth and protecting the named target.',
        predictionMismatch: false,
        predictionShift: 'The final notification turned culprit pursuit into time pressure.',
        surpriseOrTensionReason: 'The forecast changed from who-did-it curiosity to what-will-the-protagonist-sacrifice pressure.',
        readerCount: 2,
        readerSegment: 'platform-native',
      },
    ],
  };
}

function buildLineQuoteEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'quoteRecallCount'
  | 'favoriteLineCount'
  | 'shareableLineCount'
  | 'lineQuoteAnnotations'
> {
  return {
    quoteRecallCount: 3,
    favoriteLineCount: 2,
    shareableLineCount: 2,
    lineQuoteAnnotations: [
      {
        location: 'ending beat',
        quotedLine: 'The name was not on the screen anymore; it was already in the room.',
        appealReason: 'Readers liked how the line collapsed a phone clue into physical danger.',
        shareReason: 'Readers said this line alone could pitch the ending hook to another target reader.',
        lineFunction: 'image',
        readerCount: 2,
        readerSegment: 'platform-native',
      },
      {
        location: 'scene-02 reveal beat',
        quotedLine: 'The photograph was not evidence; it was a folded minute.',
        appealReason: 'Readers marked the line as a memorable compression of clue, time pressure, and reveal.',
        shareReason: 'Readers wanted to quote it when discussing why the fair-play clue worked.',
        lineFunction: 'plot',
        readerCount: 1,
        readerSegment: 'genre-core',
      },
    ],
  };
}

function buildPayoffFairnessEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'payoffSetupRecallCount'
  | 'payoffTriggerRecognitionCount'
  | 'payoffEarnedCount'
  | 'payoffRecontextualizationCount'
  | 'payoffEmotionalSatisfactionCount'
  | 'payoffFairnessAnnotations'
> {
  return {
    payoffSetupRecallCount: 4,
    payoffTriggerRecognitionCount: 3,
    payoffEarnedCount: 4,
    payoffRecontextualizationCount: 2,
    payoffEmotionalSatisfactionCount: 3,
    payoffFairnessAnnotations: [
      {
        location: 'scene-02 reveal beat',
        payoffMoment: 'The wet photo timestamp reveal paid off the earlier erased-date detail.',
        rememberedSetup: 'Readers remembered the wet photo edge, erased date, and earlier notification interval.',
        triggerOrReveal: 'The final notification made the erased date connect to the next target schedule.',
        changedInterpretation: 'Readers reread the photo detail as a schedule clue instead of a simple tampering clue.',
        earnedReason: 'The same visual clue had been visible before the reveal, so readers could reconstruct the payoff.',
        emotionalPayoffReason: 'The reveal created fair-play satisfaction and immediate pressure to protect the next target.',
        readerCount: 2,
        readerSegment: 'genre-core',
      },
      {
        location: 'ending beat',
        payoffMoment: 'The next target name turned the clue chain into a time-pressure choice.',
        rememberedSetup: 'Readers remembered the notification sound and the repeated number on the photo back.',
        triggerOrReveal: 'The ending screen repeated the number beside the next target name.',
        changedInterpretation: 'Readers reclassified the number as an interval rather than a date.',
        earnedReason: 'The clue was subtle but present, so the ending felt prepared rather than random.',
        emotionalPayoffReason: 'The payoff mixed discovery pleasure with dread for the named target.',
        readerCount: 2,
        readerSegment: 'platform-native',
      },
    ],
  };
}

function buildAdvocacyEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'organicRecommendationCount'
  | 'discussionPromptCount'
  | 'advocacyAnnotations'
> {
  return {
    organicRecommendationCount: 3,
    discussionPromptCount: 3,
    advocacyAnnotations: [
      {
        location: 'scene-02 reveal beat',
        shareTrigger: 'Readers wanted to recommend the timestamp-photo reveal to fair-play mystery readers.',
        recommendedAudience: 'fair-play mystery readers',
        discussionPrompt: 'Readers wanted to debate whether the altered timestamp implicated the mentor or the narrator.',
        readerCount: 2,
        readerSegment: 'genre-core',
      },
      {
        location: 'ending beat',
        shareTrigger: 'Readers wanted to show the final notification to platform-native friends.',
        recommendedAudience: 'platform-native hook readers',
        discussionPrompt: 'Readers wanted to guess why the next target was named.',
        readerCount: 2,
        readerSegment: 'platform-native',
      },
    ],
  };
}

function buildDurableEngagementEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'bookmarkCount'
  | 'followOrLibraryAddCount'
  | 'returnNextDayCount'
  | 'bingeReadIntentCount'
  | 'paidContinuationIntentCount'
  | 'durableEngagementAnnotations'
> {
  return {
    bookmarkCount: 2,
    followOrLibraryAddCount: 2,
    returnNextDayCount: 2,
    bingeReadIntentCount: 1,
    paidContinuationIntentCount: 1,
    durableEngagementAnnotations: [
      {
        location: 'ending beat',
        commitmentTrigger: 'Readers wanted to bookmark the story because the final notification made the next update feel necessary.',
        intendedAction: 'return',
        readerCount: 2,
        readerSegment: 'platform-native',
        reason: 'The closing consequence created a concrete reason to come back after a delay.',
      },
      {
        location: 'scene-02 reveal beat',
        commitmentTrigger: 'Readers wanted to follow the work because the altered timestamp implied a larger clue pattern.',
        intendedAction: 'follow',
        readerCount: 2,
        readerSegment: 'genre-core',
        reason: 'The reveal promised a continuing fair-play mystery engine instead of a one-off twist.',
      },
    ],
  };
}

function buildContinuationBehaviorEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'nextChapterCtaImpressionCount'
  | 'nextChapterClickCount'
  | 'nextChapterOpenCount'
  | 'nextChapterReadStartCount'
> {
  return {
    nextChapterCtaImpressionCount: 8,
    nextChapterClickCount: 4,
    nextChapterOpenCount: 3,
    nextChapterReadStartCount: 2,
  };
}

function buildResonanceEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'lingeringEmotionCount'
  | 'reflectiveCommentCount'
  | 'personalMemoryOrMeaningCount'
  | 'resonanceAnnotations'
> {
  return {
    lingeringEmotionCount: 3,
    reflectiveCommentCount: 2,
    personalMemoryOrMeaningCount: 1,
    resonanceAnnotations: [
      {
        location: 'closing image',
        lingeringEmotion: 'Readers carried unease and responsibility after the final notification.',
        reflectiveQuestion: 'Readers kept thinking about what the protagonist should sacrifice to save the next target.',
        rememberedImage: 'The dark phone screen with the next target name and the protagonist frozen mid-touch stayed as an image.',
        personalMeaning: 'One reader connected the missed-message guilt to a personal relationship memory.',
        readerCount: 2,
        readerSegment: 'style-sensitive',
      },
    ],
  };
}

function buildDelayedMemoryEvidence(): Pick<
  NonNullable<ReaderResponseCalibrationSample['evidence']>,
  | 'delayedFollowUpRespondentCount'
  | 'delayedFollowUpHours'
  | 'delayedSceneRecallCount'
  | 'delayedCharacterRecallCount'
  | 'delayedNextClickIntentCount'
  | 'delayedReturnIntentCount'
  | 'delayedPaidContinuationIntentCount'
  | 'delayedMemoryAnnotations'
> {
  return {
    delayedFollowUpRespondentCount: 6,
    delayedFollowUpHours: 24,
    delayedSceneRecallCount: 4,
    delayedCharacterRecallCount: 3,
    delayedNextClickIntentCount: 3,
    delayedReturnIntentCount: 3,
    delayedPaidContinuationIntentCount: 2,
    delayedMemoryAnnotations: [
      {
        location: 'ending beat',
        delayedRememberedMoment: 'Readers still remembered the final notification and the named next target one day later.',
        delayedCharacterOrRelationship: 'Readers remembered the protagonist having to break trust with the helper to protect the next target.',
        delayedNextQuestion: 'Readers still wanted to know why that target had been named.',
        returnOrPurchaseReason: 'The delayed choice cost made readers say they would return for the next update.',
        readerCount: 3,
        readerSegment: 'platform-native',
      },
    ],
  };
}

function buildStructuredFrictionAnnotations(): NonNullable<
  NonNullable<ReaderResponseCalibrationSample['evidence']>['frictionAnnotations']
> {
  return [
    {
      location: 'scene-01 paragraph-04',
      dimension: 'mental-imagery',
      reason: 'Readers could not picture where the protagonist stood during the pressure beat.',
      severity: 'major',
      rewriteSuggestion: 'Add visible blocking, a concrete object, and a changed route before the dialogue continues.',
      readerCount: 2,
      readerSegment: 'genre-core',
    },
    {
      location: 'ending beat',
      dimension: 'next-click',
      reason: 'Readers saw a question but not a concrete consequence that made the next chapter urgent.',
      severity: 'critical',
      rewriteSuggestion: 'Put an irreversible choice, immediate cost, or new clue into the closing paragraph.',
      readerCount: 3,
      readerSegment: 'platform-native',
    },
  ];
}

function buildMentalImageryOnlyFrictionAnnotations(): NonNullable<
  NonNullable<ReaderResponseCalibrationSample['evidence']>['frictionAnnotations']
> {
  return [
    {
      location: 'scene-01 paragraph-04',
      dimension: 'mental-imagery',
      reason: 'Readers could not picture where the protagonist stood during the pressure beat.',
      severity: 'major',
      rewriteSuggestion: 'Add visible blocking, a concrete object, and a changed route before the dialogue continues.',
      readerCount: 2,
      readerSegment: 'genre-core',
    },
  ];
}

function buildNextClickFrictionAnnotations(): NonNullable<
  NonNullable<ReaderResponseCalibrationSample['evidence']>['frictionAnnotations']
> {
  return [
    {
      location: 'ending beat',
      dimension: 'next-click',
      reason: 'Readers saw a question but not a concrete consequence that made the next chapter urgent.',
      severity: 'critical',
      rewriteSuggestion: 'Put an irreversible choice, immediate cost, or new clue into the closing paragraph.',
      readerCount: 3,
      readerSegment: 'platform-native',
    },
    {
      location: 'ending beat alternate cohort',
      dimension: 'next-click',
      reason: 'Platform-native readers wanted the hook to force a visible next action.',
      severity: 'major',
      rewriteSuggestion: 'Make the closing reveal force a named character to act before the next scene can begin.',
      readerCount: 2,
      readerSegment: 'genre-core',
    },
  ];
}

function buildNextClickAndSuspenseFrictionAnnotations(): NonNullable<
  NonNullable<ReaderResponseCalibrationSample['evidence']>['frictionAnnotations']
> {
  return [
    ...buildNextClickFrictionAnnotations(),
    {
      location: 'threat beat',
      dimension: 'suspense',
      reason: 'Readers did not feel that the safe option had been removed.',
      severity: 'major',
      rewriteSuggestion: 'Narrow the deadline and make the antagonist action remove one escape route.',
      readerCount: 2,
      readerSegment: 'genre-core',
    },
    {
      location: 'threat beat alternate cohort',
      dimension: 'suspense',
      reason: 'Platform-native readers wanted the risk to force an immediate next action.',
      severity: 'major',
      rewriteSuggestion: 'Make the danger change the next scene objective before the chapter closes.',
      readerCount: 2,
      readerSegment: 'platform-native',
    },
  ];
}

function buildSingleSegmentFrictionAnnotations(): NonNullable<
  NonNullable<ReaderResponseCalibrationSample['evidence']>['frictionAnnotations']
> {
  return [
    {
      location: 'scene-01 paragraph-04',
      dimension: 'mental-imagery',
      reason: 'Readers could not picture where the protagonist stood during the pressure beat.',
      severity: 'major',
      rewriteSuggestion: 'Add visible blocking, a concrete object, and a changed route before the dialogue continues.',
      readerCount: 2,
      readerSegment: 'genre-core',
    },
  ];
}
