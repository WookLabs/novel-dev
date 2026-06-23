# Session Recovery Guide - 세션 복구 상세 가이드

## Overview

write-all Ralph Loop 세션이 중단되었을 때 안전하게 복구하는 방법을 설명합니다. 세션 중단은 다양한 원인(네트워크 오류, 사용자 중단, Circuit Breaker 발동 등)으로 발생할 수 있으며, 체크포인트 시스템이 이를 자동으로 대비합니다.

## ralph-state.json 필드 설명

### 핵심 상태 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `ralph_active` | boolean | Ralph Loop 활성 여부. `true`이면 세션 진행 중 중단된 것 |
| `can_resume` | boolean | 복구 가능 여부. 체크포인트가 유효하면 `true` |
| `mode` | string | 실행 모드. `"write-all"` 또는 `"idle"`(완료/리셋) |
| `project_id` | string | 프로젝트 식별자 (예: `"novel_20250117_143052"`) |

### 진행 상황 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `current_act` | number | 현재 진행 중인 막 번호 |
| `current_chapter` | number | 다음에 작성할 챕터 번호 |
| `total_chapters` | number | 전체 챕터 수 |
| `total_acts` | number | 전체 막 수 |
| `completed_chapters` | number[] | 완료된 챕터 번호 배열 (정렬됨) |
| `failed_chapters` | number[] | 실패한 챕터 번호 배열 |

### 품질 관련 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `quality_score` | number | 현재 품질 점수 |
| `last_quality_score` | number | 마지막 평가 품질 점수 |
| `quality_threshold` | number | 품질 기준 (기본 95) |
| `validators` | string[] | 사용 중인 검증자 목록 |
| `last_validation` | object | 마지막 검증 결과 (각 validator 점수) |

### Circuit Breaker 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `circuit_breaker.failure_count` | number | 누적 실패 횟수 |
| `circuit_breaker.failure_reasons` | string[] | 실패 이유 목록 |
| `circuit_breaker.triggered` | boolean | Circuit Breaker 발동 여부 |

### 시간 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `started_at` | ISO8601 | 세션 시작 시간 |
| `last_checkpoint` | ISO8601 | 마지막 체크포인트 시간 |
| `last_updated` | ISO8601 | 마지막 상태 업데이트 시간 |
| `completed_at` | ISO8601\|undefined | 세션 완료 시간 (완료된 경우만) |

### 루프 제어 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `retry_count` | number | 현재 챕터 재시도 횟수 |
| `iteration` | number | 전체 루프 반복 횟수 |
| `max_iterations` | number | 최대 반복 제한 (기본 100). 도달 시 완료 처리하지 않고 `requires_user_intervention=true`, `can_resume=true`로 일시정지 |
| `last_failure_reason` | string | 마지막 실패 원인 |

## 백업에서 복구하는 절차

### 자동 백업 구조

체크포인트 저장 시마다 `meta/backups/` 디렉토리에 자동 백업됩니다:

```
meta/
  ralph-state.json              # 현재 상태
  backups/
    ralph-state-2026-01-21T10-30-00-000Z.json   # 최신 백업
    ralph-state-2026-01-21T09-45-00-000Z.json   # 이전 백업
    ralph-state-2026-01-21T09-00-00-000Z.json   # 가장 오래된 백업
```

최근 3개 백업만 유지됩니다 (rotateBackups).

### 수동 복구 절차

#### Case 1: ralph-state.json 손상

1. `meta/backups/` 디렉토리 확인
2. 가장 최근 백업 파일 선택
3. 백업을 `meta/ralph-state.json`으로 복사
4. `/resume` 실행

```bash
# 백업 목록 확인
ls meta/backups/ralph-state-*.json

# 최신 백업 복원
cp meta/backups/ralph-state-{latest}.json meta/ralph-state.json
```

#### Case 2: ralph-state.json 삭제됨

1. 백업이 있으면 Case 1과 동일
2. 백업도 없으면:
   - `chapters/` 디렉토리에서 완료된 `.md` 파일 확인
   - 수동으로 ralph-state.json 재구성 필요
   - 또는 `/write-all`로 새 세션 시작 (이미 작성된 챕터는 건너뜀)

#### Case 3: 백업도 모두 없음

최후 수단으로 상태를 수동 재구성합니다:

```json
{
  "ralph_active": true,
  "mode": "write-all",
  "project_id": "확인 필요",
  "current_act": 1,
  "current_chapter": "chapters/ 디렉토리에서 마지막 .md + 1",
  "total_chapters": "chapters/ 디렉토리의 .json 파일 수",
  "total_acts": "plot/main-arc.json에서 확인",
  "completed_chapters": "chapters/에서 .md가 존재하는 번호 목록",
  "failed_chapters": [],
  "can_resume": true,
  "last_checkpoint": "현재 시간"
}
```

## 부분 완료 챕터 처리

### 판별 기준

챕터가 "부분 완료" 상태인 경우:
- `chapters/chapter_NNN.md` 파일이 존재하지만
- `completed_chapters` 배열에 해당 번호가 없음

이는 집필 도중(파일 저장 후, 품질 검증 전)에 중단된 것을 의미합니다.

### 처리 방법

#### 방법 1: 재작성 (권장)

부분 완료 챕터는 품질 검증을 통과하지 못한 상태이므로 재작성을 권장합니다:

1. `/resume` 실행 시 "현재 챕터 재시작" 선택
2. 기존 `.md` 파일을 덮어씁니다
3. 새로 작성된 챕터가 품질 게이트를 통과하면 `completed_chapters`에 추가

#### 방법 2: 검증 후 속행

이미 작성된 내용이 충분히 좋다고 판단되면:

1. `/verify-chapter {N}` 으로 수동 검증
2. 통과하면 상태 파일에 수동으로 추가
3. `/resume --continue`로 다음 챕터부터 재개

#### 방법 3: 자동 판단

`/resume` → "이어서 집필" 선택 시:
- 먼저 `reviews/design-gate-report.json`의 `passed == true`, `status == "PASS"`를 확인
- design gate가 없거나 `BLOCKED`이면 `run-premise-appeal-benchmark`와 `apply-design-gate --fail-on-blocked`를 먼저 안내하고 재개 중단
- 이어서 `reviews/style-gate-report.json`의 `passed == true`, `status == "PASS"`를 확인
- style gate가 없거나 `BLOCKED`이면 `run-prose-taste-benchmark`와 `apply-style-gate --fail-on-blocked`를 먼저 안내하고 재개 중단
- 현재 회차가 2화 이상이면 직전 최대 3개 원고의 `context/summaries/chapter_NNN_summary.md`가 존재하고, 원고보다 최신이며, compact text 100자 이상인지 확인
- 요약 메모리가 없거나 오래되었거나 너무 얕으면 해당 직전 회차 요약/검증을 먼저 안내하고 재개 중단
- PASS이면 write-all이 `current_chapter`부터 시작
- 기존 `.md` 파일이 있으면 write-all이 자체적으로 처리

### 주의사항

- 부분 완료 챕터의 `.md` 파일은 삭제하지 마세요
- 재작성 시 이전 버전은 자동으로 덮어씁니다
- 수동으로 `completed_chapters`를 편집하면 품질 보장이 안 됩니다

## Circuit Breaker 상태 복구

### 발동 상태에서 복구

`circuit_breaker.triggered == true`인 세션을 복구할 때:

1. `/resume`이 Circuit Breaker 상태를 감지하여 경고 표시
2. 이전 실패 원인(`failure_reasons`)을 사용자에게 안내
3. 사용자가 "이어서 집필" 선택 시:
   - Circuit Breaker 상태가 복원됨
   - 동일 문제가 반복되면 다시 중단됨
4. 사용자가 "세션 초기화" 선택 시:
   - Circuit Breaker 포함 전체 상태 리셋

### Circuit Breaker 수동 리셋

Circuit Breaker만 리셋하고 세션은 유지하려면:

`ralph-state.json`에서 수동 편집:
```json
{
  "circuit_breaker": {
    "failure_count": 0,
    "failure_reasons": [],
    "triggered": false
  },
  "retry_count": 0,
  "last_failure_reason": null
}
```

이후 `/resume --continue`로 재개하면 깨끗한 상태에서 다시 시도합니다.

## 재개 전 설계/문체/요약 메모리 게이트

중단된 세션을 이어 쓰는 것도 새 원고 생성이므로 `/resume --continue`와 `/write-all --resume`은 design gate, style gate, summary memory gate PASS를 모두 요구합니다. 세션 시작 메시지와 `/resume`은 `reviews/design-gate-report.json`, `reviews/style-gate-report.json`, 그리고 직전 원고 요약 메모리를 확인하고 다음 상태로 나눕니다:

| 상태 | 처리 |
|------|------|
| 두 report 모두 `PASS` + `passed=true`, 요약 메모리 PASS | `/write-all --resume` 직접 재개 가능 |
| design report 없음 | 전제 benchmark와 design gate 실행 후 재개 |
| style report 없음 | 문체 취향 benchmark와 style gate 실행 후 재개 |
| summary memory 없음 | 직전 원고 요약 생성 후 재개 |
| summary memory stale | 원고 변경분 반영 요약 재생성 후 재개 |
| summary memory too thin/malformed | 실질 요약 재작성 또는 `/verify-chapter N` 후 재개 |
| `BLOCKED` | issue code를 표시하고 재개 중단 |
| malformed report | report 재생성 후 재개 |

차단 issue에는 `premise-appeal-not-ready`, `weak-promise-evidence`, `premise-appeal-false-positive`, `premise-behavioral-intent-weak`, `premise-appeal-split-leakage`, `premise-appeal-report-stale`, `premise-appeal-source-missing`이 포함됩니다.

문체 차단 issue에는 `prose-taste-not-ready`, `prose-taste-failing-samples`, `prose-taste-false-classification`, `prose-taste-missing-issue`, `style-friction-evidence-weak`, `style-highlight-evidence-weak`, `style-fingerprint-weak`, `authorial-style-drift`, `prose-taste-report-stale`, `prose-taste-source-missing`이 포함됩니다.

요약 메모리 차단 issue에는 `summary-memory-missing`, `summary-memory-stale`, `summary-memory-too-thin`, `summary-memory-malformed`가 포함됩니다. 대상 파일은 `context/summaries/chapter_NNN_summary.md`이며, 현재 회차 직전 최대 3개 원고를 기준으로 검사합니다.

재개 전 실행 명령:

```bash
node dist/cli/run-premise-appeal-benchmark.js --project novels/{novel_id} --json
node dist/cli/apply-design-gate.js --project novels/{novel_id} --fail-on-blocked --json
node dist/cli/run-prose-taste-benchmark.js --project novels/{novel_id} --json
node dist/cli/apply-style-gate.js --project novels/{novel_id} --fail-on-blocked --json
```

요약 메모리 issue가 있으면 해당 회차 원고를 다시 요약하고 필요 시 `/verify-chapter N`으로 검증/요약 산출물을 최신화한 뒤 재개합니다.

이 기준은 재개 경로가 오래된 전제 설계, stale premise benchmark, 거슬리는 문체로 판정된 stale prose taste evidence, 또는 끊긴 장기 기억을 가지고 다음 회차를 생성하지 못하게 하기 위한 안전장치입니다.

## Wisdom 폴더 연동

### 구조

```
meta/
  wisdom/
    learnings.md     # 기술적 발견
    decisions.md     # 설계 결정
    issues.md        # 알려진 이슈
    problems.md      # 해결 과제
```

### 복구 시 활용

`/resume` 실행 시 wisdom 폴더가 있으면:
1. 각 파일의 항목 수를 카운트
2. 복구 정보 표시에 포함: "이전 세션에서 N건의 지혜가 축적되었습니다"
3. "이어서 집필" 선택 시 wisdom 요약을 write-all 컨텍스트에 전달

이를 통해 이전 세션에서 학습한 패턴(문체 조정, 장르 규칙 등)이 복구 후에도 유지됩니다.
