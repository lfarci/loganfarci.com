import { Image } from "@/types/image";

export interface Interest {
    title: string;
    image: Image;
    description: string;
    internalPath?: string;
}
