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
                    <p className="field-kicker">Field notes / engineering</p>
                    <h1 className="field-page-title">Articles</h1>
                    <p className="field-page-deck">
                        Practical notes from building and operating software—mostly .NET, Azure, and the decisions
                        between them.
                    </p>
                </header>

                <h2 className="sr-only">All articles</h2>
                {articles.length === 0 ? (
                    <p className="field-empty-state">No articles published yet.</p>
                ) : (
                    <div className="field-article-index">
                        {articles.map((article, index) => (
                            <article key={article.slug} className="field-article-entry">
                                <div className="field-article-row">
                                    <span aria-hidden="true" className="field-index-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="field-article-copy">
                                        <Link to={`/articles/${article.slug}`} className="field-article-title-link">
                                            <span className="field-article-title">{article.title}</span>
                                            <ArrowRightIcon />
                                        </Link>
                                        <span className="field-article-description">{article.description}</span>
                                        <span className="field-article-tags">
                                            {article.tags.map((tag) => (
                                                <IconTag key={tag}>{tag}</IconTag>
                                            ))}
                                        </span>
                                    </span>
                                    <time className="field-article-date" dateTime={article.publishedAt}>
                                        {formatDate(article.publishedAt)}
                                    </time>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
