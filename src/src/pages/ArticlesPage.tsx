import { getAllArticles } from "@/core/articles";
import { ArticleListCard } from "@/components/cards";
import { Heading1, Text } from "@/components/shared/typography";
import { siteUrl } from "@/core/site";

const pageTitle = "Articles - Logan Farci";
const pageDescription = "Technical articles on Azure, C#, .NET, cloud engineering, and software development by Logan Farci.";
const pageUrl = `${siteUrl}/articles`;

export default function ArticlesPage() {
    const articles = getAllArticles();

    return (
        <>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:url" content={pageUrl} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <div className="flex flex-col py-8">
                <Heading1 className="mb-8">Articles</Heading1>

                {articles.length === 0 ? (
                    <Text className="text-text-secondary">No articles published yet.</Text>
                ) : (
                    <div className="space-y-6">
                        {articles.map((article) => (
                            <ArticleListCard key={article.slug} article={article} showTags />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
