---
name: triage-site-quality
description: Audit loganfarci.com locally or in production, interpret Lighthouse and build findings, and turn only reproducible spec gaps into lean GitHub tasks or bugs. Use whenever the user asks for Lighthouse, a site-quality audit, performance/accessibility/SEO triage, issue cleanup after an audit, or recommendations about which findings deserve issues.
---

# Triage Site Quality

Use this workflow to connect measured site quality to an actionable, non-duplicative
backlog. Keep the repository specs and live GitHub state authoritative; audit results
are evidence, not requirements by themselves.

## Prepare

1. Read `AGENTS.md`, `.github/copilot-instructions.md`,
   `.github/instructions/issues.instructions.md`, and `docs/specs/README.md`.
2. Read the specs relevant to the audit, normally:
    - `docs/specs/quality-bars.md`
    - `docs/specs/accessibility.md`
    - `docs/specs/architecture.md`
    - `docs/specs/testing.md`
    - `docs/specs/non-goals.md`
3. Check `git status -sb`. Preserve unrelated and uncommitted work.
4. Search the current GitHub backlog before proposing or creating issues. Search by
   concept, affected component, audit identifier, and likely solution rather than
   relying on an exact title match.

## Build and select routes

For a local audit, work from `src/`:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

Audit the production build, not the development server. Cover at least:

- `/`
- `/about/`
- `/articles/`

Add one representative `/articles/{slug}/` when article rendering, Markdown, Mermaid,
or article-specific performance is in scope.

Use trailing slashes for local prerender audits. Vite preview can serve the root SPA
fallback for extensionless `/about` and `/articles`, producing false hydration,
canonical, and console-error findings. Confirm `dist/about/index.html` and
`dist/articles/index.html` exist, then audit `/about/` and `/articles/`.

For a deployed audit, use the canonical production URLs. Production testing is
necessary for CDN behavior, response times, caching, redirects, security headers,
and integrations that are disabled locally.

## Run Lighthouse

1. Determine the current stable Lighthouse version from the npm `latest` tag or the
   official release source. Record the exact version in the report and issue evidence.
2. Prefer an isolated invocation such as `npx --yes lighthouse@<version>` or a
   temporary installation. Do not modify application dependencies just to run an
   audit.
3. Use Lighthouse mobile defaults unless the user requests another profile.
4. Save JSON reports outside the repository, for example under `/tmp/`.
5. Audit the categories `performance`, `accessibility`, `best-practices`, and `seo`.
6. If Chrome or shared libraries are unavailable, keep downloaded tooling and runtime
   libraries temporary. Request approval before network downloads or launching an
   unrestricted browser process.
7. Stop only the preview/browser processes started for the audit.

Record for every route:

- category scores;
- FCP, LCP, TBT, CLS, Speed Index, and TTI when available;
- failing accessibility nodes and measured contrast ratios;
- unused JavaScript bytes and estimated savings;
- layout-shift causes;
- console errors, deprecated APIs, and back/forward-cache blockers;
- canonical/metadata failures;
- server response, caching, and compression findings for deployed routes.

## Interpret findings

Prefer repeated, structural evidence over a single score. Lighthouse is a synthetic
run, so exact timings vary; route-consistent failures and DOM/resource diagnostics are
more reliable.

Use these project-specific lessons:

- Contrast failures in shared muted text or card tokens belong with the shared
  contrast/card work, not separate issues per route.
- Large shared unused JavaScript should be traced to its dependency. Mermaid is known
  to be the heaviest dependency and should load only for diagrams.
- A CLS above `0.1` is actionable. Inspect intrinsic image dimensions, rendered aspect
  ratios, SSR/hydration geometry, and web-font swaps before prescribing a fix.
- Application Insights runs only with production configuration. Production-only
  deprecated API or bfcache failures may originate in
  `src/src/core/appInsights.ts`; verify the bundle before attributing them.
- Missing production source maps are primarily a debugging/observability limitation.
  Do not create an issue unless production debugging or an error-monitoring workflow
  requires them. Prefer hidden maps uploaded to the monitoring service over public
  maps.
- A small local stylesheet flagged as render-blocking, a short dependency chain with
  no preconnect candidates, or a small unattributed forced reflow does not merit an
  issue without measurable user impact.
- Do not treat a local-preview fallback artifact as an application defect.

## Normalize the backlog

Follow `.github/instructions/issues.instructions.md`.

1. Map a finding to an existing issue whenever its desired outcome is already covered.
   Add concrete audit evidence and verification criteria instead of creating a
   duplicate.
2. Create a `bug` when current behavior violates a spec or browser contract.
3. Create a `task` for bounded improvement work that does not describe broken current
   behavior.
4. Keep one actionable issue level. Do not create features, epics, audit trackers, or
   parent issues.
5. Close completed issues as completed. Close obsolete, intentionally dropped, or
   over-broad trackers as not planned after preserving any still-useful actionable
   context elsewhere.
6. Split broad work only when each resulting issue is independently valuable and
   pickup-ready. Otherwise refine the existing issue around one outcome.
7. Avoid prescribing an uncertain UI solution. State the observed problem, constraints,
   options worth evaluating, and measurable expected outcome.

## Evidence required in audit-derived issues

Include:

- exact audited environment and route;
- Lighthouse version and profile;
- measured current behavior;
- relevant spec links;
- likely affected files or components;
- bounded implementation steps without overcommitting to an unverified cause;
- measurable acceptance criteria;
- a rerun of the relevant local and/or deployed routes;
- the repository quality gate.

Do not paste whole Lighthouse reports into issues. Keep the evidence needed to reproduce
and verify the result.

## Report

Lead with:

1. a compact route-by-route score table;
2. the important metrics and repeated findings;
3. existing issues updated and new issues created;
4. findings deliberately not turned into issues, with the reason;
5. local-versus-production caveats and any processes stopped.

State explicitly when no repository files were changed by the audit.
