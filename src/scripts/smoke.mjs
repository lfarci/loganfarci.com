import { appendFile } from "node:fs/promises";

const rawBaseUrl = process.argv[2];
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
const ARTICLE_ROUTE_IN_SITEMAP_REGEX = /<loc>([^<]+\/articles\/[^<]+)<\/loc>/gi;
const SMOKE_NOT_FOUND_PATH_PREFIX = "/__smoke_not_found_";
const SITE_OWNER_NAME = "Logan Farci";
const LLMS_FULL_TITLE = `${SITE_OWNER_NAME} - Full LLM Context`;
const MACHINE_FILE_EXPECTATIONS = [
    {
        pathname: "/sitemap.xml",
        contentTypePattern: /(application|text)\/xml/i,
        contentTypeDescription: "application/xml or text/xml",
        bodyPattern: /<urlset\b/i,
        bodyPatternDescription: "<urlset>",
    },
    {
        pathname: "/robots.txt",
        contentTypePattern: /text\/plain/i,
        contentTypeDescription: "text/plain",
        bodyPattern: /User-agent:\s*\*/i,
        bodyPatternDescription: "User-agent: *",
    },
    {
        pathname: "/llms.txt",
        contentTypePattern: /text\/plain/i,
        contentTypeDescription: "text/plain",
        bodyPattern: new RegExp(`^#\\s+${SITE_OWNER_NAME}\\b`, "im"),
        bodyPatternDescription: `# ${SITE_OWNER_NAME}`,
    },
    {
        pathname: "/llms-full.txt",
        contentTypePattern: /text\/plain/i,
        contentTypeDescription: "text/plain",
        bodyPattern: new RegExp(`^#\\s+${LLMS_FULL_TITLE}\\b`, "im"),
        bodyPatternDescription: `# ${LLMS_FULL_TITLE}`,
    },
];
const CUSTOM_NOT_FOUND_EXPECTATIONS = {
    titlePattern: new RegExp(`<title[^>]*>\\s*Page Not Found - ${SITE_OWNER_NAME}\\s*<\\/title>`, "i"),
    robotsDirectivePattern: /\bnoindex\b/i,
    backToHomePattern: /Back to Home/i,
};

if (!rawBaseUrl) {
    console.error("❌ Missing base URL. Usage: node src/scripts/smoke.mjs <base-url>");
    process.exit(1);
}

const timeoutFromEnv = Number.parseInt(process.env.SMOKE_TIMEOUT_MS ?? "", 10);
const requestTimeoutMs =
    Number.isFinite(timeoutFromEnv) && timeoutFromEnv > 0
        ? timeoutFromEnv
        : DEFAULT_REQUEST_TIMEOUT_MS;

function normalizeBaseUrl(value) {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const normalizedUrl = new globalThis.URL(withProtocol);
    normalizedUrl.pathname = "/";
    normalizedUrl.search = "";
    normalizedUrl.hash = "";
    return normalizedUrl.toString().replace(/\/$/, "");
}

function stripTags(value) {
    return value
        .replace(/<script\b[^<]*(?:(?!<\/script\b[^>]*>)<[^<]*)*<\/script\b[^>]*>/gi, " ")
        .replace(/<style\b[^<]*(?:(?!<\/style\b[^>]*>)<[^<]*)*<\/style\b[^>]*>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&amp;/gi, "&")
        .replace(/\s+/g, " ")
        .trim();
}

function findTag(html, tagName, predicate) {
    const regex = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
    for (const match of html.matchAll(regex)) {
        const tag = match[0];
        if (predicate(tag)) {
            return tag;
        }
    }
    return null;
}

function getAttribute(tag, attributeName) {
    if (!tag) return "";
    const regex = new RegExp(`${attributeName}\\s*=\\s*["']([^"']+)["']`, "i");
    const match = tag.match(regex);
    return match?.[1]?.trim() ?? "";
}

function extractRenderableContent(html) {
    const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch?.[1]) return stripTags(mainMatch[1]);

    const rootMatch = html.match(/<div\b[^>]*id=["']root["'][^>]*>([\s\S]*?)<\/div>/i);
    if (rootMatch?.[1]) return stripTags(rootMatch[1]);

    return "";
}

function hasJsonLdScript(html) {
    const jsonLdMatches = html.matchAll(
        /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    );
    for (const match of jsonLdMatches) {
        if ((match[1] ?? "").trim().length > 0) {
            return true;
        }
    }
    return false;
}

function createChecker(baseUrl) {
    let hasFailures = false;
    let checksPassed = 0;
    let checksFailed = 0;
    const failedChecks = [];

    function pass(message) {
        checksPassed += 1;
        console.log(`✅ ${message}`);
    }

    function fail(message) {
        hasFailures = true;
        checksFailed += 1;
        failedChecks.push(message);
        console.error(`❌ ${message}`);
    }

    function check(condition, successMessage, failureMessage) {
        if (condition) {
            pass(successMessage);
            return;
        }
        fail(failureMessage);
    }

    async function request(pathname) {
        const targetUrl = new globalThis.URL(pathname, `${baseUrl}/`).toString();
        const response = await globalThis.fetch(targetUrl, {
            signal: globalThis.AbortSignal.timeout(requestTimeoutMs),
        });
        const body = await response.text();
        return { targetUrl, response, body };
    }

    async function checkHtmlRoute(pathname) {
        const { targetUrl, response, body } = await request(pathname);
        const contentType = response.headers.get("content-type") ?? "";
        const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch?.[1]?.trim() ?? "";
        const descriptionTag = findTag(
            body,
            "meta",
            (tag) => /name\s*=\s*["']description["']/i.test(tag)
        );
        const description = getAttribute(descriptionTag, "content");
        const canonicalTag = findTag(
            body,
            "link",
            (tag) => /rel\s*=\s*["']canonical["']/i.test(tag)
        );
        const canonicalHref = getAttribute(canonicalTag, "href");
        const ogTitleTag = findTag(
            body,
            "meta",
            (tag) => /property\s*=\s*["']og:title["']/i.test(tag)
        );
        const ogDescriptionTag = findTag(
            body,
            "meta",
            (tag) => /property\s*=\s*["']og:description["']/i.test(tag)
        );
        const ogTitle = getAttribute(ogTitleTag, "content");
        const ogDescription = getAttribute(ogDescriptionTag, "content");
        const hasNonEmptyJsonLdScript = hasJsonLdScript(body);
        const renderedContent = extractRenderableContent(body);

        check(
            response.status === 200,
            `${targetUrl} returned HTTP 200`,
            `${targetUrl} returned HTTP ${response.status} (expected 200)`
        );
        check(
            contentType.toLowerCase().includes("text/html"),
            `${targetUrl} returned text/html`,
            `${targetUrl} returned content-type "${contentType}" (expected text/html)`
        );
        check(
            renderedContent.length > 0,
            `${targetUrl} contains non-empty prerendered main/root content`,
            `${targetUrl} has empty prerendered main/root content`
        );
        check(
            title.length > 0,
            `${targetUrl} includes a non-empty <title>`,
            `${targetUrl} is missing a non-empty <title>`
        );
        check(
            description.length > 0,
            `${targetUrl} includes a non-empty meta description`,
            `${targetUrl} is missing a non-empty meta description`
        );
        check(
            canonicalHref.length > 0,
            `${targetUrl} includes a canonical link`,
            `${targetUrl} is missing a canonical link`
        );
        check(
            ogTitle.length > 0,
            `${targetUrl} includes a non-empty Open Graph title`,
            `${targetUrl} is missing a non-empty Open Graph title`
        );
        check(
            ogDescription.length > 0,
            `${targetUrl} includes a non-empty Open Graph description`,
            `${targetUrl} is missing a non-empty Open Graph description`
        );
        check(
            hasNonEmptyJsonLdScript,
            `${targetUrl} includes non-empty JSON-LD markup`,
            `${targetUrl} is missing non-empty JSON-LD markup`
        );
    }

    async function checkMachineFile({
        pathname,
        contentTypePattern,
        contentTypeDescription,
        bodyPattern,
        bodyPatternDescription,
    }) {
        const { targetUrl, response, body } = await request(pathname);
        const contentType = response.headers.get("content-type") ?? "";
        check(
            response.status === 200,
            `${targetUrl} returned HTTP 200`,
            `${targetUrl} returned HTTP ${response.status} (expected 200)`
        );
        check(
            body.trim().length > 0,
            `${targetUrl} returned a non-empty body`,
            `${targetUrl} returned an empty body`
        );
        check(
            contentTypePattern.test(contentType),
            `${targetUrl} returned ${contentTypeDescription}`,
            `${targetUrl} returned content-type "${contentType}" (expected ${contentTypeDescription})`
        );
        check(
            bodyPattern.test(body),
            `${targetUrl} includes expected ${bodyPatternDescription} marker`,
            `${targetUrl} did not include expected ${bodyPatternDescription} marker`
        );
    }

    async function resolveArticlePathFromSitemap() {
        const { targetUrl, response, body } = await request("/sitemap.xml");
        check(
            response.status === 200,
            `${targetUrl} is available for route discovery`,
            `${targetUrl} is unavailable for route discovery`
        );

        const articleMatches = [...body.matchAll(ARTICLE_ROUTE_IN_SITEMAP_REGEX)];
        const firstArticleUrl = articleMatches[0]?.[1];
        if (!firstArticleUrl) {
            fail("No /articles/{slug} route found in sitemap.xml");
            return null;
        }

        const articlePath = new globalThis.URL(firstArticleUrl).pathname;
        pass(`Discovered article route from sitemap: ${articlePath}`);
        return articlePath;
    }

    async function checkNotFoundFallback() {
        const testNotFoundRoute = `${SMOKE_NOT_FOUND_PATH_PREFIX}${Date.now()}`;
        const { targetUrl, response, body } = await request(testNotFoundRoute);
        const hasExpectedStatus = response.status === 404 || response.status === 200;
        const customNotFoundTitle = CUSTOM_NOT_FOUND_EXPECTATIONS.titlePattern.test(body);
        const robotsTag = findTag(
            body,
            "meta",
            (tag) => /name\s*=\s*["']robots["']/i.test(tag)
        );
        const robotsContent = getAttribute(robotsTag, "content");
        const hasNoIndexRobotsDirective =
            CUSTOM_NOT_FOUND_EXPECTATIONS.robotsDirectivePattern.test(robotsContent);
        const hasBackToHomeLinkText = CUSTOM_NOT_FOUND_EXPECTATIONS.backToHomePattern.test(body);
        const fallbackLooksValid =
            customNotFoundTitle &&
            hasNoIndexRobotsDirective &&
            hasBackToHomeLinkText;

        check(
            hasExpectedStatus,
            `${targetUrl} returned fallback status ${response.status}`,
            `${targetUrl} returned HTTP ${response.status} (expected 404, or 200 with fallback content)`
        );
        check(
            fallbackLooksValid,
            `${targetUrl} served the custom 404 fallback content`,
            `${targetUrl} did not serve the expected custom 404 fallback content`
        );
    }

    return {
        checkHtmlRoute,
        checkMachineFile,
        resolveArticlePathFromSitemap,
        checkNotFoundFallback,
        hasFailures: () => hasFailures,
        getSummary: () => ({
            checksPassed,
            checksFailed,
            totalChecks: checksPassed + checksFailed,
            failedChecks,
        }),
    };
}

function formatSummary({ baseUrl, outcome, checksPassed, checksFailed, totalChecks, failedChecks, errorMessage }) {
    const lines = [
        "## Smoke test results",
        "",
        `- **Target URL:** ${baseUrl}`,
        `- **Outcome:** ${outcome}`,
        `- **Checks passed:** ${checksPassed}`,
        `- **Checks failed:** ${checksFailed}`,
        `- **Total checks:** ${totalChecks}`,
    ];

    if (failedChecks.length > 0) {
        lines.push("", "### Failed checks");
        for (const failure of failedChecks) {
            lines.push(`- ${failure}`);
        }
    }

    if (errorMessage) {
        lines.push("", `### Error`, `- ${errorMessage}`);
    }

    return `${lines.join("\n")}\n\n`;
}

async function writeStepSummary(summary) {
    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (!summaryPath) {
        console.log("ℹ️ GITHUB_STEP_SUMMARY not set, skipping step summary.");
        return;
    }
    await appendFile(summaryPath, formatSummary(summary));
}

try {
    const baseUrl = normalizeBaseUrl(rawBaseUrl);
    console.log(`🔎 Running smoke checks against ${baseUrl}`);
    const checker = createChecker(baseUrl);

    await checker.checkHtmlRoute("/");
    await checker.checkHtmlRoute("/about");
    await checker.checkHtmlRoute("/articles");

    const articlePath = await checker.resolveArticlePathFromSitemap();
    if (articlePath) {
        await checker.checkHtmlRoute(articlePath);
    }

    for (const machineFileExpectation of MACHINE_FILE_EXPECTATIONS) {
        await checker.checkMachineFile(machineFileExpectation);
    }

    await checker.checkNotFoundFallback();

    const summary = checker.getSummary();
    if (checker.hasFailures()) {
        await writeStepSummary({ baseUrl, outcome: "Failed", ...summary });
        console.error("❌ Smoke validation failed.");
        process.exit(1);
    }

    await writeStepSummary({ baseUrl, outcome: "Passed", ...summary });
    console.log("✅ Smoke validation passed.");
} catch (error) {
    const baseUrl = rawBaseUrl ?? "(not provided)";
    const errorMessage = error instanceof Error ? error.message : String(error);
    await writeStepSummary({
        baseUrl,
        outcome: "Crashed",
        checksPassed: 0,
        checksFailed: 0,
        totalChecks: 0,
        failedChecks: [],
        errorMessage,
    });
    console.error("❌ Smoke validation crashed:", error);
    process.exit(1);
}
