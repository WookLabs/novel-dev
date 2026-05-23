/**
 * gen-plot mode — 회차별 상세 플롯 JSON 생성
 *
 * Reads novel structure + arcs + timeline + character index + previous summaries,
 * generates a chapter_NNN.json for the specified chapter number.
 */

import fs from 'fs';
import path from 'path';
import { padChapter, checkPrerequisites, runCodex } from '../codex-exec.mjs';
import { log, error, readIfExists, saveResult } from '../codex-writer-common.mjs';

function buildGenPlotPrompt(projectPath, chapterNum, prevSummaries) {
  const mainArc = readIfExists(path.join(projectPath, 'plot/main-arc.json'));
  const subArcs = readIfExists(path.join(projectPath, 'plot/sub-arcs.json'));
  const foreshadowing = readIfExists(path.join(projectPath, 'plot/foreshadowing.json'));
  const hooks = readIfExists(path.join(projectPath, 'plot/hooks.json'));
  const timeline = readIfExists(path.join(projectPath, 'plot/timeline.json'));
  const structure = readIfExists(path.join(projectPath, 'plot/structure.json'));
  const styleGuide = readIfExists(path.join(projectPath, 'meta/style-guide.json'));
  const charIndex = readIfExists(path.join(projectPath, 'characters/index.json'));

  let system = `# 역할: 소설 플롯 설계 AI\n\n`;
  system += `회차별 상세 플롯 JSON을 생성합니다.\n`;
  system += `각 회차에 포함할 내용: 제목, 목표 분량, 현재 플롯(1500자+), 다음화 예고(500자),\n`;
  system += `POV 캐릭터, 등장인물, 장소, 복선 plant/payoff, 훅, 감정 목표, 2-4개 씬.\n\n`;
  system += `## 출력 형식\n`;
  system += `chapter_${padChapter(chapterNum)}.json 형식의 JSON 하나를 출력하세요.\n`;

  let user = `# 플롯 생성 대상: Chapter ${chapterNum}\n\n`;
  if (structure) user += `## 구조\n\`\`\`json\n${structure}\n\`\`\`\n\n`;
  if (mainArc) user += `## 메인 아크\n\`\`\`json\n${mainArc}\n\`\`\`\n\n`;
  if (subArcs) user += `## 서브 아크\n\`\`\`json\n${subArcs}\n\`\`\`\n\n`;
  if (foreshadowing) user += `## 복선\n\`\`\`json\n${foreshadowing}\n\`\`\`\n\n`;
  if (hooks) user += `## 훅\n\`\`\`json\n${hooks}\n\`\`\`\n\n`;
  if (timeline) user += `## 타임라인\n\`\`\`json\n${timeline}\n\`\`\`\n\n`;
  if (styleGuide) user += `## 스타일 가이드\n\`\`\`json\n${styleGuide}\n\`\`\`\n\n`;
  if (charIndex) user += `## 캐릭터\n\`\`\`json\n${charIndex}\n\`\`\`\n\n`;
  if (prevSummaries && prevSummaries.length > 0) {
    user += `## 이전 회차 요약\n\n`;
    prevSummaries.forEach((s, i) => { user += `### 이전 ${prevSummaries.length - i}화 전\n${s}\n\n`; });
  }
  user += `Chapter ${chapterNum}의 상세 플롯 JSON을 생성하세요.\n`;

  return { system, user };
}

/**
 * @param {object} args
 * @param {number} args.chapter
 * @param {string} args.project
 * @param {string} args.model
 * @param {boolean} args.dryRun
 */
export default async function runGenPlot(args) {
  if (!args.chapter) {
    console.error('\x1b[31m[ERROR]\x1b[0m --chapter N 필수 (gen-plot)');
    process.exit(1);
  }

  // Load previous summaries
  const summaries = [];
  for (let i = Math.max(1, args.chapter - 3); i < args.chapter; i++) {
    const s = readIfExists(path.join(args.project, `context/summaries/chapter_${padChapter(i)}_summary.md`));
    if (s) summaries.push(s);
  }

  const { system: systemPrompt, user: userPrompt } = buildGenPlotPrompt(args.project, args.chapter, summaries);

  log(`시스템 프롬프트: ${systemPrompt.length}자, 유저 프롬프트: ${userPrompt.length}자`);

  if (args.dryRun) {
    log('--dry-run 모드. Codex 호출 건너뜀.');
    console.log('=== SYSTEM PROMPT ===\n');
    console.log(systemPrompt);
    console.log('\n=== USER PROMPT ===\n');
    console.log(userPrompt);
    return;
  }

  checkPrerequisites();

  const result = runCodex(systemPrompt, userPrompt, args.model);

  if (!result || result.trim().length === 0) {
    error('Codex CLI가 빈 결과를 반환했습니다. 파일을 변경하지 않습니다.');
    process.exit(1);
  }

  const pad = padChapter(args.chapter);
  const chJson = path.join(args.project, `chapters/ch${pad}.json`);
  const chapterJson = path.join(args.project, `chapters/chapter_${pad}.json`);
  const outputPath = fs.existsSync(chJson) ? chJson : (fs.existsSync(chapterJson) ? chapterJson : chJson);

  saveResult(outputPath, result);
}
