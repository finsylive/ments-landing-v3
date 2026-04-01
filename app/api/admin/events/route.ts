import { json, requireAdmin } from "@/lib/auth/admin-api";

const ALLOWED_EVENT_STATUSES = new Set([
  "draft",
  "published",
  "completed",
  "cancelled",
  "archived",
]);

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const { data, error } = await auth.supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) return json(500, { error: error.message });
  return json(200, { events: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const body = await request.json();
  const {
    title,
    description,
    date,
    location,
    duration,
    mode,
    status,
    poster_url,
    About,
    Who_Should_Participate,
    Why_Participate,
    Event_Flow,
    Judging_Criteria,
    Prizes_Benefits,
  } = body ?? {};

  if (!title || !date) {
    return json(400, { error: "title and date are required" });
  }
  if (status && !ALLOWED_EVENT_STATUSES.has(status)) {
    return json(400, { error: "Invalid event status" });
  }

  const { data, error } = await auth.supabase
    .from("events")
    .insert({
      title,
      description: description || null,
      date,
      location: location || null,
      duration: duration || null,
      mode: mode || null,
      status: status || "draft",
      poster_url: poster_url || null,
      About: About || null,
      Who_Should_Participate: Who_Should_Participate || null,
      Why_Participate: Why_Participate || null,
      Event_Flow: Event_Flow || null,
      Judging_Criteria: Judging_Criteria || null,
      Prizes_Benefits: Prizes_Benefits || null,
    })
    .select("*")
    .single();

  if (error) return json(500, { error: error.message });
  return json(201, { event: data });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const body = await request.json();
  const { id, ...updates } = body ?? {};

  if (!id) return json(400, { error: "id is required" });
  if (updates.status && !ALLOWED_EVENT_STATUSES.has(updates.status)) {
    return json(400, { error: "Invalid event status" });
  }

  const { data, error } = await auth.supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return json(500, { error: error.message });
  return json(200, { event: data });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return json(400, { error: "id is required" });

  const { error } = await auth.supabase.from("events").delete().eq("id", id);
  if (error) return json(500, { error: error.message });

  return json(200, { success: true });
}
