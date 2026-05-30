import { describe, expect, it } from "vitest";

import { formatDate, formatSimpleDate } from "./date";

describe("formatDate", () => {
    it("formats a date string using the full month name by default", () => {
        const result = formatDate("2024-03-15");

        expect(result).toMatch(/March/);
        expect(result).toMatch(/2024/);
        expect(result).toMatch(/15/);
    });

    it("formats a date string using an abbreviated month when the short format is requested", () => {
        const result = formatDate("2024-03-15", "short");

        expect(result).toMatch(/Mar/);
        expect(result).toMatch(/2024/);
    });

    it("returns Invalid Date for invalid input", () => {
        expect(formatDate("")).toBe("Invalid Date");
        expect(formatDate("not-a-date")).toBe("Invalid Date");
        expect(formatDate("2024-03-32")).toBe("Invalid Date");
    });
});

describe("formatSimpleDate", () => {
    it("returns a non-empty formatted date string", () => {
        const result = formatSimpleDate("2024-06-01");

        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
    });

    it("returns Invalid Date for invalid input", () => {
        expect(formatSimpleDate("")).toBe("Invalid Date");
        expect(formatSimpleDate("not-a-date")).toBe("Invalid Date");
    });
});
