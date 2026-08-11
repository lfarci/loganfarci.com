import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const designPath = join(repositoryRoot, "docs", "agents", "feature-delivery-manager.md");
const releaseAgentPath = join(repositoryRoot, ".github", "agents", "feature-release-manager.agent.md");
const managerAgentPath = join(repositoryRoot, ".github", "agents", "feature-delivery-manager.agent.md");
const maintainerAgentPath = join(repositoryRoot, ".github", "agents", "feature-orchestration-maintainer.agent.md");

const design = await readFile(designPath, "utf8");
const releaseAgent = await readFile(releaseAgentPath, "utf8");
const managerAgent = await readFile(managerAgentPath, "utf8");
const maintainerAgent = await readFile(maintainerAgentPath, "utf8");

const failures = [];
function assert(condition, message) {
    if (!condition) failures.push(message);
}

const failedDeliveryFixture = {
    deliveryId: "issue-373-failed-publication",
    sourceBranch: "lfarci-super-robot",
    sourceSha: "176778cd5e0a12396ca1b98da956360f5aab1a32",
    localCommit: true,
    remoteRef: false,
    prAttempted: true,
    prCreated: false,
};

const handoffFixture = {
    deliveryId: "issue-373-automated-handoff",
    sourceBranch: "lfarci-reflect-skip-link-spec",
    sourceSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
    requiredApis: ["create_session", "get_session", "session_store_sql"],
    availableApis: ["create_session", "get_session", "session_store_sql"],
    receiptBranchAccepted: true,
    childWorktreeDistinct: true,
    childHeadSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
};

function supportsAutomatedHandoff(fixture) {
    return fixture.sourceBranch.length > 0
        && fixture.requiredApis.every((api) => fixture.availableApis.includes(api))
        && fixture.receiptBranchAccepted
        && fixture.childWorktreeDistinct
        && fixture.childHeadSha === fixture.sourceSha;
}

assert(failedDeliveryFixture.localCommit, "failed-delivery fixture must preserve the local commit");
assert(!failedDeliveryFixture.remoteRef, "failed-delivery fixture must model an absent remote ref");
assert(failedDeliveryFixture.prAttempted, "fixture must preserve the failed PR attempt");
assert(!failedDeliveryFixture.prCreated, "fixture validation must not claim a PR was created");
assert(supportsAutomatedHandoff(handoffFixture), "issue #373 fixture must model a verified exact-SHA child handoff");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    availableApis: ["create_session", "get_session"],
}), "a missing transcript API must select the manual fallback");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    childHeadSha: "unverified",
}), "a child SHA mismatch must select the manual fallback");
assert(design.includes("base_branch"), "design must name the supported branch-based session input");
assert(design.includes("distinct child branch/worktree"), "design must require child-worktree isolation evidence");
assert(design.includes("terminal artifact"), "design must define pull-based child artifact handoff");
assert(managerAgent.includes("automatically create named Review, Test"), "manager must route supported phase handoffs automatically");
assert(managerAgent.includes("manual snapshot fallback"), "manager must retain the exact-SHA manual fallback");
assert(managerAgent.includes('agents: ["feature-developer", "feature-code-reviewer", "feature-test-engineer", "feature-qa-engineer", "specialist-debugging"]'), "manager must allowlist delivery child agents");
assert(design.includes("A local commit is never treated as"), "design must distinguish local commits from publication");
assert(design.includes("push exact source ref"), "design must require pushing the exact source ref");
assert(design.includes("remote-SHA verification") || design.includes("verify the remote ref resolves"), "design must require remote SHA verification");
assert(design.includes("publication-failed"), "design must define a durable publication-failed state");
assert(design.includes("preserved Implementation Receipt"), "failed publication must preserve the implementation receipt");
assert(design.indexOf("push exact source ref") < design.indexOf("PR create/update"), "PR creation must follow push");
assert(design.indexOf("remote SHA verification") < design.indexOf("PR create/update"), "PR creation must follow remote verification");
assert(/Deployment requires a published release\s+receipt/.test(design), "deployment must require a published release receipt");
assert(releaseAgent.includes("blocked"), "current release agent must expose its blocked capability state");
assert(/push the\s+approved source branch\/ref/.test(releaseAgent), "manual fallback must own branch publication");
assert(releaseAgent.includes("publication-failed"), "release agent must return recoverable failure evidence");
assert(releaseAgent.includes("local commit or a failed PR command is publication"), "release agent must reject false publication claims");

// Self-improvement contract: critical incidents are investigated after every terminal delivery,
// while fixes remain isolated, receipt-preserving, and unable to publish or deploy themselves.
assert(design.includes("Post-delivery critical-incident self-improvement"), "design must define a post-delivery retrospective");
assert(design.includes("Critical Orchestration Incident Record"), "design must define a structured critical incident record");
assert(design.includes("Remediation Receipt"), "design must define a remediation receipt");
assert(design.includes("one incident ID gets one remediation attempt"), "self-improvement must be idempotent");
assert(managerAgent.includes("After every delivery reaches a terminal state"), "manager must run the retrospective after every delivery");
assert(managerAgent.includes("Feature Orchestration Maintainer session"), "manager must route critical incidents to the maintainer");
assert(maintainerAgent.includes("user-invocable: false"), "maintainer must be an orchestrated role");
assert(/Do not change product\s+source/.test(maintainerAgent), "maintainer must not alter product scope/code");
assert(maintainerAgent.includes("not publication or deployment"), "maintainer must not publish or deploy");
assert(maintainerAgent.includes("Remediation Receipt"), "maintainer must return remediation evidence");

if (failures.length > 0) {
    throw new Error(`Delivery contract validation failed:\n${failures.join("\n")}`);
}

console.log(`Validated delivery contract and ${failedDeliveryFixture.deliveryId} plus ${handoffFixture.deliveryId} fixtures.`);
