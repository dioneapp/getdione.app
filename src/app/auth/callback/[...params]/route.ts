import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { params: string[] } }) {
	const { searchParams, origin } = new URL(request.url);
	const realParams = await params;
	const pathSegments = realParams.params; 
	
	const isApp = pathSegments.includes("app");
	const code = searchParams.get("code");

	if (code) {
		const supabase = await createSupabaseServerClient();

		const {
			data: { session },
			error,
		} = await supabase.auth.exchangeCodeForSession(code);

		if (!error && session?.user) {
			try {
				// check if user profile exists
				const { data: profile } = await supabase
					.from("users")
					.select("avatar_url")
					.eq("id", session.user.id)
					.single();

				// if profile exists and avatar_url is different from auth metadata, update it
				if (
					profile &&
					profile.avatar_url !== session.user.user_metadata?.avatar_url
				) {
					await supabase
						.from("users")
						.update({ avatar_url: session.user.user_metadata?.avatar_url })
						.eq("id", session.user.id);
				}
			} catch (error) {
				console.error("Error syncing avatar:", error);
			}

			const encodedAccessToken = encodeURIComponent(session.access_token);
			const encodedRefreshToken = encodeURIComponent(session.refresh_token);
			const redirectUrl = isApp ? `dione://auth=${encodedAccessToken}${encodedRefreshToken ? `&refresh=${encodedRefreshToken}` : ""}` : `${origin}/profile`;

			return NextResponse.redirect(redirectUrl);
		}
	}

	return NextResponse.redirect(`${origin}/auth/auth-error`);
}
