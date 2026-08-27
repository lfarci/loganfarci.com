# Codex Site Designer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Codex-native Site Designer profile and repository skill that use a reviewed, pinned Impeccable installation and the existing loganfarci.com guidance.

**Architecture:** A user-level Codex profile selects high-quality model and safe execution defaults, while a repository skill owns the Designer workflow and UI metadata. The repository skill composes the pinned Impeccable skill with existing AGENTS.md guidance, specs, local-app startup, and validation skills; a root PRODUCT.md routes Impeccable to canonical product requirements without duplicating them.

**Tech Stack:** Codex config TOML, Agent Skills (`SKILL.md` and `agents/openai.yaml`), GitHub CLI skill management, Markdown repository specs, Python skill validation.

---

## File structure

- `/home/lfarci/.codex/designer.config.toml`: personal Codex execution defaults selected by `codex --profile designer`; it contains no workflow instructions.
- `.agents/skills/impeccable/`: complete third-party Impeccable skill installed from the reviewed immutable revision `63b04e2530f5c7b41ea83c133daab24f34912456`.
- `.agents/skills/site-designer/SKILL.md`: repo-specific Designer role, phase routing, approval boundaries, helper-skill routing, and result contract.
- `.agents/skills/site-designer/agents/openai.yaml`: Codex UI identity and default invocation prompt.
- `PRODUCT.md`: short product-context router to the canonical repository specs.

`DESIGN.md`, `docs/design/current-state-critique.md`, and `docs/design/revamp-plan.md` are deliberately absent from this setup plan. The Site Designer creates them later at their respective approval gates.

### Task 1: Audit and pin Impeccable for Codex

**Files:**

- Create: `.agents/skills/impeccable/**`

- [ ] **Step 1: Verify the immutable upstream revision**

Run:

```bash
git ls-remote https://github.com/pbakaus/impeccable.git HEAD
```

Expected: the command succeeds. The current HEAD may have advanced, but this plan continues to use the reviewed revision `63b04e2530f5c7b41ea83c133daab24f34912456`; do not substitute the new HEAD automatically.

- [ ] **Step 2: Preview the exact skill revision without installing it**

Run:

```bash
gh skill preview pbakaus/impeccable impeccable@63b04e2530f5c7b41ea83c133daab24f34912456 --allow-hidden-dirs
```

Expected: the tree contains `SKILL.md`, `reference/`, and `scripts/`; the rendered instructions identify the `critique`, `shape`, `new-work`, `document`, `audit`, and `polish` playbooks.

- [ ] **Step 3: Inspect source provenance, license, and executable surface**

Create an isolated audit checkout:

```bash
impeccable_audit_dir="$(mktemp -d /tmp/impeccable-audit.XXXXXX)"
git clone --filter=blob:none https://github.com/pbakaus/impeccable.git "$impeccable_audit_dir/repo"
git -C "$impeccable_audit_dir/repo" checkout 63b04e2530f5c7b41ea83c133daab24f34912456
```

Expected: `git rev-parse HEAD` in the audit checkout prints exactly `63b04e2530f5c7b41ea83c133daab24f34912456`.

Enumerate the skill and inspect its license and executable files:

```bash
git -C "$impeccable_audit_dir/repo" rev-parse HEAD
find "$impeccable_audit_dir/repo" -maxdepth 4 -type f -print
find "$impeccable_audit_dir/repo" -type f \( -name '*.mjs' -o -name '*.js' -o -name '*.sh' \) -print
rg -n "child_process|execFile|execSync|spawn|fetch\(|https?://|process\.env|writeFile|rmSync|unlink|chmod" "$impeccable_audit_dir/repo"
```

Expected: every executable file is enumerated and every sensitive-operation hit is reviewed in context. Confirm that the license permits committing the skill and that scripts used by `context`, `critique`, `shape`/`new-work`, `document`, `audit`, and `polish` are consistent with their documented purpose. Stop before installation if the license is missing or incompatible, a script has unexplained network or destructive behavior, or the checked-out SHA differs.

- [ ] **Step 4: Parse-check every JavaScript executable**

Run from the audit checkout:

```bash
find "$impeccable_audit_dir/repo" -type f -name '*.mjs' -exec node --check {} \;
find "$impeccable_audit_dir/repo" -type f -name '*.js' -exec node --check {} \;
```

Expected: every file exits successfully with no syntax error.

- [ ] **Step 5: Install the reviewed revision into the repository**

Run from the repository root:

```bash
gh skill install pbakaus/impeccable impeccable --pin 63b04e2530f5c7b41ea83c133daab24f34912456 --agent codex --scope project
```

Expected: `.agents/skills/impeccable/` is created with source-tracking metadata that records `pbakaus/impeccable` and the pinned revision.

- [ ] **Step 6: Validate the installed skill**

Run:

```bash
python3 /home/lfarci/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/impeccable
git diff --check -- .agents/skills/impeccable
git status --short .agents/skills/impeccable
```

Expected: validation succeeds, `git diff --check` prints nothing, and only the new Impeccable skill tree is shown for this path.

- [ ] **Step 7: Commit the pinned dependency**

Run:

```bash
git add .agents/skills/impeccable
git commit -m "chore: pin impeccable design skill"
```

Expected: one commit containing only the reviewed Impeccable skill.

### Task 2: Create the Codex designer profile

**Files:**

- Create: `/home/lfarci/.codex/designer.config.toml`

- [ ] **Step 1: Confirm the profile does not already exist**

Run:

```bash
test ! -e /home/lfarci/.codex/designer.config.toml
```

Expected: exit code 0. If the file exists at execution time, inspect it and preserve every unrelated setting; apply only the exact keys from Step 2 instead of replacing the file.

- [ ] **Step 2: Create the profile with safe, high-quality defaults**

Create `/home/lfarci/.codex/designer.config.toml` with exactly:

```toml
model = "gpt-5.6-sol"
model_reasoning_effort = "xhigh"
personality = "friendly"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

The file is personal Codex configuration and is not staged in the loganfarci.com repository.

- [ ] **Step 3: Strict-parse the named profile**

Run:

```bash
codex --profile designer --strict-config --version
```

Expected: Codex prints its version and exits successfully without an unknown-field or TOML parsing error.

### Task 3: Create the repository Site Designer skill

**Files:**

- Create: `.agents/skills/site-designer/SKILL.md`
- Create: `.agents/skills/site-designer/agents/openai.yaml`

- [ ] **Step 1: Initialize the skill structure**

Run from the repository root:

```bash
python3 /home/lfarci/.codex/skills/.system/skill-creator/scripts/init_skill.py site-designer --path .agents/skills --interface 'display_name=Site Designer' --interface 'short_description=Critique and revamp loganfarci.com UI' --interface 'default_prompt=Use $site-designer to critique the current site and prepare an approval-ready full-revamp plan.'
```

Expected: the initializer creates the two declared files and no unused resource directories.

- [ ] **Step 2: Replace the scaffold with the complete Designer instructions**

Replace `.agents/skills/site-designer/SKILL.md` with:

```markdown
---
name: site-designer
description: Critique, direct, plan, implement, and refine the loganfarci.com interface. Use for site design reviews, visual direction, full or partial redesigns, responsive UI work, design-system changes, and final visual polish. Do not use for backend, infrastructure, or content-only tasks with no visual or interaction impact.
---

# Site Designer

Act as Logan's hands-on design engineer for loganfarci.com. Combine strong visual judgment with production-grade React and Tailwind implementation. The intended identity is professional, modern, technical, developer-native, enterprise-credible, close, and friendly. Draw contextual inspiration from GitHub, Microsoft, and Avanade without reproducing their branding or interface.

## Required context

Read the applicable repository guidance before acting:

- `AGENTS.md` and any nested `AGENTS.md` for the target path.
- `.github/copilot-instructions.md` and applicable `.github/instructions/` files.
- `docs/specs/README.md` and the specs it routes for the task.
- `docs/superpowers/specs/2026-08-27-codex-site-designer-design.md` for this role's approved contract.

The current code is authoritative for current-state facts. `docs/specs/non-goals.md` wins on scope, and `docs/specs/quality-bars.md` gates implementation.

## Impeccable dependency

Read `.agents/skills/impeccable/SKILL.md` completely, run its context setup once per session, and load only the playbook that owns the current phase:

- `critique` for rendered current-state review.
- `shape` and `new-work` for a replacement visual world.
- `document` after Logan selects a direction.
- The relevant build or refinement playbook and `craft-floor` immediately before UI edits.
- `audit` or `polish` for bounded finishing passes.

If Impeccable is missing, unreadable, or fails its integrity check, report degraded capability. A repository-only critique may continue with that limitation, but ask before planning or implementing the revamp without Impeccable.

## Determine the phase

Use the user's request and existing artifacts to select exactly one phase:

1. **Setup validation:** verify profile, skill discovery, context routing, and approval boundaries without running the app or editing files.
2. **Critique:** inspect the current rendered site and write an evidence-backed critique without editing UI or content source files.
3. **Direction:** present three distinct visual directions and wait for Logan's selection.
4. **Plan:** write the approved visual system and phased revamp plan, then stop for approval.
5. **Implement:** change only an explicitly approved phase and validate it.
6. **Refine:** improve a clearly scoped surface within the approved visual system.

Do not collapse Critique, Direction, Plan, and Implement into one autonomous run. A request for a full revamp begins with Critique unless the required prior artifacts and approvals already exist.

## Critique phase

Use `$run-app-locally` to start and verify the site. Inspect every route emitted by the current routing and prerender code, including a representative article detail route. Review both themes at representative mobile, tablet, and desktop widths.

Evaluate information hierarchy, typography, layout, navigation, content presentation, responsive behavior, interaction states, motion, accessibility, visual consistency, and perceived professional identity. Check keyboard focus, reduced motion, overflow, and obvious contrast issues. Correlate rendered evidence with tokens, primitives, components, and page code.

Write `docs/design/current-state-critique.md`. Each finding must include surface, evidence, impact, priority, and `preserve`, `reconsider`, or `replace`. Distinguish design judgment from verified accessibility or functional defects. Do not edit UI or content source files.

## Direction phase

Use the visual companion and real site content to present three genuinely distinct directions. Explain each direction's thesis, typography character, palette strategy, spatial system, material and elevation treatment, imagery stance, motion grammar, and fit with Logan's identity.

Every direction must remain content-first, accessible, responsive, and compatible with the static React and Tailwind architecture. Do not clone GitHub, Microsoft, or Avanade layouts, tokens, illustrations, or brand assets. Wait for Logan to select or revise a direction.

## Plan phase

After direction approval, create root `DESIGN.md` from the chosen direction and verified project tokens and components. Update `docs/specs/README.md` to route visual-design decisions to it while preserving the documented precedence of product non-goals and quality bars.

Create `docs/design/revamp-plan.md` with independently verifiable phases for foundations and tokens; shared layout and navigation; page surfaces; responsive and motion refinement; and final validation. Include routes, likely code paths, migration risks, acceptance criteria, and existing checks. Stop and request explicit approval.

## Implement and refine phases

Edit only approved scope. Preserve factual content and repository boundaries. Reuse existing components, Radix primitives, semantic tokens, and platform features before adding a dependency or abstraction.

Use focused checks while iterating, then `$validate-app` before declaring an approved phase complete. Build fully, inspect desktop and mobile together, repair the observed batch once, and perform at most one confirmation pass. Visual review adds evidence but never replaces the repository quality gate.

## Failure handling

- If the app or browser cannot run, provide a labeled static-code assessment and return `blocked` for a rendered critique.
- Separate pre-existing baseline failures from design findings; do not silently expand scope.
- Preserve user changes and stop before editing overlapping paths.
- Reject or revise directions that conflict with a non-goal, accessibility requirement, or quality bar.
- Request authority at the point of use when a script exceeds active permissions; never weaken the profile globally.
- Never update or repair the pinned Impeccable skill as a side effect of design work.

## Designer Result

End every invocation with one `Designer Result` containing:

- `status`: `critique-ready`, `direction-ready`, `plan-ready`, `complete`, or `blocked`
- phase and scope
- routes and surfaces inspected or changed
- evidence and durable artifacts
- changed files when implementation was authorized
- commands and outcomes
- approvals received
- remaining risks, limitations, or blockers

A critique is not ready without rendered evidence. A plan is not ready without a selected direction, acceptance criteria, and phased work. Implementation is not complete with a known failing required quality gate.
```

- [ ] **Step 3: Set the Codex UI metadata and invocation policy**

Replace `.agents/skills/site-designer/agents/openai.yaml` with:

```yaml
interface:
  display_name: "Site Designer"
  short_description: "Critique and revamp loganfarci.com UI"
  default_prompt: "Use $site-designer to critique the current site and prepare an approval-ready full-revamp plan."

policy:
  allow_implicit_invocation: true
```

- [ ] **Step 4: Validate the Site Designer skill**

Run:

```bash
python3 /home/lfarci/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/site-designer
git diff --check -- .agents/skills/site-designer
```

Expected: the validator succeeds and `git diff --check` prints nothing.

- [ ] **Step 5: Commit the repository skill**

Run:

```bash
git add .agents/skills/site-designer
git commit -m "feat: add codex site designer skill"
```

Expected: one commit containing only the Site Designer skill and its UI metadata.

### Task 4: Add Impeccable's product-context router

**Files:**

- Create: `PRODUCT.md`

- [ ] **Step 1: Create the routing document without duplicating requirements**

Create `PRODUCT.md` with:

```markdown
# Product Context for Design Tools

This file is a routing layer for tools that expect a root `PRODUCT.md`. The canonical product requirements remain in [`docs/specs/README.md`](docs/specs/README.md); do not copy or reinterpret them here.

Before making a product or design decision, read:

- [`docs/specs/vision.md`](docs/specs/vision.md) for purpose, audiences, identity, and direction.
- [`docs/specs/non-goals.md`](docs/specs/non-goals.md) for hard scope boundaries.
- [`docs/specs/architecture.md`](docs/specs/architecture.md) for shipped routes and rendering constraints.
- [`docs/specs/accessibility.md`](docs/specs/accessibility.md) for the detailed accessibility contract.
- [`docs/specs/quality-bars.md`](docs/specs/quality-bars.md) for shipping gates.

Precedence remains the order documented in `docs/specs/README.md`: non-goals win, current code defines current-state facts, quality bars gate shipping, and the vision guides direction.
```

- [ ] **Step 2: Verify every routed document exists**

Run:

```bash
test -f docs/specs/README.md
test -f docs/specs/vision.md
test -f docs/specs/non-goals.md
test -f docs/specs/architecture.md
test -f docs/specs/accessibility.md
test -f docs/specs/quality-bars.md
git diff --check -- PRODUCT.md
```

Expected: every command succeeds and `git diff --check` prints nothing.

- [ ] **Step 3: Commit the product router**

Run:

```bash
git add PRODUCT.md
git commit -m "docs: route design tools to product specs"
```

Expected: one commit containing only `PRODUCT.md`.

### Task 5: Validate the complete Codex setup

**Files:**

- Verify: `/home/lfarci/.codex/designer.config.toml`
- Verify: `.agents/skills/impeccable/**`
- Verify: `.agents/skills/site-designer/SKILL.md`
- Verify: `.agents/skills/site-designer/agents/openai.yaml`
- Verify: `PRODUCT.md`

- [ ] **Step 1: Run deterministic profile and skill validation**

Run:

```bash
codex --profile designer --strict-config --version
python3 /home/lfarci/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/impeccable
python3 /home/lfarci/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/site-designer
git diff --check
```

Expected: all commands succeed and `git diff --check` prints nothing.

- [ ] **Step 2: Run a read-only behavioral smoke test**

Run:

```bash
codex exec --profile designer --strict-config --ephemeral --sandbox read-only -C /home/lfarci/workspace/repos/loganfarci.com 'Use $site-designer in setup-validation mode. Do not run the application or modify files. Confirm the repository guidance, product router, Impeccable dependency, approval boundary, and Designer Result contract that you loaded. Return one Designer Result.'
```

Expected: Codex explicitly uses Site Designer, recognizes Impeccable and the repository routing, does not attempt a rendered critique, and returns one `Designer Result` without requesting write access.

- [ ] **Step 3: Confirm the smoke test did not modify the project**

Run:

```bash
git status --short
git diff --exit-code -- src/src src/tailwind.config.ts content docs/specs
```

Expected: the pre-existing untracked `.claude/` directory may remain; there are no new changes from the smoke test and the scoped diff exits successfully.

- [ ] **Step 4: Review the setup commits**

Run:

```bash
git log -4 --oneline
git show --stat --oneline HEAD~3..HEAD
```

Expected: the history contains the separate Impeccable, Site Designer, and product-router commits after the plan commit, with no app, content, publication, or deployment changes.

## Execution handoff

After this setup plan passes, start a fresh Codex session with:

```bash
codex --profile designer -C /home/lfarci/workspace/repos/loganfarci.com
```

Then invoke:

```text
$site-designer Critique the current rendered site and prepare the current-state design assessment. Do not edit UI or content source files.
```

That begins the separately gated critique → visual-direction → revamp-plan workflow defined in the approved design spec.
