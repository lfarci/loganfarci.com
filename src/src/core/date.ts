import type { ISODateString } from "@/types";

/**
 * Formats a date string into a human-readable format
 * @param dateString - ISO date string
 * @param format - 'full' for full month name, 'short' for abbreviated month
 * @returns Formatted date string
 */
export function formatDate(dateString: string, format: "full" | "short" = "full"): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: format === "full" ? "long" : "short",
        day: "numeric",
    });
}

/**
 * Formats a date string for simple display (used in legacy components)
 * @param dateString - ISO date string
 * @returns Simple formatted date string
 */
export function formatSimpleDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
}

/**
 * Formats an ISO date string as a long month and year (e.g. "March 2025").
 * @param date - ISO date string (YYYY-MM-DD)
 * @returns Formatted month and year
 */
export function formatMonthYear(date: ISODateString): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

/**
 * Formats an experience period as "Month Year - Month Year", using "Present"
 * when no end date is provided.
 * @param start - ISO date string for the start of the period
 * @param end - optional ISO date string for the end of the period
 * @returns Formatted period
 */
export function formatExperiencePeriod(start: ISODateString, end?: ISODateString): string {
    const startDate = formatMonthYear(start);
    const endDate = end ? formatMonthYear(end) : "Present";
    return `${startDate} - ${endDate}`;
}
