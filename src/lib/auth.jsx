import { createContext, useContext, useEffect, useState } from "react";
import { supabase, isLive } from "./supabase.js";

const AuthCtx = createContext({ user: null, isAdmin: false, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLive) {
      setLoading(false);
      return;
    }
    let mounted = true;

    async function resolveAdmin(sessionUser) {
      if (!sessionUser) return false;
      const { data } = await supabase
        .from("admins")
        .select("id")
        .eq("id", sessionUser.id)
        .maybeSingle();
      return Boolean(data);
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      if (!mounted) return;
      setUser(u);
      setIsAdmin(await resolveAdmin(u));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setIsAdmin(await resolveAdmin(u));
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });
  const signUp = (email, password) => supabase.auth.signUp({ email, password });
  const signOut = () => supabase.auth.signOut();

  return (
    <AuthCtx.Provider value={{ user, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
