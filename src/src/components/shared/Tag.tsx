"use client";

import { Chip } from "@heroui/react";
import React from "react";
import Image from "next/image";
import { Text } from "@/components/shared/typography";
import { getSkillIcon } from "@/core/skillIcons";

interface TagIconProps {
    src: string;
    alt: string;
}

interface TagProps {
    imageSrc?: string;
    imageAlt?: string;
    children: React.ReactNode;
}

const TagIcon: React.FC<TagIconProps> = ({ src, alt }) => (
    <Image src={src} alt={alt} width={16} height={16} className="rounded-xs mr-1.5" />
);

const Tag: React.FC<TagProps> = ({ children, imageSrc = "", imageAlt = "" }) => {
    let startContent: React.ReactNode = undefined;

    // Use manual imageSrc/imageAlt if provided (backward compatibility)
    if (imageSrc && imageAlt) {
        startContent = <TagIcon src={imageSrc} alt={imageAlt} />;
    } else if (typeof children === "string") {
        // Otherwise attempt skill icon lookup
        const skillIcon = getSkillIcon(children);
        if (skillIcon) {
            startContent = <TagIcon src={skillIcon.src} alt={skillIcon.alt} />;
        }
    }

    return (
        <Chip variant="bordered" size="lg" radius="md" className="text-base" startContent={startContent}>
            <Text>{children}</Text>
        </Chip>
    );
};

export default Tag;
