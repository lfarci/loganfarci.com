/**
 * Local ESLint rule: forbid hardcoded color literals in `className` and inline
 * `style` values so colors come from semantic Tailwind tokens.
 *
 * Enforces the accessibility convention that colors must be sourced from
 * semantic Tailwind tokens, documented in `docs/specs/accessibility.md` and the
 * accessibility gate of `docs/specs/quality-bars.md`.
 */

// Hex colors: `#` followed by exactly 3, 4, 6, or 8 hex digits. The negative
// lookahead prevents matching a longer hex run or a URL fragment like
// `#about-me` (whose first characters are not all hex digits anyway).
const HEX_COLOR = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/;

// Functional color notations (CSS Color 4): rgb()/rgba(), hsl()/hsla(), hwb(),
// lab()/lch(), oklab()/oklch(), and color(). The trailing `\(` means the CSS
// colorspace *keyword* form (e.g. `in oklch`) and the English word "color" are
// not matched — only the function-call form is. `oklch()` in particular is this
// repository's primary color notation (see src/src/globals.css).
const FUNCTIONAL_COLOR = /\b(?:rgb|hsl|hwb|(?:ok)?lab|(?:ok)?lch|color)a?\(/i;

// Class-building helpers whose string arguments are class names. A hardcoded
// color passed to any of these bypasses the JSXAttribute check (the attribute
// value is then just an identifier), so they are scanned wherever they are
// called — e.g. `const variants = cva("bg-[#fff]", …)`.
const CLASS_FACTORY_NAMES = new Set(["cva", "cn", "clsx", "cx", "tv", "twMerge", "twJoin", "mergeClassNames"]);

/**
 * Recursively collect every string `Literal` and template-literal
 * `TemplateElement` reachable from the given AST node. This covers plain
 * strings, template literals, `cn(...)`/`clsx(...)` arguments, ternaries, and
 * `style={{ color: "..." }}` object property values.
 *
 * @param {unknown} node
 * @param {Array<{ text: string, node: object }>} out
 */
function collectStrings(node, out) {
    if (node === null || typeof node !== "object") {
        return;
    }

    const candidate = /** @type {{ type?: string, value?: unknown }} */ (node);

    if (candidate.type === "Literal" && typeof candidate.value === "string") {
        out.push({ text: candidate.value, node: /** @type {object} */ (node) });
    } else if (candidate.type === "TemplateElement") {
        const element = /** @type {{ value?: { cooked?: string | null, raw?: string } }} */ (node);
        const text = element.value?.cooked ?? element.value?.raw ?? "";
        out.push({ text, node: /** @type {object} */ (node) });
    }

    for (const key of Object.keys(node)) {
        if (key === "parent") {
            continue;
        }
        const child = /** @type {Record<string, unknown>} */ (node)[key];
        if (Array.isArray(child)) {
            for (const item of child) {
                collectStrings(item, out);
            }
        } else if (
            child !== null &&
            typeof child === "object" &&
            typeof (/** @type {{ type?: string }} */ (child).type) === "string"
        ) {
            collectStrings(child, out);
        }
    }
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
    meta: {
        type: "problem",
        docs: {
            description:
                "Disallow hardcoded color literals in className and inline style values; use semantic Tailwind color tokens instead.",
            recommended: false,
        },
        schema: [],
        messages: { hardcodedColor: 'Use a semantic Tailwind color token instead of the hardcoded color "{{color}}".' },
    },
    create(context) {
        // Dedup by string-node identity so a factory call nested inside a
        // className/style attribute isn't reported twice.
        /** @type {Set<object>} */
        const reported = new Set();

        /**
         * @param {unknown} valueNode
         */
        function reportColorsIn(valueNode) {
            /** @type {Array<{ text: string, node: object }>} */
            const strings = [];
            collectStrings(valueNode, strings);

            for (const { text, node: stringNode } of strings) {
                if (reported.has(stringNode)) {
                    continue;
                }
                const hexMatch = text.match(HEX_COLOR);
                const fnMatch = text.match(FUNCTIONAL_COLOR);
                if (!hexMatch && !fnMatch) {
                    continue;
                }
                reported.add(stringNode);
                const color = (hexMatch ?? fnMatch)?.[0] ?? text;
                context.report({
                    node: /** @type {import("eslint").Rule.Node} */ (stringNode),
                    messageId: "hardcodedColor",
                    data: { color },
                });
            }
        }

        return {
            JSXAttribute(node) {
                const nameNode = node.name;
                if (!nameNode || nameNode.type !== "JSXIdentifier") {
                    return;
                }
                if (nameNode.name !== "className" && nameNode.name !== "style") {
                    return;
                }
                if (!node.value) {
                    return;
                }
                reportColorsIn(node.value);
            },
            CallExpression(node) {
                const callee = node.callee;
                let name = null;
                if (callee.type === "Identifier") {
                    name = callee.name;
                } else if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
                    name = callee.property.name;
                }
                if (!name || !CLASS_FACTORY_NAMES.has(name)) {
                    return;
                }
                for (const arg of node.arguments) {
                    reportColorsIn(arg);
                }
            },
        };
    },
};

export default rule;
