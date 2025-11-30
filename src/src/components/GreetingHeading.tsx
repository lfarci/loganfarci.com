import Image from "next/image";
import React from "react";
import { Heading1 } from "@/components/shared/typography";

interface GreetingHeadingProps {
    greeting?: string;
    name: string;
    iconSrc?: string;
    iconAlt?: string;
    iconSize?: number;
}

// Friendly heading with an optional inline icon.
const GreetingHeading: React.FC<GreetingHeadingProps> = ({
    greeting = "Hi",
    name,
    iconSrc = "/images/icons/waving_hand.avif",
    iconAlt = "Waving hand",
    iconSize = 40,
}) => (
    <Heading1 className="flex items-center">
        <span className="pr-1">{greeting}</span>
        <Image
            src={iconSrc}
            alt={iconAlt}
            width={iconSize}
            height={iconSize}
            className="inline-block w-10 h-10"
        />
        <span>, I&apos;m {name}</span>
    </Heading1>
);

export default GreetingHeading;
