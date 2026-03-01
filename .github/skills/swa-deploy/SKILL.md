---
name: swa-deploy
description: Handles building and deploying the loganfarci.com application to Azure Static Web Apps using the SWA CLI. Use when the user asks to deploy to a preview or production environment, rebuild and redeploy, or inject a commit hash into the build.
---

## Overview

This project is a Vite + React (TypeScript) app with SSR prerendering. All build and deploy commands must be run from the `src/` directory (the Vite project root, where `package.json` lives).

**Key facts:**
- Build output: `src/dist/`
- Deployment token: provided by the user or retrieved from Azure Portal / CI secrets; never hardcode it
- Azure SWA resource: defined in `infra/variables.tf` and `infra/main.tf`; ask the user for the deployment token if not provided
- Commit hash env var: `VITE_COMMIT_HASH` — injected at build time and displayed in the footer

## Build

Always build from `src/`:

```bash
cd /path/to/repo/src

# Standard build
npm run build

# Build with a custom commit hash label (e.g. for preview/local builds)
VITE_COMMIT_HASH=<value> npm run build
```

The build script runs three steps in sequence:
1. `npm run build:client` — Vite client bundle → `dist/`
2. `npm run build:server` — SSR bundle → `dist/server/`
3. `npm run prerender` — Static HTML for all routes

## Deploy

Use the SWA CLI (`npx swa deploy`) after building:

```bash
npx swa deploy ./dist \
  --deployment-token <TOKEN> \
  --env <preview|production>
```

### Environments

| Environment  | Flag             | Notes                         |
|-------------|-----------------|-------------------------------|
| Preview      | `--env preview`  | Used for testing/staging       |
| Production   | `--env production` | Used for the live site        |

### Combined build + deploy (one-liner)

```bash
cd src && VITE_COMMIT_HASH=<label> npm run build && \
  npx swa deploy ./dist \
    --deployment-token <TOKEN> \
    --env preview
```

## Commit Hash Convention

`VITE_COMMIT_HASH` is displayed in the site footer as a build identifier. Use meaningful values:

| Scenario                   | Suggested value         |
|---------------------------|------------------------|
| Local / manual preview     | `local-build`          |
| Named feature preview      | `<feature-name>` (e.g. `nodefix`, `label`) |
| CI/CD production build     | Output of `git rev-parse HEAD` |

Example — inject the actual latest git commit hash:

```bash
VITE_COMMIT_HASH=$(git rev-parse HEAD) npm run build
```

## Notes

- The `staticwebapp.config.json` in `src/public/` is automatically picked up by the SWA CLI from the dist folder.
- The SWA CLI downloads `StaticSitesClient` on first deploy to a new machine; subsequent deploys skip this step.
- `swa-cli.config.json` must be created with `swa init` — never create it manually.
