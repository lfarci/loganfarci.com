export interface ExternalLinkProps {
    children: React.ReactNode;
    url: string;
    size?: "base" | "footnote";
}

const NewTabLink: React.FC<ExternalLinkProps> = ({ children, url, size = "base" }) => {
    const sizeClasses = size === "footnote" ? "text-sm md:text-base" : "text-base md:text-lg";

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizeClasses} inline-flex min-h-11 items-center rounded-md font-medium text-font text-primary transition-colors hover:text-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
        >
            {children}
        </a>
    );
};

export default NewTabLink;
