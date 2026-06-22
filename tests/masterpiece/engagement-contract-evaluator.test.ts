import { describe, expect, it } from 'vitest';

import {
  evaluateEngagementContract,
  type EngagementContractIssue,
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

const protagonistWithDrive = {
  id: 'char_001',
  name: '주인공',
  aliases: ['그'],
  role: 'protagonist',
  inner: {
    want: '실종된 동생의 생존 증거를 찾는 것',
    need: '혼자 통제하려는 습관을 내려놓고 조력자에게 도움을 요청하는 것',
  },
};

const protagonistWithoutDrive = {
  id: 'char_001',
  name: '주인공',
  aliases: ['그'],
  role: 'protagonist',
};

const antagonistWithStrategy = {
  id: 'char_002',
  name: '박도현',
  aliases: ['도현', '범인'],
  role: 'antagonist',
  inner: {
    want: '예고 앱의 첫 규칙을 증명해 주인공을 다음 수신자로 몰아넣는 것',
    fatal_flaw: '피해자 기록을 조작해 모든 선택지를 통제하려는 집착',
  },
};

describe('evaluateEngagementContract', () => {
  it('passes a chapter whose reader experience fulfills the design promise and plot fun spec', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.issues).toEqual([]);
    expect(result.breakdown.promiseAlignment).toBe(100);
    expect(result.breakdown.funSpecAlignment).toBe(100);
    expect(result.breakdown.sceneMomentum).toBe(100);
    expect(result.breakdown.tensionCurveAlignment).toBe(100);
    expect(result.revisionDirectives).toEqual([]);
  });

  it('fails when plot arc beat is not staged in chapter metadata', () => {
    const arcBeat =
      '주인공이 폐쇄 서버실에서 관리자 서명과 개발자 실명 로그를 발견한다.';
    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [
          {
            ...guide,
            arc_beats: arcBeat,
          },
        ],
      },
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('arc-beat-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'arc-beat-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: arcBeat,
        }),
      ])
    );
  });

  it('fails when manuscript omits the staged plot arc beat', () => {
    const arcBeat =
      '주인공이 옥상 급수탑 아래에서 검은 봉투와 내부자 배지를 발견한다.';
    const chapterWithArcBeat = {
      ...alignedChapter,
      context: {
        current_plot: `옥상 급수탑 아래로 올라간 주인공이 검은 봉투와 내부자 배지를 발견한다.`,
      },
      scenes: [
        alignedChapter.scenes[0],
        {
          ...alignedChapter.scenes[1],
          beat: `${alignedChapter.scenes[1].beat} ${arcBeat}`,
        },
      ],
    };
    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [
          {
            ...guide,
            arc_beats: arcBeat,
          },
        ],
      },
      chapter: chapterWithArcBeat,
      manuscript: alignedManuscript,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-arc-beat-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-arc-beat-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: arcBeat,
        }),
      ])
    );
  });

  it('fails when protagonist want and need are not staged in chapter metadata', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      characters: [protagonistWithDrive],
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('character-drive-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'character-drive-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('inner.want'),
        }),
      ])
    );
  });

  it('fails when manuscript omits the staged protagonist want and need drive', () => {
    const drivenChapter = {
      ...alignedChapter,
      narrative_elements: {
        ...alignedChapter.narrative_elements,
        character_development:
          '주인공은 실종된 동생의 생존 증거를 찾으려는 욕망 때문에 혼자 통제하려던 습관을 내려놓고 조력자에게 도움을 요청한다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        character_appeal_moment:
          `${alignedChapter.reader_experience.character_appeal_moment} 실종된 동생의 생존 증거를 찾기 위해 조력자에게 처음 도움을 요청한다.`,
      },
      scenes: alignedChapter.scenes.map(scene =>
        scene.scene_number === 1
          ? {
              ...scene,
              conflict:
                `${scene.conflict} 실종된 동생의 생존 증거를 혼자 쥘지, 조력자에게 도움을 요청하며 통제권을 나눌지 선택해야 한다.`,
              beat:
                `${scene.beat} 주인공은 실종된 동생의 생존 증거를 찾기 위해 조력자에게 도움을 요청하고 신고 기록 독점을 포기한다.`,
            }
          : scene
      ),
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: drivenChapter,
      characters: [protagonistWithDrive],
      manuscript: alignedManuscript,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-character-drive-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-drive-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('inner.want'),
        }),
      ])
    );
  });

  it('fails when a later chapter does not carry over the protagonist inner drive change', () => {
    const priorChapter = {
      ...alignedChapter,
      chapter_number: 5,
      narrative_elements: {
        character_development:
          '주인공은 혼자 통제하려는 습관을 내려놓고 조력자에게 도움을 요청하기로 결심한다.',
      },
      context: {
        current_plot:
          '주인공이 실종된 동생의 생존 증거를 찾기 위해 처음으로 조력자에게 도움을 요청한다.',
        next_plot:
          '다음 회차에는 직전 내적 변화 때문에 주인공이 단독 잠입을 버리고 조력자에게 도움을 요청해 달라진 행동을 보인다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        character_appeal_moment:
          '주인공이 혼자 통제하려는 습관을 내려놓고 조력자에게 도움을 요청한다.',
        chapter_reward:
          '실종된 동생의 생존 증거를 찾기 위해 주인공이 조력자에게 처음 도움을 요청한다.',
      },
    };
    const currentChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        previous_summary: '지난 사건 뒤 주인공은 새 서버실 단서를 확보했다.',
        current_plot:
          '주인공은 경찰 내부 서버실에 혼자 잠입해 CCTV 로그를 대조하고 관리자 계정 이름을 추적한다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '주인공이 경찰 내부 서버 기록까지 조작된 흔적을 혼자 확인한다.',
        character_appeal_moment:
          '주인공이 체포 위험을 감수하고 경찰 내부 서버실에 단독 잠입한다.',
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '경찰 내부 서버실 단독 잠입',
          conflict:
            '주인공은 체포 위험을 감수하고 혼자 서버실 로그를 직접 대조해야 한다.',
          beat:
            '주인공은 단독 잠입을 선택해 CCTV 로그와 관리자 계정 이름을 확인한다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: currentChapter,
      characters: [protagonistWithDrive],
      previousChapters: [priorChapter],
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'character-drive-carryover-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'character-drive-carryover-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('character drive carryover'),
        }),
      ])
    );
  });

  it('fails when manuscript prose ignores the prior inner drive change that metadata carries forward', () => {
    const priorChapter = {
      ...alignedChapter,
      chapter_number: 5,
      narrative_elements: {
        character_development:
          '주인공은 혼자 통제하려는 습관을 내려놓고 조력자에게 도움을 요청하기로 결심한다.',
      },
      context: {
        current_plot:
          '주인공이 실종된 동생의 생존 증거를 찾기 위해 처음으로 조력자에게 도움을 요청한다.',
        next_plot:
          '다음 회차에는 직전 내적 변화 때문에 주인공이 단독 잠입을 버리고 조력자에게 도움을 요청해 달라진 행동을 보인다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        character_appeal_moment:
          '주인공이 혼자 통제하려는 습관을 내려놓고 조력자에게 도움을 요청한다.',
        chapter_reward:
          '실종된 동생의 생존 증거를 찾기 위해 주인공이 조력자에게 처음 도움을 요청한다.',
      },
    };
    const currentChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        previous_summary:
          '직전 내적 변화로 주인공은 혼자 통제하려는 습관을 내려놓고 조력자에게 도움을 요청하기로 결심했다.',
        current_plot:
          '실종된 동생의 생존 증거를 찾기 위해 주인공은 단독 잠입을 버리고 조력자에게 도움을 요청한다. 조력자와 통제권을 나누는 달라진 행동이 서버실 추적 방식을 바꾼다.',
      },
      narrative_elements: {
        character_development:
          '주인공은 혼자 통제하려는 습관을 내려놓고 조력자에게 도움을 요청하는 달라진 행동을 이어 간다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '직전 내적 변화가 주인공의 도움 요청과 달라진 행동으로 이어진다.',
        character_appeal_moment:
          '주인공이 실종된 동생의 생존 증거를 찾기 위해 조력자에게 도움을 요청하고 통제권을 나눈다.',
        drop_off_risk:
          '성장 리셋 위험 - 직전 내적 변화가 도움 요청, 습관 내려놓기, 달라진 행동으로 남아야 한다.',
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '직전 내적 변화를 현재 행동으로 이월한다.',
          conflict:
            '주인공은 혼자 서버실에 잠입할지, 습관을 내려놓고 조력자에게 도움을 요청할지 선택해야 한다.',
          beat:
            '주인공은 실종된 동생의 생존 증거를 찾기 위해 단독 잠입을 포기하고 조력자에게 도움을 요청해 달라진 행동을 보인다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: currentChapter,
      characters: [protagonistWithDrive],
      previousChapters: [priorChapter],
      manuscript: [
        '주인공은 경찰서 서버실에 혼자 숨어들어 CCTV 로그의 삭제 시간을 대조했다.',
        '누구에게도 알리지 않은 채 관리자 계정 이름을 복사했고, 복도 끝에서 발소리가 다가오자 파일을 품에 숨겼다.',
        '그는 체포 위험을 감수하고 로그 원본을 혼자 들고 나가기로 결정했다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-character-drive-carryover-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-drive-carryover-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('character drive carryover'),
        }),
      ])
    );
  });

  it('fails when an antagonist strategy is not staged in chapter metadata', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      characters: [protagonistWithoutDrive, antagonistWithStrategy],
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('antagonist-strategy-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'antagonist-strategy-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('antagonist strategy'),
        }),
      ])
    );
  });

  it('fails when manuscript omits the staged antagonist strategy', () => {
    const chapterWithAntagonistStrategy = {
      ...alignedChapter,
      context: {
        current_plot:
          '박도현은 예고 앱의 첫 규칙을 증명하려 피해자 기록을 조작하고 주인공 이름을 다음 수신자로 올리는 함정을 깐다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          `${alignedChapter.reader_experience.promise_fulfillment} 박도현은 피해자 기록을 조작해 주인공을 다음 수신자로 몰아넣는 전략을 실행한다.`,
        page_turner_question:
          `${alignedChapter.reader_experience.page_turner_question} 박도현은 왜 주인공을 표적으로 삼았는가?`,
      },
      scenes: alignedChapter.scenes.map(scene =>
        scene.scene_number === 2
          ? {
              ...scene,
              conflict:
                `${scene.conflict} 박도현이 피해자 기록을 조작해 주인공을 다음 수신자로 몰아넣는 함정을 깐다.`,
              beat:
                `${scene.beat} 박도현은 예고 앱의 첫 규칙을 증명하려 주인공 이름을 다음 수신자로 올리는 전략을 실행한다.`,
            }
          : scene
      ),
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithAntagonistStrategy,
      characters: [protagonistWithoutDrive, antagonistWithStrategy],
      manuscript: alignedManuscript,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-antagonist-strategy-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-antagonist-strategy-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('antagonist strategy'),
        }),
      ])
    );
  });

  it('fails when a later chapter does not carry over an antagonist countermove after the protagonist disrupts the prior plan', () => {
    const priorChapter = {
      ...alignedChapter,
      chapter_number: 5,
      context: {
        previous_summary:
          '주인공은 예고 앱 서버에서 박도현의 관리자 토큰 흔적을 발견했다.',
        current_plot:
          '주인공이 박도현의 관리자 토큰을 탈취하고 가짜 피해자 목록 조작을 공개해 박도현의 예고 앱 통제 계획을 흔든다.',
        next_plot:
          '전 회차 주인공 행동으로 박도현의 관리자 토큰 탈취와 가짜 피해자 목록 조작 공개가 벌어져 다음 회차 박도현은 접근 권한을 회수하고 조력자를 표적으로 삼아 반격한다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward:
          '주인공이 박도현의 관리자 토큰을 탈취하고 가짜 피해자 목록 조작을 공개해 박도현의 예고 앱 통제 계획을 흔든다.',
        must_click_ending:
          '박도현의 관리자 화면에서 접근 권한 회수 버튼과 조력자 표적 재설정 로그가 동시에 깜박인다.',
      },
      scenes: [
        alignedChapter.scenes[0],
        {
          scene_number: 2,
          purpose: '주인공이 박도현의 통제 계획을 흔든다.',
          conflict:
            '주인공은 박도현의 관리자 토큰을 탈취할지, 조력자를 보호하기 위해 접속을 포기할지 선택해야 한다.',
          beat:
            '주인공이 관리자 토큰을 탈취하고 가짜 피해자 목록 조작을 공개하자 박도현의 통제 계획이 흔들린다.',
        },
      ],
    };

    const currentChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        previous_summary: '지난 사건 이후 새 피해자 로그가 남았다.',
        current_plot:
          '박도현은 예고 앱의 첫 규칙을 증명하려 피해자 기록을 조작하고 주인공 이름을 다음 수신자로 올리는 함정을 깐다.',
        next_plot: '주인공은 새 현장으로 이동한다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '박도현은 피해자 기록을 조작해 주인공을 다음 수신자로 몰아넣는 전략을 실행한다.',
        page_turner_question: '박도현은 왜 주인공을 표적으로 삼았는가?',
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '박도현의 새 함정이 시작된다.',
          conflict:
            '박도현이 피해자 기록을 조작해 주인공을 다음 수신자로 몰아넣는 함정을 깐다.',
          beat:
            '박도현은 예고 앱의 첫 규칙을 증명하려 주인공 이름을 다음 수신자로 올리는 전략을 실행한다.',
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: currentChapter,
      characters: [protagonistWithoutDrive, antagonistWithStrategy],
      previousChapters: [priorChapter],
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'antagonist-countermove-carryover-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'antagonist-countermove-carryover-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('antagonist countermove carryover'),
        }),
      ])
    );
  });

  it('fails when manuscript prose ignores the prior antagonist countermove that metadata carries forward', () => {
    const priorChapter = {
      ...alignedChapter,
      chapter_number: 5,
      context: {
        previous_summary:
          '주인공은 예고 앱 서버에서 박도현의 관리자 토큰 흔적을 발견했다.',
        current_plot:
          '주인공이 박도현의 관리자 토큰을 탈취하고 가짜 피해자 목록 조작을 공개해 박도현의 예고 앱 통제 계획을 흔든다.',
        next_plot:
          '전 회차 주인공 행동으로 박도현의 관리자 토큰 탈취와 가짜 피해자 목록 조작 공개가 벌어져 다음 회차 박도현은 접근 권한을 회수하고 조력자를 표적으로 삼아 반격한다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward:
          '주인공이 박도현의 관리자 토큰을 탈취하고 가짜 피해자 목록 조작을 공개해 박도현의 예고 앱 통제 계획을 흔든다.',
        must_click_ending:
          '박도현의 관리자 화면에서 접근 권한 회수 버튼과 조력자 표적 재설정 로그가 동시에 깜박인다.',
      },
    };

    const currentChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        previous_summary:
          '전 회차 주인공 행동으로 박도현의 관리자 토큰 탈취와 가짜 피해자 목록 조작 공개가 벌어졌다.',
        current_plot:
          '박도현은 탈취된 관리자 토큰 때문에 접근 권한을 회수하고 조력자를 표적으로 삼아 로그를 삭제하는 반격을 시작한다.',
        next_plot: '주인공은 조력자가 표적이 된 이유를 추적한다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '박도현은 접근 권한을 회수하고 조력자를 표적으로 재설정해 주인공의 전 회차 행동에 반격한다.',
        page_turner_question:
          '박도현은 왜 조력자를 다음 표적으로 재설정했는가?',
        drop_off_risk:
          '전 회차 주인공 행동의 결과가 현재 압박으로 돌아오지 않으면 긴장이 끊긴다.',
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '박도현의 대응 전술이 현재 압박으로 돌아온다.',
          conflict:
            '박도현이 탈취된 관리자 토큰 때문에 접근 권한을 회수하고 조력자를 표적으로 삼아 로그를 삭제한다.',
          beat:
            '박도현은 조력자 표적 재설정으로 주인공의 전 회차 행동에 반격하고 다음 행동을 막는다.',
        },
        alignedChapter.scenes[1],
      ],
    };

    const manuscript = [
      '박도현은 예고 앱의 첫 규칙을 증명하려 피해자 기록을 조작했고, 주인공의 모든 선택지를 통제하려는 집착으로 주인공 이름을 다음 수신자로 올렸다.',
      '주인공은 새 현장 로그를 확인하며 다시 피해자 동선을 따라갔다.',
      '함정은 익숙한 방식으로 열렸고, 그는 새 알림의 시간을 대조했다.',
    ].join('\n');

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: currentChapter,
      characters: [protagonistWithoutDrive, antagonistWithStrategy],
      previousChapters: [priorChapter],
      manuscript,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-antagonist-countermove-carryover-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-antagonist-countermove-carryover-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('antagonist countermove carryover'),
        }),
      ])
    );
  });

  it('passes manuscript evidence when prose stages reader reward and must-click ending', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: alignedManuscript,
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.issues).toEqual([]);
    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-scene-state-delta-not-evidenced'
    );
    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-scene-novelty-matrix-not-evidenced'
    );
    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-tension-wave-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBe(100);
  });

  it('fails when a fresh earned reward lacks payoff delight lift', () => {
    const flatPayoffManuscript = [
      '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
      '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
      '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
      '현장 기록의 빈칸과 피해자의 휴대폰 로그, 피해자의 사망 시각을 다시 대조하자 앱 알림이 실제 사건과 맞아떨어졌다는 규칙이 확인됐고, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 새 알림이 다음 수신자를 지목하자 그는 문턱에서 계획을 바꿔 화면을 눌렀다.',
      '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
    ].join('\n');

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: flatPayoffManuscript,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-payoff-delight-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-payoff-delight-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('payoff delight'),
        }),
      ])
    );
  });

  it('fails when manuscript beats are adjacent facts without cause-and-effect progression', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려는 통제선의 조명이 그 순간 꺼졌다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물렸다. 목덜미가 조이고 손바닥에 식은 땀이 올라왔다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-causal-chain-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-causal-chain-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('cause-and-effect'),
        }),
      ])
    );
  });

  it('fails when manuscript resolves pressure through lucky external rescue', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 고립됐다.',
        '마침 경찰이 도착해 문이 열렸고, 형사가 범인을 붙잡아 피해자를 구했다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 그는 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-convenient-resolution-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-convenient-resolution-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('earned resolution'),
        }),
      ])
    );
  });

  it('allows external rescue when prior setup, agency, and cost earn it', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 현장으로 뛰쳐나가기 전 위치 공유와 암호 문자를 미리 경찰에 보내 둔 뒤, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다.',
        '그 순간 경찰이 도착해 문이 열렸고, 그가 보내 둔 위치 암호가 현장 층수를 가리킨 탓에 형사는 범인을 붙잡았다. 하지만 기록이 남아 그는 예고 앱의 첫 제보자이자 용의자로 노출됐다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 그는 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-convenient-resolution-not-evidenced'
    );
  });

  it('fails when manuscript names a ticking clock without time narrowing the action', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '휴대폰에는 제한 시간과 카운트다운이 선명했고, 남은 3분 안에 도착해야 한다는 문장이 계속 깜박였다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '하지만 통제선의 조명이 꺼졌고 그는 비상계단으로 우회해 현장으로 향했다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 파일 위에서 겹쳤고, 첫 규칙은 화면 위에서 확인됐다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
        '예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족 실종 파일 번호, 첫 수신자의 이유가 장기 미스터리로 남는다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-temporal-pressure-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-temporal-pressure-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('temporal pressure'),
        }),
      ])
    );
  });

  it('fails when manuscript scenes are not filtered through POV perception and reaction', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌고, 통제선 너머 바닥의 피와 꺼진 조명, 손바닥의 식은 땀이 남았다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났다.',
        '주인공 가족 실종 파일 번호도 같은 묶음 아래 남았고, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-pov-focalization-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-pov-focalization-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('POV'),
        }),
      ])
    );
  });

  it('fails when manuscript plot evidence lacks narrative transportation', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린다. 주인공은 경찰 신고보다 현장 도착 시간을 계산하고 사람을 구하려 이동한다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명은 현장 기록과 피해자 휴대폰 로그가 일치하면서 확인된다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없다.',
        '누군가 통제선 조명을 꺼뜨리고 현장 철문을 잠그자 그는 엘리베이터 계획을 접고 비상계단으로 우회한다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
        '예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족 실종 파일 번호, 첫 수신자의 이유가 장기 미스터리로 남는다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-narrative-transportation-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-narrative-transportation-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('narrative transportation'),
        }),
      ])
    );
  });

  it('fails when manuscript prose does not raise the irresistible question on page', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은 땀을 끌어올렸다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서도 가족 실종 파일 번호로 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-irresistible-question-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-irresistible-question-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('irresistible_question'),
        }),
      ])
    );
  });

  it('fails when the manuscript names the premise without operating it as a scene engine', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱이라는 설정은 이 이야기의 핵심 소재로 남았다.',
        '주인공은 상황을 설명했고 사람들은 놀랐다.',
        '그 특별한 설정은 긴장감을 제공했다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-premise-engine-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-premise-engine-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('premise engine'),
        }),
      ])
    );
  });

  it('fails when manuscript prose does not execute declared scene conflict and turns', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리고, 앱이 아직 일어나지 않은 살인을 예보한다는 사실이 드러났다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명으로 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 커졌다. 매 회차 작은 규칙 증명이라는 보상 주기도 유지된다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-scene-intent-not-evidenced');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-scene-intent-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('scene 1'),
        }),
      ])
    );
  });

  it('fails when manuscript scenes are evidenced but executed out of order', () => {
    const chapterWithThreeScenes = {
      ...alignedChapter,
      scenes: [
        {
          scene_number: 1,
          purpose: '예고 앱의 첫 알림과 주인공 선택을 제시한다.',
          conflict: '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 한다.',
          beat: '공포보다 패턴을 먼저 읽고 경찰 신고보다 현장 도착 시간을 계산해 뛰쳐나간다.',
        },
        {
          scene_number: 2,
          purpose: '현장 실패로 규칙을 증명한다.',
          conflict: '제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼진다.',
          beat: '현장 도착이 늦은 대가로 피해자는 이미 쓰러졌고 실패가 상황을 되돌릴 수 없게 바꾼다.',
        },
        {
          scene_number: 3,
          purpose: '말미 훅과 장기 미스터리 단서를 제시한다.',
          conflict: '현장 기록의 빈칸과 피해자의 휴대폰 로그를 맞춰야 한다.',
          beat: guide.fun_spec.must_click_ending,
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithThreeScenes,
      manuscript: [
        '살인을 예고하는 앱의 제한 시간이 끝나기도 전에, 주인공은 제한 시간 안에 피해자를 찾으려 하지만 통제선의 조명이 꺼지는 것을 보았다.',
        '현장 도착이 늦은 대가로 피해자는 이미 쓰러졌고, 실패가 상황을 되돌릴 수 없게 바꿨다. 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명은 바닥의 피와 휴대폰 로그 사이에서 차갑게 굳었다.',
        '그제야 첫 알림의 의미가 되감겼다. 장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 했던 순간, 공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산해 뛰쳐나갔었다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그를 맞추자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 손바닥의 땀과 목덜미를 조이는 감각으로 분명해졌다. 매 회차 작은 규칙 증명이라는 보상 주기도 현장 실패의 결과로 남았다.',
        '왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지는 미제 사건 번호 뒤에 더 깊이 숨었다. 피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서도 가족 실종 파일 번호로 남았으며, 그는 화면을 쥔 채 숨을 삼켰다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-scene-order-not-evidenced');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-scene-order-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('scene order'),
        }),
      ])
    );
  });

  it('fails when manuscript scene turns do not create on-page state deltas', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나간다.',
        '그는 앱 화면과 현장 기록을 살펴봤지만 판단은 같은 자리에서 맴돌았고 안전한 선택도 위험한 선택도 그대로 남아 있었다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다.',
        '현장 실패 직후 피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되었다. 그는 피해자의 휴대폰을 움켜쥔 채 화면을 다시 눌렀다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-scene-state-delta-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-scene-state-delta-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('story-state'),
        }),
      ])
    );
  });

  it('fails when staged scene novelty is flattened in manuscript prose', () => {
    const noveltyChapter = {
      ...alignedChapter,
      scenes: [
        {
          scene_number: 1,
          purpose: '예고 앱의 첫 알림과 폐쇄된 현장 선택을 결합한다.',
          conflict:
            '주인공은 폐쇄된 통제선 앞에서 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 잠긴 접근로를 우회해 피해자 휴대폰 로그를 확보할지 선택해야 하고, 누군가 통제선 조명을 꺼뜨려 그를 다음 수신자로 몰아넣는다.',
          beat:
            '그는 경찰 신고를 포기하고 통제선 뒤 점검 통로로 우회해 피해자 휴대폰 로그를 확보한다. 로그에서 새로운 규칙과 과거 미제 사건 번호가 드러나며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명과 다음 수신자 위험이 동시에 생긴다.',
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: noveltyChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 폐쇄된 통제선 앞에서 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 피해자 휴대폰 로그를 확보할지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고를 포기하고 피해자 휴대폰 로그를 확보했다. 로그에서 새로운 규칙과 과거 미제 사건 번호가 드러나며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명과 다음 수신자 위험이 동시에 생겼다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).not.toContain('scene-novelty-matrix-not-staged');
    expect(issueCodes(result.issues)).toContain(
      'manuscript-scene-novelty-matrix-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-scene-novelty-matrix-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('scene novelty matrix'),
        }),
      ])
    );
  });

  it('fails when manuscript prose omits the declared emotional arc', () => {
    const chapterWithEmotionalArc = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development: '주인공은 실패의 죄책감을 숨기지 않고 다음 피해자를 구하겠다고 결심한다.',
        emotional_goal: '죄책감에서 결심으로 이동',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          emotional_tone: '죄책감',
        },
        {
          ...alignedChapter.scenes[1],
          emotional_tone: '결심',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithEmotionalArc,
      manuscript: alignedManuscript,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-emotional-arc-not-evidenced');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-emotional-arc-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('emotional_goal'),
        }),
      ])
    );
  });

  it('fails when manuscript names emotional states without a visible progression beat', () => {
    const chapterWithEmotionalProgression = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공은 실패의 죄책감을 숨기지 않고 다음 피해자를 구하겠다고 결심한다.',
        emotional_goal: '죄책감에서 결심으로 이동',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          emotional_tone: '죄책감',
        },
        {
          ...alignedChapter.scenes[1],
          emotional_tone: '결심',
        },
      ],
    };

    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const manuscriptWithStaticEmotion = [
      ...manuscriptBeforeEnding,
      '그는 실패의 죄책감을 느꼈고 입술을 깨물었다. 그는 다음 피해자를 구하겠다는 결심도 느꼈고 고개를 들었다.',
      '죄책감과 결심은 같은 자리에서 반복되었지만, 어떤 선택이나 행동 반응도 그 감정을 다른 방향으로 밀어내지 않았다.',
      manuscriptEnding,
    ].join('\n');

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithEmotionalProgression,
      manuscript: manuscriptWithStaticEmotion,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-emotional-progression-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-emotional-progression-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('emotional progression'),
        }),
      ])
    );
  });

  it('fails when an emotional turn does not alter choice or consequence on page', () => {
    const chapterWithAffectiveChoiceTurn = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공은 실패의 죄책감을 숨기지 않고 다음 피해자를 구하겠다고 결심한다.',
        emotional_goal: '죄책감에서 결심으로 이동',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          emotional_tone: '죄책감',
        },
        {
          ...alignedChapter.scenes[1],
          emotional_tone: '결심',
        },
      ],
    };

    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const manuscriptWithInternalOnlyTurn = [
      ...manuscriptBeforeEnding,
      manuscriptEnding,
      '현장 실패 뒤 그는 실패의 죄책감으로 입술을 깨물었다.',
      '그 순간 다음 피해자의 이름이 화면에 떠오르자 그는 다음 피해자를 향한 결심도 느꼈다.',
      '하지만 그 결심은 마음속에만 그대로 머물렀고, 현장 밖으로는 아무것도 이어지지 않았다.',
    ].join('\n');

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithAffectiveChoiceTurn,
      manuscript: manuscriptWithInternalOnlyTurn,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-affective-choice-turn-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-affective-choice-turn-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('affective choice turn'),
        }),
      ])
    );
  });

  it('fails when manuscript prose omits the declared character development', () => {
    const chapterWithCharacterDevelopment = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development: '주인공은 실패의 죄책감을 인정하고 조력자에게 처음 사과한다.',
        emotional_goal: '',
      },
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithCharacterDevelopment,
      manuscript: alignedManuscript,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-character-development-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-development-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('character_development'),
        }),
      ])
    );
  });

  it('fails when declared relationship shift is not staged in scene evidence', () => {
    const chapterWithUnstagedRelationshipShift = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithUnstagedRelationshipShift,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('relationship-shift-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'relationship-shift-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('관계 변화'),
        }),
      ])
    );
  });

  it('fails when relationship shift lacks a high-value turning point', () => {
    const chapterWithThinRelationshipShift = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 주인공과 조력자는 서로 의심하며 관계 회복을 말한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 주인공이 사과하고 조력자가 대답하며 두 사람의 관계가 불신에서 신뢰로 바뀐다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithThinRelationshipShift,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('relationship-turning-point-not-staged');
    expect(issueCodes(result.issues)).not.toContain('relationship-shift-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'relationship-turning-point-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('관계 전환점'),
        }),
      ])
    );
  });

  it('fails when a relationship turning point lacks readable mind inference', () => {
    const chapterWithFlatRelationshipTurn = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 주인공은 조력자의 불신 앞에서 약점을 공개할지 결론 내려야 한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 주인공이 약점을 공개하자 조력자가 휴대폰을 건네며 동행을 약속하고, 두 사람의 관계가 불신에서 신뢰로 바뀌어 바로 함께 움직였다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithFlatRelationshipTurn,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'relationship-mind-inference-not-staged'
    );
    expect(issueCodes(result.issues)).not.toContain(
      'relationship-turning-point-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'relationship-mind-inference-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('관계 마음 추론'),
        }),
      ])
    );
  });

  it('fails when a relationship turning point gives help without counterpart pressure', () => {
    const chapterWithOneSidedRelationshipTurn = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 주인공은 조력자의 불신 앞에서 약점을 숨길지 공개할지 선택해야 한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 주인공이 약점을 공개하자 조력자는 오래 침묵하며 눈을 피하다가 진심을 오해한 자신의 판단을 접고 휴대폰을 건네며 동행을 약속했다. 두 사람의 관계가 불신에서 신뢰로 바뀌어 바로 함께 움직였다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithOneSidedRelationshipTurn,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'relationship-mutual-pressure-not-staged'
    );
    expect(issueCodes(result.issues)).not.toContain(
      'relationship-mind-inference-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'relationship-mutual-pressure-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('관계 상호 압박'),
        }),
      ])
    );
  });

  it('fails when manuscript relationship shift is named but lacks reciprocal reaction', () => {
    const chapterWithRelationshipShift = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 주인공은 조력자의 불신 앞에서 약점을 숨길지 공개할지 선택해야 한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 주인공이 약점을 공개하자 조력자가 침묵 끝에 자기 가족이 앱 기록에 묶인 위험을 감수해야 한다며 동행 조건으로 원본 로그를 숨기지 말라고 요구하고, 두 사람의 관계가 불신에서 신뢰로 한 칸 이동한다. 주인공은 바로 추적 방식을 바꾸어 함께 움직였다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithRelationshipShift,
      manuscript: [
        alignedManuscript,
        '주인공은 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀌었다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-relationship-shift-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-relationship-shift-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('관계 변화'),
        }),
      ])
    );
  });

  it('fails when manuscript relationship shift lacks turning-point risk and consequence', () => {
    const chapterWithRelationshipShift = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 주인공은 조력자의 불신 앞에서 약점을 숨길지 공개할지 선택해야 한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 주인공이 약점을 공개하자 조력자가 침묵 끝에 휴대폰을 건네며 동행을 약속하고, 두 사람의 관계가 불신에서 신뢰로 한 칸 이동한다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithRelationshipShift,
      manuscript: [
        alignedManuscript,
        '주인공이 사과했다. 조력자가 대답했고 두 사람의 관계는 불신에서 신뢰로 회복됐다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-relationship-turning-point-not-evidenced'
    );
    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-relationship-shift-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-relationship-turning-point-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('관계 전환점'),
        }),
      ])
    );
  });

  it('fails when manuscript relationship turning point lacks readable mind inference', () => {
    const chapterWithRelationshipShift = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 주인공은 조력자의 불신 앞에서 약점을 공개할지 결론 내려야 한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 주인공이 약점을 공개하자 조력자가 침묵 끝에 휴대폰을 건네며 동행을 약속하고, 두 사람의 관계가 불신에서 신뢰로 한 칸 이동한다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithRelationshipShift,
      manuscript: [
        alignedManuscript,
        '주인공은 조력자 앞에서 약점을 공개했다. 조력자가 휴대폰을 건네며 동행을 약속했고, 두 사람의 관계는 불신에서 신뢰로 바뀌어 바로 함께 움직였다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-relationship-mind-inference-not-evidenced'
    );
    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-relationship-turning-point-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-relationship-mind-inference-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('관계 마음 추론'),
        }),
      ])
    );
  });

  it('fails when manuscript relationship turn omits counterpart pressure', () => {
    const chapterWithRelationshipPressure = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 주인공은 조력자의 불신 앞에서 약점을 숨길지 공개할지 선택해야 한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 주인공이 약점을 공개하자 조력자는 오래 침묵하며 눈을 피하다가 자기 가족이 앱 기록에 묶인 위험을 감수해야 한다며 동행 조건으로 원본 로그를 숨기지 말라고 요구했다. 두 사람의 관계가 불신에서 신뢰로 바뀌고, 주인공은 바로 추적 방식을 바꾸어 함께 움직였다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithRelationshipPressure,
      manuscript: [
        alignedManuscript,
        '주인공은 조력자 앞에서 약점을 공개했다. 조력자는 오래 침묵하며 눈을 피하다가 진심을 오해한 자신의 판단을 접고 휴대폰을 건네며 동행을 약속했고, 두 사람의 관계는 불신에서 신뢰로 바뀌어 바로 함께 움직였다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-relationship-mutual-pressure-not-evidenced'
    );
    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-relationship-mind-inference-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-relationship-mutual-pressure-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('관계 상호 압박'),
        }),
      ])
    );
  });

  it('fails when relationship shift is not recorded in relationship evolution state', () => {
    const chapterWithRelationshipShift = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 주인공은 조력자의 불신 앞에서 약점을 숨길지 공개할지 선택해야 한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 주인공이 약점을 공개하자 조력자가 침묵 끝에 자기 가족이 앱 기록에 묶인 위험을 감수해야 한다며 동행 조건으로 원본 로그를 숨기지 말라고 요구하고, 두 사람의 관계가 불신에서 신뢰로 한 칸 이동한다. 주인공은 바로 추적 방식을 바꾸어 함께 움직였다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithRelationshipShift,
      relationships: {
        relationships: [
          {
            from: 'char_1',
            to: 'char_support_1',
            type: 'colleague',
            evolution: [],
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('relationship-evolution-not-recorded');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'relationship-evolution-not-recorded',
          priority: 'critical',
          target: 'relationships',
          expected: expect.stringContaining('관계 변화 기록'),
        }),
      ])
    );
  });

  it('passes relationship evolution state when it records the chapter shift', () => {
    const chapterWithRelationshipShift = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
        character_development:
          '주인공이 조력자와의 불신을 깨고 약점을 공개해 관계가 신뢰로 바뀐다.',
        emotional_goal: '',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 주인공은 조력자의 불신 앞에서 약점을 숨길지 공개할지 선택해야 한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 주인공이 약점을 공개하자 조력자가 침묵 끝에 자기 가족이 앱 기록에 묶인 위험을 감수해야 한다며 동행 조건으로 원본 로그를 숨기지 말라고 요구하고, 두 사람의 관계가 불신에서 신뢰로 한 칸 이동한다. 주인공은 바로 추적 방식을 바꾸어 함께 움직였다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: chapterWithRelationshipShift,
      relationships: {
        relationships: [
          {
            from: 'char_1',
            to: 'char_support_1',
            type: 'colleague',
            evolution: [
              {
                chapter: 1,
                change:
                  '주인공이 약점을 공개하고 조력자가 가족 위험이라는 대가를 걸고 동행 조건을 요구해 관계가 불신에서 신뢰로 이동한다.',
              },
            ],
          },
        ],
      },
    });

    expect(result.passed).toBe(true);
    expect(issueCodes(result.issues)).not.toContain('relationship-evolution-not-recorded');
    expect(issueCodes(result.issues)).not.toContain('relationship-turning-point-not-staged');
    expect(issueCodes(result.issues)).not.toContain('relationship-mind-inference-not-staged');
    expect(issueCodes(result.issues)).not.toContain('relationship-mutual-pressure-not-staged');
  });

  it('fails when a later chapter does not carry over prior relationship evolution state', () => {
    const carriedGuide = {
      ...guide,
      chapter: 6,
    };
    const detachedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        current_plot:
          '주인공은 피해자 휴대폰의 새 알림과 과거 미제 사건 번호를 다시 대조하고 앱 개발자 계정 로그를 추적한다.',
      },
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [carriedGuide],
      },
      chapter: detachedChapter,
      relationships: {
        relationships: [
          {
            from: 'char_1',
            to: 'char_support_1',
            type: 'colleague',
            evolution: [
              {
                chapter: 5,
                change:
                  '주인공이 약점을 공개하고 조력자가 동행을 약속해 관계가 불신에서 신뢰로 이동한다.',
              },
            ],
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'relationship-evolution-carryover-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'relationship-evolution-carryover-not-staged',
          priority: 'critical',
          target: 'relationships',
          expected: expect.stringContaining('relationship evolution carryover'),
        }),
      ])
    );
  });

  it('fails when manuscript prose ignores prior relationship evolution that metadata carries forward', () => {
    const carriedGuide = {
      ...guide,
      chapter: 6,
    };
    const carriedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        previous_summary:
          '전 회차에서 주인공이 약점을 공개하고 조력자가 동행을 약속해 관계가 불신에서 신뢰로 이동했다.',
        current_plot:
          '불신에서 신뢰로 바뀐 관계 때문에 조력자가 먼저 휴대폰을 건네고, 주인공은 그 동행 약속을 이용해 피해자 휴대폰의 새 알림과 과거 미제 사건 번호를 다시 대조한다.',
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          purpose: '전 회차 관계 변화를 다음 조사 압박으로 이어받는다.',
          conflict:
            `${alignedChapter.scenes[0].conflict} 전 회차에서 약점을 받아들인 조력자의 신뢰와 동행 약속을 지킬지 혼자 움직일지 선택해야 한다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 불신에서 신뢰로 이동한 관계 상태 때문에 조력자가 먼저 휴대폰을 건네고 동행을 요구하며, 주인공은 그 신뢰를 잃지 않으려 추적 방식을 바꾼다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [carriedGuide],
      },
      chapter: carriedChapter,
      relationships: {
        relationships: [
          {
            from: 'char_1',
            to: 'char_support_1',
            type: 'colleague',
            evolution: [
              {
                chapter: 5,
                change:
                  '주인공이 약점을 공개하고 조력자가 동행을 약속해 관계가 불신에서 신뢰로 이동한다.',
              },
            ],
          },
        ],
      },
      manuscript: [
        '피해자 휴대폰의 새 알림이 다시 깜박이자 주인공은 과거 미제 사건 번호와 현재 사건 기록을 대조했다.',
        '앱 개발자 계정 로그는 삭제된 줄 알았던 서버 파일 아래 남아 있었다.',
        '그는 장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다.',
        '피해자의 휴대폰에서 새 예고가 떠오르며 앱 개발자의 관리자 계정 이름이 화면 아래에 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-relationship-evolution-carryover-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-relationship-evolution-carryover-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('relationship evolution carryover'),
        }),
      ])
    );
  });

  it('fails when chapter foreshadowing uses an id missing from the plot ledger', () => {
    const plotWithForeshadowing = {
      ...plot,
      foreshadowing_schedule: [
        {
          id: 'fore_app_logo',
          plant_chapter: 1,
          hints: [2],
          payoff_chapter: 5,
          importance: 'A',
        },
      ],
    };
    const chapterWithUntrackedForeshadowing = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: ['fore_untracked'],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
      },
    };

    const result = evaluateEngagementContract({
      design,
      plot: plotWithForeshadowing,
      chapter: chapterWithUntrackedForeshadowing,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('foreshadowing-ledger-missing');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'foreshadowing-ledger-missing',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('foreshadowing_schedule'),
        }),
      ])
    );
  });

  it('fails when a declared foreshadowing plant has no concrete scene clue', () => {
    const plotWithForeshadowing = {
      ...plot,
      foreshadowing_schedule: [
        {
          id: 'fore_app_logo',
          plant_chapter: 1,
          hints: [2],
          payoff_chapter: 5,
          importance: 'A',
        },
      ],
    };
    const chapterWithAbstractForeshadowing = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: ['fore_app_logo'],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
      },
      scenes: alignedChapter.scenes.map(scene => ({
        ...scene,
        beat: scene.beat.replace(
          '예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종 단서가 장기 미스터리로 남는다.',
          '언젠가 밝혀질 장기 복선을 심는다.'
        ),
      })),
    };

    const result = evaluateEngagementContract({
      design,
      plot: plotWithForeshadowing,
      chapter: chapterWithAbstractForeshadowing,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('foreshadowing-plant-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'foreshadowing-plant-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('foreshadowing plant concreteness'),
        }),
      ])
    );
  });

  it('fails when manuscript prose omits a concrete foreshadowing plant staged in metadata', () => {
    const plotWithForeshadowing = {
      ...plot,
      foreshadowing_schedule: [
        {
          id: 'fore_app_logo',
          plant_chapter: 1,
          hints: [2],
          payoff_chapter: 5,
          importance: 'A',
        },
      ],
    };
    const chapterWithConcreteForeshadowing = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: ['fore_app_logo'],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          beat:
            `${alignedChapter.scenes[0].beat} 피해자 휴대폰 뒷면에는 푸른 모래시계 앱 로고와 0717 사건 번호가 희미하게 긁혀 있었다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: plotWithForeshadowing,
      chapter: chapterWithConcreteForeshadowing,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 주인공은 현장으로 뛰쳐나갔다.',
        '피해자의 휴대폰 로그와 사망 시각이 맞물렸고 그는 경찰 신고를 미룬 대가로 알리바이 선택지를 잃었다.',
        '피해자의 휴대폰에서 새 알림이 떠오르며 주인공 이름이 다음 수신자로 깜박였다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-foreshadowing-plant-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-foreshadowing-plant-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('foreshadowing plant concreteness'),
        }),
      ])
    );
  });

  it('fails when a declared foreshadowing payoff has no resolved scene meaning', () => {
    const plotWithForeshadowing = {
      ...plot,
      foreshadowing_schedule: [
        {
          id: 'fore_app_logo',
          plant_chapter: 1,
          hints: [1],
          payoff_chapter: 1,
          importance: 'A',
        },
      ],
    };
    const chapterWithUnresolvedPayoff = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: ['fore_app_logo'],
        hooks_plant: [],
        hooks_reveal: [],
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: '피해자 휴대폰에 앱 로고와 0717 사건 번호가 다시 비친다.',
        page_turner_question: '앱 로고와 0717 사건 번호는 왜 반복되는가?',
        must_click_ending: '앱 로고와 0717 사건 번호가 어둠 속에서 다시 깜박인다.',
      },
      scenes: alignedChapter.scenes.map(scene => ({
        ...scene,
        beat: '피해자 휴대폰에 앱 로고와 0717 사건 번호가 다시 비치고 주인공은 더 불길한 예감을 느낀다.',
      })),
    };

    const result = evaluateEngagementContract({
      design,
      plot: plotWithForeshadowing,
      chapter: chapterWithUnresolvedPayoff,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('foreshadowing-payoff-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'foreshadowing-payoff-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('foreshadowing payoff resolution'),
        }),
      ])
    );
  });

  it('fails when manuscript prose omits the staged foreshadowing payoff resolution', () => {
    const plotWithForeshadowing = {
      ...plot,
      foreshadowing_schedule: [
        {
          id: 'fore_app_logo',
          plant_chapter: 1,
          hints: [1],
          payoff_chapter: 1,
          importance: 'A',
        },
      ],
    };
    const payoffResolution =
      '앱 로고와 0717 사건 번호가 개발자의 서명 파일과 일치하고, 그 결과 가족 실종 파일의 배후가 같은 개발자임이 드러나 주인공의 다음 추적지가 서버실로 바뀐다.';
    const chapterWithResolvedPayoff = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: ['fore_app_logo'],
        hooks_plant: [],
        hooks_reveal: [],
      },
      context: {
        current_plot: payoffResolution,
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: payoffResolution,
        must_click_ending: `${payoffResolution} 서버실 문이 잠기기 직전 새 알림이 울린다.`,
      },
      scenes: [
        alignedChapter.scenes[0],
        {
          ...alignedChapter.scenes[1],
          beat: `${alignedChapter.scenes[1].beat} ${payoffResolution}`,
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: plotWithForeshadowing,
      chapter: chapterWithResolvedPayoff,
      manuscript: [
        '주인공은 피해자 휴대폰의 알림 목록만 다시 훑었다.',
        '새 알림이 울렸고 그는 다음 현장으로 뛰었다.',
        '왜 같은 표시가 반복되는지는 아직 알 수 없었다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-foreshadowing-payoff-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-foreshadowing-payoff-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('foreshadowing payoff resolution'),
        }),
      ])
    );
  });

  it('fails when chapter pays off foreshadowing before its scheduled payoff chapter', () => {
    const plotWithForeshadowing = {
      ...plot,
      foreshadowing_schedule: [
        {
          id: 'fore_app_logo',
          plant_chapter: 1,
          hints: [2, 3, 4],
          payoff_chapter: 5,
          importance: 'A',
        },
      ],
    };
    const chapterWithEarlyPayoff = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: [],
        foreshadowing_payoff: ['fore_app_logo'],
        hooks_plant: [],
        hooks_reveal: [],
      },
    };

    const result = evaluateEngagementContract({
      design,
      plot: plotWithForeshadowing,
      chapter: chapterWithEarlyPayoff,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('foreshadowing-payoff-timing-mismatch');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'foreshadowing-payoff-timing-mismatch',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('payoff_chapter'),
        }),
      ])
    );
  });

  it('passes foreshadowing ledger checks when chapter timing matches the schedule', () => {
    const plotWithForeshadowing = {
      ...plot,
      foreshadowing_schedule: [
        {
          id: 'fore_app_logo',
          plant_chapter: 1,
          hints: [2],
          payoff_chapter: 5,
          importance: 'A',
        },
      ],
    };
    const chapterWithScheduledForeshadowing = {
      ...alignedChapter,
      narrative_elements: {
        foreshadowing_plant: ['fore_app_logo'],
        foreshadowing_payoff: [],
        hooks_plant: [],
        hooks_reveal: [],
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          beat:
            `${alignedChapter.scenes[0].beat} 피해자 휴대폰 뒷면에는 푸른 모래시계 앱 로고와 0717 사건 번호가 희미하게 긁혀 있었다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: plotWithForeshadowing,
      chapter: chapterWithScheduledForeshadowing,
    });

    expect(result.passed).toBe(true);
    expect(issueCodes(result.issues)).not.toContain('foreshadowing-ledger-missing');
    expect(issueCodes(result.issues)).not.toContain('foreshadowing-payoff-timing-mismatch');
  });

  it('fails when chapter hook metadata uses an id missing from the hook ledger', () => {
    const input = {
      design,
      plot,
      chapter: {
        ...alignedChapter,
        narrative_elements: {
          foreshadowing_plant: [],
          foreshadowing_payoff: [],
          hooks_plant: ['hook_untracked'],
          hooks_reveal: [],
        },
      },
      hooks: {
        mystery_hooks: [
          {
            id: 'hook_first_receiver',
            content: '앱이 왜 주인공을 첫 수신자로 골랐는가',
            plant_chapter: 1,
            reveal_chapter: 4,
          },
        ],
      },
    };

    const result = evaluateEngagementContract(input);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('hook-ledger-missing');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'hook-ledger-missing',
          priority: 'critical',
          target: 'hooks_ledger',
          expected: expect.stringContaining('plot/hooks.json'),
        }),
      ])
    );
  });

  it('fails when chapter reveals a mystery hook before its scheduled reveal chapter', () => {
    const input = {
      design,
      plot,
      chapter: {
        ...alignedChapter,
        narrative_elements: {
          foreshadowing_plant: [],
          foreshadowing_payoff: [],
          hooks_plant: [],
          hooks_reveal: ['hook_first_receiver'],
        },
      },
      hooks: {
        mystery_hooks: [
          {
            id: 'hook_first_receiver',
            content: '앱이 왜 주인공을 첫 수신자로 골랐는가',
            plant_chapter: 1,
            reveal_chapter: 4,
          },
        ],
      },
    };

    const result = evaluateEngagementContract(input);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('hook-reveal-timing-mismatch');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'hook-reveal-timing-mismatch',
          priority: 'critical',
          target: 'hooks_ledger',
          expected: expect.stringContaining('reveal_chapter'),
        }),
      ])
    );
  });

  it('passes hook ledger checks when hook plant timing matches the ledger', () => {
    const input = {
      design,
      plot,
      chapter: {
        ...alignedChapter,
        narrative_elements: {
          foreshadowing_plant: [],
          foreshadowing_payoff: [],
          hooks_plant: ['hook_first_receiver'],
          hooks_reveal: [],
        },
      },
      hooks: {
        mystery_hooks: [
          {
            id: 'hook_first_receiver',
            content: '앱이 왜 주인공을 첫 수신자로 골랐는가',
            plant_chapter: 1,
            reveal_chapter: 4,
          },
        ],
      },
    };

    const result = evaluateEngagementContract(input);

    expect(result.passed).toBe(true);
    expect(issueCodes(result.issues)).not.toContain('hook-ledger-missing');
    expect(issueCodes(result.issues)).not.toContain('hook-reveal-timing-mismatch');
  });

  it('fails when manuscript prose overuses generic character labels instead of known names', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      characters: [
        {
          id: 'char_1',
          name: '이서진',
          role: 'protagonist',
        },
      ],
      manuscript: alignedManuscript,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-generic-character-label-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-generic-character-label-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('이서진'),
        }),
      ])
    );
  });

  it('fails when manuscript prose leaks design or evaluation jargon into narration', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱이 이서진의 이름을 첫 번째 수신자로 지목한 순간, 퇴근 직후의 휴대폰이 파란빛으로 번쩍였다.',
        '이서진은 장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 했다. 공포보다 패턴을 먼저 읽고 경찰 신고보다 현장 도착 시간을 먼저 계산해 뛰쳐나갔다.',
        '이서진은 제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼진다. 현장 도착이 늦은 대가로 피해자는 이미 쓰러졌고, 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '쓰러진 피해자의 휴대폰 로그와 현장 기록의 빈칸이 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감을 제공한다. 매 회차 작은 규칙 증명이라는 보상 주기가 여기서 시작된다.',
        '피해자의 휴대폰에서 새 예고가 뜨며 이서진의 이름과 과거 미제 사건 번호가 현재 사건 기록에 함께 연결되자, 그는 차갑게 식은 화면을 움켜쥐고 왜 첫 수신자가 자신인지 모른 채 숨을 삼켰다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-design-jargon-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-design-jargon-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('scene-native prose'),
        }),
      ])
    );
  });

  it('fails when manuscript prose only summarizes metadata without on-page scene texture', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다는 사실이 드러났다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다는 점이 설명된다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명, 알림, 이동, 현장 실패 순서로 규칙을 행동으로 보여준다.',
        '주인공은 제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼지고, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 커진다. 매 회차 작은 규칙 증명이라는 보상 주기도 유지된다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-summary-prose');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-summary-prose',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('scene texture'),
        }),
      ])
    );
  });

  it('fails when manuscript prose has evidence keywords but lacks on-page scene density', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림은 현장 기록 1번 항목으로 정리되었다. 휴대폰 화면, 복도 조명, 통제선, 피해자 로그, 손바닥의 땀 같은 단서가 목록에 있었다.',
        '주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다. 공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다는 내용도 같은 문서에 남았다.',
        '제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼진 사건은 현장 실패로 분류되었고, 현장 도착이 늦은 대가로 피해자는 이미 쓰러졌으며 실패가 상황을 되돌릴 수 없게 바꿨다는 결론이 기록되었다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명은 현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물렸다는 분석으로 확인되었다. 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감은 손바닥의 땀과 목덜미를 조이는 감각으로 설명되었다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹쳤다는 기록으로 남았다. 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서도 가족 실종 파일 번호로 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-scene-density-not-evidenced');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-scene-density-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('on-page scene density'),
        }),
      ])
    );
  });

  it('fails when chapter metadata has functional beats but no signature scene image', () => {
    const flatImageChapter = {
      ...alignedChapter,
      scenes: [
        {
          ...alignedChapter.scenes[0],
          purpose: '예고 앱의 첫 알림과 주인공의 반응을 제시한다.',
          conflict:
            '주인공은 장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 한다.',
          beat:
            '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명, 주인공이 경찰 신고보다 현장 도착 시간을 먼저 계산해 현장으로 이동한다. 알림, 이동, 현장 실패 순서로 규칙을 행동으로 보여주고 장기 미스터리 단서를 남긴다.',
        },
        {
          ...alignedChapter.scenes[1],
          conflict:
            '주인공은 제한 시간 안에 피해자를 찾으려 하지만 현장 기록과 피해자 휴대폰만 남는다.',
          beat:
            '현장 실패 직후 피해자의 휴대폰에서 새 알림이 오고 주인공 이름이 다음 수신자로 지정된다. 과거 미제 사건 번호가 현재 사건 기록과 연결되고 예고 앱의 개발자 단서와 가족 실종 파일 번호가 같은 묶음으로 남는다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: flatImageChapter,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('signature-scene-image-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'signature-scene-image-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('signature scene image'),
        }),
      ])
    );
  });

  it('fails when a declared resonance seed is not staged as a motif in scene metadata', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        narrative_elements: {
          resonance_seed:
            '깨진 거울 조각은 첫 수신자의 고립과 되돌릴 수 없는 선택 대가로 남는다.',
        },
      },
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('motif-resonance-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'motif-resonance-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('motif resonance seed'),
        }),
      ])
    );
  });

  it('fails when manuscript omits the declared resonance seed motif', () => {
    const resonanceChapter = {
      ...alignedChapter,
      narrative_elements: {
        resonance_seed:
          '깨진 유리 조각은 첫 수신자의 고립과 되돌릴 수 없는 선택 대가로 남는다.',
      },
      scenes: alignedChapter.scenes.map(scene =>
        scene.scene_number === 2
          ? {
              ...scene,
              beat:
                `${scene.beat} 깨진 유리 조각은 파란 빛을 튕기고 주인공의 손바닥에 식은땀을 남긴다. 그 조각은 첫 수신자로 고립된 주인공에게 선택의 대가가 남았다는 의미로 바뀌고, 다음 수신자 이름이 깜박이는 순간 안전한 제보자 선택지는 되돌릴 수 없이 닫힌다.`,
            }
          : scene
      ),
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: resonanceChapter,
      manuscript: alignedManuscript,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).not.toContain('motif-resonance-not-staged');
    expect(issueCodes(result.issues)).toContain(
      'manuscript-motif-resonance-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-motif-resonance-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('motif resonance seed on page'),
        }),
      ])
    );
  });

  it('fails when functional scene metadata lacks a fresh scene novelty matrix', () => {
    const flatNoveltyChapter = {
      ...alignedChapter,
      scenes: [
        {
          scene_number: 1,
          purpose: '예고 앱의 첫 알림과 주인공의 반응을 제시한다.',
          conflict:
            '장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 한다.',
          beat:
            '공포보다 패턴을 먼저 읽은 주인공이 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나간다. 알림, 이동, 현장 실패 순서로 규칙을 행동으로 보여주고, 경찰 신고를 미룬 대가로 공식 신고 기록이 사라져 안전한 제보자 선택지가 닫힌다. 그 결과 앱 알림과 사건 기록의 빈칸이 다음 압박이 된다.',
        },
        {
          scene_number: 2,
          purpose: '앱 예고가 실제 사건과 연결됨을 증명한다.',
          conflict:
            '주인공은 제한 시간 안에 피해자를 찾으려 하지만 누군가 기록을 숨기고 앱 로그만 남겨 그를 다음 수신자로 몰아넣는다.',
          beat: `피해자의 휴대폰 화면이 파랗게 깜박이자 그는 손바닥에 식은땀이 밴 채 화면을 움켜쥐었고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인한다. 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 생기고, 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종 단서가 장기 미스터리로 남는다. 현장 실패 직후 ${guide.fun_spec.must_click_ending}`,
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: flatNoveltyChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('scene-novelty-matrix-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'scene-novelty-matrix-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('scene novelty matrix'),
        }),
      ])
    );
  });

  it('fails when scene novelty names locations without setting constraints or affordances', () => {
    const shallowSettingNoveltyChapter = {
      ...alignedChapter,
      scenes: [
        {
          scene_number: 1,
          purpose: '예고 앱의 첫 알림과 기록실 원본을 연결한다.',
          conflict:
            '주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 기록실 원본을 확인할지 선택해야 하지만 내부자가 앱 로그를 조작해 그를 다음 표적으로 몰아넣는다.',
          beat: [
            '기록실 바닥의 파란 휴대폰 화면이 손바닥 땀에 번지자, 그는 신고 기록과 알리바이를 포기한 대가로 안전한 제보자 경로가 사라진 것을 감수하고 경찰 신고보다 원본 기록 확인을 택한다.',
            '그 결과 관리자 계정 원본이 드러나 앱 규칙이 확정되고 피해자 사망 시각과 알림 시간이 일치한다.',
          ].join(' '),
        },
        {
          scene_number: 2,
          purpose: '앱 예고가 실제 사건과 연결됨을 증명한다.',
          conflict:
            '직후 내부자가 피해자 로그를 삭제하고 앱 서버 기록을 조작해 주인공 이름을 다음 수신자로 표적화한다.',
          beat: [
            '서버실 원본 파일 위에 앱 로고와 미제 사건 번호가 겹치며 새 알림이 떠오르고, 그는 피해자 휴대폰을 움켜쥔 채 다음 수신자로 깜박이는 자기 이름을 확인하려 화면을 다시 눌렀다.',
            '그 결과 가족 실종 파일 번호까지 같은 묶음으로 연결된다.',
          ].join(' '),
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: shallowSettingNoveltyChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('scene-novelty-matrix-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'scene-novelty-matrix-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('setting_mode'),
        }),
      ])
    );
  });

  it('fails when manuscript has plot function but no memorable signature scene image', () => {
    const functionalManuscript = [
      '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
      '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사무실 복도에서 지하보도 입구까지 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
      '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 철문을 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
      '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 목덜미가 조이고 손바닥에 식은땀이 배어 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 굳어졌다.',
      '피해자의 휴대폰에서 새 알림이 오고 주인공 이름이 다음 수신자로 지정되자, 과거 미제 사건 번호가 현재 사건 기록과 연결되었고 예고 앱의 개발자와 과거 미제 사건의 연결은 파일 기록으로 드러났다. 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 숨을 삼켰다.',
    ].join('\n');

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: functionalManuscript,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-signature-scene-image-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-signature-scene-image-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('signature scene image'),
        }),
      ])
    );
  });

  it('fails when manuscript has a shallow visual image without story-impact lift', () => {
    const shallowImageManuscript = [
      '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
      '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사무실 복도에서 지하보도 입구까지 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
      '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 철문을 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
      '잠시, 복도에는 물소리만 남았다.',
      '피해자의 휴대폰 화면이 파랗게 깜박이고, 그는 손바닥으로 그것을 움켜쥔 채 새 알림을 보았다.',
      '그 장면은 눈에 띄었지만 사건의 의미를 바꾸지 못했고, 새 판단이나 남는 결과를 만들지 못한 채 다음 설명으로 넘어갔다.',
    ].join('\n');

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: shallowImageManuscript,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-signature-scene-image-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-signature-scene-image-not-evidenced',
          expected: expect.stringContaining('story-impact lift'),
        }),
      ])
    );
  });

  it('fails when manuscript action lacks spatial blocking and readable movement path', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선의 조명을 꺼뜨리고 현장 문을 잠갔고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았다. 그는 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-spatial-blocking-not-evidenced');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-spatial-blocking-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('spatial blocking'),
        }),
      ])
    );
  });

  it('fails when dialogue delivers engagement information as exposition without subtext or friction', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였다. 주인공은 손을 움켜쥐고 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '"예고 앱은 아직 일어나지 않은 살인을 예보하고, 첫 알림은 네 이름을 수신자로 지목했어. 앱이 실제 살인을 어떻게 알았는지가 이 사건의 핵심 질문이야."',
        '"공포보다 패턴을 먼저 읽은 네가 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나가야 독자가 네 매력을 이해해."',
        '그는 목덜미가 조이는 것을 느끼며 엘리베이터 버튼을 눌렀고, 제한 시간 안에 피해자를 찾으려 달려 나갔다. 통제선 앞에서 조명이 꺼지자 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '"단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감은 현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리면 제공돼. 매 회차 작은 규칙 증명이라는 보상 주기도 여기서 유지돼."',
        '"예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 하나의 장기 미스터리로 수렴한다는 사실도 대사로 말해 둘게."',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 가족 실종 파일 번호가 화면 아래에서 다시 깜박였다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-dialogue-subtext-not-evidenced');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-dialogue-subtext-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('dialogue subtext'),
        }),
      ])
    );
  });

  it('fails when multi-turn dialogue has no interpersonal conflict or pushback', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '"이 번호, 피해자 휴대폰에도 있나요?"',
        '"네, 같은 번호입니다."',
        '"그럼 기록실 파일을 열어 봅시다."',
        '"알겠습니다. 현재 사건 기록과 맞춰 보겠습니다."',
        '그는 목덜미가 조이는 것을 느끼며 엘리베이터 버튼을 눌렀고, 제한 시간 안에 피해자를 찾으려 달려 나갔다. 통제선 앞에서 조명이 꺼지자 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 손바닥의 땀과 목덜미를 조이는 감각으로 분명해졌다. 매 회차 작은 규칙 증명이라는 보상 주기도 현장 실패의 결과로 남았다.',
        '왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지는 미제 사건 번호 뒤에 더 깊이 숨었다. 피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서도 가족 실종 파일 번호로 남았으며, 그는 화면을 쥔 채 숨을 삼켰다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-dialogue-conflict-not-evidenced');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-dialogue-conflict-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('dialogue conflict'),
        }),
      ])
    );
  });

  it('fails when contested dialogue does not create a power, information, or relationship turn', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        ...manuscriptBeforeEnding,
        '민서가 피해자의 휴대폰을 책상 위에 올려놓았다. "그 번호를 왜 숨겼어요?"',
        '도현이 화면을 잠깐 보고 팔짱을 꼈다. "지금은 당신을 못 믿겠습니다."',
        '민서가 휴대폰을 다시 자기 쪽으로 당겼다. "말 돌리지 마세요. 이러면 다음 피해자를 놓쳐요."',
        '도현이 시선을 피하지 않은 채 대꾸했다. "당신도 설명하지 않았습니다."',
        '두 사람은 같은 화면 앞에서 한동안 서로를 노려보았다.',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-dialogue-turn-not-evidenced');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-dialogue-turn-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('dialogue turn'),
        }),
      ])
    );
  });

  it('fails when a dialogue turn is not carried into the next action beat', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        ...manuscriptBeforeEnding,
        '민서가 피해자의 휴대폰을 책상 위에 올려놓았다. "그 번호를 왜 숨겼어요?"',
        '도현이 화면 잠금이 풀리자 삭제된 로그를 내밀었다. "당신을 못 믿지만, 이 로그는 봐야 합니다."',
        '민서가 파일명을 확인하자 앱 로고와 과거 미제 사건 번호가 같은 줄에서 드러났다. "그러면 지금부터는 내가 경찰보다 먼저 움직여요."',
        '도현이 한 걸음 물러서며 문 앞을 비켰다. "조건이 있습니다. 이 파일은 내 이름으로 넘기지 마세요."',
        '그 뒤 그는 아무 조건도 바꾸지 않은 채 원래처럼 엘리베이터 버튼을 눌렀고, 휴대폰 로그나 비켜 준 문에는 다시 손대지 않았다.',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-dialogue-state-carryover-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-dialogue-state-carryover-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('dialogue state carryover'),
        }),
      ])
    );
  });

  it('fails when attributed character dialogue uses the same voice across speakers', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        ...manuscriptBeforeEnding,
        '민서가 피해자의 휴대폰을 등 뒤로 숨겼다. "아니, 그 기록은 지금 넘기면 안 돼."',
        '도현이 통제선 앞을 막아섰다. "아니, 그 기록은 지금 넘기면 안 돼."',
        '민서가 현장 철문 손잡이를 붙잡았다. "네가 숨긴 번호를 말해. 안 그러면 현장 문을 열지 않겠어."',
        '도현이 한 걸음 물러섰다. "네가 숨긴 번호를 말해. 안 그러면 현장 문을 열지 않겠어."',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-character-voice-not-differentiated');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-not-differentiated',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('character voice differentiation'),
        }),
      ])
    );
  });

  it('fails when different dialogue lines still share an interchangeable speaker voice profile', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        ...manuscriptBeforeEnding,
        '민서가 피해자의 휴대폰을 들어 올렸다. "지금 확인해야 해. 안 그러면 우리가 늦어."',
        '도현이 통제선 너머를 가리켰다. "지금 움직여야 해. 안 그러면 기록이 사라져."',
        '민서가 잠긴 철문을 두드렸다. "그 번호를 말해. 안 그러면 현장 문을 열지 않겠어."',
        '도현이 삭제된 로그를 움켜쥐었다. "그 파일을 넘겨. 안 그러면 통제선은 못 지나가."',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-character-voice-not-differentiated');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-not-differentiated',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('character voice differentiation'),
        }),
      ])
    );
  });

  it('does not flag attributed dialogue when speakers have distinct tactics and rhythms', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        ...manuscriptBeforeEnding,
        '민서가 피해자의 휴대폰 시간을 엄지로 짚었다. "잠깐. 이 초 단위가 틀렸어? 피해자 폰부터 다시 맞춰 볼게."',
        '도현이 통제선 바깥에서 목소리를 낮췄다. "기록은 제가 넘기겠습니다. 대신 제 이름은 파일에서 지워 주십시오."',
        '민서가 잠긴 철문 틈으로 화면을 밀어 넣었다. "나는 로그가 남긴 틈을 볼래. 도현 씨는 문이 닫힌 시간을 적어 줘요."',
        '도현이 키카드를 꺼내 들었다. "현장 접근 권한은 제가 열겠습니다. 당신은 피해자 휴대폰만 확인하십시오."',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-character-voice-not-differentiated'
    );
  });

  it('fails when attributed dialogue breaks a known character voice profile', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      characters: [
        {
          id: 'char_001',
          name: '이서진',
          voice: {
            speech_pattern: '존댓말 위주, 짧고 정중한 문장',
            formality_level: 'formal',
          },
        },
      ],
      manuscript: [
        ...manuscriptBeforeEnding,
        '이서진이 피해자의 휴대폰을 들어 올렸다. "지금 넘겨."',
        '이서진이 잠긴 철문을 두드렸다. "빨리 확인해."',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-character-voice-profile-drift');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-profile-drift',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('character dialogue should preserve'),
        }),
      ])
    );
  });

  it('does not flag attributed dialogue that preserves the known character voice profile', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      characters: [
        {
          id: 'char_001',
          name: '이서진',
          voice: {
            speech_pattern: '존댓말 위주, 짧고 정중한 문장',
            formality_level: 'formal',
          },
        },
      ],
      manuscript: [
        ...manuscriptBeforeEnding,
        '이서진이 피해자의 휴대폰을 들어 올렸다. "지금 확인하겠습니다."',
        '이서진이 잠긴 철문을 두드렸다. "먼저 기록부터 보겠습니다."',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-character-voice-profile-drift'
    );
  });

  it('fails when attributed dialogue borrows another character signature phrase', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      characters: [
        {
          id: 'char_001',
          name: '이서진',
          voice: {
            formality_level: 'formal',
            signature_phrases: ['먼저 기록부터 보겠습니다', '숫자는 거짓말을 못 합니다'],
          },
        },
        {
          id: 'char_002',
          name: '한도윤',
          voice: {
            formality_level: 'formal',
            signature_phrases: ['선은 이미 넘어갔습니다', '증거는 제 쪽에 있습니다'],
          },
        },
      ],
      manuscript: [
        ...manuscriptBeforeEnding,
        '이서진이 피해자의 휴대폰을 들어 올렸다. "선은 이미 넘어갔습니다."',
        '이서진이 현장 기록을 접었다. "증거는 제 쪽에 있습니다."',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-character-voice-profile-drift');
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-profile-drift',
          actual: expect.stringContaining('borrowed another character'),
        }),
      ])
    );
  });

  it('fails when a standard Korean voice profile repeatedly drifts into regional dialect', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      characters: [
        {
          id: 'char_001',
          name: '이서진',
          voice: {
            dialect: '표준어',
          },
        },
      ],
      manuscript: [
        ...manuscriptBeforeEnding,
        '이서진이 피해자의 휴대폰을 들어 올렸다. "뭐라카노."',
        '이서진이 잠긴 철문을 두드렸다. "그게 맞나."',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-character-voice-profile-drift');
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-profile-drift',
          actual: expect.stringContaining('regional dialect markers'),
        }),
      ])
    );
  });

  it('fails when attributed dialogue uses vocabulary the character profile explicitly avoids', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      characters: [
        {
          id: 'char_001',
          name: '이서진',
          voice: {
            formality_level: 'formal',
            vocabulary: '선호 어휘: 현장로그, 증거번호; 금지 어휘: 운명, 대충, 느낌상',
          },
        },
      ],
      manuscript: [
        ...manuscriptBeforeEnding,
        '이서진이 피해자의 휴대폰을 들어 올렸다. "이건 운명 같은 게 아니라 현장로그 문제입니다."',
        '이서진이 잠긴 철문을 두드렸다. "대충 맞춘 추정으로 넘길 수 없습니다."',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-character-voice-profile-drift');
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-profile-drift',
          actual: expect.stringContaining('avoided vocabulary'),
        }),
      ])
    );
  });

  it('fails when attributed dialogue borrows another character preferred vocabulary', () => {
    const manuscriptLines = alignedManuscript.split('\n');
    const manuscriptBeforeEnding = manuscriptLines.slice(0, -1);
    const manuscriptEnding = manuscriptLines[manuscriptLines.length - 1] ?? '';
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      characters: [
        {
          id: 'char_001',
          name: '이서진',
          voice: {
            formality_level: 'formal',
            vocabulary: '선호 어휘: 현장로그, 증거번호; 금지 어휘: 운명, 대충',
          },
        },
        {
          id: 'char_002',
          name: '한도윤',
          voice: {
            formality_level: 'formal',
            vocabulary: '선호 어휘: 혈흔지도, 밀실각; 금지 어휘: 감으로, 어쩌면',
          },
        },
      ],
      manuscript: [
        ...manuscriptBeforeEnding,
        '이서진이 피해자의 휴대폰을 들어 올렸다. "혈흔지도부터 다시 보겠습니다."',
        '이서진이 잠긴 철문을 두드렸다. "이 밀실각은 아직 닫히지 않았습니다."',
        manuscriptEnding,
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-character-voice-profile-drift');
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-profile-drift',
          actual: expect.stringContaining("borrowed another character's preferred vocabulary"),
        }),
      ])
    );
  });

  it('fails when manuscript prose does not stage reader reward and must-click ending', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: '주인공은 조용히 퇴근해 따뜻한 차를 마셨다. 사건은 화면 밖에서 정리되었다.',
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toEqual(
      expect.arrayContaining([
        'manuscript-reward-not-evidenced',
        'manuscript-ending-not-evidenced',
      ])
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-reward-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: guide.fun_spec.reader_reward,
        }),
        expect.objectContaining({
          code: 'manuscript-ending-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: guide.fun_spec.must_click_ending,
        }),
      ])
    );
  });

  it('fails when the manuscript reward arrives as passive exposition instead of earned discovery', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선의 조명을 꺼뜨리고 현장 문을 잠갔고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '그 순간 낯선 파일이 자동으로 열리며 현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위라고 설명했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명도 화면 안내문으로 정리됐다.',
        '두 단서가 한 점으로 겹치는 순간 목덜미가 조이고 식은땀이 밴 손바닥이 차갑게 식었지만, 그는 설명을 읽고 피해자의 휴대폰을 다시 쥐었다.',
        '예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았다. 그는 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-earned-reward-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-earned-reward-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('earned reward'),
        }),
      ])
    );
  });

  it('fails when an earned reward answer closes curiosity without opening a sharper next question', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선의 조명을 꺼뜨리고 현장 문을 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '그는 모든 의문이 풀렸다고 느꼈고 더 궁금한 것은 없었다. 왜 첫 알림이 맞았는지도 모두 설명됐다고 안도했다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 숨이 막혀 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-question-ladder-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-question-ladder-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('question ladder'),
        }),
      ])
    );
  });

  it('fails when a promised reversal does not revise the on-page forecast', () => {
    const forecastReward =
      '피해자 휴대폰 로그는 조력자 알리바이를 증명한다는 예상이 뒤집히고 로그 지연이 내부 공범 후보를 좁히는 반전';
    const forecastPlot = {
      ...plot,
      per_chapter_guide: [
        {
          ...guide,
          fun_spec: {
            ...guide.fun_spec,
            reader_reward: forecastReward,
          },
        },
      ],
    };
    const forecastChapter = {
      ...alignedChapter,
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: forecastReward,
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          beat: `${alignedChapter.scenes[0].beat} ${forecastReward}.`,
        },
        alignedChapter.scenes[1],
      ],
    };
    const result = evaluateEngagementContract({
      design,
      plot: forecastPlot,
      chapter: forecastChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '피해자 휴대폰 로그는 조력자 알리바이를 증명한다는 예상이 뒤집히고 로그 지연이 내부 공범 후보를 좁히는 반전이었다. 그는 그저 놀랐지만 가설을 바꾸지 않은 채 피해자의 휴대폰을 다시 쥐었다.',
        '하지만 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지는 더 큰 미해결 질문으로 남았다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-forecast-revision-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-forecast-revision-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('forecast revision'),
        }),
      ])
    );
  });

  it('accepts a promised reversal when the clue changes hypothesis and next action', () => {
    const forecastReward =
      '피해자 휴대폰 로그는 조력자 알리바이를 증명한다는 예상이 뒤집히고 로그 지연이 내부 공범 후보를 좁히는 반전';
    const forecastPlot = {
      ...plot,
      per_chapter_guide: [
        {
          ...guide,
          fun_spec: {
            ...guide.fun_spec,
            reader_reward: forecastReward,
          },
        },
      ],
    };
    const forecastChapter = {
      ...alignedChapter,
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: forecastReward,
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          beat: `${alignedChapter.scenes[0].beat} ${forecastReward}.`,
        },
        alignedChapter.scenes[1],
      ],
    };
    const result = evaluateEngagementContract({
      design,
      plot: forecastPlot,
      chapter: forecastChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '피해자 휴대폰 로그는 조력자 알리바이를 증명한다는 예상이 뒤집히고 로그 지연이 내부 공범 후보를 좁히는 반전이었다.',
        '그는 로그의 의미를 알리바이가 아니라 지연 신호로 다시 해석했고, 조력자를 내부자 후보로 올린 뒤 다음 검증 행동을 서버실 추적으로 바꿨다.',
        '하지만 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지는 더 큰 미해결 질문으로 남았다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-forecast-revision-not-evidenced'
    );
  });

  it('fails when an earned reward is only a generic clue match without a fresh payoff turn', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선의 조명을 꺼뜨리고 현장 문을 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그를 그는 다시 쥐고 대조했다. 두 기록이 같은 초 단위로 맞물리자 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 확인됐다. 목덜미가 조이고 식은땀이 밴 손바닥이 차갑게 식었다.',
        '하지만 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지는 더 큰 미해결 질문으로 남았다.',
        '예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았다. 그는 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-reward-freshness-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-reward-freshness-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('reward freshness'),
        }),
      ])
    );
  });

  it('fails when structural reward beats do not create reader desire for the outcome', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자의 휴대폰 로그를 확보하려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌고, 다음 수신자 규칙이 새 알림으로 좁혀졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-reader-desire-not-evidenced'
    );
    expect(issueCodes(result.issues).filter(code =>
      code !== 'manuscript-reader-desire-not-evidenced'
    )).toEqual([]);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-reader-desire-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('reader desire intensity'),
        }),
      ])
    );
  });

  it('fails when the manuscript mentions the ending hook before the chapter break but does not stage it at the end', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은 땀을 끌어올렸다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다는 가능성도 회의 중간에 언급됐다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
        '그는 휴대폰을 내려놓고 복도 끝을 바라보며 다음 사건을 생각했다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-ending-hook-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-ending-hook-not-staged',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('chapter break'),
        }),
      ])
    );
  });

  it('fails when the manuscript stages the ending hook but closes the open loop in the final beat', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은 땀을 끌어올렸다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
        '예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족의 실종 파일 번호까지 같은 범인의 흔적으로 모두 밝혀져 사건이 해결됐다고 그는 안도했다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-ending-hook-closed');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-ending-hook-closed',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('unresolved'),
        }),
      ])
    );
  });

  it('fails when the manuscript final open-loop question is too broad despite staging the hook', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌고, 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지는 미제 사건 번호 뒤에 더 깊이 숨었다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 그는 화면을 움켜쥔 채 숨을 삼켰다.',
        '하지만 이 사건의 진실은 무엇인지 알 수 없었다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-ending-hook-question-too-broad'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-ending-hook-question-too-broad',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('final open-loop question'),
        }),
      ])
    );
  });

  it('calibrates manuscript ending question specificity against Korean ending holdout cases', () => {
    const buildHoldoutManuscript = (finalSentence: string): string =>
      [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 그는 화면을 움켜쥔 채 숨을 삼켰다.',
        finalSentence,
      ].join('\n');

    const holdoutCases = [
      {
        label: 'web-mystery broad truth question',
        finalSentence: '하지만 이 사건의 진실은 무엇인지 알 수 없었다.',
        shouldFailSpecificity: true,
      },
      {
        label: 'thriller broad culprit question',
        finalSentence: '하지만 누가 범인인지 알 수 없었다.',
        shouldFailSpecificity: true,
      },
      {
        label: 'modern-fantasy anchored rule-cost question',
        finalSentence:
          '왜 0717 사건 번호와 푸른 모래시계 앱 로고가 같은 가족 실종 파일에 반복되는지, 그는 화면을 쥔 채 다음 수신자로 깜박이는 자기 이름을 지우지 못했다.',
        shouldFailSpecificity: false,
      },
      {
        label: 'thriller anchored actor-target question',
        finalSentence:
          '박도현은 왜 주인공 이름을 다음 표적으로 남기고, 피해자 휴대폰 사진에 같은 좌표를 숨겼는지 알 수 없었다.',
        shouldFailSpecificity: false,
      },
      {
        label: 'literary aftertaste without explicit open question',
        finalSentence:
          '그는 앱 로고와 0717 파일 번호가 겹친 화면을 쥔 채, 사건이 아니라 선택이었다는 감각만 남은 어둠 속에서 숨을 골랐다.',
        shouldFailSpecificity: false,
      },
    ];

    for (const holdoutCase of holdoutCases) {
      const result = evaluateEngagementContract({
        design,
        plot,
        chapter: alignedChapter,
        manuscript: buildHoldoutManuscript(holdoutCase.finalSentence),
      });
      const codes = issueCodes(result.issues);

      if (holdoutCase.shouldFailSpecificity) {
        expect(codes, holdoutCase.label).toContain(
          'manuscript-ending-hook-question-too-broad'
        );
      } else {
        expect(codes, holdoutCase.label).not.toContain(
          'manuscript-ending-hook-question-too-broad'
        );
      }
    }
  });

  it('fails when the manuscript ending hook lacks protagonist reaction at the chapter break', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은 땀을 끌어올렸다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지는 미제 사건 번호 뒤에 더 깊이 숨었다. 피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서도 가족 실종 파일 번호로 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-ending-hook-reaction-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-ending-hook-reaction-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('protagonist reaction'),
        }),
      ])
    );
  });

  it('fails when the manuscript final twist imports a reveal without earlier setup clues', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선의 조명을 꺼뜨리고 현장 문을 잠갔고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자 그는 화면을 더 세게 쥐었다.',
        '그 순간 피해자의 휴대폰에 남은 형사의 목소리 녹음이 예고 앱 개발자 계정의 통화 기록과 같은 음성으로 겹치며 형사가 앱 개발자였다는 정체가 드러났고, 그는 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-fair-twist-setup-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-fair-twist-setup-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('fair twist'),
        }),
      ])
    );
  });

  it('fails when the final cliffhanger imports a new hook anchor without earlier setup clues', () => {
    const unseededEnding =
      '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되며 교회 지하 좌표와 어린아이 사진이 다음 표적으로 떠오른다.';
    const chapterWithUnseededEnding = {
      ...alignedChapter,
      reader_experience: {
        ...alignedChapter.reader_experience,
        must_click_ending: unseededEnding,
      },
      scenes: [
        alignedChapter.scenes[0],
        {
          ...alignedChapter.scenes[1],
          beat: `${unseededEnding} 그는 피해자의 휴대폰을 움켜쥔 채 가슴이 조였고, 왜 낯선 좌표와 사진이 지금 표적으로 뜨는지 확인하려 화면을 다시 눌렀다.`,
        },
      ],
    };
    const plotWithUnseededEnding = {
      ...plot,
      per_chapter_guide: [
        {
          ...guide,
          fun_spec: {
            ...guide.fun_spec,
            must_click_ending: unseededEnding,
          },
        },
      ],
    };
    const result = evaluateEngagementContract({
      design,
      plot: plotWithUnseededEnding,
      chapter: chapterWithUnseededEnding,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '그 일치는 단순한 번호 확인이 아니라, 앱이 가족 실종 파일의 미제 번호를 현재 사건 기록에 덧씌운다는 뜻으로 굳어졌다. 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 남았고, 그는 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 더 큰 미해결 질문 앞에 멈췄다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되며 교회 지하 좌표와 어린아이 사진이 다음 표적으로 떠오르자, 그는 화면을 쥔 채 숨이 막혀 왜 낯선 좌표와 사진이 지금 표적으로 뜨는지 확인하려 손끝으로 화면을 다시 눌렀다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-ending-hook-setup-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-ending-hook-setup-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('ending hook setup'),
        }),
      ])
    );
  });

  it('fails chapter 1 when manuscript opening does not stage the core hook or novelty angle', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '# 첫 번째 알림',
        '',
        '주인공은 평범한 아침 식사를 하며 비 오는 창밖을 오래 바라보았다.',
        '',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 주인공은 현장으로 뛰쳐나갔다.',
        '',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('opening-hook-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'opening-hook-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: design.reader_promise_contract.core_hook,
        }),
      ])
    );
  });

  it('fails chapter 1 when the opening hook is delayed past the first sentence', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '주인공은 평범한 아침 식사를 하며 비 오는 창밖을 오래 바라보았다. 살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였고, 앱이 아직 일어나지 않은 살인을 예보한다는 문장이 떠올랐다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은 땀을 끌어올렸다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서도 가족 실종 파일 번호로 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('opening-hook-delayed');
    expect(issueCodes(result.issues)).not.toContain('opening-hook-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'opening-hook-delayed',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('first sentence'),
        }),
      ])
    );
  });

  it('fails chapter 1 when the first-screen hook names the premise without embodied pressure', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱이 아직 일어나지 않은 살인을 예보한다. 앱은 왜 주인공에게만 첫 알림을 보냈고 실제 살인을 어떻게 알았는가라는 질문이 남는다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은 땀을 끌어올렸다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서도 가족 실종 파일 번호로 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('opening-hook-not-embodied');
    expect(issueCodes(result.issues)).not.toContain('opening-hook-not-evidenced');
    expect(issueCodes(result.issues)).not.toContain('opening-hook-delayed');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'opening-hook-not-embodied',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('first-screen hook embodiment'),
        }),
      ])
    );
  });

  it('fails later chapters when the opening starts as recap instead of live momentum', () => {
    const chapterTwo = {
      ...alignedChapter,
      chapter_number: 2,
    };
    const plotForChapterTwo = {
      ...plot,
      per_chapter_guide: [
        {
          ...guide,
          chapter: 2,
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: plotForChapterTwo,
      chapter: chapterTwo,
      manuscript: [
        '지난 사건을 정리하면 예고 앱과 피해자 휴대폰 사이에 여러 단서가 있었다. 이전 회차의 현장 기록은 차분히 이어졌고, 주인공은 아직 일어나지 않은 살인을 예보한 앱을 다시 떠올렸다.',
        '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 했던 순간을 되짚은 그는 공포보다 패턴을 먼저 읽고 경찰 신고보다 현장 도착 시간을 계산해 뛰쳐나갔다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 손바닥의 땀과 목덜미를 조이는 감각으로 분명해졌다. 매 회차 작은 규칙 증명이라는 보상 주기도 현장 실패의 결과로 남았다.',
        '왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지는 미제 사건 번호 뒤에 더 깊이 숨었다. 피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서도 가족 실종 파일 번호로 남았으며, 그는 화면을 쥔 채 숨을 삼켰다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-opening-momentum-not-evidenced');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-opening-momentum-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('opening momentum'),
        }),
      ])
    );
  });

  it('fails when manuscript prose does not stage protagonist appeal as action or cost', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리고, 앱이 아직 일어나지 않은 살인을 예보한다는 사실이 드러났다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명은 피해자 발견으로 확인되었고, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 커졌다.',
        '주인공은 주변의 설명을 들은 뒤 사건이 심각하다고 받아들였다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-appeal-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-appeal-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: guide.fun_spec.character_appeal_moment,
        }),
      ])
    );
  });

  it('fails when manuscript names protagonist appeal but does not fuse method, cost, and reaction', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 화면을 오래 바라봤다.',
        '그는 패턴을 먼저 읽고 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명은 현장 기록과 피해자 휴대폰 로그로 확인되었다.',
        '한참 뒤 신고를 미룬 대가와 사라진 알리바이 기록이 문제가 되었지만, 그 비용은 주인공의 선택 순간과 분리된 설명으로 남았다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-character-appeal-signature-not-evidenced'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-appeal-signature-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('character appeal signature'),
        }),
      ])
    );
  });

  it('fails when manuscript prose makes the protagonist passive despite matching the appeal keywords', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰이 손바닥에서 짧게 진동했다. 장난과 현장의 위험 사이에서 모두가 주인공을 밀어붙였다.',
        '보고서에는 주인공이 공포보다 패턴을 먼저 읽고 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나간다고 적혀 있었다.',
        '형사가 계산한 시간을 내밀자 그는 복도 불빛 아래에서 주소가 적힌 종이를 쥔 채 떠밀려 나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 동시에 올라왔다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-protagonist-agency-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-protagonist-agency-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('choice/action/cost'),
        }),
      ])
    );
  });

  it('fails when protagonist action has no explicit choice tradeoff on page', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 위험을 감수하고 현장으로 가기로 결정했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-choice-tradeoff-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-choice-tradeoff-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('choice tradeoff'),
        }),
      ])
    );
  });

  it('fails when a sacrificed choice cost does not constrain the next beat', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 경찰에 신고하고 알리바이를 남길지, 신고 기록과 알리바이를 포기하고 현장으로 달릴지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 신고 기록과 알리바이를 포기하고 현장 도착 시간을 계산했고, 피해자의 목숨을 구하려 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하러 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 범인이 철문을 안쪽에서 잠가 현장 실패가 첫 피해자의 사망 시각을 확정하며 상황을 되돌릴 수 없게 바꿨다.',
        '하지만 그 뒤 경찰이나 알리바이는 아무 장벽이 되지 않았고, 포기한 신고 기록도 다음 선택지를 좁히지 않은 채 그는 원래처럼 현장 기록의 빈칸과 피해자의 휴대폰 로그를 대조했다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-choice-cost-carryover-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-choice-cost-carryover-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('choice cost carryover'),
        }),
      ])
    );
  });

  it('fails when manuscript choice cost carries pressure but does not lock future options', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 경찰에 신고하고 알리바이를 남길지, 신고 기록과 알리바이를 포기하고 현장으로 달릴지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 그 선택을 감수한 채 현장 도착 시간을 계산했고, 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '그 대가로 경찰의 의심이 따라붙고 다음 압박이 생겼다. 하지만 범인이 통제선 앞에서 그를 가로막자, 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패로 범인이 눈치챘고 새 위협이 따라붙었다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-choice-cost-lock-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-choice-cost-lock-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('choice-cost lock'),
        }),
      ])
    );
  });

  it('fails when protagonist stakes are not clear before the action turns irreversible', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 대상을 찾으려 하자 통제선의 조명이 꺼졌고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 검은 시각표와 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-stakes-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-stakes-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('stakes clarity'),
        }),
      ])
    );
  });

  it('fails when generic victims or targets are never personalized before the threat turns irreversible', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 현장 기록을 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 검은 시각표가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 화면을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 사망 시각과 함께 눈앞에서 굳어졌다.',
        '새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-stakes-subject-not-personalized'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-stakes-subject-not-personalized',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('stakes subject specificity'),
        }),
      ])
    );
  });

  it('fails when scene pressure has no active opposing will behind it', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였다. 앱이 아직 일어나지 않은 살인을 예보한다는 문장을 확인한 그는 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산했고, 첫 피해자의 목숨을 잃지 않게 하려 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다. 경찰 신고를 택하면 현장 도착이 늦고, 현장을 택하면 신고 기록과 알리바이를 포기해야 했다.',
        '제한 시간 안에 피해자를 찾으려 하자 그 순간 통제선의 조명이 꺼졌고, 그는 잠긴 문 앞에서 현장 주소와 피해자의 휴대폰 로그를 다시 확인했다.',
        '엘리베이터가 멈추고 카운트다운이 절반을 잃은 뒤, 현장 실패가 첫 피해자의 사망 시각을 확정하며 상황을 되돌릴 수 없게 바꿨다. 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은땀을 끌어올렸다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았고, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-active-opposition-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-active-opposition-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('active opposition'),
        }),
      ])
    );
  });

  it('fails when manuscript prose gives the protagonist agency without on-page pressure or obstacles', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였다. 앱이 아직 일어나지 않은 살인을 예보한다는 문장을 확인한 그는 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다. 복도 형광등 아래에서 신발끈을 조여 묶고 엘리베이터 버튼을 눌렀다.',
        '제한 시간 안에 피해자를 찾으려 하며 현장 주소를 다시 쥐었다. 현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명처럼 보였다.',
        '단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 올라왔다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-pressure-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-pressure-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('pressure/obstacle'),
        }),
      ])
    );
  });

  it('fails when a pressure reversal does not force tactical adaptation', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였다. 앱이 아직 일어나지 않은 살인을 예보한다는 문장을 확인한 그는 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산했고, 첫 피해자의 목숨을 잃지 않게 하려 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다. 경찰 신고를 택하면 현장 도착이 늦고, 현장을 택하면 신고 기록과 알리바이를 포기해야 했다.',
        '범인이 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠그자, 제한 시간은 절반으로 줄었고 막힌 문턱 앞 현장 실패가 첫 피해자의 사망 시각을 확정하며 상황을 되돌릴 수 없게 바꿨다.',
        '그 대가로 경찰은 포기한 신고 기록과 알리바이를 추궁했고, 현장 통제선 안으로 들어갈 선택지는 더 좁혀졌다.',
        '하지만 그는 전술을 바꾸지 않았고 우회하지도 않았으며, 처음 계획대로 잠긴 문 앞에서 현장 기록의 빈칸과 피해자의 휴대폰 로그를 대조했다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았고, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-tactical-adaptation-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-tactical-adaptation-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('tactical adaptation'),
        }),
      ])
    );
  });

  it('fails when manuscript pressure does not create a concrete consequence or escalation', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였다. 앱이 아직 일어나지 않은 살인을 예보한다는 문장을 확인한 그는 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다. 복도 형광등 아래에서 신발끈을 조여 묶고 엘리베이터 버튼을 눌렀다.',
        '제한 시간 안에 피해자를 찾으려 하자 그 순간 통제선의 조명이 꺼졌고, 그는 잠긴 문 앞에서 현장 주소와 피해자의 휴대폰 로그를 다시 확인했다.',
        '단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은 땀을 끌어올렸다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 확인 절차 속에서 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-consequence-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-consequence-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('consequence/escalation'),
        }),
      ])
    );
  });

  it('fails when manuscript prose does not deliver the promised emotional payoff', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리고, 앱이 아직 일어나지 않은 살인을 예보한다는 사실이 드러났다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명은 절차적으로 확인되었다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-payoff-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-payoff-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: design.reader_promise_contract.emotional_payoff,
        }),
      ])
    );
  });

  it('fails when manuscript prose names the emotional payoff without embodying it on page', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였다. 앱이 아직 일어나지 않은 살인을 예보한다는 문장을 확인한 그는 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다. 복도 형광등 아래에서 신발끈을 조여 묶고 엘리베이터 버튼을 눌렀다.',
        '제한 시간 안에 피해자를 찾으려 하지만 통제선의 조명이 꺼졌다. 현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명처럼 보였다.',
        '단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 있었다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-payoff-embodiment-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-payoff-embodiment-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('embodied emotional payoff'),
        }),
      ])
    );
  });

  it('fails when genre-specific emotional payoff is named without embodiment', () => {
    const romancePayoff = '달콤한 연애 설렘과 관계 회복의 따뜻함';
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          emotional_payoff: romancePayoff,
        },
      },
      plot,
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          promise_fulfillment: [
            '살인을 예고하는 앱이 주인공의 이름을 첫 번째 수신자로 지목하고, 아직 일어나지 않은 살인을 예보한다.',
            romancePayoff,
            '예고 앱의 개발자, 과거 미제 사건, 주인공 가족의 실종이 하나의 장기 미스터리로 수렴한다.',
          ].join(' '),
        },
        scenes: [
          {
            ...alignedChapter.scenes[0],
            beat: `${alignedChapter.scenes[0].beat} ${romancePayoff}.`,
          },
          alignedChapter.scenes[1],
        ],
      },
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였다. 앱이 아직 일어나지 않은 살인을 예보한다는 문장을 확인한 그는 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다. 복도 형광등 아래에서 신발끈을 조여 묶고 엘리베이터 버튼을 눌렀다.',
        '제한 시간 안에 피해자를 찾으려 하지만 통제선의 조명이 꺼졌다. 현장 기록의 빈칸과 피해자의 휴대폰 로그를 확인하자 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명처럼 보였다.',
        '달콤한 연애 설렘과 관계 회복의 따뜻함이 있었다. 매 회차 작은 규칙 증명, 3회마다 큰 반전이라는 리듬은 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-payoff-embodiment-not-evidenced');
  });

  it('fails when genre-specific delight is embodied generically but not as romance interaction', () => {
    const romancePayoff = '달콤한 연애 설렘과 관계 회복의 따뜻함';
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          emotional_payoff: romancePayoff,
        },
      },
      plot,
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          promise_fulfillment: [
            '살인을 예고하는 앱이 주인공의 이름을 첫 번째 수신자로 지목하고, 아직 일어나지 않은 살인을 예보한다.',
            romancePayoff,
            '예고 앱의 개발자, 과거 미제 사건, 주인공 가족의 실종이 하나의 장기 미스터리로 수렴한다.',
          ].join(' '),
        },
        scenes: [
          {
            ...alignedChapter.scenes[0],
            beat: `${alignedChapter.scenes[0].beat} ${romancePayoff}이 장르 보상으로 붙는다.`,
          },
          alignedChapter.scenes[1],
        ],
      },
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 달콤한 연애 설렘과 관계 회복의 따뜻함이 가슴을 두드리고 손바닥을 뜨겁게 했다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-genre-delight-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-genre-delight-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('genre-specific delight'),
        }),
      ])
    );
  });

  it('fails when fantasy genre delight lacks rule manifestation and cost', () => {
    const fantasyPayoff = '금지된 마법 규칙을 깨닫는 판타지 각성 카타르시스';
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          emotional_payoff: fantasyPayoff,
        },
      },
      plot,
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          promise_fulfillment: [
            '살인을 예고하는 앱이 주인공의 이름을 첫 번째 수신자로 지목하고, 아직 일어나지 않은 살인을 예보한다.',
            fantasyPayoff,
            '예고 앱의 개발자, 과거 미제 사건, 주인공 가족의 실종이 하나의 장기 미스터리로 수렴한다.',
          ].join(' '),
        },
        scenes: [
          {
            ...alignedChapter.scenes[0],
            beat: `${alignedChapter.scenes[0].beat} ${fantasyPayoff}가 장르 보상으로 붙는다.`,
          },
          alignedChapter.scenes[1],
        ],
      },
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 금지된 마법 규칙을 깨닫는 판타지 각성 카타르시스가 목덜미를 조이고 손바닥을 뜨겁게 했다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-genre-delight-not-evidenced');
  });

  it('fails when action genre delight is named without kinetic reversal mechanics', () => {
    const actionPayoff = '압도적인 액션 추격과 반격 카타르시스';
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          emotional_payoff: actionPayoff,
        },
      },
      plot,
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          promise_fulfillment: [
            '살인을 예고하는 앱이 주인공의 이름을 첫 번째 수신자로 지목하고, 아직 일어나지 않은 살인을 예보한다.',
            actionPayoff,
            '예고 앱의 개발자, 과거 미제 사건, 주인공 가족의 실종이 하나의 장기 미스터리로 수렴한다.',
          ].join(' '),
        },
        scenes: [
          {
            ...alignedChapter.scenes[0],
            beat: `${alignedChapter.scenes[0].beat} ${actionPayoff}가 장르 보상으로 붙는다.`,
          },
          alignedChapter.scenes[1],
        ],
      },
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 압도적인 액션 추격과 반격 카타르시스가 목덜미를 조이고 심장을 뛰게 했다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-genre-delight-not-evidenced',
          actual: expect.stringContaining('genre delight profile=action'),
        }),
      ])
    );
  });

  it('fails when thriller genre delight is only mood without trap escalation', () => {
    const thrillerPayoff = '숨 막히는 스릴러 압박과 반전 공포';
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          emotional_payoff: thrillerPayoff,
        },
      },
      plot,
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          promise_fulfillment: [
            '살인을 예고하는 앱이 주인공의 이름을 첫 번째 수신자로 지목하고, 아직 일어나지 않은 살인을 예보한다.',
            thrillerPayoff,
            '예고 앱의 개발자, 과거 미제 사건, 주인공 가족의 실종이 하나의 장기 미스터리로 수렴한다.',
          ].join(' '),
        },
        scenes: [
          {
            ...alignedChapter.scenes[0],
            beat: `${alignedChapter.scenes[0].beat} ${thrillerPayoff}가 장르 보상으로 붙는다.`,
          },
          alignedChapter.scenes[1],
        ],
      },
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였다. 앱이 아직 일어나지 않은 살인을 예보한다는 문장을 확인한 그는 현장으로 향했다.',
        '공포보다 패턴을 먼저 읽은 주인공은 피해자의 이름과 주소를 대조하고 사람을 구하려 뛰쳐나갔다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그를 확인하자 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명처럼 보였다.',
        '숨 막히는 스릴러 압박과 반전 공포가 목덜미를 조이고 손바닥을 축축하게 했다. 그러나 압박은 분위기로만 남았고, 구체적인 장면 변화는 아직 없었다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-genre-delight-not-evidenced',
          actual: expect.stringContaining('genre delight profile=thriller'),
        }),
      ])
    );
  });

  it('fails when modern-fantasy delight lacks system feedback and real-world consequence', () => {
    const modernFantasyPayoff = '현대판타지 시스템 각성의 성장 카타르시스';
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          emotional_payoff: modernFantasyPayoff,
        },
      },
      plot,
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          promise_fulfillment: [
            '살인을 예고하는 앱이 주인공의 이름을 첫 번째 수신자로 지목하고, 아직 일어나지 않은 살인을 예보한다.',
            modernFantasyPayoff,
            '예고 앱의 개발자, 과거 미제 사건, 주인공 가족의 실종이 하나의 장기 미스터리로 수렴한다.',
          ].join(' '),
        },
        scenes: [
          {
            ...alignedChapter.scenes[0],
            beat: `${alignedChapter.scenes[0].beat} ${modernFantasyPayoff}가 장르 보상으로 붙는다.`,
          },
          alignedChapter.scenes[1],
        ],
      },
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 현대판타지 시스템 각성의 성장 카타르시스가 목덜미를 조이고 손바닥을 뜨겁게 했다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-genre-delight-not-evidenced',
          actual: expect.stringContaining('genre delight profile=modern-fantasy'),
        }),
      ])
    );
  });

  it('fails when manuscript prose omits plot long-hook thread evidence', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리고, 앱이 아직 일어나지 않은 살인을 예보한다는 사실이 드러났다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명으로 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 커졌다. 매 회차 작은 규칙 증명이라는 보상 주기도 유지된다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-long-hook-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-long-hook-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: plot.binge_architecture.long_hook_threads.join(' / '),
        }),
      ])
    );
  });

  it('fails when manuscript long-hook evidence is only abstract connection without a concrete clue', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리자 휴대폰 화면이 파란빛으로 번쩍였다. 앱이 아직 일어나지 않은 살인을 예보한다는 문장을 확인한 그는 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 현장 도착이 늦은 대가로 피해자는 이미 쓰러졌으며 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 가능성은 회의 자료에 막연히 정리되어 있었다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은 땀을 끌어올렸다. 매 회차 작은 규칙 증명이라는 보상 주기는 현장 실패의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-long-hook-clue-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-long-hook-clue-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('concrete clue'),
        }),
      ])
    );
  });

  it('fails when manuscript long-hook evidence repeats a concrete clue without advancing the thread', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 사람을 구하려 사무실 복도 끝에서 엘리베이터 버튼을 눌렀다가 지하보도 입구까지 젖은 계단을 내려가며 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없었다. 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 앞 조명을 꺼뜨리고 현장 철문을 안쪽에서 잠갔고, 막힌 문턱 앞에서 그는 엘리베이터 계획을 접고 비상계단으로 우회해 피해자의 휴대폰 로그를 단서로 다음 행동을 바꿨다. 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '복도는 조용했고 그는 잠깐 화면의 밝기만 낮췄다.',
        '예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에 여전히 남아 있었고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 여전히 남아 있었다.',
        '그는 책상 위 휴대폰을 덮고 숨을 골랐다.',
        '피해자의 휴대폰에서 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박였고, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-long-hook-thread-not-advanced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-long-hook-thread-not-advanced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('long_hook_thread advancement'),
        }),
      ])
    );
  });

  it('fails when manuscript prose omits the plot payoff cadence signal', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울리고, 앱이 아직 일어나지 않은 살인을 예보한다는 사실이 드러났다.',
        '공포보다 패턴을 먼저 읽은 주인공은 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갔다.',
        '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명으로 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 커졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서가 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('manuscript-payoff-cadence-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-payoff-cadence-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: plot.binge_architecture.payoff_cadence,
        }),
      ])
    );
  });

  it('fails when manuscript prose does not execute the declared drop-off mitigation strategy', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 했다.',
        '제한 시간 안에 피해자를 찾으려 하자 통제선의 조명이 꺼졌고, 쓰러진 피해자 때문에 상황은 되돌릴 수 없게 바뀌었다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조이고 손바닥에 식은 땀을 끌어올렸다. 매 회차 작은 규칙 증명이라는 보상 주기는 첫 피해의 결과로 분명해졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다. 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족의 실종이 예고 앱의 장기 미스터리로 수렴한다는 단서도 가족 실종 파일 번호로 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('manuscript-drop-off-mitigation-not-evidenced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-drop-off-mitigation-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('drop_off_risk'),
        }),
      ])
    );
  });

  it('fails when reader experience claims are not staged by scene conflict and ending beats', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            scene_number: 1,
            purpose: '주인공의 하루를 차분히 보여준다.',
            conflict: '특별한 갈등은 없다.',
            beat: '주인공은 퇴근하고 집으로 돌아간다.',
          },
          {
            scene_number: 2,
            purpose: '분위기를 정리한다.',
            conflict: '',
            beat: '주인공은 잠시 쉬기로 한다.',
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toEqual(
      expect.arrayContaining([
        'weak-scene-conflict',
        'must-click-ending-not-staged',
      ])
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(70);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'weak-scene-conflict',
          priority: 'high',
          target: 'scenes',
        }),
        expect.objectContaining({
          code: 'must-click-ending-not-staged',
          priority: 'critical',
          target: 'final_scene',
          expected: guide.fun_spec.must_click_ending,
        }),
      ])
    );
  });

  it('fails when the final scene does not stage the clue that earns the page-turn question', () => {
    const unstagedPageTurnQuestion =
      '앱 개발자는 왜 서고 7층의 붉은 열쇠를 피해자 지갑에 숨겼는가?';
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          irresistible_question: unstagedPageTurnQuestion,
        },
      },
      plot: {
        ...plot,
        per_chapter_guide: [
          {
            ...guide,
            fun_spec: {
              ...guide.fun_spec,
              page_turn_question: unstagedPageTurnQuestion,
            },
          },
        ],
      },
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          page_turner_question: unstagedPageTurnQuestion,
        },
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('page-turn-question-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'page-turn-question-not-staged',
          priority: 'critical',
          target: 'final_scene',
          expected: expect.stringContaining('page_turner_question'),
        }),
      ])
    );
  });

  it('fails when the final scene hook is information-only without protagonist reaction', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          alignedChapter.scenes[0],
          {
            ...alignedChapter.scenes[1],
            beat: guide.fun_spec.must_click_ending,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('ending-hook-reaction-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'ending-hook-reaction-not-staged',
          priority: 'critical',
          target: 'final_scene',
          expected: expect.stringContaining('protagonist reaction'),
        }),
      ])
    );
  });

  it('fails when concrete scenes are not causally chained into escalation', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          alignedChapter.scenes[0],
          {
            ...alignedChapter.scenes[1],
            purpose: '다른 장소에서 새 단서를 확인한다.',
            conflict: '주인공은 기록을 공개할지 숨길지 선택해야 한다.',
            beat: `${guide.fun_spec.must_click_ending} 그는 피해자의 휴대폰을 움켜쥔 채 가슴이 조였고, 다음 수신자로 깜박이는 자기 이름을 확인하려 화면을 다시 눌렀다.`,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('scene-causal-escalation-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'scene-causal-escalation-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('adjacent scene cause-effect escalation'),
        }),
      ])
    );
  });

  it('fails when scene evidence is abstract metadata despite matching engagement keywords', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            scene_number: 1,
            purpose: '예고 앱의 첫 알림과 독자 몰입을 설명한다.',
            conflict: '장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 한다는 장면 갈등이다.',
            beat: [
              '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명이라는 흥미로운 사건과 반전이 있다.',
              '주인공이 공포보다 패턴을 먼저 읽고 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나간다는 주인공 매력을 설명한다.',
              '앱 설명이 길어질 위험은 알림, 이동, 현장 실패 순서로 규칙을 행동으로 보여주는 방식으로 처리된다.',
            ].join(' '),
          },
          {
            scene_number: 2,
            purpose: '앱 예고와 must-click ending을 정리한다.',
            conflict: '주인공은 제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼진다는 위기다.',
            beat: `${guide.fun_spec.must_click_ending}라는 회차 말미 연속 클릭 이유와 큰 비밀을 제시한다.`,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('scene-evidence-generic');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'scene-evidence-generic',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('concrete scene execution'),
        }),
      ])
    );
  });

  it('fails when scene evidence has action and outcomes but no choice-cost tradeoff', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            scene_number: 1,
            purpose: '예고 앱의 첫 알림과 주인공의 현장 진입을 제시한다.',
            conflict:
              '주인공은 제한 시간 안에 피해자 휴대폰 로그를 따라 현장으로 달려야 하지만 경찰 통제선과 꺼지는 조명이 길을 막는다.',
            beat: [
              '주인공이 경찰 신고보다 현장 도착 시간을 계산해 뛰쳐나간다.',
              '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 발견하고, 현장 기록과 피해자 사망 시각이 일치해 상황이 되돌릴 수 없게 바뀐다.',
              '알림, 이동, 현장 실패 순서로 규칙을 행동으로 보여준다.',
              '예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종 단서가 장기 미스터리로 남는다.',
            ].join(' '),
          },
          {
            scene_number: 2,
            purpose: '앱 예고가 실제 사건과 연결됨을 증명한다.',
            conflict:
              '주인공은 제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼지고 통제선이 닫힌다.',
            beat: guide.fun_spec.must_click_ending,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('scene-choice-tradeoff-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'scene-choice-tradeoff-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('choice-cost tradeoff'),
        }),
      ])
    );
  });

  it('fails when scene choice cost does not lock future story options', () => {
    const unlockedChoiceChapter = {
      ...alignedChapter,
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            '주인공은 경찰에 신고해 알리바이를 남길지, 신고 기록과 알리바이를 포기하고 현장으로 갈지 선택해야 한다.',
          beat:
            '파란 휴대폰 화면이 젖은 계단 위에서 깜박이자 그는 난간을 쥐고 신고 기록과 알리바이를 포기한 채 현장으로 뛰쳐나간다. 그 대가로 공식 신고 기록이 남지 않는 손실을 감수하고 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인한다.',
        },
        {
          ...alignedChapter.scenes[1],
          conflict:
            '신고를 미룬 대가로 경찰의 의심이 따라붙지만 그는 피해자 휴대폰 로그를 확인하려 한다.',
          beat:
            `${guide.fun_spec.must_click_ending} 경찰의 의심이 다음 압박으로 남고, 그는 피해자의 휴대폰을 움켜쥔 채 화면을 다시 눌렀다.`,
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: unlockedChoiceChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('scene-choice-cost-lock-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'scene-choice-cost-lock-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('choice-cost lock'),
        }),
      ])
    );
  });

  it('fails when scene conflicts are vague internal feelings without pressure or obstacles', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            scene_number: 1,
            purpose: '예고 앱의 첫 알림과 주인공의 반응을 제시한다.',
            conflict: '주인공은 사건 앞에서 내적 갈등을 느끼고 불안해한다.',
            beat: [
              '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명',
              '주인공이 공포보다 패턴을 먼저 읽고 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나간다.',
              '알림, 이동, 현장 실패 순서로 규칙을 행동으로 보여준다.',
            ].join(' '),
          },
          {
            scene_number: 2,
            purpose: '앱 예고가 실제 사건과 연결됨을 증명한다.',
            conflict: '주인공은 다음 선택을 고민하며 긴장한다.',
            beat: guide.fun_spec.must_click_ending,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('weak-scene-conflict');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'weak-scene-conflict',
          priority: 'high',
          target: 'scenes',
          expected: expect.stringContaining('concrete conflict'),
        }),
      ])
    );
  });

  it('fails when scene pressure is only passive obstacles without active opposition', () => {
    const passivePressureChapter = {
      ...alignedChapter,
      scenes: [
        {
          scene_number: 1,
          purpose: '예고 앱의 첫 알림과 주인공의 반응을 제시한다.',
          conflict:
            '장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 제한 시간 안에 현장으로 갈지 선택해야 한다.',
          beat: [
            '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명',
            '주인공이 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나간다.',
            '신고를 미룬 대가로 알리바이 선택지가 닫히고 공식 신고 기록이 사라져 그는 더는 안전한 제보자로 돌아갈 수 없다.',
          ].join(' '),
        },
        {
          scene_number: 2,
          purpose: '앱 예고가 실제 사건과 연결됨을 증명한다.',
          conflict:
            '주인공은 제한 시간 안에 피해자를 찾으려 하지만 통제선 조명이 꺼지고 현장 문이 잠긴다.',
          beat: [
            '엘리베이터가 멈추고 카운트다운이 절반을 잃은 뒤 현장 실패가 첫 피해자의 사망 시각을 확정한다.',
            '그 결과 상황은 되돌릴 수 없게 바뀌고, 피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 깜박인다.',
          ].join(' '),
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: passivePressureChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('scene-active-opposition-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'scene-active-opposition-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('scene active opposition'),
        }),
      ])
    );
  });

  it('fails when scenes change state without protagonist goal-tactic movement', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            scene_number: 1,
            purpose: '예고 앱의 첫 알림과 사건 규칙을 제시한다.',
            conflict:
              '내부자가 앱 로그를 조작해 통제선을 닫고 현장 기록을 삭제한 탓에 제보 기록과 현장 동선이 동시에 막힌다.',
            beat: [
              '그 결과 앱 알림과 피해자 사망 시각이 맞아떨어지고 첫 규칙이 확정된다.',
              '공식 제보 기록이 사라져 안전 경로가 닫히고, 현장 문이 잠긴 채 새 위협이 드러난다.',
            ].join(' '),
          },
          {
            scene_number: 2,
            purpose: '앱 예고가 실제 사건과 연결됨을 증명한다.',
            conflict:
              '누군가 피해자 로그를 빼앗고 통제선 조명을 꺼뜨린 탓에 현재 사건 기록과 과거 미제 사건 번호가 충돌한다.',
            beat: [
              '직후 과거 미제 사건 번호와 현재 사건 기록이 연결되고 다음 수신자가 확정된다.',
              '그 결과 관계가 불신으로 기울고 위험이 커지며 새 알림이 떠오른다.',
            ].join(' '),
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('scene-goal-tactic-turn-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'scene-goal-tactic-turn-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('goal-tactic turn'),
        }),
      ])
    );
  });

  it('fails when scene beats are static observation without outcome or escalation', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            scene_number: 1,
            purpose: '예고 앱의 첫 알림과 주인공의 반응을 제시한다.',
            conflict: '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 한다.',
            beat: [
              '피해자의 휴대폰 로그와 현장 기록을 확인하고 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명처럼 보이는 자료를 비교해 둔다.',
              '주인공은 공포보다 패턴을 먼저 읽고 경찰 신고보다 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나갈 계획을 세워 둔다.',
              '알림, 이동, 현장 실패 순서를 메모해 둔다.',
            ].join(' '),
          },
          {
            scene_number: 2,
            purpose: '앱 예고가 실제 사건과 연결됨을 증명한다.',
            conflict: '주인공은 제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼진다.',
            beat: [
              '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다는 내용을 현장 기록과 대조해 둔다.',
              '예고 앱의 개발자와 과거 미제 사건의 연결, 주인공 가족의 실종 단서를 파일명으로 적어 둔다.',
            ].join(' '),
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('weak-scene-turn');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'weak-scene-turn',
          priority: 'high',
          target: 'scenes',
          expected: expect.stringContaining('concrete scene turn'),
        }),
      ])
    );
  });

  it('fails when scene turns confirm facts without a before/after story-state delta', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            scene_number: 1,
            purpose: '예고 앱의 첫 알림과 주인공의 반응을 제시한다.',
            conflict:
              '장난으로 넘길지, 경찰에 신고해 알리바이를 남길지, 위험을 감수하고 현장으로 갈지 선택해야 한다.',
            beat: [
              '피해자의 휴대폰 로그와 현장 기록이 일치하고 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 발견한다.',
              '주인공은 경찰 신고보다 현장 도착 시간을 계산해 뛰쳐나가며 알림, 이동, 현장 실패 순서를 행동으로 보여준다.',
              '단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감을 만든다.',
            ].join(' '),
          },
          {
            scene_number: 2,
            purpose: '현장 실패 직후 앱 예고가 실제 사건과 연결됨을 증명한다.',
            conflict:
              '주인공은 제한 시간 안에 피해자를 찾으려 하지만 누군가 통제선 조명을 꺼뜨리고 현장 기록을 숨긴 탓에 피해자 휴대폰만 남는다.',
            beat: `현장 실패 직후 ${guide.fun_spec.must_click_ending} 그는 피해자의 휴대폰을 움켜쥔 채 가슴이 조였고, 다음 수신자로 깜박이는 자기 이름을 확인하려 화면을 다시 눌렀다.`,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('scene-state-delta-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'scene-state-delta-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('story-state delta'),
        }),
      ])
    );
  });

  it('fails when chapter reward and drop-off prevention are only metadata claims', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            scene_number: 1,
            purpose: '주인공이 사건 자료를 다시 정리한다.',
            conflict: '증거를 공개할지 숨길지 조력자와 충돌한다.',
            beat: '조력자가 보관 장소를 바꾸며 둘 사이의 신뢰가 흔들린다.',
          },
          {
            scene_number: 2,
            purpose: '다음 표적을 확인하며 위기를 확장한다.',
            conflict: '주인공은 제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼진다.',
            beat: guide.fun_spec.must_click_ending,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toEqual(
      expect.arrayContaining([
        'chapter-reward-not-staged',
        'drop-off-risk-not-mitigated',
      ])
    );
    expect(result.breakdown.sceneMomentum).toBeLessThanOrEqual(55);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'chapter-reward-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: guide.fun_spec.reader_reward,
        }),
        expect.objectContaining({
          code: 'drop-off-risk-not-mitigated',
          priority: 'high',
          target: 'scenes',
        }),
      ])
    );
  });

  it('fails when protagonist appeal is only a metadata claim', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            scene_number: 1,
            purpose: '예고 앱의 첫 알림과 사건 규칙을 제시한다.',
            conflict: '알림 시간이 줄어드는 동안 현장 통제선이 닫히려 한다.',
            beat: '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명, 알림-이동-현장 실패 순서로 규칙을 행동으로 보여준다.',
          },
          {
            scene_number: 2,
            purpose: '앱 예고가 실제 사건과 연결됨을 증명한다.',
            conflict: '주인공은 제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼진다.',
            beat: guide.fun_spec.must_click_ending,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('character-appeal-not-staged');
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'character-appeal-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: guide.fun_spec.character_appeal_moment,
        }),
      ])
    );
  });

  it('fails when protagonist appeal lacks a signature character action in scene evidence', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        scenes: [
          {
            ...alignedChapter.scenes[0],
            conflict: '앱 알림 시간이 줄어드는 동안 주인공은 현장으로 향할 준비를 한다.',
            beat:
              '주인공이 패턴을 먼저 읽고 현장 도착 시간을 계산해 사람을 구하려 뛰쳐나간다. 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명, 알림-이동-현장 도착 순서로 규칙을 행동으로 보여준다.',
          },
          alignedChapter.scenes[1],
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'character-appeal-signature-not-staged'
    );
    expect(result.breakdown.sceneMomentum).toBeLessThan(85);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'character-appeal-signature-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('character appeal signature'),
        }),
      ])
    );
  });

  it('fails when the chapter abandons the design protagonist appeal', () => {
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          protagonist_appeal: '냉혹한 권력욕으로 모두를 속이는 반영웅성',
        },
      },
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('protagonist-appeal-drift');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'protagonist-appeal-drift',
          priority: 'critical',
          target: 'plot_strategy',
          expected: '냉혹한 권력욕으로 모두를 속이는 반영웅성',
        }),
      ])
    );
  });

  it('fails when the design reader promise contract is too generic to guide a masterpiece workflow', () => {
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          core_hook: '흥미로운 사건과 반전이 이어지는 이야기',
          irresistible_question: '앞으로 어떤 일이 벌어질까?',
          protagonist_appeal: '매력적이고 성장하는 주인공',
          novelty_angle: '새롭고 독특한 분위기',
          emotional_payoff: '재미와 감동',
          binge_reason: '다음 화가 궁금해진다',
          long_series_engine: '큰 비밀이 이어지는 장기 서사',
          first_five_chapter_retention_plan: [
            '1화: 흥미로운 시작',
            '2화: 새로운 사건',
            '3화: 반전',
            '4화: 위기',
            '5화: 더 큰 비밀',
          ],
        },
      },
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(70);
    expect(issueCodes(result.issues)).toContain('reader-promise-generic');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'reader-promise-generic',
          priority: 'critical',
          target: 'design_strategy',
          expected: expect.stringContaining('specific reader promise'),
        }),
      ])
    );
  });

  it('fails when concrete reader promise fields do not integrate into one serial premise', () => {
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          core_hook: '살인을 예고하는 앱',
          irresistible_question: '숨겨진 왕국의 왕좌는 누가 차지하는가?',
          protagonist_appeal: '재벌 후계자가 계약 결혼의 비용을 감수하는 냉정함',
          novelty_angle: '법정 재판이 AI 로봇 증거 조작으로 뒤집힌다',
          emotional_payoff: '드래곤 혈통과 저주가 풀리는 마법 왕국의 카타르시스',
          binge_reason: '각 화 말미마다 던전 스킬 보상과 탑 규칙이 갱신된다',
          long_series_engine: '우주 감염의 기원과 도시 병원 실험 기록을 추적한다',
          first_five_chapter_retention_plan: [
            '1화: 사진 속 암호가 낡은 열쇠 위치를 가리킨다',
            '2화: 문서 서명이 지도 좌표와 맞물린다',
            '3화: 상처 모양과 시계 번호가 드러난다',
            '4화: 독이 든 약 병과 피 묻은 검이 발견된다',
            '5화: 목걸이와 반지 단서가 새 주소를 남긴다',
          ],
        },
      },
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(70);
    expect(issueCodes(result.issues)).toContain('reader-promise-premise-not-integrated');
    expect(issueCodes(result.issues)).not.toContain('reader-promise-generic');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'reader-promise-premise-not-integrated',
          priority: 'critical',
          target: 'design_strategy',
          expected: expect.stringContaining('recurring story anchors'),
        }),
      ])
    );
  });

  it('fails when plot fun spec is too generic to guide concrete chapter execution', () => {
    const genericFunSpec = {
      reader_reward: '흥미로운 사건과 큰 반전',
      page_turn_question: '다음 화가 궁금해지는 질문',
      character_appeal_moment: '주인공이 매력을 보여준다',
      drop_off_risk: '지루하지 않게 빠르게 전개한다',
      must_click_ending: '강한 클리프행어로 끝난다',
    };
    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [
          {
            ...guide,
            fun_spec: genericFunSpec,
          },
        ],
      },
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          chapter_reward: genericFunSpec.reader_reward,
          page_turner_question: genericFunSpec.page_turn_question,
          character_appeal_moment: genericFunSpec.character_appeal_moment,
          drop_off_risk: genericFunSpec.drop_off_risk,
          must_click_ending: genericFunSpec.must_click_ending,
        },
        scenes: [
          {
            ...alignedChapter.scenes[0],
            beat: [
              alignedChapter.scenes[0].beat,
              genericFunSpec.reader_reward,
              genericFunSpec.character_appeal_moment,
              genericFunSpec.drop_off_risk,
            ].join(' '),
          },
          {
            ...alignedChapter.scenes[1],
            beat: `${alignedChapter.scenes[1].beat} ${genericFunSpec.must_click_ending}`,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('fun-spec-generic');
    expect(result.breakdown.funSpecAlignment).toBeLessThanOrEqual(55);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'fun-spec-generic',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('concrete fun_spec'),
        }),
      ])
    );
  });

  it('fails when page-turn questions close the curiosity gap with an answer-like statement', () => {
    const closedPageTurnQuestion =
      '앱은 왜 주인공에게만 첫 알림을 보냈고 예고 앱이 실제 살인을 어떻게 알았는지는 개발자가 과거 미제 사건 기록을 이용했기 때문으로 설명된다.';
    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [
          {
            ...guide,
            fun_spec: {
              ...guide.fun_spec,
              page_turn_question: closedPageTurnQuestion,
            },
          },
        ],
      },
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          page_turner_question: closedPageTurnQuestion,
        },
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('page-turn-question-closed');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'page-turn-question-closed',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('open-loop'),
        }),
      ])
    );
  });

  it('fails when open page-turn questions are too broad to create a narrow curiosity gap', () => {
    const broadPageTurnQuestion = '앱과 사건은 왜 연결되는가?';
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          irresistible_question: broadPageTurnQuestion,
        },
      },
      plot: {
        ...plot,
        per_chapter_guide: [
          {
            ...guide,
            fun_spec: {
              ...guide.fun_spec,
              page_turn_question: broadPageTurnQuestion,
            },
          },
        ],
      },
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          page_turner_question: broadPageTurnQuestion,
        },
        scenes: [
          alignedChapter.scenes[0],
          {
            ...alignedChapter.scenes[1],
            beat: `${alignedChapter.scenes[1].beat} ${broadPageTurnQuestion}`,
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain('page-turn-question-too-broad');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'page-turn-question-too-broad',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('narrow information gap'),
        }),
      ])
    );
  });

  it('allows page-turn questions with a narrow and specific information gap', () => {
    const narrowPageTurnQuestion =
      '앱 로고와 0717 사건 번호는 왜 같은 검은 봉투에 반복되는가?';
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          irresistible_question: narrowPageTurnQuestion,
        },
      },
      plot: {
        ...plot,
        per_chapter_guide: [
          {
            ...guide,
            fun_spec: {
              ...guide.fun_spec,
              page_turn_question: narrowPageTurnQuestion,
            },
          },
        ],
      },
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          page_turner_question: narrowPageTurnQuestion,
        },
        scenes: [
          alignedChapter.scenes[0],
          {
            ...alignedChapter.scenes[1],
            beat: `${alignedChapter.scenes[1].beat} ${narrowPageTurnQuestion}`,
          },
        ],
      },
    });

    expect(issueCodes(result.issues)).not.toContain('page-turn-question-too-broad');
    expect(issueCodes(result.issues)).not.toContain('page-turn-question-closed');
  });

  it('fails when the chapter abandons the design novelty angle', () => {
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          novelty_angle: '마법 왕국의 시간여행 계약 결혼',
        },
      },
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('novelty-angle-drift');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'novelty-angle-drift',
          priority: 'critical',
          target: 'plot_strategy',
          expected: '마법 왕국의 시간여행 계약 결혼',
        }),
      ])
    );
  });

  it('fails when the chapter abandons the design emotional payoff', () => {
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          emotional_payoff: '달콤한 연애 설렘과 관계 회복의 따뜻함',
        },
      },
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('emotional-payoff-drift');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'emotional-payoff-drift',
          priority: 'critical',
          target: 'plot_strategy',
          expected: '달콤한 연애 설렘과 관계 회복의 따뜻함',
        }),
      ])
    );
  });

  it('fails when the chapter abandons the design long-series engine', () => {
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          long_series_engine: '마법 왕국의 왕위 계승전과 드래곤 혈통의 비밀이 장기 서사를 끌고 간다',
        },
      },
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('long-series-engine-drift');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'long-series-engine-drift',
          priority: 'critical',
          target: 'plot_strategy',
          expected: '마법 왕국의 왕위 계승전과 드래곤 혈통의 비밀이 장기 서사를 끌고 간다',
        }),
      ])
    );
  });

  it('fails when plot long hook threads are not staged by chapter evidence', () => {
    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        binge_architecture: {
          ...plot.binge_architecture,
          long_hook_threads: [
            '왕국 계승권을 둘러싼 귀족 암투',
            '드래곤 혈통을 숨긴 계약 결혼의 비밀',
          ],
        },
      },
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('long-hook-thread-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'long-hook-thread-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected: '왕국 계승권을 둘러싼 귀족 암투 / 드래곤 혈통을 숨긴 계약 결혼의 비밀',
        }),
      ])
    );
  });

  it('fails when plot long hook threads are mentioned but not advanced by chapter evidence', () => {
    const staticLongHook = '푸른 열쇠와 지하 서버의 배후';
    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        binge_architecture: {
          ...plot.binge_architecture,
          long_hook_threads: [staticLongHook],
        },
      },
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          promise_fulfillment: [
            '살인을 예고하는 앱이 주인공의 이름을 첫 번째 수신자로 지목한다.',
            '복도는 조용하고 화면은 그대로 어둡다.',
            `${staticLongHook}는 장기 미스터리로 여전히 남아 있다.`,
            '그는 잠깐 숨을 고른다.',
          ].join(' '),
          must_click_ending: '피해자의 휴대폰에 알림이 남아 있고 주인공 이름이 화면에 깜박인다.',
        },
        scenes: [
          {
            ...alignedChapter.scenes[0],
            beat: [
              '앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명, 주인공이 경찰 신고보다 현장 도착 시간을 먼저 계산해 뛰쳐나간다.',
              '복도는 조용하고 화면은 그대로 어둡다.',
              `${staticLongHook}는 장기 미스터리로 여전히 남아 있다.`,
              '그는 잠깐 숨을 고른다.',
            ].join(' '),
          },
          {
            ...alignedChapter.scenes[1],
            beat: '피해자의 휴대폰에 알림이 남아 있고 주인공 이름이 화면에 깜박인다.',
          },
        ],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).not.toContain('long-hook-thread-not-staged');
    expect(issueCodes(result.issues)).toContain('long-hook-thread-not-advanced');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'long-hook-thread-not-advanced',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('long_hook_thread advancement'),
        }),
      ])
    );
  });

  it('fails when the chapter abandons the plot payoff cadence', () => {
    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        binge_architecture: {
          ...plot.binge_architecture,
          payoff_cadence: '매 회차 로맨스 고백 보상, 2화마다 관계 회복',
        },
      },
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('payoff-cadence-drift');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'payoff-cadence-drift',
          priority: 'critical',
          target: 'plot_strategy',
          expected: '매 회차 로맨스 고백 보상, 2화마다 관계 회복',
        }),
      ])
    );
  });

  it('fails when the chapter does not stage plot fatigue controls', () => {
    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        binge_architecture: {
          ...plot.binge_architecture,
          fatigue_controls: [
            '조사 장면 반복을 막기 위해 관계 압박 또는 물리적 장소 변주를 넣는다',
          ],
        },
      },
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('fatigue-control-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'fatigue-control-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected:
            '조사 장면 반복을 막기 위해 관계 압박 또는 물리적 장소 변주를 넣는다',
        }),
      ])
    );
  });

  it('fails when manuscript prose repeats the same investigation beat without fatigue-control variation', () => {
    const fatiguePlot = {
      ...plot,
      binge_architecture: {
        ...plot.binge_architecture,
        fatigue_controls: [
          '조사 장면 반복을 막기 위해 관계 압박 또는 물리적 장소 변주를 넣는다',
        ],
      },
    };
    const fatigueChapter = {
      ...alignedChapter,
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          `${alignedChapter.reader_experience.promise_fulfillment} 조사 장면 반복을 막기 위해 관계 압박 또는 물리적 장소 변주를 넣는다.`,
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          conflict:
            `${alignedChapter.scenes[0].conflict} 조사 장면 반복을 막기 위해 관계 압박 또는 물리적 장소 변주를 넣는다.`,
          beat:
            `${alignedChapter.scenes[0].beat} 조사 장면 반복을 막기 위해 관계 압박 또는 물리적 장소 변주를 넣는다.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: fatiguePlot,
      chapter: fatigueChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선의 조명을 꺼뜨리고 현장 문을 잠갔고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '그는 현장 기록을 확인했다. 휴대폰 로그를 대조했다. 앱 알림 시각을 기록했다. 현장 기록을 다시 확인했다. 휴대폰 로그를 다시 대조했다. 앱 알림 시각을 다시 기록했다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 조여 오는 목덜미와 식은땀이 밴 손바닥으로 피해자의 휴대폰을 다시 쥐었다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았으며, 그는 화면을 쥔 채 왜 첫 수신자가 자신인지, 앱이 아직 벌어지지 않은 살인을 어떻게 알고 있었는지 알 수 없는 채 멈췄다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-fatigue-control-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-fatigue-control-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('fatigue_controls'),
        }),
      ])
    );
  });

  it('fails when a later chapter repeats the prior chapter reward and investigation pattern without a new escalation axis', () => {
    const repeatedGuide = {
      ...guide,
      chapter: 6,
    };
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
    };
    const repetitiveChapter = {
      ...alignedChapter,
      chapter_number: 6,
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [repeatedGuide],
      },
      chapter: repetitiveChapter,
      previousChapters: [previousChapter],
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.sceneMomentum).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain(
      'serial-escalation-variety-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'serial-escalation-variety-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('serial escalation variety'),
        }),
      ])
    );
  });

  it('fails when a later chapter changes conflict axis but repeats the same reward delivery pattern', () => {
    const repeatedRewardGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        ...guide.fun_spec,
        reader_reward:
          '앱 알림이 실제 사건과 맞아떨어지는 두 번째 규칙 증명: 현장 기록의 빈칸과 피해자 휴대폰 로그가 같은 초 단위로 맞물린다.',
        drop_off_risk:
          '전 회차와 같은 로그-기록 대조 반복 위험 - 조력자 불신과 증거 봉투 강탈로 새 갈등 축을 세운다.',
        must_click_ending:
          '조력자가 증거 봉투를 빼앗고 다음 수신자 이름이 조력자로 깜박인다.',
      },
    };
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
    };
    const repeatedRewardChapter = {
      ...alignedChapter,
      chapter_number: 6,
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: repeatedRewardGuide.fun_spec.reader_reward,
        drop_off_risk: repeatedRewardGuide.fun_spec.drop_off_risk,
        must_click_ending: repeatedRewardGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          purpose: '조력자 불신으로 새 갈등 축을 세운다.',
          conflict:
            '조력자가 주인공의 은폐를 의심해 증거 봉투를 넘기지 않으려 하고 신뢰가 깨진다.',
          beat:
            `${repeatedRewardGuide.fun_spec.reader_reward} 조력자 불신과 증거 봉투 강탈로 새 갈등 축을 세운다.`,
        },
        {
          ...alignedChapter.scenes[1],
          conflict:
            '주인공은 증거 봉투를 지키려 하지만 조력자가 먼저 손을 뻗는다.',
          beat: repeatedRewardGuide.fun_spec.must_click_ending,
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [repeatedRewardGuide],
      },
      chapter: repeatedRewardChapter,
      previousChapters: [previousChapter],
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'serial-reward-pattern-repetition-not-staged'
    );
    expect(issueCodes(result.issues)).not.toContain(
      'serial-escalation-variety-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'serial-reward-pattern-repetition-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('serial reward pattern variation'),
        }),
      ])
    );
  });

  it('fails when manuscript prose repeats the prior chapter beat even though metadata promises an escalation variation', () => {
    const variedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        ...guide.fun_spec,
        reader_reward:
          `${guide.fun_spec.reader_reward} 이후 조력자와의 신뢰가 깨지고 경찰서 기록실에서 새 증거 봉투를 빼앗긴다.`,
        drop_off_risk:
          '전 회차와 같은 알림-현장-휴대폰 조사 반복 위험 - 조력자 불신, 경찰서 기록실, 증거 봉투 강탈로 새 갈등 축을 세운다.',
        must_click_ending:
          `${guide.fun_spec.must_click_ending} 조력자가 주인공의 은폐를 알아차리고 증거 봉투를 빼앗는다.`,
      },
    };
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
    };
    const variedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: variedGuide.fun_spec.reader_reward,
        drop_off_risk: variedGuide.fun_spec.drop_off_risk,
        must_click_ending: variedGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          purpose: '전 회차와 다른 관계 압박을 세운다.',
          conflict:
            '조력자가 주인공의 은폐를 의심해 경찰서 기록실 출입을 막고 신뢰가 깨진다.',
          beat:
            '조력자 불신, 경찰서 기록실, 증거 봉투 강탈로 새 갈등 축을 세우고 앱 규칙 조사의 반복감을 끊는다.',
        },
        {
          ...alignedChapter.scenes[1],
          conflict:
            '주인공은 기록실에서 증거 봉투를 지키려 하지만 조력자가 먼저 손을 뻗는다.',
          beat: variedGuide.fun_spec.must_click_ending,
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [variedGuide],
      },
      chapter: variedChapter,
      previousChapters: [previousChapter],
      previousManuscripts: [alignedManuscript],
      manuscript: alignedManuscript,
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-serial-escalation-variety-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-serial-escalation-variety-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('serial escalation variety'),
        }),
      ])
    );
  });

  it('fails when manuscript prose adds new conflict elsewhere but repeats the prior reward pattern on page', () => {
    const variedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        ...guide.fun_spec,
        reader_reward:
          `${guide.fun_spec.reader_reward} 이후 조력자와의 신뢰가 깨지고 경찰서 기록실에서 새 증거 봉투를 빼앗긴다.`,
        drop_off_risk:
          '전 회차와 같은 알림-현장-휴대폰 조사 반복 위험 - 조력자 불신, 경찰서 기록실, 증거 봉투 강탈로 새 갈등 축을 세운다.',
        must_click_ending:
          `${guide.fun_spec.must_click_ending} 조력자가 주인공의 은폐를 알아차리고 증거 봉투를 빼앗는다.`,
      },
    };
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
    };
    const variedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: variedGuide.fun_spec.reader_reward,
        drop_off_risk: variedGuide.fun_spec.drop_off_risk,
        must_click_ending: variedGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          purpose: '전 회차와 다른 관계 압박을 세운다.',
          conflict:
            '조력자가 주인공의 은폐를 의심해 경찰서 기록실 출입을 막고 신뢰가 깨진다.',
          beat:
            '조력자 불신, 경찰서 기록실, 증거 봉투 강탈로 새 갈등 축을 세우고 앱 규칙 조사의 반복감을 끊는다.',
        },
        {
          ...alignedChapter.scenes[1],
          conflict:
            '주인공은 기록실에서 증거 봉투를 지키려 하지만 조력자가 먼저 손을 뻗는다.',
          beat: variedGuide.fun_spec.must_click_ending,
        },
      ],
    };
    const repeatedRewardManuscript = [
      '피해자 휴대폰의 새 예고를 이어받은 주인공은 경찰서 기록실 앞에서 조력자와 마주쳤고, 조력자는 은폐를 의심하며 출입증을 빼앗으려 했다.',
      '그는 신뢰가 깨지는 소리를 들으며 정면 진입 계획을 접고 기록실 뒤 비상문으로 우회했다.',
      '현장 기록의 빈칸과 피해자의 휴대폰 로그를 그는 다시 쥐고 대조했다. 두 기록이 같은 초 단위로 맞물리자 앱 알림이 실제 사건과 맞아떨어졌다는 규칙은 다시 확인됐다. 목덜미가 조이고 손바닥에 식은땀이 고였다.',
      '왜 조력자의 이름이 다음 수신자 후보에 올라갔는지, 누가 증거 봉투 위치를 먼저 알았는지는 더 큰 미해결 질문으로 남았다.',
      '마지막 화면에서 조력자가 증거 봉투를 빼앗고 다음 수신자 이름이 조력자로 깜박이자, 주인공은 빈 손을 내려다보며 숨을 삼켰다.',
    ].join('\n');

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [variedGuide],
      },
      chapter: variedChapter,
      previousChapters: [previousChapter],
      previousManuscripts: [alignedManuscript],
      manuscript: repeatedRewardManuscript,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-serial-reward-pattern-repetition-not-evidenced'
    );
    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-serial-escalation-variety-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-serial-reward-pattern-repetition-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('serial reward pattern variation'),
        }),
      ])
    );
  });

  it('fails when a later chapter does not carry over the prior must-click ending', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
    };
    const detachedGuide = {
      ...guide,
      chapter: 6,
      arc_beats: '경찰 내부 서버실의 CCTV 로그 조작 단서 발견',
      fun_spec: {
        reader_reward:
          '경찰 내부 서버실의 CCTV 로그가 예고 앱 경로를 조작했다는 단서 발견',
        page_turn_question:
          '예고 앱은 왜 경찰 내부 서버 기록까지 조작할 수 있었는가?',
        character_appeal_moment:
          '주인공이 체포 위험을 감수하고 경찰 내부 서버실에 잠입해 로그를 직접 대조한다.',
        drop_off_risk:
          '조사 반복 위험 - 경찰서 서버실 잠입과 내부자 방해로 행동 방식을 바꾼다.',
        must_click_ending:
          '경찰 내부자가 CCTV 로그를 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
      },
    };
    const detachedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        current_plot:
          '주인공은 경찰 내부 서버실에 잠입해 CCTV 로그가 예고 앱 경로를 조작했다는 단서를 발견한다. 내부자가 기록을 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '살인을 예고하는 앱이 경찰 내부 서버 기록까지 조작한다는 사실을 보여주고, 예고 앱 개발자와 주인공 가족 실종이 하나의 장기 미스터리로 수렴한다.',
        chapter_reward: detachedGuide.fun_spec.reader_reward,
        page_turner_question: detachedGuide.fun_spec.page_turn_question,
        character_appeal_moment: detachedGuide.fun_spec.character_appeal_moment,
        drop_off_risk: detachedGuide.fun_spec.drop_off_risk,
        must_click_ending: detachedGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '경찰 내부 서버실 잠입으로 조사 방식을 바꾼다.',
          conflict:
            '주인공은 체포 위험과 내부자 감시를 감수하고 서버실 로그를 직접 대조해야 한다.',
          beat:
            '경찰 내부 서버실의 CCTV 로그가 예고 앱 경로를 조작했다는 단서 발견, 내부자가 기록을 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [detachedGuide],
      },
      chapter: detachedChapter,
      previousChapters: [previousChapter],
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain('cliffhanger-carryover-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'cliffhanger-carryover-not-staged',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('prior must_click_ending'),
        }),
      ])
    );
  });

  it('fails when manuscript prose ignores the prior chapter ending that metadata carries forward', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
    };
    const carriedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        ...guide.fun_spec,
        reader_reward:
          `${guide.fun_spec.reader_reward} 직후 피해자 휴대폰의 새 예고와 과거 미제 사건 번호를 주인공이 직접 대조한다.`,
      },
    };
    const carriedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        current_plot:
          '직전 회차 말미의 피해자 휴대폰 새 예고, 주인공 이름, 과거 미제 사건 번호를 주인공이 곧바로 대조한다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: carriedGuide.fun_spec.reader_reward,
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          purpose: '직전 말미 훅을 곧바로 이어받는다.',
          conflict:
            '주인공은 피해자 휴대폰의 새 예고와 자기 이름이 뜬 화면을 경찰에게 넘길지 직접 대조할지 선택해야 한다.',
          beat:
            '피해자 휴대폰의 새 예고, 주인공 이름, 과거 미제 사건 번호를 직접 대조해 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 이어받는다.',
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [carriedGuide],
      },
      chapter: carriedChapter,
      previousChapters: [previousChapter],
      manuscript: [
        '주인공은 경찰서 서버실에 숨어들어 CCTV 로그의 삭제 시간을 대조했다.',
        '내부자가 남긴 관리자 계정 이름은 예고 앱 개발자와 연결되어 있었고, 가족 실종 파일의 그림자가 다시 떠올랐다.',
        '그는 체포 위험을 감수하고 로그 원본을 복사했지만, 복도 끝에서 내부자의 발소리가 다가왔다.',
        '마지막 화면에는 관리자 계정이 아직 접속 중이라는 붉은 문구가 깜박였다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-cliffhanger-carryover-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-cliffhanger-carryover-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('prior must_click_ending'),
        }),
      ])
    );
  });

  it('fails when cliffhanger carryover is planned but delayed past the opening scene', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
    };
    const delayedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        ...guide.fun_spec,
        reader_reward:
          `${guide.fun_spec.must_click_ending} 직후 주인공이 과거 미제 사건 번호를 직접 대조한다.`,
      },
    };
    const delayedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        current_plot:
          `${guide.fun_spec.must_click_ending} 직후 주인공이 과거 미제 사건 번호를 직접 대조한다.`,
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: delayedGuide.fun_spec.reader_reward,
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '경찰서 서버실 잠입을 준비한다.',
          conflict:
            '주인공은 보안 문 앞에서 출입증을 훔칠지 기다릴지 선택해야 한다.',
          beat:
            '보안 문, 출입증, 감시 카메라 때문에 서버실 접근 계획이 막힌다.',
        },
        {
          ...alignedChapter.scenes[1],
          beat:
            '피해자의 휴대폰 새 알림과 주인공 이름, 과거 미제 사건 번호를 뒤늦게 대조한다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [delayedGuide],
      },
      chapter: delayedChapter,
      previousChapters: [previousChapter],
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).not.toContain(
      'cliffhanger-carryover-not-staged'
    );
    expect(issueCodes(result.issues)).toContain('cliffhanger-carryover-delayed');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'cliffhanger-carryover-delayed',
          priority: 'critical',
          target: 'scenes',
          expected: expect.stringContaining('opening scene'),
        }),
      ])
    );
  });

  it('fails when manuscript carries prior cliffhanger only after unrelated opening setup', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
    };
    const carriedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        ...guide.fun_spec,
        reader_reward:
          `${guide.fun_spec.must_click_ending} 직후 주인공이 과거 미제 사건 번호를 직접 대조한다.`,
      },
    };
    const carriedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        current_plot:
          `${guide.fun_spec.must_click_ending} 직후 주인공이 과거 미제 사건 번호를 직접 대조한다.`,
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward: carriedGuide.fun_spec.reader_reward,
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          purpose: '직전 말미 훅을 첫 장면에서 곧바로 이어받는다.',
          conflict:
            '주인공은 피해자 휴대폰 새 알림과 자기 이름이 뜬 화면을 넘길지 직접 대조할지 선택해야 한다.',
          beat:
            '피해자의 휴대폰 새 알림, 주인공 이름, 과거 미제 사건 번호를 직접 대조한다.',
        },
        alignedChapter.scenes[1],
      ],
    };
    const delayedManuscript = [
      '주인공은 경찰서 서버실 앞에서 보안 카메라의 사각지대를 먼저 세었다.',
      '출입증을 훔치면 체포 위험이 커지고 기다리면 내부자가 로그를 지울 수 있었다.',
      '그제야 피해자의 휴대폰 새 알림과 주인공 이름이 다음 수신자로 깜박이던 화면을 다시 꺼냈고, 과거 미제 사건 번호가 현재 사건 기록과 연결된다는 사실을 대조했다.',
      '휴대폰 화면의 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치자 그는 왜 첫 수신자가 자신인지 더 좁혀진 질문을 쥐었다.',
      '마지막에는 내부자가 관리자 계정으로 접속 중이라는 붉은 문구가 깜박였다.',
    ].join('\n');

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [carriedGuide],
      },
      chapter: carriedChapter,
      previousChapters: [previousChapter],
      manuscript: delayedManuscript,
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).not.toContain(
      'manuscript-cliffhanger-carryover-not-evidenced'
    );
    expect(issueCodes(result.issues)).toContain(
      'manuscript-cliffhanger-carryover-delayed'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-cliffhanger-carryover-delayed',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('first two manuscript sentences'),
        }),
      ])
    );
  });

  it('fails when a later chapter does not carry over the prior choice-cost lock', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
      context: {
        next_plot:
          '직전 선택의 대가로 신고 기록과 알리바이 선택지가 닫히고 안전한 제보자 신뢰 관계가 끊겨 다음 회차 경찰 의심 압박으로 이어진다.',
      },
    };
    const carriedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        reader_reward:
          '피해자 휴대폰 새 알림과 과거 미제 사건 번호를 폐쇄 서버실 관리자 로그와 대조한다.',
        page_turn_question:
          '예고 앱 개발자 계정은 왜 주인공 이름을 다음 수신자로 다시 올렸는가?',
        character_appeal_moment:
          '주인공이 개발자 계정 로그를 공개할지 서버 원본을 조용히 복사할지 선택한다.',
        drop_off_risk:
          '조사 반복 위험 - 폐쇄 서버실 잠입과 관리자 로그 대조로 행동 방식을 바꾼다.',
        must_click_ending:
          '관리자 계정이 아직 접속 중이라는 붉은 문구가 서버실 화면에 떠오른다.',
      },
    };
    const detachedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        current_plot:
          '직전 말미의 피해자 휴대폰 새 알림, 주인공 이름, 과거 미제 사건 번호를 폐쇄 서버실 관리자 로그와 곧바로 대조한다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '살인을 예고하는 앱이 주인공의 이름을 다시 수신자로 올리고, 예고 앱 개발자와 주인공 가족 실종이 하나의 장기 미스터리로 수렴한다.',
        chapter_reward: carriedGuide.fun_spec.reader_reward,
        page_turner_question: carriedGuide.fun_spec.page_turn_question,
        character_appeal_moment: carriedGuide.fun_spec.character_appeal_moment,
        drop_off_risk: carriedGuide.fun_spec.drop_off_risk,
        must_click_ending: carriedGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '직전 말미 훅을 폐쇄 서버실 로그 대조로 이어받는다.',
          conflict:
            '주인공은 개발자 계정 로그를 공개할지, 서버 원본을 조용히 복사할지 선택해야 한다.',
          beat:
            '피해자 휴대폰 새 알림, 주인공 이름, 과거 미제 사건 번호를 관리자 로그와 대조한다. 그는 공개 대신 복사를 택한 대가로 서버실 통로가 잠기고 관리자 파일 경로가 차단되어 되돌릴 수 없는 압박을 받는다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [carriedGuide],
      },
      chapter: detachedChapter,
      previousChapters: [previousChapter],
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'choice-cost-lock-carryover-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'choice-cost-lock-carryover-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('choice-cost lock carryover'),
        }),
      ])
    );
  });

  it('fails when manuscript prose ignores the prior choice-cost lock that metadata carries forward', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
      context: {
        next_plot:
          '직전 선택의 대가로 신고 기록과 알리바이 선택지가 닫히고 안전한 제보자 신뢰 관계가 끊겨 다음 회차 경찰 의심 압박으로 이어진다.',
      },
    };
    const carriedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        reader_reward:
          '신고 기록과 알리바이 선택지가 닫힌 여파로 경찰 의심을 받는 상태에서 피해자 휴대폰 새 알림과 과거 미제 사건 번호를 대조한다.',
        page_turn_question:
          '예고 앱 개발자 계정은 왜 주인공 이름을 다음 수신자로 다시 올렸는가?',
        character_appeal_moment:
          '주인공이 제보자 신뢰 관계가 끊긴 상태에서도 개발자 계정 로그를 공개할지 서버 원본을 조용히 복사할지 선택한다.',
        drop_off_risk:
          '조사 반복 위험 - 신고 기록과 알리바이 선택지가 사라진 경찰 의심 압박이 폐쇄 서버실 잠입을 강제한다.',
        must_click_ending:
          '관리자 계정이 아직 접속 중이라는 붉은 문구가 서버실 화면에 떠오른다.',
      },
    };
    const carriedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        previous_summary:
          '직전 선택의 대가로 신고 기록과 알리바이 선택지가 닫히고 안전한 제보자 신뢰 관계가 끊겼다.',
        current_plot:
          '신고 기록과 알리바이 선택지가 닫힌 여파로 경찰 의심을 받는 주인공이 직전 말미의 피해자 휴대폰 새 알림, 주인공 이름, 과거 미제 사건 번호를 곧바로 대조한다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '살인을 예고하는 앱이 주인공의 이름을 다시 수신자로 올리고, 신고 기록과 알리바이 선택지가 닫힌 여파가 경찰 의심 압박으로 이어진다.',
        chapter_reward: carriedGuide.fun_spec.reader_reward,
        page_turner_question: carriedGuide.fun_spec.page_turn_question,
        character_appeal_moment: carriedGuide.fun_spec.character_appeal_moment,
        drop_off_risk: carriedGuide.fun_spec.drop_off_risk,
        must_click_ending: carriedGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '직전 선택-대가 잠금을 다음 회차 첫 압박으로 이어받는다.',
          conflict:
            '신고 기록과 알리바이 선택지가 닫힌 탓에 경찰 의심을 받는 주인공은 개발자 계정 로그를 공개할지, 서버 원본을 조용히 복사할지 선택해야 한다.',
          beat:
            '안전한 제보자 신뢰 관계가 끊긴 여파로 경찰 감시가 따라붙고, 주인공은 피해자 휴대폰 새 알림과 과거 미제 사건 번호를 대조한다. 그는 공개 대신 복사를 택한 대가로 서버실 통로가 잠기고 관리자 파일 경로가 차단되어 되돌릴 수 없는 압박을 받는다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [carriedGuide],
      },
      chapter: carriedChapter,
      previousChapters: [previousChapter],
      manuscript: [
        '피해자 휴대폰의 새 알림과 주인공 이름, 과거 미제 사건 번호가 같은 화면에 떠서, 그는 왜 앱이 자신을 다음 수신자로 지목했는지 곧바로 대조했다.',
        '개발자 계정 로그를 공개할지 서버 원본을 조용히 복사할지 선택해야 했다.',
        '그는 공개를 포기하고 복사를 택했고, 그 대가로 서버실 통로가 잠겨 관리자 파일 경로가 차단되자 되돌릴 수 없는 압박이 밀려왔다.',
        '예고 앱 개발자와 가족 실종 파일 번호는 같은 관리자 묶음 아래 남아 있었다.',
        '관리자 계정이 아직 접속 중이라는 붉은 문구가 서버실 화면에 떠올랐다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-choice-cost-lock-carryover-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-choice-cost-lock-carryover-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('choice-cost lock carryover'),
        }),
      ])
    );
  });

  it('fails when a later chapter does not carry over the prior revelation consequence', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward:
          '조력자가 앱 개발자의 내부 공범이고 가족 실종 파일이 같은 관리자 계정에서 수정됐다는 폭로',
        must_click_ending:
          '조력자의 배지 뒤에서 앱 개발자 관리자 계정 접속 토큰이 깜박이고 가족 실종 파일 번호가 같은 화면에 떠오른다.',
      },
      context: {
        next_plot:
          '전 회차 폭로로 조력자가 앱 개발자의 내부 공범이고 가족 실종 파일이 같은 관리자 계정에서 수정됐다는 사실이 드러나 다음 회차 계획 변경과 새 압박으로 이어진다.',
      },
    };
    const detachedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        reader_reward:
          '경찰 내부 서버실의 CCTV 로그가 예고 앱 경로를 조작했다는 단서 발견',
        page_turn_question:
          '예고 앱은 왜 경찰 내부 서버 기록까지 조작할 수 있었는가?',
        character_appeal_moment:
          '주인공이 체포 위험을 감수하고 경찰 내부 서버실에 잠입해 로그를 직접 대조한다.',
        drop_off_risk:
          '조사 반복 위험 - 경찰서 서버실 잠입과 내부자 방해로 행동 방식을 바꾼다.',
        must_click_ending:
          '경찰 내부자가 CCTV 로그를 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
      },
    };
    const detachedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        current_plot:
          '주인공은 경찰 내부 서버실에 잠입해 CCTV 로그가 예고 앱 경로를 조작했다는 단서를 발견한다. 내부자가 기록을 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '살인을 예고하는 앱이 경찰 내부 서버 기록까지 조작한다는 사실을 보여준다.',
        chapter_reward: detachedGuide.fun_spec.reader_reward,
        page_turner_question: detachedGuide.fun_spec.page_turn_question,
        character_appeal_moment: detachedGuide.fun_spec.character_appeal_moment,
        drop_off_risk: detachedGuide.fun_spec.drop_off_risk,
        must_click_ending: detachedGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '경찰 내부 서버실 잠입으로 조사 방식을 바꾼다.',
          conflict:
            '주인공은 체포 위험과 내부자 감시를 감수하고 서버실 로그를 직접 대조해야 한다.',
          beat:
            '경찰 내부 서버실의 CCTV 로그가 예고 앱 경로를 조작했다는 단서 발견, 내부자가 기록을 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [detachedGuide],
      },
      chapter: detachedChapter,
      previousChapters: [previousChapter],
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'revelation-consequence-carryover-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'revelation-consequence-carryover-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('revelation consequence carryover'),
        }),
      ])
    );
  });

  it('fails when manuscript prose ignores the prior revelation consequence that metadata carries forward', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward:
          '조력자가 앱 개발자의 내부 공범이고 가족 실종 파일이 같은 관리자 계정에서 수정됐다는 폭로',
        must_click_ending:
          '조력자의 배지 뒤에서 앱 개발자 관리자 계정 접속 토큰이 깜박이고 가족 실종 파일 번호가 같은 화면에 떠오른다.',
      },
      context: {
        next_plot:
          '전 회차 폭로로 조력자가 앱 개발자의 내부 공범이고 가족 실종 파일이 같은 관리자 계정에서 수정됐다는 사실이 드러나 다음 회차 계획 변경과 새 압박으로 이어진다.',
      },
    };
    const carriedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        reader_reward:
          '조력자가 앱 개발자의 내부 공범이라는 폭로 때문에 주인공이 조력자 접근 계획을 버리고 관리자 계정 접속 위치를 추적한다.',
        page_turn_question:
          '조력자는 왜 가족 실종 파일을 같은 관리자 계정으로 수정했는가?',
        character_appeal_moment:
          '주인공이 조력자에게 직접 따지는 대신 함정을 역추적하는 계획 변경을 택한다.',
        drop_off_risk:
          '조사 반복 위험 - 전 회차 폭로가 조력자 불신과 관리자 계정 추적 압박으로 즉시 이어진다.',
        must_click_ending:
          '관리자 계정 접속 위치가 조력자의 집 주소와 겹치며 다음 질문을 연다.',
      },
    };
    const carriedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        previous_summary:
          '전 회차 폭로로 조력자가 앱 개발자의 내부 공범이고 가족 실종 파일이 같은 관리자 계정에서 수정됐다는 사실이 드러났다.',
        current_plot:
          '그 폭로 때문에 주인공은 조력자에게 접근하던 계획을 버리고 관리자 계정 접속 위치를 추적하는 계획 변경을 한다. 조력자의 함정과 내부 공범 가능성이 새 압박이 된다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '조력자 내부 공범 폭로가 가족 실종 파일과 관리자 계정 추적으로 이어져 장기 미스터리를 좁힌다.',
        chapter_reward: carriedGuide.fun_spec.reader_reward,
        page_turner_question: carriedGuide.fun_spec.page_turn_question,
        character_appeal_moment: carriedGuide.fun_spec.character_appeal_moment,
        drop_off_risk: carriedGuide.fun_spec.drop_off_risk,
        must_click_ending: carriedGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '전 회차 폭로의 결과로 계획을 바꾼다.',
          conflict:
            '조력자가 내부 공범이라는 폭로 때문에 주인공은 직접 추궁할지, 가족 실종 파일을 수정한 관리자 계정 접속 위치를 먼저 추적할지 선택해야 한다.',
          beat:
            '주인공은 조력자 접근 계획을 버리고 관리자 계정 접속 위치 추적으로 계획을 바꾼다. 내부 공범 폭로는 조력자 불신과 새 압박으로 이어지고 다음 질문을 연다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [carriedGuide],
      },
      chapter: carriedChapter,
      previousChapters: [previousChapter],
      manuscript: [
        '주인공은 경찰서 서버실에 숨어들어 CCTV 로그의 삭제 시간을 대조했다.',
        '내부자가 남긴 관리자 계정 이름은 예고 앱 개발자와 연결되어 있었고, 복도 끝에서 발소리가 다가왔다.',
        '그는 체포 위험을 감수하고 로그 원본을 복사했지만, 마지막 화면에는 관리자 계정이 아직 접속 중이라는 붉은 문구가 깜박였다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-revelation-consequence-carryover-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-revelation-consequence-carryover-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('revelation consequence carryover'),
        }),
      ])
    );
  });

  it('fails when a later chapter does not carry over the prior mystery clue into a revised hypothesis', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward:
          '피해자 손목의 붉은 시계와 조력자 알리바이의 3분 공백이 박도현 단독 범행 가설을 흔드는 단서로 맞물린다.',
        must_click_ending:
          '붉은 시계의 정지 시간이 조력자 알리바이와 맞지 않고, 박도현 단독 범행 가설 옆에 두 번째 용의자 표시가 켜진다.',
      },
      context: {
        next_plot:
          '다음 회차에는 붉은 시계와 조력자 알리바이 공백 단서 때문에 박도현 단독 범행 가설을 수정하고 용의자 순위를 다시 세우며 다음 검증 행동을 정한다.',
      },
    };
    const detachedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        reader_reward:
          '경찰 내부 서버실의 CCTV 로그가 예고 앱 경로를 조작했다는 단서 발견',
        page_turn_question:
          '예고 앱은 왜 경찰 내부 서버 기록까지 조작할 수 있었는가?',
        character_appeal_moment:
          '주인공이 체포 위험을 감수하고 경찰 내부 서버실에 잠입해 로그를 직접 대조한다.',
        drop_off_risk:
          '조사 반복 위험 - 경찰서 서버실 잠입과 내부자 방해로 행동 방식을 바꾼다.',
        must_click_ending:
          '경찰 내부자가 CCTV 로그를 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
      },
    };
    const detachedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        current_plot:
          '주인공은 경찰 내부 서버실에 잠입해 CCTV 로그가 예고 앱 경로를 조작했다는 단서를 발견한다. 내부자가 기록을 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '살인을 예고하는 앱이 경찰 내부 서버 기록까지 조작한다는 사실을 보여준다.',
        chapter_reward: detachedGuide.fun_spec.reader_reward,
        page_turner_question: detachedGuide.fun_spec.page_turn_question,
        character_appeal_moment: detachedGuide.fun_spec.character_appeal_moment,
        drop_off_risk: detachedGuide.fun_spec.drop_off_risk,
        must_click_ending: detachedGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '경찰 내부 서버실 잠입으로 조사 방식을 바꾼다.',
          conflict:
            '주인공은 체포 위험과 내부자 감시를 감수하고 서버실 로그를 직접 대조해야 한다.',
          beat:
            '경찰 내부 서버실의 CCTV 로그가 예고 앱 경로를 조작했다는 단서 발견, 내부자가 기록을 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [detachedGuide],
      },
      chapter: detachedChapter,
      previousChapters: [previousChapter],
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'mystery-hypothesis-carryover-not-staged'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'mystery-hypothesis-carryover-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected: expect.stringContaining('mystery hypothesis carryover'),
        }),
      ])
    );
  });

  it('fails when manuscript prose ignores the prior mystery hypothesis that metadata carries forward', () => {
    const previousChapter = {
      ...alignedChapter,
      chapter_number: 5,
      reader_experience: {
        ...alignedChapter.reader_experience,
        chapter_reward:
          '피해자 손목의 붉은 시계와 조력자 알리바이의 3분 공백이 박도현 단독 범행 가설을 흔드는 단서로 맞물린다.',
        must_click_ending:
          '붉은 시계의 정지 시간이 조력자 알리바이와 맞지 않고, 박도현 단독 범행 가설 옆에 두 번째 용의자 표시가 켜진다.',
      },
      context: {
        next_plot:
          '다음 회차에는 붉은 시계와 조력자 알리바이 공백 단서 때문에 박도현 단독 범행 가설을 수정하고 용의자 순위를 다시 세우며 다음 검증 행동을 정한다.',
      },
    };
    const carriedGuide = {
      ...guide,
      chapter: 6,
      fun_spec: {
        reader_reward:
          '붉은 시계와 조력자 알리바이 공백 단서 때문에 박도현 단독 범행 가설을 수정하고 용의자 순위를 다시 세운다.',
        page_turn_question:
          '조력자는 왜 붉은 시계 정지 시간과 맞지 않는 알리바이를 냈는가?',
        character_appeal_moment:
          '주인공이 서버실 잠입보다 먼저 조력자 알리바이를 재검증하는 다음 검증 행동을 택한다.',
        drop_off_risk:
          '추리 정체 위험 - 직전 단서가 가설 수정, 용의자 순위, 알리바이 재검증으로 바로 이어진다.',
        must_click_ending:
          '조력자 알리바이 파일에서 붉은 시계와 같은 제조번호가 찍힌 영수증이 나온다.',
      },
    };
    const carriedChapter = {
      ...alignedChapter,
      chapter_number: 6,
      context: {
        previous_summary:
          '직전 단서로 붉은 시계와 조력자 알리바이의 3분 공백이 박도현 단독 범행 가설을 흔들었다.',
        current_plot:
          '주인공은 붉은 시계 단서 때문에 박도현 단독 범행 가설을 수정하고 용의자 순위를 다시 세운다. 조력자 알리바이를 재검증하는 다음 검증 행동이 현재 추적을 바꾼다.',
      },
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          '직전 단서가 가설 수정과 용의자 순위 재정렬로 이어져 장기 미스터리를 좁힌다.',
        chapter_reward: carriedGuide.fun_spec.reader_reward,
        page_turner_question: carriedGuide.fun_spec.page_turn_question,
        character_appeal_moment: carriedGuide.fun_spec.character_appeal_moment,
        drop_off_risk: carriedGuide.fun_spec.drop_off_risk,
        must_click_ending: carriedGuide.fun_spec.must_click_ending,
      },
      scenes: [
        {
          scene_number: 1,
          purpose: '직전 단서를 가설 수정으로 이월한다.',
          conflict:
            '주인공은 서버실 로그를 먼저 뒤질지, 붉은 시계 때문에 흔들린 박도현 단독 범행 가설을 수정하고 조력자 알리바이를 재검증할지 선택해야 한다.',
          beat:
            '주인공은 붉은 시계와 알리바이 공백을 대조해 용의자 순위를 다시 세우고 조력자 알리바이를 다음 검증 행동으로 정한다.',
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        per_chapter_guide: [carriedGuide],
      },
      chapter: carriedChapter,
      previousChapters: [previousChapter],
      manuscript: [
        '주인공은 경찰서 서버실에 숨어들어 CCTV 로그의 삭제 시간을 대조했다.',
        '내부자가 남긴 관리자 계정 이름은 예고 앱 개발자와 연결되어 있었고, 복도 끝에서 발소리가 다가왔다.',
        '그는 체포 위험을 감수하고 로그 원본을 복사했지만, 마지막 화면에는 관리자 계정이 아직 접속 중이라는 붉은 문구가 깜박였다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-mystery-hypothesis-carryover-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-mystery-hypothesis-carryover-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('mystery hypothesis carryover'),
        }),
      ])
    );
  });

  it('fails when the chapter does not stage the plot tension reset plan', () => {
    const result = evaluateEngagementContract({
      design,
      plot: {
        ...plot,
        binge_architecture: {
          ...plot.binge_architecture,
          tension_reset_plan:
            '고강도 현장 실패 뒤 호흡을 낮추되 새 질문을 남기는 완급 전략',
        },
      },
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('tension-reset-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'tension-reset-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
          expected:
            '고강도 현장 실패 뒤 호흡을 낮추되 새 질문을 남기는 완급 전략',
        }),
      ])
    );
  });

  it('fails when manuscript prose escalates continuously without a tension reset beat', () => {
    const resetPlot = {
      ...plot,
      binge_architecture: {
        ...plot.binge_architecture,
        tension_reset_plan:
          '고강도 현장 실패 뒤 호흡을 낮추되 새 질문을 남기는 완급 전략',
      },
    };
    const resetChapter = {
      ...alignedChapter,
      reader_experience: {
        ...alignedChapter.reader_experience,
        promise_fulfillment:
          `${alignedChapter.reader_experience.promise_fulfillment} 고강도 현장 실패 뒤 호흡을 낮추되 새 질문을 남기는 완급 전략.`,
        drop_off_risk:
          `${alignedChapter.reader_experience.drop_off_risk} 고강도 현장 실패 뒤 호흡을 낮추되 새 질문을 남기는 완급 전략.`,
      },
      scenes: [
        {
          ...alignedChapter.scenes[0],
          beat:
            `${alignedChapter.scenes[0].beat} 고강도 현장 실패 뒤 호흡을 낮추되 새 질문을 남기는 완급 전략.`,
        },
        alignedChapter.scenes[1],
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: resetPlot,
      chapter: resetChapter,
      manuscript: [
        '살인을 예고하는 앱의 첫 알림이 울린 순간, 주인공은 장난으로 넘길지 위험을 감수하고 현장으로 갈지 선택해야 했다.',
        '공포보다 패턴을 먼저 읽은 그는 경찰 신고보다 현장 도착 시간을 계산했고, 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인하려 뛰쳐나갔다.',
        '제한 시간 안에 피해자를 찾으려 하자 누군가 통제선의 조명을 꺼뜨리고 현장 문을 잠갔고, 현장 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '그 순간 더 큰 폭발음이 터졌고, 더 빠른 알림이 쏟아졌고, 더 많은 피해자 이름이 화면을 채웠고, 주인공은 더 크게 소리치며 더 깊은 복도로 달렸다.',
        '현장 기록의 빈칸과 피해자의 휴대폰 로그가 같은 초 단위로 맞물리자, 그는 피해자의 휴대폰을 다시 쥐고 더 급하게 다음 문을 열어젖혔다. 앱 알림이 실제 사건과 맞아떨어졌다는 첫 규칙은 피해자의 사망 시각과 함께 눈앞에서 굳어졌다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고, 과거 미제 사건 번호가 현재 사건 기록과 연결되자, 예고 앱의 개발자와 과거 미제 사건의 연결은 앱 로고와 미제 사건 번호가 같은 파일 위에서 겹치며 드러났고, 주인공 가족 실종 파일 번호도 같은 묶음 아래 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-tension-reset-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-tension-reset-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('tension_reset_plan'),
        }),
      ])
    );
  });

  it('fails when a declared high tension peak is not staged by the chapter', () => {
    const peakPlot = {
      ...plot,
      tension_curve: {
        key_peaks: [
          {
            chapter: 1,
            event: '조력자가 예고 앱에게 납치된다.',
            tension_level: 9,
          },
        ],
      },
    };

    const result = evaluateEngagementContract({
      design,
      plot: peakPlot,
      chapter: {
        ...alignedChapter,
        reader_experience: {
          ...alignedChapter.reader_experience,
          cliffhanger_strength: 6,
        },
      },
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toEqual(
      expect.arrayContaining([
        'tension-peak-not-staged',
        'weak-peak-cliffhanger',
      ])
    );
    expect(result.breakdown.tensionCurveAlignment).toBeLessThan(70);
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'tension-peak-not-staged',
          priority: 'critical',
          target: 'tension_curve',
          expected: '조력자가 예고 앱에게 납치된다.',
        }),
        expect.objectContaining({
          code: 'weak-peak-cliffhanger',
          priority: 'high',
          target: 'reader_experience',
        }),
      ])
    );
  });

  it('fails when a declared high tension peak is only summarized in manuscript prose', () => {
    const peakEvent = '조력자가 예고 앱에게 납치된다.';
    const peakPlot = {
      ...plot,
      tension_curve: {
        key_peaks: [
          {
            chapter: 1,
            event: peakEvent,
            tension_level: 9,
          },
        ],
      },
    };
    const peakChapter = {
      ...alignedChapter,
      scenes: [
        alignedChapter.scenes[0],
        {
          ...alignedChapter.scenes[1],
          beat:
            `${alignedChapter.scenes[1].beat} ${peakEvent} 주인공은 선택지를 잃고 즉시 추적 경로를 바꾼다.`,
        },
      ],
    };

    const result = evaluateEngagementContract({
      design,
      plot: peakPlot,
      chapter: peakChapter,
      manuscript: [
        '조력자가 예고 앱에게 납치된다.',
        '긴장감이 최고조에 달했고 독자는 큰 위기를 느낀다.',
        '그 일은 중요한 전환점이 된다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-tension-peak-not-evidenced'
    );
    expect(issueCodes(result.issues)).not.toContain('tension-peak-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-tension-peak-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('declared high-tension peak on page'),
        }),
      ])
    );
  });

  it('fails when high tension is compressed into the ending without an ordered manuscript wave', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: alignedChapter,
      manuscript: [
        '주인공은 오전 내내 사건 자료를 정리했다.',
        '그는 앱 알림과 현장 기록을 대조했고 첫 규칙 증명이라는 결론을 메모했다.',
        '그 과정은 조용했고 선택지는 아직 변하지 않았다.',
        '마지막 구간에 제한 시간 안에 피해자를 찾으려 하자 누군가 통제선 조명을 꺼뜨리고 현장 철문을 잠갔으며, 그는 비상계단으로 우회해 피해자의 휴대폰 로그를 붙잡고 앱 알림이 실제 사건과 맞아떨어지는 첫 규칙 증명을 확인했다.',
        '피해자의 휴대폰에서 새 알림이 뜨며 주인공 이름이 다음 수신자로 다시 깜박이고 과거 미제 사건 번호가 현재 사건 기록과 연결되자 왜 첫 수신자가 자신인지 묻는 질문이 남았다.',
      ].join('\n'),
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(85);
    expect(issueCodes(result.issues)).toContain(
      'manuscript-tension-wave-not-evidenced'
    );
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-tension-wave-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('tension wave'),
        }),
      ])
    );
  });

  it('fails when an early chapter misses its first-five retention plan beat', () => {
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          first_five_chapter_retention_plan: [
            '1화: 조력자가 앱 개발자와 통화한 흔적을 발견하고 배후 미스터리를 연다',
            ...design.reader_promise_contract.first_five_chapter_retention_plan.slice(1),
          ],
        },
      },
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('retention-plan-drift');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'retention-plan-drift',
          priority: 'critical',
          target: 'scenes',
          expected: '조력자가 앱 개발자와 통화한 흔적을 발견하고 배후 미스터리를 연다',
        }),
      ])
    );
  });

  it('fails when the chapter page-turn question abandons the design irresistible question', () => {
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          irresistible_question: '숨겨진 왕국의 왕좌는 누가 차지하는가?',
        },
      },
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('irresistible-question-drift');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'irresistible-question-drift',
          priority: 'critical',
          target: 'plot_strategy',
          expected: '숨겨진 왕국의 왕좌는 누가 차지하는가?',
        }),
      ])
    );
  });

  it('fails when the chapter ending abandons the design binge reason', () => {
    const result = evaluateEngagementContract({
      design: {
        reader_promise_contract: {
          ...design.reader_promise_contract,
          binge_reason: '각 화 말미에 왕관의 저주와 사라진 왕자가 연결된다.',
        },
      },
      plot,
      chapter: alignedChapter,
    });

    expect(result.passed).toBe(false);
    expect(result.breakdown.promiseAlignment).toBeLessThan(80);
    expect(issueCodes(result.issues)).toContain('binge-reason-not-staged');
    expect(result.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'binge-reason-not-staged',
          priority: 'critical',
          target: 'final_scene',
          expected: '각 화 말미에 왕관의 저주와 사라진 왕자가 연결된다.',
        }),
      ])
    );
  });

  it('flags missing core hook and fun spec drift as critical engagement failures', () => {
    const result = evaluateEngagementContract({
      design,
      plot,
      chapter: {
        ...alignedChapter,
        reader_experience: {
          promise_fulfillment: '주인공은 이상한 메시지를 받고 불안해한다.',
          chapter_reward: '분위기를 조성한다.',
          page_turner_question: '',
          character_appeal_moment: '주인공은 잠시 망설인다.',
          drop_off_risk: '설명이 길다.',
          must_click_ending: '그는 집으로 돌아간다.',
          cliffhanger_strength: 3,
        },
      },
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(70);
    expect(issueCodes(result.issues)).toEqual(
      expect.arrayContaining([
        'missing-core-hook',
        'reader-reward-drift',
        'page-turner-question-drift',
        'character-appeal-drift',
        'must-click-ending-drift',
        'weak-cliffhanger',
      ])
    );
    expect(result.issues.filter(issue => issue.severity === 'critical').length).toBeGreaterThanOrEqual(3);
    expect(result.revisionDirectives[0]).toMatchObject({
      code: 'reader-reward-drift',
      priority: 'critical',
      target: 'reader_experience',
    });
  });
});

function issueCodes(issues: EngagementContractIssue[]): string[] {
  return issues.map(issue => issue.code);
}
