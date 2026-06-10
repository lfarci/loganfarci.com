import React, { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router";
import NavBarEntry from "@/components/shared/NavBarEntry";
import { Button } from "@/components/shared/primitives/Button";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface NavigationBarProps {
    title: string;
}

const navigationItems = [
    { url: "/", label: "Home" },
    { url: "/about", label: "About" },
    { url: "/articles", label: "Articles" },
] as const;

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuId = useId();
    const location = useLocation();

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen]);

    return (
        <header className="border-b border-border bg-background/90 backdrop-blur">
            <nav className="mx-auto flex max-w-(--breakpoint-lg) flex-wrap items-center justify-between px-6 py-3 text-center">
                <div className="flex-1 text-left md:flex-none md:text-center">
                    <Link to="/" className="text-xl md:text-2xl font-thin heading-font cursor-pointer">
                        {title}
                    </Link>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-controls={menuId}
                    aria-expanded={isMenuOpen}
                    className="md:hidden"
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
                    <span aria-hidden="true" className="flex size-5 flex-col justify-center gap-1">
                        <span
                            className={`block h-0.5 w-5 bg-current transition-transform ${
                                isMenuOpen ? "translate-y-1.5 rotate-45" : ""
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-5 bg-current transition-opacity ${
                                isMenuOpen ? "opacity-0" : ""
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-5 bg-current transition-transform ${
                                isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                            }`}
                        />
                    </span>
                </Button>
                <div className="hidden md:flex items-center space-x-8">
                    {navigationItems.map((item) => (
                        <NavBarEntry key={item.url} url={item.url} className="hover:text-primary-hover transition-colors">
                            {item.label}
                        </NavBarEntry>
                    ))}
                    <ThemeToggle />
                </div>
                <div id={menuId} className={`${isMenuOpen ? "block" : "hidden"} w-full md:hidden text-center`}>
                    <div className="flex flex-col pt-4">
                        {navigationItems.map((item) => (
                            <div key={item.url} onClick={handleMenuItemClick}>
                                <NavBarEntry
                                    url={item.url}
                                    className="hover:text-primary-hover transition-colors text-base py-2"
                                >
                                    {item.label}
                                </NavBarEntry>
                            </div>
                        ))}
                        <div className="mt-4 flex justify-center border-t border-border pt-4">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavigationBar;
