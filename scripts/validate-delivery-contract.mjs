import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const paths = {
    design: join(repositoryRoot, "docs", "agents", "feature-delivery-manager.md"),
    manager: join(repositoryRoot, ".github", "agents", "feature-delivery-manager.agent.md"),
    reviewValidation: join(repositoryRoot, ".github", "agents", "feature-review-validation.agent.md"),
    developer: join(repositoryRoot, ".github", "agents", "feature-developer.agent.md"),
    issueWriter: join(repositoryRoot, ".github", "agents", "issue-writer.agent.md"),
    issueReviewer: join(repositoryRoot, ".github", "agents", "issue-reviewer.agent.md"),
    release: join(repositoryRoot, ".github", "agents", "feature-release-manager.agent.md"),
    deployment: join(repositoryRoot, ".github", "agents", "feature-deployment-manager.agent.md"),
    maintainer: join(repositoryRoot, ".github", "agents", "feature-orchestration-maintainer.agent.md"),
};

const entries = await Promise.all(Object.entries(paths).map(async ([key, file]) => [key, await readFile(file, "utf8")]));
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
    const json = raw.replaceAll("'", '"');
    try {
        return JSON.parse(json);
    } catch {
        failures.push(`could not parse tools frontmatter: ${raw}`);
        return [];
    }
}

const managerTools = tools(files.manager);
const issueWriterTools = tools(files.issueWriter);
const releaseTools = tools(files.release);
const deploymentTools = tools(files.deployment);
const reviewValidationTools = tools(files.reviewValidation);

const failedDeliveryFixture = {
    deliveryId: "issue-373-failed-publication",
    sourceBranch: "lfarci-super-robot",
    sourceSha: "176778cd5e0a12396ca1b98da956360f5aab1a32",
    localCommit: true,
    remoteRef: false,
    prAttempted: true,
    prCreated: false,
};

const implementationReceiptFixture = {
    complete: true,
    heading: "IMPLEMENTATION RECEIPT",
    sourceBranch: "lfarci-reflect-skip-link-spec",
    sourceSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
    parentSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
    baseSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
    retrievalSurface: "durable-final-response",
    provenance: "host-session-store",
};

const handoffFixture = {
    deliveryId: "issue-373-safe-session-handoff",
    sourceBranch: implementationReceiptFixture.sourceBranch,
    sourceSha: implementationReceiptFixture.sourceSha,
    requiredApis: ["create_session", "get_session", "session_store_sql"],
    availableApis: ["create_session", "get_session", "session_store_sql"],
    managerSessionId: "manager-373",
    developerSessionId: "developer-373",
    developerWorktreeId: "worktree-developer-373",
    developerWorktreePath: "C:/worktrees/developer-373",
    developerBranch: implementationReceiptFixture.sourceBranch,
    previousPhaseSessionIds: [],
    previousWorktreeIds: [],
    previousWorktreePaths: [],
    previousPhaseBranches: [],
    phase: "Review & Validation",
    phaseAgent: "feature-review-validation",
    idempotencyKey: "issue-373-safe-session-handoff:review-validation:07e89aa83c16d285ba43ac8b262e5f17a7354367",
    createSession: {
        calls: 1,
        baseBranch: implementationReceiptFixture.sourceBranch,
        kickoffAgent: "feature-review-validation",
        coordinateWithCreator: true,
        returnedSessionId: "review-validation-373",
    },
    getSession: {
        sessionId: "review-validation-373",
        worktreeId: "worktree-review-validation-373",
        worktreePath: "C:/worktrees/review-validation-373",
        branch: "review-validation/issue-373",
        baseBranch: implementationReceiptFixture.sourceBranch,
        phaseAgent: "feature-review-validation",
        startup: "started",
        initialHead: implementationReceiptFixture.sourceSha,
    },
    startupReceipt: {
        sessionId: "review-validation-373",
        worktreeId: "worktree-review-validation-373",
        worktreePath: "C:/worktrees/review-validation-373",
        branch: "review-validation/issue-373",
        headSha: implementationReceiptFixture.sourceSha,
        parentSha: implementationReceiptFixture.sourceSha,
        baseSha: implementationReceiptFixture.sourceSha,
        headShaSource: "host-session-metadata",
        status: "ready-before-work",
    },
    terminalReceipt: {
        complete: true,
        sessionId: "review-validation-373",
        sourceSha: implementationReceiptFixture.sourceSha,
        sourceBranchTip: implementationReceiptFixture.sourceSha,
        status: "pass",
        heading: "REVIEW & VALIDATION RECEIPT",
        retrievalSurface: "durable-final-response",
        provenance: "host-session-store",
        independentReviewComplete: true,
        targetedChecksComplete: true,
    },
    retry: {
        calls: 2,
        retryOf: "review-validation-373",
        attempt: 2,
        failureRecorded: true,
        ambiguousOutcomeHandled: true,
        failure: {
            status: "fail",
            error: "create_session timeout after reservation",
        },
    },
    gate: {
        tipShaAtGate: implementationReceiptFixture.sourceSha,
        sourceBranchPreserved: true,
        retiredAfterReceiptRecorded: true,
        reusedWorktree: false,
    },
};

function supportsWorktreeLifecycle(fixture) {
    const gate = fixture.gate;
    return gate.tipShaAtGate === fixture.sourceSha
        && gate.sourceBranchPreserved === true
        && gate.retiredAfterReceiptRecorded === true
        && gate.reusedWorktree === false;
}

function supportsImplementationReceipt(receipt) {
    return receipt.complete
        && receipt.heading === "IMPLEMENTATION RECEIPT"
        && typeof receipt.sourceBranch === "string"
        && receipt.sourceBranch.length > 0
        && receipt.sourceSha === receipt.parentSha
        && receipt.sourceSha === receipt.baseSha
        && ["transcript", "durable-final-response", "artifact-file"].includes(receipt.retrievalSurface)
        && typeof receipt.provenance === "string"
        && receipt.provenance.length > 0;
}

function supportsAutomatedHandoff(fixture) {
    const created = fixture.createSession;
    const returned = fixture.getSession;
    const startup = fixture.startupReceipt;
    const terminal = fixture.terminalReceipt;
    const identities = [fixture.managerSessionId, fixture.developerSessionId, ...((fixture.previousPhaseSessionIds) || [])];
    const worktreePaths = [fixture.developerWorktreePath, ...((fixture.previousWorktreePaths) || [])];
    const worktreeIds = [fixture.developerWorktreeId, ...((fixture.previousWorktreeIds) || [])];
    const branches = [fixture.developerBranch, ...((fixture.previousPhaseBranches) || [])];
    return fixture.sourceBranch.length > 0
        && fixture.requiredApis.every((api) => fixture.availableApis.includes(api))
        && typeof fixture.idempotencyKey === "string"
        && created.calls === 1
        && created.baseBranch === fixture.sourceBranch
        && created.kickoffAgent === fixture.phaseAgent
        && created.coordinateWithCreator === true
        && typeof created.returnedSessionId === "string"
        && returned.sessionId === created.returnedSessionId
        && !identities.includes(returned.sessionId)
        && typeof returned.worktreeId === "string"
        && !worktreeIds.includes(returned.worktreeId)
        && typeof returned.worktreePath === "string"
        && returned.worktreePath.length > 0
        && !worktreePaths.includes(returned.worktreePath)
        && typeof returned.branch === "string"
        && !branches.includes(returned.branch)
        && returned.baseBranch === fixture.sourceBranch
        && returned.phaseAgent === fixture.phaseAgent
        && returned.startup === "started"
        && returned.initialHead === fixture.sourceSha
        && startup.sessionId === returned.sessionId
        && startup.worktreeId === returned.worktreeId
        && startup.worktreePath === returned.worktreePath
        && startup.branch === returned.branch
        && startup.headSha === fixture.sourceSha
        && startup.parentSha === fixture.sourceSha
        && startup.baseSha === fixture.sourceSha
        && startup.headShaSource === "host-session-metadata"
        && startup.status === "ready-before-work"
        && terminal.complete
        && terminal.sessionId === returned.sessionId
        && terminal.sourceSha === fixture.sourceSha
        && terminal.sourceBranchTip === fixture.sourceSha
        && terminal.status === "pass"
        && terminal.heading === "REVIEW & VALIDATION RECEIPT"
        && terminal.independentReviewComplete === true
        && terminal.targetedChecksComplete === true
        && ["transcript", "durable-final-response", "artifact-file"].includes(terminal.retrievalSurface)
        && typeof terminal.provenance === "string"
        && terminal.provenance.length > 0;
}

function supportsRecordedRetry(fixture) {
    return fixture.idempotencyKey
        && fixture.retry
        && fixture.retry.calls === 2
        && fixture.retry.retryOf === fixture.createSession.returnedSessionId
        && fixture.retry.attempt === 2
        && fixture.retry.failureRecorded === true
        && fixture.retry.ambiguousOutcomeHandled === true
        && fixture.retry.failure.status === "fail"
        && fixture.retry.failure.error.length > 0;
}

assert(frontmatterValue(files.manager, "name") === "Product & Delivery Manager", "manager agent must be renamed to Product & Delivery Manager");
assert(!managerTools.includes("edit"), "manager must not have edit permission");
assert(!managerTools.includes("execute"), "manager must not have execute permission");
assert(!managerTools.includes("github/*"), "manager must not have wildcard GitHub access");
assert(!managerTools.filter((tool) => tool.startsWith("github/")).some((tool) => /write|create|update|delete|merge|comment/i.test(tool)), "manager must not have GitHub write-like tools");
assert(files.manager.includes("feature-review-validation"), "manager must route to combined Review & Validation role");
assert(files.manager.includes("IMPLEMENTATION RECEIPT") && files.manager.includes("REVIEW & VALIDATION RECEIPT"), "manager must require explicit receipt headings");
assert(files.manager.includes("artifact-unavailable"), "manager must stop on unavailable artifacts");
assert(files.manager.includes("Feature Orchestration Maintainer session"), "manager must retain critical incident maintainer routing");

assert(reviewValidationTools.join(",") === "read,search,execute", "Review & Validation tools must be read/search/execute only");
assert(files.reviewValidation.includes("Independent review") && files.reviewValidation.includes("Targeted validation"), "Review & Validation must require independent review plus targeted checks");
assert(files.reviewValidation.includes("REVIEW & VALIDATION RECEIPT"), "Review & Validation must define one terminal receipt heading");
assert(files.reviewValidation.includes("never run\n`git push`, `gh`, deployment"), "Review & Validation must forbid publication/deployment commands");
assert(!files.reviewValidation.includes("tools: [\"read\", \"search\", \"edit"), "Review & Validation must not edit");

assert(files.developer.includes("DEVELOPER STARTUP ACK"), "Developer must emit startup ACK");
assert(files.developer.includes("not an `IMPLEMENTATION RECEIPT`"), "Developer must distinguish ACK from receipt");
assert(files.developer.includes("retrieval surface/provenance"), "Developer receipt must include retrieval provenance");
assert(files.developer.includes("Review & Validation"), "Developer must reference the simplified downstream phase");

assert(!files.design.includes("compatibility shims"), "design must not retain compatibility agents");

const agentsDirectory = join(repositoryRoot, ".github", "agents");
const agentFiles = (await readdir(agentsDirectory)).filter((file) => file.endsWith(".agent.md"));
const agentIds = agentFiles.map((file) => file.replace(/\.agent\.md$/, ""));
const removedAgents = ["backlog-maintainer", "feature-code-reviewer", "feature-test-engineer", "feature-qa-engineer"];
const agentContents = await Promise.all(agentFiles.map((file) => readFile(join(agentsDirectory, file), "utf8")));

for (const removed of removedAgents) {
    assert(!agentIds.includes(removed), `removed agent ${removed} must not exist`);
    assert(!files.design.includes(removed), `design must not reference removed agent ${removed}`);
    agentContents.forEach((content, index) => {
        assert(!content.includes(removed), `${agentFiles[index]} must not reference removed agent ${removed}`);
    });
}

for (const delegate of frontmatterValue(files.manager, "agents").replaceAll("'", '"').match(/"[^"]+"/g).map((value) => value.slice(1, -1))) {
    assert(agentIds.includes(delegate), `manager delegates to missing agent ${delegate}`);
}
assert(issueWriterTools.join(",") === "read,search,github/*", "Issue Writer permissions must remain unchanged");
assert(files.issueWriter.includes("Proof-of-approval gate"), "Issue Writer approval gate must remain documented");

assert(releaseTools.join(",") === "read,search", "Release Manager must remain blocked/read-only until verified release mechanism exists");
assert(files.release.includes("blocked") && /push the\s+approved source branch\/ref/.test(files.release), "Release Manager must retain manual publication fallback");
assert(files.release.includes("publication-failed"), "Release Manager must retain publication-failed state");
assert(files.release.includes("local commit or a failed PR command is publication"), "Release Manager must reject false publication claims");
assert(deploymentTools.includes("execute") && !deploymentTools.includes("edit") && !deploymentTools.includes("github/*"), "Deployment Manager boundary must remain execute-only without edit/GitHub wildcard");
assert(files.deployment.includes("published Release Receipt") && /Approval is\s+not authorization/.test(files.deployment), "Deployment Manager must require published release and authorization");

assert(files.design.includes("version: 0.6.0") && files.design.includes("status: current-design"), "design version/status must be updated");
assert(files.design.includes("Active role set"), "design must define the active role set");
assert(files.design.includes("Two lanes") && files.design.includes("Backlog lane") && files.design.includes("Delivery lane"), "design must define backlog and delivery lanes");
assert(files.design.includes("Product & Delivery Manager + Developer + Review & Validation Agent"), "design must name target architecture");
assert(files.design.includes("Trusted child startup `HEAD` metadata"), "design must define trusted startup HEAD metadata");
assert(files.design.includes("must not claim command-derived evidence"), "design must forbid unverifiable reviewer HEAD evidence");
assert(files.design.includes("base_branch"), "design must name the supported branch-based session input");
assert(files.design.includes("distinct child branch/worktree"), "design must require child-worktree isolation evidence");
assert(files.design.includes("terminal artifact"), "design must define pull-based child artifact handoff");
assert(files.design.includes("artifact-unavailable"), "design must define unavailable-artifact stop state");
assert(files.design.includes("send_session_message") && files.design.includes("never transports"), "design must not treat messages as artifact transport");
assert(files.design.includes("A local commit is never treated as"), "design must distinguish local commits from publication");
assert(files.design.includes("push exact source\nref") || files.design.includes("push exact source ref"), "design must require pushing the exact source ref");
assert(files.design.includes("remote SHA verification"), "design must require remote SHA verification");
assert(files.design.includes("publication-failed"), "design must define durable publication-failed state");
assert(files.design.includes("preserved Implementation Receipt"), "failed publication must preserve the implementation receipt");
assert(files.design.indexOf("push exact source") < files.design.indexOf("PR create/update"), "PR creation must follow push");
assert(files.design.indexOf("remote SHA verification") < files.design.indexOf("PR create/update"), "PR creation must follow remote verification");
assert(/Deployment requires a published release receipt/.test(files.design), "deployment must require a published release receipt");
assert(files.design.includes("Post-delivery critical-incident self-improvement"), "design must define post-delivery retrospective");
assert(files.design.includes("Critical Orchestration Incident Record"), "design must define a structured critical incident record");
assert(files.design.includes("Remediation Receipt"), "design must define remediation evidence");
assert(files.design.includes("One incident ID gets one remediation attempt"), "self-improvement must be idempotent");

assert(failedDeliveryFixture.localCommit, "failed-delivery fixture must preserve the local commit");
assert(!failedDeliveryFixture.remoteRef, "failed-delivery fixture must model an absent remote ref");
assert(failedDeliveryFixture.prAttempted, "fixture must preserve the failed PR attempt");
assert(!failedDeliveryFixture.prCreated, "fixture validation must not claim a PR was created");
assert(supportsImplementationReceipt(implementationReceiptFixture), "implementation fixture must model explicit heading and provenance");
assert(supportsAutomatedHandoff(handoffFixture), "safe fixture must model a verified exact-SHA Review & Validation handoff");
assert(supportsRecordedRetry(handoffFixture), "safe fixture must model a recorded idempotent retry");
assert(!supportsAutomatedHandoff({ ...handoffFixture, availableApis: ["create_session", "get_session"] }), "a missing transcript API must select the manual fallback");
assert(!supportsAutomatedHandoff({ ...handoffFixture, startupReceipt: { ...handoffFixture.startupReceipt, headSha: "unverified" } }), "a child SHA mismatch must select the manual fallback");
assert(!supportsAutomatedHandoff({ ...handoffFixture, getSession: { ...handoffFixture.getSession, sessionId: handoffFixture.developerSessionId } }), "a reused session identity must select the manual fallback");
assert(!supportsAutomatedHandoff({ ...handoffFixture, getSession: { ...handoffFixture.getSession, worktreeId: "" } }), "a missing worktree identity must select the manual fallback");
assert(!supportsAutomatedHandoff({ ...handoffFixture, getSession: { ...handoffFixture.getSession, branch: handoffFixture.sourceBranch } }), "a reused branch must select the manual fallback");
assert(!supportsAutomatedHandoff({ ...handoffFixture, getSession: { ...handoffFixture.getSession, worktreePath: "C:/worktrees/developer-373" }, developerWorktreePath: "C:/worktrees/developer-373" }), "a reused worktree path must select the manual fallback");
assert(!supportsAutomatedHandoff({ ...handoffFixture, getSession: { ...handoffFixture.getSession, baseBranch: "main" } }), "a returned base-branch mismatch must select the manual fallback");
assert(!supportsAutomatedHandoff({ ...handoffFixture, getSession: { ...handoffFixture.getSession, startup: "unknown" } }), "missing child startup must select the manual fallback");
assert(!supportsAutomatedHandoff({ ...handoffFixture, terminalReceipt: { ...handoffFixture.terminalReceipt, complete: false } }), "an incomplete terminal receipt must block the next phase");
assert(!supportsAutomatedHandoff({ ...handoffFixture, terminalReceipt: { ...handoffFixture.terminalReceipt, heading: "" } }), "a missing receipt heading must block the next phase");
assert(!supportsAutomatedHandoff({ ...handoffFixture, terminalReceipt: { ...handoffFixture.terminalReceipt, sourceBranchTip: "9f0a1b2c3d4e5f60718293a4b5c6d7e8f9012345" } }), "a receipt reporting a moved source tip must block the next phase");
assert(!supportsAutomatedHandoff({ ...handoffFixture, terminalReceipt: { ...handoffFixture.terminalReceipt, provenance: "" } }), "missing receipt provenance must block the next phase");
assert(!supportsAutomatedHandoff({ ...handoffFixture, terminalReceipt: { ...handoffFixture.terminalReceipt, independentReviewComplete: false } }), "missing independent review must block the next phase");
assert(!supportsAutomatedHandoff({ ...handoffFixture, terminalReceipt: { ...handoffFixture.terminalReceipt, targetedChecksComplete: false } }), "missing targeted checks must block the next phase");
assert(!supportsRecordedRetry({ ...handoffFixture, retry: { calls: 2, retryOf: handoffFixture.createSession.returnedSessionId, attempt: 2, failureRecorded: false, ambiguousOutcomeHandled: false, failure: null } }), "an unrecorded retry must not create a duplicate phase session");
assert(supportsWorktreeLifecycle(handoffFixture), "safe fixture must model a preserved, non-reused worktree lifecycle");
assert(!supportsWorktreeLifecycle({ ...handoffFixture, gate: { ...handoffFixture.gate, tipShaAtGate: "9f0a1b2c3d4e5f60718293a4b5c6d7e8f9012345" } }), "a moved source branch tip must block the gate");
assert(!supportsWorktreeLifecycle({ ...handoffFixture, gate: { ...handoffFixture.gate, sourceBranchPreserved: false } }), "a deleted source branch must block publication");
assert(!supportsWorktreeLifecycle({ ...handoffFixture, gate: { ...handoffFixture.gate, retiredAfterReceiptRecorded: false } }), "retirement before a recorded receipt must block the gate");
assert(!supportsWorktreeLifecycle({ ...handoffFixture, gate: { ...handoffFixture.gate, reusedWorktree: true } }), "a reused worktree must block the gate");

assert(files.design.includes("## Worktree lifecycle"), "design must define the worktree lifecycle");
assert(files.design.includes("never reused for a second phase"), "design must forbid worktree reuse");
assert(files.design.includes("re-verifies the tip before each gate"), "design must require source-tip re-verification");
assert(files.design.includes("must survive worktree retirement"), "design must preserve the source branch through retirement");
assert(files.design.includes("verified `HEAD` equals the published, approved SHA"), "design must bind deployment to a verified checkout");
assert(files.manager.includes("Never reuse a worktree"), "manager must forbid worktree reuse");
assert(files.design.includes("tip evidence must come from the child receipt"), "design must source tip evidence from child receipts");
assert(/[Rr]e-verify that the\s+source branch tip/.test(files.manager), "manager must re-verify the source tip before gates");
assert(files.reviewValidation.includes("source_branch_tip"), "Review & Validation must report the source branch tip");
assert(files.developer.includes("source_branch_tip"), "Developer receipt must report the resulting source branch tip");
assert(files.developer.includes("Do not add commits, amend, rebase, reset,"), "Developer must freeze the branch after the receipt");
assert(files.reviewValidation.includes("differ from the Developer's"), "Review & Validation must verify worktree isolation");
assert(files.reviewValidation.includes("Never commit, push,"), "Review & Validation must not mutate the source branch");
assert(files.deployment.includes("verified `HEAD` equals the approved SHA"), "Deployment must verify its checkout");
assert(files.release.includes("must still exist at the approved"), "Release must require a preserved source branch");

assert(files.maintainer.includes("user-invocable: false"), "orchestration maintainer must remain orchestrated");
assert(/Do not change product\s+source/.test(files.maintainer), "orchestration maintainer must not alter product scope/code");
assert(files.maintainer.includes("not publication or deployment"), "orchestration maintainer must not publish or deploy");
assert(files.maintainer.includes("Remediation Receipt"), "orchestration maintainer must return remediation evidence");

if (failures.length > 0) {
    throw new Error(`Delivery contract validation failed:\n${failures.join("\n")}`);
}

console.log(`Validated Product & Delivery Manager contract, combined Review & Validation role, and ${failedDeliveryFixture.deliveryId} plus ${handoffFixture.deliveryId} fixtures.`);
