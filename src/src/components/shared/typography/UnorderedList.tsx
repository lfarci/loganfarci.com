type UnorderedListProps = {
    className?: string;
    children: React.ReactNode;
};

const UnorderedList: React.FC<UnorderedListProps> = ({ children, className = "" }) => {
    return (
        <ul className={`list-disc list-inside mb-4 space-y-2 text-base md:text-lg text-gray-500 ${className}`}>
            {children}
        </ul>
    );
};

export default UnorderedList;