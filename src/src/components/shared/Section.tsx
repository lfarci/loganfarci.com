interface SectionProps {
    heading: string;
    children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ heading, children }) => <section className="pt-8">
    <h2 className="text-3xl font-bold mb-4 heading-font">{heading}</h2>
    {children}
</section>;

export default Section;