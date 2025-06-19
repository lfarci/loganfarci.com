/**
 * Formats a date string into a human-readable format
 * @param dateString - ISO date string
 * @param format - 'full' for full month name, 'short' for abbreviated month
 * @returns Formatted date string
 */
export function formatDate(dateString: string, format: 'full' | 'short' = 'full'): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: format === 'full' ? 'long' : 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date string for simple display (used in legacy components)
 * @param dateString - ISO date string
 * @returns Simple formatted date string
 */
export function formatSimpleDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}
