/**
 * write mode — 챕터 초고 집필
 *
 * Loads chapter context, builds system + user prompts via writer-brief-builder,
 * runs Codex CLI, passes result through quality gate, saves to chapters/chNNN.md.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { padChapter, assertDistBuilt, checkPrerequisites, runCodex } from '../codex-exec.mjs';
import {
  log, warn, error, colors,
  loadContext, buildSystemPrompt, buildWriteUserPrompt,
  runQualityGate, saveResult,
} from '../codex-writer-common.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GATE_SCRIPT = path.resolve(__dirname, '..', '..', 'quality-gate.mjs');

/**
 * @param {object} args — parsed CLI args
 * @param {number} args.chapter
 * @param {string} args.project
 * @param {string} args.model
 * @param {boolean} args.dryRun
 * @param {string} args.qualityMode
 */
export default async function runWrite(args) {
  const ctx = await loadContext(args.project, args.chapter);
  const charDisplay = ctx.characters.map(c => {
    if (c.resolvedCharacter) return `${c.resolvedCharacter.name || c.id}(${c.id})`;
    return c.id;
  }).join(', ') || 'none';
  log(`플롯 로드 완료. 등장인물: ${charDisplay}`);

  const systemPrompt = buildSystemPrompt(ctx);
  const userPrompt = buildWriteUserPrompt(ctx);

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

  // Determine output path
  const pad = padChapter(args.chapter);
  const chPath = path.join(args.project, `chapters/ch${pad}.md`);
  const chapterPath = path.join(args.project, `chapters/chapter_${pad}.md`);
  const outputPath = fs.existsSync(chPath) ? chPath : (fs.existsSync(chapterPath) ? chapterPath : chPath);

  const gateMode = args.qualityMode || 'strict';
  if (gateMode !== 'off') {
    runQualityGate({ result, outputPath, projectPath: args.project, chapterNum: args.chapter, gateMode, gateScript: GATE_SCRIPT });
  }

  saveResult(outputPath, result);

  // ADULT marker report
  const adultCount = (result.match(/<!-- ADULT_\d+_START -->/g) || []).length;
  if (adultCount > 0) {
    log(`ADULT 마커 ${adultCount}개 감지 → Pass 2(Grok)에서 리라이트됩니다.`);
  } else {
    log('ADULT 마커 없음 → Pass 2 건너뜁니다.');
  }
}
