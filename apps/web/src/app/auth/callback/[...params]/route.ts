import { NextResponse } from "next/server";
import createClient from "@/utils/supabase/server";

export async function GET(
	request: Request,
	context: { params: { params: string[] } },
) {
	const { searchParams, origin } = new URL(request.url);
	const real = await context.params;

	const isApp = real.params.includes("app");
	const code = searchParams.get("code");

	if (code) {
		const supabase = await createClient();

		// Exchange the auth code for a session
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			// Redirect to the intended path or fallback to homepage
			const encodedAccessToken = encodeURIComponent(data.session.access_token);
			const encodedRefreshToken = encodeURIComponent(
				data.session.refresh_token,
			);
			const redirectUrl = isApp
				? `dione://auth=${encodedAccessToken}${encodedRefreshToken ? `&refresh=${encodedRefreshToken}` : ""}`
				: `${origin}/profile`;

			return NextResponse.redirect(redirectUrl);
		}

		console.error("Error exchanging code for session", error);
	}

	// Redirect to error page if code is missing or exchange fails
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
