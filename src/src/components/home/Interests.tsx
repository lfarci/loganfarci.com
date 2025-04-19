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
        <p className="text-center mt-4 text-gray-400">{description}</p>
    </div>
  </div>;
}

const Interests: React.FC<InterestsProps> = ({ heading, interests }) => <div className="pt-16">
    <h2 className="text-3xl font-bold text-center heading-font">{heading}</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
    {interests.map((interest: InterestCardProps) => (
        <InterestCard key={interest.title} icon={interest.icon as IconType} title={interest.title} description={interest.description} />
    ))}
    </div>
</div>;
    

export default Interests;