import { getAllArticles } from '@/core/articles';
import ArticleCard from '@/components/shared/cards/ArticleCard';
import EmptyState from '@/components/shared/EmptyState';
import { Heading1 } from '@/components/shared/typography';

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Heading1 className="mb-8">Articles</Heading1>

      {articles.length === 0 ? (
        <EmptyState message="No articles published yet." />
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
