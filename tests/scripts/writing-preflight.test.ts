import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, rm, utimes, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const root = process.cwd()
const tempRoots: string[] = []

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

describe('writing executable preflight gates', () => {
  it('blocks codex manuscript writing before model execution when gate reports are missing', async () => {
    const project = await createProject()

    const result = runNode('scripts/codex-writer.mjs', [
      '--chapter', '1',
      '--project', project,
      '--mode', 'write',
    ])
    const output = combinedOutput(result)

    expect(result.status).toBe(2)
    expect(output).toContain('집필 전 설계/문체 gate가 PASS가 아니므로 중단합니다')
    expect(output).toContain('design-gate-report-missing')
    expect(output).toContain('style-gate-report-missing')
    expect(output).toContain('run-premise-appeal-benchmark')
    expect(output).toContain('apply-design-gate')
    expect(output).toContain('run-prose-taste-benchmark')
    expect(output).toContain('apply-style-gate')
    expect(output).not.toContain('codex CLI를 찾을 수 없습니다')
    expect(existsSync(join(project, 'chapters', 'ch001.md'))).toBe(false)
    expect(existsSync(join(project, 'chapters', 'chapter_001.md'))).toBe(false)
  })

  it('allows codex dry-run prompt inspection without gate reports', async () => {
    const project = await createProject()

    const result = runNode('scripts/codex-writer.mjs', [
      '--chapter', '1',
      '--project', project,
      '--mode', 'write',
      '--dry-run',
    ])
    const output = combinedOutput(result)

    expect(result.status).toBe(0)
    expect(output).toContain('--dry-run 모드')
    expect(result.stdout).toContain('=== SYSTEM PROMPT ===')
    expect(result.stdout).toContain('=== USER PROMPT ===')
    expect(output).not.toContain('gate가 PASS가 아니므로 중단합니다')
  })

  it('surfaces blocked style gate issue codes and report recommendations for codex revise', async () => {
    const project = await createProject()
    await writeGateReports(project, {
      style: {
        status: 'BLOCKED',
        passed: false,
        issues: [{ code: 'prose-taste-not-ready' }],
        recommendedCommands: ['node custom-style-command.mjs --project test'],
      },
    })

    const result = runNode('scripts/codex-writer.mjs', [
      '--chapter', '1',
      '--project', project,
      '--mode', 'revise',
    ])
    const output = combinedOutput(result)

    expect(result.status).toBe(2)
    expect(output).toContain('prose-taste-not-ready')
    expect(output).toContain('node custom-style-command.mjs --project test')
    expect(output).not.toContain('codex CLI를 찾을 수 없습니다')
  })

  it('blocks codex chapter writing when the prior manuscript summary is missing', async () => {
    const project = await createProject()
    await writeGateReports(project)
    await writeFile(join(project, 'chapters', 'chapter_001.md'), '서진은 시장에서 검은 인장을 발견하고, 숲에서 들려온 소문이 왕가의 실종 사건과 이어진다는 단서를 붙잡았다.', 'utf8')

    const result = runNode('scripts/codex-writer.mjs', [
      '--chapter', '2',
      '--project', project,
      '--mode', 'write',
    ])
    const output = combinedOutput(result)

    expect(result.status).toBe(2)
    expect(output).toContain('summary memory gate')
    expect(output).toContain('summary-memory-missing')
    expect(output).toContain('chapter_001_summary.md')
    expect(output).toContain('chapter_001.md')
    expect(output).toContain('/verify-chapter 1')
    expect(output).not.toContain('codex CLI를 찾을 수 없습니다')
  })

  it('blocks codex chapter writing when the prior summary is older than the manuscript', async () => {
    const project = await createProject()
    await writeGateReports(project)
    const manuscript = join(project, 'chapters', 'chapter_001.md')
    const summary = join(project, 'context', 'summaries', 'chapter_001_summary.md')
    await writeFile(manuscript, '서진은 시장에서 검은 인장을 발견하고, 숲에서 들려온 소문이 왕가의 실종 사건과 이어진다는 단서를 붙잡았다.', 'utf8')
    await writeFile(summary, substantiveSummary(), 'utf8')
    await utimes(summary, new Date('2025-01-01T00:00:00Z'), new Date('2025-01-01T00:00:00Z'))
    await utimes(manuscript, new Date('2025-01-02T00:00:00Z'), new Date('2025-01-02T00:00:00Z'))

    const result = runNode('scripts/codex-writer.mjs', [
      '--chapter', '2',
      '--project', project,
      '--mode', 'write',
    ])
    const output = combinedOutput(result)

    expect(result.status).toBe(2)
    expect(output).toContain('summary-memory-stale')
    expect(output).toContain('chapter_001_summary.md')
    expect(output).not.toContain('codex CLI를 찾을 수 없습니다')
  })

  it('blocks codex chapter writing when the prior summary is too thin to carry story state', async () => {
    const project = await createProject()
    await writeGateReports(project)
    const manuscript = join(project, 'chapters', 'chapter_001.md')
    const summary = join(project, 'context', 'summaries', 'chapter_001_summary.md')
    await writeFile(manuscript, '서진은 시장에서 검은 인장을 발견하고, 숲에서 들려온 소문이 왕가의 실종 사건과 이어진다는 단서를 붙잡았다.', 'utf8')
    await writeFile(summary, '서진이 단서를 찾았다.', 'utf8')
    await utimes(manuscript, new Date('2025-01-01T00:00:00Z'), new Date('2025-01-01T00:00:00Z'))
    await utimes(summary, new Date('2025-01-02T00:00:00Z'), new Date('2025-01-02T00:00:00Z'))

    const result = runNode('scripts/codex-writer.mjs', [
      '--chapter', '2',
      '--project', project,
      '--mode', 'write',
    ])
    const output = combinedOutput(result)

    expect(result.status).toBe(2)
    expect(output).toContain('summary-memory-too-thin')
    expect(output).not.toContain('codex CLI를 찾을 수 없습니다')
  })

  it('passes summary memory preflight when prior summaries are fresh and substantive', async () => {
    const project = await createProject()
    await writeGateReports(project)
    const manuscript = join(project, 'chapters', 'chapter_001.md')
    const summary = join(project, 'context', 'summaries', 'chapter_001_summary.md')
    await writeFile(manuscript, '서진은 시장에서 검은 인장을 발견하고, 숲에서 들려온 소문이 왕가의 실종 사건과 이어진다는 단서를 붙잡았다.', 'utf8')
    await writeFile(summary, substantiveSummary(), 'utf8')
    await utimes(manuscript, new Date('2025-01-01T00:00:00Z'), new Date('2025-01-01T00:00:00Z'))
    await utimes(summary, new Date('2025-01-02T00:00:00Z'), new Date('2025-01-02T00:00:00Z'))
    const { evaluateWritingPreflight } = await import('../../scripts/writing-preflight.mjs')

    const result = evaluateWritingPreflight(project, { chapterNumber: 2 })

    expect(result.passed).toBe(true)
    expect(result.failures).toEqual([])
  })

  it('blocks Grok rewrites before API key checks and output writes when gates are missing', async () => {
    const project = await createProject()
    const input = join(project, 'chapters', 'chapter_001.md')
    const outputPath = join(project, 'chapters', 'chapter_001.polished.md')
    await writeFile(input, '도입부\n\n<!-- ADULT_1_START -->\n장면\n<!-- ADULT_1_END -->\n', 'utf8')

    const result = runNode('scripts/adult-rewriter.mjs', [
      '--input', input,
      '--project', project,
      '--mode', 'adult',
      '--output', outputPath,
    ])
    const output = combinedOutput(result)

    expect(result.status).toBe(2)
    expect(output).toContain('Grok 리라이트 전 설계/문체 gate가 PASS가 아니므로 중단합니다')
    expect(output).toContain('design-gate-report-missing')
    expect(output).toContain('style-gate-report-missing')
    expect(output).not.toContain('XAI_API_KEY를 찾을 수 없습니다')
    expect(existsSync(outputPath)).toBe(false)
    expect(existsSync(`${input}.bak`)).toBe(false)
  })

  it('allows Grok dry-run marker inspection without gate reports', async () => {
    const project = await createProject()
    const input = join(project, 'chapters', 'chapter_001.md')
    await writeFile(input, '도입부\n\n<!-- ADULT_1_START -->\n장면\n<!-- ADULT_1_END -->\n', 'utf8')

    const result = runNode('scripts/adult-rewriter.mjs', [
      '--input', input,
      '--project', project,
      '--mode', 'adult',
      '--dry-run',
    ])
    const output = combinedOutput(result)

    expect(result.status).toBe(0)
    expect(output).toContain('[DRY-RUN]')
    expect(result.stdout).toContain('"dryRun": true')
    expect(result.stdout).toContain('"markersFound": 1')
    expect(output).not.toContain('gate가 PASS가 아니므로 중단합니다')
  })
})

async function createProject() {
  const dir = await mkdtemp(join(tmpdir(), 'writing-preflight-'))
  tempRoots.push(dir)

  await mkdir(join(dir, 'chapters'), { recursive: true })
  await mkdir(join(dir, 'context', 'summaries'), { recursive: true })
  await mkdir(join(dir, 'meta'), { recursive: true })
  await mkdir(join(dir, 'reviews'), { recursive: true })
  await writeJson(join(dir, 'chapters', 'chapter_001.json'), {
    title: '첫 회차',
    meta: { characters: [] },
    scenes: [],
  })
  await writeJson(join(dir, 'meta', 'project.json'), {
    id: 'test-novel',
    title: '테스트 소설',
  })
  await writeJson(join(dir, 'meta', 'style-guide.json'), {
    narrative_voice: 'third_limited',
    tense: 'past',
    tone: ['immersive'],
  })

  return dir
}

async function writeGateReports(project: string, overrides: { design?: Record<string, unknown>, style?: Record<string, unknown> } = {}) {
  await writeJson(join(project, 'reviews', 'design-gate-report.json'), {
    status: 'PASS',
    passed: true,
    issues: [],
    recommendedCommands: [],
    ...overrides.design,
  })
  await writeJson(join(project, 'reviews', 'style-gate-report.json'), {
    status: 'PASS',
    passed: true,
    issues: [],
    recommendedCommands: [],
    ...overrides.style,
  })
}

async function writeJson(filePath: string, value: unknown) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function substantiveSummary() {
  return [
    '# 1화 요약: 검은 인장',
    '',
    '서진은 아케디아 시장에서 검은 인장을 지닌 남자를 목격했고, 그 인장이 왕가 실종 사건과 연결된다는 소문을 들었다.',
    '그는 숲의 경계에서 인장이 남긴 재 냄새와 은빛 실을 확인했으며, 다음 회차에서는 단서를 따라 금지된 숲으로 들어가야 한다.',
  ].join('\n')
}

function runNode(scriptPath: string, args: string[]) {
  return spawnSync(process.execPath, [join(root, scriptPath), ...args], {
    cwd: root,
    encoding: 'utf8',
  })
}

function combinedOutput(result: ReturnType<typeof runNode>) {
  return `${result.stdout}\n${result.stderr}`
}
