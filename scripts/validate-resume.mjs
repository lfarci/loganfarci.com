#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";

const pdf = process.argv[2] || "build/resume/resume.pdf";
statSync(pdf);
const pdfInfo = execFileSync("pdfinfo", [pdf], { encoding: "utf8" });
const pageCount = pdfInfo.match(/^Pages:\s+(\d+)$/m)?.[1];
if (pageCount !== "1")
    throw new Error(`PDF validation failed; expected one page, received ${pageCount ?? "an unknown page count"}`);
const text = execFileSync("pdftotext", ["-layout", pdf, "-"], { encoding: "utf8" });
const required = [
    "Summary",
    "Experience",
    "Education",
    "Certifications",
    "Skills",
    "Languages",
    "Azure Developer Associate",
    "Professional Scrum Developer I",
    "2020",
    "2022",
    "2025",
    "Azure",
    ".NET",
    "TypeScript",
    "GitHub",
];
const normalize = (value) =>
    value
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
const normalizedText = normalize(text);
const missing = required.filter((term) => !normalizedText.includes(normalize(term)));
if (missing.length) throw new Error(`PDF text validation failed; missing: ${missing.join(", ")}`);
if (text.trim().length < 500) throw new Error("PDF text validation failed; extracted text is unexpectedly short");
console.log(`Validated selectable ATS text (${text.length} characters): ${pdf}`);
