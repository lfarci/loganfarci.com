import { Company } from "./company";

export type Experience = {
    name: string;
    company: Company;
    start: Date;
    end?: Date;
    type?: "Full-Time" | "Part-Time" | "Internship" | "Freelance";
    description?: string;
};