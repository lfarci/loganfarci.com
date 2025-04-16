"use client";

import React from 'react';
import { Navbar, NavbarBrand } from '@heroui/react';

interface NavigationBarProps {
    title: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => <Navbar isBordered>
    <NavbarBrand>
        <p className="font-bold text-inherit">{ title }</p>
    </NavbarBrand>
</Navbar>;

export default NavigationBar;