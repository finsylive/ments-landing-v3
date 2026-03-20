# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at localhost:3000
npm run build      # production build (also runs next-sitemap postbuild)
npm run start      # serve production build
npm run lint       # ESLint via next lint
npx tsc --noEmit   # type-check without emitting (no test suite exists)
```

> **Note:** `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`, so `npm run build` will succeed even with type/lint errors. Use `npx tsc --noEmit` to catch type errors manually. Two pre-existing errors in `components/ui/calendar.tsx` and `components/ui/sidebar.tsx` can be ignored — they are from the shadcn/ui scaffold and unrelated to application code.

## Required environment variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=          # used by middleware CORS allow-list in production
CORS_ALLOWED_ORIGINS=          # optional comma-separated override
```

## Architecture

### Stack
- **Next.js 15** App Router — all pages use the `app/` directory convention.
- **Tailwind CSS** + **shadcn/ui** (`components/ui/`) for primitives.
- **Framer Motion** for all animations — used in every section component.
- **Supabase** for both the database and OAuth authentication.

### Request lifecycle
Every request goes through `middleware.ts` (at the project root), which in order: handles CORS preflight, applies per-IP rate limiting (in-memory, per Edge isolate), refreshes the Supabase session cookie, enforces auth guards, and attaches security headers. Protected API routes: `/api/referral`, `/api/account/delete`. Protected page routes: `/dashboard`.

### Supabase client split
There are two parallel Supabase setups — prefer the SSR-aware ones:
- `lib/supabase/client.ts` — `createBrowserClient` for Client Components
- `lib/supabase/server.ts` — `createServerClient` for Server Components / Route Handlers

Legacy files `lib/supabase.ts` and `lib/supabaseClient.ts` exist as well (used by events and community pages) but are not SSR-aware.

### Auth
`contexts/auth-context.tsx` exposes `useAuth()` which provides `user`, `session`, `signInWithGoogle`, `signInWithGithub`, and `signOut`. The provider wraps the entire app via `app/layout.tsx`. OAuth callback lands at `/auth/callback`.

### Layout shell
`app/layout.tsx` wraps every page with `<Navbar />`, `<Footer />`, and `<Toaster />` inside `<BodyContent>`. `BodyContent` suppresses hydration mismatches by deferring render until after client mount — it returns `null` on the server. This means the entire app is effectively client-rendered.

### Homepage composition
`app/page.tsx` composes four sections in order:
1. `HeroSection` — animated headline + character illustration with gradient blobs
2. `FeaturesSection` (`ModernAudienceSection`) — three audience cards (Talent / Founders / Investors) with `whileInView` stagger
3. `HorizontalCarousel` — infinite-loop app screen previews (triple-clone technique, auto-scrolls every 3.5 s, pauses on hover)
4. `WhatsAppCTA` — community join prompt

### Poppins font duplication
The layout loads Poppins as a **local font** (`public/fonts/`) for the entire app. Several components also call `Poppins()` from `next/font/google` individually. The local font always wins since it is applied on `<body>`. The per-component calls are redundant but harmless.

### Supabase database (community registrations)
The `community_registrations` table is the primary data store. Its schema is defined in `supabase-community-schema.sql` and documented in `SUPABASE_SETUP.md`. RLS is enabled; anonymous inserts are allowed, reads require auth or admin. The `lib/supabase.ts` helper functions (`submitCommunityRegistration`, `getAllRegistrations`, etc.) are the primary interface.

### Events page
`app/events/page.tsx` is a Client Component that fetches the live event from Supabase (`events` table, single active row) and hardcodes past events inline. Registration flows to `app/events/registration/page.tsx`.

### Animations pattern
- **Hero section**: `initial`/`animate` (runs on mount, not on scroll).
- **All other sections**: `initial`/`whileInView` with `viewport={{ once: true }}` so they trigger once as they enter the viewport. Cards use a `custom` prop + variant function for staggered delays.
- Ease values in variant functions must be typed `as const` (e.g., `"easeOut" as const`) to satisfy framer-motion's `Easing` type.
