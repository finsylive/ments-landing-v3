import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";
import {
  rateLimit,
  rateLimitHeaders,
  createRateLimitResponse,
  getClientIp,
} from "@/lib/security/rate-limit";

function generateToken(): string {
  return randomBytes(6).toString("hex");
}

export async function GET(request: Request) {
  // Per-route rate limit (defense-in-depth alongside middleware)
  const ip = getClientIp(request);
  const rl = rateLimit(ip, {
    limit: parseInt(process.env.RATE_LIMIT_REFERRAL_MAX || "10", 10),
    windowSeconds: parseInt(
      process.env.RATE_LIMIT_REFERRAL_WINDOW_SECONDS || "60",
      10
    ),
    namespace: "referral",
  });
  if (!rl.success) return createRateLimitResponse(rl);

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("event_id");

  if (!eventId) {
    return NextResponse.json(
      { error: "event_id is required" },
      { status: 400, headers: rateLimitHeaders(rl) }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense-in-depth: middleware already blocks unauthenticated access
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("event_referrals")
    .select("*")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { referral: existing },
      { headers: rateLimitHeaders(rl) }
    );
  }

  const token = generateToken();
  const referrerName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";
  const referrerEmail = user.email || "";

  const { data: created, error } = await supabase
    .from("event_referrals")
    .insert({
      user_id: user.id,
      event_id: eventId,
      token,
      referrer_name: referrerName,
      referrer_email: referrerEmail,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: retry } = await supabase
        .from("event_referrals")
        .select("*")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .single();
      return NextResponse.json(
        { referral: retry },
        { headers: rateLimitHeaders(rl) }
      );
    }
    console.error("Referral creation error:", error.message);
    return NextResponse.json(
      { error: "Failed to create referral. Please try again." },
      { status: 500, headers: rateLimitHeaders(rl) }
    );
  }

  return NextResponse.json(
    { referral: created },
    { headers: rateLimitHeaders(rl) }
  );
}
