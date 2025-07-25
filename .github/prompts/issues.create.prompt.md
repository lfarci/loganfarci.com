---
mode: "agent"
model: GPT-4.1
tools: ["create_issue", "get_issue", "get_issue_comments", "codebase"]
description: "Create a GitHub issue for loganfarci.com repository following project guidelines"
---

Create a new GitHub issue for the loganfarci.com repository using the provided context and following the project's issue management guidelines.

## Context

**Description**: ${input:description}
**Type**: ${input:type} (feature/task/bug - if not provided, infer from description)
**Labels**: ${input:labels} (optional - will be inferred if not provided)
**Milestone**: ${input:milestone} (optional - will be selected based on description if not provided)
**Parent Issue**: ${input:parent_issue} (optional - for tasks/bugs that belong to a feature)

## Instructions

**IMPORTANT**: Follow the [GitHub Issues Instructions file](../instructions/issues.instructions.md) for all formatting, templates, and conventions.

### Step 1: Analysis

- Determine the issue type (feature/task/bug) from the description
- Identify appropriate labels, milestone, and hierarchy placement
- Check for existing related issues to avoid duplicates

### Step 2: Content Generation

- Create an imperative, actionable title
- Use the appropriate template from the instructions file based on issue type
- Ensure all required template sections are completed
- Make the issue agent-ready with specific technical details

### Step 3: Metadata Assignment

- Apply type label (`feature`, `task`, or `bug`)
- Add milestone (select existing or recommend creation)
- Link to parent issue if this is a child issue
- Set appropriate assignee if specified

### Step 4: Quality Check

Verify the issue meets quality gates:

- [ ] Title is clear and actionable
- [ ] Appropriate labels are applied
- [ ] Template sections are completed
- [ ] Success criteria are measurable
- [ ] Issue is properly linked to parent/children

## Output

After creating the issue, provide:

- **Issue Number**: #123
- **Issue URL**: Direct link to the created issue
- **Title**: The generated title
- **Type**: feature/task/bug
- **Labels**: All assigned labels
- **Milestone**: Assigned milestone
- **Parent/Child Links**: Any hierarchical relationships established

## Examples

**Feature Request Input**: "Add dark mode toggle to website header"
**Expected Output**: Feature issue with acceptance criteria, implementation notes, and proper labeling

**Bug Report Input**: "Navigation menu overlaps content on mobile"
**Expected Output**: Bug issue with reproduction steps, expected/actual behavior, and technical context

**Task Input**: "Update footer copyright year to 2025"
**Expected Output**: Task issue with clear steps, affected files, and expected outcome
