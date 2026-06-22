#!/usr/bin/env node

/**
 * Novel-Sisyphus Session Recovery
 * 이전 세션에서 중단된 write-all 작업 복구 확인
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  INVALID_RALPH_STATE,
  assertValidRalphState,
  isRecoverableWriteAllState,
} from './lib/ralph-state-validation.mjs';
import { evaluateWritingPreflight } from './writing-preflight.mjs';

function readJsonState(path) {
  const parsed = JSON.parse(readFileSync(path, 'utf-8'));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Invalid Ralph state object: ${path}`);
  }
  assertValidRalphState(parsed, path);
  return parsed;
}

function buildRecoveryState(state, projectPath) {
  if (state.can_resume && state.mode === 'write-all' && isRecoverableWriteAllState(state)) {
    const completedCount = state.completed_chapters?.length || 0;
    const failedCount = state.failed_chapters?.length || 0;
    const designGate = inspectDesignGateState(projectPath);
    const styleGate = inspectStyleGateState(projectPath);
    const summaryMemoryGate = inspectSummaryMemoryGateState(projectPath, state.current_chapter);
    const preflightPassed = isGatePassed(designGate) && isGatePassed(styleGate) && isGatePassed(summaryMemoryGate);

    return {
      resumeFrom: state.current_chapter,
      currentAct: state.current_act,
      ralphActive: state.ralph_active === true,
      requiresUserIntervention: state.requires_user_intervention === true,
      pauseReason: state.pause_reason || state.last_failure_reason || null,
      completedChapters: state.completed_chapters || [],
      failedChapters: state.failed_chapters || [],
      lastCheckpoint: state.last_checkpoint,
      totalChapters: state.total_chapters,
      projectId: state.project_id,
      designGate,
      styleGate,
      summaryMemoryGate,
      suggestion: preflightPassed
        ? `이전 세션에서 ${state.current_chapter}화 집필 중 중단되었습니다. (완료: ${completedCount}화, 실패: ${failedCount}화)\n이어서 진행할까요? (/write-all --resume)`
        : `이전 세션에서 ${state.current_chapter}화 집필 중 중단되었습니다. (완료: ${completedCount}화, 실패: ${failedCount}화)\n설계/문체/요약 메모리 게이트를 모두 PASS로 만든 뒤 /write-all --resume으로 이어가세요.`
    };
  }

  return null;
}

function isGatePassed(gate) {
  return gate?.passed === true && gate.status === 'PASS';
}

function inspectDesignGateState(projectPath) {
  const reportPath = join(projectPath, 'reviews', 'design-gate-report.json');
  const recommendedCommands = buildDesignGateCommands(projectPath);

  if (!existsSync(reportPath)) {
    return {
      status: 'MISSING',
      passed: false,
      reportPath,
      issues: [{
        code: 'design-gate-report-missing',
        severity: 'critical',
        message: 'Design gate report is missing; resume must rerun premise appeal readiness first.',
      }],
      recommendedCommands,
    };
  }

  try {
    const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
    if (!report || typeof report !== 'object' || Array.isArray(report)) {
      throw new Error('Design gate report must be a JSON object');
    }

    const issues = Array.isArray(report.issues)
      ? report.issues.map(issue => ({
          code: typeof issue?.code === 'string' ? issue.code : 'design-gate-blocked',
          severity: typeof issue?.severity === 'string' ? issue.severity : 'critical',
          message: typeof issue?.message === 'string'
            ? issue.message
            : 'Design gate issue has no message.',
        }))
      : [];
    const passed = report.passed === true && report.status === 'PASS';

    return {
      status: passed ? 'PASS' : 'BLOCKED',
      passed,
      reportPath,
      issues: passed ? [] : issues.length > 0 ? issues : [{
        code: 'design-gate-not-passed',
        severity: 'critical',
        message: 'Design gate report is present but not PASS.',
      }],
      recommendedCommands: Array.isArray(report.recommendedCommands) &&
        report.recommendedCommands.every(command => typeof command === 'string')
          ? report.recommendedCommands
          : recommendedCommands,
    };
  } catch (error) {
    return {
      status: 'MALFORMED',
      passed: false,
      reportPath,
      issues: [{
        code: 'design-gate-report-malformed',
        severity: 'critical',
        message: `Design gate report cannot be parsed: ${error.message}`,
      }],
      recommendedCommands,
    };
  }
}

function inspectStyleGateState(projectPath) {
  const reportPath = join(projectPath, 'reviews', 'style-gate-report.json');
  const recommendedCommands = buildStyleGateCommands(projectPath);

  if (!existsSync(reportPath)) {
    return {
      status: 'MISSING',
      passed: false,
      reportPath,
      issues: [{
        code: 'style-gate-report-missing',
        severity: 'critical',
        message: 'Style gate report is missing; resume must rerun prose taste readiness first.',
      }],
      recommendedCommands,
    };
  }

  try {
    const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
    if (!report || typeof report !== 'object' || Array.isArray(report)) {
      throw new Error('Style gate report must be a JSON object');
    }

    const issues = Array.isArray(report.issues)
      ? report.issues.map(issue => ({
          code: typeof issue?.code === 'string' ? issue.code : 'style-gate-blocked',
          severity: typeof issue?.severity === 'string' ? issue.severity : 'critical',
          message: typeof issue?.message === 'string'
            ? issue.message
            : 'Style gate issue has no message.',
        }))
      : [];
    const passed = report.passed === true && report.status === 'PASS';

    return {
      status: passed ? 'PASS' : 'BLOCKED',
      passed,
      reportPath,
      issues: passed ? [] : issues.length > 0 ? issues : [{
        code: 'style-gate-not-passed',
        severity: 'critical',
        message: 'Style gate report is present but not PASS.',
      }],
      recommendedCommands: Array.isArray(report.recommendedCommands) &&
        report.recommendedCommands.every(command => typeof command === 'string')
          ? report.recommendedCommands
          : recommendedCommands,
    };
  } catch (error) {
    return {
      status: 'MALFORMED',
      passed: false,
      reportPath,
      issues: [{
        code: 'style-gate-report-malformed',
        severity: 'critical',
        message: `Style gate report cannot be parsed: ${error.message}`,
      }],
      recommendedCommands,
    };
  }
}

function inspectSummaryMemoryGateState(projectPath, chapterNumber) {
  const reportPath = join(projectPath, 'context', 'summaries');
  const result = evaluateWritingPreflight(projectPath, {
    includeDesign: false,
    includeStyle: false,
    chapterNumber,
  });

  if (result.passed) {
    return {
      status: 'PASS',
      passed: true,
      reportPath,
      issues: [],
      recommendedCommands: [],
    };
  }

  const issues = result.failures.map(failure => ({
    code: failure.issueCodes?.[0] || failure.code || 'summary-memory-not-passed',
    severity: 'critical',
    message: [
      'Summary memory gate is not PASS; resume must refresh prior chapter summaries first.',
      failure.sourcePath ? `source=${failure.sourcePath}` : null,
      failure.reportPath ? `summary=${failure.reportPath}` : null,
    ].filter(Boolean).join(' '),
  }));
  const recommendedCommands = [
    ...new Set(result.failures.flatMap(failure => failure.recommendedCommands || [])),
  ];

  return {
    status: 'BLOCKED',
    passed: false,
    reportPath,
    issues,
    recommendedCommands,
  };
}

function buildDesignGateCommands(projectPath) {
  const projectArg = quoteCliArg(projectPath);
  return [
    `node dist/cli/run-premise-appeal-benchmark.js --project ${projectArg} --json`,
    `node dist/cli/apply-design-gate.js --project ${projectArg} --fail-on-blocked --json`,
  ];
}

function buildStyleGateCommands(projectPath) {
  const projectArg = quoteCliArg(projectPath);
  return [
    `node dist/cli/run-prose-taste-benchmark.js --project ${projectArg} --json`,
    `node dist/cli/apply-style-gate.js --project ${projectArg} --fail-on-blocked --json`,
  ];
}

function quoteCliArg(value) {
  if (!/[\s"]/u.test(value)) {
    return value;
  }
  return `"${value.replace(/"/g, '\\"')}"`;
}

function invalidStateWarning() {
  return '🚨 Ralph 상태 파일이 유효하지 않습니다. ralph-state.json과 ralph-state.backup.json의 필수 필드를 확인하세요.';
}

function unreadableStateWarning(hasBackup) {
  return hasBackup
    ? '🚨 Ralph 상태 파일을 읽을 수 없습니다. ralph-state.json과 ralph-state.backup.json을 확인하세요.'
    : '🚨 Ralph 상태 파일을 읽을 수 없습니다. ralph-state.backup.json이 없어 자동 복원할 수 없습니다.';
}

function recoveryWarning(primaryError, backupError, hasBackup) {
  if (
    primaryError?.code === INVALID_RALPH_STATE ||
    backupError?.code === INVALID_RALPH_STATE
  ) {
    return invalidStateWarning();
  }

  return unreadableStateWarning(hasBackup);
}

/**
 * Load Ralph state with backup recovery for corrupted active state files.
 * @param {string} projectPath
 * @returns {{state: object|null, recovery: object|null, restored: boolean, warning: string|null}}
 */
export async function inspectRecoveryState(projectPath) {
  const statePath = join(projectPath, 'meta', 'ralph-state.json');
  const backupPath = join(projectPath, 'meta', 'ralph-state.backup.json');

  if (!existsSync(statePath)) {
    return { state: null, recovery: null, restored: false, warning: null };
  }

  try {
    const state = readJsonState(statePath);
    return {
      state,
      recovery: buildRecoveryState(state, projectPath),
      restored: false,
      warning: null,
    };
  } catch (primaryError) {
    if (existsSync(backupPath)) {
      try {
        const backupState = readJsonState(backupPath);
        writeFileSync(statePath, JSON.stringify(backupState, null, 2));
        return {
          state: backupState,
          recovery: buildRecoveryState(backupState, projectPath),
          restored: true,
          warning: '⚠️ Ralph 상태 백업에서 복원했습니다.',
        };
      } catch (backupError) {
        return {
          state: null,
          recovery: null,
          restored: false,
          warning: recoveryWarning(primaryError, backupError, true),
        };
      }
    }

    return {
      state: null,
      recovery: null,
      restored: false,
      warning: recoveryWarning(primaryError, null, false),
    };
  }
}

/**
 * Check if there's a recoverable write-all session
 * @param {string} projectPath - Path to the novel project
 * @returns {object|null} Recovery state or null if no recovery available
 */
export async function checkRecoveryState(projectPath) {
  const inspected = await inspectRecoveryState(projectPath);
  return inspected.recovery;
}

/**
 * Format recovery message for display
 * @param {object} recoveryState - State from checkRecoveryState
 * @returns {string} Formatted message
 */
export function formatRecoveryMessage(recoveryState) {
  if (!recoveryState) return '';

  const timeSince = recoveryState.lastCheckpoint
    ? formatTimeSince(new Date(recoveryState.lastCheckpoint))
    : '알 수 없음';
  const designGate = recoveryState.designGate;
  const styleGate = recoveryState.styleGate;
  const summaryMemoryGate = recoveryState.summaryMemoryGate;
  const preflightPassed = isGatePassed(designGate) && isGatePassed(styleGate) && isGatePassed(summaryMemoryGate);
  const recoveryOptions = preflightPassed
    ? `- \`/write-all --resume\` - 중단점에서 이어서 집필
- \`/write-all --restart\` - 처음부터 다시 시작
- \`/cancel-ralph\` - 복구 취소`
    : formatBlockedPreflightOptions(designGate, styleGate, summaryMemoryGate);

  return `<session-recovery>

⚠️ **이전 세션 복구 가능**

| 항목 | 내용 |
|------|------|
| 프로젝트 | ${recoveryState.projectId} |
| 중단 위치 | ${recoveryState.currentAct}막 ${recoveryState.resumeFrom}화 |
| 완료된 회차 | ${recoveryState.completedChapters.length}화 |
| 실패한 회차 | ${recoveryState.failedChapters.length}화 |
${recoveryState.pauseReason ? `| 일시정지 사유 | ${recoveryState.pauseReason} |\n` : ''}
| 마지막 체크포인트 | ${timeSince} 전 |
| 설계 게이트 | ${formatDesignGateStatus(designGate)} |
| 문체 게이트 | ${formatStyleGateStatus(styleGate)} |
| 요약 메모리 | ${formatSummaryMemoryGateStatus(summaryMemoryGate)} |

**복구 옵션:**
${recoveryOptions}

</session-recovery>

---
`;
}

function formatDesignGateStatus(designGate) {
  return formatGateStatus(designGate);
}

function formatStyleGateStatus(styleGate) {
  return formatGateStatus(styleGate);
}

function formatSummaryMemoryGateStatus(summaryMemoryGate) {
  return formatGateStatus(summaryMemoryGate);
}

function formatGateStatus(gate) {
  if (!gate) {
    return '확인 필요';
  }
  if (isGatePassed(gate)) {
    return 'PASS';
  }
  const codes = gate.issues
    .map(issue => issue.code)
    .filter(Boolean)
    .slice(0, 4)
    .join(', ');
  return `${gate.status}${codes ? ` (${codes})` : ''}`;
}

function formatBlockedPreflightOptions(designGate, styleGate, summaryMemoryGate) {
  const sections = [];
  if (!isGatePassed(designGate)) {
    sections.push(formatBlockedDesignGateOptions(designGate));
  }
  if (!isGatePassed(styleGate)) {
    sections.push(formatBlockedStyleGateOptions(styleGate));
  }
  if (!isGatePassed(summaryMemoryGate)) {
    sections.push(formatBlockedSummaryMemoryOptions(summaryMemoryGate));
  }
  sections.push('- 설계/문체/요약 메모리 게이트가 모두 PASS이면 `/write-all --resume`으로 재개');
  return sections.join('\n');
}

function formatBlockedDesignGateOptions(designGate) {
  const commands = designGate?.recommendedCommands?.length
    ? designGate.recommendedCommands
    : [];
  const commandLines = commands.map(command => `- \`${command}\``).join('\n');

  return `**복구 전 설계 게이트 필요**
- \`reviews/design-gate-report.json\`이 PASS가 아니므로 중단 지점에서 바로 이어 쓰지 않습니다.
${commandLines}`;
}

function formatBlockedStyleGateOptions(styleGate) {
  const commands = styleGate?.recommendedCommands?.length
    ? styleGate.recommendedCommands
    : [];
  const commandLines = commands.map(command => `- \`${command}\``).join('\n');

  return `**복구 전 문체 게이트 필요**
- \`reviews/style-gate-report.json\`이 PASS가 아니므로 중단 지점에서 바로 이어 쓰지 않습니다.
${commandLines}`;
}

function formatBlockedSummaryMemoryOptions(summaryMemoryGate) {
  const commands = summaryMemoryGate?.recommendedCommands?.length
    ? summaryMemoryGate.recommendedCommands
    : [];
  const commandLines = commands.map(command => `- \`${command}\``).join('\n');

  return `**복구 전 요약 메모리 게이트 필요**
- \`context/summaries/chapter_NNN_summary.md\`가 없거나 오래됐거나 너무 얇으면 중단 지점에서 바로 이어 쓰지 않습니다.
${commandLines}`;
}

/**
 * Format time since a date
 * @param {Date} date
 * @returns {string}
 */
function formatTimeSince(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}일`;
  if (diffHours > 0) return `${diffHours}시간`;
  if (diffMins > 0) return `${diffMins}분`;
  return '방금';
}

/**
 * Clear recovery state (when user chooses to restart)
 * @param {string} projectPath
 */
export async function clearRecoveryState(projectPath) {
  const statePath = join(projectPath, 'meta', 'ralph-state.json');

  if (!existsSync(statePath)) return;

  try {
    const state = JSON.parse(readFileSync(statePath, 'utf-8'));
    state.ralph_active = false;
    state.can_resume = false;
    state.completed_chapters = [];
    state.failed_chapters = [];
    state.last_safe_chapter = 0;
    state.act_complete = false;
    state.mode = 'idle';
    state.reset_at = new Date().toISOString();
    state.reset_reason = 'recovery_state_cleared';
    delete state.requires_user_intervention;
    delete state.pause_reason;
    delete state.last_failure_reason;
    delete state.last_gate;

    assertValidRalphState(state, statePath);
    writeFileSync(statePath, JSON.stringify(state, null, 2));
  } catch {
    // Ignore errors
  }
}
