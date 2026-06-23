# Scene Micro-Turn Density Design

## Goal

Add an engagement gate that catches manuscript passages where events are present but the reading experience stays flat because adjacent sentence windows do not change reader prediction, choice pressure, risk, relationship state, or next-question pressure.

## Problem

Existing gates catch major omissions: scene state delta, causal chain, tactical adaptation, tension wave, dialogue turns, signature image, and prose density. A manuscript can still pass many broad checks while several middle paragraphs read like procedural status:

- checked a record
- moved to a location
- checked again
- thought about the result
- continued to the next item

That pattern creates "stuff happened" without the small turns that make readers keep predicting and revising. The new gate targets this lower-level sustained flatness.

## Selected Approach

Implement `manuscript-micro-turn-density-not-evidenced` inside `src/quality/engagement-contract.ts`.

The evaluator will split the manuscript into sentences and scan sliding windows of two to four sentences, using a three-sentence primary window. A window counts as a micro-turn when it contains enough evidence from at least two turn families:

- new concrete clue or evidence
- hypothesis revision or suspect/meaning reordering
- choice narrowing or forced decision
- risk increase, ticking clock, or active pressure
- relationship, trust, power, or alliance shift
- tactical change, reroute, tool switch, or changed next action
- visible cost, consequence, loss, or locked option
- sharpened next question or open loop

The gate fails when an eight-plus-sentence manuscript has too few turn windows and a long flat run. This makes it a structural engagement check, not a style ban. It should not punish quiet scenes that still change relationship state, narrow a choice, create a new question, or alter the protagonist's next action.

## Integration

- Add the issue code to `EngagementIssueCode`.
- Add a manuscript assessment function near the existing manuscript scene/causal checks.
- Lower manuscript momentum and create a critical issue when the check fails.
- Add a revision directive targeting `manuscript`.
- Include the code in directive priority sorting.
- Add evaluator tests for failing flat windows and passing turn-dense prose.
- Add docs/skill references so writing and verification agents know the gate exists.
- Add the issue to engagement benchmark required issue coverage so labeled bad examples can calibrate it.

## Non-Goals

- Do not create a new prose-taste metric. This is about engagement progression, not surface sentence cadence.
- Do not require every sentence to be dramatic.
- Do not force high-tension pacing into quiet chapters.
- Do not introduce a user-configurable threshold until real reader calibration shows it is needed.

## Testing

Tests must prove:

- A concrete but flat investigation/action sequence fails with `manuscript-micro-turn-density-not-evidenced`.
- A manuscript with clue, risk, choice, consequence, hypothesis revision, and next-question turns passes the new gate.
- The directive is critical and targets `manuscript`.
- Documentation and skill contract tests include the new issue code.

## Spec Self-Review

- Placeholder scan: no placeholders.
- Internal consistency: the issue is scoped to engagement, not prose taste.
- Scope check: one evaluator gate plus docs/tests, no independent subsystem.
- Ambiguity check: micro-turn families and failure conditions are explicit enough for implementation.
