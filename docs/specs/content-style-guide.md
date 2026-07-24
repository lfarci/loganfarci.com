---
spec: content-style-guide
version: 0.1.0
status: current-state
---

# Content Style Guide

[Back to the specs index.](./README.md)

Rules for writing articles in `content/articles/*.md`. This spec is a short,
agent-facing summary; the **authoritative, detailed guide** is
[`.github/instructions/articles.instructions.md`](../../.github/instructions/articles.instructions.md).
Read that for the full rationale and the pre-publish checklist. Don't duplicate it —
this page captures the hard rules an agent must not break.

## Voice & structure

- Clear, direct tone for a **technical developer audience**; assume familiarity with
  common tools and concepts.
- Active voice, concise sentences. One article = **one specific problem or concept**
  ("one main takeaway" rule).
- Lead with working, immediately usable code examples; link to official docs instead
  of re-explaining basics.
- Length: **500–1200 words**. Stay within the scope of the title — no tangents.
- **Do not use the `—` (em dash).** Use a comma or period instead.

## Front matter (required)

Every article starts with this YAML block. All fields are required and map 1:1 to the
`Article` type (see [data-contracts.md](./data-contracts.md)):

```yaml
---
title: "Descriptive Title"          # specific, title case, < 60 chars
description: "1-2 sentence summary"  # 120-160 chars, states the concrete value
publishedAt: "YYYY-MM-DD"           # actual publication date
featured: false                      # true only to highlight on the homepage (use sparingly)
tags: ["tag1", "tag2"]              # 2-5 tags; reuse existing tag names
author: "Logan Farci"               # default author
coauthoredWithAgent: false           # true if AI tools significantly contributed
---
```

Notes:
- `slug` is **not** in front matter — it's derived from the filename (`my-post.md` →
  `my-post`). Name files in kebab-case.
- Reuse established tags (common ones: `MCP`, `AI`, `GitHub`, `Copilot`); check
  existing articles before inventing a new tag.
- Set `coauthoredWithAgent: true` when an AI agent materially wrote or researched the
  piece — relevant for content agents authoring articles.

## Agent hard rules (must pass)

- [ ] Front matter present, complete, and valid YAML (all 7 fields).
- [ ] `publishedAt` is `YYYY-MM-DD`; filename is kebab-case.
- [ ] No `—` em dashes anywhere in the body.
- [ ] Title/description are specific and within the length limits above.
- [ ] Body stays on the single topic promised by the title; 500–1200 words.
- [ ] Code examples are functional; images (if any) have alt text.
- [ ] `tags` reuse existing names where possible.

For anything not covered here, defer to
[`articles.instructions.md`](../../.github/instructions/articles.instructions.md). For
how the markdown body is rendered (supported syntax, headings, code, Mermaid), see
[markdown-rendering.md](./markdown-rendering.md).
