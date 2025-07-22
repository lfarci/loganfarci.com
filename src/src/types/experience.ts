import { Company } from "./company";

export interface Experience {
  name: string;
  company: Company;
  start: Date;
  end?: Date;
  type?: "Full-Time" | "Part-Time" | "Internship" | "Freelance";
  description?: string;
}
