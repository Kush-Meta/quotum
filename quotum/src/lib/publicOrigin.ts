/**
 * Resolve the public origin for absolute publish URLs.
 * Prefer PUBLIC_ORIGIN env (set on deploy), else request headers.
 */
export function resolvePublicOrigin(request?: Request): string | null {
  const fromEnv = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (!request) return null;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return null;
  return `${proto}://${host}`.replace(/\/$/, "");
}

export function absoluteUrl(
  origin: string | null,
  path: string,
): string {
  if (!origin) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
