import Section from "../shared/Section";
import ThumbnailCard, { ThumbnailCardProps } from "../shared/cards/ThumbnailCard";

export type IconType = "gear" | "cloud" | "infinity" | "robot";

type ThumbnailGridSectionProps = {
  heading: string;
  thumbnails: ThumbnailCardProps[];
}

const ThumbnailsGridSection: React.FC<ThumbnailGridSectionProps> = ({ heading, thumbnails }) => <Section heading={heading}>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
    {thumbnails.map((interest, index) => 
      <ThumbnailCard 
        key={index} 
        title={interest.title} 
        description={interest.description}
        size="small"
        image={interest.image}
      />
    )}
  </div>
</Section>;

export default ThumbnailsGridSection;