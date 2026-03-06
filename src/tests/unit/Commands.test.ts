import { describe, it, expect } from "vitest";
import handleCommand from "@/core/Commands";

describe("handleCommand", () => {
    describe("empty command", () => {
        it("returns no error for an empty string", () => {
            const result = handleCommand("");
            expect(result.hasError).toBe(false);
        });

        it("does not clear history for an empty command", () => {
            const result = handleCommand("");
            expect(result.clear).toBe(false);
        });
    });

    describe("clear command", () => {
        it("returns no error for 'clear'", () => {
            const result = handleCommand("clear");
            expect(result.hasError).toBe(false);
        });

        it("sets clear to true for 'clear'", () => {
            const result = handleCommand("clear");
            expect(result.clear).toBe(true);
        });
    });

    describe("unknown command", () => {
        it("returns an error for an unrecognised command", () => {
            const result = handleCommand("foobar");
            expect(result.hasError).toBe(true);
        });

        it("includes the command name in the error message", () => {
            const result = handleCommand("foobar");
            expect(result.error).toContain("foobar");
        });

        it("does not clear history for an unknown command", () => {
            const result = handleCommand("foobar");
            expect(result.clear).toBe(false);
        });
    });
});
