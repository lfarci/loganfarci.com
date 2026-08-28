import React from "react";
import { Heading1 } from "@/components/shared/typography";

interface GreetingHeadingProps {
    greeting?: string;
    name: string;
}

const GreetingHeading: React.FC<GreetingHeadingProps> = ({ greeting = "Hi", name }) => (
    <Heading1>{`${greeting}, I’m ${name}.`}</Heading1>
);

export default GreetingHeading;
