import { ReactNode } from "react";
import { typographyStyles } from "@/components/shared/typography/core/styles";

interface ErrorMessageProps {
    title: string;
    heading: string;
    message: string;
    children?: ReactNode;
}

export default function ErrorMessage({ title, heading, message, children }: ErrorMessageProps) {
    return (
        <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className={`${typographyStyles.heading1} text-6xl md:text-8xl mb-4`}>
                {title}
            </h1>
            <h2 className={`${typographyStyles.heading2} mb-6`}>
                {heading}
            </h2>
            <p className={`${typographyStyles.text} mb-8 max-w-md`}>
                {message}
            </p>
            {children}
        </section>
    );
}
