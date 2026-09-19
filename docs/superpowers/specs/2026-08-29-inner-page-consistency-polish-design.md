# Inner-page consistency polish

## Context

The Field Notes homepage is approved and remains unchanged. About, Articles, article detail, the shared inner-page shell, and 404 already use the same semantic colors, fonts, and ruled editorial language, but their spacing, typographic hierarchy, navigation states, and information density do not yet feel as resolved or consistent as the homepage.

This pass is refinement, not another redesign. It preserves content, routes, SEO, prerendering, accessibility behavior, and the established Field Notes direction.

## Decision

Apply a systematic consistency pass across every non-home route. Use the homepage as the source of truth for identity, interaction feedback, typographic confidence, and rule treatment while preserving reading-oriented compositions on inner pages.

The work will not copy the homepage split layout onto other routes. It will make the shared visual grammar unmistakable through aligned navigation, active states, editorial insets, type roles, metadata, rules, icons, and responsive rhythm.

## Scope

### Shared navigation and footer

- Match the homepage wordmark, navigation typography, signal-blue active state, underline treatment, focus ring, and control sizing.
- Keep the accessible mobile menu, Escape behavior, resize behavior, résumé download, and theme preference intact.
- Normalize header and footer insets with the inner-page editorial grid.
- Keep the shell visually quiet so content remains primary.

### About

- Preserve the portrait, profile narrative, professional evidence, and native disclosure structure.
- Tighten the oversized gaps between the introduction and evidence sections.
- Increase the legibility and confidence of body text and metadata where the current layout reads too small or faint.
- Align section labels, disclosure rows, logos, and content columns to a stable desktop grid.
- Preserve a direct, single-column mobile reading flow with 44px interaction targets and no horizontal overflow.
- Keep priority visible: current experience, high-relevance certifications, and the primary skill group remain easiest to find.

### Articles index

- Preserve the ruled index and avoid returning to card-based presentation.
- Remove decorative numbering and eyebrow text that do not carry information.
- Normalize title, description, tag, date, and arrow alignment across different content lengths.
- Improve hover and focus feedback without making the whole non-link row appear interactive.
- Balance row density so the index scans quickly on desktop and remains readable on mobile.

### Article detail

- Preserve article content, Markdown behavior, table of contents, callouts, code controls, and back-to-top behavior.
- Remove decorative eyebrow text and cap masthead scale so it supports rather than overwhelms the reading experience.
- Align the back link, title, description, metadata, article body, and table of contents to one editorial grid.
- Keep body measure within a readable range and maintain safe wrapping for inline and block code.
- Normalize light and dark theme contrast, rules, focus states, and metadata treatment.

### 404

- Preserve the clear recovery action and oversized error code.
- Remove decorative eyebrow text and align the message, code, and action to the same inner-page grid.
- Keep the surface concise and responsive rather than adding new content or illustration.

## Implementation boundaries

- Change only inner-page components, shared inner-page layout components, their tests, and the relevant Field Notes styles.
- Do not change the homepage component or homepage-specific styles.
- Do not add dependencies, routes, factual claims, content records, or new visual assets.
- Prefer semantic tokens, existing primitives, native HTML disclosure behavior, and authored SVG icons.
- Avoid new reusable abstractions unless at least two inner-page surfaces genuinely share the behavior.

## Responsive behavior

- Review mobile at 390px, an intermediate width around 768px, and desktop at 1440px.
- Mobile must recompose rather than merely shrink the desktop grid.
- Body text remains at least 14px, interactive targets remain at least 44px, and no route introduces page-level horizontal scrolling.
- Desktop keeps asymmetric editorial insets and the quiet guide rule without creating large empty fields that weaken the content.

## Accessibility and interaction

- Preserve semantic landmarks, heading order, link names, native details/summary behavior, logical tab order, and visible focus indicators.
- Maintain `aria-current` on active navigation and consistent active-state contrast in both themes.
- Keep reduced-motion handling for all hover and disclosure transitions.
- Preserve tested keyboard navigation, client-side routing, history behavior, theme persistence, and mobile-menu dismissal.

## Verification

- Inspect About, Articles, a representative article, and 404 together at mobile, intermediate, and desktop widths.
- Inspect at least one representative inner page in dark mode.
- Run the Impeccable detector once after UI edits, fix its mechanical findings, and do not loop it.
- Run formatting, lint, unit tests, the complete Playwright suite, production build/prerender, and Lighthouse accessibility.
- Obtain a final independent finish review and reconcile `DESIGN.md` only if the implementation changes durable system guidance.

## Acceptance criteria

- The homepage is unchanged.
- All inner pages visibly belong to the same Field Notes system without sharing one generic stacked template.
- Navigation, active states, type roles, rules, spacing, metadata, icons, and interaction feedback are consistent across routes.
- About is easier to read and less vertically loose while preserving all evidence.
- Articles scans more cleanly without decorative sequence numbers or cards.
- Article mastheads and reading columns feel balanced at every supported width.
- The 404 feels intentional and related without unnecessary decoration.
- No existing functional, SEO, prerender, responsive, theme, or accessibility test regresses.
