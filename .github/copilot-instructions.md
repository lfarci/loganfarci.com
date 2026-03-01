
# Copilot Instructions for loganfarci.com

## Overview

This repository is a Vite + React (TypeScript) web app with SSR prerendering, styled with Tailwind CSS and the Heroui theme, deployed as a static web app on Azure via Terraform. It is designed for maintainability, extensibility, and cloud-native best practices.

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

- Use **TypeScript** for all new code.
- Use **Tailwind CSS** for styling; extend theme in `src/tailwind.config.ts`.
- Prefer **functional React components** and hooks.
- Use the **Heroui theme** for UI consistency.
- Use the alias `@/` for imports from `src/src/` and `@content/` for imports from `content/` (see `src/tsconfig.json`).
- Write clear, maintainable code with descriptive comments where needed.

## Patterns and Integration

- **Routing:**
  - Client-side routing via React Router, configured in `src/src/routes.tsx`.
- **SSR + Prerendering:**
  - SSR entry point: `src/src/entry-server.tsx`.
  - Static HTML is prerendered for all routes via `src/scripts/prerender.mjs`.
- **Markdown Articles:**
  - Articles are stored as `.md` files in `content/articles/`.
  - Loaded at build time via the custom `vite-plugin-markdown` plugin (`src/plugins/vite-plugin-markdown.ts`).
  - Core article utilities are in `src/src/core/articles.ts`.
- **Terminal UI:**
  - Located in `src/src/components/terminal/`, implements a command pattern via `src/src/core/Commands.ts` for extensible command handling.
- **Content & Data:**
  - Article markdown files live in `content/articles/`.
  - Structured data (certifications, experiences, skills, etc.) lives in `content/data/` as JSON files.
  - Images and icons are in `src/public/images/`.
- **Data Modeling:**
  - TypeScript types for all data models are in `src/src/types/`.
  - Certifications, experience, and skills are modeled as typed objects for easy rendering and extension.

## Azure-Specific Guidance

- Provision all cloud resources in Azure using Terraform; never hardcode resource names.
- Static web app configuration is in `src/public/staticwebapp.config.json`.
- Build output is in `src/dist/`; deploy this directory to Azure Static Web Apps.
- For infrastructure changes, update Terraform files and document changes in code comments.
- Follow Azure best practices for security, scalability, and cost management.

## Additional Notes

- For onboarding, see `README.md` for setup instructions and project details.
- Use the provided scripts in `scripts/` for environment management.
- Keep dependencies up to date and review for security regularly.

---
For questions or improvements, open an issue or pull request.