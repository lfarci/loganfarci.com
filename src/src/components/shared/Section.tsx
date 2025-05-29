"use client";

import { Tooltip } from '@heroui/react';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface SectionProps {
    heading: string;
    redirectPath?: string;
    redirectLabel?: string;
    children?: React.ReactNode;
}

const createSectionId = (heading: string): string => {
    return heading.toLowerCase().replace(/\s+/g, '-');
};

const Section: React.FC<SectionProps> = ({ heading, redirectPath, redirectLabel, children }) => {
    const handleNavigation = () => {
        if (!redirectPath) return;
        
        const url = redirectPath.startsWith('/') 
            ? `${window.location.origin}${redirectPath}`
            : redirectPath;

        window.location.assign(url);
    };

    return (
        <section id={createSectionId(heading)} className="pt-8">
            <div
                className={`flex items-center mb-4${redirectPath ? ' cursor-pointer' : ''}`}
                onClick={handleNavigation}
            >
                {redirectPath ? (
                    <Tooltip content={redirectLabel} placement='right'>
                        <span className="flex items-center">
                            <h2 className="text-3xl font-bold mb-0 heading-font">{heading}</h2>
                            <ChevronRightIcon className="size-7 ml-2 flex-shrink-0 self-center text-gray-400 cursor-pointer" strokeWidth={2} />
                        </span>
                    </Tooltip>
                ) : (
                    <h2 className="text-3xl font-bold mb-0 heading-font">{heading}</h2>
                )}
            </div>
            {children}
        </section>
    );
};

export default Section;