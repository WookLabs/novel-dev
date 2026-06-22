---
name: write-act-parallel
description: "Use this skill when writing an entire act with Claude-Codex parallel pipeline. Triggers on: '병렬 막 집필', 'write act parallel'."
user-invocable: true
---

# /write-act-parallel - Act 단위 병렬 협업 집필

$ARGUMENTS

Act의 모든 챕터를 순차적으로 `/write-parallel`로 집필합니다.

## Quick Start

```bash
/write-act-parallel 2              # 2막 전체를 병렬 협업으로
/write-act-parallel 2 --pick       # 병합 없이 더 나은 버전만 선택
/write-act-parallel 2 --2pass      # 병합 + Grok 성인 리라이트
```

## 실행 단계

0. Act의 첫 병렬 브랜치를 만들기 전에 `node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json`을 실행합니다. `reviews/design-gate-report.json`의 `passed == true`, `status == "PASS"`가 아니거나 `premise-appeal-not-ready`, `weak-promise-evidence`, `premise-appeal-report-stale`, `premise-appeal-source-missing`이 있으면 Claude/Codex 어느 쪽 원고도 만들지 않고 `recommendedCommands`의 `run-premise-appeal-benchmark`와 `apply-design-gate`를 먼저 처리합니다. 이어서 `node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json`을 실행해 `reviews/style-gate-report.json`의 `passed == true`, `status == "PASS"`를 확인합니다. `prose-taste-not-ready`, `prose-taste-failing-samples`, `prose-taste-false-classification`, `prose-taste-missing-issue`, `style-friction-evidence-weak`, `style-highlight-evidence-weak`, `style-fingerprint-weak`, `authorial-style-drift`, `prose-taste-report-stale`, `prose-taste-source-missing`이 있으면 Claude/Codex 어느 쪽 원고도 만들지 않고 `recommendedCommands`의 `run-prose-taste-benchmark`와 `apply-style-gate`를 먼저 처리합니다.
1. `plot/structure.json`에서 해당 Act의 챕터 범위 확인
2. 각 챕터에 대해 `/write-parallel {chapter}` 동일 플래그로 실행
3. Act 완료 후 `/act-review {act}` 실행

## 비용

Act 전체 × 2배 (Claude + Codex 병렬). 품질 최대화 목적.
