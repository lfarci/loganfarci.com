type FootnoteProps = {
    className?: string;
    children: React.ReactNode;
};

const Footnote: React.FC<FootnoteProps> = ({ children, className = "" }) => {
    return <p className={`text-sm md:text-base text-gray-400 !leading-relaxed ${className}`}>{children}</p>;
};

export default Footnote;
