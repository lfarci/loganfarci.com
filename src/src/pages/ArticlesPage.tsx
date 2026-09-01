import { Link } from "react-router";
import IconTag from "@/components/shared/IconTag";
import JsonLd from "@/components/shared/JsonLd";
import { getAllArticles } from "@/core/articles";
import { formatDate } from "@/core/date";
import { createBreadcrumbJsonLd, createCanonicalUrl } from "@/core/seo";

const pageTitle = "Articles - Logan Farci";
const pageDescription =
    "Technical articles on Azure, C#, .NET, cloud engineering, and software development by Logan Farci.";
const pageUrl = createCanonicalUrl("/articles");
const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Articles", path: "/articles" },
]);

function ArrowRightIcon() {
    return (
        <svg aria-hidden="true" className="field-index-arrow" fill="none" viewBox="0 0 24 24">
            <path
                d="M5 12h14m-5-5 5 5-5 5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
            />
        </svg>
    );
}

export default function ArticlesPage() {
    const articles = getAllArticles();

    return (
        <>
            <title>{pageTitle}</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:url" content={pageUrl} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <JsonLd data={breadcrumbJsonLd} />

            <section className="field-page field-articles-page">
                <header className="field-page-header">
                    <h1 className="field-page-title">Articles</h1>
                    <p className="field-page-deck">
                        Notes on GitHub, cloud engineering, developer tooling, and the systems I&apos;m building.
                    </p>
                </header>

                <h2 className="sr-only">All articles</h2>
                {articles.length === 0 ? (
                    <p className="field-empty-state">No articles published yet.</p>
                ) : (
                    <div className="field-article-index">
                        {articles.map((article) => (
                            <article key={article.slug} className="field-article-entry">
                                <Link
                                    to={`/articles/${article.slug}`}
                                    className="field-article-row"
                                    aria-labelledby={`article-title-${article.slug}`}
                                >
                                    <span className="field-article-copy">
                                        <span id={`article-title-${article.slug}`} className="field-article-title">
                                            {article.title}
                                        </span>
                                        <span className="field-article-description">{article.description}</span>
                                    </span>
                                    <span className="field-article-row-meta">
                                        <span className="field-article-metadata">
                                            <time className="field-article-date" dateTime={article.publishedAt}>
                                                {formatDate(article.publishedAt)}
                                            </time>
                                            <span className="field-article-tags">
                                                {article.tags.map((tag) => (
                                                    <IconTag key={tag}>{tag}</IconTag>
                                                ))}
                                            </span>
                                        </span>
                                        <ArrowRightIcon />
                                    </span>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
