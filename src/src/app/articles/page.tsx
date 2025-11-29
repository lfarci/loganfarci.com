import { getAllArticles } from "@/core/articles";
import { ArticleCard } from "@/components/cards";
import EmptyState from "@/components/shared/EmptyState";
import { Heading1 } from "@/components/shared/typography";

export default function ArticlesPage() {
    const articles = getAllArticles();

    return (
        <div className="flex flex-col py-8">
            <Heading1 className="mb-8">Articles</Heading1>

            {articles.length === 0 ? (
                <EmptyState message="No articles published yet." />
            ) : (
                <div className="space-y-6">
                    {articles.map((article) => (
                        <ArticleCard key={article.slug} article={article} showTags />
                    ))}
                </div>
            )}
        </div>
    );
}
