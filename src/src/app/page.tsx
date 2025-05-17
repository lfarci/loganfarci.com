import Introduction from "@/components/home/Introduction";
import { content } from "../content/home";
import React from "react";
import Interests from "@/components/home/Interests";
import About from "@/components/home/About";
import Credentials from "@/components/home/Credentials";
import { Relevance } from "@/content/types";

export default function Home() {
  const certifications = content.credentials.filter(c => c.relevance == Relevance.High);

  return <div className="flex flex-col space-y-4">
    <Introduction introduction={content.introduction} image={content.image} contacts={content.contacts} />
    <About heading="About Me" about={content.about} />
    <Interests heading="What I Do" interests={content.interests} />
    <Credentials heading="My Certifications" credentials={certifications} />
  </div>;
}