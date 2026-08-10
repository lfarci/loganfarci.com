---
applyTo: "src/public/staticwebapp.config.json,.github/workflows/deploy-app.yml,.github/workflows/reusable-deploy-static-web-app.yml"
---

# Azure Static Web Apps Instructions

Follow the root Azure guidance and the existing deployment workflow conventions.

- Keep preview and production environments distinct and do not substitute deployment
  targets or mechanisms.
- Never add deployment tokens or credentials to repository files, logs, or artifacts.
- Preserve the build-output contract for `src/dist/` and make deployment changes
  reviewable and idempotent.
- Use the existing `swa-deploy` skill for an approved deployment; this instruction file
  does not authorize deployment.
