import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/rbac";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, status: 401, error: "Unauthorized", supabase };
  }

  const { data: dbIsAdmin } = await supabase.rpc("is_admin");
  const email = user.email?.toLowerCase();
  let profileRole: string | null = null;

  if (email) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("profile_type")
      .eq("email", email)
      .maybeSingle();
    profileRole = (profile?.profile_type as string | undefined) ?? null;
  }

  const hasAdminAccess =
    isAdminUser(user) ||
    Boolean(dbIsAdmin) ||
    profileRole === "admin" ||
    profileRole === "super_admin";

  if (!hasAdminAccess) {
    return { ok: false as const, status: 403, error: "Forbidden", supabase };
  }

  return { ok: true as const, supabase, user };
}

export async function requireSuperAdmin() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const email = auth.user.email?.toLowerCase();
  if (!email) {
    return { ok: false as const, status: 403, error: "Forbidden", supabase: auth.supabase };
  }

  const { data: allowlistData } = await auth.supabase
    .from("admin_allowlist")
    .select("role")
    .eq("email", email)
    .maybeSingle();

  const { data: profileData } = await auth.supabase
    .from("profiles")
    .select("profile_type,role")
    .eq("email", email)
    .maybeSingle();

  const isSuperAdmin =
    allowlistData?.role === "super_admin" ||
    profileData?.profile_type === "super_admin" ||
    profileData?.role === "super_admin";

  if (!isSuperAdmin) {
    return { ok: false as const, status: 403, error: "Super admin required", supabase: auth.supabase };
  }

  return auth;
}

export function json(status: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
