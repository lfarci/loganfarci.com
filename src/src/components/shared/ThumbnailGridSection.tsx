import { Link } from "react-router";
import Section from "./Section";
import { CardGrid, MediaTileCard } from "@/components/cards";
import NewTabLink from "./NewTabLink";
import { ImageProps } from "@/types";
import type { MediaTileSize } from "@/components/cards/MediaTileCard";

interface ThumbnailItem {
    title: string;
    description?: string;
    image: ImageProps;
    url?: string;
    redirectPath?: string;
}

interface ThumbnailGridSectionProps {
    heading: string;
    label?: string;
    items: ThumbnailItem[];
    columns?: number;
    size?: MediaTileSize;
    redirectPath?: string;
    redirectLabel?: string;
}

const ThumbnailGridSection: React.FC<ThumbnailGridSectionProps> = ({
    heading,
    label,
    items,
    columns = 3,
    size: thumbnailSize = "medium",
    redirectPath,
    redirectLabel,
}) => (
    <Section heading={heading} label={label} redirectPath={redirectPath} redirectLabel={redirectLabel}>
        <CardGrid columns={columns} className="mt-8">
            {items.map((item, index) => {
                const card = (
                    <MediaTileCard
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        size={thumbnailSize}
                    />
                );

                if (item.redirectPath) {
                    return (
                        <Link
                            key={index}
                            to={item.redirectPath}
                            className="block h-full rounded-2xl transition-transform duration-300 ease-brand hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            {card}
                        </Link>
                    );
                }

                return item.url ? (
                    <NewTabLink key={index} url={item.url} display="block" className="h-full rounded-2xl">
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
