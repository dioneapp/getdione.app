import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY as string;

// create a mock client when supabase credentials are not provided
const mockClient = {
	auth: {
		getSession: async () => ({ data: { session: null }, error: null }),
		getUser: async () => ({ data: { user: null }, error: null }),
		signInWithOAuth: async () => ({
			data: null,
			error: new Error("Supabase not configured"),
		}),
		signOut: async () => ({ error: null }),
		setSession: async () => ({ error: null }),
	},
	from: () => ({
		select: () => ({
			order: () => ({
				limit: () => Promise.resolve({ data: [], error: null }),
			}),
		}),
	}),
};

// use real client if credentials are provided, otherwise use mock
export const supabase =
	supabaseUrl && supabaseKey
		? createClient(supabaseUrl, supabaseKey, {
				auth: {
					autoRefreshToken: true,
					persistSession: true,
				},
			})
		: mockClient;
