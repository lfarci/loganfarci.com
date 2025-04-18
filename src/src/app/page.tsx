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

const interests = [
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

import Image from "next/image";
import React from "react";

interface IconProps {
  src: string;
  alt: string;
}

const Icon: React.FC<IconProps> = ({ src, alt }) => <Image
  src={src}
  alt={alt}
  width={512}
  height={512}
  className="w-1/6"
/>;

type IconType = "gear" | "cloud" | "infinity" | "robot";

interface InterestCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const InterestCard: React.FC<InterestCardProps> = ({ icon, title, description }) => {
  return <div className="p-4 border rounded shadow-md bg-white flex items-center flex-col">
    <Icon src={`/icons/${icon}.png`} alt={icon} />
    <div className="flex flex-col items-center mt-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-center mt-4 ">{description}</p>
    </div>
  </div>;
}

export default function Home() {
  return <div className="flex flex-col space-y-4">
    <Introduction heading={heading} introduction={introduction} image={image} contacts={contacts} />

    <h2 className="text-2xl pt-8 font-bold">What I Do</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {interests.map((interest) => (
        <InterestCard key={interest.title} icon={interest.icon as IconType} title={interest.title} description={interest.description} />
      ))}
    </div>
  </div>;
}