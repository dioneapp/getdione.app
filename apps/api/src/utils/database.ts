import { createClient } from "@supabase/supabase-js";
import type { Context } from "hono";

let supabase: ReturnType<typeof createClient> | null = null;

export const initializeSupabase = (c: Context) => {
	if (!supabase) {
		const supabaseUrl = c.env.SUPABASE_URL;
		const supabaseKey = c.env.SUPABASE_ANON_KEY;
		supabase = createClient(supabaseUrl, supabaseKey);
	}
	return supabase;
};
