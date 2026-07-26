import { describe, expect, it } from "vitest";

import type { Article, Contact, Experience, Profile } from "@/types";
import {
    createArticleJsonLd,
    createBreadcrumbJsonLd,
    createCanonicalUrl,
    createPersonJsonLd,
    createWebSiteJsonLd,
} from "./seo";
import { siteUrl } from "./site";

const mockProfile: Profile = {
    role: "Software Engineer",
    introduction: "Building cloud-native solutions.",
    description: "A software engineer specializing in Azure.",
    avatar: { src: "/images/avatar.png", alt: "Avatar" },
};

const mockContacts: Contact[] = [
    { name: "GitHub", icon: "/github.svg", url: "https://github.com/lfarci" },
    { name: "LinkedIn", icon: "/linkedin.svg", url: "https://linkedin.com/in/lfarci" },
    { name: "Email", icon: "/email.svg", url: "mailto:hello@example.com" },
];

const mockExperience: Experience = {
    name: "Software Engineer",
    company: { name: "Contoso", website: "https://contoso.com", location: "Brussels" },
    start: new Date("2022-01-01"),
};

const mockArticle: Article = {
    slug: "hello-world",
    title: "Hello World",
    description: "A first article about getting started.",
    publishedAt: "2024-06-01",
    featured: false,
    tags: ["intro", "azure"],
    content: "# Hello World\n\nThis is the content.",
    author: "Logan Farci",
    coauthoredWithAgent: false,
};

describe("createCanonicalUrl", () => {
    it("returns the bare site URL for the root path", () => {
        expect(createCanonicalUrl("/")).toBe(siteUrl);
    });

    it("prepends the site URL and a leading slash for a relative path without slash", () => {
        expect(createCanonicalUrl("about")).toBe(`${siteUrl}/about`);
    });

    it("prepends the site URL for an absolute-style path with a leading slash", () => {
        expect(createCanonicalUrl("/articles/hello-world")).toBe(`${siteUrl}/articles/hello-world`);
    });

    it("defaults to the root path when called without arguments", () => {
        expect(createCanonicalUrl()).toBe(siteUrl);
    });
});

describe("createWebSiteJsonLd", () => {
    it("returns an object with the required JSON-LD fields", () => {
        const ld = createWebSiteJsonLd();

        expect(ld["@context"]).toBe("https://schema.org");
        expect(ld["@type"]).toBe("WebSite");
        expect(typeof ld["name"]).toBe("string");
        expect((ld["name"] as string).length).toBeGreaterThan(0);
        expect(typeof ld["description"]).toBe("string");
        expect((ld["description"] as string).length).toBeGreaterThan(0);
        expect(typeof ld["url"]).toBe("string");
        expect((ld["url"] as string).length).toBeGreaterThan(0);
    });

    it("sets the url to the canonical site URL", () => {
        expect(createWebSiteJsonLd()["url"]).toBe(siteUrl);
    });
});

describe("createPersonJsonLd", () => {
    it("returns an object with the required JSON-LD fields", () => {
        const ld = createPersonJsonLd(mockProfile, mockContacts);

        expect(ld["@context"]).toBe("https://schema.org");
        expect(ld["@type"]).toBe("Person");
        expect(typeof ld["name"]).toBe("string");
        expect((ld["name"] as string).length).toBeGreaterThan(0);
        expect(typeof ld["url"]).toBe("string");
        expect((ld["url"] as string).length).toBeGreaterThan(0);
        expect(typeof ld["description"]).toBe("string");
        expect((ld["description"] as string).length).toBeGreaterThan(0);
    });

    it("only includes absolute HTTP(S) URLs in sameAs", () => {
        const ld = createPersonJsonLd(mockProfile, mockContacts);
        const sameAs = ld["sameAs"] as string[];

        expect(Array.isArray(sameAs)).toBe(true);
        for (const url of sameAs) {
            expect(url.startsWith("http://") || url.startsWith("https://")).toBe(true);
        }
    });

    it("excludes non-HTTP(S) contact URLs from sameAs", () => {
        const ld = createPersonJsonLd(mockProfile, mockContacts);
        const sameAs = ld["sameAs"] as string[];

        expect(sameAs).not.toContain("mailto:hello@example.com");
    });

    it("omits sameAs when no HTTP(S) contacts are provided", () => {
        const nonHttpContacts: Contact[] = [
            { name: "Email", icon: "/email.svg", url: "mailto:hello@example.com" },
        ];
        const ld = createPersonJsonLd(mockProfile, nonHttpContacts);

        expect(ld["sameAs"]).toBeUndefined();
    });

    it("includes worksFor when a current experience is provided", () => {
        const ld = createPersonJsonLd(mockProfile, mockContacts, mockExperience);
        const worksFor = ld["worksFor"] as Record<string, string>;

        expect(worksFor).toBeDefined();
        expect(worksFor["name"]).toBe("Contoso");
        expect(worksFor["url"]).toBe("https://contoso.com");
    });

    it("omits worksFor when no current experience is provided", () => {
        const ld = createPersonJsonLd(mockProfile, mockContacts);

        expect(ld["worksFor"]).toBeUndefined();
    });
});

describe("createBreadcrumbJsonLd", () => {
    it("returns an object with the required JSON-LD fields", () => {
        const ld = createBreadcrumbJsonLd([{ name: "Home", path: "/" }]);

        expect(ld["@context"]).toBe("https://schema.org");
        expect(ld["@type"]).toBe("BreadcrumbList");
        expect(Array.isArray(ld["itemListElement"])).toBe(true);
    });

    it("maps each item to a ListItem with the correct position and canonical URL", () => {
        const items = [
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
        ];
        const ld = createBreadcrumbJsonLd(items);
        const list = ld["itemListElement"] as Array<Record<string, unknown>>;

        expect(list).toHaveLength(2);
        expect(list[0]["position"]).toBe(1);
        expect(list[0]["name"]).toBe("Home");
        expect(list[1]["position"]).toBe(2);
        expect(list[1]["item"]).toBe(`${siteUrl}/articles`);
    });
});

describe("createArticleJsonLd", () => {
    it("returns an object with the required JSON-LD fields", () => {
        const ld = createArticleJsonLd(mockArticle);

        expect(ld["@context"]).toBe("https://schema.org");
        expect(ld["@type"]).toBe("Article");
        expect(typeof ld["headline"]).toBe("string");
        expect((ld["headline"] as string).length).toBeGreaterThan(0);
        expect(typeof ld["description"]).toBe("string");
        expect((ld["description"] as string).length).toBeGreaterThan(0);
        expect(typeof ld["url"]).toBe("string");
        expect((ld["url"] as string).length).toBeGreaterThan(0);
    });

    it("sets the url to the canonical article URL", () => {
        const ld = createArticleJsonLd(mockArticle);

        expect(ld["url"]).toBe(`${siteUrl}/articles/hello-world`);
    });

    it("sets the headline to the article title", () => {
        const ld = createArticleJsonLd(mockArticle);

        expect(ld["headline"]).toBe("Hello World");
    });

    it("sets datePublished and dateModified from the article publishedAt field", () => {
        const ld = createArticleJsonLd(mockArticle);

        expect(ld["datePublished"]).toBe("2024-06-01");
        expect(ld["dateModified"]).toBe("2024-06-01");
    });

    it("sets the author name to the article author", () => {
        const ld = createArticleJsonLd(mockArticle);
        const author = ld["author"] as Record<string, string>;

        expect(author["name"]).toBe("Logan Farci");
    });

    it("falls back to the site name when the article author is empty", () => {
        const articleWithoutAuthor = { ...mockArticle, author: "" };
        const ld = createArticleJsonLd(articleWithoutAuthor);
        const author = ld["author"] as Record<string, string>;

        expect(author["name"]).toBe("Logan Farci");
    });
});
