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
const files = Object.fromEntries(
    entries.map(([key, text]) => [key, text.replaceAll("\r\n", "\n")]),
);
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
assert(files.orchestrator.includes("Do not write GitHub state."), "orchestrator must prohibit GitHub state writes");
assert(
    files.orchestrator.includes("Do not edit,\nexecute, push, create a pull request, publish, deploy, or repair review findings."),
    "orchestrator must prohibit execution, push/PR creation, publication, deployment, and review repair",
);
assert(!files.orchestrator.includes("git push") && !files.orchestrator.includes("gh pr create"), "orchestrator must not own the PR workflow");
assert(
    files.orchestrator.includes("delegate it to\nDeveloper or Reviewer only when it is within that role's documented contract")
        && files.orchestrator.includes("Report the request as blocked when neither subagent can own it."),
    "orchestrator must delegate unavailable capabilities only to the owning subagent or report a block",
);

assert(frontmatterValue(files.developer, "name") === "Developer", "developer name must be Developer");
assert(developerTools.join(",") === "read,search,edit,execute", "developer must have the minimal implementation toolset");
assert(files.developer.includes("Developer Result"), "developer must return a Developer Result");
assert(
    files.developer.includes("During the approved implementation, Developer may")
        && files.developer.includes("autonomously use the existing `git push` and `gh pr"),
    "developer PR path must be autonomous during approved implementation",
);
assert(
    files.developer.includes("`git push` and `gh pr create` workflow")
        && files.developer.includes("exactly one draft pull request")
        && files.developer.includes("before Reviewer runs"),
    "developer PR path must be limited to one pre-review draft PR through the existing workflow",
);
assert(
    files.developer.includes("generic `execute` alone is not a publication capability")
        && files.developer.includes("`gh auth status`")
        && files.developer.includes("`git push --dry-run origin HEAD`")
        && files.developer.includes("manual\nfallback in the Developer Result"),
    "developer PR path must verify publication credentials and provide the manual fallback",
);
assert(
    files.developer.includes("Do not create a session, publish, deploy, expand scope, or invoke Reviewer or any other\nagent."),
    "developer must continue to prohibit sessions, publication, deployment, scope expansion, and Reviewer invocation",
);
assert(files.developer.includes("record its URL and outcome in the\nDeveloper Result"), "developer must report a permitted PR outcome");

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
assert(
    files.design.includes("Orchestrator | Choose one backlog item")
        && files.design.includes("execute commands, create sessions, write GitHub state, push, create a PR"),
    "design must keep the Orchestrator read/delegate/report-only",
);
assert(
    files.design.includes("When a requested step needs a capability that Orchestrator does not have")
        && files.design.includes("only to the subagent whose documented contract owns that step")
        && files.design.includes("If neither subagent can own the step,\n   Orchestrator reports it as blocked."),
    "design must route unavailable Orchestrator capabilities to the owning subagent or report a block",
);
assert(
    files.design.includes("Developer | Implement one approved execution plan and autonomously create one pre-review draft PR")
        && files.design.includes("During approved implementation, Developer may autonomously")
        && files.design.includes("exactly one draft PR"),
    "design must allocate the bounded autonomous draft PR path to Developer",
);
assert(
    files.design.includes("This occurs before Reviewer runs: the draft")
        && files.design.includes("PR is explicitly pre-review")
        && files.design.includes("does not alter")
        && files.design.includes("Reviewer's independent review")
        && files.design.includes("No agent")
        && files.design.includes("changes the draft PR after review"),
    "design must preserve the pre-review draft PR and independent Reviewer flow",
);
assert(
    files.design.includes("## Publication capability")
        && files.design.includes("**Status:** Conditional")
        && files.design.includes("`gh auth status`")
        && files.design.includes("`git push --dry-run origin HEAD`")
        && files.design.includes("Failure routing and manual fallback"),
    "design must record publication capability status, evidence, and manual fallback",
);

if (failures.length > 0) {
    throw new Error(`Delivery contract validation failed:\n${failures.join("\n")}`);
}

console.log("Validated the Orchestrator -> Developer -> Reviewer workflow.");
