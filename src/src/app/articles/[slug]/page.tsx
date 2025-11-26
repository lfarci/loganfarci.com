import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleSlugs } from "@/core/articles";
import MarkdownContent from "@/components/shared/MarkdownContent";
import { Heading1, Secondary } from "@/components/shared/typography";
import { formatDate } from "@/core/date";
import { Divider } from "@heroui/react";
import ClientTooltip from "@/components/shared/ClientTooltip";
import IconTag from "@/components/shared/IconTag";

interface ArticlePageParams {
    slug: string;
}

interface ArticlePageProps {
    params: ArticlePageParams;
}

interface ArticleMetaProps {
    publishedAt: string;
    author: string;
    coauthoredWithAgent?: boolean;
    tags?: string[];
}

function ArticleMeta({ publishedAt, author, coauthoredWithAgent, tags }: ArticleMetaProps) {
    return (
        <Secondary className="mb-4">
            <span className="flex flex-row flex-wrap items-center gap-2">
                <Secondary>{formatDate(publishedAt)}</Secondary>
                <Divider orientation="vertical" className="h-6 mx-2" />
                <Secondary>{author}</Secondary>
                {coauthoredWithAgent && (
                    <>
                        <Divider orientation="vertical" className="h-6 mx-2" />
                        <ClientTooltip content="This article was co-authored with help from an AI assistant.">
                            <Secondary>Co-authored with AI</Secondary>
                        </ClientTooltip>
                    </>
                )}
                {tags && tags.length > 0 && (
                    <>
                        <Divider orientation="vertical" className="h-6 mx-2" />
                        <span className="flex flex-wrap gap-2 align-middle">
                            {tags.map((tag: string) => (
                                <IconTag key={tag}>{tag}</IconTag>
                            ))}
                        </span>
                    </>
                )}
            </span>
        </Secondary>
    );
}

export function generateStaticParams() {
    const slugs = getArticleSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <article className="max-w-none">
            <Heading1 className="mb-6 mt-8">{article.title}</Heading1>
            <ArticleMeta
                publishedAt={article.publishedAt}
                author={article.author}
                coauthoredWithAgent={article.coauthoredWithAgent}
                tags={article.tags}
            />
            <Secondary className="italic">{article.description}</Secondary>
            <Divider className="mt-4 mb-8" />
            <MarkdownContent content={article.content} />
        </article>
    );
}
