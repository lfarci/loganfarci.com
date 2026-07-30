---
goal: Improve article permalink focus visibility, table-of-contents orientation, mobile density, and regression coverage
version: 1.0
date_created: 2026-07-30
last_updated: 2026-07-30
owner: Logan Farci
status: "Planned"
tags: [design, accessibility, navigation, testing, react]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan addresses the UI/UX review findings for article heading permalinks and the
“In this article” table of contents in PR 333. The implementation preserves the
background-free permalink, the non-collapsible mobile table of contents, the sticky
desktop rail, static prerendering, and the repository's lightweight testing strategy.

## 1. Requirements & Constraints

- **REQ-001**: The heading permalink MUST retain a 44×44 CSS-pixel interactive target at
  the `xl` breakpoint and MUST remain `display: none` below `xl`.
- **REQ-002**: The heading permalink MUST NOT add a persistent, hover, or focus surface
  background.
- **REQ-003**: Keyboard focus on the heading permalink MUST render a two-pixel,
  semantic-token outline around the 24×24 permalink glyph wrapper with a two-pixel
  offset.
- **REQ-004**: Permalink hover and focus transitions MUST remain between 150 and 300
  milliseconds and MUST be disabled by the existing reduced-motion rule.
- **REQ-005**: The table of contents MUST remain an always-visible `nav` landmark titled
  “In this article”; it MUST NOT use `details`, `summary`, or a disclosure chevron.
- **REQ-006**: The table of contents MUST mark the section occupying the upper reading
  region as current with `aria-current="location"`.
- **REQ-007**: The current table-of-contents link MUST use both font weight and a
  two-pixel left indicator; color MUST NOT be its only current-state signal.
- **REQ-008**: Current-section tracking MUST use one native `IntersectionObserver`;
  it MUST NOT register a continuous `scroll` event listener.
- **REQ-009**: A same-page hash change MUST update the current table-of-contents link,
  including initial deep links and permalink clicks.
- **REQ-010**: Mobile widths below `lg` MUST show top-level article headings and hide
  nested heading lists. Widths at `lg` and above MUST show the complete nested heading
  hierarchy.
- **REQ-011**: Every visible table-of-contents link MUST retain a minimum 44-pixel
  height, keyboard focus ring, and readable wrapping without horizontal overflow.
- **REQ-012**: The mobile table of contents MUST retain one lower divider and MUST NOT
  add a top divider.
- **REQ-013**: Heading IDs, permalink links, table-of-contents links, and the navigation
  title MUST remain present in SSR and prerendered HTML.
- **CON-001**: Use React, native browser APIs, Tailwind utilities, and existing semantic
  color tokens only.
- **CON-002**: Do not add Playwright, Cypress, another browser-automation framework, or
  any production dependency.
- **CON-003**: Do not change the markdown parsing pipeline or add a remark/rehype
  dependency.
- **CON-004**: Do not introduce layout movement when permalink or current-section states
  change.
- **GUD-001**: Component tests MUST query interactive elements by role and accessible
  name.
- **GUD-002**: Browser validation MUST cover 375px, 768px, 1280px, and 1440px widths in
  both light and dark themes.
- **PAT-001**: Reuse `remarkArticleHeadings`, `ArticleHeading`, and the existing nested
  table-of-contents tree as the single source of heading IDs and labels.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Add an unambiguous keyboard-focus indicator without restoring permalink
  button chrome.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                       | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | In `src/src/components/shared/HeadingPermalink.tsx`, wrap `LinkIcon` in a `span` with `size-6`, centered flex layout, and `rounded-full`. Add a named Tailwind group to the anchor and apply `group-focus-visible` utilities to the wrapper for `outline-2`, `outline-offset-2`, and `outline-ring`. Preserve `size-11`, `hover:text-primary`, `focus-visible:text-primary`, and the absence of any `bg-*` class. |           |      |
| TASK-002 | In `src/src/components/shared/MarkdownContent.test.tsx`, replace the assertions that forbid every focus outline with assertions that the anchor has no background class and the glyph wrapper has the required focus-only semantic outline classes. Retain the assertions for `hidden`, `xl:inline-flex`, and the 44-pixel target. Depends on TASK-001.                                                           |           |      |

### Implementation Phase 2

- GOAL-002: Add current-section orientation to the persistent table of contents.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-003 | Create `src/src/components/shared/useActiveArticleHeading.ts`. Export `useActiveArticleHeading(headingIds: readonly string[]): string \| null`. Initialize the state to the first heading ID, then in `useEffect` resolve heading elements with `document.getElementById`, apply the current URL hash when it matches an eligible ID, and observe the resolved elements with `rootMargin: "-96px 0px -70% 0px"` and `threshold: 0`. Select the intersecting entry with the smallest `boundingClientRect.top`. Disconnect the observer and remove the `hashchange` listener during cleanup. |           |      |
| TASK-004 | In `src/src/components/shared/ArticleTableOfContents.tsx`, preserve the flat parsed heading array before creating the nested tree, pass its ordered IDs to `useActiveArticleHeading`, and pass the returned ID through every recursive `TableOfContentsList` call. Depends on TASK-003.                                                                                                                                                                                                                                                                                                    |           |      |
| TASK-005 | In `TableOfContentsList`, set `aria-current="location"` only on the active link. Give every link a transparent two-pixel left border so state changes do not shift layout. For the active link, use `border-primary`, `font-semibold`, and `text-primary`; preserve the existing hover underline and focus ring. Use `mergeClassNames` instead of manual string concatenation. Depends on TASK-004.                                                                                                                                                                                        |           |      |
| TASK-006 | Create `src/src/components/shared/useActiveArticleHeading.test.ts` with a deterministic `IntersectionObserver` mock. Verify initial-first-heading state, intersection-driven updates, matching-hash updates, ignored unknown hashes, observer cleanup, and the no-`IntersectionObserver` fallback. Depends on TASK-003.                                                                                                                                                                                                                                                                    |           |      |
| TASK-007 | Extend `src/src/components/shared/MarkdownContent.test.tsx` to verify that exactly one table-of-contents link exposes `aria-current="location"` initially and that the current link includes both the font-weight and left-indicator classes. Depends on TASK-005 and TASK-006.                                                                                                                                                                                                                                                                                                            |           |      |

### Implementation Phase 3

- GOAL-003: Reduce mobile table-of-contents density without restoring a disclosure.

| Task     | Description                                                                                                                                                                                                                                                                                                                           | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-008 | In `TableOfContentsList` within `src/src/components/shared/ArticleTableOfContents.tsx`, apply `hidden lg:block` to nested `ol` elements while leaving the root `ol` visible at every width. Preserve the nested left border and indentation at `lg` and above.                                                                        |           |      |
| TASK-009 | Extend `src/src/components/shared/MarkdownContent.test.tsx` with a three-level heading fixture. Assert that the root list has no responsive hiding class, nested lists contain `hidden` and `lg:block`, the navigation contains no `details` or `summary`, and all nested links remain in the SSR static markup. Depends on TASK-008. |           |      |
| TASK-010 | Update the “Article heading navigation” section in `docs/specs/markdown-rendering.md` to state that mobile shows top-level headings, desktop shows the complete nested hierarchy, and the active section is exposed with `aria-current="location"`. Depends on TASK-005 and TASK-008.                                                 |           |      |

### Implementation Phase 4

- GOAL-004: Validate responsive behavior without adding a heavy browser-testing
  dependency.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-011 | From `src/`, run `npm run format:check`, `npm run lint`, `npm run test`, and `npm run build` in that order. Stop on the first failure and correct only failures introduced by this implementation before restarting the sequence. Depends on TASK-002, TASK-007, TASK-009, and TASK-010.                                                                                                                                                                                                      |           |      |
| TASK-012 | Deploy the branch preview through the existing Azure Static Web Apps workflow. Run `npm run smoke -- <preview-url>` or confirm the workflow's `Smoke Test Preview` job passes. Confirm the Lighthouse accessibility workflow passes. Depends on TASK-011.                                                                                                                                                                                                                                     |           |      |
| TASK-013 | On the deployed preview, validate 375×812 and 768×1024 viewports in light and dark themes: permalink links are not displayed; “In this article” is visible and non-collapsible; only top-level ToC links are displayed; the ToC has no top divider or horizontal overflow; every visible link has a 44-pixel minimum target. Record the result in the PR description or a PR comment. Depends on TASK-012.                                                                                    |           |      |
| TASK-014 | On the deployed preview, validate 1280×800 and 1440×900 pointer-capable viewports in light and dark themes: hovering each eligible heading reveals the permalink fully inside the viewport; keyboard focus reveals a background-free glyph with a visible outline; the full nested ToC is sticky; scrolling updates exactly one current link without layout movement; direct hash navigation clears the sticky header. Record the result in the same PR validation note. Depends on TASK-012. |           |      |
| TASK-015 | Repeat TASK-014 with reduced motion enabled and verify that permalink transitions complete without perceptible animation while focus, hash navigation, and current-section updates remain functional. Depends on TASK-014.                                                                                                                                                                                                                                                                    |           |      |

## 3. Alternatives

- **ALT-001**: Restore a filled or bordered permalink button. Rejected because the
  requested visual direction is a simple, background-free icon.
- **ALT-002**: Restore a collapsible mobile table of contents. Rejected because the
  requested reading flow keeps article navigation visible without a disclosure.
- **ALT-003**: Keep every nested heading visible on mobile. Rejected because current
  articles contain up to ten eligible headings and can devote at least 440 pixels to
  link targets before the body begins.
- **ALT-004**: Track the active heading with a `scroll` listener. Rejected because
  `IntersectionObserver` avoids continuous main-thread work and supplies the required
  behavior.
- **ALT-005**: Add Playwright or Cypress for responsive regression tests. Rejected
  because `docs/specs/testing.md` requires a lightweight test pyramid and
  `docs/specs/non-goals.md` rejects new heavy dependencies without sufficient cause.

## 4. Dependencies

- **DEP-001**: React hooks already included in `react`.
- **DEP-002**: Native browser `IntersectionObserver` and `hashchange` APIs.
- **DEP-003**: Existing Tailwind semantic tokens `primary` and `ring`.
- **DEP-004**: Existing Vitest, Testing Library, build, Lighthouse, Azure preview, and
  smoke-test workflows.

## 5. Files

- **FILE-001**: `src/src/components/shared/HeadingPermalink.tsx` — focus-only permalink
  treatment.
- **FILE-002**: `src/src/components/shared/ArticleTableOfContents.tsx` — active link
  rendering and responsive nested-list visibility.
- **FILE-003**: `src/src/components/shared/useActiveArticleHeading.ts` — native
  current-section tracking hook.
- **FILE-004**: `src/src/components/shared/useActiveArticleHeading.test.ts` — observer
  and hash behavior tests.
- **FILE-005**: `src/src/components/shared/MarkdownContent.test.tsx` — integrated
  permalink, ToC, SSR, and responsive-class regression tests.
- **FILE-006**: `docs/specs/markdown-rendering.md` — canonical article-navigation
  behavior.

## 6. Testing

- **TEST-001**: Verify the permalink remains hidden below `xl`, uses a 44×44 target at
  `xl`, has no surface background class, and exposes a focus-only semantic outline on
  its glyph wrapper.
- **TEST-002**: Verify the active-heading hook initializes to the first heading and
  responds deterministically to observer entries.
- **TEST-003**: Verify matching hashes update the active heading and unknown hashes do
  not clear the last valid active heading.
- **TEST-004**: Verify observer targets, the `hashchange` listener, and all cleanup
  operations.
- **TEST-005**: Verify exactly one ToC link has `aria-current="location"` and its
  current state uses both weight and a left indicator.
- **TEST-006**: Verify mobile-responsive classes hide nested lists while retaining the
  root list and all SSR links.
- **TEST-007**: Verify ToC links retain 44-pixel minimum height, hover feedback, and
  visible keyboard focus classes.
- **TEST-008**: Verify `npm run format:check`, `npm run lint`, `npm run test`, and
  `npm run build` pass.
- **TEST-009**: Verify Lighthouse accessibility and preview smoke checks pass.
- **TEST-010**: Complete and record the four-viewport, two-theme, pointer, keyboard,
  reduced-motion, and direct-hash manual browser matrix defined by TASK-013 through
  TASK-015.

## 7. Risks & Assumptions

- **RISK-001**: Intersection boundaries can oscillate when adjacent headings are close.
  Mitigation: use one upper reading band and choose the intersecting heading with the
  smallest viewport-top coordinate.
- **RISK-002**: Hiding nested ToC links on mobile removes direct navigation to
  subsections. Mitigation: all top-level sections remain linked and subsection headings
  remain visible and navigable in the article body.
- **RISK-003**: Responsive paint and pointer-media behavior are not automatically
  exercised by jsdom. Mitigation: make the preview validation matrix a mandatory
  completion task and retain Lighthouse plus smoke gates.
- **RISK-004**: A hash can reference an ID outside the eligible ToC heading set.
  Mitigation: accept hash state only when the decoded ID exists in `headingIds`.
- **ASSUMPTION-001**: Top-level headings provide sufficient mobile article orientation
  while nested headings remain useful in the wider sticky rail.
- **ASSUMPTION-002**: The existing `scroll-mt-24` value and the observer's six-rem top
  margin match the sticky site-header offset.
- **ASSUMPTION-003**: `IntersectionObserver` is available in supported production
  browsers; the hook retains the first/hash-selected heading when it is unavailable.

## 8. Related Specifications / Further Reading

- [`docs/specs/accessibility.md`](../docs/specs/accessibility.md)
- [`docs/specs/markdown-rendering.md`](../docs/specs/markdown-rendering.md)
- [`docs/specs/quality-bars.md`](../docs/specs/quality-bars.md)
- [`docs/specs/testing.md`](../docs/specs/testing.md)
- [`docs/specs/non-goals.md`](../docs/specs/non-goals.md)
