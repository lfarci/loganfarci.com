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
    <article className="max-w-none">
      <MarkdownContent content={article.content} />
    </article>
  );
}
