import Link from "next/link";
import { Heading1, Heading2, Text } from "@/components/shared/typography";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <Heading1 className="text-6xl md:text-8xl mb-4">
                404
            </Heading1>
            <Heading2 className="mb-6">
                Page Not Found
            </Heading2>
            <Text className="mb-8 max-w-md">
                Sorry, the page you are looking for does not exist or has been moved.
            </Text>
            <Link 
                href="/"
                className="px-6 py-3 bg-primary text-text-inverse font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
            >
                Back to Home
            </Link>
        </div>
    );
}
