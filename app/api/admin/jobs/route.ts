import { json, requireAdmin } from "@/lib/auth/admin-api";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const { data, error } = await auth.supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return json(500, { error: error.message });
  return json(200, { jobs: data ?? [] });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const body = await request.json();
  const { id, ...updates } = body ?? {};
  if (!id) return json(400, { error: "id is required" });

  const { data, error } = await auth.supabase
    .from("jobs")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return json(500, { error: error.message });
  return json(200, { job: data });
}
