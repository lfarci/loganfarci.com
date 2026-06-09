export const typographyStyles = {
    heading1: "text-4xl leading-[1.04] tracking-tight md:text-6xl md:leading-[0.98] font-extrabold heading-font text-text-primary text-balance",
    heading2: "text-2xl leading-tight tracking-tight md:text-4xl md:leading-tight font-extrabold heading-font text-text-primary text-balance",
    heading3: "text-xl leading-snug tracking-tight md:text-2xl font-bold text-text-primary heading-font text-balance",
    heading4: "text-lg leading-snug md:text-xl font-semibold heading-font text-text-secondary text-balance tracking-tight",
    text: "text-base leading-7 md:text-[1.0625rem] md:leading-8 text-text-secondary text-font",
    secondary: "text-sm leading-6 md:text-base md:leading-7 text-text-muted text-font",
    strong: "font-semibold text-text-primary text-font",
    emphasis: "italic text-text-secondary text-font",
    footnote: "text-xs leading-5 md:text-sm md:leading-6 text-text-muted text-font",
    caption: "text-sm leading-6 text-text-muted text-font",
    label: "text-xs font-bold tracking-[0.18em] uppercase text-text-muted heading-font",
    unorderedList: "list-disc list-outside pl-6 mb-5 space-y-2 text-base leading-7 md:text-[1.0625rem] md:leading-8 text-text-secondary text-font",
    orderedList: "list-decimal list-outside pl-6 mb-5 space-y-2 text-base leading-7 md:text-[1.0625rem] md:leading-8 text-text-secondary text-font",
    listItem: "pl-1 text-font",
} as const;

export type TypographyStyleKey = keyof typeof typographyStyles;
