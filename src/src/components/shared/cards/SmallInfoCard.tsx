import React from "react";
import Image from "next/image";
import SmallInfoCardHeading from "@/components/shared/cards/SmallInfoCardHeading";
import Card from "./Card";
import { Text } from "@/components/shared/typography";

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

  return <Card>
    <div className="flex !lg:mt-4 w-full mx-auto items-start min-w-0">
      {image && (
        <div className="flex items-start mt-1 mr-4 flex-shrink-0">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className={`object-contain h-${selectedImageSize.height} w-${selectedImageSize.width}`}
          />
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <SmallInfoCardHeading>{heading}</SmallInfoCardHeading>
        {subtitle && (
          <Text className="whitespace-nowrap overflow-hidden text-ellipsis">{subtitle}</Text>
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
  </Card>;
};

export default SmallInfoCard;