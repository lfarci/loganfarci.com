"use client";

import React from "react";
import Tag from "./Tag";
import { getSkillIcon } from "@/core/skillIcons";

interface SkillTagProps {
    children: React.ReactNode;
}

const SkillTag: React.FC<SkillTagProps> = ({ children }) => {
    if (typeof children === "string") {
        const skillIcon = getSkillIcon(children);
        if (skillIcon) {
            return (
                <Tag imageSrc={skillIcon.src} imageAlt={skillIcon.alt}>
                    {children}
                </Tag>
            );
        }
    }

    return <Tag>{children}</Tag>;
};

export default SkillTag;
