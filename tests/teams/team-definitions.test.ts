import { describe, expect, it } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filenameLocal = fileURLToPath(import.meta.url);
const __dirnameLocal = dirname(__filenameLocal);
const ROOT = join(__dirnameLocal, '..', '..');
const TEAMS_DIR = join(ROOT, 'teams');
const TEAM_SCHEMA_PATH = join(ROOT, 'schemas', 'team.schema.json');
const TEAM_STATE_SCHEMA_PATH = join(ROOT, 'schemas', 'team-state.schema.json');
const TEAM_ORCHESTRATOR_PATH = join(ROOT, 'agents', 'team-orchestrator.md');

function readTeamFiles(): string[] {
  return readdirSync(TEAMS_DIR)
    .filter(file => file.endsWith('.team.json'))
    .sort();
}

function readTeam(file: string): Record<string, any> {
  return JSON.parse(readFileSync(join(TEAMS_DIR, file), 'utf-8'));
}

function buildContextManifest(chapter: number, refs: string[]) {
  return refs.map(ref => ({
    ref,
    source_type: 'file',
    loaded_at: '2026-06-21T00:12:00Z',
    status: 'loaded',
    required: true,
    used_by: ['orchestrator', 'validate'],
    freshness_checked_at: '2026-06-21T00:12:00Z',
    blocking: false,
    version: `chapter-${chapter}`,
  }));
}

describe('team definitions', () => {
  it('all team presets should satisfy team.schema.json', () => {
    const schema = JSON.parse(readFileSync(TEAM_SCHEMA_PATH, 'utf-8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);
    const teamFiles = readTeamFiles();

    expect(teamFiles.length).toBeGreaterThan(0);

    const failures: string[] = [];
    for (const file of teamFiles) {
      const team = JSON.parse(readFileSync(join(TEAMS_DIR, file), 'utf-8'));
      if (!validate(team)) {
        failures.push(`${file}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it('quality-gated teams should preserve validator issue provenance', () => {
    const teamFiles = readTeamFiles();
    const failures: string[] = [];

    for (const file of teamFiles) {
      const team = readTeam(file);
      if (!team.quality_gates?.enabled) continue;

      const policy = team.quality_gates.issue_policy;
      const fields = policy?.required_issue_fields ?? [];

      if (policy?.preserve_issue_codes !== true) {
        failures.push(`${file}: preserve_issue_codes must be true`);
      }
      for (const field of ['code', 'severity', 'source_agent', 'evidence', 'directive']) {
        if (!fields.includes(field)) {
          failures.push(`${file}: issue_policy.required_issue_fields missing ${field}`);
        }
      }
      if (policy?.merge_strategy !== 'dedupe_by_code_highest_severity') {
        failures.push(`${file}: merge_strategy must dedupe by highest severity`);
      }
      expect(policy?.severity_order).toEqual(['critical', 'major', 'minor']);
      if (policy?.critical_blocks_pass !== true) {
        failures.push(`${file}: critical_blocks_pass must be true`);
      }
      if (policy?.directive_priority !== 'critical_first') {
        failures.push(`${file}: directive_priority must be critical_first`);
      }
      if (policy?.provenance_required !== true) {
        failures.push(`${file}: provenance_required must be true`);
      }
      if (!['block', 'retry', 'block_or_retry'].includes(policy?.critical_action)) {
        failures.push(`${file}: critical_action is invalid`);
      }
      if (team.workflow?.type === 'pipeline' && policy?.critical_action !== 'block' && !policy?.retry_from_step) {
        failures.push(`${file}: pipeline retry policy must define retry_from_step`);
      }
    }

    expect(failures).toEqual([]);
  });

  it('team orchestrator should apply issue policy before declaring PASS', () => {
    const orchestrator = readFileSync(TEAM_ORCHESTRATOR_PATH, 'utf-8');

    expect(orchestrator).toContain('quality_gates.issue_policy');
    expect(orchestrator).toContain('issueRegistry');
    expect(orchestrator).toContain('mergeIssues');
    expect(orchestrator).toContain('dedupe_by_code_highest_severity');
    expect(orchestrator).toContain('critical_blocks_pass');
    expect(orchestrator).toContain('source_agent');
    expect(orchestrator).toContain('evidence');
    expect(orchestrator).toContain('retry_from_step');
    expect(orchestrator).toContain('This issue policy is mandatory');
  });

  it('team state schema should validate failed quality-gate trace attribution', () => {
    const schema = JSON.parse(readFileSync(TEAM_STATE_SCHEMA_PATH, 'utf-8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    const failedTeamState = {
      team_id: 'team_verification-team_20260621_001200',
      team_definition: 'verification-team.team.json',
      status: 'failed',
      context: {
        novel_id: 'novel_20260621_000000',
        chapter: 12,
        target_files: ['chapters/chapter_012.md', 'chapters/chapter_012.json']
      },
      context_manifest: buildContextManifest(12, [
        'chapters/chapter_012.md',
        'chapters/chapter_012.json'
      ]),
      members: [
        {
          agent: 'critic',
          status: 'completed',
          task_id: 't1',
          started_at: '2026-06-21T00:12:05Z',
          completed_at: '2026-06-21T00:13:10Z',
          result: {
            score: 82,
            verdict: 'FAIL'
          }
        },
        {
          agent: 'beta-reader',
          status: 'completed',
          task_id: 't2',
          started_at: '2026-06-21T00:12:05Z',
          completed_at: '2026-06-21T00:13:12Z',
          result: {
            score: 79,
            verdict: 'PASS'
          }
        }
      ],
      workflow_progress: {
        total_steps: 1,
        completed_steps: 1,
        current_step: 'validate'
      },
      quality_gate: {
        enabled: true,
        results: {
          critic: {
            score: 82,
            threshold: 85,
            pass: false,
            verdict: 'FAIL'
          },
          'beta-reader': {
            score: 79,
            threshold: 75,
            pass: true,
            verdict: 'PASS'
          }
        },
        overall_pass: false,
        composite_score: 80.5
      },
      execution_trace: [
        {
          trace_event_id: 'trace_validate_critic_dispatch',
          step_id: 'validate',
          step_name: 'parallel_validation',
          agent: 'orchestrator',
          event_type: 'dispatch',
          timestamp: '2026-06-21T00:12:05Z',
          status: 'completed',
          input_refs: ['chapters/chapter_012.md', 'chapters/chapter_012.json'],
          output_refs: ['task:t1']
        },
        {
          trace_event_id: 'trace_validate_critic_issue',
          step_id: 'validate',
          step_name: 'parallel_validation',
          agent: 'critic',
          event_type: 'validator_issue',
          timestamp: '2026-06-21T00:13:10Z',
          status: 'failed',
          input_refs: ['task:t1', 'chapters/chapter_012.md'],
          output_refs: ['issue:manuscript-long-hook-thread-not-advanced'],
          depends_on: ['trace_validate_critic_dispatch'],
          issue_codes: ['manuscript-long-hook-thread-not-advanced'],
          evidence: ['장기 떡밥의 단서가 반복되지만 새 정보나 상태 변화가 없다.'],
          directive: '장기 미스터리에 새 단서, 해석 변화, 추적 행동 중 하나를 추가한다.',
          score: 82,
          verdict: 'FAIL'
        },
        {
          trace_event_id: 'trace_validate_gate_block',
          step_id: 'quality_gate',
          step_name: 'quality_gate',
          agent: 'orchestrator',
          event_type: 'block',
          timestamp: '2026-06-21T00:13:15Z',
          status: 'blocked',
          input_refs: ['issue:manuscript-long-hook-thread-not-advanced'],
          output_refs: ['failure_attribution', 'recovery_plan'],
          depends_on: ['trace_validate_critic_issue'],
          issue_codes: ['manuscript-long-hook-thread-not-advanced'],
          evidence: ['critical_blocks_pass=true and critic score 82 < threshold 85'],
          directive: 'retry_from_step 또는 revise 단계로 되돌린다.'
        }
      ],
      failure_attribution: {
        status: 'confirmed',
        responsible_agent: 'critic',
        decisive_step: 'validate',
        failure_mode: 'quality_gate_block',
        supporting_trace_events: ['trace_validate_critic_issue', 'trace_validate_gate_block'],
        recoverability: 'requires_revision',
        recommended_retry_from_step: 'revise',
        propagated_to: ['trace_validate_gate_block'],
        counterfactual_fix: 'validate 단계에서 지적된 장기 떡밥 정체를 수정하면 quality_gate 차단 조건이 해소된다.',
        rationale: '첫 실패 issue를 생성한 critic trace가 품질 게이트 차단의 직접 입력이다.'
      },
      recovery_plan: {
        status: 'planned',
        from_step: 'revise',
        intervention_type: 'rerun_pipeline_from_step',
        preserve_prefix_trace_until: 'trace_validate_critic_issue',
        target_agents: ['editor', 'critic'],
        required_context_refs: [
          'chapters/chapter_012.md',
          'issue:manuscript-long-hook-thread-not-advanced',
          'directive:장기 미스터리에 새 단서, 해석 변화, 추적 행동 중 하나를 추가한다.'
        ],
        directives_to_apply: [
          '장기 훅 단서가 반복되는 문단을 새 정보, 가설 변화, 추적 행동 중 하나로 수정한다.'
        ],
        issue_codes: ['manuscript-long-hook-thread-not-advanced'],
        success_criteria: [
          'critic score >= 85',
          'manuscript-long-hook-thread-not-advanced issue absent',
          'quality_gate.overall_pass === true'
        ],
        verification_commands: [
          'npx vitest run tests/teams/team-definitions.test.ts',
          '/team run verification-team 12'
        ],
        rollback_refs: ['chapters/chapter_012.md@pre-revise'],
        rationale:
          '원인 trace 이전 dispatch와 critic issue는 보존하고, 수정 가능한 원고 단계부터 재실행하면 전체 팀 run을 반복하지 않고 차단 issue를 검증할 수 있다.'
      },
      started_at: '2026-06-21T00:12:00Z',
      completed_at: '2026-06-21T00:13:15Z',
      last_updated: '2026-06-21T00:13:15Z'
    };

    expect(validate(failedTeamState), ajv.errorsText(validate.errors, { separator: '; ' })).toBe(true);
  });

  it('team state schema should validate validator disagreement conflict ledger', () => {
    const schema = JSON.parse(readFileSync(TEAM_STATE_SCHEMA_PATH, 'utf-8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    const conflictTeamState = {
      team_id: 'team_verification-team_20260621_002000',
      team_definition: 'verification-team.team.json',
      status: 'failed',
      context: {
        novel_id: 'novel_20260621_000000',
        chapter: 9,
        target_files: ['chapters/chapter_009.md']
      },
      context_manifest: buildContextManifest(9, ['chapters/chapter_009.md']),
      members: [
        {
          agent: 'critic',
          status: 'completed',
          task_id: 't1',
          result: {
            score: 78,
            verdict: 'FAIL'
          }
        },
        {
          agent: 'beta-reader',
          status: 'completed',
          task_id: 't2',
          result: {
            score: 89,
            verdict: 'PASS'
          }
        }
      ],
      workflow_progress: {
        total_steps: 1,
        completed_steps: 1,
        current_step: 'validate'
      },
      quality_gate: {
        enabled: true,
        results: {
          critic: {
            score: 78,
            threshold: 85,
            pass: false,
            verdict: 'FAIL'
          },
          'beta-reader': {
            score: 89,
            threshold: 75,
            pass: true,
            verdict: 'PASS'
          }
        },
        overall_pass: false,
        composite_score: 83.5
      },
      validation_conflicts: [
        {
          conflict_id: 'conflict_validate_pass_fail_001',
          conflict_type: 'pass_fail_split',
          agents: ['critic', 'beta-reader'],
          severity: 'major',
          issue_codes: ['manuscript-reader-desire-not-evidenced'],
          trace_event_ids: ['trace_validate_critic_issue', 'trace_validate_beta_result'],
          status: 'blocked',
          minority_position:
            'critic failed the chapter because reader desire was not evidenced, while beta-reader passed on atmosphere and sentence polish.',
          winning_decision: 'BLOCK_UNTIL_REVISED',
          resolution:
            'major issue code와 evidence를 갖춘 FAIL 의견이므로 평균 점수로 덮지 않고 revision directive로 승격한다.',
          required_follow_up: [
            'revise manuscript-reader-desire-not-evidenced',
            'rerun verification-team'
          ],
          blocks_pass: true,
          rationale:
            '대작 품질 게이트에서는 소수 major FAIL이 실제 독자 이탈 위험을 가리킬 수 있으므로 resolved 전까지 PASS할 수 없다.'
        }
      ],
      execution_trace: [
        {
          trace_event_id: 'trace_validate_critic_issue',
          step_id: 'validate',
          step_name: 'parallel_validation',
          agent: 'critic',
          event_type: 'validator_issue',
          timestamp: '2026-06-21T00:20:10Z',
          status: 'failed',
          input_refs: ['task:t1', 'chapters/chapter_009.md'],
          output_refs: ['issue:manuscript-reader-desire-not-evidenced'],
          issue_codes: ['manuscript-reader-desire-not-evidenced'],
          evidence: ['주인공이 원하는 결과와 실패 비용이 원고의 장면 행동으로 드러나지 않는다.'],
          directive: '주인공이 반드시 얻고 싶은 결과와 실패 시 잃는 것을 장면 행동으로 드러낸다.',
          score: 78,
          verdict: 'FAIL'
        },
        {
          trace_event_id: 'trace_validate_beta_result',
          step_id: 'validate',
          step_name: 'parallel_validation',
          agent: 'beta-reader',
          event_type: 'agent_result',
          timestamp: '2026-06-21T00:20:12Z',
          status: 'completed',
          input_refs: ['task:t2', 'chapters/chapter_009.md'],
          output_refs: ['gate_results.beta-reader'],
          score: 89,
          verdict: 'PASS'
        },
        {
          trace_event_id: 'trace_validate_gate_block',
          step_id: 'quality_gate',
          step_name: 'quality_gate',
          agent: 'orchestrator',
          event_type: 'block',
          timestamp: '2026-06-21T00:20:15Z',
          status: 'blocked',
          input_refs: ['conflict:conflict_validate_pass_fail_001'],
          output_refs: ['failure_attribution', 'recovery_plan'],
          depends_on: ['trace_validate_critic_issue', 'trace_validate_beta_result'],
          issue_codes: ['manuscript-reader-desire-not-evidenced'],
          evidence: ['unresolved blocking validation conflict'],
          directive: 'validator_conflict를 해결할 때까지 PASS하지 않는다.'
        }
      ],
      failure_attribution: {
        status: 'confirmed',
        responsible_agent: 'orchestrator',
        decisive_step: 'quality_gate',
        failure_mode: 'validator_conflict',
        supporting_trace_events: [
          'trace_validate_critic_issue',
          'trace_validate_beta_result',
          'trace_validate_gate_block'
        ],
        recoverability: 'requires_revision',
        recommended_retry_from_step: 'revise',
        propagated_to: ['trace_validate_gate_block'],
        counterfactual_fix:
          '소수 FAIL이 지적한 독자 욕망 근거를 원고에 추가하면 validation conflict가 해소된다.',
        rationale:
          'PASS와 FAIL이 갈렸고 FAIL 쪽이 major issue code, evidence, directive를 제공했으므로 품질 게이트 차단 원인은 validator_conflict다.'
      },
      recovery_plan: {
        status: 'planned',
        from_step: 'revise',
        intervention_type: 'rerun_pipeline_from_step',
        preserve_prefix_trace_until: 'trace_validate_critic_issue',
        target_agents: ['editor', 'critic', 'beta-reader'],
        required_context_refs: [
          'chapters/chapter_009.md',
          'conflict:conflict_validate_pass_fail_001',
          'issue:manuscript-reader-desire-not-evidenced'
        ],
        directives_to_apply: [
          '주인공이 반드시 얻고 싶은 결과와 실패 시 잃는 것을 장면 행동으로 드러낸다.'
        ],
        issue_codes: ['manuscript-reader-desire-not-evidenced'],
        success_criteria: [
          'validation_conflicts contains no unresolved blocking conflict',
          'critic score >= 85',
          'quality_gate.overall_pass === true'
        ],
        verification_commands: ['/team run verification-team 9'],
        rollback_refs: ['chapters/chapter_009.md@pre-revise'],
        rationale:
          '이견을 만든 원고 근거를 수정한 뒤 두 검증자를 다시 실행하면 평균 점수로 누락된 독자 욕망 결함을 재검증할 수 있다.'
      }
    };

    expect(validate(conflictTeamState), ajv.errorsText(validate.errors, { separator: '; ' })).toBe(true);
  });

  it('team state schema should require context manifest for quality-gated runs', () => {
    const schema = JSON.parse(readFileSync(TEAM_STATE_SCHEMA_PATH, 'utf-8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);

    const stateWithoutManifest = {
      team_id: 'team_verification-team_20260621_002500',
      team_definition: 'verification-team.team.json',
      status: 'running',
      context: {
        novel_id: 'novel_20260621_000000',
        chapter: 7,
        target_files: ['chapters/chapter_007.md'],
      },
      members: [{ agent: 'critic', status: 'running' }],
      workflow_progress: {
        total_steps: 1,
        completed_steps: 0,
        current_step: 'validate',
      },
      quality_gate: {
        enabled: true,
      },
    };

    expect(validate(stateWithoutManifest)).toBe(false);
    expect(ajv.errorsText(validate.errors)).toContain("must have required property 'context_manifest'");
  });

  it('team state schema should validate stale context attribution and recovery', () => {
    const schema = JSON.parse(readFileSync(TEAM_STATE_SCHEMA_PATH, 'utf-8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);

    const staleContextState = {
      team_id: 'team_revision-team_20260621_002700',
      team_definition: 'revision-team.team.json',
      status: 'failed',
      context: {
        novel_id: 'novel_20260621_000000',
        chapter: 14,
        target_files: ['chapters/chapter_014.md', 'context/summaries/chapter_013.md'],
      },
      context_manifest: [
        {
          ref: 'chapters/chapter_014.md',
          source_type: 'file',
          loaded_at: '2026-06-21T00:27:00Z',
          status: 'loaded',
          required: true,
          used_by: ['editor', 'critic'],
          freshness_checked_at: '2026-06-21T00:27:00Z',
          blocking: false,
          version: 'chapter-14-v2',
        },
        {
          ref: 'context/summaries/chapter_013.md',
          source_type: 'file',
          loaded_at: '2026-06-21T00:27:00Z',
          status: 'stale',
          required: true,
          used_by: ['editor', 'critic'],
          freshness_checked_at: '2026-06-21T00:27:03Z',
          stale_reason: 'summary mtime predates latest chapter_013 revision used by current plot handoff',
          blocking: true,
          version: 'summary-13-v1',
        },
      ],
      members: [
        { agent: 'editor', status: 'skipped' },
        { agent: 'critic', status: 'skipped' },
      ],
      workflow_progress: {
        total_steps: 3,
        completed_steps: 0,
        current_step: 'context_freshness_check',
      },
      quality_gate: {
        enabled: true,
        overall_pass: false,
      },
      execution_trace: [
        {
          trace_event_id: 'trace_context_manifest_check',
          step_id: 'context_freshness_check',
          step_name: 'context_freshness_check',
          agent: 'orchestrator',
          event_type: 'block',
          timestamp: '2026-06-21T00:27:03Z',
          status: 'blocked',
          input_refs: ['context/summaries/chapter_013.md', 'chapters/chapter_014.md'],
          output_refs: ['context_manifest', 'failure_attribution', 'recovery_plan'],
          issue_codes: ['stale-context'],
          evidence: ['context/summaries/chapter_013.md is stale before validator dispatch'],
          directive: 'Regenerate or reread the chapter 13 summary before rerunning revision-team.',
        },
      ],
      failure_attribution: {
        status: 'confirmed',
        responsible_agent: 'orchestrator',
        decisive_step: 'context_freshness_check',
        failure_mode: 'stale_context',
        supporting_trace_events: ['trace_context_manifest_check'],
        recoverability: 'retry_from_step',
        recommended_retry_from_step: 'context_freshness_check',
        counterfactual_fix:
          '최신 chapter_013 summary를 다시 읽고 context_manifest status를 loaded로 바꾸면 editor/critic dispatch를 시작할 수 있다.',
        rationale:
          '품질 게이트 팀의 required context가 stale 상태라 검증자에게 전달하기 전 오케스트레이터가 실행을 차단했다.',
      },
      recovery_plan: {
        status: 'planned',
        from_step: 'context_freshness_check',
        intervention_type: 'revise_context',
        target_agents: ['editor', 'critic'],
        required_context_refs: ['context/summaries/chapter_013.md', 'chapters/chapter_013.md'],
        directives_to_apply: ['Regenerate context/summaries/chapter_013.md from the latest chapter_013 manuscript.'],
        issue_codes: ['stale-context'],
        success_criteria: [
          'context_manifest entry context/summaries/chapter_013.md status === loaded',
          'no required context_manifest entry has blocking === true',
        ],
        verification_commands: ['/team run revision-team 14'],
        rationale:
          '컨텍스트만 최신화하면 기존 원고 prefix를 보존하고 revision-team을 같은 입력 조건에서 재실행할 수 있다.',
      },
    };

    expect(validate(staleContextState), ajv.errorsText(validate.errors, { separator: '; ' })).toBe(true);
  });

  it('team state schema should require handoff contracts when trace contains handoff', () => {
    const schema = JSON.parse(readFileSync(TEAM_STATE_SCHEMA_PATH, 'utf-8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);

    const stateWithoutHandoffContracts = {
      team_id: 'team_revision-team_20260621_003000',
      team_definition: 'revision-team.team.json',
      status: 'running',
      context: {
        novel_id: 'novel_20260621_000000',
        chapter: 9,
        target_files: ['chapters/chapter_009.md'],
      },
      members: [
        { agent: 'critic', status: 'completed' },
        { agent: 'editor', status: 'running' },
      ],
      workflow_progress: {
        total_steps: 3,
        completed_steps: 1,
        current_step: 'revise',
      },
      execution_trace: [
        {
          trace_event_id: 'trace_validate_to_revise_handoff',
          step_id: 'handoff_validate_to_revise',
          step_name: 'handoff_validate_to_revise',
          agent: 'orchestrator',
          event_type: 'handoff',
          timestamp: '2026-06-21T00:30:00Z',
          status: 'completed',
          input_refs: ['issue:manuscript-reader-desire-not-evidenced'],
          output_refs: ['task:editor-revise-input'],
        },
      ],
    };

    expect(validate(stateWithoutHandoffContracts)).toBe(false);
    expect(ajv.errorsText(validate.errors)).toContain("must have required property 'handoff_contracts'");
  });

  it('team state schema should validate handoff loss attribution and recovery', () => {
    const schema = JSON.parse(readFileSync(TEAM_STATE_SCHEMA_PATH, 'utf-8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);

    const handoffLossState = {
      team_id: 'team_revision-team_20260621_003100',
      team_definition: 'revision-team.team.json',
      status: 'failed',
      context: {
        novel_id: 'novel_20260621_000000',
        chapter: 9,
        target_files: ['chapters/chapter_009.md'],
      },
      context_manifest: buildContextManifest(9, ['chapters/chapter_009.md']),
      members: [
        {
          agent: 'critic',
          status: 'completed',
          task_id: 't1',
          result: {
            score: 78,
            verdict: 'FAIL',
          },
        },
        {
          agent: 'editor',
          status: 'skipped',
          task_id: 't2',
        },
      ],
      workflow_progress: {
        total_steps: 3,
        completed_steps: 1,
        current_step: 'handoff_acceptance_check',
      },
      quality_gate: {
        enabled: true,
        overall_pass: false,
      },
      handoff_contracts: [
        {
          handoff_id: 'handoff_critic_to_editor_001',
          from_agent: 'critic',
          to_agent: 'editor',
          from_step: 'validate',
          to_step: 'revise',
          trace_event_ids: [
            'trace_validate_critic_issue',
            'trace_validate_to_revise_handoff',
            'trace_handoff_acceptance_check',
          ],
          input_refs: ['issue:manuscript-reader-desire-not-evidenced', 'chapters/chapter_009.md'],
          output_refs: ['task:editor-revise-input'],
          required_payloads: [
            {
              kind: 'issue',
              ref: 'issue:manuscript-reader-desire-not-evidenced',
              status: 'present',
              source_trace_event_id: 'trace_validate_critic_issue',
            },
            {
              kind: 'directive',
              ref: 'directive:주인공이 반드시 얻고 싶은 결과와 실패 시 잃는 것을 장면 행동으로 드러낸다.',
              status: 'weakened',
              source_trace_event_id: 'trace_validate_critic_issue',
              notes:
                'editor input paraphrased the directive into a generic pacing cleanup and dropped the failure-cost requirement.',
            },
            {
              kind: 'evidence',
              ref: 'evidence:주인공의 실패 비용이 장면 행동으로 드러나지 않는다.',
              status: 'missing',
              source_trace_event_id: 'trace_validate_critic_issue',
            },
          ],
          acceptance_criteria: [
            'editor prompt contains the original issue code',
            'editor prompt contains the original directive without weaker wording',
            'editor prompt cites the concrete evidence snippet',
          ],
          status: 'blocked',
          loss_risks: [
            'directive weakening hides the protagonist desire defect',
            'missing evidence makes the revision non-actionable',
          ],
          verified_by: 'orchestrator',
          blocks_pass: true,
          rationale:
            'major validator directive was weakened before the editor step, so the team cannot claim PASS or retry the pipeline from the editor input.',
        },
      ],
      execution_trace: [
        {
          trace_event_id: 'trace_validate_critic_issue',
          step_id: 'validate',
          step_name: 'parallel_validation',
          agent: 'critic',
          event_type: 'validator_issue',
          timestamp: '2026-06-21T00:31:00Z',
          status: 'failed',
          input_refs: ['chapters/chapter_009.md'],
          output_refs: ['issue:manuscript-reader-desire-not-evidenced'],
          issue_codes: ['manuscript-reader-desire-not-evidenced'],
          evidence: ['주인공의 실패 비용이 장면 행동으로 드러나지 않는다.'],
          directive: '주인공이 반드시 얻고 싶은 결과와 실패 시 잃는 것을 장면 행동으로 드러낸다.',
          score: 78,
          verdict: 'FAIL',
        },
        {
          trace_event_id: 'trace_validate_to_revise_handoff',
          step_id: 'handoff_validate_to_revise',
          step_name: 'handoff_validate_to_revise',
          agent: 'orchestrator',
          event_type: 'handoff',
          timestamp: '2026-06-21T00:31:10Z',
          status: 'completed',
          input_refs: [
            'issue:manuscript-reader-desire-not-evidenced',
            'directive:주인공이 반드시 얻고 싶은 결과와 실패 시 잃는 것을 장면 행동으로 드러낸다.',
          ],
          output_refs: ['handoff:handoff_critic_to_editor_001', 'task:editor-revise-input'],
          depends_on: ['trace_validate_critic_issue'],
          issue_codes: ['manuscript-reader-desire-not-evidenced'],
          directive: '주인공이 반드시 얻고 싶은 결과와 실패 시 잃는 것을 장면 행동으로 드러낸다.',
        },
        {
          trace_event_id: 'trace_handoff_acceptance_check',
          step_id: 'handoff_acceptance_check',
          step_name: 'handoff_acceptance_check',
          agent: 'orchestrator',
          event_type: 'block',
          timestamp: '2026-06-21T00:31:12Z',
          status: 'blocked',
          input_refs: ['handoff:handoff_critic_to_editor_001'],
          output_refs: ['failure_attribution', 'recovery_plan'],
          depends_on: ['trace_validate_to_revise_handoff'],
          issue_codes: ['manuscript-reader-desire-not-evidenced'],
          evidence: ['directive payload weakened and evidence payload missing before editor dispatch'],
          directive: 'Rebuild editor input from the original critic issue before revising.',
        },
      ],
      failure_attribution: {
        status: 'confirmed',
        responsible_agent: 'orchestrator',
        decisive_step: 'handoff_acceptance_check',
        failure_mode: 'handoff_loss',
        supporting_trace_events: [
          'trace_validate_critic_issue',
          'trace_validate_to_revise_handoff',
          'trace_handoff_acceptance_check',
        ],
        recoverability: 'retry_from_step',
        recommended_retry_from_step: 'handoff_validate_to_revise',
        propagated_to: ['trace_handoff_acceptance_check'],
        counterfactual_fix:
          'editor 입력에 원래 issue, directive, evidence를 그대로 포함하면 handoff 계약을 accepted로 만들고 revise 단계로 진행할 수 있다.',
        rationale:
          'critic의 actionable directive가 editor 입력으로 넘어가며 약화되고 evidence가 누락되어 handoff_loss가 품질 게이트 차단 원인이다.',
      },
      recovery_plan: {
        status: 'planned',
        from_step: 'handoff_validate_to_revise',
        intervention_type: 'rerun_pipeline_from_step',
        preserve_prefix_trace_until: 'trace_validate_critic_issue',
        target_agents: ['orchestrator', 'editor'],
        required_context_refs: [
          'handoff:handoff_critic_to_editor_001',
          'issue:manuscript-reader-desire-not-evidenced',
          'directive:주인공이 반드시 얻고 싶은 결과와 실패 시 잃는 것을 장면 행동으로 드러낸다.',
          'evidence:주인공의 실패 비용이 장면 행동으로 드러나지 않는다.',
        ],
        directives_to_apply: [
          'Rebuild editor input with the original critic issue code, directive, and evidence before dispatch.',
        ],
        issue_codes: ['manuscript-reader-desire-not-evidenced'],
        success_criteria: [
          'handoff_contracts[0].status === accepted',
          'all required_payloads have status present',
          'editor prompt contains the failure-cost directive',
        ],
        verification_commands: ['/team run revision-team 9'],
        rollback_refs: ['task:editor-revise-input@pre-handoff-check'],
        rationale:
          '원인 trace는 보존하고 handoff boundary부터 다시 만들면 editor가 약화된 지시가 아니라 원래 결함을 수정하게 된다.',
      },
    };

    expect(validate(handoffLossState), ajv.errorsText(validate.errors, { separator: '; ' })).toBe(true);
  });

  it('team orchestrator should require replayable trace and failure attribution in team reports', () => {
    const orchestrator = readFileSync(TEAM_ORCHESTRATOR_PATH, 'utf-8');

    expect(orchestrator).toContain('execution_trace');
    expect(orchestrator).toContain('context_manifest');
    expect(orchestrator).toContain('failure_attribution');
    expect(orchestrator).toContain('recovery_plan');
    expect(orchestrator).toContain('trace_event_id');
    expect(orchestrator).toContain('supporting_trace_events');
    expect(orchestrator).toContain('decisive_step');
    expect(orchestrator).toContain('recoverability');
    expect(orchestrator).toContain('Do not overwrite the earliest originating failure');
  });

  it('team orchestrator should require handoff contracts before PASS', () => {
    const orchestrator = readFileSync(TEAM_ORCHESTRATOR_PATH, 'utf-8');

    expect(orchestrator).toContain('Step 5-A-2: Verify Handoff Contracts Before PASS');
    expect(orchestrator).toContain('handoff_contracts');
    expect(orchestrator).toContain('required_payloads');
    expect(orchestrator).toContain('handoff_acceptance_check');
    expect(orchestrator).toContain('handoff_loss');
    expect(orchestrator).toContain('weakened');
    expect(orchestrator).toContain('Do not declare PASS when a required handoff payload is missing');
  });

  it('team orchestrator should block quality gates on missing or stale context', () => {
    const orchestrator = readFileSync(TEAM_ORCHESTRATOR_PATH, 'utf-8');

    expect(orchestrator).toContain('Step 5-0: Build Context Manifest Before Agent Dispatch');
    expect(orchestrator).toContain('context_freshness_check');
    expect(orchestrator).toContain('blockingContextEntries');
    expect(orchestrator).toContain('missing_evidence');
    expect(orchestrator).toContain('stale_context');
    expect(orchestrator).toContain('stopBeforeAgentDispatch');
    expect(orchestrator).toContain('do not declare PASS when required context is missing, stale, superseded, or untracked');
  });

  it('team orchestrator should require targeted recovery plans after attribution', () => {
    const orchestrator = readFileSync(TEAM_ORCHESTRATOR_PATH, 'utf-8');

    expect(orchestrator).toContain('Step 5-C: Generate Targeted Recovery Plan');
    expect(orchestrator).toContain('prefix-preserving replay');
    expect(orchestrator).toContain('preserve_prefix_trace_until');
    expect(orchestrator).toContain('directives_to_apply');
    expect(orchestrator).toContain('success_criteria');
    expect(orchestrator).toContain('verification_commands');
    expect(orchestrator).toContain('Do not restart the whole team');
  });

  it('team orchestrator should preserve validator disagreements before PASS', () => {
    const orchestrator = readFileSync(TEAM_ORCHESTRATOR_PATH, 'utf-8');

    expect(orchestrator).toContain('Step 5-A-1: Preserve Validator Disagreements Before PASS');
    expect(orchestrator).toContain('validation_conflicts');
    expect(orchestrator).toContain('detectValidationConflicts');
    expect(orchestrator).toContain('pass_fail_split');
    expect(orchestrator).toContain('severity_disagreement');
    expect(orchestrator).toContain('score_spread');
    expect(orchestrator).toContain('minority position');
    expect(orchestrator).toContain('major minority issue blocks PASS');
    expect(orchestrator).toContain('validator_conflict');
  });
});
