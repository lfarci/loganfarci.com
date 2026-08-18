import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requireFromApp = createRequire(join(root, "src", "package.json"));
const dataPath = join(root, "content", "data", "certifications.json");
const backupPath = `${dataPath}.backup`;
const imageDirectory = join(root, "src", "public", "images", "certifications");
const timeoutMs = 15_000;

const warn = (message) => console.warn(`[certifications] ${message}`);

function configuredUrls(name) {
    return (process.env[name] ?? "")
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
}

async function fetchText(url) {
    const response = await fetch(url, {
        headers: { accept: "application/json, text/html" },
        signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { contentType: response.headers.get("content-type") ?? "", body: await response.text() };
}

function metadata(html, property) {
    const match = html.match(
        new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    );
    return match?.[1]?.replaceAll("&amp;", "&").trim();
}

function dateFrom(value) {
    const numeric = value?.match(/(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (numeric) return `${numeric[1]}-${numeric[2].padStart(2, "0")}-${numeric[3].padStart(2, "0")}`;
    const named = value?.match(/([A-Z][a-z]+)\s+(\d{1,2}),\s+(20\d{2})/);
    if (!named) return undefined;
    const month = new Date(`${named[1]} 1, ${named[3]}`).getMonth() + 1;
    return `${named[3]}-${String(month).padStart(2, "0")}-${named[2].padStart(2, "0")}`;
}

function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);
}

function parseCredentialPage(url, contentType, body) {
    if (contentType.includes("json")) {
        const data = JSON.parse(body);
        const credential = data.credential ?? data;
        return {
            title: credential.name ?? credential.title,
            issuer: credential.issuer?.name ?? credential.issuer ?? "Microsoft",
            date: dateFrom(credential.issuedOn ?? credential.issueDate ?? credential.date),
            imageUrl: credential.image ?? credential.imageUrl ?? credential.badge?.imageUrl,
            url,
        };
    }

    const rawTitle = metadata(body, "og:title") ?? body.match(/<title[^>]*>([^<]+)/i)?.[1]?.trim();
    const issuedTitle = rawTitle?.match(/^(.+?)\s+was issued by\s+(.+?)\s+to\s+/i);
    const title = issuedTitle?.[1] ?? rawTitle;
    const imageUrl = metadata(body, "og:image");
    const issuer = issuedTitle?.[2] ?? (title?.includes("Microsoft") ? "Microsoft" : undefined);
    const date = dateFrom(
        metadata(body, "article:published_time") ??
            body.match(
                /(?:issued(?:\s+on)?|earned(?:\s+on)?|date|issuedon|issued_at)\s*[:\-]?\s*(?:on\s+)?([A-Z][a-z]+\s+\d{1,2},\s+20\d{2}|20\d{2}[-/.]\d{1,2}[-/.]\d{1,2})/i,
            )?.[1],
    );
    return title
        ? { title: title.replace(/^Microsoft Certified:\s*/i, "").trim(), issuer, date, imageUrl, url }
        : undefined;
}

async function readSources() {
    const urls = [...configuredUrls("MICROSOFT_LEARN_CREDENTIAL_URLS"), ...configuredUrls("CREDLY_BADGE_URLS")];
    if (urls.length === 0) {
        warn("no source URLs configured; keeping existing certifications");
        return [];
    }

    const credentials = [];
    for (const url of urls) {
        try {
            const result = await fetchText(url);
            const credential = parseCredentialPage(url, result.contentType, result.body);
            if (!credential?.title) warn(`could not extract a credential from ${url}`);
            else credentials.push(credential);
        } catch (error) {
            warn(`unable to fetch ${url}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    return credentials;
}

async function downloadBadge(url, slug) {
    if (!url) return undefined;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const input = Buffer.from(await response.arrayBuffer());
        const outputPath = join(imageDirectory, `${slug}.avif`);
        try {
            const sharp = requireFromApp("sharp");
            await sharp(input).resize(128, 128, { fit: "contain" }).avif().toFile(outputPath);
        } catch (error) {
            warn(
                `badge conversion requires optional sharp dependency for ${slug}: ${error instanceof Error ? error.message : String(error)}`,
            );
            return undefined;
        }
        return `/images/certifications/${slug}.avif`;
    } catch (error) {
        warn(`unable to fetch badge image ${url}: ${error instanceof Error ? error.message : String(error)}`);
        return undefined;
    }
}

const existing = JSON.parse(await readFile(dataPath, "utf8"));
await copyFile(dataPath, backupPath);
const discovered = await readSources();
const known = new Set(existing.map((cert) => cert.url));
let nextOrder = Math.max(-1, ...existing.map((cert) => cert.order)) + 1;
const additions = [];

for (const credential of discovered) {
    if (!credential.title || known.has(credential.url) || existing.some((cert) => cert.title === credential.title))
        continue;
    const slug = slugify(credential.title);
    const image = await downloadBadge(credential.imageUrl, slug);
    if (!image || !credential.date) {
        warn(`skipping ${credential.title}: missing date or converted badge image`);
        continue;
    }
    additions.push({
        title: credential.title,
        issuer: credential.issuer ?? "Unknown issuer",
        date: credential.date,
        image: { src: image, alt: `${credential.title} badge`, width: 128, height: 128 },
        url: credential.url,
        relevance: "Medium",
        order: nextOrder++,
    });
}

if (additions.length > 0) {
    await writeFile(dataPath, `${JSON.stringify([...existing, ...additions], null, 2)}\n`);
    console.log(`[certifications] added ${additions.length} certification(s)`);
} else {
    console.log("[certifications] no new certifications found");
}
console.log(`[certifications] backup written to ${backupPath}`);
