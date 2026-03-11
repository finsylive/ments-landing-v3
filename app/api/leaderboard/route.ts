import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const event_id = searchParams.get("event_id");

    // Get all registrations that were referred (have a referral_token)
    let query = supabase
      .from("registrations")
      .select("referral_token")
      .not("referral_token", "is", null);

    if (event_id) {
      query = query.eq("Event_id", event_id);
    }

    const { data: referrals, error: refError } = await query;

    if (refError) {
      console.error("Leaderboard fetch error:", refError);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    // Count referrals per token
    const countMap: Record<string, number> = {};
    for (const r of referrals || []) {
      if (r.referral_token) {
        countMap[r.referral_token] = (countMap[r.referral_token] || 0) + 1;
      }
    }

    // Get the top referrer registration IDs
    const topTokens = Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([token]) => token);

    if (topTokens.length === 0) {
      return NextResponse.json({ leaderboard: [] });
    }

    // Fetch referrer details
    const { data: referrers, error: detailError } = await supabase
      .from("registrations")
      .select("id, name")
      .in("id", topTokens);

    if (detailError) {
      console.error("Referrer detail error:", detailError);
      return NextResponse.json(
        { error: "Failed to fetch referrer details" },
        { status: 500 }
      );
    }

    const nameMap: Record<string, string> = {};
    for (const r of referrers || []) {
      nameMap[r.id] = r.name;
    }

    const leaderboard = Object.entries(countMap)
      .filter(([token]) => nameMap[token])
      .map(([token, count]) => ({
        name: nameMap[token],
        referral_count: count,
      }))
      .sort((a, b) => b.referral_count - a.referral_count)
      .slice(0, 10);

    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
