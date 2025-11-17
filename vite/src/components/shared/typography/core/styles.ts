export const typographyStyles = {
    heading1: "text-3xl md:text-4xl font-bold heading-font text-text-primary",
    heading2: "text-2xl md:text-3xl font-bold heading-font text-text-primary",
    heading3: "text-xl md:text-2xl font-bold text-text-secondary heading-font",
    heading4: "text-lg md:text-xl font-semibold heading-font text-text-tertiary",
    text: "text-base md:text-lg text-text-tertiary leading-relaxed! text-font",
    secondary: "text-base md:text-lg text-text-muted leading-relaxed! text-font",
    strong: "font-semibold text-text-tertiary text-font",
    emphasis: "italic text-text-tertiary text-font",
    footnote: "text-sm md:text-base text-text-muted leading-relaxed! text-font",
    unorderedList: "list-disc list-inside mb-4 space-y-2 text-base md:text-lg text-text-tertiary text-font",
    orderedList: "list-decimal list-inside mb-4 space-y-2 text-base md:text-lg text-text-tertiary text-font",
    listItem: "leading-relaxed! text-font",
} as const;

export type TypographyStyleKey = keyof typeof typographyStyles;
