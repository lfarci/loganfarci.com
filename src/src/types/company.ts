import { Image } from "./image";

export interface Company {
  name: string;
  logo?: Image;
  website: string;
  location: string;
}
