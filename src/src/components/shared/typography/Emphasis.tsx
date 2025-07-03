type EmphasisProps = {
    className?: string;
    children: React.ReactNode;
};

const Emphasis: React.FC<EmphasisProps> = ({ children, className = "" }) => {
    return <em className={`italic text-gray-500 ${className}`}>{children}</em>;
};

export default Emphasis;
