---
spec: Article title and About rule completion refinement
status: approved-design
date: 2026-08-31
---

# Article title and About rule completion refinement

## Scope

Complete two small layout details in the implemented Field Notes system without
changing content, components, routes, or responsive breakpoints.

## Decision

Article index titles use the full width available in their content track at every
viewport size. The desktop-only `31ch` cap is removed; title wrapping remains governed
by the row width, the established display size, and balanced wrapping.

On About and the Articles index, the vertical editorial rule continues through the
intentional space above the footer and terminates at the footer's horizontal boundary.
One shared footer-gap value controls the footer margin and both rule extensions so the
three cannot drift apart.

## Considered approaches

1. Remove the title cap and share the footer-gap geometry across About and Articles.
   This is selected because it fixes the discontinuities without new markup or
   duplicated offsets.
2. Add a separate connector pseudo-element to the footer. This would visually work but
   split ownership of one continuous rule across two elements.
3. Move the editorial rule into the global layout shell. This could unify every route
   but expands the change beyond the requested About and Articles refinement.

## Responsive behavior

- Article titles remain content-width on mobile and medium screens and become uncapped
  at the 72rem desktop handoff.
- Below 48rem, About and Articles keep their current single-column compositions without
  a vertical editorial rule.
- From 48rem, both existing rules extend through the complete footer gap and meet the
  footer border exactly.

## Acceptance criteria

- No desktop rule limits article titles to `31ch`; titles may use the full row content
  width while preserving their current typography and wrapping behavior.
- About and Articles have no visible gap between their vertical rules and the footer
  boundary at 48rem, 72rem, or wider viewports.
- The divider does not extend into the footer itself or appear on mobile.
- Neither change introduces horizontal overflow, overlap, or layout shift.
- Light and dark themes preserve current contrast and line hierarchy.
- Formatting, linting, unit tests, build, accessibility, and browser acceptance checks
  pass before the implementation is complete.
