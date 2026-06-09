#!/usr/bin/env node
/**
 * Codex Writer — Codex CLI(GPT-5.4)로 챕터 집필
 *
 * write-act-2pass --codex 파이프라인의 Pass 1 담당:
 *   Pass 1: 이 스크립트가 Codex CLI로 GPT-5.4 집필
 *   Pass 2: adult-rewriter.mjs가 Grok으로 성인 장면 리라이트
 *
 * Usage:
 *   node scripts/codex-writer.mjs --chapter 1 --project ./novels/my-novel
 *   node scripts/codex-writer.mjs --chapter 5 --project ./novels/my-novel --model gpt-5.4
 *   node scripts/codex-writer.mjs --chapter 1 --project ./novels/my-novel --dry-run
 *
 * Options:
 *   --chapter N        회차 번호 (필수)
 *   --project PATH     소설 프로젝트 경로 (필수)
 *   --model MODEL      GPT 모델 (기본: gpt-5.4)
 *   --mode MODE        write | revise | polish | design | gen-plot | blueprint
 *   --feedback PATH    퇴고 시 리뷰 피드백 JSON 경로
 *   --dry-run          프롬프트 생성만, Codex 호출 안 함
 *   --quality-mode M   strict(기본) | warn | off
 *   --help, -h         도움말
 *
 * Environment:
 *   Codex CLI가 자체적으로 인증을 처리합니다 (별도 API 키 불필요)
 */

import { colors, error, log } from './lib/codex-writer-common.mjs';
import runWrite from './lib/modes/write.mjs';
import runRevise from './lib/modes/revise.mjs';
import runPolish from './lib/modes/polish.mjs';
import runDesign from './lib/modes/design.mjs';
import runGenPlot from './lib/modes/gen-plot.mjs';
import runBlueprint from './lib/modes/blueprint.mjs';

// ─── Mode dispatch table ─────────────────────────────────────────────────────

const MODES = {
  write: runWrite,
  revise: runRevise,
  polish: runPolish,
  design: runDesign,
  'gen-plot': runGenPlot,
  blueprint: runBlueprint,
};

// ─── CLI Argument Parsing ─────────────────────────────────────────────────────

function parseArgs(argv) {
  const result = {
    chapter: null,
    project: null,
    model: 'gpt-5.4',
    mode: 'write',
    feedback: null,
    dryRun: false,
    qualityMode: 'strict',  // strict | warn | off
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--chapter' && argv[i + 1]) {
      result.chapter = parseInt(argv[++i], 10);
    } else if (arg === '--project' && argv[i + 1]) {
      result.project = argv[++i];
    } else if (arg === '--model' && argv[i + 1]) {
      result.model = argv[++i];
    } else if (arg === '--mode' && argv[i + 1]) {
      result.mode = argv[++i];
    } else if (arg === '--feedback' && argv[i + 1]) {
      result.feedback = argv[++i];
    } else if (arg === '--dry-run') {
      result.dryRun = true;
    } else if (arg === '--quality-mode' && argv[i + 1]) {
      result.qualityMode = argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return result;
}

function printHelp() {
  console.log(`
${colors.cyan}codex-writer.mjs${colors.reset} — Codex CLI(GPT-5.4)로 챕터 집필

${colors.yellow}Usage:${colors.reset}
  node scripts/codex-writer.mjs --chapter N --project PATH

${colors.yellow}Options:${colors.reset}
  --chapter N             회차 번호 (필수)
  --project PATH          소설 프로젝트 경로 (필수)
  --model MODEL           GPT 모델 (기본: gpt-5.4)
  --mode MODE             write(초고, 기본) | revise(퇴고) | polish | design | gen-plot | blueprint
  --feedback PATH         퇴고 시 리뷰 피드백 JSON 경로
  --dry-run               프롬프트 생성만, Codex 호출 안 함
  --quality-mode MODE     strict(기본) | warn | off  — 품질 게이트 모드
                          strict: 실패 시 최종본 덮어쓰기 안 함, exit 1
                          warn: 경고만 출력, exit 0
                          off: 게이트 건너뜀
  --help, -h              도움말

${colors.yellow}Environment:${colors.reset}
  Codex CLI가 자체적으로 인증 처리 (별도 API 키 불필요)
`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.project) { error('--project PATH 필수'); process.exit(1); }

  const CHAPTER_MODES = ['write', 'revise', 'polish'];
  if (CHAPTER_MODES.includes(args.mode) && !args.chapter) {
    error(`--chapter N 필수 (mode: ${args.mode})`); process.exit(1);
  }

  const modeLabels = {
    write: '집필', revise: '퇴고', design: '설계',
    'gen-plot': '플롯 생성', blueprint: '기획서 생성', polish: '산문 폴리시',
  };
  log(`${modeLabels[args.mode] || args.mode} 시작 (model: ${args.model}, mode: ${args.mode})`);

  const handler = MODES[args.mode];
  if (!handler) {
    error(`Unknown mode: ${args.mode}`);
    process.exit(2);
  }

  await handler(args);
}

main().catch(e => {
  error(e.message);
  process.exit(1);
});
