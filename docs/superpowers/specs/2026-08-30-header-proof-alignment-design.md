---
spec: Header and proof alignment refinement
status: approved-design
date: 2026-08-30
---

# Header and proof alignment refinement

## Scope

Refine the existing Field Notes composition without changing content, routes,
components, data contracts, or the established 72rem responsive handoff.

## Decision

About and Articles will use a single-column page-header composition at every width.
The supporting sentence sits directly beneath the page title, shares its left edge,
and keeps a restrained reading measure. This removes the awkward title/copy split on
desktop while preserving the existing typography and vertical rhythm.

The homepage proof rail remains three equal grid tracks at desktop. Each destination
centres its label, supporting copy, and arrow as one balanced composition. All three
cells use the same internal alignment and spacing so Experience, Articles, and
Certifications carry equal visual weight. The rail begins at the vertical editorial
rule and continues to the portrait edge, so the first cell never crosses the rule.
Mobile proof rows retain their current scannable layout.

## Considered approaches

1. Keep the desktop header split and reduce its gap. This preserves the current grid
   but does not resolve the underlying disconnected hierarchy.
2. Place supporting copy beneath the title. This is the selected approach because it
   reads naturally and matches the editorial character.
3. Remove the supporting copy. This is visually clean but discards useful orientation.

For the proof rail, equal centred cells are preferred over width-by-content tracks or
left-aligned equal tracks because the three destinations are peers.

## Acceptance criteria

- About and Articles supporting copy appears below and left-aligned with its title at
  mobile, medium, and desktop widths.
- The copy retains a readable maximum width and does not collide with navigation.
- At 72rem and wider, all three homepage proof destinations occupy equal widths and
  centre their content consistently.
- The desktop proof cells begin at the vertical editorial rule and do not cover or
  cross it.
- Mobile homepage proof rows remain readable and preserve their current interaction
  and tab order.
- Light and dark themes retain existing contrast and focus treatments.
- Existing automated quality gates pass.
