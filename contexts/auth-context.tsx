"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: (redirectTo?: string, profileType?: string) => Promise<void>;
  signInWithGithub: (redirectTo?: string, profileType?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = async (redirectTo?: string, profileType?: string) => {
    const callbackSearch = new URLSearchParams();
    if (redirectTo) callbackSearch.set("next", redirectTo);
    if (profileType) callbackSearch.set("ptype", profileType);
    const redirectUrl = `${window.location.origin}/auth/callback${
      callbackSearch.toString() ? `?${callbackSearch.toString()}` : ""
    }`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });
  };

  const signInWithGithub = async (redirectTo?: string, profileType?: string) => {
    const callbackSearch = new URLSearchParams();
    if (redirectTo) callbackSearch.set("next", redirectTo);
    if (profileType) callbackSearch.set("ptype", profileType);
    const redirectUrl = `${window.location.origin}/auth/callback${
      callbackSearch.toString() ? `?${callbackSearch.toString()}` : ""
    }`;
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: redirectUrl },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signInWithGoogle, signInWithGithub, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
