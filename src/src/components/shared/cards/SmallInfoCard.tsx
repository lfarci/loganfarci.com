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
};

const getImageSize = (imageSize: "small" | "medium" | "large" = "medium") => {
  const sizeMap = { small: 10, medium: 20, large: 24 };
  const size = sizeMap[imageSize];
  return { width: size, height: size };
};

const SmallInfoCard: React.FC<SmallInfoCardProps> = ({ image, heading, subtitle, details, imageSize = "medium", children }) => {
  const selectedImageSize = getImageSize(imageSize);
  const isMediumSize = imageSize === "medium";

  return (
    <Card>
      <div className={`flex w-full mx-auto min-w-0 ${isMediumSize ? 'gap-4 items-center' : '!lg:mt-4 items-start'}`}>
        {image && (
          <div className={`flex ${isMediumSize ? 'items-center' : 'items-start'} flex-shrink-0 ${isMediumSize ? 'mt-0' : 'mt-1 mr-4'}`}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className={
                isMediumSize 
                  ? "object-contain w-16 h-16 md:w-20 md:h-20"
                  : `object-contain h-${selectedImageSize.height} w-${selectedImageSize.width}`
              }
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