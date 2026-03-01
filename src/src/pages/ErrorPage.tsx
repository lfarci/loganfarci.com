import { useEffect } from "react";
import { useNavigate } from "react-router";
import ErrorMessage from "@/components/shared/ErrorMessage";

export default function ErrorPage({
    error,
    resetErrorBoundary,
}: Readonly<{
    error: Error;
    resetErrorBoundary: () => void;
}>) {
    const navigate = useNavigate();

    useEffect(() => {
        if (import.meta.env.DEV) {
            console.error(error);
        }
    }, [error]);

    return (
        <ErrorMessage
            title="Oops!"
            heading="Something went wrong"
            message="An unexpected error has occurred. Please try again or return to the home page."
        >
            <div className="flex gap-4">
                <button
                    onClick={() => resetErrorBoundary()}
                    className="px-6 py-3 bg-primary text-text-inverse font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
                >
                    Try Again
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-surface-hover text-text-primary font-medium rounded-lg border border-border hover:bg-surface-elevated transition-colors duration-200"
                >
                    Back to Home
                </button>
            </div>
        </ErrorMessage>
    );
}
