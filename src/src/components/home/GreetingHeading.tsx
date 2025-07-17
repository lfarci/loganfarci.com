import React from "react";
import Image from "next/image";
import { Heading1 } from "../shared/typography";

interface GreetingHeadingProps {
    greeting?: string;
    name: string;
}

const WavingHandIcon: React.FC = () => (
    <Image src="/images/icons/waving_hand.avif" alt="Waving hand" width={64} height={64} className="inline-block w-10 h-10" />
);

const GreetingHeading: React.FC<GreetingHeadingProps> = ({ greeting = "Hi", name }) => (
    <Heading1 className="flex items-center">
        <span className="pr-1">{greeting}</span>
        <WavingHandIcon />
        <span>, I&apos;m {name}</span>
    </Heading1>
);

export default GreetingHeading;
