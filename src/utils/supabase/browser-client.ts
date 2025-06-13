import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_KEY!,
		{
			auth: {
				autoRefreshToken: true,
				persistSession: true,
				flowType: "pkce",
				detectSessionInUrl: true,
			},
		},
	);
}
