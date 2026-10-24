import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(scriptDirectory, "assets", "social-preview.svg");
const destination = path.resolve(scriptDirectory, "../public/images/social-preview.png");

const png = await sharp(source).png({ compressionLevel: 9 }).toBuffer();
const metadata = await sharp(png).metadata();

if (metadata.width !== 1200 || metadata.height !== 630 || metadata.format !== "png") {
    throw new Error("Open Graph image must be a 1200×630 PNG.");
}

if (png.length > 5 * 1024 * 1024) {
    throw new Error("Open Graph image must remain smaller than 5 MB.");
}

await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.writeFile(destination, png);
console.log("Generated /images/social-preview.png (1200×630).");
