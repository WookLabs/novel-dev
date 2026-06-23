# Write-All Skill - Detailed Guide

## Ralph Loop Architecture

The write-all skill implements a persistent, quality-gated loop that writes an entire novel from chapter 1 to the target chapter count.

### Core Principles

1. **Persistence**: Never stops until novel is complete
2. **Quality Gates**: Multi-validator consensus on every chapter
3. **Circuit Breaker**: Intelligent failure handling
4. **Session Recovery**: Resume from interruption
5. **Promise Tracking**: Tamper-proof progress markers
6. **Preflight Gates**: Do not start or resume drafting until design, style, and summary memory gates all pass

## Preflight Gate System

`/write-all`, `/write-all --resume`, and `/write-all --restart` can all create new manuscript text. Before any chapter draft starts, run the design/style preflight gates and verify summary memory for resumed chapters:

```bash
node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json
node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json
```

The loop may start only when all preflight evidence passes:

- `reviews/design-gate-report.json.passed == true`
- `reviews/design-gate-report.json.status == "PASS"`
- `reviews/style-gate-report.json.passed == true`
- `reviews/style-gate-report.json.status == "PASS"`
- For chapter 2+, each prior manuscript among the last 3 chapters has `context/summaries/chapter_NNN_summary.md`
- Each summary is newer than its manuscript and has compact text of at least 100 characters

If the design gate is missing, stale, malformed, or blocked, do not write Chapter 1 or resume the current chapter. Regenerate the premise benchmark and design gate first:

```bash
node dist/cli/run-premise-appeal-benchmark.js --project {projectPath} --json
node dist/cli/apply-design-gate.js --project {projectPath} --fail-on-blocked --json
```

If the style gate is missing, stale, malformed, or blocked, do not write Chapter 1 or resume the current chapter. Regenerate the prose taste benchmark and style gate first:

```bash
node dist/cli/run-prose-taste-benchmark.js --project {projectPath} --json
node dist/cli/apply-style-gate.js --project {projectPath} --fail-on-blocked --json
```

Common blocking issue codes include `premise-appeal-not-ready`, `weak-promise-evidence`, `premise-appeal-report-stale`, `premise-appeal-source-missing`, `prose-taste-not-ready`, `prose-taste-failing-samples`, `prose-taste-false-classification`, `style-friction-evidence-weak`, `style-highlight-evidence-weak`, `style-fingerprint-weak`, `authorial-style-drift`, `prose-taste-report-stale`, and `prose-taste-source-missing`.

If summary memory is missing, stale, malformed, or too thin, do not resume the current chapter. Regenerate `context/summaries/chapter_NNN_summary.md` from the affected prior manuscript and rerun `/verify-chapter N` if the chapter verification output is also stale. Summary memory blockers are `summary-memory-missing`, `summary-memory-stale`, `summary-memory-too-thin`, and `summary-memory-malformed`.

## Multi-Validator System

### Validator Types

The system uses three independent validators for each chapter:

#### 1. Critic (novel-dev:critic)

**Purpose**: Overall quality assessment

**Evaluation Criteria** (25 points each):
- Narrative/Prose Quality (25 pts)
- Plot Consistency (25 pts)
- Character Consistency (25 pts)
- Setting Adherence (25 pts)

**Total**: 100 points

**Threshold**:
- All chapters: ≥95 points

**Output Format**:
```json
{
  "score": 96,
  "breakdown": {
    "narrative_quality": 24,
    "plot_consistency": 24,
    "character_consistency": 24,
    "setting_adherence": 24
  },
  "passed": true,
  "feedback": "Strong opening with polished dialogue, rhythm, and clear plot execution..."
}
```

#### 2. Beta-Reader (novel-dev:beta-reader)

**Purpose**: Reader engagement and retention prediction

**Evaluation Focus**:
- Engagement score (0-100)
- Predicted drop-off points
- Emotional impact
- Pacing issues
- Reader retention likelihood

**Threshold**:
- All chapters: ≥95 engagement

**Output Format**:
```json
{
  "engagement_score": 96,
  "retention_prediction": 96,
  "drop_off_points": [
    {
      "location": "Scene 2, paragraph 5",
      "reason": "Pacing slows, info dump",
      "severity": "minor"
    }
  ],
  "emotional_peaks": [
    { "location": "Scene 3", "type": "tension", "strength": 9 }
  ],
  "passed": true
}
```

#### 3. Genre-Validator (novel-dev:genre-validator)

**Purpose**: Genre-specific requirements compliance

**Evaluation Focus**:
- Genre tropes presence
- Reader expectations met
- Category-specific elements
- Tone consistency

**Threshold**:
- All chapters: ≥95 compliance

**Output Format**:
```json
{
  "compliance_score": 96,
  "genre": "romance",
  "required_elements": [
    { "element": "chemistry", "present": true, "strength": "strong" },
    { "element": "conflict", "present": true, "strength": "medium" },
    { "element": "tension", "present": true, "strength": "strong" }
  ],
  "tone_consistency": 96,
  "passed": true
}
```

### Consensus Mechanism

All three validators must pass for chapter to proceed:

```javascript
function checkConsensus(results, chapterNum) {
  const thresholds = getThresholds(chapterNum);

  const criticPassed = results.critic.score >= thresholds.critic;
  const betaPassed = results.betaReader.engagement_score >= thresholds.beta;
  const genrePassed = results.genreValidator.compliance_score >= thresholds.genre;

  return {
    passed: criticPassed && betaPassed && genrePassed,
    results: results,
    diagnostic: generateDiagnostic(results)
  };
}
```

**Threshold Table**:

| Validator | Regular Chapter | Chapter 1 |
|-----------|----------------|-----------|
| critic | ≥95 | ≥95 |
| beta-reader | ≥95 | ≥95 |
| genre-validator | ≥95 | ≥95 |

### Chapter 1 Special Requirements

Chapter 1 uses the same 95-point validator thresholds, plus additional retention checks because it determines reader retention for the entire novel.

**Additional Chapter 1 Checklist**:
- [ ] Strong hook in first paragraph (crisis or intrigue)
- [ ] Protagonist's uniqueness established within 3 paragraphs
- [ ] Promise of "사이다" (payoff) within 3-5 chapters
- [ ] Genre core elements clearly visible
- [ ] Predicted retention rate ≥95%

**Implementation**:
```javascript
if (chapterNum === 1) {
  const checklist = validateChapter1Checklist(chapter);
  if (!checklist.passed) {
    return {
      passed: false,
      diagnostic: {
        severity: "critical",
        reason: "Chapter 1 checklist failed",
        details: checklist.failures
      }
    };
  }
}
```

## Diagnostic System

When validators fail, the system generates detailed diagnostics for targeted revision.

### Diagnostic Structure

```json
{
  "severity": "major",
  "root_cause": "Pacing inconsistency",
  "failed_validators": ["critic", "beta-reader"],
  "specific_issues": [
    {
      "validator": "beta-reader",
      "issue": "Scene 2 drags",
      "location": "Paragraphs 8-15",
      "suggested_fix": "Cut exposition, add action/dialogue"
    },
    {
      "validator": "critic",
      "issue": "Character motivation unclear",
      "location": "Scene 3",
      "suggested_fix": "Add internal monologue showing decision process"
    }
  ],
  "effort_estimate": "moderate",
  "revision_strategy": "focused"
}
```

### Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| `critical` | Fundamental flaw | Major rewrite required |
| `major` | Significant issues | Targeted revision (2-3 scenes) |
| `minor` | Polish needed | Light editing |

### Effort Estimates

| Estimate | Typical Scope | Time |
|----------|---------------|------|
| `quick` | Typos, minor wording | <5 min |
| `moderate` | Scene-level revision | 10-20 min |
| `significant` | Multi-scene rewrite | 30+ min |

## Circuit Breaker Pattern

Prevents infinite retry loops when chapter consistently fails validation.

### Trigger Condition

Circuit breaker triggers when:
- Same diagnostic appears 3 times consecutively
- Total retry count exceeds 5 for single chapter
- Validator scores trend downward over 3 attempts

### User Options

When circuit breaker triggers:

```
⚠️ CIRCUIT BREAKER TRIGGERED

Chapter 5 has failed validation 3 times with same issue:
"Character motivation unclear in Scene 3"

Options:
(A) Pause for manual editing
    → Opens chapter in editor
    → Resume when ready

(B) Pause for structural rework
    → Keep the 95 quality threshold
    → Revise plot/scene causes before retrying

(C) Skip chapter with placeholder
    → Marks chapter as "needs revision"
    → Continue to next chapter

(D) Abort write-all
    → Stop entire process
    → Review progress so far

Choose [A/B/C/D]:
```

### Implementation

```javascript
class CircuitBreaker {
  constructor() {
    this.failureCount = 0;
    this.failureReasons = [];
    this.triggered = false;
  }

  recordFailure(diagnostic) {
    this.failureCount++;
    this.failureReasons.push(diagnostic.root_cause);

    // Check for repeated failures
    if (this.failureReasons.length >= 3) {
      const lastThree = this.failureReasons.slice(-3);
      if (lastThree.every(r => r === lastThree[0])) {
        this.triggered = true;
      }
    }

    // Check for excessive retries
    if (this.failureCount >= 5) {
      this.triggered = true;
    }
  }

  reset() {
    this.failureCount = 0;
    this.failureReasons = [];
    this.triggered = false;
  }
}
```

## Session Recovery System

### State Persistence

All progress saved to `meta/ralph-state.json`:

```json
{
  "ralph_active": true,
  "mode": "write-all",
  "project_id": "novel_20250117_143052",
  "current_act": 1,
  "current_chapter": 5,
  "total_chapters": 50,
  "total_acts": 3,
  "completed_chapters": [1, 2, 3, 4],
  "failed_chapters": [],
  "act_complete": false,
  "quality_score": 0,
  "last_quality_score": 87,
  "retry_count": 2,
  "iteration": 1,
  "max_iterations": 100,
  "can_resume": true,
  "last_checkpoint": "2026-01-21T10:30:00Z",
  "started_at": "2026-01-21T09:00:00Z",
  "quality_threshold": 95,
  "validators": ["critic", "beta-reader", "genre-validator"],
  "circuit_breaker": {
    "failure_count": 2,
    "failure_reasons": ["Pacing issue", "Pacing issue"],
    "triggered": false
  },
  "last_validation": {
    "critic": 87,
    "beta_reader": 78,
    "genre_validator": 92,
    "all_passed": true
  }
}
```

### Checkpoint Backups

Automatic backups on every chapter completion:

```
meta/backups/
├── ralph-state_20250121_100000.json
├── ralph-state_20250121_103000.json
└── ralph-state_20250121_110000.json
```

Keeps last 3 backups. Rotation policy:
- New backup on chapter completion
- Oldest backup deleted when >3 exist
- Manual backups not auto-deleted

### Max Iteration Pause

When `max_iterations` is reached before a gated act or novel completion, Ralph Loop must pause with `requires_user_intervention=true` and `can_resume=true`. Do not mark `act_complete`, do not emit completion promises, and resume only after the user reviews the stalled chapter or workflow state.

### Resume Process

When resuming from interruption:

```
/write-all --resume
```

**Detection**:
```javascript
const state = readRalphState();

if (state.ralph_active && state.can_resume) {
  const designGate = readJson('reviews/design-gate-report.json');
  const styleGate = readJson('reviews/style-gate-report.json');
  if (designGate?.passed !== true || designGate?.status !== 'PASS') {
    return 'Run premise benchmark and apply-design-gate before resume';
  }
  if (styleGate?.passed !== true || styleGate?.status !== 'PASS') {
    return 'Run prose taste benchmark and apply-style-gate before resume';
  }

  console.log(`
Resumable session detected!

Last checkpoint: ${state.last_checkpoint}
Progress: ${state.completed_chapters.length}/${state.total_chapters} chapters
Current position: Act ${state.current_act}, Chapter ${state.current_chapter}
Last quality: ${state.last_quality_score}/100

Resume from this checkpoint? [Y/n]
  `);
}
```

**Resume Actions**:
1. Run `apply-design-gate --fail-on-blocked`
2. Run `apply-style-gate --fail-on-blocked`
3. Verify summary memory for the last 3 prior manuscript chapters
4. Restore state from `ralph-state.json`
5. Verify all completed chapters still exist
6. Load last validation results
7. Continue from `current_chapter`

### Restart vs Resume

```bash
# Resume from last checkpoint
/write-all --resume

# Restart from beginning (ignores state)
/write-all --restart
```

Both commands still run the same design, style, and summary memory preflight before drafting. Restarting ignores prior Ralph state, not the current design/style evidence or required continuity summaries.

**Restart**:
- Backs up current state to `meta/backups/`
- Resets `ralph-state.json`
- Starts from chapter 1
- Previous chapters preserved (creates `.bak` files)

## Promise Tag System

Tamper-proof progress tracking using memory tags.

### Promise Types

```xml
<!-- Chapter completion -->
<promise>CHAPTER_5_DONE</promise>

<!-- Act completion -->
<promise>ACT_1_DONE</promise>

<!-- Novel completion -->
<promise>NOVEL_DONE</promise>
```

### Properties

1. **Immutable**: Once written, cannot be removed by agent
2. **Persistent**: Survives context compaction
3. **Verifiable**: Can be queried programmatically

### Completion Gate Conditions

Completion promises are not proof by themselves. They are accepted only when the current state proves the quality gate passed:

- `ACT_N_DONE` is valid only when `N matches current_act`
- `ACT_N_DONE` and `NOVEL_DONE` are valid only when `last_gate.status == "PASS"`
- `last_gate.passed == true`, `failed_chapters is empty`, and `requires_user_intervention == false`
- `ACT_N_DONE` also requires every chapter in the act to be present in `completed_chapters`, with the latest PASS gate covering the act end
- Act ranges are resolved from `plot/structure.json` first, explicit state ranges second, and even `total_chapters / total_acts` fallback last
- `NOVEL_DONE` also requires every chapter through `total_chapters` complete, with the latest PASS gate covering the final chapter
- The Stop hook and `scripts/act-completion.mjs` block stale, incomplete, or ungated completion promises
- Generic task completion promises such as `<promise>TASK_COMPLETE</promise>` are invalid while Ralph Loop is active

### Usage Pattern

```javascript
// After validate-chapter and apply-chapter-gate both pass
function markChapterComplete(chapterNum, state) {
  if (state.last_gate?.status !== "PASS" || state.last_gate?.passed !== true) return;
  if (state.failed_chapters.length > 0 || state.requires_user_intervention) return;

  console.log(`<promise>CHAPTER_${chapterNum}_DONE</promise>`);
}
```

### Verification

Check state and promises at end:

```javascript
function verifyCompletion(state) {
  const promiseCount = countPromises(/CHAPTER_\d+_DONE/);
  const expectedChapters = project.target_chapters;
  const gatePassed = state.last_gate?.status === "PASS" && state.last_gate?.passed === true;
  const noOpenFailures = state.failed_chapters.length === 0 && !state.requires_user_intervention;
  const allChaptersComplete = Array.from({ length: state.total_chapters }, (_, i) => i + 1)
    .every(chapter => state.completed_chapters.includes(chapter));
  const finalGateCovered = state.last_gate?.chapter >= state.total_chapters;

  if (promiseCount === expectedChapters && gatePassed && noOpenFailures && allChaptersComplete && finalGateCovered) {
    return "<promise>NOVEL_DONE</promise>";
  }

  return "Continue or revise before emitting NOVEL_DONE";
}
```

## Revision Loop

When chapter fails validation, enters diagnostic-driven revision loop.

### Loop Flow

```
1. Write chapter
2. Multi-validate
3. If ALL PASS → Continue
4. If ANY FAIL → Generate diagnostic
5. Call editor with diagnostic
6. Re-validate
7. Repeat 4-6 (max 3 times)
8. If still failing → Circuit breaker
```

### Diagnostic-Driven Editing

```javascript
const diagnostic = generateDiagnostic(validationResults);

Task({
  subagent_type: "novel-dev:editor",
  model: "opus",
  prompt: `
# Revision Required: Chapter ${chapterNum}

## Diagnostic
Severity: ${diagnostic.severity}
Root Cause: ${diagnostic.root_cause}

## Specific Issues
${diagnostic.specific_issues.map(issue => `
### ${issue.validator} Failure
Location: ${issue.location}
Problem: ${issue.issue}
Suggested Fix: ${issue.suggested_fix}
`).join('\n')}

## Original Chapter
${chapter}

## Revision Strategy
${diagnostic.revision_strategy}

Please revise the chapter to address these issues.
  `
});
```

### Iteration Tracking

```json
{
  "chapter": 5,
  "revision_history": [
    {
      "iteration": 1,
      "timestamp": "2026-01-21T10:30:00Z",
      "validation_results": { /* ... */ },
      "passed": false,
      "diagnostic": { /* ... */ }
    },
    {
      "iteration": 2,
      "timestamp": "2026-01-21T10:45:00Z",
      "validation_results": { /* ... */ },
      "passed": true
    }
  ]
}
```

## Act-Level Operations

After all chapters in an act complete, perform act-level quality checks.

### Act Validation

```javascript
async function validateAct(actNum) {
  const actChapters = getChaptersInAct(actNum);

  // 1. Cross-chapter consistency
  await Task({
    subagent_type: "novel-dev:consistency-verifier",
    prompt: `Check chapters ${actChapters[0]}-${actChapters.at(-1)}`
  });

  // 2. Arc completeness
  await Task({
    subagent_type: "novel-dev:consistency-verifier",
    prompt: `Verify character arcs and plot consistency in Act ${actNum}`
  });

  // 3. Pacing analysis
  await Task({
    subagent_type: "novel-dev:engagement-optimizer",
    prompt: `Analyze pacing across Act ${actNum}`
  });
}
```

### Act Completion

```javascript
function completeAct(actNum) {
  if (actNum !== state.current_act) return;
  if (state.last_gate?.status !== "PASS") return;
  if (state.failed_chapters.length > 0 || state.requires_user_intervention) return;
  if (!getChaptersInAct(actNum).every(chapter => state.completed_chapters.includes(chapter))) return;
  if (state.last_gate?.chapter < getChaptersInAct(actNum).at(-1)) return;

  console.log(`<promise>ACT_${actNum}_DONE</promise>`);

  // User checkpoint
  console.log(`
Act ${actNum} completed!

Chapters: ${getChaptersInAct(actNum).join(', ')}
Average quality: ${getActAverageScore(actNum)}

Proceed to Act ${actNum + 1}? [Y/n]
  `);
}
```

## Performance Optimization

### Parallel Validation

Validators run in parallel for speed:

```javascript
async function validateChapter(chapterNum) {
  const [criticResult, betaResult, genreResult] = await Promise.all([
    Task({
      subagent_type: "novel-dev:critic",
      prompt: /* ... */
    }),
    Task({
      subagent_type: "novel-dev:beta-reader",
      prompt: /* ... */
    }),
    Task({
      subagent_type: "novel-dev:genre-validator",
      prompt: /* ... */
    })
  ]);

  return {
    critic: criticResult,
    betaReader: betaResult,
    genreValidator: genreResult
  };
}
```

**Time Savings**:
- Sequential: ~90 seconds (3 x 30s)
- Parallel: ~30 seconds (max of 30s)
- **3x faster validation**

### Incremental Summaries

Generate summaries immediately after chapter completion:

```javascript
async function completeChapter(chapterNum) {
  // Write summary (fast, low priority)
  Task({
    subagent_type: "novel-dev:summarizer",
    model: "haiku",  // Fast model
    prompt: `Summarize chapter ${chapterNum} for context`
  });

  // Don't wait for summary to continue
  // It's cached for later chapters
}
```

### Context Caching

Reuse expensive context between chapters:

```javascript
class ContextCache {
  constructor() {
    this.cache = new Map();
  }

  async getStyleGuide() {
    if (!this.cache.has('style')) {
      this.cache.set('style', await loadStyleGuide());
    }
    return this.cache.get('style');
  }

  invalidateCharacter(charId) {
    this.cache.delete(`char_${charId}`);
  }
}
```

## 2-Pass Pipeline Integration (성인소설)

> **Note**: `/write-all`은 Claude-only 경로입니다. 성인소설은 `/write-act-2pass`를 사용하세요.

### 2-Pass 워크플로우

v6.0.0부터 성인 콘텐츠는 2-Pass 파이프라인으로 처리합니다:

```
1. Pass 1: Claude novelist가 ADULT 마커와 함께 챕터 집필
2. Pass 2: adult-rewriter.mjs가 마커 구간을 Grok API로 대체
3. summarizer로 요약 생성 (Claude haiku)
4. ralph-state.json 상태 업데이트
5. Multi-Validator 품질 게이트 (Claude가 수행)
   - validator consensus >= 95점
   - beta-reader >= 95점
   - genre-validator >= 95점
6. 미달 시 editor(Claude)로 퇴고 -> 재검증
```

### 성인 콘텐츠와 품질 검증

2-Pass로 생성된 성인 콘텐츠를 Claude가 평가할 때:
- 성인 장면의 **존재 자체는 감점 사유가 아닙니다**
- **서사 구조**, **캐릭터 일관성**, **플롯 정합성**만 평가합니다
- 문체 가이드 준수 여부를 확인합니다
- 퇴고 시에도 성인 콘텐츠를 삭제하거나 순화하지 않습니다

## Error Handling

### Validator Failure

If a validator agent crashes:

```javascript
try {
  const result = await Task({ subagent_type: "novel-dev:critic", /* ... */ });
} catch (error) {
  console.log(`Validator 'critic' failed: ${error.message}`);

  // Fallback: Use legacy scoring
  const fallbackScore = await legacyEvaluate(chapter);
  return { score: fallbackScore, passed: fallbackScore >= 95 };
}
```

### File System Errors

If chapter file write fails:

```javascript
try {
  await writeChapter(chapterNum, content);
} catch (error) {
  console.log(`Failed to write chapter ${chapterNum}: ${error.message}`);

  // Retry with backup location
  await writeChapter(chapterNum, content, { backup: true });
}
```

### State Corruption

If `ralph-state.json` becomes corrupted:

```javascript
try {
  const state = JSON.parse(readFile('meta/ralph-state.json'));
} catch (error) {
  console.log('State file corrupted. Attempting recovery...');

  // Try backups in order
  for (const backup of listBackups().reverse()) {
    try {
      const state = JSON.parse(readFile(backup));
      console.log(`Recovered from backup: ${backup}`);
      return state;
    } catch {}
  }

  // Last resort: reconstruct from chapters
  return reconstructStateFromChapters();
}
```
