import React from "react";
import Image from "next/image";
import { ImageProps } from "@/types";

export type SmallInfoCardImageSize = "small" | "medium" | "large";
export type SmallInfoCardImagePosition = "center" | "start";

type SmallInfoCardImageProps = {
    image: ImageProps;
    imageSize: SmallInfoCardImageSize;
    imagePosition: SmallInfoCardImagePosition;
};

const getImageSize = (imageSize: SmallInfoCardImageSize = "medium") => {
    const sizeMap = {
        small: "w-10 h-10 md:w-16 md:h-16",
        medium: "w-16 h-16 md:w-20 md:h-20",
        large: "w-20 h-20 md:w-24 md:h-24",
    };
    return sizeMap[imageSize];
};

const getImageContainerClass = (imageSize: SmallInfoCardImageSize, imagePosition: SmallInfoCardImagePosition) => {
    const baseClass = "flex justify-center flex-shrink-0 ";
    const positionClass = imagePosition === "start" ? "items-start mt-1 mr-4" : "items-center mt-0";
    const sizeClass = imageSize !== "medium" && imagePosition !== "start" ? "mt-1 mr-4" : "";
    return `${baseClass} ${positionClass} ${sizeClass}`.trim();
};

const SmallInfoCardImage: React.FC<SmallInfoCardImageProps> = ({ image, imageSize, imagePosition }) => {
    const selectedImageSize = getImageSize(imageSize);
    const imageContainerClass = getImageContainerClass(imageSize, imagePosition);

    return (
        <div className={imageContainerClass}>
            <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={`object-contain ${selectedImageSize}`}
            />
        </div>
    );
};

export default SmallInfoCardImage;
