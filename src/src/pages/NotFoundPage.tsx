import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import ErrorMessage from "@/components/shared/ErrorMessage";

export default function NotFoundPage() {
    return (
        <>
            <Helmet>
                <title>Page Not Found - Logan Farci</title>
                <meta name="description" content="The page you are looking for does not exist or has been moved." />
            </Helmet>
            <ErrorMessage
                title="404"
                heading="Page Not Found"
                message="Sorry, the page you are looking for does not exist or has been moved."
            >
                <Link 
                    to="/"
                    className="px-6 py-3 bg-primary text-text-inverse font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
                >
                    Back to Home
                </Link>
            </ErrorMessage>
        </>
    );
}
