---
name: "🤠 Ticket Tamer (command)"
# On-demand triage for existing issues: comment `/tame` on any issue to (re-)run the
# Ticket Tamer. This is a manual override, so it is not restricted to `task`-labeled
# issues — the agent's own scope check still applies.
on:
  slash_command:
    name: tame

permissions:
  contents: read
  issues: read
  pull-requests: read

network: defaults

tools:
  github:
    toolsets: [default]

safe-outputs:
  assign-to-agent:
    name: copilot
    target: triggering
    github-token: ${{ secrets.GH_AW_AGENT_TOKEN }}
  add-comment:
    max: 1
  add-labels:
    allowed: [needs-clarification, agent:working]
    max: 2
  # Clear the clarification flag on hand-off so the issue is not left marked both
  # `needs-clarification` and `agent:working`.
  remove-labels:
    allowed: [needs-clarification]
    max: 1
---

{{#runtime-import .github/shared/ticket-triage.md}}
