import { useEffect, useRef, useState } from "react";
import ClientTooltip from "@/components/shared/ClientTooltip";
import { Heading3 } from "@/components/shared/typography";

type CardTitleWithTooltipProps = {
    children: string;
    className?: string;
};

const join = (...classes: Array<string | undefined | null | false>) => classes.filter(Boolean).join(" ");

const CardTitleWithTooltip: React.FC<CardTitleWithTooltipProps> = ({ children, className }) => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const element = headingRef.current;
        if (element) {
            setIsOverflowing(element.scrollWidth > element.clientWidth);
        }
    }, [children]);

    const heading = (
        <Heading3 ref={headingRef} className={join("lg:whitespace-nowrap lg:overflow-hidden lg:text-ellipsis", className)}>
            {children}
        </Heading3>
    );

    return isOverflowing ? <ClientTooltip content={children}>{heading}</ClientTooltip> : heading;
};

export default CardTitleWithTooltip;
