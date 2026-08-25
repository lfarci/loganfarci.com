---
applyTo: "src/src/components/**/*"
---

# Frontend Component Instructions

When working in `src/src/components/`:

- Follow `docs/specs/architecture.md`, `quality-bars.md`, and `accessibility.md` for
  shared requirements; keep this file limited to component-local conventions.
- See the [`react-app` skill](../skills/react-app/SKILL.md) for the complete React
  implementation conventions and examples.
- Prefer functional React components and hooks.
- Prefer explicit imports over broad React namespace imports; import only the hooks and types you use.
- Keep rendering SSR-safe: do not access browser-only APIs such as `window`, `document`,
  or `localStorage` at module scope or during render; use `useEffect` for browser-only
  side effects.
- Use the local shadcn-style Radix primitives for UI consistency.
- Use semantic color tokens from `src/tailwind.config.ts` (for example,
  `text-text-primary`, `bg-surface`, and `border-border`) instead of raw Tailwind
  palette colors so contrast remains correct in both themes.
- Keep interactive elements keyboard-operable with visible focus states, and provide an
  accessible name with `aria-label` or `sr-only` text when no visual label exists.
- Keep components small and focused; extract smaller reusable components when it improves clarity.
