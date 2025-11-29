import { getFeaturedArticles } from "@/core/articles";
import Section from "@/components/shared/Section";
import { ArticleListCard } from "@/components/cards";
import EmptyState from "@/components/shared/EmptyState";

export default function FeaturedArticles() {
    const featuredArticles = getFeaturedArticles();

    return (
        <Section heading="Featured Articles" redirectPath="/articles" redirectLabel="View all my articles">
            {featuredArticles.length === 0 ? (
                <EmptyState message="No featured articles found." />
            ) : (
                <div className="flex flex-col gap-4 mt-8">
                    {featuredArticles.slice(0, 4).map((article) => (
                        <ArticleListCard key={article.slug} article={article} />
                    ))}
                </div>
            )}
        </Section>
    );
}
