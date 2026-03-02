import { describe, it, expect } from "vitest";
import { createId } from "@/core/string";

describe("createId", () => {
    it("converts a string to lowercase", () => {
        expect(createId("Hello World")).toBe("hello-world");
    });

    it("replaces spaces with hyphens", () => {
        expect(createId("foo bar baz")).toBe("foo-bar-baz");
    });

    it("replaces multiple consecutive spaces with a single hyphen", () => {
        expect(createId("foo  bar")).toBe("foo-bar");
    });

    it("returns an empty string for an empty input", () => {
        expect(createId("")).toBe("");
    });

    it("returns the same lowercase string when there are no spaces", () => {
        expect(createId("Hello")).toBe("hello");
    });

    it("handles a string that is already lowercase with hyphens", () => {
        expect(createId("already-fine")).toBe("already-fine");
    });
});
