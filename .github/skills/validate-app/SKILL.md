---
name: validate-app
description: Validate the loganfarci.com application with its complete local quality gate. Use when asked to check, validate, verify, test, build, or determine whether the app is ready to ship.
---

# Validate App

Read `AGENTS.md`, `.github/copilot-instructions.md`, and
`docs/specs/quality-bars.md` before validating. Keep those files authoritative.

1. Confirm the repository state with `git status -sb`. Do not modify or discard
   unrelated changes.
2. Work from `src/`.
3. Run `npm ci` only when dependencies are missing or the user explicitly asks
   for a clean install.
4. Inspect the scripts in `package.json`. Run `npm run format:check` first when
   that script exists.
5. Run the required quality gate in this order:

    ```bash
    npm run lint
    npm run test
    npm run build
    ```

6. Stop at the first failure, preserve its useful output, and identify the
   failing command and likely cause. Do not fix failures unless asked.
7. Report every command run, its result, and any validation that was skipped.
