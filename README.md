# Personal Website

Welcome! This repository contains the source code for my personal website: [www.loganfarci.com](https://www.loganfarci.com).

**This site is the central entrypoint to my online presence and the content I share.** Here, you'll find my latest articles, technical notes, and resources, as well as a comprehensive overview of my professional profile—including work experience, education, and certifications.

## Prerequisites

> [!NOTE]
>
> This project includes a pre-configured  [devcontainer](https://containers.dev/)  for fast onboarding and consistent development environments. Don't know how to use it? Check the VS Code [tutorial](https://code.visualstudio.com/docs/devcontainers/tutorial).

Before you begin, ensure you have the following tools installed on your workstation:

- **Node.js** (v18+ recommended): JavaScript runtime for running and building the app. [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js): Package manager for JavaScript.
- **Terraform** (v1.5+ recommended): Infrastructure as code tool for provisioning Azure resources. [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- **Azure CLI**: Command-line tool for managing Azure resources. [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- **Docker**: (Optional, for local container builds) [Install Docker](https://www.docker.com/get-started/)

## Getting Started

1. **Install dependencies:**

    ```bash
    cd src
    npm install
    ```

2. **(Optional) Configure environment variables:**

    Copy the example environment file and customize it if needed:

    ```bash
    cp .env.local.example .env.local
    ```

    The application works out of the box with default values. Environment variables are only needed if you want to customize paths or run in special configurations.

3. **Refresh certifications (optional):**

    The public Microsoft Learn and Credly credential pages are listed in
    [`content/data/certification-sources.json`](content/data/certification-sources.json).
    Refresh the generated certification data and badge images when you want to check for new
    credentials:

    ```bash
    npm run sync:certifications
    git diff -- ../content/data/certifications.json public/images/certifications
    ```

    Review and commit any generated changes. The regular production build does not fetch
    credentials.

4. **Start development server:**

    ```bash
    npm run dev
    ```

5. **Build for production:**

    ```bash
    npm run build
    ```

6. **Lint code:**

    ```bash
    npm run lint
    ```

7. **Format code:**

    ```bash
    npm run format
    ```

    To verify formatting without changing files, run `npm run format:check`. The same
    check runs in CI.

## Agent workflow validation

Before running a live Product Owner -> Orchestrator -> Developer test, validate the
workflow contract locally from the repository root:

```bash
node scripts/validate-delivery-contract.mjs
```

This dependency-free check verifies the agent profiles, approval and dispatch boundaries,
independent `main`-based Developer branches, publication preconditions, and the two-cycle
quality-gate repair policy. It does not access GitHub or create sessions, branches, or pull
requests. Run one minimal live test after an App-runtime or credential-boundary change.

## Smoke tests (deployment validation)

Run smoke tests from `src/` against a deployed URL:

```bash
npm run smoke -- https://<your-swa-hostname>
```

You can also pass the hostname without protocol and the script normalizes it:

```bash
npm run smoke -- <your-swa-hostname>
```

What the smoke checks validate:

- HTML routes (`/`, `/about`, `/articles`, and one discovered `/articles/{slug}` from `sitemap.xml`) return `200` with `text/html`.
- Prerendered HTML content exists in `<main>` or `#root` (not blank output).
- SEO metadata exists on HTML routes: non-empty `<title>`, `<meta name="description">`, canonical `<link>`, `og:title`, `og:description`, and JSON-LD.
- Machine files (`/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`) return `200` with expected content-types and file-specific markers (to reject HTML fallback pages).
- A random unknown route serves the custom not-found fallback page (status `404`, or `200` with custom fallback markers).

## Further reading

- [Repository specs](docs/specs/README.md) — source-of-truth specs for architecture, quality bars, data contracts, content style, and non-goals.
- [Analytics](docs/analytics.md) — Azure Application Insights setup, cost guardrails, and how to disable telemetry.
- [Lighthouse accessibility checks](docs/lighthouse.md) — run the accessibility gate locally and download CI reports.

## Technology stack

| Name                  | Description                                                                           | Type  | Link                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------- |
| Vite                  | Build tool bundling the React SPA, with a custom SSR + prerender step for static HTML | Web   | [Vite](https://vite.dev/)                                                              |
| React                 | JavaScript library for building user interfaces                                       | Web   | [React](https://react.dev/)                                                            |
| TypeScript            | Typed superset of JavaScript                                                          | Web   | [TypeScript](https://www.typescriptlang.org/)                                          |
| Tailwind CSS          | Utility-first CSS framework for rapid UI development                                  | Web   | [Tailwind CSS](https://tailwindcss.com/)                                               |
| shadcn/ui + Radix UI  | Local component primitives with accessible Radix behavior                             | Web   | [shadcn/ui](https://ui.shadcn.com/)                                                    |
| Azure Static Web Apps | Azure service for hosting static web applications                                     | Cloud | [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static) |
| Terraform             | Infrastructure as Code tool for provisioning cloud resources                          | IaC   | [Terraform](https://www.terraform.io/)                                                 |
| Azure CLI             | Command-line tool for managing Azure resources                                        | Cloud | [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/)                              |
| GitHub Actions        | CI/CD platform for automating workflows and deployments                               | CI/CD | [GitHub Actions](https://github.com/features/actions)                                  |
