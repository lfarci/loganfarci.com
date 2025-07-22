import { Image } from "./image";
import { Relevance } from "./relevance";

export interface Certification {
    title: string;
    image: Image;
    url: string;
    issuer: string;
    date: Date;
    relevance: Relevance;
}
