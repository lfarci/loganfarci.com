const rawBaseUrl = process.argv[2];
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
const ARTICLE_ROUTE_IN_SITEMAP_REGEX = /<loc>([^<]+\/articles\/[^<]+)<\/loc>/gi;
const SMOKE_NOT_FOUND_PATH_PREFIX = "/__smoke_not_found_";

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
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
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

function createChecker(baseUrl) {
    let hasFailures = false;

    function pass(message) {
        console.log(`✅ ${message}`);
    }

    function fail(message) {
        hasFailures = true;
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
    }

    async function checkMachineFile(pathname) {
        const { targetUrl, response, body } = await request(pathname);
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
        const fallbackLooksValid =
            /<title[^>]*>\s*Page Not Found/i.test(body) ||
            /Page Not Found/i.test(body) ||
            /404/i.test(body);

        check(
            hasExpectedStatus,
            `${targetUrl} returned fallback status ${response.status}`,
            `${targetUrl} returned HTTP ${response.status} (expected 404, or 200 with fallback content)`
        );
        check(
            fallbackLooksValid,
            `${targetUrl} served 404 fallback content`,
            `${targetUrl} did not serve expected 404 fallback content`
        );
    }

    return {
        checkHtmlRoute,
        checkMachineFile,
        resolveArticlePathFromSitemap,
        checkNotFoundFallback,
        hasFailures: () => hasFailures,
    };
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

    await checker.checkMachineFile("/sitemap.xml");
    await checker.checkMachineFile("/robots.txt");
    await checker.checkMachineFile("/llms.txt");
    await checker.checkMachineFile("/llms-full.txt");

    await checker.checkNotFoundFallback();

    if (checker.hasFailures()) {
        console.error("❌ Smoke validation failed.");
        process.exit(1);
    }

    console.log("✅ Smoke validation passed.");
} catch (error) {
    console.error("❌ Smoke validation crashed:", error);
    process.exit(1);
}
