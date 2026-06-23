import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = process.cwd();

function readJson(path: string): Record<string, any> {
  return JSON.parse(readFileSync(join(repoRoot, path), 'utf8'));
}

function readText(path: string): string {
  return readFileSync(join(repoRoot, path), 'utf8');
}

describe('style guide prose rules template', () => {
  const requiredAntiPatternIds = [
    'consecutive-short-sentences',
    'repeated-subject-rhythm',
    'uniform-sentence-length-cadence',
    'immersive-rhythm-flatline',
    'dominant-ending-cadence-lock',
    'functional-ai-report',
    'explicit-disliked-phrase',
  ];

  const requiredPositivePatternIds = [
    'sentence-length-rhythm',
    'immersive-rhythm-anchors',
    'action-consequence-sentence-openings',
    'subtextual-action-rhythm',
  ];

  it('teaches the current rhythm and AI-style prose friction gates', () => {
    const template = readJson('templates/style-guide-prose-rules.json');
    const antiPatternIds = template.prose_rules.anti_patterns.map((pattern: any) => pattern.id);
    const positivePatternIds = template.prose_rules.positive_patterns.map((pattern: any) => pattern.id);

    expect(antiPatternIds).toEqual(expect.arrayContaining(requiredAntiPatternIds));

    expect(positivePatternIds).toEqual(expect.arrayContaining(requiredPositivePatternIds));
  });

  it('includes the prose rules in the default project style guide template', () => {
    const template = readJson('templates/style-guide.template.json');

    expect(template.prose_rules).toBeDefined();

    const antiPatternIds = template.prose_rules.anti_patterns.map((pattern: any) => pattern.id);
    const positivePatternIds = template.prose_rules.positive_patterns.map((pattern: any) => pattern.id);

    expect(antiPatternIds).toEqual(expect.arrayContaining(requiredAntiPatternIds));
    expect(positivePatternIds).toEqual(expect.arrayContaining(requiredPositivePatternIds));
  });

  it('keeps the default project prose taste score at the 95-point masterpiece gate', () => {
    const template = readJson('templates/style-guide.template.json');

    expect(template.prose_taste_profile.minimum_score).toBeGreaterThanOrEqual(95);
  });

  it('teaches core writing loops to avoid uniform rhythm and ending cadence locks', () => {
    const writingDocs = ['skills/06-write/SKILL.md', 'skills/08-write-all/SKILL.md'].map(
      readText
    );

    for (const doc of writingDocs) {
      expect(doc).toContain('uniform-sentence-length-cadence');
      expect(doc).toContain('same-ending-run');
      expect(doc).toContain('dominant-ending-cadence-lock');
      expect(doc).toContain('dialogue-ending-cadence-lock');
      expect(doc).toContain('dialogue-starter-cadence-lock');
      expect(doc).toContain('max_uniform_sentence_length_run');
      expect(doc).toContain('max_same_ending_run');
      expect(doc).toContain('max_dominant_sentence_ending_share');
      expect(doc).toContain('max_dominant_dialogue_ending_share');
      expect(doc).toContain('max_dominant_dialogue_starter_share');
    }
  });

  it('teaches the 2-pass revision agents to repair uniform sentence length cadence', () => {
    const qualityOracle = readText('agents/quality-oracle.md');
    const proseSurgeon = readText('agents/prose-surgeon.md');

    for (const doc of [qualityOracle, proseSurgeon]) {
      expect(doc).toContain('uniform-sentence-length-cadence');
      expect(doc).toContain('비슷한 길이');
      expect(doc).toContain('짧은 결정문');
      expect(doc).toContain('선택/결과');
    }
  });
});
