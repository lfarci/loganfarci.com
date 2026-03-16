import { describe, it, expect } from "vitest";
import { createId } from "@/core/string";

describe("createId", () => {
    it("converts text to lowercase", () => {
        expect(createId("Hello World")).toBe("hello-world");
    });

    it("replaces spaces with hyphens", () => {
        expect(createId("foo bar baz")).toBe("foo-bar-baz");
    });

    it("collapses multiple consecutive spaces into a single hyphen", () => {
        expect(createId("foo  bar")).toBe("foo-bar");
    });

    it("returns an empty string for an empty input", () => {
        expect(createId("")).toBe("");
    });

    it("leaves already lowercase hyphenated text unchanged", () => {
        expect(createId("already-fine")).toBe("already-fine");
    });

    it("trims leading spaces", () => {
        expect(createId("  hello")).toBe("hello");
    });

    it("trims trailing spaces", () => {
        expect(createId("hello  ")).toBe("hello");
    });

    it("throws when given null", () => {
        expect(() => createId(null as unknown as string)).toThrow();
    });
});
