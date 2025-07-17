import Link from "next/link";

export interface NavBarEntryProps {
    children: React.ReactNode;
    url: string;
    className?: string;
}

const NavBarEntry: React.FC<NavBarEntryProps> = ({ children, url, className = "" }) => {
    const spacingClasses = "block md:inline-block mb-4 md:mb-0";

    return (
        <Link href={url} className={`${spacingClasses} text-base md:text-lg text-font ${className}`}>
            {children}
        </Link>
    );
};

export default NavBarEntry;
