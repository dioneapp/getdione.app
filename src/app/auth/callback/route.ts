import { NextResponse } from "next/server";
import createClient from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // Extract auth code and optional redirect path
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the intended path or fallback to homepage
      return NextResponse.redirect(`${origin}`);
    }

    console.error("Error exchanging code for session", error);
  }
  
  // Redirect to error page if code is missing or exchange fails
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}