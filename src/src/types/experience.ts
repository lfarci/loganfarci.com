import { Company } from "./company";
import { ISODateString } from "./iso-date";

export interface Experience {
    name: string;
    company: Company;
    start: ISODateString;
    end?: ISODateString;
    type?: "Full-Time" | "Part-Time" | "Internship" | "Freelance";
    description?: string;
}
