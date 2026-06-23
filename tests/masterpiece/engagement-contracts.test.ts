import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filenameLocal = fileURLToPath(import.meta.url);
const __dirnameLocal = dirname(__filenameLocal);
const ROOT = join(__dirnameLocal, '..', '..');

function readJson(path: string) {
  return JSON.parse(readFileSync(join(ROOT, path), 'utf-8'));
}

function readText(path: string) {
  return readFileSync(join(ROOT, path), 'utf-8');
}

function engagementIssueCodes() {
  const source = readText('src/quality/engagement-contract.ts');
  const match = source.match(/export type EngagementIssueCode =([\s\S]*?);/);

  expect(match).not.toBeNull();

  return [...match![1].matchAll(/'([^']+)'/g)].map(code => code[1]);
}

describe('masterpiece engagement contracts', () => {
  it('design strategy should require a reader promise contract', () => {
    const schema = readJson('schemas/design-strategy.schema.json');
    const template = readJson('templates/design-strategy.template.json');

    expect(schema.required).toContain('reader_promise_contract');
    expect(schema.properties.reader_promise_contract.required).toEqual([
      'target_reader',
      'core_hook',
      'irresistible_question',
      'emotional_payoff',
      'protagonist_appeal',
      'novelty_angle',
      'binge_reason',
      'first_five_chapter_retention_plan',
      'long_series_engine',
      'risk_factors',
    ]);
    expect(template.reader_promise_contract).toMatchObject({
      target_reader: expect.any(String),
      core_hook: expect.any(String),
      irresistible_question: expect.any(String),
      emotional_payoff: expect.any(String),
      protagonist_appeal: expect.any(String),
      novelty_angle: expect.any(String),
      binge_reason: expect.any(String),
      first_five_chapter_retention_plan: expect.any(Array),
      long_series_engine: expect.any(String),
      risk_factors: expect.any(Array),
    });
  });

  it('plot strategy should require binge architecture and per-chapter fun specs', () => {
    const schema = readJson('schemas/plot-strategy.schema.json');
    const template = readJson('templates/plot-strategy.template.json');
    const funSpecSchema = schema.properties.per_chapter_guide.items.properties.fun_spec;

    expect(schema.required).toContain('binge_architecture');
    expect(funSpecSchema.required).toEqual([
      'reader_reward',
      'page_turn_question',
      'character_appeal_moment',
      'drop_off_risk',
      'must_click_ending',
    ]);
    expect(template.binge_architecture).toMatchObject({
      long_hook_threads: expect.any(Array),
      payoff_cadence: expect.any(String),
      tension_reset_plan: expect.any(String),
      fatigue_controls: expect.any(Array),
    });
    expect(template.per_chapter_guide[0].fun_spec).toMatchObject({
      reader_reward: expect.any(String),
      page_turn_question: expect.any(String),
      character_appeal_moment: expect.any(String),
      drop_off_risk: expect.any(String),
      must_click_ending: expect.any(String),
    });
  });

  it('chapter metadata should require reader experience targets', () => {
    const schema = readJson('schemas/chapter.schema.json');
    const template = readJson('templates/chapter.template.json');
    const sceneItemSchema = schema.properties.scenes.items;

    expect(schema.required).toContain('reader_experience');
    expect(schema.properties.reader_experience.required).toEqual([
      'promise_fulfillment',
      'chapter_reward',
      'page_turner_question',
      'character_appeal_moment',
      'drop_off_risk',
      'must_click_ending',
    ]);
    expect(template.reader_experience).toMatchObject({
      promise_fulfillment: expect.any(String),
      chapter_reward: expect.any(String),
      page_turner_question: expect.any(String),
      character_appeal_moment: expect.any(String),
      drop_off_risk: expect.any(String),
      must_click_ending: expect.any(String),
    });
    expect(schema.properties.narrative_elements.properties).toHaveProperty('resonance_seed');
    expect(template.narrative_elements.resonance_seed).toEqual(expect.any(String));
    expect(sceneItemSchema.required).toEqual([
      'scene_number',
      'purpose',
      'characters',
      'location',
      'conflict',
      'beat',
    ]);
    expect(sceneItemSchema.properties.conflict.minLength).toBe(1);
    expect(sceneItemSchema.properties.beat.minLength).toBe(1);
    expect(template.scenes[0]).toMatchObject({
      conflict: expect.any(String),
      beat: expect.any(String),
    });
  });

  it('design and plot workflows should explicitly generate and validate engagement contracts', () => {
    const designSkill = readText('skills/04-design/SKILL.md');
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const plotTeam = readJson('teams/plot-generation-team.team.json');

    expect(designSkill).toContain('reader_promise_contract');
    expect(plotSkill).toContain('binge_architecture');
    expect(plotSkill).toContain('fun_spec');
    expect(plotSkill).toContain('reader_experience');
    expect(plotSkill).toContain('scene.conflict');
    expect(plotSkill).toContain('scene.beat');
    expect(plotSkill).toContain('장면 갈등');
    expect(plotSkill).toContain('장면 전환');
    expect(plotSkill).toContain('engagement-optimizer');
    expect(plotTeam.agents.map((agent: { agent: string }) => agent.agent)).toContain('engagement-optimizer');
    expect(plotTeam.workflow.steps[0].agents).toContain('engagement-optimizer');
  });

  it('beta-reader and quality-oracle should separate clean prose from masterpiece high points', () => {
    const engagementSchema = readJson('schemas/engagement.schema.json');
    const betaReader = readText('agents/beta-reader.md');
    const qualityOracle = readText('agents/quality-oracle.md');

    expect(engagementSchema.properties).toHaveProperty('category_scores');
    expect(engagementSchema.properties).toHaveProperty('high_point_assessment');
    expect(engagementSchema.properties.high_point_assessment.properties).toMatchObject({
      memorable_scene_lift: expect.any(Object),
      character_appeal_signature: expect.any(Object),
      payoff_delight: expect.any(Object),
      genre_specific_delight: expect.any(Object),
      next_click_compulsion: expect.any(Object),
      score_cap_reason: expect.any(Object),
    });
    expect(engagementSchema.properties.verdict.enum).toEqual(
      expect.arrayContaining(['COMPELLING', 'ENGAGING', 'READABLE', 'MODERATE', 'WEAK'])
    );
    expect(engagementSchema.properties.hooks_detected.items.properties.type.enum).toContain(
      'emotional'
    );

    for (const axis of [
      'memorable_scene_lift',
      'character_appeal_signature',
      'payoff_delight',
      'genre_specific_delight',
      'next_click_compulsion',
    ]) {
      expect(betaReader).toContain(axis);
    }

    expect(betaReader).toContain('Masterpiece High-Point Assessment');
    expect(betaReader).toContain('결함 없음과 대작 고점은 다르다');
    expect(betaReader).toContain('95+ Masterpiece Pass Rule');
    expect(betaReader).toContain('engagement_score >= 95');
    expect(betaReader).toContain('all 5 high-point axes >= 9');
    expect(betaReader).toContain('cap `engagement_score` at 94');
    expect(betaReader).toContain('90-94 can be strong, but it is still below the 95-point beta-reader gate');
    expect(betaReader).not.toContain('`engagement_score >= 90` requires');
    expect(betaReader).not.toContain('cap `engagement_score` at 89');
    expect(betaReader).toContain('score_cap_reason');

    expect(qualityOracle).toContain('Masterpiece High-Point Pass');
    expect(qualityOracle).toContain('signature scene image story-impact lift');
    expect(qualityOracle).toContain('character appeal signature');
    expect(qualityOracle).toContain('payoff delight');
    expect(qualityOracle).toContain('genre-specific delight');
    expect(qualityOracle).toContain('next-click pressure');
    expect(qualityOracle).toContain('Do not create new directive `type` values');
  });

  it('design, plot, and verification workflows should reject generic reader promise contracts', () => {
    const designSkill = readText('skills/04-design/SKILL.md');
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const verifyDesignSkill = readText('skills/verify-design/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [designSkill, plotSkill, verifyDesignSkill, verifyChapterSkill]) {
      expect(skill).toContain('reader-promise-generic');
      expect(skill).toContain('구체적 독자 약속');
      expect(skill).toContain('일반어');
      expect(skill).toContain('고유 장치');
      expect(skill).toContain('주인공 선택/비용');
    }
  });

  it('design verification should block writing until premise appeal readiness is evidence-backed', () => {
    const verifyDesignSkill = readText('skills/verify-design/SKILL.md');
    const readme = readText('README.md');

    for (const doc of [verifyDesignSkill, readme]) {
      expect(doc).toContain('run-premise-appeal-benchmark');
      expect(doc).toContain('apply-design-gate');
      expect(doc).toContain('reviews/premise-appeal-benchmark-report.json');
      expect(doc).toContain('reviews/design-gate-report.json');
      expect(doc).toContain('readyForGateTuning');
      expect(doc).toContain('weakPromiseEvidenceCount');
      expect(doc).toContain('promiseEvidenceCount');
      expect(doc).toContain('weak-promise-evidence');
      expect(doc).toContain('premise-appeal-not-ready');
      expect(doc).toContain('premise-appeal-split-leakage');
      expect(doc).toContain('premise-appeal-false-positive');
      expect(doc).toContain('premise-appeal-report-stale');
      expect(doc).toContain('premise-appeal-source-missing');
      expect(doc).toContain('splitLeakageCount');
      expect(doc).toContain('behavioralIntentFalsePositiveCount');
    }
  });

  it('writing entrypoints should apply design and style gate preflights before drafting', () => {
    const writingSkills = [
      'skills/06-write/SKILL.md',
      'skills/07-write-act/SKILL.md',
      'skills/08-write-all/SKILL.md',
      'skills/write-2pass/SKILL.md',
      'skills/write-3pass/SKILL.md',
      'skills/write-parallel/SKILL.md',
      'skills/write-act-2pass/SKILL.md',
      'skills/write-act-3pass/SKILL.md',
      'skills/write-act-parallel/SKILL.md',
      'skills/09-revise/SKILL.md',
    ].map(readText);
    const writeSkill = writingSkills[0];
    const writeAllSkill = writingSkills[2];
    const quickstartSkill = readText('skills/quickstart/SKILL.md');
    const readme = readText('README.md');

    for (const doc of [...writingSkills, quickstartSkill, readme]) {
      expect(doc).toContain('apply-design-gate');
      expect(doc).toContain('apply-style-gate');
      expect(doc).toContain('--fail-on-blocked');
      expect(doc).toContain('reviews/design-gate-report.json');
      expect(doc).toContain('reviews/style-gate-report.json');
    }

    for (const doc of [...writingSkills, readme]) {
      expect(doc).toContain('premise-appeal-not-ready');
      expect(doc).toContain('weak-promise-evidence');
      expect(doc).toContain('premise-appeal-report-stale');
      expect(doc).toContain('premise-appeal-source-missing');
      expect(doc).toContain('run-premise-appeal-benchmark');
      expect(doc).toContain('prose-taste-not-ready');
      expect(doc).toContain('prose-taste-failing-samples');
      expect(doc).toContain('prose-taste-false-classification');
      expect(doc).toContain('prose-taste-missing-issue');
      expect(doc).toContain('style-friction-evidence-weak');
      expect(doc).toContain('style-highlight-evidence-weak');
      expect(doc).toContain('style-fingerprint-weak');
      expect(doc).toContain('authorial-style-drift');
      expect(doc).toContain('prose-taste-report-stale');
      expect(doc).toContain('prose-taste-source-missing');
      expect(doc).toContain('run-prose-taste-benchmark');
    }

    expect(writeSkill).toContain('집필 전 설계 게이트');
    expect(writeSkill).toContain('집필 전 문체 취향 게이트');
    expect(writeSkill).toContain('원고를 쓰지 않습니다');
    expect(writeAllSkill).toContain('첫 회차를 쓰지 않고 루프를 시작하지 않습니다');
    expect(quickstartSkill).toContain('passed != true');
    expect(quickstartSkill).toContain('run-prose-taste-benchmark');
    expect(readme).toContain('첫 회차나 재개 회차도 작성하지 않습니다');
    expect(readme).toContain('첫 회차, 재개 회차, act 브랜치, Claude/Codex 초안, 2-Pass/3-Pass polish 모두 시작하지 않습니다');
    expect(readme).toContain('/write-act-3pass');
    expect(readme).toContain('/write-act-parallel');
  });

  it('manuscript execution scripts should hard-stop on design, style, and summary memory preflight gates', () => {
    const preflight = readText('scripts/writing-preflight.mjs');
    const codexWriter = readText('scripts/codex-writer.mjs');
    const adultRewriter = readText('scripts/adult-rewriter.mjs');
    const preToolUse = readText('hooks/pretooluse.py');
    const hooksConfig = readText('hooks/hooks.json');

    for (const script of [codexWriter, adultRewriter]) {
      expect(script).toContain('assertWritingPreflight');
      expect(script).toContain('reviews/design-gate-report.json');
      expect(script).toContain('reviews/style-gate-report.json');
      expect(script).toContain('chapterNumber');
    }

    expect(codexWriter).toContain("CHAPTER_MODES.includes(args.mode) && !args.dryRun");
    expect(codexWriter).toContain("process.exit(2)");
    expect(adultRewriter).toContain('Grok 리라이트');
    expect(adultRewriter).toContain("process.exit(2)");

    expect(preflight).toContain('design-gate-report-missing');
    expect(preflight).toContain('style-gate-report-missing');
    expect(preflight).toContain('run-premise-appeal-benchmark');
    expect(preflight).toContain('apply-design-gate');
    expect(preflight).toContain('run-prose-taste-benchmark');
    expect(preflight).toContain('apply-style-gate');
    expect(preflight).toContain("report?.passed === true && report?.status === 'PASS'");
    expect(preflight).toContain('summary-memory-missing');
    expect(preflight).toContain('summary-memory-stale');
    expect(preflight).toContain('summary-memory-too-thin');
    expect(preflight).toContain('summary-memory-malformed');
    expect(preflight).toContain('chapterSummaryCandidates');

    expect(preToolUse).toContain('Manuscript edit blocked');
    expect(preToolUse).toContain('design-gate-report-missing');
    expect(preToolUse).toContain('style-gate-report-missing');
    expect(preToolUse).toContain('summary-memory-missing');
    expect(preToolUse).toContain('summary-memory-stale');
    expect(preToolUse).toContain('summary-memory-too-thin');
    expect(preToolUse).toContain('run-premise-appeal-benchmark');
    expect(preToolUse).toContain('apply-style-gate');
    expect(hooksConfig).toContain('"matcher": "Write"');
    expect(hooksConfig).toContain('"matcher": "Edit"');
    expect(hooksConfig).toContain('"matcher": "MultiEdit"');
    expect(hooksConfig).toContain('hooks/pretooluse.py');
  });

  it('help and write-all reference docs should route users through design, style, and summary memory gates', () => {
    const helpSkill = readText('skills/help/SKILL.md');
    const writeAllGuide = readText('skills/08-write-all/references/detailed-guide.md');
    const writeAllExamples = readText('skills/08-write-all/examples/example-usage.md');

    for (const doc of [helpSkill, writeAllGuide, writeAllExamples]) {
      expect(doc).toContain('apply-design-gate');
      expect(doc).toContain('apply-style-gate');
      expect(doc).toContain('reviews/design-gate-report.json');
      expect(doc).toContain('reviews/style-gate-report.json');
      expect(doc).toContain('context/summaries/chapter_NNN_summary.md');
    }

    expect(helpSkill).toContain('6단계 퀵스타트');
    expect(helpSkill).toContain('/gen-plot');
    expect(helpSkill).toContain('Gate 안내');
    expect(helpSkill).toContain('집필 전 설계 게이트 필요');
    expect(helpSkill).toContain('집필 전 문체 게이트 필요');
    expect(helpSkill).toContain('집필 전 요약 메모리 게이트 필요');
    expect(helpSkill).toContain('/resume --continue');
    expect(helpSkill).not.toContain('다음 명령: /plot');
    expect(helpSkill).not.toContain('/plot → /write');

    expect(writeAllGuide).toContain('Preflight Gate System');
    expect(writeAllGuide).toContain('/write-all --resume');
    expect(writeAllGuide).toContain('Run premise benchmark and apply-design-gate before resume');
    expect(writeAllGuide).toContain('Run prose taste benchmark and apply-style-gate before resume');
    expect(writeAllGuide).toContain('summary-memory-missing');
    expect(writeAllGuide).toContain('summary-memory-stale');
    expect(writeAllGuide).toContain('summary-memory-too-thin');
    expect(writeAllGuide).toContain('Restarting ignores prior Ralph state, not the current design/style evidence or required continuity summaries');

    expect(writeAllExamples).toContain('[PREFLIGHT]');
    expect(writeAllExamples).toContain('Checking preflight gates');
    expect(writeAllExamples).toContain('Resume blocked before writing');
    expect(writeAllExamples).toContain('Summary memory: PASS');
    expect(writeAllExamples).toContain('Run the recommended commands and retry /write-all --resume after all preflight gates PASS');
    expect(writeAllExamples).toContain('Then run design/style/summary memory gates and write them all');
  });

  it('resume recovery should not continue writing until design, style, and summary memory gates pass', () => {
    const resumeSkill = readText('skills/10-resume/SKILL.md');
    const resumeGuide = readText('skills/10-resume/references/session-recovery.md');
    const sessionRecoveryScript = readText('scripts/session-recovery.mjs');
    const sessionStartScript = readText('scripts/session-start.mjs');
    const statusSkill = readText('skills/status/SKILL.md');
    const statusGuide = readText('skills/status/references/detailed-guide.md');
    const readme = readText('README.md');

    for (const doc of [
      resumeSkill,
      resumeGuide,
      sessionRecoveryScript,
      statusSkill,
      statusGuide,
      readme,
    ]) {
      expect(doc).toContain('reviews/design-gate-report.json');
      expect(doc).toContain('reviews/style-gate-report.json');
      expect(doc).toContain('context/summaries/chapter_NNN_summary.md');
      expect(doc).toContain('apply-design-gate');
      expect(doc).toContain('apply-style-gate');
      expect(doc).toContain('run-premise-appeal-benchmark');
      expect(doc).toContain('run-prose-taste-benchmark');
      expect(doc).toContain('/write-all --resume');
    }

    for (const doc of [resumeSkill, resumeGuide, readme]) {
      expect(doc).toContain('premise-appeal-not-ready');
      expect(doc).toContain('weak-promise-evidence');
      expect(doc).toContain('premise-appeal-report-stale');
      expect(doc).toContain('premise-appeal-source-missing');
      expect(doc).toContain('prose-taste-not-ready');
      expect(doc).toContain('prose-taste-failing-samples');
      expect(doc).toContain('prose-taste-false-classification');
      expect(doc).toContain('prose-taste-missing-issue');
      expect(doc).toContain('style-friction-evidence-weak');
      expect(doc).toContain('style-highlight-evidence-weak');
      expect(doc).toContain('style-fingerprint-weak');
      expect(doc).toContain('authorial-style-drift');
      expect(doc).toContain('prose-taste-report-stale');
      expect(doc).toContain('prose-taste-source-missing');
      expect(doc).toContain('summary-memory-missing');
      expect(doc).toContain('summary-memory-stale');
      expect(doc).toContain('summary-memory-too-thin');
      expect(doc).toContain('summary-memory-malformed');
    }

    expect(resumeSkill).toContain('PASS가 아니면');
    expect(resumeGuide).toContain('재개 중단');
    expect(sessionRecoveryScript).toContain('복구 전 설계 게이트 필요');
    expect(sessionRecoveryScript).toContain('복구 전 문체 게이트 필요');
    expect(sessionRecoveryScript).toContain('복구 전 요약 메모리 게이트 필요');
    expect(sessionRecoveryScript).toContain('design-gate-report-missing');
    expect(sessionRecoveryScript).toContain('style-gate-report-missing');
    expect(sessionRecoveryScript).toContain('summaryMemoryGate');
    expect(sessionRecoveryScript).toContain('summary-memory-not-passed');
    expect(sessionStartScript).toContain('formatRalphActiveNotice');
    expect(sessionStartScript).toContain('설계/문체/요약 메모리 게이트가 모두 PASS가 된 뒤');
    expect(sessionStartScript).toContain('새 세션에서 이어가려면');
    expect(statusSkill).toContain('설계 게이트 미통과');
    expect(statusSkill).toContain('문체 게이트 미통과');
    expect(statusSkill).toContain('요약 메모리 미통과');
    expect(statusGuide).toContain('Recommended next step');
    expect(statusGuide).toContain('style gate status');
    expect(statusGuide).toContain('summary memory status');
    expect(statusGuide).toContain('/resume --continue');
    expect(readme).toContain('/resume --continue');
    expect(readme).toContain('재개 회차도 작성하지 않습니다');
    expect(readme).toContain('재개 회차, act 브랜치');
  });

  it('writing and verification workflows should persist engagement trend evidence', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');
    const actReviewSkill = readText('skills/07-act-review/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('reader_experience');
      expect(skill).toContain('evaluateEngagementContract');
      expect(skill).toContain('recordEngagementEvaluation');
      expect(skill).toContain('node dist/cli/record-engagement.js');
      expect(skill).toContain('quality-trend.json');
      expect(skill).toContain('revisionDirectives');
      expect(skill).toContain('engagement.revisionDirectives');
      expect(skill).toContain('recurringEngagementDirectives');
      expect(skill).toContain('Repeated Engagement Directives');
      expect(skill).toContain('proseCraft');
      expect(skill).toContain('Prose Craft Revision Directives');
      expect(skill).toContain('원고 문장 품질');
      expect(skill).toContain('monotone-short-sentence-run');
      expect(skill).toContain('hedged-perception-haze');
      expect(skill).toContain('abstract-exposition-drift');
      expect(skill).toContain('cognitive-filtering-overload');
      expect(skill).toContain('comma-rhythm-overload');
      expect(skill).toContain('reporting-tail-summary');
      expect(skill).toContain('offscreen-resolution-summary');
      expect(skill).toContain('repeated-subject-rhythm');
      expect(skill).toContain('연속 단문');
      expect(skill).toContain('max_hedged_perception_density_per_1000');
      expect(skill).toContain('max_reporting_tail_density_per_1000');
      expect(skill).toContain('문장 리듬');
    }

    expect(writeSkill).toContain('node dist/cli/apply-chapter-gate.js');
    expect(writeAllSkill).toContain('node dist/cli/apply-chapter-gate.js');
    expect(verifyChapterSkill).toContain('node dist/cli/apply-chapter-gate.js');
    expect(writeSkill).toContain('evaluateChapterGate');
    expect(writeSkill).toContain('applyChapterGateDecision');
    expect(writeAllSkill).toContain('evaluateChapterGate');
    expect(writeAllSkill).toContain('applyChapterGateDecision');
    expect(writeAllSkill).toContain('Engagement Revision Directives');
    expect(writeAllSkill).toContain('ACT/NOVEL completion promises are valid only when `last_gate.status == "PASS"`');
    expect(writeAllSkill).toContain('every chapter in that act present in `completed_chapters`');
    expect(writeAllSkill).toContain('every chapter through `total_chapters` complete');
    expect(writeAllSkill).toContain('Do not emit generic completion promises');
    expect(writeAllSkill).toContain('<promise>TASK_COMPLETE</promise>');
    expect(writeAllSkill).not.toMatch(/^\s+<promise>CHAPTER_\{chapter\}_DONE<\/promise>\r?\n\r?\n\s+# 막 단위/m);
    expect(verifyChapterSkill).toContain('evaluateChapterGate');
    expect(verifyChapterSkill).toContain('applyChapterGateState');
    expect(verifyChapterSkill).toContain('ralph-state.json');
    expect(verifyChapterSkill).toContain('Engagement Trend');
    expect(verifyChapterSkill).toContain('Engagement Revision Directives');
    expect(verifyChapterSkill).toContain('reader-response-calibration.json');
    expect(verifyChapterSkill).toContain('readerResponse.passed');
    expect(verifyChapterSkill).toContain('Reader Response Revision Directives');
    expect(verifyChapterSkill).toContain('독자 패널 반응 실패');
    expect(verifyChapterSkill).toContain('evidenceQuality');
    expect(actReviewSkill).toContain('quality-trend.json');
    expect(actReviewSkill).toContain('독자 몰입');
  });

  it('writing and verification workflows should escalate 3x recurring engagement failures structurally', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('recurringEngagementDirectives');
      expect(skill).toContain('3회 이상');
      expect(skill).toContain('구조적 재검토');
      expect(skill).toContain('USER_INTERVENTION');
      expect(skill).toContain('plot/plot-strategy.json');
      expect(skill).toContain('chapters/chapter_XXX.json');
    }
  });

  it('writing and verification workflows should enforce first-five retention plan beats', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');

    expect(plotSkill).toContain('first_five_chapter_retention_plan');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('first_five_chapter_retention_plan');
      expect(skill).toContain('retention-plan-drift');
      expect(skill).toContain('초반 5화');
    }
  });

  it('plot, writing, and verification workflows should stage protagonist appeal as scene evidence', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('protagonist_appeal');
      expect(skill).toContain('protagonist-appeal-drift');
      expect(skill).toContain('character_appeal_moment');
      expect(skill).toContain('character-appeal-not-staged');
      expect(skill).toContain('character-appeal-signature-not-staged');
      expect(skill).toContain('manuscript-character-appeal-signature-not-evidenced');
      expect(skill).toContain('주인공 매력');
      expect(skill).toContain('주인공 매력 시그니처');
      expect(skill).toContain('선택/행동/비용');
    }
  });

  it('writing and verification workflows should reject passive protagonist manuscripts', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-protagonist-agency-not-evidenced');
      expect(skill).toContain('주인공 능동성');
      expect(skill).toContain('결정');
      expect(skill).toContain('대가');
      expect(skill).toContain('선택/행동/비용');
    }
  });

  it('plot, writing, and verification workflows should require explicit protagonist choice tradeoffs', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-choice-tradeoff-not-evidenced');
      expect(skill).toContain('선택-대가');
      expect(skill).toContain('경쟁 선택지');
      expect(skill).toContain('포기되는 대안');
    }
  });

  it('plot, writing, and verification workflows should require concrete stakes before irreversible action', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-stakes-not-evidenced');
      expect(skill).toContain('stakes clarity');
      expect(skill).toContain('구체 손실 대상');
      expect(skill).toContain('돌이킬 수 없는 행동');
    }
  });

  it('plot, writing, and verification workflows should personalize generic stakes subjects', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-stakes-subject-not-personalized');
      expect(skill).toContain('stakes subject specificity');
      expect(skill).toContain('스테이크 대상 개인화');
      expect(skill).toContain('피해자');
      expect(skill).toContain('사건/파일 번호');
    }
  });

  it('plot, writing, and verification workflows should require active opposition behind scene pressure', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('scene-active-opposition-not-staged');
      expect(skill).toContain('manuscript-active-opposition-not-evidenced');
      expect(skill).toContain('scene active opposition');
      expect(skill).toContain('능동 반대세력');
      expect(skill).toContain('active opposition');
      expect(skill).toContain('적대적 의지');
      expect(skill).toContain('의도적 방해');
    }
  });

  it('plot, writing, and verification workflows should stage antagonist strategy as long-form opposition', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('antagonist-strategy-not-staged');
      expect(skill).toContain('manuscript-antagonist-strategy-not-evidenced');
      expect(skill).toContain('antagonist strategy');
      expect(skill).toContain('반대세력');
      expect(skill).toContain('함정');
      expect(skill).toContain('표적화');
    }
  });

  it('plot, writing, and verification workflows should carry antagonist countermoves across chapters', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('antagonist countermove carryover');
      expect(skill).toContain('antagonist-countermove-carryover-not-staged');
      expect(skill).toContain(
        'manuscript-antagonist-countermove-carryover-not-evidenced'
      );
      expect(skill).toContain('반대세력 대응 이월');
      expect(skill).toContain('전 회차 주인공 행동');
      expect(skill).toContain('반격');
      expect(skill).toContain('전술 변경');
      expect(skill).toContain('표적 재설정');
      expect(skill).toContain('증거 삭제');
    }
  });

  it('writing and verification workflows should reject manuscripts without on-page pressure or obstacles', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-pressure-not-evidenced');
      expect(skill).toContain('장면 압박');
      expect(skill).toContain('장애물');
      expect(skill).toContain('저항');
      expect(skill).toContain('압박/장애물');
    }
  });

  it('writing and verification workflows should reject pressure without consequence escalation', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-consequence-not-evidenced');
      expect(skill).toContain('결과 악화');
      expect(skill).toContain('대가');
      expect(skill).toContain('손실');
      expect(skill).toContain('회복 불가');
      expect(skill).toContain('새 위협');
    }
  });

  it('plot, writing, and verification workflows should require signature scene images', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('signature scene image');
      expect(skill).toContain('signature-scene-image-not-staged');
      expect(skill).toContain('manuscript-signature-scene-image-not-evidenced');
      expect(skill).toContain('시그니처 장면 이미지');
      expect(skill).toContain('기억 가능한');
      expect(skill).toContain('사물/공간/몸동작');
    }
  });

  it('plot, writing, and verification workflows should require motif resonance seeds when declared', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('resonance_seed');
      expect(skill).toContain('motif resonance seed');
      expect(skill).toContain('motif-resonance-not-staged');
      expect(skill).toContain('manuscript-motif-resonance-not-evidenced');
      expect(skill).toContain('잔향 모티프');
      expect(skill).toContain('의미 변화');
      expect(skill).toContain('이야기 결과');
    }
  });

  it('plot, writing, and verification workflows should require a scene novelty matrix', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('scene-novelty-matrix-not-staged');
      expect(skill).toContain('manuscript-scene-novelty-matrix-not-evidenced');
      expect(skill).toContain('scene novelty matrix');
      expect(skill).toContain('장면 신선도 매트릭스');
      expect(skill).toContain('reward_mode');
      expect(skill).toContain('conflict_mode');
      expect(skill).toContain('setting_mode');
      expect(skill).toContain('opposition_mode');
      expect(skill).toContain('장소명');
      expect(skill).toContain('장소 제약');
      expect(skill).toContain('동선');
      expect(skill).toContain('공간 affordance');
    }
  });

  it('writing and verification workflows should reject abstract-only emotional payoff prose', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-payoff-embodiment-not-evidenced');
      expect(skill).toContain('감정 보상 장면화');
      expect(skill).toContain('emotional_payoff');
      expect(skill).toContain('설렘');
      expect(skill).toContain('몸감각');
      expect(skill).toContain('감각 디테일');
      expect(skill).toContain('행동 반응');
    }
  });

  it('plot, writing, and verification workflows should require reader desire intensity on page', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-reader-desire-not-evidenced');
      expect(skill).toContain('reader desire intensity');
      expect(skill).toContain('독자 욕망');
      expect(skill).toContain('구체 손실 대상');
      expect(skill).toContain('주인공 의도');
      expect(skill).toContain('실패 비용');
      expect(skill).toContain('차단된 선택지');
    }
  });

  it('plot, writing, and verification workflows should require earned manuscript rewards', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-earned-reward-not-evidenced');
      expect(skill).toContain('earned reward');
      expect(skill).toContain('벌어낸 보상');
      expect(skill).toContain('단서 처리');
      expect(skill).toContain('추론');
      expect(skill).toContain('수동 설명');
    }
  });

  it('writing and verification workflows should require question ladders after earned answers', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-question-ladder-not-evidenced');
      expect(skill).toContain('question ladder');
      expect(skill).toContain('질문 사다리');
      expect(skill).toContain('답');
      expect(skill).toContain('다음 질문');
      expect(skill).toContain('미해결');
    }
  });

  it('plot, writing, and verification workflows should require forecast revision after promised reversals', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-forecast-revision-not-evidenced');
      expect(skill).toContain('forecast revision');
      expect(skill).toContain('서사 예측 수정');
      expect(skill).toContain('예상');
      expect(skill).toContain('구체 단서');
      expect(skill).toContain('가설');
      expect(skill).toContain('다음 검증 행동');
    }
  });

  it('writing and verification workflows should require fresh manuscript reward turns', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-reward-freshness-not-evidenced');
      expect(skill).toContain('reward freshness');
      expect(skill).toContain('보상 신선도');
      expect(skill).toContain('고유 장치');
      expect(skill).toContain('규칙 변화');
      expect(skill).toContain('다음 행동');
      expect(skill).toContain('장르 보상');
    }
  });

  it('writing and verification workflows should require payoff delight high points', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-payoff-delight-not-evidenced');
      expect(skill).toContain('payoff delight');
      expect(skill).toContain('보상 쾌감');
      expect(skill).toContain('압박 축적');
      expect(skill).toContain('의미 변화');
      expect(skill).toContain('즉시 새 결과');
    }
  });

  it('plot, writing, and verification workflows should require genre-specific delight mechanics', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-genre-delight-not-evidenced');
      expect(skill).toContain('genre-specific delight');
      expect(skill).toContain('장르 쾌감');
      expect(skill).toContain('로맨스');
      expect(skill).toContain('미스터리');
      expect(skill).toContain('단서 결합');
      expect(skill).toContain('취약한 대화');
      expect(skill).toContain('액션');
      expect(skill).toContain('스릴러');
      expect(skill).toContain('현대판타지');
      expect(skill).toContain('전술 반전');
      expect(skill).toContain('덫 확대');
      expect(skill).toContain('시스템 피드백');
    }
  });

  it('writing and verification workflows should require the manuscript ending hook at the chapter break', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-ending-hook-not-staged');
      expect(skill).toContain('마지막 구간');
      expect(skill).toContain('새 사건');
      expect(skill).toContain('폭로');
      expect(skill).toContain('미해결 질문');
    }
  });

  it('writing and verification workflows should reject ending hooks closed in the same final beat', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-ending-hook-closed');
      expect(skill).toContain('열린 루프');
      expect(skill).toContain('해결');
      expect(skill).toContain('종결');
      expect(skill).toContain('범인 확정');
      expect(skill).toContain('안도');
    }
  });

  it('plot, writing, and verification workflows should require final hook protagonist reaction', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('ending hook reaction');
      expect(skill).toContain('ending-hook-reaction-not-staged');
      expect(skill).toContain('manuscript-ending-hook-reaction-not-evidenced');
      expect(skill).toContain('몸감각');
      expect(skill).toContain('물리적 행동');
      expect(skill).toContain('즉각 위험 반응');
    }
  });

  it('plot, writing, and verification workflows should require fair setup for final twists', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-fair-twist-setup-not-evidenced');
      expect(skill).toContain('fair twist');
      expect(skill).toContain('반전 준비 단서');
      expect(skill).toContain('말미 반전');
      expect(skill).toContain('앞선 장면');
    }
  });

  it('plot, writing, and verification workflows should require setup for final cliffhanger anchors', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-ending-hook-setup-not-evidenced');
      expect(skill).toContain('ending hook setup');
      expect(skill).toContain('말미 훅 준비 단서');
      expect(skill).toContain('좌표');
      expect(skill).toContain('사진');
      expect(skill).toContain('앞선 장면');
    }
  });

  it('writing and verification workflows should reject abstract long-hook claims without concrete clues', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-long-hook-clue-not-evidenced');
      expect(skill).toContain('구체 단서');
      expect(skill).toContain('번호');
      expect(skill).toContain('파일');
      expect(skill).toContain('로그');
      expect(skill).toContain('로고');
    }
  });

  it('plot, writing, and verification workflows should advance long-hook threads instead of repeating them', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('long-hook-thread-not-advanced');
      expect(skill).toContain('manuscript-long-hook-thread-not-advanced');
      expect(skill).toContain('새 단서');
      expect(skill).toContain('좁혀진 가설');
      expect(skill).toContain('다음 검증 행동');
    }
  });

  it('writing and verification workflows should require manuscript execution of scene conflict and turns', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-scene-intent-not-evidenced');
      expect(skill).toContain('manuscript-scene-state-delta-not-evidenced');
      expect(skill).toContain('scene.conflict');
      expect(skill).toContain('scene.beat');
      expect(skill).toContain('장면 갈등');
      expect(skill).toContain('장면 전환');
      expect(skill).toContain('원고 실행');
      expect(skill).toContain('독자 지식');
    }
  });

  it('plot, writing, and verification workflows should reject abstract scene evidence metadata', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('scene-evidence-generic');
      expect(skill).toContain('추상 scene evidence');
      expect(skill).toContain('구체적 장면 실행');
      expect(skill).toContain('행동/장애물/결과');
      expect(skill).toContain('메타 설명');
    }
  });

  it('plot, writing, and verification workflows should require scene causal escalation', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('scene causal escalation');
      expect(skill).toContain('scene-causal-escalation-not-staged');
      expect(skill).toContain('장면 간 인과');
      expect(skill).toContain('이전 scene 결과');
      expect(skill).toContain('다음 scene 압박');
    }
  });

  it('plot, writing, and verification workflows should reject static scene beats without outcome escalation', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('weak-scene-turn');
      expect(skill).toContain('정적인 확인/대조');
      expect(skill).toContain('새 사건');
      expect(skill).toContain('결과/악화');
    }
  });

  it('plot, writing, and verification workflows should reject generic fun specs', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');
    const schema = readJson('schemas/plot-strategy.schema.json');
    const template = readJson('templates/plot-strategy.template.json');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('fun-spec-generic');
      expect(skill).toContain('일반어 fun_spec');
      expect(skill).toContain('구체적 fun_spec');
      expect(skill).toContain('고유 장치/단서');
      expect(skill).toContain('주인공 선택/비용');
    }

    const funSpecSchema = schema.properties.per_chapter_guide.items.properties.fun_spec;
    expect(funSpecSchema.description).toContain('concrete device/clue/object');
    expect(template.per_chapter_guide[0].fun_spec.reader_reward).toContain('고유 장치/단서');
    expect(template.per_chapter_guide[0].fun_spec.character_appeal_moment).toContain('선택/행동/비용');
  });

  it('writing and verification workflows should reject summary-only manuscripts without scene texture', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-summary-prose');
      expect(skill).toContain('요약문형 원고');
      expect(skill).toContain('장면 질감');
      expect(skill).toContain('감각');
      expect(skill).toContain('행동');
      expect(skill).toContain('대화');
    }
  });

  it('writing and verification workflows should reject report-like manuscripts without scene density', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-scene-density-not-evidenced');
      expect(skill).toContain('장면 밀도');
      expect(skill).toContain('보고서형 원고');
      expect(skill).toContain('직접 행동');
      expect(skill).toContain('몸감각');
      expect(skill).toContain('대화/서브텍스트');
    }
  });

  it('plot, writing, and verification workflows should require spatial blocking for action scenes', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('spatial blocking');
      expect(skill).toContain('manuscript-spatial-blocking-not-evidenced');
      expect(skill).toContain('공간 블로킹');
      expect(skill).toContain('동선');
      expect(skill).toContain('차단물');
      expect(skill).toContain('거리 압박');
    }
  });

  it('writing and verification workflows should reject expository dialogue without subtext', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-dialogue-subtext-not-evidenced');
      expect(skill).toContain('대화 서브텍스트');
      expect(skill).toContain('설계 정보');
      expect(skill).toContain('갈등');
      expect(skill).toContain('회피');
      expect(skill).toContain('반박');
      expect(skill).toContain('침묵');
      expect(skill).toContain('행동 비트');
    }
  });

  it('writing and verification workflows should reject undifferentiated character voices', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('character voice differentiation');
      expect(skill).toContain('manuscript-character-voice-not-differentiated');
      expect(skill).toContain('manuscript-character-voice-profile-drift');
      expect(skill).toContain('signature_phrases');
      expect(skill).toContain('인물별 대사 음성');
      expect(skill).toContain('말투');
      expect(skill).toContain('어휘');
      expect(skill).toContain('선호 어휘');
      expect(skill).toContain('금지 어휘');
      expect(skill).toContain('방언');
      expect(skill).toContain('문장 리듬');
      expect(skill).toContain('동일한 대사');
    }
  });

  it('plot, writing, and verification workflows should preserve the design irresistible question', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('irresistible_question');
      expect(skill).toContain('page_turn_question');
      expect(skill).toContain('irresistible-question-drift');
      expect(skill).toContain('중심 질문');
      expect(skill).toContain('페이지터너');
    }
  });

  it('plot, writing, and verification workflows should reject closed page-turn questions', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('page-turn-question-closed');
      expect(skill).toContain('page_turn_question');
      expect(skill).toContain('page_turner_question');
      expect(skill).toContain('open-loop');
      expect(skill).toContain('미해결 질문');
      expect(skill).toContain('설명');
      expect(skill).toContain('해결');
    }
  });

  it('plot, writing, and verification workflows should reject overly broad page-turn questions', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('page-turn-question-too-broad');
      expect(skill).toContain('좁혀진 정보 공백');
      expect(skill).toContain('구체 앵커');
      expect(skill).toContain('앱과 사건은 왜 연결되는가');
      expect(skill).toContain('로고+사건 번호');
    }
  });

  it('plot, writing, and verification workflows should stage the clue that earns the page-turn question', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('page-turn-question-not-staged');
      expect(skill).toContain('page_turner_question');
      expect(skill).toContain('final scene');
      expect(skill).toContain('구체 단서');
      expect(skill).toContain('폭로');
      expect(skill).toContain('위협');
      expect(skill).toContain('사물');
      expect(skill).toContain('사건');
    }
  });

  it('plot, writing, and verification workflows should stage binge reason in chapter endings', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('binge_reason');
      expect(skill).toContain('binge-reason-not-staged');
      expect(skill).toContain('must_click_ending');
      expect(skill).toContain('회차 말미');
      expect(skill).toContain('연속 클릭');
    }
  });

  it('plot, writing, and verification workflows should preserve the design novelty angle', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('novelty_angle');
      expect(skill).toContain('novelty-angle-drift');
      expect(skill).toContain('차별점');
      expect(skill).toContain('신선');
    }
  });

  it('plot, writing, and verification workflows should preserve the design emotional payoff', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('emotional_payoff');
      expect(skill).toContain('emotional-payoff-drift');
      expect(skill).toContain('감정 보상');
      expect(skill).toContain('scene evidence');
    }
  });

  it('plot, writing, and verification workflows should name core reader-experience drift failures', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('reader-reward-drift');
      expect(skill).toContain('page-turner-question-drift');
      expect(skill).toContain('character-appeal-drift');
      expect(skill).toContain('must-click-ending-drift');
      expect(skill).toContain('drop-off-risk-drift');
      expect(skill).toContain('reader_experience');
      expect(skill).toContain('fun_spec');
      expect(skill).toContain('chapter_reward');
      expect(skill).toContain('must_click_ending');
    }
  });

  it('plot, writing, and verification workflows should name core scene staging failures', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('must-click-ending-not-staged');
      expect(skill).toContain('chapter-reward-not-staged');
      expect(skill).toContain('drop-off-risk-not-mitigated');
      expect(skill).toContain('tension-peak-not-staged');
      expect(skill).toContain('final scene');
      expect(skill).toContain('chapter_reward');
      expect(skill).toContain('drop_off_risk');
      expect(skill).toContain('tension_curve');
    }
  });

  it('plot, writing, and verification workflows should name foundational engagement gate failures', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('reader-promise-generic');
      expect(skill).toContain('reader-promise-premise-not-integrated');
      expect(skill).toContain('missing-chapter-guide');
      expect(skill).toContain('missing-core-hook');
      expect(skill).toContain('missing-scene-evidence');
      expect(skill).toContain('weak-scene-conflict');
      expect(skill).toContain('weak-cliffhanger');
      expect(skill).toContain('weak-peak-cliffhanger');
      expect(skill).toContain('per_chapter_guide');
      expect(skill).toContain('core_hook');
      expect(skill).toContain('cliffhanger_strength');
      expect(skill).toContain('장면 갈등');
    }
  });

  it('writing and verification workflows should document every engagement evaluator issue code', () => {
    const issueCodes = engagementIssueCodes();
    const workflowDocs = [
      ['skills/06-write/SKILL.md', readText('skills/06-write/SKILL.md')],
      ['skills/08-write-all/SKILL.md', readText('skills/08-write-all/SKILL.md')],
      ['skills/verify-chapter/SKILL.md', readText('skills/verify-chapter/SKILL.md')],
    ] as const;

    for (const [path, skill] of workflowDocs) {
      const missingCodes = issueCodes.filter(code => !skill.includes(code));

      expect(missingCodes, `${path} is missing engagement issue codes`).toEqual([]);
    }
  });

  it('plot workflow should preempt first-page, retention, and reward-ladder manuscript failures', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');

    expect(plotSkill).toContain('retention-plan-drift');
    expect(plotSkill).toContain('opening-hook-not-evidenced');
    expect(plotSkill).toContain('opening-hook-delayed');
    expect(plotSkill).toContain('opening-hook-not-embodied');
    expect(plotSkill).toContain('manuscript-reward-freshness-not-evidenced');
    expect(plotSkill).toContain('manuscript-question-ladder-not-evidenced');
    expect(plotSkill).toContain('manuscript-ending-hook-not-staged');
    expect(plotSkill).toContain('manuscript-ending-hook-closed');
    expect(plotSkill).toContain('manuscript-ending-hook-question-too-broad');
    expect(plotSkill).toContain('first_five_chapter_retention_plan');
    expect(plotSkill).toContain('초반 5화');
    expect(plotSkill).toContain('질문 사다리');
    expect(plotSkill).toContain('구체 앵커');
    expect(plotSkill).toContain('열린 루프');
  });

  it('plot, writing, and verification workflows should preserve long-series binge architecture', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('long_series_engine');
      expect(skill).toContain('long_hook_threads');
      expect(skill).toContain('payoff_cadence');
      expect(skill).toContain('long-series-engine-drift');
      expect(skill).toContain('long-hook-thread-not-staged');
      expect(skill).toContain('long-hook-thread-not-advanced');
      expect(skill).toContain('payoff-cadence-drift');
      expect(skill).toContain('장기');
      expect(skill).toContain('scene evidence');
    }
  });

  it('plot, writing, and verification workflows should stage fatigue controls against repetitive chapters', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('fatigue_controls');
      expect(skill).toContain('fatigue-control-not-staged');
      expect(skill).toContain('manuscript-fatigue-control-not-evidenced');
      expect(skill).toContain('피로도');
      expect(skill).toContain('반복');
      expect(skill).toContain('관계 압박');
      expect(skill).toContain('장소 변주');
    }
  });

  it('plot, writing, and verification workflows should enforce serial escalation variety across chapters', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('serial escalation variety');
      expect(skill).toContain('serial-escalation-variety-not-staged');
      expect(skill).toContain(
        'manuscript-serial-escalation-variety-not-evidenced'
      );
      expect(skill).toContain('회차 간');
      expect(skill).toContain('반복 보상');
      expect(skill).toContain('새 갈등 축');
    }
  });

  it('plot, writing, and verification workflows should vary serial reward delivery patterns', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('serial reward pattern variation');
      expect(skill).toContain('serial-reward-pattern-repetition-not-staged');
      expect(skill).toContain(
        'manuscript-serial-reward-pattern-repetition-not-evidenced'
      );
      expect(skill).toContain('보상 전달 방식');
      expect(skill).toContain('로그-기록 대조');
      expect(skill).toContain('이름만 바꿔 반복');
    }
  });

  it('plot, writing, and verification workflows should carry prior cliffhangers into the next chapter', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('cliffhanger carryover');
      expect(skill).toContain('prior must_click_ending');
      expect(skill).toContain('cliffhanger-carryover-not-staged');
      expect(skill).toContain(
        'manuscript-cliffhanger-carryover-not-evidenced'
      );
      expect(skill).toContain('직전 회차');
      expect(skill).toContain('미끼식 클리프행어');
    }
  });

  it('plot, writing, and verification workflows should stage scene choice-cost tradeoffs', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('scene choice-cost tradeoff');
      expect(skill).toContain('scene-choice-tradeoff-not-staged');
      expect(skill).toContain('선택-대가');
      expect(skill).toContain('경쟁 선택지');
      expect(skill).toContain('포기되는 대안');
    }
  });

  it('writing and verification workflows should require choice cost carryover', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('choice cost carryover');
      expect(skill).toContain('manuscript-choice-cost-carryover-not-evidenced');
      expect(skill).toContain('선택 비용 여파');
      expect(skill).toContain('선택지 축소');
      expect(skill).toContain('포기한 대안');
      expect(skill).toContain('다음 압박');
    }
  });

  it('plot, writing, and verification workflows should require choice-cost lock', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('choice-cost lock');
      expect(skill).toContain('scene-choice-cost-lock-not-staged');
      expect(skill).toContain('manuscript-choice-cost-lock-not-evidenced');
      expect(skill).toContain('선택-대가 잠금');
      expect(skill).toContain('되돌릴 수 없는');
      expect(skill).toContain('선택지/관계/증거/시간/경로');
    }
  });

  it('plot, writing, and verification workflows should carry choice-cost locks into the next chapter', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('choice-cost lock carryover');
      expect(skill).toContain('choice-cost-lock-carryover-not-staged');
      expect(skill).toContain(
        'manuscript-choice-cost-lock-carryover-not-evidenced'
      );
      expect(skill).toContain('선택-대가 잠금 이월');
      expect(skill).toContain('전 회차');
      expect(skill).toContain('다음 회차 압박');
      expect(skill).toContain('잠긴 선택지');
    }
  });

  it('writing and verification workflows should require tactical adaptation after reversals', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('tactical adaptation');
      expect(skill).toContain('manuscript-tactical-adaptation-not-evidenced');
      expect(skill).toContain('전술 재계산');
      expect(skill).toContain('계획 변경');
      expect(skill).toContain('우회');
      expect(skill).toContain('다음 행동');
    }
  });

  it('plot, writing, and verification workflows should stage tension reset rhythm', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('tension_reset_plan');
      expect(skill).toContain('tension-reset-not-staged');
      expect(skill).toContain('manuscript-tension-reset-not-evidenced');
      expect(skill).toContain('호흡');
      expect(skill).toContain('완급');
      expect(skill).toContain('새 질문');
      expect(skill).toContain('재점화');
    }
  });

  it('plot, writing, and verification workflows should stage manuscript tension waves', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('manuscript-tension-wave-not-evidenced');
      expect(skill).toContain('tension wave');
      expect(skill).toContain('긴장 파형');
      expect(skill).toContain('초반 압박');
      expect(skill).toContain('중반 악화');
      expect(skill).toContain('말미 고점');
      expect(skill).toContain('열린 질문');
    }
  });

  it('plot, writing, and verification workflows should stage relationship shifts as reciprocal action', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('relationship-shift-not-staged');
      expect(skill).toContain('relationship-turning-point-not-staged');
      expect(skill).toContain('relationship-mind-inference-not-staged');
      expect(skill).toContain('relationship-mutual-pressure-not-staged');
      expect(skill).toContain('manuscript-relationship-shift-not-evidenced');
      expect(skill).toContain('manuscript-relationship-turning-point-not-evidenced');
      expect(skill).toContain('manuscript-relationship-mind-inference-not-evidenced');
      expect(skill).toContain('manuscript-relationship-mutual-pressure-not-evidenced');
      expect(skill).toContain('character_development');
      expect(skill).toContain('관계 변화');
      expect(skill).toContain('관계 전환점');
      expect(skill).toContain('관계 마음 추론');
      expect(skill).toContain('관계 상호 압박');
      expect(skill).toContain('상호 반응');
      expect(skill).toContain('취약성/관계 위험');
      expect(skill).toContain('숨김');
      expect(skill).toContain('오해');
      expect(skill).toContain('진심');
      expect(skill).toContain('조건');
      expect(skill).toContain('개인적 대가');
      expect(skill).toContain('신뢰');
    }
  });

  it('plot, writing, and verification workflows should persist relationship evolution state', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('characters/relationships.json');
      expect(skill).toContain('relationship-evolution-not-recorded');
      expect(skill).toContain('evolution');
      expect(skill).toContain('관계 변화 기록');
      expect(skill).toContain('장기 상태');
    }
  });

  it('plot, writing, and verification workflows should carry relationship evolution into later chapters', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('relationship evolution carryover');
      expect(skill).toContain('relationship-evolution-carryover-not-staged');
      expect(skill).toContain(
        'manuscript-relationship-evolution-carryover-not-evidenced'
      );
      expect(skill).toContain('관계 장기 상태 이월');
      expect(skill).toContain('전 회차 관계 변화');
      expect(skill).toContain('다음 회차 대화');
      expect(skill).toContain('불신/신뢰');
    }
  });

  it('plot, writing, and verification workflows should carry revelations into later consequences', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('revelation consequence carryover');
      expect(skill).toContain('revelation-consequence-carryover-not-staged');
      expect(skill).toContain(
        'manuscript-revelation-consequence-carryover-not-evidenced'
      );
      expect(skill).toContain('폭로 결과 이월');
      expect(skill).toContain('전 회차 폭로');
      expect(skill).toContain('계획 변경');
      expect(skill).toContain('새 압박');
      expect(skill).toContain('다음 질문');
    }
  });

  it('plot, writing, and verification workflows should carry mystery clues into revised hypotheses', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('mystery hypothesis carryover');
      expect(skill).toContain('mystery-hypothesis-carryover-not-staged');
      expect(skill).toContain(
        'manuscript-mystery-hypothesis-carryover-not-evidenced'
      );
      expect(skill).toContain('추리 가설 이월');
      expect(skill).toContain('직전 단서');
      expect(skill).toContain('가설 수정');
      expect(skill).toContain('용의자 순위');
      expect(skill).toContain('다음 검증 행동');
    }
  });

  it('plot, writing, and verification workflows should keep foreshadowing metadata aligned with the ledger', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('foreshadowing_schedule');
      expect(skill).toContain('foreshadowing_plant');
      expect(skill).toContain('foreshadowing_payoff');
      expect(skill).toContain('foreshadowing-ledger-missing');
      expect(skill).toContain('foreshadowing-payoff-timing-mismatch');
      expect(skill).toContain('payoff_chapter');
      expect(skill).toContain('복선 장부');
    }
  });

  it('plot, writing, and verification workflows should require concrete foreshadowing plant clues', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('foreshadowing plant concreteness');
      expect(skill).toContain('foreshadowing-plant-not-staged');
      expect(skill).toContain('manuscript-foreshadowing-plant-not-evidenced');
      expect(skill).toContain('복선 단서 구체화');
      expect(skill).toContain('로고');
      expect(skill).toContain('번호');
      expect(skill).toContain('물증');
    }
  });

  it('plot, writing, and verification workflows should require foreshadowing payoff resolution', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('foreshadowing payoff resolution');
      expect(skill).toContain('foreshadowing-payoff-not-staged');
      expect(skill).toContain('manuscript-foreshadowing-payoff-not-evidenced');
      expect(skill).toContain('복선 회수 장면화');
      expect(skill).toContain('의미');
      expect(skill).toContain('결과');
      expect(skill).toContain('행동');
    }
  });

  it('plot, writing, and verification workflows should keep hook metadata aligned with the ledger', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('plot/hooks.json');
      expect(skill).toContain('mystery_hooks');
      expect(skill).toContain('hooks_plant');
      expect(skill).toContain('hooks_reveal');
      expect(skill).toContain('hook-ledger-missing');
      expect(skill).toContain('hook-reveal-timing-mismatch');
      expect(skill).toContain('reveal_chapter');
      expect(skill).toContain('훅 장부');
    }
  });

  it('plot, writing, and verification workflows should require arc beats to advance on page', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('arc_beats');
      expect(skill).toContain('arc-beat-not-staged');
      expect(skill).toContain('manuscript-arc-beat-not-evidenced');
      expect(skill).toContain('큰 줄거리');
      expect(skill).toContain('필러 회차');
    }
  });

  it('plot, writing, and verification workflows should connect protagonist inner drive to chapter execution', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('inner.want');
      expect(skill).toContain('inner.need');
      expect(skill).toContain('character-drive-not-staged');
      expect(skill).toContain('manuscript-character-drive-not-evidenced');
      expect(skill).toContain('욕망');
      expect(skill).toContain('결핍');
      expect(skill).toContain('대가');
    }
  });

  it('plot, writing, and verification workflows should carry protagonist inner changes into later behavior', () => {
    const plotSkill = readText('skills/05-gen-plot/SKILL.md');
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [plotSkill, writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('character drive carryover');
      expect(skill).toContain('character-drive-carryover-not-staged');
      expect(skill).toContain(
        'manuscript-character-drive-carryover-not-evidenced'
      );
      expect(skill).toContain('내적 변화 이월');
      expect(skill).toContain('직전 내적 변화');
      expect(skill).toContain('도움 요청');
      expect(skill).toContain('습관 내려놓기');
      expect(skill).toContain('달라진 행동');
    }
  });

  it('writing and verification workflows should verify manuscript evidence, not only metadata', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('chapter_XXX.md');
      expect(skill).toContain('manuscript');
      expect(skill).toContain('manuscript-reward-not-evidenced');
      expect(skill).toContain('manuscript-ending-not-evidenced');
      expect(skill).toContain('opening-hook-not-evidenced');
      expect(skill).toContain('opening-hook-delayed');
      expect(skill).toContain('opening-hook-not-embodied');
      expect(skill).toContain('manuscript-irresistible-question-not-evidenced');
      expect(skill).toContain('manuscript-ending-hook-reaction-not-evidenced');
      expect(skill).toContain('irresistible_question');
      expect(skill).toContain('page_turner_question');
      expect(skill).toContain('중심 질문');
      expect(skill).toContain('미해결 질문');
      expect(skill).toContain('말미');
      expect(skill).toContain('반응');
      expect(skill).toContain('manuscript-dialogue-conflict-not-evidenced');
      expect(skill).toContain('대화');
      expect(skill).toContain('갈등');
      expect(skill).toContain('manuscript-scene-order-not-evidenced');
      expect(skill).toContain('장면 순서');
      expect(skill).toContain('manuscript-emotional-arc-not-evidenced');
      expect(skill).toContain('emotional_goal');
      expect(skill).toContain('감정선');
      expect(skill).toContain('manuscript-character-development-not-evidenced');
      expect(skill).toContain('character_development');
      expect(skill).toContain('인물 변화');
      expect(skill).toContain('manuscript-generic-character-label-not-evidenced');
      expect(skill).toContain('주인공');
      expect(skill).toContain('실명');
      expect(skill).toContain('manuscript-design-jargon-not-evidenced');
      expect(skill).toContain('설계어');
      expect(skill).toContain('지적 쾌감');
      expect(skill).toContain('manuscript-causal-chain-not-evidenced');
      expect(skill).toContain('인과');
      expect(skill).toContain('manuscript-convenient-resolution-not-evidenced');
      expect(skill).toContain('우연한 해결');
      expect(skill).toContain('manuscript-pov-focalization-not-evidenced');
      expect(skill).toContain('POV');
      expect(skill).toContain('시점');
      expect(skill).toContain('몸감각');
      expect(skill).toContain('manuscript-narrative-transportation-not-evidenced');
      expect(skill).toContain('narrative transportation');
      expect(skill).toContain('체험 몰입');
      expect(skill).toContain('심상');
      expect(skill).toContain('manuscript-premise-engine-not-evidenced');
      expect(skill).toContain('premise engine');
      expect(skill).toContain('전제 엔진');
      expect(skill).toContain('core_hook');
      expect(skill).toContain('novelty_angle');
      expect(skill).toContain('설정/소재/컨셉');
      expect(skill).toContain('manuscript-drop-off-mitigation-not-evidenced');
      expect(skill).toContain('drop_off_risk');
      expect(skill).toContain('이탈 방지 전략');
      expect(skill).toContain('순서');
      expect(skill).toContain('행동');
      expect(skill).toContain('첫 문장');
      expect(skill).toContain('첫 비트');
      expect(skill).toContain('일상');
      expect(skill).toContain('날씨');
      expect(skill).toContain('분위기');
      expect(skill).toContain('manuscript-opening-momentum-not-evidenced');
      expect(skill).toContain('오프닝');
      expect(skill).toContain('요약');
      expect(skill).toContain('core_hook');
      expect(skill).toContain('novelty_angle');
      expect(skill).toContain('manuscript-appeal-not-evidenced');
      expect(skill).toContain('manuscript-payoff-not-evidenced');
      expect(skill).toContain('manuscript-long-hook-not-evidenced');
      expect(skill).toContain('manuscript-payoff-cadence-not-evidenced');
      expect(skill).toContain('원고 본문');
    }
  });

  it('writing and verification workflows should require visible emotional progression beats', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('emotional progression');
      expect(skill).toContain('manuscript-emotional-progression-not-evidenced');
      expect(skill).toContain('감정 전환');
      expect(skill).toContain('누적');
      expect(skill).toContain('전환 계기');
      expect(skill).toContain('행동 반응');
      expect(skill).toContain('affective choice turn');
      expect(skill).toContain('manuscript-affective-choice-turn-not-evidenced');
      expect(skill).toContain('감정 선택 전환');
      expect(skill).toContain('선택지가 닫히');
      expect(skill).toContain('관계/위험 상태');
    }
  });

  it('writing and verification workflows should require dialogue turns to change story state', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('dialogue turn');
      expect(skill).toContain('manuscript-dialogue-turn-not-evidenced');
      expect(skill).toContain('대화 전환');
      expect(skill).toContain('정보 변화');
      expect(skill).toContain('권력 변화');
      expect(skill).toContain('관계 상태 변화');
    }
  });

  it('writing and verification workflows should require dialogue state carryover after dialogue turns', () => {
    const writeSkill = readText('skills/06-write/SKILL.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');

    for (const skill of [writeSkill, writeAllSkill, verifyChapterSkill]) {
      expect(skill).toContain('dialogue state carryover');
      expect(skill).toContain('manuscript-dialogue-state-carryover-not-evidenced');
      expect(skill).toContain('상태 누적');
      expect(skill).toContain('다음 행동');
      expect(skill).toContain('다음 압박');
      expect(skill).toContain('이야기 상태');
    }
  });

  it('write-all reference docs should not teach ungated completion promises', () => {
    const detailedGuide = readText('skills/08-write-all/references/detailed-guide.md');
    const exampleUsage = readText('skills/08-write-all/examples/example-usage.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const resumeGuide = readText('skills/10-resume/references/session-recovery.md');

    for (const content of [detailedGuide, exampleUsage]) {
      expect(content).toContain('last_gate.status == "PASS"');
      expect(content).toContain('failed_chapters is empty');
      expect(content).toContain('N matches current_act');
      expect(content).toContain('completed_chapters');
      expect(content).toContain('plot/structure.json');
    }

    expect(detailedGuide).toContain('Generic task completion promises');
    expect(detailedGuide).toContain('<promise>TASK_COMPLETE</promise>');
    expect(detailedGuide).toContain('Max Iteration Pause');
    expect(detailedGuide).toContain('requires_user_intervention=true');
    expect(detailedGuide).toContain('can_resume=true');
    expect(writeAllSkill).toContain('max_iterations');
    expect(writeAllSkill).toContain('requires_user_intervention=true');
    expect(resumeGuide).toContain('max_iterations');
    expect(resumeGuide).toContain('requires_user_intervention=true');

    expect(detailedGuide).not.toContain('console.log(`<promise>NOVEL_DONE</promise>`);');
  });
});
