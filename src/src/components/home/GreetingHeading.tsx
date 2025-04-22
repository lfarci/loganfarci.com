import React from 'react';
import Image from 'next/image';

interface GreetingHeadingProps {
    greeting?: string;
    name: string;
}

const WavingHandIcon: React.FC = () => <Image
    src="/icons/waving_hand.png"
    alt="Waving hand"
    width={64}
    height={64}
    className="inline-block w-10 h-10"
/>;

const GreetingHeading: React.FC<GreetingHeadingProps> = ({ greeting = "Hi", name }) => <h1 className="text-4xl font-bold heading-font flex items-center">
    <span className="pr-1">{greeting}</span> 
    <WavingHandIcon />
    <span>, I&apos;m {name}</span>
</h1>;

export default GreetingHeading;