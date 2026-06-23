import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = process.cwd();

function readJson(path: string): Record<string, any> {
  return JSON.parse(readFileSync(join(repoRoot, path), 'utf8'));
}

describe('style guide prose rules template', () => {
  it('teaches the current rhythm and AI-style prose friction gates', () => {
    const template = readJson('templates/style-guide-prose-rules.json');
    const antiPatternIds = template.prose_rules.anti_patterns.map((pattern: any) => pattern.id);
    const positivePatternIds = template.prose_rules.positive_patterns.map((pattern: any) => pattern.id);

    expect(antiPatternIds).toEqual(expect.arrayContaining([
      'consecutive-short-sentences',
      'repeated-subject-rhythm',
      'uniform-sentence-length-cadence',
      'immersive-rhythm-flatline',
      'dominant-ending-cadence-lock',
      'functional-ai-report',
      'explicit-disliked-phrase',
    ]));

    expect(positivePatternIds).toEqual(expect.arrayContaining([
      'sentence-length-rhythm',
      'immersive-rhythm-anchors',
      'action-consequence-sentence-openings',
      'subtextual-action-rhythm',
    ]));
  });
});
