---
name: verify-chapter
description: "This skill should be used when running parallel chapter verification with 3 validators and confidence filtering. Internal verification pipeline."
user-invocable: false
---

# verify-chapter

Run parallel validation on a chapter with 3 validators and confidence filtering.

## Triggers

- "챕터 검증", "chapter verify"
- "품질 검사", "quality check"
- 자동: 챕터 완료 후

## Protocol

### Step 1: Parallel Validation

3개 검증 에이전트를 병렬로 실행:

```javascript
await Promise.all([
  Task({ subagent_type: "novel-dev:chapter-verifier", model: "sonnet", prompt: chapterContext }),
  Task({ subagent_type: "novel-dev:beta-reader", model: "sonnet", prompt: chapterContext }),
  Task({ subagent_type: "novel-dev:genre-validator", model: "sonnet", prompt: chapterContext })
]);
```

### Step 2: Confidence Filtering

검증 결과에서 신뢰도 기반 필터링:

| 신뢰도 | 처리 |
|--------|------|
| ≥95% | 자동 반영 |
| 80-94% | 사용자 확인 후 반영 |
| <80% | 참고용 표시만 |

### Step 3: Unified Chapter Gate Persistence

3개 검증 결과를 confidence filtering으로 정리한 뒤, 승인된 validator consensus 점수를 하나의 `qualityScore`로 산출합니다. 그 다음 `chapters/chapter_XXX.json`의 `reader_experience`와 `chapters/chapter_XXX.md` 원고 본문 manuscript를 독자 약속 계약과 대조하고, 결과를 장기 추세와 Ralph Loop 상태에 함께 저장합니다.

**필수 실행 명령:**
```javascript
Bash("node dist/cli/apply-chapter-gate.js --project {projectPath} --chapter {N} --version {chapterVersion} --quality-score {qualityScore} --threshold {threshold} --json")
```

이 CLI는 내부적으로 `recordEngagementFromProject` → `evaluateChapterGate` → `applyChapterGateState` 순서로 실행합니다.

- Engagement trend 저장 위치: `meta/quality-trend.json`
- Ralph Loop gate 저장 위치: `meta/ralph-state.json`
- 독자 패널 캘리브레이션 입력: `reviews/reader-response-calibration.json`
- 인물/관계 투자도 입력: `reviews/character-relationship-benchmark-report.json`
- 장기 연재 유지력 입력: `reviews/series-retention-benchmark-report.json`
- 장편 일관성 입력: `reviews/consistency-report.json`
- 문체 취향 벤치마크 입력: `reviews/prose-taste-benchmark-report.json`
- `engagement.passed === false`이면 validator 점수가 높아도 종합 gate는 `RETRY`입니다.
- `engagementRecord.regression.alertLevel`이 `warning` 이상이면 gate 실패 사유와 **Engagement Trend** 경고에 포함합니다.
- `reviews/reader-response-calibration.json`이 있으면 `apply-chapter-gate`가 해당 chapter의 usable `sampleResults`를 읽습니다. 자동 점수와 독자 반응이 어긋난 `auto-false-positive`, `auto-overestimate`, 약한 `next-click`, 또는 baseline 대비 개정본이 퇴보한 `revisionOutcomeEvidence=regressed` 샘플이면 `readerResponse.passed === false`가 되고, validator 점수와 engagement/proseCraft가 모두 높아도 종합 gate는 `RETRY`입니다. 새 캘리브레이션 결과에서 `evidenceQuality`가 `none` 또는 `weak`이면 완료 차단 근거로 쓰지 않고 경고만 표시합니다. `evidenceQuality=usable`은 target reader, 시작 독자 수, 완독 수, 중도 이탈 수, 훑어읽기 수, 자유 코멘트, 장면 마찰 지점뿐 아니라 `friction_annotations`의 location, reason, affected dimension, rewrite_suggestion, reader_segment, 실제 이탈/훑어읽기 위치를 담은 `drop_off_annotations`, `scene_recall_annotations`, `tension_trace_annotations`, `narrative_forecast_annotations`, `line_quote_annotations`, `advocacy_annotations`, `durable_engagement_annotations`, `resonance_annotations`가 충분해야 합니다. 숫자 카운트만 있거나, `retentionEvidence`와 `dropOffLocalizationEvidence`가 `usable`이 아니거나, 낮게 나온 reader-response dimension을 같은 dimension의 actionable `friction_annotations`가 덮지 못하거나, actionable annotation이 한 독자군에 쏠리거나, 장면 회상/장면 긴장 추적/서사 예측/문장 인용성/추천/지속 참여/사후 잔향 근거가 약하면 threshold retuning 근거로 보지 않습니다. `missingRequiredGenres`, `underSampledUsableRequiredGenres`, `missingRequiredSeriesGenres`, `missingRequiredUsableSeriesGenres`, `underSampledRequiredChapterRanges`, `underSampledUsableRequiredChapterRanges`, `missingRequiredChapterRangeGenres`, `missingRequiredUsableChapterRangeGenres`가 남아 있으면 독자 패널 coverage가 부족한 것이므로 threshold retuning 근거로 보지 않습니다.
- `reviews/character-relationship-benchmark-report.json`이 있으면 `apply-chapter-gate`가 현재 chapter의 evidence-sufficient `sampleResults`를 읽습니다. `automated-false-positive`, `weak-reader-investment`, `weak-dimension`, 또는 known-flat 현재 회차 샘플이면 `readerResponse.passed === false`가 되고 종합 gate는 `RETRY`입니다. `insufficient-reader-evidence` 샘플은 완료 차단 대신 경고로만 남깁니다. 실패 시 `focus`와 `readerEvidence`의 comment, care/disbelief points, rewrite suggestion을 **Reader Response / Character Relationship Revision Directives**로 editor/revision-team 입력에 그대로 전달합니다.
- `reviews/series-retention-benchmark-report.json`이 있으면 `apply-chapter-gate`가 현재 chapter가 실패한 연속 샘플의 최신 회차인지 확인합니다. evidence-sufficient `automated-false-positive`, `weak-reader-retention`, `reader-retention-drop`, `reader-funnel-drop`, `repetitive-reward-pattern`은 `readerResponse.passed === false`가 되고 종합 gate는 `RETRY`입니다. `short-sequence`, `insufficient-reader-evidence`, `weak-funnel-evidence`는 완료 차단 대신 경고 또는 튜닝 근거 부족으로만 남깁니다. `reader-funnel-drop`은 started/completed/continued/drop-off/skimmed count로 남은 독자 평점만 높은 생존자 편향을 잡으며, 실패 시 **Reader Response / Series Retention Revision Directives**와 `series-retention-funnel` 지시가 editor/revision-team 입력에 전달됩니다.
- `reviews/consistency-report.json`이 있으면 `apply-chapter-gate`가 현재 chapter를 덮는지 확인합니다. `chapter_range`가 현재 회차를 포함하지 않거나, `chapters_analyzed`에 현재 회차가 없거나, character/timeline/setting/factual/plot_logic 5개 도메인 coverage가 빠지거나, 현재/이전 회차의 unresolved `critical`/`major`/`minor` consistency issue가 남아 있거나, report 작성 뒤 `chapters/`, `world/`, `characters/`, `plot/`, `context/summaries/` 소스가 바뀌었으면 `readerResponse.passed === false`로 병합되고 종합 gate는 `RETRY`입니다. 미래 회차에만 위치한 issue는 그 회차 gate까지 유예합니다. 실패 시 **Reader Response / Long-Form Consistency Revision Directives** 또는 **Evaluation Report Freshness Directives**를 editor/revision-team 입력에 그대로 전달합니다.
- `reviews/prose-taste-benchmark-report.json`이 있으면 `apply-chapter-gate`가 문체 벤치마크를 `proseCraft`에 병합합니다. `sampleResults.chapter`가 현재 회차인 비선호 문체 샘플, 현재 회차의 `false-positive`, `missing-issue`, 비선호 샘플의 `score-out-of-range`는 validator 점수와 engagement가 높아도 `proseCraft.passed === false`로 만들고 종합 gate를 `RETRY`로 돌립니다. `sampleResults.chapter`가 미래 회차에만 있으면 현재 회차에는 적용하지 않습니다. 실패 시 `style_friction_annotations`의 location, reason, issueCode, rewriteSuggestion을 **Prose Craft Revision Directives**로 전달합니다.
- `prose-taste-benchmark-report.json`의 `authorialStyleDriftStatus`가 `drifted`이거나 `weakAuthorialStyleDriftCount > 0`이면 98+ readiness에서는 문체 evidence gap입니다. 회차별 선호 문체 샘플을 추가하고 `run-prose-taste-benchmark`를 다시 실행해, 한 회차는 담백한 제한시점이고 다음 회차는 과밀 감각문/보고문/대사태그 리듬으로 바뀌는 authorial style drift를 해소해야 합니다.
- `prose-taste`, `reader-response`, `character-relationship`, `series-retention`, `consistency-report` report가 현재 chapter gate에 쓰일 때 `sourceEvidence`가 현재 입력 digest와 맞지 않으면 `stale-report:*` 실패로 처리합니다. `consistency-report`는 sourceEvidence가 없더라도 report 작성 뒤 canonical source가 더 최신이면 stale로 봅니다. 이 경우 validator 점수나 독자 점수가 높아도 종합 gate는 `RETRY`이며, **Evaluation Report Freshness Directives**에 따라 해당 benchmark/calibration/consistency report를 현재 소스에서 재생성한 뒤 다시 검증합니다.
- `reader_promise_contract`가 구체적 독자 약속이 아니고 일반어(흥미로운 사건, 매력적인 주인공, 재미와 감동, 다음 화가 궁금함) 중심이면 `reader-promise-generic`을 critical로 표시합니다. 각 필드가 구체적이어도 `core_hook`, `novelty_angle`, `irresistible_question`, `binge_reason`, `long_series_engine`, `first_five_chapter_retention_plan`이 같은 전제 앵커를 공유하지 못하면 `reader-promise-premise-not-integrated`를 critical로 표시합니다. 설계에는 고유 장치, 기억 가능한 단서, 주인공 선택/비용, 감정 보상 trigger가 있어야 합니다.
- foundational engagement gates는 구조 결손을 먼저 잡습니다. `per_chapter_guide`가 없으면 `missing-chapter-guide`, 회차 `promise_fulfillment`가 `core_hook`을 잃으면 `missing-core-hook`, scene evidence가 없으면 `missing-scene-evidence`, concrete pressure가 있는 장면 갈등이 75% 미만이면 `weak-scene-conflict`, `cliffhanger_strength`가 7 미만이면 `weak-cliffhanger`, high-tension peak 대비 `cliffhanger_strength`가 약하면 `weak-peak-cliffhanger`를 표시합니다.
- core reader_experience drift는 `fun_spec`과 회차 `reader_experience`의 핵심 약속이 끊기는지 확인합니다. `reader_reward`/`chapter_reward`가 설계 보상과 어긋나면 `reader-reward-drift`, `page_turn_question`/`page_turner_question`이 중심 질문과 어긋나면 `page-turner-question-drift`, `character_appeal_moment`가 주인공 매력과 어긋나면 `character-appeal-drift`, `must_click_ending`이 연속 클릭 이유와 어긋나면 `must-click-ending-drift`, `drop_off_risk`가 이탈 위험 대응과 어긋나면 `drop-off-risk-drift`를 critical로 표시합니다.
- core scene staging은 핵심 약속이 장면에 실제로 들어갔는지 확인합니다. final scene이 `must_click_ending`을 stage하지 못하면 `must-click-ending-not-staged`, scene beat가 `chapter_reward`를 보상 사건으로 stage하지 못하면 `chapter-reward-not-staged`, `drop_off_risk` 완화 전략이 scene evidence에 보이지 않으면 `drop-off-risk-not-mitigated`, `tension_curve` peak event가 scene purpose/beat에 보이지 않으면 `tension-peak-not-staged`를 critical로 표시합니다.
- manuscript tension peak는 `tension_curve`의 high-tension peak event가 원고에서 압박/행동/결과 전환으로 장면화됐는지 확인합니다. peak를 요약만 하고 같은 1~3문장 안에 구체 위험 또는 장애물, 주인공 행동/강제 선택, 되돌릴 수 없는 결과/폭로/새 질문이 없으면 `manuscript-tension-peak-not-evidenced`를 critical로 표시합니다.
- manuscript tension wave / 원고 긴장 파형은 high-tension 회차의 초반 압박과 열린 질문, 중반 악화와 선택지 축소, 말미 고점과 열린 질문이 원고 순서로 분산됐는지 확인합니다. 긴장 요소가 말미에만 몰리면 `manuscript-tension-wave-not-evidenced`를 critical로 표시합니다.
- 1~5화에서 `first_five_chapter_retention_plan`의 해당 초반 5화 유지 비트가 scene evidence에 없으면 `retention-plan-drift`를 critical로 표시합니다.
- `irresistible_question` 중심 질문이 `page_turn_question`과 페이지터너 질문으로 이어지지 않으면 `irresistible-question-drift`를 critical로 표시합니다.
- `page_turn_question`과 `reader_experience.page_turner_question`이 답을 설명하지 않는 open-loop 미해결 질문이 아니고 설명/해결/정답 공개로 닫히면 `page-turn-question-closed`를 critical로 표시합니다.
- `page_turn_question`과 `reader_experience.page_turner_question`이 좁혀진 정보 공백이 아니고 "앱과 사건은 왜 연결되는가?"처럼 넓은 명사만 남기면 `page-turn-question-too-broad`를 critical로 표시합니다. 로고+사건 번호, 이름+좌표, 다음 수신자+사진, 규칙+대가 같은 구체 앵커를 최소 두 개 결합해야 합니다.
- 마지막 scene beat/final scene이 `reader_experience.page_turner_question`을 낳는 구체 단서/폭로/위협/사물/사건을 stage하지 못하고 질문이 메타데이터에만 있으면 `page-turn-question-not-staged`를 critical로 표시합니다.
- `binge_reason`이 `must_click_ending`과 마지막 scene evidence의 회차 말미 연속 클릭 이유로 보이지 않으면 `binge-reason-not-staged`를 critical로 표시합니다.
- `protagonist_appeal`이 `character_appeal_moment`와 scene evidence의 주인공 매력 선택/행동/비용으로 이어지지 않으면 `protagonist-appeal-drift`를 critical로 표시합니다.
- 주인공 `inner.want`(욕망)와 `inner.need`(결핍)가 context, `character_development`, `character_appeal_moment`, scene conflict/beat의 선택/대가/도움 요청/포기/달라진 행동으로 stage되지 않으면 `character-drive-not-staged`를 critical로 표시합니다.
- character drive carryover / 내적 변화 이월은 직전 내적 변화가 다음 회차 행동으로 남는지 확인합니다. 직전 내적 변화가 도움 요청, 습관 내려놓기, 통제권 나누기, 달라진 행동으로 previous_summary/current_plot/reader_experience/opening scene에 보이지 않으면 `character-drive-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-character-drive-carryover-not-evidenced`를 critical로 표시합니다.
- antagonist/villain/opponent/rival 또는 반대세력 캐릭터의 `inner.want`나 `inner.fatal_flaw`가 이름/별칭이 있는 antagonist strategy로 stage되지 않고, 목표, 함정, 조작, 표적화, countermove가 context/reader_experience/scene conflict/beat에 없으면 `antagonist-strategy-not-staged`를 critical로 표시합니다.
- antagonist countermove carryover / 반대세력 대응 이월은 전 회차 주인공 행동이 반대세력 계획을 흔든 뒤 다음 회차에 반격, 전술 변경, 표적 재설정, 증거 삭제, 접근 권한 회수로 돌아오는지 확인합니다. 전 회차 주인공 행동이 previous_summary/current_plot/reader_experience/opening scene에 반대세력의 현재 대응으로 보이지 않으면 `antagonist-countermove-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-antagonist-countermove-carryover-not-evidenced`를 critical로 표시합니다.
- `novelty_angle`이 `promise_fulfillment`, `chapter_reward`, scene evidence의 신선한 차별점으로 보이지 않으면 `novelty-angle-drift`를 critical로 표시합니다.
- `emotional_payoff`가 `promise_fulfillment`, `chapter_reward`, scene evidence의 감정 보상으로 보이지 않으면 `emotional-payoff-drift`를 critical로 표시합니다.
- `long_series_engine`이 `long_hook_threads`, `promise_fulfillment`, scene evidence의 장기 미스터리 엔진으로 보이지 않으면 `long-series-engine-drift`를 critical로 표시합니다.
- `long_hook_threads` 중 최소 하나가 scene evidence의 장기 훅으로 보이지 않으면 `long-hook-thread-not-staged`를 critical로 표시합니다.
- scene evidence의 장기 훅이 새 단서, 좁혀진 가설, 위험/대가 변화, 다음 검증 행동으로 전진하지 않고 이름만 반복되면 `long-hook-thread-not-advanced`를 critical로 표시합니다.
- `payoff_cadence`가 `chapter_reward`와 `must_click_ending`의 보상 주기로 보이지 않으면 `payoff-cadence-drift`를 critical로 표시합니다.
- `fatigue_controls`가 promise_fulfillment, drop_off_risk, scene evidence에서 피로도 방지 장치로 보이지 않으면 `fatigue-control-not-staged`를 critical로 표시합니다. 관계 압박, 장소 변주, 행동 방식 변주, 감정 리셋 없이 조사/대화/전투 반복을 그대로 두면 실패입니다.
- `tension_reset_plan`이 promise_fulfillment, drop_off_risk, scene evidence에서 고강도 사건 뒤 호흡/완급/정적/추리 호흡을 낮추고 새 질문, 새 알림, 새 위협으로 긴장을 재점화하는 리듬으로 보이지 않으면 `tension-reset-not-staged`를 critical로 표시합니다.
- serial escalation variety는 회차 간 반복 보상, 조사, 알림, 현장 실패 패턴을 그대로 재사용하지 않는지 확인합니다. 이전 1~2회차와 같은 보상/조사/알림/장소 구조를 쓰면 새 갈등 축(관계 파열, 반대세력 countermove, 장소/행동 방식 변주, 규칙 변화, 대가 상승, 되돌릴 수 없는 판도 변화)을 scene evidence와 manuscript에 stage해야 하며, 누락 시 `serial-escalation-variety-not-staged`, 원고 본문에서 누락 시 `manuscript-serial-escalation-variety-not-evidenced`를 critical로 표시합니다.
- serial reward pattern variation은 회차 간 보상 전달 방식 자체가 반복되지 않는지 확인합니다. 새 갈등 축이 있어도 `chapter_reward`나 원고 보상 순간이 전 회차와 같은 로그-기록 대조/알림-규칙 증명을 이름만 바꿔 반복하면 `serial-reward-pattern-repetition-not-staged`, `manuscript-serial-reward-pattern-repetition-not-evidenced`를 critical로 표시합니다. 보상은 관계 배신, 반대세력 countermove, 행동 방식 반전, 대가 상승, 규칙 변이, 구체 사물 폭로 등 새 reward mode로 도착해야 합니다.
- cliffhanger carryover는 직전 회차의 prior must_click_ending을 다음 회차 current_plot, reader_experience, opening scene, 원고 초반에서 즉시 이어받는지 확인합니다. previous_summary에만 있고 현재 장면으로 실행되지 않거나 직전 말미 단서/위협/질문을 버리고 새 줄거리로 건너뛰는 미끼식 클리프행어는 `cliffhanger-carryover-not-staged`, planning에는 있지만 opening scene / first staged turn을 지나서야 처리하면 `cliffhanger-carryover-delayed`, 원고 초반에서 누락되면 `manuscript-cliffhanger-carryover-not-evidenced`, 첫 두 문장을 지나서야 처리하면 `manuscript-cliffhanger-carryover-delayed`를 critical로 표시합니다.
- scene choice-cost tradeoff는 핵심 scene conflict/beat에 경쟁 선택지, 포기되는 대안, 선택-대가 비용이 함께 stage되는지 확인합니다. 단순 조사/발견/추격만 있고 선택 딜레마가 없으면 `scene-choice-tradeoff-not-staged`, 원고에서 누락되면 `manuscript-choice-tradeoff-not-evidenced`를 critical로 표시합니다.
- choice-cost lock / 선택-대가 잠금은 주인공 선택의 대가가 선택지/관계/증거/시간/경로 중 하나를 되돌릴 수 없는 상태로 닫는지 확인합니다. scene conflict/beat에서 선택 후 닫힘, 차단, 사라짐, 노출, 확정이 없으면 `scene-choice-cost-lock-not-staged`, 원고 본문 manuscript에서 빠지면 `manuscript-choice-cost-lock-not-evidenced`를 critical로 표시합니다.
- choice-cost lock carryover / 선택-대가 잠금 이월은 전 회차의 잠긴 선택지가 다음 회차 압박으로 이어지는지 확인합니다. 전 회차 `context.next_plot` 또는 마지막 scene에서 닫힌 선택지/관계/증거/시간/경로가 다음 회차 previous_summary/current_plot/reader_experience/opening scene에 현재 제약으로 보이지 않으면 `choice-cost-lock-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-choice-cost-lock-carryover-not-evidenced`를 critical로 표시합니다.
- revelation consequence carryover / 폭로 결과 이월은 전 회차 폭로가 다음 회차의 계획 변경, 새 압박, 용의자 지도, 관계 판단, 다음 질문으로 이어지는지 확인합니다. 전 회차 `chapter_reward`, `must_click_ending`, `context.next_plot`의 폭로가 다음 회차 previous_summary/current_plot/reader_experience/opening scene에 현재 행동 변화로 보이지 않으면 `revelation-consequence-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-revelation-consequence-carryover-not-evidenced`를 critical로 표시합니다.
- mystery hypothesis carryover / 추리 가설 이월은 직전 단서가 다음 회차의 가설 수정, 용의자 순위 재정렬, 용의자 제외/승격, 다음 검증 행동으로 이어지는지 확인합니다. 직전 단서가 previous_summary/current_plot/reader_experience/opening scene에 추론 상태 변화로 보이지 않으면 `mystery-hypothesis-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-mystery-hypothesis-carryover-not-evidenced`를 critical로 표시합니다.
- scene causal escalation은 장면 간 인과가 이어지는지 확인합니다. 이전 scene 결과가 `직후`, `그 결과`, `이어` 같은 인과 연결로 다음 scene 압박, 행동, 결과를 밀지 못하면 `scene-causal-escalation-not-staged`를 critical로 표시합니다.
- scene goal-tactic turn / 장면 목표-전술 전환은 핵심 scene conflict/beat가 주인공의 구체 목표, 그 목표를 막는 힘, 보이는 전술 또는 전술 전환, 바뀐 결과를 함께 갖는지 확인합니다. 압박과 결과는 있지만 주인공이 무엇을 원해 어떤 방법으로 밀거나 바꾸는지 없으면 `scene-goal-tactic-turn-not-staged`를 critical로 표시합니다.
- spatial blocking은 액션/위기 원고의 공간 블로킹이 실행됐는지 확인합니다. 장소 기준점, 동선, 차단물, 거리 압박이 같은 장면 흐름에 없으면 `manuscript-spatial-blocking-not-evidenced`를 critical로 표시합니다.
- ending hook reaction은 마지막 scene evidence의 `must_click_ending`에 주인공의 몸감각, 물리적 행동, 즉각 위험 반응이 붙는지 확인합니다. scene metadata에서 빠지면 `ending-hook-reaction-not-staged`, 원고에서 빠지면 `manuscript-ending-hook-reaction-not-evidenced`를 critical로 표시합니다.
- `character_development`가 관계 변화(신뢰, 불신, 화해, 배신, 고백, 사과, 약점 공개)를 선언했는데 scene evidence에 상호 반응이 없으면 `relationship-shift-not-staged`를 critical로 표시합니다.
- relationship turning point / 관계 전환점은 약점 공개·비밀·사과·거절 같은 취약성/관계 위험, 상대의 선택/반응, 신뢰/불신/거리 변화, 즉시 달라진 행동 결과가 같은 scene window에 묶였는지 확인합니다. 얇은 사과/대답/관계 회복 요약이면 `relationship-turning-point-not-staged`를 critical로 표시합니다.
- relationship mind inference / 관계 마음 추론은 관계 전환점 안에서 숨김, 오해, 진심, 망설임, 바뀐 속내가 시선, 침묵, 회피, 대화, POV 해석으로 읽히는지 확인합니다. 관계 결과만 있고 마음 추론 단서가 없으면 `relationship-mind-inference-not-staged`를 critical로 표시합니다.
- relationship mutual pressure / 관계 상호 압박은 관계 전환점 안에서 상대가 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험 중 하나를 걸고 협상에 들어오는지 확인합니다. 상대가 그저 돕거나 용서만 하면 `relationship-mutual-pressure-not-staged`를 critical로 표시합니다.
- `characters/relationships.json`의 `evolution`에 해당 chapter의 관계 변화 기록이 없으면 `relationship-evolution-not-recorded`를 critical로 표시합니다. 장면/원고에서 생긴 신뢰, 불신, 화해, 배신, 동행 변화는 다음 회차가 이어받을 장기 상태여야 합니다.
- relationship evolution carryover / 관계 장기 상태 이월은 전 회차 관계 변화가 다음 회차 대화, 행동, 불신/신뢰, 거리, 동행 압박으로 이어지는지 확인합니다. 이전 `evolution.change`가 현재 회차 previous_summary/current_plot/reader_experience/opening scene에 현재 관계 상태로 보이지 않으면 `relationship-evolution-carryover-not-staged`, 원고 초반에서 빠지면 `manuscript-relationship-evolution-carryover-not-evidenced`를 critical로 표시합니다.
- 복선 장부 `foreshadowing_schedule`에 없는 ID가 `foreshadowing_plant` 또는 `foreshadowing_payoff`에 있으면 `foreshadowing-ledger-missing`을 critical로 표시합니다. `foreshadowing_payoff`가 예정된 `payoff_chapter`와 다른 회차에서 선언되면 `foreshadowing-payoff-timing-mismatch`를 critical로 표시합니다.
- foreshadowing plant concreteness / 복선 단서 구체화는 선언한 `foreshadowing_plant`가 실제 scene과 원고 본문 manuscript의 로고, 번호, 표식, 파일, 상처, 목소리, 사물, 감각 디테일 같은 물증으로 심겼는지 확인합니다. 복선을 "나중에 밝혀질 단서"처럼 추상 선언만 하면 `foreshadowing-plant-not-staged`, 원고 본문에서 빠지면 `manuscript-foreshadowing-plant-not-evidenced`를 critical로 표시합니다.
- foreshadowing payoff resolution / 복선 회수 장면화는 선언한 `foreshadowing_payoff`가 단서를 다시 보여주는 데서 끝나지 않고, 그 단서의 의미를 밝히고 원인/배후/숨은 연결을 드러낸 뒤 결과적으로 주인공의 행동, 위험, 관계, 다음 목표를 바꾸는지 확인합니다. 의미와 결과 없는 반복 단서면 `foreshadowing-payoff-not-staged`, 원고 본문에서 빠지면 `manuscript-foreshadowing-payoff-not-evidenced`를 critical로 표시합니다.
- 훅 장부 `plot/hooks.json`의 `mystery_hooks`에 없는 ID가 `hooks_plant` 또는 `hooks_reveal`에 있으면 `hook-ledger-missing`을 critical로 표시합니다. `hooks_reveal`이 예정된 `reveal_chapter`와 다른 회차에서 선언되면 `hook-reveal-timing-mismatch`를 critical로 표시합니다.
- `plot/plot-strategy.json`의 회차별 `arc_beats`가 큰 줄거리의 메인/서브 아크를 context.current_plot, reader_experience, scene conflict/beat에서 전진시키지 못하면 `arc-beat-not-staged`를 critical로 표시합니다. 원고 본문 manuscript에서 구체 발견, 결정, 반전, 손실, 되돌릴 수 없는 상태 변화로 실행되지 않으면 `manuscript-arc-beat-not-evidenced`를 critical로 표시합니다. 큰 줄거리 변화 없는 필러 회차는 승인하지 않습니다.
- `character_appeal_moment`의 주인공 매력이 scene evidence에서 선택/행동/비용으로 보이지 않으면 `character-appeal-not-staged`를 critical로 표시합니다. character appeal signature / 주인공 매력 시그니처 행동은 고유 방식/특성, 주체적 행동, 비용 또는 취약성, visible story/social reaction을 같은 scene conflict/beat 안에 결합해야 하며, 얇은 매력 선언이면 `character-appeal-signature-not-staged`를 critical로 표시합니다.
- 일반어 fun_spec 또는 "흥미로운 사건", "강한 반전", "다음 화가 궁금해지는 질문", "주인공이 매력을 보여준다" 같은 추상 재미 사양이면 `fun-spec-generic`을 critical로 표시합니다. 구체적 fun_spec은 고유 장치/단서, 주인공 선택/비용, 결과/악화, must-click hook 증거를 포함해야 합니다.
- 추상 scene evidence 또는 "흥미로운 사건이 있다", "주인공 매력을 설명한다", "위기와 반전을 제시한다" 같은 메타 설명이면 `scene-evidence-generic`을 critical로 표시합니다. `scene.conflict`/`scene.beat`는 구체적 장면 실행으로 행동/장애물/결과, 사물/단서, 상황 변화를 포함해야 합니다.
- `scene.beat`가 정적인 확인/대조/메모/계획에 머물고 새 사건, 폭로, 위협, 대가, 손실, 회복 불가 변화 같은 결과/악화를 만들지 않으면 `weak-scene-turn`을 표시합니다.
- scene state delta / 장면 상태 변화는 `scene.conflict`와 `scene.beat`의 before/after story-state delta를 확인합니다. 확인, 발견, 연결 같은 사건 단어가 있어도 장면 뒤 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나가 명확히 바뀌지 않으면 `scene-state-delta-not-staged`를 critical로 표시합니다.
- signature scene image는 회차마다 기억 가능한 시그니처 장면 이미지가 있는지 확인합니다. 최소 한 핵심 보상/반전/말미 훅 장면이 사물/공간/몸동작, 시각 디테일, 이야기 전환, story-impact lift를 같은 1~2문장 안에 결합하지 않으면 `signature-scene-image-not-staged`, `manuscript-signature-scene-image-not-evidenced`를 critical로 표시합니다. story-impact lift는 선택 비용, 규칙 변화, 단서 재해석, 관계/정체성 변화, 되돌릴 수 없는 결과 중 하나로 장면 이후의 판단이나 상태를 바꾸는지 확인합니다.
- motif resonance seed / 잔향 모티프 씨앗은 `narrative_elements.resonance_seed`가 선언된 회차에서 확인합니다. scene conflict/beat 또는 원고 1~2문장 안에 씨앗 앵커, 시각 이미지, 감정 잔향, 의미 변화, 이야기 결과가 함께 묶이지 않으면 `motif-resonance-not-staged` 또는 `manuscript-motif-resonance-not-evidenced`를 critical로 표시합니다. 테마 설명이 아니라 독자가 떠올릴 반복 이미지가 선택 비용, 관계 변화, 규칙 변화, 단서 재해석, 되돌릴 수 없는 결과를 만들어야 합니다.
- scene novelty matrix / 장면 신선도 매트릭스는 기능적 장면이 대작급 장면 아이디어로 조합되었는지 확인합니다. 핵심 scene conflict/beat가 `reward_mode`, `conflict_mode`, `setting_mode`, `opposition_mode` 중 최소 3축을 결합하지 못하거나, `setting_mode`가 장소명만 있고 장소 제약/동선/차단물/거리 압박/잠긴 접근/우회/침투/탈출 같은 공간 affordance로 작동하지 않으면 `scene-novelty-matrix-not-staged`를 critical로 표시합니다. 설계된 축들이 원고의 같은 장면 창에서 보상 전달 방식, 갈등/전술, 공간 제약, 반대세력 대응으로 실행되지 않고 사건 정보 설명으로 납작해지면 `manuscript-scene-novelty-matrix-not-evidenced`를 critical로 표시합니다.
- 1화 `chapters/chapter_XXX.md` 원고 본문 manuscript의 첫 문단이 `core_hook` 또는 `novelty_angle`을 즉시 보여주지 않으면 `opening-hook-not-evidenced`를 critical로 표시합니다.
- 1화 첫 문단 안에 훅이 있어도 첫 문장/첫 비트가 평범한 일상, 날씨, 분위기로 먼저 열리고 `core_hook` 또는 `novelty_angle`을 늦게 보여주면 `opening-hook-delayed`를 critical로 표시합니다.
- 1화 첫 문장에 `core_hook` 또는 `novelty_angle`이 있어도 첫 1~2문장 안에 주인공의 행동/선택 압박, 감각 또는 POV 앵커, 미해결 위험/질문이 함께 없으면 `opening-hook-not-embodied`를 critical로 표시합니다. 전제 이름표가 아니라 독자가 첫 화면에서 인물 행동과 닫히는 선택지를 보게 해야 합니다.
- 2화 이후 `chapters/chapter_XXX.md` 원고 본문 manuscript의 오프닝이 지난 사건 정리, 이전 회차 요약, 차분한 회상으로 시작하고 즉각적인 행동, 위협, 질문, 감각 반응이 없으면 `manuscript-opening-momentum-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `reader_promise_contract.irresistible_question`과 `reader_experience.page_turner_question`의 중심 질문을 왜/어떻게/누가 같은 미해결 질문으로 장면 안에 열어 두지 않으면 `manuscript-irresistible-question-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `drop_off_risk`의 이탈 방지 전략을 순서와 행동으로 실행하지 않으면 `manuscript-drop-off-mitigation-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에 `chapter_reward`가 실제 사건/발견/결과로 보이지 않으면 `manuscript-reward-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에 `chapter_reward`가 있더라도 주인공의 단서 처리와 추론/선택 없이 자동 파일, 안내문, 보고서, 타인의 설명 같은 수동 설명으로 도착하면 earned reward/벌어낸 보상이 아니므로 `manuscript-earned-reward-not-evidenced`를 critical로 표시합니다.
- reward freshness/보상 신선도는 벌어낸 보상이 단순 기록 일치나 단서 확인으로 멈추지 않는지 검증합니다. `chapter_reward`가 고유 장치, 규칙 변화, 장르 보상 체감, 다음 행동 압박을 함께 만들지 않으면 `manuscript-reward-freshness-not-evidenced`를 critical로 표시합니다.
- payoff delight / 보상 쾌감은 벌어낸 보상을 독자가 기억할 고점으로 터뜨리는지 검증합니다. `chapter_reward`가 신선하더라도 압박 축적, 벌어낸 단서 해소, 의미 변화 또는 반전, 몸 반응, 즉시 새 결과나 질문이 같은 보상 순간에 결합되지 않으면 `manuscript-payoff-delight-not-evidenced`를 critical로 표시합니다.
- genre-specific delight / 장르 쾌감은 `emotional_payoff`가 약속한 장르 보상이 실제 원고 장면 문법으로 터지는지 검증합니다. 미스터리는 단서 결합, 주인공 추론/행동, 더 날카로운 미해결 의문을 요구하고, 로맨스는 거리 변화 또는 접촉, 취약한 대화, 관계 선택/비용, 몸의 설렘을 요구합니다. 액션은 추격 동선, 공간 제약, 전술 반전, 신체 결과를 요구하고, 스릴러는 조여드는 위협, 덫 확대, 거짓 반전, 강제 선택, 몸의 공포를 요구하며, 현대판타지는 시스템 피드백, 스킬 활용, 대가/한계, 현실 결과나 등급 변화를 요구합니다. 판타지/성장물은 마법 규칙 발현, 대가/한계, 경이 이미지, 능력 변화나 결과를 요구합니다. 감정명과 몸반응만 있고 장르별 독자 쾌감 장치가 없으면 `manuscript-genre-delight-not-evidenced`를 critical로 표시합니다.
- question ladder/질문 사다리는 벌어낸 보상 뒤의 답, 폭로, 규칙 증명이 다음 질문을 여는지 검증합니다. 답 직후가 모든 의문 해결/설명 완료/안도처럼 닫히고 새 미해결 왜/어떻게/누가/다음 표적/남은 대가를 만들지 않으면 `manuscript-question-ladder-not-evidenced`를 critical로 표시합니다.
- forecast revision / 서사 예측 수정은 반전, 예상 뒤집힘, 오판, 가설 수정, 재해석이 실제 독해 변화를 만드는지 검증합니다. 회차가 반전을 약속하거나 원고가 예상을 세우면 독자/주인공의 예상, 그 예상을 깨는 구체 단서나 사건, 바뀐 가설/용의자 순위/단서 의미/계획/다음 검증 행동이 모두 있어야 하며, 놀람만 있고 해석이 바뀌지 않으면 `manuscript-forecast-revision-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript의 마지막 구간에 `must_click_ending`이 보이지 않으면 `manuscript-ending-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `must_click_ending`을 중간에 언급만 하고 마지막 구간의 새 사건, 폭로, 위협, 미해결 질문으로 장면화하지 않으면 `manuscript-ending-hook-not-staged`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `must_click_ending`을 마지막 구간에 배치하더라도 같은 회차 말미에서 해결, 종결, 범인 확정, 설명 완료, 안도 같은 폐쇄 신호로 열린 루프를 닫으면 `manuscript-ending-hook-closed`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript의 마지막 열린 질문이 "이 사건의 진실은 무엇인가?"처럼 넓고 로고+사건 번호, 다음 수신자+사진, 이름+좌표, 규칙+대가 같은 구체 앵커를 최소 두 개 보존하지 못하면 `manuscript-ending-hook-question-too-broad`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `must_click_ending` 말미 훅을 사건 정보로만 끝내고 주인공의 몸감각, 물리적 행동, 즉각 위험 반응을 붙이지 않으면 `manuscript-ending-hook-reaction-not-evidenced`를 critical로 표시합니다.
- ending hook setup / 말미 훅 준비 단서는 마지막 훅의 좌표, 사진, 명명 장소, 신원, 특수 물건 앵커가 불공정한 새 정보로 튀어나오지 않는지 검증합니다. 앞선 장면의 발견/확인/기록/흔적 없이 마지막 구간에서만 새 좌표나 사진을 던지면 `manuscript-ending-hook-setup-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript의 말미 반전은 fair twist여야 합니다. 앞선 장면에 번호, 파일, 로그, 로고, 목소리, 녹음, 서명, 배지 같은 반전 준비 단서가 없는데 마지막 구간에서만 정체/배후/범인을 새로 밝히면 `manuscript-fair-twist-setup-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에 `character_appeal_moment`의 주인공 매력 선택/행동/비용이 보이지 않으면 `manuscript-appeal-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `narrative_elements.character_development`의 인물 변화를 선택, 인정, 사과, 공개, 대가, 관계 행동, 달라진 행동으로 실제 장면에 실행하지 않으면 `manuscript-character-development-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 주인공 `inner.want` 욕망 또는 `inner.need` 결핍을 장면 동기로 실행하지 않고, 그 욕망/결핍이 선택, 대가, 도움 요청, 포기, 달라진 행동을 압박하지 않으면 `manuscript-character-drive-not-evidenced`를 critical로 표시합니다.
- character drive carryover / 내적 변화 이월은 직전 내적 변화가 원고 초반의 실제 행동을 바꿔야 하는 규칙입니다. 직전 내적 변화 때문에 주인공이 도움 요청, 습관 내려놓기, 통제권 나누기, 달라진 행동을 하지 않고 단독 행동으로 리셋되면 `character-drive-carryover-not-staged` 또는 `manuscript-character-drive-carryover-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 관계 변화가 있는 `narrative_elements.character_development`를 선언문으로만 말하고, 한 인물의 공개/사과/거절 뒤 상대의 침묵, 반박, 수락, 보호, 동행, 배신, 행동 변화와 신뢰/불신/거리 변화를 보여주지 않으면 `manuscript-relationship-shift-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript의 관계 전환점이 상호 반응은 있지만 취약성/관계 위험, 상대의 선택/반응, 신뢰/불신/거리 변화, 즉시 달라진 행동 결과를 같은 1-2문장 안에 묶지 못하면 `manuscript-relationship-turning-point-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript의 관계 전환점이 행동 결과만 있고 숨김, 오해, 진심, 망설임, 바뀐 속내를 시선, 침묵, 회피, 대화, POV 해석으로 읽게 하지 못하면 `manuscript-relationship-mind-inference-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript의 관계 전환점에서 상대가 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험 없이 단순히 도와주거나 용서만 하면 `manuscript-relationship-mutual-pressure-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `character_appeal_moment` 키워드는 맞추지만 고유 방식/특성, 주체적 행동, 비용 또는 취약성, visible story/social reaction을 같은 1~2문장에 결합하지 못하면 `manuscript-character-appeal-signature-not-evidenced`를 critical로 표시합니다.
- relationship evolution carryover / 관계 장기 상태 이월은 전 회차 관계 변화가 다음 회차 대화와 초반 행동에 남아야 하는 규칙입니다. 불신/신뢰, 거리, 동행, 침묵, 반박, 보호 같은 변화가 원고 초반에 보이지 않으면 `relationship-evolution-carryover-not-staged` 또는 `manuscript-relationship-evolution-carryover-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `characters/*.json` 또는 `characters/index.json`에 실명/별칭이 있는 캐릭터를 `주인공`, `조력자`, `남주`, `여주` 같은 설계 라벨로 반복하면 `manuscript-generic-character-label-not-evidenced`를 critical로 표시합니다. 최종 원고는 캐릭터 실명 또는 별칭을 사용해야 합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `지적 쾌감`, `보상 주기`, `장기 미스터리`, `독자 보상`, `클리프행어` 같은 설계어/평가어를 지문에 직접 쓰면 `manuscript-design-jargon-not-evidenced`를 critical로 표시합니다. 설계어는 구체 단서, 행동, 몸감각, 대화 서브텍스트로 장면화해야 합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에서 주인공 능동성이 보이지 않고 주인공이 직접 결정하고 대가를 감수하는 선택/행동/비용이 없으면 `manuscript-protagonist-agency-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에서 주인공 행동이 경쟁 선택지와 포기되는 대안이 보이는 선택-대가 딜레마 없이 단순 결정/위험 감수로만 처리되면 `manuscript-choice-tradeoff-not-evidenced`를 critical로 표시합니다.
- choice cost carryover는 선택 비용 여파가 다음 압박으로 이어지는지 확인하는 규칙입니다. `chapters/chapter_XXX.md` 원고 본문 manuscript에서 주인공이 포기한 대안, 신고 기록, 알리바이, 증거, 시간, 관계 같은 비용을 치른 뒤 그 비용이 선택지 축소, 길 차단, 의심 증가, 증거 상실, 시간 단축으로 돌아오지 않으면 `manuscript-choice-cost-carryover-not-evidenced`를 critical로 표시합니다.
- choice-cost lock / 선택-대가 잠금은 선택 비용이 단순 압박으로 끝나지 않고 선택지/관계/증거/시간/경로 중 하나를 되돌릴 수 없는 상태로 닫는지 확인하는 규칙입니다. 원고에서 선택 직후 닫힘, 차단, 사라짐, 노출, 확정이 보이지 않으면 `scene-choice-cost-lock-not-staged` 또는 `manuscript-choice-cost-lock-not-evidenced`를 critical로 표시합니다.
- choice-cost lock carryover / 선택-대가 잠금 이월은 전 회차에서 잠긴 선택지, 관계, 증거, 시간, 경로가 다음 회차 압박으로 원고 초반에 돌아오는지 확인하는 규칙입니다. 그 잠긴 선택지가 현재 행동을 좁히거나 의심, 감시, 경로 차단, 신뢰 붕괴를 만들지 않으면 `choice-cost-lock-carryover-not-staged` 또는 `manuscript-choice-cost-lock-carryover-not-evidenced`를 critical로 표시합니다.
- revelation consequence carryover / 폭로 결과 이월은 전 회차 폭로가 원고 초반에서 계획 변경, 새 압박, 용의자 판단, 관계 불신, 다음 질문으로 행동을 바꾸는지 확인합니다. 폭로를 요약만 하고 현재 행동이 그대로라면 `revelation-consequence-carryover-not-staged` 또는 `manuscript-revelation-consequence-carryover-not-evidenced`를 critical로 표시합니다.
- mystery hypothesis carryover / 추리 가설 이월은 직전 단서가 원고 초반에서 가설 수정, 용의자 순위, 알리바이 재검증, 다음 검증 행동으로 행동을 바꾸는지 확인합니다. 단서를 요약만 하고 새 조사로 건너뛰면 `mystery-hypothesis-carryover-not-staged` 또는 `manuscript-mystery-hypothesis-carryover-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에서 돌이킬 수 없는 행동 전에 구체 손실 대상과 닥친 위협/비용이 보이는 stakes clarity가 없으면 `manuscript-stakes-not-evidenced`를 critical로 표시합니다.
- stakes subject specificity / 스테이크 대상 개인화는 `피해자`, `표적`, `대상`, `수신자`, `사람` 같은 일반 명사가 독자가 걱정할 대상이 되도록 만드는 기준입니다. 첫 압박 창에서 이름, 관계, 역할, 소지품, 목소리, 메시지, 신분증, 사진, 사건/파일 번호 같은 구체 흔적이 없으면 `manuscript-stakes-subject-not-personalized`를 critical로 표시합니다.
- reader desire intensity / 독자 욕망은 사건을 확인하는 기능 비트가 아니라 독자가 바라는 결과를 만드는 기준입니다. `chapters/chapter_XXX.md` 원고 본문 manuscript에서 구체 손실 대상, 주인공 의도(구함/보호/되찾음/증명), 실패 비용, 차단된 선택지가 같은 회차 흐름에 보이지 않으면 `manuscript-reader-desire-not-evidenced`를 critical로 표시합니다.
- scene active opposition / 능동 반대세력은 scene conflict/beat의 장면 압박 뒤에 적대적 의지(범인, 가해자, 적대 시스템, 내부자, 조작된 앱 등)를 두는 규칙입니다. 적대적 의지의 의도적 방해/조작/협박/표적화가 보이지 않고 날씨/정전/잠긴 문 같은 비의지적 장애물뿐이면 `scene-active-opposition-not-staged`, `chapters/chapter_XXX.md` 원고 본문 manuscript에서 빠지면 `manuscript-active-opposition-not-evidenced`를 critical로 표시합니다. 원고의 능동 방해가 `누군가`, `익명의`, `알 수 없는`, `그들` 같은 익명 주체에만 붙고 이름/역할/적대 시스템이 없으면 `manuscript-active-opposition-actor-too-vague`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에서 antagonist strategy가 이름/별칭이 있는 반대세력의 함정, 조작, 표적화, countermove로 장면화되지 않으면 `manuscript-antagonist-strategy-not-evidenced`를 critical로 표시합니다.
- antagonist countermove carryover / 반대세력 대응 이월은 전 회차 주인공 행동 때문에 반대세력이 원고 초반에서 반격, 전술 변경, 표적 재설정, 증거 삭제, 접근 권한 회수로 현재 압박을 바꾸는지 검증합니다. 같은 함정만 반복하면 `antagonist-countermove-carryover-not-staged` 또는 `manuscript-antagonist-countermove-carryover-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에서 장면 압박, 장애물, 저항이 실제 압박/장애물로 보이지 않고 주인공 행동이 순조롭게 흘러가면 `manuscript-pressure-not-evidenced`를 critical로 표시합니다.
- temporal pressure / 시간 압박은 제한 시간, 카운트다운, 남은 n분, 기한, 사망 시각 같은 ticking-clock 표식이 실제 행동과 선택지를 좁히는지 검증합니다. 원고가 시간 압박을 말하지만 같은 장면 흐름에서 주인공 대응, 늦어짐/놓침/닫힌 선택지/사라진 증거/줄어든 기한 같은 결과를 만들지 않으면 `manuscript-temporal-pressure-not-evidenced`를 critical로 표시합니다.
- tactical adaptation은 장면 반전 뒤 전술 재계산이 보이는지 확인하는 규칙입니다. `chapters/chapter_XXX.md` 원고 본문 manuscript에서 장애물/반격/차단이 첫 계획을 막았는데도 주인공이 계획 변경, 우회, 수단 전환, 새 단서 활용, 다음 행동 변경 없이 처음 계획대로 진행하면 `manuscript-tactical-adaptation-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에서 장면 압박 뒤 결과 악화가 없고 대가, 손실, 회복 불가 변화, 새 위협이 보이지 않으면 `manuscript-consequence-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 압박, 행동, 결과를 각각 말하지만 원인과 결과의 사슬로 묶지 않으면 `manuscript-causal-chain-not-evidenced`를 critical로 표시합니다. 압박이 행동을 바꾸고, 행동이 결과를 만들고, 결과가 다음 비트를 열어야 합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 위기 해결을 우연한 해결, 갑작스러운 외부 구조, 마침 도착한 증거/조력자에 맡기면 `manuscript-convenient-resolution-not-evidenced`를 critical로 표시합니다. 구조, 체포, 탈출, 증거 발견은 사전 설치, 주인공이 작동시킨 선택/행동, 해결 뒤 대가가 함께 있어야 earned resolution으로 인정합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 사건/단서/보상/말미 훅을 객관 정보처럼 나열하고 POV 시점 앵커와 몸감각, 시선, 해석, 미해결 의문을 같은 장면 문장에 붙이지 않으면 `manuscript-pov-focalization-not-evidenced`를 critical로 표시합니다.
- narrative transportation / 체험 몰입은 독자가 줄거리를 심상으로 떠올리고 인물 압박을 함께 느끼는지 보는 규칙입니다. `chapters/chapter_XXX.md` 원고 본문 manuscript가 사건 증거는 갖췄지만 구체 공간/사물/행동, POV 감정 반응, 집중점이 인접 장면 문장에 묶이지 않고 추상 기능 요약으로 흐르면 `manuscript-narrative-transportation-not-evidenced`를 critical로 표시합니다.
- premise engine / 전제 엔진은 `reader_promise_contract.core_hook`과 `novelty_angle`이 장면의 규칙, 장치, 조건, 금기로 작동하는지 보는 규칙입니다. `chapters/chapter_XXX.md` 원고 본문 manuscript가 고유 전제를 설정/소재/컨셉으로만 말하고 그 전제가 선택을 좁히거나 전술을 바꾸거나 위험을 만들고 다음 질문을 열지 않으면 `manuscript-premise-engine-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에 `emotional_payoff`의 감정 보상이 독자 체감으로 보이지 않으면 `manuscript-payoff-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `emotional_payoff`의 장르별 보상어(쾌감/긴장감/설렘/따뜻함 등)를 감정 보상 장면화 없이 감정명으로만 말하고 몸감각, 감각 디테일, 행동 반응을 붙이지 않으면 `manuscript-payoff-embodiment-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 감정 보상 장면화는 했지만 genre-specific delight / 장르 쾌감이 없으면 `manuscript-genre-delight-not-evidenced`를 critical로 표시합니다. 미스터리 보상은 단서 결합과 추론, 남는 의문을 장면화하고, 로맨스 보상은 거리 변화/접촉, 취약한 대화, 관계 선택/비용을 장면화하며, 액션 보상은 추격 동선/전술 반전/신체 결과를 장면화해야 합니다. 스릴러 보상은 조여드는 위협/덫 확대/거짓 반전/강제 선택을 장면화하고, 현대판타지 보상은 시스템 피드백/스킬 활용/대가/현실 결과를 장면화하며, 판타지 보상은 마법 규칙 발현과 대가/한계, 경이 이미지, 능력 변화나 결과를 장면화해야 합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `narrative_elements.emotional_goal`과 각 `scene.emotional_tone`의 감정선을 감정명, 몸감각, 행동 반응으로 실제 장면에 실행하지 않으면 `manuscript-emotional-arc-not-evidenced`를 critical로 표시합니다.
- emotional progression은 감정선이 단순 등장에 머물지 않고 감정 전환/누적으로 읽히는지 보는 규칙입니다. `chapters/chapter_XXX.md` 원고 본문 manuscript에서 선언된 감정 상태 사이의 전환 계기, 선택/사건, 관계 반응, 행동 반응이 장면 안에 없으면 `manuscript-emotional-progression-not-evidenced`를 critical로 표시합니다.
- affective choice turn / 감정 선택 전환은 감정 변화가 실제 선택, 행동, 관계 태도, 결과를 바꾸는지 보는 규칙입니다. `chapters/chapter_XXX.md` 원고 본문 manuscript가 죄책감, 결심, 두려움, 안도 같은 감정 전환을 말하지만 그 감정 때문에 선택지가 닫히거나 행동이 바뀌거나 관계/위험 상태가 달라지지 않으면 `manuscript-affective-choice-turn-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에 `long_hook_threads` 중 최소 하나가 실제 장기 훅 단서로 보이지 않으면 `manuscript-long-hook-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 장기 훅을 추상 연결로만 말하고 번호, 파일, 로그, 로고 같은 구체 단서를 붙이지 않으면 `manuscript-long-hook-clue-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 장기 훅 구체 단서를 반복만 하고 새 발견, 가설 축소, 위험 변화, 다음 검증 행동으로 이야기 상태를 바꾸지 않으면 `manuscript-long-hook-thread-not-advanced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에 `payoff_cadence`의 보상 주기가 회차 보상 리듬으로 보이지 않으면 `manuscript-payoff-cadence-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `fatigue_controls`를 장면화하지 않고 같은 조사/대화/전투 비트를 반복하면 `manuscript-fatigue-control-not-evidenced`를 critical로 표시합니다. 관계 압박, 장소 변주, 행동 방식 변주, 감정 리셋 중 최소 하나로 피로도와 반복감을 끊어야 합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `tension_reset_plan`을 장면화하지 않고 위기, 경보, 추격, 폭로를 계속 고조만 시키면 `manuscript-tension-reset-not-evidenced`를 critical로 표시합니다. 고강도 비트 뒤 짧은 호흡, 감각 정적, 단서 해석, 감정 리셋을 둔 다음 새 질문/새 위협으로 재점화해야 합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 high-tension peak event를 사건명이나 긴장감 설명으로만 처리하고 같은 1~3문장 안에 구체 위험/장애물, 주인공 행동/강제 선택, 되돌릴 수 없는 결과/폭로/새 질문을 묶지 않으면 `manuscript-tension-peak-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 high-tension 회차의 tension wave / 긴장 파형을 만들지 못해 초반 압박, 중반 악화, 말미 고점, 열린 질문이 순서대로 보이지 않으면 `manuscript-tension-wave-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 `chapters/chapter_XXX.json`의 `scene.conflict` 장면 갈등과 `scene.beat` 장면 전환을 실제 원고 실행으로 보여주지 않으면 `manuscript-scene-intent-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript에 각 scene의 증거가 있더라도 장면 순서가 `chapters/chapter_XXX.json`의 scene 번호 순서와 다르게 실행되면 `manuscript-scene-order-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 scene conflict/beat 키워드를 포함해도 같은 장면 창 안에서 before 압박과 after 결과가 이어져 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나를 바꾸지 않으면 `manuscript-scene-state-delta-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 독자 보상/훅/갈등을 설명으로만 나열한 요약문형 원고이고 장면 질감(감각, 행동, 대화)이 부족하면 `manuscript-summary-prose`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 고유 단서/현장 키워드는 포함하지만 현장 기록, 분석, 항목, 결론 같은 보고서형 원고로 장면 밀도를 대체하고 직접 행동, 몸감각, 대화/서브텍스트가 같은 장면 흐름에 부족하면 `manuscript-scene-density-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript가 행동과 압박은 있지만 독자가 어디서 어디로 움직이고 무엇에 막혔는지 따라갈 수 없는 공간 블로킹 결손이면 `manuscript-spatial-blocking-not-evidenced`를 critical로 표시합니다. 장소 기준점, 동선, 차단물, 거리 압박을 같은 장면 흐름에 요구합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript의 대화문이 독자 보상, 핵심 질문, 장기 미스터리, 보상 주기, 주인공 매력 같은 설계 정보를 직접 설명하고 갈등, 회피, 반박, 침묵, 행동 비트 같은 대화 서브텍스트가 부족하면 `manuscript-dialogue-subtext-not-evidenced`를 critical로 표시합니다.
- `chapters/chapter_XXX.md` 원고 본문 manuscript의 3턴 이상 대화가 확인, 동의, 지시, 수행만 반복하고 반박, 거부, 회피, 위협, 침묵, 힘의 균형을 바꾸는 행동 비트 같은 대화 갈등이 없으면 `manuscript-dialogue-conflict-not-evidenced`를 critical로 표시합니다.
- dialogue turn은 논쟁성 대화가 대화 전환을 통해 이야기 상태를 바꾸는지 확인하는 규칙입니다. `chapters/chapter_XXX.md` 원고 본문 manuscript의 3턴 이상 논쟁 대화가 정보 변화, 권력 변화, 관계 상태 변화, 수락/거절된 조건, 또는 다음 행동을 만들지 않으면 `manuscript-dialogue-turn-not-evidenced`를 critical로 표시합니다.
- dialogue state carryover는 대화 전환으로 바뀐 이야기 상태가 바로 다음 행동 또는 다음 압박에 상태 누적되는지 확인하는 규칙입니다. 논쟁 대화가 파일, 로그, 조건, 관계, 권력, 열린 문 같은 상태를 바꾼 뒤 원고가 그 변화와 무관하게 원래처럼 진행하면 `manuscript-dialogue-state-carryover-not-evidenced`를 critical로 표시합니다.
- character voice differentiation은 인물별 대사 음성을 분리하는 규칙입니다. `chapters/chapter_XXX.md` 원고 본문 manuscript에서 화자 귀속이 가능한 다중 화자 대화가 같은 말투, 어휘, 문장 리듬, 반응 전술, 담화 표지, 동일한 대사를 반복해 서로 바꿔 말해도 구분되지 않으면 `manuscript-character-voice-not-differentiated`를 critical로 표시합니다.
- character voice profile drift는 캐릭터 파일의 말투 설정을 원고 대사와 연결하는 규칙입니다. `characters/{id}.json`의 `basic.voice.formality_level` 또는 기존 top-level `speech_pattern`이 존댓말/반말/격식 말투를 지정했는데, `chapters/chapter_XXX.md`의 화자 귀속 대사가 장면상 근거 없이 다른 register로 반복되면 `manuscript-character-voice-profile-drift`를 critical로 표시합니다. 다른 캐릭터의 고유 `signature_phrases`를 빌려 쓰거나, 명시된 표준어/방언 프로필과 반복적으로 충돌하는 대사도 같은 issue로 표시합니다. `basic.voice.vocabulary`는 `선호 어휘: 현장로그, 증거번호; 금지 어휘: 운명, 대충`처럼 기록하고, 원고에서 금지 어휘를 반복하거나 다른 인물의 고유 선호 어휘를 빌려 쓰면 같은 issue로 표시합니다. 어휘·시그니처 표현·방언은 profile context로 함께 전달되어 퇴고 지시의 기준이 됩니다.
- `apply-chapter-gate` 결과의 `proseCraft.passed == false`이면 원고 문장 품질 실패로 표시합니다. 필터워드, 감각 grounding, 감각 장식 연쇄(`sensory-wallpaper-run`), 문장 리듬, 장면 앵커 없이 설명/판단문이 이어지는 `immersive-rhythm-flatline`, 연속 단문 끊어쓰기(`monotone-short-sentence-run`), 완충 인식 표현 과밀(`hedged-perception-haze`), 감정 라벨 연쇄(`emotion-label-carousel`), 추상·상징어 누적(`symbolic-abstraction-stack`), 추상 설명 마찰(`abstract-exposition-drift`), 인식 필터 과다(`cognitive-filtering-overload`), 명사화 설명 반복(`nominalized-explanation-chain`), 번역투 공식 표현(`translationese-formula-drift`), 접속 부사 시작 반복(`connective-crutch-rhythm`), 쉼표 과밀(`comma-rhythm-overload`), 사실/의미/상황을 보였다·드러났다로 닫는 보고식 종결(`reporting-tail-summary`), 장면 밖 해결 요약(`offscreen-resolution-summary`), 같은 주어 반복(`repeated-subject-rhythm`), 정적 외부 카메라식 묘사(`detached-camera-description`), 시선/눈길/눈빛/고개 beat 연쇄(`gaze-choreography-loop`), 세계관 고유명사/설정어 과밀(`lore-name-overload`), 시간 경과 뒤 준비·조사·상황 변화를 장면 없이 넘기는 요약(`time-skip-summary-chain`), X가 아니었다. Y였다식 대비 단정 반복(`contrastive-reframe-cadence`), 상태창/스탯/레벨/보상 수치 나열(`system-stat-block-dump`), 결심/각오/해야 함 선언 반복(`declared-resolve-loop`), 단서/진실/답 공개를 장면 증거 없이 요약하는 폭로 요약 반복(`revelation-summary-leap`), 조사 절차가 장면 변화 없이 체크리스트처럼 반복되는 `procedural-checklist-cadence`, 전투 동작이 결과 변화 없이 로그처럼 반복되는 `action-choreography-loop`, 기계적 확인·동의 대사 연쇄(`rote-dialogue-response-chain`), 중립 대사 태그 연쇄(`mechanical-dialogue-tag-chain`), 지시어 연쇄(`ambiguous-reference-chain`), 금지/AI체 표현, 그리고 문체 취향 벤치마크의 `false-positive`/비선호 회차 샘플을 `Prose Craft Revision Directives` 기준으로 수정해야 합니다.
- `prose_taste_profile.max_short_sentence_run`을 넘는 짧은 서술문 연속은 대화가 아닌 지문에서 기계적 박자로 읽히므로, 단문 일부를 원인/대조/결과가 있는 중문·복문으로 묶었는지 확인합니다.
- `prose_taste_profile.min_immersive_rhythm_anchor_density_per_1000` 또는 `max_immersive_rhythm_flatline_run` 기준을 어긴 설명/판단 중심 문단은 `immersive-rhythm-flatline` 문체 실패로 표시합니다. 수정본은 물증, 손동작, 대사 반응, 선택 비용, 감각 앵커가 두세 문장마다 들어와 문단이 장면 안에서 숨 쉬는지 확인합니다.
- `prose_taste_profile.max_hedged_perception_density_per_1000`을 넘는 듯했다/것 같았다/느껴졌다/어쩐지/묘하게/희미하게 같은 완충 표현 반복은 장면 판단을 흐리므로, `hedged-perception-haze`를 문체 실패로 표시하고 물증, 선택, 결과 중심 문장으로 고쳤는지 확인합니다.
- `prose_taste_profile.max_symbolic_abstraction_density_per_1000` 또는 `max_symbolic_abstraction_run`을 넘는 운명/진실/의미/상징/상실/구원/공허/심연 계열 추상·상징어 누적은 독자가 장면을 보지 못하고 관념 해설을 읽게 만드는 문제이므로, `symbolic-abstraction-stack`을 문체 실패로 표시하고 추상어 일부가 사물, 화면/문서 변화, 선택 비용, 상대 반응, 장면 결과로 바뀌었는지 확인합니다.
- `prose_taste_profile.max_sensory_wallpaper_run`을 넘는 차가운 빛, 비릿한 냄새, 축축한 바람, 희미한 그림자식 감각 묘사 연쇄는 독자가 사건 전환 대신 분위기 장식을 읽게 만드는 문제이므로, `sensory-wallpaper-run`을 문체 실패로 표시하고 감각 일부가 단서 확인, 인물 선택, 위험 변화, 관계 반응, 즉각적 결과로 바뀌었는지 확인합니다.
- `prose_taste_profile.max_gaze_choreography_density_per_1000` 또는 `max_gaze_choreography_run`을 넘는 시선/눈길/눈빛/고개/바라봄 beat 연쇄는 독자가 선택과 결과 대신 카메라 안무를 읽게 만드는 문제이므로, `gaze-choreography-loop`을 문체 실패로 표시하고 반복 beat 일부가 새 단서 확인, 선택 비용, 거절의 결과, 상대 조건 변화로 바뀌었는지 확인합니다.
- `prose_taste_profile.max_emotion_label_run`을 넘는 불안했다/후회했다/당황했다/분노했다 같은 감정 라벨 연쇄는 독자가 감정 전환의 원인과 결과를 체험하지 못하게 만드는 문제이므로, `emotion-label-carousel`을 문체 실패로 표시하고 감정명 일부가 선택, 늦어진 반응, 잘못된 판단, 관계 비용, 즉각적 결과로 바뀌었는지 확인합니다.
- `prose_taste_profile.max_rote_dialogue_reply_ratio` 또는 `max_rote_dialogue_reply_run`을 넘는 짧은 확인·동의 대사 연쇄는 대화가 인물 욕망보다 자동 응답처럼 보이는 문제이므로, `rote-dialogue-response-chain`을 문체 실패로 표시하고 침묵, 회피, 반박, 조건 제시, 행동 비트로 대화 상태가 바뀌었는지 확인합니다.
- `prose_taste_profile.max_neutral_dialogue_tag_ratio` 또는 `max_neutral_dialogue_tag_run`을 넘는 말했다/물었다/대답했다식 중립 대사 태그 연쇄는 대화가 말의 충돌보다 태그 리듬으로 읽히는 문제이므로, `mechanical-dialogue-tag-chain`을 문체 실패로 표시하고 화자 명확성이 이미 확보된 태그를 덜었는지, 필요한 귀속은 행동 비트·침묵·시선·사물 조작으로 대체했는지 확인합니다.
- `prose_taste_profile.max_ambiguous_reference_density_per_1000` 또는 `max_ambiguous_reference_run`을 넘는 “그는/그녀는/그것은/그 말은”식 지시어 연쇄는 독자가 참조 대상을 다시 추적하게 만드는 문제이므로, `ambiguous-reference-chain`을 문체 실패로 표시하고 문단 첫머리와 연속 지시어 일부가 인물명, 역할, 물건명, 구체 행동 주체로 교체됐는지 확인합니다.
- `prose_taste_profile.max_time_skip_summary_density_per_1000` 또는 `max_time_skip_summary_run`을 넘는 며칠이 지났다/준비는 끝났다/계획은 완성됐다/상황은 달라졌다식 시간 경과 결과 보고는 독자가 중요한 변화와 비용을 보지 못하게 만드는 문제이므로, `time-skip-summary-chain`을 문체 실패로 표시하고 물증, 선택 비용, 실패 조건, 이동 경로, 다음 장면의 달라진 행동으로 장면화됐는지 확인합니다.
- `prose_taste_profile.max_contrastive_reframe_density_per_1000` 또는 `max_contrastive_reframe_run`을 넘는 그건 X가 아니었다. Y였다식 대비 단정 반복은 독자가 장면보다 결론 문구를 먼저 읽게 만드는 문제이므로, `contrastive-reframe-cadence`를 문체 실패로 표시하고 대비 문장 일부가 직접적인 긍정문, 구체 물증, 인물 행동, 선택 비용, 상대 반응으로 바뀌었는지 확인합니다.
- `prose_taste_profile.max_system_stat_block_density_per_1000` 또는 `max_system_stat_block_run`을 넘는 상태창/스탯/레벨/보상/퀘스트 갱신 수치 나열은 독자가 선택과 대가보다 UI 로그를 먼저 읽게 만드는 문제이므로, `system-stat-block-dump`를 문체 실패로 표시하고 일부 알림이 자원 소모, 실패 조건, 제한 시간, 신체/공간 변화, 관계 위험, 다음 선택 비용으로 바뀌었는지 확인합니다.
- `prose_taste_profile.max_revelation_summary_density_per_1000` 또는 `max_revelation_summary_run`을 넘는 단서/진실/답/의문 해소 요약 반복은 독자가 추리 payoff를 직접 확인하지 못하게 만드는 문제이므로, `revelation-summary-leap`를 문체 실패로 표시하고 단서 대조, 물증 확인, 오독 교정, 결론 이후 행동 비용이 장면 안에 들어왔는지 확인합니다.
- `prose_taste_profile.max_procedural_checklist_density_per_1000` 또는 `max_procedural_checklist_run`을 넘는 확인/검토/대조/정리/분류 조사 절차 반복은 독자가 추론의 원인과 결과 대신 업무 목록을 읽게 만드는 문제이므로, `procedural-checklist-cadence`를 문체 실패로 표시하고 일부 확인 동작이 단서 불일치, 가설 변화, 용의자 재정렬, 상대 거짓말, 위험/비용, 다음 행동으로 바뀌었는지 확인합니다.
- `prose_taste_profile.max_action_choreography_density_per_1000` 또는 `max_action_choreography_run`을 넘는 휘둘렀다/피했다/막았다/찔렀다식 전투 동작 반복은 독자가 전세와 대가 대신 동작 순서표를 읽게 만드는 문제이므로, `action-choreography-loop`를 문체 실패로 표시하고 일부 동작이 부상, 무기/공간 파손, 거리/위치 변화, 목표 확보/실패, 감정 압박, 전세 반전으로 바뀌었는지 확인합니다.
- `prose_taste_profile.max_static_description_density_per_1000`을 넘는 있었다/없었다/보였다 같은 정적 배경·사물 존재문이 많고 `min_viewpoint_anchor_density_per_1000`보다 인물 감각·판단·말투 앵커가 부족하면 `detached-camera-description`을 문체 실패로 표시합니다. 수정본은 배경 목록을 POV 인물이 실제로 본 순서, 오해한 판단, 감춘 반응, 달라진 행동으로 묶어야 합니다.
- `prose_taste_profile`의 추상 명사, 인식 필터, 명사화 설명, 번역투 공식 표현, 접속 부사 시작, 쉼표, 보고식 종결(`max_reporting_tail_density_per_1000`), 반복 주어, 정적 묘사/시점 앵커 기준을 넘는 문체 마찰은 독자가 문장 해석에 걸리는 문제로 봅니다. 수정본은 추상어와 명사화 판단을 사물·행동·상대 반응으로 바꾸고, 깨달음/사실이 보였다 보고 대신 독자가 결론에 도달할 단서를 먼저 보여주며, 피동·후치사식 번역투와 접속 부사 지팡이를 줄이고, 쉼표로 늘어진 절과 같은 주어 시작을 문단 리듬 안에서 분산해야 합니다.
- 결정적 폭로·해결·체포·구출이 "조사 끝에/결국/며칠 뒤" 같은 사후 요약으로 처리되면 `offscreen-resolution-summary`로 표시합니다. 수정본은 단서 확인, 선택, 충돌, 실패 비용, 폭로 순간, 즉시 달라진 행동을 실제 장면 문장으로 보여줘야 합니다.
- `apply-chapter-gate` 결과의 `readerResponse.passed == false`이면 실제 독자 패널 반응 실패로 표시합니다. `Reader Response Revision Directives`의 위치 기반 `friction_annotations`, 실제 이탈/훑어읽기 `drop_off_annotations`와 reader segment, `next-click`, attention, emotional-engagement, mental-imagery, transportation, character-attachment, relationship-investment, resonance, bookmark-intent, return-intent, purchase-intent, binge-intent 약점 차원, 그리고 `revision-outcome` 개정 퇴보 지시를 editor/revision-team 입력에 그대로 전달합니다. `readerResponse.passed == true`라도 issue에 `evidenceQuality=none` 또는 `evidenceQuality=weak`가 있으면 독자 패널 운용을 보강한 뒤 재측정합니다.
- `apply-chapter-gate` 결과의 `readerResponse.failureType`에 `character-relationship`이 포함되면 인물/관계 독자 투자 실패로 표시합니다. 이때 **Reader Response / Character Relationship Revision Directives**의 agency, vulnerable cost, reciprocal pressure, subtext, turn consequence, next scene interest 지시와 reader rewrite cue를 먼저 반영하고 `run-character-relationship-benchmark` 또는 동일 독자 샘플 재측정 뒤 같은 chapter gate를 재시도합니다.
- `apply-chapter-gate` 결과의 `readerResponse.failureType`에 `series-retention`이 포함되면 장기 연재 유지 실패로 표시합니다. 이때 **Reader Response / Series Retention Revision Directives**의 유지 점수, 반복 보상, 최신 회차 continuation/drop-off/skimming funnel 지시를 먼저 반영하고 `run-series-retention-benchmark` 또는 동일 연속 회차 샘플 재측정 뒤 같은 chapter gate를 재시도합니다.
- `apply-chapter-gate` 결과의 `readerResponse.failureType`에 `consistency-report`가 포함되면 장편 일관성 실패로 표시합니다. 이때 `Reader Response / Long-Form Consistency Revision Directives`의 stale range, missing current chapter, missing domain coverage, unresolved consistency issue 지시를 우선 처리하고 `consistency-verifier`를 다시 실행한 뒤 같은 chapter gate를 재시도합니다.
- `engagement.revisionDirectives`가 비어 있지 않으면 상위 5개를 **Engagement Revision Directives**로 요약해 editor, `/act-review`, 또는 revision-team 입력에 그대로 전달합니다.
- `engagement.recurringEngagementDirectives`가 비어 있지 않으면 상위 5개를 **Repeated Engagement Directives**로 별도 표시하고, 같은 실패가 반복되는 구조적 원인으로 취급합니다.
- `engagement.recurringEngagementDirectives` 중 같은 지시가 3회 이상이면 `evaluateChapterGate`는 재시도 대신 `USER_INTERVENTION`을 반환해야 합니다. 이 경우 **구조적 재검토**로 `plot/plot-strategy.json`과 `chapters/chapter_XXX.json`을 함께 수정하도록 보고합니다.
- `reader_experience` 누락은 신뢰도와 무관하게 대작 모드 검증 실패입니다.

**진단 전용 명령:**
```javascript
Bash("node dist/cli/record-engagement.js --project {projectPath} --chapter {N} --version {chapterVersion} --json")
```

`record-engagement`는 gate를 확정하지 않는 진단용입니다. `/verify-chapter`의 완료 판정에는 반드시 `apply-chapter-gate` 결과를 사용합니다.

```javascript
const engagement = evaluateEngagementContract({
  design: "meta/design-strategy.json",
  plot: "plot/plot-strategy.json",
  chapter: "chapters/chapter_XXX.json",
  manuscript: "chapters/chapter_XXX.md"
});

const engagementRecord = recordEngagementEvaluation({
  projectDir: projectPath,
  projectId,
  chapterNumber: N,
  version: chapterVersion,
  evaluation: engagement
});

const engagementRevisionDirectives = engagement.revisionDirectives;
const repeatedEngagementDirectives = engagement.recurringEngagementDirectives;
```

### Step 4: Summary Report

```markdown
## 검증 결과 요약

| Validator | Score | Status |
|-----------|-------|--------|
| chapter-verifier | 87점 | ✅ PASS |
| beta-reader | 82점 | ✅ PASS |
| genre-validator | 96점 | ✅ PASS |

## Engagement Trend

- engagement_score: 91점
- regression: none
- stored: `meta/quality-trend.json`

## Engagement Revision Directives

- `engagement.revisionDirectives` 상위 5개를 우선순위순으로 표시
- 각 항목은 `priority`, `target`, `action`, `expected`, `actual`을 포함
- `critical` 항목이 남아 있으면 APPROVED로 판정하지 않음

## Repeated Engagement Directives

- `recurringEngagementDirectives` 상위 5개를 반복 횟수와 함께 표시
- 같은 `code`가 2회 이상 반복되면 단순 회차 문제가 아니라 설계/장면 패턴 문제로 보고 퇴고 입력에 포함
- 같은 `code`가 3회 이상이면 **구조적 재검토**와 `USER_INTERVENTION`을 표시하고 승인하지 않음

## Chapter Gate

- gate: PASS
- ralph_state: `meta/ralph-state.json`
- next_chapter: 6

**종합 판정:** APPROVED
```

## Thresholds

### Regular Mode
| Validator | Threshold |
|-----------|-----------|
| chapter-verifier | ≥95점 |
| beta-reader | ≥95점 |
| genre-validator | ≥95점 |

### Masterpiece Mode (1화)
| Validator | Threshold |
|-----------|-----------|
| chapter-verifier | ≥95점 |
| beta-reader | ≥95점 |
| genre-validator | ≥95점 |

## Usage

```
/novel-dev:verify-chapter 5
/novel-dev:verify-chapter 1 --masterpiece
```

## Output

검증 통과 시: `<promise>CHAPTER_VERIFIED</promise>`
검증 실패 시: 실패 항목과 개선 제안 목록 출력

검증 통과/실패와 관계없이 `evaluateEngagementContract`와 `recordEngagementEvaluation` 실행 결과를 `meta/quality-trend.json`에 남깁니다. 최종 완료 판정은 `evaluateChapterGate`와 `applyChapterGateState`가 갱신한 `meta/ralph-state.json` 기준으로만 말합니다.
