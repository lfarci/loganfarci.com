import React from 'react';

interface NavigationBarProps {
    title: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
    return (
    <nav>
        <div className="max-w-screen-lg mx-auto px-4 bg-red-500">
            <a href="/" className="flex items-center space-x-2">Logan Farci</a>
        </div>
    </nav>
    );
};

export default NavigationBar;