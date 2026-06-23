import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = process.cwd();

function readText(path: string): string {
  return readFileSync(join(repoRoot, path), 'utf8');
}

function readJson(path: string): Record<string, any> {
  return JSON.parse(readText(path));
}

describe('masterpiece operating thresholds', () => {
  it('does not advertise a 70 point writing quality gate in the README', () => {
    const doc = readText('README.md');

    expect(doc).not.toContain('70점 기준');
    expect(doc).not.toContain('70점 미만');
    expect(doc).not.toContain('70점 이상 통과');
    expect(doc).toContain('95점 기준');
    expect(doc).toContain('95점 미만');
    expect(doc).toContain('95점 이상 통과');
  });

  it('keeps user-facing quickstart on the 95 point Ralph Loop gate', () => {
    const doc = readText('skills/quickstart/SKILL.md');

    expect(doc).not.toContain('품질 게이트(70점)');
    expect(doc).toContain('품질 게이트(95점)');
  });

  it('keeps plot review and revision gates at the 95 point operating bar', () => {
    const plotReview = readText('skills/05-plot-review/SKILL.md');
    const revisionGate = readText('skills/revision-team-gate/SKILL.md');

    expect(plotReview).not.toMatch(/>=\s*(80|85|90)\b/);
    expect(plotReview).toContain('| critic | >= 95 |');
    expect(plotReview).toContain('| consistency-verifier | >= 95 |');
    expect(plotReview).toContain('| genre-validator | >= 95 |');
    expect(plotReview).toContain('| plot-architect | >= 95 |');

    expect(revisionGate).not.toMatch(/[<>]=?\s*(80|85|90)\b/);
    expect(revisionGate).toContain('quality_gates: critic >= 95, consistency-verifier >= 95');
  });

  it('keeps chapter-verifier validator defaults at 95 for every chapter', () => {
    const doc = readText('agents/chapter-verifier.md');

    expect(doc).toContain('| Critic | >=95 | >=95 | 40% |');
    expect(doc).toContain('| Beta-Reader | >=95 | >=95 | 30% |');
    expect(doc).toContain('| Genre-Validator | >=95 | >=95 | 30% |');
    expect(doc).toContain('Apply standard thresholds (critic >=95, beta-reader >=95, genre-validator >=95).');
    expect(doc).toContain('Use defaults: all chapters (critic 95, beta-reader 95, genre-validator 95)');
    expect(doc).toContain('- Only include feedback items with confidence ≥95 (if provided)');

    expect(doc).not.toContain('| Critic | ≥90 | ≥85 |');
    expect(doc).not.toContain('| Beta-Reader | ≥80 | ≥75 |');
    expect(doc).not.toContain('| Genre-Validator | ≥95 | ≥90 |');
    expect(doc).not.toContain('Apply standard thresholds (critic ≥85, beta-reader ≥75, genre-validator ≥90).');
    expect(doc).not.toContain('Use defaults: Ch1 (90/80/95), Others (85/75/90)');
    expect(doc).not.toContain('- Only include feedback items with confidence ≥75 (if provided)');
  });

  it('keeps the critic agent pass/fail gate at the 95 point operating bar', () => {
    const doc = readText('agents/critic.md');

    expect(doc).toContain('- Quality Gate: 95 points minimum');
    expect(doc).toContain('- Pass/Fail: score >= 95 = Pass; score < 95 = FAIL');
    expect(doc).toContain('#### Critical Issues (if score <95)');
    expect(doc).toContain('If score < 95:');
    expect(doc).toContain('If score >= 95:');

    expect(doc).not.toContain('- Quality Gate: 70 points minimum');
    expect(doc).not.toContain('Standard Mode: ≥70 = Pass; Masterpiece Mode (/write-all): ≥85 = Pass');
    expect(doc).not.toContain('#### Critical Issues (if score <70)');
    expect(doc).not.toContain('If score < 70:');
    expect(doc).not.toContain('If score ≥ 70:');
    expect(doc).not.toContain('≥70 = Pass');
    expect(doc).not.toContain('≥85 = Pass');
  });

  it('keeps quality-oracle pass criteria aligned with the 95 point prose bar', () => {
    const agentDoc = readText('agents/quality-oracle.md');
    const pipelineCode = readText('src/pipeline/quality-oracle.ts');

    expect(agentDoc).toContain('- Average score >= 95');
    expect(agentDoc).toContain('- Filter words = 0');
    expect(agentDoc).not.toContain('- Average score >= 70');
    expect(agentDoc).not.toContain('- Filter words <= 5');
    expect(agentDoc).not.toContain('- Average score < 70');

    expect(pipelineCode).toContain('MASTERPIECE_PASS_SCORE = 95');
    expect(pipelineCode).not.toContain('avgScore >= 70');
    expect(pipelineCode).not.toContain('filterWords.length <= 5');
    expect(pipelineCode).not.toContain('Placeholder - requires');
  });

  it('keeps agent-facing chapter verifier guidance at 95 in root and write-all docs', () => {
    const rootAgents = readText('AGENTS.md');
    const writeAllGuide = readText('skills/08-write-all/references/detailed-guide.md');

    expect(rootAgents).toContain('Quality gate at 95/100 points');
    expect(rootAgents).toContain('Use quality gates - 95/100 minimum score');
    expect(rootAgents).toContain('**Quality Gates**: 95/100 minimum score');
    expect(rootAgents).not.toContain('Quality gate at 70/100 points');
    expect(rootAgents).not.toContain('Use quality gates - 70/100 minimum score');
    expect(rootAgents).not.toContain('**Quality Gates**: 70/100 minimum score');

    for (const doc of [rootAgents, writeAllGuide]) {
      expect(doc).toContain('| critic | ≥95 | ≥95 |');
      expect(doc).toContain('| beta-reader | ≥95 | ≥95 |');
      expect(doc).toContain('| genre-validator | ≥95 | ≥95 |');

      expect(doc).not.toContain('| critic | ≥85 | ≥90 |');
      expect(doc).not.toContain('| beta-reader | ≥75 | ≥80 |');
      expect(doc).not.toContain('| genre-validator | ≥90 | ≥95 |');
    }
  });

  it('keeps write-all examples and 2-pass notes from teaching relaxed validator gates', () => {
    const exampleDoc = readText('skills/08-write-all/examples/example-usage.md');
    const detailedGuide = readText('skills/08-write-all/references/detailed-guide.md');

    for (const doc of [exampleDoc, detailedGuide]) {
      expect(doc).not.toContain('threshold: 80');
      expect(doc).not.toContain('threshold: 85');
      expect(doc).not.toContain('beta-reader >= 80점');
      expect(doc).not.toContain('critic >= 85');
      expect(doc).not.toContain('beta-reader >= 80');
    }

    expect(exampleDoc).not.toContain('Average quality: 88.3/100');
    expect(exampleDoc).not.toContain('Average score: 91/100 (S tier)');
    expect(exampleDoc).not.toContain('Average quality │ 88.5/100');
    expect(exampleDoc).not.toContain('80-89  (A):');
    expect(exampleDoc).not.toContain('70-79  (B):');
    expect(exampleDoc).toContain('Quality threshold: 95 (Masterpiece Mode)');
    expect(exampleDoc).toContain('├─ beta-reader: 96/100 ✓ (threshold: 95)');
    expect(detailedGuide).toContain('- beta-reader >= 95점');
  });

  it('keeps Codex reviewer prompt gates at the 95 point operating bar', () => {
    const script = readText('scripts/codex-reviewer.mjs');

    expect(script).toContain('Quality Gates: critic>=95, consistency>=95, genre>=95, plot-architect>=95');
    expect(script).not.toContain('Quality Gates: critic>=80, consistency>=85, genre>=85, plot-architect>=80');
  });

  it('keeps core chapter loop skill docs from offering sub-95 gates or legacy relaxation', () => {
    const agentGuide = readText('agents/AGENTS.md');
    const writeAllSkill = readText('skills/08-write-all/SKILL.md');
    const verifyChapterSkill = readText('skills/verify-chapter/SKILL.md');
    const verifyDesignSkill = readText('skills/verify-design/SKILL.md');
    const genreValidator = readText('agents/genre-validator.md');
    const checkpointScript = readText('scripts/checkpoint.mjs');

    expect(agentGuide).toContain('Threshold: >=95 engagement score');
    expect(agentGuide).toContain('**beta-reader**: >=95 engagement score');
    expect(agentGuide).toContain('Bypass quality gates (95/100 minimum)');
    expect(agentGuide).toContain('| critic | >=95 |');
    expect(agentGuide).toContain('| beta-reader | >=95 |');
    expect(agentGuide).not.toContain('Threshold: >=80 engagement score');
    expect(agentGuide).not.toContain('Bypass quality gates (70/100 minimum)');
    expect(agentGuide).not.toContain('| critic | >=85 |');
    expect(agentGuide).not.toContain('| beta-reader | >=80 |');

    expect(writeAllSkill).toContain('| critic | ≥95 | ≥95 |');
    expect(writeAllSkill).toContain('| beta-reader | ≥95 | ≥95 |');
    expect(writeAllSkill).toContain('| genre-validator | ≥95 | ≥95 |');
    expect(writeAllSkill).toContain('Predicted retention ≥95%');
    expect(writeAllSkill).toContain('ask_user(["수동 수정", "구조/플롯 재설계", "스킵", "중단"])');
    expect(writeAllSkill).toContain('- Applies confidence filtering (≥95)');
    expect(writeAllSkill).toContain('Enforces quality thresholds (critic ≥95, beta-reader ≥95, genre-validator ≥95)');
    expect(writeAllSkill).not.toContain('legacy 70점');
    expect(writeAllSkill).not.toContain('ask_user(["수동 수정", "기준 완화", "스킵", "중단"])');
    expect(writeAllSkill).not.toContain('- Applies confidence filtering (≥75)');
    expect(writeAllSkill).not.toContain('| critic | ≥85 | ≥90 |');
    expect(writeAllSkill).not.toContain('| beta-reader | ≥80 | ≥85 |');
    expect(writeAllSkill).not.toContain('Predicted retention ≥75%');
    expect(writeAllSkill).not.toContain('Enforces quality thresholds (critic ≥85, beta-reader ≥80, genre-validator ≥95)');

    expect(verifyChapterSkill).toContain('| chapter-verifier | ≥95점 |');
    expect(verifyChapterSkill).toContain('| beta-reader | ≥95점 |');
    expect(verifyChapterSkill).toContain('| genre-validator | ≥95점 |');
    expect(verifyChapterSkill).toContain('| ≥95% | 자동 반영 |');
    expect(verifyChapterSkill).toContain('| 80-94% | 사용자 확인 후 반영 |');
    expect(verifyChapterSkill).toContain('| <80% | 참고용 표시만 |');
    expect(verifyChapterSkill).not.toContain('| chapter-verifier | ≥85점 |');
    expect(verifyChapterSkill).not.toContain('| beta-reader | ≥80점 |');
    expect(verifyChapterSkill).not.toContain('| chapter-verifier | ≥90점 |');
    expect(verifyChapterSkill).not.toContain('| beta-reader | ≥85점 |');
    expect(verifyChapterSkill).not.toContain('| ≥85% | 자동 반영 |');
    expect(verifyChapterSkill).not.toContain('| 70-84% | 사용자 확인 후 반영 |');
    expect(verifyChapterSkill).not.toContain('| <70% | 참고용 표시만 |');

    expect(verifyDesignSkill).toContain('| 상업성 | genre-validator | 점수 ≥95 |');
    expect(verifyDesignSkill).not.toContain('| 상업성 | genre-validator | 점수 ≥85 |');

    expect(genreValidator).toContain('**Both must pass** (≥95) for publication quality');
    expect(genreValidator).not.toContain('**Both must pass** (≥70) for publication quality');

    expect(checkpointScript).not.toContain('legacy 70점');
    expect(checkpointScript).not.toContain('기준 완화');
  });

  it('keeps generated project guidance templates on 95 point validator gates', () => {
    const claudeTemplate = readText('templates/CLAUDE.template.md');
    const blueprintTemplate = readText('templates/BLUEPRINT.template.md');

    expect(claudeTemplate).not.toContain('| Standard | ≥70 | ≥70 | ≥85 |');
    expect(claudeTemplate).not.toContain('| Masterpiece (`/write-all`) | ≥85 | ≥80 | ≥95 |');
    expect(claudeTemplate).not.toContain('70점 미만 회차');
    expect(claudeTemplate).toContain('| Standard | ≥95 | ≥95 | ≥95 |');
    expect(claudeTemplate).toContain('| Masterpiece (`/write-all`) | ≥95 | ≥95 | ≥95 |');
    expect(claudeTemplate).toContain('95점 미만 회차');

    expect(blueprintTemplate).toContain('| critic | ≥{95} |');
    expect(blueprintTemplate).toContain('| beta-reader | ≥{95} |');
    expect(blueprintTemplate).toContain('| genre-validator | ≥{95} |');
    expect(blueprintTemplate).not.toContain('≥{85}');
    expect(blueprintTemplate).not.toContain('≥{75}');
    expect(blueprintTemplate).not.toContain('≥{90}');
  });

  it('keeps every recipe validator threshold at 95 or above', () => {
    const recipeFiles = readdirSync(join(repoRoot, 'templates/recipes'))
      .filter((file) => file.endsWith('.json'))
      .sort();
    const failures: string[] = [];

    for (const file of recipeFiles) {
      const recipe = readJson(`templates/recipes/${file}`);
      for (const field of ['critic_threshold', 'beta_reader_threshold', 'genre_validator_threshold']) {
        const value = recipe.validation_rules?.[field];
        if (typeof value === 'number' && value < 95) {
          failures.push(`${file}: validation_rules.${field} must be >=95, got ${value}`);
        }
      }

      const chapter1 = recipe.validation_rules?.chapter1_thresholds ?? {};
      for (const [validator, value] of Object.entries(chapter1)) {
        if (typeof value === 'number' && value < 95) {
          failures.push(`${file}: validation_rules.chapter1_thresholds.${validator} must be >=95, got ${value}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it('keeps team-orchestrator guidance from teaching sub-95 validator gates', () => {
    const doc = readText('agents/team-orchestrator.md');

    expect(doc).toContain('Every quality-gated validator threshold defaults to 95');
    expect(doc).toContain('"critic score >= 95"');
    expect(doc).toContain('"beta-reader score >= 95"');
    expect(doc).toContain('"genre-validator score >= 95"');

    expect(doc).not.toMatch(/\|\s*critic\s*\|\s*85\s*\|\s*90\s*\|/);
    expect(doc).not.toMatch(/\|\s*beta-reader\s*\|\s*75\s*\|\s*80\s*\|/);
    expect(doc).not.toMatch(/\|\s*genre-validator\s*\|\s*90\s*\|\s*95\s*\|/);
    expect(doc).not.toMatch(/\|\s*consistency-verifier\s*\|\s*80\s*\|\s*85\s*\|/);
    expect(doc).not.toContain('"critic score >= 85"');
    expect(doc).not.toContain('|  critic         |  87   | PASS');
    expect(doc).not.toContain('|  beta-reader    |  82   | PASS');
    expect(doc).not.toContain('|  genre-validator|  91   | PASS');
  });

  it('keeps team schema examples from teaching sub-95 quality gates', () => {
    const teamSchema = readText('schemas/team.schema.json');
    const teamStateSchema = readText('schemas/team-state.schema.json');

    expect(teamSchema).toContain('"critic": 95');
    expect(teamSchema).toContain('"beta-reader": 95');
    expect(teamSchema).toContain('"genre-validator": 95');
    expect(teamSchema).not.toMatch(/"(critic|beta-reader|genre-validator)":\s*(75|85|90)\b/);

    expect(teamStateSchema).toContain('"threshold": 95');
    expect(teamStateSchema).not.toMatch(/"threshold":\s*(75|85|90)\b/);
    expect(teamStateSchema).not.toMatch(/"score":\s*79,[\s\S]*?"verdict":\s*"PASS"/);
    expect(teamStateSchema).not.toMatch(/"score":\s*92,[\s\S]*?"threshold":\s*90,[\s\S]*?"pass":\s*true/);
  });
});
