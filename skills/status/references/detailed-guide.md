# Status Skill - Detailed Guide

## Overview

The status skill provides a comprehensive overview of your novel project's workflow progress, showing which design and writing phases have been completed and what remains to be done.

## Status vs Stats

| Command | Purpose | Focus |
|---------|---------|-------|
| `/status` | Workflow progress | Where am I in the process? |
| `/stats` | Content metrics | How much have I created? |

## Phase Detection System

The skill automatically detects completion based on file existence:

### Phase 1: Initialization
**Check**: `meta/project.json` exists → [x] init

### Phase 2: Design
- `world/world.json` → [x] design: world
- `characters/*.json` → [x] design: character (N chars)
- `plot/main-arc.json` → [x] design: main-arc
- `plot/foreshadowing.json` → [x] design: foreshadow (N elements)
- `plot/hooks.json` → [x] design: hook (N hooks)
- `meta/style-guide.json` → [x] design: style

### Phase 3: Plot Generation
**Check**: `chapters/chapter_001.json` → [x] gen-plot

### Phase 3.5: Design, Style, And Summary Memory Gates
**Check**: `reviews/design-gate-report.json` exists and has `passed == true` with `status == "PASS"` → [x] design-gate
**Check**: `reviews/style-gate-report.json` exists and has `passed == true` with `status == "PASS"` → [x] style-gate
**Check**: For chapter 2+, each prior manuscript among the last 3 chapters has a fresh, substantive `context/summaries/chapter_NNN_summary.md` → [x] summary-memory

If any gate is missing, malformed, `BLOCKED`, stale, or not passed, `/status` should not recommend `/write`, `/resume --continue`, or `/write-all --resume` as the next direct action. Recommended next steps should be:

1. `node dist/cli/run-premise-appeal-benchmark.js --project {projectPath} --json`
2. `node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json`
3. `node dist/cli/run-prose-taste-benchmark.js --project {projectPath} --json`
4. `node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json`
5. Regenerate stale or missing `context/summaries/chapter_NNN_summary.md` files and rerun `/verify-chapter N` when verification output is stale

Only after design, style, and summary memory gates pass should `/status` recommend writing or resume commands.

### Phase 4: Writing
**Progress**: Counts `chapters/chapter_*.md` files → [~] write (12/50)

### Phase 5: Review
- `reviews/*_review.json` → [x] review
- `reviews/consistency-report.json` → [x] review: consistency

## Output Format

Shows workflow checklist with completion status, design gate status, style gate status, summary memory status, current chapter, Ralph state, and recommended next steps.

## Best Practices

### Check Status Regularly
Run `/status` after each major step to see what's next.

### Use Status to Resume Work
After breaks, `/status` shows exactly where you left off.

If Ralph state says the project is resumable but `reviews/design-gate-report.json`, `reviews/style-gate-report.json`, or the prior summary memory is not PASS, treat the project as blocked before writing. Show the current chapter for orientation, but recommend the premise benchmark/design gate commands, prose taste/style gate commands, and summary regeneration before any resume command.

### Validate Workflow Sequence
Status alerts if you've skipped prerequisite steps.

## Ralph State Integration

If `meta/ralph-state.json` exists, shows:
- Current chapter being written
- Ralph loop active/inactive
- Resumable session available
- Whether resumable writing is blocked by the design gate, style gate, or summary memory gate
- Summary memory blockers such as `summary-memory-missing`, `summary-memory-stale`, `summary-memory-too-thin`, and `summary-memory-malformed`

For complete documentation, see the SKILL.md file in: skills/status/
