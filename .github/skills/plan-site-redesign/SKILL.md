---
name: plan-site-redesign
description: Plan and visualize a full redesign of loganfarci.com before implementation. Use when Logan asks to redesign, rethink, refresh, or substantially reorganize the site's identity, information architecture, navigation, layouts, or content hierarchy and wants research, visual concepts, a design-system specification, or an implementation backlog before application code changes.
---

# Plan Site Redesign

Produce an approved redesign direction and delivery plan without changing the runnable
website. Coordinate existing repository skills and
[`impeccable`](https://www.skills.sh/pbakaus/impeccable/impeccable) instead of
duplicating their specialist work.

## Coordinate Impeccable

Use `impeccable` as the visual-design specialist for direction generation, interface
craft, critique, and refinement. This skill remains responsible for repository context,
product constraints, artifact boundaries, approval gates, and delivery sequencing.

Before creating visual directions:

1. Check whether `impeccable` is available in the active skill environment.
2. If it is unavailable, tell the user and install it from the linked canonical source
   when installation is possible. Do not claim to have used it when it could not be
   loaded.
3. Give it the approved discovery brief, representative real content, current-site
   evidence, applicable specs, and the standalone-preview boundary.
4. Use its workflow to create and critique every direction, then apply this repository's
   accessibility, architecture, non-goal, and approval requirements as hard gates.

Do not copy Impeccable's general visual-design guidance into this skill. Keep the
orchestrator thin and defer design-craft decisions to the installed specialist unless a
repository spec overrides them.

## Preserve the planning boundary

Treat these as planning artifacts, not application implementation:

- research notes and a current-state inventory;
- written briefs, decision records, and backlog proposals;
- low- or high-fidelity mockups made outside the application source;
- a standalone, browser-viewable preview made outside the application source;
- screenshots of the unchanged current site used as evidence.

Do not edit `src/`, `content/`, infrastructure, application dependencies, or production
configuration while using this skill. A standalone static preview is allowed only when
it is isolated from the application, uses no application build or dependencies, and is
clearly labeled as a disposable design artifact rather than production code. If the user
asks to implement during planning, restate the approval gate and finish or explicitly
abandon this workflow first.

Require explicit user approval of both the selected visual direction and the written
redesign plan before handing work to an implementation workflow. Approval authorizes a
separate implementation phase; it does not silently extend this skill into delivery.

## Ground the redesign

1. Read `AGENTS.md`, `.github/copilot-instructions.md`, and `docs/specs/README.md`.
2. Read at least:
   - `docs/specs/vision.md`;
   - `docs/specs/non-goals.md`;
   - `docs/specs/architecture.md`;
   - `docs/specs/accessibility.md`;
   - `docs/specs/quality-bars.md`.
3. Inspect the current routes, navigation, semantic tokens, shared layout primitives,
   content models, and representative pages. Distinguish shipped behavior from planned
   features.
4. Run the current app with `run-app-locally` when visual inspection is useful. Capture
   desktop and mobile evidence without modifying the app.
5. Use `triage-accessibility` when the redesign is motivated by accessibility or when a
   proposed direction needs a formal accessibility baseline. Keep audit findings
   separate from aesthetic preferences.
6. Preserve factual content and the Vite, React, Tailwind, prerendering, and static Azure
   architecture unless the user starts a separate scope decision. Reject directions
   that cross `docs/specs/non-goals.md`.

## Discover the brief

Ask one focused question at a time when information is missing. Prefer bounded choices
with a recommendation over open-ended questionnaires. Establish:

- the primary audience and first-visit outcome;
- the content and routes that deserve the strongest emphasis;
- desired and unwanted brand attributes;
- visual references and what specifically works or fails in each;
- constraints on identity, copy, assets, accessibility, responsiveness, and motion;
- measurable signs that the redesign succeeds.

Do not assume a visual taste from generic labels such as “modern.” Translate preferences
into observable properties such as typography, density, rhythm, contrast, imagery,
geometry, and interaction.

## Create visual directions

Present two or three meaningfully different directions before converging. Produce an
actual visual preview; prose, token tables, ASCII wireframes, and reference links alone
do not satisfy this requirement.

Create a standalone browser-viewable preview that lets the user compare the directions
without changing or running the application. Prefer a small static HTML/CSS artifact in
a planning-only location or a temporary directory. It must:

- provide clearly labeled navigation between directions and previewed routes;
- support representative mobile and desktop viewport widths;
- use realistic existing site content rather than generic dashboard placeholders;
- include enough fidelity to judge hierarchy, typography, color, spacing, and overall
  character;
- identify interactions that cannot be meaningfully demonstrated in the preview;
- remain separate from the production build and be easy to delete after approval.

Run the standalone preview locally, open it in a browser, and give the user its local URL.
Capture screenshots of every direction at representative mobile and desktop widths so
the decision package remains reviewable after the preview server stops. If browser
preview tooling is unavailable, explain the limitation and provide rendered mockup
images instead; do not silently fall back to a prose-only concept.

Use `impeccable` to critique the preview at mobile and desktop widths before presenting
it. Resolve its high-confidence craft findings or record why a repository constraint or
explicit user preference takes precedence.

For each direction:

- name the concept and explain its audience fit;
- show key screens at mobile and desktop sizes, including the home page and at least one
  content-heavy route;
- demonstrate navigation, content hierarchy, typography, color, spacing, imagery, and
  representative interaction states;
- show both light and dark themes when the direction materially changes between them;
- annotate assumptions, accessibility risks, asset needs, and meaningful tradeoffs;
- label generated or placeholder content clearly.

Use the image-generation skill for raster moodboards or original illustrative assets
when those are genuinely useful. Prefer diagrams or standalone mockup artifacts for
layout and interaction concepts that require precise, editable structure. Do not use
external imagery without recording its source and reuse constraints.

Review directions against content clarity, distinctiveness, responsiveness, WCAG
requirements, implementation complexity, and the repository vision. Recommend one, but
ask the user to select, combine, revise, or reject the options. Iterate until the user
explicitly approves a direction.

## Specify the selected system

Turn the approved direction into an implementation-ready design specification covering:

- sitemap and navigation model;
- page-by-page hierarchy and responsive layout behavior;
- typography roles and scale;
- semantic color, spacing, radius, shadow, and motion tokens;
- reusable layout and component patterns;
- interaction, focus, reduced-motion, empty, loading, and error states where relevant;
- content and asset requirements;
- accessibility, SEO, prerendering, and machine-readable implications;
- migration constraints and decisions intentionally deferred.

Map concepts to the existing Tailwind tokens and local primitives where possible. Flag
rather than conceal anything that would need a new dependency, content contract, route,
or spec change.

## Produce the delivery plan

Create a sequenced backlog of independently reviewable implementation slices. Each slice
must state its outcome, dependencies, likely files or systems, acceptance criteria,
accessibility checks, and validation commands. Order foundational tokens and shared
shell work before page migrations, then content/metadata integration and final cross-route
validation. Avoid a single “implement redesign” task.

Use `shape-backlog-idea` to normalize or publish backlog items when its canonical
workflow is available. Otherwise provide draft backlog items and identify the missing
workflow instead of inventing GitHub conventions. Use `validate-app` only in the later
implementation workflow, not as evidence that a visual plan is approved.

## Final approval gate

Present a compact decision package containing:

1. the approved visual direction and links or paths to its visuals;
   include the standalone preview path and captured mobile and desktop screenshots;
2. the redesign brief and design-system specification;
3. the sequenced delivery plan;
4. unresolved decisions, risks, and deferred work;
5. an explicit statement that the runnable application remains unchanged.

Ask separately for approval of the visual direction and the written plan if either has
not already been approved. Do not begin implementation or describe the redesign as ready
to build until both approvals are explicit.
