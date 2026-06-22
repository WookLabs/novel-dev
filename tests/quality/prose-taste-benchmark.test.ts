import { describe, it, expect } from 'vitest';
import { evaluateProseTasteBenchmark } from '../../src/quality/prose-taste-benchmark.js';
import type { ProseTasteBenchmarkSample } from '../../src/quality/prose-taste-benchmark.js';

const CLEAN_BALANCED = `
비가 그친 뒤 골목은 조용했다.

서연은 구겨진 봉투를 다시 펴지 않았다. 안에 든 이름을 이미 알고 있었고, 그래서 더 늦게 문을 두드렸다.

"들어와."

짧은 대답 뒤로 컵이 받침에 닿는 소리가 났다. 서연은 봉투를 탁자 끝에 내려놓고, 상대가 먼저 손을 뻗을 때까지 기다렸다.
`.trim();

const FUNCTIONAL_REPORT_PROSE = `
도현은 실험실 문을 열었다. 감각이 왔다. 반응이 잡혔다. 변화가 있었다.

첫 번째 병은 위험했다. 두 번째 병은 단서였다. 세 번째 병은 복선이었다. 이 장면은 다음 회차의 보상 쾌감으로 이어질 것이다.

손끝이 저릿했다. 심장이 뛰었다. 숨이 막혔다. 가슴이 조여왔다.
`.trim();

const DENSE_LYRICAL = `
장막처럼 내린 비가 유리 지붕을 오래 두드렸다. 물방울은 천천히 모여 검은 처마 끝에서 떨어졌고, 그때마다 연못 위에는 작은 금빛 원이 열렸다가 닫혔다.

하린은 젖은 편지를 품 안쪽에 넣었다. 종이의 모서리가 심장 바로 옆을 긁었지만, 그는 그 통증을 밀어내지 않았다. 잊으려 할수록 더 선명해지는 이름들이 있었다.
`.trim();

const HEDGED_HAZY_PROSE = `
도현은 현관 앞에 선 것 같았다. 문 너머의 소리는 어쩐지 경고처럼 느껴졌다. 열쇠 구멍의 빛은 묘하게 흔들리는 듯했다.

그는 이미 늦은 것 같았고, 지금 돌아서는 선택도 분명하지 않은 모양이었다. 모든 판단이 어렴풋이 뒤로 밀리는 느낌이었다.
`.trim();

const ABSTRACT_FILTERED_PROSE = `
도현은 진실과 운명과 기억의 의미를 생각했다. 도현은 그 감정의 가능성을 알 수 있었다. 도현은 관계의 균열과 선택의 고통을 깨달았다. 도현은 침묵의 불안과 상처의 존재를 느꼈다. 도현은 이 모든 혼란이 결국 절망과 희망 사이에 있다는 사실을 이해했다.

그는 그 결심이 자신의 의지와 욕망을 증명한다고 생각했다. 그는 그 상실의 공허함이 구원의 가능성이라고 알 수 있었다. 그는 이 모든 감정이 아직 끝나지 않았다는 사실을 깨달았다.
`.trim();

const EXPOSITORY_DIALOGUE_PROSE = `
민준은 파일을 탁자 위에 밀어 놓았다.

"설명하자면, 이 앱의 규칙은 살인이 일어나기 전 첫 수신자에게만 알림을 보내는 거야."
"핵심은 과거 미제 사건 번호와 가족 실종 파일이 같은 시스템으로 연결됐다는 뜻이야."
"정리하면 개발자는 다음 표적을 고르는 조건을 이미 알고 있었고, 우리는 그 원리를 찾아야 해."
"결론은 이 조직의 실험 목적이 피해자를 예측하는 능력을 검증하는 데 있다는 거야."

서연은 컵을 만지지 않았다.
`.trim();

const ROTE_DIALOGUE_REPLY_PROSE = `
민준은 파일을 탁자 위에 밀어 놓았다.

"네."
"그래."
"알겠어."
"맞아."
"그렇지."
"좋아."

서연은 컵을 만지지 않았다.
`.trim();

const MECHANICAL_DIALOGUE_TAG_PROSE = `
민준은 문 앞을 막아섰다.

"지금 문을 열면 그 사람이 네 이름을 부를 거야." 민준이 말했다.
"그 사람이 내 이름을 어떻게 알아?" 서연이 물었다.
"어제 네가 버린 봉투를 주웠으니까." 민준이 대답했다.
"그럼 네가 먼저 말했어야지." 서연이 말했다.
"말하면 네가 바로 나갔을 테니까." 민준이 말했다.
"그 판단까지 네가 대신하지 마." 서연이 대답했다.

문틈 아래로 젖은 종이 냄새가 밀려왔다.
`.trim();

const SILENCE_STALL_PROSE = `
민준은 봉투를 탁자 한가운데 밀어 놓았다.
서연은 아무 말도 하지 않았고, 접힌 모서리만 오래 눌렀다.
민준은 대답하지 않은 채 컵 받침을 조금 돌렸다.
서연은 입을 열지 않았고 복도 쪽 발소리만 세었다.
침묵이 이어졌지만 누구도 봉투를 집어 들지 않았다.
창밖의 빗물이 난간을 두드렸다.
`.trim();

const MELODRAMATIC_CAPTION_PROSE = `
서연은 봉투를 탁자 위에 내려놓았다.
민준은 믿을 수 없다는 얼굴로 접힌 모서리만 바라보았다.
이건 말도 안 되는 일이라는 문장이 머릿속에서만 돌았다.
모든 것이 무너진 것 같았지만 그는 아무것도 묻지 않았다.
세상이 멈춘 듯했고 컵 받침의 물자국만 커졌다.
끝났다는 생각이 들자 그는 의자 등받이를 조금 밀었다.
문밖의 발소리는 가까워졌다.
`.trim();

const STOCK_REACTION_BEAT_PROSE = `
서연은 숨을 삼켰다.
민준은 입술을 깨물었다.
서연은 시선을 피했다.
민준은 고개를 숙였다.
서연의 손이 떨렸다.
민준은 주먹을 쥐었다.
`.trim();

const PROP_FIDGET_LOOP_PROSE = `
서연은 컵을 만졌다.
민준은 봉투를 접었다.
서연은 휴대폰을 만졌다.
민준은 펜을 굴렸다.
서연은 열쇠를 쥐었다.
민준은 카드를 문질렀다.
`.trim();

const BACKSTORY_INFO_DUMP_PROSE = `
서연은 어린 시절부터 늘 문 앞에서 기다리는 아이였다.
그때부터 그녀는 누구도 쉽게 믿지 못하는 사람이 되었다.
몇 년 전의 사고는 가족의 모든 관계를 바꾸어 놓았다.
그날 이후 서연은 작은 소리에도 과거의 복도를 떠올렸다.
예전의 약속은 아직도 그녀의 선택을 설명하는 이유였다.
오래전 남은 비밀은 두 사람 사이의 침묵을 만들었다.

민준은 탁자 앞에 앉아 있었다.
`.trim();

const RELATIONSHIP_MONTAGE_SUMMARY_PROSE = `
시간이 흘렀고 두 사람의 거리는 점점 가까워졌다.
며칠 사이 서연은 민준을 조금씩 믿게 되었다.
그동안 민준의 마음도 서서히 달라졌다.
두 사람 사이의 오해는 어느새 풀려 있었다.
그렇게 관계는 이전보다 깊어졌다.
결국 서로에게 특별한 존재가 되었다.
`.trim();

const TIME_SKIP_SUMMARY_CHAIN_PROSE = `
며칠이 지났다.
준비는 끝났다.
계획은 완성됐다.
사람들은 각자 움직였다.
상황은 빠르게 달라졌다.
필요한 것은 모두 갖춰졌다.
남은 것은 결전뿐이었다.
`.trim();

const CONTRASTIVE_REFRAME_CADENCE_PROSE = `
그건 승리가 아니었다.
유예였다.
그건 선택이 아니었다.
대가였다.
문제는 두려움이 아니었다.
익숙함이었다.
남은 것은 희망이 아니었다.
경고였다.
`.trim();

const LORE_NAME_OVERLOAD_PROSE = `
아르카디온 왕국은 칠성 교단과 백은 마탑의 계약으로 세워졌다고 전해졌다.
흑요석 제국군은 에테르 코어와 루멘 룬을 관리하는 황실 프로토콜에 속해 있었다.
청염 길드는 제3게이트 던전과 성역 결계를 아카데미 랭크 시스템으로 분류했다.
노바 재단은 성물 의식과 성검 예언을 원로원 프로젝트의 법칙으로 기록했다.
서연은 그 모든 이름을 한 번에 듣고도 컵을 잡지 못했다.
`.trim();

const SYSTEM_STAT_BLOCK_DUMP_PROSE = `
상태창이 떠올랐다.
레벨 12.
힘 34.
민첩 28.
체력 40.
스킬 화염구 Lv. 3.
보상 경험치 500.
퀘스트가 갱신됐다.
스탯 포인트 3을 획득했다.
등급은 B로 상승했다.
`.trim();

const DECLARED_RESOLVE_LOOP_PROSE = `
서연은 더 이상 물러설 수 없다고 결심했다.
그녀는 반드시 진실을 밝혀야 한다고 다짐했다.
이제는 두려움을 피하지 않기로 했다.
민준도 끝까지 버티기로 마음먹었다.
두 사람은 포기할 수 없다는 각오를 다시 세웠다.
그러나 봉투도, 전화도, 문도 아직 움직이지 않았다.
`.trim();

const REVELATION_SUMMARY_LEAP_PROSE = `
서연은 그제야 모든 것을 깨달았다.
흩어져 있던 단서들이 하나로 이어졌다.
진실은 처음부터 민준을 가리키고 있었다.
모든 의문이 풀렸고 답은 명확했다.
이제 남은 것은 진실을 밝히는 일뿐이었다.
`.trim();

const PROCEDURAL_CHECKLIST_CADENCE_PROSE = `
서연은 파일을 확인했다.
통화 기록을 검토했다.
사진 뒷면의 번호를 대조했다.
로그 파일을 다시 열었다.
CCTV 시간을 정리했다.
민준은 자료를 분류했다.
모든 기록은 조사 목록에 추가됐다.
`.trim();

const ACTION_CHOREOGRAPHY_LOOP_PROSE = `
서연은 검을 휘둘렀다.
상대는 몸을 낮춰 피했다.
민준은 주먹을 날렸다.
괴물은 방패로 막았다.
서연은 다시 칼을 찔렀다.
상대는 뒤로 물러섰다.
민준은 발차기를 넣었다.
`.trim();

const EMOTION_LABEL_CAROUSEL_PROSE = `
서연은 불안했다.
민준은 후회했다.
서연은 당황했다.
민준은 분노했다.
두 사람은 절망했다.
방 안의 공기는 어색했고 누구도 선택을 바꾸지 않았다.
`.trim();

const SENSORY_WALLPAPER_PROSE = `
차가운 빛이 복도 바닥에 번졌다.
비릿한 냄새가 창문 근처에 머물렀다.
축축한 바람이 피부를 스쳤다.
희미한 그림자가 벽에 흔들렸다.
귓가에는 낮은 울림만 남았다.
서연은 아무것도 선택하지 않았다.
`.trim();

const BODY_REACTION_SUBJECT_PROSE = `
심장이 빠르게 뛰었다.
숨이 목 안에서 막혔다.
목구멍이 바싹 말랐다.
손끝이 저릿하게 굳었다.
가슴이 차갑게 내려앉았다.
`.trim();

const CLICHE_EMOTION_IMAGE_PROSE = `
눈물이 뺨을 타고 흘렀다.
시간은 멈춘 듯했다.
세상이 무너진 듯했다.
머릿속이 하얘졌다.
칼날처럼 날카로운 침묵이 두 사람 사이에 내려앉았다.
모든 것이 끝났다.
`.trim();

const SYMBOLIC_ABSTRACTION_STACK_PROSE = `
운명은 진실과 기억의 의미 위에 검은 그림자를 남겼다.
상실과 구원은 침묵의 심연 속에서 서로를 부르고 있었다.
죄책감과 희망은 공허한 관계의 균열을 따라 비극처럼 번졌다.
선택과 대가는 끝없는 상징의 어둠으로 가라앉았다.
`.trim();

const IMMERSIVE_RHYTHM_FLATLINE_PROSE = `
서연은 이 상황이 더 이상 단순한 오해가 아니라고 생각했다.
민준의 침묵은 두 사람 사이의 거리를 보여 주는 결과였다.
관계는 이미 예전과 다른 상태가 되어 있었다.
모든 선택은 결국 서로를 시험하는 의미였다.
불안은 더 커졌고 확신은 점점 작아졌다.
그녀는 자신이 왜 멀어졌는지 알 수 있었다.
그 시간은 두 사람에게 중요한 의미로 남아 있었다.
`.trim();

const UNIFORM_SENTENCE_LENGTH_PROSE = `
서연은 낡은 지도를 접어 탁자 가장자리에 조심스럽게 올려두었다.
민준은 꺼진 녹음기를 확인하고 손바닥으로 먼지를 한 번 밀어냈다.
도현은 창가의 가방을 열어 젖은 사진 네 장을 차례로 펼쳤다.
혜린은 벽시계 아래에 붙은 주소를 노트 첫 줄에 그대로 옮겼다.
서연은 붉은 표시 옆에 남은 숫자를 펜끝으로 천천히 눌렀다.
민준은 복도 쪽 발소리를 듣고도 의자 등받이를 다시 세웠다.
도현은 마지막 사진을 뒤집어 봉투 안쪽의 얼룩과 나란히 맞췄다.
혜린은 열린 문틈을 바라보다가 지도 위의 세 번째 원을 가렸다.
`.trim();

const VAGUE_ATMOSPHERE_PROSE = `
복도에는 묘한 공기가 감돌았다.
서연은 알 수 없는 감각을 느꼈다.
민준의 침묵은 무거운 기분을 남겼다.
두 사람 사이에는 낯선 긴장이 흘렀다.
문틈의 어둠은 불길한 예감처럼 가라앉았다.
아무도 무엇이 달라졌는지 말하지 않았다.
`.trim();

const RHETORICAL_QUESTION_PROSE = `
왜 하필 지금일까?
서연은 어떻게 해야 할까?
문 너머의 남자는 정말 민준일까?
지금 나가면 모든 게 끝나는 걸까?
그렇다면 도망쳐야 할까?
아무도 손잡이를 잡지 않았다.
`.trim();

const SUBTEXT_OVEREXPLAINED_PROSE = `
민준은 컵을 내려놓았다.
그 침묵은 거절이라는 뜻이었다.
서연의 시선은 아직 믿지 못하겠다는 의미였다.
민준의 짧은 웃음은 더는 설명하지 않겠다는 경고였다.
문 앞에 멈춘 발은 도망치고 싶다는 마음을 보여 주었다.
아무도 손잡이를 잡지 않았다.
`.trim();

const AMBIGUOUS_REFERENCE_PROSE = `
민준은 서연에게 봉투를 내밀었다. 도현은 문 앞에서 휴대폰을 들고 있었다.
그는 그것을 바라보았다.
그녀는 그 말을 믿지 않았다.
그는 그에게 그것을 넘겼다.
그것은 그 사실을 더 흐리게 만들었다.
그는 다시 그녀를 보았다.
서연은 봉투를 접었다.
`.trim();

const GENERIC_TEASER_PROSE = `
서연은 봉투를 탁자 위에 내려놓았다. 그는 아직 몰랐다. 이것이 모든 비극의 시작이었다.

민준은 문밖의 발소리를 듣고도 고개를 돌리지 않았다. 그 침묵은 다가올 파국의 예고였다. 운명은 이미 조용히 움직이고 있었다.
`.trim();

function styleFriction(issueCode: NonNullable<ProseTasteBenchmarkSample['expectedIssueCodes']>[number]) {
  return {
    location: '문단 1',
    reason: `독자가 ${issueCode} 때문에 장면 밖으로 밀려난다고 표시했다.`,
    issueCode,
    severity: 'high' as const,
    readerCount: 2,
    readerSegment: 'style-sensitive',
    rewriteSuggestion: '추상 설명을 줄이고 장면 안 행동, 사물, 대화 반응으로 다시 쓴다.',
  };
}

function styleHighlight(
  quality: NonNullable<NonNullable<ProseTasteBenchmarkSample['styleHighlightAnnotations']>[number]['quality']> = 'subtext'
) {
  return {
    location: '문단 2',
    reason: '독자가 감정을 설명받지 않고 봉투를 내려놓는 지연 행동에서 긴장을 읽었다.',
    quality,
    readerCount: 2,
    readerSegment: 'genre-core',
    targetText: '서연은 봉투를 탁자 끝에 내려놓고, 상대가 먼저 손을 뻗을 때까지 기다렸다.',
    transferGuidance: '감정 라벨 대신 사물 배치, 행동 지연, 대화 직전 침묵으로 압박을 재현한다.',
  };
}

describe('evaluateProseTasteBenchmark', () => {
  it('measures false positives and false negatives across labeled samples', () => {
    const samples: ProseTasteBenchmarkSample[] = [
      {
        id: 'clean-balanced-pass',
        content: CLEAN_BALANCED,
        expectedPassed: true,
        expectedMinScore: 88,
      },
      {
        id: 'functional-report-fail',
        content: FUNCTIONAL_REPORT_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['functional-ai-report', 'design-jargon-in-prose'],
        expectedMaxScore: 87,
      },
    ];

    const result = evaluateProseTasteBenchmark(samples);

    expect(result).toMatchObject({
      total: 2,
      passed: 2,
      failed: 0,
      falsePositiveCount: 0,
      falseNegativeCount: 0,
      missingIssueCount: 0,
      scoreOutOfRangeCount: 0,
      accuracy: 1,
    });
  });

  it('supports mode-specific calibration to avoid blocking intended lyrical prose', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'lyrical-sample-pass',
        content: DENSE_LYRICAL,
        expectedPassed: true,
        profile: {
          preferredMode: 'lyrical',
          minimumScore: 88,
        },
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.falseNegativeCount).toBe(0);
  });

  it('preserves chapter and version metadata for chapter-gate integration', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'chapter-001-style-pass',
        chapter: 1,
        version: 2,
        content: CLEAN_BALANCED,
        expectedPassed: true,
        expectedMinScore: 88,
      },
    ]);

    expect(result.sampleResults[0]).toMatchObject({
      id: 'chapter-001-style-pass',
      chapter: 1,
      version: 2,
    });
  });

  it('measures hedged perception haze as its own disliked prose habit', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'hedged-hazy-style-fail',
        content: HEDGED_HAZY_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['hedged-perception-haze'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('hedged-perception-haze');
  });

  it('uses sample-level profile overrides for hedged perception density', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'intentionally-uncertain-style-pass',
        content: HEDGED_HAZY_PROSE,
        expectedPassed: true,
        profile: {
          preferredMode: 'lyrical',
          maxHedgedPerceptionDensityPer1000: 30,
        },
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.falsePositiveCount).toBe(0);
  });

  it('benchmarks prose friction from abstract exposition and cognitive filtering', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'abstract-filtered-style-fail',
        content: ABSTRACT_FILTERED_PROSE,
        expectedPassed: false,
        expectedIssueCodes: [
          'abstract-exposition-drift',
          'cognitive-filtering-overload',
          'repeated-subject-rhythm',
        ],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toEqual(expect.arrayContaining([
      'abstract-exposition-drift',
      'cognitive-filtering-overload',
      'repeated-subject-rhythm',
    ]));
  });

  it('benchmarks expository dialogue dumps as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'expository-dialogue-style-fail',
        content: EXPOSITORY_DIALOGUE_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['expository-dialogue-dump'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('expository-dialogue-dump');
    expect(result.sampleResults[0].gate.metrics.expositoryDialogueRatio).toBe(1);
  });

  it('benchmarks rote dialogue response chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'rote-dialogue-style-fail',
        content: ROTE_DIALOGUE_REPLY_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['rote-dialogue-response-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('rote-dialogue-response-chain');
    expect(result.sampleResults[0].gate.metrics.roteDialogueReplyRatio).toBe(1);
    expect(result.sampleResults[0].gate.metrics.longestRoteDialogueReplyRun).toBe(6);
  });

  it('benchmarks mechanical neutral dialogue tag chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'mechanical-dialogue-tag-style-fail',
        content: MECHANICAL_DIALOGUE_TAG_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['mechanical-dialogue-tag-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('mechanical-dialogue-tag-chain');
    expect(result.sampleResults[0].gate.metrics.neutralDialogueTagRatio).toBe(1);
    expect(result.sampleResults[0].gate.metrics.longestNeutralDialogueTagRun).toBe(6);
  });

  it('benchmarks silence or non-answer stall chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'silence-stall-style-fail',
        content: SILENCE_STALL_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['dialogue-silence-stall-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('dialogue-silence-stall-chain');
    expect(result.sampleResults[0].gate.metrics.silenceStallDensityPer1000).toBe(4);
    expect(result.sampleResults[0].gate.metrics.longestSilenceStallRun).toBe(4);
  });

  it('benchmarks melodramatic emotion caption chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'melodramatic-caption-style-fail',
        content: MELODRAMATIC_CAPTION_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['melodramatic-emotion-caption-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('melodramatic-emotion-caption-chain');
    expect(result.sampleResults[0].gate.metrics.melodramaticCaptionDensityPer1000).toBe(5);
    expect(result.sampleResults[0].gate.metrics.longestMelodramaticCaptionRun).toBe(5);
  });

  it('benchmarks stock reaction beat chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'stock-reaction-beat-style-fail',
        content: STOCK_REACTION_BEAT_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['stock-reaction-beat-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('stock-reaction-beat-chain');
    expect(result.sampleResults[0].gate.metrics.stockReactionBeatDensityPer1000).toBe(6);
    expect(result.sampleResults[0].gate.metrics.longestStockReactionBeatRun).toBe(6);
  });

  it('benchmarks prop fidget loops as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'prop-fidget-style-fail',
        content: PROP_FIDGET_LOOP_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['prop-fidget-loop'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('prop-fidget-loop');
    expect(result.sampleResults[0].gate.metrics.propFidgetBeatDensityPer1000).toBe(6);
    expect(result.sampleResults[0].gate.metrics.longestPropFidgetBeatRun).toBe(6);
  });

  it('benchmarks backstory info dumps as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'backstory-info-dump-style-fail',
        content: BACKSTORY_INFO_DUMP_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['backstory-info-dump-block'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('backstory-info-dump-block');
    expect(result.sampleResults[0].gate.metrics.backstoryExpositionDensityPer1000).toBe(6);
    expect(result.sampleResults[0].gate.metrics.longestBackstoryExpositionRun).toBe(6);
  });

  it('benchmarks relationship montage summaries as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'relationship-montage-summary-style-fail',
        content: RELATIONSHIP_MONTAGE_SUMMARY_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['relationship-montage-summary'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain(
      'relationship-montage-summary'
    );
    expect(
      result.sampleResults[0].gate.metrics.relationshipMontageSummaryDensityPer1000
    ).toBe(6);
    expect(result.sampleResults[0].gate.metrics.longestRelationshipMontageSummaryRun).toBe(6);
  });

  it('benchmarks time skip summary chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'time-skip-summary-chain-style-fail',
        content: TIME_SKIP_SUMMARY_CHAIN_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['time-skip-summary-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain(
      'time-skip-summary-chain'
    );
    expect(
      result.sampleResults[0].gate.metrics.timeSkipSummaryDensityPer1000
    ).toBeGreaterThanOrEqual(5);
    expect(result.sampleResults[0].gate.metrics.longestTimeSkipSummaryRun).toBeGreaterThan(2);
  });

  it('benchmarks contrastive reframe cadence as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'contrastive-reframe-cadence-style-fail',
        content: CONTRASTIVE_REFRAME_CADENCE_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['contrastive-reframe-cadence'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain(
      'contrastive-reframe-cadence'
    );
    expect(
      result.sampleResults[0].gate.metrics.contrastiveReframeDensityPer1000
    ).toBeGreaterThanOrEqual(6);
    expect(result.sampleResults[0].gate.metrics.longestContrastiveReframeRun).toBeGreaterThan(2);
  });

  it('benchmarks lore name overload as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'lore-name-overload-style-fail',
        content: LORE_NAME_OVERLOAD_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['lore-name-overload'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('lore-name-overload');
    expect(result.sampleResults[0].gate.metrics.loreTermOverloadSentenceCount).toBeGreaterThanOrEqual(4);
    expect(result.sampleResults[0].gate.metrics.longestLoreTermRun).toBeGreaterThan(3);
  });

  it('benchmarks system stat block dumps as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'system-stat-block-dump-style-fail',
        content: SYSTEM_STAT_BLOCK_DUMP_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['system-stat-block-dump'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('system-stat-block-dump');
    expect(
      result.sampleResults[0].gate.metrics.systemStatBlockDensityPer1000
    ).toBeGreaterThanOrEqual(5);
    expect(result.sampleResults[0].gate.metrics.longestSystemStatBlockRun).toBeGreaterThan(2);
  });

  it('benchmarks declared resolve loops as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'declared-resolve-loop-style-fail',
        content: DECLARED_RESOLVE_LOOP_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['declared-resolve-loop'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('declared-resolve-loop');
    expect(
      result.sampleResults[0].gate.metrics.declaredResolveDensityPer1000
    ).toBeGreaterThanOrEqual(5);
    expect(result.sampleResults[0].gate.metrics.longestDeclaredResolveRun).toBeGreaterThan(3);
  });

  it('benchmarks revelation summary leaps as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'revelation-summary-leap-style-fail',
        content: REVELATION_SUMMARY_LEAP_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['revelation-summary-leap'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('revelation-summary-leap');
    expect(
      result.sampleResults[0].gate.metrics.revelationSummaryDensityPer1000
    ).toBeGreaterThanOrEqual(4);
    expect(result.sampleResults[0].gate.metrics.longestRevelationSummaryRun).toBeGreaterThan(2);
  });

  it('benchmarks procedural checklist cadence as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'procedural-checklist-cadence-style-fail',
        content: PROCEDURAL_CHECKLIST_CADENCE_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['procedural-checklist-cadence'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('procedural-checklist-cadence');
    expect(
      result.sampleResults[0].gate.metrics.proceduralChecklistDensityPer1000
    ).toBeGreaterThanOrEqual(5);
    expect(result.sampleResults[0].gate.metrics.longestProceduralChecklistRun).toBeGreaterThan(3);
  });

  it('benchmarks action choreography loops as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'action-choreography-loop-style-fail',
        content: ACTION_CHOREOGRAPHY_LOOP_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['action-choreography-loop'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('action-choreography-loop');
    expect(
      result.sampleResults[0].gate.metrics.actionChoreographyDensityPer1000
    ).toBeGreaterThanOrEqual(5);
    expect(result.sampleResults[0].gate.metrics.longestActionChoreographyRun).toBeGreaterThan(3);
  });

  it('benchmarks emotion label carousels as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'emotion-label-carousel-style-fail',
        content: EMOTION_LABEL_CAROUSEL_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['emotion-label-carousel'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('emotion-label-carousel');
    expect(result.sampleResults[0].gate.metrics.longestEmotionLabelRun).toBe(5);
  });

  it('benchmarks sensory wallpaper runs as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'sensory-wallpaper-style-fail',
        content: SENSORY_WALLPAPER_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['sensory-wallpaper-run'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('sensory-wallpaper-run');
    expect(result.sampleResults[0].gate.metrics.longestSensoryWallpaperRun).toBe(5);
  });

  it('benchmarks body reaction subject chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'body-reaction-subject-style-fail',
        content: BODY_REACTION_SUBJECT_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['body-reaction-subject-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('body-reaction-subject-chain');
    expect(result.sampleResults[0].gate.metrics.bodyReactionSubjectDensityPer1000).toBe(5);
    expect(result.sampleResults[0].gate.metrics.longestBodyReactionSubjectRun).toBe(5);
  });

  it('benchmarks cliche emotion image chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'cliche-emotion-image-style-fail',
        content: CLICHE_EMOTION_IMAGE_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['cliche-emotion-image-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('cliche-emotion-image-chain');
    expect(result.sampleResults[0].gate.metrics.clicheEmotionImageDensityPer1000).toBe(6);
    expect(result.sampleResults[0].gate.metrics.longestClicheEmotionImageRun).toBe(6);
  });

  it('benchmarks symbolic abstraction stacks as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'symbolic-abstraction-style-fail',
        content: SYMBOLIC_ABSTRACTION_STACK_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['symbolic-abstraction-stack'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('symbolic-abstraction-stack');
    expect(result.sampleResults[0].gate.metrics.symbolicAbstractionDensityPer1000).toBe(4);
    expect(result.sampleResults[0].gate.metrics.longestSymbolicAbstractionRun).toBe(4);
  });

  it('benchmarks uniform sentence length cadence as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'uniform-sentence-length-style-fail',
        content: UNIFORM_SENTENCE_LENGTH_PROSE,
        profile: {
          maxTopicMarkerStarterDensityPer1000: 100,
          maxTopicMarkerStarterRun: 20,
          maxStatusQuoActionDensityPer1000: 100,
          maxStatusQuoActionRun: 20,
          minCausalTurnDensityPer1000: 0,
        },
        expectedPassed: false,
        expectedIssueCodes: ['uniform-sentence-length-cadence'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('uniform-sentence-length-cadence');
    expect(result.sampleResults[0].gate.metrics.sentenceLengthVariationCoefficient).toBeLessThan(0.24);
    expect(result.sampleResults[0].gate.metrics.longestUniformSentenceLengthRun).toBeGreaterThan(6);
  });

  it('benchmarks immersive rhythm flatline as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'immersive-rhythm-flatline-style-fail',
        content: IMMERSIVE_RHYTHM_FLATLINE_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['immersive-rhythm-flatline'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('immersive-rhythm-flatline');
    expect(result.sampleResults[0].gate.metrics.longestImmersiveRhythmFlatlineRun).toBeGreaterThan(5);
    expect(result.sampleResults[0].gate.metrics.immersiveRhythmAnchorDensityPer1000).toBe(0);
  });

  it('benchmarks vague atmosphere modifier chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'vague-atmosphere-style-fail',
        content: VAGUE_ATMOSPHERE_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['vague-atmosphere-modifier-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('vague-atmosphere-modifier-chain');
    expect(result.sampleResults[0].gate.metrics.vagueAtmosphereModifierDensityPer1000).toBe(5);
    expect(result.sampleResults[0].gate.metrics.longestVagueAtmosphereModifierRun).toBe(5);
  });

  it('benchmarks rhetorical self-question chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'rhetorical-question-style-fail',
        content: RHETORICAL_QUESTION_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['rhetorical-question-drift'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('rhetorical-question-drift');
    expect(result.sampleResults[0].gate.metrics.rhetoricalQuestionDensityPer1000).toBe(5);
    expect(result.sampleResults[0].gate.metrics.longestRhetoricalQuestionRun).toBe(5);
  });

  it('benchmarks subtext overexplanation chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'subtext-overexplained-style-fail',
        content: SUBTEXT_OVEREXPLAINED_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['subtext-overexplanation-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('subtext-overexplanation-chain');
    expect(result.sampleResults[0].gate.metrics.subtextExplanationDensityPer1000).toBe(4);
    expect(result.sampleResults[0].gate.metrics.longestSubtextExplanationRun).toBe(4);
  });

  it('benchmarks ambiguous reference chains as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'ambiguous-reference-style-fail',
        content: AMBIGUOUS_REFERENCE_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['ambiguous-reference-chain'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('ambiguous-reference-chain');
    expect(result.sampleResults[0].gate.metrics.ambiguousReferenceDensityPer1000).toBeGreaterThanOrEqual(5);
    expect(result.sampleResults[0].gate.metrics.longestAmbiguousReferenceRun).toBeGreaterThan(3);
  });

  it('benchmarks generic omniscient teaser lines as disliked prose friction', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'generic-teaser-style-fail',
        content: GENERIC_TEASER_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['generic-omniscient-teaser'],
        expectedMaxScore: 87,
      },
    ]);

    expect(result.failed).toBe(0);
    expect(result.sampleResults[0].issueCodes).toContain('generic-omniscient-teaser');
    expect(result.sampleResults[0].gate.metrics.genericTeaserDensityPer1000).toBeGreaterThan(2);
  });

  it('marks prose style tuning ready only when reader taste segments are balanced', () => {
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'genre-core-preferred',
          readerSegment: 'genre-core',
          content: CLEAN_BALANCED,
          expectedPassed: true,
          expectedMinScore: 88,
          styleHighlightAnnotations: [
            styleHighlight(),
            styleHighlight('rhythm'),
          ],
        },
        {
          id: 'genre-core-irritating',
          readerSegment: 'genre-core',
          content: FUNCTIONAL_REPORT_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['functional-ai-report', 'design-jargon-in-prose'],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            styleFriction('functional-ai-report'),
            styleFriction('design-jargon-in-prose'),
          ],
        },
        {
          id: 'platform-native-hedged',
          readerSegment: 'platform-native',
          content: HEDGED_HAZY_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['hedged-perception-haze'],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            {
              ...styleFriction('hedged-perception-haze'),
              readerSegment: 'platform-native',
            },
          ],
        },
        {
          id: 'style-sensitive-abstract',
          readerSegment: 'style-sensitive',
          calibrationSplit: 'holdout',
          content: ABSTRACT_FILTERED_PROSE,
          expectedPassed: false,
          expectedIssueCodes: [
            'abstract-exposition-drift',
            'cognitive-filtering-overload',
            'repeated-subject-rhythm',
          ],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            styleFriction('abstract-exposition-drift'),
            styleFriction('cognitive-filtering-overload'),
            styleFriction('repeated-subject-rhythm'),
          ],
        },
      ],
      {
        requiredReaderSegments: ['genre-core', 'platform-native', 'style-sensitive'],
        minimumReaderSegmentCount: 3,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 1,
        maximumDominantReaderSegmentRatio: 0.6,
        requireStyleHighlightQualityDiversity: true,
        minimumStyleHighlightQualityCount: 2,
      }
    );

    expect(result.failed).toBe(0);
    expect(result.readyForStyleTuning).toBe(true);
    expect(result.styleFingerprintStatus).toBe('separated');
    expect(result.weakStyleFingerprintCount).toBe(0);
    expect(result.styleFingerprintSignalCount).toBeGreaterThan(0);
    expect(result.styleFingerprint.signals[0]).toMatchObject({
      direction: 'disliked-higher',
    });
    expect(result.readerSegmentRepresentativeness).toBe('balanced');
    expect(result.readerSegments).toEqual(['genre-core', 'platform-native', 'style-sensitive']);
    expect(result.dominantReaderSegmentRatio).toBe(0.5);
    expect(result.splitCoverage).toMatchObject({
      holdoutSamples: 1,
      usableHoldoutSamples: 1,
      failingHoldoutSamples: 1,
      usableFailingHoldoutSamples: 1,
    });
    expect(result.splitLeakageCount).toBe(0);
    expect(result.splitLeakages).toEqual([]);
    expect(result.underSampledUsableFailingHoldoutSamples).toBe(false);
    expect(result.weakStyleFrictionAnnotationCount).toBe(0);
    expect(result.weakStyleHighlightQualityDiversityCount).toBe(0);
    expect(result.styleHighlightQualityCount).toBe(2);
    expect(result.styleHighlightQualities).toEqual(['subtext', 'rhythm']);
    expect(result.actionableStyleFrictionAnnotationCount).toBe(6);
    expect(result.sampleResults[0].readerSegment).toBe('genre-core');
    expect(result.sampleResults[3]).toMatchObject({
      styleTuningUsable: true,
      styleFrictionAnnotationCoverage: 'covered',
    });
  });

  it('keeps style tuning disabled when labels are right but style fingerprint separation is weak', () => {
    const dislikedPhraseOnly = `${CLEAN_BALANCED}\n\n금지문구`;
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'preferred-clean',
          readerSegment: 'style-sensitive',
          calibrationSplit: 'calibration',
          content: CLEAN_BALANCED,
          expectedPassed: true,
          expectedMinScore: 88,
          styleHighlightAnnotations: [
            styleHighlight(),
          ],
        },
        {
          id: 'disliked-phrase-only',
          readerSegment: 'style-sensitive',
          calibrationSplit: 'holdout',
          content: dislikedPhraseOnly,
          expectedPassed: false,
          profile: {
            dislikedPhrases: ['금지문구'],
          },
          expectedIssueCodes: ['explicit-disliked-phrase'],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            {
              ...styleFriction('explicit-disliked-phrase'),
              rewriteSuggestion: '금지 문구를 지우는 데서 끝내지 말고, 왜 그 문구가 장면 리듬과 취향을 망치는지 대체 문장 기준을 만든다.',
            },
          ],
        },
      ],
      {
        requiredReaderSegments: ['style-sensitive'],
        minimumReaderSegmentCount: 1,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 1,
        maximumDominantReaderSegmentRatio: 1,
      }
    );

    expect(result.failed).toBe(0);
    expect(result.readyForStyleTuning).toBe(false);
    expect(result.styleFingerprintStatus).toBe('weak');
    expect(result.weakStyleFingerprintCount).toBe(1);
    expect(result.styleFingerprintSignalCount).toBe(0);
    expect(result.recommendations.join('\n')).toContain('style fingerprint');
  });

  it('keeps authorial style continuity stable across chapter-grounded preferred samples', () => {
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'chapter-1-style',
          readerSegment: 'genre-core',
          chapter: 1,
          content: CLEAN_BALANCED,
          expectedPassed: true,
        },
        {
          id: 'chapter-2-style',
          readerSegment: 'genre-core',
          chapter: 2,
          content: CLEAN_BALANCED,
          expectedPassed: true,
        },
        {
          id: 'chapter-3-style',
          readerSegment: 'genre-core',
          chapter: 3,
          content: CLEAN_BALANCED,
          expectedPassed: true,
        },
      ],
      {
        requiredReaderSegments: ['genre-core'],
        minimumReaderSegmentCount: 1,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 0,
        maximumDominantReaderSegmentRatio: 1,
        requireHoldoutForStyleTuning: false,
        requireFrictionAnnotationsForStyleTuning: false,
        requireStyleHighlightAnnotationsForStyleTuning: false,
        requireStyleFingerprintSeparation: false,
        requireAuthorialStyleContinuity: true,
        minimumAuthorialStyleContinuitySamples: 3,
        maximumAuthorialStyleDrift: 0,
      }
    );

    expect(result.readyForStyleTuning).toBe(true);
    expect(result.authorialStyleDriftStatus).toBe('stable');
    expect(result.weakAuthorialStyleDriftCount).toBe(0);
    expect(result.authorialStyleDrift).toMatchObject({
      continuitySampleCount: 3,
      pairCount: 2,
      maxDistance: 0,
      driftPairs: [],
    });
  });

  it('keeps style tuning disabled when preferred chapter samples drift in authorial style', () => {
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'chapter-1-style',
          readerSegment: 'genre-core',
          chapter: 1,
          content: CLEAN_BALANCED,
          expectedPassed: true,
          profile: { preferredMode: 'lyrical' },
          threshold: 0,
        },
        {
          id: 'chapter-2-style',
          readerSegment: 'genre-core',
          chapter: 2,
          content: DENSE_LYRICAL,
          expectedPassed: true,
          profile: { preferredMode: 'lyrical' },
          threshold: 0,
        },
        {
          id: 'chapter-3-style',
          readerSegment: 'genre-core',
          chapter: 3,
          content: CLEAN_BALANCED,
          expectedPassed: true,
          profile: { preferredMode: 'lyrical' },
          threshold: 0,
        },
      ],
      {
        requiredReaderSegments: ['genre-core'],
        minimumReaderSegmentCount: 1,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 0,
        maximumDominantReaderSegmentRatio: 1,
        requireHoldoutForStyleTuning: false,
        requireFrictionAnnotationsForStyleTuning: false,
        requireStyleHighlightAnnotationsForStyleTuning: false,
        requireStyleFingerprintSeparation: false,
        requireAuthorialStyleContinuity: true,
        minimumAuthorialStyleContinuitySamples: 3,
        maximumAuthorialStyleDrift: 0.1,
      }
    );

    expect(result.failed).toBe(0);
    expect(result.readyForStyleTuning).toBe(false);
    expect(result.authorialStyleDriftStatus).toBe('drifted');
    expect(result.weakAuthorialStyleDriftCount).toBe(1);
    expect(result.authorialStyleDriftMaxDistance).toBeGreaterThan(0.1);
    expect(result.authorialStyleDrift.driftPairs[0]).toMatchObject({
      fromSampleId: 'chapter-1-style',
      toSampleId: 'chapter-2-style',
    });
    expect(result.recommendations.join('\n')).toContain('authorial style drift');
  });

  it('rejects split leakage when the same prose evidence appears in calibration and holdout', () => {
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'preferred-calibration',
          readerSegment: 'genre-core',
          calibrationSplit: 'calibration',
          content: CLEAN_BALANCED,
          expectedPassed: true,
          expectedMinScore: 88,
          styleHighlightAnnotations: [
            styleHighlight(),
          ],
        },
        {
          id: 'preferred-holdout-duplicate',
          readerSegment: 'genre-core',
          calibrationSplit: 'holdout',
          content: CLEAN_BALANCED,
          expectedPassed: true,
          expectedMinScore: 88,
          styleHighlightAnnotations: [
            styleHighlight(),
          ],
        },
      ],
      {
        requiredReaderSegments: ['genre-core'],
        minimumReaderSegmentCount: 1,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 0,
        maximumDominantReaderSegmentRatio: 1,
        minimumHoldoutSampleCount: 1,
        minimumUsableHoldoutSampleCount: 1,
        minimumFailingHoldoutSampleCount: 0,
        minimumUsableFailingHoldoutSampleCount: 0,
        requireFrictionAnnotationsForStyleTuning: false,
        requireStyleFingerprintSeparation: false,
      }
    );

    expect(result.failed).toBe(0);
    expect(result.splitLeakageCount).toBe(1);
    expect(result.splitLeakages[0]).toMatchObject({
      sampleIds: ['preferred-calibration', 'preferred-holdout-duplicate'],
      calibrationSplits: ['calibration', 'holdout'],
    });
    expect(result.splitLeakages[0].fingerprint).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(result.sampleResults[0].evidenceFingerprint).toBe(
      result.sampleResults[1].evidenceFingerprint
    );
    expect(result.readyForStyleTuning).toBe(false);
    expect(result.recommendations.join('\n')).toContain('same manuscript text');
  });

  it('keeps style tuning disabled when usable prose taste evidence is only calibration samples', () => {
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'genre-core-preferred',
          readerSegment: 'genre-core',
          calibrationSplit: 'calibration',
          content: CLEAN_BALANCED,
          expectedPassed: true,
          expectedMinScore: 88,
          styleHighlightAnnotations: [
            styleHighlight(),
          ],
        },
        {
          id: 'genre-core-irritating',
          readerSegment: 'genre-core',
          calibrationSplit: 'calibration',
          content: FUNCTIONAL_REPORT_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['functional-ai-report', 'design-jargon-in-prose'],
          expectedMaxScore: 87,
        },
        {
          id: 'platform-native-hedged',
          readerSegment: 'platform-native',
          calibrationSplit: 'calibration',
          content: HEDGED_HAZY_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['hedged-perception-haze'],
          expectedMaxScore: 87,
        },
        {
          id: 'style-sensitive-abstract',
          readerSegment: 'style-sensitive',
          calibrationSplit: 'calibration',
          content: ABSTRACT_FILTERED_PROSE,
          expectedPassed: false,
          expectedIssueCodes: [
            'abstract-exposition-drift',
            'cognitive-filtering-overload',
            'repeated-subject-rhythm',
          ],
          expectedMaxScore: 87,
        },
      ],
      {
        requiredReaderSegments: ['genre-core', 'platform-native', 'style-sensitive'],
        minimumReaderSegmentCount: 3,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 1,
        maximumDominantReaderSegmentRatio: 0.6,
      }
    );

    expect(result.failed).toBe(0);
    expect(result.readerSegmentRepresentativeness).toBe('balanced');
    expect(result.splitCoverage).toMatchObject({
      calibrationSamples: 4,
      usableCalibrationSamples: 1,
      holdoutSamples: 0,
      usableHoldoutSamples: 0,
      failingHoldoutSamples: 0,
      usableFailingHoldoutSamples: 0,
    });
    expect(result.underSampledHoldoutSamples).toBe(true);
    expect(result.underSampledUsableHoldoutSamples).toBe(true);
    expect(result.underSampledFailingHoldoutSamples).toBe(true);
    expect(result.underSampledUsableFailingHoldoutSamples).toBe(true);
    expect(result.readyForStyleTuning).toBe(false);
    expect(result.missingStyleFrictionAnnotationCount).toBe(3);
    expect(result.sampleResults[1]).toMatchObject({
      passed: true,
      styleTuningUsable: false,
      styleFrictionAnnotationCoverage: 'none',
    });
    expect(result.recommendations.join('\n')).toContain('holdout');
  });

  it('keeps style tuning disabled when disliked prose annotations are not actionable', () => {
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'preferred',
          readerSegment: 'genre-core',
          calibrationSplit: 'calibration',
          content: CLEAN_BALANCED,
          expectedPassed: true,
          expectedMinScore: 88,
          styleHighlightAnnotations: [
            styleHighlight(),
          ],
        },
        {
          id: 'genre-core-irritating',
          readerSegment: 'genre-core',
          calibrationSplit: 'calibration',
          content: FUNCTIONAL_REPORT_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['functional-ai-report', 'design-jargon-in-prose'],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            {
              location: '문단 1',
              reason: '독자가 기능 보고체처럼 읽힌다고 표시했다.',
              issueCode: 'functional-ai-report',
            },
          ],
        },
        {
          id: 'platform-native-hedged',
          readerSegment: 'platform-native',
          calibrationSplit: 'validation',
          content: HEDGED_HAZY_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['hedged-perception-haze'],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            {
              ...styleFriction('hedged-perception-haze'),
              readerSegment: 'platform-native',
            },
          ],
        },
        {
          id: 'style-sensitive-abstract',
          readerSegment: 'style-sensitive',
          calibrationSplit: 'holdout',
          content: ABSTRACT_FILTERED_PROSE,
          expectedPassed: false,
          expectedIssueCodes: [
            'abstract-exposition-drift',
            'cognitive-filtering-overload',
            'repeated-subject-rhythm',
          ],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            styleFriction('abstract-exposition-drift'),
            styleFriction('cognitive-filtering-overload'),
            styleFriction('repeated-subject-rhythm'),
          ],
        },
      ],
      {
        requiredReaderSegments: ['genre-core', 'platform-native', 'style-sensitive'],
        minimumReaderSegmentCount: 3,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 1,
        maximumDominantReaderSegmentRatio: 0.6,
      }
    );

    expect(result.failed).toBe(0);
    expect(result.readyForStyleTuning).toBe(false);
    expect(result.weakStyleFrictionAnnotationCount).toBe(1);
    expect(result.sampleResults[1]).toMatchObject({
      passed: true,
      styleTuningUsable: false,
      styleFrictionAnnotationCoverage: 'partial',
    });
    expect(result.sampleResults[1].styleFrictionAnnotationIssues.join('\n')).toContain(
      'expected issue code'
    );
    expect(result.recommendations.join('\n')).toContain('actionable');
  });

  it('keeps style tuning disabled when preferred prose has no positive style highlights', () => {
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'preferred-without-highlight',
          readerSegment: 'genre-core',
          calibrationSplit: 'calibration',
          content: CLEAN_BALANCED,
          expectedPassed: true,
          expectedMinScore: 88,
        },
        {
          id: 'genre-core-irritating',
          readerSegment: 'genre-core',
          calibrationSplit: 'calibration',
          content: FUNCTIONAL_REPORT_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['functional-ai-report', 'design-jargon-in-prose'],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            styleFriction('functional-ai-report'),
            styleFriction('design-jargon-in-prose'),
          ],
        },
        {
          id: 'platform-native-hedged',
          readerSegment: 'platform-native',
          calibrationSplit: 'validation',
          content: HEDGED_HAZY_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['hedged-perception-haze'],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            {
              ...styleFriction('hedged-perception-haze'),
              readerSegment: 'platform-native',
            },
          ],
        },
        {
          id: 'style-sensitive-abstract',
          readerSegment: 'style-sensitive',
          calibrationSplit: 'holdout',
          content: ABSTRACT_FILTERED_PROSE,
          expectedPassed: false,
          expectedIssueCodes: [
            'abstract-exposition-drift',
            'cognitive-filtering-overload',
            'repeated-subject-rhythm',
          ],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            styleFriction('abstract-exposition-drift'),
            styleFriction('cognitive-filtering-overload'),
            styleFriction('repeated-subject-rhythm'),
          ],
        },
      ],
      {
        requiredReaderSegments: ['genre-core', 'platform-native', 'style-sensitive'],
        minimumReaderSegmentCount: 3,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 1,
        maximumDominantReaderSegmentRatio: 0.6,
      }
    );

    expect(result.failed).toBe(0);
    expect(result.readyForStyleTuning).toBe(false);
    expect(result.missingStyleHighlightAnnotationCount).toBe(1);
    expect(result.sampleResults[0]).toMatchObject({
      passed: true,
      styleTuningUsable: false,
      styleHighlightAnnotationCoverage: 'none',
    });
    expect(result.recommendations.join('\n')).toContain('style_highlight_annotations');
  });

  it('keeps style tuning disabled when positive style highlights lack quality diversity', () => {
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'preferred-single-quality',
          readerSegment: 'genre-core',
          calibrationSplit: 'calibration',
          content: CLEAN_BALANCED,
          expectedPassed: true,
          expectedMinScore: 88,
          styleHighlightAnnotations: [
            styleHighlight(),
          ],
        },
        {
          id: 'genre-core-irritating',
          readerSegment: 'genre-core',
          calibrationSplit: 'calibration',
          content: FUNCTIONAL_REPORT_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['functional-ai-report', 'design-jargon-in-prose'],
          expectedMaxScore: 87,
          styleFrictionAnnotations: [
            styleFriction('functional-ai-report'),
            styleFriction('design-jargon-in-prose'),
          ],
        },
      ],
      {
        requiredReaderSegments: ['genre-core'],
        minimumReaderSegmentCount: 1,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 1,
        maximumDominantReaderSegmentRatio: 1,
        requireHoldoutForStyleTuning: false,
        requireStyleFingerprintSeparation: false,
        requireStyleHighlightQualityDiversity: true,
        minimumStyleHighlightQualityCount: 2,
      }
    );

    expect(result.failed).toBe(0);
    expect(result.readyForStyleTuning).toBe(false);
    expect(result.styleHighlightQualityCount).toBe(1);
    expect(result.styleHighlightQualities).toEqual(['subtext']);
    expect(result.weakStyleHighlightQualityDiversityCount).toBe(1);
    expect(result.recommendations.join('\n')).toContain('distinct qualities');
    expect(result.recommendations.join('\n')).toContain('bland');
  });

  it('keeps style tuning disabled when prose taste samples come from one taste segment', () => {
    const result = evaluateProseTasteBenchmark(
      [
        {
          id: 'core-preferred',
          readerSegment: 'genre-core',
          content: CLEAN_BALANCED,
          expectedPassed: true,
          expectedMinScore: 88,
        },
        {
          id: 'core-irritating',
          readerSegment: 'genre-core',
          content: FUNCTIONAL_REPORT_PROSE,
          expectedPassed: false,
          expectedIssueCodes: ['functional-ai-report', 'design-jargon-in-prose'],
          expectedMaxScore: 87,
        },
      ],
      {
        requiredReaderSegments: ['genre-core', 'platform-native', 'style-sensitive'],
        minimumReaderSegmentCount: 3,
        minimumSamplesPerReaderSegment: 1,
        minimumFailingSamplesPerReaderSegment: 1,
        maximumDominantReaderSegmentRatio: 0.6,
      }
    );

    expect(result.failed).toBe(0);
    expect(result.readyForStyleTuning).toBe(false);
    expect(result.readerSegmentRepresentativeness).toBe('narrow');
    expect(result.missingRequiredReaderSegments).toEqual(['platform-native', 'style-sensitive']);
    expect(result.underSampledFailingReaderSegments).toEqual(['platform-native', 'style-sensitive']);
    expect(result.recommendations.join('\n')).toContain('reader segments');
  });

  it('reports false positives when a bad sample is mislabeled as expected pass', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'mislabeled-bad-sample',
        content: FUNCTIONAL_REPORT_PROSE,
        expectedPassed: true,
      },
    ]);

    expect(result.failed).toBe(1);
    expect(result.falseNegativeCount).toBe(1);
    expect(result.sampleResults[0].failureType).toBe('false-negative');
  });

  it('reports missing expected issues separately from pass/fail mismatch', () => {
    const result = evaluateProseTasteBenchmark([
      {
        id: 'wrong-issue-expectation',
        content: FUNCTIONAL_REPORT_PROSE,
        expectedPassed: false,
        expectedIssueCodes: ['explicit-disliked-phrase'],
      },
    ]);

    expect(result.failed).toBe(1);
    expect(result.missingIssueCount).toBe(1);
    expect(result.sampleResults[0].failureType).toBe('missing-issue');
  });
});
