import { getFeaturedArticles } from "@/core/articles";
import Section from "@/components/shared/Section";
import ArticleCard from "@/components/shared/cards/ArticleCard";
import EmptyState from "@/components/shared/EmptyState";

export default function FeaturedArticles() {
    const featuredArticles = getFeaturedArticles();

    return (
        <Section heading="Featured Articles" redirectPath="/articles" redirectLabel="View all my articles">
            {featuredArticles.length === 0 ? (
                <EmptyState message="No featured articles found." />
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {" "}
                    {featuredArticles.slice(0, 4).map((article) => (
                        <ArticleCard key={article.slug} article={article} />
                    ))}
                </div>
            )}
        </Section>
    );
}
