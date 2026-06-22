# Masterpiece System Audit

작성일: 2026-06-19
갱신: 2026-06-22

목표: 이 플러그인을 이용해 한국어 장편 소설을 쓸 때, 단순 완성물이 아니라 독자가 계속 읽고 싶어 하는 대작급 재미와 완성도를 만들 수 있는 시스템인지 평가한다.

## 종합 점수

현재 추정 점수: **98/100**

98점 기준에서 핵심 강점은 자동 평가가 단순 결함 탐지를 넘어 독자 약속, 전제 앵커 결합도, 전제 엔진 작동, 1화 첫 화면 체화, 전제 매력 독자 반응, 회차 보상, 장기 훅 전진, 보상 쾌감 고점, 장르별 쾌감 장치, 공정한 말미 훅 준비, 클리프행어 즉시 이월, 장면 목표-전술 전환, 장면 실행, 체험 몰입, 감정 선택 전환, 장면 신선도 매트릭스, 시그니처 장면 story-impact lift, 잔향 모티프 씨앗, 주인공 매력 시그니처 행동, 관계 전환점 밀도, 관계 마음 추론, 관계 상호 압박, 인물/관계 투자도 독자 반응, 복선, 관계/선택 비용, 원고 문장 품질, 완충 인식 표현 밀도, 추상 설명/인식 필터/명사화 설명/번역투 공식 표현/접속 부사 시작/완충 부사/낮은 영향도 행동문 인과 정체/쉼표/보고식 종결/반복 주어 문체 마찰, 정적 외부 카메라식 묘사와 시점 앵커 부족, 구체 장면 근거 없는 전지적 티저 문장, 독자 욕망 강도, 추천/토론 advocacy evidence, 지속 참여 행동 의도 evidence, 사후 감정 잔향 evidence, 독자 annotation coding reliability, 지연 기억/복귀 의향 evidence를 함께 묶어 원고 품질을 끌어올린다는 점이다. 미스터리/로맨스/액션/스릴러/현대판타지/판타지 보상 문법까지 false positive 방지 게이트가 확장됐고, `beta-reader`와 `quality-oracle`은 이제 결함 없음과 대작 고점을 분리해 `high_point_assessment`와 Masterpiece High-Point Pass로 90점대 판정을 제한한다. 품질 게이트 팀은 이제 `issue_policy`로 검증 issue code, source agent, evidence, directive provenance를 보존하고, `execution_trace`/`failure_attribution`으로 실패한 팀 run의 결정적 단계를 남긴 뒤 `recovery_plan`으로 prefix-preserving replay, 재시작 step, 적용 directive, 성공 기준, 검증 명령까지 기록하며, `validation_conflicts`로 검증자 PASS/FAIL 분열, 심각도 차이, 큰 점수 편차, 근거/지시 충돌을 PASS 전에 보존·해결하게 한다. 추가로 `context_manifest`가 품질 게이트 팀의 입력 파일·상태·이슈·지시 freshness를 기록하고, required context가 missing/stale/superseded이면 validator dispatch 또는 PASS를 차단한다. `handoff_contracts`는 pipeline/collaborative 팀에서 issue, directive, evidence, score/verdict, 파일 refs가 다음 agent에게 같은 강도로 전달됐는지 검증하고, missing/stale/superseded/weakened payload는 `handoff_loss`와 recovery plan으로 PASS 전에 차단한다. `run-premise-appeal-benchmark`가 프로젝트의 전제 독자 반응 샘플을 읽어 자동 전제 점수의 false positive/false negative와 장르·타깃 독자 polarity coverage를 저장한다. `run-character-relationship-benchmark`가 인물/관계 투자도 샘플을 읽어 protagonist agency, distinctive signature, vulnerability cost, character attachment, relationship tension, reciprocal pressure, subtext inference, turn consequence, next scene interest 반응과 자동 드라마 점수를 비교한다. `run-engagement-benchmark`가 프로젝트의 labeled 샘플을 읽어 false positive/false negative와 장르/쾌감 경로 커버리지를 리포트로 저장하며, 필수 장르별 known-good/known-bad polarity coverage와 연속 회차 coverage까지 따로 계산한다. `run-series-retention-benchmark`가 연속 회차 타깃 독자 샘플에서 유지 점수 낙폭, 반복 reward/emotional signature, 피로/신선도 코멘트를 비교해 장기 연재 false positive를 별도 리포트로 남기고, `apply-chapter-gate`가 현재 회차에 해당하는 충분한 장기 유지 실패를 Ralph Loop `RETRY`로 연결한다. `run-prose-taste-benchmark`가 선호/비선호 문체 샘플의 오판을 프로젝트 리포트로 축적하고, 이제 `reader_segment`·`readerSegmentRepresentativeness`·`calibration_split`·`splitCoverage`·`readyForStyleTuning`으로 문체 보정 샘플이 한 취향 코호트에 치우쳤는지, 또는 기준 맞춤용 샘플에 과적합됐는지도 분리한다. `calibrate-reader-response`가 만든 독자 패널 오차 리포트도 `apply-chapter-gate`가 최종 완료 판정에 반영하고, 독자 샘플 근거는 이제 숫자 카운트뿐 아니라 started/completed/drop-off/skimming retention evidence와 `friction_annotations`의 위치, 이유, 영향 차원, 재작성 제안, reader segment, coding reliability까지 요구한다. 낮게 나온 reader-response dimension을 같은 dimension의 actionable 마찰 주석이 덮지 못하면 `frictionAnnotationCoverage`가 `partial`/`missing`으로 남고, actionable 주석이 reader segment를 보존하지 않거나 한 독자군에 쏠리거나 annotation coding reliability가 약하면 threshold retuning usable evidence에서 제외된다. 이 구조화된 마찰 주석은 최종 `Reader Response Revision Directives`로 직접 전달되어 독자 점수가 실제 퇴고 지시로 바뀐다. 설문 차원도 `character_attachment`와 `relationship_investment`를 받아 자동 점수가 높아도 독자가 인물 결과나 관계 전환을 신경 쓰지 않는 false positive를 드러낸다. 추가로 `novelty`, `surprise`, `resonance`를 받아 자동 점수와 기본 재미 점수는 높지만 새롭지 않고, 놀랍지 않고, 읽고 난 뒤 잔향이 약한 generic-but-polished 원고를 독자 패널 blind spot으로 분리한다. 또한 `bookmark_intent`, `return_intent`, `purchase_intent`, `binge_intent`와 `durable_engagement_annotations`를 받아 평균 호감이 저장, 팔로우, 재방문, 유료 계속읽기, 몰아읽기 의향으로 이어지지 않는 false positive를 분리한다. 또한 `lingering_emotion_count`, `reflective_comment_count`, `personal_memory_or_meaning_count`, `resonance_annotations`를 받아 높은 resonance 점수가 실제 잔류 감정, 성찰 질문, 기억 이미지, 개인적 의미로 뒷받침되는지 따로 검증한다. 또한 `delayed_follow_up_respondent_count`, `delayed_follow_up_hours`, `delayed_scene_recall_count`, `delayed_character_recall_count`, `delayed_next_click_intent_count`, `delayed_return_intent_count`, `delayed_paid_continuation_intent_count`, `delayed_memory_annotations`로 최소 하루 뒤에도 장면과 인물 압박, 다음 회차 욕망이 남는지 검증한다. 또한 독자 패널 평균 점수가 응답자 양극화나 넓은 표본 오차를 숨기지 않도록 `reader_score_standard_deviation`, `high_response_count`, `neutral_response_count`, `low_response_count`를 받아 `panelConsensus`, `readerScoreMarginOfError`, `readerScoreConfidence`를 산출하고, 한 독자군이 패널을 지배하지 않는지 `target_reader_segment_count`와 `dominant_reader_segment_ratio`로 `cohortRepresentativeness`를 산출한다. 합의도가 `clear`가 아니거나 신뢰도가 `precise`가 아니거나 대표성이 `balanced`가 아니거나 패널 프로토콜이 `strong`이 아니거나 `retentionEvidence`, `annotationReliability`, `delayedMemoryEvidence`가 `usable`이 아닌 샘플은 threshold retuning의 usable coverage에서 제외한다. 추가로 `calibration_split`을 `calibration`/`validation`/`holdout`으로 보존하고, usable holdout 샘플이 부족하면 자동 threshold retuning을 준비 완료로 보지 않는다. 필수 장르별 샘플 수, usable 샘플 수, 연속 회차 coverage, 초반/중반/후반 같은 회차 구간 coverage가 부족하면 자동 threshold retuning을 준비 완료로 보지 않는다. 다만 실제 독자 패널 데이터 축적은 아직 99점 이상 과제로 남아 있다.

이번 추가 개선으로 `reader-response-calibration`은 준비 부족 상태에서 hard threshold를 바꾸지 않고 `collect-more-reader-evidence`만 제안하며, 충분한 usable 패널 근거와 usable holdout 근거가 쌓였을 때만 `tighten-automated-high-pass`, `loosen-reader-loved-low-score-route`, `increase-reader-dimension-sensitivity`, `hold-current-gates`를 evidence sample id와 함께 남긴다. 즉 사람이 읽었을 때 재미없는 false positive나, 자동 점수는 낮지만 독자가 좋아하는 false negative가 발견돼도 임의로 기준을 흔들지 않고, 장르·구간·코호트·retention evidence·합의도·오차범위·패널 프로토콜·holdout split이 충족된 샘플에 한해 조정 후보를 만든다. `panelProtocolQuality`는 blind reading, author identity masking, prior manuscript/version exposure screening, spoiler/synopsis exposure screening, neutral question wording, response option order randomization/counterbalancing, exact wording disclosure, recruitment method disclosure, recruitment channel count coverage, attention-check pass count, excluded response count가 확인되지 않은 패널을 threshold retuning 근거에서 제외한다. `retentionEvidence`는 started read count, completed read count, drop-off count, skimmed read count가 없는 완독자 평균만으로 threshold를 조정하지 못하게 하며, `splitCoverage`와 `underSampledUsableHoldoutSamples`는 기준을 맞추는 데 사용한 calibration 샘플만으로 threshold를 조정하는 과적합을 막고, 기본적으로 holdout 샘플에서 확인된 drift만 tuning suggestion의 근거로 쓴다.

독자 패널은 이제 `started_read_count`, `completed_read_count`, `drop_off_count`, `skimmed_read_count`도 받는다. 평균 점수는 완독하고 응답한 사람에게만 남기 쉬워 중도 포기와 훑어읽기 독자를 숨길 수 있으므로, `retentionEvidence=none/weak`인 샘플은 기본 설정에서 hard gate threshold retuning의 usable evidence가 될 수 없고, `lowRetentionEvidenceCount`와 `low retention evidence` tuning blocker로 분리된다.

연속 회차 유지력 벤치마크는 이제 회차별 hook progress ledger도 받는다. `hook_open_thread_count`, `hook_advanced_thread_count`, `hook_resolved_thread_count`, `hook_recontextualized_thread_count`, `hook_new_thread_count`, `hook_stalled_thread_count`를 기록해 장기 질문이 실제로 좁혀지거나, 해소되거나, 앞선 정보를 재해석하게 만드는지 확인한다. 독자 평균 점수와 next-click 점수가 높아도 열린 질문이 멈춘 채 새 cliffhanger만 붙으면 `reader-hook-stall`로 실패하고, ledger 자체가 없거나 불완전하면 `weakHookProgressEvidenceCount` 때문에 `readyForGateTuning=false`가 된다. 이는 대작형 장편에서 “궁금함”을 단발 질문 축적이 아니라 인과적으로 갚아 가는 정보 공백 관리로 다루기 위한 장치다.

연속 회차 유지력 벤치마크는 이제 `emotional_signature`와 `maximum_repeated_emotional_signature_run`도 받는다. Reagan et al.의 대규모 서사 감정 아크 연구는 이야기의 정서 곡선이 반복 가능한 형태로 요약될 수 있음을 보이고, 이는 회차마다 보상은 달라도 독자가 체감하는 말미 감정 리듬이 같으면 피로가 누적될 수 있다는 실무 가설을 뒷받침한다. 따라서 `repetitive-emotional-pattern`은 reward signature가 모두 달라도 같은 dread-shock-deferral, loss-delay, alarm-dread 같은 감정 말미가 연속될 때 별도 실패로 남고, `apply-chapter-gate`는 `emotional-arc-variety` directive로 relief, dread, intimacy, awe, grief, comic release, hard-won resolve 같은 다른 affective movement를 요구한다. 참고: https://arxiv.org/abs/1606.07772

독자 패널은 이제 절대 점수뿐 아니라 기준작/대안 원고 대비 blind pairwise 선호도도 받을 수 있다. `comparative_preference_current_count`, `comparative_preference_reference_count`, `comparative_preference_tie_count`, `comparative_blind_pairwise`, `comparative_same_reader_cohort`, `comparative_question_wording_disclosed`가 들어오면 `comparativePreferenceStatus`, `comparativePreferenceAverageWinRate`, `weakComparativePreferenceCount`가 리포트에 남는다. `require_comparative_preference`를 켜면 독자 평균 점수와 holdout이 충분해도 기준작 대비 선호율이 낮거나 비교 프로토콜이 약한 샘플은 hard gate threshold retuning을 준비 완료로 만들 수 없다.

독자 패널은 이제 `scene_recall`과 `scene_recall_annotations`도 받는다. 연구상 서사 몰입은 주의, 심상, 정서가 함께 작동하며, 강하게 몰입된 순간은 이후 사건 회상과도 연결된다. 따라서 평균 호감 점수가 높아도 독자가 자발적으로 떠올리는 장면과 특징적 디테일을 남기지 못한 샘플은 `sceneRecallEvidence=none/weak`로 남고, 기본 설정에서는 hard gate threshold retuning의 usable evidence가 될 수 없다.

독자 패널은 이제 `payoff_setup_recall_count`, `payoff_trigger_recognition_count`, `payoff_earned_count`, `payoff_recontextualization_count`, `payoff_emotional_satisfaction_count`, `payoff_fairness_annotations`도 받는다. 복선 회수는 독자가 놀랐다는 평균 점수만으로는 부족하다. 독자가 실제로 앞선 setup을 기억하고, trigger/reveal을 연결하고, 회수가 공정했으며, 앞 장면을 다시 읽게 만들고, 감정적 보상을 남겼다는 구조화 근거가 있어야 `payoffFairnessEvidence=usable`이 된다. 따라서 반전은 있지만 치트처럼 느껴지는 원고, 단서가 있었지만 독자가 기억하지 못하는 원고, payoff가 감정 보상 없이 정보 공개로만 끝나는 원고를 threshold retuning 근거에서 제외한다.

독자 패널은 이제 `recommendation_intent`, `organic_recommendation_count`, `discussion_prompt_count`, `advocacy_annotations`도 받는다. 평균 호감이나 완독은 높아도 독자가 남에게 권할 장면, 공유 이유, 토론 질문을 남기지 못하면 장기 흥행력과 입소문 잠재력을 과대평가할 수 있다. 따라서 `advocacyEvidence=none/weak`인 샘플은 기본 설정에서 hard gate threshold retuning의 usable evidence가 될 수 없고, `lowAdvocacyEvidenceCount`와 `low advocacy` tuning blocker로 분리된다.

독자 패널은 이제 `bookmark_intent`, `return_intent`, `purchase_intent`, `binge_intent`, `bookmark_count`, `follow_or_library_add_count`, `return_next_day_count`, `binge_read_intent_count`, `paid_continuation_intent_count`, `durable_engagement_annotations`도 받는다. 평균 호감이나 추천 의향은 높아도 독자가 저장, 팔로우, 재방문, 유료 계속읽기, 몰아읽기를 하려는 근거가 없으면 장편 연재 생존력을 과대평가할 수 있다. 따라서 `durableEngagementEvidence=none/weak`인 샘플은 기본 설정에서 hard gate threshold retuning의 usable evidence가 될 수 없고, `lowDurableEngagementEvidenceCount`와 `low durable engagement` tuning blocker로 분리된다.

독자 패널은 이제 실제 다음 회차 이동 행동도 `next_chapter_cta_impression_count`, `next_chapter_click_count`, `next_chapter_open_count`, `next_chapter_read_start_count`로 따로 받는다. 다음 화 클릭 의향이나 저장 의향은 높아도 CTA 노출 뒤 실제 클릭/열람/읽기 시작이 약하면 `continuationBehaviorEvidence=none/weak`로 남고, 기본 설정에서는 hard gate threshold retuning의 usable evidence가 될 수 없다. 또한 현재 회차의 신뢰 가능한 패널에서 실제 행동 카운트가 수집됐는데 클릭/열람/읽기 시작 비율이 낮아 `continuationBehaviorEvidence=weak`가 된 경우에는 `apply-chapter-gate`가 `continuation-behavior-drop`으로 Ralph 완료를 차단한다. 이 카운트는 `lowContinuationBehaviorEvidenceCount`, `continuationBehaviorEvidenceCount`, `low continuation behavior` tuning blocker, `collect-next-chapter-continuation-behavior` evidence collection task로 드러나며, `masterpiece-readiness`도 `lowContinuationBehaviorEvidenceCount`를 weak evidence 감점에 포함한다.

독자 패널은 이제 `lingering_emotion_count`, `reflective_comment_count`, `personal_memory_or_meaning_count`, `resonance_annotations`도 받는다. 평균 호감, 추천 의향, 지속 참여 의향이 있어도 독자가 읽고 난 뒤 남는 감정, 질문, 이미지, 개인적 의미를 말하지 못하면 대작의 사후 잔향을 과대평가할 수 있다. 따라서 `resonanceEvidence=none/weak`인 샘플은 기본 설정에서 hard gate threshold retuning의 usable evidence가 될 수 없고, `lowResonanceEvidenceCount`와 `low resonance evidence` tuning blocker로 분리된다.

대작 준비도는 이제 장편 일관성 리포트도 필수로 본다. `reviews/consistency-report.json`이 없거나, 최소 3개 회차를 읽지 않았거나, character/timeline/setting/factual/plot_logic 5개 domain coverage가 빠져 있거나, critical/major/minor consistency issue가 남아 있으면 `long-form-consistency` 영역이 `missing`, `at-risk`, `needs-evidence`로 떨어지고 98+ readiness 통과를 막는다. 장편 LLM 생성에서 흔한 인물·시간선·세계 규칙·사실·인과 기억 붕괴를 별도 독자 반응 점수나 단일 회차 재미 점수에 묻지 않게 한 것이다.

잔향은 이제 패널 사후 설문에만 남지 않는다. `chapter.narrative_elements.resonance_seed`가 선언되면 `motif-resonance-not-staged`와 `manuscript-motif-resonance-not-evidenced`가 장면 메타데이터와 실제 원고 모두에서 같은 사물/이미지가 시각 디테일, 몸 감정 또는 POV 잔향, 의미 변화, 다음 선택·관계·규칙·단서·되돌릴 수 없는 결과로 이어지는지 확인한다. 따라서 “주제가 좋다”거나 “상징을 넣었다”는 기획 문구만으로는 통과하지 못하고, 독자가 떠올릴 구체 이미지가 장면의 이야기 일을 하도록 강제한다.

문체 취향 벤치마크도 같은 원칙을 적용한다. `prose-taste-benchmark`는 `calibration_split`을 `calibration`/`validation`/`holdout`으로 보존하고, 기본 설정에서는 usable holdout과 disliked-prose holdout이 부족하면 `readyForStyleTuning=false`로 남긴다. 사용자가 거슬렸던 문체를 샘플로 넣더라도 같은 샘플에만 맞춘 문체 게이트가 되지 않게, 실제 튜닝 준비 완료는 reserved holdout에서 선호 문체와 비선호 문체가 모두 검증된 뒤에만 가능하다.

추가로 비선호 문체 샘플은 이제 `style_friction_annotations`로 독자가 거슬린 위치, 이유, issue code, reader segment, rewrite suggestion을 보존할 수 있다. 탐지 자체가 맞아 `passed=true`여도 비선호 샘플의 주석이 없거나 기대 issue code를 덮지 못하면 `styleTuningUsable=false`로 남고, `missingStyleFrictionAnnotationCount`/`weakStyleFrictionAnnotationCount`가 `readyForStyleTuning=false`의 근거가 된다. 따라서 “문체가 거슬린다”는 총평이 추상 선호가 아니라 장면 위치별 퇴고 근거로 축적된다.

추가로 선호 문체 샘플도 `style_highlight_annotations`로 독자가 좋게 읽은 위치, 이유, 문체 quality, reader segment, transfer guidance를 보존한다. 선호 샘플이 자동 gate를 통과해도 긍정 문체 하이라이트가 없거나 다음 장면으로 옮길 지침이 약하면 `styleTuningUsable=false`가 되고, `missingStyleHighlightAnnotationCount`/`weakStyleHighlightAnnotationCount`가 남는다. 따라서 문체 튜닝은 “거슬리는 습관을 없애는 것”에 그치지 않고, 독자가 실제로 선호한 리듬, 서브텍스트, 이미지, 목소리, 감정 정밀도를 반복 생산하는 근거를 요구한다.

추가로 문체 샘플 세트는 이제 `styleFingerprint`를 계산한다. 선호/비선호 샘플이 기능 보고체, 감각/비유/완충 표현/추상 명사/인식 필터/명사화/번역투/접속 부사/쉼표/보고식 종결/시점 앵커/반복 리듬/상투적 반응 beat/모호한 분위기 수식/자문형 의문문/전지적 티저 밀도 metric에서 실제로 갈라지지 않으면 `styleFingerprintStatus=weak`, `weakStyleFingerprintCount=1`, `readyForStyleTuning=false`가 된다. 따라서 시스템은 금지 문구 하나를 외워 맞히는 문체 게이트를 대작용 취향 튜닝 근거로 삼지 않는다.

추가로 `stock-reaction-beat-chain`은 숨 삼킴, 입술 깨묾, 시선 회피, 고개 숙임, 손 떨림, 주먹 쥠 같은 상투적 반응 beat가 감정과 선택을 대신하는 경우를 분리한다. 기본 gate는 신체 반응 자체를 금지하지 않고, 반응 beat가 과밀하거나 연속되어 정보 공개, 전술 변화, 관계 압박, 장면 상태 변화 없이 감정 표지만 늘어나는 문체를 실패시킨다. `max_stock_reaction_beat_density_per_1000`과 `max_stock_reaction_beat_run`으로 장르별 허용치를 조정할 수 있고, `stockReactionBeatDensityPer1000`/`longestStockReactionBeatRun`은 style fingerprint에도 포함된다.

추가로 `vague-atmosphere-modifier-chain`은 묘한 공기, 알 수 없는 감각, 무거운 침묵, 낯선 긴장, 불길한 예감처럼 분위기 수식어가 구체 물증·소리·행동 변화 없이 긴장을 대신하는 경우를 분리한다. 기본 gate는 섬뜩하거나 서정적인 분위기 자체를 금지하지 않고, 모호한 수식이 과밀하거나 연속되어 독자가 무엇이 달라졌는지 볼 수 없는 문체를 실패시킨다. `max_vague_atmosphere_modifier_density_per_1000`과 `max_vague_atmosphere_modifier_run`으로 장르별 허용치를 조정할 수 있고, `vagueAtmosphereModifierDensityPer1000`/`longestVagueAtmosphereModifierRun`은 style fingerprint에도 포함된다.

추가로 `filler-adverb-cadence`는 천천히, 조용히, 가만히, 살짝, 잠시, 그대로 같은 완충 부사가 동사·사물 변화·선택 지연·상대 반응을 대신해 문장 박자를 채우는 경우를 분리한다. 기본 gate는 속도와 태도를 드러내는 부사 자체를 금지하지 않고, 부사가 과밀하거나 연속되어 장면 행동보다 먼저 보일 때만 실패시킨다. `max_filler_adverb_density_per_1000`과 `max_filler_adverb_run`으로 장르별 허용치를 조정할 수 있고, `fillerAdverbDensityPer1000`/`longestFillerAdverbRun`은 style fingerprint에도 포함된다.

추가로 `rhetorical-question-drift`는 왜/어떻게/정말/걸까 같은 자문형 의문문이 실제 확인 행동, 새 단서, 선택 비용, 상대 반응 없이 장면 진행을 대신하는 경우를 분리한다. 기본 gate는 질문 자체를 금지하지 않고, 질문이 과밀하거나 연속되어 curiosity gap을 행동과 단서로 갚지 못할 때 실패시킨다. `max_rhetorical_question_density_per_1000`과 `max_rhetorical_question_run`으로 장르별 허용치를 조정할 수 있고, `rhetoricalQuestionDensityPer1000`/`longestRhetoricalQuestionRun`은 style fingerprint에도 포함된다.

회차 재미 벤치마크도 같은 holdout 원칙을 적용한다. `engagement-benchmark`는 `calibration_split`을 `calibration`/`validation`/`holdout`으로 보존하고, 기본 설정에서는 usable holdout과 known-bad holdout이 부족하면 `readyForGateTuning=false`로 남긴다. 자동 재미 점수와 issue detector가 개발 샘플에서는 모두 맞아도, 별도로 아껴 둔 실패 원고에서 false positive를 잡는지 확인되기 전에는 회차 완료 게이트 튜닝을 준비 완료로 보지 않는다.

전제 매력 벤치마크도 같은 holdout 원칙을 적용한다. `premise-appeal-benchmark`는 `calibration_split`을 `calibration`/`validation`/`holdout`으로 보존하고, 기본 설정에서는 evidence-sufficient holdout과 known-bad holdout이 부족하면 `readyForGateTuning=false`로 남긴다. 자동 전제 점수와 장르/타깃 독자 coverage가 개발 샘플에서는 좋아 보여도, 따로 남겨 둔 약한 전제에서 false positive를 잡는지 확인되기 전에는 전제 설계 게이트 튜닝을 준비 완료로 보지 않는다.

인물/관계 투자도 벤치마크도 같은 holdout 원칙을 적용한다. `character-relationship-benchmark`는 `calibration_split`을 `calibration`/`validation`/`holdout`으로 보존하고, 기본 설정에서는 evidence-sufficient holdout과 known-flat holdout이 부족하면 `readyForGateTuning=false`로 남긴다. 자동 드라마 점수와 관계 유형 coverage가 개발 샘플에서는 좋아 보여도, 따로 남겨 둔 밋밋한 관계 장면에서 false positive를 잡는지 확인되기 전에는 인물/관계 게이트 튜닝을 준비 완료로 보지 않는다.

장기 연재 유지력 벤치마크도 같은 holdout 원칙을 적용한다. `series-retention-benchmark`는 `calibration_split`을 `calibration`/`validation`/`holdout`으로 보존하고, 기본 설정에서는 evidence-sufficient holdout과 known-drop holdout이 부족하면 `readyForGateTuning=false`로 남긴다. 자동 장기 연재 점수와 장르/타깃 독자 coverage가 개발 샘플에서는 좋아 보여도, 따로 남겨 둔 피로 누적·반복 보상 시퀀스에서 false positive를 잡는지 확인되기 전에는 장기 연재 게이트 튜닝을 준비 완료로 보지 않는다. 추가로 started/completed/continued/drop-off/skimmed count가 없거나 약하면 `weak-funnel-evidence`로 남고, 남은 독자 평점은 높아도 시작 독자가 완독·다음 회차 이동을 하지 않으면 `reader-funnel-drop`으로 분리한다.

## 항목별 점수

| 항목 | 점수 | 판단 |
| --- | ---: | --- |
| 독자 약속 설계 | 98 | `reader_promise_contract`, `fun_spec`, `reader_experience`가 설계-플롯-회차를 연결한다. 일반어 계약은 `reader-promise-generic`, 구체적이지만 훅/차별점/중심 질문/연재 동력이 서로 다른 전제를 말하는 계약은 `reader-promise-premise-not-integrated`, 일반어 fun spec은 `fun-spec-generic`으로 막는다. `manuscript-premise-engine-not-evidenced`는 `core_hook`과 `novelty_angle`이 원고에서 설정/소재/컨셉 설명으로만 남고, 장면 규칙·장치·조건·금기로 선택, 전술, 위험, 다음 질문을 바꾸지 못하는 false positive를 차단한다. 이제 `premise-appeal-benchmark`와 `run-premise-appeal-benchmark`가 자동 전제 점수와 타깃 독자 반응을 비교해 curiosity gap, novelty, protagonist investment, emotional pull, clarity, target fit, next chapter anticipation, would read 축의 전제 false positive를 잡고, 장르·타깃 독자별 known-good/known-bad coverage gap도 보고한다. 추가로 evidence-sufficient holdout과 known-bad holdout이 부족하면 `readyForGateTuning=false`로 남겨, 매력 있어 보이도록 조정한 개발 전제 샘플만 보고 설계 게이트를 바꾸지 못하게 한다. 목록 행동 evidence도 blind listing test, platform/source/variant, observation window가 약하면 gate tuning evidence에서 제외한다. 실제 독자 패널 규모 확장은 계속 필요하다. |
| 회차 재미 구조 | 98 | `chapter_reward`, `page_turner_question`, `must_click_ending`, `drop_off_risk`, `cliffhanger_strength`, `reader desire intensity`, `payoff delight`, `genre-specific delight`, `forecast revision`, `ending hook setup`을 자동 검증한다. `manuscript-forecast-revision-not-evidenced`는 반전, 예상 뒤집힘, 오판, 가설 수정, 재해석을 약속했지만 원고가 독자/주인공의 예상, 그 예상을 깨는 구체 단서나 사건, 바뀐 가설/용의자 순위/단서 의미/계획/다음 검증 행동을 장면화하지 못하는 false positive를 차단한다. `beta-reader`는 `high_point_assessment`로 memorable scene lift, character appeal signature, payoff delight, genre-specific delight, next-click compulsion을 따로 채점하고, 90점 이상 판정에는 5축 고점 조건을 적용한다. `run-engagement-benchmark`는 프로젝트 labeled 샘플의 false positive/false negative뿐 아니라 필수 장르별 통과/실패 샘플, 연속 회차 샘플, usable holdout/known-bad holdout 준비 상태까지 보고한다. |
| 장면 실행력 | 98 | 장면 갈등, 장면 전환, 장면 상태 변화, 능동 반대세력, 주인공 목표-전술 전환, 선택-대가, 인과 상승, 장면 신선도 매트릭스, 시그니처 장면 story-impact lift, 잔향 모티프 씨앗까지 검증한다. `scene-goal-tactic-turn-not-staged`가 사건 결과와 압박은 있지만 주인공의 구체 목표, 방해하는 힘, 전술 또는 전술 전환, 바뀐 결과가 함께 보이지 않는 장면 false positive를 차단한다. `scene-state-delta-not-staged`는 확인/발견/연결 같은 사건 단어는 있지만 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나가 장면 전후로 바뀌지 않는 false positive를 차단한다. `scene-novelty-matrix-not-staged`는 이제 장소명만 붙인 `setting_mode`를 인정하지 않고, 동선/차단물/거리 압박/잠긴 접근/우회/침투/탈출 같은 공간 affordance가 장면 갈등이나 보상 전달을 실제로 바꾸도록 요구한다. 시그니처 이미지는 사물/공간/몸동작과 시각 디테일만으로는 통과하지 못하고, 선택 비용/규칙 변화/단서 재해석/관계·정체성 변화/되돌릴 수 없는 결과 중 하나로 서사 상태를 바꿔야 한다. 반전이나 예상 뒤집힘을 말하는 장면은 놀람 선언만으로 통과하지 못하고, 예측/가설/해석/계획/다음 검증 행동 중 하나가 실제로 바뀌어야 한다. `resonance_seed`가 있으면 같은 사물/이미지가 감정 잔향, 의미 변화, 이야기 결과와 결합되어야 하므로 분위기용 상징이나 주제 라벨을 통과시키지 않는다. 새로 `reader-response-calibration`이 `tension_trace_annotations`와 `narrative_forecast_annotations`를 받아 독자가 실제로 표시한 긴장 고점, 궁금증, 위험/질문, 예측 변화, 공정한 예측 불일치 근거가 없으면 gate threshold retuning을 막는다. 남은 한계는 실제 장르별 독자 tension trace와 narrative forecast 샘플 자체를 더 축적해야 한다는 점이다. |
| 장기 연재 지속력 | 98 | 장기 훅, 장기 훅 전진, 보상 주기, 피로도 방지, 완급 리셋, 반복 보상 패턴, 반복 감정 아크, 클리프행어 즉시 이월을 추적한다. `long-hook-thread-not-advanced`와 `manuscript-long-hook-thread-not-advanced`가 장기 훅을 이름만 반복하는 정체 회차를 차단하고, 새 단서, 좁혀진 가설, 위험/대가 변화, 다음 검증 행동으로 이야기 상태를 전진시키도록 요구한다. `cliffhanger-carryover-delayed`와 `manuscript-cliffhanger-carryover-delayed`는 직전 말미 훅을 planning에는 적었지만 opening scene 또는 원고 첫 두 문장 이후에야 처리하는 초반 이탈 false positive를 차단한다. 이제 `series-retention-benchmark`와 `run-series-retention-benchmark`가 연속 회차 샘플에서 next-click, fatigue resistance, hook progress, reward variety, payoff satisfaction, novelty, emotional reset, confidence in payoff를 회차별로 비교하고, 첫 회차 대비 마지막 회차 독자 유지 낙폭과 반복 reward/emotional signature run까지 리포트한다. 자동 점수는 높지만 독자 유지가 약하거나, 중반 이후 반응이 급락하거나, 같은 보상 패턴 또는 감정 말미 리듬이 반복되는 false positive를 별도 실패 유형으로 분리한다. 추가로 evidence-sufficient holdout과 known-drop holdout이 부족하면 `readyForGateTuning=false`로 남겨, 개발용 연속 회차 샘플 몇 개만 보고 장기 연재 게이트를 바꾸지 못하게 한다. 장편 중후반의 실제 독자 피로도 예측은 아직 실제 패널 데이터 자체가 부족하지만, 이제 부족 상태가 `series-retention-benchmark-report.json`, `splitCoverage`, `underSampledUsableHoldoutSamples`, `underSampledUsableFailingHoldoutSamples`, `underSampledRequiredChapterRanges`, `missingRequiredChapterRangeGenres`로 드러난다. |
| 인물/관계 드라마 | 98 | 주인공 욕망/결핍, 반대세력 전략, 관계 변화, 관계 이월, 독자가 바라는 결과를 만드는 주인공 의도와 실패 비용을 본다. `character-appeal-signature-not-staged`와 `manuscript-character-appeal-signature-not-evidenced`가 주인공 매력을 고유 방식/특성, 주체적 행동, 비용 또는 취약성, visible story/social reaction이 결합된 장면 행동으로 요구한다. `relationship-turning-point-not-staged`와 `manuscript-relationship-turning-point-not-evidenced`는 상호 반응은 있지만 취약성/관계 위험, 상대의 선택, 신뢰/거리 변화, 즉시 달라진 행동 결과가 한 장면 창에 묶이지 않는 얇은 관계 회복을 차단한다. `relationship-mind-inference-not-staged`와 `manuscript-relationship-mind-inference-not-evidenced`는 관계 결과만 있고 숨김, 오해, 진심, 망설임, 바뀐 속내를 독자가 추론할 단서가 없는 평면적 관계 장면을 차단한다. `relationship-mutual-pressure-not-staged`와 `manuscript-relationship-mutual-pressure-not-evidenced`는 상대가 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험 없이 그저 도와주거나 용서하는 일방향 관계 전환을 차단한다. 이제 `character-relationship-benchmark`와 `run-character-relationship-benchmark`가 자동 드라마 점수와 타깃 독자 반응을 비교해 protagonist agency, distinctive signature, vulnerability cost, character attachment, relationship tension, reciprocal pressure, subtext inference, turn consequence, next scene interest 축의 false positive/false negative를 리포트로 남기고, 장르·타깃 독자·관계 유형별 known-investing/known-flat coverage gap도 계산한다. 추가로 evidence-sufficient holdout과 known-flat holdout이 부족하면 `readyForGateTuning=false`로 남겨, 개발용 관계 장면 샘플 몇 개만 보고 인물/관계 게이트를 바꾸지 못하게 한다. `reader-response-calibration`은 `character-attachment`와 `relationship-investment`를 별도 독자 반응 축으로 받아 자동 점수는 높지만 인물 결과나 관계 전환을 care하지 않는 샘플을 blind spot으로 보고한다. 99점에는 장편 누적 호감과 관계 변화의 실제 독자 패널 데이터가 더 필요하다. |
| 복선/훅 회수 | 98 | 장부 정합성, plant 구체성, payoff timing, payoff resolution, payoff delight, genre-specific delight, 말미 훅 준비 단서를 검증한다. 이제 `reader-response-calibration`이 `payoff_setup_recall_count`, `payoff_trigger_recognition_count`, `payoff_earned_count`, `payoff_recontextualization_count`, `payoff_emotional_satisfaction_count`, `payoff_fairness_annotations`를 받아 독자가 실제로 setup을 기억하고, trigger를 연결하고, 회수를 공정하게 받아들이며, 앞 장면을 재해석하고, 감정적 보상을 얻었는지 별도 evidence로 본다. `payoffFairnessEvidence !== "usable"`인 샘플은 hard gate threshold retuning의 usable coverage에서 제외되고 `low payoff fairness` tuning blocker로 분리된다. 장르별 회수 쾌감은 미스터리/로맨스/액션/스릴러/현대판타지/판타지 프로필로 보정했고, 긍정/부정 샘플 벤치마크 계측을 시작했다. 더 넓은 장르의 장편 독자 패널 샘플은 필요하다. |
| 장편 일관성 | 98 | `consistency-verifier`의 character, timeline, setting, factual, plot logic 5-domain 검사를 `masterpiece-readiness`의 필수 `long-form-consistency` 영역으로 승격했다. `reviews/consistency-report.json`이 없거나 최소 3개 회차를 덮지 못하거나, 5개 domain coverage가 빠지거나, critical/major issue가 남으면 critical gap이 되고, minor issue도 major gap으로 남는다. 장편 생성에서 흔한 이름·외모·관계·요일·장소·세계 규칙·정보 획득 경로·인과 사슬 붕괴가 단일 회차 점수나 독자 평균 호감에 묻혀 98+ readiness를 통과하지 못하게 한다. 남은 과제는 실제 30화 이상 장기 run에서 consistency report source evidence를 지속 축적하는 것이다. |
| 원고 문장 품질 | 99 | summary prose, scene density, POV, narrative transportation, affective choice turn, 대화 서브텍스트, 대화 갈등, 목소리 분화, 설계어 노출, 문장 품질 gate에 더해 `prose-taste-gate`가 기능적 AI 보고체, 과잉 감각 밀도, 반복 신체 반응, 억지 비유, 감정 라벨링, 리스트형 독백, 연속 단문 끊어쓰기, 완충 인식 표현 과밀, 설계어 본문 노출, 사용자 금지 표현을 차단한다. `manuscript-character-voice-not-differentiated`는 이제 같은 대사를 반복하는 경우뿐 아니라 화자별 말투, 종결 리듬, 문장부호, 반응 전술, 담화 표지가 겹쳐 서로 바꿔 말해도 구분되지 않는 경우도 막는다. `manuscript-narrative-transportation-not-evidenced`는 사건 증거는 있지만 구체 공간/사물/행동, POV 감정 반응, 집중점이 인접 장면 문장에 결속되지 않는 원고를 막는다. `manuscript-affective-choice-turn-not-evidenced`는 감정 전환을 말하지만 그 감정 때문에 실제 선택, 행동, 관계 태도, 결과가 달라지지 않는 내부 독백형 원고를 막는다. `monotone-short-sentence-run`은 짧은 서술문이 기계적으로 이어지는 AI식 박자를 잡고, `hedged-perception-haze`는 듯했다/것 같았다/느껴졌다/어쩐지/묘하게 같은 완충 표현이 장면 판단을 흐리는 문체를 잡는다. 새로 `abstract-exposition-drift`, `cognitive-filtering-overload`, `nominalized-explanation-chain`, `translationese-formula-drift`, `connective-crutch-rhythm`, `comma-rhythm-overload`, `reporting-tail-summary`, `repeated-subject-rhythm`, `detached-camera-description`, `generic-omniscient-teaser`, `rhetorical-question-drift`가 추상 명사 설명 과다, 깨달았다/생각했다/알 수 있었다 같은 인식 필터 과다, 것/수 있었다/상태였다 같은 명사화 설명 반복, 에 의해/에 대하여/가지고 있다/위해 같은 번역투 공식 표현, 그리고/하지만/그 순간 같은 접속 부사 시작 반복, 쉼표 과밀, 사실/의미/상황을 보였다·드러났다로 닫는 보고식 종결, 같은 주어 반복 리듬, 정적 외부 카메라식 묘사와 시점 앵커 부족, 구체 장면 근거 없이 운명/시작/예고를 선언하는 전지적 티저, 행동 전환 없는 자문형 의문문 연쇄를 별도 문체 마찰로 기록한다. 각 문체 issue는 이제 가능한 경우 line, paragraph, sentence, target text, localization confidence를 보존하고, `StyleStageEvaluator`와 `apply-chapter-gate`의 `style-alignment` directive가 이 위치를 포함한다. `quality-oracle`은 이제 문장이 깨끗해도 고점 장면의 이미지, 주인공 시그니처 행동, 보상 쾌감, 장르 쾌감, 다음 화 압력이 약하면 기존 surgical directive 타입으로 재작성 지시를 만든다. `meta/style-guide.json`의 `prose_taste_profile`이 `apply-chapter-gate` 완료 판정까지 연결됐고, `run-prose-taste-benchmark`가 선호/비선호 샘플의 false positive/false negative와 누락 issue를 프로젝트 리포트로 저장한다. 이제 각 문체 샘플의 `reader_segment`를 보존하고 required segment coverage, dominant segment ratio, 세그먼트별 비선호 샘플 수를 계산해 한 취향군이 문체 기준을 지배하면 `readerSegmentRepresentativeness=narrow`와 `readyForStyleTuning=false`로 남긴다. 추가로 `calibration_split=holdout`과 usable disliked-prose holdout이 없으면 `readyForStyleTuning=false`로 남겨, 사용자가 거슬렸던 몇 개 개발 샘플에만 맞춘 과도한 문체 보정을 막는다. 비선호 문체 샘플은 `style_friction_annotations`로 독자가 실제로 거슬린 위치, 이유, reader segment, rewrite suggestion, issue code를 보존하고, 탐지는 맞아도 이 주석이 약하면 `styleTuningUsable=false`로 빠진다. 선호 문체 샘플도 `style_highlight_annotations`로 독자가 좋게 읽은 위치, 이유, 문체 quality, reader segment, transfer guidance를 보존하고, 하이라이트가 없거나 재현 지침이 약하면 `styleTuningUsable=false`로 빠진다. 추가로 `styleFingerprint`가 usable 선호/비선호 샘플의 문체 metric 평균 차이를 계산해, 금지 문구 하나만 외워 맞힌 세트처럼 실제 문체 지문 분리가 약한 경우 `weakStyleFingerprintCount`와 `readyForStyleTuning=false`를 남긴다. 남은 과제는 실제 사용자 샘플 수를 늘려 장르별·세그먼트별 기준을 더 보정하는 것이다. |
| 자동 루프 안전성 | 98 | Ralph state, gate persistence, recurring directive, rollback, build/integrity 검사가 강하다. `reader-response-calibration`으로 “통과했지만 재미없는 원고”를 사람 반응 기준으로 잡아낼 수 있고, usable 독자 패널 false positive는 `apply-chapter-gate`에서 `RETRY`로 차단된다. 추가로 `comparativePreferenceStatus`가 기준작/대안 원고 대비 blind pairwise 선호율을 남기므로, 절대 점수는 높지만 시장 기준 원고와 붙으면 밀리는 샘플을 threshold retuning 근거에서 분리할 수 있다. 이제 `series-retention-benchmark-report.json`도 현재 회차가 실패한 연속 샘플의 최신 회차이고 증거가 충분할 때만 완료 차단에 쓰인다. 증거가 충분한 `automated-false-positive`, `weak-reader-retention`, `reader-retention-drop`, `reader-funnel-drop`, `reader-hook-stall`, `repetitive-reward-pattern`, `repetitive-emotional-pattern`은 Ralph Loop를 멈추고, 미래 회차 리포트·짧은 시퀀스·독자 근거 부족은 hard block 대신 경고나 무시로 처리한다. |
| 에이전트/팀 오케스트레이션 | 98 | 역할 분리는 좋고 팀 기반 워크플로도 갖췄다. 품질 게이트가 켜진 팀은 `issue_policy`로 issue code 보존, `source_agent`, `evidence`, `directive`, 최고 심각도 병합, critical PASS 차단, pipeline retry 기점을 명시한다. `team-state.schema.json`에는 `execution_trace`, `failure_attribution`, `recovery_plan`이 추가되어 dispatch, handoff, validator issue, retry, block, error를 단계별로 보존하고, 결정적 실패 단계뿐 아니라 재실행 시작점, 보존할 trace prefix, 적용 directive, 성공 기준, 검증 명령까지 기록한다. `validation_conflicts`가 PASS/FAIL 분열, 심각도 이견, 15점 이상 점수 편차, 근거 누락, 지시/근거 충돌을 보존해 major/critical 소수 의견이 평균 점수에 묻히지 않게 한다. 이제 품질 게이트 팀은 `context_manifest`도 필수로 남겨 각 입력 파일, state, issue, directive, task output의 loaded/missing/stale/superseded 상태와 사용 agent를 기록하고, stale context는 `stale_context` failure attribution과 recovery plan으로 차단한다. 또한 `handoff_contracts`가 handoff trace마다 producer/consumer, required payloads, acceptance criteria, weakened payload를 기록하고, 필수 issue/directive/evidence가 다음 에이전트에게 약화되거나 누락되면 `handoff_acceptance_check`에서 `handoff_loss`로 PASS를 막는다. 실제 장시간 팀 run 데이터 축적은 아직 필요하다. |
| 회귀 방지 테스트 | 99 | masterpiece 테스트, CLI 테스트, integrity/build/test가 촘촘하다. 집필/검증 문서가 evaluator issue code 전체를 문서화하고, golden sample도 새 고점/공정한 말미 훅 기준을 통과하며, 장르 쾌감 false positive 테스트가 미스터리/로맨스/액션/스릴러/현대판타지/판타지 축으로 확장됐다. 문체 취향, 문체 프로젝트 benchmark CLI, engagement benchmark, 프로젝트 benchmark CLI, 독자 반응 캘리브레이션, 독자 패널 완료 차단도 독립 테스트로 들어갔다. 독자 패널 threshold retuning은 이제 `calibration_split=holdout` usable 샘플이 없으면 준비 완료가 되지 않아, 기준을 맞춘 개발 샘플에 과적합되는 위험도 별도 회귀 테스트로 막는다. 기준작 대비 blind pairwise 선호율도 `requireComparativePreferenceForTuning=true`일 때 약하면 `readyForGateTuning=false`가 되는 회귀 테스트로 막는다. 문체 취향 튜닝도 usable disliked-prose holdout 샘플이 없으면 준비 완료가 되지 않아, 사용자 문체 불호 샘플 몇 개에 게이트가 과보정되는 위험을 별도 회귀 테스트로 막는다. 회차 재미 게이트 튜닝도 usable holdout과 known-bad holdout이 없으면 `readyForGateTuning=false`라서, 재미없는 샘플 몇 개를 기준 맞춤용으로 반복 조정하는 위험을 별도 테스트로 막는다. 전제 매력 게이트 튜닝도 evidence-sufficient holdout과 known-bad holdout이 없으면 준비 완료가 되지 않아, 초반 기획 샘플 몇 개에 전제 평가가 과적합되는 위험을 별도 테스트로 막는다. 인물/관계 게이트 튜닝도 evidence-sufficient holdout과 known-flat holdout이 없으면 준비 완료가 되지 않아, 밋밋한 관계 장면 몇 개에 드라마 기준이 과적합되는 위험을 별도 테스트로 막는다. 장기 연재 게이트 튜닝도 evidence-sufficient holdout과 known-drop holdout이 없으면 준비 완료가 되지 않아, 반복 보상/중반 피로 샘플 몇 개에 유지력 기준이 과적합되는 위험을 별도 테스트로 막는다. |

장기 연재 지속력 98점은 이제 평균 반응 점수만 보지 않는다. `series-retention-benchmark`가 회차별 started/completed/continued/drop-off/skimmed funnel을 계산하고, `funnelEvidence`, `funnelPassed`, `funnelDropChapterCount`, `weakFunnelEvidenceChapterCount`를 저장한다. 따라서 자동 점수와 남은 독자 comment는 좋아도 다음 회차로 넘어가는 독자 비율이 무너지면 `reader-funnel-drop`으로 Ralph Loop가 멈추고, funnel count 자체가 없으면 threshold tuning 근거에서 제외된다.

자동 루프 안전성 98점도 같은 보강을 받았다. `apply-chapter-gate`는 evidence-sufficient `reader-funnel-drop`, `reader-hook-stall`, `repetitive-emotional-pattern`을 `weak-reader-retention`, `reader-retention-drop`, `repetitive-reward-pattern`과 같은 장기 연재 차단 사유로 취급하고, 실패 시 `series-retention-funnel`, `series-retention-hook-progress`, `emotional-arc-variety` revision directive로 최신 회차의 continuation/drop-off/skimming, 장기 훅 정체, 감정 말미 반복 문제를 퇴고 입력에 넘긴다.

## 99점까지 필요한 개선

1. **실전 벤치마크 세트**
   - 3~5개 장르별 샘플 프로젝트를 만들고, 각 프로젝트에서 초반 3화 원고까지 생성해 자동 평가 점수와 사람이 읽는 재미 평가를 비교한다.
   - 목표: 높은 자동 점수인데 재미없는 false positive를 줄인다.
   - 회차 재미 축은 `engagement-benchmark`와 `run-engagement-benchmark`로 labeled 회차/원고 샘플의 기대 통과 여부, 기대 issue code, 금지 issue code, 점수 범위, 장르와 `interest`/`suspense`/`beauty`/`amusement`/`genre-delight`/`next-click` 경로 커버리지를 프로젝트 단위로 측정하기 시작했다.
   - 필수 장르는 단순 존재 여부뿐 아니라 known-good/known-bad polarity coverage를 따로 계산한다. 한 장르에 통과 샘플만 있거나 실패 샘플만 있으면 benchmark report가 `missingRequiredPositiveGenres`/`missingRequiredNegativeGenres`로 보강 대상을 명시한다.
   - `required_series_length`와 `required_positive_series_length`를 지정하면 장르별 연속 회차 샘플과 known-good 연속 회차 샘플이 부족한지 `missingRequiredSeriesGenres`/`missingRequiredPositiveSeriesGenres`로 보고한다. 초반 3화 검증 부족을 사람이 기억해야 하는 TODO가 아니라 리포트 가능한 coverage gap으로 바꿨다.
   - 이제 `calibration_split`과 `splitCoverage`도 보존한다. usable holdout, usable known-bad holdout이 부족하면 `underSampledUsableHoldoutSamples`/`underSampledUsableFailingHoldoutSamples`가 남고, `readyForGateTuning=false`라서 회차 재미 게이트를 개발 샘플 통과율만 보고 조정하지 않는다.
   - 장기 연재 축은 `series-retention-benchmark`와 `run-series-retention-benchmark`로 연속 회차의 next-click, fatigue resistance, hook progress, reward variety, payoff satisfaction, novelty, emotional reset, confidence in payoff와 started/completed/continued/drop-off/skimmed funnel을 비교한다. 자동 장기 연재 점수는 높지만 독자 유지가 약한 `automated-false-positive`, 첫 회차 대비 마지막 회차 반응이 급락하는 `reader-retention-drop`, 남은 독자 평점은 높지만 시작 독자의 다음 회차 이동이 무너진 `reader-funnel-drop`, 같은 보상 시그니처가 반복되는 `repetitive-reward-pattern`, 같은 말미 감정 아크가 반복되는 `repetitive-emotional-pattern`을 별도 실패로 남긴다.
   - 이제 장기 연재 축도 `calibration_split`과 `splitCoverage`를 보존한다. evidence-sufficient holdout과 known-drop holdout이 부족하면 `underSampledUsableHoldoutSamples`/`underSampledUsableFailingHoldoutSamples`가 남고, `readyForGateTuning=false`라서 장기 연재 게이트를 개발 샘플 통과율만 보고 조정하지 않는다.
   - 전제 매력 축은 `premise-appeal-benchmark`와 `run-premise-appeal-benchmark`로 자동 전제 점수와 타깃 독자의 curiosity gap, novelty, protagonist investment, emotional pull, clarity, target fit, next chapter anticipation, would read 반응을 비교한다. 필수 장르와 타깃 독자별 known-good/known-bad polarity coverage도 따로 계산한다.
   - 이제 전제 매력 축도 `calibration_split`과 `splitCoverage`를 보존한다. evidence-sufficient holdout과 known-bad holdout이 부족하면 `underSampledUsableHoldoutSamples`/`underSampledUsableFailingHoldoutSamples`가 남고, `readyForGateTuning=false`라서 전제 설계 게이트를 개발 샘플 통과율만 보고 조정하지 않는다.
   - 인물/관계 축은 `character-relationship-benchmark`와 `run-character-relationship-benchmark`로 자동 드라마 점수와 타깃 독자의 protagonist agency, distinctive signature, vulnerability cost, character attachment, relationship tension, reciprocal pressure, subtext inference, turn consequence, next scene interest 반응을 비교한다. 필수 장르, 타깃 독자, 관계 유형별 known-investing/known-flat polarity coverage도 따로 계산한다.
   - 이제 인물/관계 축도 `calibration_split`과 `splitCoverage`를 보존한다. evidence-sufficient holdout과 known-flat holdout이 부족하면 `underSampledUsableHoldoutSamples`/`underSampledUsableFailingHoldoutSamples`가 남고, `readyForGateTuning=false`라서 인물/관계 게이트를 개발 샘플 통과율만 보고 조정하지 않는다.
   - 독자 패널 축도 `required_chapter_ranges`로 초반/중반/후반 같은 구간별 샘플과 usable 샘플을 따로 요구한다. 초반 독자 반응만 충분한데 중후반 피로도를 모르는 상태는 `underSampledRequiredChapterRanges`/`underSampledUsableRequiredChapterRanges`와 `missingRequiredChapterRangeGenres`로 남는다.
   - 문체 취향 축은 `prose-taste-benchmark`와 `run-prose-taste-benchmark`로 선호/비선호 샘플의 pass/fail, false positive, false negative, 누락된 기대 issue code, 점수 범위 이탈을 프로젝트 단위로 측정하기 시작했다. 이제 `calibration_split`, disliked-prose holdout coverage, `style_friction_annotations`, preferred-prose `style_highlight_annotations`까지 보존해 문체 gate tuning이 같은 개발 샘플에 과적합되는지와 선호 문체를 재현할 근거가 있는지 함께 드러낸다.
   - 독자 반응 축은 `reader-response-calibration`과 `calibrate-reader-response`로 자동 engagement 점수와 다음 화 클릭 의향, 몰입, 심상, 감정 반응, 인물 애착, 관계 투자도, 자발 장면 회상, 장면 긴장 추적, 서사 예측 변화, 회수 공정성의 오차를 프로젝트 단위로 측정하기 시작했다.
   - 이제 독자 반응 축은 기준작/대안 원고 대비 blind pairwise 선호율도 받는다. `require_comparative_preference`를 켜면 절대 평균 점수가 높아도 `comparativePreferenceStatus`가 strong이 아닌 샘플은 gate threshold retuning 준비 완료로 보지 않는다.

2. **독자 재미 캘리브레이션**
   - `engagement.score >= 90`이 실제로 “다음 화를 누르고 싶다”에 가까운지 검증한다.
   - `evaluateReaderResponseCalibration`은 자동 점수 과신(`auto-false-positive`), 자동 점수 과소평가(`auto-false-negative`), 과대/과소 추정, 독자 반응 약점 차원, 패널 신뢰도를 분리해 보고한다.
   - `reviews/reader-response/*.json`의 독자 설문 샘플을 `meta/quality-trend.json`과 연결해 `reviews/reader-response-calibration.json`으로 저장하는 CLI가 추가됐다.
   - `apply-chapter-gate`가 `reviews/reader-response-calibration.json`의 usable 샘플을 읽어 `auto-false-positive`, `auto-overestimate`, 약한 `next-click`을 최종 회차 완료 차단 사유로 반영한다.
   - `apply-chapter-gate`가 `reviews/series-retention-benchmark-report.json`도 읽어, 현재 회차가 실패한 연속 샘플의 최신 회차이고 독자 근거가 충분한 경우에만 `automated-false-positive`, `weak-reader-retention`, `reader-retention-drop`, `reader-funnel-drop`, `reader-hook-stall`, `repetitive-reward-pattern`, `repetitive-emotional-pattern`을 Ralph Loop `RETRY`로 연결한다.
   - 전제 단계에서는 `reviews/premise-appeal-benchmark/*.json`의 타깃 독자 샘플로 자동 전제 점수가 높지만 실제 독자가 첫 화를 누르고 싶어 하지 않는 `automated-false-positive`를 먼저 분리한다.
   - 인물/관계 단계에서는 `reviews/character-relationship-benchmark/*.json`의 타깃 독자 샘플로 관계 전환처럼 보이지만 실제 독자가 인물 결과나 다음 관계 장면을 신경 쓰지 않는 `automated-false-positive`를 분리한다.
   - 장기 연재 단계에서는 `reviews/series-retention-benchmark/*.json`의 연속 회차 샘플로 자동 점수는 높지만 독자가 후속 회차에서 피로하거나 반복 보상으로 이탈하는 `automated-false-positive`를 분리한다.
   - 독자 설문 차원에 `character_attachment`와 `relationship_investment`를 추가해 자동 점수는 높지만 독자가 인물 결과나 관계 전환을 신경 쓰지 않는 샘플을 별도 blind spot으로 남긴다.
   - 독자 설문 차원에 `novelty`, `surprise`, `resonance`, `scene_recall`도 추가해 자동 점수와 기본 재미 점수는 높지만 장면 처리나 보상 방식이 익숙하고, 발견이 예상 가능하며, 읽고 난 뒤 남는 잔향이나 기억되는 장면이 약한 generic-but-polished 샘플을 별도 blind spot으로 남긴다.
  - 독자 설문 evidence에 `comparative_preference_*` 필드를 추가해, 같은 독자군이 기준작/대안 원고와 나란히 읽었을 때 현재 원고를 실제로 더 선호하는지도 기록한다. 절대 점수는 높지만 비교 선호율이 낮은 샘플은 대작급 기준에서는 아직 경쟁력이 약한 샘플로 본다.
  - 패널 샘플은 `respondent_count`만 보지 않고 target reader 수, 타깃 독자 세그먼트 수, 가장 큰 세그먼트 비율, 시작 독자 수, 완독 수, 중도 이탈 수, 훑어읽기 수, 자유 코멘트 수, 장면/문단 마찰 지점 수, `friction_annotations`의 위치·원인·영향 차원·재작성 제안·reader segment, 자발 장면 회상 수, 특징적 장면 회상 수, `scene_recall_annotations`, 장면 긴장 추적 수, 고점 수, 질문/위험 추적 수, `tension_trace_annotations`, 예측 참여 수, 예측 다양성, 예측 수정 수, 예측 불일치 수, 예측 전환점 수, `narrative_forecast_annotations`를 `evidenceQuality`, `actionabilityScore`, `retentionEvidence`, `sceneRecallEvidence`, `tensionTraceEvidence`, `narrativeForecastEvidence`, `cohortRepresentativeness`로 분리한다. 숫자 카운트만 있는 샘플이나 완독자 평균만 있는 샘플은 참고용 독자 반응으로는 보존하지만 threshold retuning의 usable evidence로 세지 않는다. 또한 낮게 나온 reader-response dimension마다 같은 dimension의 actionable annotation이 없으면 `frictionAnnotationCoverage=partial/missing`으로, actionable annotation이 reader segment를 보존하지 않거나 한 독자군에 쏠리면 `frictionAnnotationRepresentativeness=unknown/narrow`로 남겨 threshold retuning의 usable evidence에서 제외한다. 추가로 표준편차와 고/중/저 반응자 분포로 `panelConsensus`를 계산하고, 표준편차와 응답자 수로 `readerScoreMarginOfError`와 `readerScoreConfidence`를 계산해 평균 점수만 높은 양극화 샘플이나 오차범위가 넓은 샘플을 threshold retuning에서 제외한다. 이제 `blind_reading`, `neutral_question_wording`, `response_option_order_randomized`, `sample_order_randomized`, `manuscript_order_counterbalanced`, `max_samples_per_respondent`, `order_balance_ratio`, `question_wording_disclosed`, `recruitment_method_disclosed`, `recruitment_channel_counts`, `attention_check_pass_count`, `excluded_response_count`로 `panelProtocolQuality`도 계산한다. 필수 모집 경로가 비거나 한 모집 경로가 과도하게 지배하거나 반복 원고 노출의 순서·피로 통제가 약한 표본은 점수가 높아도 source/order-skewed 패널로 보고 threshold retuning과 hard block에 쓰지 않는다. 근거가 약하거나 retention 근거가 약하거나 자발 장면 회상 근거가 약하거나 장면 긴장 추적 근거가 약하거나 서사 예측 근거가 약하거나 합의도가 낮거나 오차범위가 넓거나 한 코호트에 쏠리거나 조사 프로토콜이 약한 점수표는 threshold retuning과 hard block에 쓰지 않는다.
  - 최신 프로토콜 기준은 여기에 `author_identity_masked`, `prior_exposure_screened`, `unexcluded_prior_exposure_count`, `spoiler_exposure_screened`, `unexcluded_spoiler_exposure_count`를 추가로 요구한다. 작가/출처 단서, 기존 원고/이전 버전 노출, 시놉시스/스포일러 노출이 통제되지 않았거나 오염 응답이 남은 패널은 점수가 높아도 usable evidence로 세지 않는다.
  - `required_chapter_ranges`를 통해 초반 1-3화, 중반, 후반처럼 회차 구간별 reader response coverage를 따로 요구한다. 연재 장편의 중후반 피로도나 관계 투자 약화를 초반 반응으로 대체하지 않는다.
   - 샘플이 `readyForGateTuning`에 도달하면 `gateTuningSuggestions`가 false positive는 `tighten-automated-high-pass`, false negative는 `loosen-reader-loved-low-score-route`, 반복 blind spot은 `increase-reader-dimension-sensitivity`, 안정 구간은 `hold-current-gates`로 분리한다. 준비 부족 샘플은 `collect-more-reader-evidence`만 남겨 hard threshold를 성급히 바꾸지 않는다. 별도로 `evidenceCollectionPlan`은 인간 독자 provenance, response data quality, holdout, 장르/회차 coverage, comparative preference, revision outcome 같은 부족 항목을 우선순위가 있는 수집 작업으로 출력한다.
   - 구조적 보상은 있지만 독자가 결과를 바라게 만드는 욕망 압력이 약한 false positive는 `manuscript-reader-desire-not-evidenced`로 막기 시작했다.
   - 보상은 신선하지만 고점 쾌감이 약한 false positive는 `manuscript-payoff-delight-not-evidenced`로 막기 시작했다.
   - 보상은 감정명과 몸반응이 있어도 장르별 기대와 어긋나는 false positive를 `manuscript-genre-delight-not-evidenced`로 막기 시작했다. 미스터리는 단서 결합/추론/남는 의문, 로맨스는 거리 변화/취약한 대화/관계 선택, 액션은 추격 동선/전술 반전/신체 결과, 스릴러는 조여드는 위협/덫 확대/거짓 반전/강제 선택, 현대판타지는 시스템 피드백/스킬 활용/대가/현실 결과, 판타지는 규칙 발현/대가/경이 이미지/능력 변화를 요구한다.
   - 반전, 예상 뒤집힘, 오판, 가설 수정, 재해석을 약속했지만 원고에서 예측/가설/해석/계획/다음 검증 행동이 바뀌지 않는 false positive는 `manuscript-forecast-revision-not-evidenced`로 막기 시작했다.
   - 관계 변화는 상호 반응만으로 충분하지 않은 false positive를 `relationship-turning-point-not-staged`와 `manuscript-relationship-turning-point-not-evidenced`로 막기 시작했다. 약점 공개·비밀·사과·거절 같은 취약성/관계 위험, 상대의 선택/반응, 신뢰/불신/거리 변화, 즉시 달라진 행동 결과가 같은 장면 창에 있어야 한다.
   - 관계 전환점은 행동 결과만으로 충분하지 않은 false positive를 `relationship-mind-inference-not-staged`와 `manuscript-relationship-mind-inference-not-evidenced`로 막기 시작했다. 숨김, 오해, 진심, 망설임, 바뀐 속내가 시선, 침묵, 회피, 대화, POV 해석으로 읽혀야 한다.
   - 관계 전환점은 마음 단서가 있어도 상대가 독립된 압박을 갖지 않으면 얇아진다. `relationship-mutual-pressure-not-staged`와 `manuscript-relationship-mutual-pressure-not-evidenced`가 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험 없는 단순 도움/용서를 차단한다.
   - `engagement-benchmark`는 좋은 샘플이 과도하게 차단되는 false negative와 나쁜 샘플이 통과하는 false positive를 분리해 보고한다.
   - 장면 전환이 있음에도 밋밋한 경우는 `scene-state-delta-not-staged`로 일부 차단하기 시작했다.
   - 사건 결과가 있어도 주인공의 장면 목표와 전술 변화가 없으면 `scene-goal-tactic-turn-not-staged`로 차단하기 시작했다.
   - 남은 과제는 공정한 말미 훅이 실제 독자에게 충분히 강하지 않은 경우, 장면 아이디어의 체감 참신성, 장면 긴장 곡선의 실제 독자 trace, 그리고 장르별 긍정 샘플을 실제 패널 fixture로 확장하는 것이다.

3. **장면 신선도와 기억성 평가 강화**
   - `scene-novelty-matrix-not-staged`로 `reward_mode`, `conflict_mode`, `setting_mode`, `opposition_mode` 중 최소 3축 결합을 요구하기 시작했다.
   - `setting_mode`는 장소명만으로 통과하지 못하게 강화했다. 동선/차단물/거리 압박/잠긴 접근/우회/침투/탈출 같은 공간 affordance가 장면 갈등, 보상 전달, 반대세력 움직임 중 하나를 실제로 바꿔야 한다.
   - `scene-state-delta-not-staged`로 확인/발견/연결 같은 사건 단어가 있어도 장면 뒤 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나가 바뀌지 않으면 실패하게 했다.
   - `manuscript-scene-state-delta-not-evidenced`로 원고가 scene conflict/beat 키워드는 포함하지만 같은 장면 창 안에서 before 압박과 after 결과를 이어 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나를 실제로 바꾸지 않는 false positive를 차단하기 시작했다.
   - `manuscript-scene-novelty-matrix-not-evidenced`로 장면 신선도 매트릭스를 설계했지만 원고가 보상 전달 방식, 갈등/전술, 공간 제약, 반대세력 대응을 같은 장면 창에서 결합하지 못하고 사건 정보 설명으로 납작해지는 false positive를 차단하기 시작했다.
   - `scene-goal-tactic-turn-not-staged`로 장면 압박과 결과만 있고 주인공의 목표, 방해, 전술/전술 전환, 결과 변화가 결합되지 않은 기능적 사건 나열을 실패하게 했다.
   - `signature-scene-image-not-staged`와 `manuscript-signature-scene-image-not-evidenced`는 이제 기억 가능한 이미지가 서사 상태를 바꾸는 story-impact lift까지 요구한다.
   - 남은 과제는 장면 아이디어의 실제 참신성, 긴장 곡선, 이미지의 잔상 강도를 장르별 벤치마크 원고와 실제 독자 반응에 맞춰 더 정밀하게 캘리브레이션하는 것이다.

4. **플롯 단계 원고 실패 예방 강화**
   - `05-gen-plot`은 이미 `retention-plan-drift`, `opening-hook-not-evidenced`, `opening-hook-delayed`, `opening-hook-not-embodied`, `manuscript-reward-freshness-not-evidenced`, `manuscript-question-ladder-not-evidenced`, `manuscript-ending-hook-not-staged`, `manuscript-ending-hook-closed`를 플롯 단계 예방 항목으로 명시한다.
   - 남은 과제는 실제 장르별 플롯 fixture에서 이 예방 문구가 회차 설계 산출물의 장면 evidence로 충분히 이어지는지 확인하는 것이다.

5. **주관적 고점 평가자 추가**
   - `beta-reader`가 `high_point_assessment`로 “결함 없음”보다 “강한 장면/강한 욕망/강한 보상”을 별도 채점한다.
   - `quality-oracle`은 Masterpiece High-Point Pass로 문장 결함이 없어도 memorable scene lift, character appeal signature, payoff delight, genre-specific delight, next-click pressure가 약하면 surgical directive를 만든다.
   - 남은 과제는 이 5축 고점 평가를 실제 독자 패널의 “진짜 다음 화 클릭” 반응과 장르별 긍정/부정 fixture로 더 보정하는 것이다.

6. **문체 취향 캘리브레이션**
   - `prose-taste-gate`는 일반적인 AI 탐지기가 아니라, 실제 원고에서 독자가 거슬려할 산문 습관을 잡는 품질 게이트로 둔다.
   - 기본 게이트는 기능적 보고체, 과잉 감각 묘사, 반복 신체 반응, 강제 비유, 감정 라벨링, 완충 인식 표현 과밀, 리스트형 독백, 연속 단문 끊어쓰기, 추상 명사 설명 과다, 인식 필터 과다, 명사화 설명 반복, 번역투 공식 표현, 접속 부사 시작 반복, 쉼표 과밀, 사실/의미/상황을 보였다·드러났다로 닫는 보고식 종결, 같은 주어 반복, 정적 외부 카메라식 묘사와 시점 앵커 부족, 설계어 노출, 상투적 반응 beat 연쇄, 모호한 분위기 수식 연쇄, 자문형 의문문 연쇄, 구체 장면 근거 없이 운명/시작/예고를 선언하는 전지적 티저를 차단한다.
   - `style-guide.schema.json`과 `style-guide.template.json`에 `prose_taste_profile`을 추가했고, `apply-chapter-gate`가 이 프로필을 읽어 최종 회차 통과를 차단한다.
   - `monotone-short-sentence-run`은 대화가 아닌 짧은 서술문이 `max_short_sentence_run`보다 길게 이어질 때 실패한다. 빠른 웹소설 리듬은 허용치를 높일 수 있지만, 기본 모드는 단문 일부를 원인/대조/결과가 있는 중문·복문으로 묶도록 요구한다.
   - `hedged-perception-haze`는 `prose_taste_profile.max_hedged_perception_density_per_1000`보다 듯했다/것 같았다/느껴졌다/어쩐지/묘하게/희미하게 같은 완충 표현이 밀집할 때 실패한다. 해결 방향은 막연한 추정어를 늘리는 것이 아니라 물증, 선택, 틀린 판단의 결과를 장면 문장에 직접 세우는 것이다.
   - `detached-camera-description`은 `max_static_description_density_per_1000`보다 있었다/없었다/보였다 같은 정적 배경·사물 존재문이 많고 `min_viewpoint_anchor_density_per_1000`보다 인물 감각·판단·말투 앵커가 부족할 때 실패한다. 해결 방향은 배경 목록을 늘리는 것이 아니라 POV 인물이 실제로 본 순서, 오해한 판단, 감춘 반응, 달라진 행동으로 묘사를 묶는 것이다.
   - `generic-omniscient-teaser`는 `max_generic_teaser_density_per_1000`보다 “그는 아직 몰랐다”, “이것이 시작이었다”, “운명은 움직이고 있었다” 같은 전지적 티저가 반복될 때 실패한다. 해결 방향은 운명 선언을 늘리는 것이 아니라 물증, 선택 비용, 상대 반응, 다음 행동 압박을 장면 안에 남겨 독자가 직접 예감을 만들게 하는 것이다.
   - `stock-reaction-beat-chain`은 `max_stock_reaction_beat_density_per_1000`보다 숨 삼킴, 입술 깨묾, 시선 회피, 고개 숙임, 손 떨림, 주먹 쥠 같은 반응 beat가 많거나 `max_stock_reaction_beat_run`보다 길게 연쇄될 때 실패한다. 해결 방향은 신체 반응을 다른 신체 반응으로 바꾸는 것이 아니라 그 반응 때문에 숨긴 정보, 바뀐 선택, 불리해진 협상 조건, 새로 생긴 행동 압박을 장면에 세우는 것이다.
   - `vague-atmosphere-modifier-chain`은 `max_vague_atmosphere_modifier_density_per_1000`보다 묘한 공기, 알 수 없는 감각, 무거운 침묵, 낯선 긴장, 불길한 예감 같은 분위기 수식이 많거나 `max_vague_atmosphere_modifier_run`보다 길게 연쇄될 때 실패한다. 해결 방향은 분위기 형용사를 다른 분위기 형용사로 바꾸는 것이 아니라 구체 물건, 들리는 소리, 인물이 숨기거나 포기한 선택지, 관계 조건 변화, 장면 상태 변화를 세우는 것이다.
   - `filler-adverb-cadence`는 `max_filler_adverb_density_per_1000`보다 천천히/조용히/가만히/살짝/잠시/그대로 같은 완충 부사가 많거나 `max_filler_adverb_run`보다 길게 연쇄될 때 실패한다. 해결 방향은 부사를 다른 부사로 바꾸는 것이 아니라 동사, 물건의 변화, 선택 지연의 대가, 상대 반응으로 태도와 속도를 보이게 하는 것이다.
   - `rhetorical-question-drift`는 `max_rhetorical_question_density_per_1000`보다 왜/어떻게/정말/걸까 같은 자문형 의문문이 많거나 `max_rhetorical_question_run`보다 길게 연쇄될 때 실패한다. 해결 방향은 질문을 다른 질문으로 바꾸는 것이 아니라 확인 행동, 새 단서, 선택 비용, 상대 반응을 배치해 질문 뒤 장면 상태를 바꾸는 것이다.
   - `punctuation-emphasis-overload`는 `max_emphasis_punctuation_density_per_1000`보다 느낌표, `?!`, `!!`, 말줄임표 같은 강조 부호가 많거나 `max_emphasis_punctuation_run`보다 길게 연쇄될 때 실패한다. 해결 방향은 문장부호를 다른 문장부호로 바꾸는 것이 아니라 대사 내용, 행동 비트, 상대 반응, 선택 변화로 같은 감정과 침묵을 장면 안에 세우는 것이다.
   - `abstract-exposition-drift`, `cognitive-filtering-overload`, `comma-rhythm-overload`, `reporting-tail-summary`, `repeated-subject-rhythm`은 문장 자체가 틀리진 않아도 독자가 처리 중 멈추게 되는 문체 마찰을 분리한다. 각 기준은 `max_abstract_noun_density_per_1000`, `max_cognitive_filter_density_per_1000`, `max_comma_density_per_1000`, `max_reporting_tail_density_per_1000`, `max_repeated_subject_run`으로 프로젝트별 조정이 가능하다.
   - `prose-taste-benchmark`는 샘플별 기대 통과 여부, 기대 issue code, 점수 범위를 비교해 false positive/false negative를 명시적으로 보고한다.
   - `run-prose-taste-benchmark`는 `reviews/prose-taste-benchmark/*.json`을 읽고 `meta/style-guide.json`의 `prose_taste_profile`을 적용해 `reviews/prose-taste-benchmark-report.json`을 저장한다.
   - 문체 샘플은 `reader_segment`를 보존하고, `required_reader_segments`, `minimum_samples_per_reader_segment`, `minimum_failing_samples_per_reader_segment`, `maximum_dominant_reader_segment_ratio`로 취향 세그먼트 coverage를 확인한다. coverage가 좁으면 `readerSegmentRepresentativeness=narrow`와 `readyForStyleTuning=false`로 남겨 한 독자군의 거슬림만으로 전체 문체 기준을 과보정하지 않는다.
   - 문체 샘플은 이제 `styleFingerprint`도 계산한다. 선호/비선호 샘플의 기능 보고체, 감각/비유/완충 표현/추상 명사/인식 필터/명사화/번역투/접속 부사/쉼표/보고식 종결/시점 앵커/반복 리듬/상투적 반응 beat/모호한 분위기 수식/자문형 의문문/강조 문장부호/전지적 티저 밀도 metric이 실제로 갈라지지 않으면 `styleFingerprintStatus=weak`, `weakStyleFingerprintCount=1`, `readyForStyleTuning=false`로 남긴다. 즉 금지 문구 하나를 외워 맞힌 문체 게이트는 대작용 문체 튜닝 근거가 될 수 없다.
   - 99점 이상에서도 사용자별 `disliked_phrases`, 문체 모드(`plain`, `balanced`, `lyrical`, `webnovel-fast`), 감각/비유/신체반응/완충 인식/추상 설명/인식 필터/명사화 설명/번역투 공식 표현/접속 부사 시작/쉼표/보고식 종결/반복 주어/정적 묘사/시점 앵커/상투적 반응 beat/모호한 분위기 수식/자문형 의문문/강조 문장부호/전지적 티저 밀도 기준을 실제 선호 샘플로 계속 보정해야 한다.

## 리서치 반영 메모

- Narrative transportation 연구는 독자의 몰입을 인지적 집중, 정서 경험, 심상 형성이 함께 일어나는 상태로 본다. Green & Brock의 실험은 transportation을 imagery, affect, attentional focus가 결합된 흡수 상태로 정의했고, 최근 리뷰도 cognitive/emotional engagement와 mental image formation을 핵심으로 본다. 따라서 `manuscript-narrative-transportation-not-evidenced`는 사건 키워드가 있더라도 구체 공간/사물/행동, POV 감정 반응, 집중점이 인접 장면 문장에 결속되지 않으면 실패시킨다. 참고: [Green & Brock 2000](https://pubmed.ncbi.nlm.nih.gov/11079236/), [Green & Appel 2024](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf).
- 2026년 narrative depth 실험은 생생한 이미지와 주인공 감정/동기 요소가 story quality와 engagement에 어떤 영향을 주는지 분리해 보며, 최종적으로 transportation 경험이 관심 형성과 더 밀접하게 작동한다고 보고한다. 따라서 문체 게이트는 “이것이 시작이었다/운명이 움직였다” 같은 전지적 선언을 훅으로 착각하지 않고, 그 예감이 구체 이미지, 인물 동기, 선택 비용, 다음 행동 압박으로 체험되는지 요구한다. 참고: [What makes a good story?](https://jcom.sissa.it/article/pubid/JCOM_2503_2026_A06/), [Reader Engagement in Literary Fiction](https://aclanthology.org/2023.wnu-1.13/).
- 감정과 서사 수용 연구는 소설이 사건과 인물을 통해 감정을 유발하고 변형하며, fiction이 사회적 세계의 시뮬레이션으로 작동해 독자가 인물의 목표와 의도를 경험하게 만든다고 본다. 따라서 `manuscript-affective-choice-turn-not-evidenced`는 죄책감, 결심, 두려움, 안도 같은 감정명을 원고에 넣는 것만으로 통과시키지 않고, 그 감정이 선택/행동/관계 태도/구체 결과를 바꾸는 장면 증거를 요구한다. 참고: [Emotion and narrative fiction](https://pubmed.ncbi.nlm.nih.gov/21824023/), [The Function of Fiction](https://pubmed.ncbi.nlm.nih.gov/26158934/), [Reading Other Minds](https://www-2.rotman.utoronto.ca/facbios/file/Djikic%20et%20al..pdf).
- Story World Absorption Scale 계열 연구는 몰입을 attention, emotional engagement, mental imagery, transportation 차원으로 나누고 7점 척도 설문을 사용한다. `reader-response-calibration`은 이 네 축을 별도 독자 반응 입력으로 받고, `calibrate-reader-response`는 0-100 점수와 1-7 리커트 척도를 모두 처리한다.
- Transportation Scale Short Form은 narrative transportation을 주의, 심상, 정서, 결말을 알고 싶은 동기가 결합된 독자 상태로 측정한다. 또한 narrative engagement와 event memory 연구는 감정적으로 engaging한 순간이 독자 간에 동기화되고 이후 사건 회상과 연결된다고 본다. 따라서 `reader-response-calibration`은 이제 평균 호감 점수만 보지 않고 `scene_recall`, `unprompted_scene_recall_count`, `distinctive_scene_recall_count`, `scene_recall_annotations`를 받아 독자가 읽고 나서 자발적으로 떠올리는 장면이 있는지를 별도 evidence로 요구한다. 참고: [Transportation Scale Short Form](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/user_upload/Publikationen/Appel-_Gnambs-_Richter-_-_Green_-_TS-SF_-_PREPRINT.pdf), [UChicago narrative engagement and memory](https://news.uchicago.edu/story/emotion-stories-gets-our-attention-and-attention-affects-our-memories), [PNAS narrative engagement and event memory](https://www.pnas.org/doi/10.1073/pnas.2021905118).
- Narrative transportation과 word-of-mouth 연구는 독자가 인물에 공감하고 이야기 안에 몰입할수록 긍정 감정과 추천 의향이 함께 커질 수 있음을 보여준다. fiction book buying 연구와 온라인 서평 연구도 독자 간 추천과 리뷰가 책 발견·구매 행동에 영향을 준다고 본다. 따라서 `reader-response-calibration`은 이제 평균 호감이나 완독만 보지 않고 `recommendation_intent`, `organic_recommendation_count`, `discussion_prompt_count`, `advocacy_annotations`를 받아 독자가 실제로 어떤 장면을 누구에게 권하고 어떤 질문을 토론하고 싶은지 별도 evidence로 요구한다. 참고: [PLOS ONE narrative transportation and positive word-of-mouth](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0259420), [Narrative transportation systematic review](https://digitalcommons.odu.edu/marketing_pubs/27/), [Fiction Book Buying word-of-mouth study](https://repository.lincoln.ac.uk/articles/journal_contribution/Factors_impacting_Word-of-Mouth_efficacy_on_Fiction_Book_Buying/30840278), [NBER online book reviews and sales](https://www.nber.org/digest/may04/effect-word-mouth-sales-online-book-reviews).
- 독자 호감 연구는 같은 소설을 좋아하더라도 interest, suspense, beauty, amusement 같은 서로 다른 경로로 좋아할 수 있음을 보여준다. 따라서 캘리브레이션은 단일 “재미 점수”만 보지 않고 독자별/장르별 선호 경로를 분리할 수 있게 둔다.
- 서사 흡수 연구는 독자의 몰입을 attention, emotional engagement, mental imagery, transportation의 결합으로 보고, 주제/모티프 이론은 반복되는 사물·이미지·행동이 이야기 안에서 상징적 의미를 얻을 때 central idea를 강화한다고 본다. 따라서 `resonance_seed`는 추상 주제어가 아니라 독자가 머릿속에 다시 떠올릴 수 있는 구체 이미지여야 하며, 같은 창 안에서 감정 잔향, 의미 변화, 선택/관계/규칙/단서/되돌릴 수 없는 결과를 바꿔야 한다. 참고: [Story World Absorption Scale](https://culturalanalytics.org/article/id/877/), [Theme and motif](https://books.openbookpublishers.com/10.11647/obp.0187/ch7.xhtml).
- LongStoryEval 계열 장편 서사 평가 연구는 긴 원고 단위에서는 어떤 평가 측면이 독자에게 중요한지와 자동 평가가 인간 평가에 얼마나 정렬되는지가 핵심이라고 본다. 따라서 `run-engagement-benchmark`는 단일 회차 함수 호출이 아니라 프로젝트 파일에서 labeled 샘플을 읽고 리포트를 저장해 장기 축적과 비교가 가능하게 한다. serial cliffhanger 연구는 말미 미해결 자체가 계속 읽기 의향을 보장하지 않는다고 보므로, benchmark는 단일 말미 훅 샘플만 보지 않고 장르별 연속 회차 known-good coverage를 따로 보고한다.
- serial entertainment 연구는 cliffhanger가 각성은 높여도 enjoyment나 continue intention을 항상 높이지는 않는다고 보고했고, serial narrative 연구는 완전한 resolution 없이 이어지는 형식이 후속 동기를 만들 수 있음을 보여준다. 따라서 장기 연재 평가는 말미 미해결 여부가 아니라, 연속 회차에서 독자 next-click이 유지되는지, 피로가 누적되는지, 보상 패턴이 바뀌는지를 함께 봐야 한다. `series-retention-benchmark`는 이 근거를 next-click, fatigue resistance, hook progress, reward variety, payoff satisfaction, novelty, emotional reset, confidence in payoff와 retention drop/reward signature run으로 옮겼다. 참고: [The Role of Cliffhangers in Serial Entertainment](https://sonar.ch/global/documents/319990), [To Pause With a Cliffhanger or a Temporary Closure?](https://journals.sagepub.com/doi/abs/10.1177/00936502231166091).
- 실시간 suspense 측정 연구는 서스펜스가 unfolding storyline에서 생기며 독자 몰입, transportation, reading pleasure와 밀접하다고 본다. 따라서 장기 훅은 “아직 미스터리로 남았다”는 정체 언급이 아니라, 새 단서와 가설 변화로 기대를 계속 재조정해야 한다. 참고: [Measuring Suspense in Real Time](https://ssol-journal.com/articles/10.61645/ssol.182).
- narrative arc 연구는 전통적 서사가 staging, plot progression, cognitive tension의 변화를 가진다고 본다. 따라서 장기 훅 게이트는 장기 미스터리의 존재뿐 아니라 회차별 progression을 요구한다. 참고: [Computational extraction of narrative arcs in novels](https://www.science.org/doi/10.1126/sciadv.aba2196).
- suspense/uncertainty 연구는 불확실성이 항상 suspense가 아니며, curiosity와 anticipation도 구분해서 봐야 한다고 본다. 따라서 장기 훅이 단순 미해결 상태로만 남으면 충분하지 않고, 다음 검증 행동이나 위험 변화로 독자의 예상을 갱신해야 한다. 참고: [The Role of Uncertainty and Surprise in Suspense](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01392/full).
- suspense, curiosity, surprise 연구는 예상과 실제 사건의 불일치가 독자의 처리와 감상, 회상에 영향을 주고, 놀라움은 앞선 정보를 새 관점에서 재평가하게 만들 수 있다고 본다. ACL 2020 연구도 short story suspense 판단이 단순 위험 표식보다 uncertainty reduction과 더 잘 맞물린다고 보고한다. 따라서 반전이나 예상 뒤집힘을 쓰는 회차는 "뜻밖이었다"라는 감정 선언이 아니라 예상, 그 예상을 깨는 단서, 바뀐 가설/해석/계획/다음 검증 행동을 함께 보여야 하며, `manuscript-forecast-revision-not-evidenced`가 이 false positive를 막는다. 참고: [Suspense, curiosity, and surprise](https://www.researchgate.net/publication/222121244_Suspense_curiosity_and_surprise_How_discourse_structure_influences_the_affective_and_cognitive_processing_of_a_story), [Creating Suspense and Surprise in Short Literary Fiction](https://www.academia.edu/26536182/CREATING_SUSPENSE_AND_SURPRISE_IN_SHORT_LITERARY_FICTION_A_STYLISTIC_AND_NARRATOLOGICAL_APPROACH), [Suspense in Short Stories is Predicted By Uncertainty Reduction](https://aclanthology.org/2020.acl-main.161.pdf).
- cliffhanger 연구는 cliffhanger가 arousal을 만들 수 있지만 그 자체만으로 enjoyment나 계속 시청 의향이 보장되지는 않으며, 다른 연구는 suspense 해소 기대가 다음 installment로 이동하게 만든다고 본다. 따라서 다음 회차는 직전 말미 훅을 planning 어딘가에 두는 데서 끝내지 않고 opening scene과 원고 첫 두 문장 안에서 즉시 action/discovery/pressure/consequence로 이어받아야 한다. 참고: [The Role of Cliffhangers in Serial Entertainment](https://www.ovid.com/journals/popmed/abstract/10.1037/ppm0000392~the-role-of-cliffhangers-in-serial-entertainment-an), [UB study finds that cliffhangers keep audiences to be continued](https://www.buffalo.edu/ubnow/stories/2023/06/hahn-cliffhangers.html).
- information-gap 이론은 독자가 인식한 구체적 미해결 질문이 호기심과 정보 탐색 욕구를 만든다고 본다. 따라서 `reader_promise_contract`의 `core_hook`, `novelty_angle`, `irresistible_question`, `binge_reason`, `long_series_engine`, 초반 유지 비트가 서로 다른 소설의 구체 명사만 나열하면 독자의 정보 격차가 하나의 읽고 싶은 질문으로 모이지 않는다. `reader-promise-premise-not-integrated`는 구체적이지만 분열된 독자 약속을 설계 단계에서 막는다. 참고: [An Information-Gap Theory of Feelings About Uncertainty](https://www.cmu.edu/dietrich/sds/docs/golman/Information-Gap%20Theory%202016.pdf), [The Psychology of Curiosity](https://www.cmu.edu/dietrich/sds/docs/loewenstein/PsychofCuriosity.pdf).
- 독자 engagement 연구는 fiction engagement를 문장 단위 주석, eye tracking, 전체 engagement survey를 함께 봐야 하는 맥락적 현상으로 다룬다. 또 mental imagery 연구는 인물이 환경과 상호작용하는 enactive style이 독자의 심상 처리와 연결된다고 본다. 따라서 1화 첫 문장은 전제 이름을 빨리 말하는 것만으로 충분하지 않고, 첫 1~2문장 안에서 주인공 행동/선택 압박, 감각 또는 POV 앵커, 미해결 위험/질문이 결합되어야 한다. `opening-hook-not-embodied`는 전제어는 있지만 첫 화면이 설명문인 false positive를 막는다. 참고: [Reader Engagement in Literary Fiction](https://aclanthology.org/2023.wnu-1.13/), [Eye movements and mental imagery during reading](https://bop.unibe.ch/JEMR/article/view/JEMR.13.3.3).
- Narrative Engageability Scale 연구는 이야기 참여 성향을 presence, emotional engageability, suspense/curiosity, unrealism 수용 같은 차원으로 나눈다. 따라서 전제 자체도 자동 specificity 점수 하나로 충분하지 않고, 타깃 독자에게 curiosity gap, novelty, protagonist investment, emotional pull, clarity, target fit, next chapter anticipation, would read를 따로 물어야 한다. `premise-appeal-benchmark`는 자동 전제 점수가 높아도 타깃 독자가 읽고 싶지 않다고 반응하는 `automated-false-positive`를 설계 단계에서 드러낸다. 참고: [The Narrative Engageability Scale](https://ijoc.org/index.php/ijoc/article/view/8624), [Measuring Narrative Engagement](https://opus.bibliothek.uni-augsburg.de/opus4/files/39512/39512.pdf).
- 상황 모델 연구는 독자가 서사를 사건의 정신적 시뮬레이션으로 구성하고, 공간·시간·인물·인과·목표 변화가 표상을 갱신한다고 본다. 인기 서사의 narrative tension 연구도 suspense와 curiosity가 단순 미해결 정보가 아니라 기대, 지연, 가능한 해소를 통해 독자 참여를 만든다고 본다. 따라서 `manuscript-premise-engine-not-evidenced`는 `core_hook`과 `novelty_angle`이 이름표처럼 언급되는 것을 통과시키지 않고, 전제의 규칙·장치·조건·금기가 실제 선택, 전술, 위험, 다음 질문을 바꾸는 장면 증거를 요구한다. 참고: [Situation models in naturalistic comprehension](https://www.cambridge.org/core/books/abs/cognitive-neuroscience-of-natural-language-use/situation-models-in-naturalistic-comprehension/F6ACAC7779D9F8FC3EEF9E5C91843790), [A Novel Study: A Situation Model Analysis of Reading Times](https://memorylab.nd.edu/assets/258703/mcnerney_goodwin_radvansky_2011_discourse_processes_.pdf), [Narrative Interest in Patterns of Extended Engagement](https://atrium.lib.uoguelph.ca/bitstreams/3770f731-09b5-4e57-aa3b-4e214c6f78a3/download).
- serial cliffhanger 연구는 완전한 resolution 없이 끝나는 episode가 후속 engagement 동기를 높일 수 있음을 시사한다. 이 시스템은 그 동기가 미끼식 정체가 되지 않도록 `long-hook-thread-not-advanced`로 단서/가설/위험 변화가 있는 열린 루프만 인정한다. 참고: [PubMed: cliffhanger study](https://pubmed.ncbi.nlm.nih.gov/40575461/).
- generative writing benchmark 연구는 실제 글쓰기 평가에서 다양한 도메인/요구사항과 instance-specific criteria가 필요하며, static fluency/coherence 기준만으로는 창의적 글쓰기 품질을 충분히 보지 못한다고 본다. 따라서 engagement benchmark는 장르, 쾌감 경로, pass/fail polarity coverage를 따로 기록한다. 참고: [WritingBench: A Comprehensive Benchmark for Generative Writing](https://arxiv.org/html/2503.05244v1).
- story preference reward model 연구는 좋은 이야기/나쁜 이야기 preference pair와 human verification이 자동 평가 보정에 중요하다고 본다. 따라서 필수 장르마다 known-good과 known-bad 샘플을 모두 요구하는 polarity coverage를 추가했다. 참고: [StoryAlign: Evaluating and Training Reward Models for Story Generation](https://arxiv.org/html/2605.04831v1).
- creative writing 평가 연구는 open-ended narrative에는 정답이 없어서 인간 선호 pair가 중요한 감독 신호가 되며, LitBench는 human-labeled story comparison pair와 held-out test set으로 창작 검증기를 평가한다. 또 주관적 writing preference 연구는 객관 오류가 제거되면 일반 reward model과 zero-shot judge가 선호를 잘 못 잡고, 장르별 분산도 크다고 본다. 따라서 `reader-response-calibration`은 절대 평균 점수만 보지 않고, 기준작/대안 원고와의 blind pairwise 선호율을 `comparativePreferenceStatus`로 별도 기록하며, 필요하면 이 비교 선호도가 강하지 않은 샘플을 threshold retuning에서 제외한다. 참고: [LitBench](https://aclanthology.org/2026.eacl-long.362/), [Beyond Correctness: Evaluating Subjective Writing Preferences Across Cultures](https://arxiv.org/abs/2510.14616).
- 모델 평가 방법론은 같은 데이터로 기준을 맞추고 평가하면 과적합이 생기므로, 일부 데이터를 test/holdout으로 남겨야 한다고 본다. 창작 평가 벤치마크에서도 train corpus와 held-out/test pair를 분리해 선호 모델을 검증하는 방식이 쓰인다. 또한 data leakage가 있으면 평가 점수가 일반화 성능을 낙관적으로 보이게 만들 수 있으므로 split 뒤에는 test evidence가 tuning evidence에 섞이지 않았는지도 확인해야 한다. 따라서 `reader-response-calibration`은 `calibration_split`을 보존하고, 기본적으로 usable holdout 샘플이 없으면 hard threshold retuning을 준비 완료로 보지 않으며, tuning suggestion도 holdout에서 확인된 drift를 우선 근거로 삼는다. 같은 원칙으로 `prose-taste-benchmark`는 usable holdout과 disliked-prose holdout이 없으면 style gate tuning을 준비 완료로 보지 않고, 문체 원고 evidence fingerprint가 calibration/validation/holdout 사이에 중복되면 `splitLeakageCount`를 남기고 준비 완료를 막는다. `engagement-benchmark`도 usable holdout과 known-bad holdout이 없으면 회차 재미 gate tuning을 준비 완료로 보지 않으며, 원고/회차/플롯/설계 evidence fingerprint가 calibration/validation/holdout 사이에 중복되면 `splitLeakageCount`를 남기고 준비 완료를 막는다. `premise-appeal-benchmark`도 evidence-sufficient holdout과 known-bad premise holdout이 없으면 전제 설계 gate tuning을 준비 완료로 보지 않고, 전제 evidence fingerprint가 split 사이에 중복되면 `splitLeakageCount`로 차단한다. `character-relationship-benchmark`도 evidence-sufficient holdout과 known-flat drama holdout이 없으면 인물/관계 gate tuning을 준비 완료로 보지 않고, 인물/관계 focus evidence fingerprint 중복을 split leakage로 차단한다. `series-retention-benchmark`도 evidence-sufficient holdout과 known-drop series holdout이 없으면 장기 연재 gate tuning을 준비 완료로 보지 않고, 같은 회차 시퀀스 evidence fingerprint가 split 사이에 중복되면 준비 완료를 막는다. 참고: [scikit-learn cross-validation guide](https://scikit-learn.org/stable/modules/cross_validation.html), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html), [A Benchmark and Dataset for Reliable Evaluation of Creative Writing](https://aclanthology.org/2026.eacl-long.362.pdf).
- narrative planning 평가 연구는 causal soundness, character intentionality, dramatic conflict처럼 자동 검증 가능한 서사 속성도 장르/규모별 task set으로 나누어 봐야 한다고 본다. 따라서 장르별 벤치마크는 단순 평균 점수가 아니라 어떤 장르에 실패 샘플 검증이 비어 있는지까지 보고해야 한다. 참고: [Can LLMs Generate Good Stories? Insights and Challenges from a Narrative Planning Perspective](https://arxiv.org/html/2506.10161v1).
- LLM 서사 비교 연구는 인간 서사가 더 다양한 arc, 늦게 축적되는 setback/climax, 더 높은 suspense/arousal을 보이는 반면 LLM 산출물은 조기 해소와 평평한 긍정 arc로 흐르기 쉽다고 본다. 따라서 독자 약속 자체가 하나의 장기 전제 엔진으로 결합되어 있어야 이후 전환점, 긴장, 보상 설계가 흩어지지 않는다. 참고: [Are Large Language Models Capable of Generating Human-Level Narratives?](https://arxiv.org/html/2407.13248), [The Power of the Picture](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0144493).
- 최근 reader engagement 연구는 fiction engagement가 맥락적이고 개인차가 크며, 문장 단위 반응과 전체 engagement survey를 함께 수집할 필요가 있음을 강조한다. 이 시스템은 아직 eye-tracking 같은 생체 데이터는 쓰지 않지만, 점수표에 target reader coverage, completed read coverage, qualitative comment coverage, friction point annotation을 함께 기록해 숫자 반응을 재작성 가능한 근거로 바꾸기 시작했다.
- 독자 반응과 narrative engageability 연구는 독자의 몰입 성향, suspension/curiosity, 감정 참여가 개인차를 가지며 같은 텍스트도 독자군에 따라 갈릴 수 있다고 본다. 따라서 `reader-response-calibration`은 평균 독자 점수만 보지 않고 표준편차, 고/중/저 반응자 분포, `panelConsensus`를 기록해 양극화된 패널을 gate threshold retuning 근거에서 제외한다. 참고: [A measure of individual differences in readers' approaches to text](https://link.springer.com/article/10.3758/s13428-022-01852-1), [The Narrative Engageability Scale](https://ijoc.org/index.php/ijoc/article/view/8624), [An Analysis of Reader Engagement in Literary Fiction through Eye Tracking and Linguistic Features](https://aclanthology.org/2023.wnu-1.13.pdf).
- NIST와 ONS의 표본 평균 불확실성 설명은 평균의 신뢰구간/오차범위가 표준편차와 표본수에 의해 결정된다고 본다. 따라서 `reader-response-calibration`은 `reader_score_standard_deviation`과 `respondent_count`로 95% `readerScoreMarginOfError`를 계산하고, 오차범위가 넓은 `readerScoreConfidence !== "precise"` 샘플을 threshold retuning usable coverage에서 제외한다. 참고: [NIST Confidence Limits for the Mean](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm), [ONS Uncertainty and how we measure it for surveys](https://www.ons.gov.uk/methodology/methodologytopicsandstatisticalconcepts/uncertaintyandhowwemeasureit).
- 2025년 creative writing 선호 연구는 문학 품질이 단일 평균값이 아니라 텍스트 특징과 독자 평가 기준의 상호작용으로 나타나며, 독자 선호 벡터가 surface-focused/holistic 같은 프로필로 갈릴 수 있다고 본다. LiteraryTaste도 stated preference만으로는 revealed preference를 충분히 모델링하지 못하고 개인 취향 차이가 크다고 보고한다. 따라서 `reader-response-calibration`은 `target_reader_segment_count`와 `dominant_reader_segment_ratio`로 `cohortRepresentativeness`를 기록해 한 독자군에 쏠린 패널이 threshold retuning 근거로 쓰이지 않게 한다. 추가로 `friction_annotations.reader_segment`와 `frictionAnnotationRepresentativeness`를 분리해, 패널은 넓어도 실제 퇴고 지시가 한 독자군 주석에만 기대는 샘플을 usable evidence에서 제외한다. 같은 이유로 `prose-taste-benchmark`도 선호/비선호 문체 샘플에 `reader_segment`를 요구하고, 세그먼트 coverage와 dominant ratio가 부족하면 `readyForStyleTuning=false`로 남겨 사용자가 거슬린다고 느낀 문체 기준이 한 취향군의 우연한 반응으로 과보정되지 않게 한다. 참고: [The Reader is the Metric](https://aclanthology.org/2025.findings-acl.1304.pdf), [LiteraryTaste](https://arxiv.org/abs/2511.09310).
- AAPOR의 survey quality 기준은 coverage error, measurement effect, nonresponse effect를 핵심 오류원으로 보고, response rate만으로 품질을 판단하기보다 다른 품질 지표와 함께 보고해야 한다고 본다. 따라서 독자 패널은 respondent 수만으로 usable이 되지 않고, 타깃 독자 비율, 코호트 대표성, 완독, 자유 코멘트, 마찰 지점, 합의도까지 함께 통과해야 한다. 참고: [AAPOR Standard Definitions](https://aapor.org/standards-and-ethics/standard-definitions/), [AAPOR Response Rates](https://aapor.org/response-rates/).
- AAPOR survey best practices와 disclosure standards는 문항 순서/응답지 순서 효과, 중립적 문항 wording, 정확한 문항·응답지·지시문 공개, 모집 방식 공개가 설문 해석에 중요하다고 본다. 반복 측정/within-subjects 설계 자료는 같은 참여자가 여러 조건을 볼 때 order, carryover, fatigue, context effects가 생길 수 있으므로 randomization/counterbalancing이 필요하다고 정리한다. ESOMAR의 online sample buyer questions도 sample sources와 recruitment를 별도 검토 영역으로 두며, Pew의 online opt-in sample 비교 연구는 opt-in 표본이 확률 기반 패널보다 평균 오차와 하위집단 오차가 커질 수 있음을 보여준다. 따라서 `reader-response-calibration`은 독자 패널 점수가 높거나 낮아도 `blind_reading`, `author_identity_masked`, `prior_exposure_screened`, `unexcluded_prior_exposure_count`, `spoiler_exposure_screened`, `unexcluded_spoiler_exposure_count`, `neutral_question_wording`, `response_option_order_randomized`, `sample_order_randomized`, `manuscript_order_counterbalanced`, `max_samples_per_respondent`, `order_balance_ratio`, `question_wording_disclosed`, `recruitment_method_disclosed`, `recruitment_channel_counts`, `attention_check_pass_count`, `excluded_response_count`가 확인되지 않거나 필수 모집 경로가 비거나 반복 원고 노출 통제가 약하거나 기존 노출/스포일러 오염 응답이 남아 있으면 `panelProtocolQuality !== "strong"`으로 남겨 threshold retuning usable coverage에서 제외한다. 참고: [AAPOR Best Practices for Survey Research](https://aapor.org/standards-and-ethics/best-practices/), [AAPOR Disclosure Standards](https://aapor.org/standards-and-ethics/disclosure-standards/), [ESOMAR 28 Questions to Help Buyers of Online Samples](https://shop.esomar.org/what-we-do/code-guidelines/28-questions-to-help-buyers-of-online-samples), [Pew Comparing Two Types of Online Survey Samples](https://www.pewresearch.org/methods/2023/09/07/comparing-two-types-of-online-survey-samples/), [Research Methods in Psychology: Experimental Design](https://opentextbooks.rug.nl/rspremsc/chapter/experimental-design/), [Scribbr Within-Subjects Design](https://www.scribbr.com/methodology/within-subjects-design/).
- 온라인 독서 engagement 연구는 독자 반응을 전체 설문만으로 보지 않고, 과제 수행 과정의 log file과 adaptive navigation/access behavior를 함께 분석해야 한다고 본다. 또한 A/B 테스트 운영 연구는 sample ratio mismatch가 보이면 원인을 진단하기 전 결과를 신뢰하지 말아야 하며, 누락된 사용자가 실험에 가장 크게 영향받은 집단일 수 있다고 경고한다. 따라서 `reader-response-calibration`은 다음 회차 클릭 의향과 별도로 `next_chapter_cta_impression_count`, `next_chapter_click_count`, `next_chapter_open_count`, `next_chapter_read_start_count`를 요구하고, 행동 수집 자체도 source evidence와 panel protocol 검토의 대상에 둔다. 참고: [Online Reading Engagement](https://www.pedocs.de/volltexte/2019/17974/pdf/Naumann_OnlineReadingEngagement_CHB_A.pdf), [Microsoft Research SRM diagnosis](https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/).
- Narrative Engagement Scale 연구는 몰입을 narrative understanding, attentional focus, emotional engagement, narrative presence로 나누며, 각 하위 차원이 enjoyment와 별도로 관련될 수 있음을 보여준다. 따라서 `beta-reader`의 고점 평가는 총점 하나가 아니라 기억 장면, 인물 매력, 보상 쾌감, 장르 쾌감, 다음 화 압력을 분리해 90점대 판정의 근거로 삼는다. 참고: [Measuring Narrative Engagement](https://opus.bibliothek.uni-augsburg.de/opus4/files/39512/39512.pdf).
- 2023년 ACL reader engagement 연구는 fiction engagement가 독자 맥락과 문장 단위 정서/valence/arousal 반응의 영향을 함께 받으며, highly engaged reader의 패턴을 따로 보는 것이 중요하다고 본다. 또한 sentence-level 주석에 character와 연결되거나 동일시하고 감정을 느끼는 `Connected` 범주를 둔다. 따라서 `high_point_assessment`는 단순 결함 없음이 아니라 hooks, emotional beats, reader questions와 연결되는 고점 증거를 요구한다. `reader-response-calibration`도 한두 개 점수표로 threshold를 바꾸지 않고, 필수 장르와 연속 회차 coverage가 충분한 usable 패널 샘플만 gate tuning 근거로 본다. 참고: [An Analysis of Reader Engagement in Literary Fiction through Eye Tracking and Linguistic Features](https://aclanthology.org/2023.wnu-1.13.pdf).
- 같은 연구는 전체 engagement survey와 sentence-level annotation을 함께 수집했고, 향후 각 문장에 `none`을 포함한 범주를 선택하게 하면 annotation sparsity를 줄일 수 있다고 제안한다. 따라서 `reader-response-calibration`은 이제 점수와 카운트만 받지 않고 `friction_annotations`로 location, dimension, reason, rewrite_suggestion, reader_segment를 요구하며, 이 구조화된 독자 마찰을 `apply-chapter-gate`의 `Reader Response Revision Directives`로 직접 전달한다.
- 최근 story generation survey는 피드백 모델을 통한 단계적 생성이 더 engaging/interesting한 story를 만들 수 있다고 정리하고, 창의적 short story 평가 연구는 novelty, surprise, diversity 같은 차원을 따로 평가한다. 2026년 story generation creativity framework도 reference-based metric만으로는 주관적 창의성을 포착하기 어렵고, Novelty, Value, Adherence, Resonance를 나눠 평가해야 하며 115명 규모 crowdsourced reader study에서 즉시 판단과 반성적 판단이 달라질 수 있다고 본다. 따라서 독자 패널 캘리브레이션은 총점 보정만 하지 않고, false positive/false negative와 약한 reader dimension별 gate tuning suggestion을 evidence sample id로 남기며, `novelty`/`surprise`/`resonance`를 별도 blind spot으로 받는다. 참고: [A Survey on LLMs for Story Generation](https://aclanthology.org/2025.findings-emnlp.750.pdf), [Evaluating Creative Short Story Generation in Humans and Large Language Models](https://arxiv.org/html/2411.02316v4), [Evaluation Framework for AI Creativity](https://arxiv.org/abs/2601.03698).
- sentence-level feedback와 local revision 관점에서는 총점보다 어느 문장/문단을 고쳐야 하는지 드러나는 피드백이 실제 재작성에 더 중요하다. 따라서 `prose-taste-gate`는 문체 issue에 line, paragraph, paragraph-local sentence, target text, localization confidence를 붙이고, 연속 단문이나 반복 주어처럼 정규식 위치가 없던 리듬형 issue도 evidence에서 원고 위치를 역추적한다. 참고: [An Analysis of Reader Engagement in Literary Fiction through Eye Tracking and Linguistic Features](https://aclanthology.org/2023.wnu-1.13.pdf), [Wittenberg Revision: local revision](https://www.wittenberg.edu/academics/english/writing-resources-revision).
- narrative transportation 연구는 몰입이 독자 개인차, 상황, 이야기 요소의 영향을 함께 받는 경험 상태라고 본다. binge-watching 연구도 연속 노출에서 narrative transportation과 parasocial relationship 강도가 달라질 수 있음을 보인다. 따라서 독자 반응 calibration은 초반 한 구간만 보지 않고 `required_chapter_ranges`로 초반/중반/후반 패널 coverage를 요구한다. 참고: [Narrative transportation systematic review](https://onlinelibrary.wiley.com/doi/10.1002/mar.22011), [An Experimental Examination of Binge Watching and Narrative Engagement](https://digitalcommons.trinity.edu/comm_faculty/54/).
- 문체/문학 수용 연구는 텍스트 요소만으로 독자 반응을 단정하기 어렵고, 독자 맥락과 실제 반응 수집이 함께 필요하다고 본다. 따라서 문체 평가는 단일 절대 규칙이 아니라 `prose_taste_profile`과 labeled 선호/비선호 샘플 benchmark로 누적 보정한다.
- 최근 creative writing 평가 연구는 문학적 문체 판단이 본질적으로 주관적이며 저자/AI attribution label만으로 평가 기준이 뒤집힐 수 있다고 보고한다. 또한 divergent creativity 연구는 창작 텍스트의 반복 substring과 구조적 다양성을 Lempel-Ziv complexity 같은 보조 지표로 본다. 따라서 `rote-dialogue-response-chain`은 “AI가 썼는지”를 판별하지 않고, 실제 원고에서 네/그래/알겠어/맞아 같은 짧은 응답이 연쇄되어 독자가 기계적 대화로 느낄 수 있는 반복 리듬만 프로젝트 threshold로 차단한다. 참고: [Everyone prefers human writers, including AI](https://arxiv.org/html/2510.08831v1), [Divergent creativity in humans and large language models](https://www.nature.com/articles/s41598-025-25157-3).
- 시점 밀착도 연구와 작법 논의는 free indirect discourse가 인물의 주관성, 정서적 색채, 지시어, 판단, 말투를 서술에 섞어 몰입과 공감을 높일 수 있고, psychic distance가 멀어지면 독자가 외부 카메라처럼 장면을 받게 된다고 본다. 따라서 `detached-camera-description`은 있었다/없었다/보였다 같은 정적 목록 묘사가 많으면서 인물 감각·판단·말투 앵커가 부족한 문단을 문체 마찰로 기록한다. 참고: [Oxford Research Encyclopedia: Free Indirect Discourse](https://oxfordre.com/view/10.1093/acrefore/9780190201098.001.0001/acrefore-9780190201098-e-1020), [BYU Editing Research: Viewpoint Markers](https://editingresearch.byu.edu/2025/11/26/who-says-how-viewpoint-markers-affect-narrative-perception/), [Storm Writing School: Psychic Distance](https://stormwritingschool.com/psychic-distance/), [Emma Darwin: Psychic Distance](https://emmadarwin.substack.com/p/psychic-distance-what-it-is-and-how), [Suzanne Keen: A Theory of Narrative Empathy](https://english.as.uky.edu/sites/default/files/zunshineTheory%20of%20Narrative%20Empathy.pdf).
- 소설 readability 연구는 문장 길이, 어휘 복잡도, readability가 장르문학/대중적 수용과 무관하지 않지만 문학적 평가와 동일하지는 않음을 보여준다. 따라서 `prose-taste-gate`는 난이도 점수 하나가 아니라 기능 보고체, 반복 구조, 과잉 감각/비유 밀도 같은 재작성 가능한 실패 축으로 둔다.
- 처리 유창성 연구는 독자가 대상을 더 쉽게 처리할수록 미적 반응이 긍정적으로 바뀔 수 있다고 본다. 또한 독서 중 mental imagery 연구는 서술이 장면을 행동·감각으로 떠올리게 만들 때 독자 경험이 달라질 수 있음을 보여준다. 따라서 문체 게이트는 문법 오류만 보지 않고, 추상어·인식 필터·쉼표·보고식 종결·반복 주어가 누적되어 독자가 장면을 다시 조립해야 하는 문체 마찰도 검사한다. `reporting-tail-summary`는 `사실이 보였다`, `점이 드러났다`, `상황이 정리됐다`처럼 결론을 문장 끝에서 보고해 물증·반응·행동으로 독자가 직접 도달할 장면을 요약문으로 바꾸는 습관을 분리한다. 참고: [Processing Fluency and Aesthetic Pleasure](https://dornsife.usc.edu/norbert-schwarz/wp-content/uploads/sites/231/2023/11/04_pspr_reber_et_al_beauty.pdf), [Eye Movements and Mental Imagery During Reading](https://pmc.ncbi.nlm.nih.gov/articles/PMC7886417/).
- 같은 근거에서 `offscreen-resolution-summary`는 결정적 폭로·해결·체포·구출이 "조사 끝에/결국/며칠 뒤" 같은 사후 요약으로 처리되어 독자가 고점 사건을 심상, 선택, 충돌, 즉시 달라진 행동으로 체험하지 못하는 문체 결손을 분리한다. 문법 교정보다 장면화 복구가 우선이므로, 실패 directive는 시간 점프 뒤 결과 보고를 단서 확인, 선택 압박, 폭로 순간, 결과 반응이 있는 현재 장면으로 되돌리게 한다.
- 국립국어원 문장 부호 해설은 쉼표가 반드시 필요한 자리가 아니더라도 특별한 효과나 두드러짐을 위해 선택적으로 쓰일 수 있다고 설명한다. 한글문화연대의 번역투 정리도 피동형, 에 의해/에 대하여/가지다/위해/에 있어서 같은 표현이 반복되면 문장이 길어지고 글의 힘이 약해진다고 본다. 따라서 `prose-taste-gate`는 문법적으로 가능한 표현을 전면 금지하지 않고, 밀도가 높을 때만 `nominalized-explanation-chain`, `translationese-formula-drift`, `connective-crutch-rhythm`으로 기록해 프로젝트별 threshold로 조정하게 한다. 참고: [국립국어원 쉼표 답변](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=325901), [한글문화연대 번역투 정리](https://www.urimal.org/4544).
- 국립국어원 문장 부호 해설은 느낌표와 줄임표가 감정, 놀람, 말 없음, 머뭇거림 같은 효과를 표시할 수 있음을 설명한다. Chicago Manual of Style도 인용문 안의 종결 부호는 의미와 문맥에 맞춰 다뤄야 한다고 본다. 따라서 `punctuation-emphasis-overload`는 느낌표나 말줄임표 자체를 금지하지 않고, 문장부호가 대사 내용·행동 비트·상대 반응 대신 감정과 침묵을 떠맡을 정도로 과밀하거나 연속될 때만 문체 마찰로 기록한다. 참고: [국립국어원 문장 부호 해설](https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=431&mn_id=46), [Chicago Manual Q&A: quotations](https://www.chicagomanualofstyle.org/qanda/data/faq/topics/Quotations/faq0077.html).
- 한국어 LLM-generated text 연구는 한국어가 형태·통사 특성과 쉼표 사용 패턴 때문에 영어권 탐지 기준을 그대로 쓰기 어렵고, spacing, POS combinations, punctuation을 한국어 특화 특징으로 본다. 따라서 `comma-rhythm-overload`는 일반 AI 탐지 목적이 아니라 한국어 산문 호흡의 거슬림을 프로젝트별 threshold로 보정하는 장치로 둔다. 참고: [Detecting LLM-Generated Korean Text through Linguistic Feature Analysis](https://arxiv.org/html/2503.00032v3).
- AI 창작문 stylometry 연구는 LLM 산출물이 인간 창작문보다 더 균일하게 군집하며, 스타일은 단어 빈도뿐 아니라 문장 길이, 구문 구조, 문장부호 패턴 같은 측정 가능한 특징으로도 드러난다고 본다. 또한 고품질 문학 산문 연구는 효과가 문장별 구문 선택, 종속절 축적, 이미지와 추상의 전환 같은 sentence-level 판단에서 나온다고 본다. 따라서 `monotone-short-sentence-run`은 짧은 문장을 전부 금지하지 않고, 연속 단문이 기계적 박자로 굳어지는 경우만 `max_short_sentence_run`으로 차단한다. `hedged-perception-haze`도 AI식 균일성을 작가 판별용으로 쓰지 않고, 장면 판단을 흐리는 재작성 가능한 습관으로만 다룬다. 같은 이유로 `styleFingerprint`는 원고가 AI인지 판별하지 않고, 선호/비선호 문체 샘플이 실제 문체 metric 분포에서 갈라지는지 확인해 금지 문구 암기식 튜닝을 막는 용도로만 쓴다. 참고: [Stylometric comparisons of human versus AI-generated creative writing](https://www.nature.com/articles/s41599-025-05986-3), [Can Good Writing Be Generative?](https://arxiv.org/html/2601.18353v1).
- Curiosity 연구는 질문이 정보 공백을 드러내 독자의 알고 싶은 욕구를 만들 수 있다고 보지만, 설득/처리 연구에서 rhetorical question은 관련성과 논지 강도에 따라 사고를 돕거나 방해할 수 있고, 서사는 인물·장면·갈등·미해결 질문·해결을 cohesive하게 조직할 때 처리 유창성이 높아진다. 따라서 `rhetorical-question-drift`는 질문 자체를 금지하지 않고, 질문이 행동, 단서, 선택 비용, 상대 반응 없이 과밀하게 이어져 curiosity gap을 갚지 못하는 경우만 차단한다. 참고: [Loewenstein Curiosity](https://www.cmu.edu/dietrich/sds/docs/loewenstein/Curiosity_IntlHandbookEmotEduc.pdf), [Effects of rhetorical questions on persuasion](https://www.researchgate.net/publication/232475917_Effects_of_rhetorical_questions_on_persuasion_A_cognitive_response_analysis), [Narratives are Persuasive Because They are Easier to Understand](https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2021.719615/full).
- Curiosity의 information-gap 관점은 흥미가 모르는 것 자체가 아니라 알고 싶은 공백의 지각에서 생긴다고 본다. Narrative transportation 연구는 독자의 주의, 정서, 심상이 이야기 사건에 붙을 때 몰입이 강해진다고 보고, 서사 인과 coherence 연구는 사건들이 원인·결과 사슬로 연결될 때 이해와 기억이 강해진다고 본다. 따라서 `series-retention-benchmark`는 독자 `hook_progress` 평점만 보지 않고 회차별 hook ledger에서 열린 질문이 advanced/resolved/recontextualized 되었는지, 또는 stalled 되었는지 기록하게 했다. 참고: [Loewenstein, The Psychology of Curiosity](https://www.cmu.edu/dietrich/sds/docs/loewenstein/PsychofCuriosity.pdf), [Green & Appel, Narrative Transportation](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf), [Trabasso & van den Broek, Causal thinking and the representation of narrative events](https://cs.uky.edu/~sgware/reading/papers/trabassovandenbroek1985causal.pdf).
- reader-response와 close-reading 계열 관점은 독자 경험과 텍스트의 구체 지점이 함께 해석되어야 한다고 본다. 또한 AI 창작문 stylometry 연구는 LLM 산문이 통계적으로 더 균일한 문체 군집을 보일 수 있으나, 연구자도 자동 판별을 과잉 해석하지 말고 질적 대표 텍스트 분석을 함께 보아야 한다고 경고한다. 따라서 `prose-taste-benchmark`는 “AI가 쓴 문장인지”를 판단하지 않고, 비선호 샘플의 `style_friction_annotations`에 독자가 실제로 걸린 위치, 이유, issue code, reader segment, rewrite suggestion을 남겨 문체 튜닝 근거가 재작성 가능한 close-reading 증거인지 확인한다. 참고: [Reader-Response Theory](https://human.libretexts.org/Bookshelves/Literature_and_Literacy/Literacy_and_Critical_Thinking/Creating_Literary_Analysis/06%3A_Writing_about_Readers_-_Applying_Reader-Response_Theory), [Stylometric comparisons of human versus AI-generated creative writing](https://www.nature.com/articles/s41599-025-05986-3).
- 문학적 전경화와 미적 독서 연구는 언어적 장치가 독자의 주목, 정서 반응, 미적 태도에 영향을 줄 수 있음을 보여준다. 따라서 선호 문체 샘플도 단순 pass/fail이나 평균 점수만 남기지 않고, 독자가 실제로 좋게 읽은 위치와 그 장치를 다음 장면에 옮길 `transfer_guidance`를 `style_highlight_annotations`로 남긴다. 참고: [Miall & Kuiken, Foregrounding, defamiliarization, and affect](https://sites.ualberta.ca/~dmiall/MiallPub/Miall_Kuiken_Foregrounding_1994.pdf), [Determinants of the Aesthetic Attitude During Reading](https://kar.kent.ac.uk/94849/3/AcceptedManuscript.pdf), [Green & Appel, Narrative Transportation](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf).
- Writer-Based prose 연구는 글이 작가 머릿속 코드와 사적 흐름에 머물면 독자가 필요한 맥락을 직접 복원해야 하고, 효과적인 글은 독자 목적에 맞게 변환되어야 한다고 본다. 따라서 `hedged-perception-haze`는 듯했다/것 같았다/느껴졌다 같은 완충어 자체를 금지하지 않고, 밀집될 때 독자가 장면의 물증, 판단, 결과를 복원해야 하는 상태로 본다. 참고: [Writer-Based Prose: A Cognitive Basis for Problems in Writing](https://mwover.com/wp-content/uploads/2018/05/flower-writer-based-prose.pdf).
- AI 텍스트 탐지기는 오탐/누락 위험이 있으므로, 이 시스템은 “AI가 썼는지”를 판정하지 않고 “이 원고가 독자에게 거슬리는 산문 습관을 보이는지”만 검사한다.
- Event Memory Theory와 event segmentation 연구는 독자가 서사를 연속 문장이 아니라 의미 있는 사건 단위로 나누고, 인물·목표·공간·시간·인과 변화가 경계와 기억을 만든다고 본다. 따라서 시그니처 장면 이미지는 “예쁜 묘사”가 아니라 선택 비용, 규칙 변화, 단서 재해석, 관계/정체성 변화, 되돌릴 수 없는 결과 같은 사건 상태 변화를 같은 1~2문장 안에 묶도록 강화했다. 참고: [Event Memory: A Theory of Memory for Laboratory, Autobiographical, and Fictional Events](https://pmc.ncbi.nlm.nih.gov/articles/PMC4295926/), [Discovering event structure in continuous narrative perception and memory](https://pmc.ncbi.nlm.nih.gov/articles/PMC5558154/).
- 장면 전환의 핵심은 단순 사건 단어가 아니라 상황 모델 업데이트다. 읽기/영화 이해 실험은 인물, 장소, 사물 상호작용, 목표 변화가 event segmentation과 관련되고, event-indexing model은 시간, 공간, 인물, 목표, 원인 변화에서 독자 표상이 갱신된다고 본다. 따라서 `scene-state-delta-not-staged`는 확인/발견/연결 표현만으로는 통과시키지 않고 독자 지식, 위험, 관계 상태, 선택지 잠금, 세계 규칙, 다음 행동 변화 중 하나를 요구한다. 새 `manuscript-scene-state-delta-not-evidenced`는 같은 원리를 원고에 적용해 scene conflict/beat가 언급되었더라도 실제 문장 창 안에서 before 압박과 after 결과가 이어지지 않으면 실패시킨다. 참고: [PubMed: Segmentation in reading and film comprehension](https://pubmed.ncbi.nlm.nih.gov/19397386/), [The Brain's Cutting-Room Floor: Segmentation of Narrative Cinema](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2010.00168/full), [Large language models can segment narrative events similarly to humans](https://pubmed.ncbi.nlm.nih.gov/39751673/).
- Story Grid의 scene/value shift 관점도 장면이 끝났다고 보려면 가치나 상태가 바뀌어야 한다고 본다. 이번 보강은 이 작법 기준을 자동화해 원고가 사건 요약이나 확인 문장으로 장면을 대신하지 못하게 하고, 장면 단위의 before/after story-state delta가 문장 위에 남도록 만든다. 참고: [Story Grid, Scenes](https://storygrid.com/scenes/), [Story Grid, Tracking the Scene](https://storygrid.com/tracking-the-scene/).
- event-indexing model은 서사 사건을 시간, 공간, 인물, 인과, 의도 차원으로 연결해 기억한다고 본다. 공간감/setting 심상 연구도 독자가 설정을 생생하게 구성할수록 narrative absorption과 spatial presence가 강해진다고 본다. 따라서 `scene-novelty-matrix-not-staged`의 `setting_mode`는 장소 이름이 아니라 경로, 차단, 거리, 잠금, 우회처럼 인물 행동을 제한하거나 가능하게 만드는 공간 affordance일 때만 인정한다. 참고: [The Construction of Situation Models in Narrative Comprehension](https://journals.sagepub.com/doi/10.1111/j.1467-9280.1995.tb00513.x), [Presence, flow, and narrative absorption](https://pmc.ncbi.nlm.nih.gov/articles/PMC10446082/).
- 전경화/낯설게 하기 연구는 독자가 익숙한 표현이나 사건을 새롭게 처리할 때 주목과 정서 반응이 커질 수 있음을 보여준다. Story Grid의 장면 기준도 단순 소재 나열이 아니라 장면 안의 가치 변화와 힘의 충돌을 요구한다. 따라서 새 `manuscript-scene-novelty-matrix-not-evidenced`는 기획상 참신한 조합이 실제 원고에서 보상 전달, 갈등/전술, 공간 affordance, 반대세력 대응으로 함께 구현되는지 확인한다. 참고: [Miall & Kuiken, Foregrounding, defamiliarization, and affect](https://sites.ualberta.ca/~dmiall/MiallPub/Miall_Kuiken_Foregrounding_1994.pdf), [Story Grid, Scenes](https://storygrid.com/scenes/).
- narrative planning 연구는 좋은 이야기에서 인물이 의도를 가진 행위자로 이해되어야 하며, 행동은 character goal과 causality로 설명되어야 한다고 본다. goal-plan inference 연구도 독자가 인물의 목표 달성/실패와 goal plan 변화를 추적하며 서사 인과를 이해한다고 본다. 따라서 `scene-goal-tactic-turn-not-staged`는 장면에 압박과 결과가 있어도 주인공의 구체 목표, 방해하는 힘, 전술 또는 전술 전환, 바뀐 결과가 함께 보이지 않으면 통과시키지 않는다. 참고: [Narrative Planning: Balancing Plot and Character](https://faculty.cc.gatech.edu/~riedl/pubs/jair.pdf), [Goal Plans of Action and Inferences During Comprehension of Narratives](https://www.researchgate.net/publication/228645247_Goal_Plans_of_Action_and_Inferences_During_Comprehension_of_Narratives).
- 캐릭터 동일시 연구는 독자가 인물의 목표와 관점을 자기 내부에서 경험하는 과정이 몰입과 즐거움에 중요하다고 본다. 따라서 주인공 매력은 “매력적이다”는 설명이나 키워드 재현이 아니라, 고유한 판단 방식/특성, 주체적 행동, 비용 또는 취약성, 그리고 이야기나 타인의 반응이 한 장면 창에 결합되어야 한다. 참고: [Character identification is predicted by narrative transportation, immersive tendencies, and interactivity](https://link.springer.com/article/10.1007/s12144-022-03048-4), [Evoking and Measuring Identification with Narrative Characters](https://pmc.ncbi.nlm.nih.gov/articles/PMC5507957/).
- 인물 몰입 연구는 character engagement가 정서 반응, 동일시, 관점 취하기처럼 여러 차원으로 나뉘며, 독자가 허구 인물을 실제 사회적 상대처럼 처리할 수 있다고 본다. 애착과 허구 인물 결속 연구도 이야기 속 인물이 친밀감 욕구를 안전하게 충족할 수 있음을 보여준다. 따라서 관계 변화는 “관계가 회복됐다”는 요약이 아니라 취약성/관계 위험, 상대의 선택, 달라진 신뢰/거리, 이후 행동 변화가 같은 장면 창에 결속되어야 한다. `reader-response-calibration`은 이 근거를 설문 축으로 옮겨 `character-attachment`와 `relationship-investment`를 별도 blind spot으로 보고하고, `character-relationship-benchmark`는 더 앞단에서 protagonist agency, distinctive signature, vulnerability cost, relationship tension, reciprocal pressure, subtext inference, turn consequence, next scene interest까지 분리해 자동 드라마 점수의 false positive를 샘플 세트 단위로 드러낸다. 참고: [Evoking and measuring identification with narrative characters](https://dspace.library.uu.nl/handle/1874/355248), [Adult attachment and engagement with fictional characters](https://www.yorku.ca/mar/Mar%20%26%20Rain%202021_Adult%20attachment%20and%20engagement%20with%20fictional%20characters.pdf), [Adult attachment and engagement with fictional characters](https://journals.sagepub.com/doi/10.1177/02654075211018513), [Engagement with narrative characters](https://pure.mpg.de/pubman/faces/ViewItemOverviewPage.jsp?itemId=item_3514023).
- 사회적/도덕적 인지와 fiction reading 연구는 독자가 인물의 믿음, 의도, 오해를 추론하는 과정이 몰입과 공감에 중요하다고 본다. narrative planning 연구도 character intentionality를 좋은 이야기 평가의 핵심 축으로 본다. 따라서 관계 전환점은 “상대가 도왔다/관계가 좋아졌다”에서 끝나지 않고, 숨긴 동기, 오해, 진심, 망설임, 바뀐 속내를 독자가 읽을 수 있는 단서를 같은 장면 창에 넣어야 한다. 참고: [Reading Fictional Narratives to Improve Social and Moral Cognition](https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2020.611935/full), [The Relationship Between Empathy and Reading Fiction](https://jeps.efpsa.org/en/articles/jeps.ca), [Can LLMs Generate Good Stories? Insights and Challenges from a Narrative Planning Perspective](https://arxiv.org/html/2506.10161v1).
- character engagement 연구는 독자가 허구 인물의 내면 세계를 처리할 때 사회인지 능력을 사용하며, 내면 단서 자체보다 독자가 재구성해야 하는 인물의 의도와 관점이 중요하다고 본다. 또한 2026년 conflictual dialogue 실험은 고립된 논쟁 대화만 조작해서는 품질/오락성 향상이 유의하지 않았다고 보고했다. 따라서 새 게이트는 말싸움 양을 늘리는 대신 상대 인물이 자기 조건, 거절, 요구, 경쟁 목표, 대가, 비밀, 위험을 들고 장면의 협상 상태를 바꾸도록 요구한다. 참고: [Reading about minds: The social-cognitive potential of narratives](https://pubmed.ncbi.nlm.nih.gov/35318585/), [Engagement with narrative characters](https://www.mpi.nl/publications/item3514023/engagement-narrative-characters-role-social-cognitive-abilities-and), [Does Conflictual Dialogue Improve a Story?](https://ejop.psychopen.eu/index.php/ejop/article/view/17499).
- 다중 에이전트 평가 연구는 최종 출력만으로는 실패 원인과 책임 단계를 찾기 어렵고, 역할별 handoff, source agent, step-level trace, evidence provenance가 있어야 오류 전파와 복구 실패를 디버깅할 수 있다고 본다. 따라서 품질 게이트 팀은 score만 모으지 않고 issue code, source agent, evidence, directive를 최종 팀 리포트에 보존하고 critical을 PASS보다 우선시하도록 강화했다. 참고: [Traceability and Accountability in Role-Specialized Multi-Agent LLM Pipelines](https://arxiv.org/html/2510.07614v1), [Seeing the Whole Elephant: A Benchmark for Failure Attribution in LLM-based Multi-Agent Systems](https://arxiv.org/html/2604.22708v1), [From Agent Traces to Trust](https://arxiv.org/html/2606.04990v3).
- 최근 trace 기반 failure attribution 연구는 실패한 multi-agent run에서 전체 trace가 부분 관측보다 원인 귀속에 유리하고, 오류를 처음 만든 단계와 뒤에서 전파한 단계를 구분해야 한다고 본다. 따라서 `team-state.schema.json`은 `execution_trace`의 `depends_on`, `issue_codes`, `evidence`, `directive`와 `failure_attribution.supporting_trace_events`, `decisive_step`, `propagated_to`, `counterfactual_fix`를 분리했다. 참고: [TraceElephant](https://arxiv.org/html/2604.22708v1), [FALAT: A Fault-Aware Agent Trace Framework](https://arxiv.org/html/2606.00765v1), [Intervention-Supported Error Attribution](https://arxiv.org/html/2606.09071v1).
- agent provenance 연구는 trace가 실제 신뢰를 주려면 실행 단계뿐 아니라 입력 컨텍스트, 메모리, 검색·파일 출처가 어떤 결정에 쓰였는지도 드러나야 한다고 본다. 따라서 품질 게이트 팀은 `context_manifest`로 원고, chapter JSON, 이전 summary, 관계 상태, 지시, task output의 loaded/missing/stale/superseded 상태와 `used_by` agent를 기록하고, required context가 낡거나 없으면 `stale_context` 또는 `missing_evidence`로 validator dispatch 전 차단한다. 참고: [From Agent Traces to Trust](https://arxiv.org/html/2606.04990v3), [TraceElephant](https://arxiv.org/html/2604.22708v1).
- build provenance 표준은 산출물이 어떤 builder, recipe, input materials에서 나왔는지 기록해야 artifact를 신뢰할 수 있다고 본다. 또한 NIST SHA 표준은 message digest를 생성 시점 이후 메시지가 바뀌었는지 감지하는 용도로 설명한다. 따라서 벤치마크 report도 단순 수정 시각만 보지 않고, 생성 당시 source evidence 파일들의 SHA-256 digest를 `sourceEvidence`에 저장하고 readiness에서 현재 digest와 대조한다. 참고: [SLSA Provenance](https://slsa.dev/spec/v0.1/provenance), [NIST FIPS 180-4 Secure Hash Standard](https://csrc.nist.gov/pubs/fips/180-4/upd1/final).
- 역할 특화 pipeline 연구는 단순 agent 연결보다 구조화되고 accountability가 있는 handoff가 오류 전파를 줄인다고 본다. 따라서 팀 상태는 이제 `handoff_contracts`로 producer/consumer, required payloads, acceptance criteria, 손실 위험, `weakened` 상태를 보존하고, issue/directive/evidence가 다음 agent에게 같은 강도로 전달되지 않으면 `handoff_loss`로 최종 PASS를 차단한다. 참고: [Traceability and Accountability in Role-Specialized Multi-Agent LLM Pipelines](https://arxiv.org/html/2510.07614v1), [A Survey of Evidence Tracing and Execution Provenance in LLM Agents](https://arxiv.org/html/2606.04990v3), [TraceElephant](https://arxiv.org/html/2604.22708v1).
- intervention-supported attribution 연구는 실패 귀속이 자유형 설명으로 끝나면 약하고, 실행 grounding, prefix-preserving replay, targeted intervention, 재검증 가능한 성공 조건이 필요하다고 본다. 따라서 팀 실패 리포트는 이제 `recovery_plan`에 `from_step`, `intervention_type`, `preserve_prefix_trace_until`, `directives_to_apply`, `success_criteria`, `verification_commands`, `rollback_refs`를 기록해 전체 팀을 재시작하지 않고 필요한 단계부터 검증 가능한 복구를 수행하게 한다. 참고: [Intervention-Supported Error Attribution for Silent Failures in LLM Agents](https://arxiv.org/html/2606.09071v1), [A Survey of Evidence Tracing and Execution Provenance in LLM Agents](https://arxiv.org/html/2606.04990v3).
- checkpoint-restore 연구는 LLM 에이전트가 복원 뒤 같은 의도를 미묘하게 다르게 재합성할 수 있어 단순 rollback만으로는 안전하지 않고, replay/fork 경계와 기록된 효과가 필요하다고 본다. 따라서 `apply-chapter-gate`는 장기 유지력 리포트를 현재 회차의 최신 시퀀스 실패에만 anchor하고, 미래 회차 리포트·짧은 시퀀스·근거 부족 샘플은 Ralph Loop hard block으로 쓰지 않는다. 참고: [ACRFence](https://arxiv.org/abs/2603.20625), [From Agent Traces to Trust](https://arxiv.org/abs/2606.04990).
- LLM judge와 multi-agent debate 연구는 다중 평가자의 최종 표결만 합치면 개별 critique와 불확실성이 사라질 수 있고, judge 간 불일치는 최소 한 평가자가 완전하지 않다는 신호로 쓸 수 있다고 본다. 따라서 팀 품질 게이트는 majority/weighted aggregation 전에 `validation_conflicts`로 PASS/FAIL 분열, 같은 issue의 심각도 차이, 15점 이상 점수 편차, 근거 누락, 지시/근거 충돌을 보존하고, major/critical 소수 의견은 근거 기반 resolution 없이 PASS할 수 없게 했다. 참고: [Improving Factuality and Reasoning in Language Models through Multiagent Debate](https://arxiv.org/abs/2305.14325), [No-Knowledge Alarms for Misaligned LLMs-as-Judges](https://arxiv.org/html/2509.08593v1), [Overconfidence in LLM-as-a-Judge](https://arxiv.org/html/2508.06225v2).

## 최근 개선 반영

- 복선 회수 장면화: `foreshadowing-payoff-not-staged`, `manuscript-foreshadowing-payoff-not-evidenced`.
- 능동 반대세력: `scene-active-opposition-not-staged`.
- 장면 목표-전술 전환: `scene-goal-tactic-turn-not-staged`로 사건 결과와 압박만 있고 주인공의 구체 목표, 방해, 전술/전환, 바뀐 결과가 결합되지 않은 장면 메타데이터를 차단.
- 핵심 drift/staging failure code 문서 정합성.
- foundational engagement gate 문서 정합성.
- 독자 약속 전제 결합도: `reader-promise-premise-not-integrated`로 각 필드가 구체적이어도 `core_hook`, `novelty_angle`, `irresistible_question`, `binge_reason`, `long_series_engine`, 초반 유지 비트가 같은 전제 앵커를 공유하지 못하는 false positive를 차단한다.
- 1화 첫 화면 체화: `opening-hook-not-evidenced`, `opening-hook-delayed`, `opening-hook-not-embodied`로 첫 문단/첫 문장에 전제 앵커가 즉시 들어오는지, 그리고 첫 1~2문장 안에서 주인공 행동/선택 압박, 감각 또는 POV 앵커, 미해결 위험/질문이 결합되는지 확인한다. 전제 설명문으로 시작하는 1화 false positive를 차단한다.
- 전제 엔진 작동: `manuscript-premise-engine-not-evidenced`로 `core_hook`과 `novelty_angle`이 설정/소재/컨셉 설명으로만 남고, 장면 규칙·장치·조건·금기로 선택, 전술, 위험, 다음 질문을 바꾸지 못하는 원고를 차단한다.
- 집필/전체집필/검증 문서가 모든 `EngagementIssueCode`를 언급하는 회귀 테스트.
- 독자 욕망 강도: `manuscript-reader-desire-not-evidenced`로 구조는 맞지만 독자가 결과를 원하지 않는 원고를 차단.
- 장면 신선도 매트릭스: `scene-novelty-matrix-not-staged`로 기능은 맞지만 보상/갈등/장소/반대세력 조합이 빈약한 장면 메타데이터를 차단.
- 장면 신선도 원고 실행: `manuscript-scene-novelty-matrix-not-evidenced`로 설계상 신선한 장면 조합이 실제 원고에서 보상 전달, 갈등/전술, 공간 affordance, 반대세력 대응으로 결합되지 않는 경우를 차단.
- 원고 긴장 파형: `manuscript-tension-wave-not-evidenced`로 high-tension 회차가 말미에만 위험과 폭로를 몰아넣고 초반 압박, 중반 악화, 말미 고점, 열린 질문의 순서 있는 tension wave / 긴장 파형을 만들지 못하는 경우를 차단.
- 장면 상태 변화: `scene-state-delta-not-staged`로 확인/발견/연결 같은 사건 단어는 있지만 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동이 장면 전후로 바뀌지 않는 false positive를 차단. `manuscript-scene-state-delta-not-evidenced`로 같은 결함이 원고 문장 창에서 반복되는 경우도 차단.
- 시그니처 장면 story-impact lift: `signature-scene-image-not-staged`, `manuscript-signature-scene-image-not-evidenced`가 사물/공간/몸동작, 시각 디테일, 이야기 전환뿐 아니라 선택 비용, 규칙 변화, 단서 재해석, 관계/정체성 변화, 되돌릴 수 없는 결과 중 하나를 같은 1~2문장 안에 요구하도록 강화했다. 분위기 좋은 이미지가 서사 상태를 바꾸지 못하면 실패한다.
- 잔향 모티프 씨앗: `resonance_seed`를 chapter schema/template에 추가했고, `motif-resonance-not-staged`, `manuscript-motif-resonance-not-evidenced`가 선언된 씨앗 이미지가 scene evidence와 원고 1~2문장 창에서 concrete anchor, visual image, emotional aftertaste, meaning shift, story consequence를 함께 갖추는지 확인한다.
- 주인공 매력 시그니처 행동: `character-appeal-signature-not-staged`, `manuscript-character-appeal-signature-not-evidenced`로 주인공 매력 키워드는 있지만 고유 방식/특성, 주체적 행동, 비용 또는 취약성, visible story/social reaction이 한 장면 안에 결합되지 않는 false positive를 차단한다.
- 관계 전환점 밀도: `relationship-turning-point-not-staged`, `manuscript-relationship-turning-point-not-evidenced`로 사과했다/대답했다/관계가 회복됐다는 얇은 요약을 차단하고, 취약성 또는 관계 위험, 상대의 선택/반응, 신뢰/불신/거리 변화, 즉시 달라진 행동 결과를 같은 scene window 또는 1~2문장 안에 요구한다.
- 관계 마음 추론: `relationship-mind-inference-not-staged`, `manuscript-relationship-mind-inference-not-evidenced`로 행동 결과는 있지만 숨김, 오해, 진심, 망설임, 바뀐 속내를 읽을 단서가 없는 관계 전환점 false positive를 차단한다.
- 관계 상호 압박: `relationship-mutual-pressure-not-staged`, `manuscript-relationship-mutual-pressure-not-evidenced`로 마음 단서는 있지만 상대가 조건, 거절, 요구, 경쟁 목표, 개인적 대가, 비밀, 위험 없이 돕거나 용서만 하는 일방향 관계 전환 false positive를 차단한다.
- 장기 훅 전진: `long-hook-thread-not-advanced`, `manuscript-long-hook-thread-not-advanced`로 장기 훅이 scene evidence나 원고에 보이더라도 이름만 반복되고 새 단서, 좁혀진 가설, 위험/대가 변화, 다음 검증 행동으로 전진하지 않으면 실패하게 했다.
- 클리프행어 즉시 이월: `cliffhanger-carryover-delayed`, `manuscript-cliffhanger-carryover-delayed`로 직전 말미 훅을 current_plot/chapter_reward에는 적었지만 opening scene 또는 원고 첫 두 문장 이후에야 처리하는 초반 이탈 false positive를 차단한다.
- 보상 쾌감 고점: `manuscript-payoff-delight-not-evidenced`로 보상은 신선하지만 압박 축적, 의미 변화/반전, 몸 반응, 즉시 새 결과가 한 고점으로 결합되지 않는 원고를 차단.
- 말미 훅 준비 단서: `manuscript-ending-hook-setup-not-evidenced`로 좌표, 사진, 명명 장소, 신원, 특수 물건 같은 강한 말미 훅 앵커가 앞선 장면의 구체 단서 없이 튀어나오는 원고를 차단.
- 장르별 쾌감 캘리브레이션: `manuscript-genre-delight-not-evidenced`로 감정명과 몸반응은 있지만 미스터리의 단서 결합/추론/남는 의문, 로맨스의 거리 변화/취약한 대화/관계 선택, 액션의 추격 동선/전술 반전/신체 결과, 스릴러의 조여드는 위협/덫 확대/거짓 반전/강제 선택, 현대판타지의 시스템 피드백/스킬 활용/대가/현실 결과, 판타지의 규칙 발현/대가/경이 이미지/능력 변화가 없는 원고를 차단.
- 원고 체험 몰입: `manuscript-narrative-transportation-not-evidenced`로 사건 증거와 보상 키워드는 있지만 구체 공간/사물/행동, POV 감정 반응, 집중점이 인접 장면 문장에 결속되지 않아 독자가 줄거리를 심상으로 떠올리거나 인물 압박을 느끼기 어려운 원고를 차단.
- 감정 선택 전환: `manuscript-affective-choice-turn-not-evidenced`로 감정 전환과 전환 계기는 보이지만 그 감정 때문에 실제 선택, 행동, 관계 태도, 위험/결과 상태가 달라지지 않는 내부 독백형 원고를 차단.
- 문체 취향 게이트: `src/quality/prose-taste-gate.ts`로 일반 AI 탐지 대신 사용자/프로젝트 문체 취향에 맞춘 산문 거슬림 점수를 추가했다. `StyleStageEvaluator`는 이 점수를 반영하며, 스타일 단계 통과선을 80에서 88로 올렸다. `monotone-short-sentence-run`으로 연속 단문 끊어쓰기, `hedged-perception-haze`로 완충 인식 표현 과밀, `abstract-exposition-drift`/`cognitive-filtering-overload`/`nominalized-explanation-chain`/`translationese-formula-drift`/`connective-crutch-rhythm`/`filler-adverb-cadence`/`comma-rhythm-overload`/`reporting-tail-summary`/`repeated-subject-rhythm`/`detached-camera-description`/`expository-dialogue-dump`/`rote-dialogue-response-chain`/`mechanical-dialogue-tag-chain`/`generic-omniscient-teaser`/`vague-atmosphere-modifier-chain`/`rhetorical-question-drift`로 추상 설명, 인식 필터, 명사화 설명, 번역투 공식 표현, 접속 부사 시작, 완충 부사 박자 반복, 쉼표, 보고식 종결, 반복 주어, 정적 외부 카메라식 묘사와 시점 앵커 부족, 설정·사건 규칙 설명 대사 과다, 짧은 확인·동의 대사 연쇄, 중립 대사 태그 연쇄, 구체 장면 근거 없이 운명/시작/예고를 선언하는 전지적 티저, 장면 근거 없는 모호한 분위기 수식 연쇄, 행동 전환 없는 자문형 의문문 연쇄까지 차단한다.
- 상투적 신체 반응 beat gate: `stock-reaction-beat-chain`으로 숨 삼킴, 입술 깨묾, 시선 회피, 고개 숙임, 손 떨림, 주먹 쥠 같은 상투적 반응 문장이 감정과 선택을 대신하는 경우를 분리했다. `stockReactionBeatDensityPer1000`, `longestStockReactionBeatRun`을 계산하고, `max_stock_reaction_beat_density_per_1000`/`max_stock_reaction_beat_run`을 style-guide/prose-taste-benchmark schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결했다.
- 모호한 분위기 수식 gate: `vague-atmosphere-modifier-chain`으로 묘한 공기, 알 수 없는 감각, 무거운 침묵, 낯선 긴장, 불길한 예감 같은 수식이 장면 근거를 대신하는 경우를 분리했다. `vagueAtmosphereModifierDensityPer1000`, `longestVagueAtmosphereModifierRun`을 계산하고, `max_vague_atmosphere_modifier_density_per_1000`/`max_vague_atmosphere_modifier_run`을 style-guide/prose-taste-benchmark schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결했다.
- 완충 부사 박자 gate: `filler-adverb-cadence`로 천천히, 조용히, 가만히, 살짝, 잠시, 그대로 같은 부사가 동사·물증·선택 변화 없이 장면 박자를 채우는 경우를 분리했다. `fillerAdverbDensityPer1000`, `longestFillerAdverbRun`을 계산하고, `max_filler_adverb_density_per_1000`/`max_filler_adverb_run`을 style-guide/prose-taste-benchmark schema와 template, 프로젝트 benchmark CLI, style fingerprint metric, apply-chapter-gate의 style-guide reader에 연결했다.
- 자문형 의문문 drift gate: `rhetorical-question-drift`로 왜/어떻게/정말/걸까 같은 질문이 실제 확인 행동, 새 단서, 선택 비용, 상대 반응 없이 장면 진행을 대신하는 경우를 분리했다. `rhetoricalQuestionDensityPer1000`, `longestRhetoricalQuestionRun`을 계산하고, `max_rhetorical_question_density_per_1000`/`max_rhetorical_question_run`을 style-guide/prose-taste-benchmark schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결했다.
- 문체 issue 위치 기반 지시: `ProseTasteIssue`가 line, paragraph, paragraph-local sentence, target text, localization confidence를 보존하고, `StyleStageEvaluator`와 `apply-chapter-gate`의 `style-alignment` directive가 위치 힌트와 해당 문장/문단 evidence를 포함한다. 따라서 “문체가 거슬린다”는 총평이 실제 퇴고 지시로 내려갈 때 어느 문장을 다시 써야 하는지 잃지 않는다.
- 문체 취향 완료 게이트: `schemas/style-guide.schema.json`/`templates/style-guide.template.json`에 `prose_taste_profile`을 추가했고, `src/cli/apply-chapter-gate.ts`가 이 프로필을 읽어 사용자 금지 표현과 거슬리는 문체를 최종 회차 통과 전에 차단한다.
- 문체 취향 벤치마크: `src/quality/prose-taste-benchmark.ts`로 좋은 문체 샘플이 막히는 false negative와 나쁜 문체 샘플이 통과하는 false positive를 샘플 세트 단위로 측정한다. 이제 `reader_segment`를 샘플 결과까지 보존하고 `readerSegmentRepresentativeness`, `dominantReaderSegmentRatio`, `missingRequiredReaderSegments`, `underSampledFailingReaderSegments`, `readyForStyleTuning`을 계산해 한 취향 세그먼트의 반응만으로 문체 gate를 조정하지 않게 한다. 추가로 `calibration_split`, `splitCoverage`, `underSampledUsableHoldoutSamples`, `underSampledUsableFailingHoldoutSamples`를 계산해 usable holdout과 disliked-prose holdout이 없으면 문체 gate tuning 준비 완료가 되지 않게 한다. 또한 샘플별 `evidenceFingerprint`를 남기고, 같은 문체 원고가 calibration/validation/holdout 사이에 중복되면 `splitLeakageCount`, `splitLeakages`를 보고해 독립 holdout이 아닌 샘플로 문체 기준을 바꾸지 못하게 한다. 또 `style_friction_annotations`가 없거나 기대 issue code를 덮지 못하는 비선호 샘플은 탐지 자체가 맞아도 `styleTuningUsable=false`로 분리하고, `missingStyleFrictionAnnotationCount`/`weakStyleFrictionAnnotationCount`로 남긴다. 선호 샘플도 `style_highlight_annotations`가 없거나 location/reason/reader segment/quality/transfer guidance가 약하면 `styleTuningUsable=false`로 분리하고, `missingStyleHighlightAnnotationCount`/`weakStyleHighlightAnnotationCount`로 남긴다. 추가로 `styleFingerprint`가 usable 선호/비선호 샘플의 문체 metric 평균 차이를 계산하고, 분리 신호가 약하면 `weakStyleFingerprintCount`와 `readyForStyleTuning=false`로 남긴다. `tests/quality/prose-taste-benchmark.test.ts`가 균형 문체, 기능 보고체, 의도적 lyrical 문체, 완충 인식 표현 과밀, 추상 설명/인식 필터/명사화 설명/번역투/접속 부사/반복 주어/설정 설명 대사/기계적 확인·동의 대사 연쇄/중립 대사 태그 연쇄/전지적 티저/모호한 분위기 수식/자문형 의문문 마찰 샘플과 세그먼트/holdout/주석/fingerprint/split leakage coverage를 검증한다.
- 문체 취향 프로젝트 CLI: `schemas/prose-taste-benchmark.schema.json`/`templates/prose-taste-benchmark.template.json`으로 입력 형식을 고정했고, `src/cli/run-prose-taste-benchmark.ts`가 `reviews/prose-taste-benchmark/*.json`을 읽어 `reviews/prose-taste-benchmark-report.json`을 저장한다. 샘플은 `content`, `content_path`, `chapter` 중 하나로 지정할 수 있고, `reader_segment`, `required_reader_segments`, `minimum_samples_per_reader_segment`, `minimum_failing_samples_per_reader_segment`, `maximum_dominant_reader_segment_ratio`, `calibration_split`, `minimum_holdout_samples`, `minimum_usable_holdout_samples`, `minimum_failing_holdout_samples`, `minimum_usable_failing_holdout_samples`, `require_friction_annotations`, `minimum_friction_annotations`, `minimum_actionable_friction_annotations`, `require_style_highlight_annotations`, `minimum_style_highlight_annotations`, `minimum_actionable_style_highlight_annotations`, `require_style_fingerprint_separation`, `minimum_style_fingerprint_samples_per_polarity`, `minimum_style_fingerprint_distance`, `minimum_style_fingerprint_signal_count`로 문체 선호/비선호 샘플의 대표성, holdout 검증 상태, 독자 위치 주석 품질, 선호 문체 재현 근거, 문체 지문 분리도를 확인할 수 있다. `prose_taste_profile`로 문체 모드, threshold, 사용자 금지 표현, 추상 설명, 인식 필터, 명사화 설명, 번역투 공식 표현, 접속 부사 시작, 쉼표, 보고식 종결, 반복 주어, 정적 묘사, 시점 앵커, 설정 설명 대사 비율, 짧은 확인·동의 대사 비율/연쇄 길이, 중립 대사 태그 비율/연쇄 길이, 상투적 반응 beat 밀도/연쇄 길이, 모호한 분위기 수식 밀도/연쇄 길이, 자문형 의문문 밀도/연쇄 길이, 전지적 티저 밀도 기준을 오버라이드할 수 있다.
- Engagement 벤치마크: `src/quality/engagement-benchmark.ts`로 `evaluateEngagementContract` 결과를 labeled 샘플 기대값과 비교한다. 장르와 `interest`/`suspense`/`beauty`/`amusement`/`genre-delight`/`next-click` 경로 커버리지, false positive, false negative, 누락 issue, 과잉 issue, 점수 범위 이탈을 함께 보고한다. 이제 `genrePolarityCoverage`, `missingRequiredPositiveGenres`, `missingRequiredNegativeGenres`로 필수 장르마다 좋은 샘플과 나쁜 샘플이 모두 있는지도 따로 검증하고, `seriesCoverage`, `missingRequiredSeriesGenres`, `missingRequiredPositiveSeriesGenres`로 연속 회차 벤치마크 부족까지 보고한다. 추가로 `requiredIssueCodes`, `issueCodeCoverage`, `usableIssueCodeCoverage`, `missingRequiredIssueCodes`, `underSampledRequiredIssueCodes`, `underSampledUsableRequiredIssueCodes`를 계산해 `manuscript-payoff-delight-not-evidenced`, `manuscript-signature-scene-image-not-evidenced`, `manuscript-character-appeal-signature-not-evidenced` 같은 대작 고점 실패 유형별 known-bad 샘플과 실제 검출 성공 근거가 없으면 회차 재미 게이트 튜닝 준비 완료가 되지 않게 한다. `calibration_split`, `splitCoverage`, `underSampledUsableHoldoutSamples`, `underSampledUsableFailingHoldoutSamples`, `splitLeakageCount`, `splitLeakages`, `readyForGateTuning`도 계산해 usable holdout과 known-bad holdout 부족, 그리고 동일 evidence의 split 간 중복을 차단한다.
- Engagement 벤치마크 프로젝트 CLI: `schemas/engagement-benchmark.schema.json`/`templates/engagement-benchmark.template.json`으로 입력 형식을 고정했고, `src/cli/run-engagement-benchmark.ts`가 `reviews/engagement-benchmark/*.json`을 읽어 프로젝트의 설계/플롯/회차/원고와 비교한 뒤 `reviews/engagement-benchmark-report.json`을 저장한다. 실패 샘플은 `manuscript` 또는 `manuscript_path`로 대체 원고를 지정할 수 있다. `required_issue_codes`, `minimum_samples_per_required_issue_code`, `minimum_holdout_samples`, `minimum_usable_holdout_samples`, `minimum_failing_holdout_samples`, `minimum_usable_failing_holdout_samples`와 대응 CLI 옵션으로 issue-code coverage와 holdout readiness 기준을 조정할 수 있다.
- 장기 연재 유지력 벤치마크: `src/quality/series-retention-benchmark.ts`로 자동 장기 연재 점수와 타깃 독자의 연속 회차 반응을 비교한다. next-click, fatigue resistance, hook progress, reward variety, payoff satisfaction, novelty, emotional reset, confidence in payoff를 가중 합산하고, 자동 고득점이지만 독자 유지가 약한 `automated-false-positive`, 첫 회차 대비 마지막 회차 독자 유지가 떨어지는 `reader-retention-drop`, 같은 보상 시그니처가 반복되는 `repetitive-reward-pattern`, 같은 감정 시그니처가 반복되는 `repetitive-emotional-pattern`, 약한 차원, 독자 근거 부족을 분리한다. 추가로 `calibration_split`, `splitCoverage`, `underSampledHoldoutSamples`, `underSampledUsableHoldoutSamples`, `underSampledFailingHoldoutSamples`, `underSampledUsableFailingHoldoutSamples`, `splitLeakageCount`, `splitLeakages`, `readyForGateTuning`을 계산해 evidence-sufficient holdout과 known-drop holdout 부족, 그리고 동일 회차 시퀀스 evidence의 split 간 중복이 있으면 장기 연재 게이트 튜닝 준비 완료가 되지 않게 한다.
- 장기 연재 유지력 프로젝트 CLI: `schemas/series-retention-benchmark.schema.json`/`templates/series-retention-benchmark.template.json`으로 입력 형식을 고정했고, `src/cli/run-series-retention-benchmark.ts`가 `reviews/series-retention-benchmark/*.json`을 읽어 `reviews/series-retention-benchmark-report.json`을 저장한다. 필수 장르와 타깃 독자별 known-retained/known-drop polarity coverage, 최소 시퀀스 길이, 최대 유지 낙폭, 최대 반복 보상 run, 최대 반복 감정 run, 최소 코멘트 수가 부족하면 리포트에 gap으로 남긴다. `maximum_repeated_emotional_signature_run`, `minimum_holdout_samples`, `minimum_usable_holdout_samples`, `minimum_failing_holdout_samples`, `minimum_usable_failing_holdout_samples`와 대응 CLI 옵션으로 감정 아크 반복 및 holdout readiness 기준을 조정할 수 있다.
- 장기 연재 유지력 완료 게이트: `src/cli/apply-chapter-gate.ts`가 `reviews/series-retention-benchmark-report.json`을 읽고, 현재 회차가 실패 시퀀스의 최신 회차이며 `evidenceSufficient=true`인 경우에만 장기 유지 실패를 `readerResponse.passed === false`로 병합한다. 미래 회차 리포트, `short-sequence`, `insufficient-reader-evidence`는 자동 루프 차단 근거로 쓰지 않는다.
- 장기 연재 funnel evidence: `series-retention-benchmark`가 회차별 `started_read_count`, `completed_read_count`, `continued_read_count`, `drop_off_count`, `skimmed_read_count`를 받아 `funnelEvidence`, `funnelPassed`, completion/continuation/drop-off/skimming ratio를 산출한다. `weak-funnel-evidence`는 튜닝 근거 부족으로 `weakFunnelEvidenceCount`에 남고, `reader-funnel-drop`은 실제 이탈 신호로 `funnelDropCount`에 남는다. 프로젝트 CLI와 schema/template은 `minimum_started_read_count`, `minimum_completion_rate`, `minimum_continuation_rate`, `maximum_drop_off_ratio`, `maximum_skimmed_read_ratio`, `require_funnel_evidence`를 받아 기본적으로 생존자 편향 샘플을 장기 연재 gate tuning 근거에서 제외한다.
- 장편 일관성 완료 게이트: `src/cli/apply-chapter-gate.ts`가 `reviews/consistency-report.json`을 읽고, 현재 회차를 덮지 않는 stale report, `chapters_analyzed` 누락, character/timeline/setting/factual/plot_logic 도메인 coverage 누락, 현재/이전 회차의 unresolved `critical`/`major`/`minor` consistency issue를 `readerResponse.passed === false`로 병합한다. 장편 일관성 실패는 `장편 일관성 검증 실패`와 `Reader Response / Long-Form Consistency Revision Directives`로 별도 표시되어 독자 패널 실패와 구분된다.
- 전제 매력 벤치마크: `src/quality/premise-appeal-benchmark.ts`로 자동 전제 점수와 타깃 독자 반응을 비교한다. curiosity gap, novelty, protagonist investment, emotional pull, clarity, target fit, next chapter anticipation, would read를 가중 합산하고, 자동 고득점이지만 독자 반응이 약한 `automated-false-positive`, 자동 저득점이지만 독자 반응이 강한 `automated-false-negative`, 약한 차원, 독자 근거 부족을 분리한다. 추가로 목록 노출 대비 클릭률, 첫 화 열람률, 저장/팔로우율이 약하면 `behavioral-intent-false-positive`로 남기고, blind listing test, platform/source/variant, observation window가 약하면 `weak-behavioral-protocol-evidence`로 분리한다. A/B listing evidence의 expected/observed allocation ratio와 SRM p-value가 없거나 기준보다 낮으면 `weak-behavioral-allocation-evidence`로 분리한다. `calibration_split`, `splitCoverage`, `underSampledHoldoutSamples`, `underSampledUsableHoldoutSamples`, `underSampledFailingHoldoutSamples`, `underSampledUsableFailingHoldoutSamples`, `splitLeakageCount`, `splitLeakages`, `readyForGateTuning`을 계산해 evidence-sufficient holdout과 known-bad holdout 부족, 그리고 동일 전제 evidence의 split 간 중복이 있으면 전제 설계 게이트 튜닝 준비 완료가 되지 않게 한다.
- 전제 매력 프로젝트 CLI: `schemas/premise-appeal-benchmark.schema.json`/`templates/premise-appeal-benchmark.template.json`으로 입력 형식을 고정했고, `src/cli/run-premise-appeal-benchmark.ts`가 `reviews/premise-appeal-benchmark/*.json`을 읽어 `reviews/premise-appeal-benchmark-report.json`을 저장한다. 필수 장르와 타깃 독자별 known-good/known-bad polarity coverage, 최소 샘플 수, 최소 코멘트 수가 부족하면 리포트에 gap으로 남긴다. `minimum_holdout_samples`, `minimum_usable_holdout_samples`, `minimum_failing_holdout_samples`, `minimum_usable_failing_holdout_samples`, `require_behavioral_protocol`, `minimum_behavioral_observation_window_hours`, `require_behavioral_allocation_integrity`, `minimum_sample_ratio_mismatch_p_value`와 대응 CLI 옵션으로 holdout/readiness/behavioral protocol/allocation 기준을 조정할 수 있다.
- 인물/관계 투자도 벤치마크: `src/quality/character-relationship-benchmark.ts`로 자동 인물/관계 드라마 점수와 타깃 독자 반응을 비교한다. protagonist agency, distinctive signature, vulnerability cost, character attachment, relationship tension, reciprocal pressure, subtext inference, turn consequence, next scene interest를 가중 합산하고, 자동 고득점이지만 독자 투자가 약한 `automated-false-positive`, 자동 저득점이지만 독자 투자가 강한 `automated-false-negative`, 약한 차원, 독자 근거 부족을 분리한다. 추가로 `calibration_split`, `splitCoverage`, `underSampledHoldoutSamples`, `underSampledUsableHoldoutSamples`, `underSampledFailingHoldoutSamples`, `underSampledUsableFailingHoldoutSamples`, `splitLeakageCount`, `splitLeakages`, `readyForGateTuning`을 계산해 evidence-sufficient holdout과 known-flat holdout 부족, 그리고 동일 인물/관계 focus evidence의 split 간 중복이 있으면 인물/관계 게이트 튜닝 준비 완료가 되지 않게 한다.
- 인물/관계 투자도 프로젝트 CLI: `schemas/character-relationship-benchmark.schema.json`/`templates/character-relationship-benchmark.template.json`으로 입력 형식을 고정했고, `src/cli/run-character-relationship-benchmark.ts`가 `reviews/character-relationship-benchmark/*.json`을 읽어 `reviews/character-relationship-benchmark-report.json`을 저장한다. 필수 장르, 타깃 독자, 관계 유형별 known-investing/known-flat polarity coverage, 최소 샘플 수, 최소 코멘트 수가 부족하면 리포트에 gap으로 남긴다. `minimum_holdout_samples`, `minimum_usable_holdout_samples`, `minimum_failing_holdout_samples`, `minimum_usable_failing_holdout_samples`와 대응 CLI 옵션으로 holdout readiness 기준을 조정할 수 있다.
- 독자 반응 캘리브레이션: `src/quality/reader-response-calibration.ts`로 자동 engagement 점수와 실제 독자 설문/베타리더 반응의 차이를 측정한다. 0~100 점수와 7점 리커트 척도를 모두 지원하며, 다음 화 클릭 의향, attention, emotional engagement, mental imagery, transportation, character attachment, relationship investment, novelty, surprise, resonance, scene recall, recommendation intent, bookmark intent, return intent, purchase intent, binge intent, interest, suspense, beauty, amusement, overall liking을 가중 합산한다.
- 독자 반응 provenance gate: `respondent_source`, `human_respondent_count`, `synthetic_respondent_count`, `author_estimate_count`를 받아 반응 출처를 분리한다. 기본 설정에서는 인간 독자 비율이 `minimum_human_respondent_ratio` 이상인 샘플만 `humanReaderEvidence=usable`로 보고, `synthetic-ai`, `author-estimate`, `unknown`, 인간 응답 수가 불명확한 mixed 샘플은 `lowHumanReaderEvidenceCount`에 남겨 threshold retuning과 `masterpiece-readiness` 통과 근거에서 제외한다.
- 독자 반응 response data-quality gate: `median_read_time_seconds`, `minimum_read_time_seconds`, `speeding_response_count`, `straight_lining_response_count`, `duplicate_response_count`, `bot_suspected_response_count`, `low_quality_open_ended_response_count`, `inconsistent_response_count`, `quality_flagged_response_count`를 받아 인간 독자 패널 내부의 속독, 직선응답, 중복 응답, 봇 의심, 부실 자유응답, 반복 문항 불일치, 고유 품질 플래그를 분리한다. 기본 설정에서는 timing/speeding 근거와 pattern/fraud 근거가 모두 있어야 `responseDataQuality=usable`이며, 없거나 약한 샘플은 `lowResponseDataQualityCount`에 남겨 threshold retuning과 `masterpiece-readiness` 통과 근거에서 제외한다.
- 독자 반응 revision outcome gate: `revision_pair_id`, `revision_baseline_reader_score`, `revision_current_reader_score`, `revision_preference_revised_count`, `revision_preference_baseline_count`, `revision_preference_tie_count`, `revision_preference_respondent_count`, `revision_blind_comparison`, `revision_same_reader_cohort`, `revision_question_wording_disclosed`, `revision_guardrail_regression_count`를 받아 독자 마찰 주석이나 revision directive가 실제 개정 효과를 냈는지 분리한다. 개정본이 baseline보다 독자 점수나 blind before/after 선호에서 충분히 나아지면 `revisionOutcomeEvidence=improved`가 되고, 퇴보하거나 guardrail regression이 있으면 `revisionRegressionCount`로 남아 `masterpiece-readiness` critical gap이 된다. 프로젝트가 `require_revision_outcome_evidence`를 켜면 개정 효과 증거가 약한 샘플은 threshold retuning 근거에서 제외된다.
- 독자 반응 프로젝트 CLI: `schemas/reader-response-calibration.schema.json`/`templates/reader-response-calibration.template.json`으로 입력 형식을 고정했고, `src/cli/calibrate-reader-response.ts`가 `reviews/reader-response/*.json`을 읽어 `meta/quality-trend.json`의 자동 점수와 비교한 뒤 `reviews/reader-response-calibration.json`을 저장한다. `scripts/verify-build.mjs`와 prebuild integrity에도 새 CLI를 포함했다.
- 독자 반응 완료 게이트: `src/cli/apply-chapter-gate.ts`가 `reviews/reader-response-calibration.json`을 읽고, usable 독자 패널 샘플이 자동 평가의 false positive, 약한 next-click, 또는 `revisionOutcomeEvidence=regressed`를 보여주면 `readerResponse.passed === false`로 최종 gate를 `RETRY` 처리한다. `Reader Response Revision Directives`는 재작성 프롬프트에 포함되고, 개정 퇴보 샘플은 `revision-outcome` 지시로 baseline 대비 하락 원인을 되돌리게 한다.
- 독자 마찰 주석: `reader-response-calibration`의 `evidence.friction_annotations`가 location, reason, affected dimension, severity, rewrite suggestion, reader count, reader segment를 받는다. 구조화된 주석이 있으면 friction/actionable/rewrite evidence count를 자동 산출하고, 기본 설정에서는 숫자 카운트만 있는 샘플을 threshold retuning usable evidence로 보지 않는다. 구조화된 주석이 있어도 낮게 나온 reader-response dimension을 같은 dimension의 actionable annotation이 덮지 못하면 `frictionAnnotationCoverage=partial/missing`으로 남겨 threshold retuning usable evidence에서 제외한다. actionable annotation이 reader segment를 보존하지 않거나 한 독자군에 쏠리면 `frictionAnnotationRepresentativeness=unknown/narrow`로 남겨 threshold retuning usable evidence에서 제외한다. `apply-chapter-gate`는 이 주석을 `Reader Response Revision Directives`로 전달해 독자 패널 점수가 장면 위치별 퇴고 지시가 되게 한다.
- 독자 샘플 근거 품질: `ReaderResponseSampleEvidence`로 target reader 수, 시작 독자 수, 완독 수, 중도 이탈 수, 훑어읽기 수, 자유 코멘트 수, 마찰 지점 annotation, 위치/이유/재작성 제안/reader segment가 있는 actionable `friction_annotations`, 자발 장면 회상 수, 특징적 장면 회상 수, `scene_recall_annotations`, 장면 긴장 추적 수, 긴장 고점 수, 질문/위험 추적 수, `tension_trace_annotations`, 예측 참여 수, 예측 다양성, 예측 수정 수, 예측 불일치 수, 예측 전환점 수, `narrative_forecast_annotations`, 문장 회상 수, 선호 문장 수, 공유/인용 가능 문장 수, `line_quote_annotations`, payoff setup 회상 수, trigger 인식 수, earned payoff 수, 재해석 수, 감정 보상 수, `payoff_fairness_annotations`, 자연 추천 수, 토론 유발 수, `advocacy_annotations`, 북마크/팔로우/재방문/몰아읽기/유료 계속읽기 수, `durable_engagement_annotations`, 잔류 감정/성찰/개인적 의미 수, `resonance_annotations`를 받아 `evidenceQuality`, `actionabilityScore`, `retentionEvidence`, `sceneRecallEvidence`, `tensionTraceEvidence`, `narrativeForecastEvidence`, `lineQuoteEvidence`, `payoffFairnessEvidence`, `advocacyEvidence`, `durableEngagementEvidence`, `resonanceEvidence`를 산출한다. 응답자 수는 충분해도 retention 근거, 구조화된 근거, 장면 회상 근거, 장면 긴장 추적 근거, 서사 예측 근거, 문장 인용성 근거, 회수 공정성 근거, 추천/토론 advocacy 근거, 지속 참여 근거, 사후 잔향 근거가 약한 샘플은 `apply-chapter-gate`에서 hard block이 아니라 경고로 처리하고, threshold retuning usable evidence에서는 제외한다.
- 독자 패널 retention evidence: `started_read_count`, `completed_read_count`, `drop_off_count`, `skimmed_read_count`를 받아 시작자 대비 완독률, 이탈률, 훑어읽기 비율을 계산한다. 기본 설정에서는 `retentionEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowRetentionEvidenceCount`와 `low retention evidence` tuning blocker로 분리한다.
- 독자 패널 coverage 품질: `ReaderResponseGenreCoverage`로 필수 장르별 전체 샘플 수, usable 샘플 수, 회차 목록, 최장 연속 회차 길이, usable 최장 연속 회차 길이를 계산한다. `missingRequiredGenres`, `underSampledRequiredGenres`, `underSampledUsableRequiredGenres`, `missingRequiredSeriesGenres`, `missingRequiredUsableSeriesGenres`가 남으면 `readyForGateTuning`은 false다. `calibrate-reader-response`는 JSON의 `required_genres`, `minimum_samples_per_genre`, `minimum_usable_samples_per_genre`, `required_series_length`, `required_usable_series_length`와 CLI 옵션을 모두 읽는다.
- 독자 패널 회차 구간 coverage: `ReaderResponseChapterRangeCoverage`로 초반/중반/후반 같은 필수 회차 구간의 전체 샘플 수, usable 샘플 수, 장르 목록, usable 장르 목록을 계산한다. `underSampledRequiredChapterRanges`, `underSampledUsableRequiredChapterRanges`, `missingRequiredChapterRangeGenres`, `missingRequiredUsableChapterRangeGenres`가 남으면 `readyForGateTuning`은 false다. `required_chapter_ranges`와 `--required-chapter-range id:min-max:minSamples:minUsableSamples:genres`로 설정한다.
- 독자 패널 인물/관계 반응 차원: `character_attachment`와 `relationship_investment` 입력을 받아 자동 engagement가 높아도 독자가 인물의 결과나 관계 전환에 투자하지 않는 샘플을 `character-attachment`/`relationship-investment` dimension issue와 blind spot으로 드러낸다.
- 독자 패널 창의성/잔향 반응 차원: `novelty`, `surprise`, `resonance` 입력을 받아 자동 engagement가 높고 결함이 적어도 독자가 새로움, 공정한 놀라움, 읽고 난 뒤 잔향을 약하게 느끼는 generic-but-polished 샘플을 별도 dimension issue와 blind spot으로 드러낸다.
- 독자 패널 장면 회상 evidence: `scene_recall`, `unprompted_scene_recall_count`, `distinctive_scene_recall_count`, `scene_recall_annotations`를 받아 독자가 읽고 난 뒤 자발적으로 떠올리는 장면과 특징적 디테일이 있는지 측정한다. 기본 설정에서는 `sceneRecallEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowSceneRecallEvidenceCount`와 tuning blocker로 분리한다.
- 독자 패널 장면 긴장 추적 evidence: `tension_trace_point_count`, `tension_peak_count`, `tension_question_count`, `tension_trace_annotations`를 받아 독자가 읽는 중 어느 장면에서 긴장, 궁금증, 놀라움, 위험/질문을 실제로 표시했는지 측정한다. 기본 설정에서는 `tensionTraceEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowTensionTraceEvidenceCount`와 `low tension trace` tuning blocker로 분리한다.
- 독자 패널 서사 예측 evidence: `forecast_prediction_count`, `forecast_diversity_count`, `forecast_revision_count`, `forecast_mismatch_count`, `forecast_inflection_count`, `narrative_forecast_annotations`를 받아 독자가 어떤 결과를 예상했고, 어느 지점에서 예측을 바꿨으며, 실제 결과와의 공정한 불일치가 긴장/놀라움으로 작동했는지 측정한다. 기본 설정에서는 `narrativeForecastEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowNarrativeForecastEvidenceCount`와 `low narrative forecast` tuning blocker로 분리한다.
- 독자 패널 문장 인용성 evidence: `quote_recall_count`, `favorite_line_count`, `shareable_line_count`, `line_quote_annotations`를 받아 독자가 실제로 기억하거나 좋아하거나 남에게 보여주고 싶은 문장이 있는지 측정한다. 기본 설정에서는 `lineQuoteEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowLineQuoteEvidenceCount`와 `low line quote` tuning blocker로 분리한다.
- 독자 패널 payoff fairness evidence: `payoff_setup_recall_count`, `payoff_trigger_recognition_count`, `payoff_earned_count`, `payoff_recontextualization_count`, `payoff_emotional_satisfaction_count`, `payoff_fairness_annotations`를 받아 독자가 앞선 setup을 기억했는지, 어떤 trigger/reveal로 연결했는지, 회수가 공정했는지, 앞 장면을 다시 읽게 만들었는지, 감정 보상을 남겼는지 측정한다. 기본 설정에서는 `payoffFairnessEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowPayoffFairnessEvidenceCount`와 `low payoff fairness` tuning blocker로 분리한다.
- 독자 패널 추천/토론 advocacy evidence: `recommendation_intent`, `organic_recommendation_count`, `discussion_prompt_count`, `advocacy_annotations`를 받아 독자가 읽은 뒤 남에게 권하거나 토론하고 싶은 공유 이유가 있는지 측정한다. 기본 설정에서는 `advocacyEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowAdvocacyEvidenceCount`와 `low advocacy` tuning blocker로 분리한다.
- 독자 패널 지속 참여 evidence: `bookmark_intent`, `return_intent`, `purchase_intent`, `binge_intent`, `bookmark_count`, `follow_or_library_add_count`, `return_next_day_count`, `binge_read_intent_count`, `paid_continuation_intent_count`, `durable_engagement_annotations`를 받아 독자가 저장, 팔로우, 재방문, 유료 계속읽기, 몰아읽기 같은 장기 행동 의지를 남겼는지 측정한다. 기본 설정에서는 `durableEngagementEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowDurableEngagementEvidenceCount`와 `low durable engagement` tuning blocker로 분리한다.
- 독자 패널 실제 다음 회차 행동 evidence: `next_chapter_cta_impression_count`, `next_chapter_click_count`, `next_chapter_open_count`, `next_chapter_read_start_count`를 받아 “다음 화를 읽겠다”는 의향이 실제 클릭/열람/읽기 시작으로 이어졌는지 측정한다. 기본 설정에서는 `continuationBehaviorEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowContinuationBehaviorEvidenceCount`와 `low continuation behavior` tuning blocker로 분리한다. 다만 현재 회차의 신뢰 가능한 독자 패널에서 실제 행동 카운트가 이미 수집됐고 비율이 기준 미달이면 `apply-chapter-gate`가 `continuation-behavior-drop`으로 완료를 차단해, missing behavior evidence와 bad behavior evidence를 구분한다.
- 독자 패널 사후 잔향 evidence: `resonance`, `lingering_emotion_count`, `reflective_comment_count`, `personal_memory_or_meaning_count`, `resonance_annotations`를 받아 독자가 읽고 난 뒤 남은 감정, 성찰 질문, 기억 이미지, 개인적 의미를 남겼는지 측정한다. 기본 설정에서는 `resonanceEvidence !== "usable"`인 샘플을 gate threshold retuning usable coverage로 세지 않고, `lowResonanceEvidenceCount`와 `low resonance evidence` tuning blocker로 분리한다.
- 대작 준비도 종합 리포트: `run-masterpiece-readiness`가 `premise-appeal`, `engagement`, `series-retention`, `character-relationship`, `long-form-consistency`, `prose-taste`, `reader-response` 리포트를 한 번에 읽어 `reviews/masterpiece-readiness-report.json`을 저장한다. 개별 점수가 높아도 missing report, failing sample, false positive, holdout 부족, weak reader evidence, 장편 일관성 coverage 부족, unresolved consistency issue가 남아 있으면 `passed=false`가 되므로, 98점 이상 주장에 필요한 실제 샘플 증거 부족과 장편 모순 위험을 한 리포트에서 확인할 수 있다. 또한 각 report가 생성 당시 source evidence SHA-256 digest를 `sourceEvidence`에 남기고, 현재 source digest와 불일치하거나 source evidence보다 오래됐으면 `stale-report` critical gap으로 처리해 낡은 벤치마크 스냅샷으로 대작 준비도를 통과하지 못하게 한다. 대응 source 경로에서 실제 파일을 찾지 못하면 `no-source-evidence` critical gap이 되고, 영역별 필수 source group이 비어 있으면 `missing-source-group-*` critical gap이 되어, benchmark 샘플 없이 다른 메타 파일 하나만 둔 synthetic report JSON으로 98+ readiness를 통과하지 못한다. `--fail-on-not-ready`를 쓰면 readiness 실패가 non-zero exit code로 이어져 CI/자동 검증에서도 다음 단계를 차단할 수 있다.
- 독자 패널 합의도: `reader-response-calibration`이 `reader_score_standard_deviation`, `high_response_count`, `neutral_response_count`, `low_response_count`를 받아 `panelConsensus`를 `clear`/`mixed`/`polarized`/`unknown`으로 기록한다. `panelConsensus !== "clear"`인 샘플은 evidence가 충분해도 usable coverage로 세지 않으며, `lowConsensusCount`와 recommendation으로 분리된다.
- 독자 패널 평균 신뢰도: `reader-response-calibration`이 `reader_score_standard_deviation`과 `respondent_count`로 표준오차, 95% `readerScoreMarginOfError`, `readerScoreConfidenceInterval`, `readerScoreConfidence`를 계산한다. `readerScoreConfidence !== "precise"`인 샘플은 점수·합의도·근거가 충분해도 usable coverage에서 제외되고, `lowConfidenceCount`와 recommendation으로 분리된다.
- 독자 패널 코호트 대표성: `reader-response-calibration`이 `target_reader_segment_count`와 `dominant_reader_segment_ratio`를 받아 `cohortRepresentativeness`를 `balanced`/`narrow`/`unknown`으로 기록한다. 추가로 `required_target_reader_segments`, `minimum_respondents_per_required_target_segment`, `require_target_reader_segment_quotas`, 샘플별 `target_reader_segment_counts`를 받아 필수 타깃 독자 quota cell이 실제 응답자 수로 채워졌는지 검사한다. `cohortRepresentativeness !== "balanced"`인 샘플은 점수·합의도·근거가 충분해도 usable coverage에서 제외되고, `lowRepresentativenessCount`와 recommendation으로 분리된다.
- 독자 패널 프로토콜 품질: `reader-response-calibration`이 `blind_reading`, `author_identity_masked`, `prior_exposure_screened`, `unexcluded_prior_exposure_count`, `spoiler_exposure_screened`, `unexcluded_spoiler_exposure_count`, `neutral_question_wording`, `response_option_order_randomized`, `sample_order_randomized`, `manuscript_order_counterbalanced`, `max_samples_per_respondent`, `order_balance_ratio`, `question_wording_disclosed`, `recruitment_method_disclosed`, `recruitment_channel_counts`, `population_definition_disclosed`, `sampling_frame_disclosed`, `fieldwork_dates_disclosed`, `survey_mode_disclosed`, `incentive_disclosed`, `attention_check_pass_count`, `excluded_response_count`를 받아 `panelProtocolQuality`를 `strong`/`weak`/`unknown`으로 기록한다. 추가로 `required_recruitment_channels`, `minimum_respondents_per_required_recruitment_channel`, `maximum_dominant_recruitment_channel_ratio`, `require_recruitment_channel_diversity`, `maximum_samples_per_respondent`, `minimum_order_balance_ratio`를 받아 필수 모집 경로가 실제 응답자 수로 채워졌는지, 한 모집 경로가 표본을 지배하지 않는지, 같은 독자가 여러 원고/버전을 평가할 때 순서·피로·전이 편향을 통제했는지, 작가/출처 단서·기존 노출·스포일러 노출 오염이 제거됐는지 검사한다. `panelProtocolQuality !== "strong"`인 샘플은 점수·합의도·근거·대표성이 충분해도 usable coverage에서 제외되고, `lowProtocolQualityCount`와 `weak protocol` tuning blocker로 분리된다.
- 독자 패널 비교 선호도: `reader-response-calibration`이 `comparative_preference_current_count`, `comparative_preference_reference_count`, `comparative_preference_tie_count`, `comparative_blind_pairwise`, `comparative_same_reader_cohort`, `comparative_question_wording_disclosed`를 받아 기준작/대안 원고 대비 blind pairwise 선호도를 계산한다. `require_comparative_preference`가 켜져 있으면 `comparativePreferenceStatus !== "strong"`인 샘플은 절대 독자 점수와 holdout이 충분해도 `readyForGateTuning=false`로 남는다.
- 독자 패널 holdout split: `reader-response-calibration`이 샘플별 `calibration_split`을 받아 `calibration`/`validation`/`holdout`으로 보존하고, `splitCoverage`, `underSampledHoldoutSamples`, `underSampledUsableHoldoutSamples`를 계산한다. 기본 설정에서는 usable holdout 샘플이 부족하면 `readyForGateTuning=false`이고, `gateTuningSuggestions`도 holdout usable 샘플에서 확인된 false positive/false negative/blind spot만 threshold 조정 근거로 쓴다.
- 문체 취향 holdout split: `prose-taste-benchmark`가 샘플별 `calibration_split`을 받아 `calibration`/`validation`/`holdout`으로 보존하고, `splitCoverage`, `underSampledHoldoutSamples`, `underSampledUsableHoldoutSamples`, `underSampledFailingHoldoutSamples`, `underSampledUsableFailingHoldoutSamples`를 계산한다. 기본 설정에서는 usable holdout과 usable disliked-prose holdout이 부족하면 `readyForStyleTuning=false`다.
- 문체 취향 split leakage 차단: `prose-taste-benchmark`가 샘플별 문체 원고 `evidenceFingerprint`를 저장하고, 같은 fingerprint가 calibration/validation/holdout 사이에 중복되면 `splitLeakageCount`와 `splitLeakages`를 보고한다. leakage가 있으면 holdout이 독립 검증 근거가 아니므로 `readyForStyleTuning=false`이고, `masterpiece-readiness`도 `split-leakage-count`를 critical gap으로 본다.
- 문체 취향 주석 coverage: `prose-taste-benchmark`가 비선호 샘플별 `style_friction_annotations`를 받아 독자가 거슬린 위치, 이유, issue code, reader segment, rewrite suggestion을 보존한다. 기본 설정에서는 disliked-prose 샘플이 gate expectation을 맞춰도 주석이 없거나 기대 issue code를 덮지 못하면 `styleTuningUsable=false`이고 `readyForStyleTuning=false`다.
- 문체 취향 긍정 하이라이트 coverage: `prose-taste-benchmark`가 선호 샘플별 `style_highlight_annotations`를 받아 독자가 좋게 읽은 위치, 이유, quality, reader segment, transfer guidance를 보존한다. 기본 설정에서는 preferred 샘플이 gate expectation을 맞춰도 하이라이트가 없거나 actionable하지 않으면 `styleTuningUsable=false`이고 `readyForStyleTuning=false`다.
- 전제 매력 split leakage 차단: `premise-appeal-benchmark`가 샘플별 전제 `evidenceFingerprint`를 저장하고, 같은 fingerprint가 calibration/validation/holdout 사이에 중복되면 `splitLeakageCount`와 `splitLeakages`를 보고한다. leakage가 있으면 holdout이 독립 검증 근거가 아니므로 `readyForGateTuning=false`다.
- 인물/관계 holdout split: `character-relationship-benchmark`가 샘플별 `calibration_split`을 받아 `calibration`/`validation`/`holdout`으로 보존하고, `splitCoverage`, `underSampledHoldoutSamples`, `underSampledUsableHoldoutSamples`, `underSampledFailingHoldoutSamples`, `underSampledUsableFailingHoldoutSamples`를 계산한다. 기본 설정에서는 evidence-sufficient holdout과 usable known-flat holdout이 부족하면 `readyForGateTuning=false`다.
- 인물/관계 split leakage 차단: `character-relationship-benchmark`가 샘플별 인물/관계 focus `evidenceFingerprint`를 저장하고, 같은 fingerprint가 calibration/validation/holdout 사이에 중복되면 `splitLeakageCount`와 `splitLeakages`를 보고한다. leakage가 있으면 holdout이 독립 검증 근거가 아니므로 `readyForGateTuning=false`다.
- 장기 연재 holdout split: `series-retention-benchmark`가 샘플별 `calibration_split`을 받아 `calibration`/`validation`/`holdout`으로 보존하고, `splitCoverage`, `underSampledHoldoutSamples`, `underSampledUsableHoldoutSamples`, `underSampledFailingHoldoutSamples`, `underSampledUsableFailingHoldoutSamples`를 계산한다. 기본 설정에서는 evidence-sufficient holdout과 usable known-drop holdout이 부족하면 `readyForGateTuning=false`다.
- 장기 연재 split leakage 차단: `series-retention-benchmark`가 샘플별 회차 시퀀스 `evidenceFingerprint`를 저장하고, 같은 fingerprint가 calibration/validation/holdout 사이에 중복되면 `splitLeakageCount`와 `splitLeakages`를 보고한다. leakage가 있으면 holdout이 독립 검증 근거가 아니므로 `readyForGateTuning=false`다.
- 독자 패널 gate tuning 제안: 충분한 usable reader-panel coverage가 없으면 `collect-more-reader-evidence`만 남기고, 준비 완료 후에는 `tighten-automated-high-pass`, `loosen-reader-loved-low-score-route`, `increase-reader-dimension-sensitivity`, `hold-current-gates`를 evidence sample id, current/suggested value, safety note와 함께 저장한다.
- 회차 재미 issue-code coverage: `engagement-benchmark`가 `required_issue_codes`와 `minimum_samples_per_required_issue_code`를 받아 대작 고점 실패 유형별 known-bad 샘플 수와 usable 검출 성공 수를 분리한다. 따라서 “문제없는 듯하지만 고점이 없는” 원고를 막는 `manuscript-signature-scene-image-not-evidenced`, `manuscript-character-appeal-signature-not-evidenced`, `manuscript-payoff-delight-not-evidenced`, `manuscript-genre-delight-not-evidenced`, `manuscript-ending-hook-setup-not-evidenced`, `manuscript-narrative-transportation-not-evidenced`, `manuscript-dialogue-subtext-not-evidenced`, `manuscript-dialogue-turn-not-evidenced`, `manuscript-dialogue-state-carryover-not-evidenced`, `manuscript-character-voice-not-differentiated`, `manuscript-causal-chain-not-evidenced`의 실패 샘플이 없거나 검출에 실패하면 `readyForGateTuning=false`로 남는다.
- 편의적 해결 issue-code coverage: `manuscript-convenient-resolution-not-evidenced`는 우연히 도착한 구조자, 갑자기 열린 문, 마침 발견된 증거처럼 외부 해결이 압박을 대신 풀어주는 known-bad 샘플을 요구한다. 이 실패 유형은 `protagonist-agency`와 `causal-chain` positive label의 conflict issue로도 연결해, agency/인과 고점으로 라벨링된 샘플에서 우연한 해결이 검출되면 `positive-quality-conflict`로 제외한다.
- 회차 재미 positive high-point coverage: `engagement-benchmark`가 `required_positive_quality_codes`와 `minimum_samples_per_required_positive_quality_code`를 받아 known-good 샘플이 실제로 어떤 재미 고점 품질을 대표하는지 분리한다. `positive_quality_codes`에는 `signature-scene-image`, `character-appeal-signature`, `payoff-delight`, `genre-delight`, `next-click-compulsion`, `narrative-transportation`, `dialogue-subtext-turn`, `causal-chain`을 태깅할 수 있고, `positiveQualityCoverage`와 `usablePositiveQualityCoverage`가 부족하면 `missingRequiredPositiveQualityCodes`, `underSampledRequiredPositiveQualityCodes`, `underSampledUsableRequiredPositiveQualityCodes`로 남아 `readyForGateTuning=false`가 된다. 즉 실패 유형을 잡는 벤치마크만으로는 부족하고, 독자가 좋아할 고점 장면의 양성 exemplar도 장르별로 보유해야 한다.
- 회차 재미 split leakage 차단: `engagement-benchmark`가 원고/회차/플롯/설계 evidence fingerprint를 샘플마다 남기고, 같은 fingerprint가 calibration/validation/holdout 사이에 중복되면 `splitLeakageCount`와 `splitLeakages`를 보고한다. leakage가 있으면 holdout이 독립 검증 근거가 아니므로 `readyForGateTuning=false`이고, `masterpiece-readiness`도 `split-leakage-count`를 critical gap으로 본다.
- 팀 issue provenance 정책: `schemas/team.schema.json`의 `quality_gates.issue_policy`가 품질 게이트 팀에 필수화됐다. `verification-team`, `deep-review-team`, `design-review-team`, `plot-review-team`, `revision-team`, `writing-team-2pass`는 issue code 보존, 최고 심각도 병합, critical PASS 차단, source agent/evidence/directive 필드를 명시한다. `team-orchestrator`는 `issueRegistry`, `merged_issues`, `ordered_directives`를 최종 리포트에 포함해야 하며, `tests/teams/team-definitions.test.ts`가 이 계약을 회귀 방지한다.
- 팀 실행 trace/failure attribution: `schemas/team-state.schema.json`에 `execution_trace`와 `failure_attribution`을 추가했다. 팀 run은 dispatch, handoff, agent result, validator issue, retry, block, error 이벤트를 `trace_event_id`로 보존하고, 실패 시 `responsible_agent`, `decisive_step`, `failure_mode`, `supporting_trace_events`, `recoverability`, `recommended_retry_from_step`을 기록한다. `team-orchestrator`는 최초 원인 실패를 후속 전파 이슈로 덮어쓰지 않도록 지시하며, `tests/teams/team-definitions.test.ts`가 실패한 quality-gate trace fixture를 스키마로 검증한다.
- 팀 targeted recovery plan: `schemas/team-state.schema.json`에 `recovery_plan`을 추가했다. 실패 귀속 이후 `from_step`, `intervention_type`, `preserve_prefix_trace_until`, `target_agents`, `required_context_refs`, `directives_to_apply`, `success_criteria`, `verification_commands`, `rollback_refs`를 요구해 전체 팀 재시작 대신 실패 경계 이후만 재실행하도록 한다. `team-orchestrator`는 Step 5-C에서 prefix-preserving replay와 targeted intervention을 지시하고, `tests/teams/team-definitions.test.ts`가 이 계약을 회귀 방지한다.
- 팀 검증자 이견 장부: `schemas/team-state.schema.json`에 `validation_conflicts`를 추가했다. 품질 게이트는 이제 PASS/FAIL 분열, 같은 issue의 심각도 차이, 15점 이상 점수 편차, 근거 누락, 지시/근거 충돌을 기록하고, major/critical 소수 의견은 evidence-backed resolution 없이는 최종 PASS로 접을 수 없다. `team-orchestrator`는 `detectValidationConflicts`와 `validator_conflict` 실패 모드를 명시하며, `tests/teams/team-definitions.test.ts`가 이견 장부 fixture와 오케스트레이터 계약을 검증한다.
- 팀 컨텍스트 freshness manifest: `schemas/team-state.schema.json`이 quality-gated team state에 `context_manifest`를 필수화했다. `team-orchestrator`는 Step 5-0에서 파일, state, issue, directive, task output의 freshness를 기록하고, required context가 missing/stale/superseded이면 `context_freshness_check`에서 `missing_evidence` 또는 `stale_context`로 차단한 뒤 targeted recovery plan을 남긴다.
- 팀 handoff contract: `schemas/team-state.schema.json`에 `handoff_contracts`를 추가했고, `execution_trace`에 `handoff` event가 있으면 계약 장부가 필수다. `team-orchestrator`는 Step 5-A-2에서 issue, directive, evidence, score/verdict, file refs가 다음 agent에게 같은 강도로 전달됐는지 acceptance check를 수행하고, missing/stale/superseded/weakened payload는 `handoff_acceptance_check`와 `handoff_loss`로 PASS 전에 차단한다. `tests/teams/team-definitions.test.ts`가 계약 누락 실패, 지시 약화 손실, 오케스트레이터 문구 계약을 회귀 방지한다.
- 주관적 고점 평가자: `schemas/engagement.schema.json`에 `category_scores`와 `high_point_assessment`를 추가했고, `beta-reader`는 memorable scene lift, character appeal signature, payoff delight, genre-specific delight, next-click compulsion의 5축 고점 조건 없이는 `engagement_score >= 90`을 주지 않는다. `quality-oracle`은 Masterpiece High-Point Pass로 결함 없는 원고도 고점 장면이 약하면 기존 surgical directive 타입 안에서 재작성 지시를 만든다.

## 검증 기준

최근 확인한 명령:

```bash
npx vitest run tests/masterpiece
npm run validate:integrity
npm run build
npm test
```

현재 마지막 확인 결과:

- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 69 passed
- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npm run build`: 644 integrity tests passed, required outputs 29 verified
- `npm test`: 1349 passed
- `git diff --check`: passed
- `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 40 passed
- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npm run validate:integrity`: 473 passed
- `npm test`: 1174 passed
- `npm run build`: required outputs 27 verified
- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/teams/team-definitions.test.ts`: 14 passed
- `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 20 passed
- `npx vitest run tests/quality/series-retention-benchmark.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts tests/build/prebuild-integrity.test.ts`: 7 passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 38 passed
- `npm run validate:integrity`: 469 passed
- `npm run build`: required outputs 27 verified
- `npm test`: 1170 passed

추가 확인(2026-06-21):

- `npx vitest run tests/quality/premise-appeal-benchmark.test.ts`: 2 passed
- `npx vitest run tests/masterpiece/premise-appeal-benchmark-cli.test.ts`: 2 passed
- `npx vitest run tests/build/prebuild-integrity.test.ts tests/quality/premise-appeal-benchmark.test.ts tests/masterpiece/premise-appeal-benchmark-cli.test.ts`: 7 passed
- `npx vitest run tests/docs/catalog-sync.test.ts`: 4 passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/masterpiece/engagement-contracts.test.ts`: 123 passed
- `npx vitest run tests/masterpiece`: 270 passed
- `npm run validate:integrity`: 452 passed
- `npm run build`: required outputs 23 verified
- `npm test`: 1153 passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 31 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/masterpiece/engagement-contracts.test.ts tests/build/prebuild-integrity.test.ts`: 90 passed
- `npx vitest run tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts`: 8 passed
- `npx vitest run tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts tests/docs/catalog-sync.test.ts tests/masterpiece/engagement-contracts.test.ts tests/build/prebuild-integrity.test.ts`: 98 passed
- `npx vitest run tests/masterpiece/engagement-contracts.test.ts tests/docs/catalog-sync.test.ts tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 105 passed
- `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 18 passed
- `npm run validate:schemas`: passed
- `npx tsc --noEmit`: passed
- `npm run validate:integrity`: 426 passed
- `npm test`: 1137 passed
- `npm run build`: required outputs 21 verified
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts -t "premise"`: 2 passed
- `npx vitest run tests/masterpiece/golden-sample-project.test.ts tests/docs/catalog-sync.test.ts`: 5 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/masterpiece/engagement-contracts.test.ts`: 87 passed
- `npx vitest run tests/teams/team-definitions.test.ts`: 11 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/teams/team-definitions.test.ts`: 15 passed
- `npm run validate:integrity`: 433 passed
- `npm test`: 1144 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts -t "fails when an emotional turn does not alter choice"`: 1 passed
- `npx vitest run tests/masterpiece/golden-sample-project.test.ts`: 1 passed
- `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 230 passed
- `npx tsc --noEmit`: passed
- `npx vitest run tests/masterpiece`: 267 passed
- `npx vitest run tests/masterpiece tests/quality/engagement-benchmark.test.ts tests/build/prebuild-integrity.test.ts`: 272 passed
- `npm run validate:schemas`: passed
- `npm run validate:integrity`: 421 passed
- `npm test`: 1130 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/teams/team-definitions.test.ts`: 8 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/teams/team-definitions.test.ts`: 12 passed
- `npx tsc --noEmit`: passed
- `npm run validate:integrity`: 416 passed
- `npm test`: 1123 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 220 passed
- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npm run validate:integrity`: 409 passed
- `npm test`: 1116 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece`: 257 passed
- `npx vitest run tests/teams/team-definitions.test.ts`: 6 passed
- `npm run validate:schemas`: passed
- `npx tsc --noEmit`: passed
- `npm run validate:integrity`: 408 passed
- `npm test`: 1115 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece`: 256 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/teams/team-definitions.test.ts`: 10 passed
- `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 219 passed
- `npx tsc --noEmit`: passed
- `npm run validate:integrity`: 407 passed
- `npm test`: 1114 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece`: 256 passed
- `npx vitest run tests/teams/team-definitions.test.ts`: 5 passed
- `npm run validate:schemas`: passed
- `npx tsc --noEmit`: passed
- `npm run validate:integrity`: 405 passed
- `npm test`: 1112 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece`: 254 passed

추가 확인(2026-06-20):

- `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 217 passed
- `npx tsc --noEmit`: passed
- `npm run validate:integrity`: 403 passed
- `npm test`: 1110 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece`: 254 passed
- `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 214 passed
- `npx tsc --noEmit`: passed
- `npm run validate:integrity`: 400 passed
- `npm test`: 1107 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece`: 251 passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/stage-evaluators.test.ts tests/quality/revision-stages.test.ts`: 58 passed
- `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts tests/quality/prose-taste-gate.test.ts`: 21 passed
- `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/quality/prose-taste-gate.test.ts`: 10 passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts`: 5 passed
- `npx vitest run tests/masterpiece/reader-response-calibration-cli.test.ts tests/quality/reader-response-calibration.test.ts tests/build/prebuild-integrity.test.ts`: 10 passed
- `npx vitest run tests/masterpiece/engagement-contracts.test.ts tests/retry/quality-gate.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 121 passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 26 passed
- `npx vitest run tests/masterpiece/engagement-contracts.test.ts tests/build/prebuild-integrity.test.ts tests/quality/reader-response-calibration.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 110 passed
- `npx vitest run tests/quality/engagement-benchmark.test.ts`: 4 passed
- `npx vitest run tests/quality/engagement-benchmark.test.ts tests/build/prebuild-integrity.test.ts`: 7 passed
- `npx vitest run tests/masterpiece/engagement-benchmark-cli.test.ts tests/quality/engagement-benchmark.test.ts tests/build/prebuild-integrity.test.ts`: 9 passed
- `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/quality/prose-taste-benchmark.test.ts tests/build/prebuild-integrity.test.ts`: 9 passed
- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 211 passed
- `npx vitest run tests/masterpiece`: 248 passed
- `npm run validate:integrity`: 397 passed
- `npm test`: 1104 passed
- `npm run build`: required outputs 21 verified
- `npm run validate:schemas`: passed
- `npx vitest run tests/masterpiece/engagement-contracts.test.ts`: 82 passed
- `npm run validate:agents`: 22 agents validated
- `npm run validate:integrity`: 398 passed
- `npm test`: 1105 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece`: 249 passed
- `npx vitest run tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts`: 6 passed
- `npm run validate:integrity`: 392 passed
- `npm test`: 1099 passed
- `npm run build`: required outputs 21 verified
- `npx vitest run tests/masterpiece`: 245 passed

추가 확인(2026-06-21 문체 세그먼트 대표성):

- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 11 passed
- `npx vitest run tests/build/prebuild-integrity.test.ts tests/docs/catalog-sync.test.ts`: 7 passed
- `npm run validate:integrity`: 35 files, 480 tests passed
- `npm test`: 59 files, 1181 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 문체 issue 위치 기반 지시):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/stage-evaluators.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 65 passed
- `git diff --check`: passed
- `npm run validate:schemas`: passed
- `npm run validate:integrity`: 35 files, 481 tests passed
- `npm test`: 59 files, 1182 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 독자 패널 gate tuning suggestions):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 28 passed
- `git diff --check`: passed
- `npm run validate:schemas`: passed
- `npm run validate:integrity`: 35 files, 483 tests passed
- `npm test`: 59 files, 1184 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 독자 창의성/잔향 반응 차원):

- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 25 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 32 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 484 tests passed
- `npm test`: 59 files, 1185 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 독자 패널 프로토콜 품질):

- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 26 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 33 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 485 tests passed
- `npm test`: 59 files, 1186 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 독자 패널 holdout split):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 27 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 34 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 486 tests passed
- `npm test`: 59 files, 1187 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 문체 취향 holdout split):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 12 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 19 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 487 tests passed
- `npm test`: 59 files, 1188 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 회차 재미 holdout split):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts`: 9 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts`: 16 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 488 tests passed
- `npm test`: 59 files, 1189 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 전제 매력 holdout split):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/premise-appeal-benchmark.test.ts tests/masterpiece/premise-appeal-benchmark-cli.test.ts`: 5 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/premise-appeal-benchmark.test.ts tests/masterpiece/premise-appeal-benchmark-cli.test.ts`: 12 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 489 tests passed
- `npm test`: 59 files, 1190 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 인물/관계 holdout split):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/character-relationship-benchmark.test.ts tests/masterpiece/character-relationship-benchmark-cli.test.ts`: 5 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/character-relationship-benchmark.test.ts tests/masterpiece/character-relationship-benchmark-cli.test.ts`: 12 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 490 tests passed
- `npm test`: 59 files, 1191 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 장기 연재 holdout split):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/series-retention-benchmark.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts`: 5 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/series-retention-benchmark.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts`: 12 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 491 tests passed
- `npm test`: 59 files, 1192 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 독자 패널 비교 선호도):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 29 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 36 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 493 tests passed
- `npm test`: 59 files, 1194 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 문체 취향 주석 coverage):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 13 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 20 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 494 tests passed
- `npm test`: 59 files, 1195 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 독자 패널 장면 회상 evidence):

- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 30 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 37 passed
- `git diff --check`: passed
- `npm run validate:integrity`: 35 files, 495 tests passed
- `npm test`: 59 files, 1196 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 독자 패널 추천/토론 advocacy evidence):

- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 31 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 38 passed
- `npm run validate:integrity`: 35 files, 496 tests passed
- `npm test`: 59 files, 1197 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 문체 선호 하이라이트 evidence):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 14 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 21 passed
- `git diff --check`: passed (CRLF warnings only)
- `npm run validate:integrity`: 35 files, 497 tests passed
- `npm test`: 59 files, 1198 tests passed
- `npm run build`: required outputs 27 verified

추가 확인(2026-06-21 독자 패널 사후 잔향 evidence):

- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 56 passed
- `npm run validate:integrity`: 35 files, 500 tests passed
- `git diff --check`: passed (CRLF warnings only)
- `npm test`: 59 files, 1201 tests passed
- `npm run build`: required outputs 27 verified
- 추가로 reader-response evidence minimum threshold가 0일 때 `actionabilityScore`, `sceneRecallEvidence`, `advocacyEvidence`, `durableEngagementEvidence`, `resonanceEvidence`가 NaN 없이 계산되는 경계값 테스트를 추가했다.

추가 확인(2026-06-21 시점 밀착도/정적 외부 카메라식 문체 gate):

- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 56 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts`: 7 passed
- `npm run validate:integrity`: 35 files, 503 tests passed
- `npm test`: 59 files, 1204 tests passed
- `npm run build`: required outputs 27 verified
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `detached-camera-description`, `max_static_description_density_per_1000`, `min_viewpoint_anchor_density_per_1000`, `reporting-tail-summary`, `max_reporting_tail_density_per_1000`을 `prose-taste-gate`, style-guide/prose benchmark schema, templates, `apply-chapter-gate`, benchmark CLI, writing/verification skills에 연결했다.

추가 확인(2026-06-21 독자 패널 retention evidence):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 58 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, required outputs 27 verified
- `npm test`: 59 files, 1211 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `started_read_count`, `completed_read_count`, `drop_off_count`, `skimmed_read_count`를 `reader-response-calibration` evidence, schema, template, CLI, README, `/verify-chapter` 문서에 연결했고, `retentionEvidence !== "usable"`인 샘플을 threshold retuning usable coverage에서 제외하도록 테스트를 추가했다.

추가 확인(2026-06-21 독자 패널 장면 긴장 추적 evidence):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 36 passed
- 추가로 `tension_trace_point_count`, `tension_peak_count`, `tension_question_count`, `tension_trace_annotations`를 `reader-response-calibration` evidence, schema, template, CLI, README, `/verify-chapter` 문서에 연결했고, `tensionTraceEvidence !== "usable"`인 샘플을 threshold retuning usable coverage에서 제외하도록 테스트를 추가했다. 장면의 실제 긴장감/궁금증/위험 반응은 이제 자동 정규식 점수만으로 retuning하지 않고, 독자 trace evidence가 있어야 조정 근거로 삼는다.

추가 확인(2026-06-21 독자 패널 서사 예측 evidence):

- 리서치 반영: 2026년 narrative forecasting 기반 tension metric 연구는 LLM 서사가 긴장 곡선과 예측 변화를 충분히 만들지 못하는 문제를 지적한다. 이에 따라 단순 긴장 고점 trace와 별도로 독자 예측, 예측 다양성, 예측 수정, 공정한 예측 불일치, 예측 전환점 evidence를 gate retuning 조건에 추가했다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 37 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 534 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1235 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `forecast_prediction_count`, `forecast_diversity_count`, `forecast_revision_count`, `forecast_mismatch_count`, `forecast_inflection_count`, `narrative_forecast_annotations`를 `reader-response-calibration` evidence, schema, template, CLI, README, 감사 문서에 연결했다. `narrativeForecastEvidence !== "usable"`인 샘플은 threshold retuning usable coverage에서 제외되며, `lowNarrativeForecastEvidenceCount`와 `low narrative forecast` tuning blocker로 분리된다.

추가 확인(2026-06-21 독자 패널 payoff fairness evidence):

- 리서치 반영: 2026년 CFPG 연구는 LLM story generation에서 foreshadow-payoff의 장거리 의존성과 trigger mechanism, logical fulfillment가 surface coherence보다 중요하다고 본다. 이에 따라 독자 setup recall, trigger recognition, earned payoff, recontextualization, emotional payoff evidence를 gate retuning 조건에 추가했다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 38 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 535 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1236 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `payoff_setup_recall_count`, `payoff_trigger_recognition_count`, `payoff_earned_count`, `payoff_recontextualization_count`, `payoff_emotional_satisfaction_count`, `payoff_fairness_annotations`를 `reader-response-calibration` evidence, schema, template, CLI, README, 감사 문서에 연결했다. `payoffFairnessEvidence !== "usable"`인 샘플은 threshold retuning usable coverage에서 제외되며, `lowPayoffFairnessEvidenceCount`와 `low payoff fairness` tuning blocker로 분리된다.

추가 확인(2026-06-21 장편 일관성 readiness 필수화):

- 리서치 반영: 2026년 ConStory-Bench 계열 연구는 long story generation에서 인물, 시간선, 세계 규칙, 사건 인과가 장문 생성 중 일관성 bug로 무너지는 문제를 별도 벤치마크로 다룬다. 이에 따라 `consistency-verifier` 산출물인 `reviews/consistency-report.json`을 `masterpiece-readiness`의 필수 `long-form-consistency` 영역으로 승격했다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 8 passed
- `npm run validate:schemas`: passed, `templates/consistency-report.template.json` matches schema
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 536 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1237 tests passed
- 추가로 `lowNarrativeForecastEvidenceCount`와 `lowPayoffFairnessEvidenceCount`를 `masterpiece-readiness`의 weak evidence gap 목록에 연결해, 직전 독자 패널 개선 축이 종합 readiness에서도 빠지지 않게 했다.
- 이제 장편 일관성 리포트가 없거나, 최소 3개 회차 미만이거나, character/timeline/setting/factual/plot_logic 5-domain coverage가 빠지거나, critical/major/minor consistency issue가 남아 있으면 98+ readiness가 통과하지 못한다.

추가 확인(2026-06-21 장편 일관성 회차 게이트 연결):

- 리서치 반영: ConStory-Bench가 장편 생성에서 factual/detail consistency와 timeline/plot logic을 주요 실패 축으로 제시하므로, readiness 사후 평가만으로는 부족하다. 이에 따라 `reviews/consistency-report.json`을 `/verify-chapter`의 `apply-chapter-gate`에도 연결해 현재 회차 승인 전에 장편 모순을 차단한다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 25 passed
- `schemas/consistency-report.schema.json`은 `factual_inconsistency`, `plot_logic_conflict` issue type을 허용한다.
- 이제 현재 회차의 unresolved consistency issue, stale consistency report, missing domain coverage는 validator consensus와 engagement/proseCraft가 모두 높아도 Ralph Loop를 `RETRY`로 돌린다.

추가 확인(2026-06-21 대작 준비도 종합 리포트):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts tests/build/prebuild-integrity.test.ts`: 8 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 516 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1217 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `run-masterpiece-readiness`가 전제 매력, 회차 재미, 장기 유지력, 인물/관계, 문체 취향, 독자 반응 리포트를 한 번에 읽어 `reviews/masterpiece-readiness-report.json`을 저장한다. missing report, failing sample, false positive, holdout 부족, weak reader evidence가 있으면 `overallScore`가 높아도 `passed=false`로 남겨 실제 샘플 증거 부족을 한곳에서 확인할 수 있게 했다. 이후 보강으로 `--fail-on-not-ready`를 추가해 readiness 실패가 non-zero exit code로 이어지도록 했다. 최신 보강에서는 각 report의 source evidence freshness를 확인해 source 샘플/설정이 report보다 최신이면 `stale-report`로 차단한다.

추가 확인(2026-06-21 문체 지문 분리도):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 17 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 517 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1218 tests passed
- 추가로 `prose-taste-benchmark`가 usable 선호/비선호 샘플의 문체 metric 평균 차이를 `styleFingerprint`로 저장한다. `styleFingerprintStatus=weak` 또는 `not-enough-samples`이면 `weakStyleFingerprintCount=1`이 남고, 기본 설정에서는 `readyForStyleTuning=false`가 된다. `masterpiece-readiness`도 이 값을 weak evidence로 보아 종합 준비도 통과를 막는다.

추가 확인(2026-06-21 readiness report freshness):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/masterpiece/masterpiece-readiness-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 6 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 518 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1219 tests passed
- 추가로 `run-masterpiece-readiness`가 benchmark report와 대응 source evidence의 수정 시각을 비교한다. source evidence가 report보다 최신이면 해당 영역에 `stale-report` critical gap을 남기고 `passed=false`로 처리한다. 문체 취향 영역은 `reviews/prose-taste-benchmark`와 `meta/style-guide.json`, 독자 반응 영역은 `reviews/reader-response`와 `meta/quality-trend.json`까지 source freshness에 포함한다.

추가 확인(2026-06-21 readiness source provenance):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/masterpiece/masterpiece-readiness-cli.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts tests/masterpiece/premise-appeal-benchmark-cli.test.ts tests/masterpiece/character-relationship-benchmark-cli.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 19 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 519 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1220 tests passed
- 추가로 각 benchmark/calibration CLI report가 `sourceEvidence`에 source file SHA-256 digest를 기록한다. `run-masterpiece-readiness`는 현재 source digest와 report의 recorded digest를 비교하고, `sourceEvidenceStatus=mismatch` 또는 `not-recorded`이면 mtime이 정상이어도 `stale-report` critical gap으로 처리한다.

추가 확인(2026-06-21 readiness source evidence floor):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 10 passed
- 추가로 `run-masterpiece-readiness`가 대응 source 경로에서 실제 파일을 하나도 찾지 못하면 `no-source-evidence` critical gap을 남긴다. 이제 모든 영역의 report JSON이 있고 점수가 100이어도 `reviews/*-benchmark/`, `reviews/reader-response/`, `chapters/`, `world/`, `characters/`, `plot/`, `meta/style-guide.json` 같은 실제 입력 근거가 비어 있으면 98+ readiness가 통과하지 못한다. CLI 통과 테스트도 실제 source fixture와 matching `sourceEvidence` digest를 가진 리포트만 ready로 인정하게 바꿨다.

추가 확인(2026-06-21 readiness required source groups):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 11 passed
- 추가로 `run-masterpiece-readiness`가 source evidence를 전체 파일 수뿐 아니라 `benchmark-samples`, `chapters`, `style-guide`, `reader-panel`, `world`, `characters`, `plot` 같은 그룹별 coverage로 기록한다. 필수 그룹의 파일 수가 0이면 `missing-source-group-*` critical gap을 남긴다. 따라서 전제 리포트가 `meta/design-strategy.json` 하나만 근거로 갖고 실제 `reviews/premise-appeal-benchmark/` 샘플이 비어 있어도 98+ readiness를 통과하지 못한다.

추가 확인(2026-06-21 consistency source chapter claim check):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 13 passed
- 추가로 `run-masterpiece-readiness`가 source group별 project-relative file path를 기록하고, 장편 일관성 리포트의 `chapter_count`, `chapters_analyzed`, `chapter_range`가 주장하는 회차 수를 실제 `chapters/chapter_NNN.{json,md}` source ID 수와 대조한다. 리포트가 3개 회차 검증을 주장하지만 실제 chapter source가 1개 회차뿐이면 `consistency-source-chapter-mismatch` critical gap이 되어, 최신 digest를 가진 리포트라도 부풀려진 회차 coverage로 98+ readiness를 통과하지 못한다.

추가 확인(2026-06-21 consistency source manuscript grounding):

- 리서치 반영: 2026년 ConStory-Bench는 장편 생성의 일관성 오류를 검출할 때 판단을 명시적 텍스트 근거에 grounded 하는 자동 파이프라인을 함께 제시한다. 참고: https://arxiv.org/abs/2603.05890
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 15 passed
- 추가로 `run-masterpiece-readiness`가 장편 일관성 source group에서 chapter ID 수뿐 아니라 `chapter_NNN.md` 원고 파일 수와 `chapter_NNN.json` 메타데이터 파일 수를 분리해 본다. 리포트가 3개 회차 검증을 주장하고 `chapter_001.json`~`chapter_003.json`은 있지만 실제 원고 md가 없으면 `consistency-source-manuscript-mismatch` critical gap이 되어, 회차 번호만 맞춘 metadata-only source로 98+ readiness를 통과하지 못한다.

추가 확인(2026-06-21 consistency exact chapter id grounding):

- 추가로 `run-masterpiece-readiness`가 `chapters_analyzed` 또는 `chapter_range`에서 claimed chapter ID를 추출해 source chapter ID와 정확히 대조한다. 리포트가 1~3화를 검증했다고 주장하지만 source group에는 4~6화 원고와 메타데이터만 있어 수량이 맞는 경우에도 `consistency-source-chapter-id-mismatch`, `consistency-source-manuscript-id-mismatch`, `consistency-source-metadata-id-mismatch` critical gap이 되어, 엉뚱한 회차 파일로 장편 일관성 evidence를 대체하지 못한다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 17 passed

추가 확인(2026-06-21 회차 재미 issue-code coverage):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts`: 11 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/masterpiece/masterpiece-readiness-cli.test.ts tests/quality/masterpiece-readiness.test.ts tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts`: 14 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 521 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1222 tests passed
- 추가로 `engagement-benchmark`가 `requiredIssueCodes`, `issueCodeCoverage`, `usableIssueCodeCoverage`를 리포트하고, 누락·부족·검출 실패 issue-code coverage가 있으면 `readyForGateTuning=false`로 남긴다. `run-masterpiece-readiness`는 배열형 `underSampled...` 필드도 구체 coverage gap으로 집계한다.

추가 확인(2026-06-21 회차 재미 split leakage):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 14 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 12 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 522 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1223 passed
- 추가로 `engagement-benchmark`가 샘플별 `evidenceFingerprint`를 남기고, 동일 원고/회차/플롯/설계 evidence가 서로 다른 split에 중복되면 `splitLeakageCount`와 `splitLeakages`를 보고한다. leakage가 있으면 `readyForGateTuning=false`이며, `masterpiece-readiness`도 이를 critical gap으로 본다.

추가 확인(2026-06-22 회차 재미 positive high-point coverage):

- 리서치 반영: 2026년 StoryAlign은 스토리 선호 평가를 위해 인간 검증 선택작/거절작 샘플과 고품질 preference pair를 구축했고, 2026년 LitBench는 창작문이 객관 정답이 없어 인간 선호쌍 기반 검증이 필요하며 강한 zero-shot judge도 인간 선호 agreement가 제한적이라고 보고한다. WritingPreferenceBench도 객관 신호를 맞춘 뒤에는 주관적 글쓰기 선호 평가가 크게 어려워진다고 보고한다. 참고: https://arxiv.org/abs/2605.04831, https://aclanthology.org/2026.eacl-long.362.pdf, https://openreview.net/forum?id=eXjDR9Mphk
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts`: 15 passed
- `npm run validate:schemas`: passed
- `npx vitest run tests/quality/masterpiece-readiness.test.ts tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts`: 23 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 639 tests passed, required outputs 29 verified
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `engagement-benchmark`가 `positive_quality_codes`, `required_positive_quality_codes`, `minimum_samples_per_required_positive_quality_code`, `positiveQualityCoverage`, `usablePositiveQualityCoverage`, `missingRequiredPositiveQualityCodes`, `underSampledRequiredPositiveQualityCodes`, `underSampledUsableRequiredPositiveQualityCodes`를 지원한다. 이제 “문제 없는 원고”만 검증하는 것이 아니라, known-good 샘플이 서명 장면 이미지, 인물 매력 시그니처, 보상 쾌감, 장르 쾌감, 다음 화 강제력, 몰입감, 대화 subtext/turn, 인과 사슬 같은 양성 고점 품질을 실제로 대표하지 못하면 재미 게이트 튜닝 준비 완료가 되지 않는다.

추가 확인(2026-06-21 문체 취향 split leakage):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 18 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 12 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 523 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1224 passed
- 추가로 `prose-taste-benchmark`가 문체 샘플별 `evidenceFingerprint`를 남기고, 동일 문체 원고 evidence가 서로 다른 split에 중복되면 `splitLeakageCount`와 `splitLeakages`를 보고한다. leakage가 있으면 `readyForStyleTuning=false`이며, `masterpiece-readiness`도 이를 critical gap으로 본다.

추가 확인(2026-06-21 전제/인물/장기연재 split leakage):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/premise-appeal-benchmark.test.ts tests/quality/character-relationship-benchmark.test.ts tests/quality/series-retention-benchmark.test.ts tests/masterpiece/premise-appeal-benchmark-cli.test.ts tests/masterpiece/character-relationship-benchmark-cli.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 20 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 12 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 526 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1227 passed
- 추가로 `premise-appeal-benchmark`, `character-relationship-benchmark`, `series-retention-benchmark`가 샘플별 `evidenceFingerprint`를 남기고, 동일 전제/인물관계 focus/회차 시퀀스 evidence가 calibration/validation/holdout 사이에 중복되면 `splitLeakageCount`와 `splitLeakages`를 보고한다. leakage가 있으면 각 벤치마크의 `readyForGateTuning=false`로 남아 독립 holdout이 아닌 샘플로 전제, 드라마, 장기 연재 게이트를 튜닝하지 못하게 한다.

추가 확인(2026-06-21 설정 설명 대사 문체 gate):

- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 40 passed
- `npx vitest run tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 12 passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 529 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1230 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 따옴표 대사에서 설정, 사건 규칙, 세계관 원리 설명이 과밀한 경우 `expository-dialogue-dump`로 차단한다. `max_expository_dialogue_ratio`를 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결해 설명 대사 과다를 사용자 문체 취향 샘플과 holdout 검증 안에서 조정할 수 있게 했다.

추가 확인(2026-06-21 대화-인과 경로 issue coverage):

- `npx vitest run tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts`: 163 passed
- `npm run validate:schemas`: passed
- 추가로 `templates/engagement-benchmark.template.json`의 기본 `required_issue_codes`에 `manuscript-dialogue-subtext-not-evidenced`, `manuscript-dialogue-turn-not-evidenced`, `manuscript-dialogue-state-carryover-not-evidenced`, `manuscript-character-voice-not-differentiated`, `manuscript-causal-chain-not-evidenced`를 추가했다. 대화가 말싸움이나 정보 전달로만 존재하고 인과 경로, 관계 상태, 다음 행동을 바꾸지 못하는 known-bad 샘플이 없으면 engagement gate tuning이 준비 완료로 보이지 않게 했다.

추가 확인(2026-06-21 전지적 티저 문체 gate):

- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 43 passed
- `npm run validate:schemas`: passed
- `npx tsc --noEmit`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 533 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1234 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 구체 장면 근거 없이 “그는 아직 몰랐다”, “이것이 모든 비극의 시작이었다”, “운명은 이미 움직이고 있었다”처럼 운명/시작/예고를 선언하는 문장을 `generic-omniscient-teaser`로 차단한다. 기본 balanced 기준은 `maxGenericTeaserDensityPer1000=2`로 두어, 후킹을 장면 속 물증·선택 비용·상대 반응·다음 행동 압박으로 만들지 않고 전지적 선언으로 때우는 AI식 문체를 더 엄격하게 막는다. `style-guide`/`prose-taste-benchmark` schema와 template, benchmark CLI, style fingerprint metric에도 연결해 장르별 예외는 프로젝트 프로필에서 조정할 수 있게 했다.

추가 확인(2026-06-21 문체 취향 회차 게이트 연결):

- 리서치 반영: 2025-2026년 creative writing evaluation 연구는 자동 LLM judge와 인간 취향 사이의 불일치, AI 문체의 낮은 불확실성/동질성, 문화·독자군별 선호 차이를 주요 한계로 보고한다. 이에 따라 `reviews/prose-taste-benchmark-report.json`의 독자 라벨 문체 샘플을 `/verify-chapter`의 `apply-chapter-gate`에 연결해, 자동 문체 점수가 통과시킨 비선호 문체 false positive가 실제 회차 완료를 통과하지 못하게 했다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 46 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 541 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1242 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-benchmark`가 샘플별 `chapter`와 `version`을 결과에 보존하고, `apply-chapter-gate`가 현재 회차의 문체 벤치마크 false positive, missing issue, 비선호 회차 샘플을 `proseCraft` 실패로 병합한다. 미래 회차에만 붙은 문체 샘플은 현재 회차를 막지 않으며, 실패 시 `style_friction_annotations`가 `Prose Craft Revision Directives`로 전달된다. 이제 사용자가 “문체가 거슬렸다”고 표시한 현재 회차 샘플은 validator consensus와 engagement가 높아도 Ralph Loop를 `RETRY`로 돌린다.

추가 확인(2026-06-21 문체 취향 회차 샘플 원고 grounding):

- 리서치 반영: 2026년 LitBench는 창작문 자동 judge가 인간 선호와 완전히 일치하지 않으며, 강한 zero-shot judge도 인간 선호 agreement가 제한적이라고 보고한다. 따라서 독자 라벨 문체 샘플을 회차 완료 hard block에 쓸 때는 “chapter 라벨이 붙었다”는 메타데이터만으로 부족하고, 그 샘플이 실제 현재 회차 원고에서 읽힌 근거인지까지 확인해야 한다. 참고: https://aclanthology.org/2026.eacl-long.362/
- 추가로 `run-prose-taste-benchmark`가 샘플 결과에 `contentSource`, `contentPath`, `chapterSourceGrounded`를 기록한다. `chapter`만 붙은 inline fixture나 별도 `content_path` 샘플은 현재 회차 hard block 근거가 아니라 경고로 남고, 실제 `chapters/chapter_NNN.md`에서 읽힌 샘플만 `chapterSourceGrounded=true`로 회차 완료를 차단한다.
- 추가로 `content_path` 파일도 `sourceEvidence` digest에 포함해, 문체 fixture나 외부 샘플 파일이 바뀌었는데 오래된 `reviews/prose-taste-benchmark-report.json`으로 회차 gate/readiness가 통과하지 못하게 했다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 34 passed

추가 확인(2026-06-21 인물/관계 회차 게이트 연결):

- 리서치 반영: narrative transportation 연구는 독자의 정서 반응과 주인공에 대한 반응을 몰입의 핵심 축으로 보며, 최근 창작 평가 연구도 자동 judge와 실제 인간 선호의 불일치를 반복적으로 지적한다. 이에 따라 `reviews/character-relationship-benchmark-report.json`의 현재 회차 타깃 독자 샘플을 `/verify-chapter`의 `apply-chapter-gate`에 연결해, 자동 드라마 점수는 높지만 독자가 인물 결과나 관계 전환을 care하지 않는 회차가 완료되지 못하게 했다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/character-relationship-benchmark.test.ts tests/masterpiece/character-relationship-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 34 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 542 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1243 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `character-relationship-benchmark`가 결과에 `focus`와 `readerEvidence`를 보존하고, `apply-chapter-gate`가 현재 회차의 evidence-sufficient `automated-false-positive`, `weak-reader-investment`, `weak-dimension`, known-flat 샘플을 `readerResponse` 실패로 병합한다. 실패 시 `Reader Response / Character Relationship Revision Directives`가 agency, vulnerable cost, reciprocal pressure, subtext, turn consequence, next scene interest와 독자 rewrite cue를 그대로 전달한다. 이제 관계 전환이 구조상 존재해도 상대의 조건, 주인공의 대가, 관계 변화 결과가 약하면 validator consensus와 engagement/proseCraft가 높아도 Ralph Loop는 `RETRY`로 돌아간다.

추가 확인(2026-06-21 회차 게이트 report source freshness):

- 리서치 반영: 2026년 LitBench는 강한 LLM judge도 인간 창작 선호와 완전하게 일치하지 않는다고 보고하며, long-form judge 연구도 긴 출력 평가에서 reference/rubric만으로 신뢰성이 충분하지 않을 수 있음을 지적한다. 따라서 회차 완료 gate는 평가 리포트의 점수뿐 아니라 그 리포트가 현재 입력 소스에서 생성된 것인지도 확인해야 한다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 31 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 545 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1246 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `apply-chapter-gate`가 현재 회차에 적용되는 `prose-taste`, `reader-response`, `character-relationship`, `series-retention` report의 `sourceEvidence` digest를 현재 입력 소스와 비교한다. digest가 맞지 않거나, 실제 benchmark/calibration 입력 소스가 있는데 report가 source evidence를 기록하지 않았으면 `stale-report:*`로 회차 gate를 `RETRY` 처리한다. 이제 낡은 독자 패널/문체/인물관계/장기유지 리포트가 validator consensus와 높은 점수 뒤에 숨어 Ralph Loop 완료 근거로 쓰이지 못한다.

추가 확인(2026-06-21 장편 일관성 report freshness):

- 리서치 반영: LongJudgeBench는 긴 출력 평가가 문서 수준 요구와 judge reliability 문제를 함께 가진다고 보고하고, 2026년 agent provenance survey는 입력 컨텍스트와 evidence lineage가 검증·디버깅·신뢰 조정의 중심 계층이라고 본다. NIST SHA 표준도 digest를 생성 이후 메시지 변경 감지 용도로 설명한다. 따라서 장편 일관성 리포트는 회차 범위와 domain coverage만 맞으면 안 되고, 현재 canonical source와 같은 상태에서 생성됐는지도 확인해야 한다. 참고: [LongJudgeBench](https://arxiv.org/html/2606.01629v1), [Evidence Tracing and Execution Provenance in LLM Agents](https://arxiv.org/html/2606.04990v1), [NIST FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts -t "consistency"`: 3 passed
- `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 31 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 545 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1246 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `apply-chapter-gate`가 `reviews/consistency-report.json`을 현재 회차 완료 판정에 쓰기 전에 `chapters/`, `world/`, `characters/`, `plot/`, `context/summaries/`의 source freshness를 확인한다. report가 `sourceEvidence`를 기록했다면 digest mismatch를 차단하고, sourceEvidence가 없는 수동 리포트라도 report 작성 뒤 canonical source가 더 최신이면 `stale-report:consistency-report`로 Ralph Loop를 `RETRY` 처리한다. 이제 원고나 캐릭터 canon을 고친 뒤 오래된 일관성 리포트로 회차 완료가 통과하지 못한다.

추가 확인(2026-06-21 장기 연재 funnel evidence):

- 리서치 반영: cohort retention 분석은 평균 반응이 숨기는 유지/이탈 차이를 시작 집단별로 추적하는 방식이다. Mixpanel의 2026 cohort analysis 설명은 평균이 누가 남고 누가 이탈하는지 숨길 수 있다고 설명하고, Amplitude는 cohort를 engagement/conversion/retention 이해 단위로 본다. StrataScratch의 retention SQL 가이드는 retention을 시작 population 대비 남은 사용자 비율로 계산하며 aggregate retention이 신규 cohort churn을 숨길 수 있다고 설명한다. Royal Road 작가 포럼에서도 1화에서 2화로 넘어가는 view rate와 early drop-off를 실전 연재 문제로 다룬다. 참고: [Mixpanel Cohort Analysis in 2026](https://mixpanel.com/blog/cohort-analysis/), [Amplitude Cohorts to Improve Retention](https://amplitude.com/blog/cohorts-to-improve-your-retention/), [StrataScratch Retention in SQL](https://www.stratascratch.com/blog/retention-in-sql-how-to-calculate-user-and-cohort-retention), [Royal Road forum](https://www.royalroad.com/forums/thread/163860).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/series-retention-benchmark.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 46 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 546 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1247 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `series-retention-benchmark`가 회차별 started/completed/continued/drop-off/skimmed funnel count를 받아 `funnelEvidence`, `funnelPassed`, completion/continuation/drop-off/skimming ratio를 계산한다. `weak-funnel-evidence`는 gate tuning 근거 부족으로 남고, evidence-sufficient `reader-funnel-drop`은 `apply-chapter-gate`에서 Ralph Loop `RETRY`로 연결된다. 이제 남은 독자 점수와 comment가 좋아도 시작 독자가 완독하지 않거나 다음 회차로 넘어가지 않으면 장기 연재 통과로 보지 않는다.

추가 확인(2026-06-21 기계적 짧은 대사 응답 chain 문체 gate):

- 리서치 반영: creative writing 평가 연구는 문학적 문체 판단이 주관적이고 attribution label에 의해 기준이 뒤집힐 수 있다고 보고하며, divergent creativity 연구는 반복 substring과 구조적 다양성을 창작 텍스트 분석의 보조 지표로 본다. 따라서 새 gate는 AI 판별이 아니라 사용자가 실제로 거슬려 한 문체 습관, 즉 짧은 확인·동의 대사가 연쇄되어 대화가 자동 응답처럼 보이는 문제만 프로젝트별 threshold로 차단한다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 47 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 549 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1250 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 따옴표 대사에서 “네/그래/알겠어/맞아/그렇지” 같은 짧은 확인·동의 응답의 비율과 최장 연쇄 길이를 `roteDialogueReplyCount`, `roteDialogueReplyRatio`, `longestRoteDialogueReplyRun` metric으로 계산하고, 기본 balanced 기준에서 비율 0.5 초과 또는 3턴 초과 연쇄를 `rote-dialogue-response-chain`으로 기록한다. `max_rote_dialogue_reply_ratio`와 `max_rote_dialogue_reply_run`은 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결되어 장르별 clipped banter 예외는 프로젝트 프로필에서 조정할 수 있다.

추가 확인(2026-06-21 기계적 대사 태그 chain 문체 gate):

- 리서치 반영: 대사 태그와 action beat 자료는 태그가 화자 식별에는 필요하지만 너무 반복되면 대화 자체보다 귀속 장치가 앞서고, action beat가 인물의 행동·감정·서브텍스트와 장면 grounding을 함께 제공한다고 본다. 따라서 새 gate는 태그 사용 자체를 금지하지 않고, 대사 뒤 말했다/물었다/대답했다 같은 중립 태그가 과밀해 화자 귀속 리듬이 말의 충돌을 덮는 경우만 프로젝트별 threshold로 차단한다. 참고: [Institute for Writers, dialogue tags and beats](https://www.instituteforwriters.com/writing-dialogue-tags-and-beats/), [Rabbit with a Red Pen, dialogue tags and action beats](https://www.rabbitwitharedpen.com/blog/writing-dialogue-tags-action-beats-punctuation), [Learn How To Write A Novel, action beats with dialogue](https://learnhowtowriteanovel.com/blog/2023/08/10/benefits-of-using-action-beats-with-dialogue/).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 50 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 552 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1253 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 따옴표 대사 뒤 80자 이내의 중립 발화 태그를 `neutralDialogueTagCount`, `neutralDialogueTagRatio`, `longestNeutralDialogueTagRun` metric으로 계산하고, 기본 balanced 기준에서 비율 0.65 초과 또는 4턴 초과 연쇄를 `mechanical-dialogue-tag-chain`으로 기록한다. `max_neutral_dialogue_tag_ratio`와 `max_neutral_dialogue_tag_run`은 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결되어 장르별 빠른 문답 예외는 프로젝트 프로필에서 조정할 수 있다.

추가 확인(2026-06-21 상투적 반응 beat chain 문체 gate):

- 리서치 반영: 2024년 physiological narrated perception 연구는 신체 내부 감각 묘사가 독자의 embodied storyworld 경험과 emotion imagery를 강화할 수 있지만, 그 효과는 맥락 속에서 underspecification과 self-relevance를 만들어낼 때 의미가 있다고 본다. 따라서 새 gate는 신체 반응을 금지하지 않고, “숨을 삼켰다/입술을 깨물었다/시선을 피했다”가 선택, 정보, 압박, 결과 없이 감정 표식으로 반복될 때만 차단한다. 또한 2025년 creative writing stylometry 연구는 AI 창작 산문이 유창해도 더 좁고 균일한 패턴으로 묶일 수 있다고 보고하므로, `stockReactionBeatDensityPer1000`과 `longestStockReactionBeatRun`을 style fingerprint에 넣어 반복 반응 beat가 프로젝트 문체 지문을 평평하게 만드는지 확인한다. 참고: [Imagining emotions in storyworlds](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2024.1336286/full), [Stylometric comparisons of human versus AI-generated creative writing](https://www.nature.com/articles/s41599-025-05986-3), [UCC study summary](https://www.ucc.ie/en/news/2025/new-study-reveals-that-ai-cannot-fully-write-like-a-human.html).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 53 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 565 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1266 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 상투적 반응 beat 수와 최장 연쇄 길이를 `stockReactionBeatDensityPer1000`, `longestStockReactionBeatRun` metric으로 계산하고, 기본 balanced 기준에서 밀도 8/1000문장 초과 및 최소 4회 이상이거나 3문장 초과 연쇄일 때 `stock-reaction-beat-chain`으로 기록한다. `max_stock_reaction_beat_density_per_1000`과 `max_stock_reaction_beat_run`은 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결되어 장르별 gesture-heavy 문체 예외는 프로젝트 프로필에서 조정할 수 있다.

추가 확인(2026-06-21 모호한 분위기 수식 chain 문체 gate):

- 리서치 반영: concreteness 연구는 더 구체적인 텍스트가 이해도, 흥미, 회상에서 유리하게 작동할 수 있고, 추상 내용을 구체 예시와 연결하지 않으면 흥미와 기억이 약해지기 쉽다고 본다. 따라서 새 gate는 분위기 자체를 금지하지 않고, “묘한 공기/알 수 없는 감각/무거운 침묵/낯선 긴장/불길한 예감” 같은 수식이 구체 물증, 소리, 선택 변화, 관계 조건, 장면 상태 변화 없이 연속될 때만 `vague-atmosphere-modifier-chain`으로 차단한다. 참고: [Engaging Texts: Effects of Concreteness](https://www.researchgate.net/profile/Mark-Sadoski/publication/232552637_Engaging_texts_Effects_of_concreteness_on_comprehensibility_interest_and_recall_in_four_text_types/links/569fa36e08ae4af52546bdc6/Engaging-texts-Effects-of-concreteness-on-comprehensibility-interest-and-recall-in-four-text-types.pdf), [Resolving the Effects of Concreteness](https://link.springer.com/article/10.1023/A%3A1016675822931).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 56 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 568 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1269 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 모호한 분위기 수식 수와 최장 연쇄 길이를 `vagueAtmosphereModifierDensityPer1000`, `longestVagueAtmosphereModifierRun` metric으로 계산하고, 기본 balanced 기준에서 밀도 8/1000자 초과 및 최소 5회 이상이거나 3문장 초과 연쇄일 때 `vague-atmosphere-modifier-chain`으로 기록한다. `max_vague_atmosphere_modifier_density_per_1000`과 `max_vague_atmosphere_modifier_run`은 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결되어 uncanny/lyrical 장르 예외는 프로젝트 프로필에서 조정할 수 있다.

추가 확인(2026-06-21 완충 부사 cadence 문체 gate):

- 리서치 반영: show-don't-tell 계열 편집 조언은 부사 의존과 감정명 설명이 장면을 보여주기보다 말해버리는 습관으로 굳기 쉽다고 본다. 또한 filter/filler word 편집 관점은 불필요한 완충어가 POV 체험과 독자 사이의 거리를 늘리고 문장을 약하게 만들 수 있다고 본다. 따라서 새 gate는 부사 자체를 금지하지 않고, “천천히/조용히/가만히/살짝/잠시/그대로” 같은 부사가 동사, 물건 변화, 선택 비용, 상대 반응 없이 연쇄될 때만 `filler-adverb-cadence`로 차단한다. 참고: [Helping Writers Become Authors - Show, Don't Tell](https://www.helpingwritersbecomeauthors.com/critique-8-quick-tips-for-show-dont-tell/), [Louise Harnby - Filter Words](https://www.louiseharnbyproofreader.com/blog/filter-words-in-fiction-purposeful-inclusion-and-dramatic-restriction), [Miranda Darrow - Concise Language](https://www.mirandadarrow.com/concise-language-cut-the-clutter-and-filler-words-for-more-active-prose/).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 104 passed
- `npm run validate:schemas`: passed
- `git diff --check`: passed (CRLF warnings only)
- `npm test`: 61 files, 1298 tests passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, required outputs 29 verified
- 추가로 `prose-taste-gate`가 완충 부사 수와 최장 연쇄 길이를 `fillerAdverbDensityPer1000`, `longestFillerAdverbRun` metric으로 계산하고, 기본 balanced 기준에서 밀도 5/1000자 초과 및 최소 5회 이상이거나 4문장 초과 연쇄일 때 `filler-adverb-cadence`로 기록한다. `max_filler_adverb_density_per_1000`과 `max_filler_adverb_run`은 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric, `apply-chapter-gate`의 style-guide reader에 연결되어 hush/quiet/lyrical 장면의 예외는 프로젝트 프로필에서 조정할 수 있다.

추가 확인(2026-06-21 자문형 의문문 drift 문체 gate):

- 리서치 반영: curiosity gap은 질문이 독자의 정보 공백을 드러낼 때 힘을 갖지만, rhetorical question은 맥락과 논지 강도에 따라 사고를 돕거나 방해할 수 있고, 서사 설득/몰입은 인물·장면·갈등·미해결 질문·해결이 cohesive하게 조직될수록 처리 유창성이 높아진다. 따라서 새 gate는 질문 자체를 금지하지 않고, “왜/어떻게/정말/걸까” 같은 자문형 의문문이 실제 확인 행동, 새 단서, 선택 비용, 상대 반응 없이 장면 진행을 대신할 때만 `rhetorical-question-drift`로 차단한다. 참고: [Loewenstein Curiosity](https://www.cmu.edu/dietrich/sds/docs/loewenstein/Curiosity_IntlHandbookEmotEduc.pdf), [Effects of rhetorical questions on persuasion](https://www.researchgate.net/publication/232475917_Effects_of_rhetorical_questions_on_persuasion_A_cognitive_response_analysis), [Narratives are Persuasive Because They are Easier to Understand](https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2021.719615/full).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 59 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 571 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1272 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 자문형 의문문 수와 최장 연쇄 길이를 `rhetoricalQuestionDensityPer1000`, `longestRhetoricalQuestionRun` metric으로 계산하고, 기본 balanced 기준에서 밀도 6/1000자 초과 및 최소 4회 이상이거나 3문장 초과 연쇄일 때 `rhetorical-question-drift`로 기록한다. `max_rhetorical_question_density_per_1000`과 `max_rhetorical_question_run`은 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결되어 interrogative/lyrical 장르 예외는 프로젝트 프로필에서 조정할 수 있다.

추가 확인(2026-06-21 속뜻 해설문 overexplanation 문체 gate):

- 리서치 반영: 서사 이해 연구는 독자가 인물의 의도, 목표, 행동을 해석할 때 theory-of-mind 네트워크와 인물 정신상태 추론을 사용한다고 본다. 읽기 이해도 역시 인물의 정신상태를 이해하고 텍스트 정보로 추론을 구성하는 능력과 연결된다. 따라서 새 gate는 서브텍스트 자체를 금지하지 않고, “그 침묵은 거절이라는 뜻이었다”, “그 시선은 믿지 못하겠다는 의미였다”처럼 독자가 행동·오해·대화 반응으로 읽어야 할 뜻을 서술자가 곧바로 번역할 때만 `subtext-overexplanation-chain`으로 차단한다. 참고: [Theory-of-Mind Cortical Network in Narrative Comprehension](https://pmc.ncbi.nlm.nih.gov/articles/PMC2756681/), [Theory of Mind: a Hidden Factor in Reading Comprehension?](https://templeinfantlab.com/wp-content/uploads/sites/2/2018/09/Doreetal2018_TheoryOfMind.pdf), [Using Fiction to Assess Mental State Understanding](https://pmc.ncbi.nlm.nih.gov/articles/PMC3820595/).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 62 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 574 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1275 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 속뜻 해설문 수와 최장 연쇄 길이를 `subtextExplanationDensityPer1000`, `longestSubtextExplanationRun` metric으로 계산하고, 기본 balanced 기준에서 밀도 5/1000자 초과 및 최소 3회 이상이거나 3문장 초과 연쇄일 때 `subtext-overexplanation-chain`으로 기록한다. `max_subtext_explanation_density_per_1000`과 `max_subtext_explanation_run`은 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결되어 interpretive narration 예외는 프로젝트 프로필에서 조정할 수 있다.

추가 확인(2026-06-21 무응답 침묵 stall 문체 gate):

- 리서치 반영: 대화 분석 연구는 발화 턴 교환이 대화 조직의 기본 단위이고, 대화가 국소적으로 관리되며 수신자에 민감하게 조직된다고 본다. Grice의 협력 원리는 대화 기여가 현재 교환의 목적과 방향에 맞게 정보량, 관련성, 명료성을 가져야 한다고 설명한다. 창작론에서도 침묵은 회피, 불편함, 권력관계, 캐릭터 변화를 드러낼 수 있지만, 효과적인 침묵은 비어 있는 반복이 아니라 장면의 의미와 다음 반응을 싣는 장치다. 따라서 새 gate는 침묵 자체를 금지하지 않고, “아무 말도 하지 않았다”, “대답하지 않았다”, “입을 열지 않았다”, “침묵이 이어졌다” 같은 무응답 beat가 실제 조건 변화, 관계 전환, 잘못된 추론, 선택 비용 없이 반복될 때만 `dialogue-silence-stall-chain`으로 차단한다. 참고: [Sacks/Schegloff/Jefferson turn-taking summary](https://www.conversationanalysis.org/schegloff-media-archive/simplest-systematics-for-turn-taking-language-1974/), [Paul Grice - Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/grice/), [4 Ways to use Silence in your Fiction](https://thejohnfox.com/2023/12/4-ways-to-use-silence-in-your-fiction/).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 65 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 577 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1278 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 무응답/침묵 stall 문장 수와 최장 연쇄 길이를 `silenceStallDensityPer1000`, `longestSilenceStallRun` metric으로 계산하고, 기본 balanced 기준에서 밀도 4/1000자 초과 및 최소 3회 이상이거나 3문장 초과 연쇄일 때 `dialogue-silence-stall-chain`으로 기록한다. `max_silence_stall_density_per_1000`과 `max_silence_stall_run`은 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결되어 withheld-dialogue/문예적 침묵 예외는 프로젝트 프로필에서 조정할 수 있다.

추가 확인(2026-06-21 과장 감정 캡션 chain 문체 gate):

- 리서치 반영: narrative transportation 연구는 서사 몰입이 주의, 감정, 심상이 narrative event에 집중되는 경험이라고 보고, 독자는 설정과 인물에 대한 vivid mental images를 형성할 때 더 강하게 몰입한다고 본다. mental imagery 연구도 소설 읽기가 시각뿐 아니라 청각, 후각, 미각 등 여러 감각 양식의 심상을 유발한다고 설명한다. 창작론의 show-don't-tell 지침 역시 감정명이나 감정 결론을 먼저 붙이기보다 행동, 표정, 몸 반응, 생각, 언어가 맥락에서 감정을 발생시키게 하라고 권한다. 따라서 새 gate는 큰 감정 표현 자체를 금지하지 않고, “믿을 수 없었다/말도 안 됐다/모든 것이 무너졌다/세상이 멈춘 듯했다” 같은 감정 결론 캡션이 실제 손실, 선택 변화, 관계 조건, 장면 물증 없이 연쇄될 때만 `melodramatic-emotion-caption-chain`으로 차단한다. 참고: [Green & Appel, Narrative Transportation preprint](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf), [Mental Imagery - Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/mental-imagery/), [Show, Don't Tell craft note](https://www.helpingwritersbecomeauthors.com/critique-8-quick-tips-for-show-dont-tell/).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 68 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 580 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1281 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `prose-taste-gate`가 과장 감정 캡션 문장 수와 최장 연쇄 길이를 `melodramaticCaptionDensityPer1000`, `longestMelodramaticCaptionRun` metric으로 계산하고, 기본 balanced 기준에서 밀도 4/1000자 초과 및 최소 3회 이상이거나 3문장 초과 연쇄일 때 `melodramatic-emotion-caption-chain`으로 기록한다. `max_melodramatic_caption_density_per_1000`과 `max_melodramatic_caption_run`은 `style-guide`/`prose-taste-benchmark` schema와 template, 프로젝트 benchmark CLI, style fingerprint metric에 연결되어 heightened narration/멜로드라마 장르 예외는 프로젝트 프로필에서 조정할 수 있다.

추가 확인(2026-06-21 독자 패널 human provenance gate):

- 리서치 반영: AAPOR의 2026년 AI 설문 연구 지침은 synthetic response가 조사 유효성, 공개, 투명성 문제를 만들 수 있다고 경고하고, Cambridge Political Analysis의 synthetic survey data 연구는 LLM이 인간 설문 응답을 대체할 때 인간 집단의 실제 분포와 불일치할 위험을 지적한다. Pew의 설문 문항 작성 지침은 응답 품질을 위해 질문 문구, 응답 옵션, 조사 절차를 명확히 관리해야 한다고 본다. 따라서 98+ readiness에서 “독자 반응”은 AI가 흉내 낸 독자나 작가 추정치가 아니라, 출처가 기록된 인간 독자 반응이어야 한다. 참고: [AAPOR Responsible AI Integration in Survey Research](https://aapor.org/wp-content/uploads/2026/05/Responsible-AI-Integration-In-Survey-Research.pdf), [Synthetic Replacements for Human Survey Data?](https://www.cambridge.org/core/journals/political-analysis/article/synthetic-replacements-for-human-survey-data-the-perils-of-large-language-models/B92267DC26195C7F36E63EA04A47D2FE), [Pew Research Center, Writing Survey Questions](https://www.pewresearch.org/writing-survey-questions/).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 47 passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 582 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1283 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `reader-response-calibration`이 `respondent_source`, `human_respondent_count`, `synthetic_respondent_count`, `author_estimate_count`를 받아 `humanReaderEvidence`, `humanRespondentRatio`, `lowHumanReaderEvidenceCount`, `humanReaderEvidenceCount`를 산출한다. 기본 설정에서는 인간 독자 비율 80% 미만, synthetic AI, author estimate, unknown provenance, 인간 응답 수가 불명확한 mixed 샘플을 threshold retuning usable evidence에서 제외하고, `masterpiece-readiness`도 `low-human-reader-evidence-count`를 major gap으로 처리한다.

추가 확인(2026-06-21 독자 패널 response data-quality gate):

- 리서치 반영: AAPOR의 온라인 표본 data quality report는 전문 응답자, 부주의 응답, speeders, satisficing, straightlining을 온라인 표본 품질 위험으로 다룬다. Pew의 bogus respondent 분석은 attention check와 speeding check만으로는 허위/저품질 응답 대부분을 잡지 못한다고 보고하며, AAPOR Best Practices는 조사 생애주기 전반에서 response와 paradata 분포를 모니터링해야 한다고 본다. 또한 Pew의 2026년 Q&A는 AI와 악의적 응답자가 opt-in survey 품질을 위협하고 대규모 가짜 응답을 만들 수 있다고 설명한다. 따라서 인간 독자 출처만 확인해서는 부족하고, 패널 응답의 읽기 시간, 속독, 직선응답, 중복, 봇 의심, 자유응답 품질, 반복 문항 일관성을 별도 gate로 분리해야 한다. 참고: [AAPOR Data Quality Metrics for Online Samples](https://aapor.org/wp-content/uploads/2023/02/Task-Force-Report-FINAL.pdf), [Pew, Two common checks fail to catch most bogus cases](https://www.pewresearch.org/methods/2020/02/18/two-common-checks-fail-to-catch-most-bogus-cases/), [AAPOR Best Practices](https://aapor.org/standards-and-ethics/best-practices/), [Pew Q&A: AI and bogus respondents](https://www.pewresearch.org/short-reads/2026/05/12/qa-do-ai-and-bogus-respondents-threaten-pollings-future/).
- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 583 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1284 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `reader-response-calibration`이 `median_read_time_seconds`, `minimum_read_time_seconds`, `speeding_response_count`, `straight_lining_response_count`, `duplicate_response_count`, `bot_suspected_response_count`, `low_quality_open_ended_response_count`, `inconsistent_response_count`, `quality_flagged_response_count`를 받아 `responseDataQuality`, `responseDataQualityIssues`, `lowResponseDataQualityCount`, `responseDataQualityEvidenceCount`를 산출한다. 기본 설정에서는 timing/speeding 근거와 pattern/fraud 근거가 모두 있어야 `responseDataQuality=usable`이며, 없거나 약한 샘플은 threshold retuning usable evidence에서 제외하고 `masterpiece-readiness`도 `low-response-data-quality-count`를 major gap으로 처리한다.

추가 확인(2026-06-21 독자 패널 revision outcome gate):

- 리서치 반영: Nielsen Norman Group은 A/B testing을 변형들을 실제 사용자에게 노출해 사전에 정한 성공 지표로 어떤 변형이 더 나은지 비교하는 정량 방법으로 설명한다. Sage의 writing quasi-experimental collection은 일반적인 준실험 연구가 pre-test, intervention, post-test와 control/experimental group 변형을 가진다고 설명하고, What Works Clearinghouse의 quasi-experiment 지침은 baseline equivalence와 baseline 변수를 고려해야 개입 효과를 믿을 수 있다고 본다. peer assessment writing 연구도 feedback이 draft revision에 어떤 영향을 주는지 비교한다. 따라서 reader-response revision directive는 “좋아 보이는 지시”로 끝나면 안 되고, baseline 원고와 revised 원고의 독자 점수 상승 또는 blind before/after 선호를 별도 evidence로 남겨야 한다. 참고: [NN/g A/B Testing 101](https://www.nngroup.com/articles/ab-testing/), [Sage Written Communication quasi-experimental collection](https://journals.sagepub.com/page/wcx/collection/classroom/quasi-experimental), [WWC Designing Quasi-Experiments](https://ies.ed.gov/ncee/wwc/document/256), [Frontiers peer assessment feedback and draft revision](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.1070618/full).
- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 585 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1286 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `reader-response-calibration`이 `revision_pair_id`, `revision_baseline_reader_score`, `revision_current_reader_score`, `revision_preference_revised_count`, `revision_preference_baseline_count`, `revision_preference_tie_count`, `revision_preference_respondent_count`, `revision_blind_comparison`, `revision_same_reader_cohort`, `revision_question_wording_disclosed`, `revision_guardrail_regression_count`를 받아 `revisionOutcomeEvidence`, `revisionLift`, `revisionPreferenceWinRate`, `revisionRegressionCount`, `lowRevisionOutcomeEvidenceCount`를 산출한다. `require_revision_outcome_evidence`가 켜진 프로젝트에서는 개정 효과가 검증되지 않은 샘플을 threshold retuning usable evidence에서 제외하고, 개정본이 baseline보다 퇴보하면 `masterpiece-readiness`가 `revision-regression-count` critical gap으로 처리한다.

추가 확인(2026-06-21 독자 패널 revision outcome 회차 게이트 연결):

- 리서치 반영: A/B testing은 실제 사용자에게 변형을 비교 노출하고 사전 성공 지표로 더 나은 변형을 고르는 방식이며, 준실험 설계는 개입 전 baseline과 개입 후 outcome을 분리해 봐야 개입 효과를 판단할 수 있다고 본다. 따라서 독자 반응 개정 효과는 readiness 보고서에만 남아서는 부족하고, 실제 `/verify-chapter` 완료 판정이 baseline보다 퇴보한 개정본을 즉시 막아야 한다. 참고: [NN/g A/B Testing 101](https://www.nngroup.com/articles/ab-testing/), [WWC Designing Quasi-Experiments](https://ies.ed.gov/ncee/wwc/document/256), [Sage Written Communication quasi-experimental collection](https://journals.sagepub.com/page/wcx/collection/classroom/quasi-experimental).
- `npx tsc --noEmit`: passed
- `npm run validate:schemas`: passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 586 integrity tests passed, required outputs 29 verified
- `npm test`: 61 files, 1287 tests passed
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `apply-chapter-gate`가 현재 회차의 usable reader-response sample에서 `revisionOutcomeEvidence=regressed`를 발견하면 `failureType=revision-regression`으로 `readerResponse.passed=false`를 반환하고 Ralph Loop를 `RETRY`로 돌린다. 재시도 프롬프트에는 `revision-outcome` directive가 포함되어 baseline 대비 하락한 점수, blind preference, guardrail regression을 원인으로 삼아 개정 방향을 되돌리거나 다시 검증하게 한다.

추가 확인(2026-06-21 독자 패널 evidence collection plan):

- 리서치 반영: AAPOR Best Practices는 좋은 조사 품질이 설계, 수집, 분석 전 과정에서 문제를 예방·측정·처리하는 데 달려 있다고 보고, 온라인 패널 data quality 지침은 대표성·표본 품질·투명성을 completion rate 너머에서 평가해야 한다고 설명한다. Pew의 survey question 지침은 문항 문구, 문항 순서, 응답 옵션이 결과를 바꿀 수 있으므로 명확하고 편향을 줄인 질문 설계가 필요하다고 본다. AAPOR의 paradata 논의도 completion/breakoff, 응답 시간, 문항 상호작용 로그가 온라인 응답 품질 문제를 드러낼 수 있다고 설명한다. 따라서 reader-response gate는 “샘플 부족”이라는 추상 경고에서 멈추지 않고, 어떤 독자 패널 증거를 다음에 수집해야 하는지 실행 가능한 작업표를 남겨야 한다. 참고: [AAPOR Best Practices](https://aapor.org/standards-and-ethics/best-practices/), [AAPOR Data Quality Metrics for Online Samples](https://aapor.org/reports/data-quality-metrics-for-online-samples-considerations-for-study-design-analysis/), [Pew Research Center, Writing Survey Questions](https://www.pewresearch.org/writing-survey-questions/), [AAPOR Paradata to Shed Light on Data Quality Issues](https://aapor.org/newsletters/paradata-shed-light/).
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/reader-response-calibration.test.ts`: 39 passed
- `npx vitest run tests/masterpiece/reader-response-calibration-cli.test.ts`: 2 passed
- `npm run validate:schemas`: passed
- `npm test`: 61 files, 1287 tests passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 586 integrity tests passed, required outputs 29 verified
- `git diff --check`: passed (CRLF warnings only)
- 추가로 `reader-response-calibration` 결과에 `evidenceCollectionPlan`을 추가했다. 각 task는 `id`, `priority`, `target`, `currentValue`, `requiredValue`, `sampleIds`, `action`, `rationale`를 갖고, 인간 독자 provenance, response data quality, actionable friction, retention funnel, scene recall, tension trace, narrative forecast, payoff fairness, advocacy, durable engagement, resonance, consensus/confidence, cohort representativeness, panel protocol, blind comparative preference, revision outcome, holdout, 장르 coverage, 연속 회차 coverage, chapter-range coverage 부족을 실행 가능한 독자 패널 수집 작업으로 분해한다.
- CLI 텍스트 출력도 `Evidence collection plan: N task(s)`와 상위 5개 작업을 표시한다. JSON 출력과 `reviews/reader-response-calibration.json`에는 전체 작업표가 저장되므로, 98+ readiness가 실제 인간 독자 데이터 축적 단계에서 막힐 때 다음 패널 운영 항목을 바로 확인할 수 있다.

추가 확인(2026-06-21 masterpiece readiness action plan):

- 앞선 독자 패널 evidence collection plan은 reader-response calibration 파일 안에만 있으면 종합 98+ 리포트 사용자에게 잘 드러나지 않는다. 따라서 `masterpiece-readiness`가 모든 area gap을 `actionPlan`으로 정규화하고, reader-response의 `evidenceCollectionPlan`을 area/overall `actionPlan`으로 승격하도록 했다.
- `actionPlan` 항목은 `area`, `id`, `priority`, `target`, `currentValue`, `requiredValue`, `sampleIds`, `commands`, `action`, `rationale`를 갖는다. 구조화된 독자 패널 작업표가 없는 영역은 `resolve-{gap.code}` fallback task를 만들어 missing report, stale source, consistency source mismatch, weak evidence gap도 상위 실행 계획에서 사라지지 않게 했다.
- 각 action item의 `commands`는 관련 benchmark/calibration CLI를 기본값으로 제안한다. 별도 CLI가 아직 없는 장편 일관성 영역은 `/verify-chapter <chapter>`와 consistency-verifier 기반 `reviews/consistency-report.json` 재생성 지시를 함께 제공해, 98+ readiness 실패 후 다음 조치를 바로 실행 가능한 형태로 좁혔다.
- `run-masterpiece-readiness` 텍스트 출력도 `Action plan: N task(s)`, 상위 7개 작업, 각 작업의 상위 `command:` 힌트를 표시한다. JSON 출력과 `reviews/masterpiece-readiness-report.json`에는 전체 action plan이 저장된다. project CLI 계층은 action command의 `<project>` placeholder를 실제 resolved project path로 치환해, 저장된 readiness report만 보고도 다음 benchmark/calibration 명령을 바로 실행할 수 있게 했다.
- `npx tsc --noEmit`: passed
- `npx vitest run tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 20 passed
- `npm run validate:schemas`: passed
- `npm test`: 61 files, 1288 tests passed
- `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 587 integrity tests passed, required outputs 29 verified
- `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-21 reader panel transparency protocol):

- 리서치 반영: AAPOR Transparency Initiative와 Disclosure Standards는 survey 결과를 공개할 때 질문/응답 옵션뿐 아니라 모집 대상, 표본틀, 수집 날짜, 조사 모드 같은 방법 정보를 함께 공개해야 조사 품질을 판단할 수 있다고 본다. AAPOR Best Practices도 survey 품질은 설계·수집·분석 과정의 문제를 예방하고 측정하고 처리하는 데 달려 있다고 설명한다. ESOMAR의 online sample questions는 온라인 샘플 구매자가 respondent source, panel/sample management, incentives와 data quality practices를 확인하도록 안내한다. 따라서 reader-response calibration은 독자 점수와 attention check만으로는 부족하고, 표본 설계와 fieldwork transparency가 없는 샘플을 hard gate retuning 근거에서 제외해야 한다. 참고: [AAPOR Transparency Initiative](https://aapor.org/standards-and-ethics/transparency-initiative/), [AAPOR Disclosure Standards](https://aapor.org/standards-and-ethics/disclosure-standards/), [AAPOR Best Practices](https://aapor.org/standards-and-ethics/best-practices/), [ESOMAR 28 Questions](https://shop.esomar.org/what-we-do/code-guidelines/28-questions-to-help-buyers-of-online-samples).
- `reader-response-calibration`의 `ReaderResponseSampleEvidence`와 JSON 입력 스키마에 `population_definition_disclosed`, `sampling_frame_disclosed`, `fieldwork_dates_disclosed`, `survey_mode_disclosed`, `incentive_disclosed`를 추가했다. 이후 `recruitment_channel_counts`와 루트 옵션 `required_recruitment_channels`, `minimum_respondents_per_required_recruitment_channel`, `maximum_dominant_recruitment_channel_ratio`, `require_recruitment_channel_diversity`도 추가해 모집 방식 공개가 실제 모집 경로 분포 근거로 이어지게 했다. 이번에는 반복 원고 노출의 순서·피로·전이 편향을 막기 위해 `sample_order_randomized`, `manuscript_order_counterbalanced`, `max_samples_per_respondent`, `order_balance_ratio`와 루트 옵션 `maximum_samples_per_respondent`, `minimum_order_balance_ratio`도 추가했다. 이어 작가/출처 단서와 기존 원고/스포일러 노출 오염을 막기 위해 `author_identity_masked`, `prior_exposure_screened`, `unexcluded_prior_exposure_count`, `spoiler_exposure_screened`, `unexcluded_spoiler_exposure_count`도 추가했다. 이 항목들은 기존 `blind_reading`, `neutral_question_wording`, `response_option_order_randomized`, `question_wording_disclosed`, `recruitment_method_disclosed`, `attention_check_pass_count`, `excluded_response_count`와 함께 `panelProtocolQuality=strong`의 조건이다.
- `strengthen-reader-panel-protocol` evidence collection task도 새 disclosure 필드를 요구하도록 갱신했다. 이제 98+ readiness를 위한 독자 패널 근거는 “인간 독자 몇 명이 좋다고 했다”가 아니라, 대상 모집단/표본틀/수집 기간/조사 모드/보상 조건이 보존된 재검증 가능한 조사 로그여야 한다.

추가 확인(2026-06-21 reader annotation reliability gate):

- 리서치 반영: SAGE의 Krippendorff's Alpha 설명은 코더 간 합의가 명목·순서·간격 등 다양한 자료 수준에서 콘텐츠 코딩의 신뢰도를 판단하는 데 쓰인다고 설명한다. SAGE International Journal of Qualitative Methods의 intercoder reliability 가이드는 질적 코딩에서 코드북, 독립 코딩, 합의/불일치 처리 절차를 명시해야 해석의 재현성을 판단할 수 있다고 본다. AERA/APA/NCME Testing Standards는 점수 해석과 사용에는 신뢰도/정확도 근거가 필요하다고 보며, ATLAS.ti manual도 agreement 측정과 reliability 추론을 구분한다. 따라서 독자 자유응답에서 뽑은 `friction_annotations`를 hard rewrite/gate tuning 근거로 쓰려면 다중 코더, 중복 코딩, 합의율/신뢰도 지표, 코드북, 조정 절차, 코더 블라인딩을 보존해야 한다. 참고: [SAGE Krippendorff's Alpha](https://sk.sagepub.com/ency/edvol/the-sage-encyclopedia-of-communication-research-methods/chpt/intercoder-reliability-techniques-krippendorff-s), [Intercoder Reliability in Qualitative Research](https://journals.sagepub.com/doi/10.1177/1609406919899220), [Standards for Educational and Psychological Testing](https://www.testingstandards.net/uploads/7/6/6/4/76643089/standards_2014edition.pdf), [ATLAS.ti Inter-Coder Agreement](https://doc.atlasti.com/ManualWin.v22/ICA/InterCoderAgreemenIntroduction.html).
- `reader-response-calibration`에 `annotationReliability`, `annotationReliabilityIssues`, `lowAnnotationReliabilityCount`, `annotationReliabilityEvidenceCount`를 추가했다. 기본 설정에서는 `annotation_coder_count`, `annotation_double_coded_count`, `annotation_agreement_rate`, `annotation_reliability_metric`, `annotation_codebook_version`, `annotation_adjudicated`, `annotation_coder_blinded`가 부족한 샘플을 threshold retuning usable evidence에서 제외한다.
- `record-annotation-reliability` evidence collection task를 추가했다. 이제 독자 패널의 자유 코멘트가 “문체가 거슬렸다” 같은 주관 반응에서 끝나지 않고, 같은 마찰 코드로 재현 가능하게 코딩됐을 때만 98+ readiness의 hard evidence가 된다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 2 files, 43 tests passed
  - `npm run validate:schemas`: passed
  - `git diff --check`: passed (CRLF warnings only)
  - `npm test`: 61 files, 1290 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 589 integrity tests passed, required outputs 29 verified

추가 확인(2026-06-21 delayed reader memory gate):

- 리서치 반영: narrative transportation 연구는 몰입이 주의, 감정, 심상이 서사 사건에 집중되는 상태라고 보고, event memory 연구는 연속 서사를 의미 있는 사건 구조로 저장하고 회상한다고 설명한다. Event segmentation 연구도 사건 구조를 더 잘 나누면 장기 지연 뒤 기억이 개선될 수 있음을 보인다. 따라서 대작 후보의 독자 반응은 즉시 호감, 추천 의향, 사후 감정 잔향만으로 충분하지 않고, 최소 하루 뒤에도 장면 이미지, 인물/관계 압박, 다음 질문, 복귀/구매 이유가 남는지 확인해야 한다. 참고: [Green & Appel, Narrative Transportation](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf), [Discovering event structure in continuous narrative perception and memory](https://pmc.ncbi.nlm.nih.gov/articles/PMC5558154/), [Event Segmentation Improves Event Memory Up to One Month Later](https://pmc.ncbi.nlm.nih.gov/articles/PMC5542882/).
- `reader-response-calibration`에 `delayedMemoryEvidence`, `delayedMemoryEvidenceIssues`, `lowDelayedMemoryEvidenceCount`, `delayedMemoryEvidenceCount`를 추가했다. 기본 설정에서는 `delayed_follow_up_respondent_count`, `delayed_follow_up_hours`, `delayed_scene_recall_count`, `delayed_character_recall_count`, `delayed_next_click_intent_count`, `delayed_return_intent_count`, `delayed_paid_continuation_intent_count`, `delayed_memory_annotations`가 부족한 샘플을 threshold retuning usable evidence에서 제외한다.
- `collect-delayed-memory-evidence` evidence collection task를 추가했다. 이제 평균 호감과 즉시 잔향이 좋아도 시간이 지난 뒤 기억과 다음 회차 압력이 사라진 원고는 98+ readiness의 hard gate tuning 근거가 될 수 없다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 2 files, 44 tests passed
  - `npm run validate:schemas`: passed
  - `git diff --check`: passed (CRLF warnings only)
  - `npm test`: 61 files, 1291 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 590 integrity tests passed, required outputs 29 verified

추가 확인(2026-06-21 readiness aggregation sync):

- `masterpiece-readiness`의 weak evidence 집계에 `lowAnnotationReliabilityCount`와 `lowDelayedMemoryEvidenceCount`를 추가했다. 하위 `reader-response-calibration`이 annotation coding reliability나 delayed memory follow-up 부족을 이미 막고 있어도, 종합 98+ readiness 화면에서 해당 결손이 major evidence gap과 action plan으로 드러나지 않으면 개선 우선순위가 흐려진다.
- `tests/quality/masterpiece-readiness.test.ts`에 annotation reliability와 delayed memory 결손이 `reader-response` 영역을 `needs-evidence`로 떨어뜨리고, `record-annotation-reliability`와 `collect-delayed-memory-evidence` 수집 작업을 종합 action plan으로 승격하는 회귀 테스트를 추가했다.
- 추가 동기화로 `lowActionabilityCount`, `lowRepresentativenessCount`, `lowProtocolQualityCount`, `missingComparativePreferenceCount`도 weak evidence gap에 연결했다. 기존 `narrowCohortCount`, `weakPanelProtocolCount` 같은 오래된 별칭만 보면 최신 `reader-response-calibration`이 실제로 내보내는 필드명을 놓칠 수 있기 때문이다.
- `overestimateCount`와 `underestimateCount`도 calibration drift gap으로 집계한다. false positive/false negative까지는 아니어도 자동 점수와 실제 독자 반응이 크게 벌어지는 샘플은 98+ readiness에서 숨겨지면 안 된다.
- `tests/quality/masterpiece-readiness.test.ts`에 자동 과대/과소 추정, actionable friction 부족, 대표성 부족, 프로토콜 부족, 비교 선호도 누락이 각각 major gap code와 action plan으로 올라오는 회귀 테스트를 추가했다.
- 추가로 `reader-response-calibration`의 `calibrationScore`를 readiness 영역 `accuracy`로 정규화하고, 98 미만이면 `low-calibration-score`, `meanAbsoluteError`가 2.5를 넘으면 `high-mean-absolute-error` major gap으로 집계한다. 이제 `readyForGateTuning=true`라도 실제 독자 점수와 자동 판단의 평균 오차가 큰 calibration report는 98+ readiness를 통과하지 못한다.
- 모든 benchmark 영역의 `accuracy`도 98 미만이면 `low-readiness-accuracy` major gap으로 처리한다. 가중 평균 `overallScore`가 98을 넘더라도 특정 영역이 97점대인 상태를 "대작 준비 완료"로 오판하지 않게 하기 위한 보강이다.

추가 확인(2026-06-21 status quo action loop 문체 gate):

- 리서치 반영: scene structure는 장면을 goal/conflict/disaster와 reaction/dilemma/decision의 인과 사슬로 보며, 원인과 결과가 이어질 때 장면이 전체 플롯을 밀어낸다고 설명한다. Story Grid도 scene goal, progressive complications, turning point, crisis, climax, resolution이 action-reaction의 원인/결과 사슬로 연결되어야 한다고 본다. Trabasso와 van den Broek의 narrative event 연구도 독자가 사건을 이해하고 기억할 때 causal chain, goal, attempt, outcome/consequence 연결이 중요하다고 본다. 따라서 “바라보았다/컵을 내려놓았다/봉투를 만졌다/기다렸다” 같은 낮은 영향도 행동문이 연속되지만 새 단서·선택·장애·결과가 없는 원고는 문장은 깔끔해도 장면 재미가 멈춘 것으로 봐야 한다. 참고: [Helping Writers Become Authors, Scene Structure](https://www.helpingwritersbecomeauthors.com/scene-structure/), [Story Grid, Cause and Effect](https://storygrid.com/cause-and-effect/), [Trabasso & van den Broek, Causal Thinking and the Representation of Narrative Events](https://www.researchgate.net/publication/222232677_Causal_Thinking_and_the_Representation_of_Narrative_Events).
- `prose-taste-gate`에 `status-quo-action-loop`을 추가했다. 새 metric은 `statusQuoActionDensityPer1000`, `longestStatusQuoActionRun`, `causalTurnDensityPer1000`이며, density는 회차 전체의 인과 전환 부족을 보고, run은 해당 장면 구간의 로컬 정체를 직접 차단한다.
- `prose_taste_profile`과 CLI에 `max_status_quo_action_density_per_1000`, `max_status_quo_action_run`, `min_causal_turn_density_per_1000` 및 `--max-status-quo-actions`, `--max-status-quo-action-run`, `--min-causal-turns`를 추가했다. `run-prose-taste-benchmark`의 style fingerprint에도 새 metric이 들어가 선호/비선호 문체 분리 신호로 남는다.
- `apply-chapter-gate`가 style-guide의 새 프로필을 읽고, 현재 회차 원고의 정체된 행동문 run을 `Prose Craft Revision Directives`로 전달하도록 회귀 테스트를 추가했다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 2 files, 80 tests passed
  - `npm run validate:schemas`: passed
  - `git diff --check`: passed (CRLF warnings only)
  - `npm test`: 61 files, 1301 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 600 integrity tests passed, required outputs 29 verified

추가 확인(2026-06-21 manuscript tension peak evidence gate):

- 리서치 반영: 최근 서스펜스 측정 연구는 suspense를 전개 중인 이야기에서 발생하는 인지-정서 반응의 곡선으로 보고, 서면 텍스트에서도 high-resolution suspense arc를 측정하려 한다. Story Grid의 scene 정의도 장면이 value shift, crisis tradeoff, protagonist choice, immediate effect를 통해 작동한다고 본다. cause-and-effect 원칙 역시 작은 단위의 원인/결과가 명확해야 큰 전환이 독자에게 읽힌다고 설명한다. 따라서 `tension_curve`에 고점이 선언되어도 원고가 “긴장감이 최고조였다” 같은 요약으로 넘기면 실제 독자 긴장 곡선에는 고점이 생기지 않을 수 있다. 참고: [Measuring Suspense in Real Time](https://ssol-journal.com/articles/10.61645/ssol.182), [Story Grid, Scenes](https://storygrid.com/scenes/), [Story Grid, Cause and Effect](https://storygrid.com/cause-and-effect/).
- `evaluateEngagementContract`에 `manuscript-tension-peak-not-evidenced`를 추가했다. 8점 이상 high-tension peak event가 있는 회차는 원고 본문에서 해당 event와 겹치는 1~3문장 창 안에 구체 위험/장애물, 주인공 행동 또는 강제 선택, 되돌릴 수 없는 결과/폭로/새 질문이 함께 있어야 한다.
- 기존 `tension-peak-not-staged`가 plot `tension_curve`와 chapter scene evidence의 연결을 막는다면, 새 gate는 scene metadata를 통과한 뒤에도 실제 원고 문단이 사건명/긴장감 설명으로만 끝나는 false positive를 차단한다.
- `05-gen-plot`, `06-write`, `08-write-all`, `verify-chapter`, README에 같은 기준을 문서화했고, `engagement-contract-evaluator`에 “장면 메타데이터는 peak를 포함하지만 원고는 요약만 하는” 회귀 테스트를 추가했다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 2 files, 235 tests passed
  - `npm run validate:schemas`: passed
  - `npm test`: 61 files, 1302 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 601 integrity tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 manuscript tension wave evidence gate):

- 리서치 반영: 서스펜스 측정 연구는 suspense를 한 순간의 고점이 아니라 이야기 전개 중 변하는 인지-정서 곡선으로 다루고, 실시간 서면 텍스트 suspense arc를 측정하려 한다. 불확실성/서스펜스 연구도 결과 확률이 변하고 선택지·정보가 좁혀질 때 독자 긴장이 달라진다고 본다. Story Grid의 5 Commandments는 사건이 inciting incident, progressive complications, crisis, climax, resolution의 단계로 독자 경험을 만든다고 설명한다. 따라서 high-tension 회차가 말미에만 위기와 폭로를 몰아넣으면 자동 점수상 사건은 있어도 실제 원고 긴장 곡선은 평평할 수 있다. 참고: [Measuring Suspense in Real Time](https://ssol-journal.com/articles/10.61645/ssol.182), [Uncertainty and Suspense](https://pmc.ncbi.nlm.nih.gov/articles/PMC6092602/), [Story Grid, The 5 Commandments Revisited](https://storygrid.com/5-commandments-storytelling-revisited/).
- `evaluateEngagementContract`에 `manuscript-tension-wave-not-evidenced`를 추가했다. 8점 이상 high-tension peak 또는 8점 이상 cliffhanger 회차는 원고 본문에서 초반 압박/질문, 중반 악화/선택지 축소, 말미 고점/열린 질문이 순서 있는 문장창으로 보여야 한다.
- 기존 `manuscript-tension-peak-not-evidenced`가 “고점 한 장면이 요약 처리됐는가”를 본다면, 새 gate는 고점 전후의 분산과 상승 리듬을 본다. 위험, 장애물, 폭로, 새 질문이 모두 있어도 말미에 한꺼번에 몰리면 false positive로 처리한다.
- `05-gen-plot`, `06-write`, `08-write-all`, `verify-chapter`, README에 같은 기준을 문서화했고, `engagement-contract-evaluator`에 “말미에만 긴장을 압축하는” 회귀 테스트를 추가했다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 2 files, 251 tests passed
  - `npm run validate:schemas`: passed
  - `npm test`: 61 files, 1390 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 685 integrity tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-21 manuscript temporal pressure evidence gate):

- 리서치 반영: event-indexing model은 독자가 서사를 이해할 때 시간, 공간, 인과, 주인공, 의도 차원을 함께 추적한다고 설명하고, naturalistic comprehension의 situation model 논의도 시간적 연속성과 사건 상태 갱신이 이해에 중요하다고 본다. 최근 서스펜스 측정 연구는 서면 텍스트의 suspense를 실시간으로 변하는 반응 곡선으로 다룬다. 따라서 원고가 제한 시간, 카운트다운, 남은 n분, 기한, 사망 시각 같은 ticking-clock 장치를 쓰면 그 시간 정보가 실제 행동, 경로, 선택지, 증거, 관계, 다음 압박을 바꾸는지 확인해야 한다. 참고: [Zwaan et al., Event-indexing model](https://link.springer.com/content/pdf/10.3758/BF03195811.pdf), [Cambridge, Situation Models in Naturalistic Comprehension](https://resolve.cambridge.org/core/services/aop-cambridge-core/content/view/F6ACAC7779D9F8FC3EEF9E5C91843790/9781107323667c4_p59-76_CBO.pdf/situation-models-in-naturalistic-comprehension.pdf), [Measuring Suspense in Real Time](https://ssol-journal.com/articles/10.61645/ssol.182).
- `evaluateEngagementContract`에 `manuscript-temporal-pressure-not-evidenced`를 추가했다. 원고 본문에 시간 압박 표식이 반복되면, 같은 장면 흐름 안에서 주인공 대응과 좁아진 선택지, 잃은 창구, 지연 비용, 악화된 결과 중 하나가 함께 보여야 한다. 시간 표식만 반복하거나 "시간이 없었다"는 설명으로 끝나면 critical issue와 rewrite directive를 반환한다.
- `README.md`, `05-gen-plot`, `06-write`, `08-write-all`, `verify-chapter`에 시간 압박 원고 게이트를 문서화했다. 이제 플롯 생성 단계부터 카운트다운을 장식으로 쓰지 말고 행동 변경과 비용 누적으로 설계하도록 유도한다.
- `engagement-contract-evaluator`에 "카운트다운과 남은 시간은 말하지만 행동/선택지가 좁아지지 않는" 회귀 테스트를 추가했다. 황금 샘플 `chapter_002.md`도 카운트다운이 경찰 신고 선택 포기, 비상계단 우회, 알리바이/신고 경로 단절로 이어지도록 조정했다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/masterpiece/golden-sample-project.test.ts`: 1 file, 1 test passed
  - `npm test`: 61 files, 1303 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 602 integrity tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-21 ambiguous reference chain 문체 gate):

- 리서치 반영: referential ambiguity 연구는 지시어가 하나의 대상에 고유하게 연결되지 못하면 이해가 실패하고 독자의 주의와 작업기억 부담이 커진다고 설명한다. discourse coherence/pronoun resolution 연구도 대명사 해석과 담화 일관성이 서로 맞물린다고 보며, referential cohesion 연구는 참조 응집성이 의미 일관성과 독해에 기여한다고 본다. 따라서 “그는/그녀는/그것은/그 말은” 같은 지시어가 인물명, 역할, 사물명 없이 과밀하거나 연속되면 문장 자체는 자연스러워도 독자가 누가 무엇을 하는지 되짚게 되어 문체 마찰이 생긴다. 참고: [Sensitivity to Referential Ambiguity in Discourse](https://pmc.ncbi.nlm.nih.gov/articles/PMC4794274/), [Discourse coherence and pronoun resolution](https://tedlab.mit.edu/tedlab_website/researchpapers/Wolf_et_al_2004_LCP.pdf), [The Role of Referential Cohesion in the Process of Text Comprehension](https://www.pegegog.net/index.php/pegegog/article/download/3820/999/17034).
- `prose-taste-gate`에 `ambiguous-reference-chain`을 추가했다. 새 metric은 `ambiguousReferenceDensityPer1000`과 `longestAmbiguousReferenceRun`이며, density는 원고 전체의 지시어 과밀을 보고, run은 같은 장면에서 참조 대상이 흐려지는 구간을 직접 차단한다.
- `prose_taste_profile`과 CLI에 `max_ambiguous_reference_density_per_1000`, `max_ambiguous_reference_run`, `--max-ambiguous-references`, `--max-ambiguous-reference-run`을 추가했다. style-guide, prose-taste-benchmark template/schema, `apply-chapter-gate`, `run-prose-taste-benchmark`, style fingerprint가 같은 필드를 공유한다.
- `README.md`, `06-write`, `08-write-all`, `verify-chapter`에 “지시어 연쇄는 인물명/역할/물건명/구체 행동 주체로 다시 고정한다”는 퇴고 기준을 문서화했다. 이 항목은 사용자가 말한 “문체가 거슬림”을 추상 감상이 아니라 위치 지정 가능한 품질 실패로 전환하기 위한 보강이다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 3 files, 75 tests passed
  - `npm run validate:schemas`: passed
  - `npm test`: 61 files, 1306 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 605 integrity tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-21 reader memorable line quote evidence):

- 리서치 반영: 문학 독자 참여 연구는 실제 독자의 문장 단위 annotation/highlight와 overall engagement를 함께 수집해 서사 이해와 창작 도구 평가에 쓸 수 있다고 본다. Reader-response stylistics 연구도 독자에게 눈에 띄는 줄을 표시하게 하는 방식이 foregrounding 효과 검증에 쓰였고, memorable messages 이론은 오래 기억되는 메시지가 정서 강도, 자기/사회적 관련성, 맥락, 의미 형성과 연결된다고 설명한다. 따라서 대작 후보의 문체는 단순히 거슬리는 결함이 적은지만 볼 것이 아니라, 독자가 실제로 기억하고 좋아하고 남에게 보여주고 싶은 문장이 있는지 확인해야 한다. 참고: [An Analysis of Reader Engagement in Literary Fiction through Eye Tracking and Linguistic Features](https://aclanthology.org/2023.wnu-1.13.pdf), [Reader response research in stylistics](https://eprints.whiterose.ac.uk/id/eprint/110379/1/1_L%26L%20Sp%20issue%202017%20Whiteley%20%26%20Canning_Final.pdf), [Theory of memorable messages](https://academic.oup.com/joc/article/75/4/259/8125917).
- `reader-response-calibration`에 `lineQuoteEvidence`, `lineQuoteEvidenceIssues`, `lowLineQuoteEvidenceCount`, `lineQuoteEvidenceCount`를 추가했다. 기본 설정에서는 `quote_recall_count`, `favorite_line_count`, `shareable_line_count`, `line_quote_annotations`가 부족한 샘플을 threshold retuning usable evidence에서 제외한다.
- `collect-line-quote-evidence` evidence collection task를 추가했다. 이제 평균 호감, 장면 회상, 추천 의향이 좋아도 기억/인용 가능한 문장 근거가 없으면 hard gate threshold tuning 근거가 될 수 없다.
- `schemas/reader-response-calibration.schema.json`, `templates/reader-response-calibration.template.json`, `src/cli/reader-response-project.ts`, `src/cli/calibrate-reader-response.ts`, README, `/verify-chapter` 문서와 CLI 테스트 fixture를 같은 입력 포맷으로 갱신했다. 또한 `masterpiece-readiness`의 weak evidence 집계에 `lowLineQuoteEvidenceCount`를 연결해 종합 98+ readiness에서도 문장 인용성 evidence 부족이 major gap과 action plan으로 올라오게 했다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 3 files, 58 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 606 integrity tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)
  - `npm test`: 57 files and 1303 tests passed, but 4 CLI tests timed out at 5000ms under parallel full-suite load. The same affected CLI suites passed during `npm run build` integrity checks, so this is recorded as a parallel timeout caveat rather than a behavioral regression.

추가 확인(2026-06-21 authorial style drift evidence):

- 리서치 반영: 2025년 creative writing stylometry 연구는 LLM 산문이 유창해도 모델별로 더 균일하고 조밀한 stylistic cluster를 만들 수 있으며, stylometry가 단어 빈도, 문장 길이, 구문, 구두점 같은 측정 가능한 feature로 authorial fingerprint를 비교한다고 설명한다. Computational Literary Studies의 corpus building 지침도 authorial style은 시간에 따라 drift할 수 있고, 장르/register와 narrative perspective 같은 조건을 통제해야 style distance를 제대로 해석할 수 있다고 본다. 따라서 문체 평가는 한 회차의 거슬리는 습관만 잡아서는 부족하고, 여러 회차의 선호 문체 샘플이 같은 작가 음색을 유지하는지도 봐야 한다. 참고: [Stylometric comparisons of human versus AI-generated creative writing](https://www.nature.com/articles/s41599-025-05986-3), [Survey of Methods in Computational Literary Studies - Corpus Building for Authorship Attribution](https://methods.clsinfra.io/corpus-author.html).
- `prose-taste-benchmark`에 `authorialStyleDriftStatus`, `authorialStyleDriftMaxDistance`, `authorialStyleDriftPairCount`, `authorialStyleDrift`, `weakAuthorialStyleDriftCount`를 추가했다. `require_authorial_style_continuity`가 켜지면 `chapter` 번호가 있는 usable 선호 문체 샘플을 회차 순서로 비교해, 인접 회차의 문체 metric 평균 거리와 가장 크게 흔들린 metric을 보존한다.
- `schemas/prose-taste-benchmark.schema.json`, `templates/prose-taste-benchmark.template.json`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, README, `/verify-chapter` 문서를 같은 입력 포맷으로 갱신했다. 템플릿은 `require_authorial_style_continuity=true`, 최소 3개 회차 샘플, 최대 drift 6을 기본값으로 제시한다.
- `masterpiece-readiness`의 weak evidence 집계에 `weakAuthorialStyleDriftCount`를 연결했다. 이제 문체 샘플 정답률과 선호/비선호 fingerprint 분리는 좋아도, 1화/2화/3화 선호 문체가 서로 다른 작가처럼 흔들리면 98+ readiness의 prose-taste major gap과 action plan으로 드러난다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 3 files, 43 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 608 integrity tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-21 premise behavioral intent evidence):

- 리서치 반영: Nielsen BookData는 고품질 book metadata와 book sales 사이의 강한 상관을 보고하며 rich metadata가 discoverability를 돕는다고 설명한다. Wattpad 연구도 디지털 social reading에서는 실제 독자의 댓글, 반응, 플랫폼 상호작용이 대규모로 관찰 가능한 독자 반응 자료가 된다고 본다. 따라서 전제 평가는 "설문에서 읽고 싶다"는 응답만으로 충분하지 않고, 제목/한줄훅/소개문/목록 패키지가 실제 노출에서 클릭, 첫 화 열람, 저장/팔로우로 전환되는지 따로 검증해야 한다. 참고: [NIQ Metadata Matters](https://nielseniq.com/global/en/insights/commentary/2024/metadata-matters/), [Wattpad as a resource for literary studies](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0226708).
- `premise-appeal-benchmark`에 `behavioralEvidence`, `behavioralIntentEvidence`, `behavioralIntentScore`, `behavioralIntentPassed`, `behavioralIntentFalsePositiveCount`, `lowBehavioralIntentEvidenceCount`, `behavioralIntentEvidenceCount`를 추가했다. 자동 점수와 독자 설문은 좋은데 노출 대비 클릭률, 첫 화 열람률, 저장/팔로우율이 기준 아래이면 `behavioral-intent-false-positive`로 남는다.
- `schemas/premise-appeal-benchmark.schema.json`, `templates/premise-appeal-benchmark.template.json`, `src/cli/premise-appeal-benchmark-project.ts`, `src/cli/run-premise-appeal-benchmark.ts`, README를 같은 입력 포맷으로 갱신했다. 템플릿은 `require_behavioral_intent_evidence=true`, 최소 노출 100, 클릭률 0.04, 첫 화 열람률 0.025, 저장/팔로우율 0.008을 기본 제안값으로 둔다.
- `masterpiece-readiness`의 실패/weak evidence 집계에 `behavioralIntentFalsePositiveCount`와 `lowBehavioralIntentEvidenceCount`를 연결했다. 이제 전제 설문과 자동 점수가 높아도 실제 목록 행동 evidence가 약하면 98+ readiness의 premise major/critical gap으로 드러난다.
- 추가 리서치 반영: Microsoft Research의 SRM 진단 글은 A/B 테스트 결과를 신뢰하기 전에 sample ratio mismatch와 할당, 실행, 로그 처리, 분석 문제를 진단해야 한다고 정리한다. Kohavi의 controlled experiment 가이드는 live user random assignment, consistent experience, 장기 목표와 연결된 OEC, A/A 테스트, 점진 ramp-up을 강조한다. 따라서 전제 행동 evidence도 클릭/열람/저장 수치만 있으면 부족하고, blind listing test, platform/source/variant, observation window가 기록된 프로토콜 evidence가 필요하다. 참고: [Diagnosing Sample Ratio Mismatch in A/B Testing](https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/), [Practical Guide to Controlled Experiments on the Web](https://ai.stanford.edu/~ronnyk/GuideControlledExperiments.pdf).
- `premise-appeal-benchmark`에 `behavioralProtocolQuality`, `behavioralProtocolIssues`, `weakBehavioralProtocolCount`, `behavioralProtocolEvidenceCount`, `requireBehavioralProtocolForGateTuning`, `minimumBehavioralObservationWindowHours`를 추가했다. `require_behavioral_protocol=true`이면 platform, variant label, acquisition source, blind listing status, 최소 관찰 시간이 빠진 샘플은 `weak-behavioral-protocol-evidence`로 실패하고 gate tuning usable evidence에서 제외된다.
- `run-premise-appeal-benchmark`는 `--require-behavioral-protocol`, `--no-require-behavioral-protocol`, `--min-behavioral-observation-hours`를 받아 프로젝트 JSON suite의 `require_behavioral_protocol`, `minimum_behavioral_observation_window_hours`와 병합한다. `masterpiece-readiness`는 `weakBehavioralProtocolCount`를 weak evidence gap으로 집계한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/premise-appeal-benchmark.test.ts tests/masterpiece/premise-appeal-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 3 files, 23 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 612 integrity tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-21 prose highlight quality diversity evidence):

- 리서치 반영: creative writing edit 연구는 LLM 산문이 상투적이고 뉘앙스, subtext, 수사적 복잡성이 부족해질 수 있다고 보고한다. 2025년 stylometry 연구도 인간 창작 텍스트가 더 넓고 이질적인 분포를 보이는 반면 LLM 산문은 더 균일하고 예측 가능한 경향을 보인다고 설명한다. Reader preference 연구는 독자의 문체 판단이 표면 특징, narrative voice, 매력도, 풍부함, 접근성, 주제 전개 같은 여러 기준의 상호작용이라고 본다. 따라서 선호 문체 샘플도 "깨끗하다" 한 축만 보존하면 대작 문체가 아니라 밋밋한 무마찰 문체로 수렴할 수 있다. 참고: [Can AI writing be salvaged?](https://arxiv.org/html/2409.14509v3), [Stylometric comparisons of human versus AI-generated creative writing](https://www.nature.com/articles/s41599-025-05986-3), [The Reader is the Metric](https://aclanthology.org/2025.findings-acl.1304.pdf).
- `prose-taste-benchmark`에 `styleHighlightQualityCount`, `styleHighlightQualities`, `weakStyleHighlightQualityDiversityCount`, `requireStyleHighlightQualityDiversity`, `minimumStyleHighlightQualityCount`를 추가했다. `require_style_highlight_quality_diversity=true`이면 usable 선호 문체 하이라이트가 `subtext`, `rhythm`, `sensory-grounding`, `voice`, `narrative-momentum` 같은 여러 긍정 품질을 덮지 못할 때 `readyForStyleTuning=false`가 된다.
- `schemas/prose-taste-benchmark.schema.json`, `templates/prose-taste-benchmark.template.json`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, README를 같은 입력 포맷으로 갱신했다. 템플릿은 기본 선호 샘플에 `subtext`와 `rhythm` 하이라이트를 함께 제시하고, CLI는 `--require-style-highlight-quality-diversity`, `--min-style-highlight-quality-count`를 받는다.
- `masterpiece-readiness`의 weak evidence 집계에 `weakStyleHighlightQualityDiversityCount`를 연결했다. 이제 문체 벤치마크 정답률, 비선호 마찰 주석, authorial drift가 좋아도 선호 문체의 긍정 품질 폭이 좁으면 98+ readiness의 prose-taste major gap으로 드러난다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 3 files, 45 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 613 integrity tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 premise behavioral allocation integrity evidence):

- 리서치 반영: Microsoft Research의 SRM 진단 글은 모든 A/B 테스트가 효과 분석 전에 sample ratio mismatch 검사를 통과해야 하며, 배정 비율이 깨진 데이터는 해로운 결론을 만들 수 있다고 설명한다. KDD 2019 SRM 논문은 SRM을 온라인 실험의 데이터 품질 문제를 찾는 유용한 지표로 다루고, DoorDash의 실험 플랫폼 글도 SRM이 무작위 배정을 훼손해 결과를 무효화할 수 있다고 정리한다. 따라서 전제 listing 행동 evidence는 클릭률, 첫 화 열람률, 저장/팔로우율뿐 아니라 variant 배정 무결성도 함께 검증해야 한다. 참고: [Diagnosing Sample Ratio Mismatch in A/B Testing](https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/), [Diagnosing Sample Ratio Mismatch in Online Controlled Experiments](https://dl.acm.org/doi/10.1145/3292500.3330722), [Addressing the Challenges of Sample Ratio Mismatch in A/B Testing](https://careersatdoordash.com/blog/addressing-the-challenges-of-sample-ratio-mismatch-in-a-b-testing/).
- `premise-appeal-benchmark`에 `expectedVariantAllocationRatio`, `observedVariantAllocationRatio`, `sampleRatioMismatchPValue`, `behavioralAllocationIntegrity`, `behavioralAllocationIssues`, `weakBehavioralAllocationCount`, `behavioralAllocationEvidenceCount`, `requireBehavioralAllocationIntegrityForGateTuning`, `minimumSampleRatioMismatchPValue`를 추가했다. `require_behavioral_allocation_integrity=true`이면 allocation 필드가 빠졌거나 SRM p-value가 기준보다 낮은 샘플은 `weak-behavioral-allocation-evidence`로 실패하고 gate tuning usable evidence에서 제외된다.
- `schemas/premise-appeal-benchmark.schema.json`, `templates/premise-appeal-benchmark.template.json`, `src/cli/premise-appeal-benchmark-project.ts`, `src/cli/run-premise-appeal-benchmark.ts`, README를 같은 입력 포맷으로 갱신했다. 템플릿은 `require_behavioral_allocation_integrity=true`, `minimum_sample_ratio_mismatch_p_value=0.001`을 기본 제안값으로 둔다.
- `masterpiece-readiness`의 weak evidence 집계에 `weakBehavioralAllocationCount`를 연결했다. 이제 설문 반응, 행동 전환율, 프로토콜 기록이 모두 좋아도 A/B variant 배정이 깨졌다면 98+ readiness의 premise major gap으로 드러난다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/premise-appeal-benchmark.test.ts tests/masterpiece/premise-appeal-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 3 files, 24 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 614 integrity tests passed, required outputs 29 verified

추가 확인(2026-06-22 series emotional arc repetition evidence):

- 리서치 반영: Reagan et al.은 대규모 소설 감정 곡선을 분석해 이야기의 emotional arc가 반복 가능한 기본 형태로 군집될 수 있음을 보인다. 이 플러그인 관점에서는 보상 장치가 달라도 회차 말미의 정서 이동이 계속 dread-shock-deferral, loss-delay, alarm-dread 같은 같은 곡선으로 끝나면 독자가 장기 연재 리듬을 예측하고 피로를 느낄 수 있다는 리스크로 해석한다. 참고: [The emotional arcs of stories are dominated by six basic shapes](https://arxiv.org/abs/1606.07772).
- `series-retention-benchmark`에 `emotionalSignature`, `repeatedEmotionalSignatureRun`, `repetitiveEmotionalPatternCount`, `maximumRepeatedEmotionalSignatureRun`, 실패 유형 `repetitive-emotional-pattern`을 추가했다. reward signature가 모두 달라도 emotional signature가 설정된 최대 run을 넘으면 readerPassed가 false가 되고 자동 고득점이면 `automated-false-positive`와 함께 남는다.
- `schemas/series-retention-benchmark.schema.json`, `templates/series-retention-benchmark.template.json`, `src/cli/series-retention-benchmark-project.ts`, `src/cli/run-series-retention-benchmark.ts`, README를 같은 입력 포맷으로 갱신했다. 프로젝트 JSON은 `emotional_signature`와 `maximum_repeated_emotional_signature_run`을 받고, CLI는 `--maximum-repeated-emotional-signature-run`을 받는다.
- `apply-chapter-gate`가 evidence-sufficient `repetitive-emotional-pattern`을 장기 연재 hard block으로 처리하고, 실패 시 `emotional-arc-variety` directive로 감정 말미 리듬을 다른 affective movement로 바꾸게 한다. `masterpiece-readiness`도 `repetitiveEmotionalPatternCount`를 critical gap으로 집계한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/series-retention-benchmark.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 4 files, 61 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 619 integrity tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 character voice interchangeability evidence):

- 리서치 반영: Dinu & Uban의 character stylome 연구는 작가 문체뿐 아니라 작품 속 인물들의 스타일도 자동 분류 대상으로 볼 수 있고, 인물별 개별 스타일이 believable character의 증거가 될 수 있다고 본다. 2023년 Shakespeare character voice 연구도 “서로 다른 인물의 스타일을 구분할 수 있는가”를 별도 문제로 두며, 여러 feature/model로 인물 음성 구분을 실험했다. 2024년 quotation attribution 연구는 소설 인물의 발화에서 style, topic preference, persona 같은 character-level information이 인용 attribution 신호가 될 수 있고, 대부분의 PDNC corpus 인물들이 distinct voices를 가진다고 보고한다. 따라서 대작형 원고의 대화 검증은 동일 대사 복붙만 잡아서는 부족하고, 서로 다른 문장이라도 말투, 종결 리듬, 반응 전술, 담화 표지가 같아 화자를 바꿔도 티가 나지 않는 경우를 별도 실패로 보아야 한다. 참고: [Finding a Character's Voice](https://aclanthology.org/W17-2210/), [A Computational Analysis of the Voices of Shakespeare's Characters](https://aclanthology.org/2023.ranlp-1.33/), [A Study of Authorship Verification Models for Quotation Attribution](https://aclanthology.org/2024.latechclfl-1.15.pdf).
- `evaluateEngagementContract`의 `manuscript-character-voice-not-differentiated`가 `dominantDialogueRegister`, 평균 대사 길이, 문장부호뿐 아니라 sentence ending profile, response tactic profile, discourse marker profile을 voice signature에 포함한다. 또한 cross-speaker 반복 대사가 아니어도 signature가 완전히 같고 평균 speaker similarity가 낮은 임계 이상이면 interchangeable voice failure로 처리한다.
- `tests/masterpiece/engagement-contract-evaluator.test.ts`에 서로 다른 대사 문장임에도 두 화자가 모두 “지금 ... 해야 해 / 안 그러면 ...” 구조, 같은 명령/위협/증거 전술, 같은 casual ending을 공유하는 샘플을 추가했다. 반대로 한 화자는 질문·분석·반말/존댓말 혼합, 다른 화자는 공식적 양보·명령 리듬을 쓰는 샘플은 voice issue가 뜨지 않도록 회귀 방지했다.
- `README.md`, `skills/06-write`, `skills/08-write-all`, `skills/verify-chapter`가 character voice differentiation 기준을 동일 대사 반복뿐 아니라 반응 전술과 담화 표지까지 포함하도록 갱신됐다. 이제 `/write`, `/write-all`, `/verify-chapter`가 “인물별 대사 음성”을 말할 때 문장 표면 중복이 없는 voice flattening도 퇴고 대상으로 삼는다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 2 files, 238 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/docs/catalog-sync.test.ts`: 4 passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 621 tests passed, required outputs 29 verified

추가 확인(2026-06-22 Korean honorific voice drift evidence):

- 리서치 반영: Korean speech levels는 상대와 상황의 격식/공손성을 sentence ending으로 표시하는 문법 체계이고, 현대 한국어 대화에서는 합쇼체/해요체/해체 같은 층위 차이가 인물 관계와 사회적 거리감을 직접 만든다. character voice stylometry 연구가 인물별 style 구분을 대작의 believable character evidence로 본다면, 한국어 장편에서는 그 style의 핵심 축 중 하나가 존대/반말 층위다. 따라서 캐릭터 voice profile에 `honorificDefault`가 있는데 분석기가 이를 보지 않으면, 격식체 인물이 근거 없이 반말하거나 친밀한 인물이 갑자기 공식체로 굳는 OOC drift를 놓칠 수 있다. 참고: [Korean speech levels](https://en.wikipedia.org/wiki/Korean_speech_levels), [Finding a Character's Voice](https://aclanthology.org/W17-2210/).
- `analyzeVoiceConsistency`에 `checkHonorificConsistency`를 연결했다. `VoiceAspect`에는 `honorific`이 추가됐고, 대사별 dominant ending을 `hapsyoche`, `haeyoche`, `haeche`로 분류해 프로필의 `linguisticMarkers.honorificDefault`와 비교한다.
- 합쇼체 캐릭터가 해체/반말 대사를 쓰거나 해체 캐릭터가 합쇼체 공식 대사를 쓰면 major deviation으로 잡는다. 해요체와의 인접 drift는 minor/moderate로 낮춰, 장면상 관계 변화가 있을 수 있는 경우를 전면 차단하기보다 stage directive의 우선순위 근거로 남긴다.
- `generateRecommendations`가 honorific deviation만 있는 경우에도 “음성 일관성이 좋습니다”로 떨어지지 않고, 캐릭터의 기본 말투를 합쇼체/해요체/해체로 유지하라는 권고를 낸다.
- 검증 결과:
  - `npx vitest run tests/voice/character-voice.test.ts`: 39 passed
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/stage-evaluators.test.ts tests/voice/character-voice.test.ts`: 2 files, 65 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/docs/catalog-sync.test.ts tests/quality/stage-evaluators.test.ts tests/voice/character-voice.test.ts`: 3 files, 69 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 621 tests passed, required outputs 29 verified

추가 확인(2026-06-22 project character voice profile enforcement evidence):

- 리서치 반영: character stylome/quotation attribution 연구는 인물의 발화 style, topic preference, persona가 화자 구분의 신호가 될 수 있다고 본다. Korean speech levels가 문장 종결로 공손성/관계 거리를 표시한다는 점까지 합치면, 프로젝트 캐릭터 파일에 말투가 기록되어 있는데 실제 원고 gate가 이를 읽지 않는 것은 "캐릭터 설정은 좋지만 회차 대사에서는 모두 같은 목소리"가 되는 위험이다. 따라서 대작형 시스템에서는 캐릭터 프로필의 말투 설정과 화자 귀속 원고 대사를 직접 연결해야 한다. 참고: [Finding a Character's Voice](https://aclanthology.org/W17-2210/), [A Computational Analysis of the Voices of Shakespeare's Characters](https://aclanthology.org/2023.ranlp-1.33/), [A Study of Authorship Verification Models for Quotation Attribution](https://aclanthology.org/2024.latechclfl-1.15.pdf), [Korean speech levels](https://en.wikipedia.org/wiki/Korean_speech_levels).
- `CharacterReferenceForEvaluation`에 `voice`를 추가하고, `recordEngagementFromProject`가 `characters/index.json`, `characters/{id}.json`의 `basic.voice`, 그리고 기존 top-level `speech_pattern`을 `CharacterVoiceReferenceForEvaluation`으로 정규화해 `evaluateEngagementContract`에 전달한다.
- `evaluateEngagementContract`는 새 critical issue `manuscript-character-voice-profile-drift`를 기록한다. 화자 귀속 대사가 캐릭터 이름/alias와 매칭되고, 프로필의 `formality_level` 또는 `speech_pattern`이 존댓말/반말/격식 신호를 주는데 원고 대사가 반복적으로 다른 register를 쓰면 manuscript directive로 되돌린다. 어휘, 시그니처 표현, 방언은 캐릭터 voice profile context로 보존해 퇴고 지시의 기준으로 전달한다.
- 한국어 구어 register 감지는 기존 합쇼체/해요체/해체 종결에 더해 `봐`, `가`, `와`, `말해`, `넘겨`, `비켜`, `열어` 같은 명령형 해체 종결도 casual로 세도록 확장했다. 이를 통해 "지금 넘겨."처럼 실제 스릴러 대사에서 흔한 반말 명령이 neutral로 빠져 프로필 드리프트를 놓치는 문제를 줄였다.
- `tests/masterpiece/engagement-contract-evaluator.test.ts`는 존댓말 위주/formal 프로필의 이서진이 "지금 넘겨/빨리 확인해"식 반말 명령을 반복하면 실패하고, "지금 확인하겠습니다/먼저 기록부터 보겠습니다"식 대사는 실패하지 않는 것을 검증한다.
- `tests/masterpiece/engagement-record-cli.test.ts`는 sample project의 기존 `characters/char_1.json` top-level `speech_pattern: "직설적, 존댓말 위주"`를 CLI가 실제로 읽어 `chapter_001.md`의 반말 화자 귀속 대사를 `manuscript-character-voice-profile-drift`로 되돌리는 것을 검증한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts`: 156 passed
  - `npx vitest run tests/masterpiece/engagement-record-cli.test.ts`: 14 passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-record-cli.test.ts tests/masterpiece/engagement-contracts.test.ts`: 3 files, 254 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/docs/catalog-sync.test.ts`: 4 passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 624 tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 character signature phrase and dialect ownership evidence):

- 리서치 반영: Literator의 characterisation/stylometry 논의는 characterisation과 language usage를 정량적으로 볼 수 있고, 인물별 idiolect가 lexical choice, function words, sentence length, pronoun use 등으로 드러난다고 본다. War and Peace fictional dialogue 연구도 인물별 speech를 narrator voice와 분리해 반복 stylistic parameter로 측정할 수 있다고 설명한다. 2025년 idiolect marker review는 vocabulary, syntax, speech patterns가 개인 언어 패턴을 식별하는 핵심 marker라고 정리한다. 따라서 캐릭터 voice profile의 시그니처 표현과 방언은 단순 장식이 아니라 인물 식별성 evidence다. 참고: [Stylometry and characterisation in The Big Bang Theory](https://literator.org.za/index.php/literator/article/view/1282/2151), [Character-distinguishing features in fictional dialogue](https://dh-abstracts.library.virginia.edu/works/4176), [Identifying Key Idiolect Markers in Sociolinguistic Profiling](https://journals.sagepub.com/doi/10.1177/21582440251334276).
- `manuscript-character-voice-profile-drift`가 register drift뿐 아니라 signature phrase ownership drift도 잡는다. 캐릭터 A의 `signature_phrases`로 등록된 고유 표현이 캐릭터 B의 화자 귀속 대사에 exact phrase로 나타나면, B가 A의 고유 말버릇을 빌려 쓴 것으로 보고 critical directive를 만든다. 단, 같은 phrase가 여러 캐릭터에 공유 등록된 경우에는 소유권을 강제하지 않는다.
- 방언 검사는 과도한 사투리 강제가 아니라 profile conflict 탐지로 제한했다. `dialect: "표준어"`인데 `뭐라카`, `카노`, `아이가`, `당께`, `했슈`, `혼저 옵서` 같은 지역 방언 marker가 반복되거나, 특정 방언 profile과 다른 지역 marker가 반복되면 `manuscript-character-voice-profile-drift`로 되돌린다. 반대로 방언 캐릭터가 모든 대사에서 방언 marker를 쓰지 않는다는 이유만으로 실패시키지는 않는다.
- `tests/masterpiece/engagement-contract-evaluator.test.ts`에 다른 캐릭터의 formal signature phrase를 이서진이 빌려 쓰는 샘플과, 표준어 프로필의 이서진이 반복적으로 경상도 marker를 쓰는 샘플을 추가했다.
- `tests/masterpiece/engagement-record-cli.test.ts`에 실제 프로젝트 `characters/{id}.json`의 nested `basic.voice.signature_phrases`를 읽어 다른 캐릭터 표현 차용을 CLI에서 실패시키는 회귀 테스트를 추가했다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-record-cli.test.ts tests/masterpiece/engagement-contracts.test.ts`: 3 files, 257 tests passed
  - `npx vitest run tests/docs/catalog-sync.test.ts`: 4 passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 627 tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 character vocabulary profile hard gate evidence):

- 리서치 반영: fictional dialogue stylometry와 idiolect marker 연구는 캐릭터 식별성을 어휘 선택, 구문, 운율, speech pattern의 조합으로 본다. LLM 보조 글쓰기의 homogenization 논의도 인물별 어휘 선택이 평균화되면 캐릭터 음성이 흐려질 수 있음을 시사한다. 따라서 `basic.voice.vocabulary`를 단순 참고 문구로 두면, 사용자가 문체를 거슬린다고 느낀 핵심 원인인 "누가 말해도 같은 단어를 쓰는 대사"를 충분히 막지 못한다. 참고: [Identifying Key Idiolect Markers in Sociolinguistic Profiling](https://journals.sagepub.com/doi/10.1177/21582440251334276), [Character-distinguishing features in fictional dialogue](https://dh-abstracts.library.virginia.edu/works/4176), [The Homogenizing Effect of Large Language Models on Human Writing](https://arxiv.org/html/2508.01491v2).
- `manuscript-character-voice-profile-drift`가 이제 `basic.voice.vocabulary`의 `선호 어휘: ...; 금지 어휘: ...` 표기를 파싱한다. 캐릭터가 명시된 금지/회피 어휘를 반복해서 쓰거나, 다른 캐릭터만의 고유 선호 어휘를 화자 귀속 대사에서 빌려 쓰면 critical directive를 만든다. 일반적인 자유 서술형 vocabulary 설명은 오탐을 피하기 위해 hard gate로 쓰지 않고, 명시된 선호/금지 section만 검증한다.
- 선호 어휘 소유권 검사는 `signature_phrases`와 같은 원칙으로 구현했다. 같은 선호 어휘가 여러 캐릭터에 공유 등록된 경우에는 소유권을 강제하지 않고, 너무 짧은 일반어는 ownership term에서 제외한다. 반면 `현장로그`, `증거번호`, `혈흔지도`처럼 명시적으로 캐릭터의 말버릇/전문 어휘로 둔 단어는 다른 인물이 반복하거나 고유성이 높은 단어를 쓰면 실패한다.
- `schemas/character.schema.json`과 `templates/character.template.json`의 `vocabulary` 설명을 `선호 어휘: ; 금지 어휘: ` 형식으로 갱신했고, README 및 `/write`, `/write_all`, `/verify-chapter` 스킬에 같은 규칙을 반영했다.
- `tests/masterpiece/engagement-contract-evaluator.test.ts`에 금지 어휘 반복 사용과 다른 캐릭터 선호 어휘 차용 샘플을 추가했고, `tests/masterpiece/engagement-record-cli.test.ts`에 실제 프로젝트 `characters/{id}.json`의 nested `basic.voice.vocabulary`를 읽어 CLI에서 실패시키는 회귀 테스트를 추가했다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-record-cli.test.ts tests/masterpiece/engagement-contracts.test.ts`: 3 files, 260 tests passed
  - `npx vitest run tests/docs/catalog-sync.test.ts`: 4 passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 630 tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 punctuation emphasis prose friction evidence):

- 리서치 반영: 국립국어원 문장 부호 해설은 느낌표, 물음표, 줄임표가 감정·의문·말 없음·머뭇거림 같은 효과를 표시할 수 있음을 설명한다. 따라서 이 시스템은 문장부호 자체를 금지하지 않고, 대사 내용·행동 비트·상대 반응이 해야 할 감정 전달을 `!`, `?!`, `!!`, `……`가 대신하는 과밀/연쇄만 문체 마찰로 본다. 참고: [국립국어원 문장 부호 해설](https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=431&mn_id=46), [Chicago Manual Q&A: quotations](https://www.chicagomanualofstyle.org/qanda/data/faq/topics/Quotations/faq0077.html).
- `prose-taste-gate`에 `punctuation-emphasis-overload`를 추가했다. 새 metric은 `emphasisPunctuationDensityPer1000`과 `longestEmphasisPunctuationRun`이며, 기본 balanced 기준에서는 1000자당 6회 초과 또는 3문장 초과 연쇄를 잡는다. 실패 directive는 문장부호를 단순 삭제하라는 지시가 아니라 선택 변화, 대사 내용, 행동 비트, 상대 반응으로 같은 긴장과 망설임을 다시 세우도록 한다.
- `prose_taste_profile`, `style-guide`/`prose-taste-benchmark` schema와 template, `apply-chapter-gate`, 프로젝트 benchmark CLI, `run-prose-taste-benchmark` 옵션에 `max_emphasis_punctuation_density_per_1000`, `max_emphasis_punctuation_run`, `--max-emphasis-punctuation`, `--max-emphasis-punctuation-run`을 연결했다. style fingerprint와 authorial style drift metric에도 강조 문장부호 밀도를 포함해, 선호/비선호 문체 분리와 회차별 작가 음색 흔들림에 반영한다.
- `templates/prose-taste-benchmark.template.json`에 강조 문장부호가 감정과 침묵을 대신하는 비선호 샘플을 추가했고, `tests/quality/prose-taste-gate.test.ts`는 기본 기준에서는 실패하지만 `webnovel-fast` 또는 프로젝트 프로필에서 허용치를 높이면 통과할 수 있음을 검증한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 3 files, 80 tests passed
  - `npx vitest run tests/docs/catalog-sync.test.ts`: 4 passed
  - JSON schema/template parse check: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 634 tests passed, required outputs 29 verified

추가 확인(2026-06-22 reader panel manuscript order-control evidence):

- 리서치 반영: 설문 응답은 응답 옵션/문항 순서 효과를 받을 수 있고, 반복 측정 또는 within-subjects 설계에서는 같은 참여자가 여러 자극을 볼 때 order, carryover, fatigue, context effects가 생길 수 있다. 따라서 한 독자가 여러 원고·회차·개정 버전을 평가하는 독자 패널을 threshold retuning 근거로 쓰려면 제시 순서 randomization/counterbalancing, 독자당 최대 샘플 수, 순서 균형 비율을 함께 보존해야 한다. 참고: [Response option order effects](https://pmc.ncbi.nlm.nih.gov/articles/PMC9619315/), [Speeding and response quality in web surveys](https://pmc.ncbi.nlm.nih.gov/articles/PMC6863515/), [Research Methods in Psychology: Experimental Design](https://opentextbooks.rug.nl/rspremsc/chapter/experimental-design/), [Scribbr Within-Subjects Design](https://www.scribbr.com/methodology/within-subjects-design/).
- `ReaderResponseSampleEvidence`에 `sampleOrderRandomized`, `manuscriptOrderCounterbalanced`, `maxSamplesPerRespondent`, `orderBalanceRatio`를 추가했다. `evaluatePanelProtocolQuality`는 독자당 샘플이 2개 이상이거나 최대 샘플 수가 불명확하면 원고/샘플 제시 순서 randomization, manuscript/variant counterbalancing, order balance ratio를 요구한다.
- 기본 기준은 `maximumSamplesPerRespondent: 3`, `minimumOrderBalanceRatio: 0.8`이다. 루트 JSON 옵션 `maximum_samples_per_respondent`, `minimum_order_balance_ratio`와 CLI 플래그 `--max-samples-per-respondent`, `--min-order-balance-ratio`로 조정할 수 있다.
- JSON 스키마, 템플릿, CLI raw evidence 매핑, README를 같은 필드 목록으로 갱신했다. 반복 노출 순서 통제가 약한 패널은 점수·합의도·대표성이 충분해도 `panelProtocolQuality=weak`, `lowProtocolQualityCount`, `weak protocol` tuning blocker로 남고 threshold retuning usable coverage에서 제외된다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - JSON schema/template parse check: passed
  - `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts`: 2 files, 48 tests passed
  - `npx vitest run tests/docs/catalog-sync.test.ts`: 4 passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 635 tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 evaluative modifier stack prose friction evidence):

- 리서치 반영: 장르별 텍스트의 품사 분포 연구는 fiction과 non-fiction이 adjective/adverb, POS distribution 같은 언어적 feature에서 다르게 나타날 수 있음을 보이며, adjective density 연구도 형용사 밀도를 텍스트 형식성/문체 분류의 측정 가능한 신호로 사용한다. Biber의 register/corpus linguistics 논의처럼 목표 register의 언어 사용 패턴을 empirical feature로 보는 관점에 따르면, 사용자가 "문체가 거슬린다"고 느낀 반응은 금지어 목록만으로는 부족하고 반복되는 수식 패턴을 metric으로 남겨야 한다. 따라서 새 gate는 형용사를 금지하지 않고, 차갑다/서늘하다/불길하다 같은 평가 형용사가 한 문장 안에서 두 개 이상 쌓이고 그런 문장이 이어질 때만 문체 마찰로 본다. 참고: [Linguistic Profiling of Text Genres](https://www.mdpi.com/2078-2489/13/8/357), [Adjective Density as a Text Formality Characteristic](https://aclanthology.org/Y09-1015.pdf), [Corpus Linguistics and the Study of Literature](https://jan.ucc.nau.edu/biber/Biber/Biber%20%282011%29.pdf).
- `prose-taste-gate`에 `evaluative-modifier-stack`을 추가했다. 새 metric은 `evaluativeModifierDensityPer1000`과 `longestEvaluativeModifierRun`이며, 기본 balanced 기준에서는 1000자당 8회 초과 및 stack sentence 3개 이상이거나 3문장 초과 연쇄일 때 실패한다. 실패 directive는 평가어를 무조건 지우라는 지시가 아니라 온도, 빛, 소리, 물건 위치, 인물 선택 같은 장면 변화로 압박을 증명하도록 되돌린다.
- `prose_taste_profile`, `style-guide`/`prose-taste-benchmark` schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI 옵션에 `max_evaluative_modifier_density_per_1000`, `max_evaluative_modifier_run`, `--max-evaluative-modifiers`, `--max-evaluative-modifier-run`을 연결했다. style fingerprint에는 density와 longest run을, authorial style drift에는 density를 넣어 선호/비선호 문체 분리와 회차별 작가 음색 흔들림에도 반영한다.
- `templates/prose-taste-benchmark.template.json`에 평가 형용사가 장면 변화 없이 누적되는 비선호 샘플을 추가했고, `tests/quality/prose-taste-gate.test.ts`는 기본 기준에서는 실패하지만 프로젝트 프로필에서 허용치를 높이면 통과할 수 있음을 검증한다. `schemas/prose-taste-benchmark.schema.json`의 issue enum에는 새 issue와 함께 기존 TS 타입에는 있었지만 schema enum에서 빠져 있던 `ambiguous-reference-chain`도 맞췄다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 2 files, 53 tests passed
  - `npm run validate:schemas`: passed
  - JSON schema/template parse check: passed
  - `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/docs/catalog-sync.test.ts`: 2 files, 33 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 637 tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 reader drop-off localization gate directives):

- 리서치 반영: 독자 몰입은 총점 하나보다 읽는 도중 어느 문장·문단에서 주의가 끊겼는지, 혼란·호기심·연결감이 어디서 생겼는지와 함께 봐야 한다. 따라서 `drop_off_annotations`는 독자가 중도 이탈하거나 훑어읽은 위치, 마지막으로 완료한 위치, trigger quote, 이유, reader segment, suggested revision을 보존한다.
- `apply-chapter-gate`가 이제 `dropOffAnnotations`와 `dropOffLocalizationEvidenceIssues`를 읽어 `readerResponse.issues`와 `Reader Response Revision Directives`로 직접 올린다. actionable한 이탈 주석은 `drop-off:<eventType>` dimension으로 들어가며, 같은 회차 retry prompt에 위치와 suggested revision이 그대로 전달된다.
- `/verify-chapter`, `/write`, `/write-all` 스킬 문서를 갱신해 `friction_annotations`뿐 아니라 `drop_off_annotations`도 editor/act-review/revision-team 입력에서 우선 반영해야 하는 독자 패널 근거로 명시했다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 35 passed
  - `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 86 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 642 tests passed, required outputs 29 verified
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 actual continuation behavior hard gate):

- 리서치 반영: 행동 의향은 실제 행동을 완전히 대체하지 못한다. Webb & Sheeran의 행동 의향 메타분석은 의향 변화가 실제 행동 변화로 이어지는 폭이 더 작을 수 있음을 보이고, 2022년 intention-behavior gap review도 의향이 행동 분산 전체를 설명하지 못한다고 정리한다. 디지털 읽기 연구에서도 독자의 navigation/access behavior 로그가 과제 수행과 연결되어 분석된다. 따라서 장편 연재 gate는 "다음 화를 누르겠다"는 즉시 응답만 보지 않고, 실제 CTA 노출 뒤 클릭, 다음 화 열람, 읽기 시작이 일어났는지 current chapter gate에 반영해야 한다. 참고: [Webb & Sheeran 2006](https://www.semanticscholar.org/paper/Does-changing-behavioral-intentions-engender-change-Webb-Sheeran/fb59bc130ba009194610c16a2beb172bd218e70c), [Understanding the intention-behavior gap](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.923464/full), [Online Reading Engagement](https://www.pedocs.de/volltexte/2019/17974/pdf/Naumann_OnlineReadingEngagement_CHB_A.pdf).
- `apply-chapter-gate`가 이제 reader-response calibration 결과에서 `humanReaderEvidence`, `responseDataQuality`, `panelConsensus`, `readerScoreConfidence`, `cohortRepresentativeness`, `panelProtocolQuality`가 신뢰 가능한 현재 회차 샘플을 먼저 확인한다. 이 샘플에서 실제 `nextChapterCtaImpressionCount`, `nextChapterClickCount`, `nextChapterOpenCount`, `nextChapterReadStartCount`가 존재하고 `continuationBehaviorEvidence=weak`이면 `continuation-behavior-drop`으로 `readerResponse.passed=false`가 된다.
- 이 변경은 missing behavior evidence와 bad behavior evidence를 분리한다. 실제 행동 로그가 없거나 패널 자체가 신뢰 불충분이면 hard block이 아니라 기존처럼 evidence 수집/경고로 남는다. 반대로 행동 로그가 있고 비율이 낮으면 자동 점수, 평균 호감, 다음 화 의향이 좋아도 Ralph Loop 완료를 막고 `actual-continuation-behavior` revision directive로 말미 훅과 다음 화 bridge를 다시 쓰게 한다.
- `tests/masterpiece/chapter-gate-cli.test.ts`에 실제 다음 화 클릭률 12.5%, 열람률 12.5%, 읽기 시작 0% 샘플이 `RETRY`를 만들고, 기존 score-only weak evidence 샘플은 여전히 hard block하지 않는 회귀 테스트를 추가했다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 36 passed
  - `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 4 files, 105 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 645 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1350 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 scene transition grounding prose friction evidence):

- 리서치 반영: Zwaan, Langston, Graesser의 event-indexing model은 독자가 서사 사건을 시간, 공간, 인물, 인과, 의도 축으로 연결해 상황 모델을 만든다고 본다. 담화 coherence 연구도 연속 담화 단위가 REASON, 시간적 인접성, entity focus 같은 관계로 묶여야 이해와 기억이 쉬워진다고 설명한다. 따라서 `***`, `---`, `###` 같은 장면 전환 표식 뒤 새 장면이 시간 경과, 이동, 앞 장면의 원인-결과, POV 감각 잔류 없이 바로 시작되면, 자동 점수는 높아도 독자는 “장면이 툭 끊긴다”는 문체 마찰을 느낄 수 있다. 참고: [Event-Indexing Model](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.1995.tb00513.x/), [Coh-Metrix temporal cohesion publications](https://ies.ed.gov/use-work/awards/coh-metrix-automated-cohesion-and-coherence-scores-predict-text-readability-and-facilitate), [Discourse coherence](https://web.stanford.edu/~jurafsky/slp3/24.pdf), [Discourse structure and global coherence](https://cdn.aaai.org/ocs/2275/2275-9743-1-PB.pdf).
- `prose-taste-gate`에 `scene-transition-grounding-gap`을 추가했다. 새 metric은 `sceneTransitionGroundingGapDensityPer1000`과 `longestSceneTransitionGroundingGapRun`이며, 기본 balanced 기준에서는 전환 표식 뒤 접지 없는 전환이 1000자당 3회 초과 및 2회 초과 연속일 때 실패한다. 단일 영화적 컷은 통과할 수 있지만, 연쇄 장면 점프는 퇴고 directive로 되돌린다.
- 실패 directive는 전환어를 기계적으로 붙이라는 지시가 아니라, 전환 직후 첫 문장에 시간 경과, 이동 경로, 앞 장면의 인과 결과, POV 감각 잔류 중 하나를 심어 새 장면을 독자의 상황 모델에 연결하게 한다.
- `prose_taste_profile`, style-guide/prose-taste-benchmark schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI 옵션에 `max_scene_transition_grounding_gap_density_per_1000`, `max_scene_transition_grounding_gap_run`, `--max-scene-transition-gaps`, `--max-scene-transition-gap-run`을 연결했다. style fingerprint에도 장면 전환 접지 부족 metric을 포함해 선호/비선호 문체 분리 근거로 남긴다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 3 files, 85 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 648 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1353 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 topic marker cadence prose friction evidence):

- 리서치 반영: Coh-Metrix는 문장 길이뿐 아니라 cohesion, syntactic complexity, syntactic pattern density 같은 다층 언어 지표를 텍스트 품질·가독성 분석에 사용한다. 한국어 KOSCA도 문장 수, 문장당 형태소, 절 구조, 동사 수, 조사 type frequency 같은 구문 복잡도 지표를 한국어 텍스트 분석 대상으로 삼는다. 담화 coherence 연구 역시 독자가 표면 언어 신호를 통해 referential/relational coherence를 구성한다고 본다. 따라서 한국어 소설 원고에서 매 문장이 `서연은...`, `민준은...`, `문이...`처럼 은/는/이/가 주어·화제 조사로만 출발하면, 사건 정보가 있어도 문장 표면 박자가 잠겨 AI식 주어-술어 행진처럼 읽힐 수 있다. 참고: [Coh-Metrix](https://soletlab.asu.edu/coh-metrix/), [Coh-Metrix Advanced Overview](https://sites.gsu.edu/csal/readibillity/coh-metrix-advanced-overview/), [Korean Syntactic Complexity Analyzer](https://haerimhwang.github.io/tools/Korean-syntactic-complexity-analyzer), [Experimental Studies in Discourse](https://jethoek.github.io/publications/Sandersetal2023.pdf).
- `prose-taste-gate`에 `topic-marker-cadence-lock`을 추가했다. 새 metric은 `topicMarkerStarterDensityPer1000`과 `longestTopicMarkerStarterRun`이며, 기본 balanced 기준에서는 주어·화제 조사 시작문이 고밀도이거나 4문장 초과 연속될 때 실패한다. `복도에서는` 같은 locative topic과 오늘/방금/그날 같은 시간 topic은 의도적 전환 앵커일 수 있어 hard count에서 제외했다.
- 실패 directive는 주어를 단순 삭제하라는 지시가 아니라, 일부 문장을 시간/장소/사물/행동 결과/종속절로 열거나 앞 문장에 묶어 문장 시작 박자를 분산하도록 한다. 의도적 병렬문이나 빠른 웹소설 호흡은 `max_topic_marker_starter_density_per_1000`, `max_topic_marker_starter_run` 또는 CLI의 `--max-topic-marker-starters`, `--max-topic-marker-run`으로 완화할 수 있다.
- `prose_taste_profile`, style-guide/prose-taste-benchmark schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI 옵션에 새 필드를 연결했다. style fingerprint와 authorial style drift metric에도 topic-marker cadence를 포함해, 선호/비선호 문체 분리와 회차별 작가 문체 흔들림에 반영한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts`: 57 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 67 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 651 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1356 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 body reaction subject chain prose friction evidence):

- 리서치 반영: embodied writing 연구는 몸의 감각을 살아 있는 경험의 일부로 다루되, 독자가 몸과 세계의 접촉을 장면 안에서 느끼게 해야 한다고 본다. 한국어 담화 연구에서도 은/는/이/가가 붙은 문장 첫머리 성분은 문장의 주제·초점 구성에 강하게 관여한다. 따라서 소설 원고에서 `심장이 뛰었다`, `숨이 막혔다`, `목구멍이 말랐다`, `손끝이 굳었다`처럼 몸이 계속 문장 주어가 되면, 감정이 인물의 선택·대가·상대 행동으로 구현되지 않고 자동 생리 반응 목록으로 밀려난다. 참고: [Anderson 2001 Embodied Writing](https://depthpsychotherapy.pbworks.com/f/Embodied%2BWriting.pdf), [Subject and Object Markings in Conversational Korean](https://arts-sciences.buffalo.edu/content/dam/arts-sciences/linguistics/AlumniDissertations/Kim%20dissertation.pdf), [Coh-Metrix](https://soletlab.asu.edu/coh-metrix/), [Korean Syntactic Complexity Analyzer](https://haerimhwang.github.io/tools/Korean-syntactic-complexity-analyzer).
- `prose-taste-gate`에 `body-reaction-subject-chain`을 추가했다. 새 metric은 `bodyReactionSubjectDensityPer1000`과 `longestBodyReactionSubjectRun`이며, 기본 balanced 기준에서는 몸 주어 자동 반응 문장이 1000자당 6회 초과하거나 2문장 초과 연속될 때 실패한다. 단순 신체 감각 자체는 금지하지 않고, 문장 주어와 연속 리듬이 잠기는 경우만 잡는다.
- 실패 directive는 "신체 반응을 모두 삭제"가 아니라, 자동 반응 일부를 인물의 선택, 숨긴 정보, 말의 회피, 상대 행동 변화, 장면 상태 변화로 바꾸도록 지시한다. 의도적으로 somatic prose를 쓰는 프로젝트는 `max_body_reaction_subject_density_per_1000`, `max_body_reaction_subject_run` 또는 CLI의 `--max-body-reaction-subjects`, `--max-body-reaction-subject-run`으로 완화할 수 있다.
- `prose_taste_profile`, style-guide/prose-taste-benchmark schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI 옵션에 새 필드를 연결했다. style fingerprint와 authorial style drift에도 새 metric을 반영해 선호/비선호 문체 분리와 회차별 작가 문체 흔들림에 포함한다.
- `templates/prose-taste-benchmark.template.json`에 몸 주어 자동 반응이 반복되는 비선호 샘플을 추가했고, `tests/quality/prose-taste-gate.test.ts`는 기본 기준 실패, 선택/행동으로 종속된 통과 샘플, 프로젝트별 완화 설정을 검증한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 90 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/docs/catalog-sync.test.ts`: 3 files, 42 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 655 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1360 tests passed

추가 확인(2026-06-22 cliche emotion image chain prose friction evidence):

- 리서치 반영: narrative transportation 연구는 독자의 몰입이 이야기 세계 안에서 구성될 때 설득력과 감정 반응이 커진다고 본다. 반대로 글쓰기 craft 자료들은 눈물, 얼어붙은 피, 시간이 멈춤, 세상이 무너짐 같은 익숙한 감정 표지가 반복되면 독자가 인물 고유의 선택·대가보다 공식화된 감정 신호를 먼저 읽게 된다고 경고한다. 따라서 이 시스템이 "재밌는 대작"을 목표로 한다면, 감정 표현을 금지하는 게 아니라 상투적 이미지가 장면 고유성과 선택의 압박을 대체하는 순간을 따로 잡아야 한다. 참고: [Narrative Transportation](https://oxfordre.com/communication/view/10.1093/acrefore/9780190228613.001.0001/acrefore-9780190228613-e-261?print=), [Green & Appel 2024](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf), [How to Avoid Cliched Emotional Responses](https://annerallen.com/2019/05/avoid-cliched-emotional-responses/), [Physical Cliches](https://kidlit.com/physical-cliches/).
- `prose-taste-gate`에 `cliche-emotion-image-chain`을 추가했다. 새 metric은 `clicheEmotionImageDensityPer1000`과 `longestClicheEmotionImageRun`이며, 기본 balanced 기준에서는 눈물/시간 정지/세상 붕괴/머릿속 하얘짐/칼날 같은 침묵 계열의 상투적 감정 이미지가 1000자당 4회 초과하거나 3문장 초과 연속될 때 실패한다.
- 실패 directive는 "감정 이미지를 모두 삭제"가 아니라, 익숙한 이미지 일부를 인물만 가진 물건, 말버릇, 선택 비용, 상대 반응, 장면 결과로 바꾸도록 지시한다. 의도적으로 heightened narration을 쓰는 프로젝트는 `max_cliche_emotion_image_density_per_1000`, `max_cliche_emotion_image_run` 또는 CLI의 `--max-cliche-emotion-images`, `--max-cliche-emotion-image-run`으로 완화할 수 있다.
- `prose_taste_profile`, style-guide/prose-taste-benchmark schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI 옵션에 새 필드를 연결했다. style fingerprint와 authorial style drift에도 새 metric을 반영해, 선호/비선호 문체 분리와 회차별 문체 흔들림에 포함한다.
- `templates/prose-taste-benchmark.template.json`에 상투적 감정 이미지가 반복되는 비선호 샘플을 추가했고, `tests/quality/prose-taste-gate.test.ts`는 기본 기준 실패, 장면 사물·선택으로 구체화된 통과 샘플, 프로젝트별 완화 설정을 검증한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 94 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/docs/catalog-sync.test.ts`: 3 files, 42 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 659 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1364 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 uniform sentence length cadence prose friction evidence):

- 리서치 반영: 2025년 인간/AI 창작문 stylometry 비교 연구는 LLM 출력이 인간 텍스트보다 문체 cluster가 더 조밀하고 균일한 경향을 보였다고 정리한다. 이 결과를 AI 판별기로 쓰려는 것이 아니라, "문장 자체는 짧지 않은데 같은 길이와 같은 박자로 이어지는 산문"이 독자에게 기계적 균일감으로 읽힐 수 있다는 style-friction 근거로 사용한다. SJSU Writing Center의 sentence variety/rhythm 자료도 같은 길이·구조의 문장이 반복될 때 글의 rhythm이 사라지고 monotony가 생긴다고 설명한다. 참고: [Stylometric comparisons of human versus AI-generated creative writing](https://www.nature.com/articles/s41599-025-05986-3), [Sentence Variety and Rhythm](https://www.sjsu.edu/writingcenter/docs/handouts/Sentence%20Variety%20and%20Rhythm.pdf).
- `prose-taste-gate`에 `uniform-sentence-length-cadence`를 추가했다. 새 metric은 `sentenceLengthVariationCoefficient`와 `longestUniformSentenceLengthRun`이며, 기본 balanced 기준에서는 중간 이상 길이의 서술문 길이 변동 계수가 0.24 미만이고 균일 길이 run이 6문장을 넘을 때 실패한다. 대사, 짧은 단문, 비측정 문장은 run을 끊어 의도적인 짧은 호흡이나 대화 리듬을 과하게 막지 않는다.
- 실패 directive는 문장을 무작정 짧게 만들라는 지시가 아니라, 짧은 결정문, 긴 감각/정보/반응문, 문단 길이 변화를 섞어 문단 박자를 풀도록 지시한다. `min_sentence_length_variation_coefficient`, `max_uniform_sentence_length_run` 또는 CLI의 `--min-sentence-length-variation`, `--max-uniform-sentence-run`으로 장르별 허용치를 조정할 수 있다.
- style fingerprint에는 `sentenceLengthVariationCoefficient`와 `longestUniformSentenceLengthRun`을 넣고, authorial style drift에는 `sentenceLengthVariationCoefficient`를 넣었다. 따라서 단일 회차 실패뿐 아니라 선호/비선호 문체 분리와 회차별 작가 음색 흔들림에도 같은 리듬 신호가 반영된다.
- `style-guide`/`prose-taste-benchmark` schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI 옵션을 모두 같은 필드로 연결했다. benchmark profile 병합 과정에서 기존 `scene-transition-grounding-gap`/`topic-marker-cadence-lock` override가 보존되지 않던 누락도 함께 보완했다.
- `templates/prose-taste-benchmark.template.json`에 비슷한 길이의 중간 이상 서술문이 반복되는 비선호 샘플을 추가했고, `tests/quality/prose-taste-gate.test.ts`와 `tests/quality/prose-taste-benchmark.test.ts`는 기본 기준 실패, 변동 있는 문장 통과, 프로젝트별 완화 설정을 검증한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/docs/catalog-sync.test.ts`: 5 files, 140 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 663 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1368 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 reader panel prior exposure and spoiler contamination protocol):

- 리서치 반영: demand characteristics 연구는 참여자가 연구 목적이나 기대 반응을 알아차리면 자기보고 반응이 왜곡될 수 있다고 보며, blinding은 이런 관찰자·참여자 단서를 줄이는 핵심 절차로 다뤄진다. 독서 경험 연구도 스포일러 효과는 일관되게 한 방향은 아니지만, 스포일러 유형이 독자의 주의와 감상 경험을 바꿀 수 있음을 보여준다. Johnson & Rosenbaum의 실험에서는 spoiler가 없는 이야기가 더 재미있고 suspenseful하며 moving/enjoyable하게 평가됐다. 따라서 독자 패널 점수는 원고 자체를 처음 읽은 반응인지, 작가/출처 단서·기존 노출·시놉시스/스포일러에 의해 이미 해석된 반응인지 분리해야 한다. 참고: [PLOS ONE demand characteristics review](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0039116), [Blinding in Clinical Trials and Other Studies](https://www.mdpi.com/1648-9144/57/7/647), [The Role of Different Spoiler Types in the Experience of Short Stories](https://ssol-journal.com/articles/10.61645/ssol.190), [Spoiler Alert: Consequences of Narrative Spoilers](https://research.vu.nl/en/publications/spoiler-alert-consequences-of-narrative-spoilers-for-dimensions-o/).
- `reader-response-calibration`의 `ReaderResponseSampleEvidence`, CLI raw evidence mapping, JSON 입력 스키마, 템플릿에 `author_identity_masked`, `prior_exposure_screened`, `unexcluded_prior_exposure_count`, `spoiler_exposure_screened`, `unexcluded_spoiler_exposure_count`를 추가했다. 이제 `panelProtocolQuality=strong`은 blind reading만으로 통과하지 않고, 작가/출처 단서가 가려졌는지, 원고/이전 버전 노출을 선별했는지, 스포일러/시놉시스 노출을 선별했는지, 선별 후 오염 응답이 0건인지까지 확인한다.
- `strengthen-reader-panel-protocol` evidence collection task와 README의 필드 목록도 같은 항목으로 갱신했다. 기존 노출이나 스포일러 노출 응답이 남아 있는 패널은 독자 점수·합의도·대표성·retention evidence가 충분해도 `lowProtocolQualityCount`, `weak protocol` blocker로 남고 threshold retuning usable coverage에서 제외된다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/reader-response-calibration.test.ts tests/masterpiece/reader-response-calibration-cli.test.ts tests/docs/catalog-sync.test.ts`: 3 files, 58 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 664 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1369 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 same ending cadence prose friction evidence):

- 리서치 반영: 한국어 skaz narrative 번역 연구는 문장 종결 어미의 선택과 분포가 화자의 구어성, 문체 적합성, 서술 음색을 바꾼다고 분석한다. Purdue OWL과 Writing for Success도 같은 길이·구조가 반복되는 문장은 rhythm을 잃고 monotonous하게 읽힌다고 설명한다. 따라서 한국어 소설 원고에서 `-았다/-었다/-했다/-였다/-다/-요` 같은 종결 리듬이 여러 문장 이어지면, 사건 정보가 있어도 문단 끝 박자가 보고서식 나열처럼 잠길 수 있다. 참고: [An Analysis of three types of sentence-endings in skaz narrative Korean translations](https://journal.kci.go.kr/kats/archive/articleView?artiId=ART001805146), [Purdue OWL Sentence Variety](https://owl.purdue.edu/owl/general_writing/academic_writing/sentence_variety/index.html), [Writing for Success Sentence Variety](https://mlpp.pressbooks.pub/writingsuccess/chapter/7-1-sentence-variety/), [Endings of Sentences in Korean](https://bruce-the-korean.blogspot.com/2015/05/endings-of-sentences.html).
- 기존 `prose-taste-gate`에는 `same-ending-run` issue와 `longestSameEndingRun` metric이 있었지만, 실패 기준이 5문장 이상으로 하드코딩되어 style-guide, benchmark profile, CLI에서 장르별 조정이 불가능했다. 이 때문에 사용자가 "문체가 거슬린다"고 느낀 핵심 리듬을 샘플 기반으로 조절하는 데 구멍이 있었다.
- `maxSameEndingRun`/`max_same_ending_run`을 `ProseTasteProfile`, mode threshold, style-guide/prose-taste-benchmark schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI의 `--max-same-ending-run`에 연결했다. 기본값은 4문장으로 두어 기존처럼 5문장째부터 실패하되, 프로젝트가 의도적 병렬문이나 구어체 리듬을 쓰면 허용치를 높일 수 있다.
- style fingerprint에는 이미 포함되어 있던 `longestSameEndingRun`을 authorial style drift에도 추가했다. 따라서 단일 회차 실패뿐 아니라, 선호 샘플 회차 사이에서 종결 어미 리듬이 갑자기 단조로워지는 변화도 readiness 근거에 남는다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 108 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/docs/catalog-sync.test.ts`: 2 files, 36 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 668 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1373 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 monologue dialogue dump prose friction evidence):

- 리서치 반영: The Center for Fiction은 대사가 단순 정보 전달만 해서는 부족하고, 좋은 대사는 여러 기능을 동시에 수행해야 하며 긴 speech가 지면에서 forced하게 보일 수 있다고 설명한다. Cincinnati Review도 강한 대사는 plot, 관계, 말하지 않는 것을 드러내야 하며, dialog가 summary로 더 빠르게 처리될 수 있는 대목까지 직접 발화로 끌고 오면 전체에 기여하지 못한다고 지적한다. Ignited Ink는 frequent back-and-forth dialogue가 pace를 올리는 반면 monologue는 한 인물의 동기와 관점만 보여 pace를 늦춘다고 설명한다. Nail Your Novel도 설명 대사가 작가를 위한 말이 아니라 인물의 현재 목적과 반응을 가져야 하며, 대화 후 인물에게 무엇이 바뀌는지가 중요하다고 정리한다. 참고: [Center for Fiction dialogue tips](https://centerforfiction.org/writing-tools/tips-for-writing-dialogue/), [Cincinnati Review dialogue mistakes](https://www.cincinnatireview.com/submission-trends/common-mistakes-when-writing-dialogue-and-how-to-avoid-them/), [Ignited Ink exposition/description/dialogue balance](https://www.ignitedinkwriting.com/ignite-your-ink-blog-for-writers/title/2018), [Nail Your Novel exposition in dialogue](https://nailyournovel.wordpress.com/2024/08/18/three-rules-for-writing-dialogue-that-contains-exposition/).
- 기존 `expository-dialogue-dump`는 "설명하자면/핵심은/규칙은/시스템은" 같은 표지와 설정·사건 규칙·세계관 원리 대사 비율을 잘 잡지만, 정보 표지가 없는 긴 고백·추리 설명·증언 대사가 장면 왕복을 압도하는 경우는 놓칠 수 있었다. 사용자가 거슬렸다고 느낀 문체 리스크 중 하나가 "대사가 말이 아니라 작가의 설명문처럼 길어지는 문제"라면 별도 gate가 필요하다.
- `prose-taste-gate`에 `monologue-dialogue-dump`를 추가했다. 새 metric은 `longestDialogueTurnLength`와 `averageDialogueTurnLength`이며, 기본 balanced 기준은 한 턴 170자, 평균 105자다. plain/webnovel-fast는 더 짧고 lyrical은 더 길게 허용한다. 단일 장문 증언은 project profile에서 `max_dialogue_turn_length`, `max_average_dialogue_turn_length` 또는 CLI의 `--max-dialogue-turn-length`, `--max-average-dialogue-turn-length`로 완화할 수 있다.
- 이 gate는 설명 키워드 유무와 별개로 작동한다. 긴 한 턴이 실패하면 "질문, 회피, 반박, 조건 제시, 행동 beat로 쪼개고 정보 일부를 상대 반응이나 물증 변화로 넘기라"는 directive를 만든다. 즉 대사의 길이를 기계적으로 줄이라는 지시가 아니라, 대화 장면의 상호작용과 story-state 변화를 회복시키는 지시다.
- `ProseTasteProfile`, style-guide/prose-taste-benchmark schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI 옵션에 새 필드를 연결했다. style fingerprint와 authorial style drift에도 `longestDialogueTurnLength`, `averageDialogueTurnLength`를 포함해 선호/비선호 문체 분리와 회차별 작가 문체 흔들림에 반영한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/docs/catalog-sync.test.ts`: 5 files, 148 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 672 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1377 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 talking-head dialogue grounding evidence):

- 리서치 반영: action beat는 화자 표시를 넘어 대화를 장면 안에 붙이고, 독자가 공간·소품·몸의 위치를 상상하게 하는 장치다. Learn How to Write a Novel은 action beat가 talking heads를 막고 주변 환경과 상호작용을 보여 준다고 설명한다. LaBine Editorial은 action beat가 너무 적으면 설정에 접지되지 않은 talking-head syndrome이 생긴다고 지적한다. Jami Gold와 Louise Harnby도 action beat가 독자를 scene 안에 붙잡고 공간, 소품, 날씨, 신체성을 제공한다고 설명한다. Writers Helping Writers는 무작위 끄덕임/미소보다 의미 있는 환경 상호작용과 subtext가 필요하다고 정리한다. 참고: [Learn How to Write a Novel action beats](https://learnhowtowriteanovel.com/blog/2023/08/10/benefits-of-using-action-beats-with-dialogue/), [LaBine Editorial action beats](https://lilalabine.com/action-beats/), [Jami Gold action beats](https://jamigold.com/2020/05/how-to-improve-our-story-with-action-beats/), [Louise Harnby action beats](https://www.louiseharnbyproofreader.com/blog/what-are-action-beats-and-how-can-you-use-them-in-fiction-writing), [Writers Helping Writers talking heads](https://writershelpingwriters.net/2021/06/nods-smiles-and-frowns-how-can-we-avoid-talking-headsand-cliches/).
- 기존 `monologue-dialogue-dump`는 한 턴이 길어지는 문제를 잡지만, 긴 설명을 여러 짧은 따옴표로 쪼갰을 때 장면 접지 없이 말만 이어지는 경우는 놓칠 수 있었다. 이 상태에서는 대사의 길이는 좋아져도 사용자가 거슬렸던 "말풍선만 떠 있는" 문체 문제가 남는다.
- `prose-taste-gate`에 `talking-head-dialogue-run`을 추가했다. 새 metric은 `longestDialogueGroundingGapRun`이며, 기본 balanced 기준에서는 행동·공간·감각 beat 없는 대사 6턴을 넘으면 실패한다. plain은 5턴, lyrical은 7턴, webnovel-fast는 8턴으로 조정했다.
- 실패 directive는 대사를 무조건 줄이라는 지시가 아니라, 긴 대화 연쇄 중 2~3턴마다 선택, 회피, 사물 조작, 공간 반응, 감각 변화, 관계 상태 변화를 심어 누가 어디서 무엇을 하는지 붙잡으라는 지시를 만든다.
- `ProseTasteProfile`, style-guide/prose-taste-benchmark schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI 옵션에 `max_dialogue_grounding_gap_run`/`--max-dialogue-grounding-gap-run`을 연결했다. style fingerprint와 authorial style drift에도 `longestDialogueGroundingGapRun`을 포함한다.
- 회귀 테스트는 접지 없는 대사 8턴 샘플이 `talking-head-dialogue-run`으로 실패하고, 물건 조작·공간 반응·화면 확인 beat가 들어간 같은 대화는 통과하며, 프로젝트 프로필/CLI/chapter gate가 새 허용치를 읽는지 확인한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/docs/catalog-sync.test.ts`: 5 files, 152 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 676 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1381 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 offscreen resolution summary prose friction evidence):

- 리서치 반영: narrative transportation과 독서 중 mental imagery 연구는 독자가 사건을 줄거리 정보가 아니라 구체 공간·사물·행동·정서 반응이 결합된 장면으로 떠올릴 때 몰입이 강해진다고 본다. 장르 소설의 결정적 폭로·해결·체포·구출은 독자 보상 고점이므로, "조사 끝에 밝혀졌다/결국 해결됐다/며칠 뒤 정리됐다"처럼 시간 점프 뒤 결과만 보고하면 사건 키워드는 있어도 고점 체험이 빠진다.
- `prose-taste-gate`에 `offscreen-resolution-summary`를 추가했다. 이 issue는 조정 가능한 density threshold가 아니라 장면 실행 결손으로 다루며, decisive story turn이 사후 요약으로 처리되면 high/critical 문체 마찰로 표시한다.
- 실패 directive는 결과 보고를 문장만 다듬으라는 지시가 아니라, 단서 확인, 선택 압박, 충돌, 실패 비용, 폭로 순간, 즉시 달라진 행동을 원고 안 현재 장면으로 복구하도록 지시한다. 그래서 사용자가 거슬렸던 "줄거리는 진행되는데 소설로 체험되지 않는 문체"를 더 직접적으로 차단한다.
- `/write`, `/write_all`, `/verify-chapter`, README, engagement contract 테스트에 새 issue 이름을 연결해 작성 루프와 검증 루프가 같은 실패를 같은 용어로 다룬다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/engagement-contracts.test.ts`: 2 files, 162 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 681 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1386 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 symbolic abstraction stack prose friction evidence):

- 리서치 반영: concreteness 효과 연구는 일반적으로 구체어가 추상어보다 처리 이점이 있다는 점을 보여 주며, 문학 텍스트 eye-tracking/mental imagery 연구는 인물이 환경과 상호작용하는 enactive style이 장면 상상과 더 잘 연결될 수 있음을 다룬다. abstract concepts 연구는 추상 개념이 감각 경험뿐 아니라 언어·사회·내적 경험에 더 크게 기대는 복합 범주라고 설명한다. 따라서 운명/진실/의미/상징/상실 같은 단어 자체를 금지할 수는 없지만, 구체 사물·행동·상태 변화 없이 추상·상징어만 쌓이면 독자가 장면을 보지 못하고 관념 해설을 읽는 문체 마찰이 된다. 참고: [Fine-Grained Concreteness Effects on Word Processing](https://pmc.ncbi.nlm.nih.gov/articles/PMC12100582/), [Eye movements and mental imagery during reading of literary texts](https://pmc.ncbi.nlm.nih.gov/articles/PMC7886417/), [A Future of Words: Language and the Challenge of Abstract Concepts](https://journalofcognition.org/articles/10.5334/joc.134), [Montana State Clear & Concrete Language](https://www.montana.edu/writingcenter/writing_resources/clearlanguage.html).
- `prose-taste-gate`에 `symbolic-abstraction-stack`을 추가했다. 새 metric은 `symbolicAbstractionDensityPer1000`과 `longestSymbolicAbstractionRun`이며, 기본 balanced 기준에서는 운명/진실/의미/상징/상실/구원/공허/심연 계열 문장이 1000자당 5회 초과하거나 3문장 초과 연속될 때 실패한다. 인물이 만지는 사물, 화면/문서 변화, 선택 비용, 상대 반응, 장면 결과가 같은 문장 압력을 운반하면 통과한다.
- 실패 directive는 상징어를 모두 지우라는 지시가 아니라, 관념어 일부를 봉투, 사진 번호, 휴대폰 알림, 문손잡이, 카메라 소리, 상대가 붙이는 새 조건 같은 장면 증거로 바꾸도록 지시한다. 그래서 사용자가 거슬렸던 "문학적인 듯하지만 몸에 안 붙는 문체"를 선호 샘플/비선호 샘플 기반으로 직접 조절할 수 있다.
- `ProseTasteProfile`, style-guide/prose-taste-benchmark schema와 template, `apply-chapter-gate`, 프로젝트 benchmark loader, `run-prose-taste-benchmark` CLI의 `--max-symbolic-abstractions`, `--max-symbolic-abstraction-run`에 연결했다. style fingerprint와 authorial style drift에도 새 density/run metric을 넣어 선호/비선호 문체 분리와 회차별 문체 흔들림에 반영한다.
- `templates/prose-taste-benchmark.template.json`에 추상·상징어가 장면 접지를 대신하는 비선호 샘플을 추가했고, `tests/quality/prose-taste-gate.test.ts`는 기본 기준 실패, 장면 사물·선택으로 접지된 통과 샘플, 프로젝트별 완화 설정을 검증한다. `tests/quality/prose-taste-benchmark.test.ts`는 같은 issue가 labeled disliked prose benchmark에서 기대 issue로 검출되는지 확인한다.
- 점수 영향: 종합 점수는 **98/100 유지**로 본다. 다만 원고 문장 품질 영역의 실전성은 더 올라갔다. 99점 이상으로 올리려면 이 게이트가 실제 사용자의 비선호 문체 샘플과 holdout 선호 샘플에서 false positive/false negative 없이 유지되는 독자/사용자 증거가 더 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts tests/docs/catalog-sync.test.ts`: 5 files, 158 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 689 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1394 tests passed

추가 확인(2026-06-22 agency and choice-cost benchmark coverage evidence):

- 리서치 반영: Green & Appel의 narrative transportation 정리는 서사가 단순 정보 나열이 아니라 인물, 시간, 인과로 연결된 사건이며 독자 몰입은 주의, 정서, 심상이 이야기 사건에 집중될 때 강해진다고 본다. 같은 정리 안에서 narrative processing은 initiating event, character goals, outcomes 같은 episode schema와도 연결된다. Frontiers의 suspense 연구도 suspense가 독자 주의와 몰입에 중요하고, 독자가 주인공의 outcome을 예상·기대하는 과정과 관련된다고 설명한다. 따라서 대작급 회차 benchmark는 보상/훅/문체뿐 아니라 주인공이 무엇을 원하고, 무엇에 막히고, 어떤 선택 비용을 감수하고, 그 선택 뒤 전술이나 세계 상태가 어떻게 닫히는지까지 known-good/known-bad 샘플로 보존해야 한다. 참고: [Green & Appel 2024](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf), [Confronting a Paradox: A New Perspective of the Impact of Uncertainty in Suspense](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01392/full).
- 기존 `engagement-contract`는 `manuscript-protagonist-agency-not-evidenced`, `manuscript-choice-tradeoff-not-evidenced`, `manuscript-choice-cost-lock-not-evidenced`, `manuscript-tactical-adaptation-not-evidenced`를 이미 평가했지만, `engagement-benchmark`의 필수 positive high-point coverage enum과 기본 템플릿에는 이 축이 빠져 있었다. 그래서 샘플 세트가 보상/장르 쾌감/대화/인과 사슬만 잘 덮어도, 주인공 agency와 선택 비용을 제대로 대표하지 못한 채 `readyForGateTuning=true`에 가까워지는 blind spot이 있었다.
- `EngagementPositiveQualityCode`, `schemas/engagement-benchmark.schema.json`, `run-engagement-benchmark` CLI 허용 목록에 `protagonist-agency`, `choice-cost-tradeoff`, `choice-cost-lock`, `tactical-adaptation`을 추가했다. 이제 benchmark suite와 CLI 입력에서 이 고점 품질을 직접 요구할 수 있다.
- `templates/engagement-benchmark.template.json`의 기본 `required_positive_quality_codes`와 긍정 샘플 태그에 네 코드를 추가하고, 기본 `required_issue_codes`에도 대응 실패 issue 네 개를 넣었다. 즉 새 프로젝트는 대작 준비도 샘플을 모을 때 "재미있어 보이는 사건"뿐 아니라 "인물 선택이 비용을 만들고 다음 행동을 바꾸는 원고"를 known-good/known-bad로 확보해야 한다.
- README의 engagement benchmark 설명도 같은 기준으로 갱신했다. `tests/quality/engagement-benchmark.test.ts`는 네 positive code가 coverage/usable coverage로 집계되고 gate tuning ready 조건에 반영되는지 확인하며, `tests/masterpiece/engagement-benchmark-cli.test.ts`는 CLI가 `choice-cost-lock` 입력을 받아 누락 coverage로 보고하는지 확인한다.
- 점수 영향: 종합 점수는 **98/100 유지**로 본다. 자동 시스템의 98점 신뢰도는 더 견고해졌지만, 99점 이상은 여전히 실제 독자/사용자 holdout 샘플에서 agency/choice-cost coverage가 독자 선호, 장면 회상, 다음 회차 행동과 함께 검증되어야 한다.

추가 확인(2026-06-22 positive high-point label conflict evidence):

- 리서치 반영: LLM benchmark의 construct validity 논의는 측정 항목이 목표 현상 자체를 대표해야 하며, label quality 연구는 평가 데이터의 오표기와 약한 ground truth가 성능 추정치를 왜곡할 수 있다고 본다. 소설 재미 벤치마크에서도 "고점 샘플"이라는 라벨이 실제 원고 증거와 충돌하면 positive coverage가 부풀려져 gate tuning이 잘못된다. 참고: [Construct Validity in Large Language Model Benchmarks](https://openreview.net/forum?id=mdA5lVvNcU), [Active Label Cleaning for Improved Dataset Quality](https://pmc.ncbi.nlm.nih.gov/articles/PMC8897392/), [Are LLMs Better than Reported? Detecting Label Errors](https://arxiv.org/html/2410.18889v1).
- 기존 `engagement-benchmark`는 `positive_quality_codes`를 labeled coverage와 usable coverage로 세지만, known-good 샘플이 같은 실행에서 `manuscript-payoff-delight-not-evidenced` 같은 대응 부재 이슈를 내는 경우를 자동 금지하지는 않았다. 사용자가 `forbidden_issue_codes`를 직접 넣은 샘플은 막혔지만, 필수 positive high-point code만 채운 오표기 샘플은 false negative/coverage 부족으로만 보일 수 있었다.
- `POSITIVE_QUALITY_CONFLICT_ISSUES`를 추가해 `signature-scene-image`, `character-appeal-signature`, `protagonist-agency`, `choice-cost-tradeoff`, `choice-cost-lock`, `tactical-adaptation`, `payoff-delight`, `genre-delight`, `next-click-compulsion`, `narrative-transportation`, `dialogue-subtext-turn`, `causal-chain`의 positive label을 대응 manuscript issue와 연결했다. expected-passing 샘플에서 충돌이 발생하면 sample result의 `positiveQualityConflictIssueCodes`와 `positive-quality-conflict` failure type으로 남는다.
- report level에는 `positiveQualityConflictCount`를 추가했고, CLI 실패 요약과 `masterpiece-readiness`의 critical failure count에도 연결했다. 따라서 "대작 고점 샘플"이라고 태그한 샘플이 실제로 그 고점의 부재 이슈를 냈다면 98+ readiness가 통과하지 않는다.
- 테스트는 정상 positive sample의 conflict count가 0인지, flat 원고를 `payoff-delight` high-point로 오표기했을 때 `manuscript-payoff-delight-not-evidenced` 충돌과 recommendation이 생기는지, CLI report와 readiness gap에 새 count가 반영되는지 확인한다.
- 점수 영향: 종합 점수는 **98/100 유지**로 본다. 벤치마크 ground truth 품질이 좋아져 98점의 신뢰도는 올라갔지만, 99점 이상은 실제 사용자/독자 holdout label audit에서 positive label conflict가 낮게 유지되는 증거가 필요하다.

추가 확인(2026-06-22 engagement benchmark chapter gate evidence):

- 리서치 반영: benchmark label error 연구는 평가 라벨 오류가 모델 순위와 성능 추정치를 흔들 수 있다고 보고, data leakage 연구는 평가 데이터가 학습/튜닝 근거에 섞이면 일반화 성능이 과대평가된다고 본다. 또한 AI evaluation harness를 배포 게이트로 쓰려면 offline report가 실제 의사결정 경로에 연결되어야 한다. 따라서 회차 재미 벤치마크가 false positive, missing issue, forbidden issue, positive label conflict를 찾아도 `apply-chapter-gate`와 Ralph Loop가 그 결과를 소비하지 않으면 "준비도 리포트는 실패를 알고 있지만 회차 완료는 통과하는" 간극이 남는다. 참고: [Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks](https://openreview.net/forum?id=XccDXrDNLek), [Active Label Cleaning for Improved Dataset Quality](https://pmc.ncbi.nlm.nih.gov/articles/PMC8897392/), [IBM Data Leakage](https://www.ibm.com/think/topics/data-leakage-machine-learning), [Which Leakage Types Matter?](https://arxiv.org/html/2604.04199v1), [Gate AI: Towards Automated Robustness Evaluation for Generative LLM Pipelines](https://arxiv.org/html/2606.02959v1).
- `engagement-benchmark` sample result에 `manuscriptSource`, `manuscriptPath`, `chapterSourceGrounded`를 추가했다. 프로젝트 CLI는 inline fixture, 별도 `manuscript_path`, 실제 `chapters/chapter_NNN.md` 원고를 구분해 저장한다. 이렇게 하지 않으면 의도적으로 만든 실패 fixture가 현재 회차 원고 실패처럼 hard block을 일으키거나, 반대로 실제 회차 원고 실패가 단순 benchmark fixture로 묻힐 수 있다.
- `apply-chapter-gate`가 `reviews/engagement-benchmark-report.json`을 읽어 현재 회차에 연결된 sample result만 `readerResponse` gate로 병합한다. 현재 회차 원고에 grounded된 샘플에서 `expectedPassed=false`인 known-bad 통과, `false-positive`, `missing-issue`, `forbidden-issue`, `positive-quality-conflict`가 있으면 회차 완료를 막고 `engagement-benchmark` revision directive를 만든다. source evidence digest가 오래됐거나 필수 source group이 비어 있으면 stale report 실패로 처리한다.
- inline 원고나 현재 회차 파일에 grounded되지 않은 fixture는 hard block 대신 warning으로 남긴다. 이는 벤치마크 suite 안의 synthetic negative sample이 정상 회차 집필을 가로막지 않게 하면서도, 해당 benchmark 결과가 아직 실제 회차 증거로 쓰일 수 없다는 점을 명확히 보여 준다.
- `src/retry/quality-gate.ts`의 retry label에도 `회차 재미 벤치마크 실패`를 추가했다. 이제 Ralph Loop 출력에서 독자 반응/문체/일관성 실패와 구분되는 회차 재미 benchmark 실패가 드러난다.
- 테스트는 현재 회차 grounded engagement benchmark의 positive high-point conflict가 `readerResponse.passed=false`, `RETRY`, `회차 재미 벤치마크 실패: 58점`으로 이어지는지 확인한다. 반대로 inline fixture false positive는 `not-ready/has-ungrounded-fixtures/engagement-benchmark` warning으로 남고 gate는 통과하는지 확인한다. 프로젝트 CLI 테스트는 chapter source와 inline source metadata가 report에 보존되는지 확인한다.
- 점수 영향: 종합 점수는 **98/100 유지**로 본다. 이번 변경은 98점 주장의 실행 신뢰도를 올린다. 특히 "벤치마크가 실패를 찾아도 실제 집필 루프가 통과하는" 맹점을 줄였다. 다만 99점 이상은 실제 연재 원고와 독자/사용자 holdout에서 이 hard gate가 과차단 없이 재미없는 회차를 안정적으로 막는 장기 evidence가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts tests/quality/engagement-benchmark.test.ts`: 3 files, 57 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 692 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1397 tests passed

추가 확인(2026-06-22 character relationship focus evidence):

- 리서치 반영: narrative transportation과 character identification 연구는 독자가 이야기 세계에 몰입하고 인물과 연결될 때 목표, 선택, 정서, 관점 취하기가 중요하다고 본다. 허구 인물 애착 연구도 독자가 인물을 사회적 관계처럼 처리할 수 있음을 보여 준다. 따라서 인물/관계 benchmark가 독자 평균 점수만 저장하고, 어떤 장면 약속, 인물 매력 순간, 관계 전환, 이후 행동 변화, 결과 비용을 검증했는지 비워 두면 높은 점수가 실제 퇴고 지시나 gate tuning 근거로 변환되지 않는다. 참고: [Adult attachment and engagement with fictional characters](https://pmc.ncbi.nlm.nih.gov/articles/PMC8419286/), [Character identification is predicted by narrative transportation](https://link.springer.com/article/10.1007/s12144-022-03048-4), [How Does Fiction Reading Influence Empathy?](https://pmc.ncbi.nlm.nih.gov/articles/PMC3559433/).
- `character-relationship-benchmark` sample result에 `focusEvidence`, `focusEvidenceIssues`, `focusEvidenceFieldCount`를 추가했다. 기본 요구 필드는 `scenePromise`, `characterAppealMoment`, `relationshipTurn`, `intendedChange`, `consequence`다. focus가 없거나 이 필드가 비어 있으면 `weak-focus-evidence`로 실패하고, 해당 샘플은 `evidenceSufficient=false`가 되어 gate tuning usable holdout 근거로 쓰이지 않는다.
- report level에는 `weakFocusEvidenceCount`와 `focusEvidenceCount`를 추가했다. `readyForGateTuning`은 이제 독자 패널 수, 코멘트 수, holdout, known-flat coverage, split leakage뿐 아니라 focus evidence 결손이 0인지도 요구한다. 즉 독자들이 좋아했다는 점수만 있고 "어떤 인물 선택/관계 전환을 좋아했는지"가 없는 샘플로 인물/관계 게이트를 조정하지 않는다.
- `run-character-relationship-benchmark` 프로젝트 CLI와 schema/template에 `require_focus_evidence`, `--require-focus-evidence`, `--no-require-focus-evidence`를 추가했다. README도 같은 기준으로 갱신해 새 프로젝트가 인물/관계 샘플을 만들 때 focus evidence를 기본 계약으로 보게 했다.
- `masterpiece-readiness`의 weak evidence 집계에 `weakFocusEvidenceCount`를 연결했다. 이제 하위 인물/관계 리포트에서 focus evidence가 비어 있으면 98+ readiness의 `character-relationship` major gap과 action plan으로 올라온다.
- 점수 영향: 종합 점수는 **98/100 유지**로 본다. 인물/관계 축의 실전성은 올라갔다. 특히 독자 점수가 높은 샘플이라도 어떤 장면 전환을 재현해야 하는지 불명확하면 대작 게이트 튜닝 근거로 쓰지 못하게 됐다. 99점 이상은 여전히 장편 누적 관계 변화와 인물 애착이 실제 독자 holdout에서 장면 회상, 다음 관계 장면 기대, 유료/재방문 행동으로 이어지는 증거가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/character-relationship-benchmark.test.ts tests/masterpiece/character-relationship-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 3 files, 24 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 694 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1399 tests passed

추가 확인(2026-06-22 premise promise evidence):

- 리서치 반영: narrative transportation 연구는 독자 몰입이 주의, 정서, 심상, 인물 감정 반응이 이야기 사건에 집중되는 상태라고 본다. 2026년 JCOM의 story quality 연구도 perceived story quality와 transportation, topic interest가 강하게 연결되지만, 단일 서사 요소만 추가한다고 항상 품질 평가가 올라가지는 않는다고 보고한다. suspense 연구는 uncertainty가 독자 정서 반응에 영향을 주지만 suspense 자체와 동일하지는 않다고 분석한다. curiosity gap 연구도 정보 제공량이 너무 작거나 너무 크면 정보 선택 행동이 달라질 수 있음을 보여 준다. 따라서 전제 샘플은 "궁금하다"는 점수만으로 충분하지 않고, 어떤 훅, 질문, 주인공 매력, 새로움, 감정 보상, 다음 회차 이유, 장기 엔진을 검증했는지 구조화해야 한다. 참고: [Green & Appel 2024](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf), [What makes a good story?](https://jcom.sissa.it/article/pubid/JCOM_2503_2026_A06/), [Confronting a Paradox](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01392/full), [When curiosity gaps backfire](https://www.nature.com/articles/s41598-024-81575-9).
- `premise-appeal-benchmark` sample result에 `promiseEvidence`, `promiseEvidenceIssues`, `promiseEvidenceFieldCount`를 추가했다. 기본 요구 필드는 `core_hook`, `irresistible_question`, `protagonist_appeal`, `novelty_angle`, `emotional_payoff`, `binge_reason`, `long_series_engine`이다. premise가 없거나 이 필드가 비어 있으면 `weak-promise-evidence`로 실패하고, 해당 샘플은 `evidenceSufficient=false`가 되어 gate tuning usable holdout 근거로 쓰이지 않는다.
- report level에는 `weakPromiseEvidenceCount`와 `promiseEvidenceCount`를 추가했다. `readyForGateTuning`은 이제 독자 패널 수, 코멘트 수, 행동 evidence, 행동 protocol/allocation, holdout, known-bad coverage, split leakage뿐 아니라 premise promise evidence 결손이 0인지도 요구한다. 즉 독자들이 설문에서 흥미롭다고 말했더라도, 어떤 전제 약속을 재현해야 하는지 비어 있으면 전제 설계 게이트를 조정하지 않는다.
- `run-premise-appeal-benchmark` 프로젝트 CLI와 schema/template에 `require_promise_evidence`, `--require-promise-evidence`, `--no-require-promise-evidence`를 추가했다. README도 같은 기준으로 갱신해 새 프로젝트가 전제 매력 샘플을 만들 때 promise evidence를 기본 계약으로 보게 했다.
- `masterpiece-readiness`의 weak evidence 집계에 `weakPromiseEvidenceCount`를 연결했다. 이제 하위 전제 매력 리포트에서 promise evidence가 비어 있으면 98+ readiness의 `premise-appeal` major gap과 action plan으로 올라온다.
- 점수 영향: 종합 점수는 **98/100 유지**로 본다. 전제 축의 실전성은 올라갔다. 특히 독자 설문/행동 데이터가 좋아 보여도, 샘플 전제가 실제 집필 가능한 hook-question-protagonist-series engine으로 구조화되지 않으면 대작 게이트 튜닝 근거로 쓰지 못하게 됐다. 99점 이상은 실제 플랫폼 listing holdout과 1화 open/save/follow, delayed recall, 유료 계속읽기 행동에서 이 전제 약속 evidence가 안정적으로 예측력을 보이는 자료가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/premise-appeal-benchmark.test.ts tests/masterpiece/premise-appeal-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts`: 3 files, 29 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 696 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1401 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 design-stage premise readiness handoff):

- 리서치 반영: scikit-learn의 data leakage 지침은 test 데이터를 model choice에 쓰지 말고, split을 먼저 나눈 뒤 train/test를 분리하라고 권한다. cross-validation 문서도 hyperparameter를 test set에 맞춰 조정하면 일반화 성능이 새는 문제가 생기므로 별도 validation/test holdout이 필요하다고 설명한다. IBM의 model performance 설명 역시 data leakage와 잘못된 train/validation/test split이 성능 지표를 부풀리거나 왜곡할 수 있다고 본다. 2026년 automated self-testing quality gate 논문은 LLM application에서 evidence coverage가 severe regression 판별에 중요하고, 평가 suite가 실제 release decision gate에 연결되어야 한다고 주장한다. 참고: [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html), [scikit-learn cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html), [IBM model performance](https://www.ibm.com/think/topics/model-performance), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1).
- blind spot: `premise-appeal-benchmark`와 `masterpiece-readiness`는 전제 promise evidence, behavioral intent, split leakage, usable holdout 부족을 잡지만, `skills/verify-design/SKILL.md`는 여전히 consistency-verifier -> genre-validator 2단계 설명에 머물러 있었다. 그러면 readiness report가 실패를 알고 있어도 설계 검증 skill이 집필 진입을 명시적으로 막지 않는 절차 간극이 생긴다.
- `verify-design` 파이프라인을 consistency-verifier -> genre-validator -> premise appeal benchmark readiness로 갱신했다. 이제 설계 완료 후 `node dist/cli/run-premise-appeal-benchmark.js --project novels/{novel_id} --json`을 실행하고 `reviews/premise-appeal-benchmark-report.json`의 `readyForGateTuning`, `weakPromiseEvidenceCount`, `promiseEvidenceCount`, `automatedFalsePositiveCount`, `behavioralIntentFalsePositiveCount`, `splitLeakageCount`, usable holdout/known-bad holdout 결손을 확인하도록 명시했다.
- fail condition에 `weak-promise-evidence`, `premise-appeal-not-ready`, `premise-appeal-split-leakage`, `premise-appeal-false-positive`를 추가했다. consistency와 genre 점수가 높아도 전제 약속 evidence가 약하거나, 독자/행동 false positive가 있거나, calibration/validation/holdout evidence가 새면 집필 단계로 넘어가지 않는다.
- README의 `/verify-design` 설명과 전제 매력 벤치마크 섹션도 같은 계약으로 갱신했다. `tests/masterpiece/engagement-contracts.test.ts`는 `verify-design`과 README가 `run-premise-appeal-benchmark`, `readyForGateTuning`, `weakPromiseEvidenceCount`, `promiseEvidenceCount`, split leakage/false positive 차단 코드를 계속 문서화하는지 검사한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 평가 알고리즘보다 절차 연결성 보강이다. 그래도 중요한 이유는 "전제 리포트는 실패했지만 설계 검증은 통과"하는 운영 실패를 줄여, 98점 readiness가 실제 집필 시작 결정에 더 잘 연결되기 때문이다. 99점 이상은 여전히 실제 프로젝트에서 이 설계 차단이 좋은 전제는 통과시키고 약한 전제는 과차단 없이 막는 holdout/사용자 증거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts`: 1 file, 87 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 37 files and 697 tests passed, required outputs 29 verified
  - `npm test`: 61 files, 1402 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 executable design gate for premise readiness):

- 리서치 반영: scikit-learn common pitfalls는 평가 데이터가 모델 선택이나 전처리 fitting에 섞이면 leakage가 생기므로 split과 pipeline으로 분리해야 한다고 설명한다. cross-validation 문서도 모델 일반화 평가는 독립 split과 holdout을 통해 확인해야 한다고 본다. Automated Self-Testing as a Quality Gate 논문은 LLM application에서 evidence coverage를 release gate의 핵심 축으로 다루며, 평가 결과가 실제 promote/hold/rollback 결정에 연결되어야 한다고 제안한다. 참고: [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html), [scikit-learn cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1).
- blind spot: 직전 보강에서 `verify-design` 문서는 전제 매력 readiness를 요구하게 됐지만, 실제 CLI hard gate는 없었다. 그러면 운영자가 `run-premise-appeal-benchmark` 결과를 만들고도 `readyForGateTuning=false`, stale source evidence, source sample 누락, false positive를 수동으로 놓칠 수 있었다.
- `src/cli/apply-design-gate.ts`를 추가했다. 이 CLI는 `reviews/premise-appeal-benchmark-report.json`을 읽어 `reviews/design-gate-report.json`을 저장하고, `--fail-on-blocked`가 있으면 설계 gate 실패 시 exit code 2로 종료한다. 즉 `verify-design`의 전제 readiness 요구가 문서 지시가 아니라 CI/자동화에서 실패시킬 수 있는 실행 계약이 됐다.
- hard block 조건은 `readyForGateTuning !== true`, `weakPromiseEvidenceCount > 0`, `promiseEvidenceCount < 1`, `automatedFalsePositiveCount > 0`, `behavioralIntentFalsePositiveCount > 0`, `splitLeakageCount > 0`, usable holdout/known-bad holdout 부족, weak reader/behavioral/protocol/allocation evidence, `sourceEvidence` mismatch/not-recorded/no-sources, 그리고 `reviews/premise-appeal-benchmark/` sample source 0개다.
- `skills/verify-design/SKILL.md`와 README는 이제 `run-premise-appeal-benchmark` 다음에 `apply-design-gate --fail-on-blocked`를 실행하도록 연결한다. `tests/masterpiece/design-gate-cli.test.ts`는 PASS, not-ready BLOCKED, stale source BLOCKED를 CLI black-box로 검증한다. prebuild integrity와 build verifier도 `apply-design-gate` 산출물을 요구한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 "평가 리포트가 실패를 알고 있어도 설계 단계가 통과하는" 운영 실패를 줄인다. 99점 이상은 여전히 실제 프로젝트에서 이 design gate가 약한 전제는 막고 강한 전제는 과차단하지 않는 독자/사용자 holdout evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/masterpiece/design-gate-cli.test.ts tests/masterpiece/engagement-contracts.test.ts tests/build/prebuild-integrity.test.ts`: 3 files, 93 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 38 files and 700 tests passed, required outputs 30 verified
  - `npm test`: 62 files, 1405 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 writing preflight design gate handoff):

- 리서치 반영: Google Cloud의 MLOps pipeline 문서는 모델 평가를 holdout test set으로 수행하고, 모델 검증 단계에서 배포 적합성을 확인한 뒤 serving으로 넘어가는 흐름을 설명한다. 같은 문서는 level 1 자동화에서 data validation과 model validation을 pipeline에 넣어, 문제가 있으면 다음 단계 실행을 멈추는 구조를 둔다. Automated Self-Testing as a Quality Gate 논문도 LLM application의 비결정성 때문에 evidence-driven release decision이 필요하며, gate가 PROMOTE/HOLD/ROLLBACK 결정에 연결되어야 한다고 본다. scikit-learn common pitfalls 역시 평가 데이터 누수와 오래된 검증 근거가 성능을 과대평가할 수 있음을 경고한다. 참고: [Google Cloud MLOps continuous delivery](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html).
- blind spot: `apply-design-gate`는 실행 가능한 hard gate가 됐지만, 일반 집필 진입점인 `/write`, `/write-all`, quickstart Step 4가 설계 게이트를 직접 preflight로 호출하지 않으면 사용자가 `/verify-design`을 건너뛰고 원고 생성을 시작할 수 있었다. 그러면 설계 단계에서는 차단해야 할 약한 전제, stale premise report, source 누락이 첫 회차 생성 뒤에야 문제로 드러난다.
- `skills/06-write/SKILL.md`에 Phase 0 "집필 전 설계 게이트"를 추가했다. 이제 단건 회차 집필도 원고 생성 전에 `node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json`을 실행하고, `reviews/design-gate-report.json`의 `passed=true`, `status=PASS`가 아니면 원고를 쓰지 않는다.
- `skills/08-write-all/SKILL.md`에는 Ralph Loop 시작/재개 전 Phase 0.5를 추가했다. 설계 게이트가 막히면 첫 회차를 쓰지 않고 루프를 시작하지 않으며, `requires_user_intervention=true`로 보고하고 `recommendedCommands`의 `run-premise-appeal-benchmark`와 `apply-design-gate`를 먼저 처리하도록 했다.
- `skills/quickstart/SKILL.md`와 README도 같은 preflight를 명시한다. quickstart 상태 감지는 `plot/chapters/`가 있어도 `reviews/design-gate-report.json`이 없거나 `passed != true`이면 Step 4가 아니라 `/verify-design` 및 `apply-design-gate` 안내로 돌린다.
- `tests/masterpiece/engagement-contracts.test.ts`에 집필 진입점 preflight 계약 테스트를 추가했다. `/write`, `/write-all`, quickstart, README가 모두 `apply-design-gate`, `--fail-on-blocked`, `reviews/design-gate-report.json`을 문서화하고, 주요 block code와 `run-premise-appeal-benchmark` handoff를 잃지 않는지 검사한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 평가 항목보다 운영 handoff 보강이다. 하지만 실제 자동 집필에서 "전제 게이트는 실패했는데 집필 루프는 시작"하는 가장 값비싼 실패를 앞단에서 줄인다. 99점 이상은 여전히 실제 프로젝트에서 이 preflight가 강한 전제를 과차단하지 않고 약한 전제를 조기에 막는 독자/사용자 holdout evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts`: 1 file, 88 tests passed
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts tests/masterpiece/design-gate-cli.test.ts tests/docs/catalog-sync.test.ts`: 3 files, 95 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 38 files and 701 tests passed, required outputs 30 verified
  - `npm test`: 62 files, 1406 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 resume design gate recovery coverage):

- 리서치 반영: Google Cloud의 MLOps pipeline 문서는 data/model validation을 자동 pipeline에 연결해 실패 시 다음 단계로 넘어가지 않는 구조를 설명한다. Automated Self-Testing as a Quality Gate 논문도 LLM application의 비결정성과 모델 변화 때문에 evidence coverage 기반 PROMOTE/HOLD/ROLLBACK 결정을 gate에 묶어야 한다고 본다. scikit-learn common pitfalls는 평가/검증 근거가 새거나 현재 입력과 맞지 않으면 성능 추정이 낙관적으로 왜곡될 수 있음을 경고한다. 따라서 중단된 소설 집필을 재개할 때도 기존 checkpoint만 믿고 다음 회차를 생성하면 안 되고, 현재 전제 매력 report와 design gate가 여전히 PASS인지 다시 확인해야 한다. 참고: [Google Cloud MLOps continuous delivery](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html).
- blind spot: 모든 신규 집필 entrypoint에는 `apply-design-gate --fail-on-blocked` preflight가 붙었지만, 세션 시작 hook과 `/resume` 복구 안내는 `ralph-state.json`의 `can_resume=true`만 보고 `/write-all --resume`을 권했다. 설계가 바뀌었거나 `reviews/design-gate-report.json`이 없거나 `BLOCKED`인 상태에서도 복구 메시지가 직접 재개를 유도할 수 있었다.
- `scripts/session-recovery.mjs`가 이제 `reviews/design-gate-report.json`을 읽는다. `passed=true`, `status=PASS`일 때만 직접 `/write-all --resume` 옵션을 보여 주고, report missing/malformed/BLOCKED이면 `복구 전 설계 게이트 필요` 섹션과 `run-premise-appeal-benchmark`, `apply-design-gate --fail-on-blocked` 명령을 먼저 안내한다. 내부 `checkRecoveryState()`의 `suggestion`도 design gate가 PASS일 때만 직접 resume을 권하고, 아니면 설계 게이트 PASS 후 재개하라고 말한다.
- `skills/10-resume/SKILL.md`와 `skills/10-resume/references/session-recovery.md`는 `/resume --continue`와 `/write-all --resume`도 새 원고 생성 경로로 보며, `premise-appeal-not-ready`, `weak-promise-evidence`, `premise-appeal-false-positive`, `premise-behavioral-intent-weak`, `premise-appeal-split-leakage`, `premise-appeal-report-stale`, `premise-appeal-source-missing`이 있으면 재개를 중단하도록 갱신했다.
- README의 `/resume` 항목과 design gate 설명도 같은 계약으로 갱신했다. 이제 문서상으로는 신규 집필 9개 경로뿐 아니라 resume 경로도 design gate preflight의 일부다.
- `tests/scripts/session-start-recovery.test.ts`는 design gate PASS일 때만 직접 resume 옵션이 나오는지, report가 없거나 `premise-appeal-not-ready`로 BLOCKED이면 직접 resume 옵션이 사라지고 benchmark/gate 명령이 먼저 안내되는지 검증한다. `tests/masterpiece/engagement-contracts.test.ts`는 resume skill, resume guide, session recovery script, README가 이 계약을 계속 보존하는지 검사한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 문체/재미 평가 모델이 아니라 운영 신뢰도 보강이다. 하지만 실전에서는 중단 후 재개가 가장 쉽게 오래된 설계와 stale 평가를 다시 끌고 들어오는 경로라, 98점 시스템의 재현성을 높인다. 99점 이상은 여전히 실제 프로젝트 재개 케이스에서 이 차단이 과차단 없이 약한 전제/오래된 전제만 안정적으로 막는 holdout evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/scripts/session-start-recovery.test.ts`: 1 file, 9 tests passed
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts`: 1 file, 89 tests passed
  - `npx vitest run tests/scripts/session-start-recovery.test.ts tests/masterpiece/engagement-contracts.test.ts tests/docs/catalog-sync.test.ts`: 3 files, 102 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 38 files and 704 tests passed, required outputs 30 verified
  - `npm test`: 62 files, 1409 tests passed

추가 확인(2026-06-22 resume style gate recovery coverage):

- 리서치 반영: Google Cloud의 MLOps pipeline 문서는 validation을 다음 단계 진입 전 자동 gate로 연결해 실패 시 serving이나 배포로 넘어가지 않는 구조를 설명한다. Automated Self-Testing as a Quality Gate 논문도 LLM application의 비결정성 때문에 evidence coverage가 PROMOTE/HOLD/ROLLBACK 결정에 직접 연결되어야 한다고 본다. scikit-learn common pitfalls는 검증 데이터 누수나 현재 입력과 맞지 않는 평가 근거가 성능 추정을 과대평가할 수 있음을 경고한다. 따라서 집필 재개도 checkpoint만 믿고 진행하지 않고, 현재 design gate와 style gate가 모두 PASS인지 다시 확인해야 한다. 참고: [Google Cloud MLOps continuous delivery](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html).
- blind spot: 신규 집필 9개 entrypoint와 quickstart에는 `apply-style-gate --fail-on-blocked`가 붙었지만, 세션 복구와 상태 안내는 design gate만 확인할 수 있었다. 이 상태에서는 `reviews/style-gate-report.json`이 없거나 `BLOCKED`여도 Ralph checkpoint의 `can_resume=true` 때문에 `/write-all --resume`을 직접 권할 수 있었다. 사용자가 싫어한 문체를 막는 gate가 첫 집필에는 적용되지만, 중단 후 재개 회차에서는 우회될 수 있는 운영 간극이다.
- `scripts/session-recovery.mjs`가 이제 `reviews/design-gate-report.json`과 `reviews/style-gate-report.json`을 모두 읽는다. 두 리포트가 모두 `passed=true`, `status=PASS`일 때만 direct resume 옵션과 `/write-all --resume` suggestion을 보여 주고, style report missing/malformed/BLOCKED이면 `복구 전 문체 게이트 필요` 섹션과 `run-prose-taste-benchmark`, `apply-style-gate --fail-on-blocked` 명령을 먼저 안내한다.
- `scripts/session-start.mjs`의 Ralph 활성 안내도 같은 조건으로 바꿨다. 세션 시작 상단 문구는 design gate와 style gate가 모두 PASS일 때만 직접 `/write-all --resume`을 권하고, 하나라도 미통과이면 `설계/문체 게이트가 모두 PASS가 된 뒤` 재개하라고 말한다.
- `/resume` 문서와 `/status` 문서도 재개를 새 원고 생성 경로로 보도록 갱신했다. `skills/10-resume/SKILL.md`, `skills/10-resume/references/session-recovery.md`, `skills/status/SKILL.md`, `skills/status/references/detailed-guide.md`, README가 모두 `reviews/style-gate-report.json`, `apply-style-gate`, `run-prose-taste-benchmark`, 주요 style/prose-taste block code를 재개 전 조건으로 유지한다.
- `tests/scripts/session-start-recovery.test.ts`는 style gate report가 없거나 `BLOCKED`일 때 direct resume 옵션과 상단 resume 안내가 사라지는지 확인한다. `tests/masterpiece/engagement-contracts.test.ts`는 resume/status/README 문서와 recovery/start scripts가 style gate 계약을 잃지 않는지 검사한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 문체 평가 모델이 아니라 재개 경로의 운영 신뢰도 보강이다. 다만 사용자가 문제 삼은 "거슬리는 문체"는 초안뿐 아니라 재개 회차에서도 반복될 수 있으므로, style gate를 resume/status 경로까지 확장한 것은 98점 시스템의 실전 안전성을 높인다. 99점 이상은 실제 중단/재개 프로젝트 holdout에서 이 차단이 좋은 문체를 과차단하지 않고 거슬리는 문체와 stale prose taste evidence만 안정적으로 막는 증거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/scripts/session-start-recovery.test.ts tests/masterpiece/engagement-contracts.test.ts`: 2 files, 100 tests passed
  - `npx vitest run tests/scripts/session-start-recovery.test.ts tests/masterpiece/engagement-contracts.test.ts tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts`: 4 files, 107 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 39 files and 709 tests passed, required outputs 31 verified
  - `npm test`: 63 files, 1414 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 help and examples gate advisory coverage):

- 리서치 반영: Google Cloud의 MLOps pipeline 문서는 validation을 pipeline 단계 사이의 gate로 둬 실패 시 다음 단계 진행을 멈추는 구조를 설명한다. Automated Self-Testing as a Quality Gate 논문도 gate 결과가 실제 PROMOTE/HOLD/ROLLBACK 결정과 연결되어야 한다고 본다. scikit-learn common pitfalls는 평가 근거가 현재 입력과 맞지 않거나 절차상 새면 성능 추정이 낙관적으로 왜곡될 수 있다고 경고한다. 따라서 실행 스킬뿐 아니라 `/help`, usage example, detailed guide 같은 advisory layer도 같은 gate decision을 사용자에게 보여 줘야 한다. 참고: [Google Cloud MLOps continuous delivery](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html).
- blind spot: 직전 보강으로 실제 writing entrypoint와 resume/status는 design/style gate를 확인하지만, `skills/help/SKILL.md`와 `/write-all` examples/detailed guide는 여전히 플롯 이후 바로 `/write-all` 또는 `/write-all --resume`을 따라 하게 읽힐 수 있었다. 실행 본문이 막더라도, 도움말과 예시가 직접 집필을 다음 행동처럼 안내하면 사용자는 gate report를 먼저 만들지 않고 실패를 반복하거나, 일부 수동 경로에서 오래된 문체 evidence를 들고 재개할 가능성이 남는다.
- `skills/help/SKILL.md`를 6단계 quickstart로 바꾸고 `/gen-plot` 이후 `gate PASS` 단계를 명시했다. 프로젝트 상태 감지는 이제 `reviews/design-gate-report.json`과 `reviews/style-gate-report.json`이 없거나 PASS가 아니면 `/write-all` 대신 `run-premise-appeal-benchmark -> apply-design-gate` 또는 `run-prose-taste-benchmark -> apply-style-gate`를 먼저 안내한다.
- `skills/08-write-all/references/detailed-guide.md`에 `Preflight Gate System`을 추가했다. `/write-all`, `/write-all --resume`, `/write-all --restart`가 모두 새 원고 생성 경로이며, design/style gate가 모두 PASS일 때만 draft를 시작한다고 명시했다. Resume detection 예시도 gate missing/BLOCKED이면 benchmark/gate 명령을 반환하도록 바꿨다.
- `skills/08-write-all/examples/example-usage.md`는 기본 시작, resume, manual edit 이후 resume, outline 이후 write-all, mid-novel resume 예시 모두에서 preflight gate 확인을 먼저 보여 준다. style gate가 BLOCKED이면 `Resume blocked before writing`으로 멈추고 `run-prose-taste-benchmark`, `apply-style-gate --fail-on-blocked`를 먼저 실행하도록 안내한다.
- `tests/masterpiece/engagement-contracts.test.ts`에 `help and write-all reference docs should route users through design and style gates` 계약을 추가했다. help, detailed guide, usage examples가 `apply-design-gate`, `apply-style-gate`, 두 gate report를 계속 보존하고, help가 `/plot -> /write` 같은 오래된 직접 집필 흐름으로 퇴행하지 않는지 검사한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 실행 hard gate 자체보다 사용자 안내 계층의 우회 가능성을 줄인다. 대작 품질 시스템은 실제 알고리즘뿐 아니라 사용자가 어떤 순서로 실행하게 되는지가 중요하므로, 도움말과 예시까지 gate-first로 맞춘 것은 운영 재현성을 높인다. 99점 이상은 여전히 실제 사용자 온보딩/재개 로그에서 이 안내가 혼란 없이 gate evidence를 생성하게 만들고, 좋은 프로젝트를 과차단하지 않는다는 증거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts`: 1 file, 90 tests passed
  - `npm run validate:skills`: passed, 29 skills validated
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts tests/docs/catalog-sync.test.ts tests/build/prebuild-integrity.test.ts`: 3 files, 97 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 39 files and 710 tests passed, required outputs 31 verified
  - `npm test`: 63 files, 1415 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 pre-writing style gate handoff):

- 리서치 반영: Google Cloud의 MLOps pipeline 문서는 validation을 serving 전 gate로 두고 data/model validation 실패가 다음 단계 실행을 멈추는 자동화 구조를 설명한다. Automated Self-Testing as a Quality Gate 논문도 LLM application의 release decision을 evidence-driven PROMOTE/HOLD/ROLLBACK gate와 연결해야 한다고 본다. scikit-learn common pitfalls는 검증 데이터 누수나 현재 입력과 맞지 않는 평가 근거가 성능 추정을 과대평가할 수 있음을 경고한다. 따라서 문체 취향도 회차 완료 후 지적하는 데 그치지 않고, 현재 선호/비선호 샘플과 style guide evidence가 PASS일 때만 초안 생성을 시작해야 한다. 참고: [Google Cloud MLOps continuous delivery](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html).
- blind spot: `prose-taste-benchmark`와 chapter gate는 거슬리는 문체를 사후 검출할 수 있었지만, 집필 진입점에는 실행 가능한 style hard gate가 없었다. 즉 사용자가 문체가 거슬렸다고 느낀 원인을 labeled sample로 저장해도, `reviews/prose-taste-benchmark-report.json`이 missing/stale/not-ready인 상태에서 `/write`, `/write-all`, 2-Pass/3-Pass/parallel 경로가 먼저 초안을 만들 수 있었다.
- `src/cli/apply-style-gate.ts`를 추가했다. 이 CLI는 `reviews/prose-taste-benchmark-report.json`을 읽어 `reviews/style-gate-report.json`을 저장하고, `--fail-on-blocked`가 있으면 실패 시 exit code 2로 종료한다. hard block 조건은 report missing/malformed, prose taste sample source 0개, sourceEvidence mismatch/not-recorded/no-sources, `readyForStyleTuning !== true`, failing sample, false positive/false negative, missing issue, score out of range, 약한 friction/highlight annotation, 약한 highlight diversity, 약한 style fingerprint, authorial style drift, reader segment 편향, split leakage, holdout 부족이다.
- 모든 집필 진입점(`/write`, `/write-act`, `/write-all`, `/write-2pass`, `/write-3pass`, `/write-parallel`, `/write-act-2pass`, `/write-act-3pass`, `/write-act-parallel`)과 quickstart Step 4에 `node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json` preflight를 추가했다. `reviews/style-gate-report.json`의 `passed=true`, `status=PASS`가 아니면 첫 회차, act 브랜치, Claude/Codex 초안, Grok polish, adult rewrite 모두 시작하지 않는다.
- README의 집필 명령 표와 문체 취향 벤치마크 섹션도 같은 계약으로 갱신했다. 이제 `run-prose-taste-benchmark`는 report 생성이고, `apply-style-gate`는 집필 허용 판정이다. `recommendedCommands`는 `run-prose-taste-benchmark`와 `apply-style-gate`를 함께 돌려 source evidence freshness와 문체 취향 근거를 회복하도록 안내한다.
- `tests/masterpiece/style-gate-cli.test.ts`는 PASS, not-ready BLOCKED, stale source BLOCKED를 CLI black-box로 검증한다. `tests/masterpiece/engagement-contracts.test.ts`는 9개 writing skill, quickstart, README가 `apply-style-gate`, `reviews/style-gate-report.json`, 주요 prose taste/style block code, `run-prose-taste-benchmark` handoff를 계속 유지하는지 검사한다. prebuild integrity와 `scripts/verify-build.mjs`도 `cli/apply-style-gate.js` 산출물을 요구한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 문체 평가 모델 자체를 새로 만든 것이 아니라, 이미 만든 문체 취향 evidence를 원고 생성 전 hard gate에 연결한 운영 신뢰도 보강이다. 사용자 관점에서는 "거슬렸던 문체"가 초안 단계부터 재발하는 위험이 크게 줄었다. 99점 이상은 실제 독자/사용자 holdout에서 이 style gate가 좋은 문체를 과차단하지 않고 거슬리는 문체를 안정적으로 조기 차단한다는 캘리브레이션 증거가 더 필요하다.
- 검증 결과:
  - `npx vitest run tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/engagement-contracts.test.ts tests/build/prebuild-integrity.test.ts tests/docs/catalog-sync.test.ts`: 4 files, 99 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 39 prebuild test files and 707 tests passed, required outputs 31 verified
  - `npm test`: 63 files, 1412 tests passed
  - `git diff --check`: passed (CRLF warnings only)
  - `git diff --check`: passed (CRLF warnings only)
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 all writing entrypoint design preflight coverage):

- 리서치 반영: Google Cloud의 MLOps pipeline 문서는 모델 검증 단계를 serving 전 gate로 두고, 자동화된 pipeline에서 data/model validation 실패가 다음 단계 진행을 멈추는 구조를 설명한다. Automated Self-Testing as a Quality Gate 논문도 LLM application의 release decision을 evidence-driven PROMOTE/HOLD/ROLLBACK gate에 연결해야 한다고 본다. scikit-learn common pitfalls는 평가 데이터 누수와 잘못된 검증 절차가 성능을 과대평가할 수 있음을 경고한다. 따라서 소설 시스템에서도 전제 매력 benchmark가 stale, source 누락, false positive, weak promise evidence를 발견했다면 어떤 집필 진입점도 draft 생성 전에 같은 설계 gate를 통과해야 한다. 참고: [Google Cloud MLOps continuous delivery](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html).
- blind spot: 직전 보강은 `/write`, `/write-all`, quickstart Step 4에 preflight를 붙였지만, README는 `/write-act`, `/write-2pass`, `/write-3pass`, `/write-parallel`, `/write-act-2pass`, `/write-act-3pass`, `/write-act-parallel`도 집필 진입점으로 노출한다. 이 경로들이 설계 gate를 건너뛰면 전제 benchmark가 실패했는데도 act 단위, 2-pass/3-pass, 병렬 초안 생성이 먼저 시작될 수 있었다.
- `skills/07-write-act/SKILL.md`, `skills/write-2pass/SKILL.md`, `skills/write-3pass/SKILL.md`, `skills/write-parallel/SKILL.md`, `skills/write-act-2pass/SKILL.md`, `skills/write-act-3pass/SKILL.md`, `skills/write-act-parallel/SKILL.md`에 모두 `node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json` preflight를 추가했다. `reviews/design-gate-report.json`의 `passed=true`, `status=PASS`가 아니면 어떤 회차, Claude/Codex branch, Grok polish, adult rewrite도 시작하지 않는다.
- Act 단위 skill은 act의 첫 회차 전에 gate를 확인하고, 단건 skill을 직접 호출할 때도 gate를 반복 확인한다. 병렬 skill은 Claude/Codex 어느 쪽 초안도 만들기 전에 막고, 2-pass/3-pass skill은 첫 draft 생성 전에 막는다. 차단 이유는 `premise-appeal-not-ready`, `weak-promise-evidence`, `premise-appeal-false-positive`, `premise-behavioral-intent-weak`, `premise-appeal-split-leakage`, `premise-appeal-report-stale`, `premise-appeal-source-missing`으로 노출하고 `recommendedCommands`의 `run-premise-appeal-benchmark`와 `apply-design-gate`를 handoff한다.
- README의 집필 명령 표와 design gate 설명을 갱신해 모든 9개 집필 진입점이 design gate preflight를 갖는다고 명시했다. `tests/masterpiece/engagement-contracts.test.ts`는 9개 skill 파일과 README가 `apply-design-gate`, `--fail-on-blocked`, `reviews/design-gate-report.json`, stale/source-missing 차단, `run-premise-appeal-benchmark` handoff를 계속 유지하는지 검사한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 취향 모델이 아니라 운영 신뢰도 보강이다. 그래도 중요한 이유는 약한 전제나 stale benchmark가 있는 프로젝트에서 일부 고급 집필 루트만으로 대량 원고가 생성되는 실패를 막기 때문이다. 99점 이상은 여전히 실제 프로젝트 holdout에서 이 preflight가 좋은 전제를 과차단하지 않고 약한 전제를 조기에 막는 독자/사용자 증거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts`: 1 file, 88 tests passed
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts tests/docs/catalog-sync.test.ts`: 2 files, 92 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 38 files and 701 tests passed, required outputs 30 verified
  - `npm test`: 62 files, 1406 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 session status design gate advisory coverage):

- 리서치 반영: Google Cloud의 MLOps pipeline 문서는 validation 단계를 자동 pipeline에 넣어 다음 단계로 넘어가기 전 gate 역할을 하게 한다. Automated Self-Testing as a Quality Gate 논문도 비결정적 LLM application에는 evidence coverage 기반 PROMOTE/HOLD/ROLLBACK 결정이 필요하다고 본다. scikit-learn common pitfalls는 test/validation 정보가 모델 선택과 전처리에 새면 성능 추정이 낙관적으로 왜곡된다고 경고한다. 따라서 소설 집필 시스템의 상태 안내도 "진행 중이니 바로 재개"가 아니라 현재 `reviews/design-gate-report.json`이 PASS인지 먼저 보여 줘야 한다. 참고: [Google Cloud MLOps continuous delivery](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html).
- blind spot: `formatRecoveryMessage()`는 design gate가 missing/BLOCKED이면 직접 resume 옵션을 숨기게 됐지만, 세션 시작 hook의 상단 Ralph 활성 문구와 `/status` 예시는 여전히 `/write-all --resume` 또는 `/write`를 다음 단계로 직접 권할 수 있었다. 즉 core recovery block은 안전해도 주변 advisory text가 사용자 행동을 잘못 유도하는 경로가 남아 있었다.
- `scripts/session-start.mjs`에 `formatRalphActiveNotice()`를 추가했다. 이제 `recoveryState.designGate.passed == true`이고 `status == "PASS"`일 때만 "새 세션에서 이어가려면 `/write-all --resume`" 문구를 보여 주며, missing/BLOCKED이면 "설계 게이트가 PASS가 된 뒤 `/write-all --resume`으로 재개"하라고 안내한다.
- `skills/status/SKILL.md`와 `skills/status/references/detailed-guide.md`에 Phase 3.5 design gate를 추가했다. `/status`는 `reviews/design-gate-report.json`의 `passed=true`, `status=PASS`를 현재 상태에 표시하고, 미통과이면 `/write`, `/resume --continue`, `/write-all --resume`을 직접 권하지 않고 `run-premise-appeal-benchmark`와 `apply-design-gate --fail-on-blocked`를 먼저 안내한다.
- 테스트는 상태 안내까지 계약에 포함했다. `tests/scripts/session-start-recovery.test.ts`는 design gate가 missing/BLOCKED일 때 상단 Ralph 안내에도 direct resume 문구가 없는지 확인한다. `tests/masterpiece/engagement-contracts.test.ts`는 resume docs뿐 아니라 session-start script, status skill, status detailed guide가 design gate report와 benchmark/gate handoff를 계속 유지하는지 검사한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 문체/재미 모델이 아니라 운영 안내의 남은 우회 문구를 제거한 것이다. 다만 실제 사용자는 상태 화면과 세션 시작 메시지를 보고 행동하므로, 약한 전제나 stale benchmark가 남은 프로젝트에서 실수로 원고 생성을 재개할 위험을 더 줄였다. 99점 이상은 여전히 실제 프로젝트 재개/상태 확인 로그에서 이 안내가 과차단 없이 약한 전제만 막는 holdout evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/scripts/session-start-recovery.test.ts tests/masterpiece/engagement-contracts.test.ts tests/docs/catalog-sync.test.ts`: 3 files, 102 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 38 files and 704 tests passed, required outputs 30 verified
  - `npm test`: 62 files, 1409 tests passed

추가 확인(2026-06-22 executable manuscript preflight coverage):

- 리서치 반영: Google Cloud의 MLOps pipeline 문서는 validation 단계를 자동 pipeline에 넣어 다음 단계로 넘어가기 전 gate 역할을 하게 한다. Automated Self-Testing as a Quality Gate 논문도 LLM application의 release decision을 evidence-driven PROMOTE/HOLD/ROLLBACK gate에 연결해야 한다고 본다. scikit-learn common pitfalls는 검증 근거가 현재 입력과 분리되지 않거나 오래되면 품질 추정이 낙관적으로 왜곡될 수 있음을 경고한다. 따라서 소설 집필에서도 스킬 문서나 도움말뿐 아니라 실제 원고 파일을 쓰는 실행 스크립트가 같은 gate를 강제해야 한다. 참고: [Google Cloud MLOps continuous delivery](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html).
- blind spot: `/write`, `/write-all`, `/resume`, help/example 문서는 design/style gate를 안내하지만, `scripts/codex-writer.mjs`를 직접 실행하면 `write`, `revise`, `polish`가 `reviews/design-gate-report.json`과 `reviews/style-gate-report.json` 없이도 Codex 호출과 파일 쓰기 단계로 갈 수 있었다. `scripts/adult-rewriter.mjs`도 직접 실행 시 Grok polish/adult rewrite가 문체 gate를 우회할 수 있었다. 사용자가 문제 삼은 "거슬리는 문체"가 문서상으로는 막혀도 실행 파일 직접 호출로 재발할 수 있는 간극이다.
- `scripts/writing-preflight.mjs`를 추가해 design/style gate 판정을 공통화했다. missing/malformed/not-passed report를 `design-gate-report-missing`, `style-gate-report-missing`, `design-gate-not-passed`, `style-gate-not-passed` 등으로 노출하고, report의 `recommendedCommands`가 있으면 그대로 보여 주며 없으면 `run-premise-appeal-benchmark -> apply-design-gate`, `run-prose-taste-benchmark -> apply-style-gate` 기본 명령을 제시한다.
- `scripts/codex-writer.mjs`는 이제 `write`, `revise`, `polish`에서 `--dry-run`이 아니면 프롬프트 구성, Codex CLI 확인, 파일 쓰기 전에 `assertWritingPreflight()`를 실행한다. gate가 PASS가 아니면 exit code 2로 종료하고 원고 파일을 만들지 않는다. `design`, `gen-plot`, `blueprint`는 사전 설계/플롯 생성 경로이므로 이 원고 gate의 대상에서 제외했다.
- `scripts/adult-rewriter.mjs`도 dry-run이 아닌 Grok 리라이트 전에 같은 preflight를 실행한다. gate 실패 시 API key 확인보다 먼저 exit code 2로 멈추며, `.bak`이나 output 파일을 만들지 않는다. 즉 2-Pass/3-Pass polish, adult rewrite도 문체 취향 evidence가 PASS일 때만 원고 변경 단계로 들어간다.
- `/revise` 문서도 원고 변경 경로로 정렬했다. `skills/09-revise/SKILL.md`는 Codex, collaborative, solo editor 퇴고 모두 `apply-design-gate --fail-on-blocked`와 `apply-style-gate --fail-on-blocked`를 먼저 요구하고, 주요 design/style block code와 benchmark handoff를 드러낸다.
- `tests/scripts/writing-preflight.test.ts`는 Codex write가 gate missing 상태에서 Codex CLI 확인 전에 exit 2로 멈추는지, Codex dry-run은 유지되는지, Codex revise가 style gate issue code와 report recommended command를 노출하는지, Grok rewrite가 API key 확인과 파일 쓰기 전에 멈추는지, Grok dry-run은 유지되는지 black-box로 검증한다. `validate:integrity`와 `prebuild-integrity`에도 이 테스트를 추가했다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 재미/문체 평가 모델이 아니라 gate enforcement depth를 높인 것이다. 하지만 실전에서는 직접 스크립트 호출, Codex 퇴고, Grok polish가 문체를 가장 크게 흔드는 경로라, "문체가 거슬림" 재발 위험을 실행 레벨에서 줄인 의미가 크다. 99점 이상은 실제 프로젝트 holdout에서 이 hard gate가 좋은 문체 개선은 통과시키고 거슬리는 문체 및 stale evidence만 안정적으로 차단한다는 사용자/독자 로그가 필요하다.
- 검증 결과:
  - `npx vitest run tests/scripts/writing-preflight.test.ts`: 1 file, 5 tests passed
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts tests/build/prebuild-integrity.test.ts`: 2 files, 94 tests passed
  - `npm run validate:skills`: passed, 29 skills validated
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 40 prebuild test files and 716 tests passed, required outputs 31 verified
  - `npm test`: 64 files, 1421 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 manuscript tool edit gate coverage):

- 리서치 반영: Google Cloud의 MLOps pipeline 문서는 validation을 pipeline 단계 사이의 자동 gate로 두어 실패 시 다음 단계 실행을 멈추는 구조를 설명한다. Automated Self-Testing as a Quality Gate 논문도 LLM application의 release decision을 PROMOTE/HOLD/ROLLBACK 같은 명시적 gate 결정에 묶어야 한다고 본다. scikit-learn common pitfalls는 검증 근거가 절차상 새거나 현재 입력과 맞지 않으면 품질 추정이 낙관적으로 왜곡된다고 경고한다. 실행 스크립트뿐 아니라 Claude Code의 파일 도구도 같은 gate를 적용해야, 원고가 시스템 밖으로 새지 않는다. 참고: [Google Cloud MLOps continuous delivery](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), [Automated Self-Testing as a Quality Gate](https://arxiv.org/html/2603.15676v1), [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html).
- blind spot: `codex-writer.mjs`와 `adult-rewriter.mjs`는 design/style gate를 강제하지만, Claude가 `Write`, `Edit`, `MultiEdit`로 `chapters/chapter_001.md`, `chapters/ch001.md`, `chapter_001_codex.md` 같은 원고 파일을 직접 쓰면 같은 gate를 우회할 수 있었다. 이 경로는 특히 "수동 수정", "잠깐 고쳐줘", "이 원고만 바로 저장해줘" 같은 흐름에서 문체 evidence 없이 원고가 바뀌는 위험을 만든다.
- `hooks/pretooluse.py`를 JSON schema validator에서 manuscript guard까지 포함하는 PreToolUse guard로 확장했다. `chapters/(chapter_NNN|chNNN)*.md` 경로가 `Write`, `Edit`, `MultiEdit` 대상으로 들어오면 nearest novel project를 찾고, `reviews/design-gate-report.json`과 `reviews/style-gate-report.json`이 모두 `passed=true`, `status=PASS`인지 확인한다.
- gate report가 missing/malformed/BLOCKED이면 hook은 `decision=block`을 반환한다. 차단 이유에는 `design-gate-report-missing`, `style-gate-report-missing`, report issue code, report path, `recommendedCommands` 또는 기본 `run-premise-appeal-benchmark -> apply-design-gate`, `run-prose-taste-benchmark -> apply-style-gate` 명령이 포함된다.
- `hooks/hooks.json`은 이제 `pretooluse.py`를 `Write`, `Edit`, `MultiEdit` matcher 모두에 연결한다. 기존 chapter JSON schema validation은 유지된다. 따라서 원고 Markdown은 gate로 보호하고, plot/chapter JSON은 기존 구조 검증을 계속 받는다.
- `hooks/AGENTS.md`도 최신화했다. PreToolUse의 역할을 "JSON schema validation + manuscript design/style gate guard"로 명시하고, hooks는 무거운 집필 로직이 아니라 빠른 local guardrail을 담당하도록 설명을 정리했다.
- `tests/scripts/pretooluse-manuscript-gate.test.ts`는 missing gate 상태의 chapter Markdown Write 차단, style gate BLOCKED 상태의 chapter variant Edit 차단, PASS 상태의 MultiEdit 허용, non-chapter Markdown 허용, 기존 invalid chapter JSON schema 차단, hook config의 Write/Edit/MultiEdit 등록을 black-box로 검증한다. `tests/masterpiece/engagement-contracts.test.ts`와 `tests/build/prebuild-integrity.test.ts`도 이 계약을 보존한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새로운 평가 능력이 아니라 gate enforcement surface 확대다. 그러나 실제 사용 중에는 모델/스크립트보다 파일 도구 직접 수정이 더 쉽게 우회될 수 있으므로, 문체가 거슬리는 원고가 gate 없이 저장되는 위험을 줄인 의미가 크다. 99점 이상은 여전히 실제 사용자 작업 로그에서 이 guard가 필요한 경우만 차단하고 정상적인 문체 개선 흐름을 과차단하지 않는다는 증거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/scripts/pretooluse-manuscript-gate.test.ts`: 1 file, 6 tests passed
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts tests/build/prebuild-integrity.test.ts`: 2 files, 94 tests passed
  - `npm run validate:skills`: passed, 29 skills validated
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 722 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1427 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 length-normalized reader-response data quality):

- 리서치 반영: ACL WNU 2023의 literary fiction reader engagement 연구는 독자 engagement를 눈추적, 문장 단위 annotation, 전체 engagement survey로 함께 수집해 fiction engagement가 단순 점수 하나가 아니라 실제 읽기 행동과 주관 반응이 결합된 문제임을 보여 준다. Pew Research의 bogus respondent 분석은 speeding과 attention check 같은 흔한 두 검사가 저품질 응답을 대부분 잡지 못할 수 있다고 보고한다. Brysbaert의 reading-rate 메타분석은 성인 silent reading 속도가 통상 수백 wpm 범위에 있음을 보여 주므로, 긴 원고를 비현실적으로 짧은 시간에 읽은 패널 응답은 독자 반응 calibration 근거로 쓰면 안 된다. 참고: [ACL WNU 2023 reader engagement](https://aclanthology.org/2023.wnu-1.13/), [Pew Research bogus respondents](https://www.pewresearch.org/methods/2020/02/18/two-common-checks-fail-to-catch-most-bogus-cases/), [Brysbaert reading-rate meta-analysis PDF](https://reader.ku.edu/sites/reader/files/2024-01/How%20many%20words%20do%20we%20read%20per%20minute%20%281%29.pdf).
- blind spot: `reader-response-calibration`은 `median_read_time_seconds`, `minimum_read_time_seconds`, `speeding_response_count`, `straight_lining_response_count`, duplicate/bot/quality flag를 보지만, 읽기 시간의 타당성을 원고 길이에 맞춰 보지는 않았다. 그러면 800단어 샘플과 4200단어 샘플이 같은 60초 최소 기준을 공유해, 긴 회차를 실제로 읽지 않은 응답이 responseDataQuality를 통과할 수 있었다.
- `ReaderResponseSampleEvidence`에 `manuscriptWordCount`를 추가하고 JSON 입력 스키마/템플릿/CLI raw mapping에 `manuscript_word_count`를 연결했다. `evaluateResponseDataQuality`는 이제 `medianReadingWordsPerMinute`, `minimumReadingWordsPerMinute`를 산출하며, 기본값 `maximumMedianReadingWordsPerMinute=650`, `maximumMinimumReadingWordsPerMinute=1200`, `requireLengthNormalizedReadTimeForTuning=true`를 적용한다.
- reader-response 프로젝트 CLI와 `calibrate-reader-response` CLI도 `maximum_median_reading_words_per_minute`, `maximum_minimum_reading_words_per_minute`, `require_length_normalized_read_time` 파일 옵션 및 `--max-median-reading-wpm`, `--max-minimum-reading-wpm`, `--require-length-normalized-read-time`, `--no-require-length-normalized-read-time` 옵션을 받는다.
- README의 reader-response data-quality 설명을 갱신했다. 이제 독자 반응 샘플 운영자는 timing/speeding 근거뿐 아니라 `manuscript_word_count`를 함께 기록해야 하며, 원고 길이 대비 비현실적 속독은 threshold retuning과 98+ readiness 근거에서 제외된다.
- 테스트는 정상 샘플의 WPM 계산을 CLI fixture에서 검증하고, 4200단어 원고를 median 180초/minimum 90초에 읽은 패널이 `responseDataQuality=weak`로 떨어지는 회귀 테스트를 추가했다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 창작 알고리즘이 아니라 독자 반응 calibration의 데이터 품질 방어막을 강화한 것이다. 자동 점수와 독자 설문을 맞추는 단계에서 "읽지 않은 것 같은 좋은 점수"를 더 잘 걸러내므로, 98점 readiness의 실전 신뢰도는 올라간다. 99점 이상은 여전히 실제 플랫폼/독자 패널 holdout에서 이 WPM 기준이 좋은 독자 반응을 과차단하지 않고 저품질 응답만 안정적으로 거른다는 운영 로그가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/reader-response-calibration.test.ts`: 1 file, 53 tests passed
  - `npx vitest run tests/masterpiece/reader-response-calibration-cli.test.ts`: 1 file, 2 tests passed
  - `npm run validate:schemas`: passed
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 724 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1429 tests passed
  - `git diff --check`: passed (CRLF warnings only)
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 723 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1428 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 Korean character-normalized reader-response data quality):

- 리서치 반영: KCI 등재 대한안과학회지의 한국어 읽기 속도 연구는 한국어 읽기 속도를 측정할 때 WPM뿐 아니라 문장 글자/어절 특성을 함께 다루며, 한국어 읽기 chart가 언어별 측정 기준을 필요로 한다는 점을 보여 준다. Pew Research의 bogus respondent 분석은 speeding과 attention check만으로는 저품질 응답 대부분을 잡지 못할 수 있다고 보고한다. 따라서 한국어 소설 독자 패널은 단순 소요시간이나 영어식 WPM만으로 충분하지 않고, 원고 문자 수 기반 CPM도 함께 남겨야 한다. 참고: [KCI 한국어 읽기 속도 측정 연구](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002099342), [Pew Research bogus respondents](https://www.pewresearch.org/methods/2020/02/18/two-common-checks-fail-to-catch-most-bogus-cases/).
- blind spot: 직전 length-normalized reader-response gate는 `manuscript_word_count` 기반 WPM을 추가했지만, 이 플러그인의 주 대상은 한국어 소설이다. 한국어 원고는 띄어쓰기/어절 카운트가 수집자나 플랫폼에 따라 흔들릴 수 있고, 원고 자체는 문자 수가 더 안정적으로 확보되는 경우가 많다. 그러면 word count가 없거나 부정확한 한국어 패널 샘플이 길이 보정 evidence를 우회하거나, 반대로 영어식 단어 기준에 과도하게 의존할 수 있었다.
- `ReaderResponseSampleEvidence`와 sample result에 `manuscriptCharacterCount`, `medianReadingCharactersPerMinute`, `minimumReadingCharactersPerMinute`를 추가했다. `evaluateResponseDataQuality`는 이제 `manuscriptWordCount` 또는 `manuscriptCharacterCount` 중 하나만 있어도 length-normalized evidence로 인정하지만, 문자 수가 있으면 기본값 `maximumMedianReadingCharactersPerMinute=1600`, `maximumMinimumReadingCharactersPerMinute=3000`을 적용해 비현실적 한국어 속독 응답을 `responseDataQuality=weak`로 떨어뜨린다.
- reader-response 프로젝트 CLI, `calibrate-reader-response` CLI, JSON schema, template도 `manuscript_character_count`, `maximum_median_reading_characters_per_minute`, `maximum_minimum_reading_characters_per_minute`, `--max-median-reading-cpm`, `--max-minimum-reading-cpm`을 받도록 갱신했다. README도 한국어 원고에서는 문자 수를 함께 기록하라고 설명한다.
- 테스트는 기본 human reader evidence와 CLI fixture에서 CPM 산출값을 검증하고, `manuscriptWordCount`가 없는 12000자 한국어 원고를 median 240초/minimum 120초에 읽은 패널이 `responseDataQuality=weak`가 되는 회귀 테스트를 추가했다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 이미 추가한 독자 반응 데이터 품질 방어를 한국어 원고에 더 맞춘 것이다. 99점 이상은 여전히 실제 한국어 플랫폼/독자 패널 holdout에서 CPM 상한이 저품질 응답을 걸러내면서 장르 핵심 독자의 빠른 정상 독서를 과차단하지 않는다는 운영 로그가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/reader-response-calibration.test.ts`: 1 file, 54 tests passed
  - `npx vitest run tests/masterpiece/reader-response-calibration-cli.test.ts`: 1 file, 2 tests passed
  - `npm run validate:schemas`: passed
  - `npx tsc --noEmit`: passed

추가 확인(2026-06-22 simultaneous-action prose cadence gate):

- 리서치 반영: 한국어 `-(으)며`, `-(으)면서`는 동시 진행 또는 연결된 동작을 표시할 수 있다. Purdue OWL의 sentence variety 문서는 같은 문장 구조와 길이가 반복되면 단조롭게 느껴지고, 리듬 변화가 강조와 흐름을 만든다고 설명한다. Sandra Gerth와 Helping Writers Become Authors의 participial phrase 논의도 동시동작/분사구가 과해지면 중요한 행동이 주절에서 밀리고 사건 진행이 혼란스러워질 수 있다고 본다. 따라서 한국어 원고에서도 `~며/~면서/~한 채`가 반복되면 장면의 인과, 선택, 결과가 주절 행동으로 서지 못하고 생성문 같은 동작 나열로 눌릴 수 있다. 참고: [HowToStudyKorean Lesson 62](https://www.howtostudykorean.com/unit-3-intermediate-korean-grammar/unit-3-lessons-59-66/lesson-62/), [Purdue OWL Sentence Variety](https://owl.purdue.edu/owl/general_writing/academic_writing/sentence_variety/index.html), [Sandra Gerth participial phrases](https://sandragerth.com/how-to-use-participial-phrases-in-your-writing/), [Helping Writers Become Authors participle phrases](https://www.helpingwritersbecomeauthors.com/participle-phrases/).
- blind spot: 기존 prose taste gate는 같은 종결, 짧은 문장 연속, 완충 부사, 상태 변화 없는 행동문, static camera description 등을 막았지만, "고개를 돌리며", "문고리를 잡은 채", "숨을 삼키면서"처럼 여러 행동을 종속구로 계속 붙이는 리듬은 별도로 보지 않았다. 이 패턴은 사용자가 말한 "문체가 거슬림"과 직접 맞닿아 있다. 문장은 많이 움직이는데 주절의 선택, 충돌, 결과가 약해져 원고가 무대 지시문처럼 보일 수 있기 때문이다.
- `src/quality/prose-taste-gate.ts`에 `simultaneous-action-cadence` issue를 추가했다. 새 metrics는 `simultaneousActionDensityPer1000`, `longestSimultaneousActionRun`이며, `plain`, `balanced`, `lyrical`, `webnovel-fast` mode별 기본 허용치를 분리했다. 따옴표 대사는 건드리지 않고, `라며/이라며` 같은 발화 태그와 단순 `A이며 B`는 가능한 한 피하도록 패턴을 좁혔다.
- profile override도 연결했다. `max_simultaneous_action_density_per_1000`, `max_simultaneous_action_run`을 style guide, prose taste benchmark schema/template, chapter gate CLI, benchmark project CLI, standalone benchmark CLI에서 모두 읽는다. 필요하면 특정 장르나 작가 문체에서는 `--max-simultaneous-actions`, `--max-simultaneous-action-run`으로 허용치를 넓힐 수 있다.
- style fingerprint와 authorial drift metrics에도 두 지표를 넣었다. 즉 단순히 한 회차를 차단하는 것에 그치지 않고, 선호/비선호 문체 샘플과 비교할 때도 이 리듬이 작가 고유 리듬인지, 거슬리는 AI식 습관인지 calibration할 수 있다.
- README의 문체 취향 벤치마크 설명도 갱신했다. 문체 문제를 "나쁜 표현 목록"으로만 보지 않고, `~며/~면서/~한 채` 동시동작 묶음이 인과 전환과 주절 행동을 대체하는 경우를 별도 리스크로 설명한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 재미 모델이 아니라 사용자가 직접 지적한 문체 마찰을 자동 게이트로 더 잘 잡는 보강이다. 실전 체감 개선 가능성은 높지만, 99점 이상은 실제 한국어 선호/비선호 원고 holdout에서 이 게이트가 거슬리는 동시동작 나열은 잡고, 문학적으로 의도된 병렬 동작은 과차단하지 않는다는 독자/사용자 근거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/prose-taste-gate.test.ts`: 1 file, 83 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 1 file, 2 tests passed
  - `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 1 file, 42 tests passed
  - `npm run validate:schemas`: passed
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 728 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1433 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 summary-memory writing preflight):

- 리서치 반영: Maynez et al.의 ACL 2020 요약 사실성 연구는 추상 요약 모델이 원문에 없는 내용을 만들거나 사실과 맞지 않는 내용을 섞는 문제가 있음을 보인다. Lewis et al.의 RAG 연구는 생성이 검색된 근거 문서에 접지될 때 더 구체적이고 사실적인 응답을 만들 수 있음을 보여 준다. 장편 소설 집필에서는 직전 회차 요약이 다음 회차의 검색/기억 근거이므로, 요약이 없거나 오래됐거나 너무 얇으면 다음 회차가 잘못된 기억 위에서 이어질 위험이 크다. 참고: [Maynez et al. 2020](https://aclanthology.org/2020.acl-main.173/), [Google Research summary page](https://research.google/pubs/on-faithfulness-and-factuality-in-abstractive-summarization/), [Lewis et al. 2020 RAG](https://arxiv.org/abs/2005.11401).
- blind spot: `codex-writer.mjs`는 다음 회차 프롬프트를 만들 때 직전 최대 3개 `context/summaries/chapter_NNN_summary.md`를 읽지만, 집필 전 preflight는 design/style gate만 보았다. 따라서 2화 이후 집필에서 1화 원고가 바뀌었는데 요약은 옛날 상태이거나, 요약이 한두 문장으로 너무 얇거나, 아예 없는 경우에도 다음 회차 생성이 시작될 수 있었다.
- `scripts/writing-preflight.mjs`에 `summary memory gate`를 추가했다. 현재 회차보다 앞선 최대 3개 원고 파일(`chapters/chapter_NNN.md` 또는 `chapters/chNNN.md`)이 있으면 대응 요약(`context/summaries/chapter_NNN_summary.md`, fallback `.md/.json`)을 찾고, missing/stale/too-thin/malformed 상태를 각각 `summary-memory-missing`, `summary-memory-stale`, `summary-memory-too-thin`, `summary-memory-malformed`로 차단한다.
- `scripts/codex-writer.mjs`는 `write`, `revise`, `polish` 실행 전에 `chapterNumber`를 넘겨 요약 메모리 검사를 수행한다. `scripts/adult-rewriter.mjs`도 입력 파일명에서 회차 번호를 추론할 수 있으면 같은 preflight를 적용해 2-Pass/3-Pass polish가 오래된 장기 기억을 기반으로 진행되지 않게 했다.
- README의 집필 명령 표와 preflight 설명을 갱신했다. 이제 문서상 모든 집필 진입점은 design + style + summary memory preflight를 요구하며, 요약이 없거나 원고보다 오래됐거나 100자 미만이면 다음 회차 작성 전에 멈춘다고 명시한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 재미 평가기가 아니라 장편 연속성의 실행 안정성 보강이다. 하지만 회차가 길어질수록 "틀린 요약을 바탕으로 다음 회차가 자연스럽게 틀어지는" 실패 비용이 커지므로, 대작 장편을 목표로 할 때 실전 위험을 줄이는 효과는 크다. 99점 이상은 여전히 실제 프로젝트에서 요약 메모리 gate가 정상 연재 흐름을 과차단하지 않고 continuity regression을 줄였다는 holdout 로그가 필요하다.
- 검증 결과:
  - `npx vitest run tests/scripts/writing-preflight.test.ts`: 1 file, 9 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 732 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1437 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 summary-memory manuscript hook coverage):

- 리서치 반영: 직전 summary-memory preflight와 같은 근거다. Maynez et al.의 ACL 2020 요약 사실성 연구는 요약이 원문과 어긋날 수 있음을 보이고, Lewis et al.의 RAG 연구는 생성이 현재 근거 문서에 접지될수록 더 사실적이고 구체적일 수 있음을 보여 준다. 장편 원고 직접 수정도 다음 회차 기억을 바꾸는 행위이므로, 실행 CLI뿐 아니라 파일 도구 hook에도 같은 요약 메모리 검사가 필요하다. 참고: [Maynez et al. 2020](https://aclanthology.org/2020.acl-main.173/), [Lewis et al. 2020 RAG](https://arxiv.org/abs/2005.11401).
- blind spot: `scripts/codex-writer.mjs`와 `scripts/adult-rewriter.mjs`는 summary memory gate를 통과해야 하지만, Claude Code가 `Write`, `Edit`, `MultiEdit`로 `chapters/chapter_002.md` 같은 후속 회차 원고를 직접 쓰면 `hooks/pretooluse.py`는 design/style만 보고 통과시켰다. 즉 수동 원고 수정 경로에서는 직전 요약 누락·stale·thin 상태가 다시 우회될 수 있었다.
- `hooks/pretooluse.py`에 summary memory 검사 함수를 추가했다. 원고 파일명에서 회차 번호를 추출하고, 현재 회차보다 앞선 최대 3개 원고가 있으면 `context/summaries/chapter_NNN_summary.md` 우선 후보를 찾아 missing/stale/too-thin/malformed를 `summary-memory-*` 코드로 차단한다. 출력 이유에는 summary path, source manuscript path, `/verify-chapter N` 복구 안내를 포함한다.
- `tests/scripts/pretooluse-manuscript-gate.test.ts`는 직접 `Write`가 2화 원고를 쓰기 전에 1화 요약 누락을 차단하는지, `Edit`가 stale summary를 차단하는지, fresh/substantive summary가 있으면 `MultiEdit`를 승인하는지 검증한다. 기존 design/style missing/BLOCKED, non-chapter markdown 허용, JSON schema 차단 테스트도 유지된다.
- `hooks/AGENTS.md`와 README도 hook이 design/style/summary memory gate를 모두 적용한다고 갱신했다. 이제 문서상으로도 `/write` 계열 명령뿐 아니라 수동 원고 Markdown 수정이 같은 장편 연속성 guard를 공유한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 새 창작 평가 모델은 아니지만, 실제 사용자가 명령을 우회해 파일을 직접 고치는 가장 흔한 경로까지 요약 메모리 안정성을 강제하므로 장편 연속성의 운영 신뢰도는 올라간다. 99점 이상은 여전히 실제 프로젝트 로그에서 이 hook이 필요한 경우만 차단하고 정상적인 긴급 수정을 과차단하지 않는다는 증거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/scripts/pretooluse-manuscript-gate.test.ts`: 1 file, 9 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 735 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1440 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 summary-memory resume recovery coverage):

- 리서치 반영: 직전 summary-memory 보강과 같은 근거다. Maynez et al.의 ACL 2020 요약 사실성 연구는 요약이 원문과 어긋날 수 있음을 보이고, Lewis et al.의 RAG 연구는 생성이 현재 근거 문서에 접지될수록 더 사실적이고 구체적일 수 있음을 보여 준다. 장편 소설 재개는 "이전 원고 상태를 기억하고 이어 쓰는" 작업이므로, 재개 안내도 최신 요약 메모리 상태를 gate로 보아야 한다. 참고: [Maynez et al. 2020](https://aclanthology.org/2020.acl-main.173/), [Lewis et al. 2020 RAG](https://arxiv.org/abs/2005.11401).
- blind spot: `scripts/writing-preflight.mjs`와 `hooks/pretooluse.py`는 summary memory gate를 강제했지만, `scripts/session-recovery.mjs`, `scripts/session-start.mjs`, `/resume`, `/write-all`, `/status`, `/help` 안내는 여전히 설계/문체 gate 중심으로 재개를 설명했다. 기능은 막아도 사용자가 "두 gate PASS면 바로 resume"이라고 이해할 수 있는 문서/상태 경로가 남아 있었다.
- `scripts/session-recovery.mjs`는 이제 `evaluateWritingPreflight(..., { includeDesign:false, includeStyle:false, chapterNumber })`로 재개 회차의 summary memory를 검사한다. `designGate`, `styleGate`, `summaryMemoryGate`가 모두 PASS일 때만 직접 `/write-all --resume`을 제안하고, summary가 missing/stale/too-thin/malformed이면 `복구 전 요약 메모리 게이트 필요`와 `/verify-chapter N` 복구 안내를 표시한다.
- `scripts/session-start.mjs`의 Ralph 활성 안내도 `summaryMemoryGate`를 포함한다. 새 세션 시작 상단 문구는 설계/문체/요약 메모리 gate가 모두 PASS일 때만 직접 `/write-all --resume`을 권하고, 하나라도 미통과이면 세 gate를 모두 PASS로 만든 뒤 재개하라고 말한다.
- `/resume`, `/write-all`, `/status`, `/help` 문서를 갱신했다. `skills/10-resume/**`, `skills/08-write-all/**`, `skills/status/**`, `skills/help/SKILL.md`, README는 이제 `context/summaries/chapter_NNN_summary.md`의 존재/신선도/최소 충실도와 `summary-memory-missing`, `summary-memory-stale`, `summary-memory-too-thin`, `summary-memory-malformed`를 재개 전 조건으로 명시한다.
- 계약 테스트를 보강했다. `tests/scripts/session-start-recovery.test.ts`는 prior summary가 missing/stale이면 direct resume 옵션이 사라지고 fresh/substantive이면 direct resume이 보이는지 검증한다. `tests/masterpiece/engagement-contracts.test.ts`는 help/write-all/resume/status 문서와 session-start/recovery scripts가 design, style, summary memory gate를 계속 함께 보존하는지 검사한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 창작 평가 모델이 아니라 이전 보강을 재개 UX와 문서 계약까지 확장한 것이다. 그러나 장편에서는 재개 순간이 continuity regression의 고위험 지점이므로, 실제 사용자가 잘못된 기억으로 다음 회차를 이어 쓰는 위험은 더 줄었다. 99점 이상은 여전히 실제 프로젝트 재개 로그에서 summary memory gate가 continuity error를 줄이고 정상 재개를 과차단하지 않는다는 holdout evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/scripts/session-start-recovery.test.ts tests/masterpiece/engagement-contracts.test.ts`: 2 files, 105 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 738 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1443 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 gaze-choreography prose cadence gate):

- 리서치 반영: Green & Brock의 narrative transportation 연구와 Green & Appel의 2024 리뷰는 독자가 이야기에 몰입할 때 주의, 정서, 심상이 서사 사건에 집중된다고 본다. Maslej et al. 2019는 소설의 표면 텍스트 특징, 정서 단어, 추상성이 독자 appeal 및 story/character appeal과 연결될 수 있음을 보인다. 따라서 문체 gate는 단순히 "표현이 예쁜가"보다 독자의 주의와 심상이 실제 사건, 단서, 선택, 결과로 옮겨 가는지를 봐야 한다. 참고: [Green & Brock 2000](https://www.communicationcache.com/uploads/1/0/8/8/10887248/the_role_of_transportation_in_the_persuasiveness_of_public_narratives.pdf), [Green & Appel 2024](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf), [Maslej et al. 2019](https://www.yorku.ca/mar/Maslej%20et%20al%202019_Appealing%20Features%20PACA%20final%20submission.pdf).
- blind spot: 기존 prose taste gate는 `stock-reaction-beat-chain`과 `status-quo-action-loop`을 잡았지만, 한국어 생성 산문에서 특히 자주 보이는 "시선을 피했다 / 눈길이 머물렀다 / 눈빛이 흔들렸다 / 고개를 돌렸다 / 서로 바라보았다" 식의 시선·고개 안무 리듬을 독립적으로 점수화하지 않았다. 이 패턴은 행동처럼 보이지만 새 단서, 선택 비용, 거절의 결과, 상대 조건 변화가 없으면 독자가 인물의 의사결정보다 카메라 동선을 읽게 만든다.
- `src/quality/prose-taste-gate.ts`에 `gaze-choreography-loop` issue를 추가했다. 새 metrics는 `gazeChoreographyDensityPer1000`, `longestGazeChoreographyRun`이며, `plain`, `balanced`, `lyrical`, `webnovel-fast` mode별 기본 허용치를 분리했다. 단서/증거/번호/계정명/주소/사진/화면 등 구체 정보에 접지된 시선 문장은 예외로 두어, 필요한 단서 확인 장면까지 지우지 않게 했다.
- profile override도 연결했다. `max_gaze_choreography_density_per_1000`, `max_gaze_choreography_run`을 style guide, prose taste benchmark schema/template, chapter gate CLI, benchmark project CLI, standalone benchmark CLI에서 모두 읽는다. 필요하면 특정 장르나 작가 문체에서는 `--max-gaze-choreography-beats`, `--max-gaze-choreography-run`으로 허용치를 넓힐 수 있다.
- style fingerprint와 authorial drift metric에도 `gazeChoreographyDensityPer1000`을 넣었다. 선호/비선호 문체 샘플에서 "시선 안무 과밀"이 실제 분리 신호인지 확인할 수 있고, 작가 고유 리듬인지 독자 비선호 AI 습관인지 calibration할 수 있다.
- README, `/write`, `/write-all`, `/verify-chapter` 문서에 새 issue와 수정 방향을 추가했다. 수정 방향은 시선 자체 삭제가 아니라 반복 beat 일부를 새 단서 확인, 선택 비용, 거절의 결과, 상대 조건 변화로 바꾸는 것이다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 사용자가 직접 지적한 "문체가 거슬림" 문제를 더 세밀하게 잡는 보강이며, 장면 몰입과 독자 appeal을 해치는 생성문 특유의 시선 choreography를 줄인다. 99점 이상은 여전히 실제 한국어 선호/비선호 원고 holdout에서 이 gate가 거슬리는 시선 안무는 잡고, 문학적으로 필요한 시선/무언의 교환은 과차단하지 않는다는 독자 근거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/prose-taste-gate.test.ts`: 1 file, 86 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 1 file, 2 tests passed
  - `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 1 file, 42 tests passed
  - `npx vitest run tests/masterpiece/engagement-contracts.test.ts`: 1 file, 91 tests passed
  - `npx vitest run tests/quality/prose-taste-benchmark.test.ts`: 1 file, 33 tests passed
  - `npm run build`: passed
  - `npm test`: 65 files, 1446 tests passed
  - `git diff --check`: passed

추가 확인(2026-06-22 emotion-label carousel prose gate):

- 리서치 반영: Mar & Oatley 2008은 소설 읽기를 사회적 경험과 정서 경험의 simulation으로 설명하고, Dodell-Feder & Tamir의 메타분석은 허구 읽기가 사회 인지와 작지만 유의미하게 연결될 수 있음을 보인다. Green & Brock 및 Green & Appel의 narrative transportation 연구 흐름도 독자의 주의, 정서, 심상이 서사 사건에 결속될 때 몰입이 강해진다고 본다. 따라서 문체 gate는 감정 단어 자체를 금지하기보다, 감정 단어가 장면의 선택·행동·관계 변화·결과로 이어지는지 봐야 한다. 참고: [Mar & Oatley 2008](https://www.yorku.ca/mar/Mar%20%26%20Oatley_Function%20of%20Fiction_final%20version.pdf), [Dodell-Feder & Tamir](https://psnlab.princeton.edu/document/226), [Green & Brock 2000](https://www.communicationcache.com/uploads/1/0/8/8/10887248/the_role_of_transportation_in_the_persuasiveness_of_public_narratives.pdf), [Green & Appel 2024](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf).
- blind spot: 기존 `flat-emotion-label`은 원고 전체의 감정명 밀도를 봤지만, 긴 원고에서 "서연은 불안했다. 민준은 후회했다. 서연은 당황했다. 민준은 분노했다."처럼 국소적으로 감정명이 회전하는 구간은 별도로 보지 않았다. 이 패턴은 감정이 많아 보이지만 선택, 늦어진 반응, 잘못된 판단, 관계 비용, 즉각적 결과가 빠지면 독자가 감정 변화의 원인과 대가를 체험하지 못한다.
- `src/quality/prose-taste-gate.ts`에 `emotion-label-carousel` issue를 추가했다. 새 metric은 `longestEmotionLabelRun`이며, 감정 라벨 문장이 `그래서/하지만/결국/선택했다/바뀌었다` 같은 전환 없이 연속될 때 실패한다. 따옴표 대사처럼 보이는 문장과 인과 전환 표지가 있는 문장은 예외로 둬, 장르상 필요한 직접 감정 서술까지 무조건 차단하지 않게 했다.
- profile override도 연결했다. `max_emotion_label_run`을 style guide, prose taste benchmark schema/template, chapter gate CLI, benchmark project CLI, standalone benchmark CLI에서 읽고, `--max-emotion-label-run`으로 장르별 허용치를 조정할 수 있다. style fingerprint와 authorial drift metric에는 `longestEmotionLabelRun`을 넣어, 선호/비선호 문체 샘플에서 감정 라벨 run이 실제 분리 신호인지 확인할 수 있다.
- README, `/write`, `/write-all`, `/verify-chapter` 문서에 새 issue와 수정 방향을 추가했다. 수정 방향은 감정명 삭제가 아니라 감정명 일부를 선택, 늦어진 반응, 잘못된 판단, 관계 비용, 즉각적 결과로 바꾸는 것이다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 사용자가 지적한 "문체가 거슬림"을 더 작은 단위로 잡는 보강이며, 감정이 많지만 장면은 움직이지 않는 생성문 리듬을 줄인다. 99점 이상은 여전히 실제 한국어 선호/비선호 원고 holdout에서 이 gate가 거슬리는 감정 라벨 회전은 잡고, 의도적 담백체나 빠른 웹소설 감정 표지는 과차단하지 않는다는 독자/사용자 근거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/prose-taste-gate.test.ts`: 1 file, 89 tests passed
  - `npx vitest run tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 2 files, 36 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: passed, 41 prebuild test files and 745 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1450 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 sensory-wallpaper prose grounding gate):

- 리서치 반영: Green & Appel 2024는 narrative transportation을 독자의 주의, 정서, 심상이 이야기 사건에 집중되는 몰입 상태로 설명하고, 서사는 시간과 인과로 연결된 사건이어야 한다고 정리한다. JCOM 2026의 storytelling 실험 논의도 생생한 감각 디테일이 장면 상상과 참여를 돕지만, 주인공의 감정·동기와 목표/장애 맥락 안에서 작동할 때 의미가 있다고 본다. 따라서 감각 묘사는 많을수록 좋은 장식이 아니라, 독자의 mental imagery를 단서, 선택, 위험 변화, 관계 반응으로 운반해야 한다. 참고: [Green & Appel 2024](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf), [JCOM 2026 good storytelling](https://jcom.sissa.it/article/pubid/JCOM_2503_2026_A06/).
- blind spot: 기존 prose taste gate는 `over-sensory-density`로 원고 전체 감각 밀도는 보았지만, "차가운 빛이 번졌다. 비릿한 냄새가 머물렀다. 축축한 바람이 스쳤다. 희미한 그림자가 흔들렸다."처럼 국소적으로 감각 문장만 이어지는 구간을 따로 보지 않았다. 이 패턴은 문장이 예쁘게 보일 수는 있어도 단서 확인, 인물 선택, 위험 변화, 관계 반응, 즉각적 결과가 없으면 사용자가 말한 "문체가 거슬림"의 핵심인 분위기 장식 문단이 된다.
- `src/quality/prose-taste-gate.ts`에 `sensory-wallpaper-run` issue를 추가했다. 새 metric은 `longestSensoryWallpaperRun`이며, 감각 묘사 문장이 `hasCausalTurnMarker`나 `SENSORY_STORY_TURN_PATTERN` 없이 연속될 때 실패한다. 화면 번호, 문틈 단서, 문서/사진/알림, 잠금장치, 선택/확인/거절/막음 같은 장면 상태 변화가 있는 감각 문장은 예외로 둬, 좋은 sensory grounding까지 지우지 않게 했다.
- profile override도 연결했다. `max_sensory_wallpaper_run`을 style guide, prose taste benchmark schema/template, chapter gate CLI, benchmark project CLI, standalone benchmark CLI에서 모두 읽고, `--max-sensory-wallpaper-run`으로 장르별 허용치를 조정할 수 있다.
- style fingerprint와 authorial drift metric에도 `longestSensoryWallpaperRun`을 넣었다. 따라서 선호/비선호 문체 샘플에서 감각 장식 연쇄가 실제 분리 신호인지 확인할 수 있고, 특정 작가의 의도적 서정성인지 독자 비선호 AI식 분위기 장식인지 calibration할 수 있다.
- README, `/write`, `/write-all`, `/verify-chapter`, `prose-taste-benchmark.template.json`을 갱신했다. 문서의 수정 방향은 감각 묘사 삭제가 아니라 감각 일부를 새 단서 확인, 인물의 선택, 위험 변화, 관계 반응, 즉각적 결과로 바꾸는 것이다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 재미 평가 모델이 아니라 사용자가 거슬렸다고 말한 문체 문제를 더 세밀하게 차단하는 보강이다. 실전 체감은 좋아질 가능성이 높지만, 99점 이상은 실제 한국어 선호/비선호 원고 holdout에서 이 gate가 장식적 감각 연쇄는 잡고, 문학적으로 의도된 서정 묘사는 과차단하지 않는다는 독자/사용자 근거가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 3 files, 129 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 749 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1454 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 page-turn specificity / narrow curiosity gap gate):

- 리서치 반영: Loewenstein의 curiosity 정보 공백 이론은 호기심이 독자가 아는 것과 알고 싶은 것 사이의 gap에 주의가 집중될 때 생긴다고 본다. 관련 요약 연구도 정보 공백의 크기가 너무 크면 호기심이 약해지고, 더 작고 건널 수 있는 gap이 더 강한 호기심을 만든다고 정리한다. 따라서 페이지터너 질문은 "무언가 궁금하다"는 넓은 미해결 상태가 아니라, 독자가 이미 본 구체 단서 두세 개 사이의 빈칸을 좁혀야 한다. 참고: [Loewenstein 1994](https://www.cmu.edu/dietrich/sds/docs/loewenstein/PsychofCuriosity.pdf), [Curiosity and Its Influence on Children's Memory](https://par.nsf.gov/servlets/purl/10062657).
- blind spot: 기존 engagement contract는 `page-turn-question-closed`로 답을 설명/해결/정답 공개하는 질문을 막고, `page-turn-question-not-staged`로 마지막 장면에 근거가 없는 질문을 막았다. 하지만 "앱과 사건은 왜 연결되는가?"처럼 열린 질문이고 장면에도 앱/사건/연결이 보이는 경우는 통과할 수 있었다. 이 질문은 닫히지 않았지만 정보 공백이 너무 넓어 next-click 압력이 약하다.
- `src/quality/engagement-contract.ts`에 `page-turn-question-too-broad` issue를 추가했다. `page_turn_question`과 `reader_experience.page_turner_question`에서 넓은 앵커(앱, 사건, 현장, 피해자, 주인공, 단서, 증거, 기록, 연결)를 제외하고 로고, 번호, 파일, 좌표, 사진, 봉투, 수신자, 표적, 규칙, 가족, 실종 같은 구체 앵커가 두 개 미만이면 critical issue가 된다. 한국어 이름처럼 보이는 행위자 앵커도 반영해 "박도현은 왜 주인공을 표적으로 삼았는가?" 같은 특정 행위자+표적 질문을 과차단하지 않게 했다.
- revision directive도 추가했다. 실패하면 `plot_strategy` 대상으로 page_turn_question/page_turner_question을 이름+좌표, 로고+사건 번호, 표적+사물, 규칙+대가, 위치+시간처럼 좁혀진 정보 공백으로 다시 쓰라고 지시한다.
- README, `/gen-plot`, `/write`, `/write-all`, `/verify-chapter` 문서를 갱신했다. 생성 단계와 검증 단계 모두 넓은 질문 예시 "앱과 사건은 왜 연결되는가?"를 금지하고, 로고+사건 번호 같은 구체 앵커 조합을 요구한다.
- 테스트를 보강했다. evaluator는 넓은 열린 질문이 `page-turn-question-too-broad`로 실패하는지와, "앱 로고와 0717 사건 번호는 왜 같은 검은 봉투에 반복되는가?" 같은 좁은 질문이 새 issue를 내지 않는지 확인한다. 문서 계약 테스트는 plot/write/write-all/verify workflow가 새 실패 코드를 계속 안내하는지 확인한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 "재미없는 넓은 궁금증"의 false positive를 줄이는 보강이라 연재 소설의 다음 화 클릭 압력에는 직접 도움이 된다. 다만 99점 이상은 실제 한국어 장르별 holdout에서 이 gate가 넓은 질문은 잡고, 시적·문학적으로 일부러 넓게 둔 질문이나 이름 하나로 충분히 강한 질문을 과차단하지 않는다는 독자 행동/선호 evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 2 files, 259 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 752 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1457 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 manuscript ending question specificity gate):

- 리서치 반영: 정보 공백 이론은 호기심이 독자가 이미 가진 지식과 알고 싶은 지식 사이의 gap에 주의가 집중될 때 생긴다고 본다. Golman & Loewenstein의 information-gap 확장도 특정한 누락 정보 조각이 호기심을 자극한다는 관점을 전제로 한다. 따라서 회차 말미의 실제 마지막 질문은 "진실은 무엇인가" 같은 추상 미해결 상태보다, 독자가 방금 본 구체 단서 사이의 누락 정보를 가리킬 때 다음 화 클릭 압력이 강해진다. 참고: [Loewenstein 1994](https://www.cmu.edu/dietrich/sds/docs/loewenstein/PsychofCuriosity.pdf), [Golman & Loewenstein 2016](https://www.cmu.edu/dietrich/sds/docs/golman/Information-Gap%20Theory%202016.pdf), [Curiosity and Its Influence on Children's Memory](https://par.nsf.gov/servlets/purl/10062657).
- blind spot: 직전 보강은 `page_turn_question`과 `reader_experience.page_turner_question` 메타데이터를 좁혔다. 하지만 실제 원고 마지막 문장이 "하지만 이 사건의 진실은 무엇인지 알 수 없었다"처럼 넓은 질문으로 끝나면, 앞 문장에 구체 훅이 있어도 독자가 마지막으로 붙잡는 정보 공백은 다시 추상화될 수 있었다. 기존 `manuscript-ending-hook-not-staged`, `manuscript-ending-hook-closed`, `manuscript-ending-hook-reaction-not-evidenced`, `manuscript-ending-hook-setup-not-evidenced`는 이 경우를 직접 분리하지 않았다.
- `src/quality/engagement-contract.ts`에 `manuscript-ending-hook-question-too-broad` issue를 추가했다. `must_click_ending`이 마지막 구간에 있고 열린 루프도 닫히지 않았더라도, 마지막 1~2문장 안의 마지막 열린 질문이 구체 앵커를 두 개 미만으로 보존하면 critical issue가 된다. 넓은 앵커와 진실/의문/질문/이유/의미/범인/배후/정체 같은 일반 질문어는 specificity에서 제외하고, 로고, 사건 번호, 사진, 좌표, 다음 수신자, 표적, 이름, 규칙, 대가 같은 앵커를 요구한다.
- revision directive도 추가했다. 실패하면 원고 마지막 열린 질문을 로고+사건 번호, 다음 수신자+사진, 이름+좌표, 위치+시간, 명명 행위자+단서, 규칙+대가 같은 좁혀진 정보 공백으로 다시 쓰라고 지시한다.
- README, `/gen-plot`, `/write`, `/write-all`, `/verify-chapter` 문서를 갱신했다. `/gen-plot`에는 예방 기준으로, 집필/검증 문서에는 실제 원고 실패 코드로 같은 기준을 명시했다.
- 테스트를 보강했다. evaluator는 마지막 훅 사건과 주인공 반응은 있는데 마지막 문장이 "이 사건의 진실은 무엇인지"로 흐려지는 원고를 `manuscript-ending-hook-question-too-broad`로 실패시키는지 확인한다. 문서 계약 테스트는 `/gen-plot`이 이 원고 실패를 예방 항목으로 계속 안내하는지 확인한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 독자가 실제로 읽는 마지막 문장의 next-click 압력을 직접 보강하므로, 메타데이터만 좋아 보이고 원고 말미가 추상 질문으로 흐려지는 false positive를 줄인다. 99점 이상은 실제 한국어 장르별 holdout에서 이 gate가 넓은 말미 질문을 잡되, 문학적으로 의도된 여운이나 철학적 질문을 과차단하지 않는다는 독자 선호/다음 화 클릭 evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 2 files, 260 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 753 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1458 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 manuscript ending specificity holdout calibration):

- 리서치 반영: Cambridge Language and Cognition의 2026년 suspense 연구는 독자가 체감하는 suspense가 플롯 관련 질문 구조, 특히 이후 전개를 가르는 potentially inquiry-terminating questions와 강하게 연결된다고 보고한다. Klauk, Köppe, Weskott의 narrative closure 실험도 결말의 closure 감각이 텍스트의 완결성과 "남겨진 질문"에 의해 좌우된다고 본다. 따라서 말미 gate는 질문을 무조건 구체화하는 것만이 아니라, 실제 플롯 전개를 여는 구체 질문과 문학적 여운을 구분해야 한다. 참고: [Onea et al. 2026](https://www.cambridge.org/core/journals/language-and-cognition/article/linguistic-basis-of-narrative-suspense-narrative-suspense-depends-on-potentially-inquiryterminating-questions/5EE1B5222149BEC6D76B2BB4C354F67C), [Klauk et al. 2016](https://www.diegesis.uni-wuppertal.de/index.php/diegesis/article/view/215).
- blind spot: 직전 gate는 추상적인 마지막 질문을 잡는 단일 실패 케이스를 검증했다. 하지만 99점에 가까운 신뢰도를 주장하려면 "진실/범인"처럼 넓은 질문은 계속 실패시키고, 로고+번호, 행위자+표적, 규칙+대가처럼 좁은 정보 공백은 통과시키며, 명시적 질문이 아닌 문학적 여운까지 과차단하지 않는지 최소 holdout이 필요했다.
- `tests/masterpiece/engagement-contract-evaluator.test.ts`에 Korean ending holdout calibration 테스트를 추가했다. 케이스는 web-mystery broad truth question, thriller broad culprit question, modern-fantasy anchored rule-cost question, thriller anchored actor-target question, literary aftertaste without explicit open question으로 나누었다.
- 실패 기대 케이스는 `manuscript-ending-hook-question-too-broad`를 반드시 포함해야 하고, 통과 기대 케이스는 같은 issue를 포함하지 않아야 한다. 특히 마지막 케이스는 말미 훅 사건은 유지하지만 명시적 열린 질문으로 끝내지 않는 여운형 문장을 넣어, gate가 "모든 말미 여운을 추상 질문으로 오판"하지 않는지 보호한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 평가 규칙이 아니라 직전 평가 규칙의 calibration coverage 보강이다. 99점 이상으로 올리려면 이 자동 holdout을 실제 한국어 장르 원고와 독자 next-click/선호 로그로 확장해, gate가 과차단 없이 행동 지표를 개선한다는 외부 evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts`: 1 file, 169 tests passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 2 files, 261 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 754 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1459 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 next-click benchmark conflict coverage):

- 리서치 반영: 직전 manuscript ending specificity holdout과 같은 근거다. Cambridge Language and Cognition의 suspense 연구는 플롯 관련 질문 구조가 독자의 suspense rating과 연결된다고 보고하고, 정보 공백 이론은 너무 넓은 공백보다 구체적으로 주의가 모이는 공백이 호기심을 유도한다고 본다. 따라서 "다음 화를 누르게 하는 고점"으로 표시된 샘플은 원고 말미 질문이 너무 추상적인 상태와 양립해서는 안 된다. 참고: [Onea et al. 2026](https://www.cambridge.org/core/journals/language-and-cognition/article/linguistic-basis-of-narrative-suspense-narrative-suspense-depends-on-potentially-inquiryterminating-questions/5EE1B5222149BEC6D76B2BB4C354F67C), [Loewenstein 1994](https://www.cmu.edu/dietrich/sds/docs/loewenstein/PsychofCuriosity.pdf).
- blind spot: evaluator는 `manuscript-ending-hook-question-too-broad`를 잡았지만, `evaluateEngagementBenchmark`의 `next-click-compulsion` positive quality conflict 목록에는 이 이슈가 빠져 있었다. 그 결과 사람이 어떤 샘플을 next-click 고점으로 잘못 라벨링했을 때, broad ending question을 "고점 라벨과 충돌하는 원인"으로 별도 집계하지 못할 수 있었다. 기본 `templates/engagement-benchmark.template.json`의 `required_issue_codes`도 새 broad ending question 실패 유형의 known-bad 샘플 수집을 요구하지 않았다.
- `src/quality/engagement-benchmark.ts`의 `next-click-compulsion` conflict issues에 `manuscript-ending-hook-question-too-broad`와 `manuscript-ending-hook-reaction-not-evidenced`를 추가했다. 이제 known-good next-click 샘플이 넓은 말미 질문이나 반응 없는 말미 훅을 품으면 `positiveQualityConflictCount`로 분리된다.
- `templates/engagement-benchmark.template.json`의 `required_issue_codes`에 `manuscript-ending-hook-question-too-broad`를 추가했다. 기본 벤치마크 템플릿은 이제 이 실패 유형의 labeled/usable known-bad evidence를 요구하며, 없으면 gate tuning readiness가 부족하다고 남는다.
- README의 engagement benchmark 설명을 갱신했다. `next-click-compulsion`은 말미 훅 not-staged/closed/setup뿐 아니라 broad ending question, reaction missing과도 충돌하며, required issue coverage 예시에도 `manuscript-ending-hook-question-too-broad`를 포함한다고 명시했다.
- 테스트를 보강했다. `tests/quality/engagement-benchmark.test.ts`는 broad ending question 원고를 next-click 고점으로 오표기하면 `positive-quality-conflict`가 생기는지, 같은 원고를 known-bad holdout으로 라벨링하면 `manuscript-ending-hook-question-too-broad`의 usable issue coverage로 집계되는지 확인한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 새 원고 평가 규칙이 아니라 평가 규칙을 benchmark calibration과 연결하는 보강이다. 하지만 99점 이상에 필요한 "자동 gate가 실제 known-good/known-bad 샘플에서 분리력을 보인다"는 증거 체계가 더 탄탄해졌다.
- 검증 결과:
  - `npx vitest run tests/quality/engagement-benchmark.test.ts`: 1 file, 16 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts`: 4 files, 279 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 756 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1461 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 series emotional signature family normalization):

- 리서치 반영: Schmidt, Winkler, Appel, Richter의 2023년 emotional flow 연구는 이야기 수용 중 정서 반응이 narrative arc와 함께 동적으로 변하며, 구조적 단계와 감정 흐름이 독자 반응에 연결된다고 본다. Oatley, Djikic, Mullin도 문학 서사가 독자의 감정을 불러일으키고 변형한다고 정리한다. Green과 Appel의 narrative transportation 개관은 narrative engagement가 주의, 이해, 정서 반응 같은 하위 차원을 포함한다고 설명한다. 따라서 장기 연재 유지력에서는 매 회차 말미 정서가 이름만 바뀐 같은 정서군으로 반복되는지까지 봐야 한다. 참고: [Schmidt et al. 2023](https://ssol-journal.com/articles/10.61645/ssol.177), [Oatley et al. 2008](https://greatergood.berkeley.edu/images/uploads/books_emotion.pdf), [Green & Appel 2024 preprint](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf).
- blind spot: `series-retention-benchmark`는 `emotional_signature`의 최장 반복 run을 보지만 기존에는 정규화가 `trim/lowercase` 수준이었다. 그래서 `dread-shock-deferral`, `fear-surprise-delay`, `anxiety-stunned-postponement`처럼 사실상 같은 불안+충격+지연 말미를 다른 이름으로 적으면 반복 감정 패턴을 놓칠 수 있었다.
- `src/quality/series-retention-benchmark.ts`에 emotional signature family normalization을 추가했다. 보상 시그니처는 기존처럼 정확한 보상 형태 반복을 보되, 감정 시그니처는 dread, shock, curiosity, relief, grief, intimacy, triumph, anger 정서군으로 매핑한 뒤 반복 run을 계산한다.
- `tests/quality/series-retention-benchmark.test.ts`에 synonym emotional loop holdout을 추가했다. 보상 시그니처는 세 회차 모두 다르지만 말미 정서군이 같은 샘플이 `repetitive-emotional-pattern`으로 실패하고 `repeatedEmotionalSignatureRun=3`이 되는지 확인한다.
- README의 장기 연재 유지력 설명을 갱신했다. `maximum_repeated_emotional_signature_run`은 이제 문자열 반복뿐 아니라 같은 정서군 반복 말미도 잡는 기준이라고 명시했다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 실제 독자 피로를 더 잘 근사하지만, 99점 이상은 한국어 장르별 연속 회차 holdout에서 정서군 반복 검출이 이탈/다음 화 이동률 저하를 예측한다는 독자 행동 evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/series-retention-benchmark.test.ts`: 1 file, 9 tests passed
  - `npx vitest run tests/quality/series-retention-benchmark.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts tests/quality/masterpiece-readiness.test.ts tests/masterpiece/masterpiece-readiness-cli.test.ts`: 4 files, 40 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 757 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1462 tests passed

추가 확인(2026-06-22 series emotional signature family input coverage):

- 리서치 반영: 직전 series emotional signature family normalization과 같은 근거다. emotional flow 연구는 독자의 정서 반응이 이야기 진행에 따라 동적으로 변한다고 보고, narrative transportation 연구는 정서 반응을 몰입의 핵심 하위 차원으로 본다. 따라서 장기 연재 벤치마크는 회차 말미 정서가 같은 정서군으로 반복되는지를 안정적으로 기록할 수 있어야 한다. 참고: [Schmidt et al. 2023](https://ssol-journal.com/articles/10.61645/ssol.177), [Oatley et al. 2008](https://greatergood.berkeley.edu/images/uploads/books_emotion.pdf), [Green & Appel 2024 preprint](https://www.mcm.uni-wuerzburg.de/fileadmin/06110300/2024/Pdfs/Green___Appel__2024__Advances_Preprint.pdf).
- blind spot: 정서군 토큰 정규화는 영어권 라벨에는 유효하지만, 한국어 소설 프로젝트가 `불안한 보류`, `충격 후 지연`, `공포의 미해결`처럼 자유 서술형 `emotional_signature`를 쓰면 같은 dread 계열이라도 자동 토큰 매칭으로는 놓칠 수 있었다. 즉 평가 로직은 좋아졌지만, 실제 한국어 운영 입력 경로가 약하면 여전히 반복 말미를 과소검출할 수 있었다.
- `schemas/series-retention-benchmark.schema.json`, `src/cli/series-retention-benchmark-project.ts`, `src/quality/series-retention-benchmark.ts`에 명시적 `emotional_signature_family` 입력을 추가했다. 허용값은 `dread`, `shock`, `curiosity`, `relief`, `grief`, `intimacy`, `triumph`, `anger`이며, 값이 있으면 자유 텍스트보다 우선해 반복 정서군 계산과 evidence fingerprint에 반영된다.
- `templates/series-retention-benchmark.template.json`도 새 필드를 포함하도록 갱신했다. 기본 샘플은 유지력이 좋은 시퀀스에서는 dread/curiosity/relief처럼 말미 정서가 교대되고, 피로한 시퀀스에서는 dread가 반복되도록 기록한다.
- 테스트를 보강했다. API 테스트는 한국어 자유 서술 라벨이 서로 달라도 명시적 `emotionalSignatureFamily: 'dread'`가 있으면 `repetitive-emotional-pattern`과 `repeatedEmotionalSignatureRun=3`으로 잡히는지 확인한다. CLI 테스트는 raw JSON의 `emotional_signature_family`가 chapter result와 저장 리포트까지 유지되는지 확인한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 한국어 프로젝트 운영성, 재현성, evidence fingerprint 신뢰도를 올리는 보강이다. 99점 이상은 실제 한국어 장르별 연속 회차 holdout에서 이 정서군 입력이 반복 피로와 이탈/다음 화 이동률 저하를 예측한다는 독자 행동 evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/series-retention-benchmark.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts`: 2 files, 12 tests passed
  - `npm run validate:schemas`: passed
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 758 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1463 tests passed

추가 확인(2026-06-22 series emotional palette concentration gate):

- 리서치 반영: Schmidt et al.의 emotional flow 연구는 이야기 수용 중 감정 반응이 narrative arc와 함께 변하며, 변화하는 감정 내용이 독자의 주의를 이끈다고 본다. 반복 suspense 노출 연구도 repeated exposure가 affective habituation 또는 desensitization으로 이어질 수 있다고 보고한다. 따라서 장기 연재에서는 같은 정서가 연속 반복되는지만 볼 것이 아니라, 회차 말미 정서 팔레트 전체가 한 정서군에 과도하게 쏠리는지도 봐야 한다. 참고: [Schmidt et al. 2023](https://ssol-journal.com/articles/10.61645/ssol.177), [Re-Living Suspense 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7644968/), [Oatley et al. 2008](https://greatergood.berkeley.edu/images/uploads/books_emotion.pdf).
- blind spot: 기존 `maximum_repeated_emotional_signature_run`은 최장 연속 반복만 잡았다. 그래서 dread, curiosity, dread, dread처럼 최장 run은 2라 기준을 통과하지만, 전체 4회 중 3회가 dread 계열로 끝나는 시퀀스는 장기 독자에게 계속 같은 불안/압박 기후를 줄 수 있었다. 보상 모양과 회차 말미 이름을 바꿔도 정서 경험은 좁은 팔레트에 머무르는 false positive다.
- `src/quality/series-retention-benchmark.ts`에 `maximumDominantEmotionalSignatureFamilyShare` 기준과 `narrow-emotional-palette` failure type을 추가했다. 기본값은 0.67이며, 명시적 `emotionalSignatureFamily` 또는 영어 토큰 정규화로 식별된 정서군 중 가장 많이 등장한 family의 회차 점유율이 기준을 넘으면 실패한다.
- `src/cli/series-retention-benchmark-project.ts`, `src/cli/run-series-retention-benchmark.ts`, `schemas/series-retention-benchmark.schema.json`, `templates/series-retention-benchmark.template.json`에 `maximum_dominant_emotional_signature_family_share` 입력/출력/CLI 인자를 연결했다. CLI는 `--maximum-dominant-emotional-signature-family-share`로 조정할 수 있다.
- `src/cli/apply-chapter-gate.ts`도 새 실패 유형을 hard block 대상으로 반영했다. evidence가 충분하고 최신 회차가 포함된 series-retention report에서 `narrow-emotional-palette`가 나오면 Ralph Loop 완료를 `RETRY`로 돌리고, `series-retention-emotional-flow` 퇴고 지시를 생성한다.
- 테스트를 보강했다. API 테스트는 최장 감정 반복 run이 2라 기존 반복 규칙은 통과하지만, dread family share가 0.75라 `narrow-emotional-palette`로 실패하는 holdout을 추가했다. CLI 테스트는 JSON/CLI threshold가 리포트에 보존되고 피로 샘플이 `narrowEmotionalPaletteCount=1`로 집계되는지 확인한다. chapter gate 테스트도 기존 series-retention hard block 경로가 새 타입 추가 후 계속 통과하는지 포함해 실행했다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 변경은 장기 연재의 정서 피로 false positive를 더 세밀하게 줄인다. 다만 99점 이상은 한국어 장르별 실제 연속 회차 holdout에서 정서군 쏠림이 완독/다음 화 이동률 저하와 상관된다는 독자 행동 evidence, 그리고 장르별로 의도된 claustrophobic dread 시퀀스를 과차단하지 않는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/series-retention-benchmark.test.ts tests/masterpiece/series-retention-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 55 tests passed
  - `npm run validate:schemas`: passed
  - `npx tsc --noEmit`: passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 759 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1464 tests passed

추가 확인(2026-06-22 dominant sentence-ending cadence gate):

- 리서치 반영: 산문 리듬 연구/교육 자료는 반복되는 같은 길이·구조의 문장이 단조로움을 만들고, 문장 다양성이 독자의 가독성과 지속 읽기에 영향을 준다고 본다. 한국어 문체법 자료는 문장 종결법이 종결어미로 실현된다고 설명하며, 한국어 소설 번역 연구도 문장종결어미가 내러티브 화자의 구어성, 리듬, 의미 전달과 연결된다고 본다. 따라서 사용자가 "문체가 거슬린다"고 느끼는 문제는 단순 금지어뿐 아니라 문장 끝 박자의 쏠림으로도 계량해야 한다. 참고: [SJSU Sentence Variety and Rhythm](https://www.sjsu.edu/writingcenter/docs/handouts/Sentence%20Variety%20and%20Rhythm.pdf), [한국민족문화대백과사전 문체법](https://encykorea.aks.ac.kr/Article/E0019698), [Cho & Cho 2013](https://journal.kci.go.kr/kats/archive/articleView?artiId=ART001805146), [권은희·성초림 2014](https://doi.org/10.15749/jts.2014.15.2.001).
- blind spot: 기존 `same-ending-run`은 같은 종결 계열이 연속으로 길게 반복될 때만 잡았다. 그래서 `었다, 었다, 했다, 었다, 었다, 다, 었다, 었다`처럼 최장 run은 2문장이라 통과하지만 전체 8문장 중 6문장이 같은 과거 평서 계열로 끝나는 문단은 여전히 AI식 보고체 리듬처럼 느껴질 수 있었다.
- `src/quality/prose-taste-gate.ts`에 `dominant-ending-cadence-lock` issue와 `maxDominantSentenceEndingShare` 기준을 추가했다. 기본 balanced 기준은 0.72이며, 대화문을 제외한 eligible 서술문 6개 이상에서 한 종결 계열의 점유율이 기준을 넘으면 실패한다. 결과 metric에는 `dominantSentenceEndingShare`, `dominantSentenceEndingCount`, `sentenceEndingCadenceSampleSize`가 남는다.
- `src/quality/prose-taste-benchmark.ts`의 style fingerprint와 authorial style drift metric에도 새 숫자 지표를 추가했다. 선호/비선호 문체 샘플에서 종결 지배율 차이가 실제 문체 지문 분리 근거로 남는다.
- `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `schemas/prose-taste-benchmark.schema.json`, `templates/prose-taste-benchmark.template.json`, `schemas/style-guide.schema.json`, `templates/style-guide.template.json`, `src/cli/apply-chapter-gate.ts`에 `max_dominant_sentence_ending_share`와 CLI `--max-dominant-ending-share`를 연결했다. 따라서 benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 최장 same-ending run이 2라 기존 규칙은 통과하지만 dominant ending share가 0.75라 `dominant-ending-cadence-lock`으로 실패하는 샘플을 추가했고, profile override로 0.8까지 완화하면 통과하는지도 확인한다. chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 사용자가 직접 지적한 문체 거슬림에 대한 탐지 범위는 더 촘촘해졌지만, 99점 이상은 실제 사용자/장르 독자 holdout에서 종결 지배율이 "거슬림" 라벨 또는 이탈과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 2 files, 96 tests passed
  - `npm run validate:schemas`: passed
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 177 tests passed
  - `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 1 file, 43 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 762 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1467 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 dialogue ending cadence gate):

- 리서치 반영: 한국어 소설 대화의 종결어미는 단순 문장 끝 장식이 아니라 인물 관계, 사회적 거리, 심리, 구어성, 문체 효과를 드러내는 핵심 단서다. 원은하·김성희·전주영(2021)은 한국어 종결어미가 서법과 상대높임법에 따라 세분되어 있어 인물 관계와 대화 상황 해석이 중요하다고 설명한다. 권은희·성초림(2014)은 소설 대화가 등장인물의 정체성과 줄거리 이해에 기여하며, 한국어 문장종결어미가 맥락정보와 화자 의도를 드러낸다고 본다. 창작 실무 자료도 인물마다 어휘와 리듬이 달라야 한다고 강조한다. 참고: [원은하·김성희·전주영 2021](https://journal.kci.go.kr/kats/archive/articlePdf?artiId=ART002700665), [권은희·성초림 2014](https://journal.kci.go.kr/kats/archive/articlePdf?artiId=ART001887605), [Center for Fiction dialogue tips](https://centerforfiction.org/writing-tools/tips-for-writing-dialogue/), [The Implicit I](https://aaww.org/the-implicit-i-contesting-ambiguity-in-korean-literature/).
- blind spot: 직전 `dominant-ending-cadence-lock`은 대화문을 제외한 서술문 종결 리듬만 본다. 따라서 대화 사이에 행동 beat가 충분히 있고 talking-head도 아니지만, 여섯 대사 중 다섯 대사가 모두 `거야` 같은 말끝 공식으로 닫히는 경우는 통과할 수 있었다. 이 상태는 인물별 목적과 관계가 달라도 대사가 같은 입에서 나온 것처럼 들리는 false negative다.
- `src/quality/prose-taste-gate.ts`에 `dialogue-ending-cadence-lock` issue와 `maxDominantDialogueEndingShare` 기준을 추가했다. 기본 balanced 기준은 0.82이며, dialogue turn 6개 이상에서 같은 말끝 공식이 기준을 넘으면 실패한다. 결과 metric에는 `dominantDialogueEndingShare`, `dominantDialogueEndingCount`, `dialogueEndingCadenceSampleSize`가 남는다.
- `src/quality/prose-taste-benchmark.ts`의 style fingerprint와 authorial style drift metric에 새 대화 말끝 지표를 추가했다. 선호/비선호 문체 샘플에서 대화 말끝 지배율 차이가 실제 문체 지문 분리 근거로 남는다.
- `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `schemas/prose-taste-benchmark.schema.json`, `templates/prose-taste-benchmark.template.json`, `schemas/style-guide.schema.json`, `templates/style-guide.template.json`, `src/cli/apply-chapter-gate.ts`에 `max_dominant_dialogue_ending_share`와 CLI `--max-dominant-dialogue-ending-share`를 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 대사 사이 행동 beat가 있어 talking-head는 아니지만 5/6턴이 `거야`로 끝나는 샘플을 `dialogue-ending-cadence-lock`으로 실패시키고, profile override 0.9에서는 통과하는지 확인한다. chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 사용자가 지적한 문체 거슬림 중 "인물 대사가 다 비슷하게 들리는 문제"를 더 직접적으로 막지만, 99점 이상은 한국어 장르별 실제 독자 holdout에서 대화 말끝 지배율이 인물 음성 구분 실패, 몰입 저하, 이탈과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 142 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 180 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 765 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1470 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 dialogue starter cadence gate):

- 리서치 반영: 대화는 정보 전달만이 아니라 인물화, 장면 전진, 전술 변화, 서브텍스트를 함께 수행해야 한다. Center for Fiction의 dialogue craft 자료는 인물마다 vocabulary와 rhythm이 달라야 하며, 대화 중 전술도 바뀌어야 한다고 설명한다. Career Authors도 인물 음성 구분을 sentence length, exchange pattern, vocabulary, thought process, silence까지 포함한 패턴 문제로 본다. 한국어 담화표지 연구는 turn-initial particle이 기대된 다음 행동에서의 이탈, 화자의 epistemic stance, sequence organization을 관리한다고 설명한다. 따라서 한국어 소설 대화 첫머리의 `아니`, `그럼`, `그러니까`, `하지만`, `근데` 반복은 단순 어휘 반복이 아니라 인물별 입장과 전술이 한 박자로 잠기는 신호가 될 수 있다. 참고: [Center for Fiction dialogue tips](https://centerforfiction.org/writing-tools/tips-for-writing-dialogue/), [Career Authors distinctive dialogue](https://careerauthors.com/making-your-characters-sound-distinctive/), [Kim et al. 2021 / Korean discourse particle kulssey](https://www.researchgate.net/publication/352799932_The_Korean_discourse_particle_kulssey_across_discrete_positions_and_contexts_in_talk-in-interaction).
- blind spot: 직전 `dialogue-ending-cadence-lock`은 대화 말끝 공식만 본다. 그래서 대화 사이 행동 beat가 충분하고 말끝도 다양하지만, 여섯 대사 중 네 대사가 모두 `아니,`로 시작하는 경우는 통과할 수 있었다. 이런 원고는 대화가 접지되어 있어도 인물들이 서로 다른 목적·계산·방어 전술로 말한다기보다 같은 반박 버튼을 누르는 것처럼 들리는 false negative다.
- `src/quality/prose-taste-gate.ts`에 `dialogue-starter-cadence-lock` issue와 `maxDominantDialogueStarterShare` 기준을 추가했다. 기본값은 plain 0.58, balanced 0.62, lyrical 0.68, webnovel-fast 0.70이다. dialogue turn 6개 이상, dominant starter 4회 이상, dominant share가 기준 초과일 때 실패한다. 결과 metric에는 `dominantDialogueStarterShare`, `dominantDialogueStarterCount`, `dialogueStarterCadenceSampleSize`가 남는다.
- classifier는 `아니|그럼|그러면|그러니까|그래도|하지만|근데|그런데|그래서|잠깐|있잖아|그게|사실|솔직히|일단` 같은 제한된 담화표지만 본다. `내가`, `너는`, `왜` 같은 일반 내용어/문법어는 제외해 false positive를 줄였다.
- `src/quality/prose-taste-benchmark.ts`의 style fingerprint와 authorial style drift metric에도 새 대화 말머리 지표를 추가했다. 선호/비선호 문체 샘플에서 대화 진입점의 상투성이 실제 문체 지문 분리 근거로 남는다.
- `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `schemas/prose-taste-benchmark.schema.json`, `templates/prose-taste-benchmark.template.json`, `schemas/style-guide.schema.json`, `templates/style-guide.template.json`, `src/cli/apply-chapter-gate.ts`에 `max_dominant_dialogue_starter_share`와 CLI `--max-dominant-dialogue-starter-share`를 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 대사 사이 행동 beat가 있고 말끝도 다양하지만 4/6턴이 `아니,`로 시작하는 샘플을 `dialogue-starter-cadence-lock`으로 실패시키고, profile override 0.8에서는 통과하는지 확인한다. benchmark CLI 테스트는 style-guide 기본 profile과 CLI override가 새 필드를 보존하는지 확인한다. chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 사용자가 거슬렸다고 한 문체 중 “대화가 같은 패턴으로 입을 여는 문제”를 더 직접적으로 막지만, 99점 이상은 한국어 장르별 실제 독자 holdout에서 대화 말머리 지배율이 인물 음성 구분 실패, 몰입 저하, 이탈과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 145 tests passed
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 183 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 768 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1473 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 dialogue question cascade gate):

- 근거 리서치: The Novelry는 각 인물이 자기 agenda를 들고 대화에 들어와야 하며 ping-pong식 왕복은 예측 가능하고 지루해진다고 정리한다. 질문 일부를 무시하거나 자기 목적을 밀어 넣는 방식으로 왕복을 깨야 한다는 설명도 확인했다. 참고: https://www.thenovelry.com/blog/writing-dialogue
- The Cincinnati Review는 좋은 대화가 플롯을 전진시키고 관계와 말하지 못하는 것을 드러내야 하며, 불필요한 대화는 잘라야 한다고 설명한다. 질문이 이어져도 새 정보, 관계 상태, 행동 변화가 남지 않으면 이 기준을 충족하지 못한다. 참고: https://www.cincinnatireview.com/submission-trends/common-mistakes-when-writing-dialogue-and-how-to-avoid-them/
- One Writer's Journey는 대화가 실제처럼 들려야 하지만 실제 대화의 질문-답변 테니스처럼 쓰면 안 된다고 지적한다. 질문에 질문이나 다른 화제로 반응하는 식의 비대칭이 자연스럽고, 장면을 전진시키지 않으면 잘라야 한다는 기준을 확인했다. 참고: https://suebe.wordpress.com/2024/05/08/dialogue-is-not-a-tennis-match/
- Linden Gross는 대화를 highlight reel이자 scene/event로 보며, 인물들이 반대 방향으로 당기고 있다는 느낌을 만들어야 한다고 설명한다. 따라서 질문만 이어지는 대화는 전술 충돌과 상태 변화를 약화시키는 false negative다. 참고: https://lindengross.com/2022/03/31/writing-dialogue-to-advance-plot-character/
- blind spot: 기존 게이트는 장문 독백, talking-head, rote reply, mechanical tag, silence stall, dialogue ending/starter cadence를 잡지만, 행동 beat가 충분하고 말끝/말머리도 다양하면서 대사 내용은 5턴 연속 질문인 장면은 통과할 수 있었다. 이 경우 장면은 접지되어 있어도 답변, 회피, 조건 제시, 물증 공개, 선택 비용이 남지 않아 Q&A/심문 기록처럼 읽힌다.
- `src/quality/prose-taste-gate.ts`에 `dialogue-question-cascade` issue를 추가했다. 새 metric은 `dialogueQuestionTurnCount`, `dialogueQuestionRatio`, `longestDialogueQuestionRun`이다. 기본값은 plain 0.58/3턴, balanced 0.66/4턴, lyrical 0.70/4턴, webnovel-fast 0.72/5턴이다. dialogue turn 6개 이상에서 의문형 대사 5개 이상이며 비율 초과, 또는 연속 의문형 턴 초과일 때 실패한다.
- 퇴고 directive는 질문을 무조건 줄이라는 지시가 아니라, 질문 일부를 답변, 회피, 물증 제시, 조건/거래, 행동 선택, 관계 비용으로 바꾸도록 한다. 심문/재판/취조 장면은 `max_dialogue_question_ratio`, `max_dialogue_question_run` 또는 CLI의 `--max-dialogue-question-ratio`, `--max-dialogue-question-run`으로 완화할 수 있다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 행동 beat가 있어 talking-head는 아니지만 5/6턴이 질문인 샘플을 `dialogue-question-cascade`로 실패시키고, profile override 0.9/6턴에서는 통과하는지 확인한다. CLI 테스트는 style-guide/command-line profile 병합을 확인하고, chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 대화의 문체적 false negative는 더 줄었지만, 99점 이상은 실제 한국어 장르 독자 holdout에서 질문 연쇄 탐지가 선호/비선호 문체를 과적합 없이 가르는지 확인해야 한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 148 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 186 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 771 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1476 tests passed

추가 확인(2026-06-22 dialogue vocative cadence gate):

- 근거 리서치: K.M. Weiland는 direct address가 보통 대화 시작, 주의 환기, 강조에 쓰이며 과하면 가장 거슬리는 대화 습관 중 하나가 된다고 설명한다. Lisa Poisso도 등장인물이 서로의 이름을 자주 부르면 독자가 이야기 밖에서 책을 읽고 있다는 감각을 받으며, 실제 대화에서는 서로의 이름을 자주 쓰지 않는다고 지적한다. In the Margins Editing 역시 이름 반복은 큰 집단에서 수신자를 명확히 해야 하는 경우 등을 제외하면 드물게 목적을 갖고 써야 한다고 정리한다. 참고: [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/dont-overuse-names-in-dialogue/), [Lisa Poisso](https://www.lisapoisso.com/2018/09/18/overusing-character-names/), [In the Margins](https://editsinthemargins.com/post/dont-overuse-character-names-in-dialogue/).
- blind spot: 기존 게이트는 대화 말끝, 말머리 담화표지, 의문형 연쇄, talking-head, 장문 독백, rote reply, mechanical tag를 잡지만, `서연아,` `민준 씨,`처럼 매 턴 수신자를 직접 부르는 장면은 통과할 수 있었다. 대사 사이 행동 beat가 있고 질문/말끝/말머리도 다양해도, 호명만 반복되면 인물이 실제로 대화한다기보다 독자에게 speaker target을 계속 라벨링하는 인공적 박자가 생긴다.
- `src/quality/prose-taste-gate.ts`에 `dialogue-vocative-cadence-lock` issue를 추가했다. 새 metric은 `dialogueVocativeTurnCount`, `dialogueVocativeRatio`, `longestDialogueVocativeRun`이다. 기본값은 plain 0.42/2턴, balanced 0.50/3턴, lyrical 0.55/3턴, webnovel-fast 0.58/4턴이다. dialogue turn 6개 이상에서 호명형 대사 4개 이상이며 비율 초과, 또는 연속 호명형 턴 초과일 때 실패한다.
- classifier는 대사 첫머리의 `이름+아/야`, `이름+씨/님/형/누나/언니/오빠/선배/후배/팀장/대표/작가/검사/형사/박사/교수/사장`, 그리고 `팀장님/선생님/대표님` 같은 짧은 호칭만 잡는다. 대사 중간의 자연스러운 호명이나 장면 시작의 단발 호명은 비율/연속 threshold를 넘지 않으면 통과한다.
- 퇴고 directive는 이름 호명을 금지하지 않고, 일부 호명을 시선, 행동, 상대 반응, 물건의 위치로 바꿔 수신자를 드러내도록 한다. 의례적 호명, 법정/군대식 호칭, 신분 질서가 핵심인 장면은 `max_dialogue_vocative_ratio`, `max_dialogue_vocative_run` 또는 CLI의 `--max-dialogue-vocative-ratio`, `--max-dialogue-vocative-run`으로 완화할 수 있다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 행동 beat가 있어 talking-head는 아니지만 5/6턴이 이름·호칭으로 시작하는 샘플을 `dialogue-vocative-cadence-lock`으로 실패시키고, profile override 0.9/6턴에서는 통과하는지 확인한다. CLI 테스트는 style-guide/command-line profile 병합을 확인하고, chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 사용자가 지적한 “문체가 거슬림” 중 대화가 인공적으로 들리는 false negative를 하나 더 줄였지만, 99점 이상은 실제 한국어 장르 독자 holdout에서 호명 반복 지표가 몰입 저하, 인물 음성 불신, 이탈과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 151 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 189 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 774 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1479 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 dialogue lexical echo gate):

- 근거 리서치: Between the Lines Editorial은 echo words를 가까운 거리에서 반복되어 독자를 이야기 밖으로 밀어낼 수 있는 단어/구 반복으로 설명하고, 반복을 줄여도 설정·정서·목표를 잃지 않을 수 있다고 정리한다. Helping Writers Become Authors는 반복 대화가 독자에게 이미 아는 정보를 다시 들려주거나 장면을 낡게 만들 수 있으며, 같은 설명을 word-for-word로 반복하지 말라고 지적한다. The Editor's Blog도 반복이 의도적이면 강력하지만, 같은 단어·정보·문장구조가 반복되면 독자를 짜증나게 하고 “새로운 것이 없다”는 신호가 된다고 설명한다. Novlr는 반복을 무조건 피하는 것보다 명료성이 중요하지만, 단순 동의어 치환이 아니라 문장과 리듬을 다시 짜야 한다고 본다. 참고: [Between the Lines Editorial](https://btleditorial.com/2024/04/30/how-to-limit-echo-words-in-your-novel/), [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/repetitive-dialogue/), [The Editor's Blog](https://theeditorsblog.net/2010/07/05/the-power-of-repetition/), [Novlr](https://www.novlr.org/the-reading-room/why-its-ok-to-use-repetition-in-your-writing-2/).
- blind spot: 기존 게이트는 대화 말끝, 말머리, 의문형, 호명, talking-head, 장문 독백, rote reply, mechanical tag를 잡지만, 대사 사이 행동 beat가 충분하고 말끝/말머리/질문/호명도 다양하면서 각 턴이 `봉투`, `기록`, `증거` 같은 같은 핵심어를 계속 되받는 장면은 통과할 수 있었다. 이런 원고는 장면이 접지되어 있어도 인물이 서로 다른 목적과 전술로 부딪힌다기보다 같은 키워드를 반복 설명하는 scripted Q&A처럼 들린다.
- `src/quality/prose-taste-gate.ts`에 `dialogue-lexical-echo-chain` issue를 추가했다. 새 metric은 `dialogueLexicalEchoTurnCount`, `dialogueLexicalEchoRatio`, `longestDialogueLexicalEchoRun`이다. 기본값은 plain 0.48/3턴, balanced 0.56/4턴, lyrical 0.62/4턴, webnovel-fast 0.64/5턴이다. dialogue turn 6개 이상에서 직전 대사의 실질어를 되받는 턴이 4개 이상이며 비율 초과, 또는 연속 echo run 초과일 때 실패한다.
- detector는 따옴표 대화에서 한국어/영문 토큰을 뽑고 조사·기능어·상투 응답·대명사·일반 담화표지를 제외한 뒤 직전 대화 턴과 공유되는 실질어만 본다. 따라서 `그거`, `정말`, `그래`, `있어` 같은 흔한 말은 경고를 만들지 않고, `봉투`처럼 장면 핵심어가 지나치게 가까운 턴마다 반복될 때만 잡는다.
- 퇴고 directive는 핵심어 반복을 무조건 금지하지 않고, 일부 반복을 인물별 목적, 회피, 대명사, 행동 비트, 새 단서, 관계 비용으로 바꾸도록 한다. 같은 단서물이나 주문, 법정 증거처럼 반복 대상이 장면 핵심인 경우는 `max_dialogue_lexical_echo_ratio`, `max_dialogue_lexical_echo_run` 또는 CLI의 `--max-dialogue-lexical-echo-ratio`, `--max-dialogue-lexical-echo-run`으로 완화할 수 있다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 행동 beat가 있어 talking-head는 아니지만 4/6턴이 직전 대사의 `봉투`를 되받고 최장 5턴 echo chain이 생기는 샘플을 `dialogue-lexical-echo-chain`으로 실패시키고, profile override 0.9/6턴에서는 통과하는지 확인한다. CLI 테스트는 style-guide/command-line profile 병합을 확인하고, chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 사용자가 지적한 “문체가 거슬림” 중 대화가 같은 핵심어를 되풀이하며 설명문처럼 들리는 false negative를 줄였지만, 99점 이상은 실제 한국어 장르 독자 holdout에서 lexical echo 지표가 몰입 저하, 인물 음성 불신, 이탈과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 154 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 192 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 777 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1482 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 dialogue paraphrase confirmation gate):

- 근거 리서치: Helping Writers Become Authors는 on-the-nose dialogue를 대사가 말 그대로의 의미만 말해 subtext를 잃는 문제로 설명하고, 독자가 더 풍부한 저류를 원한다고 지적한다. My Story Doctor는 on-the-nose dialogue가 독자가 상황을 알아낼 능력을 과소평가할 때 생기며, 독자가 이미 이해할 수 있는 내용을 반복해서 설명하지 말라고 조언한다. Writers Digest는 subtext와 dramatic tension이 장면의 표면 대화 아래의 욕망·갈등을 만들 때 작동한다고 본다. Gotham Writers Workshop도 subtext를 대사 밑의 의미로 설명하며, 직접 말하지 않는 의미가 오해·긴장·깊이를 만든다고 정리한다. 참고: [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/on-the-nose-dialogue/), [My Story Doctor](https://mystorydoctor.com/eliminating-on-the-nose-dialoge/), [Writer's Digest](https://www.writersdigest.com/write-better-fiction/how-to-use-subtext-and-the-art-of-dramatic-tension-in-fiction), [Gotham Writers Workshop](https://www.writingclasses.com/toolbox/ask-writer/in-dialogue-what-is-subtext).
- blind spot: 기존 게이트는 설명 대사, 질문 cascade, 말머리 지배, 핵심어 echo를 잡지만, 대사 사이 행동 beat가 충분하고 질문·호명·핵심어 반복도 심하지 않으면서 각 턴이 `그러니까`, `즉`, `다시 말해서`, `결국`, `그 말은`으로 앞 정보를 재정리하는 장면은 통과할 수 있었다. 이런 원고는 독자에게 필요한 정보를 주지만 인물이 서로 다른 욕망과 두려움을 숨기고 부딪히는 대화가 아니라 회의록식 확인 대화처럼 읽힌다.
- `src/quality/prose-taste-gate.ts`에 `dialogue-paraphrase-confirmation-chain` issue를 추가했다. 새 metric은 `dialogueParaphraseConfirmationTurnCount`, `dialogueParaphraseConfirmationRatio`, `longestDialogueParaphraseConfirmationRun`이다. 기본값은 plain 0.38/2턴, balanced 0.46/3턴, lyrical 0.52/4턴, webnovel-fast 0.56/4턴이다. dialogue turn 6개 이상에서 재진술 확인 턴이 4개 이상이며 비율 초과, 또는 연속 run 초과일 때 실패한다.
- detector는 따옴표 대화에서 `그러니까`, `즉`, `다시 말해서`, `바꿔 말하면`, `결국`, `요컨대`, `한마디로`, `네 말은`, `그 말은` 같은 재진술 표지가 있고, `라는 거야/뜻이네/말이지/소리야/셈이네` 같은 확인형 종결이 붙은 턴을 센다. 단순한 담화표지 한 번이 아니라 재진술 표지와 확인 종결이 결합된 턴을 장면 단위로 보므로 절차·수사 장면의 정상 확인 질문을 과도하게 막지 않는다.
- 퇴고 directive는 확인 대사를 무조건 금지하지 않고, 일부를 즉답, 오해, 회피, 조건 제시, 반박, 물증 조작, 관계 비용으로 바꾸도록 한다. 수사·법정·브리핑 장면처럼 절차적 확인이 핵심인 경우는 `max_dialogue_paraphrase_confirmation_ratio`, `max_dialogue_paraphrase_confirmation_run` 또는 CLI의 `--max-dialogue-paraphrase-confirmation-ratio`, `--max-dialogue-paraphrase-confirmation-run`으로 완화할 수 있다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 행동 beat가 있어 talking-head는 아니지만 5/6턴이 재진술 확인 공식으로 이어지는 샘플을 `dialogue-paraphrase-confirmation-chain`으로 실패시키고, profile override 0.9/6턴에서는 통과하는지 확인한다. CLI 테스트는 style-guide/command-line profile 병합을 확인하고, chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 사용자가 지적한 “문체가 거슬림” 중 대사가 정보 정리와 확인문으로 굳는 false negative를 줄였지만, 99점 이상은 실제 한국어 장르 독자 holdout에서 paraphrase-confirmation 지표가 몰입 저하, 인물 음성 불신, 이탈과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts`: 1 file, 106 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 2 files, 51 tests passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 195 tests passed
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 780 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1485 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 POV mind-hop gate):

- 근거 리서치: Writer's Digest는 제한시점/근접시점에서 한 장면의 카메라가 누구에게 붙어 있는지 독자가 알아야 하며, 시점 전환은 명확해야 한다고 정리한다. Jane Friedman은 head hopping이 항상 금지는 아니지만 작가가 독자를 의식적으로 제어하지 못하면 혼란과 몰입 저하를 만든다고 설명한다. Anne R. Allen은 한 문단/장면 안에서 여러 인물의 내면으로 튀는 문제를 초보 원고의 대표적 POV 오류로 다룬다. ProofreadingPal도 새 작가의 흔한 실수로 head hopping을 꼽고, 한 장면 안에서 인물의 생각을 무분별하게 오가면 독자가 누구의 경험을 따라가야 하는지 잃는다고 설명한다. 참고: [Writer's Digest](https://www.writersdigest.com/be-inspired/managing-point-of-view-mythbusting), [Jane Friedman](https://janefriedman.com/how-big-of-a-problem-is-head-hopping/), [Anne R. Allen](https://annerallen.com/2024/06/point-of-view-avoid-head-hopping/), [ProofreadingPal](https://proofreadingpal.com/proofreading-pulse/writing-guides/headhopping-new-fiction-writers-mistakes/).
- blind spot: 기존 `detached-camera-description`은 장면이 인물 감각에 붙지 않는 문제를 보고, `manuscript-pov-focalization-not-evidenced`는 사건과 POV 앵커의 결속을 본다. 그러나 같은 문단 안에서 `서연은 생각했다`, `민준은 확신했다`, `도현은 느꼈다`처럼 서로 다른 인물의 사적 생각/감정/판단을 직접 열어도 별도 결함으로 안정적으로 잡지 못했다. 사용자가 말한 “문체가 거슬림”에는 이런 시점 중심의 흔들림도 포함될 수 있다.
- `src/quality/prose-taste-gate.ts`에 `pov-mind-hop-chain` issue를 추가했다. 새 metric은 `povMindJumpParagraphDensityPer1000`, `povMindJumpParagraphCount`, `longestPovMindJumpRun`이다. 기본값은 plain 1.2/1문단, balanced 1.6/1문단, lyrical 2.4/2문단, webnovel-fast 2.2/2문단이다. 같은 문단에서 서로 다른 named subject가 private-state verb와 결합해 2개 이상 발견되고 밀도나 연속 run이 threshold를 넘으면 실패한다.
- detector는 따옴표 대화를 제외한 문단에서 `생각했다`, `느꼈다`, `깨달았다`, `확신했다`, `믿었다`, `두려워했다`, `후회했다`, `결심했다` 같은 내면/판단 동사를 찾는다. 이름/역할 주체를 우선하고 `그/그녀` 같은 대명사는 문단 안에 named subject가 없을 때만 세어, 같은 인물을 이름과 대명사로 번갈아 부르는 정상 문단을 과하게 잡지 않도록 했다.
- 퇴고 directive는 전지적 시점을 금지하지 않는다. 장면의 POV 중심 인물을 하나로 고정하고, 다른 인물의 속마음은 대사, 행동, 지연, 오해, 사물 조작, 이후 POV 전환 장면으로 드러내도록 한다. 전지적·군상극 문체는 `max_pov_mind_jump_density_per_1000`, `max_pov_mind_jump_run` 또는 CLI의 `--max-pov-mind-jumps`, `--max-pov-mind-jump-run`으로 완화할 수 있다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 한 문단 안에서 서로 다른 인물의 사적 내면을 여는 샘플을 `pov-mind-hop-chain`으로 실패시키고, 문단 분리로 POV 접근을 나누면 통과하며, profile override 100/10에서는 통과하는지 확인한다. CLI 테스트는 style-guide/command-line profile 병합을 확인하고, chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 문체 취향 게이트가 이제 “인물 내면 카메라가 문단 안에서 튀는 문제”까지 막기 때문에 대작형 원고 안전성은 올라갔다. 다만 99점 이상은 한국어 장르별 실제 독자 holdout에서 head-hopping 탐지가 선호/비선호 문체와 몰입 이탈을 과적합 없이 가르는지 확인해야 한다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts`: 1 file, 109 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 1 file, 2 tests passed
  - `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 1 file, 50 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 199 tests passed
  - `git diff --check`: passed (CRLF warnings only)

추가 확인(2026-06-22 thin cliffhanger ending gate):

- 근거 리서치: Rooted in Writing은 chapter ending이 다음 장으로 넘기게 해야 하지만, 마지막 장면의 변화·미스터리·감정 note·reveal 같은 목적을 가져야 한다고 정리한다. DearEditor는 모든 장이 과장된 cliffhanger일 필요는 없으며 반복적인 flashy ending은 melodrama처럼 느껴질 수 있다고 본다. Writer's Digest는 open ending과 cliffhanger를 혼동하지 말고, cliffhanger는 새 정보·도전·폭로처럼 이야기의 경로를 바꾸는 dramatic question이어야 한다고 설명한다. 참고: [Rooted in Writing](https://rootedinwriting.com/end-the-chapter/), [DearEditor](https://www.deareditor.com/2023/02/powerful-chapter-endings-that-arent-cliff-hangers/), [Writer's Digest](https://www.writersdigest.com/be-inspired/writing-mistakes-writers-make-confusing-open-endings-and-cliffhangers).
- blind spot: 기존 `generic-omniscient-teaser`는 원고 전반에서 “운명/시작/예고/아직 몰랐다” 선언을 밀도로 잡고, engagement gate는 weak cliffhanger를 구조 metadata로 본다. 그러나 실제 마지막 문단이 `그러나 두 사람은 아직 몰랐다. 진짜 비밀은 이제 시작이었다.`처럼 구체 사건 변화 없이 미해결 질문/예고문만 남기는 경우는, 전체 밀도나 engagement metadata가 좋아 보이면 통과할 수 있었다. 사용자가 말한 “문체가 거슬림”에는 이런 광고 문구형 회차 끝도 포함된다.
- `src/quality/prose-taste-gate.ts`에 `thin-cliffhanger-ending` issue를 추가했다. 새 metric은 `thinCliffhangerEndingCount`, `endingCliffhangerSignalCount`, `endingConcreteTriggerCount`이다. 기본값은 모든 mode에서 0개 허용이다. 마지막 narrative paragraph에 `아직 몰랐다`, `진짜 비밀`, `이제 시작`, `끝이 아니었다`, 미해결 물음표 같은 cliffhanger signal이 있고, 동시에 보이는 물증/장소/사물/행동 변화가 없으면 실패한다.
- detector는 마지막 문단만 본다. 원고 중간의 자연스러운 질문, 장면 안의 실제 단서 제시, 또는 `휴대폰이 울렸다. 화면에는 죽은 오빠의 번호가 떠 있었다.`처럼 concrete trigger와 action이 함께 있는 결말은 통과한다. 실험적/open ending이나 의도적 serial narrator voice는 `max_thin_cliffhanger_ending_count` 또는 CLI의 `--max-thin-cliffhanger-endings`로 완화할 수 있다.
- 퇴고 directive는 cliffhanger를 금지하지 않고, 마지막 문단에 새 물증, 보이는 위협, 인물의 선택 비용, 관계 변화, 되돌릴 수 없는 행동 중 하나를 실제 장면으로 남기도록 한다. 즉 “다음 회가 궁금한가”보다 “끝문장이 장면의 결과인가, 예고문인가”를 본다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 예고문만 있는 마지막 문단을 `thin-cliffhanger-ending`으로 실패시키고, concrete trigger가 있는 결말은 통과하며, profile override 1개 허용에서는 통과하는지 확인한다. CLI 테스트는 style-guide/command-line profile 병합을 확인하고, chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 회차 마지막 문단의 cheap suspense false negative를 줄였지만, 99점 이상은 실제 한국어 장르 독자 holdout에서 thin-cliffhanger 탐지가 이탈률·다음 회차 클릭·문체 불쾌감과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 3 files, 165 tests passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 203 tests passed
  - `git diff --check`: passed (CRLF warnings only)
  - `npm run build`: schema/template/agent/skill/team/prebuild integrity passed, 41 prebuild test files and 788 tests passed, required outputs 31 verified
  - `npm test`: 65 files, 1493 tests passed

추가 확인(2026-06-22 therapy-speak self-analysis gate):

- 사전 점검: “주인공이 관찰만 하는 장면”은 이미 `engagement-contract`에서 `manuscript-protagonist-agency-not-evidenced`, `manuscript-choice-tradeoff-not-evidenced`, `manuscript-choice-cost-lock-not-evidenced`, `manuscript-tactical-adaptation-not-evidenced`, `scene-goal-tactic-turn-not-staged` 등으로 강하게 막고 있었다. 중복 agency gate보다 남은 문체 false negative를 줄이는 편이 98점 이후 품질 개선에 더 직접적이라고 판단했다.
- 근거 리서치: Jane Friedman은 internal dialogue가 독자를 인물의 생각에 끌어들이는 강력한 도구지만, 독자가 인물 이해에 참여하게 만들 때 효과적이라고 설명한다. The Novelry는 내면 독백이 중요하지만 너무 많으면 plot이 정체되고, 인물에게 할 일과 장애물을 줘 반응하게 해야 한다고 정리한다. Helping Writers Become Authors는 감정을 직접 명명하지 말고 맥락에서 감정이 나오게 하라고 설명하며, Writers Helping Writers는 동기 설명이 독자가 추론할 기회를 빼앗고 장면 긴장을 낮춘다고 지적한다. 참고: [Jane Friedman](https://janefriedman.com/internal-dialogue/), [The Novelry](https://www.thenovelry.com/blog/interior-monologue), [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/critique-8-quick-tips-for-show-dont-tell/), [Writers Helping Writers](https://writershelpingwriters.net/2019/03/three-ways-writers-tell-not-show-and-how-you-can-fix-them/).
- blind spot: 기존 `abstract-exposition-drift`, `cognitive-filtering-overload`, `emotion-label-carousel`, `subtext-overexplanation-chain`은 넓은 설명문·감정명·속뜻 번역을 잡지만, `트라우마`, `애착`, `자존감`, `인정욕구`, `방어기제` 같은 심리 용어가 인물 행동 대신 자기분석을 맡는 AI식 문체를 별도 신호로 분리하지 못했다. 이런 원고는 장면이 상담 기록이나 캐릭터 프로필 주석처럼 읽혀 사용자가 말한 “문체가 거슬림”을 직접 유발할 수 있다.
- `src/quality/prose-taste-gate.ts`에 `therapy-speak-self-analysis` issue를 추가했다. 새 metric은 `therapySpeakDensityPer1000`, `longestTherapySpeakRun`이다. 기본값은 plain 3/2문장, balanced 4/2문장, lyrical 6/3문장, webnovel-fast 4/2문장이다. 심리 용어가 한 번 나온 문장을 금지하지 않고, 심리 용어가 2개 이상 겹치거나 심리 용어+깨달음/분석/원인 설명이 결합한 문장이 밀집/연속될 때만 실패한다.
- 퇴고 directive는 심리 용어 삭제가 아니라, 심리 용어와 자기진단을 인물이 숨기는 말, 반복해서 피하는 행동, 잘못 고르는 선택, 관계 비용, 즉각적 결과로 바꾸도록 한다. 일부 문학적/임상적 화자나 의도적 분석 문체는 `max_therapy_speak_density_per_1000`, `max_therapy_speak_run` 또는 CLI의 `--max-therapy-speak`, `--max-therapy-speak-run`으로 완화할 수 있다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 심리 용어 자기분석이 3문장 이상 이어지는 샘플을 `therapy-speak-self-analysis`로 실패시키고, 한 번 떠오른 심리 용어가 행동/물증으로 접지되는 문장은 통과하며, profile override에서는 통과하는지 확인한다. CLI 테스트는 style-guide/command-line profile 병합을 확인하고, chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 문체 취향 게이트가 이제 AI 원고에서 흔한 “상담실식 자기진단 문장”을 별도 false negative로 막아 대작형 원고 안정성은 올라갔다. 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 문체 불쾌감, 몰입 저하, 이탈과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 207 tests passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 792 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1497 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 facial expression crutch gate):

- 근거 리서치: Writers Helping Writers의 Emotion Thesaurus는 감정을 얼굴 표정과 제스처만으로 처리하면 반복적인 smile/sigh/frown 같은 crutch가 된다고 설명하고, 몸·사고·행동 전반의 반응을 함께 보라고 정리한다. DearEditor도 눈과 얼굴 묘사에 인색하라고 조언하며, prop, setting, action이 감정을 더 구체적으로 보여줄 수 있다고 본다. Springer/Psychonomic Bulletin & Review 2025 메타분석은 얼굴 표정만으로 감정이 완결되는 것이 아니라 body posture와 scene context가 얼굴 감정 지각에 유의미하게 영향을 준다고 정리한다. 참고: [Writers Helping Writers](https://writershelpingwriters.net/book/the-emotion-thesaurus/), [DearEditor](https://www.deareditor.com/2022/10/re-how-do-i-show-dont-tell-emotions/), [Springer](https://link.springer.com/article/10.3758/s13423-025-02678-6).
- blind spot: 기존 `stock-reaction-beat-chain`, `gaze-choreography-loop`, `subtext-overexplanation-chain`은 몸 반응, 시선 안무, 속뜻 번역을 잡지만, `얼굴이 굳었다`, `표정이 일그러졌다`, `미간을 찌푸렸다`, `입꼬리가 내려갔다`, `낯빛이 창백해졌다`처럼 표정 beat가 감정 엔진을 대신하는 장면은 별도 결함으로 안정적으로 분리하지 못했다. 이런 문장은 show-don't-tell처럼 보이지만 실제로는 사물 조작, 숨긴 말, 선택 비용, 상대의 조건, 장면 결과 없이 감정 표지만 바꾸는 방식이라 사용자가 말한 “문체가 거슬림”을 직접 유발할 수 있다.
- `src/quality/prose-taste-gate.ts`에 `facial-expression-crutch-chain` issue를 추가했다. 새 metric은 `facialExpressionBeatDensityPer1000`, `longestFacialExpressionBeatRun`이다. 기본값은 plain 5/2문장, balanced 6/3문장, lyrical 8/4문장, webnovel-fast 8/4문장이다. 표정 beat 밀도가 기준을 넘고 4문장 이상이거나, 연속 run이 기준을 넘으면 실패한다.
- detector는 얼굴/표정/낯빛/안색/눈빛/미간/입꼬리/입가/턱선/눈동자와 굳음, 일그러짐, 찌푸림, 창백함, 무표정, 표정 숨김 같은 패턴을 잡되, 대사가 지배적인 블록은 제외한다. 표정 묘사를 금지하지 않고, 표정이 장면 안에서 실제 행동·정보·관계 변화와 결합되지 않은 채 반복될 때만 실패시킨다.
- 퇴고 directive는 표정을 다른 표정으로 바꾸지 말고, 일부 beat를 물건을 꺼내는 행동, 숨기는 말, 잘못 고른 선택, 상대가 제시한 조건, 즉시 바뀐 장면 상태로 전환하라고 지시한다. 표정 묘사가 의도적으로 중요한 만화적/멜로드라마적 문체는 `max_facial_expression_beat_density_per_1000`, `max_facial_expression_beat_run` 또는 CLI의 `--max-facial-expression-beats`, `--max-facial-expression-run`으로 완화할 수 있다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 6문장 연속 표정 beat 샘플을 `facial-expression-crutch-chain`으로 실패시키고, 표정이 한 번 나온 뒤 사진·번호·녹음기 같은 물증과 행동으로 접지되는 문장은 통과하며, profile override에서는 통과하는지 확인한다. CLI 테스트는 style-guide/command-line profile 병합을 확인하고, chapter gate CLI 테스트는 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 문체 취향 게이트가 이제 “얼굴과 표정이 감정을 대신하는 AI식 show-not-tell” false negative를 줄여 대작형 원고 안정성은 올라갔다. 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 문체 불쾌감, 몰입 저하, 이탈과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 211 tests passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 796 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1501 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 prop fidget loop gate):

- 근거 리서치: Jami Gold는 action beat가 대화의 talking-head 문제를 줄이고 인물·장소·상황을 겹쳐 보여줄 수 있지만, 장면을 실제로 풍부하게 해야 한다고 정리한다. Helping Writers Become Authors는 인물이 커피를 홀짝이거나 은식기를 만지작거리는 식의 평범한 beat만 반복되면 깊이와 플롯 가치가 제한된다고 지적한다. Richelle Braswell은 약한 action beat가 빈칸을 채우는 단계 지시문이 되며, 반복적인 utility beat는 효과를 잃는다고 설명한다. Storm Writing School은 소설에 언급된 물건이 plot, character, theme 중 하나에 기여해야 한다고 본다. Katherine Cowley도 action beat가 dialogue와 통합되어 story를 forward해야 한다고 정리한다. 참고: [Jami Gold](https://jamigold.com/2020/05/how-to-improve-our-story-with-action-beats/), [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/an-easy-way-to-immediately-improve-your-characters-action-beats/), [Richelle Braswell](https://www.richellebraswell.com/blog/elevating-your-action-beats), [Storm Writing School](https://stormwritingschool.com/objects-in-fiction/), [Katherine Cowley](https://www.katherinecowley.com/blog/action-beats-dialogue-beats-and-beat-variation/).
- blind spot: 기존 `status-quo-action-loop`은 낮은 영향도 행동문 전반과 인과 전환 부족을 잡는다. 그러나 한국어 생성 산문에서 특히 자주 보이는 `컵을 만졌다`, `봉투를 접었다`, `휴대폰을 만졌다`, `펜을 굴렸다` 같은 소품 조작 beat는 action beat처럼 보이면서도 새 단서, 물건 상태 변화, 건네기/숨기기/빼앗기, 관계 조건 변화 없이 손동작 filler로 반복되는 경우가 많다. 사용자가 말한 “문체가 거슬림”에는 이런 가짜 show-don't-tell 리듬도 직접 포함된다.
- `src/quality/prose-taste-gate.ts`에 `prop-fidget-loop` issue를 추가했다. 새 metric은 `propFidgetBeatDensityPer1000`, `longestPropFidgetBeatRun`이다. 기본값은 plain 4/2문장, balanced 5/3문장, lyrical 7/4문장, webnovel-fast 7/4문장이다. 컵/잔/봉투/종이/휴대폰/펜/열쇠/가방/문고리/반지 등 소품과 만지기, 쥐기, 놓기, 접기, 굴리기, 문지르기, 흔들기 같은 조작 동사가 과밀하거나 연속되면 실패한다.
- detector는 대사 블록과 명시적 인과 전환 문장을 제외하고, 단서·증거·번호·주소·문자·녹음·파일·피·잉크·얼룩·잠금·비밀번호·고백·거절·협박·건넴·빼앗김·숨김·발견·확인처럼 소품이 실제 정보나 장면 상태를 바꾸는 문장은 제외한다. 즉 소품 묘사를 금지하지 않고, 물건이 장면을 움직이지 못한 채 손동작 박자만 만드는 경우를 분리한다.
- 퇴고 directive는 소품을 다른 소품으로 바꾸지 말고, 일부 beat를 새 단서 공개, 물건의 상태 변화, 건네기/숨기기/빼앗기, 관계 조건 변화, 되돌릴 수 없는 선택으로 전환하라고 지시한다. object-heavy staging이나 추리물의 증거 조작이 많은 문체는 `max_prop_fidget_beat_density_per_1000`, `max_prop_fidget_beat_run` 또는 CLI의 `--max-prop-fidget-beats`, `--max-prop-fidget-run`으로 완화할 수 있다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 6문장 연속 소품 조작 beat 샘플을 `prop-fidget-loop`으로 실패시키고, 봉투·사진·번호·녹음기가 물증과 행동 결과로 접지되는 문장은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose friction 샘플로 metric과 issue code를 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 문체 취향 게이트가 이제 “소품을 만지작거리는 행동으로 감정과 긴장을 대신하는 AI식 filler” false negative를 줄여 대작형 원고 안정성은 올라갔다. 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 문체 불쾌감, 몰입 저하, 이탈과 안정적으로 상관된다는 calibration evidence가 필요하다.
- 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/style-gate-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 5 files, 216 tests passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 801 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1506 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 backstory info dump gate):

- 근거 리서치: Jami Gold는 story element를 한꺼번에 설명하면 독자가 장면을 체험하기보다 작가의 정보 전달을 보게 되므로, backstory/worldbuilding/details를 현재 장면의 필요와 갈등에 엮어 흘려보내야 한다고 정리한다. Jane Friedman은 backstory와 exposition을 독자가 직접 알아차리게 할 때 효과적이며, 노골적 설명보다 scene/flashback으로 보이게 하라고 설명한다. Writer's Digest는 backstory를 끝까지 붙잡아 두고 점진적으로 드러내야 현재 시점의 engagement가 유지된다고 조언한다. The Write Practice도 과거 정보를 독자가 궁금해하는 시점까지 지연하고, 현재 장면의 행동과 선택을 멈추지 않게 하라고 본다. 참고: [Jami Gold](https://jamigold.com/2016/03/how-to-weave-story-elements-and-avoid-info-dumps/), [Jane Friedman](https://janefriedman.com/backstory-and-exposition-4-key-tactics/), [Writer's Digest](https://www.writersdigest.com/write-better-fiction/how-to-weave-backstory-seamlessly-into-your-novel), [The Write Practice](https://thewritepractice.com/how-to-write-backstory/).
- blind spot: 기존 `abstract-exposition-drift`, `cognitive-filtering-overload`, `therapy-speak-self-analysis`, `reporting-tail-summary`, `offscreen-resolution-summary`는 추상 설명, 인식 필터, 심리 자기분석, 사후 요약을 잡는다. 그러나 `어린 시절부터`, `몇 년 전`, `그날 이후`, `예전의 약속` 같은 과거/배경 문장이 현재 장면의 질문, 단서, 선택, 충돌 없이 여러 문장 이어지는 경우는 별도 false negative로 남을 수 있었다. 이런 원고는 문장이 비교적 자연스러워도 현재 장면이 멈추고 설정/인물 내력 설명으로 빠져 사용자가 말한 “문체가 거슬림”과 “재미가 멈춤”을 동시에 만든다.
- `src/quality/prose-taste-gate.ts`에 `backstory-info-dump-block` issue를 추가했다. 새 metric은 `backstoryExpositionDensityPer1000`, `longestBackstoryExpositionRun`이다. 기본값은 plain 4/2문장, balanced 5/3문장, lyrical 8/4문장, webnovel-fast 4/2문장이다. 과거 단서 문장이 4문장 이상 밀집하면서 density threshold를 넘거나, 연속 run이 threshold를 넘으면 실패한다.
- detector는 대사 지배 블록을 제외하고 `어린 시절`, `몇 년 전`, `그날 이후`, `과거`, `예전`, `오래전` 같은 time cue와 `였다`, `되었다`, `바꾸어 놓았다`, `떠올렸다`, `이유였다` 같은 explanation signal 또는 가족/사건/상처/비밀/가문/조직 같은 history abstract anchor가 결합한 문장을 센다. 따라서 `몇 년 전 사고를 떠올렸다` 한 문장 뒤 현재 봉투, 사진, 번호, 녹음기, 선택이 즉시 움직이는 경우는 통과한다.
- 퇴고 directive는 회상 자체를 금지하지 않는다. 필수 배경은 현재 장면의 질문, 단서, 선택, 충돌 뒤에 한두 문장으로 엮고, 긴 내력은 별도 플래시백 장면이나 단계적 단서로 쪼개도록 한다. 의도적 framed flashback이나 회고체 장면은 `max_backstory_exposition_density_per_1000`, `max_backstory_exposition_run` 또는 CLI의 `--max-backstory-exposition`, `--max-backstory-run`으로 완화할 수 있다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. benchmark tuning, style-guide 기본값, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 6문장 연속 과거/배경 설명 샘플을 `backstory-info-dump-block`으로 실패시키고, 현재 단서와 행동으로 즉시 접지되는 짧은 회상은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose friction 샘플로 metric과 issue code를 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 현재 장면을 멈추는 배경설명 덩어리 false negative를 줄였으므로 대작형 원고 안정성은 올라갔다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 몰입 저하, 장면 전진감 저하, 이탈과 안정적으로 상관되며, 의도적 회상 장면을 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 4 files, 218 tests passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 806 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1511 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 relationship montage summary gate):

- 근거 리서치: Helping Writers Become Authors는 scene 뒤의 reaction, dilemma, decision이 독자의 감정 처리와 다음 행동을 잇는다고 설명한다. Reedsy와 Career Authors는 감정과 관계 변화를 설명 요약보다 구체 장면, 행동, 감각, 선택으로 보여줄 때 독자가 변화를 직접 체험한다고 정리한다. Advanced Fiction Writing의 scene/sequel 모델도 목표, 갈등, 재난 뒤에 반응, 딜레마, 결정을 단계화해 인물 변화가 생략되지 않게 한다. Caroline Hardaker는 summary가 유용할 때도 있지만 핵심 변화는 scene으로 만들지 않으면 독자가 이야기 밖에서 설명을 듣게 된다고 본다. 참고: [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/sequel-scenes-2/), [Reedsy](https://reedsy.com/blog/show-dont-tell/), [Career Authors](https://careerauthors.com/writing-in-scenes-the-secret-to-show-dont-tell/), [Advanced Fiction Writing](https://www.advancedfictionwriting.com/blog/2007/06/29/sequels-vs-scenes/), [Caroline Hardaker](https://carolinehardakerwrites.com/2025/07/14/how-to-show-not-tell-in-fiction-a-writers-guide-to-bring-stories-to-life/).
- blind spot: 기존 `backstory-info-dump-block`, `offscreen-resolution-summary`, `subtext-overexplanation-chain`, `status-quo-action-loop`은 배경설명, 사후 해결 요약, 속뜻 해설, 낮은 영향도 행동 반복을 잡는다. 그러나 `시간이 흘렀고 두 사람은 점점 가까워졌다`, `며칠 사이 서로를 믿게 되었다`, `오해는 풀렸고 관계는 깊어졌다`처럼 관계·감정 변화가 여러 문장으로 요약될 때는 별도 false negative가 남았다. 이 원고는 문법상 자연스러워 보여도 독자가 관계 전환의 선택, 거절, 사과, 위험 분담, 조건 변경을 목격하지 못해 사용자가 말한 “문체가 거슬림”과 “재미가 없음”을 동시에 만든다.
- `src/quality/prose-taste-gate.ts`에 `relationship-montage-summary` issue를 추가했다. 새 metric은 `relationshipMontageSummaryDensityPer1000`, `longestRelationshipMontageSummaryRun`이다. 기본값은 plain 3/2문장, balanced 4/2문장, lyrical 5/3문장, webnovel-fast 4/2문장이다. 관계·감정 변화 요약 문장이 밀도나 연속 run threshold를 넘으면 proseCraft를 실패시킨다.
- detector는 시간 단서, 요약 표지, 관계 주어, 가까워짐/신뢰/오해 해소/관계 심화 같은 추상 변화 신호를 함께 본다. 봉투, 사진, 녹음기, 거절, 사과, 조건 변경, 선택 비용처럼 장면을 움직이는 구체 사건이 있으면 더 강한 신호가 있을 때만 실패시켜, 필요한 시간 점프나 사건 montage 자체는 금지하지 않는다.
- 퇴고 directive는 “관계가 깊어졌다”를 다른 추상 표현으로 바꾸지 않는다. 관계 변화가 필요한 위치에 작은 장면을 넣고, 인물이 무엇을 감수했는지, 어떤 말이나 행동을 거절했는지, 상대가 조건을 어떻게 바꿨는지, 이후 선택지가 어떻게 달라졌는지를 보이도록 지시한다. 로맨스, 버디물, 성장 서사처럼 관계 전환이 핵심 보상인 장르에서는 특히 hard gate로 의미가 크다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`에 새 필드와 metric을 연결했다. `meta/style-guide.json`의 `prose_taste_profile`, benchmark default profile, CLI override, 실제 chapter gate가 같은 기준을 공유한다.
- 테스트를 보강했다. API 테스트는 6문장 관계 변화 요약 샘플을 `relationship-montage-summary`로 실패시키고, 시간 점프가 있어도 봉투·사진·녹음기·행동 결과로 접지된 문단은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose friction 샘플의 issue code와 metric을 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 관계·감정 전환을 장면 없이 넘기는 false negative를 줄였으므로 대작형 원고 안정성은 올라갔다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 몰입 저하, 관계 투자도 하락, 회차 이탈과 안정적으로 상관되며, 의도적 압축 montage를 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 4 files, 223 tests passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 811 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1516 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 convenient resolution gate):

- 근거 리서치: Writer's Digest는 coincidence가 이야기에서 쓸 수 있는 도구이지만 독자가 작위성을 느끼지 않게 정교하게 처리해야 한다고 설명한다. Helping Writers Become Authors는 deus ex machina가 준비되지 않은 외부 해결로 갈등을 풀어 독자 신뢰를 깨는 구조라고 정리한다. September C. Fawkes는 이런 해결이 주인공 agency를 빼앗는다고 지적하고, Literautas는 해결이 이전 setup과 인물 행동에서 나와야 한다고 조언한다. 참고: [Writer's Digest](https://www.writersdigest.com/general/fiction-as-a-series-of-coincidences), [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/deus-ex-machina-latin-for-dont-do-this/), [September C. Fawkes](https://www.septembercfawkes.com/2026/01/what-is-a-deus-ex-machina-meaning-writing.html), [Literautas](https://www.literautas.com/en/blog/post-1009/deus-ex-machina-what-is-it-and-how-to-avoid-it/).
- blind spot: 기존 `manuscript-protagonist-agency-not-evidenced`, `manuscript-tactical-adaptation-not-evidenced`, `manuscript-causal-chain-not-evidenced`는 주인공 행동과 인과 사슬의 부재를 잡는다. 그러나 원고가 위기, 행동, 결과를 모두 갖춘 것처럼 보이면서 마지막 해결만 `마침 경찰이 도착했다`, `우연히 문이 열렸다`, `갑자기 증거가 발견됐다` 같은 외부 행운으로 처리하면 별도 false negative가 남았다. 이런 원고는 문체를 다듬어도 독자가 전개를 작위적으로 느끼기 쉽다.
- `src/quality/engagement-contract.ts`에 `manuscript-convenient-resolution-not-evidenced` issue를 추가했다. detector는 압박 신호, luck cue, 외부 개입, 해결 동사가 같은 crisis window에 모이면 의심하고, 직전 setup window에 사전 설치, 주인공이 작동시킨 행동, 해결 뒤 비용/대가가 모두 있을 때만 earned resolution으로 통과시킨다. `신고보다`, `신고를 미룬`처럼 실제 setup이 아닌 부정/회피 문맥은 setup evidence에서 제외한다.
- 퇴고 directive는 구조/체포/탈출/증거 발견을 다른 우연으로 바꾸지 말고, helper/route/signal/clue/tool을 위기 전에 심고, 주인공이 그것을 선택이나 행동으로 작동시키며, 결과가 새 비용이나 후속 위험을 만들도록 다시 쓰라고 지시한다.
- `src/quality/engagement-benchmark.ts`에서 이 issue를 `protagonist-agency`와 `causal-chain` positive label의 conflict issue로 연결했다. `templates/engagement-benchmark.template.json`의 기본 `required_issue_codes`와 fixture 목록에도 편의적 해결 known-bad 샘플을 추가했다. 즉 새 프로젝트는 우연한 해결 실패 샘플을 확보하지 않으면 engagement gate tuning 준비가 완료되지 않는다.
- `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`, `README.md`에 같은 기준을 반영했다. `/write-all` 진단에는 `우연한 해결 보정` 항목을 추가해 Ralph Loop가 편의적 해결을 단순 문장 polish로 넘기지 않도록 했다.
- 테스트를 보강했다. evaluator 테스트는 `마침 경찰이 도착해 문이 열리고 체포했다`형 원고를 새 issue로 실패시키고, 위치 공유와 암호 문자를 미리 보낸 뒤 비용이 남는 구조는 통과시킨다. benchmark 테스트는 새 known-bad 샘플 coverage와 agency/causal-chain positive-quality conflict를 확인한다. contract 문서 테스트는 집필/전체집필/검증 스킬이 새 issue code와 "우연한 해결" 기준을 포함하는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 문체 취향 게이트가 AI식 문장 마찰을 많이 막고 있었지만, 재미 측면에서는 "문장은 멀쩡한데 해결이 작위적인" false negative가 남아 있었다. 이번 라운드로 대작형 원고 안정성은 올라갔다. 99점 이상은 실제 한국어 장르 독자 holdout에서 이 issue가 몰입 저하, 작위성 인식, 다음 화 이탈과 안정적으로 상관되며, 의도적 장르 클리셰나 코미디식 우연을 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-contracts.test.ts`: 3 files, 281 tests passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 815 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1520 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 stakes subject specificity gate):

- 근거 리서치: Tiffany Yates Martin은 high stakes가 위험의 크기만으로 생기지 않고, 독자가 특정하고 개인적인 주인공/대상 이야기에 신경 쓰게 될 때 작동한다고 설명한다. Helping Writers Become Authors는 좋은 fiction이 consequence와 cause/effect 위에서 작동하며, 선택에는 결과가 따라야 한다고 정리한다. Patricia C. Wrede는 stakes를 인물이 잃을 것과 걸어 나갔을 때의 consequence로 구분하고, tradeoff가 이야기를 흥미롭게 만든다고 본다. 참고: [Tiffany Yates Martin](https://tiffanyyatesmartin.medium.com/high-stakes-fiction-making-your-reader-care-2130e00c8611), [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/story-stakes-2/), [Patricia C. Wrede](https://pcwrede.com/pcw-wp/stakes-vs-consequences/).
- blind spot: 기존 `manuscript-stakes-not-evidenced`, `manuscript-reader-desire-not-evidenced`는 위협, 손실, 독자 욕망의 존재를 강하게 확인한다. 그러나 원고가 `피해자`, `표적`, `대상`, `수신자`, `사망자`, `실종자` 같은 일반 명사를 반복하면 구조적으로는 stakes가 있어도 독자가 누구를 걱정해야 하는지 약해진다. 특히 추리, 스릴러, 헌터물, 재난물의 초반 장면에서 "피해자를 구해야 한다"가 이름, 관계, 소지품, 목소리, 사진, 사건번호 없이 반복되면 감정 투자 없이 사건 처리 보고서처럼 읽힐 수 있었다.
- `src/quality/engagement-contract.ts`에 `manuscript-stakes-subject-not-personalized` issue를 추가했다. detector는 첫 generic threat window를 잡고, 그 압박 창 안에 이름, 관계, 역할, 소지품, 목소리, 메시지, 신분증, 사진, 주소, 방/좌석/사건/파일 번호, 마지막 말 같은 personal anchor가 있는지 확인한다. 일반 명사가 없으면 통과하고, 일반 명사가 처음 위협으로 쓰이는 창에 개인화 흔적이 없으면 critical issue로 실패시킨다.
- false positive를 줄이기 위해 `사람`, `누군가` 같은 너무 넓은 표현은 기본 generic subject에서 제외했다. 대신 `피해자`, `표적`, `대상`, `수신자`, `사망자`, `실종자`, `목격자`, `시신`, `사람의 목숨`, `타인의 죽음`처럼 위험 대상이 장면의 핵심 stakes로 기능하는 명사를 본다. 즉 "사람을 구하려 했다" 같은 자연스러운 문장을 과차단하기보다, 위험 대상이 명백히 사건의 감정 중심이어야 하는 경우에만 개인화를 요구한다.
- 퇴고 directive는 stakes를 더 크게 만들라고 하지 않는다. generic label을 이름, 관계, 역할, 소지품, 목소리, 메시지, 신분증, 사진, 사건/파일 번호 같은 독자가 붙잡을 수 있는 흔적으로 바꾸도록 지시한다. 핵심은 "누가 위험한가"가 회차의 첫 압박 창에서 독자에게 인식되는지다.
- `src/quality/engagement-benchmark.ts`에서 이 issue를 `narrative-transportation` positive label의 conflict issue로 연결했다. `templates/engagement-benchmark.template.json`의 기본 `required_issue_codes`와 fixture 목록에도 개인화되지 않은 피해자/표적 known-bad 샘플을 추가했다. 이제 새 프로젝트는 이 실패 유형의 holdout coverage 없이는 engagement benchmark 준비가 완료되지 않는다.
- `README.md`, `skills/05-gen-plot/SKILL.md`, `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`에 같은 기준을 반영했다. `/write-all` 진단에는 `스테이크 대상 개인화 부족` 항목을 추가해 Ralph Loop가 피해자/표적/대상을 추상 label로 둔 채 회차 완료를 선언하지 못하게 했다.
- 테스트를 보강했다. evaluator 테스트는 generic 피해자/표적만 반복되는 원고를 `manuscript-stakes-subject-not-personalized`로 실패시키고, benchmark 테스트는 새 required issue coverage와 `narrative-transportation` conflict를 확인한다. contract 문서 테스트는 plot/write/write-all/verify workflow가 새 issue code와 `stakes subject specificity` 기준을 포함하는지 검증한다. 기존 chapter gate 샘플은 새 gate에 맞춰 피해자의 학생증 사진과 protagonist action을 추가해, intended failure가 prose craft에 머물도록 조정했다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 라운드는 "사건은 있는데 걱정할 사람이 없는" false negative를 줄여 대작형 원고 안정성을 높였다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 generic stakes subject 탐지가 몰입 저하, 감정 투자도 하락, 다음 화 이탈과 안정적으로 상관되며, 추리물의 의도적 익명 피해자 처리나 정보 은폐 장면을 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/quality/engagement-benchmark.test.ts tests/masterpiece/engagement-contracts.test.ts`: 3 files, 285 tests passed
  - `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts -t "blocks completion when manuscript prose craft fails despite high score and engagement pass"`: 1 test passed, 55 skipped
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 819 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1524 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 lore name overload gate):

- 근거 리서치: Max Florschutz는 SF/F에서 고유명사와 대문자화된 설정어가 독자의 처리 부담을 크게 좌우하며, 일관성과 과밀도를 신중히 다뤄야 한다고 설명한다. Between the Lines Editorial과 The Write Practice는 세계관 정보를 한꺼번에 던지면 독자가 장면을 따라가기보다 배경 설명을 처리하게 된다고 정리한다. Turner Stories는 iceberg technique처럼 장면에 필요한 정보만 먼저 보여주고 학습 곡선을 점진적으로 만들어야 한다고 조언한다. Rabbit with a Red Pen은 특수 용어와 대문자화가 많을수록 각 용어의 중요도가 흐려지고 몰입이 깨질 수 있다고 본다. 참고: [Max on Writing](https://maxonwriting.com/2022/09/26/being-a-better-writer-the-problem-with-proper-nouns-in-sci-fi-and-fantasy/), [Between the Lines Editorial](https://btleditorial.com/2023/02/28/info-dumps-worldbuilding/), [Turner Stories](https://www.turnerstories.com/blog/2019/4/4/how-to-introduce-your-reader-to-your-fictional-world), [The Write Practice](https://thewritepractice.com/what-is-infodumping-and-how-can-you-avoid-it/), [Rabbit with a Red Pen](https://www.rabbitwitharedpen.com/blog/capitalization-in-fiction).
- blind spot: 기존 `expository-dialogue-dump`, `backstory-info-dump-block`, `abstract-exposition-drift`, `relationship-montage-summary`는 설명 대사, 배경 설명, 추상 서술, 관계 요약을 잡는다. 그러나 `아르카디온 왕국`, `칠성 교단`, `백은 마탑`, `게이트`, `스킬`, `시스템`, `랭크`처럼 세계관 고유명사와 설정어가 한 문단에 몰릴 때는 문법상 자연스럽고 사건도 있는 것처럼 보여 false negative가 남을 수 있었다. 이런 원고는 독자가 장면을 보는 대신 용어집을 먼저 해독하게 만들어, 사용자가 말한 "문체가 거슬림"을 특히 강하게 만든다.
- `src/quality/prose-taste-gate.ts`에 `lore-name-overload` issue를 추가했다. 새 metric은 `loreTermDensityPer1000`, `loreTermOverloadSentenceCount`, `longestLoreTermRun`이다. 기본값은 plain 8/2문장, balanced 10/3문장, lyrical 14/4문장, webnovel-fast 12/3문장이다. 프로젝트 취향에 따라 `max_lore_term_density_per_1000`, `max_lore_term_run` 또는 CLI의 `--max-lore-terms`, `--max-lore-term-run`으로 완화할 수 있다.
- detector는 왕국, 제국, 교단, 마탑, 길드, 가문, 차원, 게이트, 던전, 성역, 결계, 마법, 마력, 마나, 스킬, 랭크, 코어, 룬, 성물, 예언, 계약, 의식, 시스템, 프로토콜 같은 세계관 용어를 센다. 한 문장에 4개 이상 몰리거나, 설명 신호와 함께 3개 이상 나오거나, 현재 소품/행동/선택으로 접지되지 않은 설명 문장이 연속되면 실패한다. 대사 지배 블록이나 소품, 손짓, 거절, 비용, 반응으로 즉시 접지된 짧은 소개는 통과한다.
- 퇴고 directive는 세계관을 비우라고 하지 않는다. 한 장면에는 새 개념 하나만 정면에 세우고, 나머지는 소품, 익숙한 비교, 선택 비용, 인물 반응, 다음 장면 단서로 나누어 배치하도록 지시한다. 판타지/헌터물처럼 설정어가 많은 장르에서도 독자가 먼저 붙잡아야 하는 것은 용어 목록이 아니라 현재 장면의 압박과 선택이다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`, `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`에 같은 기준을 연결했다. benchmark fingerprint와 authorial drift에도 lore term metric을 포함해, "설정어 과밀 문체"가 프로젝트 취향 검증과 실제 chapter gate에서 같은 방식으로 다뤄진다.
- 테스트를 보강했다. API 테스트는 세계관 고유명사/설정어 dump 샘플을 `lore-name-overload`로 실패시키고, 소품과 선택에 접지된 점진적 소개는 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose 샘플의 issue code와 metric을 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 라운드는 "문장은 멀쩡하지만 세계관 표처럼 읽히는" false negative를 줄여 대작형 원고 안정성을 높였다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 혼란, 몰입 저하, 회차 이탈과 안정적으로 상관되며, 의도적 에픽 판타지 용어 밀도를 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npm run validate:schemas`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 169 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 2 files, 59 tests passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 824 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1529 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 declared resolve loop gate):

- 근거 리서치: Helping Writers Become Authors는 인물 agency를 선택과 행동이 사건을 밀어내는 힘으로 설명하고, agency가 없으면 plot momentum이 멈춘다고 본다. Patricia C. Wrede는 인물의 선택과 비선택 모두 결과를 가져야 하며, consequence 없는 결심은 stakes를 만들지 못한다고 정리한다. Go Teen Writers는 결정이 실제 행동 경로를 바꿀 때 독자가 변화를 목격한다고 설명하고, Kidlit은 행동/결정의 consequence가 없으면 긴장과 care가 약해진다고 본다. 참고: [Helping Writers Become Authors - Character Agency](https://www.helpingwritersbecomeauthors.com/character-agency/), [Patricia C. Wrede](https://pcwrede.com/pcw-wp/choices-and-consequences/), [Go Teen Writers](https://goteenwriters.com/2022/02/02/how-to-show-a-characters-decision/), [Kidlit](https://kidlit.com/story-stakes/).
- blind spot: 기존 `manuscript-protagonist-agency-not-evidenced`, `manuscript-choice-tradeoff-not-evidenced`, `status-quo-action-loop`, `emotion-label-carousel`, `relationship-montage-summary`는 agency 부재, 선택 비용 부재, 제자리 행동, 감정 라벨, 관계 요약을 잡는다. 그러나 원고가 `결심했다`, `다짐했다`, `각오했다`, `해야 했다`, `물러설 수 없었다`처럼 의지만 계속 선언하면, 겉으로는 내적 동기가 있어 보이면서도 독자가 실제 선택, 행동, 물증 조작, 비용, 상대 반응을 보지 못하는 false negative가 남았다.
- `src/quality/prose-taste-gate.ts`에 `declared-resolve-loop` issue를 추가했다. 새 metric은 `declaredResolveDensityPer1000`, `longestDeclaredResolveRun`이다. 기본값은 plain 4/2문장, balanced 5/3문장, lyrical 7/4문장, webnovel-fast 6/3문장이다. 프로젝트 취향에 따라 `max_declared_resolve_density_per_1000`, `max_declared_resolve_run` 또는 CLI의 `--max-declared-resolves`, `--max-declared-resolve-run`으로 완화할 수 있다.
- detector는 `결심했다`, `다짐했다`, `각오를 세웠다`, `마음먹었다`, `포기할 수 없다는`, `반드시 해야`, `피하지 않기로 했다` 같은 선언형 결심 문장을 센다. 봉투, 사진, 전화, 기록, 신고서, 서명, 거절, 선택, 포기, 대가, 위험처럼 결심이 즉시 행동·증거·비용으로 접지된 단일 문장은 통과시키고, 선언만 여러 문장 이어질 때 실패시킨다.
- 퇴고 directive는 결심 자체를 금지하지 않는다. 반복 결심 문장의 일부를 실제 선택, 되돌릴 수 없는 행동, 물증 조작, 비용 발생, 상대의 반응으로 바꾸라고 지시한다. 핵심은 "인물이 무엇을 마음먹었는가"보다 "그 마음 때문에 장면에서 무엇이 달라졌는가"다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`, `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`에 같은 기준을 연결했다. benchmark fingerprint와 authorial drift에도 declared resolve metric을 포함해, "의지 선언 반복 문체"가 프로젝트 취향 검증과 실제 chapter gate에서 같은 방식으로 다뤄진다.
- 테스트를 보강했다. API 테스트는 5문장 연속 결심/다짐/각오 샘플을 `declared-resolve-loop`로 실패시키고, 결심 직후 봉투·전화·녹음기·신고서 행동으로 이어지는 샘플은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose 샘플의 issue code와 metric을 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 라운드는 사용자가 말한 "문체가 굉장히 거슬렸던" 문제 중, 인물이 결심만 반복하고 장면을 전진시키지 않는 AI식 의지 선언 false negative를 줄였다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 문체 불쾌감, agency 체감 저하, 다음 화 이탈과 안정적으로 상관되며, 의도적 결의문/연설 장면을 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 173 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 2 files, 60 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 829 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1534 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 revelation summary leap gate):

- 근거 리서치: Helping Writers Become Authors는 payoff가 setup 없이 나오면 독자가 조각나고 덜 울림 있는 결말로 받아들이며, 중요한 payoff는 미리 clue/tone/framing으로 준비돼야 한다고 설명한다. Story Grid는 반전이 독자를 놀라게 하더라도 fair play를 지켜야 하며 true clue와 false clue를 눈앞에 심어야 한다고 정리한다. Atmosphere Press도 미스터리의 fair-play rule을 강조하고, reveal은 행동과 추론을 통해 앞서 제시된 단서에서 논리적으로 나와야 한다고 본다. arXiv의 detective story fair-play 모델링 논문도 reveal이 clue의 해석과 범죄/사건 원인의 인과 관계를 제공해야 한다고 정리한다. 참고: [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/setup-and-payoff-the-two-equally-important-halves-of-story-foreshadowing/), [Story Grid](https://storygrid.com/red-herrings/), [Atmosphere Press](https://atmospherepress.com/how-to-write-a-mystery-novel/), [arXiv 2507.13841](https://arxiv.org/html/2507.13841v1).
- blind spot: 기존 `cognitive-filtering-overload`는 깨달았다/알 수 있었다 같은 인식 필터 과다를 잡고, `declared-resolve-loop`는 결심 선언을 잡는다. 그러나 `모든 단서가 이어졌다`, `진실은 명확했다`, `의문이 풀렸다`, `답은 처음부터 거기에 있었다`처럼 추리·반전·해결 payoff를 요약하는 문장이 이어지면, 문체는 깔끔해 보여도 독자는 단서 대조, 물증 확인, 오독 교정, 결론 이후 행동 비용을 보지 못한다. 이 false negative는 미스터리/스릴러뿐 아니라 로맨스 오해 해소, 판타지 규칙 reveal, 현대판타지 시스템 진실 공개에서도 재미를 납작하게 만든다.
- `src/quality/prose-taste-gate.ts`에 `revelation-summary-leap` issue를 추가했다. 새 metric은 `revelationSummaryDensityPer1000`, `longestRevelationSummaryRun`이다. 기본값은 plain 3/2문장, balanced 4/2문장, lyrical 5/3문장, webnovel-fast 4/2문장이다. 프로젝트 취향에 따라 `max_revelation_summary_density_per_1000`, `max_revelation_summary_run` 또는 CLI의 `--max-revelation-summaries`, `--max-revelation-summary-run`으로 완화할 수 있다.
- detector는 `그제야 깨달았다`, `단서들이 이어졌다`, `진실은 명확했다`, `의문이 풀렸다`, `답은 분명했다` 같은 reveal summary 문장을 센다. 단순히 단서라는 단어가 있다는 이유로 접지된 reveal로 보지 않고, 번호·로그·기록·사진·파일·CCTV·영수증·주소·알리바이 같은 실제 물증 또는 비교/대조/확인/재생/추적/신고/폭로/대가 같은 장면 행동이 함께 있을 때만 예외로 둔다.
- 퇴고 directive는 반전이나 깨달음을 금지하지 않는다. 요약 문장을 단서-증거 비교, 틀린 해석 수정, 결론을 확인하는 물리적 행동, 그 행동 때문에 발생한 비용이나 다음 압박으로 바꾸라고 지시한다. 핵심은 "진실이 명확했다"가 아니라 독자가 어떤 단서 때문에 그 진실이 공정하게 도착했는지 보는 것이다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`, `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`에 같은 기준을 연결했다. benchmark fingerprint와 authorial drift에도 reveal summary metric을 포함해, "단서/진실/답 요약 문체"가 프로젝트 취향 검증과 실제 chapter gate에서 같은 방식으로 다뤄진다.
- 테스트를 보강했다. API 테스트는 5문장 폭로 요약 샘플을 `revelation-summary-leap`로 실패시키고, 봉투 숫자·신고 기록·로그 파일·녹음기 행동으로 단서가 장면 안에서 대조되는 샘플은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose 샘플의 issue code와 metric을 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 라운드는 "진실 공개는 있는데 추론을 읽는 재미가 없는" false negative를 줄여 대작형 원고 안정성을 높였다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 공정성 체감, 몰입, 다음 화 클릭, 문체 불쾌감과 안정적으로 상관되며, 의도적 요약/회상/코지 미스터리 문체를 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 177 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 2 files, 61 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 834 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1539 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 procedural checklist cadence gate):

- 근거 리서치: Career Authors는 미스터리의 재미가 독자가 단서의 관련성, 누락, 의미를 판단하는 데서 나오며, 단서는 story 안에 숨겨져 있다가 나중에 명백해져야 한다고 설명한다. Story Grid의 cause/effect 원칙은 모든 story unit이 조건, 원인, 결과로 이어져야 하며, 미스터리 장면도 수사관이 이론을 시험하거나 용의자의 거짓말을 압박하는 방향으로 움직여야 한다고 본다. 같은 Story Grid 미스터리 글은 단순히 clue를 반복 발견하는 beat가 dull/predictable/repetitive해질 수 있다고 경고한다. Storm Writing School도 이야기를 consequence machine으로 설명하고, 편리한 발견이나 행동-결과 단절이 플롯을 약하게 만든다고 본다. Curtis Brown Creative는 독자가 증거를 토대로 가설을 세우고, 작가가 그 가설을 유도하거나 뒤집어야 한다고 정리한다. 참고: [Career Authors](https://careerauthors.com/how-to-bury-clues-in-your-mystery-novel/), [Story Grid cause/effect](https://storygrid.com/cause-and-effect/), [Story Grid mystery puzzle](https://storygrid.com/murder-mystery-crafting-an-intriguing-puzzle-of-justice/), [Storm Writing School](https://stormwritingschool.com/common-failures-in-cause-effect/), [Curtis Brown Creative](https://www.curtisbrowncreative.co.uk/blog/how-to-set-clues-in-your-crime-novel).
- blind spot: 기존 `status-quo-action-loop`는 바라보다/잡다/기다리다 같은 낮은 영향도 행동 반복을 잡고, `revelation-summary-leap`는 reveal을 요약하는 문장을 잡는다. 그러나 `파일을 확인했다`, `통화 기록을 검토했다`, `번호를 대조했다`, `CCTV 시간을 정리했다`처럼 수사·조사 동작이 많이 등장하지만 가설 변화, 단서 불일치, 용의자 순서, 위험, 비용, 다음 행동이 바뀌지 않는 문체는 통과할 수 있었다. 이 false negative는 문장은 그럴듯하지만 독자가 추론의 재미 대신 업무 목록을 읽게 만든다.
- `src/quality/prose-taste-gate.ts`에 `procedural-checklist-cadence` issue를 추가했다. 새 metric은 `proceduralChecklistDensityPer1000`, `longestProceduralChecklistRun`이다. 기본값은 plain 4/2문장, balanced 5/3문장, lyrical 6/3문장, webnovel-fast 6/3문장이다. 프로젝트 취향에 따라 `max_procedural_checklist_density_per_1000`, `max_procedural_checklist_run` 또는 CLI의 `--max-procedural-checklists`, `--max-procedural-checklist-run`으로 완화할 수 있다.
- detector는 파일·기록·로그·번호·사진·CCTV·알리바이·진술·증거·단서·자료·서류 같은 조사 대상과 확인/검토/대조/검색/조회/분석/정리/분류/추가/추적/비교/되감기 같은 절차 동작이 결합된 문장을 센다. 단, 같은 문장 안에서 비어 있음, 불일치, 알리바이 붕괴, 용의자 재정렬, 신고, 추적, 현장 이동, 위험/대가 같은 장면 결과가 발생하면 체크리스트로 세지 않는다.
- 퇴고 directive는 조사 장면을 줄이라는 뜻이 아니다. 확인 동작 일부를 단서 불일치, 가설 변경, 상대의 거짓말, 용의자 순서 변경, 위험/비용 발생, 다음 행동으로 바꿔 독자가 “조사를 했다”가 아니라 “조사 때문에 이야기가 바뀌었다”고 읽게 하라는 기준이다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`, `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`에 같은 기준을 연결했다. benchmark fingerprint와 authorial drift에도 procedural checklist metric을 포함해, 조사 장면의 문체 마찰이 취향 보정과 실제 chapter gate에서 같은 방식으로 다뤄진다.
- 테스트를 보강했다. API 테스트는 7문장 조사 절차 나열을 `procedural-checklist-cadence`로 실패시키고, 통화 기록 확인이 빈 시간대 발견, 알리바이 붕괴, CCTV 재확인, 용의자 순서 변경으로 이어지는 샘플은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose 샘플의 issue code와 metric을 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 라운드는 "조사는 많은데 장면이 움직이지 않는" false negative를 줄여 추리/스릴러/절차물뿐 아니라 현대판타지 조사, 로맨스 오해 확인, 판타지 규칙 검증 장면의 대작형 안정성을 높였다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 문체 불쾌감, 추론 재미 저하, 다음 화 이탈과 안정적으로 상관되며, 의도적 경찰조서체/로그체/건조한 절차물 문체를 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 181 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 2 files, 62 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 839 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1544 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 action choreography loop gate):

- 근거 리서치: Reedsy는 fight scene이 기술적 동작 설명으로 느려지면 adrenaline을 빼앗기며, 인물의 목표와 감정, 결과가 붙어야 한다고 설명한다. Helping Writers Become Authors는 싸움이 consequence 없이 반복되면 stakes를 잃고, 환경과 몸의 조건이 실제 장면 선택에 영향을 줘야 한다고 본다. Career Authors는 action scene에도 story beat, pinch point, reversal이 필요하다고 정리한다. Writer's Digest와 NowNovel도 fight/battle scene을 단순 동작이 아니라 conflict, goal, motivation, stakes, sensory specificity, psychological effect가 결합된 장면으로 다룬다. The Write Practice는 단순한 난투보다 인물 선택, stakes 상승, 환경 활용이 독자를 붙잡는다고 설명한다. 참고: [Reedsy](https://reedsy.com/blog/how-to-write-a-fight-scene/), [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/how-to-write-realistic-fight-scenes-2/), [Career Authors](https://careerauthors.com/five-principles-for-writing-kick-ass-action-scenes/), [Writer's Digest](https://www.writersdigest.com/whats-new/blow-by-blow-writing-action-and-fight-scenes), [NowNovel](https://nownovel.com/write-fight-scenes-action/), [The Write Practice](https://thewritepractice.com/fight-scene/).
- blind spot: 기존 `simultaneous-action-cadence`는 `~며/~면서/~한 채`식 동시 행동 무대지시문을 잡고, `status-quo-action-loop`는 바라보다/잡다/기다리다 같은 낮은 영향도 행동 반복을 잡는다. 그러나 `검을 휘둘렀다`, `상대가 피했다`, `방패로 막았다`, `다시 찔렀다`처럼 전투/추격 동작이 연속되지만 부상, 무기/공간 파손, 거리/위치 변화, 목표 확보/실패, 감정 압박, 전세 반전이 없는 문체는 통과할 수 있었다. 이 false negative는 액션이 많아 보이지만 독자가 결과 변화를 체감하지 못해 "게임 로그"처럼 읽히는 문제를 만든다.
- `src/quality/prose-taste-gate.ts`에 `action-choreography-loop` issue를 추가했다. 새 metric은 `actionChoreographyDensityPer1000`, `longestActionChoreographyRun`이다. 기본값은 plain 5/3문장, balanced 6/3문장, lyrical 7/4문장, webnovel-fast 8/4문장이다. 프로젝트 취향에 따라 `max_action_choreography_density_per_1000`, `max_action_choreography_run` 또는 CLI의 `--max-action-choreography`, `--max-action-choreography-run`으로 완화할 수 있다.
- detector는 검/칼/창/총/방패/주먹/마법/상대/괴물/추격자 같은 액션 대상과 휘둘렀다/베었다/찔렀다/때렸다/쐈다/막았다/피했다/굴렀다/돌진했다/물러섰다 같은 동작이 결합된 문장을 센다. 단, 같은 문장에 부상, 피, 손목/갈비뼈/무릎 손상, 무기 파손, 퇴로/통로/계단/문/벽 변화, 목표 확보/실패, 인질/탈출/제압, 경보/폭발/연기, 거리·위치 변화, 전세 변화 같은 결과 신호가 있으면 동작 로그로 세지 않는다.
- 퇴고 directive는 액션을 줄이라는 뜻이 아니다. 반복 동작 일부를 부상, 무기/공간 파손, 거리/위치 변화, 목표 확보/실패, 관계/감정 압박, 전세 reversal로 바꿔 "누가 어떤 기술을 썼는가"보다 "그 동작 때문에 장면이 어떻게 달라졌는가"를 보이게 하는 기준이다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`, `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`에 같은 기준을 연결했다. benchmark fingerprint와 authorial drift에도 action choreography metric을 포함해, 전투 로그 문체가 프로젝트 취향 검증과 실제 chapter gate에서 같은 방식으로 다뤄진다.
- 테스트를 보강했다. API 테스트는 7문장 공격/회피/막기 나열을 `action-choreography-loop`로 실패시키고, 칼날이 벽에 박혀 퇴로가 막히거나 손목 부상, 인질 이동, 경보와 전세 변화가 붙은 액션은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose 샘플의 issue code와 metric을 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 라운드는 "액션은 많은데 장면 결과가 없는" false negative를 줄여 전투, 추격, 초능력/마법전, 헌터물 레이드 장면의 대작형 안정성을 높였다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 액션 몰입 저하, 긴장 하락, 장면 기억도 저하와 안정적으로 상관되며, 의도적 무협 초식 교환/스포츠 중계체/전술 로그 문체를 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 185 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 2 files, 63 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 844 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1549 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 system stat block dump gate):

- 근거 리서치: World Anvil은 LitRPG의 스탯 표시가 narrative pacing에 맞춰야 하며, 격렬한 장면에서는 요약이 더 낫고 계획/레벨업 장면에서만 자세한 수치가 유효하다고 설명한다. LitRPG Reads는 stat block이 긴장을 날카롭게 해야지 이야기를 대체하면 안 된다고 본다. ScribbleHub 독자 토론에서도 status screen은 story를 돕기 위한 것이며, 수치가 실제 선택과 결과에 영향을 준다고 느껴져야 한다는 의견이 반복된다. Royal Road 토론은 시스템이 progression tracking에는 유용하지만, 사용하지 않을 기능은 단어로 묘사하거나 제거하라고 조언한다. Roll for Narrative와 Level Up Publishing도 mechanics가 story와 character choice를 섬겨야 하며, voice와 immersion이 깨지면 독자가 즉시 튕겨 나간다고 정리한다. 참고: [World Anvil](https://academy.worldanvil.com/blog/what-is-litrpg-and-how-to-write-it), [LitRPG Reads](https://litrpgreads.com/blog/litrpg/spreadsheets-vs-story-are-stat-blocks-ruining-modern-litrpg), [ScribbleHub Forum](https://www.scribblehubforum.com/threads/skill-boxes-status-screen-for-litrpg.16220/), [Royal Road Forum](https://www.royalroad.com/forums/thread/130367), [Roll for Narrative](https://rollfornarrative.parrydox.com/p/4thewriters-how-to-write-litrpg-without), [Level Up Publishing](https://www.levelup.pub/how-to-write-litrpg).
- blind spot: 기존 `lore-name-overload`는 세계관 고유명사/설정어 과밀을 잡고, `action-choreography-loop`와 `procedural-checklist-cadence`는 전투/조사 동작이 결과 없이 나열되는 문제를 잡는다. 그러나 시스템물·헌터물·LitRPG에서는 `상태창이 떠올랐다`, `레벨 12`, `힘 34`, `보상 경험치 500`, `퀘스트가 갱신됐다`처럼 UI 수치 문장이 반복되면서도 자원 소모, 실패 조건, 제한 시간, 신체/공간 변화, 관계 위험, 다음 선택 비용이 없으면 기존 게이트를 비껴갈 수 있었다. 이 false negative는 장면이 진행되는 것처럼 보이지만 독자가 인물의 선택보다 상태창 표를 먼저 읽게 만든다.
- `src/quality/prose-taste-gate.ts`에 `system-stat-block-dump` issue를 추가했다. 새 metric은 `systemStatBlockDensityPer1000`, `longestSystemStatBlockRun`이다. 기본값은 plain 3/2문장, balanced 4/2문장, lyrical 3/2문장, webnovel-fast 8/4문장이다. 프로젝트 취향에 따라 `max_system_stat_block_density_per_1000`, `max_system_stat_block_run` 또는 CLI의 `--max-system-stat-blocks`, `--max-system-stat-block-run`으로 완화할 수 있다.
- detector는 상태창, 시스템, 알림, 스탯, 능력치, 레벨, Lv, 경험치, EXP, HP/MP, 스킬, 특성, 칭호, 등급, 랭크, 보상, 퀘스트, 미션, 업적, 포인트, 힘/민첩/지능/체력/마력 같은 시스템 수치 문장을 센다. 단, 같은 문장이나 인접 맥락에 쿨타임, 소모, 차감, 실패, 제한, 통증, 부상, 퇴로, 인질, 선택, 포기, 대가, 시간이 줄어듦 같은 장면 비용/결과가 붙으면 UI 로그 dump로 세지 않는다.
- 퇴고 directive는 시스템물 문법을 금지하지 않는다. 필요한 숫자는 남기되, 반복 알림 일부를 자원 소모, 실패 조건, 제한 시간, 신체/공간 변화, 관계 위험, 다음 선택 비용으로 바꾸라고 지시한다. 핵심은 "스탯이 올랐다"가 아니라 "그 수치 변화 때문에 인물이 무엇을 얻고 무엇을 잃었는가"다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`, `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`에 같은 기준을 연결했다. benchmark fingerprint와 authorial drift에도 system stat block metric을 포함해, 상태창/스탯 로그 문체가 취향 보정과 실제 chapter gate에서 같은 방식으로 다뤄진다.
- 테스트를 보강했다. API 테스트는 상태창·레벨·스탯·보상·퀘스트 갱신 나열을 `system-stat-block-dump`로 실패시키고, HP 하락·마나 소모·퇴로 폐쇄·남은 시간 감소처럼 수치가 장면 비용으로 이어지는 샘플은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose 샘플의 issue code와 metric을 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 라운드는 사용자가 말한 "문체가 굉장히 거슬렸던" 문제 중, 시스템물에서 특히 자주 나오는 상태창/스탯/UI 로그 false negative를 줄여 대작형 원고 안정성을 높였다. 다만 99점 이상은 실제 한국어 헌터물·시스템물·LitRPG 독자 holdout에서 이 metric이 문체 불쾌감, 장면 몰입 저하, 다음 화 이탈과 안정적으로 상관되며, 장르적으로 기대되는 레벨업 보상 장면을 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 189 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 2 files, 64 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 849 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1554 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 time skip summary chain gate):

- 근거 리서치: Ignited Ink는 장면 전환에서 독자가 시간, 장소, POV를 즉시 파악해야 하며 전환이 없으면 독자가 현재 위치와 이유를 잃는다고 설명한다. Plot to Punctuation은 time skip이 "중요한 것을 놓치지 않았다"는 암묵적 약속이므로, 이야기에 물질적으로 영향을 주는 사건은 독자가 알거나 나중에 장면화되어야 한다고 본다. September C. Fawkes는 중요한 순간과 payoff는 summary가 아니라 scene으로 경험되어야 하며, summary는 독자가 경험할 필요가 낮은 사실 전달에 적합하다고 정리한다. Helping Writers Become Authors는 전환이 scene structure의 앞뒤를 잇는 bridge로 기능해야 한다고 설명한다. 참고: [Ignited Ink](https://www.ignitedinkwriting.com/ignite-your-ink-blog-for-writers/how-to-format-transitions-scenes-point-of-view-and-time/2019), [Plot to Punctuation](https://www.plottopunctuation.com/article-how-to-handle-time-skips-in-your-novel.html), [September C. Fawkes](https://www.septembercfawkes.com/2021/01/scene-vs-summary-when-to-use-which.html), [Helping Writers Become Authors](https://www.helpingwritersbecomeauthors.com/scene-structure-and-transitions-in-big-scenes/).
- blind spot: 기존 `scene-transition-grounding-gap`는 `***`, `---`, `###` 같은 명시적 장면 전환 뒤의 접지 부족을 잡고, `relationship-montage-summary`는 관계/감정 변화 montage를 잡으며, `offscreen-resolution-summary`는 결정적 해결/구출/체포/폭로가 화면 밖에서 끝나는 문제를 잡는다. 또 `procedural-checklist-cadence`와 `action-choreography-loop`는 조사/액션 로그를 잡는다. 그러나 `며칠이 지났다`, `준비는 끝났다`, `계획은 완성됐다`, `상황은 달라졌다`, `필요한 것은 모두 갖춰졌다`, `남은 것은 결전뿐이었다`처럼 시간 점프와 준비/조사/상태 변화 요약이 이어지면, 문장은 깔끔해 보여도 독자는 선택, 비용, 실패, 이동, 증거를 보지 못한다. 이 false negative는 "이야기가 진행된 것처럼 보이지만 실제 장면은 건너뛴" 문체 불쾌감을 만든다.
- `src/quality/prose-taste-gate.ts`에 `time-skip-summary-chain` issue를 추가했다. 새 metric은 `timeSkipSummaryDensityPer1000`, `longestTimeSkipSummaryRun`이다. 기본값은 plain 3/2문장, balanced 4/2문장, lyrical 5/3문장, webnovel-fast 6/3문장이다. 프로젝트 취향에 따라 `max_time_skip_summary_density_per_1000`, `max_time_skip_summary_run` 또는 CLI의 `--max-time-skip-summaries`, `--max-time-skip-summary-run`으로 완화할 수 있다.
- detector는 `며칠/사흘/밤새/그동안/시간이 흘렀다/다음 날` 같은 시간 cue와 `준비가 끝났다/계획이 완성됐다/조사가 마무리됐다/상황이 달라졌다/모든 것이 갖춰졌다/남은 것은 ~뿐이었다` 같은 상태 변화 summary가 이어지는 문장을 센다. 단, 같은 문장에 봉투, 사진, 기록, 신고서, 통제선, 잠긴 문, 기한, 실패 조건, 선택 비용, 이동 경로, 바뀐 다음 행동 같은 구체적 증거와 대가가 붙으면 time skip summary로 세지 않는다.
- 퇴고 directive는 time skip 자체를 금지하지 않는다. 필요한 압축은 허용하되, 결과 보고 문장 일부를 물증, 선택 비용, 실패 조건, 이동 경로, 바뀐 행동으로 바꾸라고 지시한다. 핵심은 "준비는 끝났다"가 아니라 독자가 그 준비 때문에 인물이 무엇을 포기했고 다음 장면의 조건이 어떻게 바뀌었는지 읽게 하는 것이다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`, `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`에 같은 기준을 연결했다. benchmark fingerprint와 authorial drift에도 time skip summary metric을 포함해, 시간 압축 요약 문체가 취향 보정과 실제 chapter gate에서 같은 방식으로 다뤄진다.
- 테스트를 보강했다. API 테스트는 준비/계획/상황 변화가 시간 점프 뒤에 나열되는 샘플을 `time-skip-summary-chain`으로 실패시키고, 봉투·기록·기한·통제선·바뀐 행동으로 접지된 시간 압축은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose 샘플의 issue code와 metric을 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 라운드는 사용자가 지적한 "문체가 굉장히 거슬렸던" 문제 중, 시간 압축이 장면 경험을 대체하는 false negative를 줄였다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 몰입 저하, 장면 누락감, 다음 화 이탈, 문체 불쾌감과 안정적으로 상관되며, 의도적 montage/회상/전개 압축을 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 193 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts`: 1 file, 2 tests passed
  - `npx vitest run tests/masterpiece/chapter-gate-cli.test.ts`: 1 file, 63 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 854 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1559 tests passed
  - `git diff --check`: passed; CRLF warnings only

추가 확인(2026-06-22 contrastive reframe cadence gate):

- 근거 리서치: Purdue OWL은 같은 구조와 길이의 문장이 반복되면 단조로워지고, 문장 다양성이 리듬과 생동감을 만든다고 설명한다. Grammarly는 antithesis가 병렬 구조로 대조를 선명하게 만드는 장치이며 반복과 리듬 때문에 기억에 남는다고 설명한다. Faeblood Publications는 "not this, but that" 대비 구조가 sparing하게 쓰이면 효과적이지만 남용되면 predictable, formulaic, preachy, reductive하게 읽힌다고 정리한다. Hunting the Muse와 Blake Stockton은 LLM 산문에서 "not just X, but Y" 계열 contrastive reframe이 반복적으로 쓰여 독자에게 AI스러운 공식 문장으로 인식될 수 있다고 지적한다. 참고: [Purdue OWL](https://owl.purdue.edu/owl/general_writing/academic_writing/sentence_variety/index.html), [Grammarly](https://www.grammarly.com/blog/literary-devices/antithesis/), [Faeblood Publications](https://faebloodpublications.com.au/blog/shower-thoughts-on-contrastive-structure-in-writing-and-the-role-ai-plays), [Hunting the Muse](https://huntingthemuse.net/library/how-to-tell-if-writing-is-ai), [Blake Stockton](https://www.blakestockton.com/dont-write-like-ai-1-101-negation/).
- blind spot: 기존 `uniform-sentence-length-cadence`, `same-ending-run`, `symbolic-abstraction-stack`, `declared-resolve-loop`, `revelation-summary-leap`는 문장 길이/종결 반복, 추상어 누적, 결심 선언, 폭로 요약을 잡는다. 그러나 "그건 승리가 아니었다. 유예였다.", "문제는 두려움이 아니었다. 익숙함이었다.", "남은 것은 희망이 아니었다. 경고였다."처럼 대비 단정이 이어지면 문장은 깔끔하고 강해 보이지만, 독자는 인물 행동·물증·대가·상대 반응 대신 결론 문구를 먼저 읽는다. 이 false negative는 특히 장면 말미, 감정 고점, 반전 해설에서 명언/광고 문구 같은 AI식 박자를 만든다.
- `src/quality/prose-taste-gate.ts`에 `contrastive-reframe-cadence` issue를 추가했다. 새 metric은 `contrastiveReframeDensityPer1000`, `longestContrastiveReframeRun`이다. 기본값은 plain 3/2문장, balanced 4/2문장, lyrical 6/3문장, webnovel-fast 5/3문장이다. 프로젝트 취향에 따라 `max_contrastive_reframe_density_per_1000`, `max_contrastive_reframe_run` 또는 CLI의 `--max-contrastive-reframes`, `--max-contrastive-reframe-run`으로 완화할 수 있다.
- detector는 한 문장 안의 `X가 아니라 Y였다`와, `X가 아니었다.` 다음 문장 `Y였다.`로 이어지는 setup/payoff 쌍을 모두 센다. 단, 봉투, 서명, 문, 전화, 기록, 신고, 사진, 파일, 알리바이, 피, 손잡이, 통제선, 기한처럼 대비가 구체 행동·물증·대가에 접지된 문장은 통과시켜, 의도적인 한두 번의 강한 대비나 장면 근거가 붙은 문장은 과차단하지 않게 했다.
- 퇴고 directive는 대비법을 금지하지 않는다. 반복 대비 단정은 한두 번만 남기고, 나머지는 직접적인 긍정문, 구체 물증, 인물 행동, 선택 비용, 상대 반응으로 바꾸라고 지시한다. 핵심은 "무엇이 아니었다"가 아니라 독자가 장면에서 왜 그것이 다른 의미였는지 체감하게 하는 것이다.
- `src/quality/prose-taste-benchmark.ts`, `src/cli/prose-taste-benchmark-project.ts`, `src/cli/run-prose-taste-benchmark.ts`, `src/cli/apply-chapter-gate.ts`, `schemas/prose-taste-benchmark.schema.json`, `schemas/style-guide.schema.json`, `templates/prose-taste-benchmark.template.json`, `templates/style-guide.template.json`, `README.md`, `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, `skills/verify-chapter/SKILL.md`에 같은 기준을 연결했다. benchmark fingerprint와 authorial drift에도 contrastive reframe metric을 포함해, 대비 단정 반복 문체가 프로젝트 취향 검증과 실제 chapter gate에서 같은 방식으로 다뤄진다.
- 테스트를 보강했다. API 테스트는 8문장 `X가 아니었다/Y였다` 연쇄를 `contrastive-reframe-cadence`로 실패시키고, 봉투·서명·문·피·전화 같은 물증과 행동에 접지된 대비 문장은 통과하며, profile override에서는 통과하는지 확인한다. benchmark 테스트는 disliked prose 샘플의 issue code와 metric을 확인하고, CLI 테스트는 style-guide/command-line profile 병합 및 `meta/style-guide.json`의 새 필드가 실제 Ralph Loop 완료를 `RETRY`로 돌리는지 검증한다.
- 점수 영향: 종합 점수는 **98/100 유지**다. 이번 라운드는 사용자가 말한 "문체가 굉장히 거슬렸던" 문제 중, LLM 산문에서 특히 자주 보이는 대조-명언형 결론 박자 false negative를 줄였다. 다만 99점 이상은 실제 한국어 장르 독자 holdout에서 이 metric이 문체 불쾌감, 장면 몰입 저하, 다음 화 이탈과 안정적으로 상관되며, 의도적 수사문/연설/서정적 대구 장면을 과차단하지 않는다는 calibration evidence가 필요하다.
- 현재 검증 결과:
  - `npx tsc --noEmit`: passed
  - `npx vitest run tests/quality/prose-taste-gate.test.ts tests/quality/prose-taste-benchmark.test.ts`: 2 files, 197 tests passed
  - `npx vitest run tests/masterpiece/prose-taste-benchmark-cli.test.ts tests/masterpiece/chapter-gate-cli.test.ts`: 2 files, 66 tests passed
  - `npm run validate:schemas`: passed
  - `npm run build`: schema/template/agent/skill/team validation passed, prebuild integrity passed, 41 test files and 859 tests passed, 31 required build outputs verified
  - `npm test`: 65 files, 1564 tests passed
  - `git diff --check`: passed; CRLF warnings only
