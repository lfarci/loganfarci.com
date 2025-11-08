import React from "react";
import Tag from "./Tag";
import { getIcon } from "@/core/icons";

interface IconTagProps {
    children: React.ReactNode;
}

const IconTag: React.FC<IconTagProps> = ({ children }) => {
    if (typeof children === "string") {
        const icon = getIcon(children);
        if (icon) {
            return (
                <Tag imageSrc={icon.src} imageAlt={icon.alt}>
                    {children}
                </Tag>
            );
        }
    }

    return <Tag>{children}</Tag>;
};

export default IconTag;
