export const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://www.loganfarci.com";

// Social previews must use an absolute URL. PR preview builds may override only the
// image origin; canonical URLs must keep pointing to the production site.
export const createSocialImageUrl = (origin: string): string =>
    new URL("/images/social-preview-v3.png", origin).toString();

// PNG format for og:image — AVIF is not supported by Twitter/X and Facebook crawlers.
export const siteOgImage = createSocialImageUrl(
    (import.meta.env.VITE_OG_IMAGE_ORIGIN as string | undefined) || siteUrl,
);
