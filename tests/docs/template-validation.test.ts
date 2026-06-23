import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

describe('template validation script', () => {
  it('validates the repository templates against their schemas', () => {
    const result = spawnSync(process.execPath, ['verify-templates.mjs'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
  });
});
