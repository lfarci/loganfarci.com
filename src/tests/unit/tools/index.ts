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

export const mockAzureIcon: Icon = { id: "azure", name: "Azure", icon: "/images/azure.svg" };
export const mockReactIcon: Icon = { id: "react", name: "React", icon: "/images/react.svg" };

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

// Mutable stores read by vi.mock factories (captured by reference so updates are visible lazily)
let _certifications: Certification[] = [mockCertification];
let _experiences: Experience[] = [mockExperience];
let _skills: SkillCategory[] = [mockSkillCategory];
let _icons: Icon[] = [mockAzureIcon, mockReactIcon];
let _interests: Interest[] = [mockInterest];
let _contacts: Contact[] = [mockContact];
let _profile: Profile = mockProfile;
let _diploma: Diploma = mockDiploma;

export function mockCertificationsData(items: Certification[] = [mockCertification]) {
    _certifications = items;
    vi.mock("@content/data/certifications.json", () => ({ default: _certifications }));
}

export function mockExperiencesData(items: Experience[] = [mockExperience]) {
    _experiences = items;
    vi.mock("@content/data/experiences.json", () => ({ default: _experiences }));
}

export function mockSkillsData(items: SkillCategory[] = [mockSkillCategory]) {
    _skills = items;
    vi.mock("@content/data/skills.json", () => ({ default: _skills }));
}

export function mockIconsData(items: Icon[] = [mockAzureIcon, mockReactIcon]) {
    _icons = items;
    vi.mock("@content/data/icons.json", () => ({ default: _icons }));
}

export function mockInterestsData(items: Interest[] = [mockInterest]) {
    _interests = items;
    vi.mock("@content/data/interests.json", () => ({ default: _interests }));
}

export function mockContactsData(items: Contact[] = [mockContact]) {
    _contacts = items;
    vi.mock("@content/data/contacts.json", () => ({ default: _contacts }));
}

export function mockProfileData(value: Profile = mockProfile) {
    _profile = value;
    vi.mock("@content/data/profile.json", () => ({ default: _profile }));
}

export function mockDiplomaData(value: Diploma = mockDiploma) {
    _diploma = value;
    vi.mock("@content/data/education.json", () => ({ default: _diploma }));
}
