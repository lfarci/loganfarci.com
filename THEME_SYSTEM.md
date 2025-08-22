# Tailwind v4 Theme System

This project uses Tailwind CSS v4's revolutionary theme system built with the `@theme` directive that provides semantic color tokens with automatic utility class generation and built-in light/dark mode support.

## Overview

The theme system leverages Tailwind v4's new `@theme` directive to define semantic color tokens that automatically generate corresponding utility classes. All colors use the OKLCH color space for better consistency and perceptual uniformity.

## Key Features

- **Automatic Utility Generation**: Theme variables in `@theme` automatically create utility classes
- **OKLCH Color Space**: Modern color space for better consistency across devices
- **Built-in Dark Mode**: Automatic light/dark mode switching via CSS media queries
- **Semantic Color Names**: Meaningful color tokens like `text-primary`, `bg-surface`
- **Zero Configuration**: No manual color mapping needed in `tailwind.config.ts`
- **CSS Variable Access**: All theme variables accessible in JavaScript as CSS variables

## Theme Variables & Generated Utilities

### Primary Colors
- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
- `--color-primary-hover` → `bg-primary-hover`, `text-primary-hover`
- `--color-primary-light` → `bg-primary-light`

### Text Colors
- `--color-text-primary` → `text-text-primary` (main content)
- `--color-text-secondary` → `text-text-secondary` (subheadings)
- `--color-text-tertiary` → `text-text-tertiary` (body text)
- `--color-text-muted` → `text-text-muted` (footnotes, timestamps)
- `--color-text-inverse` → `text-text-inverse` (for dark backgrounds)

### Surface Colors
- `--color-surface` → `bg-surface` (default background)
- `--color-surface-elevated` → `bg-surface-elevated` (cards, modals)
- `--color-surface-hover` → `bg-surface-hover` (hover states)

### Border Colors
- `--color-border` → `border-border` (default borders)
- `--color-border-light` → `border-border-light` (subtle dividers)
- `--color-border-strong` → `border-border-strong` (emphasis)

### Status Colors
- `--color-success` → `text-success`, `bg-success`
- `--color-warning` → `text-warning`, `bg-warning`
- `--color-error` → `text-error`, `bg-error`
- `--color-info` → `text-info`, `bg-info`

## Theme Definition (`globals.css`)

The theme is defined using Tailwind v4's `@theme` directive:

```css
@theme {
    /* Primary theme colors using OKLCH */
    --color-primary: oklch(62.3% 0.214 259.815); /* blue-500 equivalent */
    --color-primary-hover: oklch(54.6% 0.245 262.881); /* blue-600 equivalent */
    
    /* Text semantic colors */
    --color-text-primary: oklch(27.8% 0.033 256.848); /* gray-800 equivalent */
    --color-text-secondary: oklch(44.6% 0.03 256.802); /* gray-600 equivalent */
    
    /* Surface colors */
    --color-surface: oklch(100% 0 0); /* white */
    --color-surface-elevated: oklch(98.5% 0.002 247.839); /* gray-50 equivalent */
    
    /* ... more colors */
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
    @theme {
        --color-primary: oklch(74.6% 0.16 232.661); /* sky-400 equivalent */
        --color-text-primary: oklch(98.5% 0.002 247.839); /* gray-50 equivalent */
        --color-surface: oklch(21% 0.034 264.665); /* gray-900 equivalent */
        /* ... more dark colors */
    }
}
```

## Simplified Tailwind Config

With v4's theme system, the config is much simpler:

```typescript
export default {
    content: [/* ... */],
    theme: { 
        extend: { 
            colors: { 
                // Only need background/foreground for Next.js compatibility
                background: "var(--background)",
                foreground: "var(--foreground)",
            } 
        } 
    },
    darkMode: "class",
    plugins: [heroui()],
} satisfies Config;
```

## Theme Utilities (`lib/theme.ts`)

Helper functions for working with the theme system:

```typescript
import { getComponentClasses, getButtonClasses, cn, cssVariables } from '@/lib/theme';

// Pre-built component classes
const cardClasses = getComponentClasses('card'); // Returns complete class string
const primaryButton = getButtonClasses('primary'); // Returns button classes

// Combine classes safely
const className = cn('p-4', 'rounded', conditionalClass && 'border');

// Access CSS variables in JavaScript
const primaryColor = cssVariables.primary; // 'var(--color-primary)'
```

## Component Examples

### Card Component
```tsx
// Automatically uses theme colors
<div className="bg-surface border border-border-light rounded-lg p-4">
    <h3 className="text-text-primary">Card Title</h3>
    <p className="text-text-secondary">Card content</p>
</div>
```

### Button Components
```tsx
// Primary button
<button className="bg-primary text-text-inverse hover:bg-primary-hover px-4 py-2 rounded">
    Primary Action
</button>

// Using helper function
<button className={cn(getButtonClasses('primary'), 'px-4 py-2 rounded')}>
    Primary Button
</button>
```

### Link Components
```tsx
<a className="text-primary hover:text-primary-hover transition-colors">
    Themed Link
</a>
```

## Dark Mode Support

Dark mode is automatically handled through:

1. **CSS Media Query**: `@media (prefers-color-scheme: dark)`
2. **Manual Class**: `.dark` class for explicit control

Both use the same theme variable overrides defined in the `@theme` directive.

## OKLCH Color Benefits

- **Perceptual Uniformity**: Colors appear more consistent across different displays
- **Better Interpolation**: Smoother color transitions and gradients
- **Future-Proof**: Modern color space supported by all major browsers
- **Wide Gamut**: Access to more vibrant colors on capable displays

## Migrating from v3 to v4

### Before (Tailwind v3)
```css
:root {
    --color-primary: #3b82f6;
}

/* Manual color mapping in config */
colors: {
    primary: "var(--color-primary)"
}
```

### After (Tailwind v4)
```css
@theme {
    --color-primary: oklch(62.3% 0.214 259.815);
}
/* Utilities automatically generated! */
```

## Customizing Colors

To customize the theme:

1. **Modify the `@theme` directive** in `globals.css`
2. **Use OKLCH values** for better color consistency
3. **Test in both light and dark modes**

### Example: Changing Primary Color

```css
@theme {
    --color-primary: oklch(69.6% 0.17 162.48); /* Change to green */
    --color-primary-hover: oklch(64.8% 0.2 131.684); /* Darker green */
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    @theme {
        --color-primary: oklch(76.5% 0.177 163.223); /* Lighter green for dark */
        --color-primary-hover: oklch(69.6% 0.17 162.48);
    }
}
```

## Best Practices

1. **Always use semantic theme colors** instead of hardcoded values
2. **Use OKLCH for consistent color perception** across devices
3. **Test in both light and dark modes** thoroughly
4. **Leverage the theme utilities** for component composition
5. **Use CSS variables for JavaScript** when needed
6. **Keep theme variables semantic** rather than descriptive

## Testing the Theme

Use the `ThemeDemo` component to test and preview the theme system:

```tsx
import ThemeDemo from '@/components/shared/ThemeDemo';

// Displays all theme colors and utilities
<ThemeDemo />
```

## Migration Summary

✅ **Completed Migration to Tailwind v4**
- Replaced manual CSS custom properties with `@theme` directive
- Converted hex colors to OKLCH for better consistency
- Simplified Tailwind config (removed manual color mappings)
- Updated theme utilities to work with auto-generated classes
- Maintained full compatibility with existing components
- Enhanced theme demo with v4-specific features

The theme system now leverages Tailwind v4's powerful automatic utility generation while maintaining the same semantic color approach, but with better performance and consistency.
