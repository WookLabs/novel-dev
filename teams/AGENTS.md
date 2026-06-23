<!-- Parent: ../docs/repository-guide.md -->
<!-- Generated: 2026-02-17 -->

# teams

## Purpose

에이전트 팀 프리셋 정의를 관리하는 디렉토리. 각 `.team.json` 파일은 `schemas/team.schema.json`을 준수하며, 역할 기반 에이전트 조직 + 워크플로우 + 품질 게이트를 정의합니다.

각 스킬(`/design`, `/write`, `/plot-review`, `/act-review` 등)이 해당 팀을 자동으로 호출합니다. `team-orchestrator` 에이전트가 팀 정의를 로드하여 자동으로 에이전트를 조직화하고 워크플로우를 실행합니다.

## Preset Teams (15개)

| File | Name | Category | Agents | Workflow | 용도 |
|------|------|----------|--------|----------|------|
| `planning-team.team.json` | 설계 팀 | planning | plot-architect, lore-keeper, style-curator | collaborative | 소설 기획/설계 |
| `design-execution-team.team.json` | 설계 실행 팀 | planning | style-curator, lore-keeper, character-designer, plot-architect, arc-designer | collaborative | 5명 실시간 소통 설계 |
| `writing-team.team.json` | 집필 팀 | writing | novelist, proofreader, summarizer | sequential | 회차 집필 |
| `writing-team-2pass.team.json` | 2-Pass 집필 팀 | writing | novelist, quality-oracle, prose-surgeon, proofreader | pipeline | 정밀 집필 |
| `verification-team.team.json` | 검증 팀 | verification | critic, beta-reader, genre-validator | parallel | 품질 검증 |
| `deep-review-team.team.json` | 심층 리뷰 팀 | verification | critic, beta-reader, consistency-verifier, engagement-optimizer, character-voice-analyzer, quality-oracle | parallel | 심층 다관점 리뷰 |
| `design-review-team.team.json` | 설계 리뷰 팀 | verification | critic, lore-keeper, genre-validator, plot-architect | parallel | 설계 산출물 다관점 리뷰 |
| `plot-review-team.team.json` | 플롯 리뷰 팀 | verification | critic, consistency-verifier, genre-validator, plot-architect | parallel | 플롯 파일 다관점 검증 |
| `revision-team.team.json` | 퇴고 팀 | revision | critic, editor, proofreader, consistency-verifier | pipeline | 피드백 기반 퇴고 |
| `writing-team-collab.team.json` | 캐릭터 협업 집필 팀 | writing | narrator, characters/*, proofreader, summarizer | collaborative (hybrid) | 캐릭터 에이전트 co-write |
| `writing-team-collab-2pass.team.json` | 캐릭터 협업 2-Pass 집필 팀 | writing | narrator, characters/*, proofreader, summarizer | collaborative (hybrid) | 캐릭터 co-write + Grok 리라이트 |
| `writing-team-collab-3pass.team.json` | 캐릭터 협업 3-Pass 집필 팀 | writing | narrator, characters/*, extras, proofreader, summarizer | collaborative (hybrid) | 캐릭터 co-write + full polish + adult rewrite |
| `writing-team-codex-2pass.team.json` | Codex 2-Pass 집필 팀 | writing | GPT-5.4(codex-writer), proofreader, summarizer | hybrid | Codex CLI + Grok 리라이트 (비용 절감) |
| `writing-team-parallel.team.json` | Claude-Codex 병렬 협업 팀 | writing | narrator, characters/*, extras, chapter-merger, proofreader, summarizer | collaborative (hybrid) | Claude/Codex 병렬 초고 + 병합 |
| `plot-generation-team.team.json` | 플롯 생성 팀 | planning | plot-architect, arc-designer, lore-keeper, character-designer, engagement-optimizer | collaborative | 회차별 플롯 팀 기반 생성+검증 |

## Workflow Types

| Type | 설명 | 사용 팀 |
|------|------|---------|
| `parallel` | 모든 에이전트 동시 실행 + 결과 집계 | verification-team, deep-review-team, design-review-team, plot-review-team |
| `sequential` | 순차 체인 (이전 출력 → 다음 입력) | writing-team |
| `pipeline` | 단계별 순차 + 품질 게이트 + 재시도 | writing-team-2pass, revision-team |
| `collaborative` | 자율 협업 (lead가 SendMessage로 조율) | planning-team, writing-team-collab, writing-team-collab-2pass, writing-team-collab-3pass, writing-team-parallel, design-execution-team, plot-generation-team |

## Quality Gates

| 팀 | Consensus | 주요 기준 |
|----|-----------|-----------|
| verification-team | all_pass | critic>=95, beta-reader>=95, genre-validator>=95 |
| deep-review-team | all_pass | 6개 에이전트 모두 >=95 |
| writing-team-2pass | all_pass | quality-oracle>=95 |
| revision-team | all_pass | critic>=95, consistency-verifier>=95 |
| design-review-team | all_pass | critic>=95, lore-keeper>=95, genre-validator>=95, plot-architect>=95 |
| plot-review-team | all_pass | critic>=95, consistency-verifier>=95, genre-validator>=95, plot-architect>=95 |

## 사용자 정의 팀

`templates/team.template.json`을 기반으로 커스텀 팀을 만들 수 있습니다.

커스텀 팀 파일도 이 디렉토리에 저장됩니다.

## For AI Agents

### 팀 실행 방법

```spec
// 1. 팀 정의 로드
const def = Read(`teams/${teamName}.team.json`);

// 2. team-orchestrator에 위임
Task({
  subagent_type: "novel-dev:team-orchestrator",
  model: "sonnet",
  prompt: `팀 실행: ${teamName}, 대상: Chapter ${N}`
});
```

### 새 프리셋 팀 추가

1. `teams/{name}.team.json` 파일 생성 (team.schema.json 준수)
2. agents, workflow, coordination, quality_gates 정의
3. `quality_gates.enabled`가 true이면 `quality_gates.issue_policy` 정의
4. 이 AGENTS.md 문서 업데이트
5. 관련 스킬의 팀 참조 업데이트

### Quality Gate Issue Policy

품질 게이트가 켜진 팀은 점수뿐 아니라 검증 에이전트가 반환한 issue code provenance를 보존해야 합니다.

필수 규칙:
- `preserve_issue_codes: true`
- `required_issue_fields`: `code`, `severity`, `source_agent`, `evidence`, `directive`
- `merge_strategy: "dedupe_by_code_highest_severity"`
- `severity_order`: `critical`, `major`, `minor`
- `critical_blocks_pass: true`
- `directive_priority: "critical_first"`
- `provenance_required: true`

pipeline 팀은 `critical_action: "retry"` 또는 `"block_or_retry"`를 쓰는 경우 `retry_from_step`도 지정합니다. parallel 검증 팀은 일반적으로 `critical_action: "block"`을 사용합니다.

## Dependencies

- `schemas/team.schema.json` — 팀 정의 스키마
- `schemas/team-state.schema.json` — 팀 실행 상태 스키마
- `agents/team-orchestrator.md` — 범용 오케스트레이터
- `skills/*/SKILL.md` — 각 스킬에서 팀 호출
- `templates/team.template.json` — 커스텀 팀 템플릿
