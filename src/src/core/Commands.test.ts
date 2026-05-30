import { describe, expect, it } from "vitest";

import handleCommand from "./Commands";

describe("handleCommand", () => {
    it("returns an empty result for a blank command", () => {
        const result = handleCommand("");

        expect(result.hasError).toBe(false);
        expect(result.clear).toBe(false);
        expect(result.output).toBe("");
    });

    it("returns a clear result for the clear command", () => {
        const result = handleCommand("clear");

        expect(result.hasError).toBe(false);
        expect(result.clear).toBe(true);
        expect(result.output).toBe("");
    });

    it("returns an error result for unknown commands", () => {
        const result = handleCommand("unknown");

        expect(result.hasError).toBe(true);
        expect(result.clear).toBe(false);
        expect(result.error).toBe("Unknown command: unknown.");
    });
});
