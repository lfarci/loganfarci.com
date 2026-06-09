import { describe, expect, it } from "vitest";

import { getAllArticles, getArticleBySlug, getArticleSlugs, getFeaturedArticles } from "./articles";

const stripFencedCodeBlocks = (content: string) => content.replace(/```[\s\S]*?```/g, "");
const vagueDescriptionStarter = /^(short note about|a quick note on|a focused guide on)\b/i;

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
            "Customizing GitHub Copilot for Technical Writing"
        );
        expect(getArticleBySlug("missing-article")).toBeNull();
    });

    it("returns only featured articles from the full set", () => {
        const featuredArticles = getFeaturedArticles();

        expect(featuredArticles.length).toBeGreaterThan(0);
        expect(featuredArticles.every((article) => article.featured)).toBe(true);
    });

    it("keeps SEO-focused descriptions for the affected articles", () => {
        const affectedSlugs = ["mcp", "github-mcp-server", "git-worktree-vscode", "flouz-personal-finance-tool"];

        for (const slug of affectedSlugs) {
            const article = getArticleBySlug(slug);

            expect(article).not.toBeNull();
            expect(article!.description.length).toBeGreaterThanOrEqual(120);
            expect(article!.description.length).toBeLessThanOrEqual(160);
            expect(article!.description).not.toMatch(vagueDescriptionStarter);
        }
    });

    it("does not allow duplicate top-level headings in the affected article bodies", () => {
        const affectedSlugs = ["github-copilot-customizations", "agentic-workflow-pr-quality-checks"];

        for (const slug of affectedSlugs) {
            const article = getArticleBySlug(slug);

            expect(article).not.toBeNull();
            expect(stripFencedCodeBlocks(article!.content)).not.toMatch(/^#\s/m);
        }
    });
});
