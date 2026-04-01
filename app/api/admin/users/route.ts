import { json, requireSuperAdmin } from "@/lib/auth/admin-api";

const ALLOWED_PROFILE_TYPES = new Set([
  "founder",
  "investor",
  "mentor",
  "member",
  "admin",
  "super_admin",
]);

async function invokeAdminEdgeFunction(
  auth: Awaited<ReturnType<typeof requireSuperAdmin>>,
  payload: Record<string, unknown>
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return { ok: false as const, status: 500, error: "Missing Supabase API configuration" };
  }

  const {
    data: { session },
  } = await auth.supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) {
    return { ok: false as const, status: 401, error: "Session expired. Please sign in again." };
  }

  const res = await fetch(`${url}/functions/v1/admin-user-management`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: anonKey,
    },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  const data = (() => {
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return { raw };
    }
  })();
  if (!res.ok) {
    return {
      ok: false as const,
      status: res.status,
      error:
        typeof data?.error === "string"
          ? data.error
          : typeof data?.raw === "string" && data.raw
          ? data.raw
          : `Admin function failed (${res.status})`,
    };
  }

  return { ok: true as const, data };
}

export async function GET() {
  const auth = await requireSuperAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const { data, error } = await auth.supabase
    .from("profiles")
    .select("id,email,full_name,profile_type,role,created_at,updated_at")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) return json(500, { error: error.message });
  return json(200, { users: data ?? [] });
}

export async function PATCH(request: Request) {
  const auth = await requireSuperAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const body = await request.json();
  const { id, profile_type } = body ?? {};

  if (!id || !profile_type || !ALLOWED_PROFILE_TYPES.has(profile_type)) {
    return json(400, { error: "Valid id and profile_type are required" });
  }

  const result = await invokeAdminEdgeFunction(auth, {
    action: "update_profile_role",
    id,
    profile_type,
  });
  if (!result.ok) return json(result.status, { error: result.error });
  return json(200, result.data as Record<string, unknown>);
}

export async function POST(request: Request) {
  const auth = await requireSuperAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const body = await request.json();
  const emailRaw = body?.email;
  const role = body?.role;

  const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
  if (!email || (role !== "admin" && role !== "super_admin")) {
    return json(400, { error: "Valid email and role are required" });
  }

  const result = await invokeAdminEdgeFunction(auth, {
    action: "grant_admin",
    email,
    role,
  });
  if (!result.ok) return json(result.status, { error: result.error });
  return json(200, result.data as Record<string, unknown>);
}

export async function DELETE(request: Request) {
  const auth = await requireSuperAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!id && !email) return json(400, { error: "id or email is required" });

  if (email && !id) {
    const result = await invokeAdminEdgeFunction(auth, {
      action: "remove_admin",
      email,
    });
    if (!result.ok) return json(result.status, { error: result.error });
    return json(200, result.data as Record<string, unknown>);
  }

  return json(400, { error: "Use email-based remove for admin management" });
}
