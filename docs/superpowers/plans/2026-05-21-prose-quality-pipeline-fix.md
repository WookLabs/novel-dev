# Prose Quality Pipeline Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent short, meta-note-like low-quality chapters by fixing the writing pipeline inputs, character context resolution, team validation, and deterministic quality gates.

**Architecture:** Treat generated plot JSON as a private outline, not prose-ready source text. Build a writer-safe brief before generation, resolve character context by JSON identity rather than filename guesses, validate team definitions against actual agents, and run deterministic quality checks before a chapter is allowed to become final.

**Tech Stack:** Node.js ESM scripts, TypeScript pipeline modules, AJV JSON schema validation, Vitest, markdown-based Claude plugin agents/skills/teams.

---

## Problem Frame

The bad 1화 output is not mainly a model-quality issue. The generated chapter shows short, report-like prose because the plugin currently feeds storyboard/meta planning language directly to writers, fails to load the real character context, and does not enforce the existing quality oracle on the default writing paths.

Observed evidence from `novels/novel_1`:

- `chapters/chapter_001.json` contains prose-hostile planning phrases such as `한 줄`, `0.5초 침묵`, `화면 페이드`, `정서 전환`, `코믹 비트`, `메커닉`, and `노출`.
- `scripts/codex-writer.mjs --dry-run` embeds the full chapter JSON verbatim into the user prompt, so those planning phrases become imitation targets.
- `scripts/codex-writer.mjs` reports `등장인물: none` for `novels/novel_1` even though the chapter references `char_001`; the actual file is `characters/protagonist.json` with internal id `char_001`.
- `agents/team-orchestrator.md` resolves `from_scene_cast` from `chapterJson.scene_cast`, but the current chapter JSON uses `scenes[].characters` and `meta.characters`.
- Default collaborative/Codex 2-pass teams have `quality_gates.enabled: false`; both inspected generated manuscripts return `REVISE` from `analyzeChapter`.
- After earlier validation cleanup, team definitions still reference deleted agents `extras` and `chapter-merger`; current validation does not catch broken team references.

## Scope Boundaries

In scope:

- Restore or validate all team agent references so writing teams cannot silently break.
- Fix character resolution for project character JSON files whose filename differs from internal id.
- Add scene-cast fallback from `scenes[].characters` and `meta.characters`.
- Convert raw plot JSON into a writer-safe brief for `codex-writer.mjs` and team-orchestrator instructions.
- Extend Quality Oracle to detect short-sentence runs and plot-meta leakage.
- Add a deterministic post-write quality gate and wire it into default writing paths.
- Add focused fixtures/tests for the exact failure pattern.

Out of scope:

- Rewriting the user's existing `novels/novel_1` manuscript automatically.
- Changing default model/provider selection.
- Broad prose-style redesign unrelated to the observed short/meta leakage failure.
- Publishing, tagging, or committing unless explicitly requested.

## Key Decisions

1. **Restore `extras` and `chapter-merger` rather than removing team references.**
   The teams were designed around minor/cameo handling and Claude/Codex merge review. Removing those agents makes the published teams internally inconsistent. Restore them to `agents/`, add them to `scripts/validate-agents.mjs`, and update counts/docs.

2. **Do not pass full chapter JSON directly to writer prompts.**
   JSON remains the source of truth, but writers receive a structured brief: prose-safe story facts, scene objectives, cast, continuity, and explicit “private outline phrases not to copy” warnings.

3. **Resolve characters by internal identity first.**
   A valid project can store `characters/protagonist.json` with `id: "char_001"`; filename equality is too brittle. Resolver order should be internal `id`, filename stem, then optional aliases/name.

4. **Quality gate must be deterministic before agent opinion.**
   Agent reviewers are useful, but the current failure is mechanically detectable: too many short sentences, meta terms, missing characters, and REVISE verdicts. Deterministic checks should block or warn before final save.

5. **Strict default for 2-pass/team writes; warning mode for legacy single write if needed.**
   The user-facing quality issue came from the default workflow. Strict gate should apply to `/write-2pass`, collaborative teams, and Codex 2-pass. Plain `/write` can be migrated with a documented escape hatch.

## File Structure

Create:

- `scripts/lib/character-resolver.mjs` - scans project character JSON files and resolves requested character ids to content/files.
- `scripts/lib/chapter-cast.mjs` - extracts effective chapter cast from `scene_cast`, `scenes[].characters`, and `meta.characters`.
- `scripts/lib/writer-brief-builder.mjs` - converts chapter JSON into a prose-safe writer brief and meta-leak warnings.
- `scripts/validate-teams.mjs` - validates team JSON references, workflow dependencies, dynamic resolvers, and orchestrator actions.
- `scripts/quality-gate.mjs` - runs deterministic post-write quality checks and writes a report.
- `tests/fixtures/bad-meta-plot.json` - small representative plot fixture with storyboard/meta terms.
- `tests/fixtures/bad-short-prose.md` - small representative prose fixture with short-sentence runs and meta leakage.
- `tests/scripts/character-resolver.test.mjs`
- `tests/scripts/writer-brief-builder.test.mjs`
- `tests/scripts/validate-teams.test.mjs`
- `tests/scripts/quality-gate.test.mjs`

Modify:

- `scripts/codex-writer.mjs`
- `scripts/validate-agents.mjs`
- `package.json`
- `schemas/team.schema.json`
- `src/pipeline/types.ts`
- `src/pipeline/quality-oracle.ts`
- `tests/pipeline/quality-oracle.test.ts`
- `agents/team-orchestrator.md`
- `agents/quality-oracle.md`
- `agents/prose-surgeon.md`
- `skills/05-gen-plot/SKILL.md`
- `skills/06-write/SKILL.md`
- `skills/write-2pass/SKILL.md`
- `teams/writing-team-collab.team.json`
- `teams/writing-team-collab-2pass.team.json`
- `teams/writing-team-codex-2pass.team.json`
- `teams/writing-team-parallel.team.json`
- `README.md`
- `AGENTS.md`
- `teams/AGENTS.md`

Restore:

- `agents/extras.md`
- `agents/chapter-merger.md`

## Implementation Units

### U1. Restore Broken Team Agent Surface

**Goal:** Make team definitions internally consistent again and ensure future validation catches missing agent files.

**Files:**

- Restore: `agents/extras.md`
- Restore: `agents/chapter-merger.md`
- Modify: `scripts/validate-agents.mjs`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `teams/AGENTS.md`
- Test: `npm run validate:agents`

**Steps:**

- [ ] Restore `agents/extras.md` and `agents/chapter-merger.md` from git history, preserving their original responsibilities.
- [ ] Check both files have valid frontmatter: `name`, `description`, `model`, and valid `color`.
- [ ] Add both files to `ALLOWED_AGENTS` in `scripts/validate-agents.mjs`.
- [ ] Update agent counts in docs from 20 to 22.
- [ ] Run `npm run validate:agents`.

**Test scenarios:**

- Missing `extras.md` fails validation.
- Missing `chapter-merger.md` fails validation.
- Both restored agents pass frontmatter validation.

### U2. Add Team Definition Validation

**Goal:** Catch team references to missing agents, broken workflow dependencies, unsupported orchestrator actions, and unsupported dynamic resolvers during build.

**Files:**

- Create: `scripts/validate-teams.mjs`
- Modify: `package.json`
- Modify: `schemas/team.schema.json`
- Create: `tests/scripts/validate-teams.test.mjs`

**Steps:**

- [ ] Implement `scripts/validate-teams.mjs` using existing validator style from `scripts/validate-agents.mjs` and AJV schema validation from `scripts/validate-schemas.mjs`.
- [ ] Load `agents/*.md` to build the valid static agent id set.
- [ ] Treat `characters/*` as a valid dynamic placeholder only when the team member has `resolve: "from_scene_cast"`.
- [ ] Validate each workflow step agent reference against either static agents, `characters/*`, or team-defined dynamic entries.
- [ ] Validate `depends_on` references point to earlier step names.
- [ ] Validate orchestrator actions are in an explicit allowlist: `codex-writer`, `adult-rewriter`, `chapter-polisher-full`, and future documented actions only.
- [ ] Add `validate:teams` to `package.json`.
- [ ] Add `npm run validate:teams` to `prebuild`.
- [ ] Add tests with a temporary invalid team that references a missing agent and assert the validator fails.

**Test scenarios:**

- A team referencing `missing-agent` fails.
- A step depending on a nonexistent step fails.
- A `characters/*` entry without `resolve: "from_scene_cast"` fails.
- All current teams pass.

### U3. Implement Character And Cast Resolution

**Goal:** Ensure all writing paths load the actual character context for `char_001` even when the file is named `protagonist.json`.

**Files:**

- Create: `scripts/lib/character-resolver.mjs`
- Create: `scripts/lib/chapter-cast.mjs`
- Modify: `scripts/codex-writer.mjs`
- Modify: `agents/team-orchestrator.md`
- Create: `tests/scripts/character-resolver.test.mjs`

**Steps:**

- [ ] Implement `loadCharacterIndex(projectPath)` to scan `characters/*.json`.
- [ ] Index each character by JSON `id`, filename stem, `name`, and optional `aliases` if present.
- [ ] Implement `resolveCharacters(projectPath, ids)` returning resolved characters and missing ids.
- [ ] Implement `extractChapterCast(chapterJson)` with priority:
  1. `scene_cast` when present and non-empty
  2. unique `scenes[].characters`
  3. `meta.characters`
- [ ] Update `scripts/codex-writer.mjs` to use `extractChapterCast` and `resolveCharacters`.
- [ ] Log missing characters as warnings, but include resolved characters in prompt.
- [ ] Update `agents/team-orchestrator.md` so its documented resolution matches this behavior.

**Test scenarios:**

- `char_001` resolves to `characters/protagonist.json` when JSON has `id: "char_001"`.
- A chapter without `scene_cast` resolves cast from `scenes[].characters`.
- A chapter without scene characters falls back to `meta.characters`.
- `codex-writer.mjs --dry-run` for the fixture logs at least one loaded character instead of `none`.

### U4. Build Writer-Safe Plot Brief

**Goal:** Stop plot-planning phrases from becoming prose instructions or literal prose.

**Files:**

- Create: `scripts/lib/writer-brief-builder.mjs`
- Modify: `scripts/codex-writer.mjs`
- Modify: `skills/05-gen-plot/SKILL.md`
- Modify: `agents/team-orchestrator.md`
- Create: `tests/fixtures/bad-meta-plot.json`
- Create: `tests/scripts/writer-brief-builder.test.mjs`

**Steps:**

- [ ] Implement `buildWriterBrief(chapterJson, options)` returning markdown or structured text, not raw JSON.
- [ ] Include safe sections: title, POV, target length, continuity, cast, locations, scene objectives, conflicts, required story facts, emotional arc, hooks/foreshadowing.
- [ ] Add a `privateOutlineWarnings` section that lists removed/unsafe meta phrases from the source JSON.
- [ ] Detect storyboard/meta phrases with patterns for timecodes and production language: `0.5초`, `0.3초`, `한 박자`, `화면 페이드`, `컷`, `비트`, `메커닉`, `노출`, `정서 전환`, `첫 능청`, `권말 컷`.
- [ ] Preserve story meaning while rewriting fields into prose-safe instructions, e.g. `0.5초 침묵` becomes `짧은 침묵으로 어색함을 드러낸다`.
- [ ] Update `scripts/codex-writer.mjs` write/revise prompts to embed `## 작가용 브리프` instead of raw `## 플롯 json`.
- [ ] Add prompt instruction: “브리프는 사전 설계 자료이며, 메타/연출/분석 용어를 본문에 복사하지 말 것.”
- [ ] Update `skills/05-gen-plot/SKILL.md` so future plot generation uses prose-safe beat summaries rather than storyboard notation.

**Test scenarios:**

- The bad plot fixture produces a writer brief with no literal `화면 페이드`, `메커닉`, or `0.5초`.
- The brief still contains the intended story fact after sanitization.
- `codex-writer.mjs --dry-run` no longer prints raw `chapter_001.json` as a JSON code block for write mode.

### U5. Extend Quality Oracle For This Failure Mode

**Goal:** Make the existing deterministic oracle detect the exact prose failures seen in the generated 1화.

**Files:**

- Modify: `src/pipeline/types.ts`
- Modify: `src/pipeline/quality-oracle.ts`
- Modify: `tests/pipeline/quality-oracle.test.ts`
- Create: `tests/fixtures/bad-short-prose.md`
- Modify: `agents/quality-oracle.md`
- Modify: `agents/prose-surgeon.md`

**Steps:**

- [ ] Add directive types `consecutive-short-sentences` and `plot-meta-leak` to `DirectiveType`.
- [ ] Implement Korean-aware sentence splitting that handles `.`, `?`, `!`, Korean quotes, and paragraph breaks better than the current simple split.
- [ ] Implement `detectConsecutiveShortSentences(content, { maxChars: 20, maxRun: 3 })`.
- [ ] Implement `detectPlotMetaLeaks(content)` with outside-dialogue detection where possible.
- [ ] Add score penalties and directives for both new issue types.
- [ ] Keep directive cap behavior, but ensure high-severity meta leaks are not hidden behind lower-severity filter-word directives.
- [ ] Update agent docs so Quality Oracle and Prose Surgeon know how to fix these directives.

**Test scenarios:**

- A paragraph with four consecutive short declarative sentences triggers `consecutive-short-sentences`.
- A manuscript containing `화면 페이드`, `0.5초`, or `메커닉` triggers `plot-meta-leak`.
- Legitimate prose such as `가사 한 줄` should not automatically fail unless combined with other meta patterns.
- Existing filter-word, sensory, and rhythm tests still pass.

### U6. Add Deterministic Post-Write Quality Gate

**Goal:** Prevent a manuscript with `REVISE`, meta leakage, or severe short-sentence runs from being silently accepted as final output.

**Files:**

- Create: `scripts/quality-gate.mjs`
- Modify: `scripts/codex-writer.mjs`
- Create: `tests/scripts/quality-gate.test.mjs`
- Modify: `skills/06-write/SKILL.md`
- Modify: `skills/write-2pass/SKILL.md`

**Steps:**

- [ ] Implement `scripts/quality-gate.mjs --input <chapter.md> --project <project> --chapter <N> --mode strict|warn`.
- [ ] Call `analyzeChapter` from `src/pipeline/quality-oracle.js`.
- [ ] Add hard fail conditions:
  - `verdict === "REVISE"` in strict mode
  - any high-severity `plot-meta-leak`
  - short-sentence run above configured threshold
  - output length below 80% of target character count when target is known
- [ ] Write report to `reviews/quality/chapter_XXX_quality.json`.
- [ ] In `scripts/codex-writer.mjs`, run the gate after generation and before replacing the final chapter file in strict modes.
- [ ] If strict gate fails, save output as `chapters/chapter_XXX.draft.md`, keep the previous final file intact, and exit nonzero with the report path.
- [ ] Add `--quality-mode strict|warn|off` CLI option with strict default for `write` when called by team/2-pass flows.

**Test scenarios:**

- Bad fixture fails strict mode and writes a quality report.
- Bad fixture passes warn mode with nonzero warnings but zero process failure.
- A clean fixture passes strict mode.
- A failed strict write does not overwrite an existing final chapter file.

### U7. Wire Quality Gate Into Default Teams

**Goal:** Ensure the default workflows that users invoke actually run the gate.

**Files:**

- Modify: `teams/writing-team-collab.team.json`
- Modify: `teams/writing-team-collab-2pass.team.json`
- Modify: `teams/writing-team-codex-2pass.team.json`
- Modify: `teams/writing-team-parallel.team.json`
- Modify: `agents/team-orchestrator.md`
- Modify: `schemas/team.schema.json`

**Steps:**

- [ ] Extend team schema/workflow conventions to allow `orchestrator_action: "quality-gate"`.
- [ ] Add a `quality-gate` step after draft/polish/adult rewrite and before proofread/summarize in default writing teams.
- [ ] Set `quality_gates.enabled: true` for default writing teams where strict gate applies.
- [ ] Update `agents/team-orchestrator.md` to execute `node scripts/quality-gate.mjs` for this action.
- [ ] For `writing-team-parallel`, run quality gate before merge on both branches and after merge on final output.

**Test scenarios:**

- `npm run validate:teams` accepts the new `quality-gate` action.
- Team-orchestrator docs show quality gate cannot be bypassed when enabled.
- The default `/write-2pass` path references a team with enabled gate.

### U8. Regression Fixtures And Integration Checks

**Goal:** Preserve the observed bug as a small, commit-safe regression test without committing the user's full novel.

**Files:**

- Create: `tests/fixtures/bad-meta-plot.json`
- Create: `tests/fixtures/bad-short-prose.md`
- Modify: `tests/pipeline/quality-oracle.test.ts`
- Modify: `tests/scripts/writer-brief-builder.test.mjs`
- Modify: `tests/scripts/quality-gate.test.mjs`

**Steps:**

- [ ] Create tiny fixtures that mirror the failure pattern but do not copy the full user manuscript.
- [ ] Add oracle tests for short sentences and meta leakage.
- [ ] Add writer brief tests for plot sanitization.
- [ ] Add quality gate tests for strict/warn behavior.
- [ ] Add a dry-run assertion that `codex-writer.mjs` loads resolved characters and produces writer brief text.

**Test scenarios:**

- `npm test` passes with all new tests.
- `npm run build` passes and includes `validate:teams`.
- `npm run test:integration` still passes.
- `npm audit --audit-level=moderate` remains clean.

### U9. Documentation And Migration Notes

**Goal:** Make the changed behavior understandable to future users and avoid confusing strict-gate failures.

**Files:**

- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `teams/AGENTS.md`
- Modify: `skills/06-write/SKILL.md`
- Modify: `skills/write-2pass/SKILL.md`
- Modify: `skills/05-gen-plot/SKILL.md`

**Steps:**

- [ ] Document that plot JSON is an outline and is sanitized before writing.
- [ ] Document quality gate strict/warn/off modes.
- [ ] Document where reports are written: `reviews/quality/chapter_XXX_quality.json`.
- [ ] Document that character files are resolved by internal `id`, not filename only.
- [ ] Update team/agent/skill counts after restoring agents and adding validator.

**Test scenarios:**

- README quickstart mentions what to do when the gate fails.
- Skill docs no longer claim quality review is optional for default 2-pass/team writes.
- Docs counts match validator counts.

## Sequencing

1. U1 first, because current team JSON is already broken after agent cleanup.
2. U2 second, so the broken-team class of bug cannot return.
3. U3 before U4, because the writer brief should include resolved character details.
4. U4 before U5/U6, because sanitized inputs reduce the amount of bad prose the gate must catch.
5. U5 then U6, because the gate depends on the expanded oracle.
6. U7 after U6, because teams should call a working gate.
7. U8 throughout implementation as regression coverage, finalized before docs.
8. U9 last, after behavior and command names are stable.

## Risks And Mitigations

- **False positives on legitimate short prose.** Mitigate by detecting runs/density, not isolated short sentences.
- **False positives on legitimate phrases like `가사 한 줄`.** Mitigate by treating `한 줄` alone as weak evidence and failing only when paired with timecode/storyboard/meta patterns.
- **Strict gate may block too much at first.** Ship `--quality-mode warn` and document it, but keep strict as default for 2-pass/team writes.
- **Korean sentence splitting is imperfect.** Add focused fixtures and keep thresholds conservative.
- **Restoring agents changes counts again.** Update docs/tests in the same unit and let validators enforce consistency.

## Acceptance Criteria

- `npm run build` passes and now includes team validation.
- `npm test` passes with regression coverage for character resolution, writer brief sanitization, short-sentence detection, meta-leak detection, and quality gate behavior.
- `npm run test:integration` passes.
- `npm audit --audit-level=moderate` reports 0 vulnerabilities.
- `node scripts/codex-writer.mjs --chapter 1 --project novels/novel_1 --mode write --dry-run` shows resolved character context and a writer brief, not raw chapter JSON.
- Running Quality Oracle on the bad generated 1화 flags `plot-meta-leak` and/or `consecutive-short-sentences`.
- A strict gate failure preserves the existing final chapter and writes a draft/report instead.

## Deferred Follow-Up

- After the pipeline fix, generate a fresh 1화 draft and compare it with the old `chapter_001.md` and `chapter_001.opus.md`.
- If output is still too thin, add style-specific few-shot examples, but only after input sanitization and gating are working.
- Consider a project-level configuration for quality thresholds by genre and target audience.
