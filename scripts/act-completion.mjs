#!/usr/bin/env node

/**
 * Novel-Sisyphus Act Completion Hook
 * Stop 이벤트에서 Ralph Loop 지속 및 막 완료 확인
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { findStateFile, readState, writeState } from './lib/state-utils.mjs';
import { saveCheckpoint, markChapterComplete } from './checkpoint.mjs';
import { updateNotepad } from './notepad-manager.mjs';
import { readStdinSafe } from './lib/hook-utils.mjs';

function readJsonFile(path) {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

function writeJsonFile(path, data) {
  try {
    const dir = join(path, '..');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(path, JSON.stringify(data, null, 2));
    return true;
  } catch {
    return false;
  }
}

/**
 * ✅ FIX: transcript_path에서 어시스턴트의 마지막 메시지 추출
 * Stop 훅은 data.message를 제공하지 않으므로 transcript 파일을 직접 읽어야 함
 */
function getLastAssistantMessage(transcriptPath) {
  try {
    if (!transcriptPath || !existsSync(transcriptPath)) return '';

    const content = readFileSync(transcriptPath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);

    // JSONL 파일을 역순으로 탐색하여 마지막 assistant 메시지 찾기
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const entry = JSON.parse(lines[i]);
        if (entry.role === 'assistant') {
          // content가 문자열인 경우
          if (typeof entry.content === 'string') {
            return entry.content;
          }
          // content가 배열인 경우 (multipart message)
          if (Array.isArray(entry.content)) {
            return entry.content
              .filter(part => part.type === 'text')
              .map(part => part.text)
              .join(' ');
          }
        }
      } catch {
        // 파싱 실패한 줄은 건너뛰기
        continue;
      }
    }
    return '';
  } catch {
    return '';
  }
}

function toPositiveInteger(value) {
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function normalizeChapterList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(toPositiveInteger)
    .filter(number => number !== null);
}

function parseActRangeValue(range) {
  if (Array.isArray(range) && range.length >= 2) {
    const start = toPositiveInteger(range[0]);
    const end = toPositiveInteger(range[1]);
    return start !== null && end !== null && start <= end ? { start, end } : null;
  }

  if (Array.isArray(range) && range.length === 1) {
    const chapter = toPositiveInteger(range[0]);
    return chapter !== null ? { start: chapter, end: chapter } : null;
  }

  if (range && typeof range === 'object') {
    if (Array.isArray(range.chapters)) {
      return parseActRangeValue(range.chapters);
    }

    if (range.chapters && typeof range.chapters === 'object') {
      return parseActRangeValue(range.chapters);
    }

    const start = toPositiveInteger(range.start ?? range.from);
    const end = toPositiveInteger(range.end ?? range.to);
    return start !== null && end !== null && start <= end ? { start, end } : null;
  }

  return null;
}

function parseExplicitActRange(state, actNumber) {
  const ranges = state.act_chapter_ranges || state.act_ranges;
  if (!Array.isArray(ranges)) return null;

  return parseActRangeValue(ranges[actNumber - 1]);
}

function parsePlotStructureActRange(projectPath, actNumber) {
  if (!projectPath) return null;

  const structure = readJsonFile(join(projectPath, 'plot', 'structure.json'));
  if (!structure || !Array.isArray(structure.acts)) return null;

  const act = structure.acts.find(entry => (
    toPositiveInteger(entry?.act_number ?? entry?.number ?? entry?.act) === actNumber
  )) || structure.acts[actNumber - 1];

  return parseActRangeValue(act);
}

function getActChapterRange(state, actNumber, projectPath = null) {
  const plotRange = parsePlotStructureActRange(projectPath, actNumber);
  if (plotRange) return plotRange;

  const explicitRange = parseExplicitActRange(state, actNumber);
  if (explicitRange) return explicitRange;

  const totalChapters = toPositiveInteger(state.total_chapters);
  const totalActs = toPositiveInteger(state.total_acts);
  if (totalChapters === null || totalActs === null || actNumber < 1 || actNumber > totalActs) {
    return null;
  }

  const start = Math.floor(((actNumber - 1) * totalChapters) / totalActs) + 1;
  const end = Math.floor((actNumber * totalChapters) / totalActs);
  return start <= end ? { start, end } : null;
}

function chapterRange(start, end) {
  const chapters = [];
  for (let chapter = start; chapter <= end; chapter += 1) {
    chapters.push(chapter);
  }
  return chapters;
}

function formatMissingChapters(missing) {
  const preview = missing.slice(0, 10).join(', ');
  if (missing.length <= 10) return preview;
  return `${preview}, ... (${missing.length} total)`;
}

function completionGateBlockReason(state) {
  if (state.requires_user_intervention === true) {
    const pauseReason = state.pause_reason || 'manual review required';
    return `user intervention required before completion promise can update Ralph state. Reason: ${pauseReason}`;
  }

  const failedChapters = Array.isArray(state.failed_chapters) ? state.failed_chapters : [];
  if (failedChapters.length > 0) {
    const gateStatus = state.last_gate?.status || 'unknown';
    return `chapter gate has failed chapters still open: ${failedChapters.join(', ')}. Latest gate status: ${gateStatus}`;
  }

  const lastGate = state.last_gate;
  if (!lastGate || typeof lastGate !== 'object') {
    return 'chapter gate missing. Run apply-chapter-gate before emitting completion promise.';
  }

  if (lastGate.status !== 'PASS' || lastGate.passed !== true) {
    return `chapter gate is not PASS. chapter=${lastGate.chapter || 'unknown'}, status=${lastGate.status}, score=${lastGate.score}`;
  }

  return null;
}

function actCompletenessBlockReason(actNumber, state, projectPath) {
  const range = getActChapterRange(state, actNumber, projectPath);
  if (!range) return null;

  const completed = new Set(normalizeChapterList(state.completed_chapters));
  const missing = chapterRange(range.start, range.end).filter(chapter => !completed.has(chapter));
  if (missing.length > 0) {
    return `act ${actNumber} incomplete: chapters ${range.start}-${range.end} require PASS gates before ACT_${actNumber}_DONE. Missing completed chapters: ${formatMissingChapters(missing)}`;
  }

  const lastGateChapter = toPositiveInteger(state.last_gate?.chapter);
  if (lastGateChapter === null || lastGateChapter < range.end) {
    return `act ${actNumber} incomplete: latest PASS gate must cover chapter ${range.end}, but latest gate chapter is ${state.last_gate?.chapter ?? 'unknown'}`;
  }

  return null;
}

function novelCompletenessBlockReason(state) {
  const totalChapters = toPositiveInteger(state.total_chapters);
  if (totalChapters === null) return null;

  const completed = new Set(normalizeChapterList(state.completed_chapters));
  const missing = chapterRange(1, totalChapters).filter(chapter => !completed.has(chapter));
  if (missing.length > 0) {
    return `novel incomplete: chapters 1-${totalChapters} require PASS gates before NOVEL_DONE. Missing completed chapters: ${formatMissingChapters(missing)}`;
  }

  const lastGateChapter = toPositiveInteger(state.last_gate?.chapter);
  if (lastGateChapter === null || lastGateChapter < totalChapters) {
    return `novel incomplete: latest PASS gate must cover final chapter ${totalChapters}, but latest gate chapter is ${state.last_gate?.chapter ?? 'unknown'}`;
  }

  return null;
}

function actCompletionBlockReason(actPromiseMatch, state) {
  if (!actPromiseMatch) return null;

  const promisedAct = Number.parseInt(actPromiseMatch[1], 10);
  const currentAct = state.current_act || 1;
  if (promisedAct !== currentAct) {
    return `act completion promise does not match current act. promised act=${promisedAct}, current act=${currentAct}`;
  }

  return null;
}

async function main() {
  try {
    const input = await readStdinSafe();
    let data = {};
    try { data = JSON.parse(input); } catch {}

    const directory = data.directory || data.cwd || process.cwd();
    const novelsDir = join(directory, 'novels');

    // Find and read state file from active project (not workspace root)
    let state = null;
    let activeProjectPath = null;

    if (existsSync(novelsDir)) {
      const { readdirSync } = await import('fs');
      const projects = readdirSync(novelsDir)
        .filter(f => existsSync(join(novelsDir, f, 'meta', 'project.json')));

      // Search through projects for active Ralph state
      for (const proj of projects) {
        const projectPath = join(novelsDir, proj);
        const stateInfo = findStateFile(projectPath);
        if (stateInfo) {
          const projectState = readState(projectPath);
          if (projectState?.ralph_active) {
            state = projectState;
            activeProjectPath = projectPath;
            break;
          }
        }
      }
    }

    if (!state) {
      console.log(JSON.stringify({ decision: "approve" }));
      return;
    }

    // Ralph Loop가 비활성이면 통과
    if (!state.ralph_active) {
      console.log(JSON.stringify({ decision: "approve" }));
      return;
    }

    // ✅ FIX: transcript_path에서 어시스턴트 메시지 추출하여 Promise 태그 검색
    const assistantMessage = getLastAssistantMessage(data.transcript_path);
    const searchText = input + assistantMessage;
    const actPromiseMatch = searchText.match(/<promise>ACT_(\d+)_DONE<\/promise>/);
    const novelDoneMatch = searchText.match(/<promise>NOVEL_DONE<\/promise>/);
    const actBlockReason = actCompletionBlockReason(actPromiseMatch, state);
    const gateBlockReason = (actPromiseMatch || novelDoneMatch) && !actBlockReason
      ? completionGateBlockReason(state)
      : null;
    const completenessBlockReason = (actPromiseMatch || novelDoneMatch) && !actBlockReason && !gateBlockReason
      ? actPromiseMatch
        ? actCompletenessBlockReason(Number.parseInt(actPromiseMatch[1], 10), state, activeProjectPath)
        : novelCompletenessBlockReason(state)
      : null;

    if (actBlockReason) {
      console.log(JSON.stringify({
        decision: "block",
        reason: `[NOVEL RALPH LOOP] Completion promise blocked: ${actBlockReason}`
      }));
      return;
    }

    if (completenessBlockReason) {
      console.log(JSON.stringify({
        decision: "block",
        reason: `[NOVEL RALPH LOOP] Completion promise blocked: ${completenessBlockReason}`
      }));
      return;
    }

    if (gateBlockReason) {
      console.log(JSON.stringify({
        decision: "block",
        reason: `[NOVEL RALPH LOOP] Completion promise blocked: ${gateBlockReason}`
      }));
      return;
    }

    if (novelDoneMatch) {
      // 전체 소설 완료
      state.ralph_active = false;
      state.act_complete = true;
      writeState(activeProjectPath, state);
      // Update notepad
      await updateNotepad(activeProjectPath);
      console.log(JSON.stringify({ decision: "approve", reason: "Novel completion detected." }));
      return;
    }

    if (actPromiseMatch) {
      const completedAct = parseInt(actPromiseMatch[1]);
      if (completedAct === state.current_act) {
        state.act_complete = true;

        // Style Dice: rotate seed for next act
        const currentSeed = state.style_seed ?? 42;
        state.style_seed = (Math.imul(currentSeed, 1103515245) + 12345) & 0x7fffffff;
        console.error(`[style-dice] Seed rotated: ${currentSeed} -> ${state.style_seed}`);

        writeState(activeProjectPath, state);
        // Update notepad after act completion
        await updateNotepad(activeProjectPath);
        console.log(JSON.stringify({ decision: "approve", reason: `Act ${completedAct} completion detected.` }));
        return;
      }
    }

    const currentAct = state.current_act || 1;
    const iteration = state.iteration || 1;
    const maxIterations = state.max_iterations || 100;

    // 최대 반복 횟수 도달
    if (iteration >= maxIterations) {
      const pauseReason = `max_iterations reached before act completion: iteration ${iteration}/${maxIterations}. Manual review required before continuing Ralph Loop.`;
      state.ralph_active = false;
      state.requires_user_intervention = true;
      state.pause_reason = pauseReason;
      state.last_failure_reason = pauseReason;
      state.can_resume = true;
      state.act_complete = false;
      writeState(activeProjectPath, state);
      // Update notepad
      await updateNotepad(activeProjectPath);

      console.log(JSON.stringify({
        decision: "approve",
        reason: `[NOVEL RALPH LOOP - MAX ITERATIONS] 최대 반복 횟수(${maxIterations})에 도달했습니다. 미완료 상태를 유지하고 사용자 개입 대기 상태로 일시정지합니다.`
      }));
      return;
    }

    // 막 완료 여부 확인
    if (state.act_complete) {
      // 막 완료 상태 - 다음 막으로 이동 또는 완료 처리
      if (state.current_act >= state.total_acts) {
        // 전체 완료
        console.log(JSON.stringify({
          decision: "approve",
          reason: `<novel-complete>

✅ **소설 집필이 완료되었습니다!**

프로젝트: ${state.project_id}
총 회차: ${state.total_chapters}화
상태: 완료

다음 단계:
- \`/stats\` - 최종 통계 확인
- \`/export\` - 원고 내보내기

</novel-complete>

---
`
        }));

        state.ralph_active = false;
        writeState(activeProjectPath, state);
        // Update notepad
        await updateNotepad(activeProjectPath);
        return;
      }

      // 다음 막 시작
      state.current_act += 1;
      state.act_complete = false;
      state.iteration = 1;
      writeState(activeProjectPath, state);
      // Save checkpoint for next act
      await saveCheckpoint(activeProjectPath, state);
      await updateNotepad(activeProjectPath);

      console.log(JSON.stringify({ decision: "approve", reason: `Next act ${state.current_act} starting.` }));
      return;
    }

    // 막 진행 중 - 계속 진행 강제
    state.iteration = iteration + 1;
    writeState(activeProjectPath, state);
    // Periodic checkpoint and notepad update
    await saveCheckpoint(activeProjectPath, state);
    await updateNotepad(activeProjectPath);

    console.log(JSON.stringify({
      decision: "block",
      reason: `<novel-ralph-continuation>

[NOVEL RALPH LOOP - 막 ${currentAct} 진행 중 (반복 ${iteration + 1}/${maxIterations})]

🔄 막 ${currentAct}의 집필이 완료되지 않았습니다.

**현재 상태:**
- 프로젝트: ${state.project_id}
- 현재 회차: ${state.current_chapter || '?'}
- 품질 점수: ${state.quality_score || '평가 전'}
- 재시도: ${state.retry_count || 0}/3

**다음 단계:**
1. 미완료 회차 확인
2. 집필 계속
3. 막 완료 시: \`<promise>ACT_${currentAct}_DONE</promise>\` 출력

**중단하려면:** 사용자에게 확인 후 Ralph Loop 비활성화

</novel-ralph-continuation>

---
`
    }));
  } catch (error) {
    // 에러 시 통과
    console.log(JSON.stringify({ decision: "approve" }));
  }
}

main();
