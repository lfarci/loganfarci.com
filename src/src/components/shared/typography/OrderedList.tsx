type OrderedListProps = {
    className?: string;
    children: React.ReactNode;
};

const OrderedList: React.FC<OrderedListProps> = ({ children, className = "" }) => {
    return (
        <ol className={`list-decimal list-inside mb-4 space-y-2 text-base md:text-lg text-gray-500 ${className}`}>
            {children}
        </ol>
    );
};

export default OrderedList;
