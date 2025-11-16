export interface NavBarEntryProps {
    children: React.ReactNode;
    url: string;
    className?: string;
}

const NavBarEntry: React.FC<NavBarEntryProps> = ({ children, url, className = "" }) => {
    const spacingClasses = "block md:inline-block mb-4 md:mb-0";

    return (
        <a href={url} className={`${spacingClasses} text-base md:text-lg text-font ${className}`}>
            {children}
        </a>
    );
};

export default NavBarEntry;
