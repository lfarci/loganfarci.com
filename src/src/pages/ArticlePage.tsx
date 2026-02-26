import { useParams, Navigate } from "react-router";
import { getArticleBySlug } from "@/core/articles";

export default function ArticlePage() {
    const { slug } = useParams<{ slug: string }>();
    const article = slug ? getArticleBySlug(slug) : null;

    if (!article) {
        return <Navigate to="/404" replace />;
    }

    return <div>Article: {article.title}</div>;
}
