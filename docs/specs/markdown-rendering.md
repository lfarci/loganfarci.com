---
spec: markdown-rendering
version: 0.3.0
status: current-state
---

# Markdown Rendering

[Back to the specs index.](./README.md)

How markdown is turned into HTML on the site. This governs **article bodies**
(`content/articles/*.md`) and any other markdown the site renders. For how to *author*
articles (front matter, tone, structure), see
[content-style-guide.md](./content-style-guide.md); this spec covers what the renderer
supports and how each element looks.

## The renderer

All markdown flows through one component:
[`src/src/components/shared/MarkdownContent.tsx`](../../src/src/components/shared/MarkdownContent.tsx).
It uses [`react-markdown`](https://github.com/remarkjs/react-markdown) with
[`remark-gfm`](https://github.com/remarkjs/remark-gfm), and maps every element to the
site's typography components and Tailwind semantic tokens. Article pages also enable a
small local remark transform that derives heading metadata from the same syntax tree;
it does not create a second Markdown parser or rendering path.

Used by the article page ([`ArticlePage.tsx`](../../src/src/pages/ArticlePage.tsx)),
the about page profile text, and `MarkdownSection` / `MarkdownPreview`. There is one
renderer — new markdown surfaces MUST reuse `MarkdownContent`, not a second pipeline.

The article body is loaded and parsed as described in
[architecture.md](./architecture.md#content-pipeline); this spec picks up at the render
step.

## Supported syntax (GitHub Flavored Markdown)

`remark-gfm` enables standard CommonMark plus GFM extensions:

- Headings, paragraphs, **bold**, _italic_, blockquotes, horizontal rules.
- Ordered, unordered, and task lists.
- Links and autolinks.
- Tables.
- Strikethrough.
- Inline code and fenced code blocks (including Mermaid, below).
- Callouts using the blockquote markers `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`,
  `[!WARNING]`, and `[!CAUTION]`.

**Raw HTML is not rendered.** There is no `rehype-raw` in the pipeline, so HTML tags in
markdown are treated as text and escaped. Authors MUST express content with
markdown/GFM, not embedded HTML.

## Element mapping

Every element is overridden in `createMarkdownComponents` — plain markdown never renders
as unstyled default HTML:

| Markdown | Renders as | Notes |
| --- | --- | --- |
| `#` and `##` | `Heading2` | Both map to `Heading2`. The article **title** comes from front matter, so a body heading MUST NOT try to be the page `h1`; start body headings at `##`. Article headings receive a stable ID and permalink. |
| `###` / `####` | `Heading3` / `Heading4` | Article headings receive the same ID and permalink treatment. |
| Paragraph | `Text` | Constrained to a readable width when `measure` is set. |
| Lists / items | `UnorderedList` / `OrderedList` / `ListItem` | |
| Ordinary `>` blockquote | Styled blockquote | Left border + `primary-light` background, italic. |
| Supported callout blockquote | Labeled callout | Compact label, decorative icon, semantic accent, and normal article typography. |
| Link | `NewTabLink` | **All links open in a new tab** with safe `rel`. |
| Inline/fenced code | `CodeSnippet` | See below. |
| Table (GFM) | Styled `table` | Bordered, rounded, `surface` background. |
| `---` rule / `**`/`_` | `hr` / `Strong` / `Emphasis` | |

## Callouts

Callouts use GitHub-compatible blockquote markers. The marker MUST be the first content
in a top-level blockquote, use one of the five supported uppercase values, and appear
on its own line:

```markdown
> [!NOTE]
> Useful context that is worth noticing while skimming.
```

The renderer removes the marker and adds the visible label **Note**, **Tip**,
**Important**, **Warning**, or **Caution** before the body. The body continues through
the shared Markdown element mapping, so multiple paragraphs, emphasis, links, inline
code, and lists retain their normal semantics.

Ordinary quotations keep the existing italic blockquote treatment. Unsupported markers
such as `[!ALERT]`, lowercase or malformed markers, markers with body text on the same
line, markers later in a quote, and nested callout attempts remain ordinary blockquote
content. Their marker text is intentionally preserved rather than silently discarded.
Nested callouts are not supported.

Callouts are static prose. They do not use `role="alert"`, live-region semantics, or
interactive behavior. A visible text label occurs before the body in reading order,
icons are decorative and hidden from assistive technology, and variant identity never
depends on color alone. The body uses normal article typography rather than quotation
italics. Its constrained grid and overflow wrapping preserve `MarkdownContent`'s
`measure` behavior at narrow widths and high zoom.

Each callout uses a narrowly scoped semantic accent, tinted surface, strong colored
edge, and solid icon tile inside a neutral outline. The flat, editorial treatment
avoids card-like elevation so the article prose remains primary. It also makes the
variants easier to scan in light mode while the visible sentence-case label and
distinct icon preserve meaning without color. Contrast checks for the accent against
its corresponding surface are:

| Variant | Light theme | Dark theme |
| --- | ---: | ---: |
| Note | 6.00:1 | 7.16:1 |
| Tip | 6.99:1 | 8.03:1 |
| Important | 6.48:1 | 8.39:1 |
| Warning | 6.73:1 | 8.47:1 |
| Caution | 6.17:1 | 5.91:1 |

These values exceed the 4.5:1 text requirement and the 3:1 meaningful graphical-object
requirement in both themes. Body text continues to use the site's existing semantic
text tokens. Icon glyphs use the document background token against the solid accent,
producing 6.52–7.39:1 contrast in light mode and 7.17–10.56:1 in dark mode.

During local development, `/_dev/markdown-callouts` renders all variants and fallback
states through `MarkdownContent` for visual review. The route is development-only: it
is absent from the production route table, static route list, prerendered output,
sitemap, and machine-readable text files.

## Article heading navigation

`ArticlePage` enables article navigation on `MarkdownContent`. During the existing
remark pass, eligible body headings (`#` through `####`, rendered as `h2` through `h4`)
are assigned deterministic URL-safe IDs. Visible text from inline emphasis, code,
links, and images contributes to the slug and accessible label. Repeated or otherwise
colliding slugs receive stable numeric suffixes (`section`, `section-2`, and so on).

Each eligible heading includes a same-page permalink:

- Its `href` targets the heading ID.
- Its accessible name includes the visible heading text; the link icon is decorative.
- At wide desktop article widths, it sits to the left of the heading and is revealed
  on heading hover or keyboard focus. Narrower layouts omit the icon.
- It is keyboard reachable with a visible focus state and a touch-sized target.
- The heading uses a scroll margin so fragment navigation clears the sticky site
  header.

When an article contains at least three eligible headings, the same transform injects a
table of contents generated from those IDs. Heading levels remain nested in the link
structure. The ToC is an always-visible navigation landmark titled “In this article.”
At mobile widths, it sits between the article metadata and body with a single lower
divider and shows top-level section links. On desktop, it becomes a sticky side rail
and reveals the complete nested heading hierarchy. The section in the upper reading
region is exposed as the current location with `aria-current` and emphasized through
neutral font weight without decorative indicator chrome. Reaching the end of the
article marks the final section current even when there is not enough trailing content
for its heading to enter the upper reading region.

IDs, permalinks, and ToC links are all emitted during SSR/prerender and therefore exist
before hydration.

## Code blocks and Mermaid

[`CodeSnippet.tsx`](../../src/src/components/shared/CodeSnippet.tsx) decides how code
renders:

- **Inline code** (no language class, no newline) renders as a small inline `<code>`.
- **Fenced blocks** render in a scrollable `<pre>`; the ```` ```lang ```` info string
  becomes the `language-*` class on the `<code>`.
- A ```` ```mermaid ```` block renders as a diagram via
  [`MermaidDiagram.tsx`](../../src/src/components/shared/MermaidDiagram.tsx).

**Mermaid SSR caveat:** `MermaidDiagram` runs `mermaid.run()` inside a `useEffect`, so
diagrams render **client-side only** — they are not drawn during the prerender step and
appear after hydration. Mermaid is initialized with `securityLevel: "strict"`. Because
`mermaid` is the heaviest client dependency (see
[quality-bars.md](./quality-bars.md#performance)), use Mermaid only where a diagram adds
real value.

There is no syntax-highlighting library: fenced code keeps its `language-*` class but is
not tokenized. Do not add a highlighter without cause (see
[non-goals.md](./non-goals.md)).

## Ideal state (planned)

The following are **targets**, not current behavior — they describe the reading
experience article rendering should grow toward, guided by
[vision.md](./vision.md). Keep the simplicity and don't-reinvent-the-wheel principles:
prefer a small, well-established remark/rehype plugin or a lightweight component over a
bespoke system, and only add weight where it earns its place.

- **Code blocks.** Per-language **syntax highlighting**, a **copy-to-clipboard** button,
  and an optional filename/caption. Line highlighting is a nice-to-have. Highlighting
  SHOULD happen at build time where possible so it costs nothing on the client.
- **Lists.** Nested ordered/unordered lists render cleanly, and GFM **task lists**
  render as (non-interactive) checkboxes.
- **Images / pictures.** Responsive images (correct `width`/`height` to avoid layout
  shift, AVIF, `loading="lazy"`), an optional **caption** via `figure`/`figcaption`,
  and optionally click-to-zoom. `alt` stays required (see
  [quality-bars.md](./quality-bars.md#accessibility--target-wcag-21-aa)).
- **Mermaid diagrams.** Ideally rendered at **build time** (during prerender) so
  diagrams appear without JavaScript and are indexable, with a graceful fallback —
  replacing today's client-only render.
- **Footnotes.** GFM footnotes with back-references for citations and asides.
- **Tables.** Remain readable on small screens (horizontal scroll or responsive
  treatment) without breaking layout.
- Consistent, accessible focus/hover states across all rendered elements.

Math typesetting (KaTeX/MathJax) and rich third-party embeds (video, social) are
**not** planned by default — they add weight and pull toward raw HTML, which this
pipeline deliberately avoids. Revisit only if a concrete article need justifies it.

## Rules for agents

- **MUST** reuse `MarkdownContent` for any new markdown surface; do not add a second
  markdown pipeline.
- Article heading IDs and table-of-contents links **MUST** be derived from the same
  parsed syntax tree and remain present in prerendered HTML.
- **MUST NOT** rely on raw HTML in markdown — it will not render.
- Callout authors **MUST** put an exact supported marker first in a top-level
  blockquote and on its own line; use an ordinary blockquote for quotations.
- Body headings **SHOULD** start at `##` (the `h1` is the front-matter title).
- Mermaid diagrams **MUST** use a fenced ```` ```mermaid ```` block and **SHOULD** stay
  lightweight, remembering they render only on the client.
- To style or support a new element, extend the component map in `MarkdownContent.tsx`
  and reuse the existing typography components and semantic tokens — **do not** add
  `rehype-raw` or a new remark/rehype plugin without a stated reason.
