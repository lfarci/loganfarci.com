import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const designPath = join(repositoryRoot, "docs", "agents", "feature-delivery-manager.md");
const releaseAgentPath = join(repositoryRoot, ".github", "agents", "feature-release-manager.agent.md");

const design = await readFile(designPath, "utf8");
const releaseAgent = await readFile(releaseAgentPath, "utf8");

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

assert(failedDeliveryFixture.localCommit, "failed-delivery fixture must preserve the local commit");
assert(!failedDeliveryFixture.remoteRef, "failed-delivery fixture must model an absent remote ref");
assert(failedDeliveryFixture.prAttempted, "fixture must preserve the failed PR attempt");
assert(!failedDeliveryFixture.prCreated, "fixture validation must not claim a PR was created");
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

if (failures.length > 0) {
    throw new Error(`Delivery contract validation failed:\n${failures.join("\n")}`);
}

console.log(`Validated delivery contract and ${failedDeliveryFixture.deliveryId} fixture.`);
