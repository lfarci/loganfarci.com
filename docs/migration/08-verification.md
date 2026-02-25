# 08 — Verification

This document provides a comprehensive testing plan to ensure the migration from Next.js to Vite + React introduces no regressions.

## Pre-Migration Baseline

Before starting the migration, capture the current state for comparison:

- [ ] Screenshot every page at desktop and mobile widths (/, /about, /articles, /articles/[each-slug], /404)
- [ ] Run Lighthouse on the production site and save the report (Performance, SEO, Accessibility, Best Practices scores)
- [ ] Save the current `out/` directory structure as a reference for the expected prerender output
- [ ] Record the current page load times (TTFB, FCP, LCP) from Chrome DevTools

## Development Server Verification

After the migration, verify with `npm run dev`:

### Routing

- [ ] `/` renders the home page with profile, certifications, interests, featured articles
- [ ] `/about` renders experience, education, skills, certifications sections
- [ ] `/articles` renders the full article list sorted by date
- [ ] `/articles/<slug>` renders each article with title, metadata, markdown content
- [ ] `/articles/<nonexistent-slug>` shows the 404 page
- [ ] `/nonexistent-path` shows the 404 page
- [ ] Navigation between pages works without full page reload (SPA navigation)
- [ ] Browser back/forward buttons work correctly
- [ ] Direct URL entry works for all routes (Vite dev server serves `index.html` for all paths)

### Content

- [ ] All article titles, descriptions, and dates match the markdown front matter
- [ ] Article markdown renders correctly (headings, code blocks, links, images, mermaid diagrams)
- [ ] All JSON data renders correctly (certifications with images, experiences with logos, skills with icons)
- [ ] Featured articles filter works (only featured articles appear on home page)
- [ ] Article sort order is correct (newest first)

### Styling

- [ ] Dark mode toggle works and persists across page navigation
- [ ] Dark mode preference persists after page refresh (localStorage)
- [ ] Fonts render correctly:
  - Headings use Manrope
  - Body text uses Noto Sans
  - Code blocks use Reddit Mono
- [ ] HeroUI components render correctly (cards, dividers, tooltips, navbar)
- [ ] Responsive layout works at mobile, tablet, and desktop widths
- [ ] All images load (avatar, certification badges, experience logos, skill icons)
- [ ] Animations work (framer-motion transitions)

### Interactive Features

- [ ] Terminal component works (command input, output display)
- [ ] Theme toggle button functions
- [ ] Navigation bar highlights current route
- [ ] Tooltip components display on hover
- [ ] Code snippet copy button works
- [ ] External links open in new tabs

### Hot Module Replacement (HMR)

- [ ] Editing a React component updates the page without full refresh
- [ ] Editing `globals.css` updates styles live
- [ ] Editing a markdown article file updates the article page live
- [ ] Editing a JSON data file updates the relevant page content

## Build Verification

After running `npm run build`:

### Output Structure

- [ ] `dist/index.html` exists (home page)
- [ ] `dist/about/index.html` exists
- [ ] `dist/articles/index.html` exists
- [ ] `dist/articles/<slug>/index.html` exists for each article
- [ ] `dist/404.html` exists
- [ ] `dist/assets/` contains hashed JS and CSS bundles
- [ ] `dist/images/` contains all public images
- [ ] `dist/staticwebapp.config.json` exists with updated asset paths

### Prerendered HTML Content

- [ ] `dist/index.html` contains rendered profile text (not empty `<div id="root">`)
- [ ] `dist/about/index.html` contains rendered experience and skills content
- [ ] `dist/articles/index.html` contains rendered article list
- [ ] Each `dist/articles/<slug>/index.html` contains the full article content
- [ ] `dist/404.html` contains the "Page Not Found" text
- [ ] Each HTML file has the correct `<title>` tag
- [ ] Each HTML file has the correct `<meta name="description">` tag

### Preview Server

Run `npm run preview` (or `npx vite preview`):

- [ ] All pages render correctly from static files
- [ ] Client-side hydration works (no content flicker on load)
- [ ] SPA navigation works after initial page load
- [ ] No console errors or hydration mismatch warnings

## Azure Static Web Apps Verification

### Local SWA Test

Run `npx swa start dist/`:

- [ ] Home page loads at `http://localhost:4280/`
- [ ] All routes return correct content
- [ ] Unknown routes fall back to `404.html` with 404 status code
- [ ] Static assets (JS, CSS, images) are served correctly
- [ ] `staticwebapp.config.json` navigation fallback works

### Deployment Test

- [ ] Push to a branch and verify the GitHub Actions workflow completes
- [ ] SWA preview environment deploys successfully
- [ ] All pages are accessible on the preview URL
- [ ] Custom domain (if applicable) resolves correctly

## Visual Regression Comparison

Compare screenshots of the Vite build against the pre-migration baseline:

| Page | Check |
|---|---|
| `/` (desktop) | Layout, hero section, certifications grid, articles list |
| `/` (mobile) | Responsive layout, stacked sections |
| `/about` (desktop) | Experience cards, skill categories, education |
| `/about` (mobile) | Responsive cards, stacked layout |
| `/articles` (desktop) | Article list with tags, dates |
| `/articles/<slug>` (desktop) | Article heading, metadata, markdown content |
| `/articles/<slug>` (mobile) | Responsive article layout |
| `/404` | Error message and back-to-home link |
| Dark mode (any page) | Correct dark theme colors throughout |

## Performance Comparison

Run Lighthouse on the Vite build and compare with baseline:

| Metric | Target |
|---|---|
| Performance score | ≥ baseline |
| SEO score | ≥ baseline |
| Accessibility score | ≥ baseline |
| Best Practices score | ≥ baseline |
| First Contentful Paint (FCP) | ≤ baseline |
| Largest Contentful Paint (LCP) | ≤ baseline |
| Total Blocking Time (TBT) | ≤ baseline |
| Bundle size (JS) | ≤ baseline + 10% (acceptable margin) |

## Cleanup Verification

After all tests pass:

- [ ] `src/app/` directory is deleted
- [ ] `src/core/environment.ts` is deleted
- [ ] `src/core/files.ts` is deleted
- [ ] `next.config.ts` is deleted
- [ ] `next-env.d.ts` is deleted
- [ ] No `next` or `eslint-config-next` in `node_modules/` after `npm install`
- [ ] No references to `next/*` imports remain in any source file
- [ ] No `"use client"` directives remain in any source file
- [ ] No `process.env.NEXT_PUBLIC_*` references remain
- [ ] `.gitignore` references `dist` not `.next` or `out`
- [ ] CI/CD workflow deploys from `dist/` not `out/`

## Rollback Plan

If critical issues are found after deployment:

1. Revert the merge commit on `main`
2. The previous Next.js build will redeploy automatically via CI/CD
3. No infrastructure changes are needed (Azure SWA serves any static files)

The migration should be done on a feature branch with a PR for review before merging to `main`.
