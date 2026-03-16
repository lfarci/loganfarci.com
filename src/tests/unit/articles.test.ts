import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/core/articles", () => ({
    getAllArticles: vi.fn(),
    getArticleSlugs: vi.fn(),
    getArticleBySlug: vi.fn(),
    getFeaturedArticles: vi.fn(),
}));

import { getAllArticles, getArticleSlugs, getArticleBySlug, getFeaturedArticles } from "@/core/articles";

const sampleArticle = {
    slug: "sample-article",
    title: "Sample Article",
    description: "A sample description",
    publishedAt: "2024-06-01",
    featured: true,
    tags: ["react", "vite"],
    author: "Logan Farci",
    coauthoredWithAgent: false,
    content: "# Sample\n\nBody text.",
};

const olderArticle = {
    slug: "older-article",
    title: "Older Article",
    description: "An older description",
    publishedAt: "2023-01-15",
    featured: false,
    tags: ["typescript"],
    author: "Logan Farci",
    coauthoredWithAgent: false,
    content: "Older content.",
};

const defaultArticles = [sampleArticle, olderArticle];

beforeEach(() => {
    vi.mocked(getAllArticles).mockReturnValue(defaultArticles);
    vi.mocked(getArticleSlugs).mockReturnValue(defaultArticles.map((a) => a.slug));
    vi.mocked(getArticleBySlug).mockImplementation(
        (slug: string) => defaultArticles.find((a) => a.slug === slug) ?? null
    );
    vi.mocked(getFeaturedArticles).mockReturnValue(defaultArticles.filter((a) => a.featured));
});

describe("getAllArticles", () => {
    it("returns all articles", () => {
        expect(getAllArticles()).toHaveLength(2);
    });

    it("returns an empty array when no articles exist", () => {
        vi.mocked(getAllArticles).mockReturnValueOnce([]);
        expect(getAllArticles()).toHaveLength(0);
    });
});

describe("getArticleSlugs", () => {
    it("returns a slug for each article", () => {
        expect(getArticleSlugs()).toHaveLength(2);
    });

    it("returns an empty array when no articles exist", () => {
        vi.mocked(getArticleSlugs).mockReturnValueOnce([]);
        expect(getArticleSlugs()).toHaveLength(0);
    });
});

describe("getArticleBySlug", () => {
    it("returns the article matching the given slug", () => {
        expect(getArticleBySlug("sample-article")?.title).toBe("Sample Article");
    });

    it("returns null for an unknown slug", () => {
        expect(getArticleBySlug("does-not-exist")).toBeNull();
    });

    it("returns the first match when two articles share the same slug", () => {
        const first = { ...sampleArticle, title: "First" };
        const second = { ...sampleArticle, title: "Second" };
        vi.mocked(getArticleBySlug).mockImplementationOnce(
            (slug: string) => [first, second].find((a) => a.slug === slug) ?? null
        );
        expect(getArticleBySlug("sample-article")?.title).toBe("First");
    });
});

describe("getFeaturedArticles", () => {
    it("returns only featured articles", () => {
        expect(getFeaturedArticles().every((a) => a.featured)).toBe(true);
    });

    it("excludes non-featured articles", () => {
        expect(getFeaturedArticles().find((a) => a.slug === "older-article")).toBeUndefined();
    });

    it("returns an empty array when no featured articles exist", () => {
        vi.mocked(getFeaturedArticles).mockReturnValueOnce([]);
        expect(getFeaturedArticles()).toHaveLength(0);
    });
});
