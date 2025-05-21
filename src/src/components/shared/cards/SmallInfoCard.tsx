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
};

const SmallInfoCard: React.FC<SmallInfoCardProps> = ({ image, heading, subtitle, details }) => {
  return (
    <div className="flex bg-white rounded-lg shadow p-4 !lg:mt-4 w-full mx-auto items-center min-w-0">
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="object-contain h-16 w-16 mr-4"
        />
      )}
      <div className="flex flex-col min-w-0">
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
      </div>
    </div>
  );
};

export default SmallInfoCard;