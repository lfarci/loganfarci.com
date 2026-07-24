# Repository Specs

Source of truth for **loganfarci.com** — a Vite + React + TypeScript personal
website, SSR-prerendered, styled with Tailwind, deployed to Azure Static Web Apps
via Terraform.

These specs are the canonical, agent-referenceable description of what this project
is and the bar it holds. They are intended to ground automated workflows (PR
reviewers, discover → fix → review pipelines, content agents). They are **short by
design** and link to existing docs and code rather than duplicating them.

## The specs

| Spec | Purpose |
| --- | --- |
| [architecture.md](./architecture.md) | Routes and page responsibilities, SSR + prerender contract, and the content pipeline. |
| [quality-bars.md](./quality-bars.md) | The rubric a reviewer agent checks against: accessibility, performance, TS strictness, testing, linting. |
| [data-contracts.md](./data-contracts.md) | Shape and required fields of each `content/data/*.json` file, mirroring `src/src/types/`. |
| [content-style-guide.md](./content-style-guide.md) | Tone, structure, and front-matter rules for articles. Extends the article instructions. |
| [non-goals.md](./non-goals.md) | What the site is explicitly **not**, to keep automated proposals in scope. |

## Canonical sources these specs build on

Specs link to — and must stay consistent with — these existing documents:

- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) — project overview, workflows, conventions.
- [`.github/instructions/articles.instructions.md`](../../.github/instructions/articles.instructions.md) — article content guidelines and front matter.
- [`.github/instructions/components.instructions.md`](../../.github/instructions/components.instructions.md) — component conventions.
- [`.github/instructions/issues.instructions.md`](../../.github/instructions/issues.instructions.md) — issue-management conventions.
- [`README.md`](../../README.md) — onboarding, prerequisites, tech stack.
- [`docs/analytics.md`](../analytics.md) — Application Insights setup and cost guardrails.
- `src/src/types/` — TypeScript types that define every data contract.

## Conventions for maintaining these specs

- Keep each spec short and skimmable. Prefer a link over a copy.
- Verify every claim against the code (routes, types, scripts). Do not invent.
- When you find drift between a spec and the code, fix the spec (or the code) and
  note it — don't leave both.
