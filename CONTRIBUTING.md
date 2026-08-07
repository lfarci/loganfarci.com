# Contributing to loganfarci.com

Thanks for your interest in contributing! This guide covers the conventions and workflows used in this project.

## Commit & PR Title Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for **PR titles**. The PR title is used to generate changelogs and provides a clear history of changes.

### Format

```
type(scope): description
```

- **type** (required): one of the allowed types below.
- **scope** (optional): a short label for the area of change (e.g. `auth`, `ui`, `api`).
- **description** (required): a concise summary of the change in lowercase.

### Allowed Types

| Type | When to use |
|------|-------------|
| `feat` | A new feature or capability |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `chore` | Maintenance tasks, dependency updates, config changes |
| `refactor` | Code restructuring without changing behavior |
| `test` | Adding or updating tests |
| `ci` | CI/CD pipeline changes |
| `style` | Code style changes (formatting, whitespace) |
| `perf` | Performance improvements |
| `revert` | Reverting a previous commit |

### Examples

- `feat: add dark mode toggle`
- `fix: resolve hydration mismatch on reload`
- `chore: update dependencies`
- `refactor(api): simplify auth middleware`

### Enforcement

A GitHub Actions workflow (`pr-title`) validates every PR title against this convention. PRs with invalid titles will fail the check and cannot be merged until the title is corrected.

## Development Workflow

All commands must be run from the `src/` directory (the Vite project root).

```bash
cd src
npm install
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # Run linter
```

## Code Style

- **TypeScript** for all source code
- **Tailwind CSS** for styling (extend the theme in `src/tailwind.config.ts`)
- Path aliases: `@/` → `src/src/`, `@content/` → `content/`

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes following the conventions above
3. Ensure all checks pass (lint, build, tests)
4. Open a PR with a valid Conventional Commits title
5. Request a review

## Questions?

Open an issue or reach out to the maintainers.
