import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filenameLocal = fileURLToPath(import.meta.url);
const __dirnameLocal = dirname(__filenameLocal);
const ROOT = join(__dirnameLocal, '..', '..');

function listFiles(dir: string): string[] {
  const entries = readdirSync(dir).sort();
  return entries.flatMap(entry => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) return listFiles(fullPath);
    return fullPath;
  });
}

describe('opus routing compatibility', () => {
  it('does not hardcode sonnet for Task dispatches or agent frontmatter defaults', () => {
    const files = [
      ...listFiles(join(ROOT, 'agents')).filter(file => file.endsWith('.md')),
      ...listFiles(join(ROOT, 'skills')).filter(file => file.endsWith('.md')),
    ];

    const offenders = files.flatMap(file => {
      const relative = file.slice(ROOT.length + 1).replace(/\\/g, '/');
      const content = readFileSync(file, 'utf-8');
      const matches = [
        ...content.matchAll(/model\s*[:=]\s*["']?sonnet["']?/g),
      ];
      return matches.map(match => `${relative}: ${match[0]}`);
    });

    expect(offenders).toEqual([]);
  });

  it('routes medium tier agents to opus instead of sonnet while leaving low tier available', () => {
    const config = JSON.parse(readFileSync(join(ROOT, 'config', 'model-tiers.json'), 'utf-8'));

    expect(config.tiers.MEDIUM.model).toBe('opus');
    expect(config.tiers.LOW.model).toBe('haiku');
  });
});
