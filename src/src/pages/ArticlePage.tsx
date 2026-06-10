import { useParams, Navigate } from "react-router";
import { getArticleBySlug } from "@/core/articles";
import MarkdownContent from "@/components/shared/MarkdownContent";
import JsonLd from "@/components/shared/JsonLd";
import { Separator } from "@/components/shared/primitives/Separator";
import { Heading1, Secondary } from "@/components/shared/typography";
import { typographyStyles } from "@/components/shared/typography/core";
import { formatDate } from "@/core/date";
import { createArticleJsonLd, createBreadcrumbJsonLd, createCanonicalUrl } from "@/core/seo";
import Tooltip from "@/components/shared/Tooltip";
import IconTag from "@/components/shared/IconTag";
import { siteOgImage } from "@/core/site";

interface ArticleMetaProps {
    publishedAt: string;
    author: string;
    coauthoredWithAgent?: boolean;
    tags?: string[];
}

function ArticleMeta({ publishedAt, author, coauthoredWithAgent, tags }: Readonly<ArticleMetaProps>) {
    return (
        <div className="mb-4 flex flex-row flex-wrap items-center gap-2">
            <span className={typographyStyles.caption}>{formatDate(publishedAt)}</span>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <span className={typographyStyles.caption}>{author}</span>
            {coauthoredWithAgent && (
                <>
                    <Separator orientation="vertical" className="h-6 mx-2" />
                    <Tooltip content="This article was co-authored with help from an AI assistant.">
                        <span className={typographyStyles.caption}>Co-authored with AI</span>
                    </Tooltip>
                </>
            )}
            {tags && tags.length > 0 && (
                <>
                    <Separator orientation="vertical" className="h-6 mx-2" />
                    <span className="flex flex-wrap gap-2 align-middle">
                        {tags.map((tag: string) => (
                            <IconTag key={tag}>{tag}</IconTag>
                        ))}
                    </span>
                </>
            )}
        </div>
    );
}

export default function ArticlePage() {
    const { slug } = useParams<{ slug: string }>();
    const article = slug ? getArticleBySlug(slug) : null;

    if (!article) {
        return <Navigate to="/404" replace />;
    }

    const articleTitle = `${article.title} - Logan Farci`;
    const articleUrl = createCanonicalUrl(`/articles/${slug}`);
    const breadcrumbJsonLd = createBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Articles", path: "/articles" },
        { name: article.title, path: `/articles/${slug}` },
    ]);

    return (
        <>
            <title>{articleTitle}</title>
            <link rel="canonical" href={articleUrl} />
            <meta name="description" content={article.description} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={articleTitle} />
            <meta property="og:description" content={article.description} />
            <meta property="og:url" content={articleUrl} />
            <meta name="twitter:title" content={articleTitle} />
            <meta name="twitter:description" content={article.description} />
            <meta name="twitter:image" content={siteOgImage} />
            <JsonLd data={[breadcrumbJsonLd, createArticleJsonLd(article)]} />
            <article className="py-8 md:py-10">
                <header>
                    <Heading1 className="mb-5">{article.title}</Heading1>
                    <ArticleMeta
                        publishedAt={article.publishedAt}
                        author={article.author}
                        coauthoredWithAgent={article.coauthoredWithAgent}
                        tags={article.tags}
                    />
                    <Secondary className="max-w-[72ch] italic">{article.description}</Secondary>
                </header>
                <Separator className="mt-6 mb-8 md:mb-10" />
                <MarkdownContent content={article.content} measure />
            </article>
        </>
    );
}
