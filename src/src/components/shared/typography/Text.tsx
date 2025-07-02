type TextProps = {
    className?: string;
    children: React.ReactNode;
};

const Text: React.FC<TextProps> = ({ children, className = "" }) => {
    return <p className={`text-base md:text-base text-gray-500 !leading-relaxed ${className}`}>{children}</p>;
};

export default Text;
