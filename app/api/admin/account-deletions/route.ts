import { json, requireAdmin } from "@/lib/auth/admin-api";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const { data, error } = await auth.supabase
    .from("account_deletion_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return json(500, { error: error.message });
  return json(200, { requests: data ?? [] });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const body = await request.json();
  const { id, status } = body ?? {};
  if (!id || !status) return json(400, { error: "id and status are required" });

  const { data, error } = await auth.supabase
    .from("account_deletion_requests")
    .update({
      status,
      is_processed: status === "completed",
      processed_at: status === "completed" ? new Date().toISOString() : null,
      processed_by: auth.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return json(500, { error: error.message });
  return json(200, { request: data });
}
