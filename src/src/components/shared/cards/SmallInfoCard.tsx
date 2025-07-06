import React from "react";
import Image from "next/image";
import SmallInfoCardHeading from "@/components/shared/cards/SmallInfoCardHeading";
import Card from "./Card";
import { Secondary, Text } from "@/components/shared/typography";

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
  imagePosition?: "left" | "top-left";
};

const getImageSize = (imageSize: "small" | "medium" | "large" = "medium") => {
  const sizeMap = { small: "w-12 h-12 md:w-16 md:h-16", medium: "w-16 h-16 md:w-20 md:h-20", large: "w-20 h-20 md:w-24 md:h-24" };
  return sizeMap[imageSize];
};

const SmallInfoCard: React.FC<SmallInfoCardProps> = ({ image, heading, subtitle, details, imageSize = "medium", imagePosition = "left", children }) => {
  const selectedImageSize = getImageSize(imageSize);
  const isMediumSize = imageSize === "medium";
  const isTopLeftPosition = imagePosition === "top-left";

  return (
    <Card>
      <div className={`flex w-full mx-auto min-w-0 ${isMediumSize && !isTopLeftPosition ? 'gap-4 items-stretch' : 'items-stretch'}`}>
        {image && (
          <div className={`flex justify-center flex-shrink-0 ${
            isTopLeftPosition 
              ? 'items-start mt-1 mr-4' 
              : isMediumSize 
                ? 'items-center mt-0' 
                : 'items-center mt-1 mr-4'
          }`}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className={`object-contain ${selectedImageSize}`}
            />
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <SmallInfoCardHeading>{heading}</SmallInfoCardHeading>
          {subtitle && (
            <Text className="whitespace-nowrap overflow-hidden text-ellipsis">
              {subtitle}
            </Text>
          )}
          {details?.map((detail, idx) => (
            <Secondary
              key={idx}
              className="whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {detail}
            </Secondary>
          ))}
          {children && (
            <div className="mt-4 flex flex-row gap-2 justify-start flex-1 min-w-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SmallInfoCard;