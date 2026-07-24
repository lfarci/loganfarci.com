# Quality Bars

The rubric a reviewer agent checks a change against. These describe the project's
**current-state** bar, not aspirational goals — a change should not regress them.
All commands run from `src/`.

## Accessibility — target WCAG 2.1 AA

- Use semantic HTML and the local shadcn-style **Radix** primitives; do not
  reimplement interactive behavior (tooltips, separators, etc.) by hand.
- Every image must have meaningful `alt` text. The `Image` type requires `alt`, and
  `content/data/*.json` image objects provide it — keep it descriptive, not empty.
- Headings follow a logical order (one `h1` per page; see the typography components).
- Interactive elements must be keyboard-reachable and have a visible focus state.
- Color/contrast comes from the Tailwind semantic tokens — use tokens, don't hardcode
  colors that break contrast.

## Performance

- Pages are **static prerendered HTML** (see [architecture.md](./architecture.md)),
  so first paint does not wait on client data fetching for core content. Keep it that
  way — no client-side fetch for content that can be prerendered.
- Images are **AVIF** and sized (`width`/`height` set) to avoid layout shift. Prefer
  AVIF and correct dimensions for any new image.
- Keep the client bundle lean. `mermaid` is the heaviest dependency; load
  diagram-heavy code only where needed and avoid adding large dependencies without
  cause (see [non-goals.md](./non-goals.md)).
- Target: fast LCP on the static routes; no unnecessary blocking scripts.

## TypeScript strictness

Enforced by [`src/tsconfig.json`](../../src/tsconfig.json):

- `strict: true`, `isolatedModules: true`, `resolveJsonModule: true`.
- No implicit `any`; type new data against `src/src/types/`.
- Use the `@/` and `@content/` path aliases rather than long relative paths.

## Testing

- Runner: **vitest**. `npm run test` (CI), `npm run test:watch`, `npm run test:coverage`.
- Tests are colocated with the code as `*.test.ts` / `*.test.tsx` (e.g.
  `core/articles.test.ts`, `core/data.test.ts`).
- Add or update tests when you change core logic (`src/src/core/`) or a data contract.
- New tests use Testing Library + jsdom (already configured).

## Linting & formatting

- `npm run lint` — ESLint 9 + `typescript-eslint`, with `eslint-config-prettier`
  (config: [`src/eslint.config.mjs`](../../src/eslint.config.mjs)).
- Formatting via Prettier (`.prettierrc`). Do not hand-fight the formatter.
- A change should pass `npm run lint` and `npm run build` cleanly before it's
  considered done.

## Component conventions

From [`.github/instructions/components.instructions.md`](../../.github/instructions/components.instructions.md):

- Prefer functional components and hooks; import only the hooks/types you use.
- Use the local Radix primitives and semantic Tailwind tokens.
- Keep components small and focused; extract reusable pieces when it improves clarity.

## Reviewer checklist (quick)

- [ ] `npm run lint` passes.
- [ ] `npm run build` succeeds (client + SSR + prerender).
- [ ] `npm run test` passes; new/changed core logic has tests.
- [ ] Images have alt text and dimensions; new images are AVIF.
- [ ] No new client-side fetching for prerenderable content.
- [ ] Types added/updated in `src/src/types/`; no implicit `any`.
- [ ] Change stays within scope ([non-goals.md](./non-goals.md)).
