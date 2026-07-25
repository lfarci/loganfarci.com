---
name: "🤠 Ticket Tamer"
# Auto-triage: runs on issues labeled `task` (the actionable, agent-sized unit) and
# hands ready work to Copilot. Features are epics and bugs are triaged elsewhere, so
# only tasks reach the coding agent automatically.
# The `/tame` slash command lives in agent-ticket-tamer-command.md (gh-aw does not
# allow a command trigger and an `issues` trigger in the same workflow).
on:
  issues:
    types: [opened, edited, labeled]

# Only proceed for issues that carry the `task` label. When triggered by a `labeled`
# event, only react to the label that adds `task` — otherwise labels this workflow
# applies itself (e.g. `needs-clarification`, `agent:working`) would retrigger a full
# run and post duplicate comments.
if: ${{ contains(github.event.issue.labels.*.name, 'task') && (github.event.action != 'labeled' || github.event.label.name == 'task') }}

permissions:
  contents: read
  issues: read
  pull-requests: read

network: defaults

tools:
  github:
    toolsets: [default]

safe-outputs:
  # Start a Copilot coding agent session for the ready issue instead of relying on
  # issue assignee availability in the repository.
  create-agent-session:
    base: main
    github-token: ${{ secrets.GH_AW_AGENT_TOKEN || secrets.COPILOT_GITHUB_TOKEN }}
  add-comment:
    max: 1
  add-labels:
    allowed: [needs-clarification, agent:working]
    max: 2
  # Allow clearing the clarification flag once an edited issue becomes ready and is
  # handed off, so it is not left marked both `needs-clarification` and `agent:working`.
  remove-labels:
    allowed: [needs-clarification]
    max: 1
---

{{#runtime-import .github/shared/ticket-triage.md}}
