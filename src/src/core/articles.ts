import path from "path";
import { resolveDirectoryFromEnvironment } from "./environment";
import { listFilesWithExtension } from "../../core/files";
import matter from "gray-matter";
import { Article } from "@/types";
import fs from "fs";

const getArticlesDirectoryPath = (): string => {
    return resolveDirectoryFromEnvironment("ARTICLES_DIRECTORY", "content/articles");
};

export const getArticleSlugs = (): string[] => {
    const dir = getArticlesDirectoryPath();
    const files = listFilesWithExtension(dir, ".md");
    return files.map((file: string) => path.basename(file, ".md"));
};

export const getArticleBySlug = (slug: string): Article | null => {
    const articlePath = path.join(getArticlesDirectoryPath(), `${slug}.md`);
    if (!fs.existsSync(articlePath)) {
        return null;
    }
    const article = fs.readFileSync(articlePath, "utf8");
    const { data, content } = matter(article);
    return {
        slug,
        title: data.title || "",
        description: data.description || "",
        publishedAt: data.publishedAt || "",
        featured: data.featured || false,
        tags: data.tags || [],
        author: data.author || "",
        coauthoredWithAgent: data.coauthoredWithAgent || false,
        content,
    };
};

export const getAllArticles = (): Article[] => {
    const slugs = getArticleSlugs();
    return slugs
        .map((slug) => getArticleBySlug(slug))
        .filter((article): article is Article => article !== null)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getFeaturedArticles = (): Article[] => {
    return getAllArticles().filter((article) => article.featured);
};
