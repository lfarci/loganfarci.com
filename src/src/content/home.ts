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

const image: Image = { src: "/images/avatar.avif", alt: "Picture of the author: Logan Farci", width: 512, height: 512 };

const contacts = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/lfarci/" },
    { name: "GitHub", url: "https://github.com/lfarci" },
    { name: "Bluesky", url: "https://bsky.app/profile/lfarci.bsky.social" },
    { name: "Email", url: "mailto:logan.farci@outlook.be" },
];

export const content = {
    introduction: introduction,
    about: about,
    image: image,
    contacts: contacts,
    bachelor: bachelor,
};
