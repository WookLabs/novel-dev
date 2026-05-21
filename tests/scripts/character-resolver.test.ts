/**
 * Tests for scripts/lib/character-resolver.mjs and scripts/lib/chapter-cast.mjs
 *
 * Follows spec-then-tdd: tests written BEFORE implementation.
 * Run: npm test -- character-resolver
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync, spawnSync } from 'child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename_local = fileURLToPath(import.meta.url);
const __dirname_local = dirname(__filename_local);
const REPO_ROOT = join(__dirname_local, '..', '..');

// ─── Helper: create a temp project with character files ─────────────────────
function createTempProject(characters: Array<{ filename: string; data: object }>) {
  const dir = mkdtempSync(join(tmpdir(), 'char-resolver-test-'));
  const charsDir = join(dir, 'characters');
  mkdirSync(charsDir, { recursive: true });
  for (const { filename, data } of characters) {
    writeFileSync(join(charsDir, filename), JSON.stringify(data, null, 2), 'utf-8');
  }
  return dir;
}

// ─── Helper: import ESM module dynamically ──────────────────────────────────
async function importResolver() {
  return await import(`${REPO_ROOT}/scripts/lib/character-resolver.mjs?t=${Date.now()}`);
}

async function importChapterCast() {
  return await import(`${REPO_ROOT}/scripts/lib/chapter-cast.mjs?t=${Date.now()}`);
}

// ─── CRITERION 1: Resolve by JSON id when filename differs ──────────────────
// protagonist.json has id "char_001" — must be resolvable by "char_001"
describe('resolveCharacters — filename vs id mismatch (MUST)', () => {
  it('resolves char_001 from protagonist.json via JSON id field', async () => {
    const { resolveCharacters } = await importResolver();
    // Use the real novel_1 data
    const projectPath = join(REPO_ROOT, 'novels', 'novel_1');
    const { resolved, missing } = await resolveCharacters(projectPath, ['char_001']);
    expect(missing).not.toContain('char_001');
    expect(resolved).toHaveLength(1);
    expect(resolved[0].requestedId).toBe('char_001');
    expect(resolved[0].character).toBeDefined();
    // The character name from protagonist.json is 서강윤
    expect(resolved[0].character.name).toBe('서강윤');
    expect(resolved[0].source).toBe('byId');
  });

  it('resolves by filename stem (byStem) when id is not a direct match', async () => {
    const { resolveCharacters } = await importResolver();
    const tmpProject = createTempProject([
      { filename: 'protagonist.json', data: { id: 'char_001', name: '서강윤', role: 'protagonist' } },
    ]);
    try {
      const { resolved, missing } = await resolveCharacters(tmpProject, ['protagonist']);
      expect(missing).not.toContain('protagonist');
      expect(resolved[0].source).toBe('byStem');
    } finally {
      rmSync(tmpProject, { recursive: true, force: true });
    }
  });
});

// ─── CRITERION 2: extractChapterCast from scenes[].characters ───────────────
describe('extractChapterCast — scenes characters fallback (MUST)', () => {
  it('returns cast from scenes[].characters when scene_cast is absent', async () => {
    const { extractChapterCast } = await importChapterCast();
    const chapterJson = {
      meta: {},
      scenes: [
        { characters: ['char_001', 'char_002'] },
        { characters: ['char_002', 'char_003'] },
      ],
    };
    const cast = extractChapterCast(chapterJson);
    expect(cast).toContain('char_001');
    expect(cast).toContain('char_002');
    expect(cast).toContain('char_003');
    // deduplicated
    expect(cast.filter((c: string) => c === 'char_002')).toHaveLength(1);
  });

  it('returns cast from scenes[].characters when scene_cast is empty array', async () => {
    const { extractChapterCast } = await importChapterCast();
    const chapterJson = {
      scene_cast: [],
      meta: {},
      scenes: [
        { characters: ['char_001'] },
      ],
    };
    const cast = extractChapterCast(chapterJson);
    expect(cast).toContain('char_001');
  });

  it('prefers scene_cast over scenes[].characters when scene_cast is non-empty', async () => {
    const { extractChapterCast } = await importChapterCast();
    const chapterJson = {
      scene_cast: ['char_005'],
      scenes: [{ characters: ['char_001'] }],
      meta: {},
    };
    const cast = extractChapterCast(chapterJson);
    expect(cast).toContain('char_005');
    expect(cast).not.toContain('char_001');
  });
});

// ─── CRITERION 3: extractChapterCast falls back to meta.characters ───────────
describe('extractChapterCast — meta.characters fallback (MUST)', () => {
  it('falls back to meta.characters when scenes have no character lists', async () => {
    const { extractChapterCast } = await importChapterCast();
    const chapterJson = {
      meta: { characters: ['char_001', 'char_002'] },
      scenes: [{ purpose: 'no characters key here' }],
    };
    const cast = extractChapterCast(chapterJson);
    expect(cast).toContain('char_001');
    expect(cast).toContain('char_002');
  });

  it('returns empty array when no cast sources available', async () => {
    const { extractChapterCast } = await importChapterCast();
    const chapterJson = {
      meta: {},
      scenes: [],
    };
    const cast = extractChapterCast(chapterJson);
    expect(cast).toEqual([]);
  });
});

// ─── CRITERION 4: codex-writer --dry-run shows at least one character ────────
describe('codex-writer --dry-run character display (MUST)', () => {
  it('prints a loaded character name instead of "등장인물: none"', () => {
    const result = spawnSync('node', [
      join(REPO_ROOT, 'scripts', 'codex-writer.mjs'),
      '--chapter', '1',
      '--project', join(REPO_ROOT, 'novels', 'novel_1'),
      '--mode', 'write',
      '--dry-run',
    ], { encoding: 'utf-8', timeout: 30000 });

    const output = result.stdout + result.stderr;
    // Must NOT say "등장인물: none"
    expect(output).not.toContain('등장인물: none');
    // Must contain at least one known character name or id
    const hasCharacter =
      output.includes('서강윤') ||
      output.includes('char_001') ||
      output.includes('protagonist');
    expect(hasCharacter).toBe(true);
  });
});

// ─── CRITERION 5 (SHOULD): Missing ids are warnings, not errors ──────────────
describe('resolveCharacters — missing ids are warnings not errors (SHOULD)', () => {
  it('returns missing ids in missing array without throwing', async () => {
    const { resolveCharacters } = await importResolver();
    const tmpProject = createTempProject([
      { filename: 'char_a.json', data: { id: 'char_a', name: '가나다', role: 'supporting' } },
    ]);
    try {
      const { resolved, missing } = await resolveCharacters(tmpProject, [
        'char_a',
        'nonexistent_char_xyz',
      ]);
      expect(missing).toContain('nonexistent_char_xyz');
      expect(resolved.map((r: { requestedId: string }) => r.requestedId)).toContain('char_a');
      // Should not throw — we get here = no error
    } finally {
      rmSync(tmpProject, { recursive: true, force: true });
    }
  });
});

// ─── Integration: real novel_1 data (10 characters) ──────────────────────────
const novel1Exists = existsSync(join(REPO_ROOT, 'novels', 'novel_1', 'characters'));
describe.skipIf(!novel1Exists)('loadCharacterIndex — real novel_1 integration', () => {
  it('indexes all 10 character files from novels/novel_1/characters/', async () => {
    const { loadCharacterIndex } = await importResolver();
    const projectPath = join(REPO_ROOT, 'novels', 'novel_1');
    const index = await loadCharacterIndex(projectPath);
    // Should have 10 characters
    expect(index.raw.length).toBe(10);
    // protagonist.json has id char_001
    expect(index.byId['char_001']).toBeDefined();
    // byStem should resolve protagonist
    expect(index.byStem['protagonist']).toBeDefined();
    // byName for 서강윤
    expect(index.byName['서강윤']).toBeDefined();
    // byAlias for 강윤 (first alias)
    expect(index.byAlias['강윤']).toBeDefined();
  });
});
