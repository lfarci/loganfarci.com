import React from "react";
import Card, { CardBody, CardFooter, CardHeader, CardMedia, CardSubtitle, CardTitle } from "./Card";
import CardTitleWithTooltip from "./CardTitleWithTooltip";
import { Secondary } from "@/components/shared/typography";
import { ImageProps } from "@/types";

type InfoCardMediaSize = "small" | "medium" | "large";

type InfoCardProps = {
    title: string;
    subtitle?: React.ReactNode;
    details?: Array<string | React.ReactNode>;
    media?: ImageProps;
    mediaSize?: InfoCardMediaSize;
    mediaAlign?: "start" | "center";
    children?: React.ReactNode;
    footer?: React.ReactNode;
    align?: "start" | "center";
    showTitleTooltip?: boolean;
    className?: string;
};

const mediaSizeClasses: Record<InfoCardMediaSize, string> = {
    small: "w-12 h-12 md:w-16 md:h-16",
    medium: "w-16 h-16 md:w-20 md:h-20",
    large: "w-20 h-20 md:w-24 md:h-24",
};

const cn = (...classes: Array<string | undefined | null | false>) => classes.filter(Boolean).join(" ");

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    subtitle,
    details,
    media,
    mediaSize = "medium",
    mediaAlign = "start",
    children,
    footer,
    align = "start",
    showTitleTooltip = false,
    className,
}) => {
    const titleNode = showTitleTooltip ? <CardTitleWithTooltip>{title}</CardTitleWithTooltip> : <CardTitle className="leading-tight">{title}</CardTitle>;

    const subtitleNode =
        typeof subtitle === "string" ? (
            <CardSubtitle className="whitespace-nowrap overflow-hidden text-ellipsis">{subtitle}</CardSubtitle>
        ) : (
            subtitle
        );

    const hasBody = Boolean(children);

    return (
        <Card className={cn("scroll-mt-24", className)}>
            <div className="flex w-full items-start gap-4">
                {media && (
                    <CardMedia
                        media={media}
                        size="medium"
                        align={mediaAlign}
                        containerClassName={cn("flex shrink-0 justify-center", mediaAlign === "start" ? "items-start mt-1" : "items-center")}
                        className={mediaSizeClasses[mediaSize]}
                    />
                )}
                <div className={cn("flex flex-col flex-1 min-w-0", align === "center" ? "items-center text-center" : "items-start")}>
                    <CardHeader className={cn("gap-1.5 w-full", align === "center" ? "items-center text-center" : "items-start")}>
                        {titleNode}
                        {subtitleNode}
                        {details?.map((detail, idx) => (
                            <Secondary key={idx} className="whitespace-nowrap overflow-hidden text-ellipsis">
                                {detail}
                            </Secondary>
                        ))}
                    </CardHeader>

                    {hasBody && (
                        <CardBody className={cn("pt-1 gap-2 w-full", align === "center" ? "items-center text-center" : "items-start")}>
                            {children}
                        </CardBody>
                    )}

                    {footer && (
                        <CardFooter className={cn("mt-4 w-full", align === "center" ? "justify-center" : "justify-start")}>{footer}</CardFooter>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default InfoCard;
