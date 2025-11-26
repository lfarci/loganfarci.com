import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl md:text-8xl font-bold heading-font text-text-primary mb-4">
                404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold heading-font text-text-secondary mb-6">
                Page Not Found
            </h2>
            <p className="text-base md:text-lg text-text-tertiary mb-8 max-w-md text-font">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>
            <Link 
                href="/"
                className="px-6 py-3 bg-primary text-text-inverse font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
            >
                Back to Home
            </Link>
        </div>
    );
}
