import Link from "next/link";
import Section from "./Section";
import { ThumbnailCard, ThumbnailCardImageSize, CardGrid } from "@/components/cards";
import NewTabLink from "./NewTabLink";

interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

interface ThumbnailItem {
    title: string;
    description?: string;
    image: ImageProps;
    url?: string;
    redirectPath?: string;
}

interface ThumbnailGridSectionProps {
    heading: string;
    items: ThumbnailItem[];
    columns?: number;
    size?: ThumbnailCardImageSize;
    redirectPath?: string;
    redirectLabel?: string;
}

const ThumbnailGridSection: React.FC<ThumbnailGridSectionProps> = ({
    heading,
    items,
    columns = 3,
    size: thumbnailSize = "medium",
    redirectPath,
    redirectLabel,
}) => (
    <Section heading={heading} redirectPath={redirectPath} redirectLabel={redirectLabel}>
        <CardGrid columns={columns} className="mt-8">
            {items.map((item, index) => {
                const card = (
                    <ThumbnailCard
                        image={item.image}
                        size={thumbnailSize}
                        title={item.title}
                        description={item.description}
                    />
                );

                if (item.redirectPath) {
                    return (
                        <Link key={index} href={item.redirectPath} className="transition-opacity hover:opacity-80">
                            {card}
                        </Link>
                    );
                }

                return item.url ? (
                    <NewTabLink key={index} url={item.url}>
                        {card}
                    </NewTabLink>
                ) : (
                    <div key={index}>{card}</div>
                );
            })}
        </CardGrid>
    </Section>
);

export default ThumbnailGridSection;
