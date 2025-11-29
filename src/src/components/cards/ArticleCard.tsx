import Link from "next/link";
import { Article } from "@/types/article";
import Card, { CardBody, CardFooter, CardHeader, CardSubtitle, CardTitle } from "./Card";
import { formatDate } from "@/core/date";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";

interface ArticleCardProps {
    article: Article;
    showTags?: boolean;
}

export default function ArticleCard({ article, showTags = false }: ArticleCardProps) {
    return (
        <Card as="article" className="flex flex-col gap-3">
            <CardHeader className="gap-1.5">
                <CardTitle>
                    <Link
                        href={`/articles/${article.slug}`}
                        className="hover:text-primary-hover transition-colors cursor-pointer"
                    >
                        {article.title}
                    </Link>
                </CardTitle>
                <CardSubtitle as="time" dateTime={article.publishedAt} className="mt-1">
                    {formatDate(article.publishedAt)}
                </CardSubtitle>
            </CardHeader>
            {article.description && (
                <CardBody className="pt-1">
                    <Text>{article.description}</Text>
                </CardBody>
            )}

            {showTags && article.tags.length > 0 && (
                <CardFooter className="mt-2">
                    {article.tags.map((tag) => (
                        <IconTag key={tag}>{tag}</IconTag>
                    ))}
                </CardFooter>
            )}
        </Card>
    );
}
