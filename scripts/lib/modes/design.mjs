/**
 * design mode — 5관점 통합 소설 설계
 *
 * Reads BLUEPRINT.md + project meta + structure, generates a full design JSON
 * covering style, world, characters, relationships, timeline, arcs, foreshadowing, hooks.
 */

import fs from 'fs';
import path from 'path';
import { checkPrerequisites, runCodex } from '../codex-exec.mjs';
import { log, error, readIfExists, saveResult } from '../codex-writer-common.mjs';

function buildDesignPrompt(projectPath) {
  const blueprint = readIfExists(path.join(projectPath, 'BLUEPRINT.md'));
  if (!blueprint) throw new Error('BLUEPRINT.md not found in project');
  const project = readIfExists(path.join(projectPath, 'meta/project.json'));
  const structure = readIfExists(path.join(projectPath, 'plot/structure.json'));

  let system = `# 역할: 소설 설계 AI (5관점 통합)\n\n`;
  system += `당신은 5명의 설계 에이전트 관점을 모두 갖춘 통합 설계자입니다.\n`;
  system += `1. style-curator (문체, 톤, POV, 금기어)\n`;
  system += `2. lore-keeper (세계관, 마법 체계, 지리, 용어)\n`;
  system += `3. character-designer (캐릭터 프로필, 관계, 성장 아크)\n`;
  system += `4. plot-architect (3막 구조, 타임라인, 메인 아크)\n`;
  system += `5. arc-designer (서브 아크, 복선, 훅)\n\n`;
  system += `## 출력 형식\n`;
  system += `JSON 객체 하나를 출력하세요. 구조:\n`;
  system += `{\n  "style_guide": { ... },\n  "world": { ... },\n  "characters": [ ... ],\n`;
  system += `  "relationships": [ ... ],\n  "timeline": [ ... ],\n  "main_arc": { ... },\n`;
  system += `  "sub_arcs": [ ... ],\n  "foreshadowing": [ ... ],\n  "hooks": [ ... ]\n}\n`;

  let user = `# 설계 대상\n\n## 기획서\n${blueprint}\n\n`;
  if (project) user += `## 프로젝트 메타\n\`\`\`json\n${project}\n\`\`\`\n\n`;
  if (structure) user += `## 구조\n\`\`\`json\n${structure}\n\`\`\`\n\n`;
  user += `위 기획서를 바탕으로 완전한 설계 JSON을 생성하세요.\n`;

  return { system, user };
}

/**
 * @param {object} args
 * @param {string} args.project
 * @param {string} args.model
 * @param {boolean} args.dryRun
 */
export default async function runDesign(args) {
  const { system: systemPrompt, user: userPrompt } = buildDesignPrompt(args.project);

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

  const outputPath = path.join(args.project, 'meta/design-codex-output.json');
  saveResult(outputPath, result);
}
