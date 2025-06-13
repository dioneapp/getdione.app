"use client";

import type { ExtendedUser } from "@/types/database";
import type { AuthSession, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./browser-client";

// session state interface
interface SessionState {
	session: AuthSession | null;
	user: User | null;
	profile: ExtendedUser | null;
	loadingSession: boolean;
	error: Error | null;
}

export default function useSession() {
	const supabase = createSupabaseBrowserClient();
	const [state, setState] = useState<SessionState>({
		session: null,
		user: null,
		profile: null,
		loadingSession: true,
		error: null,
	});

	// fetch profile data
	const fetchProfile = async (userId: string) => {
		try {
			const { data: profile, error: profileError } = await supabase
				.from("users")
				.select("*")
				.eq("id", userId)
				.single();

			if (profileError && profileError.code === "406") {
				// create new profile if it doesn't exist
				const { data: newProfile, error: createError } = await supabase
					.from("users")
					.insert([
						{
							id: userId,
							username: userId.split("@")[0] || "user",
							first_name: "",
							bio: "",
							location: "",
							avatar_url: null,
						},
					])
					.select()
					.single();

				if (createError) throw createError;
				return newProfile;
			} else if (profileError) {
				throw profileError;
			}

			return profile;
		} catch (error) {
			console.error("Error fetching profile:", error);
			throw error;
		}
	};

	useEffect(() => {
		let mounted = true;

		// initial session check
		const initializeSession = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();
				if (error) throw error;

				if (!mounted) return;

				if (session?.user) {
					const profile = await fetchProfile(session.user.id);
					if (!mounted) return;

					// sync avatar if needed
					const authAvatarUrl = session.user.user_metadata?.avatar_url;
					if (authAvatarUrl && profile.avatar_url !== authAvatarUrl) {
						const { data: updatedProfile, error: updateError } = await supabase
							.from("users")
							.update({ avatar_url: authAvatarUrl })
							.eq("id", session.user.id)
							.select()
							.single();

						if (!updateError && updatedProfile) {
							setState((prev) => ({
								...prev,
								session,
								user: session.user,
								profile: { ...session.user, ...updatedProfile },
								loadingSession: false,
							}));
							return;
						}
					}

					setState((prev) => ({
						...prev,
						session,
						user: session.user,
						profile: { ...session.user, ...profile },
						loadingSession: false,
					}));
				} else {
					setState((prev) => ({
						...prev,
						session,
						user: null,
						profile: null,
						loadingSession: false,
					}));
				}
			} catch (error) {
				if (!mounted) return;
				setState((prev) => ({
					...prev,
					error:
						error instanceof Error ? error : new Error("Failed to get session"),
					loadingSession: false,
				}));
			}
		};

		initializeSession();

		// subscribe to auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (!mounted) return;

			try {
				if (session?.user) {
					const profile = await fetchProfile(session.user.id);
					if (!mounted) return;

					// sync avatar if needed
					const authAvatarUrl = session.user.user_metadata?.avatar_url;
					if (authAvatarUrl && profile.avatar_url !== authAvatarUrl) {
						const { data: updatedProfile, error: updateError } = await supabase
							.from("users")
							.update({ avatar_url: authAvatarUrl })
							.eq("id", session.user.id)
							.select()
							.single();

						if (!updateError && updatedProfile) {
							setState((prev) => ({
								...prev,
								session,
								user: session.user,
								profile: { ...session.user, ...updatedProfile },
								loadingSession: false,
							}));
							return;
						}
					}

					setState((prev) => ({
						...prev,
						session,
						user: session.user,
						profile: { ...session.user, ...profile },
						loadingSession: false,
					}));
				} else {
					setState((prev) => ({
						...prev,
						session,
						user: null,
						profile: null,
						loadingSession: false,
					}));
				}
			} catch (error) {
				if (!mounted) return;
				setState((prev) => ({
					...prev,
					error:
						error instanceof Error
							? error
							: new Error("Failed to update session"),
					loadingSession: false,
				}));
			}
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);

	return state;
}
