import { Tooltip } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

type SmallInfoCardHeadingProps = {
  children: string;
};

const SmallInfoCardHeading: React.FC<SmallInfoCardHeadingProps> = ({ children }) => {
  const headingReference = useRef<HTMLHeadingElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const htmlElement = headingReference.current;
    if (htmlElement) {
      setIsOverflowing(htmlElement.scrollWidth > htmlElement.clientWidth);
    }
  }, [children]);

  const heading = (
    <h3
      ref={headingReference}
      className="lg:text-base text-lg font-bold text-gray-500 heading-font lg:whitespace-nowrap lg:overflow-hidden lg:text-ellipsis"
    >
      {children}
    </h3>
  );

  return isOverflowing ? (
    <Tooltip content={children}>{heading}</Tooltip>
  ) : (
    heading
  );
};

export default SmallInfoCardHeading;