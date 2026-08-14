---
spec: accessibility
version: 0.2.3
status: current-state
---

# Accessibility

[Back to the specs index.](./README.md)

Accessibility is a **first-class goal** for loganfarci.com, not an afterthought. This
spec is the detailed accessibility contract; the **enforced pass/fail bar** a reviewer
blocks on lives in
[quality-bars.md](./quality-bars.md#accessibility--target-wcag-21-aa) (target
**WCAG 2.1 AA**) — this file expands on it and sets the direction, it does not restate
the gate. For the broader "why", see [vision.md](./vision.md#accessibility-ambitions).

## Current baseline

Verified in the code today:

- **Semantic HTML + Radix primitives.** Behavior for interactive elements comes from
  the local shadcn-style Radix primitives (`@/components/shared/primitives`), not
  hand-rolled `div` handlers.
- **Labels for icon-only controls.** Icon buttons and links use `aria-label` /
  `sr-only` text (e.g. the nav menu toggle, theme toggle, contact links).
- **Correct ARIA state.** The navigation menu wires `aria-controls`, `aria-expanded`,
  and `aria-hidden` to its open/closed state.
- **Decorative icons are hidden.** SVG icons render with `aria-hidden="true"` so they
  are skipped by assistive tech.
- **Headings.** One `h1` per page; visually hidden headings (`sr-only`) are used where a
  landmark needs a name without a visible title.
- **Skip-to-content link.**
  [`LayoutWrapper`](../../src/src/components/layout/LayoutWrapper.tsx) renders "Skip to
  content" as the first focusable element and targets the programmatically focusable
  `<main id="main-content">`. Its
  [unit tests](../../src/src/components/layout/LayoutWrapper.test.tsx) verify the DOM
  order, target, and `tabindex`; its
  [Playwright coverage](../../src/src/components/layout/NavigationBar.spec.ts) verifies
  keyboard focus and activation.
- **Theme support.** A light/dark theme (`ThemeContext` + `ThemeToggle`, Tailwind
  `darkMode: "class"`) with an accessible toggle. The first visit follows
  `prefers-color-scheme`, live system changes remain in sync until the visitor makes
  an explicit choice, and a saved choice takes precedence; contrast comes from
  semantic tokens (see [themes and contrast](#themes-and-contrast)).
- **Reduced motion.**
  [`PageTransition`](../../src/src/components/motion/PageTransition.tsx) honors
  `prefers-reduced-motion` for the site's Framer Motion page transitions.
- **Images.** The `Image` type requires `alt`; all `content/data/*.json` images provide
  it.
- **Automated CI checks.** Lighthouse CI audits `/`, `/about`, `/articles`, and an
  article page against the prerendered build. Every route MUST score at least 90 in
  the accessibility category, with 100 retained as the target; downloadable HTML
  reports are retained with each workflow run.
- **Automated axe checks.** The Playwright acceptance suite (`axe.spec.ts`) runs an
  axe scan on the hydrated `/`, `/about`, `/articles`, and one article route and
  fails on any **serious** or **critical** violation (see
  [testing.md](./testing.md#browser-acceptance-suite)).

## Automated checks

### Lighthouse

From `src/`, build the production site and run the same accessibility gate used in CI
(Google Chrome or Chromium must be installed):

```sh
npm run build
npm run accessibility
```

The reports are written to `src/lighthouse-reports/`. The
[`Accessibility`](../../.github/workflows/accessibility.yml) workflow runs for app and
content changes and can also be started manually with `workflow_dispatch`. See the
[Lighthouse usage guide](../lighthouse.md) for prerequisites, local troubleshooting,
reports, and manual workflow instructions.

### axe

The axe scan runs as part of the browser acceptance suite against a built preview or
deployed environment (see [testing.md](./testing.md#browser-acceptance-suite)):

```sh
npm run build
npm run preview:swa
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4280 npm run test:e2e
```

It fails on serious or critical violations and stays deterministic because it scans the
hydrated, prerendered pages served by the SWA emulator.

## Requirements

Using the [requirement levels](./README.md#requirement-levels):

- Interactive elements **MUST** be keyboard-reachable, operable, and have a **visible
  focus state**.
- Focus order **MUST** follow reading order; nothing interactive is a keyboard trap.
- Every meaningful image **MUST** have descriptive `alt`; decorative images/icons
  **MUST** be hidden from assistive tech.
- Icon-only controls **MUST** expose an accessible name (`aria-label` or `sr-only`).
- Color and contrast **MUST** come from the semantic tokens and meet AA contrast in
  **both** themes; do not hardcode colors that break contrast.
- Page structure **SHOULD** use landmarks (`header`, `nav`, `main`, `footer`) and a
  logical heading outline.
- Animations **SHOULD** respect `prefers-reduced-motion` (framer-motion is the animation
  library — gate non-essential motion on it).
- Each document **MUST** declare a correct `lang`; per-locale `lang` is covered in
  [i18n.md](./i18n.md).

## Themes and contrast

The site ships light and dark themes. Contrast **MUST** hold in each: because colors
come from Tailwind semantic tokens, use tokens rather than literal hex values so both
themes stay compliant. Any new token pair **SHOULD** be checked for AA contrast.

## Machine readers and LLMs

Accessibility here also means **machine-readable**: the site should be easy for search
crawlers and LLM/agent readers to parse.

- Prefer semantic HTML and valid JSON-LD structured data over presentational markup.
- The prerender step emits `llms.txt`, `llms-full.txt`, `sitemap.xml`, and `robots.txt`
  (see [architecture.md](./architecture.md#ssr--prerender-contract)); keep them complete
  as sections are added.
- Static prerendered HTML means content is present without running JavaScript — preserve
  that (see [non-goals.md](./non-goals.md)).

## Ideal state (planned)

Targets to grow toward, guided by [vision.md](./vision.md). Prefer platform features and
established, lightweight helpers over bespoke a11y machinery:

- **Screen-reader passes** on the home, about, and article-reading flows, documented and
  repeated as the site grows. The repeatable procedure, tested combination, and result
  template live in [screen-reader-validation.md](../screen-reader-validation.md).
- **Per-locale `lang`** and correct document language once multilanguage lands
  ([i18n.md](./i18n.md)).

## Rules for agents

- A change **MUST NOT** regress the enforced bar in
  [quality-bars.md](./quality-bars.md#accessibility--target-wcag-21-aa).
- New interactive UI **MUST** be keyboard-operable with a visible focus state and an
  accessible name before it ships.
- Do not reimplement behavior the Radix primitives already provide accessibly.
- When adding user-facing color, use semantic tokens and verify AA contrast in both
  themes.
