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
        const baseClassName = "relative block w-full bg-surface object-cover shadow-card";
        if (!image?.className) return baseClassName;

        return `${baseClassName} ${image.className}`;
    };

    return (
        <section className="grid items-center gap-8 border-b border-border-light py-12 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.68fr)] md:gap-14 md:py-20">
            <div className="flex min-w-0 flex-col justify-center space-y-5 md:space-y-6">
                {renderHeading()}
                {renderDescription()}
                {actions}
                {proof}
            </div>
            {image && (
                <div className="relative mx-auto w-full max-w-sm md:max-w-none">
                    <div aria-hidden="true" className="absolute -inset-3 border border-accent/50" />
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
