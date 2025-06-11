import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL as string || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY as string || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error(
		"Please provide SUPABASE_URL and SUPABASE_KEY in your .env file",
	);
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		flowType: "pkce",
	},
});
