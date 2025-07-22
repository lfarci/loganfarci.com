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
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Lint code:**

   ```bash
   npm run lint
   ```

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
