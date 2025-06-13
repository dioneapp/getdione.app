"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./browser-client";
import type { AuthSession, User } from "@supabase/supabase-js";
import type { ExtendedUser } from "@/types/database";

interface SessionState {
  session: AuthSession | null;
  user: User | null;
  profile: ExtendedUser | null;
  isLoading: boolean;
  error: Error | null;
}

export default function useSession(): SessionState {
  const supabase = createSupabaseBrowserClient();
  const [sessionState, setSessionState] = useState<SessionState>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    error: null,
  });

  const handleUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error?.code === "PGRST116") {
        const newProfile = {
          id: userId,
          username: userId.split("@")[0] || "user",
          first_name: "",
          bio: "",
          location: "",
          avatar_url: null,
        };

        const { data: createdProfile } = await supabase
          .from("users")
          .insert(newProfile)
          .select()
          .single();

        return createdProfile;
      }

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error("Profile error:", error);
      throw error instanceof Error ? error : new Error("Profile operation failed");
    }
  };

  const updateSessionState = async (session: AuthSession | null) => {
    try {
      if (!session?.user) {
        return {
          session: null,
          user: null,
          profile: null,
          isLoading: false,
          error: null,
        };
      }

      let profile = await handleUserProfile(session.user.id);

      const authAvatar = session.user.user_metadata?.avatar_url;
      if (authAvatar && profile?.avatar_url !== authAvatar) {
        const { data: updatedProfile } = await supabase
          .from("users")
          .update({ avatar_url: authAvatar })
          .eq("id", session.user.id)
          .select()
          .single();
        
        profile = updatedProfile || profile;
      }

      return {
        session,
        user: session.user,
        profile: profile ? { ...session.user, ...profile } : null,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      return {
        session: session,
        user: session?.user || null,
        profile: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error("Session update failed"),
      };
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!isActive) return;

        const newState = await updateSessionState(session);
        if (isActive) setSessionState(newState);
      } catch (error) {
        if (isActive) {
          setSessionState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error("Initial session failed"),
          }));
        }
      }
    };

    loadInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isActive) return;
        const newState = await updateSessionState(session);
        if (isActive) setSessionState(newState);
      }
    );

    return () => {
      isActive = false;
      subscription?.unsubscribe();
    };
  }, []);

  return sessionState;
}