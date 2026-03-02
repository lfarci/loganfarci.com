import { describe, it, expect } from "vitest";
import { formatDate, formatSimpleDate } from "@/core/date";

describe("formatDate", () => {
    it("formats a date string with full month name by default", () => {
        const result = formatDate("2024-03-15");
        expect(result).toContain("2024");
        expect(result).toContain("15");
        expect(result).toContain("March");
    });

    it("formats a date string with short month name when format is 'short'", () => {
        const result = formatDate("2024-03-15", "short");
        expect(result).toContain("2024");
        expect(result).toContain("15");
        expect(result).toContain("Mar");
    });

    it("formats a date string with full month name when format is 'full'", () => {
        const result = formatDate("2024-01-01", "full");
        expect(result).toContain("January");
        expect(result).toContain("2024");
    });
});

describe("formatSimpleDate", () => {
    it("returns a non-empty string for a valid date", () => {
        const result = formatSimpleDate("2024-03-15");
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
    });

    it("includes the year in the formatted output", () => {
        const result = formatSimpleDate("2024-03-15");
        expect(result).toContain("2024");
    });
});
