import { IconType } from "@/components/home/Interests";

const heading = "Hi 👋, I'm Logan";
const introduction = "I'm a passionate and results-driven Software Engineer specializing in Microsoft technologies, with a focus on C#, .NET, Visual Studio, and Azure. With over three years of hands-on experience in the public, banking, and energy sectors across Belgium, I design and build robust, scalable solutions that drive digital transformation.";

const image = {
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

export const content = {
    heading: heading,
    introduction: introduction,
    image: image,
    contacts: contacts,
    interests: interests
};