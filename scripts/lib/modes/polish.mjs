/**
 * polish mode — 챕터 산문 폴리시
 *
 * Enhances prose quality of an existing chapter: improves narration/description/transitions
 * while preserving dialogue, plot, and character actions exactly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { padChapter, assertDistBuilt, checkPrerequisites, runCodex } from '../codex-exec.mjs';
import {
  log, error, readIfExists,
  runQualityGate, saveResult,
} from '../codex-writer-common.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GATE_SCRIPT = path.resolve(__dirname, '..', '..', 'quality-gate.mjs');

function buildPolishPrompt(projectPath, chapterNum) {
  const pad3 = padChapter(chapterNum);
  const manuscript = readIfExists(path.join(projectPath, `chapters/ch${pad3}.md`))
    || readIfExists(path.join(projectPath, `chapters/chapter_${pad3}.md`));
  if (!manuscript) throw new Error(`Chapter ${chapterNum} manuscript not found`);

  const styleGuide = readIfExists(path.join(projectPath, 'meta/style-guide.json'));

  let system = `# 역할: 한국어 소설의 문학적 폴리셔\n\n`;
  system += `기능적 서술을 몰입적 산문으로 향상시킵니다.\n`;
  system += `플롯, 대화, 사건은 유지하고 서술/묘사/전환만 문학적으로 업그레이드합니다.\n\n`;

  system += `# 절대 규칙\n\n`;
  system += `1. 대화("큰따옴표" 안)는 한 글자도 수정하지 마세요.\n`;
  system += `2. 플롯, 사건, 캐릭터 행동, 시간 순서를 변경하지 마세요.\n`;
  system += `3. 문체 연속성: 원본의 시점, 시제, 톤을 유지하세요.\n`;
  system += `4. 단문 나열 금지: "~했다. ~했다." → 복문으로 전환.\n`;
  system += `5. 필터 워드 제거: 느꼈다, 보였다, 생각했다 → 신체 반응/직접 묘사.\n`;
  system += `6. 건조한 전환 제거: "그날 저녁.", "밤이 됐다." → 감각 앵커.\n\n`;

  system += `# BAD vs GOOD\n\n`;
  system += `BAD: 손끝에서 감각이 왔다. 반응이 잡혔다. 그날 저녁.\n`;
  system += `GOOD: 손끝이 유리 표면을 따라 미끄러지는 순간, 내부에서 흰빛 진동이 올라왔다. 창 밖의 빛이 주홍에서 남색으로 바뀌었을 때.\n\n`;

  if (styleGuide) {
    system += `# 스타일 가이드\n\`\`\`json\n${styleGuide}\n\`\`\`\n\n`;
  }

  system += `출력: 폴리시된 챕터 전체 (마크다운). ADULT 마커가 있으면 그대로 보존.\n`;

  let user = `# 폴리시 대상: Chapter ${chapterNum}\n\n${manuscript}\n\n`;
  user += `위 원고의 서술/묘사/전환을 문학적으로 향상시키세요. 대화는 보존.\n`;

  return { system, user };
}

/**
 * @param {object} args
 * @param {number} args.chapter
 * @param {string} args.project
 * @param {string} args.model
 * @param {boolean} args.dryRun
 * @param {string} args.qualityMode
 */
export default async function runPolish(args) {
  const { system: systemPrompt, user: userPrompt } = buildPolishPrompt(args.project, args.chapter);

  log(`시스템 프롬프트: ${systemPrompt.length}자, 유저 프롬프트: ${userPrompt.length}자`);

  if (args.dryRun) {
    log('--dry-run 모드. Codex 호출 건너뜀.');
    console.log('=== SYSTEM PROMPT ===\n');
    console.log(systemPrompt);
    console.log('\n=== USER PROMPT ===\n');
    console.log(userPrompt);
    return;
  }

  assertDistBuilt();
  checkPrerequisites();

  const result = runCodex(systemPrompt, userPrompt, args.model);

  if (!result || result.trim().length === 0) {
    error('Codex CLI가 빈 결과를 반환했습니다. 파일을 변경하지 않습니다.');
    process.exit(1);
  }

  const pad = padChapter(args.chapter);
  const chPath = path.join(args.project, `chapters/ch${pad}.md`);
  const chapterPath = path.join(args.project, `chapters/chapter_${pad}.md`);
  const outputPath = fs.existsSync(chPath) ? chPath : (fs.existsSync(chapterPath) ? chapterPath : chPath);

  const gateMode = args.qualityMode || 'strict';
  if (gateMode !== 'off') {
    runQualityGate({ result, outputPath, projectPath: args.project, chapterNum: args.chapter, gateMode, gateScript: GATE_SCRIPT });
  }

  saveResult(outputPath, result);
}

// Export the local helper for test accessibility
export { buildPolishPrompt };
