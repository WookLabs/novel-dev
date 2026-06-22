#!/usr/bin/env python3
"""
PreToolUse Hook for novel-dev guardrails.
Validates JSON files against schemas before writing and blocks manuscript edits
unless design/style/summary memory gates are currently PASS.
"""

import json
import sys
import os
import re


SCHEMA_PATTERNS = {
    r'chapter_\d+\.json$': 'chapter.schema.json',
    r'project\.json$': 'project.schema.json',
    r'characters/.*\.json$': 'character.schema.json',
    r'world\.json$': 'world.schema.json',
    r'main-arc\.json$': 'plot.schema.json',
    r'ralph-state\.json$': 'ralph-state.schema.json',
    r'foreshadowing\.json$': 'foreshadowing.schema.json',
    r'hooks\.json$': 'hooks.schema.json',
    r'sub-arc_\d{3}\.json$': 'sub-arc.schema.json',
}

MANUSCRIPT_TOOLS = {'Write', 'Edit', 'MultiEdit'}
MANUSCRIPT_PATTERN = re.compile(r'(^|/)chapters/(?:chapter_\d{3}|ch\d{3})[^/]*\.md$')
CHAPTER_NUMBER_PATTERN = re.compile(r'(?:chapter_|ch)(\d{1,4})', re.IGNORECASE)
SUMMARY_MEMORY_LABEL = 'summary memory gate'
SUMMARY_MEMORY_MISSING_CODE = 'summary-memory-missing'
SUMMARY_MEMORY_MALFORMED_CODE = 'summary-memory-malformed'
SUMMARY_MEMORY_STALE_CODE = 'summary-memory-stale'
SUMMARY_MEMORY_TOO_THIN_CODE = 'summary-memory-too-thin'
DEFAULT_SUMMARY_WINDOW = 3
MIN_SUMMARY_CHARS = 100

GATE_SPECS = [
    {
        'label': 'design gate',
        'report': 'design-gate-report.json',
        'missing_code': 'design-gate-report-missing',
        'malformed_code': 'design-gate-report-malformed',
        'not_passed_code': 'design-gate-not-passed',
        'default_commands': [
            'node dist/cli/run-premise-appeal-benchmark.js --project {project} --json',
            'node dist/cli/apply-design-gate.js --project {project} --fail-on-blocked --json',
        ],
    },
    {
        'label': 'style gate',
        'report': 'style-gate-report.json',
        'missing_code': 'style-gate-report-missing',
        'malformed_code': 'style-gate-report-malformed',
        'not_passed_code': 'style-gate-not-passed',
        'default_commands': [
            'node dist/cli/run-prose-taste-benchmark.js --project {project} --json',
            'node dist/cli/apply-style-gate.js --project {project} --fail-on-blocked --json',
        ],
    },
]


def is_manuscript_path(file_path):
    """Return True for chapter manuscript markdown paths."""
    normalized = file_path.replace('\\', '/')
    return bool(MANUSCRIPT_PATTERN.search(normalized))


def extract_chapter_number(file_path):
    """Extract a chapter number from chapter manuscript filenames."""
    match = CHAPTER_NUMBER_PATTERN.search(os.path.basename(file_path))
    if not match:
        return None
    try:
        value = int(match.group(1))
    except ValueError:
        return None
    return value if value > 0 else None


def resolve_tool_path(file_path, directory):
    """Resolve a hook file path relative to the current directory."""
    if not file_path:
        return ''
    if os.path.isabs(file_path):
        return os.path.abspath(file_path)
    return os.path.abspath(os.path.join(directory, file_path))


def find_project_for_path(file_path, directory):
    """Find the nearest novel project root for a path."""
    resolved = resolve_tool_path(file_path, directory)
    if not resolved:
        return None

    current = os.path.dirname(resolved)
    while current:
        if os.path.exists(os.path.join(current, 'meta', 'project.json')):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            break
        current = parent
    return None


def quote_project(project_path):
    """Quote a project path for command display when needed."""
    if re.search(r'\s', project_path):
        return f'"{project_path}"'
    return project_path


def pad_chapter(chapter_number):
    """Return the canonical 3-digit chapter string."""
    return str(chapter_number).zfill(3)


def first_existing_path(candidates):
    """Return the first existing path from a candidate list."""
    for candidate in candidates:
        if os.path.exists(candidate):
            return candidate
    return None


def chapter_manuscript_candidates(project_path, chapter_number):
    """Return manuscript path candidates for a chapter."""
    pad = pad_chapter(chapter_number)
    return [
        os.path.join(project_path, 'chapters', f'chapter_{pad}.md'),
        os.path.join(project_path, 'chapters', f'ch{pad}.md'),
    ]


def chapter_summary_candidates(project_path, chapter_number):
    """Return summary path candidates for a chapter."""
    pad = pad_chapter(chapter_number)
    return [
        os.path.join(project_path, 'context', 'summaries', f'chapter_{pad}_summary.md'),
        os.path.join(project_path, 'context', 'summaries', f'chapter_{pad}.md'),
        os.path.join(project_path, 'context', 'summaries', f'chapter_{pad}_summary.json'),
        os.path.join(project_path, 'context', 'summaries', f'chapter_{pad}.json'),
    ]


def read_summary_text(summary_path):
    """Read markdown or JSON summary text."""
    with open(summary_path, 'r', encoding='utf-8') as f:
        raw = f.read()
    if summary_path.endswith('.json'):
        data = json.loads(raw)
        if not isinstance(data, dict) or not isinstance(data.get('summary'), str):
            raise ValueError('summary field must be a string')
        return data.get('summary')
    return raw


def compact_text_length(text):
    """Count non-whitespace characters."""
    return len(re.sub(r'\s+', '', text))


def summary_memory_commands(project_path, chapter_number):
    """Return recovery guidance for summary memory failures."""
    pad = pad_chapter(chapter_number)
    return [
        f'# regenerate context/summaries/chapter_{pad}_summary.md from chapters/chapter_{pad}.md',
        f'/verify-chapter {chapter_number}',
    ]


def summary_memory_failure(project_path, chapter_number, code, manuscript_path=None, summary_path=None, error=None):
    """Create a summary memory failure record."""
    default_summary_path = chapter_summary_candidates(project_path, chapter_number)[0]
    failure = {
        'label': SUMMARY_MEMORY_LABEL,
        'codes': [code],
        'report_path': summary_path or default_summary_path,
        'source_path': manuscript_path,
        'commands': summary_memory_commands(project_path, chapter_number),
    }
    if error:
        failure['error'] = str(error)
    return failure


def read_gate_report(report_path):
    """Read a gate report and preserve missing/malformed states."""
    if not os.path.exists(report_path):
        return {'state': 'missing'}
    try:
        with open(report_path, 'r', encoding='utf-8') as f:
            return {'state': 'loaded', 'data': json.load(f)}
    except (json.JSONDecodeError, IOError) as exc:
        return {'state': 'malformed', 'error': str(exc)}


def report_issue_codes(report, fallback_code):
    """Extract issue codes from a gate report."""
    issues = report.get('issues') if isinstance(report, dict) else None
    codes = []
    if isinstance(issues, list):
        for issue in issues:
            if isinstance(issue, str):
                codes.append(issue)
            elif isinstance(issue, dict) and isinstance(issue.get('code'), str):
                codes.append(issue.get('code'))

    return sorted(set(codes)) if codes else [fallback_code]


def report_commands(spec, report, project_path):
    """Return gate recovery commands from report or defaults."""
    if isinstance(report, dict) and isinstance(report.get('recommendedCommands'), list) and report.get('recommendedCommands'):
        return [str(command) for command in report.get('recommendedCommands')]

    project_arg = quote_project(project_path)
    return [command.format(project=project_arg) for command in spec['default_commands']]


def summary_memory_failures(project_path, chapter_number):
    """Return summary memory failures for prior chapters used as context."""
    if not chapter_number or chapter_number <= 1:
        return []

    failures = []
    start_chapter = max(1, chapter_number - DEFAULT_SUMMARY_WINDOW)
    for prior_chapter in range(start_chapter, chapter_number):
        manuscript_path = first_existing_path(chapter_manuscript_candidates(project_path, prior_chapter))
        if not manuscript_path:
            continue

        summary_path = first_existing_path(chapter_summary_candidates(project_path, prior_chapter))
        if not summary_path:
            failures.append(summary_memory_failure(
                project_path,
                prior_chapter,
                SUMMARY_MEMORY_MISSING_CODE,
                manuscript_path=manuscript_path,
            ))
            continue

        try:
            if os.path.getmtime(summary_path) < os.path.getmtime(manuscript_path):
                failures.append(summary_memory_failure(
                    project_path,
                    prior_chapter,
                    SUMMARY_MEMORY_STALE_CODE,
                    manuscript_path=manuscript_path,
                    summary_path=summary_path,
                ))
                continue

            summary_text = read_summary_text(summary_path)
            if compact_text_length(summary_text) < MIN_SUMMARY_CHARS:
                failures.append(summary_memory_failure(
                    project_path,
                    prior_chapter,
                    SUMMARY_MEMORY_TOO_THIN_CODE,
                    manuscript_path=manuscript_path,
                    summary_path=summary_path,
                ))
        except (OSError, json.JSONDecodeError, ValueError) as exc:
            failures.append(summary_memory_failure(
                project_path,
                prior_chapter,
                SUMMARY_MEMORY_MALFORMED_CODE,
                manuscript_path=manuscript_path,
                summary_path=summary_path,
                error=exc,
            ))

    return failures


def manuscript_gate_failures(project_path, chapter_number=None):
    """Return gate failures that should block manuscript file edits."""
    failures = []

    for spec in GATE_SPECS:
        report_path = os.path.join(project_path, 'reviews', spec['report'])
        loaded = read_gate_report(report_path)

        if loaded['state'] == 'missing':
            failures.append({
                'label': spec['label'],
                'codes': [spec['missing_code']],
                'report_path': report_path,
                'commands': report_commands(spec, None, project_path),
            })
            continue

        if loaded['state'] == 'malformed':
            failures.append({
                'label': spec['label'],
                'codes': [spec['malformed_code']],
                'report_path': report_path,
                'error': loaded.get('error'),
                'commands': report_commands(spec, None, project_path),
            })
            continue

        report = loaded.get('data')
        if not isinstance(report, dict) or report.get('passed') is not True or report.get('status') != 'PASS':
            failures.append({
                'label': spec['label'],
                'codes': report_issue_codes(report if isinstance(report, dict) else {}, spec['not_passed_code']),
                'report_path': report_path,
                'status': report.get('status') if isinstance(report, dict) else 'unknown',
                'passed': report.get('passed') if isinstance(report, dict) else 'unknown',
                'commands': report_commands(spec, report if isinstance(report, dict) else None, project_path),
            })

    failures.extend(summary_memory_failures(project_path, chapter_number))

    return failures


def manuscript_gate_block_reason(file_path, directory):
    """Return a block reason if a manuscript write/edit lacks gate PASS."""
    if not is_manuscript_path(file_path):
        return None

    project_path = find_project_for_path(file_path, directory)
    if not project_path:
        return None

    chapter_number = extract_chapter_number(file_path)
    failures = manuscript_gate_failures(project_path, chapter_number)
    if not failures:
        return None

    lines = [
        'Manuscript edit blocked: design/style/summary memory gate must PASS before modifying chapter markdown.',
        f'file: {resolve_tool_path(file_path, directory)}',
        f'project: {project_path}',
    ]

    for failure in failures:
        lines.append(f"- {failure['label']}: {', '.join(failure['codes'])}")
        lines.append(f"  report: {failure['report_path']}")
        if failure.get('source_path'):
            lines.append(f"  source: {failure.get('source_path')}")
        if failure.get('error'):
            lines.append(f"  error: {failure.get('error')}")
        if 'status' in failure or 'passed' in failure:
            lines.append(f"  state: status={failure.get('status', 'unknown')}, passed={failure.get('passed', 'unknown')}")
        lines.append('  recommendedCommands:')
        for command in failure['commands']:
            lines.append(f'    {command}')

    return '\n'.join(lines)


def validate_chapter_structure(data):
    """Validate chapter JSON structure."""
    # Core required fields (minimal validation for backward compatibility)
    core_required = ['chapter_number', 'scenes']
    for field in core_required:
        if field not in data:
            return False, f"Missing required field: {field}"

    if not isinstance(data.get('chapter_number'), int):
        return False, "chapter_number must be an integer"

    if not isinstance(data.get('scenes'), list):
        return False, "scenes must be an array"

    if len(data.get('scenes', [])) == 0:
        return False, "scenes array must have at least one scene"

    # Additional schema-defined required fields (warning-level, not blocking)
    # Full schema requires: chapter_title, status, word_count_target, meta, context, narrative_elements, style_guide
    # These are validated but not blocking for backward compatibility

    return True, "Valid"


def validate_character_structure(data):
    """Validate character JSON structure."""
    required = ['id', 'name', 'role']
    for field in required:
        if field not in data:
            return False, f"Missing required field: {field}"

    # Validate ID pattern
    char_id = data.get('id', '')
    if not re.match(r'^char_[a-z0-9_]+$', char_id):
        return False, f"Invalid character ID format: {char_id}. Must match 'char_[a-z0-9_]+'"

    # Validate role enum
    valid_roles = ['protagonist', 'deuteragonist', 'antagonist', 'supporting', 'minor', 'cameo']
    role = data.get('role', '')
    if role not in valid_roles:
        return False, f"Invalid role: {role}. Must be one of: {', '.join(valid_roles)}"

    return True, "Valid"


def validate_project_structure(data):
    """Validate project JSON structure."""
    required = ['id', 'title', 'genre']
    for field in required:
        if field not in data:
            return False, f"Missing required field: {field}"

    return True, "Valid"


def validate_world_structure(data):
    """Validate world JSON structure."""
    # Must match world.schema.json required fields
    required = ['era', 'location']
    for field in required:
        if field not in data:
            return False, f"Missing required field: {field}"

    # location must be an object if present
    if 'location' in data and not isinstance(data.get('location'), dict):
        return False, "location must be an object"

    return True, "Valid"


def validate_plot_structure(data):
    """Validate plot/main-arc JSON structure."""
    # Must match plot.schema.json required fields
    required = ['total_acts', 'acts']
    for field in required:
        if field not in data:
            return False, f"Missing required field: {field}"

    if not isinstance(data.get('total_acts'), int):
        return False, "total_acts must be an integer"

    if not isinstance(data.get('acts'), list):
        return False, "acts must be an array"

    if len(data.get('acts', [])) == 0:
        return False, "acts array must have at least one act"

    return True, "Valid"


def validate_foreshadowing_structure(data):
    """Validate foreshadowing JSON structure."""
    # Must match foreshadowing.schema.json required fields
    if 'foreshadowing' not in data:
        return False, "Missing required field: foreshadowing"

    if not isinstance(data.get('foreshadowing'), list):
        return False, "foreshadowing must be an array"

    # Validate each foreshadowing item
    for i, item in enumerate(data.get('foreshadowing', [])):
        required_item_fields = ['id', 'content', 'importance', 'plant_chapter', 'payoff_chapter', 'status']
        for field in required_item_fields:
            if field not in item:
                return False, f"Foreshadowing item {i}: Missing required field: {field}"

        # Validate ID pattern
        fore_id = item.get('id', '')
        if not re.match(r'^fore_[a-z0-9_]+$', fore_id):
            return False, f"Invalid foreshadowing ID format: {fore_id}. Must match 'fore_[a-z0-9_]+'"

        # Validate importance enum
        valid_importance = ['A', 'B', 'C']
        importance = item.get('importance', '')
        if importance not in valid_importance:
            return False, f"Invalid importance: {importance}. Must be one of: {', '.join(valid_importance)}"

        # Validate status enum
        valid_status = ['not_planted', 'planted', 'hinting', 'paid_off']
        status = item.get('status', '')
        if status not in valid_status:
            return False, f"Invalid status: {status}. Must be one of: {', '.join(valid_status)}"

    return True, "Valid"


def validate_sub_arc_structure(data):
    """Validate sub-arc JSON structure."""
    # Must match sub-arc.schema.json required fields: id, name, start_chapter
    required = ['id', 'name', 'start_chapter']
    for field in required:
        if field not in data:
            return False, f"Missing required field: {field}"

    # Validate ID pattern
    sub_id = data.get('id', '')
    if not re.match(r'^sub_\d{3}$', sub_id):
        return False, f"Invalid sub-arc ID format: {sub_id}. Must match 'sub_XXX' (3 digits)"

    # Validate start_chapter is integer
    if not isinstance(data.get('start_chapter'), int):
        return False, "start_chapter must be an integer"

    return True, "Valid"


def validate_json_structure(content, schema_name):
    """Basic structure validation without jsonschema dependency."""
    try:
        data = json.loads(content)

        validators = {
            'chapter.schema.json': validate_chapter_structure,
            'character.schema.json': validate_character_structure,
            'project.schema.json': validate_project_structure,
            'world.schema.json': validate_world_structure,
            'plot.schema.json': validate_plot_structure,
            'foreshadowing.schema.json': validate_foreshadowing_structure,
            'sub-arc.schema.json': validate_sub_arc_structure,
        }

        validator = validators.get(schema_name)
        if validator:
            return validator(data)

        # Default: just check it's valid JSON
        return True, "Valid JSON"

    except json.JSONDecodeError as e:
        return False, f"Invalid JSON: {e}"


def main():
    try:
        hook_input = json.load(sys.stdin)
    except json.JSONDecodeError:
        hook_input = {}

    tool_name = hook_input.get('tool_name', hook_input.get('toolName', ''))
    tool_input = hook_input.get('tool_input', hook_input.get('toolInput', {}))
    directory = hook_input.get('directory', hook_input.get('cwd', os.getcwd()))

    if tool_name in MANUSCRIPT_TOOLS:
        file_path = tool_input.get('file_path', tool_input.get('path', ''))
        block_reason = manuscript_gate_block_reason(file_path, directory)
        if block_reason:
            print(json.dumps({
                "decision": "block",
                "reason": block_reason,
            }))
            return

    # Only validate Write tool for JSON files
    if tool_name != 'Write':
        print(json.dumps({"decision": "approve"}))
        return

    file_path = tool_input.get('file_path', '')
    content = tool_input.get('content', '')

    # Skip non-JSON files
    if not file_path.endswith('.json'):
        print(json.dumps({"decision": "approve"}))
        return

    # Normalize path separators for matching
    normalized_path = file_path.replace('\\', '/')

    # Check if it's a JSON file we should validate
    for pattern, schema in SCHEMA_PATTERNS.items():
        if re.search(pattern, normalized_path):
            is_valid, message = validate_json_structure(content, schema)
            if not is_valid:
                result = {
                    "decision": "block",
                    "reason": f"Schema validation failed for {os.path.basename(file_path)}: {message}"
                }
                print(json.dumps(result))
                return
            break

    print(json.dumps({"decision": "approve"}))


if __name__ == "__main__":
    main()
