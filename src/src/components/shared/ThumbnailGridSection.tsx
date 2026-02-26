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
    items: ThumbnailItem[];
    columns?: number;
    size?: MediaTileSize;
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
                    <MediaTileCard
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        size={thumbnailSize}
                    />
                );

                if (item.redirectPath) {
                    return (
                        <Link key={index} to={item.redirectPath} className="transition-opacity hover:opacity-80">
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
