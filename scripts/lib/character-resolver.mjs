/**
 * character-resolver.mjs
 *
 * Scans a project's characters/ directory and builds a multi-key index
 * so characters can be resolved by id, filename stem, name, or alias.
 *
 * Resolution order: id → stem → alias → name
 */

import fs from 'fs';
import path from 'path';

/**
 * Load and index all character JSON files from <projectPath>/characters/*.json
 *
 * @param {string} projectPath - absolute path to the novel project directory
 * @returns {Promise<{
 *   byId: Record<string, object>,
 *   byStem: Record<string, object>,
 *   byName: Record<string, object>,
 *   byAlias: Record<string, object>,
 *   raw: Array<{path: string, data: object}>
 * }>}
 */
export async function loadCharacterIndex(projectPath) {
  const charsDir = path.join(projectPath, 'characters');

  let files;
  try {
    files = fs.readdirSync(charsDir).filter(f => f.endsWith('.json'));
  } catch {
    return { byId: {}, byStem: {}, byName: {}, byAlias: {}, raw: [] };
  }

  const byId = {};
  const byStem = {};
  const byName = {};
  const byAlias = {};
  const raw = [];

  for (const filename of files) {
    const filePath = path.join(charsDir, filename);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.warn(`[character-resolver] skipping malformed JSON at ${filePath}: ${e.message}`);
      continue;
    }

    const stem = filename.replace(/\.json$/, '');
    raw.push({ path: filePath, data });

    // Index by JSON id field
    if (data.id) {
      byId[data.id] = data;
    }

    // Index by filename stem
    byStem[stem] = data;

    // Index by name field
    if (data.name) {
      byName[data.name] = data;
    }

    // Index by each alias
    if (Array.isArray(data.aliases)) {
      for (const alias of data.aliases) {
        if (alias) {
          byAlias[alias] = data;
        }
      }
    }
  }

  return { byId, byStem, byName, byAlias, raw };
}

/**
 * Resolve a list of character ids/names/stems to their character data.
 *
 * Resolution order: byId → byStem → byAlias → byName
 *
 * @param {string} projectPath - absolute path to the novel project directory
 * @param {string[]} ids - list of requested character identifiers
 * @returns {Promise<{
 *   resolved: Array<{requestedId: string, character: object, source: string}>,
 *   missing: string[]
 * }>}
 */
export async function resolveCharacters(projectPath, ids) {
  const index = await loadCharacterIndex(projectPath);
  const resolved = [];
  const missing = [];

  for (const requestedId of ids) {
    if (index.byId[requestedId]) {
      resolved.push({ requestedId, character: index.byId[requestedId], source: 'byId' });
    } else if (index.byStem[requestedId]) {
      resolved.push({ requestedId, character: index.byStem[requestedId], source: 'byStem' });
    } else if (index.byAlias[requestedId]) {
      resolved.push({ requestedId, character: index.byAlias[requestedId], source: 'byAlias' });
    } else if (index.byName[requestedId]) {
      resolved.push({ requestedId, character: index.byName[requestedId], source: 'byName' });
    } else {
      missing.push(requestedId);
    }
  }

  return { resolved, missing };
}
