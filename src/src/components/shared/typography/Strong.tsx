type StrongProps = {
    className?: string;
    children: React.ReactNode;
};

const Strong: React.FC<StrongProps> = ({ children, className = "" }) => {
    return <strong className={`font-semibold text-gray-500 ${className}`}>{children}</strong>;
};

export default Strong;
