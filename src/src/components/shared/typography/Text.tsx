type TextProps = {
    className?: string;
    children: React.ReactNode;
};

const Text: React.FC<TextProps> = ({ children, className = "" }) => {
    return <p className={`text-lg md:text-xl text-gray-500 ${className}`}>{children}</p>;
};

export default Text;
