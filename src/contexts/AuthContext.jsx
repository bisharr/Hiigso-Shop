import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

async function fetchUserProfile(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Profile fetch error:", error.message);
    return null;
  }

  return data;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function bootstrapAuth() {
    try {
      setLoading(true);

      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error.message);
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user?.id) {
        const foundProfile = await fetchUserProfile(currentSession.user.id);
        setProfile(foundProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Bootstrap auth error:", error);
      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrapAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (!newSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      setTimeout(async () => {
        try {
          const foundProfile = await fetchUserProfile(newSession.user.id);
          setProfile(foundProfile);
        } catch (error) {
          console.error("Deferred profile fetch error:", error);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signUp(values) {
    const { email, password, fullName } = values;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    return { data, error };
  }

  async function signIn(values) {
    const { email, password } = values;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      setUser(null);
      setProfile(null);
    }
    return { error };
  }

  async function refreshProfile() {
    if (!user?.id) return null;
    const foundProfile = await fetchUserProfile(user.id);
    setProfile(foundProfile);
    return foundProfile;
  }

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
    }),
    [session, user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
