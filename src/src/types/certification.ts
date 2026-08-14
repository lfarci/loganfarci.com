import { Image } from "./image";
import { ISODateString } from "./iso-date";

export interface Certification {
    title: string;
    image: Image;
    url: string;
    issuer: string;
    date: ISODateString;
    relevance: "High" | "Medium" | "Low";
    order: number;
}
