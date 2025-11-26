import fs from "fs";
import path from "path";

/**
 * Recursively lists all files in a directory with the given extension.
 * @param dir The directory to search in (absolute or relative to project root)
 * @param extension The file extension to filter by (e.g. '.ts', '.json')
 * @returns Array of absolute file paths matching the extension
 */
export const listFilesWithExtension = (dir: string, extension: string): string[] => {
    let results: string[] = [];
    try {
        if (!fs.existsSync(dir)) {
            console.error(`Directory does not exist: ${dir}`);
            return results;
        }
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                results = results.concat(listFilesWithExtension(fullPath, extension));
            } else if (entry.isFile() && fullPath.endsWith(extension)) {
                results.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }
    return results;
};
