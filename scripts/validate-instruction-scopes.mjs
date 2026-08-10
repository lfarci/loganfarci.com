import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const instructionsDirectory = join(repositoryRoot, ".github", "instructions");

const fixtures = [
    { path: "content/articles/example.md", expected: ["articles.instructions.md"] },
    { path: "src/src/components/shared/Example.tsx", expected: ["components.instructions.md"] },
    {
        path: "src/src/components/shared/Example.test.tsx",
        expected: ["components.instructions.md", "tests.instructions.md"],
    },
    { path: "src/src/core/data.test.ts", expected: ["tests.instructions.md"] },
    { path: "src/src/pages/HomePage.tsx", expected: ["react-pages.instructions.md"] },
    { path: "src/plugins/example.ts", expected: ["build-tooling.instructions.md"] },
    { path: "content/data/profile.json", expected: ["content-data.instructions.md"] },
    { path: ".github/workflows/lint.yml", expected: ["github-actions.instructions.md"] },
    { path: "infra/main.tf", expected: ["terraform.instructions.md"] },
    {
        path: "src/public/staticwebapp.config.json",
        expected: ["azure-static-web-apps.instructions.md"],
    },
    { path: ".github/agents/example.agent.md", expected: ["agent-definitions.instructions.md"] },
    { path: "docs/agents/example.md", expected: ["agent-system-docs.instructions.md"] },
    { path: ".github/skills/example/SKILL.md", expected: ["agent-system-docs.instructions.md"] },
];

function globToRegExp(glob) {
    let expression = "";

    for (let index = 0; index < glob.length; index += 1) {
        const character = glob[index];

        if (character === "*") {
            if (glob[index + 1] === "*") {
                index += 1;
                if (glob[index + 1] === "/") {
                    index += 1;
                    expression += "(?:.*/)?";
                } else {
                    expression += ".*";
                }
            } else {
                expression += "[^/]*";
            }
        } else if (".+?^${}()|[]\\".includes(character)) {
            expression += `\\${character}`;
        } else {
            expression += character;
        }
    }

    return new RegExp(`^${expression}$`);
}

async function loadInstructions() {
    const entries = await readdir(instructionsDirectory, { withFileTypes: true });
    const files = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".instructions.md"))
        .map((entry) => entry.name)
        .sort();

    return Promise.all(
        files.map(async (file) => {
            const content = await readFile(join(instructionsDirectory, file), "utf8");
            const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content)?.[1];
            const applyTo = /^applyTo:\s*"([^"]+)"$/m.exec(frontmatter ?? "")?.[1];

            if (!applyTo) {
                throw new Error(`${relative(repositoryRoot, join(instructionsDirectory, file))} has no applyTo value`);
            }

            return {
                file,
                patterns: applyTo.split(",").map((pattern) => globToRegExp(pattern)),
            };
        }),
    );
}

const instructions = await loadInstructions();
const failures = fixtures.flatMap(({ path, expected }) => {
    const actual = instructions
        .filter(({ patterns }) => patterns.some((pattern) => pattern.test(path)))
        .map(({ file }) => file)
        .sort();
    const expectedSorted = [...expected].sort();

    return actual.join(",") === expectedSorted.join(",")
        ? []
        : [`${path}: expected [${expectedSorted}], received [${actual}]`];
});

if (failures.length > 0) {
    throw new Error(`Instruction scope validation failed:\n${failures.join("\n")}`);
}

console.log(`Validated ${fixtures.length} instruction-scope fixtures.`);
