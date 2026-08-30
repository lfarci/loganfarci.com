import { Link } from "react-router";

export interface NavBarEntryProps {
    children: React.ReactNode;
    url: string;
    className?: string;
    download?: boolean;
    active?: boolean;
}

const NavBarEntry: React.FC<NavBarEntryProps> = ({
    children,
    url,
    className = "",
    download = false,
    active = false,
}) => {
    const linkClassName =
        `mb-4 block min-h-11 rounded-sm border-b border-transparent py-2 text-base text-font ` +
        `${active ? "border-brand text-brand" : "text-text-secondary"} ` +
        `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ` +
        `focus-visible:ring-offset-2 focus-visible:ring-offset-background md:mb-0 md:inline-block md:text-base ${className}`;

    if (download) {
        return (
            <a href={url} download className={linkClassName}>
                {children}
            </a>
        );
    }

    return (
        <Link to={url} className={linkClassName} aria-current={active ? "page" : undefined}>
            {children}
        </Link>
    );
};

export default NavBarEntry;
