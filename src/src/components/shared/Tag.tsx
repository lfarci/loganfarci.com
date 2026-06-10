import React from "react";
import { Badge } from "@/components/ui/badge";

interface TagIconProps {
    src: string;
    alt: string;
}

interface TagProps {
    imageSrc?: string;
    imageAlt?: string;
    children: React.ReactNode;
}

const TagIcon: React.FC<TagIconProps> = ({ src, alt }) => {
    const imageClasses = ["mr-1"];

    if (src.includes("-mono")) {
        imageClasses.push("filter", "dark:invert", "dark:brightness-125");
    }

    return <img src={src} alt={alt} width={16} height={16} className={imageClasses.join(" ")} />;
};

const Tag: React.FC<TagProps> = ({ children, imageSrc = "", imageAlt = "" }) => {
    let startContent: React.ReactNode = undefined;

    if (imageSrc && imageAlt) {
        startContent = <TagIcon src={imageSrc} alt={imageAlt} />;
    }

    return (
        <Badge>
            {startContent}
            {children}
        </Badge>
    );
};

export default Tag;
