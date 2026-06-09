---
type: feat
status: active
created: 2026-05-23
plan-id: 2026-05-23-002
---

# feat: Multi-variant chapter-1 prose quality experiment + plugin diagnosis

## Problem Frame

User finds the current plugin's chapter-1 output unsatisfying. The Codex-driven output (`novels/novel_1/chapters/chapter_001.opus.md`) is the user's quality reference — its prose flows naturally and creates immersion. The Claude pipeline output (`chapters/chapter_001.md`) does not match this bar.

We need to determine **whether** the Claude-side Opus team collaboration paths can match the Codex reference quality, **which specific path** (single-pass collab, 2-pass collab, 3-pass collab) gets closest, and **which prose dimensions** still lag. The user will provide gut-level feedback after seeing variants side-by-side. That feedback drives plugin fixes — which are intentionally **deferred** in this plan until evidence exists.

## Scope Boundaries

In scope:
- Generate 3 chapter-1 variants using existing Opus collaboration teams (writing-team-collab, writing-team-collab-2pass, writing-team-collab-3pass).
- Preserve existing plot JSON (`chapters/chapter_001.json`) and character files — variants share the same source material to isolate team/pipeline effects.
- Run with `--quality-mode warn` so the gate produces a report without blocking saves (we want to see each variant even if oracle flags issues).
- Skip the Grok adult-rewriter pass (1화 has no adult scenes by assumption).
- Produce a side-by-side comparison artifact + a feedback-collection note template the user fills in.

Out of scope (Deferred to follow-up after feedback):
- Diagnosing root causes of any quality gap (deferred — depends on feedback).
- Implementing plugin fixes (deferred — depends on diagnosis).
- Regenerating plot JSON from scratch — we want the chapter-writing pipeline to be the variable, not the plot quality.
- Modifying Codex-side teams — Codex output is the reference, not under test.

### Deferred to Follow-Up Work

- Plugin fixes (root causes inferred from variant comparison) — separate plan after this one produces feedback.
- Adult-rewriter integration test (1화 doesn't exercise it).
- Quality Oracle scoring rubric extension (depends on which dimensions the user flags as gaps).
- Codex baseline regeneration with current plot JSON (current `chapter_001.opus.md` may be from older plot — flag if the user wants a fresh baseline).

## Key Technical Decisions

1. **Three Opus team variants, one source plot.** The independent variable is the team pipeline; plot and characters stay fixed. Variants:
   - **V1**: `writing-team-collab` (single-pass Opus novelist + quality-oracle review)
   - **V2**: `writing-team-collab-2pass` minus adult-rewriter (novelist → quality-oracle → prose-surgeon, no Grok)
   - **V3**: `writing-team-collab-3pass` minus adult-rewriter (novelist → quality-oracle → prose-surgeon → chapter-polisher)

2. **Output file naming preserves variants.** Each run writes to a distinct path (e.g., `chapters/chapter_001.variant-collab.md`, `chapters/chapter_001.variant-2pass.md`, `chapters/chapter_001.variant-3pass.md`). Existing `chapter_001.md` and `chapter_001.opus.md` stay untouched as Claude-baseline + Codex-reference comparators.

3. **Quality gate in WARN mode.** All variants run with `--quality-mode warn` so the gate produces a report but doesn't block saves. We want every variant readable even if the oracle would otherwise REVISE it.

4. **Side-by-side comparison via a generated markdown file.** A small script renders all 5 versions (3 variants + 2 baselines) into one comparison document with section anchors per variant, plus the Quality Oracle report for each variant. User reads it in editor / viewer.

5. **Feedback captured in a structured note.** A markdown template (`feedback/2026-05-23-chapter-1-variants.md`) lists each variant with empty sections for "what works", "what doesn't", "rank against codex baseline". The user fills it in. The structure makes downstream diagnosis cheaper.

6. **No plugin code changes in this plan.** The plan stops at "user feedback written". Plugin fixes are a separate plan after we know which dimensions to target.

## File Structure

Create:
- `scripts/render-chapter-comparison.mjs` — generates a side-by-side comparison markdown from the 5 versions
- `feedback/2026-05-23-chapter-1-variants.md` — user feedback template
- `novels/novel_1/chapters/chapter_001.variant-collab.md` (runtime output)
- `novels/novel_1/chapters/chapter_001.variant-2pass.md` (runtime output)
- `novels/novel_1/chapters/chapter_001.variant-3pass.md` (runtime output)
- `novels/novel_1/reviews/quality/chapter_001_variant-*.json` (oracle reports per variant)

Modify:
- (none in this plan — plugin fixes deferred)

Read-only references:
- `novels/novel_1/chapters/chapter_001.json` (plot source)
- `novels/novel_1/characters/*.json` (character context)
- `novels/novel_1/chapters/chapter_001.md` (Claude-baseline)
- `novels/novel_1/chapters/chapter_001.opus.md` (Codex-reference)
- `teams/writing-team-collab.team.json`
- `teams/writing-team-collab-2pass.team.json`
- `teams/writing-team-collab-3pass.team.json`

---

## Implementation Units

### U1. Verify environment and dispatch readiness

**Goal:** Confirm the plugin is in a state where variant runs will produce comparable outputs. No plot/character drift between runs; build is current; no in-flight changes that would skew one variant.

**Files:**
- (read-only) `package.json` (npm run build status)
- (read-only) `novels/novel_1/chapters/chapter_001.json` (plot source)
- (read-only) `novels/novel_1/characters/*.json` (character files)
- (read-only) `dist/pipeline/quality-oracle.js` (must exist for gate)

**Approach:**
- Run `npm run build` to ensure `dist/` is fresh — quality-gate.mjs requires it.
- Verify `chapter_001.json` exists and is parseable; record its character cast.
- Confirm working tree is clean (or at least: no uncommitted changes to scripts/teams that would affect runs).
- Confirm the three writing-team JSON files exist and reference the agents the plan expects (novelist, quality-oracle, prose-surgeon, chapter-polisher).
- Back up existing `chapter_001.md` to `chapter_001.md.experiment-baseline` so re-running this plan doesn't lose the current Claude-baseline.

**Test scenarios:**
- Test expectation: none — environment verification only.
- Manual: `npm run build` exits 0; `cat chapter_001.json | jq .meta` returns valid JSON.

**Verification:** dist is fresh; plot JSON parses; all three team JSON files exist and validate via `npm run validate:teams`.

### U2. Generate V1 — writing-team-collab (single-pass Opus collab)

**Goal:** Produce a chapter-1 variant using the simplest Opus team configuration. This is the floor for "what Opus pipeline can do without multi-pass refinement."

**Files:**
- Read: `teams/writing-team-collab.team.json`
- Read: `chapter_001.json`, `characters/*.json`
- Write: `novels/novel_1/chapters/chapter_001.variant-collab.md`
- Write: `novels/novel_1/reviews/quality/chapter_001_variant-collab_quality.json`

**Approach:**
- Invoke the writing-team-collab orchestration with the existing plot/characters.
- Pass `--quality-mode warn` so the chapter is saved regardless of oracle verdict; we want the prose AND the report.
- Direct the output to a variant-specific filename (do NOT overwrite `chapter_001.md`).
- Capture the Quality Oracle report next to the chapter for later diagnosis.

**Test scenarios:**
- Test expectation: none — this is a generation run, not a code change.
- Manual: variant file exists, has >= 4500 chars, oracle report has a verdict field.

**Verification:** `chapter_001.variant-collab.md` exists, non-empty, ≥ 4500 chars; oracle report JSON present with a `verdict` field.

### U3. Generate V2 — writing-team-collab-2pass minus adult-rewriter

**Goal:** Produce a chapter-1 variant using the 2-pass refinement pipeline (novelist → quality-oracle → prose-surgeon) without the Grok adult-rewriter step. Tests whether adding directive-driven prose surgery to the single-pass output bridges the gap to the codex reference.

**Files:**
- Read: `teams/writing-team-collab-2pass.team.json`
- Write: `novels/novel_1/chapters/chapter_001.variant-2pass.md`
- Write: `novels/novel_1/reviews/quality/chapter_001_variant-2pass_quality.json`

**Approach:**
- Same orchestration shape as U2 but with the 2-pass team.
- Confirm the adult-rewriter step is skipped (either by team config not including it, or by gating). 1화 should not require it; if the team JSON forces it, document this and either skip it manually or note that adult-rewriter ran (and on what content).
- Quality gate in WARN mode again.

**Test scenarios:**
- Test expectation: none — generation run.

**Verification:** variant file exists, ≥ 4500 chars; oracle report present; if directive feedback was applied, it should be visible as a delta from V1 (more rhythm-aware sentences, fewer filter words, etc.).

### U4. Generate V3 — writing-team-collab-3pass minus adult-rewriter

**Goal:** Produce a chapter-1 variant using the deepest Opus refinement pipeline (novelist → quality-oracle → prose-surgeon → chapter-polisher). Tests whether the polish stage closes the remaining gap.

**Files:**
- Read: `teams/writing-team-collab-3pass.team.json`
- Write: `novels/novel_1/chapters/chapter_001.variant-3pass.md`
- Write: `novels/novel_1/reviews/quality/chapter_001_variant-3pass_quality.json`

**Approach:**
- Same as U3 but with 3-pass team.
- chapter-polisher should run last; verify it actually executed (its signature edits would be visible in the diff between V2's draft and V3's final).

**Test scenarios:**
- Test expectation: none — generation run.

**Verification:** variant file exists, ≥ 4500 chars; oracle report present; visible polish delta between V2 and V3.

### U5. Render side-by-side comparison markdown

**Goal:** Produce a single markdown document the user can scan to compare all 5 versions: 3 new variants + Claude baseline + Codex reference. Each version has a header with its provenance and quality-oracle verdict; the body is the prose itself.

**Files:**
- Create: `scripts/render-chapter-comparison.mjs`
- Output: `novels/novel_1/chapters/chapter_001_comparison.md`

**Approach:**
- The script reads the 5 input files, the 3 oracle reports, and emits one markdown document with this structure:
  ```
  # Chapter 1 — variant comparison (YYYY-MM-DD)

  Plot source: chapter_001.json (n scenes, m characters)

  ## V0 — chapter_001.md (Claude baseline, single-agent novelist)
  Oracle verdict: <if available>
  Word count / sentence count / avg sentence length

  <prose body>

  ---

  ## V_codex — chapter_001.opus.md (Codex GPT-5.4 reference)
  ...

  ## V1 — variant-collab (writing-team-collab, single-pass Opus team)
  Oracle verdict: <verdict>
  Filter-word density / sensory density / rhythm summary

  <prose body>

  ## V2 — variant-2pass (writing-team-collab-2pass)
  ...

  ## V3 — variant-3pass (writing-team-collab-3pass)
  ...
  ```
- The script computes simple per-variant stats (char count, sentence count, avg sentence length) without importing the oracle — keep the script standalone and fast.
- If an oracle report exists, surface its verdict + directive count near the header. Don't dump the full report; the report file is linked.

**Test scenarios:**
- Test expectation: minimal — the script is a one-off renderer, not pipeline code. A smoke test: invoke it with a missing input file and assert it prints a helpful error rather than crashing silently.

**Verification:** `chapter_001_comparison.md` exists with 5 distinct sections (V0, V_codex, V1, V2, V3), each with the prose body and meta header. Open in editor; manually skim to confirm sections are readable side-by-side (not buried under formatting noise).

### U6. Create user feedback template

**Goal:** Give the user a structured place to capture impressions so downstream diagnosis (next plan) has actionable input, not just "I like V2 best."

**Files:**
- Create: `feedback/2026-05-23-chapter-1-variants.md`

**Approach:**
- Generate a template like:
  ```markdown
  # Chapter 1 variant feedback — 2026-05-23

  Reference baseline: V_codex (chapter_001.opus.md)

  ## Quick rank (best → worst, by gut feel)
  1.
  2.
  3.
  4.
  5.

  ## Per-variant notes

  ### V0 — Claude baseline (chapter_001.md)
  - **What works**:
  - **What doesn't**:
  - **Gap vs V_codex**:

  ### V_codex — Codex reference (chapter_001.opus.md)
  - **What I'd want to preserve**:
  - **Anything I'd actually change about it**:

  ### V1 — writing-team-collab
  - **What works**:
  - **What doesn't**:
  - **Gap vs V_codex**:

  ### V2 — writing-team-collab-2pass
  - (same shape)

  ### V3 — writing-team-collab-3pass
  - (same shape)

  ## Dimensions I care about (free-form, list whatever matters)
  - e.g., 문체의 술술 읽힘
  - 몰입감
  - 대화 자연스러움
  - 정서 흐름
  - 회귀물 특유의 무게감

  ## If I had to pick ONE diff to make the plugin output match V_codex, it would be:
  -

  ## Open questions for diagnosis
  -
  ```
- The template is plain markdown; the user opens it in their editor and fills it in.

**Test scenarios:**
- Test expectation: none — documentation/template.

**Verification:** template file exists with the section structure above.

### U7. Pause for user feedback (HUMAN-IN-THE-LOOP gate)

**Goal:** This plan does NOT proceed past this gate without user input. The variants exist; the comparison exists; the feedback template exists. The user opens the comparison, opens the template, fills it in, and tells the agent (or a follow-up plan) what to do next.

**Files:** none.

**Approach:**
- The orchestrator (you, in a future ce-work session, or me, in this session if executing inline) STOPS here and reports:
  - paths to the 3 variants
  - path to the comparison file
  - path to the feedback template
  - explicit "waiting for feedback" status
- No further work proceeds until the user signals (next prompt) which variant(s) match their taste and which dimensions still lag.

**Test scenarios:**
- Test expectation: none — pause.

**Verification:** the orchestrator emits the paths and stops. If executed via ce-work, this unit is marked `paused`, not `completed`.

### U8. Deferred — root cause diagnosis (BLOCKED on U7 feedback)

**Goal:** After user feedback, identify which plugin elements drove the gap between the user-preferred variant(s) and the codex reference (or vice versa: what made V_codex preferable to the user-preferred variant). Possible failure modes:
- Prompt-level issues (novelist.md tone instructions, brief sanitization wording)
- Pipeline issues (prose-surgeon directive application, chapter-polisher scope)
- Quality Oracle calibration (thresholds too loose/tight)
- Model selection (Opus vs Codex GPT-5.4 baseline behavior)
- Plot JSON quality (storyboard meta phrasing leaking despite sanitizer)

**Files:** TBD based on feedback.

**Approach:** TBD based on feedback.

**Test scenarios:** TBD.

**Verification:** TBD.

**Execution note:** This unit is intentionally undefined. Plan it after U7 produces feedback.

### U9. Deferred — implement plugin fixes (BLOCKED on U8)

**Goal:** Apply the identified fixes. Likely a small focused PR per finding (prompt edit, oracle threshold tune, polish step adjustment, etc.) rather than one big change.

**Files:** TBD.

**Approach:** TBD.

**Verification:** Regenerate the chosen variant(s); user confirms the diff matches their feedback.

**Execution note:** Plan after U8 lands.

---

## Sequencing

1. **U1** first — environment readiness gate. If dist is stale or plot JSON is broken, every downstream step is invalid.
2. **U2, U3, U4** can run in **parallel** — they share read-only inputs (plot JSON, character files) and write to distinct output paths. No file collision. Run them concurrently if the host allows; sequentially otherwise (no correctness penalty, just longer wall-clock).
3. **U5** after U2/U3/U4 complete — needs all variant outputs to render the comparison.
4. **U6** can run in parallel with anything — it's just a template, no dependencies.
5. **U7** is the gate. Everything stops here pending user feedback.
6. **U8** opens only after U7 produces feedback.
7. **U9** opens only after U8 lands.

Logical commit grouping:
- Commit A (variants): U1 environment notes + U2/U3/U4 variant outputs + U5 comparison + U6 feedback template (all generated artifacts, plus the new render script). Branch this off the current PR-1 branch as a child branch so the experiment doesn't pollute PR #1's history.
- Commit B (diagnosis): U8 deliverables (after feedback). Separate commit on the experiment branch.
- Commit C (fixes): U9 changes. May be split into multiple focused commits or land as a new PR.

---

## Risks And Mitigations

- **Codex CLI not available at runtime:** the Opus team configurations do NOT need Codex (the Codex-2pass team is separate). The 3 variants here use Claude only. Mitigate by selecting collab/collab-2pass/collab-3pass specifically — these are Opus-side. If the team config still calls codex-writer.mjs as orchestrator and codex CLI is required for the subprocess, document the gap and either install Codex CLI or note "variant skipped, codex CLI missing." Preflight via `node scripts/codex-writer.mjs --help` if needed.
- **Variant runs take too long for one session:** each run can be 5–15 minutes (Opus + multi-pass). Mitigate by running them in the background or sequentially with explicit progress reporting. If the user only has time for 1 variant, run V2 (the most-likely middle ground) and defer V1/V3.
- **User feedback is vague:** the structured template helps, but a "I just like it better, can't say why" answer is possible. Mitigate by including the "If I had to pick ONE diff…" prompt — forces a concrete signal even when intuition is the source.
- **`chapter_001.json` plot itself may be the root cause:** if every Claude variant feels storyboard-y and only the Codex reference reads as prose, the plot JSON may carry meta-phrases the sanitizer doesn't catch. Mitigate by capturing the privateOutlineWarnings from each variant's brief and surfacing them in the comparison.
- **Existing `chapter_001.md` is the user's manuscript:** treat as read-only. The backup step in U1 plus distinct variant filenames in U2/U3/U4 prevents accidental overwrite.

## Acceptance Criteria

This plan is **complete** when:
- 3 variant chapter files exist in `novels/novel_1/chapters/` with distinct `.variant-*` suffixes.
- Each variant has a corresponding quality-oracle report.
- `chapter_001_comparison.md` renders all 5 versions side-by-side with stats headers.
- `feedback/2026-05-23-chapter-1-variants.md` exists with the structured template.
- The orchestrator has stopped at U7 and reported the paths.
- The user has opened the comparison and is reviewing it.

This plan is **superseded** when a follow-up plan exists for U8/U9 driven by the user's filled-in feedback template.
