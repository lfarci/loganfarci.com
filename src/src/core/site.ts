export const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://loganfarci.com";

// PNG format for og:image — AVIF is not supported by Twitter/X and Facebook crawlers.
export const siteOgImage = `${siteUrl}/images/avatar.png`;
