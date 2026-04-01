"use client";

import { useEffect, useState } from "react";

type Metrics = {
  events: number;
  jobs: number;
  communityRegistrations: number;
  waitlist: number;
  clientInquiries: number;
  accountDeletionRequests: number;
};

type EventStatus = "draft" | "published" | "completed" | "cancelled" | "archived";
type AdminEvent = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  description: string | null;
  duration: string | null;
  mode: string | null;
  status: EventStatus;
  poster_url: string | null;
};
type CommunityEntry = { id: string; full_name: string; email: string; status: string };
type WaitlistEntry = { id: string; name: string; email: string; status: string };
type InquiryEntry = { id: string; name: string; email: string; status: string };
type DeletionEntry = { id: string; email: string; status: string };
type AdminUser = { id: string; email: string; profile_type: string; full_name?: string | null };

const emptyMetrics: Metrics = {
  events: 0,
  jobs: 0,
  communityRegistrations: 0,
  waitlist: 0,
  clientInquiries: 0,
  accountDeletionRequests: 0,
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>(emptyMetrics);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [community, setCommunity] = useState<CommunityEntry[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [inquiries, setInquiries] = useState<InquiryEntry[]>([]);
  const [deletions, setDeletions] = useState<DeletionEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [canManageAdmins, setCanManageAdmins] = useState(false);
  const [adminSectionMessage, setAdminSectionMessage] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "super_admin">("admin");
  const [eventEdits, setEventEdits] = useState<Record<string, Partial<AdminEvent>>>({});

  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStatus, setEventStatus] = useState<EventStatus>("draft");
  const [createPosterFile, setCreatePosterFile] = useState<File | null>(null);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overview, eventRes, communityRes, waitlistRes, inquiryRes, deletionRes] =
        await Promise.all([
          fetchJson<{ metrics: Metrics }>("/api/admin/overview"),
          fetchJson<{ events: AdminEvent[] }>("/api/admin/events"),
          fetchJson<{ registrations: CommunityEntry[] }>("/api/admin/community"),
          fetchJson<{ entries: WaitlistEntry[] }>("/api/admin/waitlist"),
          fetchJson<{ inquiries: InquiryEntry[] }>("/api/admin/client-inquiries"),
          fetchJson<{ requests: DeletionEntry[] }>("/api/admin/account-deletions"),
        ]);

      setMetrics(overview.metrics ?? emptyMetrics);
      setEvents(eventRes.events ?? []);
      setCommunity(communityRes.registrations ?? []);
      setWaitlist(waitlistRes.entries ?? []);
      setInquiries(inquiryRes.inquiries ?? []);
      setDeletions(deletionRes.requests ?? []);

      const adminRes = await fetch("/api/admin/users", { cache: "no-store" });
      if (adminRes.ok) {
        const usersJson = (await adminRes.json()) as { users: AdminUser[] };
        setCanManageAdmins(true);
        setAdminSectionMessage(null);
        setAdminUsers(
          (usersJson.users ?? []).filter(
            (u) => u.profile_type === "admin" || u.profile_type === "super_admin"
          )
        );
      } else {
        setCanManageAdmins(false);
        setAdminUsers([]);
        setAdminSectionMessage("Super admin permission required to manage admin accounts.");
      }
    } catch {
      setError("Unable to load admin data. Please verify your admin access.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const createEvent = async () => {
    if (!eventTitle || !eventDate) return;
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: eventTitle,
        date: eventDate,
        location: eventLocation || null,
        description: eventDescription || null,
        status: eventStatus,
      }),
    });
    if (res.ok) {
      const json = (await res.json()) as { event?: { id: string } };
      const createdEventId = json.event?.id;
      if (createdEventId && createPosterFile) {
        await uploadPoster(createdEventId, createPosterFile);
      }
      setEventTitle("");
      setEventDate("");
      setEventLocation("");
      setEventDescription("");
      setEventStatus("draft");
      setCreatePosterFile(null);
      await loadAll();
    }
  };

  const patchStatus = async (
    url: string,
    id: string,
    status: string,
    extra?: Record<string, unknown>
  ) => {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, ...extra }),
    });
    if (res.ok) await loadAll();
  };

  const uploadPoster = async (eventId: string, file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `events/${eventId}/${Date.now()}.${ext}`;
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from("event-posters")
      .upload(filePath, file, { upsert: true });
    if (uploadError) return;
    const { data } = supabase.storage.from("event-posters").getPublicUrl(filePath);
    await patchStatus("/api/admin/events", eventId, "", { poster_url: data.publicUrl });
  };

  const updateEventField = <K extends keyof AdminEvent>(eventId: string, key: K, value: AdminEvent[K]) => {
    setEventEdits((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [key]: value,
      },
    }));
  };

  const saveEventEdits = async (event: AdminEvent) => {
    const updates = eventEdits[event.id];
    if (!updates) return;
    const res = await fetch("/api/admin/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: event.id, ...updates }),
    });
    if (res.ok) {
      setEventEdits((prev) => {
        const next = { ...prev };
        delete next[event.id];
        return next;
      });
      await loadAll();
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail) return;
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newAdminEmail, role: newAdminRole }),
    });
    if (res.ok) {
      setNewAdminEmail("");
      setNewAdminRole("admin");
      await loadAll();
    }
  };

  const removeAdmin = async (email: string) => {
    const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, {
      method: "DELETE",
    });
    if (res.ok) await loadAll();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h1 className="text-3xl font-bold text-primary">Admin Control Center</h1>
      <p className="mt-2 text-sm text-gray-600">
        Manage events, leads, registrations, and moderation workflows from one place.
      </p>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="mt-4 text-sm text-gray-500">Loading admin data...</p> : null}

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Events" value={metrics.events} />
        <MetricCard label="Jobs" value={metrics.jobs} />
        <MetricCard label="Community Registrations" value={metrics.communityRegistrations} />
        <MetricCard label="Waitlist Entries" value={metrics.waitlist} />
        <MetricCard label="Client Inquiries" value={metrics.clientInquiries} />
        <MetricCard label="Deletion Requests" value={metrics.accountDeletionRequests} />
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-semibold">Create Event</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Event title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <input
            className="rounded-md border px-3 py-2"
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
          <select
            className="rounded-md border px-3 py-2"
            value={eventStatus}
            onChange={(e) => setEventStatus(e.target.value as EventStatus)}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
            <option value="archived">archived</option>
          </select>
          <input
            type="file"
            accept="image/*"
            className="rounded-md border px-3 py-2"
            onChange={(e) => setCreatePosterFile(e.target.files?.[0] ?? null)}
          />
          <textarea
            className="rounded-md border px-3 py-2 md:col-span-2"
            placeholder="Event description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </div>
        <button
          onClick={createEvent}
          className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Save Event
        </button>
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-semibold">Recent Events</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {events.slice(0, 10).map((event) => (
            <li key={event.id} className="rounded-md border p-3">
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className="rounded border px-2 py-1"
                  value={eventEdits[event.id]?.title ?? event.title}
                  onChange={(e) => updateEventField(event.id, "title", e.target.value)}
                />
                <input
                  className="rounded border px-2 py-1"
                  type="datetime-local"
                  value={
                    (eventEdits[event.id]?.date as string | undefined) ??
                    new Date(event.date).toISOString().slice(0, 16)
                  }
                  onChange={(e) => updateEventField(event.id, "date", e.target.value)}
                />
                <input
                  className="rounded border px-2 py-1"
                  value={eventEdits[event.id]?.location ?? event.location ?? ""}
                  placeholder="Location"
                  onChange={(e) => updateEventField(event.id, "location", e.target.value)}
                />
                <input
                  className="rounded border px-2 py-1"
                  value={eventEdits[event.id]?.mode ?? event.mode ?? ""}
                  placeholder="Mode"
                  onChange={(e) => updateEventField(event.id, "mode", e.target.value)}
                />
                <input
                  className="rounded border px-2 py-1"
                  value={eventEdits[event.id]?.duration ?? event.duration ?? ""}
                  placeholder="Duration"
                  onChange={(e) => updateEventField(event.id, "duration", e.target.value)}
                />
                <input
                  className="rounded border px-2 py-1"
                  value={eventEdits[event.id]?.poster_url ?? event.poster_url ?? ""}
                  placeholder="Poster URL"
                  onChange={(e) => updateEventField(event.id, "poster_url", e.target.value)}
                />
                <textarea
                  className="rounded border px-2 py-1 md:col-span-2"
                  value={eventEdits[event.id]?.description ?? event.description ?? ""}
                  placeholder="Description"
                  onChange={(e) => updateEventField(event.id, "description", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="rounded border px-2 py-1"
                  value={(eventEdits[event.id]?.status as EventStatus | undefined) ?? event.status}
                  onChange={(e) =>
                    updateEventField(event.id, "status", e.target.value as EventStatus)
                  }
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                  <option value="archived">archived</option>
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadPoster(event.id, file);
                  }}
                  className="text-xs"
                />
                <button
                  onClick={() => saveEventEdits(event)}
                  className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                >
                  Save
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <StatusTable
          title="Community Approvals"
          rows={community.map((r) => ({ id: r.id, title: `${r.full_name} (${r.email})`, status: r.status }))}
          onAction={(id, status) =>
            patchStatus("/api/admin/community", id, status, {
              verification_notes: status === "approved" ? "Approved in admin panel" : "Updated in admin panel",
            })
          }
          statuses={["pending", "verified", "approved", "rejected"]}
        />
        <StatusTable
          title="Waitlist Pipeline"
          rows={waitlist.map((r) => ({ id: r.id, title: `${r.name} (${r.email})`, status: r.status }))}
          onAction={(id, status) => patchStatus("/api/admin/waitlist", id, status)}
          statuses={["pending", "contacted", "qualified", "closed"]}
        />
        <StatusTable
          title="Client Inquiries"
          rows={inquiries.map((r) => ({ id: r.id, title: `${r.name} (${r.email})`, status: r.status }))}
          onAction={(id, status) => patchStatus("/api/admin/client-inquiries", id, status)}
          statuses={["new", "contacted", "in_progress", "completed", "archived"]}
        />
        <StatusTable
          title="Account Deletion Workflow"
          rows={deletions.map((r) => ({ id: r.id, title: r.email, status: r.status }))}
          onAction={(id, status) => patchStatus("/api/admin/account-deletions", id, status)}
          statuses={["pending", "processing", "completed", "cancelled"]}
        />
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-semibold">Super Admin - Admin Access Control</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add or remove admins by email. Changes apply immediately.
        </p>
        {adminSectionMessage ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {adminSectionMessage}
          </p>
        ) : null}
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr,180px,120px]">
          <input
            className="rounded-md border px-3 py-2"
            placeholder="admin@ments.app"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            disabled={!canManageAdmins}
          />
          <select
            className="rounded-md border px-3 py-2"
            value={newAdminRole}
            onChange={(e) => setNewAdminRole(e.target.value as "admin" | "super_admin")}
            disabled={!canManageAdmins}
          >
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </select>
          <button
            onClick={addAdmin}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            disabled={!canManageAdmins}
          >
            Add Admin
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {adminUsers.map((u) => (
            <li key={u.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <span>
                {u.email} - <strong>{u.profile_type}</strong>
              </span>
              <button
                onClick={() => removeAdmin(u.email)}
                className="rounded border px-3 py-1 disabled:opacity-50"
                disabled={!canManageAdmins || u.email?.toLowerCase() === "abhijeet@ments.app"}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusTable({
  title,
  rows,
  onAction,
  statuses,
}: {
  title: string;
  rows: Array<{ id: string; title: string; status: string }>;
  onAction: (id: string, status: string) => void;
  statuses: string[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {rows.slice(0, 8).map((row) => (
          <li key={row.id} className="rounded-md border p-3 text-sm">
            <p className="font-medium">{row.title}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded bg-gray-100 px-2 py-1 text-xs">{row.status}</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                defaultValue=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  onAction(row.id, e.target.value);
                }}
              >
                <option value="" disabled>
                  Update status
                </option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
