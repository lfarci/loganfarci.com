import React from "react";
import Card, { CardBody, CardMedia, CardTitle } from "./Card";
import { Text } from "@/components/shared/typography";
import { ImageProps } from "@/types";

export type MediaTileSize = "small" | "medium" | "large";

type MediaTileCardProps = {
    title: string;
    description?: string;
    image?: ImageProps;
    size?: MediaTileSize;
};

const sizeClasses: Record<MediaTileSize, string> = {
    small: "max-h-16 md:max-h-20",
    medium: "max-h-20 md:max-h-24",
    large: "max-h-24 md:max-h-28",
};

const MediaTileCard: React.FC<MediaTileCardProps> = ({ title, description, image, size = "medium" }) => (
    <Card>
        <div className="flex items-center flex-col h-full">
            {image && (
                <CardMedia
                    media={image}
                    size="full"
                    containerClassName="shrink-0 flex items-center justify-center mb-4"
                    className={sizeClasses[size]}
                />
            )}
            <CardBody className="items-center justify-center grow text-center">
                <CardTitle className="text-center leading-tight">{title}</CardTitle>
                {description && <Text className="text-center mt-3 text-sm">{description}</Text>}
            </CardBody>
        </div>
    </Card>
);

export default MediaTileCard;
