---
spec: loganfarci.com repository specs
version: 0.2.0
status: index
---

# Repository Specs

Source of truth for **loganfarci.com** — a Vite + React + TypeScript personal
website, SSR-prerendered, styled with Tailwind, deployed to Azure Static Web Apps
via Terraform.

These specs are the canonical, agent-referenceable description of what this project
is and the bar it holds. They are intended to ground automated workflows (PR
reviewers, discover → fix → review pipelines, content agents). They are **short by
design** and link to existing docs and code rather than duplicating them.

Most specs describe the **current state** of the site. [vision.md](./vision.md) is
the exception: it captures the north star and planned direction, since the site is
still a work in progress.

## The specs

| Spec | Purpose |
| --- | --- |
| [vision.md](./vision.md) | The north star: core principles, planned sections, accessibility/SEO ambitions, and the target sitemap. |
| [architecture.md](./architecture.md) | Routes and page responsibilities, SSR + prerender contract, and the content pipeline. |
| [quality-bars.md](./quality-bars.md) | The rubric a reviewer agent checks against: accessibility, performance, TS strictness, testing, linting. |
| [linting.md](./linting.md) | The linter as a guardrail: toolchain, fast local + CI runs, and how to add custom rules that enforce the other specs. |
| [accessibility.md](./accessibility.md) | The detailed accessibility contract: current baseline, requirements, themes/contrast, machine-readability, and ideal state. |
| [i18n.md](./i18n.md) | Multilanguage plan: locale scheme, per-locale prerendering, content/string translation, and SEO (`hreflang`). |
| [data-contracts.md](./data-contracts.md) | Shape and required fields of each `content/data/*.json` file, mirroring `src/src/types/`. |
| [content-style-guide.md](./content-style-guide.md) | Tone, structure, and front-matter rules for articles. Extends the article instructions. |
| [markdown-rendering.md](./markdown-rendering.md) | How article/markdown content is rendered: supported GFM syntax, element mapping, code blocks, and Mermaid. |
| [non-goals.md](./non-goals.md) | What the site is explicitly **not**, to keep automated proposals in scope. |

Each spec carries frontmatter with its `status`: `current-state` (describes what
exists today), `vision` (planned direction), or `index` (this file).

## How agents use these specs

Read the spec that matches the task, then check it against the code before acting:

- Changing pages/rendering/content flow → [architecture.md](./architecture.md).
- Reviewing or shipping a change → [quality-bars.md](./quality-bars.md).
- Linting, adding a lint rule, or a CI lint failure → [linting.md](./linting.md).
- Accessibility work → [accessibility.md](./accessibility.md).
- Multilanguage / i18n work → [i18n.md](./i18n.md).
- Editing `content/data/*.json` → [data-contracts.md](./data-contracts.md).
- Writing or editing an article → [content-style-guide.md](./content-style-guide.md)
  and [markdown-rendering.md](./markdown-rendering.md).
- Proposing anything new → [non-goals.md](./non-goals.md) and [vision.md](./vision.md).

**Precedence when guidance conflicts:**

1. **[non-goals.md](./non-goals.md) wins.** If a change crosses a non-goal, it is out
   of scope regardless of what any other spec suggests — flag it, don't implement it.
2. **The code is the source of truth for current-state facts.** If a `current-state`
   spec disagrees with the code, that is drift: fix it (and note it) rather than trusting
   the stale text.
3. **[quality-bars.md](./quality-bars.md) gates shipping.** A change that regresses a
   quality bar does not ship.
4. **[vision.md](./vision.md) guides direction** but never authorizes crossing a
   non-goal or a quality bar.

## Requirement levels

Specs use the keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY**
with their [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) meanings:

- **MUST / MUST NOT** — a hard gate. A reviewer agent blocks a change that violates it.
- **SHOULD / SHOULD NOT** — a strong default. Breaking it needs a stated, good reason.
- **MAY** — genuinely optional.

## Canonical sources these specs build on

Specs link to — and must stay consistent with — these existing documents:

- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) — project overview, workflows, conventions.
- [`.github/instructions/articles.instructions.md`](../../.github/instructions/articles.instructions.md) — article content guidelines and front matter.
- [`.github/instructions/components.instructions.md`](../../.github/instructions/components.instructions.md) — component conventions.
- [`.github/instructions/issues.instructions.md`](../../.github/instructions/issues.instructions.md) — issue-management conventions.
- [`README.md`](../../README.md) — onboarding, prerequisites, tech stack.
- [`docs/analytics.md`](../analytics.md) — Application Insights setup and cost guardrails.
- `src/src/types/` — TypeScript types that define every data contract.

## Glossary

- **SSR / prerender** — build-time rendering of each route to static HTML. There is no
  runtime server; see [architecture.md](./architecture.md).
- **Static route** — a route enumerated by `getStaticRoutes()` and emitted as an HTML
  file at build.
- **Primitive** — a local shadcn-style Radix component in
  `@/components/shared/primitives` (`Button`, `Badge`, `Card`, `Separator`, `Tooltip`;
  `Card`/`Tooltip` live in `CardPrimitives.tsx` / `TooltipPrimitives.tsx`).
- **Semantic token** — a Tailwind theme color/spacing token, used instead of a
  hardcoded value so theming and contrast hold.
- **Data contract** — the typed shape of a `content/data/*.json` file; see
  [data-contracts.md](./data-contracts.md).
- **Front matter** — the YAML block at the top of an article markdown file; see
  [content-style-guide.md](./content-style-guide.md).
- **llms.txt / llms-full.txt** — machine-readable site summaries generated by the
  prerender step for LLMs and crawlers.

## References

External standards these specs build on:

- [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) — accessibility target.
- [Schema.org](https://schema.org/) — vocabulary for the JSON-LD structured data.
- [Azure Static Web Apps configuration](https://learn.microsoft.com/azure/static-web-apps/configuration) — `staticwebapp.config.json`.
- [llms.txt proposal](https://llmstxt.org/) — the machine-readable summary convention.
- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) — requirement keyword meanings.

## Conventions for maintaining these specs

- Keep each spec short and skimmable. Prefer a link over a copy.
- Verify every claim against the code (routes, types, scripts). Do not invent.
- When you find drift between a spec and the code, fix the spec (or the code) and
  note it — don't leave both.
- Keep each file's frontmatter accurate: set `status` to `current-state`, `vision`, or
  `index`, and bump `version` when the spec set changes materially.
- Use MUST/SHOULD/MAY (see Requirement levels) when writing a rule an agent should
  enforce, so its strength is unambiguous.
