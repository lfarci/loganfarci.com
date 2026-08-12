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
assert(orchestratorTools.join(",") === "read,search,github/*", "orchestrator must use only read/search/GitHub tools");
assert(!orchestratorTools.includes("edit") && !orchestratorTools.includes("execute"), "orchestrator must not edit or execute");
assert(!orchestratorTools.includes("agent"), "orchestrator must not invoke in-process agents");
assert(frontmatterValue(files.orchestrator, "agents") === "", "orchestrator must not delegate to in-process agents");
assert(files.orchestrator.includes("Do not write GitHub state."), "orchestrator must prohibit GitHub state writes");
assert(
    files.orchestrator.includes("Do not edit,\nexecute, push, create a pull request, publish, deploy, or repair review findings."),
    "orchestrator must prohibit execution, push/PR creation, publication, deployment, and review repair",
);
assert(!files.orchestrator.includes("git push") && !files.orchestrator.includes("gh pr create"), "orchestrator must not own the PR workflow");
assert(
    files.orchestrator.includes("Do not research, plan, build,\nreview, or publish any issue yourself.")
        && files.orchestrator.includes("Do not create or follow up on a subsession: the"),
    "orchestrator must be triage/dispatch-only and never own an issue's delivery",
);
assert(
    files.orchestrator.includes("the\nhost (the root session that invoked you, not any file in this repository) owns dispatch\nvia its native `create_session` capability, which you do not have")
        && files.orchestrator.includes("Never create a child session"),
    "orchestrator must leave dispatch to the host's create_session and clarify the host is external",
);

assert(frontmatterValue(files.developer, "name") === "Developer", "developer name must be Developer");
assert(developerTools.join(",") === "read,search,edit,execute", "developer must have the minimal implementation toolset");
assert(files.developer.includes("Developer Result"), "developer must return a Developer Result");
assert(
    files.developer.includes("Do not create a pull request before review")
        && files.developer.includes("the review\ngate is mandatory"),
    "developer must never create a pre-review PR",
);
assert(
    files.developer.includes("When the\nsubsession directs you to finalize")
        && files.developer.includes("`git push` and `gh pr create` workflow")
        && files.developer.includes("exactly one pull request"),
    "developer PR path must be one post-review PR through the existing workflow",
);
assert(
    files.developer.includes("Finalization gate: once Reviewer passes, finalize by running the existing quality gates")
        && files.developer.includes("do not edit the reviewed code. Push the exact commit")
        && files.developer.includes("the subsession must route it back through the\nbounded repair pass and a fresh Reviewer pass before any push."),
    "developer finalization must not edit reviewed code and must route needed code changes back through repair + re-review",
);
assert(
    files.developer.includes("generic `execute` alone is not a publication capability")
        && files.developer.includes("`gh auth\nstatus`")
        && files.developer.includes("`git push --dry-run origin HEAD`")
        && files.developer.includes("manual fallback in the\nDeveloper Result"),
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
assert(files.design.includes("triage/dispatch -> per-issue delivery"), "design must define the dispatch + per-issue workflow");
assert(files.design.includes("dispatches one isolated subsession per shortlisted issue"), "design must dispatch one subsession per issue");
assert(files.design.includes("The Orchestrator never researches, plans, builds, reviews, or publishes"), "design must keep Orchestrator triage-only");
assert(
    files.design.includes("Subsession | Research its issue, produce one Execution Plan"),
    "design must give the subsession research and planning",
);
assert(files.design.includes("needs-changes") && files.design.includes("bounded"), "design must bound the repair loop");
assert(
    files.design.includes("Orchestrator | Read the backlog, select the high-priority issues")
        && files.design.includes("execute commands, create sessions itself, write GitHub state, push, create a PR"),
    "design must keep the Orchestrator read/report-only",
);
assert(
    files.design.includes("host dispatches one isolated subsession per shortlisted issue")
        && files.design.includes("`create_session` invocation is the sole handoff"),
    "design must use host create_session as the sole dispatch handoff",
);
assert(
    files.design.includes("the host is the root Copilot CLI/agent session that invoked the\nOrchestrator")
        && files.design.includes("not a component defined by\nany file in this repository")
        && files.design.includes("That external dependency is intentional, not a missing piece of this workflow."),
    "design must clarify the host is an external runtime, not an in-repo automation gap",
);
assert(
    files.design.includes("Developer | Implement one approved Execution Plan; after review passes, finalize and create exactly one PR")
        && files.design.includes("create a PR before review"),
    "design must allocate the post-review PR to Developer",
);
assert(
    files.design.includes("Developer does not create a pull request before review")
        && files.design.includes("review gate is mandatory")
        && files.design.includes("**exactly one** pull")
        && files.design.includes("Developer records the PR URL and outcome in its Developer Result"),
    "design must require the review gate before the single PR",
);
assert(
    files.design.includes("Finalization never edits\n   code: if a code change still turns out to be needed, Developer reports `blocked` instead")
        && files.design.includes("Finalization (step 9) never changes the reviewed code: it pushes the exact commit"),
    "design must freeze finalization to the reviewed commit and route needed code changes back through repair + re-review",
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

console.log("Validated the dispatch + per-issue delivery workflow.");
