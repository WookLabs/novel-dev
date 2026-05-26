---
type: fix
status: active
created: 2026-05-23
plan-id: 2026-05-23-003
---

# fix: Remove hardcoded novel-specific examples from agent specs

## Problem Frame

The novel-dev plugin is a general-purpose novel writing tool, but `agents/novelist.md` contains examples hardcoded to one specific novel (서강윤, 음악 프로듀서, 회귀물). Any new project using this plugin sees irrelevant character names and profession-specific metaphors in the agent's reference examples. Examples should demonstrate universal prose techniques applicable to any genre and any character.

## Scope Boundaries

In scope:
- `agents/novelist.md` — replace all project-specific BAD/GOOD examples, inline examples in HARD RULES, sensory table, and sentence structure section with genre-neutral alternatives
- `agents/team-orchestrator.md` — replace 강윤/서강윤 in character resolution examples with generic names

Out of scope (NOT hardcoded — these are genre definitions):
- `agents/engagement-optimizer.md` — 회귀물 is a supported genre category, not a hardcoded novel reference
- `agents/genre-validator.md` — same; regression genre rules belong here

## Key Technical Decisions

1. **Examples must be concrete but genre-neutral.** NOT placeholders like "[주인공]" or "[직업 비유]". Write real prose that demonstrates the technique using common, relatable settings (예: 비 오는 골목, 병원 복도, 시장 골목, 새벽 부엌) that any novel could adapt.
2. **BAD/GOOD structure preserved.** The pedagogical shape (BAD example → problem diagnosis → GOOD example → feature analysis) stays identical; only the content changes.
3. **3 example categories preserved.** 예시 1 (일반 서술 씬), 예시 2 (감정 고조 씬), 예시 3 (내면 독백). But section titles lose genre tags.
4. **HARD RULE inline examples use generic names.** "그" (he), "그녀" (she), or common Korean names like "수현", "지호" that don't imply a specific novel.

## Implementation Units

### U1. Replace novelist.md examples and inline references

**Goal:** Every example in novelist.md works for any novel project.

**Files:** agents/novelist.md

**Approach:**
- 예시 1/2/3: rewrite BAD and GOOD blocks with genre-neutral scenes
- HARD RULE 4 (전환): generic transition example
- HARD RULE 5 (대사 태그): generic dialogue example
- HARD RULE 8 (POV): generic POV example
- Adult scene GOOD example: generic names
- Sentence structure section: generic 삽입구 and 자유간접화법 examples
- Sensory table: generic sensory GOOD column
- Section titles: remove "회귀 직전", "회귀 직후" genre tags

**Verification:** `grep -c "강윤\|민재\|서강윤\|콘솔 미터\|페이더\|리미터\|미디\|프로듀서\|프로툴\|빌보드\|굳은살\|회귀" agents/novelist.md` returns 0.

### U2. Replace team-orchestrator.md resolution examples

**Goal:** Character resolution priority examples use generic names.

**Files:** agents/team-orchestrator.md

**Approach:**
- Line ~105: byAlias example "강윤" → generic alias like "수현이"
- Line ~106: byName example "서강윤" → generic name like "김수현"

**Verification:** `grep -c "강윤\|서강윤" agents/team-orchestrator.md` returns 0.

## Acceptance Criteria

- `grep -rEc "강윤|민재|서강윤|콘솔 미터|페이더|리미터|미디 키보드|프로듀서|프로툴|빌보드|굳은살" agents/novelist.md agents/team-orchestrator.md` returns 0.
- Examples in novelist.md are concrete Korean prose (not placeholders), demonstrating universal techniques.
- npm test passes (845+).
