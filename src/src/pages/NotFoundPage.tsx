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
                    <p>That page does not exist, has moved, or was never committed in the first place.</p>
                    <Button asChild className="mt-8">
                        <Link to="/">Back to home</Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
