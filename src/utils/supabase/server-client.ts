import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

// server component can only get cookies and not set them, hence the "component" check
export async function createSupabaseServerClient(component = false) {
	const cookieStore = await cookies();
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					if (component) return;
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options),
					);
				},
			},
		},
	);
}

export async function createSupabaseServerComponentClient() {
	const cookieStore = await cookies();
	cookieStore.getAll();
	return createSupabaseServerClient(true);
}

export async function createSupabaseReqResClient(
	req: NextRequest,
	res: NextResponse,
) {
	const cookieStore = await cookies();
	cookieStore.getAll();
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return req.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						res.cookies.set(name, value, options),
					);
				},
			},
		},
	);
}
