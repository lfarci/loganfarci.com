# 06 — Prerendering

This document covers the build-time static HTML generation that ensures each route has its own HTML file, preserving SEO parity with the current Next.js `output: "export"` behavior.

## Why Prerender?

Without prerendering, Vite produces a single `index.html` with an empty `<div id="root">`. All content is rendered client-side via JavaScript. This means:

- Search engine crawlers that don't execute JS won't see any content
- Social media link previews (Open Graph) won't show titles/descriptions
- The initial page load shows a blank screen until JS loads and executes

The current Next.js setup generates a separate HTML file per route with fully rendered content. The prerender script replicates this behavior.

## Architecture

```
vite build (client)         → dist/assets/*.js, dist/index.html (template)
vite build --ssr (server)   → dist/server/entry-server.js
prerender script            → reads template, renders each route, writes HTML files
```

### Build output structure

```
dist/
├── index.html                      ← / (home page, prerendered)
├── 404.html                        ← SWA fallback
├── assets/
│   ├── index-[hash].js             ← client bundle
│   └── index-[hash].css            ← styles
├── about/
│   └── index.html                  ← /about (prerendered)
├── articles/
│   ├── index.html                  ← /articles (prerendered)
│   ├── azure-vm-entra-id-ssh/
│   │   └── index.html              ← /articles/azure-vm-entra-id-ssh
│   ├── git-worktree-vscode/
│   │   └── index.html
│   └── ...
└── images/                         ← copied from public/
```

This matches the trailing-slash structure produced by Next.js's `trailingSlash: true` setting.

## Implementation

### Prerender Script (`src/scripts/prerender.ts`)

```typescript
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
    const distDir = path.resolve(__dirname, "../dist");
    const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

    // Import the SSR bundle
    const { render } = await import(path.join(distDir, "server/entry-server.js"));
    const { getStaticRoutes } = await import(path.join(distDir, "server/entry-server.js"));

    const routes = getStaticRoutes();

    for (const route of routes) {
        const { html, helmet } = render(route);

        // Inject rendered HTML into the template
        let page = template.replace(
            '<div id="root"></div>',
            `<div id="root">${html}</div>`
        );

        // Inject helmet metadata (title, meta tags)
        if (helmet) {
            page = page.replace("</head>",
                `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}</head>`
            );
        }

        // Write to dist/{route}/index.html
        const routePath = route === "/" ? "" : route;
        const dir = path.join(distDir, routePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), page);

        console.log(`  Prerendered: ${route}`);
    }

    // Generate 404.html from the /404 route (for Azure SWA fallback)
    const { html: notFoundHtml, helmet: notFoundHelmet } = render("/404");
    let notFoundPage = template.replace(
        '<div id="root"></div>',
        `<div id="root">${notFoundHtml}</div>`
    );
    if (notFoundHelmet) {
        notFoundPage = notFoundPage.replace("</head>",
            `${notFoundHelmet.title.toString()}${notFoundHelmet.meta.toString()}</head>`
        );
    }
    fs.writeFileSync(path.join(distDir, "404.html"), notFoundPage);
    console.log("  Prerendered: /404 → 404.html");
}

prerender().catch((err) => {
    console.error("Prerender failed:", err);
    process.exit(1);
});
```

### Entry Server (`src/src/entry-server.tsx`)

See [05-app-shell.md](05-app-shell.md) for the full implementation. Key exports:

```typescript
export function render(url: string): { html: string; helmet: HelmetServerState };
export { getStaticRoutes } from "./routes";
```

### Route enumeration

In `src/src/routes.tsx`:

```typescript
import { getArticleSlugs } from "@/core/articles";

export const getStaticRoutes = (): string[] => [
    "/",
    "/about",
    "/articles",
    ...getArticleSlugs().map((slug) => `/articles/${slug}`),
];
```

This function:
- Lists all static routes manually
- Enumerates all article slugs dynamically (from the `import.meta.glob` article modules)
- Is called by the prerender script to determine which pages to generate

## Vite Config for SSR Build

Add SSR build configuration to `vite.config.ts`:

```typescript
export default defineConfig({
    build: {
        outDir: "dist",
    },
    // SSR config is passed via CLI: vite build --ssr src/entry-server.tsx --outDir dist/server
});
```

## Build Script

In `package.json`:

```json
{
    "scripts": {
        "build": "vite build && vite build --ssr src/entry-server.tsx --outDir dist/server && node dist/server/entry-server.js",
        "build:client": "vite build",
        "build:server": "vite build --ssr src/entry-server.tsx --outDir dist/server",
        "prerender": "node scripts/prerender.mjs"
    }
}
```

Or as a single command:
```json
{
    "scripts": {
        "build": "npm run build:client && npm run build:server && npm run prerender"
    }
}
```

## Client Hydration

The prerendered HTML contains the full page content. When the browser loads the page, React **hydrates** the existing HTML rather than rendering from scratch:

In `main.tsx`, change `createRoot` to `hydrateRoot` when HTML is prerendered:

```typescript
const rootElement = document.getElementById("root")!;

if (rootElement.innerHTML.trim()) {
    // Prerendered HTML exists — hydrate it
    ReactDOM.hydrateRoot(rootElement,
        <React.StrictMode>
            <HelmetProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </HelmetProvider>
        </React.StrictMode>
    );
} else {
    // No prerendered HTML (dev mode) — create fresh root
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <HelmetProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </HelmetProvider>
        </React.StrictMode>
    );
}
```

This approach means:
- **Dev mode**: `createRoot` renders client-side (fast iteration)
- **Production build**: `hydrateRoot` attaches to prerendered HTML (no flash of empty content)

## Trailing Slash Handling

The current Next.js config uses `trailingSlash: true`, which generates:
- `/about/index.html` (served as `/about/`)
- `/articles/my-slug/index.html` (served as `/articles/my-slug/`)

The prerender script replicates this by writing `dist/{route}/index.html` for each route. Azure SWA's default behavior serves `index.html` from directories automatically.

## Migration Checklist

- [ ] Create `src/src/entry-server.tsx`
- [ ] Add `getStaticRoutes()` export to `src/src/routes.tsx`
- [ ] Create `src/scripts/prerender.ts`
- [ ] Update `package.json` build scripts
- [ ] Update `main.tsx` to use `hydrateRoot` when prerendered HTML exists
- [ ] Verify build produces correct directory structure in `dist/`
- [ ] Verify each prerendered HTML file contains full rendered content
- [ ] Verify `404.html` is generated
- [ ] Verify client-side navigation still works after hydration
- [ ] Compare prerendered HTML content with current Next.js `out/` content
