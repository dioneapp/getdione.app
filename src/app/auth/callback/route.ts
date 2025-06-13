import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const returnUrl = searchParams.get("returnUrl") ?? "/";

	if (code) {
		const supabase = await createSupabaseServerClient();

		const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error && session?.user) {
			try {
				// check if user profile exists
				const { data: profile } = await supabase
					.from("users")
					.select("avatar_url")
					.eq("id", session.user.id)
					.single();

				// if profile exists and avatar_url is different from auth metadata, update it
				if (profile && profile.avatar_url !== session.user.user_metadata?.avatar_url) {
					await supabase
						.from("users")
						.update({ avatar_url: session.user.user_metadata?.avatar_url })
						.eq("id", session.user.id);
				}
			} catch (error) {
				console.error("Error syncing avatar:", error);
			}

			return NextResponse.redirect(`${origin}${decodeURIComponent(returnUrl)}`);
		}
	}

	// TODO: Create this page
	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-error`);
}
