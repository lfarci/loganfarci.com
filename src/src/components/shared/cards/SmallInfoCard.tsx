import React from "react";
import SmallInfoCardImage, { SmallInfoCardImageSize, SmallInfoCardImagePosition } from "./SmallInfoCardImage";
import SmallInfoCardHeading from "@/components/shared/cards/SmallInfoCardHeading";
import Card from "./Card";
import { Secondary, Text } from "@/components/shared/typography";
import { ImageProps } from "@/types";
import { createId } from "@/core/string";

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
    const isMediumSize = imageSize === "medium";
    const isStartPosition = imagePosition === "start";
    const bodyFlexDirectionClass = flex === "row" ? "flex-row" : "flex-col";

    const containerClass = [
        "flex w-full mx-auto min-w-0",
        isMediumSize && !isStartPosition ? "gap-4 items-stretch" : "items-stretch",
    ].join(" ");

    const cardId = id ?? createId(heading);

    return (
        <Card id={cardId} className="scroll-mt-24">
            <div className={containerClass}>
                {image && <SmallInfoCardImage image={image} imageSize={imageSize} imagePosition={imagePosition} />}
                <div className="flex flex-col flex-1 min-w-0">
                    <SmallInfoCardHeading>{heading}</SmallInfoCardHeading>
                    {subtitle && <Text className="whitespace-nowrap overflow-hidden text-ellipsis">{subtitle}</Text>}
                    {details?.map((detail, idx) => (
                        <Secondary key={idx} className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {detail}
                        </Secondary>
                    ))}
                    {children && (
                        <div className={`mt-4 flex ${bodyFlexDirectionClass} gap-2 justify-start flex-1 min-w-0`}>{children}</div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default SmallInfoCard;
