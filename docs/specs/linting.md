---
spec: linting
version: 0.1.0
status: current-state
---

# Linting

[Back to the specs index.](./README.md)

How the project catches issues **before** they ship: a fast local lint pass, the same
pass gated in CI, and a defined path for adding **custom rules** that turn conventions
from the other specs into machine-enforced guardrails. This spec expands the
"Linting & formatting" section of [quality-bars.md](./quality-bars.md#linting--formatting)
— that section states the gate; this one describes the toolchain, how it runs, and how
to extend it. Requirement keywords (**MUST**, **SHOULD**, **MAY**) follow
[RFC 2119](./README.md#requirement-levels). All commands run from `src/`.

## Why linting matters here

Much of this repository is edited by automated agents (PR reviewers, discover → fix →
review pipelines, content agents). Linting is the **fast, deterministic guardrail** that
gives those agents — and humans — immediate, local feedback instead of relying on review
or runtime to catch a mistake. A rule that can be expressed as a lint check **SHOULD** be,
so the feedback loop stays tight and the guardrail is enforced automatically rather than
by convention.

Goals, in priority order:

1. **Fast** — catch issues in seconds locally, before commit or CI.
2. **Gated** — the same check blocks merges in CI (no green build with lint errors).
3. **Extensible** — project conventions can be promoted to custom rules when needed.

## Toolchain

The lint stack is **ESLint 9 (flat config)** + **typescript-eslint** with type-aware
rules, plus **Prettier** for formatting. Config:
[`src/eslint.config.mjs`](../../src/eslint.config.mjs).

- **`js.configs.recommended`** — the ESLint core recommended set.
- **`typescript-eslint` `recommendedTypeChecked`** — applied to `**/*.{ts,tsx}` and wired
  to [`src/tsconfig.json`](../../src/tsconfig.json), so rules are **type-aware** (they see
  the real types, not just syntax). This is what makes lint catch a class of bugs a
  syntax-only linter would miss.
- **`eslint-config-prettier`** (applied **last**) — turns off ESLint rules that would
  fight Prettier, so formatting is owned by Prettier alone.
- **Scripts** (`scripts/**/*.mjs`) get Node globals (`console`, `process`) so build
  scripts lint cleanly without the browser assumptions of app code.
- **Ignored**: `dist`, `node_modules`, `coverage`.

Formatting is **Prettier 3** with the repo-root [`.prettierrc`](../../.prettierrc)
(`printWidth: 120`, `tabWidth: 4`, double quotes, `trailingComma: "all"`, `semi: true`,
LF line endings). Do not hand-fight the formatter; let Prettier settle style so lint can
focus on correctness.

## Running it

From `src/`:

```bash
npm run lint      # eslint . --ext .ts,.tsx
```

- Lint **MUST** pass cleanly (zero errors) before a change is considered done — this is a
  [Definition of Done](./quality-bars.md#definition-of-done-reviewer-checklist) item.
- A change **SHOULD** be lint-clean locally before pushing; CI is the backstop, not the
  first place you discover a failure.
- Warnings **SHOULD** be treated as failures in intent: don't accumulate them. If a rule
  is noisy or wrong for this project, fix the rule (see [Custom rules](#custom-rules--guardrails)),
  don't blanket-disable it inline.
- Inline disables (`// eslint-disable-next-line <rule>`) **MUST** name the specific rule
  and **SHOULD** carry a short reason. Blanket `eslint-disable` for a whole file is **NOT**
  allowed without a stated, reviewed reason.

## CI/CD

The [`Lint`](../../.github/workflows/lint.yml) workflow runs the exact same
`npm run lint` on every push to `main` and every pull request. It is **path-filtered** —
it runs only when lint-relevant files change (`src/src/**`, `src/scripts/**`,
`src/plugins/**`, `eslint.config.mjs`, `package.json`, `package-lock.json`, or the
workflow itself) — so unrelated changes don't pay the cost.

- Runner: `ubuntu-latest`, Node 24, `npm ci` against `src/package-lock.json`.
- The job **MUST** stay green for a PR to merge. A lint failure is a blocking failure, not
  advisory.
- Keep the CI command identical to the local one (`npm run lint`) so "works locally"
  means "passes CI". Do not let the two drift.

## What it enforces today

- **Type-aware correctness** — the type-checked ruleset flags unsafe `any` usage, floating
  promises, misused type-only constructs, and similar bugs that need type information.
- **Core JS hygiene** — the recommended set (no unused vars where configured, no
  unreachable code, etc.).
- **Accessible images** — the `jsx-a11y` plugin's [`alt-text`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md)
  rule runs as `error` on `**/*.tsx`, enforcing the "every image MUST have meaningful alt
  text" contract in [accessibility.md](./accessibility.md). Only `alt-text` is enabled (not
  the plugin's full `recommended` set) to keep the guardrail scoped to a documented
  convention without introducing unrelated a11y noise. It landed clean at `error` — every
  existing `<img>` already carries `alt`.
- **TypeScript strictness is enforced by the compiler**, not ESLint: `strict`,
  `isolatedModules`, `resolveJsonModule`, and no implicit `any` come from
  [`tsconfig.json`](../../src/tsconfig.json) and `npm run build`. Lint and `tsc` are
  complementary gates; see [quality-bars.md](./quality-bars.md#typescript-strictness).

Beyond the recommended sets and Prettier compatibility, the only project-specific
guardrail enabled today is `jsx-a11y/alt-text`. The section below defines how to add
more.

## Custom rules & guardrails

When a convention documented in another spec can be checked mechanically, it **SHOULD** be
promoted to a lint rule so the guardrail is enforced automatically — this is the primary
lever for improving automated feedback.

### When to add a custom rule

Add or enable a rule when **all** of these hold:

- The convention is **already documented** in a spec or instructions file (lint enforces
  existing rules; it does not invent new policy).
- It can be **checked statically** with acceptable precision (few false positives).
- It has **caught, or would plausibly catch, a real mistake** — prefer rules that pay for
  their maintenance, not style preferences Prettier already owns.

Prefer, in order: (1) a rule from an **existing, maintained plugin**; (2) configuring an
existing rule (e.g. `no-restricted-imports`, `no-restricted-syntax`); (3) a **local
custom rule** only when no off-the-shelf rule fits.

### How to add one

ESLint's flat config composes plain objects, so a custom rule is added as a local plugin
in [`eslint.config.mjs`](../../src/eslint.config.mjs):

```js
// A local plugin holding project-specific rules.
const local = {
    rules: {
        "my-guardrail": {
            meta: { type: "problem", docs: { description: "…" } },
            create(context) {
                return {
                    /* AST visitors that context.report(...) violations */
                };
            },
        },
    },
};

export default tseslint.config(
    // …existing config…
    {
        files: ["**/*.{ts,tsx}"],
        plugins: { local },
        rules: { "local/my-guardrail": "error" },
    },
);
```

- A new custom rule **MUST** ship with a test or a documented before/after example, and
  **MUST** link back to the spec whose convention it enforces.
- A new rule **SHOULD** land as `warn` first if it may surface many pre-existing
  violations, then be promoted to `error` once the codebase is clean — never leave a
  permanently-`warn` guardrail.
- Enabling a rule **MUST NOT** require code outside `src/` to change the way it lints
  (keep app rules scoped to app files, script rules to scripts).

### Candidate guardrails

These conventions from other specs are the natural first candidates to enforce in lint.
Each names the spec it would enforce and the likely mechanism; entries marked ✅ are
already enabled (see [What it enforces today](#what-it-enforces-today)), the rest remain
backlog:

- **Prefer `@/` and `@content/` aliases** over deep relative imports —
  [quality-bars.md](./quality-bars.md#typescript-strictness), via `no-restricted-imports`
  patterns on `../../`.
- **No hardcoded colors; use semantic Tailwind tokens** —
  [quality-bars.md](./quality-bars.md#accessibility--target-wcag-21-aa) and
  [accessibility.md](./accessibility.md), via a local rule flagging raw hex/`rgb()` in
  `className`/style.
- **Don't reimplement Radix primitive behavior by hand** —
  [quality-bars.md](./quality-bars.md#component-conventions), via `no-restricted-syntax`
  on the raw elements a primitive already covers.
- **Keep the client bundle lean** — restrict importing heavy dependencies (e.g. `mermaid`)
  outside the modules meant to load them, via `no-restricted-imports`
  ([non-goals.md](./non-goals.md)).
- **Images need `alt`** — **✅ enabled** (`jsx-a11y/alt-text`); see
  [What it enforces today](#what-it-enforces-today).

## Rules for changing the lint setup

- Changing the lint config, adding a rule, or bumping a lint dependency **MUST** keep
  `npm run lint` and the [`Lint`](../../.github/workflows/lint.yml) workflow green.
- Local and CI invocations **MUST** stay identical (`npm run lint`).
- When you add a rule, update this spec's [What it enforces today](#what-it-enforces-today)
  section so it stays a truthful `current-state` description.
