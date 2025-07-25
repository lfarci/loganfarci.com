---
mode: "agent"
model: GPT-4.1
tools: ["update_issue", "get_issue", "get_issue_comments", "list_issues"]
description: "Normalize and update existing GitHub issues to follow project guidelines"
---

Normalize the existing issue ${input:issue} in the loganfarci.com repository to ensure it adheres to the project's issue management guidelines.

## Instructions

**IMPORTANT**: Follow the [GitHub Issues Instructions file](../instructions/issues.instructions.md) for all formatting, templates, and conventions.

### Step 1: Issue Analysis

- Retrieve the current issue details using `get_issue`
- Identify the issue type (feature/task/bug) from content
- Assess current compliance with project guidelines
- Check hierarchy relationships (parent/child issues)

### Step 2: Title Normalization

- Ensure title uses imperative mood ("Add feature" not "Adding feature")
- Make title concise and descriptive (sentence case, only first letter capitalized)
- Verify title clearly indicates the action/outcome
- Maximum length should be descriptive but brief

### Step 3: Description Standardization

Apply the appropriate template based on issue type:

**For Features:**

- Summary section
- Acceptance criteria with checkboxes
- Implementation notes
- Dependencies (if applicable)

**For Tasks:**

- Summary section
- Steps to complete with checkboxes
- Expected outcome
- Affected files/components

**For Bugs:**

- Summary section
- Steps to reproduce
- Expected vs actual behavior
- Additional context (logs, screenshots, etc.)

### Step 4: Metadata Optimization

- **Labels**: Ensure correct type label (`feature`, `task`, `bug`) is applied
- **Milestone**: Assign appropriate milestone based on issue context
- **Hierarchy**: Link to parent issues for tasks/bugs if applicable
- **Assignees**: Maintain existing assignees unless inappropriate

### Step 5: Agent-Ready Enhancement

Ensure the issue is optimized for potential GitHub coding agent assignment:

- Include specific file paths when relevant
- Add clear technical requirements and constraints
- Specify expected code patterns or frameworks
- Provide detailed, measurable acceptance criteria
- Include input/output examples when applicable

### Step 6: Quality Validation

Verify the updated issue meets quality gates:

- [ ] Title is clear and actionable
- [ ] Appropriate labels are applied
- [ ] Template sections are completed
- [ ] Success criteria are measurable
- [ ] Issue is properly linked to parent/children
- [ ] Content is agent-ready with technical specifics

## Output

After updating the issue, provide:

### Summary of Changes

- **Title Changes**: Before → After (if modified)
- **Description Updates**: List of sections added/modified
- **Label Changes**: Added/removed labels
- **Milestone Assignment**: Current milestone status
- **Hierarchy Updates**: Any parent/child relationships established

### Updated Issue Details

- **Issue Number**: #${input:issue}
- **Final Title**: The normalized title
- **Type**: feature/task/bug
- **Current Labels**: All applied labels
- **Milestone**: Assigned milestone
- **Status**: Current issue status
- **Agent-Ready**: Confirmation of technical detail inclusion

### Compliance Report

- **Template Compliance**: ✅/❌ Follows appropriate template
- **Guidelines Adherence**: ✅/❌ Meets project standards
- **Technical Readiness**: ✅/❌ Ready for coding agent assignment

## Documentation

Add a comment to the issue documenting the normalization changes:

```
## Issue Normalized
This issue has been updated to comply with project guidelines:
- [x] Title normalized to imperative mood
- [x] Description updated with proper template
- [x] Labels and milestone assigned
- [x] Enhanced for coding agent compatibility

Updated by: Issue Normalization Agent
```
