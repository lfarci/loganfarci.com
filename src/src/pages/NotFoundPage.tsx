import { Link } from "react-router";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Button } from "@/components/shared/primitives/Button";

export default function NotFoundPage() {
    return (
        <>
            <title>Page Not Found - Logan Farci</title>
            <meta name="description" content="The page you are looking for does not exist or has been moved." />
            <meta name="robots" content="noindex" />
            <ErrorMessage
                title="404"
                heading="Page Not Found"
                message="Sorry, the page you are looking for does not exist or has been moved."
            >
                <Button asChild>
                    <Link to="/">Back to Home</Link>
                </Button>
            </ErrorMessage>
        </>
    );
}
