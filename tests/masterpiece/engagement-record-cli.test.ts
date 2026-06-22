import { afterEach, describe, expect, it } from 'vitest';
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const sampleProject = join(root, 'tests', 'fixtures', 'sample-project');

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

describe('engagement record CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('evaluates a chapter and persists engagement trend evidence', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toMatchObject({
      chapterNumber: 1,
      version: 1,
      passed: true,
      alertLevel: 'none',
      trendPath: join(projectDir, 'meta', 'quality-trend.json'),
    });
    expect(output.score).toBeGreaterThanOrEqual(90);
    expect(output.revisionDirectives).toEqual([]);

    const trendPath = join(projectDir, 'meta', 'quality-trend.json');
    expect(existsSync(trendPath)).toBe(true);

    const trend = await readJson(trendPath);
    expect(trend.snapshots).toHaveLength(1);
    expect(trend.snapshots[0]).toMatchObject({
      chapterNumber: 1,
      version: 1,
      dimensions: {
        engagement: output.score,
      },
      verdict: 'PASS',
    });
  });

  it('loads previous chapters and rejects serial escalation repetition', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-serial-variety-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const firstChapter = await readJson(join(projectDir, 'chapters', 'chapter_001.json'));
    const secondChapterPath = join(projectDir, 'chapters', 'chapter_002.json');
    const secondChapter = await readJson(secondChapterPath);
    secondChapter.reader_experience = { ...firstChapter.reader_experience };
    secondChapter.context.current_plot = firstChapter.context.current_plot;
    secondChapter.narrative_elements = { ...firstChapter.narrative_elements };
    secondChapter.scenes = firstChapter.scenes.map((scene: any) => ({
      ...scene,
      characters: secondChapter.meta.characters,
    }));
    secondChapter.style_guide.focus = firstChapter.style_guide.focus;
    await writeFile(
      secondChapterPath,
      `${JSON.stringify(secondChapter, null, 2)}\n`,
      'utf8'
    );

    const plotPath = join(projectDir, 'plot', 'plot-strategy.json');
    const plot = await readJson(plotPath);
    plot.per_chapter_guide[1].arc_beats = plot.per_chapter_guide[0].arc_beats;
    plot.per_chapter_guide[1].fun_spec = { ...plot.per_chapter_guide[0].fun_spec };
    plot.tension_curve.key_peaks[1].event = plot.tension_curve.key_peaks[0].event;
    await writeFile(plotPath, `${JSON.stringify(plot, null, 2)}\n`, 'utf8');

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '2',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'serial-escalation-variety-not-staged',
          priority: 'critical',
          target: 'plot_strategy',
        }),
      ])
    );
  });

  it('loads previous chapters and rejects missing cliffhanger carryover', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-carryover-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const chapterPath = join(projectDir, 'chapters', 'chapter_002.json');
    const chapter = await readJson(chapterPath);
    chapter.context.current_plot =
      '주인공은 경찰서 서버실에 잠입해 CCTV 로그가 예고 앱 경로를 조작했다는 단서를 발견한다. 내부자가 기록을 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.';
    chapter.reader_experience.chapter_reward =
      '경찰 내부 서버실의 CCTV 로그가 예고 앱 경로를 조작했다는 단서 발견';
    chapter.reader_experience.page_turner_question =
      '예고 앱은 왜 경찰 내부 서버 기록까지 조작할 수 있었는가?';
    chapter.reader_experience.drop_off_risk =
      '조사 반복 위험 — 경찰서 서버실 잠입과 내부자 방해로 행동 방식을 바꾼다.';
    chapter.reader_experience.must_click_ending =
      '경찰 내부자가 CCTV 로그를 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.';
    chapter.scenes = [
      {
        scene_number: 1,
        purpose: '경찰 내부 서버실 잠입으로 조사 방식을 바꾼다.',
        characters: chapter.meta.characters,
        location: 'loc_records_room',
        conflict:
          '주인공은 체포 위험과 내부자 감시를 감수하고 서버실 로그를 직접 대조해야 한다.',
        beat:
          '경찰 내부 서버실의 CCTV 로그가 예고 앱 경로를 조작했다는 단서 발견, 내부자가 기록을 삭제하며 앱 개발자의 오래된 관리자 계정 이름을 남긴다.',
        emotional_tone: '긴장',
        estimated_words: 5200,
      },
    ];
    chapter.style_guide.focus = '경찰서 서버실 잠입과 내부자 방해';
    await writeFile(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');

    const plotPath = join(projectDir, 'plot', 'plot-strategy.json');
    const plot = await readJson(plotPath);
    plot.per_chapter_guide[1].arc_beats = '경찰 내부 서버실의 CCTV 로그 조작 단서 발견';
    plot.per_chapter_guide[1].fun_spec = {
      reader_reward: chapter.reader_experience.chapter_reward,
      page_turn_question: chapter.reader_experience.page_turner_question,
      character_appeal_moment: chapter.reader_experience.character_appeal_moment,
      drop_off_risk: chapter.reader_experience.drop_off_risk,
      must_click_ending: chapter.reader_experience.must_click_ending,
    };
    await writeFile(plotPath, `${JSON.stringify(plot, null, 2)}\n`, 'utf8');

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '2',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'cliffhanger-carryover-not-staged',
          priority: 'critical',
          target: 'scenes',
        }),
      ])
    );
  });

  it('reads chapter manuscript and returns directives when prose does not stage engagement claims', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await writeFile(
      join(projectDir, 'chapters', 'chapter_001.md'),
      '주인공은 조용히 퇴근해 따뜻한 차를 마셨다. 사건은 화면 밖에서 정리되었다.\n',
      'utf8'
    );

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-reward-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
        }),
        expect.objectContaining({
          code: 'manuscript-ending-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
        }),
      ])
    );
  });

  it('loads character inner drive and fails when chapter evidence ignores it', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const characterPath = join(projectDir, 'characters', 'char_1.json');
    const character = await readJson(characterPath);
    character.inner = {
      want: '실종된 동생의 생존 증거를 찾는 것',
      need: '혼자 통제하려는 습관을 내려놓고 조력자에게 도움을 요청하는 것',
    };
    await writeFile(characterPath, `${JSON.stringify(character, null, 2)}\n`, 'utf8');

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'character-drive-not-staged',
          priority: 'critical',
          target: 'scenes',
        }),
      ])
    );
  });

  it('loads scene antagonist strategy and fails when chapter evidence ignores it', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    await writeFile(
      join(projectDir, 'characters', 'char_2.json'),
      `${JSON.stringify(
        {
          id: 'char_2',
          name: '박도현',
          aliases: ['도현'],
          role: 'antagonist',
          inner: {
            want: '예고 앱의 첫 규칙을 증명해 이서진을 다음 수신자로 몰아넣는 것',
            fatal_flaw: '피해자 기록을 조작해 모든 선택지를 통제하려는 집착',
          },
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const chapterPath = join(projectDir, 'chapters', 'chapter_001.json');
    const chapter = await readJson(chapterPath);
    chapter.scenes[1].characters = [...chapter.scenes[1].characters, 'char_2'];
    await writeFile(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'antagonist-strategy-not-staged',
          priority: 'critical',
          target: 'scenes',
        }),
      ])
    );
  });

  it('returns revision directives when engagement recording fails', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const chapterPath = join(projectDir, 'chapters', 'chapter_001.json');
    const chapter = await readJson(chapterPath);
    chapter.scenes[1].beat = '주인공은 사건 현장을 떠나 다음 날을 기다린다.';
    await writeFile(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'must-click-ending-not-staged',
          priority: 'critical',
          target: 'final_scene',
          expected: chapter.reader_experience.must_click_ending,
        }),
      ])
    );
  });

  it('loads project character names and rejects generic role labels in manuscript prose', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-generic-label-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await writeFile(
      join(projectDir, 'chapters', 'chapter_001.md'),
      [
        '# 첫 번째 알림',
        '',
        '살인을 예고하는 앱이 주인공의 이름을 첫 번째 수신자로 지목한 순간, 퇴근 직후의 휴대폰이 파란빛으로 번쩍였다. 지하보도 좌표, 17분 뒤 사망, 수신자는 주인공 한 명뿐. 왜 지금일까? 알림음은 얇은 금속처럼 귀를 찔렀고, 차가운 유리 화면에는 손끝의 땀이 번졌다.',
        '장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 한다. 주인공은 숫자의 배열을 먼저 붙잡았다. 주인공이 경찰 신고보다 현장 도착 시간을 먼저 계산해 복도 끝에서 엘리베이터 버튼을 누르고 지하보도 입구까지 계단을 내려가며 뛰쳐나간다.',
        '주인공은 제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼진다. 통제선 앞 문턱에서 철문 손잡이를 당겼지만 안쪽 차단물이 길을 막았다. 현장 도착이 늦은 대가로 피해자는 이미 쓰러졌고, 실패가 상황을 되돌릴 수 없게 바꿨다. 쓰러진 피해자의 휴대폰 로그와 현장 기록의 빈칸이 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감이 목덜미를 조였다.',
        '피해자의 휴대폰에서 새 예고가 뜨며 주인공 이름과 과거 미제 사건 번호가 현재 사건 기록에 함께 연결되자, 주인공은 차갑게 식은 화면을 움켜쥐고 왜 첫 수신자가 자신인지, 앱이 실제 살인을 어떻게 알았는지 모른 채 숨을 삼켰다.',
      ].join('\n'),
      'utf8'
    );

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-generic-character-label-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('이서진'),
        }),
      ])
    );
  });

  it('loads project character voice profile and rejects drift in attributed manuscript dialogue', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-voice-profile-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const manuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      manuscript.replace(
        '피해자의 화면에는 앱 로고가 남아 있었다.',
        [
          '이서진이 피해자의 휴대폰을 들어 올렸다. "지금 넘겨."',
          '이서진이 잠긴 철문을 두드렸다. "빨리 확인해."',
          '',
          '피해자의 화면에는 앱 로고가 남아 있었다.',
        ].join('\n')
      ),
      'utf8'
    );

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-profile-drift',
          priority: 'critical',
          target: 'manuscript',
          expected: expect.stringContaining('character dialogue should preserve'),
        }),
      ])
    );
  });

  it('loads nested voice signature phrases and rejects borrowed character phrasing', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-voice-signature-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const firstCharacterPath = join(projectDir, 'characters', 'char_1.json');
    const firstCharacter = await readJson(firstCharacterPath);
    firstCharacter.basic = {
      ...(firstCharacter.basic ?? {}),
      voice: {
        formality_level: 'formal',
        signature_phrases: ['먼저 기록부터 보겠습니다', '숫자는 거짓말을 못 합니다'],
      },
    };
    await writeFile(firstCharacterPath, `${JSON.stringify(firstCharacter, null, 2)}\n`, 'utf8');

    await writeFile(
      join(projectDir, 'characters', 'char_2.json'),
      `${JSON.stringify(
        {
          id: 'char_2',
          name: '한도윤',
          role: 'support',
          basic: {
            voice: {
              formality_level: 'formal',
              signature_phrases: ['선은 이미 넘어갔습니다', '증거는 제 쪽에 있습니다'],
            },
          },
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const chapterPath = join(projectDir, 'chapters', 'chapter_001.json');
    const chapter = await readJson(chapterPath);
    chapter.meta.characters = [...chapter.meta.characters, 'char_2'];
    chapter.scenes = chapter.scenes.map((scene: any) => ({
      ...scene,
      characters: [...scene.characters, 'char_2'],
    }));
    await writeFile(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const manuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      manuscript.replace(
        '피해자의 화면에는 앱 로고가 남아 있었다.',
        [
          '이서진이 피해자의 휴대폰을 들어 올렸다. "선은 이미 넘어갔습니다."',
          '이서진이 현장 기록을 접었다. "증거는 제 쪽에 있습니다."',
          '',
          '피해자의 화면에는 앱 로고가 남아 있었다.',
        ].join('\n')
      ),
      'utf8'
    );

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-profile-drift',
          priority: 'critical',
          actual: expect.stringContaining('borrowed another character'),
        }),
      ])
    );
  });

  it('loads nested voice vocabulary and rejects borrowed or avoided word choice', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-voice-vocabulary-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const firstCharacterPath = join(projectDir, 'characters', 'char_1.json');
    const firstCharacter = await readJson(firstCharacterPath);
    firstCharacter.basic = {
      ...(firstCharacter.basic ?? {}),
      voice: {
        formality_level: 'formal',
        vocabulary: '선호 어휘: 현장로그, 증거번호; 금지 어휘: 운명, 대충',
      },
    };
    await writeFile(firstCharacterPath, `${JSON.stringify(firstCharacter, null, 2)}\n`, 'utf8');

    await writeFile(
      join(projectDir, 'characters', 'char_2.json'),
      `${JSON.stringify(
        {
          id: 'char_2',
          name: '한도윤',
          role: 'support',
          basic: {
            voice: {
              formality_level: 'formal',
              vocabulary: '선호 어휘: 혈흔지도, 밀실각; 금지 어휘: 감으로, 어쩌면',
            },
          },
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const chapterPath = join(projectDir, 'chapters', 'chapter_001.json');
    const chapter = await readJson(chapterPath);
    chapter.meta.characters = [...chapter.meta.characters, 'char_2'];
    chapter.scenes = chapter.scenes.map((scene: any) => ({
      ...scene,
      characters: [...scene.characters, 'char_2'],
    }));
    await writeFile(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');

    const manuscriptPath = join(projectDir, 'chapters', 'chapter_001.md');
    const manuscript = await readFile(manuscriptPath, 'utf8');
    await writeFile(
      manuscriptPath,
      manuscript.replace(
        '피해자의 화면에는 앱 로고가 남아 있었다.',
        [
          '이서진이 피해자의 휴대폰을 들어 올렸다. "혈흔지도부터 다시 보겠습니다."',
          '이서진이 현장 기록을 접었다. "이건 운명 같은 게 아니라 현장로그 문제입니다."',
          '',
          '피해자의 화면에는 앱 로고가 남아 있었다.',
        ].join('\n')
      ),
      'utf8'
    );

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-character-voice-profile-drift',
          priority: 'critical',
          actual: expect.stringMatching(/preferred vocabulary|avoided vocabulary/u),
        }),
      ])
    );
  });

  it('rejects design and evaluation jargon leaked into manuscript prose', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-design-jargon-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await writeFile(
      join(projectDir, 'chapters', 'chapter_001.md'),
      [
        '# 첫 번째 알림',
        '',
        '살인을 예고하는 앱이 이서진의 이름을 첫 번째 수신자로 지목한 순간, 퇴근 직후의 휴대폰이 파란빛으로 번쩍였다.',
        '이서진은 장난으로 넘길지, 위험을 감수하고 현장으로 갈지 선택해야 했다. 공포보다 패턴을 먼저 읽고 경찰 신고보다 현장 도착 시간을 먼저 계산해 복도 끝에서 엘리베이터 버튼을 누르고 지하보도 입구까지 계단을 내려가며 뛰쳐나갔다.',
        '이서진은 제한 시간 안에 피해자를 찾으려 하지만 조명이 꺼진다. 통제선 앞 문턱에서 철문 손잡이를 당겼지만 안쪽 차단물이 길을 막았다. 현장 도착이 늦은 대가로 피해자는 이미 쓰러졌고, 실패가 상황을 되돌릴 수 없게 바꿨다.',
        '쓰러진 피해자의 휴대폰 로그와 현장 기록의 빈칸이 맞물리자, 단서가 맞물리는 지적 쾌감과 위기 직전의 긴장감을 제공한다. 매 회차 작은 규칙 증명이라는 보상 주기가 여기서 시작된다.',
        '피해자의 휴대폰에서 새 예고가 뜨며 이서진의 이름과 과거 미제 사건 번호가 현재 사건 기록에 함께 연결되자, 그는 차갑게 식은 화면을 움켜쥐고 왜 첫 수신자가 자신인지 모른 채 숨을 삼켰다.',
      ].join('\n'),
      'utf8'
    );

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '1',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manuscript-design-jargon-not-evidenced',
          priority: 'critical',
          target: 'manuscript',
          actual: expect.stringContaining('지적 쾌감'),
        }),
      ])
    );
  });

  it('loads relationship state and rejects unrecorded relationship evolution', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-relationship-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await writeFile(
      join(projectDir, 'characters', 'relationships.json'),
      `${JSON.stringify(
        {
          relationships: [
            {
              from: 'char_1',
              to: 'char_support_1',
              type: 'colleague',
              dynamic: 'investigative partners with fragile trust',
              evolution: [],
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '2',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'relationship-evolution-not-recorded',
          priority: 'critical',
          target: 'relationships',
          expected: expect.stringContaining('관계 변화 기록'),
        }),
      ])
    );
  });

  it('loads hook ledger and rejects mistimed mystery hook reveals', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-hook-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });
    await writeFile(
      join(projectDir, 'plot', 'hooks.json'),
      `${JSON.stringify(
        {
          mystery_hooks: [
            {
              id: 'hook_first_receiver',
              content: '앱이 왜 이서진을 첫 번째 수신자로 골랐는가',
              plant_chapter: 1,
              reveal_chapter: 1,
            },
            {
              id: 'hook_second_target',
              content: '두 번째 예고 대상이 왜 조력자인가',
              plant_chapter: 2,
              reveal_chapter: 4,
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        '--project',
        projectDir,
        '--chapter',
        '2',
        '--version',
        '1',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.passed).toBe(false);
    expect(output.revisionDirectives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'hook-reveal-timing-mismatch',
          priority: 'critical',
          target: 'hooks_ledger',
          expected: expect.stringContaining('reveal_chapter'),
        }),
      ])
    );
  });

  it('returns recurring revision directives after repeated engagement failures', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'engagement-cli-test-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    for (const chapterNumber of [1, 2]) {
      const chapterPath = join(
        projectDir,
        'chapters',
        `chapter_${String(chapterNumber).padStart(3, '0')}.json`
      );
      const chapter = await readJson(chapterPath);
      chapter.scenes[chapter.scenes.length - 1].beat =
        '주인공은 단서를 정리한 뒤 아무 위기 없이 하루를 마무리한다.';
      await writeFile(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8');
    }

    const cliPath = join(workDir, 'record-engagement.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'record-engagement.ts')],
      outfile: cliPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      logLevel: 'silent',
    });

    for (const chapterNumber of [1, 2]) {
      const result = spawnSync(
        process.execPath,
        [
          cliPath,
          '--project',
          projectDir,
          '--chapter',
          String(chapterNumber),
          '--version',
          '1',
          '--json',
        ],
        { encoding: 'utf8' }
      );

      expect(result.status, result.stderr).toBe(0);
      if (chapterNumber === 2) {
        const output = JSON.parse(result.stdout);
        expect(output.recurringEngagementDirectives).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: 'must-click-ending-not-staged',
              count: 2,
              firstChapter: 1,
              latestChapter: 2,
            }),
          ])
        );
      }
    }
  });

  it('exports engagement recording from the root public API', async () => {
    const api = await import('../../src/index.js');

    expect(api).toHaveProperty('evaluateEngagementContract');
    expect(api).toHaveProperty('recordEngagementEvaluation');
  });
});
