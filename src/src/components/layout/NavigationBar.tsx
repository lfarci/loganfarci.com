"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import NavBarEntry from "@/components/shared/NavBarEntry";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface NavigationBarProps {
    title: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent className="flex justify-between items-center md:justify-between md:items-center text-center">
                <NavbarBrand className="w-full md:w-auto">
                    <Link href="/" className="text-xl md:text-2xl font-thin heading-font cursor-pointer">
                        {title}
                    </Link>
                </NavbarBrand>
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <NavbarMenuToggle aria-label="Toggle navigation menu" />
                </div>
                <div className="hidden md:flex space-x-8 items-center">
                    <NavBarEntry url="/" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        Home
                    </NavBarEntry>
                    <NavBarEntry url="/about" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        About
                    </NavBarEntry>
                    <NavBarEntry url="/articles" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        Articles
                    </NavBarEntry>
                    <ThemeToggle />
                </div>
            </NavbarContent>
            <NavbarMenu className="md:hidden text-center">
                <NavbarMenuItem onClick={handleMenuItemClick}>
                    <NavBarEntry url="/" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-base py-2">
                        Home
                    </NavBarEntry>
                </NavbarMenuItem>
                <NavbarMenuItem onClick={handleMenuItemClick}>
                    <NavBarEntry url="/about" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-base py-2">
                        About
                    </NavBarEntry>
                </NavbarMenuItem>
                <NavbarMenuItem onClick={handleMenuItemClick}>
                    <NavBarEntry url="/articles" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-base py-2">
                        Articles
                    </NavBarEntry>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
};

export default NavigationBar;
