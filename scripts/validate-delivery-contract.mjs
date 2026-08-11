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
    deliveryId: "issue-373-safe-session-handoff",
    sourceBranch: "lfarci-reflect-skip-link-spec",
    sourceSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
    requiredApis: ["create_session", "get_session", "session_store_sql"],
    availableApis: ["create_session", "get_session", "session_store_sql"],
    managerSessionId: "manager-373",
    developerSessionId: "developer-373",
    developerWorktreeId: "worktree-developer-373",
    developerWorktreePath: "C:/worktrees/developer-373",
    developerBranch: "lfarci-reflect-skip-link-spec",
    previousPhaseSessionIds: [],
    previousWorktreeIds: [],
    previousWorktreePaths: [],
    previousPhaseBranches: [],
    phase: "Review",
    phaseAgent: "feature-code-reviewer",
    idempotencyKey: "issue-373-safe-session-handoff:Review:07e89aa83c16d285ba43ac8b262e5f17a7354367",
    createSession: {
        calls: 1,
        baseBranch: "lfarci-reflect-skip-link-spec",
        kickoffAgent: "feature-code-reviewer",
        coordinateWithCreator: true,
        returnedSessionId: "review-373",
    },
    getSession: {
        sessionId: "review-373",
        worktreeId: "worktree-review-373",
        worktreePath: "C:/worktrees/review-373",
        branch: "review/issue-373",
        baseBranch: "lfarci-reflect-skip-link-spec",
        phaseAgent: "feature-code-reviewer",
        startup: "started",
    },
    startupReceipt: {
        sessionId: "review-373",
        worktreeId: "worktree-review-373",
        worktreePath: "C:/worktrees/review-373",
        branch: "review/issue-373",
        headSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
        parentSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
        baseSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
        status: "ready-before-work",
    },
    terminalReceipt: {
        complete: true,
        sessionId: "review-373",
        sourceSha: "07e89aa83c16d285ba43ac8b262e5f17a7354367",
        status: "pass",
    },
    retry: {
        calls: 2,
        retryOf: "review-373",
        attempt: 2,
        failureRecorded: true,
        ambiguousOutcomeHandled: true,
        failure: {
            status: "fail",
            error: "create_session timeout after reservation",
        },
    },
};

function supportsAutomatedHandoff(fixture) {
    const created = fixture.createSession;
    const returned = fixture.getSession;
    const startup = fixture.startupReceipt;
    const terminal = fixture.terminalReceipt;
    const identities = [
        fixture.managerSessionId,
        fixture.developerSessionId,
        ...((fixture.previousPhaseSessionIds) || []),
    ];
    const worktreePaths = [
        fixture.developerWorktreePath,
        ...((fixture.previousWorktreePaths) || []),
    ];
    const worktreeIds = [
        fixture.developerWorktreeId,
        ...((fixture.previousWorktreeIds) || []),
    ];
    const branches = [
        fixture.developerBranch,
        ...((fixture.previousPhaseBranches) || []),
    ];
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
        && startup.sessionId === returned.sessionId
        && startup.worktreeId === returned.worktreeId
        && startup.worktreePath === returned.worktreePath
        && startup.branch === returned.branch
        && startup.headSha === fixture.sourceSha
        && startup.parentSha === fixture.sourceSha
        && startup.baseSha === fixture.sourceSha
        && startup.status === "ready-before-work"
        && terminal.complete
        && terminal.sessionId === returned.sessionId
        && terminal.sourceSha === fixture.sourceSha
        && terminal.status === "pass";
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

assert(failedDeliveryFixture.localCommit, "failed-delivery fixture must preserve the local commit");
assert(!failedDeliveryFixture.remoteRef, "failed-delivery fixture must model an absent remote ref");
assert(failedDeliveryFixture.prAttempted, "fixture must preserve the failed PR attempt");
assert(!failedDeliveryFixture.prCreated, "fixture validation must not claim a PR was created");
assert(supportsAutomatedHandoff(handoffFixture), "safe fixture must model a verified exact-SHA child handoff");
assert(supportsRecordedRetry(handoffFixture), "safe fixture must model a recorded idempotent retry");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    availableApis: ["create_session", "get_session"],
}), "a missing transcript API must select the manual fallback");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    startupReceipt: {
        ...handoffFixture.startupReceipt,
        headSha: "unverified",
    },
}), "a child SHA mismatch must select the manual fallback");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    getSession: {
        ...handoffFixture.getSession,
        sessionId: handoffFixture.developerSessionId,
    },
}), "a reused session identity must select the manual fallback");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    getSession: {
        ...handoffFixture.getSession,
        worktreeId: "",
    },
}), "a missing worktree identity must select the manual fallback");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    getSession: {
        ...handoffFixture.getSession,
        branch: handoffFixture.sourceBranch,
    },
}), "a reused branch must select the manual fallback");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    getSession: {
        ...handoffFixture.getSession,
        worktreePath: "C:/worktrees/developer-373",
    },
    developerWorktreePath: "C:/worktrees/developer-373",
}), "a reused worktree path must select the manual fallback");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    getSession: {
        ...handoffFixture.getSession,
        baseBranch: "main",
    },
}), "a returned base-branch mismatch must select the manual fallback");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    getSession: {
        ...handoffFixture.getSession,
        startup: "unknown",
    },
}), "missing child startup must select the manual fallback");
assert(!supportsAutomatedHandoff({
    ...handoffFixture,
    terminalReceipt: {
        ...handoffFixture.terminalReceipt,
        complete: false,
    },
}), "an incomplete terminal receipt must block the next phase");
assert(!supportsRecordedRetry({
    ...handoffFixture,
    retry: {
        calls: 2,
        retryOf: handoffFixture.createSession.returnedSessionId,
        attempt: 2,
        failureRecorded: false,
        ambiguousOutcomeHandled: false,
        failure: null,
    },
}), "an unrecorded retry must not create a duplicate phase session");
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
