---
spec: accessibility
version: 0.1.0
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
- **Theme support.** A light/dark theme (`ThemeContext` + `ThemeToggle`, Tailwind
  `darkMode: "class"`) with an accessible toggle; contrast comes from semantic tokens
  (see [themes and contrast](#themes-and-contrast)).
- **Images.** The `Image` type requires `alt`; all `content/data/*.json` images provide
  it.

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

- **Skip-to-content link** as the first focusable element.
- **Automated checks in CI** (e.g. axe / Lighthouse a11y) so regressions are caught;
  target Lighthouse Accessibility 100 on core routes.
- **Screen-reader passes** on the home, about, and article-reading flows, documented and
  repeated as the site grows.
- **`prefers-reduced-motion`** honored across all framer-motion animations.
- **`prefers-color-scheme`** used to pick the initial theme on first visit (today the
  default is light until the user toggles), without a flash of the wrong theme.
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
