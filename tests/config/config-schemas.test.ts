import { describe, expect, it } from 'vitest';
import Ajv from 'ajv';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, join, normalize } from 'path';
import { fileURLToPath } from 'url';

const __filenameLocal = fileURLToPath(import.meta.url);
const __dirnameLocal = dirname(__filenameLocal);
const ROOT = join(__dirnameLocal, '..', '..');
const CONFIG_DIR = join(ROOT, 'config');

describe('config schema references', () => {
  it('every config file should reference an existing schema and validate against it', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const configFiles = readdirSync(CONFIG_DIR)
      .filter(file => file.endsWith('.json'))
      .sort();

    expect(configFiles.length).toBeGreaterThan(0);

    const failures: string[] = [];
    for (const file of configFiles) {
      const configPath = join(CONFIG_DIR, file);
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      const schemaRef = config.$schema;

      if (typeof schemaRef !== 'string' || schemaRef.length === 0) {
        failures.push(`${file}: missing $schema`);
        continue;
      }

      const schemaPath = normalize(join(CONFIG_DIR, schemaRef));
      if (!existsSync(schemaPath)) {
        failures.push(`${file}: schema not found at ${schemaPath}`);
        continue;
      }

      const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
      const validate = ajv.compile(schema);
      if (!validate(config)) {
        failures.push(`${file}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
