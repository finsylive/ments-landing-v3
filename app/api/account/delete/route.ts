import { createClient } from "@/lib/supabase/server";
import {
  rateLimit,
  rateLimitHeaders,
  createRateLimitResponse,
  getClientIp,
} from "@/lib/security/rate-limit";

function json(status: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  // Per-route rate limit (defense-in-depth alongside middleware)
  const ip = getClientIp(request);
  const rl = rateLimit(ip, {
    limit: parseInt(process.env.RATE_LIMIT_SENSITIVE_MAX || "5", 10),
    windowSeconds: parseInt(
      process.env.RATE_LIMIT_SENSITIVE_WINDOW_SECONDS || "3600",
      10
    ),
    namespace: "account-delete",
  });
  if (!rl.success) return createRateLimitResponse(rl);

  try {
    const supabase = await createClient();

    // Require authentication — middleware already guards this, but defense-in-depth
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return json(401, { error: "Unauthorized" });
    }

    const body = await request.json();
    const { reason, feedback } = body;

    const email = user.email;
    const username =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email?.split("@")[0] ||
      "";

    if (!email) {
      return json(400, { error: "No email associated with your account." });
    }

    const { data, error } = await supabase.rpc(
      "handle_account_deletion_request",
      {
        p_username: username,
        p_email: email,
        p_reason: reason || "",
        p_feedback: feedback || "",
      }
    );

    if (error) {
      console.error("Account deletion RPC error:", error.message);
      return json(500, {
        error: "Failed to process deletion request. Please try again later.",
      });
    }

    if (data?.is_duplicate) {
      return json(200, {
        success: true,
        isDuplicate: true,
        message:
          "A deletion request is already being processed for this account.",
      });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...rateLimitHeaders(rl),
    };

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Your account deletion request has been received and is being processed.",
      }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Account deletion error:", err);
    return json(500, {
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}

export async function GET() {
  return json(405, { error: "Method not allowed" });
}
