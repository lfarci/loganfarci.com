export const typographyStyles = {
    heading1: 'text-3xl md:text-4xl font-bold heading-font',
    heading2: 'text-2xl md:text-3xl font-bold heading-font text-gray-800',
    heading3: 'text-xl md:text-2xl font-bold text-gray-600 heading-font',
    heading4: 'text-lg md:text-xl font-semibold heading-font text-gray-500',
    text: 'text-base md:text-lg text-gray-500 !leading-relaxed',
    strong: 'font-semibold text-gray-500',
    emphasis: 'italic text-gray-500',
    footnote: 'text-sm md:text-base text-gray-400 !leading-relaxed',
    unorderedList: 'list-disc list-inside mb-4 space-y-2 text-base md:text-lg text-gray-500',
    orderedList: 'list-decimal list-inside mb-4 space-y-2 text-base md:text-lg text-gray-500',
    listItem: '!leading-relaxed'
} as const;

export type TypographyStyleKey = keyof typeof typographyStyles;
