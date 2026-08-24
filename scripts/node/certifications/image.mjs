import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";

const timeoutMs = 15_000;

export async function downloadBadge(root, imageUrl, slug) {
    if (!imageUrl) return undefined;

    const response = await fetch(imageUrl, { signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const imageDirectory = join(root, "src", "public", "images", "certifications");
    await mkdir(imageDirectory, { recursive: true });

    const requireFromApp = createRequire(join(root, "src", "package.json"));
    const sharp = requireFromApp("sharp");
    await sharp(Buffer.from(await response.arrayBuffer()))
        .resize(128, 128, { fit: "contain" })
        .avif()
        .toFile(join(imageDirectory, `${slug}.avif`));

    return `/images/certifications/${slug}.avif`;
}
