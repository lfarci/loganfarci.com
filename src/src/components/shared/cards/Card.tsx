type CardProps = { children?: React.ReactNode };

const Card: React.FC<CardProps> = ({ children }) => (
    <div className="p-6 bg-surface rounded-3xl border border-border-light shadow-md h-full">{children}</div>
);

export default Card;
