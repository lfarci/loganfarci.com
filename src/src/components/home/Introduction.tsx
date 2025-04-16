import React from 'react';
import Image from 'next/image';

interface IntroductionProps {
    image: string;
    heading: string;
    introduction: string;
}

const Introduction: React.FC<IntroductionProps> = ({ image, heading, introduction }) => {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start bg-white shadow-md rounded-lg p-4 space-y-4">
            <div className="md:mr-4 space-y-4">
                <h1 className="text-2xl md:text-4xl">{heading}</h1>
                <p className="text-lg md:text-xl text-gray-600">{introduction}</p>
            </div>
            <Image src={image} alt="Logan Farci" width={192} height={192} className="rounded-md" />
        </div>
    );
};

export default Introduction;