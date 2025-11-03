import Section from "./Section";
import ThumbnailCard, { ThumbnailCardImageSize } from "./cards/ThumbnailCard";
import NewTabLink from "./NewTabLink";
import Link from "next/link";

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
    internalPath?: string;
}

interface ThumbnailGridSectionProps {
    heading: string;
    items: ThumbnailItem[];
    columns?: number;
    size?: ThumbnailCardImageSize;
    redirectPath?: string;
    redirectLabel?: string;
}

const getGridClasses = (columns: number): string => {
    const columnMap: Record<number, string> = {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
    };
    return columnMap[columns] || "grid-cols-1 sm:grid-cols-3";
};

const ThumbnailGridSection: React.FC<ThumbnailGridSectionProps> = ({
    heading,
    items,
    columns = 3,
    size: thumbnailSize = "medium",
    redirectPath,
    redirectLabel,
}) => (
    <Section heading={heading} redirectPath={redirectPath} redirectLabel={redirectLabel}>
        <div className={`grid ${getGridClasses(columns)} gap-4 mt-8`}>
            {items.map((item, index) => {
                const card = (
                    <ThumbnailCard
                        image={item.image}
                        size={thumbnailSize}
                        title={item.title}
                        description={item.description}
                    />
                );

                if (item.internalPath) {
                    return (
                        <Link key={index} href={item.internalPath} className="transition-opacity hover:opacity-80">
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
        </div>
    </Section>
);

export default ThumbnailGridSection;
