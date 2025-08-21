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
            className={`${sizeClasses} font-medium text-font text-blue-400 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300`}
        >
            {children}
        </a>
    );
};

export default NewTabLink;
