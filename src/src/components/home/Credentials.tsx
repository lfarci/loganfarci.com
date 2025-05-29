import Section from "../shared/Section";
import ThumbnailCard from "../shared/cards/ThumbnailCard";
import NewTabLink from "../shared/NewTabLink";

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
  verificationUrl: string;
}

interface InterestsProps {
  heading: string;
  credentials: CredentialCardProps[];
}

const Credentials: React.FC<InterestsProps> = ({ heading, credentials }) => <Section heading={heading} redirectPath="/about" redirectLabel="See all my certifications on the About page">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
    {credentials.map((credential, index) => (
      <NewTabLink key={index} url={credential.verificationUrl}>
        <ThumbnailCard image={credential.badge} title={credential.title} />
      </NewTabLink>
    ))}
  </div>
</Section>;

export default Credentials;