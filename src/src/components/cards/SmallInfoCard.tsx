import React from "react";
import Card, { CardBody, CardFooter, CardMedia } from "./Card";
import SmallInfoCardHeading from "./SmallInfoCardHeading";
import { Secondary, Text } from "@/components/shared/typography";
import { ImageProps } from "@/types";
import { createId } from "@/core/string";

export type SmallInfoCardImageSize = "small" | "medium" | "large";
export type SmallInfoCardImagePosition = "center" | "start";

export type SmallInfoCardProps = {
    image?: ImageProps;
    heading: string;
    subtitle?: string | React.ReactNode;
    details?: Array<string | React.ReactNode>;
    tooltip?: string;
    children?: React.ReactNode;
    imageSize?: SmallInfoCardImageSize;
    imagePosition?: SmallInfoCardImagePosition;
    flex?: "row" | "col";
    id?: string;
};

const mediaSizeClasses: Record<SmallInfoCardImageSize, string> = {
    small: "w-10 h-10 md:w-16 md:h-16",
    medium: "w-16 h-16 md:w-20 md:h-20",
    large: "w-20 h-20 md:w-24 md:h-24",
};

const mediaContainerClass = (imageSize: SmallInfoCardImageSize, imagePosition: SmallInfoCardImagePosition) => {
    const positionClass = imagePosition === "start" ? "items-start mt-1 mr-4" : "items-center";
    const sizeClass = imageSize !== "medium" && imagePosition !== "start" ? "mt-1 mr-4" : "";
    return ["flex shrink-0 justify-center", positionClass, sizeClass].filter(Boolean).join(" ");
};

const SmallInfoCard: React.FC<SmallInfoCardProps> = ({
    image,
    heading,
    subtitle,
    details,
    imageSize = "medium",
    imagePosition = "center",
    children,
    id,
    flex = "row",
}) => {
    const cardId = id ?? createId(heading);
    const bodyFlexDirectionClass = flex === "row" ? "flex-row" : "flex-col";

    const containerClass = [
        "flex w-full mx-auto min-w-0 items-stretch",
        imageSize === "medium" && imagePosition !== "start" ? "gap-4" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Card id={cardId} className="scroll-mt-24">
            <div className={containerClass}>
                {image && (
                    <CardMedia
                        media={image}
                        size="medium"
                        align={imagePosition}
                        containerClassName={mediaContainerClass(imageSize, imagePosition)}
                        className={mediaSizeClasses[imageSize]}
                    />
                )}
                <div className="flex flex-col flex-1 min-w-0">
                    <SmallInfoCardHeading>{heading}</SmallInfoCardHeading>
                    {subtitle && <Text className="whitespace-nowrap overflow-hidden text-ellipsis">{subtitle}</Text>}
                    {details?.map((detail, idx) => (
                        <Secondary key={idx} className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {detail}
                        </Secondary>
                    ))}
                    {children && (
                        <CardFooter
                            className={`mt-4 flex ${bodyFlexDirectionClass} gap-2 justify-start items-start flex-1 min-w-0`}
                        >
                            {children}
                        </CardFooter>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default SmallInfoCard;
