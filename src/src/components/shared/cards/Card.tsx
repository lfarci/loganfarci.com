type CardProps = {
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => <div className="p-4 bg-white rounded-3xl border border-gray-200 shadow-md">
    {children}
</div>;

export default Card;
