import Introduction from "@/components/home/Introduction";

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

import Image from "next/image";

interface IconProps {
  src: string;
  alt: string;
}

const Icon: React.FC<IconProps> = ({ src, alt }) => (
  <Image 
    src={src}
    alt={alt}
    width={512}
    height={512}
    className="text-blue-500 w-full w-1/5"
  />
);

const CloudIcon = () => <Icon src="/icons/cloud.png" alt="Cloud icon" />;
const GearIcon = () => <Icon src="/icons/gear.png" alt="Gear icon" />;;
const InfinityIcon = () => <Icon src="/icons/infinity.png" alt="Infinity icon" />;;
const RobotIcon = () => <Icon src="/icons/robot.png" alt="Robot icon" />;

export default function Home() {
  return <div className="flex flex-col space-y-4">
    <Introduction heading={heading} introduction={introduction} image={image} contacts={contacts} />

    <h2 className="text-2xl pt-8">Things that drive me</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded shadow-md bg-white flex justify-center items-center flex-col">
        <GearIcon />
        <h3 className="text-lg font-bold">Backend Development</h3>
        <p className="text-gray-700 text-center">Building robust and scalable backend systems using C#, .NET, and Azure.</p>
      </div>

      <div className="p-4 border rounded shadow-md bg-white flex justify-center items-center flex-col">
        <CloudIcon />
        <h3 className="text-lg font-bold">Azure</h3>
        <p className="text-gray-700 text-center">Leveraging the power of Azure to deliver scalable and efficient solutions.</p>
      </div>

      <div className="p-4 border rounded shadow-md bg-white flex justify-center items-center flex-col">
        <InfinityIcon />
        <h3 className="text-lg font-bold">DevOps</h3>
        <p className="text-gray-700 text-center">Implementing CI/CD pipelines and automating workflows to enhance development efficiency.</p>
      </div>

      <div className="p-4 border rounded shadow-md bg-white flex justify-center items-center flex-col">
        <RobotIcon />
        <h3 className="text-lg font-bold">Artificial Intelligence</h3>
        <p className="text-gray-700 text-center">Exploring machine learning models and AI-driven solutions to solve complex problems.</p>
      </div>
    </div>
  </div>;
}