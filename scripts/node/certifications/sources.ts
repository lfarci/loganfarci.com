import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CredentialSources } from "./types.js";

export async function loadSources(root: string): Promise<CredentialSources> {
    const sourcePath = join(root, "content", "data", "certification-sources.json");
    const sources = JSON.parse(await readFile(sourcePath, "utf8")) as Partial<CredentialSources>;

    return { microsoftLearn: sources.microsoftLearn ?? [], credly: sources.credly ?? [] };
}
