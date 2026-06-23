# Write-All Skill - Usage Examples

## Basic Full Novel Writing

### Start from Beginning

```
/write-all
```

Write entire novel from chapter 1 to target chapter count:

**Expected output:**
```
[PREFLIGHT]
Design gate: PASS (reviews/design-gate-report.json)
Style gate: PASS (reviews/style-gate-report.json)

[RALPH LOOP ACTIVATED]
Target: 50 chapters (3 acts)
Quality threshold: 95 (Masterpiece Mode)
Validators: critic, beta-reader, genre-validator

Starting from Chapter 1...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACT 1: Setup (Chapters 1-15)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Chapter 1/50] ━━━━━━━━━━━━━━━━━━━━━━ 2%

Writing Chapter 1...
✓ Written: 5,124 characters

Multi-validator evaluation...
├─ critic: 96/100 ✓ (threshold: 95)
├─ beta-reader: 88/100 ✓ (threshold: 80)
└─ genre-validator: 96/100 ✓ (threshold: 95)

All validators passed!
<promise>CHAPTER_1_DONE</promise>

[Chapter 2/50] ━━━━━━━━━━━━━━━━━━━━━━ 4%

Writing Chapter 2...
✓ Written: 5,456 characters

Multi-validator evaluation...
├─ critic: 95/100 ✓ (threshold: 95)
├─ beta-reader: 86/100 ✓ (threshold: 80)
└─ genre-validator: 96/100 ✓ (threshold: 95)

All validators passed!
<promise>CHAPTER_2_DONE</promise>

...
```

The loop continues until all 50 chapters complete.

## Session Recovery

### Resume After Interruption

```
/write-all --resume
```

Continue from where you left off:

**Detection:**
```
Checking preflight gates...
✓ Design gate PASS
✓ Style gate PASS

Resumable session detected!

Last checkpoint: 2026-01-21 10:30:00
Progress: 12/50 chapters completed
Current position: Act 1, Chapter 13
Last quality: 87/100

Completed chapters: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12

Resume from Chapter 13? [Y/n]
```

If either gate is missing or blocked, the command does not resume drafting:

```
Resume blocked before writing.

Design gate: PASS
Style gate: BLOCKED
Summary memory: PASS
Summary memory files: context/summaries/chapter_NNN_summary.md

Recommended commands:
1. node dist/cli/run-prose-taste-benchmark.js --project novels/my_novel --json
2. node dist/cli/apply-style-gate.js --project novels/my_novel --fail-on-blocked --json

Run the recommended commands and retry /write-all --resume after all preflight gates PASS.
```

**User confirms:**
```
Resuming from Chapter 13...

[Chapter 13/50] ━━━━━━━━━━━━━━━━━━━━━━ 26%

Writing Chapter 13...
...
```

### Restart from Scratch

```
/write-all --restart
```

Ignore previous progress and start fresh:

**Confirmation:**
```
⚠️ WARNING: Restart will discard current progress!

Current state:
- 12 chapters completed
- Act 1 (80% complete)
- Last checkpoint: 2026-01-21 10:30:00

This will:
✓ Backup current state to meta/backups/
✓ Reset ralph-state.json
✓ Preserve existing chapters (create .bak files)

Restart from Chapter 1? [Y/n]
```

**User confirms:**
```
Backing up state...
✓ Saved to: meta/backups/ralph-state_20260121_103000.json

Backing up chapters...
✓ chapter_001.md → chapter_001.md.bak
✓ chapter_002.md → chapter_002.md.bak
...

Restarting from Chapter 1...
[Chapter 1/50] ━━━━━━━━━━━━━━━━━━━━━━ 2%
```

## Quality Gate Scenarios

### Chapter 1 High Standards

Chapter 1 uses the same 95-point completion threshold, with extra attention to reader retention:

```
[Chapter 1/50] ━━━━━━━━━━━━━━━━━━━━━━ 2%

Writing Chapter 1...
✓ Written: 5,124 characters

Multi-validator evaluation...
├─ critic: 88/100 ✗ (threshold: 95)
├─ beta-reader: 85/100 ✓ (threshold: 80)
└─ genre-validator: 96/100 ✓ (threshold: 95)

Chapter 1 validation FAILED
Reason: Critic score below chapter completion threshold (95)

Generating diagnostic...

Diagnostic:
- Severity: major
- Root cause: Opening hook lacks immediacy
- Failed validators: critic
- Specific issues:
  * First paragraph too descriptive, needs conflict
  * Protagonist uniqueness not established early enough
  * Genre elements not clear in opening

Revision attempt 1/3...

Calling editor with diagnostic...
✓ Revised: 5,089 characters

Re-validating...
├─ critic: 95/100 ✓ (threshold: 95)
├─ beta-reader: 87/100 ✓ (threshold: 80)
└─ genre-validator: 97/100 ✓ (threshold: 95)

All validators passed!
<promise>CHAPTER_1_DONE</promise>
```

### Standard Chapter Quality Gate

Regular chapters use the same 95-point completion threshold:

```
[Chapter 5/50] ━━━━━━━━━━━━━━━━━━━━━━ 10%

Writing Chapter 5...
🔞 Adult content detected: [베드신]
Switching to Grok API...
✓ Written: 5,678 characters

Multi-validator evaluation...
├─ critic: 72/100 ✗ (threshold: 95)
├─ beta-reader: 68/100 ✗ (threshold: 80)
└─ genre-validator: 91/100 ✓ (threshold: 95)

Validation FAILED (2/3 validators failed)

Generating diagnostic...

Diagnostic:
- Severity: major
- Root cause: Pacing issues, scene lacks emotional depth
- Failed validators: critic, beta-reader
- Specific issues:
  * Scene transition too abrupt (critic)
  * Intimacy feels mechanical, not emotional (beta-reader)
  * Missing character introspection during key moment (both)

Revision attempt 1/3...
```

### Successful First Attempt

```
[Chapter 7/50] ━━━━━━━━━━━━━━━━━━━━━━ 14%

Writing Chapter 7...
✓ Written: 5,234 characters

Multi-validator evaluation...
├─ critic: 91/100 ✓ (threshold: 85)
├─ beta-reader: 88/100 ✓ (threshold: 80)
└─ genre-validator: 94/100 ✓ (threshold: 95)

All validators passed on first attempt!
Average score: 91/100 (S tier)

<promise>CHAPTER_7_DONE</promise>
```

## Circuit Breaker Activation

### Repeated Failure Pattern

```
[Chapter 10/50] ━━━━━━━━━━━━━━━━━━━━━━ 20%

Writing Chapter 10...
✓ Written: 5,456 characters

Multi-validator evaluation...
├─ critic: 78/100 ✗ (threshold: 85)
├─ beta-reader: 76/100 ✓ (threshold: 80)
└─ genre-validator: 92/100 ✓ (threshold: 95)

Validation FAILED

Diagnostic:
- Root cause: Character motivation unclear in Scene 3

Revision attempt 1/3...
✓ Revised

Re-validating...
├─ critic: 79/100 ✗ (threshold: 85)
├─ beta-reader: 77/100 ✓ (threshold: 80)
└─ genre-validator: 91/100 ✓ (threshold: 95)

Still FAILED (same issue)

Revision attempt 2/3...
✓ Revised

Re-validating...
├─ critic: 80/100 ✗ (threshold: 85)
├─ beta-reader: 78/100 ✓ (threshold: 80)
└─ genre-validator: 93/100 ✓ (threshold: 95)

Still FAILED (same issue, 3rd time)

⚠️ CIRCUIT BREAKER TRIGGERED

Chapter 10 has failed validation 3 times with persistent issue:
"Character motivation unclear in Scene 3"

Progress so far:
- Critic score improving slowly (78→79→80)
- But still below threshold (95)
- Same fundamental issue each time

Options:
(A) Pause for manual editing
    → Chapter opened in default editor
    → You can manually fix Scene 3
    → Ralph loop waits for your save
    → Resume with '/write-all --resume'

(B) Structural rework
    → Keep the 95 threshold
    → Rebuild Scene 3 goal, obstacle, choice cost, and consequence
    → Rerun the chapter gate after revision

(C) Skip chapter with placeholder
    → Marks Chapter 10 as "needs revision"
    → Continues to Chapter 11
    → You can fix Chapter 10 later manually

(D) Abort write-all
    → Stops entire Ralph loop
    → State saved for later resume
    → Allows full project review

Choose [A/B/C/D]:
```

### User Chooses Option A (Manual Edit)

```
You chose: (A) Pause for manual editing

Opening chapter in editor...
✓ Opened: chapters/chapter_010.md

Please edit Scene 3 to clarify character motivation.

When finished:
1. Save the file
2. Run the style/design preflight if source evidence changed
3. Run: /write-all --resume

Ralph loop paused at Chapter 10.
State saved to: meta/ralph-state.json
```

**User edits file, then:**
```
/write-all --resume
```

**Resume:**
```
Checking preflight gates...
✓ Design gate PASS
✓ Style gate PASS

Resuming from Chapter 10...
Detecting changes since pause...

✓ chapter_010.md modified (manual edit detected)

Re-validating Chapter 10...
├─ critic: 95/100 ✓ (threshold: 95)
├─ beta-reader: 86/100 ✓ (threshold: 80)
└─ genre-validator: 96/100 ✓ (threshold: 95)

Manual edit successful!
All validators passed!

<promise>CHAPTER_10_DONE</promise>

Continuing to Chapter 11...
```

### User Chooses Option B (Structural Rework)

```
You chose: (B) Structural rework

Keeping threshold at 95.
Rebuilding Scene 3 around the missing story engine:
- visible goal
- opposing obstacle
- irreversible choice cost
- changed consequence

Re-evaluating after structural rewrite...
├─ critic: 95/100 ✓ (threshold: 95)
├─ beta-reader: 86/100 ✓ (threshold: 80)
└─ genre-validator: 96/100 ✓ (threshold: 95)

Chapter 10 passed at the standard 95 threshold.

<promise>CHAPTER_10_DONE</promise>

Continuing with the standard 95 threshold for Chapter 11...
```

## Act Completion

### End of Act 1

```
[Chapter 15/50] ━━━━━━━━━━━━━━━━━━━━━━ 30%

Writing Chapter 15...
✓ Written: 5,345 characters

Multi-validator evaluation...
✓ All validators passed

<promise>CHAPTER_15_DONE</promise>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACT 1 COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Chapters: 1-15
Average quality: 88.3/100
Grade: A (Excellent)

Running act-level validation...

1. Cross-chapter consistency...
   ✓ No plot holes detected
   ✓ Character arcs consistent
   ✓ Timeline coherent

2. Arc completeness...
   ✓ Setup complete
   ✓ Main characters introduced
   ✓ Central conflict established

3. Pacing analysis...
   ✓ Good progression
   ⚠ Minor: Chapter 10 slightly slower
   ✓ Strong act ending hook

Completion gate verified:
- `N matches current_act` (N=1, current_act=1)
- act range resolved from `plot/structure.json` (chapters 1-15)
- `last_gate.status == "PASS"`
- `last_gate.chapter` covers the act end (chapter 15)
- all chapters in Act 1 are in `completed_chapters`
- `failed_chapters is empty`
- `requires_user_intervention == false`

<promise>ACT_1_DONE</promise>

Proceed to Act 2? [Y/n]
```

**User confirms:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACT 2: Confrontation (Chapters 16-35)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Chapter 16/50] ━━━━━━━━━━━━━━━━━━━━━━ 32%
```

## Integration with Other Commands

### With Plot Outlining

```
# First, outline all chapters
/outline-all

# Then run design/style/summary memory gates and write them all
node dist/cli/apply-design-gate.js --project novels/my_novel --fail-on-blocked --json
node dist/cli/apply-style-gate.js --project novels/my_novel --fail-on-blocked --json
/write-all
```

**Output:**
```
All plot files exist (chapters/chapter_001.json - chapter_050.json)
✓ Design gate PASS
✓ Style gate PASS
✓ Ready for writing

Starting Ralph loop...
[Chapter 1/50] ...
```

### With Context System

Ralph loop automatically uses context summaries:

```
[Chapter 25/50] ━━━━━━━━━━━━━━━━━━━━━━ 50%

Loading context for Chapter 25...
✓ Style guide (8.2K tokens)
✓ Chapter plot (13.1K tokens)
✓ Previous summaries: Ch 22, 23, 24 (19.5K tokens)
✓ Characters: 민준, 서연, 지훈, 수진 (28.4K tokens)
✓ World context (15.2K tokens)

Total: 84.4K / 120K tokens

Writing Chapter 25...
```

Summaries generated automatically after each chapter.

## Advanced Scenarios

### Mid-Novel Resume with State Verification

```
/write-all --resume
```

**State verification:**
```
Checking preflight gates...
✓ Design gate PASS
✓ Style gate PASS

Verifying session state...

Checking completed chapters...
✓ chapter_001.md exists (5,124 chars)
✓ chapter_002.md exists (5,456 chars)
...
✓ chapter_020.md exists (5,234 chars)

Checking summaries...
✓ 20/20 summaries present
✓ All summaries valid

Checking validation history...
✓ 20 successful validations

State is consistent!
Resuming from Chapter 21...
```

### Quality Trend Analysis

```
[Chapter 30/50] ━━━━━━━━━━━━━━━━━━━━━━ 60%

Writing Chapter 30...
✓ Written

Multi-validator evaluation...
✓ All passed

Quality trend analysis:
📊 Last 10 chapters average: 89.2/100
📈 Trend: Improving (+2.3 pts vs previous 10)

Top performer: Chapter 28 (94/100)
Needs attention: Chapter 23 (81/100)

<promise>CHAPTER_30_DONE</promise>
```

### Backup and Recovery

**Automatic backup:**
```
[Chapter 25/50] completed

Saving checkpoint...
✓ State saved: meta/ralph-state.json
✓ Backup created: meta/backups/ralph-state_20260121_143000.json

Backups available:
- ralph-state_20260121_140000.json (Ch 20)
- ralph-state_20260121_141500.json (Ch 23)
- ralph-state_20260121_143000.json (Ch 25) ← newest
```

**Manual recovery:**
```
/write-all --resume --from-backup=ralph-state_20260121_141500.json
```

**Output:**
```
Loading backup: ralph-state_20260121_141500.json
Restore point: Chapter 23 (2026-01-21 14:15:00)

This will:
✓ Restore state from Chapter 23
✗ Discard Chapters 24-25 progress
✓ Create backup of current state

Proceed? [Y/n]
```

## Progress Monitoring

### Real-time Stats

```
[Chapter 40/50] ━━━━━━━━━━━━━━━━━━━━━━ 80%

Writing Chapter 40...
✓ Written

Statistics:
┌─────────────────┬──────────┐
│ Metric          │ Value    │
├─────────────────┼──────────┤
│ Total chapters  │ 40/50    │
│ Acts completed  │ 2/3      │
│ Average quality │ 88.5/100 │
│ First-try pass  │ 75%      │
│ Revisions       │ 12 total │
│ Circuit breaks  │ 1        │
│ Elapsed time    │ 4h 23m   │
│ Est. remaining  │ 1h 5m    │
└─────────────────┴──────────┘

<promise>CHAPTER_40_DONE</promise>
```

### Final Completion

```
[Chapter 50/50] ━━━━━━━━━━━━━━━━━━━━━━ 100%

Writing Chapter 50...
✓ Written: 5,567 characters

Multi-validator evaluation...
✓ All validators passed

<promise>CHAPTER_50_DONE</promise>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACT 3 COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 NOVEL COMPLETE! 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Final Statistics:
┌──────────────────────┬──────────┐
│ Metric               │ Value    │
├──────────────────────┼──────────┤
│ Total chapters       │ 50       │
│ Total words          │ ~250,000 │
│ Average quality      │ 88.7/100 │
│ S-tier chapters      │ 23       │
│ A-tier chapters      │ 25       │
│ B-tier chapters      │ 2        │
│ First-try pass rate  │ 76%      │
│ Total revisions      │ 18       │
│ Circuit breakers     │ 1        │
│ Total time           │ 5h 48m   │
└──────────────────────┴──────────┘

Quality distribution:
90-100 (S): ████████████████████████ 46%
80-89  (A): ██████████████████████████ 50%
70-79  (B): ██ 4%

Completion gate verified:
- `N matches current_act` for the final act promise
- act range resolved from `plot/structure.json`
- `last_gate.status == "PASS"`
- `last_gate.chapter` covers the final chapter (chapter 50)
- all chapters through `total_chapters` are in `completed_chapters`
- `failed_chapters is empty`
- `requires_user_intervention == false`

<promise>NOVEL_DONE</promise>

Next steps:
1. Run '/export' to generate publication files
2. Run '/final-review' for overall polish
3. Celebrate! 🎊
```
