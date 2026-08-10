---
applyTo: ".github/agents/**/*.agent.md"
---

# Custom Agent Definition Instructions

Derive delivery-agent behavior from `docs/agents/feature-delivery-manager.md` and
backlog-agent behavior from `docs/agents/backlog-maintainer.md`.

- Use only verified frontmatter fields and tools. A missing or renamed required tool is
  a blocker, never a reason to grant a wildcard toolset.
- State each role's artifact contract, approval boundary, and manual fallback without
  duplicating shared policy from its design of record.
- Keep read-only roles free of `edit`, `execute`, and publication/deployment tools.
- Treat generic execution as behavioral control only unless the target surface provides
  verified scoped execution and credentials.
