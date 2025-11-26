"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl md:text-8xl font-bold heading-font text-text-primary mb-4">
                Oops!
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold heading-font text-text-secondary mb-6">
                Something went wrong
            </h2>
            <p className="text-base md:text-lg text-text-tertiary mb-8 max-w-md text-font">
                An unexpected error has occurred. Please try again or return to the home page.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-primary text-text-inverse font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
                >
                    Try Again
                </button>
                <button
                    onClick={() => (window.location.href = "/")}
                    className="px-6 py-3 bg-surface-hover text-text-primary font-medium rounded-lg border border-border hover:bg-surface-elevated transition-colors duration-200"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
