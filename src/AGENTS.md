# Application guidance

This directory is the Vite project root. Run all npm commands here. Follow the
repository-level `AGENTS.md` and the canonical requirements in `docs/specs/`.

## Implementation

- Use TypeScript and functional React 19 components with hooks.
- Import only the React hooks and types that are used; JSX does not require a
  default React import.
- Use the `@/` alias for `src/src/` and `@content/` for repository content.
- Keep core content build-time only. Use the existing Vite content pipeline
  rather than runtime filesystem access or client-side fetching.
- Register pages and static routes through `src/routes.tsx`. Preserve the
  SSR/prerender contract described in `docs/specs/architecture.md`.
- Render page title, description, canonical URL, Open Graph data, and structured
  data consistently with nearby pages and `src/core/seo.ts`.

## UI and accessibility

- Prefer local primitives in `src/components/shared/primitives/`.
- Style with Tailwind and semantic tokens from the existing theme. Do not add raw
  hardcoded colors, inline styles, or another component/CSS framework.
- Preserve visible focus, keyboard behavior, semantic HTML, accessible names,
  contrast, reduced-motion behavior, and touch-target requirements.
- Reuse established layout, typography, motion, icon, and breakpoint helpers
  before creating new abstractions.

## Tests

- Colocate Vitest files as `*.test.ts` or `*.test.tsx`.
- Changes to `src/core/`, content accessors, or data contracts must add or update
  tests.
- Test observable behavior and query components by role and accessible name.
- Keep tests deterministic and offline; mock content at module boundaries.

Before handing off an application change, run the relevant subset of:

```bash
npm run lint
npm run test
npm run build
npm run format:check
```
