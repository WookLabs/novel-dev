#!/usr/bin/env node

/**
 * Novel-Sisyphus Session Start Hook
 * 세션 시작 시 현재 소설 프로젝트 상태 로드
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { inspectRecoveryState, formatRecoveryMessage } from './session-recovery.mjs';
import { readStdinSafe, parseHookInput, isSubagentSession } from './lib/hook-utils.mjs';

function readJsonFile(path) {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

function formatRalphActiveNotice(isRalphActive, hasRecovery, recoveryState) {
  if (!isRalphActive) {
    return '';
  }
  if (!hasRecovery) {
    return '⚠️ **Ralph Loop가 활성 상태입니다.** 중단하려면 `/cancel-ralph`를 사용하세요.';
  }
  const preflightPassed =
    recoveryState?.designGate?.passed === true &&
    recoveryState.designGate.status === 'PASS' &&
    recoveryState?.styleGate?.passed === true &&
    recoveryState.styleGate.status === 'PASS' &&
    recoveryState?.summaryMemoryGate?.passed === true &&
    recoveryState.summaryMemoryGate.status === 'PASS';
  if (preflightPassed) {
    return '⚠️ **Ralph Loop가 활성 상태로 남아 있습니다.** 새 세션에서 이어가려면 `/write-all --resume`을 사용하세요.';
  }
  return '⚠️ **Ralph Loop가 활성 상태로 남아 있습니다.** 설계/문체/요약 메모리 게이트가 모두 PASS가 된 뒤 `/write-all --resume`으로 재개하세요.';
}

async function main() {
  try {
    const input = await readStdinSafe();
    const { data, directory } = parseHookInput(input);
    const novelsDir = join(directory, 'novels');

    // novels 폴더가 없으면 통과
    if (!existsSync(novelsDir)) {
      console.log(JSON.stringify({ decision: "approve" }));
      return;
    }

    // 프로젝트 목록 조회
    let projects = [];
    try {
      projects = readdirSync(novelsDir)
        .filter(f => existsSync(join(novelsDir, f, 'meta', 'project.json')));
    } catch {
      console.log(JSON.stringify({ decision: "approve" }));
      return;
    }

    if (projects.length === 0) {
      console.log(JSON.stringify({ decision: "approve" }));
      return;
    }

    // ✅ FIX #5: 가장 최근 프로젝트 찾기 - created_at 기준 정렬
    let latestProject = null;
    let latestTime = null;

    for (const proj of projects) {
      const projFile = join(novelsDir, proj, 'meta', 'project.json');
      const projData = readJsonFile(projFile);
      if (projData) {
        const createdAt = projData.created_at ? new Date(projData.created_at) : null;
        if (createdAt && (!latestTime || createdAt > latestTime)) {
          latestTime = createdAt;
          latestProject = proj;
        }
      }
    }

    // 타임스탬프 없으면 알파벳 정렬 폴백
    if (!latestProject) {
      projects.sort();
      latestProject = projects[projects.length - 1];
    }
    const projectJsonPath = join(novelsDir, latestProject, 'meta', 'project.json');
    const project = readJsonFile(projectJsonPath);

    if (!project) {
      console.log(JSON.stringify({ decision: "approve" }));
      return;
    }

    // 진행 상황 계산
    const chaptersDir = join(novelsDir, latestProject, 'chapters');
    let completedChapters = 0;
    if (existsSync(chaptersDir)) {
      try {
        // ✅ FIX: 제로패딩 및 대소문자 지원
        const chapterFiles = readdirSync(chaptersDir)
          .filter(f => f.match(/^chapter_\d{1,4}\.md$/i));
        completedChapters = chapterFiles.length;
      } catch {}
    }

    // Ralph Loop 상태 확인 - 프로젝트 경로 사용 (워크스페이스 경로 아님)
    const projectPath = join(novelsDir, latestProject);
    const recoveryInspection = await inspectRecoveryState(projectPath);
    const ralphState = recoveryInspection.state;
    const isRalphActive = ralphState?.ralph_active === true;

    // Session recovery check
    const recoveryState = recoveryInspection.recovery;
    const hasRecovery = recoveryState !== null;
    const recoveryWarning = recoveryInspection.warning
      ? `${recoveryInspection.warning}\n`
      : '';
    const ralphActiveNotice = formatRalphActiveNotice(
      isRalphActive,
      hasRecovery,
      recoveryState
    );

    // 상태 메시지 생성
    let statusIcon = '';
    switch (project.status) {
      case 'planning': statusIcon = '📝'; break;
      case 'writing': statusIcon = '✍️'; break;
      case 'editing': statusIcon = '📖'; break;
      case 'complete': statusIcon = '✅'; break;
      default: statusIcon = '📄';
    }

    const progressPercent = project.target_chapters > 0
      ? Math.round((completedChapters / project.target_chapters) * 100)
      : 0;

    // SOP 주입 (솔로 모드 + 프로젝트 존재 시)
    const sopBlock = !isSubagentSession(data) ? `
<novel-sop>

당신은 **소설 창작 오케스트레이터**입니다.

## 에이전트 위임 테이블

| 작업 | 에이전트 | 모델 |
|------|---------|------|
| 본문 집필 | novelist | opus |
| 퇴고/교정 | editor | opus |
| 품질 평가 | critic | opus |
| 플롯 설계 | plot-architect | opus |
| 세계관 관리 | lore-keeper | opus |
| 맞춤법 검사 | proofreader | haiku |
| 회차 요약 | summarizer | haiku |
| 품질 분석 | quality-oracle | opus |
| 문장 수술 | prose-surgeon | opus |

## 핵심 원칙
- 직접 소설 본문을 작성하지 마세요. novelist 에이전트에 위임하세요.
- 평가는 critic 에이전트에 위임하세요.
- 스킬 명령어를 사용하세요: /write, /evaluate, /revise 등

</novel-sop>
` : '';

    const message = `<novel-session>

${statusIcon} **현재 활성 프로젝트**: ${project.title} (\`${latestProject}\`)

| 항목 | 내용 |
|------|------|
| 장르 | ${Array.isArray(project.genre) ? project.genre.join(', ') : project.genre || '미정'} |
| 진행 | ${completedChapters}/${project.target_chapters}화 (${progressPercent}%) |
| 상태 | ${project.status || 'planning'} |
${isRalphActive ? `| Ralph Loop | 활성 (막 ${ralphState.current_act || 1}) |` : ''}

${recoveryWarning}
${ralphActiveNotice}
${hasRecovery ? formatRecoveryMessage(recoveryState) : ''}

사용 가능한 커맨드: \`/init\`, \`/design_*\`, \`/write\`, \`/write-all\`, \`/stats\`, \`/export\`

</novel-session>
${sopBlock}
---
`;

    console.log(JSON.stringify({ decision: "approve", message }));
  } catch (error) {
    // 에러 시 조용히 통과
    console.log(JSON.stringify({ decision: "approve" }));
  }
}

main();
