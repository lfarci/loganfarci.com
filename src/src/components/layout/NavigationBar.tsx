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
                <p className="font-bold text-inherit text-2xl">{title}</p>
            </NavbarBrand>
        </NavbarContent>
    </Navbar>;
};

export default NavigationBar;