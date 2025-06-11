import type { APIRoute } from "astro";
import { supabase } from "../../../utils/database";

export const GET: APIRoute = async ({ cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return new Response("No access token or refresh token", { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify(data.user), { status: 200 });
};