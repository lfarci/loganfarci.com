---
applyTo: "src/src/pages/**/*,src/src/routes.tsx,src/src/App.tsx,src/src/entry-server.tsx,src/src/main.tsx"
---

# React Pages, Routes, and SSR Instructions

Follow `docs/specs/architecture.md`, `quality-bars.md`, `testing.md`, and
`accessibility.md`; they remain authoritative.

- Keep route definitions, client entry, server entry, and prerendered routes aligned.
- Preserve route-level loading, error, metadata, and not-found behavior when changing a
  page or route.
- Use existing shared components and semantic Tailwind tokens rather than duplicating
  layout or interaction patterns.
- Add or update route-level tests when observable routing behavior changes.
