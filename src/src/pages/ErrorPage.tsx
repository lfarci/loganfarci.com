import { useEffect } from "react";
import { useNavigate } from "react-router";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Button } from "@/components/shared/primitives/Button";

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
                <Button
                    onClick={() => resetErrorBoundary()}
                >
                    Try Again
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        void navigate("/");
                    }}
                >
                    Back to Home
                </Button>
            </div>
        </ErrorMessage>
    );
}
