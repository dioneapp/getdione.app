import type { AuthError, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./database";

export default function useUser() {
	const [user, setUser] = useState<any | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<AuthError | null>(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();
				if (error) throw error;

				if (session) {
					setSession(session);
					const { data, error } = await supabase
						.from("users")
						.select("*")
						.eq("id", session.user.id)
						.single();
					if (error) throw error;
					setUser(data);
				}
			} catch (error) {
				setError(error as AuthError);
			} finally {
				setLoading(false);
			}
		}
		fetchUser();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_OUT") {
					setUser(null);
					setSession(null);
				}
			},
		);
		return () => {
			listener.subscription.unsubscribe();
		};
	}, [supabase]);

	return { loading, error, session, user };
}
