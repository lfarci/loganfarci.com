---
spec: markdown-rendering
version: 0.1.0
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
It uses [`react-markdown`](https://github.com/remarkjs/react-markdown) with the single
remark plugin [`remark-gfm`](https://github.com/remarkjs/remark-gfm), and maps every
element to the site's typography components and Tailwind semantic tokens.

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

**Raw HTML is not rendered.** There is no `rehype-raw` in the pipeline, so HTML tags in
markdown are treated as text and escaped. Authors MUST express content with
markdown/GFM, not embedded HTML.

## Element mapping

Every element is overridden in `createMarkdownComponents` — plain markdown never renders
as unstyled default HTML:

| Markdown | Renders as | Notes |
| --- | --- | --- |
| `#` and `##` | `Heading2` | Both map to `Heading2`. The article **title** comes from front matter, so a body heading MUST NOT try to be the page `h1`; start body headings at `##`. |
| `###` / `####` | `Heading3` / `Heading4` | |
| Paragraph | `Text` | Constrained to a readable width when `measure` is set. |
| Lists / items | `UnorderedList` / `OrderedList` / `ListItem` | |
| `>` blockquote | Styled blockquote | Left border + `primary-light` background, italic. |
| Link | `NewTabLink` | **All links open in a new tab** with safe `rel`. |
| Inline/fenced code | `CodeSnippet` | See below. |
| Table (GFM) | Styled `table` | Bordered, rounded, `surface` background. |
| `---` rule / `**`/`_` | `hr` / `Strong` / `Emphasis` | |

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

## Rules for agents

- **MUST** reuse `MarkdownContent` for any new markdown surface; do not add a second
  markdown pipeline.
- **MUST NOT** rely on raw HTML in markdown — it will not render.
- Body headings **SHOULD** start at `##` (the `h1` is the front-matter title).
- Mermaid diagrams **MUST** use a fenced ```` ```mermaid ```` block and **SHOULD** stay
  lightweight, remembering they render only on the client.
- To style or support a new element, extend the component map in `MarkdownContent.tsx`
  and reuse the existing typography components and semantic tokens — **do not** add
  `rehype-raw` or a new remark/rehype plugin without a stated reason.
