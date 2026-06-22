import { describe, expect, it } from 'vitest'
import Ajv from 'ajv'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { evaluateEngagementContract } from '../../src/index.js'

const root = process.cwd()
const sampleProject = join(root, 'tests', 'fixtures', 'sample-project')

function readJson<T = any>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function validateWithSchema(schemaName: string, data: unknown): string[] {
  const schema = readJson(join(root, 'schemas', schemaName))
  const ajv = new Ajv({ allErrors: true, strict: false })
  const validate = ajv.compile(schema)

  if (validate(data)) {
    return []
  }

  return (validate.errors ?? []).map(error => `${error.instancePath || '/'} ${error.message}`)
}

describe('golden sample project masterpiece contract', () => {
  it('keeps reader promise, plot fun specs, and chapter reader experience aligned', () => {
    const designPath = join(sampleProject, 'meta', 'design-strategy.json')
    const plotPath = join(sampleProject, 'plot', 'plot-strategy.json')

    expect(existsSync(designPath)).toBe(true)
    expect(existsSync(plotPath)).toBe(true)

    const design = readJson(designPath)
    const plot = readJson(plotPath)

    expect(validateWithSchema('design-strategy.schema.json', design)).toEqual([])
    expect(validateWithSchema('plot-strategy.schema.json', plot)).toEqual([])

    const chapterFiles = readdirSync(join(sampleProject, 'chapters'))
      .filter(file => /^chapter_\d{3}\.json$/.test(file))
      .sort()

    expect(chapterFiles.length).toBe(plot.per_chapter_guide.length)

    for (const chapterFile of chapterFiles) {
      const chapter = readJson(join(sampleProject, 'chapters', chapterFile))
      const manuscriptPath = join(sampleProject, 'chapters', chapterFile.replace(/\.json$/, '.md'))
      expect(existsSync(manuscriptPath), `${chapterFile} should have matching manuscript`).toBe(true)
      const manuscript = readFileSync(manuscriptPath, 'utf8')
      const guide = plot.per_chapter_guide.find((item: any) => item.chapter === chapter.chapter_number)
      const engagement = evaluateEngagementContract({ design, plot, chapter, manuscript })

      expect(guide, `${chapterFile} should have matching plot guide`).toBeDefined()
      expect(validateWithSchema('chapter.schema.json', chapter)).toEqual([])
      expect(engagement, `${chapterFile} should pass engagement contract`).toMatchObject({
        passed: true,
        issues: [],
      })
      expect(engagement.score).toBeGreaterThanOrEqual(90)
      expect(chapter.reader_experience.chapter_reward).toBe(guide.fun_spec.reader_reward)
      expect(chapter.reader_experience.page_turner_question).toBe(guide.fun_spec.page_turn_question)
      expect(chapter.reader_experience.character_appeal_moment).toBe(
        guide.fun_spec.character_appeal_moment,
      )
      expect(chapter.reader_experience.drop_off_risk).toBe(guide.fun_spec.drop_off_risk)
      expect(chapter.reader_experience.must_click_ending).toBe(guide.fun_spec.must_click_ending)
    }
  })
})
