# Redesign critique: Field Notes, continuous

Date: 2026-09-10

Status: critique-ready

Method: dual-agent (A: `assessment_a` · B: `assessment_b`)

## Scope and evidence

This critique reviews the current `redesign/field-notes-homepage` working tree,
including its four pre-existing uncommitted edits. It does not change UI or content
source files.

Both independent assessments inspected 30 route/theme/viewport combinations:

- `/`
- `/about`
- `/articles`
- one representative `/articles/:slug`
- `/404`
- light and dark themes
- representative phone, tablet, and 1440px desktop widths

The rendered checks covered keyboard focus, the compact menu and Escape dismissal,
About disclosures, article navigation, reduced motion, overflow, obvious contrast,
runtime errors, and responsive composition. The production build also prerendered all
public routes successfully. All 253 Vitest tests passed, although the broader local
quality gate could not complete because the existing `node_modules` install lacks
`tsx` and `@axe-core/playwright`.

## Design health score

This is a public portfolio and reading experience. Expert accelerators and interface
help are not meaningful measures for the reviewed surface.

| #         | Heuristic                       |           Score | Key issue                                                                         |
| --------- | ------------------------------- | --------------: | --------------------------------------------------------------------------------- |
| 1         | Visibility of system status     |             3/4 | Article detail does not keep Articles active in the navigation.                   |
| 2         | Match system / real world       |             3/4 | “View résumé” initiates a download.                                               |
| 3         | User control and freedom        |             4/4 | Back, skip, Escape, and 404 recovery paths are strong.                            |
| 4         | Consistency and standards       |             3/4 | Minor navigation, type-family, and focus-treatment drift remains.                 |
| 5         | Error prevention                |             3/4 | The primary résumé behavior is not disclosed by its label.                        |
| 6         | Recognition rather than recall  |             3/4 | Compact navigation hides destinations and social contacts are visually icon-only. |
| 7         | Flexibility and efficiency      |             n/a | Not material to a read-only portfolio.                                            |
| 8         | Aesthetic and minimalist design |             4/4 | The system is focused, restrained, and unusually disciplined.                     |
| 9         | Error recovery                  |             4/4 | The 404 is clear, warm, and actionable.                                           |
| 10        | Help and documentation          |             n/a | Interface help is not needed for this public content surface.                     |
| **Total** |                                 | **27/32 (84%)** | **Good**                                                                          |

## Design specificity verdict

The redesign feels authored for Logan rather than category-interchangeable. The
61.5/38.5 desktop portrait split, restrained signal blue, continuous ruled structure,
and separate display, reading, and evidence voices create a coherent professional
identity. Inner routes remain related without copying the homepage composition: About
uses disclosures, Articles uses full-width index rows, article detail becomes a broad
reading surface, and the 404 uses the same signal hierarchy.

The deterministic detector reported one warning: `side-tab` at
`src/src/components/shared/MarkdownContent.test.tsx:197`. This is a false positive;
`border-l-4` appears in a negative regression assertion and is not rendered production
markup. Browser detector injection succeeded in headless tabs, producing grouped
findings on all five routes, but rule-level messages were not captured and the browser
could not be presented as a user-visible overlay. Axe reported a serious contrast
finding for the pale 404 numeral in light/mobile rendering. The numeral is decorative,
duplicated by the adjacent heading, and `aria-hidden`, so this is not a functional
accessibility blocker; its low contrast and tablet composition still deserve visual
judgment.

## Overall impression

This is a convincing redesign with a clear point of view. The homepage is the strongest
expression: it makes Logan feel technically credible and human without resorting to
terminal chrome or portfolio-template cards. Responsive behavior and dark mode are
not afterthoughts. The biggest opportunity is the article journey: the payoff begins
late and ends without a direct path to contact or continue reading.

## What is working

### Authored homepage composition

- **Surface:** Home, both themes and all reviewed widths.
- **Evidence:** The portrait, proposition, résumé-first action order, technology line,
  and proof rail recompose from a desktop split into a stable linear mobile flow.
- **Impact:** A first-time visitor can identify Logan's work and primary action quickly
  while the visual identity remains memorable.
- **Priority:** Preserve.
- **Disposition:** `preserve`.

### Paired light and dark themes

- **Surface:** All public routes.
- **Evidence:** Signal blue, metadata, hairline rules, portrait field, and interactive
  states retain the same hierarchy rather than merely inverting colors.
- **Impact:** The visual system feels intentional in either user preference.
- **Priority:** Preserve.
- **Disposition:** `preserve`.

### Route-specific editorial grammar

- **Surface:** About, Articles, article detail, and 404.
- **Evidence:** Each route uses a composition suited to its content while sharing type,
  color, spacing, focus, and rule treatments. No tested size produced page-level
  overflow, clipped text, runtime errors, focus traps, or reduced-motion failures.
- **Impact:** The site feels cohesive without collapsing into one generic page template.
- **Priority:** Preserve.
- **Disposition:** `preserve`.

## Priority findings

### 1. Article readers reach a dead end

- **Surface:** Article detail and shared footer.
- **Evidence:** **Verified product/UX gap.** Article metadata identifies Logan, but the
  article body ends directly in a footer containing only copyright and optional commit
  metadata. There is no contact or next-reading action.
- **Impact:** This conflicts with the product success criterion that an article reader
  can reach a clear way to contact Logan without leaving the site's flow, and it wastes
  the moment of highest demonstrated expertise.
- **Priority:** P1.
- **Disposition:** `reconsider`.
- **Fix:** Add a quiet end-of-article block with one contact action and one contextual
  continuation such as “More articles.” Preserve the current editorial restraint.
- **Suggested command:** `/impeccable shape`.

### 2. The reading payoff starts too late

- **Surface:** Article detail at phone, tablet, and desktop widths.
- **Evidence:** **Design judgment from rendered measurements.** On a phone, title,
  description, metadata, tags, and the beginning of the table of contents consume the
  opening viewport. Tablet also places the first paragraph near the bottom; desktop
  devotes roughly three quarters of the first viewport to masthead space.
- **Impact:** Readers choose an article and then wait too long to receive its substance,
  making the reading experience feel more ceremonial than useful.
- **Priority:** P2.
- **Disposition:** `reconsider`.
- **Fix:** Tighten mobile/tablet masthead padding and table-of-contents spacing, and
  modestly reduce the smallest title scale while preserving the broad editorial title.
- **Suggested command:** `/impeccable layout`.

### 3. Shared navigation has three small consistency failures

- **Surface:** Compact navigation, article-detail routes, and the wordmark.
- **Evidence:** **Verified implementation gaps.** The compact-menu trigger is 36×36px
  despite the approved 44px target; active state uses exact pathname equality, so an
  article detail does not keep Articles active; and the wordmark lacks the shared
  signal-blue focus treatment.
- **Impact:** The most frequently reused interaction is slightly less forgiving on
  touch, less orienting within articles, and less visually consistent for keyboard
  users than the rest of the redesign.
- **Priority:** P2.
- **Disposition:** `replace`.
- **Fix:** Make the trigger 44×44px, treat article detail as part of the Articles
  section for active state, and apply the shared focus-ring contract to the wordmark.
- **Suggested command:** `/impeccable audit`.

### 4. The primary résumé label contradicts its behavior

- **Surface:** Homepage CTA and shared navigation résumé link.
- **Evidence:** **Verified interaction mismatch.** “View résumé” is rendered on an
  anchor with the `download` attribute; the navigation résumé link also forces a
  download.
- **Impact:** The site's primary conversion action violates user expectation,
  especially on mobile where an unexpected file download is disruptive.
- **Priority:** P2.
- **Disposition:** `replace`.
- **Fix:** Remove `download` from a viewing action and expose download separately, or
  rename the action “Download résumé.”
- **Suggested command:** `/impeccable clarify`.

### 5. The tablet 404 composition collides

- **Surface:** `/404` around the 48rem two-column handoff.
- **Evidence:** **Verified rendered issue.** At approximately 820px, the oversized pale
  numeral and large “Page Not Found” copy overlap rather than forming the clean
  foreground/background relationship seen on phone and wide desktop.
- **Impact:** A carefully resolved error state looks accidental at a common tablet
  width, weakening confidence precisely when the visitor needs reassurance.
- **Priority:** P2.
- **Disposition:** `replace`.
- **Fix:** Delay the two-column handoff or introduce an intermediate type/column
  treatment. Keep the restrained copy and clear Home action.
- **Suggested command:** `/impeccable adapt`.

## Cognitive load

Overall cognitive load is low. Each route has one purpose; sections are well grouped;
disclosures progressively reveal evidence; and the navigation remains small. The one
pressure point is the homepage action area: two named actions plus four icon links
present six simultaneous choices, with email duplicated as both “Contact me” and an
icon. The hierarchy prevents this from becoming a major problem, but one duplicated
contact path could be removed if further distillation is desired.

## Emotional journey

The homepage opens confidently and personally, About deepens trust with structured
proof, and Articles scans efficiently. Article detail then creates a valley by delaying
the first paragraph and ends abruptly after the content. The 404 recovers warmly, but
its intermediate-width composition does not match the finish of its mobile and desktop
states.

## Persona red flags

### Jordan — first-time hiring reader

The role, proof, and contact route are clear within seconds. Jordan's main failure is
the primary “View résumé” action unexpectedly downloading a file. Once reading an
article, Jordan also receives no direct invitation to discuss the work or inspect more
evidence.

### Casey — distracted mobile reader

The hero action order and full-width controls work well, but the 36px menu trigger is
less forgiving than every other principal control. On article detail, Casey must scroll
beyond the opening viewport before reaching the actual prose.

### Sam — keyboard and low-vision reader

Focus order, the skip link, native disclosures, Escape behavior, and reduced motion are
strong. The remaining friction is the wordmark's inconsistent default outline and the
loss of active Articles context on article-detail routes. No keyboard trap was found.

## Minor observations and contract drift

- The approved specs and `DESIGN.md` describe a visible vertical editorial spine on
  About and Articles from 48rem through the footer. Current CSS aligns horizontal rules
  to `--editorial-rule-x` but does not draw that vertical rule. Decide whether this is
  an implementation omission or stale documentation.
- Mobile article metadata can leave separator dots at awkward line endings because its
  pseudo-elements do not know where the flex line wraps.
- `.field-page-deck` and `.field-article-deck` omit the intended Noto Sans family and
  fall back to the generic document stack, creating subtle type-system drift.
- The 404's low-contrast numeral is acceptable as redundant, `aria-hidden` decoration,
  but it should remain visibly intentional rather than disappearing entirely.
- The copy “never committed in the first place” is an effective, restrained personality
  moment worth preserving.

## Questions to consider

- Should an article's final impression convert toward contact, deeper reading, or
  professional proof?
- Is résumé download intentional, or should the primary action honor its “View” label?
- Does the oversized article masthead earn delaying actual content on phones?
- Is the missing vertical spine a code omission or a superseded design decision?

## Validation limitations

- `npm run build`: passed; every public route and machine-readable output prerendered.
- `npm run test`: 253 Vitest tests passed, then the certification test script stopped
  because `tsx` is absent from the local dependency install.
- `npm run lint`: could not resolve types from the absent `@axe-core/playwright`
  package; it also reported the pre-existing raw-button warning in
  `ChevronToggleButton.tsx`.
- `npm run format:check`: was contaminated by Impeccable's temporary live-server
  metadata while browser injection was active; the helper server was stopped before
  handoff.
- No real assistive-technology, forced-colors, physical touch-device, or production
  static-server pass was performed.
