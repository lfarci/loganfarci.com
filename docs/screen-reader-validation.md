# Screen-reader validation

The project's automated axe checks (see [accessibility](./specs/accessibility.md) and
the `axe.spec.ts` acceptance suite) catch serious and critical violations, but many
accessibility requirements — landmarks, heading order, navigation behavior, focus
order, and how screen readers announce interactive elements — still need **manual,
repeatable screen-reader passes**. This guide is the concise, repeatable procedure for
the **home**, **about**, and **article-reading** flows. Detailed guidance lives in the
[accessibility specification](./specs/accessibility.md); this file does not duplicate
it.

## Tested combination

- **Screen reader:** NVDA
- **Browser:** Firefox (latest)
- **Site:** production build served by the Azure Static Web Apps emulator (`swa start dist`)

Rerun this pass after any material UI change by following the
[result template](#result-template) and recording the same combination above unless
the tooling changed.

## Prerequisites

From `src/`, build the site and serve it through the SWA emulator so deep links such as
`/about` serve the prerendered HTML (Vite preview's fallback can cause hydration
mismatches):

```sh
npm run build
npm run preview:swa
```

Open `http://127.0.0.1:4280` in Firefox with NVDA running.

## Procedure

For each of the three flows below, complete every step with NVDA active and the virtual
cursor (Browse mode) on.

### Home (`/`)

1. **Skip link.** Press `Tab` from the top of the page. Confirm the "Skip to content"
   link is announced first, activates with `Enter`, and moves focus to `main`.
2. **Landmarks and structure.** Press `D` to move between landmarks. Confirm NVDA
   announces the banner, navigation, main, and contentinfo landmarks in reading order.
   With the Navigation Landmark list (NVDA+`F7`), confirm the page exposes a single
   main landmark.
3. **Headings.** Open the Elements List (NVDA+`F7` → Headings). Confirm a single `H1`
   ("Hi, I'm Logan" or equivalent intro) and a logical, non-skipping `H2` outline for
   "About Me", "What I Do", "My Certifications", and "Featured Articles".
4. **Navigation.** Use the Links list to confirm the primary navigation links (Home,
   About, Articles) and the four contact links (LinkedIn, GitHub, Bluesky, email) all
   have clear, unique accessible names.
5. **Keyboard flow.** Tab through the page. Confirm focus lands on each link and button
   with a visible focus indicator, in reading order, with no trap.

### About (`/about`)

6. **Headings.** Open the Headings list. Confirm one `H1` ("About Me") and a logical
   `H2` outline for "Experience", "Education", "Certifications", and "Skills".
7. **Images.** Navigate to the author portrait. Confirm it is announced with its
   alternative text ("Picture of the author: Logan Farci").
8. **Focus order.** Tab from top to bottom and confirm focus follows the visible reading
   order, including any navigation into the skills section.
9. **Navigation to a section.** Use the Headings list (or keyboard) to jump into the
   "Skills" `H2`, and confirm the page announces the heading in context.

### Article-reading (`/articles` and one article)

10. **Article listing.** From `/articles`, confirm the heading structure (`H1`
    "Articles", `H2` per article card) and that each article link name matches the
    visible article title.
11. **Open an article.** Activate the first article link. Confirm the page announces the
    article `H1`, the "In this article" navigation landmark, and the article body.
12. **Landmarks.** With `D`, confirm the article exposes banner, navigation, main,
    contentinfo, and the "In this article" navigation landmarks.
13. **Table of contents.** Use the "In this article" link list to jump to a section.
    Confirm the destination heading is announced and focus/hash updates correctly.
14. **Focus order (mobile article).** Use the "Back to top" link and confirm focus
    returns to `#main-content`.

## Read: verify accessible names on interactive elements

During the keyboard and links passes above, confirm every icon-only control is
announced by its accessible name rather than "unlabeled" or "graphic":
theme toggle, mobile menu toggle, and any icon-only links. Decorative icons must be
skipped entirely.

## Result template

Copy this template into the issue or PR that introduces a material UI change. Record
the [tested combination](#tested-combination) and the date.

```md
### Screen-reader validation

**Date:** YYYY-MM-DD
**Screen reader:** NVDA
**Browser:** Firefox (latest)
**Build:** [commit or version]

| Flow            | Landmarks | Headings | Navigation | Focus order | Accessible names | Result |
| --------------- | --------- | -------- | ---------- | ----------- | ---------------- | ------ |
| Home            | ✅        | ✅       | ✅         | ✅          | ✅               | Pass   |
| About           | ✅        | ✅       | ✅         | ✅          | ✅               | Pass   |
| Article-reading | ✅        | ✅       | ✅         | ✅          | ✅               | Pass   |

**Passing criteria:** every cell above is ✅ with no observed violations, no unlabeled
controls, and no keyboard traps. Any ❌ requires a fix before the change ships.
```
