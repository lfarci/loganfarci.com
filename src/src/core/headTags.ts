interface HeadTagExtraction {
    html: string;
    headTags: string;
}

interface HtmlElement {
    name: string;
    markup: string;
    end: number;
}

const voidHeadTags = new Set(["link", "meta"]);
const pairedHeadTags = new Set(["script", "title"]);

const isTagNameCharacter = (character: string): boolean => {
    const code = character.charCodeAt(0);

    return (
        (code >= 48 && code <= 57) ||
        (code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122) ||
        character === "-" ||
        character === ":"
    );
};

const readElementAt = (html: string, lowerHtml: string, start: number): HtmlElement | null => {
    if (html[start] !== "<" || html[start + 1] === "/") {
        return null;
    }

    let nameEnd = start + 1;
    while (nameEnd < html.length && isTagNameCharacter(html[nameEnd])) {
        nameEnd += 1;
    }

    const name = html.slice(start + 1, nameEnd).toLowerCase();
    if (!voidHeadTags.has(name) && !pairedHeadTags.has(name)) {
        return null;
    }

    const openingEnd = html.indexOf(">", nameEnd);
    if (openingEnd === -1) {
        return null;
    }

    if (voidHeadTags.has(name)) {
        return {
            name,
            markup: html.slice(start, openingEnd + 1),
            end: openingEnd + 1,
        };
    }

    const closingTag = `</${name}>`;
    const closingStart = lowerHtml.indexOf(closingTag, openingEnd + 1);
    if (closingStart === -1) {
        return null;
    }

    const end = closingStart + closingTag.length;
    return {
        name,
        markup: html.slice(start, end),
        end,
    };
};

const isJsonLdScript = (markup: string): boolean => {
    const openingEnd = markup.indexOf(">");
    if (openingEnd === -1) {
        return false;
    }

    const openingTag = markup.slice(0, openingEnd + 1).toLowerCase();
    return openingTag.includes('type="application/ld+json"') || openingTag.includes("type='application/ld+json'");
};

const shouldMoveToHead = (element: HtmlElement): boolean => {
    if (element.name !== "script") {
        return true;
    }

    return isJsonLdScript(element.markup);
};

export const extractHeadTags = (html: string): HeadTagExtraction => {
    const lowerHtml = html.toLowerCase();
    const bodyParts: string[] = [];
    const headTags: string[] = [];
    let bodyStart = 0;
    let scanStart = 0;

    while (scanStart < html.length) {
        const tagStart = html.indexOf("<", scanStart);
        if (tagStart === -1) {
            break;
        }

        const element = readElementAt(html, lowerHtml, tagStart);
        if (!element || !shouldMoveToHead(element)) {
            scanStart = tagStart + 1;
            continue;
        }

        bodyParts.push(html.slice(bodyStart, tagStart));
        headTags.push(element.markup);
        bodyStart = element.end;
        scanStart = element.end;
    }

    bodyParts.push(html.slice(bodyStart));

    return {
        html: bodyParts.join(""),
        headTags: headTags.join("\n"),
    };
};
