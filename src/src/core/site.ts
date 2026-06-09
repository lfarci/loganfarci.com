export const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://loganfarci.com";

// AVIF is used here for now. Note: some social media crawlers (Twitter/X, Facebook)
// do not support AVIF. Replace with a PNG social card for full platform coverage.
export const siteOgImage = `${siteUrl}/images/avatar.avif`;
