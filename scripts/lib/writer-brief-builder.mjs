/**
 * writer-brief-builder.mjs
 *
 * Transforms raw chapter JSON (storyboard/meta-planning output) into a
 * sanitized, prose-safe writer brief.
 *
 * Exported:
 *   buildWriterBrief(chapterJson, options?) → { brief, privateOutlineWarnings }
 *
 * Design:
 *   - Pure-ish function (no side effects, deterministic output).
 *   - Sanitizes storyboard/meta phrases into narrative instructions.
 *   - Does NOT modify strings inside quoted dialogue ("…" or 『…』).
 *   - Records every rewrite in privateOutlineWarnings.
 */

// ─── Sanitization Rule Table ─────────────────────────────────────────────────
//
// Each rule is:
//   { pattern: RegExp, replacement: string | ((match, ...groups) => string) }
//
// Rules are applied in order; earlier rules take priority.
// Replacements must be prose-safe Korean narrative instructions.

const SANITIZATION_RULES = [
  // 1. Timecode + action  "0.5초 침묵", "0.3초 페이드", "1초 블랙"
  {
    pattern: /\d+(\.\d+)?(초|s)\s*(침묵)/g,
    replacement: '짧은 침묵이 어색함을 드러낸다',
  },
  // 2. Standalone timecode "0.3초", "1.5s" (no following word)
  {
    pattern: /\d+(\.\d+)?(초|s)(?!\s*\S)/g,
    replacement: '잠깐의 정지',
  },
  // 3. Timecode before known storyboard word: "0.3초 페이드", "0.5초 컷"
  {
    pattern: /\d+(\.\d+)?(초|s)\s*(페이드\s*(인|아웃)?|컷|블랙)/g,
    replacement: '잠깐의 정지',
  },
  // 4. Rhythm beats
  {
    pattern: /한\s*박자\s*(후|뒤)?/g,
    replacement: '잠시 뒤',
  },
  {
    pattern: /반\s*박자\s*(후|뒤)?/g,
    replacement: '짧은 순간',
  },
  {
    pattern: /두\s*박자\s*(후|뒤)?/g,
    replacement: '잠시 후',
  },
  // 5. Production / storyboard camera terms
  {
    pattern: /화면\s*페이드/g,
    replacement: '장면이 천천히 흐려진다',
  },
  {
    pattern: /페이드\s*인/g,
    replacement: '장면이 서서히 밝아진다',
  },
  {
    pattern: /페이드\s*아웃/g,
    replacement: '장면이 서서히 어두워진다',
  },
  {
    pattern: /블랙\s*컷/g,
    replacement: '암전',
  },
  {
    pattern: /장면\s*전환/g,
    replacement: '다음 장면으로 이어진다',
  },
  // 6. Storyboard meta labels
  {
    pattern: /권말\s*컷/g,
    replacement: '마지막 장면',
  },
  {
    pattern: /첫\s*능청/g,
    replacement: '첫 시치미',
  },
  {
    pattern: /호흡\s*전환/g,
    replacement: '리듬의 변화',
  },
  {
    pattern: /정서\s*전환/g,
    replacement: '감정의 결이 바뀐다',
  },
  // 7. "메커닉" (story mechanic label)
  //    If used as analyst prefix "메커닉: …" drop the label+colon
  {
    pattern: /메커닉\s*:\s*/g,
    replacement: '',
  },
  //    Otherwise rewrite as 장치
  {
    pattern: /메커닉/g,
    replacement: '장치',
  },
  // 8. "노출" as information-reveal label (정보 노출, 감정 노출)
  {
    pattern: /노출\s*(장치|구간)?/g,
    replacement: '드러난다',
  },
  // 9. "비트" as storyboard beat label — drop as label, rewrite if meaningful
  //    Patterns like "비트 전환", "비트." — rewrite
  {
    pattern: /비트\s*전환/g,
    replacement: '리듬의 변화',
  },
  //    Isolated "비트" — drop (it's just a label)
  {
    pattern: /\s*비트\s*[.]?\s*/g,
    replacement: ' ',
  },
  // 10. Standalone "컷" in scene-direction context (preceded by space or punctuation)
  //     e.g. "→ 컷", ", 컷", ". 컷"
  {
    pattern: /(?<=[→,.\s])\s*컷(?=[.,\s]|$)/g,
    replacement: '장면을 바꾼다',
  },
];

// ─── Dialogue Guard ──────────────────────────────────────────────────────────
//
// Split text into alternating [outside-quote, inside-quote] segments.
// We only sanitize the outside-quote segments.

function splitByDialogue(text) {
  // Handles "…" (ASCII double quotes), "…" (Korean curly quotes), and 『…』 (corner brackets)
  const segments = [];
  const dialoguePattern = /"[^"]*"|“[^”]*”|『[^』]*』/g;
  let lastIndex = 0;
  let match;

  while ((match = dialoguePattern.exec(text)) !== null) {
    // Narration segment before the dialogue
    segments.push({ text: text.slice(lastIndex, match.index), isDialogue: false });
    // The dialogue segment itself
    segments.push({ text: match[0], isDialogue: true });
    lastIndex = match.index + match[0].length;
  }
  // Trailing narration
  segments.push({ text: text.slice(lastIndex), isDialogue: false });

  return segments;
}

// ─── Core Sanitizer ──────────────────────────────────────────────────────────

/**
 * Sanitize a single text string, returning:
 *   { sanitized: string, warnings: Array<{originalPhrase, location, replacement}> }
 *
 * @param {string} text - input (objective/conflict/etc.)
 * @param {string} location - human-readable label for where this text came from
 */
function sanitizeText(text, location) {
  if (!text || typeof text !== 'string') {
    return { sanitized: text ?? '', warnings: [] };
  }

  const warnings = [];

  // Split by dialogue to avoid sanitizing inside quotes
  const segments = splitByDialogue(text);

  const sanitizedSegments = segments.map((seg) => {
    if (seg.isDialogue) return seg.text; // leave dialogue intact

    let s = seg.text;
    for (const rule of SANITIZATION_RULES) {
      // Reset lastIndex for global regexes
      rule.pattern.lastIndex = 0;

      const matches = [...s.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags))];
      for (const m of matches) {
        const original = m[0];
        const rep =
          typeof rule.replacement === 'function'
            ? rule.replacement(...m)
            : rule.replacement;
        if (original !== rep) {
          warnings.push({
            originalPhrase: original.trim(),
            location,
            replacement: rep.trim(),
          });
        }
      }

      // Apply the replacement
      rule.pattern.lastIndex = 0;
      s = s.replace(new RegExp(rule.pattern.source, rule.pattern.flags), rule.replacement);
    }
    return s;
  });

  // Clean up excess whitespace introduced by blank replacements
  const sanitized = sanitizedSegments.join('').replace(/\s{2,}/g, ' ').trim();

  return { sanitized, warnings };
}

// ─── Brief Builder ───────────────────────────────────────────────────────────

/**
 * Build a writer-safe markdown brief from raw chapter JSON.
 *
 * @param {object} chapterJson - parsed chapter JSON (e.g. chapter_001.json)
 * @returns {{ brief: string, privateOutlineWarnings: Array }}
 */
export function buildWriterBrief(chapterJson) {
  const allWarnings = [];

  // Helper to sanitize and collect warnings
  function s(text, loc) {
    const { sanitized, warnings } = sanitizeText(text, loc);
    allWarnings.push(...warnings);
    return sanitized;
  }

  const lines = [];
  lines.push('## 작가용 브리프');
  lines.push('');

  // ── 회차 메타 ──────────────────────────────────────────────────────────────
  lines.push('### 회차 메타');
  lines.push('');
  lines.push(`- **제목**: ${chapterJson.chapter_title || '(제목 없음)'}`);
  lines.push(`- **POV**: ${chapterJson.meta?.pov_character || '(미정)'}`);
  lines.push(`- **목표 분량**: ${chapterJson.word_count_target ?? '(미정)'}자`);
  if (chapterJson.continuity) {
    lines.push(`- **연속성**: ${s(chapterJson.continuity, 'continuity')}`);
  }
  lines.push('');

  // ── 등장인물 (placeholder — codex-writer fills this) ─────────────────────
  lines.push('### 등장인물');
  lines.push('');
  // Intentionally left empty; codex-writer will inject resolved character profiles here.
  lines.push('');

  // ── 장소 ──────────────────────────────────────────────────────────────────
  lines.push('### 장소');
  lines.push('');
  const locations = [];
  if (Array.isArray(chapterJson.scenes)) {
    for (const scene of chapterJson.scenes) {
      if (scene.location && !locations.includes(scene.location)) {
        locations.push(scene.location);
      }
    }
  }
  if (locations.length > 0) {
    for (const loc of locations) {
      lines.push(`- ${loc}`);
    }
  } else {
    lines.push('- (장소 없음)');
  }
  lines.push('');

  // ── 장면별 목표 ────────────────────────────────────────────────────────────
  lines.push('### 장면별 목표');
  lines.push('');
  if (Array.isArray(chapterJson.scenes) && chapterJson.scenes.length > 0) {
    for (const scene of chapterJson.scenes) {
      const sceneLabel = `씬 ${scene.scene_number}${scene.title ? ` (${scene.title})` : ''}`;
      const objective = s(scene.objective || '', `${sceneLabel} - objective`);
      const conflict = s(scene.conflict || '', `${sceneLabel} - conflict`);

      lines.push(`- **${sceneLabel}**`);
      if (objective) lines.push(`  - 목표: ${objective}`);
      if (conflict) lines.push(`  - 갈등: ${conflict}`);
    }
  } else {
    lines.push('- (씬 없음)');
  }
  lines.push('');

  // ── 필수 스토리 팩트 ────────────────────────────────────────────────────────
  if (Array.isArray(chapterJson.required_facts) && chapterJson.required_facts.length > 0) {
    lines.push('### 필수 스토리 팩트');
    lines.push('');
    chapterJson.required_facts.forEach((fact, i) => {
      lines.push(`- ${s(fact, `required_facts[${i}]`)}`);
    });
    lines.push('');
  }

  // ── 정서적 호흡 ─────────────────────────────────────────────────────────────
  if (chapterJson.emotional_arc) {
    lines.push('### 정서적 호흡');
    lines.push('');
    if (typeof chapterJson.emotional_arc === 'string') {
      lines.push(s(chapterJson.emotional_arc, 'emotional_arc'));
    } else if (typeof chapterJson.emotional_arc === 'object' && chapterJson.emotional_arc !== null) {
      // Object with descriptive fields — sanitize each string-valued leaf
      for (const [key, val] of Object.entries(chapterJson.emotional_arc)) {
        if (typeof val === 'string') {
          lines.push(`- **${key}**: ${s(val, `emotional_arc.${key}`)}`);
        }
      }
    }
    lines.push('');
  }

  // ── 복선 / 훅 ──────────────────────────────────────────────────────────────
  const hasForeshadowing =
    Array.isArray(chapterJson.foreshadowing) && chapterJson.foreshadowing.length > 0;
  const hasHooks = Array.isArray(chapterJson.hooks) && chapterJson.hooks.length > 0;

  if (hasForeshadowing || hasHooks) {
    lines.push('### 복선 / 훅');
    lines.push('');
    if (hasForeshadowing) {
      const sanitizedForeshadowing = chapterJson.foreshadowing.map((item, i) =>
        s(item, `foreshadowing[${i}]`)
      );
      lines.push(`- **복선**: ${sanitizedForeshadowing.join(', ')}`);
    }
    if (hasHooks) {
      const sanitizedHooks = chapterJson.hooks.map((item, i) =>
        s(item, `hooks[${i}]`)
      );
      lines.push(`- **훅**: ${sanitizedHooks.join(', ')}`);
    }
    lines.push('');
  }

  // ── 사전 설계 주의 (fixed reminder) ─────────────────────────────────────────
  lines.push('### 사전 설계 주의');
  lines.push('');
  lines.push(
    '브리프는 사전 설계 자료이며, 메타/연출/분석 용어를 본문에 그대로 복사하지 말 것. ' +
    '위 \'장면별 목표\'의 지시문은 작가의 머릿속 가이드일 뿐, 본문은 자연스러운 한국어 산문이어야 한다.'
  );
  lines.push('');

  const brief = lines.join('\n');

  return { brief, privateOutlineWarnings: allWarnings };
}
