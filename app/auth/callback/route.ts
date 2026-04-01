import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Only allow redirects to relative paths within our own app.
 * This prevents open-redirect attacks where an attacker crafts a callback URL
 * like ?next=https://evil.com and steals the session after login.
 */
function getSafeRedirectPath(raw: string | null): string {
  if (!raw) return "/";
  // Must start with "/" and must NOT start with "//" (protocol-relative URL)
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));
  const profileTypeRaw = searchParams.get("ptype");
  const allowedProfileTypes = new Set(["founder", "investor", "mentor", "member"]);
  const profileType = profileTypeRaw && allowedProfileTypes.has(profileTypeRaw) ? profileTypeRaw : "founder";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email ?? null,
            profile_type: profileType,
          },
          { onConflict: "id" }
        );
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
