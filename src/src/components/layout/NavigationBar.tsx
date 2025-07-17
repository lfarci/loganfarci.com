"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import NavBarEntry from "@/components/shared/NavBarEntry";

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
                <NavbarMenuToggle className="md:hidden" aria-label="Toggle navigation menu" />
                <div className="hidden md:flex space-x-8">
                    <NavBarEntry url="/" className="hover:text-blue-500 transition-colors">
                        Home
                    </NavBarEntry>
                    <NavBarEntry url="/about" className="hover:text-blue-500 transition-colors">
                        About
                    </NavBarEntry>
                    <NavBarEntry url="/articles" className="hover:text-blue-500 transition-colors">
                        Articles
                    </NavBarEntry>
                </div>
            </NavbarContent>
            <NavbarMenu className="md:hidden text-center">
                <NavbarMenuItem onClick={handleMenuItemClick}>
                    <NavBarEntry url="/" className="hover:text-blue-500 transition-colors text-base py-2">
                        Home
                    </NavBarEntry>
                </NavbarMenuItem>
                <NavbarMenuItem onClick={handleMenuItemClick}>
                    <NavBarEntry url="/about" className="hover:text-blue-500 transition-colors text-base py-2">
                        About
                    </NavBarEntry>
                </NavbarMenuItem>
                <NavbarMenuItem onClick={handleMenuItemClick}>
                    <NavBarEntry url="/articles" className="hover:text-blue-500 transition-colors text-base py-2">
                        Articles
                    </NavBarEntry>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
};

export default NavigationBar;
