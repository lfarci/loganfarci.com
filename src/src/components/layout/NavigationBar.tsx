import React from 'react';
import Link from 'next/link';

interface NavigationBarProps {
    title: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
    return (
    <nav>
        <div className="max-w-screen-lg mx-auto px-4">
            <Link href="/" className="flex items-center space-x-2">
                <span>{title}</span>
            </Link>
        </div>
    </nav>
    );
};

export default NavigationBar;