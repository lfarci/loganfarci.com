import { Article } from "@/types";

// Vite resolves this glob at build time — no fs needed
const articleModules = import.meta.glob<{
    frontmatter: Record<string, unknown>;
    content: string;
}>("@content/articles/*.md", { eager: true });

const parseArticle = (modulePath: string, mod: { frontmatter: Record<string, unknown>; content: string }): Article => {
    const slug = modulePath.split("/").pop()!.replace(".md", "");
    const fm = mod.frontmatter;
    return {
        slug,
        title: (fm.title as string) ?? "",
        description: (fm.description as string) ?? "",
        publishedAt: (fm.publishedAt as string) ?? "",
        featured: (fm.featured as boolean) ?? false,
        tags: (fm.tags as string[]) ?? [],
        author: (fm.author as string) ?? "",
        coauthoredWithAgent: (fm.coauthoredWithAgent as boolean) ?? false,
        content: mod.content,
    };
};

const allArticles: Article[] = Object.entries(articleModules)
    .map(([modulePath, mod]) => parseArticle(modulePath, mod))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const getArticleSlugs = (): string[] => allArticles.map((a) => a.slug);

export const getArticleBySlug = (slug: string): Article | null =>
    allArticles.find((a) => a.slug === slug) ?? null;

export const getAllArticles = (): Article[] => allArticles;

export const getFeaturedArticles = (): Article[] => allArticles.filter((a) => a.featured);

