---
name: react-app
description: Handles implementation tasks in the loganfarci.com React + Vite + Tailwind CSS application. Use when adding components, pages, hooks, styles, or any frontend feature to the app.
---

## Overview

This project is a **Vite + React 19 (TypeScript)** single-page application with SSR prerendering, styled with **Tailwind CSS v4** and **local shadcn-style Radix primitives**. All source code lives under `src/src/`, and all build commands must be run from the `src/` directory.

**Source of truth:** [`docs/specs/`](../../../docs/specs/README.md) owns architecture, quality bars, data contracts, content style, non-goals, and the vision. The full directory layout and developer workflows live in [`.github/copilot-instructions.md`](../../copilot-instructions.md). This skill focuses on the React 19 implementation how-to and does not repeat those.

## Project orientation

- Application code is under `src/src/` (`components/`, `pages/`, `contexts/`, `core/`, `types/`).
- Content lives **outside** the app in `content/` (`articles/` markdown, `data/` JSON), loaded at build time via Vite `import.meta.glob` — never runtime `fs`.
- The build/SSR/prerender pipeline and content flow are documented in [`docs/specs/architecture.md`](../../../docs/specs/architecture.md); the annotated directory tree is in [`copilot-instructions.md`](../../copilot-instructions.md).

## Coding conventions (skill-specific)

For the quality bar (accessibility, performance, TS strictness, testing, linting) defer to [`docs/specs/quality-bars.md`](../../../docs/specs/quality-bars.md). The implementation-specific conventions for this app are:

- **TypeScript** for all code. No plain JS files in `src/src/`; explicit prop types.
- **No React import needed** in JSX files — the Vite JSX transform handles it. Only import specific hooks/types you use.
- **Functional React components** with hooks only. No class components.
- **Ref as prop** (React 19): pass `ref` directly — no `forwardRef` needed.
- **Context without `.Provider`** (React 19): render `<MyContext value={...}>` directly.
- **Tailwind CSS** for all styling with semantic tokens (see table below). Extend the theme in `src/tailwind.config.ts`. Never use inline styles unless unavoidable.
- **UI primitives**: use the **local shadcn-style Radix primitives** in `@/components/shared/primitives` (`Button`, `Badge`, `Card`, `Separator`, `Tooltip`). Do NOT add a third-party component library.
- **Import aliases**:
  - `@/` → `src/src/` (e.g., `@/components/Foo` maps to `src/src/components/Foo`)
  - `@content/` → `content/` (e.g., `@content/articles/*.md`)
- **Page metadata (React 19 native)**: render `<title>`, `<meta name="description">`, and `<link rel="canonical">` directly in the page JSX. There is no `react-helmet` / `HelmetProvider` in this project.
- **Routing**: Add new routes in `src/src/routes.tsx`. Use `react-router` (v7+) — do NOT install `react-router-dom` separately.
- **Content**: Article `.md` files go in `content/articles/`. JSON data goes in `content/data/`. Load content via Vite's `import.meta.glob` — no runtime file system access.

## Tailwind CSS Setup

This project uses **Tailwind CSS v4** via `@tailwindcss/vite` (Vite plugin integration).

The theme is extended in `src/tailwind.config.ts` with semantic CSS variable-backed colors:

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| `bg-background` | `--color-background` | Page background |
| `text-foreground` | `--color-foreground` | Default text |
| `text-primary` | `--color-text-primary` | Primary text |
| `text-secondary` | `--color-text-secondary` | Secondary text |
| `text-tertiary` | `--color-text-tertiary` | Tertiary/label text |
| `text-muted` | `--color-text-muted` | Muted/disabled text |
| `bg-surface` | `--color-surface` | Card/panel background |
| `bg-surface-elevated` | `--color-surface-elevated` | Elevated surface (dropdowns, modals) |
| `bg-surface-hover` | `--color-surface-hover` | Hover state background |
| `border-border` | `--color-border` | Default border |
| `border-border-light` | `--color-border-light` | Subtle border |
| `border-border-strong` | `--color-border-strong` | Prominent border |
| `text-success/warning/error/info` | status color variables | Status indicators |

CSS variables are defined in `src/src/globals.css`. Always use these semantic tokens instead of raw Tailwind color classes (e.g., `text-slate-700`) to ensure dark mode consistency. Dark mode is toggled via `class` strategy (`darkMode: "class"` in `tailwind.config.ts`).

## Developer Commands

All commands must be run from `src/`:

```bash
cd src

# Development
npm run dev            # Start Vite dev server (hot reload)

# Build (3-step pipeline)
npm run build          # Full build: client + SSR + prerender
npm run build:client   # Vite client bundle → dist/
npm run build:server   # Vite SSR bundle → dist/server/
npm run prerender      # Static HTML for all routes → dist/

# Quality
npm run lint           # ESLint (TypeScript + React rules)
npm run test           # Vitest unit/component tests (or npx vitest run)
npm run preview        # Preview the production build locally
```

## React 19 Patterns

### Ref as Prop (no forwardRef)

```tsx
// React 19: pass ref directly as a prop
interface InputProps {
  ref?: React.Ref<HTMLInputElement>;
  placeholder?: string;
}

const Input = ({ ref, placeholder }: InputProps) => (
  <input ref={ref} placeholder={placeholder} className="border border-border rounded px-3 py-2" />
);
```

### Context Without Provider

```tsx
// React 19: render context directly (no Context.Provider wrapper needed)
const ThemeContext = createContext<"light" | "dark">("light");

function App() {
  return (
    <ThemeContext value="dark">
      <Main />
    </ThemeContext>
  );
}
```

### useOptimistic for Optimistic UI

```tsx
import { useOptimistic, useTransition, useState } from "react";

function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [optimisticCount, addOptimistic] = useOptimistic(
    count,
    (current, increment: number) => current + increment
  );
  const [, startTransition] = useTransition();

  const handleLike = () => {
    addOptimistic(1);
    startTransition(async () => {
      await fetch("/api/like", { method: "POST" });
      setCount((c) => c + 1);
    });
  };

  return (
    <button onClick={handleLike} className="text-text-secondary hover:text-primary transition-colors">
      ♥ {optimisticCount}
    </button>
  );
}
```

## Adding New Components

1. Create the component in `src/src/components/` (or a sub-folder matching its category).
2. Use TypeScript with explicit prop types — always define a `Props` interface or type.
3. Use Tailwind utility classes for all styling; reference semantic color tokens.
4. Use the local Radix primitives from `@/components/shared/primitives` where appropriate instead of building from scratch.
5. Ensure accessibility: semantic elements, ARIA labels, keyboard support.

Example:
```tsx
import type { FC } from "react";

interface SectionCardProps {
  title: string;
  description: string;
  className?: string;
}

const SectionCard: FC<SectionCardProps> = ({ title, description, className = "" }) => (
  <article className={`rounded-lg border border-border bg-surface p-4 ${className}`}>
    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
    <p className="mt-1 text-sm text-text-secondary">{description}</p>
  </article>
);

export default SectionCard;
```

## Adding New Pages

1. Create the page component in `src/src/pages/`.
2. Render `<title>` and `<meta name="description">` directly in the JSX (React 19 native metadata).
3. Register the route in `src/src/routes.tsx`.
4. Add the route path to the `routes` array in `src/scripts/prerender.mjs` so it is prerendered.

Example:
```tsx
import { createCanonicalUrl } from "@/core/seo";

export default function ExamplePage() {
  return (
    <>
      <title>Example – Logan Farci</title>
      <meta name="description" content="Brief description for SEO." />
      <link rel="canonical" href={createCanonicalUrl("/example")} />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-text-primary">Example</h1>
      </main>
    </>
  );
}
```

## Custom Hooks

Extract reusable logic into typed custom hooks. Place them in `src/src/core/` or a dedicated `src/src/hooks/` folder.

```tsx
import { useState, useEffect } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<T>;
      })
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e : new Error(String(e))); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
```

## SSR Considerations

The full SSR + prerender contract is in [`docs/specs/architecture.md`](../../../docs/specs/architecture.md). When writing components, keep them SSR-safe:

- `src/src/entry-server.tsx` renders with `react-dom/static` + `StaticRouter` (imported from `react-router` directly). There is no `HelmetProvider`; page metadata is native React 19 (`<title>`/`<meta>` in JSX).
- Do not use browser-only APIs (`window`, `document`, `localStorage`) at the module top level or in render logic without guarding with `typeof window !== "undefined"`.
- Use `useEffect` for client-only side-effects (event listeners, DOM manipulation, etc.).
- Lazy-load heavy client-only libraries (e.g., Mermaid) with `React.lazy` + `Suspense`.

## Code Splitting

Use `React.lazy` with `Suspense` to defer loading of heavy components:

```tsx
import { lazy, Suspense } from "react";

const HeavyDiagram = lazy(() => import("@/components/HeavyDiagram"));

function ArticlePage() {
  return (
    <Suspense fallback={<div className="text-text-muted">Loading diagram…</div>}>
      <HeavyDiagram />
    </Suspense>
  );
}
```

## Testing with Vitest

Testing expectations (colocated `*.test.tsx`, coverage) are defined in [`docs/specs/quality-bars.md`](../../../docs/specs/quality-bars.md). This section shows the concrete patterns to follow with **Vitest** + **React Testing Library**.

- Place test files alongside their source (e.g., `Button.test.tsx` next to `Button.tsx`).
- Use `@testing-library/react` for rendering components and `@testing-library/user-event` for interactions.
- Prefer queries that reflect how users interact with the UI: `getByRole`, `getByLabelText`, `getByText`.
- Run tests from `src/`:
  ```bash
  npx vitest run        # single run (CI)
  npx vitest            # watch mode (development)
  ```

Example component test:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SectionCard from "@/components/SectionCard";

describe("SectionCard", () => {
  it("renders title and description", () => {
    render(<SectionCard title="Hello" description="World" />);

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });
});
```

Example hook test:

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useFetch } from "@/core/useFetch";

describe("useFetch", () => {
  it("returns data on successful fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    }));

    const { result } = renderHook(() => useFetch<{ id: number }>("/api/test"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual({ id: 1 });
    expect(result.current.error).toBeNull();

    vi.unstubAllGlobals();
  });
});
```

## Accessibility Checklist

Accessibility is part of the quality bar — follow the checklist in [`docs/specs/quality-bars.md`](../../../docs/specs/quality-bars.md) (semantic elements, keyboard reachability, labels, alt text, contrast, visible focus). Use the local Radix primitives, which provide accessible behavior out of the box.

## Verification Workflow

After making changes:
1. Run `npm run lint` from `src/` — fix all lint errors.
2. Run `npx vitest run` from `src/` — all tests must pass.
3. Run `npm run build` from `src/` — ensure the full 3-step pipeline succeeds.
4. Run `npm run preview` to manually verify the result in the browser.
