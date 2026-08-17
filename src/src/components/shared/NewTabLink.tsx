export interface ExternalLinkProps {
    children: React.ReactNode;
    url: string;
    size?: "base" | "footnote";
    "aria-label"?: string;
}

const NewTabLink: React.FC<ExternalLinkProps> = ({ children, url, size = "base", "aria-label": ariaLabel }) => {
    const sizeClasses = size === "footnote" ? "text-sm md:text-base" : "text-base md:text-lg";

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={`${sizeClasses} font-medium text-font text-primary hover:text-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm`}
        >
            {children}
        </a>
    );
};

export default NewTabLink;
