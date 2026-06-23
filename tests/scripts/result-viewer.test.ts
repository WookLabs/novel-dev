import { describe, expect, it } from 'vitest';
import { execFileSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';

const __filenameLocal = fileURLToPath(import.meta.url);
const __dirnameLocal = dirname(__filenameLocal);
const ROOT = join(__dirnameLocal, '..', '..');

function makeFixtureProject(): { resultRoot: string; outputPath: string } {
  const base = join(tmpdir(), `novel-result-viewer-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const resultRoot = join(base, 'result');
  const project = join(resultRoot, '01_novel');

  mkdirSync(join(project, 'meta'), { recursive: true });
  mkdirSync(join(project, 'world'), { recursive: true });
  mkdirSync(join(project, 'characters'), { recursive: true });
  mkdirSync(join(project, 'plot'), { recursive: true });
  mkdirSync(join(project, 'chapters'), { recursive: true });
  mkdirSync(join(project, 'reviews'), { recursive: true });
  mkdirSync(join(project, 'exports'), { recursive: true });
  mkdirSync(join(project, 'context', 'summaries'), { recursive: true });

  writeFileSync(join(project, 'meta', 'brainstorm-result.md'), '# Brainstorm\n\n핵심 아이디어', 'utf-8');
  writeFileSync(join(project, 'BLUEPRINT.md'), '# Blueprint\n\n장편 설계', 'utf-8');
  writeFileSync(join(project, 'meta', 'project.json'), JSON.stringify({ title: '테스트 장편', genre: 'mystery' }), 'utf-8');
  writeFileSync(join(project, 'meta', 'style-guide.json'), JSON.stringify({ tone: 'dry', taboo_words: ['갑자기'] }), 'utf-8');
  writeFileSync(join(project, 'world', 'world.json'), JSON.stringify({ premise: '도시 괴담' }), 'utf-8');
  writeFileSync(join(project, 'characters', 'protagonist.json'), JSON.stringify({ name: '이서진' }), 'utf-8');
  writeFileSync(join(project, 'plot', 'structure.json'), JSON.stringify({ acts: 3 }), 'utf-8');
  writeFileSync(join(project, 'chapters', 'chapter_001.md'), '# 1화\n\n문이 열렸다.', 'utf-8');
  writeFileSync(join(project, 'chapters', 'chapter_001.json'), JSON.stringify({ chapter: 1 }), 'utf-8');
  writeFileSync(join(project, 'reviews', 'chapter_001_review.json'), JSON.stringify({ score: 96 }), 'utf-8');
  writeFileSync(join(project, 'context', 'summaries', 'chapter_001.md'), '요약', 'utf-8');
  writeFileSync(join(project, 'exports', 'novel.md'), '# Export', 'utf-8');

  return {
    resultRoot,
    outputPath: join(base, 'viewer.html'),
  };
}

describe('result viewer generator', () => {
  it('renders skill-output coverage for a result project into a standalone HTML file', () => {
    const { resultRoot, outputPath } = makeFixtureProject();

    execFileSync(process.execPath, [
      join(ROOT, 'scripts', 'result-viewer.mjs'),
      '--result-root',
      resultRoot,
      '--output',
      outputPath,
    ], { cwd: ROOT, stdio: 'pipe' });

    const html = readFileSync(outputPath, 'utf-8');

    expect(html).toContain('Novel Result Viewer');
    expect(html).toContain('01_novel');
    expect(html).toContain('00-brainstorm');
    expect(html).toContain('01-blueprint-gen');
    expect(html).toContain('03-init');
    expect(html).toContain('04-design');
    expect(html).toContain('05-gen-plot');
    expect(html).toContain('06-write');
    expect(html).toContain('07-act-review');
    expect(html).toContain('08-write-all');
    expect(html).toContain('09-revise');
    expect(html).toContain('10-resume');
    expect(html).toContain('meta/brainstorm-result.md');
    expect(html).toContain('chapters/chapter_001.md');
    expect(html).toContain('reviews/chapter_001_review.json');
    expect(html).toContain('테스트 장편');
    expect(html).toContain('문이 열렸다.');
    expect(html).toContain('아직 생성 안 됨');
  });
});
