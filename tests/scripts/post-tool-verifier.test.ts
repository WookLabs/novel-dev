import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const verifierPath = join(root, 'scripts', 'post-tool-verifier.mjs');

async function writeJson(path: string, data: unknown): Promise<void> {
  await writeFile(path, JSON.stringify(data, null, 2));
}

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

describe('post-tool-verifier hook', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('does not directly mutate Ralph gate state when a critic score is detected', async () => {
    const projectDir = await mkdtemp(join(tmpdir(), 'post-tool-verifier-'));
    tempDirs.push(projectDir);

    await mkdir(join(projectDir, 'meta'), { recursive: true });
    await writeJson(join(projectDir, 'meta', 'project.json'), {
      id: 'sample-project',
      title: 'Sample',
      genre: 'mystery',
    });
    await writeJson(join(projectDir, 'meta', 'ralph-state.json'), {
      ralph_active: true,
      current_chapter: 1,
      completed_chapters: [],
      failed_chapters: [],
      retry_count: 0,
    });

    const result = spawnSync(
      process.execPath,
      [verifierPath],
      {
        cwd: root,
        input: JSON.stringify({
          toolName: 'Task',
          toolInput: { subagent_type: 'novel-dev:critic' },
          toolOutput: '<score>92</score>\n좋은 회차입니다.',
          directory: projectDir,
        }),
        encoding: 'utf8',
      }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.decision).toBe('approve');
    expect(output.message).toContain('apply-chapter-gate');

    const state = await readJson(join(projectDir, 'meta', 'ralph-state.json'));
    expect(state).not.toHaveProperty('last_quality_score');
    expect(state).not.toHaveProperty('last_quality_check');
    expect(state).not.toHaveProperty('last_gate');
  });
});
