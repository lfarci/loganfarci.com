import Section from "@/components/shared/Section";
import { Text } from "@/components/shared/typography";

interface TextSection {
    heading: string;
    label?: string;
    text: string;
    redirectPath?: string;
    redirectLabel?: string;
}

const TextSection: React.FC<TextSection> = ({ heading, label, text, redirectPath, redirectLabel }) => (
    <Section heading={heading} label={label} redirectPath={redirectPath} redirectLabel={redirectLabel}>
        <Text>{text}</Text>
    </Section>
);

export default TextSection;
