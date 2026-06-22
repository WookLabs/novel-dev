---
name: verify-design
description: "This skill should be used when running the design verification pipeline (consistency, genre validation, then premise appeal readiness). Internal pipeline skill."
user-invocable: false
---

# verify-design

설계 검증 파이프라인 - consistency-verifier → genre-validator → premise-appeal-benchmark readiness 순차 실행

## Triggers

- "설계 검증", "design verify"
- "설정 검사", "setting check"
- 자동: 설계 단계 완료 후

## Pipeline Stages

```
┌─────────────────────┐    ┌─────────────────┐    ┌────────────────────────┐
│ consistency-verifier│ →  │ genre-validator │ →  │ premise appeal readiness│
│ (일관성 검증)        │    │ (장르 검증)      │    │ (전제 매력 evidence)    │
└─────────────────────┘    └─────────────────┘    └────────────────────────┘
```

### Stage 1: Consistency Verifier

설정 파일들 간의 일관성 검증:

```javascript
const consistencyResult = await Task({
  subagent_type: "novel-dev:consistency-verifier",
  model: "sonnet",
  prompt: `다음 설계 파일들의 일관성을 검증하세요:

## 검증 대상
- meta/project.json
- world/world.json
- characters/*.json
- plot/main-arc.json
- plot/sub-arcs/*.json
- plot/timeline.json

## 검증 항목
1. 캐릭터 ID 참조 일관성
2. 타임라인 순서 정합성
3. 세계관 규칙 충돌 여부
4. 복선 배치/회수 매칭
5. 장소/설정 묘사 일관성

모순점 발견 시 구체적 위치와 수정 제안 포함.`
});
```

### Stage 2: Genre Validator

장르 필수 요소 충족 검증:

```javascript
const genreResult = await Task({
  subagent_type: "novel-dev:genre-validator",
  model: "sonnet",
  prompt: `설계가 장르 요구사항을 충족하는지 검증하세요:

## 프로젝트 정보
${projectMeta}

## 검증 항목
1. 장르 필수 트로프 포함 여부
2. 필수 비트 배치 계획
3. 클리셰 사용 적절성
4. 독자 기대 충족 예상치
5. 상업성 지표 (훅 밀도, 클리프행어 등)
6. reader_promise_contract가 구체적 독자 약속인지 확인. 일반어(흥미로운 사건, 매력적인 주인공, 재미와 감동, 다음 화가 궁금함) 중심이고 고유 장치, 기억 가능한 단서, 주인공 선택/비용, 감정 보상 trigger가 없으면 `reader-promise-generic`으로 반려
7. 제목/한줄훅/소개문으로 옮겼을 때 노출 → 클릭 → 첫 화 열람 → 저장/팔로우를 만들 만큼 core_hook, novelty_angle, protagonist_appeal, binge_reason이 즉시 이해되는지 확인. 블라인드 목록 테스트에서 플랫폼, variant, 유입원, 관찰 시간을 기록할 수 없을 정도로 목록 패키지 단위가 흐리거나 독자 행동 전환 근거가 약하면 `premise-behavioral-intent-weak`으로 반려

장르: ${genre}
레시피: ${recipe}`
});
```

### Stage 3: Premise Appeal Benchmark Readiness

설계가 원고로 들어가기 전에 전제 매력 벤치마크와 source evidence가 gate tuning에 쓸 수 있는 상태인지 확인:

```bash
node dist/cli/run-premise-appeal-benchmark.js --project novels/{novel_id} --json
node dist/cli/apply-design-gate.js --project novels/{novel_id} --fail-on-blocked --json
```

`apply-design-gate`는 `reviews/premise-appeal-benchmark-report.json`을 읽고 `reviews/design-gate-report.json`을 저장합니다. 다음 조건 중 하나라도 실패하면 `status: "BLOCKED"`이며 `--fail-on-blocked` 실행은 non-zero로 종료합니다.

1. `benchmark.readyForGateTuning === true`
2. `benchmark.weakPromiseEvidenceCount === 0`
3. `benchmark.promiseEvidenceCount > 0`
4. `benchmark.automatedFalsePositiveCount === 0`
5. `benchmark.behavioralIntentFalsePositiveCount === 0`
6. `benchmark.splitLeakageCount === 0`
7. `benchmark.underSampledUsableHoldoutSamples !== true`
8. `benchmark.underSampledUsableFailingHoldoutSamples !== true`
9. `sourceEvidence.status === "matched"`
10. `benchmarkSampleSourceFileCount > 0`

샘플의 `premise`에는 최소한 `core_hook`, `irresistible_question`, `protagonist_appeal`, `novelty_angle`, `emotional_payoff`, `binge_reason`, `long_series_engine`이 있어야 합니다. 설문 점수나 자동 점수가 높아도 이 promise evidence가 약하면 `weak-promise-evidence`로 보고하고 집필을 차단합니다. 같은 전제 evidence fingerprint가 calibration/validation/holdout 사이에 중복되면 독립 holdout이 아니므로 `premise-appeal-split-leakage`로 차단합니다.

## Verification Matrix

| 항목 | 검증자 | 기준 |
|------|--------|------|
| 캐릭터 ID | consistency-verifier | 모든 참조가 유효 |
| 타임라인 | consistency-verifier | 순서 충돌 없음 |
| 세계관 규칙 | consistency-verifier | 모순 없음 |
| 필수 트로프 | genre-validator | 80% 이상 포함 |
| 상업성 | genre-validator | 점수 ≥85 |
| 독자 약속 구체성 | genre-validator | 일반어 금지, 고유 장치와 주인공 선택/비용 포함 |
| 전제 행동 전환성 | genre-validator | 제목/한줄훅/소개문에서 클릭, 첫 화 열람, 저장/팔로우 이유가 보이고 blind listing protocol로 검증 가능 |
| 전제 promise evidence | premise-appeal-benchmark | `weakPromiseEvidenceCount === 0`, `promiseEvidenceCount > 0` |
| 전제 readiness | premise-appeal-benchmark | `readyForGateTuning === true`, split leakage/false positive/usable holdout 결손 없음 |
| 설계 gate 실행성 | apply-design-gate | `reviews/design-gate-report.json.status === "PASS"` |

## Output

```markdown
## 설계 검증 리포트

### 일관성 검증 결과
**상태:** ✅ PASS (점수: 92/100)

발견된 경미한 이슈:
- char_003 등장 시점이 타임라인과 1일 차이 (자동 수정됨)

### 장르 검증 결과
**상태:** ✅ PASS (점수: 88/100)

장르 적합성:
- 필수 트로프: 5/5 ✓
- 필수 비트 배치: 12/15 (80%)
- 상업성 점수: 85점

권장 사항:
- "반전" 비트를 25화에서 22화로 앞당기는 것 권장
- 클리프행어 밀도 약간 증가 필요 (현재 65% → 권장 75%)

### 종합 판정
**APPROVED** - 집필 진행 가능
```

## Usage

```
/novel-dev:verify-design
/novel-dev:verify-design --fix  # 자동 수정 가능한 이슈 수정
```

## Fail Conditions

검증 실패 시 집필 단계 진입 차단:

| 조건 | 처리 |
|------|------|
| 일관성 점수 <70 | 집필 차단, 수정 필요 |
| 장르 점수 <80 | 경고 후 진행 가능 |
| 필수 트로프 <60% | 집필 차단 |
| `reader-promise-generic` | 집필 차단, 구체적 독자 약속 재작성 |
| `premise-behavioral-intent-weak` | 집필 차단, 제목/한줄훅/소개문 전환 근거와 blind listing protocol 단위 재작성 |
| `weak-promise-evidence` 또는 `weakPromiseEvidenceCount > 0` | 집필 차단, core_hook/irresistible_question/protagonist_appeal/novelty_angle/emotional_payoff/binge_reason/long_series_engine 보강 |
| `premise-appeal-not-ready` 또는 `readyForGateTuning !== true` | 집필 차단, 전제 매력 sample coverage, holdout, known-bad, behavioral evidence 보강 |
| `premise-appeal-split-leakage` 또는 `splitLeakageCount > 0` | 집필 차단, calibration/validation/holdout 샘플 evidence 분리 |
| `premise-appeal-false-positive` | 집필 차단, 자동 점수는 높지만 독자/행동 evidence가 약한 전제 재설계 |
| `premise-appeal-report-stale` 또는 `sourceEvidence.status !== "matched"` | 집필 차단, source evidence 변경 후 전제 벤치마크 재생성 |
| `premise-appeal-source-missing` | 집필 차단, `reviews/premise-appeal-benchmark/` 샘플 추가 |
| 캐릭터 참조 오류 | 자동 수정 시도 |
