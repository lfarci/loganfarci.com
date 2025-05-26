import React from "react";
import Image from "next/image";
import SmallInfoCardHeading from "@/components/shared/cards/SmallInfoCardHeading";

export type SmallInfoCardProps = {
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  heading: string;
  subtitle?: string | React.ReactNode;
  details?: Array<string | React.ReactNode>;
  tooltip?: string;
  children?: React.ReactNode;
  imageSize?: "small" | "medium" | "large";
};

const getImageSize = (imageSize: "small" | "medium" | "large" = "medium") => {
  const sizeMap = { small: 10, medium: 16, large: 24 };
  const size = sizeMap[imageSize];
  return { width: size, height: size };
};

const SmallInfoCard: React.FC<SmallInfoCardProps> = ({ image, heading, subtitle, details, imageSize, children }) => {
  const selectedImageSize = getImageSize(imageSize);

  return (
    <div className="flex bg-white rounded-lg shadow p-4 !lg:mt-4 w-full mx-auto items-start min-w-0">
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={`object-contain h-${selectedImageSize.height} w-${selectedImageSize.width} mr-4 flex-shrink-0`}
        />
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <SmallInfoCardHeading>{heading}</SmallInfoCardHeading>
        {subtitle && (
          <span className="text-base text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
            {subtitle}
          </span>
        )}
        {details && details.map((detail, idx) => (
          <span
            key={idx}
            className="text-base text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {detail}
          </span>
        ))}
        {children && (
          <div className="mt-4 flex flex-row gap-2 justify-start flex-1 min-w-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmallInfoCard;