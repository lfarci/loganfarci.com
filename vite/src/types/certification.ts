import { Image } from "./image";

export interface Certification {
    title: string;
    image: Image;
    url: string;
    issuer: string;
    date: Date;
    relevance: "High" | "Medium" | "Low";
    order: number;
}
