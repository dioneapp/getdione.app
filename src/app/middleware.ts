import { createSupabaseReqResClient } from "@/utils/supabase/server-client";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = await createSupabaseReqResClient(request, response);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// protects the "/account" route and its sub-routes
	if (!user && request.nextUrl.pathname.startsWith("/profile")) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return response;
}

export const config = {
	matcher: ["/", "/profile"],
};
