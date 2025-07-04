import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// create mock client when supabase credentials are not provided
const mockClient = {
	from: () => ({
		select: () => ({
			order: () => ({
				limit: () => Promise.resolve({ data: [], error: null }),
			}),
		}),
	}),
	auth: {
		getSession: async () => ({
			data: { session: null },
			error: null,
		}),
		onAuthStateChange: (callback: any) => ({
			data: {
				subscription: {
					unsubscribe: () => {},
				},
			},
		}),
	},
} as unknown as SupabaseClient;

// use real client if credentials are provided, otherwise use mock
export const supabase =
	process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_KEY
		? createBrowserClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL,
				process.env.NEXT_PUBLIC_SUPABASE_KEY,
			)
		: mockClient;
