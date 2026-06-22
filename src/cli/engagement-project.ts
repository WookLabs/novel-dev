import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  evaluateEngagementContract,
  type CharacterReferenceForEvaluation,
  type CharacterVoiceReferenceForEvaluation,
  type ChapterWithReaderExperience,
} from '../quality/engagement-contract.js';
import { recordEngagementEvaluation } from '../self-improvement/quality-tracker.js';

export interface RecordEngagementProjectArgs {
  projectDir: string;
  projectId?: string;
  chapterNumber: number;
  version: number;
}

export interface RecordEngagementCliResult {
  projectId: string;
  chapterNumber: number;
  version: number;
  passed: boolean;
  score: number;
  alertLevel: string;
  regressionDetected: boolean;
  trendPath: string;
  totalSnapshots: number;
  regressionAlertsFired: number;
  issues: unknown[];
  revisionDirectives: unknown[];
  recurringEngagementDirectives: unknown[];
  breakdown: unknown;
}

export async function recordEngagementFromProject(
  args: RecordEngagementProjectArgs
): Promise<RecordEngagementCliResult> {
  const projectDir = path.resolve(args.projectDir);
  const [
    project,
    design,
    plot,
    chapter,
    manuscript,
    relationships,
    hooks,
    previousChapters,
    previousManuscripts,
  ] = await Promise.all([
    readOptionalJson(path.join(projectDir, 'meta', 'project.json')),
    readJson(path.join(projectDir, 'meta', 'design-strategy.json')),
    readJson(path.join(projectDir, 'plot', 'plot-strategy.json')),
    readJson(path.join(projectDir, 'chapters', `chapter_${padChapter(args.chapterNumber)}.json`)),
    readOptionalChapterManuscript(projectDir, args.chapterNumber),
    readOptionalJson(path.join(projectDir, 'characters', 'relationships.json')),
    readOptionalJson(path.join(projectDir, 'plot', 'hooks.json')),
    readPreviousChapters(projectDir, args.chapterNumber),
    readPreviousManuscripts(projectDir, args.chapterNumber),
  ]);

  const projectId =
    args.projectId ??
    project?.project_id ??
    project?.id ??
    path.basename(projectDir);
  const characters = await loadChapterCharacters(projectDir, chapter);

  const evaluation = evaluateEngagementContract({
    design,
    plot,
    chapter,
    characters,
    relationships,
    hooks,
    manuscript,
    previousChapters,
    previousManuscripts,
  });
  const record = await recordEngagementEvaluation({
    projectDir,
    projectId,
    chapterNumber: args.chapterNumber,
    version: args.version,
    evaluation,
  });

  return {
    projectId,
    chapterNumber: args.chapterNumber,
    version: args.version,
    passed: evaluation.passed,
    score: evaluation.score,
    alertLevel: record.regression.alertLevel,
    regressionDetected: record.regression.regressionDetected,
    trendPath: path.join(projectDir, 'meta', 'quality-trend.json'),
    totalSnapshots: record.trendData.metadata.totalSnapshots,
    regressionAlertsFired: record.trendData.metadata.regressionAlertsFired,
    issues: evaluation.issues,
    revisionDirectives: evaluation.revisionDirectives,
    recurringEngagementDirectives: record.recurringEngagementDirectives,
    breakdown: evaluation.breakdown,
  };
}

function padChapter(chapterNumber: number): string {
  return String(chapterNumber).padStart(3, '0');
}

async function readJson(filePath: string): Promise<any> {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

async function readOptionalJson(filePath: string): Promise<any | undefined> {
  try {
    return await readJson(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

async function readOptionalChapterManuscript(
  projectDir: string,
  chapterNumber: number
): Promise<string | undefined> {
  const paddedChapter = padChapter(chapterNumber);
  return (
    (await readOptionalText(path.join(projectDir, 'chapters', `chapter_${paddedChapter}.md`))) ??
    (await readOptionalText(path.join(projectDir, 'chapters', `ch${paddedChapter}.md`)))
  );
}

async function readPreviousChapters(
  projectDir: string,
  chapterNumber: number
): Promise<ChapterWithReaderExperience[]> {
  const previousNumbers = previousChapterNumbers(chapterNumber);
  const chapters = await Promise.all(
    previousNumbers.map(previousNumber =>
      readOptionalJson(
        path.join(projectDir, 'chapters', `chapter_${padChapter(previousNumber)}.json`)
      )
    )
  );
  return chapters.filter(
    (chapter): chapter is ChapterWithReaderExperience => chapter !== undefined
  );
}

async function readPreviousManuscripts(
  projectDir: string,
  chapterNumber: number
): Promise<string[]> {
  const previousNumbers = previousChapterNumbers(chapterNumber);
  const manuscripts = await Promise.all(
    previousNumbers.map(previousNumber =>
      readOptionalChapterManuscript(projectDir, previousNumber)
    )
  );
  return manuscripts.filter(
    (manuscript): manuscript is string => typeof manuscript === 'string' && manuscript.trim().length > 0
  );
}

function previousChapterNumbers(chapterNumber: number): number[] {
  return [chapterNumber - 2, chapterNumber - 1].filter(
    previousNumber => previousNumber >= 1
  );
}

async function readOptionalText(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

async function loadChapterCharacters(
  projectDir: string,
  chapter: any
): Promise<CharacterReferenceForEvaluation[]> {
  const sceneCharacterIds = Array.isArray(chapter?.scenes)
    ? chapter.scenes.flatMap((scene: any) =>
        Array.isArray(scene?.characters) ? scene.characters : []
      )
    : [];
  const characterIds = new Set<string>([
    ...(Array.isArray(chapter?.meta?.characters) ? chapter.meta.characters : []),
    ...(typeof chapter?.meta?.pov_character === 'string' ? [chapter.meta.pov_character] : []),
    ...sceneCharacterIds.filter(
      (characterId: unknown): characterId is string => typeof characterId === 'string'
    ),
  ]);
  if (characterIds.size === 0) {
    return [];
  }

  const index = await readOptionalJson(path.join(projectDir, 'characters', 'index.json'));
  const indexedCharacters = new Map<string, CharacterReferenceForEvaluation>();
  for (const entry of index?.characters ?? []) {
    if (entry?.id && entry?.name) {
      indexedCharacters.set(entry.id, {
        id: entry.id,
        name: entry.name,
        aliases: Array.isArray(entry.aliases) ? entry.aliases : undefined,
        role: entry.role,
        voice: normalizeCharacterVoice(entry.voice ?? entry.basic?.voice ?? entry),
        inner: normalizeCharacterInner(entry.inner),
      });
    }
  }

  const characters: CharacterReferenceForEvaluation[] = [];
  for (const characterId of characterIds) {
    const profile = await readOptionalJson(
      path.join(projectDir, 'characters', `${characterId}.json`)
    );
    const indexed = indexedCharacters.get(characterId);
    const name = profile?.name ?? indexed?.name;
    if (!name) {
      continue;
    }

    characters.push({
      id: characterId,
      name,
      aliases: [
        ...(Array.isArray(indexed?.aliases) ? indexed.aliases : []),
        ...(Array.isArray(profile?.aliases) ? profile.aliases : []),
      ],
      role: profile?.role ?? indexed?.role,
      voice:
        normalizeCharacterVoice(profile?.basic?.voice ?? profile?.voice ?? profile) ??
        indexed?.voice,
      inner: normalizeCharacterInner(profile?.inner) ?? indexed?.inner,
    });
  }

  return characters;
}

function normalizeCharacterVoice(
  voice: any
): CharacterVoiceReferenceForEvaluation | undefined {
  if (!voice || typeof voice !== 'object') {
    return undefined;
  }

  const signaturePhrases = Array.isArray(voice.signature_phrases)
    ? voice.signature_phrases.filter((phrase: unknown): phrase is string => typeof phrase === 'string')
    : undefined;
  const formalityLevel = normalizeFormalityLevel(voice.formality_level);
  const normalized: CharacterVoiceReferenceForEvaluation = {
    tone: typeof voice.tone === 'string' ? voice.tone : undefined,
    speech_pattern:
      typeof voice.speech_pattern === 'string' ? voice.speech_pattern : undefined,
    vocabulary: typeof voice.vocabulary === 'string' ? voice.vocabulary : undefined,
    signature_phrases: signaturePhrases,
    dialect: typeof voice.dialect === 'string' ? voice.dialect : undefined,
    formality_level: formalityLevel,
  };

  return normalized.tone ||
    normalized.speech_pattern ||
    normalized.vocabulary ||
    (normalized.signature_phrases?.length ?? 0) > 0 ||
    normalized.dialect ||
    normalized.formality_level
    ? normalized
    : undefined;
}

function normalizeFormalityLevel(
  value: unknown
): CharacterVoiceReferenceForEvaluation['formality_level'] | undefined {
  return value === 'very_formal' ||
    value === 'formal' ||
    value === 'neutral' ||
    value === 'casual' ||
    value === 'very_casual'
    ? value
    : undefined;
}

function normalizeCharacterInner(inner: any): CharacterReferenceForEvaluation['inner'] {
  if (!inner || typeof inner !== 'object') {
    return undefined;
  }

  const normalized = {
    want: typeof inner.want === 'string' ? inner.want : undefined,
    need: typeof inner.need === 'string' ? inner.need : undefined,
    fatal_flaw: typeof inner.fatal_flaw === 'string' ? inner.fatal_flaw : undefined,
  };

  return normalized.want || normalized.need || normalized.fatal_flaw ? normalized : undefined;
}
