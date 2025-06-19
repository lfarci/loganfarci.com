import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticleSlugs } from '@/core/articles';
import MarkdownContent from '@/components/shared/MarkdownContent';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {article.tags.length > 0 && (
            <div className="flex gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {article.description && (
          <p className="text-lg text-gray-600">{article.description}</p>
        )}
      </header>
        <article className="max-w-none">
        <MarkdownContent content={article.content} />
      </article>
    </div>
  );
}
