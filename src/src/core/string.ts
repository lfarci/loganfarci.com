/**
 * Creates a URL-safe ID from a string by converting to lowercase and replacing spaces with hyphens.
 * @param text The text to convert to an ID
 * @returns A URL-safe ID string
 */
export const createId = (text: string): string => {
    return text.toLowerCase().replace(/\s+/g, "-");
};