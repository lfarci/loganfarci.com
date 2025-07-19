"use client";

import { Chip } from "@heroui/react";
import React from "react";
import Image from "next/image";
import { Text } from "@/components/shared/typography";

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
    <Image src={src} alt={alt} width={16} height={16} className="rounded-sm mr-1.5" />
);

const Tag: React.FC<TagProps> = ({ children, imageSrc = "", imageAlt = "" }) => {
    let startContent: React.ReactNode = undefined;

    if (imageSrc && imageAlt) {
        startContent = <TagIcon src={imageSrc} alt={imageAlt} />;
    }

    return (
        <Chip variant="bordered" size="lg" radius="md" className="text-base" startContent={startContent}>
            <Text>{children}</Text>
        </Chip>
    );
};

export default Tag;
