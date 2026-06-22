import { afterEach, describe, expect, it } from 'vitest';
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const sampleProject = join(root, 'tests', 'fixtures', 'sample-project');

const CLEAN_BALANCED = `
비가 그친 뒤 골목은 조용했다.

서연은 구겨진 봉투를 다시 펴지 않았다. 안에 든 이름을 이미 알고 있었고, 그래서 더 늦게 문을 두드렸다.

"들어와."

짧은 대답 뒤로 컵이 받침에 닿는 소리가 났다. 서연은 봉투를 탁자 끝에 내려놓고, 상대가 먼저 손을 뻗을 때까지 기다렸다.
`.trim();

const IRRITATING_STYLE = `
도현은 방에 들어섰다. 감각이 왔다. 반응이 잡혔다. 변화가 있었다.

심장이 빠르게 뛰었다. 손끝이 저릿했다. 숨이 막혔다. 가슴이 조여왔다.

하나, 그는 살아야 했다. 둘, 그녀를 구해야 했다. 셋, 이 복선은 다음 회차의 보상 쾌감으로 이어질 것이다.
`.trim();

const HEDGED_STYLE = `
도현은 문 앞에 선 것 같았다. 안쪽의 침묵은 어쩐지 대답처럼 느껴졌다. 문손잡이는 묘하게 차가운 듯했다.

그는 이미 늦은 것 같았고, 돌아서는 선택도 분명하지 않은 모양이었다. 모든 판단이 어렴풋이 뒤로 밀리는 느낌이었다.
`.trim();

const ABSTRACT_FILTERED_STYLE = `
도현은 진실과 운명과 기억의 의미를 생각했다. 도현은 그 감정의 가능성을 알 수 있었다. 도현은 관계의 균열과 선택의 고통을 깨달았다. 도현은 침묵의 불안과 상처의 존재를 느꼈다. 도현은 이 모든 혼란이 결국 절망과 희망 사이에 있다는 사실을 이해했다.

그는 그 결심이 자신의 의지와 욕망을 증명한다고 생각했다. 그는 그 상실의 공허함이 구원의 가능성이라고 알 수 있었다. 그는 이 모든 감정이 아직 끝나지 않았다는 사실을 깨달았다.
`.trim();

const TRANSLATIONESE_CONNECTIVE_STYLE = `
그것은 우연이 아니었다. 그가 발견한 것은 오래된 기록의 반복이었다. 남은 것은 닫힌 문뿐이었다. 문제인 것은 아무도 그 문을 열 수 없다는 것이었다. 이 문제는 경찰에 의해 확인되었고, 그 기록에 대하여 아무도 답하지 않았다. 그녀는 이 상황에 있어서 가장 위험한 선택지를 가지고 있었다. 그가 할 수 있는 것은 기다리는 것뿐이었다.

그리고 서연은 문 앞에 섰다. 그리고 봉투를 접었다. 그리고 복도 불빛이 꺼졌다. 그리고 안쪽에서 컵이 밀리는 소리가 났다.
`.trim();

async function readJson<T = any>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

describe('prose taste benchmark CLI', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('runs project prose taste benchmark samples and stores a report', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'prose-taste-benchmark-cli-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    await writeFile(
      join(projectDir, 'meta', 'style-guide.json'),
      `${JSON.stringify(
        {
          prose_taste_profile: {
            preferred_mode: 'balanced',
            disliked_phrases: ['감각이 왔다', '반응이 잡혔다', '변화가 있었다'],
            max_hedged_perception_density_per_1000: 6,
            max_abstract_noun_density_per_1000: 12,
            max_cognitive_filter_density_per_1000: 6,
            max_therapy_speak_density_per_1000: 4,
            max_therapy_speak_run: 2,
            max_backstory_exposition_density_per_1000: 5,
            max_backstory_exposition_run: 3,
            max_relationship_montage_summary_density_per_1000: 4,
            max_relationship_montage_summary_run: 2,
            max_time_skip_summary_density_per_1000: 4,
            max_time_skip_summary_run: 2,
            max_contrastive_reframe_density_per_1000: 4,
            max_contrastive_reframe_run: 2,
            max_lore_term_density_per_1000: 10,
            max_lore_term_run: 3,
            max_system_stat_block_density_per_1000: 4,
            max_system_stat_block_run: 2,
            max_declared_resolve_density_per_1000: 5,
            max_declared_resolve_run: 3,
            max_revelation_summary_density_per_1000: 4,
            max_revelation_summary_run: 2,
            max_procedural_checklist_density_per_1000: 5,
            max_procedural_checklist_run: 3,
            max_action_choreography_density_per_1000: 6,
            max_action_choreography_run: 3,
            max_nominalized_explanation_density_per_1000: 7,
            max_translationese_formula_density_per_1000: 4,
            max_connective_starter_density_per_1000: 6,
            max_filler_adverb_density_per_1000: 5,
            max_filler_adverb_run: 4,
            max_status_quo_action_density_per_1000: 6,
            max_status_quo_action_run: 4,
            max_prop_fidget_beat_density_per_1000: 5,
            max_prop_fidget_beat_run: 3,
            min_causal_turn_density_per_1000: 1,
            max_comma_density_per_1000: 26,
            max_same_ending_run: 4,
            max_dominant_sentence_ending_share: 0.72,
            max_dominant_dialogue_ending_share: 0.82,
            max_dominant_dialogue_starter_share: 0.62,
            max_dialogue_turn_length: 170,
            max_average_dialogue_turn_length: 105,
            max_dialogue_grounding_gap_run: 6,
            max_dialogue_question_ratio: 0.66,
            max_dialogue_question_run: 4,
            max_dialogue_vocative_ratio: 0.5,
            max_dialogue_vocative_run: 3,
            max_dialogue_lexical_echo_ratio: 0.56,
            max_dialogue_lexical_echo_run: 4,
            max_dialogue_paraphrase_confirmation_ratio: 0.46,
            max_dialogue_paraphrase_confirmation_run: 3,
            max_thin_cliffhanger_ending_count: 0,
            max_pov_mind_jump_density_per_1000: 1.6,
            max_pov_mind_jump_run: 1,
            max_repeated_subject_run: 4,
            max_repeated_connective_starter_run: 3,
            max_rote_dialogue_reply_ratio: 0.5,
            max_rote_dialogue_reply_run: 3,
            max_neutral_dialogue_tag_ratio: 0.65,
            max_neutral_dialogue_tag_run: 4,
            max_silence_stall_density_per_1000: 4,
            max_silence_stall_run: 3,
            max_melodramatic_caption_density_per_1000: 4,
            max_melodramatic_caption_run: 3,
            max_facial_expression_beat_density_per_1000: 6,
            max_facial_expression_beat_run: 3,
            max_subtext_explanation_density_per_1000: 5,
            max_subtext_explanation_run: 3,
            max_ambiguous_reference_density_per_1000: 5,
            max_ambiguous_reference_run: 3,
            minimum_score: 88,
          },
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const benchmarkDir = join(projectDir, 'reviews', 'prose-taste-benchmark');
    const fixtureDir = join(benchmarkDir, 'fixtures');
    await mkdir(fixtureDir, { recursive: true });
    await writeFile(join(fixtureDir, 'clean-balanced.md'), CLEAN_BALANCED, 'utf8');
    await writeFile(
      join(benchmarkDir, 'chapter-001-style.json'),
      `${JSON.stringify(
        {
          required_reader_segments: ['genre-core', 'platform-native', 'style-sensitive'],
          minimum_reader_segment_count: 3,
          minimum_samples_per_reader_segment: 1,
          minimum_failing_samples_per_reader_segment: 1,
          maximum_dominant_reader_segment_ratio: 0.6,
          minimum_holdout_samples: 1,
          minimum_usable_holdout_samples: 1,
          minimum_failing_holdout_samples: 1,
          minimum_usable_failing_holdout_samples: 1,
          require_friction_annotations: true,
          minimum_friction_annotations: 1,
          minimum_actionable_friction_annotations: 1,
          require_style_highlight_annotations: true,
          minimum_style_highlight_annotations: 1,
          minimum_actionable_style_highlight_annotations: 1,
          require_style_highlight_quality_diversity: true,
          minimum_style_highlight_quality_count: 2,
          require_style_fingerprint_separation: true,
          minimum_style_fingerprint_samples_per_polarity: 1,
          minimum_style_fingerprint_distance: 1,
          minimum_style_fingerprint_signal_count: 1,
          samples: [
            {
              id: 'clean-balanced-pass',
              label: '선호 문체 기준 샘플',
              reader_segment: 'genre-core',
              calibration_split: 'calibration',
              chapter: 1,
              version: 2,
              content_path: 'reviews/prose-taste-benchmark/fixtures/clean-balanced.md',
              expected_passed: true,
              expected_min_score: 88,
              style_highlight_annotations: [
                {
                  location: '문단 2',
                  target_text: '서연은 봉투를 탁자 끝에 내려놓고',
                  reason: '독자가 감정 설명 없이 행동 지연과 사물 배치로 긴장을 읽었다.',
                  quality: 'subtext',
                  reader_count: 2,
                  reader_segment: 'genre-core',
                  transfer_guidance: '감정 라벨 대신 인물이 미루는 행동, 사물 배치, 대화 전 침묵으로 압박을 재현한다.',
                },
                {
                  location: '문단 2',
                  target_text: '상대가 먼저 손을 뻗을 때까지 기다렸다.',
                  reason: '짧은 행동과 기다림의 호흡이 긴장을 설명 없이 유지한다.',
                  quality: 'rhythm',
                  reader_count: 2,
                  reader_segment: 'genre-core',
                  transfer_guidance: '선호 문체를 재현할 때 행동과 지연을 한 호흡 안에서 배치해 설명 없이 리듬으로 긴장을 만든다.',
                },
              ],
            },
            {
              id: 'irritating-style-fail',
              label: '거슬리는 기능 보고체 샘플',
              reader_segment: 'genre-core',
              calibration_split: 'calibration',
              content: IRRITATING_STYLE,
              expected_passed: false,
              expected_issue_codes: [
                'functional-ai-report',
                'explicit-disliked-phrase',
                'design-jargon-in-prose',
              ],
              style_friction_annotations: [
                {
                  location: '문단 1',
                  target_text: '감각이 왔다. 반응이 잡혔다. 변화가 있었다.',
                  reason: '독자가 장면보다 기능 보고 문장을 먼저 본다고 표시했다.',
                  issue_code: 'functional-ai-report',
                  severity: 'high',
                  reader_count: 2,
                  reader_segment: 'genre-core',
                  rewrite_suggestion: '감각/반응/변화라는 요약어 대신 도현이 실제로 본 물건과 선택한 행동으로 위험을 보여준다.',
                },
                {
                  location: '문단 3',
                  target_text: '보상 쾌감',
                  reason: '기획 용어가 원고 안에 노출되어 몰입을 끊는다.',
                  issue_code: 'design-jargon-in-prose',
                  severity: 'high',
                  reader_count: 2,
                  reader_segment: 'genre-core',
                  rewrite_suggestion: '보상 쾌감이라는 단어를 지우고 지금 회차의 단서나 후폭풍으로 바꾼다.',
                },
                {
                  location: '문단 1',
                  target_text: '감각이 왔다',
                  reason: '프로젝트가 싫어하는 문구가 그대로 반복된다.',
                  issue_code: 'explicit-disliked-phrase',
                  severity: 'medium',
                  reader_count: 1,
                  reader_segment: 'genre-core',
                  rewrite_suggestion: '금지 문구를 삭제하고 감각의 원인이 되는 구체 사물이나 소리로 대체한다.',
                },
              ],
              expected_max_score: 87,
            },
            {
              id: 'hedged-style-fail',
              label: '완충 표현이 누적된 흐릿한 문체 샘플',
              reader_segment: 'platform-native',
              calibration_split: 'validation',
              content: HEDGED_STYLE,
              expected_passed: false,
              expected_issue_codes: ['hedged-perception-haze'],
              style_friction_annotations: [
                {
                  location: '문단 1',
                  reason: '같았다/느껴졌다/듯했다가 겹치며 독자가 장면을 선명하게 잡지 못한다.',
                  issue_code: 'hedged-perception-haze',
                  severity: 'medium',
                  reader_count: 2,
                  reader_segment: 'platform-native',
                  rewrite_suggestion: '완충 표현을 줄이고 문손잡이, 침묵, 인물 행동을 확정된 장면 정보로 제시한다.',
                },
              ],
              expected_max_score: 87,
            },
            {
              id: 'abstract-filtered-style-fail',
              label: '추상 설명과 인식 필터가 누적된 문체 샘플',
              reader_segment: 'style-sensitive',
              calibration_split: 'holdout',
              content: ABSTRACT_FILTERED_STYLE,
              expected_passed: false,
              expected_issue_codes: [
                'abstract-exposition-drift',
                'cognitive-filtering-overload',
                'repeated-subject-rhythm',
              ],
              style_friction_annotations: [
                {
                  location: '문단 1',
                  target_text: '진실과 운명과 기억의 의미',
                  reason: '추상 명사 묶음이 많아 독자가 장면의 물리적 압박을 보지 못한다.',
                  issue_code: 'abstract-exposition-drift',
                  severity: 'high',
                  reader_count: 2,
                  reader_segment: 'style-sensitive',
                  rewrite_suggestion: '추상 명사를 줄이고 도현이 숨기거나 붙잡은 구체 물건과 행동으로 의미를 드러낸다.',
                },
                {
                  location: '문단 1',
                  target_text: '생각했다/알 수 있었다/깨달았다',
                  reason: '인식 필터가 반복되어 독자가 사건을 직접 겪지 못한다.',
                  issue_code: 'cognitive-filtering-overload',
                  severity: 'high',
                  reader_count: 2,
                  reader_segment: 'style-sensitive',
                  rewrite_suggestion: '인식 동사를 줄이고 인물이 알아차린 외부 단서와 즉각적 행동 변화로 바꾼다.',
                },
                {
                  location: '문단 1',
                  target_text: '도현은',
                  reason: '같은 주어 반복으로 문장 리듬이 기계적으로 느껴진다.',
                  issue_code: 'repeated-subject-rhythm',
                  severity: 'medium',
                  reader_count: 1,
                  reader_segment: 'style-sensitive',
                  rewrite_suggestion: '문장 시작을 사물, 동작, 대화 반응으로 분산한다.',
                },
              ],
              expected_max_score: 87,
            },
            {
              id: 'translationese-connective-style-fail',
              label: '명사화/번역투/접속 부사 지팡이 샘플',
              reader_segment: 'platform-native',
              calibration_split: 'validation',
              content: TRANSLATIONESE_CONNECTIVE_STYLE,
              expected_passed: false,
              expected_issue_codes: [
                'nominalized-explanation-chain',
                'translationese-formula-drift',
                'connective-crutch-rhythm',
              ],
              style_friction_annotations: [
                {
                  location: '문단 1',
                  reason: '것/문제인 것은/할 수 있는 것은 같은 명사화 구조가 설명문처럼 이어진다.',
                  issue_code: 'nominalized-explanation-chain',
                  severity: 'high',
                  reader_count: 2,
                  reader_segment: 'platform-native',
                  rewrite_suggestion: '명사화 문장을 행동 주체가 있는 짧은 장면 문장으로 나눈다.',
                },
                {
                  location: '문단 1',
                  reason: '에 의해/에 대하여/가지고 있었다 같은 번역투 공식 표현이 원고를 딱딱하게 만든다.',
                  issue_code: 'translationese-formula-drift',
                  severity: 'medium',
                  reader_count: 1,
                  reader_segment: 'platform-native',
                  rewrite_suggestion: '수동/공식 표현을 한국어 자연어 동사와 주체가 보이는 문장으로 바꾼다.',
                },
                {
                  location: '문단 2',
                  target_text: '그리고',
                  reason: '같은 접속 부사로 시작하는 문장이 반복되어 리듬이 단조롭다.',
                  issue_code: 'connective-crutch-rhythm',
                  severity: 'medium',
                  reader_count: 1,
                  reader_segment: 'platform-native',
                  rewrite_suggestion: '문장 시작을 행동, 소리, 반응으로 바꾸고 불필요한 그리고를 삭제한다.',
                },
              ],
              expected_max_score: 87,
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-prose-taste-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-prose-taste-benchmark.ts')],
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
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toMatchObject({
      projectId: 'sample-project',
      samplesLoaded: 5,
      defaultProfile: {
        preferredMode: 'balanced',
        dislikedPhrases: ['감각이 왔다', '반응이 잡혔다', '변화가 있었다'],
        maxHedgedPerceptionDensityPer1000: 6,
        maxAbstractNounDensityPer1000: 12,
        maxCognitiveFilterDensityPer1000: 6,
        maxTherapySpeakDensityPer1000: 4,
        maxTherapySpeakRun: 2,
        maxBackstoryExpositionDensityPer1000: 5,
        maxBackstoryExpositionRun: 3,
        maxRelationshipMontageSummaryDensityPer1000: 4,
        maxRelationshipMontageSummaryRun: 2,
        maxTimeSkipSummaryDensityPer1000: 4,
        maxTimeSkipSummaryRun: 2,
        maxContrastiveReframeDensityPer1000: 4,
        maxContrastiveReframeRun: 2,
        maxLoreTermDensityPer1000: 10,
        maxLoreTermRun: 3,
        maxSystemStatBlockDensityPer1000: 4,
        maxSystemStatBlockRun: 2,
        maxDeclaredResolveDensityPer1000: 5,
        maxDeclaredResolveRun: 3,
        maxRevelationSummaryDensityPer1000: 4,
        maxRevelationSummaryRun: 2,
        maxProceduralChecklistDensityPer1000: 5,
        maxProceduralChecklistRun: 3,
        maxActionChoreographyDensityPer1000: 6,
        maxActionChoreographyRun: 3,
        maxNominalizedExplanationDensityPer1000: 7,
        maxTranslationeseFormulaDensityPer1000: 4,
        maxConnectiveStarterDensityPer1000: 6,
        maxFillerAdverbDensityPer1000: 5,
        maxFillerAdverbRun: 4,
        maxStatusQuoActionDensityPer1000: 6,
        maxStatusQuoActionRun: 4,
        maxPropFidgetBeatDensityPer1000: 5,
        maxPropFidgetBeatRun: 3,
        minCausalTurnDensityPer1000: 1,
        maxCommaDensityPer1000: 26,
        maxSameEndingRun: 4,
        maxDominantSentenceEndingShare: 0.72,
        maxDominantDialogueEndingShare: 0.82,
        maxDominantDialogueStarterShare: 0.62,
        maxDialogueTurnLength: 170,
        maxAverageDialogueTurnLength: 105,
        maxDialogueGroundingGapRun: 6,
        maxDialogueQuestionRatio: 0.66,
        maxDialogueQuestionRun: 4,
        maxDialogueVocativeRatio: 0.5,
        maxDialogueVocativeRun: 3,
        maxDialogueLexicalEchoRatio: 0.56,
        maxDialogueLexicalEchoRun: 4,
        maxDialogueParaphraseConfirmationRatio: 0.46,
        maxDialogueParaphraseConfirmationRun: 3,
        maxThinCliffhangerEndingCount: 0,
        maxPovMindJumpDensityPer1000: 1.6,
        maxPovMindJumpRun: 1,
        maxRepeatedSubjectRun: 4,
        maxRepeatedConnectiveStarterRun: 3,
        maxSilenceStallDensityPer1000: 4,
        maxSilenceStallRun: 3,
        maxMelodramaticCaptionDensityPer1000: 4,
        maxMelodramaticCaptionRun: 3,
        maxSubtextExplanationDensityPer1000: 5,
        maxSubtextExplanationRun: 3,
        minimumScore: 88,
      },
      benchmark: {
        total: 5,
        passed: 5,
        failed: 0,
        falsePositiveCount: 0,
        falseNegativeCount: 0,
        missingIssueCount: 0,
        scoreOutOfRangeCount: 0,
        missingStyleFrictionAnnotationCount: 0,
        weakStyleFrictionAnnotationCount: 0,
        styleFrictionAnnotationCount: 10,
        actionableStyleFrictionAnnotationCount: 10,
        missingStyleHighlightAnnotationCount: 0,
        weakStyleHighlightAnnotationCount: 0,
        styleHighlightAnnotationCount: 2,
        actionableStyleHighlightAnnotationCount: 2,
        styleHighlightQualityCount: 2,
        styleHighlightQualities: ['subtext', 'rhythm'],
        weakStyleHighlightQualityDiversityCount: 0,
        weakStyleFingerprintCount: 0,
        styleFingerprintStatus: 'separated',
        weakAuthorialStyleDriftCount: 0,
        authorialStyleDriftStatus: 'not-enough-samples',
        authorialStyleDriftPairCount: 0,
        readerSegments: ['genre-core', 'platform-native', 'style-sensitive'],
        readerSegmentRepresentativeness: 'balanced',
        splitCoverage: {
          calibrationSamples: 2,
          validationSamples: 2,
          holdoutSamples: 1,
          unassignedSamples: 0,
          usableCalibrationSamples: 2,
          usableValidationSamples: 2,
          usableHoldoutSamples: 1,
          usableUnassignedSamples: 0,
          failingHoldoutSamples: 1,
          usableFailingHoldoutSamples: 1,
        },
        underSampledHoldoutSamples: false,
        underSampledUsableHoldoutSamples: false,
        underSampledFailingHoldoutSamples: false,
        underSampledUsableFailingHoldoutSamples: false,
        splitLeakageCount: 0,
        splitLeakages: [],
        readyForStyleTuning: true,
      },
    });
    expect(output.benchmark.sampleResults[0]).toMatchObject({
      id: 'clean-balanced-pass',
      readerSegment: 'genre-core',
      calibrationSplit: 'calibration',
      chapter: 1,
      version: 2,
      contentSource: 'content_path',
      contentPath: 'reviews/prose-taste-benchmark/fixtures/clean-balanced.md',
      chapterSourceGrounded: false,
      actualPassed: true,
      scoreExpectationPassed: true,
      styleTuningUsable: true,
      styleHighlightAnnotationCoverage: 'covered',
      styleHighlightAnnotationQualities: ['subtext', 'rhythm'],
    });
    expect(output.benchmark.styleFingerprintSignalCount).toBeGreaterThan(0);
    expect(output.benchmark.styleFingerprint.signals[0]).toMatchObject({
      direction: 'disliked-higher',
    });
    expect(output.benchmark.sampleResults[1]).toMatchObject({
      id: 'irritating-style-fail',
      actualPassed: false,
      missingExpectedIssueCodes: [],
      styleTuningUsable: true,
      styleFrictionAnnotationCoverage: 'covered',
    });
    expect(output.benchmark.sampleResults[2]).toMatchObject({
      id: 'hedged-style-fail',
      actualPassed: false,
      missingExpectedIssueCodes: [],
    });
    expect(output.benchmark.sampleResults[3]).toMatchObject({
      id: 'abstract-filtered-style-fail',
      calibrationSplit: 'holdout',
      actualPassed: false,
      missingExpectedIssueCodes: [],
      styleTuningUsable: true,
    });
    expect(output.benchmark.sampleResults[4]).toMatchObject({
      id: 'translationese-connective-style-fail',
      actualPassed: false,
      missingExpectedIssueCodes: [],
    });

    const outputPath = join(projectDir, 'reviews', 'prose-taste-benchmark-report.json');
    expect(existsSync(outputPath)).toBe(true);
    const persisted = await readJson(outputPath);
    expect(persisted.benchmark.sampleResults[1].issueCodes).toEqual(
      expect.arrayContaining([
        'functional-ai-report',
        'explicit-disliked-phrase',
        'design-jargon-in-prose',
      ])
    );
    expect(persisted.benchmark.sampleResults[2].issueCodes).toEqual(
      expect.arrayContaining(['hedged-perception-haze'])
    );
    expect(persisted.benchmark.sampleResults[3].issueCodes).toEqual(
      expect.arrayContaining([
        'abstract-exposition-drift',
        'cognitive-filtering-overload',
        'repeated-subject-rhythm',
      ])
    );
    expect(persisted.benchmark.sampleResults[4].issueCodes).toEqual(
      expect.arrayContaining([
        'nominalized-explanation-chain',
        'translationese-formula-drift',
        'connective-crutch-rhythm',
      ])
    );
      expect(persisted.benchmark.sampleResults[1].styleFrictionAnnotations[0]).toMatchObject({
      location: '문단 1',
      issueCode: 'functional-ai-report',
      readerSegment: 'genre-core',
    });
    expect(persisted.benchmark.sampleResults[0].evidenceFingerprint).toMatch(
      /^sha256:[a-f0-9]{64}$/
    );
    expect(persisted.benchmark.sampleResults[0]).toMatchObject({
      chapter: 1,
      version: 2,
      contentSource: 'content_path',
      contentPath: 'reviews/prose-taste-benchmark/fixtures/clean-balanced.md',
      chapterSourceGrounded: false,
    });
    expect(persisted.benchmark.sampleResults[0].styleHighlightAnnotations[0]).toMatchObject({
      location: '문단 2',
      quality: 'subtext',
      readerSegment: 'genre-core',
    });
  });

  it('accepts project-level profile overrides from CLI arguments', async () => {
    const workDir = await mkdtemp(join(tmpdir(), 'prose-taste-benchmark-cli-profile-'));
    tempDirs.push(workDir);

    const projectDir = join(workDir, 'sample-project');
    await cp(sampleProject, projectDir, { recursive: true });

    const benchmarkDir = join(projectDir, 'reviews', 'prose-taste-benchmark');
    await mkdir(benchmarkDir, { recursive: true });
    await writeFile(
      join(benchmarkDir, 'profile-override.json'),
      `${JSON.stringify(
        {
          samples: [
            {
              id: 'explicit-disliked-phrase-fail',
              content: '도현은 문을 열었다. 감각이 왔다. 그는 곧 답을 알 수 있었다.',
              expected_passed: false,
              expected_issue_codes: ['explicit-disliked-phrase'],
              expected_max_score: 74,
            },
          ],
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const cliPath = join(workDir, 'run-prose-taste-benchmark.mjs');
    await build({
      entryPoints: [join(root, 'src', 'cli', 'run-prose-taste-benchmark.ts')],
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
        '--mode',
        'plain',
        '--threshold',
        '90',
        '--disliked-phrases',
        '감각이 왔다',
        '--max-abstract-nouns',
        '10',
        '--max-cognitive-filters',
        '5',
        '--max-therapy-speak',
        '8',
        '--max-therapy-speak-run',
        '4',
        '--max-backstory-exposition',
        '100',
        '--max-backstory-run',
        '10',
        '--max-relationship-montage-summaries',
        '100',
        '--max-relationship-montage-run',
        '10',
        '--max-time-skip-summaries',
        '100',
        '--max-time-skip-summary-run',
        '10',
        '--max-contrastive-reframes',
        '100',
        '--max-contrastive-reframe-run',
        '10',
        '--max-lore-terms',
        '100',
        '--max-lore-term-run',
        '10',
        '--max-system-stat-blocks',
        '100',
        '--max-system-stat-block-run',
        '10',
        '--max-declared-resolves',
        '100',
        '--max-declared-resolve-run',
        '10',
        '--max-revelation-summaries',
        '100',
        '--max-revelation-summary-run',
        '10',
        '--max-procedural-checklists',
        '100',
        '--max-procedural-checklist-run',
        '10',
        '--max-action-choreography',
        '100',
        '--max-action-choreography-run',
        '10',
        '--max-emotion-label-run',
        '10',
        '--max-sensory-wallpaper-run',
        '10',
        '--max-commas',
        '18',
        '--max-filler-adverbs',
        '100',
        '--max-filler-adverb-run',
        '10',
        '--max-simultaneous-actions',
        '100',
        '--max-simultaneous-action-run',
        '10',
        '--max-status-quo-actions',
        '100',
        '--max-status-quo-action-run',
        '10',
        '--max-prop-fidget-beats',
        '100',
        '--max-prop-fidget-run',
        '10',
        '--max-gaze-choreography-beats',
        '100',
        '--max-gaze-choreography-run',
        '10',
        '--min-causal-turns',
        '0',
        '--max-repeated-subject-run',
        '3',
        '--max-neutral-dialogue-tag-ratio',
        '0.8',
        '--max-neutral-dialogue-tag-run',
        '6',
        '--max-silence-stalls',
        '100',
        '--max-silence-stall-run',
        '10',
        '--max-melodramatic-captions',
        '100',
        '--max-melodramatic-caption-run',
        '10',
        '--max-facial-expression-beats',
        '100',
        '--max-facial-expression-run',
        '10',
        '--max-vague-atmosphere-modifiers',
        '100',
        '--max-vague-atmosphere-run',
        '10',
        '--max-evaluative-modifiers',
        '100',
        '--max-evaluative-modifier-run',
        '10',
        '--max-rhetorical-questions',
        '100',
        '--max-rhetorical-question-run',
        '10',
        '--max-subtext-explanations',
        '100',
        '--max-subtext-explanation-run',
        '10',
        '--max-ambiguous-references',
        '100',
        '--max-ambiguous-reference-run',
        '10',
        '--max-scene-transition-gaps',
        '100',
        '--max-scene-transition-gap-run',
        '10',
        '--max-topic-marker-starters',
        '100',
        '--max-topic-marker-run',
        '10',
        '--min-sentence-length-variation',
        '0.12',
        '--max-uniform-sentence-run',
        '12',
        '--max-same-ending-run',
        '9',
        '--max-dominant-ending-share',
        '0.8',
        '--max-dominant-dialogue-ending-share',
        '0.9',
        '--max-dominant-dialogue-starter-share',
        '0.8',
        '--max-dialogue-turn-length',
        '260',
        '--max-average-dialogue-turn-length',
        '150',
        '--max-dialogue-grounding-gap-run',
        '10',
        '--max-dialogue-question-ratio',
        '0.9',
        '--max-dialogue-question-run',
        '6',
        '--max-dialogue-vocative-ratio',
        '0.9',
        '--max-dialogue-vocative-run',
        '6',
        '--max-dialogue-lexical-echo-ratio',
        '0.92',
        '--max-dialogue-lexical-echo-run',
        '7',
        '--max-dialogue-paraphrase-confirmation-ratio',
        '0.88',
        '--max-dialogue-paraphrase-confirmation-run',
        '8',
        '--max-thin-cliffhanger-endings',
        '2',
        '--max-pov-mind-jumps',
        '9',
        '--max-pov-mind-jump-run',
        '7',
        '--json',
      ],
      { encoding: 'utf8' }
    );

    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.defaultProfile).toMatchObject({
      preferredMode: 'plain',
      dislikedPhrases: ['감각이 왔다'],
      maxAbstractNounDensityPer1000: 10,
      maxCognitiveFilterDensityPer1000: 5,
      maxTherapySpeakDensityPer1000: 8,
      maxTherapySpeakRun: 4,
      maxBackstoryExpositionDensityPer1000: 100,
      maxBackstoryExpositionRun: 10,
      maxRelationshipMontageSummaryDensityPer1000: 100,
      maxRelationshipMontageSummaryRun: 10,
      maxTimeSkipSummaryDensityPer1000: 100,
      maxTimeSkipSummaryRun: 10,
      maxContrastiveReframeDensityPer1000: 100,
      maxContrastiveReframeRun: 10,
      maxLoreTermDensityPer1000: 100,
      maxLoreTermRun: 10,
      maxSystemStatBlockDensityPer1000: 100,
      maxSystemStatBlockRun: 10,
      maxDeclaredResolveDensityPer1000: 100,
      maxDeclaredResolveRun: 10,
      maxRevelationSummaryDensityPer1000: 100,
      maxRevelationSummaryRun: 10,
      maxProceduralChecklistDensityPer1000: 100,
      maxProceduralChecklistRun: 10,
      maxActionChoreographyDensityPer1000: 100,
      maxActionChoreographyRun: 10,
      maxSensoryWallpaperRun: 10,
      maxCommaDensityPer1000: 18,
      maxFillerAdverbDensityPer1000: 100,
      maxFillerAdverbRun: 10,
      maxSimultaneousActionDensityPer1000: 100,
      maxSimultaneousActionRun: 10,
      maxStatusQuoActionDensityPer1000: 100,
      maxStatusQuoActionRun: 10,
      maxPropFidgetBeatDensityPer1000: 100,
      maxPropFidgetBeatRun: 10,
      minCausalTurnDensityPer1000: 0,
      maxRepeatedSubjectRun: 3,
      maxNeutralDialogueTagRatio: 0.8,
      maxNeutralDialogueTagRun: 6,
      maxSilenceStallDensityPer1000: 100,
      maxSilenceStallRun: 10,
      maxMelodramaticCaptionDensityPer1000: 100,
      maxMelodramaticCaptionRun: 10,
      maxFacialExpressionBeatDensityPer1000: 100,
      maxFacialExpressionBeatRun: 10,
      maxVagueAtmosphereModifierDensityPer1000: 100,
      maxVagueAtmosphereModifierRun: 10,
      maxEvaluativeModifierDensityPer1000: 100,
      maxEvaluativeModifierRun: 10,
      maxRhetoricalQuestionDensityPer1000: 100,
      maxRhetoricalQuestionRun: 10,
      maxSubtextExplanationDensityPer1000: 100,
      maxSubtextExplanationRun: 10,
      maxThinCliffhangerEndingCount: 2,
      maxAmbiguousReferenceDensityPer1000: 100,
      maxAmbiguousReferenceRun: 10,
      maxSceneTransitionGroundingGapDensityPer1000: 100,
      maxSceneTransitionGroundingGapRun: 10,
      maxTopicMarkerStarterDensityPer1000: 100,
      maxTopicMarkerStarterRun: 10,
      minSentenceLengthVariationCoefficient: 0.12,
      maxUniformSentenceLengthRun: 12,
      maxSameEndingRun: 9,
      maxDominantSentenceEndingShare: 0.8,
      maxDominantDialogueEndingShare: 0.9,
      maxDominantDialogueStarterShare: 0.8,
      maxDialogueTurnLength: 260,
      maxAverageDialogueTurnLength: 150,
      maxDialogueGroundingGapRun: 10,
      maxDialogueQuestionRatio: 0.9,
      maxDialogueQuestionRun: 6,
      maxDialogueVocativeRatio: 0.9,
      maxDialogueVocativeRun: 6,
      maxDialogueLexicalEchoRatio: 0.92,
      maxDialogueLexicalEchoRun: 7,
      maxDialogueParaphraseConfirmationRatio: 0.88,
      maxDialogueParaphraseConfirmationRun: 8,
      maxPovMindJumpDensityPer1000: 9,
      maxPovMindJumpRun: 7,
    });
    expect(output.threshold).toBe(90);
    expect(output.benchmark).toMatchObject({
      total: 1,
      passed: 1,
      failed: 0,
      falsePositiveCount: 0,
      falseNegativeCount: 0,
    });
  });
});
