import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const repoRoot = process.cwd()

function readText(path: string): string {
  return readFileSync(join(repoRoot, path), 'utf8')
}

describe('documentation catalogs', () => {
  const agentNames = readdirSync(join(repoRoot, 'agents'))
    .filter((name) => name.endsWith('.md') && name !== 'AGENTS.md')
    .map((name) => name.replace(/\.md$/, ''))
    .sort()

  const skillNames = readdirSync(join(repoRoot, 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  const teamFiles = readdirSync(join(repoRoot, 'teams'))
    .filter((name) => name.endsWith('.team.json'))
    .sort()

  it('root AGENTS.md should advertise current catalog counts', () => {
    const doc = readText('AGENTS.md')

    expect(doc).toContain(
      `featuring ${agentNames.length} specialized agents and ${skillNames.length} skills`,
    )
    expect(doc).toContain(`| \`agents/\` | Agent prompt files | ${agentNames.length} specialized agent definitions |`)
    expect(doc).toContain(`| \`teams/\` | Team presets | ${teamFiles.length} preset team definitions`)
  })

  it('README.md should advertise current skill and agent counts', () => {
    const doc = readText('README.md')

    expect(doc).toContain(`**${agentNames.length}개 전문 에이전트**`)
    expect(doc).toContain(`**${skillNames.length}개 스킬**`)
    expect(doc).toContain(`## 커맨드 레퍼런스 (${skillNames.length}개 스킬)`)
    expect(doc).toContain(`## 에이전트 (${agentNames.length}개)`)
  })

  it('agents/AGENTS.md should list every agent file', () => {
    const doc = readText('agents/AGENTS.md')

    expect(doc).toContain(`**${agentNames.length} functional agents**`)
    for (const agentName of agentNames) {
      expect(doc).toContain(`| ${agentName} |`)
    }
  })

  it('teams/AGENTS.md should list every team preset file', () => {
    const doc = readText('teams/AGENTS.md')

    expect(doc).toContain(`## Preset Teams (${teamFiles.length}개)`)
    for (const teamFile of teamFiles) {
      expect(doc).toContain(`\`${teamFile}\``)
    }
  })
})
