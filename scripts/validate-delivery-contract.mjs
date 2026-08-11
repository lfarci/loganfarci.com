import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const paths = {
    design: join(repositoryRoot, "docs", "agents", "simple-delivery.md"),
    orchestrator: join(repositoryRoot, ".github", "agents", "orchestrator.agent.md"),
    developer: join(repositoryRoot, ".github", "agents", "developer.agent.md"),
    reviewer: join(repositoryRoot, ".github", "agents", "reviewer.agent.md"),
};

const entries = await Promise.all(
    Object.entries(paths).map(async ([key, file]) => [key, await readFile(file, "utf8")]),
);
const files = Object.fromEntries(entries);
const failures = [];

function assert(condition, message) {
    if (!condition) failures.push(message);
}

function frontmatterValue(text, key) {
    const match = text.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return match ? match[1].trim() : "";
}

function tools(text) {
    const raw = frontmatterValue(text, "tools");
    try {
        return JSON.parse(raw.replaceAll("'", '"'));
    } catch {
        failures.push(`could not parse tools frontmatter: ${raw}`);
        return [];
    }
}

const agentsDirectory = join(repositoryRoot, ".github", "agents");
const agentFiles = (await readdir(agentsDirectory))
    .filter((file) => file.endsWith(".agent.md"));
const agentIds = agentFiles.map((file) => file.replace(/\.agent\.md$/, ""));
const orchestratorTools = tools(files.orchestrator);
const developerTools = tools(files.developer);
const reviewerTools = tools(files.reviewer);

assert(frontmatterValue(files.orchestrator, "name") === "Orchestrator", "orchestrator name must be Orchestrator");
assert(orchestratorTools.join(",") === "read,search,agent,github/*", "orchestrator must use only read/search/agent/GitHub tools");
assert(!orchestratorTools.includes("edit") && !orchestratorTools.includes("execute"), "orchestrator must not edit or execute");
assert(frontmatterValue(files.orchestrator, "agents") === "[\"developer\", \"reviewer\"]", "orchestrator must delegate only to Developer and Reviewer");

assert(frontmatterValue(files.developer, "name") === "Developer", "developer name must be Developer");
assert(developerTools.join(",") === "read,search,edit,execute", "developer must have the minimal implementation toolset");
assert(files.developer.includes("Developer Result"), "developer must return a Developer Result");

assert(frontmatterValue(files.reviewer, "name") === "Reviewer", "reviewer name must be Reviewer");
assert(reviewerTools.join(",") === "read,search,execute", "reviewer must have the minimal read-only validation toolset");
assert(!reviewerTools.includes("edit"), "reviewer must not edit");
assert(files.reviewer.includes("Review Result"), "reviewer must return a Review Result");

assert(
    agentIds.length === 3 && ["orchestrator", "developer", "reviewer"].every((agent) => agentIds.includes(agent)),
    "only the three simple-workflow agents may exist",
);
assert(files.design.includes("Orchestrator -> Developer -> Reviewer"), "design must define the three-role workflow");
assert(files.design.includes("does not use child sessions"), "design must reject child-session handoffs");
assert(files.design.includes("returned response is the handoff"), "design must define direct result handoff");
assert(files.design.includes("needs-changes") && files.design.includes("automatic repair loop"), "design must stop instead of auto-repairing review findings");

if (failures.length > 0) {
    throw new Error(`Delivery contract validation failed:\n${failures.join("\n")}`);
}

console.log("Validated the Orchestrator -> Developer -> Reviewer workflow.");
