# Scene Micro-Turn Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manuscript engagement gate that rejects flat adjacent sentence windows without enough prediction, choice, risk, relationship, consequence, or next-question turns.

**Architecture:** Extend the existing `evaluateEngagementContract` flow with a new manuscript-only assessment. The implementation follows existing issue/directive patterns in `src/quality/engagement-contract.ts` and updates docs/tests that enforce contract coverage.

**Tech Stack:** TypeScript, Vitest, existing engagement contract evaluator and markdown skill docs.

---

### Task 1: Add Red Tests

**Files:**
- Modify: `tests/masterpiece/engagement-contract-evaluator.test.ts`
- Modify: `tests/masterpiece/engagement-contracts.test.ts`

- [ ] **Step 1: Write the failing evaluator tests**

Add one test that expects a flat concrete sequence to fail with `manuscript-micro-turn-density-not-evidenced`, and one test that expects `alignedManuscript` to avoid the new code.

- [ ] **Step 2: Write the failing docs contract tests**

Add expectations that `skills/06-write/SKILL.md`, `skills/08-write-all/SKILL.md`, and `skills/verify-chapter/SKILL.md` mention `manuscript-micro-turn-density-not-evidenced`.

- [ ] **Step 3: Run red tests**

Run:

```powershell
npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts -t "micro-turn"
npx vitest run tests/masterpiece/engagement-contracts.test.ts -t "micro-turn"
```

Expected: both commands fail because the issue code and docs references do not exist yet.

### Task 2: Implement Evaluator Gate

**Files:**
- Modify: `src/quality/engagement-contract.ts`

- [ ] **Step 1: Add the issue code**

Add `manuscript-micro-turn-density-not-evidenced` to `EngagementIssueCode`.

- [ ] **Step 2: Add the assessment types and patterns**

Create a `ManuscriptMicroTurnDensityAssessment` interface, turn-family regex constants, and helpers that classify sliding sentence windows.

- [ ] **Step 3: Wire the assessment into `evaluateManuscriptEvidence`**

Call the assessment after causal-chain checking and before scene texture/density checks. On failure, subtract manuscript momentum and push a critical issue.

- [ ] **Step 4: Add the revision directive**

Add the issue to `directiveCategoryRank` and `directiveTemplate`, targeting `manuscript` with an action that asks for clue, choice, risk, relationship, consequence, and next-question turns inside adjacent sentence windows.

- [ ] **Step 5: Run green evaluator tests**

Run:

```powershell
npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts -t "micro-turn"
```

Expected: targeted evaluator tests pass.

### Task 3: Connect Docs and Benchmark Coverage

**Files:**
- Modify: `skills/06-write/SKILL.md`
- Modify: `skills/08-write-all/SKILL.md`
- Modify: `skills/verify-chapter/SKILL.md`
- Modify: `README.md`
- Modify: `templates/engagement-benchmark.template.json`

- [ ] **Step 1: Update writing and verification skills**

Mention that flat adjacent 2-4 sentence windows without clue, hypothesis, choice, risk, relationship, tactical, consequence, or next-question turns fail the new issue code.

- [ ] **Step 2: Update README**

Document the gate near the existing manuscript scene-state and prose engagement sections.

- [ ] **Step 3: Update engagement benchmark template**

Add `manuscript-micro-turn-density-not-evidenced` to required bad issue coverage.

- [ ] **Step 4: Run green docs tests**

Run:

```powershell
npx vitest run tests/masterpiece/engagement-contracts.test.ts -t "micro-turn"
```

Expected: targeted docs tests pass.

### Task 4: Verification and Commit

**Files:**
- All changed files.

- [ ] **Step 1: Run focused verification**

Run:

```powershell
npx vitest run tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts tests/masterpiece/engagement-benchmark-cli.test.ts tests/docs/template-validation.test.ts
```

Expected: all selected tests pass.

- [ ] **Step 2: Run build**

Run:

```powershell
npm run build
```

Expected: schema/agent/skill/team validation, integrity tests, TypeScript build, and build output verification pass.

- [ ] **Step 3: Check diff cleanliness**

Run:

```powershell
git diff --check
git status --short --branch
```

Expected: no whitespace errors; only intended tracked changes plus the pre-existing untracked `.athanor/`.

- [ ] **Step 4: Commit and push**

Run:

```powershell
git add docs/superpowers/specs/2026-06-23-scene-micro-turn-density-design.md docs/superpowers/plans/2026-06-23-scene-micro-turn-density.md src/quality/engagement-contract.ts tests/masterpiece/engagement-contract-evaluator.test.ts tests/masterpiece/engagement-contracts.test.ts skills/06-write/SKILL.md skills/08-write-all/SKILL.md skills/verify-chapter/SKILL.md README.md templates/engagement-benchmark.template.json
git commit -m "feat: require manuscript micro-turn density"
git push
```

Expected: branch pushes to `origin/master`.

## Plan Self-Review

- Spec coverage: every design requirement maps to Tasks 1-4.
- Placeholder scan: no TBD/TODO/fill-later language.
- Type consistency: issue code spelling is consistent across tests, evaluator, docs, and template.
