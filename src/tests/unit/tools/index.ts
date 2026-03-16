import { vi } from "vitest";
import type { Certification, Experience, SkillCategory, Icon, Interest, Contact, Profile, Diploma } from "@/types";

export const mockCertification: Certification = {
    title: "Test Cert",
    image: { src: "/cert.png", alt: "cert" },
    url: "https://example.com",
    issuer: "Issuer",
    date: "2024-01-01",
    relevance: "High",
    order: 1,
};

export const mockExperience: Experience = {
    name: "Software Engineer",
    company: { name: "Acme", url: "https://acme.com" },
    start: "2022-01-01",
};

export const mockSkillCategory: SkillCategory = {
    name: "Frontend",
    skills: [{ name: "TypeScript" }, { name: "React" }],
};

export const mockIcon: Icon = { id: "azure", name: "Azure", icon: "/images/azure.svg" };
export const mockIcon2: Icon = { id: "react", name: "React", icon: "/images/react.svg" };

export const mockInterest: Interest = {
    title: "Open Source",
    image: { src: "/oss.png", alt: "oss" },
    description: "Contributing to OSS",
};

export const mockContact: Contact = {
    name: "GitHub",
    icon: "/github.svg",
    url: "https://github.com/test",
};

export const mockProfile: Profile = {
    role: "Developer",
    introduction: "Hi",
    description: "A developer",
    avatar: { src: "/avatar.png", alt: "avatar" },
};

export const mockDiploma: Diploma = {
    name: "Master CS",
    University: "Test University",
    logo: { src: "/logo.png", alt: "logo" },
    details: ["Detail 1"],
    description: "A degree",
};

export function mockCertificationsData() {
    vi.mock("@content/data/certifications.json", () => ({ default: [mockCertification] }));
}

export function mockExperiencesData() {
    vi.mock("@content/data/experiences.json", () => ({ default: [mockExperience] }));
}

export function mockSkillsData() {
    vi.mock("@content/data/skills.json", () => ({ default: [mockSkillCategory] }));
}

export function mockIconsData() {
    vi.mock("@content/data/icons.json", () => ({ default: [mockIcon, mockIcon2] }));
}

export function mockInterestsData() {
    vi.mock("@content/data/interests.json", () => ({ default: [mockInterest] }));
}

export function mockContactsData() {
    vi.mock("@content/data/contacts.json", () => ({ default: [mockContact] }));
}

export function mockProfileData() {
    vi.mock("@content/data/profile.json", () => ({ default: mockProfile }));
}

export function mockDiplomaData() {
    vi.mock("@content/data/education.json", () => ({ default: mockDiploma }));
}
