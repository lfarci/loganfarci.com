import path from "path";

/**
 * Resolves a relative path to an absolute path based on the current working directory.
 * @param relativePath The relative path to resolve.
 * @returns The absolute path resolved from the current working directory.
 */
const buildPathRelativeToCwd = (relativePath: string): string => {
    return path.resolve(process.cwd(), relativePath);
};

/**
 * Returns the absolute path for a given directory path.
 * If the input is already absolute, returns it as is; otherwise, resolves it relative to the current working directory.
 * @param directoryPath The directory path to resolve (absolute or relative).
 * @returns The absolute directory path.
 */
const getAbsolutePath = (directoryPath: string): string => {
    if (path.isAbsolute(directoryPath)) {
        return directoryPath;
    }
    return buildPathRelativeToCwd(directoryPath);
};

/**
 * Resolves a directory path from an environment variable and returns its absolute path.
 * If the environment variable is not set or empty, returns undefined.
 * @param variableName The name of the environment variable to read.
 * @returns The resolved absolute directory path, or undefined if not set.
 */
const attemptToResolveDirectoryFromEnvironment = (variableName: string): string | undefined => {
    const environmentVariableValue = process.env[variableName];
    let directoryPath = undefined;

    if (environmentVariableValue) {
        directoryPath = environmentVariableValue.trim();
    }

    if (directoryPath && directoryPath.length > 0) {
        directoryPath = getAbsolutePath(directoryPath);
    }

    return directoryPath;
};

/**
 * Resolves a directory path from an environment variable, or falls back to a default path if not set.
 * Always returns the absolute path, ensuring the result is suitable for file system operations.
 * Useful for configurable directory locations with a reliable fallback.
 *
 * @param variableName The name of the environment variable to check for a directory path.
 * @param defaultPath The default path to use if the environment variable is not set or empty.
 * @returns The resolved absolute directory path.
 */
export const resolveDirectoryFromEnvironment = (variableName: string, defaultPath: string): string => {
    const directoryPath = attemptToResolveDirectoryFromEnvironment(variableName);

    if (!directoryPath) {
        return buildPathRelativeToCwd(defaultPath);
    }

    return directoryPath;
};
