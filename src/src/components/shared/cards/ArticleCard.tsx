"use client";

import Link from 'next/link';
import { Article } from '@/content/types/article';
import Card from '@/components/shared/cards/Card';
import { formatDate } from '@/lib/date';
import { Chip } from "@heroui/react";
import { Text, Heading3 } from '@/components/shared/typography';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card>
      <div className="flex flex-col min-w-0 gap-2">
        <Heading3>
          <Link
            href={`/articles/${article.slug}`}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            {article.title}
          </Link>
        </Heading3>
        <time
          dateTime={article.publishedAt}
          className="text-base text-gray-400 mt-1"
        >
          {formatDate(article.publishedAt)}
        </time>
        {article.description && <Text>{article.description}</Text>}

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map((tag) => (
              <Chip
                key={tag}
                variant="bordered"
                size="lg"
                radius="md"
                className="text-base"
              >
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
