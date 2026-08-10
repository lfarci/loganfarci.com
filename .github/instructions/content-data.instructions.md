---
applyTo: "content/data/**/*.json,src/src/core/data.ts,src/src/core/articles.ts,src/src/types/**/*"
---

# Content Data Access Instructions

Follow `docs/specs/data-contracts.md` and `docs/specs/architecture.md`; they remain
authoritative.

- Keep JSON content, TypeScript types, and data-loading code synchronized.
- Validate required fields and preserve stable identifiers and ordering unless the task
  explicitly changes the content contract.
- Do not place presentation-specific transformations in content data files.
- Treat missing or malformed content as an explicit error path, not a silent fallback.
