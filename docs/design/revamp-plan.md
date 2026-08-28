---
status: draft-awaiting-approval
direction: field-notes-continuous
date: 2026-08-27
---

# Field Notes, continuous: revamp plan

## Decision and outcome

This plan implements the selected **Field Notes, continuous** direction, represented by
[`2026-08-27-field-notes-continuous.png`](../../.impeccable/mocks/decision/2026-08-27-field-notes-continuous.png).
It combines the existing site’s fonts, dual-theme palette, and professional tone with
an editorial technical rhythm. The result should make Logan’s proposition and preferred
next step immediately clear, turn large inventories into selected proof, and correct the
verified responsive and accessibility defects in the current-state critique.

This is a plan only. It deliberately makes no UI or content-source changes. Build work
starts only after explicit approval of this document.

## Non-negotiable constraints

- Stay within the static Vite + React + TypeScript + Tailwind architecture documented in
  [`docs/specs/architecture.md`](../specs/architecture.md) and the non-goals.
- Preserve the existing public content data, canonical routes, SEO metadata, SSR,
  prerendering, and theme support unless an approved implementation change is necessary
  to improve presentation.
- Keep `src/public/resume.pdf` as the résumé asset. The home primary action links to
  `/resume.pdf` with `download`; do not add a résumé page or a backend.
- Use existing semantic tokens and local primitives. Do not introduce raw component
  colours, a new font family, a heavy dependency, stock imagery, or factual career copy
  that is not already supported by the data.
- The real profile portrait remains the primary human image. Logos and badges remain
  evidence, not decor. Decide whether the legacy glossy interest imagery coheres with
  the final system; remove it from affected surfaces rather than merely restyling it if
  it does not.
- Meet the WCAG 2.1 AA, semantic-token, reduced-motion, keyboard, and 320px
  no-horizontal-overflow requirements in the quality and accessibility specs.

## Work sequence

### 1. Establish the shared Field Notes language

**Likely areas:** `src/src/globals.css`, `src/tailwind.config.ts`, shared typography,
`src/src/components/shared/primitives/Button.tsx`, cards, tags, separators, and layout
utilities.

- Translate the approved contract in [`DESIGN.md`](../../DESIGN.md) into a small,
  reusable hierarchy: calm page fields, hairline section structure, concise mono
  metadata, and elevated surfaces only for meaningful groups or destinations.
- Preserve existing font families and semantic colour roles in both themes. Prefer
  refinements of current tokens and utilities over a parallel token system.
- Define consistent interaction states—default, hover, focus-visible, active, disabled,
  and reduced motion—for controls and interactive surfaces.
- Make card affordance honest: either make the bounded surface a complete link/action or
  remove the hover/lift language from its static container.

**Acceptance:** components use shared primitives and semantic tokens; field-note labels
remain legible without becoming body text; focus is conspicuous in each theme; no
component relies on decorative animation for comprehension.

### 2. Repair the shell and navigation conversion path

**Likely areas:** `src/src/components/layout/LayoutWrapper.tsx`,
`NavigationBar.tsx`, `Footer.tsx`, `src/src/components/shared/NavBarEntry.tsx`,
`src/src/components/shared/ThemeToggle.tsx`, and their tests.

- Correct the skip-link transform so first keyboard focus places the link fully inside
  the viewport, then verify activating it focuses `main`.
- Add an active-route treatment and `aria-current="page"` for internal navigation
  without marking the résumé download as the current page.
- Retain menu Escape, route-change, and desktop-breakpoint behavior while ensuring menu,
  theme, and navigation controls have comfortable touch targets.
- Carry the restrained rule-and-metadata treatment through the shell and footer so pages
  feel like one system.

**Acceptance:** keyboard-only navigation can see every focused global control; the
current location is recognizable visually and semantically; mobile menu behavior stays
covered by focused browser tests.

### 3. Rebuild Home and About around selected proof

**Likely areas:** `src/src/pages/HomePage.tsx`, `HeroSection.tsx`,
`GreetingHeading.tsx`, `ContactLinks.tsx`, `TextSection.tsx`,
`ThumbnailGridSection.tsx`, `src/src/pages/AboutPage.tsx`, related cards/disclosure
components, and their tests.

- Recompose the home opening around the existing role and profile information: a
  stronger editorial proposition, real portrait, a clearly labelled **Download résumé**
  primary download, and **Contact me** secondary action. Place social/contact icons as
  supplementary labelled choices, not the only hero actions.
- Introduce a compact, factual proof rail for Experience, Writing, and Cloud systems;
  use existing site data rather than fabricated counts or claims.
- Replace Home’s automatic equal-weight grid treatment with a sequence of selected
  evidence, clear continuation links, and only purposeful bounded surfaces.
- Reorder About into an editorial narrative followed by selected experience, then
  education, certifications, and skills in explicit tiers. Group long-tail credentials
  and skills behind progressive disclosure where it improves scanning.
- Ensure disclosure states have full-size controls, `aria-expanded`, a controlled region,
  sensible initial visibility, and no loss of SEO-visible/static content.

**Acceptance:** a first-time visitor can identify Logan’s work and find the résumé or
contact path in the first viewport; the About page communicates depth before breadth;
all content remains reachable by keyboard and is understandable without icons alone.

### 4. Bring articles and recovery pages into the same hierarchy

**Likely areas:** `src/src/pages/ArticlesPage.tsx`, `ArticlePage.tsx`,
`NotFoundPage.tsx`, article list/card components, `MarkdownContent.tsx`, `CodeSnippet`,
article-navigation components, and their tests.

- Apply the same editorial labels, hierarchy, and restrained surfaces to the article
  index and article headers without disturbing existing metadata, JSON-LD, table of
  contents, callouts, diagrams, or code-copy behavior.
- Correct inline-code wrapping or safe inline overflow independently from block-code
  scrolling, then test long paths at 320–390px and browser zoom.
- Update the 404 recovery action to use the shared button/interaction language and offer
  a clear next step without adding a route or runtime service.

**Acceptance:** reading remains the strongest experience; article metadata is scannable;
long inline code stays fully accessible on narrow screens; every recovery action is
visibly and semantically a control.

### 5. Verify the responsive, accessible system

**Likely areas:** affected unit/component/Playwright specs, the accessibility baseline,
and any small regression tests needed for navigation, controls, or markdown rendering.

- Verify Home, About, Articles, one representative article, and 404 in light and dark
  themes at 320px, 375–390px, tablet, and desktop widths.
- Exercise keyboard-only flows: skip link, brand/navigation, mobile menu, theme toggle,
  primary and secondary home actions, disclosures, article navigation, and 404 recovery.
- Verify reduced-motion states, visible focus, active navigation semantics, labels,
  touch targets, heading hierarchy, contrast, and no hidden horizontal reading content.
- Run the project quality gate and repeat the documented manual screen-reader pass after
  material UI changes.

**Acceptance:** the verified critique defects are resolved; no serious or critical axe
findings are introduced; automated and manual checks support the final review.

## Validation gates for implementation

Run from `src/` once code changes begin:

```bash
npm run lint
npm run format:check
npm run test
npm run build
npm run accessibility
```

For browser acceptance after the static build:

```bash
npm run preview:swa
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4280 npm run test:e2e
```

Use the repository’s full validation workflow before proposing a PR. A visual review is
also required in both themes and at narrow/mobile widths; automated checks alone cannot
approve the hierarchy or image treatment.

## Risks to manage during build

| Risk                                                | Guardrail                                                                                                      |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| A fresh aesthetic erases the existing site identity | Retain the existing fonts, dual-theme palette, real portrait, and semantic token roles.                        |
| “Field notes” becomes decoration                    | Use index markers and rules to clarify order and proof, not as texture or chrome.                              |
| About disclosure hides important evidence           | Keep an intentional initial set visible, use semantic controls, and preserve all content in the static render. |
| More CSS creates regressions in dark mode or mobile | Verify every altered primitive and route in both themes and at 320–390px before review.                        |
| A stronger hero overstates the profile              | Build from the existing role, introduction, work, writing, and certification data only.                        |
| Large visual changes weaken established behavior    | Extend current focused tests before replacing shared component behavior; preserve SEO/prerender contracts.     |

## Approval checkpoint

Approve this plan to begin implementation on the isolated branch. The first build pass
will establish the global language and shell, then validate it before the page-level
recomposition proceeds.
