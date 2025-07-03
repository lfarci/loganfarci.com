type Heading1Props = {
    className?: string;
    children: React.ReactNode;
};

const Heading1: React.FC<Heading1Props> = ({ children, className = "" }) => {
    return <h1 className={`text-3xl md:text-4xl font-bold heading-font ${className}`}>{children}</h1>;
};

export default Heading1;
