import { describe, expect, it } from 'vitest';

import {
  evaluateEngagementBenchmark,
  type EngagementBenchmarkSample,
  type EngagementContractInput,
} from '../../src/index.js';

const design = {
  reader_promise_contract: {
    core_hook: '살인을 예고하는 앱',
    irresistible_question: '앱은 왜 주인공에게만 첫 알림을 보냈고, 예고 앱은 실제 살인을 어떻게 알았는가?',
    protagonist_appeal: '공포보다 패턴을 먼저 읽고 사람을 구하려는 집요함',
    novelty_angle: '앱이 아직 일어나지 않은 살인을 예보한다',
    emotional_payoff: '단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감',
    binge_reason: '새 알림마다 과거 미제 사건 번호와 현재 사건 기록이 연결된다',
    long_series_engine: '예고 앱의 개발자, 과거 미제 사건, 주인공 가족의 실종이 하나의 장기 미스터리로 수렴한다',
    first_five_chapter_retention_plan: [
      '1화: 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명',
      '2화: 앱 로고와 미제 사건 번호가 연결된다',
      '3화: 다음 표적이 조력자임이 드러난다',
      '4화: 경찰 내부 기록 조작 단서가 나온다',
      '5화: 주인공 가족 실종과 앱 개발자가 이어진다',
    ],
  },
};

const guide = {
  chapter: 1,
  arc_beats: '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명',
  fun_spec: {
    reader_reward: '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명',
    page_turn_question: '앱은 왜 주인공에게만 첫 알림을 보냈고, 예고 앱은 실제 살인을 어떻게 알았는가?',
    character_appeal_moment: '주인공이 공포보다 패턴을 먼저 읽고 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나간다.',
    drop_off_risk: '앱 설명이 길어질 위험 - 알림, 이동, 현장 실패 순서로 규칙을 행동으로 보여준다.',
    must_click_ending: '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
  },
};

const plot = {
  binge_architecture: {
    long_hook_threads: [
      '예고 앱의 개발자와 과거 미제 사건의 연결',
      '주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다',
    ],
    payoff_cadence: '매 회차 작은 규칙 증명, 3회마다 큰 반전',
    fatigue_controls: ['설명 대신 현장 행동으로 규칙 제시'],
  },
  tension_curve: {
    key_peaks: [
      {
        chapter: 1,
        event: guide.fun_spec.reader_reward,
        tension_level: 9,
      },
    ],
  },
  per_chapter_guide: [guide],
};

const alignedChapter = {
  chapter_number: 1,
  chapter_title: '첫 번째 알림',
  reader_experience: {
    promise_fulfillment:
      '살인을 예고하는 앱이 주인공의 이름을 첫 번째 수신자로 지목하고, 아직 일어나지 않은 살인을 예보한다. 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감을 함께 제공한다. 예고 앱의 개발자, 과거 미제 사건, 주인공 가족의 실종이 하나의 장기 미스터리로 수렴한다.',
    chapter_reward: guide.fun_spec.reader_reward,
    page_turner_question: guide.fun_spec.page_turn_question,
    character_appeal_moment: guide.fun_spec.character_appeal_moment,
    drop_off_risk: guide.fun_spec.drop_off_risk,
    must_click_ending: guide.fun_spec.must_click_ending,
    cliffhanger_strength: 9,
  },
  scenes: [
    {
      scene_number: 1,
      purpose: '예고 앱의 첫 알림과 주인공의 반응을 제시한다.',
      conflict:
        '장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 한다.',
      beat: '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명, 주인공이 경찰 신고보다 현장 도착 시간을 먼저 계산해 뛰쳐나간다. 신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없다. 알림, 이동, 현장 실패 순서로 규칙을 행동으로 보여준다. 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감을 만든다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종 단서가 장기 미스터리로 남는다.',
    },
    {
      scene_number: 2,
      purpose: '현장 실패 직후 앱 예고가 실제 사건과 연결됨을 증명한다.',
      conflict:
        '주인공은 제한 시간 안에 피해자를 찾으려 하지만 누군가 통제선 조명을 꺼뜨리고 현장 기록을 숨긴 탓에 피해자 휴대폰만 남는다.',
      beat: `현장 실패 직후 ${guide.fun_spec.must_click_ending} 그는 피해자의 휴대폰을 움켜쥔 채 가슴이 조였고, 다음 수신자로 깜박이는 자기 이름을 확인하려 화면을 다시 눌렀다.`,
    },
  ],
};

const alignedManuscript = [
  '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
  '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
  '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
  '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
  '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
].join('\n');

const flatPayoffManuscript = [
  '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
  '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
  '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
  '현장 기록의 빈칸과 피해자의 휴대폰 로그, 피해자의 사망 시각을 다시 대조하자 앱 알림이 실제 사건과 맞아떨어졌다는 규칙이 확인됐고, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 새 알림이 다음 수신자를 지목하자 그는 문턱에서 계획을 바꿔 화면을 눌렀다.',
  '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
].join('\n');

const convenientResolutionManuscript = [
  '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
  '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
  '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다.',
  '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 고립됐다.',
  '마침 경찰이 도착해 문이 열렸고, 형사가 범인을 붙잡아 피해자를 구했다.',
  '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다.',
  '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
].join('\n');

const nonPersonalizedStakesManuscript = [
  '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
  '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
  '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 현장 기록을 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
  '현장 기록의 빈칸과 검은 시각표가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 화면을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 사망 시각과 함께 눈앞에서 굳어졌다.',
  '새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
].join('\n');

const broadEndingQuestionManuscript = [
  '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
  '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
  '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
  '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌고, 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지는 미제 사건 번호 뒤에 더 깊이 숨었다.',
  '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 그는 화면을 움켜쥔 채 숨을 삼켰다.',
  '하지만 이 사건의 진실은 무엇인지 알 수 없었다.',
].join('\n');

describe('evaluateEngagementBenchmark', () => {
  it('measures labeled engagement samples by genre and route', () => {
    const samples: EngagementBenchmarkSample[] = [
      {
        id: 'mystery-high-retention-pass',
        genre: 'mystery',
        routes: ['interest', 'suspense', 'genre-delight', 'next-click'],
        positiveQualityCodes: [
          'signature-scene-image',
          'payoff-delight',
          'genre-delight',
          'next-click-compulsion',
        ],
        chapter: 1,
        calibrationSplit: 'calibration',
        input: inputWithManuscript(alignedManuscript),
        expectedPassed: true,
        expectedMinScore: 90,
        forbiddenIssueCodes: [
          'manuscript-payoff-delight-not-evidenced',
          'manuscript-ending-hook-closed',
        ],
      },
      {
        id: 'flat-payoff-fail',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(flatPayoffManuscript),
        expectedPassed: false,
        expectedIssueCodes: ['manuscript-payoff-delight-not-evidenced'],
        expectedMaxScore: 84,
      },
    ];

    const result = evaluateEngagementBenchmark(samples, {
      requiredGenres: ['mystery'],
      requiredRoutes: ['interest', 'suspense', 'genre-delight', 'next-click'],
      requiredPositiveQualityCodes: ['payoff-delight', 'genre-delight'],
    });

    expect(result).toMatchObject({
      total: 2,
      passed: 2,
      failed: 0,
      accuracy: 1,
      falsePositiveCount: 0,
      falseNegativeCount: 0,
      missingIssueCount: 0,
      forbiddenIssueCount: 0,
      positiveQualityConflictCount: 0,
      scoreOutOfRangeCount: 0,
      genreCoverage: {
        mystery: 2,
      },
      genrePolarityCoverage: {
        mystery: {
          positive: 1,
          negative: 1,
        },
      },
      seriesCoverage: {
        mystery: {
          chapters: [1],
          longestConsecutiveRun: 1,
          positiveChapters: [1],
          positiveLongestConsecutiveRun: 1,
        },
      },
      positiveQualityCoverage: {
        'payoff-delight': 1,
        'genre-delight': 1,
      },
      usablePositiveQualityCoverage: {
        'payoff-delight': 1,
        'genre-delight': 1,
      },
      missingRequiredPositiveQualityCodes: [],
      underSampledRequiredPositiveQualityCodes: [],
      underSampledUsableRequiredPositiveQualityCodes: [],
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
      readyForGateTuning: true,
    });
    expect(result.routeCoverage).toMatchObject({
      interest: 2,
      suspense: 2,
      'genre-delight': 1,
      'next-click': 1,
    });
    expect(result.missingRequiredGenres).toEqual([]);
    expect(result.missingRequiredPositiveGenres).toEqual([]);
    expect(result.missingRequiredNegativeGenres).toEqual([]);
    expect(result.missingRequiredRoutes).toEqual([]);
    expect(result.missingRequiredPositiveQualityCodes).toEqual([]);
    expect(result.sampleResults[0].calibrationSplit).toBe('calibration');
    expect(result.sampleResults[1].calibrationSplit).toBe('holdout');
  });

  it('keeps gate tuning disabled when all evidence is calibration-only', () => {
    const samples: EngagementBenchmarkSample[] = [
      {
        id: 'mystery-good-calibration',
        genre: 'mystery',
        routes: ['interest', 'suspense', 'genre-delight', 'next-click'],
        chapter: 1,
        calibrationSplit: 'calibration',
        input: inputWithManuscript(alignedManuscript),
        expectedPassed: true,
        expectedMinScore: 90,
      },
      {
        id: 'mystery-bad-calibration',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        chapter: 1,
        calibrationSplit: 'calibration',
        input: inputWithManuscript(flatPayoffManuscript),
        expectedPassed: false,
        expectedIssueCodes: ['manuscript-payoff-delight-not-evidenced'],
        expectedMaxScore: 84,
      },
    ];

    const result = evaluateEngagementBenchmark(samples, {
      requiredGenres: ['mystery'],
      requiredRoutes: ['interest', 'suspense', 'genre-delight', 'next-click'],
    });

    expect(result.failed).toBe(0);
    expect(result.missingRequiredGenres).toEqual([]);
    expect(result.missingRequiredPositiveGenres).toEqual([]);
    expect(result.missingRequiredNegativeGenres).toEqual([]);
    expect(result.missingRequiredRoutes).toEqual([]);
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
        expect.stringContaining('holdout'),
        expect.stringContaining('known-bad holdout'),
      ])
    );
  });

  it('rejects split leakage when the same evidence appears in calibration and holdout', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'mystery-good-calibration',
        genre: 'mystery',
        routes: ['interest', 'suspense', 'genre-delight', 'next-click'],
        chapter: 1,
        calibrationSplit: 'calibration',
        input: inputWithManuscript(alignedManuscript),
        expectedPassed: true,
        expectedMinScore: 90,
      },
      {
        id: 'mystery-good-holdout-duplicate',
        genre: 'mystery',
        routes: ['interest', 'suspense', 'genre-delight', 'next-click'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(alignedManuscript),
        expectedPassed: true,
        expectedMinScore: 90,
      },
    ], {
      requireHoldoutForGateTuning: false,
    });

    expect(result.failed).toBe(0);
    expect(result.splitLeakageCount).toBe(1);
    expect(result.splitLeakages[0]).toMatchObject({
      sampleIds: ['mystery-good-calibration', 'mystery-good-holdout-duplicate'],
      calibrationSplits: ['calibration', 'holdout'],
    });
    expect(result.splitLeakages[0].fingerprint).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('same manuscript/chapter input'),
      ])
    );
  });

  it('requires labeled and usable expected issue-code coverage', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'wrong-expected-issue',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(flatPayoffManuscript),
        expectedPassed: false,
        expectedIssueCodes: ['manuscript-ending-hook-closed'],
      },
    ], {
      requiredIssueCodes: [
        'manuscript-ending-hook-closed',
        'manuscript-signature-scene-image-not-evidenced',
      ],
      minimumSamplesPerRequiredIssueCode: 1,
    });

    expect(result.issueCodeCoverage).toMatchObject({
      'manuscript-ending-hook-closed': 1,
    });
    expect(result.usableIssueCodeCoverage['manuscript-ending-hook-closed'] ?? 0).toBe(0);
    expect(result.missingRequiredIssueCodes).toEqual([
      'manuscript-signature-scene-image-not-evidenced',
    ]);
    expect(result.underSampledRequiredIssueCodes).toEqual([]);
    expect(result.underSampledUsableRequiredIssueCodes).toEqual([
      'manuscript-ending-hook-closed',
    ]);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('missing expected engagement issue codes'),
        expect.stringContaining('not being detected reliably'),
      ])
    );
  });

  it('requires labeled and usable positive high-point quality coverage', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'mystery-high-retention-pass',
        genre: 'mystery',
        routes: ['interest', 'suspense', 'genre-delight', 'next-click'],
        positiveQualityCodes: ['payoff-delight'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(alignedManuscript),
        expectedPassed: true,
        expectedMinScore: 90,
      },
    ], {
      requiredPositiveQualityCodes: ['payoff-delight', 'genre-delight'],
      minimumSamplesPerRequiredPositiveQualityCode: 2,
      requireHoldoutForGateTuning: false,
    });

    expect(result.positiveQualityCoverage).toMatchObject({
      'payoff-delight': 1,
    });
    expect(result.usablePositiveQualityCoverage).toMatchObject({
      'payoff-delight': 1,
    });
    expect(result.missingRequiredPositiveQualityCodes).toEqual(['genre-delight']);
    expect(result.underSampledRequiredPositiveQualityCodes).toEqual(['payoff-delight']);
    expect(result.underSampledUsableRequiredPositiveQualityCodes).toEqual(['payoff-delight']);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('positive high-point quality codes'),
      ])
    );
  });

  it('tracks agency and choice-cost positive high-point coverage', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'mystery-agency-choice-cost-pass',
        genre: 'mystery',
        routes: ['interest', 'suspense', 'next-click'],
        positiveQualityCodes: [
          'protagonist-agency',
          'choice-cost-tradeoff',
          'choice-cost-lock',
          'tactical-adaptation',
        ],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(alignedManuscript),
        expectedPassed: true,
        expectedMinScore: 90,
      },
    ], {
      requiredPositiveQualityCodes: [
        'protagonist-agency',
        'choice-cost-tradeoff',
        'choice-cost-lock',
        'tactical-adaptation',
      ],
      requireHoldoutForGateTuning: false,
    });

    expect(result.failed).toBe(0);
    expect(result.positiveQualityCoverage).toMatchObject({
      'protagonist-agency': 1,
      'choice-cost-tradeoff': 1,
      'choice-cost-lock': 1,
      'tactical-adaptation': 1,
    });
    expect(result.usablePositiveQualityCoverage).toMatchObject({
      'protagonist-agency': 1,
      'choice-cost-tradeoff': 1,
      'choice-cost-lock': 1,
      'tactical-adaptation': 1,
    });
    expect(result.missingRequiredPositiveQualityCodes).toEqual([]);
    expect(result.readyForGateTuning).toBe(true);
  });

  it('does not count failing known-good high-point samples as usable coverage', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'flat-sample-mislabeled-as-high-point',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        positiveQualityCodes: ['payoff-delight'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(flatPayoffManuscript),
        expectedPassed: true,
      },
    ], {
      requiredPositiveQualityCodes: ['payoff-delight'],
      requireHoldoutForGateTuning: false,
    });

    expect(result.positiveQualityCoverage).toMatchObject({
      'payoff-delight': 1,
    });
    expect(result.usablePositiveQualityCoverage['payoff-delight'] ?? 0).toBe(0);
    expect(result.positiveQualityConflictCount).toBe(1);
    expect(result.sampleResults[0]).toMatchObject({
      positiveQualityConflictIssueCodes: ['manuscript-payoff-delight-not-evidenced'],
    });
    expect(result.sampleResults[0].failureTypes).toContain('positive-quality-conflict');
    expect(result.underSampledUsableRequiredPositiveQualityCodes).toEqual(['payoff-delight']);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('mislabeled high-point'),
      ])
    );
  });

  it('treats convenient resolutions as agency and causal-chain high-point conflicts', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'convenient-resolution-mislabeled-as-earned',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        positiveQualityCodes: ['protagonist-agency', 'causal-chain'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(convenientResolutionManuscript),
        expectedPassed: true,
      },
    ], {
      requiredPositiveQualityCodes: ['protagonist-agency', 'causal-chain'],
      requireHoldoutForGateTuning: false,
    });

    expect(result.positiveQualityCoverage).toMatchObject({
      'protagonist-agency': 1,
      'causal-chain': 1,
    });
    expect(result.usablePositiveQualityCoverage['protagonist-agency'] ?? 0).toBe(0);
    expect(result.usablePositiveQualityCoverage['causal-chain'] ?? 0).toBe(0);
    expect(result.positiveQualityConflictCount).toBe(1);
    expect(result.sampleResults[0].positiveQualityConflictIssueCodes).toContain(
      'manuscript-convenient-resolution-not-evidenced'
    );
    expect(result.sampleResults[0].failureTypes).toEqual(
      expect.arrayContaining(['false-negative', 'positive-quality-conflict'])
    );
    expect(result.underSampledUsableRequiredPositiveQualityCodes).toEqual([
      'protagonist-agency',
      'causal-chain',
    ]);
    expect(result.readyForGateTuning).toBe(false);
  });

  it('treats non-personalized stakes subjects as narrative-transportation high-point conflicts', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'generic-stakes-mislabeled-as-transportive',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        positiveQualityCodes: ['narrative-transportation'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(nonPersonalizedStakesManuscript),
        expectedPassed: true,
      },
    ], {
      requiredPositiveQualityCodes: ['narrative-transportation'],
      requireHoldoutForGateTuning: false,
    });

    expect(result.positiveQualityCoverage).toMatchObject({
      'narrative-transportation': 1,
    });
    expect(result.usablePositiveQualityCoverage['narrative-transportation'] ?? 0).toBe(0);
    expect(result.positiveQualityConflictCount).toBe(1);
    expect(result.sampleResults[0].positiveQualityConflictIssueCodes).toContain(
      'manuscript-stakes-subject-not-personalized'
    );
    expect(result.sampleResults[0].failureTypes).toEqual(
      expect.arrayContaining(['false-negative', 'positive-quality-conflict'])
    );
    expect(result.underSampledUsableRequiredPositiveQualityCodes).toEqual([
      'narrative-transportation',
    ]);
    expect(result.readyForGateTuning).toBe(false);
  });

  it('treats broad manuscript ending questions as next-click high-point conflicts', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'broad-ending-question-mislabeled-as-next-click',
        genre: 'mystery',
        routes: ['suspense', 'next-click'],
        positiveQualityCodes: ['next-click-compulsion'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(broadEndingQuestionManuscript),
        expectedPassed: true,
      },
    ], {
      requiredPositiveQualityCodes: ['next-click-compulsion'],
      requireHoldoutForGateTuning: false,
    });

    expect(result.failed).toBe(1);
    expect(result.falseNegativeCount).toBe(1);
    expect(result.positiveQualityConflictCount).toBe(1);
    expect(result.positiveQualityCoverage).toMatchObject({
      'next-click-compulsion': 1,
    });
    expect(result.usablePositiveQualityCoverage['next-click-compulsion'] ?? 0).toBe(0);
    expect(result.sampleResults[0]).toMatchObject({
      positiveQualityConflictIssueCodes: [
        'manuscript-ending-hook-question-too-broad',
      ],
    });
    expect(result.sampleResults[0].failureTypes).toEqual(
      expect.arrayContaining(['false-negative', 'positive-quality-conflict'])
    );
    expect(result.underSampledUsableRequiredPositiveQualityCodes).toEqual([
      'next-click-compulsion',
    ]);
    expect(result.readyForGateTuning).toBe(false);
  });

  it('requires usable broad-ending-question holdout coverage before engagement gate tuning', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'broad-ending-question-known-bad',
        genre: 'mystery',
        routes: ['suspense', 'next-click'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(broadEndingQuestionManuscript),
        expectedPassed: false,
        expectedIssueCodes: ['manuscript-ending-hook-question-too-broad'],
      },
    ], {
      requiredIssueCodes: ['manuscript-ending-hook-question-too-broad'],
      minimumSamplesPerRequiredIssueCode: 1,
      requireHoldoutForGateTuning: false,
    });

    expect(result.failed).toBe(0);
    expect(result.issueCodeCoverage).toMatchObject({
      'manuscript-ending-hook-question-too-broad': 1,
    });
    expect(result.usableIssueCodeCoverage).toMatchObject({
      'manuscript-ending-hook-question-too-broad': 1,
    });
    expect(result.missingRequiredIssueCodes).toEqual([]);
    expect(result.underSampledRequiredIssueCodes).toEqual([]);
    expect(result.underSampledUsableRequiredIssueCodes).toEqual([]);
    expect(result.splitCoverage).toMatchObject({
      holdoutSamples: 1,
      usableHoldoutSamples: 1,
      failingHoldoutSamples: 1,
      usableFailingHoldoutSamples: 1,
    });
    expect(result.readyForGateTuning).toBe(true);
  });

  it('requires convenient-resolution failures to be covered before engagement gate tuning', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'convenient-resolution-known-bad',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(convenientResolutionManuscript),
        expectedPassed: false,
        expectedIssueCodes: ['manuscript-convenient-resolution-not-evidenced'],
        expectedMaxScore: 84,
      },
    ], {
      requiredIssueCodes: ['manuscript-convenient-resolution-not-evidenced'],
      minimumSamplesPerRequiredIssueCode: 1,
      requireHoldoutForGateTuning: false,
    });

    expect(result.failed).toBe(0);
    expect(result.issueCodeCoverage).toMatchObject({
      'manuscript-convenient-resolution-not-evidenced': 1,
    });
    expect(result.usableIssueCodeCoverage).toMatchObject({
      'manuscript-convenient-resolution-not-evidenced': 1,
    });
    expect(result.missingRequiredIssueCodes).toEqual([]);
    expect(result.underSampledRequiredIssueCodes).toEqual([]);
    expect(result.underSampledUsableRequiredIssueCodes).toEqual([]);
    expect(result.readyForGateTuning).toBe(true);
  });

  it('requires non-personalized stakes-subject failures to be covered before engagement gate tuning', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'non-personalized-stakes-known-bad',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(nonPersonalizedStakesManuscript),
        expectedPassed: false,
        expectedIssueCodes: ['manuscript-stakes-subject-not-personalized'],
        expectedMaxScore: 84,
      },
    ], {
      requiredIssueCodes: ['manuscript-stakes-subject-not-personalized'],
      minimumSamplesPerRequiredIssueCode: 1,
      requireHoldoutForGateTuning: false,
    });

    expect(result.failed).toBe(0);
    expect(result.issueCodeCoverage).toMatchObject({
      'manuscript-stakes-subject-not-personalized': 1,
    });
    expect(result.usableIssueCodeCoverage).toMatchObject({
      'manuscript-stakes-subject-not-personalized': 1,
    });
    expect(result.missingRequiredIssueCodes).toEqual([]);
    expect(result.underSampledRequiredIssueCodes).toEqual([]);
    expect(result.underSampledUsableRequiredIssueCodes).toEqual([]);
    expect(result.readyForGateTuning).toBe(true);
  });

  it('reports required issue codes with too few labeled samples', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'flat-payoff-fail',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(flatPayoffManuscript),
        expectedPassed: false,
        expectedIssueCodes: ['manuscript-payoff-delight-not-evidenced'],
        expectedMaxScore: 84,
      },
    ], {
      requiredIssueCodes: ['manuscript-payoff-delight-not-evidenced'],
      minimumSamplesPerRequiredIssueCode: 2,
    });

    expect(result.issueCodeCoverage).toMatchObject({
      'manuscript-payoff-delight-not-evidenced': 1,
    });
    expect(result.usableIssueCodeCoverage).toMatchObject({
      'manuscript-payoff-delight-not-evidenced': 1,
    });
    expect(result.missingRequiredIssueCodes).toEqual([]);
    expect(result.underSampledRequiredIssueCodes).toEqual([
      'manuscript-payoff-delight-not-evidenced',
    ]);
    expect(result.underSampledUsableRequiredIssueCodes).toEqual([
      'manuscript-payoff-delight-not-evidenced',
    ]);
    expect(result.readyForGateTuning).toBe(false);
  });

  it('requires dialogue failures to be covered as causal story-state issues', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'dialogue-turn-not-carried',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        chapter: 1,
        calibrationSplit: 'holdout',
        input: inputWithManuscript(dialogueStateCarryoverFailureManuscript()),
        expectedPassed: false,
        expectedIssueCodes: ['manuscript-dialogue-state-carryover-not-evidenced'],
        expectedMaxScore: 84,
      },
    ], {
      requiredIssueCodes: [
        'manuscript-dialogue-state-carryover-not-evidenced',
        'manuscript-dialogue-turn-not-evidenced',
      ],
      minimumSamplesPerRequiredIssueCode: 1,
    });

    expect(result.failed).toBe(0);
    expect(result.issueCodeCoverage).toMatchObject({
      'manuscript-dialogue-state-carryover-not-evidenced': 1,
    });
    expect(result.usableIssueCodeCoverage).toMatchObject({
      'manuscript-dialogue-state-carryover-not-evidenced': 1,
    });
    expect(result.missingRequiredIssueCodes).toEqual([
      'manuscript-dialogue-turn-not-evidenced',
    ]);
    expect(result.readyForGateTuning).toBe(false);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('missing expected engagement issue codes'),
      ])
    );
  });

  it('separates false positives from false negatives', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'good-sample-mislabeled-as-fail',
        input: inputWithManuscript(alignedManuscript),
        expectedPassed: false,
      },
      {
        id: 'bad-sample-mislabeled-as-pass',
        input: inputWithManuscript(flatPayoffManuscript),
        expectedPassed: true,
      },
    ]);

    expect(result.failed).toBe(2);
    expect(result.falsePositiveCount).toBe(1);
    expect(result.falseNegativeCount).toBe(1);
    expect(result.sampleResults[0].failureType).toBe('false-positive');
    expect(result.sampleResults[1].failureType).toBe('false-negative');
  });

  it('reports missing and over-triggered issue expectations separately', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'wrong-expected-issue',
        input: inputWithManuscript(flatPayoffManuscript),
        expectedPassed: false,
        expectedIssueCodes: ['manuscript-ending-hook-closed'],
      },
      {
        id: 'forbidden-triggered-issue',
        input: inputWithManuscript(flatPayoffManuscript),
        expectedPassed: false,
        forbiddenIssueCodes: ['manuscript-payoff-delight-not-evidenced'],
      },
    ]);

    expect(result.failed).toBe(2);
    expect(result.missingIssueCount).toBe(1);
    expect(result.forbiddenIssueCount).toBe(1);
    expect(result.sampleResults[0].failureTypes).toContain('missing-issue');
    expect(result.sampleResults[1].failureTypes).toContain('forbidden-issue');
  });

  it('recommends missing genre and engagement-route coverage', () => {
    const result = evaluateEngagementBenchmark([
      {
        id: 'mystery-only',
        genre: 'mystery',
        routes: ['interest', 'suspense'],
        chapter: 1,
        input: inputWithManuscript(alignedManuscript),
        expectedPassed: true,
      },
    ], {
      requiredGenres: ['mystery', 'romance'],
      requiredRoutes: ['interest', 'suspense', 'beauty', 'amusement'],
    });

    expect(result.missingRequiredGenres).toEqual(['romance']);
    expect(result.missingRequiredPositiveGenres).toEqual(['romance']);
    expect(result.missingRequiredNegativeGenres).toEqual(['mystery', 'romance']);
    expect(result.missingRequiredRoutes).toEqual(['beauty', 'amusement']);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('romance'),
        expect.stringContaining('known-good'),
        expect.stringContaining('known-bad'),
        expect.stringContaining('beauty, amusement'),
      ])
    );
  });

  it('reports consecutive chapter benchmark coverage by genre', () => {
    const samples: EngagementBenchmarkSample[] = [1, 2, 3].map(chapter => ({
      id: `mystery-known-good-${chapter}`,
      genre: 'mystery',
      routes: ['interest', 'suspense', 'next-click'],
      chapter,
      input: inputWithManuscript(alignedManuscript),
      expectedPassed: true,
    }));

    const result = evaluateEngagementBenchmark(samples, {
      requiredGenres: ['mystery'],
      minimumSeriesLength: 3,
      minimumPositiveSeriesLength: 3,
    });

    expect(result.seriesCoverage.mystery).toMatchObject({
      chapters: [1, 2, 3],
      longestConsecutiveRun: 3,
      positiveChapters: [1, 2, 3],
      positiveLongestConsecutiveRun: 3,
    });
    expect(result.missingRequiredSeriesGenres).toEqual([]);
    expect(result.missingRequiredPositiveSeriesGenres).toEqual([]);
  });

  it('recommends missing consecutive chapter benchmark coverage', () => {
    const samples: EngagementBenchmarkSample[] = [1, 3].map(chapter => ({
      id: `mystery-gap-${chapter}`,
      genre: 'mystery',
      routes: ['interest', 'suspense', 'next-click'],
      chapter,
      input: inputWithManuscript(alignedManuscript),
      expectedPassed: true,
    }));

    const result = evaluateEngagementBenchmark(samples, {
      requiredGenres: ['mystery'],
      minimumSeriesLength: 3,
      minimumPositiveSeriesLength: 3,
    });

    expect(result.seriesCoverage.mystery).toMatchObject({
      chapters: [1, 3],
      longestConsecutiveRun: 1,
      positiveChapters: [1, 3],
      positiveLongestConsecutiveRun: 1,
    });
    expect(result.missingRequiredSeriesGenres).toEqual(['mystery']);
    expect(result.missingRequiredPositiveSeriesGenres).toEqual(['mystery']);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('consecutive chapter'),
        expect.stringContaining('known-good consecutive'),
      ])
    );
  });
});

function inputWithManuscript(manuscript: string): EngagementContractInput {
  return {
    design,
    plot,
    chapter: alignedChapter,
    manuscript,
  };
}

function dialogueStateCarryoverFailureManuscript(): string {
  const manuscriptLines = alignedManuscript.split('\n');
  const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
  const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';

  return [
    ...manuscriptBeforeEnding,
    '민서가 피해자의 휴대폰을 책상 위에 올려놓았다. "그 번호를 왜 숨겼어요?"',
    '도현이 화면 잠금이 풀리자 삭제된 로그를 내밀었다. "당신을 못 믿지만, 이 로그는 봐야 합니다."',
    '민서가 파일명을 확인하자 앱 로고와 과거 미제 사건 번호가 같은 줄에서 드러났다. "그러면 지금부터는 내가 경찰보다 먼저 움직여요."',
    '도현이 한 걸음 물러서며 문 앞을 비켰다. "조건이 있습니다. 이 파일은 내 이름으로 넘기지 마세요."',
    '그 뒤 그는 아무 조건도 바꾸지 않은 채 원래처럼 엘리베이터 버튼을 눌렀고, 휴대폰 로그나 비켜 준 문에는 다시 손대지 않았다.',
    manuscriptEnding,
  ].join('\n');
}
