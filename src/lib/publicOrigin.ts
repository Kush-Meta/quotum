/**
 * Resolve the public origin for absolute publish URLs.
 * Prefer PUBLIC_ORIGIN env (set on deploy), else Vercel URL, else request headers.
 */
export function siteOrigin(): string {
  const fromEnv = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, "");
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;

  const vercelUrl = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercelUrl) return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;

  return "http://127.0.0.1:3847";
}

export function resolvePublicOrigin(request?: Request): string | null {
  const fromEnv = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (!request) return siteOrigin();
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return siteOrigin();
  return `${proto}://${host}`.replace(/\/$/, "");
}

export function absoluteUrl(origin: string | null, path: string): string {
  if (!origin) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
