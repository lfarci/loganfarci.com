import matter from "gray-matter";
import { Article } from "@/types";

const articles = Object.entries(import.meta.glob("/content/articles/*.md", { as: "raw", eager: true })).map(([path, content]) => {
    const slug = path.split("/").pop()?.replace(".md", "") ?? "";
    const { data, content: mdContent } = matter(content);
    return {
        slug,
        title: data.title || "",
        description: data.description || "",
        publishedAt: data.publishedAt || "",
        featured: data.featured || false,
        tags: data.tags || [],
        author: data.author || "",
        coauthoredWithAgent: data.coauthoredWithAgent || false,
        content: mdContent,
    };
});

export const getArticleSlugs = (): string[] => {
    return articles.map((article) => article.slug);
};

export const getArticleBySlug = (slug: string): Article | null => {
    return articles.find((article) => article.slug === slug) ?? null;
};

export const getAllArticles = (): Article[] => {
    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getFeaturedArticles = (): Article[] => {
    return getAllArticles().filter((article) => article.featured);
};

