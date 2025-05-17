import { Image } from './image';
import { Relevance } from './relevance';

export interface Certification {
    title: string;
    badge: Image;
    verificationUrl: string;
    issuer: string;
    date: Date;
    relevance: Relevance;
}
