import { Certification, Relevance } from "./types";

const imageSize = 140;

const certifications: Certification[] = [
    {
        title: "Azure Developer Associate",
        issuer: "Microsoft",
        date: new Date("2025-03-28"),
        image: {
            src: "/images/certifications/azure-developer-associate.png",
            alt: "Azure Developer Associate badge",
            width: imageSize,
            height: imageSize,
        },
        url: "https://learn.microsoft.com/api/credentials/share/en-us/avanade-logan-farci/982302979423E055?sharingId=C15D4BAF8E2D5DFD",
        relevance: Relevance.High,
    },
    {
        title: "Azure Fundamentals",
        issuer: "Microsoft",
        date: new Date("2022-07-08"),
        image: {
            src: "/images/certifications/azure-fundamentals.png",
            alt: "Azure Fundamentals badge",
            width: imageSize,
            height: imageSize,
        },
        url: "https://learn.microsoft.com/api/credentials/share/en-us/avanade-logan-farci/2C1C6B5085309683?sharingId=C15D4BAF8E2D5DFD",
        relevance: Relevance.Medium,
    },
    {
        title: "Professional Scrum Developer I",
        issuer: "Scrum.org",
        date: new Date("2024-07-22"),
        image: {
            src: "/images/certifications/professional-scrum-developer.png",
            alt: "Professional Scrum Developer I badge",
            width: imageSize,
            height: imageSize,
        },
        url: "https://www.credly.com/badges/50d97296-5c28-4dfa-96bf-f0imageSize23b7dccc/public_url",
        relevance: Relevance.High,
    },
    {
        title: "GitHub Foundations",
        issuer: "GitHub",
        date: new Date("2024-04-19"),
        image: {
            src: "/images/certifications/github-foundations.png",
            alt: "GitHub Foundations badge",
            width: imageSize,
            height: imageSize,
        },
        url: "https://www.credly.com/badges/3cfa4c4f-c20e-42d8-8514-05a43imageSizecdba0/public_url",
        relevance: Relevance.Low,
    },
    {
        title: "GitHub Actions",
        issuer: "GitHub",
        date: new Date("2024-05-31"),
        image: {
            src: "/images/certifications/github-actions.png",
            alt: "Green Software for Practitioners badge",
            width: imageSize,
            height: imageSize,
        },
        url: "https://www.credly.com/badges/e686950e-c4d2-4055-9e31-a2726743f1ff/public_url",
        relevance: Relevance.High,
    },
    {
        title: "GitHub Copilot",
        issuer: "GitHub",
        date: new Date("2024-08-07"),
        image: {
            src: "/images/certifications/github-copilot.png",
            alt: "GitHub Copilot badge",
            width: imageSize,
            height: imageSize,
        },
        url: "https://www.credly.com/badges/c2727308-8752-400a-afb9-b524cd804c67/public_url",
        relevance: Relevance.Medium,
    },
    {
        title: "Green Software for Practitioners",
        issuer: "The Linux Foundation",
        date: new Date("2023-03-20"),
        image: {
            src: "/images/certifications/green-software.png",
            alt: "GitHub Actions",
            width: imageSize,
            height: imageSize,
        },
        url: "https://www.credly.com/badges/2c74038b-d0d7-493c-85ab-1cc039545a20/public_url",
        relevance: Relevance.Low,
    },
];

export default certifications;
