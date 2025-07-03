import Image from "next/image";
import { ImageProps } from "../../../types";
import Card from "./Card";
import Text from "@/components/shared/typography/Text";
import Heading3 from "@/components/shared/typography/Heading3";

export type ThumbnailCardImageSize = 'small' | 'medium' | 'large' | 'full';

export type ThumbnailCardProps = {
    title: string;
    description?: string;
    image?: ImageProps;
    size?: ThumbnailCardImageSize;
}

const sizeClasses = {
    small: 'w-1/4',
    medium: 'w-1/2',
    large: 'w-3/4',
    full: 'w-full'
};

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ title, description, image, size = 'medium' }) => {
    return <Card>
        <div className="flex items-center flex-col h-full">
            {image && <div className="flex-shrink-0 flex items-center justify-center mb-4">
                <Image
                    className={sizeClasses[size]}
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                />
            </div>}
            <div className="flex flex-col items-center justify-center flex-grow text-center">
                <Heading3 className="text-center leading-tight">{title}</Heading3>
                {description && <Text className="text-center mt-3 text-sm">{description}</Text>}
            </div>
        </div>
    </Card>;
};

export default ThumbnailCard;
