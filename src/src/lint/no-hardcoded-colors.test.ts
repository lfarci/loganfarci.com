import { RuleTester } from "eslint";
import { afterAll, describe, it } from "vitest";

import rule from "./no-hardcoded-colors.js";

// Wire ESLint's RuleTester into vitest's test lifecycle so its cases surface as
// regular vitest tests.
RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: {
            ecmaFeatures: { jsx: true },
        },
    },
});

ruleTester.run("no-hardcoded-colors", rule, {
    valid: [
        { code: `const A = () => <div className="text-primary bg-background" />;` },
        { code: `const B = () => <div className={cn("border-border", isActive && "text-accent")} />;` },
        { code: `const C = () => <div style={{ width: 10, opacity: 0.5 }} />;` },
        // URL fragments in non-color attributes must not be flagged.
        { code: `const D = () => <a href="#about-me" className="text-foreground">x</a>;` },
        // A className string that merely contains a `#` fragment-like token, not a color.
        { code: `const E = () => <div className="scroll-mt-[#header]" />;` },
        // Colors outside className/style are out of scope.
        { code: `const F = () => <svg fill="#ff0000" />;` },
        // Class-factory calls with only semantic tokens are fine.
        { code: `const v = cva("bg-brand text-brand-foreground", { variants: {} });` },
        // The `oklch` colorspace keyword (not the function form) is not a color literal.
        { code: `const G = () => <div className="[color-mix(in_oklch,var(--a),var(--b))]" />;` },
    ],
    invalid: [
        {
            code: `const A = () => <div className="text-[#fff]" />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const B = () => <div className="bg-[#ff0000]" />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: "const C = () => <div className={`text-[#abcd]`} />;",
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const D = () => <div style={{ color: "#fff" }} />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const E = () => <div style={{ color: "rgb(255, 0, 0)" }} />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const F = () => <div className="bg-[rgba(0,0,0,0.5)]" />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const G = () => <div style={{ background: "hsl(200, 50%, 50%)" }} />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const H = () => <div style={{ background: "hsla(200, 50%, 50%, 0.4)" }} />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const I = () => <div className={active ? "text-[#fff]" : "text-primary"} />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const J = () => <div className={cn("bg-[#000]", "text-[#fff]")} />;`,
            errors: [{ messageId: "hardcodedColor" }, { messageId: "hardcodedColor" }],
        },
        // Modern CSS color functions, incl. the repo's primary notation oklch().
        {
            code: `const K = () => <div className="bg-[oklch(50%_0.2_20)]" />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const L = () => <div style={{ color: "oklch(50% 0.2 20)" }} />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const M = () => <div style={{ color: "hwb(194 0% 0%)" }} />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        // Class factories used outside a JSX attribute are still scanned.
        {
            code: `const variants = cva("base", { variants: { danger: { on: "bg-[#f00]" } } });`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        {
            code: `const classes = mergeClassNames("bg-[oklch(60%_0.1_10)]", "p-2");`,
            errors: [{ messageId: "hardcodedColor" }],
        },
        // A factory call inside a className attribute is reported exactly once (deduped).
        {
            code: `const N = () => <div className={mergeClassNames("bg-[#fff]")} />;`,
            errors: [{ messageId: "hardcodedColor" }],
        },
    ],
});
