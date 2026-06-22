import fs from 'fs';
import path from 'path';

const GATE_SPECS = {
  design: {
    label: 'design gate',
    reportFile: 'design-gate-report.json',
    missingCode: 'design-gate-report-missing',
    malformedCode: 'design-gate-report-malformed',
    notPassedCode: 'design-gate-not-passed',
    defaultCommands(projectArg) {
      return [
        `node dist/cli/run-premise-appeal-benchmark.js --project ${projectArg} --json`,
        `node dist/cli/apply-design-gate.js --project ${projectArg} --fail-on-blocked --json`,
      ];
    },
  },
  style: {
    label: 'style gate',
    reportFile: 'style-gate-report.json',
    missingCode: 'style-gate-report-missing',
    malformedCode: 'style-gate-report-malformed',
    notPassedCode: 'style-gate-not-passed',
    defaultCommands(projectArg) {
      return [
        `node dist/cli/run-prose-taste-benchmark.js --project ${projectArg} --json`,
        `node dist/cli/apply-style-gate.js --project ${projectArg} --fail-on-blocked --json`,
      ];
    },
  },
};

const SUMMARY_MEMORY_SPEC = {
  label: 'summary memory gate',
  missingCode: 'summary-memory-missing',
  malformedCode: 'summary-memory-malformed',
  staleCode: 'summary-memory-stale',
  tooThinCode: 'summary-memory-too-thin',
};

const DEFAULT_SUMMARY_WINDOW = 3;
const MIN_SUMMARY_CHARS = 100;

function quoteProjectArg(projectPath) {
  const normalized = projectPath.replace(/"/g, '\\"');
  return /\s/.test(normalized) ? `"${normalized}"` : normalized;
}

function padChapter(chapterNumber) {
  return String(chapterNumber).padStart(3, '0');
}

function positiveInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function firstExistingPath(candidates) {
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function chapterManuscriptCandidates(projectPath, chapterNumber) {
  const pad = padChapter(chapterNumber);
  return [
    path.join(projectPath, 'chapters', `chapter_${pad}.md`),
    path.join(projectPath, 'chapters', `ch${pad}.md`),
  ];
}

function chapterSummaryCandidates(projectPath, chapterNumber) {
  const pad = padChapter(chapterNumber);
  return [
    path.join(projectPath, 'context', 'summaries', `chapter_${pad}_summary.md`),
    path.join(projectPath, 'context', 'summaries', `chapter_${pad}.md`),
    path.join(projectPath, 'context', 'summaries', `chapter_${pad}_summary.json`),
    path.join(projectPath, 'context', 'summaries', `chapter_${pad}.json`),
  ];
}

function readSummaryText(summaryPath) {
  const raw = fs.readFileSync(summaryPath, 'utf-8');
  if (summaryPath.endsWith('.json')) {
    const data = JSON.parse(raw);
    if (typeof data?.summary !== 'string') {
      throw new Error('summary field must be a string');
    }
    return data.summary;
  }
  return raw;
}

function compactTextLength(text) {
  return text.replace(/\s+/g, '').length;
}

function summaryMemoryCommands(projectArg, chapterNumber) {
  const pad = padChapter(chapterNumber);
  return [
    `# regenerate ${path.posix.join('context', 'summaries', `chapter_${pad}_summary.md`)} from ${path.posix.join('chapters', `chapter_${pad}.md`)}`,
    `/verify-chapter ${chapterNumber}`,
  ];
}

function readJsonReport(reportPath) {
  if (!fs.existsSync(reportPath)) {
    return { state: 'missing', reportPath };
  }

  try {
    return {
      state: 'loaded',
      reportPath,
      data: JSON.parse(fs.readFileSync(reportPath, 'utf-8')),
    };
  } catch (err) {
    return {
      state: 'malformed',
      reportPath,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function gatePassed(report) {
  return report?.passed === true && report?.status === 'PASS';
}

function extractIssueCodes(report, fallbackCode) {
  const issues = Array.isArray(report?.issues) ? report.issues : [];
  const codes = issues
    .map((issue) => {
      if (typeof issue === 'string') return issue;
      if (issue && typeof issue.code === 'string') return issue.code;
      return null;
    })
    .filter(Boolean);

  return codes.length > 0 ? [...new Set(codes)] : [fallbackCode];
}

function reportCommands(spec, projectArg, report) {
  if (Array.isArray(report?.recommendedCommands) && report.recommendedCommands.length > 0) {
    return report.recommendedCommands;
  }
  return spec.defaultCommands(projectArg);
}

function evaluateGate(projectPath, kind) {
  const spec = GATE_SPECS[kind];
  const projectArg = quoteProjectArg(projectPath);
  const reportPath = path.join(projectPath, 'reviews', spec.reportFile);
  const report = readJsonReport(reportPath);

  if (report.state === 'missing') {
    return {
      kind,
      label: spec.label,
      code: spec.missingCode,
      issueCodes: [spec.missingCode],
      reportPath,
      recommendedCommands: spec.defaultCommands(projectArg),
    };
  }

  if (report.state === 'malformed') {
    return {
      kind,
      label: spec.label,
      code: spec.malformedCode,
      issueCodes: [spec.malformedCode],
      reportPath,
      error: report.error,
      recommendedCommands: spec.defaultCommands(projectArg),
    };
  }

  if (!gatePassed(report.data)) {
    return {
      kind,
      label: spec.label,
      code: spec.notPassedCode,
      issueCodes: extractIssueCodes(report.data, spec.notPassedCode),
      reportPath,
      status: report.data?.status,
      passed: report.data?.passed,
      recommendedCommands: reportCommands(spec, projectArg, report.data),
    };
  }

  return null;
}

function summaryMemoryFailure(projectPath, chapterNumber, code, options = {}) {
  const projectArg = quoteProjectArg(projectPath);
  const summaryCandidates = chapterSummaryCandidates(projectPath, chapterNumber);

  return {
    kind: 'summary-memory',
    label: SUMMARY_MEMORY_SPEC.label,
    code,
    issueCodes: [code],
    chapterNumber,
    reportPath: options.summaryPath ?? summaryCandidates[0],
    sourcePath: options.manuscriptPath,
    error: options.error,
    recommendedCommands: summaryMemoryCommands(projectArg, chapterNumber),
  };
}

function evaluateSummaryMemory(projectPath, options) {
  if (options.includeSummaryMemory === false) return [];

  const chapterNumber = positiveInteger(options.chapterNumber);
  if (!chapterNumber || chapterNumber <= 1) return [];

  const summaryWindow = positiveInteger(options.summaryWindow) ?? DEFAULT_SUMMARY_WINDOW;
  const startChapter = Math.max(1, chapterNumber - summaryWindow);
  const failures = [];

  for (let priorChapter = startChapter; priorChapter < chapterNumber; priorChapter += 1) {
    const manuscriptPath = firstExistingPath(chapterManuscriptCandidates(projectPath, priorChapter));
    if (!manuscriptPath) continue;

    const summaryPath = firstExistingPath(chapterSummaryCandidates(projectPath, priorChapter));
    if (!summaryPath) {
      failures.push(summaryMemoryFailure(
        projectPath,
        priorChapter,
        SUMMARY_MEMORY_SPEC.missingCode,
        { manuscriptPath },
      ));
      continue;
    }

    try {
      const summaryStat = fs.statSync(summaryPath);
      const manuscriptStat = fs.statSync(manuscriptPath);
      if (summaryStat.mtimeMs < manuscriptStat.mtimeMs) {
        failures.push(summaryMemoryFailure(
          projectPath,
          priorChapter,
          SUMMARY_MEMORY_SPEC.staleCode,
          { manuscriptPath, summaryPath },
        ));
        continue;
      }

      const summaryText = readSummaryText(summaryPath);
      if (compactTextLength(summaryText) < MIN_SUMMARY_CHARS) {
        failures.push(summaryMemoryFailure(
          projectPath,
          priorChapter,
          SUMMARY_MEMORY_SPEC.tooThinCode,
          { manuscriptPath, summaryPath },
        ));
      }
    } catch (err) {
      failures.push(summaryMemoryFailure(
        projectPath,
        priorChapter,
        SUMMARY_MEMORY_SPEC.malformedCode,
        {
          manuscriptPath,
          summaryPath,
          error: err instanceof Error ? err.message : String(err),
        },
      ));
    }
  }

  return failures;
}

export function evaluateWritingPreflight(projectPath, options = {}) {
  const includeDesign = options.includeDesign !== false;
  const includeStyle = options.includeStyle !== false;
  const failures = [];

  if (includeDesign) {
    const designFailure = evaluateGate(projectPath, 'design');
    if (designFailure) failures.push(designFailure);
  }

  if (includeStyle) {
    const styleFailure = evaluateGate(projectPath, 'style');
    if (styleFailure) failures.push(styleFailure);
  }

  failures.push(...evaluateSummaryMemory(projectPath, options));

  return {
    projectPath,
    passed: failures.length === 0,
    failures,
  };
}

export function formatWritingPreflightFailure(result, actionLabel = '원고 생성') {
  const lines = [
    `${actionLabel} 전 설계/문체 gate가 PASS가 아니므로 중단합니다.`,
    `Project: ${result.projectPath}`,
  ];

  for (const failure of result.failures) {
    lines.push(`- ${failure.label}: ${failure.issueCodes.join(', ')}`);
    lines.push(`  report: ${failure.reportPath}`);
    if (failure.sourcePath) lines.push(`  source: ${failure.sourcePath}`);
    if (failure.error) lines.push(`  error: ${failure.error}`);
    if (failure.status || typeof failure.passed !== 'undefined') {
      lines.push(`  state: status=${failure.status ?? 'unknown'}, passed=${failure.passed ?? 'unknown'}`);
    }
    lines.push('  recommendedCommands:');
    for (const command of failure.recommendedCommands) {
      lines.push(`    ${command}`);
    }
  }

  return lines.join('\n');
}

export function assertWritingPreflight(projectPath, options = {}) {
  const result = evaluateWritingPreflight(projectPath, options);
  if (!result.passed) {
    const err = new Error(formatWritingPreflightFailure(result, options.actionLabel));
    err.name = 'WritingPreflightError';
    err.preflight = result;
    throw err;
  }
  return result;
}
