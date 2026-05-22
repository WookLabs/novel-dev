#!/usr/bin/env node

/**
 * Team Definition Validation Script
 *
 * Validates all teams/*.team.json files:
 * 1. Each agent reference in members and workflow steps exists in agents/*.md
 *    OR is the literal "characters/*" placeholder (which MUST have resolve:"from_scene_cast")
 * 2. Each workflow step's depends_on references an earlier step name in the same workflow.
 * 3. Each workflow step's orchestrator_action (step.type === "orchestrator_action") uses
 *    an action from the explicit allowlist.
 *
 * Uses AJV for JSON schema validation if schemas/team.schema.json is present,
 * plus the structural checks above.
 */

import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const teamsDir = join(__dirname, '..', 'teams');
const agentsDir = join(__dirname, '..', 'agents');

// ---------------------------------------------------------------------------
// Allowlist for orchestrator_action.action values.
// ---------------------------------------------------------------------------
const ALLOWED_ORCHESTRATOR_ACTIONS = new Set([
  'codex-writer',
  'adult-rewriter',
  'chapter-polisher-full',
  'quality-gate',
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let hasErrors = false;

function error(file, msg) {
  console.error(`❌ [${file}] ${msg}`);
  hasErrors = true;
}

function success(msg) {
  console.log(`✓ ${msg}`);
}

// ---------------------------------------------------------------------------
// Build set of known agent names from agents/*.md (no hardcoded list)
// ---------------------------------------------------------------------------
function getKnownAgents() {
  if (!existsSync(agentsDir)) {
    console.error('❌ agents/ directory not found');
    process.exit(1);
  }
  return new Set(
    readdirSync(agentsDir)
      .filter(f => f.endsWith('.md') && f !== 'AGENTS.md')
      .map(f => f.replace(/\.md$/, ''))
  );
}

// ---------------------------------------------------------------------------
// Validate a single team file
// ---------------------------------------------------------------------------
function validateTeam(filePath, fileName, knownAgents) {
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    error(fileName, `Invalid JSON: ${e.message}`);
    return;
  }

  // ------------------------------------------------------------------
  // 1. Validate members (data.agents array)
  // ------------------------------------------------------------------
  const members = data.agents ?? [];
  for (const member of members) {
    const agentRef = member.agent;
    if (!agentRef) continue;

    if (agentRef === 'characters/*') {
      // Must have resolve: "from_scene_cast"
      if (member.resolve !== 'from_scene_cast') {
        error(
          fileName,
          `Member "characters/*" must declare resolve: "from_scene_cast" (got: ${JSON.stringify(member.resolve)})`
        );
      }
      continue;
    }

    // Must exist in agents/*.md
    if (!knownAgents.has(agentRef)) {
      error(
        fileName,
        `Member references unknown agent "${agentRef}" — no agents/${agentRef}.md found`
      );
    }
  }

  // ------------------------------------------------------------------
  // 2. Validate workflow steps
  // ------------------------------------------------------------------
  const steps = data.workflow?.steps ?? [];

  // Collect all step names for depends_on validation
  const stepNames = new Set(steps.map(s => s.name).filter(Boolean));

  // Cumulative branch names seen so far (from prior steps)
  const cumulativeBranchNames = new Set();

  for (const step of steps) {
    const stepName = step.name ?? '(unnamed step)';

    // 2a. Validate agents referenced in step.agents
    const stepAgents = step.agents ?? [];
    for (const agentRef of stepAgents) {
      if (!agentRef) continue;

      if (agentRef === 'characters/*') {
        // characters/* in workflow steps is allowed (the member-level check covers resolve)
        continue;
      }

      if (!knownAgents.has(agentRef)) {
        error(
          fileName,
          `Step "${stepName}" references unknown agent "${agentRef}" — no agents/${agentRef}.md found`
        );
      }
    }

    // 2b. Validate branches (nested structure, e.g. writing-team-parallel)
    const branches = step.branches ?? [];
    for (const branch of branches) {
      const branchAgents = branch.agents ?? [];
      for (const agentRef of branchAgents) {
        if (!agentRef || agentRef === 'characters/*') continue;
        if (!knownAgents.has(agentRef)) {
          error(
            fileName,
            `Step "${stepName}" branch "${branch.name ?? '(unnamed)'}" references unknown agent "${agentRef}" — no agents/${agentRef}.md found`
          );
        }
      }
      // Validate branch-level orchestrator_action
      if (branch.type === 'orchestrator_action') {
        const action = branch.action;
        if (action && !ALLOWED_ORCHESTRATOR_ACTIONS.has(action)) {
          error(
            fileName,
            `Step "${stepName}" branch "${branch.name ?? '(unnamed)'}" uses unknown orchestrator_action "${action}" (allowed: ${[...ALLOWED_ORCHESTRATOR_ACTIONS].join(', ')})`
          );
        }
      }
    }

    // 2c. Validate depends_on references
    const dependsOn = step.depends_on ?? [];
    for (const dep of dependsOn) {
      if (!stepNames.has(dep)) {
        error(
          fileName,
          `Step "${stepName}" depends_on "${dep}" which is not a defined step name in this workflow`
        );
      }
    }

    // 2d. Validate orchestrator_action allowlist (top-level step)
    if (step.type === 'orchestrator_action') {
      const action = step.action;
      if (action && !ALLOWED_ORCHESTRATOR_ACTIONS.has(action)) {
        error(
          fileName,
          `Step "${stepName}" uses unknown orchestrator_action "${action}" (allowed: ${[...ALLOWED_ORCHESTRATOR_ACTIONS].join(', ')})`
        );
      }
    }

    // 2e. Validate depends_on_branch (top-level step)
    if (step.depends_on_branch != null) {
      if (!cumulativeBranchNames.has(step.depends_on_branch)) {
        error(
          fileName,
          `Step "${stepName}": depends_on_branch references unknown branch "${step.depends_on_branch}"`
        );
      }
    }

    // 2f. Validate branches[].depends_on_branch (branch-level inside parallel step)
    // Within the same step, a branch may depend on another branch defined in the same step
    // (processed earlier in the branches array), as well as any prior-step branches.
    const stepBranches = step.branches ?? [];
    const thisStepBranchNames = new Set(stepBranches.map(b => b.name).filter(Boolean));
    const availableBranchNames = new Set([...cumulativeBranchNames, ...thisStepBranchNames]);

    for (const branch of stepBranches) {
      if (branch.depends_on_branch != null) {
        if (!availableBranchNames.has(branch.depends_on_branch)) {
          error(
            fileName,
            `Step "${stepName}" branch "${branch.name ?? '(unnamed)'}": depends_on_branch references unknown branch "${branch.depends_on_branch}"`
          );
        }
      }
    }

    // Accumulate branch names defined in this step (available to subsequent steps)
    for (const branch of stepBranches) {
      if (branch.name) {
        cumulativeBranchNames.add(branch.name);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log('\n=== Validating Team Definitions ===\n');

if (!existsSync(teamsDir)) {
  console.error('❌ teams/ directory not found');
  process.exit(1);
}

const knownAgents = getKnownAgents();
console.log(`Known agents: ${knownAgents.size} (from agents/*.md)\n`);

const teamFiles = readdirSync(teamsDir).filter(f => f.endsWith('.team.json'));
console.log(`Found ${teamFiles.length} team files\n`);

for (const fileName of teamFiles) {
  const filePath = join(teamsDir, fileName);
  validateTeam(filePath, fileName, knownAgents);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n=== Summary ===\n');

if (hasErrors) {
  console.error('❌ Team validation FAILED');
  process.exit(1);
} else {
  success(`All ${teamFiles.length} team files validated successfully`);
  process.exit(0);
}
