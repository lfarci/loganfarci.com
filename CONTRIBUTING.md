# Contributing to loganfarci.com

Thanks for your interest in contributing! This guide covers the conventions and workflows used in this project.

## Commit and Pull Request Title Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for **pull request titles**. The pull request title is used to generate changelogs and provides a clear history of changes.

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
| `chore` | Maintenance tasks, dependency updates, configuration changes |
| `refactor` | Code restructuring without changing behavior |
| `test` | Adding or updating tests |
| `ci` | Continuous integration pipeline changes |
| `style` | Code style changes (formatting, whitespace) |
| `perf` | Performance improvements |
| `revert` | Reverting a previous commit |

### Examples

- `feat: add dark mode toggle`
- `fix: resolve hydration mismatch on reload`
- `chore: update dependencies`
- `refactor(api): simplify authentication middleware`
- `docs: add contributing guidelines`

### Enforcement

A GitHub Actions workflow validates every pull request title against this convention using [action-semantic-pull-request](https://github.com/amannn/action-semantic-pull-request). Pull requests with invalid titles will fail the check and cannot be merged until the title is corrected.

### Local Commit Linting

For local development, commitlint enforces the Conventional Commits specification on individual commit messages. This runs automatically via a Git hook when you commit. The configuration is defined in `commitlint.config.js` at the project root.

To run manually:

```bash
npx commitlint --from HEAD~1
```

## Development Workflow

All commands must be run from the `src/` directory (the Vite project root).

```bash
cd src
npm install
npm run dev    # Start development server
npm run build  # Production build
npm run lint   # Run linter
```

## Code Style

- **TypeScript** for all source code
- **Tailwind CSS** for styling (extend the theme in `src/tailwind.config.ts`)
- Path aliases: `@/` maps to `src/src/`, `@content/` maps to `content/`

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes following the conventions above
3. Ensure all checks pass (lint, build, tests)
4. Open a pull request with a valid Conventional Commits title
5. Request a review

## Questions?

Open an issue or reach out to the maintainers.
