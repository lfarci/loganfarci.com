import Image from "next/image";
import React from "react";

interface IconProps {
    src: string;
    alt: string;
}

const Icon: React.FC<IconProps> = ({ src, alt }) => <Image
    src={src}
    alt={alt}
    width={512}
    height={512}
    className="w-1/4"
/>;

export default Icon;