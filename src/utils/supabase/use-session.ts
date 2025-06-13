"use client";

import type { AuthSession } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./browser-client";

export default function useSession() {
	const supabase = createSupabaseBrowserClient();
	const [session, setSession] = useState<AuthSession | null>(null);
	const [loadingSession, setLoadingSession] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setLoadingSession(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	return { session, loadingSession };
}
