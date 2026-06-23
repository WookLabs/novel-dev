/**
 * Engagement Contract Evaluator
 *
 * Deterministic checks that keep reader-facing promises connected across:
 * design strategy -> plot strategy -> chapter metadata.
 *
 * @module quality/engagement-contract
 */

export type EngagementIssueSeverity = 'critical' | 'major' | 'minor';

export type EngagementIssueCode =
  | 'missing-chapter-guide'
  | 'missing-core-hook'
  | 'reader-promise-generic'
  | 'reader-promise-premise-not-integrated'
  | 'fun-spec-generic'
  | 'arc-beat-not-staged'
  | 'page-turn-question-closed'
  | 'page-turn-question-too-broad'
  | 'page-turn-question-not-staged'
  | 'irresistible-question-drift'
  | 'protagonist-appeal-drift'
  | 'character-drive-not-staged'
  | 'character-drive-carryover-not-staged'
  | 'antagonist-strategy-not-staged'
  | 'antagonist-countermove-carryover-not-staged'
  | 'novelty-angle-drift'
  | 'emotional-payoff-drift'
  | 'long-series-engine-drift'
  | 'long-hook-thread-not-staged'
  | 'long-hook-thread-not-advanced'
  | 'payoff-cadence-drift'
  | 'fatigue-control-not-staged'
  | 'tension-reset-not-staged'
  | 'serial-escalation-variety-not-staged'
  | 'serial-reward-pattern-repetition-not-staged'
  | 'cliffhanger-carryover-not-staged'
  | 'cliffhanger-carryover-delayed'
  | 'choice-cost-lock-carryover-not-staged'
  | 'revelation-consequence-carryover-not-staged'
  | 'mystery-hypothesis-carryover-not-staged'
  | 'scene-choice-tradeoff-not-staged'
  | 'scene-choice-cost-lock-not-staged'
  | 'scene-active-opposition-not-staged'
  | 'scene-goal-tactic-turn-not-staged'
  | 'relationship-shift-not-staged'
  | 'relationship-turning-point-not-staged'
  | 'relationship-mind-inference-not-staged'
  | 'relationship-mutual-pressure-not-staged'
  | 'relationship-evolution-not-recorded'
  | 'relationship-evolution-carryover-not-staged'
  | 'foreshadowing-ledger-missing'
  | 'foreshadowing-payoff-timing-mismatch'
  | 'foreshadowing-plant-not-staged'
  | 'foreshadowing-payoff-not-staged'
  | 'hook-ledger-missing'
  | 'hook-reveal-timing-mismatch'
  | 'binge-reason-not-staged'
  | 'retention-plan-drift'
  | 'opening-hook-not-evidenced'
  | 'opening-hook-delayed'
  | 'opening-hook-not-embodied'
  | 'manuscript-opening-momentum-not-evidenced'
  | 'manuscript-arc-beat-not-evidenced'
  | 'manuscript-irresistible-question-not-evidenced'
  | 'manuscript-premise-engine-not-evidenced'
  | 'manuscript-reward-not-evidenced'
  | 'manuscript-earned-reward-not-evidenced'
  | 'manuscript-reward-freshness-not-evidenced'
  | 'manuscript-question-ladder-not-evidenced'
  | 'manuscript-drop-off-mitigation-not-evidenced'
  | 'manuscript-ending-not-evidenced'
  | 'ending-hook-reaction-not-staged'
  | 'manuscript-ending-hook-not-staged'
  | 'manuscript-ending-hook-closed'
  | 'manuscript-ending-hook-question-too-broad'
  | 'manuscript-ending-hook-reaction-not-evidenced'
  | 'manuscript-ending-hook-setup-not-evidenced'
  | 'manuscript-fair-twist-setup-not-evidenced'
  | 'manuscript-forecast-revision-not-evidenced'
  | 'manuscript-foreshadowing-plant-not-evidenced'
  | 'manuscript-foreshadowing-payoff-not-evidenced'
  | 'manuscript-appeal-not-evidenced'
  | 'manuscript-protagonist-agency-not-evidenced'
  | 'manuscript-choice-tradeoff-not-evidenced'
  | 'manuscript-stakes-not-evidenced'
  | 'manuscript-stakes-subject-not-personalized'
  | 'manuscript-active-opposition-not-evidenced'
  | 'manuscript-pressure-not-evidenced'
  | 'manuscript-temporal-pressure-not-evidenced'
  | 'manuscript-tactical-adaptation-not-evidenced'
  | 'manuscript-consequence-not-evidenced'
  | 'manuscript-reader-desire-not-evidenced'
  | 'manuscript-payoff-not-evidenced'
  | 'manuscript-payoff-embodiment-not-evidenced'
  | 'manuscript-genre-delight-not-evidenced'
  | 'manuscript-payoff-delight-not-evidenced'
  | 'manuscript-emotional-arc-not-evidenced'
  | 'manuscript-emotional-progression-not-evidenced'
  | 'manuscript-affective-choice-turn-not-evidenced'
  | 'manuscript-character-development-not-evidenced'
  | 'manuscript-character-drive-not-evidenced'
  | 'manuscript-character-drive-carryover-not-evidenced'
  | 'manuscript-antagonist-strategy-not-evidenced'
  | 'manuscript-antagonist-countermove-carryover-not-evidenced'
  | 'manuscript-generic-character-label-not-evidenced'
  | 'manuscript-design-jargon-not-evidenced'
  | 'manuscript-long-hook-not-evidenced'
  | 'manuscript-long-hook-clue-not-evidenced'
  | 'manuscript-long-hook-thread-not-advanced'
  | 'manuscript-payoff-cadence-not-evidenced'
  | 'manuscript-fatigue-control-not-evidenced'
  | 'manuscript-tension-reset-not-evidenced'
  | 'manuscript-tension-peak-not-evidenced'
  | 'manuscript-tension-wave-not-evidenced'
  | 'manuscript-serial-escalation-variety-not-evidenced'
  | 'manuscript-serial-reward-pattern-repetition-not-evidenced'
  | 'manuscript-cliffhanger-carryover-not-evidenced'
  | 'manuscript-cliffhanger-carryover-delayed'
  | 'manuscript-choice-cost-lock-carryover-not-evidenced'
  | 'manuscript-revelation-consequence-carryover-not-evidenced'
  | 'manuscript-mystery-hypothesis-carryover-not-evidenced'
  | 'manuscript-relationship-shift-not-evidenced'
  | 'manuscript-relationship-turning-point-not-evidenced'
  | 'manuscript-relationship-mind-inference-not-evidenced'
  | 'manuscript-relationship-mutual-pressure-not-evidenced'
  | 'manuscript-relationship-evolution-carryover-not-evidenced'
  | 'manuscript-scene-intent-not-evidenced'
  | 'manuscript-scene-order-not-evidenced'
  | 'manuscript-scene-state-delta-not-evidenced'
  | 'manuscript-scene-novelty-matrix-not-evidenced'
  | 'manuscript-causal-chain-not-evidenced'
  | 'manuscript-convenient-resolution-not-evidenced'
  | 'manuscript-pov-focalization-not-evidenced'
  | 'manuscript-narrative-transportation-not-evidenced'
  | 'manuscript-summary-prose'
  | 'manuscript-scene-density-not-evidenced'
  | 'manuscript-signature-scene-image-not-evidenced'
  | 'manuscript-motif-resonance-not-evidenced'
  | 'manuscript-character-appeal-signature-not-evidenced'
  | 'manuscript-spatial-blocking-not-evidenced'
  | 'manuscript-dialogue-subtext-not-evidenced'
  | 'manuscript-dialogue-conflict-not-evidenced'
  | 'manuscript-dialogue-turn-not-evidenced'
  | 'manuscript-dialogue-state-carryover-not-evidenced'
  | 'manuscript-choice-cost-carryover-not-evidenced'
  | 'manuscript-choice-cost-lock-not-evidenced'
  | 'manuscript-character-voice-not-differentiated'
  | 'manuscript-character-voice-profile-drift'
  | 'reader-reward-drift'
  | 'page-turner-question-drift'
  | 'character-appeal-drift'
  | 'character-appeal-not-staged'
  | 'character-appeal-signature-not-staged'
  | 'drop-off-risk-drift'
  | 'must-click-ending-drift'
  | 'weak-cliffhanger'
  | 'missing-scene-evidence'
  | 'weak-scene-conflict'
  | 'weak-scene-turn'
  | 'scene-state-delta-not-staged'
  | 'scene-evidence-generic'
  | 'signature-scene-image-not-staged'
  | 'motif-resonance-not-staged'
  | 'scene-novelty-matrix-not-staged'
  | 'must-click-ending-not-staged'
  | 'scene-causal-escalation-not-staged'
  | 'chapter-reward-not-staged'
  | 'drop-off-risk-not-mitigated'
  | 'tension-peak-not-staged'
  | 'weak-peak-cliffhanger';

export interface ReaderPromiseContract {
  core_hook: string;
  irresistible_question?: string;
  protagonist_appeal?: string;
  novelty_angle?: string;
  emotional_payoff?: string;
  binge_reason?: string;
  long_series_engine?: string;
  first_five_chapter_retention_plan?: string[];
}

export interface FunSpec {
  reader_reward: string;
  page_turn_question: string;
  character_appeal_moment: string;
  drop_off_risk: string;
  must_click_ending: string;
}

export interface ChapterGuide {
  chapter: number;
  arc_beats?: string;
  fun_spec: FunSpec;
}

export interface TensionCurvePeak {
  chapter: number;
  event?: string;
  tension_level?: number;
}

export interface BingeArchitecture {
  long_hook_threads?: string[];
  payoff_cadence?: string;
  tension_reset_plan?: string;
  fatigue_controls?: string[];
}

export interface ForeshadowingScheduleItemForEvaluation {
  id?: string;
  plant_chapter?: number;
  setup_chapter?: number;
  hints?: number[];
  payoff_chapter?: number;
  importance?: string;
}

export interface DesignWithReaderPromise {
  reader_promise_contract: ReaderPromiseContract;
}

export interface PlotWithFunSpec {
  per_chapter_guide: ChapterGuide[];
  binge_architecture?: BingeArchitecture;
  foreshadowing_schedule?: ForeshadowingScheduleItemForEvaluation[];
  tension_curve?: {
    key_peaks?: TensionCurvePeak[];
  };
}

export interface ChapterReaderExperienceForEvaluation {
  promise_fulfillment: string;
  chapter_reward: string;
  page_turner_question: string;
  character_appeal_moment: string;
  drop_off_risk: string;
  must_click_ending: string;
  cliffhanger_strength?: number;
}

export interface ChapterSceneForEvaluation {
  scene_number: number;
  purpose?: string;
  characters?: string[];
  location?: string;
  conflict?: string;
  beat?: string;
  emotional_tone?: string;
}

export interface ChapterContextForEvaluation {
  previous_summary?: string;
  current_plot?: string;
  next_plot?: string;
}

export interface ChapterStyleGuideForEvaluation {
  tone?: string;
  pacing?: string;
  focus?: string;
}

export interface ChapterNarrativeElementsForEvaluation {
  foreshadowing_plant?: string[];
  foreshadowing_payoff?: string[];
  hooks_plant?: string[];
  hooks_reveal?: string[];
  character_development?: string;
  emotional_goal?: string;
  resonance_seed?: string;
}

export interface ChapterWithReaderExperience {
  chapter_number: number;
  context?: ChapterContextForEvaluation;
  reader_experience: ChapterReaderExperienceForEvaluation;
  narrative_elements?: ChapterNarrativeElementsForEvaluation;
  scenes?: ChapterSceneForEvaluation[];
  style_guide?: ChapterStyleGuideForEvaluation;
}

export interface CharacterReferenceForEvaluation {
  id?: string;
  name: string;
  aliases?: string[];
  role?: string;
  voice?: CharacterVoiceReferenceForEvaluation;
  inner?: {
    want?: string;
    need?: string;
    fatal_flaw?: string;
  };
}

export interface CharacterVoiceReferenceForEvaluation {
  tone?: string;
  speech_pattern?: string;
  vocabulary?: string;
  signature_phrases?: string[];
  dialect?: string;
  formality_level?: 'very_formal' | 'formal' | 'neutral' | 'casual' | 'very_casual';
}

export interface RelationshipEvolutionForEvaluation {
  chapter?: number;
  change?: string;
}

export interface RelationshipForEvaluation {
  from?: string;
  to?: string;
  type?: string;
  dynamic?: string;
  evolution?: RelationshipEvolutionForEvaluation[];
}

export interface RelationshipsForEvaluation {
  relationships?: RelationshipForEvaluation[];
}

export interface MysteryHookForEvaluation {
  id?: string;
  content?: string;
  plant_chapter?: number;
  reveal_chapter?: number;
  clues?: number[];
  reveal?: string;
  status?: string;
}

export interface HooksForEvaluation {
  mystery_hooks?: MysteryHookForEvaluation[];
}

export interface EngagementContractInput {
  design: DesignWithReaderPromise;
  plot: PlotWithFunSpec;
  chapter: ChapterWithReaderExperience;
  characters?: CharacterReferenceForEvaluation[];
  relationships?: RelationshipsForEvaluation | RelationshipForEvaluation[];
  hooks?: HooksForEvaluation;
  manuscript?: string;
  previousChapters?: ChapterWithReaderExperience[];
  previousManuscripts?: string[];
}

export interface EngagementContractIssue {
  code: EngagementIssueCode;
  severity: EngagementIssueSeverity;
  message: string;
  expected?: string;
  actual?: string;
}

export type EngagementRevisionDirectivePriority = 'critical' | 'high' | 'medium';

export type EngagementRevisionDirectiveTarget =
  | 'design_strategy'
  | 'reader_experience'
  | 'scenes'
  | 'final_scene'
  | 'manuscript'
  | 'relationships'
  | 'hooks_ledger'
  | 'plot_strategy'
  | 'tension_curve';

export interface EngagementRevisionDirective {
  code: EngagementIssueCode;
  priority: EngagementRevisionDirectivePriority;
  target: EngagementRevisionDirectiveTarget;
  action: string;
  expected?: string;
  actual?: string;
}

export interface EngagementContractBreakdown {
  promiseAlignment: number;
  funSpecAlignment: number;
  cliffhangerStrength: number;
  sceneMomentum: number;
  tensionCurveAlignment: number;
}

export interface EngagementContractEvaluation {
  passed: boolean;
  score: number;
  breakdown: EngagementContractBreakdown;
  issues: EngagementContractIssue[];
  revisionDirectives: EngagementRevisionDirective[];
}

const FUN_SPEC_FIELDS: Array<{
  expectedKey: keyof FunSpec;
  actualKey: keyof ChapterReaderExperienceForEvaluation;
  issueCode: EngagementIssueCode;
  severity: EngagementIssueSeverity;
  label: string;
}> = [
  {
    expectedKey: 'reader_reward',
    actualKey: 'chapter_reward',
    issueCode: 'reader-reward-drift',
    severity: 'critical',
    label: 'reader reward',
  },
  {
    expectedKey: 'page_turn_question',
    actualKey: 'page_turner_question',
    issueCode: 'page-turner-question-drift',
    severity: 'critical',
    label: 'page-turner question',
  },
  {
    expectedKey: 'character_appeal_moment',
    actualKey: 'character_appeal_moment',
    issueCode: 'character-appeal-drift',
    severity: 'major',
    label: 'character appeal moment',
  },
  {
    expectedKey: 'drop_off_risk',
    actualKey: 'drop_off_risk',
    issueCode: 'drop-off-risk-drift',
    severity: 'major',
    label: 'drop-off risk mitigation',
  },
  {
    expectedKey: 'must_click_ending',
    actualKey: 'must_click_ending',
    issueCode: 'must-click-ending-drift',
    severity: 'critical',
    label: 'must-click ending',
  },
];

const FUN_SPEC_ALIGNMENT_THRESHOLD = 0.55;
export const MASTERPIECE_ENGAGEMENT_PASS_SCORE = 95;

/**
 * Evaluate whether a chapter preserves the reader promise and per-chapter fun spec.
 */
export function evaluateEngagementContract(input: EngagementContractInput): EngagementContractEvaluation {
  const { design, plot, chapter } = input;
  const issues: EngagementContractIssue[] = [];
  const promise = design.reader_promise_contract;
  const readerExperience = chapter.reader_experience;
  const guide = plot.per_chapter_guide.find(item => item.chapter === chapter.chapter_number);

  let promiseAlignment = 100;
  let funSpecAlignment = 100;
  let cliffhangerStrength = scoreCliffhanger(readerExperience.cliffhanger_strength);
  let sceneMomentum = evaluateSceneMomentum(chapter, readerExperience, issues);
  const promiseSpecificity = assessReaderPromiseSpecificity(promise);
  if (!promiseSpecificity.passed) {
    issues.push({
      code: 'reader-promise-generic',
      severity: 'critical',
      message: 'The design reader_promise_contract is too generic to guide a high-retention novel workflow.',
      expected:
        'specific reader promise fields with a concrete premise mechanism, protagonist choice/cost, novelty mechanism, emotional payoff trigger, binge reason, and long-series engine.',
      actual: promiseSpecificity.actual,
    });
    promiseAlignment = Math.min(promiseAlignment, 55);
  }
  const promiseIntegration = promiseSpecificity.passed
    ? assessReaderPromisePremiseIntegration(promise)
    : undefined;
  if (promiseIntegration && !promiseIntegration.passed) {
    issues.push({
      code: 'reader-promise-premise-not-integrated',
      severity: 'critical',
      message:
        'The design reader_promise_contract has concrete fields, but they do not integrate into one coherent serial premise.',
      expected:
        'core_hook, novelty_angle, irresistible_question, binge_reason, long_series_engine, and early retention beats should share recurring story anchors from the same premise.',
      actual: promiseIntegration.actual,
    });
    promiseAlignment = Math.min(promiseAlignment, 60);
  }
  const manuscriptMomentum = evaluateManuscriptEvidence(
    input.manuscript,
    promise,
    plot,
    chapter,
    readerExperience,
    input.characters ?? [],
    issues
  );
  if (manuscriptMomentum !== undefined) {
    sceneMomentum = Math.min(sceneMomentum, manuscriptMomentum);
  }
  let tensionCurveAlignment = evaluateTensionCurveAlignment(
    plot,
    chapter,
    readerExperience,
    issues
  );
  const openingHookAlignment = evaluateOpeningHookEvidence(
    input.manuscript,
    promise,
    chapter,
    issues
  );
  if (openingHookAlignment !== undefined) {
    promiseAlignment = Math.min(promiseAlignment, openingHookAlignment);
  }

  if (evaluateForeshadowingLedger(plot, chapter, input.manuscript, issues) > 0) {
    promiseAlignment = Math.min(promiseAlignment, 55);
    sceneMomentum = Math.min(sceneMomentum, 60);
  }

  if (input.hooks !== undefined && evaluateHookLedger(input.hooks, chapter, issues) > 0) {
    promiseAlignment = Math.min(promiseAlignment, 55);
    sceneMomentum = Math.min(sceneMomentum, 60);
  }

  if (input.relationships !== undefined) {
    const relationshipEvolution = assessRelationshipEvolutionRecord(
      chapter,
      input.relationships
    );
    if (!relationshipEvolution.passed) {
      issues.push({
        code: 'relationship-evolution-not-recorded',
        severity: 'critical',
        message:
          'The chapter stages a relationship shift but characters/relationships.json does not record the long-term relationship evolution for this chapter.',
        expected: relationshipEvolution.expected,
        actual: relationshipEvolution.actual,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
      sceneMomentum = Math.min(sceneMomentum, 55);
    }

    const relationshipEvolutionCarryover = evaluateRelationshipEvolutionCarryover(
      chapter,
      input.relationships,
      input.manuscript,
      issues
    );
    if (relationshipEvolutionCarryover.metadataFailures > 0) {
      promiseAlignment = Math.min(promiseAlignment, 60);
      sceneMomentum = Math.min(sceneMomentum, 55);
    }
    if (relationshipEvolutionCarryover.manuscriptFailures > 0) {
      sceneMomentum = Math.min(sceneMomentum, 40);
    }
  }

  if (!guide) {
    issues.push({
      code: 'missing-chapter-guide',
      severity: 'critical',
      message: `No per_chapter_guide entry found for chapter ${chapter.chapter_number}.`,
    });
    funSpecAlignment = 0;
  } else {
    const funSpecSpecificity = assessFunSpecSpecificity(guide.fun_spec);
    if (!funSpecSpecificity.passed) {
      issues.push({
        code: 'fun-spec-generic',
        severity: 'critical',
        message: 'Plot fun_spec is too generic to guide concrete chapter execution.',
        expected:
          'concrete fun_spec with memorable device/clue/object, protagonist choice or cost, and a specific must-click hook.',
        actual: funSpecSpecificity.actual,
      });
      funSpecAlignment = Math.min(funSpecAlignment, 40);
    }

    const pageTurnOpenness = assessPageTurnQuestionOpenness(
      guide.fun_spec.page_turn_question,
      readerExperience.page_turner_question
    );
    if (!pageTurnOpenness.passed) {
      issues.push({
        code: 'page-turn-question-closed',
        severity: 'critical',
        message: 'Page-turn question closes the curiosity gap with answer-like language.',
        expected:
          'unresolved open-loop page_turn_question and page_turner_question that ask what remains unknown without explaining, solving, or revealing the answer.',
        actual: pageTurnOpenness.actual,
      });
      funSpecAlignment = Math.min(funSpecAlignment, 40);
    }

    const pageTurnSpecificity = assessPageTurnQuestionSpecificity(
      guide.fun_spec.page_turn_question,
      readerExperience.page_turner_question
    );
    if (!pageTurnSpecificity.passed) {
      issues.push({
        code: 'page-turn-question-too-broad',
        severity: 'critical',
        message: 'Page-turn question leaves the curiosity gap too broad to create next-click pressure.',
        expected:
          'narrow information gap with at least two specific anchors, such as logo + case number, named target + object, rule + cost, location + time, or clue + owner.',
        actual: pageTurnSpecificity.actual,
      });
      funSpecAlignment = Math.min(funSpecAlignment, 45);
    }

    const driftCount = evaluateFunSpec(guide.fun_spec, readerExperience, issues);
    funSpecAlignment = Math.min(funSpecAlignment, Math.max(0, 100 - driftCount * 20));

    const arcProgression = evaluateArcBeatProgression(
      guide,
      chapter,
      input.manuscript,
      issues
    );
    if (arcProgression.metadataFailures > 0) {
      funSpecAlignment = Math.min(funSpecAlignment, 50);
      sceneMomentum = Math.min(sceneMomentum, 55);
    }
    if (arcProgression.manuscriptFailures > 0) {
      sceneMomentum = Math.min(sceneMomentum, 45);
    }
  }

  if (!containsMeaningfulOverlap(readerExperience.promise_fulfillment, promise.core_hook, 0.6)) {
    issues.push({
      code: 'missing-core-hook',
      severity: 'critical',
      message: 'Chapter promise_fulfillment does not carry the design core_hook.',
      expected: promise.core_hook,
      actual: readerExperience.promise_fulfillment,
    });
    promiseAlignment = 45;
  }

  const protagonistAppeal = promise.protagonist_appeal?.trim();
  if (protagonistAppeal) {
    const appealEvidence = [
      readerExperience.character_appeal_moment,
      chapterToSceneEvidenceText(chapter),
    ]
      .filter(Boolean)
      .join(' ');

    if (!containsExpectedBeatEvidence(appealEvidence, protagonistAppeal, 0.35)) {
      issues.push({
        code: 'protagonist-appeal-drift',
        severity: 'critical',
        message: 'Chapter character appeal does not preserve the design protagonist_appeal.',
        expected: protagonistAppeal,
        actual: appealEvidence,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    }
  }

  const characterDrive = evaluateCharacterDriveProgression(
    chapter,
    input.characters ?? [],
    input.manuscript,
    issues
  );
  if (characterDrive.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (characterDrive.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 45);
  }

  const characterDriveCarryover = evaluateCharacterDriveCarryover(
    chapter,
    input.previousChapters ?? [],
    input.manuscript,
    issues
  );
  if (characterDriveCarryover.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (characterDriveCarryover.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 40);
  }

  const antagonistStrategy = evaluateAntagonistStrategyProgression(
    chapter,
    input.characters ?? [],
    input.manuscript,
    issues
  );
  if (antagonistStrategy.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (antagonistStrategy.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 40);
  }

  const antagonistCountermoveCarryover = evaluateAntagonistCountermoveCarryover(
    chapter,
    input.previousChapters ?? [],
    input.characters ?? [],
    input.manuscript,
    issues
  );
  if (antagonistCountermoveCarryover.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (antagonistCountermoveCarryover.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 40);
  }

  const noveltyAngle = promise.novelty_angle?.trim();
  if (noveltyAngle) {
    const noveltyEvidence = [
      readerExperience.promise_fulfillment,
      readerExperience.chapter_reward,
      readerExperience.page_turner_question,
      chapterToSceneEvidenceText(chapter),
    ]
      .filter(Boolean)
      .join(' ');

    if (!containsExpectedBeatEvidence(noveltyEvidence, noveltyAngle, 0.35)) {
      issues.push({
        code: 'novelty-angle-drift',
        severity: 'critical',
        message: 'Chapter reader promise does not preserve the design novelty_angle.',
        expected: noveltyAngle,
        actual: noveltyEvidence,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    }
  }

  const emotionalPayoff = promise.emotional_payoff?.trim();
  if (emotionalPayoff) {
    const payoffEvidence = [
      readerExperience.promise_fulfillment,
      readerExperience.chapter_reward,
      readerExperience.must_click_ending,
      chapterToSceneEvidenceText(chapter),
    ]
      .filter(Boolean)
      .join(' ');

    if (!containsExpectedBeatEvidence(payoffEvidence, emotionalPayoff, 0.35)) {
      issues.push({
        code: 'emotional-payoff-drift',
        severity: 'critical',
        message: 'Chapter reader reward does not preserve the design emotional_payoff.',
        expected: emotionalPayoff,
        actual: payoffEvidence,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    }
  }

  const longSeriesEngine = promise.long_series_engine?.trim();
  if (longSeriesEngine) {
    const longSeriesEvidence = [
      plot.binge_architecture?.long_hook_threads?.join(' '),
      readerExperience.promise_fulfillment,
      readerExperience.chapter_reward,
      readerExperience.must_click_ending,
      chapterToSceneEvidenceText(chapter),
    ]
      .filter(Boolean)
      .join(' ');

    if (!containsExpectedBeatEvidence(longSeriesEvidence, longSeriesEngine, 0.35)) {
      issues.push({
        code: 'long-series-engine-drift',
        severity: 'critical',
        message: 'Chapter and binge architecture do not preserve the design long_series_engine.',
        expected: longSeriesEngine,
        actual: longSeriesEvidence,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    }
  }

  const longHookThreads = plot.binge_architecture?.long_hook_threads
    ?.map(thread => thread.trim())
    .filter(Boolean);
  if (longHookThreads?.length) {
    const longHookEvidence = chapterToEngagementEvidenceText(chapter);
    const hasStagedLongHook = containsAnyExpectedBeatEvidence(
      longHookEvidence,
      longHookThreads,
      0.35
    );

    if (!hasStagedLongHook) {
      issues.push({
        code: 'long-hook-thread-not-staged',
        severity: 'critical',
        message: 'Chapter evidence does not stage any plot long_hook_threads.',
        expected: longHookThreads.join(' / '),
        actual: longHookEvidence,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    } else {
      const longHookAdvancement = assessLongHookThreadAdvancement(
        longHookEvidence,
        longHookThreads
      );
      if (!longHookAdvancement.passed) {
        issues.push({
          code: 'long-hook-thread-not-advanced',
          severity: 'critical',
          message:
            'Chapter evidence mentions a plot long_hook_thread but does not advance it with a new clue, narrower hypothesis, or changed risk.',
          expected:
            'long_hook_thread advancement: concrete clue plus discovery, narrowed hypothesis, changed risk, or next verification action.',
          actual: longHookAdvancement.actual,
        });
        promiseAlignment = Math.min(promiseAlignment, 60);
      }
    }
  }

  const payoffCadence = plot.binge_architecture?.payoff_cadence?.trim();
  if (payoffCadence) {
    const cadenceEvidence = [
      readerExperience.promise_fulfillment,
      readerExperience.chapter_reward,
      readerExperience.must_click_ending,
      chapterToFinalSceneEvidenceText(chapter),
    ]
      .filter(Boolean)
      .join(' ');
    const cadenceSignals = splitCadenceSignals(payoffCadence);

    if (!containsAnyExpectedBeatEvidence(cadenceEvidence, cadenceSignals, 0.25)) {
      issues.push({
        code: 'payoff-cadence-drift',
        severity: 'critical',
        message: 'Chapter reward and ending do not preserve the plot payoff_cadence.',
        expected: payoffCadence,
        actual: cadenceEvidence,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    }
  }

  const fatigueControls = plot.binge_architecture?.fatigue_controls
    ?.map(control => control.trim())
    .filter(Boolean);
  if (fatigueControls?.length) {
    const fatigueEvidence = [
      readerExperience.promise_fulfillment,
      readerExperience.chapter_reward,
      readerExperience.drop_off_risk,
      chapterToSceneEvidenceText(chapter),
    ]
      .filter(Boolean)
      .join(' ');
    const hasFatigueControl = fatigueControls.some(control =>
      hasFatigueControlEvidence(fatigueEvidence, control)
    );

    if (!hasFatigueControl) {
      issues.push({
        code: 'fatigue-control-not-staged',
        severity: 'critical',
        message: 'Chapter evidence does not stage any plot fatigue_controls.',
        expected: fatigueControls.join(' / '),
        actual: fatigueEvidence,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    }
  }

  const tensionResetPlan = plot.binge_architecture?.tension_reset_plan?.trim();
  if (tensionResetPlan) {
    const resetEvidence = [
      readerExperience.promise_fulfillment,
      readerExperience.chapter_reward,
      readerExperience.page_turner_question,
      readerExperience.drop_off_risk,
      readerExperience.must_click_ending,
      chapterToSceneEvidenceText(chapter),
    ]
      .filter(Boolean)
      .join(' ');
    const resetPlan = assessTensionResetEvidence(resetEvidence, tensionResetPlan);

    if (!resetPlan.passed) {
      issues.push({
        code: 'tension-reset-not-staged',
        severity: 'critical',
        message: 'Chapter evidence does not stage the plot tension_reset_plan.',
        expected: tensionResetPlan,
        actual: resetPlan.actual,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    }
  }

  const serialEscalationVariety = evaluateSerialEscalationVariety(
    chapter,
    input.previousChapters ?? [],
    input.manuscript,
    input.previousManuscripts ?? [],
    issues
  );
  if (serialEscalationVariety.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (serialEscalationVariety.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 40);
  }

  const serialRewardPatternVariation = evaluateSerialRewardPatternVariation(
    chapter,
    input.previousChapters ?? [],
    input.manuscript,
    input.previousManuscripts ?? [],
    issues
  );
  if (serialRewardPatternVariation.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (serialRewardPatternVariation.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 40);
  }

  const cliffhangerCarryover = evaluateCliffhangerCarryover(
    chapter,
    input.previousChapters ?? [],
    input.manuscript,
    issues
  );
  if (cliffhangerCarryover.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (cliffhangerCarryover.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 40);
  }

  const choiceCostLockCarryover = evaluateChoiceCostLockCarryover(
    chapter,
    input.previousChapters ?? [],
    input.manuscript,
    issues
  );
  if (choiceCostLockCarryover.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (choiceCostLockCarryover.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 40);
  }

  const revelationConsequenceCarryover = evaluateRevelationConsequenceCarryover(
    chapter,
    input.previousChapters ?? [],
    input.manuscript,
    issues
  );
  if (revelationConsequenceCarryover.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (revelationConsequenceCarryover.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 40);
  }

  const mysteryHypothesisCarryover = evaluateMysteryHypothesisCarryover(
    chapter,
    input.previousChapters ?? [],
    input.manuscript,
    issues
  );
  if (mysteryHypothesisCarryover.metadataFailures > 0) {
    promiseAlignment = Math.min(promiseAlignment, 60);
    sceneMomentum = Math.min(sceneMomentum, 55);
  }
  if (mysteryHypothesisCarryover.manuscriptFailures > 0) {
    sceneMomentum = Math.min(sceneMomentum, 40);
  }

  const irresistibleQuestion = promise.irresistible_question?.trim();
  if (irresistibleQuestion) {
    const questionEvidence = [
      readerExperience.page_turner_question,
      readerExperience.promise_fulfillment,
      readerExperience.must_click_ending,
    ]
      .filter(Boolean)
      .join(' ');

    if (!containsExpectedBeatEvidence(questionEvidence, irresistibleQuestion, 0.45)) {
      issues.push({
        code: 'irresistible-question-drift',
        severity: 'critical',
        message: 'Chapter page-turn question does not preserve the design irresistible_question.',
        expected: irresistibleQuestion,
        actual: questionEvidence,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    }
  }

  const bingeReason = promise.binge_reason?.trim();
  if (bingeReason) {
    const bingeEvidence = [
      readerExperience.must_click_ending,
      readerExperience.page_turner_question,
      chapterToFinalSceneEvidenceText(chapter),
    ]
      .filter(Boolean)
      .join(' ');

    if (!containsExpectedBeatEvidence(bingeEvidence, bingeReason, 0.45)) {
      issues.push({
        code: 'binge-reason-not-staged',
        severity: 'critical',
        message: 'Chapter ending does not stage the design binge_reason.',
        expected: bingeReason,
        actual: bingeEvidence,
      });
      promiseAlignment = Math.min(promiseAlignment, 60);
    }
  }

  const retentionPlanBeat = getRetentionPlanBeat(promise, chapter.chapter_number);
  if (
    retentionPlanBeat &&
    !containsExpectedBeatEvidence(chapterToEngagementEvidenceText(chapter), retentionPlanBeat, 0.45)
  ) {
    issues.push({
      code: 'retention-plan-drift',
      severity: 'critical',
      message: 'Early chapter does not stage its first-five retention plan beat.',
      expected: retentionPlanBeat,
      actual: chapterToEngagementEvidenceText(chapter),
    });
    promiseAlignment = Math.min(promiseAlignment, 60);
  }

  if ((readerExperience.cliffhanger_strength ?? 0) < 7) {
    issues.push({
      code: 'weak-cliffhanger',
      severity: 'major',
      message: 'Ending hook is too weak for a must-click chapter ending.',
      expected: 'cliffhanger_strength >= 7',
      actual: String(readerExperience.cliffhanger_strength ?? 0),
    });
  }

  const score = Math.round(
    promiseAlignment * 0.2 +
    funSpecAlignment * 0.3 +
    cliffhangerStrength * 0.15 +
    sceneMomentum * 0.25 +
    tensionCurveAlignment * 0.1
  );

  return {
    passed:
      score >= MASTERPIECE_ENGAGEMENT_PASS_SCORE &&
      !issues.some(issue => issue.severity === 'critical'),
    score,
    breakdown: {
      promiseAlignment,
      funSpecAlignment,
      cliffhangerStrength,
      sceneMomentum,
      tensionCurveAlignment,
    },
    issues,
    revisionDirectives: buildRevisionDirectives(issues),
  };
}

function evaluateForeshadowingLedger(
  plot: PlotWithFunSpec,
  chapter: ChapterWithReaderExperience,
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): number {
  const schedule = plot.foreshadowing_schedule ?? [];
  const scheduleById = new Map(
    schedule
      .filter(item => item.id?.trim())
      .map(item => [item.id!.trim(), item])
  );
  const plantIds = uniqueStrings(chapter.narrative_elements?.foreshadowing_plant);
  const payoffIds = uniqueStrings(chapter.narrative_elements?.foreshadowing_payoff);
  const declaredIds = uniqueStrings([...plantIds, ...payoffIds]);
  let criticals = 0;

  for (const id of declaredIds) {
    if (!scheduleById.has(id)) {
      criticals += 1;
      issues.push({
        code: 'foreshadowing-ledger-missing',
        severity: 'critical',
        message:
          'Chapter metadata declares a foreshadowing id that is absent from plot foreshadowing_schedule.',
        expected:
          `foreshadowing_schedule contains ${id} with plant_chapter, hints, and payoff_chapter.`,
        actual:
          `chapter ${chapter.chapter_number} declared ${id}; scheduled ids=${[...scheduleById.keys()].join(', ') || 'none'}`,
      });
    }
  }

  for (const id of plantIds) {
    const scheduled = scheduleById.get(id);
    if (!scheduled) {
      continue;
    }

    const metadataAssessment = assessForeshadowingPlantConcreteness(
      chapterToForeshadowingPlantEvidenceText(chapter),
      scheduled,
      id
    );
    if (!metadataAssessment.passed) {
      criticals += 1;
      issues.push({
        code: 'foreshadowing-plant-not-staged',
        severity: 'critical',
        message:
          'Chapter metadata declares a foreshadowing plant but does not stage it as a concrete clue, object, mark, number, or sensory detail.',
        expected: metadataAssessment.expected,
        actual: metadataAssessment.actual,
      });
    }

    if (manuscript?.trim()) {
      const manuscriptAssessment = assessForeshadowingPlantConcreteness(
        manuscriptToForeshadowingPlantEvidenceText(manuscript),
        scheduled,
        id
      );
      if (!manuscriptAssessment.passed) {
        criticals += 1;
        issues.push({
          code: 'manuscript-foreshadowing-plant-not-evidenced',
          severity: 'critical',
          message:
            'The manuscript prose omits the concrete foreshadowing plant promised by chapter metadata.',
          expected: manuscriptAssessment.expected,
          actual: manuscriptAssessment.actual,
        });
      }
    }
  }

  for (const id of payoffIds) {
    const scheduled = scheduleById.get(id);
    if (!scheduled) {
      continue;
    }

    if (scheduled.payoff_chapter !== chapter.chapter_number) {
      criticals += 1;
      issues.push({
        code: 'foreshadowing-payoff-timing-mismatch',
        severity: 'critical',
        message:
          'Chapter metadata pays off a foreshadowing id outside its scheduled payoff chapter.',
        expected:
          `${id} payoff_chapter=${scheduled.payoff_chapter ?? 'missing'} in foreshadowing_schedule.`,
        actual: `chapter ${chapter.chapter_number} declares foreshadowing_payoff=${id}.`,
      });
      continue;
    }

    const metadataAssessment = assessForeshadowingPayoffResolution(
      chapterToForeshadowingPayoffEvidenceText(chapter),
      scheduled,
      id
    );
    if (!metadataAssessment.passed) {
      criticals += 1;
      issues.push({
        code: 'foreshadowing-payoff-not-staged',
        severity: 'critical',
        message:
          'Chapter metadata declares a foreshadowing payoff but does not resolve the planted clue into meaning, revelation, and story consequence.',
        expected: metadataAssessment.expected,
        actual: metadataAssessment.actual,
      });
    }

    if (manuscript?.trim()) {
      const manuscriptAssessment = assessForeshadowingPayoffResolution(
        manuscriptToForeshadowingPayoffEvidenceText(manuscript),
        scheduled,
        id
      );
      if (!manuscriptAssessment.passed) {
        criticals += 1;
        issues.push({
          code: 'manuscript-foreshadowing-payoff-not-evidenced',
          severity: 'critical',
          message:
            'The manuscript prose omits the foreshadowing payoff resolution promised by chapter metadata.',
          expected: manuscriptAssessment.expected,
          actual: manuscriptAssessment.actual,
        });
      }
    }
  }

  return criticals;
}

interface ForeshadowingPlantConcretenessAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface ForeshadowingPayoffResolutionAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

const FORESHADOWING_PLANT_CONCRETE_PATTERN =
  /(로고|번호|파일|로그|서명|상처|흉터|시계|모래시계|배지|목소리|녹음|문양|색|사진|냄새|흔적|지문|혈흔|영수증|제조번호|좌표|문자|메시지|기록|열쇠|반지|스티커|문신|긁힌|새겨진|얼룩|스크래치|표식|물증|\d{2,})/gu;
const FORESHADOWING_PLANT_SUBTLE_PATTERN =
  /(희미|작게|잠깐|스치|얼핏|모서리|뒷면|구석|낯선|이상한|맞지\s*않|겹치|반복|남아|묻은|긁혀|새겨|접힌|흐릿|눈에\s*걸|문득|숨겨|가려|흘끗|스며|밝기|낮추|어둠|선명|붉은\s*선|푸른\s*선)/gu;
const FORESHADOWING_PLANT_ABSTRACT_PATTERN =
  /(복선|떡밥|언젠가|나중에|밝혀질|암시|전조|장기\s*미스터리|단서로\s*남)/gu;
const FORESHADOWING_PAYOFF_REVEAL_PATTERN =
  /(밝혀|드러나|일치|겹치|연결|배후|정체|원인|이유|가리키|증명|폭로|해독|해석|알아차|깨닫|추론|판명|실체|서명|개발자)/gu;
const FORESHADOWING_PAYOFF_CONSEQUENCE_PATTERN =
  /(그\s*결과|때문에|따라서|그래서|바뀌|좁혀|추적|향하|결정|선택|의심|표적|위험|압박|위치|좌표|대상|서버실|잠기|닫히|잃|드러나|공개|쫓|구하|막히)/gu;
const FORESHADOWING_PAYOFF_ABSTRACT_PATTERN =
  /(복선|떡밥|회수|의미가\s*있|중요해|나중에|언젠가|아직\s*알\s*수\s*없|반복되는가)/gu;

const FORESHADOWING_ID_ANCHOR_ALIASES: Record<string, string[]> = {
  app: ['앱', 'app'],
  logo: ['로고', 'logo'],
  case: ['사건', 'case'],
  number: ['번호', 'number'],
  no: ['번호'],
  phone: ['휴대폰', '폰', 'phone'],
  file: ['파일', 'file'],
  log: ['로그', 'log'],
  record: ['기록', 'record'],
  family: ['가족'],
  sister: ['동생', '여동생'],
  brother: ['동생', '남동생'],
  clock: ['시계'],
  time: ['시간', '시각'],
  hourglass: ['모래시계'],
  sandglass: ['모래시계'],
  red: ['붉은', '빨간'],
  blue: ['푸른', '파란'],
  badge: ['배지'],
  ring: ['반지'],
  scar: ['상처', '흉터'],
  mark: ['표식', '문양'],
  token: ['토큰'],
};

const FORESHADOWING_ID_GENERIC_TOKENS = new Set([
  'fore',
  'foreshadowing',
  'plant',
  'hint',
  'setup',
  'payoff',
]);

function assessForeshadowingPlantConcreteness(
  evidence: string,
  scheduled: ForeshadowingScheduleItemForEvaluation,
  id: string
): ForeshadowingPlantConcretenessAssessment {
  const anchors = extractForeshadowingPlantAnchors(id);
  const normalizedEvidence = normalizeText(evidence);
  const matchedAnchors = anchors.filter(anchor =>
    normalizedEvidence.includes(normalizeText(anchor))
  );
  const concreteSignals = countMatches(evidence, FORESHADOWING_PLANT_CONCRETE_PATTERN);
  const subtleSignals = countMatches(evidence, FORESHADOWING_PLANT_SUBTLE_PATTERN);
  const abstractSignals = countMatches(evidence, FORESHADOWING_PLANT_ABSTRACT_PATTERN);
  const requiredAnchors = Math.min(2, Math.max(1, anchors.length));
  const anchorSatisfied =
    anchors.length === 0 ? concreteSignals >= 2 : matchedAnchors.length >= requiredAnchors;
  const passed =
    anchorSatisfied &&
    concreteSignals >= 1 &&
    subtleSignals >= 1 &&
    !(abstractSignals > 0 && concreteSignals === 0);

  return {
    passed,
    expected:
      `foreshadowing plant concreteness: ${id} must appear as an understated concrete clue ` +
      `with anchor=${anchors.join(', ') || 'specific object/detail'}, plant_chapter=${scheduled.plant_chapter ?? scheduled.setup_chapter ?? 'missing'}, ` +
      `payoff_chapter=${scheduled.payoff_chapter ?? 'missing'}.`,
    actual:
      `matchedAnchors=${matchedAnchors.join(', ') || 'none'}; ` +
      `concreteSignals=${concreteSignals}; subtleSignals=${subtleSignals}; abstractSignals=${abstractSignals}; ` +
      `evidence=${abbreviateEvidence(evidence)}`,
  };
}

function extractForeshadowingPlantAnchors(id: string): string[] {
  const tokens =
    normalizeText(id)
      .split(/\s+/u)
      .flatMap(token => token.split(/[_-]+/u))
      .map(token => token.trim())
      .filter(token => token.length >= 2 && !FORESHADOWING_ID_GENERIC_TOKENS.has(token)) ?? [];

  return uniqueStrings(
    tokens.flatMap(token => FORESHADOWING_ID_ANCHOR_ALIASES[token] ?? [token])
  );
}

function assessForeshadowingPayoffResolution(
  evidence: string,
  scheduled: ForeshadowingScheduleItemForEvaluation,
  id: string
): ForeshadowingPayoffResolutionAssessment {
  const anchors = extractForeshadowingPlantAnchors(id);
  const normalizedEvidence = normalizeText(evidence);
  const matchedAnchors = anchors.filter(anchor =>
    normalizedEvidence.includes(normalizeText(anchor))
  );
  const concreteSignals = countMatches(evidence, FORESHADOWING_PLANT_CONCRETE_PATTERN);
  const revealSignals = countMatches(evidence, FORESHADOWING_PAYOFF_REVEAL_PATTERN);
  const consequenceSignals = countMatches(
    evidence,
    FORESHADOWING_PAYOFF_CONSEQUENCE_PATTERN
  );
  const abstractSignals = countMatches(evidence, FORESHADOWING_PAYOFF_ABSTRACT_PATTERN);
  const requiredAnchors = Math.min(2, Math.max(1, anchors.length));
  const anchorSatisfied =
    anchors.length === 0 ? concreteSignals >= 2 : matchedAnchors.length >= requiredAnchors;
  const passed =
    anchorSatisfied &&
    concreteSignals >= 1 &&
    revealSignals >= 1 &&
    consequenceSignals >= 1 &&
    !(abstractSignals > 0 && revealSignals === 0);

  return {
    passed,
    expected:
      `foreshadowing payoff resolution: ${id} must turn the planted clue into resolved meaning, ` +
      `revelation, and a concrete story consequence at payoff_chapter=${scheduled.payoff_chapter ?? 'missing'}.`,
    actual:
      `matchedAnchors=${matchedAnchors.join(', ') || 'none'}; ` +
      `concreteSignals=${concreteSignals}; revealSignals=${revealSignals}; ` +
      `consequenceSignals=${consequenceSignals}; abstractSignals=${abstractSignals}; ` +
      `evidence=${abbreviateEvidence(evidence)}`,
  };
}

function evaluateHookLedger(
  hooks: HooksForEvaluation,
  chapter: ChapterWithReaderExperience,
  issues: EngagementContractIssue[]
): number {
  const mysteryHooks = hooks.mystery_hooks ?? [];
  const hooksById = new Map(
    mysteryHooks
      .filter(hook => hook.id?.trim())
      .map(hook => [hook.id!.trim(), hook])
  );
  const plantedIds = uniqueStrings(chapter.narrative_elements?.hooks_plant);
  const revealedIds = uniqueStrings(chapter.narrative_elements?.hooks_reveal);
  const declaredIds = uniqueStrings([...plantedIds, ...revealedIds]);
  let criticals = 0;

  for (const id of declaredIds) {
    if (!hooksById.has(id)) {
      criticals += 1;
      issues.push({
        code: 'hook-ledger-missing',
        severity: 'critical',
        message:
          'Chapter metadata declares a hook id that is absent from plot/hooks.json mystery_hooks.',
        expected:
          `plot/hooks.json mystery_hooks contains ${id} with plant_chapter and reveal_chapter.`,
        actual:
          `chapter ${chapter.chapter_number} declared ${id}; scheduled hook ids=${[...hooksById.keys()].join(', ') || 'none'}`,
      });
    }
  }

  for (const id of revealedIds) {
    const hook = hooksById.get(id);
    if (!hook) {
      continue;
    }

    if (hook.reveal_chapter !== chapter.chapter_number) {
      criticals += 1;
      issues.push({
        code: 'hook-reveal-timing-mismatch',
        severity: 'critical',
        message:
          'Chapter metadata reveals a mystery hook outside its scheduled reveal chapter.',
        expected:
          `${id} reveal_chapter=${hook.reveal_chapter ?? 'missing'} in plot/hooks.json.`,
        actual: `chapter ${chapter.chapter_number} declares hooks_reveal=${id}.`,
      });
    }
  }

  return criticals;
}

function evaluateArcBeatProgression(
  guide: ChapterGuide,
  chapter: ChapterWithReaderExperience,
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): { metadataFailures: number; manuscriptFailures: number } {
  const arcBeat = guide.arc_beats?.trim();
  if (!arcBeat) {
    return { metadataFailures: 0, manuscriptFailures: 0 };
  }

  let metadataFailures = 0;
  let manuscriptFailures = 0;
  const chapterEvidence = chapterToArcProgressionEvidenceText(chapter);
  if (!containsArcBeatEvidence(chapterEvidence, arcBeat)) {
    metadataFailures += 1;
    issues.push({
      code: 'arc-beat-not-staged',
      severity: 'critical',
      message: 'Chapter metadata does not stage the plot arc_beats progression.',
      expected: arcBeat,
      actual: abbreviateEvidence(chapterEvidence),
    });
  }

  if (manuscript !== undefined && !containsArcBeatEvidence(manuscript, arcBeat)) {
    manuscriptFailures += 1;
    issues.push({
      code: 'manuscript-arc-beat-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not execute the plot arc_beats progression on page.',
      expected: arcBeat,
      actual: abbreviateEvidence(manuscript),
    });
  }

  return { metadataFailures, manuscriptFailures };
}

function evaluateCharacterDriveProgression(
  chapter: ChapterWithReaderExperience,
  characters: CharacterReferenceForEvaluation[],
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): { metadataFailures: number; manuscriptFailures: number } {
  const protagonistDrive = selectProtagonistDrive(characters);
  if (!protagonistDrive) {
    return { metadataFailures: 0, manuscriptFailures: 0 };
  }

  let metadataFailures = 0;
  let manuscriptFailures = 0;
  const chapterEvidence = chapterToCharacterDriveEvidenceText(chapter);
  const metadataDrive = assessCharacterDriveEvidence(chapterEvidence, protagonistDrive);
  if (!metadataDrive.passed) {
    metadataFailures += 1;
    issues.push({
      code: 'character-drive-not-staged',
      severity: 'critical',
      message:
        'Chapter metadata does not connect the protagonist inner drive to a visible chapter choice, cost, or behavior change.',
      expected: metadataDrive.expected,
      actual: metadataDrive.actual,
    });
  }

  const text = manuscript?.trim();
  if (text) {
    const manuscriptDrive = assessCharacterDriveEvidence(text, protagonistDrive);
    if (!manuscriptDrive.passed) {
      manuscriptFailures += 1;
      issues.push({
        code: 'manuscript-character-drive-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript prose does not execute the protagonist inner drive as on-page choice, cost, or changed behavior.',
        expected: manuscriptDrive.expected,
        actual: manuscriptDrive.actual,
      });
    }
  }

  return { metadataFailures, manuscriptFailures };
}

interface CharacterDriveExpectation {
  characterName: string;
  want?: string;
  need?: string;
}

interface CharacterDriveAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

function selectProtagonistDrive(
  characters: CharacterReferenceForEvaluation[]
): CharacterDriveExpectation | undefined {
  const protagonist =
    characters.find(character => character.role === 'protagonist') ?? characters[0];
  const want = protagonist?.inner?.want?.trim();
  const need = protagonist?.inner?.need?.trim();
  if (!protagonist || (!want && !need)) {
    return undefined;
  }

  return {
    characterName: protagonist.name,
    want,
    need,
  };
}

function assessCharacterDriveEvidence(
  evidence: string,
  drive: CharacterDriveExpectation
): CharacterDriveAssessment {
  const driveSignals = [drive.want, drive.need].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  );
  const matchedSignals = driveSignals.filter(signal =>
    containsCharacterDriveSignal(evidence, signal)
  );
  const hasActionCost = hasDriveActionCostSignal(evidence);
  const passed = matchedSignals.length > 0 && hasActionCost;

  return {
    passed,
    expected:
      `${drive.characterName} inner.want/inner.need staged through choice, cost, or changed behavior: ` +
      driveSignals.join(' / '),
    actual:
      `matched drive signals=${matchedSignals.length}/${driveSignals.length}, ` +
      `choice/cost/change signal=${hasActionCost}, evidence="${abbreviateEvidence(evidence)}"`,
  };
}

function containsCharacterDriveSignal(evidence: string, expected: string): boolean {
  if (containsExpectedBeatEvidence(evidence, expected, 0.3)) {
    return true;
  }

  const normalizedEvidence = normalizeText(evidence);
  const terms = extractCharacterDriveTerms(expected);
  if (terms.length === 0) {
    return false;
  }

  const hits = terms.filter(term => normalizedEvidence.includes(term));
  return hits.length >= Math.min(2, terms.length);
}

function extractCharacterDriveTerms(value: string): string[] {
  const normalized = normalizeText(value);
  const terms = normalized
    .split(/[^가-힣a-z0-9]+/iu)
    .map(term => term.trim())
    .filter(term => term.length >= 2)
    .map(term =>
      term.replace(
        /(하는|하려는|하려고|하고|한다|했다|되는|으로|에게|에서|부터|까지|라는|것)$/u,
        ''
      )
    )
    .filter(term => term.length >= 2 && !CHARACTER_DRIVE_STOPWORDS.has(term));

  return uniqueStrings(terms);
}

const CHARACTER_DRIVE_STOPWORDS = new Set([
  '주인공',
  '캐릭터',
  '자신',
  '혼자',
  '처음',
  '때문',
  '위해',
]);

function hasDriveActionCostSignal(evidence: string): boolean {
  return /(선택|포기|요청|고백|인정|내려놓|받아들|감수|대가|비용|희생|손실|위험|도움|구하|찾|쥐|결심|결정|달라지|바뀌|행동|사과|공개)/u.test(
    evidence
  );
}

interface CharacterDriveCarryoverResult {
  metadataFailures: number;
  manuscriptFailures: number;
}

interface CharacterDriveCarryoverExpectation {
  source: string;
  terms: string[];
  requiredTerms: number;
}

interface CharacterDriveCarryoverAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

const CHARACTER_DRIVE_CARRYOVER_TRIGGER_PATTERN =
  /(내적\s*변화|결심|결정|다짐|인정|받아들|내려놓|포기|도움\s*요청|도움을\s*요청|습관|혼자\s*통제|통제권|달라진\s*행동|처음으로|더는\s*혼자|조력자에게)/u;
const CHARACTER_DRIVE_CARRYOVER_NEXT_PATTERN =
  /(다음\s*(?:회차|장면|행동)|이어|이어진|이어받|직전\s*내적\s*변화|때문에|그\s*결심|그\s*변화|달라진\s*행동|다시|이후)/u;
const CHARACTER_DRIVE_CARRYOVER_ACTION_PATTERN =
  /(도움\s*요청|도움을\s*요청|조력자에게|함께|통제권\s*(?:나누|맡기|공유)|혼자\s*통제(?:하려는)?\s*습관|습관(?:을)?\s*(?:내려놓|버리|포기)|단독\s*잠입(?:을)?\s*(?:버리|포기)|혼자(?:서)?\s*(?:하지|가지|움직이지)\s*않|달라진\s*행동|결심(?:을)?\s*(?:이어|지키)|처음\s*도움|도움(?:을)?\s*받|요청|포기|내려놓|감수|나누|맡기|연락)/gu;
const CHARACTER_DRIVE_CARRYOVER_PATTERN =
  /(직전|전\s*회차|지난|내적\s*변화|결심|결정|다짐|습관|혼자\s*통제|도움\s*요청|조력자|통제권|달라진\s*행동|이어|이어받|때문에|이후)/gu;

function evaluateCharacterDriveCarryover(
  chapter: ChapterWithReaderExperience,
  previousChapters: ChapterWithReaderExperience[],
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): CharacterDriveCarryoverResult {
  const result: CharacterDriveCarryoverResult = {
    metadataFailures: 0,
    manuscriptFailures: 0,
  };
  const previousChapter = latestPreviousChapter(chapter, previousChapters);

  if (!previousChapter || chapter.chapter_number <= 1) {
    return result;
  }

  const expectation = extractCharacterDriveCarryoverExpectation(previousChapter);
  if (!expectation) {
    return result;
  }

  const metadataAssessment = assessCharacterDriveCarryover(
    chapterToCharacterDriveCarryoverEvidenceText(chapter),
    expectation
  );
  if (!metadataAssessment.passed) {
    issues.push({
      code: 'character-drive-carryover-not-staged',
      severity: 'critical',
      message:
        'The chapter drops the prior protagonist inner change instead of carrying it into changed next-chapter behavior.',
      expected: metadataAssessment.expected,
      actual: metadataAssessment.actual,
    });
    result.metadataFailures++;
  }

  if (manuscript?.trim()) {
    const manuscriptAssessment = assessCharacterDriveCarryover(
      manuscriptToCharacterDriveCarryoverOpeningText(manuscript),
      expectation
    );
    if (!manuscriptAssessment.passed) {
      issues.push({
        code: 'manuscript-character-drive-carryover-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript opening skips the prior inner change instead of showing the protagonist choose or behave differently on page.',
        expected: manuscriptAssessment.expected,
        actual: manuscriptAssessment.actual,
      });
      result.manuscriptFailures++;
    }
  }

  return result;
}

function extractCharacterDriveCarryoverExpectation(
  previousChapter: ChapterWithReaderExperience
): CharacterDriveCarryoverExpectation | undefined {
  const candidates = [
    previousChapter.context?.next_plot,
    previousChapter.narrative_elements?.character_development,
    previousChapter.reader_experience?.character_appeal_moment,
    previousChapter.reader_experience?.chapter_reward,
  ]
    .map(value => value?.trim() ?? '')
    .filter(Boolean);

  let strongest: CharacterDriveCarryoverExpectation | undefined;
  for (const source of candidates) {
    const sourceIsNextFacing =
      CHARACTER_DRIVE_CARRYOVER_NEXT_PATTERN.test(source) ||
      source === previousChapter.context?.next_plot?.trim();

    if (
      !sourceIsNextFacing ||
      !CHARACTER_DRIVE_CARRYOVER_TRIGGER_PATTERN.test(source)
    ) {
      continue;
    }

    const terms = extractCharacterDriveCarryoverTerms(source);
    if (terms.length < 4) {
      continue;
    }

    const expectation = {
      source,
      terms,
      requiredTerms: Math.min(6, Math.max(4, Math.ceil(terms.length * 0.4))),
    };

    if (!strongest || expectation.terms.length > strongest.terms.length) {
      strongest = expectation;
    }
  }

  return strongest;
}

function extractCharacterDriveCarryoverTerms(source: string): string[] {
  const stopWords = new Set([
    '전',
    '회차',
    '직전',
    '다음',
    '장면',
    '행동',
    '주인공',
    '내적',
    '변화',
    '때문',
    '이어',
    '이어진다',
    '결심',
    '결정',
    '다짐',
    '달라진',
    '현재',
    '그',
    '보인다',
    '보여',
  ]);
  const terms = normalizeText(source)
    .split(/\s+/u)
    .map(token =>
      token.replace(
        /(으로|에서|에게|부터|까지|처럼|이라는|라는|하고|하며|해서|다는|과|와|의|을|를|이|가|은|는|도|만|로|에)$/u,
        ''
      )
    )
    .filter(token => token.length >= 2 && !stopWords.has(token));

  return uniqueStrings(terms).slice(0, 16);
}

function assessCharacterDriveCarryover(
  currentEvidence: string,
  expectation: CharacterDriveCarryoverExpectation
): CharacterDriveCarryoverAssessment {
  const directOverlap = containsExpectedBeatEvidence(
    currentEvidence,
    expectation.source,
    0.48
  );
  const normalizedEvidence = normalizeText(currentEvidence);
  const matchedTerms = expectation.terms.filter(term =>
    normalizedEvidence.includes(normalizeText(term))
  );
  const carryoverSignals = countMatches(
    currentEvidence,
    CHARACTER_DRIVE_CARRYOVER_PATTERN
  );
  const changedActionSignals = countMatches(
    currentEvidence,
    CHARACTER_DRIVE_CARRYOVER_ACTION_PATTERN
  );
  const passed =
    (directOverlap && changedActionSignals >= 2) ||
    (matchedTerms.length >= expectation.requiredTerms &&
      carryoverSignals >= 1 &&
      changedActionSignals >= 2);

  return {
    passed,
    expected:
      'character drive carryover: prior inner change must shape the next chapter previous_summary/current_plot, reader_experience, character_development, opening scene, and manuscript opening as a help request, abandoned habit, shared control, sacrifice, or changed choice.',
    actual:
      `direct overlap=${directOverlap}, matched terms=${matchedTerms.length}/${expectation.terms.length} ` +
      `(${matchedTerms.join(', ') || 'none'}), required terms=${expectation.requiredTerms}, ` +
      `carryover signals=${carryoverSignals}, changed action signals=${changedActionSignals}, ` +
      `prior="${abbreviateEvidence(expectation.source, 220)}", evidence="${abbreviateEvidence(currentEvidence, 260)}"`,
  };
}

function evaluateAntagonistStrategyProgression(
  chapter: ChapterWithReaderExperience,
  characters: CharacterReferenceForEvaluation[],
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): { metadataFailures: number; manuscriptFailures: number } {
  const strategies = selectAntagonistStrategies(characters);
  if (strategies.length === 0) {
    return { metadataFailures: 0, manuscriptFailures: 0 };
  }

  let metadataFailures = 0;
  let manuscriptFailures = 0;
  const chapterEvidence = chapterToAntagonistStrategyEvidenceText(chapter);
  for (const strategy of strategies) {
    const metadataStrategy = assessAntagonistStrategyEvidence(
      chapterEvidence,
      strategy
    );
    if (!metadataStrategy.passed) {
      metadataFailures += 1;
      issues.push({
        code: 'antagonist-strategy-not-staged',
        severity: 'critical',
        message:
          'Chapter metadata does not stage the antagonist strategy as a visible goal, trap, manipulation, targeting, or countermove.',
        expected: metadataStrategy.expected,
        actual: metadataStrategy.actual,
      });
    }
  }

  const text = manuscript?.trim();
  if (text) {
    for (const strategy of strategies) {
      const manuscriptStrategy = assessAntagonistStrategyEvidence(text, strategy);
      if (!manuscriptStrategy.passed) {
        manuscriptFailures += 1;
        issues.push({
          code: 'manuscript-antagonist-strategy-not-evidenced',
          severity: 'critical',
          message:
            'The manuscript prose does not execute the antagonist strategy as on-page trap, manipulation, targeting, or countermove.',
          expected: manuscriptStrategy.expected,
          actual: manuscriptStrategy.actual,
        });
      }
    }
  }

  return { metadataFailures, manuscriptFailures };
}

interface AntagonistStrategyExpectation {
  characterName: string;
  displayNames: string[];
  want?: string;
  fatalFlaw?: string;
}

interface AntagonistStrategyAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

function selectAntagonistStrategies(
  characters: CharacterReferenceForEvaluation[]
): AntagonistStrategyExpectation[] {
  return characters
    .filter(character => isAntagonistRole(character.role))
    .map(character => ({
      characterName: character.name,
      displayNames: uniqueStrings([character.name, ...(character.aliases ?? [])]).filter(
        name => name.length >= 2
      ),
      want: character.inner?.want?.trim(),
      fatalFlaw: character.inner?.fatal_flaw?.trim(),
    }))
    .filter(strategy => Boolean(strategy.want || strategy.fatalFlaw));
}

function isAntagonistRole(role: string | undefined): boolean {
  return /^(antagonist|villain|opponent|rival|foe|enemy|nemesis|악역|적대자|반대자|라이벌|범인|가해자)$/iu.test(
    role?.trim() ?? ''
  );
}

const ANTAGONIST_STRATEGY_ACTION_PATTERN =
  /(전략|계획|함정|유인|조작|차단|삭제|숨기|몰아넣|표적|표적으로|지목|감시|역이용|미끼|압박|협박|위협|기록을\s*바꿨|기록을\s*조작|알림을\s*보냈|이름을\s*올렸|수신자로\s*올|통제|반격|역습|가로막|유도)/u;
const ANTAGONIST_TARGETING_PATTERN =
  /(주인공|수신자|표적|피해자|선택지|기록|증거|현장|알림|미끼|함정|약점|가족|조력자|목숨|이름)/u;

function assessAntagonistStrategyEvidence(
  evidence: string,
  strategy: AntagonistStrategyExpectation
): AntagonistStrategyAssessment {
  const strategySignals = [strategy.want, strategy.fatalFlaw].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  );
  const matchedSignals = strategySignals.filter(signal =>
    containsAntagonistStrategySignal(evidence, signal)
  );
  const hasNamedActor = containsAnyDisplayName(evidence, strategy.displayNames);
  const hasStrategyAction = ANTAGONIST_STRATEGY_ACTION_PATTERN.test(evidence);
  const hasTargeting = ANTAGONIST_TARGETING_PATTERN.test(evidence);
  const qualifiedWindows = countAntagonistStrategyWindows(
    evidence,
    strategy,
    strategySignals
  );
  const passed = qualifiedWindows > 0;

  return {
    passed,
    expected:
      `${strategy.characterName} antagonist strategy staged through goal, trap, manipulation, targeting, or countermove: ` +
      strategySignals.join(' / '),
    actual:
      `named actor=${hasNamedActor}, strategy action=${hasStrategyAction}, targeting=${hasTargeting}, ` +
      `matched strategy signals=${matchedSignals.length}/${strategySignals.length}, qualified windows=${qualifiedWindows}, evidence="${abbreviateEvidence(evidence)}"`,
  };
}

function countAntagonistStrategyWindows(
  evidence: string,
  strategy: AntagonistStrategyExpectation,
  strategySignals: string[]
): number {
  const sentences = splitManuscriptSentences(evidence);
  const windows =
    sentences.length > 0
      ? sentences.map((_, index) =>
          sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ')
        )
      : [evidence];

  return windows.filter(window => {
    const matchedWindowSignals = strategySignals.filter(signal =>
      containsAntagonistStrategySignal(window, signal)
    );

    return (
      containsAnyDisplayName(window, strategy.displayNames) &&
      ANTAGONIST_STRATEGY_ACTION_PATTERN.test(window) &&
      ANTAGONIST_TARGETING_PATTERN.test(window) &&
      matchedWindowSignals.length > 0
    );
  }).length;
}

function containsAntagonistStrategySignal(evidence: string, expected: string): boolean {
  if (containsExpectedBeatEvidence(evidence, expected, 0.3)) {
    return true;
  }

  const normalizedEvidence = normalizeText(evidence);
  const terms = extractCharacterDriveTerms(expected).filter(
    term => !ANTAGONIST_STRATEGY_STOPWORDS.has(term)
  );
  if (terms.length === 0) {
    return false;
  }

  const hits = terms.filter(term => normalizedEvidence.includes(term));
  return hits.length >= Math.min(2, terms.length);
}

const ANTAGONIST_STRATEGY_STOPWORDS = new Set([
  '주인공',
  '모든',
  '다음',
  '첫',
  '것',
]);

function containsAnyDisplayName(evidence: string, displayNames: string[]): boolean {
  const normalizedEvidence = normalizeText(evidence);
  return displayNames.some(name => {
    const normalizedName = normalizeText(name);
    return normalizedName.length >= 2 && normalizedEvidence.includes(normalizedName);
  });
}

function uniqueStrings(values: string[] | undefined): string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))];
}

function buildRevisionDirectives(
  issues: EngagementContractIssue[]
): EngagementRevisionDirective[] {
  return issues
    .map((issue, index) => ({
      index,
      directive: toRevisionDirective(issue),
    }))
    .sort((left, right) => {
      const priorityDelta =
        priorityRank(left.directive.priority) - priorityRank(right.directive.priority);
      if (priorityDelta !== 0) return priorityDelta;

      const categoryDelta =
        directiveCategoryRank(left.directive.code) - directiveCategoryRank(right.directive.code);
      if (categoryDelta !== 0) return categoryDelta;

      return left.index - right.index;
    })
    .map(item => item.directive);
}

function toRevisionDirective(issue: EngagementContractIssue): EngagementRevisionDirective {
  const template = directiveTemplate(issue.code);

  return {
    code: issue.code,
    priority: priorityForIssue(issue),
    target: template.target,
    action: template.action,
    expected: issue.expected,
    actual: issue.actual,
  };
}

function priorityForIssue(issue: EngagementContractIssue): EngagementRevisionDirectivePriority {
  if (issue.severity === 'critical') return 'critical';
  if (issue.severity === 'major') return 'high';
  return 'medium';
}

function priorityRank(priority: EngagementRevisionDirectivePriority): number {
  switch (priority) {
    case 'critical':
      return 0;
    case 'high':
      return 1;
    case 'medium':
      return 2;
  }
}

function directiveCategoryRank(code: EngagementIssueCode): number {
  if (
    code === 'reader-reward-drift' ||
    code === 'page-turner-question-drift' ||
    code === 'arc-beat-not-staged' ||
    code === 'page-turn-question-closed' ||
    code === 'page-turn-question-too-broad' ||
    code === 'page-turn-question-not-staged' ||
    code === 'character-appeal-drift' ||
    code === 'character-appeal-signature-not-staged' ||
    code === 'character-drive-not-staged' ||
    code === 'character-drive-carryover-not-staged' ||
    code === 'antagonist-strategy-not-staged' ||
    code === 'antagonist-countermove-carryover-not-staged' ||
    code === 'drop-off-risk-drift' ||
    code === 'must-click-ending-drift' ||
    code === 'irresistible-question-drift' ||
    code === 'protagonist-appeal-drift' ||
    code === 'novelty-angle-drift' ||
    code === 'emotional-payoff-drift' ||
    code === 'long-series-engine-drift' ||
    code === 'long-hook-thread-not-staged' ||
    code === 'long-hook-thread-not-advanced' ||
    code === 'payoff-cadence-drift' ||
    code === 'fatigue-control-not-staged' ||
    code === 'tension-reset-not-staged' ||
    code === 'serial-escalation-variety-not-staged' ||
    code === 'serial-reward-pattern-repetition-not-staged' ||
    code === 'cliffhanger-carryover-not-staged' ||
    code === 'cliffhanger-carryover-delayed' ||
    code === 'choice-cost-lock-carryover-not-staged' ||
    code === 'revelation-consequence-carryover-not-staged' ||
    code === 'mystery-hypothesis-carryover-not-staged' ||
    code === 'scene-choice-tradeoff-not-staged' ||
    code === 'scene-choice-cost-lock-not-staged' ||
    code === 'scene-active-opposition-not-staged' ||
    code === 'scene-goal-tactic-turn-not-staged' ||
    code === 'scene-state-delta-not-staged' ||
    code === 'scene-causal-escalation-not-staged' ||
    code === 'relationship-shift-not-staged' ||
    code === 'relationship-turning-point-not-staged' ||
    code === 'relationship-mind-inference-not-staged' ||
    code === 'relationship-mutual-pressure-not-staged' ||
    code === 'relationship-evolution-not-recorded' ||
    code === 'relationship-evolution-carryover-not-staged' ||
    code === 'foreshadowing-ledger-missing' ||
    code === 'foreshadowing-payoff-timing-mismatch' ||
    code === 'foreshadowing-plant-not-staged' ||
    code === 'foreshadowing-payoff-not-staged' ||
    code === 'hook-ledger-missing' ||
    code === 'hook-reveal-timing-mismatch' ||
    code === 'binge-reason-not-staged' ||
    code === 'ending-hook-reaction-not-staged' ||
    code === 'retention-plan-drift' ||
    code === 'opening-hook-not-evidenced' ||
    code === 'opening-hook-delayed' ||
    code === 'opening-hook-not-embodied' ||
    code === 'manuscript-opening-momentum-not-evidenced' ||
    code === 'manuscript-arc-beat-not-evidenced' ||
    code === 'manuscript-irresistible-question-not-evidenced' ||
    code === 'manuscript-premise-engine-not-evidenced' ||
    code === 'manuscript-reward-not-evidenced' ||
    code === 'manuscript-earned-reward-not-evidenced' ||
    code === 'manuscript-reward-freshness-not-evidenced' ||
    code === 'manuscript-question-ladder-not-evidenced' ||
    code === 'manuscript-drop-off-mitigation-not-evidenced' ||
    code === 'manuscript-ending-not-evidenced' ||
    code === 'manuscript-ending-hook-not-staged' ||
    code === 'manuscript-ending-hook-closed' ||
    code === 'manuscript-ending-hook-question-too-broad' ||
    code === 'manuscript-ending-hook-reaction-not-evidenced' ||
    code === 'manuscript-ending-hook-setup-not-evidenced' ||
    code === 'manuscript-fair-twist-setup-not-evidenced' ||
    code === 'manuscript-forecast-revision-not-evidenced' ||
    code === 'manuscript-foreshadowing-plant-not-evidenced' ||
    code === 'manuscript-foreshadowing-payoff-not-evidenced' ||
    code === 'manuscript-appeal-not-evidenced' ||
    code === 'manuscript-protagonist-agency-not-evidenced' ||
    code === 'manuscript-choice-tradeoff-not-evidenced' ||
    code === 'manuscript-stakes-not-evidenced' ||
    code === 'manuscript-stakes-subject-not-personalized' ||
    code === 'manuscript-active-opposition-not-evidenced' ||
    code === 'manuscript-pressure-not-evidenced' ||
    code === 'manuscript-temporal-pressure-not-evidenced' ||
    code === 'manuscript-tactical-adaptation-not-evidenced' ||
    code === 'manuscript-consequence-not-evidenced' ||
    code === 'manuscript-reader-desire-not-evidenced' ||
    code === 'manuscript-payoff-not-evidenced' ||
    code === 'manuscript-payoff-embodiment-not-evidenced' ||
    code === 'manuscript-genre-delight-not-evidenced' ||
    code === 'manuscript-payoff-delight-not-evidenced' ||
    code === 'manuscript-emotional-arc-not-evidenced' ||
    code === 'manuscript-emotional-progression-not-evidenced' ||
    code === 'manuscript-affective-choice-turn-not-evidenced' ||
    code === 'manuscript-character-development-not-evidenced' ||
    code === 'manuscript-character-drive-not-evidenced' ||
    code === 'manuscript-character-drive-carryover-not-evidenced' ||
    code === 'manuscript-antagonist-strategy-not-evidenced' ||
    code === 'manuscript-antagonist-countermove-carryover-not-evidenced' ||
    code === 'manuscript-generic-character-label-not-evidenced' ||
    code === 'manuscript-design-jargon-not-evidenced' ||
    code === 'manuscript-long-hook-not-evidenced' ||
    code === 'manuscript-long-hook-clue-not-evidenced' ||
    code === 'manuscript-long-hook-thread-not-advanced' ||
    code === 'manuscript-payoff-cadence-not-evidenced' ||
    code === 'manuscript-fatigue-control-not-evidenced' ||
    code === 'manuscript-tension-reset-not-evidenced' ||
    code === 'manuscript-tension-peak-not-evidenced' ||
    code === 'manuscript-tension-wave-not-evidenced' ||
    code === 'manuscript-serial-escalation-variety-not-evidenced' ||
    code === 'manuscript-serial-reward-pattern-repetition-not-evidenced' ||
    code === 'manuscript-cliffhanger-carryover-not-evidenced' ||
    code === 'manuscript-cliffhanger-carryover-delayed' ||
    code === 'manuscript-choice-cost-lock-carryover-not-evidenced' ||
    code === 'manuscript-revelation-consequence-carryover-not-evidenced' ||
    code === 'manuscript-mystery-hypothesis-carryover-not-evidenced' ||
    code === 'manuscript-relationship-shift-not-evidenced' ||
    code === 'manuscript-relationship-turning-point-not-evidenced' ||
    code === 'manuscript-relationship-mind-inference-not-evidenced' ||
    code === 'manuscript-relationship-mutual-pressure-not-evidenced' ||
    code === 'manuscript-relationship-evolution-carryover-not-evidenced' ||
    code === 'manuscript-scene-intent-not-evidenced' ||
    code === 'manuscript-scene-order-not-evidenced' ||
    code === 'manuscript-scene-state-delta-not-evidenced' ||
    code === 'manuscript-scene-novelty-matrix-not-evidenced' ||
    code === 'manuscript-causal-chain-not-evidenced' ||
    code === 'manuscript-convenient-resolution-not-evidenced' ||
    code === 'manuscript-pov-focalization-not-evidenced' ||
    code === 'manuscript-summary-prose' ||
    code === 'manuscript-scene-density-not-evidenced' ||
    code === 'manuscript-signature-scene-image-not-evidenced' ||
    code === 'manuscript-motif-resonance-not-evidenced' ||
    code === 'manuscript-character-appeal-signature-not-evidenced' ||
    code === 'manuscript-spatial-blocking-not-evidenced' ||
    code === 'manuscript-dialogue-subtext-not-evidenced' ||
    code === 'manuscript-dialogue-conflict-not-evidenced' ||
    code === 'manuscript-dialogue-turn-not-evidenced' ||
    code === 'manuscript-dialogue-state-carryover-not-evidenced' ||
    code === 'manuscript-choice-cost-carryover-not-evidenced' ||
    code === 'manuscript-choice-cost-lock-not-evidenced' ||
    code === 'manuscript-character-voice-not-differentiated' ||
    code === 'manuscript-character-voice-profile-drift' ||
    code === 'reader-promise-generic' ||
    code === 'reader-promise-premise-not-integrated' ||
    code === 'fun-spec-generic' ||
    code === 'missing-core-hook' ||
    code === 'missing-chapter-guide'
  ) {
    return 0;
  }

  if (
    code === 'missing-scene-evidence' ||
    code === 'weak-scene-conflict' ||
    code === 'weak-scene-turn' ||
    code === 'scene-evidence-generic' ||
    code === 'signature-scene-image-not-staged' ||
    code === 'motif-resonance-not-staged' ||
    code === 'scene-novelty-matrix-not-staged' ||
    code === 'character-appeal-not-staged' ||
    code === 'must-click-ending-not-staged' ||
    code === 'chapter-reward-not-staged' ||
    code === 'drop-off-risk-not-mitigated'
  ) {
    return 1;
  }

  return 2;
}

function directiveTemplate(
  code: EngagementIssueCode
): Pick<EngagementRevisionDirective, 'target' | 'action'> {
  switch (code) {
    case 'reader-promise-generic':
      return {
        target: 'design_strategy',
        action: 'Rewrite reader_promise_contract into specific reader promise fields with a concrete premise mechanism, protagonist choice/cost, novelty mechanism, emotional payoff trigger, binge reason, and long-series engine.',
      };
    case 'reader-promise-premise-not-integrated':
      return {
        target: 'design_strategy',
        action: 'Rewrite reader_promise_contract so the core hook, novelty angle, irresistible question, binge reason, long-series engine, and first-five retention beats share recurring premise anchors from one coherent serial engine.',
      };
    case 'missing-chapter-guide':
      return {
        target: 'plot_strategy',
        action: 'Add a per_chapter_guide entry before judging or revising this chapter.',
      };
    case 'missing-core-hook':
      return {
        target: 'reader_experience',
        action: 'Rewrite promise_fulfillment so it explicitly carries the design core_hook.',
      };
    case 'arc-beat-not-staged':
      return {
        target: 'scenes',
        action: 'Revise chapter context, reader_experience, and scene conflict/beat so plot arc_beats visibly advances the main or sub arc instead of staying as unstaged plan text.',
      };
    case 'irresistible-question-drift':
      return {
        target: 'plot_strategy',
        action: 'Realign per-chapter page_turn_question and reader_experience so they preserve the design irresistible_question.',
      };
    case 'protagonist-appeal-drift':
      return {
        target: 'plot_strategy',
        action: 'Realign character_appeal_moment and scene evidence so they preserve the design protagonist_appeal.',
      };
    case 'character-drive-not-staged':
      return {
        target: 'scenes',
        action: 'Revise chapter context, reader_experience, character_development, and scene conflict/beat so the protagonist inner.want or inner.need drives a visible choice, cost, request, sacrifice, or changed behavior.',
      };
    case 'character-drive-carryover-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise previous_summary, current_plot, reader_experience, character_development, and the opening scene so character drive carryover is visible: the prior inner change must alter the next chapter behavior as a help request, abandoned habit, shared control, sacrifice, or changed choice.',
      };
    case 'antagonist-strategy-not-staged':
      return {
        target: 'scenes',
        action: 'Revise chapter context, reader_experience, and scene conflict/beat so the antagonist strategy is visible as a named opposing goal, trap, manipulation, targeting, or countermove rather than anonymous pressure.',
      };
    case 'antagonist-countermove-carryover-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise previous_summary, current_plot, reader_experience, and the opening scene so antagonist countermove carryover is visible: after the prior protagonist disruption, the opposing actor must change tactics, reset a target, delete evidence, revoke access, or launch a concrete retaliation.',
      };
    case 'novelty-angle-drift':
      return {
        target: 'plot_strategy',
        action: 'Realign per-chapter reward, promise_fulfillment, and scene evidence so they preserve the design novelty_angle.',
      };
    case 'emotional-payoff-drift':
      return {
        target: 'plot_strategy',
        action: 'Realign per-chapter reward, promise_fulfillment, and scene emotional beats so they preserve the design emotional_payoff.',
      };
    case 'long-series-engine-drift':
      return {
        target: 'plot_strategy',
        action: 'Realign binge_architecture long_hook_threads and chapter evidence so they preserve the design long_series_engine.',
      };
    case 'long-hook-thread-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise chapter reward, promise_fulfillment, or scene beats so at least one plot long_hook_thread is visible in chapter evidence.',
      };
    case 'long-hook-thread-not-advanced':
      return {
        target: 'plot_strategy',
        action: 'Revise chapter reward, promise_fulfillment, current_plot, or scene beats so the staged long_hook_thread advances this chapter through a new concrete clue, narrowed hypothesis, changed risk, or next verification action instead of remaining a static mention.',
      };
    case 'payoff-cadence-drift':
      return {
        target: 'plot_strategy',
        action: 'Realign chapter reward and ending evidence with the plot payoff_cadence.',
      };
    case 'fatigue-control-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise chapter promise_fulfillment, drop-off mitigation, or scene beats so at least one plot fatigue_controls item is visible as anti-repetition variation.',
      };
    case 'tension-reset-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise chapter promise_fulfillment, drop-off mitigation, or scene beats so the plot tension_reset_plan is visible: a brief breath, quiet/analysis beat, sensory pause, or emotional reset followed by a renewed question, alert, threat, or open loop.',
      };
    case 'serial-escalation-variety-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise per_chapter_guide, reader_experience, and scene conflict/beat so this chapter has serial escalation variety against the prior chapter: add a new conflict axis such as relationship rupture, antagonist countermove, new setting/action mode, rule change, higher cost, or irreversible status change.',
      };
    case 'serial-reward-pattern-repetition-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise chapter_reward so serial reward pattern variation changes the reward delivery itself, not only surrounding conflict: avoid repeating log-record comparison or alert-rule proof; make the payoff arrive through a new reward mode such as relationship betrayal, antagonist countermove, action-mode reversal, higher cost, rule mutation, or concrete object reveal.',
      };
    case 'cliffhanger-carryover-not-staged':
      return {
        target: 'scenes',
        action: 'Revise current_plot, reader_experience, and the opening scene so the prior must_click_ending is carried into the next chapter as immediate action, discovery, pressure, or consequence instead of being dropped after the click.',
      };
    case 'cliffhanger-carryover-delayed':
      return {
        target: 'scenes',
        action: 'Move the prior must_click_ending carryover into the opening scene or first staged turn. Do not leave it only in current_plot, chapter_reward, or a later scene after unrelated setup.',
      };
    case 'choice-cost-lock-carryover-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise previous_summary, current_plot, reader_experience, and the opening scene so the prior choice-cost lock becomes current chapter pressure: the locked option, relationship, evidence path, time window, or route must constrain the next action.',
      };
    case 'revelation-consequence-carryover-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise previous_summary, current_plot, reader_experience, and the opening scene so the prior revelation changes the current plan, pressure, suspect map, relationship stance, or next question. A reveal must create consequences, not reset into a new unrelated investigation.',
      };
    case 'mystery-hypothesis-carryover-not-staged':
      return {
        target: 'plot_strategy',
        action: 'Revise previous_summary, current_plot, reader_experience, and the opening scene so mystery hypothesis carryover is visible: the prior clue must revise the working hypothesis, reorder the suspect map, eliminate or promote a suspect, and create a next verification action.',
      };
    case 'scene-choice-tradeoff-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene conflict/beat so at least one core scene stages a choice-cost tradeoff: competing options, the alternative being sacrificed, and the concrete cost or risk created by the chosen action.',
      };
    case 'scene-choice-cost-lock-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene conflict/beat into a choice-cost lock: the protagonist choice must close a future option, relationship, evidence path, time window, or route in a way that cannot be freely undone in the next beat.',
      };
    case 'scene-active-opposition-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene conflict/beat so scene active opposition is visible: an antagonist, hostile system, or opposing human will deliberately blocks, manipulates, threatens, or targets the protagonist around the pressure.',
      };
    case 'scene-goal-tactic-turn-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene conflict/beat into goal-attempt-outcome movement: the protagonist should want a concrete scene goal, hit a blocking force, change tactic or commit to a specific method, and leave the scene with a changed result.',
      };
    case 'relationship-shift-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene conflict or beat so the declared relationship shift is staged as reciprocal action and reaction: disclosure, refusal, apology, protection, alliance, betrayal, changed address, or changed behavior.',
      };
    case 'relationship-turning-point-not-staged':
      return {
        target: 'scenes',
        action: 'Revise the relationship turning point so one scene binds vulnerability or relational risk, counterpart choice/reaction, changed trust/distance/alliance, and an immediate behavior consequence in the same scene window.',
      };
    case 'relationship-mind-inference-not-staged':
      return {
        target: 'scenes',
        action: 'Revise the relationship turning point so readers can infer a hidden motive, withheld truth, misreading, hesitation, or changed inner stance through gaze, silence, evasion, dialogue, or POV interpretation instead of only listing relationship outcomes.',
      };
    case 'relationship-mutual-pressure-not-staged':
      return {
        target: 'scenes',
        action: 'Revise the relationship turning point so the counterpart brings independent pressure: a condition, refusal, demand, competing goal, personal cost, secret, or risk that forces the protagonist to negotiate instead of simply receiving help or forgiveness.',
      };
    case 'relationship-evolution-not-recorded':
      return {
        target: 'relationships',
        action: 'Update characters/relationships.json evolution for this chapter so the staged relationship shift becomes durable story state for future chapters.',
      };
    case 'relationship-evolution-carryover-not-staged':
      return {
        target: 'relationships',
        action: 'Revise previous_summary, current_plot, reader_experience, and the opening scene so prior relationship evolution becomes current relational pressure, dialogue stance, trust/distrust, alliance, distance, or changed behavior.',
      };
    case 'foreshadowing-ledger-missing':
      return {
        target: 'plot_strategy',
        action: 'Add the declared foreshadowing id to plot foreshadowing_schedule or remove the chapter metadata reference so setup/payoff tracking stays canonical.',
      };
    case 'foreshadowing-payoff-timing-mismatch':
      return {
        target: 'plot_strategy',
        action: 'Realign chapter foreshadowing_payoff with the scheduled payoff_chapter, or revise foreshadowing_schedule if this chapter is now the earned payoff point.',
      };
    case 'foreshadowing-plant-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene conflict/beat so foreshadowing plant concreteness is visible: every declared foreshadowing_plant should appear as an understated but concrete clue such as a logo, number, mark, file, scar, voice, object, or sensory detail instead of abstract future foreshadowing.',
      };
    case 'foreshadowing-payoff-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene conflict/beat so foreshadowing payoff resolution is visible: every declared foreshadowing_payoff should reveal what the planted clue means, connect it to a concrete cause or culprit, and force a story consequence or changed action.',
      };
    case 'hook-ledger-missing':
      return {
        target: 'hooks_ledger',
        action: 'Add the declared hook id to plot/hooks.json mystery_hooks or remove the chapter hooks_plant/hooks_reveal reference so long-hook tracking stays canonical.',
      };
    case 'hook-reveal-timing-mismatch':
      return {
        target: 'hooks_ledger',
        action: 'Realign chapter hooks_reveal with the mystery hook reveal_chapter in plot/hooks.json, or move the reveal_chapter if this chapter now earns the answer.',
      };
    case 'binge-reason-not-staged':
      return {
        target: 'final_scene',
        action: 'Rewrite the must_click_ending or final scene so the design binge_reason is visible at the chapter break.',
      };
    case 'retention-plan-drift':
      return {
        target: 'scenes',
        action: 'Revise scene purpose, conflict, or beat so this chapter stages its first-five retention plan promise.',
      };
    case 'opening-hook-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the chapter 1 opening paragraph so it immediately stages the design core_hook or novelty_angle.',
      };
    case 'opening-hook-delayed':
      return {
        target: 'manuscript',
        action: 'Rewrite chapter 1 so the first sentence or first beat itself stages the design core_hook or novelty_angle before ordinary routine, weather, or mood.',
      };
    case 'opening-hook-not-embodied':
      return {
        target: 'manuscript',
        action: 'Rewrite the chapter 1 first-screen hook so the first one or two sentences bind the premise to live protagonist action or decision pressure, sensory/POV grounding, and an unresolved danger or question instead of only naming the concept.',
      };
    case 'manuscript-opening-momentum-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the chapter opening momentum so later chapters begin in a live scene beat, not with recap, summary, or calm prior-event review.',
      };
    case 'manuscript-arc-beat-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the plot arc_beats progression happens on page as a concrete discovery, decision, reversal, loss, or irreversible state change.',
      };
    case 'manuscript-irresistible-question-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the design irresistible_question and page_turner_question are raised on page as an unresolved why/how mystery, not only preserved in metadata.',
      };
    case 'manuscript-premise-engine-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the design core_hook/novelty_angle acts as a premise engine on page: its rule, device, condition, or taboo must constrain a choice, change a tactic, create risk, and open the next story question.',
      };
    case 'manuscript-reward-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the promised chapter_reward is visibly staged in action, discovery, or consequence.',
      };
    case 'manuscript-earned-reward-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the chapter_reward becomes an earned reward: the protagonist handles concrete clues, makes an inference or choice, and the discovery follows from that action instead of arriving as passive exposition.',
      };
    case 'manuscript-reward-freshness-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite reward freshness: make the earned reward do more than confirm matching records by attaching a premise-specific device, rule change, embodied genre payoff, and changed next action or pressure.',
      };
    case 'manuscript-question-ladder-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the question ladder: every earned answer, reveal, or reward should expose a sharper unresolved why/how/who/what-next question, changed rule, new target, hidden actor, or remaining cost instead of closing curiosity.',
      };
    case 'manuscript-reader-desire-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite reader desire intensity: make the chapter outcome something the reader wants by tying a concrete person, relationship, identity, or evidence to protagonist intent, blocked alternatives, urgency, and failure cost on page.',
      };
    case 'manuscript-drop-off-mitigation-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the declared drop_off_risk mitigation is executed as an on-page action sequence, not only implied by metadata.',
      };
    case 'manuscript-ending-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the manuscript ending so the must_click_ending appears on the page, not only in metadata.',
      };
    case 'manuscript-ending-hook-not-staged':
      return {
        target: 'manuscript',
        action: 'Move and rewrite the must_click_ending into the chapter break as a staged new hook: a fresh event, revelation, threat, or unanswered question.',
      };
    case 'manuscript-ending-hook-closed':
      return {
        target: 'manuscript',
        action: 'Rewrite the final beat so the must_click_ending remains an unresolved open loop instead of explaining, solving, or emotionally closing the hook.',
      };
    case 'manuscript-ending-hook-question-too-broad':
      return {
        target: 'manuscript',
        action: 'Rewrite the final open-loop question so it points at a narrow information gap with at least two concrete anchors, such as logo plus case number, target plus object, location plus time, named actor plus clue, or rule plus cost.',
      };
    case 'manuscript-ending-hook-reaction-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the final hook so the protagonist reaction is visible through body sensation, physical action, or immediate danger response at the chapter break.',
      };
    case 'manuscript-ending-hook-setup-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite ending hook setup: plant the final cliffhanger location, identity, or object anchor earlier as a concrete clue before it becomes the must-click hook.',
      };
    case 'manuscript-fair-twist-setup-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the final reveal is a fair twist: plant setup clues before the chapter break, echo the reveal clue family, and make the twist feel earned rather than newly imported.',
      };
    case 'manuscript-forecast-revision-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite forecast revision: if the chapter promises a reversal or the prose sets up an expectation, show the expected interpretation, the concrete clue or event that breaks it, and the resulting revised hypothesis, suspect ranking, meaning, plan, or next verification action.',
      };
    case 'manuscript-foreshadowing-plant-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so foreshadowing plant concreteness appears on page: plant the declared clue as a visible logo, number, mark, file, scar, voice, object, or sensory detail with subtle placement, not as explanation.',
      };
    case 'manuscript-foreshadowing-payoff-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so foreshadowing payoff resolution appears on page: the planted clue must gain meaning, expose a cause, culprit, or hidden link, and change the protagonist action, danger, relationship, or next objective.',
      };
    case 'manuscript-appeal-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so character_appeal_moment is visible as protagonist choice, action, or cost.',
      };
    case 'manuscript-protagonist-agency-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the protagonist makes a visible decision, takes action, and pays or risks a cost on page.',
      };
    case 'manuscript-choice-tradeoff-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the protagonist action is anchored in an explicit choice tradeoff: competing options, a sacrificed alternative, and the cost of the chosen action on page.',
      };
    case 'manuscript-stakes-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so stakes clarity appears before the action turns irreversible: identify who or what can be lost, what threat/cost is closing in, and why the protagonist must act now.',
      };
    case 'manuscript-stakes-subject-not-personalized':
      return {
        target: 'manuscript',
        action: 'Rewrite the at-risk subject so generic labels such as victim, target, recipient, or person gain personal specificity: a name, relationship, role, possession, voice, identifier, or concrete trace that makes the reader care who is being lost.',
      };
    case 'manuscript-active-opposition-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so active opposition is visible on page: an antagonist, hostile system, or opposing human will deliberately blocks, manipulates, threatens, or targets the protagonist around the scene pressure.',
      };
    case 'manuscript-pressure-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the scene pressure/obstacle appears as an active opposing force, ticking clock, blockage, reversal, or consequence on page.',
      };
    case 'manuscript-tactical-adaptation-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite tactical adaptation: when a reversal blocks the first plan, make the protagonist recalculate, change plan, switch tools, reroute, use a new clue, or commit to a different next action on page.',
      };
    case 'manuscript-consequence-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so pressure changes the situation through a concrete consequence/escalation: loss, failure, irreversible change, new threat, or worsened stakes.',
      };
    case 'manuscript-payoff-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the design emotional_payoff is felt on the page, not only described in metadata.',
      };
    case 'manuscript-payoff-embodiment-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite abstract payoff labels into embodied emotional payoff: body sensation, sensory detail, or action reaction around the reward moment.',
      };
    case 'manuscript-genre-delight-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite genre-specific delight: make the promised emotional payoff land through genre-native scene mechanics such as mystery clue convergence/inference, romance proximity/vulnerable exchange/relationship choice, action kinetic reversal, thriller trap escalation, or modern-fantasy system feedback/consequence, not only a named feeling plus body reaction.',
      };
    case 'manuscript-payoff-delight-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite payoff delight: make the earned reward land as a high-point moment with accumulated pressure, a meaning shift or reversal, embodied reaction, and an immediate new consequence or question.',
      };
    case 'manuscript-emotional-arc-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so narrative_elements.emotional_goal and scene emotional_tone are executed as visible emotional arc beats, not left only in metadata.',
      };
    case 'manuscript-emotional-progression-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the emotional progression so each declared emotional shift has a visible transition beat: the event, choice, relationship reaction, or embodied action that moves the character from one state to the next.',
      };
    case 'manuscript-affective-choice-turn-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the emotional turn so the changed feeling alters a concrete choice, action, relationship stance, or consequence on page instead of remaining internal mood narration.',
      };
    case 'manuscript-character-development-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so narrative_elements.character_development is executed as an on-page character change through choice, admission, cost, relationship action, or changed behavior.',
      };
    case 'manuscript-character-drive-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the protagonist inner.want or inner.need becomes scene-native motivation: a concrete desire or lack pressures a choice, cost, request for help, sacrifice, or changed behavior on page.',
      };
    case 'manuscript-character-drive-carryover-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the manuscript opening so character drive carryover happens on page: the protagonist prior inner change should make them ask for help, abandon the old habit, share control, sacrifice, or choose differently before the new investigation beat.',
      };
    case 'manuscript-antagonist-strategy-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the antagonist strategy appears on page through a named opposing actor executing a trap, manipulation, targeting move, countermove, or controlled choice that advances their goal.',
      };
    case 'manuscript-antagonist-countermove-carryover-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the manuscript opening so antagonist countermove carryover appears on page: the prior protagonist action must make the opposing actor retaliate through a changed tactic, target reset, evidence deletion, access revocation, or direct pressure.',
      };
    case 'manuscript-generic-character-label-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose to use established character names or aliases instead of repeated planning labels like protagonist/supporter in final prose.',
      };
    case 'manuscript-design-jargon-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite design or evaluation jargon into scene-native prose: concrete clue, body reaction, action, consequence, or dialogue subtext on the page.',
      };
    case 'manuscript-long-hook-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so at least one plot long_hook_thread is visible as an active mystery, clue, or consequence.',
      };
    case 'manuscript-long-hook-clue-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite abstract long-hook claims into a concrete clue on page: a number, file, record, logo, name, message, object, or trace the reader can remember.',
      };
    case 'manuscript-long-hook-thread-not-advanced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the long-hook clue changes the story state on page: reveal something new, narrow a hypothesis, raise a concrete risk, or force the next verification action instead of restating that the mystery remains.',
      };
    case 'manuscript-payoff-cadence-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so the plot payoff_cadence is visible as an on-page reward rhythm.',
      };
    case 'manuscript-fatigue-control-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite repetitive manuscript beats so plot fatigue_controls are visible on page: add relationship pressure, physical location variation, action-mode variation, or sensory/emotional reset instead of repeating the same investigation pattern.',
      };
    case 'manuscript-tension-reset-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite continuous escalation into controlled tension rhythm: after a high-intensity beat, add a brief breath, quiet clue-analysis moment, sensory pause, or emotional reset, then reopen tension with a new question, alert, threat, or unresolved hook.',
      };
    case 'manuscript-tension-peak-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the declared tension-curve peak on page as a pressure/action/consequence turn: the peak event should appear in a 1-3 sentence window with concrete risk or obstacle, protagonist action or forced choice, and an irreversible result, reveal, or sharper open question.',
      };
    case 'manuscript-tension-wave-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the manuscript tension wave so pressure is distributed and ordered: open with a live risk or question, escalate through a middle complication that narrows options or raises cost, then land the final peak or open loop with action, consequence, and unresolved next question.',
      };
    case 'manuscript-serial-escalation-variety-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so serial escalation variety is visible on page against the prior chapter: the repeated reward, investigation, alert, or location pattern must be broken by a new conflict axis, changed tactic, antagonist countermove, higher cost, or irreversible status change.',
      };
    case 'manuscript-serial-reward-pattern-repetition-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the reward moment so serial reward pattern variation is visible on page. Do not repeat the prior chapter reward delivery pattern such as log-record comparison or alert-rule proof; make the payoff land through a new reward mode such as relationship betrayal, antagonist countermove, action-mode reversal, higher cost, rule mutation, or concrete object reveal.',
      };
    case 'manuscript-cliffhanger-carryover-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the manuscript opening so the prior must_click_ending is paid forward on page as immediate action, discovery, pressure, or consequence; do not skip into a new plot thread after a cliffhanger.',
      };
    case 'manuscript-cliffhanger-carryover-delayed':
      return {
        target: 'manuscript',
        action: 'Rewrite the first two manuscript sentences so they directly continue the prior must_click_ending as current action, discovery, pressure, or consequence before any new setup, recap, or separate investigation beat.',
      };
    case 'manuscript-choice-cost-lock-carryover-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the manuscript opening so the prior choice-cost lock is visible on page as current pressure: the locked option, relationship, evidence path, time window, or route should narrow what the protagonist can do next.',
      };
    case 'manuscript-revelation-consequence-carryover-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the manuscript opening so the prior revelation changes what the protagonist does now: alter the plan, suspect map, route, trust, pressure, or next question on page before moving to a new investigation beat.',
      };
    case 'manuscript-mystery-hypothesis-carryover-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the manuscript opening so mystery hypothesis carryover happens on page: the prior clue should make the protagonist revise a hypothesis, change suspect ranking, eliminate or promote a suspect, and choose the next verification action before chasing a new clue.',
      };
    case 'manuscript-relationship-shift-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the relationship shift as on-page reciprocal change: one character acts or discloses, the other reacts, resists, accepts, protects, betrays, or changes behavior, and the new relationship state affects the next beat.',
      };
    case 'manuscript-relationship-turning-point-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the relationship turning point on page so vulnerability or relational risk, the counterpart choice/reaction, changed trust/distance/alliance, and a visible next behavior happen within the same 1-2 sentence window.',
      };
    case 'manuscript-relationship-mind-inference-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the relationship turning point so readers can infer hidden motive, withheld truth, misreading, hesitation, or changed inner stance from gaze, silence, evasion, dialogue, or POV interpretation in the same 1-2 sentence window.',
      };
    case 'manuscript-relationship-mutual-pressure-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the relationship turning point so the counterpart has their own leverage or cost on page: a condition, refusal, demand, competing goal, personal risk, secret, or price that changes what the protagonist can do next.',
      };
    case 'manuscript-relationship-evolution-carryover-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the manuscript opening so prior relationship evolution is visible on page through changed address, trust/distrust, silence, pushback, protection, alliance, distance, or altered dialogue behavior.',
      };
    case 'manuscript-scene-intent-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so each declared scene conflict and turn is executed on page, not only in chapter metadata.',
      };
    case 'manuscript-scene-order-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so declared scene order is preserved on page; do not execute later scene turns before earlier scene conflicts.',
      };
    case 'manuscript-scene-state-delta-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite scene turn windows so each scene creates a visible before/after story-state shift: reader knowledge, danger, relationship, locked option, world rule, or next action must change on page because of the scene result.',
      };
    case 'manuscript-scene-novelty-matrix-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite key scene windows so the staged scene novelty matrix appears on page: combine a fresh reward delivery mode, conflict/tactic mode, setting constraint or affordance, and opposition countermove in the same live scene flow.',
      };
    case 'manuscript-causal-chain-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite adjacent facts into a cause-and-effect chain: pressure changes the protagonist action, the action triggers a consequence, and the consequence opens the next beat.',
      };
    case 'manuscript-convenient-resolution-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the rescue/resolution so it is earned by prior setup and protagonist agency: plant the helper, route, signal, clue, or tool before the crisis, make the protagonist trigger or choose it, and let the outcome create a new cost or consequence instead of arriving by coincidence.',
      };
    case 'manuscript-temporal-pressure-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the ticking-clock beat so time pressure changes the action on page: put a concrete deadline/countdown/time marker beside the protagonist response, then show a narrowed option, lost window, delay cost, or worsened consequence caused by that time pressure.',
      };
    case 'manuscript-pov-focalization-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose so key event, clue, reward, and hook beats are filtered through POV perception: a named or pronominal character anchor plus body reaction, attention, or interpretive uncertainty on page.',
      };
    case 'manuscript-narrative-transportation-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite manuscript prose for narrative transportation: bind concrete space/object/action, POV affect, and focused attention into adjacent scene-native sentences so readers can imagine the plot and feel the character pressure instead of reading abstract story-function summary.',
      };
    case 'manuscript-summary-prose':
      return {
        target: 'manuscript',
        action: 'Rewrite summary-like manuscript passages into on-page scene texture with concrete sensory detail, physical action, or dialogue.',
      };
    case 'manuscript-scene-density-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite report-like manuscript passages into on-page scene flow with direct physical action, embodied reaction, sensory grounding, and dialogue or subtext.',
      };
    case 'manuscript-signature-scene-image-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite at least one key reward, reversal, or ending-hook moment into a signature scene image: combine a memorable object or place, visual detail, protagonist body/action, story turn, and story-impact lift in the same 1-2 sentence window.',
      };
    case 'manuscript-motif-resonance-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the resonance_seed as an on-page motif: repeat the seed object/image inside a live scene, attach it to body emotion or POV aftertaste, make it change meaning, and let that meaning alter the next choice, relationship, rule, clue, or irreversible consequence.',
      };
    case 'manuscript-spatial-blocking-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite action scenes with spatial blocking: anchor the place, show the movement path, and put the obstacle, distance, or blocking object on the page so the reader can follow the pressure.',
      };
    case 'manuscript-dialogue-subtext-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite expository dialogue into dialogue subtext: friction, evasion, pushback, withheld intent, silence, or action beats that reveal the information indirectly.',
      };
    case 'manuscript-dialogue-conflict-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite multi-turn dialogue with dialogue conflict: add pushback, refusal, evasion, threat, charged silence, or an action beat between speakers.',
      };
    case 'manuscript-dialogue-turn-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite contested multi-turn dialogue with a dialogue turn: make the exchange change story state through new information, power shift, relationship state change, accepted/refused terms, or a concrete next action.',
      };
    case 'manuscript-dialogue-state-carryover-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite dialogue state carryover: after a dialogue turn changes story state, make the next action or pressure beat use that changed information, condition, power balance, relationship state, object, or open path.',
      };
    case 'manuscript-choice-cost-carryover-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite choice cost carryover: when the protagonist sacrifices an option, make that cost narrow the next options, block a route, increase suspicion, remove evidence, shorten time, or create the next pressure beat.',
      };
    case 'manuscript-choice-cost-lock-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the choice-cost lock on page: after the protagonist commits, make a future option, relationship, evidence path, time window, or route visibly close, vanish, narrow, or become impossible so the choice changes durable story state.',
      };
    case 'manuscript-character-voice-not-differentiated':
      return {
        target: 'manuscript',
        action: 'Rewrite attributed multi-speaker dialogue for character voice differentiation: give each speaker distinct diction, speech level, sentence rhythm, verbal habits, and response tactics instead of repeated or interchangeable lines.',
      };
    case 'manuscript-character-voice-profile-drift':
      return {
        target: 'manuscript',
        action: 'Rewrite attributed character dialogue to match the character voice profile: preserve the planned honorific level, speech pattern, vocabulary, and signature verbal habits unless an on-page relationship or stress beat justifies the shift.',
      };
    case 'manuscript-character-appeal-signature-not-evidenced':
      return {
        target: 'manuscript',
        action: 'Rewrite the protagonist appeal beat as a signature character action: in the same 1-2 sentence window, combine the protagonist unique method/trait, self-directed action, cost or vulnerability, and a visible story or social reaction.',
      };
    case 'fun-spec-generic':
      return {
        target: 'plot_strategy',
        action: 'Replace generic fun_spec fields with concrete reader reward, page-turn question, protagonist choice/cost, drop-off mitigation, and must-click ending evidence.',
      };
    case 'page-turn-question-closed':
      return {
        target: 'plot_strategy',
        action: 'Rewrite page_turn_question and page_turner_question as an unresolved open-loop question that preserves what the reader still does not know instead of explaining or solving the answer.',
      };
    case 'page-turn-question-too-broad':
      return {
        target: 'plot_strategy',
        action: 'Rewrite page_turn_question and page_turner_question into a narrow information gap with two specific anchors, such as a named clue plus owner, logo plus case number, target plus object, rule plus cost, or location plus time.',
      };
    case 'page-turn-question-not-staged':
      return {
        target: 'final_scene',
        action: 'Rewrite the final scene purpose, conflict, or beat so the page_turner_question is earned by a concrete clue, reveal, threat, object, or event at the chapter break.',
      };
    case 'reader-reward-drift':
      return {
        target: 'reader_experience',
        action: 'Align chapter_reward with the plot fun_spec reader_reward.',
      };
    case 'page-turner-question-drift':
      return {
        target: 'reader_experience',
        action: 'Align page_turner_question with the plot fun_spec page_turn_question.',
      };
    case 'character-appeal-drift':
      return {
        target: 'reader_experience',
        action: 'Align character_appeal_moment with the plot fun_spec character appeal beat.',
      };
    case 'character-appeal-not-staged':
      return {
        target: 'scenes',
        action: 'Stage the protagonist appeal moment as a visible choice, action, or cost inside scene evidence.',
      };
    case 'character-appeal-signature-not-staged':
      return {
        target: 'scenes',
        action: 'Revise the protagonist appeal scene into a signature character action: combine a unique method/trait, self-directed action, cost or vulnerability, and a visible story or social reaction instead of only naming that the protagonist is appealing.',
      };
    case 'drop-off-risk-drift':
      return {
        target: 'reader_experience',
        action: 'Align drop_off_risk with the plot fun_spec retention risk and mitigation.',
      };
    case 'must-click-ending-drift':
      return {
        target: 'reader_experience',
        action: 'Align must_click_ending with the plot fun_spec ending hook.',
      };
    case 'weak-cliffhanger':
      return {
        target: 'reader_experience',
        action: 'Raise cliffhanger_strength to at least 7 and sharpen the ending question.',
      };
    case 'missing-scene-evidence':
      return {
        target: 'scenes',
        action: 'Add scene evidence with purpose, conflict, and beat fields before approval.',
      };
    case 'weak-scene-conflict':
      return {
        target: 'scenes',
        action: 'Revise scene conflict fields so at least 75% stage concrete pressure.',
      };
    case 'weak-scene-turn':
      return {
        target: 'scenes',
        action: 'Revise scene beats so at least 75% change the situation on page.',
      };
    case 'scene-state-delta-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene conflict/beat pairs so at least 75% have an explicit before/after story-state delta: reader knowledge, danger, relationship, locked option, world rule, or next action must change because of the scene result.',
      };
    case 'scene-causal-escalation-not-staged':
      return {
        target: 'scenes',
        action: 'Revise adjacent scenes so each previous scene consequence explicitly drives the next scene pressure, action, or result.',
      };
    case 'scene-evidence-generic':
      return {
        target: 'scenes',
        action: 'Rewrite abstract scene metadata into concrete scene execution with visible action, obstacle, object/evidence, and changed outcome.',
      };
    case 'signature-scene-image-not-staged':
      return {
        target: 'scenes',
        action: 'Revise at least one key scene conflict/beat into a signature scene image: a 기억 가능한 사물/공간/몸동작 plus visual detail, a story turn, and a choice/cost, rule, clue, relationship, identity, or irreversible consequence lift, so the chapter has a memorable image that moves the story instead of only functional plot motion.',
      };
    case 'motif-resonance-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene conflict/beat so resonance_seed becomes a motif with story work: the same object/image should carry visual detail, emotional aftertaste, changed meaning, and a concrete story consequence rather than remaining a theme label.',
      };
    case 'scene-novelty-matrix-not-staged':
      return {
        target: 'scenes',
        action: 'Revise scene evidence into a scene novelty matrix: combine at least three axes across reward_mode, conflict_mode, setting_mode, and opposition_mode, and make setting_mode a spatial constraint or affordance such as blocking, route, distance, locked access, bypass, infiltration, or escape instead of only a named place.',
      };
    case 'must-click-ending-not-staged':
      return {
        target: 'final_scene',
        action: 'Rewrite the final scene purpose, conflict, or beat to stage must_click_ending.',
      };
    case 'ending-hook-reaction-not-staged':
      return {
        target: 'final_scene',
        action: 'Revise the final scene beat so the must_click_ending is followed by protagonist reaction at the chapter break: body sensation, physical action, or immediate danger response.',
      };
    case 'chapter-reward-not-staged':
      return {
        target: 'scenes',
        action: 'Add or revise a scene beat so chapter_reward is visibly delivered on page.',
      };
    case 'drop-off-risk-not-mitigated':
      return {
        target: 'scenes',
        action: 'Stage the declared drop-off prevention strategy inside scene evidence.',
      };
    case 'tension-peak-not-staged':
      return {
        target: 'tension_curve',
        action: 'Stage the declared tension-curve peak event in a scene purpose or beat.',
      };
    case 'weak-peak-cliffhanger':
      return {
        target: 'reader_experience',
        action: 'Raise cliffhanger_strength to match the declared high-tension peak.',
      };
  }
}

function evaluateSceneMomentum(
  chapter: ChapterWithReaderExperience,
  readerExperience: ChapterReaderExperienceForEvaluation,
  issues: EngagementContractIssue[]
): number {
  const scenes = chapter.scenes ?? [];
  if (scenes.length === 0) {
    issues.push({
      code: 'missing-scene-evidence',
      severity: 'critical',
      message: 'Chapter has no scene evidence for reader-facing engagement claims.',
    });
    return 0;
  }

  let sceneMomentum = 100;
  const conflictRatio = ratio(scenes, scene => hasMeaningfulConflict(scene.conflict));
  const turnRatio = ratio(scenes, scene => hasMeaningfulSceneTurn(scene.beat));
  const sceneEvidenceText = scenes.map(scene => sceneToEvidenceText(scene)).join(' ');

  if (conflictRatio < 0.75) {
    sceneMomentum -= 65;
    issues.push({
      code: 'weak-scene-conflict',
      severity: 'major',
      message: 'Too few scenes stage concrete conflict or pressure.',
      expected: 'At least 75% of scenes should contain concrete conflict.',
      actual: `${Math.round(conflictRatio * 100)}%`,
    });
  }

  if (turnRatio < 0.75) {
    sceneMomentum -= 65;
    issues.push({
      code: 'weak-scene-turn',
      severity: 'major',
      message: 'Too few scenes contain concrete beats that change the situation.',
      expected: 'At least 75% of scenes should contain a concrete scene turn.',
      actual: `${Math.round(turnRatio * 100)}%`,
    });
  }

  const sceneStateDelta = assessSceneStateDeltaStaging(scenes);
  if (!sceneStateDelta.passed) {
    sceneMomentum -= 60;
    issues.push({
      code: 'scene-state-delta-not-staged',
      severity: 'critical',
      message:
        'Scene beats contain activity or confirmation but too few scenes create an explicit before/after story-state change.',
      expected:
        'story-state delta: at least 75% of scenes should change reader knowledge, danger, relationship status, available options, world rules, or the protagonist next action.',
      actual: sceneStateDelta.actual,
    });
  }

  const sceneSpecificity = assessSceneEvidenceSpecificity(scenes);
  if (!sceneSpecificity.passed) {
    sceneMomentum -= 45;
    issues.push({
      code: 'scene-evidence-generic',
      severity: 'critical',
      message: 'Scene evidence is abstract metadata rather than executable scene evidence.',
      expected:
        'concrete scene execution: visible action, obstacle, object/evidence, and changed outcome in at least 75% of scenes.',
      actual: sceneSpecificity.actual,
    });
  }

  const signatureSceneImage = assessSignatureSceneImageStaging(scenes);
  if (!signatureSceneImage.passed) {
    sceneMomentum -= 55;
    issues.push({
      code: 'signature-scene-image-not-staged',
      severity: 'critical',
      message:
        'Chapter scene evidence has plot function but lacks a memorable signature scene image.',
      expected: signatureSceneImage.expected,
      actual: signatureSceneImage.actual,
    });
  }

  const motifResonance = assessMotifResonanceStaging(
    chapter.narrative_elements?.resonance_seed,
    scenes.map(scene => sceneToEvidenceText(scene))
  );
  if (!motifResonance.passed) {
    sceneMomentum -= 50;
    issues.push({
      code: 'motif-resonance-not-staged',
      severity: 'critical',
      message:
        'Chapter declares a resonance_seed but scene evidence does not turn it into a motif with image, emotion, meaning shift, and story consequence.',
      expected: motifResonance.expected,
      actual: motifResonance.actual,
    });
  }

  const sceneTradeoffs = assessSceneChoiceTradeoffs(scenes);
  if (!sceneTradeoffs.passed) {
    sceneMomentum -= 65;
    issues.push({
      code: 'scene-choice-tradeoff-not-staged',
      severity: 'critical',
      message:
        'Scene evidence has action or outcome turns but does not stage a protagonist choice-cost tradeoff.',
      expected:
        'choice-cost tradeoff in scene conflict/beat: competing options, a forfeited alternative, and a visible cost or risk of the chosen action.',
      actual: sceneTradeoffs.actual,
    });
  } else {
    const sceneChoiceCostLock = assessSceneChoiceCostLock(scenes);
    if (!sceneChoiceCostLock.passed) {
      sceneMomentum -= 65;
      issues.push({
        code: 'scene-choice-cost-lock-not-staged',
        severity: 'critical',
        message:
          'Scene evidence stages a choice cost but does not lock any future story option or state.',
        expected:
          'choice-cost lock: the protagonist choice closes, narrows, or makes impossible a future option, relationship, evidence path, time window, or route.',
        actual: sceneChoiceCostLock.actual,
      });
    }
  }

  const sceneActiveOpposition = assessSceneActiveOppositionStaging(scenes);
  if (!sceneActiveOpposition.passed) {
    sceneMomentum -= 60;
    issues.push({
      code: 'scene-active-opposition-not-staged',
      severity: 'critical',
      message:
        'Scene pressure is staged as passive obstacles without an active opposing will.',
      expected:
        'scene active opposition: pressured scene conflict/beat should include an antagonist, hostile system, or opposing human will deliberately blocking, manipulating, threatening, or targeting the protagonist.',
      actual: sceneActiveOpposition.actual,
    });
  }

  const sceneGoalTacticTurn = assessSceneGoalTacticTurn(scenes);
  if (!sceneGoalTacticTurn.passed) {
    sceneMomentum -= 60;
    issues.push({
      code: 'scene-goal-tactic-turn-not-staged',
      severity: 'critical',
      message:
        'Scene evidence has pressure and outcomes but too few core scenes show goal-attempt-outcome movement through protagonist tactics.',
      expected:
        'goal-tactic turn: a concrete protagonist scene goal, a blocking force, a visible tactic or tactic shift, and a changed result in at least half of scenes.',
      actual: sceneGoalTacticTurn.actual,
    });
  }

  const sceneCausalEscalation = assessSceneCausalEscalation(scenes);
  if (!sceneCausalEscalation.passed) {
    sceneMomentum -= 60;
    issues.push({
      code: 'scene-causal-escalation-not-staged',
      severity: 'critical',
      message:
        'Scene evidence contains concrete scenes but does not chain previous consequences into the next pressure or action.',
      expected:
        'adjacent scene cause-effect escalation: previous scene consequence explicitly drives the next scene pressure/action/result.',
      actual: sceneCausalEscalation.actual,
    });
  }

  if (
    sceneSpecificity.passed &&
    signatureSceneImage.passed &&
    sceneTradeoffs.passed &&
    sceneActiveOpposition.passed &&
    sceneCausalEscalation.passed
  ) {
    const sceneNoveltyMatrix = assessSceneNoveltyMatrixStaging(scenes);
    if (!sceneNoveltyMatrix.passed) {
      sceneMomentum -= 55;
      issues.push({
        code: 'scene-novelty-matrix-not-staged',
        severity: 'critical',
        message:
          'Scene evidence is functional but lacks a fresh combination of reward, conflict, setting, and opposition modes.',
        expected: sceneNoveltyMatrix.expected,
        actual: sceneNoveltyMatrix.actual,
      });
    }
  }

  const relationshipShift = assessRelationshipShiftEvidence(
    sceneEvidenceText,
    chapter.narrative_elements?.character_development
  );
  if (!relationshipShift.passed) {
    sceneMomentum -= 60;
    issues.push({
      code: 'relationship-shift-not-staged',
      severity: 'critical',
      message:
        'The chapter declares a relationship shift but scene evidence does not stage reciprocal action and reaction.',
      expected: relationshipShift.expected,
      actual: relationshipShift.actual,
    });
  } else {
    const relationshipTurningPoint = assessRelationshipTurningPointEvidence(
      sceneEvidenceText,
      chapter.narrative_elements?.character_development
    );
    if (!relationshipTurningPoint.passed) {
      sceneMomentum -= 60;
      issues.push({
        code: 'relationship-turning-point-not-staged',
        severity: 'critical',
        message:
          'The chapter stages a relationship shift but not as a high-value relational turning point with risk, counterpart choice, and changed behavior.',
        expected: relationshipTurningPoint.expected,
        actual: relationshipTurningPoint.actual,
      });
    } else {
      const relationshipMindInference = assessRelationshipMindInferenceEvidence(
        sceneEvidenceText,
        chapter.narrative_elements?.character_development
      );
      if (!relationshipMindInference.passed) {
        sceneMomentum -= 65;
        issues.push({
          code: 'relationship-mind-inference-not-staged',
          severity: 'critical',
          message:
            'The chapter stages a relationship turning point but does not give the reader enough cues to infer hidden motive, misreading, or changed inner stance.',
          expected: relationshipMindInference.expected,
          actual: relationshipMindInference.actual,
        });
      } else {
        const relationshipMutualPressure = assessRelationshipMutualPressureEvidence(
          sceneEvidenceText,
          chapter.narrative_elements?.character_development
        );
        if (!relationshipMutualPressure.passed) {
          sceneMomentum -= 65;
          issues.push({
            code: 'relationship-mutual-pressure-not-staged',
            severity: 'critical',
            message:
              'The chapter stages a relationship turning point but the counterpart does not bring independent pressure, cost, or agenda into the negotiation.',
            expected: relationshipMutualPressure.expected,
            actual: relationshipMutualPressure.actual,
          });
        }
      }
    }
  }

  const finalScene = scenes[scenes.length - 1];
  const finalSceneText = [finalScene?.purpose, finalScene?.conflict, finalScene?.beat]
    .filter(Boolean)
    .join(' ');
  const finalSceneStagesEnding = containsMeaningfulOverlap(
    finalSceneText,
    readerExperience.must_click_ending,
    0.35
  );
  if (!finalSceneStagesEnding) {
    sceneMomentum -= 45;
    issues.push({
      code: 'must-click-ending-not-staged',
      severity: 'critical',
      message: 'The final scene does not stage the must-click ending promised in reader_experience.',
      expected: readerExperience.must_click_ending,
      actual: finalSceneText,
    });
  } else {
    const finalHookReaction = assessEndingHookReactionStaging(finalSceneText);
    if (!finalHookReaction.passed) {
      sceneMomentum -= 55;
      issues.push({
        code: 'ending-hook-reaction-not-staged',
        severity: 'critical',
        message:
          'The final scene hook is staged as information without protagonist reaction at the chapter break.',
        expected:
          'protagonist reaction at final hook: body sensation, physical action, or immediate danger response adjacent to must_click_ending.',
        actual: finalHookReaction.actual,
      });
    }
  }

  const pageTurnStaging = assessPageTurnQuestionStaging(
    finalSceneText,
    readerExperience.page_turner_question
  );
  if (!pageTurnStaging.passed) {
    sceneMomentum -= 60;
    issues.push({
      code: 'page-turn-question-not-staged',
      severity: 'critical',
      message: 'The final scene does not stage the clue or event that earns the page-turn question.',
      expected:
        'page_turner_question staged by final scene clue/event evidence, not only declared in reader_experience metadata.',
      actual: pageTurnStaging.actual,
    });
  }

  if (!containsMeaningfulOverlap(sceneEvidenceText, readerExperience.chapter_reward, 0.35)) {
    sceneMomentum -= 30;
    issues.push({
      code: 'chapter-reward-not-staged',
      severity: 'critical',
      message: 'The chapter reward promised in reader_experience is not staged by scene evidence.',
      expected: readerExperience.chapter_reward,
      actual: sceneEvidenceText,
    });
  }

  const characterAppealStaged = containsExpectedBeatEvidence(
    sceneEvidenceText,
    readerExperience.character_appeal_moment,
    0.45
  );
  if (!characterAppealStaged) {
    sceneMomentum -= 25;
    issues.push({
      code: 'character-appeal-not-staged',
      severity: 'critical',
      message: 'The protagonist appeal moment promised in reader_experience is not staged by scene evidence.',
      expected: readerExperience.character_appeal_moment,
      actual: sceneEvidenceText,
    });
  } else {
    const appealSignature = assessCharacterAppealSignatureStaging(
      scenes,
      readerExperience.character_appeal_moment
    );
    if (!appealSignature.passed) {
      sceneMomentum -= 35;
      issues.push({
        code: 'character-appeal-signature-not-staged',
        severity: 'critical',
        message:
          'The protagonist appeal beat is present but lacks a signature character action with distinct method, cost, and visible reaction.',
        expected: appealSignature.expected,
        actual: appealSignature.actual,
      });
    }
  }

  const mitigationStrategy = extractDropOffMitigation(readerExperience.drop_off_risk);
  if (!containsMeaningfulOverlap(sceneEvidenceText, mitigationStrategy, 0.3)) {
    sceneMomentum -= 15;
    issues.push({
      code: 'drop-off-risk-not-mitigated',
      severity: 'major',
      message: 'The declared drop-off prevention strategy is not visible in scene evidence.',
      expected: mitigationStrategy,
      actual: sceneEvidenceText,
    });
  }

  return Math.max(0, sceneMomentum);
}

function evaluateManuscriptEvidence(
  manuscript: string | undefined,
  promise: ReaderPromiseContract,
  plot: PlotWithFunSpec,
  chapter: ChapterWithReaderExperience,
  readerExperience: ChapterReaderExperienceForEvaluation,
  characters: CharacterReferenceForEvaluation[],
  issues: EngagementContractIssue[]
): number | undefined {
  const text = manuscript?.trim();
  if (!text) {
    return undefined;
  }

  let manuscriptMomentum = 100;

  const openingMomentum = assessManuscriptOpeningMomentum(text, chapter.chapter_number);
  if (!openingMomentum.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-opening-momentum-not-evidenced',
      severity: 'critical',
      message: 'The manuscript opening starts with recap or summary instead of live chapter momentum.',
      expected:
        'opening momentum: later chapters should open on an active scene beat, immediate threat, live question, or sensory action rather than recap or prior-event summary.',
      actual: openingMomentum.actual,
    });
  }

  const manuscriptQuestion = assessManuscriptIrresistibleQuestion(
    text,
    promise,
    readerExperience
  );
  if (!manuscriptQuestion.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-irresistible-question-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not raise the design irresistible_question as an on-page unresolved question.',
      expected: manuscriptQuestion.expected,
      actual: manuscriptQuestion.actual,
    });
  }

  const hasRewardEvidence = containsExpectedBeatEvidence(
    text,
    readerExperience.chapter_reward,
    0.3
  );
  let earnedRewardPassed = false;
  if (!hasRewardEvidence) {
    manuscriptMomentum -= 30;
    issues.push({
      code: 'manuscript-reward-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not stage the chapter_reward promised in reader_experience.',
      expected: readerExperience.chapter_reward,
      actual: abbreviateEvidence(text),
    });
  } else {
    const earnedReward = assessManuscriptEarnedReward(
      text,
      readerExperience.chapter_reward
    );
    if (!earnedReward.passed) {
      manuscriptMomentum -= 60;
      issues.push({
        code: 'manuscript-earned-reward-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript reward arrives as passive exposition instead of earned discovery.',
        expected:
          'earned reward: protagonist clue-handling action plus concrete clue plus inference/choice before the reward discovery lands.',
        actual: earnedReward.actual,
      });
    } else {
      earnedRewardPassed = true;
    }
  }

  if (earnedRewardPassed) {
    const rewardFreshness = assessManuscriptRewardFreshness(
      text,
      readerExperience.chapter_reward,
      promise.novelty_angle,
      promise.emotional_payoff
    );
    if (!rewardFreshness.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-reward-freshness-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript reward is earned mechanically but lacks a fresh genre payoff turn.',
        expected:
          'reward freshness: the earned reward should attach concrete clue specificity to a premise-specific device or rule change, embodied genre payoff, and changed next action/pressure.',
        actual: rewardFreshness.actual,
      });
    }

    if (rewardFreshness.passed) {
      const payoffDelight = assessManuscriptPayoffDelight(
        text,
        readerExperience.chapter_reward
      );
      if (!payoffDelight.passed) {
        manuscriptMomentum -= 65;
        issues.push({
          code: 'manuscript-payoff-delight-not-evidenced',
          severity: 'critical',
          message:
            'The manuscript reward is fresh but does not land as a payoff delight high point.',
          expected:
            'payoff delight: the earned reward should connect accumulated pressure, concrete clue resolution, meaning shift or reversal, embodied reaction, and an immediate new consequence or question.',
          actual: payoffDelight.actual,
        });
      }
    }

    const questionLadder = assessManuscriptQuestionLadder(text);
    if (!questionLadder.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-question-ladder-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript reward answer closes curiosity without opening a sharper next question.',
        expected:
          'question ladder: each earned answer/reveal/reward should open a sharper unresolved why/how/who/what-next question, changed rule, new target, hidden actor, or remaining cost.',
        actual: questionLadder.actual,
      });
    }
  }

  const forecastRevision = assessManuscriptForecastRevision(text, promise, chapter);
  if (!forecastRevision.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-forecast-revision-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript promises or names a reversal but does not make the reader/protagonist prediction revise on page.',
      expected:
        'forecast revision: a staged expectation or hypothesis, a concrete contradictory clue or reversal, and a revised hypothesis, suspect ranking, meaning, plan, or next verification action.',
      actual: forecastRevision.actual,
    });
  }

  if (!containsExpectedBeatEvidence(text, readerExperience.must_click_ending, 0.3)) {
    manuscriptMomentum -= 35;
    issues.push({
      code: 'manuscript-ending-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not stage the must_click_ending promised in reader_experience.',
      expected: readerExperience.must_click_ending,
      actual: abbreviateEvidence(text),
    });
  }

  const dropOffMitigation = assessManuscriptDropOffMitigation(
    text,
    readerExperience.drop_off_risk
  );
  if (!dropOffMitigation.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-drop-off-mitigation-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not execute the declared drop_off_risk mitigation strategy.',
      expected: dropOffMitigation.expected,
      actual: dropOffMitigation.actual,
    });
  }

  const endingHook = assessManuscriptEndingHook(text, readerExperience.must_click_ending);
  if (!endingHook.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-ending-hook-not-staged',
      severity: 'critical',
      message: 'The manuscript prose does not stage the must-click hook at the chapter break.',
      expected: 'must_click_ending staged in the final sentences at the chapter break with a fresh event, revelation, threat, or unanswered question.',
      actual: endingHook.actual,
    });
  } else {
    const endingHookReaction = assessManuscriptEndingHookReaction(text);
    if (!endingHookReaction.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-ending-hook-reaction-not-evidenced',
        severity: 'critical',
        message: 'The manuscript ending hook lacks protagonist reaction at the chapter break.',
        expected:
          'protagonist reaction at final hook: body sensation, physical action, or immediate danger response adjacent to must_click_ending.',
        actual: endingHookReaction.actual,
      });
    }

    const endingHookClosure = assessManuscriptEndingHookClosure(text);
    if (!endingHookClosure.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-ending-hook-closed',
        severity: 'critical',
        message: 'The manuscript closes the must-click hook instead of preserving an unresolved open loop.',
        expected:
          'must_click_ending remains unresolved at the chapter break: no same-beat solution, culprit confirmation, explanation, or emotional closure.',
        actual: endingHookClosure.actual,
      });
    }

    const endingHookQuestionSpecificity = assessManuscriptEndingHookQuestionSpecificity(
      text
    );
    if (!endingHookQuestionSpecificity.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-ending-hook-question-too-broad',
        severity: 'critical',
        message:
          'The manuscript final open-loop question is too broad to create next-click pressure.',
        expected:
          'final open-loop question should preserve at least two specific clue/object/actor/rule anchors instead of ending on a generic truth, meaning, or why-this-happened question.',
        actual: endingHookQuestionSpecificity.actual,
      });
    }

    const endingHookSetup = assessManuscriptEndingHookSetup(
      text,
      readerExperience.must_click_ending
    );
    if (!endingHookSetup.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-ending-hook-setup-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript final cliffhanger imports a specific hook anchor without earlier on-page setup clues.',
        expected:
          'ending hook setup: final cliffhanger location, identity, or object anchor planted before the chapter break as a concrete clue.',
        actual: endingHookSetup.actual,
      });
    }

    const fairTwistSetup = assessManuscriptFairTwistSetup(text);
    if (!fairTwistSetup.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-fair-twist-setup-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript final reveal imports a twist without earlier on-page setup clues.',
        expected:
          'fair twist setup: concrete clue family planted before the chapter break and echoed by the final reveal.',
        actual: fairTwistSetup.actual,
      });
    }
  }

  const manuscriptAppealStaged = containsExpectedBeatEvidence(
    text,
    readerExperience.character_appeal_moment,
    0.3
  );
  if (!manuscriptAppealStaged) {
    manuscriptMomentum -= 30;
    issues.push({
      code: 'manuscript-appeal-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not stage the character_appeal_moment promised in reader_experience.',
      expected: readerExperience.character_appeal_moment,
      actual: abbreviateEvidence(text),
    });
  } else {
    const appealSignature = assessManuscriptCharacterAppealSignature(
      text,
      readerExperience.character_appeal_moment
    );
    if (!appealSignature.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-character-appeal-signature-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript names the protagonist appeal but does not turn it into a signature character action.',
        expected: appealSignature.expected,
        actual: appealSignature.actual,
      });
    }
  }

  const protagonistAgency = assessManuscriptProtagonistAgency(text);
  if (!protagonistAgency.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-protagonist-agency-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not make the protagonist appeal visible as active choice/action/cost.',
      expected: 'Protagonist choice/action/cost: a visible decision, self-directed action, and risk or price.',
      actual: protagonistAgency.actual,
    });
  }

  const choiceTradeoff = assessManuscriptChoiceTradeoff(text);
  if (!choiceTradeoff.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-choice-tradeoff-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose gives the protagonist action without an explicit choice tradeoff.',
      expected:
        'Protagonist choice tradeoff: competing options or a sacrificed alternative, the chosen action, and a visible cost on page.',
      actual: choiceTradeoff.actual,
    });
  } else {
    const choiceCostCarryover = assessManuscriptChoiceCostCarryover(text);
    if (!choiceCostCarryover.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-choice-cost-carryover-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript shows a sacrificed choice cost but does not let that cost constrain the next beat.',
        expected:
          'choice cost carryover: a sacrificed option should narrow the next options, block a route, increase suspicion, remove evidence, shorten time, or create the next pressure beat.',
        actual: choiceCostCarryover.actual,
      });
    } else {
      const choiceCostLock = assessManuscriptChoiceCostLock(text);
      if (!choiceCostLock.passed) {
        manuscriptMomentum -= 65;
        issues.push({
          code: 'manuscript-choice-cost-lock-not-evidenced',
          severity: 'critical',
          message:
            'The manuscript carries pressure from a choice cost but does not lock a durable future option or story state.',
          expected:
            'choice-cost lock: after the protagonist commits, a future option, relationship, evidence path, time window, or route closes, vanishes, narrows, or becomes impossible on page.',
          actual: choiceCostLock.actual,
        });
      }
    }
  }

  const stakesClarity = assessManuscriptStakesClarity(text);
  if (!stakesClarity.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-stakes-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not make the concrete stakes clear before the protagonist action turns irreversible.',
      expected:
        'stakes clarity before irreversible action: a concrete person, relationship, identity, life, or evidence at risk, paired with a visible threat/cost and protagonist action pressure.',
      actual: stakesClarity.actual,
    });
  }

  const stakesSubjectSpecificity = assessManuscriptStakesSubjectSpecificity(text);
  if (!stakesSubjectSpecificity.passed) {
    manuscriptMomentum -= 60;
    issues.push({
      code: 'manuscript-stakes-subject-not-personalized',
      severity: 'critical',
      message:
        'The manuscript puts generic victims or targets at risk without enough personal specificity for reader investment.',
      expected:
        'stakes subject specificity: generic labels such as victim, target, recipient, or person should be attached to a name, relationship, role, possession, voice, identifier, or concrete trace before the threat turns irreversible.',
      actual: stakesSubjectSpecificity.actual,
    });
  }

  const activeOpposition = assessManuscriptActiveOpposition(text);
  if (!activeOpposition.passed) {
    manuscriptMomentum -= 60;
    issues.push({
      code: 'manuscript-active-opposition-not-evidenced',
      severity: 'critical',
      message: 'The manuscript pressure does not show an active opposing will behind the obstacle or threat.',
      expected:
        'active opposition: an antagonist, hostile system, or opposing human will deliberately blocks, manipulates, threatens, or targets the protagonist around the scene pressure.',
      actual: activeOpposition.actual,
    });
  }

  const manuscriptPressure = assessManuscriptPressure(text);
  if (!manuscriptPressure.passed) {
    manuscriptMomentum -= 60;
    issues.push({
      code: 'manuscript-pressure-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not stage scene pressure or obstacles as on-page resistance.',
      expected: 'On-page pressure/obstacle: a ticking clock, opposing force, physical blockage, reversal, or consequence that resists the protagonist.',
      actual: manuscriptPressure.actual,
    });
  } else {
    const temporalPressure = assessManuscriptTemporalPressure(text);
    if (!temporalPressure.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-temporal-pressure-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript names a ticking clock or deadline but does not make time pressure change the next action or available options.',
        expected:
          'temporal pressure: a concrete deadline/countdown/time marker, protagonist response under that clock, and a narrowed option, lost window, delay cost, or worsened consequence in the same scene flow.',
        actual: temporalPressure.actual,
      });
    }

    const tacticalAdaptation = assessManuscriptTacticalAdaptation(text);
    if (!tacticalAdaptation.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-tactical-adaptation-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript stages a pressure reversal but does not force the protagonist to adapt tactics on page.',
        expected:
          'tactical adaptation: after a reversal or obstacle blocks the first plan, the protagonist changes plan, reroutes, switches tools, uses a new clue, or chooses a different next action.',
        actual: tacticalAdaptation.actual,
      });
    }

    const manuscriptConsequence = assessManuscriptConsequenceEscalation(text);
    if (!manuscriptConsequence.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-consequence-not-evidenced',
        severity: 'critical',
        message: 'The manuscript pressure does not create a concrete consequence or escalation.',
        expected: 'consequence/escalation: visible loss, failed attempt, irreversible change, new threat, or worsened stakes caused by pressure.',
        actual: manuscriptConsequence.actual,
      });
    }
  }

  const causalChain = assessManuscriptCausalChain(text);
  if (!causalChain.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-causal-chain-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose lists pressure, action, and consequence without a cause-and-effect chain.',
      expected:
        'cause-and-effect chain: pressure changes protagonist action, action causes a consequence, and consequence opens the next beat.',
      actual: causalChain.actual,
    });
  }

  const convenientResolution = assessManuscriptConvenientResolution(text);
  if (!convenientResolution.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-convenient-resolution-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript resolves pressure through coincidence or external rescue without prior setup and protagonist agency.',
      expected:
        'earned resolution: prior setup, protagonist-triggered action or choice, and a consequence/cost should cause the rescue, reveal, escape, or arrest.',
      actual: convenientResolution.actual,
    });
  }

  const readerDesire = assessManuscriptReaderDesireIntensity(text);
  if (!readerDesire.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-reader-desire-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript executes plot mechanics without making the reader want a concrete outcome.',
      expected:
        'reader desire intensity: a concrete person, relationship, identity, or evidence at stake; protagonist intent to save/protect/recover/prove it; urgency or blocked alternatives; and failure cost in the same chapter flow.',
      actual: readerDesire.actual,
    });
  }

  const povFocalization = assessManuscriptPovFocalization(text, characters);
  if (!povFocalization.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-pov-focalization-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose stages plot events without enough POV-filtered perception or reaction.',
      expected:
        'POV focalization: key event, clue, reward, and hook beats should be filtered through a character anchor plus body reaction, attention, or interpretive uncertainty on page.',
      actual: povFocalization.actual,
    });
  }

  const narrativeTransportation = assessManuscriptNarrativeTransportation(
    text,
    characters
  );
  if (!narrativeTransportation.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-narrative-transportation-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript has plot evidence but does not create enough narrative transportation on page.',
      expected:
        'narrative transportation: adjacent scene-native sentences should combine concrete space/object/action, POV affect, focused attention, and low abstract summary so readers can imagine the plot and feel character pressure.',
      actual: narrativeTransportation.actual,
    });
  }

  const premiseEngine = assessManuscriptPremiseEngine(text, promise);
  if (!premiseEngine.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-premise-engine-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript mentions the premise but does not make the design hook operate as a scene engine.',
      expected: premiseEngine.expected,
      actual: premiseEngine.actual,
    });
  }

  const emotionalPayoff = promise.emotional_payoff?.trim();
  if (emotionalPayoff && !hasManuscriptPayoffEvidence(text, emotionalPayoff)) {
    manuscriptMomentum -= 25;
    issues.push({
      code: 'manuscript-payoff-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not deliver the emotional_payoff promised in the design contract.',
      expected: emotionalPayoff,
      actual: abbreviateEvidence(text),
    });
  }

  const payoffEmbodiment = assessManuscriptPayoffEmbodiment(text, emotionalPayoff);
  if (!payoffEmbodiment.passed) {
    manuscriptMomentum -= 60;
    issues.push({
      code: 'manuscript-payoff-embodiment-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose names the emotional payoff without embodying it on page.',
      expected: 'embodied emotional payoff: body sensation, sensory detail, or action reaction adjacent to the reward/tension moment.',
      actual: payoffEmbodiment.actual,
    });
  }

  if (emotionalPayoff && hasManuscriptPayoffEvidence(text, emotionalPayoff)) {
    const genreDelight = assessManuscriptGenreDelight(
      text,
      emotionalPayoff,
      readerExperience.chapter_reward
    );
    if (!genreDelight.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-genre-delight-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript embodies the promised emotional payoff generically but lacks the genre-specific delight mechanism.',
        expected: genreDelight.expected,
        actual: genreDelight.actual,
      });
    }
  }

  const emotionalArc = assessManuscriptEmotionalArc(text, chapter);
  if (!emotionalArc.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-emotional-arc-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not execute the declared emotional arc on page.',
      expected: emotionalArc.expected,
      actual: emotionalArc.actual,
    });
  }

  if (emotionalArc.passed) {
    const emotionalProgression = assessManuscriptEmotionalProgression(text, chapter);
    if (!emotionalProgression.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-emotional-progression-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript names the declared emotional states but does not stage a visible emotional progression beat.',
        expected: emotionalProgression.expected,
        actual: emotionalProgression.actual,
      });
    } else {
      const affectiveChoiceTurn = assessManuscriptAffectiveChoiceTurn(text, chapter);
      if (!affectiveChoiceTurn.passed) {
        manuscriptMomentum -= 65;
        issues.push({
          code: 'manuscript-affective-choice-turn-not-evidenced',
          severity: 'critical',
          message:
            'The manuscript stages an emotional transition but the changed feeling does not alter a choice, action, relationship stance, or consequence on page.',
          expected: affectiveChoiceTurn.expected,
          actual: affectiveChoiceTurn.actual,
        });
      }
    }
  }

  const characterDevelopment = assessManuscriptCharacterDevelopment(text, chapter, characters);
  if (!characterDevelopment.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-character-development-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not execute the declared character development on page.',
      expected: characterDevelopment.expected,
      actual: characterDevelopment.actual,
    });
  }

  const relationshipShift = assessManuscriptRelationshipShift(text, chapter);
  if (!relationshipShift.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-relationship-shift-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript prose names a relationship shift without staging reciprocal reaction or changed behavior on page.',
      expected: relationshipShift.expected,
      actual: relationshipShift.actual,
    });
  } else {
    const relationshipTurningPoint = assessManuscriptRelationshipTurningPoint(text, chapter);
    if (!relationshipTurningPoint.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-relationship-turning-point-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript stages reciprocal relationship change but not a convincing relational turning point on page.',
        expected: relationshipTurningPoint.expected,
        actual: relationshipTurningPoint.actual,
      });
    } else {
      const relationshipMindInference = assessManuscriptRelationshipMindInference(
        text,
        chapter
      );
      if (!relationshipMindInference.passed) {
        manuscriptMomentum -= 65;
        issues.push({
          code: 'manuscript-relationship-mind-inference-not-evidenced',
          severity: 'critical',
          message:
            'The manuscript stages a relationship turning point as action and outcome but does not make the changed inner stance readable on page.',
          expected: relationshipMindInference.expected,
          actual: relationshipMindInference.actual,
        });
      } else {
        const relationshipMutualPressure = assessManuscriptRelationshipMutualPressure(
          text,
          chapter
        );
        if (!relationshipMutualPressure.passed) {
          manuscriptMomentum -= 65;
          issues.push({
            code: 'manuscript-relationship-mutual-pressure-not-evidenced',
            severity: 'critical',
            message:
              'The manuscript stages a relationship turn but the counterpart has no readable independent pressure, price, or agenda on page.',
            expected: relationshipMutualPressure.expected,
            actual: relationshipMutualPressure.actual,
          });
        }
      }
    }
  }

  const genericCharacterLabels = assessManuscriptGenericCharacterLabels(text, characters);
  if (!genericCharacterLabels.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-generic-character-label-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose overuses generic character role labels instead of established names.',
      expected: genericCharacterLabels.expected,
      actual: genericCharacterLabels.actual,
    });
  }

  const designJargon = assessManuscriptDesignJargon(text);
  if (!designJargon.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-design-jargon-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose leaks design or evaluation jargon instead of rendering the beat as fiction.',
      expected: designJargon.expected,
      actual: designJargon.actual,
    });
  }

  const longHookThreads = plot.binge_architecture?.long_hook_threads
    ?.map(thread => thread.trim())
    .filter(Boolean);
  if (
    longHookThreads?.length &&
    !containsAnySpecificSignalEvidence(text, longHookThreads)
  ) {
    manuscriptMomentum -= 25;
    issues.push({
      code: 'manuscript-long-hook-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not stage any plot long_hook_threads.',
      expected: longHookThreads.join(' / '),
      actual: abbreviateEvidence(text),
    });
  } else if (longHookThreads?.length) {
    const longHookClue = assessManuscriptLongHookClue(text, longHookThreads);
    if (!longHookClue.passed) {
      manuscriptMomentum -= 60;
      issues.push({
        code: 'manuscript-long-hook-clue-not-evidenced',
        severity: 'critical',
        message: 'The manuscript long-hook evidence is abstract and lacks a concrete clue.',
        expected: 'concrete clue attached to a long_hook_thread: number, file, record, logo, name, message, object, or trace.',
        actual: longHookClue.actual,
      });
    } else {
      const longHookAdvancement = assessLongHookThreadAdvancement(
        text,
        longHookThreads
      );
      if (!longHookAdvancement.passed) {
        manuscriptMomentum -= 60;
        issues.push({
          code: 'manuscript-long-hook-thread-not-advanced',
          severity: 'critical',
          message:
            'The manuscript repeats a plot long_hook_thread but does not advance it on page.',
          expected:
            'on-page long_hook_thread advancement: concrete clue plus discovery, narrowed hypothesis, changed risk, or next verification action.',
          actual: longHookAdvancement.actual,
        });
      }
    }
  }

  const payoffCadence = plot.binge_architecture?.payoff_cadence?.trim();
  if (payoffCadence) {
    const cadenceSignals = splitCadenceSignals(payoffCadence);
    if (
      !containsAnySpecificSignalEvidence(text, cadenceSignals) &&
      !hasSceneNativePayoffCadenceEvidence(text, cadenceSignals)
    ) {
      manuscriptMomentum -= 20;
      issues.push({
        code: 'manuscript-payoff-cadence-not-evidenced',
        severity: 'critical',
        message: 'The manuscript prose does not stage the plot payoff_cadence.',
        expected: payoffCadence,
        actual: abbreviateEvidence(text),
      });
    }
  }

  const fatigueControls = plot.binge_architecture?.fatigue_controls
    ?.map(control => control.trim())
    .filter(Boolean);
  if (fatigueControls?.length) {
    const fatigueControl = assessManuscriptFatigueControls(text, fatigueControls);
    if (!fatigueControl.passed) {
      manuscriptMomentum -= 60;
      issues.push({
        code: 'manuscript-fatigue-control-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript prose repeats the same beat pattern without staging plot fatigue_controls.',
        expected:
          'fatigue_controls visible on page: relationship pressure, physical location variation, action-mode variation, or sensory/emotional reset that breaks repeated scene rhythm.',
        actual: fatigueControl.actual,
      });
    }
  }

  const tensionResetPlan = plot.binge_architecture?.tension_reset_plan?.trim();
  if (tensionResetPlan) {
    const tensionReset = assessManuscriptTensionReset(text, tensionResetPlan);
    if (!tensionReset.passed) {
      manuscriptMomentum -= 60;
      issues.push({
        code: 'manuscript-tension-reset-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript prose escalates without staging the plot tension_reset_plan.',
        expected:
          'tension_reset_plan visible on page: a brief breath, quiet/analysis beat, sensory pause, or emotional reset followed by a renewed question, alert, threat, or open loop.',
        actual: tensionReset.actual,
      });
    }
  }

  const tensionPeak = assessManuscriptTensionPeak(text, plot, chapter);
  if (!tensionPeak.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-tension-peak-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript names or implies the declared high-tension peak without staging it as an on-page pressure, action, and consequence turn.',
      expected: tensionPeak.expected,
      actual: tensionPeak.actual,
    });
  }

  const tensionWave = assessManuscriptTensionWave(text, plot, chapter);
  if (!tensionWave.passed) {
    manuscriptMomentum -= 60;
    issues.push({
      code: 'manuscript-tension-wave-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript has high-tension material but does not distribute it into an ordered opening, middle, and final tension wave.',
      expected: tensionWave.expected,
      actual: tensionWave.actual,
    });
  }

  const sceneIntentGaps = findManuscriptSceneIntentGaps(text, chapter.scenes ?? []);
  if (sceneIntentGaps.length > 0) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-scene-intent-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose does not execute declared scene conflict and turn evidence.',
      expected: sceneIntentGaps
        .map(gap => `scene ${gap.sceneNumber}: ${gap.missing.join(', ')}`)
        .join(' / '),
      actual: abbreviateEvidence(text),
    });
  }

  const sceneOrder = assessManuscriptSceneOrder(text, chapter.scenes ?? []);
  if (!sceneOrder.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-scene-order-not-evidenced',
      severity: 'critical',
      message: 'The manuscript evidences declared scenes but executes them out of order.',
      expected:
        'scene order preserved on page: scene 1 evidence appears before scene 2 evidence, and later scene turns do not precede earlier scene conflicts.',
      actual: sceneOrder.actual,
    });
  }

  const sceneStateDelta = assessManuscriptSceneStateDelta(text, chapter.scenes ?? []);
  if (!sceneStateDelta.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-scene-state-delta-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript executes scene material but too few scene turns create an on-page before/after story-state shift.',
      expected:
        'on-page story-state delta: reader knowledge, danger, relationship, locked option, world rule, or next action changes inside each scene turn window.',
      actual: sceneStateDelta.actual,
    });
  }

  const sceneNoveltyMatrix = assessManuscriptSceneNoveltyMatrix(
    text,
    chapter.scenes ?? []
  );
  if (!sceneNoveltyMatrix.passed) {
    manuscriptMomentum -= 60;
    issues.push({
      code: 'manuscript-scene-novelty-matrix-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript has staged scene novelty in metadata but flattens it into generic on-page scene execution.',
      expected:
        'on-page scene novelty matrix: reward mode, conflict/tactic mode, setting constraint or affordance, and opposition countermove should combine inside the key scene window; setting must change route, access, distance, blockage, pursuit, infiltration, or escape.',
      actual: sceneNoveltyMatrix.actual,
    });
  }

  const sceneTexture = assessManuscriptSceneTexture(text);
  if (!sceneTexture.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-summary-prose',
      severity: 'critical',
      message: 'The manuscript prose summarizes engagement metadata instead of rendering on-page scene texture.',
      expected: 'On-page scene texture with concrete sensory detail, physical action, or dialogue.',
      actual: sceneTexture.actual,
    });
  }

  const sceneDensity = assessManuscriptSceneDensity(text);
  if (!sceneDensity.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-scene-density-not-evidenced',
      severity: 'critical',
      message: 'The manuscript prose has evidence keywords but lacks on-page scene density.',
      expected:
        'on-page scene density: direct physical action, embodied reaction, sensory grounding, or dialogue in the same scene flow.',
      actual: sceneDensity.actual,
    });
  }

  const signatureSceneImage = assessManuscriptSignatureSceneImage(text);
  if (!signatureSceneImage.passed) {
    manuscriptMomentum -= 55;
    issues.push({
      code: 'manuscript-signature-scene-image-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript has plot function but lacks a memorable signature scene image.',
      expected: signatureSceneImage.expected,
      actual: signatureSceneImage.actual,
    });
  }

  const motifResonance = assessManuscriptMotifResonance(
    text,
    chapter.narrative_elements?.resonance_seed
  );
  if (!motifResonance.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-motif-resonance-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript declares a resonance_seed but does not embody it as a lasting motif on page.',
      expected: motifResonance.expected,
      actual: motifResonance.actual,
    });
  }

  const spatialBlocking = assessManuscriptSpatialBlocking(text);
  if (!spatialBlocking.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-spatial-blocking-not-evidenced',
      severity: 'critical',
      message:
        'The manuscript has action and pressure but does not stage readable spatial blocking.',
      expected:
        'spatial blocking: place anchor, movement path, and obstacle/distance pressure in the same on-page scene flow.',
      actual: spatialBlocking.actual,
    });
  }

  const dialogueSubtext = assessManuscriptDialogueSubtext(text);
  if (!dialogueSubtext.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-dialogue-subtext-not-evidenced',
      severity: 'critical',
      message: 'The manuscript uses dialogue as exposition instead of staging subtext or interpersonal friction.',
      expected:
        'dialogue subtext: dialogue reveals information through friction, evasion, pushback, withheld intent, silence, or action beats instead of explaining reader-contract metadata.',
      actual: dialogueSubtext.actual,
    });
  }

  const dialogueConflict = assessManuscriptDialogueConflict(text);
  if (!dialogueConflict.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-dialogue-conflict-not-evidenced',
      severity: 'critical',
      message: 'The manuscript dialogue has turns but no interpersonal conflict, pushback, or charged silence.',
      expected:
        'dialogue conflict: multi-turn dialogue should include pushback, refusal, evasion, threat, charged silence, or an action beat that changes the power balance.',
      actual: dialogueConflict.actual,
    });
  }

  if (dialogueSubtext.passed && dialogueConflict.passed) {
    const dialogueTurn = assessManuscriptDialogueTurn(text);
    if (!dialogueTurn.passed) {
      manuscriptMomentum -= 65;
      issues.push({
        code: 'manuscript-dialogue-turn-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript dialogue has conflict but does not change information, power, relationship, or next action state.',
        expected:
          'dialogue turn: contested multi-turn dialogue should end with new information, a power shift, a relationship state change, accepted/refused terms, or a concrete next action.',
        actual: dialogueTurn.actual,
      });
    } else {
      const dialogueStateCarryover = assessManuscriptDialogueStateCarryover(text);
      if (!dialogueStateCarryover.passed) {
        manuscriptMomentum -= 65;
        issues.push({
          code: 'manuscript-dialogue-state-carryover-not-evidenced',
          severity: 'critical',
          message:
            'The manuscript dialogue changes story state but the next action or pressure beat does not carry that changed state forward.',
          expected:
            'dialogue state carryover: after a dialogue turn, the next action or pressure beat should use the changed information, condition, power balance, relationship state, object, or open path.',
          actual: dialogueStateCarryover.actual,
        });
      }
    }
  }

  const characterVoice = assessManuscriptCharacterVoiceDifferentiation(text);
  if (!characterVoice.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-character-voice-not-differentiated',
      severity: 'critical',
      message:
        'The manuscript attributes dialogue to multiple speakers but gives them interchangeable character voices.',
      expected:
        'character voice differentiation: each attributed speaker should have distinct diction, speech level, sentence rhythm, verbal habits, or response tactics instead of repeated lines.',
      actual: characterVoice.actual,
    });
  }

  const characterVoiceProfile = assessManuscriptCharacterVoiceProfileAlignment(
    text,
    characters
  );
  if (!characterVoiceProfile.passed) {
    manuscriptMomentum -= 65;
    issues.push({
      code: 'manuscript-character-voice-profile-drift',
      severity: 'critical',
      message:
        'The manuscript attributes dialogue to a known character but breaks the character voice profile without on-page justification.',
      expected: characterVoiceProfile.expected,
      actual: characterVoiceProfile.actual,
    });
  }

  return Math.max(0, manuscriptMomentum);
}

interface ManuscriptSceneTextureAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptDesignJargonAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface ManuscriptOpeningMomentumAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptDropOffMitigationAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface ManuscriptIrresistibleQuestionAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

function assessManuscriptOpeningMomentum(
  manuscript: string,
  chapterNumber: number
): ManuscriptOpeningMomentumAssessment {
  if (chapterNumber <= 1) {
    return {
      passed: true,
      actual: `chapter=${chapterNumber}, recap signals=0, opening momentum signals=0`,
    };
  }

  const openingParagraph = extractOpeningProseParagraph(manuscript);
  const openingSentence = extractOpeningProseSentence(openingParagraph);
  const recapSignals = countMatches(
    openingSentence,
    /(지난|이전\s*회차|앞선|그동안|정리|되짚|떠올렸|회상|요약|기록은\s*차분|차분히\s*이어|설명|다시\s*짚|전날|어제)/gu
  );
  const openingMomentumSignals = countMatches(
    openingSentence,
    /(알림이\s*(?:울|뜨|깜박)|새\s*(?:알림|예고|위협|표적|대상)|카운트다운|문자|전화|문이\s*(?:열|닫)|조명이\s*꺼|불이\s*꺼|피|칼|총|죽|사망|실종|위험|위협|쥐|움켜|눌렀|열었|닫았|뛰|달려|막았|찾으려|선택해야|제한\s*시간|왜|어떻게|\?|？|숨|목덜미|손바닥|심장)/gu
  );

  return {
    passed: recapSignals === 0 || openingMomentumSignals >= 2,
    actual: `chapter=${chapterNumber}, recap signals=${recapSignals}, opening momentum signals=${openingMomentumSignals}, first sentence="${abbreviateEvidence(openingSentence, 180)}"`,
  };
}

function assessManuscriptIrresistibleQuestion(
  manuscript: string,
  promise: ReaderPromiseContract,
  readerExperience: ChapterReaderExperienceForEvaluation
): ManuscriptIrresistibleQuestionAssessment {
  const expectedQuestions = [
    promise.irresistible_question,
    readerExperience.page_turner_question,
  ]
    .map(question => question?.trim())
    .filter((question): question is string => Boolean(question));
  const uniqueExpectedQuestions = [...new Set(expectedQuestions)];

  if (uniqueExpectedQuestions.length === 0) {
    return {
      passed: true,
      expected: 'irresistible_question/page_turner_question in manuscript',
      actual: 'expected questions=none',
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  let candidateWindows = 0;
  let openQuestionWindows = 0;
  let closureWindows = 0;
  let strongestInterrogativeSignals = 0;
  let strongestUnresolvedSignals = 0;

  for (const expectedQuestion of uniqueExpectedQuestions) {
    const expectedNeedsInterrogative = hasExplicitQuestionSignal(expectedQuestion);

    for (let index = 0; index < sentences.length; index += 1) {
      const window = sentences.slice(Math.max(0, index - 1), index + 2).join(' ');
      if (!containsExpectedBeatEvidence(window, expectedQuestion, 0.25)) {
        continue;
      }

      candidateWindows += 1;
      const interrogativeSignals = countMatches(
        window,
        /(왜|어떻게|누가|무엇|어디|언제|\?|？)/gu
      );
      const unresolvedSignals = countMatches(
        window,
        /(의문|알\s*수\s*없|알수없|모르|숨|감춰|비밀|정체|답이\s*없|미스터리|궁금)/gu
      );
      const closureSignals = countMatches(
        window,
        /(이유가\s*(?:밝혀|드러)|정체가\s*(?:밝혀|드러)|해결됐|해결되|설명됐|설명되|답을\s*찾|답이\s*나왔|답은[^.!?。！？]{0,20}(?:이었다|였다)|의문이\s*풀|미스터리가\s*풀|진실을\s*알|납득|안도|안심)/gu
      );
      const hasOpenQuestionSignal = expectedNeedsInterrogative
        ? interrogativeSignals >= 1
        : interrogativeSignals >= 1 || unresolvedSignals >= 1;

      strongestInterrogativeSignals = Math.max(
        strongestInterrogativeSignals,
        interrogativeSignals
      );
      strongestUnresolvedSignals = Math.max(strongestUnresolvedSignals, unresolvedSignals);

      if (hasOpenQuestionSignal && closureSignals === 0) {
        openQuestionWindows += 1;
      } else if (closureSignals > 0) {
        closureWindows += 1;
      }
    }
  }

  return {
    passed: openQuestionWindows > 0,
    expected: `irresistible_question/page_turner_question in manuscript: ${uniqueExpectedQuestions.join(' / ')}`,
    actual: `question candidate windows=${candidateWindows}, open question windows=${openQuestionWindows}, closure windows=${closureWindows}, strongest interrogative signals=${strongestInterrogativeSignals}, strongest unresolved signals=${strongestUnresolvedSignals}`,
  };
}

function hasExplicitQuestionSignal(value: string): boolean {
  return /(왜|어떻게|누가|무엇|어디|언제|\?|？)/u.test(value);
}

function assessManuscriptDropOffMitigation(
  manuscript: string,
  dropOffRisk: string
): ManuscriptDropOffMitigationAssessment {
  const mitigation = extractDropOffMitigation(dropOffRisk);
  if (!mitigation) {
    return {
      passed: true,
      expected: 'drop_off_risk mitigation strategy',
      actual: 'drop_off_risk mitigation=none',
    };
  }

  const hasMitigationEvidence = containsExpectedBeatEvidence(manuscript, mitigation, 0.25);
  const sequence = assessDropOffActionSequence(manuscript, mitigation);
  const needsActionSequence =
    sequence.applicable || /(순서|행동|단계|흐름|먼저|이후|다음)/u.test(mitigation);

  const passed = needsActionSequence
    ? hasMitigationEvidence && sequence.passed
    : hasMitigationEvidence;

  return {
    passed,
    expected: `drop_off_risk mitigation in manuscript: ${mitigation}`,
    actual: `mitigation overlap=${hasMitigationEvidence}, ${sequence.actual}`,
  };
}

interface DropOffActionSequenceAssessment {
  applicable: boolean;
  passed: boolean;
  actual: string;
}

function assessDropOffActionSequence(
  manuscript: string,
  mitigation: string
): DropOffActionSequenceAssessment {
  const mitigationRequiresSequence =
    /(알림|예고|메시지|신호|사건)/u.test(mitigation) &&
    /(이동|현장|추적|달려|뛰쳐|도착)/u.test(mitigation) &&
    /(실패|대가|악화|결과|손실|위협)/u.test(mitigation);

  if (!mitigationRequiresSequence) {
    return {
      applicable: false,
      passed: true,
      actual: 'ordered action sequence=not required',
    };
  }

  const alertIndex = findPatternIndex(
    manuscript,
    /(알림|예고|예보|휴대폰|메시지|수신자|화면|앱)/u
  );
  const movementIndex = findPatternIndex(
    manuscript,
    /(뛰쳐|달려|이동|향했|향해|나섰|출발|계단|복도|엘리베이터|통제선으로|현장으로\s*(?:뛰|달|향|나섰|출발))/u
  );
  const failureIndex = findPatternIndex(
    manuscript,
    /(실패|늦|쓰러|꺼졌|되돌릴\s*수\s*없|대가|손실|악화|새\s*위협|바뀌었|바뀌었다)/u
  );
  const ordered =
    alertIndex >= 0 &&
    movementIndex > alertIndex &&
    failureIndex > movementIndex;

  return {
    applicable: true,
    passed: ordered,
    actual: `ordered action sequence=${ordered}, alert=${alertIndex}, movement=${movementIndex}, failure=${failureIndex}`,
  };
}

function findPatternIndex(text: string, pattern: RegExp): number {
  const match = pattern.exec(text);
  return match?.index ?? -1;
}

function assessManuscriptSceneTexture(manuscript: string): ManuscriptSceneTextureAssessment {
  const prose = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(' ');

  const sentenceCount = Math.max(
    1,
    countMatches(prose, /(?:다|요|죠|까|네|군|했다|했다는|한다|된다|됐다|였다)(?:[.!?。！？]|\s|$)/gu)
  );
  const textureSignals = countMatches(
    prose,
    /(손|눈|시선|숨|목|발|어깨|문|창|바닥|벽|복도|계단|조명|불빛|화면|휴대폰|알림|진동|소리|냄새|피|땀|통제선|현장|차가운|뜨거운|축축한|깜박|꺼졌|울렸|흔들|쥐|눌렀|열었|닫|뛰쳐나갔|달려|멈춰|내밀|붙잡|말했|물었|속삭|고개)/gu
  );
  const dialogueMarks = countMatches(prose, /["“”‘’「」『』]/gu);
  const summaryMarkers = countMatches(
    prose,
    /(설명된다|드러났다|드러난다|커진다|커졌다|유지된다|제공한다|수렴한다|연결된다|확인되었다|제시된다|보여준다|남았다|밝혀진다|이어진다|정리된다|처리된다|요약된다|묘사된다|강조된다|표현된다|나타난다|알려진다)/gu
  );

  const summaryRatio = summaryMarkers / sentenceCount;
  const hasEnoughTexture = textureSignals >= 5 || dialogueMarks >= 2;
  const overSummarized = summaryMarkers >= 3 && summaryRatio >= 0.45;

  return {
    passed: hasEnoughTexture && !overSummarized,
    actual: `scene texture signals=${textureSignals}, dialogue marks=${dialogueMarks}, summary markers=${summaryMarkers}/${sentenceCount}`,
  };
}

interface ManuscriptSceneDensityAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptSpatialBlockingAssessment {
  passed: boolean;
  actual: string;
}

interface CharacterAppealSignatureAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

function assessManuscriptSceneDensity(manuscript: string): ManuscriptSceneDensityAssessment {
  const prose = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(' ');

  const sentenceCount = Math.max(1, splitManuscriptSentences(prose).length);
  const dialogueMarks = countMatches(prose, /["“”‘’「」『』]/gu);
  const physicalActionSignals = countMatches(
    prose,
    /(쥐었|움켜|눌렀|열었|닫았|뛰쳐나갔|뛰쳐나간|달려|멈췄|멈춰|내밀|붙잡|고개|삼켰|걸음|밀었|당겼|계산했|계산해|확인하려|찾으려|향했|도착|구하려|돌아봤|움직였|꺼졌|깜박이고|울렸다|뜬|떴|손을|눈을|입을|몸을|어깨를|문을|휴대폰을)/gu
  );
  const embodiedReactionSignals = countMatches(
    prose,
    /(목덜미|목구멍|손바닥|손끝|심장|가슴|숨|입\s*안|혀끝|피부|등골|어깨|볼|귀끝|땀|떨|두근|차갑|뜨겁|축축|젖은|냄새|소리|귓속|쓴맛|비린내|철\s*냄새|시야|눈앞|무릎|발끝|삼켰|조였|움켜쥐)/gu
  );
  const reportFramingSignals = countMatches(
    prose,
    /(보고서|문서|기록\s*\d*번|기록되|기록으로|정리되|분류되|결론|분석|목록|항목|자료|내용도|내용이|설명되|확인되었다|남았다|분석으로|같은\s*문서)/gu
  );

  const reportRatio = reportFramingSignals / sentenceCount;
  const sceneSignalScore = physicalActionSignals + embodiedReactionSignals + dialogueMarks * 2;
  const hasSceneFlow =
    (physicalActionSignals >= 4 && embodiedReactionSignals >= 2) ||
    (dialogueMarks >= 2 && physicalActionSignals >= 2);
  const reportDominates = reportFramingSignals >= 4 && reportRatio >= 0.35;
  const tooSparse = sceneSignalScore < 8;

  return {
    passed: hasSceneFlow && !reportDominates && !tooSparse,
    actual: `scene density signals=${sceneSignalScore}, physical actions=${physicalActionSignals}, embodied reactions=${embodiedReactionSignals}, dialogue marks=${dialogueMarks}, report framing=${reportFramingSignals}/${sentenceCount}`,
  };
}

function assessManuscriptCharacterAppealSignature(
  manuscript: string,
  characterAppealMoment: string
): CharacterAppealSignatureAssessment {
  const prose = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(' ');
  const sentences = splitManuscriptSentences(prose);
  const windows =
    sentences.length > 0
      ? sentences.map((_, index) =>
          sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ')
        )
      : [prose];
  const strongest = strongestCharacterAppealSignatureScore(
    windows,
    characterAppealMoment
  );

  return {
    passed: strongest.completeWindows > 0,
    expected:
      'character appeal signature: the protagonist appeal beat should combine a unique method/trait, self-directed action, cost or vulnerability, and visible story/social reaction in the same 1-2 sentence window.',
    actual:
      `complete appeal windows=${strongest.completeWindows}, ` +
      `best appeal overlap=${strongest.bestAppealOverlap}, method=${strongest.bestMethod}, ` +
      `action=${strongest.bestAction}, cost/vulnerability=${strongest.bestCost}, ` +
      `reaction/effect=${strongest.bestReaction}`,
  };
}

function assessCharacterAppealSignatureStaging(
  scenes: ChapterSceneForEvaluation[],
  characterAppealMoment: string
): CharacterAppealSignatureAssessment {
  if (scenes.length === 0) {
    return {
      passed: true,
      expected:
        'character appeal signature: a key scene conflict/beat should combine unique method/trait, action, cost or vulnerability, and visible reaction.',
      actual: 'character appeal signature check skipped: no scenes',
    };
  }

  const windows = scenes.map(scene => sceneToEvidenceText(scene));
  const strongest = strongestCharacterAppealSignatureScore(
    windows,
    characterAppealMoment
  );

  return {
    passed: strongest.completeWindows > 0,
    expected:
      'character appeal signature: at least one scene should stage the protagonist appeal through a distinctive method/trait, self-directed action, cost or vulnerability, and visible story/social reaction.',
    actual:
      `complete appeal scenes=${strongest.completeWindows}/${scenes.length}, ` +
      `best appeal overlap=${strongest.bestAppealOverlap}, method=${strongest.bestMethod}, ` +
      `action=${strongest.bestAction}, cost/vulnerability=${strongest.bestCost}, ` +
      `reaction/effect=${strongest.bestReaction}`,
  };
}

interface SignatureSceneImageAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface SceneNoveltyMatrixAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

function assessManuscriptSignatureSceneImage(
  manuscript: string
): SignatureSceneImageAssessment {
  const prose = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(' ');
  const sentences = splitManuscriptSentences(prose);
  const windows =
    sentences.length > 0
      ? sentences.map((_, index) =>
          sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ')
        )
      : [prose];
  const strongest = strongestSignatureSceneImageScore(windows);

  return {
    passed: strongest.completeWindows > 0,
    expected:
      'signature scene image: a memorable object/place plus visual detail, protagonist body/action, story turn, and story-impact lift in the same 1-2 sentence window.',
    actual:
      `complete signature windows=${strongest.completeWindows}, ` +
      `best object/place=${strongest.bestObjectPlace}, visual=${strongest.bestVisual}, ` +
      `body/action=${strongest.bestBodyAction}, story turn=${strongest.bestStoryTurn}, ` +
      `story impact=${strongest.bestStoryImpact}`,
  };
}

function assessSignatureSceneImageStaging(
  scenes: ChapterSceneForEvaluation[]
): SignatureSceneImageAssessment {
  if (scenes.length === 0) {
    return {
      passed: true,
      expected:
        'signature scene image: a key scene conflict/beat should combine a memorable object/place, visual detail, body/action, story turn, and story-impact lift.',
      actual: 'signature scene image check skipped: no scenes',
    };
  }

  const windows = scenes.map(scene => sceneToEvidenceText(scene));
  const strongest = strongestSignatureSceneImageScore(windows);

  return {
    passed: strongest.completeWindows > 0,
    expected:
      'signature scene image: at least one key scene conflict/beat should combine a 기억 가능한 사물/공간/몸동작, visual detail, a story turn, and a choice/cost, rule, clue, relationship, identity, or irreversible consequence lift.',
    actual:
      `complete signature scenes=${strongest.completeWindows}/${scenes.length}, ` +
      `best object/place=${strongest.bestObjectPlace}, visual=${strongest.bestVisual}, ` +
      `body/action=${strongest.bestBodyAction}, story turn=${strongest.bestStoryTurn}, ` +
      `story impact=${strongest.bestStoryImpact}`,
  };
}

function assessMotifResonanceStaging(
  resonanceSeed: string | undefined,
  windows: string[]
): SignatureSceneImageAssessment {
  return assessMotifResonanceWindows(resonanceSeed, windows, {
    expected:
      'motif resonance seed: concrete seed anchors plus visual image, emotional aftertaste, meaning shift, and story consequence in the same scene evidence window.',
    skippedActual: 'motif resonance check skipped: resonance_seed=empty',
    windowLabel: 'scene',
  });
}

function assessManuscriptMotifResonance(
  manuscript: string,
  resonanceSeed: string | undefined
): SignatureSceneImageAssessment {
  const prose = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(' ');
  const sentences = splitManuscriptSentences(prose);
  const windows =
    sentences.length > 0
      ? sentences.map((_, index) =>
          sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ')
        )
      : [prose];

  return assessMotifResonanceWindows(resonanceSeed, windows, {
    expected:
      'motif resonance seed on page: concrete seed anchors plus visual image, body emotion/POV aftertaste, changed meaning, and a story consequence in the same 1-2 sentence window.',
    skippedActual: 'motif resonance manuscript check skipped: resonance_seed=empty',
    windowLabel: 'manuscript window',
  });
}

function assessMotifResonanceWindows(
  resonanceSeed: string | undefined,
  windows: string[],
  labels: { expected: string; skippedActual: string; windowLabel: string }
): SignatureSceneImageAssessment {
  const seed = resonanceSeed?.trim() ?? '';
  if (!seed) {
    return {
      passed: true,
      expected: labels.expected,
      actual: labels.skippedActual,
    };
  }

  const anchors = extractMotifResonanceAnchors(seed);
  if (anchors.length === 0) {
    return {
      passed: false,
      expected:
        `${labels.expected} The resonance_seed itself must name a concrete object, place, repeated gesture, clue, color, or image.`,
      actual: `resonance_seed has no concrete anchors: "${seed}"`,
    };
  }

  const strongest = strongestMotifResonanceScore(windows, anchors);

  return {
    passed: strongest.completeWindows > 0,
    expected: labels.expected,
    actual:
      `complete motif ${labels.windowLabel}s=${strongest.completeWindows}/${windows.length}, ` +
      `seed anchors=${anchors.join(', ')}, ` +
      `best anchor overlap=${strongest.bestAnchorOverlap}/${strongest.requiredAnchorOverlap}, ` +
      `image=${strongest.bestImage}, emotion=${strongest.bestEmotion}, ` +
      `meaning shift=${strongest.bestMeaningShift}, story consequence=${strongest.bestStoryConsequence}`,
  };
}

function strongestMotifResonanceScore(
  windows: string[],
  anchors: string[]
): {
  completeWindows: number;
  requiredAnchorOverlap: number;
  bestAnchorOverlap: number;
  bestImage: number;
  bestEmotion: number;
  bestMeaningShift: number;
  bestStoryConsequence: number;
} {
  let completeWindows = 0;
  let bestAnchorOverlap = 0;
  let bestImage = 0;
  let bestEmotion = 0;
  let bestMeaningShift = 0;
  let bestStoryConsequence = 0;
  const requiredAnchorOverlap = Math.min(2, anchors.length);

  for (const window of windows) {
    const normalizedWindow = normalizeText(window);
    const anchorOverlap = anchors.filter(anchor =>
      normalizedWindow.includes(normalizeText(anchor))
    ).length;
    const image =
      countMatches(window, SIGNATURE_OBJECT_PLACE_PATTERN) +
      countMatches(window, SIGNATURE_VISUAL_DETAIL_PATTERN);
    const emotion = countMatches(window, MOTIF_RESONANCE_EMOTION_PATTERN);
    const meaningShift = countMatches(window, MOTIF_RESONANCE_MEANING_SHIFT_PATTERN);
    const storyConsequence = countMatches(window, MOTIF_RESONANCE_STORY_CONSEQUENCE_PATTERN);

    bestAnchorOverlap = Math.max(bestAnchorOverlap, anchorOverlap);
    bestImage = Math.max(bestImage, image);
    bestEmotion = Math.max(bestEmotion, emotion);
    bestMeaningShift = Math.max(bestMeaningShift, meaningShift);
    bestStoryConsequence = Math.max(bestStoryConsequence, storyConsequence);

    if (
      anchorOverlap >= requiredAnchorOverlap &&
      image >= 2 &&
      emotion > 0 &&
      meaningShift > 0 &&
      storyConsequence > 0
    ) {
      completeWindows++;
    }
  }

  return {
    completeWindows,
    requiredAnchorOverlap,
    bestAnchorOverlap,
    bestImage,
    bestEmotion,
    bestMeaningShift,
    bestStoryConsequence,
  };
}

function extractMotifResonanceAnchors(seed: string): string[] {
  const terms = normalizeText(seed).match(/[\p{L}\p{N}]{2,}/gu) ?? [];
  const anchors = terms.filter(term => !MOTIF_RESONANCE_GENERIC_TERMS.has(term));
  return [...new Set(anchors)].slice(0, 8);
}

function assessSceneNoveltyMatrixStaging(
  scenes: ChapterSceneForEvaluation[]
): SceneNoveltyMatrixAssessment {
  if (scenes.length === 0) {
    return {
      passed: true,
      expected:
        'scene novelty matrix: scene evidence should combine reward_mode, conflict_mode, setting_mode, and opposition_mode.',
      actual: 'scene novelty matrix check skipped: no scenes',
    };
  }

  const evidence = scenes.map(scene => sceneToEvidenceText(scene)).join(' ');
  const rewardModes = extractSceneNoveltyRewardModes(evidence);
  const conflictModes = extractSceneNoveltyConflictModes(evidence);
  const settingModes = extractSceneNoveltySettingModes(evidence);
  const oppositionModes = extractSceneNoveltyOppositionModes(evidence);
  const usableSettingModes = new Set(
    [...settingModes].filter(mode => mode !== 'specific-location')
  );
  const axes = new Set<string>();

  if (rewardModes.size > 0) axes.add('reward_mode');
  if (conflictModes.size > 0) axes.add('conflict_mode');
  if (usableSettingModes.size > 0) axes.add('setting_mode');
  if (oppositionModes.size > 0) axes.add('opposition_mode');

  return {
    passed: axes.size >= 3 && axes.has('setting_mode'),
    expected:
      'scene novelty matrix: at least three distinct axes including setting_mode among reward_mode, conflict_mode, setting_mode, and opposition_mode; setting_mode must be a constraint or affordance, not a named place alone.',
    actual:
      `axes=${[...axes].join(', ') || 'none'}, ` +
      `reward modes=${[...rewardModes].join(', ') || 'none'}, ` +
      `conflict modes=${[...conflictModes].join(', ') || 'none'}, ` +
      `setting modes=${[...settingModes].join(', ') || 'none'}, ` +
      `usable setting modes=${[...usableSettingModes].join(', ') || 'none'}, ` +
      `opposition modes=${[...oppositionModes].join(', ') || 'none'}`,
  };
}

function extractSceneNoveltyConflictModes(evidence: string): Set<string> {
  const modes = new Set<string>();
  if (/(선택|택할|넘길지|갈지|신고|알리바이|대가|비용|포기|닫히|차단)/u.test(evidence)) {
    modes.add('choice-cost');
  }
  if (/(추격|쫓|도주|잠입|침투|우회|비상계단|탈출|협상|위장|몸싸움)/u.test(evidence)) {
    modes.add('action-tactic');
  }
  if (/(거절|반박|침묵|협박|조건|거래|배신|고백|신뢰|불신)/u.test(evidence)) {
    modes.add('relationship-tactic');
  }
  if (/(가설|추론|재검증|용의자|알리바이|패턴|규칙.{0,12}(바뀌|뒤집|변하))/u.test(evidence)) {
    modes.add('deduction-shift');
  }
  return modes;
}

function extractSceneNoveltyRewardModes(evidence: string): Set<string> {
  const modes = new Set<string>();
  if (/(조력자|관계|신뢰|불신|배신|고백|침묵|동행|거절|사과|은폐).{0,50}(드러나|밝혀|폭로|뒤집|보상|단서)/u.test(evidence)) {
    modes.add('relationship-reveal');
  }
  if (/(함정|조작|협박|감시|역공|삭제|차단|유인|카운터무브|countermove).{0,50}(드러나|밝혀|폭로|역이용|증명|단서)/u.test(evidence)) {
    modes.add('opposition-countermove-reveal');
  }
  if (/(규칙.{0,12}(바뀌|변하|뒤집)|새로운?\s*규칙|조건.{0,12}바뀌|반경|거짓\s*예고|수신자.{0,12}바뀌|표적.{0,12}바뀌)/u.test(evidence)) {
    modes.add('rule-mutation');
  }
  if (/(증거\s*봉투|열쇠|녹음기|배지|사진|서명|피\s*묻은|관리자\s*계정|원본|카드).{0,50}(드러나|밝혀|폭로|발견|열리|증명|연결)/u.test(evidence)) {
    modes.add('concrete-object-reveal');
  }
  if (/(추격|잠입|협상|위장|탈출|몸싸움|침투).{0,50}(성공|실패|빼앗|되찾|확보|증명|드러나)/u.test(evidence)) {
    modes.add('action-earned-payoff');
  }
  return modes;
}

function extractSceneNoveltySettingModes(evidence: string): Set<string> {
  const modes = new Set<string>();
  if (/(지하보도|기록실|서버실|옥상|골목|차량|병원|경찰서|주차장|엘리베이터|비상계단|통제선|철문|계단참)/u.test(evidence)) {
    modes.add('specific-location');
  }
  if (/(조명.{0,12}(꺼|깜박)|문.{0,12}(잠|닫|막)|통제선|철문|봉쇄|차단|반경|막힌|가로막)/u.test(evidence)) {
    modes.add('physical-constraint');
  }
  if (
    /(?:(지하보도|기록실|서버실|옥상|골목|차량|병원|경찰서|주차장|엘리베이터|비상계단|통제선|철문|계단참|계단).{0,50}(우회|내려|올라|잠입|침투|탈출|추격|도주|갇|숨|버튼|문턱|거리|동선|반경|차단|봉쇄|막히|가로막|닫히|잠기|꺼뜨|꺼졌)|(?:우회|내려|올라|잠입|침투|탈출|추격|도주|갇|숨|버튼|문턱|거리|동선|반경|차단|봉쇄|막히|가로막|닫히|잠기|꺼뜨|꺼졌).{0,50}(지하보도|기록실|서버실|옥상|골목|차량|병원|경찰서|주차장|엘리베이터|비상계단|통제선|철문|계단참|계단))/u.test(evidence)
  ) {
    modes.add('spatial-affordance');
  }
  return modes;
}

function extractSceneNoveltyOppositionModes(evidence: string): Set<string> {
  const modes = new Set<string>();
  if (/(누군가|범인|가해자|내부자|박도현|적대|반대\s*세력).{0,40}(숨기|잠그|꺼뜨리|조작|표적|몰아넣|유인|협박|감시|차단|삭제|빼앗)/u.test(evidence)) {
    modes.add('hidden-countermove');
  }
  if (/(함정|유인|미끼|역공|카운터무브|countermove|표적.{0,12}바뀌|수신자.{0,12}바뀌)/u.test(evidence)) {
    modes.add('trap-or-countermove');
  }
  if (/(경찰|시스템|앱|서버|관리자|내부\s*기록).{0,40}(차단|잠그|삭제|조작|권한|회수|봉쇄)/u.test(evidence)) {
    modes.add('hostile-system');
  }
  return modes;
}

function strongestCharacterAppealSignatureScore(
  windows: string[],
  characterAppealMoment: string
): {
  completeWindows: number;
  bestAppealOverlap: number;
  bestMethod: number;
  bestAction: number;
  bestCost: number;
  bestReaction: number;
} {
  let completeWindows = 0;
  let bestAppealOverlap = 0;
  let bestMethod = 0;
  let bestAction = 0;
  let bestCost = 0;
  let bestReaction = 0;

  for (const window of windows) {
    const appealOverlap = containsExpectedBeatEvidence(
      window,
      characterAppealMoment,
      0.25
    )
      ? 1
      : 0;
    const method = countMatches(window, CHARACTER_APPEAL_METHOD_PATTERN);
    const action = countMatches(window, CHARACTER_APPEAL_ACTION_PATTERN);
    const cost = countMatches(window, CHARACTER_APPEAL_COST_PATTERN);
    const reaction = countMatches(window, CHARACTER_APPEAL_REACTION_PATTERN);

    bestAppealOverlap = Math.max(bestAppealOverlap, appealOverlap);
    bestMethod = Math.max(bestMethod, method);
    bestAction = Math.max(bestAction, action);
    bestCost = Math.max(bestCost, cost);
    bestReaction = Math.max(bestReaction, reaction);

    if (
      appealOverlap > 0 &&
      method > 0 &&
      action > 0 &&
      cost > 0 &&
      reaction > 0
    ) {
      completeWindows++;
    }
  }

  return {
    completeWindows,
    bestAppealOverlap,
    bestMethod,
    bestAction,
    bestCost,
    bestReaction,
  };
}

const CHARACTER_APPEAL_METHOD_PATTERN =
  /(패턴|계산|추론|가설|단서|규칙|분석|관찰|기억|읽고|읽은|읽어|포착|우회|협상|위장|해킹|동선|말투|습관|방식|직감|논리|먼저)/gu;
const CHARACTER_APPEAL_ACTION_PATTERN =
  /(선택|결정|거절|포기|감수|뛰쳐|달려|향했|내려|올라|눌렀|쥐었|쥔|움켜|내밀|붙잡|막아|구하|구하려|보호|되찾|요청|고백|사과|공개|우회|바꿨|접고|몸을\s*던)/gu;
const CHARACTER_APPEAL_COST_PATTERN =
  /(대가|비용|위험|상처|약점|두려움|망설|떨리|떨었|떨린|떨리는|죄책감|실패|포기|잃|잃을|닫히|사라|차단|불신|알리바이|기록이\s*사라|돌아갈\s*수\s*없|되돌릴\s*수\s*없|노출|혼자|도움\s*요청|신뢰를\s*잃)/gu;
const CHARACTER_APPEAL_REACTION_PATTERN =
  /(구했|구해냈|바뀌|닫히|사라|남았|돌아갈\s*수\s*없|조력자|침묵|반박|건넸|동행|신뢰|불신|고개|멈췄|놀라|물러|따라|바라|붙잡|응답|약속|다음\s*행동|계획을\s*접|우회|증명|드러|굳어|선택지가\s*닫)/gu;

function strongestSignatureSceneImageScore(windows: string[]): {
  completeWindows: number;
  bestObjectPlace: number;
  bestVisual: number;
  bestBodyAction: number;
  bestStoryTurn: number;
  bestStoryImpact: number;
} {
  let completeWindows = 0;
  let bestObjectPlace = 0;
  let bestVisual = 0;
  let bestBodyAction = 0;
  let bestStoryTurn = 0;
  let bestStoryImpact = 0;

  for (const window of windows) {
    const objectPlace = countMatches(window, SIGNATURE_OBJECT_PLACE_PATTERN);
    const visual = countMatches(window, SIGNATURE_VISUAL_DETAIL_PATTERN);
    const bodyAction = countMatches(window, SIGNATURE_BODY_ACTION_PATTERN);
    const storyTurn = countMatches(window, SIGNATURE_STORY_TURN_PATTERN);
    const storyImpact = countMatches(window, SIGNATURE_STORY_IMPACT_PATTERN);

    bestObjectPlace = Math.max(bestObjectPlace, objectPlace);
    bestVisual = Math.max(bestVisual, visual);
    bestBodyAction = Math.max(bestBodyAction, bodyAction);
    bestStoryTurn = Math.max(bestStoryTurn, storyTurn);
    bestStoryImpact = Math.max(bestStoryImpact, storyImpact);

    if (
      objectPlace > 0 &&
      visual > 0 &&
      bodyAction > 0 &&
      storyTurn > 0 &&
      storyImpact > 0
    ) {
      completeWindows++;
    }
  }

  return {
    completeWindows,
    bestObjectPlace,
    bestVisual,
    bestBodyAction,
    bestStoryTurn,
    bestStoryImpact,
  };
}

const SIGNATURE_OBJECT_PLACE_PATTERN =
  /(휴대폰|화면|파일|기록|로그|로고|번호|문서|메시지|알림|지도|열쇠|카드|배지|사진|봉투|반지|시계|문신|철문|통제선|계단|복도|엘리베이터|지하보도|문턱|현장|피해자|사건\s*기록|가방|칼|총|유리|상처|피)/gu;
const SIGNATURE_VISUAL_DETAIL_PATTERN =
  /(깜박|번쩍|빛|불빛|파란|붉은|검은|하얀|젖은|깨진|금간|찢긴|접힌|피\s*묻|녹슨|잠긴|꺼졌|켜졌|어두운|그림자|점멸|겹치|숫자|선명|희미|번져|흔들|비친|반짝|번뜩)/gu;
const SIGNATURE_BODY_ACTION_PATTERN =
  /(쥐었|쥔|움켜|눌렀|내려|올라|뛰쳐|달려|멈췄|멈춰|삼켰|숨|손바닥|목덜미|가슴|심장|손끝|몸|어깨|고개|시선|눈|입술|무릎|발끝|떨|식은땀|조였|붙잡|밀었|당겼|열었|닫았|우회|계산|돌아봤)/gu;
const SIGNATURE_STORY_TURN_PATTERN =
  /(드러났|밝혀|연결|맞물|겹치|지정|수신자|표적|실패|사망|죽|되돌릴\s*수\s*없|돌이킬\s*수\s*없|새\s*(?:알림|예고|위협|사건|표적)|다음\s*(?:수신자|표적|대상)|빼앗|잠겼|차단|바꿨|굳어졌|남았|남았다|발견|폭로|뒤집)/gu;
const SIGNATURE_STORY_IMPACT_PATTERN =
  /(첫\s*규칙|규칙.{0,18}(증명|굳어|바뀌|변하|뒤집|드러나)|미제\s*사건|가족\s*실종|현재\s*사건\s*기록|사망\s*시각|수신자.{0,18}(지정|바뀌|선택|깜박)|표적.{0,18}(지정|바뀌)|선택지.{0,18}(닫|사라|차단)|알리바이.{0,18}(닫|끊|사라)|대가|비용|되돌릴\s*수\s*없|돌이킬\s*수\s*없|관계.{0,18}(바뀌|멀어|가까워|신뢰|불신|동맹|배신)|가설.{0,18}(바뀌|뒤집|수정)|용의자.{0,18}(바뀌|드러나)|정체|진실|고백|배신|도움|조력자|새\s*규칙|등급|스킬|능력|한계)/gu;

const MOTIF_RESONANCE_GENERIC_TERMS = new Set([
  '모티프',
  '상징',
  '이미지',
  '장면',
  '테마',
  '주제',
  '의미',
  '감정',
  '잔향',
  '여운',
  '반복',
  '독자',
  '회차',
  '기억',
  '기억되는',
  '남는',
  '강한',
  '깊은',
  '통해',
  '으로',
  '에서',
  '한다',
  '된다',
  '만든다',
]);
const MOTIF_RESONANCE_EMOTION_PATTERN =
  /(불길|두려|공포|죄책|절박|긴장|호기심|쾌감|상실|그리움|분노|수치|안도|따뜻|설렘|고독|허기|씁쓸|결심|망설|흔들|숨|심장|가슴|목덜미|손바닥|눈|시선|떨|식은땀|삼켰|조였)/gu;
const MOTIF_RESONANCE_MEANING_SHIFT_PATTERN =
  /(남았|남는다|잔상|기억|떠올|되새|각인|의미|상징|질문|깨달|알았|이해|바꿨|달라졌|더는|이제|왜|어떻게|정체|가족|상처|약점|결핍|욕망|선택|대가|비용|관계|믿|불신)/gu;
const MOTIF_RESONANCE_STORY_CONSEQUENCE_PATTERN =
  /(선택지.{0,18}(닫|사라|차단)|알리바이.{0,18}(닫|끊|사라)|관계.{0,18}(바뀌|멀어|가까워|신뢰|불신)|가설.{0,18}(바뀌|뒤집|수정)|규칙.{0,18}(증명|굳어|바뀌|변하|뒤집)|수신자.{0,18}(지정|바뀌|깜박)|표적.{0,18}(지정|바뀌|좁혀)|다음\s*(?:행동|선택|질문|수신자|표적)|되돌릴\s*수\s*없|돌이킬\s*수\s*없|대가|비용|위험|결과|남았|남는다|강요|요청|포기|공개|동행|배신|새\s*규칙|단서.{0,18}(재해석|연결|드러|좁혀))/gu;

const SPATIAL_BLOCKING_ANCHOR_SOURCE = String.raw`(?:현장|복도|계단|계단참|엘리베이터|문|철문|입구|출구|바닥|벽|난간|통제선|지하보도|골목|건물|사무실|방|주차장|옥상|주소|좌표|도로|차도|문턱|창)`;
const SPATIAL_BLOCKING_MOVEMENT_SOURCE = String.raw`(?:뛰쳐|달려|향했|향하|들어|나가|올라|내려|건너|지나|다가|물러|눌렀|밟|넘어|붙잡고)`;
const SPATIAL_BLOCKING_OBSTACLE_SOURCE = String.raw`(?:막혔|막히|막아|가로막|차단|잠겼|잠그|닫혔|닫히|통제선|철문|꺼졌|꺼지|멈췄|멈춰|좁혀|길을\s*막|문을\s*막)`;
const SPATIAL_BLOCKING_RELATION_SOURCE = String.raw`(?:앞|뒤|옆|아래|안쪽|바깥|밖|너머|사이|끝|입구|출구|건너편|반대편|문턱|계단참|복도\s*끝|문\s*앞|바닥|벽|난간|반경|거리)`;
const SPATIAL_BLOCKING_ACTION_PRESSURE_PATTERN =
  /(제한\s*시간|카운트다운|피해자|현장|통제선|조명|꺼졌|문|잠겼|막혔|뛰쳐|달려|향했|찾으려|구하려|쫓|추격|위험|표적|수신자)/gu;

function assessManuscriptSpatialBlocking(
  manuscript: string
): ManuscriptSpatialBlockingAssessment {
  const prose = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(' ');
  const sentences = splitManuscriptSentences(prose);

  if (sentences.length < 3) {
    return {
      passed: true,
      actual: `spatial blocking check skipped: sentences=${sentences.length}`,
    };
  }

  const actionPressureSignals = countMatches(prose, SPATIAL_BLOCKING_ACTION_PRESSURE_PATTERN);
  if (actionPressureSignals < 3) {
    return {
      passed: true,
      actual: `spatial blocking check deferred: action/pressure signals=${actionPressureSignals}`,
    };
  }

  const anchorSignals = countMatches(
    prose,
    new RegExp(SPATIAL_BLOCKING_ANCHOR_SOURCE, 'gu')
  );
  const movementSignals = countMatches(
    prose,
    new RegExp(SPATIAL_BLOCKING_MOVEMENT_SOURCE, 'gu')
  );
  const obstacleSignals = countMatches(
    prose,
    new RegExp(SPATIAL_BLOCKING_OBSTACLE_SOURCE, 'gu')
  );
  const relationSignals = countMatches(
    prose,
    new RegExp(SPATIAL_BLOCKING_RELATION_SOURCE, 'gu')
  );

  const anchorPattern = new RegExp(SPATIAL_BLOCKING_ANCHOR_SOURCE, 'u');
  const movementPattern = new RegExp(SPATIAL_BLOCKING_MOVEMENT_SOURCE, 'u');
  const obstaclePattern = new RegExp(SPATIAL_BLOCKING_OBSTACLE_SOURCE, 'u');
  const relationPattern = new RegExp(SPATIAL_BLOCKING_RELATION_SOURCE, 'u');
  let blockingWindows = 0;

  for (let index = 0; index < sentences.length; index++) {
    const window = sentences[index];
    if (
      anchorPattern.test(window) &&
      movementPattern.test(window) &&
      (obstaclePattern.test(window) || relationPattern.test(window))
    ) {
      blockingWindows += 1;
    }
  }

  const passed =
    anchorSignals >= 3 &&
    movementSignals >= 1 &&
    obstacleSignals >= 1 &&
    relationSignals >= 1 &&
    blockingWindows >= 1;

  return {
    passed,
    actual: `spatial anchors=${anchorSignals}, movement path signals=${movementSignals}, obstacles=${obstacleSignals}, distance/position signals=${relationSignals}, blocking windows=${blockingWindows}, action/pressure signals=${actionPressureSignals}`,
  };
}

interface ManuscriptDialogueSubtextAssessment {
  passed: boolean;
  actual: string;
}

function assessManuscriptDialogueSubtext(manuscript: string): ManuscriptDialogueSubtextAssessment {
  const dialogues = extractManuscriptDialogues(manuscript);
  if (dialogues.length === 0) {
    return {
      passed: true,
      actual: 'dialogues=0, expository dialogues=0, friction dialogues=0',
    };
  }

  const expositoryDialogues = dialogues.filter(dialogue =>
    /(독자|핵심\s*질문|장기\s*미스터리|보상\s*주기|드롭오프|규칙을\s*행동으로|대사로\s*말|설명|제공돼|제공한다|수렴|이해해|매력|회차|클리프|긴장감|쾌감|사건의\s*핵심|말해\s*둘|알려\s*둘|요약하면|예고\s*앱은.*예보|앱이.*어떻게.*알았|첫\s*알림.*수신자|과거\s*미제\s*사건.*연결|가족.*실종.*수렴)/u.test(dialogue)
  ).length;
  const frictionDialogues = dialogues.filter(dialogue =>
    /(왜|뭐|그만|아니|거짓말|못\s*믿|웃기|닥쳐|그럼|하지만|그런데|싫|안\s*돼|말하지\s*마|네가\s*뭘|숨기|피하|대답해|\?|？|!|…|\.{3})/u.test(dialogue)
  ).length;
  const expositionRatio = expositoryDialogues / dialogues.length;

  return {
    passed: expositoryDialogues < 2 || expositionRatio < 0.5 || frictionDialogues >= 2,
    actual: `dialogues=${dialogues.length}, expository dialogues=${expositoryDialogues}, friction dialogues=${frictionDialogues}, exposition ratio=${expositionRatio.toFixed(2)}`,
  };
}

interface ManuscriptDialogueConflictAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptDialogueTurnAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptDialogueStateCarryoverAssessment {
  passed: boolean;
  actual: string;
}

interface DialogueExchangeBlock {
  block: string;
  aftermath: string;
}

function assessManuscriptDialogueConflict(
  manuscript: string
): ManuscriptDialogueConflictAssessment {
  const dialogues = extractManuscriptDialogues(manuscript);
  if (dialogues.length < 3) {
    return {
      passed: true,
      actual: `dialogues=${dialogues.length}, conflict moves=0, charged action beats=0, cooperative replies=0`,
    };
  }

  const conflictMoves = dialogues.filter(dialogue =>
    /(아니|거짓말|못\s*믿|믿으라고|그만|닥쳐|싫|안\s*돼|하지\s*마|말하지\s*마|말\s*돌리지|피하지\s*마|숨기|숨겼|왜\s*(?:숨|말|나|네가|지금|또)|대답해|설명해|뭐라고|웃기|장난|협박|위협|죽고|죽을|네\s*탓|내\s*탓|책임|거래|조건|비켜|물러|꺼져|따라오지\s*마|넌\s*몰라|나는\s*못)/u.test(dialogue)
  ).length;
  const dialogueContext = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => /["“”‘’「」『』]/u.test(line))
    .join(' ');
  const chargedActionBeats = countMatches(
    dialogueContext,
    /(대답하지\s*않|입을\s*다물|말을\s*삼켰|침묵|시선을\s*피|눈을\s*피|고개를\s*저|고개를\s*돌|손목을\s*잡|문을\s*막|한\s*걸음\s*물러|뒤로\s*물러|웃음이\s*사라|숨을\s*삼켰|목소리가\s*낮아|턱을\s*굳|주먹을\s*쥐)/gu
  );
  const cooperativeReplies = dialogues.filter(dialogue =>
    /^(?:네|예|알겠습니다|좋아|그럼|맞아요|맞습니다|확인|봅시다|하겠습니다|알았어요|그러죠)/u.test(dialogue.trim())
  ).length;

  return {
    passed: conflictMoves + chargedActionBeats >= 1,
    actual: `dialogues=${dialogues.length}, conflict moves=${conflictMoves}, charged action beats=${chargedActionBeats}, cooperative replies=${cooperativeReplies}`,
  };
}

const DIALOGUE_CONTEST_PATTERN =
  /(아니|거짓말|못\s*믿|믿으라고|그만|닥쳐|싫|안\s*돼|하지\s*마|말하지\s*마|말\s*돌리지|피하지\s*마|숨기|숨겼|왜\s*(?:숨|말|나|네가|지금|또)|대답해|설명해|뭐라고|웃기|장난|협박|위협|죽고|죽을|네\s*탓|내\s*탓|책임|거래|조건|비켜|물러|꺼져|따라오지\s*마|넌\s*몰라|나는\s*못|\?|？|!|…|\.{3})/u;

const DIALOGUE_TURN_PATTERN =
  /(드러났|드러난|밝혀졌|밝혀낸|폭로|고백|자백|인정했|인정하|실토|공개했|공개하|새\s*(?:번호|이름|주소|좌표|파일|로그|녹음|사진|메시지|단서|증거)|잠금이\s*풀|비밀번호|서명|관리자|계정|배후|정체|범인|내통|거짓말이\s*확인|주도권|형세|힘의\s*균형|침묵이\s*(?:깨|굳)|물러섰|길을\s*비켰|문을\s*열었|손목을\s*놓|휴대폰을\s*넘겼|증거를\s*넘겼|파일을\s*내밀|기록을\s*내밀|조건을\s*받아들|거래를\s*받아들|제안을\s*받아들|거절하자|협박이\s*통했|권한을\s*잃|접근권을\s*얻|믿기로|신뢰가\s*(?:깨|생|돌아)|불신이\s*굳|동행하기로|함께\s*(?:가|움직|나섰|추적|들어)|배신|화해|사과를\s*받아들|거리를\s*두|연합|동맹|혼자\s*가지\s*않|그러자[^.!?。！？]{0,80}(?:드러|밝혀|넘겼|비켰|열었|받아들|거절|물러|따라|나섰|깨졌|바뀌|잃|얻)|그제야[^.!?。！？]{0,80}(?:드러|밝혀|넘겼|비켰|열었|받아들|거절|물러|따라|나섰|깨졌|바뀌|잃|얻)|결국[^.!?。！？]{0,80}(?:드러|밝혀|넘겼|비켰|열었|받아들|거절|물러|따라|나섰|깨졌|바뀌|잃|얻))/gu;

const DIALOGUE_STATE_ANCHOR_PATTERN =
  /(휴대폰|로그|파일|번호|문|조건|이름|증거|기록|단서|미제|사건|경찰|피해자|알림|화면|잠금|앱|로고|계정|서명|좌표|통제선|주도권|신뢰|불신|동행|거래|제안|약속|비밀번호|관리자|개발자|가족|실종|권한|접근권|배후|정체|범인|내통|현장|철문)/gu;

const DIALOGUE_STATE_CARRYOVER_PATTERN =
  /(?:그래서|그러자|그제야|결국|직후|이어|그\s*결과|조건대로|받아든|넘겨받은|드러난|밝혀진|열린|비켜\s*준|새\s*(?:로그|파일|번호|단서|증거|좌표)|그\s*(?:로그|파일|번호|문|증거|기록|단서|휴대폰|알림|화면|앱|로고|이름|사건|조건))[^.!?。！？]{0,100}(?:확인|대조|추적|향했|움직|열었|넘겼|붙잡|숨겼|공개|보호|동행|갈라섰|막았|압박|위협|표적|찾으려|구하려|달려|나섰|따라|들어|비켜|닫|쥐|챙겼|겨눴|막아)/gu;

const DIALOGUE_STATE_CARRYOVER_NEGATION_PATTERN =
  /(아무\s*조건도\s*바꾸지|조건도\s*바꾸지|다시\s*손대지\s*않|무시|원래처럼|없던\s*일|상관없이|넘기지\s*않|열지\s*않|따르지\s*않|챙기지\s*않|확인하지\s*않|보지\s*않|움직이지\s*않|바꾸지\s*않은\s*채)/gu;

function assessManuscriptDialogueTurn(
  manuscript: string
): ManuscriptDialogueTurnAssessment {
  const blocks = extractDialogueExchangeBlocks(manuscript);
  let contestedBlocks = 0;
  let turnedBlocks = 0;
  let strongestTurnSignals = 0;

  for (const block of blocks) {
    const dialogues = extractQuotedDialogues(block);
    if (dialogues.length < 3 || !DIALOGUE_CONTEST_PATTERN.test(block)) {
      continue;
    }

    contestedBlocks += 1;
    const turnSignals = countMatches(block, DIALOGUE_TURN_PATTERN);
    strongestTurnSignals = Math.max(strongestTurnSignals, turnSignals);

    if (turnSignals > 0) {
      turnedBlocks += 1;
    }
  }

  return {
    passed: contestedBlocks === 0 || turnedBlocks === contestedBlocks,
    actual: `dialogue blocks=${blocks.length}, contested dialogue blocks=${contestedBlocks}, turned dialogue blocks=${turnedBlocks}, strongest turn signals=${strongestTurnSignals}`,
  };
}

function assessManuscriptDialogueStateCarryover(
  manuscript: string
): ManuscriptDialogueStateCarryoverAssessment {
  const exchanges = extractDialogueExchangeBlockContexts(manuscript);
  let turnedBlocks = 0;
  let carriedBlocks = 0;
  let strongestSharedAnchors = 0;
  let strongestCarryoverSignals = 0;
  let negatedCarryovers = 0;

  for (const exchange of exchanges) {
    const dialogues = extractQuotedDialogues(exchange.block);
    if (dialogues.length < 3 || !DIALOGUE_CONTEST_PATTERN.test(exchange.block)) {
      continue;
    }

    if (countMatches(exchange.block, DIALOGUE_TURN_PATTERN) === 0) {
      continue;
    }

    turnedBlocks += 1;

    const sharedAnchors = countSharedDialogueStateAnchors(
      exchange.block,
      exchange.aftermath
    );
    const carryoverSignals = countMatches(
      exchange.aftermath,
      DIALOGUE_STATE_CARRYOVER_PATTERN
    );
    const negationSignals = countMatches(
      exchange.aftermath,
      DIALOGUE_STATE_CARRYOVER_NEGATION_PATTERN
    );

    strongestSharedAnchors = Math.max(strongestSharedAnchors, sharedAnchors);
    strongestCarryoverSignals = Math.max(strongestCarryoverSignals, carryoverSignals);
    negatedCarryovers += negationSignals;

    if (sharedAnchors > 0 && carryoverSignals > 0 && negationSignals === 0) {
      carriedBlocks += 1;
    }
  }

  return {
    passed: turnedBlocks === 0 || carriedBlocks === turnedBlocks,
    actual: `turned dialogue blocks=${turnedBlocks}, carried state blocks=${carriedBlocks}, strongest shared anchors=${strongestSharedAnchors}, strongest carryover signals=${strongestCarryoverSignals}, negated carryovers=${negatedCarryovers}`,
  };
}

function extractDialogueExchangeBlocks(manuscript: string): string[] {
  return extractDialogueExchangeBlockContexts(manuscript).map(exchange => exchange.block);
}

function extractDialogueExchangeBlockContexts(manuscript: string): DialogueExchangeBlock[] {
  const lines = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(Boolean);
  const blocks: DialogueExchangeBlock[] = [];

  let index = 0;
  while (index < lines.length) {
    if (!/["“”‘’「」『』]/u.test(lines[index])) {
      index += 1;
      continue;
    }

    const blockLines: string[] = [];
    while (index < lines.length && /["“”‘’「」『』]/u.test(lines[index])) {
      blockLines.push(lines[index]);
      index += 1;
    }

    const aftermathLines: string[] = [];
    while (
      index < lines.length &&
      !/["“”‘’「」『』]/u.test(lines[index]) &&
      aftermathLines.length < 2
    ) {
      aftermathLines.push(lines[index]);
      index += 1;
    }

    blocks.push({
      block: [...blockLines, ...aftermathLines.slice(0, 1)].join(' '),
      aftermath: aftermathLines.join(' '),
    });
  }

  return blocks;
}

function countSharedDialogueStateAnchors(left: string, right: string): number {
  if (!right.trim()) {
    return 0;
  }

  const leftAnchors = new Set(left.match(DIALOGUE_STATE_ANCHOR_PATTERN) ?? []);
  const rightAnchors = new Set(right.match(DIALOGUE_STATE_ANCHOR_PATTERN) ?? []);
  let shared = 0;

  for (const anchor of leftAnchors) {
    if (rightAnchors.has(anchor)) {
      shared += 1;
    }
  }

  return shared;
}

interface ManuscriptCharacterVoiceAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptCharacterVoiceProfileAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface AttributedManuscriptDialogue {
  speaker: string;
  text: string;
}

function assessManuscriptCharacterVoiceDifferentiation(
  manuscript: string
): ManuscriptCharacterVoiceAssessment {
  const attributedDialogues = extractAttributedManuscriptDialogues(manuscript);
  if (attributedDialogues.length < 4) {
    return {
      passed: true,
      actual: `attributed dialogues=${attributedDialogues.length}, active speakers=0`,
    };
  }

  const dialoguesBySpeaker = new Map<string, string[]>();
  for (const dialogue of attributedDialogues) {
    dialoguesBySpeaker.set(dialogue.speaker, [
      ...(dialoguesBySpeaker.get(dialogue.speaker) ?? []),
      dialogue.text,
    ]);
  }

  const activeSpeakers = [...dialoguesBySpeaker.entries()].filter(
    ([, dialogues]) => dialogues.length >= 2
  );
  if (activeSpeakers.length < 2) {
    return {
      passed: true,
      actual:
        `attributed dialogues=${attributedDialogues.length}, ` +
        `active speakers=${activeSpeakers.length}, speaker turns=${summarizeSpeakerTurns(dialoguesBySpeaker)}`,
    };
  }

  const activeDialogues = activeSpeakers.flatMap(([, dialogues]) => dialogues);
  const normalizedBySpeaker = new Map<string, Set<string>>();
  for (const [speaker, dialogues] of activeSpeakers) {
    normalizedBySpeaker.set(
      speaker,
      new Set(dialogues.map(normalizeDialogueForVoice).filter(Boolean))
    );
  }

  const crossSpeakerRepeats = countCrossSpeakerRepeatedDialogues(normalizedBySpeaker);
  const uniqueLines = new Set(activeDialogues.map(normalizeDialogueForVoice).filter(Boolean));
  const duplicateRatio =
    activeDialogues.length === 0 ? 0 : 1 - uniqueLines.size / activeDialogues.length;
  const signatures = activeSpeakers.map(([, dialogues]) => buildVoiceSignature(dialogues));
  const uniqueSignatures = new Set(signatures);
  const averageSimilarity = averageSpeakerDialogueSimilarity(activeSpeakers);
  const repeatedLineFailure = crossSpeakerRepeats >= 2 && duplicateRatio >= 0.35;
  const homogeneousVoiceFailure =
    uniqueSignatures.size === 1 && duplicateRatio >= 0.25 && averageSimilarity >= 0.72;
  const interchangeableVoiceFailure =
    uniqueSignatures.size === 1 && duplicateRatio < 0.25 && averageSimilarity >= 0.15;

  return {
    passed: !(repeatedLineFailure || homogeneousVoiceFailure || interchangeableVoiceFailure),
    actual:
      `attributed dialogues=${attributedDialogues.length}, ` +
      `active speakers=${activeSpeakers.length}, speaker turns=${summarizeSpeakerTurns(dialoguesBySpeaker)}, ` +
      `cross-speaker repeated lines=${crossSpeakerRepeats}, duplicate ratio=${duplicateRatio.toFixed(2)}, ` +
      `unique voice signatures=${uniqueSignatures.size}/${activeSpeakers.length}, ` +
      `average speaker similarity=${averageSimilarity.toFixed(2)}`,
  };
}

function assessManuscriptCharacterVoiceProfileAlignment(
  manuscript: string,
  characters: CharacterReferenceForEvaluation[] | undefined
): ManuscriptCharacterVoiceProfileAssessment {
  const voiceCharacters = (characters ?? []).filter(
    character => character.voice && hasCharacterVoiceConstraint(character.voice)
  );
  if (voiceCharacters.length === 0) {
    return {
      passed: true,
      expected: 'no character voice profiles supplied',
      actual: 'voice-profiled characters=0',
    };
  }

  const attributedDialogues = extractAttributedManuscriptDialogues(manuscript);
  if (attributedDialogues.length === 0) {
    return {
      passed: true,
      expected: 'attributed dialogue for character voice profile checks',
      actual: 'attributed dialogues=0',
    };
  }

  const charactersBySpeaker = buildCharactersBySpeakerAlias(voiceCharacters);
  const signaturePhraseOwners = buildSignaturePhraseOwners(voiceCharacters);
  const preferredVocabularyOwners = buildPreferredVocabularyTermOwners(voiceCharacters);
  const dialoguesByCharacter = new Map<string, AttributedManuscriptDialogue[]>();
  for (const dialogue of attributedDialogues) {
    const character = charactersBySpeaker.get(normalizeSpeakerAlias(dialogue.speaker));
    if (!character?.id && !character?.name) {
      continue;
    }
    const key = characterReferenceKey(character);
    dialoguesByCharacter.set(key, [
      ...(dialoguesByCharacter.get(key) ?? []),
      dialogue,
    ]);
  }

  const failures: string[] = [];
  const checked: string[] = [];

  for (const character of voiceCharacters) {
    const key = characterReferenceKey(character);
    const dialogues = dialoguesByCharacter.get(key) ?? [];
    if (dialogues.length === 0 || !character.voice) {
      continue;
    }

    const checkDetails = [`${dialogues.length} attributed dialogues`];
    const expectedRegister = expectedDialogueRegistersForVoice(character.voice);
    if (expectedRegister) {
      const mismatches = dialogues.filter(dialogue => {
        const observed = dominantDialogueRegister(dialogue.text);
        return isDialogueRegister(observed) && !expectedRegister.allowed.has(observed);
      });

      checkDetails.push(`expected ${expectedRegister.label}`);
      checkDetails.push(`register mismatches=${mismatches.length}`);

      const mismatchRatio = mismatches.length / Math.max(1, dialogues.length);
      const repeatedProfileDrift =
        dialogues.length >= 2 && (mismatches.length >= 2 || mismatchRatio >= 0.6);
      const strictSingleLineDrift =
        dialogues.length === 1 &&
        mismatches.length === 1 &&
        expectedRegister.strictSingleLine;

      if (repeatedProfileDrift || strictSingleLineDrift) {
        failures.push(
          `${character.name}: expected ${expectedRegister.label}, ` +
            `but ${mismatches.length}/${dialogues.length} attributed dialogue lines used ` +
            `${summarizeObservedRegisters(mismatches.map(dialogue => dialogue.text))}; ` +
            `examples=${mismatches.map(dialogue => `"${dialogue.text}"`).slice(0, 2).join(', ')}`
        );
      }
    }

    const signaturePhraseDrifts = findSignaturePhraseOwnershipDrifts(
      dialogues,
      character,
      signaturePhraseOwners
    );
    if ((character.voice.signature_phrases?.length ?? 0) > 0) {
      checkDetails.push(`signature phrases=${character.voice.signature_phrases?.length ?? 0}`);
    }
    if (signaturePhraseDrifts.length > 0) {
      failures.push(
        `${character.name}: borrowed another character's signature phrase; ` +
          signaturePhraseDrifts
            .slice(0, 2)
            .map(
              drift =>
                `"${drift.phrase}" belongs to ${drift.ownerName}, used in "${drift.dialogue}"`
            )
            .join(', ')
      );
    }

    const vocabularyProfile = assessCharacterVocabularyProfile(
      dialogues,
      character,
      preferredVocabularyOwners
    );
    if (vocabularyProfile) {
      checkDetails.push(vocabularyProfile.actual);
      if (!vocabularyProfile.passed && vocabularyProfile.failure) {
        failures.push(`${character.name}: ${vocabularyProfile.failure}`);
      }
    }

    const dialectProfile = assessCharacterDialectProfile(dialogues, character.voice);
    if (dialectProfile) {
      checkDetails.push(dialectProfile.actual);
      if (!dialectProfile.passed && dialectProfile.failure) {
        failures.push(`${character.name}: ${dialectProfile.failure}`);
      }
    }

    checked.push(`${character.name}: ${checkDetails.join(', ')}`);
  }

  return {
    passed: failures.length === 0,
    expected:
      'character dialogue should preserve the planned voice profile: honorific level, speech pattern, preferred/avoided vocabulary, and signature verbal habits unless the scene stages a relationship or stress-driven shift.',
    actual: failures.length > 0 ? failures.join(' / ') : checked.join(' / ') || 'no matching attributed character dialogue',
  };
}

function hasCharacterVoiceConstraint(voice: CharacterVoiceReferenceForEvaluation | undefined): boolean {
  if (!voice) return false;
  return Boolean(
    voice.formality_level ||
      voice.speech_pattern?.trim() ||
      voice.vocabulary?.trim() ||
      (voice.signature_phrases?.length ?? 0) > 0 ||
      voice.dialect?.trim()
  );
}

function buildCharactersBySpeakerAlias(
  characters: CharacterReferenceForEvaluation[]
): Map<string, CharacterReferenceForEvaluation> {
  const charactersBySpeaker = new Map<string, CharacterReferenceForEvaluation>();
  for (const character of characters) {
    const aliases = [character.name, ...(character.aliases ?? [])]
      .map(alias => alias.trim())
      .filter(isUsableSpeakerAlias);
    for (const alias of aliases) {
      charactersBySpeaker.set(normalizeSpeakerAlias(alias), character);
    }
  }

  return charactersBySpeaker;
}

function isUsableSpeakerAlias(alias: string): boolean {
  if (alias.length < 2) return false;
  return !/^(그|그녀|그들|그놈|그애|주인공|남자|여자)$/u.test(alias);
}

function normalizeSpeakerAlias(value: string): string {
  return normalizeText(value);
}

function characterReferenceKey(character: CharacterReferenceForEvaluation): string {
  return character.id ?? character.name;
}

interface SignaturePhraseOwner {
  phrase: string;
  normalizedPhrase: string;
  ownerKey: string;
  ownerName: string;
}

interface SignaturePhraseDrift {
  phrase: string;
  ownerName: string;
  dialogue: string;
}

function buildSignaturePhraseOwners(
  characters: CharacterReferenceForEvaluation[]
): SignaturePhraseOwner[] {
  const ownersByPhrase = new Map<
    string,
    { phrase: string; owners: Map<string, string> }
  >();

  for (const character of characters) {
    for (const phrase of character.voice?.signature_phrases ?? []) {
      const normalizedPhrase = normalizeSignaturePhrase(phrase);
      if (!normalizedPhrase) continue;
      const entry =
        ownersByPhrase.get(normalizedPhrase) ?? {
          phrase,
          owners: new Map<string, string>(),
        };
      entry.owners.set(characterReferenceKey(character), character.name);
      ownersByPhrase.set(normalizedPhrase, entry);
    }
  }

  return [...ownersByPhrase.entries()]
    .filter(([, entry]) => entry.owners.size === 1)
    .map(([normalizedPhrase, entry]) => {
      const [ownerKey, ownerName] = [...entry.owners.entries()][0] ?? ['', ''];
      return {
        phrase: entry.phrase,
        normalizedPhrase,
        ownerKey,
        ownerName,
      };
    })
    .filter(owner => owner.ownerKey && owner.ownerName);
}

function normalizeSignaturePhrase(phrase: string): string | undefined {
  const normalized = normalizeText(phrase);
  return normalized.replace(/\s/gu, '').length >= 4 ? normalized : undefined;
}

function findSignaturePhraseOwnershipDrifts(
  dialogues: AttributedManuscriptDialogue[],
  character: CharacterReferenceForEvaluation,
  owners: SignaturePhraseOwner[]
): SignaturePhraseDrift[] {
  const characterKey = characterReferenceKey(character);
  const drifts: SignaturePhraseDrift[] = [];

  for (const dialogue of dialogues) {
    const normalizedDialogue = normalizeText(dialogue.text);
    for (const owner of owners) {
      if (owner.ownerKey === characterKey) continue;
      if (normalizedDialogue.includes(owner.normalizedPhrase)) {
        drifts.push({
          phrase: owner.phrase,
          ownerName: owner.ownerName,
          dialogue: dialogue.text,
        });
      }
    }
  }

  return drifts;
}

type VocabularyProfileSectionType = 'preferred' | 'avoided';

interface CharacterVocabularyProfile {
  preferredTerms: string[];
  avoidedTerms: string[];
}

interface VocabularyTermOwner {
  term: string;
  normalizedTerm: string;
  ownerKey: string;
  ownerName: string;
}

interface VocabularyTermDrift {
  term: string;
  normalizedTerm: string;
  ownerName?: string;
  dialogue: string;
}

const VOCABULARY_SECTION_LABEL_PATTERN =
  /(선호\s*(?:어휘|단어|표현)|자주\s*쓰는\s*(?:말|어휘|단어|표현)|주로\s*쓰는\s*(?:말|어휘|단어|표현)|고유\s*(?:어휘|단어|표현)|특유\s*(?:어휘|단어|표현)|preferred\s*(?:vocabulary|words?|terms?)|favou?r(?:ed|ite)?\s*(?:vocabulary|words?|terms?)|go[- ]?to\s*(?:vocabulary|words?|terms?)|signature\s*(?:vocabulary|words?|terms?)|금지\s*(?:어휘|단어|표현)|회피\s*(?:어휘|단어|표현)|피해야\s*할\s*(?:말|어휘|단어|표현)|쓰지\s*않는\s*(?:말|어휘|단어|표현)|사용하지\s*않는\s*(?:말|어휘|단어|표현)|forbidden\s*(?:vocabulary|words?|terms?)|avoided\s*(?:vocabulary|words?|terms?)|avoid\s*(?:vocabulary|words?|terms?)|never\s*uses?|taboo\s*(?:vocabulary|words?|terms?))/giu;

const AVOIDED_VOCABULARY_LABEL_PATTERN =
  /(금지|회피|피해야|쓰지\s*않|사용하지\s*않|forbidden|avoid|never|taboo)/iu;

const VOCABULARY_TERM_STOPWORDS = new Set([
  '어휘',
  '단어',
  '표현',
  '말',
  '말투',
  '선호',
  '금지',
  '회피',
  '사용',
  '자주',
  '주로',
  '고유',
  '특유',
  '위주',
  '중심',
  '계열',
  '스타일',
  '톤',
  'preferred',
  'vocabulary',
  'words',
  'terms',
  'forbidden',
  'avoided',
  'avoid',
  'taboo',
]);

function assessCharacterVocabularyProfile(
  dialogues: AttributedManuscriptDialogue[],
  character: CharacterReferenceForEvaluation,
  preferredOwners: VocabularyTermOwner[]
): VoiceProfileSubAssessment | undefined {
  const profile = parseCharacterVocabularyProfile(character.voice?.vocabulary);
  if (!profile) {
    return undefined;
  }

  const avoidedDrifts = findAvoidedVocabularyDrifts(dialogues, profile.avoidedTerms);
  const borrowedDrifts = findPreferredVocabularyOwnershipDrifts(
    dialogues,
    character,
    preferredOwners
  );

  const failures: string[] = [];
  if (avoidedDrifts.length > 0 && isRepeatedVocabularyDrift(avoidedDrifts, dialogues.length)) {
    failures.push(
      `used avoided vocabulary from the character profile; examples=${avoidedDrifts
        .slice(0, 2)
        .map(drift => `"${drift.term}" in "${drift.dialogue}"`)
        .join(', ')}`
    );
  }

  if (
    borrowedDrifts.length > 0 &&
    (isRepeatedVocabularyDrift(borrowedDrifts, dialogues.length) ||
      borrowedDrifts.some(drift => isStrictVocabularyOwnershipTerm(drift.normalizedTerm)))
  ) {
    failures.push(
      `borrowed another character's preferred vocabulary; examples=${borrowedDrifts
        .slice(0, 2)
        .map(
          drift =>
            `"${drift.term}" belongs to ${drift.ownerName ?? 'another character'}, used in "${drift.dialogue}"`
        )
        .join(', ')}`
    );
  }

  return {
    passed: failures.length === 0,
    actual:
      `vocabulary preferred=${profile.preferredTerms.length}, avoided=${profile.avoidedTerms.length}, ` +
      `avoided hits=${avoidedDrifts.length}, borrowed preferred hits=${borrowedDrifts.length}`,
    failure: failures.length > 0 ? failures.join('; ') : undefined,
  };
}

function buildPreferredVocabularyTermOwners(
  characters: CharacterReferenceForEvaluation[]
): VocabularyTermOwner[] {
  const ownersByTerm = new Map<string, { term: string; owners: Map<string, string> }>();

  for (const character of characters) {
    const profile = parseCharacterVocabularyProfile(character.voice?.vocabulary);
    for (const term of profile?.preferredTerms ?? []) {
      const normalizedTerm = normalizeVocabularyTerm(term);
      if (!normalizedTerm || !isVocabularyOwnershipTerm(normalizedTerm)) continue;
      const entry =
        ownersByTerm.get(normalizedTerm) ?? {
          term,
          owners: new Map<string, string>(),
        };
      entry.owners.set(characterReferenceKey(character), character.name);
      ownersByTerm.set(normalizedTerm, entry);
    }
  }

  return [...ownersByTerm.entries()]
    .filter(([, entry]) => entry.owners.size === 1)
    .map(([normalizedTerm, entry]) => {
      const [ownerKey, ownerName] = [...entry.owners.entries()][0] ?? ['', ''];
      return {
        term: entry.term,
        normalizedTerm,
        ownerKey,
        ownerName,
      };
    })
    .filter(owner => owner.ownerKey && owner.ownerName);
}

function parseCharacterVocabularyProfile(
  vocabulary: string | undefined
): CharacterVocabularyProfile | undefined {
  if (!vocabulary?.trim()) {
    return undefined;
  }

  const preferredTerms = new Set<string>();
  const avoidedTerms = new Set<string>();

  for (const section of extractVocabularySections(vocabulary)) {
    const terms = extractVocabularyTerms(section.content);
    for (const term of terms) {
      if (section.type === 'avoided') {
        avoidedTerms.add(term);
      } else {
        preferredTerms.add(term);
      }
    }
  }

  return preferredTerms.size > 0 || avoidedTerms.size > 0
    ? {
        preferredTerms: [...preferredTerms],
        avoidedTerms: [...avoidedTerms],
      }
    : undefined;
}

function extractVocabularySections(
  vocabulary: string
): Array<{ type: VocabularyProfileSectionType; content: string }> {
  const matches = [...vocabulary.matchAll(VOCABULARY_SECTION_LABEL_PATTERN)];
  if (matches.length === 0) {
    return vocabulary
      .split(/[\n;；]+/u)
      .map(segment => segment.trim())
      .filter(Boolean)
      .flatMap(segment => {
        const labelMatch = segment.match(VOCABULARY_SECTION_LABEL_PATTERN);
        if (!labelMatch?.[0]) return [];
        return [
          {
            type: vocabularySectionType(labelMatch[0]),
            content: stripVocabularySectionLabel(segment),
          },
        ];
      });
  }

  return matches
    .map((match, index) => {
      const label = match[0] ?? '';
      const start = (match.index ?? 0) + label.length;
      const end = matches[index + 1]?.index ?? vocabulary.length;
      return {
        type: vocabularySectionType(label),
        content: vocabulary.slice(start, end).replace(/^[:：=\-\s]+/u, '').trim(),
      };
    })
    .filter(section => section.content.length > 0);
}

function vocabularySectionType(label: string): VocabularyProfileSectionType {
  return AVOIDED_VOCABULARY_LABEL_PATTERN.test(label) ? 'avoided' : 'preferred';
}

function stripVocabularySectionLabel(segment: string): string {
  return segment
    .replace(VOCABULARY_SECTION_LABEL_PATTERN, '')
    .replace(/^[:：=\-\s]+/u, '')
    .trim();
}

function extractVocabularyTerms(content: string): string[] {
  return content
    .replace(/[()[\]{}]/gu, ' ')
    .replace(/["“”'‘’`]/gu, '')
    .split(/[,，、·•|/]+/u)
    .map(term => normalizeVocabularyTerm(term))
    .filter((term): term is string => Boolean(term));
}

function normalizeVocabularyTerm(term: string): string | undefined {
  const normalized = normalizeText(term);
  const compact = normalized.replace(/\s/gu, '');
  if (compact.length < 2) return undefined;
  if (VOCABULARY_TERM_STOPWORDS.has(normalized) || VOCABULARY_TERM_STOPWORDS.has(compact)) {
    return undefined;
  }
  return normalized;
}

function isVocabularyOwnershipTerm(normalizedTerm: string): boolean {
  const compact = normalizedTerm.replace(/\s/gu, '');
  return compact.length >= 3 && !VOCABULARY_TERM_STOPWORDS.has(compact);
}

function isStrictVocabularyOwnershipTerm(normalizedTerm: string): boolean {
  return normalizedTerm.replace(/\s/gu, '').length >= 4 || normalizedTerm.includes(' ');
}

function findAvoidedVocabularyDrifts(
  dialogues: AttributedManuscriptDialogue[],
  avoidedTerms: string[]
): VocabularyTermDrift[] {
  return dialogues.flatMap(dialogue => {
    const normalizedDialogue = normalizeText(dialogue.text);
    return avoidedTerms
      .filter(term => containsNormalizedVocabularyTerm(normalizedDialogue, term))
      .map(term => ({
        term,
        normalizedTerm: term,
        dialogue: dialogue.text,
      }));
  });
}

function findPreferredVocabularyOwnershipDrifts(
  dialogues: AttributedManuscriptDialogue[],
  character: CharacterReferenceForEvaluation,
  owners: VocabularyTermOwner[]
): VocabularyTermDrift[] {
  const characterKey = characterReferenceKey(character);

  return dialogues.flatMap(dialogue => {
    const normalizedDialogue = normalizeText(dialogue.text);
    return owners
      .filter(owner => owner.ownerKey !== characterKey)
      .filter(owner =>
        containsNormalizedVocabularyTerm(normalizedDialogue, owner.normalizedTerm)
      )
      .map(owner => ({
        term: owner.term,
        normalizedTerm: owner.normalizedTerm,
        ownerName: owner.ownerName,
        dialogue: dialogue.text,
      }));
  });
}

function containsNormalizedVocabularyTerm(
  normalizedText: string,
  normalizedTerm: string
): boolean {
  if (!normalizedText || !normalizedTerm) {
    return false;
  }

  if (/[a-z0-9]/iu.test(normalizedTerm)) {
    const escapedTerm = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|\\s)${escapedTerm}(?:\\s|$)`, 'iu').test(normalizedText);
  }

  return normalizedText.includes(normalizedTerm);
}

function isRepeatedVocabularyDrift(
  drifts: VocabularyTermDrift[],
  dialogueCount: number
): boolean {
  const driftLines = new Set(drifts.map(drift => drift.dialogue));
  const driftRatio = driftLines.size / Math.max(1, dialogueCount);
  return drifts.length >= 2 || driftLines.size >= 2 || driftRatio >= 0.6;
}

type CharacterDialogueDialect = 'gyeongsang' | 'jeolla' | 'chungcheong' | 'jeju';

interface ExpectedDialectProfile {
  dialect: CharacterDialogueDialect | 'standard';
  label: string;
}

interface DialectObservation {
  dialect: CharacterDialogueDialect;
  marker: string;
  dialogue: string;
}

interface VoiceProfileSubAssessment {
  passed: boolean;
  actual: string;
  failure?: string;
}

function assessCharacterDialectProfile(
  dialogues: AttributedManuscriptDialogue[],
  voice: CharacterVoiceReferenceForEvaluation
): VoiceProfileSubAssessment | undefined {
  const expectedDialect = expectedDialectProfileForVoice(voice);
  if (!expectedDialect) {
    return undefined;
  }

  const observations = dialogues.flatMap(dialogue =>
    detectDialogueDialect(dialogue.text).map(observation => ({
      ...observation,
      dialogue: dialogue.text,
    }))
  );
  const observedDialectLines = new Set(observations.map(observation => observation.dialogue));

  if (expectedDialect.dialect === 'standard') {
    const dialectRatio = observedDialectLines.size / Math.max(1, dialogues.length);
    const failed = observedDialectLines.size >= 2 || dialectRatio >= 0.6;
    return {
      passed: !failed,
      actual: `expected ${expectedDialect.label}, regional dialect lines=${observedDialectLines.size}`,
      failure: failed
        ? `expected ${expectedDialect.label}, but ${observedDialectLines.size}/${dialogues.length} attributed dialogue lines used regional dialect markers; examples=${observations
            .slice(0, 2)
            .map(observation => `"${observation.dialogue}" (${observation.marker})`)
            .join(', ')}`
        : undefined,
    };
  }

  const conflictingObservations = observations.filter(
    observation => observation.dialect !== expectedDialect.dialect
  );
  const conflictingLines = new Set(
    conflictingObservations.map(observation => observation.dialogue)
  );
  const conflictRatio = conflictingLines.size / Math.max(1, dialogues.length);
  const failed = conflictingLines.size >= 2 || conflictRatio >= 0.6;

  return {
    passed: !failed,
    actual:
      `expected ${expectedDialect.label}, ` +
      `conflicting dialect lines=${conflictingLines.size}`,
    failure: failed
      ? `expected ${expectedDialect.label}, but ${conflictingLines.size}/${dialogues.length} attributed dialogue lines used conflicting dialect markers; examples=${conflictingObservations
          .slice(0, 2)
          .map(observation => `"${observation.dialogue}" (${observation.marker})`)
          .join(', ')}`
      : undefined,
  };
}

function expectedDialectProfileForVoice(
  voice: CharacterVoiceReferenceForEvaluation
): ExpectedDialectProfile | undefined {
  const dialect = `${voice.dialect ?? ''} ${voice.speech_pattern ?? ''}`.toLowerCase();
  if (!dialect.trim()) return undefined;
  if (/(표준|standard|서울말|서울\s*말)/u.test(dialect)) {
    return { dialect: 'standard', label: 'standard Korean dialogue' };
  }
  if (/(경상|부산|대구|경남|경북|동남)/u.test(dialect)) {
    return { dialect: 'gyeongsang', label: 'Gyeongsang dialect dialogue' };
  }
  if (/(전라|광주|전남|전북)/u.test(dialect)) {
    return { dialect: 'jeolla', label: 'Jeolla dialect dialogue' };
  }
  if (/(충청|대전|충남|충북)/u.test(dialect)) {
    return { dialect: 'chungcheong', label: 'Chungcheong dialect dialogue' };
  }
  if (/제주/u.test(dialect)) {
    return { dialect: 'jeju', label: 'Jeju dialect dialogue' };
  }

  return undefined;
}

function detectDialogueDialect(dialogue: string): Array<{
  dialect: CharacterDialogueDialect;
  marker: string;
}> {
  const patterns: Array<{ dialect: CharacterDialogueDialect; pattern: RegExp }> = [
    {
      dialect: 'gyeongsang',
      pattern: /(뭐라카|카노|하노|아이가|맞나|하모|이라꼬|데이|가꼬|아인교|입니꺼|니꺼|능교|마[.!?。！？…]?)/u,
    },
    {
      dialect: 'jeolla',
      pattern: /(당께|그랑께|허벌나|거시기|근디|그라제|허요|혔어라|아따)/u,
    },
    {
      dialect: 'chungcheong',
      pattern: /(했슈|그랬슈|맞쥬|아녀유|그려유|그랬시유|하것슈|가유|뭐여)/u,
    },
    {
      dialect: 'jeju',
      pattern: /(혼저|옵서|하영|겅|허우다|수다|맨도롱)/u,
    },
  ];

  return patterns.flatMap(({ dialect, pattern }) => {
    const marker = dialogue.match(pattern)?.[0];
    return marker ? [{ dialect, marker }] : [];
  });
}

interface ExpectedDialogueRegisters {
  allowed: Set<'formal' | 'polite' | 'casual'>;
  label: string;
  strictSingleLine: boolean;
}

function expectedDialogueRegistersForVoice(
  voice: CharacterVoiceReferenceForEvaluation
): ExpectedDialogueRegisters | undefined {
  if (voice.formality_level === 'very_formal') {
    return {
      allowed: new Set(['formal']),
      label: 'very formal/hapsyoche dialogue',
      strictSingleLine: true,
    };
  }
  if (voice.formality_level === 'formal') {
    return {
      allowed: new Set(['formal', 'polite']),
      label: 'formal or polite dialogue',
      strictSingleLine: false,
    };
  }
  if (voice.formality_level === 'casual') {
    return {
      allowed: new Set(['casual']),
      label: 'casual/haeche dialogue',
      strictSingleLine: false,
    };
  }
  if (voice.formality_level === 'very_casual') {
    return {
      allowed: new Set(['casual']),
      label: 'very casual/haeche dialogue',
      strictSingleLine: true,
    };
  }

  const speechPattern = `${voice.speech_pattern ?? ''} ${voice.tone ?? ''}`.toLowerCase();
  if (/(격식|합쇼|하십시오|합니다|공식|딱딱|정중)/u.test(speechPattern)) {
    return {
      allowed: new Set(['formal', 'polite']),
      label: 'formal or polite dialogue from speech_pattern',
      strictSingleLine: false,
    };
  }
  if (/(존댓말|존대|해요|공손)/u.test(speechPattern)) {
    return {
      allowed: new Set(['formal', 'polite']),
      label: 'polite dialogue from speech_pattern',
      strictSingleLine: false,
    };
  }
  if (/(반말|해체|캐주얼|편한|친근|거친|툭툭)/u.test(speechPattern)) {
    return {
      allowed: new Set(['casual']),
      label: 'casual dialogue from speech_pattern',
      strictSingleLine: false,
    };
  }

  return undefined;
}

function summarizeObservedRegisters(dialogues: string[]): string {
  const counts = new Map<string, number>();
  for (const dialogue of dialogues) {
    const register = dominantDialogueRegister(dialogue);
    counts.set(register, (counts.get(register) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([register, count]) => `${register}=${count}`)
    .join(', ') || 'no detectable register';
}

function isDialogueRegister(value: string): value is 'formal' | 'polite' | 'casual' {
  return value === 'formal' || value === 'polite' || value === 'casual';
}

function extractAttributedManuscriptDialogues(manuscript: string): AttributedManuscriptDialogue[] {
  const attributed: AttributedManuscriptDialogue[] = [];
  const lines = manuscript.split(/\r?\n/u);

  for (const line of lines) {
    if (!/["“”‘’「」『』]/u.test(line)) continue;
    const speaker = extractSpeakerBeforeFirstQuote(line);
    if (!speaker) continue;

    for (const text of extractQuotedDialogues(line)) {
      attributed.push({ speaker, text });
    }
  }

  return attributed;
}

function extractSpeakerBeforeFirstQuote(line: string): string | undefined {
  const beforeQuote = line.split(/["“‘「『]/u)[0] ?? '';
  const speakerMatch = beforeQuote.match(
    /(?:^|\s)([가-힣A-Za-z][가-힣A-Za-z0-9_-]{1,20})(?:가|이|은|는|도|만|께서|에게|와|과)\s/u
  );

  return speakerMatch?.[1]?.trim();
}

function countCrossSpeakerRepeatedDialogues(
  normalizedBySpeaker: Map<string, Set<string>>
): number {
  const speakersByLine = new Map<string, Set<string>>();
  for (const [speaker, lines] of normalizedBySpeaker.entries()) {
    for (const line of lines) {
      if (line.length < 6) continue;
      speakersByLine.set(line, new Set([...(speakersByLine.get(line) ?? []), speaker]));
    }
  }

  return [...speakersByLine.values()].filter(speakers => speakers.size >= 2).length;
}

function buildVoiceSignature(dialogues: string[]): string {
  return [
    dominantDialogueRegister(dialogues),
    averageDialogueLengthBucket(dialogues),
    dialoguePunctuationProfile(dialogues),
    dialogueSentenceEndingProfile(dialogues),
    dialogueResponseTacticProfile(dialogues),
    dialogueDiscourseMarkerProfile(dialogues),
  ].join(':');
}

function dominantDialogueRegister(dialogues: string): string;
function dominantDialogueRegister(dialogues: string[]): string;
function dominantDialogueRegister(dialogues: string | string[]): string {
  const items = Array.isArray(dialogues) ? dialogues : [dialogues];
  const counts = {
    formal: 0,
    polite: 0,
    casual: 0,
  };

  for (const dialogue of items) {
    if (/(습니다|습니까|니다|입니다|합니다|하십시오|겠습니까)/u.test(dialogue)) {
      counts.formal++;
    } else if (/(요|죠|군요|네요|세요)(?:[.!?。！？…]|$)/u.test(dialogue.trim())) {
      counts.polite++;
    } else if (/(야|지|어|아|다|해|돼|마|게|냐|니|거든|겠어|잖아|봐|가|와|말해|넘겨|비켜|열어)(?:[.!?。！？…]|$)/u.test(dialogue.trim())) {
      counts.casual++;
    }
  }

  const ranked = Object.entries(counts).sort((left, right) => right[1] - left[1]);
  return ranked[0]?.[1] === 0 ? 'neutral' : ranked[0][0];
}

function averageDialogueLengthBucket(dialogues: string[]): string {
  const averageLength =
    dialogues.reduce((sum, dialogue) => sum + normalizeText(dialogue).length, 0) /
    Math.max(1, dialogues.length);

  if (averageLength < 14) return 'short';
  if (averageLength < 36) return 'medium';
  return 'long';
}

function dialoguePunctuationProfile(dialogues: string[]): string {
  const joined = dialogues.join(' ');
  return [
    /[?？]/u.test(joined) ? 'q' : 'noq',
    /[!！]/u.test(joined) ? 'bang' : 'nobang',
    /(…|\.{3})/u.test(joined) ? 'pause' : 'nopause',
  ].join('-');
}

function dialogueSentenceEndingProfile(dialogues: string[]): string {
  const counts = new Map<string, number>();
  for (const dialogue of dialogues) {
    const trimmed = dialogue.trim();
    const ending =
      /(?:습니다|습니까|니다|입니다|합니다|하십시오|겠습니까)(?:[.!?。！？…]|$)/u.test(trimmed)
        ? 'formal'
        : /(?:요|죠|군요|네요|세요)(?:[.!?。！？…]|$)/u.test(trimmed)
          ? 'polite'
          : /(?:냐|니|습니까|어요|나요|가요)(?:[.!?。！？…]|$)/u.test(trimmed)
            ? 'question-ending'
            : /(?:해|돼|마|말해|넘겨|비켜|열어|봐|가|와)(?:[.!?。！？…]|$)/u.test(trimmed)
              ? 'command-ending'
              : /(?:다|어|아|지|네|거든|겠어|잖아)(?:[.!?。！？…]|$)/u.test(trimmed)
                ? 'casual'
                : 'other';
    counts.set(ending, (counts.get(ending) ?? 0) + 1);
  }

  return topCountLabels(counts, 2).join('+');
}

function dialogueResponseTacticProfile(dialogues: string[]): string {
  const counts = new Map<string, number>();
  for (const dialogue of dialogues) {
    const labels = dialogueResponseTactics(dialogue);
    for (const label of labels) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return topCountLabels(counts, 2).join('+');
}

function dialogueResponseTactics(dialogue: string): string[] {
  const labels: string[] = [];
  if (/[?？]/u.test(dialogue) || /(왜|뭐|무엇|어떻게|언제|누가|어디|입니까|습니까|니|냐)/u.test(dialogue)) {
    labels.push('question');
  }
  if (/(아니|안\s*돼|못\s*(?:해|하|가|넘|믿)|싫|거절|하지\s*마|없어|그건\s*안)/u.test(dialogue)) {
    labels.push('refusal');
  }
  if (/(말해|넘겨|비켜|열어|멈춰|꺼내|보여|기다려|따라와|확인해|봐|가|와|해)(?:[.!?。！？…]|$)/u.test(dialogue)) {
    labels.push('command');
  }
  if (/(안\s*그러면|그러지\s*않으면|위험|끝나|죽|고발|신고|놓치|늦어|사라져|막히)/u.test(dialogue)) {
    labels.push('threat');
  }
  if (/(좋아|알겠|대신|하지만|그래도|그럼|조건)/u.test(dialogue)) {
    labels.push('bargain');
  }
  if (/(아마|글쎄|같|듯|모르|어쩌면|일지도|확실하진)/u.test(dialogue)) {
    labels.push('hedge');
  }
  if (/(기록|로그|번호|파일|증거|패턴|계산|확인|단서|현장|규칙|시각|초\s*단위)/u.test(dialogue)) {
    labels.push('evidence');
  }

  return labels.length > 0 ? labels : ['plain'];
}

function dialogueDiscourseMarkerProfile(dialogues: string[]): string {
  const counts = new Map<string, number>();
  for (const dialogue of dialogues) {
    const markers = dialogue.match(
      /(아니|잠깐|그러니까|그럼|좋아|됐어|봐|들어|대신|하지만|그래도|글쎄|혹시|제발|먼저|일단)/gu
    ) ?? ['no-marker'];
    for (const marker of new Set(markers)) {
      counts.set(marker, (counts.get(marker) ?? 0) + 1);
    }
  }

  return topCountLabels(counts, 2).join('+');
}

function topCountLabels(counts: Map<string, number>, limit: number): string[] {
  if (counts.size === 0) {
    return ['none'];
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([label]) => label);
}

function averageSpeakerDialogueSimilarity(activeSpeakers: Array<[string, string[]]>): number {
  if (activeSpeakers.length < 2) return 0;

  let total = 0;
  let pairs = 0;
  for (let leftIndex = 0; leftIndex < activeSpeakers.length; leftIndex++) {
    for (let rightIndex = leftIndex + 1; rightIndex < activeSpeakers.length; rightIndex++) {
      total += textSimilarity(
        normalizeDialogueForVoice(activeSpeakers[leftIndex][1].join(' ')),
        normalizeDialogueForVoice(activeSpeakers[rightIndex][1].join(' '))
      );
      pairs++;
    }
  }

  return pairs === 0 ? 0 : total / pairs;
}

function normalizeDialogueForVoice(dialogue: string): string {
  return normalizeText(dialogue)
    .replace(/\b(?:네|예|아니|그럼|지금)\b/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function summarizeSpeakerTurns(dialoguesBySpeaker: Map<string, string[]>): string {
  return [...dialoguesBySpeaker.entries()]
    .map(([speaker, dialogues]) => `${speaker}:${dialogues.length}`)
    .join(', ') || 'none';
}

function extractManuscriptDialogues(manuscript: string): string[] {
  return extractQuotedDialogues(manuscript);
}

function extractQuotedDialogues(text: string): string[] {
  const dialogues: string[] = [];
  const patterns = [
    /"([^"]+)"/gu,
    /“([^”]+)”/gu,
    /‘([^’]+)’/gu,
    /「([^」]+)」/gu,
    /『([^』]+)』/gu,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      dialogues.push(match[1].trim());
    }
  }

  return dialogues.filter(dialogue => dialogue.length > 0);
}

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

function splitManuscriptSentences(manuscript: string): string[] {
  return manuscript
    .split(/(?:[.!?。！？]+|\r?\n)+/u)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence && !sentence.startsWith('#'));
}

interface ManuscriptEndingHookAssessment {
  passed: boolean;
  actual: string;
}

function assessManuscriptEndingHook(
  manuscript: string,
  mustClickEnding: string
): ManuscriptEndingHookAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return {
      passed: false,
      actual: 'final sentences=0, ending overlap=false, hook event signals=0, open loop signals=0',
    };
  }

  const finalSentenceCount = Math.min(2, sentences.length);
  const finalWindow = sentences.slice(sentences.length - finalSentenceCount).join(' ');
  const hasEndingOverlap = containsExpectedBeatEvidence(finalWindow, mustClickEnding, 0.3);
  const hookEventSignals = countMatches(
    finalWindow,
    /(새\s*알림|알림이\s*(?:뜨|울|깜박)|깜박|수신자|다음\s*(?:수신자|표적|대상|사건|알림)|번호|기록|연결|드러|밝혀|발견|지목|선택|사라|나타|문자|메시지|전화|문이\s*(?:열|닫)|칼|총|피|죽|실종|미제|정체|비밀|거짓말|배신|목소리|이름)/gu
  );
  const openLoopSignals = countMatches(
    finalWindow,
    /(왜|누가|어떻게|무엇|어디|다음|새|다시|갑자기|그\s*순간|하지만|그러나|\?|？|수신자|표적|미제|실종|비밀|정체|연결|깜박|알림)/gu
  );

  return {
    passed: hasEndingOverlap && hookEventSignals >= 2 && openLoopSignals >= 1,
    actual: `final sentences=${finalSentenceCount}, ending overlap=${hasEndingOverlap}, hook event signals=${hookEventSignals}, open loop signals=${openLoopSignals}`,
  };
}

interface ManuscriptEndingHookReactionAssessment {
  passed: boolean;
  actual: string;
}

interface EndingHookReactionAssessment {
  passed: boolean;
  actual: string;
}

const ENDING_HOOK_BODY_REACTION_PATTERN =
  /(목덜미|목구멍|손바닥|손끝|심장|가슴|숨|입\s*안|혀끝|피부|등골|어깨|볼|귀끝|땀|떨|두근|차갑|뜨겁|얼음|시야|눈앞|무릎|발끝|귓속|쓴맛|비린내|철\s*냄새|멈췄|조였|삼켰)/gu;
const ENDING_HOOK_ACTION_REACTION_PATTERN =
  /(쥐었|쥔|움켜쥐|붙잡|멈췄|멈춰|돌아봤|몸을|손을|눈을|고개|입을|삼켰|눌렀|열었|닫았|달려|뛰쳐|물러|내밀|확인하려|계산|숨을)/gu;
const ENDING_HOOK_DANGER_RESPONSE_PATTERN =
  /(다음\s*(?:수신자|표적|대상|사건)|새\s*(?:알림|예고|위협|표적|대상)|수신자|표적|대상|카운트다운|사망|죽|위험|위기|미제|실종|좁혀|깜박|알림|예고|연결)/gu;

function assessEndingHookReactionStaging(
  finalSceneText: string
): EndingHookReactionAssessment {
  const bodyReactionSignals = countMatches(finalSceneText, ENDING_HOOK_BODY_REACTION_PATTERN);
  const actionReactionSignals = countMatches(
    finalSceneText,
    ENDING_HOOK_ACTION_REACTION_PATTERN
  );
  const dangerResponseSignals = countMatches(
    finalSceneText,
    ENDING_HOOK_DANGER_RESPONSE_PATTERN
  );

  return {
    passed:
      (bodyReactionSignals + actionReactionSignals >= 2 && dangerResponseSignals >= 1) ||
      (bodyReactionSignals >= 1 && actionReactionSignals >= 1),
    actual: `body reaction signals=${bodyReactionSignals}, action reaction signals=${actionReactionSignals}, danger response signals=${dangerResponseSignals}`,
  };
}

function assessManuscriptEndingHookReaction(
  manuscript: string
): ManuscriptEndingHookReactionAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return {
      passed: false,
      actual:
        'final sentences=0, body reaction signals=0, action reaction signals=0, danger response signals=0',
    };
  }

  const finalSentenceCount = Math.min(2, sentences.length);
  const finalWindow = sentences.slice(sentences.length - finalSentenceCount).join(' ');
  const bodyReactionSignals = countMatches(finalWindow, ENDING_HOOK_BODY_REACTION_PATTERN);
  const actionReactionSignals = countMatches(
    finalWindow,
    ENDING_HOOK_ACTION_REACTION_PATTERN
  );
  const dangerResponseSignals = countMatches(finalWindow, ENDING_HOOK_DANGER_RESPONSE_PATTERN);

  return {
    passed:
      (bodyReactionSignals + actionReactionSignals >= 2 && dangerResponseSignals >= 1) ||
      (bodyReactionSignals >= 1 && actionReactionSignals >= 1),
    actual: `final sentences=${finalSentenceCount}, body reaction signals=${bodyReactionSignals}, action reaction signals=${actionReactionSignals}, danger response signals=${dangerResponseSignals}`,
  };
}

interface ManuscriptEndingHookClosureAssessment {
  passed: boolean;
  actual: string;
}

function assessManuscriptEndingHookClosure(
  manuscript: string
): ManuscriptEndingHookClosureAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return {
      passed: false,
      actual: 'final sentences=0, closure signals=0',
    };
  }

  const finalSentenceCount = Math.min(2, sentences.length);
  const finalWindow = sentences.slice(sentences.length - finalSentenceCount).join(' ');
  const closureSignals = countMatches(
    finalWindow,
    /(사건이\s*해결|해결됐|해결되|종결|끝났|끝났다|마무리|정리되|결론|모두\s*(?:밝혀|드러|풀|해결|끝)|범인(?:이|을|의)?\s*(?:밝혀|드러|확인|잡)|같은\s*범인.*(?:밝혀|해결|드러)|정체가\s*(?:밝혀|드러)|답을\s*찾|진실을\s*알|의문이\s*풀|미스터리가\s*풀|안도|안심|더는\s*궁금하지|확인했고)/gu
  );

  return {
    passed: closureSignals === 0,
    actual: `final sentences=${finalSentenceCount}, closure signals=${closureSignals}`,
  };
}

interface ManuscriptEndingHookQuestionSpecificityAssessment {
  passed: boolean;
  actual: string;
}

const MANUSCRIPT_ENDING_OPEN_QUESTION_PATTERN =
  /(왜|어떻게|누가|누구|무엇|뭐|어디|언제|정체|비밀|진실|의문|질문|알\s*수\s*없|모르|배후|범인|\?|？)/u;
const MANUSCRIPT_ENDING_GENERIC_QUESTION_ANCHOR_SET = new Set([
  '진실',
  '의문',
  '질문',
  '이유',
  '의미',
  '사실',
  '모든',
  '전부',
  '범인',
  '배후',
  '정체',
]);

function assessManuscriptEndingHookQuestionSpecificity(
  manuscript: string
): ManuscriptEndingHookQuestionSpecificityAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return {
      passed: false,
      actual: 'final open question candidates=0',
    };
  }

  const finalSentenceCount = Math.min(2, sentences.length);
  const finalStartIndex = sentences.length - finalSentenceCount;
  const finalCandidates = sentences
    .slice(finalStartIndex)
    .map((sentence, offset) => ({
      sentence,
      position: finalStartIndex + offset + 1,
    }))
    .filter(({ sentence }) => MANUSCRIPT_ENDING_OPEN_QUESTION_PATTERN.test(sentence));

  if (finalCandidates.length === 0) {
    return {
      passed: true,
      actual: `final sentences=${finalSentenceCount}, final open question candidates=0`,
    };
  }

  const selected = finalCandidates[finalCandidates.length - 1];
  const specificity = assessSingleManuscriptEndingOpenQuestionSpecificity(
    'manuscript_final_open_loop',
    selected.sentence
  );

  return {
    passed: specificity.passed,
    actual:
      `final sentences=${finalSentenceCount}, final open question candidates=${finalCandidates.length}, ` +
      `selected position=${selected.position}/${sentences.length}; ${specificity.actual}`,
  };
}

function assessSingleManuscriptEndingOpenQuestionSpecificity(
  label: string,
  rawValue: string
): PageTurnQuestionOpennessAssessment {
  const text = rawValue?.trim() ?? '';
  const openSignals = countMatches(text, PAGE_TURN_OPEN_SIGNAL_PATTERN);
  const closureSignals = countMatches(text, PAGE_TURN_CLOSURE_SIGNAL_PATTERN);
  const hasQuestionIntent =
    openSignals > 0 || MANUSCRIPT_ENDING_OPEN_QUESTION_PATTERN.test(text);
  const signals = extractUniquePageTurnQuestionSignals(text);
  const nameLikeAnchors = extractPageTurnNameLikeAnchors(text);
  const allAnchors = [...new Set([...signals, ...nameLikeAnchors])];
  const broadAnchors = allAnchors.filter(signal => PAGE_TURN_BROAD_SIGNAL_SET.has(signal));
  const genericAnchors = allAnchors.filter(signal =>
    MANUSCRIPT_ENDING_GENERIC_QUESTION_ANCHOR_SET.has(signal)
  );
  const specificAnchors = allAnchors.filter(
    signal =>
      !PAGE_TURN_BROAD_SIGNAL_SET.has(signal) &&
      !MANUSCRIPT_ENDING_GENERIC_QUESTION_ANCHOR_SET.has(signal)
  );
  const tooBroad =
    text.length >= 6 && hasQuestionIntent && closureSignals === 0 && specificAnchors.length < 2;

  return {
    passed: !tooBroad,
    actual:
      `${label}: anchors=${allAnchors.length} [${allAnchors.join(', ') || 'none'}], ` +
      `specific=${specificAnchors.length} [${specificAnchors.join(', ') || 'none'}], ` +
      `broad=${broadAnchors.length} [${broadAnchors.join(', ') || 'none'}], ` +
      `generic=${genericAnchors.length} [${genericAnchors.join(', ') || 'none'}], ` +
      `too_broad=${tooBroad}`,
  };
}

interface ManuscriptEndingHookSetupAssessment {
  passed: boolean;
  actual: string;
}

type EndingHookSetupAnchor = 'coordinates' | 'named-location' | 'identity' | 'object';

const ENDING_HOOK_SETUP_ANCHOR_PATTERNS: Array<[EndingHookSetupAnchor, RegExp]> = [
  [
    'coordinates',
    /(좌표|주소|위치\s*반경|위치가\s*(?:좁혀|뜨|나타)|반경)/u,
  ],
  [
    'named-location',
    /(교회|건물|골목|옥상|서버실|기록실|병원|학교|창고|역|터널|계단참)/u,
  ],
  [
    'identity',
    /(어린아이|아이|사진|목소리|녹음|음성|지문|서명|얼굴|형사|내부자|범인|별칭|흉터|가면)/u,
  ],
  [
    'object',
    /(열쇠|카드|지도|봉투|반지|칼|총|문신|배지|가방|USB|명함|도장|봉인)/u,
  ],
];

const ENDING_HOOK_SETUP_STAGING_PATTERN =
  /(봤|보았|발견|확인|읽|기록|찍혀|남아|묻어|흘러|겹치|일치|맞물|가리키|연결|깜박|뜬|울렸|나타|숨기|접힌|찢긴|긁힌|낡은|같은|다시|쥐|열었|눌렀)/gu;

function assessManuscriptEndingHookSetup(
  manuscript: string,
  mustClickEnding: string
): ManuscriptEndingHookSetupAssessment {
  const requiredAnchors = collectEndingHookSetupAnchors(mustClickEnding);
  if (requiredAnchors.size === 0) {
    return {
      passed: true,
      actual: 'specific ending hook anchors=none',
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 3) {
    return {
      passed: false,
      actual:
        `sentences=${sentences.length}, required ending hook anchors=${formatEndingHookSetupAnchors(requiredAnchors)}, ` +
        'setup clue windows=0, setup anchors=none, overlapping anchors=none',
    };
  }

  const finalSentenceCount = Math.min(2, sentences.length);
  const setupSentences = sentences.slice(0, sentences.length - finalSentenceCount);
  const setupAnchors = new Set<EndingHookSetupAnchor>();
  let setupClueWindows = 0;
  let strongestSetupStagingSignals = 0;

  for (let index = 0; index < setupSentences.length; index += 1) {
    const window = setupSentences
      .slice(Math.max(0, index - 1), Math.min(setupSentences.length, index + 2))
      .join(' ');
    const windowAnchors = collectEndingHookSetupAnchors(window);
    const stagingSignals = countMatches(window, ENDING_HOOK_SETUP_STAGING_PATTERN);
    strongestSetupStagingSignals = Math.max(strongestSetupStagingSignals, stagingSignals);

    const windowOverlaps = [...windowAnchors].filter(anchor =>
      requiredAnchors.has(anchor)
    );
    if (windowOverlaps.length > 0 && stagingSignals >= 1) {
      setupClueWindows += 1;
      for (const anchor of windowOverlaps) {
        setupAnchors.add(anchor);
      }
    }
  }

  const overlappingAnchors = [...requiredAnchors].filter(anchor =>
    setupAnchors.has(anchor)
  );

  return {
    passed: overlappingAnchors.length > 0 && setupClueWindows > 0,
    actual:
      `required ending hook anchors=${formatEndingHookSetupAnchors(requiredAnchors)}, ` +
      `setup clue windows=${setupClueWindows}, ` +
      `setup anchors=${formatEndingHookSetupAnchors(setupAnchors)}, ` +
      `overlapping anchors=${overlappingAnchors.join('|') || 'none'}, ` +
      `strongest setup staging signals=${strongestSetupStagingSignals}`,
  };
}

function collectEndingHookSetupAnchors(text: string): Set<EndingHookSetupAnchor> {
  const anchors = new Set<EndingHookSetupAnchor>();
  for (const [anchor, pattern] of ENDING_HOOK_SETUP_ANCHOR_PATTERNS) {
    if (pattern.test(text)) {
      anchors.add(anchor);
    }
  }
  return anchors;
}

function formatEndingHookSetupAnchors(
  anchors: Set<EndingHookSetupAnchor>
): string {
  return [...anchors].sort().join('|') || 'none';
}

interface ManuscriptFairTwistSetupAssessment {
  passed: boolean;
  actual: string;
}

type FairTwistClueFamily = 'number' | 'record' | 'device' | 'identity' | 'object';

const FAIR_TWIST_REVEAL_PATTERN =
  /(정체|범인|배후|배신|진실|실체|공모|내부자|같은\s*(?:번호|파일|계정|로고|목소리|음성|서명|지문|배지)|드러|밝혀|겹치|일치|연결|였다는|였다고|였다)/u;

const FAIR_TWIST_SETUP_STAGING_PATTERN =
  /(봤|보았|발견|줍|쥐|확인|읽|기록|찍혀|남아|묻어|흘러|겹치|일치|맞물|가리키|연결|깜박|뜬|울렸|나타|숨기|접힌|찢긴|긁힌|낡은|같은|다시)/gu;

const FAIR_TWIST_CLUE_FAMILY_PATTERNS: Array<[FairTwistClueFamily, RegExp]> = [
  ['number', /(사건\s*번호|번호|배지|타임스탬프|좌표|주소|계좌|암호|초\s*단위)/u],
  ['record', /(파일|기록|로그|문서|메모|영수증|도장|통화\s*기록)/u],
  ['device', /(앱\s*로고|로고|계정|알림|휴대폰|화면|수신자|문자|메시지|전화|앱)/u],
  ['identity', /(목소리|녹음|음성|서명|사진|지문|흉터|표식|얼굴|형사)/u],
  ['object', /(상처|피|유리|열쇠|카드|지도|가방|반지|칼|총|문신)/u],
];

function assessManuscriptFairTwistSetup(
  manuscript: string
): ManuscriptFairTwistSetupAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 3) {
    return {
      passed: true,
      actual: `fair twist check skipped: sentences=${sentences.length}`,
    };
  }

  const finalSentenceCount = Math.min(2, sentences.length);
  const setupSentences = sentences.slice(0, sentences.length - finalSentenceCount);
  const finalSentences = sentences.slice(sentences.length - finalSentenceCount);
  const revealSentences = finalSentences.filter(sentence =>
    FAIR_TWIST_REVEAL_PATTERN.test(sentence)
  );

  if (revealSentences.length === 0) {
    return {
      passed: true,
      actual: `final sentences=${finalSentenceCount}, reveal sentences=0`,
    };
  }

  const finalRevealText = revealSentences.join(' ');
  const finalClueFamilies = collectFairTwistClueFamilies(finalRevealText);
  const setupClueFamilies = new Set<FairTwistClueFamily>();
  let setupClueWindows = 0;
  let strongestSetupStagingSignals = 0;

  for (let index = 0; index < setupSentences.length; index += 1) {
    const window = setupSentences
      .slice(Math.max(0, index - 1), Math.min(setupSentences.length, index + 2))
      .join(' ');
    const windowFamilies = collectFairTwistClueFamilies(window);
    const stagingSignals = countMatches(window, FAIR_TWIST_SETUP_STAGING_PATTERN);
    strongestSetupStagingSignals = Math.max(strongestSetupStagingSignals, stagingSignals);

    if (windowFamilies.size > 0 && stagingSignals >= 1) {
      setupClueWindows += 1;
      for (const family of windowFamilies) {
        setupClueFamilies.add(family);
      }
    }
  }

  const overlappingFamilies = [...finalClueFamilies].filter(family =>
    setupClueFamilies.has(family)
  );
  const identityRevealRequiresIdentitySetup =
    finalClueFamilies.has('identity') &&
    /(정체|범인|배후|배신|공모|내부자|였다는|였다고|였다|목소리|녹음|음성|지문|서명|배지|형사)/u.test(
      finalRevealText
    );
  const requiredFamilies = identityRevealRequiresIdentitySetup
    ? overlappingFamilies.filter(family => family === 'identity')
    : overlappingFamilies;

  return {
    passed:
      finalClueFamilies.size > 0 &&
      setupClueWindows > 0 &&
      requiredFamilies.length > 0,
    actual:
      `final sentences=${finalSentenceCount}, reveal sentences=${revealSentences.length}, ` +
      `final clue families=${formatFairTwistFamilies(finalClueFamilies)}, ` +
      `setup clue windows=${setupClueWindows}, ` +
      `setup clue families=${formatFairTwistFamilies(setupClueFamilies)}, ` +
      `overlapping families=${overlappingFamilies.join('|') || 'none'}, ` +
      `identity reveal=${identityRevealRequiresIdentitySetup}, ` +
      `strongest setup staging signals=${strongestSetupStagingSignals}`,
  };
}

function collectFairTwistClueFamilies(text: string): Set<FairTwistClueFamily> {
  const families = new Set<FairTwistClueFamily>();
  for (const [family, pattern] of FAIR_TWIST_CLUE_FAMILY_PATTERNS) {
    if (pattern.test(text)) {
      families.add(family);
    }
  }
  return families;
}

function formatFairTwistFamilies(families: Set<FairTwistClueFamily>): string {
  return [...families].sort().join('|') || 'none';
}

interface ManuscriptForecastRevisionAssessment {
  passed: boolean;
  actual: string;
}

const FORECAST_PROMISE_PATTERN =
  /((?:예상|예측|오판|착각|가설|추정|뜻|의미|해석|재해석)[^.!?。！？\n]{0,40}(?:뒤집|빗나|깨|어긋|수정|좁혀|바뀌|반전)|반전[^.!?。！？\n]{0,40}(?:예상|예측|오판|착각|가설|재해석|뜻|의미|후보|용의자|알리바이|정체|배후)|예상과\s*달리|알고\s*보니|사실은|정반대)/u;
const FORECAST_SETUP_PATTERN =
  /(예상|예측|짐작|가설|추정|단정|확신|믿었|믿고|믿는|생각했|생각하|착각|오판|의심|알리바이|용의자|범인이라고|배후라고|정체라고|독자는|그는[^.!?。！？]{0,80}(?:라고|라며)[^.!?。！？]{0,40}(?:믿|생각|단정|의심))/u;
const FORECAST_REVERSAL_PATTERN =
  /(하지만|그러나|알고\s*보니|사실은|사실|실은|예상과\s*달리|예측과\s*달리|오히려|정반대|뒤집|뒤집혔|반전|빗나|어긋|틀렸|거짓|함정|위장|정체|배후|드러났|밝혀|폭로|뜻이\s*바뀌|의미가\s*바뀌|재해석)/u;
const FORECAST_REVISION_PATTERN =
  /(가설(?:을|이)?\s*(?:바꾸|수정|접|좁히|좁혀|다시\s*세우|새로\s*세우)|예상(?:을)?\s*(?:바꾸|수정|접)|예측(?:을)?\s*(?:바꾸|수정|접)|의심(?:이|을)?\s*(?:옮|좁히|좁혀|바꾸|바뀌)|용의자[^.!?。！？]{0,60}(?:제외|승격|바꾸|바뀌|좁혀|후보)|단서[^.!?。！？]{0,80}(?:다시|새로|재해석|뜻|의미|가리키|좁혀)|의미(?:가|를)?\s*(?:바뀌|뒤집|다시)|해석(?:을)?\s*(?:바꾸|뒤집|다시)|계획(?:을)?\s*(?:바꾸|수정|접)|다음\s*(?:검증|행동|추적|확인)|새\s*(?:가설|의심|단서|증거|표적|위협)|후보(?:로|를)|공범\s*후보|내부자\s*후보|추적지(?:가|를)?\s*(?:바뀌|바꾸))/u;
const FORECAST_ANCHOR_PATTERN =
  /(단서|기록|로그|파일|번호|로고|알림|휴대폰|화면|사진|녹음|목소리|서명|지문|배지|계정|알리바이|용의자|범인|배후|정체|조력자|내부자|공범|수신자|표적|사건|피해자|현장|좌표|주소|규칙|패턴)/gu;
const FORECAST_REVISION_NEGATION_PATTERN =
  /(가설(?:을)?\s*바꾸지|예상(?:을)?\s*바꾸지|예측(?:을)?\s*바꾸지|해석(?:을)?\s*바꾸지|계획(?:을)?\s*바꾸지|의심(?:을)?\s*옮기지|그저\s*놀랐|그냥\s*놀랐|아무것도\s*달라지지|달라지는\s*것은\s*없|변하지\s*않|바뀌지\s*않)/gu;

function assessManuscriptForecastRevision(
  manuscript: string,
  promise: ReaderPromiseContract,
  chapter: ChapterWithReaderExperience
): ManuscriptForecastRevisionAssessment {
  const expectedText = chapterToForecastRevisionExpectationText(promise, chapter);
  const expectsForecastRevision = FORECAST_PROMISE_PATTERN.test(expectedText);
  const proseNamesForecastRevision = FORECAST_PROMISE_PATTERN.test(manuscript);

  if (!expectsForecastRevision && !proseNamesForecastRevision) {
    return {
      passed: true,
      actual: 'forecast revision check skipped: no reversal or prediction-revision promise',
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 3) {
    return {
      passed: false,
      actual:
        `expected forecast promise=${expectsForecastRevision}, prose forecast claim=${proseNamesForecastRevision}, ` +
        `sentences=${sentences.length}, forecast windows=0, revised windows=0`,
    };
  }

  let setupWindows = 0;
  let forecastWindows = 0;
  let revisedWindows = 0;
  let strongestReversalSignals = 0;
  let strongestRevisionSignals = 0;
  let strongestAnchorSignals = 0;
  let negatedRevisions = 0;

  for (let index = 0; index < sentences.length; index += 1) {
    const setupWindow = sentences
      .slice(Math.max(0, index - 1), Math.min(sentences.length, index + 2))
      .join(' ');
    if (!FORECAST_SETUP_PATTERN.test(setupWindow)) {
      continue;
    }

    setupWindows += 1;
    const reversalWindow = sentences
      .slice(index, Math.min(sentences.length, index + 4))
      .join(' ');
    const reversalSignals = FORECAST_REVERSAL_PATTERN.test(reversalWindow) ? 1 : 0;
    strongestReversalSignals = Math.max(strongestReversalSignals, reversalSignals);
    if (reversalSignals === 0) {
      continue;
    }

    forecastWindows += 1;
    const aftermath = sentences
      .slice(index + 1, Math.min(sentences.length, index + 6))
      .join(' ');
    const revisionSignals = FORECAST_REVISION_PATTERN.test(aftermath) ? 1 : 0;
    const anchorSignals = countMatches(`${reversalWindow} ${aftermath}`, FORECAST_ANCHOR_PATTERN);
    const negationSignals = countMatches(aftermath, FORECAST_REVISION_NEGATION_PATTERN);

    strongestRevisionSignals = Math.max(strongestRevisionSignals, revisionSignals);
    strongestAnchorSignals = Math.max(strongestAnchorSignals, anchorSignals);
    negatedRevisions += negationSignals;

    if (revisionSignals > 0 && anchorSignals >= 2 && negationSignals === 0) {
      revisedWindows += 1;
    }
  }

  return {
    passed: forecastWindows > 0 && revisedWindows > 0 && negatedRevisions === 0,
    actual:
      `expected forecast promise=${expectsForecastRevision}, prose forecast claim=${proseNamesForecastRevision}, ` +
      `setup windows=${setupWindows}, forecast reversal windows=${forecastWindows}, ` +
      `revised forecast windows=${revisedWindows}, strongest reversal signals=${strongestReversalSignals}, ` +
      `strongest revision signals=${strongestRevisionSignals}, strongest anchor signals=${strongestAnchorSignals}, ` +
      `negated revisions=${negatedRevisions}, expectation="${abbreviateEvidence(expectedText, 260)}"`,
  };
}

function chapterToForecastRevisionExpectationText(
  promise: ReaderPromiseContract,
  chapter: ChapterWithReaderExperience
): string {
  return [
    promise.novelty_angle,
    promise.emotional_payoff,
    chapter.reader_experience?.chapter_reward,
    chapter.reader_experience?.page_turner_question,
    chapter.reader_experience?.must_click_ending,
    chapter.narrative_elements?.foreshadowing_payoff?.join(' '),
    chapter.narrative_elements?.hooks_reveal?.join(' '),
    chapterToSceneEvidenceText(chapter),
  ]
    .filter(Boolean)
    .join(' ');
}

interface ManuscriptProtagonistAgencyAssessment {
  passed: boolean;
  actual: string;
}

function assessManuscriptProtagonistAgency(
  manuscript: string
): ManuscriptProtagonistAgencyAssessment {
  const prose = normalizeText(manuscript);
  const agencySignals = countMatches(
    prose,
    /(직접|스스로|선택|결정|결심|감수|맞서|거절|공개|추적|계산|신고|뛰쳐|달려|붙잡|구하|찾으려|향했|열었|눌렀|쥐었|밝히|드러내)/gu
  );
  const costSignals = countMatches(
    prose,
    /(위험(?:을)?\s*감수|대가|비용|잃|잃을|포기|희생|다치|쫓기|실패|약점|불리|책임|벌|상처|의심|드러내|공개|제한\s*시간|통제선)/gu
  );
  const passiveSignals = countMatches(
    prose,
    /(떠밀려|시키는대로|지시받|밀어붙|보고서|적혀|설명|전달받|안내받|끌려|따라갔|따라나섰)/gu
  );

  const passed = agencySignals >= 2 && costSignals >= 1 && passiveSignals < 3;

  return {
    passed,
    actual: `agency signals=${agencySignals}, cost signals=${costSignals}, passive signals=${passiveSignals}`,
  };
}

interface ManuscriptChoiceTradeoffAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptChoiceCostCarryoverAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptChoiceCostLockAssessment {
  passed: boolean;
  actual: string;
}

const CHOICE_TRADEOFF_DOUBLE_OPTION_PATTERN =
  /(?:할지|갈지|넘길지|버릴지|구할지|살릴지|숨길지|공개할지|신고할지|돌아설지|지킬지|말지)[^.!?。！？\n]{0,80}(?:할지|갈지|넘길지|버릴지|구할지|살릴지|숨길지|공개할지|신고할지|돌아설지|지킬지|말지)/u;
const CHOICE_TRADEOFF_EXPLICIT_OPTION_PATTERN =
  /(사이에서|사이에|둘\s*중|양자택일|택해야|선택해야|고를\s*수\s*없|갈등한다)/u;
const CHOICE_TRADEOFF_SACRIFICE_PATTERN =
  /(?:대신|포기하고|버리고|내주고|잃더라도|희생하고)[^.!?。！？\n]{0,60}(?:택|선택|결정|구하|향하|뛰쳐|열|쥐|막|공개|숨기|신고|추적|붙잡|달려)/u;
const CHOICE_TRADEOFF_ACTION_PATTERN =
  /(선택|결정|결심|택하|고르|직접|감수|뛰쳐|달려|구하|찾으려|향했|추적|막으|신고|공개|숨기|붙잡|열었|눌렀|쥐었|계산)/gu;
const CHOICE_TRADEOFF_COST_PATTERN =
  /(위험(?:을)?\s*감수|대가|비용|잃|잃을|포기|희생|다치|실패|약점|불리|책임|상처|의심|드러내|공개|숨기|제한\s*시간|통제선|사망|죽|늦|놓치|버리)/gu;
const CHOICE_COST_SACRIFICE_PATTERN =
  /(?:(?:신고\s*기록|알리바이|증거|단서|시간|기회|대안|선택지|관계|신뢰|정체|약점|통로|문|도주로)[^.!?。！？\n]{0,50}(?:포기|버리|내주|잃|희생)|(?:포기|버리|내주|잃더라도|희생|대신)[^.!?。！？\n]{0,80}(?:선택|결정|택|달려|뛰쳐|향했|공개|숨기|구하|추적|막아|확인))/u;
const CHOICE_COST_ANCHOR_PATTERN =
  /(경찰|신고|알리바이|기록|증거|단서|시간|기한|기회|대안|선택지|문|통로|도주로|관계|신뢰|정체|약점|현장|피해자|휴대폰|로그|파일|통제선|범인|표적|조력자|가족|이름|수신자|카운트다운)/gu;
const CHOICE_COST_CARRYOVER_PATTERN =
  /(?:대가로|그\s*대가로|그래서|결국|직후|이후|이어|그\s*결과|여파로|때문에|탓에|바람에|남은|남긴|포기한|잃은|버린)[^.!?。！？\n]{0,120}(?:막혔|닫혔|잠겼|차단|의심|추궁|체포|발각|노출|고립|오해|빼앗|사라|줄었|좁혀|표적|위협|선택지|대안|돌아갈\s*수\s*없|되돌릴\s*수\s*없|갈\s*수\s*없|불리|압박|막았다|증거가\s*사라|기한이\s*줄|통로가\s*막)/gu;
const CHOICE_COST_CARRYOVER_NEGATION_PATTERN =
  /(?:아무\s*(?:장벽|문제|압박|제약)(?:이|도)?\s*되지\s*않|문제\s*삼지\s*않|장벽이\s*되지\s*않|제약이\s*되지\s*않|상관없|영향이\s*없|선택지[^.!?。！？\n]{0,35}좁히지\s*않|원래처럼|그대로)/gu;
const CHOICE_COST_LOCK_DOMAIN_PATTERN =
  /(선택지|대안|관계|신뢰|증거|단서|시간|기한|경로|통로|문|도주로|신고|알리바이|기록|정체|약점|수신자|표적|현장|파일|휴대폰|조력자|경찰|제보자)/u;
const CHOICE_COST_LOCK_STATE_PATTERN =
  /(닫히|닫혔|잠기|잠겼|차단|봉쇄|사라|빼앗|잃었|줄었|좁혀|끊겼|노출|발각|고립|확정|고정|불가능|막히|막혔|돌아갈\s*수\s*없|되돌릴\s*수\s*없|돌이킬\s*수\s*없|회복할\s*수\s*없)/u;
const CHOICE_COST_LOCK_CONNECTOR_PATTERN =
  /(대가로|그\s*대가로|그래서|결국|직후|이후|이어|그\s*결과|여파로|때문에|탓에|바람에|남은|남긴|포기한|잃은|버린|닫히자|잠기자|사라지자|차단되자|노출되자|발각되자)/u;
const CHOICE_COST_LOCK_NEGATION_PATTERN =
  /(상관없|영향이\s*없|원래처럼|그대로|회복되|해결되|문제\s*없|되돌릴\s*수\s*있|다시\s*(?:열|찾|돌아|복구))/u;

function assessManuscriptChoiceTradeoff(
  manuscript: string
): ManuscriptChoiceTradeoffAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  const prose = normalizeText(manuscript);
  let tradeoffWindows = 0;

  for (let index = 0; index < sentences.length; index++) {
    const window = sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ');
    if (
      CHOICE_TRADEOFF_DOUBLE_OPTION_PATTERN.test(window) ||
      CHOICE_TRADEOFF_EXPLICIT_OPTION_PATTERN.test(window) ||
      CHOICE_TRADEOFF_SACRIFICE_PATTERN.test(window)
    ) {
      tradeoffWindows += 1;
    }
  }

  const actionSignals = countMatches(prose, CHOICE_TRADEOFF_ACTION_PATTERN);
  const costSignals = countMatches(prose, CHOICE_TRADEOFF_COST_PATTERN);

  return {
    passed: tradeoffWindows >= 1 && actionSignals >= 2 && costSignals >= 1,
    actual: `choice tradeoff windows=${tradeoffWindows}, action signals=${actionSignals}, cost signals=${costSignals}`,
  };
}

function assessManuscriptChoiceCostCarryover(
  manuscript: string
): ManuscriptChoiceCostCarryoverAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  let sacrificeWindows = 0;
  let carriedWindows = 0;
  let strongestSharedAnchors = 0;
  let strongestCarryoverSignals = 0;
  let negatedCarryovers = 0;

  for (let index = 0; index < sentences.length; index++) {
    const choiceWindow = sentences
      .slice(index, Math.min(sentences.length, index + 2))
      .join(' ');
    if (!CHOICE_COST_SACRIFICE_PATTERN.test(choiceWindow)) {
      continue;
    }

    const actionSignals = countMatches(choiceWindow, CHOICE_TRADEOFF_ACTION_PATTERN);
    if (actionSignals === 0) {
      continue;
    }

    sacrificeWindows += 1;
    const aftermath = sentences
      .slice(index + 2, Math.min(sentences.length, index + 5))
      .join(' ');
    const sharedAnchors = countSharedChoiceCostAnchors(choiceWindow, aftermath);
    const carryoverSignals = countMatches(aftermath, CHOICE_COST_CARRYOVER_PATTERN);
    const negationSignals = countMatches(
      aftermath,
      CHOICE_COST_CARRYOVER_NEGATION_PATTERN
    );

    strongestSharedAnchors = Math.max(strongestSharedAnchors, sharedAnchors);
    strongestCarryoverSignals = Math.max(strongestCarryoverSignals, carryoverSignals);
    negatedCarryovers += negationSignals;

    if (sharedAnchors > 0 && carryoverSignals > 0 && negationSignals === 0) {
      carriedWindows += 1;
    }
  }

  return {
    passed: sacrificeWindows === 0 || carriedWindows === sacrificeWindows,
    actual:
      `choice cost sacrifice windows=${sacrificeWindows}, carried cost windows=${carriedWindows}, ` +
      `strongest shared anchors=${strongestSharedAnchors}, strongest carryover signals=${strongestCarryoverSignals}, negated carryovers=${negatedCarryovers}`,
  };
}

function assessManuscriptChoiceCostLock(
  manuscript: string
): ManuscriptChoiceCostLockAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  let choiceWindows = 0;
  let lockedWindows = 0;
  let strongestSharedAnchors = 0;
  let strongestLockSignals = 0;
  let negatedLocks = 0;

  for (let index = 0; index < sentences.length; index++) {
    const choiceWindow = sentences
      .slice(index, Math.min(sentences.length, index + 2))
      .join(' ');
    const hasChoice =
      CHOICE_TRADEOFF_DOUBLE_OPTION_PATTERN.test(choiceWindow) ||
      CHOICE_TRADEOFF_EXPLICIT_OPTION_PATTERN.test(choiceWindow) ||
      CHOICE_TRADEOFF_SACRIFICE_PATTERN.test(choiceWindow) ||
      CHOICE_COST_SACRIFICE_PATTERN.test(choiceWindow);
    const actionSignals = countMatches(choiceWindow, CHOICE_TRADEOFF_ACTION_PATTERN);
    const costSignals = countMatches(choiceWindow, CHOICE_TRADEOFF_COST_PATTERN);

    if (!hasChoice || actionSignals === 0 || costSignals === 0) {
      continue;
    }

    choiceWindows += 1;
    const lockWindow = sentences
      .slice(index, Math.min(sentences.length, index + 5))
      .join(' ');
    const sharedAnchors = countSharedChoiceCostAnchors(choiceWindow, lockWindow);
    const lockSignals = countChoiceCostLockSignals(lockWindow);
    const negationSignals = CHOICE_COST_LOCK_NEGATION_PATTERN.test(lockWindow) ? 1 : 0;

    strongestSharedAnchors = Math.max(strongestSharedAnchors, sharedAnchors);
    strongestLockSignals = Math.max(strongestLockSignals, lockSignals);
    negatedLocks += negationSignals;

    if (sharedAnchors > 0 && lockSignals > 0 && negationSignals === 0) {
      lockedWindows += 1;
    }
  }

  return {
    passed: choiceWindows > 0 && lockedWindows > 0,
    actual:
      `choice-cost lock windows=${lockedWindows}/${choiceWindows}, ` +
      `strongest shared anchors=${strongestSharedAnchors}, strongest lock signals=${strongestLockSignals}, negated locks=${negatedLocks}`,
  };
}

function countChoiceCostLockSignals(text: string): number {
  const sentences = splitManuscriptSentences(text);
  let lockSignals = 0;

  for (const sentence of sentences) {
    const hasDomain = CHOICE_COST_LOCK_DOMAIN_PATTERN.test(sentence);
    const hasLockState = CHOICE_COST_LOCK_STATE_PATTERN.test(sentence);
    const hasConnector = CHOICE_COST_LOCK_CONNECTOR_PATTERN.test(sentence);
    if (hasDomain && hasLockState && hasConnector) {
      lockSignals += 1;
    }
  }

  return lockSignals;
}

function countSharedChoiceCostAnchors(left: string, right: string): number {
  if (!right.trim()) {
    return 0;
  }

  const leftAnchors = new Set(left.match(CHOICE_COST_ANCHOR_PATTERN) ?? []);
  const rightAnchors = new Set(right.match(CHOICE_COST_ANCHOR_PATTERN) ?? []);
  let shared = 0;

  for (const anchor of leftAnchors) {
    if (rightAnchors.has(anchor)) {
      shared += 1;
    }
  }

  return shared;
}

interface ManuscriptPressureAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptTemporalPressureAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptTacticalAdaptationAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptActiveOppositionAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptStakesClarityAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptStakesSubjectSpecificityAssessment {
  passed: boolean;
  actual: string;
}

const STAKES_ACTION_OR_PRESSURE_PATTERN =
  /(선택|결정|결심|계산|뛰쳐|달려|구하|찾으려|향했|현장|제한\s*시간|카운트다운|통제선|조명|꺼졌|위험|감수|신고|막으|추적|공개|붙잡|쥐었|눌렀|열었)/u;
const STAKES_CONCRETE_SUBJECT_PATTERN =
  /(피해자|조력자|가족|동생|어머니|아버지|아이|친구|연인|목숨|생명|죽음|사망|실종|정체|약점|첫\s*수신자|다음\s*수신자|표적|사람의\s*목숨|타인의\s*죽음)/u;
const STAKES_THREAT_OR_LOSS_PATTERN =
  /(구하|막지\s*못|죽|사망|죽음|실종|잃|잃을|놓치|다치|위험|대가|희생|발각|노출|드러|공개|약점|표적|수신자|되돌릴\s*수\s*없|돌이킬\s*수\s*없|회복할\s*수\s*없|실패|늦)/u;

function assessManuscriptStakesClarity(
  manuscript: string
): ManuscriptStakesClarityAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return {
      passed: false,
      actual: 'evaluable windows=0, stakes clarity windows=0',
    };
  }

  const evaluableSentenceCount = Math.max(1, sentences.length - 2);
  let actionPressureWindows = 0;
  let concreteSubjectWindows = 0;
  let threatLossWindows = 0;
  let stakesClarityWindows = 0;

  for (let index = 0; index < evaluableSentenceCount; index++) {
    const window = sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ');
    const hasActionPressure = STAKES_ACTION_OR_PRESSURE_PATTERN.test(window);
    const hasConcreteSubject = STAKES_CONCRETE_SUBJECT_PATTERN.test(window);
    const hasThreatLoss = STAKES_THREAT_OR_LOSS_PATTERN.test(window);

    if (hasActionPressure) actionPressureWindows += 1;
    if (hasConcreteSubject) concreteSubjectWindows += 1;
    if (hasThreatLoss) threatLossWindows += 1;
    if (hasActionPressure && hasConcreteSubject && hasThreatLoss) {
      stakesClarityWindows += 1;
    }
  }

  return {
    passed: stakesClarityWindows >= 1,
    actual: `evaluable windows=${evaluableSentenceCount}, stakes clarity windows=${stakesClarityWindows}, action/pressure windows=${actionPressureWindows}, concrete subject windows=${concreteSubjectWindows}, threat/loss windows=${threatLossWindows}`,
  };
}

const GENERIC_STAKES_SUBJECT_PATTERN =
  /(피해자|표적|대상|수신자|사망자|실종자|목격자|시신|시체|사람의\s*목숨|타인의\s*죽음)/u;
const STAKES_SUBJECT_THREAT_PATTERN =
  /(구하|구하려|살리|살려|지키|보호|찾으려|찾아|죽|사망|살인|실종|납치|잃|잃을|놓치|놓칠|위험|표적|다치|피해|늦|되돌릴\s*수\s*없|돌이킬\s*수\s*없)/u;
const STAKES_SUBJECT_PERSONAL_ANCHOR_PATTERN =
  /(가족|동생|어머니|아버지|아이|친구|연인|딸|아들|조력자|동료|선배|후배|학생|간호사|의사|기자|경비원|운전기사|교사|동창|이웃|이름|명찰|신분증|학생증|사진|목소리|통화|녹음|문자|메시지|메모|일기|흉터|팔찌|반지|교복|유니폼|주소|방\s*번호|좌석\s*번호|사건\s*번호|파일\s*번호|휴대폰|마지막\s*말|유서|혈흔|지문|머리핀|열쇠|주인공\s*이름|첫\s*수신자|다음\s*수신자)/u;
const STAKES_SUBJECT_NAMED_LABEL_PATTERN =
  /[가-힣]{2,4}(?:라는|라던|란|이라고\s*불린)\s*(?:피해자|표적|대상|수신자|사람|목격자|실종자)/u;
const STAKES_SUBJECT_QUOTED_TRACE_PATTERN =
  /["'“”‘’][^"'“”‘’]{2,60}["'“”‘’]/u;

function assessManuscriptStakesSubjectSpecificity(
  manuscript: string
): ManuscriptStakesSubjectSpecificityAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 3) {
    return {
      passed: true,
      actual: `stakes subject specificity check skipped: sentences=${sentences.length}`,
    };
  }

  let genericThreatWindows = 0;
  let personalizedThreatWindows = 0;
  let personalAnchorWindows = 0;
  let namedLabelWindows = 0;
  let quotedTraceWindows = 0;
  let firstGenericThreatPersonalized = false;

  for (let index = 0; index < sentences.length; index++) {
    const window = sentences
      .slice(index, Math.min(sentences.length, index + 3))
      .join(' ');
    const hasGenericSubject = GENERIC_STAKES_SUBJECT_PATTERN.test(window);
    const hasThreat = STAKES_SUBJECT_THREAT_PATTERN.test(window);

    if (!hasGenericSubject || !hasThreat) {
      continue;
    }

    const hasPersonalAnchor = STAKES_SUBJECT_PERSONAL_ANCHOR_PATTERN.test(window);
    const hasNamedLabel = STAKES_SUBJECT_NAMED_LABEL_PATTERN.test(window);
    const hasQuotedTrace = STAKES_SUBJECT_QUOTED_TRACE_PATTERN.test(window);
    const isPersonalized = hasPersonalAnchor || hasNamedLabel || hasQuotedTrace;

    if (genericThreatWindows === 0) {
      firstGenericThreatPersonalized = isPersonalized;
    }

    genericThreatWindows += 1;

    if (hasPersonalAnchor) personalAnchorWindows += 1;
    if (hasNamedLabel) namedLabelWindows += 1;
    if (hasQuotedTrace) quotedTraceWindows += 1;
    if (isPersonalized) {
      personalizedThreatWindows += 1;
    }
  }

  return {
    passed: genericThreatWindows === 0 || firstGenericThreatPersonalized,
    actual:
      `generic threat windows=${genericThreatWindows}, personalized threat windows=${personalizedThreatWindows}, ` +
      `first generic threat personalized=${firstGenericThreatPersonalized}, personal anchors=${personalAnchorWindows}, ` +
      `named-label anchors=${namedLabelWindows}, quoted traces=${quotedTraceWindows}`,
  };
}

const ACTIVE_OPPOSITION_ACTOR_PATTERN =
  /(범인|살인자|가해자|협박범|추적자|감시자|조작자|개발자|관리자|내부자|경찰\s*내부|조직|상대|누군가|익명의|알\s*수\s*없는|그들|예고\s*앱|앱이|시스템이)/u;
const ACTIVE_OPPOSITION_INTENT_PATTERN =
  /(막|가로막|차단|잠그|잠갔|끄|꺼뜨|꺼트|조작|삭제|지웠|숨기|빼앗|유인|협박|위협|쫓|추격|공격|붙잡|밀쳐|속이|거짓|함정|표적|노렸|겨눴|감시|기록을\s*바꿨|알림을\s*보냈|이름을\s*올렸)/u;
const ACTIVE_OPPOSITION_PRESSURE_PATTERN =
  /(제한\s*시간|카운트다운|통제선|조명|문|엘리베이터|현장|주소|로그|휴대폰|증거|피해자|표적|수신자|알림)/u;

function assessManuscriptActiveOpposition(
  manuscript: string
): ManuscriptActiveOppositionAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return {
      passed: false,
      actual: 'evaluable windows=0, active opposition windows=0',
    };
  }

  const evaluableSentenceCount = Math.max(1, sentences.length - 2);
  let actorWindows = 0;
  let intentWindows = 0;
  let pressureWindows = 0;
  let activeOppositionWindows = 0;

  for (let index = 0; index < evaluableSentenceCount; index++) {
    const window = sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ');
    const hasActor = ACTIVE_OPPOSITION_ACTOR_PATTERN.test(window);
    const hasIntent = ACTIVE_OPPOSITION_INTENT_PATTERN.test(window);
    const hasPressure = ACTIVE_OPPOSITION_PRESSURE_PATTERN.test(window);

    if (hasActor) actorWindows += 1;
    if (hasIntent) intentWindows += 1;
    if (hasPressure) pressureWindows += 1;
    if (hasActor && hasIntent && hasPressure) {
      activeOppositionWindows += 1;
    }
  }

  return {
    passed: activeOppositionWindows >= 1,
    actual: `evaluable windows=${evaluableSentenceCount}, active opposition windows=${activeOppositionWindows}, actor windows=${actorWindows}, intent/action windows=${intentWindows}, pressure-context windows=${pressureWindows}`,
  };
}

function assessManuscriptPressure(manuscript: string): ManuscriptPressureAssessment {
  const prose = normalizeText(manuscript);
  const pressureSignals = countMatches(
    prose,
    /(제한\s*시간|카운트다운|초(?:가|는|밖에)?|분(?:밖에|뒤|안에)?|위기|위험|사망|피해자|죽|예고|표적|대상|현장|통제선|긴장|알림)/gu
  );
  const obstacleSignals = countMatches(
    prose,
    /(조명이\s*꺼|형광등이\s*꺼|불이\s*꺼|꺼졌|꺼지|닫혔|닫히|잠겼|막혔|막아|가로막|차단|통제선|붙잡|밀쳐|쫓|추격|공격|칼|총|피가|피를|피로|쓰러진|비상등|경보|카운트다운|절반을\s*잃|반경|좁혀|문이\s*닫|엘리베이터가\s*멈)/gu
  );
  const reversalSignals = countMatches(
    prose,
    /(하지만|그러나|그\s*순간|갑자기|픽\s*하고\s*꺼|되돌릴\s*수\s*없|실패가\s*상황|잃은\s*뒤)/gu
  );

  const passed = pressureSignals >= 2 && obstacleSignals >= 1 && reversalSignals >= 1;

  return {
    passed,
    actual: `pressure signals=${pressureSignals}, obstacle signals=${obstacleSignals}, reversal signals=${reversalSignals}`,
  };
}

const TEMPORAL_PRESSURE_MARKER_PATTERN =
  /(제한\s*시간|카운트다운|남은\s*(?:시간|분|초)|\d+\s*(?:분|초)\s*(?:안에|밖에|남|뒤|전)|마감|기한|시한|타임\s*리미트|늦기\s*전|도착\s*시간|사망\s*시각|초\s*단위|분\s*단위|시간(?:이)?\s*(?:줄|줄어|줄어들|남지|없|모자라))/u;
const TEMPORAL_PRESSURE_ACTION_PATTERN =
  /(계산|재계산|서둘|뛰쳐|달려|향했|향하|내려|올라|우회|비상계단|눌렀|열었|쥐었|쥔|움켜|신고|찾으려|구하려|막으려|확인하려|대조|바꿨|접고|포기|선택|결정|다음\s*행동)/u;
const TEMPORAL_PRESSURE_NARROWING_PATTERN =
  /(늦|놓치|실패|죽|사망|닫히|닫혔|잠겼|차단|사라|잃|선택지.{0,18}(닫|사라|좁|차단)|알리바이.{0,18}(닫|끊|사라)|기록.{0,18}(사라|삭제)|시간.{0,18}(줄|끝|없|모자라)|기한.{0,18}(줄|끝|넘)|마감.{0,18}(지나|끝)|도착.{0,18}(늦)|되돌릴\s*수\s*없|돌이킬\s*수\s*없|다음\s*(?:수신자|표적|대상)|새\s*(?:위협|알림|예고))/u;

function assessManuscriptTemporalPressure(
  manuscript: string
): ManuscriptTemporalPressureAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 3) {
    return {
      passed: true,
      actual: `temporal pressure check skipped: sentences=${sentences.length}`,
    };
  }

  const prose = normalizeText(manuscript);
  const temporalMarkers = countMatches(
    prose,
    new RegExp(TEMPORAL_PRESSURE_MARKER_PATTERN, 'gu')
  );
  const actionSignals = countMatches(
    prose,
    new RegExp(TEMPORAL_PRESSURE_ACTION_PATTERN, 'gu')
  );
  const narrowingSignals = countMatches(
    prose,
    new RegExp(TEMPORAL_PRESSURE_NARROWING_PATTERN, 'gu')
  );

  if (temporalMarkers < 2) {
    return {
      passed: true,
      actual:
        `temporal pressure check deferred: temporal markers=${temporalMarkers}, ` +
        `action signals=${actionSignals}, narrowing signals=${narrowingSignals}`,
    };
  }

  let temporalWindows = 0;
  let completeWindows = 0;
  let strongestActionSignals = 0;
  let strongestNarrowingSignals = 0;

  for (let index = 0; index < sentences.length; index++) {
    const window = sentences
      .slice(index, Math.min(sentences.length, index + 3))
      .join(' ');

    if (!TEMPORAL_PRESSURE_MARKER_PATTERN.test(window)) {
      continue;
    }

    temporalWindows += 1;
    const windowActionSignals = countMatches(
      window,
      new RegExp(TEMPORAL_PRESSURE_ACTION_PATTERN, 'gu')
    );
    const windowNarrowingSignals = countMatches(
      window,
      new RegExp(TEMPORAL_PRESSURE_NARROWING_PATTERN, 'gu')
    );

    strongestActionSignals = Math.max(strongestActionSignals, windowActionSignals);
    strongestNarrowingSignals = Math.max(
      strongestNarrowingSignals,
      windowNarrowingSignals
    );

    if (windowActionSignals >= 1 && windowNarrowingSignals >= 1) {
      completeWindows += 1;
    }
  }

  return {
    passed: completeWindows >= 1,
    actual:
      `temporal markers=${temporalMarkers}, temporal windows=${temporalWindows}, ` +
      `complete time-pressure windows=${completeWindows}, action signals=${actionSignals}, ` +
      `narrowing signals=${narrowingSignals}, strongest window action=${strongestActionSignals}, ` +
      `strongest window narrowing=${strongestNarrowingSignals}`,
  };
}

const TACTICAL_REVERSAL_PATTERN =
  /(하지만|그러나|그\s*순간|갑자기|막혔|막힌|잠겼|잠근|차단|꺼뜨|꺼졌|멈추|되돌릴\s*수\s*없|절반(?:으로|을)\s*줄|기한(?:이)?\s*줄|선택지(?:가)?\s*좁)/u;
const TACTICAL_BLOCKED_PLAN_PATTERN =
  /(계획|현장|통제선|문|철문|엘리베이터|입구|통로|계단|도주로|주소|로그|휴대폰|증거|단서|피해자|제한\s*시간|카운트다운)/u;
const TACTICAL_ADAPTATION_PATTERN =
  /(전술|계획(?:을|도)?\s*(?:바꾸|수정|접|버리)|방법(?:을)?\s*바꾸|다시\s*(?:계산|정렬|짚|세우)|재계산|우회|돌아|비상계단|옆문|창문|다른\s*(?:길|통로|문|방법|수단)|대신[^.!?。！？\n]{0,50}(?:쥐|열|눌|보내|던지|맡기|넘기|따라|향하|선택|결정)|새\s*(?:단서|로그|정보|증거)|단서(?:를)?\s*(?:이용|따라|바탕)|도구(?:를)?\s*바꾸|수단(?:을)?\s*바꾸|경로(?:를)?\s*바꾸|동선(?:을)?\s*바꾸|다음\s*행동(?:을)?\s*(?:바꾸|정했|선택|결정)|조력자에게|경찰에게|몸을\s*낮추|문\s*대신|통로\s*대신|신고\s*대신)/gu;
const TACTICAL_ADAPTATION_NEGATION_PATTERN =
  /(?:전술(?:을)?\s*바꾸지\s*않|계획(?:을)?\s*(?:바꾸지|수정하지|접지)\s*않|우회하지(?:도)?\s*않|처음\s*계획대로|원래\s*계획대로|계획대로|원래처럼|그대로|아무\s*(?:조정|변경|대응)(?:도)?\s*없이)/gu;

function assessManuscriptTacticalAdaptation(
  manuscript: string
): ManuscriptTacticalAdaptationAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  let reversalWindows = 0;
  let adaptedWindows = 0;
  let strongestAdaptationSignals = 0;
  let negatedAdaptations = 0;

  for (let index = 0; index < sentences.length; index++) {
    const pressureWindow = sentences
      .slice(index, Math.min(sentences.length, index + 2))
      .join(' ');
    if (
      !TACTICAL_REVERSAL_PATTERN.test(pressureWindow) ||
      !TACTICAL_BLOCKED_PLAN_PATTERN.test(pressureWindow)
    ) {
      continue;
    }

    reversalWindows += 1;
    const aftermath = sentences
      .slice(index + 1, Math.min(sentences.length, index + 4))
      .join(' ');
    const adaptationSignals = countMatches(aftermath, TACTICAL_ADAPTATION_PATTERN);
    const negationSignals = countMatches(
      aftermath,
      TACTICAL_ADAPTATION_NEGATION_PATTERN
    );

    strongestAdaptationSignals = Math.max(
      strongestAdaptationSignals,
      adaptationSignals
    );
    negatedAdaptations += negationSignals;

    if (adaptationSignals > 0 && negationSignals === 0) {
      adaptedWindows += 1;
    }
  }

  return {
    passed: reversalWindows === 0 || (adaptedWindows >= 1 && negatedAdaptations === 0),
    actual:
      `tactical reversal windows=${reversalWindows}, adapted windows=${adaptedWindows}, ` +
      `strongest adaptation signals=${strongestAdaptationSignals}, negated adaptations=${negatedAdaptations}`,
  };
}

interface ManuscriptConsequenceAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptReaderDesireIntensityAssessment {
  passed: boolean;
  actual: string;
}

function assessManuscriptConsequenceEscalation(
  manuscript: string
): ManuscriptConsequenceAssessment {
  const prose = normalizeText(manuscript);
  const consequenceSignals = countMatches(
    prose,
    /(실패|놓쳤|놓치고|잃었|잃은|잃을|빼앗|다쳤|상처|피해가\s*커|사망|죽었|숨졌|쓰러졌|늦었|늦었다|발각|노출|체포|고립|대가|희생|비용|결과로|피로\s*번|피가\s*번|피가\s*흘|증거가\s*사라|단서가\s*사라)/gu
  );
  const escalationSignals = countMatches(
    prose,
    /(상황(?:을|이)?\s*(?:악화|되돌릴\s*수\s*없|바꿨|바꾸|뒤집|커졌|나빠)|되돌릴\s*수\s*없|돌이킬\s*수\s*없|회복할\s*수\s*없|다음\s*(?:수신자|표적|대상)|새\s*(?:표적|대상|위협|알림|피해|사건)|더\s*(?:위험|불리|좁혀|커졌|나빠)|반경(?:이)?[^.!?。！？]{0,20}좁|기한(?:이)?\s*줄|범인(?:이)?\s*눈치|적(?:이)?\s*알|경찰(?:이)?\s*오해)/gu
  );
  const softResetSignals = countMatches(
    prose,
    /(다시\s*확인|절차|정리|마무리|생각했다|차분히|괜찮|문제없이|무사히|별일\s*없이)/gu
  );

  const passed =
    consequenceSignals >= 1 &&
    escalationSignals >= 1 &&
    !(softResetSignals >= 3 && consequenceSignals < 2);

  return {
    passed,
    actual: `consequence signals=${consequenceSignals}, escalation signals=${escalationSignals}, soft reset signals=${softResetSignals}`,
  };
}

const READER_DESIRE_TARGET_PATTERN =
  /(피해자|사람|가족|동생|어머니|아버지|아이|친구|연인|조력자|목숨|생명|죽음|사망|실종|정체|누명|약점|증거|기록|로그|파일|알리바이|진실|이름|수신자|표적)/u;
const READER_DESIRE_INTENT_PATTERN =
  /(구하|구하려|살리|살려|지키|보호|되찾|찾아내|찾으려|찾겠다|막으|막아|막겠|밝히|증명하|붙잡|구해야|살려야|지켜야|포기할\s*수\s*없|놓칠\s*수\s*없|잃을\s*수\s*없)/u;
const READER_DESIRE_URGENCY_PATTERN =
  /(제한\s*시간|카운트다운|마감|기한|위험|감수|서둘|뛰쳐|달려|늦기\s*전|닫히|잠겼|막힌|꺼뜨|사라져|좁혀|다음\s*(?:수신자|표적|대상)|새\s*(?:알림|예고|위협)|되돌릴\s*수\s*없|돌이킬\s*수\s*없)/u;
const READER_DESIRE_FAILURE_COST_PATTERN =
  /(죽|사망|죽음|실종|잃|잃을|놓치|놓칠|대가|희생|실패|늦|발각|노출|닫히|사라|표적|수신자|위험|되돌릴\s*수\s*없|돌이킬\s*수\s*없|돌아갈\s*수\s*없)/u;

function assessManuscriptReaderDesireIntensity(
  manuscript: string
): ManuscriptReaderDesireIntensityAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 3) {
    return {
      passed: true,
      actual: `reader desire check skipped: sentences=${sentences.length}`,
    };
  }

  let targetWindows = 0;
  let intentWindows = 0;
  let urgencyWindows = 0;
  let failureCostWindows = 0;
  let desireWindows = 0;

  for (let index = 0; index < sentences.length; index++) {
    const window = sentences.slice(index, Math.min(sentences.length, index + 3)).join(' ');
    const hasTarget = READER_DESIRE_TARGET_PATTERN.test(window);
    const hasIntent = READER_DESIRE_INTENT_PATTERN.test(window);
    const hasUrgency = READER_DESIRE_URGENCY_PATTERN.test(window);
    const hasFailureCost = READER_DESIRE_FAILURE_COST_PATTERN.test(window);

    if (hasTarget) targetWindows += 1;
    if (hasIntent) intentWindows += 1;
    if (hasUrgency) urgencyWindows += 1;
    if (hasFailureCost) failureCostWindows += 1;
    if (hasTarget && hasIntent && hasUrgency && hasFailureCost) {
      desireWindows += 1;
    }
  }

  return {
    passed: desireWindows >= 1,
    actual:
      `reader desire windows=${desireWindows}, target windows=${targetWindows}, ` +
      `intent windows=${intentWindows}, urgency windows=${urgencyWindows}, ` +
      `failure-cost windows=${failureCostWindows}`,
  };
}

interface ManuscriptCausalChainAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptConvenientResolutionAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptPovFocalizationAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptNarrativeTransportationAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptPremiseEngineAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

const CAUSAL_CHAIN_CONNECTOR_PATTERN =
  /(때문에|그래서|결국|그\s*결과|대가로|직후|하자|되자|리자|자마자|그러자|탓에|바람에|끝에)/u;
const CAUSAL_CHAIN_ACTION_PATTERN =
  /(선택|결정|계산|뛰쳐|달려|찾으려\s*하|확인하려|감수|신고|향했|도착|움켜|쥐었|쥔|눌렀|열었|돌아|공개|추적|구하|구하려)/u;
const CAUSAL_CHAIN_PRESSURE_PATTERN =
  /(제한\s*시간|카운트다운|조명|불이|꺼졌|통제선|잠겼|막혔|피해자|사망|현장|예고|알림|위험|위협|대상|표적)/u;
const CAUSAL_CHAIN_CONSEQUENCE_PATTERN =
  /(실패|늦은|늦었|쓰러졌|사망|죽었|피해자|대가|손실|되돌릴\s*수\s*없|돌이킬\s*수\s*없|바꿨|바꾸|굳어졌|굳어지는|드러났|밝혀|연결|다음\s*(?:수신자|표적|대상)|새\s*(?:알림|예고|위협|사건)|좁혀)/u;
const CAUSAL_CHAIN_CLUE_PATTERN =
  /(단서|기록|로그|번호|파일|로고|좌표|알림|휴대폰|화면|규칙|패턴|사건|피해자|이름|수신자|실종|미제)/u;
const CAUSAL_CHAIN_REACTION_PATTERN =
  /(목덜미|목구멍|손바닥|손끝|심장|가슴|숨|입\s*안|혀끝|땀|떨림|두근|차갑|얼음|쓴맛|조이|삼켰|움켜|쥐었|쥔|멈췄|고개|눈)/u;

function assessManuscriptCausalChain(
  manuscript: string
): ManuscriptCausalChainAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 4) {
    return {
      passed: true,
      actual: `causal chain check skipped: sentences=${sentences.length}`,
    };
  }

  const prose = normalizeText(manuscript);
  const actionSignals = countMatches(prose, new RegExp(CAUSAL_CHAIN_ACTION_PATTERN, 'gu'));
  const pressureSignals = countMatches(prose, new RegExp(CAUSAL_CHAIN_PRESSURE_PATTERN, 'gu'));
  const consequenceSignals = countMatches(
    prose,
    new RegExp(CAUSAL_CHAIN_CONSEQUENCE_PATTERN, 'gu')
  );

  if (actionSignals < 2 || pressureSignals < 2 || consequenceSignals < 1) {
    return {
      passed: true,
      actual: `causal chain check deferred: action signals=${actionSignals}, pressure signals=${pressureSignals}, consequence signals=${consequenceSignals}`,
    };
  }

  const links = sentences
    .map((sentence, index) => {
      const hasConnector = CAUSAL_CHAIN_CONNECTOR_PATTERN.test(sentence);
      const hasAction = CAUSAL_CHAIN_ACTION_PATTERN.test(sentence);
      const hasPressure = CAUSAL_CHAIN_PRESSURE_PATTERN.test(sentence);
      const hasConsequence = CAUSAL_CHAIN_CONSEQUENCE_PATTERN.test(sentence);
      const hasClue = CAUSAL_CHAIN_CLUE_PATTERN.test(sentence);
      const hasReaction = CAUSAL_CHAIN_REACTION_PATTERN.test(sentence);
      const actionConsequenceLink =
        hasConnector && hasAction && (hasPressure || hasConsequence) && hasConsequence;
      const clueReactionLink =
        hasConnector && hasClue && (hasReaction || hasConsequence) && hasConsequence;

      return actionConsequenceLink || clueReactionLink
        ? {
            index,
            actionConsequenceLink,
            clueReactionLink,
          }
        : undefined;
    })
    .filter(
      (
        link
      ): link is {
        index: number;
        actionConsequenceLink: boolean;
        clueReactionLink: boolean;
      } => link !== undefined
    );

  return {
    passed: links.length >= 2,
    actual:
      `causal links=${links.length} (` +
      `${links
        .map(link =>
          `${link.index}:${link.actionConsequenceLink ? 'action' : 'clue'}`
        )
        .join(', ') || 'none'}); ` +
      `action signals=${actionSignals}, pressure signals=${pressureSignals}, consequence signals=${consequenceSignals}`,
  };
}

const CONVENIENT_RESOLUTION_PRESSURE_PATTERN =
  /(막혔|잠겼|갇혔|쫓기|추격|공격|위협|위험|죽|사망|피해자|표적|범인|칼|총|문|통제선|제한\s*시간|카운트다운|증거|단서|기록|알리바이|선택지|실패|붙잡|고립|막다른)/u;
const CONVENIENT_RESOLUTION_LUCK_PATTERN =
  /(우연히|마침|때마침|공교롭게|운\s*좋게|기적처럼|뜻밖에|갑자기|느닷없이|별안간|하필|그\s*순간|바로\s*그때|다행히|어디선가|아무\s*이유\s*없이)/u;
const CONVENIENT_RESOLUTION_EXTERNAL_PATTERN =
  /(경찰|형사|구급대|구조대|조력자|동료|친구|누군가|관리자|경비원|상사|시스템|앱|문자|전화|알림|파일|증거|문|잠금|차단기|엘리베이터|차량|택시|군중|사람들|내부자)/u;
const CONVENIENT_RESOLUTION_SOLVES_PATTERN =
  /(도착|나타나|들어와|열렸|풀렸|해제|막아|구했|구해|구출|도와|대신|체포|잡았|붙잡|해결|끝났|사라졌|드러났|밝혀졌|발견됐|찾아냈|알려줬|넘겨줬|막아냈|풀어줬|살려|탈출)/u;
const CONVENIENT_RESOLUTION_EARNED_SETUP_PATTERN =
  /(미리|앞서|전에|이미|방금|계획|준비|약속|신호|문자|전화|신고|연락|심어|숨겨|설치|열어\s*둔|남겨\s*둔|보내\s*둔|불러|요청|유인|추적기|위치\s*공유|암호|비밀번호|열쇠|녹음|사진|복선|함정)/u;
const CONVENIENT_RESOLUTION_AGENCY_PATTERN =
  /(그|그녀|주인공|서연|민준|도현|나는|내가|그가|그녀가|직접|스스로)[^.!?。！？\n]{0,80}(?:미리|앞서|이미|계획|준비|약속|신호|문자|전화|신고|연락|요청|불러|보내|심어|숨겨|설치|열어|남겨|유인|추적기|위치\s*공유|암호|비밀번호|열쇠|녹음|사진|함정)/u;
const CONVENIENT_RESOLUTION_NEGATED_SETUP_PATTERN =
  /(신고보다|신고를\s*미룬|신고하지|신고\s*대신|연락보다|연락하지|요청하지|부르지\s*않)/gu;
const CONVENIENT_RESOLUTION_COST_PATTERN =
  /(대가|비용|희생|포기|잃|잃었|닫히|닫혔|돌아갈\s*수\s*없|위험을\s*감수|노출|발각|오해|체포될|신뢰를\s*잃|상처|부상|피|늦어|놓쳤|기록이\s*남|알리바이[^.!?。！？\n]{0,40}사라)/u;

function assessManuscriptConvenientResolution(
  manuscript: string
): ManuscriptConvenientResolutionAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 4) {
    return {
      passed: true,
      actual: `convenient resolution check skipped: sentences=${sentences.length}`,
    };
  }

  let suspiciousWindows = 0;
  let earnedWindows = 0;
  let strongestSetupSignals = 0;
  let strongestAgencySignals = 0;
  let strongestPressureSignals = 0;
  let strongestCostSignals = 0;

  for (let index = 0; index < sentences.length; index++) {
    const crisisWindow = sentences
      .slice(index, Math.min(sentences.length, index + 3))
      .join(' ');
    const pressureSignals = countMatches(
      crisisWindow,
      new RegExp(CONVENIENT_RESOLUTION_PRESSURE_PATTERN, 'gu')
    );
    const hasLuck = CONVENIENT_RESOLUTION_LUCK_PATTERN.test(crisisWindow);
    const hasExternal = CONVENIENT_RESOLUTION_EXTERNAL_PATTERN.test(crisisWindow);
    const hasResolution = CONVENIENT_RESOLUTION_SOLVES_PATTERN.test(crisisWindow);

    strongestPressureSignals = Math.max(strongestPressureSignals, pressureSignals);

    if (pressureSignals === 0 || !hasLuck || !hasExternal || !hasResolution) {
      continue;
    }

    suspiciousWindows += 1;
    const setupWindow = sentences
      .slice(Math.max(0, index - 3), Math.min(sentences.length, index + 3))
      .join(' ');
    const earnedSetupWindow = setupWindow.replace(
      CONVENIENT_RESOLUTION_NEGATED_SETUP_PATTERN,
      ''
    );
    const setupSignals = countMatches(
      earnedSetupWindow,
      new RegExp(CONVENIENT_RESOLUTION_EARNED_SETUP_PATTERN, 'gu')
    );
    const agencySignals = countMatches(
      earnedSetupWindow,
      new RegExp(CONVENIENT_RESOLUTION_AGENCY_PATTERN, 'gu')
    );
    const costSignals = countMatches(
      setupWindow,
      new RegExp(CONVENIENT_RESOLUTION_COST_PATTERN, 'gu')
    );

    strongestSetupSignals = Math.max(strongestSetupSignals, setupSignals);
    strongestAgencySignals = Math.max(strongestAgencySignals, agencySignals);
    strongestCostSignals = Math.max(strongestCostSignals, costSignals);

    if (setupSignals >= 2 && agencySignals >= 1 && costSignals >= 1) {
      earnedWindows += 1;
    }
  }

  return {
    passed: suspiciousWindows === 0 || earnedWindows === suspiciousWindows,
    actual:
      `convenient-resolution windows=${suspiciousWindows}, earned windows=${earnedWindows}, ` +
      `strongest pressure signals=${strongestPressureSignals}, strongest setup signals=${strongestSetupSignals}, ` +
      `strongest agency signals=${strongestAgencySignals}, strongest cost signals=${strongestCostSignals}`,
  };
}

const POV_FOCALIZATION_EVENT_PATTERN =
  /(앱|알림|휴대폰|화면|로그|기록|번호|파일|로고|현장|통제선|조명|피해자|사망|미제|실종|수신자|표적|규칙|패턴|단서|카운트다운|위험|위협|사건)/u;
const POV_FOCALIZATION_REACTION_PATTERN =
  /(목덜미|목구멍|손바닥|손끝|심장|가슴|숨|입\s*안|혀끝|피부|등골|어깨|볼|귀끝|땀|떨림|떨렸|떨리는|떨며|두근|차갑|뜨겁|얼음|시야|시선|눈앞|눈을|고개|무릎|발끝|귓속|쓴맛|비린내|철\s*냄새|조였|삼켰|움켜|쥐었|쥔|멈췄|돌아봤|왜|어떻게|알\s*수\s*없|의심|깨달)/u;

function assessManuscriptPovFocalization(
  manuscript: string,
  characters: CharacterReferenceForEvaluation[]
): ManuscriptPovFocalizationAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 4) {
    return {
      passed: true,
      actual: `POV focalization check skipped: sentences=${sentences.length}`,
    };
  }

  const povAnchorPattern = buildPovAnchorPattern(characters, manuscript);
  const eventSentences = sentences.filter(sentence =>
    POV_FOCALIZATION_EVENT_PATTERN.test(sentence)
  ).length;
  const anchoredEventSentences = sentences.filter(sentence =>
    povAnchorPattern.test(sentence) && POV_FOCALIZATION_EVENT_PATTERN.test(sentence)
  ).length;
  const focalizedBeatSentences = sentences.filter(sentence =>
    povAnchorPattern.test(sentence) &&
    POV_FOCALIZATION_EVENT_PATTERN.test(sentence) &&
    POV_FOCALIZATION_REACTION_PATTERN.test(sentence)
  ).length;
  const detachedEventSentences = Math.max(0, eventSentences - anchoredEventSentences);

  return {
    passed: focalizedBeatSentences >= 2,
    actual:
      `POV focalized beats=${focalizedBeatSentences}, ` +
      `anchored event sentences=${anchoredEventSentences}, ` +
      `detached event sentences=${detachedEventSentences}, ` +
      `event sentences=${eventSentences}`,
  };
}

const NARRATIVE_TRANSPORTATION_IMAGERY_PATTERN =
  /(휴대폰|화면|로그|기록|파일|로고|번호|알림|현장|통제선|조명|철문|문턱|복도|계단|엘리베이터|지하보도|골목|바닥|벽|피|상처|불빛|그림자|냄새|소리|진동|손바닥|목덜미|눈앞|시야|시선)/u;
const NARRATIVE_TRANSPORTATION_ACTION_PATTERN =
  /(쥐었|쥔|움켜|눌렀|열었|닫았|뛰쳐|달려|향했|내려|올라|우회|접고|바꿨|멈췄|돌아봤|찾으려|구하려|확인하려|계산|붙잡|밀었|당겼|잠갔|꺼뜨리|막혔|차단|깜박|울렸|떴|뜨며)/u;
const NARRATIVE_TRANSPORTATION_FOCUS_PATTERN =
  /(왜|어떻게|알\s*수\s*없|모르|의문|확인하려|찾으려|계산|패턴|단서|로그|번호|화면|눈앞|시선|다시|다음|첫\s*수신자|수신자|표적|미제\s*사건|규칙)/u;
const NARRATIVE_TRANSPORTATION_SUMMARY_PATTERN =
  /(독자|몰입|보상|쾌감|긴장감|페이지터너|클리프|장기\s*미스터리|수렴한다|제공한다|보여준다|설명된다|제시된다|확인되었다|정리된다|처리된다|기능|장면\s*목적|회차)/u;
const PREMISE_ENGINE_MECHANISM_PATTERN =
  /(앱|알림|수신자|화면|로그|기록|번호|파일|규칙|시스템|능력|마법|저주|계약|조건|금기|예고|예보|예언|회귀|빙의|각성|게이트|던전|헌터|스킬|상태창|왕좌|혈통|비밀|암호|좌표|표식|장치|프로토콜|법칙|명령|선택지|타임스탬프|증거|단서)/u;
const PREMISE_ENGINE_CONSTRAINT_PATTERN =
  /(선택|결정|감수|계산|추적|검증|확인|우회|침투|탈출|구하|보호|숨기|공개|거절|수락|거래|협상|계획을\s*바꾸|전술을\s*바꾸|행동을\s*바꾸|막히|잠기|차단|닫히|사라지|강제|제한|기한|제한\s*시간|위험|대가|표적|추방|처벌|실패|손실|압박)/u;
const PREMISE_ENGINE_STATE_CHANGE_PATTERN =
  /(그래서|그러자|결국|직후|때문에|탓에|대가로|그\s*결과|이후|다음|새|새로운|드러나|밝혀|연결|맞물|겹치|일치|바뀌|달라지|좁혀|확정|지목|열리|닫히|사라지|남았|남겨|위험이\s*커|압박이\s*커|선택지가\s*닫|다음\s*(?:행동|목표|질문|추적|검증|표적|수신자))/u;
const PREMISE_ENGINE_LABEL_ONLY_PATTERN =
  /(설정|세계관|소재|컨셉|분위기|흥미롭|중요|특별|독특|장르적|상징|테마|서사의\s*핵심|이야기의\s*핵심)/u;

function assessManuscriptNarrativeTransportation(
  manuscript: string,
  characters: CharacterReferenceForEvaluation[]
): ManuscriptNarrativeTransportationAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 5) {
    return {
      passed: true,
      actual: `narrative transportation check skipped: sentences=${sentences.length}`,
    };
  }

  const povAnchorPattern = buildPovAnchorPattern(characters, manuscript);
  let mentalImageSentences = 0;
  let affectivePovSentences = 0;
  let focusSentences = 0;
  let abstractSummarySentences = 0;
  let completeWindows = 0;

  const sentenceSignals = sentences.map(sentence => {
    const hasAnchor = povAnchorPattern.test(sentence);
    const hasImagery = NARRATIVE_TRANSPORTATION_IMAGERY_PATTERN.test(sentence);
    const hasAction = NARRATIVE_TRANSPORTATION_ACTION_PATTERN.test(sentence);
    const hasAffect = POV_FOCALIZATION_REACTION_PATTERN.test(sentence);
    const hasFocus = NARRATIVE_TRANSPORTATION_FOCUS_PATTERN.test(sentence);
    const hasAbstractSummary =
      NARRATIVE_TRANSPORTATION_SUMMARY_PATTERN.test(sentence) &&
      !(hasImagery && hasAction) &&
      !hasAffect;

    if ((hasImagery && (hasAction || hasAffect)) || (hasAction && hasFocus)) {
      mentalImageSentences += 1;
    }
    if (hasAnchor && hasAffect) {
      affectivePovSentences += 1;
    }
    if (hasFocus && (hasAnchor || hasImagery)) {
      focusSentences += 1;
    }
    if (hasAbstractSummary) {
      abstractSummarySentences += 1;
    }

    return {
      hasAnchor,
      hasImagery,
      hasAction,
      hasAffect,
      hasFocus,
      hasAbstractSummary,
    };
  });

  for (let index = 0; index < sentenceSignals.length; index += 1) {
    const window = sentenceSignals.slice(index, index + 2);
    if (window.length < 2) continue;

    const hasImagery = window.some(signal => signal.hasImagery);
    const hasAction = window.some(signal => signal.hasAction);
    const hasAffectivePov = window.some(signal => signal.hasAnchor && signal.hasAffect);
    const hasFocus = window.some(signal => signal.hasFocus);

    if (hasImagery && hasAction && hasAffectivePov && hasFocus) {
      completeWindows += 1;
    }
  }

  const summaryRatio = abstractSummarySentences / sentences.length;
  const passed =
    mentalImageSentences >= 3 &&
    affectivePovSentences >= 2 &&
    focusSentences >= 2 &&
    completeWindows >= 1 &&
    summaryRatio <= 0.35;

  return {
    passed,
    actual:
      `mental image sentences=${mentalImageSentences}, ` +
      `affective POV sentences=${affectivePovSentences}, ` +
      `focused attention sentences=${focusSentences}, ` +
      `complete transportation windows=${completeWindows}, ` +
      `abstract summary sentences=${abstractSummarySentences}/${sentences.length}`,
  };
}

function assessManuscriptPremiseEngine(
  manuscript: string,
  promise: ReaderPromiseContract
): ManuscriptPremiseEngineAssessment {
  const expectedSignals = uniqueStrings([
    promise.core_hook,
    promise.novelty_angle,
  ].filter((signal): signal is string => Boolean(signal?.trim())));

  if (expectedSignals.length === 0) {
    return {
      passed: true,
      expected: 'premise engine=not declared',
      actual: 'reader_promise_contract premise signals=0',
    };
  }

  const anchors = uniqueStrings(
    expectedSignals
      .flatMap(signal => extractReaderPromiseAnchorTokens(signal))
      .filter(anchor => anchor.length >= 2)
  ).slice(0, 18);
  const sentences = splitManuscriptSentences(manuscript);
  let candidateWindows = 0;
  let operationalWindows = 0;
  let strongestAnchorHits = 0;
  let strongestMechanism = false;
  let strongestConstraint = false;
  let strongestStateChange = false;
  let labelOnlyWindows = 0;

  for (let index = 0; index < sentences.length; index += 1) {
    const window = sentences
      .slice(Math.max(0, index - 1), Math.min(sentences.length, index + 3))
      .join(' ');
    const normalizedWindow = normalizeText(window);
    const anchorHits = anchors.filter(anchor => normalizedWindow.includes(anchor));
    const hasDirectPremiseEvidence = expectedSignals.some(signal =>
      containsExpectedBeatEvidence(window, signal, 0.34)
    );
    const hasPremiseAnchor = hasDirectPremiseEvidence || anchorHits.length >= 2;

    if (!hasPremiseAnchor) {
      continue;
    }

    candidateWindows += 1;
    strongestAnchorHits = Math.max(strongestAnchorHits, anchorHits.length);
    const hasMechanism = PREMISE_ENGINE_MECHANISM_PATTERN.test(window);
    const hasConstraint = PREMISE_ENGINE_CONSTRAINT_PATTERN.test(window);
    const hasStateChange = PREMISE_ENGINE_STATE_CHANGE_PATTERN.test(window);
    const labelOnly =
      PREMISE_ENGINE_LABEL_ONLY_PATTERN.test(window) &&
      (!hasMechanism || !hasConstraint || !hasStateChange);

    strongestMechanism ||= hasMechanism;
    strongestConstraint ||= hasConstraint;
    strongestStateChange ||= hasStateChange;
    if (labelOnly) {
      labelOnlyWindows += 1;
    }
    if (hasMechanism && hasConstraint && hasStateChange && !labelOnly) {
      operationalWindows += 1;
    }
  }

  return {
    passed: operationalWindows > 0,
    expected:
      `premise engine on page: ${expectedSignals.join(' / ')}; ` +
      'the core hook or novelty angle should operate as a rule, device, condition, taboo, or system that constrains a choice, changes action, creates risk, and opens the next story question.',
    actual:
      `candidate premise windows=${candidateWindows}, ` +
      `operational windows=${operationalWindows}, ` +
      `strongest anchor hits=${strongestAnchorHits}, ` +
      `mechanism=${strongestMechanism}, constraint/action=${strongestConstraint}, ` +
      `state change/question=${strongestStateChange}, label-only windows=${labelOnlyWindows}`,
  };
}

function buildPovAnchorPattern(
  characters: CharacterReferenceForEvaluation[],
  manuscript: string
): RegExp {
  const characterAnchors = characters
    .flatMap(character => [character.name, ...(character.aliases ?? [])])
    .map(anchor => anchor.trim())
    .filter(anchor => anchor.length >= 2)
    .map(escapeRegExp);
  const inferredNameAnchors = inferKoreanNameAnchors(manuscript).map(escapeRegExp);

  const fallbackAnchors = [
    '나는',
    '내가',
    '저는',
    '제가',
    '그는',
    '그의',
    '그녀는',
    '그녀의',
    '주인공',
  ];
  const anchors = [
    ...new Set([
      ...characterAnchors,
      ...inferredNameAnchors,
      ...fallbackAnchors.map(escapeRegExp),
    ]),
  ];

  return new RegExp(`(?:${anchors.join('|')})`, 'u');
}

function inferKoreanNameAnchors(manuscript: string): string[] {
  const surnamePattern =
    /((?:김|이|박|최|정|강|조|윤|장|임|한|오|서|신|권|황|안|송|전|홍|유|고|문|양|손|배|백|허|남|심|노|하|곽|성|차|주|우|구|민|류|나|진|지)[가-힣]{2,3})(?:은|는|이|가|의)/gu;
  const counts = new Map<string, number>();
  let match: RegExpExecArray | null;
  while ((match = surnamePattern.exec(manuscript)) !== null) {
    const name = match[1];
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([name]) => name);
}

interface ManuscriptPayoffEmbodimentAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptEmotionalArcAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface ManuscriptEmotionalProgressionAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface ManuscriptAffectiveChoiceTurnAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface ManuscriptCharacterDevelopmentAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface RelationshipShiftAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface ManuscriptGenericCharacterLabelAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface LongHookAdvancementAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptLongHookClueAssessment {
  passed: boolean;
  actual: string;
}

const LONG_HOOK_ADVANCEMENT_CONCRETE_PATTERN =
  /(사건\s*번호|파일\s*번호|사망\s*시각|번호|기록|로그|로고|파일|사진|녹음|좌표|주소|이름|서명|문서|메모|문자|메시지|알림|휴대폰|화면|수신자|표식|상처|흉터|열쇠|카드|지도|계좌|암호|타임스탬프|단서|증거|흔적)/u;
const LONG_HOOK_ADVANCEMENT_PROGRESS_PATTERN =
  /(새|처음|추가|드러|밝혀|발견|겹치|일치|맞물|가리키|연결|좁혀|확정|바뀌|바꾸|수정|제외|승격|지목|추적|검증|확인|삭제|차단|다음|새로운|늘었|좁아|강제|되돌릴\s*수\s*없)/u;
const LONG_HOOK_ADVANCEMENT_STATE_PATTERN =
  /(가설|용의자|후보|배후|정체|원인|규칙|위치|경로|위험|대가|기한|표적|대상|수신자|계획|행동|실종|개발자|미제|사건|파일|기록|로그|번호|현재|과거)/u;
const LONG_HOOK_STATIC_REPEAT_PATTERN =
  /(여전히|그대로|반복|또\s*다시|단서가\s*남|미스터리로\s*남|남아\s*있|막연|가능성|수렴한다는|정리되어\s*있|언급)/u;

function assessLongHookThreadAdvancement(
  text: string,
  longHookThreads: string[]
): LongHookAdvancementAssessment {
  const sentences = splitManuscriptSentences(text);
  let candidateSentences = 0;
  let advancementWindows = 0;
  let strongestConcreteSignals = 0;
  let strongestProgressSignals = 0;
  let strongestStateSignals = 0;
  let strongestStaticSignals = 0;

  for (const thread of longHookThreads) {
    const trimmedThread = thread.trim();
    if (!trimmedThread) continue;

    for (const [index, sentence] of sentences.entries()) {
      if (!matchesLongHookThreadSentence(sentence, trimmedThread)) continue;

      candidateSentences += 1;
      const window = sentences
        .slice(Math.max(0, index - 1), Math.min(sentences.length, index + 2))
        .join(' ');
      const concreteSignals = countMatches(
        window,
        new RegExp(LONG_HOOK_ADVANCEMENT_CONCRETE_PATTERN, 'gu')
      );
      const progressSignals = countMatches(
        window,
        new RegExp(LONG_HOOK_ADVANCEMENT_PROGRESS_PATTERN, 'gu')
      );
      const stateSignals = countMatches(
        window,
        new RegExp(LONG_HOOK_ADVANCEMENT_STATE_PATTERN, 'gu')
      );
      const staticSignals = countMatches(
        window,
        new RegExp(LONG_HOOK_STATIC_REPEAT_PATTERN, 'gu')
      );

      strongestConcreteSignals = Math.max(strongestConcreteSignals, concreteSignals);
      strongestProgressSignals = Math.max(strongestProgressSignals, progressSignals);
      strongestStateSignals = Math.max(strongestStateSignals, stateSignals);
      strongestStaticSignals = Math.max(strongestStaticSignals, staticSignals);

      if (
        concreteSignals >= 1 &&
        progressSignals >= 1 &&
        stateSignals >= 1 &&
        !(staticSignals >= 2 && progressSignals < 2)
      ) {
        advancementWindows += 1;
      }
    }
  }

  return {
    passed: advancementWindows > 0,
    actual:
      `long-hook candidate sentences=${candidateSentences}, advancement windows=${advancementWindows}, ` +
      `strongest concrete signals=${strongestConcreteSignals}, strongest progress signals=${strongestProgressSignals}, ` +
      `strongest state signals=${strongestStateSignals}, strongest static-repeat signals=${strongestStaticSignals}`,
  };
}

function assessManuscriptLongHookClue(
  manuscript: string,
  longHookThreads: string[]
): ManuscriptLongHookClueAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  let candidateSentences = 0;
  let concreteClueWindows = 0;
  let strongestConcreteSignals = 0;
  let strongestStagingSignals = 0;
  let strongestAbstractSignals = 0;

  for (const thread of longHookThreads) {
    const trimmedThread = thread.trim();
    if (!trimmedThread) continue;

    for (const sentence of sentences) {
      if (!matchesLongHookThreadSentence(sentence, trimmedThread)) continue;

      candidateSentences += 1;
      const concreteClueSignals = countMatches(
        sentence,
        /(사건\s*번호|번호|기록|로그|로고|파일|사진|녹음|좌표|주소|이름|서명|문서|메모|문자|메시지|알림|휴대폰|화면|수신자|표식|상처|흉터|피|유리|열쇠|카드|지도|계좌|암호|타임스탬프|도장|영수증|실종\s*파일)/gu
      );
      const stagingSignals = countMatches(
        sentence,
        /(발견|드러|밝혀|겹치|일치|맞물|가리키|연결|기록|찍혀|깜박|뜬|울렸|나타|좁혀|선택|지목|남아|묻어|흘렀)/gu
      );
      const abstractSignals = countMatches(
        sentence,
        /(가능성|막연|설명|정리|수렴한다는|의미했다|암시|이야기|단서가\s*남았다|알려진다|드러난다|있었다)/gu
      );

      strongestConcreteSignals = Math.max(strongestConcreteSignals, concreteClueSignals);
      strongestStagingSignals = Math.max(strongestStagingSignals, stagingSignals);
      strongestAbstractSignals = Math.max(strongestAbstractSignals, abstractSignals);

      if (
        concreteClueSignals >= 1 &&
        stagingSignals >= 1 &&
        !(abstractSignals >= 2 && concreteClueSignals < 2)
      ) {
        concreteClueWindows += 1;
      }
    }
  }

  return {
    passed: concreteClueWindows > 0,
    actual: `long-hook candidate sentences=${candidateSentences}, concrete clue windows=${concreteClueWindows}, strongest concrete signals=${strongestConcreteSignals}, strongest staging signals=${strongestStagingSignals}, strongest abstract signals=${strongestAbstractSignals}`,
  };
}

function matchesLongHookThreadSentence(sentence: string, thread: string): boolean {
  const normalizedSentence = normalizeText(sentence);
  const normalizedThread = normalizeText(thread);
  if (!normalizedSentence || !normalizedThread) {
    return false;
  }

  if (normalizedSentence.includes(normalizedThread)) {
    return true;
  }

  const terms = extractLongHookCandidateTerms(thread);
  if (terms.length === 0) {
    return false;
  }

  const anchors = terms.filter(term => !GENERIC_LONG_HOOK_TERMS.has(term));
  const matchedTerms = terms.filter(term => normalizedSentence.includes(term)).length;
  const matchedAnchors = anchors.filter(term => normalizedSentence.includes(term)).length;

  return matchedAnchors > 0 && matchedTerms >= Math.min(2, terms.length);
}

const GENERIC_LONG_HOOK_TERMS = new Set([
  '예고',
  '앱',
  '주인공',
  '장기',
  '미스터리',
  '수렴',
  '연결',
  '과거',
  '미제',
  '사건',
]);

function extractLongHookCandidateTerms(thread: string): string[] {
  const rawTerms = normalizeText(thread).match(/[가-힣a-z0-9]{2,}/gu) ?? [];
  const terms = rawTerms
    .map(term =>
      term.replace(/(?:으로|에서|에게|까지|부터|처럼|라는|이라는|과|와|의|이|가|은|는|을|를|로|에|도|만)$/u, '')
    )
    .filter(term => term.length >= 2);

  return [...new Set(terms)];
}

function hasManuscriptPayoffEvidence(
  manuscript: string,
  emotionalPayoff: string
): boolean {
  if (containsExpectedBeatEvidence(manuscript, emotionalPayoff, 0.3)) {
    return true;
  }

  return hasSceneNativeEmotionalPayoffEvidence(manuscript, emotionalPayoff);
}

function hasSceneNativeEmotionalPayoffEvidence(
  manuscript: string,
  emotionalPayoff: string
): boolean {
  const expected = emotionalPayoff.trim();
  const requiresPuzzleReward =
    /(단서|추리|퍼즐|패턴|규칙|맞물|지적\s*쾌감)/u.test(expected);
  const requiresTension = /(긴장감|위기|압박|스릴|공포)/u.test(expected);

  if (!requiresPuzzleReward && !requiresTension) {
    return false;
  }

  const sentences = splitManuscriptSentences(manuscript);
  return sentences.some((_, index) => {
    const window = sentences.slice(Math.max(0, index - 1), index + 2).join(' ');
    const puzzleEvidence = !requiresPuzzleReward || hasConcretePuzzleReward(window);
    const tensionEvidence = !requiresTension || hasEmbodiedTension(window);
    return puzzleEvidence && tensionEvidence;
  });
}

function hasSceneNativePayoffCadenceEvidence(
  manuscript: string,
  cadenceSignals: string[]
): boolean {
  const expected = cadenceSignals.join(' ');
  const sentences = splitManuscriptSentences(manuscript);
  const windows = sentences.map((_, index) =>
    sentences.slice(Math.max(0, index - 1), index + 2).join(' ')
  );

  const expectsRuleOrClueReward = /(규칙|단서|보상|회차)/u.test(expected);
  if (
    expectsRuleOrClueReward &&
    windows.some(window => hasConcreteRuleReward(window))
  ) {
    return true;
  }

  const expectsNextForecast = /(새\s*예고|다음\s*목표|다음\s*대상|다음\s*수신자)/u.test(expected);
  if (
    expectsNextForecast &&
    windows.some(window => /(새\s*(?:예고|알림)|다음\s*(?:목표|수신자|표적|대상|사건))/u.test(window) &&
      /(목표|수신자|표적|대상|이름|위치|건물|좁혀|연결|지목|제시)/u.test(window))
  ) {
    return true;
  }

  return false;
}

function hasConcretePuzzleReward(text: string): boolean {
  return (
    /(?:단서|기록|로그|번호|파일|로고|좌표|알림|휴대폰|화면|규칙|패턴|사건|피해자).{0,50}(?:맞물|일치|겹치|연결|드러|굳|확인|좁혀)/u.test(
      text
    ) ||
    /(?:맞물|일치|겹치|연결|드러|굳|확인|좁혀).{0,50}(?:단서|기록|로그|번호|파일|로고|좌표|알림|휴대폰|화면|규칙|패턴|사건|피해자)/u.test(
      text
    )
  );
}

function hasConcreteRuleReward(text: string): boolean {
  return (
    /규칙.{0,50}(?:굳|드러|몸을\s*드러|확인)/u.test(text) &&
    /(?:피해자|사망|화면|로그|기록|피|알림|휴대폰|카운트다운|이름)/u.test(text)
  );
}

function hasEmbodiedTension(text: string): boolean {
  return /(목덜미|목구멍|손바닥|손끝|심장|가슴|숨|입\s*안|혀끝|피부|등골|어깨|귀끝|땀|떨림|떨었|떨었다|떨렸다|떨며|떨고|떨리는|떨린|두근|차갑|얼음|귓속|쓴맛|비린내|철\s*냄새|조이|삼켰|움켜|쥐었|쥔|꺼졌|실패|제한\s*시간|카운트다운|통제선)/u.test(
    text
  );
}

interface ManuscriptEarnedRewardAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptRewardFreshnessAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptPayoffDelightAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptQuestionLadderAssessment {
  passed: boolean;
  actual: string;
}

function assessManuscriptEarnedReward(
  manuscript: string,
  chapterReward: string
): ManuscriptEarnedRewardAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  const rewardTerms = extractPayoffTerms(chapterReward);
  const candidateIndexes = sentences
    .map((sentence, index) => ({ sentence, index }))
    .filter(({ sentence }) => matchesEarnedRewardCue(sentence, rewardTerms))
    .map(({ index }) => index);

  if (candidateIndexes.length === 0) {
    return {
      passed: false,
      actual:
        'earned reward candidates=0, earned windows=0, strongest clue signals=0, strongest clue-handling actions=0, strongest inference signals=0, strongest passive exposition signals=0',
    };
  }

  let earnedWindows = 0;
  let strongestClueSignals = 0;
  let strongestClueHandlingActions = 0;
  let strongestInferenceSignals = 0;
  let strongestPassiveExpositionSignals = 0;
  let passiveRewardWindows = 0;

  for (const index of candidateIndexes) {
    const window = sentences.slice(Math.max(0, index - 1), index + 1).join(' ');
    const clueSignals = countMatches(
      window,
      /(사건\s*번호|번호|기록|로그|파일|로고|사진|녹음|좌표|주소|이름|서명|문서|메모|문자|메시지|알림|휴대폰|화면|수신자|표식|상처|흉터|피|유리|열쇠|카드|지도|타임스탬프|배지|증거|사망\s*시각)/gu
    );
    const clueHandlingActions = countMatches(
      window,
      /(다시\s*(?:쥐|확인|읽|살피|훑|대조|비교)|쥐었|쥔|움켜쥐|확인했|대조했|비교했|계산했|읽었|읽고|살폈|훑었|눌렀|열었|짚었|맞춰|추적|기록을\s*따라|로그를\s*따라)/gu
    );
    const inferenceSignals = countMatches(
      window,
      /(맞물|일치|겹치|연결|가리키|드러|굳어|좁혀|깨달|알아차|추론|의심|패턴|규칙|증명|결론이\s*아니라|때문에|그러자|자|끝에)/gu
    );
    const passiveExpositionSignals = countMatches(
      window,
      /(자동으로|저절로|설명했|설명했고|설명됐다|안내문|정리됐|정리되|알려졌|전달됐|보고서가|파일이\s*자동|창이\s*자동|화면\s*안내|나레이션|해설)/gu
    );

    strongestClueSignals = Math.max(strongestClueSignals, clueSignals);
    strongestClueHandlingActions = Math.max(
      strongestClueHandlingActions,
      clueHandlingActions
    );
    strongestInferenceSignals = Math.max(strongestInferenceSignals, inferenceSignals);
    strongestPassiveExpositionSignals = Math.max(
      strongestPassiveExpositionSignals,
      passiveExpositionSignals
    );

    if (passiveExpositionSignals >= 2) {
      passiveRewardWindows += 1;
    }

    if (
      clueSignals >= 2 &&
      clueHandlingActions >= 1 &&
      inferenceSignals >= 1 &&
      passiveExpositionSignals < 2
    ) {
      earnedWindows += 1;
    }
  }

  return {
    passed: earnedWindows > 0 && passiveRewardWindows === 0,
    actual:
      `earned reward candidates=${candidateIndexes.length}, earned windows=${earnedWindows}, ` +
      `passive reward windows=${passiveRewardWindows}, ` +
      `strongest clue signals=${strongestClueSignals}, ` +
      `strongest clue-handling actions=${strongestClueHandlingActions}, ` +
      `strongest inference signals=${strongestInferenceSignals}, ` +
      `strongest passive exposition signals=${strongestPassiveExpositionSignals}`,
  };
}

function assessManuscriptRewardFreshness(
  manuscript: string,
  chapterReward: string,
  noveltyAngle?: string,
  emotionalPayoff?: string
): ManuscriptRewardFreshnessAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  const rewardTerms = extractPayoffTerms(chapterReward);
  const candidateIndexes = sentences
    .map((sentence, index) => ({ sentence, index }))
    .filter(({ sentence }) => matchesEarnedRewardCue(sentence, rewardTerms))
    .map(({ index }) => index);

  if (candidateIndexes.length === 0) {
    return {
      passed: false,
      actual:
        'reward freshness candidates=0, earned reward windows=0, fresh reward windows=0, stale reward windows=0, strongest concrete clue signals=0, strongest premise mechanism signals=0, strongest rule-change signals=0, strongest genre payoff signals=0, strongest next-pressure signals=0',
    };
  }

  let earnedRewardWindows = 0;
  let freshRewardWindows = 0;
  let staleRewardWindows = 0;
  let strongestConcreteClueSignals = 0;
  let strongestPremiseMechanismSignals = 0;
  let strongestRuleChangeSignals = 0;
  let strongestGenrePayoffSignals = 0;
  let strongestNextPressureSignals = 0;
  let strongestGenericMatchSignals = 0;
  let strongestRewardSpecificHandlingActions = 0;

  for (const index of candidateIndexes) {
    const earnedWindow = sentences
      .slice(Math.max(0, index - 1), Math.min(sentences.length, index + 2))
      .join(' ');
    const rewardTurnWindow = sentences
      .slice(index, Math.min(sentences.length, index + 3))
      .join(' ');

    const concreteClueSignals = countMatches(
      earnedWindow,
      /(사건\s*번호|번호|기록|로그|파일|로고|사진|녹음|좌표|주소|이름|서명|문서|메모|문자|메시지|알림|휴대폰|화면|수신자|표식|상처|흉터|피|유리|열쇠|카드|지도|타임스탬프|배지|증거|사망\s*시각|카운트다운)/gu
    );
    const clueHandlingActions = countMatches(
      earnedWindow,
      /(다시\s*(?:쥐|확인|읽|살피|훑|대조|비교|눌)|쥐었|쥔|움켜쥐|확인했|대조했|비교했|계산했|읽었|읽고|살폈|훑었|눌렀|열었|짚었|맞춰|추적|기록을\s*따라|로그를\s*따라)/gu
    );
    const rewardSpecificHandlingActions = countMatches(
      rewardTurnWindow,
      /(다시\s*(?:쥐|확인|읽|살피|훑|대조|비교|눌)|쥐었|쥔|움켜쥐|확인했|대조했|비교했|읽었|읽고|살폈|훑었|눌렀|열었|짚었|맞춰|기록을\s*따라|로그를\s*따라)/gu
    );
    const inferenceSignals = countMatches(
      earnedWindow,
      /(맞물|일치|겹치|연결|가리키|드러|굳어|좁혀|깨달|알아차|추론|의심|패턴|규칙|증명|확인|때문에|그러자|끝에)/gu
    );

    const premiseMechanismSignals =
      countMatches(
        rewardTurnWindow,
        /(앱|예고|알림|수신자|카운트다운|규칙|좌표|표적|대상|로고|미제|실종|사건\s*번호|파일명|피해자|사망\s*시각|미래|아직\s*벌어지지\s*않|아직\s*일어나지\s*않)/gu
      ) +
      (noveltyAngle &&
      containsExpectedBeatEvidence(rewardTurnWindow, noveltyAngle, 0.25)
        ? 1
        : 0);
    const ruleChangeSignals = countMatches(
      rewardTurnWindow,
      /(규칙|바뀌|변하|뒤집|처음|이번|같은\s*초|일치|맞물|겹치|연결|드러|굳어|좁혀|선택|지목|예고|카운트다운|다음\s*(?:수신자|표적|대상)|새\s*(?:알림|예고|규칙|단서|사건)|되돌릴\s*수\s*없)/gu
    );
    const genrePayoffSignals =
      (hasEmbodiedTension(rewardTurnWindow) ? 1 : 0) +
      (emotionalPayoff &&
      containsExpectedBeatEvidence(rewardTurnWindow, emotionalPayoff, 0.2)
        ? 1
        : 0);
    const nextPressureSignals = countMatches(
      rewardTurnWindow,
      /(다음\s*(?:행동|수신자|표적|대상|사건|알림|질문)|계획을\s*접|우회|수단\s*전환|뛰쳐|향했|문턱|계단참|위치\s*반경|좁혀|표적|대상|위협|대가|손실|차단|잠갔|꺼뜨리|이름이\s*다음|새\s*(?:알림|예고|수신자|표적|대상|사건)|이름.{0,20}(?:깜박|연결))/gu
    );
    const genericMatchSignals = countMatches(
      rewardTurnWindow,
      /(단서가\s*나왔|단서를\s*발견|기록이\s*일치|로그가\s*일치|번호가\s*같|자료가\s*맞|정보를\s*얻|확인됐다|확인되었|알게\s*됐다|맞아떨어졌다는\s*첫\s*규칙은\s*확인)/gu
    );

    strongestConcreteClueSignals = Math.max(
      strongestConcreteClueSignals,
      concreteClueSignals
    );
    strongestPremiseMechanismSignals = Math.max(
      strongestPremiseMechanismSignals,
      premiseMechanismSignals
    );
    strongestRuleChangeSignals = Math.max(
      strongestRuleChangeSignals,
      ruleChangeSignals
    );
    strongestGenrePayoffSignals = Math.max(
      strongestGenrePayoffSignals,
      genrePayoffSignals
    );
    strongestNextPressureSignals = Math.max(
      strongestNextPressureSignals,
      nextPressureSignals
    );
    strongestGenericMatchSignals = Math.max(
      strongestGenericMatchSignals,
      genericMatchSignals
    );
    strongestRewardSpecificHandlingActions = Math.max(
      strongestRewardSpecificHandlingActions,
      rewardSpecificHandlingActions
    );

    const earnedRewardWindow =
      concreteClueSignals >= 2 &&
      clueHandlingActions >= 1 &&
      rewardSpecificHandlingActions >= 1 &&
      inferenceSignals >= 1;

    if (!earnedRewardWindow) {
      continue;
    }

    earnedRewardWindows += 1;

    const freshRewardWindow =
      concreteClueSignals >= 2 &&
      rewardSpecificHandlingActions >= 1 &&
      premiseMechanismSignals >= 2 &&
      ruleChangeSignals >= 2 &&
      genrePayoffSignals >= 1 &&
      nextPressureSignals >= 1 &&
      (genericMatchSignals < 2 || premiseMechanismSignals + ruleChangeSignals >= 6);

    if (freshRewardWindow) {
      freshRewardWindows += 1;
    } else {
      staleRewardWindows += 1;
    }
  }

  return {
    passed:
      earnedRewardWindows > 0 &&
      freshRewardWindows > 0,
    actual:
      `reward freshness candidates=${candidateIndexes.length}, ` +
      `earned reward windows=${earnedRewardWindows}, ` +
      `fresh reward windows=${freshRewardWindows}, ` +
      `stale reward windows=${staleRewardWindows}, ` +
      `strongest concrete clue signals=${strongestConcreteClueSignals}, ` +
      `strongest premise mechanism signals=${strongestPremiseMechanismSignals}, ` +
      `strongest rule-change signals=${strongestRuleChangeSignals}, ` +
      `strongest genre payoff signals=${strongestGenrePayoffSignals}, ` +
      `strongest next-pressure signals=${strongestNextPressureSignals}, ` +
      `strongest generic match signals=${strongestGenericMatchSignals}, ` +
      `strongest reward-specific handling actions=${strongestRewardSpecificHandlingActions}`,
  };
}

function assessManuscriptPayoffDelight(
  manuscript: string,
  chapterReward: string
): ManuscriptPayoffDelightAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  const rewardTerms = extractPayoffTerms(chapterReward);
  const candidateIndexes = sentences
    .map((sentence, index) => ({ sentence, index }))
    .filter(({ sentence }) => matchesEarnedRewardCue(sentence, rewardTerms))
    .map(({ index }) => index);

  if (candidateIndexes.length === 0) {
    return {
      passed: false,
      actual:
        'payoff delight candidates=0, delight windows=0, strongest pressure signals=0, strongest earned reveal signals=0, strongest lift signals=0, strongest embodied signals=0, strongest consequence signals=0',
    };
  }

  let delightWindows = 0;
  let strongestPressureSignals = 0;
  let strongestEarnedRevealSignals = 0;
  let strongestLiftSignals = 0;
  let strongestEmbodiedSignals = 0;
  let strongestConsequenceSignals = 0;

  for (const index of candidateIndexes) {
    const pressureWindow = sentences
      .slice(Math.max(0, index - 3), Math.min(sentences.length, index + 1))
      .join(' ');
    const rewardWindow = sentences
      .slice(Math.max(0, index - 1), Math.min(sentences.length, index + 2))
      .join(' ');
    const consequenceWindow = sentences
      .slice(index, Math.min(sentences.length, index + 4))
      .join(' ');

    const pressureSignals = countMatches(
      pressureWindow,
      /(대가|선택지가\s*닫|돌아갈\s*수\s*없|제한\s*시간|카운트다운|조명.{0,20}꺼|문.{0,20}잠|막힌|실패|위험|위협|손실|차단|통제선|철문|늦|피해자|구하려|사망|표적|대상|수신자)/gu
    );
    const earnedRevealSignals = countMatches(
      rewardWindow,
      /(?:(?:기록|로그|번호|파일|로고|좌표|사망\s*시각|피해자|휴대폰|화면|알림|규칙|단서).{0,80}(?:맞물|일치|겹치|연결|드러|굳|가리키|확인|증명)|(?:맞물|일치|겹치|연결|드러|굳|가리키|확인|증명).{0,80}(?:기록|로그|번호|파일|로고|좌표|사망\s*시각|피해자|휴대폰|화면|알림|규칙|단서))/gu
    );
    const liftSignals = countMatches(
      rewardWindow,
      /(첫\s*규칙|처음|비로소|마침내|드디어|굳어|의미|뜻|정체|배후|숨은|진짜|사실|단순.{0,20}아니|아니라|뒤집|반전|새로운\s*규칙|규칙이\s*바뀌|소름|전율|희열)/gu
    );
    const embodiedSignals = hasEmbodiedTension(rewardWindow) ? 1 : 0;
    const consequenceSignals = countMatches(
      consequenceWindow,
      /(다음\s*(?:수신자|표적|대상|사건|알림|행동|질문)|새\s*(?:알림|예고|규칙|단서|위협|표적|대상)|과거\s*미제|개발자|실종|연결|겹치|드러|계획을\s*바꿔|우회|향했|왜|어떻게|알\s*수\s*없|남았|대가|손실|위협)/gu
    );

    strongestPressureSignals = Math.max(strongestPressureSignals, pressureSignals);
    strongestEarnedRevealSignals = Math.max(
      strongestEarnedRevealSignals,
      earnedRevealSignals
    );
    strongestLiftSignals = Math.max(strongestLiftSignals, liftSignals);
    strongestEmbodiedSignals = Math.max(strongestEmbodiedSignals, embodiedSignals);
    strongestConsequenceSignals = Math.max(
      strongestConsequenceSignals,
      consequenceSignals
    );

    if (
      pressureSignals >= 2 &&
      earnedRevealSignals >= 1 &&
      liftSignals >= 1 &&
      embodiedSignals >= 1 &&
      consequenceSignals >= 1
    ) {
      delightWindows += 1;
    }
  }

  return {
    passed: delightWindows > 0,
    actual:
      `payoff delight candidates=${candidateIndexes.length}, delight windows=${delightWindows}, ` +
      `strongest pressure signals=${strongestPressureSignals}, ` +
      `strongest earned reveal signals=${strongestEarnedRevealSignals}, ` +
      `strongest lift signals=${strongestLiftSignals}, ` +
      `strongest embodied signals=${strongestEmbodiedSignals}, ` +
      `strongest consequence signals=${strongestConsequenceSignals}`,
  };
}

const QUESTION_LADDER_ANSWER_PATTERN =
  /(?:(?:규칙|단서|답|진실|정체|실체|배후|연결|번호|기록|로그|파일|로고|알림|사망\s*시각|피해자|휴대폰|수신자|표적|미제).{0,90}(?:맞물|일치|겹치|연결됐|연결되|드러|밝혀|확인했|확인됐|확인되|발견했|발견됐|증명됐|증명되|굳어|깨달|알아차|가리키|풀렸|설명됐|설명되|남았)|(?:맞물|일치|겹치|연결됐|연결되|드러|밝혀|확인했|확인됐|확인되|발견했|발견됐|증명됐|증명되|굳어|깨달|알아차|가리키|풀렸|설명됐|설명되|남았).{0,90}(?:규칙|단서|답|진실|정체|실체|배후|번호|기록|로그|파일|로고|알림|사망\s*시각|피해자|휴대폰|수신자|표적|미제))/u;

const QUESTION_LADDER_NEW_QUESTION_PATTERN =
  /(왜|어떻게|누가|무엇|어디|언제|무슨|어느|\?|？|알\s*수\s*없|풀리지\s*않|밝혀지지\s*않|설명되지\s*않|남았|숨었|감춰|더\s*(?:깊|큰|위험|새)|새\s*(?:의문|질문|위협|표적|수신자|알림|규칙|단서|사건|번호|파일|메시지)|다음\s*(?:질문|수신자|표적|대상|사건|알림|행동)|배후|숨은\s*(?:손|인물|개발자|범인)|남은\s*(?:대가|비용|위협|미스터리|질문)|미제|실종|비밀|정체|개발자)/gu;

const QUESTION_LADDER_CLOSURE_PATTERN =
  /(모든\s*(?:의문|질문|미스터리|비밀).{0,30}(?:풀|해결|밝혀|드러)|더\s*(?:궁금|의문).{0,20}(?:없|않)|답(?:을)?\s*(?:찾|얻)|전부\s*(?:설명|해결|정리)|모두\s*(?:설명|해결|밝혀|풀)|설명됐|설명되었|사건이\s*해결|종결|끝났|마무리|정리되|안도|안심)/gu;

function assessManuscriptQuestionLadder(
  manuscript: string
): ManuscriptQuestionLadderAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  const answerIndexes = sentences
    .map((sentence, index) => ({ sentence, index }))
    .filter(({ sentence }) => QUESTION_LADDER_ANSWER_PATTERN.test(sentence))
    .map(({ index }) => index);

  if (answerIndexes.length === 0) {
    return {
      passed: false,
      actual:
        'answer/reveal candidates=0, question ladder windows=0, closure windows=0, strongest new-question signals=0',
    };
  }

  let ladderWindows = 0;
  let closureWindows = 0;
  let strongestNewQuestionSignals = 0;
  let strongestClosureSignals = 0;

  for (const index of answerIndexes) {
    const window = sentences.slice(index, Math.min(sentences.length, index + 3)).join(' ');
    const newQuestionSignals = countMatches(
      window,
      QUESTION_LADDER_NEW_QUESTION_PATTERN
    );
    const closureSignals = countMatches(window, QUESTION_LADDER_CLOSURE_PATTERN);

    strongestNewQuestionSignals = Math.max(
      strongestNewQuestionSignals,
      newQuestionSignals
    );
    strongestClosureSignals = Math.max(strongestClosureSignals, closureSignals);

    if (closureSignals > 0) {
      closureWindows += 1;
    }

    if (newQuestionSignals >= 1 && closureSignals === 0) {
      ladderWindows += 1;
    }
  }

  return {
    passed: ladderWindows === answerIndexes.length && closureWindows === 0,
    actual:
      `answer/reveal candidates=${answerIndexes.length}, ` +
      `question ladder windows=${ladderWindows}, closure windows=${closureWindows}, ` +
      `strongest new-question signals=${strongestNewQuestionSignals}, ` +
      `strongest closure signals=${strongestClosureSignals}`,
  };
}

function matchesEarnedRewardCue(sentence: string, rewardTerms: string[]): boolean {
  if (
    /(chapter_reward|독자\s*보상|보상\s*주기|규칙\s*증명|첫\s*규칙|맞아떨어|단서.*맞물|맞물|지적\s*쾌감|쾌감)/u.test(
      sentence
    )
  ) {
    return true;
  }

  if (rewardTerms.length === 0) {
    return false;
  }

  const normalizedSentence = normalizeText(sentence);
  const matchedTerms = rewardTerms.filter(term => normalizedSentence.includes(term)).length;
  return matchedTerms >= Math.min(2, rewardTerms.length);
}

interface ManuscriptGenreDelightAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface GenreDelightSignal {
  label: string;
  pattern: RegExp;
}

interface GenreDelightProfile {
  label: string;
  promisePattern: RegExp;
  minimumSignals: number;
  expected: string;
  signals: GenreDelightSignal[];
}

const GENRE_DELIGHT_PROFILES: GenreDelightProfile[] = [
  {
    label: 'mystery',
    promisePattern: /(미스터리|추리|수수께끼|단서|지적\s*쾌감|알리바이|범인|진실)/u,
    minimumSignals: 3,
    expected:
      'genre-specific delight: mystery payoff should combine clue convergence, protagonist inference/action, and a sharper unresolved suspicion or question.',
    signals: [
      {
        label: 'clue convergence',
        pattern:
          /((단서|기록|로그|파일|번호|로고|휴대폰|시각|알림).{0,28}(맞물|겹치|연결|같은|빈칸|굳어|드러났|확인)|(맞물|겹치|연결).{0,28}(단서|기록|로그|파일|번호|로고|휴대폰|시각|알림))/u,
      },
      {
        label: 'protagonist inference/action',
        pattern:
          /(패턴을\s*먼저\s*읽|계산|추론|대조|확인하려|확인하|다시\s*눌렀|다시\s*쥐|단서로\s*다음\s*행동|파일.{0,16}겹치)/u,
      },
      {
        label: 'unresolved suspicion',
        pattern:
          /(왜|어떻게|누가|알\s*수\s*없는|첫\s*수신자|다음\s*수신자|개발자|미제|실종|숨은|배후)/u,
      },
      {
        label: 'embodied suspicion',
        pattern: /(목덜미|손바닥|식은\s*땀|숨|가슴|등골|눈앞|움켜쥔|멈췄|조였)/u,
      },
    ],
  },
  {
    label: 'romance',
    promisePattern: /(로맨스|연애|설렘|고백|심쿵|관계\s*회복|애정|사랑|다정|따뜻함)/u,
    minimumSignals: 3,
    expected:
      'genre-specific delight: romance payoff should combine proximity or touch, vulnerable exchange, relationship choice/cost, and embodied warmth.',
    signals: [
      {
        label: 'proximity/touch',
        pattern:
          /(시선|눈빛|눈을|손끝|손을|손목|어깨|곁|옆자리|거리|다가|마주|붙잡|잡은|잡았다|스치|기댔|안았|품|입맞춤)/u,
      },
      {
        label: 'vulnerable exchange',
        pattern:
          /("[^"]*(미안|고마|믿|기다렸|좋아|사랑|두려|무서|가지\s*마|괜찮)[^"]*"|'[^']*(미안|고마|믿|기다렸|좋아|사랑|두려|무서|가지\s*마|괜찮)[^']*'|미안|고맙|믿어|기다렸|좋아해|사랑|두렵|가지\s*마|말끝|속삭|대답했|물었다)/u,
      },
      {
        label: 'relationship choice/cost',
        pattern:
          /(다가서|물러서|붙잡|놓아주|기다리기로|기다렸다|포기했|지키려|오해를\s*풀|용서하|고백하|상처를\s*말|떠나려는|관계를\s*(?:지키|회복|끊|고치)(?:려|기\s*위해|려고|기로|겠|했다|한다))/u,
      },
      {
        label: 'embodied warmth',
        pattern: /(두근|가슴|숨|볼|귀끝|온기|따뜻|미소|입꼬리|떨|손바닥|손끝|달아오)/u,
      },
    ],
  },
  {
    label: 'action',
    promisePattern: /(액션|추격|추격전|전투|난투|반격|격투|총격|검격|활극|폭발|전장)/u,
    minimumSignals: 4,
    expected:
      'genre-specific delight: action payoff should combine kinetic sequence, spatial blocking, tactical reversal, and physical consequence.',
    signals: [
      {
        label: 'kinetic sequence',
        pattern:
          /(추격|질주|돌진|뛰어들|미끄러|구르|피하|넘어|부딪|난투|격돌|총성|폭발|차량|검격|주먹|발차기|베어|찔렀|쏘았|쏜)/u,
      },
      {
        label: 'spatial blocking',
        pattern:
          /((복도|계단|옥상|차량|골목|문턱|창문|난간|엘리베이터|지하도|교각|컨테이너).{0,30}(막|좁|가로막|우회|뛰어넘|파고들|엄폐|거리)|(막|좁|가로막|우회|뛰어넘|파고들|엄폐|거리).{0,30}(복도|계단|옥상|차량|골목|문턱|창문|난간|엘리베이터|지하도|교각|컨테이너))/u,
      },
      {
        label: 'tactical reversal',
        pattern:
          /(반격|역공|허를\s*찔|빈틈|엄폐|우회|몸을\s*낮추|방향을\s*틀|미끼|제압|무력화|붙잡|돌려세웠|뒤집)/u,
      },
      {
        label: 'physical consequence',
        pattern:
          /(피가|피를|피로|피투성이|핏방울|피\s*냄새|상처|통증|갈비뼈|숨이\s*막|어깨가\s*빠|타박|충격|부러|찢어|넘어졌|쓰러졌|탄환|파편|화상|멍)/u,
      },
    ],
  },
  {
    label: 'thriller',
    promisePattern: /(스릴러|압박|반전\s*공포|서스펜스|서스팬스|심리\s*전|추적자|협박|감시|감금|음모|덫|함정)/u,
    minimumSignals: 4,
    expected:
      'genre-specific delight: thriller payoff should combine tightening threat, trap escalation, deceptive reversal, forced choice, and embodied dread.',
    signals: [
      {
        label: 'tightening threat',
        pattern:
          /((제한\s*시간|시한|카운트다운|초침|마감|감시|미행|추적|위협).{0,24}(다가|줄어|좁혀|울리|보이|확인)|(다가|줄어|좁혀|울리|확인).{0,24}(제한\s*시간|시한|카운트다운|초침|마감|감시|미행|추적|위협))/u,
      },
      {
        label: 'trap escalation',
        pattern:
          /(덫|함정|문이\s*잠|잠겨|봉쇄|감금|빠져나갈|탈출|통제선|도망칠\s*길|출구가\s*닫)/u,
      },
      {
        label: 'deceptive reversal',
        pattern:
          /(거짓|가짜|위장|배신|반전|함정이었|속였|미끼|알고\s*보니|정체|숨겨진)/u,
      },
      {
        label: 'forced choice',
        pattern:
          /(협박|거래|선택지|침묵하|신고하면|넘기면|버리면|희생|대신|누명을|알리바이)/u,
      },
      {
        label: 'embodied dread',
        pattern: /(식은\s*땀|손바닥|목덜미|숨이\s*막|심장|등골|떨|마른침|피가\s*식)/u,
      },
    ],
  },
  {
    label: 'modern-fantasy',
    promisePattern:
      /(현대\s*판타지|현판|헌터|게이트|상태창|시스템|퀘스트|랭킹|랭커|스킬|레벨|던전|각성)/u,
    minimumSignals: 4,
    expected:
      'genre-specific delight: modern-fantasy payoff should combine system feedback, tactical rule or skill use, cost or limit, and real-world consequence or status change.',
    signals: [
      {
        label: 'system feedback',
        pattern:
          /((상태창|시스템|퀘스트|메시지|스킬|레벨|등급|랭킹|칭호).{0,24}(떴|울렸|표시|갱신|상승|하락|개방|획득|실패|성공)|(떴|울렸|표시|갱신|상승|하락|개방|획득|실패|성공).{0,24}(상태창|시스템|퀘스트|메시지|스킬|레벨|등급|랭킹|칭호))/u,
      },
      {
        label: 'tactical rule/skill use',
        pattern:
          /((스킬|능력|상태창|시스템|퀘스트|게이트|던전|레벨|각성).{0,30}(활용|응용|계산|겨냥|막아|구했|돌파|공략|해제|봉쇄)|(활용|응용|계산|겨냥|막아|구했|돌파|공략|해제|봉쇄).{0,30}(스킬|능력|상태창|시스템|퀘스트|게이트|던전|레벨|각성))/u,
      },
      {
        label: 'cost/limit',
        pattern:
          /((스킬|능력|상태창|시스템|퀘스트|게이트|던전|레벨|각성).{0,24}(쿨타임|대가|패널티|소모|부작용|제한|실패|봉쇄|피로|통증)|(쿨타임|대가|패널티|소모|부작용|제한|실패|봉쇄|피로|통증).{0,24}(스킬|능력|상태창|시스템|퀘스트|게이트|던전|레벨|각성))/u,
      },
      {
        label: 'real-world consequence',
        pattern:
          /((길드|협회|랭킹|뉴스|계좌|병원|회사|가족|학교|경찰|계약|세금|보험|민원|SNS|방송|부동산).{0,30}(바뀌|통보|압박|추적|공개|압류|취소|입금|해고|구속|호출)|(바뀌|통보|압박|추적|공개|압류|취소|입금|해고|구속|호출).{0,30}(길드|협회|랭킹|뉴스|계좌|병원|회사|가족|학교|경찰|계약|세금|보험|민원|SNS|방송|부동산))/u,
      },
      {
        label: 'rank/status change',
        pattern:
          /((등급|랭킹|랭커|레벨|칭호|권한|입장권|게이트|던전).{0,20}(상승|하락|변경|개방|박탈|갱신|획득)|(상승|하락|변경|개방|박탈|갱신|획득).{0,20}(등급|랭킹|랭커|레벨|칭호|권한|입장권|게이트|던전))/u,
      },
    ],
  },
  {
    label: 'fantasy',
    promisePattern:
      /(판타지|마법|주술|능력|스킬|던전|헌터|회귀|각성|레벨|성좌|마나|검기|영약|용|신성력)/u,
    minimumSignals: 4,
    expected:
      'genre-specific delight: fantasy payoff should combine rule manifestation, cost or limit, wonder image, and changed capability or consequence.',
    signals: [
      {
        label: 'rule manifestation',
        pattern:
          /((마법|주문|마나|스킬|능력|룬|문양|레벨|각성|성좌|던전|규칙).{0,28}(발동|깨닫|드러|바뀌|반응|열리|빛나|깨어|증명)|(발동|깨닫|드러|바뀌|반응|열리|빛나|깨어|증명).{0,28}(마법|주문|마나|스킬|능력|룬|문양|레벨|각성|성좌|던전|규칙))/u,
      },
      {
        label: 'cost/limit',
        pattern:
          /((마법|주문|마나|스킬|능력|각성|규칙|금지|던전|성좌).{0,24}(대가|한계|통증|소모|잃|타버|균열|부작용|역류|저주|수명|상처|피)|(대가|한계|통증|소모|잃|타버|균열|부작용|역류|저주|수명|상처|피).{0,24}(마법|주문|마나|스킬|능력|각성|규칙|금지|던전|성좌)|금지된\s*(마법|주문|스킬|능력|규칙))/u,
      },
      {
        label: 'wonder image',
        pattern:
          /(빛|문양|룬|불꽃|얼음|그림자|별빛|균열|공중|마법진|세계|문이\s*열|파문|날개|검기|마나)/u,
      },
      {
        label: 'changed capability/consequence',
        pattern:
          /(새\s*능력|능력이\s*바뀌|규칙이\s*바뀌|문이\s*열|다음\s*층|등급|레벨|전투가\s*바뀌|몸이\s*움직|길이\s*열|봉인이\s*풀|각성했)/u,
      },
    ],
  },
];

function formatGenreDelightSignals(signals: string[]): string {
  return signals.length > 0 ? signals.join(', ') : 'none';
}

function assessManuscriptGenreDelight(
  manuscript: string,
  emotionalPayoff: string,
  chapterReward: string
): ManuscriptGenreDelightAssessment {
  const promiseText = `${emotionalPayoff} ${chapterReward}`;
  let profiles = GENRE_DELIGHT_PROFILES.filter(profile =>
    profile.promisePattern.test(promiseText)
  );

  if (profiles.some(profile => profile.label === 'modern-fantasy')) {
    profiles = profiles.filter(profile => profile.label !== 'fantasy');
  }

  if (profiles.length === 0) {
    return {
      passed: true,
      expected: 'genre-specific delight: unclassified payoff profile.',
      actual: 'genre delight profile=unclassified',
    };
  }

  for (const profile of profiles) {
    const matchedSignals = profile.signals
      .filter(signal => signal.pattern.test(manuscript))
      .map(signal => signal.label);

    if (matchedSignals.length < profile.minimumSignals) {
      const missingSignals = profile.signals
        .map(signal => signal.label)
        .filter(label => !matchedSignals.includes(label));

      return {
        passed: false,
        expected: profile.expected,
        actual:
          `genre delight profile=${profile.label}, matched signals=${formatGenreDelightSignals(matchedSignals)}, ` +
          `missing signals=${formatGenreDelightSignals(missingSignals)}`,
      };
    }
  }

  return {
    passed: true,
    expected: profiles.map(profile => profile.expected).join(' / '),
    actual:
      `genre delight profiles=${profiles.map(profile => profile.label).join(', ')}, ` +
      'matched required genre signals',
  };
}

function assessManuscriptPayoffEmbodiment(
  manuscript: string,
  emotionalPayoff?: string
): ManuscriptPayoffEmbodimentAssessment {
  const sentences = splitManuscriptSentences(manuscript);
  const payoffTerms = extractPayoffTerms(emotionalPayoff);
  const payoffIndexes = sentences
    .map((sentence, index) => ({ sentence, index }))
    .filter(({ sentence }) => matchesPayoffCue(sentence, payoffTerms))
    .map(({ index }) => index);

  if (payoffIndexes.length === 0) {
    return {
      passed: true,
      actual: 'payoff sentences=0, embodied windows=0',
    };
  }

  const embodiedWindows = payoffIndexes.filter(index => {
    const window = sentences.slice(Math.max(0, index - 1), index + 2).join(' ');
    return /(목덜미|목구멍|목울대|손바닥|손끝|심장|가슴|숨|입\s*안|혀끝|피부|등골|어깨|볼|얼굴|귀끝|입꼬리|눈물|미소|웃음|땀|두근|달아오|떨리|떨림|떨었|떨었다|떨렸다|떨며|떨고|조였|얼음|차갑|뜨겁|젖은|냄새|소리|귓속|쓴맛|비린내|철\s*냄새|시야|눈앞|무릎|발끝|삼켰|쥐었|움켜쥐|멈췄|뛰었)/u.test(window);
  }).length;

  return {
    passed: embodiedWindows > 0,
    actual: `payoff sentences=${payoffIndexes.length}, embodied windows=${embodiedWindows}`,
  };
}

function extractPayoffTerms(emotionalPayoff?: string): string[] {
  const stopWords = new Set([
    '그리고',
    '하지만',
    '동시에',
    '직전',
    '관계',
    '회차',
    '작은',
    '큰',
    '매',
  ]);
  const terms = normalizeText(emotionalPayoff ?? '')
    .split(/\s+/u)
    .map(token => token.replace(/(으로|에서|에게|부터|까지|처럼|이라는|라는|과|와|의|을|를|이|가|은|는|도|만|로|에)$/u, ''))
    .filter(token => token.length >= 2 && !stopWords.has(token));

  return [...new Set(terms)];
}

function matchesPayoffCue(sentence: string, payoffTerms: string[]): boolean {
  if (/(단서.*맞물|맞물리|지적\s*쾌감|쾌감|긴장감|카타르시스|보상|희열)/u.test(sentence)) {
    return true;
  }

  if (payoffTerms.length === 0) {
    return false;
  }

  const normalizedSentence = normalizeText(sentence);
  const matchedTerms = payoffTerms.filter(term => normalizedSentence.includes(term)).length;
  return matchedTerms >= Math.min(2, payoffTerms.length);
}

interface ManuscriptFatigueControlAssessment {
  passed: boolean;
  actual: string;
}

function assessManuscriptFatigueControls(
  manuscript: string,
  fatigueControls: string[]
): ManuscriptFatigueControlAssessment {
  const matchedControls = fatigueControls.filter(control =>
    hasFatigueControlEvidence(manuscript, control)
  ).length;
  const repeatedInvestigationSignals = countMatches(
    manuscript,
    /(확인했|확인했다|대조했|대조했다|기록했|기록했다|분석했|분석했다|검토했|검토했다|살폈|살폈다|훑었|훑었다)/gu
  );
  const variationSignals = countMatches(
    manuscript,
    /(관계\s*압박|관계\s*긴장|물리적\s*장소|장소\s*변주|장소가\s*바뀌|현장이\s*바뀌|위치|건물|옆\s*건물|골목|계단|엘리베이터|차량|옥상|병원|경찰서|지하|빗속|군중|조력자|배신|신뢰|불신|고백|침묵|말끝|시선|감정\s*리셋|호흡|숨을\s*고르|잠깐\s*멈|대화|몸을\s*돌|문을\s*박차|뛰쳐나)/gu
  );
  const repeatedBeatPenalty = repeatedInvestigationSignals >= 5 && variationSignals === 0;

  return {
    passed: matchedControls > 0 && !repeatedBeatPenalty,
    actual:
      `matched fatigue_controls=${matchedControls}/${fatigueControls.length}, ` +
      `repeated investigation signals=${repeatedInvestigationSignals}, ` +
      `variation/reset signals=${variationSignals}`,
  };
}

function hasFatigueControlEvidence(evidence: string, control: string): boolean {
  if (containsExpectedBeatEvidence(evidence, control, 0.3)) {
    return true;
  }

  const normalizedEvidence = normalizeText(evidence);
  const controlTerms = extractFatigueControlTerms(control);
  if (controlTerms.length === 0) {
    return false;
  }

  const matchedTerms = controlTerms.filter(term => normalizedEvidence.includes(term));
  if (matchedTerms.length >= Math.min(3, controlTerms.length)) {
    return true;
  }

  const requiredFamilies = extractFatigueControlFamilies(control);
  if (requiredFamilies.size === 0) {
    return false;
  }

  return [...requiredFamilies].some(family => fatigueFamilyPattern(family).test(evidence));
}

function extractFatigueControlTerms(control: string): string[] {
  const stopWords = new Set([
    '위해',
    '또는',
    '그리고',
    '대신',
    '같은',
    '장면',
    '회차',
    '넣는다',
    '넣기',
    '막기',
    '방지',
    '반복',
    '피로도',
    '조절',
    '한다',
  ]);
  const terms = normalizeText(control)
    .split(/\s+/u)
    .map(token => token.replace(/(으로|에서|에게|부터|까지|처럼|이라는|라는|과|와|의|을|를|이|가|은|는|도|만|로|에)$/u, ''))
    .filter(token => token.length >= 2 && !stopWords.has(token));

  return [...new Set(terms)];
}

function extractFatigueControlFamilies(control: string): Set<string> {
  const families = new Set<string>();
  if (/(관계|조력자|배신|신뢰|불신|고백|침묵|대화)/u.test(control)) {
    families.add('relationship');
  }
  if (/(장소|공간|현장|골목|옥상|병원|경찰서|차량|지하|빗속)/u.test(control)) {
    families.add('location');
  }
  if (/(행동|추격|잠입|대화|협상|전투|도주|침투|추적)/u.test(control)) {
    families.add('action-mode');
  }
  if (/(감정|호흡|휴지|리셋|완급|정적|침묵|여운)/u.test(control)) {
    families.add('reset');
  }
  return families;
}

function fatigueFamilyPattern(family: string): RegExp {
  switch (family) {
    case 'relationship':
      return /(관계\s*압박|관계\s*긴장|조력자|배신|신뢰|불신|고백|침묵|말끝|시선|대화|믿)/u;
    case 'location':
      return /(물리적\s*장소|장소\s*변주|장소가\s*바뀌|현장이\s*바뀌|위치|건물|옆\s*건물|골목|계단|엘리베이터|차량|옥상|병원|경찰서|지하|빗속|군중)/u;
    case 'action-mode':
      return /(추격|잠입|협상|전투|도주|침투|추적|몸을\s*돌|문을\s*박차|뛰쳐나|붙잡|밀어붙)/u;
    case 'reset':
      return /(감정\s*리셋|호흡|숨을\s*고르|잠깐\s*멈|정적|침묵|여운|완급|손을\s*떼|눈을\s*감)/u;
    default:
      return /$a/u;
  }
}

interface SerialEscalationVarietyResult {
  metadataFailures: number;
  manuscriptFailures: number;
}

interface SerialEscalationVarietyAssessment {
  passed: boolean;
  repetitive: boolean;
  expected: string;
  actual: string;
}

function evaluateSerialEscalationVariety(
  chapter: ChapterWithReaderExperience,
  previousChapters: ChapterWithReaderExperience[],
  manuscript: string | undefined,
  previousManuscripts: string[],
  issues: EngagementContractIssue[]
): SerialEscalationVarietyResult {
  const result: SerialEscalationVarietyResult = {
    metadataFailures: 0,
    manuscriptFailures: 0,
  };
  const previousChapter = latestPreviousChapter(chapter, previousChapters);

  if (previousChapter !== undefined) {
    const metadataAssessment = assessSerialEscalationVariety(
      chapterToSerialVarietyEvidenceText(chapter),
      chapterToSerialVarietyEvidenceText(previousChapter)
    );
    if (!metadataAssessment.passed) {
      issues.push({
        code: 'serial-escalation-variety-not-staged',
        severity: 'critical',
        message:
          'This chapter repeats the prior chapter reward, investigation, alert, or location pattern without a new escalation axis.',
        expected: metadataAssessment.expected,
        actual: metadataAssessment.actual,
      });
      result.metadataFailures++;
    }
  }

  const latestPreviousManuscript = latestNonEmptyText(previousManuscripts);
  if (manuscript?.trim() && latestPreviousManuscript) {
    const manuscriptAssessment = assessSerialEscalationVariety(
      manuscript,
      latestPreviousManuscript
    );
    if (!manuscriptAssessment.passed) {
      issues.push({
        code: 'manuscript-serial-escalation-variety-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript repeats the prior chapter beat pattern on page without staging a new escalation axis.',
        expected: manuscriptAssessment.expected,
        actual: manuscriptAssessment.actual,
      });
      result.manuscriptFailures++;
    }
  }

  return result;
}

function latestPreviousChapter(
  chapter: ChapterWithReaderExperience,
  previousChapters: ChapterWithReaderExperience[]
): ChapterWithReaderExperience | undefined {
  const candidates = previousChapters
    .filter(previousChapter => previousChapter !== undefined)
    .filter(previousChapter => previousChapter.chapter_number < chapter.chapter_number)
    .sort((left, right) => left.chapter_number - right.chapter_number);

  if (candidates.length > 0) {
    return candidates[candidates.length - 1];
  }

  return previousChapters.length > 0 ? previousChapters[previousChapters.length - 1] : undefined;
}

function latestNonEmptyText(values: string[]): string | undefined {
  for (let index = values.length - 1; index >= 0; index--) {
    const value = values[index]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
}

function assessSerialEscalationVariety(
  currentEvidence: string,
  previousEvidence: string
): SerialEscalationVarietyAssessment {
  const currentFamilies = extractSerialBeatFamilies(currentEvidence);
  const previousFamilies = extractSerialBeatFamilies(previousEvidence);
  const repeatedFamilies = [...currentFamilies].filter(family =>
    previousFamilies.has(family)
  );
  const similarity = textSimilarity(
    normalizeText(currentEvidence),
    normalizeText(previousEvidence)
  );
  const currentAxes = extractSerialEscalationAxes(currentEvidence);
  const previousAxes = extractSerialEscalationAxes(previousEvidence);
  const newAxes = [...currentAxes].filter(axis => !previousAxes.has(axis));
  const repetitive = repeatedFamilies.length >= 4 || similarity >= 0.46;

  return {
    passed: !repetitive || newAxes.length > 0,
    repetitive,
    expected:
      'serial escalation variety: 회차 간 반복 보상, 조사, 알림, 현장 실패 패턴은 새 갈등 축(관계 파열, 반대세력 countermove, 장소/행동 방식 변주, 규칙 변화, 대가 상승, 되돌릴 수 없는 판도 변화)으로 변주해야 한다.',
    actual:
      `repeated beat families=${repeatedFamilies.join(', ') || 'none'}, ` +
      `similarity=${similarity.toFixed(2)}, ` +
      `current axes=${[...currentAxes].join(', ') || 'none'}, ` +
      `previous axes=${[...previousAxes].join(', ') || 'none'}, ` +
      `new axes=${newAxes.join(', ') || 'none'}, ` +
      `current="${abbreviateEvidence(currentEvidence, 260)}"`,
  };
}

function extractSerialBeatFamilies(evidence: string): Set<string> {
  const families = new Set<string>();
  if (/(알림|예고|메시지|앱|수신자)/u.test(evidence)) {
    families.add('alert');
  }
  if (/(로그|기록|파일|단서|분석|확인|대조|추리|번호|자료)/u.test(evidence)) {
    families.add('investigation');
  }
  if (/(제한\s*시간|카운트다운|초|분|이미\s*시작|시각|시간)/u.test(evidence)) {
    families.add('deadline');
  }
  if (/(현장|장소|위치|좌표|지하보도|건물|기록실|경찰서|통제선)/u.test(evidence)) {
    families.add('location');
  }
  if (/(피해자|사망|죽|실패|구하지\s*못|조명|꺼지|쓰러)/u.test(evidence)) {
    families.add('victim-failure');
  }
  if (/(휴대폰|폰|로고|앱)/u.test(evidence)) {
    families.add('phone-app-clue');
  }
  if (/(이동|달려|뛰쳐나|도착|향해|추적|쫓|경로)/u.test(evidence)) {
    families.add('movement');
  }
  return families;
}

function extractSerialEscalationAxes(evidence: string): Set<string> {
  const axes = new Set<string>();
  if (/(조력자|관계|신뢰|불신|배신|고백|약점|의심|거절|화해|사과|동행|보호)/u.test(evidence)) {
    axes.add('relationship');
  }
  if (/(박도현|범인|가해자|적대|반대\s*세력|함정|조작|표적|유인|협박|감시|역공|countermove|카운터무브)/u.test(evidence)) {
    axes.add('opposition-countermove');
  }
  if (/(규칙.{0,10}바뀌|새로운?\s*규칙|방식.{0,10}바뀌|패턴.{0,10}바뀌|경로.{0,10}바꾸|조건.{0,10}바뀌|반경|이미\s*시작|두\s*번째|두번째)/u.test(evidence)) {
    axes.add('rule-change');
  }
  if (/(정체.{0,10}노출|체포|가족|동생|조력자.{0,12}위험|증거.{0,12}(?:빼앗|잃|사라)|목숨|희생|돌이킬\s*수\s*없|회복\s*불가|고립|발각)/u.test(evidence)) {
    axes.add('higher-cost');
  }
  if (/(경찰서|기록실|병원|옥상|차량|골목|서버실|옆\s*건물|잠입|협상|도주|추격|침투|장소\s*변주|장소가\s*바뀌|행동\s*방식\s*변주)/u.test(evidence)) {
    axes.add('setting-action-variation');
  }
  if (/(빼앗|사라졌|발각|공개|고립|확정|되돌릴\s*수\s*없|잠겼|봉쇄|배신|돌이킬\s*수\s*없는\s*판도)/u.test(evidence)) {
    axes.add('irreversible-state-change');
  }
  return axes;
}

interface SerialRewardPatternVariationResult {
  metadataFailures: number;
  manuscriptFailures: number;
}

interface SerialRewardPatternVariationAssessment {
  passed: boolean;
  repetitive: boolean;
  expected: string;
  actual: string;
}

function evaluateSerialRewardPatternVariation(
  chapter: ChapterWithReaderExperience,
  previousChapters: ChapterWithReaderExperience[],
  manuscript: string | undefined,
  previousManuscripts: string[],
  issues: EngagementContractIssue[]
): SerialRewardPatternVariationResult {
  const result: SerialRewardPatternVariationResult = {
    metadataFailures: 0,
    manuscriptFailures: 0,
  };
  const previousChapter = latestPreviousChapter(chapter, previousChapters);
  const currentReward = chapter.reader_experience?.chapter_reward?.trim();
  const previousReward = previousChapter?.reader_experience?.chapter_reward?.trim();

  if (currentReward && previousReward && chapter.chapter_number > 1) {
    const metadataAssessment = assessSerialRewardPatternVariation(
      currentReward,
      previousReward
    );
    if (!metadataAssessment.passed) {
      issues.push({
        code: 'serial-reward-pattern-repetition-not-staged',
        severity: 'critical',
        message:
          'This chapter repeats the prior chapter reward delivery pattern instead of varying how the reader payoff arrives.',
        expected: metadataAssessment.expected,
        actual: metadataAssessment.actual,
      });
      result.metadataFailures++;
    }
  }

  const latestPreviousManuscript = latestNonEmptyText(previousManuscripts);
  if (manuscript?.trim() && latestPreviousManuscript) {
    const currentRewardEvidence = manuscriptToSerialRewardPatternEvidenceText(manuscript);
    const previousRewardEvidence =
      manuscriptToSerialRewardPatternEvidenceText(latestPreviousManuscript);

    if (currentRewardEvidence && previousRewardEvidence) {
      const manuscriptAssessment = assessSerialRewardPatternVariation(
        currentRewardEvidence,
        previousRewardEvidence
      );
      if (!manuscriptAssessment.passed) {
        issues.push({
          code: 'manuscript-serial-reward-pattern-repetition-not-evidenced',
          severity: 'critical',
          message:
            'The manuscript repeats the prior chapter reward delivery pattern on page instead of varying the payoff mechanism.',
          expected: manuscriptAssessment.expected,
          actual: manuscriptAssessment.actual,
        });
        result.manuscriptFailures++;
      }
    }
  }

  return result;
}

function manuscriptToSerialRewardPatternEvidenceText(manuscript: string): string {
  const sentences = splitManuscriptSentences(manuscript);
  return sentences
    .map((sentence, index) => ({ sentence, index }))
    .filter(({ sentence }) => matchesEarnedRewardCue(sentence, []))
    .map(({ index }) =>
      sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ')
    )
    .join(' ');
}

function assessSerialRewardPatternVariation(
  currentRewardEvidence: string,
  previousRewardEvidence: string
): SerialRewardPatternVariationAssessment {
  const currentFamilies = extractSerialRewardPatternFamilies(currentRewardEvidence);
  const previousFamilies = extractSerialRewardPatternFamilies(previousRewardEvidence);
  const repeatedFamilies = [...currentFamilies].filter(family =>
    previousFamilies.has(family)
  );
  const similarity = textSimilarity(
    normalizeText(currentRewardEvidence),
    normalizeText(previousRewardEvidence)
  );
  const currentModes = extractSerialRewardVariationModes(currentRewardEvidence);
  const previousModes = extractSerialRewardVariationModes(previousRewardEvidence);
  const newModes = [...currentModes].filter(mode => !previousModes.has(mode));
  const repetitive =
    repeatedFamilies.length >= 3 ||
    (repeatedFamilies.length >= 2 && similarity >= 0.35) ||
    similarity >= 0.58;

  return {
    passed: !repetitive || newModes.length > 0,
    repetitive,
    expected:
      'serial reward pattern variation: 회차 간 보상 전달 방식 자체를 반복하지 말고, 로그-기록 대조/알림-규칙 증명을 이름만 바꿔 재사용하지 않는다. 보상은 관계 배신, 반대세력 countermove, 행동 방식 반전, 대가 상승, 규칙 변이, 구체 사물 폭로 같은 새 reward mode로 도착해야 한다.',
    actual:
      `repeated reward pattern families=${repeatedFamilies.join(', ') || 'none'}, ` +
      `similarity=${similarity.toFixed(2)}, ` +
      `current reward modes=${[...currentModes].join(', ') || 'none'}, ` +
      `previous reward modes=${[...previousModes].join(', ') || 'none'}, ` +
      `new reward modes=${newModes.join(', ') || 'none'}, ` +
      `current="${abbreviateEvidence(currentRewardEvidence, 260)}"`,
  };
}

function extractSerialRewardPatternFamilies(evidence: string): Set<string> {
  const families = new Set<string>();
  if (/(앱|알림|예고|메시지|수신자)/u.test(evidence)) {
    families.add('alert-proof');
  }
  if (
    /(로그|기록|파일|자료|문서|CCTV|서버|휴대폰).{0,60}(대조|맞물|일치|겹치|확인|연결)|(?:대조|맞물|일치|겹치|확인|연결).{0,60}(로그|기록|파일|자료|문서|CCTV|서버|휴대폰)/u.test(
      evidence
    )
  ) {
    families.add('log-record-comparison');
  }
  if (/(초|분|시각|타임스탬프|시간|같은\s*초|같은\s*시각)/u.test(evidence)) {
    families.add('timestamp-match');
  }
  if (/(규칙|패턴|증명|맞아떨어|예고.{0,20}실제|실제.{0,20}예고)/u.test(evidence)) {
    families.add('rule-proof');
  }
  if (/(휴대폰|폰|화면|로고|앱)/u.test(evidence)) {
    families.add('phone-screen');
  }
  if (/(현장|좌표|장소|위치|통제선|기록실|서버실)/u.test(evidence)) {
    families.add('place-record');
  }
  return families;
}

function extractSerialRewardVariationModes(evidence: string): Set<string> {
  const modes = new Set<string>();
  if (/(조력자|관계|신뢰|불신|배신|고백|침묵|동행|거절|사과|은폐)/u.test(evidence)) {
    modes.add('relationship-betrayal');
  }
  if (/(내부자|범인|가해자|반대\s*세력|함정|조작|협박|감시|역공|빼앗|삭제|잠갔|차단|유인|countermove|카운터무브)/u.test(evidence)) {
    modes.add('opposition-countermove');
  }
  if (/(잠입|추격|도주|협상|전투|침투|위장|탈출|몸싸움|추적|비상문|기록실)/u.test(evidence)) {
    modes.add('action-mode-reversal');
  }
  if (/(대가|비용|희생|체포|정체|발각|증거.{0,12}(잃|빼앗|사라)|관계.{0,12}깨|목숨|가족|빈\s*손)/u.test(evidence)) {
    modes.add('higher-cost');
  }
  if (/(규칙.{0,12}(바뀌|변하|뒤집)|새로운?\s*규칙|조건.{0,12}바뀌|반경|거짓\s*예고|이미\s*시작|수신자.{0,12}바뀌|표적.{0,12}바뀌)/u.test(evidence)) {
    modes.add('rule-mutation');
  }
  if (/(증거\s*봉투|열쇠|녹음기|배지|사진|서명|피\s*묻은|관리자\s*계정|원본|카드)/u.test(evidence)) {
    modes.add('concrete-object-reveal');
  }
  return modes;
}

interface CliffhangerCarryoverResult {
  metadataFailures: number;
  manuscriptFailures: number;
}

interface CliffhangerCarryoverAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface CliffhangerCarryoverFamily {
  label: string;
  pattern: RegExp;
  anchor: boolean;
}

interface CliffhangerCarryoverFamilyAssessment {
  matched: number;
  matchedAnchors: number;
  anchorFamilies: number;
  matchedLabels: string[];
  matchedAnchorLabels: string[];
}

interface ChoiceCostLockCarryoverResult {
  metadataFailures: number;
  manuscriptFailures: number;
}

interface ChoiceCostLockCarryoverExpectation {
  source: string;
  anchors: string[];
  requiredAnchors: number;
}

interface ChoiceCostLockCarryoverAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface RevelationConsequenceCarryoverResult {
  metadataFailures: number;
  manuscriptFailures: number;
}

interface RevelationConsequenceCarryoverExpectation {
  source: string;
  terms: string[];
  requiredTerms: number;
}

interface RevelationConsequenceCarryoverAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface MysteryHypothesisCarryoverResult {
  metadataFailures: number;
  manuscriptFailures: number;
}

interface MysteryHypothesisCarryoverExpectation {
  source: string;
  terms: string[];
  requiredTerms: number;
}

interface MysteryHypothesisCarryoverAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface AntagonistCountermoveCarryoverResult {
  metadataFailures: number;
  manuscriptFailures: number;
}

interface AntagonistCountermoveCarryoverExpectation {
  source: string;
  terms: string[];
  requiredTerms: number;
  displayNames: string[];
}

interface AntagonistCountermoveCarryoverAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

const CHOICE_COST_LOCK_NEXT_FACING_PATTERN =
  /(다음\s*(?:회차|장면|행동|선택|압박)|이어|이어진|이어받|넘어가|이후|여파|압박|남긴|남은|직전)/u;
const CHOICE_COST_LOCK_CARRYOVER_CONNECTOR_PATTERN =
  /(직전|전\s*회차|지난|이어|이어받|여파|대가|탓에|때문에|그\s*결과|이후|사라진|닫힌|잠긴|잃은|포기한|노출된|발각된|끊긴|차단된)/gu;
const CHOICE_COST_LOCK_CARRYOVER_PRESSURE_PATTERN =
  /(의심|추궁|체포|감시|차단|막히|우회|고립|불신|신뢰|관계|압박|위험|표적|발각|노출|기한|시간|경로|통로|증거|단서|알리바이|신고\s*기록|선택지|제보자|좁혀|닫히|끊겨)/gu;
const REVELATION_CONSEQUENCE_TRIGGER_PATTERN =
  /(폭로|드러나|드러났|밝혀|밝혀졌|정체|사실|공범|배후|진범|내통|조작|관리자\s*계정|접속\s*토큰|가족\s*실종|실종\s*파일|비밀|반전|reveal)/u;
const REVELATION_CONSEQUENCE_NEXT_PATTERN =
  /(다음\s*(?:회차|장면|행동|질문)|이어|이어진|이어받|이후|여파|때문에|결과|계획\s*변경|새\s*압박|새\s*질문|압박으로\s*이어)/u;
const REVELATION_CONSEQUENCE_ACTION_PATTERN =
  /(계획\s*(?:변경|수정|폐기|버리|바꾸)|접근\s*계획|추적|역추적|추궁|의심|함정|새\s*압박|압박|다음\s*질문|새\s*질문|용의자|공범|배후|신뢰|불신)/gu;
const REVELATION_CONSEQUENCE_CARRYOVER_PATTERN =
  /(전\s*회차|지난|직전|폭로|드러나|밝혀|사실|공범|배후|관리자\s*계정|접속\s*토큰|가족\s*실종|실종\s*파일|계획\s*변경|새\s*압박|다음\s*질문|때문에|그\s*결과|여파|이어|이어받)/gu;
const MYSTERY_HYPOTHESIS_CLUE_PATTERN =
  /(단서|흔적|기록|로그|번호|파일|시계|알리바이|공백|목격|상처|영수증|제조번호|지문|혈흔|메시지|좌표|증거|패턴|규칙|불일치|맞지\s*않|대조|맞물)/u;
const MYSTERY_HYPOTHESIS_STATE_PATTERN =
  /(가설|추론|용의자|범인|공범|알리바이|혐의|의심|단독\s*범행|두\s*번째\s*용의자|용의선|범행\s*동기)/u;
const MYSTERY_HYPOTHESIS_NEXT_PATTERN =
  /(다음\s*(?:회차|장면|행동|검증|추적)|이어|이어진|이어받|때문에|가설\s*(?:수정|변경|재검토)|용의자\s*(?:순위|지도|목록)|알리바이\s*(?:재검증|검증)|검증\s*행동|다시\s*세우)/u;
const MYSTERY_HYPOTHESIS_ACTION_PATTERN =
  /(가설\s*(?:수정|변경|재검토|버리|흔들|좁히)|추론\s*(?:수정|바꾸|재정렬)|용의자\s*(?:순위|지도|목록|재정렬|다시\s*세우|좁혀|추려)|알리바이\s*(?:재검증|검증|대조|깨|흔들)|다음\s*검증\s*행동|검증\s*행동|재검증|대조|제외|배제|지목|의심|용의선|두\s*번째\s*용의자|단독\s*범행\s*가설)/gu;
const MYSTERY_HYPOTHESIS_CARRYOVER_PATTERN =
  /(직전|전\s*회차|지난|이어|이어받|때문에|단서|붉은\s*시계|알리바이|공백|가설|용의자|추론|검증|재검증|대조|불일치|맞지)/gu;
const ANTAGONIST_COUNTERMOVE_PRIOR_TRIGGER_PATTERN =
  /(주인공|그|그녀|수사관|탐정).{0,40}(탈취|공개|폭로|빼앗|해킹|무력화|방해|흔들|추적|역추적|발견|증명|막아|깨뜨|들춰|관리자\s*토큰|가짜\s*피해자\s*목록)/u;
const ANTAGONIST_COUNTERMOVE_NEXT_PATTERN =
  /(다음\s*(?:회차|장면|행동)|반격|역공|대응|전술\s*변경|표적\s*재설정|증거\s*삭제|권한\s*회수|접근\s*권한|조력자\s*표적|이어|이어진|때문에|그\s*결과)/u;
const ANTAGONIST_COUNTERMOVE_ACTION_PATTERN =
  /(반격|역공|대응|전술\s*(?:변경|수정)|계획\s*(?:변경|수정)|표적\s*(?:재설정|변경)|표적(?:으로)?\s*삼|권한\s*회수|접근\s*권한\s*(?:회수|차단)|증거\s*(?:삭제|폐기|숨기)|로그\s*(?:삭제|조작)|기록\s*(?:삭제|조작)|계정\s*(?:차단|추적|잠그)|추적|역추적|함정|유인|협박|감시|조력자.{0,12}표적|가족.{0,12}표적)/gu;
const ANTAGONIST_COUNTERMOVE_CARRYOVER_PATTERN =
  /(전\s*회차|지난|직전|주인공|탈취|공개|폭로|들통|방해|무력화|관리자\s*토큰|가짜\s*피해자|조작|반대\s*세력|범인|가해자|반격|역공|대응|전술\s*변경|표적\s*재설정|증거\s*삭제|권한\s*회수|그\s*결과|때문에|이어)/gu;

function evaluateCliffhangerCarryover(
  chapter: ChapterWithReaderExperience,
  previousChapters: ChapterWithReaderExperience[],
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): CliffhangerCarryoverResult {
  const result: CliffhangerCarryoverResult = {
    metadataFailures: 0,
    manuscriptFailures: 0,
  };
  const previousChapter = latestPreviousChapter(chapter, previousChapters);
  const priorEnding = previousChapter?.reader_experience?.must_click_ending?.trim();

  if (!previousChapter || !priorEnding || chapter.chapter_number <= 1) {
    return result;
  }

  const metadataAssessment = assessCliffhangerCarryover(
    chapterToCliffhangerCarryoverEvidenceText(chapter),
    priorEnding
  );
  if (!metadataAssessment.passed) {
    issues.push({
      code: 'cliffhanger-carryover-not-staged',
      severity: 'critical',
      message:
        'The chapter drops the prior must-click ending instead of carrying it into the next chapter opening or first staged turn.',
      expected: metadataAssessment.expected,
      actual: metadataAssessment.actual,
    });
    result.metadataFailures++;
  } else {
    const immediacyAssessment = assessCliffhangerCarryover(
      chapterToCliffhangerCarryoverImmediateEvidenceText(chapter),
      priorEnding
    );
    if (!immediacyAssessment.passed) {
      issues.push({
        code: 'cliffhanger-carryover-delayed',
        severity: 'critical',
        message:
          'The chapter mentions the prior must-click ending in planning evidence but delays it past the opening scene or first staged turn.',
        expected:
          'prior must_click_ending carryover inside the opening scene / first staged turn, not only in current_plot or later reward notes.',
        actual: immediacyAssessment.actual,
      });
      result.metadataFailures++;
    }
  }

  if (manuscript?.trim()) {
    const manuscriptAssessment = assessCliffhangerCarryover(
      manuscriptToCliffhangerCarryoverOpeningText(manuscript),
      priorEnding
    );
    if (!manuscriptAssessment.passed) {
      issues.push({
        code: 'manuscript-cliffhanger-carryover-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript opening skips the prior chapter ending hook instead of paying it forward on page.',
        expected: manuscriptAssessment.expected,
        actual: manuscriptAssessment.actual,
      });
      result.manuscriptFailures++;
    } else {
      const manuscriptImmediacyAssessment = assessCliffhangerCarryover(
        manuscriptToCliffhangerCarryoverImmediateOpeningText(manuscript),
        priorEnding
      );
      if (!manuscriptImmediacyAssessment.passed) {
        issues.push({
          code: 'manuscript-cliffhanger-carryover-delayed',
          severity: 'critical',
          message:
            'The manuscript eventually carries the prior chapter ending but delays it past the first two sentences, weakening next-chapter momentum.',
          expected:
            'prior must_click_ending carryover inside the first two manuscript sentences as immediate action, discovery, pressure, or consequence.',
          actual: manuscriptImmediacyAssessment.actual,
        });
        result.manuscriptFailures++;
      }
    }
  }

  return result;
}

function evaluateChoiceCostLockCarryover(
  chapter: ChapterWithReaderExperience,
  previousChapters: ChapterWithReaderExperience[],
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): ChoiceCostLockCarryoverResult {
  const result: ChoiceCostLockCarryoverResult = {
    metadataFailures: 0,
    manuscriptFailures: 0,
  };
  const previousChapter = latestPreviousChapter(chapter, previousChapters);

  if (!previousChapter || chapter.chapter_number <= 1) {
    return result;
  }

  const expectation = extractChoiceCostLockCarryoverExpectation(previousChapter);
  if (!expectation) {
    return result;
  }

  const metadataAssessment = assessChoiceCostLockCarryover(
    chapterToChoiceCostLockCarryoverEvidenceText(chapter),
    expectation
  );
  if (!metadataAssessment.passed) {
    issues.push({
      code: 'choice-cost-lock-carryover-not-staged',
      severity: 'critical',
      message:
        'The chapter drops the prior choice-cost lock instead of carrying the locked state into next-chapter pressure.',
      expected: metadataAssessment.expected,
      actual: metadataAssessment.actual,
    });
    result.metadataFailures++;
  }

  if (manuscript?.trim()) {
    const manuscriptAssessment = assessChoiceCostLockCarryover(
      manuscriptToChoiceCostLockCarryoverOpeningText(manuscript),
      expectation
    );
    if (!manuscriptAssessment.passed) {
      issues.push({
        code: 'manuscript-choice-cost-lock-carryover-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript opening skips the prior locked choice consequence instead of making it current pressure on page.',
        expected: manuscriptAssessment.expected,
        actual: manuscriptAssessment.actual,
      });
      result.manuscriptFailures++;
    }
  }

  return result;
}

function extractChoiceCostLockCarryoverExpectation(
  previousChapter: ChapterWithReaderExperience
): ChoiceCostLockCarryoverExpectation | undefined {
  const candidates = [
    previousChapter.context?.next_plot,
    chapterToFinalSceneEvidenceText(previousChapter),
  ]
    .map(value => value?.trim() ?? '')
    .filter(Boolean);

  let strongest: ChoiceCostLockCarryoverExpectation | undefined;
  for (const source of candidates) {
    const sourceIsNextFacing =
      CHOICE_COST_LOCK_NEXT_FACING_PATTERN.test(source) ||
      source === chapterToFinalSceneEvidenceText(previousChapter);
    const hasLock =
      countChoiceCostLockSignals(source) > 0 ||
      (CHOICE_COST_LOCK_DOMAIN_PATTERN.test(source) &&
        CHOICE_COST_LOCK_STATE_PATTERN.test(source) &&
        CHOICE_COST_LOCK_CONNECTOR_PATTERN.test(source));
    const anchors = extractChoiceCostLockCarryoverAnchors(source);

    if (!sourceIsNextFacing || !hasLock || anchors.length < 2) {
      continue;
    }

    const requiredAnchors = Math.min(4, Math.max(2, Math.ceil(anchors.length * 0.35)));
    const expectation = {
      source,
      anchors,
      requiredAnchors,
    };

    if (!strongest || expectation.anchors.length > strongest.anchors.length) {
      strongest = expectation;
    }
  }

  return strongest;
}

function extractChoiceCostLockCarryoverAnchors(source: string): string[] {
  const genericAnchors = new Set(['피해자', '휴대폰', '이름', '수신자', '카운트다운']);
  return uniqueStrings(source.match(CHOICE_COST_ANCHOR_PATTERN) ?? []).filter(
    anchor => !genericAnchors.has(anchor)
  );
}

function assessChoiceCostLockCarryover(
  currentEvidence: string,
  expectation: ChoiceCostLockCarryoverExpectation
): ChoiceCostLockCarryoverAssessment {
  const directOverlap = containsExpectedBeatEvidence(currentEvidence, expectation.source, 0.45);
  const normalizedEvidence = normalizeText(currentEvidence);
  const matchedAnchors = expectation.anchors.filter(anchor =>
    normalizedEvidence.includes(normalizeText(anchor))
  );
  const connectorSignals = countMatches(
    currentEvidence,
    CHOICE_COST_LOCK_CARRYOVER_CONNECTOR_PATTERN
  );
  const pressureSignals = countMatches(
    currentEvidence,
    CHOICE_COST_LOCK_CARRYOVER_PRESSURE_PATTERN
  );
  const lockSignals = countChoiceCostLockSignals(currentEvidence);
  const passed =
    directOverlap ||
    (matchedAnchors.length >= expectation.requiredAnchors &&
      connectorSignals > 0 &&
      (pressureSignals > 0 || lockSignals > 0));

  return {
    passed,
    expected:
      'choice-cost lock carryover: prior locked choice must appear in next chapter previous_summary/current_plot, reader_experience, opening scene, and manuscript opening as current pressure on the locked option, relationship, evidence path, time window, or route.',
    actual:
      `direct overlap=${directOverlap}, matched anchors=${matchedAnchors.length}/${expectation.anchors.length} ` +
      `(${matchedAnchors.join(', ') || 'none'}), required anchors=${expectation.requiredAnchors}, ` +
      `connector signals=${connectorSignals}, pressure signals=${pressureSignals}, lock signals=${lockSignals}, ` +
      `prior="${abbreviateEvidence(expectation.source, 220)}", evidence="${abbreviateEvidence(currentEvidence, 260)}"`,
  };
}

function evaluateRevelationConsequenceCarryover(
  chapter: ChapterWithReaderExperience,
  previousChapters: ChapterWithReaderExperience[],
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): RevelationConsequenceCarryoverResult {
  const result: RevelationConsequenceCarryoverResult = {
    metadataFailures: 0,
    manuscriptFailures: 0,
  };
  const previousChapter = latestPreviousChapter(chapter, previousChapters);

  if (!previousChapter || chapter.chapter_number <= 1) {
    return result;
  }

  const expectation = extractRevelationConsequenceCarryoverExpectation(previousChapter);
  if (!expectation) {
    return result;
  }

  const metadataAssessment = assessRevelationConsequenceCarryover(
    chapterToRevelationConsequenceCarryoverEvidenceText(chapter),
    expectation
  );
  if (!metadataAssessment.passed) {
    issues.push({
      code: 'revelation-consequence-carryover-not-staged',
      severity: 'critical',
      message:
        'The chapter drops the prior revelation instead of carrying its consequences into the current plan, pressure, suspect map, or next question.',
      expected: metadataAssessment.expected,
      actual: metadataAssessment.actual,
    });
    result.metadataFailures++;
  }

  if (manuscript?.trim()) {
    const manuscriptAssessment = assessRevelationConsequenceCarryover(
      manuscriptToRevelationConsequenceCarryoverOpeningText(manuscript),
      expectation
    );
    if (!manuscriptAssessment.passed) {
      issues.push({
        code: 'manuscript-revelation-consequence-carryover-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript opening skips the prior revelation consequence instead of making the changed plan, pressure, suspect map, or next question visible on page.',
        expected: manuscriptAssessment.expected,
        actual: manuscriptAssessment.actual,
      });
      result.manuscriptFailures++;
    }
  }

  return result;
}

function extractRevelationConsequenceCarryoverExpectation(
  previousChapter: ChapterWithReaderExperience
): RevelationConsequenceCarryoverExpectation | undefined {
  const candidates = [
    previousChapter.context?.next_plot,
    previousChapter.reader_experience?.chapter_reward,
    chapterToFinalSceneEvidenceText(previousChapter),
  ]
    .map(value => value?.trim() ?? '')
    .filter(Boolean);

  let strongest: RevelationConsequenceCarryoverExpectation | undefined;
  for (const source of candidates) {
    const hasRevelation = REVELATION_CONSEQUENCE_TRIGGER_PATTERN.test(source);
    const nextFacing =
      REVELATION_CONSEQUENCE_NEXT_PATTERN.test(source) ||
      source === previousChapter.context?.next_plot?.trim();

    if (!hasRevelation || !nextFacing) {
      continue;
    }

    const terms = extractRevelationConsequenceCarryoverTerms(source);
    if (terms.length < 3) {
      continue;
    }

    const expectation = {
      source,
      terms,
      requiredTerms: Math.min(5, Math.max(3, Math.ceil(terms.length * 0.35))),
    };

    if (!strongest || expectation.terms.length > strongest.terms.length) {
      strongest = expectation;
    }
  }

  return strongest;
}

function extractRevelationConsequenceCarryoverTerms(source: string): string[] {
  const stopWords = new Set([
    '전',
    '회차',
    '다음',
    '장면',
    '사실',
    '결과',
    '여파',
    '이어진다',
    '이어',
    '드러나',
    '드러났다',
    '밝혀졌다',
    '폭로',
    '새',
    '질문',
    '압박',
    '계획',
    '변경',
    '현재',
  ]);
  const terms = normalizeText(source)
    .split(/\s+/u)
    .map(token =>
      token.replace(
        /(으로|에서|에게|부터|까지|처럼|이라는|라는|하고|하며|해서|라는|과|와|의|을|를|이|가|은|는|도|만|로|에)$/u,
        ''
      )
    )
    .filter(token => token.length >= 2 && !stopWords.has(token));

  return uniqueStrings(terms).slice(0, 14);
}

function assessRevelationConsequenceCarryover(
  currentEvidence: string,
  expectation: RevelationConsequenceCarryoverExpectation
): RevelationConsequenceCarryoverAssessment {
  const directOverlap = containsExpectedBeatEvidence(
    currentEvidence,
    expectation.source,
    0.45
  );
  const normalizedEvidence = normalizeText(currentEvidence);
  const matchedTerms = expectation.terms.filter(term =>
    normalizedEvidence.includes(normalizeText(term))
  );
  const revealSignals = countMatches(
    currentEvidence,
    REVELATION_CONSEQUENCE_CARRYOVER_PATTERN
  );
  const consequenceSignals = countMatches(
    currentEvidence,
    REVELATION_CONSEQUENCE_ACTION_PATTERN
  );
  const passed =
    (directOverlap && consequenceSignals >= 2) ||
    (matchedTerms.length >= expectation.requiredTerms &&
      revealSignals >= 1 &&
      consequenceSignals >= 2);

  return {
    passed,
    expected:
      'revelation consequence carryover: prior reveal/payoff must shape the next chapter previous_summary/current_plot, reader_experience, opening scene, and manuscript opening as a changed plan, new pressure, suspect-map shift, relationship stance, or next question.',
    actual:
      `direct overlap=${directOverlap}, matched terms=${matchedTerms.length}/${expectation.terms.length} ` +
      `(${matchedTerms.join(', ') || 'none'}), required terms=${expectation.requiredTerms}, ` +
      `reveal signals=${revealSignals}, consequence signals=${consequenceSignals}, ` +
      `prior="${abbreviateEvidence(expectation.source, 220)}", evidence="${abbreviateEvidence(currentEvidence, 260)}"`,
  };
}

function evaluateMysteryHypothesisCarryover(
  chapter: ChapterWithReaderExperience,
  previousChapters: ChapterWithReaderExperience[],
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): MysteryHypothesisCarryoverResult {
  const result: MysteryHypothesisCarryoverResult = {
    metadataFailures: 0,
    manuscriptFailures: 0,
  };
  const previousChapter = latestPreviousChapter(chapter, previousChapters);

  if (!previousChapter || chapter.chapter_number <= 1) {
    return result;
  }

  const expectation = extractMysteryHypothesisCarryoverExpectation(previousChapter);
  if (!expectation) {
    return result;
  }

  const metadataAssessment = assessMysteryHypothesisCarryover(
    chapterToMysteryHypothesisCarryoverEvidenceText(chapter),
    expectation
  );
  if (!metadataAssessment.passed) {
    issues.push({
      code: 'mystery-hypothesis-carryover-not-staged',
      severity: 'critical',
      message:
        'The chapter drops the prior clue instead of carrying it into a revised hypothesis, suspect ranking, or next verification action.',
      expected: metadataAssessment.expected,
      actual: metadataAssessment.actual,
    });
    result.metadataFailures++;
  }

  if (manuscript?.trim()) {
    const manuscriptAssessment = assessMysteryHypothesisCarryover(
      manuscriptToMysteryHypothesisCarryoverOpeningText(manuscript),
      expectation
    );
    if (!manuscriptAssessment.passed) {
      issues.push({
        code: 'manuscript-mystery-hypothesis-carryover-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript opening skips the prior clue hypothesis shift instead of showing revised suspicion or next verification on page.',
        expected: manuscriptAssessment.expected,
        actual: manuscriptAssessment.actual,
      });
      result.manuscriptFailures++;
    }
  }

  return result;
}

function extractMysteryHypothesisCarryoverExpectation(
  previousChapter: ChapterWithReaderExperience
): MysteryHypothesisCarryoverExpectation | undefined {
  const candidates = [
    previousChapter.context?.next_plot,
    previousChapter.reader_experience?.chapter_reward,
    previousChapter.reader_experience?.must_click_ending,
    chapterToFinalSceneEvidenceText(previousChapter),
  ]
    .map(value => value?.trim() ?? '')
    .filter(Boolean);

  let strongest: MysteryHypothesisCarryoverExpectation | undefined;
  for (const source of candidates) {
    const hasClue = MYSTERY_HYPOTHESIS_CLUE_PATTERN.test(source);
    const hasHypothesisState = MYSTERY_HYPOTHESIS_STATE_PATTERN.test(source);
    const nextFacing =
      MYSTERY_HYPOTHESIS_NEXT_PATTERN.test(source) ||
      source === previousChapter.context?.next_plot?.trim();

    if (!hasClue || !hasHypothesisState || !nextFacing) {
      continue;
    }

    const terms = extractMysteryHypothesisCarryoverTerms(source);
    if (terms.length < 4) {
      continue;
    }

    const expectation = {
      source,
      terms,
      requiredTerms: Math.min(6, Math.max(4, Math.ceil(terms.length * 0.4))),
    };

    if (!strongest || expectation.terms.length > strongest.terms.length) {
      strongest = expectation;
    }
  }

  return strongest;
}

function extractMysteryHypothesisCarryoverTerms(source: string): string[] {
  const stopWords = new Set([
    '전',
    '회차',
    '직전',
    '다음',
    '장면',
    '행동',
    '현재',
    '때문',
    '이어',
    '이어진다',
    '단서',
    '가설',
    '추론',
    '용의자',
    '검증',
    '행동',
    '수정',
    '다시',
    '세우며',
    '세운다',
  ]);
  const terms = normalizeText(source)
    .split(/\s+/u)
    .map(token =>
      token.replace(
        /(으로|에서|에게|부터|까지|처럼|이라는|라는|하고|하며|해서|라는|과|와|의|을|를|이|가|은|는|도|만|로|에)$/u,
        ''
      )
    )
    .filter(token => token.length >= 2 && !stopWords.has(token));

  return uniqueStrings(terms).slice(0, 16);
}

function assessMysteryHypothesisCarryover(
  currentEvidence: string,
  expectation: MysteryHypothesisCarryoverExpectation
): MysteryHypothesisCarryoverAssessment {
  const directOverlap = containsExpectedBeatEvidence(
    currentEvidence,
    expectation.source,
    0.48
  );
  const normalizedEvidence = normalizeText(currentEvidence);
  const matchedTerms = expectation.terms.filter(term =>
    normalizedEvidence.includes(normalizeText(term))
  );
  const carryoverSignals = countMatches(
    currentEvidence,
    MYSTERY_HYPOTHESIS_CARRYOVER_PATTERN
  );
  const hypothesisActionSignals = countMatches(
    currentEvidence,
    MYSTERY_HYPOTHESIS_ACTION_PATTERN
  );
  const passed =
    (directOverlap && hypothesisActionSignals >= 2) ||
    (matchedTerms.length >= expectation.requiredTerms &&
      carryoverSignals >= 1 &&
      hypothesisActionSignals >= 2);

  return {
    passed,
    expected:
      'mystery hypothesis carryover: prior clue must shape the next chapter previous_summary/current_plot, reader_experience, opening scene, and manuscript opening as a revised hypothesis, changed suspect ranking, eliminated/promoted suspect, or next verification action.',
    actual:
      `direct overlap=${directOverlap}, matched terms=${matchedTerms.length}/${expectation.terms.length} ` +
      `(${matchedTerms.join(', ') || 'none'}), required terms=${expectation.requiredTerms}, ` +
      `carryover signals=${carryoverSignals}, hypothesis action signals=${hypothesisActionSignals}, ` +
      `prior="${abbreviateEvidence(expectation.source, 220)}", evidence="${abbreviateEvidence(currentEvidence, 260)}"`,
  };
}

function evaluateAntagonistCountermoveCarryover(
  chapter: ChapterWithReaderExperience,
  previousChapters: ChapterWithReaderExperience[],
  characters: CharacterReferenceForEvaluation[],
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): AntagonistCountermoveCarryoverResult {
  const result: AntagonistCountermoveCarryoverResult = {
    metadataFailures: 0,
    manuscriptFailures: 0,
  };
  const previousChapter = latestPreviousChapter(chapter, previousChapters);
  const strategies = selectAntagonistStrategies(characters);

  if (!previousChapter || strategies.length === 0 || chapter.chapter_number <= 1) {
    return result;
  }

  const expectation = extractAntagonistCountermoveCarryoverExpectation(
    previousChapter,
    strategies
  );
  if (!expectation) {
    return result;
  }

  const metadataAssessment = assessAntagonistCountermoveCarryover(
    chapterToAntagonistCountermoveCarryoverEvidenceText(chapter),
    expectation
  );
  if (!metadataAssessment.passed) {
    issues.push({
      code: 'antagonist-countermove-carryover-not-staged',
      severity: 'critical',
      message:
        'The chapter drops the prior protagonist disruption instead of carrying it into an antagonist countermove, changed tactic, target reset, evidence deletion, or retaliation.',
      expected: metadataAssessment.expected,
      actual: metadataAssessment.actual,
    });
    result.metadataFailures++;
  }

  if (manuscript?.trim()) {
    const manuscriptAssessment = assessAntagonistCountermoveCarryover(
      manuscriptToAntagonistCountermoveCarryoverOpeningText(manuscript),
      expectation
    );
    if (!manuscriptAssessment.passed) {
      issues.push({
        code: 'manuscript-antagonist-countermove-carryover-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript opening skips the prior protagonist disruption instead of showing the opposing actor retaliating with changed tactics, target reset, evidence deletion, access revocation, or direct pressure.',
        expected: manuscriptAssessment.expected,
        actual: manuscriptAssessment.actual,
      });
      result.manuscriptFailures++;
    }
  }

  return result;
}

function extractAntagonistCountermoveCarryoverExpectation(
  previousChapter: ChapterWithReaderExperience,
  strategies: AntagonistStrategyExpectation[]
): AntagonistCountermoveCarryoverExpectation | undefined {
  const displayNames = uniqueStrings(strategies.flatMap(strategy => strategy.displayNames));
  const candidates = [
    previousChapter.context?.next_plot,
    previousChapter.reader_experience?.chapter_reward,
    previousChapter.reader_experience?.must_click_ending,
    chapterToFinalSceneEvidenceText(previousChapter),
  ]
    .map(value => value?.trim() ?? '')
    .filter(Boolean);

  let strongest: AntagonistCountermoveCarryoverExpectation | undefined;
  for (const source of candidates) {
    const hasPriorDisruption =
      ANTAGONIST_COUNTERMOVE_PRIOR_TRIGGER_PATTERN.test(source) ||
      /(관리자\s*토큰|가짜\s*피해자\s*목록|계획을\s*흔들|통제\s*계획)/u.test(
        source
      );
    const hasCountermoveSetup =
      ANTAGONIST_COUNTERMOVE_NEXT_PATTERN.test(source) ||
      source === previousChapter.context?.next_plot?.trim();
    const namesAntagonist =
      containsAnyDisplayName(source, displayNames) ||
      /(범인|가해자|반대\s*세력|적대자|내부자)/u.test(source);

    if (!hasPriorDisruption || !hasCountermoveSetup || !namesAntagonist) {
      continue;
    }

    const terms = extractAntagonistCountermoveCarryoverTerms(source);
    if (terms.length < 4) {
      continue;
    }

    const expectation = {
      source,
      terms,
      requiredTerms: Math.min(6, Math.max(4, Math.ceil(terms.length * 0.4))),
      displayNames,
    };

    if (!strongest || expectation.terms.length > strongest.terms.length) {
      strongest = expectation;
    }
  }

  return strongest;
}

function extractAntagonistCountermoveCarryoverTerms(source: string): string[] {
  const stopWords = new Set([
    '전',
    '회차',
    '다음',
    '장면',
    '행동',
    '주인공',
    '그',
    '그녀',
    '현재',
    '때문',
    '결과',
    '이어',
    '이어진다',
    '벌어져',
    '모든',
    '것',
  ]);
  const terms = normalizeText(source)
    .split(/\s+/u)
    .map(token =>
      token.replace(
        /(으로|에서|에게|부터|까지|처럼|이라는|라는|하고|하며|해서|라는|과|와|의|을|를|이|가|은|는|도|만|로|에)$/u,
        ''
      )
    )
    .filter(token => token.length >= 2 && !stopWords.has(token));

  return uniqueStrings(terms).slice(0, 16);
}

function assessAntagonistCountermoveCarryover(
  currentEvidence: string,
  expectation: AntagonistCountermoveCarryoverExpectation
): AntagonistCountermoveCarryoverAssessment {
  const directOverlap = containsExpectedBeatEvidence(
    currentEvidence,
    expectation.source,
    0.5
  );
  const normalizedEvidence = normalizeText(currentEvidence);
  const matchedTerms = expectation.terms.filter(term =>
    normalizedEvidence.includes(normalizeText(term))
  );
  const namedActor =
    expectation.displayNames.length === 0 ||
    containsAnyDisplayName(currentEvidence, expectation.displayNames);
  const carryoverSignals = countMatches(
    currentEvidence,
    ANTAGONIST_COUNTERMOVE_CARRYOVER_PATTERN
  );
  const countermoveSignals = countMatches(
    currentEvidence,
    ANTAGONIST_COUNTERMOVE_ACTION_PATTERN
  );
  const passed =
    namedActor &&
    ((directOverlap && countermoveSignals >= 2) ||
      (matchedTerms.length >= expectation.requiredTerms &&
        carryoverSignals >= 1 &&
        countermoveSignals >= 2));

  return {
    passed,
    expected:
      'antagonist countermove carryover: after a prior protagonist disruption, the next chapter previous_summary/current_plot, reader_experience, opening scene, and manuscript opening must show the opposing actor changing tactics, resetting a target, deleting evidence, revoking access, or retaliating.',
    actual:
      `named actor=${namedActor}, direct overlap=${directOverlap}, matched terms=${matchedTerms.length}/${expectation.terms.length} ` +
      `(${matchedTerms.join(', ') || 'none'}), required terms=${expectation.requiredTerms}, ` +
      `carryover signals=${carryoverSignals}, countermove signals=${countermoveSignals}, ` +
      `prior="${abbreviateEvidence(expectation.source, 220)}", evidence="${abbreviateEvidence(currentEvidence, 260)}"`,
  };
}

function assessCliffhangerCarryover(
  currentEvidence: string,
  priorEnding: string
): CliffhangerCarryoverAssessment {
  const directOverlap = containsExpectedBeatEvidence(currentEvidence, priorEnding, 0.45);
  const terms = extractCliffhangerCarryoverTerms(priorEnding);
  const normalizedEvidence = normalizeText(currentEvidence);
  const matchedTerms = terms.filter(term => normalizedEvidence.includes(term));
  const familyAssessment = assessCliffhangerCarryoverFamilies(currentEvidence, priorEnding);
  const carryoverActionSignals = countMatches(
    currentEvidence,
    /(직전|곧바로|이어|이어받|대조|확인|추적|해석|붙잡|들여다|화면|로그|기록|알림|예고|수신자|번호|단서)/gu
  );
  const requiredTerms = Math.min(4, Math.max(3, Math.ceil(terms.length * 0.4)));
  const anchorSatisfied =
    familyAssessment.anchorFamilies === 0 || familyAssessment.matchedAnchors >= 1;
  const passed =
    directOverlap ||
    (matchedTerms.length >= requiredTerms &&
      familyAssessment.matched >= 2 &&
      anchorSatisfied &&
      carryoverActionSignals >= 1);

  return {
    passed,
    expected:
      'cliffhanger carryover: prior must_click_ending must appear in the next chapter current_plot, reader_experience, opening scene, and manuscript opening as immediate action, discovery, pressure, or consequence; do not create a 미끼식 클리프행어.',
    actual:
      `direct overlap=${directOverlap}, matched terms=${matchedTerms.length}/${terms.length} ` +
      `(${matchedTerms.join(', ') || 'none'}), matched clue families=${familyAssessment.matched} ` +
      `(${familyAssessment.matchedLabels.join(', ') || 'none'}), matched anchors=` +
      `${familyAssessment.matchedAnchors}/${familyAssessment.anchorFamilies} ` +
      `(${familyAssessment.matchedAnchorLabels.join(', ') || 'none'}), ` +
      `carryover action signals=${carryoverActionSignals}, evidence="${abbreviateEvidence(currentEvidence, 260)}"`,
  };
}

function extractCliffhangerCarryoverTerms(priorEnding: string): string[] {
  const stopWords = new Set([
    '그리고',
    '하지만',
    '함께',
    '다시',
    '새',
    '뜨며',
    '깜박이고',
    '연결된다',
    '현재',
    '다음',
    '회차',
  ]);
  const terms = normalizeText(priorEnding)
    .split(/\s+/u)
    .map(token => token.replace(/(으로|에서|에게|부터|까지|처럼|이라는|라는|과|와|의|을|를|이|가|은|는|도|만|로|에)$/u, ''))
    .filter(token => token.length >= 2 && !stopWords.has(token));

  return [...new Set(terms)];
}

function assessCliffhangerCarryoverFamilies(
  currentEvidence: string,
  priorEnding: string
): CliffhangerCarryoverFamilyAssessment {
  const matchedLabels: string[] = [];
  const matchedAnchorLabels: string[] = [];
  let anchorFamilies = 0;
  for (const family of cliffhangerCarryoverFamilies(priorEnding)) {
    if (family.anchor) {
      anchorFamilies++;
    }
    if (family.pattern.test(currentEvidence)) {
      matchedLabels.push(family.label);
      if (family.anchor) {
        matchedAnchorLabels.push(family.label);
      }
    }
  }
  return {
    matched: matchedLabels.length,
    matchedAnchors: matchedAnchorLabels.length,
    anchorFamilies,
    matchedLabels,
    matchedAnchorLabels,
  };
}

function cliffhangerCarryoverFamilies(priorEnding: string): CliffhangerCarryoverFamily[] {
  const families: CliffhangerCarryoverFamily[] = [];
  if (/(피해자|사망|죽|시신)/u.test(priorEnding)) {
    families.push({ label: 'victim', pattern: /(피해자|사망|죽|시신|쓰러)/u, anchor: true });
  }
  if (/(휴대폰|폰|화면)/u.test(priorEnding)) {
    families.push({ label: 'phone-screen', pattern: /(휴대폰|폰|화면|단말)/u, anchor: true });
  }
  if (/(알림|예고|메시지|수신자)/u.test(priorEnding)) {
    families.push({ label: 'alert', pattern: /(알림|예고|메시지|수신자|깜박)/u, anchor: false });
  }
  if (/(주인공|이름|수신자)/u.test(priorEnding)) {
    families.push({
      label: 'protagonist-target',
      pattern: /(주인공\s*이름|이름|수신자|표적|대상)/u,
      anchor: false,
    });
  }
  if (/(미제|사건\s*번호|번호|파일)/u.test(priorEnding)) {
    families.push({ label: 'case-number', pattern: /(미제|사건\s*번호|번호)/u, anchor: true });
  }
  if (/(기록|로그|자료)/u.test(priorEnding)) {
    families.push({ label: 'record', pattern: /(기록|로그|자료|파일|대조|확인)/u, anchor: false });
  }
  return families;
}

interface TensionResetAssessment {
  passed: boolean;
  actual: string;
}

const TENSION_RESET_SIGNAL_PATTERN =
  /(호흡|숨을?\s*고르|숨을?\s*삼키|숨을?\s*죽|잠깐\s*멈|멈칫|정적|침묵|여운|완급|느려|낮추|식은|차갑게\s*식|물방울|손을\s*떼|눈을\s*감|추리\s*호흡|단서\s*해석|로그\s*분석|기록\s*검토|생각을\s*정리|목덜미|손바닥|침을\s*삼키)/gu;
const TENSION_REIGNITION_SIGNAL_PATTERN =
  /(새\s*(?:알림|예고|메시지|질문|의문|단서|위협)|다음\s*(?:수신자|표적|대상|질문)|왜|어떻게|누가|무엇|미해결|깜박|연결|수신자|표적|카운트다운|다시\s*울|다시\s*뜨|되살린|재점화)/gu;
const CONTINUOUS_ESCALATION_SIGNAL_PATTERN =
  /(더\s*(?:큰|빠른|많은|깊은|거센|급한|크게)|쏟아졌|폭발음|고함|소리치|달렸|달려|뛰쳐|추격|쫓|공격|위협|카운트다운|경보|비명|문을\s*열어젖|몰아붙)/gu;

function assessTensionResetEvidence(
  evidence: string,
  tensionResetPlan: string
): TensionResetAssessment {
  if (containsExpectedBeatEvidence(evidence, tensionResetPlan, 0.32)) {
    return {
      passed: true,
      actual: 'direct tension_reset_plan overlap=true',
    };
  }

  const resetSignals = countMatches(evidence, TENSION_RESET_SIGNAL_PATTERN);
  const reignitionSignals = countMatches(evidence, TENSION_REIGNITION_SIGNAL_PATTERN);
  const planRequiresReset = /(호흡|낮추|완급|정적|침묵|추리|리셋|쉬|여운)/u.test(
    tensionResetPlan
  );
  const planRequiresReignition = /(새|질문|알림|예고|위협|긴장|되살|남기|다음)/u.test(
    tensionResetPlan
  );
  const hasRequiredReset = !planRequiresReset || resetSignals > 0;
  const hasRequiredReignition = !planRequiresReignition || reignitionSignals > 0;

  return {
    passed: hasRequiredReset && hasRequiredReignition,
    actual:
      `reset/breath signals=${resetSignals}, renewed question/threat signals=${reignitionSignals}, ` +
      `plan_requires_reset=${planRequiresReset}, plan_requires_reignition=${planRequiresReignition}`,
  };
}

function assessManuscriptTensionReset(
  manuscript: string,
  tensionResetPlan: string
): TensionResetAssessment {
  const resetEvidence = assessTensionResetEvidence(manuscript, tensionResetPlan);
  const resetSignals = countMatches(manuscript, TENSION_RESET_SIGNAL_PATTERN);
  const reignitionSignals = countMatches(manuscript, TENSION_REIGNITION_SIGNAL_PATTERN);
  const escalationSignals = countMatches(manuscript, CONTINUOUS_ESCALATION_SIGNAL_PATTERN);
  const continuousEscalationPenalty = escalationSignals >= 5 && resetSignals === 0;

  return {
    passed: resetEvidence.passed && !continuousEscalationPenalty,
    actual:
      `${resetEvidence.actual}, continuous escalation signals=${escalationSignals}, ` +
      `continuous_escalation_penalty=${continuousEscalationPenalty}, ` +
      `manuscript_reset_signals=${resetSignals}, manuscript_reignition_signals=${reignitionSignals}`,
  };
}

interface ManuscriptTensionPeakAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

const TENSION_PEAK_PRESSURE_PATTERN =
  /(제한\s*시간|카운트다운|초(?:가|는|밖에)?|분(?:밖에|뒤|안에)?|위기|위험|위협|표적|수신자|대상|납치|감금|붙잡|쫓|추격|칼|총|피|죽|사망|실종|피해자|현장|통제선|잠겼|막혔|차단|알림|예고|함정|덫|폭발|무너|삭제|사라|노출|발각)/u;
const TENSION_PEAK_ACTION_PATTERN =
  /(선택|결정|결심|계산|뛰쳐|달려|돌진|구하|찾으려|막으|붙잡|움켜쥐|쥐었|눌렀|열었|확인|다시\s*(?:쥐|눌|확인|계산|보)|우회|바꾸|접고|대신|피하|숨|쫓아|따라|겨눴|신고|전송|외쳤|물었|내밀|잡아당|밀쳤|몸을\s*(?:낮추|던지|돌))/u;
const TENSION_PEAK_TURN_PATTERN =
  /(드러났|밝혀|발견|맞물|일치|연결|겹치|굳어졌|바뀌|뒤집|무너|닫히|잠기|막히|실패|늦었|놓쳤|잃|빼앗|죽|사망|다음\s*(?:수신자|표적|대상|사건|알림)|새\s*(?:알림|예고|위협|질문|단서)|되돌릴\s*수\s*없|돌이킬\s*수\s*없|대가|손실|닫혔|사라졌|표적|수신자|위험.{0,20}커|반경.{0,20}좁)/u;
const TENSION_PEAK_ABSTRACT_PATTERN =
  /(긴장감|위기감|클라이맥스|절정|고조|강렬|극적|중요한\s*순간|흥미로운\s*순간|독자|재미|몰입|대작)/u;

function assessManuscriptTensionPeak(
  manuscript: string,
  plot: PlotWithFunSpec,
  chapter: ChapterWithReaderExperience
): ManuscriptTensionPeakAssessment {
  const peak = plot.tension_curve?.key_peaks?.find(
    item => item.chapter === chapter.chapter_number
  );
  const peakEvent = peak?.event?.trim() ?? '';
  const peakLevel = typeof peak?.tension_level === 'number' ? peak.tension_level : 0;
  const expected =
    'declared high-tension peak on page: peak event plus concrete pressure/obstacle, protagonist action or forced choice, and irreversible consequence, reveal, or sharper open question in the same 1-3 sentence window.';

  if (!peak || !peakEvent || peakLevel < 8) {
    return {
      passed: true,
      expected,
      actual:
        `tension peak check skipped: level=${peakLevel}, ` +
        `event=${peakEvent ? 'present' : 'missing'}`,
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return {
      passed: false,
      expected,
      actual: `peak="${peakEvent}", candidate windows=0, complete peak windows=0`,
    };
  }

  const peakTerms = extractPayoffTerms(peakEvent);
  let candidateWindows = 0;
  let completePeakWindows = 0;
  let strongestAnchorHits = 0;
  let strongestPressureSignals = 0;
  let strongestActionSignals = 0;
  let strongestTurnSignals = 0;
  let strongestAbstractSignals = 0;

  for (let index = 0; index < sentences.length; index++) {
    const window = sentences
      .slice(Math.max(0, index - 1), Math.min(sentences.length, index + 3))
      .join(' ');
    const normalizedWindow = normalizeText(window);
    const anchorHits = peakTerms.filter(term => normalizedWindow.includes(term)).length;
    const hasPeakEventEvidence =
      containsExpectedBeatEvidence(window, peakEvent, 0.25) ||
      anchorHits >= Math.min(2, Math.max(1, peakTerms.length));

    if (!hasPeakEventEvidence) {
      continue;
    }

    candidateWindows += 1;
    const pressureSignals = countMatches(window, TENSION_PEAK_PRESSURE_PATTERN);
    const actionSignals = countMatches(window, TENSION_PEAK_ACTION_PATTERN);
    const turnSignals = countMatches(window, TENSION_PEAK_TURN_PATTERN);
    const abstractSignals = countMatches(window, TENSION_PEAK_ABSTRACT_PATTERN);

    strongestAnchorHits = Math.max(strongestAnchorHits, anchorHits);
    strongestPressureSignals = Math.max(strongestPressureSignals, pressureSignals);
    strongestActionSignals = Math.max(strongestActionSignals, actionSignals);
    strongestTurnSignals = Math.max(strongestTurnSignals, turnSignals);
    strongestAbstractSignals = Math.max(strongestAbstractSignals, abstractSignals);

    const concreteSignalTotal = pressureSignals + actionSignals + turnSignals;
    const abstractOnly = abstractSignals >= 2 && concreteSignalTotal < 3;
    if (pressureSignals >= 1 && actionSignals >= 1 && turnSignals >= 1 && !abstractOnly) {
      completePeakWindows += 1;
    }
  }

  return {
    passed: completePeakWindows >= 1,
    expected,
    actual:
      `peak="${peakEvent}", level=${peakLevel}, candidate windows=${candidateWindows}, ` +
      `complete peak windows=${completePeakWindows}, ` +
      `strongest anchor hits=${strongestAnchorHits}/${peakTerms.length}, ` +
      `strongest pressure=${strongestPressureSignals}, strongest action=${strongestActionSignals}, ` +
      `strongest turn=${strongestTurnSignals}, strongest abstract=${strongestAbstractSignals}`,
  };
}

interface ManuscriptTensionWaveAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

interface ManuscriptTensionWaveWindowScore {
  index: number;
  pressure: number;
  action: number;
  turn: number;
  complication: number;
  openLoop: number;
  peakAnchor: boolean;
  endingAnchor: boolean;
  inciting: boolean;
  complicationStage: boolean;
  peak: boolean;
}

const TENSION_WAVE_COMPLICATION_PATTERN =
  /(막히|막힌|잠기|잠긴|닫히|닫힌|차단|봉쇄|통제선|철문|우회|비상계단|대가|비용|손실|선택지.{0,12}(?:닫|사라|좁)|알리바이.{0,20}(?:닫|사라)|제한\s*시간|카운트다운|늦|실패|놓치|삭제|조작|표적.{0,12}(?:바뀌|재설정)|접근\s*권한|회수|수신자.{0,12}(?:바뀌|지정)|경로.{0,12}(?:닫|막|차단)|증거.{0,12}(?:사라|삭제|빼앗))/gu;
const TENSION_WAVE_OPEN_LOOP_PATTERN =
  /(왜|어떻게|누가|무엇|어디|다음\s*(?:수신자|표적|대상|질문|사건|알림)|새\s*(?:알림|예고|메시지|위협|단서|질문)|미해결|알\s*수\s*없|정체|배후|남았|깜박|연결|다시\s*(?:울|뜨|깜박))/gu;
const TENSION_WAVE_ACTION_PATTERN =
  /(선택해야|선택할지|선택을\s*(?:해야|했|강요|미뤘|접었)|결정|결심|계산|뛰쳐|달려|돌진|구하|찾으려|막으|붙잡|움켜쥐|쥐었|쥔|눌렀|열었|확인|다시\s*(?:쥐|눌|확인|계산|보)|우회|바꾸|접고|대신|피하|숨|쫓아|따라|겨눴|신고(?:할지|보다|를\s*미루|를\s*포기|했|한다)|전송|외쳤|물었|내밀|잡아당|밀쳤|몸을\s*(?:낮추|던지|돌))/u;

function scoreManuscriptTensionWaveWindow(
  sentences: string[],
  index: number,
  peakEvent: string,
  peakTerms: string[],
  mustClickEnding: string
): ManuscriptTensionWaveWindowScore {
  const window = sentences
    .slice(Math.max(0, index - 1), Math.min(sentences.length, index + 2))
    .join(' ');
  const normalizedWindow = normalizeText(window);
  const anchorHits = peakTerms.filter(term => normalizedWindow.includes(term)).length;
  const peakAnchor =
    Boolean(peakEvent) &&
    (containsExpectedBeatEvidence(window, peakEvent, 0.25) ||
      anchorHits >= Math.min(2, Math.max(1, peakTerms.length)));
  const endingAnchor = containsExpectedBeatEvidence(window, mustClickEnding, 0.25);
  const pressure = countMatches(window, TENSION_PEAK_PRESSURE_PATTERN);
  const action = countMatches(window, TENSION_WAVE_ACTION_PATTERN);
  const turn = countMatches(window, TENSION_PEAK_TURN_PATTERN);
  const complication = countMatches(window, TENSION_WAVE_COMPLICATION_PATTERN);
  const openLoop =
    countMatches(window, TENSION_REIGNITION_SIGNAL_PATTERN) +
    countMatches(window, TENSION_WAVE_OPEN_LOOP_PATTERN);
  const choiceOrQuestion =
    /(선택해야|선택할지|선택을\s*(?:해야|했|강요|미뤘|접었)|결정|결심|해야\s*했|할지|위험을\s*감수|장난으로\s*넘길지|신고(?:할지|보다|를\s*미루|를\s*포기)|왜|어떻게|누가|무엇|[?？])/u.test(
      window
    );
  const finalish = index >= Math.floor(sentences.length * 0.55);

  return {
    index,
    pressure,
    action,
    turn,
    complication,
    openLoop,
    peakAnchor,
    endingAnchor,
    inciting: pressure >= 1 && (action >= 1 || openLoop >= 1 || choiceOrQuestion),
    complicationStage:
      pressure >= 1 && complication >= 1 && (action >= 1 || turn >= 1 || openLoop >= 1),
    peak:
      (finalish || peakAnchor || endingAnchor) &&
      pressure >= 1 &&
      (action >= 1 || turn >= 1 || peakAnchor || endingAnchor) &&
      (turn >= 1 || openLoop >= 1 || endingAnchor),
  };
}

function summarizeTensionWavePhase(
  label: string,
  score: ManuscriptTensionWaveWindowScore | undefined
): string {
  if (!score) {
    return `${label}=missing`;
  }

  return (
    `${label}@${score.index + 1}` +
    `(pressure=${score.pressure}, action=${score.action}, turn=${score.turn}, ` +
    `complication=${score.complication}, openLoop=${score.openLoop}, ` +
    `peakAnchor=${score.peakAnchor}, endingAnchor=${score.endingAnchor})`
  );
}

function assessManuscriptTensionWave(
  manuscript: string,
  plot: PlotWithFunSpec,
  chapter: ChapterWithReaderExperience
): ManuscriptTensionWaveAssessment {
  const peak = plot.tension_curve?.key_peaks?.find(
    item => item.chapter === chapter.chapter_number
  );
  const peakEvent = peak?.event?.trim() ?? '';
  const peakLevel = typeof peak?.tension_level === 'number' ? peak.tension_level : 0;
  const cliffhangerStrength =
    typeof chapter.reader_experience?.cliffhanger_strength === 'number'
      ? chapter.reader_experience.cliffhanger_strength
      : 0;
  const expected =
    'on-page tension wave: opening pressure/question, middle progressive complication or narrowed option, and final peak/open loop must appear as ordered manuscript windows.';

  if (peakLevel < 8 && cliffhangerStrength < 8) {
    return {
      passed: true,
      expected,
      actual:
        `tension wave check skipped: peak level=${peakLevel}, ` +
        `cliffhanger_strength=${cliffhangerStrength}`,
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length < 4) {
    return {
      passed: false,
      expected,
      actual:
        `sentences=${sentences.length}, opening=missing, middle=missing, final=missing`,
    };
  }

  const peakTerms = extractPayoffTerms(peakEvent);
  const scores = sentences.map((_, index) =>
    scoreManuscriptTensionWaveWindow(
      sentences,
      index,
      peakEvent,
      peakTerms,
      chapter.reader_experience.must_click_ending
    )
  );
  const openingLimit = Math.max(1, Math.floor((sentences.length - 1) * 0.45));
  const middleLimit = Math.max(2, Math.floor((sentences.length - 1) * 0.85));
  const opening = scores.find(score => score.index <= openingLimit && score.inciting);
  const middle = opening
    ? scores.find(
        score =>
          score.index > opening.index &&
          score.index <= middleLimit &&
          score.complicationStage
      )
    : undefined;
  const final = middle
    ? scores.find(score => score.index > middle.index && score.peak)
    : undefined;
  const strongestPressure = Math.max(...scores.map(score => score.pressure));
  const strongestComplication = Math.max(...scores.map(score => score.complication));
  const strongestOpenLoop = Math.max(...scores.map(score => score.openLoop));

  return {
    passed: Boolean(opening && middle && final),
    expected,
    actual:
      `sentences=${sentences.length}, peak_level=${peakLevel}, ` +
      `cliffhanger_strength=${cliffhangerStrength}, ` +
      `${summarizeTensionWavePhase('opening', opening)}, ` +
      `${summarizeTensionWavePhase('middle', middle)}, ` +
      `${summarizeTensionWavePhase('final', final)}, ` +
      `strongest pressure=${strongestPressure}, ` +
      `strongest complication=${strongestComplication}, strongest openLoop=${strongestOpenLoop}`,
  };
}

interface EmotionalArcExpectation {
  key: string;
  label: string;
  source: string;
  evidencePattern: RegExp;
}

interface EmotionalArcSource {
  source: string;
  value: string;
}

const EMOTIONAL_ARC_FAMILIES: Array<{
  key: string;
  label: string;
  triggerPattern: RegExp;
  evidencePattern: RegExp;
}> = [
  {
    key: 'guilt',
    label: '죄책감',
    triggerPattern: /(죄책|자책|후회|미안|잘못|탓)/u,
    evidencePattern:
      /(죄책|자책|후회|미안|잘못|탓|입술을\s*깨물|시선을\s*피|고개를\s*떨|고개를\s*숙|목(?:구멍)?이?\s*막|손(?:끝|이)?\s*떨|숨을\s*삼켰)/u,
  },
  {
    key: 'resolve',
    label: '결심',
    triggerPattern: /(결심|각오|결의|다짐|의지|결정)/u,
    evidencePattern:
      /(결심|각오|결의|다짐|결정|하겠|해야\s*했|선택|감수|맞서|공개|움켜쥐|쥐고|고개를\s*들|발을\s*내딛|뛰쳐|달려|구하)/u,
  },
  {
    key: 'dread',
    label: '불길함',
    triggerPattern: /(불길|불안|공포|두려|섬뜩|위협|서늘|소름)/u,
    evidencePattern:
      /(불길|불안|공포|두려|섬뜩|위협|서늘|소름|차갑|금속|귀를\s*찔|사망|죽|실종|피|어둠|경고|예고|등골)/u,
  },
  {
    key: 'curiosity',
    label: '호기심/추리',
    triggerPattern: /(호기심|궁금|궁금증|의문|추리|지적|단서|수수께끼|미스터리)/u,
    evidencePattern:
      /(호기심|궁금|의문|왜|어떻게|단서|패턴|추리|기록|로그|번호|파일|로고|맞물|분석|계산|쾌감|미스터리)/u,
  },
  {
    key: 'tension',
    label: '긴장/절박함',
    triggerPattern: /(긴장|위기|위기감|절박|압박|다급|초조|카운트다운)/u,
    evidencePattern:
      /(긴장|위기|절박|압박|다급|카운트다운|제한\s*시간|초(?:가|는|밖에)?|분(?:밖에|뒤|안에)?|뛰|달려|숨|심장|목덜미|손바닥|떨|위험|대상|표적|좁혀|알림|예고)/u,
  },
  {
    key: 'relationship-tension',
    label: '관계 긴장',
    triggerPattern: /(관계|조력자|배신|신뢰|불신|약점|고백|공개)/u,
    evidencePattern:
      /(관계|조력자|배신|신뢰|불신|약점|고백|공개|숨기|말끝|시선|갈등|믿|넘길지|직접\s*추적|구하려)/u,
  },
  {
    key: 'sorrow',
    label: '슬픔/상실',
    triggerPattern: /(슬픔|상실|비애|애도|그리움|눈물|허무)/u,
    evidencePattern:
      /(슬픔|상실|비애|애도|그리움|눈물|허무|목이\s*메|가슴이\s*비|울음|떨리는\s*숨|손끝이\s*식)/u,
  },
  {
    key: 'warmth',
    label: '따뜻함/설렘',
    triggerPattern: /(따뜻|온기|위로|애정|설렘|안도|평온)/u,
    evidencePattern:
      /(따뜻|온기|위로|애정|설렘|안도|평온|미소|손을\s*잡|어깨에|숨이\s*풀|가슴이\s*풀|볼이\s*달아)/u,
  },
  {
    key: 'shock',
    label: '충격',
    triggerPattern: /(충격|경악|놀람|반전)/u,
    evidencePattern:
      /(충격|경악|놀람|반전|숨이\s*멎|말문이\s*막|눈앞|굳어|멈췄|뒤집혔)/u,
  },
];

const GENERIC_EMOTIONAL_ARC_TERMS = new Set([
  '감정',
  '감정선',
  '목표',
  '독자',
  '이동',
  '전환',
  '흐름',
  '정서',
  '장면',
  '즉각적',
  '지적',
  '상태',
]);

const EMOTIONAL_PROGRESSION_CATALYST_PATTERN =
  /(때문에|그래서|그러자|그\s*순간|직후|이후|끝에|결국|대신|그러나|하지만|그래도|선택|결정|감수|포기|공개|인정|사과|도움|요청|붙잡|움켜쥐|발을\s*내딛|뛰쳐|달려|구하|막아|드러났|밝혀|실패|대가|손실|침묵|반박|수락|거절|동행|배신|보호|압박|위협|흔들|깨달|깨닫|마침내)/u;
const EMOTIONAL_PROGRESSION_NEGATION_PATTERN =
  /(?:어떤\s*)?(?:선택|행동\s*반응|전환\s*계기|계기|변화|전환).{0,45}(?:없|못|아니|않(?:았|는다|다|고|게))|(?:없|못|아니|않(?:았|는다|다|고|게)).{0,45}(?:선택|행동\s*반응|전환\s*계기|계기|변화|전환)/u;
const EMOTIONAL_PROGRESSION_EVIDENCE_OVERRIDES = new Map<string, RegExp>([
  [
    'tension',
    /(긴장|위기|절박|압박|다급|카운트다운|제한\s*시간|초(?:가|는|밖에)?|분(?:밖에|뒤|안에)?|심장|목덜미|손바닥|떨|조여|조이|식은땀|숨을\s*삼키|숨이\s*(?:막|가빠|멎))/u,
  ],
  [
    'relationship-tension',
    /(관계|배신|신뢰|불신|의심|약점|고백|공개|숨기|갈등|믿|말끝|시선|직접\s*추적|구하려|동행|거절|수락|의심이\s*멈추|약점을\s*공개)/u,
  ],
]);

function assessManuscriptEmotionalArc(
  manuscript: string,
  chapter: ChapterWithReaderExperience
): ManuscriptEmotionalArcAssessment {
  const expectations = extractEmotionalArcExpectations(chapter);
  if (expectations.length === 0) {
    return {
      passed: true,
      expected: 'emotional_goal/scene emotional_tone=none',
      actual: 'emotional arc expectations=0',
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  const matches = expectations
    .map(expectation => ({
      expectation,
      position: findEmotionalArcEvidencePosition(sentences, expectation),
    }));
  const matched = matches.filter(match => match.position !== undefined);
  const missing = matches.filter(match => match.position === undefined);

  return {
    passed: missing.length === 0,
    expected: `emotional_goal/scene emotional_tone on page: ${expectations
      .map(expectation => `${expectation.label}(${expectation.source})`)
      .join(', ')}`,
    actual:
      `matched=${matched
        .map(match => `${match.expectation.label}@${match.position}`)
        .join(', ') || 'none'}; ` +
      `missing=${missing
        .map(match => match.expectation.label)
        .join(', ') || 'none'}`,
  };
}

function assessManuscriptEmotionalProgression(
  manuscript: string,
  chapter: ChapterWithReaderExperience
): ManuscriptEmotionalProgressionAssessment {
  const expectations = extractEmotionalProgressionExpectations(chapter);
  if (expectations.length < 2) {
    return {
      passed: true,
      expected: 'emotional progression=not declared',
      actual: `emotional progression expectations=${expectations.length}`,
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  const orderedMatches = findOrderedEmotionalArcEvidencePositions(sentences, expectations);
  const missing = orderedMatches.filter(match => match.position === undefined);
  const links = orderedMatches.slice(1).map((current, index) => {
    const previous = orderedMatches[index];
    if (previous.position === undefined || current.position === undefined) {
      return {
        from: previous.expectation.label,
        to: current.expectation.label,
        hasCatalyst: false,
        negated: false,
        window: 'missing emotional state evidence',
      };
    }

    const start = previous.position;
    const end = Math.min(sentences.length, current.position + 2);
    const window = sentences.slice(start, end).join(' ');

    return {
      from: previous.expectation.label,
      to: current.expectation.label,
      hasCatalyst: EMOTIONAL_PROGRESSION_CATALYST_PATTERN.test(window),
      negated: EMOTIONAL_PROGRESSION_NEGATION_PATTERN.test(window),
      window: `${start}-${Math.max(start, end - 1)}`,
    };
  });
  const failedLinks = links.filter(link => !link.hasCatalyst || link.negated);

  return {
    passed: missing.length === 0 && failedLinks.length === 0,
    expected:
      `emotional progression on page: ${expectations
        .map(expectation => `${expectation.label}(${expectation.source})`)
        .join(' -> ')}; ` +
      'requires visible transition catalyst, choice/event, relationship response, or action reaction.',
    actual:
      `ordered emotional matches=${orderedMatches
        .map(match =>
          `${match.expectation.label}@${match.position ?? 'missing'}`
        )
        .join(', ') || 'none'}; ` +
      `progression links=${links
        .map(link =>
          `${link.from}->${link.to}[catalyst=${link.hasCatalyst}, negated=${link.negated}, window=${link.window}]`
        )
        .join(', ') || 'none'}; ` +
      `missing=${missing
        .map(match => match.expectation.label)
        .join(', ') || 'none'}`,
  };
}

const AFFECTIVE_CHOICE_ACTION_PATTERN =
  /(선택|결정|감수|포기|수락|거절|사과|고백|공개|요청|도움|붙잡|놓아주|밀어내|막아|구하|보호|동행|협력|돌아섰|다가섰|물러섰|뛰쳐|달려|발을\s*내딛|문을\s*(?:열|닫|막)|손을\s*(?:잡|뿌리|내밀|떼)|휴대폰을\s*건네|계획을\s*바꾸|말투를\s*바꾸|길을\s*비켜|현장으로\s*가)/u;
const AFFECTIVE_CHOICE_CONSEQUENCE_PATTERN =
  /(그래서|그러자|결국|그\s*결과|이후|직후|때문에|탓에|대가|손실|위험|관계|신뢰|불신|거리|동맹|적대|선택지|닫히|열리|사라지|남았|드러났|밝혀|들켰|잃|무너졌|깨졌|바뀌|달라졌|되돌릴\s*수\s*없|할\s*수\s*없|다음\s*(?:행동|목표|추적|선택)|위험이\s*커|압박이\s*커)/u;
const AFFECTIVE_CHOICE_INTERNAL_LABEL_PATTERN =
  /(감정(?:선|이)?\s*(?:변하|바뀌|이동|전환)|마음(?:속|에만)|느꼈|느끼고|결심도\s*느꼈|그대로\s*(?:머물|남|반복)|내면(?:만|에서)|생각만|정서만|기분만)/u;

function assessManuscriptAffectiveChoiceTurn(
  manuscript: string,
  chapter: ChapterWithReaderExperience
): ManuscriptAffectiveChoiceTurnAssessment {
  const expectations = extractEmotionalProgressionExpectations(chapter);
  if (expectations.length < 2) {
    return {
      passed: true,
      expected: 'affective choice turn=not declared',
      actual: `emotional progression expectations=${expectations.length}`,
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  const orderedMatches = findOrderedEmotionalArcEvidencePositions(sentences, expectations);
  const links = orderedMatches.slice(1).map((current, index) => {
    const previous = orderedMatches[index];
    if (previous.position === undefined || current.position === undefined) {
      return {
        from: previous.expectation.label,
        to: current.expectation.label,
        hasActionTurn: false,
        hasConsequenceTurn: false,
        labelOnly: false,
        window: 'missing emotional state evidence',
      };
    }

    const start = Math.max(0, previous.position - 1);
    const end = Math.min(sentences.length, current.position + 4);
    const window = sentences.slice(start, end).join(' ');
    const hasActionTurn = AFFECTIVE_CHOICE_ACTION_PATTERN.test(window);
    const hasConsequenceTurn = AFFECTIVE_CHOICE_CONSEQUENCE_PATTERN.test(window);
    const labelOnly =
      AFFECTIVE_CHOICE_INTERNAL_LABEL_PATTERN.test(window) &&
      (!hasActionTurn || !hasConsequenceTurn);

    return {
      from: previous.expectation.label,
      to: current.expectation.label,
      hasActionTurn,
      hasConsequenceTurn,
      labelOnly,
      window: `${start}-${Math.max(start, end - 1)}`,
    };
  });
  const failedLinks = links.filter(
    link => !link.hasActionTurn || !link.hasConsequenceTurn || link.labelOnly
  );

  return {
    passed: failedLinks.length === 0,
    expected:
      `affective choice turn on page: ${expectations
        .map(expectation => `${expectation.label}(${expectation.source})`)
        .join(' -> ')}; ` +
      'each emotional turn should change a choice, outward action, relationship stance, or concrete consequence.',
    actual:
      `affective links=${links
        .map(link =>
          `${link.from}->${link.to}[action=${link.hasActionTurn}, consequence=${link.hasConsequenceTurn}, labelOnly=${link.labelOnly}, window=${link.window}]`
        )
        .join(', ') || 'none'}`,
  };
}

const CHARACTER_DEVELOPMENT_SIGNAL_PATTERN =
  /(처음|더는|이제|결심|결정|다짐|선택|감수|인정|사과|고백|공개|드러내|숨기|숨겼|숨기려다|약점|후회|죄책|자책|용서|믿|믿기로|거절|맞서|포기|받아들|깨달|달라졌|바뀌|공포보다|패턴을\s*먼저|구하|구하려|타인의|위험|대가)/gu;

function assessManuscriptCharacterDevelopment(
  manuscript: string,
  chapter: ChapterWithReaderExperience,
  characters: CharacterReferenceForEvaluation[]
): ManuscriptCharacterDevelopmentAssessment {
  const expectedDevelopment = chapter.narrative_elements?.character_development?.trim();
  if (!expectedDevelopment) {
    return {
      passed: true,
      expected: 'character_development=none',
      actual: 'character development evidence=not required',
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  const expectedVariants = expandCharacterLabelVariants(expectedDevelopment, characters);
  const evidenceWindows = sentences.filter((_, index) => {
    const window = sentences.slice(Math.max(0, index - 1), index + 2).join(' ');
    return expectedVariants.some(expected => containsExpectedBeatEvidence(window, expected, 0.25));
  }).length;
  const wholeManuscriptEvidence = expectedVariants.some(expected =>
    containsExpectedBeatEvidence(manuscript, expected, 0.3)
  );
  const developmentSignals = countMatches(manuscript, CHARACTER_DEVELOPMENT_SIGNAL_PATTERN);
  const genericStatements = countMatches(
    manuscript,
    /(인물\s*변화|캐릭터\s*성장|성장했다|변화했다|발전했다|성장\s*서사|변화가\s*드러)/gu
  );

  return {
    passed:
      (wholeManuscriptEvidence || evidenceWindows > 0) &&
      developmentSignals >= 2 &&
      !(genericStatements >= 2 && evidenceWindows === 0),
    expected: `character_development on page: ${expectedDevelopment}`,
    actual: `character development evidence=${wholeManuscriptEvidence}, evidence windows=${evidenceWindows}, development signals=${developmentSignals}, generic statements=${genericStatements}`,
  };
}

const RELATIONSHIP_SHIFT_EXPECTATION_PATTERN =
  /(관계|조력자|동료|친구|연인|가족|형제|자매|스승|제자|상사|부하|파트너|동맹|팀|신뢰|불신|믿|의심|오해|화해|갈등|배신|사과|고백|약점|공개|비밀|용서|보호|거리|동행|협력|결별|재회|적대|연대)/u;
const RELATIONSHIP_ACTOR_PATTERN =
  /(주인공|조력자|동료|친구|연인|가족|형제|자매|스승|제자|상사|부하|파트너|상대|그녀|그는|그가|둘|두\s*사람|팀|동맹)/gu;
const RELATIONSHIP_ACTION_PATTERN =
  /(사과|고백|공개|드러내|털어놓|숨기|숨겼|약점|비밀|거절|받아들|용서|보호|감싸|막아|손을\s*잡|붙잡|밀어내|배신|의심|믿|동행|협력|약속|편에\s*서|돌아섰|다가섰|물러섰|선택|포기|감수)/gu;
const RELATIONSHIP_RESPONSE_PATTERN =
  /(반응|침묵|대답|말했|물었|반박|거절|받아들|고개를\s*(?:끄덕|저)|시선|눈을\s*(?:피|맞)|손을\s*(?:잡|뿌리|내밀)|휴대폰을\s*건네|문을\s*열|막아섰|감싸|끌어당|밀어냈|따라섰|동행|약속|믿겠|못\s*믿|의심|용서|사과|웃었|울었|돌아섰|다가섰|물러섰)/gu;
const RELATIONSHIP_STATE_PATTERN =
  /(관계|신뢰|불신|믿|의심|오해|화해|갈등|배신|적대|연대|동맹|동행|편|거리|가까워|멀어|바뀌|달라졌|깨졌|회복|결별|재회)/gu;
const RELATIONSHIP_LABEL_ONLY_PATTERN =
  /(관계가\s*(?:신뢰|불신|회복|화해|갈등|적대|연대)(?:로|으로)?\s*(?:바뀌|변하|이동|회복)|관계\s*변화가\s*드러|신뢰로\s*바뀌|불신을\s*깼)/gu;
const RELATIONSHIP_EVOLUTION_CARRYOVER_PATTERN =
  /(전\s*회차|지난|이후|이어|이어받|관계|신뢰|불신|동행|약속|거리|의심|배신|화해|갈등|협력|비밀|약점|공개|침묵|반박|보호|따라|함께|손을\s*잡|건네|믿|받아들|먼저\s*(?:말|건네|막|동행)|다음\s*회차\s*대화)/gu;
const RELATIONSHIP_TURNING_POINT_RISK_PATTERN =
  /(약점|비밀|정체|고백|사과|용서|거절|배신|의심|불신|오해|상처|책임|위험|대가|손해|포기|잃|노출|들키|감수|숨기|숨겼|공개|털어놓)/gu;
const RELATIONSHIP_TURNING_POINT_COUNTERPART_CHOICE_PATTERN =
  /(침묵|대답|말했|물었|반박|거절|받아들|고개를\s*(?:끄덕|저)|시선|눈을\s*(?:피|맞)|손을\s*(?:잡|뿌리|내밀)|휴대폰을\s*건네|문을\s*열|막아섰|감싸|끌어당|밀어냈|따라섰|동행|약속|믿겠|못\s*믿|의심|용서|외면|돌아섰|다가섰|물러섰|편에\s*서|선택)/gu;
const RELATIONSHIP_TURNING_POINT_CONSEQUENCE_PATTERN =
  /(동행|따라섰|함께|편에\s*서|약속|조건|거래|휴대폰을\s*건네|문을\s*열|길을\s*비켜|막아섰|감싸|보호|돌아섰|다가섰|물러섰|거리|가까워|멀어|더는|이제|바로|그래서|때문에|결국|행동을\s*바꾸|방식을\s*바꾸|계획을\s*바꾸|말투가\s*바뀌|호칭이\s*바뀌|대화를\s*끊|따로\s*움직|함께\s*움직)/gu;
const RELATIONSHIP_MIND_INFERENCE_PATTERN =
  /(숨기|숨겼|감추|말하지\s*못|말하지\s*않|말을\s*삼키|침묵|눈을\s*피|시선을\s*피|시선이\s*흔들|표정이\s*굳|목소리가\s*낮아|손끝이\s*떨|거짓말|오해|의심|믿고\s*싶|믿지\s*않|두려워|망설|알고\s*있었|깨달|눈치챘|눈치채|읽었|읽어냈|짐작|진심|속셈|의도|상처|죄책감|후회|불안|질투|미련|분노|흔들|머뭇|숨을\s*삼켰|웃음이\s*사라)/gu;
const RELATIONSHIP_INTERPRETIVE_INFERENCE_PATTERN =
  /(왜|어째서|무엇을|무엇이|무슨|알\s*수\s*없|모르|깨달|눈치|짐작|오해|의심|진심|거짓|속셈|의도|마음|믿어야|믿지|읽어|읽었|읽어냈|그제야|그제서야)/gu;
const RELATIONSHIP_COUNTERPART_PRESSURE_PATTERN =
  /(?:조력자(?:가|는|를|에게|와)?|동료(?:가|는|를|에게|와)?|친구(?:가|는|를|에게|와)?|연인(?:이|은|을|에게|과)?|가족(?:이|은|을|에게|과)?|상대(?:가|는|를|에게|와)?|그녀(?:가|는|를)?|그는|그가|파트너(?:가|는|를|에게|와)?|동맹(?:이|은|을|에게|과)?|팀(?:이|은|을|에게)?|둘|두\s*사람(?:이|은)?)[^.!?。！？\n]{0,90}(?:조건|요구|거절|반박|추궁|의심|못\s*믿|믿지\s*않|막아섰|붙잡|밀어내|돌아섰|떠나|고집|거래|대가|비밀|목숨|직장|정체|위험|불리|지켜야|동행을\s*요구|따르지\s*않으면|그러려면|대신)/gu;
const RELATIONSHIP_COUNTERPART_AGENDA_PATTERN =
  /(조건|요구|거절|반박|추궁|못\s*믿|믿지\s*않|대가|거래|자기|자신|나도|나는|내가|가족|목숨|직장|정체|기회|증거|잃|위험|불리|감수|포기|속셈|목적|목표|돌아갈\s*수\s*없|신뢰를\s*잃|동행을\s*요구|원본\s*로그|숨기지\s*말|따르지\s*않으면|그러려면|대신)/gu;
const RELATIONSHIP_MUTUAL_FRICTION_PATTERN =
  /(하지만|그러나|그런데|대신|조건|조건으로|그러려면|못\s*한다|못\s*믿|거절|반박|충돌|갈등|서로|요구|대가|감수|불리|위험|잃|의심|추궁|비밀|숨기지\s*말|따르지\s*않으면)/gu;

interface RelationshipEvolutionCarryoverResult {
  metadataFailures: number;
  manuscriptFailures: number;
}

interface RelationshipEvolutionCarryoverExpectation {
  source: string;
  chapter: number;
  terms: string[];
  requiredTerms: number;
}

interface RelationshipEvolutionCarryoverAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

function isRelationshipShiftExpectation(expectedDevelopment: string | undefined): boolean {
  return Boolean(
    expectedDevelopment?.trim() &&
      RELATIONSHIP_SHIFT_EXPECTATION_PATTERN.test(expectedDevelopment)
  );
}

function assessRelationshipShiftEvidence(
  evidence: string,
  expectedDevelopment: string | undefined
): RelationshipShiftAssessment {
  const expected = expectedDevelopment?.trim();
  if (!isRelationshipShiftExpectation(expected)) {
    return {
      passed: true,
      expected: '관계 변화=none',
      actual: 'relationship shift evidence=not required',
    };
  }

  const text = normalizeText(evidence);
  const actorSignals = countMatches(text, RELATIONSHIP_ACTOR_PATTERN);
  const actionSignals = countMatches(text, RELATIONSHIP_ACTION_PATTERN);
  const responseSignals = countMatches(text, RELATIONSHIP_RESPONSE_PATTERN);
  const stateSignals = countMatches(text, RELATIONSHIP_STATE_PATTERN);
  const labelOnlySignals = countMatches(text, RELATIONSHIP_LABEL_ONLY_PATTERN);
  const hasReciprocalPair = hasRelationshipReciprocalPair(text);

  return {
    passed:
      actorSignals >= 2 &&
      actionSignals >= 1 &&
      stateSignals >= 1 &&
      (responseSignals >= 1 || hasReciprocalPair) &&
      !(labelOnlySignals >= 1 && responseSignals === 0 && !hasReciprocalPair),
    expected: `관계 변화 staged as reciprocal action/reaction: ${expected}`,
    actual:
      `relationship actors=${actorSignals}, actions=${actionSignals}, reactions=${responseSignals}, ` +
      `states=${stateSignals}, reciprocal pair=${hasReciprocalPair}, label-only=${labelOnlySignals}`,
  };
}

function assessManuscriptRelationshipShift(
  manuscript: string,
  chapter: ChapterWithReaderExperience
): RelationshipShiftAssessment {
  const expectedDevelopment = chapter.narrative_elements?.character_development?.trim();
  const assessment = assessRelationshipShiftEvidence(manuscript, expectedDevelopment);
  if (!expectedDevelopment || assessment.passed) {
    return assessment;
  }

  return {
    passed: false,
    expected: `관계 변화 on page as reciprocal reaction and changed behavior: ${expectedDevelopment}`,
    actual: assessment.actual,
  };
}

function assessRelationshipTurningPointEvidence(
  evidence: string,
  expectedDevelopment: string | undefined
): RelationshipShiftAssessment {
  const expected = expectedDevelopment?.trim();
  if (!isRelationshipShiftExpectation(expected)) {
    return {
      passed: true,
      expected: '관계 전환점=none',
      actual: 'relationship turning point=not required',
    };
  }

  const windows = relationshipTurningPointWindows(evidence);
  const strongest = strongestRelationshipTurningPointScore(windows);
  const labelOnlySignals = countMatches(evidence, RELATIONSHIP_LABEL_ONLY_PATTERN);

  return {
    passed: strongest.completeWindows > 0,
    expected:
      `관계 전환점 staged in one scene window: vulnerability/risk, counterpart choice/reaction, changed relationship state, and immediate behavior consequence: ${expected}`,
    actual:
      `turning point windows=${windows.length}, complete=${strongest.completeWindows}, ` +
      `strongest actors=${strongest.actors}, risks=${strongest.risks}, counterpart choices=${strongest.counterpartChoices}, ` +
      `states=${strongest.states}, consequences=${strongest.consequences}, reciprocal pair=${strongest.reciprocalPair}, ` +
      `label-only=${labelOnlySignals}`,
  };
}

function assessManuscriptRelationshipTurningPoint(
  manuscript: string,
  chapter: ChapterWithReaderExperience
): RelationshipShiftAssessment {
  const expectedDevelopment = chapter.narrative_elements?.character_development?.trim();
  const assessment = assessRelationshipTurningPointEvidence(manuscript, expectedDevelopment);
  if (!expectedDevelopment || assessment.passed) {
    return assessment;
  }

  return {
    passed: false,
    expected:
      `관계 전환점 on page within 1-2 sentences: vulnerability/risk, counterpart choice/reaction, changed trust/distance/alliance, and immediate behavior consequence: ${expectedDevelopment}`,
    actual: assessment.actual,
  };
}

function assessRelationshipMindInferenceEvidence(
  evidence: string,
  expectedDevelopment: string | undefined
): RelationshipShiftAssessment {
  const expected = expectedDevelopment?.trim();
  if (!isRelationshipShiftExpectation(expected)) {
    return {
      passed: true,
      expected: '관계 마음 추론=none',
      actual: 'relationship mind inference=not required',
    };
  }

  const windows = relationshipTurningPointWindows(evidence);
  const strongest = strongestRelationshipMindInferenceScore(windows);

  return {
    passed: strongest.completeWindows > 0,
    expected:
      `관계 마음 추론 staged in one scene window: hidden motive, withheld truth, misreading, hesitation, or changed inner stance should be readable through gaze, silence, evasion, dialogue, or POV inference: ${expected}`,
    actual:
      `mind inference windows=${windows.length}, complete=${strongest.completeWindows}, ` +
      `strongest actors=${strongest.actors}, mental cues=${strongest.mentalCues}, ` +
      `interpretive cues=${strongest.interpretiveCues}, counterpart choices=${strongest.counterpartChoices}, ` +
      `states=${strongest.states}, reciprocal pair=${strongest.reciprocalPair}`,
  };
}

function assessManuscriptRelationshipMindInference(
  manuscript: string,
  chapter: ChapterWithReaderExperience
): RelationshipShiftAssessment {
  const expectedDevelopment = chapter.narrative_elements?.character_development?.trim();
  const assessment = assessRelationshipMindInferenceEvidence(
    manuscript,
    expectedDevelopment
  );
  if (!expectedDevelopment || assessment.passed) {
    return assessment;
  }

  return {
    passed: false,
    expected:
      `관계 마음 추론 on page within 1-2 sentences: hidden motive, withheld truth, misreading, hesitation, or changed inner stance should be readable through gaze, silence, evasion, dialogue, or POV inference: ${expectedDevelopment}`,
    actual: assessment.actual,
  };
}

function assessRelationshipMutualPressureEvidence(
  evidence: string,
  expectedDevelopment: string | undefined
): RelationshipShiftAssessment {
  const expected = expectedDevelopment?.trim();
  if (!isRelationshipShiftExpectation(expected)) {
    return {
      passed: true,
      expected: '관계 상호 압박=none',
      actual: 'relationship mutual pressure=not required',
    };
  }

  const windows = relationshipTurningPointWindows(evidence);
  const strongest = strongestRelationshipMutualPressureScore(windows);

  return {
    passed: strongest.completeWindows > 0,
    expected:
      `관계 상호 압박 staged in one scene window: the counterpart should bring a condition, refusal, demand, competing goal, personal cost, secret, or risk that changes the negotiation instead of simply helping or forgiving: ${expected}`,
    actual:
      `mutual pressure windows=${windows.length}, complete=${strongest.completeWindows}, ` +
      `strongest actors=${strongest.actors}, counterpart pressures=${strongest.counterpartPressures}, ` +
      `agendas=${strongest.agendas}, friction=${strongest.friction}, states=${strongest.states}, ` +
      `consequences=${strongest.consequences}, reciprocal pair=${strongest.reciprocalPair}`,
  };
}

function assessManuscriptRelationshipMutualPressure(
  manuscript: string,
  chapter: ChapterWithReaderExperience
): RelationshipShiftAssessment {
  const expectedDevelopment = chapter.narrative_elements?.character_development?.trim();
  const assessment = assessRelationshipMutualPressureEvidence(
    manuscript,
    expectedDevelopment
  );
  if (!expectedDevelopment || assessment.passed) {
    return assessment;
  }

  return {
    passed: false,
    expected:
      `관계 상호 압박 on page within 1-2 sentences: counterpart condition, refusal, demand, competing goal, personal cost, secret, or risk should alter the relationship negotiation and next behavior: ${expectedDevelopment}`,
    actual: assessment.actual,
  };
}

function relationshipTurningPointWindows(evidence: string): string[] {
  const sentences = splitManuscriptSentences(evidence);
  if (sentences.length === 0) {
    const normalized = normalizeText(evidence);
    return normalized ? [normalized] : [];
  }

  return sentences.map((_, index) =>
    sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ')
  );
}

function strongestRelationshipTurningPointScore(windows: string[]): {
  completeWindows: number;
  actors: number;
  risks: number;
  counterpartChoices: number;
  states: number;
  consequences: number;
  reciprocalPair: boolean;
} {
  const strongest = {
    completeWindows: 0,
    actors: 0,
    risks: 0,
    counterpartChoices: 0,
    states: 0,
    consequences: 0,
    reciprocalPair: false,
  };

  for (const window of windows) {
    const actors = countMatches(window, RELATIONSHIP_ACTOR_PATTERN);
    const risks = countMatches(window, RELATIONSHIP_TURNING_POINT_RISK_PATTERN);
    const counterpartChoices = countMatches(
      window,
      RELATIONSHIP_TURNING_POINT_COUNTERPART_CHOICE_PATTERN
    );
    const states = countMatches(window, RELATIONSHIP_STATE_PATTERN);
    const consequences = countMatches(
      window,
      RELATIONSHIP_TURNING_POINT_CONSEQUENCE_PATTERN
    );
    const reciprocalPair = hasRelationshipReciprocalPair(window);
    const complete =
      actors >= 2 &&
      risks >= 1 &&
      states >= 1 &&
      consequences >= 1 &&
      (counterpartChoices >= 1 || reciprocalPair);

    if (complete) {
      strongest.completeWindows++;
    }
    strongest.actors = Math.max(strongest.actors, actors);
    strongest.risks = Math.max(strongest.risks, risks);
    strongest.counterpartChoices = Math.max(
      strongest.counterpartChoices,
      counterpartChoices
    );
    strongest.states = Math.max(strongest.states, states);
    strongest.consequences = Math.max(strongest.consequences, consequences);
    strongest.reciprocalPair = strongest.reciprocalPair || reciprocalPair;
  }

  return strongest;
}

function strongestRelationshipMindInferenceScore(windows: string[]): {
  completeWindows: number;
  actors: number;
  mentalCues: number;
  interpretiveCues: number;
  counterpartChoices: number;
  states: number;
  reciprocalPair: boolean;
} {
  const strongest = {
    completeWindows: 0,
    actors: 0,
    mentalCues: 0,
    interpretiveCues: 0,
    counterpartChoices: 0,
    states: 0,
    reciprocalPair: false,
  };

  for (const window of windows) {
    const actors = countMatches(window, RELATIONSHIP_ACTOR_PATTERN);
    const mentalCues = countMatches(window, RELATIONSHIP_MIND_INFERENCE_PATTERN);
    const interpretiveCues = countMatches(
      window,
      RELATIONSHIP_INTERPRETIVE_INFERENCE_PATTERN
    );
    const counterpartChoices = countMatches(
      window,
      RELATIONSHIP_TURNING_POINT_COUNTERPART_CHOICE_PATTERN
    );
    const states = countMatches(window, RELATIONSHIP_STATE_PATTERN);
    const reciprocalPair = hasRelationshipReciprocalPair(window);
    const complete =
      actors >= 2 &&
      mentalCues >= 1 &&
      states >= 1 &&
      (interpretiveCues >= 1 || counterpartChoices >= 1 || reciprocalPair);

    if (complete) {
      strongest.completeWindows++;
    }
    strongest.actors = Math.max(strongest.actors, actors);
    strongest.mentalCues = Math.max(strongest.mentalCues, mentalCues);
    strongest.interpretiveCues = Math.max(
      strongest.interpretiveCues,
      interpretiveCues
    );
    strongest.counterpartChoices = Math.max(
      strongest.counterpartChoices,
      counterpartChoices
    );
    strongest.states = Math.max(strongest.states, states);
    strongest.reciprocalPair = strongest.reciprocalPair || reciprocalPair;
  }

  return strongest;
}

function strongestRelationshipMutualPressureScore(windows: string[]): {
  completeWindows: number;
  actors: number;
  counterpartPressures: number;
  agendas: number;
  friction: number;
  states: number;
  consequences: number;
  reciprocalPair: boolean;
} {
  const strongest = {
    completeWindows: 0,
    actors: 0,
    counterpartPressures: 0,
    agendas: 0,
    friction: 0,
    states: 0,
    consequences: 0,
    reciprocalPair: false,
  };

  for (const window of windows) {
    const actors = countMatches(window, RELATIONSHIP_ACTOR_PATTERN);
    const counterpartPressures = countMatches(
      window,
      RELATIONSHIP_COUNTERPART_PRESSURE_PATTERN
    );
    const agendas = countMatches(window, RELATIONSHIP_COUNTERPART_AGENDA_PATTERN);
    const friction = countMatches(window, RELATIONSHIP_MUTUAL_FRICTION_PATTERN);
    const states = countMatches(window, RELATIONSHIP_STATE_PATTERN);
    const consequences = countMatches(
      window,
      RELATIONSHIP_TURNING_POINT_CONSEQUENCE_PATTERN
    );
    const reciprocalPair = hasRelationshipReciprocalPair(window);
    const complete =
      actors >= 2 &&
      states >= 1 &&
      consequences >= 1 &&
      counterpartPressures >= 1 &&
      (agendas >= 1 || friction >= 1 || reciprocalPair);

    if (complete) {
      strongest.completeWindows++;
    }
    strongest.actors = Math.max(strongest.actors, actors);
    strongest.counterpartPressures = Math.max(
      strongest.counterpartPressures,
      counterpartPressures
    );
    strongest.agendas = Math.max(strongest.agendas, agendas);
    strongest.friction = Math.max(strongest.friction, friction);
    strongest.states = Math.max(strongest.states, states);
    strongest.consequences = Math.max(strongest.consequences, consequences);
    strongest.reciprocalPair = strongest.reciprocalPair || reciprocalPair;
  }

  return strongest;
}

function assessRelationshipEvolutionRecord(
  chapter: ChapterWithReaderExperience,
  relationshipsInput: RelationshipsForEvaluation | RelationshipForEvaluation[]
): RelationshipShiftAssessment {
  const expectedDevelopment = chapter.narrative_elements?.character_development?.trim();
  if (!expectedDevelopment || !isRelationshipShiftExpectation(expectedDevelopment)) {
    return {
      passed: true,
      expected: '관계 변화 기록=none',
      actual: 'relationship evolution record=not required',
    };
  }

  const expectedRelationshipDevelopment = expectedDevelopment;
  const relationships = normalizeRelationshipsForEvaluation(relationshipsInput);
  const chapterChanges = relationships
    .flatMap(relationship => relationship.evolution ?? [])
    .filter(evolution => evolution.chapter === chapter.chapter_number)
    .map(evolution => evolution.change?.trim() ?? '')
    .filter(Boolean);
  const hasRecordedChange = chapterChanges.some(change =>
    hasRelationshipEvolutionChangeEvidence(change, expectedRelationshipDevelopment)
  );

  return {
    passed: hasRecordedChange,
    expected:
      `관계 변화 기록 in characters/relationships.json evolution for chapter ${chapter.chapter_number}: ${expectedRelationshipDevelopment}`,
    actual:
      `relationships=${relationships.length}, same-chapter evolution changes=${chapterChanges.length}` +
      (chapterChanges.length ? `, changes="${chapterChanges.join(' / ')}"` : ''),
  };
}

function evaluateRelationshipEvolutionCarryover(
  chapter: ChapterWithReaderExperience,
  relationshipsInput: RelationshipsForEvaluation | RelationshipForEvaluation[],
  manuscript: string | undefined,
  issues: EngagementContractIssue[]
): RelationshipEvolutionCarryoverResult {
  const result: RelationshipEvolutionCarryoverResult = {
    metadataFailures: 0,
    manuscriptFailures: 0,
  };
  const expectation = extractLatestPriorRelationshipEvolution(chapter, relationshipsInput);

  if (!expectation) {
    return result;
  }

  const metadataAssessment = assessRelationshipEvolutionCarryover(
    chapterToRelationshipEvolutionCarryoverEvidenceText(chapter),
    expectation
  );
  if (!metadataAssessment.passed) {
    issues.push({
      code: 'relationship-evolution-carryover-not-staged',
      severity: 'critical',
      message:
        'The chapter drops the prior relationship evolution instead of carrying the changed relationship state into current pressure and dialogue behavior.',
      expected: metadataAssessment.expected,
      actual: metadataAssessment.actual,
    });
    result.metadataFailures++;
  }

  if (manuscript?.trim()) {
    const manuscriptAssessment = assessRelationshipEvolutionCarryover(
      manuscriptToRelationshipEvolutionCarryoverOpeningText(manuscript),
      expectation
    );
    if (!manuscriptAssessment.passed) {
      issues.push({
        code: 'manuscript-relationship-evolution-carryover-not-evidenced',
        severity: 'critical',
        message:
          'The manuscript opening skips the prior relationship evolution instead of making the changed relationship visible on page.',
        expected: manuscriptAssessment.expected,
        actual: manuscriptAssessment.actual,
      });
      result.manuscriptFailures++;
    }
  }

  return result;
}

function extractLatestPriorRelationshipEvolution(
  chapter: ChapterWithReaderExperience,
  relationshipsInput: RelationshipsForEvaluation | RelationshipForEvaluation[]
): RelationshipEvolutionCarryoverExpectation | undefined {
  if (chapter.chapter_number <= 1) {
    return undefined;
  }

  const candidates = normalizeRelationshipsForEvaluation(relationshipsInput)
    .flatMap(relationship =>
      (relationship.evolution ?? []).map(evolution => ({
        chapter: evolution.chapter,
        change: evolution.change?.trim() ?? '',
      }))
    )
    .filter(
      evolution =>
        evolution.chapter !== undefined &&
        evolution.chapter < chapter.chapter_number &&
        evolution.change &&
        (isRelationshipShiftExpectation(evolution.change) ||
          countMatches(evolution.change, RELATIONSHIP_STATE_PATTERN) > 0)
    );

  if (candidates.length === 0) {
    return undefined;
  }

  const latestChapter = Math.max(...candidates.map(candidate => candidate.chapter ?? 0));
  const source = candidates
    .filter(candidate => candidate.chapter === latestChapter)
    .map(candidate => candidate.change)
    .join(' / ');
  const terms = extractRelationshipEvolutionCarryoverTerms(source);

  if (terms.length < 2) {
    return undefined;
  }

  return {
    source,
    chapter: latestChapter,
    terms,
    requiredTerms: Math.min(4, Math.max(2, Math.ceil(terms.length * 0.35))),
  };
}

function extractRelationshipEvolutionCarryoverTerms(source: string): string[] {
  const stopWords = new Set([
    '관계',
    '변화',
    '회차',
    '이동한다',
    '이동',
    '바뀐다',
    '바뀌었다',
    '달라졌다',
    '상태',
    '현재',
    '다음',
    '지난',
    '이후',
  ]);
  const terms = normalizeText(source)
    .split(/\s+/u)
    .map(token =>
      token.replace(
        /(으로|에서|에게|부터|까지|처럼|이라는|라는|하고|하며|해서|과|와|의|을|를|이|가|은|는|도|만|로|에)$/u,
        ''
      )
    )
    .filter(token => token.length >= 2 && !stopWords.has(token));

  return uniqueStrings(terms).slice(0, 12);
}

function assessRelationshipEvolutionCarryover(
  currentEvidence: string,
  expectation: RelationshipEvolutionCarryoverExpectation
): RelationshipEvolutionCarryoverAssessment {
  const directOverlap = containsExpectedBeatEvidence(
    currentEvidence,
    expectation.source,
    0.24
  );
  const normalizedEvidence = normalizeText(currentEvidence);
  const matchedTerms = expectation.terms.filter(term =>
    normalizedEvidence.includes(normalizeText(term))
  );
  const stateSignals = countMatches(currentEvidence, RELATIONSHIP_STATE_PATTERN);
  const carryoverSignals = countMatches(
    currentEvidence,
    RELATIONSHIP_EVOLUTION_CARRYOVER_PATTERN
  );
  const actionSignals = countMatches(currentEvidence, RELATIONSHIP_ACTION_PATTERN);
  const responseSignals = countMatches(currentEvidence, RELATIONSHIP_RESPONSE_PATTERN);
  const passed =
    directOverlap ||
    (matchedTerms.length >= expectation.requiredTerms &&
      stateSignals >= 1 &&
      (carryoverSignals >= 2 || (actionSignals >= 1 && responseSignals >= 1)));

  return {
    passed,
    expected:
      `relationship evolution carryover from chapter ${expectation.chapter}: prior relationship change must shape the next chapter previous_summary/current_plot, reader_experience, opening scene, and manuscript opening as changed trust/distrust, distance, alliance, dialogue stance, or behavior.`,
    actual:
      `direct overlap=${directOverlap}, matched terms=${matchedTerms.length}/${expectation.terms.length} ` +
      `(${matchedTerms.join(', ') || 'none'}), required terms=${expectation.requiredTerms}, ` +
      `state signals=${stateSignals}, carryover signals=${carryoverSignals}, action signals=${actionSignals}, ` +
      `response signals=${responseSignals}, prior="${abbreviateEvidence(expectation.source, 220)}", ` +
      `evidence="${abbreviateEvidence(currentEvidence, 260)}"`,
  };
}

function normalizeRelationshipsForEvaluation(
  input: RelationshipsForEvaluation | RelationshipForEvaluation[]
): RelationshipForEvaluation[] {
  if (Array.isArray(input)) {
    return input;
  }

  return Array.isArray(input.relationships) ? input.relationships : [];
}

function hasRelationshipEvolutionChangeEvidence(
  change: string,
  expectedDevelopment: string
): boolean {
  const text = normalizeText(change);
  if (containsExpectedBeatEvidence(text, expectedDevelopment, 0.18)) {
    return true;
  }

  return (
    countMatches(text, RELATIONSHIP_ACTOR_PATTERN) >= 1 &&
    countMatches(text, RELATIONSHIP_ACTION_PATTERN) >= 1 &&
    countMatches(text, RELATIONSHIP_STATE_PATTERN) >= 1
  );
}

function hasRelationshipReciprocalPair(text: string): boolean {
  return (
    /(주인공|그는|그가|그녀).{0,80}(사과|고백|공개|드러내|털어놓|약점|비밀|손을\s*내밀|선택|감수)/u.test(text) &&
    /(조력자|동료|친구|연인|가족|상대|그녀|그는|둘|두\s*사람).{0,80}(침묵|대답|반박|거절|받아들|고개|시선|손을\s*(?:잡|내밀)|휴대폰을\s*건네|동행|약속|믿|의심|용서|감싸|막아섰|따라섰)/u.test(text)
  );
}

function expandCharacterLabelVariants(
  expected: string,
  characters: CharacterReferenceForEvaluation[]
): string[] {
  const variants = new Set([expected]);
  const protagonistNames = characters
    .filter(character => character.role === 'protagonist')
    .flatMap(character => [character.name, ...(character.aliases ?? [])])
    .filter(Boolean);
  const supportingNames = characters
    .filter(character =>
      ['deuteragonist', 'supporting'].includes(character.role ?? '')
    )
    .flatMap(character => [character.name, ...(character.aliases ?? [])])
    .filter(Boolean);

  for (const name of protagonistNames) {
    variants.add(expected.replace(/주인공/gu, name));
  }

  for (const name of supportingNames) {
    variants.add(expected.replace(/조력자/gu, name));
  }

  return [...variants];
}

const GENERIC_CHARACTER_LABEL_PATTERN =
  /(주인공|조력자|남주|여주|주연|히로인|악역|빌런|라이벌|동료|상대역)/gu;

function assessManuscriptGenericCharacterLabels(
  manuscript: string,
  characters: CharacterReferenceForEvaluation[]
): ManuscriptGenericCharacterLabelAssessment {
  const names = extractCharacterDisplayNames(characters);
  if (names.length === 0) {
    return {
      passed: true,
      expected: 'character names=none',
      actual: 'generic character label check=not applicable',
    };
  }

  const prose = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(' ');
  const genericLabelCount = countMatches(prose, GENERIC_CHARACTER_LABEL_PATTERN);
  const nameHits = names
    .map(name => ({ name, count: countLiteralOccurrences(prose, name) }))
    .filter(hit => hit.count > 0);
  const totalNameHits = nameHits.reduce((sum, hit) => sum + hit.count, 0);
  const excessiveGenericLabels =
    genericLabelCount >= 3 &&
    (totalNameHits === 0 || genericLabelCount > Math.max(2, totalNameHits * 2));

  return {
    passed: !excessiveGenericLabels,
    expected: `use character names/aliases in manuscript prose: ${names.join(', ')}`,
    actual: `generic character labels=${genericLabelCount}, character name hits=${totalNameHits} (${nameHits
      .map(hit => `${hit.name}:${hit.count}`)
      .join(', ') || 'none'})`,
  };
}

function extractCharacterDisplayNames(characters: CharacterReferenceForEvaluation[]): string[] {
  const names = characters.flatMap(character => [
    character.name,
    ...(character.aliases ?? []),
  ]);

  return [
    ...new Set(
      names
        .map(name => name?.trim())
        .filter((name): name is string => Boolean(name && name.length >= 2))
    ),
  ];
}

function countLiteralOccurrences(text: string, value: string): number {
  if (!value) return 0;

  let count = 0;
  let index = text.indexOf(value);
  while (index >= 0) {
    count += 1;
    index = text.indexOf(value, index + value.length);
  }

  return count;
}

const DESIGN_JARGON_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: '지적 쾌감', pattern: /지적\s*쾌감/gu },
  { label: '보상 주기', pattern: /보상\s*주기/gu },
  { label: '장기 미스터리', pattern: /장기\s*미스터리/gu },
  { label: '독자 보상', pattern: /독자\s*(?:보상|몰입|기대|이탈|반응)/gu },
  { label: '핵심 질문', pattern: /핵심\s*질문/gu },
  { label: '페이지터너', pattern: /페이지\s*터너|페이지터너/gu },
  { label: '클리프행어', pattern: /클리프\s*행어|클리프행어/gu },
  { label: '드롭오프', pattern: /드롭\s*오프|드롭오프/gu },
  { label: '회차 보상', pattern: /매\s*회차\s*(?:작은\s*)?규칙\s*증명|규칙\s*증명이라는\s*보상/gu },
  { label: '장르/감정 보상', pattern: /(?:장르|감정)\s*보상/gu },
  { label: '설계 필드명', pattern: /reader_experience|fun_spec|must_click|long_hook|payoff_cadence/giu },
  {
    label: '평가 효과 제공',
    pattern: /(?:쾌감|긴장감|몰입|재미|보상)[^.!?。！？]{0,24}(?:제공|유지|유도)(?:한다|된다|돼|해)/gu,
  },
];

function assessManuscriptDesignJargon(
  manuscript: string
): ManuscriptDesignJargonAssessment {
  const prose = manuscript
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(' ');
  const matchedTerms = DESIGN_JARGON_PATTERNS.flatMap(({ label, pattern }) => {
    const count = countMatches(prose, pattern);
    return count > 0 ? [{ label, count }] : [];
  });
  const totalJargonHits = matchedTerms.reduce((sum, term) => sum + term.count, 0);
  const severeJargonHits = matchedTerms
    .filter(term =>
      [
        '지적 쾌감',
        '보상 주기',
        '장기 미스터리',
        '회차 보상',
        '설계 필드명',
        '평가 효과 제공',
      ].includes(term.label)
    )
    .reduce((sum, term) => sum + term.count, 0);

  return {
    passed: severeJargonHits === 0 && totalJargonHits < 2,
    expected:
      'scene-native prose: render reader reward, hook, payoff cadence, and long mystery as concrete clue/action/reaction rather than design or evaluation jargon.',
    actual: `design jargon terms=${
      matchedTerms.map(term => `${term.label}:${term.count}`).join(', ') || 'none'
    }`,
  };
}

function extractEmotionalArcExpectations(
  chapter: ChapterWithReaderExperience
): EmotionalArcExpectation[] {
  const rawSources = extractEmotionalArcSources(chapter);
  const expectations: EmotionalArcExpectation[] = [];
  for (const rawSource of rawSources) {
    const normalizedValue = normalizeText(rawSource.value);
    const matchedFamilies = EMOTIONAL_ARC_FAMILIES.filter(family =>
      family.triggerPattern.test(normalizedValue)
    );

    for (const family of matchedFamilies) {
      expectations.push({
        key: family.key,
        label: family.label,
        source: rawSource.source,
        evidencePattern: family.evidencePattern,
      });
    }

    if (matchedFamilies.length === 0) {
      for (const term of extractEmotionalArcFallbackTerms(rawSource.value)) {
        expectations.push({
          key: `term:${term}`,
          label: term,
          source: rawSource.source,
          evidencePattern: new RegExp(escapeRegExp(term), 'u'),
        });
      }
    }
  }

  return uniqueEmotionalArcExpectations(expectations);
}

function extractEmotionalProgressionExpectations(
  chapter: ChapterWithReaderExperience
): EmotionalArcExpectation[] {
  const expectations: EmotionalArcExpectation[] = [];
  for (const rawSource of extractEmotionalArcSources(chapter)) {
    const normalizedValue = normalizeText(rawSource.value);
    const matchedFamilies = EMOTIONAL_ARC_FAMILIES.map((family, order) => ({
      family,
      order,
      index: normalizedValue.search(family.triggerPattern),
    }))
      .filter(match => match.index >= 0)
      .sort((left, right) => left.index - right.index || left.order - right.order);

    for (const { family } of matchedFamilies) {
      expectations.push({
        key: family.key,
        label: family.label,
        source: rawSource.source,
        evidencePattern: family.evidencePattern,
      });
    }
  }

  return uniqueEmotionalArcExpectations(expectations);
}

function extractEmotionalArcSources(
  chapter: ChapterWithReaderExperience
): EmotionalArcSource[] {
  const legacyContextGoal = (
    chapter as ChapterWithReaderExperience & { context?: { emotional_goal?: string } }
  ).context?.emotional_goal;
  return [
    { source: 'emotional_goal', value: chapter.narrative_elements?.emotional_goal },
    { source: 'context.emotional_goal', value: legacyContextGoal },
    ...(chapter.scenes ?? []).map(scene => ({
      source: `scene ${scene.scene_number} emotional_tone`,
      value: scene.emotional_tone,
    })),
  ].filter((entry): entry is { source: string; value: string } =>
    Boolean(entry.value?.trim())
  );
}

function uniqueEmotionalArcExpectations(
  expectations: EmotionalArcExpectation[]
): EmotionalArcExpectation[] {
  const unique = new Map<string, EmotionalArcExpectation>();
  for (const expectation of expectations) {
    if (!unique.has(expectation.key)) {
      unique.set(expectation.key, expectation);
    }
  }

  return [...unique.values()];
}

function extractEmotionalArcFallbackTerms(value: string): string[] {
  const terms = normalizeText(value).match(/[가-힣a-z0-9]{2,}/gu) ?? [];
  return [
    ...new Set(
      terms
        .map(term =>
          term.replace(
            /(?:으로|에서|에게|까지|부터|처럼|라는|이라는|감으로|감에서|감|함|성|과|와|의|이|가|은|는|을|를|로|에|도|만)$/u,
            ''
          )
        )
        .filter(term => term.length >= 2 && !GENERIC_EMOTIONAL_ARC_TERMS.has(term))
    ),
  ];
}

function findEmotionalArcEvidencePosition(
  sentences: string[],
  expectation: EmotionalArcExpectation
): number | undefined {
  return findEmotionalArcEvidencePositionAfter(sentences, expectation, 0);
}

function findOrderedEmotionalArcEvidencePositions(
  sentences: string[],
  expectations: EmotionalArcExpectation[]
): Array<{ expectation: EmotionalArcExpectation; position: number | undefined }> {
  let startIndex = 0;
  return expectations.map(expectation => {
    const position = findEmotionalArcEvidencePositionInForwardWindow(
      sentences,
      expectation,
      startIndex
    );
    if (position !== undefined) {
      startIndex = position;
    }

    return { expectation, position };
  });
}

function findEmotionalArcEvidencePositionAfter(
  sentences: string[],
  expectation: EmotionalArcExpectation,
  startIndex: number
): number | undefined {
  for (let index = Math.max(0, startIndex); index < sentences.length; index += 1) {
    const window = sentences.slice(Math.max(0, index - 1), index + 2).join(' ');
    if (expectation.evidencePattern.test(window)) {
      return index;
    }
  }

  return undefined;
}

function findEmotionalArcEvidencePositionInForwardWindow(
  sentences: string[],
  expectation: EmotionalArcExpectation,
  startIndex: number
): number | undefined {
  const evidencePattern =
    EMOTIONAL_PROGRESSION_EVIDENCE_OVERRIDES.get(expectation.key) ??
    expectation.evidencePattern;
  for (let index = Math.max(0, startIndex); index < sentences.length; index += 1) {
    if (evidencePattern.test(sentences[index])) {
      return index;
    }
  }

  return undefined;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface ManuscriptSceneIntentGap {
  sceneNumber: number;
  missing: string[];
}

interface ManuscriptSceneOrderAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptSceneStateDeltaAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptSceneNoveltyMatrixAssessment {
  passed: boolean;
  actual: string;
}

interface ManuscriptSceneEvidencePosition {
  sceneNumber: number;
  position: number;
}

interface ManuscriptSceneStateDeltaDetail {
  sceneNumber: number;
  passed: boolean;
  span: string;
  beforeSignals: number;
  afterSignals: number;
  dimensions: string[];
  objectSignals: number;
  actionSignals: number;
  abstractOnly: boolean;
}

interface ManuscriptSceneNoveltyMatrixDetail {
  sceneNumber: number;
  passed: boolean;
  span: string;
  expectedAxes: string[];
  actualAxes: string[];
  missingAxes: string[];
  settingAffordance: boolean;
  missingWindow: boolean;
}

function assessManuscriptSceneOrder(
  manuscript: string,
  scenes: ChapterSceneForEvaluation[]
): ManuscriptSceneOrderAssessment {
  if (scenes.length < 2) {
    return {
      passed: true,
      actual: `scene positions=${scenes.length}`,
    };
  }

  const positions = scenes
    .map(scene => {
      const evidenceTexts = [
        hasMeaningfulConflict(scene.conflict) ? scene.conflict : undefined,
        hasMeaningfulSceneTurn(scene.beat) ? scene.beat : undefined,
      ].filter((value): value is string => Boolean(value?.trim()));
      const evidencePositions = evidenceTexts
        .map(expected => findExpectedBeatSentenceIndex(manuscript, expected, 0.3))
        .filter((position): position is number => typeof position === 'number');

      if (evidencePositions.length === 0) {
        return undefined;
      }

      return {
        sceneNumber: scene.scene_number,
        position: Math.min(...evidencePositions),
      };
    })
    .filter((position): position is ManuscriptSceneEvidencePosition => position !== undefined)
    .sort((left, right) => left.sceneNumber - right.sceneNumber);

  if (positions.length < 2) {
    return {
      passed: true,
      actual: `scene positions=${positions.map(formatScenePosition).join(', ') || 'insufficient evidence'}`,
    };
  }

  const inversions: string[] = [];
  for (let index = 1; index < positions.length; index++) {
    const previous = positions[index - 1];
    const current = positions[index];
    if (current.position < previous.position) {
      inversions.push(`${formatScenePosition(current)} before ${formatScenePosition(previous)}`);
    }
  }

  return {
    passed: inversions.length === 0,
    actual: `scene positions=${positions.map(formatScenePosition).join(', ')}; inversions=${inversions.join(' / ') || 'none'}`,
  };
}

function formatScenePosition(position: ManuscriptSceneEvidencePosition): string {
  return `scene ${position.sceneNumber}@${position.position}`;
}

function findExpectedBeatSentenceIndex(
  manuscript: string,
  expected: string,
  threshold: number
): number | undefined {
  const sentences = splitManuscriptSentences(manuscript);
  for (let index = 0; index < sentences.length; index++) {
    const sentenceWindow = sentences.slice(index, Math.min(sentences.length, index + 2)).join(' ');
    if (containsExpectedBeatEvidence(sentenceWindow, expected, threshold)) {
      return index;
    }
  }

  return undefined;
}

function findManuscriptSceneIntentGaps(
  manuscript: string,
  scenes: ChapterSceneForEvaluation[]
): ManuscriptSceneIntentGap[] {
  if (scenes.length === 0) {
    return [];
  }

  const gaps = scenes
    .map(scene => {
      const missing: string[] = [];
      if (
        hasMeaningfulConflict(scene.conflict) &&
        !containsExpectedBeatEvidence(manuscript, scene.conflict ?? '', 0.3)
      ) {
        missing.push('conflict');
      }

      if (
        hasMeaningfulSceneTurn(scene.beat) &&
        !containsExpectedBeatEvidence(manuscript, scene.beat ?? '', 0.3)
      ) {
        missing.push('turn');
      }

      return missing.length > 0
        ? {
            sceneNumber: scene.scene_number,
            missing,
          }
        : undefined;
    })
    .filter((gap): gap is ManuscriptSceneIntentGap => gap !== undefined);

  const evidencedRatio = (scenes.length - gaps.length) / scenes.length;
  return evidencedRatio < 0.75 ? gaps : [];
}

function assessManuscriptSceneStateDelta(
  manuscript: string,
  scenes: ChapterSceneForEvaluation[]
): ManuscriptSceneStateDeltaAssessment {
  if (scenes.length === 0) {
    return {
      passed: true,
      actual: 'manuscript scene state delta skipped: scenes=0',
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return {
      passed: false,
      actual: 'manuscript scene state delta sentences=0',
    };
  }

  const details = scenes.map(scene =>
    assessManuscriptSingleSceneStateDelta(manuscript, sentences, scene)
  );
  const passedCount = details.filter(detail => detail.passed).length;
  const requiredCount = Math.max(1, Math.ceil(scenes.length * 0.75));

  return {
    passed: passedCount >= requiredCount,
    actual: `scene state delta windows=${details
      .map(formatManuscriptSceneStateDeltaDetail)
      .join(' / ')}; passed=${passedCount}/${scenes.length}; required=${requiredCount}`,
  };
}

function assessManuscriptSingleSceneStateDelta(
  manuscript: string,
  sentences: string[],
  scene: ChapterSceneForEvaluation
): ManuscriptSceneStateDeltaDetail {
  const conflictPosition = hasMeaningfulConflict(scene.conflict)
    ? findExpectedBeatSentenceIndex(manuscript, scene.conflict ?? '', 0.25)
    : undefined;
  const beatPosition = hasMeaningfulSceneTurn(scene.beat)
    ? findExpectedBeatSentenceIndex(manuscript, scene.beat ?? '', 0.25)
    : undefined;
  const positions = [conflictPosition, beatPosition].filter(
    (position): position is number => typeof position === 'number'
  );

  if (positions.length === 0) {
    return {
      sceneNumber: scene.scene_number,
      passed: false,
      span: 'missing',
      beforeSignals: 0,
      afterSignals: 0,
      dimensions: [],
      objectSignals: 0,
      actionSignals: 0,
      abstractOnly: false,
    };
  }

  const start = Math.max(0, Math.min(...positions) - 1);
  const end = Math.min(sentences.length, Math.max(...positions) + 3);
  const window = sentences.slice(start, end).join(' ');
  const normalizedWindow = normalizeText(window);
  const beforeSignals =
    countMatches(normalizedWindow, SCENE_STATE_DELTA_BEFORE_PATTERN) +
    (hasMeaningfulConflict(scene.conflict) &&
    containsExpectedBeatEvidence(window, scene.conflict ?? '', 0.2)
      ? 1
      : 0);
  const afterSignals = countMatches(normalizedWindow, SCENE_STATE_DELTA_AFTER_PATTERN);
  const dimensions = SCENE_STATE_DELTA_DIMENSION_PATTERNS.filter(dimension =>
    dimension.pattern.test(normalizedWindow)
  ).map(dimension => dimension.label);
  const objectSignals = countMatches(normalizedWindow, SCENE_OBJECT_EVIDENCE_SIGNAL_PATTERN);
  const actionSignals = countMatches(normalizedWindow, SCENE_ACTION_OUTCOME_SIGNAL_PATTERN);
  const abstractOnly =
    countMatches(normalizedWindow, SCENE_STATE_DELTA_ABSTRACT_ONLY_PATTERN) > 0 &&
    afterSignals <= 1 &&
    dimensions.length === 0;
  const passed =
    beforeSignals >= 1 &&
    afterSignals >= 1 &&
    dimensions.length >= 1 &&
    (objectSignals >= 1 || actionSignals >= 1) &&
    !abstractOnly;

  return {
    sceneNumber: scene.scene_number,
    passed,
    span: `${start}-${Math.max(start, end - 1)}`,
    beforeSignals,
    afterSignals,
    dimensions,
    objectSignals,
    actionSignals,
    abstractOnly,
  };
}

function formatManuscriptSceneStateDeltaDetail(
  detail: ManuscriptSceneStateDeltaDetail
): string {
  return `scene ${detail.sceneNumber}@${detail.span}: ${detail.passed ? 'pass' : 'fail'} before=${detail.beforeSignals}, after=${detail.afterSignals}, dimensions=${
    detail.dimensions.join('+') || 'none'
  }, object=${detail.objectSignals}, action=${detail.actionSignals}, abstractOnly=${detail.abstractOnly}`;
}

function assessManuscriptSceneNoveltyMatrix(
  manuscript: string,
  scenes: ChapterSceneForEvaluation[]
): ManuscriptSceneNoveltyMatrixAssessment {
  if (scenes.length === 0) {
    return {
      passed: true,
      actual: 'manuscript scene novelty matrix skipped: scenes=0',
    };
  }

  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return {
      passed: false,
      actual: 'manuscript scene novelty matrix sentences=0',
    };
  }

  const stagedScenes = scenes
    .map(scene => ({
      scene,
      expectedAxes: extractSceneNoveltyAxes(sceneToEvidenceText(scene)),
    }))
    .filter(
      entry => entry.expectedAxes.size >= 3 && entry.expectedAxes.has('setting_mode')
    );

  if (stagedScenes.length === 0) {
    return {
      passed: true,
      actual:
        'manuscript scene novelty matrix skipped: no per-scene staged novelty matrix',
    };
  }

  const details = stagedScenes.map(entry =>
    assessManuscriptSingleSceneNoveltyMatrix(
      manuscript,
      sentences,
      entry.scene,
      entry.expectedAxes
    )
  );
  const passedCount = details.filter(detail => detail.passed).length;
  const requiredCount = Math.max(1, Math.ceil(stagedScenes.length * 0.75));

  return {
    passed: passedCount >= requiredCount,
    actual:
      `scene novelty matrix windows=${details
        .map(formatManuscriptSceneNoveltyMatrixDetail)
        .join(' / ')}; ` +
      `passed=${passedCount}/${stagedScenes.length}; required=${requiredCount}`,
  };
}

function assessManuscriptSingleSceneNoveltyMatrix(
  manuscript: string,
  sentences: string[],
  scene: ChapterSceneForEvaluation,
  expectedAxes: Set<string>
): ManuscriptSceneNoveltyMatrixDetail {
  const conflictPosition = hasMeaningfulConflict(scene.conflict)
    ? findExpectedBeatSentenceIndex(manuscript, scene.conflict ?? '', 0.25)
    : undefined;
  const beatPosition = hasMeaningfulSceneTurn(scene.beat)
    ? findExpectedBeatSentenceIndex(manuscript, scene.beat ?? '', 0.25)
    : undefined;
  const positions = [conflictPosition, beatPosition].filter(
    (position): position is number => typeof position === 'number'
  );
  const expectedAxisList = [...expectedAxes].sort();

  if (positions.length === 0) {
    return {
      sceneNumber: scene.scene_number,
      passed: false,
      span: 'missing',
      expectedAxes: expectedAxisList,
      actualAxes: [],
      missingAxes: expectedAxisList,
      settingAffordance: false,
      missingWindow: true,
    };
  }

  const start = Math.max(0, Math.min(...positions) - 1);
  const end = Math.min(sentences.length, Math.max(...positions) + 3);
  const window = sentences.slice(start, end).join(' ');
  const actualAxes = extractSceneNoveltyAxes(window);
  const actualAxisList = [...actualAxes].sort();
  const missingAxes = expectedAxisList.filter(axis => !actualAxes.has(axis));
  const settingModes = extractSceneNoveltySettingModes(window);
  const settingAffordance = [...settingModes].some(
    mode => mode !== 'specific-location'
  );
  const requiredAxisCount = Math.min(3, expectedAxes.size);
  const passed =
    actualAxes.size >= requiredAxisCount &&
    missingAxes.length === 0 &&
    (!expectedAxes.has('setting_mode') || settingAffordance);

  return {
    sceneNumber: scene.scene_number,
    passed,
    span: `${start}-${Math.max(start, end - 1)}`,
    expectedAxes: expectedAxisList,
    actualAxes: actualAxisList,
    missingAxes,
    settingAffordance,
    missingWindow: false,
  };
}

function extractSceneNoveltyAxes(evidence: string): Set<string> {
  const rewardModes = extractSceneNoveltyRewardModes(evidence);
  const conflictModes = extractSceneNoveltyConflictModes(evidence);
  const settingModes = extractSceneNoveltySettingModes(evidence);
  const oppositionModes = extractSceneNoveltyOppositionModes(evidence);
  const usableSettingModes = new Set(
    [...settingModes].filter(mode => mode !== 'specific-location')
  );
  const axes = new Set<string>();

  if (rewardModes.size > 0) axes.add('reward_mode');
  if (conflictModes.size > 0) axes.add('conflict_mode');
  if (usableSettingModes.size > 0) axes.add('setting_mode');
  if (oppositionModes.size > 0) axes.add('opposition_mode');

  return axes;
}

function formatManuscriptSceneNoveltyMatrixDetail(
  detail: ManuscriptSceneNoveltyMatrixDetail
): string {
  return `scene ${detail.sceneNumber}@${detail.span}: ${detail.passed ? 'pass' : 'fail'} expected=${
    detail.expectedAxes.join('+') || 'none'
  }, actual=${detail.actualAxes.join('+') || 'none'}, missing=${
    detail.missingAxes.join('+') || 'none'
  }, settingAffordance=${detail.settingAffordance}, missingWindow=${detail.missingWindow}`;
}

interface ReaderPromiseSpecificityAssessment {
  passed: boolean;
  actual: string;
}

interface ReaderPromisePremiseIntegrationAssessment {
  passed: boolean;
  actual: string;
}

const READER_PROMISE_SPECIFICITY_FIELDS: Array<{
  label: string;
  value: (promise: ReaderPromiseContract) => string | undefined;
}> = [
  { label: 'core_hook', value: promise => promise.core_hook },
  { label: 'irresistible_question', value: promise => promise.irresistible_question },
  { label: 'protagonist_appeal', value: promise => promise.protagonist_appeal },
  { label: 'novelty_angle', value: promise => promise.novelty_angle },
  { label: 'emotional_payoff', value: promise => promise.emotional_payoff },
  { label: 'binge_reason', value: promise => promise.binge_reason },
  { label: 'long_series_engine', value: promise => promise.long_series_engine },
  {
    label: 'first_five_chapter_retention_plan',
    value: promise => promise.first_five_chapter_retention_plan?.join(' '),
  },
];

const READER_PROMISE_CONCRETE_SIGNAL_PATTERN =
  /(살인|예고|예보|앱|알림|미제|사건\s*번호|번호|기록|로그|로고|파일|수신자|표적|피해자|현장|주소|좌표|이름|휴대폰|메시지|단서|패턴|개발자|가족|실종|경찰|통제선|규칙|제한\s*시간|계약|결혼|파혼|회귀|빙의|탑|던전|스킬|마법|왕국|황제|재벌|법정|재판|학교|병원|도시|감염|ai|로봇|우주|저주|혈통|드래곤|배신|복수|구하|구원|선택|비용|위험|대가|상실|실패|변조|조작|증거|문서|장부|사진|목걸이|반지|열쇠|상처|시계|문신|암호|코드|서명|지도|검|총|약|독|피|시신)/giu;
const READER_PROMISE_GENERIC_SIGNAL_PATTERN =
  /(흥미롭|재미|감동|매력|성장|새롭|독특|분위기|궁금|비밀|장기\s*서사|반전|사건과\s*반전|이야기|몰입|긴장감|쾌감|감정|서사|세계관|위기|갈등|전개|큰\s*비밀|더\s*큰|앞으로|어떤\s*일)/gu;
const READER_PROMISE_GENERIC_STOPWORDS = new Set([
  '흥미로운',
  '흥미롭고',
  '재미',
  '재미와',
  '감동',
  '감동이',
  '매력적이고',
  '성장하는',
  '주인공',
  '새롭고',
  '독특한',
  '분위기',
  '궁금해진다',
  '반전',
  '이야기',
  '비밀',
  '장기',
  '서사',
  '위기',
  '사건',
  '새로운',
  '시작',
  '앞으로',
  '어떤',
  '일이',
  '벌어질까',
  '이어지는',
]);

const READER_PROMISE_INTEGRATION_FIELDS: Array<{
  label: string;
  value: (promise: ReaderPromiseContract) => string | undefined;
}> = [
  { label: 'core_hook', value: promise => promise.core_hook },
  { label: 'irresistible_question', value: promise => promise.irresistible_question },
  { label: 'novelty_angle', value: promise => promise.novelty_angle },
  { label: 'binge_reason', value: promise => promise.binge_reason },
  { label: 'long_series_engine', value: promise => promise.long_series_engine },
  {
    label: 'first_five_chapter_retention_plan',
    value: promise => promise.first_five_chapter_retention_plan?.join(' '),
  },
];

const READER_PROMISE_INTEGRATION_STOPWORDS = new Set([
  ...READER_PROMISE_GENERIC_STOPWORDS,
  '각화',
  '회차',
  '매회',
  '매회차',
  '첫화',
  '다음화',
  '하나',
  '같은',
  '통해',
  '위한',
  '때마다',
  '마다',
  '이어',
  '이어지',
  '이어진다',
  '연결',
  '연결된다',
  '수렴',
  '수렴한다',
  '드러난다',
  '밝혀진다',
  '보여준다',
  '만든다',
  '반복',
  '동력',
  '약속',
  '보상',
  '계속',
  '중심',
  '질문',
]);

function assessReaderPromiseSpecificity(
  promise: ReaderPromiseContract
): ReaderPromiseSpecificityAssessment {
  const genericFields: string[] = [];
  const fieldSummaries: string[] = [];

  for (const field of READER_PROMISE_SPECIFICITY_FIELDS) {
    const rawValue = field.value(promise)?.trim();
    if (!rawValue) {
      continue;
    }

    const text = normalizeText(rawValue);
    const concreteSignals = countMatches(text, READER_PROMISE_CONCRETE_SIGNAL_PATTERN);
    const genericSignals = countMatches(text, READER_PROMISE_GENERIC_SIGNAL_PATTERN);
    const specificTokenCount = extractReaderPromiseSpecificTokens(text).length;
    const genericDominates = genericSignals >= 2 && concreteSignals === 0;
    const lacksSpecificAnchor = concreteSignals === 0;
    const tooThin = text.length < 8 || (specificTokenCount < 2 && concreteSignals < 2);

    fieldSummaries.push(
      `${field.label}: concrete=${concreteSignals}, generic=${genericSignals}, specificTokens=${specificTokenCount}`
    );

    if (lacksSpecificAnchor || genericDominates || tooThin) {
      genericFields.push(field.label);
    }
  }

  return {
    passed: genericFields.length === 0,
    actual: `generic fields=${genericFields.join(', ') || 'none'}; ${fieldSummaries.join('; ')}`,
  };
}

function assessReaderPromisePremiseIntegration(
  promise: ReaderPromiseContract
): ReaderPromisePremiseIntegrationAssessment {
  const fieldAnchors = READER_PROMISE_INTEGRATION_FIELDS
    .map(field => ({
      label: field.label,
      anchors: extractReaderPromiseAnchorTokens(field.value(promise) ?? ''),
    }))
    .filter(field => field.anchors.length > 0);

  const missingFields = READER_PROMISE_INTEGRATION_FIELDS
    .filter(field => !field.value(promise)?.trim())
    .map(field => field.label);
  const largestComponent = findLargestReaderPromiseAnchorComponent(fieldAnchors);
  const linkedLabels = new Set(largestComponent);
  const missingLinks: string[] = [];
  const coreLinkedToPremise =
    linkedLabels.has('core_hook') &&
    (linkedLabels.has('novelty_angle') || linkedLabels.has('irresistible_question'));
  const serialLinkedToPremise =
    linkedLabels.has('core_hook') &&
    (linkedLabels.has('binge_reason') || linkedLabels.has('long_series_engine'));
  const retentionLinked =
    !fieldAnchors.some(field => field.label === 'first_five_chapter_retention_plan') ||
    linkedLabels.has('first_five_chapter_retention_plan');
  const minimumConnectedFields = Math.min(4, fieldAnchors.length);

  if (missingFields.length > 0) {
    missingLinks.push(`missing fields=${missingFields.join(', ')}`);
  }

  if (!coreLinkedToPremise) {
    missingLinks.push('core_hook is not linked to novelty_angle or irresistible_question');
  }

  if (!serialLinkedToPremise) {
    missingLinks.push('binge_reason/long_series_engine are not linked to core_hook');
  }

  if (!retentionLinked) {
    missingLinks.push('first_five_chapter_retention_plan is not linked to the premise engine');
  }

  if (largestComponent.length < minimumConnectedFields) {
    missingLinks.push(
      `largest shared-anchor component has ${largestComponent.length}/${fieldAnchors.length} fields`
    );
  }

  return {
    passed: missingLinks.length === 0,
    actual: [
      `missing links=${missingLinks.join('; ') || 'none'}`,
      `linked fields=${largestComponent.join(', ') || 'none'}`,
      `anchors=${fieldAnchors
        .map(field => `${field.label}: ${field.anchors.slice(0, 8).join('/')}`)
        .join('; ')}`,
    ].join('; '),
  };
}

function findLargestReaderPromiseAnchorComponent(
  fields: Array<{ label: string; anchors: string[] }>
): string[] {
  const visited = new Set<string>();
  let largest: string[] = [];

  for (const field of fields) {
    if (visited.has(field.label)) {
      continue;
    }

    const component: string[] = [];
    const stack = [field.label];
    visited.add(field.label);

    while (stack.length > 0) {
      const currentLabel = stack.pop()!;
      component.push(currentLabel);
      const current = fields.find(candidate => candidate.label === currentLabel);
      if (!current) {
        continue;
      }

      for (const candidate of fields) {
        if (visited.has(candidate.label)) {
          continue;
        }

        if (hasReaderPromiseAnchorOverlap(current.anchors, candidate.anchors)) {
          visited.add(candidate.label);
          stack.push(candidate.label);
        }
      }
    }

    if (component.length > largest.length) {
      largest = component;
    }
  }

  return largest;
}

function hasReaderPromiseAnchorOverlap(left: string[], right: string[]): boolean {
  const rightAnchors = new Set(right);
  return left.some(anchor => rightAnchors.has(anchor));
}

function extractReaderPromiseAnchorTokens(text: string): string[] {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  const concreteSignals = normalized.match(READER_PROMISE_CONCRETE_SIGNAL_PATTERN) ?? [];
  const specificTokens = extractReaderPromiseSpecificTokens(normalized);
  return uniqueStrings(
    [...concreteSignals, ...specificTokens]
      .map(canonicalizeReaderPromiseAnchor)
      .filter(
        token =>
          token.length >= 2 &&
          !READER_PROMISE_INTEGRATION_STOPWORDS.has(token) &&
          !/^\d+화?$/u.test(token)
      )
  )
    .slice(0, 24);
}

function canonicalizeReaderPromiseAnchor(token: string): string {
  return normalizeText(token).replace(
    /(으로|에서|에게|부터|까지|처럼|이라는|라는|하고|하며|해서|되는|하는|한다|된다|했다|였다|과|와|의|을|를|이|가|은|는|도|만|로|에)$/u,
    ''
  );
}

function extractReaderPromiseSpecificTokens(text: string): string[] {
  return (text.match(/[가-힣a-z0-9]{2,}/giu) ?? []).filter(
    token => !READER_PROMISE_GENERIC_STOPWORDS.has(token)
  );
}

function evaluateOpeningHookEvidence(
  manuscript: string | undefined,
  promise: ReaderPromiseContract,
  chapter: ChapterWithReaderExperience,
  issues: EngagementContractIssue[]
): number | undefined {
  const text = manuscript?.trim();
  if (!text || chapter.chapter_number !== 1) {
    return undefined;
  }

  const openingParagraph = extractOpeningProseParagraph(text);
  const expectedSignals = [
    promise.core_hook,
    promise.novelty_angle,
  ]
    .map(signal => signal?.trim())
    .filter((signal): signal is string => Boolean(signal));

  if (!containsAnyExpectedBeatEvidence(openingParagraph, expectedSignals, 0.25)) {
    issues.push({
      code: 'opening-hook-not-evidenced',
      severity: 'critical',
      message: 'Chapter 1 manuscript opening paragraph does not stage the design core_hook or novelty_angle.',
      expected: promise.core_hook,
      actual: abbreviateEvidence(openingParagraph || text),
    });
    return 30;
  }

  const openingSentence = extractOpeningProseSentence(openingParagraph);
  if (!containsAnyExpectedBeatEvidence(openingSentence, expectedSignals, 0.25)) {
    issues.push({
      code: 'opening-hook-delayed',
      severity: 'critical',
      message: 'Chapter 1 manuscript opening hook is delayed past the first sentence or first beat.',
      expected: 'first sentence/first beat must stage core_hook or novelty_angle',
      actual: abbreviateEvidence(openingSentence || openingParagraph),
    });
    return 60;
  }

  const firstScreen = assessOpeningHookEmbodiment(openingParagraph);
  if (!firstScreen.passed) {
    issues.push({
      code: 'opening-hook-not-embodied',
      severity: 'critical',
      message:
        'Chapter 1 manuscript names the premise early but does not embody the first-screen hook as live story pressure.',
      expected: firstScreen.expected,
      actual: firstScreen.actual,
    });
    return 70;
  }

  return 100;
}

interface OpeningHookEmbodimentAssessment {
  passed: boolean;
  expected: string;
  actual: string;
}

function assessOpeningHookEmbodiment(
  openingParagraph: string
): OpeningHookEmbodimentAssessment {
  const sentences = splitManuscriptSentences(openingParagraph);
  const firstScreen = (sentences.length > 0
    ? sentences.slice(0, 2).join(' ')
    : openingParagraph
  ).trim();

  const liveActionSignals = countMatches(
    firstScreen,
    /(울리|울린|울렸|뜨|떴|깜박|눌렀|쥐|움켜|잡|열|닫|뛰|달려|내려|올라|막|찾으|계산|신고|우회|멈췄|돌아|움직|다가|숨었|들어|나갔|나온|향했|확인하|확인했)/gu
  );
  const agencyOrDecisionSignals = countMatches(
    firstScreen,
    /(선택해야|결정해야|감수하|포기하|신고하|계산하|뛰쳐|찾으려|구하려|막으려|확인하려|버리|접고|우회|따라가|향했|손을\s*(?:뻗|쥐|움켜|올렸)|버튼을\s*눌렀)/gu
  );
  const sensoryOrPovSignals = countMatches(
    firstScreen,
    /(손|손바닥|손가락|숨|심장|목덜미|목|가슴|피부|눈|시선|귀|입술|땀|식은땀|떨|차갑|뜨거|젖은|소리|빛|냄새|화면|휴대폰|알림|버튼|복도|계단|조명|문턱|철문|유리|피|칼|총|어둠)/gu
  );
  const dangerOrQuestionSignals = countMatches(
    firstScreen,
    /(왜|어떻게|누가|무엇|알\s*수\s*없|\?|？|살인|죽|사망|실종|위험|위협|표적|수신자|예고|알림|제한\s*시간|카운트다운|대가|비용|알리바이|닫히|사라|차단|막히|장난으로\s*넘길지|선택해야)/gu
  );

  const passed =
    liveActionSignals >= 1 &&
    agencyOrDecisionSignals >= 1 &&
    sensoryOrPovSignals >= 1 &&
    dangerOrQuestionSignals >= 2;

  return {
    passed,
    expected:
      'first-screen hook embodiment: first 1-2 sentences should combine live action, protagonist agency/decision pressure, sensory or POV grounding, and unresolved danger/question signals.',
    actual:
      `first-screen action=${liveActionSignals}, agency=${agencyOrDecisionSignals}, ` +
      `sensory/POV=${sensoryOrPovSignals}, danger/question=${dangerOrQuestionSignals}, ` +
      `first-screen="${abbreviateEvidence(firstScreen, 220)}"`,
  };
}

function getRetentionPlanBeat(
  promise: ReaderPromiseContract,
  chapterNumber: number
): string | undefined {
  if (chapterNumber < 1 || chapterNumber > 5) {
    return undefined;
  }

  const plans = promise.first_five_chapter_retention_plan ?? [];
  const explicitPlan = plans.find(plan => {
    const match = plan.match(/^\s*(\d+)\s*화\s*[:：-]\s*(.+)$/u);
    return match ? Number(match[1]) === chapterNumber : false;
  });
  const plan = explicitPlan ?? plans[chapterNumber - 1];

  if (!plan) {
    return undefined;
  }

  return stripChapterPrefix(plan);
}

function stripChapterPrefix(value: string): string {
  return value.replace(/^\s*\d+\s*화\s*[:：-]\s*/u, '').trim();
}

function extractOpeningProseParagraph(manuscript: string): string {
  const paragraphs = manuscript
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/u)
    .map(paragraph =>
      paragraph
        .split('\n')
        .filter(line => !line.trim().startsWith('#'))
        .join(' ')
        .trim()
    )
    .filter(Boolean);

  return paragraphs[0] ?? '';
}

function extractOpeningProseSentence(openingParagraph: string): string {
  return splitManuscriptSentences(openingParagraph)[0] ?? openingParagraph.trim();
}

function chapterToEngagementEvidenceText(chapter: ChapterWithReaderExperience): string {
  const readerExperience = chapter.reader_experience;
  return [
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.page_turner_question,
    readerExperience.character_appeal_moment,
    readerExperience.must_click_ending,
    chapterToSceneEvidenceText(chapter),
  ]
    .filter(Boolean)
    .join(' ');
}

function chapterToSerialVarietyEvidenceText(chapter: ChapterWithReaderExperience): string {
  const readerExperience = chapter.reader_experience;
  return [
    chapter.context?.current_plot,
    chapter.narrative_elements?.character_development,
    chapter.narrative_elements?.emotional_goal,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.page_turner_question,
    readerExperience.character_appeal_moment,
    readerExperience.drop_off_risk,
    readerExperience.must_click_ending,
    chapterToSceneEvidenceText(chapter),
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function chapterToCliffhangerCarryoverEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  const firstScene = chapter.scenes?.[0];
  return [
    chapter.context?.current_plot,
    readerExperience.chapter_reward,
    firstScene ? sceneToEvidenceText(firstScene) : '',
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function chapterToCliffhangerCarryoverImmediateEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const firstScene = chapter.scenes?.[0];
  return firstScene ? sceneToEvidenceText(firstScene) : '';
}

function manuscriptToCliffhangerCarryoverOpeningText(manuscript: string): string {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return manuscript.slice(0, 900);
  }
  return sentences.slice(0, Math.min(5, sentences.length)).join(' ');
}

function manuscriptToCliffhangerCarryoverImmediateOpeningText(
  manuscript: string
): string {
  const sentences = splitManuscriptSentences(manuscript);
  if (sentences.length === 0) {
    return manuscript.slice(0, 320);
  }
  return sentences.slice(0, Math.min(2, sentences.length)).join(' ');
}

function chapterToChoiceCostLockCarryoverEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  const firstScene = chapter.scenes?.[0];
  return [
    chapter.context?.previous_summary,
    chapter.context?.current_plot,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.character_appeal_moment,
    readerExperience.drop_off_risk,
    firstScene ? sceneToEvidenceText(firstScene) : '',
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function manuscriptToChoiceCostLockCarryoverOpeningText(manuscript: string): string {
  return manuscriptToCliffhangerCarryoverOpeningText(manuscript);
}

function chapterToRelationshipEvolutionCarryoverEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  const firstScene = chapter.scenes?.[0];
  return [
    chapter.context?.previous_summary,
    chapter.context?.current_plot,
    readerExperience.promise_fulfillment,
    readerExperience.character_appeal_moment,
    readerExperience.drop_off_risk,
    chapter.narrative_elements?.character_development,
    firstScene ? sceneToEvidenceText(firstScene) : '',
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function manuscriptToRelationshipEvolutionCarryoverOpeningText(manuscript: string): string {
  return manuscriptToCliffhangerCarryoverOpeningText(manuscript);
}

function chapterToRevelationConsequenceCarryoverEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  const firstScene = chapter.scenes?.[0];
  return [
    chapter.context?.previous_summary,
    chapter.context?.current_plot,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.page_turner_question,
    readerExperience.character_appeal_moment,
    readerExperience.drop_off_risk,
    firstScene ? sceneToEvidenceText(firstScene) : '',
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function manuscriptToRevelationConsequenceCarryoverOpeningText(manuscript: string): string {
  return manuscriptToCliffhangerCarryoverOpeningText(manuscript);
}

function chapterToMysteryHypothesisCarryoverEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  const firstScene = chapter.scenes?.[0];
  return [
    chapter.context?.previous_summary,
    chapter.context?.current_plot,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.page_turner_question,
    readerExperience.character_appeal_moment,
    readerExperience.drop_off_risk,
    firstScene ? sceneToEvidenceText(firstScene) : '',
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function manuscriptToMysteryHypothesisCarryoverOpeningText(manuscript: string): string {
  return manuscriptToCliffhangerCarryoverOpeningText(manuscript);
}

function chapterToAntagonistCountermoveCarryoverEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  const firstScene = chapter.scenes?.[0];
  return [
    chapter.context?.previous_summary,
    chapter.context?.current_plot,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.page_turner_question,
    readerExperience.drop_off_risk,
    firstScene ? sceneToEvidenceText(firstScene) : '',
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function manuscriptToAntagonistCountermoveCarryoverOpeningText(
  manuscript: string
): string {
  return manuscriptToCliffhangerCarryoverOpeningText(manuscript);
}

function chapterToArcProgressionEvidenceText(chapter: ChapterWithReaderExperience): string {
  const readerExperience = chapter.reader_experience;
  return [
    chapter.context?.current_plot,
    chapter.narrative_elements?.character_development,
    chapter.narrative_elements?.emotional_goal,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.page_turner_question,
    readerExperience.character_appeal_moment,
    readerExperience.must_click_ending,
    chapterToSceneEvidenceText(chapter),
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function chapterToCharacterDriveEvidenceText(chapter: ChapterWithReaderExperience): string {
  const readerExperience = chapter.reader_experience;
  return [
    chapter.context?.current_plot,
    chapter.context?.next_plot,
    chapter.narrative_elements?.character_development,
    chapter.narrative_elements?.emotional_goal,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.character_appeal_moment,
    readerExperience.drop_off_risk,
    chapterToSceneEvidenceText(chapter),
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function chapterToCharacterDriveCarryoverEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  const firstScene = chapter.scenes?.[0];
  return [
    chapter.context?.previous_summary,
    chapter.context?.current_plot,
    chapter.narrative_elements?.character_development,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.character_appeal_moment,
    readerExperience.drop_off_risk,
    firstScene ? sceneToEvidenceText(firstScene) : '',
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function manuscriptToCharacterDriveCarryoverOpeningText(manuscript: string): string {
  return manuscriptToCliffhangerCarryoverOpeningText(manuscript);
}

function chapterToForeshadowingPlantEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  return [
    chapter.context?.current_plot,
    chapter.context?.next_plot,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.page_turner_question,
    readerExperience.character_appeal_moment,
    readerExperience.must_click_ending,
    chapterToSceneEvidenceText(chapter),
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function manuscriptToForeshadowingPlantEvidenceText(manuscript: string): string {
  return manuscript.trim();
}

function chapterToForeshadowingPayoffEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  return [
    readerExperience.chapter_reward,
    readerExperience.must_click_ending,
    chapterToForeshadowingPayoffSceneEvidenceText(chapter),
  ]
    .filter(Boolean)
    .join(' ');
}

function manuscriptToForeshadowingPayoffEvidenceText(manuscript: string): string {
  return manuscript.trim();
}

function chapterToForeshadowingPayoffSceneEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  return (chapter.scenes ?? [])
    .map(scene => [scene.conflict, scene.beat].filter(Boolean).join(' '))
    .filter(Boolean)
    .join(' ');
}

function chapterToAntagonistStrategyEvidenceText(
  chapter: ChapterWithReaderExperience
): string {
  const readerExperience = chapter.reader_experience;
  return [
    chapter.context?.current_plot,
    chapter.context?.next_plot,
    chapter.narrative_elements?.character_development,
    chapter.narrative_elements?.emotional_goal,
    readerExperience.promise_fulfillment,
    readerExperience.chapter_reward,
    readerExperience.page_turner_question,
    readerExperience.drop_off_risk,
    readerExperience.must_click_ending,
    chapterToSceneEvidenceText(chapter),
    chapter.style_guide?.focus,
  ]
    .filter(Boolean)
    .join(' ');
}

function containsAnyExpectedBeatEvidence(
  actual: string,
  expectedItems: string[],
  threshold: number
): boolean {
  return expectedItems.some(expected => containsExpectedBeatEvidence(actual, expected, threshold));
}

function containsArcBeatEvidence(actual: string, expected: string): boolean {
  if (containsExpectedBeatEvidence(actual, expected, 0.3)) {
    return true;
  }

  const clauses = expected
    .split(/[,，.。;；]|(?:지만)|(?:그리고)|(?:하며)|(?:하고)|(?:한다)/u)
    .map(clause => clause.trim())
    .filter(clause => normalizeText(clause).length >= 8);
  if (clauses.length === 0) {
    return false;
  }

  const matchedClauses = clauses.filter(clause =>
    containsExpectedBeatEvidence(actual, clause, 0.35)
  );
  return matchedClauses.length / clauses.length >= 0.5;
}

function splitCadenceSignals(cadence: string): string[] {
  const signals = cadence
    .split(/[,，;；]/u)
    .map(signal => signal.trim())
    .filter(Boolean);

  return signals.length ? signals : [cadence];
}

function containsAnySpecificSignalEvidence(actual: string, expectedSignals: string[]): boolean {
  const normalizedActual = normalizeText(actual);
  return expectedSignals.some(signal => {
    const normalizedSignal = normalizeText(signal);
    return (
      Boolean(normalizedSignal) &&
      (normalizedActual.includes(normalizedSignal) ||
        containsExpectedBeatEvidence(actual, signal, 0.65))
    );
  });
}

function containsExpectedBeatEvidence(actual: string, expected: string, threshold: number): boolean {
  const normalizedActual = normalizeText(actual);
  const normalizedExpected = normalizeText(expected);

  if (!normalizedActual || !normalizedExpected) {
    return false;
  }

  if (
    normalizedActual === normalizedExpected ||
    normalizedActual.includes(normalizedExpected) ||
    normalizedExpected.includes(normalizedActual)
  ) {
    return true;
  }

  const actualGrams = toCharacterBigrams(normalizedActual);
  const expectedGrams = toCharacterBigrams(normalizedExpected);
  if (actualGrams.size === 0 || expectedGrams.size === 0) {
    return false;
  }

  let overlap = 0;
  for (const gram of expectedGrams) {
    if (actualGrams.has(gram)) {
      overlap++;
    }
  }

  return overlap / expectedGrams.size >= threshold;
}

function sceneToEvidenceText(scene: ChapterSceneForEvaluation): string {
  return [
    scene.purpose,
    ...(Array.isArray(scene.characters) ? scene.characters : []),
    scene.location,
    scene.conflict,
    scene.beat,
    scene.emotional_tone,
  ]
    .filter(Boolean)
    .join(' ');
}

function extractDropOffMitigation(dropOffRisk: string): string {
  const parts = dropOffRisk.split(/\s[—–-]\s/u);
  const mitigation = parts.length > 1 ? parts.slice(1).join(' ') : dropOffRisk;
  return mitigation.trim() || dropOffRisk;
}

function evaluateTensionCurveAlignment(
  plot: PlotWithFunSpec,
  chapter: ChapterWithReaderExperience,
  readerExperience: ChapterReaderExperienceForEvaluation,
  issues: EngagementContractIssue[]
): number {
  const peak = plot.tension_curve?.key_peaks?.find(
    item => item.chapter === chapter.chapter_number
  );

  if (!peak) {
    return 100;
  }

  let alignment = 100;
  const peakLevel = typeof peak.tension_level === 'number' ? peak.tension_level : 0;
  const expectedCliffhanger = Math.max(7, Math.min(10, peakLevel - 1));

  if (peakLevel >= 8 && (readerExperience.cliffhanger_strength ?? 0) < expectedCliffhanger) {
    alignment -= 35;
    issues.push({
      code: 'weak-peak-cliffhanger',
      severity: 'major',
      message: 'A declared high-tension peak needs a matching cliffhanger strength.',
      expected: `cliffhanger_strength >= ${expectedCliffhanger}`,
      actual: String(readerExperience.cliffhanger_strength ?? 0),
    });
  }

  const peakEvent = peak.event?.trim();
  if (peakEvent && !containsMeaningfulOverlap(chapterToSceneEvidenceText(chapter), peakEvent, 0.35)) {
    alignment -= 60;
    issues.push({
      code: 'tension-peak-not-staged',
      severity: 'critical',
      message: 'The declared tension-curve peak event is not staged by chapter scene evidence.',
      expected: peakEvent,
      actual: chapterToSceneEvidenceText(chapter),
    });
  }

  return Math.max(0, alignment);
}

function chapterToSceneEvidenceText(chapter: ChapterWithReaderExperience): string {
  return (chapter.scenes ?? []).map(scene => sceneToEvidenceText(scene)).join(' ');
}

function chapterToFinalSceneEvidenceText(chapter: ChapterWithReaderExperience): string {
  const finalScene = chapter.scenes?.[chapter.scenes.length - 1];
  return finalScene ? sceneToEvidenceText(finalScene) : '';
}

function ratio(
  scenes: ChapterSceneForEvaluation[],
  predicate: (scene: ChapterSceneForEvaluation) => boolean
): number {
  if (scenes.length === 0) return 0;
  return scenes.filter(predicate).length / scenes.length;
}

function hasMeaningfulConflict(value: string | undefined): boolean {
  const text = normalizeText(value ?? '');
  if (text.length < 8) return false;
  if (/(갈등은 없다|특별한 갈등|문제 없음|평온|무난|차분히)/u.test(text)) {
    return false;
  }

  const pressureSignals = countMatches(
    text,
    /(선택해야|해야|하지만|그러나|위험|감수|압박|제한|시간|피해자|찾|조명|꺼진|통제선|닫히|막히|잠긴|충돌|반대|추적|쫓|위협|협박|공격|대가|비용|손실|실패|증거|공개|숨길|조력자|경찰|현장|마감|기한|줄어|빼앗|붙잡|가로막)/gu
  );
  const vagueFeelingSignals = countMatches(
    text,
    /(내적\s*갈등|갈등을\s*느끼|불안|고민|긴장|혼란|망설|감정이\s*흔들)/gu
  );

  return pressureSignals >= 1 && !(vagueFeelingSignals > 0 && pressureSignals <= 1);
}

function hasMeaningfulSceneTurn(value: string | undefined): boolean {
  const text = normalizeText(value ?? '');
  if (text.length < 8) return false;
  if (/(쉬기로 한다|돌아간다|정리한다|생각한다|기다린다)$/u.test(text)) {
    return false;
  }

  const staticFramingSignals = countMatches(
    text,
    /(처럼\s*보이는\s*자료|라는\s*(?:내용|가능성|자료|보고)|다는\s*(?:내용|가능성|자료|보고)|계획을\s*세워\s*둔다|비교해\s*둔다|대조해\s*둔다|메모해\s*둔다|적어\s*둔다|기록해\s*둔다|검토해\s*둔다|확인해\s*둔다|살펴\s*본다|떠올린다)/gu
  );
  if (staticFramingSignals >= 2) {
    return false;
  }

  const turnSignals = countMatches(
    text,
    /(선택|감수|뛰쳐나간|달려|울렸|울린|뜬|뜨며|깜박|꺼졌|꺼진|닫혔|닫히|잠긴|잠겼|막혔|막히|붙잡|빼앗|공개|폭로|밝혀|드러났|발견|일치|좁혀|연결된다|맞아떨어|실패|바뀌|무너|잃|쓰러|사라|도착|탈출|공격|구하|되돌릴\s*수\s*없|대가|손실|위협|표적|카운트다운)/gu
  );
  const outcomeSignals = countMatches(
    text,
    /(때문에|결과|결국|그\s*순간|직후|대가|손실|실패|바뀌|무너|잃|쓰러|사라|드러났|밝혀|폭로|공개|발견|일치|좁혀|연결된다|맞아떨어|되돌릴\s*수\s*없|다음\s*수신자|다음\s*표적|미제\s*사건\s*번호|현장\s*실패|카운트다운)/gu
  );

  return turnSignals >= 2 && outcomeSignals >= 1;
}

interface SceneEvidenceSpecificityAssessment {
  passed: boolean;
  actual: string;
}

interface SceneChoiceTradeoffAssessment {
  passed: boolean;
  actual: string;
}

interface SceneChoiceCostLockAssessment {
  passed: boolean;
  actual: string;
}

interface SceneActiveOppositionAssessment {
  passed: boolean;
  actual: string;
}

interface SceneGoalTacticTurnAssessment {
  passed: boolean;
  actual: string;
}

interface SceneStateDeltaAssessment {
  passed: boolean;
  actual: string;
}

interface SceneCausalEscalationAssessment {
  passed: boolean;
  actual: string;
}

const SCENE_ABSTRACT_META_SIGNAL_PATTERN =
  /(설명한다|설명된다|정리한다|정리된다|제시한다|제시된다|보여준다|처리된다|드러난다|이어진다|장면\s*갈등|독자\s*몰입|흥미로운|반전|큰\s*비밀|위기다|라는|다는|방식|분위기|감정\s*목표)/gu;
const SCENE_OBJECT_EVIDENCE_SIGNAL_PATTERN =
  /(알림|휴대폰|현장|피해자|기록|로그|번호|파일|로고|문|복도|조명|통제선|손|눈|피|시신|이름|주소|단서|증거|장부|메시지|상처|시계|반지|열쇠|문신|지도|총|검|약|독|계약|서명|좌표|화면|소리|냄새|버튼|엘리베이터|경찰|시간|제한)/gu;
const SCENE_ACTION_OUTCOME_SIGNAL_PATTERN =
  /(선택|감수|계산|뛰쳐나간|달려|찾|확인|열|닫|꺼졌|울렸|깜박|쥐|내밀|붙잡|막히|닫히|줄어|실패|바뀌|무너|잃|쓰러|사라|밝혀|폭로|드러났|연결|고발|훔치|숨기|공개|추적|도착|탈출|공격|막아|구하|구하려|맞아떨어)/gu;
const SCENE_CHOICE_PAIR_PATTERN =
  /(?:넘길지|갈지|숨길지|공개할지|신고할지|구할지|버릴지|포기할지|맡길지|따를지|거절할지|받아들일지|추적할지|멈출지)[^.!?。！？\n]{0,80}(?:넘길지|갈지|숨길지|공개할지|신고할지|구할지|버릴지|포기할지|맡길지|따를지|거절할지|받아들일지|추적할지|멈출지|택해야|선택해야|갈등)/u;
const SCENE_COMPETING_OPTION_PATTERN =
  /(둘\s*중|둘\s*사이|사이에서|양자택일|경쟁\s*선택지|선택지|대안|갈등한다|선택해야)/u;
const SCENE_SACRIFICE_OR_COST_PATTERN =
  /(대신|포기|버리|내주|잃더라도|희생|위험(?:을)?\s*감수|대가|비용|손실|불리|약점|공개|숨기|신고보다|경찰\s*신고보다|늦|놓치|발각|노출|의심|통제선|제한\s*시간)/u;
const SCENE_TRADEOFF_ACTION_PATTERN =
  /(선택|결정|결심|택하|갈지|넘길지|공개|숨기|추적|구하|달려|뛰쳐|감수|계산|신고|막아|붙잡)/u;
const SCENE_CAUSAL_CONNECTOR_PATTERN =
  /(때문에|그래서|그\s*결과|결국|직후|이후|이어|그러자|하자|되자|자마자|탓에|바람에|끝에|대가로|여파로|남은|남긴|불러|만들)/u;
const SCENE_CAUSAL_PRESSURE_SIGNAL_PATTERN =
  /(제한\s*시간|카운트다운|조명|불이|꺼졌|통제선|잠겼|막혔|피해자|사망|현장|예고|알림|위험|위협|대상|표적|압박|마감|기한|손실|대가|실패)/gu;
const SCENE_CAUSAL_ACTION_SIGNAL_PATTERN =
  /(선택|결정|계산|뛰쳐|달려|찾으려|확인하려|감수|신고|향했|도착|움켜|쥐었|쥔|눌렀|열었|돌아|공개|추적|구하|구하려|해석|대조|분석|옮겨|막아)/gu;
const SCENE_CAUSAL_CONSEQUENCE_SIGNAL_PATTERN =
  /(실패|늦은|늦었|쓰러졌|사망|죽었|피해자|대가|손실|되돌릴\s*수\s*없|돌이킬\s*수\s*없|바꿨|바꾸|굳어졌|드러났|밝혀|연결|발견|맞아떨어|좁혀|새\s*(?:알림|예고|위협|사건)|다음\s*(?:수신자|표적|대상))/gu;
const SCENE_CAUSAL_ANCHOR_PATTERN =
  /(알림|예고|휴대폰|피해자|현장|기록|로그|번호|파일|로고|조명|통제선|수신자|표적|이름|미제|사건|카운트다운|문|좌표|앱|규칙|단서|화면)/gu;
const SCENE_GOAL_SIGNAL_PATTERN =
  /(구하려|찾으려|막으려|확인하려|증명하려|되찾|보호|살리|구하|찾|확인|추적|도착|탈출|공개|숨기|신고|막아|해석|계산|알아내|따라잡|붙잡|구출|설득|협상|탈환|회수)/gu;
const SCENE_BLOCKING_FORCE_PATTERN =
  /(하지만|그러나|누군가|범인|가해자|적대|내부자|시스템|앱|조작|방해|막|가로막|차단|잠기|잠겼|닫히|꺼뜨|꺼졌|숨긴|빼앗|협박|위협|추적|제한\s*시간|카운트다운|통제선|의심|거절|조건|함정|덫)/gu;
const SCENE_TACTIC_SIGNAL_PATTERN =
  /(계산|우회|대신|다시|접고|바꾸|전환|포기|뛰쳐|달려|눌렀|움켜|대조|해석|신고|공개|숨기|추적|설득|협상|요청|잠입|열었|돌파|비상계단|경찰\s*신고보다|신고보다|현장\s*도착|새\s*단서.*활용|단서.*활용)/gu;
const SCENE_GOAL_RESULT_SIGNAL_PATTERN =
  /(그\s*결과|결국|직후|이제|더는|닫히|잠기|차단|확정|굳어|드러|밝혀|발견|일치|좁혀|연결|실패|대가|손실|되돌릴\s*수\s*없|돌이킬\s*수\s*없|새\s*(?:알림|예고|단서|위협|증거|사건)|다음\s*(?:행동|검증|수신자|표적|대상)|계획을\s*바꾸|행동을\s*바꾸|추적\s*방식.*바꾼|우회)/gu;
const SCENE_STATE_DELTA_BEFORE_PATTERN =
  /(아직|모른|알\s*수\s*없|장난으로\s*넘길지|선택해야|둘\s*중|사이에서|제한\s*시간|카운트다운|위험|위협|의심|불신|닫히려|막히려|숨겨|숨긴|잃을|대가|손실|실패\s*전|현장\s*실패\s*직후|수신자로?\s*지목|표적|첫\s*알림)/gu;
const SCENE_STATE_DELTA_AFTER_PATTERN =
  /(그\s*결과|결국|직후|이후|그러자|하자|이제|더는|선택지가\s*닫히|공식\s*신고\s*기록이\s*사라|돌아갈\s*수\s*없|되돌릴\s*수\s*없|돌이킬\s*수\s*없|닫히고|닫힌다|잠기|막히|차단|확정|굳어|새\s*(?:알림|예고|단서|위협|증거|사건)|다음\s*(?:수신자|표적|대상|행동|검증)|가설이\s*좁혀|용의자.*(?:제외|승격)|관계가.*(?:신뢰|불신|거리|동행)|신뢰로|불신으로|규칙이\s*(?:증명|바뀌|드러)|정체가\s*드러|비밀이\s*밝혀|위험이\s*(?:커지|증가|이동)|계획을\s*바꾸|행동을\s*바꾸|우회|추적\s*방식.*바꾼)/gu;
const SCENE_STATE_DELTA_ABSTRACT_ONLY_PATTERN =
  /(분위기가\s*바뀌|감정이\s*변하|긴장감이\s*높아|상황이\s*변하|전환된다|달라진다|새로운\s*국면|흥미가\s*생긴다|몰입이\s*커진다)/gu;

const SCENE_STATE_DELTA_DIMENSION_PATTERNS: Array<{
  label: string;
  pattern: RegExp;
}> = [
  {
    label: 'knowledge',
    pattern:
      /(새\s*(?:단서|증거|알림|예고)|드러|밝혀|폭로|확정|굳어|가설|용의자|정체|비밀|파일|번호|로그|기록|연결되자|맞물리자)/u,
  },
  {
    label: 'danger',
    pattern:
      /(다음\s*(?:수신자|표적|대상)|카운트다운|제한\s*시간|위험이\s*(?:커지|증가)|위협|사망|죽었|피해자|조명.*꺼|문.*잠|통제선|표적)/u,
  },
  {
    label: 'option-lock',
    pattern:
      /(선택지가\s*닫히|더는.*돌아갈\s*수\s*없|되돌릴\s*수\s*없|돌이킬\s*수\s*없|사라져|차단|막히|닫히|잃|포기|대가|손실|공식\s*신고\s*기록)/u,
  },
  {
    label: 'relationship',
    pattern:
      /(관계가|신뢰|불신|동행|거리|배신|의심|약점\s*공개|사과|거절|받아들)/u,
  },
  {
    label: 'rule',
    pattern:
      /(규칙이\s*(?:증명|드러|바뀌)|첫\s*규칙\s*증명|패턴이\s*(?:드러|바뀌)|앱.*규칙|예고.*실제\s*사건)/u,
  },
  {
    label: 'next-action',
    pattern:
      /(다음\s*(?:행동|검증|수신자|표적)|계획을\s*바꾸|행동을\s*바꾸|추적\s*방식.*바꾼|우회|뛰쳐|달려|움켜쥔.*눌렀|다시\s*눌렀)/u,
  },
];

function assessSceneEvidenceSpecificity(
  scenes: ChapterSceneForEvaluation[]
): SceneEvidenceSpecificityAssessment {
  const genericScenes = scenes
    .map(scene => {
      const rawText = sceneToEvidenceText(scene);
      const text = normalizeText(rawText);
      const metaSignals = countMatches(text, SCENE_ABSTRACT_META_SIGNAL_PATTERN);
      const objectSignals = countMatches(text, SCENE_OBJECT_EVIDENCE_SIGNAL_PATTERN);
      const actionSignals = countMatches(text, SCENE_ACTION_OUTCOME_SIGNAL_PATTERN);
      const claimFraming =
        /(?:라는|다는)\s*(?:장면|위기|주인공|회차|이유|방식|갈등|매력)/u.test(rawText);
      const abstractMetadata =
        metaSignals >= 4 && (claimFraming || objectSignals < 4 || actionSignals < 2);

      return abstractMetadata
        ? {
            sceneNumber: scene.scene_number,
            metaSignals,
            objectSignals,
            actionSignals,
          }
        : undefined;
    })
    .filter(
      (
        scene
      ): scene is {
        sceneNumber: number;
        metaSignals: number;
        objectSignals: number;
        actionSignals: number;
      } => scene !== undefined
    );

  const executableRatio = scenes.length === 0
    ? 0
    : (scenes.length - genericScenes.length) / scenes.length;

  return {
    passed: executableRatio >= 0.75,
    actual:
      genericScenes.length === 0
        ? `generic scenes=none; executable ratio=${Math.round(executableRatio * 100)}%`
        : `generic scenes=${genericScenes
            .map(
              scene =>
                `scene ${scene.sceneNumber} (meta=${scene.metaSignals}, object=${scene.objectSignals}, action=${scene.actionSignals})`
            )
            .join(', ')}; executable ratio=${Math.round(executableRatio * 100)}%`,
  };
}

function assessSceneChoiceTradeoffs(
  scenes: ChapterSceneForEvaluation[]
): SceneChoiceTradeoffAssessment {
  if (scenes.length === 0) {
    return {
      passed: false,
      actual: 'scene choice-cost tradeoff: no scenes',
    };
  }

  const sceneAssessments = scenes.map(scene => {
    const text = normalizeText([scene.conflict, scene.beat].filter(Boolean).join(' '));
    const hasChoicePair =
      SCENE_CHOICE_PAIR_PATTERN.test(text) || SCENE_COMPETING_OPTION_PATTERN.test(text);
    const hasCost = SCENE_SACRIFICE_OR_COST_PATTERN.test(text);
    const hasAction = SCENE_TRADEOFF_ACTION_PATTERN.test(text);

    return {
      sceneNumber: scene.scene_number,
      passed: hasChoicePair && hasCost && hasAction,
      hasChoicePair,
      hasCost,
      hasAction,
    };
  });

  const passedScenes = sceneAssessments.filter(scene => scene.passed);
  const requiredScenes = Math.max(1, Math.ceil(scenes.length * 0.5));

  return {
    passed: passedScenes.length >= requiredScenes,
    actual:
      `scene choice-cost tradeoff scenes=${passedScenes.length}/${scenes.length}, ` +
      `required=${requiredScenes}; ` +
      sceneAssessments
        .map(
          scene =>
            `scene ${scene.sceneNumber} choice=${scene.hasChoicePair} cost=${scene.hasCost} action=${scene.hasAction}`
        )
        .join(', '),
  };
}

function assessSceneChoiceCostLock(
  scenes: ChapterSceneForEvaluation[]
): SceneChoiceCostLockAssessment {
  if (scenes.length === 0) {
    return {
      passed: false,
      actual: 'scene choice-cost lock: no scenes',
    };
  }

  const assessments = scenes.map((scene, index) => {
    const choiceText = normalizeText([scene.conflict, scene.beat].filter(Boolean).join(' '));
    const hasChoice =
      SCENE_CHOICE_PAIR_PATTERN.test(choiceText) ||
      SCENE_COMPETING_OPTION_PATTERN.test(choiceText);
    const hasCost = SCENE_SACRIFICE_OR_COST_PATTERN.test(choiceText);
    const hasAction = SCENE_TRADEOFF_ACTION_PATTERN.test(choiceText);
    const lockWindow = normalizeText(
      [
        sceneToEvidenceText(scene),
        scenes[index + 1] ? sceneToEvidenceText(scenes[index + 1]) : '',
      ]
        .filter(Boolean)
        .join(' ')
    );
    const sharedAnchors = countSharedChoiceCostAnchors(choiceText, lockWindow);
    const lockSignals = countChoiceCostLockSignals(lockWindow);
    const negatedLock = CHOICE_COST_LOCK_NEGATION_PATTERN.test(lockWindow);

    return {
      sceneNumber: scene.scene_number,
      passed:
        hasChoice &&
        hasCost &&
        hasAction &&
        sharedAnchors > 0 &&
        lockSignals > 0 &&
        !negatedLock,
      hasChoice,
      hasCost,
      hasAction,
      sharedAnchors,
      lockSignals,
      negatedLock,
    };
  });

  const lockedScenes = assessments.filter(scene => scene.passed);

  return {
    passed: lockedScenes.length >= 1,
    actual:
      `scene choice-cost lock scenes=${lockedScenes.length}/${scenes.length}; ` +
      assessments
        .map(
          scene =>
            `scene ${scene.sceneNumber} choice=${scene.hasChoice} cost=${scene.hasCost} ` +
            `action=${scene.hasAction} sharedAnchors=${scene.sharedAnchors} ` +
            `lockSignals=${scene.lockSignals} negated=${scene.negatedLock}`
        )
        .join(', '),
  };
}

function assessSceneActiveOppositionStaging(
  scenes: ChapterSceneForEvaluation[]
): SceneActiveOppositionAssessment {
  if (scenes.length === 0) {
    return {
      passed: false,
      actual: 'pressured scenes=0, active opposition scenes=0',
    };
  }

  let pressuredScenes = 0;
  let activeOppositionScenes = 0;
  let actorScenes = 0;
  let intentScenes = 0;
  let pressureScenes = 0;

  for (const scene of scenes) {
    const text = [scene.conflict, scene.beat].filter(Boolean).join(' ');
    if (!text.trim()) {
      continue;
    }

    const hasPressure =
      ACTIVE_OPPOSITION_PRESSURE_PATTERN.test(text) || hasMeaningfulConflict(text);
    if (!hasPressure) {
      continue;
    }

    pressuredScenes += 1;

    const hasActor = ACTIVE_OPPOSITION_ACTOR_PATTERN.test(text);
    const hasIntent = ACTIVE_OPPOSITION_INTENT_PATTERN.test(text);
    const hasPressureContext = ACTIVE_OPPOSITION_PRESSURE_PATTERN.test(text);

    if (hasActor) actorScenes += 1;
    if (hasIntent) intentScenes += 1;
    if (hasPressureContext) pressureScenes += 1;
    if (hasActor && hasIntent && hasPressureContext) {
      activeOppositionScenes += 1;
    }
  }

  const requiredActiveScenes = Math.max(1, Math.ceil(pressuredScenes * 0.5));

  return {
    passed:
      pressuredScenes === 0 || activeOppositionScenes >= requiredActiveScenes,
    actual:
      `pressured scenes=${pressuredScenes}; active opposition scenes=${activeOppositionScenes}/${requiredActiveScenes}; ` +
      `actor scenes=${actorScenes}; intent/action scenes=${intentScenes}; pressure-context scenes=${pressureScenes}`,
  };
}

function assessSceneGoalTacticTurn(
  scenes: ChapterSceneForEvaluation[]
): SceneGoalTacticTurnAssessment {
  if (scenes.length === 0) {
    return {
      passed: false,
      actual: 'scene goal-tactic turns=0',
    };
  }

  const assessments = scenes.map(scene => {
    const text = normalizeText([scene.conflict, scene.beat].filter(Boolean).join(' '));
    const goalSignals = countMatches(text, SCENE_GOAL_SIGNAL_PATTERN);
    const blockingSignals = countMatches(text, SCENE_BLOCKING_FORCE_PATTERN);
    const tacticSignals = countMatches(text, SCENE_TACTIC_SIGNAL_PATTERN);
    const resultSignals = countMatches(text, SCENE_GOAL_RESULT_SIGNAL_PATTERN);
    const hasChoiceTactic =
      SCENE_TRADEOFF_ACTION_PATTERN.test(text) ||
      SCENE_CHOICE_PAIR_PATTERN.test(text) ||
      SCENE_COMPETING_OPTION_PATTERN.test(text);

    return {
      sceneNumber: scene.scene_number,
      passed:
        goalSignals >= 1 &&
        blockingSignals >= 1 &&
        (tacticSignals >= 1 || hasChoiceTactic) &&
        resultSignals >= 1,
      goalSignals,
      blockingSignals,
      tacticSignals,
      hasChoiceTactic,
      resultSignals,
    };
  });

  const passedScenes = assessments.filter(scene => scene.passed);
  const requiredScenes = Math.max(1, Math.ceil(scenes.length * 0.5));

  return {
    passed: passedScenes.length >= requiredScenes,
    actual:
      `scene goal-tactic turns=${passedScenes.length}/${scenes.length}, ` +
      `required=${requiredScenes}; ` +
      assessments
        .map(
          scene =>
            `scene ${scene.sceneNumber} goal=${scene.goalSignals} block=${scene.blockingSignals} ` +
            `tactic=${scene.tacticSignals} choiceTactic=${scene.hasChoiceTactic} result=${scene.resultSignals}`
        )
        .join(', '),
  };
}

function assessSceneStateDeltaStaging(
  scenes: ChapterSceneForEvaluation[]
): SceneStateDeltaAssessment {
  if (scenes.length === 0) {
    return {
      passed: false,
      actual: 'scene state delta scenes=0',
    };
  }

  const assessments = scenes.map(scene => {
    const conflictText = normalizeText(scene.conflict ?? '');
    const beatText = normalizeText(scene.beat ?? '');
    const text = normalizeText([scene.conflict, scene.beat].filter(Boolean).join(' '));
    const beforeSignals =
      countMatches(conflictText, SCENE_STATE_DELTA_BEFORE_PATTERN) +
      (hasMeaningfulConflict(scene.conflict) ? 1 : 0);
    const afterSignals = countMatches(beatText, SCENE_STATE_DELTA_AFTER_PATTERN);
    const objectSignals = countMatches(text, SCENE_OBJECT_EVIDENCE_SIGNAL_PATTERN);
    const actionSignals = countMatches(text, SCENE_ACTION_OUTCOME_SIGNAL_PATTERN);
    const dimensions = SCENE_STATE_DELTA_DIMENSION_PATTERNS.filter(dimension =>
      dimension.pattern.test(text)
    ).map(dimension => dimension.label);
    const abstractOnly =
      countMatches(text, SCENE_STATE_DELTA_ABSTRACT_ONLY_PATTERN) > 0 &&
      afterSignals <= 1 &&
      dimensions.length === 0;

    return {
      sceneNumber: scene.scene_number,
      passed:
        beforeSignals >= 1 &&
        afterSignals >= 1 &&
        dimensions.length >= 1 &&
        (objectSignals >= 2 || actionSignals >= 2) &&
        !abstractOnly,
      beforeSignals,
      afterSignals,
      dimensions,
      objectSignals,
      actionSignals,
      abstractOnly,
    };
  });

  const passedScenes = assessments.filter(scene => scene.passed);
  const requiredScenes = Math.max(1, Math.ceil(scenes.length * 0.75));

  return {
    passed: passedScenes.length >= requiredScenes,
    actual:
      `scene state delta scenes=${passedScenes.length}/${scenes.length}, ` +
      `required=${requiredScenes}; ` +
      assessments
        .map(
          scene =>
            `scene ${scene.sceneNumber} before=${scene.beforeSignals} ` +
            `after=${scene.afterSignals} dimensions=${scene.dimensions.join('+') || 'none'} ` +
            `object=${scene.objectSignals} action=${scene.actionSignals} ` +
            `abstractOnly=${scene.abstractOnly}`
        )
        .join(', '),
  };
}

function assessSceneCausalEscalation(
  scenes: ChapterSceneForEvaluation[]
): SceneCausalEscalationAssessment {
  if (scenes.length < 2) {
    return {
      passed: true,
      actual: `scene causal escalation skipped: scenes=${scenes.length}`,
    };
  }

  const requiredLinks = Math.max(1, Math.ceil((scenes.length - 1) * 0.75));
  const linkedPairs: string[] = [];
  const failedPairs: string[] = [];

  for (let index = 1; index < scenes.length; index++) {
    const previousText = sceneToEvidenceText(scenes[index - 1]);
    const nextText = sceneToEvidenceText(scenes[index]);
    const nextHasConnector = SCENE_CAUSAL_CONNECTOR_PATTERN.test(nextText);
    const previousConsequences = countMatches(
      previousText,
      SCENE_CAUSAL_CONSEQUENCE_SIGNAL_PATTERN
    );
    const nextPressureSignals = countMatches(nextText, SCENE_CAUSAL_PRESSURE_SIGNAL_PATTERN);
    const nextActionSignals = countMatches(nextText, SCENE_CAUSAL_ACTION_SIGNAL_PATTERN);
    const nextConsequenceSignals = countMatches(
      nextText,
      SCENE_CAUSAL_CONSEQUENCE_SIGNAL_PATTERN
    );
    const sharedAnchors = countSharedSceneCausalAnchors(previousText, nextText);
    const nextEscalationSignals =
      nextPressureSignals + nextActionSignals + nextConsequenceSignals;
    const pairPassed =
      nextHasConnector &&
      previousConsequences >= 1 &&
      sharedAnchors >= 1 &&
      nextEscalationSignals >= 2;

    const detail =
      `${index - 1}->${index}: connector=${nextHasConnector}, ` +
      `prev consequences=${previousConsequences}, shared anchors=${sharedAnchors}, ` +
      `next escalation signals=${nextEscalationSignals}`;
    if (pairPassed) {
      linkedPairs.push(detail);
    } else {
      failedPairs.push(detail);
    }
  }

  return {
    passed: linkedPairs.length >= requiredLinks,
    actual:
      `causal scene links=${linkedPairs.length}/${scenes.length - 1}, required=${requiredLinks}; ` +
      `linked=[${linkedPairs.join('; ') || 'none'}]; failed=[${failedPairs.join('; ') || 'none'}]`,
  };
}

function countSharedSceneCausalAnchors(previousText: string, nextText: string): number {
  const previousAnchors = extractSceneCausalAnchors(previousText);
  const nextAnchors = extractSceneCausalAnchors(nextText);
  let shared = 0;
  for (const anchor of previousAnchors) {
    if (nextAnchors.has(anchor)) {
      shared++;
    }
  }
  return shared;
}

function extractSceneCausalAnchors(text: string): Set<string> {
  return new Set(normalizeText(text).match(SCENE_CAUSAL_ANCHOR_PATTERN) ?? []);
}

interface FunSpecSpecificityAssessment {
  passed: boolean;
  actual: string;
}

interface PageTurnQuestionOpennessAssessment {
  passed: boolean;
  actual: string;
}

interface PageTurnQuestionStagingAssessment {
  passed: boolean;
  actual: string;
}

const FUN_SPEC_SPECIFICITY_FIELDS: Array<{
  label: keyof FunSpec;
  value: (funSpec: FunSpec) => string;
}> = [
  { label: 'reader_reward', value: funSpec => funSpec.reader_reward },
  { label: 'page_turn_question', value: funSpec => funSpec.page_turn_question },
  { label: 'character_appeal_moment', value: funSpec => funSpec.character_appeal_moment },
  { label: 'drop_off_risk', value: funSpec => funSpec.drop_off_risk },
  { label: 'must_click_ending', value: funSpec => funSpec.must_click_ending },
];

const FUN_SPEC_CONCRETE_SIGNAL_PATTERN =
  /(앱|알림|예고|예보|휴대폰|현장|피해자|주인공|조력자|경찰|기록|로그|번호|파일|로고|이름|주소|단서|증거|장부|메시지|상처|시계|반지|열쇠|문신|지도|계약|서명|좌표|화면|카운트다운|시간|수신자|표적|가족|실종|사건|살인|패턴|규칙|계산|선택|감수|공개|발견|일치|좁혀|연결|드러|밝혀|폭로|실패|바뀌|위협|대가|손실|구하|뛰쳐나간|도착|통제선|조명|미제)/gu;
const FUN_SPEC_GENERIC_SIGNAL_PATTERN =
  /(흥미로운|흥미롭|재미|강렬한|강한|큰\s*반전|반전|몰입|긴장감|감정|보상|매력|위기|갈등|후킹|클리프행어|페이지터너|다음\s*화|궁금|질문|독자|지루하지|전개|분위기|재미를\s*준다|보여준다|설명한다|제시한다|유도한다|사건과\s*반전)/gu;

const PAGE_TURN_OPEN_SIGNAL_PATTERN =
  /(왜|어떻게|누가|무엇|뭐|어디|언제|어떤|정체|비밀|진짜|다음|알\s*수\s*없|모르|수신자|표적|배후|흔적|단서|미제|실종|[?？])/gu;
const PAGE_TURN_CLOSURE_SIGNAL_PATTERN =
  /(설명(?:된다|됐다|한다|했다|해진다)|밝혀(?:진다|졌다|낸다|냈다)|드러(?:난다|났다|낸다|냈다)|해결(?:된다|됐다|한다|했다)|확인(?:된다|됐다|한다|했다)|정리(?:된다|됐다)|종결(?:된다|됐다)|해명(?:된다|됐다)|완료(?:된다|됐다)|끝난다|결론|답은|이유는|정체는|범인은|때문(?:이다|으로)|알게\s*된다|알려진다)/gu;
const PAGE_TURN_STAGING_SIGNAL_PATTERN =
  /(앱|알림|예고|휴대폰|현장|피해자|주인공|개발자|기록|로그|번호|파일|로고|이름|주소|단서|증거|장부|메시지|상처|시계|반지|열쇠|지갑|서고|문신|지도|계약|서명|좌표|화면|카운트다운|수신자|표적|가족|실종|사건|살인|패턴|규칙|연결|일치|미제|붉은|사진|봉투|문서|녹음|배지|목소리|장소|기한|시간)/gu;
const PAGE_TURN_FINAL_TRIGGER_PATTERN =
  /(새\s*(?:알림|예고|메시지)|다음\s*(?:수신자|표적|대상)|드러|밝혀|폭로|발견|연결|일치|깜박|뜨|로고|번호|기록|파일|열쇠|지갑|좌표|카운트다운|피해자|실종|위협)/gu;
const PAGE_TURN_BROAD_SIGNAL_SET = new Set([
  '앱',
  '사건',
  '현장',
  '피해자',
  '주인공',
  '단서',
  '증거',
  '기록',
  '연결',
]);
const PAGE_TURN_NAME_LIKE_ANCHOR_PATTERN =
  /[가-힣]{2,4}(?=(?:은|는|이|가|에게|의|을|를))/gu;

function assessFunSpecSpecificity(funSpec: FunSpec): FunSpecSpecificityAssessment {
  const genericFields: string[] = [];
  const fieldSummaries: string[] = [];

  for (const field of FUN_SPEC_SPECIFICITY_FIELDS) {
    const rawValue = field.value(funSpec)?.trim() ?? '';
    const text = normalizeText(rawValue);
    const concreteSignals = countMatches(text, FUN_SPEC_CONCRETE_SIGNAL_PATTERN);
    const genericSignals = countMatches(text, FUN_SPEC_GENERIC_SIGNAL_PATTERN);
    const tooThin = text.length < 10 || concreteSignals < 2;
    const genericDominates = genericSignals >= 2 && concreteSignals < 3;

    fieldSummaries.push(`${field.label}: concrete=${concreteSignals}, generic=${genericSignals}`);

    if (tooThin || genericDominates) {
      genericFields.push(field.label);
    }
  }

  return {
    passed: genericFields.length === 0,
    actual: `generic fields=${genericFields.join(', ') || 'none'}; ${fieldSummaries.join('; ')}`,
  };
}

function assessPageTurnQuestionOpenness(
  pageTurnQuestion: string,
  pageTurnerQuestion: string
): PageTurnQuestionOpennessAssessment {
  const assessments = [
    assessSinglePageTurnQuestion('page_turn_question', pageTurnQuestion),
    assessSinglePageTurnQuestion('page_turner_question', pageTurnerQuestion),
  ];
  const failed = assessments.filter(item => !item.passed);

  return {
    passed: failed.length === 0,
    actual: assessments.map(item => item.actual).join('; '),
  };
}

function assessPageTurnQuestionSpecificity(
  pageTurnQuestion: string,
  pageTurnerQuestion: string
): PageTurnQuestionOpennessAssessment {
  const assessments = [
    assessSinglePageTurnQuestionSpecificity('page_turn_question', pageTurnQuestion),
    assessSinglePageTurnQuestionSpecificity('page_turner_question', pageTurnerQuestion),
  ];
  const failed = assessments.filter(item => !item.passed);

  return {
    passed: failed.length === 0,
    actual: assessments.map(item => item.actual).join('; '),
  };
}

function assessSinglePageTurnQuestion(label: string, rawValue: string): PageTurnQuestionOpennessAssessment {
  const text = rawValue?.trim() ?? '';
  const openSignals = countMatches(text, PAGE_TURN_OPEN_SIGNAL_PATTERN);
  const closureSignals = countMatches(text, PAGE_TURN_CLOSURE_SIGNAL_PATTERN);
  const hasQuestionMark = /[?？]/u.test(text);
  const closesAnswer = text.length >= 10 && closureSignals > 0 && (!hasQuestionMark || closureSignals >= 2);
  const passed = !closesAnswer;

  return {
    passed,
    actual: `${label}: open=${openSignals}, closure=${closureSignals}, question_mark=${hasQuestionMark}, closed_answer=${closesAnswer}`,
  };
}

function assessSinglePageTurnQuestionSpecificity(
  label: string,
  rawValue: string
): PageTurnQuestionOpennessAssessment {
  const text = rawValue?.trim() ?? '';
  if (!text) {
    return {
      passed: true,
      actual: `${label}: empty`,
    };
  }

  const openSignals = countMatches(text, PAGE_TURN_OPEN_SIGNAL_PATTERN);
  const closureSignals = countMatches(text, PAGE_TURN_CLOSURE_SIGNAL_PATTERN);
  const hasQuestionIntent = openSignals > 0 || /[?？]/u.test(text);
  const signals = extractUniquePageTurnQuestionSignals(text);
  const nameLikeAnchors = extractPageTurnNameLikeAnchors(text);
  const allAnchors = [...new Set([...signals, ...nameLikeAnchors])];
  const broadAnchors = allAnchors.filter(signal => PAGE_TURN_BROAD_SIGNAL_SET.has(signal));
  const specificAnchors = allAnchors.filter(signal => !PAGE_TURN_BROAD_SIGNAL_SET.has(signal));
  const tooBroad =
    text.length >= 10 && hasQuestionIntent && closureSignals === 0 && specificAnchors.length < 2;

  return {
    passed: !tooBroad,
    actual: `${label}: anchors=${allAnchors.length} [${allAnchors.join(', ') || 'none'}], specific=${specificAnchors.length} [${specificAnchors.join(', ') || 'none'}], broad=${broadAnchors.length} [${broadAnchors.join(', ') || 'none'}], too_broad=${tooBroad}`,
  };
}

function assessPageTurnQuestionStaging(
  finalSceneText: string,
  pageTurnerQuestion: string
): PageTurnQuestionStagingAssessment {
  const question = pageTurnerQuestion?.trim() ?? '';
  if (!question) {
    return {
      passed: true,
      actual: 'page_turner_question=empty',
    };
  }

  const directOverlap = containsExpectedBeatEvidence(finalSceneText, question, 0.28);
  const questionSignals = extractPageTurnQuestionSignals(question);
  const matchedSignals = questionSignals.filter(signal =>
    normalizeText(finalSceneText).includes(normalizeText(signal))
  );
  const triggerSignals = countMatches(finalSceneText, PAGE_TURN_FINAL_TRIGGER_PATTERN);
  const requiredSignals = Math.min(2, questionSignals.length);
  const signalMatch =
    requiredSignals > 0 && matchedSignals.length >= requiredSignals && triggerSignals >= 1;

  return {
    passed: directOverlap || signalMatch,
    actual: `direct_overlap=${directOverlap}, matched_question_signals=${matchedSignals.length}/${questionSignals.length} [${matchedSignals.join(', ') || 'none'}], final_trigger_signals=${triggerSignals}`,
  };
}

function extractPageTurnQuestionSignals(question: string): string[] {
  const uniqueSignals = extractUniquePageTurnQuestionSignals(question);
  const specificSignals = uniqueSignals.filter(signal => !PAGE_TURN_BROAD_SIGNAL_SET.has(signal));

  return specificSignals.length >= 2 ? specificSignals : uniqueSignals;
}

function extractUniquePageTurnQuestionSignals(question: string): string[] {
  const signals = question.match(PAGE_TURN_STAGING_SIGNAL_PATTERN) ?? [];
  return [...new Set(signals.map(signal => signal.trim()).filter(Boolean))];
}

function extractPageTurnNameLikeAnchors(question: string): string[] {
  const matches = question.match(PAGE_TURN_NAME_LIKE_ANCHOR_PATTERN) ?? [];
  const knownNonNames = new Set([
    ...PAGE_TURN_BROAD_SIGNAL_SET,
    '알림',
    '예고',
    '휴대폰',
    '개발자',
    '로그',
    '번호',
    '파일',
    '로고',
    '이름',
    '주소',
    '장부',
    '메시지',
    '상처',
    '시계',
    '반지',
    '열쇠',
    '지갑',
    '서고',
    '문신',
    '지도',
    '계약',
    '서명',
    '좌표',
    '화면',
    '수신자',
    '표적',
    '가족',
    '실종',
    '살인',
    '패턴',
    '규칙',
    '일치',
    '미제',
    '사진',
    '봉투',
    '문서',
    '녹음',
    '배지',
    '목소리',
    '장소',
    '기한',
    '시간',
  ]);

  return [
    ...new Set(
      matches
        .map(anchor => anchor.trim())
        .filter(anchor => anchor.length >= 2 && !knownNonNames.has(anchor))
    ),
  ];
}

function evaluateFunSpec(
  funSpec: FunSpec,
  readerExperience: ChapterReaderExperienceForEvaluation,
  issues: EngagementContractIssue[]
): number {
  let driftCount = 0;

  for (const field of FUN_SPEC_FIELDS) {
    const expected = funSpec[field.expectedKey];
    const actual = String(readerExperience[field.actualKey] ?? '');

    if (!containsMeaningfulOverlap(actual, expected, FUN_SPEC_ALIGNMENT_THRESHOLD)) {
      driftCount++;
      issues.push({
        code: field.issueCode,
        severity: field.severity,
        message: `Chapter ${field.label} drifts from plot fun_spec.`,
        expected,
        actual,
      });
    }
  }

  return driftCount;
}

function scoreCliffhanger(strength?: number): number {
  if (typeof strength !== 'number') {
    return 50;
  }

  return Math.max(0, Math.min(100, strength * 10));
}

function containsMeaningfulOverlap(actual: string, expected: string, threshold: number): boolean {
  const normalizedActual = normalizeText(actual);
  const normalizedExpected = normalizeText(expected);

  if (!normalizedActual || !normalizedExpected) {
    return false;
  }

  if (
    normalizedActual === normalizedExpected ||
    normalizedActual.includes(normalizedExpected) ||
    normalizedExpected.includes(normalizedActual)
  ) {
    return true;
  }

  return textSimilarity(normalizedActual, normalizedExpected) >= threshold;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function abbreviateEvidence(value: string, maxLength = 500): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength)}...`
    : normalized;
}

function textSimilarity(left: string, right: string): number {
  const leftGrams = toCharacterBigrams(left);
  const rightGrams = toCharacterBigrams(right);

  if (leftGrams.size === 0 || rightGrams.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const gram of leftGrams) {
    if (rightGrams.has(gram)) {
      overlap++;
    }
  }

  return overlap / Math.max(leftGrams.size, rightGrams.size);
}

function toCharacterBigrams(value: string): Set<string> {
  const compact = value.replace(/\s+/g, '');
  const grams = new Set<string>();

  if (compact.length < 2) {
    if (compact.length === 1) {
      grams.add(compact);
    }
    return grams;
  }

  for (let i = 0; i < compact.length - 1; i++) {
    grams.add(compact.slice(i, i + 2));
  }

  return grams;
}
