---
name: shape-backlog-idea
description: Investigate loosely expressed product ideas, UX observations, refactoring proposals, and reported defects for loganfarci.com, then recommend, create, refine, or prioritize the correct GitHub backlog action. Use when Logan talks through an idea conversationally or via voice dictation, asks whether something should be kept or removed, requests a new issue, wants design or implementation options investigated, or asks how work should be sequenced.
---

# Shape Backlog Idea

Turn conversational product input into an evidence-backed backlog decision. Preserve
Logan's intent while supplying the repository research, design judgment, technical
constraints, and issue structure he should not need to specify himself.

## Prepare

1. Read `AGENTS.md`, `.github/copilot-instructions.md`,
   `.github/instructions/issues.instructions.md`, and `docs/specs/README.md`.
2. Read [references/owner-collaboration.md](references/owner-collaboration.md).
3. Read the specs and path-specific instructions relevant to the idea.
4. Inspect `git status` and use the latest available `main` state for current facts.
   Do not overwrite or mix in unrelated local work.
5. Use the GitHub connector first for issue reads and writes. Use `gh` for gaps such
   as targeted issue searches, milestones, local-branch context, or history.

## Reconstruct the request

- Treat fragmented or voice-dictated language as normal. Infer the intended outcome
  from the whole message and surrounding conversation rather than correcting wording.
- Resolve unclear nouns against the rendered UI and code. For example, determine
  whether "the arrow beside headers" means `Section` redirects, heading permalinks, or
  a disclosure chevron before shaping the issue.
- Paraphrase the understood problem and affected flow in plain language during the
  investigation. Ask only when multiple plausible interpretations would materially
  change the backlog action and the repository cannot resolve them.
- Separate the desired outcome from a suggested implementation. Preserve the outcome;
  validate the implementation against current code, specs, and established patterns.

## Investigate before deciding

Use evidence proportional to the request:

1. Inspect the current implementation, consumers, tests, specs, and relevant Git
   history.
2. Run or inspect the application when visual behavior, responsive design, or an
   interaction is central. Use the repository's local-app or validation skill when it
   applies.
3. For production-only defects, reproduce or gather production evidence when feasible.
   If not reproduced, label the suspected cause as a hypothesis and include a
   repeatable reproduction step.
4. Search open and recently closed issues by user outcome, component, symptom, and
   likely solution. Inspect related PRs when a recent change may own or explain the
   behavior.
5. Check whether the idea fits the vision, non-goals, accessibility contract, static
   architecture, and quality bars.

Do not automatically agree with every proposal. Recommend keeping, changing,
deferring, combining, or removing something based on user value and repository
evidence. Explain the decisive tradeoff briefly.

## Choose the backlog action

- **Update an existing open issue** when it already owns the requested outcome.
- **Create a new bug** for observable behavior that violates the current contract,
  including regressions introduced by completed work.
- **Create a new task** for an improvement, feature, refactor, or bounded
  investigation.
- **Do not create an issue** when the work already exists, is completed, is out of
  scope, lacks a meaningful user/project outcome, or only duplicates another task.
- Keep one actionable level. Do not create epics, parent trackers, or speculative
  issue trees.

Before any GitHub write, state the exact repository, issue action, type label,
milestone, and assignee choice. Do not claim success until GitHub confirms it.

## Handle solution certainty

- When the outcome is clear but the design is not, include 2–3 credible options,
  identify a preferred starting point, require testing them with real content and
  representative viewports, and require the PR to record the chosen tradeoff.
- When Logan selects a direction such as "follow an industry structure," make the
  issue decisive. Stop reopening the architectural choice; retain investigation only
  for ambiguous file ownership or implementation details.
- Prefer existing primitives, platform behavior, typed data, semantic tokens, and
  static rendering. Do not introduce a dependency unless the repository evidence
  justifies it.
- Make accessibility, responsive behavior, both themes, reduced motion, SSR/prerender,
  and current quality gates part of the solution where relevant—not decorative
  boilerplate.

## Write agent-ready issues

Follow `.github/instructions/issues.instructions.md`. In addition:

- Explain the current behavior and why it matters to a visitor or maintainer.
- Link the relevant specs and related issues/PRs.
- Include concrete routes, destinations, examples, data flows, or interaction states.
- Name likely affected files using current paths, while acknowledging an approved
  pending refactor when necessary.
- Preserve normal web/platform behavior such as keyboard access, browser history,
  deep links, first-load rendering, and no-JavaScript fallbacks when applicable.
- Include focused verification that can disprove the fix, including cold-cache,
  responsive, zoom, theme, or production checks when they are central.
- Avoid prescribing speculative internals as acceptance criteria. Mark a likely root
  cause as a hypothesis until verified.

## Prioritize and sequence

Refresh the live GitHub backlog before giving priority advice. GitHub is the source of
truth; the snapshot in the owner reference is context, not current state.

Use this default order, then adjust for explicit owner direction and dependencies:

1. Production regressions, broken core flows, security/privacy problems, deployment
   failures, and accessibility blockers.
2. Foundations or quality work that unblocks multiple accepted tasks or prevents
   repeated regressions.
3. High-value usability improvements to already shipped journeys.
4. Coherent design/content polish and maintainability refactors.
5. Distinctive but optional features.
6. Larger strategic expansion such as new sections or locales.

Apply these rules:

- Fix a regression before adding polish to the same surface.
- Sequence prerequisites before dependants and explicitly cross-reference them.
- Avoid starting a broad structural move while accepted product issues are actively
  changing the same files; complete them first or plan a deliberate rebase.
- Treat assignee as ownership, milestone as grouping, and `agent:working` as execution
  state—not as proof of priority.
- Never claim a GitHub Project status or confirmed priority when it was not readable.
  Present inferred sequencing as a recommendation.
- Prefer closing completed zero-open-issue milestones during a dedicated backlog
  cleanup rather than silently mutating them while shaping an unrelated idea.

## Finish

Return:

- the recommendation or diagnosis;
- the issue created or updated, with a direct link;
- the most important scope/design decision;
- any sequencing dependency or unverified assumption.

Keep the handoff concise. The GitHub issue contains the implementation detail.
