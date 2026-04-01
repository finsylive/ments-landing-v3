import type { User } from "@supabase/supabase-js";

export const ADMIN_ROLES = new Set(["admin", "super_admin"]);

function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  return email.trim().toLowerCase();
}

export function getAdminAllowList(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || "";
  return new Set(
    raw
      .split(",")
      .map((email) => normalizeEmail(email))
      .filter((email): email is string => Boolean(email))
  );
}

export function isAdminUser(user: User | null): boolean {
  if (!user) return false;

  const appRole = user.app_metadata?.role;
  if (typeof appRole === "string" && ADMIN_ROLES.has(appRole)) {
    return true;
  }

  const userRole = user.user_metadata?.role;
  if (typeof userRole === "string" && ADMIN_ROLES.has(userRole)) {
    return true;
  }

  const email = normalizeEmail(user.email);
  if (!email) return false;

  return getAdminAllowList().has(email);
}
