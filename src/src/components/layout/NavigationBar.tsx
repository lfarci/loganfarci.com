"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";
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
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="md:hidden"
                />
                <div className="hidden md:flex items-center space-x-8">
                    <NavBarEntry url="/" className="hover:text-primary-hover transition-colors">
                        Home
                    </NavBarEntry>
                    <NavBarEntry url="/about" className="hover:text-primary-hover transition-colors">
                        About
                    </NavBarEntry>
                    <NavBarEntry url="/articles" className="hover:text-primary-hover transition-colors">
                        Articles
                    </NavBarEntry>
                    <ThemeToggle />
                </div>
            </NavbarContent>
            <NavbarMenu className="md:hidden text-center">
                <NavbarMenuItem onClick={handleMenuItemClick}>
                    <NavBarEntry url="/" className="hover:text-primary-hover transition-colors text-base py-2">
                        Home
                    </NavBarEntry>
                </NavbarMenuItem>
                <NavbarMenuItem onClick={handleMenuItemClick}>
                    <NavBarEntry url="/about" className="hover:text-primary-hover transition-colors text-base py-2">
                        About
                    </NavBarEntry>
                </NavbarMenuItem>
                <NavbarMenuItem onClick={handleMenuItemClick}>
                    <NavBarEntry url="/articles" className="hover:text-primary-hover transition-colors text-base py-2">
                        Articles
                    </NavBarEntry>
                </NavbarMenuItem>
                <NavbarMenuItem className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-center">
                        <ThemeToggle />
                    </div>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
};

export default NavigationBar;
