import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router";
import { getArticleSlugs } from "@/core/articles";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticlePage from "@/pages/ArticlePage";
import NotFoundPage from "@/pages/NotFoundPage";

export const markdownCalloutsShowcasePath = "/_dev/markdown-callouts";

const MarkdownCalloutsShowcasePage = import.meta.env.DEV
    ? lazy(() => import("@/pages/MarkdownCalloutsShowcasePage"))
    : null;

export function createRoutes(includeDevelopmentRoutes: boolean): RouteObject[] {
    const developmentRoutes =
        includeDevelopmentRoutes && MarkdownCalloutsShowcasePage
            ? [
                  {
                      path: markdownCalloutsShowcasePath,
                      element: (
                          <Suspense fallback={null}>
                              <MarkdownCalloutsShowcasePage />
                          </Suspense>
                      ),
                  },
              ]
            : [];

    return [
        { path: "/", element: <HomePage /> },
        { path: "/about", element: <AboutPage /> },
        { path: "/articles", element: <ArticlesPage /> },
        { path: "/articles/:slug", element: <ArticlePage /> },
        ...developmentRoutes,
        { path: "*", element: <NotFoundPage /> },
    ];
}

export const routes = createRoutes(import.meta.env.DEV);

export const getStaticRoutes = (): string[] => [
    "/",
    "/about",
    "/articles",
    ...getArticleSlugs().map((slug) => `/articles/${slug}`),
];
