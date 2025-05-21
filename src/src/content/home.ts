import { IconType } from "@/components/home/Interests";
import certifications from "./certifications";

const introduction = "Azure Associate Developer delivering cloud-native solutions that scale.";
const about = "I'm a Software Engineer with a passion for building scalable, cloud-native solutions using C#, .NET, and Azure. With over three years of experience across Belgium’s public, banking, and energy sectors, I focus on creating clean, reliable systems that drive real impact.";

interface Image {
    src: string;
    alt: string;
    width: number;
    height: number;
};

const image: Image = {
    src: "/avatar.png",
    alt: "Picture of the author: Logan Farci",
    width: 1024,
    height: 1024,
};

const contacts = [
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/lfarci/",
    },
    {
        name: "GitHub",
        url: "https://github.com/lfarci"
    },
    {
        name: "Bluesky",
        url: "https://bsky.app/profile/lfarci.bsky.social",
    },
    {
        name: "Email",
        url: "mailto:logan.farci@outlook.be",
    }
];

export interface Interest {
    title: string;
    icon: IconType;
    description: string;
}

const interests: Interest[] = [
    {
        title: "Backend Development",
        icon: "gear",
        description: "Building robust and scalable backend systems using C#, .NET, and Azure."
    },
    {
        title: "Cloud Computing",
        icon: "cloud",
        description: "Leveraging the power of Azure to deliver scalable and efficient solutions."
    },
    {
        title: "DevOps",
        icon: "infinity",
        description: "Implementing CI/CD pipelines and automating workflows to enhance development efficiency."
    },
    {
        title: "Artificial Intelligence",
        icon: "robot",
        description: "Exploring machine learning models and AI-driven solutions to solve complex problems."
    }
];

interface Diploma {
    name: string;
    University: string;
    logo: {
        src: string;
        alt: string;
        width: number;
        height: number;
    };
    details: string[];
}

const bachelor: Diploma = {
    name: "Bachelor in Computer Science",
    University: "École Supérieure d'Informatique (ÉSI)",
    logo: {
        src: "/credentials/esi.png",
        alt: "ESI Logo",
        width: 200,
        height: 200
    },
    details: ["Brussels, Belgium", "2017 – 2020"]
};

export const content = {
    introduction: introduction,
    about: about,
    image: image,
    contacts: contacts,
    interests: interests,
    credentials: certifications,
    bachelor: bachelor
};