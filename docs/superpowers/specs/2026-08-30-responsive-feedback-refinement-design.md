---
spec: Responsive feedback refinement
version: 0.1.0
status: approved-design
date: 2026-08-30
---

# Responsive Feedback Refinement

## Purpose

Refine the approved Field Notes implementation on PR #445 using Logan's desktop,
medium-screen, and mobile review. Preserve the homepage's large-screen editorial
composition while making navigation, breakpoint behavior, portrait treatment, and
evidence presentation consistent across Home, About, and Articles.

This is a bounded responsive refinement, not a new visual direction. It preserves the
established fonts, semantic colours, content, routes, static rendering model, and
professional personal tone.

## Selected approach

Use **Shared shell + calm tablet**.

The site has two stable composition families instead of forcing a premature desktop
grid onto medium screens:

- Below `72rem` (1152px), every route uses the compact shared navigation and a stable
  editorial flow. Medium screens receive wider measures and intentional image crops,
  not a scaled desktop split.
- At `72rem` and above, horizontal navigation and the expressive desktop compositions
  activate together.

The breakpoint is content-driven: the large composition starts only when the portrait,
introductory copy, actions, and evidence rail can coexist without overlap or accidental
cropping.

## Shared navigation

Home MUST use the same `NavigationBar` component as the other routes. The homepage's
bespoke masthead navigation is removed.

- Below `72rem`, all routes expose the same accessible menu button and expandable menu.
- At `72rem` and above, all routes expose the same horizontal links, résumé action, and
  theme control.
- Active route, focus, Escape dismissal, route-change dismissal, resize behavior, and
  44px touch targets remain consistent.
- Home MAY continue to omit the ordinary inner-page footer because its proof rail closes
  the composition, but it MUST no longer own a separate navigation interaction.

## Homepage

### Portrait and large-screen structure

- The full split portrait begins at `72rem`, not at the current `64rem` breakpoint.
- Below that breakpoint, the portrait uses a deliberate landscape stage with Logan
  visibly centred in the useful crop. He MUST NOT appear cut through the middle or
  disappear behind the right edge as the viewport approaches desktop width.
- The vertical `L. FARCI` marker uses a semantic high-contrast foreground/background
  treatment with a subtle boundary so it remains readable in both themes.
- On desktop, the divider between the hero content and the three proof links spans the
  full left content field up to the portrait division instead of stopping at the
  editorial inset.

### Configurable homepage evidence

Create a typed build-time configuration at `content/data/home.json`. It owns the
homepage technologies and proof links so these high-salience choices can change without
editing React code.

The initial technologies are:

1. GitHub Copilot
2. GitHub Actions
3. .NET
4. Azure

The initial proof links are:

| Label          | Detail                                         | Destination             |
| -------------- | ---------------------------------------------- | ----------------------- |
| Experience     | Learn about my work experience and projects    | `/about#experience`     |
| Articles       | What I'm currently exploring and writing about | `/articles`             |
| Certifications | Credentials behind my current work             | `/about#certifications` |

The configuration is imported through `core/data.ts`, represented by explicit
TypeScript types, and validated by the existing data tests. It remains static and
prerendered; there is no runtime fetch.

### Action hierarchy

The résumé and Contact me actions retain their current primary/secondary order. Social
icon links become visually lighter through semantic muted foregrounds, quieter borders,
and no competing elevation. They remain labelled, keyboard accessible, and at least
44px square.

## About

- The portrait is square below `72rem`; the existing portrait-oriented crop returns in
  the desktop composition.
- Section boundaries before headings are removed below `72rem`. Spacing and the ruled
  disclosure rows carry the hierarchy so the page does not feel over-divided.
- Experience company logos move from the expanded body into the disclosure summary.
  The collapsed preview shows logo, role, company, and period together.
- Expanded experience content uses a consistent body hierarchy: the company overview
  and responsibility list share the same secondary reading voice without an abrupt
  typography shift.
- Education becomes a native `details` disclosure consistent with Experience. Its logo,
  qualification, institution, and period remain visible in the collapsed preview.
- Existing anchors, native disclosure semantics, keyboard behavior, and factual content
  remain unchanged.

## Articles

- Article rows remain single-column below `72rem`; publication dates stay below the
  article copy as they do on mobile.
- Long mobile titles receive the full available row width. The directional arrow moves
  out of the title's text line so it does not force avoidable three-line wrapping.
- At `72rem` and above, the date returns to the right-side desktop column and the
  directional treatment remains visible.
- Titles, descriptions, tags, dates, routes, and list ordering remain unchanged.

## Accessibility and behavior

- The shared menu button MUST keep an accessible name, `aria-controls`, and
  `aria-expanded`.
- All menu, CTA, social, disclosure, and article-link targets MUST remain keyboard
  operable with visible focus.
- Meaningful logos and portraits retain descriptive alternative text; decorative arrows
  remain hidden from assistive technology.
- Reading and focus order MUST remain stable across responsive compositions.
- Semantic tokens MUST provide AA contrast in light and dark themes, including the
  portrait marker and muted social actions.
- Motion MUST continue to respect `prefers-reduced-motion`.

## Scope boundaries

- Do not redesign the approved desktop homepage beyond the explicit divider, marker,
  shared-navigation, and breakpoint corrections.
- Do not change factual résumé/profile/article content except the approved homepage
  labels and descriptions.
- Do not add routes, dependencies, images, runtime fetching, or a new component system.
- Do not merge PR #445 as part of this refinement.

## Validation

Render and inspect both themes at representative widths including `390px`, `768px`,
`1024px`, `1152px`, and `1440px`. The visual review MUST cover Home, About, Articles,
and a representative article detail page so the shared navigation change is verified.

Focused tests MUST cover:

- the typed homepage configuration;
- homepage proof labels, details, destinations, and technologies;
- shared mobile navigation on Home and inner pages;
- experience and education disclosure previews;
- article date and title behavior at responsive widths where observable.

Before handoff, run the complete repository quality gate: formatting, lint, unit and
data tests, Playwright including axe, production build, and Lighthouse accessibility.

## Acceptance criteria

- Home and inner pages use one navigation implementation at every width.
- Medium-width homepage portraits do not clip Logan through the middle or push him
  behind the right edge.
- About has no overlap at `768px` or `1024px`, and its mobile/medium hierarchy is not
  preceded by repeated section rules.
- Article dates remain below copy until `72rem`; long phone titles have visibly more
  usable width.
- The desktop marker is readable in light and dark themes, and the hero/proof divider
  spans the full left field.
- Homepage technology and proof-link content comes from typed configuration.
- Company and diploma logos appear in disclosure previews, and Education is
  collapsible.
- The complete local quality gate passes with no accessibility regression.
