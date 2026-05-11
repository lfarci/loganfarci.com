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
        <div className="grid gap-6 rounded-2xl border border-border-light bg-surface p-6 shadow-sm md:grid-cols-[0.35fr_1fr] md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent text-font">Profile</p>
            <Text className="max-w-3xl text-pretty">{text}</Text>
        </div>
    </Section>
);

export default TextSection;
