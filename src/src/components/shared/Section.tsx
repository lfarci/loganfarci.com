"use client";

import { Tooltip } from '@heroui/react';
import { useRouter } from 'next/navigation';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface SectionProps {
    heading: string;
    redirectPath?: string;
    redirectLabel?: string;
    children?: React.ReactNode;
}



const Section: React.FC<SectionProps> = ({ heading, redirectPath, redirectLabel, children }) => {
    const router = useRouter();
    return (
        <section className="pt-8">
            <div
                className={`flex items-center mb-4${redirectPath ? ' cursor-pointer' : ''}`}
                onClick={() => redirectPath && router.push(redirectPath)}
            >
                {redirectPath ? (
                    <Tooltip content={redirectLabel} placement='right'>
                        <span className="flex items-center">
                            <h2 className="text-3xl font-bold mb-0 heading-font">{heading}</h2>
                            <ChevronRightIcon className="size-7 ml-2 flex-shrink-0 self-center text-gray-400 cursor-pointer" strokeWidth={3} />
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