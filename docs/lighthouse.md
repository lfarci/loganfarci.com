# Lighthouse accessibility checks

The project uses Lighthouse CI to prevent accessibility regressions in the
prerendered production build. The check audits these core routes:

- `/`
- `/about`
- `/articles`
- `/articles/mcp`

Every route must receive a Lighthouse accessibility score of at least 90. The
project's target remains 100, so known findings should still be addressed even when
the CI gate passes.

## Prerequisites

- Install the project dependencies with `npm ci`.
- Install Google Chrome or Chromium in the same environment where the command runs.

When using WSL, install a Linux browser inside WSL. Lighthouse cannot normally launch
a Chrome installation from Windows.

## Run locally

Run the production build and accessibility check from `src/`:

```sh
npm ci
npm run build
npm run accessibility
```

Lighthouse CI starts a temporary local server for `src/dist/`, runs the audits, and
exits with a non-zero status if any route scores below 90.

Reports are written to `src/lighthouse-reports/`. Open a `.report.html` file in a
browser to review the failed audits and affected elements. The corresponding JSON
files can be used for automated analysis.

## Browser discovery

Lighthouse usually discovers Chrome or Chromium automatically. If it does not, set
`CHROME_PATH` to the browser executable:

```sh
CHROME_PATH=/path/to/google-chrome npm run accessibility
```

For example, a common Linux path is:

```sh
CHROME_PATH=/usr/bin/google-chrome npm run accessibility
```

If Chrome starts but reports a missing shared library, install the browser through
the package manager for the current Linux distribution so its runtime dependencies
are installed as well.

## Configuration

The routes, score threshold, report destination, and Lighthouse category are defined
in [`src/lighthouserc.json`](../src/lighthouserc.json). Keep the local command and CI
workflow on the same configuration so local results match the merge gate.

The check intentionally runs only the accessibility category. Performance,
best-practices, and SEO scores are outside this workflow's scope.

## GitHub Actions

The [`Accessibility`](../.github/workflows/accessibility.yml) workflow runs on pull
requests and relevant pushes. It:

1. Installs dependencies.
2. Builds the prerendered application.
3. Runs `npm run accessibility`.
4. Uploads the HTML and JSON reports as the
   `lighthouse-accessibility-reports` artifact, even when the threshold fails.

To generate a report on demand:

1. Open the repository's **Actions** tab.
2. Select **Accessibility**.
3. Select **Run workflow** and choose a branch.
4. Download `lighthouse-accessibility-reports` from the completed workflow run.

Artifacts are retained for 14 days.

## Interpreting failures

A score below 90 fails the current CI gate. Any score below the target of 100 means
at least one automated Lighthouse accessibility audit failed. Use the HTML report to
identify the audit, affected DOM nodes, measured values, and remediation guidance.

Automated checks cover only issues detectable by Lighthouse. Keyboard navigation,
screen-reader behavior, focus order, zoom, and other requirements still need manual
testing as described in the [accessibility specification](./specs/accessibility.md).
