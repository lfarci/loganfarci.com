import { describe, expect, it } from "vitest";

import type { Article, Contact, Experience, Profile } from "@/types";
import {
    createArticleJsonLd,
    createBreadcrumbJsonLd,
    createCanonicalUrl,
    createPersonJsonLd,
    createWebSiteJsonLd,
    siteName,
} from "@/core/seo";
import { siteUrl } from "@/core/site";

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
    start: "2022-01-01",
};

const mockArticle: Article = {
    slug: "hello-world",
    title: "Hello World",
    description: "A first article about getting started.",
    publishedAt: "2024-06-01",
    featured: false,
    tags: ["intro", "azure"],
    content: "# Hello World\n\nThis is the content.",
    author: "Ada Lovelace",
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
    it("sets the JSON-LD context to schema.org", () => {
        expect(createWebSiteJsonLd()["@context"]).toBe("https://schema.org");
    });

    it("identifies the entity as a WebSite", () => {
        expect(createWebSiteJsonLd()["@type"]).toBe("WebSite");
    });

    it("sets a non-empty site name", () => {
        expect(createWebSiteJsonLd()["name"]).toEqual(expect.stringMatching(/\S/));
    });

    it("sets a non-empty site description", () => {
        expect(createWebSiteJsonLd()["description"]).toEqual(expect.stringMatching(/\S/));
    });

    it("sets the URL to the canonical site URL", () => {
        expect(createWebSiteJsonLd()["url"]).toBe(siteUrl);
    });
});

describe("createPersonJsonLd", () => {
    it("sets the JSON-LD context to schema.org", () => {
        expect(createPersonJsonLd(mockProfile, mockContacts)["@context"]).toBe("https://schema.org");
    });

    it("identifies the entity as a Person", () => {
        expect(createPersonJsonLd(mockProfile, mockContacts)["@type"]).toBe("Person");
    });

    it("sets the person name to the site name", () => {
        expect(createPersonJsonLd(mockProfile, mockContacts)["name"]).toBe(siteName);
    });

    it("sets the person URL to the canonical site URL", () => {
        expect(createPersonJsonLd(mockProfile, mockContacts)["url"]).toBe(siteUrl);
    });

    it("sets the description from the profile introduction", () => {
        expect(createPersonJsonLd(mockProfile, mockContacts)["description"]).toBe(mockProfile.introduction);
    });

    it("retains only HTTP(S) contact URLs in sameAs", () => {
        const ld = createPersonJsonLd(mockProfile, mockContacts);

        expect(ld["sameAs"]).toEqual(["https://github.com/lfarci", "https://linkedin.com/in/lfarci"]);
    });

    it("omits sameAs when no HTTP(S) contacts are provided", () => {
        const nonHttpContacts: Contact[] = [{ name: "Email", icon: "/email.svg", url: "mailto:hello@example.com" }];
        const ld = createPersonJsonLd(mockProfile, nonHttpContacts);

        expect(ld["sameAs"]).toBeUndefined();
    });

    it("includes worksFor when a current experience is provided", () => {
        const ld = createPersonJsonLd(mockProfile, mockContacts, mockExperience);

        expect(ld["worksFor"]).toEqual({ "@type": "Organization", name: "Contoso", url: "https://contoso.com" });
    });

    it("omits worksFor when no current experience is provided", () => {
        const ld = createPersonJsonLd(mockProfile, mockContacts);

        expect(ld["worksFor"]).toBeUndefined();
    });
});

describe("createBreadcrumbJsonLd", () => {
    it("sets the JSON-LD context to schema.org", () => {
        expect(createBreadcrumbJsonLd([])["@context"]).toBe("https://schema.org");
    });

    it("identifies the entity as a BreadcrumbList", () => {
        expect(createBreadcrumbJsonLd([])["@type"]).toBe("BreadcrumbList");
    });

    it("maps each breadcrumb to an ordered canonical ListItem", () => {
        const items = [
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
        ];
        const ld = createBreadcrumbJsonLd(items);

        expect(ld["itemListElement"]).toEqual([
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Articles", item: `${siteUrl}/articles` },
        ]);
    });
});

describe("createArticleJsonLd", () => {
    it("sets the JSON-LD context to schema.org", () => {
        expect(createArticleJsonLd(mockArticle)["@context"]).toBe("https://schema.org");
    });

    it("identifies the entity as an Article", () => {
        expect(createArticleJsonLd(mockArticle)["@type"]).toBe("Article");
    });

    it("sets the URL to the canonical article URL", () => {
        const ld = createArticleJsonLd(mockArticle);

        expect(ld["url"]).toBe(`${siteUrl}/articles/hello-world`);
    });

    it("sets the headline to the article title", () => {
        const ld = createArticleJsonLd(mockArticle);

        expect(ld["headline"]).toBe("Hello World");
    });

    it("sets the description to the article description", () => {
        expect(createArticleJsonLd(mockArticle)["description"]).toBe(mockArticle.description);
    });

    it("sets datePublished and dateModified from the article publishedAt field", () => {
        const ld = createArticleJsonLd(mockArticle);

        expect(ld).toMatchObject({ datePublished: "2024-06-01", dateModified: "2024-06-01" });
    });

    it("sets the author name to the article author", () => {
        const ld = createArticleJsonLd(mockArticle);
        const author = ld["author"] as Record<string, string>;

        expect(author["name"]).toBe("Ada Lovelace");
    });

    it("falls back to the site name when the article author is empty", () => {
        const articleWithoutAuthor = { ...mockArticle, author: "" };
        const ld = createArticleJsonLd(articleWithoutAuthor);
        const author = ld["author"] as Record<string, string>;

        expect(author["name"]).toBe(siteName);
    });
});
