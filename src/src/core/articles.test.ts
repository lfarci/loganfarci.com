import { describe, expect, it } from "vitest";

import { getAllArticles, getArticleBySlug, getArticleSlugs, getFeaturedArticles } from "./articles";

describe("articles", () => {
    it("loads the available article slugs from content", () => {
        const articles = getAllArticles();
        const slugs = getArticleSlugs();

        expect(articles.length).toBeGreaterThan(0);
        expect(slugs).toHaveLength(articles.length);
        expect(slugs).toContain("github-copilot-customizations");
    });

    it("returns articles sorted by published date descending", () => {
        const articles = getAllArticles();
        const sortedDates = [...articles].map((article) => article.publishedAt);
        const expectedDates = [...sortedDates].sort((left, right) => new Date(right).getTime() - new Date(left).getTime());

        expect(sortedDates).toEqual(expectedDates);
    });

    it("returns a single article by slug and null for an unknown slug", () => {
        expect(getArticleBySlug("github-copilot-customizations")?.title).toBe(
            "I made GitHub Copilot my writing assistant"
        );
        expect(getArticleBySlug("missing-article")).toBeNull();
    });

    it("returns only featured articles from the full set", () => {
        const featuredArticles = getFeaturedArticles();

        expect(featuredArticles.length).toBeGreaterThan(0);
        expect(featuredArticles.every((article) => article.featured)).toBe(true);
    });
});
