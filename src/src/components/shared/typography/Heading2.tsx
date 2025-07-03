type Heading2Props = {
    className?: string;
    children: React.ReactNode;
};

const Heading2: React.FC<Heading2Props> = ({ children, className = "" }) => {
    return <h2 className={`text-2xl md:text-3xl font-bold heading-font text-gray-800 ${className}`}>{children}</h2>;
};

export default Heading2;
