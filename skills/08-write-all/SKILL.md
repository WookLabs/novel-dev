---
name: 08-write-all
description: "Use this skill when auto-writing the entire novel from chapter 1 to completion via Ralph Loop. Triggers on: '전체 집필', '처음부터 끝까지', 'write all'."
user-invocable: true
---

# /write-all - Ralph Loop 전체 자동 집필

> **Note**: 이 문서의 코드 블록은 AI 오케스트레이터를 위한 실행 패턴 명세입니다. 실행 가능한 TypeScript/JavaScript 코드가 아닙니다.

완성까지 멈추지 않는 자동 집필 시스템입니다.

## Quick Start
```bash
/write-all          # 1화부터 끝까지 자동 집필 (캐릭터 협업)
/write-all --resume # 중단된 지점부터 재개
/write-all --restart # 처음부터 다시 시작
/write-all --solo          # 전체 집필 (novelist 단독)
/write-all --team          # 전체 집필 + 막 완료마다 revision-team 검증
/write-all --resume --team # 재개 + revision-team 검증
/write-all --solo --team   # novelist 단독 집필 + revision-team 검증
/write-all --codex         # 전체 집필 (Codex/GPT-5.4, 비용 절감)
/write-all --codex --team  # Codex 집필 + revision-team 검증
```

## --codex: Codex CLI(GPT-5.4) 집필

`$ARGUMENTS`에 `--codex`가 있으면 Ralph Loop 내에서 각 회차를 Codex CLI로 집필합니다:
```spec
Bash("node scripts/codex-writer.mjs --chapter {N} --project {projectPath} --mode write")
```
이후 adult-rewriter, proofreader, summarizer는 기존 Claude 파이프라인 그대로 실행.

## Writer Mode

`meta/project.json`의 `writer_mode`에 따라 집필 엔진이 결정됩니다:
- `"claude"`: 기본 -- Claude novelist 에이전트로 생성
- `"grok"`: **(deprecated)** 2-Pass 파이프라인으로 대체됨
- `"hybrid"`: **(removed)** v6.0.0에서 제거됨

> **성인소설**: `/write-act-2pass`를 사용하세요. Pass 1(Claude)이 ADULT 마커와 함께 집필하고, Pass 2(`adult-rewriter.mjs`)가 Grok API로 마커 구간을 대체합니다.
> 품질 검증(critic, beta-reader, genre-validator)과 퇴고(editor)는 항상 **Claude가 수행**합니다.

## Masterpiece Mode

강화된 품질 보증 시스템:
- **Multi-Validator**: critic, beta-reader, genre-validator (3개 동시 검증)
- **Engagement Contract**: `reader_experience`를 `evaluateEngagementContract`로 검증
- **Reader Promise Specificity Gate**: `reader_promise_contract`가 일반어 중심이면 `reader-promise-generic`, 구체적 필드들이 같은 전제 앵커로 결합되지 않으면 `reader-promise-premise-not-integrated`, `per_chapter_guide`가 없으면 `missing-chapter-guide`, 회차 `promise_fulfillment`가 `core_hook`을 잃으면 `missing-core-hook`
- **Core Reader Experience Drift Gate**: `fun_spec`과 회차 `reader_experience`가 끊기면 실패합니다. `reader_reward`/`chapter_reward` 이탈은 `reader-reward-drift`, `page_turn_question`/`page_turner_question` 이탈은 `page-turner-question-drift`, `character_appeal_moment` 이탈은 `character-appeal-drift`, `must_click_ending` 이탈은 `must-click-ending-drift`, `drop_off_risk` 이탈은 `drop-off-risk-drift`
- **Core Scene Staging Gate**: final scene이 `must_click_ending`을 stage하지 못하면 `must-click-ending-not-staged`, scene beat가 `chapter_reward`를 보상 사건으로 stage하지 못하면 `chapter-reward-not-staged`, `drop_off_risk` 완화 전략이 scene evidence에 보이지 않으면 `drop-off-risk-not-mitigated`, `tension_curve` peak event가 scene purpose/beat에 보이지 않으면 `tension-peak-not-staged`
- **Foundational Scene Evidence Gate**: scene evidence가 없으면 `missing-scene-evidence`, concrete pressure가 있는 장면 갈등이 75% 미만이면 `weak-scene-conflict`, `cliffhanger_strength`가 7 미만이면 `weak-cliffhanger`, high-tension peak 대비 `cliffhanger_strength`가 약하면 `weak-peak-cliffhanger`
- **Manuscript Tension Peak Gate**: `tension_curve`의 high-tension peak event가 원고에서 압박/행동/결과 전환으로 장면화되지 않고 요약되면 `manuscript-tension-peak-not-evidenced`
- **Manuscript Tension Wave Gate**: high-tension 회차의 tension wave / 긴장 파형이 원고에서 초반 압박과 열린 질문, 중반 악화와 선택지 축소, 말미 고점과 열린 질문으로 분산되지 않으면 `manuscript-tension-wave-not-evidenced`
- **Irresistible Question Gate**: `irresistible_question` 중심 질문을 `page_turn_question`과 페이지터너 질문으로 보존하고 누락 시 `irresistible-question-drift`
- **Page-Turn Open Loop Gate**: `page_turn_question`과 페이지터너 질문이 답을 설명하지 않는 open-loop 미해결 질문이어야 하며 설명/해결/정답 공개로 닫히면 `page-turn-question-closed`
- **Page-Turn Specificity Gate**: `page_turn_question`과 페이지터너 질문은 좁혀진 정보 공백이어야 합니다. "앱과 사건은 왜 연결되는가?"처럼 넓은 명사만 남기면 `page-turn-question-too-broad`이고, 로고+사건 번호, 이름+좌표, 다음 수신자+사진, 규칙+대가 같은 구체 앵커가 최소 두 개 필요합니다.
- **Page-Turn Staging Gate**: 페이지터너 질문을 낳는 구체 단서/폭로/위협/사물/사건이 final scene에 없고 질문이 메타데이터에만 있으면 `page-turn-question-not-staged`
- **Binge Reason Ending Gate**: `binge_reason`을 `must_click_ending`과 마지막 scene evidence의 회차 말미 연속 클릭 이유로 보존하고 누락 시 `binge-reason-not-staged`
- **Protagonist Appeal Drift Gate**: `protagonist_appeal`을 `character_appeal_moment`와 scene evidence의 주인공 매력 선택/행동/비용으로 보존하고 누락 시 `protagonist-appeal-drift`
- **Character Drive Gate**: 주인공 `inner.want` 욕망과 `inner.need` 결핍을 context, `character_development`, `character_appeal_moment`, scene conflict/beat의 선택/대가/도움 요청/포기/달라진 행동으로 stage하고, 누락 시 `character-drive-not-staged`
- **Character Drive Carryover Gate**: character drive carryover / 내적 변화 이월은 직전 내적 변화가 다음 회차 행동으로 남는지 확인합니다. 직전 내적 변화가 도움 요청, 습관 내려놓기, 통제권 나누기, 달라진 행동으로 previous_summary/current_plot/reader_experience/opening scene에 보이지 않으면 `character-drive-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-character-drive-carryover-not-evidenced`
- **Antagonist Strategy Gate**: antagonist/villain/opponent/rival 또는 반대세력 캐릭터의 `inner.want`/`inner.fatal_flaw`를 이름/별칭이 있는 antagonist strategy로 stage합니다. 목표, 함정, 조작, 표적화, countermove가 context/reader_experience/scene conflict/beat에 없으면 `antagonist-strategy-not-staged`
- **Antagonist Countermove Carryover Gate**: antagonist countermove carryover / 반대세력 대응 이월은 전 회차 주인공 행동이 반대세력 계획을 흔든 뒤 다음 회차에 반격, 전술 변경, 표적 재설정, 증거 삭제, 접근 권한 회수로 돌아오는지 확인합니다. 전 회차 주인공 행동이 previous_summary/current_plot/reader_experience/opening scene에 반대세력의 현재 대응으로 보이지 않으면 `antagonist-countermove-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-antagonist-countermove-carryover-not-evidenced`
- **Novelty Angle Gate**: `novelty_angle`을 `promise_fulfillment`, `chapter_reward`, scene evidence의 신선한 차별점으로 보존하고 누락 시 `novelty-angle-drift`
- **Emotional Payoff Gate**: `emotional_payoff`를 `promise_fulfillment`, `chapter_reward`, scene evidence의 감정 보상으로 보존하고 누락 시 `emotional-payoff-drift`
- **Long-Series Engine Gate**: `long_series_engine`을 `long_hook_threads`, `promise_fulfillment`, scene evidence의 장기 미스터리 엔진으로 보존하고 누락 시 `long-series-engine-drift`
- **Long Hook Thread Gate**: `long_hook_threads` 중 최소 하나를 scene evidence의 장기 훅으로 보존하고 누락 시 `long-hook-thread-not-staged`
- **Long Hook Advancement Gate**: 보이는 장기 훅을 새 단서, 좁혀진 가설, 위험/대가 변화, 다음 검증 행동으로 전진시키고 정체 시 `long-hook-thread-not-advanced`
- **Payoff Cadence Gate**: `payoff_cadence`를 `chapter_reward`와 `must_click_ending`의 보상 주기로 보존하고 누락 시 `payoff-cadence-drift`
- **Fatigue Control Gate**: `fatigue_controls`를 promise_fulfillment/drop_off_risk/scene evidence의 피로도 방지 장치로 보존하고, 관계 압박/장소 변주/행동 방식 변주/감정 리셋 없이 조사/대화/전투 반복을 그대로 두면 `fatigue-control-not-staged`
- **Tension Reset Gate**: `tension_reset_plan`을 promise_fulfillment/drop_off_risk/scene evidence의 호흡/완급/정적/추리 호흡 뒤 새 질문, 새 알림, 새 위협으로 긴장을 재점화하는 리듬으로 보존하고 누락 시 `tension-reset-not-staged`
- **Serial Escalation Variety Gate**: serial escalation variety는 회차 간 반복 보상, 조사, 알림, 현장 실패 패턴을 그대로 재사용하지 않는 장기 연재 리듬입니다. 이전 1~2회차와 같은 보상/조사/알림/장소 구조를 쓰면 새 갈등 축(관계 파열, 반대세력 countermove, 장소/행동 방식 변주, 규칙 변화, 대가 상승, 되돌릴 수 없는 판도 변화)을 stage해야 하며, 누락 시 `serial-escalation-variety-not-staged`, 원고 본문에서 누락 시 `manuscript-serial-escalation-variety-not-evidenced`
- **Serial Reward Pattern Variation Gate**: serial reward pattern variation은 회차 간 보상 전달 방식 자체를 변주하는 장기 연재 리듬입니다. 새 갈등 축이 있어도 `chapter_reward`나 원고 보상 순간이 전 회차와 같은 로그-기록 대조/알림-규칙 증명을 이름만 바꿔 반복하면 `serial-reward-pattern-repetition-not-staged`, `manuscript-serial-reward-pattern-repetition-not-evidenced`로 실패합니다. 보상은 관계 배신, 반대세력 countermove, 행동 방식 반전, 대가 상승, 규칙 변이, 구체 사물 폭로 등 새 reward mode로 도착해야 합니다.
- **Cliffhanger Carryover Gate**: cliffhanger carryover는 직전 회차의 prior must_click_ending을 다음 회차 current_plot, reader_experience, opening scene, 원고 초반에서 즉시 이어받는 규칙입니다. 직전 회차 말미 단서/위협/질문을 버리고 새 줄거리로 건너뛰는 미끼식 클리프행어는 `cliffhanger-carryover-not-staged`, planning에는 있지만 opening scene / first staged turn을 지나서야 처리하면 `cliffhanger-carryover-delayed`, 원고 초반에서 누락되면 `manuscript-cliffhanger-carryover-not-evidenced`, 첫 두 문장을 지나서야 처리하면 `manuscript-cliffhanger-carryover-delayed`
- **Scene Choice-Cost Tradeoff Gate**: scene choice-cost tradeoff는 핵심 scene conflict/beat가 경쟁 선택지, 포기되는 대안, 선택-대가 비용을 함께 stage하는지 확인합니다. 단순 조사/발견/추격만 있고 선택 딜레마가 없으면 `scene-choice-tradeoff-not-staged`, 원고에서 빠지면 `manuscript-choice-tradeoff-not-evidenced`
- **Choice-Cost Lock Gate**: choice-cost lock / 선택-대가 잠금은 주인공 선택의 대가가 선택지/관계/증거/시간/경로 중 하나를 되돌릴 수 없는 상태로 닫는지 확인합니다. scene conflict/beat에서 선택 후 닫힘, 차단, 사라짐, 노출, 확정이 없으면 `scene-choice-cost-lock-not-staged`, 원고에서 빠지면 `manuscript-choice-cost-lock-not-evidenced`
- **Choice-Cost Lock Carryover Gate**: choice-cost lock carryover / 선택-대가 잠금 이월은 전 회차의 잠긴 선택지가 다음 회차 압박으로 이어지는지 확인합니다. 전 회차 `context.next_plot` 또는 마지막 scene에서 닫힌 선택지/관계/증거/시간/경로가 다음 회차 previous_summary/current_plot/reader_experience/opening scene에 현재 제약으로 보이지 않으면 `choice-cost-lock-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-choice-cost-lock-carryover-not-evidenced`
- **Revelation Consequence Carryover Gate**: revelation consequence carryover / 폭로 결과 이월은 전 회차 폭로가 다음 회차의 계획 변경, 새 압박, 용의자 지도, 관계 판단, 다음 질문으로 이어지는지 확인합니다. 전 회차 `chapter_reward`, `must_click_ending`, `context.next_plot`의 폭로가 다음 회차 previous_summary/current_plot/reader_experience/opening scene에 현재 행동 변화로 보이지 않으면 `revelation-consequence-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-revelation-consequence-carryover-not-evidenced`
- **Mystery Hypothesis Carryover Gate**: mystery hypothesis carryover / 추리 가설 이월은 직전 단서가 다음 회차의 가설 수정, 용의자 순위 재정렬, 용의자 제외/승격, 다음 검증 행동으로 이어지는지 확인합니다. 직전 단서가 previous_summary/current_plot/reader_experience/opening scene에 추론 상태 변화로 보이지 않으면 `mystery-hypothesis-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-mystery-hypothesis-carryover-not-evidenced`
- **Scene Causal Escalation Gate**: scene causal escalation은 장면 간 인과를 확인합니다. 이전 scene 결과가 `직후`, `그 결과`, `이어` 같은 인과 연결로 다음 scene 압박, 행동, 결과를 밀지 못하면 `scene-causal-escalation-not-staged`
- **Scene Active Opposition Gate**: scene active opposition / 능동 반대세력은 scene conflict/beat의 장면 압박 뒤에 적대적 의지와 의도적 방해, 조작, 협박, 표적화를 요구합니다. 날씨/정전/잠긴 문 같은 비의지적 장애물뿐이면 `scene-active-opposition-not-staged`, 원고에서 빠지면 `manuscript-active-opposition-not-evidenced`, 익명 주체만 있으면 `manuscript-active-opposition-actor-too-vague`
- **Manuscript Temporal Pressure Gate**: temporal pressure / 시간 압박은 제한 시간, 카운트다운, 남은 n분, 기한, 사망 시각 같은 ticking-clock 표식이 실제 행동과 선택지를 좁히는지 확인합니다. 시간 압박을 말하지만 주인공 대응과 늦어짐/놓침/닫힌 선택지/사라진 증거/줄어든 기한 같은 결과가 같은 장면 흐름에 없으면 `manuscript-temporal-pressure-not-evidenced`
- **Scene Goal-Tactic Turn Gate**: scene goal-tactic turn / 장면 목표-전술 전환은 핵심 scene conflict/beat가 주인공의 구체 목표, 목표를 막는 힘, 전술 또는 전술 전환, 바뀐 결과를 함께 갖는지 확인합니다. 사건 결과는 있지만 주인공 목표와 방법 변화가 비어 있으면 `scene-goal-tactic-turn-not-staged`
- **Spatial Blocking Gate**: spatial blocking은 액션/위기 장면의 공간 블로킹을 확인합니다. 장소 기준점, 동선, 차단물, 거리 압박이 원고에 보이지 않으면 `manuscript-spatial-blocking-not-evidenced`
- **Ending Hook Reaction Gate**: ending hook reaction은 마지막 scene beat의 `must_click_ending`이 정보만 던지고 끝나지 않게 주인공의 몸감각, 물리적 행동, 즉각 위험 반응을 붙이는 규칙입니다. scene metadata에서 빠지면 `ending-hook-reaction-not-staged`, 원고에서 빠지면 `manuscript-ending-hook-reaction-not-evidenced`
- **Relationship Shift Gate**: `character_development`가 관계 변화(신뢰, 불신, 화해, 배신, 고백, 사과, 약점 공개)를 선언하면 scene evidence에 상호 반응을 요구하고 누락 시 `relationship-shift-not-staged`. 원고 본문 manuscript가 관계 변화를 선언문으로만 말하고 상대의 침묵, 반박, 수락, 보호, 동행, 배신, 행동 변화가 없으면 `manuscript-relationship-shift-not-evidenced`. relationship turning point / 관계 전환점은 약점 공개·비밀·사과·거절 같은 취약성/관계 위험, 상대의 선택/반응, 신뢰/불신/거리 변화, 즉시 달라진 행동 결과를 같은 1-2문장 또는 scene window에 결속해야 하며, 누락 시 `relationship-turning-point-not-staged`, `manuscript-relationship-turning-point-not-evidenced`. relationship mind inference / 관계 마음 추론은 숨김, 오해, 진심, 망설임, 바뀐 속내가 시선, 침묵, 회피, 대화, POV 해석으로 읽혀야 하며, 누락 시 `relationship-mind-inference-not-staged`, `manuscript-relationship-mind-inference-not-evidenced`. relationship mutual pressure / 관계 상호 압박은 상대가 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험 중 하나를 들고 협상에 들어와야 하며, 단순 도움/용서면 `relationship-mutual-pressure-not-staged`, 원고 누락이면 `manuscript-relationship-mutual-pressure-not-evidenced`
- **Relationship Evolution State Gate**: 관계 변화가 장면/원고에서 발생하면 `characters/relationships.json`의 `evolution`에 chapter와 관계 변화 기록을 남겨 장기 상태로 이어야 하며, 누락 시 `relationship-evolution-not-recorded`
- **Relationship Evolution Carryover Gate**: relationship evolution carryover / 관계 장기 상태 이월은 전 회차 관계 변화가 다음 회차 대화, 행동, 불신/신뢰, 거리, 동행 압박으로 이어지는지 확인합니다. 이전 `evolution.change`가 현재 회차 previous_summary/current_plot/reader_experience/opening scene에 현재 관계 상태로 보이지 않으면 `relationship-evolution-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-relationship-evolution-carryover-not-evidenced`
- **Foreshadowing Ledger Gate**: 복선 장부 `foreshadowing_schedule`에 없는 ID를 `foreshadowing_plant` 또는 `foreshadowing_payoff`에 쓰면 `foreshadowing-ledger-missing`. `foreshadowing_payoff`가 예정된 `payoff_chapter`보다 앞서면 `foreshadowing-payoff-timing-mismatch`
- **Foreshadowing Plant Concreteness Gate**: foreshadowing plant concreteness / 복선 단서 구체화는 선언한 `foreshadowing_plant`가 실제 scene과 원고 본문 manuscript의 로고, 번호, 표식, 파일, 상처, 목소리, 사물, 감각 디테일 같은 물증으로 심겼는지 확인합니다. 추상 선언만 있으면 `foreshadowing-plant-not-staged`, 원고 본문에서 빠지면 `manuscript-foreshadowing-plant-not-evidenced`
- **Foreshadowing Payoff Resolution Gate**: foreshadowing payoff resolution / 복선 회수 장면화는 `foreshadowing_payoff`가 단서를 다시 보여주는 데서 끝나지 않고, 의미를 밝히고 원인/배후/숨은 연결을 드러내며 결과적으로 주인공의 행동, 위험, 관계, 다음 목표를 바꾸는지 확인합니다. 의미와 결과 없는 반복 단서면 `foreshadowing-payoff-not-staged`, 원고 본문에서 빠지면 `manuscript-foreshadowing-payoff-not-evidenced`
- **Hook Ledger Gate**: 훅 장부 `plot/hooks.json`의 `mystery_hooks`에 없는 ID를 `hooks_plant` 또는 `hooks_reveal`에 쓰면 `hook-ledger-missing`. `hooks_reveal`이 예정된 `reveal_chapter`보다 앞서면 `hook-reveal-timing-mismatch`
- **Arc Progression Gate**: 회차별 `arc_beats`가 큰 줄거리의 메인/서브 아크를 구체 발견, 결정, 반전, 손실, 되돌릴 수 없는 상태 변화로 전진시키지 못하면 필러 회차입니다. chapter metadata에 보이지 않으면 `arc-beat-not-staged`, 원고 본문 manuscript에 실행되지 않으면 `manuscript-arc-beat-not-evidenced`
- **Opening Hook Gate**: 1화 `chapters/chapter_XXX.md` 원고 본문 manuscript의 첫 문단이 `core_hook` 또는 `novelty_angle`을 즉시 보여주지 않으면 `opening-hook-not-evidenced`
- **Opening Immediacy Gate**: 1화 첫 문단 안에 훅이 있어도 첫 문장/첫 비트가 평범한 일상, 날씨, 분위기로 먼저 열리고 `core_hook` 또는 `novelty_angle`을 늦게 보여주면 `opening-hook-delayed`
- **Opening First-Screen Embodiment Gate**: 1화 첫 문장에 `core_hook` 또는 `novelty_angle`이 있어도 첫 1~2문장 안에 주인공 행동/선택 압박, 감각 또는 POV 앵커, 미해결 위험/질문이 결합되지 않으면 `opening-hook-not-embodied`
- **Opening Momentum Gate**: 2화 이후 오프닝이 지난 사건 정리, 이전 회차 요약, 차분한 회상으로 시작하고 즉각적인 행동, 위협, 질문, 감각 반응이 없으면 `manuscript-opening-momentum-not-evidenced`
- **Manuscript Irresistible Question Gate**: 원고 본문 manuscript가 `reader_promise_contract.irresistible_question`과 `reader_experience.page_turner_question`의 중심 질문을 왜/어떻게/누가 같은 미해결 질문으로 장면 안에 열어 두지 않으면 `manuscript-irresistible-question-not-evidenced`
- **Manuscript Drop-Off Mitigation Gate**: 원고 본문 manuscript가 `drop_off_risk`의 이탈 방지 전략을 순서와 행동으로 실행하지 않으면 `manuscript-drop-off-mitigation-not-evidenced`
- **Manuscript Evidence Gate**: `chapters/chapter_XXX.md` 원고 본문 manuscript에 `chapter_reward`, `must_click_ending`, `character_appeal_moment`, `emotional_payoff`, `long_hook_threads`, `payoff_cadence`가 실제 사건/발견/행동/감정 보상/장기 훅/보상 주기로 보이지 않으면 `manuscript-reward-not-evidenced`, `manuscript-ending-not-evidenced`, `manuscript-appeal-not-evidenced`, `manuscript-payoff-not-evidenced`, `manuscript-long-hook-not-evidenced`, `manuscript-payoff-cadence-not-evidenced`
- **Manuscript Earned Reward Gate**: `chapter_reward`가 원고에 있어도 주인공의 단서 처리와 추론/선택 없이 자동 파일, 안내문, 보고서 같은 수동 설명으로 보상이 도착하면 earned reward/벌어낸 보상이 아니므로 `manuscript-earned-reward-not-evidenced`
- **Manuscript Reward Freshness Gate**: reward freshness/보상 신선도는 벌어낸 보상이 단순 기록 일치나 단서 확인으로 멈추지 않는지 확인합니다. `chapter_reward`가 고유 장치, 규칙 변화, 장르 보상 체감, 다음 행동 압박을 함께 만들지 않으면 `manuscript-reward-freshness-not-evidenced`
- **Manuscript Payoff Delight Gate**: payoff delight / 보상 쾌감은 벌어낸 보상을 대작급 고점으로 터뜨리는 기준입니다. 신선한 `chapter_reward`라도 압박 축적, 벌어낸 단서 해소, 의미 변화 또는 반전, 몸 반응, 즉시 새 결과나 질문이 한 보상 순간에 결합되지 않으면 `manuscript-payoff-delight-not-evidenced`
- **Manuscript Genre Delight Gate**: genre-specific delight / 장르 쾌감은 `emotional_payoff`가 약속한 장르 보상을 원고 장면 문법으로 검증합니다. 미스터리는 단서 결합, 주인공 추론/행동, 더 날카로운 미해결 의문을 요구하고, 로맨스는 거리 변화 또는 접촉, 취약한 대화, 관계 선택/비용, 몸의 설렘을 요구합니다. 액션은 추격 동선, 공간 제약, 전술 반전, 신체 결과를 요구하고, 스릴러는 조여드는 위협, 덫 확대, 거짓 반전, 강제 선택, 몸의 공포를 요구하며, 현대판타지는 시스템 피드백, 스킬 활용, 대가/한계, 현실 결과나 등급 변화를 요구합니다. 판타지/성장물은 마법 규칙 발현, 대가/한계, 경이 이미지, 능력 변화나 결과를 요구합니다. 감정명과 몸반응만 있고 장르별 독자 쾌감 장치가 없으면 `manuscript-genre-delight-not-evidenced`
- **Manuscript Question Ladder Gate**: question ladder/질문 사다리는 벌어낸 보상 뒤의 답, 폭로, 규칙 증명이 다음 질문을 여는지 확인합니다. 답 직후가 모든 의문 해결/설명 완료/안도처럼 닫히고 새 미해결 왜/어떻게/누가/다음 표적/남은 대가를 만들지 않으면 `manuscript-question-ladder-not-evidenced`
- **Manuscript Forecast Revision Gate**: forecast revision / 서사 예측 수정은 반전, 예상 뒤집힘, 오판, 가설 수정, 재해석이 실제 독해 변화를 만드는지 확인합니다. 원고가 예상이나 가설을 세우면 그 예상을 깨는 구체 단서나 사건, 바뀐 가설/용의자 순위/단서 의미/계획/다음 검증 행동까지 보여야 하며, 놀람만 있고 해석이 바뀌지 않으면 `manuscript-forecast-revision-not-evidenced`
- **Manuscript Fatigue Control Gate**: 원고 본문 manuscript가 `fatigue_controls`를 장면화하지 않고 같은 조사/대화/전투 비트를 반복하면 `manuscript-fatigue-control-not-evidenced`. 관계 압박, 장소 변주, 행동 방식 변주, 감정 리셋 중 최소 하나로 피로도와 반복감을 끊어야 함
- **Manuscript Tension Reset Gate**: 원고 본문 manuscript가 `tension_reset_plan`을 장면화하지 않고 위기, 경보, 추격, 폭로를 계속 고조만 시키면 `manuscript-tension-reset-not-evidenced`. 고강도 비트 뒤 짧은 호흡, 감각 정적, 단서 해석, 감정 리셋을 둔 뒤 새 질문/새 위협으로 재점화해야 함
- **Manuscript Tension Peak Gate**: 원고 본문 manuscript가 high-tension peak event를 "긴장감이 최고조" 같은 요약으로만 처리하고 같은 1~3문장 안에 구체 위험/장애물, 주인공 행동 또는 강제 선택, 되돌릴 수 없는 결과/폭로/새 질문을 묶지 않으면 `manuscript-tension-peak-not-evidenced`
- **Manuscript Tension Wave Gate**: 원고 본문 manuscript가 high-tension 회차의 tension wave / 긴장 파형을 만들지 못해 초반 압박, 중반 악화, 말미 고점, 열린 질문이 순서대로 보이지 않으면 `manuscript-tension-wave-not-evidenced`
- **Immersive Rhythm Map Gate**: 원고 본문 manuscript는 리듬 맵을 가져야 합니다. 장면 압박에 맞춘 호흡 없이 같은 길이와 같은 종결, 같은 문장 수와 같은 문단 beat 구조의 AI식 규칙적 단문 반복이나 문단 반복으로 흐르면 재시도합니다. 문장 길이 변주와 문단 기능 순서 변주로 압박-호흡-재점화를 분리하고, 압박 구간은 행동/결과, 호흡 구간은 감각/물증/POV 앵커, 재점화 구간은 새 질문/위협/선택 비용을 이어야 합니다.
- **Manuscript Ending Hook Gate**: `must_click_ending`을 원고 중간에 언급만 하고 마지막 구간의 새 사건, 폭로, 위협, 미해결 질문으로 장면화하지 않으면 `manuscript-ending-hook-not-staged`
- **Manuscript Open Loop Gate**: `must_click_ending`을 마지막 구간에 배치하더라도 같은 회차 말미에서 해결, 종결, 범인 확정, 설명 완료, 안도 같은 폐쇄 신호로 열린 루프를 닫으면 `manuscript-ending-hook-closed`
- **Manuscript Ending Question Specificity Gate**: 원고 마지막 열린 질문이 "이 사건의 진실은 무엇인가?"처럼 넓고 로고+사건 번호, 다음 수신자+사진, 이름+좌표, 규칙+대가 같은 구체 앵커를 최소 두 개 보존하지 못하면 `manuscript-ending-hook-question-too-broad`
- **Manuscript Ending Reaction Gate**: `must_click_ending` 말미 훅을 사건 정보로만 끝내고 주인공의 몸감각, 물리적 행동, 즉각 위험 반응을 붙이지 않으면 `manuscript-ending-hook-reaction-not-evidenced`
- **Manuscript Ending Hook Setup Gate**: ending hook setup / 말미 훅 준비 단서는 `must_click_ending`의 좌표, 사진, 명명 장소, 신원, 특수 물건 앵커를 앞선 장면의 발견/확인/기록/흔적으로 먼저 심게 하는 규칙입니다. 앞선 장면 없이 마지막 구간에서만 새 좌표나 사진을 던지면 `manuscript-ending-hook-setup-not-evidenced`
- **Manuscript Fair Twist Gate**: 말미 반전은 fair twist여야 하며, 앞선 장면의 번호, 파일, 로그, 로고, 목소리, 녹음, 서명, 배지 같은 반전 준비 단서 없이 마지막 구간에서만 정체/배후/범인을 새로 밝히면 `manuscript-fair-twist-setup-not-evidenced`
- **Manuscript Protagonist Agency Gate**: 원고에서 주인공 능동성이 보이지 않고 주인공이 직접 결정하고 대가를 감수하는 선택/행동/비용이 없으면 `manuscript-protagonist-agency-not-evidenced`
- **Manuscript Choice Tradeoff Gate**: 원고에서 주인공 행동이 경쟁 선택지와 포기되는 대안이 보이는 선택-대가 딜레마 없이 단순 결정/위험 감수로만 처리되면 `manuscript-choice-tradeoff-not-evidenced`
- **Manuscript Choice Cost Carryover Gate**: choice cost carryover는 선택 비용 여파가 다음 압박으로 이어지는지 확인합니다. 포기한 대안, 신고 기록, 알리바이, 증거, 시간, 관계 같은 비용이 선택지 축소, 길 차단, 의심 증가, 증거 상실, 시간 단축으로 돌아오지 않으면 `manuscript-choice-cost-carryover-not-evidenced`
- **Manuscript Choice-Cost Lock Gate**: choice-cost lock / 선택-대가 잠금은 선택 비용이 선택지/관계/증거/시간/경로 중 하나를 되돌릴 수 없는 상태로 닫는지 확인합니다. 원고 본문 manuscript에서 선택 직후 닫힘, 차단, 사라짐, 노출, 확정이 보이지 않으면 `scene-choice-cost-lock-not-staged` 또는 `manuscript-choice-cost-lock-not-evidenced`
- **Manuscript Choice-Cost Lock Carryover Gate**: choice-cost lock carryover / 선택-대가 잠금 이월은 전 회차에서 잠긴 선택지, 관계, 증거, 시간, 경로가 다음 회차 압박으로 원고 초반에 돌아오는지 확인합니다. 잠긴 선택지가 현재 행동을 좁히거나 의심, 감시, 경로 차단, 신뢰 붕괴를 만들지 않으면 `choice-cost-lock-carryover-not-staged` 또는 `manuscript-choice-cost-lock-carryover-not-evidenced`
- **Manuscript Revelation Consequence Carryover Gate**: revelation consequence carryover / 폭로 결과 이월은 전 회차 폭로가 원고 초반에서 계획 변경, 새 압박, 용의자 판단, 관계 불신, 다음 질문으로 행동을 바꾸는지 확인합니다. 폭로를 요약만 하고 현재 행동이 그대로라면 `revelation-consequence-carryover-not-staged` 또는 `manuscript-revelation-consequence-carryover-not-evidenced`
- **Manuscript Mystery Hypothesis Carryover Gate**: mystery hypothesis carryover / 추리 가설 이월은 직전 단서가 원고 초반에서 가설 수정, 용의자 순위, 알리바이 재검증, 다음 검증 행동으로 장면화되는지 확인합니다. 단서를 요약만 하고 새 조사로 건너뛰면 `mystery-hypothesis-carryover-not-staged` 또는 `manuscript-mystery-hypothesis-carryover-not-evidenced`
- **Manuscript Stakes Clarity Gate**: 원고에서 돌이킬 수 없는 행동 전에 구체 손실 대상과 닥친 위협/비용이 보이는 stakes clarity가 없으면 `manuscript-stakes-not-evidenced`
- **Manuscript Stakes Subject Specificity Gate**: stakes subject specificity / 스테이크 대상 개인화는 `피해자`, `표적`, `대상`, `수신자`, `사람` 같은 일반 명사가 독자가 걱정할 대상이 되도록 이름, 관계, 역할, 소지품, 목소리, 메시지, 신분증, 사진, 사건/파일 번호 같은 구체 흔적을 첫 압박 창에 붙이는 기준입니다. 없으면 `manuscript-stakes-subject-not-personalized`
- **Manuscript Reader Desire Gate**: reader desire intensity / 독자 욕망은 사건을 확인하는 기능 비트가 아니라 독자가 바라는 결과를 만드는 기준입니다. 원고에서 구체 손실 대상, 주인공 의도(구함/보호/되찾음/증명), 실패 비용, 차단된 선택지가 같은 회차 흐름에 보이지 않으면 `manuscript-reader-desire-not-evidenced`
- **Manuscript Active Opposition Gate**: 원고에서 장면 압박 뒤에 active opposition이 없고, 적대적 의지의 의도적 방해/조작/협박/표적화가 보이지 않으면 `manuscript-active-opposition-not-evidenced`. 방해 행동이 있어도 `누군가`, `익명의`, `알 수 없는`, `그들` 같은 익명 주체뿐이고 이름/역할/적대 시스템이 없으면 `manuscript-active-opposition-actor-too-vague`
- **Manuscript Antagonist Strategy Gate**: 원고 본문 manuscript에서 antagonist strategy가 이름/별칭이 있는 반대세력의 함정, 조작, 표적화, countermove로 장면화되지 않으면 `manuscript-antagonist-strategy-not-evidenced`
- **Manuscript Antagonist Countermove Carryover Gate**: antagonist countermove carryover / 반대세력 대응 이월은 전 회차 주인공 행동 때문에 반대세력이 원고 초반에서 반격, 전술 변경, 표적 재설정, 증거 삭제, 접근 권한 회수로 현재 압박을 바꾸는지 확인합니다. 같은 함정만 반복하면 `antagonist-countermove-carryover-not-staged` 또는 `manuscript-antagonist-countermove-carryover-not-evidenced`
- **Manuscript Character Development Gate**: `narrative_elements.character_development`의 인물 변화를 선택, 인정, 사과, 공개, 대가, 관계 행동, 달라진 행동으로 원고 본문 manuscript에 실행하지 않으면 `manuscript-character-development-not-evidenced`
- **Manuscript Character Drive Gate**: 원고 본문 manuscript가 주인공 `inner.want` 욕망 또는 `inner.need` 결핍을 장면 동기로 실행하지 않고, 그 욕망/결핍이 선택, 대가, 도움 요청, 포기, 달라진 행동을 압박하지 않으면 `manuscript-character-drive-not-evidenced`
- **Manuscript Character Drive Carryover Gate**: character drive carryover / 내적 변화 이월은 직전 내적 변화 때문에 원고 초반의 행동이 바뀌는지 확인합니다. 주인공이 도움 요청, 습관 내려놓기, 통제권 나누기, 달라진 행동을 실제 선택으로 실행하지 않으면 `character-drive-carryover-not-staged` 또는 `manuscript-character-drive-carryover-not-evidenced`
- **Manuscript Relationship Shift Gate**: 관계 변화가 있는 `narrative_elements.character_development`는 한 인물의 선택/공개/사과와 상대의 상호 반응, 그리고 신뢰/불신/거리/동행 같은 관계 상태 변화를 원고 본문 manuscript에 보여야 합니다. 선언문만 있으면 `manuscript-relationship-shift-not-evidenced`
- **Manuscript Relationship Turning Point Gate**: 원고의 관계 전환점은 취약성/관계 위험, 상대의 선택/반응, 신뢰/불신/거리 변화, 즉시 달라진 행동 결과가 같은 1-2문장 안에서 이어져야 합니다. 사과했다, 대답했다, 관계가 회복됐다는 요약만 있으면 `manuscript-relationship-turning-point-not-evidenced`
- **Manuscript Relationship Mind Inference Gate**: 원고의 관계 전환점은 행동 결과뿐 아니라 숨김, 오해, 진심, 망설임, 바뀐 속내가 시선, 침묵, 회피, 대화, POV 해석으로 읽혀야 합니다. 관계 결과만 있고 마음 추론 단서가 없으면 `relationship-mind-inference-not-staged` 또는 `manuscript-relationship-mind-inference-not-evidenced`
- **Manuscript Relationship Mutual Pressure Gate**: 원고의 관계 전환점은 상대가 자기 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험을 걸어 주인공의 다음 행동을 바꿔야 합니다. 상대가 도와주거나 용서만 하면 `relationship-mutual-pressure-not-staged` 또는 `manuscript-relationship-mutual-pressure-not-evidenced`
- **Relationship Long-State Gate**: `characters/relationships.json`의 `evolution`은 원고에서 생긴 관계 변화의 장기 상태 기록입니다. 해당 chapter의 `evolution.change`가 없거나 관계 행동/상태 변화를 담지 않으면 `relationship-evolution-not-recorded`
- **Manuscript Relationship Evolution Carryover Gate**: relationship evolution carryover / 관계 장기 상태 이월은 전 회차 관계 변화가 다음 회차 대화와 초반 행동에 남아야 하는 규칙입니다. 불신/신뢰, 거리, 동행, 침묵, 반박, 보호 같은 변화가 원고 초반에 보이지 않으면 `relationship-evolution-carryover-not-staged` 또는 `manuscript-relationship-evolution-carryover-not-evidenced`
- **Foreshadowing Metadata Gate**: `chapters/chapter_XXX.json`의 `foreshadowing_plant`와 `foreshadowing_payoff`는 복선 장부 `foreshadowing_schedule`과 맞아야 합니다. payoff는 `payoff_chapter`에서만 선언합니다.
- **Foreshadowing Plant Concreteness Metadata Gate**: foreshadowing plant concreteness / 복선 단서 구체화는 `foreshadowing_plant`를 로고, 번호, 표식, 파일, 상처, 목소리, 사물, 감각 디테일 같은 물증으로 scene conflict/beat와 manuscript에 심는 규칙입니다. 추상 선언만 있으면 `foreshadowing-plant-not-staged`, 원고 본문에서 빠지면 `manuscript-foreshadowing-plant-not-evidenced`입니다.
- **Foreshadowing Payoff Resolution Metadata Gate**: foreshadowing payoff resolution / 복선 회수 장면화는 `foreshadowing_payoff`를 단서 재등장으로 끝내지 않고 의미, 원인/배후/숨은 연결, 결과로 바뀐 행동/위험/관계/다음 목표까지 scene conflict/beat와 manuscript에 쓰는 규칙입니다. 의미와 결과 없는 반복 단서면 `foreshadowing-payoff-not-staged`, 원고 본문에서 빠지면 `manuscript-foreshadowing-payoff-not-evidenced`입니다.
- **Hook Metadata Gate**: `chapters/chapter_XXX.json`의 `hooks_plant`와 `hooks_reveal`은 훅 장부 `plot/hooks.json`의 `mystery_hooks`와 맞아야 합니다. reveal은 `reveal_chapter`에서만 선언합니다.
- **Arc Metadata Gate**: `plot/plot-strategy.json`의 `arc_beats`는 `chapters/chapter_XXX.json`의 context.current_plot, reader_experience, scene conflict/beat에 반영되어야 하며, 큰 줄거리 진행 없이 장면만 소비하면 `arc-beat-not-staged`입니다. 같은 진행이 manuscript에 없으면 `manuscript-arc-beat-not-evidenced`입니다.
- **Manuscript Named Character Gate**: `characters/*.json` 또는 `characters/index.json`에 실명/별칭이 있는 캐릭터를 `주인공`, `조력자`, `남주`, `여주` 같은 설계 라벨로 반복해 최종 원고에 쓰면 `manuscript-generic-character-label-not-evidenced`
- **Manuscript Design Jargon Gate**: 원고 본문 manuscript가 `지적 쾌감`, `보상 주기`, `장기 미스터리`, `독자 보상`, `클리프행어` 같은 설계어/평가어를 지문에 직접 쓰면 `manuscript-design-jargon-not-evidenced`
- **Manuscript Pressure/Obstacle Gate**: 원고에서 장면 압박, 장애물, 저항이 실제 압박/장애물로 보이지 않고 주인공 행동이 순조롭게 흘러가면 `manuscript-pressure-not-evidenced`
- **Manuscript Tactical Adaptation Gate**: tactical adaptation은 장면 반전 뒤 전술 재계산이 보이는지 확인합니다. 장애물/반격/차단이 첫 계획을 막았는데도 주인공이 계획 변경, 우회, 수단 전환, 새 단서 활용, 다음 행동 변경 없이 처음 계획대로 진행하면 `manuscript-tactical-adaptation-not-evidenced`
- **Manuscript Consequence/Escalation Gate**: 원고에서 장면 압박 뒤 결과 악화가 없고 대가, 손실, 회복 불가 변화, 새 위협이 보이지 않으면 `manuscript-consequence-not-evidenced`
- **Manuscript Cause-Effect Chain Gate**: 원고가 압박, 행동, 결과를 각각 말하지만 원인과 결과의 사슬로 묶지 않으면 `manuscript-causal-chain-not-evidenced`. 압박이 행동을 바꾸고, 행동이 결과를 만들고, 결과가 다음 비트를 열어야 함
- **Manuscript Micro-Turn Density Gate**: micro-turn density는 인접 문장 창마다 독자 예측, 선택 압박, 위험, 관계 상태, 전술, 비용, 다음 질문 중 하나가 바뀌는지 확인합니다. 단서/기록/알림을 나열하지만 3문장 안에서 가설 수정, 선택 축소, 위험 상승, 관계 변화, 다음 행동 변경, 대가, 다음 질문으로 이어지지 않으면 `manuscript-micro-turn-density-not-evidenced`
- **Manuscript Convenient Resolution Gate**: 원고가 위기 해결을 우연한 해결, 갑작스러운 외부 구조, 마침 도착한 증거/조력자에 맡기면 `manuscript-convenient-resolution-not-evidenced`. 구조/체포/탈출/증거 발견은 사전 설치, 주인공이 작동시킨 선택/행동, 해결 뒤 대가가 함께 있어야 earned resolution으로 인정함
- **Manuscript POV Focalization Gate**: 원고가 사건/단서/보상/말미 훅을 객관 정보처럼 나열하고 POV 시점 앵커와 몸감각, 시선, 해석, 미해결 의문을 같은 장면 문장에 붙이지 않으면 `manuscript-pov-focalization-not-evidenced`
- **Manuscript Narrative Transportation Gate**: narrative transportation / 체험 몰입은 구체 공간/사물/행동, POV 감정 반응, 집중점이 인접 장면 문장에 결속되어 독자가 줄거리를 심상으로 떠올리고 인물 압박을 느끼는지 확인합니다. 사건 증거만 있고 추상 기능 요약으로 흐르면 `manuscript-narrative-transportation-not-evidenced`
- **Manuscript Premise Engine Gate**: premise engine / 전제 엔진은 `reader_promise_contract.core_hook`과 `novelty_angle`이 장면의 규칙, 장치, 조건, 금기로 작동하는지 봅니다. 원고 본문 manuscript가 고유 전제를 설정/소재/컨셉으로만 말하고 그 전제가 선택을 좁히거나 전술을 바꾸거나 위험을 만들고 다음 질문을 열지 않으면 `manuscript-premise-engine-not-evidenced`
- **Manuscript Payoff Embodiment Gate**: `emotional_payoff`의 장르별 보상어(쾌감/긴장감/설렘/따뜻함 등)를 감정 보상 장면화 없이 감정명으로만 말하고 몸감각, 감각 디테일, 행동 반응을 붙이지 않으면 `manuscript-payoff-embodiment-not-evidenced`
- **Manuscript Emotional Arc Gate**: `narrative_elements.emotional_goal`과 각 `scene.emotional_tone`의 감정선을 원고 본문 manuscript에서 감정명, 몸감각, 행동 반응으로 실행하지 않으면 `manuscript-emotional-arc-not-evidenced`
- **Manuscript Emotional Progression Gate**: emotional progression은 감정선이 단순 등장에 머물지 않고 감정 전환/누적으로 읽히는지 봅니다. 원고 본문 manuscript에서 선언된 감정 상태 사이의 전환 계기, 선택/사건, 관계 반응, 행동 반응이 장면 안에 없으면 `manuscript-emotional-progression-not-evidenced`
- **Manuscript Affective Choice Turn Gate**: affective choice turn / 감정 선택 전환은 감정 변화가 실제 선택, 행동, 관계 태도, 결과를 바꾸는지 봅니다. 원고 본문 manuscript가 감정 전환을 말하지만 그 감정 때문에 선택지가 닫히거나 행동이 바뀌거나 관계/위험 상태가 달라지지 않으면 `manuscript-affective-choice-turn-not-evidenced`
- **Manuscript Long-Hook Concrete Clue Gate**: 장기 훅을 추상 연결로만 말하고 번호, 파일, 로그, 로고 같은 구체 단서를 붙이지 않으면 `manuscript-long-hook-clue-not-evidenced`
- **Manuscript Long-Hook Advancement Gate**: 장기 훅 구체 단서를 반복만 하고 새 발견, 가설 축소, 위험 변화, 다음 검증 행동으로 상태를 바꾸지 않으면 `manuscript-long-hook-thread-not-advanced`
- **Manuscript Scene Execution Gate**: `chapters/chapter_XXX.md` 원고 본문 manuscript가 `chapters/chapter_XXX.json`의 `scene.conflict` 장면 갈등과 `scene.beat` 장면 전환을 실제 원고 실행으로 보여주지 않으면 `manuscript-scene-intent-not-evidenced`
- **Manuscript Scene Order Gate**: 각 scene의 증거가 있더라도 장면 순서가 `chapters/chapter_XXX.json`의 scene 번호 순서와 다르게 실행되면 `manuscript-scene-order-not-evidenced`
- **Manuscript Scene State Delta Gate**: 원고가 scene conflict/beat 키워드를 포함해도 같은 장면 창 안에서 before 압박과 after 결과가 이어져 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나를 바꾸지 않으면 `manuscript-scene-state-delta-not-evidenced`
- **Scene Evidence Specificity Gate**: 추상 scene evidence 또는 "흥미로운 사건이 있다", "주인공 매력을 설명한다", "위기와 반전을 제시한다" 같은 메타 설명이면 `scene-evidence-generic`. `scene.conflict`/`scene.beat`는 구체적 장면 실행으로 행동/장애물/결과, 사물/단서, 상황 변화를 포함
- **Scene Turn Gate**: `scene.beat`가 정적인 확인/대조/메모/계획에 머물고 새 사건, 폭로, 위협, 대가, 손실, 회복 불가 변화 같은 결과/악화를 만들지 않으면 `weak-scene-turn`
- **Scene State Delta Gate**: scene state delta / 장면 상태 변화는 `scene.conflict`와 `scene.beat`의 전후 상태 변화를 요구합니다. 확인, 발견, 연결 같은 사건 단어가 있어도 장면 뒤 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나가 바뀌지 않으면 `scene-state-delta-not-staged`
- **Signature Scene Image Gate**: signature scene image는 회차마다 기억 가능한 시그니처 장면 이미지를 요구합니다. 최소 한 핵심 보상/반전/말미 훅 장면이 사물/공간/몸동작, 시각 디테일, 이야기 전환, story-impact lift를 같은 1~2문장 안에 결합하지 않으면 `signature-scene-image-not-staged`, `manuscript-signature-scene-image-not-evidenced`. story-impact lift는 선택 비용, 규칙 변화, 단서 재해석, 관계/정체성 변화, 되돌릴 수 없는 결과 중 하나여야 하며, 분위기 좋은 이미지가 서사 상태를 바꾸지 못하면 실패합니다.
- **Motif Resonance Seed Gate**: motif resonance seed / 잔향 모티프 씨앗은 `narrative_elements.resonance_seed`가 선언된 경우 시각 이미지, 감정 잔향, 의미 변화, 이야기 결과가 한 장면 창에 묶였는지 확인합니다. 메타데이터에서 빠지면 `motif-resonance-not-staged`, 원고에서 빠지면 `manuscript-motif-resonance-not-evidenced`. 테마 설명문이 아니라 독자가 읽고 난 뒤 떠올릴 반복 이미지가 선택 비용, 관계 변화, 규칙 변화, 단서 재해석, 되돌릴 수 없는 결과를 밀어야 합니다.
- **Scene Novelty Matrix Gate**: scene novelty matrix / 장면 신선도 매트릭스는 기능적 장면을 대작급 장면 아이디어로 조합하는 기준입니다. 핵심 scene conflict/beat가 `reward_mode`, `conflict_mode`, `setting_mode`, `opposition_mode` 중 최소 3축을 결합하지 못하거나, `setting_mode`가 장소명만 있고 장소 제약/동선/차단물/거리 압박/잠긴 접근/우회/침투/탈출 같은 공간 affordance로 작동하지 않으면 `scene-novelty-matrix-not-staged`
- **Manuscript Scene Novelty Matrix Gate**: 장면 신선도 매트릭스를 설계했는데 `chapters/chapter_XXX.md` 원고의 같은 장면 창에서 보상 전달 방식, 갈등/전술, 공간 제약, 반대세력 대응이 함께 실행되지 않고 사건 정보 설명으로 납작해지면 `manuscript-scene-novelty-matrix-not-evidenced`
- **Fun Spec Specificity Gate**: 일반어 fun_spec 또는 "흥미로운 사건", "강한 반전", "다음 화가 궁금해지는 질문", "주인공이 매력을 보여준다" 같은 추상 재미 사양이면 `fun-spec-generic`. 구체적 fun_spec은 고유 장치/단서, 주인공 선택/비용, 결과/악화, must-click hook 증거를 포함
- **Manuscript Scene Texture Gate**: 원고가 독자 보상/훅/갈등을 설명으로만 나열한 요약문형 원고이고 장면 질감(감각, 행동, 대화)이 부족하면 `manuscript-summary-prose`
- **Manuscript Scene Density Gate**: 원고가 고유 단서/현장 키워드는 포함하지만 현장 기록, 분석, 항목, 결론 같은 보고서형 원고로 장면 밀도를 대체하고 직접 행동, 몸감각, 대화/서브텍스트가 같은 장면 흐름에 부족하면 `manuscript-scene-density-not-evidenced`
- **Manuscript Spatial Blocking Gate**: 원고가 행동과 압박은 있지만 독자가 장소 기준점, 동선, 차단물, 거리 압박을 따라갈 수 없는 공간 블로킹 결손이면 `manuscript-spatial-blocking-not-evidenced`
- **Manuscript Dialogue Subtext Gate**: 대화문이 독자 보상, 핵심 질문, 장기 미스터리, 보상 주기, 주인공 매력 같은 설계 정보를 직접 설명하고 갈등, 회피, 반박, 침묵, 행동 비트 같은 대화 서브텍스트가 부족하면 `manuscript-dialogue-subtext-not-evidenced`
- **Manuscript Dialogue Conflict Gate**: 3턴 이상 대화가 확인, 동의, 지시, 수행만 반복하고 반박, 거부, 회피, 위협, 침묵, 힘의 균형을 바꾸는 행동 비트 같은 대화 갈등이 없으면 `manuscript-dialogue-conflict-not-evidenced`
- **Manuscript Dialogue Turn Gate**: dialogue turn은 논쟁성 대화가 대화 전환을 통해 정보 변화, 권력 변화, 관계 상태 변화, 수락/거절된 조건, 또는 다음 행동을 만들어 이야기 상태를 바꾸는지 확인합니다. 말싸움만 있고 상태 변화가 없으면 `manuscript-dialogue-turn-not-evidenced`
- **Manuscript Dialogue State Carryover Gate**: dialogue state carryover는 대화 전환으로 바뀐 이야기 상태가 바로 다음 행동 또는 다음 압박에 상태 누적되는지 확인합니다. 파일, 로그, 조건, 관계, 권력, 열린 문 같은 변화 뒤 원고가 원래처럼 진행하면 `manuscript-dialogue-state-carryover-not-evidenced`
- **Character Voice Differentiation Gate**: character voice differentiation은 인물별 대사 음성을 분리합니다. 화자 귀속이 가능한 다중 화자 대화가 같은 말투, 어휘, 문장 리듬, 반응 전술, 담화 표지, 동일한 대사를 반복해 서로 바꿔 말해도 구분되지 않으면 `manuscript-character-voice-not-differentiated`
- **Character Voice Profile Drift Gate**: `characters/{id}.json`의 `basic.voice.formality_level` 또는 기존 top-level `speech_pattern`이 존댓말/반말/격식 말투를 지정했는데, 원고의 화자 귀속 대사가 장면상 근거 없이 다른 register로 반복되면 `manuscript-character-voice-profile-drift`. 다른 캐릭터의 고유 `signature_phrases`를 빌려 쓰거나, 명시된 표준어/방언 프로필과 반복적으로 충돌하는 대사도 같은 issue로 실패합니다. `basic.voice.vocabulary`는 `선호 어휘: 현장로그, 증거번호; 금지 어휘: 운명, 대충`처럼 기록하고, 원고에서 금지 어휘를 반복하거나 다른 인물의 고유 선호 어휘를 빌려 쓰면 같은 issue로 실패합니다. 어휘·시그니처 표현·방언은 profile context로 함께 전달되어 퇴고 지시의 기준이 됩니다.
- **Prose Craft Gate**: `apply-chapter-gate`의 `proseCraft`가 원고 문장 품질을 검증합니다. `proseCraft.passed == false`이면 외부 품질 점수와 engagement가 통과해도 완료 금지, `Prose Craft Revision Directives`를 반영
- **Prose Taste Rhythm Gate**: `prose_taste_profile.max_short_sentence_run`을 넘는 연속 단문 끊어쓰기는 `monotone-short-sentence-run`으로 차단됩니다. 짧은 문장은 타격점에만 남기고 원인/대조/결과가 이어지는 문장은 중문·복문으로 묶어 문장 리듬을 변주합니다.
- **Prose Taste Sentence Length Cadence Gate**: `prose_taste_profile.min_sentence_length_variation_coefficient` 또는 `max_uniform_sentence_length_run` 기준을 어기면 `uniform-sentence-length-cadence`로 차단됩니다. 자동 루프는 비슷한 길이의 중간 서술문을 계속 밀지 말고 짧은 타격문, 감각 앵커가 붙은 중문, 선택/결과를 묶은 긴 문장을 장면 박자에 맞게 섞습니다.
- **Prose Taste Paragraph Beat Cadence Gate**: `prose_taste_profile.max_uniform_paragraph_beat_run` 기준을 넘는 같은 문장 수와 비슷한 문단 기능 순서 반복은 `uniform-paragraph-beat-cadence`로 차단됩니다. 자동 루프는 어미나 문장 길이만 살짝 바꾸지 말고 짧은 선택/충격 문단, 원인-행동-결과 문단, 물증-압박-재점화 문단처럼 문단 설계를 바꿔 장면 박자를 분리합니다.
- **Prose Taste Ending Cadence Gate**: `prose_taste_profile.max_same_ending_run` 또는 `max_dominant_sentence_ending_share` 기준을 어기면 `same-ending-run` 또는 `dominant-ending-cadence-lock`으로 차단됩니다. 자동 루프는 -했다/-였다/-다 종결 일부를 행동 비트, 대사 반응, 감각 잔향, 원인-결과 연결문으로 바꿔 문장 끝 박자가 잠기지 않게 씁니다.
- **Prose Taste Dialogue Cadence Gate**: `prose_taste_profile.max_dominant_dialogue_ending_share` 또는 `max_dominant_dialogue_starter_share` 기준을 어기면 `dialogue-ending-cadence-lock` 또는 `dialogue-starter-cadence-lock`으로 차단됩니다. 자동 루프는 같은 말끝/첫머리 공식 대신 캐릭터별 말끝, 생략, 반문, 조건 제시, 회피, 침묵 비트를 분리합니다.
- **Prose Taste Immersive Rhythm Gate**: `prose_taste_profile.min_immersive_rhythm_anchor_density_per_1000` 또는 `max_immersive_rhythm_flatline_run` 기준을 어기면 `immersive-rhythm-flatline`으로 차단됩니다. 자동 루프는 설명/판단 문장만 늘리지 말고 물증, 손동작, 대사 반응, 선택 비용, 감각 앵커를 넣어 문단이 장면 안에서 호흡하도록 다시 씁니다.
- **Prose Taste Hedged Perception Gate**: `prose_taste_profile.max_hedged_perception_density_per_1000`을 넘는 듯했다/것 같았다/느껴졌다/어쩐지/묘하게/희미하게 같은 완충 표현 누적은 `hedged-perception-haze`로 차단됩니다. 흐릿한 추정 대신 인물이 본 물증, 한 선택, 틀린 판단의 결과를 장면 문장에 직접 세웁니다.
- **Prose Taste POV Distance Gate**: `prose_taste_profile.max_static_description_density_per_1000`을 넘는 있었다/없었다/보였다식 정적 목록 묘사와 `min_viewpoint_anchor_density_per_1000`보다 낮은 인물 감각·판단·말투 앵커는 `detached-camera-description`으로 차단됩니다. 배경을 POV 인물이 본 순서, 오해한 판단, 감춘 반응, 달라진 행동으로 묶습니다.
- **Prose Taste Sensory Wallpaper Gate**: `prose_taste_profile.max_sensory_wallpaper_run`을 넘는 감각 묘사 연쇄는 `sensory-wallpaper-run`으로 차단됩니다. 차가운 빛, 냄새, 바람, 그림자 같은 감각 일부를 새 단서 확인, 선택 비용, 위험 변화, 관계 반응, 즉각적 결과로 바꿔 감각이 장면 상태를 움직이게 씁니다.
- **Prose Taste Gaze Choreography Gate**: `prose_taste_profile.max_gaze_choreography_density_per_1000` 또는 `max_gaze_choreography_run`을 넘는 시선/눈길/눈빛/고개/바라봄 beat 연쇄는 `gaze-choreography-loop`으로 차단됩니다. 반복 시선 연출 일부를 새 단서 확인, 선택 비용, 거절의 결과, 상대 조건 변화로 바꿔 장면 상태가 움직이게 씁니다.
- **Prose Taste Emotion Label Carousel Gate**: `prose_taste_profile.max_emotion_label_run`을 넘는 불안했다/후회했다/당황했다/분노했다 같은 감정 라벨 연쇄는 `emotion-label-carousel`로 차단됩니다. 감정명 일부를 선택, 늦어진 반응, 잘못된 판단, 관계 비용, 즉각적 결과로 바꿔 감정이 장면을 움직이게 씁니다.
- **Prose Taste Fluency Friction Gate**: 추상 명사 설명 과다(`abstract-exposition-drift`), 깨달았다/생각했다/알 수 있었다 같은 인식 필터 과다(`cognitive-filtering-overload`), 것/수 있었다/상태였다 같은 명사화 설명 반복(`nominalized-explanation-chain`), 에 의해/에 대하여/가지고 있다/위해 같은 번역투 공식 표현(`translationese-formula-drift`), 그리고/하지만/그 순간 같은 접속 부사 시작 반복(`connective-crutch-rhythm`), 쉼표 과밀(`comma-rhythm-overload`), 사실/의미/상황을 보였다·드러났다로 닫는 보고식 종결(`reporting-tail-summary`, `max_reporting_tail_density_per_1000`), 결정적 폭로·해결·체포·구출을 장면 밖 사후 요약으로 넘기는 `offscreen-resolution-summary`, 같은 주어 반복 리듬(`repeated-subject-rhythm`)은 거슬리는 문체 마찰로 기록합니다. 자동 루프는 이 issue가 반복되면 단순 교정이 아니라 문단 호흡과 장면화 방식을 바꿔야 합니다.
- **Prose Taste Reference Clarity Gate**: `prose_taste_profile.max_ambiguous_reference_density_per_1000` 또는 `max_ambiguous_reference_run`을 넘는 “그는/그녀는/그것은/그 말은”식 지시어 연쇄는 `ambiguous-reference-chain`으로 차단됩니다. 연속 지시어 일부를 인물명, 역할, 물건명, 구체 행동 주체로 바꿔 문단의 참조 대상을 다시 고정합니다.
- **Prose Taste Lore Term Gate**: `prose_taste_profile.max_lore_term_density_per_1000` 또는 `max_lore_term_run`을 넘는 왕국/교단/마탑/게이트/스킬/시스템/프로토콜식 설정어 폭주는 `lore-name-overload`로 차단됩니다. 자동 루프는 한 장면에 필요한 새 개념 하나만 남기고, 나머지는 인물이 만지는 물건, 선택 비용, 상대 반응, 다음 장면의 단서로 나눠 심어야 합니다.
- **Prose Taste Time Skip Summary Gate**: `prose_taste_profile.max_time_skip_summary_density_per_1000` 또는 `max_time_skip_summary_run`을 넘는 며칠이 지났다/준비는 끝났다/계획은 완성됐다/상황은 달라졌다식 시간 경과 결과 보고는 `time-skip-summary-chain`으로 차단됩니다. 자동 루프는 시간 점프 뒤 결과만 보고하지 말고 물증, 선택 비용, 실패 조건, 이동 경로, 다음 장면의 달라진 행동으로 다시 써야 합니다.
- **Prose Taste Contrastive Reframe Gate**: `prose_taste_profile.max_contrastive_reframe_density_per_1000` 또는 `max_contrastive_reframe_run`을 넘는 그건 X가 아니었다. Y였다식 대비 단정 반복은 `contrastive-reframe-cadence`로 차단됩니다. 자동 루프는 대비 문장을 한두 번만 남기고, 나머지를 직접적인 긍정문, 구체 물증, 인물 행동, 선택 비용, 상대 반응으로 다시 써야 합니다.
- **Prose Taste System Stat Gate**: `prose_taste_profile.max_system_stat_block_density_per_1000` 또는 `max_system_stat_block_run`을 넘는 상태창/스탯/레벨/보상/퀘스트 갱신 수치 나열은 `system-stat-block-dump`로 차단됩니다. 자동 루프는 필요한 숫자만 남기고, 나머지를 자원 소모, 실패 조건, 제한 시간, 신체/공간 변화, 관계 위험, 다음 선택 비용으로 다시 써야 합니다.
- **Prose Taste Declared Resolve Gate**: `prose_taste_profile.max_declared_resolve_density_per_1000` 또는 `max_declared_resolve_run`을 넘는 결심했다/다짐했다/각오했다/해야 했다식 의지 선언 반복은 `declared-resolve-loop`로 차단됩니다. 자동 루프는 결심 문장 일부를 실제 선택, 되돌릴 수 없는 행동, 물증 조작, 대가 발생, 상대 반응으로 바꿔야 합니다.
- **Prose Taste Revelation Summary Gate**: `prose_taste_profile.max_revelation_summary_density_per_1000` 또는 `max_revelation_summary_run`을 넘는 모든 단서가 이어졌다/진실은 명확했다/의문이 풀렸다식 폭로 요약 반복은 `revelation-summary-leap`로 차단됩니다. 자동 루프는 단서 대조, 물증 확인, 오독 교정, 결론 이후 행동 비용을 장면 안에 다시 써야 합니다.
- **Prose Taste Procedural Checklist Gate**: `prose_taste_profile.max_procedural_checklist_density_per_1000` 또는 `max_procedural_checklist_run`을 넘는 확인했다/검토했다/대조했다/정리했다식 조사 절차 나열과 봉투/기록/번호를 옮겨 적었다/확인했다/표시했다식 목적어-행동 로그는 `procedural-checklist-cadence`로 차단됩니다. 자동 루프는 확인 동작 일부를 단서 불일치, 가설 변경, 용의자 순서 재정렬, 상대 거짓말, 위험/비용, 다음 행동으로 다시 써야 합니다.
- **Prose Taste Action Choreography Gate**: `prose_taste_profile.max_action_choreography_density_per_1000` 또는 `max_action_choreography_run`을 넘는 휘둘렀다/피했다/막았다/찔렀다식 전투 동작 나열은 `action-choreography-loop`로 차단됩니다. 자동 루프는 일부 동작을 부상, 무기/공간 파손, 거리/위치 변화, 목표 확보/실패, 감정 압박, 전세 반전으로 다시 써야 합니다.
- **First-Five Retention Gate**: `first_five_chapter_retention_plan`의 초반 5화 유지 비트를 scene evidence로 검증하고 누락 시 `retention-plan-drift`
- **Protagonist Appeal Staging Gate**: `character_appeal_moment`의 주인공 매력을 scene evidence의 선택/행동/비용으로 검증하고 누락 시 `character-appeal-not-staged`
- **Character Appeal Signature Gate**: character appeal signature / 주인공 매력 시그니처 행동은 고유 방식/특성, 주체적 행동, 비용 또는 취약성, visible story/social reaction을 같은 scene conflict/beat 또는 원고 1~2문장 안에 결합해야 합니다. 얇은 매력 선언이면 `character-appeal-signature-not-staged`, 원고에서 분리되거나 빠지면 `manuscript-character-appeal-signature-not-evidenced`
- **Trend Persistence**: `recordEngagementEvaluation`으로 `meta/quality-trend.json`에 독자 몰입 추세 저장
- **Engagement Revision Directives**: `engagement.revisionDirectives`를 editor/act-review 진단 입력에 포함
- **Reader Response Revision Directives**: `readerResponse.revisionDirectives`를 editor/act-review 진단 입력에 포함합니다. `friction_annotations`에서 온 location/reason/rewrite suggestion과 reader segment, `drop_off_annotations`에서 온 drop-off/skim location, last completed location, suggested revision은 독자 패널이 실제로 멈추거나 이탈한 위치와 코호트를 가리키므로 같은 회차 재시도에서 우선 반영합니다.
- **Repeated Engagement Directives**: `engagement.recurringEngagementDirectives`를 반복 실패 패턴으로 승격
- **Structural Engagement Escalation**: `recurringEngagementDirectives`가 3회 이상 반복되면 단순 재시도 대신 **구조적 재검토**로 `USER_INTERVENTION` 처리하고, `plot/plot-strategy.json`과 `chapters/chapter_XXX.json`을 함께 수정
- **Unified Gate State**: `evaluateChapterGate`와 `applyChapterGateDecision`으로 통과/재시도/사용자 개입을 `meta/ralph-state.json`에 기록
- **Quality Threshold**: 95점 (전체 회차 기본 완료 기준)
- **Circuit Breaker**: 동일 실패 3회 시 사용자 개입

### Quality Gates

| Validator | Regular | Chapter 1 | Role |
|-----------|---------|-----------|------|
| critic | ≥95 | ≥95 | Overall quality (100pt scale) |
| beta-reader | ≥95 | ≥95 | Engagement & retention |
| genre-validator | ≥95 | ≥95 | Genre compliance |

**All validators must pass** for chapter to proceed.

### Chapter 1 Special Requirements
- Strong hook in first paragraph
- Protagonist uniqueness within 3 paragraphs
- Promise of payoff within 3-5 chapters
- Predicted retention ≥95%

## Key Features

### Persistence
- Promise tag system (`<promise>CHAPTER_N_DONE</promise>`)
- Automatic checkpointing after each chapter
- Session recovery with full state restoration

### Quality Assurance
- Parallel validator execution (3x faster)
- Diagnostic-driven revision loop
- Circuit breaker for infinite loop prevention

### Session Management
- Auto-save every chapter completion
- 3 most recent backups maintained
- Resume from any checkpoint

## Documentation

**Detailed Guide**: See `references/detailed-guide.md`
- Ralph loop architecture
- Multi-validator system details
- Circuit breaker pattern
- Session recovery system
- Promise tag mechanics

**Usage Examples**: See `examples/example-usage.md`
- Full novel writing workflows
- Session recovery scenarios
- Quality gate examples
- Circuit breaker activation
- Act completion flow

## Phase 0: 비용 경고 (Cost Warning)

실행 전 사용자에게 비용을 안내합니다:

> **전체 집필 비용 안내**
> 대상: N화 집필 (사용자 지정 범위)
> 회차당: novelist(opus) + 검증 에이전트(opus)
>
> 예상 토큰 사용량: 회차당 ~80K 입력 + ~20K 출력
> 총 예상: N × 100K 토큰

AskUserQuestion으로 사용자 확인:
- "전체 진행" — 모든 회차 연속 집필
- "1막만" — 첫 번째 막만 집필
- "5화만 시범" — 5화만 먼저 작성 후 품질 확인

## Phase 0.5: 집필 전 설계 게이트

Ralph Loop를 시작하거나 재개하기 전에 설계 전제의 독자 매력 readiness를 실행 게이트로 확인합니다. 이 단계는 비용 확인 뒤, 첫 회차 생성 전에 실행합니다.

```spec
Bash("node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json")
```

- `reviews/design-gate-report.json`의 `passed == true`이고 `status == "PASS"`일 때만 Ralph Loop를 시작합니다.
- `premise-appeal-not-ready`, `weak-promise-evidence`, `premise-appeal-false-positive`, `premise-behavioral-intent-weak`, `premise-appeal-split-leakage`, `premise-appeal-holdout-weak`, `premise-appeal-report-stale`, `premise-appeal-source-missing`이 있으면 첫 회차를 쓰지 않고 루프를 시작하지 않습니다.
- 차단되면 `requires_user_intervention=true`로 보고하고, `recommendedCommands`의 `run-premise-appeal-benchmark`와 `apply-design-gate`를 먼저 처리합니다.

## Phase 0.6: 집필 전 문체 취향 게이트

Ralph Loop가 여러 회차를 자동으로 밀기 전에 prose taste benchmark가 최신 source evidence와 독자 문체 라벨을 통과했는지 확인합니다.

```spec
Bash("node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json")
```

- `reviews/style-gate-report.json`의 `passed == true`이고 `status == "PASS"`일 때만 Ralph Loop를 시작합니다.
- `prose-taste-not-ready`, `prose-taste-failing-samples`, `prose-taste-false-classification`, `prose-taste-missing-issue`, `style-friction-evidence-weak`, `style-highlight-evidence-weak`, `style-fingerprint-weak`, `authorial-style-drift`, `prose-taste-report-stale`, `prose-taste-source-missing`이 있으면 첫 회차를 쓰지 않고 루프를 시작하지 않습니다.
- 차단되면 `requires_user_intervention=true`로 보고하고, `recommendedCommands`의 `run-prose-taste-benchmark`와 `apply-style-gate`를 먼저 처리합니다.

## THE NOVEL OATH

소설 완성까지 멈추지 않는 자동 집필 모드입니다.

## Promise 태그

| 단계 | Promise |
|------|---------|
| 회차 완료 | `<promise>CHAPTER_{N}_DONE</promise>` |
| 막 완료 | `<promise>ACT_{N}_DONE</promise>` |
| 전체 완료 | `<promise>NOVEL_DONE</promise>` |

ACT/NOVEL completion promises are valid only when `last_gate.status == "PASS"`, `last_gate.passed == true`, `failed_chapters` is empty, and `requires_user_intervention` is false. `ACT_{N}_DONE` additionally requires `N matches current_act`, every chapter in that act present in `completed_chapters`, and the latest PASS gate covering the act end. Act ranges are resolved from `plot/structure.json` first, explicit state ranges second, and even `total_chapters / total_acts` fallback last. `NOVEL_DONE` additionally requires every chapter through `total_chapters` complete and the latest PASS gate covering the final chapter. The Stop hook and `act-completion.mjs` block completion promises that do not satisfy this gate state.

Do not emit generic completion promises such as `<promise>TASK_COMPLETE</promise>` during active Ralph Loop sessions. They are blocked; only `ACT_{N}_DONE` and `NOVEL_DONE` can complete Ralph phases.

### 집필 엔진 분기

기본적으로 각 회차 집필 시 `writing-team-collab`을 사용합니다. `--solo` 플래그로 novelist 단독 집필로 전환할 수 있습니다:

```python
for act in acts:
    for chapter in act.chapters:
        if --solo:
            /write {chapter} --solo  # novelist 단독 집필
        else:
            # 캐릭터 협업 팀으로 집필 (기본값)
            team-orchestrator run writing-team-collab {chapter}
```

## 실행 흐름 (v2)

```
designGate = Bash("node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json")
if designGate.passed != true:
    pause Ralph Loop before drafting chapter 1
styleGate = Bash("node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json")
if styleGate.passed != true:
    pause Ralph Loop before drafting chapter 1

for act in acts:
    for chapter in act.chapters:
        /write {chapter}             # 캐릭터 협업 (기본값), --solo 시 novelist 단독

        # 사후 처리
        generate_summary(chapter)
        update_state(chapter)

        # Multi-Validator 품질 게이트
        results = parallel_validate(critic, beta-reader, genre-validator)
        engagement = evaluateEngagementContract(design, plot, chapter.reader_experience, manuscript="chapters/chapter_XXX.md")
        engagementRecord = recordEngagementEvaluation(projectPath, projectId, chapter, engagement)
        Bash("node dist/cli/record-engagement.js --project {projectPath} --chapter {chapter} --version {chapterVersion} --json")
        Bash("node dist/cli/apply-chapter-gate.js --project {projectPath} --chapter {chapter} --version {chapterVersion} --quality-score {validatorConsensusScore} --json")

        if engagementRecord.regression.alertLevel in ["warning", "critical"]:
            diagnostic.add("독자 몰입 추세 회귀", engagementRecord.regression.alertMessage)

        if engagement.revisionDirectives.length > 0:
            diagnostic.add("Engagement Revision Directives", engagement.revisionDirectives.slice(0, 5))

        if any(issue.code == "retention-plan-drift" for issue in engagement.issues):
            diagnostic.add("초반 5화 유지 계획 이탈", "first_five_chapter_retention_plan의 해당 회차 비트를 scene evidence에 반영합니다.")

        if any(issue.code == "irresistible-question-drift" for issue in engagement.issues):
            diagnostic.add("중심 질문 이탈", "irresistible_question을 page_turn_question과 페이지터너 질문으로 다시 연결합니다.")

        if any(issue.code == "page-turn-question-closed" for issue in engagement.issues):
            diagnostic.add("페이지터너 질문 폐쇄", "page_turn_question과 page_turner_question을 설명/해결/정답 공개가 아닌 open-loop 미해결 질문으로 다시 씁니다.")

        if any(issue.code == "page-turn-question-too-broad" for issue in engagement.issues):
            diagnostic.add("페이지터너 질문 과도한 추상화", "page_turn_question과 page_turner_question을 로고+사건 번호, 이름+좌표, 다음 수신자+사진, 규칙+대가처럼 구체 앵커 두 개 이상이 있는 좁혀진 정보 공백으로 다시 씁니다.")

        if any(issue.code == "page-turn-question-not-staged" for issue in engagement.issues):
            diagnostic.add("페이지터너 질문 장면 근거 누락", "final scene에 page_turner_question을 낳는 구체 단서/폭로/위협/사물/사건을 배치합니다.")

        if any(issue.code == "character-appeal-not-staged" for issue in engagement.issues):
            diagnostic.add("주인공 매력 장면 누락", "character_appeal_moment를 선택/행동/비용으로 scene evidence에 반영합니다.")

        if any(issue.code == "character-appeal-signature-not-staged" for issue in engagement.issues):
            diagnostic.add("주인공 매력 시그니처 행동 누락", "character_appeal_moment를 고유 방식/특성, 주체적 행동, 비용 또는 취약성, visible story/social reaction이 함께 있는 scene conflict/beat로 다시 설계합니다.")

        if any(issue.code == "manuscript-character-appeal-signature-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 주인공 매력 시그니처 행동 누락", "chapters/chapter_XXX.md manuscript에서 주인공 매력 키워드를 설명하지 말고, 고유 방식/특성, 주체적 행동, 비용 또는 취약성, visible story/social reaction을 같은 1~2문장 장면 행동으로 결합합니다.")

        if any(issue.code == "protagonist-appeal-drift" for issue in engagement.issues):
            diagnostic.add("설계 주인공 매력 이탈", "protagonist_appeal을 character_appeal_moment와 scene evidence의 선택/행동/비용으로 다시 연결합니다.")

        if any(issue.code == "novelty-angle-drift" for issue in engagement.issues):
            diagnostic.add("신선한 차별점 이탈", "novelty_angle을 promise_fulfillment, chapter_reward, scene evidence에 다시 반영합니다.")

        if any(issue.code == "emotional-payoff-drift" for issue in engagement.issues):
            diagnostic.add("감정 보상 이탈", "emotional_payoff를 promise_fulfillment, chapter_reward, scene evidence에 다시 반영합니다.")

        if any(issue.code == "long-series-engine-drift" for issue in engagement.issues):
            diagnostic.add("장기 미스터리 엔진 이탈", "long_series_engine을 long_hook_threads, promise_fulfillment, scene evidence에 다시 연결합니다.")

        if any(issue.code == "long-hook-thread-not-staged" for issue in engagement.issues):
            diagnostic.add("장기 훅 누락", "long_hook_threads 중 최소 하나를 scene evidence에 반영합니다.")

        if any(issue.code == "long-hook-thread-not-advanced" for issue in engagement.issues):
            diagnostic.add("장기 훅 전진 부족", "scene evidence의 long_hook_threads를 이름만 반복하지 말고 새 단서, 좁혀진 가설, 위험/대가 변화, 다음 검증 행동 중 하나로 전진시킵니다.")

        if any(issue.code == "payoff-cadence-drift" for issue in engagement.issues):
            diagnostic.add("보상 주기 이탈", "payoff_cadence를 chapter_reward와 must_click_ending에 다시 반영합니다.")

        if any(issue.code == "fatigue-control-not-staged" for issue in engagement.issues):
            diagnostic.add("피로도 방지 설계 누락", "fatigue_controls를 promise_fulfillment, drop_off_risk, scene evidence에 관계 압박, 장소 변주, 행동 방식 변주, 감정 리셋 중 하나로 반영해 반복 비트를 끊습니다.")

        if any(issue.code == "tension-reset-not-staged" for issue in engagement.issues):
            diagnostic.add("완급 재점화 설계 누락", "tension_reset_plan을 promise_fulfillment, drop_off_risk, scene evidence에 짧은 호흡/정적/추리 호흡 뒤 새 질문 또는 새 위협으로 재점화하는 리듬으로 반영합니다.")

        if any(issue.code == "scene-causal-escalation-not-staged" for issue in engagement.issues):
            diagnostic.add("장면 간 인과 상승 누락", "이전 scene 결과가 직후/그 결과/이어 같은 인과 연결로 다음 scene 압박, 행동, 결과를 밀도록 scene conflict/beat를 다시 연결합니다.")

        if any(issue.code == "binge-reason-not-staged" for issue in engagement.issues):
            diagnostic.add("회차 말미 연속 클릭 이유 누락", "binge_reason을 must_click_ending과 마지막 scene evidence에 반영합니다.")

        if any(issue.code == "manuscript-irresistible-question-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 중심 질문 미장면화", "chapters/chapter_XXX.md manuscript에서 irresistible_question/page_turner_question을 왜/어떻게/누가 같은 미해결 질문으로 실제 장면 안에 열어 둡니다.")

        if any(issue.code in ["manuscript-reward-not-evidenced", "manuscript-ending-not-evidenced"] for issue in engagement.issues):
            diagnostic.add("원고 본문 독자 보상 누락", "chapters/chapter_XXX.md manuscript에 chapter_reward와 must_click_ending을 실제 사건/발견/결과로 다시 씁니다.")

        if any(issue.code == "manuscript-earned-reward-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 벌어낸 보상 누락", "chapter_reward를 earned reward/벌어낸 보상으로 다시 씁니다. 주인공의 단서 처리, 추론/선택, 그 결과 발견을 연결하고 자동 파일/안내문/보고서 같은 수동 설명을 제거합니다.")

        if any(issue.code == "manuscript-reward-freshness-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 보상 신선도 부족", "reward freshness/보상 신선도를 복구합니다. 벌어낸 보상이 단순 기록 일치나 단서 확인으로 멈추지 않게 고유 장치, 규칙 변화, 장르 보상 체감, 다음 행동 압박을 같은 보상 장면에 붙입니다.")

        if any(issue.code == "serial-reward-pattern-repetition-not-staged" for issue in engagement.issues):
            diagnostic.add("보상 전달 방식 반복", "serial reward pattern variation을 복구합니다. chapter_reward가 전 회차와 같은 로그-기록 대조/알림-규칙 증명을 이름만 바꿔 반복하지 않게 관계 배신, 반대세력 countermove, 행동 방식 반전, 대가 상승, 규칙 변이, 구체 사물 폭로 중 새 reward mode로 바꿉니다.")

        if any(issue.code == "manuscript-serial-reward-pattern-repetition-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 보상 전달 방식 반복", "chapters/chapter_XXX.md manuscript의 보상 순간을 다시 씁니다. 전 회차와 같은 로그-기록 대조/알림-규칙 증명을 이름만 바꿔 반복하지 말고 관계 배신, 반대세력 countermove, 행동 방식 반전, 대가 상승, 규칙 변이, 구체 사물 폭로 중 새 reward mode로 보상이 도착하게 합니다.")

        if any(issue.code == "manuscript-question-ladder-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 질문 사다리 끊김", "question ladder/질문 사다리를 복구합니다. 벌어낸 보상 뒤의 답, 폭로, 규칙 증명이 모든 의문 해결/설명 완료/안도로 닫히지 않게 하고, 새 미해결 왜/어떻게/누가/다음 질문/다음 표적/남은 대가를 바로 엽니다.")

        if any(issue.code == "manuscript-forecast-revision-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 서사 예측 수정 누락", "forecast revision / 서사 예측 수정을 복구합니다. 반전, 예상 뒤집힘, 오판, 가설 수정, 재해석을 약속했다면 원고 안에 예상이나 가설, 그 예상을 깨는 구체 단서나 사건, 바뀐 가설/용의자 순위/단서 의미/계획/다음 검증 행동을 한 흐름으로 씁니다.")

        if any(issue.code == "manuscript-fatigue-control-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 피로도 방지 장치 누락", "chapters/chapter_XXX.md manuscript에서 같은 조사/대화/전투 반복을 줄이고 fatigue_controls를 관계 압박, 장소 변주, 행동 방식 변주, 감정 리셋으로 실제 장면화합니다.")

        if any(issue.code == "manuscript-tension-reset-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 완급 재점화 누락", "chapters/chapter_XXX.md manuscript에서 고강도 비트 뒤 짧은 호흡, 감각 정적, 단서 해석, 감정 리셋을 둔 다음 새 질문/새 위협으로 긴장을 재점화합니다.")

        if any(issue.code == "manuscript-tension-wave-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 긴장 파형 누락", "tension wave / 긴장 파형을 다시 씁니다. 초반 압박과 열린 질문, 중반 악화와 선택지 축소, 말미 고점과 열린 질문을 원고 순서대로 분산합니다.")

        if any(issue.code == "manuscript-ending-hook-not-staged" for issue in engagement.issues):
            diagnostic.add("원고 말미 훅 장면화 누락", "chapters/chapter_XXX.md manuscript의 마지막 구간에 must_click_ending을 새 사건, 폭로, 위협, 미해결 질문으로 다시 배치합니다.")

        if any(issue.code == "manuscript-ending-hook-closed" for issue in engagement.issues):
            diagnostic.add("원고 말미 열린 루프 폐쇄", "chapters/chapter_XXX.md manuscript의 마지막 구간에서 must_click_ending을 해결/종결/범인 확정/설명 완료/안도로 닫지 말고 미해결 질문으로 남깁니다.")

        if any(issue.code == "manuscript-ending-hook-question-too-broad" for issue in engagement.issues):
            diagnostic.add("원고 말미 질문 과도한 추상화", "마지막 열린 질문을 로고+사건 번호, 다음 수신자+사진, 이름+좌표, 규칙+대가처럼 구체 앵커 두 개 이상이 있는 좁혀진 정보 공백으로 다시 씁니다.")

        if any(issue.code == "manuscript-ending-hook-reaction-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 말미 반응 누락", "chapters/chapter_XXX.md manuscript의 must_click_ending 말미 훅에 주인공의 몸감각, 물리적 행동, 즉각 위험 반응을 붙입니다.")

        if any(issue.code == "manuscript-ending-hook-setup-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 말미 훅 준비 단서 누락", "ending hook setup / 말미 훅 준비 단서를 복구합니다. 마지막 훅의 좌표, 사진, 명명 장소, 신원, 특수 물건 앵커를 앞선 장면의 발견/확인/기록/흔적으로 먼저 심습니다.")

        if any(issue.code == "manuscript-fair-twist-setup-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 말미 반전 준비 단서 누락", "말미 반전은 fair twist여야 합니다. chapters/chapter_XXX.md manuscript의 앞선 장면에 번호/파일/로그/로고/목소리/녹음/서명/배지 같은 반전 준비 단서를 심고 마지막 reveal 단서 계열과 맞물리게 고칩니다.")

        if any(issue.code == "foreshadowing-plant-not-staged" for issue in engagement.issues):
            diagnostic.add("복선 단서 구체화 누락", "foreshadowing plant concreteness를 보강합니다. 선언한 foreshadowing_plant를 로고, 번호, 표식, 파일, 상처, 목소리, 사물, 감각 디테일 같은 물증으로 scene conflict/beat에 은근히 심습니다.")

        if any(issue.code == "manuscript-foreshadowing-plant-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 복선 단서 구체화 누락", "chapters/chapter_XXX.md manuscript에서 선언한 복선을 로고, 번호, 표식, 파일, 상처, 목소리, 사물, 감각 디테일 같은 물증으로 장면 안에 배치합니다.")

        if any(issue.code == "foreshadowing-payoff-not-staged" for issue in engagement.issues):
            diagnostic.add("복선 회수 장면화 누락", "foreshadowing payoff resolution을 보강합니다. 선언한 foreshadowing_payoff가 단서의 의미를 밝히고 원인/배후/숨은 연결을 드러낸 뒤 주인공 행동, 위험, 관계, 다음 목표를 바꾸는 결과까지 scene conflict/beat에 넣습니다.")

        if any(issue.code == "manuscript-foreshadowing-payoff-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 복선 회수 장면화 누락", "chapters/chapter_XXX.md manuscript에서 선언한 복선 회수를 단서 재등장으로 끝내지 말고, 의미 폭로와 그 결과 바뀐 행동/위험/관계/다음 목표를 장면 안에 씁니다.")

        if any(issue.code in ["manuscript-appeal-not-evidenced", "manuscript-payoff-not-evidenced"] for issue in engagement.issues):
            diagnostic.add("원고 본문 매력/감정 보상 누락", "chapters/chapter_XXX.md manuscript에 character_appeal_moment의 선택/행동/비용과 emotional_payoff의 체감 보상을 다시 씁니다.")

        if any(issue.code == "manuscript-payoff-embodiment-not-evidenced" for issue in engagement.issues):
            diagnostic.add("감정 보상 장면화 누락", "chapters/chapter_XXX.md manuscript에서 emotional_payoff의 쾌감/긴장감/설렘/따뜻함 같은 장르별 보상어를 몸감각, 감각 디테일, 행동 반응으로 장면화합니다.")

        if any(issue.code == "manuscript-payoff-delight-not-evidenced" for issue in engagement.issues):
            diagnostic.add("보상 쾌감 고점 부족", "payoff delight / 보상 쾌감을 복구합니다. chapters/chapter_XXX.md manuscript의 chapter_reward 순간에 압박 축적, 벌어낸 단서 해소, 의미 변화나 반전, 몸 반응, 즉시 새 결과나 질문을 한 장면 고점으로 결합합니다.")
        if any(issue.code == "manuscript-genre-delight-not-evidenced" for issue in engagement.issues):
            diagnostic.add("장르 쾌감 장치 부족", "genre-specific delight / 장르 쾌감을 복구합니다. 미스터리는 단서 결합/추론/남는 의문을, 로맨스는 거리 변화/접촉/취약한 대화/관계 선택을, 액션은 추격 동선/전술 반전/신체 결과를, 스릴러는 조여드는 위협/덫 확대/거짓 반전/강제 선택을, 현대판타지는 시스템 피드백/스킬 활용/대가/현실 결과를 emotional_payoff 장면에 결합합니다.")

        if any(issue.code == "manuscript-emotional-arc-not-evidenced" for issue in engagement.issues):
            diagnostic.add("감정선 실행 누락", "chapters/chapter_XXX.md manuscript에서 narrative_elements.emotional_goal과 scene.emotional_tone을 감정명, 몸감각, 행동 반응으로 실제 장면화합니다.")

        if any(issue.code == "manuscript-emotional-progression-not-evidenced" for issue in engagement.issues):
            diagnostic.add("감정 전환/누적 누락", "chapters/chapter_XXX.md manuscript에서 선언된 감정선의 전환 계기, 선택/사건, 관계 반응, 행동 반응을 장면 안에 추가합니다.")

        if any(issue.code == "manuscript-protagonist-agency-not-evidenced" for issue in engagement.issues):
            diagnostic.add("주인공 능동성 누락", "chapters/chapter_XXX.md manuscript에서 주인공이 직접 결정하고 대가를 감수하는 선택/행동/비용을 실제 장면으로 다시 씁니다.")

        if any(issue.code == "character-drive-carryover-not-staged" for issue in engagement.issues):
            diagnostic.add("내적 변화 이월 누락", "character drive carryover를 보강합니다. 직전 내적 변화가 다음 회차 도움 요청, 습관 내려놓기, 통제권 나누기, 달라진 행동으로 previous_summary, current_plot, reader_experience, opening scene에 남게 설계합니다.")

        if any(issue.code == "manuscript-character-drive-carryover-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 내적 변화 이월 누락", "chapters/chapter_XXX.md manuscript 초반에서 직전 내적 변화 때문에 주인공이 도움 요청, 습관 내려놓기, 통제권 나누기, 달라진 행동을 실제 선택으로 실행하게 씁니다.")

        if any(issue.code == "manuscript-choice-cost-carryover-not-evidenced" for issue in engagement.issues):
            diagnostic.add("선택 비용 여파 누락", "chapters/chapter_XXX.md manuscript에서 choice cost carryover를 보강합니다. 포기한 대안, 신고 기록, 알리바이, 증거, 시간, 관계 같은 비용이 다음 압박으로 돌아와 선택지 축소, 길 차단, 의심 증가, 증거 상실, 시간 단축을 만들게 씁니다.")

        if any(issue.code == "scene-choice-cost-lock-not-staged" for issue in engagement.issues):
            diagnostic.add("선택-대가 잠금 누락", "scene conflict/beat에서 choice-cost lock을 보강합니다. 주인공 선택 직후 선택지/관계/증거/시간/경로 중 하나가 되돌릴 수 없는 상태로 닫히거나 좁혀지게 설계합니다.")

        if any(issue.code == "manuscript-choice-cost-lock-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 선택-대가 잠금 누락", "chapters/chapter_XXX.md manuscript에서 choice-cost lock을 장면화합니다. 선택 직후 닫힘, 차단, 사라짐, 노출, 확정이 보이도록 선택지/관계/증거/시간/경로 중 하나를 실제로 잃게 씁니다.")

        if any(issue.code == "choice-cost-lock-carryover-not-staged" for issue in engagement.issues):
            diagnostic.add("선택-대가 잠금 이월 누락", "전 회차에서 잠긴 선택지/관계/증거/시간/경로를 다음 회차 previous_summary, current_plot, reader_experience, opening scene의 다음 회차 압박으로 이어받게 설계합니다.")

        if any(issue.code == "manuscript-choice-cost-lock-carryover-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 선택-대가 잠금 이월 누락", "chapters/chapter_XXX.md manuscript 초반에서 choice-cost lock carryover를 장면화합니다. 전 회차 잠긴 선택지가 의심, 감시, 경로 차단, 신뢰 붕괴처럼 현재 행동을 좁히는 압박으로 돌아오게 씁니다.")

        if any(issue.code == "revelation-consequence-carryover-not-staged" for issue in engagement.issues):
            diagnostic.add("폭로 결과 이월 누락", "revelation consequence carryover를 보강합니다. 전 회차 폭로가 다음 회차 계획 변경, 새 압박, 용의자 지도, 관계 판단, 다음 질문으로 previous_summary, current_plot, reader_experience, opening scene에 남게 설계합니다.")

        if any(issue.code == "manuscript-revelation-consequence-carryover-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 폭로 결과 이월 누락", "chapters/chapter_XXX.md manuscript 초반에서 전 회차 폭로가 주인공의 계획 변경, 새 압박, 용의자 판단, 관계 불신, 다음 질문을 바꾸는 장면으로 보이게 씁니다.")

        if any(issue.code == "mystery-hypothesis-carryover-not-staged" for issue in engagement.issues):
            diagnostic.add("추리 가설 이월 누락", "mystery hypothesis carryover를 보강합니다. 직전 단서가 다음 회차 가설 수정, 용의자 순위, 용의자 제외/승격, 다음 검증 행동으로 previous_summary, current_plot, reader_experience, opening scene에 남게 설계합니다.")

        if any(issue.code == "manuscript-mystery-hypothesis-carryover-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 추리 가설 이월 누락", "chapters/chapter_XXX.md manuscript 초반에서 직전 단서 때문에 주인공이 가설 수정, 용의자 순위 재정렬, 알리바이 재검증, 다음 검증 행동을 실제로 선택하는 장면을 씁니다.")

        if any(issue.code == "relationship-turning-point-not-staged" for issue in engagement.issues):
            diagnostic.add("관계 전환점 밀도 부족", "relationship turning point / 관계 전환점을 보강합니다. 취약성/관계 위험, 상대의 선택/반응, 신뢰/불신/거리 변화, 즉시 달라진 행동 결과를 같은 scene window에 묶습니다.")

        if any(issue.code == "relationship-mind-inference-not-staged" for issue in engagement.issues):
            diagnostic.add("관계 마음 추론 누락", "relationship mind inference / 관계 마음 추론을 보강합니다. 숨김, 오해, 진심, 망설임, 바뀐 속내가 시선, 침묵, 회피, 대화, POV 해석으로 읽히게 같은 scene window에 넣습니다.")

        if any(issue.code == "relationship-mutual-pressure-not-staged" for issue in engagement.issues):
            diagnostic.add("관계 상호 압박 누락", "relationship mutual pressure / 관계 상호 압박을 보강합니다. 상대가 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험 중 하나를 걸고 주인공의 다음 행동을 바꾸게 씁니다.")

        if any(issue.code == "manuscript-relationship-turning-point-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 관계 전환점 밀도 부족", "chapters/chapter_XXX.md manuscript에서 약점 공개·비밀·사과·거절 같은 위험, 상대의 선택/반응, 관계 상태 변화, 달라진 행동 결과를 같은 1-2문장 안에 씁니다.")

        if any(issue.code == "manuscript-relationship-mind-inference-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 관계 마음 추론 누락", "chapters/chapter_XXX.md manuscript에서 관계 결과만 말하지 말고 숨김, 오해, 진심, 망설임, 바뀐 속내를 시선, 침묵, 회피, 대화, POV 해석으로 읽히게 씁니다.")

        if any(issue.code == "manuscript-relationship-mutual-pressure-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 관계 상호 압박 누락", "chapters/chapter_XXX.md manuscript에서 상대의 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험이 관계 전환점과 다음 행동을 바꾸게 씁니다.")

        if any(issue.code == "relationship-evolution-carryover-not-staged" for issue in engagement.issues):
            diagnostic.add("관계 장기 상태 이월 누락", "relationship evolution carryover를 보강합니다. 전 회차 관계 변화가 다음 회차 대화, 행동, 불신/신뢰, 거리, 동행 압박으로 previous_summary, current_plot, reader_experience, opening scene에 남게 설계합니다.")

        if any(issue.code == "manuscript-relationship-evolution-carryover-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 관계 장기 상태 이월 누락", "chapters/chapter_XXX.md manuscript 초반에서 전 회차 관계 변화를 대화, 침묵, 반박, 보호, 동행, 불신/신뢰 변화로 장면화합니다.")

        if any(issue.code == "manuscript-stakes-not-evidenced" for issue in engagement.issues):
            diagnostic.add("stakes clarity 누락", "chapters/chapter_XXX.md manuscript에서 돌이킬 수 없는 행동 전에 구체 손실 대상과 닥친 위협/비용을 실제 장면으로 다시 씁니다.")

        if any(issue.code == "manuscript-stakes-subject-not-personalized" for issue in engagement.issues):
            diagnostic.add("스테이크 대상 개인화 부족", "chapters/chapter_XXX.md manuscript에서 피해자/표적/대상/수신자/사람 같은 일반 명사를 이름, 관계, 역할, 소지품, 목소리, 메시지, 신분증, 사진, 사건/파일 번호 같은 구체 흔적으로 첫 압박 창에서 개인화합니다.")

        if any(issue.code == "manuscript-reader-desire-not-evidenced" for issue in engagement.issues):
            diagnostic.add("독자 욕망 약함", "reader desire intensity를 복구합니다. chapters/chapter_XXX.md manuscript에서 구체 손실 대상, 주인공 의도, 실패 비용, 차단된 선택지를 같은 회차 흐름에 묶어 독자가 바라는 결과를 만듭니다.")

        if any(issue.code == "manuscript-active-opposition-not-evidenced" for issue in engagement.issues):
            diagnostic.add("active opposition 누락", "chapters/chapter_XXX.md manuscript에서 장면 압박을 적대적 의지의 의도적 방해, 조작, 협박, 표적화로 실제 장면화합니다.")

        if any(issue.code == "manuscript-active-opposition-actor-too-vague" for issue in engagement.issues):
            diagnostic.add("active opposition 주체 모호", "chapters/chapter_XXX.md manuscript에서 방해 주체를 익명으로 두지 말고 이름 있는 반대세력, 구체 역할, 적대 시스템과 전술로 연결합니다.")

        if any(issue.code == "scene-active-opposition-not-staged" for issue in engagement.issues):
            diagnostic.add("능동 반대세력 누락", "scene active opposition을 보강합니다. scene conflict/beat의 장면 압박을 날씨/정전/잠긴 문 같은 비의지적 장애물로만 두지 말고, 적대적 의지의 의도적 방해, 조작, 협박, 표적화로 설계합니다.")

        if any(issue.code == "scene-novelty-matrix-not-staged" for issue in engagement.issues):
            diagnostic.add("장면 신선도 매트릭스 부족", "scene novelty matrix를 보강합니다. scene conflict/beat에 reward_mode, conflict_mode, setting_mode, opposition_mode 중 최소 3축을 결합하고, setting_mode는 장소명만이 아니라 동선/차단물/거리 압박/잠긴 접근/우회/침투/탈출 같은 공간 affordance로 작동하게 만듭니다.")

        if any(issue.code == "manuscript-scene-novelty-matrix-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 장면 신선도 실행 누락", "chapters/chapter_XXX.md manuscript에서 설계된 scene novelty matrix를 같은 장면 창 안에 실제 실행합니다. 보상 전달 방식, 갈등/전술, 공간 제약, 반대세력 대응이 사건 설명이 아니라 행동, 동선, 방해, 확보/폭로/규칙 변화로 함께 발생해야 합니다.")

        if any(issue.code == "antagonist-countermove-carryover-not-staged" for issue in engagement.issues):
            diagnostic.add("반대세력 대응 이월 누락", "antagonist countermove carryover를 보강합니다. 전 회차 주인공 행동이 반대세력의 반격, 전술 변경, 표적 재설정, 증거 삭제, 접근 권한 회수로 previous_summary, current_plot, reader_experience, opening scene에 돌아오게 설계합니다.")

        if any(issue.code == "manuscript-antagonist-countermove-carryover-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 반대세력 대응 이월 누락", "chapters/chapter_XXX.md manuscript 초반에서 전 회차 주인공 행동 때문에 반대세력이 반격, 전술 변경, 표적 재설정, 증거 삭제, 접근 권한 회수로 현재 압박을 바꾸는 장면을 씁니다.")

        if any(issue.code == "manuscript-character-development-not-evidenced" for issue in engagement.issues):
            diagnostic.add("인물 변화 실행 누락", "chapters/chapter_XXX.md manuscript에서 narrative_elements.character_development를 선택, 인정, 사과, 공개, 대가, 관계 행동, 달라진 행동으로 실제 장면화합니다.")

        if any(issue.code == "manuscript-generic-character-label-not-evidenced" for issue in engagement.issues):
            diagnostic.add("캐릭터 실명 사용 누락", "chapters/chapter_XXX.md manuscript에서 주인공/조력자 같은 설계 라벨 반복을 캐릭터 실명 또는 별칭으로 바꿉니다.")

        if any(issue.code == "manuscript-design-jargon-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 설계어 오염", "chapters/chapter_XXX.md manuscript에서 지적 쾌감/보상 주기/장기 미스터리 같은 설계어를 제거하고 구체 단서, 행동, 몸감각, 대화 서브텍스트로 장면화합니다.")

        if any(issue.code == "manuscript-pressure-not-evidenced" for issue in engagement.issues):
            diagnostic.add("장면 압박/장애물 누락", "chapters/chapter_XXX.md manuscript에서 장면 압박, 장애물, 저항을 시간 압박/물리적 차단/상대 반격/결과 악화로 실제 장면화합니다.")

        if any(issue.code == "manuscript-tactical-adaptation-not-evidenced" for issue in engagement.issues):
            diagnostic.add("전술 재계산 누락", "chapters/chapter_XXX.md manuscript에서 tactical adaptation을 보강합니다. 반전/장애물이 첫 계획을 막은 뒤 주인공이 계획 변경, 우회, 수단 전환, 새 단서 활용, 다음 행동 변경으로 대응하게 씁니다.")

        if any(issue.code == "manuscript-consequence-not-evidenced" for issue in engagement.issues):
            diagnostic.add("장면 결과 악화 누락", "chapters/chapter_XXX.md manuscript에서 압박 뒤의 대가, 손실, 회복 불가 변화, 새 위협을 실제 결과 악화로 다시 씁니다.")

        if any(issue.code == "manuscript-causal-chain-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 인과 사슬 누락", "chapters/chapter_XXX.md manuscript에서 압박이 행동을 바꾸고, 행동이 결과를 만들고, 결과가 다음 비트를 여는 cause-and-effect 사슬로 다시 씁니다.")

        if any(issue.code == "manuscript-micro-turn-density-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 micro-turn density 부족", "chapters/chapter_XXX.md manuscript에서 인접 문장 창마다 독자 예측, 선택, 위험, 관계, 전술, 비용, 다음 질문 중 하나가 바뀌게 다시 씁니다. 단서/기록/알림 나열을 가설 수정, 선택 축소, 위험 상승, 관계 변화, 다음 행동 변경, 대가, 다음 질문으로 연결합니다.")

        if any(issue.code == "manuscript-convenient-resolution-not-evidenced" for issue in engagement.issues):
            diagnostic.add("우연한 해결 보정", "chapters/chapter_XXX.md manuscript에서 구조/체포/탈출/증거 발견을 사전 설치, 주인공이 작동시킨 선택/행동, 해결 뒤 대가가 있는 earned resolution으로 다시 씁니다.")

        if any(issue.code == "manuscript-pov-focalization-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 POV 초점화 부족", "chapters/chapter_XXX.md manuscript에서 사건/단서/보상/말미 훅을 POV 시점 앵커와 몸감각, 시선, 해석, 미해결 의문으로 같은 장면 문장 안에 다시 씁니다.")

        if any(issue.code == "manuscript-drop-off-mitigation-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 이탈 방지 전략 미실행", "chapters/chapter_XXX.md manuscript에서 drop_off_risk의 이탈 방지 전략을 순서와 행동으로 실제 장면화합니다.")

        if any(issue.code in ["manuscript-long-hook-not-evidenced", "manuscript-payoff-cadence-not-evidenced"] for issue in engagement.issues):
            diagnostic.add("원고 본문 장기 훅/보상 주기 누락", "chapters/chapter_XXX.md manuscript에 long_hook_threads의 실제 단서와 payoff_cadence의 회차 보상 리듬을 다시 씁니다.")

        if any(issue.code == "manuscript-long-hook-clue-not-evidenced" for issue in engagement.issues):
            diagnostic.add("장기 훅 구체 단서 누락", "chapters/chapter_XXX.md manuscript에서 장기 훅을 추상 연결이 아니라 번호, 파일, 로그, 로고 같은 구체 단서로 다시 씁니다.")

        if any(issue.code == "manuscript-long-hook-thread-not-advanced" for issue in engagement.issues):
            diagnostic.add("원고 장기 훅 정체", "chapters/chapter_XXX.md manuscript에서 장기 훅 단서가 새 발견, 가설 축소, 위험 변화, 다음 검증 행동으로 이야기 상태를 바꾸게 다시 씁니다.")

        if any(issue.code == "manuscript-scene-intent-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 실행 장면 의도 누락", "chapters/chapter_XXX.md manuscript에 scene.conflict 장면 갈등과 scene.beat 장면 전환을 실제 행동/선택/결과로 다시 씁니다.")

        if any(issue.code == "manuscript-scene-order-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 장면 순서 역전", "chapters/chapter_XXX.md manuscript의 장면 순서를 chapters/chapter_XXX.json의 scene 번호 순서대로 재배치합니다.")

        if any(issue.code == "manuscript-scene-state-delta-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 장면 상태 변화 누락", "chapters/chapter_XXX.md manuscript에서 각 scene turn을 before 압박과 after 결과가 이어지는 장면 창으로 다시 씁니다. 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나가 원고 문장 위에서 실제로 바뀌어야 합니다.")

        if any(issue.code == "scene-state-delta-not-staged" for issue in engagement.issues):
            diagnostic.add("장면 상태 변화 누락", "scene.conflict/scene.beat를 확인/발견/연결 나열이 아니라 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나가 장면 전후로 바뀌는 story-state delta로 다시 씁니다.")

        if any(issue.code == "scene-evidence-generic" for issue in engagement.issues):
            diagnostic.add("추상 scene evidence", "메타 설명을 제거하고 scene.conflict/scene.beat를 구체적 장면 실행: 행동/장애물/결과, 사물/단서, 상황 변화로 다시 씁니다.")

        if any(issue.code == "signature-scene-image-not-staged" for issue in engagement.issues):
            diagnostic.add("시그니처 장면 이미지 누락", "signature scene image를 설계합니다. 최소 한 핵심 scene conflict/beat에 기억 가능한 사물/공간/몸동작, 시각 디테일, 이야기 전환, story-impact lift를 같은 장면 이미지로 결합합니다. story-impact lift는 선택 비용, 규칙 변화, 단서 재해석, 관계/정체성 변화, 되돌릴 수 없는 결과 중 하나여야 합니다.")

        if any(issue.code == "manuscript-signature-scene-image-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 시그니처 장면 이미지 누락", "chapters/chapter_XXX.md manuscript에서 핵심 보상/반전/말미 훅 중 하나를 기억 가능한 사물/공간/몸동작, 시각 디테일, 이야기 전환, story-impact lift가 함께 있는 1~2문장 한 컷으로 다시 씁니다. 이미지가 선택 비용, 규칙 변화, 단서 재해석, 관계/정체성 변화, 되돌릴 수 없는 결과 중 하나를 만들게 합니다.")

        if any(issue.code == "motif-resonance-not-staged" for issue in engagement.issues):
            diagnostic.add("잔향 모티프 씨앗 누락", "narrative_elements.resonance_seed를 scene conflict/beat에 반영합니다. 씨앗 이미지가 시각 디테일, 감정 잔향, 의미 변화, 이야기 결과를 함께 만들게 설계합니다.")

        if any(issue.code == "manuscript-motif-resonance-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 잔향 모티프 누락", "chapters/chapter_XXX.md manuscript에서 resonance_seed 이미지를 1~2문장 창 안에 반복하고, 몸감각/감정 잔향, 의미 변화, 선택 비용/관계/규칙/단서/되돌릴 수 없는 결과로 이어지게 다시 씁니다.")

        if any(issue.code == "manuscript-summary-prose" for issue in engagement.issues):
            diagnostic.add("요약문형 원고", "chapters/chapter_XXX.md manuscript를 설명 요약이 아니라 장면 질감이 있는 감각, 행동, 대화 중심 원고로 다시 씁니다.")

        if any(issue.code == "manuscript-scene-density-not-evidenced" for issue in engagement.issues):
            diagnostic.add("보고서형 원고 장면 밀도 부족", "chapters/chapter_XXX.md manuscript를 현장 기록/분석/항목/결론 나열이 아니라 직접 행동, 몸감각, 대화/서브텍스트가 같은 장면 흐름에 붙은 원고로 다시 씁니다.")

        if any(issue.code == "manuscript-spatial-blocking-not-evidenced" for issue in engagement.issues):
            diagnostic.add("원고 공간 블로킹 부족", "chapters/chapter_XXX.md manuscript의 액션/위기 장면에 장소 기준점, 동선, 차단물, 거리 압박을 같은 장면 흐름으로 다시 씁니다.")

        if any(issue.code == "manuscript-dialogue-subtext-not-evidenced" for issue in engagement.issues):
            diagnostic.add("대화 서브텍스트 부족", "chapters/chapter_XXX.md manuscript의 대화문에서 독자 보상/핵심 질문/장기 미스터리/보상 주기/주인공 매력 설명을 줄이고 갈등, 회피, 반박, 침묵, 행동 비트로 정보를 드러냅니다.")

        if any(issue.code == "manuscript-dialogue-conflict-not-evidenced" for issue in engagement.issues):
            diagnostic.add("대화 갈등 누락", "chapters/chapter_XXX.md manuscript의 3턴 이상 대화에 반박, 거부, 회피, 위협, 침묵, 힘의 균형을 바꾸는 행동 비트를 추가합니다.")

        if any(issue.code == "manuscript-dialogue-turn-not-evidenced" for issue in engagement.issues):
            diagnostic.add("대화 전환 누락", "chapters/chapter_XXX.md manuscript의 논쟁성 대화가 정보 변화, 권력 변화, 관계 상태 변화, 수락/거절된 조건, 또는 다음 행동으로 이야기 상태를 바꾸도록 다시 씁니다.")

        if any(issue.code == "manuscript-dialogue-state-carryover-not-evidenced" for issue in engagement.issues):
            diagnostic.add("대화 상태 누적 누락", "chapters/chapter_XXX.md manuscript에서 dialogue state carryover를 보강합니다. 대화 전환으로 바뀐 이야기 상태가 바로 다음 행동 또는 다음 압박에 상태 누적되도록 파일, 로그, 조건, 관계, 권력, 열린 문 같은 변화가 원고 진행을 바꾸게 씁니다.")

        if any(issue.code == "manuscript-character-voice-not-differentiated" for issue in engagement.issues):
            diagnostic.add("인물별 대사 음성 미분화", "chapters/chapter_XXX.md manuscript의 다중 화자 대화에 화자별 말투, 어휘, 문장 리듬, 반응 전술을 분리하고 동일한 대사 반복을 제거합니다.")

        if proseCraft.passed == false:
            diagnostic.add("원고 문장 품질", proseCraft.issues.slice(0, 5))
            diagnostic.add("Prose Craft Revision Directives", proseCraft.revisionDirectives.slice(0, 5))

        if any(issue.code == "opening-hook-not-evidenced" for issue in engagement.issues):
            diagnostic.add("1화 첫 문단 훅 누락", "chapters/chapter_XXX.md manuscript의 첫 문단에서 core_hook 또는 novelty_angle을 즉시 보여줍니다.")

        if any(issue.code == "opening-hook-delayed" for issue in engagement.issues):
            diagnostic.add("1화 첫 문장 훅 지연", "첫 문장/첫 비트가 평범한 일상, 날씨, 분위기로 시작하지 않도록 하고 core_hook 또는 novelty_angle을 즉시 장면화합니다.")

        if any(issue.code == "opening-hook-not-embodied" for issue in engagement.issues):
            diagnostic.add("1화 첫 화면 체화 부족", "첫 1~2문장 안에서 core_hook/novelty_angle을 주인공의 행동 또는 선택 압박, 감각/POV 앵커, 미해결 위험/질문과 함께 장면화합니다. 전제 설명문이 아니라 손, 화면, 소리, 닫힌 선택지, 즉시 움직이는 행동으로 시작합니다.")

        if any(issue.code == "manuscript-opening-momentum-not-evidenced" for issue in engagement.issues):
            diagnostic.add("후속 회차 오프닝 모멘텀 부족", "chapters/chapter_XXX.md manuscript의 첫 문단을 지난 사건 요약이 아니라 즉각적인 행동, 위협, 질문, 감각 반응이 있는 현재 장면으로 다시 씁니다.")

        if engagement.recurringEngagementDirectives.length > 0:
            diagnostic.add("Repeated Engagement Directives", engagement.recurringEngagementDirectives.slice(0, 5))

        if any(directive.count >= 3 for directive in engagement.recurringEngagementDirectives):
            diagnostic.add("구조적 재검토", "반복 독자 몰입 실패가 3회 이상입니다. plot/plot-strategy.json과 chapters/chapter_XXX.json을 함께 재설계합니다.")

        gateDecision = evaluateChapterGate({
            chapterNumber: chapter,
            attemptNumber: retry_count + 1,
            maxRetries: 3,
            lastScore: validator_consensus_score(results),
            threshold: 95,
            engagement: {
                passed: engagement.passed,
                score: engagement.score,
                alertLevel: engagementRecord.regression.alertLevel,
                regressionDetected: engagementRecord.regression.regressionDetected,
                issues: engagement.issues
            },
            requireEngagement: true
        })
        applyChapterGateDecision(projectPath, chapter, gateDecision)

        if gateDecision.status == "PASS":
            <promise>CHAPTER_{chapter}_DONE</promise>
            continue

        if gateDecision.status == "USER_INTERVENTION":
            stop_and_ask_user(gateDecision.retryPrompt)
            break

        # Diagnostic 기반 수정 루프
        for retry in range(3):
            diagnostic = generate_diagnostic(results, gateDecision.blockingReasons)
            /act-review {chapter} with diagnostic
            results = parallel_validate(...)
            Bash("node dist/cli/apply-chapter-gate.js --project {projectPath} --chapter {chapter} --version {chapterVersion} --quality-score {validatorConsensusScore} --json")
            gateDecision = evaluateChapterGate(...)

            if gateDecision.status == "PASS":
                <promise>CHAPTER_{chapter}_DONE</promise>
                break

            if same_failure_3_times(diagnostic):
                # Circuit Breaker
                action = ask_user(["수동 수정", "구조/플롯 재설계", "스킵", "중단"])
                handle_circuit_breaker(action)
                break

        if gateDecision.status != "PASS":
            continue_or_pause_by_gate_state(gateDecision)
            break

    # 막 단위 검증 (--team 여부에 따라 분기)
    if --team:
        # revision-team이 기존 /act-review를 대체
        for chapter in act.chapters:
            revision-team-gate {chapter}
            # 실패 시: 경고 표시, 원고 보존, 집필 계속
    else:
        /act-review (막 전체)

    # 막 완료
    if failed_chapters is empty and last_gate.status == "PASS" and act chapters are all complete:
        <promise>ACT_{act}_DONE</promise>

if failed_chapters is empty and last_gate.status == "PASS" and all chapters are complete:
    <promise>NOVEL_DONE</promise>
```

## 상태 파일

`meta/ralph-state.json` (세션 복구 지원):
```json
{
  "ralph_active": true,
  "mode": "write-all",
  "project_id": "novel_20250117_143052",
  "current_act": 1,
  "current_chapter": 5,
  "total_chapters": 50,
  "total_acts": 3,
  "completed_chapters": [1, 2, 3, 4],
  "failed_chapters": [],
  "act_complete": false,
  "quality_score": 0,
  "last_quality_score": 96,
  "retry_count": 0,
  "iteration": 1,
  "max_iterations": 100,
  "can_resume": true,
  "last_checkpoint": "2026-01-21T10:30:00Z",
  "started_at": "2026-01-21T09:00:00Z",
  "quality_threshold": 95,
  "validators": ["critic", "beta-reader", "genre-validator"],
  "circuit_breaker": {
    "failure_count": 0,
    "failure_reasons": [],
    "triggered": false
  },
  "last_validation": {
    "critic": 96,
    "beta_reader": 96,
    "genre_validator": 96,
    "all_passed": true
  },
  "last_gate": {
    "chapter": 5,
    "status": "PASS",
    "passed": true,
    "should_retry": false,
    "strategy": "none",
    "score": 96,
    "blocking_reasons": [],
    "decided_at": "2026-01-21T10:32:00Z"
  }
}
```

### 체크포인트 시스템

- **자동 저장**: 회차 완료 시마다 체크포인트 저장
- **백업 유지**: 최근 3개 백업 자동 보관 (`meta/backups/`)
- **복구 지원**: 중단된 세션에서 이어서 집필 가능
- **반복 한도**: `max_iterations`에 도달하면 완료 처리하지 않고 `requires_user_intervention=true`, `can_resume=true` 상태로 일시정지

## 품질 게이트 로직 (v2 - Multi-Validator)

1. **평가 기준**: 3개 validator 모두 통과
   - critic >= 95점
   - beta-reader >= 95점 (engagement)
   - genre-validator >= 95점 (compliance)

2. **검증 프로세스**:
   ```
   /write {chapter}
       │
       v
   [Multi-Validator 병렬 실행]
       │
       ├─> critic (품질)
       ├─> beta-reader (몰입도)
       └─> genre-validator (장르)
       │
       v
   [Consensus 판정]
       │
       ├─ ALL PASS → 다음 회차 진행
       │
       └─ ANY FAIL → Diagnostic 생성
           │
           v
       [editor에게 수정 지시]
           │
           v
       [재검증] (최대 3회)
           │
           └─ 동일 실패 3회 → Circuit Breaker
   ```

3. **Circuit Breaker**:
   - 동일 이유로 3회 실패 시 자동 중단
   - 사용자에게 선택지 제공:
     - (A) 수동 수정 후 재시도
     - (B) 구조/플롯 재설계 후 재시도
     - (C) 해당 회차 스킵
     - (D) 집필 중단

4. **Diagnostic 출력**:
   - 실패 원인 분석 (root_cause)
   - 심각도 (critical/major/minor)
   - 구체적 수정 제안 (suggested_fix)
   - 예상 수정 노력 (quick/moderate/significant)

## Multi-Validator 호출 패턴

회차 집필 완료 후 다음을 수행:

```spec
// 1. 3개 validator 병렬 호출
const validationPromises = [
  Task({
    subagent_type: "novel-dev:critic",
    prompt: `Chapter ${chapter} 평가...`
  }),
  Task({
    subagent_type: "novel-dev:beta-reader",
    prompt: `Chapter ${chapter} 몰입도 분석...`
  }),
  Task({
    subagent_type: "novel-dev:genre-validator",
    prompt: `Chapter ${chapter} 장르 검증...`
  })
];

// 2. 병렬 실행 대기
const [criticResult, betaResult, genreResult] = await Promise.all(validationPromises);

// 3. Engagement Contract 평가 및 추세 기록
// Production path: node dist/cli/record-engagement.js --project {projectPath} --chapter {chapter} --version {chapterVersion} --json
const engagement = evaluateEngagementContract({
  design: "meta/design-strategy.json",
  plot: "plot/plot-strategy.json",
  chapter: "chapters/chapter_${chapter}.json",
  manuscript: "chapters/chapter_XXX.md"
});

const engagementRecord = recordEngagementEvaluation({
  projectDir: projectPath,
  projectId,
  chapterNumber: chapter,
  version: chapterVersion,
  evaluation: engagement
});

if (engagementRecord.regression.regressionDetected) {
  diagnostic.add("Engagement Trend", engagementRecord.regression.alertMessage);
}

if (engagement.revisionDirectives.length > 0) {
  diagnostic.add(
    "Engagement Revision Directives",
    engagement.revisionDirectives
      .slice(0, 5)
      .map(directive => `- [${directive.priority}] ${directive.target}: ${directive.action}`)
      .join("\n")
  );
}

if (engagement.recurringEngagementDirectives.length > 0) {
  diagnostic.add(
    "Repeated Engagement Directives",
    engagement.recurringEngagementDirectives
      .slice(0, 5)
      .map(directive => `- [${directive.priority}] ${directive.target}: ${directive.action} (${directive.count}x)`)
      .join("\n")
  );
}

// 4. 통합 게이트 판정 및 상태 반영
// Production path: node dist/cli/apply-chapter-gate.js --project {projectPath} --chapter {chapter} --version {chapterVersion} --quality-score {validatorConsensusScore} --json
const gateDecision = evaluateChapterGate({
  chapterNumber: chapter,
  attemptNumber: retryCount + 1,
  maxRetries: 3,
  lastScore: validatorConsensusScore([criticResult, betaResult, genreResult]),
  threshold: 95,
  engagement: {
    passed: engagement.passed,
    score: engagement.score,
    alertLevel: engagementRecord.regression.alertLevel,
    regressionDetected: engagementRecord.regression.regressionDetected,
    issues: engagement.issues
  },
  requireEngagement: true
});

await applyChapterGateDecision(projectPath, chapter, gateDecision);

if (gateDecision.status !== "PASS") {
  diagnostic.add("Chapter Gate", gateDecision.blockingReasons.join("; "));
}
```

### Using verify-chapter Command

**RECOMMENDED**: Use the new `/verify-chapter` command for streamlined parallel validation:

```bash
# After writing a chapter
/write 5

# Run parallel verification
/verify-chapter 5
```

The `/verify-chapter` command automatically:
- Launches all 3 validators in parallel
- Validates `reader_experience` against design/plot contracts via `evaluateEngagementContract`
- Applies confidence filtering (≥95)
- Enforces quality thresholds (critic ≥95, beta-reader ≥95, genre-validator ≥95)
- Persists engagement trend via `recordEngagementEvaluation` to `meta/quality-trend.json`
- Returns structured verdict with scores and high-confidence issues
- Saves results to `reviews/verifications/chapter_${N}_verification.json`

**Integration Pattern**:
```
for each chapter:
  /write {N}
  verification = /verify-chapter {N}
  gateDecision = evaluateChapterGate(verification + engagementRecord)
  applyChapterGateDecision(projectPath, N, gateDecision)

  if gateDecision.status == "PASS":
    <promise>CHAPTER_{N}_DONE</promise>
    continue

  if gateDecision.status == "RETRY":
    diagnostic = generate_diagnostic(verification.high_confidence_issues, gateDecision.blockingReasons)
    /act-review {N} with diagnostic
    verification = /verify-chapter {N}  # retry

    if still failing after 3 retries:
      # Circuit Breaker
      ask_user(action)

  if gateDecision.status == "USER_INTERVENTION":
    ask_user(gateDecision.retryPrompt)
    pause Ralph Loop
```

## Ralph Loop 특징

- **불굴의 의지**: 전체 완성까지 자동 진행
- **품질 보장**: 각 막마다 품질 게이트 통과 확인
- **중단 불가**: Promise 태그로 진행 상황 추적
- **사용자 확인**: 막 단위로 사용자 승인 대기
