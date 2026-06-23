# Novel-Sisyphus

AI 소설 창작을 위한 멀티에이전트 오케스트레이션 플러그인

oh-my-claude-sisyphus의 컨셉을 기반으로 한국어 소설 창작에 특화된 Claude Code 플러그인입니다.

## 요구사항

- **Node.js** 18+ (필수)
- **Python** 3.10+ (필수 - 스키마 검증 및 Ralph 루프 지속성에 사용)
- **Claude Code** 최신 버전

## 특징

- **22개 전문 에이전트**: 핵심 7 + 설계/협업 5 + 파이프라인 3 + 검증/분석 6 + 단역 지원 1
- **29개 스킬**: 기획 3 + 설계/플롯 4 + 집필 9 + 리뷰/퇴고 5 + 검증/품질 3 + 유틸리티 5
- **Ralph Loop**: 막(Act) 단위 자동 집필 + 퇴고 + 평가 사이클
- **품질 게이트**: 95점 기준 자동 재작업 시스템
- **일관성 검사**: 캐릭터, 세계관, 타임라인 자동 검증

## 설치

### 방법 1: Marketplace에서 설치 (권장)

```bash
# 1. Marketplace 추가 (Private repo - GITHUB_TOKEN 필요)
GITHUB_TOKEN=$(gh auth token) claude plugin marketplace add https://github.com/WookLabs/novel-dev

# 2. 플러그인 설치
claude plugin install novel-dev@novel-dev
```

> **Note**: Private repository입니다. `gh auth login`으로 GitHub 인증 후 사용하세요.

### 방법 2: 로컬 설치

1. 플러그인 복사
```bash
git clone https://github.com/WookLabs/novel-dev.git
cd novel-dev
npm install
```

2. `.claude/settings.json`에 플러그인 등록
```json
{
  "plugins": [
    { "path": "./novel-dev" }
  ]
}
```

3. Claude Code 세션 재시작

## 업데이트

```bash
claude plugins update novel-dev
```

또는 플러그인을 삭제 후 재설치:
```bash
claude plugin uninstall novel-dev@novel-dev
claude plugin install novel-dev@novel-dev
```

### 캐시 문제 해결

플러그인 업데이트 후 이전 명령어가 남아있는 경우:
```bash
rm -rf ~/.claude/plugins/cache
```
Claude Code 재시작 후 자동으로 새로 로드됩니다.

## 워크플로우 (13단계)

```
┌─────────────────────────────────────────────────────────────┐
│                    🎨 기획 단계 (Planning)                    │
├─────────────────────────────────────────────────────────────┤
│  01. /blueprint-gen    아이디어 → BLUEPRINT.md 생성          │
│  02. /blueprint-review BLUEPRINT.md 검토 및 개선             │
│  03. /init             프로젝트 구조 생성                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    🌍 설계 단계 (Design)                      │
├─────────────────────────────────────────────────────────────┤
│  04. /design           전체 설계 파이프라인 실행              │
│                        (문체·세계관·캐릭터·관계·타임라인·    │
│                         메인아크·서브아크·복선·훅)            │
│  05. /gen-plot         회차별 플롯 JSON 생성                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    ✍️ 집필 단계 (Writing)                     │
├─────────────────────────────────────────────────────────────┤
│  06. /write [N]        특정 회차 집필                         │
│  07. /write-act [N]    특정 막 전체 집필                      │
│  08. /write-all        1화~끝까지 자동 집필 (Ralph Loop)      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    🔍 검증 단계 (Review)                      │
├─────────────────────────────────────────────────────────────┤
│  05b. /plot-review     플롯 품질 검증 (4에이전트 병렬)        │
│  07b. /act-review [N]  막 단위 리뷰 + 선택적 심층            │
│  10. /check            전체 설정 일관성 검사                  │
└─────────────────────────────────────────────────────────────┘
```

## 커맨드 레퍼런스 (29개 스킬)

### 기획 단계 (3개)
| 커맨드 | 설명 | 비고 |
|--------|------|------|
| `/brainstorm` | 소크라틱 대화로 소설 아이디어 정제 | |
| `/blueprint-gen` | 아이디어 → BLUEPRINT.md 기획서 생성 | |
| `/blueprint-review` | BLUEPRINT.md 검토 및 개선 | |

### 설계/플롯 단계 (4개)
| 커맨드 | 설명 | 비고 |
|--------|------|------|
| `/init` | BLUEPRINT.md 기반 프로젝트 초기화 | BLUEPRINT.md 필수 |
| `/design` | 전체 설계 파이프라인 실행 (문체·세계관·캐릭터·관계·타임라인·메인아크·서브아크·복선·훅) | |
| `/design-review` | 설계 산출물 다관점 검증 | design-review-team |
| `/gen-plot` | 회차별 플롯 파일 생성 | reader promise + binge architecture 반영 |

### 집필 단계 (9개)
| 커맨드 | 설명 | 비고 |
|--------|------|------|
| `/write [N]` | 특정 회차 집필 | design + style + summary memory preflight |
| `/write-act [N]` | 막 단위 일괄 집필 | design + style + summary memory preflight |
| `/write-all` | 1화~끝 자동 집필 (Ralph Loop) | design + style + summary memory preflight |
| `/write-2pass` | 2-Pass 파이프라인 (Claude + Grok) | design + style + summary memory preflight |
| `/write-3pass` | 3-Pass 파이프라인 | design + style + summary memory preflight |
| `/write-parallel` | Claude-Codex 병렬 집필 후 병합 | design + style + summary memory preflight |
| `/write-act-2pass` | 막 단위 2-Pass 일괄 집필 | design + style + summary memory preflight |
| `/write-act-3pass` | 막 단위 3-Pass 일괄 집필 | design + style + summary memory preflight |
| `/write-act-parallel` | 막 단위 병렬 집필 | design + style + summary memory preflight |

### 리뷰/퇴고 단계 (5개)
| 커맨드 | 설명 | 비고 |
|--------|------|------|
| `/plot-review [N-M]` | 플롯 품질 검증 (plot-review-team 4에이전트) | |
| `/act-review [N]` | 막 단위 리뷰 + 선택적 심층 (deep-review-team 6에이전트) | |
| `/revise` | 리뷰 피드백 기반 퇴고 | collaborative revision |
| `/revise-pipeline` | critic → editor → proofreader 퇴고 파이프라인 | 내부 파이프라인 |
| `/revision-team-gate` | 집필 후 revision-team 자동 게이트 | 내부 파이프라인 |

### 검증/품질 도구 (3개)
| 커맨드 | 설명 | 비고 |
|--------|------|------|
| `/style-library` | Few-shot 스타일 예시 라이브러리 | |
| `/verify-chapter` | 챕터 병렬 검증 | 내부 검증 |
| `/verify-design` | 설계 산출물 검증 | 내부 검증, 전제 매력 readiness 차단 |

`/verify-design`은 consistency-verifier와 genre-validator만 통과해도 바로 집필을 허용하지 않습니다. 설계 단계가 끝나면 `node dist/cli/run-premise-appeal-benchmark.js --project novels/{novel_id} --json`으로 전제 리포트를 만들고, `node dist/cli/apply-design-gate.js --project novels/{novel_id} --fail-on-blocked --json`으로 `reviews/design-gate-report.json`을 생성합니다. 이 게이트는 `reviews/premise-appeal-benchmark-report.json`의 `readyForGateTuning`, `weakPromiseEvidenceCount`, `promiseEvidenceCount`, false positive, split leakage, usable holdout coverage, source evidence freshness를 확인합니다. `weak-promise-evidence`, `premise-appeal-not-ready`, `premise-appeal-split-leakage`, `premise-appeal-false-positive`, `premise-appeal-report-stale`, `premise-appeal-source-missing`이 남아 있으면 전제를 재설계하고 집필 단계로 넘어가지 않습니다.

모든 집필 진입점(`/write`, `/write-act`, `/write-all`, `/write-2pass`, `/write-3pass`, `/write-parallel`, `/write-act-2pass`, `/write-act-3pass`, `/write-act-parallel`, quickstart Step 4)은 원고 생성 전에 같은 preflight를 다시 실행합니다. `/resume --continue`와 `/write-all --resume`도 중단 지점에서 새 원고를 이어 쓰므로 `reviews/design-gate-report.json`과 `reviews/style-gate-report.json`의 `passed=true`, `status=PASS`, 그리고 직전 3회차 이내 `context/summaries/chapter_NNN_summary.md`의 존재/신선도/최소 충실도를 확인한 뒤에만 직접 재개합니다. `node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json`이 `reviews/design-gate-report.json`의 `passed=true`, `status=PASS`를 만들지 못하면 첫 회차나 재개 회차도 작성하지 않습니다. 설계가 바뀌었거나 premise benchmark source가 stale이면 `premise-appeal-report-stale` 또는 `premise-appeal-source-missing`으로 막고, `recommendedCommands`의 `run-premise-appeal-benchmark`와 `apply-design-gate`를 먼저 수행합니다.

같은 집필 preflight에서 `node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json`도 실행합니다. `reviews/style-gate-report.json`의 `passed=true`, `status=PASS`가 아니면 첫 회차, 재개 회차, act 브랜치, Claude/Codex 초안, 2-Pass/3-Pass polish 모두 시작하지 않습니다. `prose-taste-not-ready`, `prose-taste-failing-samples`, `prose-taste-false-classification`, `prose-taste-missing-issue`, `style-friction-evidence-weak`, `style-highlight-evidence-weak`, `style-fingerprint-weak`, `authorial-style-drift`, `prose-taste-report-stale`, `prose-taste-source-missing`이 남아 있으면 `recommendedCommands`의 `run-prose-taste-benchmark`와 `apply-style-gate`로 선호/비선호 문체 샘플, friction/highlight annotation, holdout evidence, source freshness를 보강한 뒤 다시 시도합니다.

같은 집필 preflight는 현재 회차보다 앞선 최대 3개 원고 파일(`chapters/chapter_NNN.md` 또는 `chapters/chNNN.md`)이 있으면 대응하는 요약 파일(`context/summaries/chapter_NNN_summary.md` 우선)을 검사합니다. 요약이 없으면 `summary-memory-missing`, 원고보다 오래됐으면 `summary-memory-stale`, 내용이 100자 미만으로 다음 회차의 사건·감정·결정 상태를 실을 수 없으면 `summary-memory-too-thin`, 요약 파일을 파싱할 수 없으면 `summary-memory-malformed`로 원고 생성을 중단합니다. 이 검사는 다음 회차가 부정확하거나 빈약한 장기 기억을 바탕으로 이어 쓰이는 일을 막기 위한 장편 연속성 gate입니다.

Claude Code의 `Write`, `Edit`, `MultiEdit`가 `chapters/chapter_NNN*.md` 또는 `chapters/chNNN*.md` 원고를 직접 수정하려는 경우에도 `hooks/pretooluse.py`가 같은 design/style/summary memory gate를 적용합니다. 따라서 `/write` 계열 명령을 쓰지 않고 원고 Markdown을 바로 고치는 수동 흐름도 gate report와 직전 요약이 준비되지 않으면 차단됩니다.

### 유틸리티 (5개)
| 커맨드 | 설명 | 비고 |
|--------|------|------|
| `/help` | 플러그인 사용법 안내 | |
| `/status` | 워크플로우 진행 상태 | |
| `/stats` | 프로젝트 통계 (글자수, 진행률) | |
| `/quickstart` | 5단계 퀵스타트 가이드 | |
| `/resume` | 중단된 세션 이어쓰기 | resume design + style + summary memory preflight |

## 에이전트 (22개)

### 핵심 에이전트 (7개)
| 에이전트 | 모델 | 역할 | 권한 |
|---------|------|------|------|
| novelist | opus | 본문 집필 | 편집 |
| editor | sonnet | 퇴고/교정 | 편집 |
| critic | opus | 품질 평가 | READ-ONLY |
| plot-architect | opus | 플롯 설계 | READ-ONLY |
| lore-keeper | sonnet | 설정 관리 | 편집 |
| proofreader | haiku | 맞춤법 검사 | READ-ONLY |
| summarizer | haiku | 회차 요약 | READ-ONLY |

### 설계/협업 에이전트 (5개)
| 에이전트 | 모델 | 역할 | 권한 |
|---------|------|------|------|
| style-curator | sonnet | 스타일 라이브러리 관리, Few-shot 예시 큐레이션 | 편집 |
| team-orchestrator | sonnet | 에이전트 팀 조율/병렬 실행 | 편집 |
| narrator | opus | 협업 집필 리더, 장면 브리핑과 산문 직조 | 편집 |
| character-designer | opus | 캐릭터 프로필/관계/성장 아크 설계 | 편집 |
| arc-designer | sonnet | 서브아크, 복선, 훅 설계 | 편집 |

### 파이프라인 에이전트 (3개)
| 에이전트 | 모델 | 역할 | 권한 |
|---------|------|------|------|
| quality-oracle | opus | 2-Pass 품질 판정 | READ-ONLY |
| prose-surgeon | opus | 문장 수술/리라이트 | 편집 |
| chapter-merger | opus | 병렬 생성 원고 비교/선택/병합 | 편집 |

### 검증/분석 에이전트 (6개)
| 에이전트 | 모델 | 역할 | 권한 |
|---------|------|------|------|
| beta-reader | sonnet | 독자 관점 몰입도 분석 | READ-ONLY |
| chapter-verifier | sonnet | 병렬 검증 오케스트레이터 | READ-ONLY |
| consistency-verifier | sonnet | 일관성 검증 (캐릭터, 타임라인, 설정, 플롯) | READ-ONLY |
| engagement-optimizer | sonnet | 몰입도 최적화, 텐션 곡선, 페이싱 분석 | READ-ONLY |
| character-voice-analyzer | sonnet | 말투 일관성, OOC 탐지, 대화 분석 | READ-ONLY |
| genre-validator | sonnet | 장르별 필수 요소 검증 | READ-ONLY |

### 단역 지원 (1개)
| 에이전트 | 모델 | 역할 | 권한 |
|---------|------|------|------|
| extras | sonnet | 엑스트라/단역 캐릭터 대사·반응 생성 | READ-ONLY |

## 프로젝트 구조

```
novels/{novel_id}/
├── meta/
│   ├── project.json        # 프로젝트 정보
│   └── style-guide.json    # 문체 가이드
├── world/
│   ├── world.json          # 세계관
│   ├── locations.json      # 장소
│   └── terms.json          # 용어
├── characters/
│   ├── {char_id}.json      # 캐릭터
│   ├── index.json          # 목록
│   └── relationships.json  # 관계
├── plot/
│   ├── structure.json      # 플롯 구조
│   ├── main-arc.json       # 메인 아크
│   ├── sub-arcs/           # 서브 아크
│   ├── foreshadowing.json  # 복선
│   └── hooks.json          # 떡밥
├── chapters/
│   ├── chapter_001.json    # 회차 메타
│   └── chapter_001.md      # 회차 본문
├── context/summaries/      # 회차 요약
├── reviews/                # 평가 결과
│   ├── engagement-benchmark/ # 장르/독자 쾌감 labeled 샘플
│   ├── engagement-benchmark-report.json
│   ├── character-relationship-benchmark/ # 인물/관계 투자도 labeled 샘플
│   ├── character-relationship-benchmark-report.json
│   ├── series-retention-benchmark/ # 연속 회차 유지력 labeled 샘플
│   ├── series-retention-benchmark-report.json
│   ├── prose-taste-benchmark/ # 문체 선호/비선호 labeled 샘플
│   ├── prose-taste-benchmark-report.json
│   ├── reader-response/    # 독자 패널 반응 샘플
│   ├── reader-response-calibration.json
│   └── masterpiece-readiness-report.json
└── exports/                # 내보내기
```

## Ralph Loop

`/write-all` 실행 시 활성화되는 자동 집필 모드:

1. **막 단위 집필**: 각 회차 순차 집필
2. **자동 퇴고**: 막 완료 시 editor 호출
3. **품질 평가**: critic이 95점 기준 평가
4. **재작업**: 95점 미만 시 최대 3회 재시도
5. **사용자 확인**: 막 완료 시 승인 대기

### Promise 태그
- `<promise>CHAPTER_N_DONE</promise>` - 회차 완료
- `<promise>ACT_N_DONE</promise>` - 막 완료
- `<promise>NOVEL_DONE</promise>` - 전체 완료

`ACT_N_DONE`과 `NOVEL_DONE`은 `last_gate` PASS, 빈 `failed_chapters`, 사용자 개입 없음, 그리고 해당 막/전체 회차의 `completed_chapters` 완결성이 확인될 때만 승인됩니다. 막 범위는 `plot/structure.json`을 우선합니다.

## 품질 평가 기준

| 항목 | 배점 | 내용 |
|------|------|------|
| 서사/문체 품질 | 25점 | 문장력, 표현력, 일관성 |
| 플롯 정합성 | 25점 | 설계와 일치, 논리성 |
| 캐릭터 일관성 | 25점 | 설정 준수, 말투 |
| 설정 준수 | 25점 | 세계관, 타임라인 |

**품질 게이트**: 95점 이상 통과

### 1화 첫 화면 게이트

1화 원고는 첫 문장 또는 첫 비트에서 `reader_promise_contract.core_hook`이나 `novelty_angle`을 보여야 합니다. 첫 문단에서 빠지면 `opening-hook-not-evidenced`, 첫 문장 뒤로 밀리면 `opening-hook-delayed`가 발생합니다. 또한 첫 문장에 전제어가 있어도 첫 1~2문장 안에 주인공의 행동/선택 압박, 감각 또는 POV 앵커, 미해결 위험/질문이 함께 없으면 `opening-hook-not-embodied`가 발생합니다. 전제 설명문이 아니라 독자가 첫 화면에서 바로 인물의 손, 화면, 소리, 닫히는 선택지, 즉시 움직이는 행동을 보게 해야 합니다.

### 긴장 고점 원고 게이트

`plot/plot-strategy.json`의 `tension_curve.key_peaks`에 8점 이상 high-tension peak가 있으면, 원고 본문도 그 고점을 실제 장면으로 실행해야 합니다. peak event가 원고에 있어도 "긴장감이 최고조였다"처럼 요약만 하고 같은 1~3문장 안에 구체 위험/장애물, 주인공 행동 또는 강제 선택, 되돌릴 수 없는 결과/폭로/새 질문이 없으면 `manuscript-tension-peak-not-evidenced`가 발생합니다. 장면 메타데이터의 `tension-peak-not-staged`가 설계-장면 연결을 본다면, 이 게이트는 실제 문단이 독자가 읽는 긴장 고점으로 작동하는지 봅니다.

### 원고 긴장 파형 게이트

High-tension 회차는 tension wave / 긴장 파형도 원고에 보여야 합니다. 초반 압박과 열린 질문, 중반 악화와 선택지 축소, 말미 고점과 열린 질문이 순서대로 분산되지 않고 말미에만 위험·폭로·질문을 몰아넣으면 `manuscript-tension-wave-not-evidenced`가 발생합니다. 이 게이트는 단일 클라이맥스가 아니라 독자가 읽는 동안 긴장이 올라가고 꺾이고 다시 열리는 원고 곡선을 확인합니다.

### 서사 예측 수정 게이트

회차 보상, 장면 비트, 원고 본문이 반전, 예상 뒤집힘, 오판, 가설 수정, 재해석을 약속하면 원고는 독자/주인공의 예상, 그 예상을 깨는 구체 단서나 사건, 바뀐 가설/용의자 순위/단서 의미/계획/다음 검증 행동을 모두 보여야 합니다. "놀랐다", "예상이 뒤집혔다" 같은 선언만 있고 해석이나 다음 행동이 바뀌지 않으면 `manuscript-forecast-revision-not-evidenced`가 발생합니다.

### 시간 압박 원고 게이트

원고가 제한 시간, 카운트다운, 남은 n분, 기한, 사망 시각 같은 ticking-clock 압박을 쓰면 그 시간 압박은 행동을 바꾸고 선택지를 좁혀야 합니다. 시간 표식만 있고 같은 장면 흐름에서 주인공 대응, 늦어짐/놓침/닫힌 선택지/사라진 증거/줄어든 기한 같은 결과가 없으면 `manuscript-temporal-pressure-not-evidenced`가 발생합니다. "시간이 없었다"는 설명이 아니라, 시간이 줄어서 경로·증거·관계·다음 행동 중 하나가 실제로 닫히는 장면이어야 합니다.

### 장면 상태 변화 원고 게이트

`scene-state-delta-not-staged`가 장면 설계의 before/after story-state delta를 본다면, `manuscript-scene-state-delta-not-evidenced`는 그 변화가 실제 원고 문장 창 안에서 일어났는지 봅니다. 원고가 `scene.conflict`와 `scene.beat` 키워드를 포함해도, 같은 장면 창 안에 before 압박과 after 결과가 이어져 독자 지식, 위험, 관계 상태, 닫힌 선택지, 세계 규칙, 다음 행동 중 하나를 바꾸지 않으면 실패합니다. 사건을 확인했다는 보고가 아니라, 장면 전과 후의 독자 판단이나 인물 선택지가 달라져야 합니다.

### 장면 신선도 원고 게이트

`scene-novelty-matrix-not-staged`가 보상 전달 방식, 갈등/전술, 공간 제약, 반대세력 대응의 장면 조합을 설계 단계에서 확인한다면, `manuscript-scene-novelty-matrix-not-evidenced`는 그 조합이 원고의 같은 장면 창에서 실제로 발생하는지 확인합니다. 원고가 새 규칙, 단서, 선택, 위험 같은 사건 정보는 말하지만 공간 affordance와 반대세력 대응이 행동·동선·방해·확보/폭로/규칙 변화로 결합되지 않으면 실패합니다. 독자가 “이 장면은 이 이야기에서만 가능한 방식으로 터졌다”고 느끼게 쓰는 것이 기준입니다.

### 잔향 모티프 게이트

회차 메타데이터의 `narrative_elements.resonance_seed`는 독자가 읽고 난 뒤 떠올릴 사물/공간/몸동작 이미지를 기록합니다. 이 씨앗이 선언된 경우 `evaluateEngagementContract`는 scene evidence와 원고 본문에서 같은 이미지가 시각 디테일, 몸감각/감정 잔향, 의미 변화, 이야기 결과와 함께 묶였는지 확인합니다. 장면 메타에서 빠지면 `motif-resonance-not-staged`, 원고에서 빠지면 `manuscript-motif-resonance-not-evidenced`가 발생합니다. 테마를 설명하는 문장이 아니라 선택 비용, 관계 변화, 규칙 변화, 단서 재해석, 되돌릴 수 없는 결과를 미는 반복 이미지여야 합니다.

### 문체 취향 벤치마크

사용자가 거슬린다고 느끼는 문체를 재발시키지 않기 위해, 선호/비선호 문체 샘플을 `reviews/prose-taste-benchmark/*.json`에 저장하고 `prose_taste_profile`과 비교할 수 있습니다.

```bash
node dist/cli/run-prose-taste-benchmark.js --project novels/{novel_id} --json
node dist/cli/apply-style-gate.js --project novels/{novel_id} --fail-on-blocked --json
```

`apply-style-gate`는 `reviews/prose-taste-benchmark-report.json`을 읽어 `reviews/style-gate-report.json`을 저장합니다. `readyForStyleTuning !== true`, 실패 샘플, false positive/false negative, missing issue, score out of range, 약한 friction/highlight annotation, 약한 style fingerprint, authorial style drift, reader segment 편향, split leakage, holdout 부족, stale source evidence가 남아 있으면 `BLOCKED`로 종료하므로 집필 진입점은 원고를 쓰지 않습니다.

`monologue-dialogue-dump`는 대사가 설정 키워드를 노골적으로 설명하지 않더라도 한 사람이 지나치게 긴 턴을 독점해 상대 반응, 반박, 조건 제시, 장면 행동을 밀어낼 때 별도 issue로 기록합니다. `max_dialogue_turn_length`/`max_average_dialogue_turn_length` 또는 CLI의 `--max-dialogue-turn-length`/`--max-average-dialogue-turn-length`로 증언·고백·재판 장면의 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `longestDialogueTurnLength`와 `averageDialogueTurnLength`가 포함됩니다.

`talking-head-dialogue-run`은 반대로 대사 한 줄은 짧더라도 행동·공간·감각 beat 없이 따옴표 턴만 길게 이어져 누가 어디서 무엇을 하는지 흐려지는 대화 장면을 잡습니다. 기본 balanced 기준은 6턴이며 `max_dialogue_grounding_gap_run` 또는 CLI의 `--max-dialogue-grounding-gap-run`으로 빠른 티키타카 장면의 허용치를 조정할 수 있습니다. style fingerprint와 authorial drift에는 `longestDialogueGroundingGapRun`이 포함됩니다.

`dialogue-silence-stall-chain`은 아무 말도 하지 않았다, 대답하지 않았다, 입을 열지 않았다, 침묵이 이어졌다처럼 대화 장면에서 무응답 beat가 실제 선택·조건·관계 변화 없이 반복될 때 별도 issue로 기록합니다. `max_silence_stall_density_per_1000`/`max_silence_stall_run` 또는 CLI의 `--max-silence-stalls`/`--max-silence-stall-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `silenceStallDensityPer1000`과 `longestSilenceStallRun`이 포함됩니다.

`melodramatic-emotion-caption-chain`은 믿을 수 없었다, 말도 안 됐다, 모든 것이 무너졌다, 세상이 멈춘 듯했다처럼 충격의 결론을 설명하는 문장이 손실·선택·관계 조건 변화 없이 과밀하거나 연속될 때 별도 issue로 기록합니다. `max_melodramatic_caption_density_per_1000`/`max_melodramatic_caption_run` 또는 CLI의 `--max-melodramatic-captions`/`--max-melodramatic-caption-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `melodramaticCaptionDensityPer1000`과 `longestMelodramaticCaptionRun`이 포함됩니다.

`stock-reaction-beat-chain`은 숨을 삼켰다, 입술을 깨물었다, 시선을 피했다, 고개를 숙였다처럼 감정과 선택을 상투적 신체 반응으로 대체하는 문장이 과밀하거나 연속될 때 별도 issue로 기록합니다. `max_stock_reaction_beat_density_per_1000`/`max_stock_reaction_beat_run` 또는 CLI의 `--max-stock-reaction-beats`/`--max-stock-reaction-beat-run`으로 장르별 허용치를 조정할 수 있고, style fingerprint에도 `stockReactionBeatDensityPer1000`과 `longestStockReactionBeatRun`이 포함됩니다.

`facial-expression-crutch-chain`은 얼굴이 굳었다, 표정이 일그러졌다, 미간을 찌푸렸다, 입꼬리가 내려갔다, 낯빛이 창백해졌다처럼 감정과 긴장을 얼굴/표정 beat로만 전달하는 문장이 과밀하거나 연속될 때 별도 issue로 기록합니다. 표정 묘사 자체를 금지하지 않고, 표정 beat가 사물 조작, 숨긴 말, 선택 비용, 상대의 조건, 장면 결과 없이 감정 표지로만 반복될 때 실패시킵니다. `max_facial_expression_beat_density_per_1000`/`max_facial_expression_beat_run` 또는 CLI의 `--max-facial-expression-beats`/`--max-facial-expression-run`으로 장르별 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `facialExpressionBeatDensityPer1000`과 `longestFacialExpressionBeatRun`이 포함됩니다.

`body-reaction-subject-chain`은 심장이 뛰었다, 숨이 막혔다, 목구멍이 말랐다, 손끝이 굳었다처럼 몸이 문장 주어가 되는 자동 반응이 선택·대가·상대 행동 없이 과밀하거나 연속될 때 별도 issue로 기록합니다. `max_body_reaction_subject_density_per_1000`/`max_body_reaction_subject_run` 또는 CLI의 `--max-body-reaction-subjects`/`--max-body-reaction-subject-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `bodyReactionSubjectDensityPer1000`과 `longestBodyReactionSubjectRun`이 포함됩니다.

`cliche-emotion-image-chain`은 눈물이 흘렀다, 시간이 멈춘 듯했다, 세상이 무너진 듯했다, 머릿속이 하얘졌다, 칼날 같은 침묵처럼 익숙한 감정 이미지가 인물 고유의 선택·대가·장면 결과를 대신할 때 별도 issue로 기록합니다. `max_cliche_emotion_image_density_per_1000`/`max_cliche_emotion_image_run` 또는 CLI의 `--max-cliche-emotion-images`/`--max-cliche-emotion-image-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `clicheEmotionImageDensityPer1000`과 `longestClicheEmotionImageRun`이 포함됩니다.

`symbolic-abstraction-stack`은 운명, 진실, 의미, 상징, 상실, 구원, 공허, 심연 같은 추상·상징어가 구체 사물·행동·상태 변화 없이 장면 압박을 대신할 때 별도 issue로 기록합니다. `max_symbolic_abstraction_density_per_1000`/`max_symbolic_abstraction_run` 또는 CLI의 `--max-symbolic-abstractions`/`--max-symbolic-abstraction-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `symbolicAbstractionDensityPer1000`과 `longestSymbolicAbstractionRun`이 포함됩니다.

`sensory-wallpaper-run`은 차가운 빛, 비릿한 냄새, 축축한 바람, 희미한 그림자처럼 감각 묘사가 단서 확인, 인물 선택, 위험 변화, 관계 반응, 즉각적 결과 없이 이어질 때 별도 issue로 기록합니다. 감각 밀도를 낮추는 규칙이 아니라 감각이 장면 상태를 움직이게 만드는 규칙이며, `max_sensory_wallpaper_run` 또는 CLI의 `--max-sensory-wallpaper-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `longestSensoryWallpaperRun`이 포함됩니다.

`vague-atmosphere-modifier-chain`은 묘한 공기, 알 수 없는 감각, 무거운 침묵, 낯선 긴장처럼 구체 물증·소리·행동 변화 없이 분위기 수식어가 장면 압박을 대신할 때 별도 issue로 기록합니다. `max_vague_atmosphere_modifier_density_per_1000`/`max_vague_atmosphere_modifier_run` 또는 CLI의 `--max-vague-atmosphere-modifiers`/`--max-vague-atmosphere-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `vagueAtmosphereModifierDensityPer1000`과 `longestVagueAtmosphereModifierRun`이 포함됩니다.

`evaluative-modifier-stack`은 차갑고 서늘하고 낯설었다, 거칠고 불길하고 위태로웠다처럼 한 문장 안에서 평가 형용사가 여러 개 쌓이고 그런 문장이 이어져 장면 변화보다 분위기 판단어가 먼저 보일 때 별도 issue로 기록합니다. `max_evaluative_modifier_density_per_1000`/`max_evaluative_modifier_run` 또는 CLI의 `--max-evaluative-modifiers`/`--max-evaluative-modifier-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `evaluativeModifierDensityPer1000`과 `longestEvaluativeModifierRun`이 포함됩니다.

`filler-adverb-cadence`는 천천히, 조용히, 가만히, 살짝, 잠시, 그대로처럼 속도와 태도를 설명하는 완충 부사가 연속되어 동사·사물 변화·선택 지연·상대 반응보다 문장 박자가 먼저 보일 때 별도 issue로 기록합니다. `max_filler_adverb_density_per_1000`/`max_filler_adverb_run` 또는 CLI의 `--max-filler-adverbs`/`--max-filler-adverb-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `fillerAdverbDensityPer1000`과 `longestFillerAdverbRun`이 포함됩니다.

`simultaneous-action-cadence`는 `문을 붙잡으며`, `고개를 돌리면서`, `눈을 감은 채`처럼 여러 행동을 종속절로 동시에 붙이는 문장이 과밀하거나 연속되어 실제 원인·결과 순서보다 무대 지시문 리듬이 먼저 보일 때 별도 issue로 기록합니다. `max_simultaneous_action_density_per_1000`/`max_simultaneous_action_run` 또는 CLI의 `--max-simultaneous-actions`/`--max-simultaneous-action-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `simultaneousActionDensityPer1000`과 `longestSimultaneousActionRun`이 포함됩니다.

`status-quo-action-loop`은 바라보았다, 컵을 내려놓았다, 봉투를 만졌다, 고개를 돌렸다, 기다렸다처럼 행동처럼 보이는 문장이 연속되지만 새 단서·선택·장애·결과가 없어 장면 전후 상태가 바뀌지 않을 때 별도 issue로 기록합니다. `max_status_quo_action_density_per_1000`/`max_status_quo_action_run`/`min_causal_turn_density_per_1000` 또는 CLI의 `--max-status-quo-actions`/`--max-status-quo-action-run`/`--min-causal-turns`로 허용치를 조정할 수 있고, style fingerprint에도 `statusQuoActionDensityPer1000`, `longestStatusQuoActionRun`, `causalTurnDensityPer1000`이 포함됩니다.

`prop-fidget-loop`은 컵을 만졌다, 봉투를 접었다, 휴대폰을 만졌다, 펜을 굴렸다처럼 소품 조작 beat가 새 단서·물건 상태 변화·관계 조건 변화 없이 반복될 때 별도 issue로 기록합니다. 액션 beat와 소품 묘사 자체를 금지하지 않고, 소품이 장면을 전진시키지 못한 채 손동작 filler로만 반복될 때 실패시킵니다. `max_prop_fidget_beat_density_per_1000`/`max_prop_fidget_beat_run` 또는 CLI의 `--max-prop-fidget-beats`/`--max-prop-fidget-run`으로 장르별 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `propFidgetBeatDensityPer1000`과 `longestPropFidgetBeatRun`이 포함됩니다.

`gaze-choreography-loop`은 시선을 피했다, 눈길이 머물렀다, 눈빛이 흔들렸다, 고개를 돌렸다, 서로 바라보았다처럼 시선/눈/고개 beat가 새 단서·선택·결과 없이 연속되어 장면 진행을 카메라 안무처럼 대체할 때 별도 issue로 기록합니다. `max_gaze_choreography_density_per_1000`/`max_gaze_choreography_run` 또는 CLI의 `--max-gaze-choreography-beats`/`--max-gaze-choreography-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `gazeChoreographyDensityPer1000`과 `longestGazeChoreographyRun`이 포함됩니다.

`emotion-label-carousel`은 불안했다, 후회했다, 당황했다, 분노했다, 절망했다처럼 감정명이 연속으로 회전하지만 그 감정이 선택, 말, 행동, 관계 비용, 즉각적 결과로 이어지지 않을 때 별도 issue로 기록합니다. `max_emotion_label_run` 또는 CLI의 `--max-emotion-label-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `longestEmotionLabelRun`이 포함됩니다.

`offscreen-resolution-summary`는 결정적 폭로·해결·체포·구출이 "조사 끝에 밝혀졌다", "결국 해결됐다", "며칠 뒤 정리됐다"처럼 시간 점프 뒤 사후 요약으로 처리되어 독자가 고점 장면을 체험하지 못할 때 별도 issue로 기록합니다. 이 issue는 장르별 허용치보다 장면 실행 결손으로 다루며, 수정 지시는 단서 확인, 선택, 충돌, 실패 비용, 폭로 순간, 즉시 달라진 행동을 원고 안 장면으로 복구하도록 생성됩니다.

`rhetorical-question-drift`는 왜/어떻게/정말/걸까 같은 자문형 의문문이 실제 확인 행동, 새 단서, 선택 비용, 상대 반응 없이 연쇄되어 장면 진행을 대신할 때 별도 issue로 기록합니다. `max_rhetorical_question_density_per_1000`/`max_rhetorical_question_run` 또는 CLI의 `--max-rhetorical-questions`/`--max-rhetorical-question-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `rhetoricalQuestionDensityPer1000`과 `longestRhetoricalQuestionRun`이 포함됩니다.

`punctuation-emphasis-overload`는 느낌표, `?!`, `!!`, 말줄임표가 대사 내용·행동 비트·상대 반응 대신 감정과 침묵을 떠맡을 때 별도 issue로 기록합니다. `max_emphasis_punctuation_density_per_1000`/`max_emphasis_punctuation_run` 또는 CLI의 `--max-emphasis-punctuation`/`--max-emphasis-punctuation-run`으로 플랫폼 대사체의 허용치를 조정할 수 있고, style fingerprint에도 `emphasisPunctuationDensityPer1000`과 `longestEmphasisPunctuationRun`이 포함됩니다.

`subtext-overexplanation-chain`은 “그 침묵은 거절이라는 뜻이었다”, “그 시선은 믿지 못하겠다는 의미였다”처럼 대화·침묵·시선·표정의 속뜻을 서술자가 곧바로 번역해 독자의 추론 여지를 줄일 때 별도 issue로 기록합니다. `max_subtext_explanation_density_per_1000`/`max_subtext_explanation_run` 또는 CLI의 `--max-subtext-explanations`/`--max-subtext-explanation-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `subtextExplanationDensityPer1000`과 `longestSubtextExplanationRun`이 포함됩니다.

`therapy-speak-self-analysis`는 트라우마, 애착, 자존감, 인정욕구, 방어기제 같은 심리 용어가 인물의 말·행동·선택 비용 대신 자기 상태를 해설하는 문장이 연속될 때 별도 issue로 기록합니다. 한 번의 심리 용어 사용을 금지하지 않고, 심리 용어+깨달음/분석/원인 설명이 밀집해 장면이 상담 기록처럼 읽히는 경우만 겨냥합니다. `max_therapy_speak_density_per_1000`/`max_therapy_speak_run` 또는 CLI의 `--max-therapy-speak`/`--max-therapy-speak-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에도 `therapySpeakDensityPer1000`과 `longestTherapySpeakRun`이 포함됩니다.

`backstory-info-dump-block`은 어린 시절, 몇 년 전, 그날 이후, 과거/예전 같은 배경 단서가 현재 장면의 질문·단서·선택·충돌 없이 여러 문장 이어져 장면을 멈출 때 별도 issue로 기록합니다. 필요한 회상이나 플래시백 자체를 금지하지 않고, 과거 설명이 한 덩어리로 쌓여 present action을 밀어낼 때 실패시킵니다. `max_backstory_exposition_density_per_1000`/`max_backstory_exposition_run` 또는 CLI의 `--max-backstory-exposition`/`--max-backstory-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `backstoryExpositionDensityPer1000`과 `longestBackstoryExpositionRun`이 포함됩니다.

`relationship-montage-summary`는 시간이 흘렀다, 점점 가까워졌다, 며칠 사이 믿게 되었다, 오해가 풀렸다, 관계가 깊어졌다처럼 관계·감정 전환을 장면 없이 요약하는 문장이 이어질 때 별도 issue로 기록합니다. 시간 점프나 몽타주 자체를 금지하지 않고, 봉투·사진·대화·거절·사과·조건 변경·선택 비용 같은 구체 사건 없이 가까워짐/신뢰/오해 해소를 줄거리 요약으로 처리할 때 실패시킵니다. `max_relationship_montage_summary_density_per_1000`/`max_relationship_montage_summary_run` 또는 CLI의 `--max-relationship-montage-summaries`/`--max-relationship-montage-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `relationshipMontageSummaryDensityPer1000`과 `longestRelationshipMontageSummaryRun`이 포함됩니다.

`time-skip-summary-chain`은 며칠이 지났다, 준비는 끝났다, 계획은 완성됐다, 상황은 달라졌다, 필요한 것은 갖춰졌다, 남은 것은 결전뿐이었다처럼 시간 경과 뒤 준비·조사·상황 변화를 장면 없이 결과 보고로 넘기는 문장이 이어질 때 별도 issue로 기록합니다. 시간 압축 자체를 금지하지 않고, 봉투·사진·기록·신고서·기한·문 잠김·통제선·선택 비용 같은 물증과 결과 행동 없이 “중요한 변화가 이미 끝났다”고 선언할 때 실패시킵니다. `max_time_skip_summary_density_per_1000`/`max_time_skip_summary_run` 또는 CLI의 `--max-time-skip-summaries`/`--max-time-skip-summary-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `timeSkipSummaryDensityPer1000`과 `longestTimeSkipSummaryRun`이 포함됩니다.

`contrastive-reframe-cadence`는 “그건 승리가 아니었다. 유예였다.”, “문제는 두려움이 아니었다. 익숙함이었다.”처럼 `X가 아니었다. Y였다`식 대비 단정이 장면 증거 없이 반복될 때 별도 issue로 기록합니다. 한두 번의 대비 문장은 강한 리듬이 될 수 있지만, 연쇄되면 인물 행동·물증·대가·상대 반응보다 명언/광고 문구 같은 결론이 먼저 보여 AI식 산문으로 읽힙니다. `max_contrastive_reframe_density_per_1000`/`max_contrastive_reframe_run` 또는 CLI의 `--max-contrastive-reframes`/`--max-contrastive-reframe-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `contrastiveReframeDensityPer1000`과 `longestContrastiveReframeRun`이 포함됩니다.

`lore-name-overload`는 왕국, 교단, 마탑, 길드, 게이트, 던전, 스킬, 랭크, 시스템, 프로토콜 같은 세계관 고유명사/설정어가 장면 행동·물증·선택 비용보다 먼저 과밀하게 이어질 때 별도 issue로 기록합니다. 설정 자체를 금지하지 않고, 한 장면 안에서 새 개념을 여러 개 설명해 독자가 장면보다 설정 표를 먼저 처리해야 할 때 실패시킵니다. `max_lore_term_density_per_1000`/`max_lore_term_run` 또는 CLI의 `--max-lore-terms`/`--max-lore-term-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `loreTermDensityPer1000`, `loreTermOverloadSentenceCount`, `longestLoreTermRun`이 포함됩니다.

`system-stat-block-dump`는 상태창, 스탯, 레벨, HP/MP, 스킬 Lv, 보상 경험치, 퀘스트 갱신 같은 시스템 수치 문장이 자원 소모, 실패 조건, 제한 시간, 신체/공간 변화, 관계 위험, 다음 선택 비용 없이 이어질 때 별도 issue로 기록합니다. 시스템물/LitRPG의 숫자 보상을 금지하지 않고, 독자가 장면의 선택과 대가보다 UI 로그를 먼저 읽게 되는 반복만 차단합니다. `max_system_stat_block_density_per_1000`/`max_system_stat_block_run` 또는 CLI의 `--max-system-stat-blocks`/`--max-system-stat-block-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `systemStatBlockDensityPer1000`, `longestSystemStatBlockRun`이 포함됩니다.

`declared-resolve-loop`는 결심했다, 다짐했다, 각오했다, 해야 했다, 물러설 수 없었다처럼 의지 선언이 실제 선택·행동·물증 조작·대가 발생 없이 여러 문장 이어질 때 별도 issue로 기록합니다. 결심 자체를 금지하지 않고, 인물이 무엇을 했는지와 그 결과가 무엇인지 보여주지 않은 채 장면 전진을 의지 문장으로 대신할 때 실패시킵니다. `max_declared_resolve_density_per_1000`/`max_declared_resolve_run` 또는 CLI의 `--max-declared-resolves`/`--max-declared-resolve-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `declaredResolveDensityPer1000`, `longestDeclaredResolveRun`이 포함됩니다.

`revelation-summary-leap`는 "모든 단서가 이어졌다", "진실은 명확했다", "의문이 풀렸다", "답은 처음부터 거기에 있었다"처럼 추리·반전·해결 payoff를 단서 대조, 물증 확인, 오독 교정, 행동 비용 없이 요약할 때 별도 issue로 기록합니다. 반전과 깨달음 자체를 금지하지 않고, 독자가 앞서 본 단서로 결론에 도달할 공정한 과정을 장면 안에서 확인하지 못할 때 실패시킵니다. `max_revelation_summary_density_per_1000`/`max_revelation_summary_run` 또는 CLI의 `--max-revelation-summaries`/`--max-revelation-summary-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `revelationSummaryDensityPer1000`, `longestRevelationSummaryRun`이 포함됩니다.

`procedural-checklist-cadence`는 "파일을 확인했다", "통화 기록을 검토했다", "번호를 대조했다", "CCTV 시간을 정리했다"처럼 조사·추론 동작이 가설 변화, 단서 불일치, 위험, 용의자 재정렬, 다음 행동 없이 반복될 때 별도 issue로 기록합니다. 절차물의 조사 장면 자체를 금지하지 않고, 독자가 원인과 결과의 변화 없이 업무 목록처럼 읽는 문장만 차단합니다. `max_procedural_checklist_density_per_1000`/`max_procedural_checklist_run` 또는 CLI의 `--max-procedural-checklists`/`--max-procedural-checklist-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `proceduralChecklistDensityPer1000`, `longestProceduralChecklistRun`이 포함됩니다.

`action-choreography-loop`는 "검을 휘둘렀다", "상대가 피했다", "방패로 막았다", "다시 찔렀다"처럼 전투/추격 동작이 부상, 무기·공간 파손, 거리/위치 변화, 목표 확보/실패, 감정 압박, 전세 반전 없이 반복될 때 별도 issue로 기록합니다. 액션 장면 자체를 금지하지 않고, 독자가 결과가 바뀌는 싸움이 아니라 게임 로그처럼 동작 순서만 읽는 문장만 차단합니다. `max_action_choreography_density_per_1000`/`max_action_choreography_run` 또는 CLI의 `--max-action-choreography`/`--max-action-choreography-run`으로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `actionChoreographyDensityPer1000`, `longestActionChoreographyRun`이 포함됩니다.

`ambiguous-reference-chain`은 “그는”, “그녀는”, “그것은”, “그 말은” 같은 지시어가 인물명·역할·사물명 없이 과밀하거나 연속되어 독자가 누가 무엇을 하는지 다시 추적해야 할 때 별도 issue로 기록합니다. `max_ambiguous_reference_density_per_1000`/`max_ambiguous_reference_run` 또는 CLI의 `--max-ambiguous-references`/`--max-ambiguous-reference-run`으로 허용치를 조정할 수 있고, style fingerprint에도 `ambiguousReferenceDensityPer1000`과 `longestAmbiguousReferenceRun`이 포함됩니다.

`pov-mind-hop-chain`은 같은 문단 안에서 서연은 불안했다, 민준은 확신했다, 도현은 들켰다고 생각했다처럼 서로 다른 인물의 사적 생각·감정·판단을 전환 없이 직접 열어 제한시점 몰입이 흔들릴 때 별도 issue로 기록합니다. `max_pov_mind_jump_density_per_1000`/`max_pov_mind_jump_run` 또는 CLI의 `--max-pov-mind-jumps`/`--max-pov-mind-jump-run`으로 전지적·군상극 문체의 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `povMindJumpParagraphDensityPer1000`, `povMindJumpParagraphCount`, `longestPovMindJumpRun`이 포함됩니다.

`scene-transition-grounding-gap`은 `***`, `---`, `###` 같은 장면 전환 표식 뒤 새 장면이 시간 경과, 이동 경로, 앞 장면의 인과 결과, POV 감각 잔류 없이 바로 시작될 때 별도 issue로 기록합니다. `max_scene_transition_grounding_gap_density_per_1000`/`max_scene_transition_grounding_gap_run` 또는 CLI의 `--max-scene-transition-gaps`/`--max-scene-transition-gap-run`으로 몽타주/빠른 웹소설 호흡의 허용치를 조정할 수 있고, style fingerprint에도 `sceneTransitionGroundingGapDensityPer1000`과 `longestSceneTransitionGroundingGapRun`이 포함됩니다.

`topic-marker-cadence-lock`은 서술문이 계속 `서연은...`, `민준은...`, `문이...`처럼 은/는/이/가 주어·화제 조사로만 출발해 주어-술어 행진처럼 읽힐 때 별도 issue로 기록합니다. `max_topic_marker_starter_density_per_1000`/`max_topic_marker_starter_run` 또는 CLI의 `--max-topic-marker-starters`/`--max-topic-marker-run`으로 의도적 병렬문·웹소설 빠른 박자의 허용치를 조정할 수 있고, style fingerprint에도 `topicMarkerStarterDensityPer1000`과 `longestTopicMarkerStarterRun`이 포함됩니다.

`uniform-sentence-length-cadence`는 짧은 단문은 아닌데 비슷한 길이의 중간 이상 서술문이 여러 문장 이어져 문단 박자가 균일하게 잠길 때 별도 issue로 기록합니다. `min_sentence_length_variation_coefficient`/`max_uniform_sentence_length_run` 또는 CLI의 `--min-sentence-length-variation`/`--max-uniform-sentence-run`으로 장르별 리듬 허용치를 조정할 수 있고, style fingerprint에는 `sentenceLengthVariationCoefficient`와 `longestUniformSentenceLengthRun`, authorial drift에는 `sentenceLengthVariationCoefficient`가 포함됩니다.

`immersive-rhythm-flatline`은 문장 길이와 종결을 바꿔도 문단 안에서 설명/판단/상태문만 이어지고 물증, 손동작, 대사 반응, 선택 비용, 감각 변화 같은 장면 앵커가 부족할 때 별도 issue로 기록합니다. `min_immersive_rhythm_anchor_density_per_1000`/`max_immersive_rhythm_flatline_run` 또는 CLI의 `--min-immersive-rhythm-anchors`/`--max-immersive-rhythm-flatline-run`으로 허용치를 조정할 수 있고, style fingerprint에는 `immersiveRhythmAnchorDensityPer1000`와 `longestImmersiveRhythmFlatlineRun`이 포함됩니다.

`same-ending-run`은 한국어 산문에서 `-았다/-었다/-했다/-였다/-다/-요` 같은 문장 종결 리듬이 여러 문장 이어져 문단이 보고서식 나열처럼 들릴 때 별도 issue로 기록합니다. `max_same_ending_run` 또는 CLI의 `--max-same-ending-run`으로 장르별 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `longestSameEndingRun`이 포함됩니다. `dominant-ending-cadence-lock`은 연속 반복을 피했더라도 대화문을 제외한 서술문 전체의 종결 계열이 한쪽으로 쏠려 문장 끝 박자가 단조롭게 잠기는 경우를 잡습니다. `max_dominant_sentence_ending_share` 또는 CLI의 `--max-dominant-ending-share`로 허용 지배율을 조정할 수 있고, style fingerprint와 authorial drift에는 `dominantSentenceEndingShare`, `dominantSentenceEndingCount`, `sentenceEndingCadenceSampleSize`가 포함됩니다. `dialogue-ending-cadence-lock`은 대화문 내부에서 `거야`, `잖아`, `습니다`, `없어` 같은 말끝 공식이 과도하게 지배해 인물 대사가 같은 입에서 나온 것처럼 들리는 경우를 잡습니다. `max_dominant_dialogue_ending_share` 또는 CLI의 `--max-dominant-dialogue-ending-share`로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `dominantDialogueEndingShare`, `dominantDialogueEndingCount`, `dialogueEndingCadenceSampleSize`가 포함됩니다. `dialogue-starter-cadence-lock`은 `아니`, `그럼`, `그러니까`, `하지만`, `근데` 같은 대화 첫머리 담화표지가 과도하게 지배해 인물별 대화 전술이 같아지는 경우를 잡습니다. `max_dominant_dialogue_starter_share` 또는 CLI의 `--max-dominant-dialogue-starter-share`로 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `dominantDialogueStarterShare`, `dominantDialogueStarterCount`, `dialogueStarterCadenceSampleSize`가 포함됩니다.

`dialogue-question-cascade`는 대화문 대부분이 의문형으로 이어져 답변, 회피, 물증 제시, 조건/거래, 행동 선택 없이 장면이 Q&A/심문 박자로 굳는 경우를 잡습니다. `max_dialogue_question_ratio`/`max_dialogue_question_run` 또는 CLI의 `--max-dialogue-question-ratio`/`--max-dialogue-question-run`으로 심문·재판·취조 장면의 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `dialogueQuestionTurnCount`, `dialogueQuestionRatio`, `longestDialogueQuestionRun`이 포함됩니다.

`dialogue-vocative-cadence-lock`은 `서연아,` `민준 씨,` `팀장님,`처럼 대화 턴이 이름·호칭 직접 호명으로 과도하게 시작되어 인물이 서로를 계속 재확인하는 듯한 인공적 박자를 만들 때 잡습니다. `max_dialogue_vocative_ratio`/`max_dialogue_vocative_run` 또는 CLI의 `--max-dialogue-vocative-ratio`/`--max-dialogue-vocative-run`으로 의례적·군대식·법정식 호명 장면의 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `dialogueVocativeTurnCount`, `dialogueVocativeRatio`, `longestDialogueVocativeRun`이 포함됩니다.

`dialogue-lexical-echo-chain`은 대화 턴이 직전 대사의 핵심어를 계속 되받아 `봉투`, `기록`, `증거` 같은 단어만 반복 설명하는 메아리 박자로 굳을 때 잡습니다. `max_dialogue_lexical_echo_ratio`/`max_dialogue_lexical_echo_run` 또는 CLI의 `--max-dialogue-lexical-echo-ratio`/`--max-dialogue-lexical-echo-run`으로 단서물·주문·법정 증거처럼 반복 대상이 장면 핵심인 경우의 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `dialogueLexicalEchoTurnCount`, `dialogueLexicalEchoRatio`, `longestDialogueLexicalEchoRun`이 포함됩니다.

`dialogue-paraphrase-confirmation-chain`은 `그러니까`, `즉`, `다시 말해서`, `결국`, `그 말은` 같은 재진술 표지와 `라는 거지/뜻이네/말이야`식 확인 종결이 여러 대화 턴을 차지해 인물의 충돌보다 정보 정리가 앞설 때 잡습니다. `max_dialogue_paraphrase_confirmation_ratio`/`max_dialogue_paraphrase_confirmation_run` 또는 CLI의 `--max-dialogue-paraphrase-confirmation-ratio`/`--max-dialogue-paraphrase-confirmation-run`으로 수사·법정·절차 장면의 허용치를 조정할 수 있고, style fingerprint와 authorial drift에는 `dialogueParaphraseConfirmationTurnCount`, `dialogueParaphraseConfirmationRatio`, `longestDialogueParaphraseConfirmationRun`이 포함됩니다.

입력 포맷은 `schemas/prose-taste-benchmark.schema.json`과 `templates/prose-taste-benchmark.template.json`을 따릅니다. 기본 입력 경로는 `reviews/prose-taste-benchmark/*.json`이고, 결과는 `reviews/prose-taste-benchmark-report.json`에 저장됩니다. 샘플은 `content`, `content_path`, 또는 `chapter`로 지정할 수 있으며, 결과에는 샘플이 inline, content_path, 실제 chapter 원고 중 어디서 왔는지 `contentSource`, `contentPath`, `chapterSourceGrounded`가 남습니다. `content_path` 파일도 source evidence digest에 포함되므로 fixture나 외부 샘플 파일이 바뀌면 리포트를 재생성해야 합니다. `reader_segment`를 함께 기록하면 장르 핵심 독자, 플랫폼 독자, 문체 민감 독자처럼 서로 다른 취향 코호트에서 같은 문체 기준이 버티는지 `readerSegmentRepresentativeness`와 `readyForStyleTuning`으로 확인합니다. `required_reader_segments`, `minimum_samples_per_reader_segment`, `minimum_failing_samples_per_reader_segment`, `maximum_dominant_reader_segment_ratio`를 지정하면 특정 독자군에 치우친 선호/비선호 샘플 세트를 style gate tuning 근거로 쓰지 않습니다. `style_friction_annotations`에 location, reason, issue code, reader segment, rewrite suggestion을 기록하면 “거슬렸다”는 반응이 장면 위치별 퇴고 근거로 보존됩니다. `style_highlight_annotations`에 location, reason, quality, reader segment, transfer guidance를 기록하면 선호 문체가 단순 통과 샘플이 아니라 다음 장면에 재현할 수 있는 긍정 문체 근거로 보존됩니다. `require_style_highlight_quality_diversity`와 `minimum_style_highlight_quality_count`를 켜면 선호 샘플의 긍정 근거가 `subtext`, `rhythm`, `sensory-grounding`, `voice` 같은 여러 품질을 실제로 덮는지 `styleHighlightQualityCount`, `styleHighlightQualities`, `weakStyleHighlightQualityDiversityCount`로 확인해, 깔끔하지만 밋밋한 문체에 과적합하지 않게 합니다. 기본 설정에서는 비선호 샘플의 탐지가 맞아 `passed=true`여도 주석이 없거나 기대 issue code를 덮지 못하면 `styleTuningUsable=false`이고, 선호 샘플도 하이라이트 주석이 없거나 actionable하지 않으면 `styleTuningUsable=false`입니다. `missingStyleFrictionAnnotationCount`/`weakStyleFrictionAnnotationCount`와 `missingStyleHighlightAnnotationCount`/`weakStyleHighlightAnnotationCount`가 남아 `readyForStyleTuning=false`의 근거가 됩니다. `require_friction_annotations`, `minimum_friction_annotations`, `minimum_actionable_friction_annotations`, `require_style_highlight_annotations`, `minimum_style_highlight_annotations`, `minimum_actionable_style_highlight_annotations`, `require_style_highlight_quality_diversity`, `minimum_style_highlight_quality_count` 또는 CLI의 `--require-friction-annotations`, `--min-friction-annotations`, `--min-actionable-friction-annotations`, `--require-style-highlight-annotations`, `--min-style-highlight-annotations`, `--min-actionable-style-highlight-annotations`, `--require-style-highlight-quality-diversity`, `--min-style-highlight-quality-count`로 기준을 조정할 수 있습니다. `calibration_split`은 문체 샘플을 `calibration`, `validation`, `holdout`으로 구분하며, 기본 설정에서는 usable holdout과 disliked-prose holdout 샘플이 없으면 `readyForStyleTuning=false`로 남겨 같은 샘플에 맞춘 문체 과보정을 막습니다. 또한 각 샘플의 원고 fingerprint를 비교해 같은 문체 evidence가 서로 다른 split에 들어간 경우 `splitLeakageCount`를 남기고 `readyForStyleTuning=false`로 처리합니다. `minimum_holdout_samples`, `minimum_usable_holdout_samples`, `minimum_failing_holdout_samples`, `minimum_usable_failing_holdout_samples`로 최소 holdout 기준을 조정할 수 있습니다. `meta/style-guide.json`의 `prose_taste_profile`을 기본값으로 사용합니다. 문체 게이트는 기능 보고체, 완충 인식 표현, 연속 단문뿐 아니라 추상 명사 설명 과다, 깨달았다/생각했다/알 수 있었다 같은 인식 필터 과다, 과거/어린 시절/몇 년 전 배경 설명이 현재 장면을 멈추는 `backstory-info-dump-block`, 시간 경과 뒤 준비·조사·상황 변화를 장면 없이 넘기는 `time-skip-summary-chain`, 것/수 있었다/상태였다 같은 명사화 설명 반복, 에 의해/에 대하여/가지고 있다/위해 같은 번역투 공식 표현, 그리고/하지만/그 순간 같은 접속 부사 시작 반복, 천천히/조용히/가만히 같은 완충 부사 박자 반복, `~며/~면서/~한 채` 행동 묶음이 과밀해 순차적 원인·결과보다 무대 지시문 리듬이 먼저 보이는 `simultaneous-action-cadence`, 바라보다/잡다/놓다/기다리다 같은 낮은 영향도 행동문이 장면 전환 없이 반복되는 `status-quo-action-loop`, 컵/봉투/휴대폰/펜 같은 소품 조작 beat가 단서나 상태 변화 없이 손동작 filler로 반복되는 `prop-fidget-loop`, 얼굴/표정/미간/입꼬리/낯빛 beat가 행동·선택·결과 없이 감정을 대신하는 `facial-expression-crutch-chain`, 시선/눈길/눈빛/고개/바라봄 beat가 단서·선택·결과 없이 장면 진행을 대신하는 `gaze-choreography-loop`, 결정적 폭로/해결/체포/구출을 사후 요약으로 넘기는 `offscreen-resolution-summary`, 쉼표 과밀, 사실/의미/상황을 보였다·드러났다로 닫는 보고식 종결, 같은 주어 반복 리듬, 정적 외부 카메라식 묘사와 시점 앵커 부족, 대사가 설정·사건 규칙·세계관 원리를 설명하는 비율이 높은 `expository-dialogue-dump`, 대사 한 턴이 지나치게 길어 장면의 왕복과 상대 반응을 압도하는 `monologue-dialogue-dump`, “네/그래/알겠어/맞아” 같은 짧은 확인·동의 대사가 연쇄되는 `rote-dialogue-response-chain`, 대사 뒤 말했다/물었다/대답했다 같은 중립 태그가 턴마다 붙는 `mechanical-dialogue-tag-chain`, 대화 장면의 무응답 beat가 턴 변화 없이 반복되는 `dialogue-silence-stall-chain`, 충격 결론 캡션이 장면 증거 없이 반복되는 `melodramatic-emotion-caption-chain`, 장면 변화 없이 평가 형용사가 누적되는 `evaluative-modifier-stack`, 자문형 의문문이 행동 전환을 대신하는 `rhetorical-question-drift`, 침묵/시선/표정의 뜻을 해설하는 `subtext-overexplanation-chain`, 인물명·역할·사물명 없이 지시어가 연속되는 `ambiguous-reference-chain`, 구체 장면 근거 없이 “운명/시작/예고/아직 몰랐다”를 선언하는 `generic-omniscient-teaser`, 마지막 문단이 실제 사건 변화 없이 미해결 질문/예고문만 남기는 `thin-cliffhanger-ending`, 장면 전환 표식 뒤 접지 없이 새 장면을 여는 `scene-transition-grounding-gap`, 은/는/이/가 주어·화제 조사로 문장 시작 박자가 잠기는 `topic-marker-cadence-lock`, 비슷한 길이의 중간 이상 서술문이 반복되어 문단 리듬이 잠기는 `uniform-sentence-length-cadence`, 같은 종결 어미가 반복되어 문장 끝 박자가 잠기는 `same-ending-run`, 이름·호칭 직접 호명이 대화 턴 첫머리를 과도하게 차지하는 `dialogue-vocative-cadence-lock`, 직전 대사의 핵심어를 계속 되받는 `dialogue-lexical-echo-chain`도 별도 issue로 기록합니다. `max_generic_teaser_density_per_1000` 또는 CLI의 `--max-generic-teasers`, `max_thin_cliffhanger_ending_count` 또는 CLI의 `--max-thin-cliffhanger-endings`, `max_backstory_exposition_density_per_1000`/`max_backstory_exposition_run` 또는 CLI의 `--max-backstory-exposition`/`--max-backstory-run`, `max_time_skip_summary_density_per_1000`/`max_time_skip_summary_run` 또는 CLI의 `--max-time-skip-summaries`/`--max-time-skip-summary-run`, `max_filler_adverb_density_per_1000`/`max_filler_adverb_run` 또는 CLI의 `--max-filler-adverbs`/`--max-filler-adverb-run`, `max_simultaneous_action_density_per_1000`/`max_simultaneous_action_run` 또는 CLI의 `--max-simultaneous-actions`/`--max-simultaneous-action-run`, `max_status_quo_action_density_per_1000`/`max_status_quo_action_run`/`min_causal_turn_density_per_1000` 또는 CLI의 `--max-status-quo-actions`/`--max-status-quo-action-run`/`--min-causal-turns`, `max_prop_fidget_beat_density_per_1000`/`max_prop_fidget_beat_run` 또는 CLI의 `--max-prop-fidget-beats`/`--max-prop-fidget-run`, `max_facial_expression_beat_density_per_1000`/`max_facial_expression_beat_run` 또는 CLI의 `--max-facial-expression-beats`/`--max-facial-expression-run`, `max_gaze_choreography_density_per_1000`/`max_gaze_choreography_run` 또는 CLI의 `--max-gaze-choreography-beats`/`--max-gaze-choreography-run`, `max_dialogue_turn_length`/`max_average_dialogue_turn_length` 또는 CLI의 `--max-dialogue-turn-length`/`--max-average-dialogue-turn-length`, `max_dialogue_vocative_ratio`/`max_dialogue_vocative_run` 또는 CLI의 `--max-dialogue-vocative-ratio`/`--max-dialogue-vocative-run`, `max_dialogue_lexical_echo_ratio`/`max_dialogue_lexical_echo_run` 또는 CLI의 `--max-dialogue-lexical-echo-ratio`/`--max-dialogue-lexical-echo-run`, `max_rote_dialogue_reply_ratio`/`max_rote_dialogue_reply_run` 또는 CLI의 `--max-rote-dialogue-reply-ratio`/`--max-rote-dialogue-reply-run`, `max_neutral_dialogue_tag_ratio`/`max_neutral_dialogue_tag_run` 또는 CLI의 `--max-neutral-dialogue-tag-ratio`/`--max-neutral-dialogue-tag-run`, `max_silence_stall_density_per_1000`/`max_silence_stall_run` 또는 CLI의 `--max-silence-stalls`/`--max-silence-stall-run`, `max_melodramatic_caption_density_per_1000`/`max_melodramatic_caption_run` 또는 CLI의 `--max-melodramatic-captions`/`--max-melodramatic-caption-run`, `max_evaluative_modifier_density_per_1000`/`max_evaluative_modifier_run` 또는 CLI의 `--max-evaluative-modifiers`/`--max-evaluative-modifier-run`, `max_ambiguous_reference_density_per_1000`/`max_ambiguous_reference_run` 또는 CLI의 `--max-ambiguous-references`/`--max-ambiguous-reference-run`, `max_scene_transition_grounding_gap_density_per_1000`/`max_scene_transition_grounding_gap_run` 또는 CLI의 `--max-scene-transition-gaps`/`--max-scene-transition-gap-run`, `max_topic_marker_starter_density_per_1000`/`max_topic_marker_starter_run` 또는 CLI의 `--max-topic-marker-starters`/`--max-topic-marker-run`, `min_sentence_length_variation_coefficient`/`max_uniform_sentence_length_run`/`max_same_ending_run` 또는 CLI의 `--min-sentence-length-variation`/`--max-uniform-sentence-run`/`--max-same-ending-run`으로 장르별 허용치를 조정할 수 있습니다. 각 issue는 가능한 경우 line, paragraph, paragraph-local sentence, target text를 함께 보존해 `/verify-chapter`와 style-stage directive가 문체 마찰 위치를 직접 가리키게 합니다.

관계·감정 전환 요약은 전체 문체 게이트에서도 독립 profile로 조정합니다. `relationship-montage-summary`는 `max_relationship_montage_summary_density_per_1000`/`max_relationship_montage_summary_run` 또는 CLI의 `--max-relationship-montage-summaries`/`--max-relationship-montage-run`으로 허용치를 조정하며, “가까워졌다/믿게 되었다/오해가 풀렸다” 같은 변화가 장면 없이 요약되는 비율을 `relationshipMontageSummaryDensityPer1000`, `longestRelationshipMontageSummaryRun`으로 남깁니다.

시간 점프 요약도 전체 문체 게이트에서 독립 profile로 조정합니다. `time-skip-summary-chain`은 `max_time_skip_summary_density_per_1000`/`max_time_skip_summary_run` 또는 CLI의 `--max-time-skip-summaries`/`--max-time-skip-summary-run`으로 허용치를 조정하며, 며칠 뒤 준비·조사·상황 변화가 물증·선택 비용·실패 조건 없이 이미 끝난 일처럼 요약되는 비율을 `timeSkipSummaryDensityPer1000`, `longestTimeSkipSummaryRun`으로 남깁니다.

대비 단정 리듬도 전체 문체 게이트에서 독립 profile로 조정합니다. `contrastive-reframe-cadence`는 `max_contrastive_reframe_density_per_1000`/`max_contrastive_reframe_run` 또는 CLI의 `--max-contrastive-reframes`/`--max-contrastive-reframe-run`으로 허용치를 조정하며, 장면 근거 없이 `X가 아니었다. Y였다`식 결론 문장이 반복되는 비율을 `contrastiveReframeDensityPer1000`, `longestContrastiveReframeRun`으로 남깁니다.

세계관 설정어 과밀도 전체 문체 게이트에서 독립 profile로 조정합니다. `lore-name-overload`는 `max_lore_term_density_per_1000`/`max_lore_term_run` 또는 CLI의 `--max-lore-terms`/`--max-lore-term-run`으로 허용치를 조정하며, 새 왕국·교단·마탑·스킬·시스템 이름이 장면 접지 없이 몰리는 비율을 `loreTermDensityPer1000`, `loreTermOverloadSentenceCount`, `longestLoreTermRun`으로 남깁니다.

선언적 결심 반복도 전체 문체 게이트에서 독립 profile로 조정합니다. `declared-resolve-loop`는 `max_declared_resolve_density_per_1000`/`max_declared_resolve_run` 또는 CLI의 `--max-declared-resolves`/`--max-declared-resolve-run`으로 허용치를 조정하며, 결심·각오·해야 함이 행동·단서·비용 없이 반복되는 비율을 `declaredResolveDensityPer1000`, `longestDeclaredResolveRun`으로 남깁니다.

폭로/해결 요약 반복도 전체 문체 게이트에서 독립 profile로 조정합니다. `revelation-summary-leap`는 `max_revelation_summary_density_per_1000`/`max_revelation_summary_run` 또는 CLI의 `--max-revelation-summaries`/`--max-revelation-summary-run`으로 허용치를 조정하며, 단서·진실·답·의문 해소가 단서 대조와 행동 결과 없이 요약되는 비율을 `revelationSummaryDensityPer1000`, `longestRevelationSummaryRun`으로 남깁니다.

조사 절차 체크리스트 반복도 전체 문체 게이트에서 독립 profile로 조정합니다. `procedural-checklist-cadence`는 `max_procedural_checklist_density_per_1000`/`max_procedural_checklist_run` 또는 CLI의 `--max-procedural-checklists`/`--max-procedural-checklist-run`으로 허용치를 조정하며, 확인·검토·대조·정리 문장이 가설 변화나 장면 결과 없이 반복되는 비율을 `proceduralChecklistDensityPer1000`, `longestProceduralChecklistRun`으로 남깁니다.

전투/액션 동작 로그 반복도 전체 문체 게이트에서 독립 profile로 조정합니다. `action-choreography-loop`는 `max_action_choreography_density_per_1000`/`max_action_choreography_run` 또는 CLI의 `--max-action-choreography`/`--max-action-choreography-run`으로 허용치를 조정하며, 공격·회피·막기·돌진 동작이 부상, 위치 변화, 목표 결과, 환경 변화 없이 반복되는 비율을 `actionChoreographyDensityPer1000`, `longestActionChoreographyRun`으로 남깁니다.

감정 라벨은 금지어가 아니라 장면 전환 책임을 지는 신호로 다룹니다. `emotion-label-carousel`이 뜬 샘플은 불안/후회/당황/분노 같은 감정명 일부를 선택, 늦어진 반응, 잘못된 판단, 관계 비용, 즉각적 결과로 바꿔야 하며, `max_emotion_label_run` 또는 CLI의 `--max-emotion-label-run`으로 장르별 허용치를 조정합니다.

문체 튜닝은 이제 선호/비선호 샘플의 정답률만 보지 않고 `styleFingerprint`도 계산합니다. `styleFingerprintStatus=separated`가 되려면 usable 선호 샘플과 usable 비선호 샘플이 기능 보고체, 감각/비유/감정 라벨 run/완충 표현/추상 명사/인식 필터/심리 용어 자기분석/배경설명 밀집/명사화/번역투/접속 부사/쉼표/보고식 종결/시점 앵커/반복 리듬/설명 대사 비율/대사 턴 길이/짧은 응답 대사/중립 대사 태그/무응답 침묵 stall/과장 감정 캡션/상투적 반응 beat/표정·얼굴 beat/시선·고개 안무 beat/모호한 분위기 수식/평가 형용사 누적/자문형 의문문/강조 문장부호/속뜻 해설문/지시어 연속/전지적 티저 밀도/장면 전환 접지 부족/주어-화제 조사 시작 박자/문장 길이 변동/균일 길이 run/종결 어미 run/종결 어미 지배율 같은 문체 metric에서 실제로 갈라져야 합니다. 금지 문구 하나만 외워서 실패 샘플을 맞힌 경우처럼 metric 분리가 약하면 `weakStyleFingerprintCount=1`과 `readyForStyleTuning=false`가 남습니다. 기준은 `require_style_fingerprint_separation`, `minimum_style_fingerprint_samples_per_polarity`, `minimum_style_fingerprint_distance`, `minimum_style_fingerprint_signal_count` 또는 CLI의 `--require-style-fingerprint-separation`, `--min-style-fingerprint-samples-per-polarity`, `--min-style-fingerprint-distance`, `--min-style-fingerprint-signals`로 조정할 수 있습니다.

관계·감정 몽타주 요약 metric도 fingerprint와 authorial style drift 계산에 포함됩니다. 따라서 선호 샘플은 장면으로 관계 전환을 보여주고 비선호 샘플은 요약으로 넘기는 경향이 있다면, 금지 문구가 아니라 `relationshipMontageSummaryDensityPer1000`과 `longestRelationshipMontageSummaryRun`의 거리로도 분리 근거를 확인합니다.

문체 튜닝은 이제 회차별 작가 문체 연속성도 선택적으로 봅니다. `require_authorial_style_continuity`를 켜면 `chapter` 번호가 붙은 usable 선호 문체 샘플을 회차 순서로 비교해 `authorialStyleDriftStatus`, `authorialStyleDriftMaxDistance`, `authorialStyleDriftPairCount`, `weakAuthorialStyleDriftCount`를 남깁니다. 선호 문체 샘플이 1화에는 담백한 제한시점이었다가 2화에서 갑자기 과밀한 감각문/보고문/장문 대사 턴/대화 태그/종결 어미 리듬으로 바뀌는 식의 authorial style drift가 있으면 `readyForStyleTuning=false`가 됩니다. 기준은 `minimum_authorial_style_continuity_samples`, `maximum_authorial_style_drift`, `require_authorial_style_continuity` 또는 CLI의 `--min-authorial-style-continuity-samples`, `--max-authorial-style-drift`, `--require-authorial-style-continuity`, `--no-require-authorial-style-continuity`로 조정할 수 있습니다.

`reviews/prose-taste-benchmark-report.json`이 있으면 `/verify-chapter`의 `apply-chapter-gate`가 문체 벤치마크 결과도 `proseCraft` 완료 판정에 병합합니다. 샘플에 `chapter`가 있으면 현재 회차 샘플만 적용하고, 새 리포트에서는 `chapterSourceGrounded=true`인 샘플만 현재 회차 원고를 hard block하는 근거로 씁니다. 즉 `chapter: 1` 라벨이 붙었더라도 inline fixture나 별도 `content_path` 샘플이면 경고로 남고, 실제 `chapters/chapter_001.md`에서 리포트를 재생성해야 회차 완료 차단 근거가 됩니다. 현재 회차 원고가 독자 비선호 문체로 라벨링됐거나 `false-positive`, `missing-issue`, 비선호 샘플의 `score-out-of-range`가 남아 있으면 validator 점수와 engagement가 높아도 해당 회차 gate는 `RETRY`가 됩니다. 샘플에 `chapter`가 전혀 없는 기존 리포트는 프로젝트 전역 문체 캘리브레이션으로 보며, 명확한 false positive나 missing issue만 완료 차단 근거로 씁니다. 실패 시 `style_friction_annotations`의 location, reason, issue code, rewrite suggestion이 `Prose Craft Revision Directives`로 전달되어 “거슬리는 문체”를 장면 위치별 퇴고 지시로 바꿉니다.

### 독자 반응 캘리브레이션

자동 평가가 높아도 실제 독자가 다음 화를 누르고 싶어 하지 않는 경우를 잡기 위해, 베타리더/패널 반응을 `reviews/reader-response/*.json`에 저장하고 자동 engagement 점수와 비교할 수 있습니다.

```bash
node dist/cli/calibrate-reader-response.js --project novels/{novel_id} --json
```

입력 포맷은 `schemas/reader-response-calibration.schema.json`과 `templates/reader-response-calibration.template.json`을 따릅니다. 설문 점수는 0-100 또는 1-7 리커트 척도를 지원하며, 다음 화 클릭 의향, attention, emotional engagement, mental imagery, transportation, character attachment, relationship investment, novelty, surprise, resonance, scene recall, recommendation intent, bookmark intent, return intent, purchase intent, binge intent, interest, suspense, beauty, amusement, overall liking을 분리해 봅니다. `novelty`/`surprise`/`resonance`는 자동 점수와 기본 재미 점수는 높지만 독자에게 새롭지 않고, 놀랍지 않고, 읽고 난 잔향이 약한 generic-but-polished 원고를 blind spot으로 드러내기 위한 축입니다. `scene_recall`은 독자가 읽은 뒤 자발적으로 떠올리는 장면이 있는지 보는 축이고, `recommendation_intent`는 좋았다는 반응이 실제 추천/공유/토론 의향으로 이어지는지 보는 축입니다. `bookmark_intent`/`return_intent`/`purchase_intent`/`binge_intent`는 좋아했다는 응답이 저장, 팔로우, 재방문, 유료 계속읽기, 몰아읽기 같은 장기 행동 의지로 이어지는지 분리합니다.

`evidence`에는 `respondent_source`, `human_respondent_count`, `synthetic_respondent_count`, `author_estimate_count`로 반응 출처를 먼저 기록합니다. 기본 설정에서는 `human-target-reader` 또는 `human-general-reader`가 80% 이상인 샘플만 threshold retuning용 인간 독자 근거로 보며, `synthetic-ai`, `author-estimate`, `unknown` 또는 출처가 섞였지만 인간 응답 수가 명확하지 않은 샘플은 원고 참고용으로만 남기고 gate tuning/98+ readiness 근거에서 제외합니다. 기준은 `require_human_reader_evidence`, `minimum_human_respondent_ratio` 또는 CLI의 `--require-human-reader-evidence`, `--no-require-human-reader-evidence`, `--min-human-respondent-ratio`로 조정할 수 있습니다.

`manuscript_word_count`, `manuscript_character_count`, `median_read_time_seconds`, `minimum_read_time_seconds`, `speeding_response_count`, `straight_lining_response_count`, `duplicate_response_count`, `bot_suspected_response_count`, `low_quality_open_ended_response_count`, `inconsistent_response_count`, `quality_flagged_response_count`를 기록하면 인간 독자 패널 안에서도 원고 길이 대비 비현실적 속독, 직선응답, 중복 응답, 봇 의심, 부실 자유응답, 반복 문항 불일치, 고유 품질 플래그 비율을 분리합니다. 한국어 원고는 띄어쓰기/어절 기준이 흔들릴 수 있으므로 `manuscript_character_count`를 함께 저장하면 CPM 기준으로도 읽기시간 타당성을 검증합니다. 기본 설정에서는 timing/speeding 근거, length-normalized read-time 근거, pattern/fraud 근거가 모두 있어야 `responseDataQuality=usable`이며, 하나라도 약하면 threshold retuning과 98+ readiness 근거에서 제외합니다. 기준은 `require_response_data_quality`, `minimum_median_read_time_seconds`, `maximum_median_reading_words_per_minute`, `maximum_minimum_reading_words_per_minute`, `maximum_median_reading_characters_per_minute`, `maximum_minimum_reading_characters_per_minute`, `require_length_normalized_read_time`, `maximum_speeding_response_ratio`, `maximum_straight_lining_response_ratio`, `maximum_duplicate_response_ratio`, `maximum_bot_suspected_response_ratio`, `maximum_low_quality_open_ended_ratio`, `maximum_inconsistent_response_ratio`, `maximum_quality_flagged_response_ratio` 또는 CLI의 `--require-response-data-quality`, `--no-require-response-data-quality`, `--min-median-read-time-seconds`, `--max-median-reading-wpm`, `--max-minimum-reading-wpm`, `--max-median-reading-cpm`, `--max-minimum-reading-cpm`, `--require-length-normalized-read-time`, `--no-require-length-normalized-read-time`, `--max-speeding-response-ratio`, `--max-straight-lining-response-ratio`, `--max-duplicate-response-ratio`, `--max-bot-suspected-response-ratio`, `--max-low-quality-open-ended-ratio`, `--max-inconsistent-response-ratio`, `--max-quality-flagged-response-ratio`로 조정할 수 있습니다.

`evidence`에는 target reader 수, 타깃 독자 세그먼트 수, 가장 큰 독자 세그먼트 비율, 시작 독자 수, 완독 수, 중도 이탈 수, 훑어읽기 수, 자유 코멘트 수, 장면/문단 마찰 지점 수, 위치/원인이 있는 actionable friction 수, 재작성 제안 수를 기록합니다. `started_read_count`, `completed_read_count`, `drop_off_count`, `skimmed_read_count`가 없으면 완독자 평균만 남아 중도 포기 독자와 훑어읽은 독자를 숨길 수 있으므로, 기본 설정에서는 `retentionEvidence=usable`이 아닌 샘플을 threshold retuning 근거로 쓰지 않습니다. 기준은 `require_retention_evidence`, `minimum_started_read_count`, `minimum_panel_completion_rate`, `maximum_drop_off_ratio`, `maximum_skimmed_read_ratio` 또는 CLI의 `--require-retention-evidence`, `--no-require-retention-evidence`, `--min-started-readers`, `--min-completion-rate`, `--max-drop-off-ratio`, `--max-skimmed-ratio`로 조정할 수 있습니다. `drop_off_count`나 `skimmed_read_count`가 1 이상이면 기본 설정에서는 `drop_off_annotations`도 필요합니다. 각 항목에는 `event_type`(`drop-off`, `skim`, `slowdown`, `mind-wandering`), `location`, `last_completed_location` 또는 `trigger_quote`, `reason`, `reader_count`, `reader_segment`, `suggested_revision`을 기록해 독자가 어느 장면/문장/전환에서 멈췄는지 퇴고 지시로 바꿉니다. 기준은 `require_drop_off_localization_evidence`, `minimum_drop_off_annotations`, `minimum_actionable_drop_off_annotations` 또는 CLI의 `--require-drop-off-localization-evidence`, `--no-require-drop-off-localization-evidence`, `--min-drop-off-annotations`, `--min-actionable-drop-off-annotations`로 조정할 수 있습니다. 또한 `friction_annotations`에 location, reason, affected dimension, severity, rewrite_suggestion, reader_segment를 저장하면 `calibrate-reader-response`가 이를 구조화된 독자 마찰 근거로 보존하고, `/verify-chapter`의 `Reader Response Revision Directives`가 해당 위치별 퇴고 지시를 직접 출력합니다. 기본 설정에서는 `annotation_coder_count`, `annotation_double_coded_count`, `annotation_agreement_rate`, `annotation_reliability_metric`, `annotation_codebook_version`, `annotation_adjudicated`, `annotation_coder_blinded`가 충분하지 않은 샘플을 gate retuning 근거로 쓰지 않습니다. 기준은 `require_annotation_reliability_evidence`, `minimum_annotation_coder_count`, `minimum_annotation_double_coded_count`, `minimum_annotation_agreement_rate` 또는 CLI의 `--require-annotation-reliability`, `--no-require-annotation-reliability`, `--min-annotation-coders`, `--min-annotation-double-coded`, `--min-annotation-agreement`로 조정할 수 있습니다.

장면 기억 근거는 `unprompted_scene_recall_count`, `distinctive_scene_recall_count`, `scene_recall_annotations`로 기록합니다. 기본 설정에서는 자발 회상 비율, 특징적 회상 비율, 장면 회상 annotation 수가 부족한 샘플을 gate threshold retuning용 usable evidence로 보지 않습니다. 기준은 `require_scene_recall_evidence`, `minimum_unprompted_scene_recall_ratio`, `minimum_distinctive_scene_recall_ratio`, `minimum_scene_recall_annotations` 또는 CLI의 `--require-scene-recall-evidence`, `--no-require-scene-recall-evidence`, `--min-unprompted-scene-recall-ratio`, `--min-distinctive-scene-recall-ratio`, `--min-scene-recall-annotations`로 조정할 수 있습니다.

장면 긴장 추적 근거는 `tension_trace_point_count`, `tension_peak_count`, `tension_question_count`, `tension_trace_annotations`로 기록합니다. `tension_trace_annotations`에는 `experienced_tension`, `suspense_level`, `curiosity_level`, `surprise_level`, `narrative_question`, `stake_or_risk`, `reader_count`, `reader_segment`를 넣어 어느 장면에서 독자가 실제로 긴장, 궁금증, 놀라움, 위험을 느꼈는지 보존합니다. 기본 설정에서는 장면 긴장 추적 비율, 고점 비율, 질문/위험 비율, tension trace annotation 수가 부족한 샘플을 gate threshold retuning용 usable evidence로 보지 않습니다. 기준은 `require_tension_trace_evidence`, `minimum_tension_trace_ratio`, `minimum_tension_peak_ratio`, `minimum_tension_question_ratio`, `minimum_tension_trace_annotations` 또는 CLI의 `--require-tension-trace-evidence`, `--no-require-tension-trace-evidence`, `--min-tension-trace-ratio`, `--min-tension-peak-ratio`, `--min-tension-question-ratio`, `--min-tension-trace-annotations`로 조정할 수 있습니다.

서사 예측 근거는 `forecast_prediction_count`, `forecast_diversity_count`, `forecast_revision_count`, `forecast_mismatch_count`, `forecast_inflection_count`, `narrative_forecast_annotations`로 기록합니다. `narrative_forecast_annotations`에는 `initial_prediction`, `revised_prediction`, `actual_outcome`, `prediction_mismatch`, `prediction_shift`, `surprise_or_tension_reason`, `reader_count`, `reader_segment`를 넣어 독자가 어떤 결과를 예상했고, 어느 단서나 선택 때문에 예측을 바꿨으며, 실제 결과와의 공정한 불일치가 긴장이나 놀라움으로 작동했는지 보존합니다. 기본 설정에서는 예측 참여 비율, 예측 다양성, 예측 수정 비율, 예측 불일치 비율, narrative forecast annotation 수가 부족한 샘플을 gate threshold retuning용 usable evidence로 보지 않습니다. 기준은 `require_narrative_forecast_evidence`, `minimum_forecast_prediction_ratio`, `minimum_forecast_diversity_count`, `minimum_forecast_revision_ratio`, `minimum_forecast_mismatch_ratio`, `minimum_narrative_forecast_annotations` 또는 CLI의 `--require-narrative-forecast-evidence`, `--no-require-narrative-forecast-evidence`, `--min-forecast-prediction-ratio`, `--min-forecast-diversity-count`, `--min-forecast-revision-ratio`, `--min-forecast-mismatch-ratio`, `--min-narrative-forecast-annotations`로 조정할 수 있습니다.

문장 인용성 근거는 `quote_recall_count`, `favorite_line_count`, `shareable_line_count`, `line_quote_annotations`로 기록합니다. `line_quote_annotations`에는 `quoted_line`, `appeal_reason`, `share_reason`, `line_function`, `reader_count`, `reader_segment`를 넣어 독자가 실제로 기억하거나 좋아하거나 남에게 보여주고 싶은 문장을 보존합니다. 기본 설정에서는 문장 회상 비율, 선호 문장 비율, 공유/인용 가능 문장 비율, line quote annotation 수가 부족한 샘플을 gate threshold retuning용 usable evidence로 보지 않습니다. 기준은 `require_line_quote_evidence`, `minimum_quote_recall_ratio`, `minimum_favorite_line_ratio`, `minimum_shareable_line_ratio`, `minimum_line_quote_annotations` 또는 CLI의 `--require-line-quote-evidence`, `--no-require-line-quote-evidence`, `--min-quote-recall-ratio`, `--min-favorite-line-ratio`, `--min-shareable-line-ratio`, `--min-line-quote-annotations`로 조정할 수 있습니다.

회수 공정성 근거는 `payoff_setup_recall_count`, `payoff_trigger_recognition_count`, `payoff_earned_count`, `payoff_recontextualization_count`, `payoff_emotional_satisfaction_count`, `payoff_fairness_annotations`로 기록합니다. `payoff_fairness_annotations`에는 `payoff_moment`, `remembered_setup`, `trigger_or_reveal`, `changed_interpretation`, `earned_reason`, `arbitrary_or_cheat_reason`, `emotional_payoff_reason`, `reader_count`, `reader_segment`를 넣어 독자가 어떤 setup을 기억했고, 어떤 trigger로 연결했으며, 회수가 공정하고 감정적으로 만족스러웠는지 보존합니다. 기본 설정에서는 setup 회상, trigger 인식, earned payoff, 재해석, 감정 보상, payoff fairness annotation이 부족한 샘플을 gate threshold retuning용 usable evidence로 보지 않습니다. 기준은 `require_payoff_fairness_evidence`, `minimum_payoff_setup_recall_ratio`, `minimum_payoff_trigger_recognition_ratio`, `minimum_payoff_earned_ratio`, `minimum_payoff_recontextualization_ratio`, `minimum_payoff_emotional_satisfaction_ratio`, `minimum_payoff_fairness_annotations` 또는 CLI의 `--require-payoff-fairness-evidence`, `--no-require-payoff-fairness-evidence`, `--min-payoff-setup-recall-ratio`, `--min-payoff-trigger-recognition-ratio`, `--min-payoff-earned-ratio`, `--min-payoff-recontextualization-ratio`, `--min-payoff-emotional-satisfaction-ratio`, `--min-payoff-fairness-annotations`로 조정할 수 있습니다.

추천/토론 근거는 `organic_recommendation_count`, `discussion_prompt_count`, `advocacy_annotations`로 기록합니다. `advocacy_annotations`에는 `share_trigger`, `recommended_audience`, `discussion_prompt`, `reader_count`, `reader_segment`를 넣어 독자가 왜 남에게 권하거나 어떤 질문을 토론하고 싶어 했는지 보존합니다. 기본 설정에서는 자연 추천 비율, 토론 유발 비율, advocacy annotation 수가 부족한 샘플을 gate threshold retuning용 usable evidence로 보지 않습니다. 기준은 `require_advocacy_evidence`, `minimum_organic_recommendation_ratio`, `minimum_discussion_prompt_ratio`, `minimum_advocacy_annotations` 또는 CLI의 `--require-advocacy-evidence`, `--no-require-advocacy-evidence`, `--min-organic-recommendation-ratio`, `--min-discussion-prompt-ratio`, `--min-advocacy-annotations`로 조정할 수 있습니다.

지속 참여 근거는 `bookmark_count`, `follow_or_library_add_count`, `return_next_day_count`, `binge_read_intent_count`, `paid_continuation_intent_count`, `durable_engagement_annotations`로 기록합니다. `durable_engagement_annotations`에는 `commitment_trigger`, `intended_action`, `reader_count`, `reader_segment`, `reason`을 넣어 독자가 왜 저장, 팔로우, 재방문, 몰아읽기, 유료 계속읽기를 하려 했는지 보존합니다. 기본 설정에서는 북마크/팔로우 비율과 재방문/몰아읽기 비율이 함께 충분하거나 유료 계속읽기 의향이 충분하고, durable engagement annotation도 있어야 gate threshold retuning용 usable evidence로 봅니다. 기준은 `require_durable_engagement_evidence`, `minimum_bookmark_ratio`, `minimum_return_intent_ratio`, `minimum_paid_continuation_intent_ratio`, `minimum_durable_engagement_annotations` 또는 CLI의 `--require-durable-engagement-evidence`, `--no-require-durable-engagement-evidence`, `--min-bookmark-ratio`, `--min-return-intent-ratio`, `--min-paid-continuation-intent-ratio`, `--min-durable-engagement-annotations`로 조정할 수 있습니다.

실제 다음 회차 이동 행동은 `next_chapter_cta_impression_count`, `next_chapter_click_count`, `next_chapter_open_count`, `next_chapter_read_start_count`로 따로 기록합니다. 즉시 설문에서 다음 화를 누르겠다고 답한 비율이나 저장 의향이 높아도, CTA가 노출됐을 때 실제로 클릭하거나 다음 회차를 열고 읽기 시작하지 않으면 장편 연재 게이트를 과대 보정할 수 있습니다. 기본 설정에서는 충분한 CTA 노출수와 다음 회차 클릭/열람/읽기 시작 비율이 있어야 `continuationBehaviorEvidence=usable`이며, 없거나 약하면 `lowContinuationBehaviorEvidenceCount`와 `low continuation behavior` tuning blocker로 남아 gate threshold retuning에 쓰이지 않습니다. 단, 현재 회차의 신뢰 가능한 독자 패널에서 실제 CTA 노출·클릭·열람·읽기 시작 카운트가 수집됐고 그 행동 비율이 약해 `continuationBehaviorEvidence=weak`가 된 경우에는 `/verify-chapter`의 `apply-chapter-gate`가 `continuation-behavior-drop`으로 Ralph 완료를 차단하고 `actual-continuation-behavior` revision directive를 생성합니다. 기준은 `require_continuation_behavior_evidence`, `minimum_continuation_behavior_impressions`, `minimum_next_chapter_click_through_ratio`, `minimum_next_chapter_open_ratio`, `minimum_next_chapter_read_start_ratio` 또는 CLI의 `--require-continuation-behavior-evidence`, `--no-require-continuation-behavior-evidence`, `--min-continuation-behavior-impressions`, `--min-next-chapter-click-through-ratio`, `--min-next-chapter-open-ratio`, `--min-next-chapter-read-start-ratio`로 조정할 수 있습니다.

사후 잔향 근거는 `lingering_emotion_count`, `reflective_comment_count`, `personal_memory_or_meaning_count`, `resonance_annotations`로 기록합니다. `resonance_annotations`에는 `lingering_emotion`, `reflective_question`, `remembered_image`, `personal_meaning`, `reader_count`, `reader_segment`를 넣어 독자가 읽고 난 뒤 어떤 감정, 질문, 이미지, 개인적 의미를 들고 나갔는지 보존합니다. 기본 설정에서는 잔류 감정 비율, 성찰/의미 반응 비율, resonance annotation 수가 부족한 샘플을 gate threshold retuning용 usable evidence로 보지 않습니다. 기준은 `require_resonance_evidence`, `minimum_lingering_emotion_ratio`, `minimum_reflective_meaning_ratio`, `minimum_resonance_annotations` 또는 CLI의 `--require-resonance-evidence`, `--no-require-resonance-evidence`, `--min-lingering-emotion-ratio`, `--min-reflective-meaning-ratio`, `--min-resonance-annotations`로 조정할 수 있습니다.

지연 기억 근거는 `delayed_follow_up_respondent_count`, `delayed_follow_up_hours`, `delayed_scene_recall_count`, `delayed_character_recall_count`, `delayed_next_click_intent_count`, `delayed_return_intent_count`, `delayed_paid_continuation_intent_count`, `delayed_memory_annotations`로 기록합니다. `delayed_memory_annotations`에는 `delayed_remembered_moment`, `delayed_character_or_relationship`, `delayed_next_question`, `return_or_purchase_reason`, `reader_count`, `reader_segment`를 넣어 즉시 설문이 아니라 시간이 지난 뒤에도 남은 장면, 인물/관계 압박, 다음 회차 질문, 복귀/구매 이유를 보존합니다. 기본 설정에서는 원 응답자의 50% 이상이 최소 20시간 뒤 follow-up에 응답하고, 장면 회상·인물/관계 회상·계속읽기 의향·annotation이 충분해야 gate threshold retuning용 usable evidence로 봅니다. 기준은 `require_delayed_memory_evidence`, `minimum_delayed_follow_up_respondent_ratio`, `minimum_delayed_follow_up_hours`, `minimum_delayed_scene_recall_ratio`, `minimum_delayed_character_recall_ratio`, `minimum_delayed_continuation_intent_ratio`, `minimum_delayed_memory_annotations` 또는 CLI의 `--require-delayed-memory-evidence`, `--no-require-delayed-memory-evidence`, `--min-delayed-follow-up-ratio`, `--min-delayed-follow-up-hours`, `--min-delayed-scene-recall-ratio`, `--min-delayed-character-recall-ratio`, `--min-delayed-continuation-intent-ratio`, `--min-delayed-memory-annotations`로 조정할 수 있습니다.

기본 설정에서는 인간 독자 provenance가 없거나 약한 샘플, response data-quality 근거가 없거나 약한 샘플, 숫자 카운트만 있는 샘플, 시작/완독/이탈/훑어읽기 retention 근거가 약한 샘플, 실제 이탈/훑어읽기가 있었지만 `drop_off_annotations`로 위치와 원인을 좁히지 못한 샘플, 낮게 나온 reader-response dimension을 같은 dimension의 actionable `friction_annotations`가 덮지 못하는 샘플, actionable annotation의 `reader_segment`가 없거나 한 독자군에 쏠린 샘플, annotation coding reliability 근거가 약한 샘플, 장면 회상 근거가 약한 샘플, 장면 긴장 추적 근거가 약한 샘플, 서사 예측 근거가 약한 샘플, 문장 인용성 근거가 약한 샘플, 회수 공정성 근거가 약한 샘플, 추천/토론 advocacy 근거가 약한 샘플, 지속 참여 근거가 약한 샘플, 실제 다음 회차 이동 행동 근거가 약한 샘플, 사후 잔향 근거가 약한 샘플, 지연 기억/복귀 의향 근거가 약한 샘플, 또는 요구된 개정 효과 검증이 약한 샘플은 원고 수정 참고용으로는 볼 수 있지만 gate threshold retuning용 usable evidence로 보지 않습니다. 추가로 `reader_score_standard_deviation`, `high_response_count`, `neutral_response_count`, `low_response_count`를 기록하면 평균 점수가 가리는 패널 양극화와 낮은 합의도를 `panelConsensus`로 분리하고, 응답자 수와 표준편차로 95% 오차범위인 `readerScoreMarginOfError`와 `readerScoreConfidence`를 산출합니다. `target_reader_segment_count`와 `dominant_reader_segment_ratio`는 한 독자군이 패널을 지배하는지 `cohortRepresentativeness`로 분리합니다. `blind_reading`, `author_identity_masked`, `prior_exposure_screened`, `unexcluded_prior_exposure_count`, `spoiler_exposure_screened`, `unexcluded_spoiler_exposure_count`, `neutral_question_wording`, `response_option_order_randomized`, `sample_order_randomized`, `manuscript_order_counterbalanced`, `max_samples_per_respondent`, `order_balance_ratio`, `question_wording_disclosed`, `recruitment_method_disclosed`, `recruitment_channel_counts`, `population_definition_disclosed`, `sampling_frame_disclosed`, `survey_mode_disclosed`, `incentive_disclosed`, `attention_check_pass_count`, `excluded_response_count`는 패널 점수가 작가/출처 단서, 기존 원고 노출, 스포일러/시놉시스 노출, 조사 방식 편향, 반복 원고 노출의 순서/피로 효과, 또는 불투명한 표본 설계 영향을 탔는지 `panelProtocolQuality`로 분리합니다. 루트 옵션 `maximum_samples_per_respondent`, `minimum_order_balance_ratio` 또는 CLI의 `--max-samples-per-respondent`, `--min-order-balance-ratio`로 반복 노출 기준을 조정할 수 있습니다.

타깃 독자 대표성은 전체 세그먼트 수만으로 통과시키지 않습니다. `required_target_reader_segments`, `minimum_respondents_per_required_target_segment`, `require_target_reader_segment_quotas`와 샘플별 `target_reader_segment_counts`를 기록하면 장르 핵심 독자, 플랫폼 독자, 문체 민감 독자 같은 필수 quota cell이 실제로 채워졌는지 `cohortRepresentativeness`가 함께 검사합니다. 필수 cell이 비어 있으면 `target_reader_segment_count`와 `dominant_reader_segment_ratio`가 좋아 보여도 gate threshold retuning의 usable evidence로 세지 않습니다.

모집 경로 투명성도 단순한 `recruitment_method_disclosed=true`만으로 통과시키지 않을 수 있습니다. `required_recruitment_channels`, `minimum_respondents_per_required_recruitment_channel`, `maximum_dominant_recruitment_channel_ratio`, `require_recruitment_channel_diversity`와 샘플별 `recruitment_channel_counts`를 기록하면 opt-in panel, 뉴스레터, 플랫폼 커뮤니티, 외부 베타리더 풀 같은 모집 경로가 실제 응답자 수로 채워졌는지 `panelProtocolQuality`가 함께 검사합니다. 필수 모집 경로가 비어 있거나 `recruitment_channel_counts` 총합이 `respondent_count`와 맞지 않거나 한 모집 경로가 지정 비율을 넘으면, 독자 점수와 타깃 세그먼트가 좋아 보여도 gate threshold retuning의 usable evidence로 세지 않습니다.

`comparative_reference_label`, `comparative_preference_current_count`, `comparative_preference_reference_count`, `comparative_preference_tie_count`, `comparative_preference_respondent_count`, `comparative_blind_pairwise`, `comparative_same_reader_cohort`, `comparative_question_wording_disclosed`를 기록하면 절대 독자 점수는 높지만 같은 타깃 독자군의 기준작/대안 원고와 blind pairwise 비교에서 밀리는 샘플을 `comparativePreferenceStatus`와 `weakComparativePreferenceCount`로 드러냅니다. `require_comparative_preference`, `minimum_comparative_preference_win_rate`, `minimum_comparative_preference_respondents` 또는 CLI의 `--require-comparative-preference`, `--min-comparative-win-rate`, `--min-comparative-respondents`를 쓰면 기준작 대비 선호율이 충분하지 않은 상태에서는 gate threshold retuning을 준비 완료로 보지 않습니다.

`revision_pair_id`, `revision_baseline_reader_score`, `revision_current_reader_score`, `revision_preference_revised_count`, `revision_preference_baseline_count`, `revision_preference_tie_count`, `revision_preference_respondent_count`, `revision_blind_comparison`, `revision_same_reader_cohort`, `revision_question_wording_disclosed`, `revision_guardrail_regression_count`를 기록하면 독자 마찰 주석이나 revision directive를 적용한 뒤 실제 독자 반응이 baseline보다 좋아졌는지 `revisionOutcomeEvidence`, `revisionLift`, `revisionPreferenceWinRate`, `revisionRegressionCount`로 분리합니다. `require_revision_outcome_evidence`, `minimum_revision_lift`, `minimum_revision_preference_win_rate`, `minimum_revision_preference_respondents` 또는 CLI의 `--require-revision-outcome-evidence`, `--no-require-revision-outcome-evidence`, `--min-revision-lift`, `--min-revision-preference-win-rate`, `--min-revision-preference-respondents`를 쓰면 개정 효과가 검증되지 않은 상태에서는 gate threshold retuning을 준비 완료로 보지 않습니다. 개정본이 baseline보다 퇴보하거나 guardrail regression이 있으면 요구 옵션과 무관하게 `masterpiece-readiness`의 critical gap으로 남습니다.

`calibration_split`은 샘플을 `calibration`, `validation`, `holdout`으로 구분하며, 기본 설정에서는 최소 usable holdout 샘플이 없으면 hard gate threshold retuning을 준비 완료로 보지 않습니다. 합의도가 `clear`가 아니거나, 신뢰도가 `precise`가 아니거나, 대표성이 `balanced`가 아니거나, 패널 프로토콜이 `strong`이 아니거나, `humanReaderEvidence`, `responseDataQuality`, `evidenceQuality`, `annotationReliability`, `retentionEvidence`, `dropOffLocalizationEvidence`, `sceneRecallEvidence`, `tensionTraceEvidence`, `narrativeForecastEvidence`, `payoffFairnessEvidence`, `advocacyEvidence`, `durableEngagementEvidence`, `continuationBehaviorEvidence`, `resonanceEvidence`, `delayedMemoryEvidence`가 `usable`이 아니거나, 요구된 `comparativePreferenceStatus`가 `strong`이 아니거나, holdout split이 부족한 샘플 세트는 원고 수정 근거로 참고할 수는 있지만 gate threshold retuning의 usable coverage로 세지 않습니다. `required_genres`, `minimum_samples_per_genre`, `minimum_usable_samples_per_genre`, `required_series_length`, `required_usable_series_length`, `minimum_holdout_samples`, `minimum_usable_holdout_samples`를 지정하면 장르별 독자 패널 coverage, 연속 회차 coverage, holdout coverage가 부족한 상태에서는 gate threshold retuning을 준비 완료로 보지 않습니다. `required_chapter_ranges`를 지정하면 초반/중반/후반 같은 회차 구간별 패널 샘플과 usable 샘플도 따로 요구할 수 있어, 초반 반응만으로 장편 중후반 기준을 조정하는 일을 막습니다. 리포트의 `gateTuningSuggestions`는 이 모든 조건이 준비되지 않았을 때 `collect-more-reader-evidence`만 제안하고, 준비가 된 뒤에도 기본적으로 holdout usable 샘플에서 확인된 경우에만 `tighten-automated-high-pass`, `loosen-reader-loved-low-score-route`, `increase-reader-dimension-sensitivity`, `hold-current-gates` 같은 안전한 조정 후보를 evidence sample id와 함께 남깁니다. 동시에 `evidenceCollectionPlan`은 부족한 항목을 `id`, `priority`, `target`, `currentValue`, `requiredValue`, `sampleIds`, `action`, `rationale`가 있는 수집 작업으로 풀어 줍니다. 예를 들어 인간 독자 provenance, response data quality, localized drop-off events, actionable friction, annotation reliability, actual continuation behavior, holdout, 장르/회차 coverage, delayed memory follow-up, blind comparative preference, baseline 대비 개정 효과가 부족하면 보고서가 다음에 모아야 할 독자 패널 증거를 항목별로 지정합니다.

`reviews/reader-response-calibration.json`이 있으면 `/verify-chapter`의 `apply-chapter-gate`가 usable 독자 패널 샘플을 최종 완료 판정에 반영합니다. 자동 점수가 높아도 `auto-false-positive`, `auto-overestimate`, 약한 next-click 반응, 또는 baseline 대비 퇴보한 `revisionOutcomeEvidence=regressed`가 있으면 해당 회차 gate는 `RETRY`가 됩니다. 단, 새 캘리브레이션 결과에서 `evidenceQuality`가 `none` 또는 `weak`이면 완료 차단에는 쓰지 않고 근거 부족 경고로만 남깁니다.

회차 gate는 `reviews/prose-taste-benchmark-report.json`, `reviews/reader-response-calibration.json`, `reviews/character-relationship-benchmark-report.json`, `reviews/series-retention-benchmark-report.json`, `reviews/consistency-report.json`의 `sourceEvidence`도 확인합니다. 현재 회차에 적용되는 샘플이 있는데 리포트의 source digest가 현재 `reviews/*-benchmark/`, `reviews/reader-response/`, `meta/style-guide.json`, `meta/quality-trend.json`, `chapters/`, `world/`, `characters/`, `plot/`, 또는 `context/summaries/` 입력과 맞지 않으면 validator 점수와 독자 점수가 높아도 `stale-report:*`로 gate를 `RETRY`로 돌립니다. `consistency-report`는 수동 생성 리포트 호환을 위해 sourceEvidence가 없더라도 report 작성 뒤 원고/세계관/인물/플롯 소스가 수정됐으면 stale로 봅니다. 입력 소스가 있는 새 프로젝트에서는 리포트를 재생성한 뒤 회차 gate를 다시 실행해야 합니다.

`reviews/consistency-report.json`이 있으면 `/verify-chapter`의 `apply-chapter-gate`가 현재 회차를 장편 일관성 완료 판정에 반영합니다. 리포트가 현재 회차를 덮지 않거나, `chapters_analyzed`에 현재 회차가 없거나, character/timeline/setting/factual/plot_logic 도메인 coverage가 빠지거나, 현재/이전 회차의 unresolved consistency issue가 남아 있거나, 리포트 작성 뒤 canonical source가 바뀌었으면 validator 점수와 독자 몰입 점수가 높아도 해당 회차 gate는 `RETRY`가 됩니다. `critical`, `major`, `minor` issue는 모두 회차 진행 전에 해소해야 하며, 미래 회차에만 위치한 issue는 해당 회차 gate까지 유예됩니다.

### 대작 준비도 종합 리포트

개별 벤치마크가 모두 생성된 뒤에는 종합 readiness 리포트로 전제, 회차 재미, 장기 유지력, 인물/관계, 장편 일관성, 문체 취향, 독자 반응 샘플이 함께 충분한지 확인할 수 있습니다.

```bash
node dist/cli/run-masterpiece-readiness.js --project novels/{novel_id} --json
```

이 명령은 `reviews/premise-appeal-benchmark-report.json`, `reviews/engagement-benchmark-report.json`, `reviews/series-retention-benchmark-report.json`, `reviews/character-relationship-benchmark-report.json`, `reviews/consistency-report.json`, `reviews/prose-taste-benchmark-report.json`, `reviews/reader-response-calibration.json`을 읽어 `reviews/masterpiece-readiness-report.json`을 저장합니다. `reviews/consistency-report.json`은 최소 3개 회차와 character, timeline, setting, factual, plot_logic 5개 domain coverage를 갖춰야 readiness evidence가 되며, critical/major consistency issue는 critical gap으로, minor issue는 major gap으로 남습니다. `overallScore`가 기본 98점 이상이어도 missing report, failing sample, false positive, holdout 부족, weak reader evidence, 장편 일관성 coverage 부족이나 unresolved consistency issue가 남아 있으면 `passed=false`로 표시합니다. 또한 한 영역의 `accuracy`가 98점 기준 아래로 내려가면 가중 평균이 98점을 넘더라도 `low-readiness-accuracy` major gap으로 남고, 독자 반응의 `calibrationScore`는 readiness 영역 점수로 정규화되며 98 미만이면 `low-calibration-score`, `meanAbsoluteError`가 2.5를 넘으면 `high-mean-absolute-error` major gap으로 처리됩니다. readiness 결과의 `actionPlan`은 각 영역의 critical/major/minor gap과 reader-response `evidenceCollectionPlan`을 최상위 실행 작업으로 모아, 어떤 보고서를 다시 만들고 어떤 독자 패널 증거를 먼저 수집해야 하는지 우선순위와 `commands` 실행 힌트로 보여줍니다. CLI로 실행해 저장된 report의 `commands`에는 `<project>` placeholder가 아니라 현재 프로젝트 경로가 들어갑니다. 또한 각 벤치마크 report는 생성 시 읽은 source evidence의 SHA-256 digest를 `sourceEvidence`에 기록하고, readiness는 현재 source digest와 report의 기록 digest를 대조합니다. 대응 source 경로에서 실제 파일을 하나도 찾지 못하면 리포트 점수가 높아도 `no-source-evidence` critical gap으로 처리하므로, 빈 `reviews/*-benchmark/` 폴더나 synthetic report JSON만으로는 98+ readiness를 통과할 수 없습니다. 더 나아가 영역별 필수 source group도 따로 봅니다. 예를 들어 전제/회차/장기유지/인물관계는 각 `reviews/*-benchmark/` 샘플, 문체는 `reviews/prose-taste-benchmark/`와 `meta/style-guide.json`, 독자 반응은 `reviews/reader-response/`, 장편 일관성은 `chapters/`, `world/`, `characters/`, `plot/` 그룹이 있어야 하며, 하나라도 비면 `missing-source-group-*` critical gap으로 처리됩니다. 장편 일관성은 리포트의 `chapter_count`, `chapters_analyzed`, `chapter_range`가 주장하는 회차 수가 실제 `chapters/chapter_NNN.{json,md}` source ID 수보다 많아도 `consistency-source-chapter-mismatch` critical gap으로 처리합니다. `chapters_analyzed`나 `chapter_range`처럼 구체 회차 ID를 알 수 있는 경우에는 수량만 보지 않고 claimed ID별로 source를 맞춥니다. claimed 회차 ID가 source에 없으면 `consistency-source-chapter-id-mismatch`, 해당 ID의 `chapter_NNN.md` 원고가 없으면 `consistency-source-manuscript-id-mismatch`, `chapter_NNN.json` 메타데이터가 없으면 `consistency-source-metadata-id-mismatch` critical gap으로 처리합니다. 예를 들어 `reviews/prose-taste-benchmark/*.json`, `meta/style-guide.json`, 또는 관련 `chapters/` 입력이 바뀌었는데 `reviews/prose-taste-benchmark-report.json`을 다시 만들지 않았다면 해당 영역은 `stale-report` critical gap으로 처리됩니다. `--minimum-overall-score`로 기준을 조정할 수 있고, CI나 자동 검증에서는 `--fail-on-not-ready`를 함께 주면 readiness가 통과하지 못할 때 non-zero exit code로 종료합니다.

### 연속 회차 유지력 벤치마크

`evaluateSeriesRetentionBenchmark`는 자동 장기 연재 점수와 타깃 독자의 연속 회차 반응을 비교해, 단일 회차는 그럴듯하지만 실제로는 회차가 갈수록 피로하거나 같은 보상/감정 리듬을 반복하는 false positive를 잡습니다. 독자 반응은 next-click, fatigue resistance, hook progress, reward variety, payoff satisfaction, novelty, emotional reset, confidence in payoff를 회차별로 기록하고, 시퀀스 전체의 독자 유지 점수, 첫 회차 대비 마지막 회차 낙폭, 반복 reward signature run, 반복 emotional signature run을 함께 봅니다. 각 회차의 `reward_signature`는 약속/보상 모양을, `emotional_signature`는 말미 감정 이동과 잔향 리듬을 기록합니다. 감정 반복은 문자열만 비교하지 않고 dread/fear/anxiety, shock/surprise/stunned, relief/resolve/calm처럼 같은 정서군으로 정규화해 이름만 바꾼 반복 말미도 `repetitive-emotional-pattern`으로 잡습니다. 한국어 또는 프로젝트 고유 감정 라벨을 쓰는 경우에는 `emotional_signature_family`에 `dread`, `shock`, `curiosity`, `relief`, `grief`, `intimacy`, `triumph`, `anger` 중 하나를 명시해 자유 서술 문자열보다 안정적인 정서군 반복 검출 근거로 사용할 수 있습니다. 또한 `maximum_dominant_emotional_signature_family_share`는 연속 반복은 아니더라도 시퀀스 전체 말미 정서가 한 정서군에 과도하게 쏠리면 `narrow-emotional-palette`로 잡아, 장기 연재가 계속 같은 불안/압박 기후에 머무는 false positive를 줄입니다. 또한 각 회차의 `started_read_count`, `completed_read_count`, `continued_read_count`, `drop_off_count`, `skimmed_read_count`를 받아 완독하고 남은 독자 점수만 높은 survivorship bias를 분리합니다. 기본 설정에서는 funnel evidence가 없거나 약하면 `weak-funnel-evidence`/`insufficient-reader-evidence`로 gate tuning 준비가 되지 않고, 충분한 funnel 근거에서 started-to-continued 유지율이 낮거나 이탈/훑어읽기 비율이 높으면 `reader-funnel-drop`으로 실패합니다. 추가로 `hook_open_thread_count`, `hook_advanced_thread_count`, `hook_resolved_thread_count`, `hook_recontextualized_thread_count`, `hook_new_thread_count`, `hook_stalled_thread_count`를 회차별 hook progress ledger로 받아 “궁금하다”는 독자 점수와 별개로 열린 질문이 실제로 전진·해소·재해석되는지 봅니다. ledger가 없거나 약하면 `weak-hook-progress-evidence`, 기존 질문이 멈춘 채 새 cliffhanger만 붙으면 `reader-hook-stall`로 남습니다. `calibration_split`은 `calibration`/`validation`/`holdout`을 지원하며, evidence-sufficient holdout과 known-drop holdout이 부족하면 `readyForGateTuning=false`로 남아 같은 연속 회차 개발 샘플에 맞춘 장기 연재 게이트 과적합을 막습니다. 또한 회차 시퀀스 evidence fingerprint가 서로 다른 split에 중복되면 `splitLeakageCount`를 남기고 `readyForGateTuning=false`로 처리합니다.

```bash
node dist/cli/run-series-retention-benchmark.js --project novels/{novel_id} --json
```

입력 포맷은 `schemas/series-retention-benchmark.schema.json`과 `templates/series-retention-benchmark.template.json`을 따릅니다. 기본 입력 경로는 `reviews/series-retention-benchmark/*.json`이고, 결과는 `reviews/series-retention-benchmark-report.json`에 저장됩니다. `minimum_sequence_length`, `maximum_retention_drop`, `maximum_repeated_reward_signature_run`, `maximum_repeated_emotional_signature_run`, `maximum_dominant_emotional_signature_family_share`를 지정하면 연속 회차 샘플이 너무 짧거나, 독자 유지가 급락하거나, 같은 보상/감정 시그니처가 반복되거나, 말미 정서 팔레트가 한 정서군에 과도하게 쏠린 상태를 coverage/gate 조정 전에 분리할 수 있습니다. CLI에서도 `--maximum-repeated-reward-signature-run`, `--maximum-repeated-emotional-signature-run`, `--maximum-dominant-emotional-signature-family-share`로 조정할 수 있습니다. `minimum_started_read_count`, `minimum_completion_rate`, `minimum_continuation_rate`, `maximum_drop_off_ratio`, `maximum_skimmed_read_ratio`, `require_funnel_evidence` 또는 CLI의 `--minimum-started-read-count`, `--minimum-completion-rate`, `--minimum-continuation-rate`, `--maximum-drop-off-ratio`, `--maximum-skimmed-read-ratio`, `--no-require-funnel-evidence`로 독자 funnel 기준을 조정할 수 있습니다. `require_hook_progress_evidence`, `minimum_hook_progress_event_count`, `minimum_hook_progress_rate`, `maximum_hook_stall_ratio` 또는 CLI의 `--require-hook-progress-evidence`, `--no-require-hook-progress-evidence`, `--minimum-hook-progress-event-count`, `--minimum-hook-progress-rate`, `--maximum-hook-stall-ratio`로 hook ledger 기준도 조정할 수 있습니다. CLI는 `--min-holdout-samples`, `--min-usable-holdout-samples`, `--min-failing-holdout-samples`, `--min-usable-failing-holdout-samples`로 holdout readiness 기준도 조정할 수 있습니다.

`reviews/series-retention-benchmark-report.json`이 있으면 `/verify-chapter`의 `apply-chapter-gate`가 현재 회차가 실패한 시퀀스의 최신 회차인지 확인한 뒤 Ralph Loop 완료 판정에 반영합니다. 증거가 충분한 `automated-false-positive`, `weak-reader-retention`, `reader-retention-drop`, `reader-funnel-drop`, `reader-hook-stall`, `repetitive-reward-pattern`, `repetitive-emotional-pattern`, `narrow-emotional-palette`는 해당 회차를 `RETRY`로 돌리고, `short-sequence`, `insufficient-reader-evidence`, `weak-funnel-evidence`, `weak-hook-progress-evidence`는 완료 차단 대신 경고/근거 보강 대상으로 남깁니다.

### 인물/관계 투자도 벤치마크

`evaluateCharacterRelationshipBenchmark`는 자동 인물/관계 드라마 점수와 타깃 독자 반응을 비교해, 구조상 관계 전환처럼 보이지만 실제 독자가 인물 결과나 다음 관계 장면을 신경 쓰지 않는 false positive를 잡습니다. 독자 반응은 protagonist agency, distinctive signature, vulnerability cost, character attachment, relationship tension, reciprocal pressure, subtext inference, turn consequence, next scene interest를 분리해 기록합니다. 필수 장르, 타깃 독자, 관계 유형별 known-investing/known-flat 샘플이 모두 있는지도 coverage gap으로 보고합니다. `focus`에는 `scene_promise`, `character_appeal_moment`, `relationship_turn`, `intended_change`, `consequence`를 넣어야 하며, 기본 설정에서는 이 focus evidence가 빠진 샘플이 `weak-focus-evidence`로 남고 `readyForGateTuning=false`가 됩니다. 즉 독자 점수만 높은 샘플을 대작형 인물/관계 게이트 튜닝 근거로 쓰지 않고, 어떤 선택·관계 전환·이후 결과를 검증했는지까지 남깁니다. `calibration_split`은 `calibration`/`validation`/`holdout`을 지원하며, evidence-sufficient holdout과 known-flat holdout이 부족하면 `readyForGateTuning=false`로 남아 같은 관계 장면 개발 샘플에 맞춘 드라마 게이트 과적합을 막습니다. 또한 인물/관계 focus evidence fingerprint가 서로 다른 split에 중복되면 `splitLeakageCount`를 남기고 `readyForGateTuning=false`로 처리합니다.

```bash
node dist/cli/run-character-relationship-benchmark.js --project novels/{novel_id} --json
```

입력 포맷은 `schemas/character-relationship-benchmark.schema.json`과 `templates/character-relationship-benchmark.template.json`을 따릅니다. 기본 입력 경로는 `reviews/character-relationship-benchmark/*.json`이고, 결과는 `reviews/character-relationship-benchmark-report.json`에 저장됩니다. 샘플에는 `focus.relationship_type`을 넣어 ally, rivalry, romance처럼 관계 유형별 샘플 편향을 따로 볼 수 있습니다. `require_focus_evidence` 또는 CLI의 `--require-focus-evidence`/`--no-require-focus-evidence`로 focus evidence 요구를 조정할 수 있습니다. CLI는 `--min-holdout-samples`, `--min-usable-holdout-samples`, `--min-failing-holdout-samples`, `--min-usable-failing-holdout-samples`로 holdout readiness 기준도 조정할 수 있습니다.

`reviews/character-relationship-benchmark-report.json`이 있으면 `/verify-chapter`의 `apply-chapter-gate`가 현재 회차의 evidence-sufficient 샘플을 Ralph Loop 완료 판정에 반영합니다. 자동 드라마 점수가 높지만 독자가 인물/관계 결과를 신경 쓰지 않는 `automated-false-positive`, 약한 `weak-reader-investment`, `weak-dimension`, known-flat 현재 회차 샘플은 validator 점수와 engagement/proseCraft가 높아도 `readerResponse.passed === false`로 병합되어 `RETRY`가 됩니다. 실패 시 `focus`와 `readerEvidence`의 comment, care/disbelief points, rewrite suggestion이 **Reader Response / Character Relationship Revision Directives**로 전달됩니다.

### 전제 매력 벤치마크

`evaluatePremiseAppealBenchmark`는 자동 전제 점수와 타깃 독자 반응을 비교해, 설계상 구체적으로 보이지만 실제 독자가 읽고 싶어 하지 않는 전제 false positive를 잡습니다. 독자 반응은 curiosity gap, novelty, protagonist investment, emotional pull, clarity, target fit, next chapter anticipation, would read를 분리해 기록합니다. 샘플의 `premise`에는 `core_hook`, `irresistible_question`, `protagonist_appeal`, `novelty_angle`, `emotional_payoff`, `binge_reason`, `long_series_engine`을 넣어야 하며, 기본 설정에서는 이 promise evidence가 빠진 샘플이 `weak-promise-evidence`로 남고 `readyForGateTuning=false`가 됩니다. 즉 독자 점수만 높은 샘플을 전제 설계 게이트 튜닝 근거로 쓰지 않고, 어떤 훅·질문·주인공 매력·연재 엔진을 검증했는지까지 남깁니다. 필수 장르와 타깃 독자별 known-good/known-bad 샘플이 모두 있는지도 coverage gap으로 보고합니다. `calibration_split`은 `calibration`/`validation`/`holdout`을 지원하며, evidence-sufficient holdout과 known-bad holdout이 부족하면 `readyForGateTuning=false`로 남아 같은 전제 개발 샘플에 맞춘 설계 게이트 과적합을 막습니다. 또한 전제 evidence fingerprint가 서로 다른 split에 중복되면 `splitLeakageCount`를 남기고 `readyForGateTuning=false`로 처리합니다.

전제 매력은 설문 점수만으로 충분하지 않습니다. `behavioral_evidence`에 `impression_count`, `click_count`, `first_chapter_open_count`, `library_add_count`, `follow_count`, `blind_listing_test`, `platform`, `variant_label`, `acquisition_source`, `observation_window_hours`를 기록하면 목록 노출에서 실제로 클릭, 첫 화 열람, 저장/팔로우로 이어졌는지 `behavioralIntentEvidence`, `behavioralIntentScore`, `behavioralIntentFalsePositiveCount`, `lowBehavioralIntentEvidenceCount`로 분리합니다. 별도로 `behavioralProtocolQuality`, `behavioralProtocolIssues`, `weakBehavioralProtocolCount`, `behavioralProtocolEvidenceCount`를 계산해 플랫폼/유입원/variant/블라인드 목록 테스트/관찰 시간이 약한 행동 근거를 98+ gate tuning evidence에서 제외합니다. `require_behavioral_intent_evidence`를 켜면 충분한 노출수와 클릭/열람/저장·팔로우 evidence가 없는 샘플은 gate tuning에 쓸 수 없고, `require_behavioral_protocol`을 켜면 수집 프로토콜이 약한 샘플도 gate tuning에 쓸 수 없습니다. 자동/설문상 매력적인 전제가 행동 전환 기준을 통과하지 못하면 `behavioral-intent-false-positive`로 실패합니다. 기준은 `minimum_behavioral_impressions`, `minimum_click_through_rate`, `minimum_first_chapter_open_rate`, `minimum_save_or_follow_rate`, `minimum_behavioral_observation_window_hours` 또는 CLI의 `--require-behavioral-intent-evidence`, `--no-require-behavioral-intent-evidence`, `--require-behavioral-protocol`, `--no-require-behavioral-protocol`, `--min-behavioral-impressions`, `--min-click-through-rate`, `--min-first-chapter-open-rate`, `--min-save-or-follow-rate`, `--min-behavioral-observation-hours`로 조정할 수 있습니다.

행동 evidence가 listing A/B 테스트에서 온 경우 `expected_variant_allocation_ratio`, `observed_variant_allocation_ratio`, `sample_ratio_mismatch_p_value`도 기록합니다. `require_behavioral_allocation_integrity`를 켜면 SRM p-value가 `minimum_sample_ratio_mismatch_p_value`보다 낮거나 allocation 필드가 빠진 샘플은 `weak-behavioral-allocation-evidence`, `weakBehavioralAllocationCount`로 분리되어 98+ gate tuning evidence에서 제외됩니다. CLI에서는 `--require-behavioral-allocation-integrity`, `--no-require-behavioral-allocation-integrity`, `--min-srm-p-value`로 조정할 수 있습니다.

```bash
node dist/cli/run-premise-appeal-benchmark.js --project novels/{novel_id} --json
node dist/cli/apply-design-gate.js --project novels/{novel_id} --fail-on-blocked --json
```

입력 포맷은 `schemas/premise-appeal-benchmark.schema.json`과 `templates/premise-appeal-benchmark.template.json`을 따릅니다. 기본 입력 경로는 `reviews/premise-appeal-benchmark/*.json`이고, 결과는 `reviews/premise-appeal-benchmark-report.json`에 저장됩니다. 샘플에 `premise`가 없으면 프로젝트의 `meta/design-strategy.json`에 있는 `reader_promise_contract`를 사용합니다. `require_promise_evidence` 또는 CLI의 `--require-promise-evidence`/`--no-require-promise-evidence`로 promise evidence 요구를 조정할 수 있습니다. CLI는 `--min-holdout-samples`, `--min-usable-holdout-samples`, `--min-failing-holdout-samples`, `--min-usable-failing-holdout-samples`로 holdout readiness 기준도 조정할 수 있습니다.

`/verify-design`은 이 report를 `apply-design-gate`로 집필 전 hard gate에 연결합니다. `readyForGateTuning !== true`, `weakPromiseEvidenceCount > 0`, `promiseEvidenceCount === 0`, `automatedFalsePositiveCount > 0`, `behavioralIntentFalsePositiveCount > 0`, `splitLeakageCount > 0`, usable holdout/known-bad holdout 부족, `sourceEvidence` mismatch, 전제 benchmark sample source 누락이 남아 있으면 consistency와 장르 점수가 높아도 집필을 시작하지 않습니다.

### Engagement 벤치마크

`evaluateEngagementBenchmark`는 labeled 회차/원고 샘플을 `evaluateEngagementContract`에 통과시켜, 좋은 샘플이 막히는 false negative와 재미없는 샘플이 통과하는 false positive를 분리해 측정합니다. 샘플에는 `genre`와 `routes`(`interest`, `suspense`, `beauty`, `amusement`, `genre-delight`, `next-click`)를 태깅할 수 있어 장르별 고점 샘플과 독자 쾌감 경로 커버리지를 같이 점검합니다. 필수 장르는 known-good/known-bad 샘플을 따로 집계하므로, 한 장르에 통과 샘플만 있거나 실패 샘플만 있으면 polarity coverage gap으로 보고됩니다. `required_positive_quality_codes`와 `minimum_samples_per_required_positive_quality_code`를 지정하면 known-good 샘플이 `signature-scene-image`, `character-appeal-signature`, `protagonist-agency`, `choice-cost-tradeoff`, `choice-cost-lock`, `tactical-adaptation`, `payoff-delight`, `genre-delight`, `next-click-compulsion`, `narrative-transportation`, `dialogue-subtext-turn`, `causal-chain` 같은 대작 고점 품질을 실제로 대표하는지도 `positiveQualityCoverage`/`usablePositiveQualityCoverage`로 분리합니다. 또한 known-good 샘플의 `positive_quality_codes`가 대응하는 부재 이슈와 동시에 검출되면 `positiveQualityConflictCount`로 실패 처리되어, 수동 `forbidden_issue_codes` 없이도 오표기된 고점 샘플을 usable coverage에서 제외합니다. 특히 `next-click-compulsion` 양성 샘플에서 `manuscript-ending-hook-question-too-broad`, `manuscript-ending-hook-reaction-not-evidenced`, `manuscript-ending-hook-setup-not-evidenced` 같은 말미 훅 결함이 검출되면 다음 화 클릭 고점으로 보지 않습니다. `required_issue_codes`와 `minimum_samples_per_required_issue_code`를 지정하면 `manuscript-protagonist-agency-not-evidenced`, `manuscript-choice-tradeoff-not-evidenced`, `manuscript-choice-cost-lock-not-evidenced`, `manuscript-tactical-adaptation-not-evidenced`, `manuscript-payoff-delight-not-evidenced`, `manuscript-ending-hook-question-too-broad`, `manuscript-signature-scene-image-not-evidenced`, `manuscript-dialogue-state-carryover-not-evidenced`처럼 대작 고점을 망치는 known-bad 유형별 labeled/usable 검출 샘플이 부족한지도 리포트합니다. 기본 템플릿은 보상/장르 쾌감/말미 훅/체험 몰입뿐 아니라 주인공 agency, 선택-비용 tradeoff, 되돌릴 수 없는 선택 잠금, 전술 적응, 대화 subtext, 대화 turn, 대화로 바뀐 상태의 다음 행동 carryover, 인물별 voice 차별화, 원고 인과 사슬 실패 샘플과 대응 양성 고점 샘플도 요구합니다. 인물별 voice 차별화는 동일 대사 반복뿐 아니라 말투, 문장 리듬, 반응 전술, 담화 표지가 겹쳐 서로 바꿔 말해도 구분되지 않는 대화를 `manuscript-character-voice-not-differentiated`로 막습니다. 캐릭터 프로필의 `basic.voice.formality_level` 또는 기존 top-level `speech_pattern`이 존댓말/반말/격식 말투를 지정했는데 화자 귀속 대사가 근거 없이 다른 register로 반복되면 `manuscript-character-voice-profile-drift`로 막습니다. 다른 캐릭터의 고유 `signature_phrases`를 빌려 쓰거나, 명시된 표준어/방언 프로필과 반복적으로 충돌하는 대사도 같은 issue로 막습니다. `basic.voice.vocabulary`에 `선호 어휘: 현장로그, 증거번호; 금지 어휘: 운명, 대충`처럼 적으면 캐릭터가 금지 어휘를 반복해서 쓰거나 다른 인물의 고유 선호 어휘를 빌려 쓰는 대사도 같은 issue로 막습니다. 어휘·시그니처 표현·방언은 profile context로 함께 전달되어 퇴고 지시의 기준이 됩니다. 단순히 대사에 적대감을 넣는 것보다 그 대화가 인과 경로와 구조적 갈등에 붙어 실제 상태를 바꾸는지가 중요하기 때문입니다. `required_series_length`와 `required_positive_series_length`를 지정하면 장르별 연속 회차 샘플과 known-good 연속 회차 샘플이 부족한지도 리포트합니다. `calibration_split`은 `calibration`/`validation`/`holdout`을 지원하며, usable holdout과 known-bad holdout이 부족하면 `readyForGateTuning=false`로 남아 같은 개발 샘플에 맞춘 재미 게이트 과적합을 막습니다. 또한 각 샘플의 원고/회차/플롯/설계 입력 fingerprint를 비교해 같은 evidence가 서로 다른 split에 들어간 경우 `splitLeakageCount`를 남기고 `readyForGateTuning=false`로 처리합니다.

우연한 해결은 `manuscript-convenient-resolution-not-evidenced`로 별도 검출합니다. 원고가 압박을 쌓은 뒤 `마침`, `우연히`, `갑자기` 도착한 경찰/조력자/증거/문 열림으로 구조, 체포, 탈출, 증거 발견을 처리하면 작위적 해결로 간주합니다. 통과하려면 해결 전에 사전 설치가 보이고, 주인공이 그 설치를 선택/행동으로 작동시켰으며, 해결 뒤 대가나 새 위험이 남아야 합니다.

스테이크 대상 개인화는 `manuscript-stakes-subject-not-personalized`로 검출합니다. 원고가 `피해자`, `표적`, `대상`, `수신자`, `사람` 같은 일반 명사만 위험 대상으로 반복하면 독자가 누구를 걱정해야 하는지 약해지므로, 첫 압박 창에서 이름, 관계, 역할, 소지품, 목소리, 메시지, 신분증, 사진, 사건/파일 번호 같은 구체 흔적을 붙여야 합니다. 기본 engagement benchmark 템플릿도 이 실패 유형의 known-bad holdout 샘플을 요구합니다.

`evaluateEngagementContract`는 페이지터너 질문도 별도로 봅니다. `page_turn_question`과 `reader_experience.page_turner_question`이 설명/해결/정답 공개로 닫히면 `page-turn-question-closed`, 질문이 마지막 장면의 단서·폭로·위협·사물·사건에서 발생하지 않으면 `page-turn-question-not-staged`입니다. 추가로 "앱과 사건은 왜 연결되는가?"처럼 열린 질문이지만 너무 넓은 경우는 `page-turn-question-too-broad`로 실패합니다. 로고+사건 번호, 이름+좌표, 다음 수신자+사진, 규칙+대가처럼 구체 앵커가 최소 두 개 결합된 좁혀진 정보 공백이어야 next-click 압력이 생깁니다.

같은 기준은 실제 원고 말미에도 적용됩니다. 마지막 열린 질문이 "이 사건의 진실은 무엇인가?"처럼 추상적이면, 앞 문장에 훅 사건이 있어도 `manuscript-ending-hook-question-too-broad`로 실패합니다. 원고 마지막 질문은 독자가 방금 본 로고, 사건 번호, 사진, 좌표, 다음 수신자, 규칙, 대가 같은 구체 단서 둘 이상을 붙잡고 끝나야 합니다.

```bash
node dist/cli/run-engagement-benchmark.js --project novels/{novel_id} --json
```

입력 포맷은 `schemas/engagement-benchmark.schema.json`과 `templates/engagement-benchmark.template.json`을 따릅니다. 기본 입력 경로는 `reviews/engagement-benchmark/*.json`이고, 결과는 `reviews/engagement-benchmark-report.json`에 저장됩니다. 샘플은 프로젝트의 `chapters/chapter_NNN.json`과 `chapters/chapter_NNN.md`를 기본으로 읽으며, 실패 샘플이나 대체 원고는 `manuscript` 또는 `manuscript_path`로 지정할 수 있습니다. 리포트의 각 sample result에는 `manuscriptSource`, `manuscriptPath`, `chapterSourceGrounded`가 기록되어 현재 회차 원고에서 읽힌 샘플과 inline fixture를 구분합니다. `apply-chapter-gate`는 현재 회차에 grounded된 engagement benchmark 샘플이 known-bad이거나 `false-positive`, `missing-issue`, `forbidden-issue`, `positive-quality-conflict`를 내면 Ralph Loop 완료를 막고, grounded되지 않은 fixture는 경고로만 남깁니다. CLI는 `--required-positive-quality-codes`, `--min-positive-quality-code-samples`, `--required-issue-codes`, `--min-issue-code-samples`, `--min-holdout-samples`, `--min-usable-holdout-samples`, `--min-failing-holdout-samples`, `--min-usable-failing-holdout-samples`로 positive high-point coverage, issue-code coverage, holdout readiness 기준을 조정할 수 있습니다.

## BLUEPRINT.md 워크플로우

소설 시작 전 체계적인 기획:

```bash
/blueprint-gen "아이디어"   # 기획서 생성 (1단계)
/blueprint-review           # 검토 및 개선 (2단계)
/init                       # 프로젝트 생성 (3단계) - BLUEPRINT.md 필수
```

기획서는 `./BLUEPRINT.md`에 저장되며, 장르, 타겟 독자층, 캐릭터 원형, 핵심 갈등, 플롯 구조 등을 포함합니다.

> **Note**: `/init`은 BLUEPRINT.md가 있어야 실행됩니다.

## 장르 레시피

장르별 최적화된 기본값:
- **로맨스**: `romance`, `romance-contract`, `romance-ceo`
- **판타지**: `fantasy`, `fantasy-regression`, `fantasy-hunter`
- **기타**: `bl`, `thriller`

사용 예시:
```bash
/init --recipe=romance-contract
```

레시피는 장르에 적합한 플롯 구조, 템포, 필수 씬 등을 자동 설정합니다.

## What's New in v8.0

### novel-autopilot 제거
- `/novel-autopilot` 스킬, `autopilot-state.schema.json` 삭제
- 라우팅 규칙, 테스트, 도움말에서 autopilot 참조 제거
- 스킬 수: 38→37

### ai-slop-patterns 구조적 패턴 추가
- 섹션 4: 구조적 AI 패턴 16개 (문장/문단/톤/구성 수준)
- 구조적 패턴 빈도 기준 테이블 추가
- 어휘+구조 양면 탐지 완성

## What Was New in v7.0

### 에이전트 정리 (20→17)
- `prose-quality-analyzer` 제거 → `quality-oracle`로 기능 통합
- `scene-drafter` 제거 → `novelist`의 Scene-by-Scene Mode로 대체
- `assembly-agent` 제거 → `novelist` 워크플로우에 통합

### 스킬 정리 (48→38)
- `/deep-evaluate` → `/evaluate --deep`으로 통합 (8축 루브릭은 references/로 이동)
- `/check-retention`, `/emotion-arc` → `/act-review`에 흡수 (deep-review-team의 engagement-optimizer)
- `/analyze-engagement`, `/adversarial-review`, `/multi-draft`, `/team-nov`, `/swarm` → 삭제 (팀 기반 스킬에 흡수)
- `/ai-slop-detector`, `/validate-genre` → `/evaluate`에 통합
- `/timeline` → `/design-timeline --view`로 통합
- `/analyze` (범용 라우터), `/21-wisdom`, `/cancel-novel-autopilot` 제거

## Previous Releases

### v6.4.0

#### 에이전트 카탈로그 현대화
- 20개 에이전트 frontmatter 표준화 (산출물 기반 description)
- READ-ONLY 에이전트 10개에 `permissionMode: plan` 적용
- 에이전트별 color 코드 부여

#### Hook 시스템 현대화
- `hook-utils.mjs` 공유 모듈 도입 (중복 코드 제거)
- SessionStart SOP 주입 (에이전트 위임 테이블 자동 표시)

#### 스킬 시스템 개선
- 48개 스킬 frontmatter 표준화 ("Use this skill when..." 형식)
- `validate-skills.mjs` 신규 검증 스크립트

#### 검증 파이프라인 강화
- 에이전트 frontmatter 검증 (`validate-agents.mjs` 확장)
- 스킬 frontmatter 검증 (`validate-skills.mjs` 신규)
- prebuild에 `validate:skills` 통합

## Previous Releases

### v3.0

- **chapter-verifier**: Automated verification agent that validates chapters before completion claims
- **consistency-verifier**: Detects contradictions in character traits, timeline, settings, and factual consistency across chapters
- **engagement-optimizer**: Analyzes and optimizes pacing, tension curves, emotional beats, and hook density for maximum reader engagement

### v2.0

- **Hook-Based Workflow Control**: Ralph Loop Persistence, Schema Validation, Session Initialization
- **Progressive Disclosure Structure**: 3-tier documentation (SKILL.md, references, examples)
- **Parallel Verification System**: `/verify-chapter` 3-way validator orchestration

## 라이선스

MIT

## 기반 프로젝트

- [oh-my-claude-sisyphus](https://github.com/Yeachan-Heo/oh-my-claude-sisyphus)
