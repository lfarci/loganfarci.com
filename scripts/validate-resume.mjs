#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";

const pdf = process.argv[2] || "build/resume/resume.pdf";
statSync(pdf);
const text = execFileSync("pdftotext", ["-layout", pdf, "-"], { encoding: "utf8" });
const required = [
    "Summary",
    "Experience",
    "Education",
    "Certifications",
    "Skills",
    "2020",
    "2022",
    "2025",
    "Azure",
    ".NET",
    "TypeScript",
    "GitHub",
];
const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/g, "");
const missing = required.filter((term) => !normalizedText.includes(term.toLowerCase().replace(/[^a-z0-9]/g, "")));
if (missing.length) throw new Error(`PDF text validation failed; missing: ${missing.join(", ")}`);
if (text.trim().length < 500) throw new Error("PDF text validation failed; extracted text is unexpectedly short");
console.log(`Validated selectable ATS text (${text.length} characters): ${pdf}`);
