type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(namespace: string): Map<string, RateLimitEntry> {
  let store = stores.get(namespace);
  if (!store) {
    store = new Map();
    stores.set(namespace, store);
  }
  return store;
}

let lastCleanup = 0;
function cleanup(store: Map<string, RateLimitEntry>) {
  const now = Date.now();
  if (now - lastCleanup < 30_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Max requests in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
  /** Namespace to isolate counters between different limiters */
  namespace?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Unix timestamp (seconds) when the window resets */
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const { limit, windowSeconds, namespace = "default" } = config;
  const store = getStore(namespace);
  cleanup(store);

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt: Math.ceil(resetAt / 1000),
    };
  }

  entry.count++;
  if (entry.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetAt: Math.ceil(entry.resetAt / 1000),
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetAt: Math.ceil(entry.resetAt / 1000),
  };
}

export function rateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetAt.toString(),
  };
  if (!result.success) {
    headers["Retry-After"] = Math.max(
      0,
      result.resetAt - Math.ceil(Date.now() / 1000)
    ).toString();
  }
  return headers;
}

export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: Math.max(
        0,
        result.resetAt - Math.ceil(Date.now() / 1000)
      ),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...rateLimitHeaders(result),
      },
    }
  );
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
