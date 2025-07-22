import { Certification } from "@/types/certification";
import { resolveDirectoryFromEnvironment } from "./environment";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Experience, SkillCategory, Interest } from "@/types";

/**
 * Returns the path to the data directory based on the environment variable or a default value.
 * @returns {string} The path to the data directory.
 */
const getDataDirectoryPath = (): string => {
    return resolveDirectoryFromEnvironment("DATA_DIRECTORY", "content/data");
};

/**
 * Generic function to read and parse a JSON file from the data directory.
 * @param fileName Name of the JSON file (e.g., "certifications.json")
 * @returns Parsed data of type T[] or an empty array if file does not exist.
 */
const getDataFromJsonFile = <T>(fileName: string, encoding: BufferEncoding = "utf8"): T[] => {
    const dataDirectory = getDataDirectoryPath();
    const filePath = join(dataDirectory, fileName);

    if (!existsSync(filePath)) {
        return [];
    }

    const fileData = readFileSync(filePath, encoding);
    return JSON.parse(fileData) as T[];
};

/**
 * Retrieves certifications from the JSON file.
 * @returns {Certification[]} Array of certifications.
 */
export const getCertifications = (): Certification[] => getDataFromJsonFile<Certification>("certifications.json");

/**
 * Retrieves experiences from the JSON file.
 * @returns {Experience[]} Array of experiences.
 */
export const getExperiences = (): Experience[] => getDataFromJsonFile<Experience>("experiences.json");

/**
 * Retrieves skill categories from the JSON file.
 * @returns {SkillCategory[]} Array of skill categories.
 */
export const getSkillCategories = (): SkillCategory[] => getDataFromJsonFile<SkillCategory>("skills.json");

/**
 * Retrieves interests from the JSON file.
 * @returns {Interest[]} Array of interests.
 */
export const getInterests = (): Interest[] => getDataFromJsonFile<Interest>("interests.json");
