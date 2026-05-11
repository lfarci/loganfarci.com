import NewTabLink from "@/components/shared/NewTabLink";
import Section from "@/components/shared/Section";
import { Footnote, Heading3 } from "@/components/shared/typography";
import type { Certification } from "@/types";

interface CertificationShowcaseProps {
    heading: string;
    certifications: Certification[];
    redirectPath?: string;
    redirectLabel?: string;
}

const CertificationShowcase: React.FC<CertificationShowcaseProps> = ({
    heading,
    certifications,
    redirectPath,
    redirectLabel,
}) => (
    <Section heading={heading} redirectPath={redirectPath} redirectLabel={redirectLabel}>
        <div className="overflow-hidden rounded-2xl border border-border-light bg-surface shadow-sm">
            <div className="grid divide-y divide-border-light md:grid-cols-3 md:divide-x md:divide-y-0">
                {certifications.map((certification) => (
                    <NewTabLink key={certification.title} url={certification.url} className="h-full w-full">
                        <article className="flex h-full items-center gap-4 p-5 transition-colors hover:bg-surface-hover/70 md:p-6">
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-surface-elevated p-2 ring-1 ring-border-light">
                                <img
                                    src={certification.image.src}
                                    alt={certification.image.alt}
                                    width={certification.image.width}
                                    height={certification.image.height}
                                    className="max-h-12 object-contain"
                                />
                            </div>
                            <div className="min-w-0">
                                <Heading3 className="text-lg md:text-xl">{certification.title}</Heading3>
                                <Footnote>{certification.issuer}</Footnote>
                            </div>
                        </article>
                    </NewTabLink>
                ))}
            </div>
        </div>
    </Section>
);

export default CertificationShowcase;
