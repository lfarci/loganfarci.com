# 05 — App Shell

This document covers the creation of the Vite entry point, root App component, provider wiring, font setup, and CSS migration. Together these replace Next.js's `layout.tsx`, `providers.tsx`, and the implicit HTML shell.

## Current Architecture

In Next.js, the root layout (`src/app/layout.tsx`) serves as the HTML shell:

```tsx
// layout.tsx — combines HTML shell, fonts, metadata, and providers
import { Manrope, Noto_Sans, Reddit_Mono } from "next/font/google";
import { Metadata } from "next";

export const metadata: Metadata = { /* ... */ };

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${fontVars}`}>
                <Providers>
                    <LayoutWrapper githubRepositoryUrl={...} commitHash={...}>
                        {children}
                    </LayoutWrapper>
                </Providers>
            </body>
        </html>
    );
}
```

This is split into **three files** in Vite:

1. `index.html` — static HTML shell
2. `src/main.tsx` — React entry point
3. `src/App.tsx` — root React component

## New Files

### `src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Logan Farci - Software Engineer</title>
    <meta name="description" content="Logan Farci, Software Engineer" />
    <meta name="keywords" content="Software Engineer, Logan Farci, Developer, Brussels, Belgium" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

**Notes**:
- No font classes on `<body>` — Fontsource applies fonts via CSS `@font-face` declarations
- `react-helmet-async` will dynamically update `<title>` and `<meta>` tags per page
- The prerender script will inject rendered HTML into `<div id="root">`

### `src/src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

// Fontsource font imports (self-hosted, no external requests)
import "@fontsource-variable/manrope";
import "@fontsource/noto-sans";
import "@fontsource/reddit-mono";

// Global styles (Tailwind + theme)
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
);
```

**Notes**:
- `BrowserRouter` is in `main.tsx` (not `App.tsx`) so the SSR entry point can swap it for `StaticRouter`
- `HelmetProvider` wraps everything for metadata management
- Font imports are side-effect imports that register `@font-face` declarations

### `src/src/App.tsx`

```tsx
import { useRoutes } from "react-router";
import { Helmet } from "react-helmet-async";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { routes } from "./routes";

const githubRepositoryUrl = import.meta.env.VITE_GITHUB_REPOSITORY_URL;
const latestCommitHash = import.meta.env.VITE_COMMIT_HASH;

export default function App() {
    const element = useRoutes(routes);

    return (
        <HeroUIProvider>
            <ThemeProvider>
                <Helmet>
                    <title>Logan Farci - Software Engineer</title>
                    <meta name="description" content="Logan Farci, Software Engineer" />
                </Helmet>
                <LayoutWrapper
                    githubRepositoryUrl={githubRepositoryUrl}
                    commitHash={latestCommitHash}
                >
                    {element}
                </LayoutWrapper>
            </ThemeProvider>
        </HeroUIProvider>
    );
}
```

**Notes**:
- `useRoutes(routes)` replaces Next.js's file-based routing
- `LayoutWrapper` wraps all routes (same as current `layout.tsx`)
- Default `<Helmet>` provides fallback metadata; pages override as needed
- Environment variables use `import.meta.env.VITE_*` prefix

### `src/src/entry-server.tsx`

For static prerendering (see [06-prerendering.md](06-prerendering.md)):

```tsx
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router/server";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import App from "./App";

export function render(url: string) {
    const helmetContext: { helmet?: HelmetServerState } = {};

    const html = ReactDOMServer.renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouter location={url}>
                <App />
            </StaticRouter>
        </HelmetProvider>
    );

    return { html, helmet: helmetContext.helmet };
}
```

## Font Migration Detail

### Remove (from `layout.tsx`):

```tsx
import { Manrope, Noto_Sans, Reddit_Mono } from "next/font/google";

const redditMono = Reddit_Mono({ variable: "--font-reddit-mono", ... });
const manrope = Manrope({ variable: "--font-manrope", ... });
const notoSans = Noto_Sans({ variable: "--font-noto-sans", ... });

<body className={`${redditMono.variable} ${manrope.variable} ${notoSans.variable}`}>
```

### Add (in `globals.css`):

```css
:root {
    --font-manrope: "Manrope Variable", sans-serif;
    --font-noto-sans: "Noto Sans", sans-serif;
    --font-reddit-mono: "Reddit Mono", monospace;
}
```

The existing `.heading-font` and `.text-font` classes reference `var(--font-manrope)` and `var(--font-noto-sans)` respectively — those continue to work.

## CSS Migration

### Move `globals.css`

- From: `src/src/app/globals.css`
- To: `src/src/globals.css`

### Update the Tailwind config reference

The `@config` directive in `globals.css`:

```css
/* Before */
@config '../../tailwind.config.ts';

/* After — adjust path since globals.css moves up one level */
@config '../../tailwind.config.ts';
```

Verify the relative path is still correct after the move. The `tailwind.config.ts` stays at `src/tailwind.config.ts`.

### PostCSS

`postcss.config.mjs` stays unchanged — it uses `@tailwindcss/postcss` which works with Vite's PostCSS integration.

## Provider Stack

The provider nesting order (outermost → innermost):

```
<React.StrictMode>          // main.tsx
  <HelmetProvider>          // main.tsx (metadata)
    <BrowserRouter>         // main.tsx (routing)
      <HeroUIProvider>      // App.tsx (UI components)
        <ThemeProvider>     // App.tsx (dark/light mode)
          <LayoutWrapper>   // App.tsx (nav + footer)
            {routes}        // App.tsx (page content)
```

This matches the current nesting in Next.js, except:
- `BrowserRouter` is new (replaces Next.js's built-in router)
- `HelmetProvider` is new (replaces Next.js's `Metadata` export)
- `React.StrictMode` is explicit (Next.js enables it via config)

## Migration Checklist

- [ ] Create `src/index.html`
- [ ] Create `src/src/main.tsx` with font imports, CSS import, React root
- [ ] Create `src/src/App.tsx` with providers, layout, routes
- [ ] Create `src/src/entry-server.tsx` for prerendering
- [ ] Install Fontsource packages
- [ ] Add `:root` font CSS variables to `globals.css`
- [ ] Move `globals.css` from `src/app/` to `src/`
- [ ] Verify the `@config` path in `globals.css` resolves correctly
- [ ] Delete `src/app/layout.tsx` (after migration verified)
- [ ] Delete `src/app/providers.tsx` (merged into `App.tsx`)
- [ ] Verify theme toggle works (dark/light mode)
- [ ] Verify fonts render correctly (Manrope headings, Noto Sans body, Reddit Mono code)
