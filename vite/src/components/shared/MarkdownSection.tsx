import Section from "@/components/shared/Section";
import MarkdownContent from "@/components/shared/MarkdownContent";

interface MarkdownSectionProps {
    heading: string;
    content: string;
    redirectPath?: string;
    redirectLabel?: string;
    imageSrc?: string;
    imageAlt?: string;
}

const MarkdownSection: React.FC<MarkdownSectionProps> = ({
    heading,
    content,
    redirectPath,
    redirectLabel,
    imageSrc,
    imageAlt = "",
}) => (
    <Section heading={heading} redirectPath={redirectPath} redirectLabel={redirectLabel}>
        <div className="text-justify">
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    width={300}
                    height={300}
                    className="block mx-auto mb-6 rounded-lg md:float-right md:ml-8 md:mb-6 md:mt-0"
                />
            )}
            <MarkdownContent content={content} />
        </div>
    </Section>
);

export default MarkdownSection;
