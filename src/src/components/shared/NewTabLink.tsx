import { mergeClassNames } from "@/core/mergeClassNames";

export interface ExternalLinkProps {
    children: React.ReactNode;
    url: string;
    size?: "base" | "footnote";
    "aria-label"?: string;
    className?: string;
}

const NewTabLink: React.FC<ExternalLinkProps> = ({
    children,
    url,
    size = "base",
    "aria-label": ariaLabel,
    className,
}) => {
    const sizeClasses = size === "footnote" ? "text-sm md:text-base" : "text-base md:text-lg";

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={mergeClassNames(
                sizeClasses,
                "rounded-sm font-medium text-font text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                className,
            )}
        >
            {children}
        </a>
    );
};

export default NewTabLink;
