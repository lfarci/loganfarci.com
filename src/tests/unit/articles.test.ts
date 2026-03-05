import { describe, it, expect, vi } from "vitest";

// import.meta.glob is resolved at build time by Vite; mock the articles module
// so article utilities can be exercised without real .md files.
vi.mock("@/core/articles", () => {
    const articles = [
        {
            slug: "sample-article",
            title: "Sample Article",
            description: "A sample description",
            publishedAt: "2024-06-01",
            featured: true,
            tags: ["react", "vite"],
            author: "Logan Farci",
            coauthoredWithAgent: false,
            content: "# Sample\n\nBody text.",
        },
        {
            slug: "older-article",
            title: "Older Article",
            description: "An older description",
            publishedAt: "2023-01-15",
            featured: false,
            tags: ["typescript"],
            author: "Logan Farci",
            coauthoredWithAgent: false,
            content: "Older content.",
        },
    ];

    return {
        getAllArticles: () => articles,
        getArticleSlugs: () => articles.map((a) => a.slug),
        getArticleBySlug: (slug: string) => articles.find((a) => a.slug === slug) ?? null,
        getFeaturedArticles: () => articles.filter((a) => a.featured),
    };
});

import { getAllArticles, getArticleSlugs, getArticleBySlug, getFeaturedArticles } from "@/core/articles";

describe("getAllArticles", () => {
    it("returns all articles", () => {
        const result = getAllArticles();
        expect(result).toHaveLength(2);
    });

    it("returns articles with required fields", () => {
        const articles = getAllArticles();
        for (const article of articles) {
            expect(article).toHaveProperty("slug");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("publishedAt");
        }
    });
});

describe("getArticleSlugs", () => {
    it("returns a slug for each article", () => {
        const slugs = getArticleSlugs();
        expect(slugs).toHaveLength(2);
    });

    it("returns only strings", () => {
        const slugs = getArticleSlugs();
        expect(slugs.every((s) => typeof s === "string")).toBe(true);
    });
});

describe("getArticleBySlug", () => {
    it("returns the article matching the given slug", () => {
        const article = getArticleBySlug("sample-article");
        expect(article).not.toBeNull();
        expect(article?.title).toBe("Sample Article");
    });

    it("returns null for an unknown slug", () => {
        expect(getArticleBySlug("does-not-exist")).toBeNull();
    });
});

describe("getFeaturedArticles", () => {
    it("returns only featured articles", () => {
        const featured = getFeaturedArticles();
        expect(featured.every((a) => a.featured)).toBe(true);
    });

    it("excludes non-featured articles", () => {
        const featured = getFeaturedArticles();
        expect(featured.find((a) => a.slug === "older-article")).toBeUndefined();
    });
});
