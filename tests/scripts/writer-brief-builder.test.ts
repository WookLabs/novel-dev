/**
 * Tests for scripts/lib/writer-brief-builder.mjs
 *
 * Spec-then-TDD: these tests are written before implementation.
 * Each MUST criterion is covered by at least one test.
 */

import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import path from 'path';

// Dynamic ESM import helper
async function importWriterBriefBuilder() {
  const modulePath = path.resolve(
    process.cwd(),
    'scripts/lib/writer-brief-builder.mjs'
  );
  return import(pathToFileURL(modulePath).href);
}

// Minimal chapter JSON with storyboard/meta phrases
const BAD_META_CHAPTER = {
  chapter_number: 7,
  chapter_title: '빈 작업실',
  meta: {
    pov_character: 'char_001',
    characters: ['char_001'],
    locations: ['loc_studio', 'loc_rooftop'],
    in_story_time: '2025년 1월',
  },
  word_count_target: 5000,
  scenes: [
    {
      scene_number: 1,
      title: '작업실 귀환',
      location: 'loc_studio',
      characters: ['char_001'],
      objective: '강윤이 빈 스튜디오에서 회귀를 깨닫는다. 0.5초 침묵 후 화면 페이드.',
      conflict: '메커닉: 감정 노출 장치가 작동한다. 정서 전환 비트.',
    },
    {
      scene_number: 2,
      title: '옥상',
      location: 'loc_rooftop',
      characters: ['char_001'],
      objective: '한 박자 후 강윤이 결심한다.',
      conflict: '권말 컷으로 마무리.',
    },
  ],
  required_facts: ['강윤이 빈 작업실에서 회귀를 깨닫는다'],
  emotional_arc: '두려움 → 각성 → 결심',
  hooks: ['훅_001'],
  foreshadowing: ['복선_007'],
};

describe('buildWriterBrief — MUST criteria', () => {
  // MUST 1: Output contains no literal storyboard phrases
  it('MUST: brief does not contain 화면 페이드, 메커닉, or literal 0.5초', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const { brief } = buildWriterBrief(BAD_META_CHAPTER);

    expect(brief).not.toContain('화면 페이드');
    expect(brief).not.toContain('메커닉');
    expect(brief).not.toContain('0.5초');
  });

  // MUST 2: Retains story facts (character name, location, scene goal)
  it('MUST: brief retains the story fact — 강윤이 빈 작업실에서 회귀를 깨닫는다', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const { brief } = buildWriterBrief(BAD_META_CHAPTER);

    // The story fact should appear in required_facts section
    expect(brief).toContain('강윤이 빈 작업실에서 회귀를 깨닫는다');
  });

  // MUST 3: privateOutlineWarnings lists detected storyboard phrases
  it('MUST: privateOutlineWarnings lists at least the detected storyboard phrases', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const { privateOutlineWarnings } = buildWriterBrief(BAD_META_CHAPTER);

    expect(Array.isArray(privateOutlineWarnings)).toBe(true);
    expect(privateOutlineWarnings.length).toBeGreaterThanOrEqual(1);

    // Each warning must have the required structure
    for (const warning of privateOutlineWarnings) {
      expect(warning).toHaveProperty('originalPhrase');
      expect(warning).toHaveProperty('location');
      expect(warning).toHaveProperty('replacement');
    }

    // At least 화면 페이드 or 0.5초 침묵 or 메커닉 must appear in warnings
    const phrases = privateOutlineWarnings.map((w) => w.originalPhrase);
    const hasStoryboardPhrase = phrases.some(
      (p) =>
        p.includes('화면 페이드') ||
        p.includes('0.5초') ||
        p.includes('메커닉') ||
        p.includes('정서 전환') ||
        p.includes('비트') ||
        p.includes('권말 컷')
    );
    expect(hasStoryboardPhrase).toBe(true);
  });

  // MUST 4: Brief structure has required sections
  it('MUST: brief contains required markdown sections', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const { brief } = buildWriterBrief(BAD_META_CHAPTER);

    expect(brief).toContain('## 작가용 브리프');
    expect(brief).toContain('### 회차 메타');
    expect(brief).toContain('### 등장인물');
    expect(brief).toContain('### 장소');
    expect(brief).toContain('### 장면별 목표');
    expect(brief).toContain('### 사전 설계 주의');
  });

  // FIX 1 REGRESSION: curly-quote dialogue containing 메커닉 must NOT be sanitized
  it('FIX1: curly-quote dialogue phrase 그가 "메커닉을 보여줘"라고 말한다 must survive sanitization verbatim', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const chapterWithCurlyDialogue = {
      ...BAD_META_CHAPTER,
      scenes: [
        {
          scene_number: 1,
          title: '대화 씬',
          location: 'loc_studio',
          characters: ['char_001'],
          objective: '그가 “메커닉을 보여줘”라고 말한다.',
          conflict: '',
        },
      ],
    };
    const { brief, privateOutlineWarnings } = buildWriterBrief(chapterWithCurlyDialogue);
    // The curly-quote dialogue phrase must appear verbatim in the brief
    expect(brief).toContain('“메커닉을 보여줘”');
    // No warning should be generated for this phrase (it's inside dialogue)
    const metaWarnings = privateOutlineWarnings.filter((w: { originalPhrase: string }) =>
      w.originalPhrase.includes('메커닉')
    );
    expect(metaWarnings.length).toBe(0);
  });

  // SHOULD: Prose-safe rewrites preserve meaning (0.5초 침묵 → narrative instruction)
  it('SHOULD: prose rewrite of 0.5초 침묵 produces a narrative instruction', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const { brief } = buildWriterBrief(BAD_META_CHAPTER);

    // The brief should contain the prose-safe replacement, not the raw phrase
    // The replacement for '0.5초 침묵' is '짧은 침묵이 어색함을 드러낸다'
    // OR something that doesn't literally say '0.5초'
    expect(brief).not.toContain('0.5초');
    // The replacement text should appear
    expect(brief).toContain('짧은 침묵');
  });
});

// ---------------------------------------------------------------------------
// C4 — Sanitizer scope: required_facts, emotional_arc, hooks
// ---------------------------------------------------------------------------
describe('buildWriterBrief — C4 sanitizer scope (required_facts, emotional_arc, hooks)', () => {
  it('C4-1: required_facts with storyboard phrase is sanitized and warning is emitted', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const chapterJson = {
      chapter_number: 1,
      chapter_title: '테스트 챕터',
      word_count_target: 5000,
      required_facts: ['0.5초 침묵으로 시작한다'],
      scenes: [],
    };
    const { brief, privateOutlineWarnings } = buildWriterBrief(chapterJson);

    // brief must NOT contain the raw storyboard phrase
    expect(brief).not.toContain('0.5초');

    // privateOutlineWarnings must include an entry for required_facts[0]
    const warning = privateOutlineWarnings.find(
      (w: { location: string }) => w.location === 'required_facts[0]'
    );
    expect(warning).toBeDefined();
  });

  it('C4-2: emotional_arc string with storyboard phrase is sanitized', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const chapterJson = {
      chapter_number: 1,
      chapter_title: '테스트 챕터',
      word_count_target: 5000,
      emotional_arc: '화면 페이드로 회복한다',
      scenes: [],
    };
    const { brief, privateOutlineWarnings } = buildWriterBrief(chapterJson);

    // brief must NOT contain the raw storyboard phrase
    expect(brief).not.toContain('화면 페이드');

    // A warning should be emitted for emotional_arc
    const warning = privateOutlineWarnings.find(
      (w: { location: string }) => w.location === 'emotional_arc'
    );
    expect(warning).toBeDefined();
  });

  it('C4-3: hooks array with storyboard phrase is sanitized', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const chapterJson = {
      chapter_number: 1,
      chapter_title: '테스트 챕터',
      word_count_target: 5000,
      hooks: ['다음 권말 컷에서 회수'],
      scenes: [],
    };
    const { brief, privateOutlineWarnings } = buildWriterBrief(chapterJson);

    // brief must NOT contain the raw storyboard phrase
    expect(brief).not.toContain('권말 컷');

    // A warning should be emitted for hooks[0]
    const warning = privateOutlineWarnings.find(
      (w: { location: string }) => w.location === 'hooks[0]'
    );
    expect(warning).toBeDefined();
  });

  it('C4-4: emotional_arc as object sanitizes each string-valued field', async () => {
    const { buildWriterBrief } = await importWriterBriefBuilder();
    const chapterJson = {
      chapter_number: 1,
      chapter_title: '테스트 챕터',
      word_count_target: 5000,
      emotional_arc: {
        opening: '화면 페이드인으로 시작',
        closing: '장면 전환으로 마무리',
      },
      scenes: [],
    };
    const { brief, privateOutlineWarnings } = buildWriterBrief(chapterJson);

    // Neither raw storyboard phrase should appear
    expect(brief).not.toContain('화면 페이드');
    expect(brief).not.toContain('장면 전환');

    // Warnings for each sub-field
    const openingWarning = privateOutlineWarnings.find(
      (w: { location: string }) => w.location === 'emotional_arc.opening'
    );
    expect(openingWarning).toBeDefined();
  });
});
