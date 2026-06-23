---
name: 05-gen-plot
description: "Use this skill when generating per-chapter plot files from completed designs. Triggers on: '플롯 생성', '회차별 플롯', 'gen plot'."
user-invocable: true
---

# /gen-plot - 회차별 플롯 생성 (팀 기반)

$ARGUMENTS

설계 완료 후, 5명의 플롯 팀이 collaborative 모드로 회차별 상세 플롯을 생성합니다.
plot-architect가 초안을 만들고, arc-designer/lore-keeper/character-designer/engagement-optimizer가 검증합니다.

## Provider 선택

기본: **Claude** (구조화 JSON 출력, 비용 효율)
- `--codex`: Codex로 전환 (비용 절감)
- 프로젝트 override: `meta/project.json`의 `provider_routing.gen-plot`

## Quick Start

```bash
/gen-plot           # Claude로 실행 (기본)
/gen-plot --claude  # Codex로 실행 (--codex)
```

## Prerequisites

Before execution, verify these files exist:
- `meta/project.json` - Project metadata
- `meta/style-guide.json` - Style guide
- `plot/structure.json` - Plot structure (at least skeleton)
- `plot/main-arc.json` - Main arc
- `plot/foreshadowing.json` - Foreshadowing elements
- `characters/` - At least one character file

If any file is missing, report error and suggest `/init` or `/design` commands.

## --codex: Codex CLI(GPT-5.4) 플롯 생성

`$ARGUMENTS`에 `--codex`가 있으면 각 회차 플롯을 Codex CLI로 생성합니다:
```spec
for chapter in 1..total_chapters:
    Bash("node scripts/codex-writer.mjs --chapter {chapter} --project {projectPath} --mode gen-plot")
```

## 실행

### Phase 0: 플롯 전략 수립 (자동)

팀 실행 전에 plot-architect가 설계 산출물을 분석하여 전체 회차 배분 전략을 수립합니다:

```spec
Task(subagent_type="novel-dev:plot-architect", model="opus", prompt="
프로젝트: {projectPath}

플롯 전략을 수립하세요:
1. 다음 파일들을 읽고 분석:
   - plot/structure.json (막 구분, 총 회차)
   - plot/main-arc.json (메인 아크)
   - plot/sub-arcs/*.json (서브 아크)
   - plot/foreshadowing.json (복선)
   - plot/hooks.json (훅)
   - plot/timeline.json (타임라인)
   - characters/*.json (캐릭터)
   - meta/design-strategy.json (reader_promise_contract)

2. templates/plot-strategy.template.json 구조를 참고하여
   meta/plot-strategy.json 생성

포함할 내용:
- 아크별 회차 할당 (어느 아크가 어느 회차에서 진행되는지)
- 각 회차 `arc_beats`: 이 회차가 큰 줄거리의 메인/서브 아크를 어떻게 전진시키는지 구체적 발견, 결정, 반전, 손실, 되돌릴 수 없는 상태 변화로 작성합니다. `arc_beats`가 `context.current_plot`, `reader_experience`, scene conflict/beat에 장면화되지 않으면 `arc-beat-not-staged`로 실패하고, 원고 본문에서 실행되지 않으면 `manuscript-arc-beat-not-evidenced`로 실패합니다. 큰 줄거리가 전진하지 않는 필러 회차를 만들지 마세요.
- binge_architecture: long_hook_threads, payoff_cadence, tension_reset_plan, fatigue_controls
- meta/design-strategy.json의 reader_promise_contract가 구체적 독자 약속이 아니고 일반어(흥미로운 사건, 매력적인 주인공, 재미와 감동, 다음 화가 궁금함) 중심이면 `reader-promise-generic`으로 반려합니다. 각 필드가 구체적이어도 `core_hook`, `novelty_angle`, `irresistible_question`, `binge_reason`, `long_series_engine`, `first_five_chapter_retention_plan`이 같은 전제 앵커를 공유하지 못하면 `reader-promise-premise-not-integrated`로 반려합니다. 플롯 전략은 고유 장치, 기억 가능한 단서, 주인공 선택/비용, 감정 보상 trigger를 회차별 fun_spec으로 전파해야 합니다.
- foundational engagement gates: `per_chapter_guide`가 없으면 `missing-chapter-guide`, 회차 `promise_fulfillment`가 `core_hook`을 잃으면 `missing-core-hook`, scene evidence가 없으면 `missing-scene-evidence`, concrete pressure가 있는 장면 갈등이 75% 미만이면 `weak-scene-conflict`, `cliffhanger_strength`가 7 미만이면 `weak-cliffhanger`, high-tension peak 대비 `cliffhanger_strength`가 약하면 `weak-peak-cliffhanger`로 실패합니다.
- first-page/retention/reward-ladder prevention gates: 초반 5화는 `first_five_chapter_retention_plan`의 해당 비트를 scene evidence로 stage하지 못하면 `retention-plan-drift`로 실패합니다. 1화 첫 문단은 `core_hook` 또는 `novelty_angle`을 즉시 보여주어 `opening-hook-not-evidenced`와 `opening-hook-delayed`를 방지합니다. 또한 1화 첫 1~2문장은 전제 이름표가 아니라 주인공의 행동/선택 압박, 감각 또는 POV 앵커, 미해결 위험/질문을 함께 가져 `opening-hook-not-embodied`를 방지해야 합니다. `chapter_reward`는 단순 확인이 아니라 고유 장치, 규칙 변화, 장르 보상 체감, 다음 행동 압박을 만들어 `manuscript-reward-freshness-not-evidenced`를 방지하고, payoff delight / 보상 쾌감은 압박 축적, 벌어낸 단서 해소, 의미 변화, 몸 반응, 즉시 새 결과를 한 보상 고점에 묶어 `manuscript-payoff-delight-not-evidenced`를 방지합니다. genre-specific delight / 장르 쾌감은 미스터리의 단서 결합/추론/남는 의문, 로맨스의 거리 변화/취약한 대화/관계 선택, 액션의 추격 동선/전술 반전/신체 결과, 스릴러의 조여드는 위협/덫 확대/거짓 반전/강제 선택, 현대판타지의 시스템 피드백/스킬 활용/대가/현실 결과를 감정 보상 장면에 설계해 `manuscript-genre-delight-not-evidenced`를 방지합니다. high-tension peak는 사건명이나 긴장감 설명이 아니라 구체 위험/장애물, 주인공 행동 또는 강제 선택, 되돌릴 수 없는 결과/폭로/새 질문을 한 장면 고점으로 설계해 `manuscript-tension-peak-not-evidenced`를 방지합니다. high-tension 회차의 tension wave / 긴장 파형은 초반 압박과 열린 질문, 중반 악화와 선택지 축소, 말미 고점과 열린 질문을 순서대로 분산시켜 `manuscript-tension-wave-not-evidenced`를 방지합니다. 제한 시간, 카운트다운, 남은 n분, 기한, 사망 시각 같은 ticking-clock 압박을 쓰면 그 시간 압박 때문에 주인공 대응이 바뀌고 선택지/경로/증거/기한 중 하나가 닫히도록 설계해 `manuscript-temporal-pressure-not-evidenced`를 방지합니다. 답/폭로 직후에는 새 미해결 질문을 여는 질문 사다리로 설계해 `manuscript-question-ladder-not-evidenced`를 방지합니다. `must_click_ending`은 마지막 구간의 새 사건/폭로/위협/미해결 질문인 열린 루프로 설계해 `manuscript-ending-hook-not-staged`와 `manuscript-ending-hook-closed`를 방지합니다. 원고 마지막 열린 질문도 "이 사건의 진실은 무엇인가?"처럼 넓게 두지 말고 로고+사건 번호, 다음 수신자+사진, 이름+좌표, 규칙+대가 같은 구체 앵커를 최소 두 개 보존해 `manuscript-ending-hook-question-too-broad`를 방지합니다. ending hook setup / 말미 훅 준비 단서는 마지막 훅의 좌표, 사진, 명명 장소, 신원, 특수 물건 앵커를 앞선 장면의 구체 단서로 먼저 심어 `manuscript-ending-hook-setup-not-evidenced`를 방지합니다.
- forecast revision / 서사 예측 수정은 반전과 예측 불일치를 대작급 보상으로 쓰기 위한 규칙입니다. `chapter_reward`, scene beat, 또는 must-click ending에서 반전, 예상 뒤집힘, 오판, 가설 수정, 재해석을 약속하면 원고에서는 먼저 독자/주인공의 예상이나 가설을 세우고, 구체 단서나 사건으로 그 예상을 깨며, 결과적으로 가설, 용의자 순위, 단서 의미, 계획, 다음 검증 행동 중 하나를 바꾸게 설계해 `manuscript-forecast-revision-not-evidenced`를 방지합니다.
- core reader_experience drift는 `fun_spec`과 회차 `reader_experience`의 핵심 약속이 끊기는지 확인합니다. `reader_reward`/`chapter_reward`가 설계 보상과 어긋나면 `reader-reward-drift`, `page_turn_question`/`page_turner_question`이 중심 질문과 어긋나면 `page-turner-question-drift`, `character_appeal_moment`가 주인공 매력과 어긋나면 `character-appeal-drift`, `must_click_ending`이 연속 클릭 이유와 어긋나면 `must-click-ending-drift`, `drop_off_risk`가 이탈 위험 대응과 어긋나면 `drop-off-risk-drift`로 실패합니다.
- core scene staging은 핵심 약속이 장면에 실제로 들어갔는지 확인합니다. final scene이 `must_click_ending`을 stage하지 못하면 `must-click-ending-not-staged`, scene beat가 `chapter_reward`를 보상 사건으로 stage하지 못하면 `chapter-reward-not-staged`, `drop_off_risk` 완화 전략이 scene evidence에 보이지 않으면 `drop-off-risk-not-mitigated`, `tension_curve` peak event가 scene purpose/beat에 보이지 않으면 `tension-peak-not-staged`로 실패합니다.
- reader_promise_contract.long_series_engine은 binge_architecture.long_hook_threads와 각 회차 `promise_fulfillment`/scene evidence의 장기 미스터리 증거로 이어지게 설계합니다. 끊기면 `long-series-engine-drift`로 실패합니다.
- binge_architecture.long_hook_threads 중 최소 하나는 각 회차 scene evidence에 장기 훅으로 보이게 설계합니다. 보이지 않으면 `long-hook-thread-not-staged`로 실패합니다.
- 보이는 장기 훅은 매회 새 단서, 좁혀진 가설, 위험/대가 변화, 다음 검증 행동 중 하나로 실제 전진해야 합니다. 이름만 반복하면 `long-hook-thread-not-advanced`로 실패하고, 원고에서 같은 정체가 반복되면 `manuscript-long-hook-thread-not-advanced`로 실패합니다.
- binge_architecture.payoff_cadence는 각 회차 `chapter_reward`와 `must_click_ending`의 보상 주기로 보존합니다. 끊기면 `payoff-cadence-drift`로 실패합니다.
- binge_architecture.tension_reset_plan은 고강도 사건 뒤 호흡/완급/정적/추리 호흡을 낮춘 다음 새 질문, 새 알림, 새 위협으로 긴장을 재점화하게 설계합니다. 회차 promise_fulfillment, drop_off_risk, scene beat에 보이지 않으면 `tension-reset-not-staged`로 실패하고, 원고가 계속 고조만 반복하면 `manuscript-tension-reset-not-evidenced`로 실패합니다. `tension_curve`의 high-tension peak event는 scene evidence뿐 아니라 원고에서 압박/행동/결과 전환이 결합된 실제 고점으로 실행되어야 하며, 요약 처리되면 `manuscript-tension-peak-not-evidenced`로 실패합니다. 고강도 회차의 tension wave / 긴장 파형은 초반 압박, 중반 악화, 말미 고점, 열린 질문이 원고 순서로 보이게 설계해야 하며 누락 시 `manuscript-tension-wave-not-evidenced`로 실패합니다.
- binge_architecture.fatigue_controls는 각 회차 promise_fulfillment, drop_off_risk, scene conflict/beat에 피로도 방지 장치로 보이게 설계합니다. 조사/대화/전투 같은 반복 비트가 관계 압박, 장소 변주, 행동 방식 변주, 감정 리셋 없이 재생되면 `fatigue-control-not-staged`로 실패하고, 이후 원고 검증에서 `manuscript-fatigue-control-not-evidenced`로 실패합니다.
- serial escalation variety는 회차 간 반복 보상, 조사, 알림, 현장 실패 패턴을 그대로 재사용하지 않는 장기 연재 리듬입니다. 이전 1~2회차와 같은 보상/조사/알림/장소 구조를 쓰면 새 갈등 축(관계 파열, 반대세력 countermove, 장소/행동 방식 변주, 규칙 변화, 대가 상승, 되돌릴 수 없는 판도 변화)을 scene evidence에 stage해야 하며, 누락 시 `serial-escalation-variety-not-staged`, 원고 본문에서 누락 시 `manuscript-serial-escalation-variety-not-evidenced`로 실패합니다.
- serial reward pattern variation은 회차 간 보상 전달 방식 자체를 변주하는 규칙입니다. 새 갈등 축이 있어도 `chapter_reward`가 전 회차와 같은 로그-기록 대조/알림-규칙 증명을 이름만 바꿔 반복하면 `serial-reward-pattern-repetition-not-staged`로 실패하고, 원고 보상 순간이 반복되면 `manuscript-serial-reward-pattern-repetition-not-evidenced`로 실패합니다. 보상은 관계 배신, 반대세력 countermove, 행동 방식 반전, 대가 상승, 규칙 변이, 구체 사물 폭로 등 새 reward mode로 도착해야 합니다.
- cliffhanger carryover는 직전 회차의 prior must_click_ending을 다음 회차 current_plot, reader_experience, opening scene에서 즉시 이어받는 규칙입니다. 직전 회차 말미의 단서/위협/질문을 버리고 새 줄거리로 건너뛰는 미끼식 클리프행어는 `cliffhanger-carryover-not-staged`, planning에는 있지만 opening scene / first staged turn을 지나서야 처리하면 `cliffhanger-carryover-delayed`, 원고 초반에서 누락되면 `manuscript-cliffhanger-carryover-not-evidenced`, 첫 두 문장을 지나서야 처리하면 `manuscript-cliffhanger-carryover-delayed`로 실패합니다.
- scene choice-cost tradeoff는 각 회차 핵심 scene conflict/beat에 경쟁 선택지, 포기되는 대안, 선택-대가 비용을 함께 설계하는 규칙입니다. 단순히 위험을 감수하고 조사/발견/추격만 하면 `scene-choice-tradeoff-not-staged`로 실패합니다.
- choice-cost lock / 선택-대가 잠금은 주인공 선택의 대가가 선택지/관계/증거/시간/경로 중 하나를 되돌릴 수 없는 상태로 닫는지 확인합니다. scene conflict/beat에서 선택 후 닫힘, 차단, 사라짐, 노출, 확정이 없으면 `scene-choice-cost-lock-not-staged`, 이후 원고 검증에서 빠지면 `manuscript-choice-cost-lock-not-evidenced`로 실패합니다.
- choice-cost lock carryover / 선택-대가 잠금 이월은 전 회차의 잠긴 선택지가 다음 회차 압박으로 이어지는지 확인합니다. 전 회차 `context.next_plot` 또는 마지막 scene에서 닫힌 선택지/관계/증거/시간/경로를 다음 회차 `previous_summary`, `current_plot`, `reader_experience`, opening scene에 현재 제약으로 설계하지 않으면 `choice-cost-lock-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-choice-cost-lock-carryover-not-evidenced`로 실패합니다.
- revelation consequence carryover / 폭로 결과 이월은 전 회차 폭로가 다음 회차의 계획 변경, 새 압박, 용의자 지도, 관계 판단, 다음 질문으로 이어지는지 확인합니다. 전 회차 `chapter_reward`, `must_click_ending`, `context.next_plot`의 폭로가 다음 회차 `previous_summary`, `current_plot`, `reader_experience`, opening scene에 현재 행동 변화로 보이지 않으면 `revelation-consequence-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-revelation-consequence-carryover-not-evidenced`로 실패합니다.
- mystery hypothesis carryover / 추리 가설 이월은 직전 단서가 다음 회차의 가설 수정, 용의자 순위 재정렬, 용의자 제외/승격, 다음 검증 행동으로 이어지는지 확인합니다. 직전 단서가 다음 회차 `previous_summary`, `current_plot`, `reader_experience`, opening scene에 추론 상태 변화로 보이지 않으면 `mystery-hypothesis-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-mystery-hypothesis-carryover-not-evidenced`로 실패합니다.
- scene causal escalation은 장면 간 인과를 설계하는 규칙입니다. 이전 scene 결과가 `직후`, `그 결과`, `이어` 같은 인과 연결로 다음 scene 압박, 행동, 결과를 밀어야 하며, 끊기면 `scene-causal-escalation-not-staged`로 실패합니다.
- scene goal-tactic turn / 장면 목표-전술 전환은 각 핵심 scene conflict/beat가 주인공의 구체 목표, 그 목표를 막는 힘, 보이는 전술 또는 전술 전환, 바뀐 결과를 함께 갖는지 확인합니다. 사건 결과와 압박은 있지만 주인공이 무엇을 원해 어떤 방법으로 밀고 나가거나 바꾸는지 없으면 `scene-goal-tactic-turn-not-staged`로 실패합니다.
- spatial blocking은 액션/위기 scene의 공간 블로킹을 설계하는 규칙입니다. 장소 기준점, 동선, 차단물, 거리 압박이 scene conflict/beat와 이후 원고에 보여야 하며, 원고에서 빠지면 `manuscript-spatial-blocking-not-evidenced`로 실패합니다.
- ending hook reaction은 마지막 scene beat의 `must_click_ending`을 사건 정보로만 끝내지 않고 주인공의 몸감각, 물리적 행동, 즉각 위험 반응으로 닫는 규칙입니다. 메타데이터에서 빠지면 `ending-hook-reaction-not-staged`, 원고에서 빠지면 `manuscript-ending-hook-reaction-not-evidenced`로 실패합니다.
- ending hook setup / 말미 훅 준비 단서는 `must_click_ending`의 좌표, 사진, 명명 장소, 신원, 특수 물건 앵커가 불공정한 새 정보로 튀어나오지 않게 하는 규칙입니다. 앞선 장면에 발견/확인/기록/흔적 같은 구체 단서로 심지 않고 마지막 scene beat에서만 새 좌표나 사진을 던지면 이후 원고 검증에서 `manuscript-ending-hook-setup-not-evidenced`로 실패합니다.
- reader_promise_contract.first_five_chapter_retention_plan을 1~5화 per_chapter_guide와 reader_experience에 직접 반영
- reader_promise_contract.protagonist_appeal은 각 회차 `character_appeal_moment`와 scene beat/conflict 안의 주인공 매력 선택/행동/비용으로 이어지게 설계합니다. 끊기면 `protagonist-appeal-drift`로 실패합니다.
- `characters/*.json`의 주인공 `inner.want`(욕망)와 `inner.need`(결핍)는 각 회차 context, `character_development`, `character_appeal_moment`, scene conflict/beat에서 선택/대가/도움 요청/포기/달라진 행동으로 stage해야 합니다. 회차 메타데이터에 보이지 않으면 `character-drive-not-staged`, 원고 본문에서 실행되지 않으면 `manuscript-character-drive-not-evidenced`로 실패합니다.
- character drive carryover / 내적 변화 이월은 직전 내적 변화가 다음 회차 행동으로 남는지 확인합니다. 직전 내적 변화가 도움 요청, 습관 내려놓기, 통제권 나누기, 달라진 행동으로 `previous_summary`, `current_plot`, `reader_experience`, opening scene에 보이지 않으면 `character-drive-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-character-drive-carryover-not-evidenced`로 실패합니다.
- reader_promise_contract.novelty_angle은 각 회차 `reader_reward`, `promise_fulfillment`, scene beat 안에서 장르적 신선함과 차별점으로 보존합니다. 끊기면 `novelty-angle-drift`로 실패합니다.
- reader_promise_contract.emotional_payoff는 각 회차 `reader_reward`, `promise_fulfillment`, scene evidence 안에서 약속한 감정 보상으로 보존합니다. 끊기면 `emotional-payoff-drift`로 실패합니다.
- genre-specific delight / 장르 쾌감은 `emotional_payoff`가 약속한 장르 보상을 실제 장르 장면 문법으로 설계하는 규칙입니다. 미스터리는 단서 결합, 주인공 추론/행동, 더 날카로운 미해결 의문을 한 보상 흐름에 묶고, 로맨스는 거리 변화 또는 접촉, 취약한 대화, 관계 선택/비용, 몸의 설렘을 묶어야 하며, 액션은 추격 동선, 공간 제약, 전술 반전, 신체 결과를 묶어야 합니다. 스릴러는 조여드는 위협, 덫 확대, 거짓 반전, 강제 선택, 몸의 공포를 묶고, 현대판타지는 시스템 피드백, 스킬 활용, 대가/한계, 현실 결과나 등급 변화를 묶어야 하며, 판타지/성장물은 마법 규칙 발현, 대가/한계, 경이 이미지, 능력 변화나 결과를 묶어야 합니다. 감정명과 몸반응만 있고 장르별 독자 쾌감 장치가 없으면 이후 원고 검증에서 `manuscript-genre-delight-not-evidenced`로 실패합니다.
- `chapter_reward`는 earned reward, 즉 벌어낸 보상으로 설계합니다. 주인공의 단서 처리, 추론/선택, 그 결과로 이어지는 발견이 scene conflict/beat에 없고 자동 파일/안내문/보고서 같은 수동 설명으로 보상이 도착하면 이후 원고 검증에서 `manuscript-earned-reward-not-evidenced`로 실패합니다.
- reader_promise_contract.irresistible_question 중심 질문을 각 회차 `page_turn_question`과 `reader_experience.page_turner_question`의 페이지터너 질문으로 이어지게 설계합니다. 끊기면 `irresistible-question-drift`로 실패합니다.
- `page_turn_question`과 `reader_experience.page_turner_question`은 답을 설명하지 않는 open-loop 미해결 질문이어야 합니다. "설명된다", "밝혀진다", "해결된다", "때문이다"처럼 정답/해결을 닫는 문장이면 `page-turn-question-closed`로 실패합니다.
- `page_turn_question`과 `reader_experience.page_turner_question`은 좁혀진 정보 공백을 만들어야 합니다. "앱과 사건은 왜 연결되는가?"처럼 넓은 명사만 남기지 말고 로고+사건 번호, 이름+좌표, 다음 수신자+사진, 규칙+대가 같은 구체 앵커를 최소 두 개 결합합니다. 구체 앵커가 부족하면 `page-turn-question-too-broad`로 실패합니다.
- 마지막 scene beat는 `reader_experience.page_turner_question`을 낳는 구체 단서/폭로/위협/사물/사건을 stage해야 합니다. 질문이 메타데이터에만 있고 final scene에서 단서로 보이지 않으면 `page-turn-question-not-staged`로 실패합니다.
- 말미 반전은 fair twist로 설계합니다. 앞선 장면에 번호, 파일, 로그, 로고, 목소리, 녹음, 서명, 배지 같은 반전 준비 단서를 심지 않고 마지막 scene beat에서만 정체/배후/범인을 새로 밝히면 이후 원고 검증에서 `manuscript-fair-twist-setup-not-evidenced`로 실패합니다.
- forecast revision / 서사 예측 수정은 반전이 단순 충격어로 끝나지 않게 하는 원고 기준입니다. 반전, 예상 뒤집힘, 오판, 가설 수정, 재해석을 쓰는 회차는 독자/주인공의 예상, 그 예상을 깨는 단서나 사건, 바뀐 가설/용의자 순위/단서 의미/계획/다음 검증 행동을 scene conflict/beat에 함께 설계해야 하며, 이후 원고에서 빠지면 `manuscript-forecast-revision-not-evidenced`로 실패합니다.
- reader_promise_contract.binge_reason은 각 회차 `fun_spec.must_click_ending`, `reader_experience.must_click_ending`, 마지막 scene beat에 회차 말미 연속 클릭 이유로 보이게 설계합니다. 끊기면 `binge-reason-not-staged`로 실패합니다.
- 복선 plant/payoff 타이밍표 (foreshadowing.json 기반)
- 복선 장부는 `foreshadowing_schedule`을 기준으로 관리합니다. 회차의 `narrative_elements.foreshadowing_plant`와 `narrative_elements.foreshadowing_payoff`에 쓰는 ID는 반드시 `foreshadowing_schedule`에 있어야 하며, 없는 ID는 `foreshadowing-ledger-missing`으로 실패합니다. `foreshadowing_payoff`는 예정된 `payoff_chapter`와 같은 회차에서만 선언하고, 앞당겨 회수하면 `foreshadowing-payoff-timing-mismatch`로 실패합니다.
- foreshadowing plant concreteness / 복선 단서 구체화는 선언한 `foreshadowing_plant`가 실제 장면의 로고, 번호, 표식, 파일, 상처, 목소리, 사물, 감각 디테일 같은 물증으로 심겼는지 확인합니다. 복선을 "나중에 밝혀질 단서"처럼 추상 선언만 하면 `foreshadowing-plant-not-staged`, 원고 본문에서 빠지면 `manuscript-foreshadowing-plant-not-evidenced`로 실패합니다.
- foreshadowing payoff resolution / 복선 회수 장면화는 선언한 `foreshadowing_payoff`가 단서를 다시 보여주는 데서 끝나지 않고, 그 단서의 의미를 밝히고 원인/배후/숨은 연결을 드러낸 뒤 결과적으로 주인공의 행동, 위험, 관계, 다음 목표를 바꾸는지 확인합니다. 의미와 결과 없는 반복 단서면 `foreshadowing-payoff-not-staged`, 원고 본문에서 빠지면 `manuscript-foreshadowing-payoff-not-evidenced`로 실패합니다.
- 훅 장부는 `plot/hooks.json`의 `mystery_hooks`가 canonical입니다. 회차의 `narrative_elements.hooks_plant`와 `narrative_elements.hooks_reveal`에 쓰는 ID는 반드시 `mystery_hooks`에 있어야 하며, 없는 ID는 `hook-ledger-missing`으로 실패합니다. `hooks_reveal`은 예정된 `reveal_chapter`와 같은 회차에서만 선언하고, 앞당겨 공개하면 `hook-reveal-timing-mismatch`로 실패합니다.
- 전체 긴장 곡선 설계 (key peaks 명시)
- 회차별 페이싱 가이드
- POV 로테이션 전략
- 서브플롯-메인플롯 교차 지점
- 회차별 간략 가이드 (아크 비트, 복선, 훅, 감정 목표, fun_spec)
- 각 회차 fun_spec: reader_reward, page_turn_question, character_appeal_moment, drop_off_risk, must_click_ending
- 일반어 fun_spec 금지: "흥미로운 사건", "강한 반전", "다음 화가 궁금해지는 질문", "주인공이 매력을 보여준다"처럼 일반어만 있으면 `fun-spec-generic` 실패입니다. 구체적 fun_spec은 고유 장치/단서, 주인공 선택/비용, 결과/악화, must-click hook 증거를 포함해야 합니다.
- `character_appeal_moment`의 주인공 매력은 반드시 `protagonist_appeal`을 보존하면서 scene beat/conflict 안에서 선택/행동/비용으로 보이게 설계합니다. 동시에 `inner.want` 욕망 또는 `inner.need` 결핍이 선택과 대가를 압박해야 하며, 끊기면 `character-drive-not-staged`와 이후 원고 검증의 `manuscript-character-drive-not-evidenced`로 실패합니다. 설계 매력과 끊기면 `protagonist-appeal-drift`, scene evidence가 없으면 이후 검증에서 `character-appeal-not-staged`로 실패합니다. 얇은 매력 선언도 금지합니다. 최소 한 장면은 character appeal signature / 주인공 매력 시그니처 행동으로 고유 방식/특성, 주체적 행동, 비용 또는 취약성, visible story/social reaction을 같은 scene conflict/beat 안에 결합해야 하며, 없으면 `character-appeal-signature-not-staged`, 원고에서 분리되거나 빠지면 `manuscript-character-appeal-signature-not-evidenced`로 실패합니다.
- character drive carryover / 내적 변화 이월은 직전 내적 변화가 다음 회차 행동으로 남는지 확인합니다. 직전 내적 변화가 도움 요청, 습관 내려놓기, 통제권 나누기, 달라진 행동으로 `previous_summary`, `current_plot`, `reader_experience`, opening scene에 보이지 않으면 `character-drive-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-character-drive-carryover-not-evidenced`로 실패합니다.
- 주인공 선택은 scene choice-cost tradeoff, 즉 선택-대가 딜레마로 설계합니다. scene conflict/beat에 경쟁 선택지와 포기되는 대안이 없고 "위험을 감수하고 결정했다"만 있으면 `scene-choice-tradeoff-not-staged`, 이후 원고 검증에서 `manuscript-choice-tradeoff-not-evidenced`로 실패합니다.
- 주인공 선택은 choice-cost lock / 선택-대가 잠금도 가져야 합니다. 선택 직후 선택지/관계/증거/시간/경로 중 하나가 되돌릴 수 없는 방식으로 닫히거나 좁혀지지 않으면 `scene-choice-cost-lock-not-staged`, 원고 본문에서 그 잠금이 보이지 않으면 `manuscript-choice-cost-lock-not-evidenced`로 실패합니다.
- 주인공 선택의 잠금은 choice-cost lock carryover / 선택-대가 잠금 이월로 다음 회차까지 이어야 합니다. 전 회차에서 잠긴 선택지, 관계, 증거, 시간, 경로는 다음 회차 `previous_summary`, `current_plot`, opening scene의 다음 회차 압박으로 돌아와야 하며, 끊기면 `choice-cost-lock-carryover-not-staged`와 이후 원고 검증의 `manuscript-choice-cost-lock-carryover-not-evidenced`로 실패합니다.
- revelation consequence carryover / 폭로 결과 이월은 전 회차 폭로를 단순 요약으로 소비하지 않고 다음 회차의 계획 변경, 새 압박, 다음 질문으로 바꿔야 합니다. 전 회차 폭로가 현재 `previous_summary`, `current_plot`, `reader_experience`, opening scene의 행동 변화로 보이지 않으면 `revelation-consequence-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-revelation-consequence-carryover-not-evidenced`로 실패합니다.
- mystery hypothesis carryover / 추리 가설 이월은 전 회차의 중간 단서를 단순 확인으로 소비하지 않고 다음 회차의 가설 수정, 용의자 순위, 다음 검증 행동으로 바꿔야 합니다. 직전 단서가 현재 `previous_summary`, `current_plot`, `reader_experience`, opening scene의 추론 변화로 보이지 않으면 `mystery-hypothesis-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-mystery-hypothesis-carryover-not-evidenced`로 실패합니다.
- scene conflict/beat는 stakes clarity를 가져야 합니다. 돌이킬 수 없는 행동 전에 구체 손실 대상(피해자, 조력자, 가족, 정체, 목숨, 증거 등)과 닥친 위협/비용이 보이지 않으면 이후 원고 검증에서 `manuscript-stakes-not-evidenced`로 실패합니다.
- stakes subject specificity / 스테이크 대상 개인화도 함께 설계합니다. `피해자`, `표적`, `대상`, `수신자`, `사람` 같은 일반 명사만 쓰지 말고 첫 압박 창에서 이름, 관계, 역할, 소지품, 목소리, 메시지, 신분증, 사진, 사건/파일 번호 같은 구체 흔적을 붙입니다. 빠지면 이후 원고 검증에서 `manuscript-stakes-subject-not-personalized`로 실패합니다.
- reader desire intensity / 독자 욕망은 구조적 사건을 독자가 바라는 결과로 바꾸는 규칙입니다. 각 회차 핵심 행동은 구체 손실 대상, 주인공 의도(구함/보호/되찾음/증명), 실패 비용, 차단된 선택지를 scene conflict/beat에 함께 설계해야 하며, 원고에서 빠지면 `manuscript-reader-desire-not-evidenced`로 실패합니다.
- scene active opposition / 능동 반대세력은 scene conflict/beat의 장면 압박 뒤에 적대적 의지(범인, 가해자, 적대 시스템, 내부자, 조작된 앱 등)를 두는 규칙입니다. 적대적 의지의 의도적 방해, 조작, 협박, 표적화가 없고 날씨/정전/잠긴 문 같은 비의지적 장애물뿐이면 `scene-active-opposition-not-staged`, 이후 원고 검증에서 `manuscript-active-opposition-not-evidenced`로 실패합니다.
- scene goal-tactic turn / 장면 목표-전술 전환은 주인공의 장면 목표, 방해하는 힘, 전술 또는 전술 전환, 바뀐 결과가 scene conflict/beat에 함께 있어야 하는 규칙입니다. 사건이 진행되어도 주인공 목표와 방법 변화가 비어 있으면 `scene-goal-tactic-turn-not-staged`로 실패합니다.
- `characters/*.json`의 antagonist/villain/opponent/rival 또는 반대세력 캐릭터가 `inner.want`나 `inner.fatal_flaw`를 가지면 antagonist strategy를 각 회차 context, reader_experience, scene conflict/beat에 이름/별칭이 있는 반대세력의 목표, 함정, 조작, 표적화, countermove로 stage해야 합니다. 회차 메타데이터에 보이지 않으면 `antagonist-strategy-not-staged`, 원고 본문에서 실행되지 않으면 `manuscript-antagonist-strategy-not-evidenced`로 실패합니다.
- antagonist countermove carryover / 반대세력 대응 이월은 전 회차 주인공 행동이 반대세력 계획을 흔든 뒤 다음 회차에 반격, 전술 변경, 표적 재설정, 증거 삭제, 접근 권한 회수로 돌아오는지 확인합니다. 전 회차 주인공 행동이 다음 회차 `previous_summary`, `current_plot`, `reader_experience`, opening scene에 반대세력의 현재 대응으로 보이지 않으면 `antagonist-countermove-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-antagonist-countermove-carryover-not-evidenced`로 실패합니다.
- `narrative_elements.character_development`가 관계 변화(신뢰, 불신, 화해, 배신, 고백, 사과, 약점 공개)를 선언하면 scene conflict/beat에 반드시 상호 반응을 설계합니다. 한 인물의 공개/사과/거절 뒤 상대가 침묵, 반박, 수락, 보호, 동행, 배신, 행동 변화로 응답하지 않으면 `relationship-shift-not-staged`로 실패하고, 원고에서 관계 변화가 선언문으로만 처리되면 `manuscript-relationship-shift-not-evidenced`로 실패합니다. relationship turning point / 관계 전환점은 약점 공개·비밀·사과·거절 같은 취약성/관계 위험, 상대의 선택/반응, 신뢰/불신/거리 변화, 즉시 달라진 행동 결과를 한 scene window에 묶어야 하며, 빠지면 `relationship-turning-point-not-staged`와 `manuscript-relationship-turning-point-not-evidenced`로 실패합니다. relationship mind inference / 관계 마음 추론은 숨김, 오해, 진심, 망설임, 바뀐 속내가 시선, 침묵, 회피, 대화, POV 해석으로 읽히게 설계해야 하며, 빠지면 `relationship-mind-inference-not-staged`와 `manuscript-relationship-mind-inference-not-evidenced`로 실패합니다. relationship mutual pressure / 관계 상호 압박은 상대가 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험 중 하나를 들고 협상에 들어오는지 확인합니다. 상대가 그저 돕거나 용서만 하면 `relationship-mutual-pressure-not-staged`, 원고에서 빠지면 `manuscript-relationship-mutual-pressure-not-evidenced`로 실패합니다.
- 관계 변화는 다음 회차의 장기 상태로 남겨야 합니다. `narrative_elements.character_development`가 신뢰/불신/화해/배신/동행 같은 변화를 만들면 `characters/relationships.json`의 `evolution`에 해당 chapter와 관계 변화 기록을 추가하세요. 이 장기 상태가 없으면 `relationship-evolution-not-recorded`로 실패합니다.
- relationship evolution carryover / 관계 장기 상태 이월은 전 회차 관계 변화가 다음 회차 대화, 행동, 불신/신뢰, 거리, 동행 압박으로 이어지는지 확인합니다. `characters/relationships.json`의 이전 `evolution.change`가 다음 회차 `previous_summary`, `current_plot`, `reader_experience`, opening scene에 현재 관계 상태로 보이지 않으면 `relationship-evolution-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-relationship-evolution-carryover-not-evidenced`로 실패합니다.
- 각 scene은 비어 있지 않은 `scene.conflict`와 `scene.beat`를 반드시 포함합니다. `scene.conflict`는 장면 갈등/압박/선택이고, `scene.beat`는 장면 전환/상황 변화/결과입니다. 둘 다 이후 `chapters/chapter_XXX.md` 원고에서 행동, 선택, 결과로 실행되어야 하며, 원고에 보이지 않으면 `manuscript-scene-intent-not-evidenced`로 실패합니다.
- `scene.beat`가 정적인 확인/대조/메모/계획에 머물고 새 사건, 폭로, 위협, 대가, 손실, 회복 불가 변화 같은 결과/악화를 만들지 않으면 `weak-scene-turn`으로 실패합니다.
- scene state delta / 장면 상태 변화는 각 scene conflict/beat가 전후 상태를 바꾸는지 보는 규칙입니다. 확인, 발견, 연결 같은 단어가 있어도 장면 뒤 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나가 명확히 바뀌지 않으면 `scene-state-delta-not-staged`로 실패합니다. 이후 원고가 같은 상태 변화를 장면 창 안에서 실행하지 못하면 `manuscript-scene-state-delta-not-evidenced`로 실패합니다.
- 추상 scene evidence 금지: "흥미로운 사건이 있다", "주인공 매력을 설명한다", "위기와 반전을 제시한다" 같은 메타 설명은 `scene-evidence-generic`으로 실패합니다. 각 scene은 구체적 장면 실행으로 행동/장애물/결과, 기억 가능한 사물/단서, 상황 변화가 보여야 합니다.
- signature scene image는 각 회차에 기억 가능한 시그니처 장면 이미지를 요구하는 규칙입니다. 최소 한 핵심 scene conflict/beat는 사물/공간/몸동작, 시각 디테일, 이야기 전환, story-impact lift를 같은 1~2문장 장면 이미지로 결합해야 하며, 없으면 `signature-scene-image-not-staged`, 원고에서 빠지면 `manuscript-signature-scene-image-not-evidenced`로 실패합니다. story-impact lift는 선택 비용, 규칙 변화, 단서 재해석, 관계/정체성 변화, 되돌릴 수 없는 결과 중 하나로 장면 이후의 판단이나 상태를 바꿔야 합니다. 기능 비트만 나열하거나 분위기 좋은 한 컷만 만들지 말고 독자가 떠올릴 이미지가 서사를 실제로 밀게 설계하세요.
- motif resonance seed / 잔향 모티프 씨앗은 `narrative_elements.resonance_seed`에 회차가 남길 사물/공간/몸동작 이미지를 한 문장으로 기록하는 규칙입니다. 이 씨앗은 scene conflict/beat에서 시각 이미지, 감정 잔향, 의미 변화, 이야기 결과를 함께 가져야 하며, 빠지면 `motif-resonance-not-staged`, 원고에서 빠지면 `manuscript-motif-resonance-not-evidenced`로 실패합니다. 테마를 설명하지 말고 같은 이미지가 선택 비용, 관계 변화, 규칙 변화, 단서 재해석, 되돌릴 수 없는 결과 중 하나를 밀게 설계하세요.
- scene novelty matrix / 장면 신선도 매트릭스는 기능적 장면을 대작급 장면 아이디어로 끌어올리는 규칙입니다. 핵심 scene conflict/beat는 `reward_mode`, `conflict_mode`, `setting_mode`, `opposition_mode` 중 최소 3축을 결합해야 하며, `setting_mode`는 장소명만이 아니라 장소 제약/동선/차단물/거리 압박/잠긴 접근/우회/침투/탈출 같은 공간 affordance로 작동해야 합니다. 보상 확인/선택 비용/숨은 방해만 반복하거나 장소명만 붙이고 새 보상 전달 방식 또는 실제 장소 제약이 없으면 `scene-novelty-matrix-not-staged`로 실패합니다. 이렇게 설계한 장면 신선도 매트릭스가 이후 원고의 같은 장면 창에서 보상 전달 방식, 갈등/전술, 공간 제약, 반대세력 대응으로 실행되지 않으면 `manuscript-scene-novelty-matrix-not-evidenced`로 실패합니다.

이 전략 문서는 이후 팀이 회차별 플롯을 생성할 때 참조합니다.
구체적이고 실행 가능한 내용을 작성하세요.
")
```

### Phase 1: 팀 기반 회차별 플롯 생성

team-orchestrator에 plot-generation-team 실행을 위임합니다:

```spec
Task(subagent_type="novel-dev:team-orchestrator", model="opus", prompt="
팀 실행: plot-generation-team
프로젝트: {projectPath}
모드: collaborative

⚠️ Phase 0 전략 참조: meta/plot-strategy.json에 플롯 전략이 있습니다.
plot-architect는 각 회차 초안 작성 시 이 전략의 per_chapter_guide를 따르세요.
검증 에이전트(arc-designer, lore-keeper, character-designer)도 전략 문서를 참조하여 검증하세요.
engagement-optimizer는 reader_promise_contract, first_five_chapter_retention_plan, binge_architecture, fun_spec을 기준으로 각 회차의 독자 보상, 초반 5화 유지 비트, 장기 미스터리 엔진, 장기 훅, 보상 주기, 피로도 방지 장치, 신선한 차별점, 감정 보상, 주인공 매력 선택/행동/비용, 중심 질문, 이탈 위험, must_click_ending, 회차 말미 연속 클릭 이유를 검증하세요. `long_series_engine`이 long_hook_threads/promise_fulfillment/scene evidence에서 사라지면 `long-series-engine-drift`로, `long_hook_threads`가 scene evidence에 장기 훅으로 보이지 않으면 `long-hook-thread-not-staged`로, 보이지만 새 단서/좁혀진 가설/위험 변화/다음 검증 행동으로 전진하지 않으면 `long-hook-thread-not-advanced`로, `payoff_cadence`가 chapter_reward/must_click_ending의 보상 주기로 보이지 않으면 `payoff-cadence-drift`로, `fatigue_controls`가 관계 압박/장소 변주/행동 방식 변주/감정 리셋으로 scene evidence에 보이지 않고 반복 비트를 그대로 두면 `fatigue-control-not-staged`로, `novelty_angle`이 reader_reward/promise_fulfillment/scene evidence에서 사라지면 `novelty-angle-drift`로, `emotional_payoff`가 reader_reward/promise_fulfillment/scene evidence의 감정 보상에서 사라지면 `emotional-payoff-drift`로, `character_appeal_moment`가 `protagonist_appeal`과 끊기면 `protagonist-appeal-drift`로, scene evidence에 없으면 `character-appeal-not-staged`로, `irresistible_question`이 `page_turn_question`/페이지터너 질문으로 이어지지 않으면 `irresistible-question-drift`로, 페이지터너 질문이 설명/해결/정답 공개로 닫히면 `page-turn-question-closed`로, 페이지터너 질문이 "앱과 사건은 왜 연결되는가?"처럼 넓고 로고+사건 번호 같은 구체 앵커가 부족하면 `page-turn-question-too-broad`로, 페이지터너 질문을 낳는 구체 단서/폭로/위협/사물/사건이 final scene에 없으면 `page-turn-question-not-staged`로, `binge_reason`이 `must_click_ending`/마지막 scene beat로 이어지지 않으면 `binge-reason-not-staged`로 반려하세요.

회차별 순차 생성:
- 각 회차 완성 후 저장하여 다음 회차 생성 시 이전 요약으로 활용
- 1회차당 1라운드: plot-architect 초안 → 4명 검증 → plot-architect 반영
")
```

## 팀 구성 (5명, collaborative)

| 에이전트 | 모델 | 역할 | 책임 |
|---------|------|------|------|
| **plot-architect** (lead) | opus | 초안 생성 + 피드백 반영 | 회차별 chapter_N.json 작성 |
| arc-designer | opus | 아크/복선 검증 | 아크 진행률, 복선 타이밍, 훅 배치 확인 |
| lore-keeper | opus | 세계관 검증 | 타임라인 정합성, 장소/설정 일관성 확인 |
| character-designer | opus | 캐릭터 검증 | 캐릭터 동선, 성장 아크, 행동 동기 확인 |
| engagement-optimizer | opus | 독자 몰입 검증 | fun_spec, 장기 훅, 보상 주기, 신선한 차별점, 감정 보상, 중심 질문, 주인공 매력 선택/행동/비용, 이탈 위험, 페이지터너 질문, must_click_ending, 회차 말미 연속 클릭 이유 확인 |

## Collaborative 진행 방식

plot-architect(lead)가 TeamCreate로 팀을 구성하고 SendMessage로 조율합니다.

**각 회차마다:**
1. plot-architect가 초안 작성 (plot-strategy.json의 해당 회차 가이드 참조)
2. arc-designer에게 SendMessage → 아크/복선 피드백
3. lore-keeper에게 SendMessage → 세계관 정합성 피드백
4. character-designer에게 SendMessage → 캐릭터 동선 피드백
5. engagement-optimizer에게 SendMessage → reader_promise_contract, first_five_chapter_retention_plan, binge_architecture, fun_spec 기준의 독자 몰입 피드백. `long_series_engine`이 long_hook_threads/promise_fulfillment/scene evidence의 장기 미스터리 엔진으로 보존되지 않으면 `long-series-engine-drift`를 요구하고, `long_hook_threads`가 scene evidence에 보이지 않으면 `long-hook-thread-not-staged`를 요구하고, 보이지만 새 단서/좁혀진 가설/위험 변화/다음 검증 행동으로 전진하지 않으면 `long-hook-thread-not-advanced`를 요구하고, `payoff_cadence`가 chapter_reward/must_click_ending의 보상 주기로 보존되지 않으면 `payoff-cadence-drift`를 요구하고, `fatigue_controls`가 피로도 방지 장치로 보이지 않고 조사/대화/전투 반복을 관계 압박, 장소 변주, 행동 방식 변주, 감정 리셋 없이 반복하면 `fatigue-control-not-staged`를 요구하고, `novelty_angle`이 신선한 차별점으로 보존되지 않으면 `novelty-angle-drift`를 요구하고, `emotional_payoff`가 `promise_fulfillment`/`chapter_reward`/scene evidence의 감정 보상으로 보존되지 않으면 `emotional-payoff-drift`를 요구하고, `character_appeal_moment`가 `protagonist_appeal`과 끊기면 `protagonist-appeal-drift`를 요구하고, 장면의 선택/행동/비용으로 보이지 않으면 `character-appeal-not-staged`를 요구하고, `irresistible_question` 중심 질문이 `page_turn_question`/페이지터너 질문으로 이어지지 않으면 `irresistible-question-drift`를 요구하고, 페이지터너 질문이 open-loop 미해결 질문이 아니라 설명/해결/정답 공개로 닫히면 `page-turn-question-closed`를 요구하고, "앱과 사건은 왜 연결되는가?"처럼 넓고 로고+사건 번호 같은 구체 앵커가 부족하면 `page-turn-question-too-broad`를 요구하고, 페이지터너 질문을 낳는 구체 단서/폭로/위협/사물/사건이 final scene에 없으면 `page-turn-question-not-staged`를 요구하고, `binge_reason`이 `must_click_ending`/마지막 scene beat의 회차 말미 연속 클릭 이유로 보이지 않으면 `binge-reason-not-staged`를 요구
6. plot-architect가 피드백 반영 → chapter_N.json 저장
7. 다음 회차로 진행

## 회차별 포함 내용

1. 회차 제목, 목표 분량
2. 이전 회차 요약 (N=1: 빈 문자열, N>=2: 직전 3개 요약)
3. 현재 회차 줄거리 (1500자+)
4. 다음 회차 줄거리 (500자, 마지막 회차면 빈 문자열)
5. POV 캐릭터, 등장 인물, 등장 장소
6. 작품 내 시간대
7. 복선 plant/payoff ID
8. 떡밥 훅
9. 캐릭터 발전 포인트
10. 독자 감정 목표
11. reader_experience (promise_fulfillment, chapter_reward, page_turn_question, character_appeal_moment, drop_off_risk, must_click_ending). `arc_beats`는 큰 줄거리의 메인/서브 아크 진행으로서 context.current_plot, reader_experience, scene conflict/beat에 구체 발견/결정/반전/손실/되돌릴 수 없는 상태 변화로 stage해 `arc-beat-not-staged`와 필러 회차를 방지하고, 이후 원고에서 직접 실행되어 `manuscript-arc-beat-not-evidenced`가 나지 않아야 합니다. `long_series_engine`은 long_hook_threads/promise_fulfillment/scene evidence의 장기 미스터리 엔진으로 stage하고, `long_hook_threads` 중 최소 하나는 scene evidence의 장기 훅으로 stage하며, 보이는 장기 훅은 새 단서/좁혀진 가설/위험 변화/다음 검증 행동으로 전진시켜 `long-hook-thread-not-advanced`와 `manuscript-long-hook-thread-not-advanced`를 방지하고, `payoff_cadence`는 chapter_reward/must_click_ending의 보상 주기로 stage하고, `fatigue_controls`는 피로도 방지 장치로 stage해 조사/대화/전투 반복을 관계 압박, 장소 변주, 행동 방식 변주, 감정 리셋으로 끊고 `fatigue-control-not-staged` 및 `manuscript-fatigue-control-not-evidenced`를 방지하고, `novelty_angle`은 promise_fulfillment/chapter_reward/scene beat의 신선한 차별점으로 stage하고, `emotional_payoff`는 promise_fulfillment/chapter_reward/scene evidence의 감정 보상으로 stage하고, `chapter_reward`는 earned reward/벌어낸 보상으로 설계해 주인공의 단서 처리, 추론/선택, 그 결과 발견이 이어지게 하며 자동 파일/안내문/보고서 같은 수동 설명으로 보상이 도착해 `manuscript-earned-reward-not-evidenced`가 나지 않게 하고, 주인공 매력은 `protagonist_appeal`을 보존하며 최소 한 scene의 conflict 또는 beat에서 선택/행동/비용으로 stage하고, 그 선택은 경쟁 선택지와 포기되는 대안이 보이는 선택-대가 딜레마로 설계해 `manuscript-choice-tradeoff-not-evidenced`를 방지하고, 돌이킬 수 없는 행동 전에는 구체 손실 대상과 위협/비용이 보이는 stakes clarity 및 이름/관계/역할/소지품/식별자로 개인화된 stakes subject specificity를 포함해 `manuscript-stakes-not-evidenced`와 `manuscript-stakes-subject-not-personalized`를 방지하고, 장면 압박에는 scene active opposition / 능동 반대세력, 즉 적대적 의지와 의도적 방해가 보이게 해 `scene-active-opposition-not-staged` 및 `manuscript-active-opposition-not-evidenced`를 방지하고, scene state delta / 장면 상태 변화는 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나의 전후 변화로 설계해 `scene-state-delta-not-staged`와 원고의 `manuscript-scene-state-delta-not-evidenced`를 방지하고, `page_turner_question`은 답을 설명하지 않는 open-loop 미해결 질문으로 유지하며 마지막 scene beat의 구체 단서/폭로/위협/사물/사건에서 발생하게 하고, 말미 훅 준비 단서는 ending hook setup으로 설계해 좌표, 사진, 명명 장소, 신원, 특수 물건 앵커를 앞선 장면의 구체 단서로 심어 `manuscript-ending-hook-setup-not-evidenced`를 방지하고, 말미 반전은 fair twist로 설계해 앞선 장면의 반전 준비 단서가 마지막 reveal 단서 계열과 맞물리게 하며 `manuscript-fair-twist-setup-not-evidenced`를 방지하고, `binge_reason`은 마지막 scene beat와 must_click_ending의 회차 말미 연속 클릭 이유로 stage
12. 씬 분해 (2-4개 씬). 각 scene에는 비어 있지 않은 `scene.conflict`(장면 갈등/압박/선택)와 `scene.beat`(장면 전환/상황 변화/결과)를 포함하고, 두 필드는 이후 원고에서 실제 행동/선택/결과로 실행 가능해야 합니다. 추상 scene evidence 또는 메타 설명으로 쓰면 `scene-evidence-generic` 실패입니다. `scene.beat`가 정적인 확인/대조/메모/계획에 머물고 새 사건, 폭로, 위협, 대가, 손실, 회복 불가 변화 같은 결과/악화를 만들지 않으면 `weak-scene-turn` 실패입니다. 확인/발견/연결은 있지만 장면 뒤 독자 지식, 위험, 관계 상태, 선택지, 세계 규칙, 다음 행동이 바뀌지 않으면 `scene-state-delta-not-staged` 실패입니다. 구체적 장면 실행 기준은 행동/장애물/결과, 사물/단서, 상황 변화입니다. 일반어 fun_spec은 `fun-spec-generic` 실패입니다.
13. 문체 가이드 (톤, 페이싱)

## 파일 생성

- `chapters/chapter_001.json` ~ `chapter_{N}.json`

## 출력 예시

### chapters/chapter_001.json
```json
{
  "chapter_number": 1,
  "chapter_title": "예상 밖의 제안",
  "status": "planned",
  "word_count_target": 5000,

  "meta": {
    "pov_character": "char_001",
    "characters": ["char_001", "char_002"],
    "locations": ["loc_002", "loc_003"],
    "in_story_time": "20XX년 3월 15일 저녁"
  },

  "context": {
    "previous_summary": "",
    "current_plot": "마케팅팀 김유나 대리는 야근 후 회식 자리에서...",
    "next_plot": "유나는 황당한 제안을 거절하지만..."
  },

  "narrative_elements": {
    "foreshadowing_plant": [],
    "foreshadowing_payoff": [],
    "hooks_plant": ["hook_001"],
    "hooks_reveal": [],
    "character_development": "유나의 승진 욕구와 현실적 성격 소개",
    "emotional_goal": "궁금증, 의외성"
  },

  "reader_experience": {
    "promise_fulfillment": "계약 연애 로맨스의 핵심 약속인 의외의 제안과 감정적 긴장을 1화에서 즉시 제시",
    "chapter_reward": "평범한 직장인의 일상에 재벌남의 비상식적 제안이 침투하는 의외성",
    "page_turner_question": "유나는 이 제안을 거절할 수 있을까, 그리고 남주는 왜 유나를 선택했을까?",
    "character_appeal_moment": "유나가 당황하면서도 자기 기준을 잃지 않고 맞서는 장면",
    "drop_off_risk": "초반 직장 일상 설명이 길어질 위험 — 3문단 안에 제안의 전조를 배치",
    "must_click_ending": "남주가 유나의 약점을 정확히 알고 있음을 드러내며 다음 화로 연결",
    "cliffhanger_strength": 8
  },

  "scenes": [
    {
      "scene_number": 1,
      "purpose": "유나의 일상과 성격 소개",
      "characters": ["char_001"],
      "location": "loc_002",
      "conflict": "야근 스트레스와 승진 압박 속에서도 자기 기준을 굽힐지 선택해야 한다.",
      "beat": "유나가 당황하면서도 자기 기준을 잃지 않고 맞서는 장면을 행동으로 보여준다."
    }
  ],

  "style_guide": {
    "tone": "가볍고 코믹하면서도 궁금증 유발",
    "pacing": "medium",
    "focus": "캐릭터 소개, 훅 설정"
  }
}
```

## 완료 후

```
[OK] 전체 회차 플롯 생성 완료. /plot-review로 검토하거나, /write로 집필을 시작하세요.
```
