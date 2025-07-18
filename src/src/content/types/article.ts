export interface Article {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    featured: boolean;
    tags: string[];
    content: string;
    author: string;
    coauthoredWithAgent: boolean;
}
