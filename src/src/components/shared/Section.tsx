"use client";

import { Tooltip } from '@heroui/react';
import { useRouter } from 'next/navigation';

interface SectionProps {
    heading: string;
    redirectPath?: string;
    redirectLabel?: string;
    children?: React.ReactNode;
}

const RightChevron: React.FC = () => <span>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="3"
        stroke="currentColor"
        className="size-7 ml-2 flex-shrink-0 self-center text-gray-400 cursor-pointer"
        role="button"
        tabIndex={0}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
</span>;

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
                            <RightChevron />
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