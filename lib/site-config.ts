/**
 * Site Configuration
 * 
 * Controls whether the site is running in public or internal mode.
 * In public mode, certain tools that could pose security risks are disabled.
 * 
 * Set NEXT_PUBLIC_SITE_MODE=public in your .env file to enable public mode.
 */

export type SiteMode = 'public' | 'internal';

/**
 * Returns the current site mode.
 * Defaults to 'internal' if not specified.
 */
export function getSiteMode(): SiteMode {
  const mode = process.env.NEXT_PUBLIC_SITE_MODE;
  return mode === 'public' ? 'public' : 'internal';
}

/**
 * Returns true if the site is running in public mode.
 */
export function isPublicMode(): boolean {
  return getSiteMode() === 'public';
}

/**
 * Returns true if internal-only tools should be accessible.
 */
export function isInternalToolsEnabled(): boolean {
  return !isPublicMode();
}
