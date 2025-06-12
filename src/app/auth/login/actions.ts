"use server";

import { supabase } from "@/utils/database";
import type { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function loginWithOAuth(provider: Provider, isAppLogin: boolean) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: isAppLogin
        ? "https://getdione.app/auth/callback?app=true"
        : "https://getdione.app/auth/callback",
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(data.url);
}