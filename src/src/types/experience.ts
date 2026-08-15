import { Company } from "./company";
import { ISODateString } from "./date";

export interface Experience {
    name: string;
    company: Company;
    start: ISODateString;
    end?: ISODateString;
    type?: "Full-Time" | "Part-Time" | "Internship" | "Freelance";
    summary: string;
    achievements: string[];
}
