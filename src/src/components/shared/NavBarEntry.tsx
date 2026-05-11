import { NavLink } from "react-router";

export interface NavBarEntryProps {
    children: React.ReactNode;
    url: string;
    className?: string;
}

const NavBarEntry: React.FC<NavBarEntryProps> = ({ children, url, className = "" }) => {
    const spacingClasses = "block md:inline-flex mb-4 md:mb-0 min-h-11 items-center rounded-full px-3";

    return (
        <NavLink
            to={url}
            className={({ isActive }) =>
                `${spacingClasses} text-base md:text-lg text-font transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                    isActive ? "bg-primary-light text-primary" : "text-text-secondary"
                } ${className}`
            }
        >
            {children}
        </NavLink>
    );
};

export default NavBarEntry;
