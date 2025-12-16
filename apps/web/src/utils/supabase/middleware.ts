import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export default async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	// Initialize Supabase server client with custom cookie handling
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll: () => request.cookies.getAll(),
				setAll: (
					cookiesToSet: { name: string; value: string; options?: any }[],
				) => {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);

					// Re-create the response with updated cookies
					supabaseResponse = NextResponse.next({ request });

					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	// Fetch the current authenticated user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const path = request.nextUrl.pathname;

	// Redirect unauthenticated users to login, except for auth routes
	if (!user && !path.startsWith("/auth/login")) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth/login";
		return NextResponse.redirect(url);
	}

	// Prevent authenticated users from accessing the login page
	if (user && path.startsWith("/auth/login")) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
