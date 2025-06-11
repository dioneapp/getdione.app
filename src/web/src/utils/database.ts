import { type SupabaseClient, createClient } from "@supabase/supabase-js";

// create mock client when supabase credentials are not provided
const mockClient = {
	from: () => ({
		select: () => ({
			order: () => ({
				limit: () => Promise.resolve({ data: [], error: null }),
			}),
		}),
	}),
} as unknown as SupabaseClient;

// use real client if credentials are provided, otherwise use mock
export const supabase =
	process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_KEY
		? createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL,
				process.env.NEXT_PUBLIC_SUPABASE_KEY,
			)
		: mockClient;
