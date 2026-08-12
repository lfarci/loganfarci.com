---
spec: simple delivery workflow
version: 1.1.0
status: current-design
verified: 2026-08-12
---

# Simple Delivery Workflow

The active agent workflow is **triage/dispatch -> per-issue delivery**. The Orchestrator
reads the live backlog, selects the high-priority issues, and reports a shortlist to the
host. The host then dispatches one isolated subsession per shortlisted issue; that
subsession owns all research and planning for its issue and drives the build -> review ->
finalize -> PR pipeline.

This deliberately does not use transcript queries, shared worktrees, startup
acknowledgements, or cross-session artifacts between the Orchestrator and a subsession.
The Orchestrator never researches, plans, builds, reviews, or publishes, and never follows
up on a subsession it dispatched.

**What "the host" is:** the host is the root Copilot CLI/agent session that invoked the
Orchestrator (a user's interactive session or a workflow run), not a component defined by
any file in this repository. `create_session` is a native capability of that host runtime,
unavailable to the Orchestrator, Developer, and Reviewer themselves. This repository
therefore does not, and cannot, implement or automate the dispatch step: after reading the
Orchestrator's shortlist, the host manually invokes `create_session` once per shortlisted
issue. That external dependency is intentional, not a missing piece of this workflow.

## Why this is small

Triaging the backlog and delivering one issue are different concerns. The Orchestrator
only needs read access to the repository and the live backlog to produce a prioritized
shortlist. Each issue's research, planning, and implementation belong to an isolated
subsession, so work scales to many issues without one agent carrying every context. The
host's `create_session` invocation is the handoff: the dispatcher stops after reporting
the shortlist, and a subsession finishes with a pull request or a blocked report.

## Roles

| Layer | Role | Owns | May do | Must not do |
| --- | --- | --- | --- | --- |
| Dispatch | Orchestrator | Read the backlog, select the high-priority issues, and report the shortlist | Read/search the repository and live backlog; read GitHub issues; produce a prioritized shortlist for the host to dispatch | Edit code, execute commands, create sessions itself, write GitHub state, push, create a PR, publish, deploy, research or plan an issue, or fix review findings |
| Delivery | Subsession | Research its issue, produce one Execution Plan, and coordinate build -> review -> finalize -> PR | Read/search the repository; invoke Developer and Reviewer in-process; direct Developer to create the PR after review passes | Expand scope, create sessions, publish, deploy, or skip the review gate |
| Delivery | Developer | Implement one approved Execution Plan; after review passes, finalize and create exactly one PR | Read/search/edit/execute and commit local code; use the existing `git push` and `gh pr create` workflow to push the completed branch and create exactly one PR after Reviewer passes it | Expand scope, create sessions, publish, deploy, invoke Reviewer, or create a PR before review |
| Delivery | Reviewer | Independently assess the Developer's result | Read/search/execute scoped checks | Edit, commit, push, create sessions, publish, deploy, or invoke Developer |

## Flow

```mermaid
flowchart LR
    B[Read backlog] --> O[Orchestrator]
    O -->|shortlist| H[Host]
    H -->|create_session per issue| S[Subsession]
    S -->|research + plan| P[Execution Plan]
    P -->|build| D[Developer]
    D --> R[Developer Result]
    R --> V[Reviewer]
    V -->|pass| S
    S -->|finalize| F[Finalized result]
    F -->|post-review PR| PR[Pull Request]
```

1. The Orchestrator reads the live backlog when the request needs it. If that read is
   unavailable, it reports the blockage; it does not invent or use a stale backlog.
2. It selects the high-priority issues and returns a prioritized shortlist to the host.
   It does not research, plan, build, review, or publish, and it does not create or follow
   up on a subsession.
3. The host dispatches one isolated subsession per shortlisted issue, passing the issue
   and the path to this contract.
4. The subsession researches the repository and returns an **Execution Plan** with:
   target, objective, in-scope work, out-of-scope work, likely paths, and existing checks
   to run.
5. The subsession invokes Developer in-process with the complete plan. Developer implements
   it, commits the completed local change, and returns a **Developer Result**.
6. Developer does not create a pull request before review. The review gate is mandatory.
7. The subsession invokes Reviewer in-process with the Developer Result and the plan.
   Reviewer runs the smallest existing checks that cover the change and returns a
   **Review Result**.
8. If the Review Result is `needs-changes`, the subsession routes the actionable findings
   back to Developer once for a bounded repair pass, then re-invokes Reviewer. This repair
   loop is bounded: it never exceeds one additional Developer + Reviewer pass. If the result
   is still `needs-changes` or is `blocked`, the subsession stops and reports a blocked
   outcome with no pull request.
9. If the Review Result is `pass`, the subsession directs Developer to finalize: refine
   details and run the existing quality gates, then use the existing `git push` and
   `gh pr create` workflow to push the completed branch and create **exactly one** pull
   request. Developer records the PR URL and outcome in its Developer Result.
10. The subsession finishes with a pull request or a blocked report. It does not report back
    to the Orchestrator through any cross-session mechanism.

## Handoff contracts

The host's `create_session` invocation is the sole handoff from the Orchestrator layer to
a subsession. That invocation is made manually by the host runtime after it reads the
Orchestrator's shortlist; it is not, and cannot be, triggered by an in-repo automation or
by any `.agent.md` file, because custom agents have no access to `create_session`. Inside a
subsession, the terminal response is the sole artifact for each delegated-agent handoff
(Developer Result, Review Result). The only post-review publication artifact is the single
pull request Developer creates in step 9.

## Review gate and repair loop

- The subsession does not direct Developer to finalize or create a PR until Reviewer
  returns `pass`.
- A `needs-changes` result triggers at most one bounded Developer + Reviewer repair pass
  (step 8). A second `needs-changes` or a `blocked` result stops the subsession with no
  pull request. This is not an unbounded automatic repair loop.
- Reviewer independently verifies the quality gates named in the plan and reports only
  real, actionable findings with file/path evidence.

## Publication capability

- **Status:** Conditional. Generic `execute` is behavioral control only and does not itself
  establish an authenticated publication capability.
- **Runtime evidence:** Immediately before publication, Developer runs `gh auth status` to
  verify scoped GitHub authentication and `git push --dry-run origin HEAD` to verify
  authenticated remote write access. Both must succeed.
- **Failure routing and manual fallback:** If either check is unavailable or fails, Developer
  does not attempt `git push` or `gh pr create`. Its Developer Result records publication as
  blocked and directs the user to authenticate, push the committed branch, and create the
  pull request manually. Developer does not substitute another tool or role.

### Developer Result

- `status`: `complete` or `blocked`
- plan target and scope implemented
- changed paths
- local commit SHA, if committed
- commands run and outcomes
- PR URL and outcome, if the post-review pull request was attempted
- limitations or blockers

### Review Result

- `status`: `pass`, `needs-changes`, or `blocked`
- reviewed target and Developer Result reference
- findings with file/path evidence
- commands run and outcomes
- limitations or blockers

If either response is missing a status or the required fields, the subsession reports
`blocked: incomplete delegated result` and stops.

## Manual fallback

If in-process delegation or a subsession is unavailable, the user runs the subsession
phases directly against the same Execution Plan and Developer Result. The Orchestrator
does not substitute sessions or a different transport mechanism.
