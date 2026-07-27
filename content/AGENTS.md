# Content guidance

Content is resolved during the Vite build and shipped as static output. Do not
introduce a CMS, database, runtime API, or client-side fetch for core content.
Follow the root `AGENTS.md` and the specifications under `docs/specs/`.

## Articles

For `articles/*.md`, follow `docs/specs/content-style-guide.md` and
`docs/specs/markdown-rendering.md`.

- Write for a technical audience in a clear, direct, focused style.
- Keep one main takeaway and prefer practical, verified examples.
- Use complete front matter matching the existing article schema.
- Use `Logan Farci` as the default author.
- Set `coauthoredWithAgent` accurately when an agent contributed materially.
- Reuse established tags and verify internal and external links.
- Prefer official technical sources and do not invent quotations or claims.
- Avoid em dashes in article prose; prefer commas, periods, or parentheses.

## Structured data

For `data/*.json`, follow `docs/specs/data-contracts.md` and the corresponding
types in `src/src/types/`.

- Preserve the documented shape, required fields, ordering conventions, and
  referential integrity.
- Keep referenced image and icon paths valid.
- When changing a shape, update the TypeScript type, accessor, documentation, and
  tests together.

## Verification

Run checks from `src/`. Content changes that affect routes or rendering should pass:

```bash
npm run test
npm run build
npm run format:check
```
