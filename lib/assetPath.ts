/**
 * Prefix static asset paths with basePath for GitHub Pages deployment.
 * Use for <video>, <img>, backgroundImage etc. (Next.js Image handles basePath automatically)
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
