interface HomeSectionProps {
    heading: string;
    children?: React.ReactNode;
}

const HomeSection: React.FC<HomeSectionProps> = ({ heading, children }) => <section className="pt-8">
    <h2 className="text-3xl font-bold text-center mb-4 heading-font">{heading}</h2>
    {children}
</section>;

export default HomeSection;