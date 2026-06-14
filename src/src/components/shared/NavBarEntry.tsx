import { Link } from "react-router";

export interface NavBarEntryProps {
    children: React.ReactNode;
    url: string;
    className?: string;
}

const NavBarEntry: React.FC<NavBarEntryProps> = ({ children, url, className = "" }) => {
    const spacingClasses = "group relative block md:inline-block mb-4 md:mb-0";

    return (
        <Link
            to={url}
            className={`${spacingClasses} text-base md:text-lg text-font font-medium text-text-secondary transition-colors duration-200 ease-brand hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${className}`}
        >
            {children}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-primary to-accent-warm transition-transform duration-300 ease-brand group-hover:scale-x-100" />
        </Link>
    );
};

export default NavBarEntry;
