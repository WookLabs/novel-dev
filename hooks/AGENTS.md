<!-- Parent: ../docs/repository-guide.md -->
<!-- Generated: 2026-01-18 -->

# hooks

## Purpose

The hooks directory contains Claude Code plugin hook configurations and documentation that integrate the novel-dev plugin with the Claude Code runtime environment. These hooks trigger automated actions at specific lifecycle points:

- **SessionStart**: Display current project status when a session begins
- **UserPromptSubmit**: Detect novel state changes when user submits prompts
- **PreToolUse**: Validate JSON writes and block manuscript edits until design/style/summary memory gates pass
- **Stop**: Execute completion and cleanup tasks when the session ends

This enables the plugin to maintain context awareness and automate routine workflows without explicit user commands.

## Key Files

| File | Description |
|------|-------------|
| `hooks.json` | Plugin hook configuration with command mappings for lifecycle events |
| `pretooluse.py` | JSON schema validation and manuscript design/style/summary memory gate guard |
| `session-start.md` | Documentation for the SessionStart hook - displays project status on session init |

## Hook System Overview

### SessionStart Hook

**Trigger**: When a Claude Code session begins
**Action**: Executes `scripts/session-start.mjs`
**Display Information**:
- Current active project name
- Writing progress (completed chapters / target chapters)
- Current workflow state (planning, writing, editing)
- Ralph Loop activation status

**Purpose**: Provides immediate context about the current novel project without requiring explicit commands.

### UserPromptSubmit Hook

**Trigger**: When user submits a prompt to Claude
**Action**: Executes `scripts/novel-state-detector.mjs`
**Purpose**: Detects changes in novel project state and updates internal tracking

### PreToolUse Hook

**Trigger**: Before Write/Edit/MultiEdit tools run
**Action**: Executes `hooks/pretooluse.py`
**Purpose**: Validates JSON writes and blocks `chapters/chapter_*.md` / `chapters/ch*.md` manuscript edits unless `reviews/design-gate-report.json` and `reviews/style-gate-report.json` are both `passed=true`, `status=PASS`, and prior chapter summaries used as long-context memory are present, fresh, and substantive.

### Stop Hook

**Trigger**: When Claude Code session ends
**Action**: Executes `scripts/act-completion.mjs`, then `hooks/stop.py`
**Purpose**: Performs Ralph Loop continuation/completion checks.

Completion promises are gate-checked. `ACT_N_DONE` is accepted only when `N` matches `current_act`, every chapter in that act is listed in `completed_chapters`, and the latest passing `last_gate` covers the act end. Act ranges come from `plot/structure.json` first, then explicit state ranges, then an even `total_chapters / total_acts` fallback. `NOVEL_DONE` is accepted only when every chapter through `total_chapters` is completed and the latest passing `last_gate` covers the final chapter. Both promise types also require no `failed_chapters` and no `requires_user_intervention`. This prevents a stale transcript promise, premature act/novel completion, or quality-gate bypass from stopping Ralph Loop.

Generic task completion promises such as `<promise>TASK_COMPLETE</promise>` are not valid while Ralph Loop is active. Active novel writing sessions must use only `ACT_N_DONE` or `NOVEL_DONE`, after their gate and completeness checks pass.

## For AI Agents

### When Working With Hooks

**DO:**
- Understand that hooks run automatically and provide plugin integration points
- Review hook configurations before modifying plugin behavior
- Check timeout values (currently 5 seconds per hook) when adding new hooks
- Use hooks for fast local guardrails; keep heavy writing logic in commands, agents, or CLIs
- Keep `scripts/act-completion.mjs` and `hooks/stop.py` aligned on completion gate checks

**DON'T:**
- Modify hook.json without understanding the execution flow
- Add hooks with timeouts > 10 seconds (plugin responsiveness impact)
- Override core hooks (SessionStart, UserPromptSubmit, Stop) without careful consideration
- Place logic in hooks that should be in commands or agents

### Hook Configuration Schema

Each hook in `hooks.json` contains:
```json
{
  "hook": "HookName",
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/script-name.mjs\"",
      "timeout": 5
    }
  ]
}
```

**Fields**:
- `hook`: Lifecycle event name (SessionStart, UserPromptSubmit, Stop)
- `matcher`: Pattern matching (use "*" for all contexts)
- `type`: Always "command" for plugin hooks
- `command`: Executable command with `${CLAUDE_PLUGIN_ROOT}` variable expansion
- `timeout`: Maximum seconds to wait for hook completion

## Dependencies

**Internal Dependencies:**
- Hooks depend on scripts in `scripts/` directory:
  - `scripts/session-start.mjs` - Display project status
  - `scripts/novel-state-detector.mjs` - Track state changes
  - `scripts/act-completion.mjs` - Handle session cleanup
- Hooks access project structure and metadata files
- Context depends on novel projects in `test-project/novels/`

**External Dependencies:**
- Claude Code plugin runtime environment
- Node.js >= 18.0.0 (for .mjs script execution)

**Related Components:**
- Hooks provide integration for all plugin agents and commands
- Coordinates with `commands/` for user-initiated workflows
- Accesses metadata from `test-project/` for status display
