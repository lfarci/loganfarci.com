# 03 — Routing

This document covers the migration from Next.js App Router file-based routing to React Router v7 config-based routing.

## Current Route Map

| Path | Next.js File | Data Source | Special Features |
|---|---|---|---|
| `/` | `src/app/page.tsx` | `getCertifications`, `getProfile`, `getContacts`, `getInterests`, `getFeaturedArticles` | Module-level data calls |
| `/about` | `src/app/about/page.tsx` | `getCertifications`, `getExperiences`, `getSkillCategories`, `getDiploma`, `getProfile` | Module-level data calls |
| `/articles` | `src/app/articles/page.tsx` | `getAllArticles` | — |
| `/articles/[slug]` | `src/app/articles/[slug]/page.tsx` | `getArticleBySlug(slug)` | `generateStaticParams()`, `notFound()` |
| (error) | `src/app/error.tsx` | — | `"use client"`, `useRouter()` |
| (404) | `src/app/not-found.tsx` | — | `next/link` |
| (layout) | `src/app/layout.tsx` | — | Fonts, metadata, `<Providers>`, `<LayoutWrapper>` |

## Target Route Config

### `src/src/routes.tsx`

```tsx
import { RouteObject } from "react-router";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticlePage from "@/pages/ArticlePage";
import NotFoundPage from "@/pages/NotFoundPage";

export const routes: RouteObject[] = [
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/articles", element: <ArticlesPage /> },
    { path: "/articles/:slug", element: <ArticlePage /> },
    { path: "*", element: <NotFoundPage /> },
];
```

### Static Route List (for prerendering)

Exported for the prerender script:

```typescript
import { getArticleSlugs } from "@/core/articles";

export const getStaticRoutes = (): string[] => [
    "/",
    "/about",
    "/articles",
    ...getArticleSlugs().map((slug) => `/articles/${slug}`),
];
```

## Page Conversions

### Home Page (`src/app/page.tsx` → `src/pages/HomePage.tsx`)

**Changes required**: Minimal. The module-level data calls (`getCertifications()`, `getProfile()`, etc.) continue to work because the rewritten `data.ts` and `articles.ts` use Vite-resolved imports (no `fs`). The component is already a standard React function component.

```tsx
// Before: src/app/page.tsx (Next.js server component)
import { getFeaturedArticles } from "@/core/articles";
import { getCertifications, getContacts, getInterests, getProfile } from "@/core/data";

const certifications = getCertifications().filter((c) => c.relevance == "High");
// ...

export default function Home() { /* JSX unchanged */ }
```

```tsx
// After: src/pages/HomePage.tsx
import { Helmet } from "react-helmet-async";
import { getFeaturedArticles } from "@/core/articles";
import { getCertifications, getContacts, getInterests, getProfile } from "@/core/data";

const certifications = getCertifications().filter((c) => c.relevance == "High");
// ...

export default function HomePage() {
    return (
        <>
            <Helmet>
                <title>Logan Farci - Software Engineer</title>
                <meta name="description" content="Logan Farci, Software Engineer" />
            </Helmet>
            {/* JSX unchanged */}
        </>
    );
}
```

### About Page (`src/app/about/page.tsx` → `src/pages/AboutPage.tsx`)

**Changes required**: Same as Home — module-level data calls remain. Add `<Helmet>` for metadata. Rename component from `About` to `AboutPage`.

### Articles Page (`src/app/articles/page.tsx` → `src/pages/ArticlesPage.tsx`)

**Changes required**: Same pattern. The `getAllArticles()` call continues to work with the rewritten `articles.ts`.

### Article Page (`src/app/articles/[slug]/page.tsx` → `src/pages/ArticlePage.tsx`)

This is the most complex page conversion.

**Before** (Next.js):
```tsx
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleSlugs } from "@/core/articles";

export function generateStaticParams() {
    const slugs = getArticleSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await Promise.resolve(params);
    const article = getArticleBySlug(slug);
    if (!article) notFound();
    return (/* JSX */);
}
```

**After** (React Router):
```tsx
import { useParams, Navigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { getArticleBySlug } from "@/core/articles";

export default function ArticlePage() {
    const { slug } = useParams<{ slug: string }>();
    const article = slug ? getArticleBySlug(slug) : null;

    if (!article) {
        return <Navigate to="/404" replace />;
    }

    return (
        <>
            <Helmet>
                <title>{article.title} - Logan Farci</title>
                <meta name="description" content={article.description} />
            </Helmet>
            <article className="max-w-none">
                {/* JSX unchanged (ArticleMeta, MarkdownContent, etc.) */}
            </article>
        </>
    );
}
```

**Key changes**:
- `generateStaticParams()` → removed (route enumeration handled by prerender script)
- `notFound()` → `<Navigate to="/404" replace />`
- `params` prop → `useParams()` hook
- `async function` → regular function (no server-side async resolution)

### Not Found Page (`src/app/not-found.tsx` → `src/pages/NotFoundPage.tsx`)

```tsx
// Before
import Link from "next/link";

// After
import { Link } from "react-router";
// Change: href="/..." → to="/..."
```

### Error Page (`src/app/error.tsx` → error boundary in `App.tsx`)

**Before** (Next.js):
```tsx
"use client";
import { useRouter } from "next/navigation";

export default function GlobalError({ error, reset }) {
    const router = useRouter();
    // router.push("/")
}
```

**After** (React Router error element or React ErrorBoundary):
```tsx
import { useNavigate } from "react-router";

export default function ErrorPage({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
    const navigate = useNavigate();
    // navigate("/")
}
```

Wire up in route config: use React Router's `errorElement` on the root route, or wrap with `react-error-boundary`.

## File Mapping Summary

| Before (Next.js) | After (Vite + React Router) | Action |
|---|---|---|
| `src/app/page.tsx` | `src/pages/HomePage.tsx` | Move + add Helmet |
| `src/app/about/page.tsx` | `src/pages/AboutPage.tsx` | Move + add Helmet |
| `src/app/articles/page.tsx` | `src/pages/ArticlesPage.tsx` | Move + add Helmet |
| `src/app/articles/[slug]/page.tsx` | `src/pages/ArticlePage.tsx` | Rewrite (useParams, Navigate) |
| `src/app/not-found.tsx` | `src/pages/NotFoundPage.tsx` | Move + swap Link |
| `src/app/error.tsx` | `src/pages/ErrorPage.tsx` | Rewrite (useNavigate) |
| `src/app/layout.tsx` | `src/App.tsx` + `index.html` | Split into app shell |
| `src/app/providers.tsx` | `src/App.tsx` | Inline into App |
| `src/app/globals.css` | `src/globals.css` | Move |

## Migration Checklist

- [ ] Create `src/src/routes.tsx` with route config
- [ ] Create `src/src/pages/HomePage.tsx` from `src/app/page.tsx`
- [ ] Create `src/src/pages/AboutPage.tsx` from `src/app/about/page.tsx`
- [ ] Create `src/src/pages/ArticlesPage.tsx` from `src/app/articles/page.tsx`
- [ ] Create `src/src/pages/ArticlePage.tsx` (rewritten with `useParams`)
- [ ] Create `src/src/pages/NotFoundPage.tsx` from `src/app/not-found.tsx`
- [ ] Create `src/src/pages/ErrorPage.tsx` from `src/app/error.tsx`
- [ ] Verify navigation between all routes works
- [ ] Verify article slug routing with `useParams`
- [ ] Verify 404 page renders for unknown routes
- [ ] Verify error boundary catches runtime errors
- [ ] Delete `src/app/` directory after all pages verified
