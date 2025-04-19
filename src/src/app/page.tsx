import Introduction from "@/components/home/Introduction";
import { content } from "./content";
import React from "react";
import Interests from "@/components/home/Interests";

export default function Home() {
  return <div className="flex flex-col space-y-4">
    <Introduction heading={content.heading} introduction={content.introduction} image={content.image} contacts={content.contacts} />
    <Interests heading="What I Do" interests={content.interests} />
  </div>;
}