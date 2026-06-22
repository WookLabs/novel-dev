import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { assertValidRalphState } from './ralph-state-validation.mjs';

/**
 * Find Ralph state file in project
 * New path first, legacy path fallback
 */
export function findStateFile(projectPath) {
  // 1. New location: meta/ralph-state.json
  const newPath = join(projectPath, 'meta', 'ralph-state.json');
  if (existsSync(newPath)) return { path: newPath, isLegacy: false };

  // 2. Legacy location: .sisyphus/novel-state.json
  const legacyPath = join(projectPath, '.sisyphus', 'novel-state.json');
  if (existsSync(legacyPath)) return { path: legacyPath, isLegacy: true };

  return null;
}

/**
 * Read state file (with legacy warning)
 */
export function readState(projectPath) {
  const found = findStateFile(projectPath);
  if (!found) return null;

  const content = JSON.parse(readFileSync(found.path, 'utf-8'));

  if (found.isLegacy) {
    console.warn('[Novel-Sisyphus] Legacy state file detected. Run: node scripts/migrate-state.mjs');
  }

  return content;
}

/**
 * Write state file (always to new path)
 */
export function writeState(projectPath, state) {
  const metaDir = join(projectPath, 'meta');
  if (!existsSync(metaDir)) {
    mkdirSync(metaDir, { recursive: true });
  }

  const newPath = join(metaDir, 'ralph-state.json');
  const nextState = {
    ...state,
    last_updated: new Date().toISOString(),
  };
  assertValidRalphState(nextState, newPath);
  writeFileSync(newPath, JSON.stringify(nextState, null, 2));
  return newPath;
}
