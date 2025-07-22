import { Certification } from "@/types/certification";
import { resolveDirectoryFromEnvironment } from "./environment";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Experience, SkillCategory, Interest, Contact, Profile, Diploma } from "@/types";

/**
 * Returns the path to the data directory based on the environment variable or a default value.
 * @returns {string} The path to the data directory.
 */
const getDataDirectoryPath = (): string => {
    return resolveDirectoryFromEnvironment("DATA_DIRECTORY", "content/data");
};

/**
 * Generic function to read and parse JSON data (object or array) from the data directory.
 * @param fileName Name of the JSON file (e.g., "profile.json")
 * @returns Parsed JSON data of type T.
 */
const getObjectFromJsonFile = <T>(fileName: string, encoding: BufferEncoding = "utf8"): T => {
    const dataDirectory = getDataDirectoryPath();
    const filePath = join(dataDirectory, fileName);

    if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const fileData = readFileSync(filePath, encoding);
    return JSON.parse(fileData) as T;
};

/**
 * Retrieves certifications from the JSON file.
 * @returns {Certification[]} Array of certifications.
 */
export const getCertifications = (): Certification[] => getObjectFromJsonFile<Certification[]>("certifications.json");

/**
 * Retrieves experiences from the JSON file.
 * @returns {Experience[]} Array of experiences.
 */
export const getExperiences = (): Experience[] => getObjectFromJsonFile<Experience[]>("experiences.json");

/**
 * Retrieves skill categories from the JSON file.
 * @returns {SkillCategory[]} Array of skill categories.
 */
export const getSkillCategories = (): SkillCategory[] => getObjectFromJsonFile<SkillCategory[]>("skills.json");

/**
 * Retrieves interests from the JSON file.
 * @returns {Interest[]} Array of interests.
 */
export const getInterests = (): Interest[] => getObjectFromJsonFile<Interest[]>("interests.json");

/**
 * Retrieves contacts from the JSON file.
 * @returns {Contact[]} Array of contacts.
 */
export const getContacts = (): Contact[] => getObjectFromJsonFile<Contact[]>("contacts.json");

/**
 * Retrieves the profile data from the JSON file.
 * @returns {Profile} The profile data.
 */
export const getProfile = (): Profile => getObjectFromJsonFile<Profile>("profile.json");

/**
 * Retrieves the diploma data from the JSON file.
 * @returns {Diploma} The diploma data.
 */
export const getDiploma = (): Diploma => getObjectFromJsonFile<Diploma>("education.json");
