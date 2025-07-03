type CardProps = {
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-md h-full">
    {children}
</div>;

export default Card;
