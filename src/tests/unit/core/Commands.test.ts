import { describe, it, expect } from "vitest";
import handleCommand from "@/core/Commands";

describe("handleCommand", () => {
    it("returns a result with no error for an empty command", () => {
        const result = handleCommand("");
        expect(result.hasError).toBe(false);
        expect(result.error).toBeNull();
    });

    it("returns a result with clear=true for the 'clear' command", () => {
        const result = handleCommand("clear");
        expect(result.clear).toBe(true);
        expect(result.hasError).toBe(false);
    });

    it("returns an error for an unknown command", () => {
        const result = handleCommand("unknown");
        expect(result.hasError).toBe(true);
        expect(result.error).toContain("Unknown command");
    });

    it("returns an error message mentioning the command name", () => {
        const result = handleCommand("foobar");
        expect(result.error).toContain("foobar");
    });

    it("the empty command does not clear history", () => {
        const result = handleCommand("");
        expect(result.clear).toBe(false);
    });

    it("the clear command does not set an error", () => {
        const result = handleCommand("clear");
        expect(result.error).toBeNull();
    });
});
