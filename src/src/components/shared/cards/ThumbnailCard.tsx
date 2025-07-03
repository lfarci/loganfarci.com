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
        <div className="flex items-center flex-col">
            {image && <Image
                className={sizeClasses[size]}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
            />}
            <div className="flex flex-col items-center mt-6">
                <Heading3>{title}</Heading3>
                {description && <Text className="text-center mt-4">{description}</Text>}
            </div>
        </div>
    </Card>;
};

export default ThumbnailCard;
