import { createSupabaseReqResClient } from "@/utils/supabase/server-client";
import { type NextRequest, NextResponse } from "next/server";

// protected routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/moderation"];

// routes that require moderator access
const MODERATOR_ROUTES = ["/moderation"];

// routes that should redirect to home if already logged in
const AUTH_ROUTES = ["/auth/login"];

export async function middleware(request: NextRequest) {
	const response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	try {
		const supabase = await createSupabaseReqResClient(request, response);
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		// handle auth errors
		if (userError) {
			console.error("Auth error:", userError);
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}

		const pathname = request.nextUrl.pathname;

		// redirect to home if trying to access auth routes while logged in
		if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && user) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		// check if route requires authentication
		const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
			pathname.startsWith(route),
		);

		if (isProtectedRoute && !user) {
			// redirect to login with return url
			const returnUrl = encodeURIComponent(pathname);
			return NextResponse.redirect(
				new URL(`/auth/login?returnUrl=${returnUrl}`, request.url),
			);
		}

		// check if route requires moderator access
		const isModeratorRoute = MODERATOR_ROUTES.some((route) =>
			pathname.startsWith(route),
		);

		if (isModeratorRoute && user) {
			try {
				const { data: profile, error: profileError } = await supabase
					.from("users")
					.select("moderator")
					.eq("id", user.id)
					.single();

				if (profileError) throw profileError;

				if (!profile?.moderator) {
					return NextResponse.redirect(new URL("/", request.url));
				}
			} catch (error) {
				console.error("Moderator check error:", error);
				return NextResponse.redirect(new URL("/", request.url));
			}
		}

		return response;
	} catch (error) {
		console.error("Middleware error:", error);
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}
}

export const config = {
	matcher: [
		"/",
		"/profile/:path*",
		"/moderation/:path*",
		"/auth/login",
		"/api/auth/callback",
	],
};
