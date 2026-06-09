<!-- Generated: 2026-01-17 -->

# novel-dev

## Purpose

Novel-Sisyphus is a Claude Code plugin for AI-powered Korean novel writing. It provides a multi-agent orchestration system specifically designed for creative writing workflows, featuring 22 specialized agents and 29 skills that support the complete novel creation lifecycle from initial concept to final export.

This plugin adapts the oh-my-claude-sisyphus orchestration framework for creative writing, implementing:
- Agent-based workflow with specialized roles (novelist, editor, critic, lore-keeper, plot-architect, proofreader, summarizer, beta-reader, genre-validator, chapter-verifier, consistency-verifier, engagement-optimizer, character-voice-analyzer, quality-oracle, prose-surgeon, style-curator, team-orchestrator, narrator, character-designer, arc-designer, extras, chapter-merger)
- Ralph Loop for automated chapter writing with quality gates
- Comprehensive project structure with JSON schemas
- Korean-language literary conventions and best practices

## Key Files

| File | Description |
|------|-------------|
| `README.md` | Complete plugin documentation with workflow examples |
| `package.json` | NPM package configuration, TypeScript build scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `.claude-plugin/` | Claude Code plugin metadata |
| `src/types.ts` | TypeScript type definitions for all data structures |

## Subdirectories

| Directory | Purpose | Details |
|-----------|---------|---------|
| `agents/` | Agent prompt files | 22 specialized agent definitions |
| `skills/` | Skill implementations | 29 skill workflows for writing, review, and utilities |
| `schemas/` | JSON schemas | Data validation schemas for all project files |
| `teams/` | Team presets | 15 preset team definitions + custom teams (.team.json files) |
| `templates/` | JSON templates | Default templates for project initialization |
| `scripts/` | Utility scripts | Helper scripts for workflow automation (.mjs files) |
| `hooks/` | Plugin hooks | Hook configuration for Claude Code integration |
| `test-workspace/` | Example project | Sample novel project structure for testing |

## Plugin Architecture

### Agent System

The plugin implements a multi-agent system with specialized roles:

| Agent | Model | Role |
|-------|-------|------|
| novelist | opus | Main prose writing |
| editor | sonnet | Revision and editing |
| critic | opus | Quality evaluation (read-only) |
| lore-keeper | sonnet | Worldbuilding and consistency |
| plot-architect | opus | Plot structure design |
| proofreader | haiku | Grammar and spelling |
| summarizer | haiku | Chapter summarization |
| beta-reader | sonnet | Reader engagement simulation |
| genre-validator | sonnet | Genre compliance validation |
| consistency-verifier | sonnet | 5-domain consistency checking |
| engagement-optimizer | sonnet | 7-domain engagement analysis |
| character-voice-analyzer | sonnet | Voice and dialogue analysis |
| quality-oracle | opus | Quality evaluation + surgical directive generation (2-Pass) |
| prose-surgeon | opus | Surgical prose revision per quality-oracle directives (2-Pass) |
| style-curator | sonnet | Style exemplar curation and library management |
| chapter-verifier | sonnet | Automated chapter verification with parallel validators |
| team-orchestrator | sonnet | Team orchestration - loads team definitions, spawns agent teams, coordinates workflows |
| narrator | sonnet | Collaborative writing session narration and pacing |
| character-designer | opus | Character profile design and character-agent generation |
| arc-designer | sonnet | Sub-arc, foreshadowing, hook, and cliffhanger design |
| extras | sonnet | Minor/cameo character dialogue and action generation |
| chapter-merger | opus | Claude+Codex parallel chapter merge review |

### Team System

에이전트를 역할 기반 팀으로 조직화하여 병렬/순차/파이프라인/협업 실행을 지원합니다.

**15개 프리셋 팀:**

전체 15개 팀의 상세 목록은 [teams/AGENTS.md](teams/AGENTS.md)를 참조하세요.

**사용법:** `/team run <team-name> [chapter]`

**관련 파일:**
- `teams/*.team.json` — 팀 정의 프리셋
- `schemas/team.schema.json` — 팀 정의 스키마
- `schemas/team-state.schema.json` — 팀 실행 상태 스키마
- `agents/team-orchestrator.md` — 범용 오케스트레이터
- `skills/team/SKILL.md` — `/team` 스킬

### Command Categories

Skills are organized by workflow phase:

1. **Initialization**: `/init` - Project setup
2. **Design**: `/design_*` - Worldbuilding, characters, plot arcs
3. **Plot Generation**: `/gen_plot` - Episode-level plot creation
4. **Writing**: `/write`, `/write_act`, `/write_all` - Prose creation
5. **Review**: `/plot-review`, `/act-review` - 플롯/막 단위 품질 검증
6. **Revision**: `/revise` - 피드백 기반 퇴고
6. **Completion**: `/timeline`, `/stats`, `/export` - Finalization

### Ralph Loop

The `/write_all` command activates Ralph Loop mode:
- Automated act-by-act writing
- Quality gate at 70/100 points
- Automatic revision on failure (max 3 retries)
- User confirmation between acts

### Writer-Safe Brief

`codex-writer` (and Codex-mode pipelines) receive a **writer-safe brief** — not the raw chapter JSON.
The brief is built by `scripts/lib/writer-brief-builder.mjs`, which strips storyboard notation,
resolves character references by `id` (fallback: stem → alias → name), and sanitizes plot-meta
fields before passing the context to the LLM.

## Project Structure

Novel projects are stored in `novels/{novel_id}/` with this structure:

```
novels/{novel_id}/
├── meta/                    # Project metadata
│   ├── project.json        # Core project info
│   └── style-guide.json    # Writing style guidelines
├── world/                   # Worldbuilding
│   ├── world.json          # World settings
│   ├── locations.json      # Place descriptions
│   └── terms.json          # Terminology
├── characters/              # Character data
│   ├── {char_id}.json      # Individual characters
│   ├── index.json          # Character list
│   └── relationships.json  # Character relationships
├── plot/                    # Plot structure
│   ├── structure.json      # Overall structure
│   ├── main-arc.json       # Main storyline
│   ├── sub-arcs/           # Subplots
│   ├── foreshadowing.json  # Planted hints
│   └── hooks.json          # Story hooks
├── chapters/                # Written content
│   ├── chapter_001.json    # Chapter metadata
│   └── chapter_001.md      # Chapter prose
├── context/summaries/       # Chapter summaries
├── reviews/                 # Quality evaluations
└── exports/                 # Export outputs
```

## For AI Agents

### When Working With This Plugin

**DO:**
- Follow Korean literary conventions (show don't tell, natural dialogue, sensory details)
- Respect the workflow phases (design → plot → write → revise)
- Use quality gates - 70/100 minimum score for chapter approval
- Maintain consistency with established worldbuilding and characters
- Plant foreshadowing naturally without telegraphing
- Follow the style guide in `meta/style-guide.json`

**DON'T:**
- Skip planning phases and jump directly to writing
- Modify completed chapters without using the revision workflow
- Ignore quality evaluation scores
- Break character voice or world rules
- Use meta-commentary in prose output
- Violate taboo words listed in style guide

### Agent Selection Guide

Choose the appropriate agent based on task:

#### 핵심 집필 파이프라인

- **plot-architect**: Story structure, act breaks, dramatic arcs, plot design
- **lore-keeper**: Worldbuilding, character creation, consistency checks, setting details
- **novelist**: Prose writing, scene construction, dialogue, narrative flow
- **editor**: Revision, pacing fixes, style improvements, structural edits
- **critic**: Quality evaluation, feedback, scoring (does NOT modify content)
- **proofreader**: Grammar, spelling, typos, Korean language corrections
- **summarizer**: Chapter summaries, context building for subsequent chapters
- **chapter-verifier**: Quality verification before completion claims

#### 품질 게이트 파이프라인

- **quality-oracle**: 결정론적 품질 지시서 생성 — 필터 단어·리듬·감각·플롯-메타-누출·연속 단문 탐지가 필요할 때
- **prose-surgeon**: Quality Oracle 지시서 기반 외과적 산문 리라이트 — 지시서가 이미 있고 특정 문단만 수정해야 할 때

#### 설계 에이전트

- **arc-designer**: 서브아크·복선·훅/클리프행어 설계 — 챕터 단위 긴장 흐름과 장기 플롯 정합성을 관리해야 할 때
- **character-designer**: 캐릭터 프로필·심리 설계 및 캐릭터 에이전트 파일 생성 — 신규 캐릭터를 프로젝트에 추가할 때

#### 협업 집필 에이전트

- **narrator**: 협업 집필 모드 진행 — 씬 단위로 캐릭터 에이전트들에게 SCENE_BRIEF를 전송하고 응답을 산문으로 엮을 때
- **extras**: 에이전트 파일이 없는 단역/엑스트라 캐릭터 대사·행동 담당 — 협업 씬에서 minor/cameo 역할이 필요할 때
- **chapter-merger**: Claude + Codex 두 버전의 챕터를 최상의 결과물로 병합 — 병렬 생성된 두 초고를 합칠 때

#### 팀 오케스트레이션

- **team-orchestrator**: 멀티에이전트 팀 워크플로우 전체 조율 — 팀 정의 파일을 읽고 병렬/순차 에이전트 실행을 분배해야 할 때

#### 검증/분석 에이전트

- **consistency-verifier**: 설정·캐릭터·세계관·인과율·복선 5개 도메인 일관성 검증 — 챕터 간 모순을 체계적으로 점검할 때
- **character-voice-analyzer**: 대화 전반에 걸친 캐릭터 말투 일관성 분석·OOC 탐지 — 캐릭터 성격이 대사에 제대로 반영됐는지 검토할 때
- **engagement-optimizer**: 페이싱·텐션·감정·훅·대화·감각·스테이크스 7개 도메인 독자 몰입도 분석 — 페이지터너 품질을 높여야 할 때
- **beta-reader**: 실제 독자 시뮬레이션 시점의 몰입도 분석·이탈 리스크 예측 — 독자 관점의 1차 피드백이 필요할 때
- **genre-validator**: 장르 필수 요소 검증·클리셰 과용 경고·상업적 적합성 평가 — 장르 규범 준수 여부를 확인할 때

#### 문체 관리

- **style-curator**: 문체 예시 문장 큐레이션·5차원 분류·anti-exemplar 쌍 관리 — few-shot 스타일 학습용 예시 라이브러리를 구축·갱신할 때

### chapter-verifier (sonnet)

Automated chapter verification agent that validates quality before completion claims.

**Role**: Orchestrates parallel validators (critic, beta-reader, genre-validator) and generates pass/fail verdicts.

**When to Use**:
- After completing chapter writing
- Before claiming "done" on any chapter
- During write-all loop for each chapter

**Thresholds**:
| Validator | Normal | Chapter 1 |
|-----------|--------|-----------|
| critic | ≥85 | ≥90 |
| beta-reader | ≥75 | ≥80 |
| genre-validator | ≥90 | ≥95 |

### Common Workflows

**Starting a new novel:**
1. `/init` with genre and concept
2. `/design_world`, `/design_character`, `/design_main_arc`
3. `/gen_plot` to create episode structure
4. `/write_all` for automated writing with Ralph Loop

**Revising a chapter:**
1. Read `chapters/chapter_NNN.md` and `reviews/chapter_NNN_review.json`
2. Call editor agent with context
3. Update chapter file
4. Run `/act-review` to verify improvement

**Checking consistency:**
1. `/act-review` to find violations
2. Review flagged issues
3. Either revise chapters or update canonical data (world/characters)

## Dependencies

**NPM Dependencies:**
- `typescript` (^5.0.0) - Build toolchain
- `@types/node` (^20.0.0) - Node.js type definitions

**Runtime Requirements:**
- Node.js >= 18.0.0
- Claude Code CLI (parent framework)

**Internal Dependencies:**
- Agent definitions depend on schemas for validation
- Commands depend on agent definitions
- Scripts depend on project structure conventions

## Build and Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run watch

# Clean build artifacts
npm run clean
```

Output is compiled to `dist/` directory.

## Quality Standards

The plugin enforces quality through multiple mechanisms:

1. **Quality Gates**: 70/100 minimum score (25 points each for narrative quality, plot coherence, character consistency, worldbuilding adherence)
2. **Consistency Checks**: Automated validation of character traits, timeline, world rules
3. **Style Guide Enforcement**: Tone, pacing, POV, taboo words validated
4. **Schema Validation**: All JSON files validated against schemas

## Extension Points

To add new functionality:

- **New Agent**: Create `.md` file in `agents/` with frontmatter (name, description, model)
- **New Skill**: Create `SKILL.md` file in `skills/<skill-name>/` with description and workflow
- **New Schema**: Add JSON schema to `schemas/` following existing patterns
- **New Template**: Add default JSON to `templates/`
- **New Hook**: Update `hooks/hooks.json` with hook configuration

## License

MIT - See README.md for full details
