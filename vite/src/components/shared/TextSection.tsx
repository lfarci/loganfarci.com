import Section from "@/components/shared/Section";
import { Text } from "@/components/shared/typography";

interface TextSection {
    heading: string;
    text: string;
    redirectPath?: string;
    redirectLabel?: string;
}

const TextSection: React.FC<TextSection> = ({ heading, text, redirectPath, redirectLabel }) => (
    <Section heading={heading} redirectPath={redirectPath} redirectLabel={redirectLabel}>
        <Text>{text}</Text>
    </Section>
);

export default TextSection;
