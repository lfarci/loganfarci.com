import React from "react";
import { Heading1, Text } from "@/components/shared/typography";
import type { ImageProps } from "@/types";

interface HeroSectionProps {
    heading: React.ReactNode | string;
    eyebrow?: string;
    description?: React.ReactNode | string;
    image?: ImageProps;
    actions?: React.ReactNode;
}

// Generic hero layout pairing text with optional media and actions.
const HeroSection: React.FC<HeroSectionProps> = ({ heading, eyebrow, description, image, actions }) => {
    const renderHeading = () =>
        typeof heading === "string" ? (
            <Heading1 className="max-w-3xl text-balance">{heading}</Heading1>
        ) : (
            heading
        );
    const renderDescription = () =>
        typeof description === "string" ? (
            <Text className="max-w-2xl text-lg md:text-xl text-pretty">{description}</Text>
        ) : (
            description ?? null
        );

    const buildImageClassName = () => {
        const baseClassName = "aspect-square w-full rounded-2xl object-cover shadow-2xl";
        if (!image?.className) return baseClassName;

        return `${baseClassName} ${image.className}`;
    };

    return (
        <section className="relative mt-6 overflow-hidden rounded-3xl border border-border-light bg-surface-elevated px-6 py-8 shadow-sm md:px-10 md:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,var(--color-primary-light),transparent_32%),radial-gradient(circle_at_85%_18%,oklch(92%_0.08_170),transparent_28%)] opacity-80 dark:opacity-20" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-60" />
            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
                <div className="flex flex-1 flex-col justify-center space-y-6">
                    {eyebrow && (
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary text-font">
                            {eyebrow}
                        </p>
                    )}
                    {renderHeading()}
                    {renderDescription()}
                    {actions && <div className="pt-1">{actions}</div>}
                </div>
                {image && (
                    <div className="w-full max-w-xs shrink-0 rounded-3xl border border-border-light bg-background/70 p-3 shadow-xl md:max-w-sm">
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
            </div>
        </section>
    );
};

export default HeroSection;
