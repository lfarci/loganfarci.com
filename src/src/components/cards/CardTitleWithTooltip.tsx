import { useEffect, useRef, useState } from "react";
import Tooltip from "@/components/shared/Tooltip";
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

    return isOverflowing ? <Tooltip content={children}>{heading}</Tooltip> : heading;
};

export default CardTitleWithTooltip;
