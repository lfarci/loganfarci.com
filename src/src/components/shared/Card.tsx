import Image from "next/image";
import { ImageProps } from "../../types";

interface CardProps {
    title: string;
    description?: string;
    image?: ImageProps;
}

const Card: React.FC<CardProps> = ({ title, description, image }) => <div className="p-4 bg-white rounded-3xl border border-gray-200 shadow-md flex items-center flex-col">
    {image && <Image
        className="w-1/2"
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
    />}
    <div className="flex flex-col items-center mt-6">
        <h3 className="text-lg font-bold text-gray-500 heading-font">{title}</h3>
        {description && <p className="text-center text mt-4">{description}</p>}
    </div>
</div>;

export default Card;
