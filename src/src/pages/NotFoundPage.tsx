import { Link } from "react-router";
import { Button } from "@/components/shared/primitives/Button";

export default function NotFoundPage() {
    return (
        <>
            <title>Page Not Found - Logan Farci</title>
            <meta name="description" content="The page you are looking for does not exist or has been moved." />
            <meta name="robots" content="noindex" />
            <section className="field-page field-not-found">
                <p className="field-error-code" aria-hidden="true">
                    404
                </p>
                <div className="field-error-copy">
                    <h1>Page Not Found</h1>
                    <p>
                        That page doesn&apos;t exist or may have moved. Try the homepage or browse the latest articles.
                    </p>
                    <div className="field-error-actions">
                        <Button asChild>
                            <Link to="/">Back to home</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link to="/articles">Browse articles</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
