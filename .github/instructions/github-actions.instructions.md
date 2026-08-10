---
applyTo: ".github/workflows/**/*,.github/actions/**/*"
---

# GitHub Actions Instructions

Follow the root guidance and existing workflow conventions.

- Use the least `permissions:` required by each job and avoid broad write permissions.
- Never commit credentials, deployment tokens, or secret values; use existing secrets
  and variables only when already required by the workflow.
- Keep workflow triggers, environment separation, and reusable-workflow inputs
  reviewable. Do not introduce unrelated deployment paths.
- Make automation idempotent and keep action versions consistent with existing project
  conventions.
