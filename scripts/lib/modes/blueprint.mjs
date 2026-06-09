/**
 * blueprint mode — 소설 기획서(BLUEPRINT.md) 생성
 *
 * Reads an idea/brainstorm file and project meta, generates a complete
 * BLUEPRINT.md covering logline, synopsis, 3-act outline, characters, genre, etc.
 */

import path from 'path';
import { checkPrerequisites, runCodex } from '../codex-exec.mjs';
import { log, error, readIfExists, saveResult } from '../codex-writer-common.mjs';

function buildBlueprintPrompt(projectPath) {
  const idea = readIfExists(path.join(projectPath, 'meta/idea.md'))
    || readIfExists(path.join(projectPath, 'meta/brainstorm.md'));
  const project = readIfExists(path.join(projectPath, 'meta/project.json'));

  let system = `# 역할: 소설 기획서 작성 AI\n\n`;
  system += `소설 아이디어를 받아 완전한 기획서(BLUEPRINT.md)를 생성합니다.\n`;
  system += `포함 항목: 로그라인, 시놉시스(500자+), 3막 구조 아웃라인,\n`;
  system += `주요 캐릭터 소개, 장르/톤, 타겟 독자, 차별화 포인트.\n\n`;
  system += `출력: 마크다운 형식의 BLUEPRINT.md 전문.\n`;

  let user = `# 기획서 작성 대상\n\n`;
  if (idea) user += `## 아이디어\n${idea}\n\n`;
  if (project) user += `## 프로젝트 메타\n\`\`\`json\n${project}\n\`\`\`\n\n`;
  user += `위 내용을 바탕으로 완전한 BLUEPRINT.md를 생성하세요.\n`;

  return { system, user };
}

/**
 * @param {object} args
 * @param {string} args.project
 * @param {string} args.model
 * @param {boolean} args.dryRun
 */
export default async function runBlueprint(args) {
  const { system: systemPrompt, user: userPrompt } = buildBlueprintPrompt(args.project);

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

  const outputPath = path.join(args.project, 'BLUEPRINT.md');
  saveResult(outputPath, result);
}
