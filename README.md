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

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Lint code:**

   ```bash
   npm run lint
   ```

## Analytics

The site uses **Azure Application Insights** in cookieless mode to track basic
activity (page views, sessions, referrers, geography, devices). No cookies are
set, so no consent banner is required under GDPR.

- The instrumentation resource is provisioned by Terraform in `infra/`
  (`azurerm_application_insights`, workspace-based, with a daily ingestion cap
  via `application_insights_daily_cap_gb` to stay safely within the free tier).
- Its connection string is exposed as a Terraform output and written to Azure
  Key Vault by `.github/workflows/azure-resources.yml` as
  `ApplicationInsightsConnectionString`.
- The SWA deploy workflow reads the secret from Key Vault and injects it at
  build time as `VITE_APPINSIGHTS_CONNECTION_STRING`.
- The client SDK is initialized in `src/src/core/appInsights.ts` via the
  `<Analytics />` component mounted in `App.tsx`. Initialization is gated on
  `import.meta.env.PROD` and the presence of the connection string, so dev
  builds never send telemetry.
- **To disable analytics**, leave `VITE_APPINSIGHTS_CONNECTION_STRING` unset
  (the default in local dev).
- View the dashboard at *Azure Portal → Application Insights → Usage*.

## Technology stack

| Name                  | Description                                                  | Type  | Link                                                                                   |
| --------------------- | ------------------------------------------------------------ | ----- | -------------------------------------------------------------------------------------- |
| Next.js               | React framework for building web apps with SSR/SSG/ISR       | Web   | [Next.js](https://nextjs.org/)                                                         |
| React                 | JavaScript library for building user interfaces              | Web   | [React](https://react.dev/)                                                            |
| TypeScript            | Typed superset of JavaScript                                 | Web   | [TypeScript](https://www.typescriptlang.org/)                                          |
| Tailwind CSS          | Utility-first CSS framework for rapid UI development         | Web   | [Tailwind CSS](https://tailwindcss.com/)                                               |
| HeroUI                | Component library for Tailwind CSS                           | Web   | [HeroUI](https://heroui.com/)                                                          |
| Azure Static Web Apps | Azure service for hosting static web applications            | Cloud | [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static) |
| Terraform             | Infrastructure as Code tool for provisioning cloud resources | IaC   | [Terraform](https://www.terraform.io/)                                                 |
| Azure CLI             | Command-line tool for managing Azure resources               | Cloud | [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/)                              |
| GitHub Actions        | CI/CD platform for automating workflows and deployments      | CI/CD | [GitHub Actions](https://github.com/features/actions)                                  |
