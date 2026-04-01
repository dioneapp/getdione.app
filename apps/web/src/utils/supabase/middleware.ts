import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export default async function updateSession(request: NextRequest) {
	const supabaseResponse = NextResponse.next({ request });

	// Initialize Supabase server client with custom cookie handling
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{},
	);

	return supabaseResponse;
}
