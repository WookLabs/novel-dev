/**
 * Quality Gate Retry Logic
 *
 * Retry strategy:
 * - Retry 1: /revise only
 * - Retry 2: /revise with Critic feedback
 * - Retry 3: Partial rewrite of lowest-scoring section
 * - Retry 4+: User intervention required
 */

export interface QualityScore {
  total: number;
  breakdown: {
    category: string;
    score: number;
    feedback: string;
  }[];
}

export interface RetryContext {
  chapterNumber: number;
  attemptNumber: number;
  maxRetries: number;
  lastScore: QualityScore;
  threshold: number;
}

export type RetryStrategy = 'revise' | 'revise_with_feedback' | 'partial_rewrite' | 'user_intervention';
export type ChapterGateStatus = 'PASS' | 'RETRY' | 'USER_INTERVENTION';
export type EngagementAlertLevel = 'none' | 'warning' | 'critical';

export interface EngagementGateIssue {
  code?: string;
  severity?: string;
  message: string;
}

export interface EngagementGateDirective {
  code?: string;
  priority?: string;
  target?: string;
  action: string;
  expected?: string;
  actual?: string;
}

export interface RecurringEngagementGateDirective extends EngagementGateDirective {
  count: number;
  firstChapter: number;
  latestChapter: number;
}

export interface EngagementGateResult {
  passed: boolean;
  score: number;
  alertLevel?: EngagementAlertLevel;
  regressionDetected?: boolean;
  issues?: EngagementGateIssue[];
  revisionDirectives?: EngagementGateDirective[];
  recurringEngagementDirectives?: RecurringEngagementGateDirective[];
}

export interface ProseCraftGateDirective {
  type: string;
  priority?: number;
  issue: string;
  instruction?: string;
  currentText?: string;
}

export interface ProseCraftGateResult {
  passed: boolean;
  verdict: 'PASS' | 'REVISE' | 'MISSING';
  score: number;
  issues?: string[];
  revisionDirectives?: ProseCraftGateDirective[];
}

export interface ReaderResponseGateDirective {
  dimension?: string;
  action: string;
  expected?: string;
  actual?: string;
}

export interface ReaderResponseGateResult {
  passed: boolean;
  score: number;
  calibrationScore?: number;
  failureType?: string;
  sampleId?: string;
  respondentCount?: number;
  reliability?: string;
  issues?: string[];
  revisionDirectives?: ReaderResponseGateDirective[];
}

export interface ChapterGateContext extends RetryContext {
  engagement?: EngagementGateResult;
  requireEngagement?: boolean;
  proseCraft?: ProseCraftGateResult;
  requireProseCraft?: boolean;
  readerResponse?: ReaderResponseGateResult;
  requireReaderResponse?: boolean;
}

export interface ChapterGateDecision {
  status: ChapterGateStatus;
  passed: boolean;
  shouldRetry: boolean;
  strategy: RetryStrategy | 'none';
  blockingReasons: string[];
  retryPrompt: string;
  score: number;
}

const STRUCTURAL_ENGAGEMENT_REPEAT_THRESHOLD = 3;

export function determineRetryStrategy(context: RetryContext): RetryStrategy {
  if (context.attemptNumber === 1) return 'revise';
  if (context.attemptNumber === 2) return 'revise_with_feedback';
  if (context.attemptNumber === 3) return 'partial_rewrite';
  return 'user_intervention';
}

export function getLowestScoringSection(score: QualityScore): string {
  const sorted = [...score.breakdown].sort((a, b) => a.score - b.score);
  return sorted[0]?.category || 'unknown';
}

export function buildRetryPrompt(strategy: RetryStrategy, context: RetryContext): string {
  switch (strategy) {
    case 'revise':
      return `${context.chapterNumber}화를 수정해주세요.`;
    case 'revise_with_feedback':
      const feedback = context.lastScore.breakdown
        .map(b => `- ${b.category}: ${b.feedback}`)
        .join('\n');
      return `${context.chapterNumber}화를 다음 피드백을 반영하여 수정해주세요:\n${feedback}`;
    case 'partial_rewrite':
      const section = getLowestScoringSection(context.lastScore);
      return `${context.chapterNumber}화의 "${section}" 섹션을 다시 작성해주세요.`;
    case 'user_intervention':
      return `${context.chapterNumber}화가 ${context.maxRetries}회 재시도 후에도 품질 기준(${context.threshold}점)을 통과하지 못했습니다. 수동 개입이 필요합니다.`;
  }
}

export function shouldContinueRetry(context: RetryContext): boolean {
  return context.attemptNumber <= context.maxRetries &&
         context.lastScore.total < context.threshold;
}

export function evaluateChapterGate(context: ChapterGateContext): ChapterGateDecision {
  const blockingReasons = getChapterGateBlockingReasons(context);

  if (blockingReasons.length === 0) {
    return {
      status: 'PASS',
      passed: true,
      shouldRetry: false,
      strategy: 'none',
      blockingReasons,
      retryPrompt: '',
      score: context.lastScore.total,
    };
  }

  const structuralEngagementFailure = getStructuralEngagementDirective(context) !== undefined;
  const shouldRetry = !structuralEngagementFailure && context.attemptNumber <= context.maxRetries;
  const strategy = shouldRetry ? determineRetryStrategy(context) : 'user_intervention';
  const status: ChapterGateStatus = shouldRetry ? 'RETRY' : 'USER_INTERVENTION';

  return {
    status,
    passed: false,
    shouldRetry,
    strategy,
    blockingReasons,
    retryPrompt: buildChapterGatePrompt(strategy, context, blockingReasons),
    score: context.lastScore.total,
  };
}

function getChapterGateBlockingReasons(context: ChapterGateContext): string[] {
  const reasons: string[] = [];

  if (context.lastScore.total < context.threshold) {
    reasons.push(`품질 점수 미달: ${context.lastScore.total}/${context.threshold}`);
  }

  if (!context.engagement) {
    if (context.requireEngagement) {
      reasons.push('독자 몰입 계약 평가 누락');
    }
  } else {
    if (!context.engagement.passed) {
      reasons.push(`독자 몰입 계약 실패: ${context.engagement.score}점`);
    }

    if (context.engagement.regressionDetected) {
      reasons.push(`독자 몰입 회귀 감지: ${context.engagement.alertLevel ?? 'warning'}`);
    } else if (context.engagement.alertLevel && context.engagement.alertLevel !== 'none') {
      reasons.push(`독자 몰입 추세 경고: ${context.engagement.alertLevel}`);
    }

    const structuralDirective = getStructuralEngagementDirective(context);
    if (structuralDirective) {
      const label = structuralDirective.code ?? structuralDirective.action;
      reasons.push(`반복 독자 몰입 실패: ${label} ${structuralDirective.count}회`);
    }
  }

  if (!context.proseCraft) {
    if (context.requireProseCraft) {
      reasons.push('원고 문장 품질 평가 누락');
    }
  } else if (!context.proseCraft.passed) {
    reasons.push(
      `원고 문장 품질 실패: ${context.proseCraft.verdict} ${context.proseCraft.score}점`
    );
  }

  if (!context.readerResponse) {
    if (context.requireReaderResponse) {
      reasons.push('독자 반응 캘리브레이션 평가 누락');
    }
    return reasons;
  }

  if (!context.readerResponse.passed) {
    const suffix = context.readerResponse.failureType
      ? ` (${context.readerResponse.failureType})`
      : '';
    reasons.push(
      `${readerResponseGateFailureLabel(context.readerResponse)}: ${context.readerResponse.score}점${suffix}`
    );
  }

  return reasons;
}

function readerResponseGateFailureLabel(result: ReaderResponseGateResult): string {
  const failureType = result.failureType ?? '';
  if (failureType.includes('stale-report')) {
    return '평가 리포트 freshness 실패';
  }

  if (failureType.includes('engagement-benchmark')) {
    return '회차 재미 벤치마크 실패';
  }

  if (!failureType.includes('consistency-report') && failureType.includes('character-relationship')) {
    return '인물/관계 독자 투자 실패';
  }

  if (!failureType.includes('consistency-report')) {
    return '독자 패널 반응 실패';
  }

  const hasOtherFailure =
    failureType.includes('series-retention') ||
    failureType.includes('character-relationship') ||
    failureType.includes('auto-false-positive') ||
    failureType.includes('auto-overestimate');
  return hasOtherFailure ? '독자 패널/장편 검증 실패' : '장편 일관성 검증 실패';
}

function getStructuralEngagementDirective(
  context: ChapterGateContext
): RecurringEngagementGateDirective | undefined {
  return (context.engagement?.recurringEngagementDirectives ?? []).find(
    directive => directive.count >= STRUCTURAL_ENGAGEMENT_REPEAT_THRESHOLD
  );
}

function padChapterNumber(chapterNumber: number): string {
  return chapterNumber.toString().padStart(3, '0');
}

function buildChapterGatePrompt(
  strategy: RetryStrategy,
  context: ChapterGateContext,
  blockingReasons: string[]
): string {
  const basePrompt = buildRetryPrompt(strategy, context);
  const reasons = blockingReasons.map(reason => `- ${reason}`).join('\n');
  const issueDetails = (context.engagement?.issues ?? [])
    .map(issue => {
      const code = issue.code ? `${issue.code}: ` : '';
      const severity = issue.severity ? ` (${issue.severity})` : '';
      return `- ${code}${issue.message}${severity}`;
    })
    .join('\n');

  const engagementSection = issueDetails
    ? `\n\n독자 몰입 계약 진단:\n${issueDetails}`
    : '';
  const directiveDetails = (context.engagement?.revisionDirectives ?? [])
    .slice(0, 5)
    .map(directive => {
      const priority = directive.priority ? `[${directive.priority}] ` : '';
      const target = directive.target ? `${directive.target}: ` : '';
      const expected = directive.expected ? `\n  expected: ${directive.expected}` : '';
      const actual = directive.actual ? `\n  actual: ${directive.actual}` : '';
      return `- ${priority}${target}${directive.action}${expected}${actual}`;
    })
    .join('\n');
  const directiveSection = directiveDetails
    ? `\n\nEngagement Revision Directives:\n${directiveDetails}`
    : '';
  const repeatedDirectiveDetails = (context.engagement?.recurringEngagementDirectives ?? [])
    .slice(0, 5)
    .map(directive => {
      const priority = directive.priority ? `[${directive.priority}] ` : '';
      const target = directive.target ? `${directive.target}: ` : '';
      const range = `${directive.count}x across chapters ${directive.firstChapter}-${directive.latestChapter}`;
      return `- ${priority}${target}${directive.action} (${range})`;
    })
    .join('\n');
  const repeatedDirectiveSection = repeatedDirectiveDetails
    ? `\n\nRepeated Engagement Directives:\n${repeatedDirectiveDetails}`
    : '';
  const proseCraftIssues = (context.proseCraft?.issues ?? [])
    .slice(0, 5)
    .map(issue => `- ${issue}`)
    .join('\n');
  const proseCraftIssueSection = proseCraftIssues
    ? `\n\n원고 문장 품질 진단:\n${proseCraftIssues}`
    : '';
  const proseCraftDirectiveDetails = (context.proseCraft?.revisionDirectives ?? [])
    .slice(0, 5)
    .map(directive => {
      const priority = directive.priority !== undefined ? `[P${directive.priority}] ` : '';
      const instruction = directive.instruction ? `\n  instruction: ${directive.instruction}` : '';
      const currentText = directive.currentText ? `\n  current: ${directive.currentText}` : '';
      return `- ${priority}${directive.type}: ${directive.issue}${instruction}${currentText}`;
    })
    .join('\n');
  const proseCraftDirectiveSection = proseCraftDirectiveDetails
    ? `\n\nProse Craft Revision Directives:\n${proseCraftDirectiveDetails}`
    : '';
  const readerResponseIssues = (context.readerResponse?.issues ?? [])
    .slice(0, 5)
    .map(issue => `- ${issue}`)
    .join('\n');
  const readerResponseIssueSection = readerResponseIssues
    ? `\n\n${readerResponseDiagnosticLabel(context.readerResponse)}:\n${readerResponseIssues}`
    : '';
  const readerResponseDirectiveDetails = (context.readerResponse?.revisionDirectives ?? [])
    .slice(0, 5)
    .map(directive => {
      const dimension = directive.dimension ? `${directive.dimension}: ` : '';
      const expected = directive.expected ? `\n  expected: ${directive.expected}` : '';
      const actual = directive.actual ? `\n  actual: ${directive.actual}` : '';
      return `- ${dimension}${directive.action}${expected}${actual}`;
    })
    .join('\n');
  const readerResponseDirectiveSection = readerResponseDirectiveDetails
    ? `\n\n${readerResponseDirectiveLabel(context.readerResponse)}:\n${readerResponseDirectiveDetails}`
    : '';
  const structuralDirective = getStructuralEngagementDirective(context);
  const structuralSection = structuralDirective
    ? `\n\n구조적 재검토:\n- 같은 독자 몰입 실패가 ${structuralDirective.count}회 반복되어 단일 회차 재시도로는 해결하지 않습니다.\n- plot/plot-strategy.json의 fun_spec, tension_curve, binge_architecture를 재점검하세요.\n- chapters/chapter_${padChapterNumber(structuralDirective.latestChapter)}.json의 final scene evidence와 reader_experience를 함께 수정하세요.`
    : '';

  return `${basePrompt}\n\n회차 품질 게이트를 함께 복구하세요.\n차단 사유:\n${reasons}${engagementSection}${directiveSection}${repeatedDirectiveSection}${proseCraftIssueSection}${proseCraftDirectiveSection}${readerResponseIssueSection}${readerResponseDirectiveSection}${structuralSection}`;
}

function readerResponseDiagnosticLabel(readerResponse?: ReaderResponseGateResult): string {
  const failureType = readerResponse?.failureType ?? '';
  if (failureType.includes('stale-report')) {
    return '평가 리포트 freshness 진단';
  }

  if (failureType.includes('consistency-report')) {
    return failureType.includes('character-relationship')
      ? '독자 패널/인물 관계/장편 검증 진단'
      : '독자 패널/장편 검증 진단';
  }
  return failureType.includes('character-relationship')
    ? '인물/관계 독자 투자 진단'
    : '독자 패널 반응 진단';
}

function readerResponseDirectiveLabel(readerResponse?: ReaderResponseGateResult): string {
  const failureType = readerResponse?.failureType ?? '';
  if (failureType.includes('stale-report')) {
    return 'Evaluation Report Freshness Directives';
  }

  if (failureType.includes('consistency-report')) {
    return failureType.includes('character-relationship')
      ? 'Reader Response / Character Relationship / Long-Form Consistency Revision Directives'
      : 'Reader Response / Long-Form Consistency Revision Directives';
  }
  return failureType.includes('character-relationship')
    ? 'Reader Response / Character Relationship Revision Directives'
    : 'Reader Response Revision Directives';
}
