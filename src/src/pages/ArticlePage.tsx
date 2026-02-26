import { useParams } from "react-router";
import { getArticleBySlug } from "@/core/articles";
import NotFoundPage from "./NotFoundPage";

export default function ArticlePage() {
    const { slug } = useParams<{ slug: string }>();
    const article = slug ? getArticleBySlug(slug) : null;

    if (!article) {
        return <NotFoundPage />;
    }

    return <div>Article: {article.title}</div>;
}
