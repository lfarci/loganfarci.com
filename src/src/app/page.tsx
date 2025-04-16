import Introduction from "@/components/home/Introduction";

const heading = "Hi 👋, I'm Logan Farci";
const introduction = "Welcome on my personal website! I'm a Passionate and results-driven Software Engineer specializing in Microsoft technologies, with a focus on C#, .NET, Visual Studio, and Azure. With three years of hands-on experience in the public, banking, and energy sectors in Belgium, I've demonstrated expertise in crafting robust solutions and driving digital innovation.";
const image = "/avatar.png";

export default function Home() {
  return <Introduction heading={heading} introduction={introduction} image={image} />;
}