# 04 — Component Migration

This document covers the mechanical replacement of Next.js-specific component imports across the codebase. These are mostly straightforward find-and-replace operations with minimal logic changes.

## `next/image` → Native `<img>` (7 files)

Since the site already uses `images: { unoptimized: true }` in `next.config.ts`, the `next/image` component is effectively a thin wrapper around `<img>`. The migration is a direct replacement.

### Prop mapping

| `next/image` prop | `<img>` equivalent |
|---|---|
| `src` | `src` |
| `alt` | `alt` |
| `width` | `width` |
| `height` | `height` |
| `className` | `className` |
| `fill` | Remove prop; add CSS: `width: 100%; height: 100%; object-fit: cover; position: absolute;` |
| `priority` | Remove (no equivalent needed) |
| `loading` | `loading` (keep `"lazy"` if set) |

### Files to update

| File | Notes |
|---|---|
| `src/components/GreetingHeading.tsx` | Simple `src`/`alt`/`width`/`height` |
| `src/components/HeroSection.tsx` | May use `fill` or fixed dimensions |
| `src/components/cards/Card.tsx` | Also uses `next/link` (see below) |
| `src/components/shared/Icon.tsx` | Small icon images |
| `src/components/shared/Tag.tsx` | Small tag images |
| `src/components/shared/MarkdownSection.tsx` | Article inline images |

### Example

```tsx
// Before
import Image from "next/image";

<Image src="/images/avatar.avif" alt="Avatar" width={120} height={120} className="rounded-full" />

// After
<img src="/images/avatar.avif" alt="Avatar" width={120} height={120} className="rounded-full" />
```

For components using the `fill` prop:

```tsx
// Before
<Image src={src} alt={alt} fill className="object-cover" />

// After
<img src={src} alt={alt} className="object-cover absolute inset-0 w-full h-full" />
```

## `next/link` → React Router `<Link>` (6 files)

### Prop mapping

| `next/link` prop | React Router `<Link>` prop |
|---|---|
| `href` | `to` |
| `className` | `className` |
| `target` | `target` |
| `rel` | `rel` |
| `prefetch` | Remove (not applicable) |

### Files to update

| File | Notes |
|---|---|
| `src/pages/NotFoundPage.tsx` | Single link to "/" |
| `src/components/layout/NavigationBar.tsx` | Nav links |
| `src/components/shared/NavBarEntry.tsx` | Nav link wrapper |
| `src/components/shared/ThumbnailGridSection.tsx` | Grid item links |
| `src/components/cards/ArticleListCard.tsx` | Article card link |
| `src/components/cards/Card.tsx` | Generic card link |

### Example

```tsx
// Before
import Link from "next/link";

<Link href="/about" className="nav-link">About</Link>

// After
import { Link } from "react-router";

<Link to="/about" className="nav-link">About</Link>
```

### External links caveat

If any `next/link` usage points to external URLs (`https://...`), these should become plain `<a>` tags instead of React Router `<Link>` (which is for internal routing only). Check each usage before converting.

## `next/navigation` → React Router hooks (2 files)

### `useRouter()` → `useNavigate()`

**File**: `src/pages/ErrorPage.tsx` (was `src/app/error.tsx`)

```tsx
// Before
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/");

// After
import { useNavigate } from "react-router";
const navigate = useNavigate();
navigate("/");
```

### `notFound()` → `<Navigate>` or conditional render

**File**: `src/pages/ArticlePage.tsx` (was `src/app/articles/[slug]/page.tsx`)

```tsx
// Before
import { notFound } from "next/navigation";
if (!article) notFound();

// After
import { Navigate } from "react-router";
if (!article) return <Navigate to="/404" replace />;
```

## `next/font/google` → Fontsource (1 file)

**File**: `src/app/layout.tsx` → split into `index.html` + `main.tsx`

### Current setup

```tsx
import { Manrope, Noto_Sans, Reddit_Mono } from "next/font/google";

const redditMono = Reddit_Mono({ variable: "--font-reddit-mono", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const notoSans = Noto_Sans({ variable: "--font-noto-sans", subsets: ["latin"] });

<body className={`${redditMono.variable} ${manrope.variable} ${notoSans.variable}`}>
```

### New setup

Install packages:
```bash
npm install @fontsource-variable/manrope @fontsource/noto-sans @fontsource/reddit-mono
```

In `src/main.tsx`:
```tsx
import "@fontsource-variable/manrope";
import "@fontsource/noto-sans";
import "@fontsource/reddit-mono";
```

In `src/globals.css`, update the CSS custom properties to reference the font-family names:
```css
:root {
    --font-manrope: "Manrope Variable", sans-serif;
    --font-noto-sans: "Noto Sans", sans-serif;
    --font-reddit-mono: "Reddit Mono", monospace;
}
```

The `.heading-font`, `.text-font` utility classes in `globals.css` reference these variables — they should continue to work without changes.

## `Metadata` export → `react-helmet-async` (1 file)

**File**: `src/app/layout.tsx` → `App.tsx` + per-page `<Helmet>`

### Current setup

```tsx
export const metadata: Metadata = {
    title: "Logan Farci - Software Engineer",
    description: "Logan Farci, Software Engineer",
    keywords: ["Software Engineer", "Logan Farci", "Developer", "Brussels", "Belgium"],
};
```

### New setup

In `App.tsx` (default metadata):
```tsx
import { Helmet } from "react-helmet-async";

<Helmet>
    <title>Logan Farci - Software Engineer</title>
    <meta name="description" content="Logan Farci, Software Engineer" />
    <meta name="keywords" content="Software Engineer, Logan Farci, Developer, Brussels, Belgium" />
</Helmet>
```

Each page component can override with its own `<Helmet>`:
```tsx
<Helmet>
    <title>About - Logan Farci</title>
</Helmet>
```

`react-helmet-async` merges the most specific (deepest) `<Helmet>` automatically.

## `"use client"` Directives — Remove All (16 files)

In Vite, all code runs on the client (or at build time via the prerender script). The `"use client"` directive is a Next.js-specific marker with no meaning outside of Next.js.

**Action**: Remove the `"use client";` line from all 16 files:

| File |
|---|
| `src/app/providers.tsx` |
| `src/app/error.tsx` |
| `src/contexts/ThemeContext.tsx` |
| `src/components/terminal/Terminal.tsx` |
| `src/components/terminal/Prompt.tsx` |
| `src/components/shared/CodeSnippet.tsx` |
| `src/components/shared/ThemeToggle.tsx` |
| `src/components/shared/ClientTooltip.tsx` |
| `src/components/shared/Tag.tsx` |
| `src/components/shared/Section.tsx` |
| `src/components/shared/MermaidDiagram.tsx` |
| `src/components/shared/ErrorMessage.tsx` |
| `src/components/layout/NavigationBar.tsx` |
| `src/components/layout/LayoutWrapper.tsx` |
| `src/components/cards/CardTitleWithTooltip.tsx` |
| `src/components/shared/preview/Preview.tsx` |

## Environment Variables (2 references)

### Current

```tsx
// In layout.tsx
const githubRepositoryUrl = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY_URL;
const latestCommitHash = process.env.NEXT_PUBLIC_COMMIT_HASH;
```

### New

```tsx
// In App.tsx
const githubRepositoryUrl = import.meta.env.VITE_GITHUB_REPOSITORY_URL;
const latestCommitHash = import.meta.env.VITE_COMMIT_HASH;
```

Also update:
- `process.env.NODE_ENV` → `import.meta.env.MODE` or `import.meta.env.DEV` / `import.meta.env.PROD`

## Migration Checklist

- [ ] Replace `next/image` → `<img>` in 7 files
- [ ] Replace `next/link` → React Router `<Link>` in 6 files (check for external URLs)
- [ ] Replace `useRouter()` → `useNavigate()` in error page
- [ ] Replace `notFound()` → `<Navigate>` in article page
- [ ] Install Fontsource packages and import in `main.tsx`
- [ ] Update CSS variables for fonts in `globals.css`
- [ ] Add default `<Helmet>` in `App.tsx`
- [ ] Add per-page `<Helmet>` in each page component
- [ ] Remove `"use client"` from all 16 files
- [ ] Replace `process.env.NEXT_PUBLIC_*` → `import.meta.env.VITE_*`
- [ ] Replace `process.env.NODE_ENV` → `import.meta.env.MODE`
