import { ReactNode } from "react";
import { Heading1, Heading2, Text } from "@/components/shared/typography";

interface ErrorMessageProps {
    title: string;
    heading: string;
    message: string;
    children?: ReactNode;
}

export default function ErrorMessage({ title, heading, message, children }: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <Heading1 className="text-6xl md:text-8xl mb-4">
                {title}
            </Heading1>
            <Heading2 className="mb-6">
                {heading}
            </Heading2>
            <Text className="mb-8 max-w-md">
                {message}
            </Text>
            {children}
        </div>
    );
}
