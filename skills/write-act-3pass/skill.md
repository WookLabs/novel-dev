---
name: write-act-3pass
description: "Use this skill when writing an entire act with 3-pass pipeline. Triggers on: 'write act 3pass', '3패스 막 집필'."
user-invocable: true
---

# /write-act-3pass - Act 단위 3-Pass 집필

$ARGUMENTS

Act의 모든 챕터를 순차적으로 3-Pass(Claude → Grok 전체 폴리시 → Grok 성인 리라이트)로 집필합니다.

## Quick Start

```bash
/write-act-3pass 2              # 2막 전체를 3-Pass로 집필
/write-act-3pass 2 --solo       # 2막을 novelist 단독 + 3-Pass
/write-act-3pass 2 --codex      # 2막을 Codex + 3-Pass
/write-act-3pass 2 --selective  # 2막을 2.5-Pass로 집필
```

## 실행 단계

0. **집필 전 설계/문체 게이트**: Act의 첫 회차를 만들기 전에 `node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json`을 실행합니다. `reviews/design-gate-report.json`의 `passed == true`, `status == "PASS"`가 아니거나 `premise-appeal-not-ready`, `weak-promise-evidence`, `premise-appeal-report-stale`, `premise-appeal-source-missing`이 있으면 어떤 회차도 쓰지 않고 `recommendedCommands`의 `run-premise-appeal-benchmark`와 `apply-design-gate`를 먼저 처리합니다. 이어서 `node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json`을 실행해 `reviews/style-gate-report.json`의 `passed == true`, `status == "PASS"`를 확인합니다. `prose-taste-not-ready`, `prose-taste-failing-samples`, `prose-taste-false-classification`, `prose-taste-missing-issue`, `style-friction-evidence-weak`, `style-highlight-evidence-weak`, `style-fingerprint-weak`, `authorial-style-drift`, `prose-taste-report-stale`, `prose-taste-source-missing`이 있으면 어떤 회차도 쓰지 않고 `recommendedCommands`의 `run-prose-taste-benchmark`와 `apply-style-gate`를 먼저 처리합니다.
1. **Act 정보 로드**: `plot/structure.json`에서 해당 Act의 챕터 범위 확인
2. **챕터 순회**: 각 챕터에 대해 `/write-3pass {chapter}` 동일 플래그로 실행
   - Pass 1: Claude 집필
   - Pass 2: Grok 전체 폴리시 (또는 --selective)
   - Pass 3: Grok 성인 리라이트 (--selective 시 생략)
   - 요약 생성 + 상태 업데이트
3. **Act 완료 후**: `/act-review {act}` 실행 (6-agent 병렬 평가)

## Error Handling

개별 챕터 실패 시:
- Pass 2/3 실패: 이전 Pass 결과 보존, 다음 챕터로 진행
- Pass 1 실패: 해당 챕터 중단, 사용자에게 보고 후 다음 챕터 시도
