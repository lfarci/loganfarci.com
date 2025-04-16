import Introduction from "@/components/home/Introduction";

const heading = "Hi 👋, I'm Logan Farci";
const introduction = "Welcome on my personal website! I'm a Passionate and results-driven Software Engineer specializing in Microsoft technologies, with a focus on C#, .NET, Visual Studio, and Azure. With three years of hands-on experience in the public, banking, and energy sectors in Belgium, I've demonstrated expertise in crafting robust solutions and driving digital innovation.";

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

export default function Home() {
  return <Introduction heading={heading} introduction={introduction} image={image} contacts={contacts}/>;
}