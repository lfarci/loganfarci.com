export interface Certification {
    title: string;
    issuer: string;
    date: string;
    image: { src: string; alt: string; width: number; height: number };
    url: string;
    relevance: "High" | "Medium" | "Low";
    order: number;
}

export interface DiscoveredCredential {
    title: string;
    issuer: string;
    date?: string;
    imageUrl?: string;
    url: string;
}

export interface CredentialSources {
    microsoftLearn: string;
    credly: string;
}

export interface StructuredCredential {
    name?: string;
    title?: string;
    issuer?: string | { name?: string };
    issuedOn?: string;
    issueDate?: string;
    date?: string;
    dateIssued?: string;
    datePublished?: string;
    image?: string | { url?: string };
    imageUrl?: string;
    badge?: { imageUrl?: string };
    "@graph"?: StructuredCredential[];
}
