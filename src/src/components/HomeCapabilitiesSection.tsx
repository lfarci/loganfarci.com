import { Link } from "react-router";
import Section from "@/components/shared/Section";
import { Heading3, Text } from "@/components/shared/typography";
import type { ImageProps } from "@/types";

interface CapabilityItem {
    title: string;
    description?: string;
    image: ImageProps;
    redirectPath?: string;
}

interface HomeCapabilitiesSectionProps {
    heading: string;
    items: CapabilityItem[];
    redirectPath?: string;
    redirectLabel?: string;
}

const HomeCapabilitiesSection: React.FC<HomeCapabilitiesSectionProps> = ({
    heading,
    items,
    redirectPath,
    redirectLabel,
}) => (
    <Section heading={heading} redirectPath={redirectPath} redirectLabel={redirectLabel}>
        <div className="grid gap-4 md:grid-cols-2">
            {items.map((item, index) => {
                const content = (
                    <article className="group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-border-light bg-surface p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                        <div className="absolute right-5 top-4 text-6xl font-bold leading-none text-primary/10 heading-font">
                            {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="relative flex items-start justify-between gap-4">
                            <div className="flex size-16 items-center justify-center rounded-2xl border border-border-light bg-surface-elevated">
                                <img
                                    src={item.image.src}
                                    alt={item.image.alt}
                                    width={item.image.width}
                                    height={item.image.height}
                                    className="size-10 object-contain"
                                />
                            </div>
                        </div>
                        <div className="relative mt-8 space-y-3">
                            <Heading3 className="text-text-primary">{item.title}</Heading3>
                            {item.description && <Text className="text-base md:text-base">{item.description}</Text>}
                        </div>
                    </article>
                );

                return item.redirectPath ? (
                    <Link
                        key={item.title}
                        to={item.redirectPath}
                        className="rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        {content}
                    </Link>
                ) : (
                    <div key={item.title}>{content}</div>
                );
            })}
        </div>
    </Section>
);

export default HomeCapabilitiesSection;
