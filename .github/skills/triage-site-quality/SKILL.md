---
name: triage-site-quality
description: Run accessibility-first quality audits of loganfarci.com locally or in production, using Lighthouse and targeted manual checks to find reproducible WCAG and spec gaps before secondary performance, best-practice, and SEO findings. Turn verified findings into lean GitHub tasks or bugs. Use whenever the user asks for Lighthouse, accessibility or WCAG review, a site-quality audit, issue cleanup after an audit, or recommendations about which findings deserve issues.
---

# Triage Site Quality

Use this workflow to connect measured site quality to an actionable, non-duplicative
backlog. Accessibility is the primary lens because the site targets WCAG 2.1 AA and
automated scores can hide serious barriers. Performance, best practices, and SEO remain
important supporting signals. Keep the repository specs and live GitHub state
authoritative; audit results are evidence, not requirements by themselves.

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

## Start with accessibility

Read `docs/specs/accessibility.md` before interpreting tool output. Lighthouse catches
only part of WCAG, so do not equate an accessibility score of `100` with an accessible
page.

For every audited route:

1. Inspect every Lighthouse accessibility failure down to the affected node, computed
   value, and WCAG criterion.
2. Test keyboard navigation in a logical order, visible focus, skip navigation,
   disclosures, menus, and other interactive controls.
3. Check semantic landmarks, heading order, link/button names, image alternatives,
   form labels when present, and status/error announcements.
4. Check text and non-text contrast in both light and dark themes, including hover,
   focus, active, disabled, and selected states.
5. Check responsive layouts at mobile and desktop widths, 200% zoom, and content
   reflow without clipping or horizontal scrolling.
6. Check reduced-motion behavior when animation or transitions are present.

Prefer shared semantic-token or component fixes when the same barrier appears on
multiple routes. Record manual checks separately from Lighthouse findings so future
verification does not imply the automated tool covered them.

## Run Lighthouse

1. Determine the current stable Lighthouse version from the npm `latest` tag or the
   official release source. Record the exact version in the report and issue evidence.
2. Prefer an isolated invocation such as `npx --yes lighthouse@<version>` or a
   temporary installation. Do not modify application dependencies just to run an
   audit.
3. Use Lighthouse mobile defaults unless the user requests another profile.
4. Save JSON reports outside the repository, for example under `/tmp/`.
5. Audit `accessibility` first, then `performance`, `best-practices`, and `seo`.
6. If Chrome or shared libraries are unavailable, keep downloaded tooling and runtime
   libraries temporary. Request approval before network downloads or launching an
   unrestricted browser process.
7. Stop only the preview/browser processes started for the audit.

Record for every route:

- failing accessibility nodes, affected WCAG criteria, and measured contrast ratios;
- manual keyboard, focus, semantics, zoom/reflow, theme, and reduced-motion results;
- category scores, with accessibility presented first;
- FCP, LCP, TBT, CLS, Speed Index, and TTI when available;
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

- Treat any reproducible WCAG 2.1 AA violation as actionable even when its effect on
  the aggregate Lighthouse score is small.
- Do not create one issue per failing node when a shared semantic token or component
  causes the same accessibility barrier across routes.
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
- measured current behavior and relevant WCAG criterion for accessibility findings;
- the manual accessibility steps needed to reproduce and verify the behavior;
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

1. accessibility barriers and manual-check results, ordered by user impact;
2. a compact route-by-route score table with accessibility first;
3. important secondary performance, best-practice, and SEO findings;
4. existing issues updated and new issues created;
5. findings deliberately not turned into issues, with the reason;
6. local-versus-production caveats and any processes stopped.

State explicitly when no repository files were changed by the audit.
