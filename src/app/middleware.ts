import { createSupabaseReqResClient } from "@/utils/supabase/server-client";
import { type NextRequest, NextResponse } from "next/server";

// protected routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/moderation"];

// routes that require moderator access
const MODERATOR_ROUTES = ["/moderation"];

export async function middleware(request: NextRequest) {
	const response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = await createSupabaseReqResClient(request, response);
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	// handle auth errors
	if (error) {
		console.error("Auth error:", error);
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	// check if route requires authentication
	const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
		request.nextUrl.pathname.startsWith(route),
	);

	if (isProtectedRoute && !user) {
		// redirect to login with return url
		const returnUrl = encodeURIComponent(request.nextUrl.pathname);
		return NextResponse.redirect(
			new URL(`/auth/login?returnUrl=${returnUrl}`, request.url),
		);
	}

	// check if route requires moderator access
	const isModeratorRoute = MODERATOR_ROUTES.some((route) =>
		request.nextUrl.pathname.startsWith(route),
	);

	if (isModeratorRoute && user) {
		try {
			const { data: profile } = await supabase
				.from("users")
				.select("moderator")
				.eq("id", user.id)
				.single();

			if (!profile?.moderator) {
				return NextResponse.redirect(new URL("/", request.url));
			}
		} catch (error) {
			console.error("Moderator check error:", error);
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	return response;
}

export const config = {
	matcher: ["/", "/profile"],
};
