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
        typeof description === "string" ? <Text className="w-full">{description}</Text> : description ?? null;

    const buildImageClassName = () => {
        const baseClassName = "rounded-xl w-full md:w-1/3 mt-6 md:mt-0";
        if (!image?.className) return baseClassName;

        return `${baseClassName} ${image.className}`;
    };

    return (
        <section className="flex flex-col items-center gap-6 pt-8 pb-4 md:flex-row md:gap-8 md:pt-10 md:pb-6">
            <div className="flex flex-1 flex-col justify-center space-y-5 md:space-y-6">
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
                    fetchPriority="high"
                    className={buildImageClassName()}
                />
            )}
        </section>
    );
};

export default HeroSection;
