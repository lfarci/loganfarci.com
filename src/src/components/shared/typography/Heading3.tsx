import { forwardRef } from "react";

type Heading3Props = {
    className?: string;
    children: React.ReactNode;
};

const Heading3 = forwardRef<HTMLHeadingElement, Heading3Props>(({ children, className = "" }, ref) => {
    return <h3 className={`text-2xl font-bold text-gray-600 heading-font ${className}`} ref={ref}>{children}</h3>;
});

Heading3.displayName = "Heading3";

export default Heading3;
