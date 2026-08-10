
# Copilot Instructions for loganfarci.com

## Overview

This repository is a Vite + React (TypeScript) web app with SSR prerendering, styled with Tailwind CSS and local shadcn-style Radix primitives, deployed as a static web app on Azure via Terraform. It is designed for maintainability, extensibility, and cloud-native best practices.

The [`docs/specs/`](../docs/specs/README.md) folder is the source of truth for
architecture, quality bars, data contracts, content style, non-goals, and the product
vision. This file stays focused on the directory layout, developer workflows, and
conventions; defer to the specs for detailed design decisions.

## Project Architecture

```
loganfarci.com/
├── content/               # Content managed outside the app
│   ├── articles/          # Markdown articles (.md)
│   └── data/              # JSON data files (certifications, experiences, skills, etc.)
├── infra/                 # Terraform infrastructure (Azure Static Web Apps, DNS)
├── scripts/               # Environment management scripts
└── src/                   # Frontend application (Vite project root)
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── eslint.config.mjs
    ├── index.html
    ├── plugins/           # Custom Vite plugins (e.g., vite-plugin-markdown.ts)
    ├── public/            # Static assets served as-is
    │   ├── staticwebapp.config.json
    │   └── images/        # Images and icons
    ├── scripts/           # Build scripts (e.g., prerender.mjs)
    └── src/               # Application source code
        ├── main.tsx       # Client entry point
        ├── entry-server.tsx # SSR entry point
        ├── App.tsx
        ├── routes.tsx
        ├── globals.css
        ├── app/           # App-level setup
        ├── components/    # Shared UI components
        ├── contexts/      # React contexts
        ├── core/          # Core utilities and logic
        ├── pages/         # Page components
        └── types/         # TypeScript type definitions
```

- **Infrastructure:**
  - Managed in `infra/` using Terraform.
  - Provisions Azure Static Web Apps and DNS zones.
  - All cloud resources are defined in code; resource names must not be hardcoded.

## Developer Workflows

All commands must be run from the `src/` directory (the Vite project root).

- **Local Development:**
  - Start dev server: `npm run dev`
- **Build:**
  - Full production build (client + SSR + prerender): `npm run build`
  - Client only: `npm run build:client`
  - SSR bundle only: `npm run build:server`
  - Prerender static HTML: `npm run prerender`
- **Preview:**
  - Preview production build: `npm run preview`
- **Linting:**
  - Run linter: `npm run lint` (ESLint config: `src/eslint.config.mjs`)
- **Azure Deployment:**
  - Infrastructure: Terraform files in `infra/`
  - Static web app: deploy `src/dist/` using the SWA CLI with a deployment token
  - Variables in `infra/variables.tf`
- **Custom Domain:**
  - Managed via Azure DNS zone (`infra/main.tf`)

## Coding Conventions

The quality bar (TypeScript strictness, Tailwind + semantic tokens, path aliases,
testing, linting) is owned by [`docs/specs/quality-bars.md`](../docs/specs/quality-bars.md)
and [`docs/specs/architecture.md`](../docs/specs/architecture.md). In short: TypeScript
for all code, Tailwind for styling (extend the theme in `src/tailwind.config.ts`), and
the `@/` (→ `src/src/`) and `@content/` (→ `content/`) aliases. Write clear, maintainable
code with comments only where they clarify.

## Pull Request Title Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for **pull request titles**. The pull request title becomes the commit message on the main branch when squash merging.

**Format**: `type(scope): description`

**Allowed types**: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `style`, `perf`, `revert`

**Scope** is optional. **Description** is required and must be in lowercase.

**Examples**:
- `feat: add dark mode toggle`
- `fix: resolve hydration mismatch on reload`
- `chore: update dependencies`
- `refactor(api): simplify authentication middleware`

A GitHub Actions workflow (`check-pull-request-title`) validates every pull request title using [action-semantic-pull-request](https://github.com/amannn/action-semantic-pull-request). Pull requests with invalid titles will fail the check and cannot be merged until the title is corrected.

## Patterns and Integration

Routing, the SSR + prerender contract, and the markdown/JSON content pipeline are
documented authoritatively in [`docs/specs/architecture.md`](../docs/specs/architecture.md).
Data model shapes for `content/data/*.json` and `src/src/types/` live in
[`docs/specs/data-contracts.md`](../docs/specs/data-contracts.md).

- **Terminal UI:**
  - Located in `src/src/components/terminal/`, implements a command pattern via `src/src/core/Commands.ts` for extensible command handling.

## Azure-Specific Guidance

- Provision all cloud resources in Azure using Terraform; never hardcode resource names.
- Static web app configuration is in `src/public/staticwebapp.config.json`.
- Build output is in `src/dist/`; deploy this directory to Azure Static Web Apps.
- For infrastructure changes, update Terraform files and document changes in code comments.
- Follow Azure best practices for security, scalability, and cost management.

## Additional Notes

- For onboarding, see `README.md` for setup instructions and project details.
- For architecture, quality bars, data contracts, content style, non-goals, and the vision, see [`docs/specs/`](../docs/specs/README.md).
- Use the provided scripts in `scripts/` for environment management.
- Keep dependencies up to date and review for security regularly.

## GitHub Operations Preference

For GitHub operations (issues, pull requests, repositories, workflow runs, etc.), prefer MCP tools over the `gh` CLI. MCP tools provide structured output and better integration with the Copilot ecosystem.

---
For questions or improvements, open an issue or pull request.