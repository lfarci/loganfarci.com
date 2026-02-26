import { getAllArticles } from "@/core/articles";
import { Helmet } from "react-helmet-async";
import { ArticleListCard } from "@/components/cards";
import { Heading1, Text } from "@/components/shared/typography";

export default function ArticlesPage() {
    const articles = getAllArticles();

    return (
        <>
            <Helmet>
                <title>Articles - Logan Farci</title>
                <meta name="description" content="Articles by Logan Farci, Software Engineer." />
            </Helmet>
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
