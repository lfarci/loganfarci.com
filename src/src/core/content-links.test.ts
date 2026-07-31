import interests from "@content/data/interests.json";
import skillCategories from "@content/data/skills.json";
import { describe, expect, it } from "vitest";
import { createId } from "./string";

describe("interest content", () => {
    it("presents the professional focus in the expected order", () => {
        expect(interests.map((interest) => interest.title)).toEqual(["Cloud", "AI", "DevOps", "Software Engineering"]);
    });

    it("links every interest to a matching skill category", () => {
        const skillAnchors = skillCategories.map((category) => `/about#${createId(category.name)}`);

        expect(interests.every((interest) => skillAnchors.includes(interest.redirectPath))).toBe(true);
    });
});
