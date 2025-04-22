import HomeSection from "../shared/HomeSection";

interface AboutProps {
    heading: string;
    about: string;
}

const About: React.FC<AboutProps> = ({heading, about}) => <HomeSection heading={heading}>
    <p className="text text-center">{about}</p>
</HomeSection>;

export default About;