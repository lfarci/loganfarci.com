"use client";

import React from 'react';
import { Link, Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/react';

interface NavigationBarProps {
    title: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
    return <Navbar isBordered>
        <NavbarContent>
            <NavbarBrand>
                <p className="font-bold text-inherit text-2xl">{title}</p>
            </NavbarBrand>
        </NavbarContent>
    </Navbar>;
};

export default NavigationBar;