import { Link } from "react-router";
import { formatDate } from "@/core/date";
import Card, { CardBody, CardFooter, CardHeader, CardSubtitle, CardTitle } from "./Card";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";
import { Article } from "@/types/article";

type ArticleListCardProps = {
    article: Article;
    showTags?: boolean;
};

const ArticleListCard: React.FC<ArticleListCardProps> = ({ article, showTags = false }) => (
    <Card as="article" className="flex flex-col gap-3">
        <CardHeader className="gap-1.5">
            <CardTitle>
                <Link
                    to={`/articles/${article.slug}`}
                    className="cursor-pointer bg-linear-to-r from-primary via-gradient-mid to-accent-warm bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[color,background-size] duration-300 ease-brand hover:bg-[length:100%_2px] hover:text-primary-hover group-hover/card:text-primary"
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

export default ArticleListCard;
