import React from "react";
import { Heading1, Text } from "@/components/shared/typography";
import type { ImageProps } from "@/types";

interface HeroSectionProps {
    heading: React.ReactNode | string;
    description?: React.ReactNode | string;
    image?: ImageProps;
    actions?: React.ReactNode;
}

// Generic hero layout pairing text with optional media and actions.
const HeroSection: React.FC<HeroSectionProps> = ({ heading, description, image, actions }) => {
    const renderHeading = () => (typeof heading === "string" ? <Heading1>{heading}</Heading1> : heading);
    const renderDescription = () =>
        typeof description === "string" ? <Text>{description}</Text> : description ?? null;

    const buildImageClassName = () => {
        const baseClassName = "rounded-xl w-full md:w-1/3 mt-6 md:mt-0";
        if (!image?.className) return baseClassName;

        return `${baseClassName} ${image.className}`;
    };

    return (
        <div className="flex flex-col md:flex-row items-center pt-8">
            <div className="md:mr-6 space-y-6 flex-1 flex flex-col justify-center">
                {renderHeading()}
                {renderDescription()}
                {actions}
            </div>
            {image && (
                <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width ?? 512}
                    height={image.height ?? 512}
                    className={buildImageClassName()}
                />
            )}
        </div>
    );
};

export default HeroSection;
