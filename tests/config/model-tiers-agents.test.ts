import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filenameLocal = fileURLToPath(import.meta.url);
const __dirnameLocal = dirname(__filenameLocal);
const ROOT = join(__dirnameLocal, '..', '..');
const AGENTS_DIR = join(ROOT, 'agents');

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^['"]|['"]$/g, '');
    result[key] = value;
  }
  return result;
}

describe('model tier agent coverage', () => {
  it('model-tiers.json should cover all agent frontmatter model and color values', () => {
    const config = JSON.parse(readFileSync(join(ROOT, 'config', 'model-tiers.json'), 'utf-8'));
    const failures: string[] = [];
    const agentFiles = readdirSync(AGENTS_DIR)
      .filter(file => file.endsWith('.md') && file !== 'AGENTS.md')
      .sort();

    for (const file of agentFiles) {
      const frontmatter = parseFrontmatter(readFileSync(join(AGENTS_DIR, file), 'utf-8'));
      const name = file.replace(/\.md$/, '');
      const tierName = config.agents[name];
      const tier = tierName ? config.tiers[tierName] : undefined;

      if (!tierName) failures.push(`${name}: missing agents tier`);
      if (!config.permissionModes[name]) failures.push(`${name}: missing permission mode`);
      if (!config.colors[name]) failures.push(`${name}: missing color`);
      if (tier && frontmatter.model && tier.model !== frontmatter.model) {
        failures.push(`${name}: model-tiers ${tier.model} != frontmatter ${frontmatter.model}`);
      }
      if (frontmatter.color && config.colors[name] !== frontmatter.color) {
        failures.push(`${name}: color ${config.colors[name]} != frontmatter ${frontmatter.color}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
