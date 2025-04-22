import HomeSection from "../shared/HomeSection";
import Card from "../shared/Card";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface CredentialCardProps {
  title: string;
  description?: string;
  badge: ImageProps;
}

interface InterestsProps {
  heading: string;
  credentials: CredentialCardProps[];
}

const Credentials: React.FC<InterestsProps> = ({ heading, credentials }) => <HomeSection heading={heading}>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
    {credentials.map((credential, index) => (
      <Card key={index} image={credential.badge} title={credential.title} />
    ))}
  </div>
</HomeSection>;

export default Credentials;