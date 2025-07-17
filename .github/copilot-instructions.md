
# Copilot Instructions for loganfarci.com

## Overview

This repository is a Next.js (TypeScript) web app using Tailwind CSS and the Heroui theme, deployed as a static web app on Azure via Terraform. It is designed for maintainability, extensibility, and cloud-native best practices.

## Project Architecture

- **Frontend:**
  - Next.js app in TypeScript, styled with Tailwind CSS and Heroui theme.
  - Main app logic: `src/app/`
  - Shared components: `src/components/`
  - Content modules: `src/content/`
  - Public assets (images, icons): `public/`
- **Infrastructure:**
  - Managed in `infra/` using Terraform.
  - Provisions Azure Static Web Apps and DNS zones.
  - All cloud resources are defined in code; resource names must not be hardcoded.

## Developer Workflows

- **Local Development:**
  - Start server: `npm run dev` (or `yarn/pnpm/bun dev`)
- **Build:**
  - Production build: `npm run build`
- **Linting:**
  - Run linter: `npm run lint` (ESLint config: `next/core-web-vitals`, `next/typescript`)
- **Azure Deployment:**
  - Infrastructure: Terraform files in `infra/`
  - Static web app: Azure deployment, variables in `infra/variables.tf`
- **Custom Domain:**
  - Managed via Azure DNS zone (`infra/main.tf`)

## Coding Conventions

- Use **TypeScript** for all new code.
- Use **Tailwind CSS** for styling; extend theme in `tailwind.config.ts`.
- Prefer **functional React components** and hooks.
- Use the **Heroui theme** for UI consistency.
- Use the alias `@/` for imports from `src/` (see `tsconfig.json`).
- Write clear, maintainable code with descriptive comments where needed.

## Patterns and Integration

- **Terminal UI:**
  - Located in `src/components/terminal/`, implements a command pattern via `src/core/Commands.ts` for extensible command handling.
- **Content Structure:**
  - TypeScript modules in `src/content/`.
  - Images and icons in `public/`.
- **Data Modeling:**
  - Certifications, experience, and skills are modeled as TypeScript objects for easy rendering and extension.

## Azure-Specific Guidance

- Provision all cloud resources in Azure using Terraform; never hardcode resource names.
- Static web app configuration is in `next.config.ts` (`output: 'export'`, `images.unoptimized: true`).
- For infrastructure changes, update Terraform files and document changes in code comments.
- Follow Azure best practices for security, scalability, and cost management.

## Additional Notes

- For onboarding, see `README.md` for setup instructions and project details.
- Use the provided scripts in `scripts/` for environment management.
- Keep dependencies up to date and review for security regularly.

---
For questions or improvements, open an issue or pull request.