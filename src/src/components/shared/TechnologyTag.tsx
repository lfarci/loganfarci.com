"use client";

import React from "react";
import Tag from "./Tag";
import { getTechnologyIcon } from "@/core/technologyIcons";

interface TechnologyTagProps {
    children: React.ReactNode;
}

const TechnologyTag: React.FC<TechnologyTagProps> = ({ children }) => {
    if (typeof children === "string") {
        const technologyIcon = getTechnologyIcon(children);
        if (technologyIcon) {
            return (
                <Tag imageSrc={technologyIcon.src} imageAlt={technologyIcon.alt}>
                    {children}
                </Tag>
            );
        }
    }

    return <Tag>{children}</Tag>;
};

export default TechnologyTag;
