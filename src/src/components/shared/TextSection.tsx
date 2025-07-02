import Section from "@/components/shared/Section";
import Text from "@/components/shared/typography/Text";

interface TextSection {
    heading: string;
    text: string;
}

const TextSection: React.FC<TextSection> = ({heading, text}) => <Section heading={heading}>
    <Text>{text}</Text>
</Section>;

export default TextSection;