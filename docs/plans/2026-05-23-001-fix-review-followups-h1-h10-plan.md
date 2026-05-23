---
type: fix
status: active
created: 2026-05-23
plan-id: 2026-05-23-001
---

# fix: Address 10 High-severity review findings (H1–H10) for PR #1

## Problem Frame

PR #1 (feat/prose-quality-pipeline-fix → master) is open with 5 commits, 829 unit tests green, and CI passing. A multi-lens code review (security, architecture, performance, testing, quality, documentation) at `.athanor/sessions/2026-05-21-001/review.md` surfaced 10 High-severity findings — 0 Critical — that should land before merge to harden the release.

This plan adds new commits to the same PR (does NOT open a new one) addressing all 10 High findings. Each finding has a concrete fix direction recorded in the review report; this plan turns those directions into ordered implementation units with verification.

## Scope Boundaries

In scope:
- H1: shell injection fix in `runCodex` (drop `bash -c`)
- H2: extract per-mode dispatch from `codex-writer.mjs` into `scripts/lib/modes/`
- H3: move `ALLOWED_ORCHESTRATOR_ACTIONS` allowlist from validator code to JSON schema
- H4: dist/ preflight check in codex-writer before calling quality-gate
- H5: delete severity-string fallback (`d.issue.includes('severity: high')`); make severity field the single source of truth
- H6: regression test for JSON.parse error context (C7 fix)
- H7: regression test for dead `jsonContent` branch removal
- H8: Agent Selection Guide expansion (8 → 22 agents)
- H9: create `CHANGELOG.md` with 2.4.0 entry
- H10: README "Continuous Integration" subsection

Out of scope (Deferred to follow-up):
- Medium and Low findings (M1–M16, L1–L18) — separate PR/issue
- Performance hot paths M7 (regex double-compile) and M8 (slice-based masking) — defer
- Architectural M5 (sanitization pattern dedup) — defer

### Deferred to Follow-Up Work

- M1–M16 Medium findings (file clobber via `--final-path`, path traversal, CI SHA pinning, optional severity field, duplicated sanitization patterns, validator duplication, regex double-compile, slice masking, two paragraph helpers, paragraphIndexAt OOR semantics, gate test gaps, severity assertion duplication, scripts/AGENTS.md silence on lib helpers, plan docs not indexed, README "What's New v8.0" mismatch, README skill catalog inaccuracies)
- L1–L18 Low findings (symlink-following JSON read, shell:true on codex --version, allowlist documentation, path ownership docs, isInDialogue scan, cold dist import, async without I/O, subprocess timeouts, no tsc --noEmit in CI, inline dialoguePattern, character profile double-render, scene_cast priority-1 branch, MODEL_ROUTING ⇄ MAX_SCOPE_LIMITS parity test, paragraph→scene duplication, recovery example, missing quality-gate rows, chapter-verifier subsection, mixed Korean/English voice in AGENTS.md)

## Key Technical Decisions

1. **Drop `bash -c` entirely in runCodex** (H1). Use argv-mode `execFileSync('codex', ['exec', '--model', model, '-o', outputPath, '-'], { input: fs.readFileSync(promptFile) })`. Argv-mode arguments are never re-parsed by a shell — closes the shell-injection surface without requiring input validation.

2. **Extract modes via dispatcher table, not class inheritance** (H2). `scripts/lib/modes/` directory with one `.mjs` per mode (`write`, `revise`, `polish`, `design`, `gen-plot`, `blueprint`). `codex-writer.mjs` becomes a thin CLI front + dispatcher. `runCodex` and `checkPrerequisites` move to `scripts/lib/codex-exec.mjs` for reuse by `adult-rewriter.mjs`.

3. **Schema-driven allowlist** (H3). Move `ALLOWED_ORCHESTRATOR_ACTIONS` from `scripts/validate-teams.mjs` constant to `schemas/team.schema.json` as `enum` on `orchestrator_action`. `validate-teams.mjs` reads the enum from the schema at module load — single source of truth, future additions are one-file edits.

4. **dist/ preflight is fast-fail with clear message** (H4). Add `assertDistBuilt()` in codex-writer that checks for `dist/pipeline/quality-oracle.js` before `runCodex`. If missing, `console.error` with remediation hint (`npm run build`) and `process.exit(2)`. Same check in `scripts/lib/codex-exec.mjs` after H2 refactor.

5. **Delete severity-string fallback now, not later** (H5). Every emit site in the current codebase sets `directive.severity` directly. The `d.issue.includes('severity: high')` branch is unreachable — there are no `severity-undefined` directives that should be treated as high. Delete both copies (`quality-oracle.ts:1238` and `quality-gate.mjs:194,202`). Add a unit test that confirms a directive with `severity: 'high'` triggers gate failure AND a directive with only issue-text "severity: high" does NOT trigger gate failure (pinning the new contract).

6. **Test gaps closed with subprocess + tempdir tests** (H6, H7). Use the existing `spawnSync` + `mkdtempSync` pattern from `tests/scripts/codex-writer-dry-run.test.ts`. For H6, feed malformed chapter JSON, assert stderr contains "Failed to parse chapter JSON at" plus the path. For H7, assert dry-run stdout does NOT match `/### char_\d+\n+```json/` and the user-prompt section has no raw `{"role":` JSON fences.

7. **Doc fixes are surgical** (H8–H10). H8 adds 14 bullet entries under existing Agent Selection Guide structure. H9 creates a new `CHANGELOG.md` keyed to semver (2.4.0 anchor, with placeholders for prior 2.x entries pulled from git log if useful). H10 adds a single "Continuous Integration" subsection in README's existing "Build and Development" area.

## File Structure

Create:
- `scripts/lib/codex-exec.mjs` — `runCodex`, `checkPrerequisites`, `assertDistBuilt` (extracted from codex-writer)
- `scripts/lib/modes/write.mjs`
- `scripts/lib/modes/revise.mjs`
- `scripts/lib/modes/polish.mjs`
- `scripts/lib/modes/design.mjs`
- `scripts/lib/modes/gen-plot.mjs`
- `scripts/lib/modes/blueprint.mjs`
- `CHANGELOG.md`

Modify:
- `scripts/codex-writer.mjs` (H1 runCodex argv-mode; H2 thin CLI dispatcher; H4 dist preflight wiring)
- `scripts/validate-teams.mjs` (H3 read allowlist from schema)
- `schemas/team.schema.json` (H3 add orchestrator_action enum)
- `scripts/quality-gate.mjs` (H5 drop issue-string fallback)
- `src/pipeline/quality-oracle.ts` (H5 drop issue-string fallback in analyzeChapter)
- `AGENTS.md` (H8 Agent Selection Guide expansion)
- `README.md` (H10 CI subsection)

Create test files:
- `tests/scripts/codex-writer-json-parse.test.ts` (H6)
- `tests/scripts/codex-writer-no-json-fence.test.ts` (H7) — OR extend `codex-writer-dry-run.test.ts`
- `tests/scripts/codex-exec.test.ts` (H1 runCodex argv-mode test if feasible without mocking codex CLI)

Modify test files:
- `tests/scripts/validate-teams.test.ts` (H3 — verify schema-sourced allowlist still rejects unknown actions)
- `tests/pipeline/quality-oracle.test.ts` (H5 — pin severity-field-only contract; remove any test that exercised the fallback)
- `tests/scripts/quality-gate.test.ts` (H5 — same pinning)

---

## Implementation Units

### U1. H1: Shell injection fix in `runCodex`

**Goal:** Replace the `bash -c "... ${model} ..."` composition with argv-mode `execFileSync` so the `--model` argument cannot inject shell commands.

**Requirements:** H1 (security blocker per review).

**Dependencies:** none.

**Files:**
- `scripts/codex-writer.mjs` (runCodex function around line 462–491)
- `tests/scripts/codex-exec.test.ts` (CREATE — argv-mode behavior test; OR skip if codex CLI isn't mockable, document in unit notes)

**Approach:**
- Replace `const cmd = \`cat "${promptPath}" | codex exec --model "${model}" -o "${outputPath}" -\`; execFileSync('bash', ['-c', cmd], ...)` with `execFileSync('codex', ['exec', '--model', model, '-o', outputPath, '-'], { input: fs.readFileSync(promptPath), encoding: 'utf8', timeout: ... })`.
- The `input` option pipes the prompt to stdin without shell composition; `-` at the end of codex args means "read from stdin".
- Keep the same timeout, error handling, and tmp-dir cleanup semantics.
- Drop `shell: true` from any other `execFileSync` callers in the same file (L2 nitpick — safe to fix while in the area).

**Patterns to follow:**
- The `spawnSync('node', gateArgs, ...)` pattern already used at `codex-writer.mjs:621` for the quality-gate child is the same shape (argv-mode + safe).

**Test scenarios:**
- Argv-mode invocation: when `model` contains shell metacharacters (e.g., `'gpt-5"; rm -rf /; #'`), the codex CLI sees the literal string as a single arg, not a shell command. (If codex CLI is hard to mock, mark this as a documentation-only test asserting the call uses argv arrays — `expect(execFileSync).toHaveBeenCalledWith('codex', expect.arrayContaining(['exec', '--model', model]), expect.objectContaining({ input: expect.any(String) }))`.)
- Dry-run path still works (existing `tests/scripts/codex-writer-dry-run.test.ts` should continue passing — sanity gate).

**Verification:**
- `npm test` green (829+ tests pass)
- Grep `scripts/codex-writer.mjs` for `bash -c` returns no matches
- Code review on the runCodex diff confirms no shell composition remains

### U2. H4: dist/ preflight check before calling quality-gate

**Goal:** Surface "build not run" as a fast-fail before `runCodex` writes a chapter, instead of as a confusing stderr after the chapter is already generated.

**Requirements:** H4.

**Dependencies:** U1 (lives in the same runCodex neighborhood).

**Files:**
- `scripts/codex-writer.mjs` (add `assertDistBuilt()` call before runCodex in write/revise/polish modes)
- `scripts/AGENTS.md` (one-line note about the dist/ runtime contract; this is also an L4 nitpick — bundle while editing)

**Approach:**
- Add `function assertDistBuilt() { if (!fs.existsSync(path.join(PLUGIN_ROOT, 'dist', 'pipeline', 'quality-oracle.js'))) { console.error('quality-gate requires dist/pipeline/quality-oracle.js. Run \\\`npm run build\\\` first.'); process.exit(2); } }` in codex-writer (or `scripts/lib/codex-exec.mjs` in U7 if H2 lands first — see Sequencing).
- Call `assertDistBuilt()` at the start of `main()` for modes that will invoke quality-gate (write, revise, polish).
- Skip the assertion in dry-run mode (no gate runs).

**Test scenarios:**
- When `dist/` is absent, codex-writer exits 2 with a clear error before invoking codex.
- When `dist/` is present, codex-writer proceeds normally.
- Dry-run bypasses the assertion.

**Verification:**
- `rm -rf dist && node scripts/codex-writer.mjs --chapter 1 --project novels/novel_1 --mode write --dry-run` succeeds (dry-run bypass works)
- `rm -rf dist && node scripts/codex-writer.mjs --chapter 1 --project novels/novel_1 --mode write` exits 2 with the remediation hint
- `npm test` green

### U3. H5: Delete severity-string fallback; pin severity field as single source of truth

**Goal:** Remove the `d.issue.includes('severity: high')` branches in `quality-oracle.ts` and `quality-gate.mjs`. Add tests that pin the new contract (severity field IS the source of truth; issue-string is informational text only).

**Requirements:** H5 (testing+arch+quality dedup).

**Dependencies:** none.

**Files:**
- `src/pipeline/quality-oracle.ts` (line ~1238: `d.severity === 'high' || (d.issue && d.issue.includes('severity: high'))` → `d.severity === 'high'`)
- `scripts/quality-gate.mjs` (lines ~194, ~202: same change)
- `tests/pipeline/quality-oracle.test.ts` (add pin tests; remove any test that exercised the fallback)
- `tests/scripts/quality-gate.test.ts` (same)

**Approach:**
- Audit all callers: every emit site in this PR sets `directive.severity` directly. Confirm by grep `directive.severity = ` in `src/pipeline/quality-oracle.ts`.
- Delete the fallback expressions; the OR collapses to `d.severity === 'high'`.
- Keep the human-readable "severity: high" text in the issue field for log/debugging clarity, but document that it's NOT machine-checked.

**Patterns to follow:**
- Existing pattern of using typed directive shape; severity is now load-bearing.

**Test scenarios:**
- A directive with `severity: 'high'` AND issue text WITHOUT "severity: high" still triggers the gate (proves field is authoritative).
- A directive with `severity: undefined` AND issue text containing "severity: high" does NOT trigger the gate (proves fallback is dead).
- Existing high-severity meta-leak suppression bypass still fires (regression check).

**Verification:**
- `npm test` green; new pin tests pass.
- `npx tsc --noEmit` clean.
- Grep `issue.includes('severity` returns no matches in `src/` or `scripts/`.

### U4. H6: Regression test for JSON.parse error context (C7 fix)

**Goal:** Pin the helpful error message added in the prior commit for malformed chapter JSON.

**Requirements:** H6.

**Dependencies:** none.

**Files:**
- `tests/scripts/codex-writer-json-parse.test.ts` (CREATE)

**Approach:**
- Use the existing `mkdtempSync` + `spawnSync` pattern from other codex-writer subprocess tests.
- Create a temp project with `chapters/chapter_001.json` containing `{not json}`.
- Run `node scripts/codex-writer.mjs --chapter 1 --project <tmpProject> --mode write --dry-run` (dry-run avoids needing codex CLI).
- Assert exit code non-zero, stderr contains both the literal path string and `Failed to parse chapter JSON at`.

**Test scenarios:**
- Malformed JSON → stderr includes file path + "Failed to parse chapter JSON at".
- Valid JSON → no parse error message in stderr.

**Verification:**
- `npm test` shows the new test file passes; full suite green.

### U5. H7: Regression test for dead `jsonContent` branch removal

**Goal:** Pin the absence of raw-JSON character renders in codex-writer prompts.

**Requirements:** H7.

**Dependencies:** none.

**Files:**
- `tests/scripts/codex-writer-dry-run.test.ts` (EXTEND with two new assertions) — or add a separate `codex-writer-no-json-fence.test.ts` if the existing file is already large.

**Approach:**
- Inside an existing `describe.skipIf(!projectExists)` block (or behind its own skipIf gate), add assertions on the dry-run output:
  - `expect(output).not.toMatch(/### char_\d+\n+```json/)` — no raw-JSON fences under character headings
  - Pick out the user-prompt section by the same split convention the file already uses, and assert it doesn't match `/```json[\s\S]*?"role":/m` — no role-shaped JSON dumped
- These guard against accidental regression to the dead `jsonContent` rendering branch.

**Test scenarios:**
- Dry-run output for `novels/novel_1` has no `### char_001` followed by `\`\`\`json`.
- The user-prompt section has no `"role":` inside a `\`\`\`json` fence.

**Verification:**
- `npm test` green; new assertions pass.

### U6. H3: Schema-driven `orchestrator_action` allowlist

**Goal:** Move the action allowlist from validator code to JSON schema so adding a future action is a single-file edit.

**Requirements:** H3.

**Dependencies:** none.

**Files:**
- `schemas/team.schema.json` (add `enum` to `orchestrator_action` property — confirm the schema's current shape first; if no orchestrator_action property exists, add one)
- `scripts/validate-teams.mjs` (read enum from schema at module load; delete the hardcoded Set)
- `tests/scripts/validate-teams.test.ts` (verify the schema-sourced allowlist still rejects unknown actions; add a regression test for schema drift detection)

**Approach:**
- Read `schemas/team.schema.json` to confirm structure. Likely needs a path like `properties.workflow.items.properties.orchestrator_action.enum` or similar.
- In `validate-teams.mjs`, replace `const ALLOWED_ORCHESTRATOR_ACTIONS = new Set([...])` with `const ALLOWED_ORCHESTRATOR_ACTIONS = new Set(readEnumFromSchema('orchestrator_action'))` where `readEnumFromSchema` is a small helper that loads `schemas/team.schema.json` and extracts the enum.
- Falls back to ['codex-writer', 'adult-rewriter', 'chapter-polisher-full', 'quality-gate'] if schema unreadable, with a console.warn — defensive but loud.

**Test scenarios:**
- Adding `'foo-action'` to the schema enum makes `validate-teams.mjs` accept teams using that action.
- Removing `'codex-writer'` from the schema enum makes validate-teams reject teams that use codex-writer (proves schema is authoritative).
- Missing/malformed schema falls back to the historical Set with a warning (defensive).

**Verification:**
- `npm test` green.
- `npm run validate:teams` still passes for the 4 default writing teams.
- Manual: edit the schema to add a new action, re-run validate:teams, see it accepted.

### U7. H2: Extract modes from `codex-writer.mjs` into `scripts/lib/modes/`

**Goal:** Decompose the 660-line codex-writer monolith into a thin CLI dispatcher + per-mode handlers + shared codex-exec helper.

**Requirements:** H2.

**Dependencies:** U1 (runCodex must be argv-mode first), U2 (assertDistBuilt lives in scripts/lib/codex-exec.mjs after this).

**Files:**
- `scripts/lib/codex-exec.mjs` (CREATE — runCodex, checkPrerequisites, assertDistBuilt extracted from codex-writer)
- `scripts/lib/modes/write.mjs` (CREATE)
- `scripts/lib/modes/revise.mjs` (CREATE)
- `scripts/lib/modes/polish.mjs` (CREATE)
- `scripts/lib/modes/design.mjs` (CREATE)
- `scripts/lib/modes/gen-plot.mjs` (CREATE)
- `scripts/lib/modes/blueprint.mjs` (CREATE)
- `scripts/codex-writer.mjs` (REDUCE to thin CLI dispatcher: parse args, dispatch to mode handler, exit)

**Approach:**
- First pass: extract `runCodex`, `checkPrerequisites`, `assertDistBuilt`, and any pure helpers into `codex-exec.mjs`. Re-import from `codex-writer.mjs`. Tests stay green.
- Second pass: per mode, extract the mode-specific logic (prompt building, file paths, gate invocation) into `scripts/lib/modes/<mode>.mjs`. Export `default async function run({ chapter, project, dryRun, qualityMode, ... }) { ... }`.
- Third pass: `codex-writer.mjs` becomes ~80 lines of arg parsing + `await mode.default(opts)` + exit-code mapping.
- Preserve every existing CLI flag and behavior; this is pure restructuring.

**Patterns to follow:**
- The thin-dispatcher shape used in `scripts/lib/character-resolver.mjs` (small, focused module with single exported function).
- Existing import style: ESM, no CommonJS, no dynamic imports unless necessary.

**Test scenarios:**
- All existing codex-writer subprocess tests (`tests/scripts/codex-writer-dry-run.test.ts`, U4/U5 above) continue to pass — proves restructuring is behavior-preserving.
- Each mode module is importable in isolation: `import('./scripts/lib/modes/write.mjs')` doesn't crash.

**Verification:**
- `npm test` green; all subprocess tests pass.
- `wc -l scripts/codex-writer.mjs` shows substantial reduction (target: <200 lines).
- `node scripts/codex-writer.mjs --help` (if --help exists) or `--chapter 1 --dry-run` behaves identically to before.

**Execution note:** This is a large refactor. Land U1 + U2 first (so runCodex/dist-preflight have their final shape), then do this U7 in a single commit to preserve atomicity. If the refactor proves more invasive than expected during work, split into U7a (extract codex-exec.mjs) + U7b (extract modes/) commits — each behavior-preserving on its own.

### U8. H8: Agent Selection Guide expansion (8 → 22 agents)

**Goal:** Expand `AGENTS.md` Agent Selection Guide so AI agents have routing guidance for the full 22-agent roster.

**Requirements:** H8.

**Dependencies:** none.

**Files:**
- `AGENTS.md` (lines ~164–176 — the Agent Selection Guide section)

**Approach:**
- Read the existing 8-role guide as the template shape (one bullet per agent with "when to choose" guidance).
- Add bullet entries for the 14 missing agents. List from the file system (`ls agents/*.md`) and match against the existing table to find missing ones. Expected missing: narrator, character-designer, arc-designer, extras, chapter-merger, quality-oracle, prose-surgeon, team-orchestrator, plus any others.
- For each new agent, write a one-line bullet: `**<agent>** — <when to choose>`. Reference the agent's frontmatter description for accuracy.
- Maintain the existing voice (Korean prose + English headers per convention).

**Test scenarios:**
- Test expectation: none — documentation-only change.
- Manual: cross-reference each bullet with the agent's frontmatter to confirm the routing guidance matches the agent's actual purpose.

**Verification:**
- `wc -l AGENTS.md` shows growth.
- Spot-check: a reader looking for "how do I fix bad prose?" finds prose-surgeon under the Selection Guide.

### U9. H9: Create CHANGELOG.md with 2.4.0 entry

**Goal:** Establish a release-notes record for the 2.4.0 cut shipped by this PR.

**Requirements:** H9.

**Dependencies:** none.

**Files:**
- `CHANGELOG.md` (CREATE at repo root)

**Approach:**
- Standard Keep-a-Changelog format: `# Changelog`, then `## [2.4.0] - 2026-05-23` (or PR merge date) with subsections: `### Added`, `### Changed`, `### Fixed`, `### Security`.
- Pull entry content from this PR's commits + the original feat commit message of U1–U9 (the writer pipeline + quality gate work).
- Optionally backfill `## [Unreleased]` and `## [2.3.2]` / `## [2.3.1]` / `## [2.3.0]` from `git log --oneline v2.3.0..HEAD` — best-effort, don't over-engineer. If backfill is awkward, just create 2.4.0 with a note "earlier history lives in git log".

**Test scenarios:**
- Test expectation: none — documentation-only change.
- Manual: render preview the file; confirm sections are well-formed Markdown.

**Verification:**
- `CHANGELOG.md` exists at repo root.
- The 2.4.0 entry covers `--quality-mode`, writer-safe brief, plot-meta-leak directive, CI workflow.

### U10. H10: README "Continuous Integration" subsection

**Goal:** Document the CI workflow added in commit f72559e so contributors know `npm test:integration` and `npm audit` are enforced on PRs.

**Requirements:** H10.

**Dependencies:** none.

**Files:**
- `README.md` (add subsection under existing "Build and Development" area, or create one if absent)

**Approach:**
- Read README structure first; find the appropriate location (likely between "Development" and "Quality Gate" sections).
- Add a short subsection: header "### Continuous Integration" (or Korean equivalent matching README voice), 5–8 lines covering:
  - Trigger: `pull_request` to any branch, `push` to master
  - Environment: Ubuntu latest, Node 20, npm cache
  - Steps: `npm ci`, `npm run build` (incl. all validators + tsc), `npm test`, `npm run test:integration`, `npm audit --audit-level=moderate`
  - Where to find logs (PR Checks tab + GitHub Actions tab)

**Test scenarios:**
- Test expectation: none — documentation-only change.
- Manual: a contributor reading README knows that `npm test:integration` runs on CI.

**Verification:**
- Subsection exists with the listed content.
- README's "Build and Development" section still flows correctly.

---

## Sequencing

1. **U1 first** — shell injection is the biggest correctness/security blocker; small contained change.
2. **U2 second** — dist preflight lives in the same runCodex neighborhood; lands cleanly after U1.
3. **U3 third (in parallel-safe slot)** — severity fallback removal is independent of codex-writer; can be done at any time.
4. **U4 and U5** — small test additions; do them before U7 so they exercise the pre-refactor shape and then continue to pass post-refactor (act as restructuring regression coverage).
5. **U6** — schema allowlist; independent.
6. **U7** — large mode-extraction refactor; do AFTER U1+U2+U4+U5 so the behavior is settled before restructuring.
7. **U8, U9, U10** — docs; do last, since they reference the final state of the code.

Logical commit grouping:
- Commit A (fixes): U1 + U2 + U3 + U4 + U5 + U6 — small surgical changes
- Commit B (refactor): U7 — atomic mode extraction
- Commit C (docs): U8 + U9 + U10 — three doc additions

---

## Risks And Mitigations

- **U7 refactor blast radius:** extracting 6 mode handlers + codex-exec helper from a 660-line file risks subtle behavior drift. Mitigate by landing U1+U2+U4+U5 first (existing subprocess tests + new regression tests act as restructuring guard), and committing U7 atomically so any regression bisects cleanly. If proven too invasive during work, split into U7a (codex-exec only) + U7b (modes only) — each behavior-preserving.
- **U3 fallback removal regression risk:** any currently-unflagged directive that relies on issue-string severity would suddenly become a passing case. Mitigate by grepping all `directive.severity =` sites and confirming every emit assigns severity explicitly before the fallback delete.
- **U6 schema parsing complexity:** if `schemas/team.schema.json` doesn't have an obvious path to the orchestrator_action enum (nested under workflow/branches/etc.), the readEnumFromSchema helper may need to walk multiple paths. Mitigate by reading the schema first and writing the helper to handle the actual structure.
- **U9 CHANGELOG history backfill ambiguity:** pre-2.4.0 history has no record. Mitigate by capping backfill scope — best-effort 2.3.x entries from git log, otherwise just note "history before 2.4.0 lives in git log".

## Acceptance Criteria

- All 10 H findings are addressed by code or doc changes.
- `npm test` shows 829+ unit tests pass (new tests added by U3/U4/U5/U6).
- `npm run build` passes.
- `npm run test:integration` passes.
- `npm audit --audit-level=moderate` clean.
- `npx tsc --noEmit` 0 errors.
- PR #1's GitHub Actions CI goes green after the new commits push.
- `grep -r 'bash -c' scripts/` returns no matches (H1 verification).
- `grep -r "issue.includes('severity" src/ scripts/` returns no matches (H5 verification).
- `wc -l scripts/codex-writer.mjs` shows substantial reduction (target: <200 lines, was 660+).
- `ls scripts/lib/modes/` shows 6 mode files.
- `CHANGELOG.md` exists at repo root with a 2.4.0 entry.
- README has a "Continuous Integration" subsection.
- AGENTS.md Agent Selection Guide enumerates all 22 agents.
