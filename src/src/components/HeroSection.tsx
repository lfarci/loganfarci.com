import React from "react";
import { Heading1, Text } from "@/components/shared/typography";
import type { ImageProps } from "@/types";

interface HeroSectionProps {
    heading: React.ReactNode | string;
    description?: React.ReactNode | string;
    image?: ImageProps;
    actions?: React.ReactNode;
    proof?: React.ReactNode;
}

// Generic hero layout pairing text with optional media, actions, and factual proof.
const HeroSection: React.FC<HeroSectionProps> = ({ heading, description, image, actions, proof }) => {
    const renderHeading = () => (typeof heading === "string" ? <Heading1>{heading}</Heading1> : heading);
    const renderDescription = () =>
        typeof description === "string" ? (
            <Text className="max-w-xl text-lg md:text-xl">{description}</Text>
        ) : (
            (description ?? null)
        );

    const buildImageClassName = () => {
        const baseClassName = "relative z-10 mx-auto h-full max-h-[42rem] w-full object-contain object-bottom";
        if (!image?.className) return baseClassName;

        return `${baseClassName} ${image.className}`;
    };

    return (
        <section className="grid overflow-hidden border-y border-border-light bg-surface md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]">
            <div className="flex min-w-0 flex-col justify-center space-y-5 px-6 py-12 md:px-10 md:py-20 lg:px-14">
                {renderHeading()}
                {renderDescription()}
                {actions}
                {proof}
            </div>
            {image && (
                <div className="hero-portrait-surface relative mx-auto flex min-h-[24rem] w-full items-end overflow-hidden md:min-h-full md:max-w-none">
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/30 to-transparent"
                    />
                    <img
                        src={image.src}
                        alt={image.alt}
                        width={image.width ?? 512}
                        height={image.height ?? 512}
                        fetchPriority="high"
                        className={buildImageClassName()}
                    />
                </div>
            )}
        </section>
    );
};

export default HeroSection;
