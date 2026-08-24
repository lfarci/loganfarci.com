import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function loadSources(root) {
    const sourcePath = join(root, "content", "data", "certification-sources.json");
    const sources = JSON.parse(await readFile(sourcePath, "utf8"));

    return { microsoftLearn: sources.microsoftLearn ?? [], credly: sources.credly ?? [] };
}
