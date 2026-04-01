import { json, requireAdmin } from "@/lib/auth/admin-api";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const { data, error } = await auth.supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return json(500, { error: error.message });
  return json(200, { entries: data ?? [] });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const body = await request.json();
  const { id, status } = body ?? {};
  if (!id || !status) return json(400, { error: "id and status are required" });

  const { data, error } = await auth.supabase
    .from("waitlist")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return json(500, { error: error.message });
  return json(200, { entry: data });
}
