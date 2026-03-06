import { describe, it, expect } from "vitest";
import { formatDate, formatSimpleDate } from "@/core/date";

describe("formatDate", () => {
    it("formats a date string using full month name by default", () => {
        const result = formatDate("2024-03-15");
        expect(result).toMatch(/March/);
        expect(result).toMatch(/2024/);
        expect(result).toMatch(/15/);
    });

    it("formats a date string using abbreviated month when format is 'short'", () => {
        const result = formatDate("2024-03-15", "short");
        expect(result).toMatch(/Mar/);
        expect(result).toMatch(/2024/);
    });

    it("formats a date string using full month when format is 'full'", () => {
        const result = formatDate("2024-03-15", "full");
        expect(result).toMatch(/March/);
    });
});

describe("formatSimpleDate", () => {
    it("returns a non-empty formatted date string", () => {
        const result = formatSimpleDate("2024-06-01");
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
    });
});
