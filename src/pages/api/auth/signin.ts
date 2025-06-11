export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../utils/database";
import type { Provider } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const provider = formData.get("provider")?.toString();
  const isAppLogin = formData.get("app") === "true";

  const validProviders = ["google", "github", "discord"];

  if (provider && validProviders.includes(provider)) {
    const redirectUrl = isAppLogin ? `${new URL(request.url).origin}/api/auth/callback?app=true` : `${new URL(request.url).origin}/api/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: redirectUrl,
    },
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return redirect(data.url);
  }

  return new Response("Invalid provider", { status: 400 });
};
