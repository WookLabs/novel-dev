import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { mkdir, mkdtemp, rm, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const root = process.cwd();
const hookPath = join(root, 'hooks', 'pretooluse.py');
const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('pretooluse manuscript gate', () => {
  it('blocks Write to chapter markdown when design and style gate reports are missing', async () => {
    const project = await createProject();
    const result = runHook({
      toolName: 'Write',
      toolInput: {
        file_path: join(project, 'chapters', 'chapter_001.md'),
        content: '첫 문장',
      },
      directory: project,
    });

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.decision).toBe('block');
    expect(output.reason).toContain('Manuscript edit blocked');
    expect(output.reason).toContain('design-gate-report-missing');
    expect(output.reason).toContain('style-gate-report-missing');
    expect(output.reason).toContain('run-premise-appeal-benchmark');
    expect(output.reason).toContain('apply-design-gate');
    expect(output.reason).toContain('run-prose-taste-benchmark');
    expect(output.reason).toContain('apply-style-gate');
  });

  it('blocks Edit to chapter variants when the style gate is blocked', async () => {
    const project = await createProject();
    await writeGateReports(project, {
      style: {
        status: 'BLOCKED',
        passed: false,
        issues: [{ code: 'prose-taste-not-ready' }],
        recommendedCommands: ['node custom-style-gate.mjs --project sample'],
      },
    });

    const result = runHook({
      tool_name: 'Edit',
      tool_input: {
        file_path: join(project, 'chapters', 'chapter_001_codex.md'),
        old_string: 'a',
        new_string: 'b',
      },
      directory: project,
    });

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.decision).toBe('block');
    expect(output.reason).toContain('prose-taste-not-ready');
    expect(output.reason).toContain('node custom-style-gate.mjs --project sample');
  });

  it('approves MultiEdit to chapter markdown when both gates pass', async () => {
    const project = await createProject();
    await writeGateReports(project);

    const result = runHook({
      toolName: 'MultiEdit',
      toolInput: {
        file_path: join(project, 'chapters', 'ch001.md'),
        edits: [{ old_string: 'a', new_string: 'b' }],
      },
      directory: project,
    });

    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ decision: 'approve' });
  });

  it('blocks direct chapter edits when prior manuscript summary memory is missing', async () => {
    const project = await createProject();
    await writeGateReports(project);
    await writeFile(
      join(project, 'chapters', 'chapter_001.md'),
      '서진은 검은 인장을 발견하고 왕가 실종 사건과 금지된 숲의 소문이 이어진다는 단서를 얻었다.',
      'utf8'
    );

    const result = runHook({
      toolName: 'Write',
      toolInput: {
        file_path: join(project, 'chapters', 'chapter_002.md'),
        content: '두 번째 회차',
      },
      directory: project,
    });

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.decision).toBe('block');
    expect(output.reason).toContain('summary memory gate');
    expect(output.reason).toContain('summary-memory-missing');
    expect(output.reason).toContain('chapter_001_summary.md');
    expect(output.reason).toContain('chapter_001.md');
    expect(output.reason).toContain('/verify-chapter 1');
  });

  it('blocks direct chapter edits when prior manuscript summary memory is stale', async () => {
    const project = await createProject();
    await writeGateReports(project);
    const manuscript = join(project, 'chapters', 'chapter_001.md');
    const summary = join(project, 'context', 'summaries', 'chapter_001_summary.md');
    await writeFile(
      manuscript,
      '서진은 검은 인장을 발견하고 왕가 실종 사건과 금지된 숲의 소문이 이어진다는 단서를 얻었다.',
      'utf8'
    );
    await writeFile(summary, substantiveSummary(), 'utf8');
    await utimes(summary, new Date('2025-01-01T00:00:00Z'), new Date('2025-01-01T00:00:00Z'));
    await utimes(manuscript, new Date('2025-01-02T00:00:00Z'), new Date('2025-01-02T00:00:00Z'));

    const result = runHook({
      toolName: 'Edit',
      toolInput: {
        file_path: join(project, 'chapters', 'chapter_002.md'),
        old_string: 'a',
        new_string: 'b',
      },
      directory: project,
    });

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.decision).toBe('block');
    expect(output.reason).toContain('summary-memory-stale');
    expect(output.reason).toContain('chapter_001_summary.md');
  });

  it('approves direct later-chapter edits when prior summary memory is fresh and substantive', async () => {
    const project = await createProject();
    await writeGateReports(project);
    const manuscript = join(project, 'chapters', 'chapter_001.md');
    const summary = join(project, 'context', 'summaries', 'chapter_001_summary.md');
    await writeFile(
      manuscript,
      '서진은 검은 인장을 발견하고 왕가 실종 사건과 금지된 숲의 소문이 이어진다는 단서를 얻었다.',
      'utf8'
    );
    await writeFile(summary, substantiveSummary(), 'utf8');
    await utimes(manuscript, new Date('2025-01-01T00:00:00Z'), new Date('2025-01-01T00:00:00Z'));
    await utimes(summary, new Date('2025-01-02T00:00:00Z'), new Date('2025-01-02T00:00:00Z'));

    const result = runHook({
      toolName: 'MultiEdit',
      toolInput: {
        file_path: join(project, 'chapters', 'chapter_002.md'),
        edits: [{ old_string: 'a', new_string: 'b' }],
      },
      directory: project,
    });

    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ decision: 'approve' });
  });

  it('does not gate non-chapter markdown files', async () => {
    const project = await createProject();

    const result = runHook({
      toolName: 'Write',
      toolInput: {
        file_path: join(project, 'notepad.md'),
        content: '작가 노트',
      },
      directory: project,
    });

    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ decision: 'approve' });
  });

  it('preserves existing JSON schema blocking for invalid chapter plot files', async () => {
    const project = await createProject();

    const result = runHook({
      toolName: 'Write',
      toolInput: {
        file_path: join(project, 'chapters', 'chapter_001.json'),
        content: JSON.stringify({ title: 'missing required fields' }),
      },
      directory: project,
    });

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.decision).toBe('block');
    expect(output.reason).toContain('Schema validation failed');
    expect(output.reason).toContain('Missing required field: chapter_number');
  });

  it('registers the manuscript guard for Write, Edit, and MultiEdit hooks', () => {
    const hooks = JSON.parse(readFileSync(join(root, 'hooks', 'hooks.json'), 'utf8'));
    const preToolUse = hooks.hooks.PreToolUse;
    const guarded = new Map<string, string>(
      preToolUse
        .filter((entry: any) => ['Write', 'Edit', 'MultiEdit'].includes(entry.matcher))
        .map((entry: any) => [entry.matcher, entry.hooks?.[0]?.command ?? ''])
    );

    expect(guarded.get('Write')).toContain('hooks/pretooluse.py');
    expect(guarded.get('Edit')).toContain('hooks/pretooluse.py');
    expect(guarded.get('MultiEdit')).toContain('hooks/pretooluse.py');
  });
});

async function createProject() {
  const project = await mkdtemp(join(tmpdir(), 'pretooluse-manuscript-gate-'));
  tempDirs.push(project);
  await mkdir(join(project, 'meta'), { recursive: true });
  await mkdir(join(project, 'chapters'), { recursive: true });
  await mkdir(join(project, 'context', 'summaries'), { recursive: true });
  await mkdir(join(project, 'reviews'), { recursive: true });
  await writeJson(join(project, 'meta', 'project.json'), {
    id: 'sample',
    title: 'Sample',
    genre: 'mystery',
  });
  return project;
}

async function writeGateReports(project: string, overrides: { design?: Record<string, unknown>, style?: Record<string, unknown> } = {}) {
  await writeJson(join(project, 'reviews', 'design-gate-report.json'), {
    status: 'PASS',
    passed: true,
    issues: [],
    recommendedCommands: [],
    ...overrides.design,
  });
  await writeJson(join(project, 'reviews', 'style-gate-report.json'), {
    status: 'PASS',
    passed: true,
    issues: [],
    recommendedCommands: [],
    ...overrides.style,
  });
}

async function writeJson(path: string, data: unknown) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function substantiveSummary() {
  return [
    '# 1화 요약: 검은 인장',
    '',
    '서진은 아케디아 시장에서 검은 인장을 지닌 남자를 목격했고, 그 인장이 왕가 실종 사건과 연결된다는 소문을 들었다.',
    '그는 숲의 경계에서 인장이 남긴 재 냄새와 은빛 실을 확인했으며, 다음 회차에서는 단서를 따라 금지된 숲으로 들어가야 한다.',
  ].join('\n');
}

function runHook(payload: unknown) {
  return spawnSync('python', [hookPath], {
    cwd: root,
    input: JSON.stringify(payload),
    encoding: 'utf8',
  });
}
