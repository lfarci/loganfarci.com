import { Link, Navigate, useParams } from "react-router";
import IconTag from "@/components/shared/IconTag";
import JsonLd from "@/components/shared/JsonLd";
import MarkdownContent from "@/components/shared/MarkdownContent";
import Tooltip from "@/components/shared/Tooltip";
import { getArticleBySlug } from "@/core/articles";
import { formatDate } from "@/core/date";
import { createArticleJsonLd, createBreadcrumbJsonLd, createCanonicalUrl } from "@/core/seo";
import { siteOgImage } from "@/core/site";

interface ArticleMetaProps {
    publishedAt: string;
    author: string;
    coauthoredWithAgent?: boolean;
    tags?: string[];
}

function BackIcon() {
    return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
            <path
                d="M19 12H5m5 5-5-5 5-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
            />
        </svg>
    );
}

function ArticleMeta({ publishedAt, author, coauthoredWithAgent, tags }: Readonly<ArticleMetaProps>) {
    return (
        <div className="field-article-meta">
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
            <span>{author}</span>
            {coauthoredWithAgent && (
                <Tooltip content="This article was co-authored with help from an AI assistant.">
                    <span>Co-authored with AI</span>
                </Tooltip>
            )}
            {tags && tags.length > 0 && (
                <span className="field-article-meta-tags">
                    {tags.map((tag) => (
                        <IconTag key={tag}>{tag}</IconTag>
                    ))}
                </span>
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

            <article className="field-page field-article-page">
                <Link to="/articles" className="field-back-link">
                    <BackIcon />
                    <span>All articles</span>
                </Link>
                <header className="field-article-masthead">
                    <p className="field-kicker">Field note</p>
                    <h1>{article.title}</h1>
                    <p className="field-article-deck">{article.description}</p>
                    <ArticleMeta
                        publishedAt={article.publishedAt}
                        author={article.author}
                        coauthoredWithAgent={article.coauthoredWithAgent}
                        tags={article.tags}
                    />
                </header>
                <div className="field-article-body">
                    <MarkdownContent content={article.content} articleNavigation />
                </div>
            </article>
        </>
    );
}
