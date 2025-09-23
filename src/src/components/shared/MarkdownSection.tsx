import Section from "@/components/shared/Section";
import MarkdownContent from "@/components/shared/MarkdownContent";

interface MarkdownSectionProps {
    heading: string;
    content: string;
    redirectPath?: string;
    redirectLabel?: string;
}

const MarkdownSection: React.FC<MarkdownSectionProps> = ({ 
    heading, 
    content, 
    redirectPath, 
    redirectLabel 
}) => (
    <Section heading={heading} redirectPath={redirectPath} redirectLabel={redirectLabel}>
        <MarkdownContent content={content} />
    </Section>
);

export default MarkdownSection;