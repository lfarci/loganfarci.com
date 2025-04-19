"use client";

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent } from '@heroui/react';

interface NavigationBarProps {
    title: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
    return <Navbar isBordered>
        <NavbarContent>
            <NavbarBrand>
                <p className="text-xl font-thin heading-font">{title}</p>
            </NavbarBrand>
        </NavbarContent>
    </Navbar>;
};

export default NavigationBar;