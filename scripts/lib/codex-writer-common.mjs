/**
 * codex-writer-common.mjs — Shared helpers for codex-writer mode modules
 *
 * Contains: logging helpers, file reading, chapter context loading,
 * system/user prompt assembly, and quality-gate orchestration.
 * All business-logic helpers shared across two or more mode modules live here.
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { extractChapterCast } from './chapter-cast.mjs';
import { resolveCharacters } from './character-resolver.mjs';
import { buildWriterBrief } from './writer-brief-builder.mjs';
import { PLUGIN_ROOT, padChapter } from './codex-exec.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Colors ─────────────────────────────────────────────────────────────────

export const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  reset: '\x1b[0m',
};

// ─── Logging ─────────────────────────────────────────────────────────────────

export function log(msg) { console.error(`${colors.blue}[codex-writer]${colors.reset} ${msg}`); }
export function warn(msg) { console.error(`${colors.yellow}[WARN]${colors.reset} ${msg}`); }
export function error(msg) { console.error(`${colors.red}[ERROR]${colors.reset} ${msg}`); }

// ─── File I/O ────────────────────────────────────────────────────────────────

/** Read a file if it exists; return null otherwise (never throws). */
export function readIfExists(filePath) {
  try { return fs.readFileSync(filePath, 'utf-8'); } catch { return null; }
}

// ─── Chapter Context ─────────────────────────────────────────────────────────

/**
 * Load all context needed for write/revise/polish modes.
 * Throws on missing chapter JSON or parse errors.
 *
 * @param {string} projectPath
 * @param {number} chapterNum
 * @returns {Promise<object>} ctx object
 */
export async function loadContext(projectPath, chapterNum) {
  const pad = padChapter(chapterNum);

  const chapterPlot = readIfExists(path.join(projectPath, `chapters/chapter_${pad}.json`));
  if (!chapterPlot) throw new Error(`chapters/chapter_${pad}.json not found in ${projectPath}`);

  const styleGuide = readIfExists(path.join(projectPath, 'meta/style-guide.json'));
  const project = readIfExists(path.join(projectPath, 'meta/project.json'));

  // Load up to 3 previous summaries
  const summaries = [];
  for (let i = Math.max(1, chapterNum - 3); i < chapterNum; i++) {
    const s = readIfExists(path.join(projectPath, `context/summaries/chapter_${padChapter(i)}_summary.md`));
    if (s) summaries.push(s);
  }

  // Parse chapter JSON (throws with path context on failure)
  let plotData;
  try {
    plotData = JSON.parse(chapterPlot);
  } catch (e) {
    throw new Error(`Failed to parse chapter JSON at ${path.join(projectPath, `chapters/chapter_${pad}.json`)}: ${e.message}`);
  }

  // Resolve character cast
  const castIds = extractChapterCast(plotData);
  const { resolved: resolvedChars, missing: missingChars } = await resolveCharacters(projectPath, castIds);

  for (const missingId of missingChars) {
    warn(`캐릭터를 찾을 수 없습니다 (건너뜀): ${missingId}`);
  }

  const characters = [];
  for (const { requestedId, character } of resolvedChars) {
    const charId = character.id || requestedId;
    const charName = character.name;

    const agentMdById = readIfExists(path.join(PLUGIN_ROOT, `agents/characters/${charId}.md`));
    const nameStem = charName ? charName.replace(/\s+/g, '-') : null;
    const agentMdByName = nameStem
      ? readIfExists(path.join(PLUGIN_ROOT, `agents/characters/${nameStem}.md`))
      : null;
    const agentMd = agentMdById || agentMdByName;

    if (agentMd) {
      characters.push({ id: charId, agentContent: agentMd });
    } else {
      characters.push({ id: charId, resolvedCharacter: character });
    }
  }

  return { chapterPlot, styleGuide, project, summaries, characters, plotData, chapterNum, projectPath };
}

// ─── System Prompt ───────────────────────────────────────────────────────────

/**
 * Build the system prompt for write/revise modes.
 * @param {object} ctx  — result of loadContext()
 * @returns {string}
 */
export function buildSystemPrompt(ctx) {
  const novelistMd = readIfExists(path.join(PLUGIN_ROOT, 'agents/novelist.md'));
  if (!novelistMd) throw new Error('agents/novelist.md not found');

  let prompt = `# 역할: 한국어 소설 집필 AI\n\n`;
  prompt += `아래 규칙을 모두 준수하여 챕터를 집필하세요.\n\n`;

  const constraintsMatch = novelistMd.match(/<Critical_Constraints>([\s\S]*?)<\/Critical_Constraints>/);
  if (constraintsMatch) {
    prompt += `## 집필 규칙\n\n${constraintsMatch[1].trim()}\n\n`;
  }

  if (ctx.styleGuide) {
    prompt += `## 스타일 가이드\n\n\`\`\`json\n${ctx.styleGuide}\n\`\`\`\n\n`;
  }

  if (ctx.characters.length > 0) {
    const charNames = ctx.characters.map(c => {
      if (c.resolvedCharacter) return c.resolvedCharacter.name || c.id;
      return c.id;
    });
    prompt += `## 등장인물 보이스 프로필\n\n`;
    prompt += `등장인물: ${charNames.join(', ')}\n\n`;
    for (const char of ctx.characters) {
      if (char.agentContent) {
        prompt += `### ${char.id}\n${char.agentContent}\n\n`;
      } else if (char.resolvedCharacter) {
        const c = char.resolvedCharacter;
        prompt += `### ${c.name || char.id}\n`;
        prompt += `- **id**: ${c.id || char.id}\n`;
        prompt += `- **role**: ${c.role || '(unknown)'}\n`;
        if (Array.isArray(c.aliases) && c.aliases.length > 0) {
          prompt += `- **aliases**: ${c.aliases.join(', ')}\n`;
        }
        if (c.notes) {
          prompt += `- **notes**: ${c.notes}\n`;
        } else if (c.inner?.want) {
          prompt += `- **want**: ${c.inner.want}\n`;
        }
        if (c.basic?.voice?.tone) {
          prompt += `- **voice**: ${c.basic.voice.tone}\n`;
        }
        prompt += `\n`;
      }
    }
  }

  prompt += `## ADULT 마커 규칙\n\n`;
  prompt += `성인 장면(정사, 신체 접촉, 관능적 묘사)을 작성할 때는\n`;
  prompt += `<!-- ADULT_N_START --> 와 <!-- ADULT_N_END --> 마커로 감싸세요. (N은 1부터 순번)\n`;
  prompt += `마커 안에서는 행위, 신체 부위, 감정 반응을 구체적으로 서술하세요.\n`;
  prompt += `마커 밖의 일반 장면은 평소대로 작성하세요.\n\n`;

  return prompt;
}

// ─── User Prompt ─────────────────────────────────────────────────────────────

/**
 * Build the user prompt for write mode (uses writer-brief-builder).
 * @param {object} ctx
 * @returns {string}
 */
export function buildWriteUserPrompt(ctx) {
  const { brief, privateOutlineWarnings } = buildWriterBrief(ctx.plotData);

  // Build character section
  let characterSection = '';
  if (ctx.characters.length > 0) {
    const charLines = [];
    for (const char of ctx.characters) {
      if (char.agentContent) {
        charLines.push(`#### ${char.id}\n${char.agentContent}`);
      } else if (char.resolvedCharacter) {
        const c = char.resolvedCharacter;
        const parts = [`#### ${c.name || char.id}`];
        if (c.role) parts.push(`- **역할**: ${c.role}`);
        if (Array.isArray(c.aliases) && c.aliases.length > 0) {
          parts.push(`- **별칭**: ${c.aliases.join(', ')}`);
        }
        if (c.notes) parts.push(`- **노트**: ${c.notes}`);
        else if (c.inner?.want) parts.push(`- **욕구**: ${c.inner.want}`);
        if (c.basic?.voice?.tone) parts.push(`- **보이스**: ${c.basic.voice.tone}`);
        charLines.push(parts.join('\n'));
      }
    }
    characterSection = charLines.join('\n\n');
  }

  // Inject character profiles after the ### 등장인물 heading
  let enrichedBrief = brief;
  if (characterSection) {
    enrichedBrief = brief.replace(
      /### 등장인물\n+/,
      `### 등장인물\n\n${characterSection}\n\n`
    );
  }

  if (privateOutlineWarnings.length > 0) {
    warn(`플롯 브리프 변환: ${privateOutlineWarnings.length}개 스토리보드 표현을 산문 지시문으로 교체함`);
  }

  let prompt = `# 집필 대상\n\n`;
  prompt += enrichedBrief;
  prompt += `\n\n`;

  if (ctx.summaries.length > 0) {
    prompt += `## 이전 회차 요약\n\n`;
    ctx.summaries.forEach((s, i) => {
      prompt += `### 이전 ${ctx.summaries.length - i}화 전\n${s}\n\n`;
    });
  }

  prompt += `위 브리프에 따라 완전한 챕터를 집필하세요. 목표 분량: 5000~8000자.\n`;
  prompt += `브리프는 사전 설계 자료이며, 메타/연출/분석 용어를 본문에 복사하지 말 것.\n`;
  prompt += `출력은 마크다운 형식으로, 본문만 출력하세요 (메타 코멘트 없음).\n`;

  return prompt;
}

/**
 * Build the user prompt for revise mode.
 * @param {object} ctx
 * @param {string|null} feedbackContent
 * @returns {string}
 */
export function buildReviseUserPrompt(ctx, feedbackContent) {
  const pad3 = padChapter(ctx.chapterNum);
  const manuscript = readIfExists(path.join(ctx.projectPath, `chapters/ch${pad3}.md`))
    || readIfExists(path.join(ctx.projectPath, `chapters/chapter_${pad3}.md`));

  let prompt = `# 퇴고 대상\n\n`;
  prompt += `## 원고\n${manuscript || '(원고 없음)'}\n\n`;
  prompt += `## 플롯\n\`\`\`json\n${ctx.chapterPlot}\n\`\`\`\n\n`;

  if (feedbackContent) {
    prompt += `## 리뷰 피드백\n\`\`\`json\n${feedbackContent}\n\`\`\`\n\n`;
  }

  prompt += `위 피드백을 반영하여 원고를 퇴고하세요.\n`;
  prompt += `- 피드백에서 지적한 문제를 우선 수정\n`;
  prompt += `- 캐릭터 보이스 일관성 유지\n`;
  prompt += `- 기존 분량 유지 (±10%)\n`;
  prompt += `- ADULT 마커가 있으면 그대로 유지\n`;
  prompt += `출력은 마크다운 형식으로, 수정된 본문 전체를 출력하세요.\n`;

  return prompt;
}

// ─── Quality Gate ─────────────────────────────────────────────────────────────

/**
 * Run the quality gate subprocess and handle its exit code.
 *
 * Writes result to a temp file, runs gate, cleans up temp file.
 * In strict mode, a non-zero gate exit causes process.exit(1).
 *
 * @param {object} opts
 * @param {string} opts.result       — generated chapter text
 * @param {string} opts.outputPath   — final destination path
 * @param {string} opts.projectPath
 * @param {number} opts.chapterNum
 * @param {string} opts.gateMode     — 'strict' | 'warn' | 'off'
 * @param {string} opts.gateScript   — absolute path to quality-gate.mjs
 */
export function runQualityGate({ result, outputPath, projectPath, chapterNum, gateMode, gateScript }) {
  const tmpInputPath = outputPath + '.gate-tmp.md';
  fs.writeFileSync(tmpInputPath, result, 'utf-8');

  const gateArgs = [
    gateScript,
    '--input', tmpInputPath,
    '--project', projectPath,
    '--chapter', String(chapterNum),
    '--mode', gateMode,
    '--final-path', outputPath,
  ];

  log(`품질 게이트 실행 중 (mode: ${gateMode})...`);
  const gateResult = spawnSync('node', gateArgs, { encoding: 'utf-8' });

  try { fs.unlinkSync(tmpInputPath); } catch { /* ignore */ }

  if (gateResult.stdout) process.stdout.write(gateResult.stdout);
  if (gateResult.stderr) process.stderr.write(gateResult.stderr);

  if (gateMode === 'strict' && gateResult.status !== 0) {
    error('품질 게이트 STRICT 실패 — 최종본을 덮어쓰지 않습니다.');
    error('draft 파일이 저장되었습니다. 원고를 수정 후 다시 실행하세요.');
    process.exit(1);
  }
}

/**
 * Save the generated result to disk (with backup).
 * @param {string} outputPath
 * @param {string} result
 */
export function saveResult(outputPath, result) {
  if (fs.existsSync(outputPath)) {
    const bakPath = outputPath + '.bak';
    fs.copyFileSync(outputPath, bakPath);
    log(`기존 파일 백업: ${bakPath}`);
  }
  fs.writeFileSync(outputPath, result, 'utf-8');
  log(`${colors.green}완료!${colors.reset} ${outputPath} (${result.length}자)`);
}
