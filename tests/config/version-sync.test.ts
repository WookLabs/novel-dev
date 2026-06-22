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

describe('version metadata', () => {
  it('package, lockfile, plugin, and marketplace versions should stay in sync', () => {
    const pkg = readJson('package.json');
    const lock = readJson('package-lock.json');
    const plugin = readJson('.claude-plugin/plugin.json');
    const marketplace = readJson('.claude-plugin/marketplace.json');

    expect({
      package: pkg.version,
      lockfile: lock.version,
      lockRoot: lock.packages[''].version,
      plugin: plugin.version,
      marketplace: marketplace.plugins[0].version,
    }).toEqual({
      package: pkg.version,
      lockfile: pkg.version,
      lockRoot: pkg.version,
      plugin: pkg.version,
      marketplace: pkg.version,
    });
  });
});
