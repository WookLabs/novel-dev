import { describe, expect, it } from 'vitest';
import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filenameLocal = fileURLToPath(import.meta.url);
const __dirnameLocal = dirname(__filenameLocal);
const ROOT = join(__dirnameLocal, '..', '..');
const SKILLS_DIR = join(ROOT, 'skills');

describe('skill filenames', () => {
  it('each skill directory should contain exact-case SKILL.md', () => {
    const failures: string[] = [];
    const skillDirs = readdirSync(SKILLS_DIR)
      .filter(entry => statSync(join(SKILLS_DIR, entry)).isDirectory())
      .sort();

    expect(skillDirs.length).toBeGreaterThan(0);

    for (const dir of skillDirs) {
      const entries = readdirSync(join(SKILLS_DIR, dir));
      if (!entries.includes('SKILL.md')) {
        const nearMiss = entries.find(entry => entry.toLowerCase() === 'skill.md');
        failures.push(`${dir}: expected SKILL.md${nearMiss ? `, found ${nearMiss}` : ''}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
