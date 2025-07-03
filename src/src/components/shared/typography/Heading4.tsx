type Heading4Props = {
    className?: string;
    children: React.ReactNode;
};

const Heading4: React.FC<Heading4Props> = ({ children, className = "" }) => {
    return <h4 className={`text-lg md:text-xl font-semibold heading-font text-gray-500 ${className}`}>{children}</h4>;
};

export default Heading4;
