---
applyTo: "infra/**/*.tf"
---

# Terraform Infrastructure Instructions

Follow the root Azure guidance and existing Terraform conventions.

- Keep resources declarative, reviewable, and idempotent; use variables and locals
  rather than hardcoded resource names.
- Do not introduce secrets, credentials, or environment-specific values into tracked
  Terraform files.
- Preserve environment separation and make destructive changes explicit in review.
- Limit changes to infrastructure required by the accepted scope.
