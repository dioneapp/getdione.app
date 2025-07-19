import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export default async function updateSession(request: NextRequest) {
    const res = NextResponse.next();

    // Initialize Supabase server client with custom cookie handling
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
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

    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};