import { ImageProps } from "../../../types";
import Card, { CardBody, CardMedia, CardTitle } from "./Card";
import { Text } from "@/components/shared/typography";

export type ThumbnailCardImageSize = "small" | "medium" | "large" | "full";

export type ThumbnailCardProps = {
    title: string;
    description?: string;
    image?: ImageProps;
    size?: ThumbnailCardImageSize;
};

const sizeClasses = { small: "w-1/4", medium: "w-1/2", large: "w-3/4", full: "w-full" };

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ title, description, image, size = "medium" }) => {
    return (
        <Card>
            <div className="flex items-center flex-col h-full">
                {image && (
                    <CardMedia
                        media={image}
                        size={size}
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
};

export default ThumbnailCard;
