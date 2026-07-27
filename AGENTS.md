# Repository guidance

## Project

This repository contains `loganfarci.com`, a Vite, React 19, and TypeScript
personal website. The site is prerendered to static HTML and deployed to Azure
Static Web Apps. Terraform under `infra/` owns the Azure infrastructure.

The specifications in `docs/specs/` are the source of truth. Read the spec that
matches the task before changing code or content:

- Architecture, routing, SSR, or prerendering: `docs/specs/architecture.md`
- Shipping and review requirements: `docs/specs/quality-bars.md`
- Tests and deployment checks: `docs/specs/testing.md`
- Accessibility: `docs/specs/accessibility.md`
- Structured JSON data: `docs/specs/data-contracts.md`
- Articles and Markdown: `docs/specs/content-style-guide.md` and
  `docs/specs/markdown-rendering.md`
- New product proposals: `docs/specs/non-goals.md` and `docs/specs/vision.md`

When guidance conflicts, follow the precedence documented in
`docs/specs/README.md`. In particular, non-goals are hard scope boundaries and
current code is authoritative for current-state facts.

## Repository layout

- `src/`: Vite application and all npm commands
- `content/`: build-time Markdown articles and JSON data
- `infra/`: Terraform for Azure resources
- `docs/specs/`: canonical product and engineering requirements
- `.github/workflows/`: CI, deployment, and agentic workflows

More-specific `AGENTS.md` files under `src/` and `content/` add scoped guidance.

## Working conventions

- Inspect nearby code and the relevant spec before editing.
- Make the smallest change that fully satisfies the request.
- Do not introduce a runtime server, database, authentication, CMS, alternate
  framework, or heavy dependency without an explicit architectural decision.
- Do not edit generated output such as `src/dist/`.
- Preserve unrelated working-tree changes.
- Keep documentation consistent with code. If a current-state spec has drifted,
  update it with the implementation and call out the drift.
- Never hardcode credentials, deployment tokens, cloud resource names, or
  environment-specific identifiers.

## Verification

Run application commands from `src/`:

```bash
npm run lint
npm run test
npm run build
npm run format:check
```

Choose checks proportionate to the change, but run the full build for changes to
application code, routes, content loading, SSR, or prerendering. Core logic and
data-contract changes require colocated tests. For deployed-environment
validation, run `npm run smoke -- <base-url>`.

For GitHub Agentic Workflow changes, edit the Markdown source and regenerate its
lock file:

```bash
gh aw compile
gh aw compile --validate
```

Report the checks run and any checks that could not be run.
