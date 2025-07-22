# Logan Farci's personal website

Welcome! This repository contains the source of my personal website: `www.loganfarci.com`. I built it using Next.js and TypeScript, styled using Tailwind CSS and the Heroui component library. It's currently running on Azure and it is deployed as a static web app.

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
