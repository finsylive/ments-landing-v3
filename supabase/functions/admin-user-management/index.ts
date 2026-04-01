// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY =
  Deno.env.get("ANON_KEY") ??
  Deno.env.get("SUPABASE_ANON_KEY") ??
  "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function isSuperAdmin(userClient: ReturnType<typeof createClient>, userEmail: string, userId: string) {
  const { data: profile } = await userClient
    .from("profiles")
    .select("profile_type,role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.profile_type === "super_admin" || profile?.role === "super_admin") {
    return true;
  }

  const { data: allowlist } = await userClient
    .from("admin_allowlist")
    .select("role")
    .eq("email", userEmail.toLowerCase())
    .maybeSingle();

  return allowlist?.role === "super_admin";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return json(500, { error: "Supabase function environment not configured" });
  }

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return json(401, { error: "Missing bearer token" });

  const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error: authError,
  } = await anon.auth.getUser(token);

  if (authError || !user?.id || !user.email) {
    return json(401, { error: "Unauthorized" });
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const authorized = await isSuperAdmin(userClient, user.email, user.id);
  if (!authorized) return json(403, { error: "Super admin required" });

  const payload = await req.json();
  const action = payload?.action;

  if (action === "grant_admin") {
    const email = String(payload?.email ?? "").trim().toLowerCase();
    const role = payload?.role;
    if (!email || (role !== "admin" && role !== "super_admin")) {
      return json(400, { error: "Valid email and role are required" });
    }

    const { error: allowlistError } = await userClient
      .from("admin_allowlist")
      .upsert({ email, role }, { onConflict: "email" });
    if (allowlistError) return json(500, { error: allowlistError.message });

    const { error: profileError } = await userClient
      .from("profiles")
      .update({ profile_type: role, role })
      .eq("email", email);
    if (profileError) return json(500, { error: profileError.message });

    return json(200, {
      success: true,
      message: "Admin role granted. If user is new, it will apply at first login.",
    });
  }

  if (action === "remove_admin") {
    const email = String(payload?.email ?? "").trim().toLowerCase();
    if (!email) return json(400, { error: "Valid email is required" });

    const { error: allowlistError } = await userClient
      .from("admin_allowlist")
      .delete()
      .eq("email", email);
    if (allowlistError) return json(500, { error: allowlistError.message });

    const { error: profileError } = await userClient
      .from("profiles")
      .update({ profile_type: "member", role: "user" })
      .eq("email", email);
    if (profileError) return json(500, { error: profileError.message });

    return json(200, { success: true });
  }

  if (action === "update_profile_role") {
    const id = String(payload?.id ?? "").trim();
    const profileType = payload?.profile_type;
    const allowed = new Set(["founder", "investor", "mentor", "member", "admin", "super_admin"]);
    if (!id || !allowed.has(profileType)) {
      return json(400, { error: "Valid id and profile_type are required" });
    }

    const role = profileType === "admin" || profileType === "super_admin" ? profileType : "user";

    const { data: updated, error: updateError } = await userClient
      .from("profiles")
      .update({ profile_type: profileType, role })
      .eq("id", id)
      .select("id,email,profile_type,role")
      .single();
    if (updateError) return json(500, { error: updateError.message });

    const email = updated.email?.toLowerCase();
    if (email) {
      if (profileType === "admin" || profileType === "super_admin") {
        await userClient.from("admin_allowlist").upsert({ email, role: profileType }, { onConflict: "email" });
      } else {
        await userClient.from("admin_allowlist").delete().eq("email", email);
      }
    }

    return json(200, { user: updated });
  }

  return json(400, { error: "Unsupported action" });
});
