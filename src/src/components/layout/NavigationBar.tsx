"use client";

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent } from '@heroui/react';
import Link from 'next/link';

interface NavigationBarProps {
    title: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
    return <Navbar isBordered>
        <NavbarContent>
            <NavbarBrand>
                <p className="text-xl font-thin heading-font">{title}</p>
            </NavbarBrand>
            <div className="flex space-x-8">
                <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
                <Link href="/about" className="hover:text-blue-500 transition-colors">About</Link>
                <Link href="/articles" className="hover:text-blue-500 transition-colors">Articles</Link>
            </div>
        </NavbarContent>
    </Navbar>;
};

export default NavigationBar;