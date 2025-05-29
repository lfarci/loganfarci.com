import Image from "next/image";
import { ImageProps } from "../../../types";
import Card from "./Card";

export type ThumbnailCardProps = {
    title: string;
    description?: string;
    image?: ImageProps;
    size?: 'small' | 'medium' | 'large' | 'full';
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
                <h3 className="text-lg font-bold text-gray-500 heading-font">{title}</h3>
                {description && <p className="text-center text mt-4">{description}</p>}
            </div>
        </div>
    </Card>;
};

export default ThumbnailCard;
