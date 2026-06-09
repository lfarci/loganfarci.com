import type { Article, Contact, Experience, Profile } from "@/types";
import { siteOgImage, siteUrl } from "@/core/site";

export const siteName = "Logan Farci";
export const siteDescription =
    "Software Engineer specializing in Azure, C#, .NET, and cloud-native solutions.";

export type JsonLdPrimitive = string | number | boolean | null;
export type JsonLdValue = JsonLdPrimitive | JsonLdObject | JsonLdValue[];
export interface JsonLdObject {
    [key: string]: JsonLdValue;
}

export const createCanonicalUrl = (path = "/"): string => {
    if (path === "/") return siteUrl;
    return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const createAbsoluteUrl = (pathOrUrl: string): string => {
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
        return pathOrUrl;
    }

    return createCanonicalUrl(pathOrUrl);
};

export const createWebSiteJsonLd = (): JsonLdObject => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    inLanguage: "en-US",
    author: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#person` },
});

export const createPersonJsonLd = (
    profile: Profile,
    contacts: Contact[],
    currentExperience?: Experience,
): JsonLdObject => {
    const sameAs = contacts
        .map((contact) => contact.url)
        .filter((url) => url.startsWith("http://") || url.startsWith("https://"));

    const person: JsonLdObject = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: siteName,
        url: siteUrl,
        image: createAbsoluteUrl(profile.avatar.src),
        jobTitle: "Software Engineer",
        description: profile.introduction,
        hasOccupation: {
            "@type": "Occupation",
            name: "Software Engineer",
            occupationalCategory: "15-1252.00",
        },
    };

    if (sameAs.length > 0) {
        person.sameAs = sameAs;
    }

    if (currentExperience) {
        person.worksFor = {
            "@type": "Organization",
            name: currentExperience.company.name,
            url: currentExperience.company.website,
        };
    }

    return person;
};

export const createBreadcrumbJsonLd = (
    items: Array<{ name: string; path: string }>,
): JsonLdObject => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: createCanonicalUrl(item.path),
    })),
});

export const createArticleJsonLd = (article: Article): JsonLdObject => {
    const articleUrl = createCanonicalUrl(`/articles/${article.slug}`);

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        url: articleUrl,
        mainEntityOfPage: articleUrl,
        image: siteOgImage,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: {
            "@type": "Person",
            "@id": `${siteUrl}/#person`,
            name: article.author || siteName,
        },
        publisher: { "@id": `${siteUrl}/#person` },
        keywords: article.tags,
        inLanguage: "en-US",
    };
};
