type CardProps = { 
    children?: React.ReactNode;
    id?: string;
    className?: string;
};

const Card: React.FC<CardProps> = ({ children, id, className }) => (
    <div id={id} className={`p-6 bg-surface rounded-3xl border border-border-light shadow-md h-full${className ? ` ${className}` : ""}`}>
        {children}
    </div>
);

export default Card;
