import path from "path";
import { resolveDirectoryFromEnvironment } from "./environment";
import { listFilesWithExtension } from "./files";
import matter from "gray-matter";
import { Article } from "@/types";
import fs from "fs";

type ArticleFrontmatter = {
    title?: string;
    description?: string;
    publishedAt?: string;
    featured?: boolean;
    tags?: string[];
    author?: string;
    coauthoredWithAgent?: boolean;
};

const isArticleFrontmatter = (value: unknown): value is ArticleFrontmatter => {
    return typeof value === "object" && value !== null;
};

const getArticlesDirectoryPath = (): string => {
    return resolveDirectoryFromEnvironment("ARTICLES_DIRECTORY", "../content/articles");
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
    const parsed = matter(article);
    const rawData: unknown = parsed.data;
    const metadata: ArticleFrontmatter = isArticleFrontmatter(rawData) ? rawData : {};
    const { content } = parsed;
    return {
        slug,
        title: metadata.title ?? "",
        description: metadata.description ?? "",
        publishedAt: metadata.publishedAt ?? "",
        featured: metadata.featured ?? false,
        tags: metadata.tags ?? [],
        author: metadata.author ?? "",
        coauthoredWithAgent: metadata.coauthoredWithAgent ?? false,
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
