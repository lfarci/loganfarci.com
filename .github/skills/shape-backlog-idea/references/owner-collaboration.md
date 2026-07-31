# Owner collaboration and backlog context

## Communication profile

- Logan commonly develops ideas aloud or through voice dictation. Messages may contain
  pauses, repeated words, approximate component names, and transcription errors. Treat
  this as exploratory input, not as a requirement for him to rewrite the request.
- Reconstruct the intended user experience, inspect the application, and reflect the
  interpretation back in clearer product language before writing the issue.
- Logan expects the agent to investigate first: inspect code, Git history, specs,
  related issues, and the rendered or deployed behavior when relevant.
- Offer an honest recommendation. When the evidence favors removing code, say so; when
  an idea adds meaningful personality or usability, explain why it is worth keeping.
- Do not force premature choices. If design uncertainty is real, place a small set of
  options and a preferred starting point in the issue. Once Logan chooses a direction,
  make the issue decisive and coherent.
- Lead with the outcome and use plain language. Keep the conversational handoff short;
  put detailed requirements and verification in the issue.

## Product and engineering preferences

- Favor a modern, clear, friendly professional experience with restrained personality.
- Make controls self-explanatory. Do not rely on ambiguous chevrons, icon-only meaning,
  or hover-only explanations when visible contextual language is practical.
- Design mobile and desktop as complete journeys. A feature is not finished when a
  reader can enter a flow but cannot conveniently return, switch section, or recover.
- Preserve the site's history and distinctive technical character when it serves the
  professional story, as with the terminal, but keep optional experiences secondary to
  normal navigation.
- Prefer pragmatic industry conventions and coherent feature ownership over bespoke
  architecture. Once a standard direction is selected, apply it consistently.
- Reuse the same typed content sources. Do not duplicate biography, skills, article,
  certification, or contact data inside UI features.
- Accessibility, static prerendering, first-visit behavior, responsive layouts, both
  themes, reduced motion, and maintainable tests are part of the feature definition.
- Avoid heavy dependencies and complexity that do not earn clear user value.

## Issue-shaping preferences

- Search for duplicates before creating anything. Refine an exact open match rather
  than splitting ownership across issues.
- Preserve completed historical issues and create a follow-up when the new request is
  a distinct productization pass or a regression.
- Use imperative titles and exactly one type label: `task` or `bug`. Add topical labels
  only when they add useful filtering.
- Keep issues standalone, self-contained, agent-ready, and measurable. Use milestones
  only for meaningful delivery grouping.
- Include relevant specs, affected paths, related issue/PR history, acceptance
  criteria, and the full repository quality gate when implementation changes the app.
- For design work, describe the current UX problem, 2–3 viable patterns when needed,
  the evaluation criteria, and which pattern is the preferred starting point.
- For defects, include reproducible steps, expected/actual behavior, a verified or
  explicitly suspected root cause, regression history, and a validation matrix that
  covers the failing environment.

## Backlog model

GitHub issues are the live source of truth. The repository uses a flat actionable
backlog:

- `bug`: current behavior is broken or regressed;
- `task`: feature, improvement, refactor, content work, or bounded investigation;
- topical labels such as `accessibility`, `ui/ux`, `refactor`, `content`, `seo`, and
  `ci/cd` supplement rather than replace the type.

Milestones group delivery themes but are not a priority scale. Several legacy
milestones have no open issues and should be audited separately rather than treated as
active work. Assignment indicates ownership, not urgency. GitHub Project status must
be queried when permissions allow; do not infer it from issue order.

## Backlog snapshot: 2026-07-31

This snapshot records context from the conversation and must be refreshed before use.

### Immediate regression

- #338: custom fonts require a reload on the first uncached visit. This is the clearest
  first priority because it affects every production entry and regressed from #322.

### Accepted UX and quality improvements

- #337: mobile return-to-contents control for article reading.
- #335: clearer homepage section navigation actions.
- #321: experience-card detail presentation.
- #328: icon-backed skill/article-tag taxonomy.
- #223, #216, #213: article typography, code-block controls, and callouts.
- #62: reorganize the homepage's “What I Do” content.

### Structural foundation

- #336: feature-first React structure. It deliberately coordinates with #321, #334,
  and #335 because they touch the same ownership boundaries. Treat that conflict plan
  as sequencing evidence, not as permission to absorb their product decisions.

### Distinctive optional feature

- #334: revive the terminal as a professional, optional profile experience. It belongs
  to the active Terminal milestone and should stay secondary to normal navigation.

### Brand, content, and strategic expansion

- #320: replace the AI-generated avatar with an approved recent photograph.
- #201: add a static résumé PDF.
- #202: create a projects showcase.
- #206: add technical recommendations.
- Internationalization chain: #224, #225, #228, #217, and #258. Sequence build-time
  message/catalog and route foundations before switcher and additional-locale polish.

No explicit priority labels or due dates were present. The available GitHub token could
not read Project fields, so this grouping is a recommended product sequence, not a
confirmed project-board status.
