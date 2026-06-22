import { describe, it, expect } from 'vitest';
import {
  determineRetryStrategy,
  evaluateChapterGate,
  getLowestScoringSection,
  buildRetryPrompt,
  shouldContinueRetry,
} from '../../src/retry/quality-gate.js';
import type { QualityScore, RetryContext } from '../../src/retry/quality-gate.js';

const makeScore = (total: number, breakdown: { category: string; score: number; feedback: string }[] = []): QualityScore => ({
  total,
  breakdown,
});

const makeContext = (overrides: Partial<RetryContext> = {}): RetryContext => ({
  chapterNumber: 5,
  attemptNumber: 1,
  maxRetries: 3,
  lastScore: makeScore(60, [
    { category: '플롯', score: 70, feedback: '괜찮음' },
    { category: '캐릭터', score: 50, feedback: '개선 필요' },
    { category: '문체', score: 60, feedback: '보통' },
  ]),
  threshold: 70,
  ...overrides,
});

describe('determineRetryStrategy', () => {
  it('should return revise for attempt 1', () => {
    expect(determineRetryStrategy(makeContext({ attemptNumber: 1 }))).toBe('revise');
  });

  it('should return revise_with_feedback for attempt 2', () => {
    expect(determineRetryStrategy(makeContext({ attemptNumber: 2 }))).toBe('revise_with_feedback');
  });

  it('should return partial_rewrite for attempt 3', () => {
    expect(determineRetryStrategy(makeContext({ attemptNumber: 3 }))).toBe('partial_rewrite');
  });

  it('should return user_intervention for attempt 4+', () => {
    expect(determineRetryStrategy(makeContext({ attemptNumber: 4 }))).toBe('user_intervention');
    expect(determineRetryStrategy(makeContext({ attemptNumber: 10 }))).toBe('user_intervention');
  });
});

describe('getLowestScoringSection', () => {
  it('should return the lowest scoring category', () => {
    const score = makeScore(60, [
      { category: '플롯', score: 70, feedback: '' },
      { category: '캐릭터', score: 50, feedback: '' },
      { category: '문체', score: 80, feedback: '' },
    ]);
    expect(getLowestScoringSection(score)).toBe('캐릭터');
  });

  it('should return unknown for empty breakdown', () => {
    expect(getLowestScoringSection(makeScore(0, []))).toBe('unknown');
  });

  it('should handle single item breakdown', () => {
    const score = makeScore(60, [{ category: '플롯', score: 60, feedback: '' }]);
    expect(getLowestScoringSection(score)).toBe('플롯');
  });
});

describe('buildRetryPrompt', () => {
  it('should build revise prompt with chapter number', () => {
    const prompt = buildRetryPrompt('revise', makeContext());
    expect(prompt).toContain('5화');
    expect(prompt).toContain('수정');
  });

  it('should build revise_with_feedback prompt with feedback', () => {
    const prompt = buildRetryPrompt('revise_with_feedback', makeContext());
    expect(prompt).toContain('5화');
    expect(prompt).toContain('피드백');
    expect(prompt).toContain('캐릭터');
  });

  it('should build partial_rewrite prompt with lowest section', () => {
    const prompt = buildRetryPrompt('partial_rewrite', makeContext());
    expect(prompt).toContain('5화');
    expect(prompt).toContain('캐릭터');
    expect(prompt).toContain('다시 작성');
  });

  it('should build user_intervention prompt with retry count and threshold', () => {
    const prompt = buildRetryPrompt('user_intervention', makeContext());
    expect(prompt).toContain('5화');
    expect(prompt).toContain('3'); // maxRetries
    expect(prompt).toContain('70'); // threshold
    expect(prompt).toContain('수동 개입');
  });
});

describe('shouldContinueRetry', () => {
  it('should return true when under max retries and below threshold', () => {
    expect(shouldContinueRetry(makeContext({ attemptNumber: 1, maxRetries: 3 }))).toBe(true);
  });

  it('should return true through the configured retry count', () => {
    expect(shouldContinueRetry(makeContext({ attemptNumber: 3, maxRetries: 3 }))).toBe(true);
  });

  it('should return false after max retries are exhausted', () => {
    expect(shouldContinueRetry(makeContext({ attemptNumber: 4, maxRetries: 3 }))).toBe(false);
  });

  it('should return false when score meets threshold', () => {
    expect(shouldContinueRetry(makeContext({ lastScore: makeScore(70), threshold: 70 }))).toBe(false);
  });

  it('should return false when score exceeds threshold', () => {
    expect(shouldContinueRetry(makeContext({ lastScore: makeScore(90), threshold: 70 }))).toBe(false);
  });

  it('should return true when exactly one below threshold', () => {
    expect(shouldContinueRetry(makeContext({
      attemptNumber: 1,
      lastScore: makeScore(69),
      threshold: 70
    }))).toBe(true);
  });
});

describe('evaluateChapterGate', () => {
  it('should pass when score and engagement contract both pass', () => {
    const decision = evaluateChapterGate({
      ...makeContext({
        lastScore: makeScore(92),
        threshold: 85,
      }),
      engagement: {
        passed: true,
        score: 93,
        alertLevel: 'none',
        regressionDetected: false,
        issues: [],
      },
    });

    expect(decision.status).toBe('PASS');
    expect(decision.passed).toBe(true);
    expect(decision.shouldRetry).toBe(false);
    expect(decision.blockingReasons).toEqual([]);
  });

  it('should retry when prose craft fails even if score and engagement pass', () => {
    const decision = evaluateChapterGate({
      ...makeContext({
        attemptNumber: 1,
        maxRetries: 3,
        lastScore: makeScore(95),
        threshold: 85,
      }),
      engagement: {
        passed: true,
        score: 96,
        alertLevel: 'none',
        regressionDetected: false,
        issues: [],
      },
      proseCraft: {
        passed: false,
        verdict: 'REVISE',
        score: 58,
        issues: [
          '감각적 묘사가 부족하여 장면이 평면적으로 느껴집니다',
          '문장 종결이 단조로워 읽는 흐름이 끊깁니다',
        ],
        revisionDirectives: [
          {
            type: 'sensory-enrichment',
            priority: 4,
            issue: '이 구간에 감각적 묘사가 부족합니다',
            instruction: '시각, 청각, 촉각 중 2가지 이상의 감각을 자연스럽게 추가하세요.',
          },
        ],
      },
      requireProseCraft: true,
    });

    expect(decision.status).toBe('RETRY');
    expect(decision.passed).toBe(false);
    expect(decision.shouldRetry).toBe(true);
    expect(decision.blockingReasons).toContain('원고 문장 품질 실패: REVISE 58점');
    expect(decision.retryPrompt).toContain('Prose Craft Revision Directives');
    expect(decision.retryPrompt).toContain('sensory-enrichment');
  });

  it('should retry when reader panel response contradicts high automated scores', () => {
    const decision = evaluateChapterGate({
      ...makeContext({
        attemptNumber: 1,
        maxRetries: 3,
        lastScore: makeScore(95),
        threshold: 85,
      }),
      engagement: {
        passed: true,
        score: 96,
        alertLevel: 'none',
        regressionDetected: false,
        issues: [],
      },
      proseCraft: {
        passed: true,
        verdict: 'PASS',
        score: 91,
        issues: [],
      },
      readerResponse: {
        passed: false,
        score: 62,
        calibrationScore: 71,
        failureType: 'auto-false-positive',
        sampleId: 'chapter-005-panel',
        respondentCount: 8,
        reliability: 'usable',
        issues: [
          '독자 패널 샘플 chapter-005-panel에서 자동 점수와 독자 반응이 어긋났습니다: 62점',
          'next-click: 42/70 - Readers are not sufficiently motivated to continue to the next chapter.',
        ],
        revisionDirectives: [
          {
            dimension: 'next-click',
            action: 'Rewrite the final open loop so readers want the next chapter.',
            expected: 'reader next-click >= 70',
            actual: '42',
          },
        ],
      },
    });

    expect(decision.status).toBe('RETRY');
    expect(decision.passed).toBe(false);
    expect(decision.blockingReasons).toContain(
      '독자 패널 반응 실패: 62점 (auto-false-positive)'
    );
    expect(decision.retryPrompt).toContain('독자 패널 반응 진단');
    expect(decision.retryPrompt).toContain('Reader Response Revision Directives');
    expect(decision.retryPrompt).toContain('next-click');
  });

  it('should retry when engagement fails even if quality score exceeds threshold', () => {
    const decision = evaluateChapterGate({
      ...makeContext({
        attemptNumber: 1,
        maxRetries: 3,
        lastScore: makeScore(95),
        threshold: 85,
      }),
      engagement: {
        passed: false,
        score: 68,
        alertLevel: 'none',
        regressionDetected: false,
        issues: [
          {
            code: 'must-click-ending-drift',
            severity: 'critical',
            message: 'Ending no longer matches the must-click promise.',
          },
        ],
        revisionDirectives: [
          {
            code: 'must-click-ending-not-staged',
            priority: 'critical',
            target: 'final_scene',
            action: 'Rewrite the final scene beat to stage the must-click ending.',
            expected: '피해자의 휴대폰에서 주인공 이름이 다음 수신자로 다시 깜박인다.',
            actual: '주인공은 집으로 돌아간다.',
          },
        ],
        recurringEngagementDirectives: [
          {
            code: 'must-click-ending-not-staged',
            count: 2,
            firstChapter: 1,
            latestChapter: 5,
            priority: 'critical',
            target: 'final_scene',
            action: 'Rewrite the final scene beat to stage the must-click ending.',
          },
        ],
      },
    });

    expect(decision.status).toBe('RETRY');
    expect(decision.passed).toBe(false);
    expect(decision.shouldRetry).toBe(true);
    expect(decision.strategy).toBe('revise');
    expect(decision.blockingReasons).toContain('독자 몰입 계약 실패: 68점');
    expect(decision.retryPrompt).toContain('독자 몰입 계약');
    expect(decision.retryPrompt).toContain('must-click-ending-drift');
    expect(decision.retryPrompt).toContain('Engagement Revision Directives');
    expect(decision.retryPrompt).toContain('[critical] final_scene');
    expect(decision.retryPrompt).toContain('Rewrite the final scene beat');
    expect(decision.retryPrompt).toContain('Repeated Engagement Directives');
    expect(decision.retryPrompt).toContain('2x across chapters 1-5');
  });

  it('should require structural user intervention when an engagement directive repeats 3 times', () => {
    const decision = evaluateChapterGate({
      ...makeContext({
        attemptNumber: 1,
        maxRetries: 3,
        lastScore: makeScore(95),
        threshold: 85,
      }),
      engagement: {
        passed: false,
        score: 66,
        alertLevel: 'none',
        regressionDetected: false,
        issues: [
          {
            code: 'must-click-ending-not-staged',
            severity: 'critical',
            message: 'Final scene repeatedly misses the must-click ending.',
          },
        ],
        recurringEngagementDirectives: [
          {
            code: 'must-click-ending-not-staged',
            count: 3,
            firstChapter: 1,
            latestChapter: 6,
            priority: 'critical',
            target: 'final_scene',
            action: 'Rewrite the final scene beat to stage the must-click ending.',
          },
        ],
      },
    });

    expect(decision.status).toBe('USER_INTERVENTION');
    expect(decision.shouldRetry).toBe(false);
    expect(decision.strategy).toBe('user_intervention');
    expect(decision.blockingReasons).toContain(
      '반복 독자 몰입 실패: must-click-ending-not-staged 3회'
    );
    expect(decision.retryPrompt).toContain('구조적 재검토');
    expect(decision.retryPrompt).toContain('plot/plot-strategy.json');
    expect(decision.retryPrompt).toContain('chapters/chapter_006.json');
  });

  it('should use partial rewrite on the third retry attempt', () => {
    const decision = evaluateChapterGate({
      ...makeContext({
        attemptNumber: 3,
        maxRetries: 3,
        lastScore: makeScore(91),
        threshold: 85,
      }),
      engagement: {
        passed: true,
        score: 86,
        alertLevel: 'critical',
        regressionDetected: true,
        issues: [],
      },
    });

    expect(decision.status).toBe('RETRY');
    expect(decision.passed).toBe(false);
    expect(decision.shouldRetry).toBe(true);
    expect(decision.strategy).toBe('partial_rewrite');
    expect(decision.blockingReasons).toContain('독자 몰입 회귀 감지: critical');
    expect(decision.retryPrompt).toContain('다시 작성');
  });

  it('should require user intervention after max retries are exhausted', () => {
    const decision = evaluateChapterGate({
      ...makeContext({
        attemptNumber: 4,
        maxRetries: 3,
        lastScore: makeScore(91),
        threshold: 85,
      }),
      engagement: {
        passed: true,
        score: 86,
        alertLevel: 'critical',
        regressionDetected: true,
        issues: [],
      },
    });

    expect(decision.status).toBe('USER_INTERVENTION');
    expect(decision.passed).toBe(false);
    expect(decision.shouldRetry).toBe(false);
    expect(decision.strategy).toBe('user_intervention');
    expect(decision.blockingReasons).toContain('독자 몰입 회귀 감지: critical');
    expect(decision.retryPrompt).toContain('수동 개입');
  });
});
