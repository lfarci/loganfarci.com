---
spec: Inner-page rule continuity refinement
status: approved-design
date: 2026-08-30
---

# Inner-page rule continuity refinement

## Scope

Refine the About and Articles pages within the approved Field Notes visual system.
The change aligns their editorial rules with Home and simplifies expanded evidence
metadata without changing factual content, routes, or disclosure behavior.

## Decision

At widths where the shared vertical editorial rule is visible, About and Articles use
the same horizontal rule position as Home. A shared geometry value owns that position
so the pages cannot drift independently. About section boundaries and Articles index
row boundaries begin at the vertical rule and continue to the viewport edge. Their
content keeps its existing editorial inset; only the rules become continuous.

Experience summaries retain one secondary metadata line: company and dates. The
expanded location and employment-type line is removed to avoid two consecutive muted
metadata voices. Education retains one secondary line containing the university and
degree details. Expanded prose begins directly as body content in both sections.

Article rows keep their date directly below the tag group at every viewport width.
The directional arrow remains independently aligned to the row edge, so metadata reads
as one vertical sequence while the navigation affordance stays easy to find.

## Considered approaches

1. Share the editorial rule position and extend only boundary geometry. This is the
   selected approach because it creates continuity without restructuring page content.
2. Rebuild About and Articles around a new two-track page grid. This would provide
   explicit columns but introduces unnecessary markup and responsive regression risk.
3. Tune offsets independently on each page. This is the smallest immediate edit but
   would preserve the alignment drift that prompted the refinement.

## Responsive behavior

- Below 48rem, pages keep their current single-column padding and omit the vertical
  editorial rule. Article dates still follow their tags.
- From 48rem, the inner-page vertical rule uses Home's exact responsive position.
- About section and Articles row rules extend from that shared rule to the right edge;
  headings, copy, and controls remain aligned to the established content inset.
- The Articles index does not restore a separate desktop date rail at 72rem.

## Acceptance criteria

- Home, About, and Articles use the same vertical-rule position from 48rem upward.
- About section dividers and Articles index dividers start at the vertical rule, never
  cross it, and reach the right viewport edge without causing horizontal overflow.
- Experience and Education each expose only one muted metadata line when expanded.
- Every article date appears below that article's tags on mobile, medium, and desktop.
- Article titles, descriptions, tags, dates, and arrows remain readable at 320px and
  do not overlap at the 48rem and 72rem handoffs.
- Light and dark themes preserve existing contrast, focus, disclosure, and link states.
- Formatting, linting, unit tests, build, accessibility, and browser acceptance checks
  pass before the implementation is considered complete.
