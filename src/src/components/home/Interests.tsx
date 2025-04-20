import HomeSection from "../shared/HomeSection";
import Icon from "../shared/Icon";

export type IconType = "gear" | "cloud" | "infinity" | "robot";

interface InterestCardProps {
  icon: IconType;
  title: string;
  description: string;
}

interface InterestsProps {
  heading: string;
  interests: InterestCardProps[];
}

const InterestCard: React.FC<InterestCardProps> = ({ icon, title, description }) => {
  return <div className="p-4 border rounded-xl shadow-md bg-white flex items-center flex-col">
    <Icon src={`/icons/${icon}.png`} alt={icon} />
    <div className="flex flex-col items-center mt-6">
      <h3 className="text-xl font-bold text-gray-500 heading-font">{title}</h3>
      <p className="text-center text mt-4">{description}</p>
    </div>
  </div>;
}

const Interests: React.FC<InterestsProps> = ({ heading, interests }) => <HomeSection heading={heading}>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
    {interests.map((interest, index) => <InterestCard key={index} icon={interest.icon} title={interest.title} description={interest.description} />)}
  </div>
</HomeSection>;


export default Interests;