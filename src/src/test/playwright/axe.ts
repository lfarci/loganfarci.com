import { AxeBuilder } from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

type AxeAnalysis = Awaited<ReturnType<AxeBuilder["analyze"]>>;

/**
 * Fails on serious or critical axe violations, per the enforced accessibility gate
 * in docs/specs/quality-bars.md. Moderate and minor findings do not fail the gate.
 * A violation's impact is the most severe impact across its nodes, so filtering on
 * the violation's impact covers every node.
 */
export async function expectNoSeriousOrCriticalViolations(page: Page) {
    const results: AxeAnalysis = await new AxeBuilder({ page }).analyze();

    const blocking = results.violations.filter(
        (violation) => violation.impact === "critical" || violation.impact === "serious",
    );

    const summary = blocking
        .map((violation) => {
            const targets = violation.nodes.map((node) => node.target.join(" ")).join(" | ");
            return `${violation.id}: ${violation.help} (${violation.impact}) -> ${targets}`;
        })
        .join("\n");

    expect(blocking, `Expected no serious or critical axe violations.\n${summary}`).toEqual([]);
}
