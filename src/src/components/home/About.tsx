import Section from "../shared/Section";

interface AboutProps {
    heading: string;
    about: string;
}

const About: React.FC<AboutProps> = ({heading, about}) => <Section heading={heading}>
    <p className="text">{about}</p>
</Section>;

export default About;