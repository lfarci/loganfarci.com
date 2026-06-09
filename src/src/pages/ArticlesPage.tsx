import { getAllArticles } from "@/core/articles";
import { ArticleListCard } from "@/components/cards";
import JsonLd from "@/components/shared/JsonLd";
import { Heading1, Heading2, Text } from "@/components/shared/typography";
import { createBreadcrumbJsonLd, createCanonicalUrl } from "@/core/seo";

const pageTitle = "Articles - Logan Farci";
const pageDescription = "Technical articles on Azure, C#, .NET, cloud engineering, and software development by Logan Farci.";
const pageUrl = createCanonicalUrl("/articles");
const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Articles", path: "/articles" },
]);

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
            <section className="flex flex-col py-8">
                <Heading1 className="mb-8">Articles</Heading1>
                <Heading2 className="sr-only">All articles</Heading2>

                {articles.length === 0 ? (
                    <Text className="text-text-secondary">No articles published yet.</Text>
                ) : (
                    <div className="space-y-6">
                        {articles.map((article) => (
                            <ArticleListCard key={article.slug} article={article} showTags />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
