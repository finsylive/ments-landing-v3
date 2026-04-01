import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminUser } from "@/lib/auth/rbac";

// =============================================================================
// CORS CONFIGURATION
// =============================================================================

function getAllowedOrigins(): string[] {
  const envOrigins = process.env.CORS_ALLOWED_ORIGINS;
  if (envOrigins) {
    return envOrigins
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  }

  if (process.env.NODE_ENV === "development") {
    return ["http://localhost:3000", "http://127.0.0.1:3000"];
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return [siteUrl.replace(/\/$/, "")];

  return [];
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = getAllowedOrigins();
  return allowed.some((pattern) => {
    if (pattern === origin) return true;
    if (pattern.startsWith("*.")) {
      const domain = pattern.slice(1);
      try {
        const { hostname } = new URL(origin);
        return hostname.endsWith(domain) || hostname === domain.slice(1);
      } catch {
        return false;
      }
    }
    return false;
  });
}

function applyCorsHeaders(
  response: NextResponse,
  origin: string | null
): void {
  if (!origin || !isOriginAllowed(origin)) return;
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    process.env.CORS_ALLOWED_METHODS || "GET,POST,PUT,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    process.env.CORS_ALLOWED_HEADERS ||
      "Content-Type,Authorization,X-Requested-With"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Max-Age",
    process.env.CORS_MAX_AGE || "86400"
  );
  response.headers.set("Vary", "Origin");
}

// =============================================================================
// RATE LIMITING (Edge-compatible, per-isolate in-memory store)
// =============================================================================

const rateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

type RLResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RLResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  // Probabilistic cleanup (~1 % of calls) to avoid memory leak
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitStore) {
      if (now > v.resetAt) rateLimitStore.delete(k);
    }
  }

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      ok: true,
      limit,
      remaining: limit - 1,
      resetAt: Math.ceil(resetAt / 1000),
    };
  }

  entry.count++;
  if (entry.count > limit) {
    return {
      ok: false,
      limit,
      remaining: 0,
      resetAt: Math.ceil(entry.resetAt / 1000),
    };
  }

  return {
    ok: true,
    limit,
    remaining: limit - entry.count,
    resetAt: Math.ceil(entry.resetAt / 1000),
  };
}

function rlHeaders(r: RLResult): Record<string, string> {
  const h: Record<string, string> = {
    "X-RateLimit-Limit": r.limit.toString(),
    "X-RateLimit-Remaining": r.remaining.toString(),
    "X-RateLimit-Reset": r.resetAt.toString(),
  };
  if (!r.ok) {
    h["Retry-After"] = Math.max(
      0,
      r.resetAt - Math.ceil(Date.now() / 1000)
    ).toString();
  }
  return h;
}

function rateLimitResponse(
  result: RLResult,
  origin: string | null
): NextResponse {
  const body = JSON.stringify({
    error: "Too Many Requests",
    message: "Rate limit exceeded. Please try again later.",
    retryAfter: Math.max(
      0,
      result.resetAt - Math.ceil(Date.now() / 1000)
    ),
  });
  const resp = new NextResponse(body, {
    status: 429,
    headers: { "Content-Type": "application/json", ...rlHeaders(result) },
  });
  applyCorsHeaders(resp, origin);
  applySecurityHeaders(resp);
  return resp;
}

// =============================================================================
// SECURITY HEADERS
// =============================================================================

function applySecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
}

// =============================================================================
// ROUTE PROTECTION LISTS
// =============================================================================

/** API routes that require a valid Supabase session */
const PROTECTED_API_ROUTES = ["/api/referral", "/api/account/delete"];

/** Page routes that redirect to /login when unauthenticated */
const PROTECTED_PAGE_ROUTES = ["/dashboard"];
const ADMIN_PAGE_ROUTES = ["/admin"];
const ADMIN_API_PREFIX = "/api/admin";

/** Sensitive API routes with stricter rate limits */
const SENSITIVE_API_ROUTES = ["/api/account/delete"];

// =============================================================================
// MIDDLEWARE
// =============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");
  const isApi = pathname.startsWith("/api/");

  // ── 1. CORS preflight ──────────────────────────────────────────────────
  if (isApi && request.method === "OPTIONS") {
    if (origin && isOriginAllowed(origin)) {
      const preflight = new NextResponse(null, { status: 204 });
      applyCorsHeaders(preflight, origin);
      return preflight;
    }
    return new NextResponse(null, { status: 403 });
  }

  // ── 2. Rate limiting on API routes ─────────────────────────────────────
  if (isApi) {
    const ip = getClientIp(request);

    // Global per-IP limit
    const globalMax = parseInt(
      process.env.RATE_LIMIT_API_MAX || "100",
      10
    );
    const globalWindow = parseInt(
      process.env.RATE_LIMIT_API_WINDOW_SECONDS || "60",
      10
    );
    const globalRL = checkRateLimit(`api:${ip}`, globalMax, globalWindow);
    if (!globalRL.ok) return rateLimitResponse(globalRL, origin);

    // Stricter limit for sensitive endpoints
    if (SENSITIVE_API_ROUTES.some((r) => pathname.startsWith(r))) {
      const sensitiveMax = parseInt(
        process.env.RATE_LIMIT_SENSITIVE_MAX || "5",
        10
      );
      const sensitiveWindow = parseInt(
        process.env.RATE_LIMIT_SENSITIVE_WINDOW_SECONDS || "3600",
        10
      );
      const sensitiveRL = checkRateLimit(
        `sensitive:${ip}`,
        sensitiveMax,
        sensitiveWindow
      );
      if (!sensitiveRL.ok) return rateLimitResponse(sensitiveRL, origin);
    }
  }

  // ── 3. Supabase session refresh ────────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── 4. Auth guard — API routes ─────────────────────────────────────────
  if (isApi) {
    const needsAuth = PROTECTED_API_ROUTES.some((r) =>
      pathname.startsWith(r)
    );
    if (needsAuth && !user) {
      const resp = new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "Authentication required.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
      applyCorsHeaders(resp, origin);
      applySecurityHeaders(resp);
      return resp;
    }

    const isAdminApi = pathname.startsWith(ADMIN_API_PREFIX);
    if (isAdminApi) {
      const { data: dbIsAdmin } = await supabase.rpc("is_admin");
      const hasAdminAccess = isAdminUser(user) || Boolean(dbIsAdmin);
      if (hasAdminAccess) {
        // pass
      } else {
        const resp = new NextResponse(
          JSON.stringify({
            error: "Forbidden",
            message: "Admin access required.",
          }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
        applyCorsHeaders(resp, origin);
        applySecurityHeaders(resp);
        return resp;
      }
    }
  }

  // ── 5. Auth guard — page routes (redirect to login) ────────────────────
  if (
    PROTECTED_PAGE_ROUTES.some((r) => pathname.startsWith(r)) &&
    !user
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminPage = ADMIN_PAGE_ROUTES.some((r) => pathname.startsWith(r));
  if (isAdminPage) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { data: dbIsAdmin } = await supabase.rpc("is_admin");
    const hasAdminAccess = isAdminUser(user) || Boolean(dbIsAdmin);
    if (!hasAdminAccess) {
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = "/";
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // ── 6. Apply security headers & CORS to the final response ─────────────
  applySecurityHeaders(supabaseResponse);

  if (isApi) {
    applyCorsHeaders(supabaseResponse, origin);

    // Attach current rate-limit state as response headers
    const ip = getClientIp(request);
    const globalMax = parseInt(
      process.env.RATE_LIMIT_API_MAX || "100",
      10
    );
    const entry = rateLimitStore.get(`api:${ip}`);
    if (entry) {
      supabaseResponse.headers.set(
        "X-RateLimit-Limit",
        globalMax.toString()
      );
      supabaseResponse.headers.set(
        "X-RateLimit-Remaining",
        Math.max(0, globalMax - entry.count).toString()
      );
      supabaseResponse.headers.set(
        "X-RateLimit-Reset",
        Math.ceil(entry.resetAt / 1000).toString()
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
  ],
};
