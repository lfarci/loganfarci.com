import Link from "next/link";
import ErrorMessage from "@/components/shared/ErrorMessage";

export default function NotFound() {
    return (
        <ErrorMessage
            title="404"
            heading="Page Not Found"
            message="Sorry, the page you are looking for does not exist or has been moved."
        >
            <Link 
                href="/"
                className="px-6 py-3 bg-primary text-text-inverse font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
            >
                Back to Home
            </Link>
        </ErrorMessage>
    );
}
