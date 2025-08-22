export const typographyStyles = {
    heading1: "text-3xl md:text-4xl font-bold heading-font",
    heading2: "text-2xl md:text-3xl font-bold heading-font text-gray-800",
    heading3: "text-xl md:text-2xl font-bold text-gray-600 heading-font",
    heading4: "text-lg md:text-xl font-semibold heading-font text-gray-500",
    text: "text-base md:text-lg text-gray-500 leading-relaxed! text-font",
    secondary: "text-base md:text-lg text-gray-400 leading-relaxed! text-font",
    strong: "font-semibold text-gray-500 text-font",
    emphasis: "italic text-gray-500 text-font",
    footnote: "text-sm md:text-base text-gray-400 leading-relaxed! text-font",
    unorderedList: "list-disc list-inside mb-4 space-y-2 text-base md:text-lg text-gray-500 text-font",
    orderedList: "list-decimal list-inside mb-4 space-y-2 text-base md:text-lg text-gray-500 text-font",
    listItem: "leading-relaxed! text-font",
} as const;

export type TypographyStyleKey = keyof typeof typographyStyles;
