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

## Issue Status Management

Always update issue status appropriately:

- **Todo**: Not yet started
- **In Progress**: Currently being worked on
- **Done**: Completed
- **On Hold**: Paused or blocked

## Issue Types & Templates

### Features

**Labels**: `feature`  
**Parent**: Milestone  
**Children**: Tasks, Bugs

**Template**:

```markdown
## Summary

[Brief description of the feature]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Implementation Notes

[Any relevant design/technical details]

## Dependencies

[List any blocking issues or prerequisites]
```

### Tasks

**Labels**: `task`  
**Parent**: Feature  
**Milestone**: Same as parent feature

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
**Parent**: Feature (if applicable) or standalone  
**Milestone**: Same as parent feature (if applicable)

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

## Hierarchy Guidelines

```
Milestone
├─ Feature A
│  ├─ Task 1
│  └─ Bug 1 (related to Feature A)
├─ Feature B
│  └─ Task 1
└─ Bug 2 (standalone)
```

## Best Practices

- **Titles**: Use imperative mood ("Add user authentication" not "Adding user authentication")
- **Labels**: Always apply appropriate type labels (`feature`, `task`, `bug`)
- **Milestones**: Assign every issue to a milestone
- **Cross-references**: Link related issues using `#issue-number`
- **Task Lists**: Use checkboxes for trackable progress
- **Assignees**: Set clear ownership when creating issues
- **Agent-Ready**: Write issues to be potentially assignable to GitHub coding agents by:
  - Including specific file paths and locations when relevant
  - Providing clear technical requirements and constraints
  - Specifying expected code patterns or frameworks to use
  - Adding detailed acceptance criteria that can be programmatically verified
  - Including examples of desired inputs/outputs when applicable

## Quality Gates

Before creating an issue, ensure:

- [ ] Title is clear and actionable
- [ ] Appropriate labels are applied
- [ ] Template sections are completed
- [ ] Success criteria are measurable
- [ ] Issue is properly linked to parent/children
