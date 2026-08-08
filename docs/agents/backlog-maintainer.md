---
spec: backlog-maintainer agent system
version: 0.1.0
status: design
---

# Backlog Maintainer Agent System — Design

Design for the **product-owner side** of the agent workflow: a user-invocable
orchestrator that owns the backlog lifecycle and delegates each phase to a focused
subagent. This document is the design of record; the `.agent.md` files and the GitHub
issues that track their creation derive from it.

Sibling systems (build/ship, articles) reuse the same structural pattern and are
designed separately.

## Platform capabilities this design relies on

Verified against the official custom-agent configuration reference and the Copilot CLI
and VS Code agent docs. These are the load-bearing facts; if any changes, revisit the
design.

| Capability | Status | Design consequence |
| --- | --- | --- |
| `agent` tool alias (aliases: `Task`, `custom-agent`) lets an agent dispatch another custom agent as a subagent | Supported on **Copilot CLI** and **VS Code** | The orchestrator can genuinely delegate; this is not a "playbook that tells a human what to run next". |
| Subagents run with their **own isolated context window** | Supported | Each phase gets a clean context; the orchestrator's context stays small and is not polluted by raw research. |
| `tools:` **filters** the tool set actually exposed to the agent (omit = all, `[]` = none, list = only those) | Enforced, not advisory | "Only one agent may write to GitHub" is a real, enforceable boundary — not a convention. |
| `disable-model-invocation: true` prevents the model from auto-selecting an agent as a subagent | Supported | The human write-gate can be enforced structurally on `issue-writer`, not just requested in prose. |
| `user-invocable: false` hides an agent from the picker | Supported | Deliberately **not** used here — see "Surface portability". |
| VS Code-only `agents:` list restricts which subagents a coordinator may dispatch, and **overrides** `disable-model-invocation` for that coordinator | VS Code only | The orchestrator's `agents:` list must **omit** `issue-writer`, or the write gate is bypassed in VS Code. |
| Subagent dispatch is **not** supported on the GitHub Copilot app / github.com | Not supported | The cycle must degrade to manual sequential invocation there. |
| Skills are description-triggered and shared by all agents; there is no `skills:` frontmatter field | Confirmed | Agents reference `shape-backlog-idea` in their prose body; the skill stays the single source of backlog judgment. |
| Subagent invocations are **stateless** — no follow-up messages to a running subagent | Confirmed | All context must be passed in the initial delegation, which forces explicit artifact hand-offs (below). |

## Design principles

1. **The orchestrator is the product owner, not a worker.** It decides *what phase runs
   next* and is accountable for the outcome. It performs no research, writes no issue
   prose, and holds no write tools.
2. **Privilege is concentrated and minimal.** Exactly one agent can write to GitHub, and
   it is deliberately the *least* intelligent step in the cycle: it executes an already
   approved payload rather than deciding content. Minimizing what the privileged agent
   decides is the point.
3. **Every hand-off is an explicit artifact.** Because subagents are stateless and
   context-isolated, phases communicate through defined structures (below), not shared
   memory. This also makes the cycle debuggable and resumable.
4. **Judgment lives in the skill, not duplicated across agents.** `shape-backlog-idea`
   remains the single source of truth for investigation depth, backlog-action choice,
   issue structure, and prioritization order. Agents reference it; they do not restate it.
5. **The human gate is structural.** Approval before any GitHub write is enforced by
   agent configuration (`disable-model-invocation`, omission from `agents:`), not only by
   instructions the model could rationalize past.
6. **Degrade gracefully.** The same agents must be runnable one-by-one by a human on a
   surface without delegation.

## The agents

Six agents: one orchestrator, five subagents.

### 1. `backlog-maintainer` — orchestrator (the product owner)

| Aspect | Definition |
| --- | --- |
| **Invoked by** | The human. This is the entry point of the system. |
| **Owns** | Routing the request to the right cycle, sequencing phases, holding the human gate, and producing the final report. |
| **Reads before acting** | `docs/specs/README.md` (for spec precedence), `docs/specs/non-goals.md`, `AGENTS.md`, `.github/copilot-instructions.md`. |
| **Tools** | `agent` (delegation), `read`, `search`, plus GitHub **read-only**. |
| **Must NOT have** | Any GitHub write tool, `edit`, or `execute`. It must be incapable of mutating the backlog or the repo directly. |
| **Produces** | A phase-by-phase status and a final report: what was found, what was decided, what was written (with links), what was escalated. |
| **VS Code `agents:` list** | `backlog-explorer`, `backlog-shaper`, `backlog-prioritizer`, `issue-reviewer`. **Deliberately excludes `issue-writer`** so the write gate cannot be overridden. |
| **On failure** | If any phase reports a blocking condition, stop and report. Never skip a phase to reach a write. |

**Routing responsibility.** The orchestrator first classifies the request into one of four
entry modes, because the phase sequence differs per mode:

| Entry mode | Trigger | Phase sequence |
| --- | --- | --- |
| **Idea intake** | Logan describes one idea, defect, or observation (often voice-dictated) | explore (targeted) → shape → gate → write → review |
| **Backlog sweep** | "What's missing?" — specs/code vs. the live backlog | explore (sweep) → shape (per candidate) → prioritize → gate → write → review |
| **Prioritization** | "What should I work on next?" | explore (light) → prioritize → report (no write) |
| **Grooming/hygiene** | Stale, duplicate, or completed items; milestone cleanup | explore (sweep) → shape (close/merge recommendations) → gate → write → review |

### 2. `backlog-explorer` — evidence gathering (read-only)

| Aspect | Definition |
| --- | --- |
| **Owns** | Establishing facts. What does the code actually do, what do the specs require, what already exists in the backlog. |
| **Two modes** | **Targeted** — investigate one idea (resolve vague nouns against real UI/code, find related open/closed issues and PRs, check git history). **Sweep** — diff `docs/specs/` and the current code against the whole backlog to surface gaps, drift, duplicates, and stale items. |
| **Reads** | `docs/specs/`, the codebase, open and recently-closed issues, related PRs, git history. |
| **Tools** | `read`, `search`, `web`, GitHub **read-only** (issue list/view/search). |
| **Must NOT have** | Any GitHub write tool, `edit`. |
| **Produces** | An **Evidence Brief** (contract below). Facts and citations only. |
| **Explicitly does not** | Decide whether something belongs in the backlog, or draft issue prose. It reports; it does not judge. |
| **On failure** | If it finds no actionable gap, it says so plainly. The cycle stops there — the system must never manufacture work to look productive. |

### 3. `backlog-shaper` — judgment and drafting (read-only)

| Aspect | Definition |
| --- | --- |
| **Owns** | Turning evidence into a decision and a ready-to-post issue draft. This is where product judgment happens. |
| **Reads** | The Evidence Brief, the `shape-backlog-idea` skill, `docs/specs/non-goals.md` and `vision.md` (scope check), the relevant specs. |
| **Tools** | `read`, `search`, `web`, GitHub **read-only**. |
| **Must NOT have** | Any GitHub write tool. It drafts; it never posts. |
| **Produces** | An **Issue Proposal** (contract below) — including the explicit recommendation to create, update, close, defer, or **do nothing**. |
| **Key responsibility** | Declining. Per `shape-backlog-idea`, it must be willing to recommend *not* filing an issue when the work already exists, is out of scope per non-goals, or has no meaningful outcome. |
| **On failure** | If the outcome is clear but the design is not, it emits 2–3 credible options with a preferred starting point rather than inventing certainty. |

### Human approval gate

Between shaping and writing. **Hard, non-optional, and structurally enforced.**

- The orchestrator presents each Issue Proposal with the exact repository, action
  (create/update/close), title, type label, milestone, and assignee — matching the rule
  `shape-backlog-idea` already imposes on manual use.
- The human approves, edits, or rejects **per item**.
- Enforcement: `issue-writer` carries `disable-model-invocation: true` so the model cannot
  auto-dispatch it, and it is omitted from the orchestrator's VS Code `agents:` list.
- Explore, shape, and prioritize need **no** gate — they are read-only, reversible, and
  cheap to re-run.

### 4. `issue-writer` — the only write-capable agent

| Aspect | Definition |
| --- | --- |
| **Owns** | Executing an approved Issue Proposal against GitHub. Nothing else. |
| **Reads** | The approved Issue Proposal, and the target issue if updating. |
| **Tools** | GitHub **write** (create issue, update issue, comment, label, milestone) plus GitHub read. |
| **Must NOT have** | `edit`, `execute`, or `agent`. It must not be able to modify the repository or delegate onward. |
| **Deliberately constrained** | It does **not** re-investigate, re-decide, or improve the draft. If the proposal seems wrong, it stops and reports rather than "fixing" it. Content authority stays with the shaper and the human. |
| **Produces** | A **Write Receipt** (contract below): issue number, URL, action taken, and the fields actually set. |
| **Granularity** | One approved proposal per invocation, so a rejection or failure never cascades across items. |
| **On failure** | Reports the failure and stops for that item. Never retries a write silently. |

### 5. `issue-reviewer` — post-write consistency audit (read-only)

| Aspect | Definition |
| --- | --- |
| **Owns** | Verifying that what landed on GitHub matches what was approved and meets repository conventions. |
| **Checks** | **Drift** — does the posted issue match the approved proposal? **Structure** — required sections present, correct type label, sane milestone. **Duplication** — no now-redundant issue left open. **Links** — specs and related issues referenced. |
| **Reads** | The Write Receipt, the posted issue, the approved proposal, sibling issues, `shape-backlog-idea`. |
| **Tools** | `read`, `search`, GitHub **read-only**. |
| **Must NOT have** | Any write tool. It flags; it never edits. Keeping the auditor unable to write preserves the single-writer property. |
| **Produces** | A **Review Verdict**: pass, or fail with specific, actionable findings. |
| **On fail** | The orchestrator re-invokes `issue-writer` with the findings — **bounded to one retry**. A second failure escalates to the human. This prevents an unbounded write/audit loop. |

### 6. `backlog-prioritizer` — sequencing (read-only)

| Aspect | Definition |
| --- | --- |
| **Owns** | Ordering work and surfacing dependencies. |
| **Reads** | Issue Proposals and/or the live backlog, the "Prioritize and sequence" rules in `shape-backlog-idea`, current milestones and assignees. |
| **Tools** | `read`, `search`, GitHub **read-only**. |
| **Must NOT have** | Any write tool. Notably it must not set milestones or labels — sequencing is advice until the human accepts it. |
| **Produces** | A **Sequenced Plan**: ordered items, rationale per position, and explicit "X before Y" dependencies. |
| **On ambiguity** | Flags genuinely ambiguous orderings for a human decision instead of guessing, and never presents inferred priority as confirmed GitHub Project state. |

## Tool permission matrix

The single most important property of this system: **exactly one row has write access.**

| Agent | `agent` | `read` / `search` | `web` | `edit` / `execute` | GitHub read | GitHub **write** |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| `backlog-maintainer` | ✅ | ✅ | — | ❌ | ✅ | ❌ |
| `backlog-explorer` | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `backlog-shaper` | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `backlog-prioritizer` | ❌ | ✅ | — | ❌ | ✅ | ❌ |
| `issue-writer` | ❌ | ✅ | — | ❌ | ✅ | ✅ |
| `issue-reviewer` | ❌ | ✅ | — | ❌ | ✅ | ❌ |

No agent in this system has `edit` or `execute`: backlog maintenance never modifies the
repository. That is the build system's job (sibling design), and keeping the boundary
sharp prevents this system from quietly becoming a code-change path.

## Interaction flow

```mermaid
flowchart TD
    H([Human]) -->|invokes| O[backlog-maintainer<br/>orchestrator]
    O -->|route by entry mode| E[backlog-explorer<br/>read-only]
    E -->|Evidence Brief| S[backlog-shaper<br/>read-only]
    S -->|Issue Proposal| P[backlog-prioritizer<br/>read-only]
    P -->|Sequenced Plan| G{{HUMAN APPROVAL GATE<br/>per item}}
    G -->|rejected| O
    G -->|approved| W[issue-writer<br/>ONLY writer]
    W -->|Write Receipt| R[issue-reviewer<br/>read-only]
    R -->|pass| O
    R -->|fail, max 1 retry| W
    R -.->|2nd failure: escalate| H
    O -->|final report| H
```

Notes on the flow:

- **Prioritization is optional per entry mode.** A single idea intake skips it; a sweep
  and a prioritization request require it.
- **The write/review loop runs per item**, not per batch, so one bad item cannot block or
  corrupt the rest.
- **The orchestrator never touches GitHub state**; it only ever reports and routes.

## Artifact contracts

Because subagent invocations are stateless and context-isolated, every hand-off must be
fully self-contained. These shapes are the interface between phases and should be
specified once in the shared skill so independently-invoked agents agree on them.

**Evidence Brief** (explorer → shaper)
- `subject` — the idea, gap, or issue under investigation
- `current_behavior` — what the code/site actually does today, with file or route citations
- `spec_position` — what the relevant specs require, with links
- `existing_backlog` — related open/closed issues and PRs, with numbers
- `findings[]` — each with evidence and a *suggested* action type (not a decision)
- `unknowns` — anything that could not be verified, explicitly labelled as such

**Issue Proposal** (shaper → gate → writer)
- `recommendation` — create | update | close | defer | **no-op**, with the decisive tradeoff
- `target` — repository, and issue number when updating
- `title`, `body` — the exact final text to post
- `type_label`, `milestone`, `assignee` — the exact metadata to set
- `options[]` — 2–3 credible approaches with a preferred one, when design is genuinely open
- `scope_check` — confirmation it does not cross `non-goals.md`
- `verification` — how the resulting work would be proven done

**Sequenced Plan** (prioritizer → gate)
- `ordered_items[]` — with position rationale
- `dependencies[]` — explicit "X before Y"
- `ambiguous[]` — orderings requiring a human decision

**Write Receipt** (writer → reviewer)
- `action_taken`, `issue_number`, `issue_url`, `fields_set`, `proposal_ref`

**Review Verdict** (reviewer → orchestrator)
- `result` — pass | fail
- `findings[]` — specific and actionable, when failed
- `retry_count`

## Surface portability

| Surface | Behavior |
| --- | --- |
| **Copilot CLI** | Full delegation. The human invokes `backlog-maintainer`; it dispatches subagents. `issue-writer` still requires deliberate human triggering. |
| **VS Code** | Full delegation via the subagent system. The orchestrator's `agents:` list must omit `issue-writer` to preserve the gate. |
| **Copilot app / github.com** | No subagent dispatch. The cycle degrades to the human invoking each agent in order via `/agent`, passing the artifact from the previous phase. |

To keep that degradation possible, **every subagent stays `user-invocable: true`.** The
cycle must be runnable by hand; delegation is an accelerant, not a dependency.

## Relationship to the `shape-backlog-idea` skill

The skill stays the single source of backlog judgment — investigation depth, choosing the
backlog action, issue structure, prioritization order, and the "state the write before
making it" rule. Agents reference it rather than restating it, so there is one place to
change the rules.

One addition is needed: an **artifact hand-off section** documenting the contracts above,
so agents invoked independently still produce and consume compatible shapes.

## Open questions

1. **Explorer/shaper split.** Separating evidence from judgment is clean and keeps each
   context small, but costs one extra hop for simple ideas. Alternative: merge them and
   let the orchestrator skip shaping for trivial cases. Recommend starting split, and
   merging only if the extra hop proves to be pure overhead in practice.
2. **Whether `issue-writer` should also handle closing issues,** or whether closing (a
   destructive action) deserves its own even-more-restricted agent. Recommend one writer
   initially, with closure always requiring explicit per-item human approval.
3. **Named dispatch.** The CLI documents hinting a specific agent by `@name` in a prompt,
   but there is no structured frontmatter field to force a specific subagent. The
   orchestrator's prose must name subagents explicitly and unambiguously.
