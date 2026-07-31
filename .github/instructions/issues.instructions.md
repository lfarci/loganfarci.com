---
applyTo: ".github/prompts/issues.*.prompt.md"
---

# GitHub Issues Management Instructions

You are assisting with issue management for the loganfarci.com repository using the GitHub MCP server. Follow these guidelines to create well-structured, actionable issues.

## Core Principles

- **Clarity**: Use clear, concise language with descriptive titles
- **Structure**: Follow GitHub-flavored Markdown conventions
- **Hierarchy**: Organize issues under appropriate milestones
- **Actionability**: Make every issue specific and measurable
- **Consistency**: Use standardized templates and naming conventions
- **Traceability**: Link issues to requirements, PRs, and related work

## Product Idea Collaboration

Use the repository's `shape-backlog-idea` skill when Logan talks through a product
idea, UX observation, refactor, defect, or prioritization question.

- Treat fragmented or voice-dictated language as normal exploratory input. Resolve
  approximate component names against the code and rendered flow, then restate the
  understood outcome in clear product language.
- Investigate the current implementation, relevant specs, Git history, live behavior
  when applicable, and related open/recently closed issues before deciding what belongs
  in the backlog.
- Preserve the requested outcome without assuming the proposed implementation is
  correct. Give an evidence-backed recommendation to keep, change, defer, combine, or
  remove the idea.
- When design uncertainty is real, document 2–3 credible options, identify a preferred
  starting point, and require the implementation to record its choice. When the owner
  selects a standard direction, make the issue decisive rather than reopening it.
- Prefer updating an issue that already owns the outcome. Create a follow-up bug for a
  regression or a new task for a distinct productization pass.
- Before a GitHub write, restate the repository, target, type label, milestone, and
  assignee choice. Report success only after the write is confirmed.

## Prioritization

GitHub is the source of truth; refresh the live backlog before recommending sequence.
Use this default order unless the owner explicitly changes it:

1. Production regressions, broken core journeys, privacy/security problems,
   deployment failures, and accessibility blockers.
2. Foundations or quality work that unblocks multiple accepted tasks or prevents
   repeated regressions.
3. High-value usability improvements to shipped journeys.
4. Coherent design/content polish and maintainability refactors.
5. Distinctive optional features.
6. Larger strategic expansions such as new sections and locales.

Fix regressions before polishing the same surface, sequence prerequisites before
dependants, and avoid broad file moves while accepted work is changing the same files.
Assignee means ownership and milestone means grouping; neither proves priority. Never
invent unreadable GitHub Project status or present inferred sequencing as confirmed.

## Issue Status Management

Always update issue status appropriately:

- **Todo**: Not yet started
- **In Progress**: Currently being worked on
- **Done**: Completed
- **On Hold**: Paused or blocked

## Issue Types & Templates

### Tasks

**Labels**: `task`
**Hierarchy**: Standalone
**Milestone**: Optional; use only when it helps sequence delivery

**Template**:

```markdown
## Summary

[Clear, actionable description]

## Steps to Complete

- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Expected Outcome

[What success looks like]

## Affected Files/Components

- `path/to/file1.js`
- `path/to/file2.css`
```

### Bugs

**Labels**: `bug`
**Hierarchy**: Standalone
**Milestone**: Optional; use only when it helps sequence delivery

**Template**:

```markdown
## Summary

[Brief description of the issue]

## Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior

[What should happen]

## Actual Behavior

[What actually happens]

## Additional Context

[Logs, screenshots, environment details if relevant]
```

## Backlog Structure

```
Milestone
├─ Task 1
├─ Task 2
└─ Bug 1
```

Keep the backlog to one actionable issue level:

- Use only `task` and `bug` issue types.
- Do not create feature, epic, or parent tracking issues.
- Put shared context and requirements directly in each actionable issue.
- Use milestones and cross-references for grouping and sequencing without introducing
  parent/child hierarchy.

## Best Practices

- **Titles**: Use imperative mood ("Add user authentication" not "Adding user authentication")
- **Labels**: Always apply exactly one type label (`task` or `bug`)
- **Milestones**: Use milestones only when they add useful delivery grouping
- **Cross-references**: Link related or dependent issues using `#issue-number`
- **Task Lists**: Use checkboxes for trackable progress
- **Assignees**: Set clear ownership when creating issues
- **Agent-Ready**: Write issues to be potentially assignable to GitHub coding agents by:
    - Including specific file paths and locations when relevant
    - Providing clear technical requirements and constraints
    - Specifying expected code patterns or frameworks to use
    - Adding detailed acceptance criteria that can be programmatically verified
    - Including examples of desired inputs/outputs when applicable

## Quality Gates

Before creating an issue, verify these criteria. Do not restate this normalization
checklist in the issue itself:

- [ ] Title is clear and actionable
- [ ] Appropriate labels are applied
- [ ] Template sections are completed
- [ ] Success criteria are measurable
- [ ] Related work and dependencies are linked without creating parent/child hierarchy

## Backlog Triage

When reviewing existing issues:

- Read the repository specs and inspect the current implementation before deciding that
  an issue is still valid.
- Search open and recently closed issues by concept, component, symptom, and desired
  outcome before creating anything new.
- Close work already present in the code as `completed`.
- Close obsolete proposals, intentionally dropped work, and broad tracker issues as
  `not planned` after moving any still-useful actionable context into a standalone task
  or bug.
- Refine vague issues around one observable problem and one measurable outcome. If an
  issue cannot be picked up without making major product decisions, it is not ready.
- Preserve user intent when refining. Do not silently replace the requested outcome
  with an implementation idea.
- When the best design is uncertain, document constraints and options to evaluate. Do
  not make one speculative solution an acceptance criterion.
- Keep descriptions self-contained. Cross-references provide context but must not be
  required to understand or implement the issue.

## Audit-Derived Issues

For issues created or refined from Lighthouse, accessibility, performance, SEO, build,
or production diagnostics:

- Start with accessibility and the WCAG 2.1 AA contract. Lighthouse is supporting
  evidence, not a substitute for keyboard, focus, semantics, contrast, zoom/reflow,
  theme, and reduced-motion checks.
- Treat tool output as evidence against the specs, not as an automatic issue list.
- Reproduce findings on canonical prerendered or deployed routes before creating an
  issue. Local preview fallbacks and development-only behavior may produce false
  positives.
- Prefer updating an existing issue when it already owns the desired outcome.
- Include the tool version, environment, route, measured current behavior, affected
  component, and a repeatable verification step.
- Include the relevant WCAG criterion and manual reproduction steps for accessibility
  findings.
- Group repeated failures caused by a shared token, component, dependency, or
  integration into one issue.
- Do not create issues for score-only changes, small theoretical savings, or
  debugging-only limitations unless they have a clear project requirement or user
  impact.
- Keep raw reports and temporary browser tooling outside the repository.
- Use the `triage-accessibility` skill for the complete local and production audit
  workflow.
