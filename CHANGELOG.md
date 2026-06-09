# Changelog

All notable changes to novel-dev will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.4.0] - 2026-05-23

### Added
- Writer-safe brief builder (`scripts/lib/writer-brief-builder.mjs`) — sanitizes storyboard/meta phrases (0.5초, 화면 페이드, 메커닉, 권말 컷 등) from chapter JSON before feeding to the writer LLM, replacing raw `## 플롯 json` block with `## 작가용 브리프`.
- Character resolver (`scripts/lib/character-resolver.mjs`) — resolves characters by JSON internal `id` first, then filename stem, then aliases, then name; fixes the long-standing "char_001 → protagonist.json" mismatch.
- Chapter cast extractor (`scripts/lib/chapter-cast.mjs`) — extracts effective cast via `scene_cast > scenes[].characters > meta.characters` fallback.
- Deterministic quality gate (`scripts/quality-gate.mjs`) — `--quality-mode strict|warn|off` CLI; runs Quality Oracle and hard-fails strict mode on REVISE verdict, high-severity plot-meta-leak, high-severity consecutive-short-sentences, or length below 80% of target. Preserves existing final chapter and writes `chapter_XXX.md.draft.md` on strict failure.
- Quality Oracle directive types `consecutive-short-sentences` and `plot-meta-leak` with Korean-aware sentence splitter and Korean curly-quote (`"…"`) dialogue protection.
- `severity` field on `SurgicalDirective` as a first-class machine-checkable value.
- Team validation (`scripts/validate-teams.mjs`) — validates agent references, depends_on chains, `depends_on_branch` for parallel teams, and orchestrator_action enum sourced from `schemas/team.schema.json`.
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) — runs build + tests + integration + npm audit on every PR and push to master.
- Default writing teams (`writing-team-collab`, `writing-team-collab-2pass`, `writing-team-codex-2pass`, `writing-team-parallel`) now include a `quality-gate` step with `quality_gates.enabled: true`.
- Restored `agents/extras.md` (minor/cameo handler) and `agents/chapter-merger.md` (Claude+Codex merge reviewer).
- Modular codex-writer architecture: `scripts/lib/codex-exec.mjs` + `scripts/lib/codex-writer-common.mjs` + `scripts/lib/modes/{write,revise,polish,design,gen-plot,blueprint}.mjs`. `scripts/codex-writer.mjs` reduced from 673 lines to ~140-line CLI dispatcher.
- `CHANGELOG.md` (this file).

### Changed
- `codex-writer.mjs` now embeds writer-safe brief (`## 작가용 브리프`) instead of raw chapter JSON in user prompts.
- Schema-driven `orchestrator_action` allowlist — the enum in `schemas/team.schema.json` is the single source of truth; `validate-teams.mjs` reads from there.
- Korean dialogue detection (`"…"` curly quotes, `「…」` corner brackets) now correctly handled in both sanitizer and Quality Oracle.

### Fixed
- Shell injection surface in `runCodex` — replaced `bash -c "... ${model} ..."` with argv-mode `execFileSync('codex', [...], { input })`.
- Race condition in codex-writer tmp-file paths — `mkdtempSync` per invocation instead of shared `/tmp/codex-writer/`.
- `maxRun` threshold mismatch between exported `detectConsecutiveShortSentences` and `analyzeChapter` call site — both now use the plan's MUST value of 4.
- JSON.parse error context — codex-writer now throws `Failed to parse chapter JSON at <path>: ...` instead of bare `SyntaxError`.
- Dead `jsonContent` character-rendering branch removed (was emitting raw JSON fences in user prompts).
- `quality-gate.mjs` now reads actual `sceneCount` from chapter JSON instead of hardcoding 1.
- Per-paragraph plot-meta-leak directives (was a single roll-up directive).
- Severity-string fallback (`d.issue.includes('severity: high')`) removed — `directive.severity` is now the sole machine-checkable source.
- `depends_on_branch` validation in `validate-teams.mjs` for parallel team branches.
- Curly-quote dialogue (`"…"`) no longer triggers false-positive `plot-meta-leak` directives.

### Security
- Shell injection in `--model` argument closed (argv-mode invocation; no bash composition).
- dist/ preflight check fast-fails before chapter generation if `npm run build` hasn't been run.

## [2.3.2] - earlier
Hook compatibility fix (python → python3 in hooks.json). See git log for details.

## [2.3.1] - earlier
Plugin install source-type fix (`"."` → `"./"`) and version unification. See git log for details.

## [2.3.0] - earlier
Writer pipeline scaffolding. See git log for details.
