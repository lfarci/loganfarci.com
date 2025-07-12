"use client";

import { Tooltip } from '@heroui/react';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { Heading1, Text } from '@/components/shared/typography';

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

    const toolTip = <Text>{redirectLabel}</Text>;

    return (
        <section id={createSectionId(heading)} className="pt-8 scroll-mt-10">
            <div
                className={`flex items-center mb-4${redirectPath ? ' cursor-pointer' : ''}`}
                onClick={handleNavigation}
            >
                {redirectPath ? (
                    <Tooltip content={toolTip} placement='right'>
                        <span className="flex items-center">
                            <Heading1 className="mb-0">{heading}</Heading1>
                            <ChevronRightIcon className="size-7 md:size-9 ml-2 flex-shrink-0 self-center text-gray-400 cursor-pointer" strokeWidth={2} />
                        </span>
                    </Tooltip>
                ) : (
                    <Heading1 className="mb-0">{heading}</Heading1>
                )}
            </div>
            {children}
        </section>
    );
};

export default Section;