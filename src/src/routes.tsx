import { RouteObject } from "react-router";
import { getArticleSlugs } from "@/core/articles";
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

export const getStaticRoutes = (): string[] => [
    "/",
    "/about",
    "/articles",
    ...getArticleSlugs().map((slug) => `/articles/${slug}`),
];
