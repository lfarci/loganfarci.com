import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const paths = {
    design: join(repositoryRoot, "docs", "agents", "simple-delivery.md"),
    orchestrator: join(repositoryRoot, ".github", "agents", "orchestrator.agent.md"),
    productOwner: join(repositoryRoot, ".github", "agents", "product-owner.agent.md"),
    developer: join(repositoryRoot, ".github", "agents", "developer.agent.md"),
    reviewer: join(repositoryRoot, ".github", "agents", "reviewer.agent.md"),
};

const files = Object.fromEntries(
    await Promise.all(
        Object.entries(paths).map(async ([key, path]) => [key, (await readFile(path, "utf8")).replaceAll("\r\n", "\n")]),
    ),
);
const failures = [];

function assert(condition, message) {
    if (!condition) failures.push(message);
}

function frontmatterValue(text, key) {
    return text.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1].trim() ?? "";
}

function agentTools(text, agentName) {
    const value = frontmatterValue(text, "tools");

    try {
        return JSON.parse(value);
    } catch {
        failures.push(`${agentName}: invalid tools frontmatter`);
        return [];
    }
}

function assertFrontmatter(agentName, text, expectedTools) {
    assert(frontmatterValue(text, "name") === agentName, `${agentName}: incorrect name frontmatter`);
    assert(frontmatterValue(text, "user-invocable") === "true", `${agentName}: must be user-invocable`);
    assert(
        agentTools(text, agentName).join(",") === expectedTools.join(","),
        `${agentName}: tools must be [${expectedTools.join(", ")}]`,
    );
}

function assertIncludes(text, expected, message) {
    assert(text.includes(expected), message);
}

function assertMatches(text, expression, message) {
    assert(expression.test(text), message);
}

const agentFiles = (await readdir(join(repositoryRoot, ".github", "agents")))
    .filter((file) => file.endsWith(".agent.md"))
    .sort();
const expectedAgentFiles = ["developer.agent.md", "orchestrator.agent.md", "product-owner.agent.md", "reviewer.agent.md"];

assert(
    agentFiles.join(",") === expectedAgentFiles.join(","),
    `agent profiles must be exactly [${expectedAgentFiles.join(", ")}]`,
);

assertFrontmatter("Orchestrator", files.orchestrator, ["read", "search", "agent", "create_session"]);
assertFrontmatter("Product Owner", files.productOwner, ["read", "search", "github/*", "execute"]);
assertFrontmatter("Developer", files.developer, ["read", "search", "edit", "execute", "agent"]);
assertFrontmatter("Reviewer", files.reviewer, ["read", "search", "execute"]);

assertIncludes(
    files.orchestrator,
    "invoke **Product Owner** for every backlog request",
    "orchestrator: must delegate live backlog reads to Product Owner",
);
assertIncludes(
    files.orchestrator,
    "Ask the host to explicitly approve the selected issues, then stop.",
    "orchestrator: must require explicit approval before dispatch",
);
assertMatches(
    files.orchestrator,
    /Do not dispatch in\s+the same response as the overview\./,
    "orchestrator: approval overview must be a separate response",
);
assertIncludes(
    files.orchestrator,
    'agent: "Developer"',
    "orchestrator: must dispatch the Developer custom agent",
);
assertIncludes(
    files.orchestrator,
    'mode: "autopilot"',
    "orchestrator: Developer sessions must use autopilot mode",
);
assertIncludes(
    files.orchestrator,
    "Every Developer session must start from and target the project default branch.",
    "orchestrator: Developer branches must remain independent and target the default branch",
);
assertMatches(
    files.orchestrator,
    /Never use an\s+unmerged agent-configuration branch as a Developer checkout or PR base/,
    "orchestrator: must reject unmerged configuration branches as delivery bases",
);

assertIncludes(
    files.productOwner,
    "available GitHub MCP tools first",
    "product owner: must prefer MCP for live backlog reads",
);
assertIncludes(
    files.productOwner,
    "gh issue list --state open --limit 100",
    "product owner: must retain the read-only CLI fallback",
);
assertIncludes(
    files.productOwner,
    "Return exactly one **Backlog Report**",
    "product owner: must return a Backlog Report",
);

assertIncludes(
    files.developer,
    "## Quality-gate repair loop",
    "developer: must define a quality-gate repair loop",
);
assertIncludes(
    files.developer,
    "Make at most two such repair cycles.",
    "developer: quality-gate repair loop must cap repairs at two cycles",
);
assertIncludes(
    files.developer,
    "Do not\nopen a pull request with a known failing local quality gate.",
    "developer: must not publish with known local quality failures",
);
assertIncludes(
    files.developer,
    "Invoke the user-invocable **Reviewer** custom agent",
    "developer: must invoke the Reviewer custom agent",
);
assertIncludes(
    files.developer,
    "git ls-remote --exit-code --heads origin <PR base>",
    "developer: must verify the remote PR base before publication",
);
assertIncludes(
    files.developer,
    "noninteractive `gh pr create --base <PR base> --head <current branch> --title <title>\n--body <description>`",
    "developer: PR creation must be explicit and noninteractive",
);

assertIncludes(files.reviewer, "Review Result", "reviewer: must return a Review Result");
assertIncludes(
    files.reviewer,
    "Do not edit, commit, push, create a session, invoke another agent, publish, or\ndeploy",
    "reviewer: must remain read-only",
);

assertIncludes(
    files.design,
    "product-owner triage -> dispatch -> per-issue delivery",
    "design: must define the Product Owner to Developer workflow",
);
assertIncludes(
    files.design,
    "explicit host approval",
    "design: must document the approval gate",
);
assertIncludes(
    files.design,
    "Every Developer session starts from the project default branch",
    "design: must document independent Developer branches",
);
assertIncludes(
    files.design,
    "## Quality-gate repair loop",
    "design: must document quality-gate repair behavior",
);
assertIncludes(
    files.design,
    "at most two repair cycles",
    "design: must document the two-cycle repair limit",
);
assertIncludes(
    files.design,
    "noninteractive\n    `gh pr create --base <PR base> --head <current branch> --title <title> --body <description>`",
    "design: must document noninteractive PR creation",
);

if (failures.length > 0) {
    throw new Error(`Delivery contract validation failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

console.log("Validated Product Owner -> Orchestrator -> Developer -> Reviewer contract.");
