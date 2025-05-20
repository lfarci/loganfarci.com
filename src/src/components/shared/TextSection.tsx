import Section from "../shared/Section";

interface TextSection {
    heading: string;
    text: string;
}

const TextSection: React.FC<TextSection> = ({heading, text}) => <Section heading={heading}>
    <p className="text">{text}</p>
</Section>;

export default TextSection;