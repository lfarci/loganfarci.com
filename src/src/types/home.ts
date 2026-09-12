export interface HomeProofLink {
    label: string;
    detail: string;
    to: string;
}

export interface HomeContent {
    technologies: string[];
    proofLinks: HomeProofLink[];
}
