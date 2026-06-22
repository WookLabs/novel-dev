---
name: help
description: "Use this skill when the user needs guidance on novel-dev plugin usage and available workflows. Triggers on: '도움말', 'help', '사용법'."
user-invocable: true
---

# /help - Novel-Dev 도움말

novel-dev 플러그인의 사용법을 사용자 모드에 맞춰 점진적으로 표시합니다.

## 도움말 표시 로직

### Mode 감지
1. `.omc/state/novel-dev-prefs.json` 읽기
2. `mode` 값에 따라 표시 레벨 결정:
   - `simple` → Quick Start만 표시
   - `standard` → Quick Start + Standard Workflow 표시
   - `expert` 또는 파일 없음 → 전체 표시

### 플래그
- `--verbose` 또는 `--all`: 모든 기능 표시 (모드 무시)
- `--mode=simple|standard|expert`: 임시 모드 변경 (저장 안 함)

## 도움말 출력 구조

### Quick Start (항상 표시)
```
╔══════════════════════════════════════════╗
║   novel-dev 소설 창작 도우미             ║
╠══════════════════════════════════════════╣
║                                          ║
║   📖 6단계 퀵스타트                      ║
║                                          ║
║   1. /init        소설 기획              ║
║   2. /design      세계관·캐릭터·플롯     ║
║   3. /gen-plot    회차별 플롯 생성       ║
║   4. gate PASS    설계·문체 사전 확인    ║
║   5. /write-all   자동 집필              ║
║   6. /act-review  막 리뷰 + 심층 평가    ║
║                                          ║
║   처음이라면 /quickstart 을 실행하세요   ║
║                                          ║
╚══════════════════════════════════════════╝
```

### 현재 상태 표시 (프로젝트가 있을 때)
```
📍 현재 상태: Step 3/5 (플롯 생성 단계)
   다음 명령: /gen-plot
```

프로젝트 상태 감지:
- `meta/project.json` 없음 → "프로젝트 없음. /init 으로 시작하세요"
- `meta/project.json` 있고 설계 미완 → "Step 2: /design"
- 설계 완료, 플롯 미생성 → "Step 3: /gen-plot"
- 플롯 완료, `reviews/design-gate-report.json` 없음 또는 PASS 아님 → "집필 전 설계 게이트 필요: run-premise-appeal-benchmark → apply-design-gate"
- 플롯 완료, `reviews/style-gate-report.json` 없음 또는 PASS 아님 → "집필 전 문체 게이트 필요: run-prose-taste-benchmark → apply-style-gate"
- 플롯 완료, 직전 원고 요약 `context/summaries/chapter_NNN_summary.md` 없음/오래됨/부족함 → "집필 전 요약 메모리 게이트 필요: 요약 재생성 → /verify-chapter N"
- 설계·문체·요약 메모리 게이트 모두 PASS, 집필 미시작 → "Step 4: /write-all"
- 집필 완료 → "Step 5: /act-review"

### Standard Workflow (standard, expert 모드에서 표시)
```
📋 Standard Workflow (17 커맨드)

  기획     /brainstorm → /blueprint-gen → /blueprint-review → /init
  설계     /design
  집필     /gen-plot → design/style/summary memory gate PASS → /write → /write-act → /write-all
  검토     /plot-review → /act-review → /revise
```

### Gate 안내

집필 또는 재개를 직접 권하기 전에 다음 report와 요약 메모리를 확인합니다:

- `reviews/design-gate-report.json`: `passed == true`, `status == "PASS"`
- `reviews/style-gate-report.json`: `passed == true`, `status == "PASS"`
- `context/summaries/chapter_NNN_summary.md`: 현재 회차 직전 최대 3개 원고마다 존재, 원고보다 최신, compact text 100자 이상

하나라도 없거나 PASS가 아니면 `/write`, `/write-act`, `/write-all`, `/resume --continue`, `/write-all --resume`을 다음 명령으로 표시하지 않습니다. 먼저 아래 명령과 요약 재생성을 안내합니다:

```bash
node dist/cli/run-premise-appeal-benchmark.js --project {projectPath} --json
node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json
node dist/cli/run-prose-taste-benchmark.js --project {projectPath} --json
node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json
```

요약 메모리 issue는 `summary-memory-missing`, `summary-memory-stale`, `summary-memory-too-thin`, `summary-memory-malformed`로 표시합니다.

### Expert Skills (expert 모드 또는 --verbose에서 표시)
```
🔬 Expert Skills

  품질     /act-review · /style-library
  도구     /resume · /stats · /status
```

### Footer (항상 표시)
```
💡 모드 변경: /help --mode=expert
   전체 표시: /help --verbose
```

## 출력 가이드라인

- Simple 모드: ~30줄 (Quick Start + 현재 상태 + Footer)
- Standard 모드: ~40줄 (+ Standard Workflow)
- Expert 모드: ~50줄 (+ Expert Skills)
- 깔끔하고 스캔 가능한 형식 유지
