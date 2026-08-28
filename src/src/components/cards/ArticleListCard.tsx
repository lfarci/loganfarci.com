import { Link } from "react-router";
import { formatDate } from "@/core/date";
import Card, { CardBody, CardFooter, CardHeader, CardSubtitle, CardTitle } from "./Card";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";
import { Article } from "@/types/article";

type ArticleListCardProps = { article: Article; showTags?: boolean };

const ArticleListCard: React.FC<ArticleListCardProps> = ({ article, showTags = false }) => (
    <Card
        as="article"
        className="flex flex-col gap-3 rounded-none border-x-0 border-y border-border-light bg-transparent p-5 shadow-none hover:bg-surface-elevated hover:shadow-none"
    >
        <Link
            to={`/articles/${article.slug}`}
            className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <CardHeader className="gap-1.5">
                <CardTitle className="transition-colors group-hover:text-primary-hover">{article.title}</CardTitle>
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
        </Link>
    </Card>
);

export default ArticleListCard;
