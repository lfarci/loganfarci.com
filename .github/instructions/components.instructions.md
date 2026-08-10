---
applyTo: "src/src/components/**/*"
---

# Frontend Component Instructions

When working in `src/src/components/`:

- Follow `docs/specs/architecture.md`, `quality-bars.md`, and `accessibility.md` for
  shared requirements; keep this file limited to component-local conventions.
- Prefer functional React components and hooks.
- Prefer explicit imports over broad React namespace imports; import only the hooks and types you use.
- Use the local shadcn-style Radix primitives and semantic Tailwind tokens for UI consistency.
- Keep components small and focused; extract smaller reusable components when it improves clarity.
