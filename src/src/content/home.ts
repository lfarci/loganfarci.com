import certifications from "./certifications";
import bachelor from "./education";

const introduction = "Azure Associate Developer delivering cloud-native solutions that scale.";
const about =
    "I'm a Software Engineer with a passion for building scalable, cloud-native solutions using C#, .NET, and Azure. With over three years of experience across Belgium’s public, banking, and energy sectors, I focus on creating clean, reliable systems that drive real impact.";

interface Image {
    src: string;
    alt: string;
    width: number;
    height: number;
}

const image: Image = { src: "/avatar.png", alt: "Picture of the author: Logan Farci", width: 1024, height: 1024 };

const contacts = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/lfarci/" },
    { name: "GitHub", url: "https://github.com/lfarci" },
    { name: "Bluesky", url: "https://bsky.app/profile/lfarci.bsky.social" },
    { name: "Email", url: "mailto:logan.farci@outlook.be" },
];

export interface Interest {
    title: string;
    image: Image;
    description: string;
}

const interests: Interest[] = [
    {
        title: "Backend Development",
        description: "Building robust and scalable backend systems using C#, .NET, and Azure.",
        image: { src: "/icons/gear.png", alt: "Gear icon", width: 64, height: 64 },
    },
    {
        title: "Cloud Computing",
        description: "Leveraging the power of Azure to deliver scalable and efficient solutions.",
        image: { src: "/icons/cloud.png", alt: "Cloud icon", width: 64, height: 64 },
    },
    {
        title: "DevOps",
        description: "Implementing CI/CD pipelines and automating workflows to enhance development efficiency.",
        image: { src: "/icons/infinity.png", alt: "Infinity icon", width: 64, height: 64 },
    },
    {
        title: "Artificial Intelligence",
        description: "Exploring machine learning models and AI-driven solutions to solve complex problems.",
        image: { src: "/icons/robot.png", alt: "Robot icon", width: 64, height: 64 },
    },
];

export const content = {
    introduction: introduction,
    about: about,
    image: image,
    contacts: contacts,
    interests: interests,
    credentials: certifications,
    bachelor: bachelor,
};
