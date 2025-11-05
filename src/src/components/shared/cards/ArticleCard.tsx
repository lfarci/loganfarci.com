"use client";

import Link from "next/link";
import { Article } from "@/types/article";
import Card from "@/components/shared/cards/Card";
import { formatDate } from "@/core/date";
import TechnologyTag from "@/components/shared/TechnologyTag";
import { Text, Heading3 } from "@/components/shared/typography";

interface ArticleCardProps {
    article: Article;
    showTags?: boolean;
}

export default function ArticleCard({ article, showTags = false }: ArticleCardProps) {
    return (
        <Card>
            <div className="flex flex-col min-w-0 gap-2">
                <Heading3>
                    <Link
                        href={`/articles/${article.slug}`}
                        className="hover:text-primary-hover transition-colors cursor-pointer"
                    >
                        {article.title}
                    </Link>
                </Heading3>
                <time dateTime={article.publishedAt} className="text-base text-text-muted mt-1">
                    {formatDate(article.publishedAt)}
                </time>
                {article.description && <Text>{article.description}</Text>}

                {showTags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.map((tag) => (
                            <TechnologyTag key={tag}>{tag}</TechnologyTag>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
