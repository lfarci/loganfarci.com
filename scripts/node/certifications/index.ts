import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readCredlyProfile } from "./credly.js";
import { downloadBadge } from "./image.js";
import { readMicrosoftLearnProfile } from "./microsoft-learn.js";
import { loadSources } from "./sources.js";
import { slugify } from "./shared.js";
import type { Certification, DiscoveredCredential } from "./types.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const dataPath = join(root, "content", "data", "certifications.json");

function comparableTitle(title: string): string {
    return title
        .replace(/^Microsoft Certified:\s*/i, "")
        .replace(/^[a-z]+\d+:\s*/i, "")
        .replace(/\([^)]*\)/g, "")
        .replace(/[™®]/g, "")
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/gi, "")
        .toLowerCase();
}

function deduplicate(credentials: DiscoveredCredential[]): DiscoveredCredential[] {
    const unique = new Map<string, DiscoveredCredential>();

    for (const credential of credentials) {
        const key = comparableTitle(credential.title);
        const existing = unique.get(key);
        if (!existing || (!existing.imageUrl && credential.imageUrl)) unique.set(key, credential);
    }

    return [...unique.values()];
}

function existingCertification(existing: Certification[], credential: DiscoveredCredential): Certification | undefined {
    return (
        existing.find((certification) => certification.url === credential.url) ??
        existing.find((certification) => comparableTitle(certification.title) === comparableTitle(credential.title))
    );
}

async function buildCertification(
    existing: Certification[],
    credential: DiscoveredCredential,
    nextOrder: number,
): Promise<Certification> {
    const previous = existingCertification(existing, credential);
    const image = credential.imageUrl
        ? await downloadBadge(root, credential.imageUrl, slugify(credential.title))
        : previous?.image.src;

    if (!credential.date || !image) {
        throw new Error(`${credential.title} is missing an issue date or badge image`);
    }

    return {
        title: credential.title,
        issuer: credential.issuer,
        date: credential.date,
        image: { src: image, alt: `${credential.title} badge`, width: 128, height: 128 },
        url: credential.imageUrl ? credential.url : (previous?.url ?? credential.url),
        relevance: previous?.relevance ?? "Medium",
        order: previous?.order ?? nextOrder,
    };
}

async function synchronize(): Promise<void> {
    const existing = JSON.parse(await readFile(dataPath, "utf8")) as Certification[];
    const sources = await loadSources(root);
    const [credly, microsoftLearn] = await Promise.all([
        readCredlyProfile(sources.credly),
        readMicrosoftLearnProfile(sources.microsoftLearn),
    ]);
    const discovered = deduplicate([...credly, ...microsoftLearn]);
    let nextOrder = Math.max(-1, ...existing.map((certification) => certification.order)) + 1;
    const rebuilt: Certification[] = [];

    for (const credential of discovered) {
        const previous = existingCertification(existing, credential);
        rebuilt.push(await buildCertification(existing, credential, nextOrder));
        if (!previous) nextOrder += 1;
    }

    await writeFile(dataPath, `${JSON.stringify(rebuilt, null, 2)}\n`);
    console.log(`[certifications] generated ${rebuilt.length} certification(s)`);
}

try {
    await synchronize();
} catch (error) {
    console.error(`[certifications] synchronization failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
}
