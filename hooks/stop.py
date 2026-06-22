#!/usr/bin/env python3
"""
Stop Hook for novel-dev Ralph Loop persistence.
Intercepts exit attempts and continues the loop until completion promise detected.
Based on claude-plugins-official/plugins/ralph-loop pattern.
"""

import json
import sys
import os
import re


def read_json_file(path):
    """Read and parse a JSON file."""
    try:
        if not os.path.exists(path):
            return None
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return None


def get_last_assistant_message(transcript_path):
    """Extract the last assistant message from transcript JSONL file."""
    try:
        if not transcript_path or not os.path.exists(transcript_path):
            return ''

        with open(transcript_path, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f.readlines() if line.strip()]

        # Search in reverse for last assistant message
        for line in reversed(lines):
            try:
                entry = json.loads(line)
                if entry.get('role') == 'assistant':
                    content = entry.get('content', '')
                    if isinstance(content, str):
                        return content
                    if isinstance(content, list):
                        return ' '.join(
                            part.get('text', '')
                            for part in content
                            if part.get('type') == 'text'
                        )
            except json.JSONDecodeError:
                continue
        return ''
    except IOError:
        return ''


def find_active_ralph_project(directory):
    """Find a novel project with active Ralph loop."""
    novels_dir = os.path.join(directory, 'novels')

    if not os.path.exists(novels_dir):
        return None, None

    try:
        projects = [
            f for f in os.listdir(novels_dir)
            if os.path.exists(os.path.join(novels_dir, f, 'meta', 'project.json'))
        ]

        for proj in projects:
            project_path = os.path.join(novels_dir, proj)
            state_file = os.path.join(project_path, 'meta', 'ralph-state.json')

            state = read_json_file(state_file)
            if state and state.get('ralph_active', False):
                return project_path, state

    except OSError:
        pass

    return None, None


def detect_completion_promise(search_text, state):
    """Return the completion promise type detected in text, or None."""
    completion_promise = state.get('completion_promise', '<promise>TASK_COMPLETE</promise>')

    if '<promise>NOVEL_DONE</promise>' in search_text:
        return 'novel'
    if completion_promise in search_text:
        return 'task'
    if re.search(r'<promise>ACT_(\d+)_DONE</promise>', search_text):
        return 'act'
    return None


def to_positive_int(value):
    """Return value as a positive integer, or None."""
    try:
        number = int(value)
    except (TypeError, ValueError):
        return None
    return number if number > 0 else None


def normalize_chapter_list(value):
    """Return only positive integer chapter numbers."""
    if not isinstance(value, list):
        return []

    chapters = []
    for item in value:
        chapter = to_positive_int(item)
        if chapter is not None:
            chapters.append(chapter)
    return chapters


def parse_act_range_value(act_range):
    """Parse a chapter range from list or object forms."""
    if isinstance(act_range, list) and len(act_range) >= 2:
        start = to_positive_int(act_range[0])
        end = to_positive_int(act_range[1])
        return (start, end) if start is not None and end is not None and start <= end else None

    if isinstance(act_range, list) and len(act_range) == 1:
        chapter = to_positive_int(act_range[0])
        return (chapter, chapter) if chapter is not None else None

    if isinstance(act_range, dict):
        chapters = act_range.get('chapters')
        if isinstance(chapters, (list, dict)):
            return parse_act_range_value(chapters)

        start = to_positive_int(act_range.get('start', act_range.get('from')))
        end = to_positive_int(act_range.get('end', act_range.get('to')))
        return (start, end) if start is not None and end is not None and start <= end else None

    return None


def parse_explicit_act_range(state, act_number):
    """Read an optional explicit act range from state."""
    ranges = state.get('act_chapter_ranges') or state.get('act_ranges')
    if not isinstance(ranges, list):
        return None

    try:
        return parse_act_range_value(ranges[act_number - 1])
    except IndexError:
        return None


def parse_plot_structure_act_range(project_path, act_number):
    """Read the canonical act range from plot/structure.json."""
    if not project_path:
        return None

    structure = read_json_file(os.path.join(project_path, 'plot', 'structure.json'))
    acts = structure.get('acts') if isinstance(structure, dict) else None
    if not isinstance(acts, list):
        return None

    selected = None
    for act in acts:
        if not isinstance(act, dict):
            continue
        number = to_positive_int(act.get('act_number', act.get('number', act.get('act'))))
        if number == act_number:
            selected = act
            break

    if selected is None:
        try:
            selected = acts[act_number - 1]
        except IndexError:
            return None

    return parse_act_range_value(selected)


def get_act_chapter_range(state, act_number, project_path=None):
    """Return the chapter range for an act, using explicit state or an even split."""
    plot_range = parse_plot_structure_act_range(project_path, act_number)
    if plot_range:
        return plot_range

    explicit_range = parse_explicit_act_range(state, act_number)
    if explicit_range:
        return explicit_range

    total_chapters = to_positive_int(state.get('total_chapters'))
    total_acts = to_positive_int(state.get('total_acts'))
    if (
        total_chapters is None
        or total_acts is None
        or act_number < 1
        or act_number > total_acts
    ):
        return None

    start = ((act_number - 1) * total_chapters) // total_acts + 1
    end = (act_number * total_chapters) // total_acts
    return (start, end) if start <= end else None


def format_missing_chapters(missing):
    """Format missing chapter numbers without producing huge hook messages."""
    preview = ', '.join(str(chapter) for chapter in missing[:10])
    if len(missing) <= 10:
        return preview
    return f"{preview}, ... ({len(missing)} total)"


def act_completion_block_reason(search_text, state):
    """Return a reason when an act completion promise targets the wrong act."""
    act_match = re.search(r'<promise>ACT_(\d+)_DONE</promise>', search_text)
    if not act_match:
        return None

    promised_act = int(act_match.group(1))
    current_act = state.get('current_act', 1)
    if promised_act != current_act:
        return (
            "act completion promise does not match current act. "
            f"promised act={promised_act}, current act={current_act}"
        )

    return None


def task_completion_block_reason(promise_type, state):
    """Return a reason when a generic task promise tries to stop Ralph Loop."""
    if promise_type != 'task':
        return None

    current_act = state.get('current_act', 1)
    return (
        "Generic completion promise is not valid while Ralph Loop is active. "
        f"Use <promise>ACT_{current_act}_DONE</promise> after the current act is complete, "
        "or <promise>NOVEL_DONE</promise> after every chapter is complete."
    )


def act_completeness_block_reason(search_text, state, project_path=None):
    """Return a reason when an act completion promise is missing act chapters."""
    act_match = re.search(r'<promise>ACT_(\d+)_DONE</promise>', search_text)
    if not act_match:
        return None

    act_number = int(act_match.group(1))
    act_range = get_act_chapter_range(state, act_number, project_path)
    if not act_range:
        return None

    start, end = act_range
    completed = set(normalize_chapter_list(state.get('completed_chapters')))
    missing = [chapter for chapter in range(start, end + 1) if chapter not in completed]
    if missing:
        return (
            f"act {act_number} incomplete: chapters {start}-{end} require PASS gates "
            f"before ACT_{act_number}_DONE. Missing completed chapters: "
            f"{format_missing_chapters(missing)}"
        )

    last_gate = state.get('last_gate') if isinstance(state.get('last_gate'), dict) else {}
    last_gate_chapter = to_positive_int(last_gate.get('chapter'))
    if last_gate_chapter is None or last_gate_chapter < end:
        return (
            f"act {act_number} incomplete: latest PASS gate must cover chapter {end}, "
            f"but latest gate chapter is {last_gate.get('chapter', 'unknown')}"
        )

    return None


def novel_completeness_block_reason(state):
    """Return a reason when a novel completion promise is missing chapters."""
    total_chapters = to_positive_int(state.get('total_chapters'))
    if total_chapters is None:
        return None

    completed = set(normalize_chapter_list(state.get('completed_chapters')))
    missing = [chapter for chapter in range(1, total_chapters + 1) if chapter not in completed]
    if missing:
        return (
            f"novel incomplete: chapters 1-{total_chapters} require PASS gates "
            f"before NOVEL_DONE. Missing completed chapters: "
            f"{format_missing_chapters(missing)}"
        )

    last_gate = state.get('last_gate') if isinstance(state.get('last_gate'), dict) else {}
    last_gate_chapter = to_positive_int(last_gate.get('chapter'))
    if last_gate_chapter is None or last_gate_chapter < total_chapters:
        return (
            f"novel incomplete: latest PASS gate must cover final chapter {total_chapters}, "
            f"but latest gate chapter is {last_gate.get('chapter', 'unknown')}"
        )

    return None


def completion_gate_block_reason(state):
    """Return a reason when completion promises must be blocked by quality gate state."""
    if state.get('requires_user_intervention', False):
        pause_reason = state.get('pause_reason', 'manual review required')
        return (
            "user intervention required before completion promise can stop Ralph Loop. "
            f"Reason: {pause_reason}"
        )

    failed_chapters = state.get('failed_chapters', [])
    if isinstance(failed_chapters, list) and len(failed_chapters) > 0:
        last_gate = state.get('last_gate')
        gate_status = last_gate.get('status') if isinstance(last_gate, dict) else 'unknown'
        return (
            "chapter gate has failed chapters still open: "
            f"{', '.join(str(ch) for ch in failed_chapters)}. "
            f"Latest gate status: {gate_status}"
        )

    last_gate = state.get('last_gate')
    if not isinstance(last_gate, dict):
        return "chapter gate missing. Run apply-chapter-gate before emitting completion promise."

    gate_status = last_gate.get('status')
    gate_passed = last_gate.get('passed', False)
    if gate_status != 'PASS' or gate_passed is not True:
        chapter = last_gate.get('chapter', 'unknown')
        return (
            "chapter gate is not PASS. "
            f"chapter={chapter}, status={gate_status}, score={last_gate.get('score')}"
        )

    return None


def main():
    try:
        # Read hook input from stdin
        hook_input = json.load(sys.stdin)
    except json.JSONDecodeError:
        hook_input = {}

    directory = hook_input.get('directory', hook_input.get('cwd', os.getcwd()))

    # Find active Ralph project (we only need state, not path)
    project_path, state = find_active_ralph_project(directory)

    if not state or not state.get('ralph_active', False):
        # No active Ralph loop - allow stop
        print(json.dumps({"decision": "approve"}))
        return

    # Check for completion promise in transcript
    transcript_path = hook_input.get('transcript_path', '')
    assistant_message = get_last_assistant_message(transcript_path)

    # Combine all searchable text
    search_text = json.dumps(hook_input) + assistant_message

    # Check for completion promises
    promise_type = detect_completion_promise(search_text, state)
    act_block_reason = act_completion_block_reason(search_text, state) if promise_type == 'act' else None
    task_block_reason = task_completion_block_reason(promise_type, state)
    gate_block_reason = completion_gate_block_reason(state) if promise_type and not act_block_reason and not task_block_reason else None
    completeness_block_reason = None
    if promise_type and not act_block_reason and not task_block_reason and not gate_block_reason:
        if promise_type == 'act':
            completeness_block_reason = act_completeness_block_reason(search_text, state, project_path)
        elif promise_type == 'novel':
            completeness_block_reason = novel_completeness_block_reason(state)

    if act_block_reason:
        result = {
            "decision": "block",
            "reason": f"[NOVEL RALPH LOOP] Completion promise blocked: {act_block_reason}"
        }
    elif task_block_reason:
        result = {
            "decision": "block",
            "reason": f"[NOVEL RALPH LOOP] Completion promise blocked: {task_block_reason}"
        }
    elif gate_block_reason:
        result = {
            "decision": "block",
            "reason": f"[NOVEL RALPH LOOP] Completion promise blocked: {gate_block_reason}"
        }
    elif completeness_block_reason:
        result = {
            "decision": "block",
            "reason": f"[NOVEL RALPH LOOP] Completion promise blocked: {completeness_block_reason}"
        }
    elif promise_type == 'novel':
        # Novel complete - allow stop
        result = {
            "decision": "approve",
            "reason": "Novel completion promise detected. Ralph loop completed successfully."
        }
    elif promise_type == 'task':
        # Generic completion promise - allow stop
        result = {
            "decision": "approve",
            "reason": "Completion promise detected. Ralph loop completed successfully."
        }
    elif promise_type == 'act':
        # Act completion promise - allow stop
        result = {
            "decision": "approve",
            "reason": "Act completion promise detected. Ralph loop phase completed."
        }
    else:
        # Block stop - continue Ralph loop
        current_chapter = state.get('current_chapter', 'unknown')
        current_act = state.get('current_act', 1)
        iteration = state.get('iteration', 1)
        max_iterations = state.get('max_iterations', 100)

        result = {
            "decision": "block",
            "reason": f"""[NOVEL RALPH LOOP - Act {current_act} in progress (iteration {iteration}/{max_iterations})]

Ralph loop is active. Current: chapter {current_chapter}.

Continue until completion promise:
- Act done: <promise>ACT_{current_act}_DONE</promise>
- Novel done: <promise>NOVEL_DONE</promise>

To stop: User must explicitly request Ralph Loop deactivation."""
        }

    print(json.dumps(result))


if __name__ == "__main__":
    main()
