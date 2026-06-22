#!/usr/bin/env node

/**
 * Team Validation Script
 *
 * Validates all preset team definitions against schemas/team.schema.json.
 */

import Ajv from 'ajv';
import { readFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const teamsDir = join(__dirname, '..', 'teams');
const teamSchemaPath = join(__dirname, '..', 'schemas', 'team.schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
let hasErrors = false;

function error(message) {
  console.error(`❌ ${message}`);
  hasErrors = true;
}

function success(message) {
  console.log(`✓ ${message}`);
}

console.log('\n=== Validating Team Definitions ===\n');

const schema = JSON.parse(readFileSync(teamSchemaPath, 'utf-8'));
const validate = ajv.compile(schema);
const teamFiles = readdirSync(teamsDir)
  .filter(file => file.endsWith('.team.json'))
  .sort();

if (teamFiles.length === 0) {
  error('No team definition files found in teams/');
  process.exit(1);
}

console.log(`Found ${teamFiles.length} team definition files\n`);

for (const teamFile of teamFiles) {
  const teamPath = join(teamsDir, teamFile);

  try {
    const team = JSON.parse(readFileSync(teamPath, 'utf-8'));

    if (!validate(team)) {
      error(`Invalid team definition: ${teamFile}`);
      console.error(`  ${ajv.errorsText(validate.errors, { separator: '; ' })}`);
    } else {
      success(`${teamFile}: Valid`);
    }
  } catch (e) {
    error(`Failed to parse ${teamFile}: ${e.message}`);
  }
}

console.log('\n=== Summary ===\n');

if (hasErrors) {
  console.error('❌ Team validation failed');
  process.exit(1);
}

success(`All ${teamFiles.length} team definitions validated successfully`);
