import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readCredlyCredential } from "./credly.js";
import { downloadBadge } from "./image.js";
import { readMicrosoftLearnCredential } from "./microsoft-learn.js";
import { loadSources } from "./sources.js";
import { slugify } from "./shared.js";
import type { Certification, DiscoveredCredential } from "./types.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const dataPath = join(root, "content", "data", "certifications.json");
const warn = (message: string) => console.warn(`[certifications] ${message}`);

async function readCredentials(
    provider: string,
    urls: string[],
    readCredential: (url: string) => Promise<DiscoveredCredential | undefined>,
): Promise<DiscoveredCredential[]> {
    const credentials: DiscoveredCredential[] = [];

    for (const url of urls) {
        try {
            const credential = await readCredential(url);
            if (!credential?.title) warn(`${provider} metadata did not include a title: ${url}`);
            else credentials.push(credential);
        } catch (error) {
            warn(
                `${provider} source could not be read (${url}): ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    return credentials;
}

const existing = JSON.parse(await readFile(dataPath, "utf8")) as Certification[];
const sources = await loadSources(root);
const discovered = [
    ...(await readCredentials("Microsoft Learn", sources.microsoftLearn, readMicrosoftLearnCredential)),
    ...(await readCredentials("Credly", sources.credly, readCredlyCredential)),
];
const knownUrls = new Set(existing.map((certification) => certification.url));
const knownTitles = new Set(existing.map((certification) => certification.title));
let nextOrder = Math.max(-1, ...existing.map((certification) => certification.order)) + 1;
const additions: Certification[] = [];

for (const credential of discovered) {
    if (!credential.title || knownUrls.has(credential.url) || knownTitles.has(credential.title)) continue;

    try {
        const image = await downloadBadge(root, credential.imageUrl, slugify(credential.title));
        if (!image || !credential.date) {
            warn(`skipping ${credential.title}: missing date or badge image`);
            continue;
        }

        additions.push({
            title: credential.title,
            issuer: credential.issuer,
            date: credential.date,
            image: { src: image, alt: `${credential.title} badge`, width: 128, height: 128 },
            url: credential.url,
            relevance: "Medium",
            order: nextOrder++,
        });
    } catch (error) {
        warn(`skipping ${credential.title}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

if (additions.length === 0) {
    console.log("[certifications] no new certifications found");
} else {
    await writeFile(dataPath, `${JSON.stringify([...existing, ...additions], null, 2)}\n`);
    console.log(`[certifications] added ${additions.length} certification(s)`);
}
