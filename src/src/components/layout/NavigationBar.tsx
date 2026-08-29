import React, { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router";
import NavBarEntry from "@/components/shared/NavBarEntry";
import { Button } from "@/components/shared/primitives/Button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { MD_BREAKPOINT_MEDIA_QUERY } from "@/core/breakpoints";

interface NavigationBarProps {
    title: string;
}

const navigationItems = [
    { url: "/", label: "Home", download: false },
    { url: "/about", label: "About", download: false },
    { url: "/articles", label: "Articles", download: false },
    { url: "/resume.pdf", label: "Résumé", download: true },
] as const;

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuId = useId();
    const location = useLocation();

    const handleMenuToggle = () => {
        setIsMenuOpen((open) => !open);
    };

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

    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        const handleResize = () => {
            if (window.matchMedia(MD_BREAKPOINT_MEDIA_QUERY).matches) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [isMenuOpen]);

    return (
        <header className="field-shell-header">
            <nav className="field-shell-nav" aria-label="Primary">
                <div className="flex-1 text-left md:flex-none md:text-center">
                    <Link to="/" className="home-wordmark">
                        <span aria-hidden="true" className="home-wordmark-dot" />
                        <span>{title}</span>
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
                    onClick={handleMenuToggle}
                >
                    <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
                    <span aria-hidden="true" className="flex size-5 flex-col justify-center gap-1">
                        <span
                            className={`block h-0.5 w-5 bg-current transition-transform duration-200 ease-out motion-reduce:transition-none ${
                                isMenuOpen ? "translate-y-1.5 rotate-45" : ""
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-5 bg-current transition-opacity duration-150 ease-out motion-reduce:transition-none ${
                                isMenuOpen ? "opacity-0" : ""
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-5 bg-current transition-transform duration-200 ease-out motion-reduce:transition-none ${
                                isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                            }`}
                        />
                    </span>
                </Button>
                <div className="hidden items-center gap-8 md:flex">
                    {navigationItems.map((item) => (
                        <NavBarEntry
                            key={item.url}
                            url={item.url}
                            download={item.download}
                            active={!item.download && location.pathname === item.url}
                            className="field-shell-link"
                        >
                            {item.label}
                        </NavBarEntry>
                    ))}
                    <ThemeToggle />
                </div>
                <div
                    id={menuId}
                    aria-hidden={!isMenuOpen}
                    inert={!isMenuOpen}
                    className={`field-shell-mobile-menu grid w-full overflow-hidden text-center transition-[grid-template-rows,opacity,transform] duration-300 ease-out motion-reduce:transition-none md:hidden ${
                        isMenuOpen
                            ? "grid-rows-[1fr] translate-y-0 opacity-100"
                            : "pointer-events-none -translate-y-2 opacity-0 grid-rows-[0fr]"
                    }`}
                >
                    <div className="min-h-0">
                        <div className="flex flex-col pt-4">
                            {navigationItems.map((item) => (
                                <div key={item.url} onClick={handleMenuItemClick}>
                                    <NavBarEntry
                                        url={item.url}
                                        download={item.download}
                                        active={!item.download && location.pathname === item.url}
                                        className="field-shell-link py-2 text-base motion-reduce:transition-none"
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
                </div>
            </nav>
        </header>
    );
};

export default NavigationBar;
