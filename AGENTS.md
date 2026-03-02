# AGENTS.md

This file provides context and instructions for AI coding agents working on this repository.

## Project Overview

**loganfarci.com** is a personal website for Logan Farci. It is a Vite + React (TypeScript) single-page application with SSR prerendering, styled with Tailwind CSS and the HeroUI component library. The site is deployed as an Azure Static Web App and provisioned using Terraform.

### Architecture

```
loganfarci.com/
├── content/               # Content managed separately from app code
│   ├── articles/          # Markdown articles (.md files with YAML front matter)
│   └── data/              # JSON data files (certifications, experiences, skills, etc.)
├── infra/                 # Terraform infrastructure (Azure Static Web Apps, DNS)
├── scripts/               # Environment management scripts
└── src/                   # Frontend application (Vite project root)
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── eslint.config.mjs
    ├── plugins/           # Custom Vite plugins (e.g., vite-plugin-markdown.ts)
    ├── public/            # Static assets (staticwebapp.config.json, images/)
    ├── scripts/           # Build scripts (prerender.mjs)
    └── src/               # Application source code
        ├── main.tsx       # Client entry point
        ├── entry-server.tsx # SSR entry point
        ├── App.tsx
        ├── routes.tsx
        ├── components/    # Shared UI components
        ├── contexts/      # React contexts
        ├── core/          # Core utilities and logic
        ├── pages/         # Page components
        └── types/         # TypeScript type definitions
```

### Key Technologies

- **Vite** — build tool and dev server
- **React 19** + **TypeScript** — UI framework
- **React Router v7** — client-side routing
- **Tailwind CSS v4** + **HeroUI** — styling and component library
- **gray-matter** — YAML front matter parsing for articles
- **Azure Static Web Apps** — hosting
- **Terraform** — infrastructure provisioning

## Setup Commands

All commands must be run from the `src/` directory (the Vite project root where `package.json` lives).

```bash
# Install dependencies
cd src
npm install

# (Optional) Set up environment variables for local development
cp .env.local.example .env.local
# Edit .env.local to customize content paths if needed (defaults work out of the box)
```

## Development Workflow

```bash
cd src

# Start the development server (hot-reload at http://localhost:5173)
npm run dev

# Preview a production build
npm run preview
```

### Environment Variables

Environment variables are optional for local development. Defaults resolve `content/` directories relative to `src/`.

| Variable             | Description                                      | Default                   |
|----------------------|--------------------------------------------------|---------------------------|
| `ARTICLES_DIRECTORY` | Path to the articles directory                   | `../content/articles`     |
| `DATA_DIRECTORY`     | Path to the data directory                       | `../content/data`         |
| `VITE_COMMIT_HASH`   | Build identifier displayed in the site footer    | _(empty)_                 |

## Build

All commands must be run from `src/`.

```bash
# Full production build (runs all three steps below in sequence)
npm run build

# Individual steps:
npm run build:client    # Vite client bundle → dist/
npm run build:server    # SSR bundle → dist/server/
npm run prerender       # Prerender static HTML for all routes → dist/
```

Build output is in `src/dist/`.

### Build with a custom commit hash (e.g., for preview or CI deployments)

```bash
VITE_COMMIT_HASH=$(git rev-parse HEAD) npm run build
```

## Testing Instructions

This project does not currently have a dedicated test suite. Before submitting changes:

1. Run the linter to catch errors:
   ```bash
   cd src && npm run lint
   ```
2. Run a full build to verify nothing is broken:
   ```bash
   cd src && npm run build
   ```
3. Start the dev server and manually verify any UI changes:
   ```bash
   cd src && npm run dev
   ```

## Code Style

- **TypeScript** is required for all new code — no plain `.js` files in `src/src/`.
- **Tailwind CSS** for all styling — extend the theme in `src/tailwind.config.ts`, not inline styles.
- **Functional React components** and hooks only — no class components.
- **HeroUI** components for UI consistency where applicable.
- **Import aliases**: use `@/` for `src/src/` and `@content/` for `content/` (configured in `tsconfig.json` and `vite.config.ts`).
- **ESLint + Prettier** for linting and formatting. Run `npm run lint` before committing.
- Linting uses `typescript-eslint` with type-checked rules and `eslint-config-prettier`.

## Content Pipeline

### Articles

- Markdown files live in `content/articles/`.
- Each file must include YAML front matter with: `title`, `description`, `publishedAt`, `featured`, `tags`, `author`, `coauthoredWithAgent`.
- Loaded at build time via the custom `vite-plugin-markdown` Vite plugin (`src/plugins/vite-plugin-markdown.ts`).
- Core article utilities are in `src/src/core/articles.ts`.

### Structured Data

- JSON files in `content/data/` (e.g., `certifications.json`, `experiences.json`, `skills.json`).
- Imported directly via `src/src/core/data.ts`.
- TypeScript types for all data models are in `src/src/types/`.

## Routing

Routes are defined in `src/src/routes.tsx`. All routes are prerendered to static HTML during the build.

Current routes:
- `/` — Home page
- `/about` — About page
- `/articles` — Articles listing
- `/articles/:slug` — Individual article page
- `*` — 404 Not Found page

## Deployment

### Azure Static Web Apps

Deploy the `src/dist/` directory using the SWA CLI after building:

```bash
npx swa deploy ./dist \
  --deployment-token <TOKEN> \
  --env <preview|production>
```

- Get the deployment token from Azure Portal → Static Web App → Manage deployment token, or from CI secrets.
- Never hardcode the deployment token.
- `src/public/staticwebapp.config.json` is automatically included in the dist output and picked up by Azure.

### Infrastructure (Terraform)

All Azure resources are defined in `infra/`. Use Terraform to provision or update cloud infrastructure.

```bash
cd infra
terraform init
terraform plan
terraform apply
```

Resource names must never be hardcoded — use variables defined in `infra/variables.tf`.

## Pull Request Guidelines

- Run `npm run lint` and `npm run build` from `src/` before submitting.
- Keep changes focused and minimal — avoid unrelated modifications.
- Update `AGENTS.md` if you change developer workflows, build steps, or project structure.
- For content changes (articles or data), follow the front matter conventions in `content/articles/`.

## Common Gotchas

- **All npm commands must be run from `src/`**, not the repository root. There is no `package.json` at the root.
- The `content/` directory is outside the Vite project root. The dev server allows reading it via `server.fs.allow: [".."]` in `vite.config.ts`.
- The `@content/` alias resolves to `../content/` (relative to `src/`). Use it in imports instead of relative paths.
- SSR uses `react-helmet-async` which is bundled with `ssr.noExternal` in `vite.config.ts` to work correctly in the ESM SSR bundle.
- `StaticRouter` (for SSR) is exported from `react-router`, not `react-router/server`.
- Do not create `swa-cli.config.json` manually — always use `swa init`.
