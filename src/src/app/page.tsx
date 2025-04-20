import Introduction from "@/components/home/Introduction";
import { content } from "./content";
import React from "react";
import Interests from "@/components/home/Interests";
import About from "@/components/home/About";

export default function Home() {
  return <div className="flex flex-col space-y-4">
    <Introduction heading={content.heading} introduction={content.introduction} image={content.image} contacts={content.contacts} />
    <About heading="About Me" about={content.about} />
    <Interests heading="What I Do" interests={content.interests} />
  </div>;
}