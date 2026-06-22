---
name: 04-design
description: "Use this skill when designing all aspects of a novel project (style, world, characters, arcs, foreshadowing, hooks). Triggers on: '설계', '디자인', 'design'."
user-invocable: true
---

# /design - 소설 전체 설계

$ARGUMENTS

03-init 완료 후, 5명의 설계 팀이 collaborative 모드로 실시간 소통하며 전체 설계를 수행합니다.

## Provider 선택

기본: **Claude** (구조화 JSON 출력에 최적, 비용 효율)
- `--codex`: Codex로 전환 (비용 절감) (품질 우선)
- `--codex`: Codex 명시적 선택
- 프로젝트 override: `meta/project.json`의 `provider_routing.design`

## Quick Start

```bash
/design            # Claude로 실행 (기본)
/design --claude   # Claude 5-agent 팀으로 설계 (품질 우선)
/design-review     # 설계 산출물 검토 및 수정
```

## --codex: Codex CLI(GPT-5.4) 설계

`$ARGUMENTS`에 `--codex`가 있으면 5에이전트 관점을 GPT-5.4 단일 호출로 통합 수행합니다:
```spec
Bash("node scripts/codex-writer.mjs --project {projectPath} --mode design")
```
결과 JSON을 `meta/design-codex-output.json`에 저장 후, 각 파일로 분배합니다.

## Prerequisites

- 03-init 완료 (`plot/structure.json`, `meta/project.json` 존재)
- `BLUEPRINT.md` 존재

## 실행

### Phase 0: 설계 전략 수립 (자동)

팀 실행 전에 plot-architect가 blueprint를 분석하여 설계 전략을 수립합니다:

```spec
Task(subagent_type="novel-dev:plot-architect", model="opus", prompt="
프로젝트: {projectPath}

설계 전략을 수립하세요:
1. BLUEPRINT.md를 읽고 분석
2. meta/project.json, plot/structure.json 참조
3. templates/design-strategy.template.json 구조를 참고하여
   meta/design-strategy.json 생성

포함할 내용:
- 핵심 톤/분위기 방향
- reader_promise_contract: target_reader, core_hook, irresistible_question, emotional_payoff, protagonist_appeal, novelty_angle, binge_reason, first_five_chapter_retention_plan, long_series_engine, risk_factors
- 세계관 설계 우선순위
- 캐릭터 설계 방침
- 아크 구조 전략
- 각 에이전트(style-curator, lore-keeper, character-designer, arc-designer)에 대한 구체적 지시사항
- 장르별 필수 비트 및 회피 패턴
- 프로젝트 제약 사항

이 전략 문서는 이후 Phase 1~3에서 모든 에이전트가 참조합니다.
reader_promise_contract는 이후 /gen-plot과 /write에서 독자 보상, 클릭 유도 질문, 주인공 매력 증명 기준으로 사용됩니다.
reader_promise_contract는 구체적 독자 약속이어야 합니다. "흥미로운 사건", "매력적인 주인공", "재미와 감동", "다음 화가 궁금함" 같은 일반어만 쓰면 `reader-promise-generic` 실패로 반려됩니다. core_hook/novelty_angle/binge_reason/long_series_engine에는 고유 장치, 기억 가능한 단서, 주인공 선택/비용, 감정 보상 trigger를 넣으세요.
전제는 나중에 `premise-appeal-benchmark`의 behavioral evidence와 behavioral protocol로 검증될 수 있어야 합니다. 제목/한줄훅/소개문/목록 패키지가 노출 → 클릭 → 첫 화 열람 → 저장/팔로우로 이어질 수 있도록 core_hook, novelty_angle, protagonist_appeal, binge_reason을 독자가 목록에서 바로 이해할 수 있는 전환 언어로 정리하고, 블라인드 목록 테스트에서 플랫폼, variant, 유입원, 관찰 시간을 기록할 수 있을 만큼 목록 패키지 단위를 분리하세요.
구체적이고 실행 가능한 지시사항을 작성하세요.
")
```

### Phase 1~3: 팀 실행

team-orchestrator에 design-execution-team 실행을 위임합니다:

```spec
Task(subagent_type="novel-dev:team-orchestrator", model="sonnet", prompt="
팀 실행: design-execution-team
프로젝트: {projectPath}
모드: collaborative

⚠️ Phase 0 전략 참조: meta/design-strategy.json에 설계 전략이 있습니다.
모든 에이전트는 작업 시작 전에 이 파일을 읽고, agent_directives 섹션의
자기 에이전트 지시사항을 따르세요.
")
```

## 팀 구성 (5명, collaborative)

| 에이전트 | 모델 | 역할 | 산출물 |
|---------|------|------|--------|
| **plot-architect** (lead) | opus | 전체 조율 + 타임라인 + 메인 아크 | timeline.json, main-arc.json |
| style-curator | sonnet | 문체 설계 + 문체 일관성 자문 | style-guide.json |
| lore-keeper | sonnet | 세계관 + 관계도 + 정합성 검증 | world.json, relationships.json |
| character-designer | opus | 캐릭터 프로필 + 에이전트 생성 | characters/*.json, agents/characters/*.md |
| arc-designer | sonnet | 서브아크 + 복선 + 훅 | sub-arcs/*.json, foreshadowing.json, hooks.json |

## Collaborative 진행 방식

plot-architect(lead)가 TeamCreate로 팀을 구성하고 SendMessage로 조율합니다.

**Phase 1: 기반 구축**
- style-curator + lore-keeper가 동시 진행
- 상호 참조: 문체가 세계관 분위기에 맞는지 실시간 조율

**Phase 2: 캐릭터**
- character-designer 주도, lore-keeper가 세계관 정합성 검증
- character-designer가 캐릭터 에이전트 파일도 자동 생성

**Phase 3: 구조**
- plot-architect + arc-designer 주도
- character-designer가 캐릭터 동기/결함 기반 플롯 자문
- 서브아크 → 복선 → 훅 순으로 진행하되, 필요시 역순 피드백

## 완료 후

```
[OK] 전체 설계 완료. /design-review로 검토하거나, /gen-plot으로 회차별 플롯을 생성하세요.
```
