import { json, requireAdmin } from "@/lib/auth/admin-api";

async function getCount(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], table: string) {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const [events, jobs, communityRegistrations, waitlist, clientInquiries, accountDeletionRequests] =
    await Promise.all([
      getCount(auth.supabase, "events"),
      getCount(auth.supabase, "jobs"),
      getCount(auth.supabase, "community_registrations"),
      getCount(auth.supabase, "waitlist"),
      getCount(auth.supabase, "client_inquiries"),
      getCount(auth.supabase, "account_deletion_requests"),
    ]);

  return json(200, {
    metrics: {
      events,
      jobs,
      communityRegistrations,
      waitlist,
      clientInquiries,
      accountDeletionRequests,
    },
  });
}
