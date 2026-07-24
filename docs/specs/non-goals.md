---
spec: non-goals
version: 0.1.0
status: current-state
---

# Non-Goals

[Back to the specs index.](./README.md)

What this project is **not**. An automated code scout or fix agent should not propose
changes that pull the site toward any of these — they are out of scope by design.
When a proposal conflicts with this list, treat it as out of scope.

For what the site *is* meant to grow into (resume, projects, themes, i18n), see
[vision.md](./vision.md). Those planned features are in scope; the items below are not.

## Product non-goals

- **Not a CMS or multi-author blog platform.** Content is authored as files in
  `content/` and shipped at build time. No admin UI, no content database, no
  publishing workflow beyond git + rebuild.
- **No user accounts, auth, or personalization.** The site is a public, read-only
  personal portfolio. There is nothing to log into.
- **No e-commerce, payments, comments, or user-generated content.**
- **No newsletter/email backend or form submission handling** built into the site.

## Technical non-goals

- **No runtime server or database.** The site deploys as **static** HTML to Azure
  Static Web Apps; rendering happens at build time (see
  [architecture.md](./architecture.md)). Do not introduce server-side runtime code,
  API routes, or a datastore for core content.
- **No client-side data fetching for core content.** Articles and structured data are
  resolved at build time via Vite. Don't replace that with runtime `fetch` for content
  that can be prerendered.
- **No framework migration.** The site stays on **Vite** — do not migrate to Next.js,
  Remix, Astro, or similar. (The README previously mislabeled the stack as Next.js;
  that was drift, now corrected.)
- **No new heavy dependencies without cause.** Keep the bundle lean; `mermaid` is
  already the heaviest dependency. Prefer the existing Radix primitives, Tailwind
  tokens, and utilities over adding UI/component libraries.
- **No CSS frameworks besides Tailwind.** Styling goes through Tailwind + the local
  shadcn-style primitives, not a second styling system.

## Privacy & analytics non-goals

- **No cookies and no consent banner.** Analytics is **Azure Application Insights in
  cookieless mode**, PROD-only (see [`docs/analytics.md`](../analytics.md)). Do not add
  cookie-based tracking, third-party analytics/ad scripts, or anything that would
  require a consent flow.

## Infrastructure non-goals

- **No hardcoded cloud resource names.** All Azure resources are defined in Terraform
  under `infra/`. Infra changes go through Terraform, not the app.
- **No alternate hosting targets** wired into the app build (the deploy target is
  Azure Static Web Apps).

## Scope guidance for agents

- Prefer the smallest change that satisfies the request.
- If a task seems to require crossing one of these lines, stop and flag it rather than
  implementing — it likely belongs in a separate, human-reviewed decision.
