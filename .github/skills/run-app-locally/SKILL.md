---
name: run-app-locally
description: Start and verify the loganfarci.com application on the local machine. Use when asked to run, launch, serve, preview, or open the app locally for development or review.
---

# Run App Locally

Read `AGENTS.md` and `.github/copilot-instructions.md` before starting. Keep
those files authoritative.

1. Work from `src/`.
2. Run `npm ci` only when dependencies are missing.
3. Use development mode by default:

    ```bash
    npm run dev -- --host 127.0.0.1
    ```

4. If the user asks to inspect the production build locally, run:

    ```bash
    npm run build
    npm run preview -- --host 127.0.0.1
    ```

5. Keep the server process running, wait for Vite to report readiness, and
   provide the exact local URL. Do not open a browser unless asked.
6. If the selected port is unavailable, report the URL Vite selected. Do not
   stop unrelated processes.
7. When asked to stop, terminate only the server process started by this skill.
