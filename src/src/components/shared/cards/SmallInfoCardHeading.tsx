"use client";

import ClientTooltip from "@/components/shared/ClientTooltip";
import { useEffect, useRef, useState } from "react";
import { Heading3 } from "@/components/shared/typography";

type SmallInfoCardHeadingProps = { children: string };

const SmallInfoCardHeading: React.FC<SmallInfoCardHeadingProps> = ({ children }) => {
    const headingReference = useRef<HTMLHeadingElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const htmlElement = headingReference.current;
        if (htmlElement) {
            setIsOverflowing(htmlElement.scrollWidth > htmlElement.clientWidth);
        }
    }, [children]);

    const heading = (
        <Heading3 ref={headingReference} className="lg:whitespace-nowrap lg:overflow-hidden lg:text-ellipsis">
            {children}
        </Heading3>
    );

    return isOverflowing ? <ClientTooltip content={children}>{heading}</ClientTooltip> : heading;
};

export default SmallInfoCardHeading;
