import { ArticleListCard } from "@/components/cards";
import ColumnContainer from "@/components/layout/ColumnContainer";
import Section from "@/components/shared/Section";
import { Text } from "@/components/shared/typography";
import type { Article } from "@/types";

interface ArticleListSectionProps {
    heading: string;
    articles: Article[];
    limit?: number;
    featureFirst?: boolean;
    redirectPath?: string;
    redirectLabel?: string;
    emptyMessage?: string;
}

// Generic article list section usable across pages.
const ArticleListSection: React.FC<ArticleListSectionProps> = ({
    heading,
    articles,
    limit,
    featureFirst = false,
    redirectPath,
    redirectLabel,
    emptyMessage = "No articles found.",
}) => {
    const visibleArticles = typeof limit === "number" ? articles.slice(0, limit) : articles;

    return (
        <Section heading={heading} redirectPath={redirectPath} redirectLabel={redirectLabel}>
            {visibleArticles.length === 0 ? (
                <Text className="text-text-secondary">{emptyMessage}</Text>
            ) : featureFirst ? (
                <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <ArticleListCard article={visibleArticles[0]} featured showTags />
                    <div className="grid gap-4">
                        {visibleArticles.slice(1).map((article) => (
                            <ArticleListCard key={article.slug} article={article} compact />
                        ))}
                    </div>
                </div>
            ) : (
                <ColumnContainer className="mt-8">
                    {visibleArticles.map((article) => (
                        <ArticleListCard key={article.slug} article={article} />
                    ))}
                </ColumnContainer>
            )}
        </Section>
    );
};

export default ArticleListSection;
