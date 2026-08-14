import { describe, expect, it } from "vitest";

import type { ISODateString } from "@/types";
import { formatDate, formatExperiencePeriod, formatMonthYear, formatSimpleDate } from "./date";

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

describe("formatMonthYear", () => {
    it("formats an ISO date as a long month name and year", () => {
        expect(formatMonthYear("2025-03-28")).toBe("March 2025");
    });

    it("formats January and December", () => {
        expect(formatMonthYear("2024-01-15")).toBe("January 2024");
        expect(formatMonthYear("2023-12-01")).toBe("December 2023");
    });

    it("handles single-digit days", () => {
        expect(formatMonthYear("2024-06-01")).toBe("June 2024");
    });

    it("returns Invalid Date for invalid input", () => {
        expect(formatMonthYear("" as ISODateString)).toBe("Invalid Date");
        expect(formatMonthYear("not-a-date" as ISODateString)).toBe("Invalid Date");
        expect(formatMonthYear("2024-13-01" as ISODateString)).toBe("Invalid Date");
    });
});

describe("formatExperiencePeriod", () => {
    it("formats a period with a start and end date", () => {
        expect(formatExperiencePeriod("2022-06-01", "2025-12-01")).toBe("June 2022 - December 2025");
    });

    it("uses Present when no end date is provided", () => {
        expect(formatExperiencePeriod("2025-12-01")).toBe("December 2025 - Present");
    });

    it("formats a period within the same year", () => {
        expect(formatExperiencePeriod("2020-02-01", "2020-05-01")).toBe("February 2020 - May 2020");
    });

    it("returns Invalid Date for an invalid start date", () => {
        expect(formatExperiencePeriod("not-a-date" as ISODateString, "2025-12-01")).toContain("Invalid Date");
    });

    it("returns Invalid Date for an invalid end date", () => {
        expect(formatExperiencePeriod("2022-06-01", "not-a-date" as ISODateString)).toContain("Invalid Date");
    });
});
