/**
 * Theme utility functions and types for Tailwind CSS v4 theme system
 */

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Tailwind v4 theme colors - these are automatically generated
 * from the @theme directive in globals.css
 */
export const themeConfig = {
  // Semantic color mapping using v4 theme variables
  colors: {
    // Primary colors - these become utility classes like bg-primary, text-primary
    primary: 'primary',
    primaryHover: 'primary-hover',
    primaryLight: 'primary-light',
    
    // Secondary colors
    secondary: 'secondary', 
    secondaryHover: 'secondary-hover',
    
    // Accent colors
    accent: 'accent',
    accentHover: 'accent-hover',
    
    // Text colors - these become utility classes like text-text-primary
    textPrimary: 'text-primary',
    textSecondary: 'text-secondary', 
    textTertiary: 'text-tertiary',
    textMuted: 'text-muted',
    textInverse: 'text-inverse',
    
    // Surface colors - these become utility classes like bg-surface
    surface: 'surface',
    surfaceElevated: 'surface-elevated',
    surfaceHover: 'surface-hover',
    
    // Border colors - these become utility classes like border-border
    border: 'border',
    borderLight: 'border-light',
    borderStrong: 'border-strong',
    
    // Status colors
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
  },
  
  // Pre-built component class combinations
  components: {
    card: 'bg-surface border border-border-light rounded-lg shadow-sm',
    button: {
      primary: 'bg-primary text-text-inverse hover:bg-primary-hover transition-colors',
      secondary: 'bg-surface border border-border text-text-primary hover:bg-surface-hover transition-colors',
      ghost: 'text-text-primary hover:bg-surface-hover transition-colors',
    },
    input: 'bg-surface border border-border text-text-primary focus:border-primary focus:ring-1 focus:ring-primary',
    link: 'text-primary hover:text-primary-hover transition-colors',
    divider: 'border-t border-border',
  }
} as const;

/**
 * Helper function to get theme-aware utility classes
 */
export function getThemeClass(colorName: keyof typeof themeConfig.colors): string {
  const colorKey = themeConfig.colors[colorName];
  
  // For text colors, return with text- prefix
  if (colorName.startsWith('text')) {
    return `text-${colorKey}`;
  }
  
  // For surface colors, return with bg- prefix  
  if (colorName.includes('surface') || colorName.includes('Surface')) {
    return `bg-${colorKey}`;
  }
  
  // For border colors, return with border- prefix
  if (colorName.includes('border') || colorName.includes('Border')) {
    return `border-${colorKey}`;
  }
  
  // Default to text color
  return `text-${colorKey}`;
}

/**
 * Helper function to get pre-built component classes
 */
export function getComponentClasses(component: keyof typeof themeConfig.components): string {
  const classes = themeConfig.components[component];
  return typeof classes === 'string' ? classes : '';
}

/**
 * Helper function to get button variant classes
 */
export function getButtonClasses(variant: keyof typeof themeConfig.components.button): string {
  return themeConfig.components.button[variant];
}

/**
 * Helper function to combine theme classes with custom classes
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Access the raw CSS variable values for use in inline styles or JS
 */
export const cssVariables = {
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  primaryLight: 'var(--color-primary-light)',
  
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textTertiary: 'var(--color-text-tertiary)',
  textMuted: 'var(--color-text-muted)',
  textInverse: 'var(--color-text-inverse)',
  
  surface: 'var(--color-surface)',
  surfaceElevated: 'var(--color-surface-elevated)',
  surfaceHover: 'var(--color-surface-hover)',
  
  border: 'var(--color-border)',
  borderLight: 'var(--color-border-light)',
  borderStrong: 'var(--color-border-strong)',
  
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  info: 'var(--color-info)',
} as const;
